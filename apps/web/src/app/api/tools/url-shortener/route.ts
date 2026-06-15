export const dynamic = 'force-dynamic'

/**
 * URL Shortener API Route
 * Creates short links stored in the database.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import crypto from 'crypto'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com'
const SLUG_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const RESERVED_SLUGS = new Set(['api', 'tools', 'admin', 'auth', 'blog', 'privacy-policy', 'terms-of-service', 'dashboard'])

function generateSlug(length = 6): string {
  return Array.from(crypto.randomBytes(length))
    .map(b => SLUG_CHARS[b % SLUG_CHARS.length])
    .join('')
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { allowed } = rateLimit(`shorten:${ip}`, 200, 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: { message: 'Rate limit exceeded.' } }, { status: 429 })
  }

  const body = await request.json() as { url?: string; customSlug?: string; expiresInDays?: number }
  const { url, customSlug, expiresInDays } = body

  if (!url || !isValidUrl(url)) {
    return NextResponse.json({ error: { message: 'Invalid URL. Must start with http:// or https://' } }, { status: 400 })
  }

  // Validate custom slug
  if (customSlug) {
    if (!/^[a-zA-Z0-9-_]{2,32}$/.test(customSlug)) {
      return NextResponse.json({ error: { message: 'Slug must be 2-32 alphanumeric characters.' } }, { status: 400 })
    }
    if (RESERVED_SLUGS.has(customSlug.toLowerCase())) {
      return NextResponse.json({ error: { message: 'This slug is reserved.' } }, { status: 409 })
    }
  }

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 86400000)
    : null

  try {
    // Try custom slug, or generate a unique one
    let slug = customSlug ?? generateSlug()
    let attempts = 0

    while (!customSlug && attempts < 5) {
      const existing = await prisma.shortLink.findUnique({ where: { slug } })
      if (!existing) break
      slug = generateSlug()
      attempts++
    }

    if (customSlug) {
      const existing = await prisma.shortLink.findUnique({ where: { slug } })
      if (existing) {
        return NextResponse.json({ error: { message: 'This custom slug is already taken.' } }, { status: 409 })
      }
    }

    const link = await prisma.shortLink.create({
      data: { slug, originalUrl: url, expiresAt },
    })

    return NextResponse.json({
      id:          link.id,
      slug:        link.slug,
      shortUrl:    `${SITE}/s/${link.slug}`,
      originalUrl: link.originalUrl,
      expiresAt:   link.expiresAt,
      createdAt:   link.createdAt,
    }, { status: 201 })
  } catch (err) {
    console.error('[url-shortener] error:', err)
    return NextResponse.json({ error: { message: 'Failed to create short link.' } }, { status: 500 })
  }
}
