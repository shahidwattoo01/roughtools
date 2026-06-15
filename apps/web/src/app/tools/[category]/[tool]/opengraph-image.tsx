import { ImageResponse } from 'next/og'
import { getToolBySlug } from '@/lib/tools-registry'
import { OG_CATEGORY_GRADIENTS, OG_CATEGORY_EMOJIS } from '@/lib/og-utils'

export const runtime = 'edge'
export const alt = 'Tool — RoughTools'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: { category: string; tool: string }
}) {
  const tool = getToolBySlug(params.tool)
  const category = params.category

  const gradient = OG_CATEGORY_GRADIENTS[category as keyof typeof OG_CATEGORY_GRADIENTS] || {
    from: '#6366f1',
    to: '#8b5cf6',
  }
  const emoji = OG_CATEGORY_EMOJIS[category as keyof typeof OG_CATEGORY_EMOJIS] || '🛠️'
  const toolName = tool?.name || params.tool.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const description = tool?.description || 'Free online tool'

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 72px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Subtle background dots */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Top: brand name + FREE badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
              }}
            >
              🛠️
            </div>
            <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--fg)' }}>
              RoughTools
            </span>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.25)',
              border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: '100px',
              padding: '6px 20px',
              fontSize: '18px',
              fontWeight: 700,
              color: 'white',
            }}
          >
            FREE TOOL
          </div>
        </div>

        {/* Tool name + emoji */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px', zIndex: 1 }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '56px',
              flexShrink: 0,
              backdropFilter: 'blur(10px)',
            }}
          >
            {emoji}
          </div>

          <h1
            style={{
              fontSize: toolName.length > 25 ? '48px' : '58px',
              fontWeight: 900,
              color: 'white',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
            }}
          >
            {toolName}
          </h1>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: '26px',
            color: 'var(--fg-1)',
            margin: '0 0 auto',
            lineHeight: 1.4,
            maxWidth: '820px',
            zIndex: 1,
          }}
        >
          {description}
        </p>

        {/* Bottom badges */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '40px', zIndex: 1 }}>
          {['No signup required', 'Instant results', '20 uses/day free'].map((text) => (
            <div
              key={text}
              style={{
                background: 'rgba(255,255,255,0.18)',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '18px',
                color: 'var(--fg)',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              ✓ {text}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}