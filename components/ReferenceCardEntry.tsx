import Link from 'next/link';

interface ReferenceCardEntryProps {
  href: string;
  moduleId: string;
}

export function ReferenceCardEntry({ href, moduleId }: ReferenceCardEntryProps) {
  return (
    <Link
      href={href}
      aria-label={`Open Module ${moduleId.slice(1)} reference card`}
      className="group flex flex-col gap-1 rounded-card-lg border-[1.5px] border-line-2 border-l-[6px] border-l-yellow bg-white p-6 shadow-card transition hover:border-navy hover:border-l-yellow hover:shadow-lift motion-reduce:transition-none"
    >
      <span className="text-eyebrow text-yellow-deep">Reference card</span>
      <span className="font-sans text-h3 font-semibold text-navy">
        Module {moduleId.slice(1)} — at a glance
      </span>
      <span className="font-sans text-body text-ink-2">
        One page you can take into client meetings, sprint refinement, or assessment prep.
      </span>
      <span className="mt-1 text-eyebrow text-navy">
        Open reference card <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
