import { useState, useEffect } from 'react'
import Button from '../ui/Button.jsx'

const PHASE_LABELS = {
  ready: 'take a breath. let yourself arrive.',
  inhale: 'inhale',
  hold: 'hold',
  exhale: 'exhale',
}

function getCircleStyle(phase) {
  const scale = (phase === 'inhale' || phase === 'hold') ? 4 : 1
  const transition =
    phase === 'inhale' ? 'transform 4s cubic-bezier(0.4,0,0.2,1)' :
    phase === 'exhale' ? 'transform 6s cubic-bezier(0.4,0,0.6,1)' :
    'none'
  const animation = phase === 'hold' ? 'holdPulse 0.8s ease-in-out infinite' : 'none'

  return { scale, transition, animation }
}

export default function BreathScreen({ onDone }) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [phase, setPhase] = useState('ready')
  const [echoVisible, setEchoVisible] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion) return

    const t0 = setTimeout(() => setPhase('inhale'), 50)
    const t1 = setTimeout(() => setEchoVisible(true), 2050)
    const t2 = setTimeout(() => setPhase('hold'), 4050)
    const t3 = setTimeout(() => {
      setPhase('exhale')
      setEchoVisible(false)
    }, 5550)
    const t4 = setTimeout(onDone, 11550)

    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout)
  }, [onDone, prefersReducedMotion])

  const { scale, transition, animation } = getCircleStyle(phase)
  const echoTransition = `opacity ${phase === 'exhale' ? '6s' : '1.5s'} ease`

  if (prefersReducedMotion) {
    return (
      <div style={containerStyle}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 300, height: 300 }}>
          <div style={{ ...echoRingBase, opacity: 0.2 }} />
          <div style={{ ...circleBase, transform: 'scale(2.5)', opacity: 0.7 }} />
        </div>
        <p style={labelStyle}>take a breath. let yourself arrive.</p>
        <Button onClick={onDone}>begin</Button>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 300, height: 300 }}>
        <div style={{
          ...echoRingBase,
          opacity: echoVisible ? 0.25 : 0,
          transition: echoTransition,
        }} />
        <div style={{
          ...circleBase,
          transform: `scale(${scale})`,
          transition,
          animation,
        }} />
      </div>

      <p key={phase} style={labelStyle}>
        {PHASE_LABELS[phase]}
      </p>
    </div>
  )
}

const containerStyle = {
  height: '100vh',
  background: 'var(--near-black)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '40px',
}

const circleBase = {
  position: 'absolute',
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(196,154,100,0.3) 0%, rgba(196,154,100,0.07) 100%)',
  border: '1px solid rgba(253,246,232,0.3)',
}

const echoRingBase = {
  position: 'absolute',
  width: 300,
  height: 300,
  borderRadius: '50%',
  border: '1px solid rgba(253,246,232,0.22)',
  background: 'transparent',
}

const labelStyle = {
  fontFamily: 'var(--font-heading)',
  fontStyle: 'italic',
  fontWeight: 300,
  fontSize: '16px',
  color: 'var(--warm-white)',
  letterSpacing: '0.06em',
  textAlign: 'center',
  opacity: 0.65,
  animation: 'fadeIn 400ms ease both',
}
