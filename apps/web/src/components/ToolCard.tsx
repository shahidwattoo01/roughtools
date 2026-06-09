import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Tool, ToolCategory } from '@/lib/tools-registry'

// ─── Category SVG icons — strokeWidth 1.5, no emoji ─────────
const CAT_ICON: Record<ToolCategory, React.ReactNode> = {
  pdf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>
    </svg>
  ),
  calculators: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h.01M8 15h2M12 15h2M16 15h.01M8 19h2M12 19h6"/>
    </svg>
  ),
  developer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>
    </svg>
  ),
  text: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
    </svg>
  ),
  converters: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="m17 1 4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/>
    </svg>
  ),
  network: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>
    </svg>
  ),
  'legal-tools': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 16c0 2-2 3-4 3s-4-1-4-3M12 3v18M3 9l3-6 3 6M15 9l3-6 3 6M3 9c0 2 1.3 3 3 3s3-1 3-3M15 9c0 2 1.3 3 3 3s3-1 3-3"/>
    </svg>
  ),
  'real-estate': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2Z"/>
    </svg>
  ),
  'image-tools': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>
    </svg>
  ),
  security: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
    </svg>
  ),
  'document-tools': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 12h6M9 16h4"/>
    </svg>
  ),
  business: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
    </svg>
  ),
  environment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 014 13c0-7 9-11 16-11 0 7-4 16-11 16Z"/><path d="M2 22 16 8"/>
    </svg>
  ),
  engineering: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  medical: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.5-1.4 3-3.4 3-5.5A5.5 5.5 0 0016.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 002 8.5c0 2 1.5 4 3 5.5l7 7Z"/>
      <path d="M3.22 12H9.5l.7-1 2 4 1.8-2.5 1 1H21"/>
    </svg>
  ),
  'iq-test': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 013.76-3.28M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-3.76-3.28"/>
    </svg>
  ),
}

// ─── Category accent colors ───────────────────────────────────
const CAT_COLOR: Record<ToolCategory, string> = {
  pdf:              '#ff3d62',
  calculators:      '#5b6cff',
  developer:        '#64748b',
  text:             '#f59e0b',
  converters:       '#f97316',
  network:          '#06b6d4',
  'legal-tools':    '#facc15',
  'real-estate':    '#f97316',
  'image-tools':    '#ec4899',
  security:         '#10b981',
  'document-tools': '#8b5cf6',
  business:         '#a855f7',
  environment:      '#84cc16',
  engineering:      '#3b82f6',
  medical:          '#14b8a6',
  'iq-test':        '#a21caf',
}

const CAT_LABEL: Record<ToolCategory, string> = {
  pdf: 'PDF', calculators: 'Calculators', developer: 'Developer',
  text: 'Text', converters: 'Converters', network: 'Network',
  'legal-tools': 'Legal', 'real-estate': 'Real Estate', 'image-tools': 'Image',
  security: 'Security', 'document-tools': 'Documents', business: 'Business',
  environment: 'Environment', engineering: 'Engineering', medical: 'Medical',
  'iq-test': 'IQ Test',
}

// ─── Props ────────────────────────────────────────────────────
interface ToolCardProps {
  tool: Tool
  size?: 'sm' | 'md' | 'lg'
  showDescription?: boolean
  showCategory?: boolean
  className?: string
  headingLevel?: 'h2' | 'h3' | 'h4'
}

// ─── ToolCard ────────────────────────────────────────────────
export function ToolCard({
  tool,
  size = 'md',
  showDescription = true,
  showCategory = true,
  className,
  headingLevel: Heading = 'h3',
}: ToolCardProps) {
  const href  = `/tools/${tool.category}/${tool.slug}`
  const color = CAT_COLOR[tool.category]

  const padClass = { sm: 'p-3', md: 'p-4', lg: 'p-5' }[size]
  const iconBox  = { sm: 'w-8 h-8',  md: 'w-9 h-9',  lg: 'w-10 h-10' }[size]
  const iconSvg  = { sm: 'w-4 h-4',  md: 'w-4 h-4',  lg: 'w-5 h-5'  }[size]
  const nameSize = { sm: 'text-[13px]', md: 'text-[14px]', lg: 'text-[16px]' }[size]
  const descSize = { sm: 'text-[11px]', md: 'text-[12px]', lg: 'text-[13px]' }[size]

  return (
    <article className={cn('group', className)}>
      <Link
        href={href}
        className={cn(
          'flex flex-col h-full rounded-xl cursor-pointer',
          // Border: very subtle default → more visible on hover
          'border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]',
          'bg-white dark:bg-[#1A1A1A]',
          'hover:border-[rgba(0,0,0,0.18)] dark:hover:border-[rgba(255,255,255,0.16)]',
          // Lift on hover — spec: translateY(-3px), no shadow
          'hover:-translate-y-[3px]',
          // Press scale
          'active:scale-[0.99]',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2',
          padClass
        )}
      >
        <div className="flex items-start gap-3">
          {/* Category icon — tinted bg, category accent color */}
          <div
            className={cn('flex-shrink-0 flex items-center justify-center rounded-lg', iconBox)}
            style={{ background: `${color}18`, color }}
            aria-hidden="true"
          >
            <div className={iconSvg}>{CAT_ICON[tool.category]}</div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Badges */}
            {(tool.popular || tool.isNew || tool.featured) && (
              <div className="flex gap-1 mb-1.5 flex-wrap">
                {tool.popular && (
                  <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200/60">
                    Popular
                  </span>
                )}
                {tool.isNew && (
                  <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60">
                    New
                  </span>
                )}
              </div>
            )}

            {/* Name */}
            <Heading className={cn(
              'font-medium text-[var(--fg)] leading-snug truncate',
              'group-hover:text-[var(--brand)] transition-colors duration-150',
              nameSize
            )}>
              {tool.name}
            </Heading>

            {/* Description — 1 line max, ellipsis */}
            {showDescription && (
              <p className={cn('text-[var(--fg-2)] mt-1 line-clamp-1 leading-normal', descSize)}>
                {tool.description}
              </p>
            )}
          </div>

          {/* Arrow */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
            strokeLinecap="round" strokeLinejoin="round"
            className={cn(
              'flex-shrink-0 mt-0.5 text-[var(--fg-mute)]',
              'group-hover:text-[var(--brand)] group-hover:translate-x-0.5',
              'transition-all duration-150',
              size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
            )}
            aria-hidden="true"
          >
            <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
          </svg>
        </div>

        {/* Category badge */}
        {showCategory && (
          <div className="mt-3 pt-3 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
            <span
              className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: `${color}14`, color }}
            >
              {CAT_LABEL[tool.category]}
            </span>
          </div>
        )}
      </Link>
    </article>
  )
}

// ─── ToolGrid ─────────────────────────────────────────────────
interface ToolGridProps {
  tools: Tool[]
  size?: 'sm' | 'md' | 'lg'
  showDescription?: boolean
  columns?: 2 | 3 | 4
  className?: string
}

export function ToolGrid({ tools, size = 'md', showDescription = true, columns = 3, className }: ToolGridProps) {
  // Mobile always 2 columns — never 1 (spec: wastes space, looks like list)
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns]

  return (
    <div className={cn('grid gap-3', colClass, className)}>
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} size={size} showDescription={showDescription} />
      ))}
    </div>
  )
}
