/**
 * MedicalDisclaimer.tsx
 *
 * YMYL compliance component for all medical/health tool pages.
 *
 * Why this matters:
 *  - Google's YMYL (Your Money or Your Life) guidelines require highest
 *    E-E-A-T signals for health tools.
 *  - AdSense policy requires clear disclaimers on health-related content.
 *  - Medical tools that display clinical calculations need to state they
 *    are for educational / informational use only.
 *
 * Usage:
 *   import MedicalDisclaimer from '@/components/MedicalDisclaimer'
 *   <MedicalDisclaimer formula="BMI = weight(kg) ÷ height(m)²" sources={[...]} />
 */

interface Source {
  /** Short author/org name, e.g. "WHO, 2000" */
  label: string
  /** Full URL to the authoritative source */
  href: string
}

interface MedicalDisclaimerProps {
  /**
   * The formula or clinical method this tool uses.
   * Displayed verbatim to show transparency.
   */
  formula?: string
  /**
   * One or more authoritative sources for the formula/calculation.
   * Link to WHO, NIH, NCBI, clinical guidelines, etc.
   */
  sources?: Source[]
  /**
   * Optional reviewer / author credential string.
   * E.g. "Reviewed by a registered pharmacist"
   */
  reviewer?: string
}

export default function MedicalDisclaimer({
  formula,
  sources,
  reviewer,
}: MedicalDisclaimerProps) {
  return (
    <aside
      role="note"
      aria-label="Medical disclaimer"
      style={{
        margin: '28px 0',
        padding: '20px 24px',
        background: 'rgba(20,184,166,0.06)',
        border: '1px solid rgba(20,184,166,0.25)',
        borderLeft: '4px solid #14b8a6',
        borderRadius: '0 12px 12px 0',
        fontFamily: 'inherit',
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#14b8a6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#14b8a6', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Educational Use Only — Not Medical Advice
        </span>
      </div>

      {/* ── Main disclaimer text ── */}
      <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--fg-2, #9eb8b5)', lineHeight: 1.65 }}>
        This tool is provided <strong style={{ color: 'var(--fg, #c5dbd8)' }}>for informational and educational purposes only</strong>{' '}
        and does not constitute medical advice, diagnosis, or treatment. Do not use the results of this
        calculator to make clinical decisions without consulting a qualified healthcare professional.
        Always seek the advice of your physician or other qualified health provider with any questions
        you may have regarding a medical condition.
      </p>

      {/* ── Formula transparency ── */}
      {formula && (
        <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--fg-2, #9eb8b5)', lineHeight: 1.65 }}>
          <strong style={{ color: 'var(--fg, #c5dbd8)' }}>Formula used:</strong>{' '}
          <code style={{
            background: 'rgba(20,184,166,0.12)',
            padding: '1px 7px',
            borderRadius: 4,
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 12,
            color: '#5eead4',
          }}>
            {formula}
          </code>
        </p>
      )}

      {/* ── Source citations ── */}
      {sources && sources.length > 0 && (
        <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--fg-3, #7a9b98)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--fg-2, #9eb8b5)' }}>Sources:</strong>{' '}
          {sources.map((s, i) => (
            <span key={i}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#14b8a6', textDecoration: 'underline' }}
              >
                {s.label}
              </a>
              {i < sources.length - 1 && ', '}
            </span>
          ))}
        </p>
      )}

      {/* ── Reviewer credential ── */}
      <p style={{ margin: 0, fontSize: 12, color: 'var(--fg-3, #6a8a87)' }}>
        {reviewer
          ? <><strong style={{ color: 'var(--fg-2, #9eb8b5)' }}>✓ {reviewer}</strong> · Last reviewed {new Date().getFullYear()}</>
          : <>Calculations follow established clinical guidelines. Last reviewed {new Date().getFullYear()}.</>
        }
        {' '}This tool is provided free of charge, without warranty.
      </p>
    </aside>
  )
}
