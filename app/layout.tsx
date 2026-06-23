import type { Metadata } from 'next';
import { Public_Sans, Source_Serif_4, IBM_Plex_Mono } from 'next/font/google';
import { SkipLink } from '@/components/SkipLink';
import { AppBar } from '@/components/AppBar';
import './globals.css';

const sans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GSS Platform — Herd Learn',
  description: 'Government Service Standard e-learning platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className="bg-paper font-sans text-ink">
        <SkipLink />
        <AppBar tone="light" />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
