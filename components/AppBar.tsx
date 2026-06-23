'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLockup } from './BrandLockup';
import { useProgress } from '@/lib/progress';

interface AppBarProps {
  tone?: 'light' | 'navy';
}

const IMMERSIVE_ROUTE_RE = /^\/[a-z]+\/M\d+\/T[1-4]\/scenario$/;

export function AppBar({ tone = 'light' }: AppBarProps) {
  const pathname = usePathname();
  const progress = useProgress();
  const pathway = progress?.pathway;

  if (pathname && IMMERSIVE_ROUTE_RE.test(pathname)) {
    return null;
  }

  const bg = tone === 'navy' ? 'bg-navy text-white' : 'bg-white text-ink border-b border-line';

  return (
    <header className={`${bg} print:hidden`}>
      <div className="mx-auto flex max-w-hub items-center justify-between px-6 py-4">
        <Link href="/" className="rounded-control" aria-label="Herd Learn — home">
          <BrandLockup />
        </Link>
        {pathway ? (
          <span className="text-eyebrow text-ink-2">
            Pathway: <span className="text-ink">{pathway}</span>
          </span>
        ) : (
          <span className="text-eyebrow text-ink-2">
            No pathway selected
          </span>
        )}
      </div>
    </header>
  );
}
