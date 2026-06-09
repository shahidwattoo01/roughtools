import type { Metadata } from 'next'
import Link from 'next/link'
import ClosingCostsClient from './ClosingCostsClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Closing Costs Calculator — Estimate Home Buying & Selling Costs',
  description: 'Estimate all closing costs for home buyers and sellers. See a full breakdown of loan origination, title insurance, transfer taxes, prepaid items, and agent commissions.',
  keywords: ['closing costs calculator', 'home buying closing costs', 'seller closing costs', 'real estate closing fees', 'mortgage closing costs estimator'],
  alternates: { canonical: 'https://roughtools.com/tools/real-estate/closing-costs-calculator' },
  openGraph: {
    title: `Closing Costs Calculator — Estimate Home Closing Costs | RoughTools`,
    description: `Estimate home closing costs for buyers and sellers. Calculate transfer taxes, title insurance, and escrow fees. Free calculator.`,
    url: 'https://roughtools.com/tools/real-estate/closing-costs-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Closing Costs Calculator — Estimate Home Closing Costs | RoughTools`,
    description: `Estimate home closing costs for buyers and sellers. Calculate transfer taxes, title insurance, and escrow fees. Free calculator.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this closing costs calculator free to use?',
    a: 'Yes, the RoughTools Closing Costs Calculator is completely free with no account, subscription, or payment required. You can estimate buyer and seller closing costs for any home purchase price at no cost. RoughTools is funded through non-intrusive advertising, keeping every real estate calculator permanently free. There are no usage limits, no premium breakdowns behind a paywall, and no registration required to access the full itemised cost estimate.'
  },
  {
    q: 'Do I need to sign up to estimate closing costs?',
    a: 'No account, email address, or registration is required. Enter the home purchase price, loan amount, and transaction details, and your estimated closing costs appear instantly with a full itemised breakdown. There is no login wall, no upgrade required to see individual line items, and no data stored about your transaction. The tool is entirely anonymous and can be used as many times as needed without any sign-up process.'
  },
  {
    q: 'Is the transaction data I enter kept private?',
    a: 'Yes. All calculations run entirely within your browser using JavaScript. The home price, loan amount, and all other details you enter are never transmitted to RoughTools servers, never logged, and never shared with lenders, real estate agents, or third-party data brokers. Once you close the browser tab, all data is gone. You can model any transaction with complete confidence that your financial planning remains private.'
  },
  {
    q: 'Does this closing costs calculator work on mobile?',
    a: 'Yes, the calculator is fully responsive and works on all modern smartphones and tablets. All input fields and the itemised cost breakdown are optimised for touch screens and small display sizes. This is particularly useful when you are at a property showing or meeting with a real estate agent and want to quickly estimate the total cash needed to close — beyond just the down payment — for a property you are seriously considering.'
  },
  {
    q: 'Which browsers support this closing costs calculator?',
    a: 'The calculator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The calculator uses standard JavaScript that runs natively in every current browser. For the best experience with currency formatting and the itemised breakdown display, any current version of Chrome, Firefox, or Safari on desktop or mobile is recommended.'
  },
  {
    q: 'How accurate are the closing cost estimates?',
    a: 'The estimates are based on standard industry percentage ranges for each closing cost component. Actual costs vary by state, county, lender, and transaction specifics. Transfer taxes range from 0% in some states to over 4% in others. Title insurance rates vary by state and purchase price. Lender fees vary by institution. The calculator provides a reliable planning estimate — typically within 10–20% of actual costs for most transactions. For a precise figure, request a Loan Estimate from your lender, which by law must be provided within three business days of submitting a mortgage application.'
  },
  {
    q: 'Can I use this calculator without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all calculations run in JavaScript without requiring an active internet connection. You can adjust home prices, loan amounts, and all parameters and view updated estimates offline. The initial page load requires internet access, but after that the calculator functions entirely client-side. This is useful when reviewing purchase agreements or meeting with buyers or sellers in locations without reliable internet access.'
  },
  {
    q: 'How do I estimate closing costs step by step?',
    a: 'To estimate closing costs: (1) Select whether you are estimating buyer costs, seller costs, or both. (2) Enter the home purchase price and loan amount (if applicable). (3) Enter the state where the property is located to get state-specific transfer tax estimates. (4) Review the itemised breakdown showing each fee category. (5) Adjust individual line items if you have actual quotes from lenders or service providers. (6) The total shows the full cash required at closing beyond the down payment for buyers, or the net proceeds after fees for sellers.'
  },
  {
    q: 'Why should I use RoughTools instead of a basic closing costs estimate?',
    a: 'The RoughTools Closing Costs Calculator provides an itemised breakdown of every fee category rather than a single percentage estimate, so you can see exactly where your money goes and identify which costs are negotiable. It separately calculates buyer costs (loan origination, title, prepaid items) and seller costs (agent commission, transfer taxes, title), giving a complete picture for both sides of the transaction. Unlike lender-provided estimates that may omit certain fees, this tool includes all standard cost categories.'
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'To report a bug or suggest a feature — such as state-specific fee presets, seller concession modelling, refinance closing costs, cash purchase scenarios, or VA/FHA fee structures — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the purchase price and inputs you used, the browser and OS, and the expected versus actual result. Feature requests for net sheet calculations, side-by-side lender fee comparison, or export to PDF are reviewed and prioritised regularly.'
  },
  {
    q: 'What are typical closing costs as a percentage of home price?',
    a: 'For buyers, closing costs typically range from 2% to 5% of the loan amount, covering loan origination fees, title insurance, appraisal, attorney fees, prepaid interest, homeowners insurance deposit, and property tax escrow. On a $400,000 purchase with 10% down, buyer closing costs might be $7,000–$18,000. For sellers, closing costs are typically higher at 6%–10% of the sale price, largely driven by the real estate agent commission (typically 5–6% in the US). Sellers may also pay transfer taxes, title fees, and prorated property taxes depending on the state.'
  },
  {
    q: 'Which closing costs are negotiable?',
    a: 'Several closing costs are negotiable or avoidable. Loan origination fees are negotiable — compare quotes from multiple lenders. Title insurance: shop for your own title company in states that allow it. Seller concessions: in buyer-friendly markets, sellers may agree to cover some buyer closing costs. Buyer\'s agent commission: in the wake of the 2024 NAR settlement, buyer agent compensation is now negotiated directly rather than automatically paid by the seller. Attorney fees vary by firm — compare quotes. Prepaid items (interest, insurance, taxes) are not negotiable — they are based on actual rates and timing.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Real Estate Tools', item: 'https://roughtools.com/tools/real-estate' },
      { '@type': 'ListItem', position: 3, name: 'Closing Costs Calculator', item: 'https://roughtools.com/tools/real-estate/closing-costs-calculator' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Closing Costs Calculator',
    url: 'https://roughtools.com/tools/real-estate/closing-costs-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online closing costs calculator tool by RoughTools.',
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
          <h1 className="font-bold dark:text-white text-gray-900 text-sm">Closing Costs Calculator</h1>
          <span className="ml-auto text-xs bg-orange-900/50 text-orange-400 border border-orange-800 px-2 py-0.5 rounded-full">🧾 Buyer + Seller Costs</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-900/60 to-amber-900/60 border-b border-orange-800/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Itemised Breakdown', 'Buyer Costs', 'Seller Costs', 'Transfer Taxes', 'Prepaid Items', 'Free'].map(b => (
              <span key={b} className="text-xs bg-orange-900/50 text-orange-300 border border-orange-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-gray-900 mb-3">Closing Costs Calculator</h2>
          <p className="dark:text-orange-200/80 text-orange-900 text-sm sm:text-base leading-relaxed max-w-3xl">
            Get a detailed, itemised estimate of all closing costs when buying or selling a home. Closing costs are fees paid at the final stage of a real estate transaction, and they can add thousands of dollars beyond the down payment for buyers, or significantly reduce net proceeds for sellers. Understanding what to expect prevents budget surprises at the closing table. This calculator covers all standard cost categories — loan origination, title insurance, appraisal, transfer taxes, prepaid interest, and agent commissions — so you can plan your total cash requirement accurately.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-5">
            {[
              { icon: '🏦', label: 'Loan Fees' },
              { icon: '📋', label: 'Title Costs' },
              { icon: '🏛️', label: 'Transfer Tax' },
              { icon: '📅', label: 'Prepaid Items' },
              { icon: '🤝', label: 'Agent Fees' },
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
          <ClosingCostsClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🔒', title: 'Private', desc: 'Transaction data never leaves your browser' },
            { icon: '📋', title: 'Full Itemisation', desc: 'Every fee category broken out individually' },
            { icon: '🆓', title: 'Free Forever', desc: 'No account, paywall, or upgrade required' },
          ].map(c => (
            <div key={c.title} className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold dark:text-white text-gray-900 text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Cost summary table */}
        <div className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-bold dark:text-white text-gray-900 mb-4">Typical Closing Cost Ranges</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
              <span className="text-gray-300 font-medium">Total Buyer Closing Costs</span>
              <span className="text-orange-400 font-bold">2% – 5% of loan amount</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
              <span className="text-gray-300 font-medium">Total Seller Closing Costs</span>
              <span className="text-orange-400 font-bold">6% – 10% of sale price</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
              <span className="text-gray-300 font-medium">Real Estate Agent Commission</span>
              <span className="text-gray-400">Negotiable (was ~5–6%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
              <span className="text-gray-300 font-medium">Transfer Taxes</span>
              <span className="text-gray-400">0% to 4%+ (varies by state)</span>
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
                  <span className="text-orange-400 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/real-estate/down-payment-calculator', label: '💵 Down Payment' },
              { href: '/tools/real-estate/home-affordability-calculator', label: '💰 Affordability' },
              { href: '/tools/real-estate/property-tax-calculator', label: '🏛️ Property Tax' },
              { href: '/tools/real-estate/rent-vs-buy-calculator', label: '⚖️ Rent vs Buy' },
              { href: '/tools/real-estate/cap-rate-calculator', label: '📊 Cap Rate' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-orange-500 hover:text-orange-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="Closing Costs Calculator"
          toolSlug="closing-costs-calculator"
          toolUrl="https://roughtools.com/tools/real-estate/closing-costs-calculator"
          type="financial"

        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
