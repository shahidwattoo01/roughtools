import type { Metadata } from 'next'
import Link from 'next/link'
import CapRateClient from './CapRateClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Cap Rate Calculator — Calculate Capitalization Rate for Rental Property',
  description: 'Calculate the capitalization rate (cap rate) for any investment property. Enter rental income and operating expenses to find your NOI and annual return rate.',
  keywords: ['cap rate calculator', 'capitalization rate', 'rental property calculator', 'NOI calculator', 'real estate investment return'],
  alternates: { canonical: 'https://roughtools.com/tools/real-estate/cap-rate-calculator' },
  openGraph: {
    title: `Cap Rate Calculator — Capitalization Rate Calculator | RoughTools`,
    description: `Calculate the capitalization rate (cap rate) for any rental property. Enter NOI and property value for instant results. Free tool.`,
    url: 'https://roughtools.com/tools/real-estate/cap-rate-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Cap Rate Calculator — Capitalization Rate Calculator | RoughTools`,
    description: `Calculate the capitalization rate (cap rate) for any rental property. Enter NOI and property value for instant results. Free tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this cap rate calculator free to use?',
    a: 'Yes, the RoughTools Cap Rate Calculator is completely free with no account, subscription, or payment required. You can calculate NOI and cap rate for unlimited properties — adjusting income, vacancy, taxes, insurance, maintenance, and management fees — at no cost. RoughTools is funded through non-intrusive advertising, keeping every calculator permanently free for real estate investors, landlords, and property analysts worldwide.'
  },
  {
    q: 'Do I need an account to calculate cap rate?',
    a: 'No account, email, or registration is required. Enter the property value, rental income, and operating expenses, then click Calculate. Your cap rate, NOI, and gross yield appear instantly. There is no paywall on any output, no upgrade required to see the full expense breakdown, and no data about your properties is stored anywhere. The calculator is completely anonymous and can be used as many times as needed without any sign-up process.'
  },
  {
    q: 'Is the property data I enter stored or shared?',
    a: 'No. All calculations run entirely within your browser using JavaScript. The property value, rental income, expense figures, and all other inputs are never transmitted to RoughTools servers, never logged, and never shared with third parties. Once you close the browser tab, the data is gone. You can model real investment properties and evaluate actual purchase opportunities with complete confidence that your financial analysis remains private.'
  },
  {
    q: 'Does this cap rate calculator work on mobile and tablet?',
    a: 'Yes, the calculator is fully responsive and works on all modern smartphones and tablets. Input fields, result displays, and rating indicators are all optimised for touch screens and small screen widths. This is useful when evaluating properties at open houses or investment showings — you can pull up the calculator on your phone, enter the numbers the agent provides, and immediately see whether the property meets your investment return requirements before making an offer.'
  },
  {
    q: 'Which browsers are supported?',
    a: 'The Cap Rate Calculator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The calculator uses standard JavaScript arithmetic that runs natively in every current browser. For the best experience with currency formatting and number display, any current version of Chrome, Firefox, or Safari on desktop or mobile is recommended.'
  },
  {
    q: 'How accurate is the cap rate calculation?',
    a: 'The calculation uses the standard formula: Cap Rate = Net Operating Income ÷ Property Value × 100. The NOI is calculated as: Effective Gross Income (gross rent minus vacancy) minus all operating expenses (taxes, insurance, maintenance, management, and other costs). This is the same formula used by commercial real estate appraisers and investment analysts. Accuracy depends on the quality of your input figures — use actual lease income and real expense data for the most reliable results.'
  },
  {
    q: 'Can I use this calculator offline?',
    a: 'Once the page has fully loaded in your browser, all calculations run in JavaScript without requiring an active internet connection. You can adjust property values, expenses, and income figures and view updated cap rate results offline. This is useful when evaluating properties in areas with poor mobile signal. The initial page load requires internet access, but after that the calculator functions entirely client-side for as long as the tab remains open.'
  },
  {
    q: 'How do I calculate cap rate step by step?',
    a: 'To calculate cap rate: (1) Enter the property value (purchase price or current market value). (2) Enter the annual gross rental income at full occupancy. (3) Set the vacancy rate — typically 5–10% for residential, higher for commercial. (4) Enter annual operating expenses: property taxes, insurance, maintenance budget, and property management percentage. (5) Add any other annual expenses. (6) Click Calculate Cap Rate. The tool shows your NOI, cap rate percentage, and gross yield, along with an investment quality rating.'
  },
  {
    q: 'Why should I use RoughTools instead of a basic cap rate formula?',
    a: 'The RoughTools Cap Rate Calculator separates each expense category so you can see the impact of each cost component on your NOI and cap rate. Many investors use simplified estimates and miss individual expense items, leading to an overestimate of cap rate that makes a poor investment look attractive. This calculator includes vacancy, property taxes, insurance, maintenance, management fees, and other costs separately — giving a more realistic and complete picture of actual cash flow and return.'
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'To report a bug or request a feature — such as cash-on-cash return, debt service coverage ratio (DSCR), gross rent multiplier (GRM), or multi-property comparison — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the inputs you used, the browser and OS, and the expected versus actual result. Feature requests for amortisation schedules, refinancing scenarios, and tax depreciation estimates are reviewed and prioritised regularly by the development team.'
  },
  {
    q: 'What is a good cap rate for a rental property?',
    a: 'Cap rate benchmarks vary by market and property type, but general guidelines are: 8% or above is considered excellent yield, typically found in secondary markets or higher-risk properties. 5–8% is good and typical for most suburban residential rental markets. 3–5% is average, common in high-cost urban markets like New York, San Francisco, or London where appreciation potential offsets lower current yield. Below 3% is below average and indicates minimal cash flow relative to property cost. There is no universal "good" cap rate — always compare against similar properties in the same market.'
  },
  {
    q: 'What is Net Operating Income (NOI) and how is it different from profit?',
    a: 'Net Operating Income (NOI) is the annual income from a property after deducting all operating expenses, but before deducting mortgage payments, income taxes, and depreciation. NOI = Effective Gross Income − Operating Expenses. It differs from profit in that it excludes debt service (mortgage principal and interest) — this makes NOI useful for comparing properties regardless of how they are financed. Cap rate is calculated from NOI, making it a financing-neutral measure of property return. Cash flow (actual profit) equals NOI minus annual mortgage payments.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Real Estate Tools', item: 'https://roughtools.com/tools/real-estate' },
      { '@type': 'ListItem', position: 3, name: 'Cap Rate Calculator', item: 'https://roughtools.com/tools/real-estate/cap-rate-calculator' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Cap Rate Calculator',
    url: 'https://roughtools.com/tools/real-estate/cap-rate-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online cap rate calculator tool by RoughTools.',
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
          <h1 className="font-bold dark:text-white text-gray-900 text-sm">Cap Rate Calculator</h1>
          <span className="ml-auto text-xs dark:bg-emerald-900/50 bg-emerald-100 dark:text-emerald-400 text-emerald-700 border dark:border-emerald-800 border-emerald-300 px-2 py-0.5 rounded-full">📊 NOI ÷ Property Value</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r dark:from-emerald-900/60 dark:to-green-900/60 from-emerald-50 to-green-50 border-b dark:border-emerald-800/30 border-emerald-200">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['NOI Calculation', 'Vacancy Rate', 'Operating Expenses', 'Investment Grade Rating', 'Free'].map(b => (
              <span key={b} className="text-xs dark:bg-emerald-900/50 bg-emerald-100 dark:text-emerald-300 text-emerald-700 border dark:border-emerald-700/40 border-emerald-300 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-gray-900 mb-3">Cap Rate Calculator</h2>
          <p className="dark:text-emerald-200/80 text-emerald-900 text-sm sm:text-base leading-relaxed max-w-3xl">
            Calculate the capitalisation rate for any residential or commercial investment property. Cap rate is the most widely used metric in real estate investment for comparing property returns independent of financing — it tells you what your annual return would be if you paid cash. Enter the property value, gross rental income, vacancy rate, and all operating expenses to get an accurate NOI and cap rate, plus an investment grade rating based on standard market benchmarks. Use this to evaluate acquisition opportunities, compare properties, and set target return thresholds before investing.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-5">
            {[
              { icon: '🏠', label: 'Property Value' },
              { icon: '💰', label: 'Rental Income' },
              { icon: '📉', label: 'Vacancy Loss' },
              { icon: '💸', label: 'Operating Costs' },
              { icon: '📊', label: 'Cap Rate' },
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
          <CapRateClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🔒', title: 'Private', desc: 'Property data never leaves your browser' },
            { icon: '📐', title: 'Full NOI', desc: 'All expense categories included for accuracy' },
            { icon: '🏆', title: 'Grade Rating', desc: 'Instant investment quality assessment' },
          ].map(c => (
            <div key={c.title} className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold dark:text-white text-gray-900 text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Cap rate benchmarks */}
        <div className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-bold dark:text-white text-gray-900 mb-4">Cap Rate Benchmarks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { range: '8%+', label: 'Excellent', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-700/30', desc: 'High yield — secondary markets or higher risk' },
              { range: '5–8%', label: 'Good', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-700/30', desc: 'Typical for suburban residential rentals' },
              { range: '3–5%', label: 'Average', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-700/30', desc: 'Common in high-cost urban markets' },
              { range: '<3%', label: 'Below Avg', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700/30', desc: 'Minimal cash flow — appreciation play' },
            ].map(b => (
              <div key={b.range} className={`${b.bg} border ${b.border} rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-extrabold ${b.color}`}>{b.range}</div>
                <div className={`text-sm font-bold ${b.color} mt-1`}>{b.label}</div>
                <div className="text-gray-500 text-xs mt-1 leading-snug">{b.desc}</div>
              </div>
            ))}
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
                  <span className="text-emerald-400 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/real-estate/rental-yield-calculator', label: '🏘️ Rental Yield' },
              { href: '/tools/real-estate/rent-vs-buy-calculator', label: '⚖️ Rent vs Buy' },
              { href: '/tools/real-estate/home-value-estimator', label: '🏠 Home Value' },
              { href: '/tools/real-estate/property-tax-calculator', label: '🏛️ Property Tax' },
              { href: '/tools/real-estate/home-affordability-calculator', label: '💰 Affordability' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm dark:bg-gray-800 bg-gray-100 border dark:border-gray-700 border-gray-300 rounded-full px-4 py-1.5 dark:text-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="Cap Rate Calculator"
          toolSlug="cap-rate-calculator"
          toolUrl="https://roughtools.com/tools/real-estate/cap-rate-calculator"
          type="financial"

        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
