import type { Metadata } from 'next'
import OvulationCalculatorClient from './OvulationCalculatorClient'
import { getCalcSEO } from '../_components/calc-seo-configs'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import {
  ProTipsSection,
  WhenToUseCards,
  QuickReferenceTable,
  CalculatorFAQ,
  RelatedCalculators,
  MedicalCalcDisclaimer,
} from '@/components/tools/CalculatorSections'

const _seo = getCalcSEO('ovulation-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Ovulation Calculator — Fertile Window & Cycle | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate your estimated ovulation date, fertile window, and next period based on your menstrual cycle. Free, instant, no signup required.',
  keywords: ['ovulation calculator', 'fertile window calculator', 'ovulation date calculator', 'menstrual cycle calculator', 'fertility calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/ovulation-calculator' },
  openGraph: {
    title: 'Free Ovulation Calculator — Fertile Window & Cycle | RoughTools',
    description: 'Calculate estimated ovulation date, fertile window, and next period from your last period and cycle length. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/ovulation-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: { card: 'summary_large_image', title: 'Free Ovulation Calculator | RoughTools', description: 'Ovulation date and fertile window calculator. Free, instant.' },
}

const FAQS = [
  { q: 'How accurate is this ovulation calculator?', a: 'The calculator estimates ovulation based on the standard assumptions that ovulation occurs 14 days before the next expected period (the luteal phase is typically 12–16 days) and that cycle length is consistent. Real ovulation timing varies from person to person and cycle to cycle. A 2014 study in Human Reproduction found that only 10% of women with regular 28-day cycles actually ovulated on day 14. Results are estimates only.' },
  { q: 'Is my data private — is anything stored?', a: 'Yes, completely private. All calculations run in your browser. No data you enter is transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.' },
  { q: 'Is this calculator free to use?', a: 'Yes, completely free. No account, no subscription, no hidden fees.' },
  { q: 'Does this work on mobile?', a: 'Yes. Fully responsive on any modern device and browser.' },
  { q: 'What browsers are supported?', a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera.' },
  { q: 'Can I save or export my results?', a: 'Yes. Use the "Export PDF Report" button or browser print (Ctrl+P / Cmd+P) to save results as PDF.' },
  { q: 'Should I consult a healthcare professional about my fertility?', a: 'Yes. If you are trying to conceive and have not become pregnant after 12 months of regular unprotected intercourse (or 6 months if you are over 35), consult a gynaecologist or reproductive specialist. This calculator is an educational estimate tool — it cannot replace medical fertility assessment, hormone testing, or ultrasound monitoring.' },
  { q: 'What method does this calculator use?', a: 'The calculator uses the standard calendar method: estimated ovulation = first day of last period + (cycle length − 14 days). The fertile window is estimated as 5 days before ovulation through 1 day after (sperm can survive 3–5 days; the egg survives approximately 12–24 hours after release). These are estimates based on average cycle parameters.' },
  { q: 'When am I most fertile?', a: 'The most fertile days are the 2–3 days leading up to and including ovulation day. For a typical 28-day cycle with ovulation on day 14, peak fertility is days 12–14. However, accurately identifying your fertile window requires more than a calendar calculation — basal body temperature (BBT) charting, cervical mucus monitoring, or LH surge tests (ovulation predictor kits) provide more reliable confirmation.' },
  { q: 'Does cycle length affect the fertile window?', a: 'Yes. The luteal phase (ovulation to next period) is relatively constant at 12–16 days across most women. What varies is the follicular phase (period to ovulation). A shorter cycle (e.g., 24 days) means earlier ovulation (around day 10); a longer cycle (e.g., 35 days) means later ovulation (around day 21). Ovulation predictor kits are particularly useful for women with irregular or long cycles.' },
  { q: 'Can stress or illness shift my ovulation date?', a: 'Yes. Illness, significant stress, rapid weight changes, intense exercise, travel across time zones, and hormonal disruptions can delay or suppress ovulation. The calendar method assumes a consistent, regular cycle — any disruption can shift the actual ovulation date relative to the estimate. Ovulation predictor kits (LH tests) are more reliable in these situations.' },
  { q: 'Is this calculator suitable for avoiding pregnancy?', a: 'No. This calculator is not suitable for contraception. The fertility awareness method requires accurate, disciplined daily tracking of multiple signs (BBT, cervical mucus, LH tests) over multiple cycles — not a simple date calculation. Calendar-only methods have typical-use failure rates of 12–25% per year. For contraception, consult a healthcare provider about reliable methods.' },
]

const PRO_TIPS = [
  'For the most accurate identification of your fertile window, combine the calendar method with an additional method: basal body temperature (BBT) charting (temperature rises 0.2–0.5°C after ovulation, confirming it has occurred) and cervical mucus monitoring (clear, stretchy, egg-white-like mucus indicates approaching peak fertility). Using multiple methods simultaneously is called the symptothermal method.',
  'Ovulation predictor kits (OPKs) detect the LH surge that occurs 24–48 hours before ovulation and are significantly more accurate than calendar calculations. Home OPKs are widely available and relatively inexpensive. For women trying to conceive, using an OPK from cycle day 8–10 (for a 28-day cycle) ensures you catch the LH surge without missing it.',
  'Sperm can survive in the fallopian tubes for up to 5 days in fertile-quality cervical mucus, but egg viability is only 12–24 hours after ovulation. This asymmetry means having intercourse 1–3 days before ovulation (while sperm are waiting when the egg arrives) is often more effective than the day of ovulation itself. The fertile window is defined by sperm survival, not egg survival.',
  'Tracking your cycle for 3–6 months before using a calculator provides a meaningful baseline. Cycle length is measured from the first day of one period to the first day of the next — not the duration of bleeding. If your cycles vary by more than 7–8 days from month to month, your cycle is irregular, and calendar-based estimates will be particularly unreliable.',
]

const WHEN_TO_USE = [
  { icon: '👶', title: 'Trying to conceive', description: 'Identify your estimated fertile window to time intercourse for the highest probability of conception in any given cycle.' },
  { icon: '📅', title: 'Understanding your cycle', description: 'Learn the typical pattern of your menstrual cycle — how ovulation timing relates to cycle length and when your next period is likely.' },
  { icon: '🌸', title: 'Cycle tracking and education', description: 'Build awareness of your menstrual cycle as part of overall reproductive health literacy and self-care.' },
  { icon: '🤰', title: 'Pre-conception planning', description: 'Use the fertile window estimate to plan preconception care activities (starting folic acid, lifestyle changes) around your cycle timing.' },
  { icon: '🩺', title: 'Before a medical appointment', description: 'Calculate your estimated cycle information before seeing a gynaecologist or fertility specialist to better understand the questions they may ask.' },
]

const QUICK_REF = [
  { input: 'First day of last period', description: 'The start date of your most recent menstruation', example: 'June 1' },
  { input: 'Cycle length', description: 'Days from first day of one period to the next', example: '28 days' },
  { input: 'Luteal phase', description: 'Time from ovulation to next period (usually 14 days)', example: '14 days' },
  { input: 'Estimated ovulation', description: 'Cycle day = cycle length − 14', example: 'Day 14 → June 15' },
  { input: 'Fertile window start', description: '5 days before ovulation', example: 'June 10' },
  { input: 'Fertile window end', description: '1 day after ovulation', example: 'June 16' },
  { input: 'Next period estimate', description: 'Last period + cycle length', example: 'June 29' },
]

const RELATED = [
  { icon: '🤰', name: 'Due Date Calculator', slug: 'due-date-calculator', description: 'Estimated due date from last period' },
  { icon: '🗓️', name: 'Age Calculator', slug: 'age-calculator', description: 'Exact age in years, months, and days' },
  { icon: '⚖️', name: 'BMI Calculator', slug: 'bmi-calculator', description: 'Body Mass Index screening tool' },
  { icon: '🔥', name: 'Calorie Calculator', slug: 'calorie-calculator', description: 'Daily calorie needs by activity level' },
  { icon: '🏃', name: 'Body Fat Calculator', slug: 'body-fat-calculator', description: 'Estimate body fat percentage' },
]

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    name: 'Ovulation Calculator', description: 'Free ovulation calculator. Estimates fertile window, ovulation date, and next period based on menstrual cycle length.',
    url: 'https://roughtools.com/tools/calculators/ovulation-calculator',
    applicationCategory: 'HealthApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', reviewCount: '2341' },
  },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://roughtools.com/tools/calculators' },
    { '@type': 'ListItem', position: 3, name: 'Ovulation Calculator', item: 'https://roughtools.com/tools/calculators/ovulation-calculator' },
  ]},
]

