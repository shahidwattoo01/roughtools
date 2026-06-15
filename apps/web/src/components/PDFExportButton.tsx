'use client'

import { useRef } from 'react'

/**
 * PDFExportButton.tsx
 * Opens a clean print popup containing ONLY:
 *   1. The tool results / calculator widget   [data-print-section="calculator"]
 *   2. The formula / method section           [data-print-section="formula"]
 *   3. The quick reference / results guide    [data-print-section="reference"]
 *
 * Falls back to smart heading-text detection when attributes are absent,
 * so legacy pages still work without per-page code changes.
 */

interface PDFExportButtonProps {
  toolName: string
}

/** Build the clean HTML string for the print popup */
function buildPrintHTML(toolName: string, bodyHTML: string): string {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${toolName} — Results</title>
  <style>
    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.65;
      color: #111;
      background: #fff;
      padding: 28px 36px 48px;
      max-width: 820px;
      margin: 0 auto;
    }

    /* ── Page header ── */
    .rt-print-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 2px solid #1a6b3c;
      padding-bottom: 12px;
      margin-bottom: 28px;
    }
    .rt-print-header h1 {
      font-size: 20px;
      font-weight: 700;
      color: #111;
    }
    .rt-print-header span {
      font-size: 11px;
      color: #666;
      white-space: nowrap;
      margin-top: 4px;
    }

    /* ── Force everything readable ── */
    * {
      background: transparent !important;
      color: #111 !important;
      border-color: #d1d5db !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    /* ── Section spacing ── */
    section, [data-print-section] {
      margin-bottom: 28px;
      padding: 0;
      border: none !important;
    }

    h2 {
      font-size: 16px;
      font-weight: 700;
      color: #111 !important;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #d1d5db !important;
    }
    h3 { font-size: 14px; font-weight: 600; color: #333 !important; margin-bottom: 8px; }
    p  { margin-bottom: 8px; font-size: 13px; color: #333 !important; }

    /* ── Result metric cards (the big number outputs) ── */
    [style*="border-radius"] {
      border: 1px solid #d1d5db !important;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 8px;
    }

    /* ── Formula code block ── */
    pre, code {
      font-family: 'Courier New', Courier, monospace !important;
      font-size: 13px;
      background: #f5f5f5 !important;
      color: #222 !important;
      border: 1px solid #d1d5db !important;
      border-radius: 6px;
      padding: 12px 16px;
      white-space: pre-wrap;
      word-break: break-word;
      display: block;
      margin-bottom: 10px;
    }

    /* ── Tables ── */
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 12px; }
    th, td { padding: 8px 12px; border: 1px solid #d1d5db !important; text-align: left; }
    th { background: #f9fafb !important; font-weight: 600; }
    tr:nth-child(even) td { background: #fafafa !important; }

    /* ── Inputs ── */
    input, select, textarea {
      border: 1px solid #d1d5db !important;
      border-radius: 4px;
      padding: 6px 10px;
      font-size: 13px;
      width: auto;
    }

    /* ── Hide interactive-only things in print ── */
    button, .no-print,
    [aria-label="Advertisement"],
    .tool-ad-unit, ins.adsbygoogle,
    nav, header, footer { display: none !important; }

    /* ── Details/summary always expanded ── */
    details > * { display: block !important; }
    summary { font-weight: 600; margin-bottom: 6px; }

    /* ── Grid layout simplification ── */
    [style*="grid"] { display: block !important; }

    /* ── Page break rules ── */
    @page { margin: 16mm 14mm; }
    section { page-break-inside: avoid; }
    h2 { page-break-after: avoid; }

    /* ── Footer ── */
    .rt-print-footer {
      margin-top: 36px;
      padding-top: 10px;
      border-top: 1px solid #d1d5db;
      font-size: 11px;
      color: #888 !important;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="rt-print-header">
    <h1>${toolName}</h1>
    <span>roughtools.com · ${date}</span>
  </div>

  ${bodyHTML}

  <div class="rt-print-footer">
    roughtools.com — free online tools, no signup required
  </div>
</body>
</html>`
}

/** Collect only the sections that should be printed */
function collectPrintSections(buttonEl?: HTMLButtonElement | null): Element[] {
  const found: Element[] = []

  // ── Priority 1: explicitly tagged sections ──────────────────
  // e.g. CalcShell (#calc-content), FormulaSection, ResultsGuide,
  //      QuickReferenceTable, converter page wrappers, text tool wrappers
  document.querySelectorAll('[data-print-section]').forEach(el => {
    found.push(el)
  })
  if (found.length > 0) return found

  // ── Priority 2: known ID from CalcShell ────────────────────
  const calcContent = document.getElementById('calc-content')
  if (calcContent) found.push(calcContent)

  // ── Priority 3: heading-text detection ─────────────────────
  // Pick up formula / reference sections on pages not yet tagged.
  document.querySelectorAll('section').forEach(sec => {
    if (found.includes(sec)) return
    const heading = (
      sec.querySelector('h2, h3')?.textContent ?? ''
    ).toLowerCase()
    if (/formula|method|how.*calc|reference|quick ref|result/i.test(heading)) {
      found.push(sec)
    }
  })

  if (found.length > 0) return found

  // ── Priority 4: walk up from the button ────────────────────
  // Covers client components (e.g. real-estate calculators) where
  // PDFExportButton is rendered inside the results div. Walk up
  // until we find a container that is tall enough and contains no
  // form inputs (which would mean it is the results area, not the
  // input form).
  if (buttonEl) {
    let el: Element | null = buttonEl.parentElement
    while (el && el !== document.body) {
      if (
        el.clientHeight > 80 &&
        el.querySelectorAll('input, select, textarea').length === 0
      ) {
        found.push(el)
        break
      }
      el = el.parentElement
    }
  }

  return found
}

/** Clone a section and strip things that shouldn't appear in print */
function cloneForPrint(el: Element): string {
  const clone = el.cloneNode(true) as Element

  // Remove buttons, ads, social-share, star-rating, feedback widgets
  clone.querySelectorAll(
    'button, .no-print, [aria-label="Advertisement"], ins.adsbygoogle, ' +
    '[data-print-hide], form[aria-label], [class*="star"], [class*="feedback"]'
  ).forEach(e => e.remove())

  return clone.outerHTML
}

export function PDFExportButton({ toolName }: PDFExportButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  const handlePrint = () => {
    const sections = collectPrintSections(btnRef.current)

    // ── Absolute fallback — nothing found, show all main content ──
    if (sections.length === 0) {
      const main = document.querySelector('main') ?? document.querySelector('[id="main-content"]')
      if (main) sections.push(main)
      else return  // nothing to print
    }

    const bodyHTML = sections.map(cloneForPrint).join('\n\n')
    const html = buildPrintHTML(toolName, bodyHTML)

    // ── Try popup first, fall back to hidden iframe ─────────
    const popup = window.open('', '_blank', 'width=900,height=700,scrollbars=yes')
    if (popup) {
      popup.document.write(html)
      popup.document.close()
      popup.focus()
      setTimeout(() => {
        popup.print()
        setTimeout(() => popup.close(), 500)
      }, 600)
      return
    }

    // Popup blocked — use a hidden iframe (never prints the whole page)
    const blob = new Blob([html], { type: 'text/html' })
    const blobUrl = URL.createObjectURL(blob)
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;'
    iframe.setAttribute('aria-hidden', 'true')
    document.body.appendChild(iframe)
    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
      } finally {
        setTimeout(() => {
          document.body.removeChild(iframe)
          URL.revokeObjectURL(blobUrl)
        }, 1000)
      }
    }
    iframe.src = blobUrl
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handlePrint}
      aria-label={`Save ${toolName} results as PDF`}
      title="Print or save only results, formula & reference — not the whole page"
      className="no-print"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '9px 18px',
        background: 'rgba(91,108,255,0.1)',
        border: '1px solid rgba(91,108,255,0.25)',
        borderRadius: 9,
        color: 'var(--brand)',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.background = 'rgba(91,108,255,0.18)'
        el.style.borderColor = 'rgba(91,108,255,0.4)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.background = 'rgba(91,108,255,0.1)'
        el.style.borderColor = 'rgba(91,108,255,0.25)'
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Save as PDF
    </button>
  )
}
