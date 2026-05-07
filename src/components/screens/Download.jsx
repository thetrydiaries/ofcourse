import { useState } from 'react'
import { exportVideo } from '../../utils/videoExport.js'
import { generateFilename } from '../../utils/filename.js'

export default function Download({ areas, selectedTrack, userName }) {
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const photos = areas.map((a) => a.photos?.[0] ?? a.stockPhoto ?? null)

  async function handleDownload() {
    if (exporting) return
    setExporting(true)
    setProgress(0)
    try {
      const blob = await exportVideo(areas, selectedTrack, setProgress)
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
      background: 'var(--cream)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blurred photo grid — purely background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          opacity: 0.1,
          filter: 'blur(20px)',
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
                : 'var(--rose)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        width: '100%',
        maxWidth: 'var(--max-w)',
      }}>
        <button
          onClick={handleDownload}
          disabled={exporting}
          style={{
            background: 'var(--burgundy)',
            color: 'var(--cream)',
            border: 'none',
            borderRadius: '999px',
            padding: '14px 40px',
            fontFamily: 'var(--font-ui)',
            fontWeight: 300,
            fontSize: '15px',
            cursor: exporting ? 'default' : 'pointer',
            opacity: exporting ? 0.4 : 1,
            transition: 'opacity var(--t-med)',
            letterSpacing: '0.02em',
          }}
        >
          download your mind movie
        </button>

        {/* Progress bar — visible only while exporting */}
        <div style={{
          width: '100%',
          height: '1px',
          background: 'var(--rose)',
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
            background: 'var(--burgundy)',
            transition: 'width 200ms ease',
          }} />
        </div>

        <p style={{
          fontFamily: 'var(--font-heading)',
          fontStyle: 'italic',
          fontSize: '18px',
          color: 'var(--burgundy)',
          opacity: 0.45,
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          watch it every morning when you wake up, and every night before you sleep.
        </p>
      </div>
    </div>
  )
}
