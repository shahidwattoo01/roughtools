/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CSSProperties } from 'react'

export type ProgressCallback = (pct: number, message: string) => void

let cachedLib: any = null

async function loadLib(): Promise<any> {
  if (cachedLib) return cachedLib

  // esm.sh correctly serves WASM-dependent packages as ESM.
  // jsdelivr +esm transform fails for packages with WASM, so we use direct dist paths as fallback.
  const CDN_URLS = [
    'https://esm.sh/@imgly/background-removal@1.4.5',
    'https://unpkg.com/@imgly/background-removal@1.4.5/dist/browser.mjs',
    'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/browser.mjs',
  ]

  const dynamicImport = new Function('url', 'return import(url)')
  let lastErr: Error | null = null

  for (const url of CDN_URLS) {
    try {
      const mod = await dynamicImport(url)
      if (mod?.removeBackground) {
        cachedLib = mod
        return cachedLib
      }
    } catch (e) {
      lastErr = e as Error
    }
  }

  throw new Error(
    `Could not load the background-removal AI library. ` +
    `Check your internet connection and try again. ` +
    (lastErr?.message ? `(${lastErr.message})` : '')
  )
}

export async function removeBackground(
  imageBlob: Blob,
  onProgress?: ProgressCallback
): Promise<Blob> {
  const lib = await loadLib()
  return lib.removeBackground(imageBlob, {
    publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/',
    model: 'medium',
    progress: (key: string, current: number, total: number) => {
      if (total > 0 && onProgress) {
        const pct = Math.round((current / total) * 100)
        const msg = key.includes('fetch')
          ? 'Downloading AI model (~40 MB, cached after first use)…'
          : key.includes('inference')
          ? 'Removing background…'
          : 'Analysing image…'
        onProgress(pct, msg)
      }
    },
  })
}

export function checkerboardStyle(): CSSProperties {
  return {
    backgroundImage: [
      'linear-gradient(45deg, #ccc 25%, transparent 25%)',
      'linear-gradient(-45deg, #ccc 25%, transparent 25%)',
      'linear-gradient(45deg, transparent 75%, #ccc 75%)',
      'linear-gradient(-45deg, transparent 75%, #ccc 75%)',
    ].join(', '),
    backgroundSize: '16px 16px',
    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
    backgroundColor: '#ffffff',
  }
}

export function boxBlur(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  radius: number
): Uint8ClampedArray {
  const temp = new Uint8ClampedArray(data.length)
  const result = new Uint8ClampedArray(data.length)

  const blurH = (src: Uint8ClampedArray, dst: Uint8ClampedArray, r: number) => {
    const scale = 1 / (2 * r + 1)
    for (let y = 0; y < h; y++) {
      let rs = 0, gs = 0, bs = 0
      for (let k = -r; k <= r; k++) {
        const x = Math.max(0, Math.min(w - 1, k))
        const i = (y * w + x) * 4
        rs += src[i]; gs += src[i + 1]; bs += src[i + 2]
      }
      for (let x = 0; x < w; x++) {
        const o = (y * w + x) * 4
        dst[o] = rs * scale; dst[o + 1] = gs * scale; dst[o + 2] = bs * scale; dst[o + 3] = src[o + 3]
        const le = Math.max(0, x - r), en = Math.min(w - 1, x + r + 1)
        const li = (y * w + le) * 4, ei = (y * w + en) * 4
        rs += src[ei] - src[li]; gs += src[ei + 1] - src[li + 1]; bs += src[ei + 2] - src[li + 2]
      }
    }
  }

  const blurV = (src: Uint8ClampedArray, dst: Uint8ClampedArray, r: number) => {
    const scale = 1 / (2 * r + 1)
    for (let x = 0; x < w; x++) {
      let rs = 0, gs = 0, bs = 0
      for (let k = -r; k <= r; k++) {
        const y = Math.max(0, Math.min(h - 1, k))
        const i = (y * w + x) * 4
        rs += src[i]; gs += src[i + 1]; bs += src[i + 2]
      }
      for (let y = 0; y < h; y++) {
        const o = (y * w + x) * 4
        dst[o] = rs * scale; dst[o + 1] = gs * scale; dst[o + 2] = bs * scale; dst[o + 3] = src[o + 3]
        const le = Math.max(0, y - r), en = Math.min(h - 1, y + r + 1)
        const li = (le * w + x) * 4, ei = (en * w + x) * 4
        rs += src[ei] - src[li]; gs += src[ei + 1] - src[li + 1]; bs += src[ei + 2] - src[li + 2]
      }
    }
  }

  blurH(data, temp, radius)
  blurV(temp, result, radius)
  blurH(result, temp, radius)
  blurV(temp, result, radius)
  blurH(result, temp, radius)
  blurV(temp, result, radius)
  return result
}

export async function blobToImageElement(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob)
  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = url
  })
  return img
}

export function clamp(v: number): number {
  return Math.max(0, Math.min(255, v))
}
