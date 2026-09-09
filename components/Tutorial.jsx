'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

const seenKey = (p) => `oc-tutorial-seen-${p}`;
const GHOST_MS = 7000;

export default function Tutorial({ page, dict }) {
  const T = dict?.tutorial ?? {};
  const info = T[page];
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState(null); // 'ghost' | 'pinned' | null

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMode(null);
    if (!info?.title) return;
    let t;
    try {
      if (!localStorage.getItem(seenKey(page))) t = setTimeout(() => setMode('ghost'), 900);
    } catch {}
    return () => clearTimeout(t);
  }, [page, info?.title]);

  useEffect(() => {
    if (mode !== 'ghost') return;
    const t = setTimeout(() => {
      setMode(null);
      try { localStorage.setItem(seenKey(page), '1'); } catch {}
    }, GHOST_MS);
    return () => clearTimeout(t);
  }, [mode, page]);

  useEffect(() => {
    if (mode !== 'pinned') return;
    const esc = (e) => {
      if (e.key === 'Escape') {
        setMode(null);
        try { localStorage.setItem(seenKey(page), '1'); } catch {}
      }
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [mode, page]);

  const markSeen = () => { try { localStorage.setItem(seenKey(page), '1'); } catch {} };
  const close = () => { setMode(null); markSeen(); };

  if (!mounted || !info?.title) return null;
  const ghost = mode === 'ghost';

  return createPortal(
    <>
      <button
        onClick={() => { markSeen(); setMode((m) => (m === 'pinned' ? null : 'pinned')); }}
        aria-label={T.open ?? 'How it works'}
        className="fixed bottom-24 right-4 z-[90] grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white/70 backdrop-blur-xl transition hover:border-teal-300/50 hover:text-teal-200"
      >
        <HelpCircle size={17} />
      </button>

      <AnimatePresence>
        {mode && (
          <motion.div
            key={`${page}-${mode}`}
            role="dialog"
            initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
            animate={{ opacity: ghost ? 0.92 : 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(10px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed bottom-40 right-4 z-[90] w-[min(20rem,calc(100vw-2rem))] max-h-[55vh] overflow-y-auto rounded-2xl border p-5 shadow-2xl backdrop-blur-2xl ${
              ghost ? 'border-teal-300/20 bg-[#0b1020]/70' : 'border-white/10 bg-[#0b1020]/90'
            }`}
          >
            <motion.div
              animate={ghost ? { y: [0, -6, 0] } : undefined}
              transition={ghost ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
            >
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.35em] text-teal-300/70">
                {T.on ?? 'You are here'}
              </p>
              <h3 className="mb-2 text-base font-medium text-white">{info.title}</h3>
              <p className="text-[13px] leading-relaxed text-white/60">{info.body}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/25">
                  {ghost ? '···' : page}
                </span>
                {!ghost && (
                  <button
                    onClick={close}
                    className="rounded-full bg-gradient-to-r from-teal-300 to-cyan-300 px-4 py-1.5 text-[12px] font-semibold text-slate-900 transition hover:brightness-110"
                  >
                    {T.close ?? 'Got it'}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
