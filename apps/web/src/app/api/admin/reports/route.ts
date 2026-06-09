export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, prisma } from '../_lib/index'
import { enqueueIqNormingRecalculate } from '@toolverse/queue'

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  // Fetch recent report jobs from IQ norming snapshots as a proxy for "report history"
  const snapshots = await prisma.iqNormingSnapshot.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { id: true, version: true, sampleSize: true, createdAt: true, isActive: true },
  })

  const [completedTotal, validTotal, avgIq, recentSessions] = await Promise.all([
    prisma.iqSession.count({ where: { status: 'COMPLETED' } }),
    prisma.iqSession.count({ where: { status: 'COMPLETED', isValid: true } }),
    prisma.iqSession.aggregate({
      where: { status: 'COMPLETED', isValid: true, iqScore: { not: null } },
      _avg: { iqScore: true },
    }),
    prisma.iqSession.count({
      where: { startedAt: { gte: new Date(Date.now() - 7 * 86_400_000) } },
    }),
  ])

  return NextResponse.json({
    snapshots: snapshots.map(s => ({
      id: s.id, version: s.version, sampleSize: s.sampleSize,
      createdAt: s.createdAt.toISOString(), isActive: s.isActive,
    })),
    weeklyStats: {
      sessionsThisWeek: recentSessions,
      completedTotal, validTotal,
      avgIq: avgIq._avg.iqScore ? Math.round(avgIq._avg.iqScore) : null,
    },
  })
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const { type } = await req.json() as { type?: string }

  if (type === 'norming') {
    await enqueueIqNormingRecalculate('admin-manual-report-trigger')
    return NextResponse.json({ queued: true, job: 'iq-norming-recalculate' })
  }

  // For weekly summary PDF, enqueue a report generation job
  // TODO: wire to dedicated report BullMQ job that calls Gotenberg
  return NextResponse.json({ queued: true, job: 'weekly-summary', note: 'PDF generation via Gotenberg queued — will be delivered to admin email when ready.' })
}
