'use client'
import { useState } from 'react'

function serializeNode(node: Node, indent: string, level: number): string {
  const pad = indent.repeat(level)
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent || '').trim()
    return text ? pad + text : ''
  }
  if (node.nodeType === Node.COMMENT_NODE) {
    return pad + `<!--${node.textContent}-->`
  }
  if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    const pi = node as ProcessingInstruction
    return pad + `<?${pi.target} ${pi.data}?>`
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return ''

  const el = node as Element
  let attrs = ''
  for (let i = 0; i < el.attributes.length; i++) {
    const a = el.attributes[i]
    attrs += ` ${a.name}="${a.value}"`
  }

  const childNodes = Array.from(el.childNodes).filter(n => {
    if (n.nodeType === Node.TEXT_NODE) return (n.textContent || '').trim() !== ''
    return true
  })

  if (childNodes.length === 0) return `${pad}<${el.tagName}${attrs}/>`

  if (childNodes.length === 1 && childNodes[0].nodeType === Node.TEXT_NODE) {
    return `${pad}<${el.tagName}${attrs}>${childNodes[0].textContent}</${el.tagName}>`
  }

  const children = childNodes
    .map(c => serializeNode(c, indent, level + 1))
    .filter(Boolean)
    .join('\n')

  return `${pad}<${el.tagName}${attrs}>\n${children}\n${pad}</${el.tagName}>`
}

function formatXML(xml: string, indentSize: number): { result: string; error: string } {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  const errEl = doc.querySelector('parsererror')
  if (errEl) return { result: '', error: errEl.textContent || 'Parse error' }

  const indent = ' '.repeat(indentSize)
  const lines: string[] = []

  // XML declaration
  if (xml.trimStart().startsWith('<?xml')) {
    const declMatch = xml.match(/<\?xml[^?]*\?>/)
    if (declMatch) lines.push(declMatch[0])
  }

  const childNodes = Array.from(doc.childNodes).filter(n => {
    if (n.nodeType === Node.TEXT_NODE) return (n.textContent || '').trim() !== ''
    if (n.nodeType === Node.PROCESSING_INSTRUCTION_NODE && (n as ProcessingInstruction).target === 'xml') return false
    return true
  })

  for (const n of childNodes) {
    const s = serializeNode(n, indent, 0)
    if (s) lines.push(s)
  }

  return { result: lines.join('\n'), error: '' }
}

function minifyXML(xml: string): { result: string; error: string } {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  const errEl = doc.querySelector('parsererror')
  if (errEl) return { result: '', error: errEl.textContent || 'Parse error' }
  return { result: xml.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim(), error: '' }
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', borderRadius: 8,
  background: '#252540', border: '1px solid rgba(255,255,255,0.1)',
  color: '#e0e0ff', fontSize: 13, fontFamily: 'monospace',
  resize: 'vertical', minHeight: 160, boxSizing: 'border-box',
}

const btnStyle = (accent?: boolean): React.CSSProperties => ({
  padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14,
  cursor: 'pointer', border: 'none',
  background: accent ? '#a78bfa' : 'rgba(255,255,255,0.08)',
  color: accent ? '#0f0f1e' : '#e0e0ff',
})

export default function XmlFormatterClient() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null)
  const [indentSize, setIndentSize] = useState(2)
  const [copied, setCopied] = useState(false)

  function handleFormat() {
    const { result, error } = formatXML(input, indentSize)
    if (error) { setStatus({ msg: error, ok: false }); setOutput('') }
    else { setOutput(result); setStatus(null) }
  }

  function handleMinify() {
    const { result, error } = minifyXML(input)
    if (error) { setStatus({ msg: error, ok: false }); setOutput('') }
    else { setOutput(result); setStatus(null) }
  }

  function handleValidate() {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'text/xml')
    const errEl = doc.querySelector('parsererror')
    if (errEl) setStatus({ msg: errEl.textContent || 'Invalid XML', ok: false })
    else setStatus({ msg: '✓ Valid XML', ok: true })
    setOutput('')
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
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Indent:</label>
        <select
          value={indentSize}
          onChange={e => setIndentSize(Number(e.target.value))}
          style={{ padding: '6px 12px', borderRadius: 8, background: '#252540', border: '1px solid rgba(255,255,255,0.1)', color: '#e0e0ff', fontSize: 13 }}
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>XML Input</label>
        <textarea
          style={inputStyle}
          value={input}
          onChange={e => { setInput(e.target.value); setOutput(''); setStatus(null) }}
          placeholder={'<root><item id="1"><name>Example</name></item></root>'}
          spellCheck={false}
        />
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <button style={btnStyle(true)} onClick={handleFormat}>Format</button>
        <button style={btnStyle()} onClick={handleMinify}>Minify</button>
        <button style={btnStyle()} onClick={handleValidate}>Validate</button>
      </div>
      {status && (
        <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 8, background: status.ok ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${status.ok ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`, color: status.ok ? '#4ade80' : '#f87171', fontSize: 13, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          {status.msg}
        </div>
      )}
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
