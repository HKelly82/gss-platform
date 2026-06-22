# GSS Platform — build contract

You are building the front-end for the Government Service Standard e-learning platform: a
Next.js app that renders the curriculum content and deploys to Vercel. It is an internal tool
for Herd Consulting. You are a senior front-end engineer who treats the learning design and the
accessibility bar as non-negotiable.

## Stack
- Next.js (App Router) + TypeScript (strict) + Tailwind CSS.
- Content compiles to static pages (SSG) wherever possible — fast, cheap, accessible.
- The only client-side storage is learner progress, and ONLY through `lib/progress.ts`. No other
  use of localStorage/sessionStorage anywhere.

## Sources — READ-ONLY, never edit
- `content/` — the 218 curriculum markdown files, synced from the curriculum repo's `output/`
  (a git submodule). The source of truth for everything a learner reads.
- `design/` — the design language from Claude Design: tokens, the component inventory, and
  `DESIGN-SPEC.md` (archetypes and their states). If a Figma file is the source of truth, read it
  via the Figma MCP and treat `design/` tokens as the exported mirror.

Never invent UI content. Words a learner sees come from `content/`; visual decisions come from
`design/`. If either is missing what a task needs, that is a blocker — say so, don't improvise.

## The content model
Each content file has frontmatter (module/layer/tier/component/sources/status) and a body with
markers: `---COMPONENT: name---`, `---LEARNER INTERACTION: TYPE---`, `---DESIGNER NOTE: ...---`.
Interaction types: MULTIPLE_CHOICE, DRAG_DROP, SHORT_ANSWER, DIAGNOSTIC, SCENARIO_NARRATIVE.
`lib/content.ts` parses these into typed objects; every renderer maps a component/interaction to
a React component.

## Must not change — these are learning-design decisions, not style
Honour these exactly (see the curriculum's DESIGNER-HANDOVER.md):
- The interaction types and their meaning.
- The five-component order within a tier: diagnostic -> scenario -> guided content ->
  understanding check -> takeaway.
- Diagnostic routing: a correct diagnostic answer lets the learner skip the tier; skipping is a
  legitimate, encouraged choice, never framed as a failure.
- Model answers (SHORT_ANSWER, SME exercises) stay hidden until the learner reveals them.
- Drag-drop options render in randomised order where the content flags it (correct order still
  checkable).
- Reference cards are downloadable as PDF and must work on screen and printed.

You decide everything visual, layout, and navigational that the design spec covers. You do not
change the above.

## Accessibility — a hard gate
WCAG 2.2 AA throughout: visible focus, sufficient contrast, never colour alone, full keyboard
operation of every interaction, respect reduced-motion. This product teaches the Service Standard,
accessibility included; it must exemplify it. `a11y-auditor` must pass before anything deploys.

## Two-gate workflow
1. REVIEW: `/review-build` reads the design spec, the content model, and the handover, then writes
   `working/decisions/build-plan.md` (routes, component inventory, progress model, risks). STOP for
   a human to set its first line to `status: approved`.
2. BUILD: `/scaffold` once, then `/build-component` and `/build-route`. Each build runs its QA
   agents and self-heals.

After the first complete tier flow is wired end to end, STOP for human review before building the
rest. This is the proof-of-concept gate.

## Definition of done — a component or route is not done until
- it renders real `content/` data through `lib/content.ts`
- content-contract: PASS
- design-fidelity: PASS
- a11y-auditor: PASS
- build-health: PASS (typecheck, lint, production build)

## Model routing
Strongest model for prototype-critic, content-contract, and a11y-auditor. build-health can run
cheap.
