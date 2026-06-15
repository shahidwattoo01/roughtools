import type { Metadata } from 'next'
import Link from 'next/link'
import VolumeConverterClient from './VolumeConverterClient'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Volume Converter — Liters, Gallons, Cups, ml & More | RoughTools',
  description: 'Convert volume units instantly. Supports liters, US gallons, UK gallons, milliliters, cups, pints, quarts, cubic meters, and cubic feet. Free online volume converter.',
  keywords: ['volume converter', 'liters to gallons', 'gallons to liters', 'ml to cups', 'cubic feet to liters', 'volume unit converter'],
  alternates: { canonical: 'https://roughtools.com/tools/converters/volume-converter' },
  openGraph: {
    title: `Volume Converter — Liters, Gallons, Cups, Fluid Oz | RoughTools`,
    description: `Convert volume units: liters, gallons, milliliters, cups, and fluid ounces. Free online volume unit converter tool.`,
    url: 'https://roughtools.com/tools/converters/volume-converter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Volume Converter — Liters, Gallons, Cups, Fluid Oz | RoughTools`,
    description: `Convert volume units: liters, gallons, milliliters, cups, and fluid ounces. Free online volume unit converter tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this volume converter free to use?',
    a: 'Yes, the RoughTools Volume Converter is completely free with no account, subscription, or payment required. You can convert between liters, milliliters, US gallons, UK gallons, cups, pints, quarts, cubic meters, and cubic feet as many times as needed at no cost. RoughTools is funded through non-intrusive advertising, keeping every converter permanently free. There are no usage limits, no premium units behind a paywall, and no registration required.'
  },
  {
    q: 'Do I need to sign up to convert volume measurements?',
    a: 'No account, email address, or registration is required. Enter a value and select your source unit — the converter instantly shows the equivalent in all supported volume units simultaneously. There is no login wall, no upgrade required, and no data stored about your conversions. The converter is entirely anonymous and can be used unlimited times without any sign-up process, whether you are converting cooking measurements or industrial volumes.'
  },
  {
    q: 'Does this tool store the volume values I enter?',
    a: 'No. All conversions run entirely within your browser using JavaScript. The values you enter are never transmitted to RoughTools servers, never logged, and never shared with any third party. Once you close the browser tab, all data is gone. Your measurements remain completely private — whether you are converting recipe quantities, fuel volumes, tank capacities, or scientific solution volumes.'
  },
  {
    q: 'Does this volume converter work on mobile and tablet?',
    a: 'Yes, the converter is fully responsive and works on all modern smartphones and tablets. All input fields and results are optimised for touch screens. This is particularly useful in the kitchen when following a recipe that uses different units — for example, a US recipe with cups when you measure in milliliters — or when comparing fuel efficiency specifications quoted in different volume units from different countries.'
  },
  {
    q: 'Which browsers support this volume converter?',
    a: 'The Volume Converter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The converter uses standard JavaScript arithmetic that runs natively in every current browser. Any current version of Chrome, Firefox, or Safari on desktop or mobile is fully supported.'
  },
  {
    q: 'How accurate are the volume conversions?',
    a: 'All conversion factors are based on exact international definitions. One US gallon is exactly 231 cubic inches. One UK imperial gallon is exactly 4.54609 liters. One liter is exactly one cubic decimeter (1,000 cm³). One US cup is exactly 236.5882365 mL. One cubic foot is exactly 28.316846592 liters. These exact definitions ensure all conversions are mathematically precise to floating-point accuracy — well beyond any practical cooking or engineering requirement.'
  },
  {
    q: 'Can I use this volume converter offline?',
    a: 'Once the page has fully loaded in your browser, all conversions run in JavaScript without requiring an active internet connection. You can enter volume values and see all unit conversions offline after the initial page load. This is useful in the kitchen, in industrial settings, or when studying in locations with poor connectivity. The initial page load requires internet access, but after that the converter functions entirely client-side.'
  },
  {
    q: 'How do I convert volume units step by step?',
    a: 'To convert a volume: (1) Enter the numeric value in the input field. (2) Select the source unit — for example, US Gallons. (3) The results panel instantly shows the equivalent in all other supported units simultaneously: liters, milliliters, UK gallons, cups, pints, quarts, cubic meters, and cubic feet. Results update in real time as you type. This is especially useful for recipe scaling, where you need to see a volume in multiple formats at once.'
  },
  {
    q: 'Why should I use RoughTools instead of a search engine for volume conversion?',
    a: 'Search engines convert between one pair of volume units at a time. RoughTools Volume Converter shows all supported units simultaneously in one view — enter a value in any unit and all others update instantly. This is far more efficient in the kitchen or when working with international specifications, where you regularly need to cross-reference US customary, metric, and imperial measurements all at once without multiple separate searches.'
  },
  {
    q: 'How do I report a bug or request a new volume unit?',
    a: 'To report a bug or request an additional unit — such as tablespoons, teaspoons, fluid ounces, barrels (oil or beer), drams, or cubic centimeters — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the value and unit you entered, the browser and OS, and the incorrect result versus what you expected. Feature requests for cooking-specific units or industry-specific volume standards are reviewed and prioritised regularly.'
  },
  {
    q: 'How many liters are in a US gallon versus a UK gallon?',
    a: 'One US gallon equals exactly 3.785411784 liters. One UK imperial gallon equals exactly 4.54609 liters. The UK gallon is approximately 20% larger than the US gallon. This difference is important when converting fuel economy figures: a car rated at 40 mpg in the UK would be rated at approximately 33 mpg in the US because US gallons are smaller. When reading fuel efficiency or recipe conversions, always check which type of gallon is being used to avoid significant errors.'
  },
  {
    q: 'What is the difference between a US cup and a UK cup for cooking?',
    a: 'A US cup is exactly 236.588 mL (one-sixteenth of a US gallon). A UK metric cup is 250 mL. A UK imperial cup (now largely obsolete) was approximately 284 mL. For most recipes, the 6% difference between a US cup (236.6 mL) and a metric cup (250 mL) is not significant, but for precise baking it can matter. When converting between US and UK recipes, always check which cup size is intended. This converter uses the US customary cup (236.588 mL) as the standard.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Unit Converters', item: 'https://roughtools.com/tools/converters' },
      { '@type': 'ListItem', position: 3, name: 'Volume Converter', item: 'https://roughtools.com/tools/converters/volume-converter' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Volume Converter',
    url: 'https://roughtools.com/tools/converters/volume-converter',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online volume converter tool by RoughTools.',
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
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">Volume Converter</h1>
          <span className="ml-auto text-xs bg-violet-50 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 px-2 py-0.5 rounded-full">🧪 liters · gallons · cups</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/60 dark:to-purple-900/60 border-b border-violet-200/30 dark:border-violet-800/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Liters', 'US Gallons', 'UK Gallons', 'Cups', 'Pints', 'Cubic Feet', 'Free'].map(b => (
              <span key={b} className="text-xs bg-violet-50 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Volume Converter</h2>
          <p className="text-violet-700 dark:text-violet-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">
            Convert between all major volume units instantly — liters, milliliters, US gallons, UK imperial gallons, cups, pints, quarts, cubic meters, and cubic feet. Results update in real time showing all units simultaneously. Essential for cooking, fuel calculations, tank sizing, and scientific work. Includes both US and UK gallon/pint standards — important because US and UK units of the same name differ significantly in size.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white dark:bg-[#12121f] border border-gray-200 dark:border-purple-900/20 rounded-2xl p-1" data-print-section="calculator">
          <VolumeConverterClient />
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <PDFExportButton toolName="Volume Converter" />
        </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '⚡', title: 'Real-Time', desc: 'All units update instantly as you type' },
            { icon: '🇺🇸🇬🇧', title: 'US & UK', desc: 'Both US customary and UK imperial standards included' },
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
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Reference: Common Volume Conversions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {[
              ['1 US gallon', '= 3.785 liters'],
              ['1 UK gallon', '= 4.546 liters'],
              ['1 US cup', '= 236.6 mL'],
              ['1 liter', '= 4.227 US cups'],
              ['1 US pint', '= 473.2 mL'],
              ['1 UK pint', '= 568.3 mL'],
              ['1 cubic foot', '= 28.32 liters'],
              ['1 cubic meter', '= 1,000 liters'],
              ['1 quart', '= 0.946 liters'],
            ].map(([from, to]) => (
              <div key={from} className="flex justify-between items-center p-2.5 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">{from}</span>
                <span className="text-violet-600 dark:text-violet-400 font-mono text-xs">{to}</span>
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
                  <span className="text-violet-500 dark:text-violet-400 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/converters/speed-converter', label: '🚀 Speed' },
              { href: '/tools/converters/time-converter', label: '⏱️ Time' },
              { href: '/tools/converters/digital-storage-converter', label: '💾 Digital Storage' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-gray-700 dark:text-gray-300 hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Volume Converter"
          toolSlug="volume-converter"
          toolUrl="https://roughtools.com/tools/converters/volume-converter"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}

