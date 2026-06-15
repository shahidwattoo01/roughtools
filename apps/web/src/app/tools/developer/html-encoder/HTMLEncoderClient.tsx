'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Style tokens ─────────────────────────────────────────────────────────────
const CARD: CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
  borderRadius: 16, padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
  color: 'var(--fg)', fontSize: 13, fontFamily: 'monospace',
  resize: 'vertical', minHeight: 160, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'left', background: 'rgba(99,102,241,0.1)',
}
const TD: CSSProperties = { padding: '6px 12px', fontSize: 12, color: 'var(--fg-2)' }

// ─── Encoding engines ─────────────────────────────────────────────────────────
const NAMED_ENTITIES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  ' ': '&nbsp;', '©': '&copy;', '®': '&reg;', '™': '&trade;',
  '€': '&euro;', '£': '&pound;', '¥': '&yen;', '¢': '&cent;',
  '°': '&deg;', '±': '&plusmn;', '×': '&times;', '÷': '&divide;',
  '→': '&rarr;', '←': '&larr;', '↑': '&uarr;', '↓': '&darr;',
  '•': '&bull;', '…': '&hellip;', '–': '&ndash;', '—': '&mdash;',
  '“': '&ldquo;', '”': '&rdquo;', '‘': '&lsquo;', '’': '&rsquo;',
  '¡': '&iexcl;', '¿': '&iquest;', 'à': '&agrave;', 'á': '&aacute;',
  'â': '&acirc;', 'ã': '&atilde;', 'ä': '&auml;', 'å': '&aring;',
  'æ': '&aelig;', 'ç': '&ccedil;', 'è': '&egrave;', 'é': '&eacute;',
  'ê': '&ecirc;', 'ë': '&euml;', 'ì': '&igrave;', 'í': '&iacute;',
  'î': '&icirc;', 'ï': '&iuml;', 'ñ': '&ntilde;', 'ò': '&ograve;',
  'ó': '&oacute;', 'ô': '&ocirc;', 'ö': '&ouml;', 'ú': '&uacute;',
  'ü': '&uuml;', 'ý': '&yacute;', 'ÿ': '&yuml;',
}

const REVERSE_ENTITIES: Record<string, string> = Object.fromEntries(
  Object.entries(NAMED_ENTITIES).map(([k, v]) => [v, k])
)

function encodeHTML(str: string, mode: 'basic' | 'full' | 'unicode'): string {
  if (mode === 'basic') {
    return str
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
  }
  if (mode === 'full') {
    return str.split('').map(ch => NAMED_ENTITIES[ch] ?? ch).join('')
  }
  // unicode: encode non-ASCII as numeric entities
  return str.split('').map(ch => {
    if (NAMED_ENTITIES[ch]) return NAMED_ENTITIES[ch]
    const code = ch.codePointAt(0) ?? ch.charCodeAt(0)
    if (code > 127) return `&#x${code.toString(16).toUpperCase()};`
    return ch
  }).join('')
}

