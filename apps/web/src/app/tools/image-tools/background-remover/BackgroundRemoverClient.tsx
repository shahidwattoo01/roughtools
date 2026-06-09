'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'
import { removeBackground, checkerboardStyle } from '@/lib/removeBg'

/* ── CSS-variable-based style tokens (light + dark adaptive) ───── */
const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px',
  ...extra,
})

const TAG: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(124,91,246,0.08)', border: '1px solid rgba(124,91,246,0.2)',
  color: 'var(--brand-2)', borderRadius: 999, padding: '4px 12px',
  fontSize: 12, fontWeight: 600,
}

/* ── Before/After clip-path slider ─────────────────────────────── */
function CompareSlider({ before, after }: { before: string; after: string }) {
  const [pct, setPct] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const move = useCallback((clientX: number) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPct(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)))
  }, [])

  useEffect(() => {
    const up = () => { dragging.current = false }
    const mv = (e: MouseEvent) => { if (dragging.current) move(e.clientX) }
    const tm = (e: TouchEvent) => { if (dragging.current) move(e.touches[0].clientX) }
    window.addEventListener('mousemove', mv)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', tm, { passive: true })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', mv)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', tm)
      window.removeEventListener('touchend', up)
    }
  }, [move])

  return (
    <div
      ref={ref}
      onMouseDown={e => { dragging.current = true; move(e.clientX) }}
      onTouchStart={e => { dragging.current = true; move(e.touches[0].clientX) }}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 12, cursor: 'ew-resize', userSelect: 'none', lineHeight: 0 }}
    >
      {/* Before */}
      <img src={before} alt="Original" style={{ width: '100%', display: 'block' }} />

      {/* After on checkerboard */}
      <div style={{
        position: 'absolute', inset: 0,
        clipPath: `inset(0 0 0 ${pct}%)`,
        ...checkerboardStyle(),
      }}>
        <img src={after} alt="Result" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Divider line */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: `${pct}%`,
        width: 2, background: '#fff', transform: 'translateX(-50%)',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.2)',
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 32, height: 32, borderRadius: '50%',
          background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, pointerEvents: 'none',
        }}>⟺</div>
      </div>

      {/* Labels */}
      <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, pointerEvents: 'none' }}>Original</div>
      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, pointerEvents: 'none' }}>Removed</div>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────────── */
