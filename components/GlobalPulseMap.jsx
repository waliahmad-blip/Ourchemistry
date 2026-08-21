'use client';
import { useEffect, useRef } from 'react';

const PALETTE = ['94,234,212', '167,139,250', '255,143,178', '255,215,161'];

export default function GlobalPulseMap() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let raf = 0;
    let dots = [];

    const build = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(110, Math.floor((cssW * cssH) / 16000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * cssW,
        y: Math.random() * cssH,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1 + Math.random() * 1.8,
        p: Math.random() * Math.PI * 2,
        c: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      }));
    };

    const draw = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      ctx.clearRect(0, 0, cssW, cssH);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.p += 0.02;
        if (!reduced) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0) d.x = cssW;
          if (d.x > cssW) d.x = 0;
          if (d.y < 0) d.y = cssH;
          if (d.y > cssH) d.y = 0;
        }
        const a = 0.35 + Math.abs(Math.sin(d.p)) * 0.5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${d.c},${a})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(140,160,255,${(1 - dist / 110) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    build();
    draw();
    window.addEventListener('resize', build);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', build);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full -z-10 opacity-50 pointer-events-none"
    />
  );
}
