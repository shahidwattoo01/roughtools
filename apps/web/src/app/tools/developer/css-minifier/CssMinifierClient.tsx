'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Style tokens ─────────────────────────────────────────────────────────────
const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)',
  color: '#fff', fontSize: 13, fontFamily: 'monospace',
  resize: 'vertical', minHeight: 200, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const SELECT_BOX: CSSProperties = {
  padding: '8px 12px', borderRadius: 8,
  background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)',
  color: '#fff', fontSize: 13, cursor: 'pointer',
}

// ─── CSS processing engine ────────────────────────────────────────────────────
function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')           // remove comments
    .replace(/\s+/g, ' ')                         // collapse whitespace
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')        // remove spaces around delimiters
    .replace(/;}/g, '}')                          // remove trailing semicolons before }
    .replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3(?![0-9a-fA-F])/g, '#$1$2$3') // shorten hex
    .trim()
}

function beautifyCss(css: string, indentSize: number): string {
  const indent = ' '.repeat(indentSize)
  let result = ''
  let depth = 0
  let i = 0
  const s = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim()

  while (i < s.length) {
    const ch = s[i]
    if (ch === '{') {
      result += ' {\n' + indent.repeat(depth + 1)
      depth++
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1)
      result = result.trimEnd() + '\n' + indent.repeat(depth) + '}\n\n'
    } else if (ch === ';') {
      result += ';\n' + indent.repeat(depth)
    } else {
      result += ch
    }
    i++
  }
  return result.replace(/\n{3,}/g, '\n\n').trim()
}

function sortProperties(css: string): string {
  return css.replace(/\{([^}]+)\}/g, (_, body) => {
    const props = body.split(';').map((p: string) => p.trim()).filter(Boolean)
    return '{\n  ' + props.sort().join(';\n  ') + ';\n}'
  })
}

const VENDOR_PROPS: { prop: string; prefixes: string[] }[] = [
  { prop: 'animation',       prefixes: ['-webkit-'] },
  { prop: 'transform',       prefixes: ['-webkit-', '-ms-'] },
  { prop: 'transition',      prefixes: ['-webkit-'] },
  { prop: 'flex',            prefixes: ['-webkit-'] },
  { prop: 'user-select',     prefixes: ['-webkit-', '-moz-', '-ms-'] },
  { prop: 'appearance',      prefixes: ['-webkit-', '-moz-'] },
  { prop: 'box-sizing',      prefixes: ['-webkit-', '-moz-'] },
  { prop: 'border-radius',   prefixes: ['-webkit-', '-moz-'] },
  { prop: 'background-clip', prefixes: ['-webkit-'] },
  { prop: 'text-fill-color', prefixes: ['-webkit-'] },
  { prop: 'backface-visibility', prefixes: ['-webkit-'] },
  { prop: 'filter',          prefixes: ['-webkit-'] },
]

function checkVendorPrefixes(css: string): Array<{ prop: string; prefixes: string[] }> {
  const found: Array<{ prop: string; prefixes: string[] }> = []
  for (const { prop, prefixes } of VENDOR_PROPS) {
    const re = new RegExp(`\\b${prop}\\s*:`, 'i')
    if (re.test(css)) found.push({ prop, prefixes })
  }
  return found
}

function validateCss(css: string): string[] {
  const errors: string[] = []
  const lines = css.split('\n')
  let depth = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    depth += (line.match(/{/g) || []).length
    depth -= (line.match(/}/g) || []).length
    if (depth < 0) {
      errors.push(`Line ${i + 1}: Unexpected closing brace '}'.`)
      depth = 0
    }
    // Check for property without value
    if (/^\s*[\w-]+\s*$/.test(line) && !line.includes('{') && !line.includes('}') && !line.includes('//')) {
      errors.push(`Line ${i + 1}: Possible property "${line.trim()}" missing colon and value.`)
    }
  }
  if (depth > 0) errors.push(`${depth} unclosed rule block(s) — missing '}'.`)
  return errors
}

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  return `${(b / 1024).toFixed(2)} KB`
}

// ─── Component ────────────────────────────────────────────────────────────────
type Mode = 'minify' | 'beautify' | 'sort'

