'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '../lib/config';

const LABELS = {
  en: 'English', ur: 'اردو', ar: 'العربية', fr: 'Français', tr: 'Türkçe',
  id: 'Indonesia', ms: 'Melayu', de: 'Deutsch', bn: 'বাংলা', es: 'Español',
};
const SHORT = {
  en: 'EN', ur: 'اردو', ar: 'ع', fr: 'FR', tr: 'TR',
  id: 'ID', ms: 'MS', de: 'DE', bn: 'বাং', es: 'ES',
};

export default function LocaleSwitcher({ current }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const change = (loc) => {
    setOpen(false);
    if (!loc || loc === current) return;
    const segments = pathname.split('/');
    segments[1] = loc;
    router.push(segments.join('/') || `/${loc}`);
  };

  return (
    <div ref={ref} className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold hover:text-[#5eead4] transition"
      >
        <span aria-hidden="true">🌐</span>
        {SHORT[current] || current.toUpperCase()}
        <span className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="glass rounded-2xl mt-2 py-2 w-44 max-h-72 overflow-y-auto"
          style={{ animation: 'pop .25s' }}
        >
          {locales.map((loc) => (
            <li key={loc} role="option" aria-selected={loc === current}>
              <button
                onClick={() => change(loc)}
                className={`w-full text-start px-4 py-2 text-sm transition flex items-center justify-between ${
                  loc === current
                    ? 'text-[#5eead4] font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {LABELS[loc]}
                {loc === current && <span aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
