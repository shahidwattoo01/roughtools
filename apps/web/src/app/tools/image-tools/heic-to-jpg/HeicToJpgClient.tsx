'use client'
import React, { useState, useRef, useCallback } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const _inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

interface ConvertedFile {
  name: string
  url: string
  originalUrl: string
  isHeic: boolean
  size: number
}

export default function HeicToJpgClient() {
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<ConvertedFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return
    setFiles(Array.from(incoming))
    setResults([])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, []) // eslint-disable-line

  const convertAll = async () => {
    setProcessing(true)
    const out: ConvertedFile[] = []
    for (const file of files) {
      const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')
      const originalUrl = URL.createObjectURL(file)
      if (isHeic) {
        out.push({ name: file.name, url: '', originalUrl, isHeic: true, size: file.size })
      } else {
        try {
          const img = new window.Image()
          await new Promise<void>(res => { img.onload = () => res(); img.src = originalUrl })
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
          canvas.getContext('2d')!.drawImage(img, 0, 0)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
          out.push({ name: file.name.replace(/\.[^.]+$/, '') + '.jpg', url: dataUrl, originalUrl, isHeic: false, size: file.size })
        } catch {
          out.push({ name: file.name, url: '', originalUrl, isHeic: true, size: file.size })
        }
      }
    }
    setResults(out)
    setProcessing(false)
  }

  const successResults = results.filter(r => !r.isHeic && r.url)

  return (
    <div>
      <div style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ color:'#fbbf24', fontWeight:700, marginBottom:6 }}>⚠️ About HEIC Files</div>
        <div style={{ color:'#e0e0ff', fontSize:13, lineHeight:1.6 }}>
          HEIC/HEIF is Apple&apos;s proprietary format. Browsers cannot natively decode HEIC files. For HEIC conversion, use one of these methods:
          <ul style={{ marginTop:8, paddingLeft:20 }}>
            <li><strong>iOS:</strong> When AirDropping or sharing, iOS offers &quot;Send as Compatible Image&quot; which converts to JPG automatically.</li>
            <li><strong>Mac:</strong> Open in Preview and export as JPG.</li>
            <li><strong>Online:</strong> Use ilovepdf.com/heic-to-jpg or cloudconvert.com</li>
            <li><strong>Non-HEIC images:</strong> Upload below and they will be converted to JPG via canvas.</li>
          </ul>
        </div>
      </div>

      <div style={card}>
        <label style={lbl}>Upload Images (non-HEIC will be converted to JPG)</label>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border:`2px dashed ${dragging ? '#7c3aed' : 'rgba(167,139,250,0.3)'}`, borderRadius:10, padding:'32px', textAlign:'center', cursor:'pointer', color:'#a78bfa' }}
        >
          <div style={{ fontSize:36 }}>📱</div>
          <div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop files here or click to upload</div>
          <div style={{ fontSize:13, color:'#888', marginTop:4 }}>Accepts .heic, .heif, and all common image formats</div>
        </div>
        <input ref={fileRef} type="file" accept=".heic,.heif,image/*" multiple style={{ display:'none' }} onChange={e => handleFiles(e.target.files)} />
        {files.length > 0 && (
          <div style={{ marginTop:10, color:'#a78bfa', fontSize:13 }}>
            {files.length} file{files.length > 1 ? 's' : ''} selected
            <button onClick={() => { setFiles([]); setResults([]) }} style={{ marginLeft:12, fontSize:11, background:'none', border:'1px solid rgba(167,139,250,0.3)', color:'#a78bfa', borderRadius:4, padding:'2px 8px', cursor:'pointer' }}>Clear</button>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <button style={{ ...btn, opacity: processing ? 0.5 : 1 }} onClick={convertAll} disabled={processing}>
          {processing ? 'Converting…' : `Convert ${files.length} File${files.length !== 1 ? 's' : ''} to JPG`}
        </button>
      )}

      {results.length > 0 && (
        <div>
          <div style={{ background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:10, padding:'10px 16px', marginBottom:16, textAlign:'center' }}>
            <span style={{ fontSize:14, fontWeight:700, color:'#4ade80' }}>
              ✅ Processed {results.length} file{results.length !== 1 ? 's' : ''} — {successResults.length} converted successfully
            </span>
          </div>

          {successResults.length > 0 && (
            <BeforeAfterSlider
              beforeSrc={successResults[0].originalUrl}
              afterSrc={successResults[0].url}
              beforeLabel="Original"
              afterLabel="JPG"
            />
          )}

          <div style={{ ...card, marginTop:16 }}>
            {results.map((r, i) => (
              <div key={i} style={{ background:'#0d0d1f', borderRadius:8, padding:'12px', marginBottom:8 }}>
                {r.isHeic ? (
                  <div>
                    <div style={{ color:'#f87171', fontWeight:600, fontSize:13 }}>⚠️ {r.name}</div>
                    <div style={{ color:'#888', fontSize:12, marginTop:4 }}>HEIC files cannot be decoded by the browser. Please use the methods described above to convert this file.</div>
                  </div>
                ) : (
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ color:'#10b981', fontWeight:600, fontSize:13 }}>✓ {r.name}</div>
                      <div style={{ color:'#888', fontSize:12 }}>{(r.size / 1024).toFixed(1)} KB original</div>
                    </div>
                    <a href={r.url} download={r.name} style={{ color:'#a78bfa', fontSize:13, textDecoration:'none', background:'rgba(124,58,237,0.15)', padding:'6px 14px', borderRadius:8 }}>Download</a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <SmartRecommendation currentSlug="heic-to-jpg" />
        </div>
      )}
    </div>
  )
}
