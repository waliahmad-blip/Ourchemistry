import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATA_FILE = path.join(process.cwd(), 'data', 'waitlist.json');
const START_COUNT = 12847;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_BODY_BYTES = 2048;

/* ---------- naive in-memory rate limiter (per server instance) ---------- */
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const hits = new Map(); // ip -> { count, resetAt }

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    // opportunistic cleanup so the map never grows unbounded
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

/* ------------------------------- persistence ---------------------------- */
async function readAll() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.count !== 'number' || !Array.isArray(parsed.emails)) {
      return { count: START_COUNT, emails: [] };
    }
    return parsed;
  } catch {
    return { count: START_COUNT, emails: [] };
  }
}

async function writeAll(data) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = DATA_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tmp, DATA_FILE); // atomic write
}

function normalizeEmail(raw) {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase().slice(0, 254);
  return EMAIL_RE.test(email) ? email : null;
}

function clientIp(request) {
  const xf = request.headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

/* --------------------------------- routes ------------------------------- */
export async function POST(request) {
  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  let body;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
    }
    body = JSON.parse(text || '{}');
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  try {
    const data = await readAll();
    if (!data.emails.includes(email)) {
      data.emails.push(email);
      data.count += 1;
      await writeAll(data);
    }
    return NextResponse.json({ ok: true, count: data.count });
  } catch (err) {
    console.error('[waitlist] persistence error:', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await readAll();
    return NextResponse.json({ count: data.count });
  } catch (err) {
    console.error('[waitlist] read error:', err);
    return NextResponse.json({ count: START_COUNT });
  }
}
