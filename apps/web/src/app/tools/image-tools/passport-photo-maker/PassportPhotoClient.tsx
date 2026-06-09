'use client'
import { useState, useRef } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }

const SIZES = [
  { label:'US Passport (2×2 inch)', w:600, h:600, print:'2×2 inch (51×51mm)' },
  { label:'UK Passport (35×45mm)', w:413, h:531, print:'35×45mm' },
  { label:'EU Standard (35×45mm)', w:413, h:531, print:'35×45mm' },
  { label:'India Passport (35×45mm)', w:413, h:531, print:'35×45mm' },
  { label:'China Visa (33×48mm)', w:390, h:567, print:'33×48mm' },
  { label:'Schengen Visa (35×45mm)', w:413, h:531, print:'35×45mm' },
  { label:'South Korea (3.5×4.5cm)', w:413, h:531, print:'35×45mm' },
  { label:"Driver's License (1.5×1.75 in)", w:450, h:525, print:'1.5×1.75 inch' },
]

export default function PassportPhotoClient() {
  const [preview, setPreview] = useState('')
  const [sizeIdx, setSizeIdx] = useState(0)
  const [result, setResult] = useState('')
  const [bgColor, setBgColor] = useState('#ffffff')
  const imgRef = useRef<HTMLImageElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f)
    setPreview(url)
    setResult('')
    const img = new Image()
    img.onload = () => { imgRef.current = img }
    img.src = url
  }

  const generate = () => {
    if (!imgRef.current) return
    const img = imgRef.current
    const size = SIZES[sizeIdx]
    const c = document.createElement('canvas')
    c.width = size.w; c.height = size.h
    const ctx = c.getContext('2d')!
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size.w, size.h)
    const scale = Math.min(size.w / img.width, size.h / img.height)
    const sw = img.width * scale
    const sh = img.height * scale
    ctx.drawImage(img, (size.w - sw) / 2, (size.h - sh) / 2, sw, sh)
    setResult(c.toDataURL('image/jpeg', 0.95))
  }

  const generateSheet = () => {
    if (!imgRef.current || !result) return
    const size = SIZES[sizeIdx]
    const sheetW = 1800, sheetH = 1200
    const padding = 20
    const cols = Math.floor(sheetW / (size.w + padding))
    const rows = Math.floor(sheetH / (size.h + padding))
    const c = document.createElement('canvas')
    c.width = sheetW; c.height = sheetH
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, sheetW, sheetH)
    const photoImg = new Image()
    photoImg.onload = () => {
      for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) {
        ctx.drawImage(photoImg, padding + col * (size.w + padding), padding + r * (size.h + padding), size.w, size.h)
      }
      const a = document.createElement('a'); a.href = c.toDataURL('image/jpeg', 0.95); a.download = 'passport_sheet.jpg'; a.click()
    }
    photoImg.src = result
  }

  return (
    <div>
      <div style={card}>
        <div onClick={() => inputRef.current?.click()} style={{ border:'2px dashed rgba(167,139,250,0.3)', borderRadius:10, padding:'32px', textAlign:'center', cursor:'pointer' }}>
          {preview
            ? <img src={preview} alt="preview" style={{ maxWidth:'100%', maxHeight:250 }} />
            : <><div style={{ fontSize:40, marginBottom:8 }}>🪪</div><div style={{ color:'#888', fontSize:14 }}>Click to upload your photo</div></>
          }
          <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      </div>
      <div style={card}>
        <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:8 }}>Select Photo Size</label>
        {SIZES.map((s, i) => (
          <label key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', cursor:'pointer', borderBottom:'1px solid rgba(167,139,250,0.08)' }}>
            <input type="radio" name="size" checked={sizeIdx===i} onChange={() => setSizeIdx(i)} style={{ accentColor:'#7c3aed' }} />
            <span style={{ flex:1, fontSize:13, color:'#e0e0ff' }}>{s.label}</span>
            <span style={{ fontSize:11, color:'#888' }}>{s.w}×{s.h}px / {s.print}</span>
          </label>
        ))}
      </div>
      <div style={card}>
        <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:8 }}>Background Color</label>
        <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
          {['#ffffff','#e8f4fd','#f0f0f0'].map(c => (
            <div key={c} onClick={() => setBgColor(c)} style={{ width:36, height:36, borderRadius:6, background:c, border:bgColor===c ? '3px solid #a78bfa' : '2px solid #444', cursor:'pointer' }} />
          ))}
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width:36, height:36, borderRadius:6, border:'none', cursor:'pointer', background:'none' }} />
          <span style={{ fontSize:12, color:'#888' }}>Custom color</span>
        </div>
      </div>
      <button onClick={generate} disabled={!preview} style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24, opacity: !preview ? 0.5 : 1 }}>
        Generate Passport Photo
      </button>

      {result && (
        <div>
          <BeforeAfterSlider
            beforeSrc={preview}
            afterSrc={result}
            beforeLabel="Original"
            afterLabel={SIZES[sizeIdx].label}
          />
          <div style={{ ...card, marginTop:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, flexWrap:'wrap', gap:8 }}>
              <span style={{ fontSize:14, fontWeight:700, color:'#a78bfa' }}>Passport Photo — {SIZES[sizeIdx].label}</span>
              <div style={{ display:'flex', gap:8 }}>
                <a href={result} download="passport_photo.jpg" style={{ background:'rgba(124,58,237,0.2)', border:'1px solid rgba(124,58,237,0.3)', color:'#a78bfa', borderRadius:6, padding:'8px 12px', fontSize:12, fontWeight:600, textDecoration:'none' }}>Download Photo</a>
                <button onClick={generateSheet} style={{ background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.3)', color:'#4ade80', borderRadius:6, padding:'8px 12px', fontSize:12, fontWeight:600, cursor:'pointer' }}>Download Sheet (6 photos)</button>
              </div>
            </div>
            <div style={{ textAlign:'center', background:'#1a1a2e', borderRadius:8, padding:16 }}>
              <img src={result} alt="passport photo" style={{ maxWidth:'100%', maxHeight:300, borderRadius:4, border:'2px solid #ccc' }} />
            </div>
            <p style={{ fontSize:12, color:'#666', marginTop:8 }}>Printed size: {SIZES[sizeIdx].print} | Resolution: {SIZES[sizeIdx].w}×{SIZES[sizeIdx].h}px at 300 DPI</p>
          </div>
          <SmartRecommendation currentSlug="passport-photo-maker" />
        </div>
      )}
    </div>
  )
}
