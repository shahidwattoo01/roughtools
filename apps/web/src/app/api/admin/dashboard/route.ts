export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '../../iq/admin/_lib/require-admin'
import { prisma } from '../../iq/_lib/db'

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday  = new Date(startOfDay.getTime() - 86_400_000)
  const thirtyAgo  = new Date(now.getTime() - 30 * 86_400_000)

  // ── IQ session stats (real data) ──────────────────────────────────────────
  const [
    iqSessionsToday,
    iqSessionsYesterday,
    iqCompletedTotal,
    iqValidTotal,
    iqAvgScore,
    recentSessions,
  ] = await Promise.all([
    prisma.iqSession.count({ where: { startedAt: { gte: startOfDay } } }),
    prisma.iqSession.count({ where: { startedAt: { gte: yesterday, lt: startOfDay } } }),
    prisma.iqSession.count({ where: { status: 'COMPLETED' } }),
    prisma.iqSession.count({ where: { status: 'COMPLETED', isValid: true } }),
    prisma.iqSession.aggregate({
      where: { status: 'COMPLETED', isValid: true, iqScore: { not: null } },
      _avg: { iqScore: true },
    }),
    prisma.iqSession.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      take: 10,
      select: {
        id: true, iqScore: true, percentile: true, isValid: true,
        ageGroup: true, completedAt: true,
      },
    }),
  ])

  // ── 30-day IQ sessions chart ───────────────────────────────────────────────
  const dailySessions = await prisma.iqSession.groupBy({
    by: ['startedAt'],
    where: { startedAt: { gte: thirtyAgo } },
    _count: true,
  })

  // Bucket by date
  const sessionsByDay: Record<string, number> = {}
  for (const row of dailySessions) {
    const day = row.startedAt.toISOString().slice(0, 10)
    sessionsByDay[day] = (sessionsByDay[day] ?? 0) + row._count
  }
  const thirtyDayChart = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(thirtyAgo.getTime() + i * 86_400_000)
    const key = d.toISOString().slice(0, 10)
    return { date: key, sessions: sessionsByDay[key] ?? 0 }
  })

  // ── User stats ─────────────────────────────────────────────────────────────
  const [totalUsers, usersToday] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
  ])

  // ── DB health (basic) ──────────────────────────────────────────────────────
  const dbStart = Date.now()
  await prisma.$queryRaw`SELECT 1`
  const dbLatencyMs = Date.now() - dbStart

  return NextResponse.json({
    vitals: {
      iqSessionsToday,
      iqSessionsYesterday,
      iqSessionsChange: iqSessionsYesterday > 0
        ? Math.round(((iqSessionsToday - iqSessionsYesterday) / iqSessionsYesterday) * 100)
        : null,
      iqCompletedTotal,
      iqValidTotal,
      iqAvgScore: iqAvgScore._avg.iqScore ? Math.round(iqAvgScore._avg.iqScore) : null,
      totalUsers,
      usersToday,
      dbLatencyMs,
    },
    thirtyDayChart,
    recentSessions,
    // Placeholders for GA4 / AdSense (requires OAuth setup)
    ga4: null,
    adsense: null,
  })
}
