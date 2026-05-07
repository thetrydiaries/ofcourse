import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

const ffmpeg = new FFmpeg()
let loaded = false

async function load() {
  if (loaded) return
  const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
  await ffmpeg.load({
    coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
  })
  loaded = true
}

async function blackFrameBytes() {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1920
    canvas.height = 1080
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0D0A08'
    ctx.fillRect(0, 0, 1920, 1080)
    canvas.toBlob(
      (blob) => blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf))),
      'image/jpeg',
      0.85
    )
  })
}

export async function exportVideo(areas, track, onProgress) {
  await load()

  ffmpeg.on('progress', ({ progress }) => {
    onProgress(Math.round(Math.min(progress * 100, 99)))
  })

  for (let i = 0; i < 8; i++) {
    const area = areas[i]
    const src = area?.photos?.[0] ?? area?.stockPhoto ?? null
    const data = src ? await fetchFile(src) : await blackFrameBytes()
    await ffmpeg.writeFile(`img${i}.jpg`, data)
  }

  await ffmpeg.writeFile('track.mp3', await fetchFile(track.url))

  await ffmpeg.exec([
    '-framerate', '1/9',
    '-i', 'img%d.jpg',
    '-i', 'track.mp3',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-shortest',
    '-vf',
    "scale=1920:1080:force_original_aspect_ratio=decrease," +
    "pad=1920:1080:(ow-iw)/2:(oh-ih)/2," +
    "zoompan=z='min(zoom+0.001,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=270",
    'output.mp4',
  ])

  const data = await ffmpeg.readFile('output.mp4')
  onProgress(100)
  return new Blob([data.buffer], { type: 'video/mp4' })
}
