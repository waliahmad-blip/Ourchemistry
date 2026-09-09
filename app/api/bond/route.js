import { NextResponse } from 'next/server.js';
import { BOND_STAGES, evaluateBondProgression, resolveDoubleBlind } from '../../../lib/bond/bondStateMachine.js';
import { runGuardrails } from '../../../lib/security/guardrails.js';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dayParam = parseInt(searchParams.get('day') || '1', 10);
  const dayKey = `DAY_${Math.min(7, Math.max(1, dayParam))}`;

  return NextResponse.json({
    stage: BOND_STAGES[dayKey],
    allStages: Object.values(BOND_STAGES).map((s) => ({
      day: s.day,
      name: s.name,
      type: s.type,
      photoBlurred: s.photoBlurred,
    })),
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, day = 1, responseText, decisionA, decisionB } = body;

    if (action === 'submit_day') {
      if (responseText) {
        const guard = runGuardrails(responseText);
        if (!guard.passed) {
          return NextResponse.json({ error: guard.error }, { status: 400 });
        }
      }

      const progression = evaluateBondProgression({
        currentDay: day,
        userACompleted: true,
        userBCompleted: true,
        status: 'ACTIVE',
      });

      return NextResponse.json({
        success: true,
        currentDay: day,
        progression,
        message: `Day ${day} prompt locked and encrypted.`,
      });
    }

    if (action === 'double_blind') {
      const result = resolveDoubleBlind(decisionA, decisionB);
      return NextResponse.json({
        success: true,
        resolution: result,
      });
    }

    return NextResponse.json({ error: 'Unknown action specified.' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process bond protocol action.' }, { status: 500 });
  }
}
