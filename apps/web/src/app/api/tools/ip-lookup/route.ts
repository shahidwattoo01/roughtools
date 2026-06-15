export const dynamic = 'force-dynamic'

/**
 * IP Geolocation Lookup API Route
 * Accepts an optional ?ip= query param.
 * If omitted, looks up the caller's own public IP.
 * Uses ipapi.co (30k free requests/month, no key needed).
 */

import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request)
  const { allowed } = rateLimit(`ip-lookup:${clientIp}`, 200, 60_000)
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded. Try again shortly.' }, { status: 429 })

  const { searchParams } = new URL(request.url)
  const targetIp = searchParams.get('ip')?.trim() || clientIp

  // Basic format validation
  const isValidIp =
    /^\d{1,3}(\.\d{1,3}){3}$/.test(targetIp) ||      // IPv4
    /^[0-9a-f:]{2,39}$/i.test(targetIp)               // IPv6 (simplified)

  if (!isValidIp) {
    return NextResponse.json({ error: 'Invalid IP address format.' }, { status: 400 })
  }

  try {
    const geoRes = await fetch(`https://ipapi.co/${targetIp}/json/`, {
      headers: { 'User-Agent': 'RoughTools/1.0 (https://roughtools.com)' },
      signal: AbortSignal.timeout(6000),
    })

    if (!geoRes.ok) throw new Error(`ipapi.co returned HTTP ${geoRes.status}`)

    const geo = await geoRes.json() as {
      ip?: string; city?: string; region?: string; region_code?: string
      country_name?: string; country_code?: string; org?: string; asn?: string
      timezone?: string; latitude?: number; longitude?: number
      postal?: string; currency?: string; country_calling_code?: string
      languages?: string; error?: boolean; reason?: string
    }

    if (geo.error) {
      throw new Error(geo.reason ?? 'Invalid IP or rate limited by geo provider')
    }

    return NextResponse.json({
      ip: geo.ip ?? targetIp,
      city: geo.city ?? null,
      region: geo.region ?? null,
      regionCode: geo.region_code ?? null,
      country: geo.country_name ?? null,
      countryCode: geo.country_code ?? null,
      org: geo.org ?? null,
      asn: geo.asn ?? null,
      timezone: geo.timezone ?? null,
      lat: geo.latitude ?? null,
      lon: geo.longitude ?? null,
      postal: geo.postal ?? null,
      currency: geo.currency ?? null,
      callingCode: geo.country_calling_code ?? null,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: `IP lookup failed: ${msg}` }, { status: 502 })
  }
}
