/**
 * Short link redirect handler.
 * Routes: /s/[slug] → original URL
 */

import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface Props {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export default async function ShortLinkRedirect({ params }: Props) {
  const { slug } = params

  if (!slug || !/^[a-zA-Z0-9-_]{2,32}$/.test(slug)) notFound()

  const link = await prisma.shortLink.findUnique({
    where: { slug },
    select: { originalUrl: true, expiresAt: true, id: true },
  })

  if (!link) notFound()

  // Check expiry
  if (link.expiresAt && link.expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Link Expired</h1>
          <p className="text-gray-500 mb-6">This short link has expired and is no longer active.</p>
          <a href="/" className="text-indigo-600 hover:underline text-sm">← Back to RoughTools</a>
        </div>
      </div>
    )
  }

  // Increment click count (fire-and-forget)
  prisma.shortLink.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  }).catch(() => {})

  redirect(link.originalUrl)
}
