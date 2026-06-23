import { notFound } from 'next/navigation';
import { ModuleHub } from '@/components/ModuleHub';
import { PageBody } from '@/components/PageBody';
import {
  assertContentLoaded,
  getModuleMeta,
  getSupplement,
  listModuleIds,
  type ModuleMeta,
  type Pathway,
  type SupplementPathway,
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

export default function ModuleHubPage({ params }: { params: Params }) {
  const pathwaySlug = params.pathway as PathwaySlug;
  if (!PATHWAY_SLUGS.includes(pathwaySlug)) notFound();

  const meta = getModuleMeta(params.module);
  if (!meta) notFound();

  const pathway = PATHWAY_BY_SLUG[pathwaySlug];
  const hasSupplement = getSupplement(params.module, pathway as SupplementPathway) !== null;

  const allModules: ModuleMeta[] = listModuleIds()
    .map((id) => getModuleMeta(id))
    .filter((m): m is ModuleMeta => m !== null);

  return (
    <PageBody>
      <ModuleHub
        pathway={pathway}
        pathwaySlug={pathwaySlug}
        moduleMeta={meta}
        hasSupplement={hasSupplement}
        allModules={allModules}
      />
    </PageBody>
  );
}
