import type { Metadata } from 'next'
import Link from 'next/link'
import DigitalStorageConverterClient from './DigitalStorageConverterClient'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Digital Storage Converter — Bytes, KB, MB, GB, TB, Bits | RoughTools',
  description: 'Convert digital storage units instantly. Supports bytes, kilobytes, megabytes, gigabytes, terabytes, petabytes, bits, kilobits, megabits, and gigabits. Free online data size converter.',
  keywords: ['digital storage converter', 'bytes to KB', 'MB to GB', 'gigabytes to terabytes', 'bits to bytes', 'data size converter', 'file size converter'],
  alternates: { canonical: 'https://roughtools.com/tools/converters/digital-storage-converter' },
  openGraph: {
    title: `Digital Storage Converter — Bytes, KB, MB, GB | RoughTools`,
    description: `Convert digital storage units: bytes, kilobytes, megabytes, gigabytes, terabytes. Free online data storage unit converter.`,
    url: 'https://roughtools.com/tools/converters/digital-storage-converter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Digital Storage Converter — Bytes, KB, MB, GB | RoughTools`,
    description: `Convert digital storage units: bytes, kilobytes, megabytes, gigabytes, terabytes. Free online data storage unit converter.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this digital storage converter free to use?',
    a: 'Yes, the RoughTools Digital Storage Converter is completely free with no account, subscription, or payment required. You can convert between bytes, KB, MB, GB, TB, PB, bits, kilobits, megabits, and gigabits as many times as needed at no cost. RoughTools is funded through non-intrusive advertising, keeping every converter permanently free. There are no usage limits, no premium units behind a paywall, and no registration required.'
  },
  {
    q: 'Do I need to sign up to convert data storage units?',
    a: 'No account, email address, or registration is required. Enter a value and select your source unit — the converter instantly shows the equivalent in all supported storage units simultaneously. There is no login wall, no upgrade required, and no data stored about your conversions. The converter is entirely anonymous and can be used unlimited times without any sign-up process, whether you are a developer, system administrator, or student.'
  },
  {
    q: 'Does this tool store the values I enter?',
    a: 'No. All conversions run entirely within your browser using JavaScript. The values you enter are never transmitted to RoughTools servers, never logged, and never shared with any third party. Once you close the browser tab, all data is gone. Your calculations remain completely private — whether you are sizing storage infrastructure, calculating download times, configuring data retention policies, or checking file transfer speeds.'
  },
  {
    q: 'Does this digital storage converter work on mobile and tablet?',
    a: 'Yes, the converter is fully responsive and works on all modern smartphones and tablets. All input fields and the results panel are optimised for touch screens. This is useful when checking storage specifications on device datasheets, comparing cloud storage plans, or calculating whether a file will fit on a device — directly from your phone while shopping or reviewing technical documentation on a tablet.'
  },
  {
    q: 'Which browsers are compatible with this storage converter?',
    a: 'The Digital Storage Converter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The converter uses standard JavaScript arithmetic that runs natively in every current browser. Any current version of Chrome, Firefox, or Safari on desktop or mobile is fully supported.'
  },
  {
    q: 'How accurate are the digital storage conversions?',
    a: 'This converter uses the decimal (SI) standard: 1 KB = 1,000 bytes, 1 MB = 1,000,000 bytes, 1 GB = 1,000,000,000 bytes, and so on. This matches the convention used by hard drive manufacturers, cloud storage providers, and network speed ratings. All conversions are mathematically exact under this standard. Note that operating systems like Windows use binary units internally (1 KiB = 1,024 bytes), which is why a drive advertised as 1 TB may appear as approximately 931 GiB in Windows Explorer.'
  },
  {
    q: 'Can I use this converter without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all conversions run in JavaScript without requiring an active internet connection. You can enter storage values and see all unit conversions offline after the initial page load. The initial page load requires internet access, but after that the converter functions entirely client-side. This is useful for IT professionals working in secure environments or data centers without external internet access.'
  },
  {
    q: 'How do I convert digital storage units step by step?',
    a: 'To convert a storage value: (1) Enter the numeric value in the input field. (2) Select the source unit — for example, Gigabytes. (3) The results panel instantly shows the equivalent in all supported units simultaneously: bytes, KB, MB, TB, PB, bits, kilobits, megabits, and gigabits. Results update in real time as you type. This is useful for calculating download times (convert file size in GB to bits, divide by connection speed in bits/second), or comparing storage specifications expressed in different units.'
  },
  {
    q: 'Why should I use RoughTools instead of a search engine for storage conversion?',
    a: 'Search engines convert between one pair of storage units at a time. RoughTools Digital Storage Converter shows all supported units simultaneously in one view — enter a value in any unit and all others update instantly. This is particularly useful in networking and system administration contexts where you need to cross-reference file sizes in bytes, megabytes, and gigabits at the same time, such as when calculating bandwidth requirements or storage provisioning without repeated separate searches.'
  },
  {
    q: 'How do I report a bug or request a new storage unit?',
    a: 'To report a bug or request an additional unit — such as kibibytes (KiB), mebibytes (MiB), gibibytes (GiB), or exabytes — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the value and unit you entered, the browser and OS, and the incorrect result versus what you expected. Feature requests for binary (IEC) unit support alongside decimal units are reviewed and prioritised regularly by the development team.'
  },
  {
    q: 'What is the difference between MB and Mb in storage and networking?',
    a: 'The capitalisation matters critically in digital storage. MB (megabyte) uses an uppercase B and measures storage capacity — file sizes, disk space, RAM. 1 MB = 1,000,000 bytes (decimal). Mb (megabit) uses a lowercase b and measures data transfer rates and network bandwidth. 1 Mb = 1,000,000 bits = 125,000 bytes. Internet connection speeds are quoted in Mbps (megabits per second), not MBps. A 100 Mbps connection transfers 100 megabits or approximately 12.5 megabytes per second. Confusing the two leads to large errors when calculating download times or storage requirements.'
  },
  {
    q: 'Why does a 1 TB hard drive show less space in Windows?',
    a: 'Hard drive manufacturers use the decimal standard (1 TB = 1,000,000,000,000 bytes) because it produces a larger, more marketing-friendly number. Windows and most operating systems historically report storage in binary units: 1 tebibyte (TiB) = 1,099,511,627,776 bytes. A 1 TB (decimal) drive contains 1,000,000,000,000 bytes ÷ 1,099,511,627,776 = approximately 0.909 TiB, which Windows displays as approximately 931 GB. The physical storage capacity is unchanged — it is purely a display unit difference. macOS switched to decimal reporting in 2009, so a 1 TB drive shows as 1 TB in macOS and ~931 GB in Windows.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Unit Converters', item: 'https://roughtools.com/tools/converters' },
      { '@type': 'ListItem', position: 3, name: 'Digital Storage Converter', item: 'https://roughtools.com/tools/converters/digital-storage-converter' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Digital Storage Converter',
    url: 'https://roughtools.com/tools/converters/digital-storage-converter',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online digital storage converter tool by RoughTools.',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />

      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/converters" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Unit Converters
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">Digital Storage Converter</h1>
          <span className="ml-auto text-xs bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">💾 bytes · KB · MB · GB · TB</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/60 dark:to-blue-900/60 border-b border-indigo-200/30 dark:border-indigo-800/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'Bits', 'Megabits', 'Free'].map(b => (
              <span key={b} className="text-xs bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Digital Storage Converter</h2>
          <p className="text-indigo-700 dark:text-indigo-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">
            Convert between all major digital storage and data size units instantly — bytes, kilobytes, megabytes, gigabytes, terabytes, petabytes, bits, kilobits, megabits, and gigabits. Results update in real time showing all units simultaneously. Uses the decimal (SI) standard: 1 KB = 1,000 bytes — matching how storage manufacturers and network providers quote capacity. Essential for developers, system administrators, and anyone working with file sizes, bandwidth, and storage provisioning.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white dark:bg-[#12121f] border border-gray-200 dark:border-purple-900/20 rounded-2xl p-1" data-print-section="calculator">
          <DigitalStorageConverterClient />
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <PDFExportButton toolName="Digital Storage Converter" />
        </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '⚡', title: 'Real-Time', desc: 'All units update instantly as you type' },
            { icon: '📐', title: 'Decimal SI', desc: '1 KB = 1,000 bytes — matches industry standard' },
            { icon: '🔒', title: 'Private', desc: 'All calculations run locally in your browser' },
          ].map(c => (
            <div key={c.title} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        <div data-print-section="reference" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Reference: Digital Storage Units</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {[
              ['1 byte', '= 8 bits'],
              ['1 KB', '= 1,000 bytes'],
              ['1 MB', '= 1,000,000 bytes'],
              ['1 GB', '= 1,000 MB'],
              ['1 TB', '= 1,000 GB'],
              ['1 PB', '= 1,000 TB'],
              ['1 Mbps', '= 125 KB/s'],
              ['1 Gbps', '= 125 MB/s'],
              ['1 GiB', '= 1,073,741,824 bytes'],
            ].map(([from, to]) => (
              <div key={from} className="flex justify-between items-center p-2.5 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">{from}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">{to}</span>
              </div>
            ))}
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-left pr-4">{faq.q}</h3>
                  <span className="text-indigo-500 dark:text-indigo-400 font-bold text-lg flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Other Unit Converters</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/tools/converters/length-converter', label: '📏 Length' },
              { href: '/tools/converters/weight-converter', label: '⚖️ Weight' },
              { href: '/tools/converters/temperature-converter', label: '🌡️ Temperature' },
              { href: '/tools/converters/area-converter', label: '📐 Area' },
              { href: '/tools/converters/volume-converter', label: '🧪 Volume' },
              { href: '/tools/converters/speed-converter', label: '🚀 Speed' },
              { href: '/tools/converters/time-converter', label: '⏱️ Time' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-gray-700 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Digital Storage Converter"
          toolSlug="digital-storage-converter"
          toolUrl="https://roughtools.com/tools/converters/digital-storage-converter"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}

