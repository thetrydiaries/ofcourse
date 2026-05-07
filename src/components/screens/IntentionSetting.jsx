import { useState } from 'react'
import Button from '../ui/Button.jsx'

function FieldLabel({ children }) {
  return (
    <label style={{
      fontFamily: 'var(--font-accent)',
      fontStyle: 'italic',
      fontSize: '12px',
      color: 'var(--blush)',
      letterSpacing: '0.06em',
      display: 'block',
      marginBottom: '8px',
    }}>
      {children}
    </label>
  )
}

export default function IntentionSetting({ userName: initName = '', intention: initIntention = '', onNext }) {
  const [name, setName] = useState(initName)
  const [intention, setIntention] = useState(initIntention)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
    }}>
      <div style={{ width: '100%', maxWidth: 'var(--max-w)', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <FieldLabel>your name</FieldLabel>
            <input
              className="field"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="sarah"
              autoFocus
            />
          </div>

          <div>
            <FieldLabel>what are you building, doing, or becoming in the next 12 months?</FieldLabel>
            <input
              className="field"
              value={intention}
              onChange={e => setIntention(e.target.value)}
              placeholder="building a creative practice that sustains me"
            />
          </div>
        </div>

        <div>
          <Button
            disabled={!name.trim()}
            onClick={() => onNext(name.trim(), intention.trim())}
          >
            next →
          </Button>
        </div>
      </div>
    </div>
  )
}
