import { notFound } from 'next/navigation';
import { PageBody } from '@/components/PageBody';
import { T4Reflection } from '@/components/T4Reflection';
import {
  assertContentLoaded,
  getReflectionBlock,
  getTier,
  listModuleIds,
  parseTierHeader,
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

export default function T4ReflectionPage({ params }: { params: Params }) {
  const pathwaySlug = params.pathway as PathwaySlug;
  if (!PATHWAY_SLUGS.includes(pathwaySlug)) notFound();

  const parsedTier = getTier(params.module, 'T4');
  if (!parsedTier) notFound();

  const block = getReflectionBlock(parsedTier);
  if (!block) notFound();

  const header = parseTierHeader(parsedTier.preface);

  return (
    <PageBody width="prose">
      <T4Reflection
        pathway={PATHWAY_BY_SLUG[pathwaySlug]}
        pathwaySlug={pathwaySlug}
        moduleId={params.module}
        tier="T4"
        moduleTitle={header.moduleTitle}
        tierName={header.tierName || 'Expert tier'}
        bodyMarkdown={block.body}
      />
    </PageBody>
  );
}
