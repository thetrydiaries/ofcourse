# Phase B — Medium Complexity Specs

Build order: B1 → B2 → B3. Hand to Claude Code as a brief.

---

## B1 — Board title with user context

**Ownership:** Claude Code  
**Effort:** 1 hour  
**File to modify:** `src/components/screens/BoardReveal.jsx`

**What it does:**
Adds a title above the 4×2 grid that reminds the user of their intention. Uses their input from IntentionSetting screen.

**Copy template:**
```
You're building this mind movie for one reason:
[their intention statement here]

Watch it every day. Let it become your normal.
```

**Typography:**
- Line 1 (preamble): `--font-heading` italic 28px, `--burgundy`, 70% opacity
- Line 2 (their intention): `--font-heading` italic 32px, `--burgundy`, 100% opacity
- Line 3 (ending): `--font-heading` italic 18px, `--blush`, 60% opacity

**Implementation:**
- Pass `userName` and `intention` from App state to `BoardReveal` component (already passed? check current props)
- Create a `<div className="board-title">` wrapper above the grid
- Apply generous padding: 40px top, 40px bottom
- Margin below title before grid: 48px
- Text is centred (`text-align: center`)
- Max-width: use `--max-w` (680px) and centre the title block

**Code structure (pseudo):**
```jsx
export const BoardReveal = ({ userName, intention, areas, onEdit, onBuild }) => {
  return (
    <div className="board-reveal-container">
      <div className="board-title">
        <p className="board-title-preamble">You're building this mind movie for one reason:</p>
        <p className="board-title-intention">{intention}</p>
        <p className="board-title-closing">Watch it every day. Let it become your normal.</p>
      </div>
      
      <div className="board-grid">
        {/* existing 4x2 grid code */}
      </div>
      
      {/* existing buttons */}
    </div>
  );
};
```

**CSS (add to index.css or component scoped):**
```css
.board-title {
  text-align: center;
  margin-bottom: 48px;
  max-width: var(--max-w);
  margin-left: auto;
  margin-right: auto;
  padding: 40px 0;
}

.board-title-preamble {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 28px;
  color: var(--burgundy);
  opacity: 0.7;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.board-title-intention {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 32px;
  color: var(--burgundy);
  opacity: 1;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.board-title-closing {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 18px;
  color: var(--blush);
  opacity: 0.6;
  margin: 0;
  line-height: 1.4;
}
```

---

## B2 — Edit board state fix

**Ownership:** Claude Code  
**Effort:** 1 hour  
**Files to modify:** `src/App.jsx`, `src/components/screens/Playback.jsx`, `src/components/screens/BoardReveal.jsx`

**What it does:**
Clicking "edit board" now takes you directly to the board grid in reorder/swap mode. Photos are *not* lost. You can drag cells to reorder and click to swap photos within an area.

**UX flow:**
1. User is on Playback screen
2. Clicks "edit board" button
3. Stays on Playback screen, but:
   - Video freezes (shows current frame)
   - Cells become interactive: draggable to reorder, clickable to swap photos
   - Edit controls are replaced with: **done editing** button
4. User reorders/swaps
5. Clicks **done editing** → returns to normal playback (video resumes)

**State changes:**
- Add `editMode: false` to global App state
- When "edit board" clicked: set `editMode: true`
- When "done editing" clicked: set `editMode: false`, update area order/photos in state

**Playback component logic:**
```jsx
const [editMode, setEditMode] = useState(false);

if (editMode) {
  return <BoardEditMode areas={areas} onDone={() => setEditMode(false)} />;
} else {
  return <PlaybackVideo areas={areas} onEditClick={() => setEditMode(true)} />;
}
```

**BoardEditMode component (new or existing BoardEdit):**
- Show the 4×2 grid
- Make cells draggable using a library like `react-beautiful-dnd` or native HTML drag API
- On cell click: open a photo picker for that area only
  - User can upload a new photo or select from their existing uploads for that area
  - Update the area's `photos` array, keep other areas untouched
- Button: **done editing** → callback to parent (Playback)

**Drag-and-drop detail:**
- User can drag a cell to swap positions with another
- This reorders the `areas` array in place
- Visual feedback: light opacity change on hover, cursor change on drag

---

## B3 — Track preview on hover

**Ownership:** Claude Code  
**Effort:** 1.5 hours  
**File to modify:** `src/components/screens/MoodSelection.jsx`

**What it does:**
When user hovers over a track name in the track list, a 10–15 second audio preview plays. Stopping hover pauses the preview. Hovering a new track stops the old one and plays the new one.

**Implementation:**
- Each track object in `data/music.js` needs a `url` field (the full MP3 file)
- Create a hidden `<audio>` element for each track
- On hover: play the audio from start
- On mouse leave: pause and reset to 0
- Only one audio plays at a time (kill previous if hovering new one)

**Code structure:**
```jsx
const [playingTrackId, setPlayingTrackId] = useState(null);
const audioRefs = useRef({});

const handleTrackHover = (trackId) => {
  // Stop currently playing track
  if (playingTrackId && audioRefs.current[playingTrackId]) {
    audioRefs.current[playingTrackId].pause();
    audioRefs.current[playingTrackId].currentTime = 0;
  }

  // Start new track
  if (audioRefs.current[trackId]) {
    audioRefs.current[trackId].play();
    setPlayingTrackId(trackId);
  }
};

const handleTrackLeave = () => {
  if (playingTrackId && audioRefs.current[playingTrackId]) {
    audioRefs.current[playingTrackId].pause();
    audioRefs.current[playingTrackId].currentTime = 0;
  }
  setPlayingTrackId(null);
};

return (
  <>
    {/* Hidden audio elements */}
    {tracks.map(track => (
      <audio
        key={track.id}
        ref={el => audioRefs.current[track.id] = el}
        src={track.url}
        preload="metadata"
      />
    ))}

    {/* Track rows */}
    {tracks.map(track => (
      <div
        key={track.id}
        className="track-row"
        onMouseEnter={() => handleTrackHover(track.id)}
        onMouseLeave={handleTrackLeave}
      >
        <span className="track-name">{track.name}</span>
        <span className="track-duration">{track.duration}s</span>
      </div>
    ))}
  </>
);
```

**CSS (minimal):**
```css
.track-row {
  border-bottom: 1px solid rgba(212, 165, 154, 0.3);
  padding: 12px 0;
  cursor: pointer;
  transition: background-color 300ms ease;
}

.track-row:hover {
  background-color: rgba(232, 196, 184, 0.08);
}

.track-row.playing {
  /* optional: add a left border accent when playing */
  border-left: 3px solid var(--rose);
  padding-left: 9px;
}
```

**Audio preload strategy:**
- Use `preload="metadata"` on the audio elements so they load quickly
- If tracks are large, consider serving 10–15s clips instead of full tracks (cut them server-side or in post-production)

---

## Build checklist for Phase B

- [ ] B1 — Board title added, passes `intention` correctly, typography matches spec
- [ ] B2 — Edit mode logic added to App state, Playback shows edit UI, BoardEdit component exists and allows reorder + photo swap
- [ ] B3 — Audio preview works on hover, stops on leave, only one track plays at a time
- [ ] All three features tested end-to-end
