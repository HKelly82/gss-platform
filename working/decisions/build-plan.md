status: approved

# GSS Platform — Build Plan

## Changelog (revision 2 — 2026-06-22)

Applied in this revision:
- **NEW §0 "Design model as built"** — states the authoritative interaction model (what the content actually does) and lists every point where `DESIGN-SPEC.md` differs from it. The build follows §0; the spec is treated as visual reference only.
- **`design-fidelity` re-scoped** in `.claude/agents/design-fidelity.md` to visual + token fidelity only. Anything about interaction shape, component order, or routing now defers to `content-contract`. The two agents will not collide.
- **`a11y-auditor` extended** in `.claude/agents/a11y-auditor.md` to name WCAG 2.2 SC 2.4.11 (Focus Not Obscured, Minimum), 2.5.7 (Dragging Movements), and 2.5.8 (Target Size, Minimum) explicitly.
- **Deny rules tightened** in `.claude/settings.json` back to `Write(./content/**)` and `Edit(./content/**)` (was narrowed to `./content/output/**` during submodule setup). Glob format confirmed against this Claude Code build — the harness blocked path operations on `./content` earlier in the session under exactly this rule.
- **POC extended** to include the Expert reveal flow (M1-T4) alongside M3-T2. The human PoC gate now sees both shapes before mass build.
- **Parser contract verified across all 69 files** in `content/output/`. Findings folded into §0 and §2.
- **`/[tier]/diagnostic` route removed.** No current tier file backs it; the spec's per-tier State-A/State-B pattern is not implemented in content.
- **`DragDropCheck` deferred.** Grep across all of `content/output/` returns zero `---LEARNER INTERACTION: DRAG_DROP---` markers. Removed from POC and first-pass scope; gated behind not-yet-published. (See Risk 5.)
- **`CritiqueCheck` renderer added** for the `---LEARNER INTERACTION: CRITIQUE---` markers present in M6-T3, M7-T3, M8-T3. CRITIQUE is not in `CLAUDE.md`'s declared interaction-type list — surfaced as a decision for sign-off rather than self-amended.
- **Expert tier (T4) components refined** to four distinct renderers (AppliedExercise / CritiquePrompt / ModelAnswer / Reflection), with explicit route mapping for T4 pinned in §3. M6/M7/M8-T4 variant (no `model-answer` component; second `applied-exercise` in its place) surfaced as a content-shape decision.
- **Pathway-card copy marked STUB.** It is a temporary stand-in for the Phase 8 `PATH-{BA,DM,PM,SME}.md` guides; copy source flips when those land. Same pattern as the L0 banner.
- **Progress-model v1 limitation noted** (per-browser, per-device, no identity, user can clear).
- **PDF approach no longer recommended.** Both `window.print()` and `@react-pdf/renderer` written up as a decision for sign-off in §5 and §6.
- **Risk 8 (Expert skeleton "must not change")** surfaced as a `CLAUDE.md` wording proposal for sign-off, not a unilateral edit.
- **Decisions for sign-off** consolidated into a new §6.

Not applied (explicitly held for sign-off):
- Edits to `design/DESIGN-SPEC.md` (the design source is read-only).
- Edits to `CLAUDE.md` (no unilateral edits to the contract).

---

Sources read for this revision: `CLAUDE.md`, `design/DESIGN-LANGUAGE.md`, `design/DESIGN-SPEC.md`, `design/README.md`, `design/Herd Learn Prototype.dc.html` (head + pathways block), `content/CLAUDE.md`, `content/SETUP.md`, and content samples (`M1-entry`, `M1-T1`, `M1-T4`, `M3-entry`, `M3-T2`, `M6-T3`, `M6-T4`, `REF-M3`, `M3-S-PM`, `SUPP-l0-placeholder`). Marker and frontmatter checks ran across all 69 files in `content/output/`. No Figma file is wired in; `design/` is the visual reference.

## 0. Design model as built (authoritative)

This section is what the platform implements. Where it disagrees with `DESIGN-SPEC.md`, the spec is wrong relative to the as-built content; the platform follows §0. The spec edits needed to bring it back in sync are listed in §6 as a decision for sign-off (the spec file is read-only here).

### Interaction types

`CLAUDE.md` declares five: `MULTIPLE_CHOICE`, `DRAG_DROP`, `SHORT_ANSWER`, `DIAGNOSTIC`, `SCENARIO_NARRATIVE`. Grep across all 69 files in `content/output/`:

