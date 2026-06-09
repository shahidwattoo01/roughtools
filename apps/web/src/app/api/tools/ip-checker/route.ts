export const dynamic = 'force-dynamic'

/**
 * IP Checker / VPN Checker API Route
 * Returns the caller's public IP address and geo-location data.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getClientIp } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)

  try {
    // Use ipapi.co for free geo-lookup (no API key needed, 30k req/month free)
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'RoughTools/1.0 (https://roughtools.com)' },
      signal: AbortSignal.timeout(5000),
    })

    if (!geoRes.ok) throw new Error('Geo lookup failed')

    const geo = await geoRes.json() as {
      ip?: string
      city?: string
      region?: string
      country_name?: string
      country_code?: string
      org?: string
      timezone?: string
      latitude?: number
      longitude?: number
      error?: boolean
    }

    if (geo.error) throw new Error('Geo lookup returned error')

    return NextResponse.json({
      ip: geo.ip ?? ip,
      city: geo.city ?? null,
      region: geo.region ?? null,
      country: geo.country_name ?? null,
      countryCode: geo.country_code ?? null,
      org: geo.org ?? null,
      timezone: geo.timezone ?? null,
      lat: geo.latitude ?? null,
      lon: geo.longitude ?? null,
      // VPN detection is best-effort without a paid service
      isVpn: null,
      isProxy: null,
    })
  } catch {
    // Fallback: return just the IP
    return NextResponse.json({
      ip,
      city: null, region: null, country: null, countryCode: null,
      org: null, timezone: null, lat: null, lon: null,
      isVpn: null, isProxy: null,
    })
  }
}
