import { AREAS } from '../data/areas.js'

const DEV_STATE = {
  userName: 'Shirley',
  intention: 'build a life that feels as good as it looks',
  areas: AREAS.map(a => ({
    ...a,
    photos: [`/dummyphotos/${a.id}.jpg`],
    skipped: false,
    affirmation: '',
    stockPhoto: null,
  })),
  selectedMood: null,
  selectedTrack: null,
  buildError: null,
}

export default function DevShortcut({ onJump }) {
  if (!import.meta.env.DEV) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      alignItems: 'flex-end',
    }}>
      <button
        onClick={() => onJump({ ...DEV_STATE, currentScreen: 'board' })}
        style={btnStyle}
      >
        ⚡ skip to board
      </button>
      <button
        onClick={() => onJump({ ...DEV_STATE, currentScreen: 'ai-loading' })}
        style={btnStyle}
      >
        ⚡ skip to loading
      </button>
      <button
        onClick={() => onJump({
          ...DEV_STATE,
          currentScreen: 'affirmation-review',
          areas: AREAS.map((a, i) => ({ ...a, photos: [`/dummyphotos/${a.id}.jpg`], skipped: false, affirmation: `I am thriving in ${a.label.toLowerCase()}`, stockPhoto: null })),
        })}
        style={btnStyle}
      >
        ⚡ skip to affirmations
      </button>
      <button
        onClick={() => onJump({
          ...DEV_STATE,
          currentScreen: 'playback',
          videoMode: 'immersive',
          selectedMood: 'uplifting',
          selectedTrack: { id: 'uplifting-1', name: 'Days Are Passing', duration: '3:02', url: '/music/uplifting-days-are-passing.mp3' },
          areas: AREAS.map(a => ({ ...a, photos: [`/dummyphotos/${a.id}.jpg`], skipped: false, affirmation: `I am deeply at home in ${a.label.toLowerCase()}`, stockPhoto: null })),
        })}
        style={btnStyle}
      >
        ⚡ skip to playback (immersive)
      </button>
      <button
        onClick={() => onJump({
          ...DEV_STATE,
          currentScreen: 'playback',
          videoMode: 'energise',
          selectedMood: 'uplifting',
          selectedTrack: { id: 'uplifting-1', name: 'Days Are Passing', duration: '3:02', url: '/music/uplifting-days-are-passing.mp3' },
          areas: AREAS.map(a => ({ ...a, photos: [`/dummyphotos/${a.id}.jpg`], skipped: false, affirmation: `I am deeply at home in ${a.label.toLowerCase()}`, stockPhoto: null })),
        })}
        style={btnStyle}
      >
        ⚡ skip to playback (energise)
      </button>
    </div>
  )
}

const btnStyle = {
  fontSize: '11px',
  fontFamily: 'monospace',
  background: 'rgba(0,0,0,0.75)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '6px 10px',
  cursor: 'pointer',
  backdropFilter: 'blur(4px)',
}
