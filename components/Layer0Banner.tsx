import Link from 'next/link';

export function Layer0Banner() {
  return (
    <section aria-labelledby="layer0-banner-heading">
      <h2 id="layer0-banner-heading" className="sr-only">
        Orientation primer
      </h2>
      <Link
        href="/l0"
        aria-label="Start the Layer 0 orientation primer"
        className="group relative flex flex-col gap-2 overflow-hidden rounded-card-lg border-[1.5px] border-line-2 bg-white p-6 shadow-card transition before:absolute before:left-0 before:top-0 before:h-full before:w-[6px] before:bg-yellow before:content-[''] hover:border-navy hover:shadow-lift motion-reduce:transition-none"
      >
        <p className="text-eyebrow text-yellow-deep">Layer 0</p>
        <h3 className="font-sans text-h3 font-semibold text-navy">
          New to government digital?
        </h3>
        <p className="font-serif text-body text-ink-2">
          A thirty-minute orientation primer that walks one consultant through their first week
          in central government. Not required — skip if the vocabulary is already familiar.
        </p>
        <p className="mt-1 text-eyebrow text-navy">
          Start the primer <span aria-hidden="true">→</span>
        </p>
      </Link>
    </section>
  );
}
