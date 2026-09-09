import { NextResponse } from 'next/server.js';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

/* ------------------------------- persistence ----------------------------
 * Serverless-safe: prefer ./data, fall back to /tmp (the only writable
 * location on Netlify/Vercel functions). If nothing is writable we still
 * answer successfully using the in-memory count. */
const CANDIDATE_FILES = [
  path.join(process.cwd(), 'data', 'waitlist.json'),
  path.join(typeof process.env.TMPDIR === 'string' ? process.env.TMPDIR : '/tmp', 'ourchemistry-waitlist.json'),
];

async function pickWritableFile() {
  for (const file of CANDIDATE_FILES) {
    try {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.access(path.dirname(file), fs.constants.W_OK);
      return file;
    } catch {
      /* try next candidate */
    }
  }
  return null;
}

async function readAll() {
  for (const file of CANDIDATE_FILES) {
    try {
      const raw = await fs.readFile(file, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.count === 'number' && Array.isArray(parsed.emails)) {
        if (!Array.isArray(parsed.members)) parsed.members = [];
        return parsed;
      }
    } catch {
      /* not here, try next */
    }
  }
  return { count: START_COUNT, emails: [], members: [] };
}

async function writeAll(data) {
  const file = await pickWritableFile();
  if (!file) throw new Error('no writable storage location');
  const tmp = file + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tmp, file); // atomic write
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

function generateRefCode() {
  return 'OU-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

const ELEMENTS = ['Aqua', 'Ignis', 'Terra', 'Ventus'];

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

  const referralBy = typeof body.referralBy === 'string' ? body.referralBy.trim().toUpperCase() : null;

  try {
    const data = await readAll();
    let member = data.members.find((m) => m.email === email);

    if (!member) {
      data.count += 1;
      const assignedRefCode = generateRefCode();
      const assignedElement = ELEMENTS[data.count % ELEMENTS.length];

      member = {
        email,
        refCode: assignedRefCode,
        referredBy: referralBy || null,
        referralCount: 0,
        element: assignedElement,
        queueRank: data.count,
        joinedAt: new Date().toISOString(),
      };

      data.emails.push(email);
      data.members.push(member);

      if (referralBy) {
        const referrer = data.members.find((m) => m.refCode === referralBy);
        if (referrer) {
          referrer.referralCount = (referrer.referralCount || 0) + 1;
          referrer.queueRank = Math.max(1, (referrer.queueRank || data.count) - 500);
        }
      }

      try {
        await writeAll(data);
      } catch (persistErr) {
        console.warn('[waitlist] persistence unavailable:', persistErr.message);
      }
    }

    return NextResponse.json({
      ok: true,
      count: data.count,
      refCode: member.refCode,
      elementNo: member.queueRank,
      element: member.element,
      referralCount: member.referralCount || 0,
    });
  } catch (err) {
    console.error('[waitlist] error:', err);
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
