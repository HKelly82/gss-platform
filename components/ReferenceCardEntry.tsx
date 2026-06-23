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
      className="group relative flex flex-col gap-1 overflow-hidden rounded-card-lg border-[1.5px] border-line-2 bg-white p-6 shadow-card transition before:absolute before:left-0 before:top-0 before:h-full before:w-[6px] before:bg-yellow before:content-[''] hover:border-navy hover:shadow-lift motion-reduce:transition-none"
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