| Marker | Occurrences | Where |
|---|---|---|
| `---LEARNER INTERACTION: DIAGNOSTIC---` | 8 | `M{1..8}-entry.md` only — never in tier files |
| `---LEARNER INTERACTION: SCENARIO_NARRATIVE---` | 24 | every T1/T2/T3 across M1–M8 |
| `---LEARNER INTERACTION: MULTIPLE_CHOICE---` | ~57 | inside `understanding-check` blocks across T1/T2/T3 |
| `---LEARNER INTERACTION: CRITIQUE---` | 3 | inside `understanding-check` blocks of M6-T3, M7-T3, M8-T3 |
| `---LEARNER INTERACTION: SHORT_ANSWER---` | 0 | not present |
| `---LEARNER INTERACTION: DRAG_DROP---` | 0 | not present |

The platform must render: `DIAGNOSTIC`, `SCENARIO_NARRATIVE`, `MULTIPLE_CHOICE`, and `CRITIQUE`. `SHORT_ANSWER` and `DRAG_DROP` are not yet authored anywhere in the curriculum and are deferred. (`CRITIQUE` is the new addition — see §6 decision **D-1**.)

### Component skeletons per file shape

| File shape | `---COMPONENT---` sequence (in order) | Count of tier files |
|---|---|---|
| Module-entry diagnostic (`M*-entry.md`) | `diagnostic` | 8 |
| Intro/Foundations/Advanced tier (`M*-T{1,2,3}.md`) | `scenario` → `guided-content` → `understanding-check` → `takeaway` | 24 |
| Expert tier, variant A (`M{1,2,3,4,5}-T4.md`) | `applied-exercise` → `critique-prompt` → `model-answer` → `reflection` | 5 |
| Expert tier, variant B (`M{6,7,8}-T4.md`) | `applied-exercise` → `critique-prompt` → `applied-exercise` (second exercise replaces model-answer slot) → `reflection` | 3 |
| Reference cards | no `---COMPONENT---` markers; one body | 8 |
| Supplements (role) | no `---COMPONENT---` markers; four-part body | 16 |
| `SUPP-*` longform | no `---COMPONENT---` markers; long-form body | 4 (excl. `SUPP-l0-placeholder.md`) |
| `SUPP-l0-placeholder.md` | working-note placeholder | 1 |

Frontmatter is uniform in shape; field set varies by file type:
- Tier bundle: `module`, `tier`, `component: tier-bundle`, `sources`, `status`.
- Entry diagnostic: `module`, `component: diagnostic`, `sources`, `status`.
- Reference card: `module`, `component: reference-card`, `sources`, `status`.
- Role supplement: `supplement`, `role`, `parent-module`, `floor-tier`, `component: role-supplement`, `sources`, `status`.

### Tier prefaces

Every tier file (`M*-T*.md`) opens with an inline blockquote (`> **If you can already...**`) immediately after the H2/H3 framing and any `---DESIGNER NOTE---`. This is the "self-check / skip" preface. **It is not a separate `---COMPONENT: diagnostic---` marker**, and there are no `---LEARNER INTERACTION: DIAGNOSTIC---` markers anywhere except module-entry files. The platform renders the preface on the tier-overview page as part of the tier header, with an explicit "Skip this tier" affordance. No `/[pathway]/[module]/[tier]/diagnostic` route.

### Component order, "must not change"

`CLAUDE.md` says: "the five-component order within a tier: diagnostic → scenario → guided content → understanding check → takeaway". The as-built reality:

- **Tiers T1–T3:** four components, not five (`scenario / guided-content / understanding-check / takeaway`). The diagnostic-shaped preface is the inline blockquote in the tier header, not a separate component.
- **Tier T4 (Expert):** four components in a different order, with two variants (see table above). The model-answer reveal is its own component in variant A; in variant B the second applied-exercise is structurally in the answer slot.

The "must not change" rule is honoured in spirit: diagnostic before scenario (module-entry diagnostic precedes the tier flow); content stays gated behind the skip affordance; model answers stay hidden until reveal in both T4 variants. The literal wording in `CLAUDE.md` needs an update — recorded as **D-2** in §6 for sign-off, not edited here.

### Deviations from `DESIGN-SPEC.md`

| Topic | `DESIGN-SPEC.md` says | As-built content does | Status |
|---|---|---|---|
| Diagnostic location | Per-tier State A (decision) and State B (one MCQ) at the top of each tier | Single module-entry placement diagnostic with four options; no per-tier diagnostic markers exist | Build follows content. State-A/State-B renderer not built. |
| Tier component order | Five components: diagnostic / scenario / guided / understanding / takeaway | Four components: scenario / guided / understanding / takeaway (preface absorbs the diagnostic role) | Build follows content. |
| Expert tier shape | Same five-component shape as T1–T3 | Four components: applied-exercise / critique-prompt / model-answer / reflection (variant A) or applied-exercise / critique-prompt / applied-exercise / reflection (variant B) | Build follows content. New T4 archetype. |
| Interaction types | `CLAUDE.md`'s declared five (incl. `SHORT_ANSWER`, `DRAG_DROP`) | `DIAGNOSTIC`, `SCENARIO_NARRATIVE`, `MULTIPLE_CHOICE`, `CRITIQUE` | Build implements actual four; `CRITIQUE` is new (D-1), `SHORT_ANSWER` and `DRAG_DROP` deferred (D-3). |
| Pathway-card copy | Brief role descriptions inline in the spec | No content file yet; Phase 8 `PATH-{BA,DM,PM,SME}.md` planned | Build uses spec copy as STUB; source flips to PATH-* files when they land. |

