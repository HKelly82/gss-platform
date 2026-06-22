# Herd Learn — Design Language

The single source of truth for tokens and components. Built to drop into a **Next.js + Tailwind**
repo. The prototype uses these exact values as CSS custom properties on its root element.

---

## 1. Colour

### Brand & neutrals

| Token | Hex | Role |
|---|---|---|
| `navy` | `#36384B` | Ink, primary action, headings |
| `navy-deep` | `#2B2D3D` | Primary hover; immersive scenario background |
| `navy-soft` | `#4C4F66` | Subtle navy variant |
| `ink` | `#2C2E3A` | Body text |
| `ink-2` | `#585B6C` | Secondary text (AA on white) |
| `ink-3` | `#83869A` | Meta / disabled — large or non-essential text only |
| `yellow` | `#F6CE4C` | THE accent: current state, focus ring, confident skip |
| `yellow-deep` | `#9A7212` | Yellow as text/eyebrow on light surfaces (AA) |
| `grey` | `#E9EAE4` | Quiet fills, empty progress track, reference-card bg |
| `paper` | `#F6F6F2` | App background |
| `white` | `#FFFFFF` | Cards, reading surface |
| `line` | `#E3E3DC` | Hairline borders |
| `line-2` | `#CFCFC7` | Stronger borders; resting answer-option outline |

> **Accent discipline.** Yellow is reserved for three things only: the learner's **current**
> place, the **focus ring**, and the one **confident "skip ahead"** action. It must never
> become a general-purpose highlight.

### Semantic / status — never colour alone

Every status pairs a **colour + a shape + a word**. Required for WCAG 2.2 AA (1.4.1 Use of Colour).

| Meaning | Text | Background | Shape glyph |
|---|---|---|---|
| Ready / Correct | `ready` `#2F7A52` | `ready-bg` `#E8F1EB` | `●` or `✓` |
| Developing / In progress | `develop` `#9A6B12` | `develop-bg` `#F6EEDB` | `◐` |
| Needs attention / Incorrect | `attention` `#B0322F` | `attention-bg` `#F6E6E4` | `▲` or `✕` |

All three text colours pass AA (≥4.5:1) on white and on their own tint.

### Tailwind theme (paste into `tailwind.config`)

```js
// tailwind.config.js → theme.extend
colors: {
  navy:   { DEFAULT: '#36384B', deep: '#2B2D3D', soft: '#4C4F66' },
  ink:    { DEFAULT: '#2C2E3A', 2: '#585B6C', 3: '#83869A' },
  yellow: { DEFAULT: '#F6CE4C', deep: '#9A7212' },
  grey:   '#E9EAE4',
  paper:  '#F6F6F2',
  line:   { DEFAULT: '#E3E3DC', 2: '#CFCFC7' },
  ready:    { DEFAULT: '#2F7A52', bg: '#E8F1EB' },
  develop:  { DEFAULT: '#9A6B12', bg: '#F6EEDB' },
  attention:{ DEFAULT: '#B0322F', bg: '#F6E6E4' },
},
```

### CSS variables (equivalent, for non-Tailwind use)

```css
:root {
  --navy:#36384B; --navy-deep:#2B2D3D; --navy-soft:#4C4F66;
  --ink:#2C2E3A; --ink-2:#585B6C; --ink-3:#83869A;
  --yellow:#F6CE4C; --yellow-deep:#9A7212;
  --grey:#E9EAE4; --paper:#F6F6F2; --line:#E3E3DC; --line-2:#CFCFC7;
  --ready:#2F7A52; --ready-bg:#E8F1EB;
  --develop:#9A6B12; --develop-bg:#F6EEDB;
  --attention:#B0322F; --attention-bg:#F6E6E4;
}
```

---

## 2. Typography

| Family | Usage | Tailwind | next/font |
|---|---|---|---|
| **Public Sans** | UI, headings, labels, buttons | `font-sans` | `Public_Sans` w/ 400–800 |
| **Source Serif 4** | Guided-content prose & scenario narrative — the "sustained reading" register | `font-serif` | `Source_Serif_4` w/ 400–700 |
| **IBM Plex Mono** | Reference-card metadata, keys/codes | `font-mono` | `IBM_Plex_Mono` w/ 400–500 |

### Scale

