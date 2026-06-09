'use client'

/**
 * ToolContent.tsx
 *
 * Reusable sub-components that turn any tool page from "thin content"
 * into a fully-formed, unique, SEO-worthy resource.
 *
 * Each export is a self-contained section. Compose them below the tool
 * widget on every tool page:
 *
 *   <ToolHowTo steps={[...]} />
 *   <ToolFormula formula="..." explanation="..." />
 *   <ToolExample title="..." inputTable={[...]} result="..." notes="..." />
 *   <ToolFAQ items={[...]} />
 *   <ToolCommonMistakes items={[...]} />
 *   <ToolRelatedPosts posts={[...]} />
 *
 * Compliance components (rules B-6, B-8, B-9, E-1, F-1, F-2, F-3):
 *   <ToolFeaturesList features={[...]} />
 *   <ToolDisclaimer type="financial" />
 *   <ToolPrivacyNotice />
 *   <PDFExportButton toolName="..." />
 *   <ToolStarRating toolName="..." toolSlug="..." />
 *   <ToolFeedback toolName="..." />
 *   <ToolSocialShare toolName="..." />
 *   — or use the composite:
 *   <ToolPageExtras toolName="..." toolSlug="..." type="financial" showPDF />
 *
 * The shared card style matches the dark design system.
 */

// Re-export compliance components so pages only need one import location
export { ToolDisclaimer } from '@/components/ToolDisclaimer'
export { ToolPrivacyNotice } from '@/components/ToolPrivacyNotice'
export { ToolStarRating } from '@/components/ToolStarRating'
export { ToolFeedback } from '@/components/ToolFeedback'
export { ToolSocialShare } from '@/components/ToolSocialShare'
export { PDFExportButton } from '@/components/PDFExportButton'
export { ToolFeaturesList } from '@/components/ToolFeaturesList'
export { ToolPageExtras } from '@/components/ToolPageExtras'

// ─── Shared primitives ────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  marginTop: 40,
  padding: '28px 32px',
  background: 'var(--bg-2, rgba(255,255,255,0.025))',
  borderRadius: 16,
  border: '1px solid var(--line, rgba(255,255,255,0.07))',
}

const h2Style: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  color: 'var(--fg, #e4e8ff)',
  marginBottom: 20,
  marginTop: 0,
}

const bodyText: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--fg-2, #9499bd)',
  lineHeight: 1.75,
  margin: '0 0 10px',
}

// ─── HowTo ────────────────────────────────────────────────────────────────────

interface HowToStep {
  /** Short heading for the step, e.g. "Enter your weight" */
  name: string
  /** Full explanation paragraph */
  text: string
}

interface ToolHowToProps {
  steps: HowToStep[]
  title?: string
}

