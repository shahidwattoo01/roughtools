/* eslint-disable @typescript-eslint/no-unused-vars, prefer-const, no-empty, no-useless-escape, react-hooks/exhaustive-deps */
'use client'
import React, { useState, useRef, useCallback } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

interface PageItem { url: string; name: string; file: File }

export default function ScreenshotToPdfClient() {
  const [pages, setPages] = useState<PageItem[]>([])
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (fl: FileList | null) => {
    if (!fl) return
    const items: PageItem[] = Array.from(fl).filter(f => f.type.startsWith('image/')).map(f => ({
      url: URL.createObjectURL(f), name: f.name, file: f,
    }))
    setPages(prev => [...prev, ...items])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [])

  const removePage = (i: number) => setPages(prev => prev.filter((_,idx) => idx !== i))
  const moveUp = (i: number) => { if (i===0) return; setPages(prev => { const a=[...prev]; [a[i-1],a[i]]=[a[i],a[i-1]]; return a }) }
  const moveDown = (i: number) => { if (i===pages.length-1) return; setPages(prev => { const a=[...prev]; [a[i],a[i+1]]=[a[i+1],a[i]]; return a }) }

  const printToPdf = () => {
    const win = window.open('', '_blank')
    if (!win) { alert('Please allow popups for this site.'); return }
    const html = `<!DOCTYPE html><html><head><style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { background:#fff; }
      .page { width:100%; page-break-after:always; page-break-inside:avoid; display:flex; justify-content:center; align-items:center; min-height:100vh; padding:20px; }
      .page:last-child { page-break-after:avoid; }
      img { max-width:100%; max-height:100vh; object-fit:contain; }
      @media print { .page { min-height:100vh; } }
    </style></head><body>
    ${pages.map(p => `<div class="page"><img src="${p.url}" alt="${p.name}"/></div>`).join('')}
    <script>window.onload=function(){ window.print(); }<\/script>
    </body></html>`
    win.document.write(html)
    win.document.close()
  }

  return (
    <div>
      <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ color:'#10b981', fontWeight:700, marginBottom:6 }}>How to Create PDF</div>
        <div style={{ color:'#e0e0ff', fontSize:13, lineHeight:1.6 }}>
          This tool opens your images in a print-optimized view. To save as PDF:
          <ol style={{ marginTop:6, paddingLeft:20 }}>
            <li>Upload your screenshots/images and arrange them in order</li>
            <li>Click &quot;Print to PDF&quot; — a new window will open</li>
            <li>In the print dialog, select &quot;<strong>Save as PDF</strong>&quot; as the destination</li>
            <li>Click Save</li>
          </ol>
          <div style={{ marginTop:8 }}>For programmatic PDF creation, consider using <strong>jsPDF</strong> library in your project.</div>
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
          <div style={{ fontSize:36 }}>📄</div>
          <div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop screenshots/images here</div>
          <div style={{ fontSize:13, color:'#888', marginTop:4 }}>Each image becomes one PDF page</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e => handleFiles(e.target.files)} />
      </div>

      {pages.length > 0 && (
        <div style={card}>
          <label style={lbl}>Pages ({pages.length}) — drag to reorder</label>
          {pages.map((p, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, background:'#0d0d1f', borderRadius:8, padding:'8px 12px', marginBottom:8 }}>
              <div style={{ color:'#a78bfa', fontWeight:900, fontSize:16, width:28, textAlign:'center' }}>{i+1}</div>
              <img src={p.url} alt={p.name} style={{ width:60, height:45, objectFit:'cover', borderRadius:4, border:'1px solid rgba(255,255,255,0.1)' }} />
              <div style={{ flex:1, color:'#e0e0ff', fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={() => moveUp(i)} style={{ background:'rgba(255,255,255,0.08)', color:'#e0e0ff', border:'none', borderRadius:4, padding:'4px 8px', cursor:'pointer', fontSize:12 }}>↑</button>
                <button onClick={() => moveDown(i)} style={{ background:'rgba(255,255,255,0.08)', color:'#e0e0ff', border:'none', borderRadius:4, padding:'4px 8px', cursor:'pointer', fontSize:12 }}>↓</button>
                <button onClick={() => removePage(i)} style={{ background:'rgba(239,68,68,0.2)', color:'#f87171', border:'none', borderRadius:4, padding:'4px 8px', cursor:'pointer', fontSize:12 }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pages.length > 0 && (
        <div>
          <button style={btn} onClick={printToPdf}>Print to PDF ({pages.length} page{pages.length>1?'s':''})</button>
          <SmartRecommendation currentSlug="screenshot-to-pdf" />
        </div>
      )}
    </div>
  )
}
