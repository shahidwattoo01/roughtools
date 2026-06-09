import type { Metadata } from 'next'
import Link from 'next/link'
import WeightConverterClient from './WeightConverterClient'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Weight & Mass Converter — kg, lbs, oz, Grams, Stone & More | RoughTools',
  description: 'Convert weight and mass units instantly. Supports kilograms, pounds, ounces, grams, stone, metric tons, and US tons. Free online weight converter with real-time results.',
  keywords: ['weight converter', 'kg to lbs', 'lbs to kg', 'pounds to kilograms', 'grams to ounces', 'mass converter', 'stone to kg'],
  alternates: { canonical: 'https://roughtools.com/tools/converters/weight-converter' },
  openGraph: {
    title: `Weight Converter — Kilograms, Pounds, Ounces | RoughTools`,
    description: `Convert weight and mass units: kilograms, pounds, ounces, grams, and tons. Free online weight converter tool.`,
    url: 'https://roughtools.com/tools/converters/weight-converter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Weight Converter — Kilograms, Pounds, Ounces | RoughTools`,
    description: `Convert weight and mass units: kilograms, pounds, ounces, grams, and tons. Free online weight converter tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this weight converter free to use?',
    a: 'Yes, the RoughTools Weight Converter is completely free with no account, subscription, or payment required. You can convert between kilograms, pounds, ounces, grams, stone, metric tons, and US tons as many times as needed at no cost. RoughTools is funded through non-intrusive advertising, keeping every converter permanently free. There are no usage limits, no premium units behind a paywall, and no registration of any kind required.'
  },
  {
    q: 'Do I need to create an account to convert weight units?',
    a: 'No account, email address, or registration is required. Enter a value, select your source unit, and the converter instantly shows the equivalent in all other supported units simultaneously. There is no login wall, no upgrade required to access any unit, and no data stored about your conversions. The converter is entirely anonymous and can be used unlimited times without any sign-up process.'
  },
  {
    q: 'Does this weight converter store the values I enter?',
    a: 'No. All conversions run entirely within your browser using JavaScript. The values you enter are never transmitted to RoughTools servers, never logged, and never shared with any third party. Once you close the browser tab, all data is gone. Your measurements remain completely private — whether you are converting body weight, cooking ingredients, shipping packages, or industrial loads.'
  },
  {
    q: 'Does this tool work on mobile and tablet?',
    a: 'Yes, the converter is fully responsive and works on all modern smartphones and tablets. All input fields and the results panel are optimised for touch screens. This is useful when you are at the grocery store comparing product weights between metric and imperial labelling, at the gym tracking workout loads, or checking luggage weight limits in different unit formats before a flight.'
  },
  {
    q: 'Which browsers are compatible with this weight converter?',
    a: 'The Weight Converter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The converter uses standard JavaScript arithmetic that runs natively in every current browser. Any current version of Chrome, Firefox, or Safari on desktop or mobile is fully supported.'
  },
  {
    q: 'How accurate are the weight and mass conversions?',
    a: 'All conversion factors are based on internationally agreed exact definitions. One pound is defined as exactly 453.59237 grams. One ounce is exactly 28.349523125 grams. One kilogram equals exactly 1,000 grams. The metric ton is exactly 1,000 kilograms. The US short ton is exactly 2,000 pounds. The stone is exactly 14 pounds. All conversions are mathematically precise to the limits of floating-point arithmetic — more than sufficient for any practical use.'
  },
  {
    q: 'Can I use this weight converter without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all conversions run in JavaScript without requiring an active internet connection. You can enter weight values and see all unit conversions offline after the initial page load. This is useful when comparing product weights in stores with poor signal, checking shipping weight limits, or working in industrial environments without reliable internet access. The initial page load requires internet, but after that the converter functions entirely client-side.'
  },
  {
    q: 'How do I convert weight units step by step?',
    a: 'To convert a weight: (1) Enter the numeric value you want to convert in the input field. (2) Select the source unit — for example, Kilograms. (3) The results panel instantly shows the equivalent in all other supported units simultaneously: pounds, ounces, grams, stone, metric tons, and US tons. (4) Results update in real time as you type — no button press is needed. You can read off any unit you need without re-entering the value or switching between separate conversion tools.'
  },
  {
    q: 'Why should I use RoughTools instead of a search engine for weight conversion?',
    a: 'Search engines convert between one pair of weight units at a time. RoughTools Weight Converter shows all supported units simultaneously in one view — enter a value in any unit and all others update instantly. This is far more efficient when you need multiple conversions at once, such as when a recipe uses grams but your scale shows pounds and ounces, or when you need to verify a shipping weight against limits expressed in both kg and lbs.'
  },
  {
    q: 'How do I report a bug or request a new weight unit?',
    a: 'To report a bug or request an additional unit — such as carats (for gemstones), troy ounces (for precious metals), milligrams, micrograms, or long tons — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the value and unit you entered, the browser and OS, and the incorrect result versus what you expected. Feature requests for additional mass units are reviewed and prioritised regularly.'
  },
  {
    q: 'How do I convert kilograms to pounds?',
    a: 'Multiply kilograms by 2.20462 to get pounds. For example, 70 kg × 2.20462 = 154.32 lbs. To convert pounds back to kilograms, divide by 2.20462 (or multiply by 0.453592). A quick mental approximation: multiply kg by 2.2. For a more precise estimate, multiply by 2.2 and add 10% of the original kg value. This is useful for body weight: 80 kg → 80 × 2.2 = 176 lbs (actual: 176.37 lbs).'
  },
  {
    q: 'What is a stone in pounds and kilograms?',
    a: 'One stone equals exactly 14 pounds or approximately 6.35029 kilograms. The stone is used primarily in the United Kingdom and Ireland for expressing body weight and is not part of the metric or US customary system. For example, a person weighing 11 stone 7 pounds weighs 161 pounds or approximately 73.03 kilograms. To convert stone to kg, multiply the stone value by 6.35029. To convert stone and pounds together, first convert to total pounds (stone × 14 + lbs), then multiply by 0.453592.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Unit Converters', item: 'https://roughtools.com/tools/converters' },
      { '@type': 'ListItem', position: 3, name: 'Weight Converter', item: 'https://roughtools.com/tools/converters/weight-converter' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Weight Converter',
    url: 'https://roughtools.com/tools/converters/weight-converter',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online weight converter tool by RoughTools.',
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
          <h1 className="font-bold text-white text-sm">Weight Converter</h1>
          <span className="ml-auto text-xs bg-green-900/50 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">⚖️ kg · lbs · oz · stone</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-b border-green-800/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Metric', 'Imperial', 'Stone', 'Metric Ton', 'US Ton', 'Free'].map(b => (
              <span key={b} className="text-xs bg-green-900/50 text-green-300 border border-green-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Weight & Mass Converter</h2>
          <p className="text-green-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">
            Convert between all major weight and mass units instantly — kilograms, pounds, ounces, grams, stone, metric tons, and US short tons. Results update in real time as you type, showing every unit simultaneously. All conversions use the exact internationally defined factors: one pound is exactly 453.59237 grams, making every conversion precise to full floating-point accuracy. Use it for cooking, fitness tracking, shipping calculations, or engineering applications.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#12121f] border border-purple-900/20 rounded-2xl p-1">
          <WeightConverterClient />
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <PDFExportButton toolName="Weight Converter" />
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
          <h2 className="text-base font-bold text-white mb-4">Quick Reference: Common Weight Conversions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {[
              ['1 kg', '= 2.2046 lbs'],
              ['1 lb', '= 453.59 g'],
              ['1 oz', '= 28.35 g'],
              ['1 stone', '= 6.350 kg'],
              ['1 metric ton', '= 1,000 kg'],
              ['1 US ton', '= 907.18 kg'],
              ['1 lb', '= 16 oz'],
              ['1 stone', '= 14 lbs'],
              ['1 kg', '= 35.274 oz'],
            ].map(([from, to]) => (
              <div key={from} className="flex justify-between items-center p-2.5 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300 font-mono text-xs">{from}</span>
                <span className="text-green-400 font-mono text-xs">{to}</span>
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
                  <span className="text-green-400 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/converters/temperature-converter', label: '🌡️ Temperature' },
              { href: '/tools/converters/area-converter', label: '📐 Area' },
              { href: '/tools/converters/volume-converter', label: '🧪 Volume' },
              { href: '/tools/converters/speed-converter', label: '🚀 Speed' },
              { href: '/tools/converters/time-converter', label: '⏱️ Time' },
              { href: '/tools/converters/digital-storage-converter', label: '💾 Digital Storage' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-green-500 hover:text-green-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Weight Converter"
          toolSlug="weight-converter"
          toolUrl="https://roughtools.com/tools/converters/weight-converter"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