Spec edits proposed to bring `DESIGN-SPEC.md` into line are listed under **D-4** in §6 for upstream application by the user.

## 1. Blockers

None. The build can start the moment §6's decisions are resolved. The known content/design gaps below are accepted constraints rendered as first-class empty states; they do not stop the build.

Accepted constraints (call-outs, not blockers):

- **Content count is partial.** ~69 of the forward-looking 218 files are present. The platform renders gracefully when a tier, supplement, or pathway slice is absent (route guards + empty-state copy from `content/`, not invented).
- **Tokens are prose + a pasteable Tailwind block, no `tokens.json`.** Acceptable (see Risk 1).
- **Figma Code Connect bindings are not exported.** `.dc.html` files are visual reference only.
- **Per-tier diagnostic (spec §3) has no content.** Renderer not built in v1; route absent.

If, during build, a route needs copy that isn't in `content/`, that becomes a blocker at that moment — surface it on the build plan, do not improvise.

## 2. Component inventory

All renderers consume parsed objects from `lib/content.ts`. Every interactive control gets the AA states: `focus` (yellow ring, navy on yellow surface, white ring on navy-deep), `disabled` (ink-3, no colour-alone), `motion-reduce` variants. Touch targets meet WCAG 2.5.8 (≥ 24×24 CSS px).

### Shell / layout

| Component | Purpose | States |
|---|---|---|
| `AppShell` | Root layout — fonts (`next/font/google` Public Sans, Source Serif 4, IBM Plex Mono), theme vars, paper background, skip-link target. | n/a |
| `AppBar` | Top chrome. `tone: navy \| light`. Logo home, pathway label, breadcrumb slot. | default, focus on logo/breadcrumb links |
| `Sidebar` | 312px module nav on hub. | default, current-module highlighted |
| `ModuleNavItem` | `status: complete \| current \| upcoming`. | each status, focus, current ("Now") |
| `StickyFooter` | Prev/next + `ProgressDots`. Must satisfy SC 2.4.11 (Focus Not Obscured). | default, prev-disabled at tier start |
| `BrandLockup` | Elephant PNG + wordmark + standard subtitle. | default |
| `SkipLink` | "Skip to content". | focus visible at top of every screen |

### Pathway + hub

| Component | Content source | States |
|---|---|---|
| `PathwayCard` (**STUB copy**) | Spec copy as temporary stand-in. Source flips to `content/output/pathways/PATH-{BA,DM,PM,SME}.md` (Phase 8) when those land. | default, hover, focus, selected, keyboard-selected |
| `Layer0PrimerBanner` | `content/output/supplements/SUPP-l0-placeholder.md` (same "stub until upstream lands" pattern as PathwayCard) | default, focus on CTA |
| `PathwayProgressBar` | computed from `lib/progress.ts` | default, complete |
| `TierCard` | derived from tier file presence + progress | `complete`, `current`, `not-started`, `not-yet-published`, focus |
| `ComponentRow` | one per component in the file's parsed order | `complete` ✓, `current`, `upcoming`, `skipped` (neutral), focus |
| `TierPreface` | the inline blockquote at the top of every tier file; renders alongside the tier header with a "Skip this tier" affordance | default, focus on skip control |
| `ProgressSegments` | numeric inputs | done (navy), current (yellow), remaining (grey); always paired with "n of N" text |
| `ProgressDots` | same data | same states, footer variant |

### Interaction renderers (only the four types that exist in content)

Each interaction is the leaf renderer; the surrounding `ContentBlock` carries the register.

