'use client';

import { motion } from 'framer-motion';
import { BRAND, TAGLINE } from '../lib/config';

/* The first "o" as a living atom — pulsing nucleus, two orbiting electrons */
function AtomO() {
  return (
    <motion.span
      aria-hidden="true"
      className="relative inline-block shrink-0 align-baseline"
      style={{ width: '0.92em', height: '0.92em' }}
    >
      {/* orbit rings */}
      <span className="absolute inset-0 rounded-full border border-white/25" />
      <span className="absolute inset-[22%] rounded-full border border-[#5eead4]/35" />

      {/* nucleus — pulses like a heartbeat */}
      <motion.span
        className="absolute left-1/2 top-1/2 h-[3px] w-[3px] rounded-full bg-white"
        style={{ transform: 'translate(-50%,-50%)', boxShadow: '0 0 6px rgba(255,255,255,0.95)' }}
        animate={{ scale: [1, 1.4, 1, 1.2, 1] }}
        transition={{ duration: 1.1, times: [0, 0.12, 0.24, 0.36, 1], repeat: Infinity }}
      />

      {/* electron 1 — fast, teal */}
      <motion.span
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute left-1/2 top-0 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#5eead4]"
          style={{ boxShadow: '0 0 5px #5eead4' }}
        />
      </motion.span>

      {/* electron 2 — slower, violet, offset ring */}
      <motion.span
        className="absolute inset-[22%]"
        animate={{ rotate: [-180, 180] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute left-1/2 bottom-0 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#a78bfa]"
          style={{ boxShadow: '0 0 5px #a78bfa' }}
        />
      </motion.span>
    </motion.span>
  );
}

export default function BrandMark() {
  return (
    <motion.div
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed left-1/2 top-3 z-[46] -translate-x-1/2 select-none text-center"
    >
      <div className="flex items-center justify-center">
        {/* [atom-o] + rest of the word, with periodic shimmer sweep */}
        <span className="relative inline-flex items-center overflow-hidden">
          <AtomO />
          <span className="font-display text-[15px] font-semibold leading-none tracking-[0.26em] text-white/85 sm:text-[19px]">
            {BRAND.replace(/^o/, '').replace(/\.ai$/, '')}
          </span>
          {/* shimmer */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent mix-blend-screen"
            initial={{ left: '-40%' }}
            animate={{ left: ['-40%', '140%'] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 4.5, ease: 'easeInOut' }}
          />
        </span>

        {/* .ai — beats like a heart */}
        <motion.span
          className="inline-block bg-gradient-to-r from-[#5eead4] via-[#67e8f9] to-[#a78bfa] bg-clip-text font-mono text-[15px] font-semibold leading-none tracking-[0.26em] text-transparent sm:text-[19px]"
          style={{ filter: 'drop-shadow(0 0 9px rgba(94,234,212,0.55))' }}
          animate={{
            scale: [1, 1.08, 1, 1.035, 1],
            filter: [
              'drop-shadow(0 0 6px rgba(94,234,212,0.45))',
              'drop-shadow(0 0 16px rgba(94,234,212,0.9))',
              'drop-shadow(0 0 6px rgba(94,234,212,0.45))',
              'drop-shadow(0 0 12px rgba(167,139,250,0.75))',
              'drop-shadow(0 0 6px rgba(94,234,212,0.45))',
            ],
          }}
          transition={{ duration: 1.1, times: [0, 0.12, 0.24, 0.36, 1], repeat: Infinity }}
        >
          .ai
        </motion.span>
      </div>

      <div className="mt-1.5 hidden items-center justify-center gap-2 sm:flex">
        <span className="h-px w-6 bg-gradient-to-r from-transparent to-white/25" />
        <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-white/45">{TAGLINE}</span>
        <span className="h-px w-6 bg-gradient-to-l from-transparent to-white/25" />
      </div>
    </motion.div>
  );
}
