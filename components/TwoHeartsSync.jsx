'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Heartline from './Heartline';

function Sparks({ color }) {
  const parts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
        const d = 34 + Math.random() * 46;
        return { x: Math.cos(a) * d, y: Math.sin(a) * d, s: 2 + Math.random() * 3 };
      }),
    []
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: p.s, height: p.s, background: color, boxShadow: `0 0 8px ${color}` }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

/* Two independent heartlines seek each other, then fuse into one. Loops forever. */
export default function TwoHeartsSync() {
  const reduce = useReducedMotion();
  const [seed, setSeed] = useState(0);
  const [phase, setPhase] = useState('apart'); // apart → approach → fuse

  useEffect(() => {
    if (reduce) return;
    let t;
    if (phase === 'apart') t = setTimeout(() => setPhase('approach'), 3800);
    else if (phase === 'approach') t = setTimeout(() => setPhase('fuse'), 2100);
    else t = setTimeout(() => { setPhase('apart'); setSeed((s) => s + 1); }, 3000);
    return () => clearTimeout(t);
  }, [phase, seed, reduce]);

  const drift = phase === 'apart' ? 56 : 10;

  return (
    <div className="relative mx-auto flex h-[88px] w-full items-center justify-center">
      <motion.div
        key={`l${seed}`}
        className="absolute w-[46%]"
        style={{ left: 0 }}
        animate={{ x: -drift, opacity: phase === 'fuse' ? 0 : 1 }}
        transition={{ duration: phase === 'approach' ? 1.9 : 0.6, ease: 'easeInOut' }}
      >
        <Heartline beats={3} height={54} from="#ff8fb2" to="#ff8fb2" />
      </motion.div>
      <motion.div
        key={`r${seed}`}
        className="absolute w-[46%]"
        style={{ right: 0 }}
        animate={{ x: drift, opacity: phase === 'fuse' ? 0 : 1 }}
        transition={{ duration: phase === 'approach' ? 1.9 : 0.6, ease: 'easeInOut' }}
      >
        <Heartline beats={3} height={54} from="#67e8f9" to="#67e8f9" />
      </motion.div>

      <AnimatePresence>
        {phase === 'fuse' && (
          <motion.div
            className="relative w-full"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Heartline key={`f${seed}`} beats={5} height={60} from="#ff8fb2" to="#67e8f9" />
            <Sparks color="#ffd7a1" />
            <Sparks color="#ffffff" />
          </motion.div>
        )}
      </AnimatePresence>

      <p className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.45em] text-white/35">
        {phase === 'fuse' ? '✦ resonance locked ✦' : 'seeking resonance…'}
      </p>
    </div>
  );
}
