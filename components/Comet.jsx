'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Comet() {
  const [comet, setComet] = useState(null);
  const [caught, setCaught] = useState(false);
  const [toast, setToast] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    let alive = true;
    const spawn = () => {
      if (!alive) return;
      setComet({ id: Date.now(), y: 8 + Math.random() * 30, slope: 6 + Math.random() * 10 });
      setTimeout(() => alive && setComet(null), 4200);
      timer.current = setTimeout(spawn, 40000 + Math.random() * 45000);
    };
    timer.current = setTimeout(spawn, 12000);
    return () => { alive = false; clearTimeout(timer.current); };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  const catchIt = () => {
    if (caught) return;
    setCaught(true);
    setComet(null);
    try { localStorage.setItem('oc-priority-waitlist', '1'); } catch {}
    setToast(true);
  };

  return (
    <>
      <AnimatePresence>
        {comet && (
          <motion.button
            key={comet.id}
            onClick={catchIt}
            aria-label="Catch the comet"
            className="fixed z-[55] cursor-pointer"
            style={{ top: `${comet.y}vh`, left: 0 }}
            initial={{ x: '-12vw', y: 0, opacity: 0 }}
            animate={{ x: '112vw', y: comet.slope, opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: 'linear' }}
          >
            <span
              className="block h-3.5 w-3.5 rounded-full bg-white"
              style={{ boxShadow: '0 0 14px 4px #ffffffcc, 0 0 34px 10px #5eead466' }}
            />
            <span
              className="absolute right-3 top-1/2 h-[2px] w-24 -translate-y-1/2 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #ffffffaa)' }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 left-1/2 z-[85] -translate-x-1/2 whitespace-nowrap rounded-full border border-[#ffd7a1]/40 bg-[#0b1020]/90 px-5 py-2.5 text-[13px] text-[#ffd7a1] shadow-2xl backdrop-blur-xl"
          >
            ✦ Caught! Priority waitlist unlocked — your spark jumps the queue.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
