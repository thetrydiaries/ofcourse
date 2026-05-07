export async function fetchStockPhoto(areaLabel) {
  const query = encodeURIComponent(areaLabel)
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=3&orientation=landscape`,
    { headers: { Authorization: import.meta.env.VITE_PEXELS_API_KEY } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.photos?.[0]?.src?.large ?? null
}
