export default function AILoading() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '48px',
      padding: '40px',
    }}>
      <p style={{
        fontFamily: 'var(--font-heading)',
        fontStyle: 'italic',
        fontSize: 'clamp(22px, 3vw, 32px)',
        color: 'var(--burgundy)',
        opacity: 0.7,
      }}>
        making your mind movie...
      </p>

      <div style={{
        width: '100%',
        maxWidth: 'var(--max-w)',
        height: '1px',
        background: 'var(--rose)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '1px',
          background: 'var(--burgundy)',
          animation: 'loadLine 4s ease both',
        }} />
      </div>
    </div>
  )
}
