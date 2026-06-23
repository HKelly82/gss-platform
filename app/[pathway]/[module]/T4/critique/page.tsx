import { notFound } from 'next/navigation';
import { Markdown } from '@/components/Markdown';
import { PageBody } from '@/components/PageBody';
import { T4StagePage } from '@/components/T4StagePage';
import {
  assertContentLoaded,
  getCritiquePromptBlock,
  getTier,
  listModuleIds,
  parseTierHeader,
} from '@/lib/content';

const PATHWAY_SLUGS = ['ba', 'dm', 'pm'] as const;
type PathwaySlug = (typeof PATHWAY_SLUGS)[number];

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

export default function T4CritiquePage({ params }: { params: Params }) {
  const pathwaySlug = params.pathway as PathwaySlug;
  if (!PATHWAY_SLUGS.includes(pathwaySlug)) notFound();

  const parsedTier = getTier(params.module, 'T4');
  if (!parsedTier) notFound();

  const block = getCritiquePromptBlock(parsedTier);
  if (!block) notFound();

  const header = parseTierHeader(parsedTier.preface);

  return (
    <PageBody width="prose">
      <T4StagePage
        stageLabel="Critique prompt"
        currentStep={2}
        moduleTitle={header.moduleTitle}
        tierName={header.tierName || 'Expert tier'}
        body={<Markdown source={block.body} variant="reading" />}
        prev={{ href: `/${pathwaySlug}/${params.module}/T4/exercise`, label: 'Applied exercise' }}
        next={{ href: `/${pathwaySlug}/${params.module}/T4/answer`, label: 'Continue' }}
      />
    </PageBody>
  );
}