| Renderer | Maps from | States |
|---|---|---|
| `DiagnosticDecision` | `M*-entry.md`, `---LEARNER INTERACTION: DIAGNOSTIC---` (four-option placement) | default (four large choice cards with explanatory subtext), one-option-selected (transient), placed (records placement + skips), focus, reduced-motion. **Never marks any tier failed.** |
| `ScenarioStage` | `---COMPONENT: scenario---` + `---LEARNER INTERACTION: SCENARIO_NARRATIVE---` | default (navy-deep full-bleed, serif narrative), CTA hover/focus on dark surface, reduced-motion. Read-only. |
| `GuidedContent` | `---COMPONENT: guided-content---` body markdown | default; in-flow nested blocks below |
| `KeyPrinciple` | `> **principle**` blockquotes inside guided body | default |
| `NoteCard` | guidance asides | default |
| `MultipleChoiceCheck` | `---COMPONENT: understanding-check---` + `---LEARNER INTERACTION: MULTIPLE_CHOICE---` | `default`, `selected` (radio), `correct`, `incorrect` (inline redirect text), `resolved`, `focus`, `disabled` after resolve |
| `CritiqueCheck` (**NEW**) | `---COMPONENT: understanding-check---` + `---LEARNER INTERACTION: CRITIQUE---` (M6-T3, M7-T3, M8-T3) | `empty` (autosize textarea, serif), `submitted` (own critique locked), `revealHidden`, `revealed` (model critique shown), `focus`, `disabled`. Reveal is learner-initiated. |
| `RevealAnswer` | shared primitive used by CritiqueCheck and ModelAnswer | `hidden` (`aria-expanded=false`, button: "Reveal model answer"), `revealed` (`aria-expanded=true`, ready panel), focus |
| `TakeawayList` | `---COMPONENT: takeaway---` | default; per-item focus on optional links |
| `ReferenceCardEntry` | the takeaway → reference CTA | default, focus |

**Deferred (not-yet-published gate):**

| Renderer | Why deferred | When to revisit |
|---|---|---|
| `ShortAnswerCheck` | Zero `---LEARNER INTERACTION: SHORT_ANSWER---` markers in current content. | Build when the first content file emits one; reuses `RevealAnswer` and the `CritiqueCheck` shape. |
| `DragDropCheck` | Zero `---LEARNER INTERACTION: DRAG_DROP---` markers in current content. The full WCAG 2.2 drag-drop (keyboard, SC 2.5.7 single-pointer alternative, deterministic shuffle) is non-trivial; do not build speculatively. | Build when the first content file emits one. (See Risk 4 for the seeding contract to use at that time.) |

### Expert-tier renderers (T4)

| Renderer | Maps from | Notes |
|---|---|---|
| `AppliedExercise` | `---COMPONENT: applied-exercise---` | The exercise brief + an own-work field. No model answer here. |
| `CritiquePrompt` | `---COMPONENT: critique-prompt---` | A second-pass critique on the learner's own draft. Sits *between* exercise and model-answer in variant A. |
| `ModelAnswer` | `---COMPONENT: model-answer---` | Hidden until learner reveals. Renders in variant A only. |
| `Reflection` | `---COMPONENT: reflection---` | Final reflection prompt + optional own answer. |
| `AppliedExerciseSecondary` (**variant B**) | `---COMPONENT: applied-exercise---` (when it appears in the third slot, e.g. M6-T4 line 125) | Same as `AppliedExercise` but content-aware that there is no separate `model-answer` block. See §6 **D-5**. |

### Reference & supplements

| Component | Purpose | States |
|---|---|---|
| `ReferenceCard` | renders `content/output/reference-cards/REF-M*.md` on screen and in print | screen, `@media print` (chrome removed), focus on download CTA |
| `ReferenceCardDownloadButton` | triggers print/PDF (mechanism per **D-6**) | default, focus, "printing" transient |
| `Supplement` | renders `M*-S-{PM,BA,DM}.md` four-part shape | default; surfaces only when current pathway has a matching supplement |
| `SuppLongform` | renders `SUPP-assessment-reports.md`, `SUPP-glossary.md`, `SUPP-institutional-landscape.md`, `SUPP-design-principles-reference.md` | default, anchor-linked sections |
| `EmptyStateContent` | shown when a tier/supplement file is absent | default |

### Routing-level

| Component | Purpose |
|---|---|
| `DiagnosticRouter` | client wrapper around `DiagnosticDecision`; reads `lib/progress.ts`, writes a `placement` decision per module, and pushes to the right tier route. |
| `PathwayGate` | reads stored pathway from `lib/progress.ts`; if absent and the URL needs one, redirects to `/`. |
| `TierComponentStepper` | derives the route sequence inside a tier from the file's parsed component order. Handles both T1–T3 and T4 variants A/B without hard-coding. |

### Content parser (`lib/content.ts`)

Parses frontmatter (varies by file type, see §0) then the body into a typed sequence of blocks. Marker grammar verified across all 69 files: `---COMPONENT: name---` / `---END COMPONENT---`, `---LEARNER INTERACTION: TYPE---` / `---END INTERACTION---`, `---DESIGNER NOTE: …---` (single-line). DESIGNER NOTE markers are stripped from the learner-visible AST and exposed on a developer-only debug channel; `content-contract` fails if any DESIGNER NOTE text appears in a rendered page snapshot.

