import type { Metadata } from 'next'
import Link from 'next/link'
import LengthConverterClient from './LengthConverterClient'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Length Converter — Meters, Feet, Inches, Miles & More | RoughTools',
  description: 'Convert length and distance units instantly. Supports meters, feet, inches, centimeters, kilometers, miles, yards, millimeters, and nautical miles. Free online length converter.',
  keywords: ['length converter', 'meters to feet', 'feet to meters', 'inches to cm', 'miles to km', 'distance converter'],
  alternates: { canonical: 'https://roughtools.com/tools/converters/length-converter' },
  openGraph: {
    title: `Length Converter — Meters, Feet, Miles, Inches | RoughTools`,
    description: `Convert length and distance units: meters, feet, miles, inches, kilometers, and more. Free online length unit converter.`,
    url: 'https://roughtools.com/tools/converters/length-converter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Length Converter — Meters, Feet, Miles, Inches | RoughTools`,
    description: `Convert length and distance units: meters, feet, miles, inches, kilometers, and more. Free online length unit converter.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this length converter free to use?',
    a: 'Yes, the RoughTools Length Converter is completely free with no account, subscription, or payment required. You can convert between meters, feet, inches, centimeters, kilometers, miles, yards, millimeters, and nautical miles as many times as needed at no cost. RoughTools is funded through non-intrusive advertising, keeping every converter permanently free. There are no usage limits, no premium units behind a paywall, and no registration required.'
  },
  {
    q: 'Do I need to sign up to convert length units?',
    a: 'No account, email address, or registration is required. Enter a value, select your source and target units, and the conversion result appears instantly. There is no login wall, no upgrade required to access any unit, and no data stored about your conversions. The converter is entirely anonymous and can be used unlimited times without any sign-up process.'
  },
  {
    q: 'Does this length converter store the values I enter?',
    a: 'No. All conversions run entirely within your browser using JavaScript. The values you enter are never transmitted to RoughTools servers, never logged, and never shared with third parties. Once you close the browser tab, all entered data is gone. Your calculations remain completely private — whether you are converting architectural measurements, engineering distances, or personal fitness metrics.'
  },
  {
    q: 'Does this length converter work on mobile and tablet?',
    a: 'Yes, the converter is fully responsive and works on all modern smartphones and tablets. All input fields and the results panel are optimised for touch screens. This is useful when you are on a job site, at a store comparing product dimensions, or travelling and need to quickly convert between imperial and metric measurements on your phone.'
  },
  {
    q: 'Which browsers support this length converter?',
    a: 'The Length Converter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The converter uses standard JavaScript arithmetic that runs natively in every current browser. Any current version of Chrome, Firefox, or Safari on desktop or mobile is fully supported.'
  },
  {
    q: 'How accurate are the length conversions?',
    a: 'All conversion factors are based on the internationally agreed exact definitions. The inch is defined as exactly 25.4 millimeters, making all inch-based conversions (feet, yards, miles) mathematically exact relative to metric. The nautical mile is defined as exactly 1,852 meters. The converter uses high-precision floating-point arithmetic, providing accuracy to at least 10 significant figures — more than sufficient for any engineering, educational, or everyday use.'
  },
  {
    q: 'Can I use this length converter offline?',
    a: 'Once the page has fully loaded in your browser, all conversions run in JavaScript without requiring an active internet connection. You can enter values and see all unit conversions offline after the initial page load. This is useful in the field, on construction sites, or in locations with poor connectivity. The initial page load requires internet, but after that the converter functions entirely client-side.'
  },
  {
    q: 'How do I convert length units step by step?',
    a: 'To convert a length: (1) Enter the numeric value you want to convert in the input field. (2) Select the source unit from the "From Unit" dropdown — for example, Feet. (3) The results panel instantly shows the equivalent value in all other supported units simultaneously. You can see meters, inches, centimeters, kilometers, miles, yards, millimeters, and nautical miles all at once. (4) Copy any result by clicking on it. No button press required — results update in real time as you type.'
  },
  {
    q: 'Why should I use RoughTools instead of a search engine for conversions?',
    a: 'Google and other search engines provide quick single-pair conversions (e.g., "5 feet in meters"), but RoughTools Length Converter displays conversions to all supported units simultaneously in one view. This is far more efficient when you need to compare multiple unit formats at once — for example, checking a measurement against both metric and imperial specifications at the same time. The converter also works offline once loaded and has no ads between input and output.'
  },
  {
    q: 'How do I report a bug or request a new unit?',
    a: 'To report a bug or request an additional unit — such as light years, angstroms, fathoms, furlongs, or astronomical units — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the value and units you entered, the browser and OS you were using, and the incorrect result versus what you expected. Feature requests for new units or conversion categories are reviewed and prioritised regularly.'
  },
  {
    q: 'How many feet are in a meter?',
    a: 'One meter equals approximately 3.28084 feet. This comes from the exact definition: one inch is 25.4 mm, so one foot (12 inches) equals 304.8 mm or 0.3048 m. Therefore 1 ÷ 0.3048 = 3.28084 feet per meter. For a quick mental estimate, multiply meters by 3.28 — or use the slightly rougher rule of "multiply by 3 and add 10%" for fast mental maths on site. To convert feet to meters, multiply by 0.3048.'
  },
  {
    q: 'How do I convert miles to kilometers?',
    a: 'One mile equals exactly 1.609344 kilometers. To convert miles to kilometers, multiply by 1.609344. For quick mental estimation, multiply miles by 1.6 — for example, 50 miles ≈ 80 km. To convert kilometers to miles, multiply by 0.621371 (or divide by 1.609344). A useful approximation for speed limits: 100 km/h ≈ 62 mph, 60 km/h ≈ 37 mph, 30 km/h ≈ 19 mph. These conversions are exact because the mile is defined in terms of feet and the inch is defined as exactly 25.4 mm.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Unit Converters', item: 'https://roughtools.com/tools/converters' },
      { '@type': 'ListItem', position: 3, name: 'Length Converter', item: 'https://roughtools.com/tools/converters/length-converter' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Length Converter',
    url: 'https://roughtools.com/tools/converters/length-converter',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online length converter tool by RoughTools.',
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

      {/* Breadcrumb nav */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/converters" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Unit Converters
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">Length Converter</h1>
          <span className="ml-auto text-xs bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full">📏 9 Units · Instant</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/60 dark:to-indigo-900/60 border-b border-blue-200/30 dark:border-blue-800/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Metric', 'Imperial', 'Nautical Miles', 'All Units at Once', 'Free'].map(b => (
              <span key={b} className="text-xs bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Length & Distance Converter</h2>
          <p className="text-blue-700 dark:text-blue-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">
            Convert between all major length and distance units instantly — millimeters, centimeters, meters, kilometers, inches, feet, yards, miles, and nautical miles. Results update in real time as you type, showing all unit equivalents simultaneously in one view. All conversion factors are based on the internationally agreed exact definitions — one inch is exactly 25.4 millimeters, making all conversions between metric and imperial mathematically precise. Use it for construction measurements, travel distances, engineering drawings, or converting product dimensions from international specifications.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white dark:bg-[#12121f] border border-gray-200 dark:border-purple-900/20 rounded-2xl p-1" data-print-section="calculator">
          <LengthConverterClient />
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <PDFExportButton toolName="Length Converter" />
        </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '⚡', title: 'Real-Time', desc: 'All 9 units update instantly as you type' },
            { icon: '🎯', title: 'Exact', desc: 'Based on internationally defined conversion factors' },
            { icon: '🔒', title: 'Private', desc: 'All calculations run locally in your browser' },
          ].map(c => (
            <div key={c.title} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Quick reference */}
        <div data-print-section="reference" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Reference: Common Length Conversions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {[
              ['1 inch', '= 2.54 cm'],
              ['1 foot', '= 0.3048 m'],
              ['1 yard', '= 0.9144 m'],
              ['1 mile', '= 1.609 km'],
              ['1 meter', '= 3.281 ft'],
              ['1 km', '= 0.6214 miles'],
              ['1 nautical mile', '= 1.852 km'],
              ['1 cm', '= 0.3937 in'],
              ['1 mm', '= 0.03937 in'],
            ].map(([from, to]) => (
              <div key={from} className="flex justify-between items-center p-2.5 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">{from}</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-xs">{to}</span>
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
                  <span className="text-blue-500 dark:text-blue-400 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/converters/weight-converter', label: '⚖️ Weight' },
              { href: '/tools/converters/temperature-converter', label: '🌡️ Temperature' },
              { href: '/tools/converters/area-converter', label: '📐 Area' },
              { href: '/tools/converters/volume-converter', label: '🧪 Volume' },
              { href: '/tools/converters/speed-converter', label: '🚀 Speed' },
              { href: '/tools/converters/time-converter', label: '⏱️ Time' },
              { href: '/tools/converters/digital-storage-converter', label: '💾 Digital Storage' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Length Converter"
          toolSlug="length-converter"
          toolUrl="https://roughtools.com/tools/converters/length-converter"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}

