/**
 * Footer — matches roughtools_homepage_fixed.html spec exactly
 * Dark bg #1a1a1a · Green CTA banner · 4-column grid · Social links
 */

import Link from 'next/link'
import { SOCIAL_LINKS } from '@/lib/social-config'
import { TOTAL_REAL_TOOLS } from '@/lib/tools-registry'
import {
  IconBrandX,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
} from '@tabler/icons-react'

const ALL_CATS = [
  { label: 'PDF Tools',         count: 26,  href: '/tools/pdf' },
  { label: 'Calculators',       count: 21,  href: '/tools/calculators' },
  { label: 'Medical & Health',  count: 113, href: '/tools/medical' },
  { label: 'Engineering',       count: 126, href: '/tools/engineering' },
  { label: 'Image Tools',       count: 38,  href: '/tools/image-tools' },
  { label: 'Developer Tools',   count: 19,  href: '/tools/developer' },
  { label: 'Document Tools',    count: 9,   href: '/tools/document-tools' },
]

const POPULAR = [
  { label: 'Compress PDF',          href: '/tools/pdf/compress-pdf' },
  { label: 'PDF to Word',           href: '/tools/pdf/pdf-to-word' },
  { label: 'Merge PDF',             href: '/tools/pdf/merge-pdf' },
  { label: 'Remove Background',     href: '/tools/image-tools/background-remover' },
  { label: 'BMI Calculator',        href: '/tools/calculators/bmi-calculator' },
  { label: 'eGFR Calculator',       href: '/tools/medical/egfr-ckd-epi-calculator' },
  { label: "Ohm's Law Calculator",  href: '/tools/engineering/ohms-law-calculator' },
]

const COMPANY = [
  { label: 'About',           href: '/about' },
  { label: 'Blog',            href: '/blog' },
  { label: 'Privacy Policy',  href: '/privacy-policy' },
  { label: 'Terms of Service',href: '/terms-of-service' },
  { label: 'Contact',         href: '/contact' },
  { label: 'Sitemap',         href: '/sitemap.xml' },
]

const SOCIALS = [
  { icon: IconBrandX,         href: SOCIAL_LINKS.twitter,   label: 'Twitter / X' },
  { icon: IconBrandGithub,    href: SOCIAL_LINKS.github,    label: 'GitHub' },
  { icon: IconBrandInstagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
  { icon: IconBrandLinkedin,  href: SOCIAL_LINKS.linkedin,  label: 'LinkedIn' },
].filter(s => s.href)

export default function Footer() {
  return (
    <footer
      className="mt-12 pt-10 pb-6"
      style={{ background: '#1a1a1a' }}
    >
      <div className="px-8 max-w-screen-xl mx-auto">

        {/* ── Green CTA banner ── */}
        <div
          className="rounded-xl p-6 flex items-center justify-between gap-6 mb-8 flex-wrap"
          style={{ background: '#1a6b3c' }}
        >
          <div>
            <h2 className="text-white text-lg font-medium leading-tight">
              {TOTAL_REAL_TOOLS}+ free tools — zero signup, zero watermark.
            </h2>
            <p className="text-white/75 text-sm mt-1">
              PDF · Medical · Engineering · Calculators · Developer · Image tools and 10 more
            </p>
          </div>
          <Link
            href="/tools"
            className="flex-shrink-0 bg-white text-[#1a6b3c] rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Browse all tools →
          </Link>
        </div>

        {/* ── 4-column grid ── */}
        <div className="grid gap-12 mb-8" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>

          {/* Col 1 — Logo + description + mini stats */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                style={{ background: '#1a6b3c' }}
              >
                RT
              </div>
              <span className="text-white font-semibold text-sm">
                RoughTools<span className="text-[#aaa] font-normal text-xs">.com</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#ccc' }}>
              The all-in-one free toolbox — {TOTAL_REAL_TOOLS}+ tools across 16 categories.
              No account required. No watermarks. No daily limits.
            </p>
            {/* Mini stats */}
            <div className="flex gap-2 mt-3">
              {[
                { n: `${TOTAL_REAL_TOOLS}+`, l: 'Free tools' },
                { n: '15',             l: 'Categories' },
                { n: '100%',           l: 'Free forever' },
              ].map(({ n, l }) => (
                <div
                  key={l}
                  className="flex-1 rounded-lg px-3 py-2 text-center"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  <div className="text-base font-medium" style={{ color: '#6fcf97' }}>{n}</div>
                  <div className="text-[11px]" style={{ color: '#aaa' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2 — All Categories */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-wider mb-2.5" style={{ color: '#888' }}>
              All Categories
            </h4>
            {ALL_CATS.map((c) => (
              <Link
                key={c.href} href={c.href}
                className="flex items-center justify-between text-sm mb-1.5 hover:text-white transition-colors no-underline"
                style={{ color: '#ccc' }}
              >
                <span>{c.label}</span>
                <span className="text-[11px]" style={{ color: '#555' }}>{c.count}</span>
              </Link>
            ))}
          </div>

          {/* Col 3 — Popular Tools */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-wider mb-2.5" style={{ color: '#888' }}>
              Popular Tools
            </h4>
            {POPULAR.map((t) => (
              <Link
                key={t.href} href={t.href}
                className="block text-sm mb-1.5 hover:text-white transition-colors no-underline"
                style={{ color: '#ccc' }}
              >
                {t.label}
              </Link>
            ))}
          </div>

          {/* Col 4 — Company */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-wider mb-2.5" style={{ color: '#888' }}>
              Company
            </h4>
            {COMPANY.map((c) => (
              <Link
                key={c.href} href={c.href}
                className="block text-sm mb-1.5 hover:text-white transition-colors no-underline"
                style={{ color: '#ccc' }}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex items-center justify-between pt-4 flex-wrap gap-3"
          style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs" style={{ color: '#666' }}>
            © 2026 RoughTools.com · All rights reserved
          </p>
          <div className="flex gap-2">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center transition-colors
                           text-[#aaa] hover:text-white
                           hover:[background:rgba(255,255,255,0.12)]"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '0.5px solid rgba(255,255,255,0.12)',
                }}
              >
                <Icon size={14} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
