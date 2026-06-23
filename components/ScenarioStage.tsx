import Link from 'next/link';
import { Markdown } from './Markdown';
import type { Tier } from '@/lib/content';

interface ScenarioStageProps {
  pathwaySlug: string;
  moduleId: string;
  tier: Tier;
  moduleTitle: string;
  tierName: string;
  narrativeMarkdown: string;
}

export function ScenarioStage({
  pathwaySlug,
  moduleId,
  tier,
  moduleTitle,
  tierName,
  narrativeMarkdown,
}: ScenarioStageProps) {
  const backHref = `/${pathwaySlug}/${moduleId}/${tier}`;
  const guidedHref = `/${pathwaySlug}/${moduleId}/${tier}/guided`;
  return (
    <article className="relative min-h-screen w-full bg-navy-deep text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-scenario items-center justify-between px-6 py-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-control text-eyebrow uppercase tracking-[0.08em] text-white/70 transition hover:text-white motion-reduce:transition-none"
          >
            <span aria-hidden="true">←</span> Back to {tier} overview
          </Link>
          <span className="text-eyebrow text-white/70">Component 1 of 4</span>
        </div>
      </header>

      <div className="mx-auto max-w-scenario px-6 py-12 sm:py-16">
        <p className="text-eyebrow uppercase tracking-[0.08em] text-yellow">Anchor scenario</p>
        <h1 className="mt-3 text-display font-extrabold text-white">{moduleTitle}</h1>
        <p className="mt-4 text-eyebrow text-white/70">{tierName}</p>

        <div className="mt-10">
          <Markdown source={narrativeMarkdown} variant="scenario-dark" />
        </div>

        <div className="mt-12">
          <Link
            href={guidedHref}
            className="inline-flex items-center gap-2 rounded-card bg-yellow px-5 py-3 font-sans text-body font-semibold text-navy transition hover:bg-yellow/90 focus-visible:shadow-[0_0_0_3px_white] motion-reduce:transition-none"
          >
            Begin the guided content
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
