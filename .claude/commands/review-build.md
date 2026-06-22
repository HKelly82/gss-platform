---
description: REVIEW gate. Reads the design spec, content model, and handover, then writes a build plan and stops for sign-off.
argument-hint: (no arguments)
---

1. Read `design/` (tokens, component inventory, `DESIGN-SPEC.md`) and, if a Figma file is the
   source of truth, read it via the Figma MCP (`get_design_context`, `get_variable_defs`). Read a
   representative sample of `content/` files and the curriculum `DESIGNER-HANDOVER.md`.
2. Use the `prototype-critic` subagent to produce the build plan.
3. Write it to `working/decisions/build-plan.md` with the first line `status: draft`: blockers,
   the component inventory with states, the route tree with the diagnostic skip/proceed branching,
   the progress model, and risks/decisions with your recommendations. Name the one proof-of-concept
   tier route to build and gate on first.
4. STOP. Tell me to review it, resolve blockers, and set the first line to `status: approved`
   before scaffolding. Write no app code.
