# Phase 3 — AI Layer

> Load: INDEX.md + PATTERNS.md
> Phases 1–2 complete. `data/music.js` populated before starting.

**Goal:** Claude API returns 8 affirmations. Pexels fills skipped areas. User reviews affirmations and selects a track. State fully populated before playback.

---

## Build order
1. `utils/affirmations.js`
2. `utils/pexels.js`
3. `handleBuild` in App.jsx
4. `AILoading`
5. `AffirmationReview`
6. `MoodSelection`

---

## utils/affirmations.js
One API call to `claude-sonnet-4-20250514`. Returns all 8 affirmations as a parsed JSON array.

Prompt must enforce these rules — bake them in as hard constraints, not suggestions:
- Present tense only: "I am" / "I have" / "I'm" — never "I will" or "I want"
- 5–12 words maximum
- No negations — not, don't, never, stop
- Emotionally loaded vocabulary: thriving, radiant, easeful, magnetic, alive, steady, grateful
- Uses `userName` and `intention` as anchor

Instruct the model to return only a raw JSON array of 8 strings — no markdown, no preamble. Strip any accidental backticks before parsing.

## utils/pexels.js
One fetch per skipped area. Query is the area label. `per_page=3`, `orientation=landscape`. Return `photos[0].src.large` or null.

## handleBuild (App.jsx)
Fires on "build my mind movie →". Sets screen to `ai-loading` first, then runs affirmations + all Pexels fetches in parallel (`Promise.all`). On completion, writes affirmations and stock photos into area state, advances to `affirmation-review`.

## AILoading
Shown while API calls run. Advances programmatically — no timer here.
- Copy: *making your mind movie...* — `--font-heading` italic, `--burgundy` 70% opacity
- A single `1px` horizontal line filling left→right over ~4s. No percentage, no steps.

## AffirmationReview
Scrollable. 8 cards separated by lines — no boxes, no shadows.

Per card: area label → affirmation text (`--font-heading` italic 22px) → *swap* link bottom-right (`--blush`, underlined, 12px). Separator: `1px solid rgba(212,165,154,0.2)`.

Swap: re-call the API for that single area, or allow inline edit — either is fine for V1.

CTA: Primary **preview my mind movie →**

## MoodSelection
4 mood pills (calm / uplifting / grounding / triumphant) — pill style from PATTERNS.md. Selected: `background:--burgundy` `color:--cream`.

On mood select: render 3 track rows from `TRACKS[mood]`. Row: name left, duration right, bottom border only, no card. Selected row has a faint warm tint. Primary **this feels right →** disabled until a track is chosen. Saves `selectedMood` + `selectedTrack` to App state.
