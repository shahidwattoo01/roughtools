/**
 * ToolDisclaimer.tsx
 * Rule B-8 — Disclaimer required on every tool page.
 * Type determines the specific language shown.
 * Uses Tailwind dark: variants so it reads clearly in both light and dark themes.
 */

export type DisclaimerType = 'general' | 'financial' | 'legal' | 'medical'

interface ToolDisclaimerProps {
  type?: DisclaimerType
  toolName?: string
}

const DISCLAIMER_CONTENT: Record<DisclaimerType, { icon: string; label: string; color: string; border: string; bg: string; text: string }> = {
  general: {
    icon: 'ℹ️',
    label: 'Disclaimer',
    color: '#3b82f6',
    border: 'rgba(59,130,246,0.35)',
    bg: 'rgba(59,130,246,0.06)',
    text: 'Results produced by this tool are estimates or approximations and should not be used as a substitute for professional judgement. The site owner is not liable for any decisions made based on this tool\'s output. Always verify important results independently before acting on them.',
  },
  financial: {
    icon: '💰',
    label: 'Financial Disclaimer',
    color: '#f59e0b',
    border: 'rgba(245,158,11,0.35)',
    bg: 'rgba(245,158,11,0.06)',
    text: 'Results are estimates only and do not constitute financial, tax, investment, or legal advice. Figures should not be relied upon for financial decision-making without consulting a qualified financial adviser, accountant, or other licensed professional. Actual results will vary based on your individual circumstances.',
  },
  legal: {
    icon: '⚖️',
    label: 'Legal Disclaimer',
    color: '#facc15',
    border: 'rgba(250,204,21,0.35)',
    bg: 'rgba(250,204,21,0.06)',
    text: 'The output of this tool does not constitute legal advice and should not be treated as such. You should not rely on this tool as a substitute for advice from a qualified solicitor, barrister, or attorney licensed in your jurisdiction. Always seek professional legal counsel before acting on any legal document or decision.',
  },
  medical: {
    icon: '🏥',
    label: 'Medical Disclaimer',
    color: '#14b8a6',
    border: 'rgba(20,184,166,0.35)',
    bg: 'rgba(20,184,166,0.06)',
    text: 'This tool is provided for informational and educational purposes only. It does not constitute medical advice, diagnosis, or treatment. Do not make clinical or health decisions based solely on this tool\'s output. Always consult a qualified healthcare professional — your doctor, nurse practitioner, or other licensed clinician — before making decisions about your health.',
  },
}

export function ToolDisclaimer({ type = 'general', toolName }: ToolDisclaimerProps) {
  const d = DISCLAIMER_CONTENT[type]
  return (
    <aside
      role="note"
      aria-label={d.label}
      style={{
        margin: '32px 0',
        padding: '18px 22px',
        background: d.bg,
        border: `1px solid ${d.border}`,
        borderLeft: `4px solid ${d.color}`,
        borderRadius: '0 12px 12px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span aria-hidden="true" style={{ fontSize: 16 }}>{d.icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: d.color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {d.label}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: 'inherit', opacity: 0.85 }}>
        {toolName && <><strong>{toolName}</strong> — </>}{d.text}
      </p>
    </aside>
  )
}
