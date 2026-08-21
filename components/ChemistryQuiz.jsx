'use client';
import { useState } from 'react';

const FALLBACK = {
  title: 'Which element are you?',
  share: 'Share my element ✦',
  again: 'Take it again ↺',
  questions: [
    { q: 'Your ideal first bond looks like…', a: ['A 2am voice note', 'A silent walk', 'Trading playlists', 'Cooking together'] },
    { q: 'What matters most?', a: ['Depth', 'Humor', 'Faith', 'Ambition'] },
    { q: 'A perfect evening is…', a: ['Stargazing', 'A long talk', 'A shared hobby', 'Quiet presence'] },
  ],
  elements: [
    { s: 'Ne', n: 'Neon', t: 'Emotionally luminous. You bond slowly and glow longer than anyone expects.' },
    { s: 'O', n: 'Oxygen', t: 'You make every bond breathe. People feel lighter the moment you arrive.' },
    { s: 'Au', n: 'Gold', t: 'Rare, warm, and gloriously unreactive with the wrong people.' },
    { s: 'C', n: 'Carbon', t: 'The backbone element. Every real bond you form becomes structural.' },
  ],
};

export default function ChemistryQuiz({ dict }) {
  const data = dict.quiz && dict.quiz.questions ? dict.quiz : FALLBACK;
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const answer = (i) => {
    setScores((s) => {
      const next = [...s];
      next[i] += 1;
      return next;
    });
    if (step + 1 >= data.questions.length) setDone(true);
    else setStep((s) => s + 1);
  };

  const winIdx = scores.indexOf(Math.max(...scores));
  const el = data.elements[winIdx] || FALLBACK.elements[winIdx];
  const progress = (step / data.questions.length) * 100;

  const restart = () => {
    setStep(0);
    setScores([0, 0, 0, 0]);
    setDone(false);
    setCopied(false);
  };

  const share = async () => {
    const text = `I am ${el.n} on ourchemistry.ai ⚗ The science of us.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[#5eead4] tracking-[0.3em] uppercase text-xs mb-3">
        Know Thyself
      </p>
      <h2 className="font-display text-3xl font-bold mb-8 grad-text">{data.title}</h2>

      <div className="w-full max-w-md">
        <div className="h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${done ? 100 : progress}%`, background: 'var(--grad)' }}
          />
        </div>

        {!done ? (
          <>
            <p className="text-lg text-white/80 mb-6">{data.questions[step].q}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.questions[step].a.map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => answer(i)}
                  className="glass rounded-xl p-4 text-sm text-left hover:border-[#5eead4] hover:translate-x-1 transition"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ animation: 'pop .6s' }}>
            <div className="glass rounded-2xl w-32 h-32 mx-auto grid place-items-center mb-4 shadow-glow">
              <span className="font-display text-5xl font-bold grad-text">{el.s}</span>
            </div>
            <p className="font-display text-2xl font-bold text-white mb-2">
              You are {el.n}
            </p>
            <p className="text-white/50 text-sm max-w-sm mx-auto mb-6">{el.t}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={share}
                className="btn-shine bg-[#5eead4] text-[#04060f] font-semibold px-5 py-2.5 rounded-full"
              >
                {copied ? 'Copied ✓' : data.share}
              </button>
              <button
                onClick={restart}
                className="glass px-5 py-2.5 rounded-full hover:text-[#5eead4] transition"
              >
                {data.again}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
