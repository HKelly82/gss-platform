---
description: Build one component or interaction renderer, then run its QA. Usage: /build-component multiple-choice
argument-hint: <component-or-interaction>  e.g. multiple-choice, drag-drop, short-answer-reveal, diagnostic-router, scenario-narrative, guided-content, understanding-check, takeaway, reference-card
---

Target: $1

1. Confirm the scaffold exists (`lib/content.ts`, `lib/progress.ts`, tokens in the Tailwind theme).
   If not, STOP and tell me to run `/scaffold`.
2. Read the build-plan entry for $1, the design spec for its archetype and states, and a real
   `content/` example that exercises it.
3. Build the renderer to consume real `content/` data via `lib/content.ts`, using design tokens,
   with every state the spec lists (default, selected, correct/incorrect, revealed, focus, disabled
   as applicable). Honour the must-not-change rules for this type.
4. QA chain, each a separate subagent with fresh context: `content-contract`, `design-fidelity`,
   `a11y-auditor`. Collect into `working/qa-reports/$1-summary.md`.
5. Self-heal: fix FAILs, re-run only the failing check, up to 3 passes. Leave anything unresolved
   flagged and list it.
6. Run `build-health`. Report a one-screen summary.
