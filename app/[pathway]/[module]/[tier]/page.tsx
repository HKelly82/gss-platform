import { notFound } from 'next/navigation';
import { PageBody } from '@/components/PageBody';
import { TierOverview } from '@/components/TierOverview';
import {
  assertContentLoaded,
  extractTierSkipPreface,
  getTier,
  listExistingTiers,
  parseTierHeader,
  type Pathway,
  type Tier,
} from '@/lib/content';

const PATHWAY_SLUGS = ['ba', 'dm', 'pm'] as const;
type PathwaySlug = (typeof PATHWAY_SLUGS)[number];
const PATHWAY_BY_SLUG: Record<PathwaySlug, Pathway> = { ba: 'BA', dm: 'DM', pm: 'PM' };
const TIER_SLUGS: Tier[] = ['T1', 'T2', 'T3', 'T4'];

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
  return PATHWAY_SLUGS.flatMap((pathway) =>
    listExistingTiers().map(({ moduleId, tier }) => ({ pathway, module: moduleId, tier })),
  );
}

export const dynamicParams = false;

export default function TierOverviewPage({ params }: { params: Params }) {
  const pathwaySlug = params.pathway as PathwaySlug;
  if (!PATHWAY_SLUGS.includes(pathwaySlug)) notFound();
  const tier = params.tier as Tier;
  if (!TIER_SLUGS.includes(tier)) notFound();

  const parsedTier = getTier(params.module, tier);
  if (!parsedTier) notFound();

  const header = parseTierHeader(parsedTier.preface);
  const skipPrefaceMarkdown = extractTierSkipPreface(parsedTier.preface);

  return (
    <PageBody width="prose">
      <TierOverview
        pathway={PATHWAY_BY_SLUG[pathwaySlug]}
        pathwaySlug={pathwaySlug}
        moduleId={params.module}
        tier={tier}
        moduleTitle={header.moduleTitle}
        tierName={header.tierName || `${tier} tier`}
        estimatedTime={header.estimatedTime}
        skipPrefaceMarkdown={skipPrefaceMarkdown}
      />
    </PageBody>
  );
}
