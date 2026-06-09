'use client'
import React, { useState, useRef, useCallback } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'
import { clamp, boxBlur } from '@/lib/removeBg'

const card: React.CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }
const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', marginBottom: 6 }
const btn: React.CSSProperties = { background: 'linear-gradient(135deg,var(--brand-2),var(--brand))', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 16 }

type Style = 'pencil' | 'edges' | 'cartoon' | 'watercolor' | 'comic'

const STYLES: { id: Style; label: string; icon: string; desc: string }[] = [
  { id: 'pencil',    label: 'Pencil Sketch', icon: '✏️', desc: 'Classic grayscale pencil drawing' },
  { id: 'edges',     label: 'Edge Detection', icon: '🔲', desc: 'Sobel operator line art' },
  { id: 'cartoon',   label: 'Cartoon',        icon: '🎨', desc: 'Posterized flat colours + bold edges' },
  { id: 'watercolor',label: 'Watercolor',     icon: '🎭', desc: 'Soft blended painterly look' },
  { id: 'comic',     label: 'Comic Book',     icon: '💥', desc: 'Halftone dots + thick outlines' },
]

function sobelEdge(d: Uint8ClampedArray, w: number, h: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(d.length)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4
      const gx = (
        -d[((y-1)*w+x-1)*4] - 2*d[(y*w+x-1)*4] - d[((y+1)*w+x-1)*4] +
         d[((y-1)*w+x+1)*4] + 2*d[(y*w+x+1)*4] + d[((y+1)*w+x+1)*4]
      )
      const gy = (
        -d[((y-1)*w+x-1)*4] - 2*d[((y-1)*w+x)*4] - d[((y-1)*w+x+1)*4] +
         d[((y+1)*w+x-1)*4] + 2*d[((y+1)*w+x)*4] + d[((y+1)*w+x+1)*4]
      )
      const mag = clamp(Math.sqrt(gx*gx + gy*gy))
      out[idx] = out[idx+1] = out[idx+2] = mag
      out[idx+3] = 255
    }
  }
  return out
}

function toGray(d: Uint8ClampedArray): Uint8ClampedArray {
  const g = new Uint8ClampedArray(d.length)
  for (let i = 0; i < d.length; i += 4) {
    const v = 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2]
    g[i] = g[i+1] = g[i+2] = v; g[i+3] = 255
  }
  return g
}

