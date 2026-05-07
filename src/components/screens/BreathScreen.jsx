import { useEffect } from 'react'

export default function BreathScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 12500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      height: '100vh',
      background: 'var(--near-black)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '40px',
    }}>
      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        border: '1px solid rgba(245,237,224,0.25)',
        animation: 'breathPulse 4s ease-in-out infinite',
      }} />

      <p style={{
        fontFamily: 'var(--font-heading)',
        fontStyle: 'italic',
        fontSize: '16px',
        color: 'var(--warm-white)',
        letterSpacing: '0.08em',
        textAlign: 'center',
        opacity: 0.7,
      }}>
        take a breath. let yourself arrive.
      </p>
    </div>
  )
}
