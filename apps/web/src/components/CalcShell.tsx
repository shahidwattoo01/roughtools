'use client'
import type React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import type { CalcPDFConfig } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface FAQ    { q: string; a: string }
export interface RelTool { name: string; icon: string; desc: string; href: string }
export interface FormulaInfo {
  expression: string          // e.g. "M = P × r(1+r)ⁿ / ((1+r)ⁿ − 1)"
  variables: { name: string; desc: string }[]
  example?: string
  reference?: string
}

export interface CalcShellProps {
  // Core identity
  title: string
  description: string
  icon?: string
  badge?: string              // "Financially accurate" / "Mathematically accurate"

  // Calculator content
  children: React.ReactNode

  // How-to-use steps
  howToUse?: string[]

  // Formula section
  formula?: FormulaInfo

  // Results explanation (appears after results, before FAQ)
  resultsGuide?: { label: string; explanation: string }[]

  // FAQ
  faqs?: FAQ[]

  // Related tools
  relatedTools?: RelTool[]

  // PDF export — call site provides the function
  onExportPDF?: () => Promise<void>

  // SEO
  category?: string           // e.g. "Calculators" for breadcrumb
  categoryHref?: string
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TRUST_BADGES = [
  { icon: '⚡', label: 'Instant results' },
  { icon: '🔒', label: 'Runs in your browser' },
  { icon: '🆓', label: 'Always free' },
  { icon: '🚫', label: 'No signup required' },
]

// Extracts a leading emoji from a badge string; falls back to ✅
function parseBadgeIcon(badge: string): { icon: string; label: string } {
  const emojiRe = /^(\p{Emoji_Presentation}|\p{Emoji}️)\s*/u
  const match = badge.match(emojiRe)
  if (match) {
    return { icon: match[0].trim(), label: badge.slice(match[0].length).trim() }
  }
  return { icon: '✅', label: badge }
}

function TrustBadges({ badge }: { badge?: string }) {
  const rawBadge = badge ?? 'Verified accurate'
  const fifth = parseBadgeIcon(rawBadge)
  const all = [...TRUST_BADGES, fifth]
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
      {all.map(b => (
        <span key={b.label} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--fg-1)', fontWeight: 500,
        }}>
          {b.icon} {b.label}
        </span>
      ))}
    </div>
  )
}

function Disclaimer() {
  return (
    <div style={{
      background: 'rgba(245,158,11,0.08)',
      border: '1px solid rgba(245,158,11,0.30)',
      borderRadius: 12,
      padding: '16px 20px',
      marginTop: 36,
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>⚠️</span>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', margin: '0 0 4px' }}>Disclaimer</p>
        <p style={{ fontSize: 13, color: '#d97706', lineHeight: 1.65, margin: 0 }}>
          Results are provided for <strong style={{ color: '#f59e0b' }}>informational and educational purposes only</strong>.
          They should not be used as a substitute for professional financial, engineering, medical, or legal advice.
          Always verify outputs with a qualified professional before making important decisions.
          Roughtools makes no warranties regarding accuracy or completeness for your specific situation.
        </p>
      </div>
    </div>
  )
}

function HowToUse({ steps }: { steps: string[] }) {
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginBottom: 16 }}>
        How to Use This Calculator
      </h2>
      <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((step, i) => (
          <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{
              flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: 'var(--brand-2)',
            }}>{i + 1}</span>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.6, margin: 0, paddingTop: 4 }}>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function FormulaSection({ formula }: { formula: FormulaInfo }) {
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginBottom: 12 }}>
        📐 How This Is Calculated
      </h2>
      <div style={{
        background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 16,
      }}>
        <p style={{ fontFamily: 'monospace', fontSize: 15, color: 'var(--fg-1)', margin: 0, wordBreak: 'break-all' }}>
          {formula.expression}
        </p>
      </div>
      {formula.variables.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {formula.variables.map(v => (
            <div key={v.name} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
              <code style={{ color: 'var(--brand-2)', fontFamily: 'monospace', minWidth: 50 }}>{v.name}</code>
              <span style={{ color: 'var(--fg-3)' }}>—</span>
              <span style={{ color: 'var(--fg-2)' }}>{v.desc}</span>
            </div>
          ))}
        </div>
      )}
      {formula.example && (
        <div style={{
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#6ee7b7',
        }}>
          <strong>Example:</strong> {formula.example}
        </div>
      )}
      {formula.reference && (
        <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 10 }}>
          Reference: {formula.reference}
        </p>
      )}
    </section>
  )
}

