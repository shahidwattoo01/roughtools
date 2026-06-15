export const dynamic = 'force-dynamic'

/**
 * DNS Lookup API Route — proxies to Google DNS-over-HTTPS
 * Supports: A, AAAA, MX, NS, TXT, CNAME, SOA, PTR, SRV, CAA
 */

import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const DNS_TYPE_NUMS: Record<string, number> = {
  A: 1, NS: 2, CNAME: 5, SOA: 6, PTR: 12, MX: 15,
  TXT: 16, AAAA: 28, SRV: 33, CAA: 257,
}

const DNS_TYPE_NAMES: Record<number, string> = Object.fromEntries(
  Object.entries(DNS_TYPE_NUMS).map(([k, v]) => [v, k])
)

const DNS_STATUS: Record<number, string> = {
  0: 'NOERROR',
  1: 'FORMERR',
  2: 'SERVFAIL',
  3: 'NXDOMAIN',
  4: 'NOTIMP',
  5: 'REFUSED',
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  const { allowed } = rateLimit(`dns:${ip}`, 200, 60_000)
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded. Try again shortly.' }, { status: 429 })

  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')?.trim().replace(/^https?:\/\//, '').split('/')[0] ?? ''
  const type = (searchParams.get('type') ?? 'A').toUpperCase()

  if (!name) return NextResponse.json({ error: 'Missing name parameter.' }, { status: 400 })
  const typeNum = DNS_TYPE_NUMS[type]
  if (!typeNum) return NextResponse.json({ error: `Unknown DNS record type: ${type}` }, { status: 400 })

  try {
    const res = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${typeNum}`,
      {
        headers: { Accept: 'application/dns-json' },
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) throw new Error(`DNS resolver returned HTTP ${res.status}`)
    const data = await res.json() as {
      Status: number
      TC?: boolean
      RD?: boolean
      RA?: boolean
      AD?: boolean
      Question?: { name: string; type: number }[]
      Answer?: { name: string; type: number; TTL: number; data: string }[]
      Authority?: { name: string; type: number; TTL: number; data: string }[]
      Comment?: string
    }

    const mapRecord = (r: { name: string; type: number; TTL: number; data: string }) => ({
      name: r.name.replace(/\.$/, ''),
      type: DNS_TYPE_NAMES[r.type] ?? String(r.type),
      typeNum: r.type,
      ttl: r.TTL,
      data: r.data.replace(/\.$/, ''),
    })

    return NextResponse.json({
      status: data.Status,
      statusText: DNS_STATUS[data.Status] ?? 'UNKNOWN',
      authenticated: data.AD ?? false,
      name,
      type,
      answer: (data.Answer ?? []).map(mapRecord),
      authority: (data.Authority ?? []).map(mapRecord),
      comment: data.Comment ?? null,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: `DNS lookup failed: ${msg}` }, { status: 502 })
  }
}
