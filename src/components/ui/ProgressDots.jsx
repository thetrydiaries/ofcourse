export default function ProgressDots({ current, total = 8 }) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: '24px',
            height: '8px',
            borderRadius: '999px',
            background: i === current ? 'var(--burgundy)' : 'transparent',
            border: i === current ? 'none' : '1px solid var(--blush)',
            transition: 'background var(--t-med)',
          }}
        />
      ))}
    </div>
  )
}
