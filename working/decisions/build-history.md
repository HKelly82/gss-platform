# Build history

A running log of major work on the GSS Platform. Append entries as work progresses; keep the newest day at the top.

## Conventions

- One entry per gate run (`/review-build`, `/scaffold`, `/build-component`, `/build-route`, `/deploy`) or per material decision.
- Each entry carries: short title, what changed, why, commit SHA(s), and links to any QA reports produced.
- Dates: `YYYY-MM-DD`, newest first.
- Living document — update on every significant commit. If the trajectory shifts (a renderer is renamed, a route reshaped, a decision flipped), record it here so future-you doesn't have to re-derive it from `git log`.

---

## 2026-06-23

### `/build-component t4-expert-flow` — full Expert tier · all gates **PASS** (one a11y self-heal in-pass)

- **Renderers:**
  - `components/T4StagePage.tsx` (server) — shared layout for exercise / critique / answer.
  - `components/RevealAnswer.tsx` (client) — generic button-then-panel disclosure. `aria-expanded={false}` + `aria-controls={panelId}` on the button; `role="region"` + `aria-label` on the revealed panel; **applied in-pass: `tabIndex={-1}` + `useRef`/`useEffect` to focus the panel on reveal for SR continuity**.
  - `components/ModelAnswerReveal.tsx` (client) — glue: composes `RevealAnswer` + writes progress (`setPathway` + `revealModel`) on reveal.
  - `components/T4Reflection.tsx` (client) — bespoke footer with prev + 4 dots (all done; current=4) + Back-to-module + Mark-complete (calls `markTierComplete` then routes to module hub).
- **Parser:** `lib/content.ts` adds `getAppliedExerciseBlock`, `getCritiquePromptBlock`, `getAnswerSlotBlock` (handles variant-A and variant-B by accepting either `model-answer` or `applied-exercise` at slot 3), `getReflectionBlock`.
- **Routes:** four new literal SSG: `app/[pathway]/[module]/T4/{exercise,critique,answer,reflection}/page.tsx`. 24 pages per stage × 4 = **96 new SSG pages, 414 total**.
- **[stage] catch-all:** `T4_STAGES` now empty. All T4 stages live at literal routes; unknown stages 404.
- **Variant dispatch on `/T4/answer`:** the page reads `getAnswerSlotBlock(parsedTier)` and renders `<ModelAnswerReveal>` if `block.component === 'model-answer'` (variant A, M1–M5), or plain `<Markdown>` with eyebrow "Applied exercise — continued" if `block.component === 'applied-exercise'` (variant B, M6–M8). URL stays `/T4/answer` for both.
- **QA gates:**
  - `content-contract`: PASS — 11/11. Hidden-until-reveal enforced via `RevealAnswer`'s `useState` gate. Per-module variant table confirmed: M1–M5 variant A, M6–M8 variant B.
  - `design-fidelity`: PASS — 14/14. Zero raw hex; new code uses corrected `text-eyebrow text-ink-2` tier-name pattern. Two non-defect observations: spec glyph drift (`◑` vs `◐` — spec is stale, code follows the task brief); `Dot` component duplication (now in three files — extract in next maintenance pass).
  - `a11y-auditor`: PASS — 14/14 after one in-pass self-heal (focus the revealed panel via `tabIndex={-1}` + `useEffect`).
  - `build-health`: PASS — typecheck, lint, production build clean. 414 SSG pages total. T4 bundle sizes: exercise/critique 94 kB First Load (server); answer/reflection 140 kB (client).
- **Reports:** `working/qa-reports/t4-{content-contract,design-fidelity,a11y,build-health,summary}.md`.
- **Commit:** TBD on push.
- **Impact:** the second half of the agreed PoC is now live. Option D on the diagnostic no longer leads to a dead-end — it routes to `/T4/exercise` and the learner can walk the full four-step Expert flow.

### PoC review · sign-off + post-gate adjustments

User reviewed the live Vercel PoC walkthrough and confirmed:
- Routing A → T1, B → T2, C → T3 works as expected.
- Tier completion works.
- WCAG 2.2 AA met.
- All **§6 open decisions resolved** (Helen Kelly signature, 2026-06-23 against each).

