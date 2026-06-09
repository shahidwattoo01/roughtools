'use client'
import { useState, useRef, useCallback } from 'react'
import type { CSSProperties } from 'react'

// ─── Style tokens ─────────────────────────────────────────────────────────────
const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '20px 24px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)',
  color: '#fff', fontSize: 13, fontFamily: 'monospace', boxSizing: 'border-box',
  resize: 'vertical',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '8px 16px', color: '#c4b5fd', fontSize: 13,
  fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
}
const BTN_ACTIVE: CSSProperties = { ...BTN_GHOST, background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.6)' }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  bytes.forEach(b => { binary += String.fromCharCode(b) })
  return btoa(binary)
}

function fromBase64(b64: string): string {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

function toUrlSafe(b64: string): string {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromUrlSafe(safe: string): string {
  let b64 = safe.replace(/-/g, '+').replace(/_/g, '/')
  while (b64.length % 4) b64 += '='
  return b64
}

function addLineBreaks(b64: string, width = 76): string {
  const chunks: string[] = []
  for (let i = 0; i < b64.length; i += width) chunks.push(b64.slice(i, i + width))
  return chunks.join('\n')
}

function byteSize(n: number): string {
  if (n < 1024) return `${n} B`
  return `${(n / 1024).toFixed(1)} KB`
}

function isLikelyBase64(s: string): boolean {
  return /^[A-Za-z0-9+/\-_=\n\r]+$/.test(s.trim()) && s.trim().length > 0
}

function detectImageMime(b64: string): string | null {
  try {
    const bytes = atob(b64.replace(/\s/g, ''))
    const codes = bytes.slice(0, 4).split('').map(c => c.charCodeAt(0))
    if (codes[0] === 0xFF && codes[1] === 0xD8) return 'image/jpeg'
    if (codes[0] === 0x89 && bytes[1] === 'P') return 'image/png'
    if (bytes.slice(0, 6) === 'GIF89a' || bytes.slice(0, 6) === 'GIF87a') return 'image/gif'
    if (bytes.slice(0, 4) === 'RIFF') return 'image/webp'
  } catch {}
  return null
}

type Mode = 'text' | 'file' | 'download' | 'urlsafe'

export default function Base64EncoderClient() {
  const [mode, setMode] = useState<Mode>('text')
  const [text, setText] = useState('')
  const [b64, setB64] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [lineBreaks, setLineBreaks] = useState(false)
  const [urlSafeOut, setUrlSafeOut] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileB64, setFileB64] = useState('')
  const [fileMime, setFileMime] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [dataURI, setDataUri] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 1500)
    })
  }, [])

  // ── Text mode encode ──────────────────────────────────────────────────────
  function encode() {
    setError('')
    try {
      let result = toBase64(text)
      if (lineBreaks) result = addLineBreaks(result)
      setB64(result)
    } catch (e) { setError((e as Error).message) }
  }

  function decode() {
    setError('')
    try {
      const clean = b64.replace(/\s/g, '')
      const result = fromBase64(clean)
      setText(result)
    } catch { setError('Invalid Base64 string — make sure there are no illegal characters.') }
  }

  // ── URL-safe mode ─────────────────────────────────────────────────────────
  function encodeUrlSafe() {
    setError('')
    try {
      const standard = toBase64(text)
      setUrlSafeOut(toUrlSafe(standard))
    } catch (e) { setError((e as Error).message) }
  }

  function decodeUrlSafe() {
    setError('')
    try {
      const standard = fromUrlSafe(urlSafeOut)
      setText(fromBase64(standard))
    } catch { setError('Invalid URL-safe Base64 string') }
  }

  // ── File handling ─────────────────────────────────────────────────────────
  function handleFile(file: File) {
    setFileName(file.name)
    setFileMime(file.type)
    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result as string
      // result is already data:mime;base64,xxx from readAsDataURL
      const parts = result.split(',')
      const raw = parts[1] || ''
      setFileB64(lineBreaks ? addLineBreaks(raw) : raw)
      setDataUri(result)
      const imgMime = file.type.startsWith('image/') ? file.type : detectImageMime(raw)
      if (imgMime) setImagePreview(result)
      else setImagePreview('')
    }
    reader.readAsDataURL(file)
  }

  function downloadFromB64() {
    setError('')
    try {
      const clean = fileB64.replace(/\s/g, '')
      const binary = atob(clean)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      const blob = new Blob([bytes], { type: fileMime || 'application/octet-stream' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = fileName || 'decoded_file'
      a.click()
    } catch { setError('Invalid Base64 — cannot decode to file') }
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const textBytes = new TextEncoder().encode(text).length
  const b64Bytes = b64.replace(/\s/g, '').length
  const overhead = textBytes > 0 ? (((b64Bytes - textBytes) / textBytes) * 100).toFixed(0) : '0'

  const modes: { id: Mode; label: string }[] = [
    { id: 'text', label: 'Text' },
    { id: 'urlsafe', label: 'URL-safe' },
    { id: 'file', label: 'File Encode' },
    { id: 'download', label: 'File Decode' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {modes.map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setError('') }} style={mode === m.id ? BTN_ACTIVE : BTN_GHOST}>
            {m.label}
          </button>
        ))}
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-2)', cursor: 'pointer', marginLeft: 8 }}>
          <input type="checkbox" checked={lineBreaks} onChange={e => setLineBreaks(e.target.checked)} style={{ accentColor: '#8b5cf6' }} />
          MIME line breaks (76 chars)
        </label>
      </div>

      {/* ── TEXT MODE ─────────────────────────────────────────────────────────── */}
      {mode === 'text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={LABEL}>Plain Text</label>
              <button onClick={() => copy(text, 'text')} style={BTN_GHOST}>{copied === 'text' ? 'Copied!' : 'Copy'}</button>
            </div>
            <textarea style={{ ...INPUT_BOX, minHeight: 120 }} value={text} onChange={e => { setText(e.target.value); setError('') }} placeholder="Enter plain text here..." spellCheck={false} />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={encode} style={BTN_ACTIVE}>Encode to Base64</button>
            <button onClick={decode} style={BTN_GHOST}>Decode from Base64</button>
          </div>

          {/* Stats */}
          {textBytes > 0 && b64Bytes > 0 && (
            <div style={{ display: 'flex', gap: 20, padding: '10px 16px', background: 'rgba(99,102,241,0.08)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)', flexWrap: 'wrap', fontSize: 12 }}>
              <span style={{ color: 'var(--fg-3)' }}>Original: <strong style={{ color: 'var(--fg-2)' }}>{byteSize(textBytes)}</strong></span>
              <span style={{ color: 'var(--fg-3)' }}>Encoded: <strong style={{ color: 'var(--fg-2)' }}>{byteSize(b64Bytes)}</strong></span>
              <span style={{ color: 'var(--fg-3)' }}>Overhead: <strong style={{ color: '#f59e0b' }}>+{overhead}%</strong></span>
            </div>
          )}

          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={LABEL}>Base64</label>
              <button onClick={() => copy(b64, 'b64')} style={BTN_GHOST}>{copied === 'b64' ? 'Copied!' : 'Copy'}</button>
            </div>
            <textarea style={{ ...INPUT_BOX, minHeight: 120 }} value={b64} onChange={e => { setB64(e.target.value); setError('') }} placeholder="Enter Base64 here..." spellCheck={false} />
          </div>

          {/* Image preview if b64 looks like an image */}
          {b64 && (() => {
            const mime = detectImageMime(b64.replace(/\s/g, ''))
            if (!mime) return null
            return (
              <div style={CARD}>
                <label style={LABEL}>Image Preview</label>
                <img src={`data:${mime};base64,${b64.replace(/\s/g, '')}`} alt="Preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, objectFit: 'contain' }} />
              </div>
            )
          })()}
        </div>
      )}

      {/* ── URL-SAFE MODE ─────────────────────────────────────────────────────── */}
      {mode === 'urlsafe' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={CARD}>
            <label style={LABEL}>Plain Text</label>
            <textarea style={{ ...INPUT_BOX, minHeight: 100 }} value={text} onChange={e => { setText(e.target.value); setError('') }} placeholder="Enter plain text here..." spellCheck={false} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={encodeUrlSafe} style={BTN_ACTIVE}>Encode URL-safe</button>
            <button onClick={decodeUrlSafe} style={BTN_GHOST}>Decode URL-safe</button>
          </div>
          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={LABEL}>URL-safe Base64 (+ → -, / → _, no padding)</label>
              <button onClick={() => copy(urlSafeOut, 'urlsafe')} style={BTN_GHOST}>{copied === 'urlsafe' ? 'Copied!' : 'Copy'}</button>
            </div>
            <textarea style={{ ...INPUT_BOX, minHeight: 100 }} value={urlSafeOut} onChange={e => { setUrlSafeOut(e.target.value); setError('') }} placeholder="URL-safe Base64 here..." spellCheck={false} />
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 12, color: 'var(--fg-3)' }}>
            URL-safe Base64 replaces <code style={{ color: '#c4b5fd' }}>+</code> with <code style={{ color: '#c4b5fd' }}>-</code>, <code style={{ color: '#c4b5fd' }}>/</code> with <code style={{ color: '#c4b5fd' }}>_</code>, and removes <code style={{ color: '#c4b5fd' }}>=</code> padding. Safe to use in URLs and filenames.
          </div>
        </div>
      )}

      {/* ── FILE ENCODE MODE ──────────────────────────────────────────────────── */}
      {mode === 'file' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              ...CARD,
              border: isDragging ? '2px dashed #8b5cf6' : '2px dashed var(--line-strong)',
              background: isDragging ? 'rgba(139,92,246,0.1)' : 'rgba(0,0,0,0.2)',
              textAlign: 'center', padding: '32px', cursor: 'pointer',
            }}
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            onClick={() => fileRef.current?.click()}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>+</div>
            <div style={{ color: 'var(--fg-2)', fontWeight: 600 }}>Drag & drop a file here, or click to browse</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>Any file type — images, PDFs, documents</div>
            <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          </div>

          {fileB64 && (
            <>
              {imagePreview && (
                <div style={CARD}>
                  <label style={LABEL}>Image Preview</label>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 250, borderRadius: 8, objectFit: 'contain' }} />
                </div>
              )}
              <div style={CARD}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={LABEL}>Base64 — {fileName}</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => copy(fileB64, 'fileb64')} style={BTN_GHOST}>{copied === 'fileb64' ? 'Copied!' : 'Copy'}</button>
                    <button onClick={() => copy(dataURI, 'datauri')} style={BTN_GHOST}>{copied === 'datauri' ? 'Copied URI!' : 'Copy Data URI'}</button>
                  </div>
                </div>
                <textarea style={{ ...INPUT_BOX, minHeight: 140 }} value={fileB64} readOnly spellCheck={false} />
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--fg-3)' }}>
                  MIME: {fileMime || 'unknown'} | Size: {byteSize(fileB64.replace(/\s/g, '').length * 0.75)}
                </div>
              </div>

              {dataURI && (
                <div style={CARD}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={LABEL}>Data URI (for use in HTML/CSS)</label>
                    <button onClick={() => copy(dataURI, 'full-uri')} style={BTN_GHOST}>{copied === 'full-uri' ? 'Copied!' : 'Copy'}</button>
                  </div>
                  <div style={{ ...INPUT_BOX, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', padding: '10px 12px' } as CSSProperties}>
                    {dataURI.slice(0, 120)}...
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── FILE DECODE MODE ──────────────────────────────────────────────────── */}
      {mode === 'download' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={CARD}>
            <label style={LABEL}>Base64 string (paste here)</label>
            <textarea style={{ ...INPUT_BOX, minHeight: 140 }} value={fileB64} onChange={e => { setFileB64(e.target.value); setError('') }} placeholder="Paste Base64 encoded file content here..." spellCheck={false} />
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={LABEL}>MIME type (e.g. image/png, application/pdf)</label>
              <input style={{ ...INPUT_BOX, resize: 'none' }} value={fileMime} onChange={e => setFileMime(e.target.value)} placeholder="image/png" />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={LABEL}>File name</label>
              <input style={{ ...INPUT_BOX, resize: 'none' }} value={fileName} onChange={e => setFileName(e.target.value)} placeholder="decoded_file.png" />
            </div>
          </div>
          <button onClick={downloadFromB64} style={{ ...BTN_ACTIVE, width: 'fit-content' }}>Download File</button>
          {/* Image preview */}
          {fileB64 && (() => {
            const mime = fileMime || detectImageMime(fileB64.replace(/\s/g, '')) || ''
            if (!mime.startsWith('image/')) return null
            return (
              <div style={CARD}>
                <label style={LABEL}>Image Preview</label>
                <img src={`data:${mime};base64,${fileB64.replace(/\s/g, '')}`} alt="Preview" style={{ maxWidth: '100%', maxHeight: 250, borderRadius: 8, objectFit: 'contain' }} />
              </div>
            )
          })()}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', fontSize: 13 }}>
          {error}
        </div>
      )}
    </div>
  )
}
