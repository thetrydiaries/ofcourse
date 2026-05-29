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
    ctx.fillStyle = '#1a0f06'
    ctx.fillRect(0, 0, 1920, 1080)
    canvas.toBlob(
      (blob) => blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf))),
      'image/jpeg',
      0.85
    )
  })
}

export async function exportVideo(areas, track, onProgress, mode = 'immersive') {
  await load()

  ffmpeg.on('progress', ({ progress }) => {
    onProgress(Math.round(Math.min(progress * 100, 99)))
  })

  let frames
  let framerate
  let vf

  if (mode === 'immersive') {
    frames = areas.map(a => a?.photos?.[0] ?? a?.stockPhoto ?? null)
    framerate = '1/9'
    vf =
      "scale=1920:1080:force_original_aspect_ratio=decrease," +
      "pad=1920:1080:(ow-iw)/2:(oh-ih)/2," +
      "zoompan=z='min(zoom+0.001,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=270"
  } else {
    frames = areas.flatMap(a => {
      const photos = a?.photos?.filter(Boolean)
      return photos?.length ? photos : [a?.stockPhoto ?? null]
    })
    framerate = '1/2'
    vf =
      "scale=1920:1080:force_original_aspect_ratio=decrease," +
      "pad=1920:1080:(ow-iw)/2:(oh-ih)/2"
  }

  for (let i = 0; i < frames.length; i++) {
    const data = frames[i] ? await fetchFile(frames[i]) : await blackFrameBytes()
    await ffmpeg.writeFile(`img${i}.jpg`, data)
  }

  await ffmpeg.writeFile('track.mp3', await fetchFile(
    track.url.startsWith('/') ? `${window.location.origin}${track.url}` : track.url
  ))

  // -stream_loop -1 loops the audio so it covers the full video duration.
  // We omit -shortest because zoompan prevents FFmpeg from knowing the video
  // duration upfront, which caused -shortest to terminate audio immediately.
  // Instead, the video stream ends naturally when the image sequence runs out.
  await ffmpeg.exec([
    '-framerate', framerate,
    '-i', 'img%d.jpg',
    '-stream_loop', '-1',
    '-i', 'track.mp3',
    '-map', '0:v',
    '-map', '1:a',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '44100',
    '-ac', '2',
    '-vf', vf,
    'output.mp4',
  ])

  const data = await ffmpeg.readFile('output.mp4')
  onProgress(100)
  return new Blob([data.buffer], { type: 'video/mp4' })
}
