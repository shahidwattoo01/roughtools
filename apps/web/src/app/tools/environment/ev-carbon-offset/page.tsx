import type { Metadata } from 'next'
import Link from 'next/link'
import EvCarbonClient from './EvCarbonClient'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'EV Carbon Offset Calculator — Free EV vs Petrol Comparison | RoughTools',
  description: 'Compare your EV vs petrol or diesel car CO₂ emissions. Calculate annual carbon savings, trees equivalent, fuel cost savings, and break-even point. Free, no signup.',
  alternates: { canonical: 'https://roughtools.com/tools/environment/ev-carbon-offset' },
  openGraph: {
    title: `EV Carbon Offset Calculator — Electric vs Gas Savings | RoughTools`,
    description: `Calculate the carbon savings of switching from a gas car to an electric vehicle. Free EV carbon offset calculator.`,
    url: 'https://roughtools.com/tools/environment/ev-carbon-offset',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `EV Carbon Offset Calculator — Electric vs Gas Savings | RoughTools`,
    description: `Calculate the carbon savings of switching from a gas car to an electric vehicle. Free EV carbon offset calculator.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the EV Carbon Offset Calculator free to use?',
    a: 'Yes, the EV Carbon Offset Calculator on RoughTools is completely free with no subscription, usage limits, or premium features. You can compare electric vehicle and petrol car emissions for unlimited scenarios at no cost. RoughTools is funded through non-intrusive advertising, keeping every tool on the platform permanently free for drivers, fleet managers, and anyone considering an EV switch.',
  },
  {
    q: 'Do I need to create an account to use the EV calculator?',
    a: 'No account or registration is required. Open the EV Carbon Offset Calculator, enter your annual mileage, car types, and local electricity grid, and see your results immediately. There is no email address, password, or profile needed at any point. The tool is designed for instant access so you can run a comparison in under two minutes without any sign-up step.',
  },
  {
    q: 'Is my data safe? Does this tool store what I enter?',
    a: 'Your data never leaves your device. All calculations — emission comparisons, cost savings, and break-even estimates — are performed entirely in your browser using JavaScript. Nothing you enter is transmitted to any server, stored in a database, or shared with third parties. Your driving habits and vehicle information remain completely private on your device.',
  },
  {
    q: 'Does the EV Carbon Offset Calculator work on mobile and tablet?',
    a: 'Yes. The calculator is fully responsive and works correctly on smartphones, tablets, and desktop computers. All input fields and results adapt to smaller screens so you can run an EV comparison from any device. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers without requiring any app download or installation.',
  },
  {
    q: 'Which browsers are supported by this EV calculator?',
    a: 'The EV Carbon Offset Calculator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses standard JavaScript and CSS that are universally supported across modern browser engines. Internet Explorer is not supported, as it reached end-of-life in June 2022. Any browser updated within the last five years will work correctly.',
  },
  {
    q: 'How accurate are the EV vs petrol emission calculations?',
    a: 'Emission calculations use published grid carbon intensity figures for major countries and standard vehicle lifecycle emission factors from peer-reviewed sources including the International Council on Clean Transportation (ICCT). EV electricity consumption estimates are based on average real-world efficiency data. The results are estimates — your actual savings depend on your specific vehicles, real-world driving conditions, local electricity mix, and whether you charge from renewable sources. The tool provides a reliable comparative picture suitable for making an informed purchase decision.',
  },
  {
    q: 'Can I use this calculator offline?',
    a: 'Once the page has fully loaded, the EV calculator works offline because all calculation logic is embedded in the browser page with no server calls required. You do not need an active internet connection after the initial load. This is useful for running comparisons in car showrooms or during test drives where Wi-Fi may not be available.',
  },
  {
    q: 'How do I compare EV and petrol car emissions? Step-by-step.',
    a: 'Running a comparison takes about two minutes. Step one: open the EV Carbon Offset Calculator on this page. Step two: enter your annual driving mileage. Step three: select your current or comparison petrol or diesel vehicle type and its fuel efficiency. Step four: select the EV you are comparing and your country or region to set the correct electricity grid carbon intensity. Step five: view the annual CO₂ savings, equivalent number of trees offset, fuel cost savings, and the break-even point at which the EV becomes cheaper to run than the petrol car over its lifetime.',
  },
  {
    q: 'Why use RoughTools EV Calculator instead of other comparison tools?',
    a: 'RoughTools accounts for your local electricity grid carbon intensity, which is the most important variable in determining how green an EV actually is in your region. A country with a coal-heavy grid produces fewer EV savings than one running on renewables. The tool also calculates the financial break-even point alongside environmental savings, giving you the full picture — not just the marketing headline. All calculations run locally with no data collection.',
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'Use the Contact page on RoughTools to report a bug or suggest improvements. Common requests include adding specific vehicle models, expanding the list of countries with local grid data, or adding charging cost inputs. When reporting a bug, include the values you entered and what unexpected result you received. The development team reviews all submissions for future updates.',
  },
  {
    q: 'Do EVs really produce less CO₂ than petrol cars over their lifetime?',
    a: 'Yes, in almost all regions globally, an EV produces significantly less CO₂ over its full lifetime than a comparable petrol or diesel car — even accounting for the higher emissions involved in manufacturing the battery. Studies from the ICCT and Transport & Environment consistently show that EVs in Europe produce 60–70% less lifetime CO₂ than petrol cars today, and this figure improves as electricity grids decarbonise. In countries with very coal-heavy grids, the saving is smaller but EVs still have a lower lifecycle footprint than petrol vehicles in most cases.',
  },
  {
    q: 'What is grid carbon intensity and why does it affect EV emissions?',
    a: 'Grid carbon intensity is the amount of CO₂ produced per kilowatt-hour of electricity generated, measured in grams of CO₂ per kWh (gCO₂/kWh). It varies significantly by country depending on the mix of power sources in use. Countries like Norway (nearly 100% hydro) have grid intensities near zero, while coal-dependent grids can exceed 700 gCO₂/kWh. The higher the grid intensity in your country, the more CO₂ an EV produces indirectly through charging — which is why local grid data is essential for an accurate EV emissions comparison.',
  },
  {
    q: 'How is the financial break-even point calculated for EVs?',
    a: 'The financial break-even point is the number of years at which the total cost of owning and running an EV equals the total cost of the equivalent petrol car, accounting for the higher upfront purchase price of the EV and the lower ongoing fuel and maintenance costs. EVs typically cost more to buy but significantly less to run — electricity costs per mile are approximately 3 to 4 times lower than petrol, and EVs have fewer moving parts so servicing costs are lower. Depending on your mileage and local fuel prices, break-even is typically achieved between 3 and 8 years.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EV Carbon Offset Calculator',
  url: 'https://roughtools.com/tools/environment/ev-carbon-offset',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Compare EV vs petrol CO₂ emissions. Calculate annual carbon savings, fuel cost savings, and financial break-even. Grid-accurate, free, private.',
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
    { '@type': 'ListItem', position: 3, name: 'EV Carbon Offset Calculator', item: 'https://roughtools.com/tools/environment/ev-carbon-offset' },
  ],
}
export default function EvCarbonPage() {
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
            <span className="text-gray-800 font-medium">EV Carbon Offset Calculator</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0">⚡</div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">EV Carbon Offset Calculator</h1>
                <p className="text-emerald-100 text-sm mt-1 max-w-xl">See exactly how much CO₂ you save by switching to electric. Accounts for your local grid emissions, annual mileage, running cost savings, and financial break-even point.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {['⚡ Instant', '🔒 Private', '🆓 Free', '🌍 Grid-Accurate'].map(chip => (
                <span key={chip} className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 text-emerald-100">{chip}</span>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <ToolAdUnit position="top" />
          <EvCarbonClient />
          <ToolAdUnit position="middle" />

          <section className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-3">About EV Carbon Offset Calculator</h2>
            <p className="text-gray-600 leading-relaxed">
              Switching from a petrol or diesel car to an electric vehicle is one of the highest-impact individual actions available to reduce personal carbon emissions — but the actual saving depends heavily on the carbon intensity of your local electricity grid. This calculator uses country-specific grid emission factors alongside real-world EV efficiency data to show you the genuine CO₂ saving for your specific situation.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Beyond the environmental comparison, the tool also calculates annual fuel cost savings and the financial break-even point — the number of years until the lower running costs of the EV offset its higher purchase price. Both figures are essential for making a well-informed decision about switching to electric.
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
                { name: 'Flight Carbon Calculator', href: '/tools/environment/flight-carbon-calculator', desc: 'Calculate flight CO₂ emissions' },
                { name: 'Home Energy Audit', href: '/tools/environment/home-energy-audit', desc: 'Audit home energy efficiency' },
                { name: 'Solar Savings Calculator', href: '/tools/environment/solar-savings-calculator', desc: 'Calculate solar panel ROI' },
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
            toolName="EV Carbon Offset Calculator"
            toolSlug="ev-carbon-offset"
            toolUrl="https://roughtools.com/tools/environment/ev-carbon-offset"
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
