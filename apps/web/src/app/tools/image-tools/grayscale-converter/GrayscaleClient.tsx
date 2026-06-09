'use client'
import React, { useState, useRef, useCallback } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

type Mode = 'grayscale' | 'bw' | 'sepia'

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id:'grayscale', label:'Grayscale', desc:'Natural gray tones (luminance)' },
  { id:'bw', label:'High Contrast B&W', desc:'Pure black & white' },
  { id:'sepia', label:'Sepia Tone', desc:'Warm vintage brown' },
]

export default function GrayscaleClient() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [results, setResults] = useState<Partial<Record<Mode, string>>>({})
  const [activeMode, setActiveMode] = useState<Mode>('grayscale')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f)
    setPreview(url); setResults({})
    const img = new window.Image()
    img.onload = () => setImgObj(img)
    img.src = url
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, []) // eslint-disable-line

  const convert = (mode: Mode) => {
    if (!imgObj) return
    const w = imgObj.naturalWidth, h = imgObj.naturalHeight
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(imgObj, 0, 0)
    const imageData = ctx.getImageData(0, 0, w, h)
    const d = imageData.data

    for (let i = 0; i < d.length; i += 4) {
      const gray = 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2]
      if (mode === 'grayscale') {
        d[i] = d[i+1] = d[i+2] = gray
      } else if (mode === 'bw') {
        const bw = gray > 128 ? 255 : 0
        d[i] = d[i+1] = d[i+2] = bw
      } else if (mode === 'sepia') {
        d[i]   = Math.min(255, gray * 1.08 + 36)
        d[i+1] = Math.min(255, gray * 0.95 + 14)
        d[i+2] = Math.min(255, gray * 0.82 - 10)
      }
    }
    ctx.putImageData(imageData, 0, 0)
    const url = canvas.toDataURL('image/jpeg', 0.95)
    setResults(prev => ({ ...prev, [mode]: url }))
    setActiveMode(mode)
  }

  const convertAll = () => MODES.forEach(m => convert(m.id))

  return (
    <div>
      {/* Upload */}
      <div style={card}>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border:`2px dashed ${dragging ? '#7c3aed' : 'rgba(167,139,250,0.3)'}`, borderRadius:10, padding:'32px', textAlign:'center', cursor:'pointer' }}
        >
          {preview
            ? <img src={preview} alt="original" style={{ maxHeight:180, maxWidth:'100%', borderRadius:8 }} />
            : <><div style={{ fontSize:36 }}>⬛</div><div style={{ fontWeight:700, color:'#e0e0ff', marginBottom:4 }}>Drop image or click to upload</div><div style={{ fontSize:13, color:'#888' }}>JPG, PNG, WebP supported</div></>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {/* Mode buttons */}
      {imgObj && (
        <div style={card}>
          <label style={lbl}>Choose conversion style</label>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
            {MODES.map(m => (
              <button key={m.id} onClick={() => convert(m.id)} style={{
                ...btn, width:'auto', padding:'10px 20px', marginBottom:0, fontSize:13,
                background: activeMode===m.id && results[m.id] ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#1e1e3f',
              }}>
                {m.label}
              </button>
            ))}
          </div>
          <button style={{ ...btn, background:'rgba(124,58,237,0.3)', border:'1px solid rgba(124,58,237,0.4)', marginBottom:0 }} onClick={convertAll}>
            Convert All Modes
          </button>
        </div>
      )}

      {/* Results with before/after slider */}
      {Object.entries(results).map(([mode, url]) => url && (
        <div key={mode}>
          <BeforeAfterSlider
            beforeSrc={preview}
            afterSrc={url}
            beforeLabel="Original (Colour)"
            afterLabel={MODES.find(m => m.id === mode)?.label ?? mode}
          />
          <div style={{ ...card, marginTop:12 }}>
            <label style={lbl}>{MODES.find(m => m.id === mode)?.label} — {MODES.find(m => m.id === mode)?.desc}</label>
            <a href={url} download={`${mode}.jpg`} style={{ display:'block', textAlign:'center', color:'#a78bfa', background:'rgba(124,58,237,0.15)', borderRadius:10, padding:'10px', textDecoration:'none', fontWeight:700 }}>
              ⬇ Download {MODES.find(m=>m.id===mode)?.label}
            </a>
          </div>
        </div>
      ))}

      {Object.keys(results).length > 0 && (
        <SmartRecommendation currentSlug="grayscale-converter" />
      )}
    </div>
  )
}
