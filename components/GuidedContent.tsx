import { Markdown } from './Markdown';
import { StickyFooter } from './StickyFooter';
import type { Tier } from '@/lib/content';

interface GuidedContentProps {
  pathwaySlug: string;
  moduleId: string;
  tier: Tier;
  moduleTitle: string;
  tierName: string;
  estimatedTime?: string;
  bodyMarkdown: string;
}

export function GuidedContent({
  pathwaySlug,
  moduleId,
  tier,
  moduleTitle,
  tierName,
  estimatedTime,
  bodyMarkdown,
}: GuidedContentProps) {
  const scenarioHref = `/${pathwaySlug}/${moduleId}/${tier}/scenario`;
  const checkHref = `/${pathwaySlug}/${moduleId}/${tier}/check`;
  const eyebrow = estimatedTime
    ? `Guided content · ~${estimatedTime} read`
    : 'Guided content';

  return (
    <>
      <article className="pb-8">
        <header>
          <p className="text-eyebrow text-yellow-deep">{eyebrow}</p>
          <h1 className="mt-2 text-h1 font-extrabold text-navy">{moduleTitle}</h1>
          <p className="mt-3 font-mono text-mono-meta uppercase tracking-[0.08em] text-ink-2">
            {tierName}
          </p>
        </header>

        <div className="mt-10">
          <Markdown source={bodyMarkdown} variant="reading" />
        </div>
      </article>

      <StickyFooter
        prev={{ href: scenarioHref, label: 'Scenario' }}
        next={{ href: checkHref, label: 'Understanding check' }}
        stepCount={4}
        currentStep={2}
      />
    </>
  );
}
