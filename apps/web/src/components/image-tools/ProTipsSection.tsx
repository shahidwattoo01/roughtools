interface ProTipsSectionProps {
  toolName: string
  tips: string[]
}

export default function ProTipsSection({ toolName, tips }: ProTipsSectionProps) {
  if (!tips || tips.length === 0) return null
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg)', marginBottom: 20 }}>
        Pro Tips for {toolName}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tips.map((tip, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              padding: '14px 18px',
              background: 'rgba(236,72,153,0.05)',
              border: '1px solid rgba(236,72,153,0.18)',
              borderRadius: 12,
            }}
          >
            <span style={{
              flexShrink: 0,
              fontSize: 14,
              fontWeight: 800,
              color: '#ec4899',
              background: 'rgba(236,72,153,0.12)',
              borderRadius: 8,
              padding: '2px 8px',
              marginTop: 1,
            }}>
              {i + 1}
            </span>
            <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.65, margin: 0 }}>
              {tip}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
