# Phase 1 — Scaffold

> Load: INDEX.md + PATTERNS.md

**Goal:** Project runs. Landing screen visible with correct fonts, colours, grain.

---

## Setup
- Vite + React. Tailwind + raw CSS. No other libraries.
- CSS tokens from INDEX.md into `index.css`. `.field` class from PATTERNS.md.
- Google Fonts in `index.html`: Cormorant Garamond (400, 400 italic), DM Serif Display (italic), Jost (300, 400)
- Grain overlay from PATTERNS.md in App root — fixed, `zIndex:9999`, present on every screen
- Screen router in `App.jsx` — single `currentScreen` string drives which component renders
- State shape from INDEX.md initialised in App

## data/areas.js
Copy every field exactly — do not paraphrase or shorten the body/cue copy:
```js
export const AREAS = [
  { id:'health', number:'01', label:'Health & body',
    question:"How does your body feel when it's truly well?",
    body:"Not perfect — just good. The kind of energy that's quietly there when you need it, that doesn't run out by 3pm. What does a day feel like when you're living inside a body you actually trust?",
    cue:"Picture what that looks like — a morning run, a meal you made, a face in the mirror that looks rested." },
  { id:'relationships', number:'02', label:'Relationships & love',
    question:"Who fills your life with warmth?",
    body:"The people who know the real version of you and show up anyway. What does an ordinary moment with them look like — not a special occasion, just a Tuesday that felt full?",
    cue:"Find a photo of them, or a place you've been together, or the kind of table you want to gather around." },
  { id:'career', number:'03', label:'Career & work',
    question:"What does work feel like when it actually fits you?",
    body:"The days you close your laptop and feel something other than drained. What are you doing, who are you doing it with, and what does it let you build — for yourself, or for something bigger?",
    cue:"Picture your workspace, your craft, the thing you made that you were proud of." },
  { id:'finances', number:'04', label:'Finances & abundance',
    question:"What does financial ease actually feel like?",
    body:"Not rich necessarily — just not worried. The version of your life where money isn't the reason you say no. What does that free up, and what do you do with it?",
    cue:"Think about what that life looks like — a trip you'd take, a home, something you'd stop putting off." },
  { id:'growth', number:'05', label:'Personal growth',
    question:"Who are you becoming?",
    body:"There's a version of you a year from now who's quietly glad you started something. What is it — a skill, a habit, a way of showing up — and what does life look like once it's just part of who you are?",
    cue:"Picture that person — what they're reading, doing, how they carry themselves." },
  { id:'joy', number:'06', label:'Fun, joy & creativity',
    question:"What lights you up just for the sake of it?",
    body:"The thing you do with no audience, no outcome, no point other than that it feels good. You probably had a version of it when you were younger. What is it, and when did you last actually do it?",
    cue:"Find what that looks like — the craft, the court, the kitchen, the open road." },
  { id:'home', number:'07', label:'Home & environment',
    question:"What does your ideal everyday space feel like?",
    body:"Not a showroom — the kind of place that feels like exhaling. Where the light is right, the corner is yours, and you don't have to explain yourself to anyone. Where is that, and what's in it?",
    cue:"Picture the light, the textures, the view from a window, the neighbourhood outside." },
  { id:'purpose', number:'08', label:'Purpose & meaning',
    question:"What makes you feel like you're here for a reason?",
    body:"It doesn't have to be grand. Sometimes it's just the feeling that what you did today mattered to someone, or moved something forward, or was unmistakably yours. What is that for you?",
    cue:"Find what it looks like — the work, the people it touches, the small thing that's part of something larger." },
]
```

## data/music.js
Stub. Populate manually with 3 tracks per mood before Phase 3. Discernible tempo — no ambient soundscapes.
```js
export const TRACKS = { calm:[], uplifting:[], grounding:[], triumphant:[] }
// { id, name, duration, url }
```

## public/textures/grain.png
Generate a 200×200px warm-tinted noise PNG. Cream tint, not grey.

## Landing
- "Of Course" — screen heading size, `--font-heading` italic, `--burgundy`
- Tagline: *because of course this is already your life* — `--font-heading` italic small, `--blush`
- Single Primary button: **begin →**
- Full-screen centred. No scroll, no nav, nothing else.
