'use client'
import React, { useState, useRef, useCallback } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'
import { removeBackground, checkerboardStyle } from '@/lib/removeBg'

const card: React.CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }
const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', marginBottom: 6 }
const btn: React.CSSProperties = { background: 'linear-gradient(135deg,var(--brand-2),var(--brand))', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 16 }

type BgMode = 'color' | 'gradient' | 'image'
const GRADIENT_DIRS = ['to bottom', 'to right', 'to bottom right', 'to bottom left', '135deg', '45deg']

async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image()
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = src })
  return img
}

export default function BackgroundChangerClient() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [subjectBlob, setSubjectBlob] = useState<Blob | null>(null)
  const [result, setResult] = useState('')
  const [bgMode, setBgMode] = useState<BgMode>('color')
  const [solidColor, setSolidColor] = useState('#1a1a2e')
  const [gradColor1, setGradColor1] = useState('#7c3aed')
  const [gradColor2, setGradColor2] = useState('#ec4899')
  const [gradDir, setGradDir] = useState('to bottom right')
  const [bgImageUrl, setBgImageUrl] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMsg, setProgressMsg] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const bgFileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f); setPreview(URL.createObjectURL(f)); setSubjectBlob(null); setResult(''); setError('')
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, []) // eslint-disable-line

  const removeSubjectBg = async () => {
    if (!file) return
    setProcessing(true); setError(''); setProgress(0); setResult('')
    try {
      const blob = await removeBackground(file, (pct, msg) => { setProgress(pct); setProgressMsg(msg) })
      setSubjectBlob(blob)
      setProgressMsg('Subject extracted — choose a background below')
      setProgress(100)
    } catch (err) {
      setError(`Processing failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setProcessing(false)
    }
  }

  const applyBackground = async () => {
    if (!subjectBlob) return
    const subjectImg = await loadImage(URL.createObjectURL(subjectBlob))
    const w = subjectImg.naturalWidth, h = subjectImg.naturalHeight
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')!

    if (bgMode === 'color') {
      ctx.fillStyle = solidColor
      ctx.fillRect(0, 0, w, h)
    } else if (bgMode === 'gradient') {
      const grad = ctx.createLinearGradient(
        gradDir.includes('right') ? 0 : w / 2,
        gradDir.includes('bottom') || gradDir.includes('135') ? 0 : h / 2,
        gradDir.includes('right') || gradDir.includes('45') ? w : w / 2,
        gradDir.includes('bottom') || gradDir.includes('135') ? h : h / 2
      )
      grad.addColorStop(0, gradColor1)
      grad.addColorStop(1, gradColor2)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    } else if (bgMode === 'image' && bgImageUrl) {
      const bgImg = await loadImage(bgImageUrl)
      ctx.drawImage(bgImg, 0, 0, w, h)
    }

    ctx.drawImage(subjectImg, 0, 0)
    setResult(canvas.toDataURL('image/jpeg', 0.95))
  }

  return (
    <div>
      <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'var(--brand-2)' }}>
        ⚡ AI model is downloaded once and cached in your browser. First use may take 15–30 seconds.
      </div>

      {/* Step 1: Upload */}
      <div style={card}>
        <div style={{ fontWeight: 700, color: 'var(--fg)', marginBottom: 12, fontSize: 14 }}>Step 1 — Upload your image</div>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border: `2px dashed ${dragging ? 'var(--brand)' : 'var(--line-bright)'}`, borderRadius: 10, padding: '28px', textAlign: 'center', cursor: 'pointer' }}
        >
          {preview
            ? <img src={preview} alt="preview" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8 }} />
            : <><div style={{ fontSize: 36 }}>🖼️</div><div style={{ fontWeight: 700, color: 'var(--fg)', marginTop: 8 }}>Drop image or click to upload</div></>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {/* Progress */}
      {processing && (
        <div style={card}>
          <div style={{ fontSize: 14, color: 'var(--brand-2)', marginBottom: 10, fontWeight: 600 }}>{progressMsg}</div>
          <div style={{ background: 'var(--bg-0)', borderRadius: 8, overflow: 'hidden', height: 10 }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#7c3aed,#ec4899)', width: `${progress}%`, transition: 'width 0.3s', borderRadius: 8 }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 6 }}>{progress}%</div>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 16, fontSize: 13, color: '#fca5a5' }}>
          ❌ {error}
          <button onClick={removeSubjectBg} style={{ marginLeft: 12, background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fca5a5', cursor: 'pointer', fontSize: 12 }}>Retry</button>
        </div>
      )}

      {file && !processing && !subjectBlob && (
        <button onClick={removeSubjectBg} style={btn}>✨ Extract Subject (AI)</button>
      )}

      {/* Step 2: Subject preview + BG picker */}
      {subjectBlob && !processing && (
        <>
          <div style={card}>
            <div style={{ fontWeight: 700, color: 'var(--fg)', marginBottom: 10, fontSize: 14 }}>Subject extracted</div>
            <div style={{ ...checkerboardStyle(), borderRadius: 8, overflow: 'hidden', padding: 6, marginBottom: 8 }}>
              <img src={URL.createObjectURL(subjectBlob)} alt="subject" style={{ maxHeight: 160, maxWidth: '100%', display: 'block', margin: '0 auto' }} />
            </div>
            <button onClick={removeSubjectBg} style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid var(--line-strong)', color: 'var(--brand-2)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Re-extract</button>
          </div>

          <div style={card}>
            <div style={{ fontWeight: 700, color: 'var(--fg)', marginBottom: 12, fontSize: 14 }}>Step 2 — Choose new background</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {(['color', 'gradient', 'image'] as BgMode[]).map(m => (
                <button key={m} onClick={() => setBgMode(m)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid var(--line-strong)', background: bgMode === m ? 'rgba(124,58,237,0.2)' : 'transparent', color: bgMode === m ? 'var(--brand)' : 'var(--fg-2)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                  {m === 'color' ? '🎨 Solid Color' : m === 'gradient' ? '🌈 Gradient' : '🖼️ Image'}
                </button>
              ))}
            </div>

            {bgMode === 'color' && (
              <div>
                <label style={lbl}>Background colour</label>
                <input type="color" value={solidColor} onChange={e => setSolidColor(e.target.value)} style={{ width: '100%', height: 48, borderRadius: 8, border: 'none', cursor: 'pointer', padding: 2 }} />
              </div>
            )}

            {bgMode === 'gradient' && (
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={lbl}>Colour 1</label>
                    <input type="color" value={gradColor1} onChange={e => setGradColor1(e.target.value)} style={{ width: '100%', height: 44, borderRadius: 8, border: 'none', cursor: 'pointer', padding: 2 }} />
                  </div>
                  <div>
                    <label style={lbl}>Colour 2</label>
                    <input type="color" value={gradColor2} onChange={e => setGradColor2(e.target.value)} style={{ width: '100%', height: 44, borderRadius: 8, border: 'none', cursor: 'pointer', padding: 2 }} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Direction</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {GRADIENT_DIRS.map(d => (
                      <button key={d} onClick={() => setGradDir(d)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--line-strong)', background: gradDir === d ? 'rgba(124,58,237,0.35)' : 'transparent', color: 'var(--brand-2)', cursor: 'pointer', fontSize: 12 }}>{d}</button>
                    ))}
                  </div>
                </div>
                <div style={{ height: 40, borderRadius: 8, background: `linear-gradient(${gradDir}, ${gradColor1}, ${gradColor2})` }} />
              </div>
            )}

            {bgMode === 'image' && (
              <div>
                <label style={lbl}>Upload background image</label>
                <div onClick={() => bgFileRef.current?.click()} style={{ border: '2px dashed rgba(167,139,250,0.3)', borderRadius: 10, padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                  {bgImageUrl
                    ? <img src={bgImageUrl} alt="bg" style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 6 }} />
                    : <><div style={{ fontSize: 28 }}>📁</div><div style={{ color: 'var(--fg-3)', fontSize: 13, marginTop: 4 }}>Click to choose background image</div></>
                  }
                </div>
                <input ref={bgFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) setBgImageUrl(URL.createObjectURL(e.target.files[0])) }} />
              </div>
            )}

            <button onClick={applyBackground} disabled={bgMode === 'image' && !bgImageUrl} style={{ ...btn, marginTop: 16, opacity: bgMode === 'image' && !bgImageUrl ? 0.5 : 1 }}>
              Apply Background
            </button>
          </div>
        </>
      )}

      {result && (
        <div>
          <BeforeAfterSlider beforeSrc={preview} afterSrc={result} beforeLabel="Original" afterLabel="New Background" />
          <div style={{ ...card, marginTop: 12 }}>
            <a href={result} download="background-changed.jpg" style={{ display: 'block', textAlign: 'center', color: 'var(--brand-2)', background: 'rgba(124,58,237,0.15)', borderRadius: 10, padding: '12px', textDecoration: 'none', fontWeight: 700 }}>
              Download JPG
            </a>
          </div>
          <SmartRecommendation currentSlug="background-changer" />
        </div>
      )}
    </div>
  )
}
