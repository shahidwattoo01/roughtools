'use client'
import React, { useState, useRef, useCallback } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

function getPpiRating(ppi: number) {
  if (ppi >= 400) return { label: 'Retina / Excellent', color: '#10b981' }
  if (ppi >= 220) return { label: 'High / Very Good', color: '#6ee7b7' }
  if (ppi >= 150) return { label: 'Good', color: '#a78bfa' }
  if (ppi >= 96)  return { label: 'Standard', color: '#fbbf24' }
  return { label: 'Low', color: '#f87171' }
}

export default function PixelDensityClient() {
  const [pw, setPw] = useState('')
  const [ph, setPh] = useState('')
  const [diag, setDiag] = useState('')
  const [ppi, setPpi] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const calculate = () => {
    const w = parseFloat(pw), h = parseFloat(ph), d = parseFloat(diag)
    if (!w || !h || !d) return
    const result = Math.sqrt(w * w + h * h) / d
    setPpi(Math.round(result))
  }

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f)
    const img = new window.Image()
    img.onload = () => {
      setPw(String(img.naturalWidth))
      setPh(String(img.naturalHeight))
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, []) // eslint-disable-line

  const rating = ppi !== null ? getPpiRating(ppi) : null

  return (
    <div>
      <div style={card}>
        <div style={{ color:'#e0e0ff', fontWeight:700, fontSize:16, marginBottom:4 }}>Auto-detect from image</div>
        <div style={{ color:'#888', fontSize:13, marginBottom:12 }}>Upload an image to auto-fill pixel dimensions</div>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border:`2px dashed ${dragging ? '#7c3aed' : 'rgba(167,139,250,0.3)'}`, borderRadius:10, padding:'20px', textAlign:'center', cursor:'pointer', color:'#a78bfa', fontSize:14 }}
        >
          🖼️ Drop image or click to upload
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      <div style={card}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
          <div>
            <label style={lbl}>Pixel Width</label>
            <input style={inp} type="number" placeholder="1920" value={pw} onChange={e => setPw(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Pixel Height</label>
            <input style={inp} type="number" placeholder="1080" value={ph} onChange={e => setPh(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Screen Size (inches)</label>
            <input style={inp} type="number" placeholder="15.6" value={diag} onChange={e => setDiag(e.target.value)} />
          </div>
        </div>
        <button style={btn} onClick={calculate}>Calculate PPI</button>

        {ppi !== null && rating && (
          <div style={{ background:'#0d0d1f', borderRadius:10, padding:'24px', textAlign:'center' }}>
            <div style={{ fontSize:64, fontWeight:900, color: rating.color }}>{ppi}</div>
            <div style={{ fontSize:18, color:'#e0e0ff', marginBottom:8 }}>PPI (Pixels Per Inch)</div>
            <div style={{ display:'inline-block', background:`${rating.color}22`, border:`1px solid ${rating.color}`, borderRadius:20, padding:'4px 18px', fontSize:14, color: rating.color, fontWeight:700 }}>{rating.label}</div>
            <div style={{ marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:8, padding:'10px' }}>
                <div style={{ color:'#888', fontSize:12 }}>Diagonal Resolution</div>
                <div style={{ color:'#e0e0ff', fontWeight:700 }}>{Math.round(Math.sqrt(parseFloat(pw)**2 + parseFloat(ph)**2))} px</div>
              </div>
              <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:8, padding:'10px' }}>
                <div style={{ color:'#888', fontSize:12 }}>Total Megapixels</div>
                <div style={{ color:'#e0e0ff', fontWeight:700 }}>{(parseFloat(pw) * parseFloat(ph) / 1_000_000).toFixed(2)} MP</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={card}>
        <div style={{ color:'#a78bfa', fontWeight:700, marginBottom:10 }}>PPI Reference Guide</div>
        {[
          { range:'400+ PPI', label:'Retina / Excellent', color:'#10b981' },
          { range:'220–399 PPI', label:'High / Very Good', color:'#6ee7b7' },
          { range:'150–219 PPI', label:'Good', color:'#a78bfa' },
          { range:'96–149 PPI', label:'Standard (HD monitors)', color:'#fbbf24' },
          { range:'< 96 PPI', label:'Low', color:'#f87171' },
        ].map(r => (
          <div key={r.range} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:13 }}>
            <span style={{ color:'#e0e0ff' }}>{r.range}</span>
            <span style={{ color: r.color, fontWeight:700 }}>{r.label}</span>
          </div>
        ))}
      </div>

      {ppi !== null && <SmartRecommendation currentSlug="pixel-density-calculator" />}
    </div>
  )
}
