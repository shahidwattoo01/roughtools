'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background: '#13132a', border: '1px solid rgba(167,139,250,0.15)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }
const btn: React.CSSProperties = { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 16 }

type Stroke = { x: number; y: number }[]

function inpaint(data: Uint8ClampedArray, mask: Uint8Array, w: number, h: number): Uint8ClampedArray {
  const result = new Uint8ClampedArray(data)
  const radius = 18
  for (let pass = 0; pass < 3; pass++) {
    const src = pass === 0 ? data : result
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!mask[y * w + x]) continue
        let rs = 0, gs = 0, bs = 0, ws = 0
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            if (dx*dx + dy*dy > radius*radius) continue
            const nx = x + dx, ny = y + dy
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue
            if (mask[ny * w + nx]) continue
            const d2 = dx*dx + dy*dy
            const wt = 1 / (d2 + 1)
            const ni = (ny * w + nx) * 4
            rs += src[ni] * wt; gs += src[ni+1] * wt; bs += src[ni+2] * wt; ws += wt
          }
        }
        if (ws > 0) {
          const i = (y * w + x) * 4
          result[i]   = rs / ws
          result[i+1] = gs / ws
          result[i+2] = bs / ws
        }
      }
    }
  }
  return result
}

export default function RemoveWatermarkClient() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [brushSize, setBrushSize] = useState(20)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [painting, setPainting] = useState(false)
  const [currentStroke, setCurrentStroke] = useState<Stroke>([])
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f)
    setPreview(url); setResult(''); setStrokes([]); setCurrentStroke([])
    const img = new window.Image()
    img.onload = () => setImgObj(img)
    img.src = url
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, []) // eslint-disable-line

  // Draw image + mask overlay onto canvas
  useEffect(() => {
    const c = canvasRef.current, m = maskRef.current
    if (!c || !m || !imgObj) return
    c.width = imgObj.naturalWidth; c.height = imgObj.naturalHeight
    m.width = imgObj.naturalWidth; m.height = imgObj.naturalHeight
    const ctx = c.getContext('2d')!
    ctx.drawImage(imgObj, 0, 0)
    // Redraw all strokes on mask
    const mCtx = m.getContext('2d')!
    mCtx.clearRect(0, 0, m.width, m.height)
    mCtx.fillStyle = 'rgba(255,80,80,0.55)'
    const scaleX = imgObj.naturalWidth / (containerRef.current?.offsetWidth ?? 1)
    const scaleY = imgObj.naturalHeight / (containerRef.current?.offsetHeight ?? 1)
    for (const stroke of [...strokes, currentStroke]) {
      if (stroke.length === 0) continue
      mCtx.beginPath()
      mCtx.arc(stroke[0].x * scaleX, stroke[0].y * scaleY, brushSize * scaleX / 2, 0, Math.PI * 2)
      for (let i = 1; i < stroke.length; i++) {
        mCtx.lineTo(stroke[i].x * scaleX, stroke[i].y * scaleY)
      }
      mCtx.lineWidth = brushSize * scaleX
      mCtx.lineCap = 'round'; mCtx.lineJoin = 'round'
      mCtx.strokeStyle = 'rgba(255,80,80,0.55)'
      mCtx.stroke()
    }
  }, [imgObj, strokes, currentStroke, brushSize])

  const getPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const rect = containerRef.current!.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const startPaint = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); setPainting(true)
    setCurrentStroke([getPos(e)])
  }

  const paint = (e: React.MouseEvent | React.TouchEvent) => {
    if (!painting) return; e.preventDefault()
    setCurrentStroke(prev => [...prev, getPos(e)])
  }

  const endPaint = () => {
    if (!painting) return
    setPainting(false)
    if (currentStroke.length > 0) setStrokes(prev => [...prev, currentStroke])
    setCurrentStroke([])
  }

  const undo = () => setStrokes(prev => prev.slice(0, -1))

  const clearMask = () => { setStrokes([]); setCurrentStroke([]) }

  const applyInpaint = () => {
    if (!imgObj || (strokes.length === 0 && currentStroke.length === 0)) return
    setProcessing(true)
    setTimeout(() => {
      const w = imgObj.naturalWidth, h = imgObj.naturalHeight
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(imgObj, 0, 0)
      const imageData = ctx.getImageData(0, 0, w, h)

      // Build mask
      const dispW = containerRef.current?.offsetWidth ?? w
      const dispH = containerRef.current?.offsetHeight ?? h
      const scaleX = w / dispW, scaleY = h / dispH
      const mask = new Uint8Array(w * h)
      const mCanvas = document.createElement('canvas')
      mCanvas.width = w; mCanvas.height = h
      const mCtx = mCanvas.getContext('2d')!
      mCtx.fillStyle = '#000'
      mCtx.fillRect(0, 0, w, h)
      mCtx.fillStyle = '#fff'
      for (const stroke of strokes) {
        if (!stroke.length) continue
        mCtx.beginPath()
        mCtx.arc(stroke[0].x * scaleX, stroke[0].y * scaleY, brushSize * scaleX / 2, 0, Math.PI * 2)
        for (let i = 1; i < stroke.length; i++) mCtx.lineTo(stroke[i].x * scaleX, stroke[i].y * scaleY)
        mCtx.lineWidth = brushSize * scaleX
        mCtx.lineCap = 'round'; mCtx.lineJoin = 'round'; mCtx.stroke()
      }
      const mData = mCtx.getImageData(0, 0, w, h).data
      for (let i = 0; i < mask.length; i++) mask[i] = mData[i * 4] > 128 ? 1 : 0

      const filled = inpaint(imageData.data, mask, w, h)
      const outData = ctx.createImageData(w, h)
      outData.data.set(filled)
      ctx.putImageData(outData, 0, 0)
      setResult(canvas.toDataURL('image/jpeg', 0.95))
      setProcessing(false)
    }, 10)
  }

  return (
    <div>
      <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 16, fontSize: 13, color: '#fbbf24' }}>
        ⚠️ Works best on simple, uniform backgrounds. For complex textures, results may vary. Paint over the area to remove, then click Apply.
      </div>

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
            : <><div style={{ fontSize: 36 }}>🖼️</div><div style={{ fontWeight: 700, color: '#e0e0ff', marginTop: 8 }}>Drop image or click to upload</div></>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {imgObj && (
        <>
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa' }}>Brush Size: {brushSize}px</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={undo} disabled={strokes.length === 0} style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', borderRadius: 8, padding: '6px 12px', cursor: strokes.length === 0 ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, opacity: strokes.length === 0 ? 0.4 : 1 }}>
                  ↩ Undo
                </button>
                <button onClick={clearMask} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  Clear
                </button>
              </div>
            </div>
            <input type="range" min="5" max="80" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed', marginBottom: 12 }} />

            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Paint over the area to remove (shown in red), then click Apply:</div>
            <div
              ref={containerRef}
              onMouseDown={startPaint}
              onMouseMove={paint}
              onMouseUp={endPaint}
              onMouseLeave={endPaint}
              onTouchStart={startPaint}
              onTouchMove={paint}
              onTouchEnd={endPaint}
              style={{ position: 'relative', cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${brushSize}' height='${brushSize}'><circle cx='${brushSize/2}' cy='${brushSize/2}' r='${brushSize/2-1}' fill='rgba(255,80,80,0.5)' stroke='red' stroke-width='1'/></svg>") ${brushSize/2} ${brushSize/2}, crosshair`, userSelect: 'none', touchAction: 'none', borderRadius: 8, overflow: 'hidden' }}
            >
              <canvas ref={canvasRef} style={{ display: 'block', width: '100%', maxHeight: 400, objectFit: 'contain' }} />
              <canvas ref={maskRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
            </div>
          </div>

          <button onClick={applyInpaint} disabled={processing || strokes.length === 0} style={{ ...btn, opacity: strokes.length === 0 ? 0.5 : 1 }}>
            {processing ? 'Processing…' : 'Apply Inpainting'}
          </button>
        </>
      )}

      {result && (
        <div>
          <BeforeAfterSlider beforeSrc={preview} afterSrc={result} beforeLabel="Original" afterLabel="Watermark Removed" />
          <div style={{ ...card, marginTop: 12 }}>
            <a href={result} download="watermark-removed.jpg" style={{ display: 'block', textAlign: 'center', color: '#a78bfa', background: 'rgba(124,58,237,0.15)', borderRadius: 10, padding: '12px', textDecoration: 'none', fontWeight: 700 }}>
              Download
            </a>
          </div>
          <SmartRecommendation currentSlug="remove-watermark" />
        </div>
      )}
    </div>
  )
}
