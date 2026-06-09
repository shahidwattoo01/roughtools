import type { Metadata } from 'next'
import Link from 'next/link'
import HomeAffordabilityClient from './HomeAffordabilityClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Home Affordability Calculator — How Much House Can I Afford?',
  description: 'Find out how much home you can afford based on your gross income, existing debts, down payment, and lender DTI limits. Get a realistic home buying budget instantly.',
  keywords: ['home affordability calculator', 'how much house can I afford', 'mortgage affordability', 'DTI calculator', 'home buying budget'],
  alternates: { canonical: 'https://roughtools.com/tools/real-estate/home-affordability-calculator' },
  openGraph: {
    title: `Home Affordability Calculator — How Much House Can You Afford | RoughTools`,
    description: `Calculate how much home you can afford based on income, debts, and down payment. Free online home affordability calculator.`,
    url: 'https://roughtools.com/tools/real-estate/home-affordability-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Home Affordability Calculator — How Much House Can You Afford | RoughTools`,
    description: `Calculate how much home you can afford based on income, debts, and down payment. Free online home affordability calculator.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this home affordability calculator free to use?',
    a: 'Yes, the RoughTools Home Affordability Calculator is completely free with no account, subscription, or hidden fees. You can run unlimited affordability calculations — adjusting income, debts, down payment, and interest rate — at no cost. RoughTools is funded through non-intrusive advertising, which keeps every calculator permanently free for first-time buyers, upgraders, and real estate professionals alike.'
  },
  {
    q: 'Do I need to sign up to calculate home affordability?',
    a: 'No account, email address, or registration is required at any stage. Enter your income, debts, and down payment, and your maximum affordable home price is calculated instantly. There is no paywall on any results, no upgrade required to see the full breakdown, and no data stored about your income or financial situation. The tool is entirely anonymous and free to use without any form of registration.'
  },
  {
    q: 'Is the financial information I enter kept private?',
    a: 'Yes. All calculations run entirely within your browser using JavaScript. Your income, debt payments, and down payment figures are never transmitted to RoughTools servers, never logged, and never shared with third parties including lenders, advertisers, or data brokers. Once you close the browser tab, all data is gone. You can use this tool to get a realistic budget without any privacy concern about your financial details being exposed.'
  },
  {
    q: 'Does this home affordability calculator work on mobile?',
    a: 'Yes, the calculator is fully responsive and works on all modern smartphones and tablets. All input fields are touch-friendly and optimised for mobile keyboards. The results panel and payment breakdown display clearly on small screens. This is particularly useful when you are at an open house or browsing listings online and want to quickly check whether a particular property falls within your affordable range based on your current income and debts.'
  },
  {
    q: 'Which browsers are compatible with this calculator?',
    a: 'The Home Affordability Calculator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave — on both desktop and mobile platforms. No browser extensions or plugins are required. The calculator uses standard JavaScript that runs natively in every current browser. Internet Explorer is not supported. For the best experience on any device, use any current version of Chrome, Firefox, Safari, or Edge.'
  },
  {
    q: 'How accurate is this home affordability calculator?',
    a: 'The calculator uses the industry-standard 28/36 DTI rule and the standard mortgage amortisation formula, which are the same methods used by most conventional lenders in the United States. The 43% back-end DTI limit is the standard threshold used by Fannie Mae and Freddie Mac qualifying guidelines. Actual lender approval depends on additional factors not modelled here: credit score, employment history, asset reserves, loan type (FHA vs conventional), and individual lender overlays. Use this as a budgeting guide, not a loan pre-approval.'
  },
  {
    q: 'Can I use this calculator without an internet connection?',
    a: 'Once the page has fully loaded in your browser, the calculator runs entirely in JavaScript and does not require a live internet connection to perform calculations. You can adjust inputs and view updated results offline. The initial page load requires an internet connection to download the page assets. For most users, the page loads in under two seconds and works seamlessly on both high-speed and low-bandwidth connections, including mobile data.'
  },
  {
    q: 'How do I calculate how much house I can afford — step by step?',
    a: 'To use the calculator: (1) Enter your gross annual household income before taxes. (2) Enter your total existing monthly debt payments — car loans, student loans, credit card minimums, and any other recurring debt. (3) Enter your planned down payment amount. (4) Set the current mortgage interest rate and your preferred loan term. (5) Enter estimated property tax rate and homeowners insurance costs for your target area. (6) Click Calculate — the tool shows your maximum affordable home price based on lender DTI limits, along with estimated monthly payment breakdown.'
  },
  {
    q: 'Why should I use RoughTools instead of other affordability calculators?',
    a: 'RoughTools Home Affordability Calculator applies both the 28% front-end DTI limit (housing costs vs income) and the 43% back-end DTI limit (all debts vs income), and uses whichever constraint is binding for your situation — giving a more conservative and realistic result than calculators that only apply one ratio. It also includes property tax and insurance in the housing cost calculation, which many simple calculators omit, leading to overestimates of affordable price. All results are private and never shared with lenders.'
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'To report a bug or request a feature — such as FHA loan limits, VA loan modelling, HOA fee inclusion, PMI calculation, or state-specific tax presets — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the income and debt figures you entered, the browser and OS you were using, and the result you expected versus what appeared. Feature requests for jumbo loan thresholds, co-borrower income, or multi-scenario comparison are welcomed and reviewed regularly.'
  },
  {
    q: 'What is the debt-to-income ratio and how does it affect my home budget?',
    a: 'Debt-to-income ratio (DTI) is the percentage of your gross monthly income that goes toward debt payments. Lenders use two DTI limits: the front-end ratio (housing costs only) typically capped at 28%, and the back-end ratio (all monthly debts including housing) typically capped at 43%. If your existing debts are high, the back-end ratio is the binding constraint and reduces your maximum home price. Paying off existing debts before applying for a mortgage directly increases your home affordability by improving your DTI.'
  },
  {
    q: 'What is the minimum down payment required to buy a house?',
    a: 'The minimum down payment depends on the loan type: conventional loans require as little as 3% (with PMI), FHA loans require 3.5% with a 580+ credit score, VA loans (for veterans) require 0%, and USDA loans (for eligible rural properties) also require 0%. A 20% down payment eliminates the need for private mortgage insurance (PMI), which can add $100–$200 or more to monthly payments. A larger down payment reduces the loan amount and monthly payment, directly increasing affordability for higher-priced homes.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Real Estate Tools', item: 'https://roughtools.com/tools/real-estate' },
      { '@type': 'ListItem', position: 3, name: 'Home Affordability Calculator', item: 'https://roughtools.com/tools/real-estate/home-affordability-calculator' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Home Affordability Calculator',
    url: 'https://roughtools.com/tools/real-estate/home-affordability-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online home affordability calculator tool by RoughTools.',
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
          <h1 className="font-bold dark:text-white text-gray-900 text-sm">Home Affordability Calculator</h1>
          <span className="ml-auto text-xs dark:bg-blue-900/50 bg-blue-100 dark:text-blue-400 text-blue-700 border dark:border-blue-800 border-blue-300 px-2 py-0.5 rounded-full">💰 DTI-Based Budget</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900/60 to-teal-900/60 border-b border-blue-800/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['28/36 DTI Rule', 'Front-End Ratio', 'Back-End Ratio', 'Mortgage + Tax + Insurance', 'Free'].map(b => (
              <span key={b} className="text-xs bg-blue-900/50 text-blue-300 border border-blue-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-gray-900 mb-3">Home Affordability Calculator</h2>
          <p className="dark:text-blue-200/80 text-blue-900 text-sm sm:text-base leading-relaxed max-w-3xl">
            Find out the maximum home price you can realistically afford based on your household income, existing monthly debts, down payment, and current mortgage rates. This calculator applies the 28/36 debt-to-income rule used by most conventional lenders — the same method banks use to evaluate mortgage applications. It works backwards from your income and debt limits to find a realistic purchase price that keeps your monthly payments within lender guidelines. Use it to set a confident home search budget before speaking with a lender.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-5">
            {[
              { icon: '💼', label: 'Gross Income' },
              { icon: '💳', label: 'Existing Debts' },
              { icon: '💵', label: 'Down Payment' },
              { icon: '📊', label: 'DTI Limits' },
              { icon: '🏠', label: 'Max Price' },
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
          <HomeAffordabilityClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🔒', title: 'Private', desc: 'Income & debt data never leaves your browser' },
            { icon: '🎯', title: '28/36 Rule', desc: 'Industry-standard DTI ratios used by lenders' },
            { icon: '🆓', title: 'Free Forever', desc: 'No account, paywall, or upgrade required' },
          ].map(c => (
            <div key={c.title} className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold dark:text-white text-gray-900 text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* How DTI works */}
        <div className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-bold dark:text-white text-gray-900 mb-4">How the DTI Rule Works</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-400">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-blue-400 font-semibold mb-2">Front-End DTI (28% limit)</h3>
              <p>Housing costs ÷ Gross Monthly Income ≤ 28%</p>
              <p className="mt-2 text-gray-500 text-xs">Includes: mortgage principal + interest + property taxes + homeowners insurance (PITI)</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-teal-400 font-semibold mb-2">Back-End DTI (43% limit)</h3>
              <p>All Monthly Debts ÷ Gross Monthly Income ≤ 43%</p>
              <p className="mt-2 text-gray-500 text-xs">Includes: housing costs + car loans + student loans + credit cards + all other recurring debt</p>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-3">The calculator applies both limits and uses whichever gives the more conservative (lower) result for your situation.</p>
        </div>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border dark:border-gray-800 border-gray-200 rounded-xl overflow-hidden dark:bg-gray-900 bg-white">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none dark:bg-gray-800/50 bg-gray-50 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors">
                  <h3 className="text-sm font-semibold dark:text-white text-gray-900 text-left pr-4">{faq.q}</h3>
                  <span className="text-blue-400 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/real-estate/rent-vs-buy-calculator', label: '⚖️ Rent vs Buy' },
              { href: '/tools/real-estate/down-payment-calculator', label: '💵 Down Payment' },
              { href: '/tools/real-estate/closing-costs-calculator', label: '🧾 Closing Costs' },
              { href: '/tools/real-estate/property-tax-calculator', label: '🏛️ Property Tax' },
              { href: '/tools/real-estate/cap-rate-calculator', label: '📊 Cap Rate' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="Home Affordability Calculator"
          toolSlug="home-affordability-calculator"
          toolUrl="https://roughtools.com/tools/real-estate/home-affordability-calculator"
          type="financial"

        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
