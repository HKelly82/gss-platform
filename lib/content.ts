import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type Pathway = 'BA' | 'DM' | 'PM' | 'SME';
export type Tier = 'T1' | 'T2' | 'T3' | 'T4';
export type FileStatus = 'draft' | 'qa-passed' | 'needs-review' | 'herd-review';

export type InteractionType =
  | 'DIAGNOSTIC'
  | 'SCENARIO_NARRATIVE'
  | 'MULTIPLE_CHOICE'
  | 'CRITIQUE'
  | 'SHORT_ANSWER'
  | 'DRAG_DROP';

export type ComponentKind =
  | 'diagnostic'
  | 'scenario'
  | 'guided-content'
  | 'understanding-check'
  | 'takeaway'
  | 'applied-exercise'
  | 'critique-prompt'
  | 'model-answer'
  | 'reflection';

export interface ContentBlock {
  component: ComponentKind;
  interaction?: InteractionType;
  body: string;
  designerNotes: string[];
}

export type PlacementChoice = 'A' | 'B' | 'C' | 'D';

export interface DiagnosticOption {
  letter: PlacementChoice;
  answer: string;
  explanation: string;
  landingTier: Tier;
  landingLabel: string;
}

export interface ParsedDiagnostic {
  scenarioMarkdown: string;
  options: DiagnosticOption[];
  notesMarkdown: string;
}

export interface TierHeader {
  moduleTitle: string;
  tierName: string;
  estimatedTime?: string;
}

export type MCQLetter = 'A' | 'B' | 'C' | 'D';

export interface MCQOption {
  letter: MCQLetter;
  text: string;
}

export interface MCQ {
  questionNumber: number;
  stem: string;
  options: MCQOption[];
  correctLetter: MCQLetter;
  modelAnswerMarkdown: string;
  redirectMarkdown: string;
}

export interface ParsedUnderstandingCheck {
  introMarkdown: string;
  mcqs: MCQ[];
}

export interface BaseFrontmatter {
  sources: string[];
  status: FileStatus;
}

export interface TierFrontmatter extends BaseFrontmatter {
  module: string;
  tier: Tier;
  component: 'tier-bundle';
}

export interface EntryFrontmatter extends BaseFrontmatter {
  module: string;
  component: 'diagnostic';
}

export interface ReferenceCardFrontmatter extends BaseFrontmatter {
  module: string;
  component: 'reference-card';
}

export interface SupplementFrontmatter extends BaseFrontmatter {
  supplement: string;
  role: string;
  'parent-module': string;
  'floor-tier': Tier;
  component: 'role-supplement';
}

export interface ParsedTier {
  kind: 'tier';
  filePath: string;
  frontmatter: TierFrontmatter;
  preface: string;
  blocks: ContentBlock[];
  fileDesignerNotes: string[];
}

export interface ParsedEntry {
  kind: 'entry';
  filePath: string;
  frontmatter: EntryFrontmatter;
  preface: string;
  blocks: ContentBlock[];
  fileDesignerNotes: string[];
}

export interface ParsedReferenceCard {
  kind: 'reference-card';
  filePath: string;
  frontmatter: ReferenceCardFrontmatter;
  body: string;
  designerNotes: string[];
}

export interface ParsedSupplement {
  kind: 'role-supplement';
  filePath: string;
  frontmatter: SupplementFrontmatter;
  body: string;
  designerNotes: string[];
}

export interface ParsedLongform {
  kind: 'longform';
  filePath: string;
  slug: string;
  body: string;
  designerNotes: string[];
}

export type ParsedFile =
  | ParsedTier
  | ParsedEntry
  | ParsedReferenceCard
  | ParsedSupplement
  | ParsedLongform;

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'output');

const COMPONENT_START_RE = /^---COMPONENT:\s*([a-z-]+)---\s*$/;
const COMPONENT_END_RE = /^---END COMPONENT---\s*$/;
const INTERACTION_START_RE = /^---LEARNER INTERACTION:\s*([A-Z_]+)---\s*$/;
const INTERACTION_END_RE = /^---END INTERACTION---\s*$/;

