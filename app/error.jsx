'use client';

export default function GlobalError({ error, reset }) {
  return (
    <main className="no-scroll grid place-items-center px-6">
      <div className="constellation-bg" aria-hidden="true" />
      <div className="text-center max-w-md glass rounded-3xl p-10">
        <p className="font-mono text-[#ff8fb2] tracking-[0.35em] uppercase text-xs mb-4">
          Reaction Interrupted
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          Something destabilized the bond.
        </h1>
        <p className="text-white/60 mb-8">
          An unexpected error occurred. The lab is stable — try re-running the
          reaction, or head back to the beginning.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => reset()}
            className="btn-shine bg-[#5eead4] text-[#04060f] font-semibold px-6 py-3 rounded-full hover:scale-105 transition"
          >
            Try again ↺
          </button>
          <a
            href="/en"
            className="glass px-6 py-3 rounded-full text-white/80 hover:text-[#5eead4] transition"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
