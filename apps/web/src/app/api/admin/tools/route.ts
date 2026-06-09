export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '../../iq/admin/_lib/require-admin'
import { ALL_TOOLS } from '@/lib/tools-registry'

// Tool status is stored in DB; if no row exists the tool is 'published'
// For now we return the registry with mock analytics — GA4 integration adds real data
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const { searchParams } = new URL(req.url)
  const q        = (searchParams.get('q') ?? '').toLowerCase()
  const category = searchParams.get('category') ?? ''
  const status   = searchParams.get('status') ?? ''

  let tools = ALL_TOOLS.map(t => ({
    slug:        t.slug,
    name:        t.name,
    category:    t.category,
    description: t.description,
    keywords:    t.keywords,
    featured:    t.featured ?? false,
    popular:     t.popular ?? false,
    isNew:       t.isNew ?? false,
    priority:    t.priority ?? 0.7,
    status:      'published' as const,  // TODO: load from DB tool_metadata table
    // Analytics placeholders — replaced with real GA4 data when configured
    monthlyPageviews:  Math.floor(Math.random() * 50_000),
    avgSessionSeconds: Math.floor(Math.random() * 180) + 30,
    bounceRate:        Math.floor(Math.random() * 40) + 40,
    adsenseRpm:        +(Math.random() * 4 + 0.5).toFixed(2),
    seoScore:          Math.floor(Math.random() * 40) + 60,
    indexStatus:       'indexed' as const,
    avgPosition:       +(Math.random() * 30 + 1).toFixed(1),
  }))

  if (q) {
    tools = tools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q),
    )
  }
  if (category) tools = tools.filter(t => t.category === category)
  if (status)   tools = tools.filter(t => t.status === status)

  return NextResponse.json({ total: tools.length, tools })
}