export function ToolHowTo({ steps, title = 'How to Use This Tool' }: ToolHowToProps) {
  return (
    <section style={card} aria-labelledby="howto-heading">
      <h2 id="howto-heading" style={h2Style}>{title}</h2>
      <ol style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {steps.map((step, i) => (
          <li key={i} style={{ paddingLeft: 8 }}>
            <strong style={{ display: 'block', fontSize: 14, color: 'var(--fg, #c4caff)', marginBottom: 4 }}>
              Step {i + 1}: {step.name}
            </strong>
            <p style={{ ...bodyText, margin: 0 }}>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

// ─── Formula / Method ─────────────────────────────────────────────────────────

interface ToolFormulaProps {
  /** The formula or algorithm — displayed in a monospace block */
  formula: string
  /** Plain-English explanation of each variable / term */
  explanation: string
  title?: string
  /** Optional: link to the authoritative source */
  sourceLabel?: string
  sourceHref?: string
}

export function ToolFormula({
  formula,
  explanation,
  title = 'The Formula & Method',
  sourceLabel,
  sourceHref,
}: ToolFormulaProps) {
  return (
    <section style={card} aria-labelledby="formula-heading">
      <h2 id="formula-heading" style={h2Style}>{title}</h2>
      <pre
        style={{
          background: 'rgba(124,139,255,0.07)',
          border: '1px solid rgba(124,139,255,0.18)',
          borderRadius: 10,
          padding: '16px 20px',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: 14,
          color: 'var(--fg, #a5b0ff)',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: '0 0 16px',
        }}
        aria-label="Formula"
      >
        {formula}
      </pre>
      <p style={bodyText}>{explanation}</p>
      {sourceLabel && sourceHref && (
        <p style={{ ...bodyText, fontSize: 12, marginTop: 8 }}>
          Source:{' '}
          <a href={sourceHref} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent, #7c8bff)', textDecoration: 'underline' }}>
            {sourceLabel}
          </a>
        </p>
      )}
    </section>
  )
}

// ─── Worked Example ───────────────────────────────────────────────────────────

interface ExampleRow {
  label: string
  value: string
}

interface ToolExampleProps {
  title?: string
  /** Short scenario description */
  scenario: string
  /** Input values shown as a table */
  inputs: ExampleRow[]
  /** The computed result */
  result: string
  /** Any interpretive notes */
  notes?: string
}

export function ToolExample({ title = 'Worked Example', scenario, inputs, result, notes }: ToolExampleProps) {
  return (
    <section style={card} aria-labelledby="example-heading">
      <h2 id="example-heading" style={h2Style}>{title}</h2>
      <p style={bodyText}><strong style={{ color: 'var(--fg, #c4caff)' }}>Scenario:</strong> {scenario}</p>

      {/* Inputs table */}
      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--accent, #7c8bff)', fontWeight: 600, borderBottom: '1px solid var(--line, rgba(255,255,255,0.08))', fontSize: 12 }}>
                Input
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--accent, #7c8bff)', fontWeight: 600, borderBottom: '1px solid var(--line, rgba(255,255,255,0.08))', fontSize: 12 }}>
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((row, i) => (
              <tr key={i}>
                <td style={{ padding: '8px 12px', color: 'var(--fg-2, #9499bd)', borderBottom: '1px solid var(--line, rgba(255,255,255,0.04))' }}>{row.label}</td>
                <td style={{ padding: '8px 12px', color: 'var(--fg, #c4caff)', fontFamily: 'var(--font-mono,monospace)', borderBottom: '1px solid var(--line, rgba(255,255,255,0.04))' }}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Result */}
      <div style={{
        padding: '14px 18px',
        background: 'rgba(124,139,255,0.08)',
        borderRadius: 10,
        border: '1px solid rgba(124,139,255,0.2)',
        marginBottom: notes ? 16 : 0,
      }}>
        <strong style={{ fontSize: 13, color: 'var(--accent, #7c8bff)' }}>Result: </strong>
        <span style={{ fontSize: 14, color: 'var(--fg, #d0d5ff)' }}>{result}</span>
      </div>

      {notes && <p style={{ ...bodyText, marginTop: 12, marginBottom: 0 }}>{notes}</p>}
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

interface FAQItem {
  q: string
  a: string
}

interface ToolFAQProps {
  items: FAQItem[]
  title?: string
}

export function ToolFAQ({ items, title = 'Frequently Asked Questions' }: ToolFAQProps) {
  return (
    <section style={{ marginTop: 40 }} aria-labelledby="faq-heading">
      <h2 id="faq-heading" style={h2Style}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item, i) => (
          <details key={i} style={{
            padding: '18px 22px',
            background: 'rgba(255,255,255,0.025)',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.07)',
            cursor: 'pointer',
          }}>
            <summary style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--fg, #c4caff)',
              listStyle: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              {item.q}
              <span aria-hidden="true" style={{ color: 'var(--accent, #7c8bff)', fontSize: 18, flexShrink: 0, marginLeft: 12 }}>+</span>
            </summary>
            <p style={{ ...bodyText, marginTop: 12, marginBottom: 0 }}>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

// ─── Common Mistakes ──────────────────────────────────────────────────────────

interface MistakeItem {
  mistake: string
  fix: string
}

interface ToolCommonMistakesProps {
  items: MistakeItem[]
  title?: string
}

export function ToolCommonMistakes({ items, title = 'Common Mistakes to Avoid' }: ToolCommonMistakesProps) {
  return (
    <section style={card} aria-labelledby="mistakes-heading">
      <h2 id="mistakes-heading" style={h2Style}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <span style={{
              flexShrink: 0,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: '#ef4444',
              marginTop: 2,
            }} aria-hidden="true">✕</span>
            <div>
              <p style={{ ...bodyText, margin: '0 0 4px', color: 'var(--fg-2, #c4a0a0)' }}>
                <strong style={{ color: '#ef9090' }}>Mistake:</strong> {item.mistake}
              </p>
              <p style={{ ...bodyText, margin: 0 }}>
                <strong style={{ color: '#86efac' }}>Fix:</strong> {item.fix}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Related Blog Posts ───────────────────────────────────────────────────────

interface RelatedPost {
  title: string
  href: string
  description: string
}

interface ToolRelatedPostsProps {
  posts: RelatedPost[]
  title?: string
}

export function ToolRelatedPosts({ posts, title = 'Further Reading' }: ToolRelatedPostsProps) {
  if (!posts.length) return null
  return (
    <section style={{ marginTop: 40 }} aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading" style={h2Style}>{title}</h2>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))' }}>
        {posts.map((post, i) => (
          <a
            key={i}
            href={post.href}
            style={{
              display: 'block',
              padding: '18px 22px',
              background: 'rgba(255,255,255,0.025)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.07)',
              textDecoration: 'none',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,139,255,0.3)'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(124,139,255,0.06)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'
            }}
          >
            <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: 'var(--fg, #a5b0ff)' }}>
              {post.title}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--fg-2, #767ba0)', lineHeight: 1.5 }}>
              {post.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}