function stripDesignerNotes(text: string): { body: string; notes: string[] } {
  const notes: string[] = [];
  const re = /---DESIGNER NOTE:\s*([\s\S]*?)---/g;
  const body = text.replace(re, (_match, p1: string) => {
    notes.push(p1.trim());
    return '';
  });
  return { body, notes };
}

function extractPreface(body: string): { preface: string; rest: string } {
  const lines = body.split(/\r?\n/);
  const firstComponentIdx = lines.findIndex((l) => COMPONENT_START_RE.test(l));
  if (firstComponentIdx === -1) {
    return { preface: body.trim(), rest: '' };
  }
  return {
    preface: lines.slice(0, firstComponentIdx).join('\n').trim(),
    rest: lines.slice(firstComponentIdx).join('\n'),
  };
}

function parseBlocks(body: string): ContentBlock[] {
  const lines = body.split(/\r?\n/);
  const blocks: ContentBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const compMatch = lines[i].match(COMPONENT_START_RE);
    if (!compMatch) {
      i++;
      continue;
    }
    const component = compMatch[1] as ComponentKind;
    i++;
    let interaction: InteractionType | undefined;
    const bodyLines: string[] = [];
    while (i < lines.length) {
      const cur = lines[i];
      if (COMPONENT_END_RE.test(cur)) {
        i++;
        break;
      }
      if (COMPONENT_START_RE.test(cur)) {
        break;
      }
      const intStart = cur.match(INTERACTION_START_RE);
      if (intStart) {
        interaction = intStart[1] as InteractionType;
        i++;
        while (i < lines.length) {
          if (INTERACTION_END_RE.test(lines[i])) {
            i++;
            break;
          }
          if (COMPONENT_START_RE.test(lines[i]) || COMPONENT_END_RE.test(lines[i])) {
            break;
          }
          bodyLines.push(lines[i]);
          i++;
        }
        continue;
      }
      bodyLines.push(cur);
      i++;
    }
    blocks.push({
      component,
      interaction,
      body: bodyLines.join('\n').trim(),
      designerNotes: [],
    });
  }
  return blocks;
}

function readFile(filePath: string): { data: Record<string, unknown>; content: string } {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(raw);
  return { data: parsed.data, content: parsed.content };
}

function moduleSlug(filename: string): string {
  return filename.replace(/\.md$/, '');
}

export function parseFile(filePath: string): ParsedFile {
  const { data, content } = readFile(filePath);
  const { body: stripped, notes } = stripDesignerNotes(content);
  const fm = data as Record<string, unknown>;
  const component = fm.component as string | undefined;

  if (component === 'tier-bundle') {
    const { preface, rest } = extractPreface(stripped);
    return {
      kind: 'tier',
      filePath,
      frontmatter: fm as unknown as TierFrontmatter,
      preface,
      blocks: parseBlocks(rest),
      fileDesignerNotes: notes,
    };
  }
  if (component === 'diagnostic') {
    const { preface, rest } = extractPreface(stripped);
    return {
      kind: 'entry',
      filePath,
      frontmatter: fm as unknown as EntryFrontmatter,
      preface,
      blocks: parseBlocks(rest),
      fileDesignerNotes: notes,
    };
  }
  if (component === 'reference-card') {
    return {
      kind: 'reference-card',
      filePath,
      frontmatter: fm as unknown as ReferenceCardFrontmatter,
      body: stripped.trim(),
      designerNotes: notes,
    };
  }
  if (component === 'role-supplement') {
    return {
      kind: 'role-supplement',
      filePath,
      frontmatter: fm as unknown as SupplementFrontmatter,
      body: stripped.trim(),
      designerNotes: notes,
    };
  }
  return {
    kind: 'longform',
    filePath,
    slug: moduleSlug(path.basename(filePath)),
    body: stripped.trim(),
    designerNotes: notes,
  };
}

function listMarkdown(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.md'))
    .map((d) => path.join(dir, d.name));
}

export function listModuleIds(): string[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];
  return fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^M[1-8]$/.test(d.name))
    .map((d) => d.name)
    .sort();
}

