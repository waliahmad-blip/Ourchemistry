'use client';
import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../lib/store';

const BRAIN = [
  { re: /launch|when|date|live/i, a: 'First spark lands February 14, 2027. Waitlist members ignite in waves before that — catalyze friends to move forward.' },
  { re: /free|price|cost|pay/i, a: 'Core chemistry is free forever — voice-first matching, the 7-day bond trial, resonance texting. Matrimony tiers arrive later with a transparent plan.' },
  { re: /voice|data|privacy|safe|record/i, a: 'Your voiceprint is computed on-device. Only the mathematical pattern touches our servers — never the sound itself. One-tap vanish erases everything in 60 seconds.' },
  { re: /country|countries|where|region|india/i, a: 'We ignite where the global charge is highest: India, the UAE, the UK, and the US are leading right now.' },
  { re: /trial|bond|7 day|seven/i, a: 'Seven structured days of real prompts. Day 7: both choose privately — extend the bond, or release with grace. Choices reveal simultaneously. No ghosting, ever.' },
  { re: /text|messaging|chat/i, a: 'Resonance Texting — bubbles glow with emotion, messages develop like film, and the typing indicator is a heartbeat line, not three dots.' },
  { re: /delete|erase|remove/i, a: 'One tap. Everything — matches, capsules, voice patterns — vanishes everywhere within 60 seconds. You own your chemistry.' },
  { re: /photo|picture|image|face/i, a: 'No photos for your first 3 interactions. Mind before face. Pictures unlock only when both hearts opt in.' },
  { re: /who|what.*you|hello|hi|hey/i, a: 'I am Catalyst — the concierge of ourchemistry.ai. Ask me about the launch, privacy, or the bond trial.' },
];

const CHIPS = ['Launch date?', 'Voice privacy', 'Bond trial', 'Resonance texting'];

export default function CatalystOrb({ dict }) {
  const locale = useAppStore((s) => s.locale);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: 'I am Catalyst ⚗ Ask me anything about ourchemistry.' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, typing]);

  const reply = (q) => {
    const hit = BRAIN.find((b) => b.re.test(q));
    return hit
      ? hit.a
      : 'Beautiful question. We built ourchemistry for depth, not dopamine. Ask me about the launch, privacy, or the bond trial.';
  };

  const ask = async (text) => {
    const clean = (text || '').trim();
    if (!clean) return;
    setMsgs((m) => [...m, { from: 'user', text: clean }]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('/api/catalyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean, locale }),
      });
      if (res.ok) {
        const data = await res.json();
        setTyping(false);
        setMsgs((m) => [...m, { from: 'bot', text: data.reply || reply(clean) }]);
        return;
      }
    } catch {
      // Graceful offline fallback
    }

    const answer = reply(clean);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: 'bot', text: answer }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {open && (
        <div className="glass rounded-2xl w-80 h-96 flex flex-col mb-3 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-full"
              style={{ background: 'var(--grad)', animation: 'spin 6s linear infinite' }}
            />
            <div className="text-left">
              <p className="font-display text-sm font-bold">{dict.catalyst.title}</p>
              <p className="text-[10px] text-white/40">online</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'text-end' : 'text-start'}>
                <span
                  className={`inline-block px-3 py-1.5 rounded-xl max-w-[85%] ${
                    m.from === 'user'
                      ? 'bg-[#a78bfa] text-[#04060f]'
                      : 'bg-white/10 text-white/85'
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {typing && (
              <div className="text-left">
                <span className="inline-flex gap-1 px-3 py-2 rounded-xl bg-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.3s' }} />
                </span>
              </div>
            )}
          </div>

          <div className="px-3 pb-1 flex gap-1.5 flex-wrap">
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => ask(c)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition"
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex gap-2 p-3 border-t border-white/10">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask(input)}
              placeholder={dict.catalyst.placeholder}
              className="flex-1 bg-white/5 rounded-full px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[#5eead4]"
            />
            <button
              onClick={() => ask(input)}
              className="bg-[#5eead4] text-[#04060f] rounded-full px-3 text-xs font-semibold"
            >
              {dict.catalyst.send}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={dict.catalyst.title}
        className="orb-ring w-14 h-14 rounded-full grid place-items-center text-2xl shadow-glow transition hover:scale-110"
        style={{ background: 'radial-gradient(circle at 35% 30%, #5eead4, #a78bfa 60%, #ff8fb2)' }}
      >
        ⚗
      </button>
    </div>
  );
}
