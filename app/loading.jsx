export default function Loading() {
  return (
    <main className="no-scroll grid place-items-center">
      <div className="constellation-bg" aria-hidden="true" />
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-14 h-14 rounded-full orb-ring"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #5eead4, #a78bfa 60%, #ff8fb2)',
            animation: 'spin 2.4s linear infinite',
          }}
        />
        <p className="font-mono text-[#5eead4] tracking-[0.3em] uppercase text-xs">
          Catalyzing…
        </p>
      </div>
    </main>
  );
}
