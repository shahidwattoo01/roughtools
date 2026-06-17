import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'admin-dev-secret-change-in-prod',
)

export async function requireAdmin(req: NextRequest): Promise<null | NextResponse> {
  const token = req.cookies.get('admin_token')?.value ?? ''
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const { payload } = await jwtVerify(token, ADMIN_SECRET)
    if ((payload as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    return null
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}
