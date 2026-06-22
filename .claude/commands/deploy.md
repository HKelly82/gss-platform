---
description: Run QA, gate on build-health and accessibility, then deploy to Vercel. Usage: /deploy preview  or  /deploy prod
argument-hint: <preview|prod>  (default preview)
---

Target: ${1:-preview}

1. Run `build-health` and `a11y-auditor` across the app. If either fails, STOP and report — do not
   deploy. These are hard gates.
2. Run `content-contract` and `content-integrity`. Report any FAILs; if they are non-blocking, ask
   me whether to proceed.
3. Deploy with the Vercel CLI: `vercel` for a preview, `vercel --prod` for production. (If the repo
   is connected to Vercel via Git, a push already produces a preview — use the CLI for on-demand.)
4. Report the deployment URL and the QA summary.
