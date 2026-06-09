export const dynamic = 'force-dynamic'

/**
 * HTTP Headers Checker API Route
 * Fetches a URL server-side and returns all response headers.
 * Unlike a CORS proxy, this returns the REAL headers (including security headers).
 */

import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const PRIVATE_HOST = /^(localhost|\.local$|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i

function isPrivateUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return PRIVATE_HOST.test(hostname)
  } catch {
    return true
  }
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  const { allowed } = rateLimit(`headers:${ip}`, 15, 60_000)
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded. Try again shortly.' }, { status: 429 })

  const { searchParams } = new URL(request.url)
  let url = searchParams.get('url')?.trim() ?? ''
  if (!url) return NextResponse.json({ error: 'Missing url parameter.' }, { status: 400 })
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url

  if (isPrivateUrl(url)) {
    return NextResponse.json({ error: 'Private and local URLs are not allowed.' }, { status: 400 })
  }

  try {
    const t0 = Date.now()
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RoughTools-HeaderChecker/1.0; +https://roughtools.com)',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })

    const responseTime = Date.now() - t0
    const headers: Record<string, string> = {}
    res.headers.forEach((value, key) => {
      // Skip internal Next.js / node-fetch headers
      if (!key.startsWith('x-vercel') && key !== 'x-middleware-cache') {
        headers[key.toLowerCase()] = value
      }
    })

    return NextResponse.json({
      url: res.url,
      statusCode: res.status,
      statusText: res.statusText,
      responseTime,
      headers,
      redirected: res.redirected,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: `Could not reach URL: ${msg}` }, { status: 502 })
  }
}
