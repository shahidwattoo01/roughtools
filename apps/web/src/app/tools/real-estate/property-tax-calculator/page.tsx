import type { Metadata } from 'next'
import Link from 'next/link'
import PropertyTaxClient from './PropertyTaxClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Property Tax Calculator — Estimate Annual Property Taxes',
  description: 'Estimate your annual property tax bill based on assessed home value, local tax rate (mill rate), and homestead exemptions. Includes monthly and daily breakdowns.',
  keywords: ['property tax calculator', 'annual property tax estimator', 'homestead exemption calculator', 'mill rate calculator', 'real estate tax'],
  alternates: { canonical: 'https://roughtools.com/tools/real-estate/property-tax-calculator' },
  openGraph: {
    title: `Property Tax Calculator — Estimate Annual Property Tax | RoughTools`,
    description: `Estimate annual property tax based on assessed value and local tax rate. Free online property tax calculator tool.`,
    url: 'https://roughtools.com/tools/real-estate/property-tax-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Property Tax Calculator — Estimate Annual Property Tax | RoughTools`,
    description: `Estimate annual property tax based on assessed value and local tax rate. Free online property tax calculator tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this property tax calculator free to use?',
    a: 'Yes, the RoughTools Property Tax Calculator is completely free with no subscription, account, or payment required. You can estimate property taxes for any home value and tax rate combination at no cost. RoughTools is funded through non-intrusive advertising, keeping every real estate calculator permanently free. There are no usage limits, no premium features behind a paywall, and no signup of any kind required to access the full calculation and breakdown.'
  },
  {
    q: 'Do I need an account to estimate property taxes?',
    a: 'No account, email, or registration is required. Enter the home value, local tax rate, and any applicable exemptions, and your estimated annual property tax appears instantly with monthly and daily breakdowns. There is no login wall, no usage limit requiring registration, and no data stored about your property or finances. The tool is entirely anonymous and can be used as many times as needed without any sign-up process.'
  },
  {
    q: 'Does this tool store the home value or address I enter?',
    a: 'No. All calculations run entirely within your browser using JavaScript. The assessed value, tax rate, and exemption figures you enter are never transmitted to RoughTools servers, never logged, and never shared with any third party. Your property information remains completely private throughout the calculation process. Once you close the browser tab, all entered data is gone with no trace retained.'
  },
  {
    q: 'Does the property tax calculator work on mobile and tablet?',
    a: 'Yes, the calculator is fully responsive and works on all modern smartphones and tablets. All input fields and result displays are optimised for touch screens. This is useful when comparing properties — you can quickly calculate the estimated property tax for different homes you are considering buying, based on the assessed value and local tax rate for each neighbourhood or county, directly from your phone while viewing listings.'
  },
  {
    q: 'Which browsers are supported by this calculator?',
    a: 'The Property Tax Calculator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The calculator uses standard JavaScript that runs natively in every current browser version. For the best experience with currency and percentage formatting, any current version of Chrome, Firefox, or Safari on desktop or mobile is recommended.'
  },
  {
    q: 'How accurate are the property tax estimates?',
    a: 'The calculation uses the standard formula: Tax = (Assessed Value − Exemptions) × Tax Rate. This is mathematically precise given the inputs. The key to accuracy is using the correct assessed value (which may differ from market value in your jurisdiction) and the correct effective tax rate for your specific municipality. Property tax rates vary widely by county and city — always obtain your local rate from your county assessor\'s website or property tax bill for the most accurate estimate. This tool is best used for budgeting and comparison purposes.'
  },
  {
    q: 'Can I use this calculator without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all calculations run in JavaScript without requiring an active internet connection. You can adjust home values, tax rates, and exemption amounts and view updated estimates offline. This is useful when reviewing property documents or comparing purchase options away from reliable internet access. The initial page load requires internet, but after that the calculator functions entirely client-side.'
  },
  {
    q: 'How do I estimate my property tax step by step?',
    a: 'To estimate property taxes: (1) Enter the assessed value of the property — this is the value assigned by your local tax assessor, not necessarily the market value or purchase price. (2) Enter the effective property tax rate as a percentage for your county or municipality. (3) Enter any applicable exemptions — the homestead exemption amount if the property is your primary residence, or other exemptions you qualify for. (4) Click Calculate. The tool shows your estimated annual tax, monthly tax (for budgeting), and daily cost, along with the taxable value after exemptions.'
  },
  {
    q: 'Why should I use RoughTools instead of a basic property tax formula?',
    a: 'The RoughTools Property Tax Calculator includes homestead and other exemption deductions, which reduce taxable value before the rate is applied. Many basic calculations skip exemptions and produce significantly overstated estimates. This tool also breaks down the annual figure into monthly and daily costs, making it easier to budget property taxes as part of your monthly housing payment. The clean interface lets you quickly compare how different home values or tax rates affect your annual liability without complex spreadsheet work.'
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'To report a bug or suggest a feature — such as state-specific exemption presets, mill rate input mode, assessment ratio adjustment, or historical tax rate comparisons — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the values you entered, the browser and OS, and the expected versus actual result. Feature requests for senior exemptions, veteran exemptions, or county-specific rate databases are reviewed and prioritised regularly by the development team.'
  },
  {
    q: 'What is the difference between assessed value and market value?',
    a: 'Market value is the price a buyer would pay for a property in the current market — essentially what you paid or what it would sell for today. Assessed value is the value assigned by your local tax assessor\'s office for the purpose of calculating property taxes. In many jurisdictions, assessed value is a fraction of market value — often 70–80% or even 50%. Some states assess at 100% of market value. To find your assessed value, check your most recent property tax bill, your county assessor\'s online portal, or the property records at your county courthouse.'
  },
  {
    q: 'What is a homestead exemption and how does it reduce property taxes?',
    a: 'A homestead exemption is a reduction in the taxable value of your primary residence granted by most US states and many other countries. For example, if your home is assessed at $300,000 and your state offers a $25,000 homestead exemption, your taxable value is $275,000 — you only pay taxes on $275,000. The exemption amount varies widely: Florida offers up to $50,000, Texas offers $40,000, and other states offer different amounts or percentages. The exemption applies only to your primary residence — investment properties and second homes generally do not qualify.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Real Estate Tools', item: 'https://roughtools.com/tools/real-estate' },
      { '@type': 'ListItem', position: 3, name: 'Property Tax Calculator', item: 'https://roughtools.com/tools/real-estate/property-tax-calculator' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Property Tax Calculator',
    url: 'https://roughtools.com/tools/real-estate/property-tax-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online property tax calculator tool by RoughTools.',
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
          <h1 className="font-bold dark:text-white text-gray-900 text-sm">Property Tax Calculator</h1>
          <span className="ml-auto text-xs dark:bg-amber-900/50 bg-amber-100 dark:text-amber-400 text-amber-700 border dark:border-amber-800 border-amber-300 px-2 py-0.5 rounded-full">🏛️ Assessed Value × Rate</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-900/60 to-yellow-900/60 border-b border-amber-800/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Assessed Value', 'Mill Rate', 'Homestead Exemption', 'Monthly Breakdown', 'Free'].map(b => (
              <span key={b} className="text-xs bg-amber-900/50 text-amber-300 border border-amber-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-gray-900 mb-3">Property Tax Calculator</h2>
          <p className="dark:text-amber-200/80 text-amber-900 text-sm sm:text-base leading-relaxed max-w-3xl">
            Estimate your annual property tax bill based on the assessed value of the property, your local tax rate, and any exemptions you qualify for. Property taxes are one of the largest recurring costs of home ownership, yet many buyers underestimate them when budgeting. This calculator gives you the annual, monthly, and daily property tax cost — critical numbers for calculating your true monthly housing payment and comparing the total cost of ownership across different properties and locations.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-5">
            {[
              { icon: '🏠', label: 'Assessed Value' },
              { icon: '📊', label: 'Tax Rate' },
              { icon: '🎟️', label: 'Exemptions' },
              { icon: '📅', label: 'Annual Tax' },
              { icon: '📆', label: 'Monthly Cost' },
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
          <PropertyTaxClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🔒', title: 'Private', desc: 'Property data never leaves your browser' },
            { icon: '🎟️', title: 'Exemptions', desc: 'Homestead & other exemptions included' },
            { icon: '📅', title: 'Full Breakdown', desc: 'Annual, monthly, and daily cost' },
          ].map(c => (
            <div key={c.title} className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold dark:text-white text-gray-900 text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Rate reference */}
        <div className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-bold dark:text-white text-gray-900 mb-4">US Property Tax Rate Reference</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { state: 'New Jersey', rate: '2.49%', note: 'Highest in the US' },
              { state: 'Illinois', rate: '2.27%', note: 'Second highest' },
              { state: 'Texas', rate: '1.80%', note: 'High, no state income tax' },
              { state: 'New York', rate: '1.72%', note: 'Varies widely by county' },
              { state: 'California', rate: '0.76%', note: 'Prop 13 caps increases' },
              { state: 'Hawaii', rate: '0.29%', note: 'Lowest in the US' },
            ].map(r => (
              <div key={r.state} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                <div>
                  <span className="text-white font-medium">{r.state}</span>
                  <span className="text-gray-500 text-xs ml-2">{r.note}</span>
                </div>
                <span className="text-amber-400 font-bold">{r.rate}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-3">Effective tax rates. Your local county rate may differ — check your county assessor&apos;s website for the exact rate.</p>
        </div>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border dark:border-gray-800 border-gray-200 rounded-xl overflow-hidden dark:bg-gray-900 bg-white">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none dark:bg-gray-800/50 bg-gray-50 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors">
                  <h3 className="text-sm font-semibold dark:text-white text-gray-900 text-left pr-4">{faq.q}</h3>
                  <span className="text-amber-400 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/real-estate/closing-costs-calculator', label: '🧾 Closing Costs' },
              { href: '/tools/real-estate/home-affordability-calculator', label: '💰 Affordability' },
              { href: '/tools/real-estate/rent-vs-buy-calculator', label: '⚖️ Rent vs Buy' },
              { href: '/tools/real-estate/down-payment-calculator', label: '💵 Down Payment' },
              { href: '/tools/real-estate/cap-rate-calculator', label: '📊 Cap Rate' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-amber-500 hover:text-amber-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="Property Tax Calculator"
          toolSlug="property-tax-calculator"
          toolUrl="https://roughtools.com/tools/real-estate/property-tax-calculator"
          type="financial"

        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
