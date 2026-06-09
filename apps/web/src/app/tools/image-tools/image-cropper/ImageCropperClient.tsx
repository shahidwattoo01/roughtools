'use client'
import { useState, useRef } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }

const RATIOS = [
  { label:'Free', w:0, h:0 }, { label:'1:1', w:1, h:1 }, { label:'4:3', w:4, h:3 },
  { label:'16:9', w:16, h:9 }, { label:'3:2', w:3, h:2 }, { label:'2:3', w:2, h:3 },
  { label:'9:16', w:9, h:16 }, { label:'5:4', w:5, h:4 },
]

export default function ImageCropperClient() {
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [ratio, setRatio] = useState(0)
  const [cropX, setCropX] = useState(10)
  const [cropY, setCropY] = useState(10)
  const [cropW, setCropW] = useState(80)
  const [cropH, setCropH] = useState(80)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setPreview(URL.createObjectURL(f))
    setResult('')
    setCropX(10); setCropY(10); setCropW(80); setCropH(80)
  }

  const crop = () => {
    if (!imgRef.current) return
    const img = imgRef.current
    const x = img.naturalWidth * cropX / 100
    const y = img.naturalHeight * cropY / 100
    const w = img.naturalWidth * cropW / 100
    const h = img.naturalHeight * cropH / 100
    const c = document.createElement('canvas')
    c.width = w; c.height = h
    c.getContext('2d')!.drawImage(img, x, y, w, h, 0, 0, w, h)
    setResult(c.toDataURL('image/png'))
  }

  return (
    <div>
      <div style={card}>
        <div onClick={() => inputRef.current?.click()} style={{ border:'2px dashed rgba(167,139,250,0.3)', borderRadius:10, padding:'32px', textAlign:'center', cursor:'pointer' }}>
          {preview
            ? <img src={preview} alt="preview" style={{ maxWidth:'100%', maxHeight:250 }} ref={el => { if(el) imgRef.current = el }} onLoad={e => { imgRef.current = e.currentTarget }} />
            : <><div style={{ fontSize:40, marginBottom:8 }}>✂️</div><div style={{ color:'#888', fontSize:14 }}>Click to upload image</div></>
          }
          <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      </div>

      {preview && (
        <>
          <div style={card}>
            <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:8 }}>Aspect Ratio</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {RATIOS.map((r, i) => (
                <button key={i} onClick={() => { setRatio(i); if (r.w && imgRef.current) { const ar = r.h/r.w; setCropH(Math.min(100, Math.round(cropW * ar))) } }}
                  style={{ padding:'6px 14px', borderRadius:6, border:'1px solid rgba(124,58,237,0.3)', background: ratio===i ? 'rgba(124,58,237,0.3)' : 'transparent', color:'#a78bfa', cursor:'pointer', fontSize:12, fontWeight:600 }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {([['Crop X (%)', cropX, setCropX], ['Crop Y (%)', cropY, setCropY],
                ['Width (%)', cropW, (v: number) => { setCropW(v); if (ratio > 0 && RATIOS[ratio].w) { const ar = RATIOS[ratio].h/RATIOS[ratio].w; setCropH(Math.round(v*ar)) } }],
                ['Height (%)', cropH, setCropH]] as [string, number, (v: number) => void][]).map(([label, val, setter]) => (
                <div key={label}>
                  <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#a78bfa', marginBottom:4 }}>{label}: {val}</label>
                  <input type="range" min={1} max={100} value={val} onChange={e => setter(+e.target.value)} style={{ width:'100%', accentColor:'#7c3aed' }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop:12, fontSize:12, color:'#888' }}>
              Crop region: {cropX}%,{cropY}% — {cropW}%×{cropH}% of original
            </div>
          </div>
          <button onClick={crop} style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }}>
            Crop Image
          </button>
        </>
      )}

      {result && (
        <div>
          <BeforeAfterSlider
            beforeSrc={preview}
            afterSrc={result}
            beforeLabel="Original"
            afterLabel="Cropped"
          />
          <div style={{ ...card, marginTop:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <span style={{ fontSize:14, fontWeight:700, color:'#a78bfa' }}>Cropped Image</span>
              <a href={result} download="cropped.png" style={{ background:'rgba(124,58,237,0.2)', border:'1px solid rgba(124,58,237,0.3)', color:'#a78bfa', borderRadius:6, padding:'8px 16px', fontSize:12, fontWeight:600, textDecoration:'none' }}>Download</a>
            </div>
            <img src={result} alt="cropped" style={{ maxWidth:'100%', borderRadius:8 }} />
          </div>
          <SmartRecommendation currentSlug="image-cropper" />
        </div>
      )}
    </div>
  )
}
