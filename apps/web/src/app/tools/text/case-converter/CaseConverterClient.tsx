'use client'
import { useState } from 'react'

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}
function toSentenceCase(str: string) {
  return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
}
function toCamelCase(str: string) {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase())
}
function toPascalCase(str: string) {
  return str.replace(/(?:^|[^a-zA-Z0-9])(\w)/g, (_, c) => c.toUpperCase())
}
function toSnakeCase(str: string) {
  return str.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}
function toKebabCase(str: string) {
  return str.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
function toAlternating(str: string) {
  return str.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')
}

const CASES = [
  { label: 'UPPER CASE', fn: (s: string) => s.toUpperCase() },
  { label: 'lower case', fn: (s: string) => s.toLowerCase() },
  { label: 'Title Case', fn: toTitleCase },
  { label: 'Sentence case', fn: toSentenceCase },
  { label: 'camelCase', fn: toCamelCase },
  { label: 'PascalCase', fn: toPascalCase },
  { label: 'snake_case', fn: toSnakeCase },
  { label: 'kebab-case', fn: toKebabCase },
  { label: 'aLtErNaTiNg', fn: toAlternating },
]

export default function CaseConverterClient() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  function apply(fn: (s: string) => string) {
    setOutput(fn(input))
    setCopied(false)
  }

  function copy() {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    minHeight: 140,
    padding: 14,
    borderRadius: 10,
    background: 'var(--bg-2)',
    border: '1px solid var(--line-strong)',
    color: 'var(--fg)',
    fontSize: 14,
    lineHeight: 1.6,
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Input Text</label>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste your text here…"
        style={inputStyle}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '16px 0' }}>
        {CASES.map(({ label, fn }) => (
          <button
            key={label}
            onClick={() => apply(fn)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#a5b4fc',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Output</label>
      <div style={{ position: 'relative' }}>
        <textarea
          value={output}
          readOnly
          placeholder="Result will appear here…"
          style={{ ...inputStyle, background: 'var(--bg-3)' }}
        />
        <button
          onClick={copy}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: '6px 14px',
            borderRadius: 7,
            background: copied ? '#10b981' : '#6366f1',
            border: 'none',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
