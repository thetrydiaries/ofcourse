export default function Landing({ onBegin }) {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '40px',
      background: 'var(--cream)',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontStyle: 'italic',
        fontSize: 'clamp(36px, 5vw, 56px)',
        color: 'var(--burgundy)',
        fontWeight: 400,
        lineHeight: 1.1,
      }}>
        Of Course
      </h1>

      <p style={{
        fontFamily: 'var(--font-heading)',
        fontStyle: 'italic',
        fontSize: 'clamp(14px, 2vw, 18px)',
        color: 'var(--blush)',
        fontWeight: 400,
        textAlign: 'center',
      }}>
        because of course this is already your life
      </p>

      <button
        onClick={onBegin}
        style={{
          marginTop: '24px',
          background: 'var(--burgundy)',
          color: 'var(--cream)',
          fontFamily: 'var(--font-ui)',
          fontWeight: 300,
          fontSize: '15px',
          padding: '14px 40px',
          borderRadius: '999px',
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity var(--t-med)',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        begin →
      </button>
    </div>
  )
}