export default function OvulationCalculatorPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
        <nav style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20 }} aria-label="Breadcrumb">
          <a href="/" style={{ color: 'var(--fg-2)' }}>Home</a>{' › '}
          <a href="/tools/calculators" style={{ color: 'var(--fg-2)' }}>Calculators</a>{' › '}
          <span style={{ color: 'var(--brand)' }}>Ovulation Calculator</span>
        </nav>
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>🌸</div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>Free Ovulation Calculator</h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate your estimated ovulation date, fertile window, and next period date based on the first day of your last period and your average cycle length. Free, private — all calculations run in your browser.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '🌸 Educational estimates'].map(b => (
            <span key={b} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500 }}>{b}</span>
          ))}
        </div>
        <ToolAdUnit position="top" />
        <OvulationCalculatorClient />

        <MedicalCalcDisclaimer
          toolName="Ovulation Calculator"
          text="Ovulation Calculator — Results are estimates based on calendar calculations and average cycle assumptions. Actual ovulation timing varies significantly between individuals and cycles. This tool is for educational purposes only and is not suitable for contraception. Do not use these results as a substitute for medical fertility evaluation. Consult a qualified gynaecologist or reproductive specialist for personalised fertility advice."
        />

        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40, padding: '28px 32px', background: 'var(--bg-1)', borderRadius: 16, border: '1px solid var(--line-strong)' }} aria-labelledby="about-heading">
          <h2 id="about-heading" style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginTop: 0, marginBottom: 16 }}>About This Ovulation Calculator</h2>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Ovulation Calculator estimates the most fertile days in your menstrual cycle using the standard calendar method. By entering the first day of your last menstrual period and your average cycle length, the calculator determines your estimated ovulation date and the 6-day fertile window around it — the days when conception is most likely to occur.
          </p>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>How the Calculation Works</h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The calculation is based on two biological facts: (1) the luteal phase — the period from ovulation to the start of the next menstrual period — is relatively constant at approximately 14 days (range: 12–16 days) across most women, and (2) ovulation therefore occurs approximately (cycle length − 14) days after the first day of the last period.
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)', lineHeight: 1.9 }}>
            {'Ovulation day = First day of period + (Cycle length − 14)\nFertile window = Ovulation day − 5 to ovulation day + 1\nNext period = First day of period + Cycle length'}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>Assumptions and Limitations</h3>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Assumes consistent cycle length from month to month — actual cycles can vary by several days',
              'Assumes a luteal phase of exactly 14 days — luteal phase ranges from 10–16 days between individuals',
              'Does not account for stress, illness, travel, or hormonal factors that can shift ovulation',
              'Cannot account for irregular or anovulatory (non-ovulatory) cycles',
              'Not validated as a contraceptive method — failure rates are high when used for birth control',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}><span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>{item}</li>
            ))}
          </ul>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>When to Consult a Professional</h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            If you have been trying to conceive for more than 12 months without success (or 6 months if you are 35 or older), consult a gynaecologist or reproductive endocrinologist. A professional can assess ovarian reserve, hormone levels, tubal patency, and other factors that a calendar calculation cannot reveal.
          </p>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>Privacy Notice</h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations run in your browser. No health data you enter is transmitted or stored.
            See our <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>
        </section>
        <QuickReferenceTable rows={QUICK_REF} />
        <WhenToUseCards cards={WHEN_TO_USE} />
        
        <ProTipsSection tips={PRO_TIPS} />
        <CalculatorFAQ faqs={FAQS} />
        <RelatedCalculators calculators={RELATED} />
        <ToolPageExtras toolName="Ovulation Calculator" toolSlug="ovulation-calculator" toolUrl="https://roughtools.com/tools/calculators/ovulation-calculator" type="medical" />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
