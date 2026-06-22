---
description: Run the full QA chain across the whole app. Usage: /qa
argument-hint: (no arguments)
---

1. Run, each as a separate subagent with fresh context:
   - `content-contract` across all components and routes
   - `design-fidelity` across all components and routes
   - `a11y-auditor` across all routes
   - `content-integrity` across `content/` and the loader/routes
   - `build-health` on the whole app
2. Write a consolidated `working/qa-reports/full-qa.md`.
3. For each FAIL, apply the minimal fix and re-run only the failing check, up to 3 passes. List
   anything still failing.
4. Report a one-screen summary with the outstanding list.
