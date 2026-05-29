# Golden Hour — Mind Movie Playback · Style Spec

A handoff for the **"Golden Hour"** visual direction of the *Of Course* Mind Movie
playback screen. Reference values are authored against a **1280 × 800** design frame —
scale type/​spacing proportionally for other viewports (everything is ratio-based, so
multiplying by `vw/1280` works cleanly).

The feeling: a Sunday morning you never want to end. Warm light, analog film, nothing
to chase. Light and editorial, never spa-minimalist.

---

## 1. Typefaces

Two Google Fonts. Serif carries all the emotional copy; the grotesk is *only* for tiny
utility chrome (kicker labels, wordmark, play hint).

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Hanken+Grotesk:wght@400;500;600;700&display=swap">
```

| Role | Family | Notes |
|---|---|---|
| Affirmations, titles, links | **Newsreader** | A warm literary serif. Use light (300). Italic (`<em>`) for the emotional second clause. |
| Kicker labels, wordmark, play hint | **Hanken Grotesk** | Only as uppercase, heavily tracked micro-labels. Never for body. |

---

## 2. Color tokens

```css
:root {
  /* surfaces */
  --gh-cream:        #f4ecdb;  /* page / title / end background           */
  --gh-ink:          #2c2114;  /* primary serif text on cream             */
  --gh-warmwhite:    #fdf6e8;  /* text & UI sitting on top of a photo     */

  /* warm browns for chrome / labels */
  --gh-wordmark:     #6f5a39;  /* wordmark, uppercase tracked             */
  --gh-kicker:       #9a7c4d;  /* small-caps kicker line                  */
  --gh-playhint:     #8a6f44;  /* "press play" hint + play triangle       */
  --gh-link-ink:     #3a2c19;  /* end-screen links                        */
  --gh-link-rule:    rgba(58,44,25,.32);  /* link underline               */
  --gh-sep:          #b39a6c;  /* "·" separators                          */

  /* light & atmosphere */
  --gh-sun:          rgba(241,196,116,.7);  /* sun glow core              */
  --gh-vignette:     rgba(120,86,40,.28);   /* inset corner darkening     */
  --gh-leak-warm:    rgba(255,196,120,.55); /* top-right light leak       */
  --gh-leak-amber:   rgba(255,150,90,.30);  /* bottom-left light leak     */

  /* photo placeholder (amber) — used until a real photo fills the slot */
  --gh-placeholder:  linear-gradient(140deg, #e9d9bb, #d8b98e 55%, #c79a6a);
}
```

---

## 3. Atmosphere layers (the "film" feel)

These stack on top of the photo / background. Z-order matters — listed bottom → top.

**Sun glow** (title screen) — soft sunrise bloom, top-center:
```css
.a-sun {
  position: absolute; top: -180px; left: 50%; transform: translateX(-50%);
  width: 620px; height: 620px; border-radius: 50%;
  background: radial-gradient(circle, var(--gh-sun), rgba(241,196,116,0) 62%);
  filter: blur(8px);
}
```

**Vignette** — warm corner darkening, on every screen:
```css
.a-vig { position: absolute; inset: 0; box-shadow: inset 0 0 240px var(--gh-vignette); }
```

**Light leak** (over the photo) — analog lens flare, `screen` blend:
```css
.a-leak {
  position: absolute; inset: 0; pointer-events: none; mix-blend-mode: screen;
  background:
    radial-gradient(60% 80% at 96% 8%,  var(--gh-leak-warm),  transparent 60%),
    radial-gradient(40% 60% at 2% 96%,  var(--gh-leak-amber), transparent 60%);
}
```

**Photo scrim** — bottom gradient so the affirmation stays legible over any photo:
```css
.a-scrim {
  position: absolute; inset: 0;
  background: linear-gradient(to top,
    rgba(28,18,8,.62) 0%, rgba(28,18,8,.12) 34%, transparent 56%);
}
```

**Film grain** — subtle multiply-blended noise over everything (≈10% opacity).
Authored as an inline SVG turbulence so it needs no asset:
```css
.grain::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>");
  opacity: 0.10; mix-blend-mode: multiply;
}
```

**End-screen wash** — warms a held photo back toward cream for the "now / next" moment:
```css
.a-endwash {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, rgba(244,236,219,.86), rgba(244,236,219,.7));
}
```

---

## 4. Type scale & component CSS

Screen padding is `56px 64px`. Affirmation/dots/pause are absolutely positioned to the frame edges.

```css
/* base screen */
.dirA { background: var(--gh-cream); color: var(--gh-ink); font-family: 'Newsreader', Georgia, serif; }

