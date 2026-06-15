'use client'
import { useState, useMemo, useCallback } from 'react'
import type { CSSProperties } from 'react'

// ─── Style tokens ─────────────────────────────────────────────────────────────
const CARD: CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '20px 24px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
  color: 'var(--fg)', fontSize: 13, fontFamily: 'monospace', boxSizing: 'border-box', resize: 'vertical',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '8px 16px', color: 'var(--brand-2)', fontSize: 13,
  fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
}
const BTN_ACTIVE: CSSProperties = {
  ...BTN_GHOST, background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.6)',
}

// ─── Syntax highlight ─────────────────────────────────────────────────────────
function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        if (/^"/.test(match)) {
          if (/:$/.test(match)) return `<span style="color:var(--brand-2)">${match}</span>`
          return `<span style="color:#86efac">${match}</span>`
        }
        if (/true|false/.test(match)) return `<span style="color:#f59e0b">${match}</span>`
        if (/null/.test(match)) return `<span style="color:#f87171">${match}</span>`
        return `<span style="color:#38bdf8">${match}</span>`
      }
    )
}

// ─── JSON Path Navigator ─────────────────────────────────────────────────────
function getJsonPaths(obj: unknown, prefix = '$'): Array<{ path: string; value: string }> {
  const paths: Array<{ path: string; value: string }> = []
  function walk(val: unknown, p: string) {
    if (val === null || typeof val !== 'object') { paths.push({ path: p, value: JSON.stringify(val) }); return }
    if (Array.isArray(val)) {
      val.slice(0, 5).forEach((item, i) => walk(item, `${p}[${i}]`))
      if (val.length > 5) paths.push({ path: `${p}[...]`, value: `(${val.length} items)` })
    } else {
      Object.entries(val as Record<string, unknown>).slice(0, 20).forEach(([k, v]) => walk(v, `${p}.${k}`))
    }
  }
  walk(obj, prefix)
  return paths.slice(0, 60)
}

// ─── JSON → TypeScript ───────────────────────────────────────────────────────
function jsonToTs(obj: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  if (obj === null) return 'null'
  if (Array.isArray(obj)) return obj.length === 0 ? 'unknown[]' : jsonToTs(obj[0], indent) + '[]'
  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) return 'Record<string, unknown>'
    const fields = entries.map(([k, v]) => {
      const safeKey = /^[a-zA-Z_]\w*$/.test(k) ? k : `"${k}"`
      return `${pad}  ${safeKey}: ${jsonToTs(v, indent + 1)}`
    })
    return `{\n${fields.join('\n')}\n${pad}}`
  }
  if (typeof obj === 'string') return 'string'
  if (typeof obj === 'number') return 'number'
  if (typeof obj === 'boolean') return 'boolean'
  return 'unknown'
}

// ─── JSON → YAML ─────────────────────────────────────────────────────────────
function jsonToYaml(obj: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  if (obj === null) return 'null'
  if (typeof obj === 'boolean') return obj ? 'true' : 'false'
  if (typeof obj === 'number') return String(obj)
  if (typeof obj === 'string') {
    if (/[:#[\]{},|>&*!'"@%]/.test(obj) || obj.includes('\n')) return `"${obj.replace(/"/g, '\\"')}"`
    return obj
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    return obj.map(item => `${pad}- ${jsonToYaml(item, indent + 1)}`).join('\n')
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    return entries.map(([k, v]) => {
      const val = jsonToYaml(v, indent + 1)
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) return `${pad}${k}:\n${val}`
      if (Array.isArray(v) && v.length > 0) return `${pad}${k}:\n${val}`
      return `${pad}${k}: ${val}`
    }).join('\n')
  }
  return String(obj)
}

// ─── Sort Keys ───────────────────────────────────────────────────────────────
function sortKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(sortKeys)
  const sorted: Record<string, unknown> = {}
  Object.keys(obj as Record<string, unknown>).sort().forEach(k => { sorted[k] = sortKeys((obj as Record<string, unknown>)[k]) })
  return sorted
}

