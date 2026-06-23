import Link from 'next/link';

export type PathwayCardKind = 'BA' | 'DM' | 'PM' | 'SME';

interface PathwayCardProps {
  kind: PathwayCardKind;
  href: string;
}

const ROLE_META: Record<
  PathwayCardKind,
  { eyebrow: string; name: string; description: string; footerLeft: string }
> = {
  BA: {
    eyebrow: 'Business Analyst',
    name: 'Business Analyst pathway',
    description:
      'Translate user-needs research into design and delivery artefacts the team can act on. Eight modules anchored at the BA seat.',
    footerLeft: '8 modules · 4 tiers',
  },
  DM: {
    eyebrow: 'Delivery Manager',
    name: 'Delivery Manager pathway',
    description:
      "Run the team's rhythm and own how the work gets done — assessment narrative included. Eight modules anchored at the DM seat.",
    footerLeft: '8 modules · 4 tiers',
  },
  PM: {
    eyebrow: 'Product Manager',
    name: 'Product Manager pathway',
    description:
      'Commission the research, defend the user-needs narrative at assessment, and keep the research–decision thread intact. Eight modules anchored at the senior PM seat.',
    footerLeft: '8 modules · 4 tiers',
  },
  SME: {
    eyebrow: 'Subject-Matter Expert',
    name: 'SME meta-modules',
    description:
      'Coach teams and panels on the harder parts of the Service Standard. Three meta-modules with applied exercises and model answers.',
    footerLeft: '3 meta-modules',
  },
};

export function PathwayCard({ kind, href }: PathwayCardProps) {
  const meta = ROLE_META[kind];
  return (
    <Link
      href={href}
      aria-label={`Choose ${meta.name}`}
      className="group flex flex-col gap-4 rounded-card-lg border-[1.5px] border-line-2 bg-white p-6 shadow-card transition hover:border-navy hover:shadow-lift motion-reduce:transition-none"
    >
      <div className="flex flex-col gap-1">
        <p className="text-eyebrow text-yellow-deep">{meta.eyebrow}</p>
        <h3 className="font-sans text-h2 font-bold text-navy">{meta.name}</h3>
      </div>
      <p className="font-serif text-body text-ink-2">{meta.description}</p>
      <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-eyebrow text-ink-2">
        <span>{meta.footerLeft}</span>
        <span className="text-navy">
          Choose <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
