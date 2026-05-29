import { useState } from 'react'
import Button from '../ui/Button.jsx'

export default function AffirmationReview({ areas, onNext }) {
  const [affirmations, setAffirmations] = useState(areas.map(a => a.affirmation))
  const [editing, setEditing] = useState(null)

  const handleSwap = (i) => setEditing(i)

  const handleEditDone = (i, value) => {
    setAffirmations(prev => prev.map((a, idx) => idx === i ? value : a))
    setEditing(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      padding: '60px 40px',
    }}>
      <div style={{ width: '100%', maxWidth: 'var(--max-w)', display: 'flex', flexDirection: 'column', gap: '0' }}>

        {areas.map((area, i) => (
          <AffirmationCard
            key={area.id}
            area={area}
            affirmation={affirmations[i]}
            isEditing={editing === i}
            onSwap={() => handleSwap(i)}
            onEditDone={(val) => handleEditDone(i, val)}
          />
        ))}

        <div style={{ marginTop: '48px' }}>
          <Button onClick={() => onNext(affirmations)}>
            preview my mind movie →
          </Button>
        </div>
      </div>
    </div>
  )
}

function AffirmationCard({ area, affirmation, isEditing, onSwap, onEditDone }) {
  const [draft, setDraft] = useState(affirmation)

  return (
    <div style={{
      padding: '32px 0',
      borderBottom: '1px solid var(--gh-link-rule)',
      position: 'relative',
    }}>
      <span style={{
        fontFamily: 'var(--font-accent)',
        fontWeight: 500,
        fontSize: '12px',
        color: 'var(--gh-kicker)',
        textTransform: 'uppercase',
        letterSpacing: '0.26em',
        display: 'block',
        marginBottom: '12px',
      }}>
        {area.number} — {area.label}
      </span>

      {isEditing ? (
        <input
          className="field"
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => onEditDone(draft)}
          onKeyDown={e => e.key === 'Enter' && onEditDone(draft)}
          style={{ fontSize: '22px' }}
        />
      ) : (
        <p style={{
          fontFamily: 'var(--font-heading)',
          fontStyle: 'italic',
          fontSize: '22px',
          color: 'var(--burgundy)',
          fontWeight: 400,
          lineHeight: 1.4,
          paddingRight: '60px',
        }}>
          {affirmation}
        </p>
      )}

      {!isEditing && (
        <button
          onClick={onSwap}
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '0',
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-ui)',
            fontWeight: 300,
            fontSize: '12px',
            color: 'var(--blush)',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          rewrite
        </button>
      )}
    </div>
  )
}
