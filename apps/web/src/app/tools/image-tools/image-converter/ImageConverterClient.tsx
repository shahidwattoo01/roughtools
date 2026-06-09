'use client'
import { useState, useRef } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }

const FORMATS = ['JPG', 'PNG', 'WEBP', 'BMP', 'GIF']
const MIME: Record<string, string> = { JPG:'image/jpeg', PNG:'image/png', WEBP:'image/webp', BMP:'image/bmp', GIF:'image/gif' }
const EXT: Record<string, string> = { JPG:'jpg', PNG:'png', WEBP:'webp', BMP:'bmp', GIF:'gif' }

function fmtSize(b: number) { return b < 1048576 ? (b/1024).toFixed(1)+' KB' : (b/1048576).toFixed(2)+' MB' }

type Result = { name: string; url: string; size: number; originalUrl: string; originalSize: number }

export default function ImageConverterClient() {
  const [files, setFiles] = useState<File[]>([])
  const [targetFmt, setTargetFmt] = useState('PNG')
  const [quality, setQuality] = useState(90)
  const [results, setResults] = useState<Result[]>([])
  const [processing, setProcessing] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (list: FileList) => {
    setFiles(Array.from(list).filter(f => f.type.startsWith('image/')))
    setResults([])
  }

  const convert = async () => {
    setProcessing(true)
    setResults([])
    const out: Result[] = []
    const mime = MIME[targetFmt]
    for (const file of files) {
      const originalUrl = URL.createObjectURL(file)
      const img = await new Promise<HTMLImageElement>(res => {
        const i = new Image(); i.onload = () => res(i); i.src = originalUrl
      })
      const c = document.createElement('canvas')
      c.width = img.width; c.height = img.height
      const ctx = c.getContext('2d')!
      if (targetFmt === 'JPG') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height) }
      ctx.drawImage(img, 0, 0)
      const dataUrl = c.toDataURL(mime, quality / 100)
      const name = file.name.replace(/\.[^.]+$/, '') + '.' + EXT[targetFmt]
      const bytes = atob(dataUrl.split(',')[1])
      const arr = new Uint8Array(bytes.length)
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
      const blob = new Blob([arr], { type: mime })
      out.push({ name, url: URL.createObjectURL(blob), size: blob.size, originalUrl, originalSize: file.size })
    }
    setResults(out)
    setPreviewIndex(0)
    setProcessing(false)
  }

  return (
    <div>
      {/* Upload area */}
      <div style={card}>
        <div
          onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          style={{ border:'2px dashed rgba(167,139,250,0.3)', borderRadius:10, padding:'36px', textAlign:'center', cursor:'pointer' }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🔄</div>
          <div style={{ fontSize:15, fontWeight:600, color:'#e0e0ff', marginBottom:4 }}>Drop images or click to upload</div>
          <div style={{ fontSize:12, color:'#888' }}>JPG, PNG, WebP, GIF, BMP — multiple files supported</div>
          <input ref={inputRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e => e.target.files && handleFiles(e.target.files)} />
        </div>
        {files.length > 0 && (
          <div style={{ marginTop:8, fontSize:12, color:'#a78bfa' }}>
            {files.length} file{files.length>1?'s':''} selected — {fmtSize(files.reduce((s,f)=>s+f.size,0))} total
            <button onClick={() => { setFiles([]); setResults([]) }} style={{ marginLeft:12, fontSize:11, background:'none', border:'1px solid rgba(167,139,250,0.3)', color:'#a78bfa', borderRadius:4, padding:'2px 8px', cursor:'pointer' }}>Clear</button>
          </div>
        )}
      </div>

      {/* Format selector */}
      <div style={card}>
        <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:8 }}>Convert to</label>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {FORMATS.map(f => (
            <button key={f} onClick={() => setTargetFmt(f)} style={{
              padding:'8px 20px', borderRadius:8, border:'1px solid rgba(124,58,237,0.3)',
              background: targetFmt===f ? 'rgba(124,58,237,0.35)' : 'transparent',
              color:'#a78bfa', cursor:'pointer', fontSize:14, fontWeight:700,
            }}>
              {f}
            </button>
          ))}
        </div>
        {(targetFmt === 'JPG' || targetFmt === 'WEBP') && (
          <div style={{ marginTop:12 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }}>Quality: {quality}%</label>
            <input type="range" min={50} max={100} value={quality} onChange={e => setQuality(+e.target.value)} style={{ width:'100%', accentColor:'#7c3aed' }} />
          </div>
        )}
      </div>

      <button onClick={convert} disabled={!files.length || processing} style={{
        background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none',
        borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer',
        width:'100%', marginBottom:24, opacity: !files.length || processing ? 0.5 : 1,
      }}>
        {processing ? 'Converting…' : `Convert to ${targetFmt}`}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div>
          {/* Summary */}
          <div style={{ background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:10, padding:'10px 16px', marginBottom:16, textAlign:'center' }}>
            <span style={{ fontSize:14, fontWeight:700, color:'#4ade80' }}>
              ✅ Converted {results.length} image{results.length!==1?'s':''} to {targetFmt}
            </span>
          </div>

          {/* Before/After slider */}
          {results.length === 1 ? (
            <BeforeAfterSlider
              beforeSrc={results[0].originalUrl}
              afterSrc={results[0].url}
              beforeLabel={`Before (${fmtSize(results[0].originalSize)})`}
              afterLabel={`After — ${targetFmt} (${fmtSize(results[0].size)})`}
            />
          ) : (
            <>
              <div style={{ display:'flex', gap:6, marginBottom:12, flexWrap:'wrap' }}>
                {results.map((r,i) => (
                  <button key={i} onClick={() => setPreviewIndex(i)} style={{
                    fontSize:11, padding:'4px 10px', borderRadius:6, border:'1px solid rgba(167,139,250,0.3)',
                    background: previewIndex===i ? 'rgba(124,58,237,0.3)' : 'transparent',
                    color: previewIndex===i ? '#a78bfa' : '#666', cursor:'pointer',
                  }}>
                    {r.name.length > 20 ? r.name.slice(0,18)+'…' : r.name}
                  </button>
                ))}
              </div>
              <BeforeAfterSlider
                beforeSrc={results[previewIndex].originalUrl}
                afterSrc={results[previewIndex].url}
                beforeLabel={`Before (${fmtSize(results[previewIndex].originalSize)})`}
                afterLabel={`After — ${targetFmt} (${fmtSize(results[previewIndex].size)})`}
              />
            </>
          )}

          {/* File list */}
          <div style={{ marginTop:16 }}>
            {results.map((r, i) => (
              <div key={i} style={{ ...card, display:'flex', alignItems:'center', gap:12 }}>
                <img src={r.url} alt={r.name} style={{ width:50, height:50, objectFit:'cover', borderRadius:6 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#e0e0ff' }}>{r.name}</div>
                  <div style={{ fontSize:12, color:'#888' }}>
                    {fmtSize(r.originalSize)} → <span style={{ color:'#4ade80' }}>{fmtSize(r.size)}</span>
                  </div>
                </div>
                <a href={r.url} download={r.name} style={{ background:'rgba(124,58,237,0.2)', border:'1px solid rgba(124,58,237,0.3)', color:'#a78bfa', borderRadius:6, padding:'8px 16px', fontSize:12, fontWeight:600, textDecoration:'none', flexShrink:0 }}>
                  Download
                </a>
              </div>
            ))}
          </div>

          {results.length > 1 && (
            <button onClick={() => results.forEach(r => { const a=document.createElement('a');a.href=r.url;a.download=r.name;a.click() })}
              style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'12px 24px', fontSize:14, fontWeight:700, cursor:'pointer', width:'100%', marginTop:8 }}>
              ⬇ Download All {results.length} Files
            </button>
          )}

          {/* Smart recommendations */}
          <SmartRecommendation currentSlug="image-converter" />
        </div>
      )}
    </div>
  )
}
