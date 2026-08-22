'use client';

import { useEffect, useRef, useState } from 'react';

/* Natural mini waveform — uneven beats (HRV), breathing baseline, rounded P/T */
function buildWave(W, H, beats) {
    const r = Math.random;
    const mid = H / 2;
    const wAmp = H * (0.03 + r() * 0.04);
    const wF = 0.7 + r() * 0.8;
    const wP = r() * Math.PI * 2;
    const wander = (x) => mid + wAmp * Math.sin((x / W) * Math.PI * 2 * wF + wP);

    const hb = 1.5 + r() * 0.6;
    const hp = r() * Math.PI * 2;
    const widths = Array.from(
        { length: beats },
        (_, i) => 1 + 0.1 * Math.sin(i * hb + hp) + (r() - 0.5) * 0.08
    );
    const scale = W / widths.reduce((a, b) => a + b, 0);

    let amp = 0.9 + r() * 0.2;
    let x = 0;
    let d = `M 0 ${wander(0).toFixed(1)}`;

    for (let b = 0; b < beats; b++) {
        const w = widths[b] * scale;
        const at = (f) => wander(x + w * f);
        amp = Math.min(1.3, Math.max(0.7, amp + (r() - 0.5) * 0.22));

        const P = H * 0.12 * amp;
        const Q = H * 0.07 * amp;
        const R = H * (0.32 + r() * 0.14) * amp;
        const S = H * (0.12 + r() * 0.08) * amp;
        const T = H * 0.14 * amp;
        const q0 = 0.26 + r() * 0.06;

        const px = (f) => (x + w * f).toFixed(1);
        const py = (f, o = 0) => (at(f) + o).toFixed(1);

        d += ` L ${px(0.08)} ${py(0.08)}`;
        d += ` Q ${px(0.14)} ${py(0.14, -P)} ${px(0.2)} ${py(0.2)}`;
        d += ` L ${px(q0)} ${py(q0)}`;
        d += ` L ${px(q0 + 0.03)} ${py(q0 + 0.03, Q)}`;
        d += ` L ${px(q0 + 0.075)} ${py(q0 + 0.075, -R)}`;
        d += ` L ${px(q0 + 0.12)} ${py(q0 + 0.12, S)}`;
        d += ` L ${px(q0 + 0.17)} ${py(q0 + 0.17)}`;
        d += ` Q ${px(0.6)} ${py(0.6, -T)} ${px(0.72)} ${py(0.72)}`;
        d += ` L ${px(1)} ${py(1)}`;
        x += w;
    }
    d += ` L ${W} ${wander(W).toFixed(1)}`;
    return d;
}

/**
 * PulseStrip — the one small ECG, on every page.
 * Hover/touch → heart races (BPM climbs, sweep accelerates).
 * Release → eases back. Tap → spark beat. Reduced motion → static line.
 */
export default function PulseStrip({
    restBpm = 64,
    raceBpm = 128,
    width = 140,
    height = 26,
    beats = 3,
}) {
    const pathRef = useRef(null);
    const glowRef = useRef(null);
    const dotRef = useRef(null);
    const innerRef = useRef(null);
    const flashRef = useRef(null);
    const targetRef = useRef(restBpm);
    const [bpmOut, setBpmOut] = useState(restBpm);

    useEffect(() => {
        const path = pathRef.current;
        const glow = glowRef.current;
        const dot = dotRef.current;
        const inner = innerRef.current;
        if (!path || !glow) return;

        const d = buildWave(width, height, beats);
        path.setAttribute('d', d);
        glow.setAttribute('d', d);

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;

        const len = path.getTotalLength();
        glow.style.strokeDasharray = String(len);
        glow.style.strokeDashoffset = String(len);

        let bpm = restBpm;
        let phase = 0;
        let prog = 0;
        let last = performance.now();
        let lastUpd = 0;
        let raf = 0;

        const loop = (now) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;

            bpm += (targetRef.current - bpm) * Math.min(1, dt * 3.5);

            // lub-dub scale, retimes smoothly with BPM
            phase = (phase + (dt * bpm) / 60) % 1;
            const s =
                phase < 0.15
                    ? Math.sin((phase / 0.15) * Math.PI)
                    : phase < 0.32
                        ? Math.sin(((phase - 0.15) / 0.17) * Math.PI) * 0.55
                        : 0;
            if (inner) inner.style.transform = `scale(${1 + 0.045 * s})`;

            // sweep speed follows BPM
            prog += dt * (bpm / 60) * 0.4;
            if (prog > 1) prog -= 1;
            glow.style.strokeDashoffset = String(len * (1 - prog));

            // bright dot riding the sweep head
            if (dot) {
                const pt = path.getPointAtLength(len * prog);
                dot.setAttribute('cx', pt.x.toFixed(1));
                dot.setAttribute('cy', pt.y.toFixed(1));
            }

            if (now - lastUpd > 300) {
                lastUpd = now;
                setBpmOut(Math.round(bpm));
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [restBpm, width, height, beats]);

    const race = () => { targetRef.current = raceBpm; };
    const calm = () => { targetRef.current = restBpm; };

    const spark = () => {
        if (flashRef.current?.animate) {
            flashRef.current.animate(
                [{ opacity: 0 }, { opacity: 0.9 }, { opacity: 0 }],
                { duration: 480, easing: 'ease-out' }
            );
        }
        if (innerRef.current?.animate) {
            innerRef.current.animate(
                [{ transform: 'scale(1)' }, { transform: 'scale(1.16)' }, { transform: 'scale(1)' }],
                { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' }
            );
        }
    };

    return (
        <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 sm:bottom-16">
            <div ref={innerRef} style={{ transformOrigin: 'center' }}>
                <button
                    onPointerEnter={race}
                    onPointerLeave={calm}
                    onPointerCancel={calm}
                    onTouchEnd={calm}
                    onClick={spark}
                    aria-label="Pulse"
                    className="glass group relative flex cursor-pointer items-center gap-3 rounded-full px-4 py-1.5 transition-colors hover:border-[#5eead4]/40"
                >
                    <svg
                        width={width}
                        height={height}
                        viewBox={`0 0 ${width} ${height}`}
                        aria-hidden="true"
                        style={{ overflow: 'visible', display: 'block' }}
                    >
                        <defs>
                            <linearGradient id="ps-grad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0" stopColor="#5eead4" />
                                <stop offset="1" stopColor="#a78bfa" />
                            </linearGradient>
                        </defs>
                        {/* ghost — waveform at rest */}
                        <path ref={pathRef} fill="none" stroke="#5eead4" strokeOpacity="0.18" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
                        {/* living sweep */}
                        <path
                            ref={glowRef}
                            fill="none"
                            stroke="url(#ps-grad)"
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            style={{ filter: 'drop-shadow(0 0 5px #5eead4aa)' }}
                        />
                        {/* sweep head */}
                        <circle ref={dotRef} r="2" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 4px #5eead4)' }} />
                    </svg>

                    <span className="font-mono text-[10px] tabular-nums tracking-widest text-[#5eead4]">
                        {bpmOut}
                        <span className="ml-1 text-white/35">bpm</span>
                    </span>

                    {/* spark-beat flash */}
                    <span
                        ref={flashRef}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-full opacity-0"
                        style={{ background: 'radial-gradient(circle, rgba(94,234,212,0.5), transparent 70%)' }}
                    />
                </button>
            </div>
        </div>
    );
}
