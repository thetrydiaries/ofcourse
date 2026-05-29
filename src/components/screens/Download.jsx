import { useState } from 'react'
import { exportVideo } from '../../utils/videoExport.js'
import { generateFilename } from '../../utils/filename.js'

export default function Download({ areas, selectedTrack, videoMode, userName }) {
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const photos = areas.map((a) => a.photos?.[0] ?? a.stockPhoto ?? null)

  async function handleDownload() {
    if (exporting) return
    setExporting(true)
    setProgress(0)
    try {
      const blob = await exportVideo(areas, selectedTrack, setProgress, videoMode)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = generateFilename(userName)
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gh-cream)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '56px 64px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Blurred photo grid — background atmosphere */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          opacity: 0.12,
          filter: 'blur(24px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {photos.map((src, i) => (
          <div
            key={i}
            style={{
              background: src
                ? `url(${src}) center/cover no-repeat`
                : 'var(--gh-kicker)',
            }}
          />
        ))}
      </div>

      {/* End-screen wash */}
      <div className="a-endwash" style={{ zIndex: 1 }} />

      {/* Vignette */}
      <div className="a-vig" style={{ zIndex: 2 }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        width: '100%',
        maxWidth: 'var(--max-w)',
        textAlign: 'center',
      }}>
        {/* Kicker */}
        <span style={{
          fontFamily: 'var(--font-accent)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.26em',
          fontSize: '12px',
          color: 'var(--gh-kicker)',
        }}>
          Your film · {areas.length} scenes
        </span>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 300,
          fontSize: 'clamp(36px, 4vw, 56px)',
          letterSpacing: '-0.01em',
          lineHeight: 1.08,
          color: 'var(--gh-ink)',
          margin: 0,
        }}>
          Stay a little longer?
        </h2>

        {/* Links row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          fontFamily: 'var(--font-heading)',
          fontWeight: 300,
          fontSize: '22px',
          color: 'var(--gh-link-ink)',
        }}>
          <button
            onClick={handleDownload}
            disabled={exporting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              borderBottom: '1px solid var(--gh-link-rule)',
              paddingBottom: '3px',
              background: 'none',
              borderBottom: '1px solid var(--gh-link-rule)',
              paddingBottom: '3px',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              color: 'inherit',
              cursor: exporting ? 'default' : 'pointer',
              opacity: exporting ? 0.4 : 1,
              transition: 'opacity var(--t-med)',
            }}
          >
            <span style={{
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '5px 0 5px 9px',
              borderColor: 'transparent transparent transparent var(--gh-link-ink)',
              opacity: 0.7,
            }} />
            download
          </button>

          <span style={{ color: 'var(--gh-sep)' }}>·</span>

          <span style={{
            fontStyle: 'italic',
            opacity: 0.55,
            fontSize: '18px',
          }}>
            watch it every morning when you wake up,<br />and every night before you sleep.
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '1px',
          background: 'rgba(154,124,77,.25)',
          position: 'relative',
          overflow: 'hidden',
          opacity: exporting ? 1 : 0,
          transition: 'opacity var(--t-slow)',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '1px',
            width: `${progress}%`,
            background: 'var(--gh-ink)',
            transition: 'width 200ms ease',
          }} />
        </div>
      </div>
    </div>
  )
}
