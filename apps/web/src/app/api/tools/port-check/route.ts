export const dynamic = 'force-dynamic'

/**
 * TCP Port Check API Route
 * Tests whether a specific TCP port is open on a remote host.
 * Uses Node.js net.Socket for a real TCP connection attempt.
 * Includes SSRF protection to block private / loopback ranges.
 */

import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import net from 'net'
import dns from 'dns/promises'

const PRIVATE_PATTERN = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|::1$|fc|fd)/i

function isPrivateHost(h: string): boolean {
  return PRIVATE_PATTERN.test(h) || h === 'localhost' || h.endsWith('.local')
}

function tcpProbe(
  host: string,
  port: number,
  timeoutMs = 5000,
): Promise<{ open: boolean; latencyMs: number | null; banner: string | null }> {
  return new Promise(resolve => {
    const t0 = Date.now()
    const socket = new net.Socket()
    let settled = false
    let banner = ''

    const settle = (open: boolean) => {
      if (settled) return
      settled = true
      socket.destroy()
      resolve({
        open,
        latencyMs: open ? Date.now() - t0 : null,
        banner: banner.slice(0, 256).trim() || null,
      })
    }

    socket.setTimeout(timeoutMs)
    socket.on('connect', () => {
      // Connected — wait briefly for a banner (SSH, FTP, SMTP etc.)
      setTimeout(() => settle(true), 300)
    })
    socket.on('data', (d) => { banner += d.toString('utf8', 0, 256) })
    socket.on('error', () => settle(false))
    socket.on('timeout', () => settle(false))

    try {
      socket.connect(port, host)
    } catch {
      settle(false)
    }
  })
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request)
  const { allowed } = rateLimit(`port:${clientIp}`, 20, 60_000)
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded. Try again shortly.' }, { status: 429 })

  const { searchParams } = new URL(request.url)
  const rawHost = searchParams.get('host')?.trim() ?? ''
  const portStr = searchParams.get('port') ?? ''
  const port = parseInt(portStr, 10)

  if (!rawHost) return NextResponse.json({ error: 'Missing host parameter.' }, { status: 400 })
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return NextResponse.json({ error: 'Port must be an integer between 1 and 65535.' }, { status: 400 })
  }

  // Block obvious private hosts by name
  if (isPrivateHost(rawHost)) {
    return NextResponse.json({ error: 'Private and loopback addresses are not allowed.' }, { status: 400 })
  }

  // Resolve hostname → check resolved IPs aren't private (SSRF guard)
  let resolvedIp: string | null = null
  try {
    const addrs = await dns.resolve(rawHost).catch(() => [] as string[])
    if (addrs.length > 0) {
      resolvedIp = addrs[0]
      if (isPrivateHost(resolvedIp)) {
        return NextResponse.json({ error: 'Hostname resolves to a private IP address.' }, { status: 400 })
      }
    }
  } catch {
    // Non-fatal — let the TCP probe attempt and fail naturally
  }

  try {
    const result = await tcpProbe(rawHost, port)
    return NextResponse.json({
      host: rawHost,
      port,
      resolvedIp,
      open: result.open,
      latencyMs: result.latencyMs,
      banner: result.banner,
      checkedAt: new Date().toISOString(),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: `Port check failed: ${msg}` }, { status: 502 })
  }
}
