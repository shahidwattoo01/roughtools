'use client'
import React, { useState, useRef } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background: '#13132a', border: '1px solid rgba(167,139,250,0.15)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }

// Lanczos kernel
function lanczos(x: number, a: number = 3): number {
  if (x === 0) return 1
  if (Math.abs(x) >= a) return 0
  const px = Math.PI * x
  return (a * Math.sin(px) * Math.sin(px / a)) / (px * px)
}

async function lanczosUpscale(
  img: HTMLImageElement,
  scale: number,
  onProgress: (pct: number) => void
): Promise<string> {
  const sw = img.naturalWidth, sh = img.naturalHeight
  const dw = sw * scale, dh = sh * scale
  const TILE = 256

  // Read source
  const src = document.createElement('canvas')
  src.width = sw; src.height = sh
  src.getContext('2d')!.drawImage(img, 0, 0)
  const srcData = src.getContext('2d')!.getImageData(0, 0, sw, sh).data

  const dst = document.createElement('canvas')
  dst.width = dw; dst.height = dh
  const dstCtx = dst.getContext('2d')!
  const dstData = new Uint8ClampedArray(dw * dh * 4)

  const a = 3 // Lanczos-3

  let tilesProcessed = 0
  const totalTiles = Math.ceil(dh / TILE)

  const processRow = (dy: number) => {
    const sy = (dy + 0.5) / scale - 0.5
    const fy = Math.floor(sy)
    for (let dx = 0; dx < dw; dx++) {
      const sx = (dx + 0.5) / scale - 0.5
      const fx = Math.floor(sx)
      let rs = 0, gs = 0, bs = 0, ws = 0
      for (let ky = fy - a + 1; ky <= fy + a; ky++) {
        const wy = lanczos(sy - ky)
        if (wy === 0) continue
        const cky = Math.max(0, Math.min(sh - 1, ky))
        for (let kx = fx - a + 1; kx <= fx + a; kx++) {
          const wx = lanczos(sx - kx)
          if (wx === 0) continue
          const ckx = Math.max(0, Math.min(sw - 1, kx))
          const si = (cky * sw + ckx) * 4
          const w = wy * wx
          rs += srcData[si] * w; gs += srcData[si+1] * w; bs += srcData[si+2] * w; ws += w
        }
      }
      const di = (dy * dw + dx) * 4
      dstData[di]   = ws ? Math.max(0, Math.min(255, Math.round(rs / ws))) : srcData[(fy * sw + fx) * 4]
      dstData[di+1] = ws ? Math.max(0, Math.min(255, Math.round(gs / ws))) : srcData[(fy * sw + fx) * 4 + 1]
      dstData[di+2] = ws ? Math.max(0, Math.min(255, Math.round(bs / ws))) : srcData[(fy * sw + fx) * 4 + 2]
      dstData[di+3] = 255
    }
  }

  // Process in async tile batches to keep UI responsive
  await new Promise<void>(resolve => {
    let tileStart = 0
    const processTile = () => {
      const tileEnd = Math.min(tileStart + TILE, dh)
      for (let dy = tileStart; dy < tileEnd; dy++) processRow(dy)
      tilesProcessed++
      onProgress(Math.round((tilesProcessed / totalTiles) * 100))
      tileStart = tileEnd
      if (tileStart < dh) requestAnimationFrame(processTile)
      else resolve()
    }
    requestAnimationFrame(processTile)
  })

  dstCtx.putImageData(new ImageData(dstData, dw, dh), 0, 0)
  return dst.toDataURL('image/png')
}

export default function ImageUpscalerClient() {
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [scale, setScale] = useState(2)
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f)
    setPreview(url); setResult(''); setProgress(0)
    const img = new Image()
    img.onload = () => { imgRef.current = img; setOrigW(img.width); setOrigH(img.height) }
    img.src = url
  }

  const upscale = async () => {
    if (!imgRef.current) return
    // Warn if output would be very large
    const outW = origW * scale, outH = origH * scale
    if (outW * outH > 4000 * 4000) {
      if (!window.confirm(`Output will be ${outW}×${outH}px which may be slow. Continue?`)) return
    }
    setProcessing(true); setProgress(0); setResult('')
    try {
      const dataUrl = await lanczosUpscale(imgRef.current, scale, pct => setProgress(pct))
      setResult(dataUrl)
    } catch {
      setResult('')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div>
      <div style={{ padding: '10px 14px', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 8, marginBottom: 16, fontSize: 12, color: '#c4c4e0' }}>
        Uses Lanczos-3 resampling — high-quality browser-based upscaling that preserves sharp edges. For AI-powered super-resolution, dedicated tools give better results on heavily compressed images.
      </div>

      <div style={card}>
        <div onClick={() => inputRef.current?.click()} style={{ border: '2px dashed rgba(167,139,250,0.3)', borderRadius: 10, padding: '32px', textAlign: 'center', cursor: 'pointer' }}>
          {preview
            ? <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 250, borderRadius: 6 }} />
            : <><div style={{ fontSize: 40, marginBottom: 8 }}>🔭</div><div style={{ color: '#888', fontSize: 14 }}>Upload image to upscale</div></>
          }
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
        {origW > 0 && <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>Original: {origW}×{origH}px</div>}
      </div>

      {preview && (
        <div style={card}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: 8 }}>Upscale Factor</label>
          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            {[2, 4].map(s => (
              <button key={s} onClick={() => setScale(s)} style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid rgba(124,58,237,0.3)', background: scale === s ? 'rgba(124,58,237,0.35)' : 'transparent', color: '#a78bfa', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>
                {s}×
              </button>
            ))}
          </div>
          {origW > 0 && <div style={{ fontSize: 12, color: '#888' }}>Output: {origW * scale}×{origH * scale}px</div>}
        </div>
      )}

      {processing && (
        <div style={card}>
          <div style={{ fontSize: 14, color: 'var(--brand-2)', marginBottom: 10, fontWeight: 600 }}>Upscaling with Lanczos-3… {progress}%</div>
          <div style={{ background: '#0d0d1f', borderRadius: 8, overflow: 'hidden', height: 10 }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#7c3aed,#ec4899)', width: `${progress}%`, transition: 'width 0.2s', borderRadius: 8 }} />
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>Processing tile {Math.ceil(progress / 100 * Math.ceil((origH * scale) / 256))} of {Math.ceil((origH * scale) / 256)}</div>
        </div>
      )}

      {preview && !processing && (
        <button onClick={upscale} style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 24 }}>
          Upscale {scale}× with Lanczos
        </button>
      )}

      {result && (
        <div>
          <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 10, padding: '10px 16px', marginBottom: 12, textAlign: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#4ade80' }}>✅ Upscaled {scale}× → {origW * scale}×{origH * scale}px</span>
          </div>
          <BeforeAfterSlider
            beforeSrc={preview}
            afterSrc={result}
            beforeLabel={`Original (${origW}×${origH})`}
            afterLabel={`${scale}× Upscaled`}
          />
          <div style={{ ...card, marginTop: 12 }}>
            <a href={result} download={`upscaled-${scale}x.png`} style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', borderRadius: 6, padding: '10px 16px', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'block', textAlign: 'center' }}>
              Download PNG
            </a>
          </div>
          <SmartRecommendation currentSlug="image-upscaler" />
        </div>
      )}
    </div>
  )
}
