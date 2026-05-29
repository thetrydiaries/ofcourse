export default function ProgressDots({ current, total = 8 }) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            height: '6px',
            width: i === current ? '28px' : '6px',
            borderRadius: '3px',
            background: i === current
              ? 'var(--gh-ink)'
              : 'transparent',
            border: i === current ? 'none' : '1px solid rgba(154,124,77,.45)',
            transition: 'width var(--t-med), background var(--t-med)',
          }}
        />
      ))}
    </div>
  )
}
