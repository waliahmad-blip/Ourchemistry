import { NextResponse } from 'next/server.js';
import { runGuardrails } from '../../../lib/security/guardrails.js';
import { generateAstraeaReply } from '../../../lib/ai/astraea.js';

export async function POST(req) {
  try {
    const body = await req.json();
    const { message = '', locale = 'en', history = [] } = body;

    const guard = runGuardrails(message);
    if (!guard.passed) {
      return NextResponse.json({
        reply: guard.error || 'Input violates our conversational safety guardrails.',
        model: 'Astraea Sovereign Core',
        safe: false,
        locked: true,
      });
    }

    if (guard.hadPii) {
      return NextResponse.json({
        reply:
          'For your security, contact details and personal identifiers are cryptographically shielded until after your 7-Day Bond Protocol is unlocked.',
        model: 'Astraea Sovereign Core',
        safe: true,
        sanitized: true,
        locked: true,
      });
    }

    const inputToModel = guard.sanitizedInput || message;
    const astraeaResult = await generateAstraeaReply(inputToModel, locale, history);

    return NextResponse.json({
      reply: astraeaResult.reply,
      model: astraeaResult.model || 'Astraea Sovereign Core',
      safe: true,
      locked: true,
      signature: astraeaResult.signature,
    });
  } catch (err) {
    console.error('[Catalyst API] Error:', err);
    return NextResponse.json(
      {
        reply: 'Astraea is calibrating its celestial resonance. Please ask again in a moment.',
        model: 'Astraea Sovereign Core',
        safe: true,
        locked: true,
      },
      { status: 200 }
    );
  }
}

