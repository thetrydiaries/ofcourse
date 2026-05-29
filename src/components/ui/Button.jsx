export default function Button({ variant = 'primary', children, onClick, disabled }) {
  const base = {
    fontFamily: 'var(--font-accent)',
    fontWeight: 500,
    fontSize: '12px',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    borderRadius: '999px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.35 : 1,
    transition: 'opacity var(--t-med)',
    lineHeight: 1,
  }

  const styles = variant === 'primary'
    ? { ...base, background: 'var(--gh-ink)', color: 'var(--gh-cream)', padding: '14px 40px' }
    : { ...base, background: 'transparent', border: '1px solid var(--gh-kicker)', color: 'var(--gh-kicker)', padding: '13px 32px' }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={styles}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.65' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1' }}
    >
      {children}
    </button>
  )
}
