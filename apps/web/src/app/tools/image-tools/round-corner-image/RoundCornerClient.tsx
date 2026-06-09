'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }

export default function RoundCornerClient() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [radiusPct, setRadiusPct] = useState(10)
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

  const apply = useCallback(() => {
    if (!imgObj) return
    const w = imgObj.naturalWidth, h = imgObj.naturalHeight
    const r = Math.min(w, h) * (radiusPct / 100)
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.beginPath()
    ctx.moveTo(r, 0)
    ctx.lineTo(w - r, 0)
    ctx.quadraticCurveTo(w, 0, w, r)
    ctx.lineTo(w, h - r)
    ctx.quadraticCurveTo(w, h, w - r, h)
    ctx.lineTo(r, h)
    ctx.quadraticCurveTo(0, h, 0, h - r)
    ctx.lineTo(0, r)
    ctx.quadraticCurveTo(0, 0, r, 0)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(imgObj, 0, 0)
    setResult(canvas.toDataURL('image/png'))
  }, [imgObj, radiusPct])

  useEffect(() => { if (imgObj) apply() }, [imgObj, radiusPct, apply])

  const isCircle = radiusPct === 50
  const label = isCircle ? 'Circle (50%)' : `${radiusPct}%`

  return (
    <div>
      <div style={card}>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border:`2px dashed ${dragging ? '#7c3aed' : 'rgba(167,139,250,0.3)'}`, borderRadius:10, padding:'32px', textAlign:'center', cursor:'pointer', color:'#a78bfa' }}
        >
          {preview
            ? <img src={preview} alt="original" style={{ maxHeight:160, maxWidth:'100%', borderRadius:8 }} />
            : <><div style={{ fontSize:36 }}>🖼️</div><div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop image or click to upload</div></>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {imgObj && (
        <div style={card}>
          <label style={lbl}>Corner Radius: {label}</label>
          <input type="range" min="0" max="50" value={radiusPct} onChange={e => setRadiusPct(Number(e.target.value))} style={inp} />
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#888', marginTop:4 }}>
            <span>Square (0%)</span><span>Circle (50%)</span>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:12, flexWrap:'wrap' }}>
            {[0, 5, 10, 20, 30, 50].map(v => (
              <button key={v} onClick={() => setRadiusPct(v)} style={{ background: radiusPct===v ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#1e1e3f', color:'#e0e0ff', border:'none', borderRadius:6, padding:'6px 14px', cursor:'pointer', fontSize:13 }}>
                {v === 50 ? 'Circle' : `${v}%`}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div>
          <BeforeAfterSlider
            beforeSrc={preview}
            afterSrc={result}
            beforeLabel="Original"
            afterLabel={isCircle ? 'Circle' : `${radiusPct}% Rounded`}
          />
          <div style={{ ...card, marginTop:12 }}>
            <label style={lbl}>Preview (checkerboard = transparent)</label>
            <div style={{ background:'repeating-conic-gradient(#222 0% 25%, #333 0% 50%) 0 0/20px 20px', borderRadius:8, marginBottom:12, textAlign:'center' }}>
              <img src={result} alt="rounded" style={{ maxWidth:'100%', maxHeight:300 }} />
            </div>
            <a href={result} download="rounded-corners.png" style={{ display:'block', textAlign:'center', color:'#a78bfa', background:'rgba(124,58,237,0.15)', borderRadius:10, padding:'12px', textDecoration:'none', fontWeight:700 }}>Download PNG (transparent corners)</a>
          </div>
          <SmartRecommendation currentSlug="round-corner-image" />
        </div>
      )}
    </div>
  )
}
