'use client';
import { useRef, useState } from 'react';
import { playResonanceChime, playHeartPulse } from '../lib/audio/soundscape';
import BondProtocolModal from './BondProtocolModal';

export default function BondMeter({ dict }) {
  const [p, setP] = useState(0);
  const [bonded, setBonded] = useState(false);
  const [score, setScore] = useState(0);
  const [protocolOpen, setProtocolOpen] = useState(false);
  const stageRef = useRef(null);

  const status =
    p < 25
      ? 'Two strangers drifting…'
      : p < 55
      ? 'Orbits overlapping…'
      : p < 85
      ? 'Electrons sharing…'
      : p < 100
      ? 'Almost bonded — push!'
      : '⚡ BONDED';

  const onChange = (e) => {
    const v = Number(e.target.value);
    applyPreset(v);
  };

  const applyPreset = (val) => {
    setP(val);
    if (val >= 100 && !bonded) {
      setBonded(true);
      setScore(92 + Math.floor(Math.random() * 8));
      playResonanceChime(660);
      if (navigator.vibrate) navigator.vibrate([80, 50, 80, 50, 120]);
    } else if (val > 50 && val % 25 === 0) {
      playHeartPulse(0.6);
    }
    if (val < 100) setBonded(false);
  };

  const reset = () => {
    setP(0);
    setBonded(false);
  };

  const orbA = 8 + p * 0.4;
  const orbB = 92 - p * 0.4;

  return (
    <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
      <h2 className="font-display text-3xl font-bold mb-3 grad-text">{dict.bond.title}</h2>
      <p className="text-white/60 max-w-md mb-10">{dict.bond.sub}</p>

      <div className="w-full max-w-md">
        <div ref={stageRef} className="relative h-36 mb-6">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[3px] rounded bg-[var(--grad)] transition-all shadow-glow"
            style={{ width: `${Math.max(0, p * 0.8)}%`, boxShadow: '0 0 18px rgba(94,234,212,0.5)' }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 rounded-full grid place-items-center font-display font-bold text-[#04060f] transition-all"
            style={{
              left: `${orbA}%`,
              background: 'radial-gradient(circle at 35% 30%, #5eead4, rgba(94,234,212,0.2))',
              boxShadow: '0 0 34px rgba(94,234,212,0.5)',
            }}
          >
            Ou
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 rounded-full grid place-items-center font-display font-bold text-[#04060f] transition-all"
            style={{
              left: `${orbB}%`,
              background: 'radial-gradient(circle at 35% 30%, #ff8fb2, rgba(255,143,178,0.2))',
              boxShadow: '0 0 34px rgba(255,143,178,0.5)',
            }}
          >
            Yu
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={p}
          onChange={onChange}
          aria-label="Bond strength"
          className="bond-range"
        />

        <div className="mt-4 flex justify-between text-xs text-white/50 font-mono">
          <span>{dict.bond.spark}</span>
          <span>{dict.bond.fusion}</span>
          <span>{dict.bond.resonance}</span>
        </div>

        {/* Quick Alchemical Jump Presets */}
        <div className="mt-4 flex gap-1.5 justify-center flex-wrap">
          {[
            { label: '25% Spark', val: 25 },
            { label: '50% Orbit', val: 50 },
            { label: '75% Fusion', val: 75 },
            { label: '100% Covenant ⚡', val: 100 },
          ].map((preset) => (
            <button
              key={preset.val}
              onClick={() => applyPreset(preset.val)}
              className={`text-[11px] font-mono px-3 py-1 rounded-full transition ${
                p === preset.val
                  ? 'bg-[#5eead4] text-[#04060f] font-bold shadow-[0_0_12px_rgba(94,234,212,0.4)]'
                  : 'glass text-white/70 hover:text-white hover:border-[#5eead4]/40'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="font-display text-3xl grad-text">{p}%</p>
          <p className="text-[#ffd7a1] font-semibold text-sm">{status}</p>
        </div>

        {bonded && (
          <div className="mt-6 glass rounded-2xl p-6" style={{ animation: 'pop .6s' }}>
            <p className="font-display text-2xl grad-text font-bold">{score}% Bond Strength</p>
            <p className="text-white/50 text-sm mt-2">Catalytic. This is what ourchemistry feels like.</p>
            <div className="mt-4 flex gap-2 justify-center flex-wrap">
              <button
                onClick={() => setProtocolOpen(true)}
                className="btn-shine bg-[#5eead4] text-[#04060f] font-semibold px-5 py-2 rounded-full text-xs hover:scale-105 transition"
              >
                Enter 7-Day Bond Protocol →
              </button>
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('open-astraea', {
                      detail: 'Explain the 7-day double-blind bond protocol choices.',
                    })
                  )
                }
                className="glass border border-[#a78bfa]/40 text-[#a78bfa] px-4 py-2 rounded-full text-xs hover:bg-[#a78bfa]/15 transition"
              >
                Ask Astraea ✨
              </button>
              <button
                onClick={reset}
                className="glass px-4 py-2 rounded-full text-xs hover:text-[#5eead4] transition"
              >
                Run it again ↺
              </button>
            </div>
          </div>
        )}

        {!bonded && (
          <button
            onClick={() => setProtocolOpen(true)}
            className="mt-6 text-xs font-mono text-white/40 hover:text-teal-300 transition underline underline-offset-4"
          >
            Preview 7-Day Double-Blind Protocol ⚡
          </button>
        )}
      </div>

      <BondProtocolModal open={protocolOpen} onClose={() => setProtocolOpen(false)} />
    </section>
  );
}
