import { notFound } from 'next/navigation';
import { PageBody } from '@/components/PageBody';
import { Supplement } from '@/components/Supplement';
import {
  assertContentLoaded,
  getSupplement,
  listExistingSupplements,
  parseSupplementView,
  type Pathway,
  type SupplementPathway,
} from '@/lib/content';

const PATHWAY_SLUGS = ['ba', 'dm', 'pm'] as const;
type PathwaySlug = (typeof PATHWAY_SLUGS)[number];
const PATHWAY_BY_SLUG: Record<PathwaySlug, Pathway> = { ba: 'BA', dm: 'DM', pm: 'PM' };
const PATHWAY_TO_SLUG: Record<SupplementPathway, PathwaySlug> = { BA: 'ba', DM: 'dm', PM: 'pm' };

interface Params {
  pathway: string;
  module: string;
}

export function generateStaticParams(): Array<{ pathway: PathwaySlug; module: string }> {
  assertContentLoaded();
  return listExistingSupplements().map(({ moduleId, pathway }) => ({
    pathway: PATHWAY_TO_SLUG[pathway],
    module: moduleId,
  }));
}

export const dynamicParams = false;

export default function SupplementPage({ params }: { params: Params }) {
  const pathwaySlug = params.pathway as PathwaySlug;
  if (!PATHWAY_SLUGS.includes(pathwaySlug)) notFound();

  const pathway = PATHWAY_BY_SLUG[pathwaySlug];
  const supplement = getSupplement(params.module, pathway as SupplementPathway);
  if (!supplement) notFound();

  const view = parseSupplementView(supplement);

  return (
    <PageBody width="prose">
      <Supplement
        pathway={pathway}
        pathwaySlug={pathwaySlug}
        moduleId={params.module}
        displayTitle={view.displayTitle}
        bodyMarkdown={view.bodyMarkdown}
        floorTier={supplement.frontmatter['floor-tier']}
      />
    </PageBody>
  );
}
