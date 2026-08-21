'use client';
import { useEffect, useRef } from 'react';

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export default function SigilArt({ seed, active, size = 240 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const rand = rng(seed || 1);
    const cx = size / 2;
    const cy = size / 2;
    const hue = Math.floor(rand() * 360);
    const hue2 = (hue + 60) % 360;

    // Outer orbital ring
    ctx.strokeStyle = `hsla(${hue}, 80%, 70%, 0.35)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.42, 0, Math.PI * 2);
    ctx.stroke();

    // Star polygon
    const points = 6 + Math.floor(rand() * 6);
    ctx.strokeStyle = `hsl(${hue}, 85%, 72%)`;
    ctx.lineWidth = 1.6;
    ctx.shadowColor = `hsla(${hue}, 90%, 60%, 0.6)`;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const ang = (i / points) * Math.PI * 2 - Math.PI / 2;
      const r = size * 0.18 + rand() * size * 0.22;
      const x = cx + Math.cos(ang) * r;
      const y = cy + Math.sin(ang) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Radial spokes
    ctx.strokeStyle = `hsla(${hue2}, 80%, 70%, 0.4)`;
    ctx.lineWidth = 1;
    for (let i = 0; i < points; i++) {
      const ang = (i / points) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * size * 0.08, cy + Math.sin(ang) * size * 0.08);
      ctx.lineTo(cx + Math.cos(ang) * size * 0.36, cy + Math.sin(ang) * size * 0.36);
      ctx.stroke();
    }

    // Orbiting particles
    for (let i = 0; i < 16; i++) {
      const ang = rand() * Math.PI * 2;
      const r = size * 0.1 + rand() * size * 0.34;
      const px = cx + Math.cos(ang) * r;
      const py = cy + Math.sin(ang) * r;
      ctx.fillStyle = `hsla(${(hue + Math.floor(rand() * 120)) % 360}, 85%, 72%, 0.85)`;
      ctx.beginPath();
      ctx.arc(px, py, 1.2 + rand() * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Core
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.12);
    grad.addColorStop(0, `hsla(${hue}, 90%, 80%, 0.9)`);
    grad.addColorStop(1, `hsla(${hue}, 90%, 60%, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }, [seed, size]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Your unique voice sigil"
      className={`rounded-2xl transition ${active ? 'animate-pulse' : ''}`}
      style={{ filter: 'drop-shadow(0 0 20px rgba(94,234,212,0.4))' }}
    />
  );
}
