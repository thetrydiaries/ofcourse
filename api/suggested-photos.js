const QUERIES = {
  health:        'morning light wellness calm body',
  relationships: 'friends warmth together intimate moment',
  career:        'creative workspace focus craft studio',
  finances:      'travel abundance light open space',
  growth:        'reading quiet solitude learning journal',
  joy:           'play delight outdoor colour movement',
  home:          'interior soft light cosy corner home',
  purpose:       'hands making meaningful work community',
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { area } = req.query
  if (!area) return res.status(400).json({ error: 'Missing area parameter' })

  const query = QUERIES[area] ?? area
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape`,
    { headers: { Authorization: process.env.PEXELS_API_KEY } }
  )

  if (!response.ok) return res.status(response.status).json({ error: 'Pexels API error' })

  const data = await response.json()
  const photos = (data.photos ?? []).map(p => ({
    id: p.id,
    url: p.src?.large ?? p.src?.medium ?? null,
  })).filter(p => p.url)

  res.status(200).json({ photos })
}
