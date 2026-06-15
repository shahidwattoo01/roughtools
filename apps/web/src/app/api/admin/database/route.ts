export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, prisma } from '../_lib/index'
import { Redis } from 'ioredis'

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action') ?? 'overview'

  if (action === 'overview') {
    const [tableStats, dbSize, connectionInfo] = await Promise.all([
      prisma.$queryRaw<{ table_name: string; row_estimate: bigint; total_size: string; index_size: string; last_vacuum: Date | null }[]>`
        SELECT
          relname           AS table_name,
          n_live_tup        AS row_estimate,
          pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
          pg_size_pretty(pg_indexes_size(relid))        AS index_size,
          last_vacuum
        FROM pg_stat_user_tables
        ORDER BY pg_total_relation_size(relid) DESC
        LIMIT 20
      `,
      prisma.$queryRaw<{ db_size: string }[]>`
        SELECT pg_size_pretty(pg_database_size(current_database())) AS db_size
      `,
      prisma.$queryRaw<{ numbackends: number; max_conn: number }[]>`
        SELECT
          (SELECT count(*) FROM pg_stat_activity) AS numbackends,
          (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') AS max_conn
      `,
    ])

    return NextResponse.json({
      dbSize: (dbSize as { db_size: string }[])[0]?.db_size ?? 'unknown',
      connections: (connectionInfo as { numbackends: number; max_conn: number }[])[0] ?? { numbackends: 0, max_conn: 100 },
      tables: (tableStats as { table_name: string; row_estimate: bigint; total_size: string; index_size: string; last_vacuum: Date | null }[]).map(t => ({
        name: t.table_name,
        rows: Number(t.row_estimate),
        totalSize: t.total_size,
        indexSize: t.index_size,
        lastVacuum: t.last_vacuum?.toISOString() ?? null,
      })),
    })
  }

  if (action === 'redis') {
    if (!process.env.REDIS_URL) {
      return NextResponse.json({ connected: false, error: 'REDIS_URL is not configured' })
    }
    try {
      const redis = new Redis(process.env.REDIS_URL, { lazyConnect: true, connectTimeout: 3000 })
      await redis.connect()
      const [info, dbsize] = await Promise.all([redis.info('memory'), redis.dbsize()])
      await redis.quit()

      const memMatch = info.match(/used_memory_human:(.+)/)
      const peakMatch = info.match(/used_memory_peak_human:(.+)/)

      // Scan key prefixes
      const prefixes = ['iq:session', 'iq:norms', 'iq:qbank', 'iq:percentiles', 'tool:', 'cache:']
      const counts: Record<string, number> = {}
      const redis2 = new Redis(process.env.REDIS_URL, { lazyConnect: true, connectTimeout: 3000 })
      await redis2.connect()
      for (const prefix of prefixes) {
        let cursor = '0'
        let count = 0
        do {
          const [next, keys] = await redis2.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 100)
          cursor = next
          count += keys.length
        } while (cursor !== '0' && count < 500)
        counts[prefix] = count
      }
      await redis2.quit()

      return NextResponse.json({
        usedMemory:  memMatch?.[1]?.trim() ?? 'unknown',
        peakMemory:  peakMatch?.[1]?.trim() ?? 'unknown',
        totalKeys:   dbsize,
        prefixCounts: counts,
        connected: true,
      })
    } catch (e) {
      return NextResponse.json({ connected: false, error: (e as Error).message })
    }
  }

  return NextResponse.json({ message: 'Unknown action' }, { status: 400 })
}

// POST — safe query runner (SELECT only)
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const { sql } = await req.json() as { sql?: string }
  if (!sql?.trim()) return NextResponse.json({ message: 'sql required' }, { status: 400 })

  const normalized = sql.trim().toUpperCase()
  const forbidden = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE', 'GRANT', 'REVOKE']
  if (!normalized.startsWith('SELECT') && !normalized.startsWith('WITH')) {
    return NextResponse.json({ message: 'Only SELECT and WITH queries are allowed' }, { status: 403 })
  }
  for (const kw of forbidden) {
    if (normalized.includes(kw)) {
      return NextResponse.json({ message: `Forbidden keyword: ${kw}` }, { status: 403 })
    }
  }

  const start = Date.now()
  try {
    const rows = await prisma.$queryRawUnsafe(sql) as Record<string, unknown>[]
    const executionMs = Date.now() - start
    const safeRows = rows.map(r => {
      const out: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(r)) {
        out[k] = typeof v === 'bigint' ? Number(v) : v
      }
      return out
    })
    return NextResponse.json({
      rows: safeRows.slice(0, 500),
      rowCount: safeRows.length,
      executionMs,
      truncated: safeRows.length > 500,
    })
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 400 })
  }
}