The parser does **not** special-case any content variance. Where the curriculum diverges from this contract (e.g. variant-B Expert tiers), the deviation routes back to the curriculum repo as a content-contract issue — the platform parser stays generic.

## 3. Routes

App Router tree, all SSG except the interactive leaf routes (SSG shells with client islands). All learner-visible copy comes from `content/`. Stored pathway gates the `[pathway]` segment.

```
/                                         pathway selection (PathwayCard grid + Layer0 banner)
  → on choose → write progress.pathway → /[pathway]
/[pathway]                                pathway home — list of 8 modules with status
  → SME pathway redirects to /sme
/[pathway]/[module]                       module hub (sidebar + 4 TierCards, current expanded)
/[pathway]/[module]/diagnostic            module-entry diagnostic (M*-entry.md)
  ├ on placement A → /[pathway]/[module]/T1/scenario   (mark T1 current)
  ├ on placement B → /[pathway]/[module]/T2/scenario   (record T1 skipped:'placement')
  ├ on placement C → /[pathway]/[module]/T3/scenario   (record T1+T2 skipped)
  └ on placement D → /[pathway]/[module]/T4/exercise   (record T1+T2+T3 skipped)
/[pathway]/[module]/[tier]                tier overview — TierPreface + Skip-tier + Begin
                                          (replaces the spec's per-tier diagnostic route)
/[pathway]/[module]/[tier]/scenario       ScenarioStage  (T1–T3 only)
/[pathway]/[module]/[tier]/guided         GuidedContent  (T1–T3 only)
/[pathway]/[module]/[tier]/check          MultipleChoiceCheck | CritiqueCheck  (T1–T3)
/[pathway]/[module]/[tier]/takeaway       TakeawayList + ReferenceCardEntry  (T1–T3)
/[pathway]/[module]/T4/exercise           AppliedExercise               (T4, both variants)
/[pathway]/[module]/T4/critique           CritiquePrompt                (T4, both variants)
/[pathway]/[module]/T4/answer             ModelAnswer (variant A)
                                          AppliedExerciseSecondary (variant B)
                                          — the renderer dispatches on the parsed component
                                          type at slot 3; the URL stays stable per learner
                                          across both shapes.
/[pathway]/[module]/T4/reflection         Reflection                    (T4, both variants)
/[pathway]/[module]/reference             ReferenceCard (screen + print)
/[pathway]/[module]/supplement            role supplement (resolved from pathway + module)
/sme                                      SME pathway home (placeholder until content lands)
/about, /print/[pathway]/[module]/reference  utility routes (print is a no-chrome print view)
```

### Diagnostic skip/proceed branching

- **Module-entry diagnostic** (the four-option placement in `M*-entry.md`) routes the learner to the tier they chose and records lower tiers as `skipped:'placement'`. No tier is ever marked failed. Hub copy uses "Skipped" framing.
- **Tier preface self-check** (inline `> blockquote` at the top of each `M*-T*.md`): rendered on the tier overview, not as a separate route. A "Skip this tier — go to next" link is available alongside "Begin tier" and writes `skipped:'self-check'`.
- **Understanding check** is never a gate. A learner can leave it incomplete; only "marked complete" by reaching takeaway.

### T4 component-to-route mapping (pinned)

| T4 slot | Variant A (M1–M5) | Variant B (M6–M8) | Route segment | Renderer |
|---|---|---|---|---|
| 1 | `applied-exercise` | `applied-exercise` | `/T4/exercise` | `AppliedExercise` |
| 2 | `critique-prompt` | `critique-prompt` | `/T4/critique` | `CritiquePrompt` |
| 3 | `model-answer` | `applied-exercise` | `/T4/answer` | `ModelAnswer` *or* `AppliedExerciseSecondary` (dispatch on parsed type) |
| 4 | `reflection` | `reflection` | `/T4/reflection` | `Reflection` |

`/T4/exercise/scenario` and `/T4/guided` do **not** exist. The general T1–T3 stepper does not apply at T4.

### Proof-of-concept route

Build the full M3-T2 *and* M1-T4 end-to-end before the PoC gate, plus the supporting routes needed to reach each. The human gate must see both shapes — the four-step T1–T3 flow and the four-step T4 Expert reveal flow — before mass build.

**M3-T2 (Foundations, PM):**

```
/   →   /pm   →   /pm/M3   →   /pm/M3/diagnostic   →   /pm/M3/T2/scenario
                                                  →   /pm/M3/T2/guided
                                                  →   /pm/M3/T2/check        (3 MCQs)
                                                  →   /pm/M3/T2/takeaway
                                                  →   /pm/M3/reference (REF-M3, print)
                                                  →   /pm/M3/supplement (M3-S-PM)
```

