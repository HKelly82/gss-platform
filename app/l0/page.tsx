import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Markdown } from '@/components/Markdown';
import { PageBody } from '@/components/PageBody';
import { getL0Section, type L0SectionKey } from '@/lib/content';

const SECTION_ORDER: ReadonlyArray<{
  key: L0SectionKey;
  eyebrow: string;
  title: string;
}> = [
  {
    key: 'diagnostic',
    eyebrow: 'Step 1 of 5',
    title: 'Orientation diagnostic',
  },
  {
    key: 'scenario',
    eyebrow: 'Step 2 of 5',
    title: 'The orientation scenario',
  },
  {
    key: 'guided-content',
    eyebrow: 'Step 3 of 5',
    title: 'The structural map',
  },
  {
    key: 'understanding-check',
    eyebrow: 'Step 4 of 5',
    title: 'Orientation check',
  },
  {
    key: 'takeaway',
    eyebrow: 'Step 5 of 5',
    title: 'Take this into your week',
  },
];

export default function Layer0Page() {
  const sections = SECTION_ORDER.map((s) => ({ ...s, parsed: getL0Section(s.key) }));
  const allLoaded = sections.every((s) => s.parsed !== null);
  if (!allLoaded) notFound();

  return (
    <PageBody width="prose">
      <div className="flex flex-col gap-10 pb-16">
        <header className="flex flex-col gap-3">
          <p className="text-eyebrow text-yellow-deep">Layer 0 — orientation primer</p>
          <h1 className="text-h1 font-extrabold text-navy">A first week through someone else&apos;s eyes</h1>
          <p className="font-serif text-lede text-ink-2">
            Thirty minutes of shared vocabulary before you pick a pathway. Follow Alex through
            five days; by Friday the seven terms in the diagnostic should feel ordinary. If
            they already do, skip ahead to your pathway.
          </p>
          <nav aria-label="Layer 0 actions" className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy transition hover:bg-navy hover:text-white motion-reduce:transition-none"
            >
              <span aria-hidden="true">←</span> Skip — pick a pathway
            </Link>
            <a
              href="#l0-scenario"
              className="inline-flex items-center gap-2 rounded-control bg-navy px-4 py-2 font-sans text-body font-semibold text-white transition hover:bg-navy-deep motion-reduce:transition-none"
            >
              Read the primer <span aria-hidden="true">↓</span>
            </a>
          </nav>
        </header>

        {sections.map((s) => (
          <section
            key={s.key}
            id={`l0-${s.key === 'guided-content' ? 'guided' : s.key === 'understanding-check' ? 'check' : s.key}`}
            aria-labelledby={`l0-${s.key}-heading`}
            className="flex flex-col gap-4 border-t border-line pt-8"
          >
            <header className="flex flex-col gap-1">
              <p className="text-eyebrow text-yellow-deep">{s.eyebrow}</p>
              <h2 id={`l0-${s.key}-heading`} className="text-h1 font-extrabold text-navy">
                {s.title}
              </h2>
            </header>
            <Markdown source={s.parsed!.body} variant="reading-reference" />
          </section>
        ))}

        <nav aria-label="After Layer 0" className="flex flex-wrap gap-3 border-t border-line pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-control bg-navy px-4 py-2 font-sans text-body font-semibold text-white transition hover:bg-navy-deep motion-reduce:transition-none"
          >
            Pick a pathway <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </PageBody>
  );
}
