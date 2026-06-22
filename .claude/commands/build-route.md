---
description: Wire a route or flow end to end, then run its QA. Usage: /build-route tier  or  /build-route pathway-PM
argument-hint: <route>  e.g. tier, module-overview, pathway-PM, sme-exercise
---

Target: $1

1. Confirm the component renderers this route needs already exist. If any are missing, STOP and list
   which `/build-component` calls to run first.
2. Read the build-plan route entry and the relevant `content/` files.
3. Wire the route to render real content, with navigation, progress updates via `lib/progress.ts`,
   and the diagnostic skip/proceed branching where the route includes a diagnostic.
4. QA chain, separate subagents: `content-contract`, `content-integrity`, `a11y-auditor`. Collect
   into `working/qa-reports/$1-route-summary.md`.
5. Self-heal up to 3 passes; flag anything unresolved.
6. Run `build-health`. Report.

If $1 is the proof-of-concept tier route (the first complete tier flow — diagnostic with both
paths, scenario, guided content, understanding check with feedback, takeaway), STOP after the
report and tell me it is ready for full review. Do not build further routes — this is the PoC gate.
