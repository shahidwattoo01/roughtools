export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, mockTimeSeries } from '../_lib/index'
import { ALL_TOOLS } from '@/lib/tools-registry'

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const { searchParams } = new URL(req.url)
  const days = Math.min(365, Math.max(7, parseInt(searchParams.get('days') ?? '30')))

  // Generate plausible mock data (replace with GA4 Data API when OAuth is configured)
  const pageviews    = mockTimeSeries(days, 12_000, 0.4)
  const sessions     = pageviews.map(p => ({ ...p, value: Math.round(p.value * 0.72) }))
  const users        = pageviews.map(p => ({ ...p, value: Math.round(p.value * 0.58) }))

  const totalPageviews = pageviews.reduce((s, d) => s + d.value, 0)
  const totalSessions  = sessions.reduce((s, d) => s + d.value, 0)
  const totalUsers     = users.reduce((s, d) => s + d.value, 0)

  // Top tools by mock traffic
  const topTools = ALL_TOOLS
    .filter(t => t.popular)
    .slice(0, 10)
    .map((t, i) => ({
      name:      t.name,
      slug:      t.slug,
      category:  t.category,
      pageviews: Math.round(totalPageviews * (0.12 - i * 0.009)),
      change:    Math.round((Math.random() - 0.4) * 30),
      avgDuration: Math.round(Math.random() * 180 + 60),
    }))

  const channels = [
    { channel: 'Organic Search', sessions: Math.round(totalSessions * 0.62), bounce: 52, avgDuration: 134 },
    { channel: 'Direct',         sessions: Math.round(totalSessions * 0.19), bounce: 48, avgDuration: 112 },
    { channel: 'Referral',       sessions: Math.round(totalSessions * 0.11), bounce: 61, avgDuration: 98  },
    { channel: 'Social',         sessions: Math.round(totalSessions * 0.05), bounce: 70, avgDuration: 72  },
    { channel: 'Email',          sessions: Math.round(totalSessions * 0.02), bounce: 39, avgDuration: 188 },
    { channel: 'Paid',           sessions: Math.round(totalSessions * 0.01), bounce: 44, avgDuration: 105 },
  ]

  const countries = [
    { country: 'United States', sessions: Math.round(totalSessions * 0.38) },
    { country: 'India',         sessions: Math.round(totalSessions * 0.14) },
    { country: 'United Kingdom',sessions: Math.round(totalSessions * 0.08) },
    { country: 'Canada',        sessions: Math.round(totalSessions * 0.06) },
    { country: 'Australia',     sessions: Math.round(totalSessions * 0.04) },
    { country: 'Germany',       sessions: Math.round(totalSessions * 0.03) },
    { country: 'France',        sessions: Math.round(totalSessions * 0.03) },
    { country: 'Brazil',        sessions: Math.round(totalSessions * 0.03) },
    { country: 'Netherlands',   sessions: Math.round(totalSessions * 0.02) },
    { country: 'Other',         sessions: Math.round(totalSessions * 0.19) },
  ]

  // Search Console mock
  const queries = [
    'iq test online free', 'pdf to word', 'bmi calculator', 'compress pdf',
    'json formatter', 'background remover', 'password generator', 'word counter',
    'mortgage calculator', 'image compressor',
  ].map((q, i) => ({
    query:       q,
    impressions: Math.round(80_000 / (i + 1)),
    clicks:      Math.round(4_000 / (i + 1)),
    ctr:         +(3.5 + Math.random() * 3).toFixed(1),
    position:    +(1.2 + i * 1.4 + Math.random()).toFixed(1),
  }))

  return NextResponse.json({
    summary: {
      totalPageviews, totalSessions, totalUsers,
      avgBounceRate: 54,
      avgSessionDuration: 118,
      pagesPerSession: +(totalPageviews / totalSessions).toFixed(2),
      ga4Connected: false,
    },
    charts: { pageviews, sessions, users },
    topTools,
    channels,
    countries,
    queries,
    devices: [
      { device: 'Desktop', pct: 54 },
      { device: 'Mobile',  pct: 40 },
      { device: 'Tablet',  pct: 6  },
    ],
  })
}
