import { NextResponse } from 'next/server.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams, origin } = new URL(req.url);
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (clientId) {
    const redirectUri = `${origin}/api/auth/callback/google`;
    const scope = encodeURIComponent('openid email profile');
    const state = Math.random().toString(36).slice(2);
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&state=${state}`;

    return NextResponse.redirect(googleAuthUrl);
  }

  // Pre-launch / Development fallback: redirect to app with notice
  return NextResponse.redirect(`${origin}/?auth_notice=google_ready`);
}