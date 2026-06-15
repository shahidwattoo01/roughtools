import type { Metadata } from 'next'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import DueDateCalculatorClient from './DueDateCalculatorClient'
import { getCalcSEO } from '../_components/calc-seo-configs'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import {
  ProTipsSection,
  WhenToUseCards,
  QuickReferenceTable,
  CalculatorFAQ,
  RelatedCalculators,
  MedicalCalcDisclaimer,
} from '@/components/tools/CalculatorSections'

// ─── Metadata ────────────────────────────────────────────────────────────────

const _seo = getCalcSEO('due-date-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Pregnancy Due Date Calculator — Naegele\'s Rule | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate your pregnancy due date from your last menstrual period or conception date. See your current week, trimester, and key milestone dates. Free due date calculator — no signup.',
  keywords: ['due date calculator', 'pregnancy due date calculator', 'when is my due date', 'pregnancy calculator', 'Naegele rule calculator', 'free due date calculator', 'pregnancy week calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/due-date-calculator' },
  openGraph: {
    title: 'Free Pregnancy Due Date Calculator — Naegele\'s Rule | RoughTools',
    description: 'Calculate your pregnancy due date from LMP or conception date. See trimester and milestones. Free, no signup.',
    url: 'https://roughtools.com/tools/calculators/due-date-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Due Date Calculator | RoughTools',
    description: 'Calculate pregnancy due date, trimester, and milestone dates. Free, instant.',
  },
}

// ─── FAQ data (12 questions) ──────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this due date calculator?',
    a: 'The calculator applies Naegele\'s Rule, which assumes a 28-day cycle and ovulation on day 14. For women with regular 28-day cycles, this is highly accurate as a starting estimate. However, only about 4–5% of babies are born on their exact due date. Most births (roughly 80%) occur within two weeks either side. Early ultrasound dating (at 6–10 weeks) is more accurate than LMP-based calculation and is used clinically to confirm or adjust the estimated due date.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. No data you enter — including your LMP date or personal details — is transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
  },
  {
    q: 'Is this calculator free to use?',
    a: 'Yes, completely free. No account, no subscription, no hidden fees. RoughTools is ad-supported — using it costs you nothing.',
  },
  {
    q: 'Does this work on mobile?',
    a: 'Yes. The calculator is fully responsive and works on any device — smartphone, tablet, or desktop — in any modern browser.',
  },
  {
    q: 'What browsers are supported?',
    a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera. Internet Explorer is not supported. We recommend Chrome or Firefox for the best experience.',
  },
  {
    q: 'Can I save or export my results?',
    a: 'Yes. Use the "Export PDF Report" button to download a formatted PDF of your inputs and results. You can also use your browser\'s print function (Ctrl+P or Cmd+P) to save as PDF.',
  },
  {
    q: 'Should I consult my OB or midwife about my due date?',
    a: 'Absolutely. This calculator provides an initial estimate for planning purposes, but your official estimated due date (EDD) will be confirmed or adjusted by your OB-GYN or midwife — typically using early ultrasound measurements of the embryo or fetus. Your care provider will also assess whether your cycle length or known conception date should adjust the standard calculation. Do not rely solely on this calculator for medical decisions.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'Naegele\'s Rule: Due Date = First day of Last Menstrual Period (LMP) + 280 days (40 weeks). Equivalently: Due Date = LMP − 3 months + 7 days + 1 year. The formula assumes a 28-day cycle and ovulation at day 14. If your cycle is longer (e.g., 35 days), the calculator adjusts by adding the extra days beyond 28. Gestational age is measured in weeks from the LMP date.',
  },
  {
    q: 'What if my cycle is irregular or shorter/longer than 28 days?',
    a: 'For cycles differing from 28 days, the due date is adjusted accordingly. For a 35-day cycle, add 7 extra days to the standard due date (35 − 28 = 7). For a 21-day cycle, subtract 7 days. This calculator allows you to enter your cycle length so it can make this adjustment automatically. However, for significant irregularity (cycles varying by more than 5 days), early ultrasound dating is more reliable than any LMP-based formula.',
  },
  {
    q: 'How is an IVF due date calculated differently?',
    a: 'For IVF pregnancies, the due date is calculated from the egg retrieval date (or embryo transfer date), not the LMP. For a Day 3 embryo transfer: due date = transfer date + 263 days. For a Day 5 (blastocyst) transfer: due date = transfer date + 261 days. IVF due dates are generally more precise than LMP-based dates because the conception date is known exactly. Your reproductive endocrinologist will confirm the EDD at your first ultrasound.',
  },
  {
    q: 'What is the "overdue" policy — when do doctors induce?',
    a: 'Most obstetric guidelines consider a pregnancy post-term at 42 weeks (14 days past the due date). Between 41 and 42 weeks, most care providers discuss induction due to increasing risks to the placenta and fetal wellbeing. Many practices now offer induction at 39–41 weeks based on studies showing similar or better outcomes compared to waiting. Your OB or midwife will discuss options based on your specific situation, cervical readiness, and local guidelines.',
  },
  {
    q: 'When should I call my doctor or midwife during pregnancy?',
    a: 'Call your care provider promptly if you experience: heavy bleeding or large clots, severe abdominal pain or cramping, no fetal movement for more than 12 hours after 28 weeks, sudden severe headache, vision changes, significant facial or hand swelling, fever above 38°C (100.4°F), painful or burning urination, or your waters breaking before 37 weeks. These may be signs of complications requiring immediate medical attention.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'An early ultrasound scan at 6–10 weeks is more accurate than LMP-based calculation for dating your pregnancy. The fetal crown-rump length measurement at this stage can pinpoint gestational age to within ±5 days. If the ultrasound date differs from your LMP date by more than 7 days, your care provider will typically revise the estimated due date to match the ultrasound measurement.',
  'Your due date is a midpoint, not a deadline. Normal term pregnancy spans 37–42 weeks. About 80% of babies arrive between 38 and 41 weeks — only 4–5% land on the actual due date. Plan your preparations to be ready 2 weeks before your due date, and try not to feel overdue until after 41 weeks.',
  'Start tracking your baby\'s movements from approximately 28 weeks (third trimester). You should feel 10 movements within a 2-hour window. Reduced or absent movement is the most important warning sign to monitor in late pregnancy. Apps like "Count the Kicks" can help you track patterns. If in doubt, contact your maternity unit immediately — they would rather check and reassure you than have you wait.',
  'Pack your hospital bag by 36 weeks, not 40 weeks. First-time mothers statistically go into labour a few days after their due date on average, but up to 10% of first-time mothers go into labour before 37 weeks. Having your bag ready at 36 weeks means you are always prepared, with a safety margin of 4 weeks before your due date.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🗓️',
    title: 'Maternity leave planning',
    description: 'Calculate your due date to determine the optimal start date for maternity leave, typically 11 weeks before in the UK or negotiated based on your due date.',
  },
  {
    icon: '🎁',
    title: 'Baby shower scheduling',
    description: 'Baby showers are traditionally held 4–6 weeks before the due date. Calculate your due date to pick a date that falls in the comfortable third trimester window.',
  },
  {
    icon: '🏠',
    title: 'Childcare arrangement',
    description: 'Childcare waiting lists can be 12–18 months long. Knowing your due date early helps you get on the right waitlists before your baby arrives.',
  },
  {
    icon: '✈️',
    title: 'Family travel planning',
    description: 'Airlines restrict travel from 36 weeks for single pregnancies. Calculate your due date to identify the window when international travel is still possible.',
  },
  {
    icon: '📢',
    title: 'Birth announcement preparation',
    description: 'Plan your birth announcement timing, photographer bookings, and social media posts — knowing your approximate due date window helps you prepare in advance.',
  },
]

