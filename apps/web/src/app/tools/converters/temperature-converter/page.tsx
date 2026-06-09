import type { Metadata } from 'next'
import Link from 'next/link'
import TemperatureConverterClient from './TemperatureConverterClient'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Temperature Converter — Celsius, Fahrenheit, Kelvin & Rankine | RoughTools',
  description: 'Instantly convert temperatures between Celsius, Fahrenheit, Kelvin, and Rankine. Free online temperature converter with real-time results and conversion formulas.',
  keywords: ['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin converter', 'temperature conversion'],
  alternates: { canonical: 'https://roughtools.com/tools/converters/temperature-converter' },
  openGraph: {
    title: `Temperature Converter — Celsius, Fahrenheit, Kelvin | RoughTools`,
    description: `Convert temperatures between Celsius, Fahrenheit, Kelvin, and Rankine instantly. Free online temperature converter tool.`,
    url: 'https://roughtools.com/tools/converters/temperature-converter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Temperature Converter — Celsius, Fahrenheit, Kelvin | RoughTools`,
    description: `Convert temperatures between Celsius, Fahrenheit, Kelvin, and Rankine instantly. Free online temperature converter tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this temperature converter free to use?',
    a: 'Yes, the RoughTools Temperature Converter is completely free with no account, subscription, or payment required. You can convert between Celsius, Fahrenheit, Kelvin, and Rankine as many times as needed at no cost. RoughTools is funded through non-intrusive advertising, keeping every converter permanently free. There are no usage limits, no premium scales behind a paywall, and no registration of any kind required to use the full converter.'
  },
  {
    q: 'Do I need to sign up to convert temperatures?',
    a: 'No account, email address, or registration is required. Enter a temperature value and the converter instantly shows the equivalent in all other supported scales simultaneously. There is no login wall and no data stored about your conversions. The converter is entirely anonymous — your temperature lookups remain completely private, whether you are checking a fever, calibrating an oven, or working on a thermodynamics problem.'
  },
  {
    q: 'Does this tool store the temperature values I enter?',
    a: 'No. All conversions run entirely within your browser using JavaScript. The values you enter are never transmitted to RoughTools servers, never logged, and never shared with any third party. Once you close the browser tab, all data is gone. Your calculations remain completely private throughout every session.'
  },
  {
    q: 'Does the temperature converter work on mobile and tablet?',
    a: 'Yes, the converter is fully responsive and works on all modern smartphones and tablets. All input fields and the multi-scale results display are optimised for touch screens. This is useful when following a recipe that uses a different temperature scale, checking medical temperature references, or looking up industrial process temperatures on the go from your phone or tablet.'
  },
  {
    q: 'Which browsers support this temperature converter?',
    a: 'The Temperature Converter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The converter uses standard JavaScript arithmetic that runs natively in every current browser. Any current version of Chrome, Firefox, or Safari on desktop or mobile is fully supported.'
  },
  {
    q: 'How accurate are the temperature conversions?',
    a: 'The conversions use the exact mathematical formulas defined by the International System of Units. The relationship between Celsius and Kelvin is exact: K = °C + 273.15. The Fahrenheit conversion is exact: °F = °C × (9/5) + 32. Rankine is defined as °R = °F + 459.67. All conversions are mathematically precise to the limits of standard floating-point arithmetic, providing accuracy far beyond any practical measurement requirement.'
  },
  {
    q: 'Can I use this temperature converter offline?',
    a: 'Once the page has fully loaded in your browser, all conversions run in JavaScript without requiring an active internet connection. You can enter temperatures and see all scale conversions offline after the initial page load. This is useful when reviewing lab data, working in the kitchen, or checking process temperatures in locations with poor connectivity. The initial page load requires internet access, but after that the converter functions entirely client-side.'
  },
  {
    q: 'How do I convert a temperature step by step?',
    a: 'To convert a temperature: (1) Enter the numeric value in the input field. (2) Select the source scale — Celsius, Fahrenheit, Kelvin, or Rankine. (3) The results panel instantly shows the equivalent value in all three other scales simultaneously. Results update in real time as you type, so there is no need to press a calculate button. You can read off all four scales at once, which is especially useful when working across metric and imperial contexts.'
  },
  {
    q: 'Why should I use RoughTools instead of a search engine for temperature conversion?',
    a: 'Search engines convert between one pair of temperature scales at a time. RoughTools Temperature Converter shows all four scales simultaneously in a single view — enter a value in any scale and immediately see all others updated. This is far more efficient when you need to cross-reference Celsius, Fahrenheit, and Kelvin at the same time, such as when reading scientific literature that uses Kelvin alongside everyday references that use Celsius or Fahrenheit.'
  },
  {
    q: 'How do I report a bug or request a new temperature scale?',
    a: 'To report a bug or request an additional scale — such as Delisle, Newton, Réaumur, or Rømer — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the input value and scale you selected, the browser and OS, and the incorrect result versus what you expected. Feature requests are reviewed and prioritised regularly by the development team.'
  },
  {
    q: 'How do I convert Celsius to Fahrenheit manually?',
    a: 'The formula is: °F = (°C × 9/5) + 32. For example, 100°C × 1.8 + 32 = 212°F (boiling point of water). For quick mental estimation, double the Celsius temperature and add 30 — this gives an approximate Fahrenheit value within a few degrees for typical everyday temperatures. For example, 20°C → 20 × 2 + 30 = 70°F (actual is 68°F). The reverse formula is: °C = (°F − 32) × 5/9.'
  },
  {
    q: 'What is absolute zero and why does it matter?',
    a: 'Absolute zero is the lowest possible temperature — the point at which all molecular and atomic motion ceases. It equals 0 Kelvin, −273.15°C, or −459.67°F. No temperature below absolute zero can exist. The Kelvin scale starts at absolute zero specifically so that thermodynamic calculations work cleanly — doubling the Kelvin temperature truly doubles the thermal energy of a system. Scientists use Kelvin for this reason: 200 K has exactly twice the thermal energy of 100 K, whereas you cannot say the same about 200°C versus 100°C.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Unit Converters', item: 'https://roughtools.com/tools/converters' },
      { '@type': 'ListItem', position: 3, name: 'Temperature Converter', item: 'https://roughtools.com/tools/converters/temperature-converter' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Temperature Converter',
    url: 'https://roughtools.com/tools/converters/temperature-converter',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online temperature converter tool by RoughTools.',
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
          <h1 className="font-bold text-white text-sm">Temperature Converter</h1>
          <span className="ml-auto text-xs bg-orange-900/50 text-orange-400 border border-orange-800 px-2 py-0.5 rounded-full">🌡️ °C · °F · K · °R</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-900/60 to-red-900/60 border-b border-orange-800/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Celsius', 'Fahrenheit', 'Kelvin', 'Rankine', 'All Scales at Once', 'Free'].map(b => (
              <span key={b} className="text-xs bg-orange-900/50 text-orange-300 border border-orange-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Temperature Converter</h2>
          <p className="text-orange-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">
            Convert instantly between all four major temperature scales — Celsius, Fahrenheit, Kelvin, and Rankine. Results update in real time, showing all four scales simultaneously so you can cross-reference cooking temperatures, medical ranges, scientific values, and engineering specifications in one view. Uses the exact mathematical definitions: K = °C + 273.15 and °F = (°C × 9/5) + 32, ensuring precision across all conversions.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#12121f] border border-purple-900/20 rounded-2xl p-1">
          <TemperatureConverterClient />
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <PDFExportButton toolName="Temperature Converter" />
        </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '⚡', title: 'Real-Time', desc: 'All 4 scales update instantly as you type' },
            { icon: '📐', title: 'Exact Formulas', desc: 'Uses the official SI definition for each scale' },
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
          <h2 className="text-base font-bold text-white mb-4">Key Temperature Reference Points</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Reference Point', '°C', '°F', 'K'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-gray-500 font-semibold text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {[
                  ['Absolute zero', '−273.15', '−459.67', '0'],
                  ['Water freezes', '0', '32', '273.15'],
                  ['Room temperature', '20', '68', '293.15'],
                  ['Body temperature', '37', '98.6', '310.15'],
                  ['Water boils', '100', '212', '373.15'],
                  ['Oven (moderate)', '180', '356', '453.15'],
                ].map(([label, c, f, k]) => (
                  <tr key={label} className="border-b border-gray-800/50">
                    <td className="py-2 px-3 text-white font-medium text-xs">{label}</td>
                    <td className="py-2 px-3 font-mono text-xs">{c}</td>
                    <td className="py-2 px-3 font-mono text-xs">{f}</td>
                    <td className="py-2 px-3 font-mono text-xs">{k}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-800/50 hover:bg-gray-800 transition-colors">
                  <h3 className="text-sm font-semibold text-white text-left pr-4">{faq.q}</h3>
                  <span className="text-orange-400 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/converters/area-converter', label: '📐 Area' },
              { href: '/tools/converters/volume-converter', label: '🧪 Volume' },
              { href: '/tools/converters/speed-converter', label: '🚀 Speed' },
              { href: '/tools/converters/time-converter', label: '⏱️ Time' },
              { href: '/tools/converters/digital-storage-converter', label: '💾 Digital Storage' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-orange-500 hover:text-orange-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Temperature Converter"
          toolSlug="temperature-converter"
          toolUrl="https://roughtools.com/tools/converters/temperature-converter"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
