'use client';

import { useId, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Living heartline — clinically believable, never twice the same.
 * Natural features: beat-to-beat HRV (uneven spacing), respiratory
 * baseline wander, rounded P/T waves (Bézier), sharp Q-R-S complex,
 * correlated amplitudes, randomized QRS position per beat.
 */
export default function Heartline({
  width = 640,
  height = 56,
  beats = 5,
  bpm,
  from = '#5eead4',
  to = '#a78bfa',
  className = '',
}) {
  const rawId = useId();
  const id = rawId.replace(/[:]/g, '');
  const reduce = useReducedMotion();

  const { d, tempo, cycle } = useMemo(() => {
    const r = Math.random;
    const h = height;
    const t0 = bpm ?? 62 + Math.floor(r() * 20); // 62–81 bpm each view

    // Respiratory baseline wander — slow drift up/down across the strip
    const wFreq = 0.8 + r() * 0.9;
    const wAmp = h * (0.035 + r() * 0.045);
    const wPhase = r() * Math.PI * 2;
    const wander = (x) => h / 2 + wAmp * Math.sin((x / width) * Math.PI * 2 * wFreq + wPhase);

    // HRV — smooth sinusoidal variation + small jitter, normalized to fill width
    const hb = 1.6 + r() * 0.6;
    const hp = r() * Math.PI * 2;
    const widths = Array.from(
      { length: beats },
      (_, i) => 1 + 0.10 * Math.sin(i * hb + hp) + (r() - 0.5) * 0.08
    );
    const scale = width / widths.reduce((a, b) => a + b, 0);

    let amp = 0.9 + r() * 0.2; // correlated amplitude memory
    let x = 0;
    let path = `M -6 ${wander(0).toFixed(1)}`;

    for (let b = 0; b < beats; b++) {
      const w = widths[b] * scale;
      const at = (frac) => wander(x + w * frac);

      amp = Math.min(1.3, Math.max(0.7, amp + (r() - 0.5) * 0.22));

      const P = h * 0.10 * amp; // P — rounded, small
      const Q = h * 0.06 * amp;
      const R = h * (0.26 + r() * 0.14) * amp; // R — tall, sharp
      const S = h * (0.10 + r() * 0.08) * amp;
      const T = h * (0.12 + r() * 0.05) * amp; // T — rounded, wide

      const q0 = 0.26 + r() * 0.06; // QRS position varies per beat
      const jit = () => (r() - 0.5) * h * 0.02;
      const px = (frac) => (x + w * frac).toFixed(1);
      const py = (frac, off = 0) => (at(frac) + off).toFixed(1);

      // P wave — smooth quadratic bump
      path += ` L ${px(0.08)} ${py(0.08)}`;
      path += ` Q ${px(0.14)} ${py(0.14, -P)} ${px(0.20)} ${py(0.20)}`;
      // brief flat, then sharp Q-R-S
      path += ` L ${px(q0)} ${py(q0)}`;
      path += ` L ${px(q0 + 0.03)} ${py(q0 + 0.03, Q + jit())}`;
      path += ` L ${px(q0 + 0.075)} ${py(q0 + 0.075, -R)}`;
      path += ` L ${px(q0 + 0.12)} ${py(q0 + 0.12, S + jit())}`;
      path += ` L ${px(q0 + 0.17)} ${py(q0 + 0.17)}`;
      // T wave — smooth, wider than P
      path += ` Q ${px(0.60)} ${py(0.60, -T)} ${px(0.72)} ${py(0.72)}`;
      // recover to beat end
      path += ` L ${px(1)} ${py(1)}`;
      x += w;
    }

    path += ` L ${(width + 6).toFixed(1)} ${wander(width).toFixed(1)}`;
    return { d: path, tempo: t0, cycle: beats * (60 / t0) };
  }, [width, height, beats, bpm]);

  return (
    <motion.div
      className={className}
      style={{ width: '100%' }}
      animate={reduce ? undefined : { scale: [1, 1.03, 1, 1.015, 1] }} // lub-dub, then rest
      transition={{ duration: 60 / tempo, times: [0, 0.1, 0.2, 0.32, 1], repeat: Infinity, ease: 'easeOut' }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', overflow: 'visible' }} aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={from} stopOpacity="0.2" />
            <stop offset="0.5" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>

        {/* resting waveform */}
        <path d={d} fill="none" stroke={from} strokeOpacity="0.14" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* monitor sweep */}
        {!reduce && (
          <motion.path
            d={d}
            fill="none"
            stroke={`url(#${id}-g)`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: cycle, repeat: Infinity, ease: 'linear', repeatDelay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 6px ${from}99)` }}
          />
        )}
      </svg>
    </motion.div>
  );
}
