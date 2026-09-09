import { NextResponse } from 'next/server.js';
import { db } from '../../../lib/db/index.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      vector64,
      acousticHash,
      medianPitch,
      stability,
      warmth = 80,
      resonance = 85,
      email = null,
      userId = null,
    } = body;

    const saved = await db.saveVoicePrint({
      userId,
      email,
      medianPitchHz: medianPitch,
      stabilityScore: stability,
      acousticHash,
      vector64,
      warmth,
      resonance,
    });

    const matches = await db.findAcousticMatches(vector64, 3);

    return NextResponse.json({
      ok: true,
      acousticHash: saved.acousticHash,
      warmth: saved.warmth,
      resonance: saved.resonance,
      matches,
      elementalHarmonic: 'Ignis-Aqua',
      message: '64-D Voice DNA zero-knowledge vector anchored successfully.',
    });
  } catch (err) {
    console.error('[voice-api] error:', err);
    return NextResponse.json({ ok: false, error: 'failed_to_save_voiceprint' }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const hash = searchParams.get('hash');
  return NextResponse.json({
    ok: true,
    protocol: 'Voice DNA 64-D Spectral Yin',
    status: hash ? 'anchored' : 'ready',
    resolutionHz: '0.1Hz',
  });
}