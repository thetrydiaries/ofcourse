import { useState } from 'react'
import { TRACKS } from '../../data/music.js'
import Button from '../ui/Button.jsx'

const MOODS = ['calm', 'uplifting', 'grounding', 'triumphant']

export default function MoodSelection({ onNext }) {
  const [mood, setMood] = useState(null)
  const [track, setTrack] = useState(null)

  const handleMood = (m) => {
    setMood(m)
    setTrack(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 40px',
    }}>
      <div style={{ width: '100%', maxWidth: 'var(--max-w)', display: 'flex', flexDirection: 'column', gap: '48px' }}>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {MOODS.map(m => (
            <button
              key={m}
              onClick={() => handleMood(m)}
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 300,
                fontSize: '15px',
                borderRadius: '999px',
                padding: '13px 32px',
                border: '1px solid var(--blush)',
                cursor: 'pointer',
                background: mood === m ? 'var(--burgundy)' : 'transparent',
                color: mood === m ? 'var(--cream)' : 'var(--blush)',
                transition: 'background var(--t-med), color var(--t-med)',
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {mood && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TRACKS[mood].length === 0 ? (
              <p style={{
                fontFamily: 'var(--font-heading)',
                fontStyle: 'italic',
                fontSize: '16px',
                color: 'var(--blush)',
                opacity: 0.7,
              }}>
                no tracks yet — populate data/music.js to continue
              </p>
            ) : (
              TRACKS[mood].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTrack(t)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    background: track?.id === t.id ? 'rgba(232,196,184,0.12)' : 'transparent',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: '1px solid rgba(212,165,154,0.2)',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 300,
                    fontSize: '15px',
                    color: 'var(--burgundy)',
                  }}>
                    {t.name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 300,
                    fontSize: '13px',
                    color: 'var(--blush)',
                  }}>
                    {t.duration}
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        <Button
          disabled={!track}
          onClick={() => onNext(mood, track)}
        >
          this feels right →
        </Button>

      </div>
    </div>
  )
}
