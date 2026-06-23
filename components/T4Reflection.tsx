'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Markdown } from './Markdown';
import type { Pathway, Tier } from '@/lib/content';
import { markTierComplete, setPathway } from '@/lib/progress';

interface T4ReflectionProps {
  pathway: Pathway;
  pathwaySlug: string;
  moduleId: string;
  tier: Tier;
  moduleTitle: string;
  tierName: string;
  bodyMarkdown: string;
}

interface DotProps {
  state: 'done' | 'current' | 'upcoming';
}

function Dot({ state }: DotProps) {
  const className =
    state === 'current'
      ? 'h-2.5 w-2.5 rounded-full bg-yellow'
      : state === 'done'
        ? 'h-2 w-2 rounded-full bg-navy'
        : 'h-2 w-2 rounded-full bg-line-2';
  return <span aria-hidden="true" className={className} />;
}

export function T4Reflection({
  pathway,
  pathwaySlug,
  moduleId,
  tier,
  moduleTitle,
  tierName,
  bodyMarkdown,
}: T4ReflectionProps) {
  const router = useRouter();
  const [completing, setCompleting] = useState(false);

  const answerHref = `/${pathwaySlug}/${moduleId}/${tier}/answer`;
  const moduleHref = `/${pathwaySlug}/${moduleId}`;

  const onComplete = () => {
    if (completing) return;
    setCompleting(true);
    setPathway(pathway);
    markTierComplete(pathway, moduleId, tier);
    router.push(moduleHref);
  };

  return (
    <>
      <article className="pb-8">
        <header>
          <p className="text-eyebrow text-yellow-deep">Reflection</p>
          <h1 className="mt-2 text-h1 font-extrabold text-navy">{moduleTitle}</h1>
          <p className="mt-3 text-eyebrow text-ink-2">{tierName}</p>
        </header>
        <div className="mt-10">
          <Markdown source={bodyMarkdown} variant="reading" />
        </div>
      </article>

      <div className="sticky bottom-0 z-10 -mx-6 mt-12 border-t border-line bg-white">
        <nav
          aria-label="Tier step navigation"
          className="mx-auto flex max-w-prose flex-wrap items-center justify-between gap-3 px-6 py-4"
        >
          <Link
            href={answerHref}
            className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy hover:bg-navy hover:text-white motion-reduce:transition-none"
          >
            <span aria-hidden="true">←</span> Previous
          </Link>

          <ol aria-label="Component 4 of 4" className="flex items-center gap-2">
            <li>
              <Dot state="done" />
              <span className="sr-only">Step 1 (complete)</span>
            </li>
            <li>
              <Dot state="done" />
              <span className="sr-only">Step 2 (complete)</span>
            </li>
            <li>
              <Dot state="done" />
              <span className="sr-only">Step 3 (complete)</span>
            </li>
            <li>
              <Dot state="current" />
              <span className="sr-only">Step 4 (current)</span>
            </li>
          </ol>

          <div className="flex items-center gap-3">
            <Link
              href={moduleHref}
              className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy hover:bg-navy hover:text-white motion-reduce:transition-none"
            >
              Back to module
            </Link>
            <button
              type="button"
              onClick={onComplete}
              disabled={completing}
              aria-busy={completing || undefined}
              className="inline-flex items-center gap-2 rounded-control bg-navy px-4 py-2 font-sans text-body font-semibold text-white hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
            >
              {completing ? 'Marking complete…' : `Mark ${tierName} complete`}{' '}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
