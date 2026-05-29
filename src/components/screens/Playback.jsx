import { useState, useEffect } from 'react'
import { useIdleTimer } from '../../hooks/useIdleTimer.js'
import BoardEditMode from './BoardEditMode.jsx'

export default function Playback({ areas, videoMode, onSwap, onChangeTrack, onSave, onUpdateAreas }) {
  const [editMode, setEditMode] = useState(false)

  if (editMode) {
    return (
      <BoardEditMode
        areas={areas}
        onDone={(updatedAreas) => {
          onUpdateAreas(updatedAreas)
          setEditMode(false)
        }}
      />
    )
  }

  return <PlaybackView
    areas={areas}
    videoMode={videoMode}
    onSwap={onSwap}
    onChangeTrack={onChangeTrack}
    onSave={onSave}
    onEditBoard={() => setEditMode(true)}
  />
}

function PlaybackView({ areas, videoMode, onSwap, onChangeTrack, onSave, onEditBoard }) {
  const isEnergise = videoMode === 'energise'
  const slideDuration = isEnergise ? 2000 : 9000
  const fadeDuration = isEnergise ? 120 : 600

  // For energise: all photos across all areas flat; for immersive: one per area
  const frames = isEnergise
    ? areas.flatMap(a => {
        const photos = a.photos?.filter(Boolean)
        return (photos?.length ? photos : [a.stockPhoto ?? null]).map(photo => ({
          photo,
          affirmation: a.affirmation,
        }))
      })
    : areas.map(a => ({
        photo: a.photos?.[0] ?? a.stockPhoto ?? null,
        affirmation: a.affirmation,
      }))

  const [currentIndex, setCurrentIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const { idle, reset: resetIdle } = useIdleTimer(2000)

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(i => (i + 1) % frames.length)
        setTransitioning(false)
      }, fadeDuration)
    }, slideDuration)
    return () => clearInterval(timer)
  }, [frames.length, slideDuration, fadeDuration])

  const frame = frames[currentIndex]
  const photo = frame?.photo
  const isEven = currentIndex % 2 === 0

  // Asymmetric fade: controls disappear slowly (600ms), reappear quickly (300ms)
  const controlsStyle = {
    opacity: idle ? 0 : 1,
    transition: `opacity ${idle ? '600ms' : '300ms'} ease`,
    pointerEvents: idle ? 'none' : 'auto',
  }

  return (
    /* Room */
    <div
      onMouseMove={resetIdle}
      onTouchStart={resetIdle}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#FFF8F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '28px',
        cursor: idle ? 'none' : 'default',
      }}
    >
      {/* TV assembly */}
      <div style={{ position: 'relative', width: 'min(80vw, 900px)' }}>

        {/* Glow halo behind TV */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-30px',
            borderRadius: '40px',
            background: 'radial-gradient(ellipse at center, rgba(255,160,60,0.15) 0%, transparent 70%)',
            animation: 'tvGlowPulse 4s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* TV body */}
        <div style={{
          position: 'relative',
          background: '#1A1008',
          borderRadius: '24px',
          padding: '20px 20px 0',
          boxShadow: [
            '0 0 80px 20px rgba(255,180,80,0.18)',
            '0 0 140px 40px rgba(255,140,60,0.10)',
            '0 24px 60px rgba(26,16,8,0.35)',
          ].join(', '),
          zIndex: 1,
        }}>

          {/* Screen */}
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative',
            background: '#000',
            boxShadow: 'inset 0 0 20px rgba(255,160,60,0.12)',
          }}>

            {/* Photo */}
            {photo && (
              <img
                key={currentIndex}
                src={photo}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: transitioning ? 0 : 1,
                  transition: `opacity ${fadeDuration}ms ease`,
                  animation: isEnergise ? undefined : `${isEven ? 'kenBurnsEven' : 'kenBurnsOdd'} 9s ease-out forwards`,
                  transformOrigin: 'center center',
                }}
              />
            )}

            {/* No photo fallback */}
            {!photo && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--near-black)',
                opacity: transitioning ? 0 : 1,
                transition: `opacity ${fadeDuration}ms ease`,
              }} />
            )}

            {/* VHS overlay — three stacked layers */}
            <div
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}
            >
              {/* Scanlines */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
              }} />

              {/* Tracking line */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '2px',
                background: 'rgba(255,255,255,0.05)',
                animation: 'vhsTracking 7s linear infinite',
              }} />

              {/* Grain flicker */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: "url('/textures/grain.png')",
                opacity: 0.045,
                animation: 'vhsGrainFlicker 0.15s steps(1) infinite',
              }} />
            </div>

            {/* Affirmation + rewrite control — immersive only */}
            {!isEnergise && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                zIndex: 20,
                opacity: transitioning ? 0 : 1,
                transition: `opacity ${fadeDuration}ms ease`,
              }}>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(14px,2.5vw,28px)',
                  color: 'var(--warm-white)',
                  textAlign: 'center',
                  textShadow: '0 2px 24px rgba(0,0,0,0.65)',
                  maxWidth: '600px',
                  lineHeight: 1.4,
                }}>
                  {frame?.affirmation}
                </p>

                <button
                  onClick={onSwap}
                  style={{
                    ...controlsStyle,
                    marginTop: '18px',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 300,
                    fontSize: '12px',
                    color: 'rgba(245,237,224,0.7)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    letterSpacing: '0.04em',
                  }}
                >
                  rewrite
                </button>
              </div>
            )}

          </div>{/* /screen */}

          {/* TV nameplate */}
          <div style={{
            textAlign: 'center',
            padding: '10px 0 12px',
            fontFamily: 'var(--font-accent)',
            fontStyle: 'italic',
            fontSize: '11px',
            color: 'rgba(255,220,180,0.22)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}>
            ofcourse
          </div>

          {/* TV legs */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 18%',
          }}>
            <div style={{ width: '14px', height: '32px', background: '#130C05', borderRadius: '0 0 6px 6px', boxShadow: '0 6px 12px rgba(26,16,8,0.25)' }} />
            <div style={{ width: '14px', height: '32px', background: '#130C05', borderRadius: '0 0 6px 6px', boxShadow: '0 6px 12px rgba(26,16,8,0.25)' }} />
          </div>

        </div>{/* /TV body */}
      </div>{/* /TV assembly */}

      {/* Controls — below TV, fade with idle */}
      <div style={{
        ...controlsStyle,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
      }}>
        <button
          onClick={onEditBoard}
          style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 300,
            fontSize: '12px',
            color: 'var(--blush)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            letterSpacing: '0.04em',
          }}
        >
          edit board
        </button>
        <button
          onClick={onChangeTrack}
          style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 300,
            fontSize: '12px',
            color: 'var(--blush)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            letterSpacing: '0.04em',
          }}
        >
          change track
        </button>
        <button
          onClick={onSave}
          style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 300,
            fontSize: '12px',
            color: 'var(--blush)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            letterSpacing: '0.04em',
          }}
        >
          save your mind movie
        </button>
      </div>

    </div>
  )
}
