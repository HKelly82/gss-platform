import Link from 'next/link';
import { PageBody } from '@/components/PageBody';
import {
  assertContentLoaded,
  getSMEMetaMeta,
  listSMEMetaModules,
  type SMEMetaMeta,
} from '@/lib/content';

export default function SMEHomePage() {
  assertContentLoaded();
  const metas: SMEMetaMeta[] = listSMEMetaModules()
    .map((m) => getSMEMetaMeta(m))
    .filter((m): m is SMEMetaMeta => m !== null);

  return (
    <PageBody>
      <div className="mx-auto flex max-w-landing flex-col gap-8 pb-16">
        <header className="flex flex-col gap-2">
          <p className="text-eyebrow text-yellow-deep">Subject-Matter Expert</p>
          <h1 className="text-h1 font-extrabold text-navy">SME meta-modules</h1>
          <p className="font-serif text-lede text-ink-2">
            Three meta-modules for coaches and reviewers. Each carries a conceptual framing,
            an applied exercise, a model answer to compare against, and a debrief — the work
            you take into a Herd reviewer conversation. SME assumes you have completed the
            eight core modules at Foundations or above and have at least one Expert-tier
            applied exercise in hand.
          </p>
          <nav aria-label="SME pathway actions" className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy transition hover:bg-navy hover:text-white motion-reduce:transition-none"
            >
              <span aria-hidden="true">←</span> Pathway selection
            </Link>
          </nav>
        </header>

        <section
          aria-labelledby="sme-meta-grid-heading"
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <h2 id="sme-meta-grid-heading" className="sr-only">
            Meta-modules
          </h2>
          {metas.map(({ meta, title, sections }) => (
            <Link
              key={meta}
              href={`/sme/${meta}`}
              aria-label={`Open SME meta-module ${meta}: ${title}`}
              className="group flex flex-col gap-3 rounded-card-lg border-[1.5px] border-line-2 bg-white p-6 shadow-card transition hover:border-navy hover:shadow-lift motion-reduce:transition-none"
            >
              <p className="text-eyebrow text-yellow-deep">SME meta-module {meta}</p>
              <h3 className="font-sans text-h2 font-bold text-navy">{title}</h3>
              <p className="text-eyebrow text-ink-2">{sections.length} parts</p>
              <span className="mt-auto text-eyebrow text-navy">
                Open <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </section>
      </div>
    </PageBody>
  );
}
