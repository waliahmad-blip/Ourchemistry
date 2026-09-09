import { NextResponse } from 'next/server.js';
import { executeCryptographicVanish } from '../../../lib/security/cryptoVanish.js';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userId = 'anonymous-user', categories = ['voiceprint', 'capsules', 'transcripts', 'profile'] } = body;

    const receipt = executeCryptographicVanish({
      userId,
      entitiesToErase: categories,
    });

    return NextResponse.json({
      success: true,
      message: 'All matching records and biometric vectors zeroized in 60 seconds.',
      receipt,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Cryptographic shredding engine encountered an error.' },
      { status: 500 }
    );
  }
}
