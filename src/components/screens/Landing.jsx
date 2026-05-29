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

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        marginTop: '8px',
        maxWidth: '360px',
      }}>
        <div style={{
          width: '32px',
          height: '1px',
          background: 'var(--rose)',
          opacity: 0.5,
          marginBottom: '4px',
        }} />
        {[
          'set aside about 20 minutes',
          'you\'ll move through 8 areas of your life',
          'have a few images ready — your camera roll, screenshots, anything that captures the feeling',
        ].map((line, i) => (
          <p key={i} style={{
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            fontSize: 'clamp(12px, 1.4vw, 14px)',
            color: 'var(--blush)',
            opacity: 0.7,
            textAlign: 'center',
            lineHeight: 1.5,
            margin: 0,
          }}>
            {line}
          </p>
        ))}
      </div>

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
