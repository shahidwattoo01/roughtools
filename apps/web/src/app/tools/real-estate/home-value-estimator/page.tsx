import type { Metadata } from 'next'
import Link from 'next/link'
import HomeValueClient from './HomeValueClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Home Value Estimator — Estimate Your Current Property Value',
  description: "Estimate your home's current market value based on purchase price, annual appreciation rate, property condition, and years owned. Free instant home value calculator.",
  keywords: ['home value estimator', 'property value calculator', 'how much is my home worth', 'house value estimate', 'home appreciation calculator'],
  alternates: { canonical: 'https://roughtools.com/tools/real-estate/home-value-estimator' },
  openGraph: {
    title: `Home Value Estimator — Estimate Property Value | RoughTools`,
    description: `Estimate your home's current market value using compound appreciation. Free online home value and equity estimator tool.`,
    url: 'https://roughtools.com/tools/real-estate/home-value-estimator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Home Value Estimator — Estimate Property Value | RoughTools`,
    description: `Estimate your home's current market value using compound appreciation. Free online home value and equity estimator tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this home value estimator free to use?',
    a: 'Yes, the RoughTools Home Value Estimator is completely free with no account, subscription, or payment required. You can run unlimited home value estimates for any property at no cost. RoughTools is funded through non-intrusive advertising, keeping every calculator permanently free. There are no usage limits, no premium scenarios requiring payment, and no registration of any kind needed to access the full calculation and result.'
  },
  {
    q: 'Do I need to sign up to estimate my home value?',
    a: 'No account, email address, or registration is required. Enter your purchase price, annual appreciation rate, and years owned — your estimated current value appears instantly. There is no login wall, no upgrade required to see the result, and no data stored about your property or finances. The tool is entirely anonymous and can be used as many times as needed without any sign-up process.'
  },
  {
    q: 'Is the property information I enter kept private?',
    a: 'Yes. All calculations run entirely within your browser using JavaScript. The purchase price, appreciation rate, and all other inputs you enter are never transmitted to RoughTools servers, never logged, and never shared with any third party. Once you close the browser tab, all data is gone. You can model the estimated value of any property — your own home or a property you are researching — with complete privacy.'
  },
  {
    q: 'Does the home value estimator work on mobile phones?',
    a: 'Yes, the estimator is fully responsive and works on all modern smartphones and tablets. All input fields and result displays are optimised for touch screens. This is useful when browsing listings or attending open houses — enter the listing price and local appreciation rate to see whether the property looks undervalued or overvalued relative to historical market trends in that area, directly from your phone while on site.'
  },
  {
    q: 'Which browsers are compatible with this tool?',
    a: 'The Home Value Estimator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The calculator uses standard JavaScript arithmetic that runs natively in every current browser. For the best experience with currency formatting and the appreciation range display, any current version of Chrome, Firefox, or Safari is recommended.'
  },
  {
    q: 'How accurate is this home value estimate?',
    a: 'This is a model-based estimate using compound appreciation — not a formal appraisal. The accuracy depends on how well the assumed annual appreciation rate reflects actual local market conditions for the specific property type and neighbourhood. National average appreciation has historically been around 3–5% per year, but local markets vary enormously. For a legally credible valuation — required for refinancing, estate planning, tax appeals, or sale pricing — you need a formal appraisal by a licensed appraiser or a comparative market analysis (CMA) from a local real estate agent.'
  },
  {
    q: 'Can I use this estimator without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all calculations run in JavaScript without requiring an active internet connection. You can adjust purchase price, appreciation rate, and years owned and view updated estimates offline. This is useful when reviewing property documents or researching investment properties away from reliable internet access. The initial page load requires internet access, but after that the estimator functions entirely client-side.'
  },
  {
    q: 'How do I estimate my home value step by step?',
    a: 'To estimate your home value: (1) Enter the original purchase price of the property. (2) Set the annual appreciation rate — use your local market average (typically 3–5% nationally, higher in strong markets, lower in flat markets). (3) Enter the number of years since purchase. (4) Adjust for property condition if the tool supports it — excellent condition adds value, poor condition reduces it. (5) Click Calculate. The tool shows the estimated current value using compound appreciation, along with a range to account for market variability above and below the central estimate.'
  },
  {
    q: 'Why should I use RoughTools instead of Zillow or Redfin estimates?',
    a: 'Zillow Zestimates and Redfin Estimates are data-driven models requiring property addresses and access to MLS sales data. They are powerful but not always available for every property, can vary widely from actual values, and require you to submit your address to their platform. RoughTools Home Value Estimator is a manual calculation tool that lets you model appreciation scenarios without providing an address, keeping your research private. It is particularly useful for hypothetical scenarios: "If I bought at $350k five years ago and appreciation was 4%, what is it worth now?"'
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'To report a bug or suggest a feature — such as renovation value-add modelling, price-per-square-foot analysis, comparison with local appreciation rates, or historical appreciation chart visualisation — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the inputs you used, the browser and OS, and the expected versus actual result. Feature requests for equity calculation (value minus remaining mortgage) or combined net worth modelling are reviewed and prioritised regularly.'
  },
  {
    q: 'What factors affect home value most significantly?',
    a: 'The most significant factors affecting home value are location (neighbourhood desirability, school district quality, proximity to amenities and employment), recent comparable sales in the immediate area, the size and condition of the property (square footage, number of bedrooms and bathrooms, updates and renovations), the current interest rate environment (higher rates suppress prices by reducing buyer purchasing power), and local supply and demand dynamics (low inventory pushes prices up; oversupply depresses them). Macroeconomic factors like employment growth and population trends in the region also play a major long-term role.'
  },
  {
    q: 'What is compound appreciation and how is it applied to home values?',
    a: 'Compound appreciation means the property\'s value grows by the appreciation percentage each year based on the current value — not the original value. For example, a $300,000 home appreciating at 4% annually is worth $312,000 after year one, then $324,480 after year two (4% of $312,000, not $300,000). Over 10 years at 4%, the value reaches approximately $444,000 — a 48% increase from the original price. This is the same mathematics as compound interest, and over long periods creates significant wealth accumulation for homeowners in growing markets.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Real Estate Tools', item: 'https://roughtools.com/tools/real-estate' },
      { '@type': 'ListItem', position: 3, name: 'Home Value Estimator', item: 'https://roughtools.com/tools/real-estate/home-value-estimator' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Home Value Estimator',
    url: 'https://roughtools.com/tools/real-estate/home-value-estimator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online home value estimator tool by RoughTools.',
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
          <h1 className="font-bold dark:text-white text-gray-900 text-sm">Home Value Estimator</h1>
          <span className="ml-auto text-xs bg-violet-900/50 text-violet-400 border border-violet-800 px-2 py-0.5 rounded-full">🏠 Compound Appreciation</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r dark:from-violet-900/60 dark:to-purple-900/60 from-violet-50 to-purple-50 border-b dark:border-violet-800/30 border-violet-200">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Compound Appreciation', 'Value Range', 'Condition Adjustment', 'Equity Estimate', 'Free'].map(b => (
              <span key={b} className="text-xs dark:bg-violet-900/50 bg-violet-100 dark:text-violet-300 text-violet-700 border dark:border-violet-700/40 border-violet-300 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-gray-900 mb-3">Home Value Estimator</h2>
          <p className="text-violet-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">
            Estimate the current market value of any home based on its purchase price, annual appreciation rate, and how long it has been owned. Using compound appreciation — the same mathematics used by professional appraisers for trend modelling — this calculator gives you a realistic estimate range of your home's current worth. Use it to gauge how much equity you have built, plan a refinancing decision, estimate inheritance value, or evaluate a potential investment property without needing to provide an address to a third-party valuation platform.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-5">
            {[
              { icon: '💰', label: 'Purchase Price' },
              { icon: '📈', label: 'Annual Rate' },
              { icon: '📅', label: 'Years Owned' },
              { icon: '🏠', label: 'Current Value' },
              { icon: '💵', label: 'Value Gained' },
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
          <HomeValueClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🔒', title: 'Private', desc: 'No address required — completely anonymous' },
            { icon: '📈', title: 'Compound Math', desc: 'Accurate compound appreciation formula' },
            { icon: '🆓', title: 'Free Forever', desc: 'No account, paywall, or limits' },
          ].map(c => (
            <div key={c.title} className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold dark:text-white text-gray-900 text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Appreciation rates reference */}
        <div className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-bold dark:text-white text-gray-900 mb-4">Historical Home Appreciation Rate Reference</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { scenario: 'US National Average (long-term)', rate: '3.0% – 4.5%', note: 'Historical average since 1990' },
              { scenario: 'High-growth coastal markets', rate: '5.0% – 8.0%', note: 'NYC, SF, LA, Miami in bull markets' },
              { scenario: 'Stable suburban markets', rate: '2.5% – 4.0%', note: 'Consistent but not spectacular' },
              { scenario: 'Flat or declining markets', rate: '0% – 2.0%', note: 'Rust belt or oversupplied markets' },
            ].map(r => (
              <div key={r.scenario} className="p-3 bg-gray-800/50 rounded-xl">
                <div className="text-white font-medium text-xs">{r.scenario}</div>
                <div className="text-violet-400 font-bold mt-1">{r.rate}</div>
                <div className="text-gray-500 text-xs mt-0.5">{r.note}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-3">For the most accurate local rate, consult your county assessor&apos;s records or a local real estate agent&apos;s recent CMA.</p>
        </div>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border dark:border-gray-800 border-gray-200 rounded-xl overflow-hidden dark:bg-gray-900 bg-white">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none dark:bg-gray-800/50 bg-gray-50 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors">
                  <h3 className="text-sm font-semibold dark:text-white text-gray-900 text-left pr-4">{faq.q}</h3>
                  <span className="text-violet-400 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/real-estate/rental-yield-calculator', label: '🏘️ Rental Yield' },
              { href: '/tools/real-estate/rent-vs-buy-calculator', label: '⚖️ Rent vs Buy' },
              { href: '/tools/real-estate/property-tax-calculator', label: '🏛️ Property Tax' },
              { href: '/tools/real-estate/home-affordability-calculator', label: '💰 Affordability' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-violet-500 hover:text-violet-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="Home Value Estimator"
          toolSlug="home-value-estimator"
          toolUrl="https://roughtools.com/tools/real-estate/home-value-estimator"
          type="financial"

        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
