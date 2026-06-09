import type { Metadata } from 'next'
import Link from 'next/link'
import RentalYieldClient from './RentalYieldClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Rental Yield Calculator — Gross & Net Rental Yield for Investment Property',
  description: 'Calculate gross and net rental yield for buy-to-let investment properties. See full expense breakdown and determine if a rental property generates a strong return.',
  keywords: ['rental yield calculator', 'gross rental yield', 'net rental yield', 'buy to let calculator', 'property investment ROI'],
  alternates: { canonical: 'https://roughtools.com/tools/real-estate/rental-yield-calculator' },
  openGraph: {
    title: `Rental Yield Calculator — Gross & Net Rental Return | RoughTools`,
    description: `Calculate gross and net rental yield for any investment property. Free online rental yield and return calculator tool.`,
    url: 'https://roughtools.com/tools/real-estate/rental-yield-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Rental Yield Calculator — Gross & Net Rental Return | RoughTools`,
    description: `Calculate gross and net rental yield for any investment property. Free online rental yield and return calculator tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this rental yield calculator free to use?',
    a: 'Yes, the RoughTools Rental Yield Calculator is completely free with no account, subscription, or payment required. You can calculate gross and net rental yield for unlimited properties at no cost. RoughTools is funded through non-intrusive advertising, keeping every real estate calculator permanently free for landlords, property investors, and buy-to-let buyers worldwide. There are no usage limits, no premium features behind a paywall, and no signup of any kind required.'
  },
  {
    q: 'Do I need to sign up to calculate rental yield?',
    a: 'No account, email address, or registration is required. Enter the property price, annual rent, and operating expenses, and your gross and net rental yield are calculated instantly. There is no login wall, no session tracking, and no usage limit that requires an account to bypass. The tool is entirely anonymous — your property address, rental income, and financial details are never associated with any identity or profile.'
  },
  {
    q: 'Does this tool store the property data I enter?',
    a: 'No. All calculations run entirely within your browser using JavaScript. The property value, rental income, and expense figures you enter are never transmitted to RoughTools servers, never logged, and never shared with third parties. Once you close the browser tab, the data is gone. You can model real investment properties and evaluate actual acquisition opportunities with complete confidence that your analysis remains private and secure.'
  },
  {
    q: 'Does the rental yield calculator work on mobile phones?',
    a: 'Yes, the calculator is fully responsive and works on all modern smartphones and tablets. All input fields and result panels are optimised for touch screens. This is especially useful at property viewings or when browsing listings on your phone — enter the asking price and rental market rate on the spot to immediately see whether the yield meets your investment criteria. Results update instantly as you adjust inputs.'
  },
  {
    q: 'Which browsers support this rental yield calculator?',
    a: 'The calculator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins, extensions, or special settings are required. The calculator uses standard JavaScript that runs natively in every current browser. For the best experience with percentage formatting and currency display, any current version of Chrome, Firefox, or Safari is recommended.'
  },
  {
    q: 'How accurate is the rental yield calculation?',
    a: 'The calculation uses the standard industry formulas: Gross Yield = (Annual Rent ÷ Property Price) × 100, and Net Yield = ((Annual Rent − Annual Expenses) ÷ Property Price) × 100. These are mathematically precise given the inputs provided. Accuracy depends on how realistic your income and expense estimates are. For the most accurate result, use actual lease income and real expense data (obtained from the current landlord or a letting agent) rather than estimated figures.'
  },
  {
    q: 'Can I use this calculator without internet access?',
    a: 'Once the page has fully loaded in your browser, all calculations run in JavaScript without requiring an active internet connection. You can adjust inputs and view updated yield results entirely offline. This is useful when evaluating properties in locations with poor mobile signal. The initial page load requires internet access to download the page, but after that the calculator functions completely client-side for as long as the browser tab remains open.'
  },
  {
    q: 'How do I calculate rental yield step by step?',
    a: 'To calculate rental yield: (1) Enter the property purchase price or current market value. (2) Enter the annual gross rental income (monthly rent × 12). (3) Enter your annual operating expenses: property management fees, insurance, maintenance budget, and any other recurring costs. (4) Click Calculate. The tool shows your gross yield (before expenses), net yield (after expenses), and the annual and monthly net income. Compare net yield against similar properties and local market benchmarks to assess investment quality.'
  },
  {
    q: 'Why should I use RoughTools instead of a basic yield formula?',
    a: 'The RoughTools Rental Yield Calculator calculates both gross and net yield in one step, with a full expense breakdown that shows exactly how each cost component reduces your return. Many investors calculate only gross yield using a basic formula and are surprised by the much lower net yield when actual costs are included. This tool makes the difference between gross and net immediately visible, helping you make a more realistic investment decision rather than relying on headline gross figures that landlords and agents often quote.'
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'To report a bug or suggest a feature — such as mortgage financing scenarios, cash-on-cash return, capital gains projection, stamp duty inclusion, or multi-property portfolio summary — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the inputs you used, the browser and OS, and what you expected versus what appeared. Feature requests for letting agent fee presets, country-specific tax rates, or HMO calculations are reviewed and prioritised regularly.'
  },
  {
    q: 'What is a good rental yield for an investment property?',
    a: 'Rental yield benchmarks vary by country and market type. In the United Kingdom, a gross yield of 5–8% is generally considered strong for residential buy-to-let, with yields above 8% typically found in northern cities like Liverpool, Manchester, or Leeds. In the United States, a gross yield of 6–10% is common for single-family rentals in secondary markets. In high-cost cities (London, New York, Sydney), yields of 3–4% are common as investors accept lower current yield in exchange for capital appreciation. Always compare net yield — the figure after all expenses — as the meaningful performance metric.'
  },
  {
    q: 'What is the difference between gross and net rental yield?',
    a: 'Gross yield is calculated using total rental income before any expenses are deducted. It gives a quick top-level comparison between properties but overstates actual returns. Net yield deducts all operating expenses — property management fees, insurance, maintenance, void periods (vacancy), ground rent, service charges, and any other recurring costs — from rental income before dividing by property price. Net yield is a more honest and useful measure of actual investment performance. The gap between gross and net yield is typically 1.5–3 percentage points, depending on expense levels and management structure.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Real Estate Tools', item: 'https://roughtools.com/tools/real-estate' },
      { '@type': 'ListItem', position: 3, name: 'Rental Yield Calculator', item: 'https://roughtools.com/tools/real-estate/rental-yield-calculator' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Rental Yield Calculator',
    url: 'https://roughtools.com/tools/real-estate/rental-yield-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online rental yield calculator tool by RoughTools.',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }

  return (
    <div className="min-h-screen dark:bg-gray-950 bg-gray-50 dark:text-white text-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />

      {/* Breadcrumb nav */}
      <div className="dark:bg-gray-900 bg-white border-b dark:border-gray-800 border-gray-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/real-estate" className="text-sm dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-900 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Real Estate Tools
          </Link>
          <span className="dark:text-gray-700 text-gray-300">|</span>
          <h1 className="font-bold dark:text-white text-gray-900 text-sm">Rental Yield Calculator</h1>
          <span className="ml-auto text-xs dark:bg-green-900/50 bg-green-100 dark:text-green-400 text-green-700 border dark:border-green-800 border-green-300 px-2 py-0.5 rounded-full">🏘️ Gross & Net Yield</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-b border-green-800/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Gross Yield', 'Net Yield', 'Full Expense Breakdown', 'Buy-to-Let', 'Free'].map(b => (
              <span key={b} className="text-xs dark:bg-green-900/50 bg-green-100 dark:text-green-300 text-green-700 border dark:border-green-700/40 border-green-300 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-gray-900 mb-3">Rental Yield Calculator</h2>
          <p className="dark:text-green-200/80 text-green-900 text-sm sm:text-base leading-relaxed max-w-3xl">
            Calculate the gross and net rental yield for any buy-to-let or investment property. Rental yield is the annual rental income expressed as a percentage of the property's purchase price — the primary metric used by landlords and property investors to evaluate whether an investment property generates an acceptable return. This calculator shows both gross yield (before expenses) and net yield (after all operating costs), giving you a realistic picture of actual investment performance rather than the headline figure often quoted by vendors and letting agents.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-5">
            {[
              { icon: '🏠', label: 'Property Price' },
              { icon: '💰', label: 'Annual Rent' },
              { icon: '💸', label: 'Expenses' },
              { icon: '📊', label: 'Net Yield' },
              { icon: '💵', label: 'Monthly Income' },
            ].map(f => (
              <div key={f.label} className="dark:bg-gray-900/60 bg-white/80 border dark:border-gray-700/40 border-gray-200 rounded-xl p-3 text-center">
                <div className="text-lg mb-1">{f.icon}</div>
                <div className="text-xs dark:text-gray-400 text-gray-500 leading-tight">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Calculator */}
        <div className="dark:bg-[#0d0d1f] bg-white border dark:border-purple-900/30 border-purple-200 rounded-2xl p-1">
          <RentalYieldClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🔒', title: 'Private', desc: 'Property data never leaves your browser' },
            { icon: '📊', title: 'Gross + Net', desc: 'Both yield types calculated with full breakdown' },
            { icon: '🆓', title: 'Free Forever', desc: 'No account, paywall, or upgrade required' },
          ].map(c => (
            <div key={c.title} className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold dark:text-white text-gray-900 text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Yield formula */}
        <div className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-bold dark:text-white text-gray-900 mb-4">Gross vs Net Rental Yield Explained</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-green-400 font-semibold mb-2">Gross Yield</h3>
              <code className="text-white text-xs block bg-gray-900 rounded p-2 mb-2">(Annual Rent ÷ Property Price) × 100</code>
              <p className="text-gray-500 text-xs">Before expenses. Used for quick comparisons. Typically quoted by agents and vendors. Always higher than net yield.</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-emerald-400 font-semibold mb-2">Net Yield</h3>
              <code className="text-white text-xs block bg-gray-900 rounded p-2 mb-2">((Annual Rent − Expenses) ÷ Property Price) × 100</code>
              <p className="text-gray-500 text-xs">After all operating costs. The realistic performance metric. The gap between gross and net is typically 1.5–3 percentage points.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border dark:border-gray-800 border-gray-200 rounded-xl overflow-hidden dark:bg-gray-900 bg-white">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none dark:bg-gray-800/50 bg-gray-50 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors">
                  <h3 className="text-sm font-semibold dark:text-white text-gray-900 text-left pr-4">{faq.q}</h3>
                  <span className="text-green-400 font-bold text-lg flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-5 pt-3 text-sm dark:text-gray-400 text-gray-600 leading-relaxed border-t dark:border-gray-800 border-gray-200">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Related tools */}
        <div className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold dark:text-white text-gray-900 mb-3">Related Real Estate Calculators</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/tools/real-estate/cap-rate-calculator', label: '📊 Cap Rate' },
              { href: '/tools/real-estate/home-value-estimator', label: '🏠 Home Value' },
              { href: '/tools/real-estate/property-tax-calculator', label: '🏛️ Property Tax' },
              { href: '/tools/real-estate/rent-vs-buy-calculator', label: '⚖️ Rent vs Buy' },
              { href: '/tools/real-estate/home-affordability-calculator', label: '💰 Affordability' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-green-500 hover:text-green-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="Rental Yield Calculator"
          toolSlug="rental-yield-calculator"
          toolUrl="https://roughtools.com/tools/real-estate/rental-yield-calculator"
          type="financial"

        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
