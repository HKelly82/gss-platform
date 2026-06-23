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
        // Type scale tuned ~15-20% smaller than DESIGN-LANGUAGE §2 spec values
        // after desktop UAT feedback (2026-06-23): spec values felt heavy on
        // desktop. Body kept at 16px (1rem) for WCAG 1.4.4 / 200% zoom comfort.
        display: ['2rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        h1: ['1.625rem', { lineHeight: '1.15', fontWeight: '800' }],
        h2: ['1.25rem', { lineHeight: '1.25', fontWeight: '700' }],
        h3: ['1.0625rem', { lineHeight: '1.35', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.6' }],
        reading: ['1.0625rem', { lineHeight: '1.65' }],
        lede: ['1.1875rem', { lineHeight: '1.5' }],
        eyebrow: ['0.75rem', { lineHeight: '1', fontWeight: '600', letterSpacing: '0.08em' }],
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
        scenario: '760px',
        landing: '1000px',
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
