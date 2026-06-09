import type { Metadata } from 'next'
import Link from 'next/link'
import FlightCarbonClient from './FlightCarbonClient'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Flight Carbon Calculator — Free Flight Emissions Tool | RoughTools',
  description: 'Calculate the carbon footprint of any flight. Get CO₂ per passenger by cabin class, equivalent car miles, and offset cost. Includes radiative forcing. Free, no signup.',
  alternates: { canonical: 'https://roughtools.com/tools/environment/flight-carbon-calculator' },
  openGraph: {
    title: `Flight Carbon Calculator — Aviation Emissions | RoughTools`,
    description: `Calculate the CO2 emissions from any flight. Estimate your aviation carbon footprint. Free online flight carbon calculator.`,
    url: 'https://roughtools.com/tools/environment/flight-carbon-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Flight Carbon Calculator — Aviation Emissions | RoughTools`,
    description: `Calculate the CO2 emissions from any flight. Estimate your aviation carbon footprint. Free online flight carbon calculator.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Flight Carbon Calculator free to use?',
    a: 'Yes, the Flight Carbon Calculator on RoughTools is completely free with no subscription, usage limits, or premium tier. You can calculate the carbon footprint of unlimited flights at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for travellers, business travel managers, sustainability teams, and frequent flyers.',
  },
  {
    q: 'Do I need to create an account to calculate flight emissions?',
    a: 'No account or registration is required. Open the Flight Carbon Calculator, select your departure and destination airports and cabin class, and get your results immediately. There is no email address, password, or profile needed at any point. The tool is designed for instant access so you can check the footprint of a flight in under 30 seconds without any sign-up step.',
  },
  {
    q: 'Is my data safe? Does this tool store what I enter?',
    a: 'Your data never leaves your device. All flight emission calculations are performed entirely in your browser using pre-loaded distance data and emission factors. Nothing you enter — your route, cabin class, or frequency of travel — is transmitted to any server, stored in a database, or shared with anyone. Your travel information is completely private and stays only on your device.',
  },
  {
    q: 'Does the Flight Carbon Calculator work on mobile and tablet?',
    a: 'Yes. The calculator is fully responsive and works correctly on smartphones, tablets, and desktop computers. The airport selector, cabin class options, and results adapt to all screen sizes. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. You can check a flight emission figure while booking travel or comparing itineraries on any device.',
  },
  {
    q: 'Which browsers are supported by this flight calculator?',
    a: 'The Flight Carbon Calculator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses standard JavaScript and CSS that are universally supported. Internet Explorer is not supported, as it reached end-of-life in June 2022. Any modern browser updated within the last five years will work correctly with all features.',
  },
  {
    q: 'How accurate are the flight carbon emission estimates?',
    a: 'Emission calculations are based on the ICAO Carbon Emissions Calculator methodology combined with radiative forcing multipliers recommended by the UK Government\'s Department for Energy Security and Net Zero (DESNZ). Great-circle distances between airports are used with a detour factor to account for real flight paths. Cabin class multipliers reflect actual seat space and per-seat fuel consumption differences. Results are estimates and may differ from airline-reported figures, which use varying methodologies, but the tool produces results consistent with the UK government\'s official carbon reporting guidance.',
  },
  {
    q: 'Can I use the Flight Carbon Calculator offline?',
    a: 'Once the page has fully loaded, the calculator works offline because all airport distance data and emission factors are pre-loaded in the browser with no server calls required during calculation. You do not need an active internet connection after the initial load. This is useful for checking flight footprints while travelling, in airport lounges with poor Wi-Fi, or during meetings where connectivity is limited.',
  },
  {
    q: 'How do I calculate a flight\'s carbon footprint? Step-by-step.',
    a: 'Calculating flight emissions takes under a minute. Step one: open the Flight Carbon Calculator on this page. Step two: select your departure airport from the dropdown list of 24 major global airports. Step three: select your destination airport. Step four: choose your cabin class — Economy, Premium Economy, Business, or First — as this significantly affects your per-seat emission share. Step five: select whether the flight is one-way or return. Step six: view your CO₂e per passenger, the equivalent number of car miles driven, and the Gold Standard carbon offset cost to compensate for the emission.',
  },
  {
    q: 'Why use RoughTools Flight Carbon Calculator instead of other tools?',
    a: 'RoughTools includes radiative forcing in its calculation — a scientifically important factor that accounts for the additional warming effect of aviation emissions released at altitude, which approximately doubles the effective climate impact compared to ground-level CO₂ alone. Many flight calculators omit this factor, understating aviation\'s true climate impact. The tool also breaks down results by cabin class and provides an offset cost estimate so you can take immediate action.',
  },
  {
    q: 'How do I report a bug or request additional airports?',
    a: 'Use the Contact page on RoughTools to report a bug or request additional airports. When reporting a bug, include the origin and destination airports you selected, the cabin class chosen, and what unexpected result you received. Airport addition requests are prioritised by traffic volume — high-frequency routes from commonly requested airports are added first. The team reviews all submissions for future updates.',
  },
  {
    q: 'What is radiative forcing and why does it matter for flights?',
    a: 'Radiative forcing describes the additional climate warming effect caused by aviation emissions released at high altitude. When aircraft burn fuel, they emit CO₂ but also water vapour, nitrogen oxides, and contrail-forming particles — all at cruising altitude where they have a disproportionately larger warming effect than the same emissions released at ground level. The IPCC and UK government estimate that aviation\'s total climate impact is approximately 1.7 to 2.5 times greater than its CO₂ emissions alone once these altitude effects are accounted for. Applying a radiative forcing multiplier gives a more accurate representation of a flight\'s true climate impact.',
  },
  {
    q: 'Why does cabin class affect flight carbon emissions?',
    a: 'Cabin class affects flight carbon emissions because different cabins occupy different amounts of physical space per passenger. A Business Class seat typically takes up two to four times more floor space than an Economy seat, meaning the passenger is allocated a proportionally larger share of the aircraft\'s total fuel burn. First Class seats occupy even more space. The per-passenger emission is calculated by dividing the total flight fuel burn by the number of seat-equivalents on the aircraft, weighted by cabin area. Flying Business Class on a long-haul route can produce three to four times more CO₂ per passenger than the same flight in Economy.',
  },
  {
    q: 'What is a carbon offset and does buying one cancel out flight emissions?',
    a: 'A carbon offset is a verified reduction in greenhouse gas emissions made elsewhere to compensate for emissions produced in one place. When you purchase a carbon offset for a flight, the money funds projects that reduce emissions — such as renewable energy installations, reforestation, or methane capture — by an amount equivalent to your flight\'s footprint. Gold Standard and Verra-certified offsets are independently audited for quality. Offsets do not eliminate emissions — the CO₂ from your flight still enters the atmosphere immediately — but they fund equivalent reductions elsewhere. Many climate scientists recommend reducing flight frequency first and offsetting only unavoidable travel.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Flight Carbon Calculator',
  url: 'https://roughtools.com/tools/environment/flight-carbon-calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Calculate flight CO₂ per passenger by cabin class with radiative forcing. Includes equivalent car miles and offset cost. Free, private, 24 airports.',
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
    { '@type': 'ListItem', position: 3, name: 'Flight Carbon Calculator', item: 'https://roughtools.com/tools/environment/flight-carbon-calculator' },
  ],
}
export default function FlightCarbonPage() {
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
            <span className="text-gray-800 font-medium">Flight Carbon Calculator</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0">✈️</div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">Flight Carbon Calculator</h1>
                <p className="text-emerald-100 text-sm mt-1 max-w-xl">Calculate the carbon footprint of any flight between 24 major airports. Includes cabin class multipliers, radiative forcing, equivalent car miles, and Gold Standard offset cost.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {['⚡ Instant', '🔒 Private', '🆓 Free', '✈️ 24 Airports'].map(chip => (
                <span key={chip} className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 text-emerald-100">{chip}</span>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <ToolAdUnit position="top" />
          <FlightCarbonClient />
          <ToolAdUnit position="middle" />

          <section className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-3">About Flight Carbon Calculator</h2>
            <p className="text-gray-600 leading-relaxed">
              Aviation is one of the most carbon-intensive activities an individual can undertake. A single long-haul return flight can exceed the entire annual carbon footprint of many people in developing countries. This calculator uses ICAO methodology with radiative forcing multipliers to provide a scientifically rigorous estimate of flight emissions per passenger, accounting for cabin class, route distance, and the additional warming effect of high-altitude emissions.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Understanding the true footprint of individual flights — including Business and First Class, where per-passenger emissions are two to four times higher than Economy — is essential for making informed travel decisions and accurately accounting for aviation in personal or corporate carbon reporting.
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
                { name: 'EV Carbon Offset', href: '/tools/environment/ev-carbon-offset', desc: 'Compare EV vs petrol emissions' },
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
            toolName="Flight Carbon Calculator"
            toolSlug="flight-carbon-calculator"
            toolUrl="https://roughtools.com/tools/environment/flight-carbon-calculator"
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
