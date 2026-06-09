import type { Metadata } from 'next'
import Link from 'next/link'
import { SearchBar } from '@/components/SearchBar'
import { ToolGrid } from '@/components/ToolCard'
import { getFeaturedTools } from '@/lib/relatedTools'

export const metadata: Metadata = {
  title: '404 — Page Not Found | RoughTools',
  description: 'This page could not be found. Try searching for a tool or browse our 600+ free online tools.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  const popularTools = getFeaturedTools(6)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* 404 visual */}
        <div className="text-8xl font-black text-indigo-100 mb-2 select-none" aria-hidden="true">
          404
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 max-w-md mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Try searching for a tool below.
        </p>

        {/* Search */}
        <div className="w-full max-w-xl mb-12">
          <SearchBar placeholder="Search 415+ tools..." size="lg" />
        </div>

        {/* Popular tools */}
        <div className="w-full max-w-4xl">
          <h2 className="text-lg font-semibold text-gray-700 mb-5">
            Popular tools you might be looking for
          </h2>
          <ToolGrid tools={popularTools} columns={3} showDescription={false} />
        </div>

        {/* Back home */}
        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            ← Back to all tools
          </Link>
        </div>
      </main>
    </div>
  )
}