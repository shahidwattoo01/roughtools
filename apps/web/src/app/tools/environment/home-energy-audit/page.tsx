import type { Metadata } from 'next'
import Link from 'next/link'
import HomeEnergyClient from './HomeEnergyClient'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Home Energy Audit — Free Energy Efficiency Calculator | RoughTools',
  description: 'Audit your home energy use room by room. Get an energy efficiency grade, consumption breakdown, and personalised actions to cut bills by up to 35%. Free, no signup.',
  alternates: { canonical: 'https://roughtools.com/tools/environment/home-energy-audit' },
  openGraph: {
    title: `Home Energy Audit — Calculate Home Energy Use | RoughTools`,
    description: `Audit your home energy consumption and find savings opportunities. Free online home energy usage calculator.`,
    url: 'https://roughtools.com/tools/environment/home-energy-audit',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Home Energy Audit — Calculate Home Energy Use | RoughTools`,
    description: `Audit your home energy consumption and find savings opportunities. Free online home energy usage calculator.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Home Energy Audit tool free to use?',
    a: 'Yes, the Home Energy Audit on RoughTools is completely free with no subscription, usage limits, or premium features. You can audit your home energy use and receive a full efficiency rating and personalised improvement plan at no cost. RoughTools is funded through non-intrusive advertising, keeping every tool permanently free for homeowners, renters, landlords, and energy advisors worldwide.',
  },
  {
    q: 'Do I need to create an account to complete a home energy audit?',
    a: 'No account or registration is required. Open the Home Energy Audit, work through the room-by-room questions about your heating, insulation, appliances, and lighting, and get your energy efficiency grade and recommendations immediately. There is no email address, password, or profile needed at any point. The tool is designed for instant, frictionless access so you can complete a full audit in about five minutes.',
  },
  {
    q: 'Is my data safe? Does this tool store information about my home?',
    a: 'Your data never leaves your device. All energy calculations and efficiency scoring happen entirely in your browser using JavaScript. Nothing you enter about your home — its size, heating system, insulation, or energy bills — is transmitted to any server, stored in a database, or shared with anyone. Your home information is completely private and remains only on your device during and after the audit.',
  },
  {
    q: 'Does the Home Energy Audit work on mobile phones and tablets?',
    a: 'Yes. The tool is fully responsive and works correctly on smartphones, tablets, and desktop computers. All input forms, room-by-room sections, efficiency grade displays, and recommendation cards adapt to smaller screens. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers without requiring any app installation.',
  },
  {
    q: 'Which browsers support this home energy audit tool?',
    a: 'The Home Energy Audit works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses standard JavaScript and CSS that are universally supported in all modern browser engines. Internet Explorer is not supported, as it reached end-of-life in June 2022. Any browser updated within the last five years will work correctly with all features.',
  },
  {
    q: 'How accurate are the home energy efficiency scores and savings estimates?',
    a: 'The efficiency scoring is based on standard UK Energy Performance Certificate (EPC) methodology adapted for a browser-based self-assessment. Energy consumption estimates use average household figures from the UK Department for Energy Security and Net Zero (DESNZ), adjusted by the property characteristics and appliance usage you enter. Savings estimates for specific improvements — such as cavity wall insulation or boiler replacement — are derived from published Energy Saving Trust data. Results are indicative estimates rather than a professional survey, but they reliably identify the highest-impact opportunities in your home.',
  },
  {
    q: 'Can I use the Home Energy Audit offline?',
    a: 'Once the page has fully loaded, the Home Energy Audit works offline because all calculation logic is embedded in the browser page with no server calls required. You do not need an active internet connection after the initial load. This is useful for completing the audit when working from a property with poor connectivity, or for energy advisors assessing homes in rural areas.',
  },
  {
    q: 'How do I audit my home energy use? Step-by-step guide.',
    a: 'Completing the audit takes approximately 5 to 10 minutes. Step one: open the Home Energy Audit on this page. Step two: enter basic property information — property type, number of bedrooms, and construction period. Step three: work through each energy category — heating system type and age, insulation levels for walls, loft and floors, window glazing type, and hot water system. Step four: enter information about your main appliances and lighting. Step five: view your energy efficiency grade (A to G), your estimated annual energy consumption breakdown by category, and a prioritised list of improvements ranked by annual savings potential.',
  },
  {
    q: 'Why use RoughTools Home Energy Audit instead of other tools?',
    a: 'RoughTools provides a comprehensive room-by-room assessment that covers all major energy uses in a single tool, generating up to seven specific improvement recommendations ranked by savings potential. All data stays in your browser with no account required and no data collection. Unlike basic energy calculators that only estimate total bills, this tool identifies exactly which parts of your home are losing the most energy and what to fix first to get the maximum return on investment.',
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'Use the Contact page on RoughTools to report a bug or suggest improvements. Common requests include adding specific boiler or heat pump models, expanding to cover properties outside the UK, or adding solar panel interaction with energy consumption estimates. When reporting a bug, describe the inputs you entered and what unexpected result or error you received. The development team reviews all submissions for future updates.',
  },
  {
    q: 'What is an energy efficiency rating and what does it mean?',
    a: 'An energy efficiency rating, as used in UK Energy Performance Certificates (EPCs), grades a property from A (most efficient) to G (least efficient) based on its estimated energy consumption and CO₂ emissions per square metre. Highly rated homes (A and B) have excellent insulation, modern heating systems, and low energy bills. Most UK homes currently sit at D or E. Improving a rating from E to C through insulation, glazing, and heating upgrades can reduce annual energy bills by several hundred pounds. The rating also affects property value and mortgage eligibility for green mortgages.',
  },
  {
    q: 'What home energy improvements give the best return on investment?',
    a: 'The highest return-on-investment home energy improvements, in typical priority order, are: loft insulation (very low cost, saves £150–£300 per year, payback in under 2 years), cavity wall insulation (moderate cost, saves £200–£400 per year), upgrading from an old inefficient boiler to a modern condensing boiler (saves £200–£350 per year), installing a smart thermostat (low cost, saves £100–£150 per year), double or triple glazing for single-glazed properties (high cost, longer payback but significant comfort improvement), and LED lighting throughout the home (very low cost, immediate payback). A heat pump offers the largest long-term savings if your home is already well insulated.',
  },
  {
    q: 'How much can I save on energy bills by improving my home efficiency?',
    a: 'Potential savings depend on your current energy use, property size, and which improvements you make. The Energy Saving Trust estimates that a poorly insulated detached home could save over £600 per year through a combination of loft insulation, cavity wall insulation, and a boiler upgrade. Smaller properties with fewer inefficiencies will see smaller but still meaningful savings. Collectively, improving from an EPC rating of G to C through multiple upgrades can cut energy bills by 40–60%. The Home Energy Audit\'s personalised recommendations show the specific estimated saving for each improvement applicable to your property.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Home Energy Audit',
  url: 'https://roughtools.com/tools/environment/home-energy-audit',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Audit home energy use room by room. Get an energy efficiency grade and prioritised improvement recommendations. Free, private, no signup.',
}
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Environment Tools', item: 'https://roughtools.com/tools/environment' },
    { '@type': 'ListItem', position: 3, name: 'Home Energy Audit', item: 'https://roughtools.com/tools/environment/home-energy-audit' },
  ],
}
export default function HomeEnergyPage() {
  return (
    <>
      <JsonLd data={[jsonLd, faqJsonLd, breadcrumbLd]} />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-xs text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/tools/environment" className="hover:text-emerald-600 transition-colors">Environment Tools</Link>
            <span>›</span>
            <span className="text-gray-800 font-medium">Home Energy Audit</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0">🏠</div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">Home Energy Audit</h1>
                <p className="text-emerald-100 text-sm mt-1 max-w-xl">Get an energy efficiency rating for your home, see where you are losing money, and receive a prioritised list of improvements ranked by annual savings to cut your bills.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {['⚡ Instant', '🔒 Private', '🆓 Free', '📊 7 Recommendations'].map(chip => (
                <span key={chip} className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 text-emerald-100">{chip}</span>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <ToolAdUnit position="top" />
          <HomeEnergyClient />
          <ToolAdUnit position="middle" />

          <section className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-3">About Home Energy Audit</h2>
            <p className="text-gray-600 leading-relaxed">
              Home energy accounts for approximately 25–30% of the average household carbon footprint in the UK, and heating and hot water alone account for over 80% of home energy use. Identifying where your home is losing energy — through poor insulation, an ageing boiler, or inefficient appliances — is the essential first step to reducing both your carbon footprint and your energy bills simultaneously.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              This audit uses EPC-aligned methodology to assess your property across all major energy categories and generates a personalised improvement plan with specific savings estimates for each recommendation. Unlike a generic checklist, the recommendations are prioritised by annual savings so you know exactly where to invest first for the fastest return.
            </p>
          </section>

          <section className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQ.map(({ q, a }, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{q}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">Related Environment Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'Carbon Footprint Calculator', href: '/tools/environment/carbon-footprint-calculator', desc: 'Calculate your total CO₂ footprint' },
                { name: 'Solar Savings Calculator', href: '/tools/environment/solar-savings-calculator', desc: 'Calculate solar panel ROI' },
                { name: 'EV Carbon Offset', href: '/tools/environment/ev-carbon-offset', desc: 'Compare EV vs petrol emissions' },
                { name: 'Flight Carbon Calculator', href: '/tools/environment/flight-carbon-calculator', desc: 'Calculate flight CO₂ emissions' },
                { name: 'Waste Reduction Planner', href: '/tools/environment/waste-reduction-planner', desc: 'Build a zero-waste plan' },
              ].map(t => (
                <a key={t.href} href={t.href} className="flex flex-col p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all bg-gray-50 text-gray-900 no-underline">
                  <span className="text-sm font-semibold mb-1">{t.name}</span>
                  <span className="text-xs text-gray-500">{t.desc}</span>
                </a>
              ))}
            </div>
          </section>
          <ToolPageExtras
            toolName="Home Energy Audit"
            toolSlug="home-energy-audit"
            toolUrl="https://roughtools.com/tools/environment/home-energy-audit"
            type="general"
            showPDF
          />
          <ToolAdUnit position="bottom" />
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/tools/environment" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              ← Back to Environment Tools
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
