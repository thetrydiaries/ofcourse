export function generateFilename(userName) {
  const date = new Date()
  const month = date.toLocaleString('default', { month: 'long' }).toLowerCase()
  const year = date.getFullYear()

  const sanitized = (userName || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (!sanitized) return `of-course-${month}-${year}.mp4`
  return `${sanitized}-of-course-${month}-${year}.mp4`
}
