'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Mail, Lock, Heart } from 'lucide-react';
import Heartline from './Heartline';

function GoogleG({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

export default function LoginModal({ open, onClose, dict }) {
  const L = dict?.login ?? {};
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose?.();
    if (open) window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  const handleGoogle = () => {
    window.location.href = '/api/auth/google/start';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || loading) return;
    setLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setAuthError(data.error || 'Authentication failed. Please verify credentials.');
      } else {
        setAuthSuccess(mode === 'signin' ? 'Session authenticated.' : 'Account created and secured.');
        setTimeout(() => {
          onClose?.();
          setAuthSuccess('');
        }, 800);
      }
    } catch {
      setAuthError('Network error connecting to auth server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020]/90 p-7 shadow-2xl backdrop-blur-2xl"
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-pink-300/70 to-transparent" />
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-white/40 transition hover:text-white">
              <X size={16} />
            </button>

            <div className="mx-auto mb-3 w-44">
              <Heartline beats={3} height={38} from="#ff8fb2" to="#a78bfa" />
            </div>

            <h3 className="text-center text-xl font-medium text-white">
              {mode === 'signin' ? (L.title ?? 'Welcome back') : (L.signup ?? 'Create account')}
            </h3>
            <p className="mt-1 text-center text-[13px] text-white/50">{L.sub}</p>

            <button
              onClick={handleGoogle}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-[14px] font-medium text-slate-800 transition hover:brightness-95 active:scale-[0.99]"
            >
              <GoogleG /> {L.google}
            </button>

            <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/30">
              <span className="h-px flex-1 bg-white/10" />
              {L.or}
              <span className="h-px flex-1 bg-white/10" />
            </div>

            {authError && (
              <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-[12px] text-red-300">
                {authError}
              </p>
            )}

            {authSuccess && (
              <p className="mb-4 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-2 text-center text-[12px] text-teal-300">
                {authSuccess}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <label className="mb-3 block">
                <span className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/40">
                  <Mail size={11} /> {L.email}
                </span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-teal-300/50"
                />
              </label>
              <label className="mb-5 block">
                <span className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/40">
                  <Lock size={11} /> {L.password}
                </span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-teal-300/50"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-teal-300 to-cyan-300 py-3 text-[14px] font-semibold text-slate-900 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? '…' : mode === 'signin' ? L.submit : L.signup}
              </button>
            </form>

            <p className="mt-5 text-center text-[12px] text-white/45">
              {L.noAccount}{' '}
              <button onClick={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
                className="font-medium text-teal-300 underline-offset-2 hover:underline">
                {L.signup}
              </button>
            </p>

            <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-[11px] leading-relaxed text-white/35">
              <Heart size={11} className="mt-0.5 shrink-0 text-pink-300/60" />
              {L.privacy}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
