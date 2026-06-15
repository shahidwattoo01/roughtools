export const dynamic = 'force-dynamic'

/**
 * SSL Certificate Checker API Route
 * Connects to a domain via TLS and returns certificate details.
 */

import { NextRequest, NextResponse } from 'next/server'
import tls from 'tls'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  const { allowed } = rateLimit(`ssl:${ip}`, 200, 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Rate limit exceeded.' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  let domain = searchParams.get('domain') ?? ''

  // Strip protocol if user includes it
  domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()

  if (!domain || !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
    return NextResponse.json({ success: false, error: 'Invalid domain name.' }, { status: 400 })
  }

  try {
    const cert = await new Promise<tls.PeerCertificate>((resolve, reject) => {
      const socket = tls.connect(
        { host: domain, port: 443, servername: domain, rejectUnauthorized: false },
        () => {
          const peerCert = socket.getPeerCertificate(true)
          socket.destroy()
          if (!peerCert || !peerCert.subject) {
            reject(new Error('No certificate returned'))
          } else {
            resolve(peerCert)
          }
        }
      )
      socket.setTimeout(8000, () => { socket.destroy(); reject(new Error('Connection timed out')) })
      socket.on('error', reject)
    })

    const validFrom = new Date(cert.valid_from)
    const validTo   = new Date(cert.valid_to)
    const now       = new Date()
    const daysUntilExpiry = Math.ceil((validTo.getTime() - now.getTime()) / 86400000)

    return NextResponse.json({
      success: true,
      data: {
        domain,
        issuer:          cert.issuer?.O ?? cert.issuer?.CN ?? 'Unknown',
        subject:         cert.subject?.CN ?? domain,
        validFrom:       validFrom.toISOString(),
        validTo:         validTo.toISOString(),
        daysUntilExpiry,
        isValid:         now >= validFrom && now <= validTo,
        isExpired:       now > validTo,
        san:             (cert.subjectaltname ?? '')
                           .split(', ')
                           .filter((s: string) => s.startsWith('DNS:'))
                           .map((s: string) => s.replace('DNS:', '')),
        fingerprint:     cert.fingerprint ?? '',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: `Could not check SSL for ${domain}: ${msg}` }, { status: 502 })
  }
}
