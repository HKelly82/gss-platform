'use client';

import { useEffect } from 'react';
import { ModuleCard, type ModuleCardStatus } from './ModuleCard';
import type { ModuleMeta, Pathway, Tier } from '@/lib/content';
import { setPathway, useProgress } from '@/lib/progress';

interface PathwayHomeProps {
  pathway: Pathway;
  pathwaySlug: string;
  modules: ModuleMeta[];
}

const TIER_ORDER: Tier[] = ['T1', 'T2', 'T3', 'T4'];

export function PathwayHome({ pathway, pathwaySlug, modules }: PathwayHomeProps) {
  const progress = useProgress();

  useEffect(() => {
    setPathway(pathway);
  }, [pathway]);

  const pathwayProgress = progress?.pathways?.[pathway];

  const statusFor = (moduleId: string): { status: ModuleCardStatus; detailLabel: string } => {
    const modProgress = pathwayProgress?.modules?.[moduleId];
    if (!modProgress) return { status: 'not-started', detailLabel: '4 tiers' };

    const completedCount = TIER_ORDER.filter((t) => modProgress.tiers?.[t]?.tierComplete).length;

    if (completedCount === 4) {
      return { status: 'completed', detailLabel: 'All 4 tiers complete' };
    }
    if (completedCount > 0) {
      return {
        status: 'in-progress',
        detailLabel: `${completedCount} of 4 tiers complete`,
      };
    }
    if (modProgress.placement) {
      return {
        status: 'placement-set',
        detailLabel: `Placed at ${modProgress.placement.landedAt}`,
      };
    }
    return { status: 'not-started', detailLabel: '4 tiers' };
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      <header>
        <p className="text-eyebrow text-yellow-deep">{pathway} pathway</p>
        <h1 className="mt-2 text-h1 font-extrabold text-navy">Modules in this pathway</h1>
        <p className="mt-3 font-serif text-lede text-ink-2">
          Each module covers two or three Service Standard points across four progressive tiers.
          Pick any module to start — the module-entry diagnostic will place you at the tier that
          matches the conversation you can already have.
        </p>
      </header>

      <section aria-labelledby="pathway-home-modules" className="flex flex-col gap-3">
        <h2 id="pathway-home-modules" className="sr-only">
          Modules
        </h2>
        {modules.map((mod) => {
          const { status, detailLabel } = statusFor(mod.moduleId);
          return (
            <ModuleCard
              key={mod.moduleId}
              moduleId={mod.moduleId}
              moduleTitle={mod.moduleTitle}
              href={`/${pathwaySlug}/${mod.moduleId}`}
              status={status}
              detailLabel={detailLabel}
            />
          );
        })}
      </section>
    </div>
  );
}
