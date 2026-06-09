'use client'
import { useState } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 8,
  background: '#252540',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#e0e0ff',
  fontSize: 13,
  fontFamily: 'monospace',
  boxSizing: 'border-box',
}

const btnStyle = (accent?: boolean): React.CSSProperties => ({
  padding: '10px 20px',
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  border: 'none',
  background: accent ? '#a78bfa' : 'rgba(255,255,255,0.08)',
  color: accent ? '#0f0f1e' : '#e0e0ff',
})

type Result = { component: string; uri: string }

export default function URLEncoderClient() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  function encode() {
    setError('')
    try {
      setResult({
        component: encodeURIComponent(input),
        uri: encodeURI(input),
      })
    } catch (e: unknown) {
      setError((e as Error).message)
    }
  }

  function decode() {
    setError('')
    try {
      setResult({
        component: decodeURIComponent(input),
        uri: decodeURI(input),
      })
    } catch (e: unknown) {
      setError((e as Error).message)
      setResult(null)
    }
  }

  function copy(label: string, value: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Input</label>
        <input
          style={inputStyle}
          value={input}
          onChange={e => { setInput(e.target.value); setResult(null); setError('') }}
          placeholder="Enter text, URL, or percent-encoded string..."
          spellCheck={false}
        />
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button style={btnStyle(true)} onClick={encode}>Encode</button>
        <button style={btnStyle()} onClick={decode}>Decode</button>
      </div>
      {error && (
        <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', fontSize: 13 }}>
          {error}
        </div>
      )}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'encodeURIComponent / decodeURIComponent', sublabel: 'For query parameters and path segments', value: result.component },
            { label: 'encodeURI / decodeURI', sublabel: 'For complete URLs', value: result.uri },
          ].map(({ label, sublabel, value }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{sublabel}</div>
                </div>
                <button
                  onClick={() => copy(label, value)}
                  style={{ padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: copied === label ? 'rgba(74,222,128,0.15)' : 'rgba(167,139,250,0.15)', color: copied === label ? '#4ade80' : '#a78bfa', marginLeft: 8, flexShrink: 0 }}
                >
                  {copied === label ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <input style={{ ...inputStyle, color: '#c4b5fd' }} value={value} readOnly spellCheck={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
