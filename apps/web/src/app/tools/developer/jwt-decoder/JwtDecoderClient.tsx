'use client'
import { useState } from 'react'

const cardStyle: React.CSSProperties = {
  background: '#13132a',
  borderRadius: 12,
  padding: 24,
  border: '1px solid rgba(255,255,255,0.07)',
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 8,
  background: '#252540',
  border: '1px solid var(--line-strong)',
  color: '#e0e0ff',
  fontSize: 13,
  fontFamily: 'monospace',
  resize: 'vertical',
  minHeight: 100,
  boxSizing: 'border-box',
}

const preStyle: React.CSSProperties = {
  margin: 0,
  padding: '12px 14px',
  borderRadius: 8,
  background: '#0d0d20',
  color: '#e0e0ff',
  fontSize: 13,
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  overflowX: 'auto',
}

const btnStyle = (accent?: boolean): React.CSSProperties => ({
  padding: '10px 22px',
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  border: 'none',
  background: accent ? '#7c3aed' : 'rgba(255,255,255,0.08)',
  color: '#e0e0ff',
})

const copyBtnStyle: React.CSSProperties = {
  padding: '5px 12px',
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 12,
  cursor: 'pointer',
  border: 'none',
  background: 'rgba(255,255,255,0.08)',
  color: '#e0e0ff',
}

const sectionColors: Record<string, string> = {
  Header: '#60a5fa',
  Payload: '#34d399',
  Signature: '#f472b6',
}

function base64urlDecode(str: string): string {
  // Pad to multiple of 4
  const padded = str + '=='.slice(0, (4 - (str.length % 4)) % 4)
  // Replace URL-safe chars
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/')
  return atob(base64)
}

function formatExpiry(exp: number): { text: string; expired: boolean } {
  const now = Math.floor(Date.now() / 1000)
  const diff = exp - now
  if (diff < 0) {
    const ago = Math.abs(diff)
    if (ago < 60) return { text: `Expired ${ago}s ago`, expired: true }
    if (ago < 3600) return { text: `Expired ${Math.floor(ago / 60)}m ago`, expired: true }
    if (ago < 86400) return { text: `Expired ${Math.floor(ago / 3600)}h ago`, expired: true }
    return { text: `Expired ${Math.floor(ago / 86400)}d ago`, expired: true }
  }
  if (diff < 60) return { text: `Expires in ${diff}s`, expired: false }
  if (diff < 3600) return { text: `Expires in ${Math.floor(diff / 60)}m ${diff % 60}s`, expired: false }
  if (diff < 86400) return { text: `Expires in ${Math.floor(diff / 3600)}h`, expired: false }
  return { text: `Expires in ${Math.floor(diff / 86400)}d`, expired: false }
}

interface DecodedJwt {
  header: string
  payload: string
  signature: string
  expiry: { text: string; expired: boolean } | null
}

export default function JwtDecoderClient() {
  const [input, setInput] = useState('')
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  function decode() {
    setError('')
    setDecoded(null)
    const token = input.trim()
    if (!token) {
      setError('Please enter a JWT token.')
      return
    }
    const parts = token.split('.')
    if (parts.length !== 3) {
      setError('Invalid JWT: expected 3 parts separated by dots.')
      return
    }
    try {
      const rawHeader = base64urlDecode(parts[0])
      const rawPayload = base64urlDecode(parts[1])
      const headerObj = JSON.parse(rawHeader)
      const payloadObj = JSON.parse(rawPayload)

      let expiry: { text: string; expired: boolean } | null = null
      if (typeof payloadObj.exp === 'number') {
        expiry = formatExpiry(payloadObj.exp)
      }

      setDecoded({
        header: JSON.stringify(headerObj, null, 2),
        payload: JSON.stringify(payloadObj, null, 2),
        signature: parts[2],
        expiry,
      })
    } catch {
      setError('Failed to decode JWT. Make sure it is a valid Base64URL-encoded token.')
    }
  }

  function copySection(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <div style={cardStyle}>
      {/* Input */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>
          JWT Token
        </label>
        <textarea
          style={textareaStyle}
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); setDecoded(null) }}
          placeholder="Paste your JWT here: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          spellCheck={false}
        />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button style={btnStyle(true)} onClick={decode}>Decode</button>
        <button
          style={btnStyle()}
          onClick={() => { setInput(''); setDecoded(null); setError('') }}
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: 16,
          padding: '10px 14px',
          borderRadius: 8,
          background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.3)',
          color: '#f87171',
          fontSize: 13,
          fontFamily: 'monospace',
        }}>
          {error}
        </div>
      )}

      {/* Security note */}
      <div style={{
        marginBottom: decoded ? 20 : 0,
        padding: '9px 14px',
        borderRadius: 8,
        background: 'rgba(251,191,36,0.08)',
        border: '1px solid rgba(251,191,36,0.2)',
        color: '#fbbf24',
        fontSize: 12,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
      }}>
        <span style={{ flexShrink: 0 }}>⚠</span>
        <span>This tool only decodes — it does NOT verify the signature. A decoded token is not proof of authenticity.</span>
      </div>

      {/* Decoded sections */}
      {decoded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          {/* Expiry banner */}
          {decoded.expiry && (
            <div style={{
              padding: '9px 14px',
              borderRadius: 8,
              background: decoded.expiry.expired ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)',
              border: `1px solid ${decoded.expiry.expired ? 'rgba(248,113,113,0.3)' : 'rgba(52,211,153,0.3)'}`,
              color: decoded.expiry.expired ? '#f87171' : '#34d399',
              fontSize: 13,
              fontWeight: 600,
            }}>
              {decoded.expiry.expired ? '✗' : '✓'} {decoded.expiry.text}
            </div>
          )}

          {/* Header */}
          {(['Header', 'Payload', 'Signature'] as const).map(section => {
            const content = section === 'Header' ? decoded.header
              : section === 'Payload' ? decoded.payload
              : decoded.signature
            return (
              <div key={section} style={{ borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: sectionColors[section] }}>
                    {section}
                    {section === 'Signature' && (
                      <span style={{ color: '#888', fontWeight: 400, marginLeft: 8, fontSize: 12 }}>(raw Base64URL — not verified)</span>
                    )}
                  </span>
                  <button
                    style={copyBtnStyle}
                    onClick={() => copySection(content, section)}
                  >
                    {copied === section ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre style={preStyle}>{content}</pre>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
