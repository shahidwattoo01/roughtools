'use client'
import { useState, useRef, useCallback } from 'react'
import type { CSSProperties } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

// ─── Style tokens ─────────────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px 28px',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const BTN_PRIMARY: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff',
  border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 15,
  fontWeight: 700, cursor: 'pointer', width: '100%',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ColorEntry { hex: string; r: number; g: number; b: number; count: number; pct: number }

// ─── Color math helpers ───────────────────────────────────────────────────────

function quantize(v: number, q: number) { return Math.round(v / q) * q }

function rgbToHsl(r: number, g: number, b: number): string {
  const nr = r / 255, ng = g / 255, nb = b / 255
  const max = Math.max(nr, ng, nb), min = Math.min(nr, ng, nb)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === nr) h = ((ng - nb) / d + (ng < nb ? 6 : 0)) / 6
    else if (max === ng) h = ((nb - nr) / d + 2) / 6
    else h = ((nr - ng) / d + 4) / 6
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

function isWarm(r: number, g: number, b: number) { return r > b }
function isLight(r: number, g: number, b: number) { return (r + g + b) / 3 > 128 }
function isSaturated(r: number, g: number, b: number) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 510
  if (max === min) return false
  const d = max - min
  return (l > 0.5 ? d / (510 - max - min) : d / (max + min)) > 0.3
}

// ─── Download palette as PNG ──────────────────────────────────────────────────

