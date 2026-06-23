import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#36384B', deep: '#2B2D3D', soft: '#4C4F66' },
        ink: { DEFAULT: '#2C2E3A', 2: '#585B6C', 3: '#83869A' },
        yellow: { DEFAULT: '#F6CE4C', deep: '#9A7212' },
        grey: '#E9EAE4',
        paper: '#F6F6F2',
        line: { DEFAULT: '#E3E3DC', 2: '#CFCFC7' },
        ready: { DEFAULT: '#2F7A52', bg: '#E8F1EB' },
        develop: { DEFAULT: '#9A6B12', bg: '#F6EEDB' },
        attention: { DEFAULT: '#B0322F', bg: '#F6E6E4' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Menlo', 'monospace'],
      },
      fontSize: {
        display: ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        h1: ['2rem', { lineHeight: '1.1', fontWeight: '800' }],
        h2: ['1.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        h3: ['1.1875rem', { lineHeight: '1.3', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.6' }],
        reading: ['1.1875rem', { lineHeight: '1.68' }],
        lede: ['1.3125rem', { lineHeight: '1.5' }],
        eyebrow: ['0.8125rem', { lineHeight: '1', fontWeight: '600', letterSpacing: '0.08em' }],
        'mono-meta': ['0.6875rem', { lineHeight: '1.2' }],
      },
      borderRadius: {
        control: '4px',
        card: '8px',
        'card-lg': '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(40,40,30,.09)',
        raised: '0 4px 16px rgba(54,56,75,.08)',
        lift: '0 6px 20px rgba(54,56,75,.10)',
      },
      maxWidth: {
        prose: '720px',
        hub: '1180px',
      },
      ringColor: {
        DEFAULT: '#F6CE4C',
      },
      ringWidth: {
        DEFAULT: '3px',
      },
    },
  },
  plugins: [],
};

export default config;
