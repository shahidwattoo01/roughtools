/* eslint-disable @typescript-eslint/no-unused-vars, prefer-const, no-empty, no-useless-escape, react-hooks/exhaustive-deps, no-irregular-whitespace */
'use client'
import React, { useState, useRef, useCallback } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

type Layout = '2side' | '3row' | '2x2' | '1big2small' | '3x2'

const LAYOUTS: { id: Layout; label: string; min: number; max: number; desc: string }[] = [
  { id:'2side', label:'2 Side by Side', min:2, max:2, desc:'Two equal panels' },
  { id:'3row', label:'3 in a Row', min:3, max:3, desc:'Three equal columns' },
  { id:'2x2', label:'2×2 Grid', min:4, max:4, desc:'Four equal panels' },
  { id:'1big2small', label:'1 Big + 2 Small', min:3, max:3, desc:'Feature image left' },
  { id:'3x2', label:'3×2 Grid', min:6, max:6, desc:'Six equal panels' },
]

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const imgRatio = img.naturalWidth / img.naturalHeight
  const targetRatio = w / h
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
  if (imgRatio > targetRatio) { sw = sh * targetRatio; sx = (img.naturalWidth - sw) / 2 }
  else { sh = sw / targetRatio; sy = (img.naturalHeight - sh) / 2 }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

export default function CollageClient() {
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [layout, setLayout] = useState<Layout>('2side')
  const [gap, setGap] = useState(8)
  const [bgColor, setBgColor] = useState('#1a1a2e')
  const [result, setResult] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (fl: FileList | null) => {
    if (!fl) return
    const fileArr = Array.from(fl).filter(f => f.type.startsWith('image/')).slice(0, 6)
    setFiles(fileArr); setImages([]); setResult('')
    const imgs: HTMLImageElement[] = []
    let loaded = 0
    fileArr.forEach((f, i) => {
      const url = URL.createObjectURL(f)
      const img = new window.Image()
      img.onload = () => {
        imgs[i] = img
        if (++loaded === fileArr.length) setImages([...imgs])
      }
      img.src = url
    })
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [])

  const generate = () => {
    if (!images.length) return
    const totalW = 1200, cellSize = 400, g = gap
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const fill = (cw: number, ch: number, cells: { x:number;y:number;w:number;h:number }[]) => {
      canvas.width = cw; canvas.height = ch
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, cw, ch)
      cells.forEach((cell, i) => {
        if (images[i]) drawCover(ctx, images[i], cell.x, cell.y, cell.w, cell.h)
      })
    }

    if (layout === '2side') {
      const cw = (totalW - g) / 2
      fill(totalW, cellSize, [{ x:0,y:0,w:cw,h:cellSize }, { x:cw+g,y:0,w:cw,h:cellSize }])
    } else if (layout === '3row') {
      const cw = (totalW - g*2) / 3
      fill(totalW, cellSize, [0,1,2].map(i => ({ x:i*(cw+g),y:0,w:cw,h:cellSize })))
    } else if (layout === '2x2') {
      const cw = (totalW - g) / 2
      fill(totalW, cw*2+g, [
        { x:0,y:0,w:cw,h:cw }, { x:cw+g,y:0,w:cw,h:cw },
        { x:0,y:cw+g,w:cw,h:cw }, { x:cw+g,y:cw+g,w:cw,h:cw },
      ])
    } else if (layout === '1big2small') {
      const bigW = Math.floor(totalW * 0.6)
      const smallW = totalW - bigW - g
      const smallH = (cellSize - g) / 2
      fill(totalW, cellSize, [
        { x:0,y:0,w:bigW,h:cellSize },
        { x:bigW+g,y:0,w:smallW,h:smallH },
        { x:bigW+g,y:smallH+g,w:smallW,h:smallH },
      ])
    } else if (layout === '3x2') {
      const cw = (totalW - g*2) / 3
      fill(totalW, cw*2+g, [
        ...[0,1,2].map(i => ({ x:i*(cw+g),y:0,w:cw,h:cw })),
        ...[0,1,2].map(i => ({ x:i*(cw+g),y:cw+g,w:cw,h:cw })),
      ])
    }
    setResult(canvas.toDataURL('image/jpeg', 0.95))
  }

  const currentLayout = LAYOUTS.find(l => l.id === layout)!

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
          <div style={{ fontSize:36 }}>🖼️</div>
          <div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop 2–6 images or click to upload</div>
          <div style={{ fontSize:13, color:'#888', marginTop:4 }}>Max 6 images for collage</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e => handleFiles(e.target.files)} />
        {files.length > 0 && <div style={{ marginTop:10, color:'#a78bfa', fontSize:13 }}>{files.length} image(s) selected</div>}
      </div>

      <div style={card}>
        <label style={lbl}>Layout</label>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
          {LAYOUTS.map(l => (
            <button key={l.id} onClick={() => setLayout(l.id)}
              style={{ background: layout===l.id ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#1e1e3f', color:'#e0e0ff', border:'none', borderRadius:8, padding:'10px', cursor:'pointer', textAlign:'left' }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{l.label}</div>
              <div style={{ fontSize:11, color: layout===l.id ? 'var(--fg-2)' : 'var(--fg-3)', marginTop:2 }}>{l.desc} ({l.min} images)</div>
            </button>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label style={lbl}>Gap: {gap}px</label>
            <input type="range" min="0" max="20" value={gap} onChange={e => setGap(Number(e.target.value))} style={inp} />
          </div>
          <div>
            <label style={lbl}>Background Color</label>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ ...inp, height:44, padding:4, cursor:'pointer' }} />
          </div>
        </div>
        {images.length > 0 && images.length < currentLayout.min && (
          <div style={{ marginTop:12, color:'#fbbf24', fontSize:13 }}>⚠️ This layout needs {currentLayout.min} images. You have {images.length}.</div>
        )}
      </div>

      <button style={btn} onClick={generate} disabled={images.length < currentLayout.min}>Create Collage</button>

      {result && (
        <div>
          <div style={card}>
            <label style={lbl}>Collage Preview</label>
            <img src={result} alt="collage" style={{ maxWidth:'100%', borderRadius:8, marginBottom:12 }} />
            <a href={result} download="collage.jpg" style={{ display:'block', textAlign:'center', color:'#a78bfa', background:'rgba(124,58,237,0.15)', borderRadius:10, padding:'12px', textDecoration:'none', fontWeight:700 }}>Download Collage JPG</a>
          </div>
          <SmartRecommendation currentSlug="photo-collage-maker" />
        </div>
      )}
    </div>
  )
}
