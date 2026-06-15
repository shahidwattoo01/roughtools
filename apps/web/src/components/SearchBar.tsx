'use client'

// ============================================================
// ROUGHTOOLS — SearchBar Component
// Client-side tool search across all 415+ tools
// Results link directly to tool pages (good for crawlability)
// ============================================================

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Search, X, ArrowRight } from '@/components/icons'
import { ALL_TOOLS, type Tool } from '@/lib/tools-registry'
import { cn } from '@/lib/utils'

const CATEGORY_EMOJI: Record<string, string> = {
  pdf: '📄',
  calculators: '🧮',
  developer: '💻',
  text: '✏️',
  converters: '🔄',
  network: '🌐',
  'legal-tools': '⚖️',
  'real-estate': '🏠',
}

/** Simple fuzzy search across tool name, description, and keywords */
function searchTools(query: string, limit = 8): Tool[] {
  if (!query.trim()) return []
  const q = query.toLowerCase().trim()

  const scored = ALL_TOOLS.map((tool) => {
    let score = 0
    const name = tool.name.toLowerCase()
    const desc = tool.description.toLowerCase()
    const keywords = tool.keywords.join(' ').toLowerCase()

    // Exact name match = highest score
    if (name === q) score += 100
    // Name starts with query
    else if (name.startsWith(q)) score += 80
    // Name contains query
    else if (name.includes(q)) score += 60
    // Keyword match
    else if (keywords.includes(q)) score += 40
    // Description match
    else if (desc.includes(q)) score += 20

    // Boost popular tools
    if (tool.popular && score > 0) score += 10

    return { tool, score }
  })

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.tool)
}

interface SearchBarProps {
  placeholder?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  /** 'dark' = transparent input for dark hero; 'light' = default white */
  theme?: 'light' | 'dark'
  /** Redirect to search page instead of showing dropdown */
  redirectToPage?: boolean
  autoFocus?: boolean
  onSearch?: (query: string) => void
}

export function SearchBar({
  placeholder = 'Search 415+ tools...',
  className,
  size = 'md',
  theme = 'light',
  redirectToPage = false,
  autoFocus = false,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Tool[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Run search on query change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    setActiveIndex(-1)

    if (!redirectToPage) {
      const found = searchTools(val)
      setResults(found)
      setIsOpen(found.length > 0 || val.length > 0)
    }

    onSearch?.(val)
  }, [redirectToPage, onSearch])

  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      const tool = results[activeIndex]
      if (tool) {
        window.location.href = `/tools/${tool.category}/${tool.slug}`
      }
    }
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const sizeClasses = {
    sm: 'h-9 text-sm px-3 pl-9',
    md: 'h-11 text-base px-4 pl-11',
    lg: 'h-14 text-lg px-5 pl-14',
  }

  const iconSizes = {
    sm: 'h-4 w-4 left-2.5',
    md: 'h-5 w-5 left-3',
    lg: 'h-6 w-6 left-4',
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
    >
      {/* Search input */}
      <div className="relative">
        {theme !== 'dark' && (
          <Search
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10',
              iconSizes[size]
            )}
            aria-hidden="true"
          />
        )}

        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="searchbar-listbox"
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-label="Search tools"
          autoFocus={autoFocus}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full outline-none transition-all duration-200',
            theme === 'dark'
              ? 'bg-transparent border-0 text-[var(--fg)] placeholder:text-[var(--fg-3)] rounded-none ring-0'
              : cn(
                  'rounded-xl border border-gray-200 bg-white text-gray-900',
                  'placeholder:text-gray-400',
                  'focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
                  'hover:border-gray-300',
                ),
            sizeClasses[size]
          )}
          // Tell search engines this is a search input
          autoComplete="off"
          spellCheck="false"
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && !redirectToPage && (
        <div
          id="searchbar-listbox"
          role="listbox"
          aria-label="Search results"
          className={cn(
            'absolute top-full left-0 right-0 z-50 mt-2',
            'rounded-2xl shadow-xl overflow-hidden',
            theme === 'dark'
              ? 'bg-[#0b0f1d] border border-[rgba(255,255,255,0.12)]'
              : 'bg-white border border-gray-200'
          )}
        >
          {results.length > 0 ? (
            <>
              <ul className="max-h-80 overflow-y-auto py-2">
                {results.map((tool, i) => (
                  <li key={tool.slug} role="option" aria-selected={i === activeIndex}>
                    <Link
                      href={`/tools/${tool.category}/${tool.slug}`}
                      onClick={() => {
                        setIsOpen(false)
                        setQuery('')
                      }}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3',
                        'text-sm transition-colors',
                        i === activeIndex
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <span className="text-base flex-shrink-0" aria-hidden="true">
                        {CATEGORY_EMOJI[tool.category]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{tool.name}</p>
                        <p className="text-xs text-gray-400 truncate">{tool.description}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* See all results link */}
              <div className="border-t border-gray-100 px-4 py-2.5">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Search className="h-3.5 w-3.5" aria-hidden="true" />
                  See all results for &quot;{query}&quot;
                </Link>
              </div>
            </>
          ) : query.length > 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">
                No tools found for &quot;<strong>{query}</strong>&quot;
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try &quot;pdf&quot;, &quot;calculator&quot;, &quot;json&quot;...
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}