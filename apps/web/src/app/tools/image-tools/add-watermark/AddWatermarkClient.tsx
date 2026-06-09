'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }

type Position = 'TL'|'TC'|'TR'|'ML'|'MC'|'MR'|'BL'|'BC'|'BR'
const POSITIONS: Position[] = ['TL','TC','TR','ML','MC','MR','BL','BC','BR']

function getXY(pos: Position, w: number, h: number, fontSize: number, padding: number): { x: number; y: number; align: CanvasTextAlign } {
  const map: Record<Position, { x: number; y: number; align: CanvasTextAlign }> = {
    TL: { x: padding, y: padding + fontSize, align: 'left' },
    TC: { x: w/2, y: padding + fontSize, align: 'center' },
    TR: { x: w - padding, y: padding + fontSize, align: 'right' },
    ML: { x: padding, y: h/2, align: 'left' },
    MC: { x: w/2, y: h/2, align: 'center' },
    MR: { x: w - padding, y: h/2, align: 'right' },
    BL: { x: padding, y: h - padding, align: 'left' },
    BC: { x: w/2, y: h - padding, align: 'center' },
    BR: { x: w - padding, y: h - padding, align: 'right' },
  }
  return map[pos]
}

export default function AddWatermarkClient() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [text, setText] = useState('© My Brand')
  const [fontSize, setFontSize] = useState(32)
  const [opacity, setOpacity] = useState(70)
  const [position, setPosition] = useState<Position>('BR')
  const [color, setColor] = useState('#ffffff')
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
    if (!imgObj || !text) return
    const w = imgObj.naturalWidth, h = imgObj.naturalHeight
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(imgObj, 0, 0)
    const { x, y, align } = getXY(position, w, h, fontSize, 20)
    ctx.globalAlpha = opacity / 100
    ctx.fillStyle = color
    ctx.font = `bold ${fontSize}px Arial, sans-serif`
    ctx.textAlign = align
    ctx.fillText(text, x, y)
    ctx.globalAlpha = 1
    setResult(canvas.toDataURL('image/jpeg', 0.95))
  }, [imgObj, text, fontSize, opacity, position, color])

  useEffect(() => { if (imgObj && text) apply() }, [imgObj, text, fontSize, opacity, position, color, apply])

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
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Watermark Text</label>
            <input style={inp} value={text} onChange={e => setText(e.target.value)} placeholder="© Your Brand" />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            <div>
              <label style={lbl}>Font Size: {fontSize}px</label>
              <input type="range" min="8" max="200" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={inp} />
            </div>
            <div>
              <label style={lbl}>Opacity: {opacity}%</label>
              <input type="range" min="1" max="100" value={opacity} onChange={e => setOpacity(Number(e.target.value))} style={inp} />
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Color</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ ...inp, height:44, padding:4, cursor:'pointer' }} />
          </div>
          <div>
            <label style={lbl}>Position</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
              {POSITIONS.map(p => (
                <button key={p} onClick={() => setPosition(p)}
                  style={{ background: position===p ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#1e1e3f', color:'#e0e0ff', border:'none', borderRadius:6, padding:'8px', cursor:'pointer', fontSize:13 }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {result && (
        <div>
          <BeforeAfterSlider
            beforeSrc={preview}
            afterSrc={result}
            beforeLabel="Original"
            afterLabel="Watermarked"
          />
          <div style={{ ...card, marginTop:12 }}>
            <a href={result} download="watermarked.jpg" style={{ display:'block', textAlign:'center', color:'#a78bfa', background:'rgba(124,58,237,0.15)', borderRadius:10, padding:'12px', textDecoration:'none', fontWeight:700 }}>Download Watermarked Image</a>
          </div>
          <SmartRecommendation currentSlug="add-watermark" />
        </div>
      )}
    </div>
  )
}
