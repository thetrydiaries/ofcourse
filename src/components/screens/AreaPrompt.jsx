import { useState } from 'react'
import Button from '../ui/Button.jsx'
import ProgressDots from '../ui/ProgressDots.jsx'
import UploadZone from '../ui/UploadZone.jsx'

export default function AreaPrompt({ area, areaIndex, onNext, onSkip }) {
  const [photos, setPhotos] = useState([])
  const isFinal = areaIndex === 7

  const handleNext = () => {
    onNext(photos)
  }

  const handleSkip = () => {
    onSkip()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '40px',
      paddingTop: '60px',
    }}>
      <div style={{ width: '100%', maxWidth: 'var(--max-w)', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        <ProgressDots current={areaIndex} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <span style={{
            fontFamily: 'var(--font-accent)',
            fontStyle: 'italic',
            fontSize: '12px',
            color: 'var(--blush)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            {area.number} — {area.label}
          </span>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            fontSize: 'clamp(28px, 4vw, 44px)',
            color: 'var(--burgundy)',
            fontWeight: 400,
            lineHeight: 1.2,
          }}>
            {area.question}
          </h2>

          <p style={{
            fontFamily: 'var(--font-heading)',
            fontStyle: 'normal',
            fontSize: '19px',
            lineHeight: 1.75,
            color: 'var(--burgundy)',
            opacity: 0.6,
          }}>
            {area.body}
          </p>

          <p style={{
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--blush)',
          }}>
            — {area.cue}
          </p>
        </div>

        <UploadZone photos={photos} onChange={setPhotos} />

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button variant="ghost" onClick={handleSkip}>skip this one</Button>
          <Button onClick={handleNext}>
            {isFinal ? 'see my board →' : 'next area →'}
          </Button>
        </div>

      </div>
    </div>
  )
}
