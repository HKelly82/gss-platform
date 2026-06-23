import Link from 'next/link';
import { Markdown } from './Markdown';
import type { Pathway, Tier } from '@/lib/content';

interface SupplementProps {
  pathway: Pathway;
  pathwaySlug: string;
  moduleId: string;
  displayTitle: string;
  bodyMarkdown: string;
  floorTier: Tier;
}

const TIER_LABEL: Record<Tier, string> = {
  T1: 'Intro',
  T2: 'Foundations',
  T3: 'Advanced',
  T4: 'Expert',
};

export function Supplement({
  pathway,
  pathwaySlug,
  moduleId,
  displayTitle,
  bodyMarkdown,
  floorTier,
}: SupplementProps) {
  const moduleNumber = moduleId.slice(1);
  const moduleHref = `/${pathwaySlug}/${moduleId}`;
  return (
    <div className="flex flex-col gap-8 pb-16">
      <nav aria-label="Supplement actions" className="flex flex-wrap gap-3">
        <Link
          href={moduleHref}
          className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy hover:bg-navy hover:text-white motion-reduce:transition-none"
        >
          <span aria-hidden="true">←</span> Back to Module {moduleNumber}
        </Link>
      </nav>

      <article>
        <header>
          <p className="text-eyebrow text-yellow-deep">
            {pathway} supplement · Module {moduleNumber}
          </p>
          <h1 className="mt-2 text-h1 font-extrabold text-navy">{displayTitle}</h1>
          <p className="mt-3 text-eyebrow text-ink-2">
            Floor: {moduleId} {TIER_LABEL[floorTier]} ({floorTier})
          </p>
        </header>

        <div className="mt-10">
          <Markdown source={bodyMarkdown} variant="reading-reference" />
        </div>
      </article>
    </div>
  );
}
