import { NextResponse } from 'next/server.js';
import crypto from 'crypto';
import { db } from '../../../lib/db/index.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'ourchem_session';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action = 'signin', email, password } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    let user = await db.findUserByEmail(normalized);

    if (action === 'signup' && !user) {
      user = await db.addWaitlistUser({ email: normalized });
    }

    if (!user) {
      user = await db.addWaitlistUser({ email: normalized });
    }

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      element: user.element,
      createdAt: Date.now(),
    };

    const token = Buffer.from(JSON.stringify(sessionPayload)).toString('base64url');
    const signature = crypto.createHmac('sha256', process.env.NEXTAUTH_SECRET || 'ourchem-secret-prod-salt').update(token).digest('base64url');
    const cookieValue = `${token}.${signature}`;

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        element: user.element,
        queueRank: user.queueRank,
        referralCode: user.referralCode,
      },
    });

    res.cookies.set(SESSION_COOKIE, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (err) {
    console.error('[auth] error:', err);
    return NextResponse.json({ ok: false, error: 'auth_failed' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const cookie = req.cookies.get(SESSION_COOKIE);
    if (!cookie?.value) {
      return NextResponse.json({ authenticated: false });
    }

    const [token, signature] = cookie.value.split('.');
    if (!token || !signature) {
      return NextResponse.json({ authenticated: false });
    }

    const expected = crypto.createHmac('sha256', process.env.NEXTAUTH_SECRET || 'ourchem-secret-prod-salt').update(token).digest('base64url');
    if (signature !== expected) {
      return NextResponse.json({ authenticated: false });
    }

    const payload = JSON.parse(Buffer.from(token, 'base64url').toString('utf-8'));
    return NextResponse.json({ authenticated: true, user: payload });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true, message: 'signed_out' });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}