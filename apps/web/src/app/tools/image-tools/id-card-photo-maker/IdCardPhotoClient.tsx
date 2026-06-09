'use client'
import React, { useState, useRef, useCallback } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

const PRESETS = [
  { name:'Standard ID Card', w:1012, h:638, desc:'85.6×54mm @ 300dpi' },
  { name:'Driving License', w:1012, h:638, desc:'85.6×54mm @ 300dpi' },
  { name:'Business Card', w:1050, h:600, desc:'3.5×2in @ 300dpi' },
  { name:'Student ID', w:1012, h:638, desc:'85.6×54mm @ 300dpi' },
  { name:'US Passport Photo', w:600, h:600, desc:'2×2in @ 300dpi' },
  { name:'Custom', w:0, h:0, desc:'Set your own dimensions' },
]

export default function IdCardPhotoClient() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [presetIdx, setPresetIdx] = useState(0)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [customW, setCustomW] = useState('800')
  const [customH, setCustomH] = useState('600')
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

  const generate = () => {
    if (!imgObj) return
    const preset = PRESETS[presetIdx]
    const tw = preset.name === 'Custom' ? parseInt(customW) || 800 : preset.w
    const th = preset.name === 'Custom' ? parseInt(customH) || 600 : preset.h

    const canvas = document.createElement('canvas')
    canvas.width = tw; canvas.height = th
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, tw, th)

    const imgRatio = imgObj.naturalWidth / imgObj.naturalHeight
    const targetRatio = tw / th
    let sx = 0, sy = 0, sw = imgObj.naturalWidth, sh = imgObj.naturalHeight
    if (imgRatio > targetRatio) { sw = imgObj.naturalHeight * targetRatio; sx = (imgObj.naturalWidth - sw) / 2 }
    else { sh = imgObj.naturalWidth / targetRatio; sy = (imgObj.naturalHeight - sh) / 2 }
    ctx.drawImage(imgObj, sx, sy, sw, sh, 0, 0, tw, th)
    setResult(canvas.toDataURL('image/jpeg', 0.97))
  }

  const selectedPreset = PRESETS[presetIdx]

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
            : <><div style={{ fontSize:36 }}>🪪</div><div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop photo or click to upload</div></>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      <div style={card}>
        <label style={lbl}>ID Card Size</label>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
          {PRESETS.map((p, i) => (
            <button key={i} onClick={() => setPresetIdx(i)}
              style={{ background: presetIdx===i ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#1e1e3f', color:'#e0e0ff', border:'none', borderRadius:8, padding:'10px', cursor:'pointer', textAlign:'left' }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{p.name}</div>
              <div style={{ fontSize:11, color: presetIdx===i ? 'rgba(255,255,255,0.7)' : '#888', marginTop:2 }}>{p.desc}</div>
            </button>
          ))}
        </div>
        {selectedPreset.name === 'Custom' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
            <div><label style={lbl}>Width (px)</label><input style={inp} type="number" value={customW} onChange={e => setCustomW(e.target.value)} /></div>
            <div><label style={lbl}>Height (px)</label><input style={inp} type="number" value={customH} onChange={e => setCustomH(e.target.value)} /></div>
          </div>
        )}
        <label style={lbl}>Background Color</label>
        <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ ...inp, height:44, padding:4, cursor:'pointer', marginBottom:16 }} />
        <button style={btn} onClick={generate} disabled={!imgObj}>Generate ID Card Photo</button>
      </div>

      {result && (
        <div>
          <BeforeAfterSlider
            beforeSrc={preview}
            afterSrc={result}
            beforeLabel="Original"
            afterLabel={selectedPreset.name}
          />
          <div style={{ ...card, marginTop:12 }}>
            <label style={lbl}>Result: {selectedPreset.name}</label>
            <img src={result} alt="id card" style={{ maxWidth:'100%', borderRadius:8, marginBottom:12, border:'1px solid rgba(255,255,255,0.1)' }} />
            <a href={result} download="id-card-photo.jpg" style={{ display:'block', textAlign:'center', color:'#a78bfa', background:'rgba(124,58,237,0.15)', borderRadius:10, padding:'12px', textDecoration:'none', fontWeight:700 }}>Download JPG</a>
          </div>
          <SmartRecommendation currentSlug="id-card-photo-maker" />
        </div>
      )}
    </div>
  )
}
