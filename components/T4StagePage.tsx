import { StickyFooter } from './StickyFooter';

interface T4StagePageProps {
  stageLabel: string;
  currentStep: number;
  moduleTitle: string;
  tierName: string;
  body: React.ReactNode;
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}

export function T4StagePage({
  stageLabel,
  currentStep,
  moduleTitle,
  tierName,
  body,
  prev,
  next,
}: T4StagePageProps) {
  return (
    <>
      <article className="pb-8">
        <header>
          <p className="text-eyebrow text-yellow-deep">{stageLabel}</p>
          <h1 className="mt-2 text-h1 font-extrabold text-navy">{moduleTitle}</h1>
          <p className="mt-3 text-eyebrow text-ink-2">{tierName}</p>
        </header>
        <div className="mt-10">{body}</div>
      </article>
      <StickyFooter prev={prev} next={next} stepCount={4} currentStep={currentStep} />
    </>
  );
}
