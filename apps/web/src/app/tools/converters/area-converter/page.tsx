import type { Metadata } from 'next'
import Link from 'next/link'
import AreaConverterClient from './AreaConverterClient'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Area Converter — sq ft, sq m, Acres, Hectares & More | RoughTools',
  description: 'Convert area units instantly. Supports square meters, square feet, square inches, acres, hectares, square kilometers, and square miles. Free online area converter.',
  keywords: ['area converter', 'square feet to square meters', 'acres to hectares', 'sq ft to sq m', 'hectares to acres', 'area unit converter'],
  alternates: { canonical: 'https://roughtools.com/tools/converters/area-converter' },
  openGraph: {
    title: `Area Converter — Convert Square Meters, Acres, Sq Ft | RoughTools`,
    description: `Convert area units instantly: square meters, square feet, acres, hectares, and more. Free online area unit converter tool.`,
    url: 'https://roughtools.com/tools/converters/area-converter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Area Converter — Convert Square Meters, Acres, Sq Ft | RoughTools`,
    description: `Convert area units instantly: square meters, square feet, acres, hectares, and more. Free online area unit converter tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this area converter free to use?',
    a: 'Yes, the RoughTools Area Converter is completely free with no account, subscription, or payment required. You can convert between square meters, square feet, square inches, acres, hectares, square kilometers, and square miles as many times as needed at no cost. RoughTools is funded through non-intrusive advertising, keeping every converter permanently free. There are no usage limits, no premium units behind a paywall, and no registration required.'
  },
  {
    q: 'Do I need to sign up to convert area measurements?',
    a: 'No account, email address, or registration is required. Enter a value and select your source unit — the converter instantly shows the equivalent in all other supported units simultaneously. There is no login wall, no upgrade required, and no data stored about your conversions. The converter is entirely anonymous and can be used unlimited times without any sign-up process.'
  },
  {
    q: 'Does this tool store the values I enter?',
    a: 'No. All conversions run entirely within your browser using JavaScript. The values you enter are never transmitted to RoughTools servers, never logged, and never shared with any third party. Once you close the browser tab, all data is gone. Your measurements remain completely private — whether you are converting property sizes, agricultural land areas, or architectural floor plans.'
  },
  {
    q: 'Does this area converter work on mobile and tablet?',
    a: 'Yes, the converter is fully responsive and works on all modern smartphones and tablets. All input fields and the results panel are optimised for touch screens. This is particularly useful when you are browsing real estate listings that show property sizes in different unit systems — for example, a US listing in square feet when you are used to square meters — and want to quickly compare sizes from your phone.'
  },
  {
    q: 'Which browsers support this area converter?',
    a: 'The Area Converter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The converter uses standard JavaScript arithmetic that runs natively in every current browser. Any current version of Chrome, Firefox, or Safari on desktop or mobile is fully supported.'
  },
  {
    q: 'How accurate are the area conversions?',
    a: 'All conversion factors derive from the exact length definitions. Since one inch is exactly 25.4 mm, one square inch is exactly (25.4)² = 645.16 mm². One square foot is exactly (0.3048)² = 0.09290304 m². One acre is exactly 43,560 square feet by definition, and one hectare is exactly 10,000 m². All conversions are mathematically precise to floating-point accuracy — more than sufficient for real estate, land surveying, agriculture, or architectural use.'
  },
  {
    q: 'Can I use this area converter without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all conversions run in JavaScript without requiring an active internet connection. You can enter area values and see all unit conversions offline after the initial page load. This is useful when reviewing property documents, comparing land plots in the field, or working in locations with poor connectivity. The initial page load requires internet access, but after that the converter functions entirely client-side.'
  },
  {
    q: 'How do I convert area measurements step by step?',
    a: 'To convert an area: (1) Enter the numeric value in the input field. (2) Select the source unit — for example, Square Feet. (3) The results panel instantly shows the equivalent in all other units simultaneously: square meters, square inches, acres, hectares, square kilometers, and square miles. (4) Results update in real time as you type. This is especially useful for real estate comparisons where you need to see a floor area in both sq ft and sq m at the same time.'
  },
  {
    q: 'Why should I use RoughTools instead of a search engine for area conversion?',
    a: 'Search engines convert between one pair of area units at a time. RoughTools Area Converter displays all supported units simultaneously in one view — enter a value in any unit and all others update instantly. This is far more efficient for real estate and land measurement tasks where you regularly need to cross-reference square feet, square meters, and acres all at once, without repeated separate searches or unit switching.'
  },
  {
    q: 'How do I report a bug or request a new area unit?',
    a: 'To report a bug or request an additional unit — such as square yards, square centimeters, square millimeters, dunams (Middle Eastern land unit), or rai (Thai land unit) — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the value and unit you entered, the browser and OS, and the incorrect result versus what you expected. Feature requests for additional area units are reviewed and prioritised regularly.'
  },
  {
    q: 'How do I convert square feet to square meters?',
    a: 'Multiply the square footage by 0.092903 to get square meters. For example, 1,000 sq ft × 0.092903 = 92.90 m². To go the other way, multiply square meters by 10.7639 to get square feet. For quick mental estimation: a 1,000 sq ft apartment is roughly 93 m². A 2,000 sq ft house is about 186 m². These conversions arise directly from the length conversion: since 1 ft = 0.3048 m, 1 sq ft = 0.3048² = 0.0929 m².'
  },
  {
    q: 'How many acres are in a hectare and what do they look like?',
    a: 'One hectare equals approximately 2.47105 acres. One acre equals approximately 0.404686 hectares. To visualise: one hectare is the area of a square 100 metres on each side — roughly the size of a standard international football (soccer) pitch including run-off areas. One acre is about 0.4 hectares — roughly the area of an American football field including the end zones. In agriculture, hectares are used in metric countries while acres are used in the US and UK for land measurement.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Unit Converters', item: 'https://roughtools.com/tools/converters' },
      { '@type': 'ListItem', position: 3, name: 'Area Converter', item: 'https://roughtools.com/tools/converters/area-converter' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Area Converter',
    url: 'https://roughtools.com/tools/converters/area-converter',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online area converter tool by RoughTools.',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />

      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/converters" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Unit Converters
          </Link>
          <span className="text-gray-700">|</span>
          <h1 className="font-bold text-white text-sm">Area Converter</h1>
          <span className="ml-auto text-xs bg-teal-900/50 text-teal-400 border border-teal-800 px-2 py-0.5 rounded-full">📐 sq ft · sq m · acres</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-900/60 to-cyan-900/60 border-b border-teal-800/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Square Meters', 'Square Feet', 'Acres', 'Hectares', 'sq km', 'sq miles', 'Free'].map(b => (
              <span key={b} className="text-xs bg-teal-900/50 text-teal-300 border border-teal-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Area Converter</h2>
          <p className="text-teal-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">
            Convert between all major area units instantly — square meters, square feet, square inches, acres, hectares, square kilometers, and square miles. Results update in real time showing all units simultaneously. Used in real estate, agriculture, land surveying, architecture, and interior design. All conversions derive from exact length definitions, ensuring full mathematical precision across metric and imperial unit systems.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#12121f] border border-purple-900/20 rounded-2xl p-1">
          <AreaConverterClient />
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <PDFExportButton toolName="Area Converter" />
        </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '⚡', title: 'Real-Time', desc: 'All units update instantly as you type' },
            { icon: '🎯', title: 'Exact', desc: 'Derived from exact international length definitions' },
            { icon: '🔒', title: 'Private', desc: 'All calculations run locally in your browser' },
          ].map(c => (
            <div key={c.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-white text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Quick Reference: Common Area Conversions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {[
              ['1 sq ft', '= 0.0929 m²'],
              ['1 sq m', '= 10.764 sq ft'],
              ['1 acre', '= 4,047 m²'],
              ['1 hectare', '= 10,000 m²'],
              ['1 hectare', '= 2.471 acres'],
              ['1 sq km', '= 100 hectares'],
              ['1 sq mile', '= 2.590 km²'],
              ['1 sq mile', '= 640 acres'],
              ['1 acre', '= 43,560 sq ft'],
            ].map(([from, to]) => (
              <div key={from} className="flex justify-between items-center p-2.5 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300 font-mono text-xs">{from}</span>
                <span className="text-teal-400 font-mono text-xs">{to}</span>
              </div>
            ))}
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-800/50 hover:bg-gray-800 transition-colors">
                  <h3 className="text-sm font-semibold text-white text-left pr-4">{faq.q}</h3>
                  <span className="text-teal-400 font-bold text-lg flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Other Unit Converters</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/tools/converters/length-converter', label: '📏 Length' },
              { href: '/tools/converters/weight-converter', label: '⚖️ Weight' },
              { href: '/tools/converters/temperature-converter', label: '🌡️ Temperature' },
              { href: '/tools/converters/volume-converter', label: '🧪 Volume' },
              { href: '/tools/converters/speed-converter', label: '🚀 Speed' },
              { href: '/tools/converters/time-converter', label: '⏱️ Time' },
              { href: '/tools/converters/digital-storage-converter', label: '💾 Digital Storage' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-teal-500 hover:text-teal-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Area Converter"
          toolSlug="area-converter"
          toolUrl="https://roughtools.com/tools/converters/area-converter"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
