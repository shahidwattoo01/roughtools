export const dynamic = 'force-dynamic'

/**
 * WHOIS / RDAP Lookup API Route
 * Uses the RDAP protocol (RFC 7482) via rdap.org as an aggregator.
 * Supports domain names and IP addresses.
 */

import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request)
  const { allowed } = rateLimit(`whois:${clientIp}`, 200, 60_000)
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded. Try again shortly.' }, { status: 429 })

  const { searchParams } = new URL(request.url)
  let query = searchParams.get('query')?.trim() ?? ''
  if (!query) return NextResponse.json({ error: 'Missing query parameter.' }, { status: 400 })

  // Strip protocol and path
  query = query.replace(/^https?:\/\//, '').split('/')[0].toLowerCase().trim()

  if (!query) return NextResponse.json({ error: 'Invalid domain or IP.' }, { status: 400 })

  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(query) || /^[0-9a-f:]+$/i.test(query)
  const rdapUrl = isIp
    ? `https://rdap.org/ip/${encodeURIComponent(query)}`
    : `https://rdap.org/domain/${encodeURIComponent(query)}`

  try {
    const res = await fetch(rdapUrl, {
      headers: {
        Accept: 'application/rdap+json, application/json',
        'User-Agent': 'RoughTools/1.0 (https://roughtools.com)',
      },
      signal: AbortSignal.timeout(12000),
      redirect: 'follow',
    })

    const text = await res.text()

    if (!res.ok) {
      // Try to extract a meaningful error from RDAP error body
      try {
        const err = JSON.parse(text)
        const msg = err.title ?? err.description?.[0] ?? `RDAP error ${res.status}`
        return NextResponse.json({ error: msg }, { status: res.status >= 400 && res.status < 500 ? 404 : 502 })
      } catch {
        return NextResponse.json({ error: `RDAP lookup failed (HTTP ${res.status})` }, { status: 502 })
      }
    }

    return NextResponse.json(JSON.parse(text))
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: `WHOIS lookup failed: ${msg}` }, { status: 502 })
  }
}
