'use client';

import { ModuleNavItem, type ModuleNavStatus } from './ModuleNavItem';
import type { ModuleMeta, Pathway, Tier } from '@/lib/content';
import { useProgress } from '@/lib/progress';

interface SidebarProps {
  pathway: Pathway;
  pathwaySlug: string;
  currentModuleId: string;
  allModules: ModuleMeta[];
}

const TIER_ORDER: Tier[] = ['T1', 'T2', 'T3', 'T4'];

export function Sidebar({ pathway, pathwaySlug, currentModuleId, allModules }: SidebarProps) {
  const progress = useProgress();
  const pathwayProgress = progress?.pathways?.[pathway];

  const completedCount = allModules.filter((m) => {
    const mp = pathwayProgress?.modules?.[m.moduleId];
    if (!mp) return false;
    return TIER_ORDER.every((t) => mp.tiers?.[t]?.tierComplete);
  }).length;

  const totalCount = allModules.length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const statusFor = (moduleId: string): ModuleNavStatus => {
    if (moduleId === currentModuleId) return 'current';
    const mp = pathwayProgress?.modules?.[moduleId];
    if (mp && TIER_ORDER.every((t) => mp.tiers?.[t]?.tierComplete)) return 'complete';
    return 'upcoming';
  };

  return (
    <aside
      aria-label="Pathway navigation"
      className="flex flex-col gap-4 rounded-card border border-line bg-white p-5"
    >
      <header className="flex flex-col gap-2">
        <p className="text-eyebrow text-yellow-deep">Your pathway</p>
        <p className="font-sans text-h3 font-semibold text-navy">{pathway}</p>
        <div className="mt-1 flex flex-col gap-1">
          <div
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Pathway progress: ${completedCount} of ${totalCount} modules complete`}
            className="h-1.5 w-full overflow-hidden rounded-full bg-grey"
          >
            <div className="h-full bg-navy" style={{ width: `${percent}%` }} />
          </div>
          <p className="text-eyebrow text-ink-2">
            {percent}% complete · {completedCount} of {totalCount} modules
          </p>
        </div>
      </header>

      <nav aria-labelledby="sidebar-modules-heading">
        <h2 id="sidebar-modules-heading" className="sr-only">
          Modules in this pathway
        </h2>
        <ol className="flex flex-col gap-1">
          {allModules.map((m) => (
            <li key={m.moduleId}>
              <ModuleNavItem
                moduleId={m.moduleId}
                moduleTitle={m.moduleTitle}
                href={`/${pathwaySlug}/${m.moduleId}`}
                status={statusFor(m.moduleId)}
              />
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
