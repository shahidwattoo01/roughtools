import Link from 'next/link'

export interface HubTool {
  name: string
  href: string
  description: string
  icon: string
  tags?: string[]
  badge?: string
  badgeColor?: 'orange' | 'blue' | 'green' | 'red' | 'purple' | 'pink' | 'amber'
}

export interface HubGroup {
  id: string
  title: string
  subtitle: string
  icon: string
  tools: HubTool[]
}

export interface CategoryHubConfig {
  // Hero
  eyebrow: string
  heroIcon: string
  title: string
  description: string
  gradient: string       // e.g. "from-violet-600 to-indigo-700"
  subtextClass: string   // e.g. "text-violet-100"
  chips: string[]
  // Tool groups
  groups: HubGroup[]
  // Accent classes
  accentBorder: string   // e.g. "hover:border-violet-300"
  accentBg: string       // e.g. "bg-violet-50"
  accentText: string     // e.g. "text-violet-600"
  accentGroupCount: string // e.g. "text-violet-500 bg-violet-50"
  // Trust bar
  trust: { icon: string; label: string }[]
  // SEO section
  seoTitle: string
  seoBody: string
  seoBullets?: string[]
  // Cross-links
  crossLinks: { href: string; label: string }[]
}

const BADGE_CLASSES: Record<string, string> = {
  orange: 'bg-orange-100 text-orange-700',
  blue:   'bg-blue-100 text-blue-700',
  green:  'bg-green-100 text-green-700',
  red:    'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
  pink:   'bg-pink-100 text-pink-700',
  amber:  'bg-amber-100 text-amber-700',
}

export default function CategoryHubLayout({ config }: { config: CategoryHubConfig }) {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className={`bg-gradient-to-r ${config.gradient} text-white`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
            <span>{config.heroIcon}</span>
            <span>{config.eyebrow}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            {config.title}
          </h1>
          <p className={`${config.subtextClass} text-sm sm:text-base max-w-2xl mb-6 leading-relaxed`}>
            {config.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {config.chips.map(chip => (
              <span key={chip} className="text-xs bg-white/15 border border-white/25 rounded-full px-3 py-1 font-medium">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust bar ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {config.trust.map(item => (
            <span key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <span>{item.icon}</span>{item.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {config.groups.map(group => (
          <section key={group.id} id={group.id}>

            {/* Group header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-11 h-11 rounded-xl ${config.accentBg} flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}>
                {group.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-gray-900 leading-snug">{group.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{group.subtitle}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${config.accentGroupCount}`}>
                {group.tools.length} tools
              </span>
            </div>

            {/* Tool grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {group.tools.map(tool => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`group bg-white rounded-2xl border border-gray-200 p-4 ${config.accentBorder} hover:shadow-md transition-all duration-200 block`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${config.accentBg} flex items-center justify-center text-lg flex-shrink-0 shadow-sm`}>
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-semibold text-sm text-gray-900 leading-snug">
                          {tool.name}
                        </span>
                        {tool.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${BADGE_CLASSES[tool.badgeColor ?? 'blue']}`}>
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
                      {tool.tags && tool.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {tool.tags.map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`text-sm font-bold ${config.accentText} flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5`}>
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* ── SEO section ──────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{config.seoTitle}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{config.seoBody}</p>
          {config.seoBullets && config.seoBullets.length > 0 && (
            <ul className="mt-4 space-y-2">
              {config.seoBullets.map(b => (
                <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Explore other free tools
            </p>
            <div className="flex flex-wrap gap-2">
              {config.crossLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back link */}
        <div className="pb-4">
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors">
            ← Back to All Tools
          </Link>
        </div>

      </main>
    </div>
  )
}
