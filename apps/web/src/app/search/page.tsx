import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { ToolGrid } from '@/components/ToolCard'
import { ALL_TOOLS, type Tool } from '@/lib/tools-registry'
import { ToolGridSkeleton } from '@/components/LazySection'

export const metadata: Metadata = {
  title: 'Search Tools | RoughTools',
  description: 'Search across 600+ free online tools.',
  // Search result pages should not be indexed
  robots: { index: false, follow: true },
}

function searchTools(query: string): Tool[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return ALL_TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q))
  ).sort((a, b) => (b.priority ?? 0.5) - (a.priority ?? 0.5))
}

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const results = searchTools(query)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {query ? `Results for "${query}"` : 'Search Tools'}
          </h1>
          <Suspense fallback={null}>
            <SearchBar
              placeholder="Search 415+ tools..."
              size="md"
              redirectToPage={true}
              className="max-w-2xl"
            />
          </Suspense>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        {query ? (
          results.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-6">
                Found {results.length} tool{results.length !== 1 ? 's' : ''}
              </p>
              <Suspense fallback={<ToolGridSkeleton count={8} />}>
                <ToolGrid tools={results} columns={2} showDescription={true} />
              </Suspense>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 mb-4">
                No tools found for &quot;<strong>{query}</strong>&quot;
              </p>
              <p className="text-gray-400 text-sm">
                Try: &quot;pdf&quot;, &quot;calculator&quot;, &quot;json&quot;, &quot;convert&quot;
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-16 text-gray-400">
            Type something to search across 415+ tools
          </div>
        )}
      </main>
    </div>
  )
}