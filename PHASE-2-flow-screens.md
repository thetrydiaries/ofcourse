# Phase 2 — User Flow Screens

> Load: INDEX.md + PATTERNS.md
> Phase 1 complete before starting.

**Goal:** Full front-end flow works end to end — Landing → IntentionSetting → 8 × AreaPrompt → BoardReveal. No API calls yet.

---

## Build order
1. Shared UI: `Button` (Primary + Ghost), `ProgressDots`, `UploadZone` — all specs in PATTERNS.md
2. `IntentionSetting`
3. `AreaPrompt`
4. `BoardReveal`
5. Wire all into App router

---

## IntentionSetting
Two `.field` inputs. Label style: `--font-accent` italic 12px `--blush` `letter-spacing:0.06em`.
- Field 1: label *your name*, placeholder *sarah*
- Field 2: label *what are you building, doing, or becoming in the next 12 months?*, placeholder *building a creative practice that sustains me*
- Primary **next →** disabled until name non-empty
- On advance: saves `userName` + `intention` to App state

## AreaPrompt
One component. All 8 areas use it — content injected from `AREAS[i]`.

Top to bottom: `ProgressDots` → area label → question → body → cue → `UploadZone` → button row.

Typography for each element in PATTERNS.md. Button row: Ghost **skip this one** + Primary **next area →** (final area: **see my board →**).

Upload: max 3 files, stored as object URLs. Skip: sets `skipped:true`, clears photos, advances.

## BoardReveal (V1)
4×2 grid. Cells fade in at 150ms stagger. This is a placeholder — replaced in Phase 6.

Each cell `aspectRatio:4/3` `overflow:hidden` `borderRadius:8px`:
- Has photo → full-bleed image `objectFit:cover`
- Skipped → `background:#C4B4AE`, italic *skipped* centred, `--warm-white` 60% opacity
- Area label bottom-left — area label style from PATTERNS.md, `--warm-white`, text-shadow

Below grid: Ghost **edit board** + Primary **build my mind movie →**

## App routing
- `landing` → `intention`
- `intention` → `area-0`
- `area-0` through `area-7` → sequential, then `board`
- `board`: edit → `area-0`, build → `ai-loading` (placeholder screen fine for now)