// ─── Quick Reference ──────────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'LMP Date', description: 'First day of your Last Menstrual Period', example: '1 September 2025' },
  { input: 'Cycle Length', description: 'Your typical menstrual cycle length in days', example: '28 days (default)' },
  { input: 'Due Date', description: 'Estimated delivery date (LMP + 280 days)', example: '8 June 2026' },
  { input: 'Gestational Age Now', description: 'How many weeks pregnant you are today', example: '32 weeks 4 days' },
  { input: 'Trimester', description: '1st (weeks 1–12), 2nd (13–27), 3rd (28–40)', example: 'Third trimester' },
  { input: 'Weeks Remaining', description: 'Weeks from today until the estimated due date', example: '7 weeks 3 days' },
]

// ─── Related Calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '🎂', name: 'Age Calculator', slug: 'age-calculator', description: 'Calculate exact age in years, months, and days' },
  { icon: '🔥', name: 'Calorie Calculator', slug: 'calorie-calculator', description: 'Calculate calorie needs (including pregnancy)' },
  { icon: '⚖️', name: 'BMI Calculator', slug: 'bmi-calculator', description: 'Check body mass index' },
  { icon: '📐', name: 'Body Fat Calculator', slug: 'body-fat-calculator', description: 'Estimate body fat percentage' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Due Date Calculator',
    description: 'Free pregnancy due date calculator using Naegele\'s Rule. Calculates EDD from LMP or conception date with trimester and milestone dates.',
    url: 'https://roughtools.com/tools/calculators/due-date-calculator',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://roughtools.com/tools/calculators' },
      { '@type': 'ListItem', position: 3, name: 'Due Date Calculator', item: 'https://roughtools.com/tools/calculators/due-date-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DueDateCalculatorPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20 }} aria-label="Breadcrumb">
          <a href="/" style={{ color: 'var(--fg-2)' }}>Home</a>
          {' › '}
          <a href="/tools/calculators" style={{ color: 'var(--fg-2)' }}>Calculators</a>
          {' › '}
          <span style={{ color: 'var(--brand)' }}>Due Date Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          🤰
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Pregnancy Due Date Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate your pregnancy due date using Naegele&apos;s Rule — the standard obstetric method used worldwide.
          Enter your last menstrual period date (or conception date) to get your estimated due date, current gestational age,
          trimester, and key milestone dates. Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '👶 Naegele\'s Rule'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <DueDateCalculatorClient />

        <ToolAdUnit position="middle" />

        {/* Quick Reference */}
        <section
          style={{
            marginTop: 40,
            padding: '28px 32px',
            background: 'var(--bg-1)',
            borderRadius: 16,
            border: '1px solid var(--line-strong)',
          }}
          aria-labelledby="about-heading"
        >
          <h2 id="about-heading" style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginTop: 0, marginBottom: 16 }}>
            About This Due Date Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This pregnancy due date calculator uses <strong style={{ color: 'var(--fg)' }}>Naegele&apos;s Rule</strong> — the standard obstetric
            formula used by obstetricians and midwives worldwide to estimate the Estimated Due Date (EDD). Named after German obstetrician
            Franz Naegele (1778–1851), the rule states that a pregnancy lasts 280 days (40 weeks) from the first day of the last menstrual
            period. It is the basis for due date calculation in most electronic health record systems and obstetric apps globally.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How Due Dates Are Calculated
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The standard Naegele&apos;s Rule calculation:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Due Date = LMP + 280 days (40 weeks)<br />
            Gestational Age = (Today − LMP) ÷ 7  [weeks]
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Equivalently: subtract 3 months from the LMP date, then add 7 days and 1 year. For cycles other than 28 days, the calculator
            adjusts the due date by the difference between your cycle length and 28 days (e.g., a 35-day cycle pushes the due date 7 days later).
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Why Only 5% of Babies Are Born on Their Due Date
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The 280-day estimate is a population average, not a biological certainty. The duration of human pregnancy varies naturally by
            several weeks. Studies show that among uncomplicated pregnancies, the actual range of natural labour onset spans approximately
            37 to 42 weeks, with the median for first-time mothers approximately 5 days after the EDD. A due &ldquo;date&rdquo; is more accurately
            thought of as a due &ldquo;fortnight&rdquo; — the midpoint of a normal 4-week window.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Alternative Due Date Methods
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Several clinical methods can confirm or supersede the LMP-based due date:
          </p>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'First-trimester ultrasound (6–10 weeks): Crown-rump length measurement is the most accurate method, reliable to ±5 days.',
              'Second-trimester ultrasound (14–20 weeks): Accurate to ±10–14 days — less precise than first-trimester scanning.',
              'IVF transfer date: When the conception date is known exactly, due date calculation is highly precise.',
              'Known ovulation date: If tracked via basal body temperature or ovulation test, can be used instead of assuming Day 14.',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>{item}
              </li>
            ))}
          </ul>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Three Trimesters
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Pregnancy is divided into three trimesters of roughly 13 weeks each. The <strong style={{ color: 'var(--fg)' }}>first trimester</strong> (weeks 1–12)
            is the period of highest miscarriage risk and most rapid embryonic development. The <strong style={{ color: 'var(--fg)' }}>second trimester</strong> (weeks 13–27)
            is typically the most comfortable — morning sickness usually resolves, energy returns, and the baby&apos;s movements become detectable.
            The <strong style={{ color: 'var(--fg)' }}>third trimester</strong> (weeks 28–40) is the final growth phase, during which the baby gains
            most of its birth weight and the lungs mature in preparation for delivery.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations run entirely in your browser. No data you enter — including your LMP date — is transmitted to any server
            or stored anywhere. Your information stays completely private on your device.
          </p>
        </section>
        <QuickReferenceTable rows={QUICK_REF} />

        {/* When to Use */}
        <WhenToUseCards cards={WHEN_TO_USE} />

        {/* About section */}
        

        {/* Pro Tips */}
        <ProTipsSection tips={PRO_TIPS} />

        {/* FAQ */}
        <CalculatorFAQ faqs={FAQS} />

        {/* Medical Disclaimer */}
        <MedicalCalcDisclaimer
          toolName="Due Date Calculator"
          text="Due Date Calculator — Results are estimates based on Naegele's Rule and are intended for informational and planning purposes only. This calculator does not constitute medical advice. Your official Estimated Due Date (EDD) should be confirmed by a qualified OB-GYN, midwife, or other licensed obstetric care provider using clinical assessment, including early ultrasound. Do not make medical or clinical decisions based on this calculator alone. If you have any concerns about your pregnancy, contact your healthcare provider immediately."
        />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Due Date Calculator"
          toolSlug="due-date-calculator"
          toolUrl="https://roughtools.com/tools/calculators/due-date-calculator"
          type="medical"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
