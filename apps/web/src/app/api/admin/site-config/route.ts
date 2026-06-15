export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { revalidateTag } from 'next/cache'
import { getSocialLinks, setSocialLinks } from '@/lib/site-config-db'

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'admin-dev-secret-change-in-prod',
)

async function guard(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get('admin_token')?.value ?? ''
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  try {
    const { payload } = await jwtVerify(token, SECRET)
    if ((payload as { role?: string }).role !== 'ADMIN') throw new Error()
    return null
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}

export async function GET(req: NextRequest) {
  const err = await guard(req)
  if (err) return err
  const social = await getSocialLinks()
  return NextResponse.json({ social })
}

export async function PATCH(req: NextRequest) {
  const err = await guard(req)
  if (err) return err

  const body = await req.json() as { social?: { twitter?: string; github?: string; linkedin?: string } }
  if (body.social) {
    await setSocialLinks(body.social)
    revalidateTag('site-config')
  }
  return NextResponse.json({ ok: true })
}
