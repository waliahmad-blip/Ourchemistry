'use client';
import { useState } from 'react';
import { useAppStore } from '../lib/store';

function makeRefCode() {
  return 'OU-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export default function WaitlistForm({ dict }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [refCode, setRefCode] = useState('');
  const [elementNo, setElementNo] = useState(null);
  const [copied, setCopied] = useState(false);
  const waitlistCount = useAppStore((s) => s.waitlistCount);
  const setWaitlistCount = useAppStore((s) => s.setWaitlistCount);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('fail');
      const json = await res.json().catch(() => ({}));
      const newCount = typeof json.count === 'number' ? json.count : waitlistCount + 1;
      setWaitlistCount(newCount);
      setElementNo(newCount);
      const code = makeRefCode();
      setRefCode(code);
      setStatus('success');
      if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
    } catch {
      setStatus('error');
    }
  };

  const copyReferral = async () => {
    const link = `${window.location.origin}/en?ref=${refCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[#5eead4] tracking-[0.3em] uppercase text-xs mb-3">
        Step Zero
      </p>
      <h2 className="font-display text-3xl font-bold mb-3 grad-text">{dict.waitlist.title}</h2>
      <p className="text-white/60 max-w-md mb-8">{dict.waitlist.sub}</p>

      {status !== 'success' ? (
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.waitlist.email}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 outline-none focus:border-[#5eead4] transition"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-shine bg-[#5eead4] text-[#04060f] font-semibold px-6 py-3 rounded-full disabled:opacity-50 hover:scale-105 transition"
          >
            {status === 'loading' ? '…' : dict.waitlist.submit}
          </button>
        </form>
      ) : (
        <div className="glass rounded-3xl p-8 max-w-md w-full" style={{ animation: 'pop .6s' }}>
          <div className="text-5xl mb-3">⚡</div>
          <h3 className="font-display text-xl font-bold text-white mb-2">
            Spark ignited. You are on the list.
          </h3>
          <p className="text-white/60 text-sm mb-1">{dict.waitlist.success}</p>
          <p className="text-white/50 text-sm mb-6">
            You are element{' '}
            <span className="font-mono text-[#ffd7a1]">No. {elementNo?.toLocaleString()}</span>
          </p>
          <div className="border border-dashed border-white/15 rounded-2xl p-4 text-left text-sm">
            <p className="text-white/60 mb-2">🧬 Catalyze 3 friends → jump 500 places.</p>
            <p className="font-mono text-[#ffd7a1] mb-3">Your code: {refCode}</p>
            <button
              onClick={copyReferral}
              className="glass px-4 py-2 rounded-full text-xs hover:text-[#5eead4] transition"
            >
              {copied ? 'Link copied ✓' : 'Copy my link'}
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <p className="mt-4 text-[#ff8fb2]">Something went wrong. Please try again.</p>
      )}

      <p className="mt-10 text-white/40 text-sm">
        <span className="font-mono text-[#5eead4]">{waitlistCount.toLocaleString()}</span>{' '}
        {dict.waitlist.count}
      </p>
    </section>
  );
}
