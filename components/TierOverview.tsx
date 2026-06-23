'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Markdown } from './Markdown';
import type { Pathway, Tier } from '@/lib/content';
import { manuallySkipTier, setPathway } from '@/lib/progress';

interface TierOverviewProps {
  pathway: Pathway;
  pathwaySlug: string;
  moduleId: string;
  tier: Tier;
  moduleTitle: string;
  tierName: string;
  estimatedTime?: string;
  skipPrefaceMarkdown: string | null;
}

const TIER_ORDER: Tier[] = ['T1', 'T2', 'T3', 'T4'];

function nextTierOf(tier: Tier): Tier | null {
  const idx = TIER_ORDER.indexOf(tier);
  if (idx === -1 || idx === TIER_ORDER.length - 1) return null;
  return TIER_ORDER[idx + 1];
}

function beginHrefFor(pathwaySlug: string, moduleId: string, tier: Tier): string {
  const stage = tier === 'T4' ? 'exercise' : 'scenario';
  return `/${pathwaySlug}/${moduleId}/${tier}/${stage}`;
}

export function TierOverview({
  pathway,
  pathwaySlug,
  moduleId,
  tier,
  moduleTitle,
  tierName,
  estimatedTime,
  skipPrefaceMarkdown,
}: TierOverviewProps) {
  const router = useRouter();
  const [skipping, setSkipping] = useState(false);

  useEffect(() => {
    setPathway(pathway);
  }, [pathway]);

  const moduleNumber = moduleId.slice(1);
  const moduleHref = `/${pathwaySlug}/${moduleId}`;
  const beginHref = beginHrefFor(pathwaySlug, moduleId, tier);
  const next = nextTierOf(tier);
  const skipDestination = next ? `/${pathwaySlug}/${moduleId}/${next}` : moduleHref;

  const onSkip = () => {
    if (skipping) return;
    setSkipping(true);
    setPathway(pathway);
    manuallySkipTier(pathway, moduleId, tier, 'self-check');
    router.push(skipDestination);
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      <header className="flex flex-col gap-2">
        <p className="text-eyebrow text-yellow-deep">
          Module {moduleNumber} · {pathway} pathway · {tier}
        </p>
        <h1 className="text-h1 font-extrabold text-navy">{moduleTitle}</h1>
        <p className="text-eyebrow text-ink-2">
          {tierName}
          {estimatedTime ? ` · ~${estimatedTime} read` : ''}
        </p>
      </header>

      {skipPrefaceMarkdown ? (
        <section
          aria-labelledby="tier-self-check-heading"
          className="flex flex-col gap-3 rounded-card border border-line bg-white p-6"
        >
          <h2
            id="tier-self-check-heading"
            className="text-eyebrow text-yellow-deep"
          >
            Self-check before starting
          </h2>
          <Markdown source={skipPrefaceMarkdown} variant="reading" />
          <p className="text-body text-ink-2">
            Skipping is a normal, confident choice — the tier stays available from the
            module hub if you want to come back to it.
          </p>
        </section>
      ) : null}

      <nav aria-label="Tier actions" className="flex flex-wrap gap-3 border-t border-line pt-6">
        <Link
          href={moduleHref}
          className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy transition hover:bg-navy hover:text-white motion-reduce:transition-none"
        >
          <span aria-hidden="true">←</span> Back to Module {moduleNumber}
        </Link>
        <button
          type="button"
          onClick={onSkip}
          disabled={skipping}
          aria-busy={skipping || undefined}
          className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy transition hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
        >
          {skipping
            ? next
              ? `Skipping to ${next}…`
              : 'Returning to module hub…'
            : next
              ? `Skip — go to ${next}`
              : 'Skip — back to module hub'}
        </button>
        <Link
          href={beginHref}
          className="inline-flex items-center gap-2 rounded-control bg-navy px-4 py-2 font-sans text-body font-semibold text-white transition hover:bg-navy-deep motion-reduce:transition-none"
        >
          Begin {tierName.replace(/\s+tier$/i, '')} <span aria-hidden="true">→</span>
        </Link>
      </nav>
    </div>
  );
}
