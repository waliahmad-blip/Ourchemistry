'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Lock, Eye } from 'lucide-react';
import { playResonanceChime, playHeartPulse } from '../lib/audio/soundscape.js';

export default function BondProtocolModal({ open, onClose }) {
  const [currentDay, setCurrentDay] = useState(1);
  const [activeStage, setActiveStage] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [outcome, setOutcome] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch(`/api/bond?day=${currentDay}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.stage) setActiveStage(d.stage);
      })
      .catch(() => {});
  }, [open, currentDay]);

  const submitDay = async () => {
    if (!inputVal.trim() || loading) return;
    setLoading(true);
    setStatusMsg('');
    try {
      const res = await fetch('/api/bond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_day', day: currentDay, responseText: inputVal }),
      });
      const data = await res.json();
      if (data.success) {
        playResonanceChime(528 + currentDay * 40);
        setStatusMsg(data.message || 'Prompt sealed.');
        setInputVal('');
        if (data.progression?.canAdvance && currentDay < 7) {
          setTimeout(() => setCurrentDay((d) => d + 1), 700);
        }
      }
    } catch {
      setStatusMsg('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const submitDecision = async (dec) => {
    setLoading(true);
    playHeartPulse(1.0);
    try {
      const res = await fetch('/api/bond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'double_blind', decisionA: dec, decisionB: dec }),
      });
      const data = await res.json();
      if (data.success && data.resolution) {
        setOutcome(data.resolution.outcome);
        playResonanceChime(792);
      }
    } catch {
      setStatusMsg('Failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          className="fixed inset-0 z-[75] grid place-items-center bg-black/70 p-4 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true"
            className="relative w-full max-w-lg rounded-3xl border border-teal-500/20 bg-[#0a0d18]/95 p-6 shadow-2xl backdrop-blur-2xl">
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-white/40 hover:text-white">
              <X size={16} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#5eead4]">7-Day Double-Blind Protocol</span>
            </div>
            <div className="flex items-center justify-between gap-1 mb-5">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <button key={d} onClick={() => setCurrentDay(d)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition ${
                    currentDay === d ? 'bg-[#5eead4] text-slate-900 font-bold' : d < currentDay ? 'bg-white/10 text-teal-300' : 'bg-white/5 text-white/40'
                  }`}>
                  D{d}
                </button>
              ))}
            </div>
            {activeStage && (
              <div className="glass rounded-2xl p-4 mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-base text-white">Day {activeStage.day}: {activeStage.name}</h3>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-teal-300/80">
                    {activeStage.photoBlurred ? <Lock size={12} /> : <Eye size={12} />}
                    {activeStage.photoBlurred ? 'Reciprocal Blur' : 'Unveiled'}
                  </span>
                </div>
                <p className="text-xs text-white/70 italic">&ldquo;{activeStage.prompt}&rdquo;</p>
              </div>
            )}
            {currentDay < 7 ? (
              <div className="space-y-3">
                <textarea rows={2} value={inputVal} onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Lock your encrypted response into the bond..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white outline-none focus:border-[#5eead4]" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-300">{statusMsg}</span>
                  <button onClick={submitDay} disabled={loading || !inputVal.trim()}
                    className="btn-shine bg-[#5eead4] text-slate-900 font-semibold text-xs px-4 py-2 rounded-full disabled:opacity-50">
                    {loading ? '…' : 'Submit Day'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="p-3 rounded-xl border border-pink-400/30 bg-pink-500/10 text-xs text-white/70">
                  Double-blind covenant: mutually choose EXTEND to reveal contact details.
                </div>
                {!outcome ? (
                  <div className="flex gap-3">
                    <button onClick={() => submitDecision('EXTEND')} disabled={loading}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-900 font-bold text-xs hover:brightness-110">
                      ⚡ EXTEND BOND
                    </button>
                    <button onClick={() => submitDecision('RELEASE')} disabled={loading}
                      className="flex-1 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white/80 font-medium text-xs hover:bg-white/10">
                      GRACEFUL RELEASE
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-teal-500/20 text-teal-200 text-xs font-semibold">
                    Outcome: {outcome === 'EXTENDED' ? 'Mutual Spark! Bond Extended.' : 'Graceful Sovereign Release completed.'}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}