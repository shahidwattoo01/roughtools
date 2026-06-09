'use client'
import { useState } from 'react'

type YamlValue = string | number | boolean | null | YamlValue[] | { [k: string]: YamlValue }

interface ValidationResult {
  ok: boolean
  error?: string
  lineCount?: number
  parsed?: { [k: string]: YamlValue }
}

function getIndent(line: string): number {
  let i = 0
  while (i < line.length && line[i] === ' ') i++
  return i
}

function validateYAML(yaml: string): ValidationResult {
  const lines = yaml.split('\n')
  const lineCount = lines.filter(l => l.trim()).length

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/\t/.test(line.match(/^(\s*)/)?.[1] ?? '')) {
      return { ok: false, error: `Line ${i + 1}: Tab character in indentation. YAML requires spaces only.` }
    }
  }

  const indentLevels: number[] = []
  const keyStacks: Array<{ indent: number; keys: Set<string> }> = [{ indent: -1, keys: new Set() }]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const indent = getIndent(line)

    // Check indentation consistency
    if (indentLevels.length > 0) {
      const prevIndents = indentLevels.filter(l => l > 0)
      if (prevIndents.length > 0 && indent > 0) {
        const baseIndent = prevIndents[0]
        if (indent % baseIndent !== 0 && !indentLevels.includes(indent)) {
          // Allow irregular but non-tab indentation
        }
      }
    }
    if (indent > 0 && !indentLevels.includes(indent)) indentLevels.push(indent)

    // Pop key stacks for decreased indent
    while (keyStacks.length > 1 && keyStacks[keyStacks.length - 1].indent >= indent) {
      keyStacks.pop()
    }

    // Check duplicate keys
    const keyMatch = trimmed.match(/^([^:#[\]{},|>&*!'"]+?)\s*:/)
    if (keyMatch && !trimmed.startsWith('-')) {
      const key = keyMatch[1].trim()
      const currentStack = keyStacks[keyStacks.length - 1]
      if (currentStack.indent === indent - (indentLevels[0] || 2)) {
        if (currentStack.keys.has(key)) {
          return { ok: false, error: `Line ${i + 1}: Duplicate key "${key}" at indent level ${indent}.` }
        }
        currentStack.keys.add(key)
      } else {
        keyStacks.push({ indent, keys: new Set([key]) })
      }
    }

    // Check unclosed quotes
    const singleOpen = (trimmed.match(/'/g) || []).length
    const doubleOpen = (trimmed.match(/(?<!\\)"/g) || []).length
    if (singleOpen % 2 !== 0) {
      return { ok: false, error: `Line ${i + 1}: Unclosed single quote.` }
    }
    if (doubleOpen % 2 !== 0) {
      return { ok: false, error: `Line ${i + 1}: Unclosed double quote.` }
    }
  }

  try {
    const parsed = parseSimpleYAML(yaml)
    return { ok: true, lineCount, parsed }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

function parseScalar(val: string): YamlValue {
  const v = val.trim()
  if (v === 'true' || v === 'yes') return true
  if (v === 'false' || v === 'no') return false
  if (v === 'null' || v === '~' || v === '') return null
  if (!isNaN(Number(v)) && v !== '') return Number(v)
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1)
  }
  return v
}

function parseSimpleYAML(yaml: string): { [k: string]: YamlValue } {
  const lines = yaml.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'))
  const root: { [k: string]: YamlValue } = {}
  const stack: Array<{ indent: number; obj: { [k: string]: YamlValue } | YamlValue[] }> = [{ indent: -1, obj: root }]

  for (const line of lines) {
    const indent = getIndent(line)
    const trimmed = line.trim()

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop()
    }

    const parent = stack[stack.length - 1].obj

    if (trimmed.startsWith('- ')) {
      const val = trimmed.slice(2).trim()
      if (Array.isArray(parent)) {
        parent.push(parseScalar(val))
      }
      continue
    }

    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue

    const key = trimmed.slice(0, colonIdx).trim()
    const rest = trimmed.slice(colonIdx + 1).trim()

    if (!Array.isArray(parent)) {
      if (rest === '' || rest === '|' || rest === '>') {
        const child: { [k: string]: YamlValue } = {}
        parent[key] = child
        stack.push({ indent, obj: child })
      } else if (rest.startsWith('-')) {
        const arr: YamlValue[] = []
        parent[key] = arr
        stack.push({ indent, obj: arr })
      } else {
        parent[key] = parseScalar(rest)
      }
    }
  }

  return root
}

function renderTree(obj: { [k: string]: YamlValue } | YamlValue[], depth = 0): React.ReactNode {
  const pad = depth * 16
  if (Array.isArray(obj)) {
    return (
      <div style={{ paddingLeft: pad }}>
        {obj.map((item, i) => (
          <div key={i} style={{ color: '#a78bfa', fontSize: 13 }}>
            <span style={{ color: '#888' }}>- </span>
            {typeof item === 'object' && item !== null
              ? renderTree(item as { [k: string]: YamlValue }, depth + 1)
              : <span style={{ color: '#4ade80' }}>{String(item)}</span>}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div style={{ paddingLeft: pad }}>
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} style={{ fontSize: 13, marginBottom: 2 }}>
          <span style={{ color: '#a78bfa', fontWeight: 600 }}>{k}</span>
          <span style={{ color: '#888' }}>: </span>
          {typeof v === 'object' && v !== null
            ? renderTree(v as { [k: string]: YamlValue }, depth + 1)
            : <span style={{ color: '#4ade80' }}>{String(v)}</span>}
        </div>
      ))}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', borderRadius: 8,
  background: '#252540', border: '1px solid rgba(255,255,255,0.1)',
  color: '#e0e0ff', fontSize: 13, fontFamily: 'monospace',
  resize: 'vertical', minHeight: 180, boxSizing: 'border-box',
}

const btnStyle = (accent?: boolean): React.CSSProperties => ({
  padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14,
  cursor: 'pointer', border: 'none',
  background: accent ? '#a78bfa' : 'rgba(255,255,255,0.08)',
  color: accent ? '#0f0f1e' : '#e0e0ff',
})

export default function YamlValidatorClient() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [jsonOutput, setJsonOutput] = useState('')
  const [copied, setCopied] = useState(false)

  function handleValidate() {
    setJsonOutput('')
    setResult(validateYAML(input))
  }

  function handleToJson() {
    const r = validateYAML(input)
    if (!r.ok) { setResult(r); return }
    try {
      const parsed = parseSimpleYAML(input)
      setJsonOutput(JSON.stringify(parsed, null, 2))
      setResult(null)
    } catch (e) {
      setResult({ ok: false, error: (e as Error).message })
    }
  }

  function copy() {
    if (!jsonOutput) return
    navigator.clipboard.writeText(jsonOutput).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>YAML Input</label>
        <textarea
          style={inputStyle}
          value={input}
          onChange={e => { setInput(e.target.value); setResult(null); setJsonOutput('') }}
          placeholder={'name: my-app\nversion: 1.0.0\nserver:\n  host: localhost\n  port: 3000\ntags:\n  - web\n  - api'}
          spellCheck={false}
        />
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <button style={btnStyle(true)} onClick={handleValidate}>Validate</button>
        <button style={btnStyle()} onClick={handleToJson}>Convert to JSON</button>
      </div>
      {result && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: result.ok ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${result.ok ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`, color: result.ok ? '#4ade80' : '#f87171', fontSize: 13, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {result.ok ? `✓ Valid YAML — ${result.lineCount} non-empty lines` : `✗ Invalid YAML\n${result.error}`}
          </div>
          {result.ok && result.parsed && Object.keys(result.parsed).length > 0 && (
            <div style={{ marginTop: 12, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600, marginBottom: 8 }}>Parsed Structure</div>
              {renderTree(result.parsed)}
            </div>
          )}
        </div>
      )}
      {jsonOutput && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>JSON Output</label>
            <button style={{ ...btnStyle(), padding: '6px 14px', fontSize: 12 }} onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <textarea style={{ ...inputStyle, minHeight: 180 }} value={jsonOutput} readOnly spellCheck={false} />
        </div>
      )}
    </div>
  )
}
