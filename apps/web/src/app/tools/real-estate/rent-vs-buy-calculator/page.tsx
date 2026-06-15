import type { Metadata } from 'next'
import Link from 'next/link'
import RentVsBuyClient from './RentVsBuyClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Rent vs Buy Calculator — Is It Cheaper to Rent or Buy a Home?',
  description: 'Compare the true long-term cost of renting vs buying. Accounts for mortgage, home appreciation, rent increases, property taxes, maintenance, and investment returns on your down payment.',
  keywords: ['rent vs buy calculator', 'should I rent or buy', 'home buying calculator', 'rent or buy comparison', 'true cost of buying a home'],
  alternates: { canonical: 'https://roughtools.com/tools/real-estate/rent-vs-buy-calculator' },
  openGraph: {
    title: `Rent vs Buy Calculator — Should You Rent or Buy? | RoughTools`,
    description: `Compare the true costs of renting versus buying a home over time. Free online rent vs buy break-even calculator.`,
    url: 'https://roughtools.com/tools/real-estate/rent-vs-buy-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Rent vs Buy Calculator — Should You Rent or Buy? | RoughTools`,
    description: `Compare the true costs of renting versus buying a home over time. Free online rent vs buy break-even calculator.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is the Rent vs Buy Calculator free to use?',
    a: 'Yes, the RoughTools Rent vs Buy Calculator is completely free with no subscription, account, or payment required. You can run as many comparisons as you need — adjusting home price, mortgage rate, rent, appreciation rate, and time horizon — all at no cost. RoughTools is funded through non-intrusive advertising, which keeps every calculator permanently free for homebuyers, renters, and financial planners worldwide.'
  },
  {
    q: 'Do I need to sign up to use this calculator?',
    a: 'No account, email address, or registration is required. Open the page, enter your numbers, and click Calculate — results appear instantly. There is no paywall on any input or result, and no upgrade required to see the full comparison breakdown. All calculations run in your browser with no data transmitted to any server or stored in any database.'
  },
  {
    q: 'Does this calculator store or share the financial data I enter?',
    a: 'No. All calculations run entirely in your browser using JavaScript. The home price, income, mortgage rate, rent figures, and all other inputs you enter are never transmitted to RoughTools servers, never logged, and never shared with third parties. Once you close the tab, the data is gone. Your financial information remains completely private throughout the entire process.'
  },
  {
    q: 'Does this Rent vs Buy Calculator work on mobile and tablet?',
    a: 'Yes, the calculator is fully responsive and works on all modern smartphones and tablets running iOS 14+ or Android 8+. All input fields, sliders, and result panels are optimised for touch screens. The comparison chart and cost breakdown display clearly on smaller screens. This is particularly useful when you are at an open house and want to quickly compare your rental costs against buying the property you are viewing.'
  },
  {
    q: 'Which browsers support this calculator?',
    a: 'The Rent vs Buy Calculator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave — on both desktop and mobile. No plugins or extensions are required. The calculator uses standard JavaScript arithmetic that runs natively in every modern browser. For the best experience with number formatting and currency display, any current version of Chrome, Firefox, or Safari is recommended.'
  },
  {
    q: 'How accurate is the Rent vs Buy comparison?',
    a: 'The accuracy depends entirely on the quality of your inputs. The calculator uses standard amortisation formulas for mortgage payments and compound interest for investment returns — these are mathematically precise. The key uncertainties are future assumptions: home appreciation, rent increases, and investment returns. The tool provides a best-estimate scenario based on your inputs. For a financially consequential decision like buying a home, treat the results as a planning guide and consult a licensed financial adviser for a personalised analysis.'
  },
  {
    q: 'Can I use this calculator without an internet connection?',
    a: 'The calculator runs in your browser using JavaScript, so once the page has fully loaded, you can continue using it without an active internet connection. You can adjust inputs and recalculate results offline. However, the initial page load requires an internet connection to download the page assets. For fully offline use, you would need to save the page locally — but for most users, the page loads quickly and works seamlessly on any connection speed.'
  },
  {
    q: 'How do I use the Rent vs Buy Calculator step by step?',
    a: 'To run a comparison: (1) Enter the home price you are considering and your expected down payment percentage. (2) Set the mortgage interest rate and loan term (typically 30 years). (3) Enter estimated property tax rate and annual maintenance cost as a percentage of home value. (4) Enter your current or expected monthly rent and the annual rent increase percentage. (5) Set the expected annual return on investments — the opportunity cost of the down payment if you rented instead. (6) Click Calculate to see the 10-year net cost comparison for buying versus renting.'
  },
  {
    q: 'Why should I use RoughTools instead of other rent vs buy calculators?',
    a: 'RoughTools Rent vs Buy Calculator includes opportunity cost — the investment return you could earn on the down payment if you rented instead of buying. Many basic calculators ignore this critical factor, making buying appear cheaper than it truly is. This calculator also accounts for home appreciation reducing your net buy cost over time, and rent increases increasing your total rental cost. The result is a more complete and honest comparison of both options over your chosen time horizon.'
  },
  {
    q: 'How do I report a bug or suggest a new calculator feature?',
    a: 'To report a bug or request a feature — such as comparison graphs, tax deduction modelling, PMI inclusion, or state-specific tax rates — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the inputs you used, the browser and operating system, and what result you expected versus what was displayed. Feature requests for additional scenarios such as ARM mortgages, HOA fees, or rental income from owner-occupied properties are reviewed and prioritised regularly.'
  },
  {
    q: 'What is opportunity cost and why does it matter in this calculation?',
    a: 'Opportunity cost is the return you forgo by putting money into a down payment instead of investing it elsewhere. If you make a $80,000 down payment, that $80,000 cannot be invested in stocks, bonds, or other assets. Over 10–30 years, the compounded growth of that capital is significant. The Rent vs Buy Calculator models this by assuming the down payment would be invested at your specified annual return rate if you rented instead. This often makes renting financially competitive with buying, especially in high-price markets.'
  },
  {
    q: 'What does the net cost figure mean in the results?',
    a: 'The net cost figure represents your total financial outlay minus the value you received in return. For buying, it is total mortgage payments + property taxes + maintenance, minus the home equity you built (current home value minus remaining loan balance). For renting, it is total rent paid minus the investment growth of the down payment if it had been invested. A lower net cost means that option left you in a better financial position over the comparison period. The winner depends heavily on home appreciation, investment returns, and your time horizon.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Real Estate Tools', item: 'https://roughtools.com/tools/real-estate' },
      { '@type': 'ListItem', position: 3, name: 'Rent vs Buy Calculator', item: 'https://roughtools.com/tools/real-estate/rent-vs-buy-calculator' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Rent vs Buy Calculator',
    url: 'https://roughtools.com/tools/real-estate/rent-vs-buy-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online rent vs buy calculator tool by RoughTools.',
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
          <h1 className="font-bold dark:text-white text-gray-900 text-sm">Rent vs Buy Calculator</h1>
          <span className="ml-auto text-xs dark:bg-teal-900/50 bg-teal-100 dark:text-teal-400 text-teal-700 border dark:border-teal-800 border-teal-300 px-2 py-0.5 rounded-full">⚖️ 10-Year Comparison</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r dark:from-teal-900/60 dark:to-emerald-900/60 from-teal-50 to-emerald-50 border-b dark:border-teal-800/30 border-teal-200">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Opportunity Cost', 'Home Appreciation', 'Rent Increases', 'Investment Returns', 'Free'].map(b => (
              <span key={b} className="text-xs bg-teal-900/50 text-teal-300 border border-teal-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-gray-900 mb-3">Rent vs Buy Calculator</h2>
          <p className="dark:text-teal-200/80 text-teal-900 text-sm sm:text-base leading-relaxed max-w-3xl">
            Compare the true long-term financial cost of renting versus buying a home. Unlike simple mortgage calculators, this tool accounts for the full picture: mortgage amortisation, property taxes, maintenance costs, and home appreciation on the buy side — offset against rent payments, annual rent increases, and the compounded investment return on the down payment on the rent side. Enter your real numbers to find out which option makes more financial sense over your chosen time horizon.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-5">
            {[
              { icon: '🏠', label: 'Mortgage Costs' },
              { icon: '📈', label: 'Appreciation' },
              { icon: '💰', label: 'Opportunity Cost' },
              { icon: '🔢', label: 'Rent Inflation' },
              { icon: '🎯', label: 'Net Cost' },
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
          <RentVsBuyClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🔒', title: 'Private', desc: 'Your financial data never leaves your browser' },
            { icon: '⚡', title: 'Instant', desc: 'Results calculated in real time as you type' },
            { icon: '🆓', title: 'Free Forever', desc: 'No account, no paywall, no limits' },
          ].map(c => (
            <div key={c.title} className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold dark:text-white text-gray-900 text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* What's included */}
        <div className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-bold dark:text-white text-gray-900 mb-4">What&apos;s Included in the Comparison</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="text-teal-400 font-semibold mb-2">🏠 Buy Costs (deducted)</h3>
              <ul className="space-y-1 text-gray-400">
                <li>→ Monthly mortgage principal & interest</li>
                <li>→ Annual property taxes (rate × home value)</li>
                <li>→ Annual maintenance (% of home value)</li>
                <li>→ Initial down payment</li>
              </ul>
              <h3 className="text-teal-400 font-semibold mt-3 mb-2">↩ Buy Credits (added back)</h3>
              <ul className="space-y-1 text-gray-400">
                <li>← Home equity (value − loan balance)</li>
                <li>← Appreciated home value</li>
              </ul>
            </div>
            <div>
              <h3 className="text-emerald-400 font-semibold mb-2">🏢 Rent Costs (deducted)</h3>
              <ul className="space-y-1 text-gray-400">
                <li>→ Monthly rent (compounding annually)</li>
              </ul>
              <h3 className="text-emerald-400 font-semibold mt-3 mb-2">↩ Rent Credits (added back)</h3>
              <ul className="space-y-1 text-gray-400">
                <li>← Investment growth of down payment</li>
                <li>← Compounded returns over time horizon</li>
              </ul>
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
                  <span className="text-teal-400 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/real-estate/home-affordability-calculator', label: '💰 Home Affordability' },
              { href: '/tools/real-estate/down-payment-calculator', label: '💵 Down Payment' },
              { href: '/tools/real-estate/closing-costs-calculator', label: '🧾 Closing Costs' },
              { href: '/tools/real-estate/property-tax-calculator', label: '🏛️ Property Tax' },
              { href: '/tools/real-estate/rental-yield-calculator', label: '🏘️ Rental Yield' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-teal-500 hover:text-teal-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="Rent vs Buy Calculator"
          toolSlug="rent-vs-buy-calculator"
          toolUrl="https://roughtools.com/tools/real-estate/rent-vs-buy-calculator"
          type="financial"

        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
