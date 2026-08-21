/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        night: '#04060f',
        noor: {
          gold: '#ffd7a1',
          rose: '#ff8fb2',
          violet: '#a78bfa',
          mint: '#67e8f9',
          cyan: '#5eead4',
        },
      },
      boxShadow: {
        glow: '0 0 80px rgba(94, 234, 212, 0.18)',
        'glow-sm': '0 0 24px rgba(94, 234, 212, 0.35)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
