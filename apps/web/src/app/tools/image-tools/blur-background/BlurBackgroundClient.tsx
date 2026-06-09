'use client'
import React, { useState, useRef, useCallback } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'
import { removeBackground, boxBlur } from '@/lib/removeBg'

const card: React.CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }
const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', marginBottom: 6 }
const inp: React.CSSProperties = { width: '100%', accentColor: '#7c3aed' }
const btn: React.CSSProperties = { background: 'linear-gradient(135deg,var(--brand-2),var(--brand))', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 16 }

async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image()
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = src })
  return img
}

export default function BlurBackgroundClient() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [blurPx, setBlurPx] = useState(8)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMsg, setProgressMsg] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(''); setError('')
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, []) // eslint-disable-line

  const apply = async () => {
    if (!file) return
    setProcessing(true); setError(''); setProgress(0)
    try {
      setProgressMsg('Starting AI subject detection…')
      const subjectBlob = await removeBackground(file, (pct, msg) => {
        setProgress(Math.round(pct * 0.8)); setProgressMsg(msg)
      })

      setProgressMsg('Applying background blur…'); setProgress(85)

      const origImg = await loadImage(URL.createObjectURL(file))
      const subjectImg = await loadImage(URL.createObjectURL(subjectBlob))

      const w = origImg.naturalWidth, h = origImg.naturalHeight
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')!

      // Draw original and get pixel data
      ctx.drawImage(origImg, 0, 0)
      const origData = ctx.getImageData(0, 0, w, h)

      // Apply JS box blur (3-pass approximation of Gaussian)
      const blurredPx = boxBlur(origData.data, w, h, blurPx)

      // Get subject mask alpha
      const maskCanvas = document.createElement('canvas')
      maskCanvas.width = w; maskCanvas.height = h
      const mCtx = maskCanvas.getContext('2d')!
      mCtx.drawImage(subjectImg, 0, 0, w, h)
      const maskData = mCtx.getImageData(0, 0, w, h)

      // Composite: alpha-blend original (sharp) over blurred based on subject mask
      const final = new Uint8ClampedArray(origData.data.length)
      for (let i = 0; i < origData.data.length; i += 4) {
        const a = maskData.data[i + 3] / 255
        final[i]   = origData.data[i]   * a + blurredPx[i]   * (1 - a)
        final[i + 1] = origData.data[i + 1] * a + blurredPx[i + 1] * (1 - a)
        final[i + 2] = origData.data[i + 2] * a + blurredPx[i + 2] * (1 - a)
        final[i + 3] = 255
      }

      const composited = ctx.createImageData(w, h)
      composited.data.set(final)
      ctx.putImageData(composited, 0, 0)
      setResult(canvas.toDataURL('image/jpeg', 0.95))
      setProgress(100)
    } catch (err) {
      setError(`Processing failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div>
      <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'var(--brand-2)' }}>
        ⚡ AI model is downloaded once and cached in your browser. First use may take 15–30 seconds.
      </div>

      <div style={card}>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border: `2px dashed ${dragging ? 'var(--brand)' : 'var(--line-bright)'}`, borderRadius: 10, padding: '32px', textAlign: 'center', cursor: 'pointer' }}
        >
          {preview
            ? <img src={preview} alt="original" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8 }} />
            : <><div style={{ fontSize: 36 }}>📷</div><div style={{ fontWeight: 700, color: 'var(--fg)', marginTop: 8 }}>Drop image or click to upload</div><div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 4 }}>Best results with portrait or product photos</div></>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {file && !processing && (
        <div style={card}>
          <label style={lbl}>Blur Radius: {blurPx}px</label>
          <input type="range" min="1" max="20" value={blurPx} onChange={e => setBlurPx(Number(e.target.value))} style={inp} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>
            <span>Subtle (1px)</span><span>Strong (20px)</span>
          </div>
        </div>
      )}

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
          <button onClick={apply} style={{ marginLeft: 12, background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fca5a5', cursor: 'pointer', fontSize: 12 }}>Retry</button>
        </div>
      )}

      {file && !processing && (
        <button onClick={apply} style={btn}>
          {result ? `Re-apply Blur (${blurPx}px)` : '✨ Blur Background (AI)'}
        </button>
      )}

      {result && (
        <div>
          <BeforeAfterSlider beforeSrc={preview} afterSrc={result} beforeLabel="Original" afterLabel={`Blur ${blurPx}px`} />
          <div style={{ ...card, marginTop: 12 }}>
            <a href={result} download={`blurred-bg-${blurPx}px.jpg`} style={{ display: 'block', textAlign: 'center', color: 'var(--brand-2)', background: 'rgba(124,58,237,0.15)', borderRadius: 10, padding: '12px', textDecoration: 'none', fontWeight: 700 }}>
              Download JPG
            </a>
          </div>
          <SmartRecommendation currentSlug="blur-background" />
        </div>
      )}
    </div>
  )
}
