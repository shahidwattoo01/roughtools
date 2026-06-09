import type { Metadata } from 'next'
import Link from 'next/link'
import SolarSavingsClient from './SolarSavingsClient'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Solar Savings Calculator — Free Solar Panel ROI Tool | RoughTools',
  description: 'Calculate how much you save with solar panels. Get payback period, annual savings, 25-year ROI, and CO₂ offset based on your home size and location. Free, no signup.',
  alternates: { canonical: 'https://roughtools.com/tools/environment/solar-savings-calculator' },
  openGraph: {
    title: `Solar Savings Calculator — Solar Panel ROI | RoughTools`,
    description: `Calculate your solar panel savings and payback period. Estimate solar ROI for your home. Free online solar calculator.`,
    url: 'https://roughtools.com/tools/environment/solar-savings-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Solar Savings Calculator — Solar Panel ROI | RoughTools`,
    description: `Calculate your solar panel savings and payback period. Estimate solar ROI for your home. Free online solar calculator.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Solar Savings Calculator free to use?',
    a: 'Yes, the Solar Savings Calculator on RoughTools is completely free with no subscription, usage limits, or premium features. You can calculate your solar panel payback period, annual savings, and 25-year return on investment at no cost. RoughTools is funded through non-intrusive advertising, keeping every tool permanently free for homeowners, property investors, and anyone considering solar panels.',
  },
  {
    q: 'Do I need to create an account to calculate solar savings?',
    a: 'No account or registration is required. Open the Solar Savings Calculator, enter your roof size, location, and current electricity tariff, and receive your full solar ROI breakdown immediately. There is no email address, password, or profile needed at any point. The tool is designed for instant access so you can check whether solar makes financial sense for your home in under two minutes.',
  },
  {
    q: 'Is my data safe? Does this tool store what I enter?',
    a: 'Your data never leaves your device. All solar output estimates, savings calculations, and ROI projections are performed entirely in your browser using JavaScript. Nothing you enter — your address, roof size, electricity consumption, or tariff — is transmitted to any server, stored in a database, or shared with anyone. Your home and financial information remains completely private on your device.',
  },
  {
    q: 'Does the Solar Savings Calculator work on mobile and tablet?',
    a: 'Yes. The calculator is fully responsive and works correctly on smartphones, tablets, and desktop computers. All input fields and results — payback period, annual savings, 25-year ROI, and CO₂ offset — adapt to smaller screens. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers without requiring any app download or installation.',
  },
  {
    q: 'Which browsers support this solar savings calculator?',
    a: 'The Solar Savings Calculator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses standard JavaScript and CSS that are universally supported. Internet Explorer is not supported, as it reached end-of-life in June 2022. Any browser updated within the last five years will work correctly with all features of the tool.',
  },
  {
    q: 'How accurate are the solar savings and payback estimates?',
    a: 'Solar output estimates use location-based peak sun hour data derived from NASA and PVGIS datasets, combined with standard solar panel efficiency figures (typically 17–20% for modern panels). Savings calculations use your entered electricity tariff and the current UK Smart Export Guarantee (SEG) export rate. Payback and ROI projections assume an electricity price inflation rate consistent with Ofgem\'s published long-term forecasts. Results are estimates — actual performance varies with roof pitch, shading, panel degradation, and local microclimate — but the figures are accurate enough to determine whether solar is financially viable for your property.',
  },
  {
    q: 'Can I use the Solar Savings Calculator offline?',
    a: 'Once the page has fully loaded, the Solar Savings Calculator works offline because all calculation logic and location data are embedded in the browser page with no server calls required. You do not need an active internet connection after the initial load. This is useful for assessing a property on site, at a planning meeting, or in a location with poor connectivity.',
  },
  {
    q: 'How do I calculate my solar panel savings? Step-by-step guide.',
    a: 'Calculating your solar savings takes about two minutes. Step one: open the Solar Savings Calculator on this page. Step two: enter your available roof area in square metres and select your roof orientation — south-facing roofs produce the most output in the UK. Step three: select your location or region to apply the correct local peak sun hours. Step four: enter your current electricity unit rate in pence per kWh. Step five: view your results — estimated annual kWh generation, annual bill savings, Smart Export Guarantee income, payback period in years, 25-year net profit, and lifetime CO₂ offset in tonnes.',
  },
  {
    q: 'Why use RoughTools Solar Calculator instead of installer quotes?',
    a: 'This tool gives you an independent, unbiased estimate of solar viability before you engage with any installer. Installer quotes often include upselling and may overstate returns to close a sale. RoughTools uses published solar irradiance data and standard industry efficiency figures with no commercial incentive to inflate projections. Use it to benchmark whether installer quotes are realistic, and to decide whether solar is worth pursuing at all before spending time getting quotes.',
  },
  {
    q: 'How do I report a bug or suggest a new feature for this tool?',
    a: 'Use the Contact page on RoughTools to report a bug or suggest improvements. Common requests include adding battery storage calculations, expanding location data to countries outside the UK, or including the SEG comparison across different energy suppliers. When reporting a bug, include the values you entered and what unexpected result you received. The development team reviews all submissions for future updates.',
  },
  {
    q: 'How many solar panels do I need and how much do they cost?',
    a: 'The number of solar panels depends on your roof area and electricity consumption. A typical 3–4 bedroom UK home installs a 3.5 to 4 kWp system comprising 10 to 12 standard panels (each approximately 400W), covering around 20 to 25 square metres of south-facing roof. Installation costs in 2024–2025 typically range from £5,000 to £8,000 for a standard residential system including inverter and installation labour. Battery storage adds £3,000 to £5,000. Prices vary by installer, panel brand, and location. The Solar Savings Calculator shows you the payback period based on your specific system size so you can assess whether the investment is worthwhile.',
  },
  {
    q: 'What is the Smart Export Guarantee and how does it affect solar savings?',
    a: 'The Smart Export Guarantee (SEG) is a UK government scheme that requires licensed electricity suppliers to pay homeowners for surplus solar electricity they export back to the national grid. SEG payments are set by each energy supplier and vary from approximately 1p to 24p per kWh depending on the supplier and tariff. Unlike the old Feed-in Tariff, SEG payments are not government-fixed, so it pays to shop around for the best rate. The Solar Savings Calculator includes your estimated SEG income as part of the total annual return calculation.',
  },
  {
    q: 'What is a solar panel payback period and what is considered good?',
    a: 'The solar panel payback period is the number of years it takes for the cumulative energy bill savings and export income to equal the upfront installation cost. Once the payback period is reached, all subsequent savings are pure profit. In the UK, a well-positioned south-facing system on a household with high daytime electricity use typically achieves payback in 6 to 10 years. Given that quality solar panels are warranted for 25 years and have a useful life of 30 or more years, a payback period under 10 years represents an excellent return — effectively a guaranteed 10–15% annual return on capital, risk-free.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Solar Savings Calculator',
  url: 'https://roughtools.com/tools/environment/solar-savings-calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Calculate solar panel payback period, annual savings, 25-year ROI, and CO₂ offset based on roof size and location. Free, private, science-based.',
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
    { '@type': 'ListItem', position: 3, name: 'Solar Savings Calculator', item: 'https://roughtools.com/tools/environment/solar-savings-calculator' },
  ],
}
export default function SolarSavingsPage() {
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
            <span className="text-gray-800 font-medium">Solar Savings Calculator</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0">☀️</div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">Solar Savings Calculator</h1>
                <p className="text-emerald-100 text-sm mt-1 max-w-xl">See your solar panel payback period, annual bill savings, Smart Export Guarantee income, 25-year ROI, and lifetime CO₂ offset — based on your roof size and location.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {['⚡ Instant', '🔒 Private', '🆓 Free', '🌍 Science-Based'].map(chip => (
                <span key={chip} className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 text-emerald-100">{chip}</span>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <ToolAdUnit position="top" />
          <SolarSavingsClient />
          <ToolAdUnit position="middle" />

          <section className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-3">About Solar Savings Calculator</h2>
            <p className="text-gray-600 leading-relaxed">
              Solar panels are one of the most financially attractive home energy improvements available today, combining guaranteed bill savings with Smart Export Guarantee income and a significant reduction in household carbon emissions. With installation costs falling over 70% in the last decade and electricity prices remaining high, the business case for rooftop solar has never been stronger for most UK homeowners.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              This calculator uses NASA and PVGIS location-based solar irradiance data and published efficiency standards to produce an independent, unbiased estimate of your system's output and financial return. It covers annual generation, bill savings, export income, payback period, 25-year net profit, and lifetime CO₂ offset — everything you need to decide whether solar is the right investment for your home before engaging any installer.
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
                { name: 'Home Energy Audit', href: '/tools/environment/home-energy-audit', desc: 'Audit home energy efficiency' },
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
            toolName="Solar Savings Calculator"
            toolSlug="solar-savings-calculator"
            toolUrl="https://roughtools.com/tools/environment/solar-savings-calculator"
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