// ─── JSON Schema generator ───────────────────────────────────────────────────
function generateSchema(obj: unknown): unknown {
  if (obj === null) return { type: 'null' }
  if (Array.isArray(obj)) return { type: 'array', items: obj.length > 0 ? generateSchema(obj[0]) : {} }
  if (typeof obj === 'object') {
    const props: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) props[k] = generateSchema(v)
    return { type: 'object', properties: props, required: Object.keys(obj as Record<string, unknown>) }
  }
  return { type: typeof obj }
}

// ─── Flatten ─────────────────────────────────────────────────────────────────
function flattenJson(obj: unknown, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  function walk(val: unknown, path: string) {
    if (val === null || typeof val !== 'object') { result[path] = val; return }
    if (Array.isArray(val)) val.forEach((item, i) => walk(item, path ? `${path}[${i}]` : `[${i}]`))
    else Object.entries(val as Record<string, unknown>).forEach(([k, v]) => walk(v, path ? `${path}.${k}` : k))
  }
  walk(obj, prefix)
  return result
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function byteSize(s: string) {
  const b = new TextEncoder().encode(s).length
  return b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`
}

// ─── Tree Node ───────────────────────────────────────────────────────────────
function TreeNode({ k, v, depth }: { k: string | null; v: unknown; depth: number }) {
  const [open, setOpen] = useState(depth < 2)
  const isObj = v !== null && typeof v === 'object'
  const isArr = Array.isArray(v)
  const label = k !== null ? <span style={{ color: 'var(--brand-2)', fontWeight: 600 }}>{k}: </span> : null
  if (!isObj) {
    const color = v === null ? '#f87171' : typeof v === 'boolean' ? '#f59e0b' : typeof v === 'number' ? '#38bdf8' : '#86efac'
    return (
      <div style={{ paddingLeft: depth * 16, fontFamily: 'monospace', fontSize: 12, lineHeight: '22px' }}>
        {label}<span style={{ color }}>{JSON.stringify(v)}</span>
      </div>
    )
  }
  const entries = isArr
    ? (v as unknown[]).map((item, i) => [String(i), item] as [string, unknown])
    : Object.entries(v as Record<string, unknown>)
  const count = entries.length
  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <div
        style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: '22px', cursor: count > 0 ? 'pointer' : 'default', userSelect: 'none' }}
        onClick={() => count > 0 && setOpen(o => !o)}
      >
        {count > 0 && <span style={{ color: '#6366f1', marginRight: 4 }}>{open ? '▾' : '▸'}</span>}
        {label}
        <span style={{ color: 'var(--fg-3)' }}>{isArr ? '[' : '{'}</span>
        {!open && <span style={{ color: 'var(--fg-3)' }}>{count} {isArr ? 'items' : 'keys'}{isArr ? ']' : '}'}</span>}
      </div>
      {open && (
        <>
          {entries.map(([ek, ev]) => <TreeNode key={ek} k={ek} v={ev} depth={depth + 1} />)}
          <div style={{ paddingLeft: depth * 16, fontFamily: 'monospace', fontSize: 12, color: 'var(--fg-3)' }}>{isArr ? ']' : '}'}</div>
        </>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
type Tab = 'format' | 'tree' | 'paths' | 'schema' | 'convert'
type ConvertMode = 'yaml' | 'ts' | 'flatten'
type IndentSize = 2 | 4

export default function JsonFormatterClient() {
  const [input, setInput] = useState('{\n  "name": "example",\n  "version": "1.0.0",\n  "active": true,\n  "count": 42,\n  "tags": ["web", "api"],\n  "config": { "host": "localhost", "port": 3000 }\n}')
  const [indent, setIndent] = useState<IndentSize>(2)
  const [tab, setTab] = useState<Tab>('format')
  const [convertMode, setConvertMode] = useState<ConvertMode>('yaml')
  const [copied, setCopied] = useState('')
  const [outputOverride, setOutputOverride] = useState<string | null>(null)
  const [opLabel, setOpLabel] = useState('Format')

  const parsed = useMemo<{ ok: boolean; value: unknown; err: string; line?: number; col?: number }>(() => {
    if (!input.trim()) return { ok: false, value: null, err: '' }
    try { return { ok: true, value: JSON.parse(input), err: '' } }
    catch (e) {
      const msg = (e as Error).message
      const m = msg.match(/position (\d+)/)
      if (m) {
        const pos = parseInt(m[1])
        const before = input.slice(0, pos)
        const line = (before.match(/\n/g) || []).length + 1
        const col = pos - before.lastIndexOf('\n')
        return { ok: false, value: null, err: msg, line, col }
      }
      return { ok: false, value: null, err: msg }
    }
  }, [input])

  const formatted = useMemo(() => {
    if (outputOverride !== null) return outputOverride
    if (!parsed.ok) return ''
    return JSON.stringify(parsed.value, null, indent)
  }, [parsed, indent, outputOverride])

  const inputSize = byteSize(input)
  const formattedSize = formatted ? byteSize(formatted) : '—'
  const minifiedStr = parsed.ok ? JSON.stringify(parsed.value) : ''
  const minifiedSize = minifiedStr ? byteSize(minifiedStr) : '—'
  const compressionRatio = parsed.ok && input.length > 0
    ? Math.round((1 - minifiedStr.length / input.length) * 100)
    : 0

  function runOp(op: string) {
    setOutputOverride(null); setOpLabel(op)
    if (!parsed.ok) return
    if (op === 'Format') setOutputOverride(null)
    else if (op === 'Minify') setOutputOverride(minifiedStr)
    else if (op === 'Sort Keys') setOutputOverride(JSON.stringify(sortKeys(parsed.value), null, indent))
    else if (op === 'Flatten') setOutputOverride(JSON.stringify(flattenJson(parsed.value), null, indent))
    else if (op === 'Escape') setOutputOverride(JSON.stringify(JSON.stringify(parsed.value)))
    else if (op === 'Validate') setOutputOverride(null)
  }

  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(''), 1500) })
  }, [])

  const convertOutput = useMemo(() => {
    if (!parsed.ok) return ''
    if (convertMode === 'yaml') return jsonToYaml(parsed.value)
    if (convertMode === 'ts') return `interface Root ${jsonToTs(parsed.value)}`
    if (convertMode === 'flatten') return JSON.stringify(flattenJson(parsed.value), null, 2)
    return ''
  }, [parsed, convertMode])

  const paths = useMemo(() => parsed.ok ? getJsonPaths(parsed.value) : [], [parsed])
  const schemaJson = useMemo(() => parsed.ok ? JSON.stringify(generateSchema(parsed.value), null, 2) : '', [parsed])

  const ops = ['Format', 'Minify', 'Sort Keys', 'Flatten', 'Escape', 'Validate']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Input */}
      <div style={CARD}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={LABEL}>JSON Input</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{inputSize}</span>
            <select
              value={indent}
              onChange={e => setIndent(Number(e.target.value) as IndentSize)}
              style={{ ...INPUT_BOX, width: 'auto', padding: '4px 8px', fontSize: 12, resize: 'none' }}
              aria-label="Indent size"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
        </div>
        <textarea
          style={{ ...INPUT_BOX, minHeight: 180 }}
          value={input}
          onChange={e => { setInput(e.target.value); setOutputOverride(null) }}
          placeholder={'{\n  "key": "value"\n}'}
          spellCheck={false}
          aria-label="JSON input"
        />
        {parsed.err && (
          <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', fontSize: 12, fontFamily: 'monospace' }}>
            {parsed.line ? `Line ${parsed.line}, Col ${parsed.col}: ` : ''}{parsed.err}
          </div>
        )}
        {parsed.ok && (
          <div style={{ marginTop: 6, fontSize: 11, color: '#4ade80', fontWeight: 600 }}>Valid JSON</div>
        )}
      </div>

      {/* Operations */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {ops.map(op => (
          <button key={op} onClick={() => runOp(op)} style={opLabel === op && parsed.ok ? BTN_ACTIVE : BTN_GHOST} aria-label={op}>
            {op}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      {parsed.ok && (
        <div style={{ display: 'flex', gap: 20, padding: '10px 16px', background: 'rgba(99,102,241,0.08)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)', flexWrap: 'wrap', fontSize: 12 }}>
          <span style={{ color: 'var(--fg-3)' }}>Input: <strong style={{ color: 'var(--fg-2)' }}>{inputSize}</strong></span>
          <span style={{ color: 'var(--fg-3)' }}>Formatted: <strong style={{ color: 'var(--fg-2)' }}>{formattedSize}</strong></span>
          <span style={{ color: 'var(--fg-3)' }}>Minified: <strong style={{ color: 'var(--fg-2)' }}>{minifiedSize}</strong></span>
          {compressionRatio > 0 && (
            <span style={{ color: 'var(--fg-3)' }}>Compression: <strong style={{ color: '#4ade80' }}>{compressionRatio}% smaller when minified</strong></span>
          )}
        </div>
      )}

      {/* Tabs */}
      {parsed.ok && (
        <>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['format', 'tree', 'paths', 'schema', 'convert'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={tab === t ? BTN_ACTIVE : BTN_GHOST} aria-pressed={tab === t}>
                {{ format: 'Output', tree: 'Tree View', paths: 'JSON Paths', schema: 'JSON Schema', convert: 'Convert' }[t]}
              </button>
            ))}
          </div>

          {/* Output */}
          {tab === 'format' && formatted && (
            <div style={CARD}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={LABEL}>Output — {opLabel}</label>
                <button onClick={() => copy(formatted, 'output')} style={BTN_GHOST}>
                  {copied === 'output' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div
                style={{ ...INPUT_BOX, minHeight: 200, overflowX: 'auto', whiteSpace: 'pre', display: 'block', padding: '12px', lineHeight: 1.65 } as CSSProperties}
                dangerouslySetInnerHTML={{ __html: syntaxHighlight(formatted) }}
              />
            </div>
          )}

          {/* Tree view */}
          {tab === 'tree' && (
            <div style={CARD}>
              <label style={LABEL}>Tree View — click nodes to expand/collapse</label>
              <div style={{ overflowX: 'auto', padding: '8px 0', maxHeight: 480, overflowY: 'auto' }}>
                <TreeNode k={null} v={parsed.value} depth={0} />
              </div>
            </div>
          )}

          {/* JSON Paths */}
          {tab === 'paths' && (
            <div style={CARD}>
              <label style={LABEL}>JSON Paths — click to copy</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 400, overflowY: 'auto' }}>
                {paths.map(({ path, value }) => (
                  <div
                    key={path}
                    onClick={() => copy(path, path)}
                    style={{ display: 'flex', gap: 12, padding: '7px 10px', borderRadius: 6, background: 'var(--bg-2)', cursor: 'pointer', fontFamily: 'monospace', fontSize: 12, alignItems: 'center' }}
                    title="Click to copy path"
                  >
                    <span style={{ color: 'var(--brand-2)', flex: 1 }}>{path}</span>
                    <span style={{ color: '#86efac', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                    {copied === path && <span style={{ color: '#4ade80', fontSize: 11 }}>Copied!</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schema */}
          {tab === 'schema' && (
            <div style={CARD}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={LABEL}>Auto-generated JSON Schema</label>
                <button onClick={() => copy(schemaJson, 'schema')} style={BTN_GHOST}>
                  {copied === 'schema' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div
                style={{ ...INPUT_BOX, minHeight: 200, overflowX: 'auto', whiteSpace: 'pre', display: 'block', padding: '12px', lineHeight: 1.65 } as CSSProperties}
                dangerouslySetInnerHTML={{ __html: syntaxHighlight(schemaJson) }}
              />
            </div>
          )}

          {/* Convert */}
          {tab === 'convert' && (
            <div style={CARD}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                {(['yaml', 'ts', 'flatten'] as ConvertMode[]).map(m => (
                  <button key={m} onClick={() => setConvertMode(m)} style={convertMode === m ? BTN_ACTIVE : BTN_GHOST}>
                    {{ yaml: 'JSON → YAML', ts: 'JSON → TypeScript', flatten: 'Flatten' }[m]}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <button onClick={() => copy(convertOutput, 'convert')} style={BTN_GHOST}>
                  {copied === 'convert' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <textarea
                style={{ ...INPUT_BOX, minHeight: 220 }}
                value={convertOutput}
                readOnly
                spellCheck={false}
                aria-label="Conversion output"
              />
            </div>
          )}
        </>
      )}

      {!parsed.ok && !input.trim() && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Paste JSON above — results appear instantly.
        </div>
      )}
    </div>
  )
}
