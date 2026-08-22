'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../lib/store';
import WaitlistForm from './WaitlistForm';
import VoiceDNACapture from './VoiceDNACapture';
import BondMeter from './BondMeter';
import ChemistryQuiz from './ChemistryQuiz';
import BrandMark from './BrandMark';
import Heartline from './Heartline';
import Tutorial from './Tutorial';
import LoginModal from './LoginModal';
import Starfield from './Starfield';
import Aurora from './Aurora';
import ScienceDetail from './ScienceDetail';
import TwoHeartsSync from './TwoHeartsSync';
import Comet from './Comet';
import FusionLab from './FusionLab';
import { EyeOff, AudioLines, Link2, HeartHandshake, FlaskConical } from 'lucide-react';

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

/* Living heartbeat divider — bright, new rhythm every view */
function Ecg() {
  return (
    <div
      className="fixed top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none"
      style={{ opacity: 0.85, zIndex: 0 }}
      aria-hidden="true"
    >
      <Heartline beats={7} height={44} from="#5eead4" to="#a78bfa" />
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
      <div className="mt-4 w-full max-w-lg px-4">
        <TwoHeartsSync />
      </div>
      <div className="mt-8 flex gap-4 flex-wrap justify-center">
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
  const [active, setActive] = useState(null);
  const F = dict.features;
  const items = [
    { key: 'anti',      Icon: EyeOff,         color: '#5eead4' },
    { key: 'voiceDna',  Icon: AudioLines,     color: '#ffd7a1' },
    { key: 'trial',     Icon: Link2,          color: '#a78bfa' },
    { key: 'matrimony', Icon: HeartHandshake, color: '#ff8fb2' },
    { key: 'element',   Icon: FlaskConical,   color: '#67e8f9' },
  ];
  const span = (i) =>
    i === 4 ? 'sm:col-span-2 md:col-span-3' : i < 3 ? 'md:col-span-2' : 'md:col-span-3';

  return (
    <section className="h-screen flex flex-col items-center justify-center px-6 py-20 overflow-y-auto">
      <h2 className="font-display text-3xl font-bold grad-text">{dict.nav.science}</h2>
      <div className="w-full max-w-md mt-4 mb-8">
        <Heartline beats={5} height={48} from="#5eead4" to="#67e8f9" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-5 max-w-4xl w-full">
        {items.map(({ key, Icon, color }, i) => (
          <motion.article
            key={key}
            onClick={() => setActive(i)}
            whileTap={{ scale: 0.97 }}
            role="button"
            aria-label={F[key]}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl glass p-5 hover:border-white/20 transition ${span(i)}`}
          >
            <div
              className="absolute inset-x-5 top-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
            />
            <div className="mb-4 flex items-center justify-between">
              <span
                className="grid h-11 w-11 place-items-center rounded-full border transition-transform duration-500 group-hover:scale-110"
                style={{
                  borderColor: `${color}55`,
                  background: `${color}12`,
                  boxShadow: `0 0 22px ${color}40, inset 0 0 10px ${color}22`,
                }}
              >
                <Icon size={19} color={color} strokeWidth={1.8} />
              </span>
              <span className="font-mono text-[11px] tracking-[0.25em]" style={{ color: `${color}cc` }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="font-semibold mb-2" style={{ color }}>{F[key]}</h3>
            <p className="text-white/60 text-sm">{F[`${key}Sub`]}</p>
          </motion.article>
        ))}
      </div>
      <button
        onClick={() => setView('bond')}
        className="mt-8 text-[#5eead4] underline underline-offset-4"
      >
        → {dict.nav.bond}
      </button>

      <ScienceDetail
        active={active}
        items={items}
        dict={dict}
        onClose={() => setActive(null)}
        onWaitlist={() => { setActive(null); setView('waitlist'); }}
      />
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
  const [loginOpen, setLoginOpen] = useState(false);
  const [fusionOpen, setFusionOpen] = useState(false);

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
      <BrandMark />
      <Starfield />
      <Aurora view={view} />
      <button
        onClick={() => setLoginOpen(true)}
        className="fixed top-3 right-4 z-[45] glass rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70 transition hover:text-[#5eead4]"
      >
        {dict?.login?.submit ?? 'Sign in'}
      </button>
      <button
        onClick={() => setFusionOpen(true)}
        className="fixed bottom-24 left-4 z-[45] glass rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#ffd7a1] transition hover:brightness-125"
      >
        ⚡ Fusion
      </button>
      <Ecg />
      <Comet />
      <Tutorial page={view} dict={dict} />

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

      <FusionLab open={fusionOpen} onClose={() => setFusionOpen(false)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} dict={dict} />
    </>
  );
}
