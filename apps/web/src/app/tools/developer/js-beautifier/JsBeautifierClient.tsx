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
  resize: 'vertical',
  minHeight: 200,
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

/**
 * Simple JS beautifier — inserts newlines and indentation around braces,
 * semicolons, and commas. Not a full AST parser; handles common patterns well.
 */
function beautifyJs(code: string, indentSize: number): string {
  const indent = ' '.repeat(indentSize)
  let result = ''
  let depth = 0
  let inString = false
  let stringChar = ''
  let inLineComment = false
  let inBlockComment = false
  let i = 0

  function currentIndent() {
    return indent.repeat(depth)
  }

  while (i < code.length) {
    const ch = code[i]
    const next = code[i + 1] || ''

    // Handle block comment end
    if (inBlockComment) {
      result += ch
      if (ch === '*' && next === '/') {
        result += '/'
        i += 2
        inBlockComment = false
      } else {
        i++
      }
      continue
    }

    // Handle line comment end
    if (inLineComment) {
      result += ch
      if (ch === '\n') {
        inLineComment = false
        result += currentIndent()
      }
      i++
      continue
    }

    // Handle string
    if (inString) {
      result += ch
      if (ch === '\\') {
        result += next
        i += 2
        continue
      }
      if (ch === stringChar) inString = false
      i++
      continue
    }

    // Detect start of block comment
    if (ch === '/' && next === '*') {
      result += '/*'
      i += 2
      inBlockComment = true
      continue
    }

    // Detect start of line comment
    if (ch === '/' && next === '/') {
      result += '//'
      i += 2
      inLineComment = true
      continue
    }

    // Detect string start
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true
      stringChar = ch
      result += ch
      i++
      continue
    }

    if (ch === '{') {
      result += ' {\n'
      depth++
      result += currentIndent()
      i++
      continue
    }

    if (ch === '}') {
      depth = Math.max(0, depth - 1)
      // trim trailing spaces from last line
      result = result.trimEnd()
      result += '\n' + currentIndent() + '}'
      // peek at next non-space char
      let j = i + 1
      while (j < code.length && (code[j] === ' ' || code[j] === '\t')) j++
      const nc = code[j]
      if (nc && nc !== ')' && nc !== ',' && nc !== ';' && nc !== '\n' && nc !== '}') {
        result += '\n' + currentIndent()
      }
      i++
      continue
    }

    if (ch === ';') {
      result += ';\n' + currentIndent()
      i++
      continue
    }

    // Skip existing newlines — we control newlines ourselves
    if (ch === '\n' || ch === '\r') {
      i++
      continue
    }

    // Collapse multiple spaces
    if (ch === ' ' || ch === '\t') {
      if (result.length > 0 && result[result.length - 1] !== ' ' && result[result.length - 1] !== '\n') {
        result += ' '
      }
      i++
      continue
    }

    result += ch
    i++
  }

  // Clean up multiple blank lines
  return result.replace(/\n{3,}/g, '\n\n').trim()
}

function minifyJs(code: string): string {
  let result = ''
  let inString = false
  let stringChar = ''
  let inLineComment = false
  let inBlockComment = false
  let i = 0

  while (i < code.length) {
    const ch = code[i]
    const next = code[i + 1] || ''

    if (inBlockComment) {
      if (ch === '*' && next === '/') { i += 2; inBlockComment = false }
      else i++
      continue
    }
    if (inLineComment) {
      if (ch === '\n') { inLineComment = false; result += ' ' }
      i++
      continue
    }
    if (inString) {
      result += ch
      if (ch === '\\') { result += next; i += 2; continue }
      if (ch === stringChar) inString = false
      i++
      continue
    }
    if (ch === '/' && next === '*') { i += 2; inBlockComment = true; continue }
    if (ch === '/' && next === '/') { i += 2; inLineComment = true; continue }
    if (ch === '"' || ch === "'" || ch === '`') { inString = true; stringChar = ch; result += ch; i++; continue }
    if (ch === '\n' || ch === '\r' || ch === '\t') { i++; continue }
    if (ch === ' ') {
      if (result.length > 0 && result[result.length - 1] !== ' ') result += ' '
      i++
      continue
    }
    result += ch
    i++
  }

  return result
    .replace(/ *([{}();,=+\-*/<>!&|?:]) */g, '$1')
    .trim()
}

export default function JsBeautifierClient() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indentSize, setIndentSize] = useState<2 | 4>(2)

  function handleBeautify() {
    setError('')
    setOutput('')
    if (!input.trim()) {
      setError('Please paste some JavaScript to beautify.')
      return
    }
    try {
      const result = beautifyJs(input, indentSize)
      setOutput(result)
    } catch {
      setError('An unexpected error occurred while beautifying. Please check your input.')
    }
  }

  function handleMinify() {
    setError('')
    setOutput('')
    if (!input.trim()) {
      setError('Please paste some JavaScript to minify.')
      return
    }
    try {
      setOutput(minifyJs(input))
    } catch {
      setError('An unexpected error occurred while minifying.')
    }
  }

  function handleCopy() {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function handleClear() {
    setInput('')
    setOutput('')
    setError('')
    setCopied(false)
  }

  const inputChars = input.length
  const outputChars = output.length

  return (
    <div style={{ background: '#13132a', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>
          Input JavaScript
        </label>
        <textarea
          style={inputStyle}
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); setOutput('') }}
          placeholder="Paste your JavaScript code here..."
          spellCheck={false}
        />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 13, color: '#888', whiteSpace: 'nowrap' }}>Indent size:</label>
          <select
            value={indentSize}
            onChange={e => setIndentSize(Number(e.target.value) as 2 | 4)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              background: '#252540',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e0e0ff',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
        <button style={btnStyle(true)} onClick={handleBeautify}>Beautify</button>
        <button style={btnStyle()} onClick={handleMinify}>Minify</button>
        <button style={btnStyle()} onClick={handleClear}>Clear</button>
      </div>

      {error && (
        <div style={{
          marginBottom: 12,
          padding: '10px 14px',
          borderRadius: 8,
          background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.3)',
          color: '#f87171',
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {output && (
        <>
          <div style={{
            display: 'flex',
            gap: 16,
            marginBottom: 16,
            padding: '12px 16px',
            background: 'rgba(124,58,237,0.1)',
            borderRadius: 8,
            border: '1px solid rgba(124,58,237,0.25)',
            flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: 13, color: '#ccc' }}>
              <span style={{ color: '#888' }}>Input: </span>
              <strong style={{ color: '#e0e0ff' }}>{inputChars.toLocaleString()} chars</strong>
            </div>
            <div style={{ fontSize: 13, color: '#ccc' }}>
              <span style={{ color: '#888' }}>Output: </span>
              <strong style={{ color: '#e0e0ff' }}>{outputChars.toLocaleString()} chars</strong>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Output</label>
              <button style={{ ...btnStyle(), padding: '6px 14px', fontSize: 12 }} onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              style={{ ...inputStyle, minHeight: 220 }}
              value={output}
              readOnly
              spellCheck={false}
            />
          </div>
        </>
      )}
    </div>
  )
}
