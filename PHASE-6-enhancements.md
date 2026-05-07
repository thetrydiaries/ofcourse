# Phase 6 — Enhancements

> Load: INDEX.md + PATTERNS.md
> All V1 phases deployed and stable. Build in any order — these are independent.

---

## 6A — Film strip unfurl
Replaces the BoardReveal stagger fade.

A horizontal film strip — with sprocket holes above and below the frames — travels right-to-left across the screen. Each frame holds a user photo. The strip settles, each frame drops slightly then snaps up. Strip fades out. The 4×2 grid is revealed underneath. Buttons appear.

**Timing constraints (exact — the choreography depends on these):**
- Strip travel: 2.5s ease-in-out
- Frame settle bounce: 200ms per frame, triggers at 2.5s
- Strip fade out: 400ms, starts at 2.9s
- Buttons appear: 4.1s

Sprocket holes: `8×8px` `border-radius:2px` `--burgundy`, evenly spaced above and below the frame row. Frames: `border:3px solid --warm-white`, `overflow:hidden`.

The 4×2 grid must exist underneath the strip from the start — the strip reveals it, not replaces it.

## 6B — Full breath circle
Replaces BreathScreen V1.

A circle expands on inhale, holds with a subtle pulse, contracts on exhale. An echo ring (larger, lower opacity) fades in during inhale and fades out during exhale. Label text updates with each phase.

**Timing constraints (exact):**
- Inhale: 4s `cubic-bezier(0.4,0,0.2,1)`, circle 60px → 240px
- Hold: 1.5s, circle stays at 240px, gentle opacity pulse
- Exhale: 6s `cubic-bezier(0.4,0,0.6,1)`, circle 240px → 60px
- Echo ring: 300px diameter, fades in from 2s into inhale, fades out during exhale
- Auto-advances to playback after exhale completes. No button.

`prefers-reduced-motion`: skip animation entirely. Show static screen with the copy and a manual **begin** button. Do not auto-advance.

## 6C — Cursor hide + ghost controls on Playback
A `useIdleTimer` hook. Apply to the Playback container only — not globally.

After 2s of no mouse movement or touch: cursor disappears, edit controls fade to invisible and become non-interactive. Any movement resets the timer instantly and restores both.

Fade out: 600ms. Fade in: 300ms. The asymmetry is intentional — controls disappear slowly, reappear quickly.
