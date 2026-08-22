'use client';

import { motion } from 'framer-motion';
import { BRAND, TAGLINE } from '../lib/config';

/* The first "o" as a living atom — big pulsing nucleus, two orbiting electrons */
function AtomO() {
  return (
    <motion.span
      aria-hidden="true"
      className="relative inline-block shrink-0 align-baseline"
      style={{ width: '1.05em', height: '1.05em', marginRight: '0.06em' }}
    >
      {/* orbit rings */}
      <span className="absolute inset-0 rounded-full border border-white/30" />
      <span className="absolute inset-[24%] rounded-full border border-[#5eead4]/45" />

      {/* nucleus — pulses like a heartbeat */}
      <motion.span
        className="absolute left-1/2 top-1/2 h-[5px] w-[5px] rounded-full bg-white"
        style={{ transform: 'translate(-50%,-50%)', boxShadow: '0 0 10px rgba(255,255,255,1)' }}
        animate={{ scale: [1, 1.5, 1, 1.25, 1] }}
        transition={{ duration: 1.1, times: [0, 0.12, 0.24, 0.36, 1], repeat: Infinity }}
      />

      {/* electron 1 — fast, teal */}
      <motion.span
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute left-1/2 top-0 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-[#5eead4]"
          style={{ boxShadow: '0 0 7px #5eead4' }}
        />
      </motion.span>

      {/* electron 2 — slower, violet, offset ring */}
      <motion.span
        className="absolute inset-[24%]"
        animate={{ rotate: [-180, 180] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute left-1/2 bottom-0 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-[#a78bfa]"
          style={{ boxShadow: '0 0 7px #a78bfa' }}
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
      <div
        className="flex items-center justify-center"
        style={{ filter: 'drop-shadow(0 2px 22px rgba(94,234,212,0.18))' }}
      >
        {/* [atom-o] + rest of the word, with periodic shimmer sweep */}
        <span className="relative inline-flex items-center overflow-hidden">
          <AtomO />
          <span className="font-display text-[18px] font-semibold leading-none tracking-[0.26em] text-white/90 sm:text-[26px]">
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
          className="inline-block bg-gradient-to-r from-[#5eead4] via-[#67e8f9] to-[#a78bfa] bg-clip-text font-mono text-[18px] font-semibold leading-none tracking-[0.26em] text-transparent sm:text-[26px]"
          animate={{
            scale: [1, 1.09, 1, 1.04, 1],
            filter: [
              'drop-shadow(0 0 8px rgba(94,234,212,0.5))',
              'drop-shadow(0 0 20px rgba(94,234,212,0.95))',
              'drop-shadow(0 0 8px rgba(94,234,212,0.5))',
              'drop-shadow(0 0 14px rgba(167,139,250,0.8))',
              'drop-shadow(0 0 8px rgba(94,234,212,0.5))',
            ],
          }}
          transition={{ duration: 1.1, times: [0, 0.12, 0.24, 0.36, 1], repeat: Infinity }}
        >
          .ai
        </motion.span>
      </div>

      <div className="mt-1.5 hidden items-center justify-center gap-2 sm:flex">
        <span className="h-px w-7 bg-gradient-to-r from-transparent to-white/25" />
        <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-white/50">{TAGLINE}</span>
        <span className="h-px w-7 bg-gradient-to-l from-transparent to-white/25" />
      </div>
    </motion.div>
  );
}
