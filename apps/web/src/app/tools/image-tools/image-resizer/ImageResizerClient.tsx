'use client'
import { useState, useRef, useCallback } from 'react'
import type { CSSProperties } from 'react'

// ─── Style tokens ─────────────────────────────────────────────────────────────
const CARD: CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
  borderRadius: 16, padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)',
  color: '#fff', fontSize: 15, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const BTN_PRIMARY: CSSProperties = {
  width: '100%', padding: '14px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
  border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
}

// ─── Presets ──────────────────────────────────────────────────────────────────
const PRESETS = [
  { label: 'HD 720p', w: 1280, h: 720 },
  { label: 'FHD 1080p', w: 1920, h: 1080 },
  { label: '4K UHD', w: 3840, h: 2160 },
  { label: 'Instagram Sq', w: 1080, h: 1080 },
  { label: 'Instagram Port', w: 1080, h: 1350 },
  { label: 'Instagram Story', w: 1080, h: 1920 },
  { label: 'Twitter Post', w: 1200, h: 675 },
  { label: 'Facebook Post', w: 1200, h: 628 },
  { label: 'LinkedIn Cover', w: 1584, h: 396 },
  { label: 'YouTube Thumb', w: 1280, h: 720 },
  { label: 'Thumbnail', w: 300, h: 300 },
  { label: 'Icon 512', w: 512, h: 512 },
  { label: 'Icon 256', w: 256, h: 256 },
  { label: 'Icon 128', w: 128, h: 128 },
]
const PCT_PRESETS = [25, 50, 75, 100, 125, 150, 200]
type ResizeMode = 'px' | 'pct' | 'preset'

function fmtBytes(b: number) {
  if (b < 1024) return b + ' B'
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1024 / 1024).toFixed(2) + ' MB'
}

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '16px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

