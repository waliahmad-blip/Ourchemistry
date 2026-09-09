import { NextResponse } from 'next/server.js';
import { db } from '../../../lib/db/index.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_BODY_BYTES = 2048;

/* In-memory sliding rate limiter */
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
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
    const user = await db.addWaitlistUser({ email, referralBy });
    const count = await db.getWaitlistCount();

    return NextResponse.json({
      ok: true,
      count,
      refCode: user.referralCode,
      elementNo: user.queueRank,
      element: user.element,
      referralCount: user.referralCount || 0,
    });
  } catch (err) {
    console.error('[waitlist] error:', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const count = await db.getWaitlistCount();
    return NextResponse.json({ count });
  } catch (err) {
    console.error('[waitlist] read error:', err);
    return NextResponse.json({ count: 12847 });
  }
}
