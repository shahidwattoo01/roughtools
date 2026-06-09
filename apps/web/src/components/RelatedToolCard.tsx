'use client'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  href: string
  icon: string
  name: string
  description: string
}

export default function RelatedToolCard({ href, icon, name, description }: Props) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px',
          background: hovered ? 'rgba(236,72,153,0.06)' : 'var(--bg-2, rgba(255,255,255,0.03))',
          border: `1px solid ${hovered ? 'rgba(236,72,153,0.35)' : 'var(--line, rgba(255,255,255,0.08))'}`,
          borderRadius: 12,
          transition: 'border-color 0.2s, background 0.2s',
        }}
      >
        <span style={{
          fontSize: 22, flexShrink: 0,
          background: 'rgba(236,72,153,0.12)',
          borderRadius: 8, padding: '6px 8px', lineHeight: 1,
        }}>{icon}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>{name}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 2 }}>{description}</div>
        </div>
      </div>
    </Link>
  )
}
