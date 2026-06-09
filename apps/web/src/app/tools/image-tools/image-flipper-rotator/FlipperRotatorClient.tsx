'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }

interface Transform { flipH: boolean; flipV: boolean; angle: number }

function renderTransform(img: HTMLImageElement, t: Transform): string {
  const rad = t.angle * Math.PI / 180
  const sin = Math.abs(Math.sin(rad))
  const cos = Math.abs(Math.cos(rad))
  const w = Math.round(img.naturalWidth * cos + img.naturalHeight * sin)
  const h = Math.round(img.naturalWidth * sin + img.naturalHeight * cos)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.translate(w / 2, h / 2)
  ctx.rotate(rad)
  ctx.scale(t.flipH ? -1 : 1, t.flipV ? -1 : 1)
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
  return canvas.toDataURL('image/png')
}

export default function FlipperRotatorClient() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [transform, setTransform] = useState<Transform>({ flipH: false, flipV: false, angle: 0 })
  const [customAngle, setCustomAngle] = useState('0')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f)
    setPreview(url)
    const img = new window.Image()
    img.onload = () => setImgObj(img)
    img.src = url
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, []) // eslint-disable-line

  useEffect(() => {
    if (imgObj) setResult(renderTransform(imgObj, transform))
  }, [imgObj, transform])

  const applyCustomAngle = () => {
    const a = parseFloat(customAngle) || 0
    setTransform(t => ({ ...t, angle: a }))
  }

  const ActionBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick} style={{ background:'#1e1e3f', color:'#e0e0ff', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 16px', cursor:'pointer', fontSize:14, fontWeight:600 }}>{label}</button>
  )

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
          <label style={lbl}>Flip</label>
          <div style={{ display:'flex', gap:10, marginBottom:16 }}>
            <ActionBtn label="↔ Flip Horizontal" onClick={() => setTransform(t => ({ ...t, flipH: !t.flipH }))} />
            <ActionBtn label="↕ Flip Vertical" onClick={() => setTransform(t => ({ ...t, flipV: !t.flipV }))} />
          </div>
          <label style={lbl}>Rotate</label>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
            <ActionBtn label="↻ 90° CW" onClick={() => setTransform(t => ({ ...t, angle: (t.angle + 90) % 360 }))} />
            <ActionBtn label="↺ 90° CCW" onClick={() => setTransform(t => ({ ...t, angle: (t.angle - 90 + 360) % 360 }))} />
            <ActionBtn label="180°" onClick={() => setTransform(t => ({ ...t, angle: (t.angle + 180) % 360 }))} />
          </div>
          <label style={lbl}>Custom Angle (degrees)</label>
          <div style={{ display:'flex', gap:10, marginBottom:16 }}>
            <input style={{ ...inp, width:'auto', flex:1 }} type="number" value={customAngle} onChange={e => setCustomAngle(e.target.value)} placeholder="45" />
            <button onClick={applyCustomAngle} style={{ background:'rgba(124,58,237,0.3)', color:'#a78bfa', border:'1px solid rgba(124,58,237,0.4)', borderRadius:8, padding:'10px 20px', cursor:'pointer' }}>Apply</button>
          </div>
          <div style={{ color:'#888', fontSize:13 }}>Current: flipH={transform.flipH ? 'on' : 'off'}, flipV={transform.flipV ? 'on' : 'off'}, angle={transform.angle}°</div>
        </div>
      )}

      {result && (
        <div>
          <BeforeAfterSlider
            beforeSrc={preview}
            afterSrc={result}
            beforeLabel="Original"
            afterLabel="Transformed"
          />
          <div style={{ ...card, marginTop:12 }}>
            <a href={result} download="transformed.png" style={{ display:'block', textAlign:'center', color:'#a78bfa', background:'rgba(124,58,237,0.15)', borderRadius:10, padding:'12px', textDecoration:'none', fontWeight:700 }}>Download PNG</a>
          </div>
          <SmartRecommendation currentSlug="image-flipper-rotator" />
        </div>
      )}
    </div>
  )
}
