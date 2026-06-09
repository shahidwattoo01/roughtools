/**
 * ToolPrivacyNotice.tsx
 * Rule B-9 — Data privacy notice required when tool processes user input.
 * States clearly that input is processed client-side and never transmitted.
 */

interface ToolPrivacyNoticeProps {
  serverSide?: boolean
}

export function ToolPrivacyNotice({ serverSide = false }: ToolPrivacyNoticeProps) {
  return (
    <div
      role="note"
      aria-label="Data privacy notice"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        margin: '20px 0',
        padding: '12px 16px',
        background: 'rgba(16,185,129,0.06)',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 10,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ flexShrink: 0, marginTop: 1 }}
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <p style={{ margin: 0, fontSize: 12, color: '#10b981', lineHeight: 1.6 }}>
        {serverSide
          ? <>Your input is sent to our server for processing and is <strong>deleted immediately</strong> after your result is returned — it is never stored or shared. See our <a href="/privacy-policy" style={{ color: '#10b981', textDecoration: 'underline' }}>Privacy Policy</a>.</>
          : <>Your input is processed <strong>locally in your browser</strong> and is never stored, transmitted, or shared with any server. See our <a href="/privacy-policy" style={{ color: '#10b981', textDecoration: 'underline' }}>Privacy Policy</a>.</>
        }
      </p>
    </div>
  )
}
