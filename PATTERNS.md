# Of Course — Patterns

Shared constraints for all components. Reference this alongside the active phase file.

---

## Typography hierarchy
| Role | Font | Style | Size |
|---|---|---|---|
| Screen heading | `--font-heading` | italic | `clamp(36px,5vw,56px)` |
| Area question | `--font-heading` | italic | `clamp(28px,4vw,44px)` |
| Body / prompt | `--font-heading` | roman | 19px, `line-height:1.75`, `opacity:0.6` |
| Image cue | `--font-heading` | italic | 14px, `--blush`, em dash prefix |
| Area label | `--font-accent` | italic | 12px, `--blush`, uppercase, `letter-spacing:0.1em` |
| Affirmation (playback) | `--font-heading` | italic | `clamp(20px,3vw,32px)`, centred, text-shadow |
| UI / buttons | `--font-ui` | roman | 13–15px, weight 300 |

---

## Buttons
Two variants — pill shape on both. `border-radius:999px`. `--font-ui` weight 300.

**Primary:** `background:--burgundy` `color:--cream` `padding:14px 40px`
**Ghost:** `background:transparent` `border:1px solid --blush` `color:--blush` `padding:13px 32px`

Disabled state: `opacity:0.4`. Never hide — always show intent.

---

## Input fields
Bottom border only. No box, no border-radius. Feels like writing on paper.
```css
.field {
  border:none; border-bottom:1px solid var(--blush);
  background:transparent; font-family:var(--font-heading);
  font-style:italic; font-size:22px; color:var(--burgundy);
  width:100%; padding:8px 0; outline:none;
}
```

---

## Progress dots
8 pills: `width:24px` `height:8px` `border-radius:999px`
Active: `background:--burgundy`. Inactive: transparent + `border:1px solid --blush`.
No size change on active — colour only.

---

## Upload zone
`border:1.5px dashed --blush` `border-radius:16px` `background:rgba(232,196,184,0.08)` `min-height:160px`

Empty state: *+ add a photo or two* — `--font-ui` 300 14px `--blush`, centred.
Has photos: thumbnails at fixed rotations `[-2.5, 1.8, -1.2]deg` — deterministic, never random.
`80×80px` `objectFit:cover` `border-radius:4px` with warm box-shadow.

---

## Grain overlay
Fixed, every screen, above all content. Never remove — including dark screens.
```jsx
<div aria-hidden="true" style={{
  position:'fixed', inset:0,
  backgroundImage:"url('/textures/grain.png')",
  mixBlendMode:'multiply', opacity:0.07,
  pointerEvents:'none', zIndex:9999,
}}/>
```
Dark screens (BreathScreen): reduce to `opacity:0.04`.

---

## Spacing
- Screen padding: `40px` horizontal, content `maxWidth:var(--max-w)` centred
- Between major elements: `48px`
- Between related elements: `24–32px`
- Nothing crowded. Generous by default.

---

## Animation principles
Slow, breath-paced, intentional. Nothing snappy.
- Screen transitions: `opacity` fade, `600ms ease`
- Interactive feedback: `300ms ease`
- Never bounce, never scale-pop, never slide fast