Why: M3-T2 is `qa-passed`, exercises three MultipleChoiceCheck items with redirect text, the takeaway, the printable reference card, and the pathway → supplement plumbing.

**M1-T4 (Expert, PM):**

```
/   →   /pm   →   /pm/M1   →   /pm/M1/diagnostic   →   /pm/M1/T4/exercise
                                                  →   /pm/M1/T4/critique
                                                  →   /pm/M1/T4/answer    (ModelAnswer hidden → revealed)
                                                  →   /pm/M1/T4/reflection
```

Why: M1-T4 is variant A (`applied-exercise / critique-prompt / model-answer / reflection`) and exercises the full reveal contract — the only thing the platform must defend at Expert tier. Variant B is **not** in PoC scope; it is implemented behind the same generic `TierComponentStepper` but validated after PoC sign-off.

After PoC passes all four DoD gates **for both M3-T2 and M1-T4**, STOP for human review.

## 4. Progress model

`lib/progress.ts` is the only client-side storage in the app. Everything else is SSG. The module exports a typed read/write API; components never touch `window.localStorage` directly.

**v1 limitation:** progress is per-browser/per-device, anonymous, and a learner can clear it (devtools, "clear site data", new device). It does not follow a learner across devices. There is no server, no identity, no analytics in v1. If cross-device continuity is wanted later, that is a v2 decision.

### What it tracks

- **Active pathway** — `BA | DM | PM | SME | null`.
- **Per-pathway module/tier component progress** — which of the file's components is `viewed | complete`; tier `complete` when the final component (takeaway for T1–T3, reflection for T4) is viewed.
- **Diagnostic placement decisions** — for each module, which option the learner chose (`A|B|C|D`) and the resulting `skipped:[T1?,T2?,T3?]` set, marked with reason `placement | self-check | manual`.
- **Check answers** — last answer index per MCQ; submitted critique text per CritiqueCheck; model-answer reveal flags (covers `CritiqueCheck` reveal and T4 `ModelAnswer` reveal).
- **Reference-card visits** — boolean per module.
- **Timestamps** — `lastVisited` per route for resume.
- **Schema version** — for forward-compatible migrations.

Explicitly NOT tracked: identity, completion totals across pathways, any analytics.

### localStorage shape

Single key, single JSON blob, namespaced:

```
key: "gss-platform:progress:v1"
```

```ts
type Pathway = 'BA' | 'DM' | 'PM' | 'SME';
type Tier = 'T1' | 'T2' | 'T3' | 'T4';
type ComponentKey =
  | 'scenario' | 'guided' | 'check' | 'takeaway'       // T1–T3
  | 'exercise' | 'critique' | 'answer' | 'reflection'; // T4
type SkipReason = 'placement' | 'self-check' | 'manual';
type ComponentStatus = 'unseen' | 'viewed' | 'complete';

interface ProgressV1 {
  version: 1;
  pathway: Pathway | null;
  updatedAt: string;
  pathways: {
    [P in Pathway]?: {
      modules: {
        [moduleId: string]: {                              // 'M1'..'M8'
          placement?: { choice: 'A'|'B'|'C'|'D'; landedAt: Tier; at: string };
          tiers: {
            [T in Tier]?: {
              skipped?: { reason: SkipReason; at: string };
              components: { [C in ComponentKey]?: ComponentStatus };
              checks?: {
                [checkId: string]: {
                  answerIdx?: number;                       // MCQ
                  critiqueText?: string;                    // CritiqueCheck
                  resolved?: boolean;
                  revealedModel?: boolean;
                };
              };
              tierComplete?: boolean;
              lastVisited?: string;
            };
          };
          referenceCardViewed?: boolean;
        };
      };
    };
  };
}
```

API sketch (contract only — no implementation in this plan):

```
getProgress(): ProgressV1
setPathway(p: Pathway): void
recordPlacement(moduleId, choice): void
markComponentViewed(moduleId, tier, component): void
markTierComplete(moduleId, tier): void
recordCheckAnswer(moduleId, tier, checkId, payload): void
revealModel(moduleId, tier, checkId): void
markReferenceViewed(moduleId): void
manuallySkipTier(moduleId, tier): void
reset(): void                                              // dev only
```

SSR safety: every read is gated through a client wrapper that returns `null` during SSR, hydrates on mount, and `useSyncExternalStore` keeps components in sync across tabs.

## 5. Risks / decisions

Each with the recommendation in bold. Items needing user sign-off also appear consolidated in §6.