function decodeHTML(str: string): string {
  return str
    .replace(/&[a-zA-Z]+;/g, (ent) => REVERSE_ENTITIES[ent] ?? ent)
    .replace(/&#x([0-9a-fA-F]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function escapeJs(str: string): string {
  return str
    .replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    .replace(/'/g, "\\'").replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r').replace(/\t/g, '\\t')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}

// ─── Entities reference table ─────────────────────────────────────────────────
const ENTITIES_TABLE = Object.entries(NAMED_ENTITIES).map(([char, entity]) => ({ char, entity, code: `&#${char.codePointAt(0)};` }))

// ─── Component ────────────────────────────────────────────────────────────────
type EncMode = 'basic' | 'full' | 'unicode'
type OpMode  = 'encode' | 'decode' | 'xml' | 'js'

export default function HTMLEncoderClient() {
  const [input,    setInput]    = useState('')
  const [encMode,  setEncMode]  = useState<EncMode>('basic')
  const [opMode,   setOpMode]   = useState<OpMode>('encode')
  const [copied,   setCopied]   = useState(false)
  const [filter,   setFilter]   = useState('')
  const [showRef,  setShowRef]  = useState(false)

  const output = useMemo(() => {
    if (!input) return ''
    if (opMode === 'encode') return encodeHTML(input, encMode)
    if (opMode === 'decode') return decodeHTML(input)
    if (opMode === 'xml')    return escapeXml(input)
    if (opMode === 'js')     return escapeJs(input)
    return ''
  }, [input, opMode, encMode])

  const filteredEntities = useMemo(() => {
    if (!filter) return ENTITIES_TABLE.slice(0, 60)
    const f = filter.toLowerCase()
    return ENTITIES_TABLE.filter(e =>
      e.char.includes(filter) || e.entity.toLowerCase().includes(f)
    ).slice(0, 80)
  }, [filter])

  function copy() {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const opButtons: Array<{ id: OpMode; label: string; hint: string }> = [
    { id: 'encode', label: 'Encode HTML', hint: 'Convert chars → entities' },
    { id: 'decode', label: 'Decode HTML', hint: 'Entities → plain text' },
    { id: 'xml',    label: 'XML Escape',  hint: 'Safe for XML documents' },
    { id: 'js',     label: 'JS Escape',   hint: '\\n \\t \\" etc.' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Mode selection ── */}
      <div style={CARD}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {opButtons.map(b => (
            <button
              key={b.id}
              onClick={() => setOpMode(b.id)}
              title={b.hint}
              style={{
                ...BTN_GHOST,
                background: opMode === b.id ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.08)',
                borderColor: opMode === b.id ? 'rgba(139,92,246,0.7)' : 'rgba(139,92,246,0.25)',
              }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {opMode === 'encode' && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {(['basic', 'full', 'unicode'] as EncMode[]).map(m => (
              <button
                key={m}
                onClick={() => setEncMode(m)}
                style={{
                  ...BTN_GHOST,
                  padding: '6px 14px',
                  fontSize: 12,
                  background: encMode === m ? 'rgba(56,189,248,0.2)' : 'transparent',
                  borderColor: encMode === m ? 'rgba(56,189,248,0.5)' : 'rgba(139,92,246,0.2)',
                  color: encMode === m ? '#38bdf8' : 'var(--brand-2)',
                }}
              >
                {m === 'basic' ? 'Basic (< > & " \')' : m === 'full' ? 'Full Named' : 'Unicode Numeric'}
              </button>
            ))}
          </div>
        )}

        {/* Split panes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={LABEL}>Input</label>
            <textarea
              style={INPUT_BOX}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={opMode === 'decode' ? '&lt;h1&gt;Hello &amp; World&lt;/h1&gt;' : '<h1>Hello & "World" <tag>'}
              spellCheck={false}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 5 }}>
              <label style={LABEL}>Output</label>
              <button onClick={copy} style={{ ...BTN_GHOST, padding: '5px 12px', fontSize: 11 }}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              style={{ ...INPUT_BOX, color: 'var(--brand-2)' }}
              value={output}
              readOnly
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      {input && output && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
          {[
            { label: 'Input chars',  value: input.length.toLocaleString(),  color: '#6366f1' },
            { label: 'Output chars', value: output.length.toLocaleString(), color: '#10b981' },
            { label: 'Entities',     value: (output.match(/&[^;]+;/g) || []).length.toLocaleString(), color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ padding: '14px 12px', background: 'var(--bg-2)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Entity reference ── */}
      <div style={CARD}>
        <button
          onClick={() => setShowRef(v => !v)}
          style={{ ...BTN_GHOST, marginBottom: showRef ? 16 : 0, width: '100%', justifyContent: 'space-between' }}
        >
          <span>{showRef ? '▾' : '▸'} HTML Named Entity Reference</span>
          <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{ENTITIES_TABLE.length} entities</span>
        </button>

        {showRef && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={LABEL}>Filter entities</label>
              <input
                type="text"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder="Search by character or entity name..."
                style={{ ...INPUT_BOX, minHeight: 'unset', fontFamily: 'inherit', fontSize: 13 }}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Char', 'Named Entity', 'Numeric Code'].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEntities.map((e, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...TD, fontWeight: 700, color: 'var(--fg)', fontFamily: 'monospace', fontSize: 15 }}>{e.char}</td>
                      <td style={{ ...TD, fontFamily: 'monospace', color: 'var(--brand-2)' }}>{e.entity}</td>
                      <td style={{ ...TD, fontFamily: 'monospace', color: 'var(--fg-3)' }}>{e.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filter === '' && ENTITIES_TABLE.length > 60 && (
                <div style={{ textAlign: 'center', padding: '10px', fontSize: 12, color: 'var(--fg-3)' }}>
                  Showing first 60 — use search to filter all {ENTITIES_TABLE.length} entities.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {!input && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Paste text above — encoding and decoding updates instantly.
        </div>
      )}
    </div>
  )
}
