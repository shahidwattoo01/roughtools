'use client'
import React, { useState, useRef, useCallback } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'
import { clamp } from '@/lib/removeBg'

const card: React.CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }
const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', marginBottom: 6 }
const btn: React.CSSProperties = { background: 'linear-gradient(135deg,var(--brand-2),var(--brand))', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 16 }

interface Preset { name: string; label: string; r: number; g: number; b: number; hueShift: number; satBoost: number }

const PRESETS: Preset[] = [
  { name: 'warm',    label: '☀️ Warm',    r: 255, g: 180, b: 60,  hueShift: 15,  satBoost: 0.3  },
  { name: 'cool',    label: '❄️ Cool',    r: 60,  g: 140, b: 255, hueShift: -20, satBoost: 0.2  },
  { name: 'natural', label: '🌿 Natural', r: 120, g: 200, b: 100, hueShift: 5,   satBoost: 0.15 },
  { name: 'vivid',   label: '🎨 Vivid',   r: 220, g: 60,  b: 180, hueShift: 30,  satBoost: 0.5  },
  { name: 'sepia',   label: '📷 Sepia',   r: 200, g: 130, b: 60,  hueShift: 0,   satBoost: 0    },
]

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [h * 360, s, l]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(1, s))
  l = Math.max(0, Math.min(1, l))
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x } else if (h < 120) { r = x; g = c } else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c } else if (h < 300) { r = x; b = c } else { r = c; b = x }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
}

function applyColorize(img: HTMLImageElement, preset: Preset, renderFactor: number, customColor: string | null, customStrength: number): string {
  const w = img.naturalWidth, h = img.naturalHeight
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  const id = ctx.getImageData(0, 0, w, h)
  const d = id.data
  const intensity = renderFactor / 10

  let tr: number, tg: number, tb: number, hShift: number, satB: number
  if (customColor) {
    tr = parseInt(customColor.slice(1, 3), 16)
    tg = parseInt(customColor.slice(3, 5), 16)
    tb = parseInt(customColor.slice(5, 7), 16)
    hShift = 0; satB = customStrength / 100
  } else {
    tr = preset.r; tg = preset.g; tb = preset.b
    hShift = preset.hueShift; satB = preset.satBoost
  }

  for (let i = 0; i < d.length; i += 4) {
    const [h2, s, l] = rgbToHsl(d[i], d[i + 1], d[i + 2])
    // Hue shift + saturation boost
    const newH = h2 + hShift * intensity
    const newS = Math.min(1, s + satB * intensity)
    const [r2, g2, b2] = hslToRgb(newH, newS, l)
    // Blend with tint colour based on luminance preservation
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
    const tintStrength = intensity * 0.4
    d[i]     = clamp(r2 * (1 - tintStrength) + tr * (lum / 255) * tintStrength)
    d[i + 1] = clamp(g2 * (1 - tintStrength) + tg * (lum / 255) * tintStrength)
    d[i + 2] = clamp(b2 * (1 - tintStrength) + tb * (lum / 255) * tintStrength)
  }

  ctx.putImageData(id, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.95)
}

export default function ImageColorizerClient() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [preset, setPreset] = useState<Preset>(PRESETS[0])
  const [useCustom, setUseCustom] = useState(false)
  const [customColor, setCustomColor] = useState('#7c3aed')
  const [customStrength, setCustomStrength] = useState(50)
  const [renderFactor, setRenderFactor] = useState(7)
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
    setResult(applyColorize(imgObj, preset, renderFactor, useCustom ? customColor : null, customStrength))
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
            : <><div style={{ fontSize: 36 }}>🖼️</div><div style={{ fontWeight: 700, color: 'var(--fg)', marginTop: 8 }}>Drop image or click to upload</div></>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {imgObj && (
        <div style={card}>
          <label style={lbl}>Color Mood Preset</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {PRESETS.map(p => (
              <button key={p.name} onClick={() => { setPreset(p); setUseCustom(false) }}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(124,58,237,0.3)', background: (!useCustom && preset.name === p.name) ? 'rgba(124,58,237,0.35)' : 'transparent', color: 'var(--brand-2)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ ...lbl, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} style={{ accentColor: '#7c3aed' }} />
              <span>Use custom tint colour</span>
            </label>
            {useCustom && (
              <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
                <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)} style={{ width: '100%', height: 44, borderRadius: 8, border: 'none', cursor: 'pointer', padding: 2 }} />
                <div>
                  <label style={lbl}>Tint Strength: {customStrength}%</label>
                  <input type="range" min="0" max="100" value={customStrength} onChange={e => setCustomStrength(Number(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed' }} />
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Render Factor: {renderFactor}/10 <span style={{ fontWeight: 400, color: 'var(--fg-3)', fontSize: 12 }}>(intensity)</span></label>
            <input type="range" min="1" max="10" value={renderFactor} onChange={e => setRenderFactor(Number(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>
              <span>Subtle</span><span>Vivid</span>
            </div>
          </div>

          <button style={btn} onClick={apply}>Apply Colorize Effect</button>
        </div>
      )}

      {result && (
        <div>
          <BeforeAfterSlider beforeSrc={preview} afterSrc={result} beforeLabel="Original" afterLabel={useCustom ? 'Custom Tint' : preset.label} />
          <div style={{ ...card, marginTop: 12 }}>
            <a href={result} download="colorized.jpg" style={{ display: 'block', textAlign: 'center', color: 'var(--brand-2)', background: 'rgba(124,58,237,0.15)', borderRadius: 10, padding: '12px', textDecoration: 'none', fontWeight: 700 }}>
              Download
            </a>
          </div>
          <SmartRecommendation currentSlug="image-colorizer" />
        </div>
      )}
    </div>
  )
}
