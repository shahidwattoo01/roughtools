export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../_lib/db'
import { requireAdmin } from '../_lib/require-admin'
import { enqueueIqNormingRecalculate } from '@toolverse/queue'

// GET /api/iq/admin/norming — current norming snapshots + session stats
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const [snapshots, totalValid, totalCompleted, validityRate, avgIq] = await Promise.all([
    prisma.iqNormingSnapshot.findMany({
      where: { isActive: true },
      orderBy: { ageGroup: 'asc' },
      select: {
        id: true, version: true, ageGroup: true,
        sampleSize: true, meanRaw: true, stdDevRaw: true, createdAt: true,
      },
    }),
    prisma.iqSession.count({ where: { status: 'COMPLETED', isValid: true } }),
    prisma.iqSession.count({ where: { status: 'COMPLETED' } }),
    prisma.iqSession.count({ where: { status: 'COMPLETED', isValid: true } })
      .then(valid => prisma.iqSession.count({ where: { status: 'COMPLETED' } })
        .then(total => total > 0 ? valid / total : 0)),
    prisma.iqSession.aggregate({
      where: { status: 'COMPLETED', isValid: true, iqScore: { not: null } },
      _avg: { iqScore: true },
    }).then(r => r._avg.iqScore),
  ])

  return NextResponse.json({
    snapshots,
    stats: {
      totalValid,
      totalCompleted,
      validityRate: Math.round(validityRate * 100),
      avgIq: avgIq ? Math.round(avgIq) : null,
      completionRate: null, // would need session start count
    },
  })
}

// POST /api/iq/admin/norming/recalculate — manually trigger norming job
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  await enqueueIqNormingRecalculate('manual-admin-trigger')
  return NextResponse.json({ queued: true })
}
