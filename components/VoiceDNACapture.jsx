'use client';
import { useEffect, useRef, useState } from 'react';
import SigilArt from './SigilArt';
import { useAppStore } from '../lib/store';
import {
  yinPitchDetector,
  analyzePitchStability,
  generateVoiceDnaVector,
} from '../lib/dsp/pitchDetector';

export default function VoiceDNACapture({ dict }) {
  const setVoiceDna = useAppStore((s) => s.setVoiceDna);
  const [recording, setRecording] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [seed, setSeed] = useState(0);
  const [level, setLevel] = useState(0);
  const [dnaMetrics, setDnaMetrics] = useState(null);

  const mediaRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(0);
  const pitchHistoryRef = useRef([]);
  const spectrumSampleRef = useRef([]);

  const cleanup = () => {
    cancelAnimationFrame(rafRef.current);
    if (mediaRef.current) {
      mediaRef.current.getTracks().forEach((t) => t.stop());
      mediaRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
    }
    setLevel(0);
  };

  useEffect(() => () => cleanup(), []);

  const finish = () => {
    cleanup();
    setRecording(false);
    setCaptured(true);

    const stabilityAnalysis = analyzePitchStability(pitchHistoryRef.current);
    const dnaResult = generateVoiceDnaVector({
      medianPitch: stabilityAnalysis.medianPitch,
      stability: stabilityAnalysis.stability,
      frequencySpectrum: spectrumSampleRef.current,
    });

    setSeed(dnaResult.deterministicSeed);
    setDnaMetrics(dnaResult);
    setVoiceDna(dnaResult);
    if (navigator.vibrate) navigator.vibrate([60, 40, 80]);
  };

  const toggle = async () => {
    if (recording) {
      finish();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setCaptured(true);
      const fallback = generateVoiceDnaVector({ medianPitch: 160, stability: 0.85 });
      setSeed(fallback.deterministicSeed);
      setDnaMetrics(fallback);
      setVoiceDna(fallback);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new Ctx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.8;

      audioCtx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const timeData = new Float32Array(analyser.fftSize);

      mediaRef.current = stream;
      ctxRef.current = audioCtx;
      pitchHistoryRef.current = [];
      spectrumSampleRef.current = [];
      setRecording(true);
      setCaptured(false);

      let frameCount = 0;
      const loop = () => {
        analyser.getByteFrequencyData(data);
        analyser.getFloatTimeDomainData(timeData);

        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        const curLevel = Math.min(1, sum / data.length / 128);
        setLevel(curLevel);

        frameCount++;
        if (frameCount % 4 === 0 && curLevel > 0.05) {
          const detected = yinPitchDetector(timeData, audioCtx.sampleRate);
          if (detected.pitchHz > 65) {
            pitchHistoryRef.current.push(detected.pitchHz);
          }
          if (spectrumSampleRef.current.length < 32) {
            spectrumSampleRef.current = Array.from(data.slice(0, 32));
          }
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();

      // Auto-stop after 15 seconds
      setTimeout(() => {
        setRecording((r) => {
          if (r) finish();
          return r;
        });
      }, 15000);
    } catch {
      setCaptured(true);
      const fallback = generateVoiceDnaVector({ medianPitch: 160, stability: 0.85 });
      setSeed(fallback.deterministicSeed);
      setDnaMetrics(fallback);
      setVoiceDna(fallback);
    }
  };

  const orbScale = recording ? 1 + level * 0.35 : 1;

  return (
    <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
      <h2 className="font-display text-3xl font-bold mb-3 grad-text">{dict.voice.title}</h2>
      <p className="text-white/60 max-w-md mb-8">{dict.voice.sub}</p>

      <div className="mb-6 relative">
        {captured || !recording ? (
          <SigilArt seed={seed} active={recording} />
        ) : (
          <div className="grid place-items-center" style={{ width: 240, height: 240 }}>
            <div
              className="orb-ring w-32 h-32 rounded-full grid place-items-center transition-transform duration-75"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, rgba(103,232,249,0.9), rgba(167,139,250,0.55) 55%, rgba(255,143,178,0.35))',
                transform: `scale(${orbScale})`,
              }}
            >
              <span className="text-3xl">🎤</span>
            </div>
          </div>
        )}
      </div>

      {recording && (
        <div className="wave mb-6" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      )}

      <button
        onClick={toggle}
        className={`btn-shine px-6 py-3 rounded-full font-semibold transition ${
          recording
            ? 'bg-[#ff8fb2] text-[#04060f]'
            : 'bg-[#5eead4] text-[#04060f] hover:scale-105'
        }`}
      >
        {recording ? '⏹ Stop' : `🎙 ${dict.voice.record}`}
      </button>

      {captured && (
        <div className="mt-4 flex flex-col items-center gap-1.5" style={{ animation: 'pop .4s ease' }}>
          <p className="text-[#5eead4] font-semibold">✓ {dict.voice.capture}</p>
          {dnaMetrics && (
            <div className="flex items-center gap-2 font-mono text-[11px] text-white/60">
              <span className="text-[#ffd7a1]">Resonance {dnaMetrics.resonance}%</span>
              <span>•</span>
              <span className="text-teal-300">Warmth {dnaMetrics.warmth}%</span>
              <span>•</span>
              <span className="text-pink-300/80">{dnaMetrics.acousticHash.slice(0, 16)}…</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 glass rounded-2xl p-4 max-w-md">
        <h4 className="text-[#ffd7a1] text-sm font-semibold">🔐 {dict.voice.onDevice}</h4>
        <p className="text-white/50 text-xs mt-1">{dict.voice.onDeviceSub}</p>
      </div>
    </section>
  );
}
