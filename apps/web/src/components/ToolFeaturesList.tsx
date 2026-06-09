/**
 * ToolFeaturesList.tsx
 * Rule B-6 — Features list (4–8 specific, accurate features).
 * Server component — no interactivity needed.
 */

interface ToolFeaturesListProps {
  features: string[]
  title?: string
}

export function ToolFeaturesList({ features, title = 'Features' }: ToolFeaturesListProps) {
  if (!features.length) return null
  return (
    <section
      aria-labelledby="features-heading"
      style={{
        marginTop: 32,
        padding: '24px 28px',
        background: 'var(--bg-2)',
        borderRadius: 14,
        border: '1px solid var(--line)',
      }}
    >
      <h2
        id="features-heading"
        style={{ fontSize: 16, fontWeight: 800, color: 'var(--fg)', marginBottom: 14, marginTop: 0 }}
      >
        {title}
      </h2>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '8px 16px',
        }}
      >
        {features.map((f, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              fontSize: 13,
              color: 'var(--fg-2)',
              lineHeight: 1.5,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                flexShrink: 0,
                marginTop: 2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'rgba(91,108,255,0.15)',
                border: '1px solid rgba(91,108,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                color: 'var(--brand)',
              }}
            >
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
    </section>
  )
}
