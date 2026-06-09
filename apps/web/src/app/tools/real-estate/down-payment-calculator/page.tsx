import type { Metadata } from 'next'
import Link from 'next/link'
import DownPaymentClient from './DownPaymentClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Down Payment Calculator — How Much to Save for a House',
  description: 'Calculate exactly how much down payment you need for any home price and loan type. See monthly savings targets, PMI costs, and time to reach your goal.',
  keywords: ['down payment calculator', 'how much down payment for a house', 'save for house down payment', 'PMI calculator', 'first time home buyer down payment'],
  alternates: { canonical: 'https://roughtools.com/tools/real-estate/down-payment-calculator' },
  openGraph: {
    title: `Down Payment Calculator — How Much to Save | RoughTools`,
    description: `Calculate how much down payment you need and how long to save. Free online down payment and home purchase calculator.`,
    url: 'https://roughtools.com/tools/real-estate/down-payment-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Down Payment Calculator — How Much to Save | RoughTools`,
    description: `Calculate how much down payment you need and how long to save. Free online down payment and home purchase calculator.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this down payment calculator free to use?',
    a: 'Yes, the RoughTools Down Payment Calculator is completely free with no account, subscription, or payment required. You can calculate required down payments and savings timelines for any home price and loan type at no cost. RoughTools is funded through non-intrusive advertising, keeping every calculator permanently free. There are no usage limits, no premium scenarios behind a paywall, and no registration required to access all features.'
  },
  {
    q: 'Do I need to create an account to calculate a down payment?',
    a: 'No account, email address, or registration is required at any stage. Enter the home price, your target down payment percentage, and your monthly savings capacity — the tool instantly shows the total amount needed, how long it will take to save, and whether PMI applies. There is no login wall, no upgrade required to see the savings timeline, and no data stored about your finances anywhere.'
  },
  {
    q: 'Does this tool store my financial information?',
    a: 'No. All calculations run entirely within your browser using JavaScript. The home price, savings figures, and all other inputs you enter are never transmitted to RoughTools servers, never logged, and never shared with lenders, advisers, or third parties. Once you close the browser tab, the data is gone with no trace retained. Your home buying plans remain completely private throughout the entire calculation process.'
  },
  {
    q: 'Does the down payment calculator work on mobile and tablet?',
    a: 'Yes, the calculator is fully responsive and works on all modern smartphones and tablets. All input fields and results are optimised for touch screens. This is useful when browsing home listings on your phone — you can quickly check what down payment percentage is needed for a specific property, how long it would take to save at your current monthly rate, and whether you would need to pay PMI at different down payment levels.'
  },
  {
    q: 'Which browsers are supported by this calculator?',
    a: 'The Down Payment Calculator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The calculator uses standard JavaScript arithmetic that runs natively in every current browser. For the best currency and percentage formatting, any current version of Chrome, Firefox, or Safari on desktop or mobile is recommended.'
  },
  {
    q: 'How accurate is the down payment savings timeline?',
    a: 'The savings timeline is calculated using straightforward arithmetic: down payment amount divided by monthly savings contribution. If you have existing savings toward the goal, that amount is deducted first. The calculation assumes a flat monthly savings rate with no investment return on accumulated savings — for a more aggressive projection, factor in interest earned in a high-yield savings account. The tool provides a conservative planning baseline. Actual timelines depend on whether your monthly savings rate changes, unexpected expenses, or changes in your target home price.'
  },
  {
    q: 'Can I use this calculator without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all calculations run in JavaScript without requiring an active internet connection. You can adjust home prices, down payment percentages, and savings amounts and view updated timelines offline. The initial page load requires internet access to download the page assets. After that, the calculator functions entirely client-side for as long as the browser tab is open, making it usable even with poor or no signal.'
  },
  {
    q: 'How do I calculate my down payment and savings timeline step by step?',
    a: 'To use the calculator: (1) Enter the home price you are targeting. (2) Select your down payment percentage — 3%, 3.5%, 10%, 20%, or a custom amount. (3) Enter any existing savings already set aside for the down payment. (4) Enter your planned monthly savings contribution toward the down payment. (5) Click Calculate. The tool shows the total down payment amount required, the remaining amount to save, the number of months to reach your goal, and whether you will need to pay PMI (required when putting less than 20% down on a conventional loan).'
  },
  {
    q: 'Why should I use RoughTools instead of a mortgage lender calculator?',
    a: 'Lender-provided calculators are designed to show you mortgage payments and qualify you for a loan — they are not optimised for helping you plan savings timelines and compare down payment scenarios. RoughTools Down Payment Calculator focuses specifically on the savings planning problem: how much you need, how long it will take at your current rate, and the financial tradeoff between different down payment levels (such as avoiding PMI by reaching 20%). It is neutral, private, and has no incentive to push you toward any particular loan product.'
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'To report a bug or suggest a feature — such as HYSA interest on savings, down payment assistance programme modelling, FHA vs conventional comparison, gift fund inclusion, or savings acceleration scenarios — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the inputs you used, the browser and OS, and the expected versus actual result. Feature requests for investment return on down payment savings or amortisation impact of different down payment amounts are reviewed regularly.'
  },
  {
    q: 'What is the minimum down payment required for a house?',
    a: 'The minimum down payment depends on the loan type: conventional loans (Fannie Mae/Freddie Mac) require as little as 3% for first-time buyers, but 5% for repeat buyers in most cases. FHA loans require 3.5% with a 580+ credit score, or 10% with a 500–579 credit score. VA loans (available to veterans and active military) require 0%. USDA loans (for eligible rural properties) also require 0%. Jumbo loans (above conforming limits) typically require 10–20%. For any conventional loan with less than 20% down, PMI (private mortgage insurance) is required until equity reaches 20%.'
  },
  {
    q: 'What is PMI and when can I stop paying it?',
    a: 'PMI (private mortgage insurance) is required on conventional loans when the down payment is less than 20%. It protects the lender (not you) against default risk. PMI typically costs 0.5%–1.5% of the loan amount annually — on a $300,000 loan, that is $1,500–$4,500 per year or $125–$375 per month. You can request PMI removal once your equity reaches 20% of the original home value (based on your payment schedule). Under the Homeowners Protection Act, lenders must automatically cancel PMI when equity reaches 22% of the original purchase price based on scheduled payments. Reaching 20% down payment upfront eliminates PMI entirely from the start.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Real Estate Tools', item: 'https://roughtools.com/tools/real-estate' },
      { '@type': 'ListItem', position: 3, name: 'Down Payment Calculator', item: 'https://roughtools.com/tools/real-estate/down-payment-calculator' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Down Payment Calculator',
    url: 'https://roughtools.com/tools/real-estate/down-payment-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online down payment calculator tool by RoughTools.',
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
          <h1 className="font-bold dark:text-white text-gray-900 text-sm">Down Payment Calculator</h1>
          <span className="ml-auto text-xs dark:bg-cyan-900/50 bg-cyan-100 dark:text-cyan-400 text-cyan-700 border dark:border-cyan-800 border-cyan-300 px-2 py-0.5 rounded-full">💵 Savings Timeline + PMI</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r dark:from-cyan-900/60 dark:to-teal-900/60 from-cyan-50 to-teal-50 border-b dark:border-cyan-800/30 border-cyan-200">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Savings Timeline', 'PMI Threshold', 'Loan Type Comparison', 'Monthly Target', 'Free'].map(b => (
              <span key={b} className="text-xs dark:bg-cyan-900/50 bg-cyan-100 dark:text-cyan-300 text-cyan-700 border dark:border-cyan-700/40 border-cyan-300 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-gray-900 mb-3">Down Payment Calculator</h2>
          <p className="dark:text-cyan-200/80 text-cyan-900 text-sm sm:text-base leading-relaxed max-w-3xl">
            Calculate exactly how much down payment you need for a home and how long it will take to save at your current monthly savings rate. Whether you are targeting the 3% conventional minimum, the 3.5% FHA threshold, or the full 20% needed to avoid PMI, this calculator gives you a clear savings roadmap. Enter the home price, your target down payment percentage, any existing savings, and your monthly contribution — and see your projected timeline to closing day.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-5">
            {[
              { icon: '🏠', label: 'Home Price' },
              { icon: '📊', label: 'Down %' },
              { icon: '💰', label: 'Current Savings' },
              { icon: '📅', label: 'Monthly Target' },
              { icon: '⏱️', label: 'Time to Goal' },
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
          <DownPaymentClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🔒', title: 'Private', desc: 'Savings data never leaves your browser' },
            { icon: '⏱️', title: 'Timeline', desc: 'Months to goal based on your savings rate' },
            { icon: '🏦', title: 'PMI Check', desc: 'Instantly shows if PMI applies' },
          ].map(c => (
            <div key={c.title} className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold dark:text-white text-gray-900 text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Down payment options */}
        <div className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-bold dark:text-white text-gray-900 mb-4">Down Payment Options by Loan Type</h2>
          <div className="space-y-2 text-sm">
            {[
              { pct: '0%', type: 'VA Loan', note: 'Veterans, active military, eligible spouses only', color: 'text-green-400' },
              { pct: '0%', type: 'USDA Loan', note: 'Eligible rural and suburban properties only', color: 'text-green-400' },
              { pct: '3%', type: 'Conventional', note: 'First-time buyers (Fannie Mae/Freddie Mac) — PMI required', color: 'text-blue-400' },
              { pct: '3.5%', type: 'FHA Loan', note: '580+ credit score required — mortgage insurance required', color: 'text-blue-400' },
              { pct: '10%', type: 'Conventional', note: 'Reduced PMI — better loan terms', color: 'text-yellow-400' },
              { pct: '20%', type: 'Conventional', note: 'No PMI — saves $100–$400/month', color: 'text-cyan-400' },
            ].map(r => (
              <div key={r.type + r.pct} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl gap-4">
                <div className="flex items-center gap-3">
                  <span className={`font-extrabold text-base w-10 ${r.color}`}>{r.pct}</span>
                  <div>
                    <span className="text-white font-medium text-sm">{r.type}</span>
                    <p className="text-gray-500 text-xs">{r.note}</p>
                  </div>
                </div>
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
                  <span className="text-cyan-400 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/real-estate/home-affordability-calculator', label: '💰 Affordability' },
              { href: '/tools/real-estate/closing-costs-calculator', label: '🧾 Closing Costs' },
              { href: '/tools/real-estate/rent-vs-buy-calculator', label: '⚖️ Rent vs Buy' },
              { href: '/tools/real-estate/property-tax-calculator', label: '🏛️ Property Tax' },
              { href: '/tools/real-estate/cap-rate-calculator', label: '📊 Cap Rate' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="Down Payment Calculator"
          toolSlug="down-payment-calculator"
          toolUrl="https://roughtools.com/tools/real-estate/down-payment-calculator"
          type="financial"

        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
