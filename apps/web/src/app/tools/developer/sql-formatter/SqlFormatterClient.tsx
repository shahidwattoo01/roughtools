'use client'
import { useState } from 'react'

const KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
  'FULL JOIN', 'CROSS JOIN', 'JOIN', 'ON', 'AND', 'OR', 'NOT', 'IN',
  'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET',
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
  'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'DISTINCT', 'AS',
  'UNION', 'UNION ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
]

const NEWLINE_BEFORE = [
  'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
  'FULL JOIN', 'CROSS JOIN', 'JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET',
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE',
  'DROP TABLE', 'UNION ALL', 'UNION', 'ON',
]

function formatSQL(sql: string): string {
  // Normalize whitespace
  let s = sql.replace(/\s+/g, ' ').trim()

  // Uppercase keywords (longest first to avoid partial replacements)
  const sorted = [...KEYWORDS].sort((a, b) => b.length - a.length)
  for (const kw of sorted) {
    const re = new RegExp(`\\b${kw.replace(/\s+/g, '\\s+')}\\b`, 'gi')
    s = s.replace(re, kw)
  }

  // Add newlines before clause keywords
  const newlineSorted = [...NEWLINE_BEFORE].sort((a, b) => b.length - a.length)
  for (const kw of newlineSorted) {
    const re = new RegExp(`\\b(${kw.replace(/\s+/g, '\\s+')})\\b`, 'g')
    s = s.replace(re, '\n$1')
  }

  // Indent subqueries in parentheses
  let result = ''
  let depth = 0
  let i = 0
  while (i < s.length) {
    const ch = s[i]
    if (ch === '(') {
      result += '(\n' + '  '.repeat(depth + 1)
      depth++
    } else if (ch === ')') {
      depth = Math.max(0, depth - 1)
      result += '\n' + '  '.repeat(depth) + ')'
    } else if (ch === '\n') {
      result += '\n' + '  '.repeat(depth)
    } else {
      result += ch
    }
    i++
  }

  // Clean up: remove leading/trailing blank lines, collapse 3+ newlines, trim each line
  result = result
    .split('\n')
    .map(l => l.trimEnd())
    .filter((l, idx, arr) => !(l.trim() === '' && idx > 0 && arr[idx - 1].trim() === ''))
    .join('\n')
    .trim()

  return result
}

function minifySQL(sql: string): string {
  return sql.replace(/\s+/g, ' ').trim()
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 8,
  background: '#252540',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#e0e0ff',
  fontSize: 13,
  fontFamily: 'monospace',
  resize: 'vertical',
  minHeight: 160,
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

export default function SqlFormatterClient() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [dialect, setDialect] = useState('standard')
  const [copied, setCopied] = useState(false)

  function handleFormat() {
    setOutput(formatSQL(input))
  }

  function handleMinify() {
    setOutput(minifySQL(input))
  }

  function copy() {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Dialect:</label>
        <select
          value={dialect}
          onChange={e => setDialect(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 8, background: '#252540', border: '1px solid rgba(255,255,255,0.1)', color: '#e0e0ff', fontSize: 13 }}
        >
          <option value="standard">Standard SQL</option>
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>SQL Input</label>
        <textarea
          style={inputStyle}
          value={input}
          onChange={e => { setInput(e.target.value); setOutput('') }}
          placeholder="SELECT id, name FROM users WHERE active = 1 ORDER BY name"
          spellCheck={false}
        />
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <button style={btnStyle(true)} onClick={handleFormat}>Format</button>
        <button style={btnStyle()} onClick={handleMinify}>Minify</button>
      </div>
      {output && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Output</label>
            <button style={{ ...btnStyle(), padding: '6px 14px', fontSize: 12 }} onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <textarea style={{ ...inputStyle, minHeight: 200 }} value={output} readOnly spellCheck={false} />
        </div>
      )}
    </div>
  )
}
