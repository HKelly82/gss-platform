import Link from 'next/link';

export type ModuleCardStatus = 'completed' | 'in-progress' | 'placement-set' | 'not-started';

interface ModuleCardProps {
  moduleId: string;
  moduleTitle: string;
  href: string;
  status: ModuleCardStatus;
  detailLabel: string;
}

const STATUS_BADGE: Record<ModuleCardStatus, { text: string; className: string }> = {
  completed: { text: 'Complete', className: 'bg-ready-bg text-ready' },
  'in-progress': {
    text: 'In progress',
    className: 'bg-white text-yellow-deep border border-yellow-deep',
  },
  'placement-set': { text: 'Placement set', className: 'bg-white text-ink-2 border border-line-2' },
  'not-started': { text: 'Not started', className: 'bg-white text-ink-2 border border-line-2' },
};

export function ModuleCard({
  moduleId,
  moduleTitle,
  href,
  status,
  detailLabel,
}: ModuleCardProps) {
  const moduleNumber = moduleId.slice(1);
  const badge = STATUS_BADGE[status];
  return (
    <Link
      href={href}
      aria-label={`Open Module ${moduleNumber} — ${moduleTitle}`}
      className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 rounded-card-lg border-[1.5px] border-line-2 bg-white p-5 shadow-card transition hover:border-navy hover:shadow-lift motion-reduce:transition-none"
    >
      <span
        aria-hidden="true"
        className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-navy bg-white text-h2 font-extrabold text-navy"
      >
        {moduleNumber}
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="font-sans text-h3 font-semibold text-navy">{moduleTitle}</h3>
        <p className="text-eyebrow text-ink-2">
          {moduleId} · {detailLabel}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className={`rounded-full px-3 py-0.5 text-eyebrow ${badge.className}`}>
          {badge.text}
        </span>
        <span className="text-eyebrow text-navy">
          Open <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
