export async function fetchStockPhoto(areaLabel) {
  const res = await fetch(`/api/stock-photo?area=${encodeURIComponent(areaLabel)}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.url ?? null
}

export async function fetchSuggestedPhotos(areaId) {
  const res = await fetch(`/api/suggested-photos?area=${encodeURIComponent(areaId)}`)
  if (!res.ok) return []
  const data = await res.json()
  return data.photos ?? []
}
