# Of Course — Full Experience Review

## What You've Built (and Why It's Good)

The bones are genuinely strong. The writing across the area prompts is among the best I've seen in a consumer app — specific, warm, non-generic. The visual design is intentional and cohesive. The idea of a "mind movie" as a downloadable, re-watchable artefact is the right output format. The technical architecture is clean. This is a real thing, not a prototype.

---

## 1. The Most Critical Issue: No Persistence

This needs to be fixed before anything else.

There is zero state saved. If a user closes the tab, loses wifi, or their browser crashes after 20 minutes of work, everything is gone. For an app asking for 20 minutes of emotional investment and personal photos, this is the most painful possible failure mode.

**What to do:**

The product is single-session by design — no persistence is a feature, not an oversight. But data loss from an accidental tab close is still a real risk that would destroy trust fast. The fix isn't localStorage autosave — it's a browser `beforeunload` prompt that fires if the user tries to navigate away or close the tab mid-session (after area 1, before the download screen).

```js
useEffect(() => {
  const warn = (e) => {
    e.preventDefault();
    e.returnValue = ''; // triggers browser's native "leave site?" dialog
  };
  window.addEventListener('beforeunload', warn);
  return () => window.removeEventListener('beforeunload', warn);
}, []);
```

Mount this after the first area is completed. Remove it once the download screen loads. This addresses the anxiety without undermining the single-session philosophy or adding any backend complexity.

---

## 2. The Breath Screen is Doing the Wrong Job at the Wrong Time

The core neuroscience problem.

Currently the breath screen appears after Mood Selection and before Affirmation Review — essentially as a transitional pause while the AI finishes generating.

But neuroscience says: breathing regulates first, then you receive. The optimal order for this experience is:

```
Current:   Intention → Photos → Board → Mood → Breathe → Affirmations → Watch
Better:    Breathe → Intention → Photos → Board → Mood → Affirmations → Watch
```

When a user arrives at the app, they're often in "doing mode" — scanning, planning, distracted. A breath practice at the very start would shift them into a receptive state before they write their intention and choose their photos. This makes every subsequent step more meaningful.

Additionally, one breath cycle (11.5 seconds) is not enough to create a physiological state change. The vagus nerve requires roughly 3 cycles of conscious breathing before parasympathetic activation is detectable. Three cycles takes ~35 seconds — not significantly longer, but neuroscientifically the difference between a real intervention and a nice animation.

**What to do:**

Don't force 35 seconds of breathing on a user who just landed cold — they'll leave before they've seen what the product is. The compromise: add a short optional breath moment at the very start, before the Intention screen, with a clear skip option.

```
"Before we begin, take three breaths to arrive fully."
[begin breathing] / [skip, take me straight in]
```

If they engage: run 3 full cycles (~35s). If they skip: proceed straight to Intention. Either way, keep the single breath cycle before Playback as the pre-watch ritual — the user is invested by then and won't skip it.

Add a subtle counter or breath phase indicator so users know how many remain.

---

## 3. The Photo Collection Flow is Your Biggest Drop-off Risk

Going through 8 sequential upload screens is cognitively exhausting. Most users won't have 8 sets of aspirational photos ready. By area 4 or 5, willingness to engage drops sharply.

**Specific problems:**
- Users don't know what photos to choose (the cue text helps but isn't enough)
- There's no example of what a "good" upload looks like
- The "skip" button is too visually similar to "next" — users may skip accidentally or feel guilty using it
- The sequence feels like a form, not an experience
- Stock photos are used only as fallback — but they could be a first-class feature

**What to do:**

Add a "browse suggested images" path directly into the upload zone — a separate affordance, not a replacement for skip. This makes Pexels a discovery feature, not just a silent fallback.

**The new upload zone has two modes:**

*Mode 1 — Upload your own (default, as before)*
The existing dashed zone. Label: *+ add a photo or two*

*Mode 2 — Browse suggested images*
A text link beneath the upload zone: *or browse suggested images →*

Clicking this opens an inline panel (not a modal — it expands below the upload zone within the same page flow). The panel shows a 3×2 grid of curated Pexels results for that area. Each image is selectable with a tap — a warm border appears on selection, and the image is added to the area's photos alongside any uploads.

Users can mix: upload 1 of their own, then tap a suggested image to pair it.

**Curated Pexels queries (not generic area labels):**
```js
const pexelsQueries = {
  health:        'morning light wellness calm body',
  relationships: 'friends warmth together intimate moment',
  career:        'creative workspace focus craft studio',
  finances:      'travel abundance light open space',
  growth:        'reading quiet solitude learning journal',
  joy:           'play delight outdoor colour movement',
  home:          'interior soft light cosy corner home',
  purpose:       'hands making meaningful work community',
};
```

These are written to return warm, human, faceless-leaning results. Run each query in the Pexels browser before launch and confirm the top 6 results fit the aesthetic — adjust where they don't.

**Fetch behaviour:** Lazy — only triggered when the user clicks "browse suggested images", not on page load. Show 6 results in a 3×2 grid with skeleton loading tiles while the fetch runs. Max 3 total per area (uploads + suggested combined).

