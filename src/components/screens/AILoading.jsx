export default function AILoading({ error, onRetry }) {
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
      {error ? (
        <>
          <p style={{
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            fontSize: 'clamp(18px, 2.5vw, 26px)',
            color: 'var(--burgundy)',
            opacity: 0.9,
            textAlign: 'center',
          }}>
            something went wrong
          </p>
          <p style={{
            fontFamily: 'var(--font-body, sans-serif)',
            fontSize: '14px',
            color: 'var(--burgundy)',
            opacity: 0.6,
            textAlign: 'center',
            maxWidth: '400px',
            background: 'rgba(0,0,0,0.05)',
            padding: '12px 16px',
            borderRadius: '8px',
          }}>
            {error}
          </p>
          <button
            onClick={onRetry}
            style={{
              fontFamily: 'var(--font-body, sans-serif)',
              fontSize: '14px',
              color: 'var(--burgundy)',
              background: 'transparent',
              border: '1px solid var(--burgundy)',
              borderRadius: '4px',
              padding: '10px 24px',
              cursor: 'pointer',
              opacity: 0.8,
            }}
          >
            try again
          </button>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
