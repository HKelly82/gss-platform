'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TierCard, type TierCardStatus } from './TierCard';
import type { ModuleMeta, Pathway, Tier } from '@/lib/content';
import { setPathway, useProgress } from '@/lib/progress';

interface ModuleHubProps {
  pathway: Pathway;
  pathwaySlug: string;
  moduleMeta: ModuleMeta;
  hasSupplement: boolean;
  allModules: ModuleMeta[];
}

const TIER_LABELS: Record<Tier, { label: string; tagline: string }> = {
  T1: { label: 'Intro', tagline: 'What it is and why it matters.' },
  T2: { label: 'Foundations', tagline: 'How it works, with concrete examples.' },
  T3: { label: 'Advanced', tagline: 'Field tensions and assessment evidence.' },
  T4: { label: 'Expert', tagline: 'Teaching, advising, and panel thinking.' },
};

const TIER_ORDER: Tier[] = ['T1', 'T2', 'T3', 'T4'];

function tierStartHref(pathwaySlug: string, moduleId: string, tier: Tier): string {
  const stage = tier === 'T4' ? 'exercise' : 'scenario';
  return `/${pathwaySlug}/${moduleId}/${tier}/${stage}`;
}

export function ModuleHub({ pathway, pathwaySlug, moduleMeta, hasSupplement, allModules }: ModuleHubProps) {
  const progress = useProgress();

  useEffect(() => {
    setPathway(pathway);
  }, [pathway]);

  const modProgress = progress?.pathways?.[pathway]?.modules?.[moduleMeta.moduleId];
  const placement = modProgress?.placement;
  const tiersProgress = modProgress?.tiers ?? {};
  const moduleNumber = moduleMeta.moduleId.slice(1);

  const currentTier: Tier | null =
    TIER_ORDER.find((t) => {
      const tp = tiersProgress[t];
      return !(tp?.tierComplete || tp?.skipped);
    }) ?? null;

  const statusFor = (tier: Tier): TierCardStatus => {
    if (!moduleMeta.availableTiers.includes(tier)) return 'not-yet-published';
    const tp = tiersProgress[tier];
    if (tp?.tierComplete) return 'complete';
    if (tp?.skipped) return 'skipped';
    if (tier === currentTier) return 'current';
    return 'not-started';
  };

  return (
    <div className="grid grid-cols-1 gap-8 pb-16 lg:grid-cols-[312px_1fr]">
      <Sidebar
        pathway={pathway}
        pathwaySlug={pathwaySlug}
        currentModuleId={moduleMeta.moduleId}
        allModules={allModules}
      />
      <div className="flex flex-col gap-8">
        <header>
          <p className="text-eyebrow text-yellow-deep">
            Module {moduleNumber} · {pathway} pathway
          </p>
          <h1 className="mt-2 text-h1 font-extrabold text-navy">{moduleMeta.moduleTitle}</h1>
        </header>

      {!placement ? (
        <section
          aria-label="Module-entry diagnostic"
          className="relative flex flex-col gap-2 overflow-hidden rounded-card-lg border-[1.5px] border-line-2 bg-white p-6 before:absolute before:left-0 before:top-0 before:h-full before:w-[6px] before:bg-yellow before:content-['']"
        >
          <p className="text-eyebrow text-yellow-deep">Start here</p>
          <h2 className="font-sans text-h3 font-semibold text-navy">
            Take the module-entry placement diagnostic
          </h2>
          <p className="font-serif text-body text-ink-2">
            A single scenario question places you at the right tier. No pass, no fail.
            Skipping a tier is a confident choice — the diagnostic respects what you already
            hold.
          </p>
          <div className="mt-2">
            <Link
              href={`/${pathwaySlug}/${moduleMeta.moduleId}/diagnostic`}
              className="inline-flex items-center gap-2 rounded-control bg-navy px-4 py-2 font-sans text-body font-semibold text-white transition hover:bg-navy-deep motion-reduce:transition-none"
            >
              Take the diagnostic <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      ) : (
        <section
          aria-label="Placement recap"
          className="flex flex-col gap-2 rounded-card border border-line bg-white p-4"
        >
          <p className="text-eyebrow text-ready">
            <span aria-hidden="true">✓ </span>Placement recorded
          </p>
          <p className="font-serif text-body text-ink">
            Diagnostic placed you at <strong className="text-navy">{TIER_LABELS[placement.landedAt].label}</strong>{' '}
            ({placement.landedAt}). Lower tiers are marked as skipped — revisit any tier whenever you want.
          </p>
          <div>
            <Link
              href={`/${pathwaySlug}/${moduleMeta.moduleId}/diagnostic`}
              className="font-sans text-body text-navy underline decoration-yellow decoration-2 underline-offset-2"
            >
              Re-take the diagnostic
            </Link>
          </div>
        </section>
      )}

      <section aria-label="Tiers in this module" className="flex flex-col gap-4">
        <p className="text-eyebrow text-yellow-deep">Tiers in this module</p>
        <ol className="flex flex-col gap-3">
          {TIER_ORDER.map((tier) => (
            <li key={tier}>
              <TierCard
                tier={tier}
                tierLabel={TIER_LABELS[tier].label}
                tierTagline={TIER_LABELS[tier].tagline}
                startHref={tierStartHref(pathwaySlug, moduleMeta.moduleId, tier)}
                status={statusFor(tier)}
              />
            </li>
          ))}
        </ol>
      </section>

      <nav aria-label="Module navigation" className="flex flex-wrap gap-3 border-t border-line pt-6">
        <Link
          href={`/${pathwaySlug}`}
          className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy transition hover:bg-navy hover:text-white motion-reduce:transition-none"
        >
          <span aria-hidden="true">←</span> Pathway home
        </Link>
        <Link
          href={`/${pathwaySlug}/${moduleMeta.moduleId}/reference`}
          className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy transition hover:bg-navy hover:text-white motion-reduce:transition-none"
        >
          Reference card
        </Link>
        {hasSupplement ? (
          <Link
            href={`/${pathwaySlug}/${moduleMeta.moduleId}/supplement`}
            className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy transition hover:bg-navy hover:text-white motion-reduce:transition-none"
          >
            {pathway} supplement
          </Link>
        ) : (
          <span
            aria-disabled="true"
            title={`No ${pathway} supplement for Module ${moduleMeta.moduleId.slice(1)}`}
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-control border border-line bg-grey px-4 py-2 font-sans text-body font-semibold text-ink-3"
          >
            {pathway} supplement — not yet available
          </span>
        )}
      </nav>
      </div>
    </div>
  );
}
