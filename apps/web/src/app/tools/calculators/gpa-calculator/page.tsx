import type { Metadata } from 'next'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import GpaCalculatorClient from './GPACalculatorClient'
import { getCalcSEO } from '../_components/calc-seo-configs'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import {
  ProTipsSection,
  WhenToUseCards,
  QuickReferenceTable,
  CalculatorFAQ,
  RelatedCalculators,
} from '@/components/tools/CalculatorSections'

// ─── Metadata ────────────────────────────────────────────────────────────────

const _seo = getCalcSEO('gpa-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free GPA Calculator — Calculate Your Grade Point Average | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate your weighted GPA instantly. Add courses with letter grades and credit hours for an accurate GPA on the 4.0 scale. Free, no signup required.',
  keywords: ['gpa calculator', 'grade point average calculator', 'weighted gpa', 'college gpa calculator', 'cumulative gpa calculator', 'free gpa calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/gpa-calculator' },
  openGraph: {
    title: 'Free GPA Calculator — Calculate Your Grade Point Average | RoughTools',
    description: 'Calculate weighted GPA with grades and credit hours. A+ through F scale. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/gpa-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free GPA Calculator | RoughTools',
    description: 'Calculate weighted GPA with grades and credit hours. Free, instant.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this GPA calculator?',
    a: 'The calculator is mathematically exact for the standard 4.0 scale using the weighted GPA formula. It applies the same calculation your registrar uses. However, accuracy depends on correct inputs — verify your credit hours and grade conversions match your institution\'s scale. Some schools use slightly different grade point values (e.g., A+ = 4.3) or different credit weighting systems.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. No course names, grades, or credit hours you enter are transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
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
    a: "Use your browser's print function (Ctrl+P or Cmd+P) to save your GPA calculation as a PDF. The Export PDF button, where available, downloads a formatted summary of your courses and GPA.",
  },
  {
    q: 'Should I consult an academic advisor about my GPA?',
    a: 'Yes — especially if your GPA affects academic standing, scholarship eligibility, or graduate school applications. Your academic advisor can explain your institution\'s specific policies on grade replacement, repeat courses, plus/minus grading, and academic probation. For graduate school applications, always verify requirements directly with the target program.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'The standard weighted GPA formula: GPA = Σ(Grade Points × Credit Hours) ÷ Σ(Credit Hours). Grade points on the standard 4.0 scale: A/A+ = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D+ = 1.3, D = 1.0, D− = 0.7, F = 0.0. Each course\'s contribution is grade points × credit hours, and the GPA is the weighted average across all courses.',
  },
  {
    q: 'How do plus and minus grades affect GPA?',
    a: 'Plus and minus grades shift the grade point value by 0.3 points. A B+ = 3.3, B = 3.0, B− = 2.7. Note that A+ is typically 4.0 at most US institutions (not 4.3), though some institutions do award 4.3 for A+. Similarly, D− = 0.7 at most schools. Always check your institution\'s specific grade point table in your student handbook.',
  },
  {
    q: 'What GPA do I need for graduate school?',
    a: 'Requirements vary significantly by program. General guidelines: most master\'s programs require a minimum 3.0 GPA; top programs often expect 3.5+. MBA programs at elite schools average 3.5–3.7. Law school (JD): top-14 schools average 3.7+. Medical school (MD): most competitive applicants have 3.7+. PhD programs: minimum 3.0 is common, competitive candidates average 3.5–3.8+. A strong GRE/GMAT score or research experience can sometimes offset a lower GPA.',
  },
  {
    q: 'Can I recover from a low GPA?',
    a: 'Yes, but it takes time due to how weighted averaging works. A 2.0 GPA after 60 credit hours requires an average 3.5 over the next 60 hours just to reach 2.75 overall. The more credits you have, the harder it is to move the needle quickly. Strategies: take a heavy course load with high grades, use grade replacement if your school allows it, take extra credits in strong subjects, and consider a post-baccalaureate or graduate program to demonstrate academic ability.',
  },
  {
    q: 'What is the difference between weighted and unweighted GPA?',
    a: 'An unweighted GPA treats all courses equally — each course counts the same regardless of credit hours. A weighted GPA (used by this calculator and most colleges) accounts for credit hours, so a 4-credit course has twice the impact of a 2-credit course. Weighted GPA is the standard for undergraduate and graduate academic records. At the high school level, "weighted GPA" sometimes means honors/AP courses count on a 5.0 scale — that is a different concept from the college credit-hour weighting this calculator uses.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Credit hours matter more than the number of courses. A 4-credit science lab where you earn a B contributes 12 grade points; a 1-credit PE elective where you earn an A contributes only 4. Prioritise performance in high-credit courses — they move your GPA far more than low-credit electives. Focus your study time accordingly.',
  'A W (Withdrawal) on your transcript does not affect your GPA, but an F does — permanently — unless your school has a grade replacement policy. If you are in danger of failing, check your school\'s withdrawal deadline and talk to your advisor. Withdrawing is almost always better than earning an F, especially if you can retake the course.',
  'Many institutions have grade forgiveness or course repeat policies that replace the original grade in GPA calculations. If your school allows grade replacement, strategically retaking 1–2 early low-grade courses in your major can significantly boost your cumulative GPA. Not all graduate programs or employers accept grade replacement — check their policies first.',
  'Graduate programs and employers often look at your GPA by major or by upper-division coursework (junior/senior year), not just your overall GPA. A 3.0 overall with a 3.7 in your major is viewed very differently than a 3.0 overall with a 2.8 in your major. Calculate your major-only GPA separately to know your true academic strength in your field.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '📚',
    title: 'End of semester planning',
    description: 'Enter your current grades before finals to calculate what grades you need in each course to hit your target semester GPA — and prioritise where to focus study time.',
  },
  {
    icon: '🎓',
    title: 'Graduate school application',
    description: 'Calculate your exact GPA to compare against program minimums, and model how remaining semesters could improve your cumulative GPA before applying.',
  },
  {
    icon: '🏆',
    title: 'Scholarship applications',
    description: 'Verify your GPA meets scholarship eligibility thresholds, and understand exactly what grades you need next semester to maintain or qualify for merit-based aid.',
  },
  {
    icon: '⚠️',
    title: 'Academic probation check',
    description: 'Calculate whether your current semester GPA will bring your cumulative GPA above the 2.0 minimum required to exit academic probation, and how many more credits at what grade level it will take.',
  },
  {
    icon: '💼',
    title: 'Job application verification',
    description: 'Confirm your GPA calculation before listing it on a resume or job application, and understand whether it meets the minimum thresholds many employers require (commonly 3.0 or 3.5 for competitive positions).',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Course Name', description: 'Optional label to identify each course', example: 'Calculus II' },
  { input: 'Credit Hours', description: 'The credit weight assigned to each course', example: '3 credits' },
  { input: 'Letter Grade', description: 'Grade received — A+ through F', example: 'B+' },
  { input: 'Grade Points', description: 'Numeric value of the letter grade on 4.0 scale', example: '3.3 (B+)' },
  { input: 'Weighted Points', description: 'Grade Points × Credit Hours for each course', example: '9.9 (3.3 × 3)' },
  { input: 'GPA Output', description: 'Total Weighted Points ÷ Total Credit Hours', example: '3.45' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '🔢', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'All percentage calculation modes' },
  { icon: '📊', name: 'Statistics Calculator', slug: 'statistics-calculator', description: 'Mean, median, standard deviation and more' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GPA Calculator',
    description: 'Free weighted GPA calculator. Add courses with letter grades and credit hours to compute Grade Point Average on the 4.0 scale.',
    url: 'https://roughtools.com/tools/calculators/gpa-calculator',
    applicationCategory: 'UtilitiesApplication',
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
      { '@type': 'ListItem', position: 3, name: 'GPA Calculator', item: 'https://roughtools.com/tools/calculators/gpa-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GpaCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>GPA Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          🎓
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free GPA Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate your weighted Grade Point Average on the 4.0 scale.
          Add courses with letter grades and credit hours for an accurate GPA.
          Supports A+ through F. Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📊 Weighted 4.0 scale'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <GpaCalculatorClient />

        <ToolAdUnit position="middle" />

        {/* Quick Reference */}
        <QuickReferenceTable rows={QUICK_REF} />

        {/* When to Use */}
        <WhenToUseCards cards={WHEN_TO_USE} />

        {/* About section */}
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
            About This GPA Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This GPA Calculator computes your weighted Grade Point Average on the standard 4.0 scale used by
            virtually all US colleges and universities. Add any number of courses with their letter grades and
            credit hours, and the calculator instantly produces your accurate weighted GPA — the same calculation
            your registrar uses on your official transcript. It is essential for semester planning, graduate school
            applications, scholarship eligibility checks, and academic standing monitoring.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The calculator uses the standard <strong style={{ color: 'var(--fg)' }}>weighted GPA formula</strong>:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            GPA = Σ(Grade Points × Credit Hours) ÷ Σ(Credit Hours)
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Standard grade point values on the 4.0 scale:{' '}
            <strong style={{ color: '#c4caff' }}>A/A+ = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D+ = 1.3, D = 1.0, D− = 0.7, F = 0.0</strong>.
            For example, a student with: Chemistry (B+, 4 credits = 13.2 points), English (A, 3 credits = 12.0 points), and History (C+, 3 credits = 6.9 points) has a GPA of (13.2 + 12.0 + 6.9) ÷ (4 + 3 + 3) = 32.1 ÷ 10 = 3.21.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Weighted vs Unweighted GPA — and the 4.0 vs 5.0 Scale
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            <strong style={{ color: 'var(--fg)' }}>Weighted GPA (college definition):</strong> Credit hours weight each course — a 4-credit course has twice the GPA impact of a 2-credit course. This is what this calculator computes, and what virtually all colleges use.
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            <strong style={{ color: 'var(--fg)' }}>Weighted GPA (high school definition):</strong> Sometimes refers to a 5.0 scale where AP/IB/honors courses earn extra grade points (A = 5.0 instead of 4.0). This is a different concept — this calculator uses the standard college 4.0 scale only.
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            <strong style={{ color: 'var(--fg)' }}>Cumulative GPA</strong> includes all semesters from your first to your most recent. <strong style={{ color: 'var(--fg)' }}>Semester GPA</strong> covers only one term. Both use the same formula — just different sets of courses. Use this calculator for either by entering only the courses you want to include.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Who Should Use This Calculator
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This tool is for undergraduate and graduate students at US colleges and universities who need an accurate,
            instant GPA calculation. It is particularly useful for students who want to model &quot;what if&quot; scenarios
            — entering hypothetical final exam grades to see the minimum performance needed to reach a target GPA.
            It is also useful for parents supporting students, academic advisors running quick calculations, and
            students evaluating whether a course withdrawal or grade replacement makes mathematical sense.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this GPA calculator are performed entirely in your browser. No course names, grades,
            or credit hours you enter are transmitted to any server, stored in any database, or shared with third parties.
            See our{' '}
            <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>{' '}
            for full details.
          </p>
        </section>

        {/* Pro Tips */}
        <ProTipsSection tips={PRO_TIPS} />

        {/* FAQ */}
        <CalculatorFAQ faqs={FAQS} />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="GPA Calculator"
          toolSlug="gpa-calculator"
          toolUrl="https://roughtools.com/tools/calculators/gpa-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
