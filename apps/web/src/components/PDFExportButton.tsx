'use client'

/**
 * PDFExportButton.tsx
 * Rule E-1 — PDF export for tools that produce results.
 * Uses window.print() with injected @media print styles that:
 *  - hide ad units and nav elements
 *  - set clean white background + black text
 *  - add site name + date footer
 * No ad code or tracking pixels are embedded in the printed output (Rule E-2).
 */

interface PDFExportButtonProps {
  toolName: string
}

const PRINT_STYLES = `
@media print {
  /* Hide ad units (ToolAdUnit has aria-label="Advertisement") */
  [aria-label="Advertisement"],
  .tool-ad-unit,
  ins.adsbygoogle,
  .adsbygoogle { display: none !important; }

  /* Hide nav, header, footer, chatbot, cookie banner */
  header, footer, nav,
  [id="cookie-consent"],
  [data-chat],
  .no-print { display: none !important; }

  /* Clean background */
  html, body { background: #fff !important; }

  /* Make text readable */
  body, p, li, td, th, span, div {
    color: #111 !important;
  }
  h1, h2, h3, h4 {
    color: #000 !important;
  }

  /* Remove background tints on cards */
  section, aside, details {
    background: transparent !important;
    border-color: #ddd !important;
  }

  /* Keep code blocks readable */
  pre, code {
    background: #f5f5f5 !important;
    color: #333 !important;
    border: 1px solid #ddd !important;
  }

  /* Page margins */
  @page {
    margin: 18mm 15mm;
  }

  /* Print footer with site and date */
  body::after {
    content: "roughtools.com — Printed " attr(data-print-date);
    display: block;
    text-align: center;
    font-size: 10px;
    color: #888 !important;
    margin-top: 24px;
    padding-top: 8px;
    border-top: 1px solid #ddd;
  }

  /* Expand all accordion items for print */
  details { display: block !important; }
  details > * { display: block !important; }

  /* Force page breaks sensibly */
  section { page-break-inside: avoid; }
}
`

export function PDFExportButton({ toolName }: PDFExportButtonProps) {
  const handlePrint = () => {
    // Stamp today's date on body for the CSS attr() trick
    document.body.setAttribute('data-print-date', new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    }))
    window.print()
  }

  return (
    <>
      {/* Inject print stylesheet once into document */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      <button
        type="button"
        onClick={handlePrint}
        aria-label={`Save ${toolName} results as PDF`}
        title="Save this page as a PDF for offline reference"
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
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Save as PDF
      </button>
    </>
  )
}
