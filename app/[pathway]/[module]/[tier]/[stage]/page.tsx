import { notFound } from 'next/navigation';
import { PageBody } from '@/components/PageBody';
import { Placeholder } from '@/components/Placeholder';

interface Params {
  pathway: string;
  module: string;
  tier: string;
  stage: string;
}

const T1_T3_STAGES = new Set(['guided', 'check', 'takeaway']);
const T4_STAGES = new Set(['exercise', 'critique', 'answer', 'reflection']);

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
            ? 'T4 Expert flow. Slot 3 (`answer`) dispatches between ModelAnswer (variants A: M1–M5) and AppliedExerciseSecondary (variant B: M6–M8) based on the parsed component type.'
            : 'T1–T3 flow: guided → check → takeaway. Scenario lives at its own literal route (/scenario) for the full-bleed immersive layout.'
        }
      />
    </PageBody>
  );
}