| Role | Size / line-height | Weight | Family | Notes |
|---|---|---|---|---|
| Display | 38–40 / 1.08–1.12 | 800 | sans | Scenario & guided titles; `tracking-[-0.02em]` |
| H1 | 30–32 / 1.1 | 800 | sans | Screen titles |
| H2 | 24–25 / 1.2 | 700 | sans | Section heads in prose |
| H3 | 19 | 600 | sans | Tier names |
| Body | 16 / 1.6 | 400 | sans | UI copy |
| Reading body | 19 / 1.68 | 400 | **serif** | Guided content paragraphs |
| Lede | 21 / 1.5 | 400 | **serif** | Standfirst under reading H1 |
| Label / eyebrow | 13 / — | 600 | sans | `uppercase`, `tracking-[0.08em]` |
| Mono meta | 11 | 400–500 | mono | Reference card |

Reading column measure: **62–68 ch** (≈ 720px). Max content width for hub/main areas ≈ 1000–1180px.

---

## 3. Spacing, radius, elevation

- **Spacing base 4px.** Scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64` (Tailwind `1 2 3 4 6 8 12 16`).
- **Radius:** controls `4px` · buttons/cards `6–8px` · large cards `10–12px` · status `full`.
- **Borders:** hairline `1px var(--line)`; emphasis `1.5px var(--navy)`; current-card left rail `inset 3px 0 0 var(--yellow)`.
- **Shadow (cards):** `0 1px 3px rgba(40,40,30,.09)`; raised/current `0 4px 16px rgba(54,56,75,.08)`; hover lift `0 6–8px 20–24px rgba(54,56,75,.08–.14)`.

---

## 4. Focus & motion (accessibility)

- **Focus ring** on EVERY interactive element: `box-shadow: 0 0 0 3px var(--yellow)` (Tailwind `focus:ring-[3px] focus:ring-yellow focus:outline-none`). On yellow surfaces invert to a navy ring (`#fff` on the immersive scenario).
- **Reduced motion:** wrap transitions/animations in `@media (prefers-reduced-motion: reduce){ *{transition:none!important;animation:none!important} }` or Tailwind `motion-reduce:` variants.
- Contrast: body ≥ 7:1, secondary ≥ 4.5:1, all status text ≥ 4.5:1.

---

## 5. Component inventory

Suggested React component names + props. States described fully in `DESIGN-SPEC.md`.

| Component | Key props | Notes |
|---|---|---|
| `Button` | `variant`: `primary` \| `secondary` \| `tertiary` \| `skip` | primary = navy fill; secondary = navy outline; tertiary = text + yellow underline; **skip** = yellow fill / navy text, reserved for the diagnostic. |
| `AppBar` | `tone`: `navy` \| `light` | Navy on hub; light/bordered on content screens. Logo returns home. |
| `PathwayCard` | `role`, `moduleCount`, `selected?` | Pathway selection grid. |
| `ModuleNavItem` | `index`, `status`: `complete` \| `current` \| `upcoming` | Sidebar list. Current gets yellow left rail + "Now". |
| `TierCard` | `tier`, `status`: `complete` \| `current` \| `not-started`, `expanded?` | Current expands to the 5 `ComponentRow`s. |
| `ComponentRow` | `kind`: `diagnostic` \| `scenario` \| `guided` \| `check` \| `takeaway`; `status` | Fixed order 1–5. Icon + word for status. |
| `ProgressSegments` | `total`, `done`, `current` | navy = done, yellow = current, grey = remaining. Always paired with "n of N" text. |
| `ProgressDots` | same | Footer-nav variant. |
| `AnswerOption` | `state`: `default` \| `selected` \| `correct` \| `incorrect`; `feedback?` | Radio semantics. Badge: letter → ✓/✕. Incorrect reveals inline redirect text. |
| `ContentBlock` | `mode`: `guided` \| `scenario` \| `check` \| `note` \| `principle` | Register per content mode (see spec). |
| `KeyPrinciple` | — | White card, `border-left:4px var(--yellow)`, yellow-deep eyebrow. |
| `ScenarioStage` | `meta[]` (service/phase/etc.) | Full navy-deep screen, serif narrative, yellow eyebrow + CTA. |
| `DiagnosticDecision` | `onSkip`, `onProceed` | Two large choices + reassurance note. Skip uses `Button variant=skip`. |
| `RevealAnswer` | `revealed`, `onReveal` | Model answer hidden until opt-in (SME exercises + SHORT_ANSWER checks). |
| `ReferenceCard` | print-optimised | `.print-hide` chrome hidden in `@media print`; download = `window.print()` (production: generate a dedicated 1-page PDF). |
| `TakeawayList` | numbered items | "Take this to work" actions. |

### Prototype-only (do not ship)
- `JumpNav` — the "Prototype map" `<select>` for reviewers.
