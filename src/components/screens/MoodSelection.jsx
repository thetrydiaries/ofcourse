import { useState, useRef } from 'react'
import { TRACKS } from '../../data/music.js'
import Button from '../ui/Button.jsx'

const MOODS = ['calm', 'uplifting', 'grounding', 'triumphant']

const VIDEO_MODES = {
  immersive: 'dwell in it — slow, unhurried, one image at a time',
  energise: 'a quick morning spark — fast cuts, all your photos',
}

export default function MoodSelection({ onNext }) {
  const [mood, setMood] = useState(null)
  const [track, setTrack] = useState(null)
  const [videoMode, setVideoMode] = useState('immersive')
  const [playingTrackId, setPlayingTrackId] = useState(null)
  const audioRefs = useRef({})

  const handleMood = (m) => {
    stopPreview()
    setMood(m)
    setTrack(null)
  }

  const stopPreview = () => {
    if (playingTrackId && audioRefs.current[playingTrackId]) {
      audioRefs.current[playingTrackId].pause()
      audioRefs.current[playingTrackId].currentTime = 0
    }
    setPlayingTrackId(null)
  }

  const handleTrackHover = (trackId) => {
    if (playingTrackId && playingTrackId !== trackId && audioRefs.current[playingTrackId]) {
      audioRefs.current[playingTrackId].pause()
      audioRefs.current[playingTrackId].currentTime = 0
    }
    const audio = audioRefs.current[trackId]
    if (audio?.src) {
      audio.currentTime = 0
      audio.play().catch(() => {})
      setPlayingTrackId(trackId)
    }
  }

  const handleTrackLeave = () => {
    stopPreview()
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
            {/* Hidden audio elements for preview */}
            {TRACKS[mood].map(t => t.url && (
              <audio
                key={t.id}
                ref={el => { if (el) audioRefs.current[t.id] = el }}
                src={t.url}
                preload="metadata"
              />
            ))}

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
                  onMouseEnter={() => handleTrackHover(t.id)}
                  onMouseLeave={handleTrackLeave}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    background: track?.id === t.id ? 'rgba(232,196,184,0.12)' : 'transparent',
                    borderTop: 'none',
                    borderLeft: playingTrackId === t.id ? '3px solid var(--rose)' : '3px solid transparent',
                    borderRight: 'none',
                    borderBottom: '1px solid rgba(212,165,154,0.2)',
                    paddingLeft: '9px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'background 300ms ease, border-left-color 200ms ease',
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

        {/* Pace / video mode */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {Object.keys(VIDEO_MODES).map(m => (
              <button
                key={m}
                onClick={() => setVideoMode(m)}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 300,
                  fontSize: '13px',
                  letterSpacing: '0.04em',
                  padding: '9px 24px',
                  borderRadius: '999px',
                  border: '1px solid var(--blush)',
                  background: videoMode === m ? 'var(--burgundy)' : 'transparent',
                  color: videoMode === m ? 'var(--cream)' : 'var(--blush)',
                  cursor: 'pointer',
                  transition: 'background var(--t-med), color var(--t-med)',
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <p style={{
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--blush)',
            opacity: 0.7,
            margin: 0,
          }}>
            {VIDEO_MODES[videoMode]}
          </p>
        </div>

        <Button
          disabled={!track}
          onClick={() => onNext(mood, track, videoMode)}
        >
          this feels right →
        </Button>

      </div>
    </div>
  )
}
