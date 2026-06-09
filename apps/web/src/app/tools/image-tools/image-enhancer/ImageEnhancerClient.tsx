'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'
import { clamp } from '@/lib/removeBg'

const card: React.CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }
const lbl: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', marginBottom: 6 }
const inp: React.CSSProperties = { width: '100%', accentColor: '#7c3aed' }

interface Adj { brightness: number; contrast: number; saturation: number; sharpness: number; noise: number; vibrance: number }
const DEFAULTS: Adj = { brightness: 0, contrast: 0, saturation: 0, sharpness: 0, noise: 0, vibrance: 0 }

function applyAll(img: HTMLImageElement, adj: Adj, autoLevels: boolean): string {
  const w = img.naturalWidth, h = img.naturalHeight
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  const id = ctx.getImageData(0, 0, w, h)
  const d = id.data

  // --- Noise reduction (3×3 averaging) ---
  let src = d
  if (adj.noise > 0) {
    const nr = Math.round(adj.noise / 100 * 3)
    const tmp = new Uint8ClampedArray(d.length)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let rs = 0, gs = 0, bs = 0, cnt = 0
        for (let dy = -nr; dy <= nr; dy++) {
          for (let dx = -nr; dx <= nr; dx++) {
            const nx = Math.max(0, Math.min(w - 1, x + dx))
            const ny = Math.max(0, Math.min(h - 1, y + dy))
            const i = (ny * w + nx) * 4
            rs += d[i]; gs += d[i + 1]; bs += d[i + 2]; cnt++
          }
        }
        const o = (y * w + x) * 4
        tmp[o] = rs / cnt; tmp[o + 1] = gs / cnt; tmp[o + 2] = bs / cnt; tmp[o + 3] = d[o + 3]
      }
    }
    src = tmp
  }

  // --- Auto levels (per-channel histogram stretch) ---
  let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0
  if (autoLevels) {
    for (let i = 0; i < src.length; i += 4) {
      minR = Math.min(minR, src[i]);   maxR = Math.max(maxR, src[i])
      minG = Math.min(minG, src[i+1]); maxG = Math.max(maxG, src[i+1])
      minB = Math.min(minB, src[i+2]); maxB = Math.max(maxB, src[i+2])
    }
  }
  const rangeR = autoLevels && maxR > minR ? maxR - minR : 255
  const rangeG = autoLevels && maxG > minG ? maxG - minG : 255
  const rangeB = autoLevels && maxB > minB ? maxB - minB : 255

  const brightF = (adj.brightness / 100) * 128
  const contF = (adj.contrast + 100) / 100
  const satF = (adj.saturation + 100) / 100

  for (let i = 0; i < d.length; i += 4) {
    let r = autoLevels ? ((src[i]   - minR) / rangeR) * 255 : src[i]
    let g = autoLevels ? ((src[i+1] - minG) / rangeG) * 255 : src[i+1]
    let b = autoLevels ? ((src[i+2] - minB) / rangeB) * 255 : src[i+2]

    // brightness
    r += brightF; g += brightF; b += brightF
    // contrast
    r = (r - 128) * contF + 128
    g = (g - 128) * contF + 128
    b = (b - 128) * contF + 128
    // saturation
    const gray = 0.299 * r + 0.587 * g + 0.114 * b
    r = gray + (r - gray) * satF
    g = gray + (g - gray) * satF
    b = gray + (b - gray) * satF
    // vibrance: boost less-saturated colours more
    if (adj.vibrance !== 0) {
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
      const sat = mx > 0 ? (mx - mn) / mx : 0
      const vf = 1 + (adj.vibrance / 100) * (1 - sat)
      const vg = 0.299 * r + 0.587 * g + 0.114 * b
      r = vg + (r - vg) * vf
      g = vg + (g - vg) * vf
      b = vg + (b - vg) * vf
    }

    d[i] = clamp(r); d[i + 1] = clamp(g); d[i + 2] = clamp(b)
  }

  // --- Sharpness (unsharp mask) ---
  if (adj.sharpness > 0) {
    const strength = (adj.sharpness / 100) * 2.5
    const orig = new Uint8ClampedArray(d)
    const kernel = [-strength, -strength, -strength, -strength, 1 + 8 * strength, -strength, -strength, -strength, -strength]
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0
          for (let ky = -1; ky <= 1; ky++) for (let kx = -1; kx <= 1; kx++) {
            sum += orig[((y + ky) * w + (x + kx)) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)]
          }
          d[(y * w + x) * 4 + c] = clamp(sum)
        }
      }
    }
  }

  ctx.putImageData(id, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.95)
}

