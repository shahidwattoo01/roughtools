'use client'
import React, { useState, useRef, useCallback } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

interface ResizedImage {
  name: string
  url: string
  originalUrl: string
  width: number
  height: number
  originalSize: number
  newSize: number
}

export default function BulkImageResizerClient() {
  const [files, setFiles] = useState<File[]>([])
  const [mode, setMode] = useState<'dimensions' | 'percentage'>('dimensions')
  const [width, setWidth] = useState('800')
  const [height, setHeight] = useState('600')
  const [percentage, setPercentage] = useState('50')
  const [keepAspect, setKeepAspect] = useState(true)
  const [results, setResults] = useState<ResizedImage[]>([])
  const [processing, setProcessing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const imgs = Array.from(incoming).filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...imgs])
    setResults([])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, []) // eslint-disable-line

  const processAll = async () => {
    if (!files.length) return
    setProcessing(true)
    const out: ResizedImage[] = []
    for (const file of files) {
      const originalUrl = URL.createObjectURL(file)
      const img = new window.Image()
      await new Promise<void>(res => { img.onload = () => res(); img.src = originalUrl })
      let tw = parseInt(width) || img.width
      let th = parseInt(height) || img.height
      if (mode === 'percentage') {
        const pct = parseFloat(percentage) / 100
        tw = Math.round(img.width * pct)
        th = Math.round(img.height * pct)
      } else if (keepAspect) {
        const ratio = img.width / img.height
        if (tw / th > ratio) tw = Math.round(th * ratio)
        else th = Math.round(tw / ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width = tw
      canvas.height = th
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, tw, th)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
      const base64Len = dataUrl.split(',')[1]?.length ?? 0
      const approxBytes = Math.round(base64Len * 0.75)
      out.push({
        name: file.name.replace(/\.[^.]+$/, '') + `_${tw}x${th}.jpg`,
        url: dataUrl,
        originalUrl,
        width: tw,
        height: th,
        originalSize: file.size,
        newSize: approxBytes,
      })
    }
    setResults(out)
    setPreviewIndex(0)
    setProcessing(false)
  }

  const downloadAll = () => {
    results.forEach(r => {
      const a = document.createElement('a')
      a.href = r.url
      a.download = r.name
      a.click()
    })
  }

  const fmt = (n: number) => n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`

  return (
    <div>
      <div style={card}>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border:`2px dashed ${dragging ? '#7c3aed' : 'rgba(167,139,250,0.3)'}`, borderRadius:10, padding:'32px 16px', textAlign:'center', cursor:'pointer', color:'#a78bfa', transition:'border-color 0.2s' }}
        >
          <div style={{ fontSize:36, marginBottom:8 }}>🖼️</div>
          <div style={{ fontWeight:700, fontSize:16, color:'#e0e0ff' }}>Drop images here or click to upload</div>
          <div style={{ fontSize:13, color:'#888', marginTop:4 }}>Multiple images supported</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e => handleFiles(e.target.files)} />
        {files.length > 0 && (
          <div style={{ marginTop:12, color:'#a78bfa', fontSize:13 }}>
            {files.length} file{files.length > 1 ? 's' : ''} selected
            <button onClick={() => { setFiles([]); setResults([]) }} style={{ marginLeft:12, fontSize:11, background:'none', border:'1px solid rgba(167,139,250,0.3)', color:'#a78bfa', borderRadius:4, padding:'2px 8px', cursor:'pointer' }}>Clear</button>
          </div>
        )}
      </div>

      <div style={card}>
        <label style={lbl}>Resize Mode</label>
        <div style={{ display:'flex', gap:12, marginBottom:16 }}>
          {(['dimensions', 'percentage'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ ...btn, width:'auto', padding:'8px 20px', marginBottom:0, background: mode === m ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#1e1e3f', fontSize:13 }}>
              {m === 'dimensions' ? 'Fixed Dimensions' : 'Percentage'}
            </button>
          ))}
        </div>
        {mode === 'dimensions' ? (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={lbl}>Width (px)</label><input style={inp} value={width} onChange={e => setWidth(e.target.value)} type="number" /></div>
            <div><label style={lbl}>Height (px)</label><input style={inp} value={height} onChange={e => setHeight(e.target.value)} type="number" /></div>
            <div style={{ gridColumn:'span 2' }}>
              <label style={{ ...lbl, display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                <input type="checkbox" checked={keepAspect} onChange={e => setKeepAspect(e.target.checked)} /> Keep Aspect Ratio
              </label>
            </div>
          </div>
        ) : (
          <div>
            <label style={lbl}>Scale Percentage: {percentage}%</label>
            <input style={inp} type="range" min="1" max="200" value={percentage} onChange={e => setPercentage(e.target.value)} />
          </div>
        )}
      </div>

      <button style={{ ...btn, opacity: !files.length || processing ? 0.5 : 1 }} onClick={processAll} disabled={!files.length || processing}>
        {processing ? 'Processing…' : `Resize ${files.length || ''} Image${files.length !== 1 ? 's' : ''}`}
      </button>

      {results.length > 0 && (
        <div>
          <div style={{ background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:10, padding:'10px 16px', marginBottom:16, textAlign:'center' }}>
            <span style={{ fontSize:14, fontWeight:700, color:'#4ade80' }}>
              ✅ Resized {results.length} image{results.length !== 1 ? 's' : ''}
            </span>
          </div>

          {results.length > 1 && (
            <div style={{ display:'flex', gap:6, marginBottom:12, flexWrap:'wrap' }}>
              {results.map((r, i) => (
                <button key={i} onClick={() => setPreviewIndex(i)} style={{
                  fontSize:11, padding:'4px 10px', borderRadius:6, border:'1px solid rgba(167,139,250,0.3)',
                  background: previewIndex === i ? 'rgba(124,58,237,0.3)' : 'transparent',
                  color: previewIndex === i ? '#a78bfa' : '#666', cursor:'pointer',
                }}>
                  {r.name.length > 20 ? r.name.slice(0, 18) + '…' : r.name}
                </button>
              ))}
            </div>
          )}

          <BeforeAfterSlider
            beforeSrc={results[previewIndex].originalUrl}
            afterSrc={results[previewIndex].url}
            beforeLabel="Original"
            afterLabel={`Resized (${results[previewIndex].width}×${results[previewIndex].height})`}
          />

          <div style={{ ...card, marginTop:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <span style={{ color:'#e0e0ff', fontWeight:700 }}>Results ({results.length})</span>
              <button onClick={downloadAll} style={{ ...btn, width:'auto', padding:'8px 20px', marginBottom:0, fontSize:13 }}>Download All</button>
            </div>
            {results.map((r, i) => (
              <div key={i} style={{ background:'#0d0d1f', borderRadius:8, padding:'12px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ color:'#e0e0ff', fontSize:13, fontWeight:600 }}>{r.name}</div>
                  <div style={{ color:'#888', fontSize:12 }}>{r.width}×{r.height}px • {fmt(r.originalSize)} → <span style={{ color:'#4ade80' }}>{fmt(r.newSize)}</span></div>
                </div>
                <a href={r.url} download={r.name} style={{ color:'#a78bfa', fontSize:13, textDecoration:'none', background:'rgba(124,58,237,0.15)', padding:'6px 14px', borderRadius:8, flexShrink:0 }}>Download</a>
              </div>
            ))}
          </div>

          <SmartRecommendation currentSlug="bulk-image-resizer" />
        </div>
      )}
    </div>
  )
}
