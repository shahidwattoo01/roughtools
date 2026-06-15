'use client'
import React, { useState, useRef, useCallback } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

const PRESETS = [
  { name:'YouTube Thumbnail', w:1280, h:720 },
  { name:'YouTube Short', w:1080, h:1920 },
  { name:'Instagram Post', w:1080, h:1080 },
  { name:'Instagram Story', w:1080, h:1920 },
  { name:'Twitter/X Post', w:1600, h:900 },
  { name:'Facebook Post', w:1200, h:630 },
  { name:'LinkedIn', w:1200, h:628 },
  { name:'Pinterest', w:1000, h:1500 },
]

type TextPosition = 'top' | 'center' | 'bottom'

export default function ThumbnailMakerClient() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [results, setResults] = useState<{ name: string; url: string }[]>([])
  const [selected, setSelected] = useState<number[]>([0])
  const [titleText, setTitleText] = useState('')
  const [textPos, setTextPos] = useState<TextPosition>('bottom')
  const [textSize, setTextSize] = useState(60)
  const [textColor, setTextColor] = useState('#ffffff')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f)
    setPreview(url); setResults([])
    const img = new window.Image()
    img.onload = () => setImgObj(img)
    img.src = url
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, []) // eslint-disable-line

  const togglePreset = (i: number) => setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  const generateAll = () => {
    if (!imgObj) return
    const out: { name: string; url: string }[] = []
    for (const idx of selected) {
      const p = PRESETS[idx]
      const canvas = document.createElement('canvas')
      canvas.width = p.w; canvas.height = p.h
      const ctx = canvas.getContext('2d')!

      const imgRatio = imgObj.naturalWidth / imgObj.naturalHeight
      const targetRatio = p.w / p.h
      let sx = 0, sy = 0, sw = imgObj.naturalWidth, sh = imgObj.naturalHeight
      if (imgRatio > targetRatio) { sw = sh * targetRatio; sx = (imgObj.naturalWidth - sw) / 2 }
      else { sh = sw / targetRatio; sy = (imgObj.naturalHeight - sh) / 2 }
      ctx.drawImage(imgObj, sx, sy, sw, sh, 0, 0, p.w, p.h)

      if (titleText) {
        const fontSize = Math.round(textSize * p.w / 1280)
        ctx.font = `bold ${fontSize}px Arial, sans-serif`
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        const bannerH = fontSize * 2
        const bannerY = textPos === 'top' ? 0 : textPos === 'center' ? (p.h - bannerH) / 2 : p.h - bannerH
        ctx.fillRect(0, bannerY, p.w, bannerH)
        ctx.fillStyle = textColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(titleText, p.w / 2, bannerY + bannerH / 2)
      }
      out.push({ name: `${p.name.replace(/\//g,'-').replace(/\s+/g,'-').toLowerCase()}.jpg`, url: canvas.toDataURL('image/jpeg', 0.95) })
    }
    setResults(out)
  }

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
            ? <img src={preview} alt="original" style={{ maxHeight:180, maxWidth:'100%', borderRadius:8 }} />
            : <><div style={{ fontSize:36 }}>🖼️</div><div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop image or click to upload</div></>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      <div style={card}>
        <label style={lbl}>Select Thumbnail Sizes</label>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
          {PRESETS.map((p, i) => (
            <button key={i} onClick={() => togglePreset(i)}
              style={{ background: selected.includes(i) ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#1e1e3f', color:'#e0e0ff', border:'none', borderRadius:8, padding:'10px', cursor:'pointer', textAlign:'left' }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{p.name}</div>
              <div style={{ fontSize:11, color: selected.includes(i) ? 'var(--fg-2)' : 'var(--fg-3)', marginTop:2 }}>{p.w}×{p.h}</div>
            </button>
          ))}
        </div>

        <label style={lbl}>Title Text (optional)</label>
        <input style={inp} value={titleText} onChange={e => setTitleText(e.target.value)} placeholder="Your thumbnail title…" />

        {titleText && (
          <div style={{ marginTop:14 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <div>
                <label style={lbl}>Text Size: {textSize}px</label>
                <input type="range" min="20" max="120" value={textSize} onChange={e => setTextSize(Number(e.target.value))} style={inp} />
              </div>
              <div>
                <label style={lbl}>Text Color</label>
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} style={{ ...inp, height:44, padding:4, cursor:'pointer' }} />
              </div>
            </div>
            <label style={lbl}>Text Position</label>
            <div style={{ display:'flex', gap:8 }}>
              {(['top','center','bottom'] as TextPosition[]).map(p => (
                <button key={p} onClick={() => setTextPos(p)} style={{ flex:1, background: textPos===p ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#1e1e3f', color:'#e0e0ff', border:'none', borderRadius:8, padding:'8px', cursor:'pointer', textTransform:'capitalize' }}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button style={btn} onClick={generateAll} disabled={!imgObj || !selected.length}>Generate {selected.length} Thumbnail{selected.length !== 1 ? 's' : ''}</button>

      {results.length > 0 && (
        <div>
          <div style={{ background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:10, padding:'10px 16px', marginBottom:16, textAlign:'center' }}>
            <span style={{ fontSize:14, fontWeight:700, color:'#4ade80' }}>✅ Generated {results.length} thumbnail{results.length !== 1 ? 's' : ''}</span>
          </div>
          <div style={card}>
            {results.map((r, i) => (
              <div key={i} style={{ marginBottom:16 }}>
                <div style={{ color:'#a78bfa', fontSize:13, fontWeight:700, marginBottom:6 }}>{PRESETS[selected[i]]?.name}</div>
                <img src={r.url} alt={r.name} style={{ maxWidth:'100%', borderRadius:8, marginBottom:8 }} />
                <a href={r.url} download={r.name} style={{ display:'block', textAlign:'center', color:'#a78bfa', background:'rgba(124,58,237,0.15)', borderRadius:8, padding:'8px', textDecoration:'none', fontWeight:700, fontSize:13 }}>Download</a>
              </div>
            ))}
          </div>
          <SmartRecommendation currentSlug="thumbnail-maker" />
        </div>
      )}
    </div>
  )
}
