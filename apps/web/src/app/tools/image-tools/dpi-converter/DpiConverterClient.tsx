/* eslint-disable @typescript-eslint/no-unused-vars, prefer-const, no-empty, no-useless-escape, react-hooks/exhaustive-deps, no-irregular-whitespace */
'use client'
import React, { useState, useRef, useCallback } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

const DPI_OPTIONS = [72, 96, 150, 300, 600]

export default function DpiConverterClient() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [imgDims, setImgDims] = useState<{ w: number; h: number } | null>(null)
  const [targetDpi, setTargetDpi] = useState(300)
  const [result, setResult] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setResult('')
    const url = URL.createObjectURL(f)
    setPreview(url)
    const img = new window.Image()
    img.onload = () => setImgDims({ w: img.naturalWidth, h: img.naturalHeight })
    img.src = url
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, [])

  const convert = () => {
    if (!file || !imgDims) return
    const canvas = document.createElement('canvas')
    canvas.width = imgDims.w
    canvas.height = imgDims.h
    const ctx = canvas.getContext('2d')!
    const img = new window.Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
      setResult(dataUrl)
    }
    img.src = preview
  }

  const printSize = (dpi: number) => imgDims ? `${(imgDims.w / dpi).toFixed(2)}" × ${(imgDims.h / dpi).toFixed(2)}"` : '-'

  return (
    <div>
      <div style={card}>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border:`2px dashed ${dragging ? '#7c3aed' : 'rgba(167,139,250,0.3)'}`, borderRadius:10, padding:'32px 16px', textAlign:'center', cursor:'pointer', color:'#a78bfa' }}
        >
          {preview ? <img src={preview} alt="preview" style={{ maxHeight:160, maxWidth:'100%', borderRadius:8 }} /> : (
            <>
              <div style={{ fontSize:36 }}>🖼️</div>
              <div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop image or click to upload</div>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {imgDims && (
        <div style={card}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div style={{ background:'#0d0d1f', borderRadius:8, padding:'12px' }}>
              <div style={{ color:'#888', fontSize:12 }}>Image Dimensions</div>
              <div style={{ color:'#e0e0ff', fontWeight:700, fontSize:16 }}>{imgDims.w} × {imgDims.h} px</div>
            </div>
            <div style={{ background:'#0d0d1f', borderRadius:8, padding:'12px' }}>
              <div style={{ color:'#888', fontSize:12 }}>File Size</div>
              <div style={{ color:'#e0e0ff', fontWeight:700, fontSize:16 }}>{file ? (file.size / 1024).toFixed(1) + ' KB' : '-'}</div>
            </div>
          </div>
          <label style={lbl}>Target DPI</label>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
            {DPI_OPTIONS.map(d => (
              <button key={d} onClick={() => setTargetDpi(d)} style={{ ...btn, width:'auto', padding:'8px 18px', marginBottom:0, fontSize:13, background: targetDpi===d ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#1e1e3f' }}>{d} DPI</button>
            ))}
          </div>
          <div style={{ background:'#0d0d1f', borderRadius:8, padding:'14px', marginBottom:12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              <div><div style={{ color:'#888', fontSize:12 }}>DPI</div><div style={{ color:'#a78bfa', fontWeight:700 }}>{targetDpi}</div></div>
              <div><div style={{ color:'#888', fontSize:12 }}>Print Size</div><div style={{ color:'#e0e0ff', fontWeight:700 }}>{printSize(targetDpi)}</div></div>
              <div><div style={{ color:'#888', fontSize:12 }}>Pixels</div><div style={{ color:'#e0e0ff', fontWeight:700 }}>{imgDims.w}×{imgDims.h}</div></div>
            </div>
          </div>
          <div style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:8, padding:'12px', fontSize:13, color:'#fbbf24', marginBottom:16 }}>
            ⚠️ Note: Browsers cannot embed DPI metadata in downloaded images directly. The pixel dimensions remain the same. Use Photoshop or GIMP to set exact DPI metadata. This tool shows the print dimensions at the selected DPI.
          </div>
        </div>
      )}

      <button style={btn} onClick={convert} disabled={!file}>Generate Image</button>

      {result && (
        <div>
          <BeforeAfterSlider
            beforeSrc={preview}
            afterSrc={result}
            beforeLabel="Original"
            afterLabel={`${targetDpi} DPI reference`}
          />
          <div style={{ ...card, marginTop:12 }}>
            <a href={result} download={`image_${targetDpi}dpi.jpg`} style={{ display:'block', textAlign:'center', color:'#a78bfa', background:'rgba(124,58,237,0.15)', borderRadius:10, padding:'12px', textDecoration:'none', fontWeight:700 }}>
              Download ({targetDpi} DPI reference)
            </a>
          </div>
          <SmartRecommendation currentSlug="dpi-converter" />
        </div>
      )}
    </div>
  )
}
