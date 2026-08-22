'use client';

import { motion } from 'framer-motion';

const COLORS = {
  hero: ['#5eead4', '#a78bfa'],
  features: ['#5eead4', '#67e8f9'],
  bond: ['#a78bfa', '#5eead4'],
  voice: ['#ffd7a1', '#ff8fb2'],
  quiz: ['#67e8f9', '#5eead4'],
  waitlist: ['#ff8fb2', '#ffd7a1'],
  faq: ['#a78bfa', '#67e8f9'],
};

export default function Aurora({ view }) {
  const [a, b] = COLORS[view] ?? COLORS.hero;
  return (
    <motion.div
      key={view}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: -1,
        background: `radial-gradient(60% 50% at 20% 15%, ${a}1e, transparent 60%),
                     radial-gradient(50% 45% at 80% 80%, ${b}16, transparent 60%)`,
      }}
    />
  );
}
