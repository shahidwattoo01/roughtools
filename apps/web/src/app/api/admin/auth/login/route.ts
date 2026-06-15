export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'admin-dev-secret-change-in-prod',
)

// Admin credentials are stored as env vars — no DB lookup needed for a single admin
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? 'admin@roughtools.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''  // bcrypt hash

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed, resetAt } = rateLimit(ip, 5, 15 * 60 * 1000) // 5 attempts per 15 min
  if (!allowed) {
    return NextResponse.json(
      { message: 'Too many login attempts. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) },
      }
    )
  }

  const { email, password } = await req.json() as { email?: string; password?: string }

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password required' }, { status: 400 })
  }

  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }

  // In dev with no hash set, allow the raw ADMIN_PASSWORD env var for convenience
  const validPassword = ADMIN_PASSWORD.startsWith('$2')
    ? await bcrypt.compare(password, ADMIN_PASSWORD)
    : password === ADMIN_PASSWORD

  if (!validPassword) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }

  const token = await new SignJWT({ role: 'ADMIN', email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('4h')
    .sign(SECRET)

  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 4 * 3600,
    path: '/',
  })
  return res
}
