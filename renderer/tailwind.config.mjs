/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mount: {
          bg: '#0c0a1a',
          surface: '#1a1825',
          'surface-hover': '#24213c',
          accent: '#8b5cf6',
          'accent-light': '#a78bfa',
          cyan: '#22d3ee',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-key': 'pulse-key 0.3s ease-out',
        'fade-in': 'fade-in 0.35s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        'pulse-key': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.15)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
