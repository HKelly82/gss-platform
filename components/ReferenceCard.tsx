import Link from 'next/link';
import { Markdown } from './Markdown';
import { PrintReferenceButton } from './PrintReferenceButton';
import type { Pathway } from '@/lib/content';

interface ReferenceCardProps {
  pathway: Pathway;
  pathwaySlug: string;
  moduleId: string;
  displayTitle: string;
  standfirstMarkdown: string;
  bodyMarkdown: string;
}

export function ReferenceCard({
  pathway,
  pathwaySlug,
  moduleId,
  displayTitle,
  standfirstMarkdown,
  bodyMarkdown,
}: ReferenceCardProps) {
  const moduleNumber = moduleId.slice(1);
  const moduleHref = `/${pathwaySlug}/${moduleId}`;
  return (
    <div className="flex flex-col gap-6 pb-12">
      <nav
        aria-label="Reference card actions"
        className="flex flex-wrap items-center justify-between gap-3 print:hidden"
      >
        <Link
          href={moduleHref}
          className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy transition hover:bg-navy hover:text-white motion-reduce:transition-none"
        >
          <span aria-hidden="true">←</span> Back to Module {moduleNumber}
        </Link>
        <PrintReferenceButton pathway={pathway} moduleId={moduleId} />
      </nav>

      <article className="mx-auto w-full max-w-scenario rounded-card border-[1.5px] border-line-2 bg-white p-8 shadow-card print:max-w-none print:rounded-none print:border-none print:p-0 print:shadow-none">
        <header className="border-b-2 border-navy pb-4">
          <p className="font-mono text-mono-meta uppercase tracking-[0.12em] text-ink-2">
            Reference · Module {moduleNumber}
          </p>
          <h1 className="mt-2 text-h1 font-extrabold text-navy">{displayTitle}</h1>
        </header>

        {standfirstMarkdown ? (
          <div className="mt-6 [&_p]:font-serif [&_p]:text-lede [&_p]:text-navy">
            <Markdown source={standfirstMarkdown} variant="reading" />
          </div>
        ) : null}

        <div className="mt-2">
          <Markdown source={bodyMarkdown} variant="reading-reference" />
        </div>
      </article>
    </div>
  );
}
