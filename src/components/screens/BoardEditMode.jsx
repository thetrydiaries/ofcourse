import { useState, useRef } from 'react'
import Button from '../ui/Button.jsx'

export default function BoardEditMode({ areas: initialAreas, onDone }) {
  const [areas, setAreas] = useState(initialAreas)
  const [draggedIdx, setDraggedIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)
  const fileInputRefs = useRef({})

  const handleDragStart = (e, idx) => {
    setDraggedIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, idx) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (idx !== draggedIdx) setOverIdx(idx)
  }

  const handleDrop = (e, idx) => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === idx) return
    setAreas(prev => {
      const next = [...prev]
      const temp = next[draggedIdx]
      next[draggedIdx] = next[idx]
      next[idx] = temp
      return next
    })
    setDraggedIdx(null)
    setOverIdx(null)
  }

  const handleDragEnd = () => {
    setDraggedIdx(null)
    setOverIdx(null)
  }

  const handlePhotoSwap = (idx, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAreas(prev => prev.map((a, i) =>
      i === idx ? { ...a, photos: [url, ...a.photos.slice(1)], skipped: false } : a
    ))
    e.target.value = ''
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      gap: '40px',
    }}>
      <p style={{
        fontFamily: 'var(--font-heading)',
        fontStyle: 'italic',
        fontSize: '18px',
        color: 'var(--burgundy)',
        opacity: 0.55,
        textAlign: 'center',
      }}>
        drag to reorder · click to swap photo
      </p>

      <div style={{
        width: '100%',
        maxWidth: 'var(--max-w)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}>
        {areas.map((area, i) => {
          const photo = area.photos?.[0]
          const isDragging = draggedIdx === i
          const isOver = overIdx === i

          return (
            <div
              key={area.id}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              onDragEnd={handleDragEnd}
              onClick={() => fileInputRefs.current[i]?.click()}
              className={`edit-cell${isOver ? ' edit-cell--over' : ''}`}
              style={{
                aspectRatio: '4/3',
                overflow: 'hidden',
                borderRadius: '8px',
                position: 'relative',
                background: area.skipped ? '#C4B4AE' : 'var(--rose)',
                cursor: isDragging ? 'grabbing' : 'grab',
                opacity: isDragging ? 0.35 : 1,
                outline: isOver ? '2px solid var(--burgundy)' : '2px solid transparent',
                transition: 'opacity 150ms, outline 100ms',
                userSelect: 'none',
              }}
            >
              <input
                ref={el => { fileInputRefs.current[i] = el }}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handlePhotoSwap(i, e)}
              />

              {photo && !area.skipped && (
                <img
                  src={photo}
                  alt=""
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', display: 'block',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {area.skipped && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-heading)', fontStyle: 'italic',
                    fontSize: '12px', color: 'var(--warm-white)', opacity: 0.6,
                    pointerEvents: 'none',
                  }}>
                    skipped
                  </span>
                </div>
              )}

              <span style={{
                position: 'absolute', bottom: '8px', left: '10px',
                fontFamily: 'var(--font-accent)', fontStyle: 'italic',
                fontSize: '10px', color: 'var(--warm-white)',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                pointerEvents: 'none',
              }}>
                {area.label}
              </span>

              <div className="edit-cell-overlay">
                <span style={{
                  fontFamily: 'var(--font-ui)', fontWeight: 300,
                  fontSize: '11px', color: 'var(--warm-white)',
                  letterSpacing: '0.05em', pointerEvents: 'none',
                }}>
                  swap photo
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <Button onClick={() => onDone(areas)}>done editing</Button>
    </div>
  )
}
