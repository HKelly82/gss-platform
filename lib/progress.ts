import { useSyncExternalStore } from 'react';

export type Pathway = 'BA' | 'DM' | 'PM' | 'SME';
export type Tier = 'T1' | 'T2' | 'T3' | 'T4';
export type ComponentKey =
  | 'scenario'
  | 'guided'
  | 'check'
  | 'takeaway'
  | 'exercise'
  | 'critique'
  | 'answer'
  | 'reflection';
export type SkipReason = 'placement' | 'self-check' | 'manual';
export type ComponentStatus = 'unseen' | 'viewed' | 'complete';
export type PlacementChoice = 'A' | 'B' | 'C' | 'D';

export interface CheckRecord {
  answerIdx?: number;
  critiqueText?: string;
  resolved?: boolean;
  revealedModel?: boolean;
}

export interface TierProgress {
  skipped?: { reason: SkipReason; at: string };
  components: Partial<Record<ComponentKey, ComponentStatus>>;
  checks?: Record<string, CheckRecord>;
  tierComplete?: boolean;
  lastVisited?: string;
}

export interface ModuleProgress {
  placement?: { choice: PlacementChoice; landedAt: Tier; at: string };
  tiers: Partial<Record<Tier, TierProgress>>;
  referenceCardViewed?: boolean;
}

export interface PathwayProgress {
  modules: Record<string, ModuleProgress>;
}

export interface ProgressV1 {
  version: 1;
  pathway: Pathway | null;
  updatedAt: string;
  pathways: Partial<Record<Pathway, PathwayProgress>>;
}

const STORAGE_KEY = 'gss-platform:progress:v1';

function emptyProgress(): ProgressV1 {
  return {
    version: 1,
    pathway: null,
    updatedAt: new Date().toISOString(),
    pathways: {},
  };
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readStorage(): ProgressV1 {
  if (!isBrowser()) return emptyProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressV1>;
    if (parsed && parsed.version === 1 && parsed.pathways) {
      return parsed as ProgressV1;
    }
    return emptyProgress();
  } catch {
    return emptyProgress();
  }
}

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((cb) => cb());
}

function writeStorage(next: ProgressV1): void {
  next.updatedAt = new Date().toISOString();
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  notify();
}

function update(mutator: (cur: ProgressV1) => void): ProgressV1 {
  const cur = readStorage();
  mutator(cur);
  writeStorage(cur);
  return cur;
}

function ensurePathway(state: ProgressV1, pathway: Pathway): PathwayProgress {
  let p = state.pathways[pathway];
  if (!p) {
    p = { modules: {} };
    state.pathways[pathway] = p;
  }
  return p;
}

function ensureModule(pathway: PathwayProgress, moduleId: string): ModuleProgress {
  let m = pathway.modules[moduleId];
  if (!m) {
    m = { tiers: {} };
    pathway.modules[moduleId] = m;
  }
  return m;
}

function ensureTier(mod: ModuleProgress, tier: Tier): TierProgress {
  let t = mod.tiers[tier];
  if (!t) {
    t = { components: {} };
    mod.tiers[tier] = t;
  }
  return t;
}

export function getProgress(): ProgressV1 {
  return readStorage();
}

export function reset(): void {
  if (isBrowser()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  notify();
}

export function setPathway(pathway: Pathway): void {
  update((s) => {
    s.pathway = pathway;
    ensurePathway(s, pathway);
  });
}

export function recordPlacement(
  pathway: Pathway,
  moduleId: string,
  choice: PlacementChoice,
): void {
  const landedAtByChoice: Record<PlacementChoice, Tier> = { A: 'T1', B: 'T2', C: 'T3', D: 'T4' };
  const skippedByChoice: Record<PlacementChoice, Tier[]> = {
    A: [],
    B: ['T1'],
    C: ['T1', 'T2'],
    D: ['T1', 'T2', 'T3'],
  };
  const landedAt: Tier = landedAtByChoice[choice];
  const skippedTiers: Tier[] = skippedByChoice[choice];
  const at = new Date().toISOString();
  update((s) => {
    const p = ensurePathway(s, pathway);
    const m = ensureModule(p, moduleId);
    m.placement = { choice, landedAt, at };
    for (const t of skippedTiers) {
      const tp = ensureTier(m, t);
      tp.skipped = { reason: 'placement', at };
    }
  });
}

export function markComponentViewed(
  pathway: Pathway,
  moduleId: string,
  tier: Tier,
  component: ComponentKey,
): void {
  update((s) => {
    const p = ensurePathway(s, pathway);
    const m = ensureModule(p, moduleId);
    const t = ensureTier(m, tier);
    if (t.components[component] !== 'complete') {
      t.components[component] = 'viewed';
    }
    t.lastVisited = new Date().toISOString();
  });
}

export function markTierComplete(pathway: Pathway, moduleId: string, tier: Tier): void {
  update((s) => {
    const p = ensurePathway(s, pathway);
    const m = ensureModule(p, moduleId);
    const t = ensureTier(m, tier);
    t.tierComplete = true;
    t.lastVisited = new Date().toISOString();
  });
}

export function recordCheckAnswer(
  pathway: Pathway,
  moduleId: string,
  tier: Tier,
  checkId: string,
  payload: Pick<CheckRecord, 'answerIdx' | 'critiqueText' | 'resolved'>,
): void {
  update((s) => {
    const p = ensurePathway(s, pathway);
    const m = ensureModule(p, moduleId);
    const t = ensureTier(m, tier);
    if (!t.checks) t.checks = {};
    t.checks[checkId] = { ...t.checks[checkId], ...payload };
  });
}

export function revealModel(
  pathway: Pathway,
  moduleId: string,
  tier: Tier,
  checkId: string,
): void {
  update((s) => {
    const p = ensurePathway(s, pathway);
    const m = ensureModule(p, moduleId);
    const t = ensureTier(m, tier);
    if (!t.checks) t.checks = {};
    if (!t.checks[checkId]) t.checks[checkId] = {};
    t.checks[checkId].revealedModel = true;
  });
}

export function markReferenceViewed(pathway: Pathway, moduleId: string): void {
  update((s) => {
    const p = ensurePathway(s, pathway);
    const m = ensureModule(p, moduleId);
    m.referenceCardViewed = true;
  });
}

export function manuallySkipTier(pathway: Pathway, moduleId: string, tier: Tier): void {
  update((s) => {
    const p = ensurePathway(s, pathway);
    const m = ensureModule(p, moduleId);
    const t = ensureTier(m, tier);
    t.skipped = { reason: 'manual', at: new Date().toISOString() };
  });
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent): void => {
    if (e.key === STORAGE_KEY) cb();
  };
  if (isBrowser()) {
    window.addEventListener('storage', onStorage);
  }
  return () => {
    listeners.delete(cb);
    if (isBrowser()) {
      window.removeEventListener('storage', onStorage);
    }
  };
}

export function useProgress(): ProgressV1 | null {
  return useSyncExternalStore(
    subscribe,
    () => readStorage(),
    () => null,
  );
}
