export default function Landing({ onBegin }) {
  return (
    <div
      className="grain"
      style={{
        height: '100vh',
        background: 'var(--gh-cream)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-heading)',
      }}
    >
      {/* Sun glow — top-center sunrise bloom */}
      <div style={{
        position: 'absolute',
        top: '-180px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '620px',
        height: '620px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--gh-sun), rgba(241,196,116,0) 62%)',
        filter: 'blur(8px)',
        pointerEvents: 'none',
      }} />

      {/* Vignette */}
      <div className="a-vig" />

      {/* Wordmark — top left */}
      <div style={{
        position: 'absolute',
        top: '48px',
        left: '56px',
        fontFamily: 'var(--font-accent)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.42em',
        fontSize: '13px',
        color: 'var(--gh-wordmark)',
        zIndex: 2,
      }}>
        Of Course
      </div>

      {/* Center content */}
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 64px',
        gap: '28px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Kicker */}
        <span style={{
          fontFamily: 'var(--font-accent)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.26em',
          fontSize: '12.5px',
          color: 'var(--gh-kicker)',
        }}>
          A film of the life you're walking into
        </span>

        {/* Headline */}
        <h1 style={{
          fontWeight: 300,
          fontSize: 'clamp(40px, 5.3vw, 68px)',
          lineHeight: 1.04,
          letterSpacing: '-0.01em',
          margin: 0,
          textAlign: 'center',
          color: 'var(--gh-ink)',
        }}>
          The morning<br /><em>that never has to end.</em>
        </h1>

        {/* Instructions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          marginTop: '4px',
          maxWidth: '380px',
        }}>
          <div style={{
            width: '28px',
            height: '1px',
            background: 'var(--gh-sep)',
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
              fontWeight: 300,
              fontSize: 'clamp(12px, 1.4vw, 14px)',
              color: 'var(--gh-kicker)',
              opacity: 0.7,
              textAlign: 'center',
              lineHeight: 1.5,
              margin: 0,
            }}>
              {line}
            </p>
          ))}
        </div>

        {/* Play hint */}
        <button
          onClick={onBegin}
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
            fontFamily: 'var(--font-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            fontSize: '12px',
            color: 'var(--gh-playhint)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity var(--t-med)',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <span style={{
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '6px 0 6px 10px',
            borderColor: 'transparent transparent transparent var(--gh-playhint)',
          }} />
          press play
        </button>
      </div>
    </div>
  )
}
