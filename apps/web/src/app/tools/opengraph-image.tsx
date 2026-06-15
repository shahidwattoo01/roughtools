import { ImageResponse } from 'next/og'
import { getToolBySlug } from '@/lib/tools-registry'
import { SEO_CONFIG } from '@/lib/seo-config'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  pdf: ['#ef4444', '#dc2626'],
  calculators: ['#3b82f6', '#2563eb'],
  developer: ['#8b5cf6', '#7c3aed'],
  text: ['#10b981', '#059669'],
  converters: ['#f97316', '#ea580c'],
  network: ['#06b6d4', '#0891b2'],
  'legal-tools': ['#64748b', '#475569'],
  'real-estate': ['#f59e0b', '#d97706'],
}

const CATEGORY_EMOJIS: Record<string, string> = {
  pdf: '📄',
  calculators: '🧮',
  developer: '💻',
  text: '✏️',
  converters: '🔄',
  network: '🌐',
  'legal-tools': '⚖️',
  'real-estate': '🏠',
}

interface Params {
  params: { category: string; tool: string }
}

export default async function Image({ params }: Params) {
  const tool = getToolBySlug(params.tool)
  const category = params.category

  const [gradStart, gradEnd] = CATEGORY_GRADIENTS[category] || ['#6366f1', '#8b5cf6']
  const emoji = CATEGORY_EMOJIS[category] || '🛠️'
  const toolName = tool?.name || params.tool.replace(/-/g, ' ')
  const description = tool?.description || 'Free online tool'

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${gradStart} 0%, ${gradEnd} 100%)`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 72px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Top bar: site name + free badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '48px',
          }}
        >
          <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--fg)' }}>
            🛠️ {SEO_CONFIG.siteName}
          </span>
          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '100px',
              padding: '8px 24px',
              fontSize: '22px',
              fontWeight: '700',
              color: 'white',
            }}
          >
            FREE
          </div>
        </div>

        {/* Tool icon + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '28px' }}>
          <div
            style={{
              width: '96px',
              height: '96px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '52px',
              flexShrink: 0,
            }}
          >
            {emoji}
          </div>
          <h1
            style={{
              fontSize: '60px',
              fontWeight: '900',
              color: 'white',
              margin: 0,
              lineHeight: '1.1',
              letterSpacing: '-2px',
            }}
          >
            {toolName}
          </h1>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: '28px',
            color: 'var(--fg)',
            margin: '0 0 auto',
            lineHeight: '1.4',
            maxWidth: '900px',
          }}
        >
          {description}
        </p>

        {/* Bottom: features */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
          {['No signup required', 'Instant results', 'Privacy friendly'].map((f) => (
            <div
              key={f}
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '20px',
                color: 'white',
                fontWeight: '600',
              }}
            >
              ✓ {f}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}