import { useState, useEffect } from 'react'
import { useIdleTimer } from '../../hooks/useIdleTimer.js'

export default function Playback({ areas, onSwap, onChangeTrack, onSave }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const { idle, reset: resetIdle } = useIdleTimer(2000)

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(i => (i + 1) % areas.length)
        setTransitioning(false)
      }, 600)
    }, 9000)
    return () => clearInterval(timer)
  }, [areas.length])

  const area = areas[currentIndex]
  const photo = area.photos?.[0] || area.stockPhoto
  const isEven = currentIndex % 2 === 0

  // Asymmetric fade: controls disappear slowly (600ms), reappear quickly (300ms)
  const controlsStyle = {
    opacity: idle ? 0 : 1,
    transition: `opacity ${idle ? '600ms' : '300ms'} ease`,
    pointerEvents: idle ? 'none' : 'auto',
  }

  return (
    <div
      onMouseMove={resetIdle}
      onTouchStart={resetIdle}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        overflow: 'hidden',
        cursor: idle ? 'none' : 'default',
      }}
    >
      {/* Photo + Ken Burns */}
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
            transition: 'opacity 600ms ease',
            animation: `${isEven ? 'kenBurnsEven' : 'kenBurnsOdd'} 9s ease-out forwards`,
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
          transition: 'opacity 600ms ease',
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

      {/* Affirmation + swap control */}
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
        transition: 'opacity 600ms ease',
      }}>
        <p style={{
          fontFamily: 'var(--font-heading)',
          fontStyle: 'italic',
          fontSize: 'clamp(20px,3vw,32px)',
          color: 'var(--warm-white)',
          textAlign: 'center',
          textShadow: '0 2px 24px rgba(0,0,0,0.65)',
          maxWidth: '600px',
          lineHeight: 1.4,
        }}>
          {area.affirmation}
        </p>

        {/* Swap control — fades with idle */}
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
          swap
        </button>
      </div>

      {/* Bottom controls — fade with idle */}
      <div style={{
        ...controlsStyle,
        position: 'absolute',
        bottom: '32px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        zIndex: 20,
      }}>
        <button
          onClick={onChangeTrack}
          style={{
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
          change track
        </button>
        <button
          onClick={onSave}
          style={{
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
          save your mind movie
        </button>
      </div>
    </div>
  )
}
