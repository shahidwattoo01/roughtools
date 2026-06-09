/* eslint-disable @typescript-eslint/no-unused-vars, prefer-const, no-empty, no-useless-escape, react-hooks/exhaustive-deps */
'use client'
import React, { useState, useRef, useCallback } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }

interface PickedColor { hex: string; rgb: string; hsl: string; r: number; g: number; b: number }

function rgbToHsl(r: number, g: number, b: number) {
  const nr = r/255, ng = g/255, nb = b/255
  const max = Math.max(nr,ng,nb), min = Math.min(nr,ng,nb)
  let h = 0, s = 0, l = (max+min)/2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d/(2-max-min) : d/(max+min)
    if (max === nr) h = ((ng-nb)/d + (ng < nb ? 6 : 0)) / 6
    else if (max === ng) h = ((nb-nr)/d + 2) / 6
    else h = ((nr-ng)/d + 4) / 6
  }
  return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`
}

export default function ColorPickerClient() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [currentColor, setCurrentColor] = useState<PickedColor | null>(null)
  const [history, setHistory] = useState<PickedColor[]>([])
  const [copied, setCopied] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f)
    const img = new window.Image()
    img.onload = () => {
      setImgObj(img)
      if (canvasRef.current) {
        canvasRef.current.width = img.naturalWidth
        canvasRef.current.height = img.naturalHeight
        canvasRef.current.getContext('2d')!.drawImage(img, 0, 0)
      }
    }
    img.src = url
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, [])

  const pickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = canvasRef.current.width / rect.width
    const scaleY = canvasRef.current.height / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)
    const px = canvasRef.current.getContext('2d')!.getImageData(x, y, 1, 1).data
    const hex = '#' + [px[0],px[1],px[2]].map(v => v.toString(16).padStart(2,'0')).join('')
    const rgb = `rgb(${px[0]}, ${px[1]}, ${px[2]})`
    const hsl = rgbToHsl(px[0], px[1], px[2])
    const color: PickedColor = { hex, rgb, hsl, r: px[0], g: px[1], b: px[2] }
    setCurrentColor(color)
    setHistory(prev => [color, ...prev.slice(0, 9)])
  }

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div>
      <div style={card}>
        <div
          onClick={() => !imgObj && fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border:`2px dashed ${!imgObj && dragging ? '#7c3aed' : 'rgba(167,139,250,0.3)'}`, borderRadius:10, padding: imgObj ? '0' : '32px', textAlign:'center', cursor: imgObj ? 'default' : 'pointer', color:'#a78bfa', overflow:'hidden' }}
        >
          {imgObj ? (
            <canvas ref={canvasRef} onClick={pickColor} onMouseMove={e => { if (e.buttons === 1) pickColor(e) }} style={{ maxWidth:'100%', cursor:'crosshair', display:'block' }} />
          ) : (
            <><div style={{ fontSize:36 }}>🎨</div><div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop image or click to upload</div><div style={{ fontSize:13, color:'#888', marginTop:4 }}>Then hover/click to pick colors</div></>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {currentColor && (
        <div style={card}>
          <label style={lbl}>Current Color</label>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <div style={{ width:80, height:80, borderRadius:12, background:currentColor.hex, border:'2px solid rgba(255,255,255,0.2)', flexShrink:0 }} />
            <div style={{ flex:1 }}>
              {[{ label:'HEX', value: currentColor.hex }, { label:'RGB', value: currentColor.rgb }, { label:'HSL', value: currentColor.hsl }].map(c => (
                <div key={c.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <span style={{ color:'#a78bfa', fontSize:13, fontWeight:700, width:40 }}>{c.label}</span>
                  <span style={{ color:'#e0e0ff', fontSize:13, fontFamily:'monospace', flex:1 }}>{c.value}</span>
                  <button onClick={() => copy(c.value)} style={{ background: copied===c.value ? '#10b981' : 'rgba(124,58,237,0.2)', color:'#a78bfa', border:'none', borderRadius:6, padding:'4px 10px', fontSize:12, cursor:'pointer' }}>
                    {copied === c.value ? '✓' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <div style={card}>
            <label style={lbl}>Color History (last 10)</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {history.map((c, i) => (
                <div key={i} onClick={() => copy(c.hex)} title={c.hex} style={{ width:40, height:40, borderRadius:8, background:c.hex, border:'2px solid rgba(255,255,255,0.15)', cursor:'pointer', position:'relative' }}>
                  {copied === c.hex && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>✓</div>}
                </div>
              ))}
            </div>
            <div style={{ fontSize:12, color:'#888', marginTop:8 }}>Click a color swatch to copy its hex code</div>
          </div>
          <SmartRecommendation currentSlug="image-color-picker" />
        </div>
      )}
    </div>
  )
}
