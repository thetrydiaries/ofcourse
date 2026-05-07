# Of Course — Index

Single-session browser app. No backend, no auth, no DB. Client-side only. Nothing persists after tab close.

---

## Stack
- React + Vite / Tailwind + raw CSS keyframes
- `ffmpeg.wasm` — video export, client-side only
- Anthropic `claude-haiku-4-5-20251001` — affirmations
- Pexels API — stock photos for skipped areas
- Vercel free tier + GitHub / Google Fonts

State: `useState` + `useContext` only. No libraries.

---

## Tokens
```css
:root {
  --cream:#FFF8F0; --rose:#E8C4B8; --burgundy:#2A1A14;
  --blush:#D4A59A; --near-black:#0D0A08; --warm-white:#F5EDE0;
  --font-heading:'Cormorant Garamond',serif;
  --font-accent:'DM Serif Display',serif;
  --font-ui:'Jost',sans-serif;
  --max-w:680px; --t-slow:600ms ease; --t-med:300ms ease;
}
```

---

## File structure
```
src/
  components/screens/   Landing, IntentionSetting, AreaPrompt,
                        BoardReveal, AILoading, AffirmationReview,
                        MoodSelection, BreathScreen, Playback, Download
  components/ui/        Button, ProgressDots, UploadZone
                        FilmStrip, FilmFrame, BreathCircle  ← Phase 2
  hooks/                useIdleTimer.js
  utils/                affirmations.js, pexels.js, videoExport.js, filename.js
  data/                 areas.js, music.js
  App.jsx, main.jsx, index.css
public/textures/grain.png
```

---

## State shape
```js
{
  currentScreen: 'landing',
  userName: '', intention: '',
  areas: AREAS.map(a => ({
    ...a,
    photos: [],        // object URLs, max 3
    skipped: false,
    affirmation: '',
    stockPhoto: null,
  })),
  selectedMood: null,  // 'calm'|'uplifting'|'grounding'|'triumphant'
  selectedTrack: null, // { id, name, duration, url }
}
```

---

## Env vars
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_PEXELS_API_KEY=...
```
`.env.local` only. Never commit. Set in Vercel project settings.

---

## Rules
- No account, auth, backend, DB, analytics, notifications, social, mobile app
- WCAG AA contrast on all interactive elements
- Photos never leave the browser
- Grain overlay present on every screen including dark ones
