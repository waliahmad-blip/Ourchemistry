/**
 * Zero-Asset Procedural Web Audio Soundscape for ourchemistry.ai
 * Generates celestial ambiences, cardiac pulses, harmonic chimes,
 * and biometric audio feedback purely via mathematical synthesis (0 KB download).
 */

let audioCtx = null;
let masterGain = null;
let isMuted = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

if (typeof window !== 'undefined') {
  const unlock = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  };
  window.addEventListener('pointerdown', unlock, { once: true, passive: true });
  window.addEventListener('keydown', unlock, { once: true, passive: true });
}

export function setSoundMuted(muted) {
  isMuted = muted;
  if (masterGain && audioCtx) {
    masterGain.gain.setTargetAtTime(muted ? 0 : 0.3, audioCtx.currentTime, 0.05);
  }
}

export function isSoundMuted() {
  return isMuted;
}

/**
 * Procedural cardiac heartbeat pulse (sub-bass physical thump)
 * @param {number} intensity - 0.5 to 1.5
 */
export function playHeartPulse(intensity = 1.0) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(75 * intensity, now);
  osc.frequency.exponentialRampToValueAtTime(36, now + 0.18);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.35 * intensity, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.25);

  // Secondary systolic bounce (lub-DUB)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  const now2 = now + 0.14;

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(60 * intensity, now2);
  osc2.frequency.exponentialRampToValueAtTime(32, now2 + 0.14);

  gain2.gain.setValueAtTime(0.001, now2);
  gain2.gain.linearRampToValueAtTime(0.22 * intensity, now2 + 0.02);
  gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.18);

  osc2.connect(gain2);
  gain2.connect(masterGain);

  osc2.start(now2);
  osc2.stop(now2 + 0.22);
}

/**
 * Celestial resonance chime when an orb charges or bonds lock
 * @param {number} freq - Pitch in Hz (e.g. 528Hz, 660Hz, 880Hz)
 */
export function playResonanceChime(freq = 528) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.2, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 1.25);
}

/**
 * Crystalline shimmer spark on chemistry fusion
 */
export function playFusionSpark() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [528, 660, 792, 1056];
  notes.forEach((f, idx) => {
    const now = ctx.currentTime + idx * 0.06;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.65);
  });
}

/**
 * Cryptographic Vanish shredding sound effect
 */
export function playVanishShred() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.45);
}
