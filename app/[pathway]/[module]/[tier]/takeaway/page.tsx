import { notFound } from 'next/navigation';
import { PageBody } from '@/components/PageBody';
import { TakeawayList } from '@/components/TakeawayList';
import {
  getTakeawayBlock,
  getTier,
  listExistingTiers,
  parseTierHeader,
  type Pathway,
  type Tier,
} from '@/lib/content';

const PATHWAY_SLUGS = ['ba', 'dm', 'pm'] as const;
type PathwaySlug = (typeof PATHWAY_SLUGS)[number];
const PATHWAY_BY_SLUG: Record<PathwaySlug, Pathway> = { ba: 'BA', dm: 'DM', pm: 'PM' };
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
  const existing = listExistingTiers().filter((t) => TIER_SLUGS.includes(t.tier));
  return PATHWAY_SLUGS.flatMap((pathway) =>
    existing.map(({ moduleId, tier }) => ({ pathway, module: moduleId, tier })),
  );
}

export const dynamicParams = false;

export default function TakeawayPage({ params }: { params: Params }) {
  const pathwaySlug = params.pathway as PathwaySlug;
  if (!PATHWAY_SLUGS.includes(pathwaySlug)) notFound();
  const tier = params.tier as Tier;
  if (!TIER_SLUGS.includes(tier)) notFound();

  const parsedTier = getTier(params.module, tier);
  if (!parsedTier) notFound();

  const block = getTakeawayBlock(parsedTier);
  if (!block) notFound();

  const header = parseTierHeader(parsedTier.preface);

  return (
    <PageBody width="prose">
      <TakeawayList
        pathway={PATHWAY_BY_SLUG[pathwaySlug]}
        pathwaySlug={pathwaySlug}
        moduleId={params.module}
        tier={tier}
        moduleTitle={header.moduleTitle}
        tierName={header.tierName || 'Takeaway'}
        bodyMarkdown={block.body}
      />
    </PageBody>
  );
}
