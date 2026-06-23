'use client';

import { useId, useState } from 'react';
import { Markdown } from './Markdown';
import { StickyFooter } from './StickyFooter';
import type { MCQ, MCQLetter, Pathway, Tier } from '@/lib/content';
import { recordCheckAnswer, revealModel, setPathway } from '@/lib/progress';

interface MultipleChoiceCheckProps {
  pathway: Pathway;
  pathwaySlug: string;
  moduleId: string;
  tier: Tier;
  moduleTitle: string;
  tierName: string;
  introMarkdown: string;
  mcqs: MCQ[];
}

const LETTER_IDX: Record<MCQLetter, number> = { A: 0, B: 1, C: 2, D: 3 };

export function MultipleChoiceCheck({
  pathway,
  pathwaySlug,
  moduleId,
  tier,
  moduleTitle,
  tierName,
  introMarkdown,
  mcqs,
}: MultipleChoiceCheckProps) {
  return (
    <>
      <article className="pb-8">
        <header>
          <p className="text-eyebrow text-yellow-deep">Understanding check</p>
          <h1 className="mt-2 text-h1 font-extrabold text-navy">{moduleTitle}</h1>
          <p className="mt-3 text-eyebrow text-ink-2">{tierName}</p>
          {introMarkdown ? (
            <div className="mt-6">
              <Markdown source={introMarkdown} variant="reading" />
            </div>
          ) : null}
        </header>

        <ol className="mt-8 space-y-12">
          {mcqs.map((mcq) => (
            <li key={mcq.questionNumber} className="border-t border-line pt-8">
              <MCQItem
                pathway={pathway}
                moduleId={moduleId}
                tier={tier}
                mcq={mcq}
              />
            </li>
          ))}
        </ol>
      </article>

      <StickyFooter
        prev={{ href: `/${pathwaySlug}/${moduleId}/${tier}/guided`, label: 'Guided content' }}
        next={{ href: `/${pathwaySlug}/${moduleId}/${tier}/takeaway`, label: 'Takeaway' }}
        stepCount={4}
        currentStep={3}
      />
    </>
  );
}

interface MCQItemProps {
  pathway: Pathway;
  moduleId: string;
  tier: Tier;
  mcq: MCQ;
}

function MCQItem({ pathway, moduleId, tier, mcq }: MCQItemProps) {
  const [attempted, setAttempted] = useState<Set<MCQLetter>>(new Set());
  const [correctChosen, setCorrectChosen] = useState(false);
  const stemId = useId();
  const groupId = useId();
  const feedbackId = useId();

  const checkId = `q${mcq.questionNumber}`;

  const onChoose = (letter: MCQLetter): void => {
    if (correctChosen) return;
    setAttempted((prev) => {
      if (prev.has(letter)) return prev;
      const next = new Set(prev);
      next.add(letter);
      return next;
    });
    setPathway(pathway);
    const isCorrect = letter === mcq.correctLetter;
    recordCheckAnswer(pathway, moduleId, tier, checkId, {
      answerIdx: LETTER_IDX[letter],
      resolved: isCorrect,
    });
    if (isCorrect) {
      setCorrectChosen(true);
      revealModel(pathway, moduleId, tier, checkId);
    }
  };

  const hasWrongAttempt = attempted.size > 0 && !attempted.has(mcq.correctLetter);

  return (
    <section aria-labelledby={stemId}>
      <h2 className="text-eyebrow text-yellow-deep">
        Question {mcq.questionNumber}
      </h2>
      <p id={stemId} className="mt-2 font-serif text-reading text-ink">
        {mcq.stem}
      </p>

      <div
        role="group"
        aria-labelledby={stemId}
        id={groupId}
        className="mt-6 flex flex-col gap-3"
      >
        {mcq.options.map((option) => {
          const isAttempted = attempted.has(option.letter);
          const isCorrectOption = option.letter === mcq.correctLetter;
          const isWrongChosen = isAttempted && !isCorrectOption;
          const isCorrectChosen = isCorrectOption && correctChosen;
          const isStrongerHint = isCorrectOption && hasWrongAttempt && !correctChosen;
          const disabled = correctChosen;

          let surface = 'border-line-2 bg-white text-navy hover:border-navy hover:shadow-lift';
          let badgeSurface =
            'border-navy bg-white text-navy group-hover:bg-navy group-hover:text-white';
          let badgeGlyph: React.ReactNode = option.letter;
          let stateEyebrow: React.ReactNode = null;
          if (isWrongChosen) {
            surface = 'border-attention bg-attention-bg text-navy';
            badgeSurface = 'border-attention bg-attention text-white';
            badgeGlyph = <span aria-hidden="true">✕</span>;
            stateEyebrow = (
              <span className="text-eyebrow text-attention">
                Not the strongest choice
              </span>
            );
          } else if (isCorrectChosen) {
            surface = 'border-ready bg-ready-bg text-navy';
            badgeSurface = 'border-ready bg-ready text-white';
            badgeGlyph = <span aria-hidden="true">✓</span>;
            stateEyebrow = (
              <span className="text-eyebrow text-ready">Correct</span>
            );
          } else if (isStrongerHint) {
            stateEyebrow = (
              <span className="text-eyebrow text-yellow-deep">
                The stronger answer
              </span>
            );
          }

          return (
            <button
              key={option.letter}
              type="button"
              onClick={() => onChoose(option.letter)}
              disabled={disabled}
              aria-describedby={isAttempted || correctChosen ? feedbackId : undefined}
              className={`group grid w-full grid-cols-[2.25rem_1fr] gap-x-4 rounded-card-lg border-[1.5px] p-5 text-left shadow-card transition disabled:cursor-not-allowed motion-reduce:transition-none ${surface}`}
            >
              <span
                aria-hidden="true"
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] text-h3 font-bold ${badgeSurface}`}
              >
                {badgeGlyph}
              </span>
              <span className="flex flex-col gap-2">
                {stateEyebrow}
                <span className="font-serif text-body text-ink">{option.text}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div id={feedbackId} role="status" aria-live="polite" className="mt-6">
        {correctChosen ? (
          <div className="rounded-card border-[1.5px] border-ready bg-ready-bg p-5">
            <p className="text-eyebrow text-ready">Exactly right</p>
            <div className="mt-3">
              <Markdown source={mcq.modelAnswerMarkdown} variant="reading" />
            </div>
          </div>
        ) : hasWrongAttempt ? (
          <div className="rounded-card border-[1.5px] border-attention bg-attention-bg p-5">
            <p className="text-eyebrow text-attention">
              <span aria-hidden="true">▲ </span>Read the redirect, then choose again
            </p>
            {mcq.redirectMarkdown ? (
              <div className="mt-3">
                <Markdown source={mcq.redirectMarkdown} variant="reading" />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
