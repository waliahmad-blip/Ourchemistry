'use client';

import { useEffect, useRef } from 'react';

/* Full-screen starfield: twinkling, drifting, occasional shooting star. Inline z-index — no CSS dependency. */
export default function Starfield({ density = 0.00014 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0, stars = [], shooters = [], w = 0, h = 0;

    const make = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.floor(w * h * density) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: 0.3 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        tw: 0.4 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.08,
      }));
    };
    make();
    const ro = new ResizeObserver(make);
    ro.observe(canvas);

    const spawnShooter = () => {
      shooters.push({
        x: Math.random() * w * 0.6, y: Math.random() * h * 0.4,
        vx: 7 + Math.random() * 5, vy: 3 + Math.random() * 2, life: 1,
      });
      setTimeout(spawnShooter, 6000 + Math.random() * 9000);
    };
    const st = setTimeout(spawnShooter, 3500);

    const draw = (ms) => {
      const t = ms / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.x = (s.x + s.vx + w) % w;
        const a = 0.35 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.tw + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      }
      shooters = shooters.filter((sh) => sh.life > 0);
      for (const sh of shooters) {
        sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.02;
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 8, sh.y - sh.vy * 8);
        grad.addColorStop(0, `rgba(255,255,255,${sh.life})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 8, sh.y - sh.vy * 8);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(0); cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => { cancelAnimationFrame(raf); ro.disconnect(); clearTimeout(st); };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: -2 }}
    />
  );
}
