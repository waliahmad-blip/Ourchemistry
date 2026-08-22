'use client';

import { useEffect, useRef } from 'react';

/* Full-screen twinkling starfield — DPR-aware, resize-safe, reduced-motion aware */
export default function Starfield({ density = 0.00012, speed = 0.06 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0, stars = [], w = 0, h = 0;

    const make = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.floor(w * h * density) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.2 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        tw: 0.4 + Math.random() * 1.3,
        vx: (Math.random() - 0.5) * speed,
      }));
    };

    make();
    const ro = new ResizeObserver(make);
    ro.observe(canvas);

    const draw = (ms) => {
      const t = ms / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.x = (s.x + s.vx + w) % w;
        const a = 0.22 + 0.5 * (0.5 + 0.5 * Math.sin(t * s.tw + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [density, speed]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
