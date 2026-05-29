export async function fetchAffirmations(areas, userName, intention) {
  const res = await fetch('/api/affirmations', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ areas, userName, intention }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Affirmations API error: ${res.status}`)
  }
  return res.json()
}
