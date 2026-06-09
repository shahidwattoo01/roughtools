import type { Metadata } from 'next'
import Link from 'next/link'
import CarbonFootprintClient from './CarbonFootprintClient'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Carbon Footprint Calculator — Free Personal CO₂ Calculator | RoughTools',
  description: 'Calculate your full annual carbon footprint from home energy, car travel, flights, diet, and shopping. Compare to UK & world average. Get a personalised reduction plan. Free.',
  alternates: { canonical: 'https://roughtools.com/tools/environment/carbon-footprint-calculator' },
  openGraph: {
    title: `Carbon Footprint Calculator — Calculate Your Emissions | RoughTools`,
    description: `Calculate your annual carbon footprint from home energy, transport, and lifestyle. Free online carbon footprint calculator.`,
    url: 'https://roughtools.com/tools/environment/carbon-footprint-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Carbon Footprint Calculator — Calculate Your Emissions | RoughTools`,
    description: `Calculate your annual carbon footprint from home energy, transport, and lifestyle. Free online carbon footprint calculator.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Carbon Footprint Calculator free to use?',
    a: 'Yes, the Carbon Footprint Calculator on RoughTools is completely free with no subscription, usage limits, or premium features. You can calculate your full annual carbon footprint across all lifestyle categories at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for individuals, families, students, and sustainability professionals worldwide.',
  },
  {
    q: 'Do I need to create an account to calculate my carbon footprint?',
    a: 'No account or registration is required. Open the Carbon Footprint Calculator, enter your lifestyle information across each category, and get your personalised results immediately. There is no email address, password, or profile needed at any point. The tool is designed for instant, frictionless access so you can understand your environmental impact in minutes without any sign-up step.',
  },
  {
    q: 'Is my data safe? Does this tool store or share what I enter?',
    a: 'Your data never leaves your device. All calculations are performed entirely in your browser using JavaScript. Nothing you enter — your energy bills, travel habits, diet, or shopping patterns — is transmitted to any server, stored in a database, or shared with third parties. Your personal lifestyle information is completely private and remains only on your device during and after the calculation.',
  },
  {
    q: 'Does the Carbon Footprint Calculator work on mobile and tablet?',
    a: 'Yes. The calculator is fully responsive and works correctly on smartphones, tablets, and desktop computers. All input fields, sliders, and results adapt to smaller screens. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. This makes it easy to complete the calculation wherever you are — at home, at work, or on the go.',
  },
  {
    q: 'Which browsers are supported by this carbon calculator?',
    a: 'The Carbon Footprint Calculator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses standard JavaScript and modern CSS that are universally supported. Internet Explorer is not supported, as it has been end-of-life since June 2022. Any browser updated within the last five years will work correctly with all features.',
  },
  {
    q: 'How accurate is this carbon footprint calculator?',
    a: 'The calculator uses emission factors based on published data from the UK Department for Energy Security and Net Zero (DESNZ), IPCC reports, and peer-reviewed lifecycle assessment studies. Emission factors for electricity, natural gas, vehicle fuel, aviation, and food categories are sourced from established government and scientific databases. Results are estimates — individual circumstances vary, but the tool provides a reliable order-of-magnitude assessment suitable for identifying your highest-impact areas and tracking year-on-year progress.',
  },
  {
    q: 'Can I use the Carbon Footprint Calculator offline?',
    a: 'Once the page has fully loaded, the calculator works offline because all calculation logic is embedded in the browser page with no server calls required. You do not need an active internet connection after the initial load. This makes it useful for completing your carbon footprint assessment in locations with unreliable connectivity, or for sharing the tool with communities in areas with limited internet access.',
  },
  {
    q: 'How do I calculate my carbon footprint? Step-by-step guide.',
    a: 'Completing your carbon footprint assessment takes about 5 to 10 minutes. Step one: open the Carbon Footprint Calculator on this page. Step two: work through each category — home energy (electricity and gas bills), car travel (annual mileage and fuel type), flights (number and distance), diet (meat consumption frequency), and shopping habits. Step three: enter your best estimates for each input — approximate figures are fine. Step four: view your total annual CO₂e, broken down by category, and compare it to the UK and world average. Step five: review the personalised reduction plan showing which changes will have the biggest impact on your footprint.',
  },
  {
    q: 'Why use RoughTools Carbon Footprint Calculator instead of other tools?',
    a: 'RoughTools covers all major emission categories — home energy, car travel, flights, diet, and shopping — in a single integrated calculation that shows the full picture of your personal impact. All data stays in your browser with no account required and no data collection. The tool compares your result to the UK and world average so you have immediate context, and generates a prioritised reduction plan ranked by impact so you know exactly where to focus your efforts first.',
  },
  {
    q: 'How do I report a bug or suggest a new emission category?',
    a: 'Use the Contact page on RoughTools to report a bug or suggest improvements. When reporting a bug, describe which category input caused the unexpected result, what values you entered, and what you expected the output to be. Suggestions for additional categories such as pet ownership, streaming and device usage, or public transport are welcome and reviewed by the development team for future updates.',
  },
  {
    q: 'What is a carbon footprint and how is it measured?',
    a: 'A carbon footprint is the total amount of greenhouse gases produced directly and indirectly by a person, organisation, or activity, expressed in tonnes of CO₂ equivalent (CO₂e). CO₂e is a standard unit that converts all greenhouse gases — including methane and nitrous oxide — into the equivalent amount of CO₂ that would produce the same warming effect over 100 years. Personal carbon footprints typically cover home energy use, transportation, food, and consumer goods. The average UK carbon footprint is approximately 10 tonnes CO₂e per person per year, compared to a global average of about 7 tonnes.',
  },
  {
    q: 'What is CO₂e and why is it used instead of just CO₂?',
    a: 'CO₂e stands for carbon dioxide equivalent. While carbon dioxide (CO₂) is the most prevalent greenhouse gas, other gases like methane (CH₄) and nitrous oxide (N₂O) trap significantly more heat per molecule. Methane is approximately 28 times more potent than CO₂ over 100 years; nitrous oxide is about 273 times more potent. CO₂e converts all these different gases into a single comparable unit by multiplying their mass by their global warming potential (GWP). This allows different activities — flying, eating beef, and burning gas — to be compared on the same scale.',
  },
  {
    q: 'What lifestyle changes reduce carbon footprint the most?',
    a: 'Research consistently shows that the highest-impact individual actions are: switching to a plant-based or reduced-meat diet (can save 0.5 to 1.5 tonnes CO₂e per year), avoiding one long-haul flight (a return transatlantic flight produces approximately 1.5 to 3 tonnes CO₂e per passenger), switching home heating from gas to a heat pump (saves 1 to 2 tonnes per year depending on grid carbon intensity), switching from a petrol car to an EV or going car-free (saves 1 to 2 tonnes per year), and switching to a renewable electricity tariff. Recycling and reducing consumer goods purchases have smaller but meaningful additional impact.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Carbon Footprint Calculator',
  url: 'https://roughtools.com/tools/environment/carbon-footprint-calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Calculate your full annual carbon footprint from home energy, travel, diet, and shopping. Compare to UK and world averages. Free, private, no signup.',
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
    { '@type': 'ListItem', position: 3, name: 'Carbon Footprint Calculator', item: 'https://roughtools.com/tools/environment/carbon-footprint-calculator' },
  ],
}
export default function CarbonFootprintPage() {
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
            <span className="text-gray-800 font-medium">Carbon Footprint Calculator</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0">🌍</div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">Carbon Footprint Calculator</h1>
                <p className="text-emerald-100 text-sm mt-1 max-w-xl">Calculate your total annual CO₂e from home energy, travel, diet, and shopping. Compare to the UK and world average, and get a personalised reduction plan ranked by impact.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {['⚡ Instant', '🔒 Private', '🆓 Free', '📊 8 Categories'].map(chip => (
                <span key={chip} className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 text-emerald-100">{chip}</span>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <ToolAdUnit position="top" />
          <CarbonFootprintClient />
          <ToolAdUnit position="middle" />

          <section className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-3">About Carbon Footprint Calculator</h2>
            <p className="text-gray-600 leading-relaxed">
              Your carbon footprint is the total greenhouse gas emissions caused by your lifestyle, measured in tonnes of CO₂ equivalent (CO₂e) per year. This calculator covers all major personal emission categories — home energy use, car travel, flights, diet choices, and consumer goods shopping — to give you a comprehensive picture of your environmental impact. Emission factors are based on published UK government and IPCC data.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Understanding which parts of your lifestyle contribute most to your footprint is the essential first step to reducing it. The calculator generates a prioritised reduction plan so you can focus your efforts on the changes that will have the greatest impact, rather than making small changes that feel good but move the needle very little.
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
                { name: 'EV Carbon Offset', href: '/tools/environment/ev-carbon-offset', desc: 'Compare EV vs petrol emissions' },
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
            toolName="Carbon Footprint Calculator"
            toolSlug="carbon-footprint-calculator"
            toolUrl="https://roughtools.com/tools/environment/carbon-footprint-calculator"
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
