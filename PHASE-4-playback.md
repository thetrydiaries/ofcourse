# Phase 4 — Breath Screen + Playback

> Load: INDEX.md + PATTERNS.md
> Phases 1–3 complete before starting.

**Goal:** Breath screen auto-advances into playback. User watches their mind movie with VHS filter, Ken Burns, affirmations overlaid. Edit controls functional.

---

## BreathScreen (V1)
Simple placeholder — replaced in Phase 6.

- Background `--near-black`. Grain overlay still present, `opacity:0.04`.
- A circle with a gentle scale pulse (not a spinner — slow, breath-paced, 4s)
- Copy: *take a breath. let yourself arrive.* — `--font-heading` italic 16px `--warm-white` `letter-spacing:0.08em`
- Auto-advances after 12.5s. No button, no interaction.

## Playback
Full-screen CSS-animated sequence. VHS overlay on top of everything.

**Sequence:** Cycle `state.areas` in order, ~9s each. Use `photos[0]` — fall back to `stockPhoto` if empty. Crossfade between areas (opacity, 600ms). Loop after last area.

**Ken Burns:** Slow zoom-pan on each photo. Alternate direction per area index — even areas zoom toward top-left, odd toward bottom-right. 9s duration. This keeps the visual cortex engaged — static photos feel dead.

**VHS overlay — three stacked layers, `pointer-events:none`:**
- Scanlines: repeating horizontal lines, very low opacity, full-bleed
- Tracking line: a single 2px horizontal bar animating top→bottom on a ~7s loop
- Grain flicker: the grain texture rapidly shifting position to simulate film noise

These are the non-obvious constraints — Claude Code should implement all three. The effect reads as VHS only when all three are present together.

**Affirmation:** centred over photo, affirmation style from PATTERNS.md. Appears with the photo, not after.

**Edit controls (V1):** always visible — cursor hide behaviour added in Phase 6.
- *swap* link contextually placed below affirmation → re-opens AffirmationReview
- *change track* link bottom-centre → returns to MoodSelection
- Style: `--font-ui` 300 12px `--warm-white` 70% opacity. No border, no background, no panel.
