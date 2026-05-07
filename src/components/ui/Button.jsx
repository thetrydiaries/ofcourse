export default function Button({ variant = 'primary', children, onClick, disabled }) {
  const base = {
    fontFamily: 'var(--font-ui)',
    fontWeight: 300,
    fontSize: '15px',
    borderRadius: '999px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'opacity var(--t-med)',
    lineHeight: 1,
  }

  const styles = variant === 'primary'
    ? { ...base, background: 'var(--burgundy)', color: 'var(--cream)', padding: '14px 40px' }
    : { ...base, background: 'transparent', border: '1px solid var(--blush)', color: 'var(--blush)', padding: '13px 32px' }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={styles}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.75' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1' }}
    >
      {children}
    </button>
  )
}
