'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }

export default function AddBorderClient() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [borderWidth, setBorderWidth] = useState(20)
  const [borderColor, setBorderColor] = useState('#ffffff')
  const [innerShadow, setInnerShadow] = useState(false)
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
    const bw = borderWidth
    const w = imgObj.naturalWidth + bw * 2
    const h = imgObj.naturalHeight + bw * 2
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = borderColor
    ctx.fillRect(0, 0, w, h)
    if (innerShadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = Math.min(bw, 20)
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }
    ctx.drawImage(imgObj, bw, bw)
    setResult(canvas.toDataURL('image/jpeg', 0.95))
  }, [imgObj, borderWidth, borderColor, innerShadow])

  useEffect(() => { if (imgObj) apply() }, [imgObj, borderWidth, borderColor, innerShadow, apply])

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
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
            <div>
              <label style={lbl}>Border Width: {borderWidth}px</label>
              <input type="range" min="0" max="100" value={borderWidth} onChange={e => setBorderWidth(Number(e.target.value))} style={inp} />
            </div>
            <div>
              <label style={lbl}>Border Color</label>
              <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} style={{ ...inp, height:44, padding:4, cursor:'pointer' }} />
            </div>
          </div>
          <label style={{ ...lbl, display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
            <input type="checkbox" checked={innerShadow} onChange={e => setInnerShadow(e.target.checked)} />
            Add inner shadow effect
          </label>
        </div>
      )}

      {result && (
        <div>
          <BeforeAfterSlider
            beforeSrc={preview}
            afterSrc={result}
            beforeLabel="Original"
            afterLabel={`With ${borderWidth}px Border`}
          />
          <div style={{ ...card, marginTop:12 }}>
            <a href={result} download="with-border.jpg" style={{ display:'block', textAlign:'center', color:'#a78bfa', background:'rgba(124,58,237,0.15)', borderRadius:10, padding:'12px', textDecoration:'none', fontWeight:700 }}>Download</a>
          </div>
          <SmartRecommendation currentSlug="add-border" />
        </div>
      )}
    </div>
  )
}