1. **Tokens as prose vs. a structured tokens file.** **Recommendation:** treat the Tailwind block in `DESIGN-LANGUAGE.md` as the source of truth. Mirror it as CSS custom properties on `:root` in `globals.css`. No `tokens.json` unless a second consumer appears. Lock the literal values via a Vitest snapshot of the Tailwind config against the markdown table.

2. **Extracting Figma Code Connect bindings.** **Recommendation:** do not attempt. Use `.dc.html` as visual reference only. The component inventory in §5 of `DESIGN-LANGUAGE.md` and the archetypes in `DESIGN-SPEC.md` (subject to §0's overrides) are the contract.

3. **PDF generation for reference cards. No recommendation — decision needed.** Both options are viable and the choice is a product call. See §6 **D-6**.

4. **Deterministic seeding for randomised drag-drop.** Not active in v1 (DragDropCheck deferred), but the contract is recorded for when DragDropCheck is built: seed the shuffle deterministically from `(checkId, sessionId)` where `sessionId` is generated on first visit and stored in the same progress blob. QA fixture `sessionId: 'qa-fixture'`. Correct-order check operates on original `optionId`s, never on rendered position.

5. **DragDropCheck deferral.** Grep result: 0 occurrences of `---LEARNER INTERACTION: DRAG_DROP---` across all 69 files in `content/output/`. **Recommendation:** defer the renderer; surface a `not-yet-published` empty state if a future file emits the marker before the renderer ships. Same posture for `ShortAnswerCheck` (0 occurrences).

6. **Deny-rules scope in `.claude/settings.json`.** **Applied this revision** — extended back to `Write(./content/**)` and `Edit(./content/**)`. Glob format confirmed against this Claude Code version (the harness blocked path operations under the same rule earlier in the session).

7. **Module-entry diagnostic shape vs. spec State-A/State-B.** **Resolved this revision** — the spec's per-tier diagnostic does not exist in content. The `/[pathway]/[module]/[tier]/diagnostic` route is removed; the spec's two-state archetype is not built. The four-option module-entry placement is the only diagnostic in v1. Recorded as a spec edit in §6 **D-4**.

8. **Expert-tier component skeleton vs. CLAUDE.md "must not change".** Treat the T4 four-component shape as a deliberate variation. The spirit of the rule (diagnostic precedes content; model answers stay hidden until reveal) is preserved. **Surfaced for sign-off** as §6 **D-2** with proposed CLAUDE.md wording — not edited unilaterally.

9. **DESIGNER NOTE leakage.** Parser strips them from the learner-visible AST and exposes them on a developer-only debug overlay (toggled by a query param). `content-contract` fails if any DESIGNER NOTE text appears in a rendered page snapshot.

10. **CRITIQUE interaction type.** Not declared in `CLAUDE.md`'s interaction-type list but present in three real tier files. **Surfaced for sign-off** as §6 **D-1**.

11. **T4 variant B (no `model-answer` slot).** M6-T4 / M7-T4 / M8-T4 replace the model-answer component with a second applied-exercise. The platform supports both via slot-3 dispatch; the question is whether the content shape is intentional. **Surfaced for sign-off** as §6 **D-5** — route back to the curriculum repo if not.

12. **Pathway-card copy.** **STUB only** in v1, sourced from spec text. Switches to `content/output/pathways/PATH-{BA,DM,PM,SME}.md` (Phase 8) when those files land; same upstream-driven pattern as the L0 banner. Do not treat the spec copy as the permanent source.

13. **Prototype-only `JumpNav`.** Build it as a dev-only floating control gated on `process.env.NODE_ENV !== 'production'`; never rendered on Vercel.

## 6. Decisions for my sign-off

Each item below needs your approval before — or in parallel with — the build. Several are upstream edits I cannot make from this repo.

### D-1. Add `CRITIQUE` to the declared interaction-type list in `CLAUDE.md`

**Why:** `---LEARNER INTERACTION: CRITIQUE---` is used in real content (`M6-T3`, `M7-T3`, `M8-T3`) but is not in `CLAUDE.md`'s list (`MULTIPLE_CHOICE, DRAG_DROP, SHORT_ANSWER, DIAGNOSTIC, SCENARIO_NARRATIVE`).

**Proposed `CLAUDE.md` edit** (lines 27–28):

> Interaction types: MULTIPLE_CHOICE, DRAG_DROP, SHORT_ANSWER, DIAGNOSTIC, SCENARIO_NARRATIVE, **CRITIQUE**. CRITIQUE is an open-text reveal interaction inside an understanding-check: the learner writes a short critique, then reveals a model critique. Model critique stays hidden until reveal, like SHORT_ANSWER.

**Action on approval:** you edit `CLAUDE.md` in the gss-platform repo.

### D-2. Reframe the "five-component order" wording in `CLAUDE.md`

**Why:** No tier file uses a five-component order. T1–T3 are four (`scenario / guided-content / understanding-check / takeaway`); T4 is four in a different order (variant A or B). The diagnostic role sits at module-entry and in the tier preface, not inside the tier component sequence.

**Proposed `CLAUDE.md` edit** (lines 34–35) — replacing the current "five-component order" bullet:

> - The component order within a tier honours the diagnostic-first principle:
>   - At module entry: a single placement diagnostic precedes the tier content.
>   - At Intro / Foundations / Advanced (T1–T3): scenario → guided-content → understanding-check → takeaway, with a self-check skip affordance rendered from the file's preface blockquote.
>   - At Expert (T4): applied-exercise → critique-prompt → model-answer (or a second applied-exercise) → reflection. Model answers stay hidden until the learner reveals them.

**Action on approval:** you edit `CLAUDE.md` in the gss-platform repo.

### D-3. Confirm `SHORT_ANSWER` and `DRAG_DROP` deferral

**Why:** 0 occurrences each in 69 files. The full WCAG 2.2 drag-drop is non-trivial; building speculatively is waste. The renderers are deferred behind a `not-yet-published` empty state.

**Choice:**
- **(a) Confirm deferral** — build only when first content file emits the marker. (Recommended.)
- **(b) Build now** — speculative renderer with QA fixture content.

**Action on approval:** I keep both renderers off the first-pass build; you tell me which option you want.

### D-4. Upstream edits to `design/DESIGN-SPEC.md`

**Why:** The spec describes patterns the content does not implement. The build follows §0 of this plan; the spec is read-only here. Bringing the spec into line is upstream work.

**Recommended edits (to be applied by you in the gss-design source):**
1. Remove or rewrite §3 "Per-tier diagnostic (State A / State B)". The content uses a single module-entry placement diagnostic; per-tier diagnostics do not exist.
2. Update the tier component order to match D-2 above (T1–T3 four-component; T4 four-component with variants).
3. Add the `CRITIQUE` interaction archetype (open-text + reveal-model, same visual shape as SHORT_ANSWER's reveal).
4. Mark the pathway-card copy block as "interim copy — superseded by Phase 8 `PATH-*.md` files when those land."

**Action on approval:** you edit `DESIGN-SPEC.md` upstream and bump the design pin.

### D-5. T4 variant B (M6-T4 / M7-T4 / M8-T4): content shape or content issue?

**Why:** Three Expert tiers replace the `model-answer` component with a second `applied-exercise` block. The platform supports both via slot-3 dispatch, but the deviation may be an authoring drift rather than an intentional shape.

**Choice:**
- **(a) Intentional** — variant B is a deliberate Expert-tier shape (no separate model-answer; the model is folded into the second exercise's narration). The platform supports both shapes.
- **(b) Authoring issue** — route back to the curriculum repo as a content-contract issue; M6/M7/M8-T4 should emit a `model-answer` component like the other Expert tiers. The platform's variant-B handling becomes dead code once the curriculum is fixed.

**Action on approval:** if (b), you open an issue against the curriculum repo. The platform still ships variant-B handling for the current pin so the build does not break before that fix lands.

### D-6. Reference-card PDF: `window.print()` vs. `@react-pdf/renderer`

**Why:** Spec says reference cards must work on screen and printed, and ship as a downloadable PDF. Two viable approaches; the choice is a product call.

| | `window.print()` + `/print/[pathway]/[module]/reference` | `@react-pdf/renderer` |
|---|---|---|
| What the user gets | A "Save as PDF" dialog in the browser's print preview. The print stylesheet is the layout. | A true `.pdf` download (Content-Disposition attachment), same on every browser. |
| Cost | None — fully static, zero deps. | A render-time dep; small bundle hit on the route that calls it. |
| Visual control | Whatever the browser's print engine does with the print stylesheet (good for modern browsers; older browsers can lose colour). | Pixel-stable typography and layout regardless of browser. |
| When you want it | Reference cards are mainly read on screen; the PDF is a "nice to have for sharing/printing in a meeting." | Reference cards are routinely emailed, attached to evidence packs, or distributed offline — the file matters more than the screen render. |
| WCAG | Same as screen — fully accessible if the print route is. | PDF accessibility is a separate concern (tagged PDF, alt text in the renderer). |

**Choice:**
- **(a) `window.print()` for v1.** Lightest, ships in PoC.
- **(b) `@react-pdf/renderer` for v1.** True downloadable file; slightly more work.

**Action on approval:** I implement the chosen approach in the PoC.

---

**Until you've signed off on §6 (or replied with overrides), I do not start the build.** Re-run `/scaffold` after the decisions are resolved and the first line of this file reads `status: approved`.
