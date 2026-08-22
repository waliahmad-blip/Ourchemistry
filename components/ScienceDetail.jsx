'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, User, Lock, FlaskConical, ArrowDown } from 'lucide-react';
import Heartline from './Heartline';

function DemoAnti() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [1, 0.12, 1], filter: ['blur(0px)', 'blur(5px)', 'blur(0px)'] }}
            transition={{ duration: 3.6, times: [0, 0.5, 1], delay: i * 0.55, repeat: Infinity, repeatDelay: 0.6 }}
            className="grid h-12 w-12 place-items-center rounded-xl border border-white/15 bg-white/[0.06]"
          >
            <User size={18} className="text-white/60" />
          </motion.div>
        ))}
      </div>
      <motion.div animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 3.6, repeat: Infinity }} className="w-48">
        <Heartline beats={3} height={26} from="#5eead4" to="#a78bfa" />
      </motion.div>
    </div>
  );
}

function DemoVoice() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 font-mono text-[11px]">
        {['W1', 'W2', 'W3'].map((w, i) => (
          <motion.span
            key={w}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.5, duration: 0.4 }}
            className="rounded-full border border-[#ffd7a1]/40 bg-[#ffd7a1]/10 px-3 py-1 text-[#ffd7a1]"
          >
            {w}
          </motion.span>
        ))}
        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.8, repeat: Infinity }} className="text-white/50">
          <ArrowDown size={14} />
        </motion.span>
      </div>
      <div className="w-56">
        <Heartline beats={4} height={30} from="#ffd7a1" to="#ff8fb2" />
      </div>
    </div>
  );
}

function DemoTrial() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center gap-2.5">
        <span className="absolute left-0 right-0 top-1/2 -z-10 h-px bg-gradient-to-r from-[#a78bfa]/20 via-[#a78bfa]/60 to-[#ff8fb2]/60" />
        {Array.from({ length: 7 }, (_, i) => (
          <motion.span
            key={i}
            animate={{
              scale: [1, i === 6 ? 1.9 : 1.5, 1],
              opacity: [0.35, 1, 0.35],
              boxShadow: [
                `0 0 0px ${i === 6 ? '#ff8fb2' : '#a78bfa'}`,
                `0 0 14px ${i === 6 ? '#ff8fb2' : '#a78bfa'}`,
                `0 0 0px ${i === 6 ? '#ff8fb2' : '#a78bfa'}`,
              ],
            }}
            transition={{ duration: 2.8, times: [0, 0.5, 1], delay: i * 0.35, repeat: Infinity, repeatDelay: 0.4 }}
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: i === 6 ? '#ff8fb2' : '#a78bfa' }}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] tracking-[0.45em] text-white/30">D1 — D7</span>
    </div>
  );
}

function DemoMatrimony() {
  return (
    <div className="relative flex h-20 items-center justify-center">
      <motion.span
        animate={{ x: [-26, -9, -9, -26] }}
        transition={{ duration: 3.2, times: [0, 0.35, 0.75, 1], repeat: Infinity }}
        className="h-14 w-14 rounded-full border-2 border-[#ff8fb2]/80 mix-blend-screen"
        style={{ boxShadow: '0 0 18px #ff8fb255' }}
      />
      <motion.span
        animate={{ x: [26, 9, 9, 26] }}
        transition={{ duration: 3.2, times: [0, 0.35, 0.75, 1], repeat: Infinity }}
        className="h-14 w-14 rounded-full border-2 border-[#a78bfa]/80 mix-blend-screen"
        style={{ boxShadow: '0 0 18px #a78bfa55' }}
      />
      <motion.span
        animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.6, 0.6, 1, 1, 0.6] }}
        transition={{ duration: 3.2, times: [0, 0.35, 0.5, 0.75, 1], repeat: Infinity }}
        className="absolute text-[#ffd7a1]"
      >
        <Lock size={16} />
      </motion.span>
    </div>
  );
}

function DemoElement() {
  return (
    <div className="relative grid h-28 w-28 place-items-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} className="absolute inset-0">
        {['#ff8fb2', '#67e8f9', '#ffd7a1', '#a78bfa'].map((c, i) => (
          <span
            key={c}
            className="absolute h-2.5 w-2.5 rounded-full"
            style={{
              background: c,
              boxShadow: `0 0 12px ${c}`,
              top: i === 0 ? 0 : i === 2 ? 'auto' : '50%',
              bottom: i === 2 ? 0 : 'auto',
              left: i === 3 ? 0 : i === 1 ? 'auto' : '50%',
              right: i === 1 ? 0 : 'auto',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 2.6, repeat: Infinity }}
        className="text-[#67e8f9]"
        style={{ filter: 'drop-shadow(0 0 10px #67e8f988)' }}
      >
        <FlaskConical size={26} />
      </motion.div>
    </div>
  );
}

const DEMOS = { anti: DemoAnti, voiceDna: DemoVoice, trial: DemoTrial, matrimony: DemoMatrimony, element: DemoElement };

export default function ScienceDetail({ active, items, dict, onClose, onWaitlist }) {
  const item = active != null ? items[active] : null;

  useEffect(() => {
    if (!item) return;
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [item, onClose]);

  const T = dict?.tutorial ?? {};
  const F = dict?.features ?? {};
  const Demo = item ? DEMOS[item.key] : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020]/92 p-7 shadow-2xl backdrop-blur-2xl"
          >
            <div
              className="absolute inset-x-8 top-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
            />
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-white/40 transition hover:text-white">
              <X size={16} />
            </button>

            <div className="mb-5 flex items-center gap-4">
              <motion.span
                animate={{ boxShadow: [`0 0 18px ${item.color}44`, `0 0 34px ${item.color}88`, `0 0 18px ${item.color}44`] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="grid h-14 w-14 place-items-center rounded-full border"
                style={{ borderColor: `${item.color}55`, background: `${item.color}12` }}
              >
                <item.Icon size={24} color={item.color} strokeWidth={1.8} />
              </motion.span>
              <div>
                <p className="font-mono text-[10px] tracking-[0.35em]" style={{ color: `${item.color}cc` }}>
                  {String(active + 1).padStart(2, '0')} / 05
                </p>
                <h3 className="mt-1 text-lg font-medium text-white">{F[item.key]}</h3>
              </div>
            </div>

            <p className="mb-5 text-[13px] leading-relaxed text-white/60">{F[`${item.key}Sub`]}</p>

            <div className="mb-6 grid h-36 place-items-center rounded-2xl border border-white/[0.07] bg-white/[0.03]">
              {Demo && <Demo />}
            </div>

            <div className="flex items-center justify-between">
              <button onClick={onClose} className="text-[13px] text-white/50 transition hover:text-white/80">
                {T.close ?? 'Got it'}
              </button>
              <button
                onClick={onWaitlist}
                className="rounded-full px-5 py-2 text-[13px] font-semibold text-slate-900 transition hover:brightness-110 active:scale-[0.98]"
                style={{ background: `linear-gradient(90deg, ${item.color}, #5eead4)` }}
              >
                {dict?.hero?.cta ?? 'Join the waitlist'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