**Skip is unchanged.** Skip means "skip entirely — let the AI fill it in." Suggested images is a separate path. Don't rename or conflate them.

---

## 4. The Intention Setting Screen is Underutilising Its Moment

The 12-month intention field is the most important input in the entire app — it seeds the affirmations and frames the whole experience. But the screen treats it as a form field.

**Problems:**
- There's no warmup — users are asked to define their 12-month vision cold, without any prompting or priming
- There's no explanation of how this intention will be used

**What to do:**
- Add 1–2 sentences explaining how their intention threads through the whole experience: *"This becomes the spine of your film — it appears in your board and shapes every affirmation."*
- Consider a brief prompt question before the field: *"When you imagine yourself 12 months from now, what's different?"* — this activates visualisation before asking for a statement
- Display the intention back prominently on the BoardReveal screen — not just as a heading, as a centrepiece statement

---

## 5. The Affirmation Review Screen is Passive

Users see 8 affirmations, can rewrite them, and click "preview." This is a cognitive review, not an embodied experience. Reading 8 affirmations quickly is likely what most users do.

**What to do:**
- When a user clicks *rewrite*, offer 2–3 AI-generated alternatives rather than a blank input field — this is faster and produces better results. Manual editing still available via a small *write your own* link.
- Add a brief instruction above the list: *"Read each one slowly. If one doesn't feel true yet, rewrite it until it does."* Simple, but it changes the energy with which users approach the screen.

**Implementation for alternatives:**
Call the Claude API for that single area on rewrite click. Return 3 options as a JSON array. Display as small inline pill-style options below the current affirmation. On selection: replace and close. Manual edit still available.

---

## 6. The Playback Screen Needs a First-Watch Mode

The first time a user watches their mind movie should be treated as a ceremony, not a feature demo.

**Current problems:**
- Controls are visible from the start
- No threshold moment between Affirmation Review and Playback — it just appears
- Edit controls being available during playback breaks immersion at the worst possible moment

**What to do:**
- Start Playback with all controls hidden. Fade them in only after the first full loop completes.
- Add a 1–2 second cinematic fade-in from black, music fading up — this creates a threshold moment signalling "this is special"
- Remove edit controls from Playback entirely during the first watch. Once the first loop finishes, three ghost buttons fade in slowly *below* the VHS player (not overlaid on it): *swap affirmations*, *change track*, *reorder photos*

```jsx
const [firstPlaythrough, setFirstPlaythrough] = useState(true);

<VHSPlayer
  onPlaybackComplete={() => setFirstPlaythrough(false)}
/>

{!firstPlaythrough && (
  <EditControls /> // fades in 600ms after first loop
)}
```

---

## 7. The Download Screen Undersells the Most Important Instruction

The most valuable thing the app could tell users is how to use their mind movie as a daily practice. Currently this is reduced to a single italic line: *"watch it every morning when you wake up, and every night before you sleep."*

This is good advice but it's buried and passive.

**What to do:**
- Make "how to watch this" a brief dedicated moment on the Download screen — a small card or expandable section
- Include: frequency (daily), context (before your phone, when you wake up), posture/environment (lying down or seated, headphones if possible), and what to do while watching (breathe, feel it, don't just watch)
- Reframe the download button copy — *"download your film"* feels transactional. Consider *"take it with you"* or *"your film is ready"*

---

## 8. Content Gaps That Break the Experience

**Music library is incomplete.** Two of the four moods — Calm and Triumphant — have zero tracks. Users who select either of these moods cannot actually use them. This is a live bug that will silently degrade the experience for a significant portion of users. Fix this before anything else. Source 3 tracks per mood from Pixabay Music or Free Music Archive. Tracks must be at least 90s long with a discernible tempo.

**The board only shows the first photo.** If a user uploads 3 photos per area, the board preview only shows one. Add a small pill badge top-right of each board cell: "2 photos" / "3 photos". If skipped, show "skipped". This costs almost nothing to build and removes a real confusion point.

---

## 9. Mobile Experience is Likely Broken

The app appears to be designed primarily for desktop. The padding values (56–64px), clamp font sizes, and drag-and-drop upload zone will all behave poorly on mobile. Given that most users' photos are on their phones, a mobile-first photo upload experience is probably the highest-leverage UX work after the music library fix.

---

## Priority Order

1. **Music library** — live content bug, two moods broken
2. **Photo count badge on board cells** — tiny build, removes real confusion
3. **Suggested images in upload zone** — transforms the photo flow from a burden into discovery; biggest experiential change
4. **Breath screen: optional short version at start** — core neuroscience claim, low build effort
5. **Playback first-watch mode** — peak experience quality; partially covered by VHS player spec
6. **"Don't lose your work" beforeunload warning** — addresses data loss risk without touching product philosophy
7. **Download screen: how-to-watch expansion** — retention and real-world impact
8. **Affirmation review: offer alternatives on rewrite** — engagement depth, low effort
9. **Intention screen: add context + priming prompt** — conversion quality
10. **Mobile responsiveness** — audience reach

The writing and design of what you've built are genuinely excellent. The gaps are mostly structural and experiential — the kind of thing that's invisible until someone goes through it carefully, which is exactly what you asked for.

