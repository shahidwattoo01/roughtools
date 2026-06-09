'use client'
import { useState } from 'react'

export default function RemoveDuplicateLinesClient() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(true)
  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const [keepOriginalOrder, setKeepOriginalOrder] = useState(true)
  const [removedCount, setRemovedCount] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  function process() {
    const lines = input.split('\n')
    const seen = new Set<string>()
    const unique: string[] = []
    let removed = 0

    for (const line of lines) {
      const key = trimWhitespace
        ? (caseSensitive ? line.trim() : line.trim().toLowerCase())
        : (caseSensitive ? line : line.toLowerCase())
      if (seen.has(key)) {
        removed++
      } else {
        seen.add(key)
        unique.push(trimWhitespace ? line.trim() : line)
      }
    }

    const result = keepOriginalOrder ? unique : [...unique].sort((a, b) => a.localeCompare(b))
    setOutput(result.join('\n'))
    setRemovedCount(removed)
    setCopied(false)
  }

  function copy() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const taStyle: React.CSSProperties = {
    width: '100%',
    minHeight: 180,
    padding: 14,
    borderRadius: 10,
    background: 'var(--bg-3)',
    border: '1px solid var(--line-strong)',
    color: 'var(--fg)',
    fontSize: 14,
    lineHeight: 1.6,
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'monospace',
  }

  const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#bbb' }}>
      <div
        onClick={() => onChange(!value)}
        style={{ width: 36, height: 20, borderRadius: 10, background: value ? '#6366f1' : 'var(--bg-3)', position: 'relative', transition: 'background 0.2s', cursor: 'pointer' }}
      >
        <div style={{ position: 'absolute', top: 3, left: value ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
      </div>
      {label}
    </label>
  )

  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Input Text (one item per line)</label>
      <textarea value={input} onChange={e => { setInput(e.target.value); setRemovedCount(null) }} placeholder="Paste lines here…" style={taStyle} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, margin: '14px 0', alignItems: 'center' }}>
        <Toggle label="Case Sensitive" value={caseSensitive} onChange={setCaseSensitive} />
        <Toggle label="Trim Whitespace" value={trimWhitespace} onChange={setTrimWhitespace} />
        <Toggle label="Keep Original Order" value={keepOriginalOrder} onChange={setKeepOriginalOrder} />
        <button
          onClick={process}
          disabled={!input.trim()}
          style={{ marginLeft: 'auto', padding: '10px 24px', borderRadius: 10, background: '#6366f1', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: input.trim() ? 1 : 0.5 }}
        >
          Remove Duplicates
        </button>
      </div>
      {removedCount !== null && (
        <div style={{ marginBottom: 12, padding: '8px 14px', background: removedCount > 0 ? 'rgba(99,102,241,0.12)' : 'rgba(16,185,129,0.1)', borderRadius: 8, border: '1px solid ' + (removedCount > 0 ? 'rgba(99,102,241,0.3)' : 'rgba(16,185,129,0.3)'), fontSize: 13, color: removedCount > 0 ? '#a5b4fc' : '#10b981' }}>
          {removedCount > 0 ? `Removed ${removedCount} duplicate line${removedCount > 1 ? 's' : ''}.` : 'No duplicate lines found.'}
        </div>
      )}
      {output !== '' && (
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Output</label>
          <textarea value={output} readOnly style={{ ...taStyle, background: 'rgba(0,0,0,0.15)' }} />
          <button onClick={copy} style={{ position: 'absolute', top: 32, right: 10, padding: '6px 14px', borderRadius: 7, background: copied ? '#10b981' : '#6366f1', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )
}
