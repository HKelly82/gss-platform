---
description: One-time. Stand up the Next.js app, the content loader, the progress module, design tokens, and base layout/navigation. Run after the build plan is approved.
argument-hint: (no arguments)
---

1. Confirm `working/decisions/build-plan.md` exists with `status: approved`. If not, STOP and tell
   me to run `/review-build` and approve it.
2. Create a Next.js (App Router) + TypeScript (strict) + Tailwind app at the repo root.
3. Build `lib/content.ts`: parse `content/` frontmatter and the `---COMPONENT---` /
   `---LEARNER INTERACTION---` markers into typed objects per the content model in CLAUDE.md.
4. Build `lib/progress.ts`: the ONLY client-storage module, tracking completed tiers/components per
   pathway and diagnostic skip decisions, per the approved progress model. No other localStorage use
   anywhere.
5. Translate `design/` tokens into the Tailwind theme (colours, type scale, spacing). Do not
   hard-code values that renderers should take from tokens.
6. Build the base layout and pathway-aware navigation chrome, plus an empty route tree matching the
   build plan, with placeholder pages.
7. Run `build-health`. Fix anything failing. Report what was created and the dev-server command. Do
   not build component renderers yet — that is `/build-component`.
