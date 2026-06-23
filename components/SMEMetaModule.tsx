import Link from 'next/link';
import { Markdown } from './Markdown';
import { RevealAnswer } from './RevealAnswer';
import type {
  ParsedSMESection,
  SMEMeta,
  SMEMetaMeta,
  SMESectionKey,
} from '@/lib/content';

interface SMEMetaModuleProps {
  meta: SMEMeta;
  metaMeta: SMEMetaMeta;
  sections: Array<{ key: SMESectionKey; parsed: ParsedSMESection }>;
}

const SECTION_LABELS: Record<SMESectionKey, { eyebrow: string; title: string }> = {
  framing: { eyebrow: 'Conceptual framing', title: 'Framing' },
  exercise: { eyebrow: 'Applied exercise', title: 'The exercise' },
  scaffolding: { eyebrow: 'Reference scaffolding', title: 'Scaffolding' },
  'model-answer': { eyebrow: 'Model answer', title: 'Model answer' },
  debrief: { eyebrow: 'Debrief', title: 'Debrief' },
};

export function SMEMetaModule({ meta, metaMeta, sections }: SMEMetaModuleProps) {
  const totalSteps = sections.length;
  return (
    <div className="flex flex-col gap-10 pb-16">
      <header className="flex flex-col gap-3">
        <p className="text-eyebrow text-yellow-deep">
          SME meta-module {meta} · {totalSteps} parts
        </p>
        <h1 className="text-h1 font-extrabold text-navy">{metaMeta.title}</h1>
        <p className="font-serif text-lede text-ink-2">
          Conceptual framing, an applied exercise, a model answer to compare against, and a
          debrief for the conversation you take into a Herd reviewer. Work through the
          exercise before revealing the model answer — the value is in the comparison.
        </p>
        <nav aria-label="SME actions" className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/sme"
            className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy transition hover:bg-navy hover:text-white motion-reduce:transition-none"
          >
            <span aria-hidden="true">←</span> SME meta-modules
          </Link>
        </nav>
      </header>

      {sections.map(({ key, parsed }, idx) => {
        const label = SECTION_LABELS[key];
        const stepNum = idx + 1;
        const sectionId = `sme-${meta}-${key}`;
        const isModelAnswer = key === 'model-answer';
        return (
          <section
            key={key}
            id={sectionId}
            aria-labelledby={`${sectionId}-heading`}
            className="flex flex-col gap-4 border-t border-line pt-8"
          >
            <header className="flex flex-col gap-1">
              <p className="text-eyebrow text-yellow-deep">
                Step {stepNum} of {totalSteps} · {label.eyebrow}
              </p>
              <h2 id={`${sectionId}-heading`} className="text-h1 font-extrabold text-navy">
                {label.title}
              </h2>
            </header>
            {isModelAnswer ? (
              <RevealAnswer
                revealLabel="Reveal the model answer"
                hint="Complete the exercise above before revealing — the substantive learning is in the comparison."
                panelEyebrow="Model answer"
              >
                <Markdown source={parsed.body} variant="reading-section-body" />
              </RevealAnswer>
            ) : (
              <Markdown source={parsed.body} variant="reading-reference" />
            )}
          </section>
        );
      })}

      <nav aria-label="After this meta-module" className="flex flex-wrap gap-3 border-t border-line pt-8">
        <Link
          href="/sme"
          className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy transition hover:bg-navy hover:text-white motion-reduce:transition-none"
        >
          <span aria-hidden="true">←</span> Back to SME meta-modules
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-control bg-navy px-4 py-2 font-sans text-body font-semibold text-white transition hover:bg-navy-deep motion-reduce:transition-none"
        >
          Choose a pathway <span aria-hidden="true">→</span>
        </Link>
      </nav>
    </div>
  );
}
