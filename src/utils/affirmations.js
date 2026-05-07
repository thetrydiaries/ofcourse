export async function fetchAffirmations(areas, userName, intention) {
  const res = await fetch('/api/affirmations', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ areas, userName, intention }),
  })

  if (!res.ok) throw new Error(`Affirmations API error: ${res.status}`)
  return res.json()
}