const SLIDERS: { key: keyof Adj; label: string; min: number; max: number; step: number; unit?: string }[] = [
  { key: 'brightness', label: 'Brightness', min: -100, max: 100, step: 1 },
  { key: 'contrast',   label: 'Contrast',   min: -100, max: 100, step: 1 },
  { key: 'saturation', label: 'Saturation', min: -100, max: 100, step: 1 },
  { key: 'vibrance',   label: 'Vibrance',   min: -100, max: 100, step: 1 },
  { key: 'sharpness',  label: 'Sharpness',  min: 0,    max: 100, step: 1 },
  { key: 'noise',      label: 'Noise Reduction', min: 0, max: 100, step: 1 },
]

export default function ImageEnhancerClient() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [adj, setAdj] = useState<Adj>(DEFAULTS)
  const [autoLevels, setAutoLevels] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f)
    setPreview(url); setResult('')
    const img = new window.Image()
    img.onload = () => setImgObj(img)
    img.src = url
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, []) // eslint-disable-line

  useEffect(() => {
    if (imgObj) setResult(applyAll(imgObj, adj, autoLevels))
  }, [adj, imgObj, autoLevels]) // eslint-disable-line

  const resetAll = () => { setAdj(DEFAULTS); setAutoLevels(false) }
  const resetKey = (k: keyof Adj) => setAdj(prev => ({ ...prev, [k]: 0 }))

  const applyAutoLevels = () => setAutoLevels(v => !v)

  return (
    <div>
      <div style={card}>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border: `2px dashed ${dragging ? '#7c3aed' : 'rgba(167,139,250,0.3)'}`, borderRadius: 10, padding: '32px', textAlign: 'center', cursor: 'pointer' }}
        >
          {preview
            ? <img src={preview} alt="original" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8 }} />
            : <><div style={{ fontSize: 36 }}>🖼️</div><div style={{ fontWeight: 700, color: 'var(--fg)', marginTop: 8 }}>Drop image or click to upload</div></>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {imgObj && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ color: 'var(--fg)', fontWeight: 700, fontSize: 15 }}>Adjustments</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={applyAutoLevels} style={{ background: autoLevels ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.1)', color: 'var(--brand-2)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                Auto Levels
              </button>
              <button onClick={resetAll} style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--brand-2)', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12 }}>Reset All</button>
            </div>
          </div>

          {SLIDERS.map(({ key, label, min, max, step }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <div style={{ ...lbl }}>
                <span>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--fg)', minWidth: 36, textAlign: 'right' }}>
                    {adj[key] > 0 ? '+' : ''}{adj[key]}
                  </span>
                  {adj[key] !== 0 && (
                    <button onClick={() => resetKey(key)} style={{ background: 'none', border: 'none', color: '#6b6b8d', cursor: 'pointer', fontSize: 11, padding: '0 2px' }} title="Reset">✕</button>
                  )}
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={adj[key]}
                onChange={e => setAdj(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                style={inp} />
            </div>
          ))}
        </div>
      )}

      {result && (
        <div>
          <BeforeAfterSlider beforeSrc={preview} afterSrc={result} beforeLabel="Original" afterLabel="Enhanced" />
          <div style={{ ...card, marginTop: 12 }}>
            <a href={result} download="enhanced.jpg" style={{ display: 'block', textAlign: 'center', color: 'var(--brand-2)', background: 'rgba(124,58,237,0.15)', borderRadius: 10, padding: '12px', textDecoration: 'none', fontWeight: 700 }}>
              Download Enhanced Image
            </a>
          </div>
          <SmartRecommendation currentSlug="image-enhancer" />
        </div>
      )}
    </div>
  )
}