/* — wordmark (top-left, all screens) — */
.a-word {
  font-family: 'Hanken Grotesk', sans-serif; font-weight: 600;
  text-transform: uppercase; letter-spacing: .42em; font-size: 13px;
  color: var(--gh-wordmark);
}

/* — kicker / overline — */
.a-kicker {
  font-family: 'Hanken Grotesk', sans-serif; font-weight: 500;
  text-transform: uppercase; letter-spacing: .26em; font-size: 12.5px;
  color: var(--gh-kicker); margin-bottom: 22px;
}

/* — title screen headline — */
.a-title-h { font-weight: 300; font-size: 68px; line-height: 1.04; letter-spacing: -.01em; margin: 0; }

/* — play hint (title screen, centered) — */
.a-playhint {
  display: flex; align-items: center; gap: 11px;
  font-family: 'Hanken Grotesk', sans-serif; text-transform: uppercase;
  letter-spacing: .3em; font-size: 12px; color: var(--gh-playhint);
}
.a-tri {           /* the ▷ glyph, drawn with borders */
  width: 0; height: 0; border-style: solid;
  border-width: 6px 0 6px 10px;
  border-color: transparent transparent transparent var(--gh-playhint);
}

/* — PLAYBACK affirmation (over photo, lower-left) — */
.a-affix { position: absolute; left: 64px; right: 64px; bottom: 92px; }
.a-aff {
  margin: 0; color: var(--gh-warmwhite);
  font-weight: 300; font-size: 56px; line-height: 1.12;
  letter-spacing: -.01em; max-width: 860px;
  text-shadow: 0 2px 30px rgba(0,0,0,.35);
}
.a-aff em { font-style: italic; }   /* italicize the emotional second clause */

/* — progress dots (lower-left) — */
.a-dots { position: absolute; left: 64px; bottom: 54px; display: flex; gap: 11px; align-items: center; }
.a-dots span     { width: 6px; height: 6px; border-radius: 50%; background: rgba(253,246,232,.4); }
.a-dots span.on  { width: 30px; border-radius: 3px; background: var(--gh-warmwhite); }  /* active = elongated pill */

/* — pause glyph (top-right, quiet) — */
.a-pause { position: absolute; top: 50px; right: 60px; display: flex; gap: 5px; opacity: .55; }
.a-pause span { width: 4px; height: 17px; background: var(--gh-warmwhite); border-radius: 1px; }

/* — END screen ("now / next") — */
.a-end-h { font-weight: 300; font-size: 60px; letter-spacing: -.01em; margin: 4px 0 30px; }
.a-links { display: flex; align-items: center; gap: 20px; font-size: 23px; color: var(--gh-link-ink); }
.a-link  { display: inline-flex; align-items: center; gap: 9px; border-bottom: 1px solid var(--gh-link-rule); padding-bottom: 3px; cursor: pointer; }
.a-dot-sep { color: var(--gh-sep); }
```

---

## 5. The three frames — structure & layer order

### Title moment
Cream bg → `.a-sun` → `.a-vig` → grain. Content column, space-between:
- top-left: `Of Course` wordmark
- center: kicker `A film of the life you're walking into` + headline `The morning / that never has to end.`
- bottom-center: `▷ press play`

### Playback (hero)
Full-bleed photo (fills frame, `object-fit: cover`) → `.a-leak` (screen) → grain →
`.a-scrim` → content:
- `.a-aff` affirmation lower-left, last clause in italic — e.g.
  *"My body wakes up easy now — warm, unhurried, already well."*
- `.a-dots` (6 dots, current elongated) lower-left
- `.a-pause` glyph top-right
> For the Ken-Burns feel, animate the photo with a slow `transform: scale(1.0 → 1.08)`
> + a few px translate over ~8–12s, `ease-in-out`, crossfading between photos.

### Now / next
Held photo → `.a-endwash` → grain → centered content:
- kicker `Your film · six scenes`
- headline `Stay a little longer?`
- links: `▷ Play again · Write what you felt · Keep it close`

---

## 6. Photos

Real photos sit in `object-fit: cover` containers. Until filled, show the warm amber
placeholder (`--gh-placeholder`) so empty states still feel intentional. Caption hint
color on a placeholder: `rgba(70,48,28,.62)`.

---

## 7. Voice / copy rules

- Present tense, already-true, never aspirational. "My body wakes up easy now," not "I will…".
- Two-beat affirmations: a plain statement, then an italic softening clause.
- Chrome copy is lowercase + tracked ("press play"); emotional copy is sentence-case serif.
- The themes behind the prompts stay **invisible** during playback — felt, never labelled.
```
