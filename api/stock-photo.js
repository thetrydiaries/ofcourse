export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { area } = req.query
  if (!area) return res.status(400).json({ error: 'Missing area parameter' })

  const query = encodeURIComponent(area)
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=3&orientation=landscape`,
    { headers: { Authorization: process.env.PEXELS_API_KEY } }
  )

  if (!response.ok) return res.status(response.status).json({ error: 'Pexels API error' })

  const data = await response.json()
  res.status(200).json({ url: data.photos?.[0]?.src?.large ?? null })
}
