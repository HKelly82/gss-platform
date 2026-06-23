import { notFound } from 'next/navigation';
import { ReferenceCard } from '@/components/ReferenceCard';
import {
  assertContentLoaded,
  getReferenceCard,
  listModuleIds,
  parseReferenceCardView,
  type Pathway,
} from '@/lib/content';

const PATHWAY_SLUGS = ['ba', 'dm', 'pm'] as const;
type PathwaySlug = (typeof PATHWAY_SLUGS)[number];
const PATHWAY_BY_SLUG: Record<PathwaySlug, Pathway> = { ba: 'BA', dm: 'DM', pm: 'PM' };

interface Params {
  pathway: string;
  module: string;
}

export function generateStaticParams(): Array<{ pathway: PathwaySlug; module: string }> {
  assertContentLoaded();
  return PATHWAY_SLUGS.flatMap((pathway) =>
    listModuleIds().map((module) => ({ pathway, module })),
  );
}

export const dynamicParams = false;

export default function ReferenceCardPage({ params }: { params: Params }) {
  const pathwaySlug = params.pathway as PathwaySlug;
  if (!PATHWAY_SLUGS.includes(pathwaySlug)) notFound();

  const card = getReferenceCard(params.module);
  if (!card) notFound();

  const view = parseReferenceCardView(card);

  return (
    <div className="bg-grey min-h-screen print:bg-white">
      <div className="mx-auto max-w-hub px-6 py-8 print:p-0">
        <ReferenceCard
          pathway={PATHWAY_BY_SLUG[pathwaySlug]}
          pathwaySlug={pathwaySlug}
          moduleId={params.module}
          displayTitle={view.displayTitle}
          standfirstMarkdown={view.standfirstMarkdown}
          bodyMarkdown={view.bodyMarkdown}
        />
      </div>
    </div>
  );
}
