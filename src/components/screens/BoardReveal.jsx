import Button from '../ui/Button.jsx'

export default function BoardReveal({ areas, onEdit, onBuild }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      gap: '48px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 'var(--max-w)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}>
        {areas.map((area, i) => (
          <Cell key={area.id} area={area} index={i} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="ghost" onClick={onEdit}>edit board</Button>
        <Button onClick={onBuild}>build my mind movie →</Button>
      </div>
    </div>
  )
}

function Cell({ area, index }) {
  const photo = area.photos?.[0]

  return (
    <div style={{
      aspectRatio: '4/3',
      overflow: 'hidden',
      borderRadius: '8px',
      position: 'relative',
      background: area.skipped ? '#C4B4AE' : 'var(--rose)',
      animation: `fadeIn 400ms ease both`,
      animationDelay: `${index * 150}ms`,
    }}>
      {photo && !area.skipped && (
        <img
          src={photo}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}

      {area.skipped && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            fontSize: '12px',
            color: 'var(--warm-white)',
            opacity: 0.6,
          }}>
            skipped
          </span>
        </div>
      )}

      <span style={{
        position: 'absolute',
        bottom: '8px',
        left: '10px',
        fontFamily: 'var(--font-accent)',
        fontStyle: 'italic',
        fontSize: '10px',
        color: 'var(--warm-white)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        textShadow: '0 1px 3px rgba(0,0,0,0.4)',
      }}>
        {area.label}
      </span>
    </div>
  )
}
