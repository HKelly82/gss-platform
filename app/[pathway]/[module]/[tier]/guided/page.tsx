import { notFound } from 'next/navigation';
import { GuidedContent } from '@/components/GuidedContent';
import { PageBody } from '@/components/PageBody';
import {
  assertContentLoaded,
  getGuidedBlock,
  getTier,
  listExistingTiers,
  parseTierHeader,
  type Tier,
} from '@/lib/content';

const PATHWAY_SLUGS = ['ba', 'dm', 'pm'] as const;
type PathwaySlug = (typeof PATHWAY_SLUGS)[number];
const TIER_SLUGS: Tier[] = ['T1', 'T2', 'T3'];

interface Params {
  pathway: string;
  module: string;
  tier: string;
}

export function generateStaticParams(): Array<{
  pathway: PathwaySlug;
  module: string;
  tier: Tier;
}> {
  assertContentLoaded();
  const existing = listExistingTiers().filter((t) => TIER_SLUGS.includes(t.tier));
  return PATHWAY_SLUGS.flatMap((pathway) =>
    existing.map(({ moduleId, tier }) => ({ pathway, module: moduleId, tier })),
  );
}

export const dynamicParams = false;

export default function GuidedPage({ params }: { params: Params }) {
  const pathwaySlug = params.pathway as PathwaySlug;
  if (!PATHWAY_SLUGS.includes(pathwaySlug)) notFound();
  const tier = params.tier as Tier;
  if (!TIER_SLUGS.includes(tier)) notFound();

  const parsedTier = getTier(params.module, tier);
  if (!parsedTier) notFound();

  const block = getGuidedBlock(parsedTier);
  if (!block) notFound();

  const header = parseTierHeader(parsedTier.preface);

  return (
    <PageBody width="prose">
      <GuidedContent
        pathwaySlug={pathwaySlug}
        moduleId={params.module}
        tier={tier}
        moduleTitle={header.moduleTitle}
        tierName={header.tierName || 'Guided content'}
        estimatedTime={header.estimatedTime}
        bodyMarkdown={block.body}
      />
    </PageBody>
  );
}
