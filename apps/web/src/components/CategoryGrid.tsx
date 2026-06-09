/**
 * CategoryGrid — matches roughtools_homepage_fixed.html spec exactly
 * Grid: auto-fill minmax(158px) · White cards · Colored Tabler icons
 * Dark mode: card bg #1e1e1e · icon bg at 15% opacity
 *
 * COUNTS: sourced from each category's hub page / config file.
 * Calculators uses TOTAL_CALC_COUNT so it stays in sync automatically.
 */

import Link from 'next/link'
import {
  IconPhoto,
  IconFileTypePdf,
  IconCalculator,
  IconTypography,
  IconCode,
  IconArrowsExchange,
  IconHeartRateMonitor,
  IconSettings2,
  IconShieldCheck,
  IconScale,
  IconBuildingEstate,
  IconBriefcase,
  IconNetwork,
  IconFileText,
  IconLeaf,
  IconBrain,
} from '@tabler/icons-react'
import { TOTAL_CALC_COUNT } from '@/app/tools/calculators/_components/calculator-tool-configs'

/* ─── Spec: icon bg, icon color, dark bg ─────────────────────── */
const CATEGORIES = [
  {
    name: 'Image Tools',      count: 38,               href: '/tools/image-tools',
    icon: IconPhoto,
    bg: '#e8f0fb',  color: '#2563eb', darkBg: 'rgba(37,99,235,0.15)',
  },
  {
    name: 'PDF Tools',        count: 31,               href: '/tools/pdf',
    icon: IconFileTypePdf,
    bg: '#fdecea',  color: '#dc2626', darkBg: 'rgba(220,38,38,0.15)',
  },
  {
    name: 'Calculators',      count: TOTAL_CALC_COUNT, href: '/tools/calculators',
    icon: IconCalculator,
    bg: '#fef3c7',  color: '#d97706', darkBg: 'rgba(217,119,6,0.15)',
  },
  {
    name: 'Text Tools',       count: 10,               href: '/tools/text',
    icon: IconTypography,
    bg: '#ede9fe',  color: '#7c3aed', darkBg: 'rgba(124,58,237,0.15)',
  },
  {
    name: 'Developer Tools',  count: 19,               href: '/tools/developer',
    icon: IconCode,
    bg: '#e0f2fe',  color: '#0284c7', darkBg: 'rgba(2,132,199,0.15)',
  },
  {
    name: 'Converters',       count: 8,                href: '/tools/converters',
    icon: IconArrowsExchange,
    bg: '#fce7f3',  color: '#db2777', darkBg: 'rgba(219,39,119,0.15)',
  },
  {
    name: 'Medical & Health', count: 113,              href: '/tools/medical',
    icon: IconHeartRateMonitor,
    bg: '#d1fae5',  color: '#059669', darkBg: 'rgba(5,150,105,0.15)',
  },
  {
    name: 'Engineering',      count: 126,              href: '/tools/engineering',
    icon: IconSettings2,
    bg: '#fff7ed',  color: '#ea580c', darkBg: 'rgba(234,88,12,0.15)',
  },
  {
    name: 'Security',         count: 9,                href: '/tools/security',
    icon: IconShieldCheck,
    bg: '#f0fdf4',  color: '#16a34a', darkBg: 'rgba(22,163,74,0.15)',
  },
  {
    name: 'Legal Tools',      count: 8,                href: '/tools/legal-tools',
    icon: IconScale,
    bg: '#faf5ff',  color: '#9333ea', darkBg: 'rgba(147,51,234,0.15)',
  },
  {
    name: 'Real Estate',      count: 8,                href: '/tools/real-estate',
    icon: IconBuildingEstate,
    bg: '#fff1f2',  color: '#e11d48', darkBg: 'rgba(225,29,72,0.15)',
  },
  {
    name: 'Business',         count: 6,                href: '/tools/business',
    icon: IconBriefcase,
    bg: '#f0f9ff',  color: '#0369a1', darkBg: 'rgba(3,105,161,0.15)',
  },
  {
    name: 'Network Tools',    count: 7,                href: '/tools/network',
    icon: IconNetwork,
    bg: '#e0f9ff',  color: '#0891b2', darkBg: 'rgba(8,145,178,0.15)',
  },
  {
    name: 'Document Tools',   count: 11,               href: '/tools/document-tools',
    icon: IconFileText,
    bg: '#f5f3ff',  color: '#7c3aed', darkBg: 'rgba(124,58,237,0.15)',
  },
  {
    name: 'Environment',      count: 6,                href: '/tools/environment',
    icon: IconLeaf,
    bg: '#f0fdf4',  color: '#16a34a', darkBg: 'rgba(22,163,74,0.15)',
  },
  {
    name: 'IQ Test',          count: 1,                href: '/tools/iq-test',
    icon: IconBrain,
    bg: '#fdf4ff',  color: '#a21caf', darkBg: 'rgba(162,28,175,0.15)',
  },
]

export function CategoryGrid() {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(158px, 1fr))' }}
    >
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon
        return (
          <Link
            key={cat.href}
            href={cat.href}
            className="group flex flex-col gap-3 p-5 rounded-xl
                       bg-white dark:bg-[#1e1e1e]
                       border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]
                       hover:border-[#1a6b3c] dark:hover:border-[#1a6b3c]
                       transition-colors duration-150
                       no-underline"
          >
            {/* Icon wrap */}
            <div
              className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{ background: cat.bg, color: cat.color }}
            >
              <Icon size={24} aria-hidden="true" strokeWidth={1.5} />
            </div>

            {/* Text */}
            <div>
              <h3 className="text-sm font-medium text-[#1a1a1a] dark:text-[#f0f0f0] leading-tight mb-0.5">
                {cat.name}
              </h3>
              <p className="text-xs text-[#555] dark:text-[#aaa]">{cat.count} tools</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
