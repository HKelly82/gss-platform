# Handoff: Herd Learn — Service Standard e-learning

## Overview
Herd Learn is an internal, self-paced e-learning platform that teaches Herd Consulting
consultants the UK Government Service Standard. The audience is senior practitioners
(Business Analysts, Delivery Managers, Product Managers, Subject Matter Experts) who are
experienced but often new to government digital. The design is deliberately calm,
content-forward and respectful — no gamification (no badges, points, streaks, mascots).

This bundle contains the design language and the full set of screen archetypes, plus a
clickable prototype wiring the key flows.

## About the design files
The files in this bundle are **design references created in HTML** — prototypes showing
the intended look and behaviour, **not production code to copy verbatim**. They are
authored as "Design Components" (`.dc.html`) that use inline styles driven by CSS custom
properties, with a small runtime (`support.js`) that turns a template + a logic class into
a live React-like component.

Your task is to **recreate these designs in the target codebase** — the brief is a
**Next.js (App Router) + Tailwind CSS** build. Use the codebase's established patterns and
component libraries. Treat the `.dc.html` runtime as scaffolding for the prototype only;
do not port `support.js`.

- `DESIGN-LANGUAGE.md` — the design system: colour, type, spacing, focus, and a ready-to-paste
  `tailwind.config` theme + CSS variables.
- `DESIGN-SPEC.md` — every screen archetype and its states, with layout, copy and behaviour.
- `Herd Learn.dc.html` — visual reference for the design language (open in a browser).
- `Herd Learn Prototype.dc.html` — clickable prototype of all flows (open in a browser).

## Fidelity
**High-fidelity.** Colours, typography, spacing and interactions are final. Recreate the UI
to match, using the codebase's libraries. Exact token values are in `DESIGN-LANGUAGE.md`.

## Tech-stack guidance (Next.js + Tailwind)
- Map the CSS variables in `DESIGN-LANGUAGE.md` into `tailwind.config.{js,ts}` `theme.extend.colors`
  (provided verbatim) and reference them as utilities (`bg-navy`, `text-ink-2`, `ring-yellow`).
- Load fonts via `next/font/google`: **Public Sans** (UI), **Source Serif 4** (reading),
  **IBM Plex Mono** (reference metadata). Expose as CSS variables `--font-sans` / `--font-serif`
  / `--font-mono` and wire into Tailwind `fontFamily`.
- Each screen archetype → a route segment or a presentational component. The prototype's
  `state.screen` enum maps naturally to App Router routes (see `DESIGN-SPEC.md` § Routes).
- Answer options, the diagnostic decision, and reveals should be real form controls
  (`radiogroup`, buttons, `details`/disclosure) — see the accessibility notes; this product
  teaches the Service Standard so it must exemplify WCAG 2.2 AA.

## Assets
- `assets/elephant-navy.png`, `elephant-white.png`, `elephant-yellow.png` — Herd elephant
  logo marks (navy on light, white on navy chrome, yellow spare). Brand colours derived from
  these: Navy `#36384B`, Yellow `#F6CE4C`, Grey `#E9EAE4`. Use the org's canonical logo files
  in the real repo if available.

## Files in this bundle
- `DESIGN-LANGUAGE.md` — tokens + Tailwind theme + component inventory
- `DESIGN-SPEC.md` — screen archetypes & states
- `Herd Learn.dc.html` — design-language visual reference
- `Herd Learn Prototype.dc.html` — clickable prototype
- `support.js` — prototype runtime (reference only; do not port)
- `assets/` — logo marks

## How to view the prototypes
Open either `.dc.html` in a modern browser. In the prototype, use the **"Prototype map"**
dropdown in the top chrome to jump to any screen. That dropdown is a review aid — **omit it
from production.**
