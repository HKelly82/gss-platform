import { Layer0Banner } from '@/components/Layer0Banner';
import { PageBody } from '@/components/PageBody';
import { PathwayCard } from '@/components/PathwayCard';
import { hasL0 } from '@/lib/content';

export default function HomePage() {
  const showLayer0 = hasL0();
  return (
    <PageBody>
      <div className="mx-auto flex max-w-landing flex-col gap-8 pb-16">
        <header className="flex flex-col gap-2">
          <p className="text-eyebrow text-yellow-deep">Welcome</p>
          <h1 className="text-h1 font-extrabold text-navy">Choose your pathway</h1>
          <p className="font-serif text-lede text-ink-2">
            Each pathway places you at the role&apos;s daily working seat. Modules and tiers
            are the same across pathways; the angle of approach is calibrated to the seat.
            You can switch pathways at any time from the top nav.
          </p>
        </header>

        <section
          aria-labelledby="pathway-grid-heading"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <h2 id="pathway-grid-heading" className="sr-only">
            Pathway options
          </h2>
          <PathwayCard kind="BA" href="/ba" />
          <PathwayCard kind="DM" href="/dm" />
          <PathwayCard kind="PM" href="/pm" />
          <PathwayCard kind="SME" href="/sme" />
        </section>

        {showLayer0 ? <Layer0Banner /> : null}

        <p className="text-eyebrow text-ink-2">
          Stub copy on the cards above will be replaced by the Phase 8 pathway guides when
          those land in the curriculum repo.
        </p>
      </div>
    </PageBody>
  );
}
