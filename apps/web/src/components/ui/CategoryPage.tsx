'use client'
import Link from 'next/link'
import ToolAdUnit from '@/components/ToolAdUnit'

interface Tool {
  name: string
  description: string
  icon: string
  href: string
  priority?: 'Critical' | 'High' | 'Medium'
  badge?: string
  mono?: string
}

interface CategoryPageProps {
  title: string
  description: string
  icon: string
  backHref?: string
  backLabel?: string
  tools: Tool[]
  accentColor?: string
}

export default function CategoryPage({
  title,
  description,
  icon,
  backHref = '/tools',
  backLabel = 'All Tools',
  tools,
  accentColor = 'var(--accent)',
}: CategoryPageProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>

      {/* Page header */}
      <div style={{
        padding: '48px 60px 40px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg1)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: accentColor,
          filter: 'blur(80px)', opacity: 0.06, pointerEvents: 'none',
        }} />

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 20, fontSize: 13, color: 'var(--gray)',
        }}>
          <Link href="/" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Home</Link>
          <span>â€º</span>
          <Link href={backHref} style={{ color: 'var(--gray)', textDecoration: 'none' }}>{backLabel}</Link>
          <span>â€º</span>
          <span style={{ color: 'var(--white)' }}>{title}</span>
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: `${accentColor}20`,
            border: `1px solid ${accentColor}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, flexShrink: 0,
          }}>
            {icon}
          </div>
          <div>
            <h1 style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 900, color: 'var(--white)',
              letterSpacing: -2, lineHeight: 0.95, margin: 0,
            }}>
              {title}
            </h1>
            <p style={{
              fontSize: 15, color: 'var(--text2)', marginTop: 10,
              lineHeight: 1.6, maxWidth: 500,
            }}>
              {description}
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'flex', gap: 24, marginTop: 28, alignItems: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${accentColor}15`, border: `1px solid ${accentColor}30`,
            borderRadius: 100, padding: '5px 14px',
            fontSize: 12, fontWeight: 700, color: accentColor,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: accentColor, display: 'block',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            {tools.length} free tools
          </div>
          <span style={{ fontSize: 13, color: 'var(--gray)' }}>No signup required</span>
          <span style={{ fontSize: 13, color: 'var(--gray)' }}>Updated 2026</span>
        </div>
      </div>

      {/* Ad — between header and grid */}
      <div style={{ padding: '24px 60px 0' }}>
        <ToolAdUnit position="top" />
      </div>

      {/* Tool grid */}
      <div style={{ padding: '24px 60px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}>
          {tools.map((tool, i) => (
            <ToolCard key={i} tool={tool} accentColor={accentColor} />
          ))}
        </div>

        {/* Ad — below grid */}
        <div style={{ marginTop: 40 }}>
          <ToolAdUnit position="bottom" />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

function ToolCard({ tool, accentColor }: { tool: Tool; accentColor: string }) {
  const priorityColors: Record<string, string> = {
    Critical: 'var(--accent)',
    High: 'var(--text2)',
    Medium: 'var(--gray2)',
  }

  return (
    <Link
      href={tool.href}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          background: 'var(--bg2)',
          border: `1px solid var(--border)`,
          borderRadius: 18,
          padding: 24,
          cursor: 'pointer',
          display: 'flex', flexDirection: 'column',
          transition: 'all 0.2s',
          height: '100%',
          position: 'relative', overflow: 'hidden',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--bg3)'
          el.style.borderColor = 'var(--border2)'
          el.style.transform = 'translateY(-3px)'
          el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--bg2)'
          el.style.borderColor = 'var(--border)'
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
          }}>
            {tool.icon}
          </div>
          {tool.priority && (
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 1.5,
              textTransform: 'uppercase', padding: '4px 8px', borderRadius: 100,
              background: `${priorityColors[tool.priority]}20`,
              color: priorityColors[tool.priority],
              border: `1px solid ${priorityColors[tool.priority]}30`,
            }}>
              {tool.priority}
            </span>
          )}
        </div>

        {/* Name */}
        <div style={{
          fontSize: 16, fontWeight: 800, color: 'var(--white)',
          marginBottom: 6, lineHeight: 1.2,
        }}>
          {tool.name}
        </div>

        {/* Description */}
        <div style={{
          fontSize: 13, color: 'var(--gray)', lineHeight: 1.65, flex: 1,
        }}>
          {tool.description}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 16, paddingTop: 14,
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'monospace', fontSize: 11,
            color: accentColor,
          }}>
            {tool.mono || 'Free'}
          </span>
          <span style={{ fontSize: 16, color: 'var(--gray2)', transition: 'transform 0.2s' }}>
            â†—
          </span>
        </div>
      </div>
    </Link>
  )
}

