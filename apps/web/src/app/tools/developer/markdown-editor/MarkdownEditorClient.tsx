'use client'
import { useState, useRef, useCallback } from 'react'

// ── Simple Markdown → HTML parser (no external libs) ────────────────────────
function parseMarkdown(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let i = 0

  function escHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  function inlineParse(s: string): string {
    // code block spans first to avoid double-processing
    s = s.replace(/`([^`]+)`/g, (_, c) => `<code style="background:rgba(124,58,237,0.18);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.92em">${escHtml(c)}</code>`)
    // images before links
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `<img src="${src}" alt="${escHtml(alt)}" style="max-width:100%;border-radius:6px" />`)
    // links
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => `<a href="${href}" style="color:#a78bfa;text-decoration:underline" target="_blank" rel="noopener noreferrer">${escHtml(text)}</a>`)
    // bold
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>')
    // italic
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    s = s.replace(/_([^_]+)_/g, '<em>$1</em>')
    return s
  }

  while (i < lines.length) {
    const line = lines[i]

    // fenced code block
    if (line.trimStart().startsWith('```')) {
      const lang = line.trimStart().slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(escHtml(lines[i]))
        i++
      }
      out.push(`<pre style="background:#1a1a2e;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:16px;overflow-x:auto;margin:12px 0"><code${lang ? ` class="language-${lang}"` : ''} style="font-family:monospace;font-size:13px;color:#e0e0ff">${codeLines.join('\n')}</code></pre>`)
      i++
      continue
    }

    // heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const sizes = ['2em','1.6em','1.3em','1.1em','1em','0.9em']
      out.push(`<h${level} style="margin:16px 0 8px;font-weight:800;font-size:${sizes[level-1]};color:#e0e0ff;line-height:1.3">${inlineParse(escHtml(headingMatch[2]))}</h${level}>`)
      i++
      continue
    }

    // horizontal rule
    if (/^-{3,}\s*$/.test(line) || /^\*{3,}\s*$/.test(line) || /^_{3,}\s*$/.test(line)) {
      out.push('<hr style="border:none;border-top:1px solid rgba(255,255,255,0.15);margin:20px 0" />')
      i++
      continue
    }

    // blockquote
    if (line.startsWith('>')) {
      const bqLines: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) {
        bqLines.push(lines[i].slice(1).trimStart())
        i++
      }
      out.push(`<blockquote style="border-left:4px solid #7c3aed;margin:12px 0;padding:8px 16px;background:rgba(124,58,237,0.08);border-radius:0 6px 6px 0;color:#aaa">${inlineParse(escHtml(bqLines.join(' ')))}</blockquote>`)
      continue
    }

    // unordered list
    if (/^[-*]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(`<li style="margin:4px 0">${inlineParse(escHtml(lines[i].slice(2).trimStart()))}</li>`)
        i++
      }
      out.push(`<ul style="margin:8px 0;padding-left:24px;color:#e0e0ff">${items.join('')}</ul>`)
      continue
    }

    // ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(`<li style="margin:4px 0">${inlineParse(escHtml(lines[i].replace(/^\d+\.\s/, '')))}</li>`)
        i++
      }
      out.push(`<ol style="margin:8px 0;padding-left:24px;color:#e0e0ff">${items.join('')}</ol>`)
      continue
    }

    // blank line
    if (line.trim() === '') {
      i++
      continue
    }

    // paragraph – collect consecutive non-blank non-special lines
    const pLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].startsWith('>') &&
      !/^-{3,}\s*$/.test(lines[i]) &&
      !lines[i].trimStart().startsWith('```')
    ) {
      pLines.push(lines[i])
      i++
    }
    if (pLines.length) {
      out.push(`<p style="margin:8px 0;line-height:1.7;color:#d0d0f0">${inlineParse(escHtml(pLines.join(' ')))}</p>`)
    }
  }

  return out.join('\n')
}