export function assertContentLoaded(): void {
  if (listModuleIds().length === 0) {
    throw new Error(
      [
        'content/output/ is empty or missing.',
        'The curriculum submodule (HKelly82/gss-curriculum) failed to clone.',
        'Likely causes: Vercel cannot read the submodule repo (check visibility + Vercel GitHub App access),',
        'or the build is running without `git submodule update --init --recursive`.',
        'See SETUP.md for the wiring steps.',
      ].join(' '),
    );
  }
}

export function getModuleEntry(moduleId: string): ParsedEntry | null {
  const filePath = path.join(CONTENT_ROOT, moduleId, `${moduleId}-entry.md`);
  if (!fs.existsSync(filePath)) return null;
  const parsed = parseFile(filePath);
  return parsed.kind === 'entry' ? parsed : null;
}

export function parseTierHeader(preface: string): TierHeader {
  const h1 = preface.match(/^#\s+(.+)$/m);
  const h2 = preface.match(/^##\s+(.+)$/m);
  const time = preface.match(/^\*\*Estimated time:\*\*\s*(.+?)\.?\s*$/m);
  return {
    moduleTitle: h1 ? h1[1].trim() : '',
    tierName: h2 ? h2[1].trim() : '',
    estimatedTime: time ? time[1].trim() : undefined,
  };
}

export function getScenarioBlock(tier: ParsedTier): ContentBlock | null {
  return (
    tier.blocks.find(
      (b) => b.component === 'scenario' && b.interaction === 'SCENARIO_NARRATIVE',
    ) ?? null
  );
}

export function getGuidedBlock(tier: ParsedTier): ContentBlock | null {
  return tier.blocks.find((b) => b.component === 'guided-content') ?? null;
}

export function getUnderstandingCheckBlock(tier: ParsedTier): ContentBlock | null {
  return tier.blocks.find((b) => b.component === 'understanding-check') ?? null;
}

export function getTakeawayBlock(tier: ParsedTier): ContentBlock | null {
  return tier.blocks.find((b) => b.component === 'takeaway') ?? null;
}

export function getAppliedExerciseBlock(tier: ParsedTier): ContentBlock | null {
  return tier.blocks.find((b) => b.component === 'applied-exercise') ?? null;
}

export function getCritiquePromptBlock(tier: ParsedTier): ContentBlock | null {
  return tier.blocks.find((b) => b.component === 'critique-prompt') ?? null;
}

/**
 * Slot 3 of the T4 Expert sequence sits AFTER critique-prompt. It is either
 * `model-answer` (variant A, M1-M5) or a second `applied-exercise` (variant B,
 * M6-M8). Returns the block at that position with its parsed `component`
 * preserved so the renderer can dispatch — `ModelAnswer` (with reveal) for
 * variant A, plain `AppliedExercise` for variant B.
 */
export function getAnswerSlotBlock(tier: ParsedTier): ContentBlock | null {
  const critiqueIdx = tier.blocks.findIndex((b) => b.component === 'critique-prompt');
  if (critiqueIdx === -1 || critiqueIdx + 1 >= tier.blocks.length) return null;
  const next = tier.blocks[critiqueIdx + 1];
  if (next.component === 'model-answer' || next.component === 'applied-exercise') return next;
  return null;
}

export function getReflectionBlock(tier: ParsedTier): ContentBlock | null {
  return tier.blocks.find((b) => b.component === 'reflection') ?? null;
}

export interface ModuleMeta {
  moduleId: string;
  moduleTitle: string;
  availableTiers: Tier[];
}

export interface ReferenceCardView {
  displayTitle: string;
  standfirstMarkdown: string;
  bodyMarkdown: string;
}

export interface SupplementView {
  displayTitle: string;
  bodyMarkdown: string;
}

export type SupplementPathway = 'BA' | 'DM' | 'PM';

export function parseSupplementView(supplement: ParsedSupplement): SupplementView {
  const body = supplement.body;
  const lines = body.split(/\r?\n/);
  const h1Idx = lines.findIndex((l) => /^#\s+\S/.test(l));
  if (h1Idx < 0) {
    return { displayTitle: 'Supplement', bodyMarkdown: body };
  }
  const h1Line = lines[h1Idx].replace(/^#\s+/, '').trim();
  const displayTitle = h1Line.replace(/^Module\s+\d+\s+supplement\s*[—-]\s*/i, '').trim();
  const rest = lines
    .slice(h1Idx + 1)
    .join('\n')
    .replace(/^\s+/, '')
    .trim();
  return {
    displayTitle: displayTitle || 'Supplement',
    bodyMarkdown: rest,
  };
}

export type L0SectionKey =
  | 'diagnostic'
  | 'scenario'
  | 'guided-content'
  | 'understanding-check'
  | 'takeaway';

export interface ParsedL0Section {
  key: L0SectionKey;
  filePath: string;
  body: string;
  designerNotes: string[];
}

function stripComponentMarkers(text: string): string {
  return text
    .replace(/^---COMPONENT:[^\n]*$/gm, '')
    .replace(/^---END COMPONENT---\s*$/gm, '')
    .replace(/^---LEARNER INTERACTION:[^\n]*$/gm, '')
    .replace(/^---END INTERACTION---\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n');
}

function stripLeadingH1(text: string): string {
  // Trim leading whitespace first so the H1 (which gray-matter often emits
  // after a leading newline) is matched at the true start of content.
  return text.replace(/^\s*#\s+[^\n]*\n+/, '');
}

export function getL0Section(key: L0SectionKey): ParsedL0Section | null {
  const filePath = path.join(CONTENT_ROOT, 'L0', `L0-${key}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(raw);
  const { body, notes } = stripDesignerNotes(parsed.content);
  const cleaned = stripLeadingH1(stripComponentMarkers(body)).trim();
  return { key, filePath, body: cleaned, designerNotes: notes };
}

export function hasL0(): boolean {
  return getL0Section('diagnostic') !== null;
}

export function listExistingSupplements(): Array<{
  moduleId: string;
  pathway: SupplementPathway;
}> {
  const dir = path.join(CONTENT_ROOT, 'supplements');
  if (!fs.existsSync(dir)) return [];
  const out: Array<{ moduleId: string; pathway: SupplementPathway }> = [];
  for (const file of fs.readdirSync(dir)) {
    const match = file.match(/^(M[1-8])-S-(BA|DM|PM)\.md$/);
    if (match) {
      out.push({ moduleId: match[1], pathway: match[2] as SupplementPathway });
    }
  }
  return out.sort((a, b) => a.moduleId.localeCompare(b.moduleId) || a.pathway.localeCompare(b.pathway));
}

export function parseReferenceCardView(card: ParsedReferenceCard): ReferenceCardView {
  const body = card.body;
  const lines = body.split(/\r?\n/);

  const h1Idx = lines.findIndex((l) => /^#\s+\S/.test(l));
  let displayTitle = '';
  let rest: string;
  if (h1Idx >= 0) {
    const h1Line = lines[h1Idx].replace(/^#\s+/, '').trim();
    displayTitle = h1Line.replace(/^REF-M\d+\s*[—-]\s*/, '').trim();
    rest = lines
      .slice(h1Idx + 1)
      .join('\n')
      .trim();
  } else {
    rest = body;
  }

  const restLines = rest.split(/\r?\n/);
  let standfirstEnd = restLines.length;
  let sawContent = false;
  for (let i = 0; i < restLines.length; i++) {
    const line = restLines[i];
    if (line.trim() === '') {
      if (sawContent) {
        standfirstEnd = i;
        break;
      }
      continue;
    }
    if (/^---\s*$/.test(line) || /^#{1,6}\s+/.test(line)) {
      standfirstEnd = i;
      break;
    }
    sawContent = true;
  }
  const standfirstMarkdown = restLines.slice(0, standfirstEnd).join('\n').trim();
  const tail = restLines.slice(standfirstEnd).join('\n').trim();
  const bodyMarkdown = tail.replace(/^---\s*\n/, '').trim();

  return {
    displayTitle: displayTitle || 'Reference card',
    standfirstMarkdown,
    bodyMarkdown,
  };
}

export function getModuleMeta(moduleId: string): ModuleMeta | null {
  const tierOrder: Tier[] = ['T1', 'T2', 'T3', 'T4'];
  const availableTiers: Tier[] = [];
  let moduleTitle = '';
  for (const t of tierOrder) {
    const parsed = getTier(moduleId, t);
    if (parsed) {
      availableTiers.push(t);
      if (!moduleTitle) {
        const header = parseTierHeader(parsed.preface);
        moduleTitle = header.moduleTitle;
      }
    }
  }
  if (availableTiers.length === 0) return null;
  return { moduleId, moduleTitle, availableTiers };
}

const MCQ_QUESTION_START_RE = /\*\*Question\s+(\d+)\.\*\*/g;
const MCQ_STEM_RE = /^\*\*Question\s+\d+\.\*\*\s*([\s\S]+?)(?=\n\s*-\s+\*\*[A-D]\.)/;
const MCQ_OPTION_RE =
  /(?:^|\n)-\s+\*\*([A-D])\.\*\*\s+([\s\S]+?)(?=\n\s*-\s+\*\*[A-D]\.|\n\s*\*\*Model answer:|\s*$)/g;
const MCQ_MODEL_RE = /\*\*Model answer:\*\*\s+([A-D])\./;
const MCQ_REDIRECT_RE = /(\*If you chose[\s\S]+?\*)\s*$/m;

function parseMcqChunk(questionNumber: number, raw: string): MCQ | null {
  const stemMatch = raw.match(MCQ_STEM_RE);
  if (!stemMatch) return null;
  const stem = stemMatch[1].trim();

  const options: MCQOption[] = [];
  MCQ_OPTION_RE.lastIndex = 0;
  let om: RegExpExecArray | null;
  while ((om = MCQ_OPTION_RE.exec(raw)) !== null) {
    options.push({
      letter: om[1] as MCQLetter,
      text: om[2].trim().replace(/\s+/g, ' '),
    });
  }
  if (options.length !== 4) return null;

  const modelMatch = raw.match(MCQ_MODEL_RE);
  const correctLetter = (modelMatch?.[1] ?? 'A') as MCQLetter;

  let modelAnswerMarkdown = '';
  let redirectMarkdown = '';
  if (modelMatch) {
    const modelStart = raw.indexOf(modelMatch[0]) + modelMatch[0].length;
    const tail = raw.slice(modelStart);
    const redirectMatch = tail.match(MCQ_REDIRECT_RE);
    if (redirectMatch) {
      modelAnswerMarkdown = tail.slice(0, redirectMatch.index).trim();
      redirectMarkdown = redirectMatch[1].trim();
    } else {
      modelAnswerMarkdown = tail.trim();
    }
  }

  return {
    questionNumber,
    stem,
    options,
    correctLetter,
    modelAnswerMarkdown,
    redirectMarkdown,
  };
}

export function parseUnderstandingCheckBlock(block: ContentBlock): ParsedUnderstandingCheck {
  const body = block.body;
  const starts: Array<{ num: number; index: number }> = [];
  MCQ_QUESTION_START_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = MCQ_QUESTION_START_RE.exec(body)) !== null) {
    starts.push({ num: parseInt(m[1], 10), index: m.index });
  }
  if (starts.length === 0) {
    return { introMarkdown: body.trim(), mcqs: [] };
  }
  const introMarkdown = body.slice(0, starts[0].index).trim();
  const mcqs: MCQ[] = [];
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].index;
    const end = i + 1 < starts.length ? starts[i + 1].index : body.length;
    const chunk = body.slice(start, end);
    const parsed = parseMcqChunk(starts[i].num, chunk);
    if (parsed) mcqs.push(parsed);
  }
  return { introMarkdown, mcqs };
}

export function listExistingTiers(): Array<{ moduleId: string; tier: Tier }> {
  const out: Array<{ moduleId: string; tier: Tier }> = [];
  if (!fs.existsSync(CONTENT_ROOT)) return out;
  for (const moduleId of listModuleIds()) {
    for (const tier of ['T1', 'T2', 'T3', 'T4'] as Tier[]) {
      const filePath = path.join(CONTENT_ROOT, moduleId, `${moduleId}-${tier}.md`);
      if (fs.existsSync(filePath)) out.push({ moduleId, tier });
    }
  }
  return out;
}

export function getDiagnosticForModule(moduleId: string): ParsedDiagnostic | null {
  const entry = getModuleEntry(moduleId);
  if (!entry) return null;
  const diagnosticBlock = entry.blocks.find((b) => b.component === 'diagnostic');
  if (!diagnosticBlock) return null;
  return parseDiagnosticBlock(diagnosticBlock);
}

export function getTier(moduleId: string, tier: Tier): ParsedTier | null {
  const filePath = path.join(CONTENT_ROOT, moduleId, `${moduleId}-${tier}.md`);
  if (!fs.existsSync(filePath)) return null;
  const parsed = parseFile(filePath);
  return parsed.kind === 'tier' ? parsed : null;
}

export function getReferenceCard(moduleId: string): ParsedReferenceCard | null {
  const filePath = path.join(CONTENT_ROOT, 'reference-cards', `REF-${moduleId}.md`);
  if (!fs.existsSync(filePath)) return null;
  const parsed = parseFile(filePath);
  return parsed.kind === 'reference-card' ? parsed : null;
}

export function getSupplement(
  moduleId: string,
  pathway: Exclude<Pathway, 'SME'>,
): ParsedSupplement | null {
  const filePath = path.join(CONTENT_ROOT, 'supplements', `${moduleId}-S-${pathway}.md`);
  if (!fs.existsSync(filePath)) return null;
  const parsed = parseFile(filePath);
  return parsed.kind === 'role-supplement' ? parsed : null;
}

export function listSuppLongform(): ParsedLongform[] {
  return listMarkdown(path.join(CONTENT_ROOT, 'supplements'))
    .filter((p) => /[\\/]SUPP-/.test(p))
    .map(parseFile)
    .filter((p): p is ParsedLongform => p.kind === 'longform');
}

const DIAGNOSTIC_OPTION_RE =
  /\*\*([A-D])\.\s*"([\s\S]*?)"\*\*\s*\n+\s*\*([\s\S]*?)\*\s*\n+\s*→\s*Start at\s+\*\*M\d+-(T[1-4])\s*\(([^)]+)\)\*\*/g;

export function parseDiagnosticBlock(block: ContentBlock): ParsedDiagnostic {
  const body = block.body;
  const options: DiagnosticOption[] = [];
  let firstOptionStart = -1;
  let lastOptionEnd = 0;

  DIAGNOSTIC_OPTION_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = DIAGNOSTIC_OPTION_RE.exec(body)) !== null) {
    if (firstOptionStart === -1) firstOptionStart = match.index;
    lastOptionEnd = match.index + match[0].length;
    options.push({
      letter: match[1] as PlacementChoice,
      answer: match[2].replace(/\s+/g, ' ').trim(),
      explanation: match[3].replace(/\s+/g, ' ').trim(),
      landingTier: match[4] as Tier,
      landingLabel: match[5].trim(),
    });
  }

  if (options.length === 0) {
    return { scenarioMarkdown: body.trim(), options: [], notesMarkdown: '' };
  }

  const scenarioRaw = body.slice(0, firstOptionStart);
  const notesRaw = body.slice(lastOptionEnd);

  const trimTrailingRule = (s: string): string =>
    s.replace(/\n\s*---\s*$/m, '').trim();
  const trimLeadingRule = (s: string): string =>
    s.replace(/^\s*---\s*\n/m, '').trim();

  return {
    scenarioMarkdown: trimTrailingRule(scenarioRaw),
    options,
    notesMarkdown: trimLeadingRule(notesRaw),
  };
}

export function listAllContentFiles(): string[] {
  const out: string[] = [];
  if (!fs.existsSync(CONTENT_ROOT)) return out;
  const walk = (dir: string) => {
    for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, d.name);
      if (d.isDirectory()) walk(full);
      else if (d.isFile() && d.name.endsWith('.md')) out.push(full);
    }
  };
  walk(CONTENT_ROOT);
  return out.sort();
}
