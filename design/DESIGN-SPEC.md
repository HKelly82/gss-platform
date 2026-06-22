# Herd Learn — Design Spec (archetypes & states)

Companion to `DESIGN-LANGUAGE.md`. Describes every screen archetype, its layout, copy and
interactive states. Token names (e.g. `navy`, `yellow`, `ink-2`) refer to that file.

## The fixed learning model (design around it; do not redesign)
- **4 role pathways:** Business Analyst, Delivery Manager, Product Manager, Subject Matter Expert.
- **8 core modules**, each with **4 depth tiers**: Intro → Foundations → Advanced → Expert
  (progressive, but the signal stays quiet).
- **Each tier = 5 components in FIXED order:** (1) orientation diagnostic, (2) anchor scenario,
  (3) guided content, (4) understanding check, (5) "take this to work" takeaway.
- **Optional Layer 0** orientation primer (warm narrative first week).
- **3 SME meta-modules**, simpler shape: conceptual framing → applied exercise → model answer.

## Routes (prototype `state.screen` → suggested App Router paths)
```
pathways    → /                                  (or /pathways)
overview    → /[pathway]/[module]                 module hub
diagnostic  → /[pathway]/[module]/[tier]/diagnostic
scenario    → /[pathway]/[module]/[tier]/scenario
guided      → /[pathway]/[module]/[tier]/guided
check       → /[pathway]/[module]/[tier]/check
takeaway    → /[pathway]/[module]/[tier]/takeaway
reference   → /[pathway]/[module]/reference
sme         → /sme/[module]   (framing | exercise | answer)
```

---

## 1. Pathway selection
**Purpose:** learner picks the role pathway that routes their sequence.
**Layout:** centred column, max ~1000px on `paper`. Brand lockup row at top (logo + wordmark +
"UK Government Service Standard"). Eyebrow "Welcome" → H1 "Choose your pathway" → lede.
2×2 grid of `PathwayCard`s, then a full-width Layer 0 primer banner (white, yellow left rail).
**PathwayCard:** white, `1.5px line` border, radius 12, padding 24. Eyebrow / role name (21·700 navy) /
description / footer row ("8 modules · 4 tiers" + "Choose →"). DM card shown pre-selected with a
navy border + shadow as the example.
- **Hover:** border → navy, lift shadow.
- **Focus:** yellow ring.
- **SME card:** says "3 meta-modules" and routes to the SME exercise, not the full hub.
**Primer banner:** "New to government digital?" + "Start primer" secondary button.

## 2. Module overview (hub)
**Purpose:** orient within the chosen pathway; enter any tier component.
**Layout:** navy `AppBar` (logo home, "{Pathway} pathway", Prototype-map). Two columns:
- **Sidebar (312px, white):** "Your pathway" + role, a 34% pathway progress bar, then the 8
  `ModuleNavItem`s. Completed = navy ✓ disc; current (module 03) = paper pill, navy left rail,
  "Now" in yellow-deep; upcoming = outlined number disc.
- **Main (paper):** "Module 03 · {Pathway} pathway" eyebrow → H1 "Agile delivery in government"
  → description. Tier progress row ("Foundations tier · 2 of 5 components"). Then four `TierCard`s.
**TierCard states:**
- **complete** (Intro): navy ✓, "Complete" in `ready`, all 5 segments navy, "Review" button.
- **current** (Foundations): `1.5px navy` border + raised shadow, expands to show the 5
  `ComponentRow`s. Header has yellow-dot ring icon + "In progress" (yellow-deep) + "2 / 5".
- **not-started** (Advanced, Expert): outlined number disc, grey segments, "Preview" button.
**ComponentRow (inside current tier):** 22px status disc · fixed uppercase kind label (150px) ·
title · trailing status/affordance. The current component (3 · Guided content) is highlighted
(paper, navy left rail) with a navy "Resume →" pill. Each row navigates to its screen.
Diagnostic row shows "Skipped" (legitimate, neutral — not a failure).

## 3. Tier diagnostic (skip / proceed decision)
**Purpose:** a confident skip-or-orient checkpoint. Component 1 of 5.
**Layout:** light app bar (back to overview), centred 680px column.
Eyebrow "Orientation diagnostic" → H1 "Do you need this tier?" → reassuring paragraph framing
this as a checkpoint, not a test.
**State A — decision (`diagMode:'decision'`):**
- **Skip card** — `Button variant=skip` styling (yellow fill, navy text), "I'm confident here —
  skip ahead", subcopy "Recommended if this is familiar ground." → routes to **scenario**.
- **Proceed card** — white, navy outline, "I'd like a quick orientation first" → State B.
- Reassurance note (white, `ready` dot): **"Skipping is a normal, confident choice."** Nothing
  is marked incomplete; any component is revisitable from the hub.
**State B — questions (`diagMode:'questions'`):** navy-headed card, one scenario MCQ
("An assurance assessment is best understood as…", 2 options). On answer (`diagAnswered`), a
"Frame set" panel explains the correct framing and offers "Continue to scenario →".
> Skipping must read as a confident choice, never a shortcut or failure. Keep the proceed path
> short and ungraded (one orienting question).

## 4. Anchor scenario (immersive)
**Purpose:** drop the learner into a situation. Component 2 of 5.
**Layout:** FULL-SCREEN `navy-deep` background — visually set apart from all other chrome.
Minimal top chrome (muted back link + "Component 2 of 5"). Centred 760px column.
Yellow eyebrow "Anchor scenario" → white display H1 "The standup that wasn't working".
**Meta strip:** translucent panel with Service / Phase / "Assessment in" — sets the stakes.
**Narrative:** `Source Serif 4`, 21/1.62, light text (`#DDDEE7`) — three paragraphs that put
the learner in the delivery manager's shoes and end on a choice.
**CTA:** yellow "Begin the guided content →" (white focus ring on this dark surface).

