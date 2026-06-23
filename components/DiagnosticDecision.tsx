'use client';

import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { Markdown } from './Markdown';
import type { DiagnosticOption, Pathway } from '@/lib/content';
import { recordPlacement, setPathway } from '@/lib/progress';

interface DiagnosticDecisionProps {
  pathway: Pathway;
  moduleId: string;
  scenarioMarkdown: string;
  options: DiagnosticOption[];
  notesMarkdown: string;
}

const TIER_LANDINGS: Record<DiagnosticOption['landingTier'], string> = {
  T1: 'scenario',
  T2: 'scenario',
  T3: 'scenario',
  T4: 'exercise',
};

export function DiagnosticDecision({
  pathway,
  moduleId,
  scenarioMarkdown,
  options,
  notesMarkdown,
}: DiagnosticDecisionProps) {
  const router = useRouter();
  const reassuranceId = useId();
  const [pending, setPending] = useState<DiagnosticOption['letter'] | null>(null);

  const onChoose = (option: DiagnosticOption) => {
    if (pending) return;
    setPending(option.letter);
    setPathway(pathway);
    recordPlacement(pathway, moduleId, option.letter);
    const slug = `${moduleId}/${option.landingTier}/${TIER_LANDINGS[option.landingTier]}`;
    router.push(`/${pathway.toLowerCase()}/${slug}`);
  };

  return (
    <div className="mx-auto max-w-prose pb-16">
      <p className="text-eyebrow text-yellow-deep">
        Module-entry diagnostic
      </p>
      <h1 className="mt-2 text-h1 font-extrabold text-navy">
        Module {moduleId.slice(1)} — where to start
      </h1>
      <p className="mt-3 font-serif text-lede text-ink-2">
        A single scenario-based question that places you at the right tier. No pass, no fail, no
        score.
      </p>

      <div
        id={reassuranceId}
        role="note"
        className="mt-6 flex items-start gap-3 rounded-card border border-line bg-white px-4 py-3 text-body text-ink"
      >
        <span aria-hidden="true" className="mt-1 inline-block h-2 w-2 rounded-full bg-ready" />
        <p>
          <strong className="font-semibold text-navy">
            Skipping is a normal, confident choice.
          </strong>{' '}
          Nothing is marked failed; any tier is revisitable from the module hub.
        </p>
      </div>

      <section aria-labelledby={`${reassuranceId}-scenario`} className="mt-8">
        <h2 id={`${reassuranceId}-scenario`} className="sr-only">
          Scenario
        </h2>
        <Markdown source={scenarioMarkdown} variant="reading" />
      </section>

      <section aria-labelledby={`${reassuranceId}-choices`} className="mt-10">
        <h2
          id={`${reassuranceId}-choices`}
          className="text-eyebrow text-yellow-deep"
        >
          Choose the answer closest to what you would say
        </h2>
        <div
          role="group"
          aria-labelledby={`${reassuranceId}-choices`}
          className="mt-4 flex flex-col gap-4"
        >
          {options.map((option) => {
            const isPending = pending === option.letter;
            const isDisabled = pending !== null && !isPending;
            return (
              <button
                key={option.letter}
                type="button"
                onClick={() => onChoose(option)}
                disabled={isDisabled}
                aria-describedby={reassuranceId}
                aria-busy={isPending || undefined}
                className="group grid w-full grid-cols-[2.25rem_1fr] gap-x-4 gap-y-4 rounded-card-lg border-[1.5px] border-line-2 bg-white p-6 text-left shadow-card transition hover:border-navy hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-navy bg-white text-h3 font-bold text-navy transition group-hover:bg-navy group-hover:text-white motion-reduce:transition-none"
                >
                  {option.letter}
                </span>
                <p className="font-serif text-reading font-semibold text-navy">
                  &ldquo;{option.answer}&rdquo;
                </p>
                <p className="col-start-2 font-serif text-body italic text-ink-2">
                  {option.explanation}
                </p>
                <p className="col-start-2 text-eyebrow text-navy">
                  {isPending ? 'Routing…' : `Start at ${moduleId}-${option.landingTier} (${option.landingLabel}) →`}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {notesMarkdown ? (
        <section className="mt-12 border-t border-line pt-6" aria-label="Notes on the placement">
          <Markdown source={notesMarkdown} variant="notes" />
        </section>
      ) : null}
    </div>
  );
}