export default function BackgroundRemoverClient() {
  const [preview, setPreview] = useState('')
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [resultUrl, setResultUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMsg, setProgressMsg] = useState('')
  const [error, setError] = useState('')
  const [dlBgColor, setDlBgColor] = useState('#ffffff')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResultBlob(null)
    setResultUrl('')
    setError('')
    setProgress(0)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, []) // eslint-disable-line

  const process = async () => {
    if (!file) return
    setProcessing(true); setError(''); setProgress(0); setProgressMsg('Starting…')
    try {
      const blob = await removeBackground(file, (pct, msg) => {
        setProgress(pct); setProgressMsg(msg)
      })
      const url = URL.createObjectURL(blob)
      setResultBlob(blob)
      setResultUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const downloadTransparent = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl; a.download = 'removed-background.png'; a.click()
  }

  const downloadWithBg = (color: string) => {
    if (!resultBlob) return
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.width; c.height = img.height
      const ctx = c.getContext('2d')!
      ctx.fillStyle = color; ctx.fillRect(0, 0, c.width, c.height)
      ctx.drawImage(img, 0, 0)
      const a = document.createElement('a')
      a.href = c.toDataURL('image/jpeg', 0.95)
      a.download = `background-${color.replace('#', '')}.jpg`
      a.click()
    }
    img.src = resultUrl
  }

  return (
    <div>
      {/* Info banner */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(124,91,246,0.07)', border: '1px solid rgba(124,91,246,0.18)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: 'var(--brand-2)' }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>⚡</span>
        <span>AI model is <strong>downloaded once and cached</strong> in your browser. First use takes 15–30 s; subsequent uses are instant. Your image never leaves your device.</span>
      </div>

      {/* Upload area — shown when no result yet */}
      {!resultUrl && (
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{
            border: `2px dashed ${dragging ? 'var(--brand)' : 'var(--line-bright)'}`,
            borderRadius: 16,
            padding: preview ? 12 : '56px 32px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'rgba(124,91,246,0.05)' : 'var(--bg-0)',
            transition: 'all 0.2s',
            marginBottom: 20,
          }}
        >
          {preview ? (
            <img src={preview} alt="preview" style={{ maxHeight: 320, maxWidth: '100%', borderRadius: 10, display: 'block', margin: '0 auto' }} />
          ) : (
            <>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
              <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--fg)', marginBottom: 6 }}>
                Drop your image here
              </div>
              <div style={{ fontSize: 14, color: 'var(--fg-2)', marginBottom: 16 }}>
                or click to browse — JPG, PNG, WebP, HEIC supported
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                {['✂️ Portraits', '📦 Products', '🐾 Pets', '🌿 Objects'].map(t => (
                  <span key={t} style={TAG}>{t}</span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />

      {/* Processing state */}
      {processing && (
        <div style={{ ...card(), marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 20, height: 20, border: '3px solid var(--line-bright)', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{progressMsg || 'Initialising AI model…'}</span>
          </div>
          <div style={{ background: 'var(--bg-2)', borderRadius: 8, overflow: 'hidden', height: 8 }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,var(--brand-2),var(--brand))', width: `${Math.max(5, progress)}%`, transition: 'width 0.4s', borderRadius: 8 }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 6 }}>{progress}% complete</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: 13, color: '#ef4444', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ flexShrink: 0, fontSize: 16 }}>❌</span>
          <div style={{ flex: 1 }}>
            <strong>Processing failed:</strong> {error}
            <button onClick={process} style={{ marginLeft: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '3px 10px', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Retry</button>
          </div>
        </div>
      )}

      {/* Remove BG button */}
      {file && !processing && (
        <button onClick={process} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          width: '100%', background: 'linear-gradient(135deg,var(--brand-2),var(--brand))',
          color: '#fff', border: 'none', borderRadius: 12, padding: '15px 32px',
          fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 20,
          boxShadow: '0 8px 24px -8px rgba(124,91,246,0.5)',
          transition: 'opacity 0.2s',
        }}>
          ✨ {resultUrl ? 'Re-process image' : 'Remove Background — AI, No API Key'}
        </button>
      )}

      {/* ── RESULT ─── */}
      {resultUrl && (
        <>
          {/* Before / After comparison slider */}
          <div style={{ marginBottom: 20 }}>
            <CompareSlider before={preview} after={resultUrl} />
          </div>

          {/* Result preview on checkerboard + Download options */}
          <div style={card({ marginBottom: 20 })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg)' }}>Result — transparent PNG</span>
              <button
                onClick={() => fileRef.current?.click()}
                style={{ fontSize: 12, color: 'var(--fg-2)', background: 'var(--bg-2)', border: '1px solid var(--line-strong)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontWeight: 600 }}
              >
                ↩ New image
              </button>
            </div>

            {/* Checkerboard preview */}
            <div style={{ ...checkerboardStyle(), borderRadius: 12, padding: 12, marginBottom: 18, textAlign: 'center' }}>
              <img src={resultUrl} alt="Background removed" style={{ maxHeight: 280, maxWidth: '100%', display: 'block', margin: '0 auto' }} />
            </div>

            {/* Download row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
              <button onClick={downloadTransparent} style={{
                background: 'linear-gradient(135deg,var(--brand-2),var(--brand))', color: '#fff',
                border: 'none', borderRadius: 10, padding: '11px 6px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>
                📥 Transparent<br /><span style={{ fontSize: 11, opacity: 0.85 }}>PNG</span>
              </button>
              <button onClick={() => downloadWithBg('#ffffff')} style={{
                background: '#ffffff', color: '#1a1a1a',
                border: '1px solid var(--line-strong)', borderRadius: 10, padding: '11px 6px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>
                🤍 White BG<br /><span style={{ fontSize: 11, opacity: 0.65 }}>JPG</span>
              </button>
              <button onClick={() => downloadWithBg('#000000')} style={{
                background: '#18181b', color: '#ffffff',
                border: '1px solid #444', borderRadius: 10, padding: '11px 6px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>
                🖤 Black BG<br /><span style={{ fontSize: 11, opacity: 0.65 }}>JPG</span>
              </button>
            </div>

            {/* Custom colour */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-0)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px' }}>
              <input type="color" value={dlBgColor} onChange={e => setDlBgColor(e.target.value)}
                style={{ width: 32, height: 32, border: '2px solid var(--line-strong)', borderRadius: 6, cursor: 'pointer', padding: 2, background: 'none' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>Custom background colour</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>Pick any colour, downloads as JPG</div>
              </div>
              <button onClick={() => downloadWithBg(dlBgColor)} style={{
                background: dlBgColor, color: '#fff', border: 'none', borderRadius: 8,
                padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                textShadow: '0 1px 2px rgba(0,0,0,0.4)',
              }}>
                ⬇ Download
              </button>
            </div>
          </div>

          {/* Related tools */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { href: '/tools/image-tools/background-changer', icon: '🎨', label: 'Change Background', desc: 'Replace with solid, gradient or photo' },
              { href: '/tools/image-tools/blur-background',    icon: '🌫️', label: 'Blur Background',   desc: 'Depth-of-field portrait effect' },
              { href: '/tools/image-tools/white-background-maker', icon: '⬜', label: 'White Background', desc: 'Perfect for product photos & e-commerce' },
              { href: '/tools/image-tools/image-enhancer',    icon: '✨', label: 'Image Enhancer',    desc: 'Brightness, contrast, sharpness' },
            ].map(t => (
              <a key={t.href} href={t.href} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                ...card(), textDecoration: 'none', transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,91,246,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line-strong)')}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--fg)', marginBottom: 2 }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{t.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      <SmartRecommendation currentSlug="background-remover" />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
