'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShieldCheck, Trash2, Key, Check } from 'lucide-react';
import { playVanishShred } from '../lib/audio/soundscape.js';
import { useAppStore } from '../lib/store.js';

export default function VanishModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [cats, setCats] = useState({ voiceprint: true, capsules: true, transcripts: true, profile: true });
  const setStoreReceipt = useAppStore((s) => s.setVanishReceipt);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose?.();
    if (open) window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  const toggle = (k) => setCats((p) => ({ ...p, [k]: !p[k] }));

  const handleVanish = async () => {
    setLoading(true);
    playVanishShred();
    if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
    try {
      const selected = Object.keys(cats).filter((k) => cats[k]);
      const res = await fetch('/api/vanish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'current-sovereign-user', categories: selected }),
      });
      const data = await res.json();
      if (data?.receipt) {
        setReceipt(data.receipt);
        setStoreReceipt(data.receipt);
      }
    } catch (err) {
      console.error('[vanish] error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyReceipt = async () => {
    if (!receipt) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          className="fixed inset-0 z-[75] grid place-items-center bg-black/70 p-4 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true"
            className="relative w-full max-w-md rounded-3xl border border-red-500/20 bg-[#0a0d18]/95 p-6 shadow-2xl backdrop-blur-2xl">
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-white/40 hover:text-white">
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-red-400/30 bg-red-500/10 text-red-400">
                <Trash2 size={18} />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Cryptographic Vanish</h3>
                <p className="text-[11px] text-white/50">Provable Merkle-tree zeroization</p>
              </div>
            </div>
            {!receipt ? (
              <>
                <p className="mb-4 text-xs text-white/60">
                  Select facets to shred. Keys are permanently zeroized with an immutable Merkle audit receipt.
                </p>
                <div className="mb-5 space-y-2">
                  {Object.entries(cats).map(([k, v]) => (
                    <label key={k} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-2 text-xs text-white/80 cursor-pointer">
                      <span className="capitalize">{k}</span>
                      <input type="checkbox" checked={v} onChange={() => toggle(k)} className="rounded accent-red-400" />
                    </label>
                  ))}
                </div>
                <button onClick={handleVanish} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50">
                  <Key size={15} />
                  {loading ? 'Executing zeroization…' : 'Execute Irreversible Shred'}
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-3">
                  <div className="flex items-center gap-1.5 text-teal-300 font-semibold text-xs mb-1">
                    <ShieldCheck size={16} /> Zeroization Complete & Verified
                  </div>
                  <p className="text-[11px] text-white/70">{receipt.erasedCount} facets zeroized at {new Date(receipt.timestampIso).toLocaleTimeString()}.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-[10px] text-white/60 space-y-1 overflow-x-auto">
                  <p className="text-teal-300">ID: {receipt.receiptId}</p>
                  <p className="break-all">ROOT: {receipt.merkleRoot}</p>
                  <p className="break-all text-white/40">SIG: {receipt.signature}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={copyReceipt} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2 text-xs text-white">
                    {copied ? <Check size={14} className="text-teal-300" /> : null}
                    {copied ? 'Copied' : 'Copy Proof'}
                  </button>
                  <button onClick={onClose} className="flex-1 rounded-xl bg-white/10 py-2 text-xs text-white">Close</button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