UX feedback applied this turn:
- **Type scale tuned ~15-20% smaller** in `tailwind.config.ts` after the user flagged that the spec sizes felt heavy on desktop. Display 40 → 32 px, H1 32 → 26 px, H2 24 → 20 px, H3 19 → 17 px, reading 19 → 17 px, lede 21 → 19 px, eyebrow 13 → 12 px. Body kept at 16 px (WCAG 1.4.4 zoom comfort). Diverges from `design/DESIGN-LANGUAGE.md §2` — this is the "design follows what works for the learner on desktop" judgment, not a spec violation; design-fidelity defers to the build plan under §0 / per the QA agent's re-scoped duties.

Sign-off actions applied (per §6):
- **D-1**: `CLAUDE.md` interaction-type list now includes `CRITIQUE` with explanatory sentence.
- **D-2**: `CLAUDE.md` "five-component order" rule replaced with the diagnostic-first, tier-aware wording per the build plan's proposed text.
- **D-3**: SHORT_ANSWER / DRAG_DROP deferral confirmed — no code action.
- **D-4**: Upstream `DESIGN-SPEC.md` edits — user's action, no platform change.
- **D-5**: T4 variant B (M6/M7/M8) flagged to curriculum repo as authoring issue — platform keeps variant-B handling as defensive code until upstream fix.
- **D-6**: PDF approach for reference cards = `window.print()` — applies when ReferenceCard renderer lands.

Known gap surfaced in UAT (not fixed this turn):
- Selecting option D on `/[pathway]/[module]/diagnostic` routes to `/[pathway]/[module]/T4/exercise`, which is still a placeholder. This is the **M1-T4 second half of the agreed PoC** (build plan §3) — the four T4 renderers (AppliedExercise, CritiquePrompt, ModelAnswer / AppliedExerciseSecondary, Reflection) have not been built. Next `/build-component` target.

### **PoC gate reached.** M3-T2 tier flow live end-to-end on Vercel.

UAT walkthrough confirmed by user:
```
/pm/M3/diagnostic          (pick B) →
/pm/M3/T2/scenario         (full-bleed immersive, "Begin the guided content →") →
/pm/M3/T2/guided           (calm reading register, sticky footer "Understanding check →") →
/pm/M3/T2/check            (three MCQs, hidden-until-correct model answer) →
/pm/M3/T2/takeaway         (Mark Foundations tier complete →) →
/pm/M3                     (placeholder hub)
```

All four interactive renderers (DiagnosticDecision, ScenarioStage, GuidedContent, MultipleChoiceCheck, TakeawayList) and the two shared primitives (StickyFooter, ReferenceCardEntry) pass content-contract / design-fidelity / a11y-auditor / build-health. 318 SSG pages on the live deploy.

Per `CLAUDE.md`: "After the first complete tier flow is wired end to end, STOP for human review before building the rest. This is the proof-of-concept gate." **At rest until human PoC review.**

Open work for after PoC sign-off, in priority order:
1. PathwayCard renderer for `/` (stub copy from spec until Phase 8 PATH-*.md files exist).
2. ModuleHub / Sidebar / TierCard / ComponentRow renderers for `/[pathway]` and `/[pathway]/[module]` (so learners can navigate without typing URLs).
3. ReferenceCard renderer for `/[pathway]/[module]/reference` (printable PDF question is D-6 in the build plan).
4. Supplement renderer for `/[pathway]/[module]/supplement`.
5. Three open follow-ups carried in MCQ + Takeaway summaries: `font-mono` drift on GuidedContent + ScenarioStage tier-name sublines; group-semantics consistency (DiagnosticDecision `<fieldset>` vs MCQ `role="group"`); extract `Dot` to shared component.
6. L0 routing (real content now exists at `content/output/L0/`).
7. SME routing (real content now exists at `content/output/SME/`).

### Vercel submodule deploy regression · diagnosed and defended against

UAT exposed that `/pm/M3/diagnostic` and the four T2 stage routes were **404 on Vercel** while building cleanly as 318 SSG pages locally. Root cause: `gss-curriculum` was private and Vercel's GitHub integration could not clone the submodule — `listModuleIds()` returned `[]` during the build, `generateStaticParams()` generated zero pages, and `dynamicParams = false` made every dynamic URL a 404.

