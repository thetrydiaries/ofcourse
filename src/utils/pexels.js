export async function fetchStockPhoto(areaLabel) {
  const res = await fetch(`/api/stock-photo?area=${encodeURIComponent(areaLabel)}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.url ?? null
}
