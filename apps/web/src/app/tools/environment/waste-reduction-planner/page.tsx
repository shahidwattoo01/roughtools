import type { Metadata } from 'next'
import Link from 'next/link'
import WasteReductionClient from './WasteReductionClient'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Waste Reduction Planner — Free Zero Waste Calculator | RoughTools',
  description: 'Build a personalised zero-waste action plan. Estimate your household waste, recycling rate, landfill diversion, and CO₂ from waste — with practical tips. Free, no signup.',
  alternates: { canonical: 'https://roughtools.com/tools/environment/waste-reduction-planner' },
  openGraph: {
    title: `Waste Reduction Planner — Reduce Your Waste | RoughTools`,
    description: `Plan and calculate your waste reduction goals. Track recycling, composting, and landfill diversion. Free online tool.`,
    url: 'https://roughtools.com/tools/environment/waste-reduction-planner',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Waste Reduction Planner — Reduce Your Waste | RoughTools`,
    description: `Plan and calculate your waste reduction goals. Track recycling, composting, and landfill diversion. Free online tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Waste Reduction Planner free to use?',
    a: 'Yes, the Waste Reduction Planner on RoughTools is completely free with no subscription, usage limits, or premium features. You can build a personalised zero-waste action plan and estimate your household waste metrics at no cost. RoughTools is funded through non-intrusive advertising, keeping every tool permanently free for individuals, families, schools, sustainability advocates, and zero-waste communities worldwide.',
  },
  {
    q: 'Do I need to create an account to use the Waste Reduction Planner?',
    a: 'No account or registration is required. Open the Waste Reduction Planner, answer the questions about your household waste habits, and receive your personalised action plan and waste metrics immediately. There is no email address, password, or profile needed at any point. The tool is designed for instant access so you can complete your waste assessment in about five minutes without any sign-up step.',
  },
  {
    q: 'Is my data safe? Does this tool store or share what I enter?',
    a: 'Your data never leaves your device. All waste calculations, recycling rate estimates, landfill diversion projections, and action plan generation happen entirely in your browser using JavaScript. Nothing you enter about your household waste habits is transmitted to any server, stored in a database, or shared with anyone. Your information is completely private and remains only on your device during and after the assessment.',
  },
  {
    q: 'Does the Waste Reduction Planner work on mobile and tablet?',
    a: 'Yes. The tool is fully responsive and works correctly on smartphones, tablets, and desktop computers. All input questions, waste metrics, and action plan cards adapt to smaller screens. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers without requiring any app download or installation. This makes it easy to complete your assessment from any device at home.',
  },
  {
    q: 'Which browsers support this waste reduction tool?',
    a: 'The Waste Reduction Planner works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses standard JavaScript and CSS universally supported across all modern browser engines. Internet Explorer is not supported, as it reached end-of-life in June 2022. Any browser updated within the last five years will work correctly with all features.',
  },
  {
    q: 'How accurate are the waste estimates and recycling rates?',
    a: 'Waste output estimates are benchmarked against DEFRA (UK Department for Environment, Food and Rural Affairs) household waste statistics and Waste and Resources Action Programme (WRAP) data. The average UK household produces approximately 400–500 kg of waste per year, and the tool calibrates your estimate against this baseline using your household size and self-reported habits. Recycling rate calculations use material-specific contamination and recyclability data from WRAP. Results are indicative estimates suitable for understanding your waste profile and identifying improvement priorities, rather than precise measurements.',
  },
  {
    q: 'Can I use the Waste Reduction Planner offline?',
    a: 'Once the page has fully loaded, the Waste Reduction Planner works offline because all calculation logic and action plan data are embedded in the browser page with no server calls required. You do not need an active internet connection after the initial load. This is useful for completing your waste assessment in areas with poor connectivity, or for sharing the tool with community groups in locations with limited internet access.',
  },
  {
    q: 'How do I build a zero-waste action plan? Step-by-step guide.',
    a: 'Building your plan takes about five minutes. Step one: open the Waste Reduction Planner on this page. Step two: answer the questions about your household — number of people, food waste frequency, recycling habits, single-use plastic use, and composting. Step three: answer questions about specific waste categories such as packaging, clothing and textiles, electronics, and garden waste. Step four: view your estimated total annual waste, current recycling rate, amount currently going to landfill, and CO₂ emissions from your waste. Step five: review your personalised prioritised action plan — specific steps ranked by the amount of waste they will divert from landfill.',
  },
  {
    q: 'Why use RoughTools Waste Reduction Planner instead of a generic checklist?',
    a: 'Generic zero-waste checklists give the same advice to everyone regardless of their actual waste profile. RoughTools generates a personalised plan based on your specific household habits — so if you already compost and recycle well, your plan focuses on the remaining gaps like food waste reduction or textile reuse rather than repeating advice you already follow. All processing is local with no data collection, and the action plan is ranked by impact so you know which changes deliver the biggest landfill diversion.',
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'Use the Contact page on RoughTools to report a bug or suggest improvements. Common requests include adding specific waste categories such as nappies or pet waste, expanding to cover countries outside the UK, or adding local recycling facility lookup. When reporting a bug, describe the inputs you entered and what unexpected result or error you received. The development team reviews all submissions for future updates.',
  },
  {
    q: 'What is zero waste and is it actually achievable for a household?',
    a: 'Zero waste is a philosophy and goal that aims to eliminate waste sent to landfill, incinerators, or the environment by redesigning resource use so that products are reused, repaired, or composted rather than discarded. True zero waste — sending nothing to landfill at all — is extremely difficult for most households given the current design of products and packaging. However, most families can realistically achieve an 80–90% reduction in landfill waste through consistent recycling, composting food and garden waste, reducing food waste, buying second-hand, and refusing unnecessary single-use packaging. The 80% milestone is considered the practical near-term target for committed households.',
  },
  {
    q: 'How much CO₂ does household waste produce and why does it matter?',
    a: 'Household waste produces greenhouse gas emissions at multiple stages. Food waste sent to landfill decomposes anaerobically and produces methane — a greenhouse gas approximately 28 times more potent than CO₂ over 100 years. Packaging production, transportation of waste, and incineration also produce CO₂. WRAP estimates that household food waste alone in the UK produces approximately 36 million tonnes of CO₂e annually. At the individual household level, reducing food waste and increasing composting can prevent 0.3 to 0.7 tonnes of CO₂e per year — a meaningful contribution relative to the average UK household footprint.',
  },
  {
    q: 'What are the easiest first steps to reduce household waste significantly?',
    a: 'The highest-impact waste reduction actions for most households are: reducing food waste — the UK wastes approximately 9.5 million tonnes of food per year, and meal planning, proper storage, and using leftovers can cut food waste by 50–70%; composting food scraps and garden waste diverts material from landfill and produces useful compost; using a reusable water bottle, coffee cup, and shopping bags eliminates hundreds of single-use items per year; buying loose fruit and vegetables rather than pre-packaged reduces plastic waste substantially; and donating or selling unwanted clothing, furniture, and electronics rather than binning them extends product life and avoids manufacturing emissions from replacements.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Waste Reduction Planner',
  url: 'https://roughtools.com/tools/environment/waste-reduction-planner',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Estimate household waste, recycling rate, landfill diversion, and CO₂ from waste. Get a prioritised zero-waste action plan. Free, private, no signup.',
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
    { '@type': 'ListItem', position: 3, name: 'Waste Reduction Planner', item: 'https://roughtools.com/tools/environment/waste-reduction-planner' },
  ],
}
export default function WasteReductionPage() {
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
            <span className="text-gray-800 font-medium">Waste Reduction Planner</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0">♻️</div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">Waste Reduction Planner</h1>
                <p className="text-emerald-100 text-sm mt-1 max-w-xl">Estimate your household waste output, recycling rate, and landfill diversion potential — plus a personalised action plan prioritised by the amount of waste each change will eliminate.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {['⚡ Instant', '🔒 Private', '🆓 Free', '🌱 Action Plan'].map(chip => (
                <span key={chip} className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 text-emerald-100">{chip}</span>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <ToolAdUnit position="top" />
          <WasteReductionClient />
          <ToolAdUnit position="middle" />

          <section className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-3">About Waste Reduction Planner</h2>
            <p className="text-gray-600 leading-relaxed">
              The average UK household sends hundreds of kilograms of waste to landfill every year, contributing to greenhouse gas emissions, resource depletion, and environmental pollution. Most households have significant, easily achievable opportunities to reduce this waste — but knowing where to start is not always obvious without understanding your specific waste profile first.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              This planner assesses your household across all major waste categories — food, packaging, textiles, electronics, garden waste, and general rubbish — and generates a personalised action plan ranked by landfill diversion impact. Unlike a generic zero-waste checklist, the recommendations are tailored to your actual habits so you focus on the changes that matter most for your household specifically.
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
                { name: 'Flight Carbon Calculator', href: '/tools/environment/flight-carbon-calculator', desc: 'Calculate flight CO₂ emissions' },
                { name: 'Home Energy Audit', href: '/tools/environment/home-energy-audit', desc: 'Audit home energy efficiency' },
                { name: 'Solar Savings Calculator', href: '/tools/environment/solar-savings-calculator', desc: 'Calculate solar panel ROI' },
              ].map(t => (
                <a key={t.href} href={t.href} className="flex flex-col p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all bg-gray-50 text-gray-900 no-underline">
                  <span className="text-sm font-semibold mb-1">{t.name}</span>
                  <span className="text-xs text-gray-500">{t.desc}</span>
                </a>
              ))}
            </div>
          </section>
          <ToolPageExtras
            toolName="Waste Reduction Planner"
            toolSlug="waste-reduction-planner"
            toolUrl="https://roughtools.com/tools/environment/waste-reduction-planner"
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
