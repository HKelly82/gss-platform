'use client';

import Link from 'next/link';
import { BrandLockup } from './BrandLockup';
import { useProgress } from '@/lib/progress';

interface AppBarProps {
  tone?: 'light' | 'navy';
}

export function AppBar({ tone = 'light' }: AppBarProps) {
  const progress = useProgress();
  const pathway = progress?.pathway;

  const bg = tone === 'navy' ? 'bg-navy text-white' : 'bg-white text-ink border-b border-line';

  return (
    <header className={bg}>
      <div className="mx-auto flex max-w-hub items-center justify-between px-6 py-4">
        <Link href="/" className="rounded-control" aria-label="Herd Learn — home">
          <BrandLockup />
        </Link>
        {pathway ? (
          <span className="text-eyebrow uppercase tracking-[0.08em] text-ink-2">
            Pathway: <span className="text-ink">{pathway}</span>
          </span>
        ) : (
          <span className="text-eyebrow uppercase tracking-[0.08em] text-ink-3">
            No pathway selected
          </span>
        )}
      </div>
    </header>
  );
}
