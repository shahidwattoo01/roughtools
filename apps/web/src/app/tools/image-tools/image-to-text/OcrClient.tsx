'use client'
import React, { useState, useRef, useCallback } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

export default function OcrClient() {
  const [preview, setPreview] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [status, setStatus] = useState<'idle'|'processing'|'done'|'error'>('idle')
  const [extracted, setExtracted] = useState('')
  const [copied, setCopied] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setExtracted(''); setStatus('idle')
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, []) // eslint-disable-line

  const processOcr = async () => {
    if (!file) return
    setProcessing(true); setStatus('processing')

    // Check for Tesseract.js availability
    if (typeof window !== 'undefined' && (window as Window & { Tesseract?: unknown }).Tesseract) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Tesseract = ((window as unknown) as { Tesseract: { recognize: (img: string, lang: string) => Promise<{ data: { text: string } }> } }).Tesseract
        const result = await Tesseract.recognize(preview, 'eng')
        setExtracted(result.data.text)
        setStatus('done')
      } catch {
        setStatus('error')
      }
    } else {
      // Fallback: use canvas to get image data and provide guidance
      setTimeout(() => {
        setExtracted('[OCR requires Tesseract.js library]\n\nTo enable real OCR on this page, add the following script to your HTML:\n<script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>\n\nAlternatively, use the options below to extract text from your image.')
        setStatus('done')
      }, 800)
    }
    setProcessing(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(extracted)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div style={{ background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.2)', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ color:'#a78bfa', fontWeight:700, marginBottom:6 }}>Image to Text (OCR)</div>
        <div style={{ color:'#e0e0ff', fontSize:13, lineHeight:1.6 }}>
          <strong>Best OCR Options:</strong>
          <ul style={{ marginTop:6, paddingLeft:20 }}>
            <li><strong>Tesseract.js</strong> — Free, open-source, runs in browser. Add to your project: <code style={{ background:'rgba(255,255,255,0.1)', padding:'1px 5px', borderRadius:3 }}>npm install tesseract.js</code></li>
            <li><strong>Google Vision API</strong> — Best accuracy, requires API key</li>
            <li><strong>Google Lens</strong> — Free, drag-and-drop your image at lens.google.com</li>
            <li><strong>Copy-paste from phone</strong> — iOS/Android can extract text from images in Photos app</li>
          </ul>
        </div>
      </div>

      <div style={card}>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border:`2px dashed ${dragging ? '#7c3aed' : 'rgba(167,139,250,0.3)'}`, borderRadius:10, padding:'32px', textAlign:'center', cursor:'pointer', color:'#a78bfa' }}
        >
          {preview ? <img src={preview} alt="uploaded" style={{ maxHeight:200, maxWidth:'100%', borderRadius:8 }} /> : (
            <><div style={{ fontSize:36 }}>🔍</div><div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop image or click to upload</div><div style={{ fontSize:13, color:'#888', marginTop:4 }}>Upload an image containing text</div></>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {file && (
        <button style={btn} onClick={processOcr} disabled={processing}>
          {processing ? '🔄 Processing...' : 'Extract Text'}
        </button>
      )}

      {status === 'processing' && (
        <div style={{ ...card, textAlign:'center' }}>
          <div style={{ color:'#a78bfa', fontSize:14 }}>Analyzing image for text...</div>
          <div style={{ marginTop:8, color:'#888', fontSize:12 }}>This may take a moment</div>
        </div>
      )}

      {status === 'done' && (
        <div style={card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <label style={lbl}>Extracted Text</label>
            <button onClick={copy} style={{ background: copied ? '#10b981' : 'rgba(124,58,237,0.2)', color:'#a78bfa', border:'none', borderRadius:8, padding:'6px 14px', cursor:'pointer', fontSize:13 }}>
              {copied ? '✓ Copied' : 'Copy Text'}
            </button>
          </div>
          <textarea
            value={extracted}
            onChange={e => setExtracted(e.target.value)}
            style={{ ...inp, height:200, resize:'vertical', fontFamily:'monospace', fontSize:13 }}
          />
        </div>
      )}

      {preview && (
        <div>
          <div style={card}>
            <div style={{ color:'#a78bfa', fontWeight:700, marginBottom:8 }}>Quick OCR Options</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <a href="https://lens.google.com" target="_blank" rel="noopener noreferrer"
                style={{ display:'block', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:10, padding:'14px', textDecoration:'none', textAlign:'center' }}>
                <div style={{ fontSize:24, marginBottom:4 }}>🔍</div>
                <div style={{ color:'#10b981', fontWeight:700, fontSize:14 }}>Google Lens</div>
                <div style={{ color:'#888', fontSize:12, marginTop:2 }}>Upload at lens.google.com</div>
              </a>
              <a href="https://www.onlineocr.net" target="_blank" rel="noopener noreferrer"
                style={{ display:'block', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:10, padding:'14px', textDecoration:'none', textAlign:'center' }}>
                <div style={{ fontSize:24, marginBottom:4 }}>📄</div>
                <div style={{ color:'#a78bfa', fontWeight:700, fontSize:14 }}>OnlineOCR.net</div>
                <div style={{ color:'#888', fontSize:12, marginTop:2 }}>Free online OCR tool</div>
              </a>
            </div>
          </div>
          <SmartRecommendation currentSlug="image-to-text" />
        </div>
      )}
    </div>
  )
}
