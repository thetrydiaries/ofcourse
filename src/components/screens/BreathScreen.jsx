import { useState, useEffect } from 'react'
import Button from '../ui/Button.jsx'

// inhale 4s → hold 1.5s → exhale 6s → done
// Echo ring fades in from t=2s into inhale, fades out during exhale

const PHASE_LABELS = {
  ready: 'take a breath. let yourself arrive.',
  inhale: 'inhale',
  hold: 'hold',
  exhale: 'exhale',
}

function getCircleStyle(phase) {
  // Base element is 60px. Scale(4) = 240px visual diameter.
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

    // Small delay so the initial scale transition actually fires
    const t0 = setTimeout(() => setPhase('inhale'), 50)
    const t1 = setTimeout(() => setEchoVisible(true), 2050)       // 2s into inhale
    const t2 = setTimeout(() => setPhase('hold'), 4050)           // inhale done
    const t3 = setTimeout(() => {                                  // exhale starts
      setPhase('exhale')
      setEchoVisible(false)
    }, 5550)
    const t4 = setTimeout(onDone, 11550)                          // exhale done

    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout)
  }, [onDone, prefersReducedMotion])

  const { scale, transition, animation } = getCircleStyle(phase)

  // Echo ring transition: slow fade-out during exhale, normal fade-in otherwise
  const echoTransition = `opacity ${phase === 'exhale' ? '6s' : '1.5s'} ease`

  if (prefersReducedMotion) {
    return (
      <div style={containerStyle}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 300, height: 300 }}>
          <div style={{ ...echoRingBase, opacity: 0.2 }} />
          <div style={{ ...circleBase, transform: 'scale(2.5)', opacity: 0.7 }} />
        </div>
        <p style={labelStyle}>
          take a breath. let yourself arrive.
        </p>
        <Button onClick={onDone}>begin</Button>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {/* Circle + echo ring in a shared 300px container so they stay co-centred */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 300, height: 300 }}>
        {/* Echo ring: 300px, fades in at t=2s, fades out during exhale */}
        <div style={{
          ...echoRingBase,
          opacity: echoVisible ? 0.28 : 0,
          transition: echoTransition,
        }} />

        {/* Main breath circle: 60px base, scaled by CSS transform */}
        <div style={{
          ...circleBase,
          transform: `scale(${scale})`,
          transition,
          animation,
        }} />
      </div>

      {/* Label: re-keyed on phase so it fades in fresh each time */}
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
  background: 'radial-gradient(circle, rgba(212,165,154,0.35) 0%, rgba(212,165,154,0.08) 100%)',
  border: '1px solid rgba(245,237,224,0.35)',
}

const echoRingBase = {
  position: 'absolute',
  width: 300,
  height: 300,
  borderRadius: '50%',
  border: '1px solid rgba(245,237,224,0.25)',
  background: 'transparent',
}

const labelStyle = {
  fontFamily: 'var(--font-heading)',
  fontStyle: 'italic',
  fontSize: '16px',
  color: 'var(--warm-white)',
  letterSpacing: '0.08em',
  textAlign: 'center',
  opacity: 0.7,
  animation: 'fadeIn 400ms ease both',
}
