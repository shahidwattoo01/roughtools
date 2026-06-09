import type { Metadata } from 'next'
import Link from 'next/link'
import ChmodCalculatorClient from './ChmodCalculatorClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Chmod Calculator — Unix File Permission Calculator | RoughTools',
  description: 'Calculate Unix/Linux file permissions interactively. Toggle read, write, execute for owner, group, and others — see numeric (755) and symbolic (rwxr-xr-x) output instantly.',
  keywords: ['chmod calculator', 'unix file permissions', 'linux permissions', 'chmod 755', 'file permission calculator'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/chmod-calculator' },
  openGraph: {
    title: `chmod Calculator — Linux File Permission Calculator | RoughTools`,
    description: `Calculate Linux chmod permission values. Convert between symbolic (rwx), octal, and numeric notation. Free online chmod calculator.`,
    url: 'https://roughtools.com/tools/developer/chmod-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `chmod Calculator — Linux File Permission Calculator | RoughTools`,
    description: `Calculate Linux chmod permission values. Convert between symbolic (rwx), octal, and numeric notation. Free online chmod calculator.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this chmod calculator free to use?', a: 'Yes, the RoughTools Chmod Calculator is completely free with no account, subscription, or payment required. You can calculate Unix/Linux file permissions as many times as needed at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits and no registration required to use any feature.' },
  { q: 'Do I need to create an account to use the chmod calculator?', a: 'No account, email, or registration is required. Toggle permissions directly and see both the numeric chmod value and symbolic notation instantly. There is no login wall and no upgrade required. The tool works entirely in your browser and is completely anonymous — your permission calculations are never stored or transmitted anywhere.' },
  { q: 'Does this tool store the permission data I configure?', a: 'No. All permission calculations run entirely within your browser using JavaScript. The permission selections you make are never transmitted to RoughTools servers, never logged, and never shared with any third party. Once you close the browser tab, all data is gone. Your system administration work remains completely private.' },
  { q: 'Does the chmod calculator work on mobile and tablet?', a: 'Yes, the calculator is fully responsive and works on all modern smartphones and tablets. The toggle checkboxes and permission display are optimised for touch screens. This is useful when reviewing deployment checklists, checking file permission requirements in documentation, or quickly verifying a chmod value while working on a server from your mobile device.' },
  { q: 'Which browsers support this chmod calculator?', a: 'The Chmod Calculator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. No plugins or extensions are required. The calculator uses standard JavaScript that runs natively in every current browser version. Any current version of Chrome, Firefox, or Safari on desktop or mobile is fully supported.' },
  { q: 'How accurate are the permission calculations?', a: 'The calculations are mathematically exact. Unix file permissions use an octal system where each group (owner, group, others) is represented by three bits: read=4, write=2, execute=1. The total for each group ranges from 0 to 7. For example, 755 = owner:rwx(4+2+1=7) + group:r-x(4+0+1=5) + others:r-x(4+0+1=5). The symbolic notation (rwxr-xr-x) directly represents each bit. Both outputs are derived from the same binary value and are always correct.' },
  { q: 'Can I use this chmod calculator without an internet connection?', a: 'Once the page has fully loaded, all calculations run in JavaScript without requiring an active internet connection. You can toggle permissions and view numeric and symbolic output offline. This is useful when configuring servers in restricted network environments, reviewing deployment scripts offline, or studying Unix permissions without internet access.' },
  { q: 'How do I calculate Unix file permissions step by step?', a: 'To calculate permissions: (1) For each of the three groups (Owner, Group, Others), check the boxes for Read, Write, and Execute as needed. (2) The numeric chmod value updates instantly — checking all three for Owner gives 7 (4+2+1). (3) The symbolic notation (like rwxr-xr-x) updates simultaneously. (4) Copy the numeric value to use in a chmod command: chmod 755 filename. The tool handles all octal arithmetic automatically so you can focus on what access each group needs.' },
  { q: 'Why should I use RoughTools instead of memorising chmod values?', a: 'While experienced sysadmins memorise common values like 755, 644, and 777, less common combinations (like 640, 750, or 754) require mental octal arithmetic that is error-prone under pressure. This calculator lets you think in terms of what access you want to grant each group, eliminating calculation errors in security-sensitive permission settings on production servers.' },
  { q: 'How do I report a bug or suggest a new feature?', a: 'To report a bug or request a feature — such as special permission bits (setuid, setgid, sticky bit), directory versus file permission templates, umask calculator, or ACL support — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the permissions you were calculating, the browser and OS, and what you expected versus what was shown.' },
  { q: 'What do the three Unix permission groups mean?', a: 'Unix file permissions are divided into three groups: Owner (user) — the account that owns the file, typically the person who created it. Group — users belonging to the file\'s assigned group share these permissions. Others (world) — all other users on the system. For each group, three permission types apply: Read (r=4) — view file contents or list directory. Write (w=2) — modify file or create/delete files in a directory. Execute (x=1) — run the file as a program, or enter and traverse a directory.' },
  { q: 'What do common chmod values like 755 and 644 mean?', a: 'Common values: 755 (rwxr-xr-x) — owner can read/write/execute; group and others can read and execute. Standard for web server scripts. 644 (rw-r--r--) — owner can read/write; others can only read. Standard for HTML files, images, and config. 600 (rw-------) — only the owner can read and write. Used for SSH private keys and credential files. 700 (rwx------) — only the owner has any access. Used for private directories. 777 (rwxrwxrwx) — world-writable; avoid this as it is a serious security risk.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'chmod Calculator', item: 'https://roughtools.com/tools/developer/chmod-calculator' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'chmod Calculator',
    url: 'https://roughtools.com/tools/developer/chmod-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online chmod calculator tool by RoughTools.',
  }

  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/developer" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Developer Tools
          </Link>
          <span className="text-gray-700">|</span>
          <h1 className="font-bold text-white text-sm">Chmod Calculator</h1>
          <span className="ml-auto text-xs bg-rose-900/50 text-rose-400 border border-rose-800 px-2 py-0.5 rounded-full">🔐 755 · rwxr-xr-x</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-rose-900/60 to-red-900/60 border-b border-rose-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Owner · Group · Others', 'Read · Write · Execute', 'Numeric Output', 'Symbolic Output', 'Zero Maths', 'Free'].map(b => (
              <span key={b} className="text-xs bg-rose-900/50 text-rose-300 border border-rose-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Unix/Linux Chmod Calculator</h2>
          <p className="text-rose-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Calculate Unix and Linux file permissions interactively without octal arithmetic. Toggle read, write, and execute checkboxes for owner, group, and others — see both the numeric chmod value (e.g. 755) and the symbolic notation (e.g. rwxr-xr-x) update in real time. Use the reference table below for common permission patterns. Eliminates calculation errors in security-sensitive server permission configuration.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-rose-900/20 rounded-2xl p-1"><ChmodCalculatorClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🔢', title: 'Numeric + Symbolic', desc: 'Shows both 755 and rwxr-xr-x simultaneously' }, { icon: '☑️', title: 'Toggle UI', desc: 'Click permissions instead of doing octal arithmetic' }, { icon: '⚡', title: 'Instant', desc: 'Both outputs update with every checkbox click' }].map(c => (
            <div key={c.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div><div className="font-bold text-white text-xs mb-1">{c.title}</div><div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Common Chmod Values Reference</h2>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            {[['755', 'rwxr-xr-x', 'Scripts, web executables'], ['644', 'rw-r--r--', 'HTML, images, config files'], ['600', 'rw-------', 'SSH keys, credentials'], ['700', 'rwx------', 'Private directories'], ['664', 'rw-rw-r--', 'Group-editable files'], ['775', 'rwxrwxr-x', 'Group-accessible dirs'], ['440', 'r--r-----', 'Read-only system files'], ['777', 'rwxrwxrwx', 'World-writable (avoid)']].map(([num, sym, use]) => (
              <div key={num} className="flex items-center gap-3 p-2.5 bg-gray-800/50 rounded-lg">
                <code className="text-rose-400 font-mono text-xs w-10 flex-shrink-0">{num}</code>
                <code className="text-gray-300 font-mono text-xs w-28 flex-shrink-0">{sym}</code>
                <span className="text-gray-500 text-xs">{use}</span>
              </div>
            ))}
          </div>
        </div>
        <section><h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">{FAQS.map((faq, i) => (
            <details key={i} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <h3 className="text-sm font-semibold text-white text-left pr-4">{faq.q}</h3>
                <span className="text-rose-400 font-bold text-lg flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
            </details>
          ))}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related Developer Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[{ href: '/tools/developer/cron-parser', label: '⏰ Cron Parser' }, { href: '/tools/developer/timestamp-converter', label: '🕐 Timestamp Converter' }, { href: '/tools/developer/hash-generator', label: '#️⃣ Hash Generator' }, { href: '/tools/developer/uuid-generator', label: '🆔 UUID Generator' }, { href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-rose-500 hover:text-rose-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Chmod Calculator"
          toolSlug="chmod-calculator"
          toolUrl="https://roughtools.com/tools/developer/chmod-calculator"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
