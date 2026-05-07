import { useRef } from 'react'

const ROTATIONS = [-2.5, 1.8, -1.2]

const areaColours = {
  health:        'rgba(218, 180, 145, 0.15)',
  relationships: 'rgba(232, 196, 184, 0.15)',
  career:        'rgba(200, 170, 220, 0.15)',
  finances:      'rgba(210, 200, 170, 0.15)',
  growth:        'rgba(220, 190, 200, 0.15)',
  joy:           'rgba(190, 220, 210, 0.15)',
  home:          'rgba(210, 190, 170, 0.15)',
  purpose:       'rgba(160, 150, 200, 0.15)',
}

export default function UploadZone({ photos = [], onChange, areaId }) {
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    const remaining = 3 - photos.length
    if (remaining <= 0) return
    const added = Array.from(files)
      .slice(0, remaining)
      .map(f => URL.createObjectURL(f))
    onChange([...photos, ...added])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      onClick={() => photos.length < 3 && inputRef.current.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        border: '1.5px dashed var(--blush)',
        borderRadius: '16px',
        background: areaColours[areaId] ?? 'rgba(232,196,184,0.08)',
        minHeight: '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: photos.length < 3 ? 'pointer' : 'default',
        padding: '24px',
        position: 'relative',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />

      {photos.length === 0 ? (
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 300,
          fontSize: '14px',
          color: 'var(--blush)',
        }}>
          + add a photo or two
        </span>
      ) : (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {photos.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '4px',
                transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`,
                boxShadow: '0 2px 8px rgba(42,26,20,0.18)',
              }}
            />
          ))}
          {photos.length < 3 && (
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 300,
              fontSize: '13px',
              color: 'var(--blush)',
            }}>
              + add more
            </span>
          )}
        </div>
      )}
    </div>
  )
}