function applyStyle(img: HTMLImageElement, style: Style, intensity: number): string {
  const MAX = 900
  const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight))
  const w = Math.floor(img.naturalWidth * scale), h = Math.floor(img.naturalHeight * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, w, h)
  const id = ctx.getImageData(0, 0, w, h)
  const d = new Uint8ClampedArray(id.data)
  const intF = intensity / 100

  if (style === 'pencil') {
    const gray = toGray(d)
    const inv = new Uint8ClampedArray(gray.length)
    for (let i = 0; i < gray.length; i += 4) {
      inv[i] = inv[i+1] = inv[i+2] = 255 - gray[i]; inv[i+3] = 255
    }
    const blurR = Math.round(4 + intF * 14) // 4–18
    const blurred = boxBlur(inv, w, h, blurR)
    for (let i = 0; i < d.length; i += 4) {
      const base = gray[i]
      const blend = blurred[i]
      const dodge = blend >= 255 ? 255 : Math.min(255, (base * 255) / (255 - blend + 1))
      id.data[i] = id.data[i+1] = id.data[i+2] = clamp(dodge); id.data[i+3] = 255
    }

  } else if (style === 'edges') {
    const gray = toGray(d)
    const edges = sobelEdge(gray, w, h)
    const threshold = 255 - intF * 200
    for (let i = 0; i < id.data.length; i += 4) {
      const v = edges[i] > threshold ? edges[i] : 0
      id.data[i] = id.data[i+1] = id.data[i+2] = v; id.data[i+3] = 255
    }

  } else if (style === 'cartoon') {
    const levels = Math.round(10 - intF * 7) // 3–10 colour levels
    const step = 255 / levels
    const gray = toGray(d)
    const edges = sobelEdge(gray, w, h)
    const edgeThreshold = 255 - intF * 180
    for (let i = 0; i < id.data.length; i += 4) {
      if (edges[i] > edgeThreshold) {
        id.data[i] = id.data[i+1] = id.data[i+2] = 0
      } else {
        id.data[i]   = Math.round(Math.round(d[i]   / step) * step)
        id.data[i+1] = Math.round(Math.round(d[i+1] / step) * step)
        id.data[i+2] = Math.round(Math.round(d[i+2] / step) * step)
      }
    }

  } else if (style === 'watercolor') {
    const blurR = Math.round(2 + intF * 5) // 2–7
    const blurred = boxBlur(d, w, h, blurR)
    const gray = toGray(d)
    const edges = sobelEdge(gray, w, h)
    for (let i = 0; i < id.data.length; i += 4) {
      const edgeMix = Math.min(1, edges[i] / 150 * intF)
      id.data[i]   = clamp(blurred[i]   * (1 - edgeMix * 0.4))
      id.data[i+1] = clamp(blurred[i+1] * (1 - edgeMix * 0.4))
      id.data[i+2] = clamp(blurred[i+2] * (1 - edgeMix * 0.4))
    }

  } else if (style === 'comic') {
    // Posterize
    const levels = 4
    const step = 255 / levels
    const post = new Uint8ClampedArray(d.length)
    for (let i = 0; i < d.length; i += 4) {
      post[i]   = Math.round(Math.round(d[i]   / step) * step)
      post[i+1] = Math.round(Math.round(d[i+1] / step) * step)
      post[i+2] = Math.round(Math.round(d[i+2] / step) * step)
      post[i+3] = 255
    }
    // Halftone: for each 4×4 block, shade with dot
    const dotSize = 4
    for (let by = 0; by < h; by += dotSize) {
      for (let bx = 0; bx < w; bx += dotSize) {
        let lum = 0, cnt = 0
        for (let dy = 0; dy < dotSize && by+dy < h; dy++) {
          for (let dx = 0; dx < dotSize && bx+dx < w; dx++) {
            const i = ((by+dy)*w+(bx+dx))*4
            lum += 0.299*post[i] + 0.587*post[i+1] + 0.114*post[i+2]; cnt++
          }
        }
        const avgLum = cnt ? lum/cnt : 128
        const radius = (1 - avgLum/255) * dotSize/2 * intF
        for (let dy = 0; dy < dotSize && by+dy < h; dy++) {
          for (let dx = 0; dx < dotSize && bx+dx < w; dx++) {
            const i = ((by+dy)*w+(bx+dx))*4
            const dist = Math.sqrt((dx+0.5-dotSize/2)**2 + (dy+0.5-dotSize/2)**2)
            if (dist < radius) {
              id.data[i] = id.data[i+1] = id.data[i+2] = 0
            } else {
              id.data[i] = post[i]; id.data[i+1] = post[i+1]; id.data[i+2] = post[i+2]
            }
            id.data[i+3] = 255
          }
        }
      }
    }
    // Thick edges
    const gray = toGray(d)
    const edges = sobelEdge(gray, w, h)
    for (let i = 0; i < id.data.length; i += 4) {
      if (edges[i] > 100 * (1 - intF * 0.4)) id.data[i] = id.data[i+1] = id.data[i+2] = 0
    }
  }

  ctx.putImageData(id, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.95)
}

export default function CartoonClient() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [style, setStyle] = useState<Style>('cartoon')
  const [intensity, setIntensity] = useState(65)
  const [processing, setProcessing] = useState(false)
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

  const apply = () => {
    if (!imgObj) return
    setProcessing(true)
    setTimeout(() => {
      setResult(applyStyle(imgObj, style, intensity))
      setProcessing(false)
    }, 10)
  }

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
            : <><div style={{ fontSize: 36 }}>🎨</div><div style={{ fontWeight: 700, color: 'var(--fg)', marginTop: 8 }}>Drop image or click to upload</div></>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {imgObj && (
        <div style={card}>
          <label style={lbl}>Style</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 8, marginBottom: 16 }}>
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)}
                style={{ padding: '10px 8px', borderRadius: 10, border: `1px solid ${style === s.id ? '#7c3aed' : 'rgba(124,58,237,0.2)'}`, background: style === s.id ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.06)', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: style === s.id ? '#e0e0ff' : '#a78bfa' }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 2 }}>{s.desc}</div>
              </button>
            ))}
          </div>

          <label style={lbl}>Intensity: {intensity}%</label>
          <input type="range" min="10" max="100" value={intensity} onChange={e => setIntensity(Number(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed', marginBottom: 16 }} />

          <button style={btn} onClick={apply} disabled={processing}>
            {processing ? 'Processing…' : `Apply ${STYLES.find(s => s.id === style)?.label}`}
          </button>
        </div>
      )}

      {result && (
        <div>
          <BeforeAfterSlider beforeSrc={preview} afterSrc={result} beforeLabel="Original" afterLabel={STYLES.find(s => s.id === style)?.label ?? 'Styled'} />
          <div style={{ ...card, marginTop: 12 }}>
            <a href={result} download={`${style}-effect.jpg`} style={{ display: 'block', textAlign: 'center', color: 'var(--brand-2)', background: 'rgba(124,58,237,0.15)', borderRadius: 10, padding: '12px', textDecoration: 'none', fontWeight: 700 }}>
              Download
            </a>
          </div>
          <SmartRecommendation currentSlug="photo-to-cartoon" />
        </div>
      )}
    </div>
  )
}
