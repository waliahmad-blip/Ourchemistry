/**
 * Autonomous 7-Day Bond Protocol State Machine for ourchemistry.ai
 *
 * Implements:
 * 1. Sequential daily unlocks (Days 1 to 7)
 * 2. Reciprocal gating (Both users must complete step N before unlocking N+1)
 * 3. Double-blind simultaneous resolution with zero-rejection architecture
 */

export const BOND_STAGES = {
  DAY_1: {
    day: 1,
    name: 'Voice Capsule: The Spark',
    type: 'voice',
    prompt: 'What was a moment this year when you felt completely in your element?',
    timeLimitSeconds: 60,
    photoBlurred: true,
  },
  DAY_2: {
    day: 2,
    name: 'Voice Capsule: Roots & Stillness',
    type: 'voice',
    prompt: 'When everything is quiet at the end of the week, what brings you peace?',
    timeLimitSeconds: 90,
    photoBlurred: true,
  },
  DAY_3: {
    day: 3,
    name: 'Values: Life Architecture',
    type: 'values',
    prompt: 'How do you balance personal ambition with family commitment?',
    photoBlurred: true,
  },
  DAY_4: {
    day: 4,
    name: 'Values: Cultural & Spiritual Rhythm',
    type: 'values',
    prompt: 'What traditions do you cherish, and what new paths do you want to forge?',
    photoBlurred: true,
  },
  DAY_5: {
    day: 5,
    name: 'Resonance Texting',
    type: 'realtime_chat',
    prompt: 'Live ephemeral chat unlocked with cardiac pulse presence.',
    photoBlurred: true,
  },
  DAY_6: {
    day: 6,
    name: 'Reciprocal Portrait Unlock',
    type: 'reciprocal_reveal',
    prompt: 'Both hearts must choose to unblur portraits. Visuals reveal simultaneously.',
    photoBlurred: false,
  },
  DAY_7: {
    day: 7,
    name: 'Double-Blind Resolution',
    type: 'double_blind',
    prompt: 'Choose privately: Extend Bond or Release with Grace.',
    photoBlurred: false,
  },
};

/**
 * Validates whether user A and user B can advance to the next day
 * @param {Object} bondRecord
 * @returns {{ canAdvance: boolean, nextDay: number, reason: string }}
 */
export function evaluateBondProgression(bondRecord) {
  const { currentDay, userACompleted, userBCompleted, status } = bondRecord;

  if (status === 'COMPLETED' || status === 'RELEASED') {
    return { canAdvance: false, nextDay: currentDay, reason: 'Bond protocol already concluded.' };
  }

  if (userACompleted && userBCompleted) {
    if (currentDay < 7) {
      return { canAdvance: true, nextDay: currentDay + 1, reason: 'Reciprocal conditions satisfied.' };
    }
    return { canAdvance: false, nextDay: 7, reason: 'Ready for final Double-Blind Resolution.' };
  }

  const waitingOn = !userACompleted ? 'User A' : 'User B';
  return {
    canAdvance: false,
    nextDay: currentDay,
    reason: `Awaiting submission from ${waitingOn}.`,
  };
}

/**
 * Resolves the Day 7 Double-Blind Decision
 * @param {'EXTEND' | 'RELEASE'} decisionA
 * @param {'EXTEND' | 'RELEASE'} decisionB
 * @returns {{ outcome: 'EXTENDED' | 'RELEASED_GRACEFULLY', publicNotice: string }}
 */
export function resolveDoubleBlind(decisionA, decisionB) {
  if (!decisionA || !decisionB) {
    return {
      outcome: 'PENDING',
      publicNotice: 'Awaiting both reciprocal decisions. Neither choice is revealed.',
    };
  }

  if (decisionA === 'EXTEND' && decisionB === 'EXTEND') {
    return {
      outcome: 'EXTENDED',
      publicNotice: 'Both hearts opted to extend. The 7-Day Bond is now a permanent connection.',
    };
  }

  return {
    outcome: 'RELEASED_GRACEFULLY',
    publicNotice: 'The bond has concluded with honor and mutual grace. No rejection notices are delivered.',
  };
}
