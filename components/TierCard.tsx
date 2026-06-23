import Link from 'next/link';
import type { Tier } from '@/lib/content';

export type TierCardStatus = 'complete' | 'current' | 'skipped' | 'not-started' | 'not-yet-published';

interface TierCardProps {
  tier: Tier;
  tierLabel: string;
  tierTagline: string;
  startHref: string;
  status: TierCardStatus;
}

const TIER_NUMBER: Record<Tier, string> = { T1: '1', T2: '2', T3: '3', T4: '4' };

const STATUS_BADGE: Record<TierCardStatus, { text: string; className: string }> = {
  complete: { text: 'Complete', className: 'bg-ready-bg text-ready' },
  current: { text: 'Current', className: 'bg-white text-yellow-deep border border-yellow-deep' },
  skipped: { text: 'Skipped', className: 'bg-grey text-ink-2' },
  'not-started': { text: 'Not started', className: 'bg-white text-ink-2 border border-line-2' },
  'not-yet-published': { text: 'Not yet published', className: 'bg-grey text-ink-2' },
};

const CTA_BY_STATUS: Record<TierCardStatus, { label: string; variant: 'primary' | 'secondary' | 'muted' }> = {
  complete: { label: 'Review tier', variant: 'secondary' },
  current: { label: 'Begin tier', variant: 'primary' },
  skipped: { label: 'Revisit tier', variant: 'secondary' },
  'not-started': { label: 'Preview tier', variant: 'secondary' },
  'not-yet-published': { label: 'Coming later', variant: 'muted' },
};

export function TierCard({ tier, tierLabel, tierTagline, startHref, status }: TierCardProps) {
  const badge = STATUS_BADGE[status];
  const cta = CTA_BY_STATUS[status];
  const isClickable = status !== 'not-yet-published';

  const surface =
    status === 'current'
      ? 'border-navy bg-white shadow-raised'
      : status === 'complete'
        ? 'border-line-2 bg-white'
        : status === 'skipped'
          ? 'border-line bg-paper'
          : status === 'not-started'
            ? 'border-line-2 bg-white'
            : 'border-line bg-grey opacity-70';

  const numberDisc =
    status === 'complete'
      ? 'bg-navy text-white border-navy'
      : status === 'current'
        ? 'bg-yellow text-navy border-navy'
        : 'bg-white text-navy border-navy';

  const ctaClassName =
    cta.variant === 'primary'
      ? 'inline-flex items-center gap-2 rounded-control bg-navy px-4 py-2 font-sans text-body font-semibold text-white hover:bg-navy-deep motion-reduce:transition-none'
      : cta.variant === 'secondary'
        ? 'inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy hover:bg-navy hover:text-white motion-reduce:transition-none'
        : 'inline-flex items-center gap-2 rounded-control bg-grey px-4 py-2 font-sans text-body text-ink-3';

  const inner = (
    <div className={`grid grid-cols-[3rem_1fr_auto] items-center gap-4 rounded-card-lg border-[1.5px] p-5 ${surface}`}>
      <span
        aria-hidden="true"
        className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] text-h2 font-extrabold ${numberDisc}`}
      >
        {status === 'complete' ? <span aria-hidden="true">✓</span> : TIER_NUMBER[tier]}
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="font-sans text-h3 font-semibold text-navy">
          {tierLabel} <span className="font-mono text-mono-meta text-ink-2">· {tier}</span>
        </h3>
        <p className="font-serif text-body text-ink-2">{tierTagline}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className={`rounded-full px-3 py-0.5 text-eyebrow ${badge.className}`}>{badge.text}</span>
        {isClickable ? (
          <span className={ctaClassName}>
            {cta.label} <span aria-hidden="true">→</span>
          </span>
        ) : (
          <span className={ctaClassName} aria-disabled="true">
            {cta.label}
          </span>
        )}
      </div>
    </div>
  );

  if (!isClickable) {
    return <div>{inner}</div>;
  }

  return (
    <Link href={startHref} aria-label={`${cta.label}: ${tierLabel} (${tier})`} className="block">
      {inner}
    </Link>
  );
}