export default function CssMinifierClient() {
  const [input, setInput]   = useState('')
  const [mode,  setMode]    = useState<Mode>('minify')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'output' | 'vendor' | 'validate'>('output')

  const output = useMemo(() => {
    if (!input.trim()) return ''
    if (mode === 'minify')   return minifyCss(input)
    if (mode === 'beautify') return beautifyCss(input, indent)
    if (mode === 'sort')     return sortProperties(beautifyCss(input, indent))
    return ''
  }, [input, mode, indent])

  const vendorHints   = useMemo(() => checkVendorPrefixes(input), [input])
  const validationErrs = useMemo(() => validateCss(input), [input])

  const origBytes     = new TextEncoder().encode(input).length
  const outBytes      = new TextEncoder().encode(output).length
  const savedPct      = origBytes > 0 ? (((origBytes - outBytes) / origBytes) * 100).toFixed(1) : '0'

  function copy() {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const tabs: Array<{ id: typeof activeTab; label: string; count?: number }> = [
    { id: 'output',   label: 'Output' },
    { id: 'vendor',   label: 'Vendor Prefixes', count: vendorHints.length },
    { id: 'validate', label: 'Validation', count: validationErrs.length },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Controls ── */}
      <div style={CARD}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
          <div>
            <label style={LABEL}>Mode</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['minify', 'beautify', 'sort'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    ...BTN_GHOST,
                    background: mode === m ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.08)',
                    borderColor: mode === m ? 'rgba(139,92,246,0.7)' : 'rgba(139,92,246,0.25)',
                    textTransform: 'capitalize',
                  }}
                >
                  {m === 'sort' ? 'Sort Props' : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {(mode === 'beautify' || mode === 'sort') && (
            <div>
              <label style={LABEL}>Indent Size</label>
              <select value={indent} onChange={e => setIndent(Number(e.target.value))} style={SELECT_BOX}>
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
              </select>
            </div>
          )}
        </div>

        {/* Input */}
        <div>
          <label style={LABEL}>Input CSS</label>
          <textarea
            style={INPUT_BOX}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`.container {\n  background-color: #ffffff;\n  -webkit-transform: translateY(0);\n  transform: translateY(0);\n  border-radius: 8px;\n}`}
            spellCheck={false}
          />
        </div>
      </div>

      {/* ── Stats ── */}
      {input.trim() && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {[
            { label: 'Original',  value: fmtBytes(origBytes), color: '#6366f1' },
            { label: 'Output',    value: fmtBytes(outBytes),  color: '#10b981' },
            { label: 'Saved',     value: mode === 'minify' ? savedPct + '%' : '—', color: '#f59e0b' },
            { label: 'Lines In',  value: input.split('\n').length.toString(),  color: '#38bdf8' },
            { label: 'Lines Out', value: output.split('\n').length.toString(), color: '#38bdf8' },
          ].map(s => (
            <div key={s.label} style={{ padding: '14px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Output tabs ── */}
      {input.trim() && (
        <div style={CARD}>
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--line-strong)', paddingBottom: 12 }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  ...BTN_GHOST,
                  background: activeTab === t.id ? 'rgba(139,92,246,0.25)' : 'transparent',
                  borderColor: activeTab === t.id ? 'rgba(139,92,246,0.5)' : 'transparent',
                  fontSize: 12,
                }}
              >
                {t.label}
                {t.count !== undefined && t.count > 0 && (
                  <span style={{ background: '#f59e0b', color: '#000', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 800 }}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
            <div style={{ marginLeft: 'auto' }}>
              <button onClick={copy} style={{ ...BTN_GHOST, fontSize: 12 }}>
                {copied ? 'Copied!' : 'Copy Output'}
              </button>
            </div>
          </div>

          {/* Tab: Output */}
          {activeTab === 'output' && (
            <textarea
              style={{ ...INPUT_BOX, minHeight: 240, color: '#c4b5fd' }}
              value={output}
              readOnly
              spellCheck={false}
            />
          )}

          {/* Tab: Vendor Prefixes */}
          {activeTab === 'vendor' && (
            <div>
              {vendorHints.length === 0 ? (
                <div style={{ padding: '20px', color: '#4ade80', fontSize: 13 }}>
                  No vendor-prefixed properties detected in your input.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 4 }}>
                    These properties in your CSS may need vendor prefixes for older browsers:
                  </div>
                  {vendorHints.map(h => (
                    <div key={h.prop} style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>{h.prop}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>
                        Recommended prefixes: {h.prefixes.map(p => (
                          <code key={p} style={{ background: 'rgba(0,0,0,0.4)', padding: '1px 6px', borderRadius: 4, marginRight: 6, fontFamily: 'monospace', color: '#c4b5fd' }}>{p}{h.prop}</code>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Validation */}
          {activeTab === 'validate' && (
            <div>
              {validationErrs.length === 0 ? (
                <div style={{ padding: '20px', color: '#4ade80', fontSize: 13 }}>
                  No syntax errors detected — CSS looks valid.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {validationErrs.map((e, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, fontSize: 13, color: '#f87171', fontFamily: 'monospace' }}>
                      {e}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Empty state ── */}
      {!input.trim() && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Paste CSS above to minify, beautify, or sort properties — results update instantly.
        </div>
      )}
    </div>
  )
}