function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginBottom: 16 }}>
        Frequently Asked Questions
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
            borderRadius: 10, overflow: 'hidden',
          }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 18px',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{faq.q}</span>
              <span style={{ fontSize: 18, color: '#8b5cf6', flexShrink: 0 }}>{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <div style={{ padding: '0 18px 14px', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function RelatedToolsSection({ tools }: { tools: RelTool[] }) {
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginBottom: 16 }}>
        More Calculator Tools
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 12 }}>
        {tools.map(t => (
          <Link key={t.href} href={t.href} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
            borderRadius: 10, textDecoration: 'none', transition: 'border-color 0.2s',
          }}>
            <span style={{
              fontSize: 22, flexShrink: 0,
              background: 'rgba(139,92,246,0.15)', borderRadius: 8, padding: '6px 8px', lineHeight: 1,
            }}>{t.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>{t.name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{t.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────
export default function CalcShell({
  title, description, icon, badge,
  children, howToUse, formula, resultsGuide, faqs, relatedTools,
  onExportPDF, category = 'Calculators', categoryHref = '/tools/calculators',
}: CalcShellProps) {
  const [pdfLoading, setPdfLoading] = useState(false)

  const handlePDF = async () => {
    if (!onExportPDF) return
    setPdfLoading(true)
    try { await onExportPDF() } finally { setPdfLoading(false) }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>

      {/* Breadcrumb */}
      <nav style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 20 }}>
        <Link href="/" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>Home</Link>
        {' › '}
        <Link href={categoryHref} style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>{category}</Link>
        {' › '}
        <span style={{ color: 'var(--fg-1)' }}>{title}</span>
      </nav>

      {/* H1 */}
      {icon && (
        <div style={{
          fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px',
          lineHeight: 1, marginBottom: 12,
        }}>
          {icon}
        </div>
      )}
      <h1 style={{
        fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)',
        margin: '0 0 10px', letterSpacing: '-0.5px',
      }}>
        {title}
      </h1>
      <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
        {description}
      </p>

      {/* Trust badges */}
      <TrustBadges badge={badge} />

      {/* ── Calculator ── */}
      <div id="calc-content">
        {children}
      </div>

      {/* PDF export button */}
      {onExportPDF && (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={handlePDF}
            disabled={pdfLoading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: pdfLoading ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: 8, padding: '10px 20px', color: 'var(--brand-2)',
              fontSize: 14, fontWeight: 600, cursor: pdfLoading ? 'wait' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {pdfLoading ? '⏳ Generating PDF…' : '📄 Export PDF Report'}
          </button>
        </div>
      )}

      {/* How to Use */}
      {howToUse && howToUse.length > 0 && <HowToUse steps={howToUse} />}

      {/* Formula */}
      {formula && <FormulaSection formula={formula} />}

      {/* Results guide */}
      {resultsGuide && resultsGuide.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginBottom: 14 }}>
            Understanding Your Results
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {resultsGuide.map(r => (
              <div key={r.label} style={{
                background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                borderRadius: 10, padding: '12px 16px',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>{r.explanation}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs && faqs.length > 0 && <FAQSection faqs={faqs} />}

      {/* Related tools */}
      {relatedTools && relatedTools.length > 0 && <RelatedToolsSection tools={relatedTools} />}

      {/* Disclaimer */}
      <Disclaimer />
    </div>
  )
}
