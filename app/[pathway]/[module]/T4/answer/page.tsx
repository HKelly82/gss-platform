import { notFound } from 'next/navigation';
import { Markdown } from '@/components/Markdown';
import { ModelAnswerReveal } from '@/components/ModelAnswerReveal';
import { PageBody } from '@/components/PageBody';
import { T4StagePage } from '@/components/T4StagePage';
import {
  assertContentLoaded,
  getAnswerSlotBlock,
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

export default function T4AnswerPage({ params }: { params: Params }) {
  const pathwaySlug = params.pathway as PathwaySlug;
  if (!PATHWAY_SLUGS.includes(pathwaySlug)) notFound();

  const parsedTier = getTier(params.module, 'T4');
  if (!parsedTier) notFound();

  const block = getAnswerSlotBlock(parsedTier);
  if (!block) notFound();

  const header = parseTierHeader(parsedTier.preface);
  const isVariantB = block.component === 'applied-exercise';

  const body = isVariantB ? (
    <Markdown source={block.body} variant="reading" />
  ) : (
    <ModelAnswerReveal
      pathway={PATHWAY_BY_SLUG[pathwaySlug]}
      moduleId={params.module}
      tier="T4"
      bodyMarkdown={block.body}
    />
  );

  return (
    <PageBody width="prose">
      <T4StagePage
        stageLabel={isVariantB ? 'Applied exercise — continued' : 'Model answer'}
        currentStep={3}
        moduleTitle={header.moduleTitle}
        tierName={header.tierName || 'Expert tier'}
        body={body}
        prev={{ href: `/${pathwaySlug}/${params.module}/T4/critique`, label: 'Critique prompt' }}
        next={{ href: `/${pathwaySlug}/${params.module}/T4/reflection`, label: 'Reflection' }}
      />
    </PageBody>
  );
}
