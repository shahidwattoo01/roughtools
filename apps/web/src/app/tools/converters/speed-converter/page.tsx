import type { Metadata } from 'next'
import Link from 'next/link'
import SpeedConverterClient from './SpeedConverterClient'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Speed Converter — km/h, mph, m/s, Knots & More | RoughTools',
  description: 'Convert speed units instantly. Supports kilometers per hour, miles per hour, meters per second, knots, and feet per second. Free online speed converter with real-time results.',
  keywords: ['speed converter', 'km/h to mph', 'mph to km/h', 'knots to mph', 'meters per second converter', 'speed unit converter'],
  alternates: { canonical: 'https://roughtools.com/tools/converters/speed-converter' },
  openGraph: {
    title: `Speed Converter — mph, km/h, m/s, Knots | RoughTools`,
    description: `Convert speed units: miles per hour, kilometers per hour, meters per second, and knots. Free online speed converter tool.`,
    url: 'https://roughtools.com/tools/converters/speed-converter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Speed Converter — mph, km/h, m/s, Knots | RoughTools`,
    description: `Convert speed units: miles per hour, kilometers per hour, meters per second, and knots. Free online speed converter tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this speed converter free to use?',
    a: 'Yes, the RoughTools Speed Converter is completely free with no account, subscription, or payment required. You can convert between km/h, mph, m/s, knots, and feet per second as many times as needed at no cost. RoughTools is funded through non-intrusive advertising, keeping every converter permanently free. There are no usage limits, no premium speed units behind a paywall, and no registration required.'
  },
  {
    q: 'Do I need to sign up to convert speed units?',
    a: 'No account, email address, or registration is required. Enter a value, select your source unit, and the converter instantly shows the equivalent in all supported speed units simultaneously. There is no login wall, no upgrade required to access any unit, and no data stored about your conversions. The converter is entirely anonymous and can be used unlimited times without any sign-up process.'
  },
  {
    q: 'Does this speed converter store the values I enter?',
    a: 'No. All conversions run entirely within your browser using JavaScript. The values you enter are never transmitted to RoughTools servers, never logged, and never shared with any third party. Once you close the browser tab, all data is gone. Your speed calculations remain completely private — whether you are converting vehicle speeds, wind speeds, aircraft speeds, or scientific velocity values.'
  },
  {
    q: 'Does the speed converter work on mobile and tablet?',
    a: 'Yes, the converter is fully responsive and works on all modern smartphones and tablets. All input fields and the results panel are optimised for touch screens. This is useful when you are travelling between countries with different speed limit conventions, checking wind speed forecasts, comparing vehicle performance specifications, or studying physics problems on your mobile device.'
  },
  {
    q: 'Which browsers are supported by this speed converter?',
    a: 'The Speed Converter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The converter uses standard JavaScript arithmetic that runs natively in every current browser. Any current version of Chrome, Firefox, or Safari on desktop or mobile is fully supported.'
  },
  {
    q: 'How accurate are the speed conversions?',
    a: 'All conversion factors are exact or derived from exact definitions. One knot is exactly 1.852 km/h (as defined by the international standard). One mile is exactly 1.609344 km, so 1 mph equals exactly 1.609344 km/h. One m/s equals exactly 3.6 km/h. Feet per second derives from the exact foot definition: 1 ft/s = 0.3048 m/s = 1.09728 km/h. All conversions are precise to floating-point arithmetic limits — well beyond any practical measurement requirement.'
  },
  {
    q: 'Can I use this speed converter without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all conversions run in JavaScript without requiring an active internet connection. You can enter speed values and see all unit conversions offline after the initial page load. The initial page load requires internet access, but after that the converter functions entirely client-side. This is useful when reviewing route data, studying for exams, or working in locations without reliable connectivity.'
  },
  {
    q: 'How do I convert speed units step by step?',
    a: 'To convert a speed: (1) Enter the numeric value in the input field. (2) Select the source unit — for example, km/h. (3) The results panel instantly shows the equivalent in all other units simultaneously: mph, m/s, knots, and feet per second. Results update in real time as you type. This is especially useful when comparing international speed limits, vehicle specifications, or weather data that uses different unit conventions in different countries.'
  },
  {
    q: 'Why should I use RoughTools instead of a search engine for speed conversion?',
    a: 'Search engines convert between one pair of speed units at a time. RoughTools Speed Converter shows all supported units simultaneously in one view — enter a value in any unit and all others update instantly. This is far more efficient when you need to cross-reference km/h, mph, and knots at the same time — such as when reading a weather report (knots), checking a speed limit sign (mph or km/h), and looking up aviation data (knots) all at once.'
  },
  {
    q: 'How do I report a bug or request a new speed unit?',
    a: 'To report a bug or request an additional unit — such as Mach number (speed of sound), furlongs per fortnight (humorous but valid), or centimeters per second — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the value and unit you entered, the browser and OS, and the incorrect result versus what you expected. Feature requests are reviewed and prioritised regularly.'
  },
  {
    q: 'How do I convert km/h to mph?',
    a: 'Multiply km/h by 0.621371 to get mph. For example, 100 km/h × 0.621371 = 62.14 mph. To convert mph to km/h, multiply by 1.60934. A quick rule for mental maths: to convert km/h to mph, multiply by 5 and divide by 8. For example, 80 km/h × 5 ÷ 8 = 50 mph. Common road speed conversions: 30 km/h ≈ 18.6 mph, 50 km/h ≈ 31.1 mph, 60 km/h ≈ 37.3 mph, 100 km/h ≈ 62.1 mph, 120 km/h ≈ 74.6 mph.'
  },
  {
    q: 'What is a knot and why is it used in aviation and maritime?',
    a: 'A knot is one nautical mile per hour. One nautical mile equals exactly 1,852 meters, which is derived from one minute of arc of latitude on the Earth\'s surface — making nautical miles and knots naturally suited to navigation using coordinates. At one knot, a vessel or aircraft travels 1.852 km/h or approximately 1.151 mph. Knots are used in aviation and maritime navigation because they relate directly to the Earth\'s geographic coordinate system, simplifying course calculations and position plotting on nautical and aeronautical charts.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Unit Converters', item: 'https://roughtools.com/tools/converters' },
      { '@type': 'ListItem', position: 3, name: 'Speed Converter', item: 'https://roughtools.com/tools/converters/speed-converter' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Speed Converter',
    url: 'https://roughtools.com/tools/converters/speed-converter',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online speed converter tool by RoughTools.',
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
          <h1 className="font-bold text-white text-sm">Speed Converter</h1>
          <span className="ml-auto text-xs bg-cyan-900/50 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">🚀 km/h · mph · knots · m/s</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border-b border-cyan-800/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['km/h', 'mph', 'm/s', 'Knots', 'ft/s', 'All at Once', 'Free'].map(b => (
              <span key={b} className="text-xs bg-cyan-900/50 text-cyan-300 border border-cyan-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Speed Converter</h2>
          <p className="text-cyan-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">
            Convert between all major speed units instantly — kilometers per hour, miles per hour, meters per second, knots, and feet per second. Results update in real time showing all units simultaneously. Used for road travel, aviation, maritime navigation, weather data, and physics. All conversions are based on exact international definitions, ensuring precision across all scientific and everyday applications.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#12121f] border border-purple-900/20 rounded-2xl p-1">
          <SpeedConverterClient />
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <PDFExportButton toolName="Speed Converter" />
        </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '⚡', title: 'Real-Time', desc: 'All units update instantly as you type' },
            { icon: '🎯', title: 'Exact', desc: 'Based on internationally defined conversion factors' },
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
          <h2 className="text-base font-bold text-white mb-4">Quick Reference: Common Speed Conversions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {[
              ['100 km/h', '= 62.14 mph'],
              ['60 mph', '= 96.56 km/h'],
              ['1 knot', '= 1.852 km/h'],
              ['1 m/s', '= 3.6 km/h'],
              ['343 m/s', '= Mach 1 (sound)'],
              ['1 mph', '= 1.467 ft/s'],
              ['30 km/h', '= 18.64 mph'],
              ['120 km/h', '= 74.56 mph'],
              ['1 knot', '= 1.151 mph'],
            ].map(([from, to]) => (
              <div key={from} className="flex justify-between items-center p-2.5 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300 font-mono text-xs">{from}</span>
                <span className="text-cyan-400 font-mono text-xs">{to}</span>
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
                  <span className="text-cyan-400 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/converters/area-converter', label: '📐 Area' },
              { href: '/tools/converters/volume-converter', label: '🧪 Volume' },
              { href: '/tools/converters/time-converter', label: '⏱️ Time' },
              { href: '/tools/converters/digital-storage-converter', label: '💾 Digital Storage' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Speed Converter"
          toolSlug="speed-converter"
          toolUrl="https://roughtools.com/tools/converters/speed-converter"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
