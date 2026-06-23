import { notFound } from 'next/navigation';
import { PageBody } from '@/components/PageBody';
import { Placeholder } from '@/components/Placeholder';

interface Params {
  pathway: string;
  module: string;
  tier: string;
  stage: string;
}

const T1_T3_STAGES = new Set<string>();
const T4_STAGES = new Set<string>();

function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export default function TierStagePage({ params }: { params: Params }) {
  const { pathway, module: moduleId, tier, stage } = params;
  const isT4 = tier === 'T4';
  const validStages = isT4 ? T4_STAGES : T1_T3_STAGES;
  if (!validStages.has(stage)) {
    notFound();
  }
  return (
    <PageBody>
      <Placeholder
        title={`${stageLabel(stage)} — ${moduleId} ${tier}`}
        route={`/${pathway}/${moduleId}/${tier}/${stage}`}
        description={
          isT4
            ? 'T4 Expert flow has its own literal routes too (/T4/{exercise,critique,answer,reflection}). This page should not normally render.'
            : 'T1–T3 stages all live at their own literal routes. This catch-all no longer serves any stage; visiting an unknown [stage] now returns 404.'
        }
      />
    </PageBody>
  );
}
