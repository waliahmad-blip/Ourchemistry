'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="no-scroll grid place-items-center px-6">
      <div className="constellation-bg" aria-hidden="true" />
      <div className="text-center max-w-md glass rounded-3xl p-10">
        <p className="font-mono text-[#5eead4] tracking-[0.35em] uppercase text-xs mb-4">
          404 · Unbonded
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold grad-text mb-4">
          This element does not exist yet.
        </h1>
        <p className="text-white/60 mb-8">
          The page you are looking for drifted out of orbit. Return to the lab and
          let us find your resonance.
        </p>
        <Link
          href="/en"
          className="btn-shine inline-block bg-[#5eead4] text-[#04060f] font-semibold px-6 py-3 rounded-full hover:scale-105 transition"
        >
          Back to the lab ⚗
        </Link>
      </div>
    </main>
  );
}

