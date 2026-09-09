'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Mic, MicOff, Send, Lock, Sparkles } from 'lucide-react';
import { useAppStore } from '../lib/store';

const CHIPS = [
  '✦ Launch Waves',
  '🎙 Voice DNA',
  '⚡ 7-Day Covenant',
  '🔒 Vanish Proof',
  '✨ Elemental Synergy',
];

export default function CatalystOrb({ dict }) {
  const locale = useAppStore((s) => s.locale);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    {
      from: 'bot',
      text: 'Greetings. I am Astraea — the sovereign celestial intelligence of ourchemistry.ai. How may I illuminate your journey toward resonance?',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, typing]);
  // Listen for global open-astraea triggers
  const askRef = useRef(null);
  askRef.current = ask;
  useEffect(() => {
    const handleOpen = (e) => {
      setOpen(true);
      if (e?.detail && askRef.current) {
        askRef.current(e.detail);
      }
    };
    window.addEventListener('open-astraea', handleOpen);
    return () => window.removeEventListener('open-astraea', handleOpen);
  }, []);


  // Voice speech synthesis read-aloud
  const speakText = useCallback(
    (text) => {
      if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
      try {
        window.speechSynthesis.cancel();
        const clean = text.replace(/[*_#`~]/g, '');
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis gracefully skipped if unsupported
      }
    },
    [speechEnabled]
  );

  // Speech Recognition (Voice Dictation Input)
  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = locale === 'ur' ? 'ur-PK' : locale === 'ar' ? 'ar-SA' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          ask(transcript);
        }
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setListening(false);
    }
  };

  const resetChat = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setMsgs([
      {
        from: 'bot',
        text: 'Astraea session cleared. The celestial slate is renewed. Ask me anything about voice, bond trials, or launch waves.',
      },
    ]);
  };

  const ask = async (text) => {
    const clean = (text || '').trim();
    if (!clean) return;

    const userMsg = { from: 'user', text: clean };
    setMsgs((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('/api/catalyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          locale,
          history: msgs.slice(-4),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText =
          data.reply ||
          'We engineered ourchemistry for celestial emotional resonance. Ask about our Voice DNA or the 7-Day Bond Protocol.';
        setTyping(false);
        setMsgs((m) => [...m, { from: 'bot', text: replyText, locked: true }]);
        speakText(replyText);
        return;
      }
    } catch {
      // Network failure fallback
    }

    const fallbackReply =
      'Astraea is resonating with your inquiry. We engineered ourchemistry for depth, voice truth, and sacred covenants. What element guides you?';
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: 'bot', text: fallbackReply, locked: true }]);
      speakText(fallbackReply);
    }, 500);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {open && (
        <div className="glass rounded-2xl w-84 sm:w-96 h-[460px] flex flex-col mb-3 overflow-hidden shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span
                className="w-7 h-7 rounded-full shadow-[0_0_12px_rgba(94,234,212,0.6)]"
                style={{ background: 'var(--grad)', animation: 'spin 8s linear infinite' }}
              />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <p className="font-display text-sm font-bold text-white tracking-wide">
                    Astraea
                  </p>
                  <span className="flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-950/60 text-[#5eead4] border border-[#5eead4]/30">
                    <Lock size={8} /> LOCKED
                  </span>
                </div>
                <p className="text-[10px] text-white/50 font-mono">Sovereign Celestial Intelligence</p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSpeechEnabled((s) => !s)}
                aria-label={speechEnabled ? 'Mute Astraea Voice' : 'Enable Astraea Voice'}
                title={speechEnabled ? 'Voice response enabled' : 'Voice response muted'}
                className={`p-1.5 rounded-lg transition ${
                  speechEnabled
                    ? 'text-[#5eead4] bg-[#5eead4]/15'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {speechEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
              <button
                onClick={resetChat}
                aria-label="Reset Conversation"
                title="Reset conversation"
                className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Astraea"
                title="Close"
                className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/5 transition"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages Window */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs leading-relaxed">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'text-end' : 'text-start'}>
                {m.from === 'bot' && (
                  <p className="text-[9px] font-mono text-cyan-300/60 mb-0.5 ml-1 flex items-center gap-1">
                    <Sparkles size={8} /> Astraea Core
                  </p>
                )}
                <span
                  className={`inline-block px-3.5 py-2 rounded-2xl max-w-[88%] shadow-sm ${
                    m.from === 'user'
                      ? 'bg-gradient-to-r from-[#a78bfa] to-[#818cf8] text-[#04060f] font-medium'
                      : 'bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm'
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {typing && (
              <div className="text-left">
                <p className="text-[9px] font-mono text-cyan-300/60 mb-0.5 ml-1">Astraea is contemplating…</p>
                <span className="inline-flex gap-1.5 px-3 py-2 rounded-2xl bg-white/10 border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#ff8fb2] animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                </span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-white/5 bg-black/20">
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => ask(c.replace(/^[^\w]+/, ''))}
                className="whitespace-nowrap text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#5eead4]/40 hover:bg-[#5eead4]/10 transition"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Input Bar with Voice Dictation */}
          <div className="flex items-center gap-1.5 p-2.5 border-t border-white/10 bg-black/40">
            <button
              onClick={toggleListening}
              type="button"
              aria-label={listening ? 'Stop listening' : 'Speak to Astraea'}
              title={listening ? 'Listening… click to stop' : 'Voice Dictation'}
              className={`p-2 rounded-full transition ${
                listening
                  ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                  : 'bg-white/5 text-white/60 hover:text-[#5eead4] hover:bg-white/10'
              }`}
            >
              {listening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask(input)}
              placeholder="Ask Astraea about voice, bonds, launch…"
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-3.5 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-[#5eead4] focus:ring-1 focus:ring-[#5eead4] transition"
            />

            <button
              onClick={() => ask(input)}
              disabled={!input.trim()}
              aria-label="Send query"
              className="bg-gradient-to-r from-[#5eead4] to-[#a78bfa] text-[#04060f] disabled:opacity-40 rounded-full p-2 text-xs font-semibold hover:brightness-110 transition shadow-sm"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Concierge Orb Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Astraea Sovereign AI Concierge"
        title="Open Astraea Sovereign AI"
        className="group relative orb-ring w-14 h-14 rounded-full grid place-items-center text-2xl shadow-glow transition duration-300 hover:scale-110"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, #5eead4, #a78bfa 60%, #ff8fb2)',
          boxShadow: '0 0 25px rgba(94,234,212,0.4)',
        }}
      >
        <span className="group-hover:rotate-12 transition-transform duration-300 text-xl">✨</span>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5eead4] opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#5eead4] border-2 border-[#04060f]" />
        </span>
      </button>
    </div>
  );
}
