'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { playFusionSpark } from '../lib/audio/soundscape';

const ELEMENTS = [
  { id: 'aqua',  label: 'Aqua',  color: '#67e8f9', x: -150, y: -60 },
  { id: 'ignis', label: 'Ignis', color: '#ff8fb2', x: 150, y: -60 },
  { id: 'terra', label: 'Terra', color: '#ffd7a1', x: -150, y: 80 },
  { id: 'ventus', label: 'Ventus', color: '#a78bfa', x: 150, y: 80 },
];

/* keys = sorted pair ids */
const RESULTS = {
  'aqua+ignis':   { name: 'Steam',    pct: 91, line: 'Volatile, electric, impossible to ignore.' },
  'aqua+terra':   { name: 'Clay',     pct: 88, line: 'Molds to each other and holds the shape.' },
  'aqua+ventus':  { name: 'Storm',    pct: 79, line: 'High energy — clears the air.' },
  'ignis+terra':  { name: 'Magma',    pct: 84, line: 'Slow-burning, unshakeable once formed.' },
  'ignis+ventus': { name: 'Wildfire', pct: 73, line: 'Spreads fast. Handle with intention.' },
  'terra+ventus': { name: 'Dust',     pct: 68, line: 'Gentle drift; needs time to settle.' },
};

export default function FusionLab({ open, onClose }) {
  const ringRef = useRef(null);
  const [placed, setPlaced] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  const reset = () => { setPlaced([]); setResult(null); };

  const onDragEnd = (el) => (_, info) => {
    const ring = ringRef.current?.getBoundingClientRect();
    if (!ring) return;
    const dx = info.point.x - (ring.left + ring.width / 2);
    const dy = info.point.y - (ring.top + ring.height / 2);
    if (Math.hypot(dx, dy) < 85) {
      setPlaced((p) => {
        if (p.includes(el.id) || p.length >= 2) return p;
        const next = [...p, el.id];
        if (next.length === 2) {
          const key = [...next].sort().join('+');
          setTimeout(() => {
            playFusionSpark();
            setResult(RESULTS[key] ?? { name: 'Mystery Bond', pct: 77, line: 'Undocumented chemistry.' });
          }, 650);
        }
        return next;
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[85] grid place-items-center bg-black/70 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog" aria-modal="true"
            className="relative grid h-[min(30rem,80vh)] w-full max-w-lg place-items-center overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020]/92 shadow-2xl backdrop-blur-2xl"
          >
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-white/40 transition hover:text-white">
              <X size={16} />
            </button>
            <button onClick={reset} aria-label="Reset" className="absolute left-4 top-4 text-white/40 transition hover:text-white">
              <RotateCcw size={15} />
            </button>

            <p className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
              Fusion Lab
            </p>

            {/* the ring */}
            <div ref={ringRef} className="relative grid h-36 w-36 place-items-center">
              <motion.span
                className="absolute inset-0 rounded-full border border-dashed border-white/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              />
              <motion.span
                className="absolute inset-3 rounded-full border border-[#5eead4]/30"
                animate={{ scale: placed.length >= 2 ? [1, 1.12, 1] : 1, opacity: placed.length >= 2 ? [0.5, 1, 0.5] : 0.5 }}
                transition={{ duration: 1.2, repeat: placed.length >= 2 ? Infinity : 0 }}
              />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/35">
                {placed.length === 0 ? 'drop 2 here' : placed.length === 1 ? 'one more…' : 'fusing'}
              </span>

              {/* fusion flash */}
              <AnimatePresence>
                {result && (
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    initial={{ boxShadow: '0 0 0px #fff', opacity: 1 }}
                    animate={{ boxShadow: '0 0 60px 18px #fff8', opacity: 0 }}
                    transition={{ duration: 1 }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* element orbs — draggable */}
            {ELEMENTS.map((el) => (
              <motion.button
                key={el.id}
                drag
                dragMomentum={false}
                onDragEnd={onDragEnd(el)}
                whileDrag={{ scale: 1.2, zIndex: 5 }}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{ left: '50%', top: '50%', x: el.x, y: el.y }}
              >
                <span
                  className={`grid h-14 w-14 place-items-center rounded-full border font-mono text-[10px] uppercase tracking-widest transition ${placed.includes(el.id) ? 'scale-90' : ''}`}
                  style={{
                    borderColor: `${el.color}66`,
                    background: `${el.color}14`,
                    color: el.color,
                    boxShadow: placed.includes(el.id) ? `0 0 26px ${el.color}` : `0 0 12px ${el.color}44`,
                  }}
                >
                  {el.label}
                </span>
              </motion.button>
            ))}

            {/* result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-6 left-1/2 w-[min(20rem,86%)] -translate-x-1/2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur-xl"
                >
                  <p className="font-display text-lg font-semibold grad-text">{result.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] tracking-[0.3em] text-[#5eead4]">{result.pct}% BOND</p>
                  <p className="mt-1.5 text-[12px] text-white/55">{result.line}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.35em] text-white/20">
              drag any two into the ring
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