// ── Styles ───────────────────────────────────────────────────────────────────
const card: React.CSSProperties = { background: '#13132a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }
const btnBase: React.CSSProperties = { padding: '6px 12px', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#e0e0ff' }
const accentBtn: React.CSSProperties = { ...btnBase, background: '#7c3aed', border: 'none', color: '#fff' }
const taStyle: React.CSSProperties = { width: '100%', height: '100%', minHeight: 420, padding: 16, background: 'transparent', border: 'none', outline: 'none', color: '#e0e0ff', fontSize: 14, fontFamily: 'monospace', lineHeight: 1.6, resize: 'none', boxSizing: 'border-box' }

const DEFAULT_MD = `# Welcome to Markdown Editor

Write **Markdown** on the left and see the *live preview* here.

## Features

- Bold, italic, code
- Headers and lists
- Blockquotes and horizontal rules
- Links and images

\`\`\`js
const hello = 'world'
console.log(hello)
\`\`\`

> Tip: Use the toolbar buttons to insert syntax quickly.

---

[Visit RoughTools](https://roughtools.com)
`

// ── Component ────────────────────────────────────────────────────────────────
export default function MarkdownEditorClient() {
  const [md, setMd] = useState(DEFAULT_MD)
  const [copied, setCopied] = useState(false)
  const taRef = useRef<HTMLTextAreaElement>(null)

  const html = parseMarkdown(md)

  const wordCount = md.trim() ? md.trim().split(/\s+/).length : 0
  const charCount = md.length

  function insertAt(before: string, after = '', placeholder = 'text') {
    const ta = taRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const sel = ta.value.slice(start, end) || placeholder
    const newVal = ta.value.slice(0, start) + before + sel + after + ta.value.slice(end)
    setMd(newVal)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + before.length, start + before.length + sel.length)
    }, 0)
  }

  const toolbar: Array<{ label: string; action: () => void }> = [
    { label: 'H1', action: () => insertAt('# ', '', 'Heading 1') },
    { label: 'H2', action: () => insertAt('## ', '', 'Heading 2') },
    { label: 'H3', action: () => insertAt('### ', '', 'Heading 3') },
    { label: 'B', action: () => insertAt('**', '**', 'bold') },
    { label: 'I', action: () => insertAt('*', '*', 'italic') },
    { label: '<>', action: () => insertAt('`', '`', 'code') },
    { label: '🔗', action: () => insertAt('[', '](https://)', 'link text') },
    { label: '- List', action: () => insertAt('- ', '', 'item') },
    { label: '1. List', action: () => insertAt('1. ', '', 'item') },
    { label: '> Quote', action: () => insertAt('> ', '', 'quote') },
    { label: '---', action: () => { const ta = taRef.current; if (!ta) return; const p = ta.selectionStart; const nv = ta.value.slice(0,p) + '\n---\n' + ta.value.slice(p); setMd(nv) } },
  ]

  function downloadMd() {
    const blob = new Blob([md], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function copyHtml() {
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMd(e.target.value)
  }, [])

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {toolbar.map(t => (
          <button key={t.label} style={btnBase} onClick={t.action}>{t.label}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button style={btnBase} onClick={downloadMd}>Download .md</button>
          <button style={accentBtn} onClick={copyHtml}>{copied ? 'Copied!' : 'Copy HTML'}</button>
        </div>
      </div>

      {/* Editor / Preview split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'start' }}>
        <div style={card}>
          <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 12, color: '#888', fontWeight: 600 }}>MARKDOWN</div>
          <textarea ref={taRef} style={taStyle} value={md} onChange={handleChange} spellCheck={false} />
        </div>
        <div style={card}>
          <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 12, color: '#888', fontWeight: 600 }}>PREVIEW</div>
          <div
            style={{ padding: 16, minHeight: 420, color: '#e0e0ff', fontSize: 15, lineHeight: 1.7, overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {/* Stats */}
      <div style={{ marginTop: 8, display: 'flex', gap: 20, fontSize: 12, color: '#888' }}>
        <span>Words: <strong style={{ color: '#a78bfa' }}>{wordCount}</strong></span>
        <span>Characters: <strong style={{ color: '#a78bfa' }}>{charCount}</strong></span>
      </div>
    </div>
  )
}
