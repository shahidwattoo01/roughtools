'use client'
import { useState, useRef, useCallback } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

function fmtSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB'
  return (bytes/1048576).toFixed(2) + ' MB'
}

type Result = { name: string; orig: number; compressed: number; url: string; originalUrl: string }

export default function ImageCompressorClient() {
  const [files, setFiles] = useState<File[]>([])
  const [quality, setQuality] = useState(80)
  const [results, setResults] = useState<Result[]>([])
  const [processing, setProcessing] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...dropped])
  }, [])

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)])
  }

  // Keyboard shortcut: Enter to compress
  const _handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && files.length > 0 && !processing) {
      compress()
    }
  }, [files, processing]) // eslint-disable-line

  const compress = async () => {
    setProcessing(true)
    setResults([])
    const out: Result[] = []
    for (const file of files) {
      const url = URL.createObjectURL(file)
      const img = await new Promise<HTMLImageElement>(res => {
        const i = new Image(); i.onload = () => res(i); i.src = url
      })
      const canvas = document.createElement('canvas')
      canvas.width = img.width; canvas.height = img.height
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      const dataUrl = canvas.toDataURL(outputType, quality / 100)
      const byteStr = atob(dataUrl.split(',')[1])
      const bytes = new Uint8Array(byteStr.length)
      for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i)
      const blob = new Blob([bytes], { type: outputType })
      out.push({
        name: file.name,
        orig: file.size,
        compressed: blob.size,
        url: URL.createObjectURL(blob),
        originalUrl: url,
      })
    }
    setResults(out)
    setPreviewIndex(0)
    setProcessing(false)
  }

  const totalSaved = results.reduce((s,r) => s + (r.orig - r.compressed), 0)
  const totalOrig = results.reduce((s,r) => s + r.orig, 0)

  return (
    <div>
      {/* Upload area */}
      <div style={card}>
        <div onDrop={handleDrop} onDragOver={e=>e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          style={{ border:'2px dashed rgba(167,139,250,0.3)', borderRadius:10, padding:'40px 20px', textAlign:'center', cursor:'pointer' }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🗜️</div>
          <div style={{ fontSize:15, fontWeight:600, color:'#e0e0ff', marginBottom:4 }}>Drop images here or click to upload</div>
          <div style={{ fontSize:12, color:'#888' }}>JPG, PNG, WEBP, GIF — multiple files supported</div>
          <input ref={inputRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={handleFiles} />
        </div>
        {files.length > 0 && (
          <div style={{ marginTop:12, fontSize:13, color:'#a78bfa' }}>
            {files.length} file{files.length>1?'s':''} ready — {fmtSize(files.reduce((s,f)=>s+f.size,0))} total
            <button onClick={() => { setFiles([]); setResults([]) }} style={{ marginLeft:12, fontSize:11, background:'none', border:'1px solid rgba(167,139,250,0.3)', color:'#a78bfa', borderRadius:4, padding:'2px 8px', cursor:'pointer' }}>Clear</button>
          </div>
        )}
      </div>

      {/* Quality slider */}
      <div style={card}>
        <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:8 }}>
          Quality: {quality}%&nbsp;
          <span style={{ color:'#888', fontWeight:400 }}>
            {quality >= 80 ? '(Recommended — minimal visible loss)' : quality >= 60 ? '(Medium — some loss noticeable)' : '(Low — significant compression)'}
          </span>
        </label>
        <input type="range" min={10} max={100} step={5} value={quality} onChange={e=>setQuality(+e.target.value)}
          style={{ width:'100%', accentColor:'#7c3aed' }} />
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#666', marginTop:4 }}>
          <span>Smaller file</span><span>Better quality</span>
        </div>
      </div>

      {/* Compress button */}
      <button onClick={compress} disabled={!files.length || processing} style={{ ...btn, opacity: !files.length || processing ? 0.5 : 1 }}>
        {processing ? 'Compressing…' : `Compress ${files.length || ''} Image${files.length!==1?'s':''}`}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div>
          {/* Summary bar */}
          {totalOrig > 0 && (
            <div style={{ background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:16, textAlign:'center' }}>
              <span style={{ fontSize:15, fontWeight:700, color:'#4ade80' }}>
                ✅ Saved {fmtSize(totalSaved)} ({Math.round(totalSaved/totalOrig*100)}% reduction across {results.length} image{results.length!==1?'s':''})
              </span>
            </div>
          )}

          {/* Before/After slider for the currently selected result */}
          {results.length === 1 ? (
            <BeforeAfterSlider
              beforeSrc={results[0].originalUrl}
              afterSrc={results[0].url}
              beforeLabel={`Original (${fmtSize(results[0].orig)})`}
              afterLabel={`Compressed (${fmtSize(results[0].compressed)})`}
            />
          ) : (
            <>
              {/* Tab selector for batch */}
              <div style={{ display:'flex', gap:6, marginBottom:12, flexWrap:'wrap' }}>
                {results.map((r,i) => (
                  <button key={i} onClick={() => setPreviewIndex(i)} style={{
                    fontSize:11, padding:'4px 10px', borderRadius:6, border:'1px solid rgba(167,139,250,0.3)',
                    background: previewIndex===i ? 'rgba(124,58,237,0.3)' : 'transparent',
                    color: previewIndex===i ? '#a78bfa' : '#666', cursor:'pointer'
                  }}>
                    {r.name.length > 20 ? r.name.slice(0,18)+'…' : r.name}
                  </button>
                ))}
              </div>
              <BeforeAfterSlider
                beforeSrc={results[previewIndex].originalUrl}
                afterSrc={results[previewIndex].url}
                beforeLabel={`Original (${fmtSize(results[previewIndex].orig)})`}
                afterLabel={`Compressed (${fmtSize(results[previewIndex].compressed)})`}
              />
            </>
          )}

          {/* Individual file cards */}
          <div style={{ marginTop:16 }}>
            {results.map((r,i) => (
              <div key={i} style={{ ...card, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                <img src={r.url} alt={r.name} style={{ width:60, height:60, objectFit:'cover', borderRadius:6 }} />
                <div style={{ flex:1, minWidth:150 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#e0e0ff', marginBottom:2 }}>{r.name}</div>
                  <div style={{ fontSize:12, color:'#888' }}>
                    {fmtSize(r.orig)} → <span style={{ color:'#4ade80' }}>{fmtSize(r.compressed)}</span>
                    <span style={{ color:'#f59e0b', marginLeft:8 }}>-{Math.round((1-r.compressed/r.orig)*100)}%</span>
                  </div>
                </div>
                <a href={r.url} download={`compressed_${r.name}`}
                  style={{ background:'rgba(124,58,237,0.2)', border:'1px solid rgba(124,58,237,0.3)', color:'#a78bfa', borderRadius:6, padding:'8px 16px', fontSize:12, fontWeight:600, textDecoration:'none', flexShrink:0 }}>
                  Download
                </a>
              </div>
            ))}
          </div>

          {results.length > 1 && (
            <button onClick={() => { results.forEach(r => { const a=document.createElement('a');a.href=r.url;a.download=`compressed_${r.name}`;a.click() }) }}
              style={{ ...btn, marginTop:8 }}>⬇ Download All {results.length} Images</button>
          )}

          {/* Smart cross-tool recommendations */}
          <SmartRecommendation currentSlug="image-compressor" />
        </div>
      )}
    </div>
  )
}
