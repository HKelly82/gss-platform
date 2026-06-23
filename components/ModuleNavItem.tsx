import Link from 'next/link';

export type ModuleNavStatus = 'complete' | 'current' | 'upcoming';

interface ModuleNavItemProps {
  moduleId: string;
  moduleTitle: string;
  href: string;
  status: ModuleNavStatus;
}

export function ModuleNavItem({ moduleId, moduleTitle, href, status }: ModuleNavItemProps) {
  const moduleNumber = moduleId.slice(1);

  const surface =
    status === 'current'
      ? 'relative bg-paper before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-yellow before:content-[\'\']'
      : 'bg-transparent';

  const disc =
    status === 'complete'
      ? 'bg-navy text-white border-navy'
      : status === 'current'
        ? 'bg-yellow text-navy border-navy'
        : 'bg-white text-navy border-navy';

  if (status === 'current') {
    return (
      <div
        aria-current="page"
        className={`flex items-start gap-3 rounded-control px-3 py-2 ${surface}`}
      >
        <span
          aria-hidden="true"
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] text-body font-extrabold ${disc}`}
        >
          {moduleNumber}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-eyebrow text-yellow-deep">Now</span>
          <span className="font-sans text-body font-semibold text-navy">{moduleTitle}</span>
        </span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`Open Module ${moduleNumber} — ${moduleTitle}`}
      className={`flex items-start gap-3 rounded-control px-3 py-2 transition hover:bg-paper motion-reduce:transition-none ${surface}`}
    >
      <span
        aria-hidden="true"
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] text-body font-extrabold ${disc}`}
      >
        {status === 'complete' ? <span aria-hidden="true">✓</span> : moduleNumber}
      </span>
      <span className="min-w-0 font-sans text-body text-navy">{moduleTitle}</span>
    </Link>
  );
}
