import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'admin-dev-secret-change-in-prod',
)

async function verifyAdminJwt(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_SECRET)
    return (payload as { role?: string }).role === 'ADMIN'
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization') ?? ''
  const cookieToken = request.cookies.get('admin_token')?.value ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : cookieToken

  if (!token || !(await verifyAdminJwt(token))) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
