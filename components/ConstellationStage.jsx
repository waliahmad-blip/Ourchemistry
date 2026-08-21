'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../lib/store';
import WaitlistForm from './WaitlistForm';
import VoiceDNACapture from './VoiceDNACapture';
import BondMeter from './BondMeter';
import ChemistryQuiz from './ChemistryQuiz';

/* Rotating word that cycles a list of translated synonyms */
function RotatingLex({ words }) {
  const [i, setI] = useState(0);
  const [swap, setSwap] = useState(false);
  const list = Array.isArray(words) && words.length ? words : ['chemistry'];

  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => {
      setSwap(true);
      setTimeout(() => {
        setI((v) => (v + 1) % list.length);
        setSwap(false);
      }, 450);
    }, 4200);
    return () => clearInterval(id);
  }, [list.length]);

  return <span className={`lex grad-text ${swap ? 'swap' : ''}`}>{list[i]}</span>;
}

/* Decorative heartbeat divider */
function Ecg() {
  return (
    <div className="ecg fixed top-1/2 left-0 right-0 pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
        <path
          d="M0 20 H140 l12-13 16 26 12-13 H420 l12-13 16 26 12-13 H740 l12-13 16 26 12-13 H1040 l12-13 16 26 12-13 H1200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

function Hero({ dict }) {
  const setView = useAppStore((s) => s.setView);
  return (
    <section className="h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="glass rounded-full px-4 py-1.5 flex items-center gap-2 mb-6">
        <span className="pulse-dot" aria-hidden="true" />
        <p className="text-[#ffd7a1] tracking-[0.25em] uppercase text-[11px] font-mono">
          {dict.hero.kicker}
        </p>
      </div>
      <h1 className="font-display glow-text text-5xl md:text-7xl font-bold bg-gradient-to-br from-[#5eead4] via-[#a78bfa] to-[#ff8fb2] bg-clip-text text-transparent">
        {dict.hero.title}
      </h1>
      <p className="mt-4 text-2xl md:text-3xl font-display text-white/80">
        <RotatingLex words={dict.hero.rot} />
      </p>
      <p className="mt-6 max-w-xl text-white/70 text-lg">{dict.hero.sub}</p>
      <div className="mt-10 flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => setView('waitlist')}
          className="btn-shine bg-[#5eead4] text-[#04060f] font-semibold px-7 py-3 rounded-full hover:scale-105 transition"
        >
          {dict.hero.cta}
        </button>
        <button
          onClick={() => setView('features')}
          className="glass px-7 py-3 rounded-full hover:text-[#5eead4] transition"
        >
          {dict.hero.secondary}
        </button>
      </div>
    </section>
  );
}

function Features({ dict }) {
  const setView = useAppStore((s) => s.setView);
  const items = [
    { icon: '🎭', t: dict.features.anti, s: dict.features.antiSub },
    { icon: '🔗', t: dict.features.trial, s: dict.features.trialSub },
    { icon: '💍', t: dict.features.matrimony, s: dict.features.matrimonySub },
  ];
  return (
    <section className="h-screen flex flex-col items-center justify-center px-6">
      <h2 className="font-display text-3xl font-bold mb-8 grad-text">{dict.nav.science}</h2>
      <div className="grid md:grid-cols-3 gap-5 max-w-4xl w-full">
        {items.map((it) => (
          <div
            key={it.t}
            className="glass rounded-2xl p-6 hover:-translate-y-1 hover:border-[#5eead4]/40 transition"
          >
            <div className="text-3xl mb-3">{it.icon}</div>
            <h3 className="text-[#ffd7a1] font-semibold mb-2">{it.t}</h3>
            <p className="text-white/60 text-sm">{it.s}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => setView('bond')}
        className="mt-8 text-[#5eead4] underline underline-offset-4"
      >
        → {dict.nav.bond}
      </button>
    </section>
  );
}

function Faq({ dict }) {
  const setView = useAppStore((s) => s.setView);
  const items = [
    { q: dict.faq.when, a: dict.faq.whenA },
    { q: dict.faq.free, a: dict.faq.freeA },
    { q: dict.faq.countries, a: dict.faq.countriesA },
    { q: dict.faq.trialEnd, a: dict.faq.trialEndA },
  ];
  return (
    <section className="h-screen flex flex-col items-center justify-center px-6">
      <h2 className="font-display text-3xl font-bold mb-8 grad-text">{dict.faq.title}</h2>
      <div className="max-w-2xl w-full space-y-3">
        {items.map((it) => (
          <details key={it.q} className="glass rounded-xl p-4 group">
            <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
              {it.q}
              <span className="text-[#5eead4] group-open:rotate-45 transition-transform">＋</span>
            </summary>
            <p className="mt-2 text-white/60 text-sm">{it.a}</p>
          </details>
        ))}
      </div>
      <button
        onClick={() => setView('hero')}
        className="mt-8 text-[#5eead4] underline underline-offset-4"
      >
        ← {dict.nav.home}
      </button>
    </section>
  );
}

export default function ConstellationStage({ dict, locale }) {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  const navItems = [
    { id: 'hero', label: dict.nav.home },
    { id: 'features', label: dict.nav.science },
    { id: 'bond', label: dict.nav.bond },
    { id: 'voice', label: dict.nav.voices },
    { id: 'quiz', label: dict.nav.quiz || 'Quiz' },
    { id: 'waitlist', label: dict.nav.waitlist },
    { id: 'faq', label: dict.nav.faq },
  ];

  // Keyboard navigation with arrow keys
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const idx = navItems.findIndex((n) => n.id === view);
      if (e.key === 'ArrowRight') {
        setView(navItems[(idx + 1) % navItems.length].id);
      } else if (e.key === 'ArrowLeft') {
        setView(navItems[(idx - 1 + navItems.length) % navItems.length].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view]);

  return (
    <>
      <Ecg />

      <nav
        aria-label="Primary"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass rounded-full px-3 py-2 flex gap-1 overflow-x-auto max-w-[92vw]"
      >
        {navItems.map((n) => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            aria-current={view === n.id ? 'page' : undefined}
            className={`dock-btn whitespace-nowrap text-xs px-3 py-1.5 rounded-full ${
              view === n.id ? 'bg-[#a78bfa] text-[#04060f] font-semibold' : 'text-white/70'
            }`}
          >
            {n.label}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4 }}
        >
          {view === 'hero' && <Hero dict={dict} />}
          {view === 'features' && <Features dict={dict} />}
          {view === 'bond' && <BondMeter dict={dict} />}
          {view === 'voice' && <VoiceDNACapture dict={dict} />}
          {view === 'quiz' && <ChemistryQuiz dict={dict} />}
          {view === 'waitlist' && <WaitlistForm dict={dict} />}
          {view === 'faq' && <Faq dict={dict} />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