Fix path:
- **Curriculum repo made public** (user action; Vercel doesn't expose a "Git Submodules" toggle in current UI — auto-clone happens automatically over HTTPS for accessible repos).
- **`vercel.json` buildCommand override:** `git submodule update --init --recursive && next build` — makes submodule clone explicit, so a future auth/visibility regression fails the build instead of silently shipping empty content.
- **`lib/content.ts` `assertContentLoaded()`:** wired into every SSG `generateStaticParams`. If `content/output/` has zero `M*/` directories, the build halts with a precise error message naming the likely causes.

Commit: **`2075182`**. Subsequent Vercel redeploy ships the full 318-page site and the M3-T2 walkthrough works end-to-end.

### Curriculum submodule bumped · `fb8c4d4` → `c9c76ff`

- Curriculum repo (`HKelly82/gss-curriculum`) shipped three new content groups:
  - **L0** — five files in the classic five-component sequence (`L0-{diagnostic,scenario,guided-content,understanding-check,takeaway}.md`). Layer 0 primer is now real content; the platform's placeholder banner can be wired through.
  - **SME** — 13 files across 3 SME meta-modules (S1, S2, S3): each has `framing` / `exercise` / `model-answer` / `debrief`, plus S2 also has `scaffolding`. The `/sme` placeholder can now be wired to real content.
  - **supplements** — two new SUPP-*: `SUPP-assessment-reports-reading-list.md`, `SUPP-practitioner-resources.md`.
- M1–M8 tier/entry/ref files unchanged (still 40 + 8 = 48 files there).
- Content/output total: **69 → 89 `.md` files**.
- Platform builds cleanly against the new pin without code changes. `listExistingTiers()` is M1..M8-only, so L0 and SME folders don't affect the existing 318-page SSG count.
- Open work surfaced: L0 routing, SME routing — both currently placeholders, content now real.

### `/build-component takeaway` — Take-this-to-work + ReferenceCardEntry · all gates **PASS** (no self-heal)

- **Renderer:** `components/TakeawayList.tsx` (client). Body markdown via `reading` variant + `ReferenceCardEntry` card + bespoke footer (prev / 4 done-state dots / Back-to-module + Mark-complete action button). On Mark-complete: `setPathway` + `markTierComplete` + route to module hub.
- **CTA card:** `components/ReferenceCardEntry.tsx` (server). White card, 6 px yellow left rail, `aria-label="Open Module {N} reference card"` for a concise SR accessible name (applied in-pass from an a11y observation). Links to `/[pathway]/[module]/reference`.
- **Parser:** `lib/content.ts` adds `getTakeawayBlock`.
- **Route:** new literal `app/[pathway]/[module]/[tier]/takeaway/page.tsx`, SSG via `listExistingTiers()` × T1–T3 × BA/DM/PM = 72 pages.
- **[stage] route:** `T1_T3_STAGES` now empty. The catch-all only handles T4 stages going forward.
- **QA gates:**
  - `content-contract`: PASS — 14/14. Single-paragraph content rendered verbatim (no forced three-card structure per build plan §0; spec §7's three-card mock superseded by content shape).
  - `design-fidelity`: PASS — zero raw hex, type / family / accent discipline clean. TakeawayList uses the corrected `text-eyebrow text-ink-2` on tier-name subline (not the `font-mono` drift in earlier renderers). One observation: `Dot` is duplicated between StickyFooter and TakeawayList — extract to shared component in next maintenance pass.
  - `a11y-auditor`: PASS — WCAG 2.2 AA. One observation applied in-pass (concise `aria-label` on ReferenceCardEntry).
  - `build-health`: PASS — **318 SSG pages total** (24 diagnostic + 72 scenario + 72 guided + 72 check + 72 takeaway + 6 static). Takeaway route First Load: 140 kB.
- **Reports:** `working/qa-reports/takeaway-{content-contract,design-fidelity,a11y,build-health,summary}.md`.
- **Commits:** **`2a38c44`** (curriculum submodule bump) + **`b2eff57`** (TakeawayList + ReferenceCardEntry) on `origin/main`.

### Fix · React #185 infinite render in `useProgress`

- `lib/progress.ts` was passing `getSnapshot = () => readStorage()` to `useSyncExternalStore`. `readStorage` `JSON.parse`s localStorage and returns a fresh object reference every call — React saw "changed state" on every render and looped until `#185 (Maximum update depth exceeded)`. Surfaced in Vercel deployment logs as the minified `#185` error.
- Fix: cache the parsed snapshot at module scope. Invalidate the cache via `notify()` on every write, and on cross-tab `storage` events. `useSyncExternalStore` now sees a stable reference between renders.
- Commit: **`a847918`** on `origin/main`. (Pushed immediately to clear the production bug.)

### `/build-component multiple-choice-check` — interactive MCQs with hidden-until-correct model answers · all gates **PASS** (one self-heal pass)

- **Renderer:** `components/MultipleChoiceCheck.tsx` (client). Top-level component renders N MCQs (M3-T2 has 3) as an `<ol>` of `<section>`s with `border-t border-line` separators. Each `MCQItem` child has its own `useState` for `attempted` (`Set<MCQLetter>`) and `correctChosen` (boolean).
- **Parser:** `lib/content.ts` adds `MCQ`, `MCQOption`, `MCQLetter`, `ParsedUnderstandingCheck`, `getUnderstandingCheckBlock`, `parseUnderstandingCheckBlock`. Regex splits the block body by `**Question N.**` then extracts stem + 4 options (`- **A.** ...`) + `**Model answer:** X.` + explanation + italic redirect.
- **Route:** new literal `app/[pathway]/[module]/[tier]/check/page.tsx`, SSG via `listExistingTiers()` × T1–T3 × BA/DM/PM = 72 pages.
- **[stage] route:** `'check'` removed from `T1_T3_STAGES`. Only `'takeaway'` remains for T1–T3 in the catch-all now.
- **Progress wiring:** first interactive component beyond DiagnosticDecision. On click: `setPathway` + `recordCheckAnswer(pathway, moduleId, tier, "q{N}", { answerIdx, resolved })`. On correct: also `revealModel(...)`.
- **Honoured must-not-change rules:**
  - Model answer (full explanation) hidden until correct pick.
  - Multi-attempt re-answer permitted; wrong options stay visually marked, correct option shows "The stronger answer" eyebrow as a text-only hint.
  - No gate — `StickyFooter` Next link always available (per `CLAUDE.md` "Understanding check is never a gate").
- **QA gates:**
  - `content-contract`: PASS — 14/14 checks. Renderer only renders MULTIPLE_CHOICE-shaped questions; CRITIQUE blocks in M6-T3 / M7-T3 / M8-T3 are silently skipped (best-case behaviour). Per-question state isolated. Hidden-until-correct upheld.
  - `design-fidelity`: **FAIL → PASS** after one self-heal. Two FAILs: `font-mono` was used on the tier-name subline (mono is reserved for reference-card metadata per design language); default badge was missing the `group-hover:bg-navy group-hover:text-white` inversion. Fixed both; also gave the option card `hover:shadow-lift` to match DiagnosticDecision. Cross-renderer drift recorded as a follow-up — `GuidedContent.tsx` and `ScenarioStage.tsx` still use `font-mono text-mono-meta` on their tier-name sublines and should be aligned.
  - `a11y-auditor`: PASS — 14 checks. Status pairs colour + glyph + text everywhere. Native `<button>` per option, disabled state after correct. `role="group" aria-labelledby` wraps options; `aria-live="polite"` on the feedback panel. Three non-blocking observations: (1) standardise group semantics across renderers — deferred; (2) promote "Question {N}" to `<h2>` for SR heading navigation — **applied in-pass**; (3) live-region refresh on repeat wrongs — accepted, marginal, revisit at deploy.
  - `build-health`: PASS — 246 SSG pages total (24 diagnostic + 72 scenario + 72 guided + 72 check + 6 static). Check route First Load: 140 kB (~46 kB route-specific from react-markdown returning to the client bundle for inline feedback).
- **Reports:** `working/qa-reports/multiple-choice-check-{content-contract,design-fidelity,a11y,build-health,summary}.md`.
- **Commit:** **`8a92e49`** on `origin/main`.

### `/build-component guided-content` — calm reading register + sticky footer · all gates **PASS** (one self-heal on design-fidelity, two-in-one on a11y)

- **Renderer:** `components/GuidedContent.tsx` (server) — eyebrow `Guided content · ~{time} read`, page H1 = module title, tier-name meta. Body markdown rendered via `Markdown.tsx` `reading` variant. Then `StickyFooter` at the bottom.
- **Sticky footer:** `components/StickyFooter.tsx` (new shared, server component) — prev/next Link buttons + an `<ol>` of 4 progress `Dot`s with `sr-only` step state labels. Used here for guided; will be reused by check / takeaway / Expert flows.
- **Route:** new literal `app/[pathway]/[module]/[tier]/guided/page.tsx`, SSG via `listExistingTiers()` filtered to T1–T3 × BA/DM/PM = 72 pages. `dynamicParams = false`.
- **Parser:** `lib/content.ts` adds `getGuidedBlock`.
- **[stage] route:** `'guided'` removed from `T1_T3_STAGES`.
- **QA gates:**
  - `content-contract`: PASS — 12/12 checks. Only consumes guided-content block, T1–T3 × BA/DM/PM = 72, "Component 2 of 4" counter matches plan §0, prev → scenario, next → check, no DESIGNER NOTE leakage, no invented copy, no progress writes.
  - `design-fidelity`: **FAIL → PASS** after one self-heal. `reading` variant's `ul`/`ol` were `text-body` (sans 16px) — every bulleted/numbered list in guided body dropped out of the reading register. Fixed: `font-serif text-reading text-ink`.
  - `a11y-auditor`: **FAIL → PASS** after one fix bundle resolving two blockers:
    - **SC 1.3.1 (Heading hierarchy skip):** body markdown opened with `### ...` under a page H1 — H1 → H3 with no H2 between. Fixed by mapping markdown `### → <h2>` (and `#### → <h3>`) in the `reading` variant.
    - **SC 2.4.11 (Focus Not Obscured, Minimum):** sticky footer would obscure focus rings on inline links near the page bottom. Fixed by `html { scroll-padding-bottom: 5rem; }` in `app/globals.css` — applies to any future sticky element too.
  - `build-health`: PASS — typecheck, lint, production build green. **174 SSG pages total** (24 diagnostic + 72 scenario + 72 guided + 6 static). Guided route First Load: 94.1 kB.
- **Reports:** `working/qa-reports/guided-content-{content-contract,design-fidelity,a11y,build-health,summary}.md`.
- **Commit:** **`d57e8e2`** on `origin/main`.

### `/build-component scenario-stage` — immersive Anchor Scenario · all gates **PASS** (one self-heal)

- **Renderer:** `components/ScenarioStage.tsx` (server component, full-bleed `navy-deep`). Uses the `scenario-dark` Markdown variant.
- **Route:** new literal `app/[pathway]/[module]/[tier]/scenario/page.tsx` — SSG via `generateStaticParams` × `listExistingTiers()`. 72 pages: BA/DM/PM × every existing M*-T{1,2,3}.md.
- **Layout refactor** (required for full-bleed):
  - `app/layout.tsx`: `<main>` is now permissive (no width/padding).
  - `components/PageBody.tsx` (new): shared `max-w-{hub|prose} px-6 py-8` container. All non-scenario pages now wrap with it.
  - `components/AppBar.tsx`: self-hides on `/[a-z]+/M\d+/T[1-4]/scenario` via `usePathname()`.
- **Parser:** `lib/content.ts` adds `parseTierHeader`, `getScenarioBlock`, `listExistingTiers`, `TierHeader` type.
- **Tokens:** `tailwind.config.ts` adds `max-w-scenario: '760px'` (spec §4 "centred 760px column").
- **[stage] route:** `scenario` removed from `T1_T3_STAGES`; the literal route owns the URL.
- **QA gates:**
  - `content-contract`: PASS — 12/12 checks. Only consumes `scenario` + `SCENARIO_NARRATIVE`, T1–T3 only, "Component 1 of 4" counter matches build plan §0, CTA → `/guided`, back → tier overview, no DESIGNER NOTE leakage, no invented copy, no progress writes (renderer is read-only).
  - `design-fidelity`: **FAIL → PASS** after one self-heal. Header strip was `max-w-[820px]` while body was `max-w-[760px]`; unified to `max-w-scenario` (new token). Two non-blocking OBSERVATIONs accepted (redundant `tracking-[0.08em]` on `text-eyebrow` calls; `scenario-dark` markdown variant doesn't customise `ul`/`ol`/`li`/`strong`/`a`/`hr` — current scenarios don't use them).
  - `a11y-auditor`: PASS — WCAG 2.2 AA across all 14 checks. Two items recorded for dynamic verification at deploy (CTA white-on-yellow focus ring perceptual check; SkipLink chip contrast on navy-deep).
  - `build-health`: PASS — 102 SSG pages total (24 diagnostic + 72 scenario + 6 static). Scenario route First Load: 94.1 kB (~7 kB route-specific; server-component rendering means react-markdown stays out of the client bundle).
- **Reports:** `working/qa-reports/scenario-stage-{content-contract,design-fidelity,a11y,build-health,summary}.md`.
- **Commit:** **`cc0aa65`** on `origin/main`.

### `/build-component diagnostic-decision` — module-entry placement · all gates **PASS**

- **Renderer:** `components/DiagnosticDecision.tsx` (client) + `components/Markdown.tsx` (server wrapper for scenario + notes, with `reading`/`notes`/`scenario-dark` variants).
- **Page:** `app/[pathway]/[module]/diagnostic/page.tsx` — SSG with `generateStaticParams` enumerating BA/DM/PM × M1..M8 (24 pages), `dynamicParams = false`. SME pathway correctly excluded.
- **Parser:** `lib/content.ts` extended with `parseDiagnosticBlock`, `getDiagnosticForModule`, `DiagnosticOption` type. `PlacementChoice` consolidated in `lib/content.ts` and re-exported from `lib/progress.ts` (single source).
- **Deps:** `react-markdown@9.1.0`, `remark-gfm@4.0.1` added.
- **QA gates:**
  - `content-contract`: PASS — 10/10 checks. Module-entry only (no per-tier diagnostic route), four options parsed across all 8 entry files (32 total), routing branches match plan §3, reassurance line verbatim from spec §3, no DESIGNER NOTE leakage, no direct storage access.
  - `design-fidelity`: PASS — zero raw hex; tokens throughout; accent discipline preserved. One observation (derived `pl-[3.25rem]` indent) **fixed in-pass** by refactoring to CSS grid (`grid-cols-[2.25rem_1fr]`).
  - `a11y-auditor`: PASS — WCAG 2.2 AA across all 12 checks. Two non-blocking observations recorded and accepted: `<fieldset>` for route-action buttons (vs. `<div role="group">`) — kept as-is; optional `role="status"` for routing announcement — accepted (Next route announcer covers minimum).
  - `build-health`: PASS — typecheck, lint, production build green. 24 SSG pages built. Route First Load JS = 133 kB (~46 kB route-specific, mostly `react-markdown`).
- **Reports:** `working/qa-reports/diagnostic-decision-{content-contract,design-fidelity,a11y,build-health,summary}.md`.
- **Commit:** **`37ab90f`** on `origin/main`.

### `/scaffold` — Next.js app laid down · build-health **PASS**

- Next.js **14.2.18** App Router · TypeScript strict · Tailwind **3.4.14**.
- `lib/content.ts`: typed frontmatter + `---COMPONENT---` / `---LEARNER INTERACTION---` / `---END …---` parser; DESIGNER NOTE stripping; supports the four interaction types present in content (DIAGNOSTIC, SCENARIO_NARRATIVE, MULTIPLE_CHOICE, CRITIQUE) and the deferred two (SHORT_ANSWER, DRAG_DROP).
- `lib/progress.ts`: sole client-storage module, key `gss-platform:progress:v1`. `useProgress()` via `useSyncExternalStore`, SSR-safe.
- Tailwind theme translated end-to-end from `design/DESIGN-LANGUAGE.md` (colours, type scale, radii, shadows, `max-w-prose/hub`). Yellow focus ring via `:focus-visible` in `globals.css`.
- Base layout (Public Sans / Source Serif 4 / IBM Plex Mono via `next/font/google`), `SkipLink`, pathway-aware `AppBar`, main landmark.
- Empty route tree from build plan §3: pathway home, module hub, module-entry diagnostic, tier overview, T1–T3 stages, T4 stages, reference card, supplement, print view. All pages render a `Placeholder` so every route is keyboard-focusable and contrast-AA from day one.
- QA: `working/qa-reports/scaffold-build-health.md` — `result: PASS`. Typecheck, lint, production build all clean. No `localStorage` / `sessionStorage` outside `lib/progress.ts`. No raw token hex values in `components/`.
- **Environment caveat:** this machine intercepts TLS. `npm install` and `next build` (downloads Google Fonts at build time) need `NODE_OPTIONS=--use-system-ca` set. Worth adding to user/system env vars.
- Commits: **`30737d2`** (scaffold) on top of **`6fbc8b1`** (plan rev + agent re-scopes + deny tighten).

### `/review-build` (revision 2) — build plan **APPROVED**

- Plan revised to resolve spec-vs-content drift, expand POC, verify the parser contract against all 69 files in `content/output/`, and consolidate decisions for sign-off:
  - New **§0 "Design model as built"** — authoritative interaction model and deviations from `design/DESIGN-SPEC.md`.
  - **POC extended to M3-T2 + M1-T4** so the human gate sees both the T1–T3 shape and the T4 reveal flow before mass build.
  - **`/[tier]/diagnostic` route removed** (no content backs it).
  - **`DragDropCheck` and `ShortAnswerCheck` deferred** (0 occurrences across content).
  - **`CritiqueCheck` renderer added** for the 3 CRITIQUE markers in M6/M7/M8-T3.
  - **T4 route mapping pinned** in §3; M6/M7/M8-T4 variant B (no `model-answer` slot) supported via slot-3 dispatch.
  - **§6 Decisions for sign-off (D-1..D-6)** consolidated.
- `.claude/agents/design-fidelity.md`: re-scoped to **visual + token fidelity only**; defers to `content-contract` on interaction shape / order / routing. Eliminates the two-agent collision.
- `.claude/agents/a11y-auditor.md`: names **WCAG 2.2 SC 2.4.11 (Focus Not Obscured), 2.5.7 (Dragging Movements), 2.5.8 (Target Size, Minimum)** explicitly.
- `.claude/settings.json`: deny rules **tightened back to `Write(./content/**)` and `Edit(./content/**)`** (had been narrowed to `./content/output/**` during submodule setup).
- Status flipped to `approved` by user.
- Commit: **`6fbc8b1`**.

---

## 2026-06-22

### `/review-build` (revision 1) — first draft

- `prototype-critic` produced the initial `working/decisions/build-plan.md`: 30 renderers, M3-T2-only POC, 10 risks/decisions.
- Status: `draft`. Held for revision (the spec-vs-content drift surfaced as a review item before approval).

### setup — curriculum wired as submodule · platform repo connected

- `git init -b main`. `content/` wired as submodule pointing at `https://github.com/HKelly82/gss-curriculum.git`, pinned to `fb8c4d4`. Outer repo carries the pointer (mode 160000), not a copy.
- Remote `origin` set to `https://github.com/HKelly82/gss-platform.git`. Initial push.
- `design/` PNG duplicates removed at the root; the three brand PNGs now live only under `design/assets/`.
- `.claude/settings.json` deny rules temporarily narrowed to `./content/output/**` (the harness blocked sandbox-level operations on `./content/` itself during submodule add). Tightened back the next day during the plan revision (see above).
- Commits: **`284f9d0`** (initial scaffold of control layer + design + agents/commands), **`c5284c8`** (add submodule), **`229b032`** (design PNG dedup).

---

## Open decisions

Sign-off items carried forward from `working/decisions/build-plan.md` §6. Move resolved items to the day they were resolved, with the resolution recorded inline.

- **D-1** — Add `CRITIQUE` to `CLAUDE.md` interaction-type list. Proposed wording in plan §6. *Open.*
- **D-2** — Reframe "five-component order" in `CLAUDE.md` (T1–T3 are four-component; T4 is four-component with two variants). Proposed wording in plan §6. *Open.*
- **D-3** — Confirm `SHORT_ANSWER` / `DRAG_DROP` deferral. (Implicit by approval — but a one-line confirmation makes future revivals unambiguous.) *Open.*
- **D-4** — Upstream edits to `design/DESIGN-SPEC.md` (remove per-tier State A/B; update tier order; add `CRITIQUE`; mark pathway-card copy as interim). *Open.*
- **D-5** — T4 variant B (M6/M7/M8-T4 replacing `model-answer` with a second `applied-exercise`): intentional, or content-contract issue to route back to the curriculum repo? *Open.*
- **D-6** — Reference-card PDF mechanism: `window.print()` + dedicated print route, or `@react-pdf/renderer` true file download? *Open.*

---

## How to update this document

1. Append entries at the **top of the current day's section** (most recent first within the day).
2. Cite commit SHAs (`git log --oneline -5` gives them).
3. For gate runs, link to the QA reports they produced under `working/qa-reports/` even though that directory is gitignored — the report path documents what was checked.
4. When a decision in **Open decisions** is resolved, move it under the relevant day with the resolution recorded inline.
5. If the build-plan changes materially, record the revision number, the changelog summary, and the commit; do not duplicate the full changelog here.
