'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    section: 'Overview',
    items: [
      { href: '/admin',             label: 'Dashboard',       icon: '▦' },
    ],
  },
  {
    section: 'Content',
    items: [
      { href: '/admin/tools',       label: 'Tools',           icon: '⚙' },
      { href: '/admin/categories',  label: 'Categories',      icon: '⊞' },
      { href: '/admin/content',     label: 'Bulk Editor',     icon: '✎' },
    ],
  },
  {
    section: 'Data',
    items: [
      { href: '/admin/analytics',   label: 'Analytics',       icon: '↗' },
      { href: '/admin/seo',         label: 'SEO',             icon: '◎' },
      { href: '/admin/adsense',     label: 'AdSense',         icon: '$' },
      { href: '/admin/search',      label: 'Search Console',  icon: '⌕' },
    ],
  },
  {
    section: 'Platform',
    items: [
      { href: '/admin/users',       label: 'Users',           icon: '⊙' },
      { href: '/admin/database',    label: 'Database',        icon: '▤' },
      { href: '/admin/monitoring',  label: 'Monitoring',      icon: '♥' },
      { href: '/admin/iq',          label: 'IQ Test',         icon: '⧖' },
    ],
  },
  {
    section: 'Config',
    items: [
      { href: '/admin/settings',    label: 'Settings',        icon: '⚙' },
      { href: '/admin/reports',     label: 'Reports',         icon: '▤' },
    ],
  },
]

export function AdminSidebar() {
  const path = usePathname()

  return (
    <aside className="w-[200px] flex-shrink-0 bg-[#111] border-r border-white/6 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/6">
        <div className="text-sm font-bold text-white">RoughTools</div>
        <div className="text-[10px] text-[#555] mt-0.5">Admin Panel</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <div className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#444]">
              {section}
            </div>
            {items.map(({ href, label, icon }) => {
              const active = href === '/admin' ? path === '/admin' : path.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href as any}
                  className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-[13px] transition-colors ${
                    active
                      ? 'bg-[#1a6b3c]/20 text-[#6fcf97] font-medium'
                      : 'text-[#888] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-[11px] w-4 flex-shrink-0 opacity-70">{icon}</span>
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/6">
        <button
          onClick={() => {
            document.cookie = 'admin_token=; path=/; max-age=0'
            window.location.href = '/admin/login'
          }}
          className="text-[11px] text-[#555] hover:text-[#f87171] transition-colors w-full text-left"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
