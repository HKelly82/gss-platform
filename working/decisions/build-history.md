# Build history

A running log of major work on the GSS Platform. Append entries as work progresses; keep the newest day at the top.

## Conventions

- One entry per gate run (`/review-build`, `/scaffold`, `/build-component`, `/build-route`, `/deploy`) or per material decision.
- Each entry carries: short title, what changed, why, commit SHA(s), and links to any QA reports produced.
- Dates: `YYYY-MM-DD`, newest first.
- Living document — update on every significant commit. If the trajectory shifts (a renderer is renamed, a route reshaped, a decision flipped), record it here so future-you doesn't have to re-derive it from `git log`.

---

## 2026-06-23

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