export default function ImageResizerClient() {
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [origSize, setOrigSize] = useState(0)
  const [outSize, setOutSize] = useState(0)
  const [w, setW] = useState(0)
  const [h, setH] = useState(0)
  const [pct, setPct] = useState(100)
  const [mode, setMode] = useState<ResizeMode>('px')
  const [lock, setLock] = useState(true)
  const [format, setFormat] = useState('original')
  const [quality, setQuality] = useState(90)
  const [resultDims, setResultDims] = useState<{ w: number; h: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [view, setView] = useState<'before' | 'after' | 'split'>('split')
  const [fileName, setFileName] = useState('resized')
  const inputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const originalMime = useRef<string>('image/jpeg')

  const handleFile = useCallback((f: File) => {
    const url = URL.createObjectURL(f)
    originalMime.current = f.type || 'image/jpeg'
    setFileName(f.name.replace(/\.[^.]+$/, ''))
    setOrigSize(f.size)
    setPreview(url)
    setResult('')
    setResultDims(null)
    setOutSize(0)
    const img = new Image()
    img.onload = () => {
      setOrigW(img.width); setOrigH(img.height)
      setW(img.width); setH(img.height)
      imgRef.current = img
    }
    img.src = url
  }, [])

  const changeW = (val: number) => {
    setW(val)
    if (lock && origW) setH(Math.round(val * origH / origW))
  }
  const changeH = (val: number) => {
    setH(val)
    if (lock && origH) setW(Math.round(val * origW / origH))
  }

  const getTargetDims = () => {
    if (mode === 'pct') return { nw: Math.round(origW * pct / 100), nh: Math.round(origH * pct / 100) }
    return { nw: w, nh: h }
  }

  const resize = () => {
    const img = imgRef.current
    if (!img) return
    const { nw, nh } = getTargetDims()
    const c = document.createElement('canvas')
    c.width = nw; c.height = nh
    const ctx = c.getContext('2d')!
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    const mime = format === 'jpg' ? 'image/jpeg' : format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : originalMime.current
    if (mime === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, nw, nh) }
    ctx.drawImage(img, 0, 0, nw, nh)
    c.toBlob(blob => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      setResult(url)
      setResultDims({ w: nw, h: nh })
      setOutSize(blob.size)
    }, mime, quality / 100)
  }

  const download = () => {
    if (!result || !resultDims) return
    const ext = format === 'jpg' ? '.jpg' : format === 'png' ? '.png' : format === 'webp' ? '.webp' : '.jpg'
    const a = document.createElement('a')
    a.href = result
    a.download = `${fileName}_${resultDims.w}x${resultDims.h}${ext}`
    a.click()
  }

  const { nw: previewW, nh: previewH } = origW ? getTargetDims() : { nw: 0, nh: 0 }
  const savings = outSize && origSize ? Math.round((1 - outSize / origSize) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── UPLOAD ZONE ── */}
      <div style={CARD}>
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{
            border: `2px dashed ${dragging ? 'var(--brand)' : 'rgba(139,92,246,0.3)'}`,
            borderRadius: 12, padding: '36px', textAlign: 'center', cursor: 'pointer',
            background: dragging ? 'rgba(139,92,246,0.06)' : 'transparent', transition: 'all 0.2s',
          }}
        >
          {preview
            ? <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 8, display: 'block', margin: '0 auto', objectFit: 'contain' }} />
            : <>
              <div style={{ fontSize: 48, marginBottom: 12, lineHeight: 1 }}>📏</div>
              <div style={{ color: 'var(--fg-2)', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Drop image here or click to upload</div>
              <div style={{ color: 'var(--fg-3)', fontSize: 13 }}>JPG, PNG, WebP, GIF, BMP supported</div>
            </>
          }
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
        {origW > 0 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: 'var(--fg-3)', alignItems: 'center' }}>
            <span>Original: <b style={{ color: 'var(--fg-2)' }}>{origW} × {origH} px</b></span>
            <span>Size: <b style={{ color: 'var(--fg-2)' }}>{fmtBytes(origSize)}</b></span>
            <button onClick={() => inputRef.current?.click()} style={{ ...BTN_GHOST, padding: '4px 10px', fontSize: 12 }}>Change Image</button>
          </div>
        )}
      </div>

      {origW > 0 && (
        <>
          {/* ── RESIZE MODE ── */}
          <div style={CARD}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {(['px', 'pct', 'preset'] as ResizeMode[]).map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  ...BTN_GHOST, padding: '8px 16px',
                  background: mode === m ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.06)',
                  borderColor: mode === m ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.2)',
                }}>
                  {m === 'px' ? 'By Pixels' : m === 'pct' ? 'By Percentage' : 'Preset Sizes'}
                </button>
              ))}
            </div>

            {mode === 'px' && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <label style={LABEL}>Width (px)</label>
                  <input style={INPUT_BOX} type="number" value={w} min={1} max={10000}
                    onChange={e => changeW(Math.max(1, +e.target.value))} />
                </div>
                <button
                  onClick={() => setLock(v => !v)}
                  title={lock ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                  style={{ ...BTN_GHOST, padding: '10px 14px', marginBottom: 1, fontSize: 16 }}
                >
                  {lock ? '🔒' : '🔓'}
                </button>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <label style={LABEL}>Height (px)</label>
                  <input style={INPUT_BOX} type="number" value={h} min={1} max={10000}
                    onChange={e => changeH(Math.max(1, +e.target.value))} />
                </div>
              </div>
            )}

            {mode === 'pct' && (
              <div>
                <label style={LABEL}>Scale: {pct}% — result: {Math.round(origW * pct / 100)} × {Math.round(origH * pct / 100)} px</label>
                <input type="range" min={1} max={400} value={pct}
                  onChange={e => setPct(+e.target.value)}
                  style={{ width: '100%', accentColor: '#7c3aed', marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {PCT_PRESETS.map(p => (
                    <button key={p} onClick={() => setPct(p)} style={{
                      ...BTN_GHOST, padding: '5px 12px', fontSize: 12,
                      background: pct === p ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.06)',
                    }}>{p}%</button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'preset' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                {PRESETS.map(p => (
                  <button key={p.label}
                    onClick={() => { setMode('px'); setW(p.w); setH(p.h); setLock(false) }}
                    style={{ ...BTN_GHOST, flexDirection: 'column', padding: '10px 12px', fontSize: 12, textAlign: 'center', gap: 2 }}
                  >
                    <span style={{ fontWeight: 700 }}>{p.label}</span>
                    <span style={{ color: 'var(--fg-3)', fontSize: 11 }}>{p.w}×{p.h}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── FORMAT + QUALITY ── */}
          <div style={{ ...CARD, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div>
              <label style={LABEL}>Output Format</label>
              <select value={format} onChange={e => setFormat(e.target.value)} style={{ ...INPUT_BOX, cursor: 'pointer' }}>
                <option value="original">Keep Original</option>
                <option value="jpg">JPEG</option>
                <option value="png">PNG (lossless)</option>
                <option value="webp">WebP</option>
              </select>
            </div>
            {(format === 'jpg' || format === 'webp') && (
              <div>
                <label style={LABEL}>Quality: {quality}%</label>
                <input type="range" min={1} max={100} value={quality}
                  onChange={e => setQuality(+e.target.value)}
                  style={{ width: '100%', marginTop: 10, accentColor: '#7c3aed' }} />
              </div>
            )}
            <div>
              <label style={LABEL}>Target Dimensions</label>
              <div style={{ fontSize: 15, color: 'var(--fg-2)', paddingTop: 10, fontWeight: 700 }}>
                {previewW} × {previewH} px
              </div>
            </div>
          </div>

          <button onClick={resize} style={BTN_PRIMARY}>Resize Image</button>
        </>
      )}

      {/* ── RESULT ── */}
      {result && resultDims && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            <MetricCard label="Output Dims" value={`${resultDims.w}×${resultDims.h}`} color="#6366f1" sub="pixels" />
            <MetricCard label="Original Size" value={fmtBytes(origSize)} color="#94a3b8" sub={`${origW}×${origH} px`} />
            <MetricCard label="Output Size" value={fmtBytes(outSize)} color="#10b981" />
            <MetricCard
              label={savings >= 0 ? 'Size Saved' : 'Size Added'}
              value={`${Math.abs(savings)}%`}
              color={savings >= 0 ? '#10b981' : '#f59e0b'}
              sub={savings >= 0 ? `${fmtBytes(origSize - outSize)} saved` : 'larger output'}
            />
          </div>

          {/* Before/After */}
          <div style={CARD}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['before', 'after', 'split'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  ...BTN_GHOST, padding: '6px 14px', fontSize: 12,
                  background: view === v ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.06)',
                }}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              {(view === 'before' || view === 'split') && (
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 6, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ORIGINAL — {origW}×{origH} · {fmtBytes(origSize)}</div>
                  <img src={preview} alt="Original" style={{ width: '100%', borderRadius: 8, border: '1px solid var(--line-strong)' }} />
                </div>
              )}
              {(view === 'after' || view === 'split') && (
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 6, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RESIZED — {resultDims.w}×{resultDims.h} · {fmtBytes(outSize)}</div>
                  <img src={result} alt="Resized" style={{ width: '100%', borderRadius: 8, border: '1px solid var(--line-strong)' }} />
                </div>
              )}
            </div>
          </div>

          {/* Download */}
          <div style={{ ...CARD, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)' }}>Ready to download</div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>
                {resultDims.w}×{resultDims.h} px · {fmtBytes(outSize)}
                {savings > 0 && <span style={{ color: '#10b981', marginLeft: 8 }}>({savings}% smaller)</span>}
              </div>
            </div>
            <button onClick={download}
              style={{ ...BTN_GHOST, background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.4)', color: '#34d399' }}>
              Download {format === 'original' ? '' : format.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