## 5. Guided content (reading)
**Purpose:** the main prose reading. Component 3 of 5. The calm, long-form register.
**Layout:** light app bar with breadcrumb + "Component 3 of 5" + 5-segment progress (3rd yellow).
Centred **720px** reading column on `paper`.
Yellow-deep eyebrow "Guided content · ~9 min read" → sans display H1 → **serif lede (21)** →
**serif body (19/1.68)** with sans `H2`s.
**In-flow blocks:**
- `KeyPrinciple` — white card, 4px yellow left rule, yellow-deep eyebrow, 18·600 navy statement.
- `Note` — paper card, hairline border, ink-2 body (for caveats e.g. changing thresholds → points to reference card).
- Bulleted habit list with bold lead-ins.
**Sticky footer nav:** "← Scenario" (secondary) · 5 progress dots · "Next · Understanding check →" (primary).

## 6. Understanding check (+ wrong-answer feedback)
**Purpose:** scenario-based MCQ. Component 4 of 5. Clearly actionable register.
**Layout:** light app bar, centred 700px column. Navy-outlined "Understanding check" chip →
scenario stem (H1 situation + prompt). Four `AnswerOption`s.
**AnswerOption states:**
- **default:** white, `1.5px line-2`, letter badge.
- **selected:** (transient before resolve).
- **incorrect (chosen):** `attention` border + `attention-bg`, ✕ badge, label "Not the strongest
  choice", and an **inline redirect explanation** (why it's weak, what principle it misses).
- **correct (chosen):** `ready` border + `ready-bg`, ✓ badge, "Correct".
- After a wrong pick, the correct option is also marked ("The stronger answer") so the learner is
  redirected, not just told "no".
**Resolution:** picking the correct answer surfaces a green "Exactly right" panel + "Continue to
takeaway →". Picking wrong shows an `attention ▲` "read the redirect, then choose again" line and
lets them re-answer. (Selection logic: `checkChoice` + `checkResolved`; correct index = 2.)
**Copy used:** stem = beta service, assessment in 3 weeks, a journey fails for screen-reader users;
correct = fix it now and capture findings as evidence.

## 7. Takeaway ("take this to work")
**Purpose:** convert the principle into practice. Component 5 of 5.
**Layout:** light app bar, centred 680px column. Yellow-deep eyebrow → H1 "Three things to try
this week" → lede. Three numbered cards (navy number disc, title, one-line action).
Then a `ReferenceCard` entry button (white, yellow left rail). Footer actions: "Mark Foundations
complete →" (primary) + "Back to module" (secondary).

## 8. Reference card (printable)
**Purpose:** one-page, scannable, downloadable. Utilitarian/dense register.
**Layout:** on `grey`; the card itself white, `line-2` border, radius 8, max 760px.
Header: mono "REFERENCE · MODULE 03" + 24·800 title + logo, 2px navy bottom rule.
Body grid: full-width `KeyPrinciple`; two columns — "When controls apply" table (phase → control,
mono values) and "Assessment-ready checklist" (square checkboxes + items); full-width "Definitions"
(3-col term/definition).
**Print:** `.print-hide` chrome hidden via `@media print`; "Download PDF ↓" calls `window.print()`.
Designed to read identically on screen and on paper. **Production:** generate a dedicated 1-page PDF.

## 9. SME exercise (with model-answer reveal)
**Purpose:** SME meta-module applied exercise. Simpler structure than core tiers.
**Layout:** light app bar (back to pathways, "SME meta-module · 2 of 3"), centred 720px column.
Eyebrow naming the meta-module → H1 "Applied exercise".
- **Conceptual framing:** white card, serif body.
- **The exercise:** navy card, yellow eyebrow, prompt + a serif `textarea` for the learner's draft.
- **Reveal:** while hidden (`smeHidden`), a "◑ Reveal model answer" outlined button + "Try your own
  answer first" hint. After `revealSme`, a `ready` panel ("Model answer", ✓) shows a worked example
  and names the pattern (expertise → validation → specific change → recorded link).
> Same reveal pattern applies to SHORT_ANSWER understanding checks: model stays hidden until opt-in.

---

## Interaction & state summary
Prototype state (see `Herd Learn Prototype.dc.html` logic class):
- `screen` — which archetype is shown (enum above).
- `pathway` — `BA|DM|PM|SME`; drives the pathway name shown in the hub.
- `diagMode` (`decision|questions`), `diagPicked` — diagnostic flow.
- `checkChoice`, `checkResolved` — understanding-check selection + feedback; correct index = 2.
- `smeRevealed` — SME model-answer disclosure.
All navigation scrolls to top. The "Prototype map" `<select>` is a review aid only.

## Accessibility acceptance criteria (WCAG 2.2 AA — hard requirement)
- Visible yellow (or navy-on-yellow) focus ring on every control.
- Status conveyed by shape + word, never colour alone.
- Answer options = a labelled radio group; diagnostic decision = clear button/link pair with the
  reassurance text associated via `aria-describedby`.
- Reading column line-length capped; contrast ratios met (see DESIGN-LANGUAGE §4).
- Keyboard operable throughout; `prefers-reduced-motion` respected.
- Reveal controls are real disclosure buttons with `aria-expanded`.
