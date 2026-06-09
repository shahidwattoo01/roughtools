'use client'
import React, { useState, useRef, useCallback } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

interface ConvResult { name: string; url: string; originalUrl: string; originalSize: number; newSize: number; dims: string }

export default function JpgToPngClient() {
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<ConvResult[]>([])
  const [processing, setProcessing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (fl: FileList | null) => {
    if (!fl) return
    setFiles(Array.from(fl).filter(f => f.type === 'image/jpeg' || f.name.toLowerCase().match(/\.jpe?g$/)))
    setResults([])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, []) // eslint-disable-line

  const convertAll = async () => {
    setProcessing(true)
    const out: ConvResult[] = []
    for (const file of files) {
      const originalUrl = URL.createObjectURL(file)
      const img = new window.Image()
      await new Promise<void>(res => { img.onload = () => res(); img.src = originalUrl })
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL('image/png')
      const approxSize = Math.round(dataUrl.split(',')[1].length * 0.75)
      out.push({
        name: file.name.replace(/\.jpe?g$/i, '.png'),
        url: dataUrl,
        originalUrl,
        originalSize: file.size,
        newSize: approxSize,
        dims: `${img.naturalWidth}×${img.naturalHeight}`,
      })
    }
    setResults(out)
    setProcessing(false)
  }

  const downloadAll = () => results.forEach(r => { const a = document.createElement('a'); a.href = r.url; a.download = r.name; a.click() })
  const fmt = (n: number) => n > 1024*1024 ? `${(n/1024/1024).toFixed(2)} MB` : `${(n/1024).toFixed(1)} KB`

  return (
    <div>
      <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:13, color:'#10b981' }}>
        PNG supports transparent backgrounds and lossless compression. Converting from JPG to PNG preserves all visible pixels, though PNG files will be larger.
      </div>

      <div style={card}>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border:`2px dashed ${dragging ? '#7c3aed' : 'rgba(167,139,250,0.3)'}`, borderRadius:10, padding:'32px', textAlign:'center', cursor:'pointer' }}
        >
          <div style={{ fontSize:36 }}>🔳</div>
          <div style={{ fontWeight:700, color:'#e0e0ff', marginBottom:4 }}>Drop JPG files or click to upload</div>
          <div style={{ fontSize:13, color:'#888' }}>Multiple JPG/JPEG files supported</div>
        </div>
        <input ref={fileRef} type="file" accept=".jpg,.jpeg,image/jpeg" multiple style={{ display:'none' }} onChange={e => handleFiles(e.target.files)} />
        {files.length > 0 && (
          <div style={{ marginTop:10, color:'#a78bfa', fontSize:13 }}>
            {files.length} JPG file{files.length>1?'s':''} selected
            <button onClick={() => { setFiles([]); setResults([]) }} style={{ marginLeft:12, fontSize:11, background:'none', border:'1px solid rgba(167,139,250,0.3)', color:'#a78bfa', borderRadius:4, padding:'2px 8px', cursor:'pointer' }}>Clear</button>
          </div>
        )}
      </div>

      <button style={{ ...btn, opacity: !files.length || processing ? 0.5 : 1 }} onClick={convertAll} disabled={!files.length || processing}>
        {processing ? 'Converting…' : `Convert ${files.length || ''} JPG${files.length!==1?'s':''} to PNG`}
      </button>

      {results.length > 0 && (
        <div>
          <div style={{ background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:10, padding:'10px 16px', marginBottom:16, textAlign:'center' }}>
            <span style={{ fontSize:14, fontWeight:700, color:'#4ade80' }}>
              ✅ Converted {results.length} JPG{results.length!==1?'s':''} to PNG (lossless)
            </span>
          </div>

          <BeforeAfterSlider
            beforeSrc={results[0].originalUrl}
            afterSrc={results[0].url}
            beforeLabel={`JPG (${fmt(results[0].originalSize)})`}
            afterLabel={`PNG (${fmt(results[0].newSize)})`}
          />

          <div style={{ ...card, marginTop:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <span style={{ color:'#e0e0ff', fontWeight:700 }}>Results</span>
              {results.length > 1 && (
                <button onClick={downloadAll} style={{ ...btn, width:'auto', padding:'8px 18px', marginBottom:0, fontSize:13 }}>Download All</button>
              )}
            </div>
            {results.map((r, i) => (
              <div key={i} style={{ background:'#0d0d1f', borderRadius:8, padding:'12px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ color:'#e0e0ff', fontSize:13, fontWeight:600 }}>{r.name}</div>
                  <div style={{ color:'#888', fontSize:12 }}>
                    {r.dims}px • {fmt(r.originalSize)} JPG → <span style={{ color:'#4ade80' }}>{fmt(r.newSize)} PNG</span>
                  </div>
                </div>
                <a href={r.url} download={r.name} style={{ color:'#a78bfa', fontSize:13, textDecoration:'none', background:'rgba(124,58,237,0.15)', padding:'6px 14px', borderRadius:8, flexShrink:0 }}>Download</a>
              </div>
            ))}
          </div>

          <SmartRecommendation currentSlug="jpg-to-png" />
        </div>
      )}
    </div>
  )
}
