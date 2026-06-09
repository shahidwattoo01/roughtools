'use client'
import React, { useState, useRef, useCallback } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'
import { removeBackground, checkerboardStyle } from '@/lib/removeBg'

const card: React.CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }
const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', marginBottom: 6 }
const btn: React.CSSProperties = { background: 'linear-gradient(135deg,var(--brand-2),var(--brand))', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 16 }

async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image()
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = src })
  return img
}

function findBoundingBox(data: Uint8ClampedArray, w: number, h: number) {
  let minX = w, maxX = 0, minY = h, maxY = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 10) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x)
        minY = Math.min(minY, y); maxY = Math.max(maxY, y)
      }
    }
  }
  return { minX, maxX, minY, maxY }
}

export default function WhiteBackgroundClient() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [subjectPreview, setSubjectPreview] = useState('')
  const [result, setResult] = useState('')
  const [addPadding, setAddPadding] = useState(true)
  const [padding, setPadding] = useState(40)
  const [autoTrim, setAutoTrim] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMsg, setProgressMsg] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f); setPreview(URL.createObjectURL(f))
    setSubjectPreview(''); setResult(''); setError('')
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, []) // eslint-disable-line

  const process = async () => {
    if (!file) return
    setProcessing(true); setError(''); setProgress(0)
    try {
      const subjectBlob = await removeBackground(file, (pct, msg) => {
        setProgress(Math.round(pct * 0.85)); setProgressMsg(msg)
      })
      setSubjectPreview(URL.createObjectURL(subjectBlob))
      setProgressMsg('Compositing on white background…'); setProgress(90)

      const subjectImg = await loadImage(URL.createObjectURL(subjectBlob))
      const sw = subjectImg.naturalWidth, sh = subjectImg.naturalHeight

      // Extract alpha to find bounding box
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = sw; tempCanvas.height = sh
      const tCtx = tempCanvas.getContext('2d')!
      tCtx.drawImage(subjectImg, 0, 0)
      const tempData = tCtx.getImageData(0, 0, sw, sh).data

      let x0 = 0, y0 = 0, cropW = sw, cropH = sh
      if (autoTrim) {
        const bb = findBoundingBox(tempData, sw, sh)
        x0 = Math.max(0, bb.minX - 5)
        y0 = Math.max(0, bb.minY - 5)
        cropW = Math.min(sw, bb.maxX + 5) - x0
        cropH = Math.min(sh, bb.maxY + 5) - y0
      }

      const pad = addPadding ? padding : 0
      const finalW = cropW + pad * 2
      const finalH = cropH + pad * 2

      const canvas = document.createElement('canvas')
      canvas.width = finalW; canvas.height = finalH
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, finalW, finalH)
      ctx.drawImage(subjectImg, x0, y0, cropW, cropH, pad, pad, cropW, cropH)

      setResult(canvas.toDataURL('image/jpeg', 0.96))
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
          style={{ border: `2px dashed ${dragging ? 'var(--brand)' : 'var(--line-bright)'}`, borderRadius: 10, padding: '32px 16px', textAlign: 'center', cursor: 'pointer' }}
        >
          {preview
            ? <img src={preview} alt="preview" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8 }} />
            : <><div style={{ fontSize: 36 }}>🖼️</div><div style={{ fontWeight: 700, color: 'var(--fg)', marginTop: 8 }}>Drop image or click to upload</div><div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 4 }}>Perfect for product photos and e-commerce</div></>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {processing && (
        <div style={card}>
          <div style={{ fontSize: 14, color: 'var(--brand-2)', marginBottom: 10, fontWeight: 600 }}>{progressMsg || 'Initialising…'}</div>
          <div style={{ background: 'var(--bg-0)', borderRadius: 8, overflow: 'hidden', height: 10 }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#7c3aed,#ec4899)', width: `${progress}%`, transition: 'width 0.3s', borderRadius: 8 }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 6 }}>{progress}%</div>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 16, fontSize: 13, color: '#fca5a5' }}>
          ❌ {error}
          <button onClick={process} style={{ marginLeft: 12, background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fca5a5', cursor: 'pointer', fontSize: 12 }}>Retry</button>
        </div>
      )}

      {file && !processing && (
        <div style={card}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <label style={{ ...lbl, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 0 }}>
              <input type="checkbox" checked={autoTrim} onChange={e => setAutoTrim(e.target.checked)} style={{ accentColor: '#7c3aed' }} />
              Auto-trim transparent space around subject
            </label>
            <label style={{ ...lbl, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 0 }}>
              <input type="checkbox" checked={addPadding} onChange={e => setAddPadding(e.target.checked)} style={{ accentColor: '#7c3aed' }} />
              Add white padding
            </label>
          </div>
          {addPadding && (
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Padding: {padding}px on each side</label>
              <input type="range" min="0" max="200" value={padding} onChange={e => setPadding(Number(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed' }} />
            </div>
          )}
          <button style={btn} onClick={process}>✨ Make White Background (AI)</button>
        </div>
      )}

      {subjectPreview && !processing && (
        <div style={{ ...card, marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 8 }}>Subject extracted (for reference):</div>
          <div style={{ ...checkerboardStyle(), borderRadius: 8, padding: 4 }}>
            <img src={subjectPreview} alt="subject" style={{ maxHeight: 120, maxWidth: '100%', display: 'block', margin: '0 auto' }} />
          </div>
        </div>
      )}

      {result && (
        <div>
          <BeforeAfterSlider beforeSrc={preview} afterSrc={result} beforeLabel="Original" afterLabel="White Background" />
          <div style={{ ...card, marginTop: 12 }}>
            <div style={{ background: '#fff', borderRadius: 8, marginBottom: 12, overflow: 'hidden', padding: 8 }}>
              <img src={result} alt="result" style={{ maxWidth: '100%', maxHeight: 300, display: 'block', margin: '0 auto' }} />
            </div>
            <a href={result} download="white-background.jpg" style={{ display: 'block', textAlign: 'center', color: 'var(--brand-2)', background: 'rgba(124,58,237,0.15)', borderRadius: 10, padding: '12px', textDecoration: 'none', fontWeight: 700 }}>
              Download JPG
            </a>
          </div>
          <SmartRecommendation currentSlug="white-background-maker" />
        </div>
      )}
    </div>
  )
}
