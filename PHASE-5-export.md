# Phase 5 — Export + Download

> Load: INDEX.md + PATTERNS.md
> Phases 1–4 complete before starting.

**Goal:** MP4 assembles client-side via ffmpeg.wasm. File downloads with personalised filename. Download screen is the final screen — nothing follows it.

---

## utils/filename.js
Format: `[name]-of-course-[month]-[year].mp4`. Name must be sanitised — strip diacritics, lowercase, spaces to hyphens, remove non-alphanumeric. If name is empty after sanitisation, omit the name prefix entirely.

## utils/videoExport.js
Uses `@ffmpeg/ffmpeg`. Runs entirely client-side — no server.

The ffmpeg command below is exact — copy it precisely. The `zoompan` filter is the Ken Burns effect in the exported MP4 and is easy to break with small changes:

```
-framerate 1/9 -i img%d.jpg -i track.mp3
-c:v libx264 -c:a aac -shortest
-vf scale=1920:1080:force_original_aspect_ratio=decrease,
    pad=1920:1080:(ow-iw)/2:(oh-ih)/2,
    zoompan=z='min(zoom+0.001,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=270
output.mp4
```

Write each area's image to ffmpeg's virtual filesystem as `img0.jpg` through `img7.jpg`. Use `photos[0]` — fall back to `stockPhoto`. Write track as `track.mp3`. Call `onProgress` with 0–100 as export runs.

## Download trigger
On completion: create an object URL from the Blob, assign to an `<a>` with the generated filename, click it programmatically, then revoke the URL.

## Download screen
The last screen. Nothing follows it.

- Cream background. Blurred 4×2 grid faintly visible behind content: `opacity:0.1` `blur:20px` — purely decorative.
- Primary button: **download your mind movie**
- Progress bar (same as AILoading) shown between button click and download completing
- One line below the button only: *watch it every morning when you wake up, and every night before you sleep.* — `--font-heading` italic 18px, muted
- No account prompt. No share. No "make another". Nothing else on this screen.