function downloadPalette(colors: ColorEntry[]) {
  const sw = 120, sh = 160, padding = 16
  const canvas = document.createElement('canvas')
  canvas.width = colors.length * sw + padding * 2
  canvas.height = sh + padding * 2
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  colors.forEach((c, i) => {
    const x = padding + i * sw
    ctx.fillStyle = c.hex
    ctx.beginPath()
    ctx.roundRect(x, padding, sw - 8, sh - 40, 8)
    ctx.fill()
    ctx.fillStyle = '#e0e0ff'
    ctx.font = 'bold 11px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(c.hex, x + (sw - 8) / 2, padding + sh - 20)
    ctx.fillStyle = '#888'
    ctx.font = '10px sans-serif'
    ctx.fillText(`${c.pct}%`, x + (sw - 8) / 2, padding + sh - 6)
  })
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = 'color-palette.png'
  a.click()
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DominantColorClient() {
  const [preview, setPreview] = useState('')
  const [colors, setColors] = useState<ColorEntry[]>([])
  const [processing, setProcessing] = useState(false)
  const [copied, setCopied] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return
    const url = URL.createObjectURL(f)
    setPreview(url)
    setColors([])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, []) // eslint-disable-line

  const extract = () => {
    if (!preview) return
    setProcessing(true)
    const img = new window.Image()
    img.onload = () => {
      const maxSide = 250
      const scale = Math.min(maxSide / img.naturalWidth, maxSide / img.naturalHeight, 1)
      const w = Math.floor(img.naturalWidth * scale)
      const h = Math.floor(img.naturalHeight * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      const d = ctx.getImageData(0, 0, w, h).data
      const colorMap = new Map<string, number>()
      const Q = 24
      for (let i = 0; i < d.length; i += 16) {
        if (d[i + 3] < 128) continue
        const r = quantize(d[i], Q)
        const g = quantize(d[i + 1], Q)
        const b = quantize(d[i + 2], Q)
        const key = `${r},${g},${b}`
        colorMap.set(key, (colorMap.get(key) || 0) + 1)
      }
      const sorted = Array.from(colorMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)
      const total = sorted.reduce((s, [, c]) => s + c, 0)
      const result: ColorEntry[] = sorted.map(([key, count]) => {
        const [r, g, b] = key.split(',').map(Number)
        const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
        return { hex, r, g, b, count, pct: Math.round(count / total * 100) }
      })
      setColors(result)
      setProcessing(false)
    }
    img.src = preview
  }

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(''), 1500)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(colors.map(c => c.hex).join(', '))
    setCopied('__all__')
    setTimeout(() => setCopied(''), 1500)
  }

  // Breakdown stats
  const warmCount = colors.reduce((s, c) => s + (isWarm(c.r, c.g, c.b) ? c.pct : 0), 0)
  const lightCount = colors.reduce((s, c) => s + (isLight(c.r, c.g, c.b) ? c.pct : 0), 0)
  const satCount = colors.reduce((s, c) => s + (isSaturated(c.r, c.g, c.b) ? c.pct : 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Upload zone ── */}
      <div style={CARD}>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{
            border: `2px dashed ${dragging ? '#7c3aed' : 'var(--line-strong)'}`,
            borderRadius: 12, padding: preview ? 12 : 40,
            textAlign: 'center', cursor: 'pointer',
            background: dragging ? 'rgba(124,58,237,0.06)' : 'transparent',
            transition: 'border-color 0.2s, background 0.2s',
          }}
        >
          {preview ? (
            <img src={preview} alt="uploaded" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8 }} />
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🎨</div>
              <div style={{ fontWeight: 700, color: 'var(--fg)', fontSize: 15 }}>Drop image or click to upload</div>
              <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 4 }}>JPEG, PNG, WebP, GIF supported</div>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />

        {preview && (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button style={BTN_PRIMARY} onClick={extract} disabled={processing}>
              {processing ? 'Analyzing pixels…' : 'Extract Dominant Colors'}
            </button>
            <button style={{ ...BTN_GHOST, whiteSpace: 'nowrap' }} onClick={() => { setPreview(''); setColors([]) }}>
              Clear
            </button>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {colors.length > 0 && (
        <>
          {/* Palette bar */}
          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ ...LABEL, marginBottom: 0 }}>Dominant Color Palette</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={BTN_GHOST} onClick={copyAll}>
                  {copied === '__all__' ? '✓ Copied' : 'Copy All HEX'}
                </button>
                <button style={BTN_GHOST} onClick={() => downloadPalette(colors)}>
                  ⬇ Download PNG
                </button>
              </div>
            </div>

            {/* Proportional bar */}
            <div style={{ height: 48, borderRadius: 10, overflow: 'hidden', display: 'flex', marginBottom: 20 }}>
              {colors.map((c, i) => (
                <div key={i} style={{ flex: c.pct, background: c.hex, position: 'relative' }}
                  title={`${c.hex} — ${c.pct}%`} />
              ))}
            </div>

            {/* Color rows */}
            {colors.map((c, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '44px 1fr auto auto',
                alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < colors.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 8, background: c.hex,
                  border: '1px solid var(--line-strong)', flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--fg)', fontSize: 14 }}>{c.hex}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>
                    rgb({c.r}, {c.g}, {c.b}) &nbsp;·&nbsp; {rgbToHsl(c.r, c.g, c.b)}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 4, marginTop: 5, width: '80%' }}>
                    <div style={{ background: c.hex, width: `${c.pct}%`, height: '100%', borderRadius: 4, minWidth: 4 }} />
                  </div>
                </div>
                <span style={{ fontSize: 13, color: 'var(--fg-3)', fontWeight: 700, minWidth: 32, textAlign: 'right' }}>{c.pct}%</span>
                <button style={{
                  ...BTN_GHOST,
                  padding: '5px 12px', fontSize: 12,
                  background: copied === c.hex ? 'rgba(16,185,129,0.2)' : 'rgba(139,92,246,0.12)',
                  borderColor: copied === c.hex ? 'rgba(16,185,129,0.4)' : 'rgba(139,92,246,0.3)',
                  color: copied === c.hex ? '#34d399' : 'var(--brand-2)',
                }} onClick={() => copy(c.hex)}>
                  {copied === c.hex ? '✓' : 'Copy'}
                </button>
              </div>
            ))}
          </div>

          {/* Breakdown stats */}
          <div style={CARD}>
            <span style={LABEL}>Color Breakdown</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {[
                { label: 'Warm vs Cool', a: 'Warm', b: 'Cool', pct: warmCount },
                { label: 'Light vs Dark', a: 'Light', b: 'Dark', pct: lightCount },
                { label: 'Saturated vs Muted', a: 'Saturated', b: 'Muted', pct: satCount },
              ].map(({ label, a, b, pct }) => (
                <div key={label} style={{ background: 'var(--bg-2)', borderRadius: 10, padding: '14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
                  <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex', marginBottom: 6 }}>
                    <div style={{ flex: pct, background: '#8b5cf6' }} />
                    <div style={{ flex: 100 - pct, background: 'rgba(255,255,255,0.1)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--brand-2)' }}>{a}: {pct}%</span>
                    <span style={{ color: 'var(--fg-3)' }}>{b}: {100 - pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SmartRecommendation currentSlug="dominant-color-extractor" />
        </>
      )}

      {!preview && (
        <div style={{ ...CARD, textAlign: 'center', padding: '36px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Upload any image to extract its dominant color palette with hex, RGB, and HSL values.
        </div>
      )}
    </div>
  )
}
