import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

/** 25 MB — generous for normal use, prevents memory exhaustion */
export const MAX_PDF_SIZE = 25 * 1024 * 1024

/**
 * Call at the top of every PDF route POST handler.
 * Returns a Response if the request should be rejected, otherwise null.
 *
 * Usage:
 *   const guard = pdfGuard(req)
 *   if (guard) return guard
 *   const form = await req.formData()
 *   const file = form.get('file') as File | null
 *   const sizeGuard = pdfSizeGuard(file)
 *   if (sizeGuard) return sizeGuard
 */
export function pdfGuard(req: NextRequest): NextResponse | null {
  const ip = getClientIp(req)
  const { allowed, resetAt } = rateLimit(`pdf:${ip}`, 200, 60 * 1000) // 200 ops/min — blocks bots, never real users
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) },
      },
    )
  }
  return null
}

export function pdfSizeGuard(file: File | null): NextResponse | null {
  if (!file) return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
  if (file.size > MAX_PDF_SIZE) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${MAX_PDF_SIZE / 1024 / 1024} MB.` },
      { status: 413 },
    )
  }
  return null
}
