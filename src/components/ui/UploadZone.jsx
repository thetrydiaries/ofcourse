import { useRef, useState } from 'react'
import { fetchSuggestedPhotos } from '../../utils/pexels.js'

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

const skeletonStyle = {
  aspectRatio: '4/3',
  borderRadius: '8px',
  background: 'linear-gradient(90deg, rgba(42,26,20,0.06) 25%, rgba(42,26,20,0.12) 50%, rgba(42,26,20,0.06) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.4s ease-in-out infinite',
}

export default function UploadZone({ photos = [], onChange, areaId }) {
  const inputRef = useRef(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

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

  const handleBrowse = async () => {
    const opening = !panelOpen
    setPanelOpen(opening)
    if (opening && suggestions.length === 0) {
      setLoading(true)
      const results = await fetchSuggestedPhotos(areaId)
      setSuggestions(results)
      setLoading(false)
    }
  }

  const handleSuggestedSelect = (url) => {
    const alreadySelected = photos.includes(url)
    if (alreadySelected) {
      onChange(photos.filter(p => p !== url))
    } else if (photos.length < 3) {
      onChange([...photos, url])
    }
  }

  const bgColour = areaColours[areaId] ?? 'rgba(232,196,184,0.08)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Upload zone */}
      <div
        onClick={() => photos.length < 3 && inputRef.current.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: '1.5px dashed var(--blush)',
          borderRadius: '16px',
          background: bgColour,
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

      {/* Browse link */}
      <button
        onClick={handleBrowse}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: 'none',
          padding: '10px 2px 0',
          cursor: 'pointer',
          fontFamily: 'var(--font-ui)',
          fontWeight: 300,
          fontSize: '13px',
          color: 'var(--blush)',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          opacity: 0.8,
        }}
      >
        {panelOpen ? 'hide suggested images' : 'or browse suggested images →'}
      </button>

      {/* Suggestions panel */}
      {panelOpen && (
        <div style={{
          marginTop: '12px',
          border: '1px solid rgba(154,124,77,0.25)',
          borderRadius: '12px',
          padding: '14px',
          background: bgColour,
          animation: 'fadeIn 200ms ease both',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
          }}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={skeletonStyle} />
                ))
              : suggestions.map(photo => {
                  const selected = photos.includes(photo.url)
                  const maxed = !selected && photos.length >= 3
                  return (
                    <div
                      key={photo.id}
                      onClick={() => !maxed && handleSuggestedSelect(photo.url)}
                      style={{
                        aspectRatio: '4/3',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: maxed ? 'not-allowed' : 'pointer',
                        outline: selected
                          ? '2.5px solid var(--burgundy)'
                          : '2.5px solid transparent',
                        outlineOffset: '2px',
                        opacity: maxed ? 0.35 : 1,
                        transition: 'outline-color 150ms ease, opacity 150ms ease',
                      }}
                    >
                      <img
                        src={photo.url}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )
                })
            }
          </div>
          {!loading && suggestions.length === 0 && (
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              color: 'var(--blush)',
              textAlign: 'center',
              padding: '16px 0',
            }}>
              no suggestions available right now
            </p>
          )}
        </div>
      )}

    </div>
  )
}
