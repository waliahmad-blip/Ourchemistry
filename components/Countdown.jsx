'use client';
import { useEffect, useState } from 'react';
import { LAUNCH_DATE } from '../lib/config';

function diff(target) {
  const t = target.getTime() - Date.now();
  if (t <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  const d = Math.floor(t / 86400000);
  const h = Math.floor((t % 86400000) / 3600000);
  const m = Math.floor((t % 3600000) / 60000);
  const s = Math.floor((t % 60000) / 1000);
  return { d, h, m, s, done: false };
}

function Unit({ value, label }) {
  const [tick, setTick] = useState(false);
  const str = String(value).padStart(2, '0');

  useEffect(() => {
    setTick(true);
    const id = setTimeout(() => setTick(false), 300);
    return () => clearTimeout(id);
  }, [str]);

  return (
    <div className="text-center">
      <div
        className={`text-[#5eead4] font-bold tabular-nums text-lg leading-none transition-transform duration-300 ${
          tick ? 'scale-125' : 'scale-100'
        }`}
      >
        {str}
      </div>
      <div className="text-[9px] uppercase tracking-widest text-white/50">{label}</div>
    </div>
  );
}

export default function Countdown({ locale, dict }) {
  const [t, setT] = useState(() => diff(LAUNCH_DATE));

  useEffect(() => {
    const id = setInterval(() => setT(diff(LAUNCH_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  const cd = dict.countdown || {};
  const units = [
    { v: t.d, l: cd.days || 'Days' },
    { v: t.h, l: cd.hrs || 'Hrs' },
    { v: t.m, l: cd.min || 'Min' },
    { v: t.s, l: cd.sec || 'Sec' },
  ];

  return (
    <div className="fixed top-4 left-4 z-40 glass rounded-full px-4 py-2 flex gap-3 items-center">
      <span className="pulse-dot" aria-hidden="true" />
      {units.map((u) => (
        <Unit key={u.l} value={u.v} label={u.l} />
      ))}
    </div>
  );
}
