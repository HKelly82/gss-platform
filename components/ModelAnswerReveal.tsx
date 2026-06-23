'use client';

import { Markdown } from './Markdown';
import { RevealAnswer } from './RevealAnswer';
import type { Pathway, Tier } from '@/lib/content';
import { revealModel, setPathway } from '@/lib/progress';

interface ModelAnswerRevealProps {
  pathway: Pathway;
  moduleId: string;
  tier: Tier;
  bodyMarkdown: string;
}

export function ModelAnswerReveal({
  pathway,
  moduleId,
  tier,
  bodyMarkdown,
}: ModelAnswerRevealProps) {
  const onReveal = () => {
    setPathway(pathway);
    revealModel(pathway, moduleId, tier, 'model-answer');
  };

  return (
    <RevealAnswer panelEyebrow="Model answer" onReveal={onReveal}>
      <Markdown source={bodyMarkdown} variant="reading" />
    </RevealAnswer>
  );
}
