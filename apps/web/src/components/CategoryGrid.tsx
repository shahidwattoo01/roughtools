/**
 * CategoryGrid — 3D floating icon cards
 * Order: PDF · Image · Medical · Engineering · IQ Test · Document · Legal ·
 *        Real Estate · Developer · Environment · Security · then rest
 */

import Link from 'next/link'
import {
  IconFileTypePdf,
  IconPhoto,
  IconHeartRateMonitor,
  IconSettings2,
  IconBrain,
  IconFileText,
  IconScale,
  IconBuildingEstate,
  IconCode,
  IconLeaf,
  IconShieldCheck,
  IconCalculator,
  IconTypography,
  IconArrowsExchange,
  IconBriefcase,
  IconNetwork,
} from '@tabler/icons-react'
import { TOTAL_CALC_COUNT } from '@/lib/tool-counts'

/* ─── Category definitions ─────────────────────────────────── */
const CATEGORIES = [
  /* ── Priority row ─────────────────────────────────────────── */
  {
    name: 'PDF Tools',        count: 31,               href: '/tools/pdf',
    icon: IconFileTypePdf,
    bg: '#fdecea',  color: '#dc2626', darkBg: 'rgba(220,38,38,0.18)',
  },
  {
    name: 'Image Tools',      count: 38,               href: '/tools/image-tools',
    icon: IconPhoto,
    bg: '#e8f0fb',  color: '#2563eb', darkBg: 'rgba(37,99,235,0.18)',
  },
  {
    name: 'Medical & Health', count: 113,              href: '/tools/medical',
    icon: IconHeartRateMonitor,
    bg: '#d1fae5',  color: '#059669', darkBg: 'rgba(5,150,105,0.18)',
  },
  {
    name: 'Engineering',      count: 126,              href: '/tools/engineering',
    icon: IconSettings2,
    bg: '#fff7ed',  color: '#ea580c', darkBg: 'rgba(234,88,12,0.18)',
  },
  {
    name: 'IQ Test',          count: 1,                href: '/tools/iq-test',
    icon: IconBrain,
    bg: '#fdf4ff',  color: '#a21caf', darkBg: 'rgba(162,28,175,0.18)',
  },
  {
    name: 'Document Tools',   count: 11,               href: '/tools/document-tools',
    icon: IconFileText,
    bg: '#f5f3ff',  color: '#6d28d9', darkBg: 'rgba(109,40,217,0.18)',
  },
  {
    name: 'Legal Tools',      count: 8,                href: '/tools/legal-tools',
    icon: IconScale,
    bg: '#faf5ff',  color: '#9333ea', darkBg: 'rgba(147,51,234,0.18)',
  },
  {
    name: 'Real Estate',      count: 8,                href: '/tools/real-estate',
    icon: IconBuildingEstate,
    bg: '#fff1f2',  color: '#e11d48', darkBg: 'rgba(225,29,72,0.18)',
  },
  {
    name: 'Developer Tools',  count: 19,               href: '/tools/developer',
    icon: IconCode,
    bg: '#e0f2fe',  color: '#0284c7', darkBg: 'rgba(2,132,199,0.18)',
  },
  {
    name: 'Environment',      count: 6,                href: '/tools/environment',
    icon: IconLeaf,
    bg: '#f0fdf4',  color: '#16a34a', darkBg: 'rgba(22,163,74,0.18)',
  },
  {
    name: 'Security',         count: 9,                href: '/tools/security',
    icon: IconShieldCheck,
    bg: '#ecfdf5',  color: '#0d9488', darkBg: 'rgba(13,148,136,0.18)',
  },
  /* ── Rest ─────────────────────────────────────────────────── */
  {
    name: 'Calculators',      count: TOTAL_CALC_COUNT, href: '/tools/calculators',
    icon: IconCalculator,
    bg: '#fef3c7',  color: '#d97706', darkBg: 'rgba(217,119,6,0.18)',
  },
  {
    name: 'Text Tools',       count: 10,               href: '/tools/text',
    icon: IconTypography,
    bg: '#ede9fe',  color: '#7c3aed', darkBg: 'rgba(124,58,237,0.18)',
  },
  {
    name: 'Converters',       count: 8,                href: '/tools/converters',
    icon: IconArrowsExchange,
    bg: '#fce7f3',  color: '#db2777', darkBg: 'rgba(219,39,119,0.18)',
  },
  {
    name: 'Business',         count: 6,                href: '/tools/business',
    icon: IconBriefcase,
    bg: '#f0f9ff',  color: '#0369a1', darkBg: 'rgba(3,105,161,0.18)',
  },
  {
    name: 'Network Tools',    count: 7,                href: '/tools/network',
    icon: IconNetwork,
    bg: '#e0f9ff',  color: '#0891b2', darkBg: 'rgba(8,145,178,0.18)',
  },
]

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon
        return (
          <Link
            key={cat.href}
            href={cat.href}
            className="group flex flex-col gap-4 p-5 sm:p-6 rounded-2xl
                       bg-white dark:bg-[#1e1e1e]
                       border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]
                       hover:border-[#1a6b3c] dark:hover:border-[#1a6b3c]
                       transition-colors duration-150
                       no-underline"
          >
            {/* 3-D floating icon */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0
                         transition-all duration-200
                         group-hover:scale-110 group-hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(145deg, #ffffff 0%, ${cat.bg} 100%)`,
                boxShadow: [
                  `0 8px 22px -4px ${cat.color}45`,
                  `0 3px 8px rgba(0,0,0,0.10)`,
                  `inset 0 1px 0 rgba(255,255,255,1)`,
                  `inset 0 -1px 0 ${cat.color}18`,
                ].join(', '),
              }}
            >
              <Icon size={32} style={{ color: cat.color }} strokeWidth={1.5} aria-hidden="true" />
            </div>

            {/* Text */}
            <div>
              <h3 className="text-[13px] sm:text-[15px] font-semibold text-[#1a1a1a] dark:text-[#f0f0f0] leading-tight mb-1">
                {cat.name}
              </h3>
              <p className="text-[11px] sm:text-[13px] text-[#555] dark:text-[#aaa]">{cat.count} tools</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
