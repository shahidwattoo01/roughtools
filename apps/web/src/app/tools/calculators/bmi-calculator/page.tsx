import type { Metadata } from 'next'
import BMICalculator from '@/components/tools/calculators/BMICalculator'
import ToolAdUnit from '@/components/ToolAdUnit'
import MedicalDisclaimer from '@/components/MedicalDisclaimer'
import {
  ToolHowTo,
  ToolFormula,
  ToolExample,
  ToolCommonMistakes,
} from '@/components/ToolContent'
import { JsonLd } from '@/components/JsonLd'
import { getCalcSEO } from '../_components/calc-seo-configs'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import {
  ProTipsSection,
  WhenToUseCards,
  QuickReferenceTable,
  MedicalCalcDisclaimer,
  CalculatorFAQ,
  RelatedCalculators,
} from '@/components/tools/CalculatorSections'

// ─── Metadata ────────────────────────────────────────────────────────────────

const _seo = getCalcSEO('bmi-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'BMI Calculator — Free Body Mass Index Calculator | Roughtools',
  description: _seo?.metaDescription ?? 'Calculate your BMI (Body Mass Index) instantly using the standard WHO formula. Supports metric (kg/cm) and imperial (lbs/in). Shows BMI category, healthy weight range, and visual BMI scale.',
  keywords: [
    'bmi calculator',
    'body mass index calculator',
    'bmi chart',
    'healthy weight calculator',
    'free bmi calculator online',
    'bmi formula',
    'bmi for adults',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/bmi-calculator' },
  openGraph: {
    title: _seo?.seoTitle ?? 'BMI Calculator — Free Body Mass Index Calculator | Roughtools',
    description: _seo?.metaDescription ?? 'Calculate your BMI instantly. Metric & imperial support. Shows category, healthy range, and visual scale. Free, no sign-up.',
    url: 'https://roughtools.com/tools/calculators/bmi-calculator',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: _seo?.seoTitle ?? 'BMI Calculator | Roughtools',
    description: _seo?.metaDescription ?? 'Calculate your BMI instantly. Free, no signup required.',
  },
}

// ─── Content data ────────────────────────────────────────────────────────────

const STEPS = [
  {
    name: 'Choose your unit system',
    text: 'Select "Metric" if you know your measurements in kilograms and centimetres, or "Imperial" if you use pounds and inches. The calculator switches inputs automatically.',
  },
  {
    name: 'Enter your weight',
    text: 'Type your current weight. For metric use kilograms (e.g. 70 kg); for imperial use pounds (e.g. 154 lb). Use your weight without clothing for the most accurate result.',
  },
  {
    name: 'Enter your height',
    text: 'Type your height in centimetres (metric) or feet and inches (imperial). Measure yourself standing upright against a wall, barefoot, for best accuracy.',
  },
  {
    name: 'Read your results',
    text: 'The calculator instantly shows your BMI number, weight category (Underweight / Normal / Overweight / Obese), your healthy weight range for your height, and a visual BMI scale so you can see where you sit.',
  },
]

const FAQ_ITEMS = [
  {
    q: 'How accurate is this BMI calculator?',
    a: 'The calculator is mathematically exact — it applies the standard WHO BMI formula. However, BMI itself is a screening metric with known limitations. It cannot distinguish between fat and muscle, does not account for fat distribution, and was validated primarily on European populations. Use the result as a starting point for a conversation with a healthcare provider, not as a clinical diagnosis.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser. No data you enter — weight, height, or any other input — is transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
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
    a: 'Yes. Use the "Export PDF Report" button to download a formatted PDF of your inputs and BMI result. You can also use your browser\'s print function (Ctrl+P or Cmd+P) to save as PDF.',
  },
  {
    q: 'Should I consult a healthcare professional about my BMI?',
    a: 'Yes, especially if your BMI is outside the 18.5–24.9 normal range. A clinician will consider your full medical history, body composition, lifestyle, and other measurements before recommending any changes. BMI is one data point — a qualified healthcare provider gives you the full picture.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'Metric: BMI = weight (kg) ÷ height (m)². Example: 70 kg ÷ (1.75)² = 22.9. Imperial: BMI = (weight in lb × 703) ÷ (height in in)². Example: (154 lb × 703) ÷ (69)² = 22.7. This is the same formula used by the WHO and CDC.',
  },
  {
    q: 'What is BMI and what does the number mean?',
    a: 'BMI (Body Mass Index) is a number derived from your weight and height. It is a widely used screening tool to categorise weight status. A BMI under 18.5 is Underweight; 18.5–24.9 is Normal weight; 25–29.9 is Overweight; and 30 or above is classified as Obese. The categories come from World Health Organization (WHO) guidelines.',
  },
  {
    q: 'Does BMI apply equally to all ethnicities?',
    a: 'No. The standard WHO thresholds were established primarily for European populations. Many clinicians and health authorities use lower BMI cutoffs for Asian adults: ≥23 for overweight and ≥27.5 for obese, because health risks (type 2 diabetes, cardiovascular disease) appear at lower BMI values in Asian populations. The World Health Organization has acknowledged these ethnic differences in its guidelines.',
  },
  {
    q: 'What is a healthy BMI for adults?',
    a: 'For most adults aged 18–65, the WHO considers 18.5–24.9 as the healthy (Normal) range. For adults over 65, some research suggests a slightly higher range (22–27) may be associated with better outcomes, as lower BMI in older adults can sometimes indicate muscle loss. These are guidelines — always discuss your result with a healthcare provider.',
  },
  {
    q: 'How does BMI differ for children vs adults?',
    a: 'Child BMI (BMI-for-age) is calculated using the same formula but then plotted on age- and sex-specific growth charts as a percentile. A child\'s healthy BMI range changes with age and sex. The same BMI number means very different things for a 10-year-old vs. a 40-year-old. Use the CDC or WHO growth charts and consult a paediatrician for children under 18.',
  },
]

const MISTAKES = [
  {
    mistake: 'Entering height in feet directly into the centimetre field.',
    fix: 'Switch the unit toggle to Imperial before entering feet/inches, or convert: 5 ft 9 in = 175.3 cm.',
  },
  {
    mistake: 'Using weight with clothes and shoes on.',
    fix: 'Weigh yourself barefoot, in light clothing or none, ideally in the morning before eating.',
  },
  {
    mistake: 'Treating BMI as the only health indicator.',
    fix: 'Pair BMI with waist circumference, blood pressure, cholesterol, and a conversation with your doctor for a complete picture.',
  },
  {
    mistake: 'Applying adult BMI charts to children and teenagers.',
    fix: 'Children need age- and sex-specific BMI percentile charts (CDC or WHO). Use a dedicated child BMI calculator instead.',
  },
]

const RELATED = [
  { icon: '🏃', name: 'Body Fat Calculator', slug: 'body-fat-calculator', description: 'Estimate body fat % beyond BMI' },
  { icon: '🔥', name: 'Calorie Calculator', slug: 'calorie-calculator', description: 'Daily calorie needs by activity level' },
  { icon: '🗓️', name: 'Age Calculator', slug: 'age-calculator', description: 'Exact age in years, months, and days' },
  { icon: '🤰', name: 'Due Date Calculator', slug: 'due-date-calculator', description: 'Estimated due date from last period' },
  { icon: '🌸', name: 'Ovulation Calculator', slug: 'ovulation-calculator', description: 'Fertile window and ovulation date' },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const BMI_PRO_TIPS = [
  'BMI does not distinguish between muscle and fat. Athletes and bodybuilders often register as "overweight" despite having very low body fat. Use BMI alongside body fat percentage and waist circumference for a complete picture.',
  'BMI thresholds were established for European populations. Many clinicians use lower BMI cutoffs for Asian adults (≥23 for overweight, ≥27.5 for obese) because health risks appear at lower BMI values.',
  'Waist circumference is often a better predictor of metabolic health risk than BMI. A waist over 35 inches (89 cm) for women or 40 inches (102 cm) for men signals elevated cardiovascular risk regardless of BMI score.',
  'Track your BMI trend over months rather than as a single snapshot. A consistent downward trend matters far more than hitting a specific number on any given day — focus on the trajectory.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const BMI_WHEN_TO_USE = [
  {
    icon: '📋',
    title: 'Annual health check',
    description: 'Calculate your BMI as part of your annual self-assessment alongside blood pressure and cholesterol.',
  },
  {
    icon: '🎯',
    title: 'Setting weight loss targets',
    description: 'Find the BMI-normal weight range for your height to set a realistic, medically-recognised target weight.',
  },
  {
    icon: '🤰',
    title: 'Pre-pregnancy planning',
    description: 'Check BMI is in the healthy range before trying to conceive — optimal BMI reduces pregnancy complications.',
  },
  {
    icon: '🏋️',
    title: 'Fitness tracking',
    description: 'Monitor BMI monthly during a training program to separate scale weight changes from body composition changes.',
  },
  {
    icon: '⚕️',
    title: 'Before a medical appointment',
    description: 'Calculate in advance to have an informed conversation about weight and health with your healthcare provider.',
  },
]

// ─── Quick Reference ──────────────────────────────────────────────────────────

const BMI_QUICK_REF = [
  { input: 'Height', description: 'Your height in cm or ft/in', example: '175 cm' },
  { input: 'Weight', description: 'Your weight in kg or lbs', example: '75 kg' },
  { input: 'Formula', description: 'Weight(kg) ÷ Height(m)²', example: 'Standard WHO' },
  { input: 'Underweight', description: 'BMI below this', example: '< 18.5' },
  { input: 'Normal Weight', description: 'Healthy BMI range', example: '18.5–24.9' },
  { input: 'Overweight', description: 'Elevated risk range', example: '25–29.9' },
  { input: 'Obese Class I', description: 'High risk range', example: '30–34.9' },
  { input: 'Obese Class II/III', description: 'Very high risk', example: '≥ 35' },
]

// ─── Structured data ──────────────────────────────────────────────────────────

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BMI Calculator',
  url: 'https://roughtools.com/tools/calculators/bmi-calculator',
  description:
    'Free online BMI calculator. Supports metric (kg/cm) and imperial (lbs/in) units. Shows BMI category and healthy weight range.',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  creator: { '@type': 'Organization', name: 'RoughTools' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://roughtools.com/tools/calculators' },
    { '@type': 'ListItem', position: 3, name: 'BMI Calculator', item: 'https://roughtools.com/tools/calculators/bmi-calculator' },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Use the BMI Calculator',
  description: 'Calculate your Body Mass Index in 4 simple steps using the free RoughTools BMI Calculator.',
  totalTime: 'PT1M',
  tool: { '@type': 'HowToTool', name: 'RoughTools BMI Calculator' },
  step: STEPS.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.name,
    text: s.text,
  })),
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BMICalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, breadcrumbSchema, faqSchema, howToSchema]} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>

        {/* ── Breadcrumb ── */}
        <nav style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20 }} aria-label="Breadcrumb">
          <a href="/" style={{ color: 'var(--fg-2)' }}>Home</a>
          {' › '}
          <a href="/tools/calculators" style={{ color: 'var(--fg-2)' }}>Calculators</a>
          {' › '}
          <span style={{ color: 'var(--brand)' }}>BMI Calculator</span>
        </nav>

        {/* ── Page heading ── */}
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--fg)', marginBottom: 8, marginTop: 0 }}>
          BMI Calculator
        </h1>
        <p style={{ fontSize: 15, color: 'var(--fg-2)', marginBottom: 24, lineHeight: 1.6 }}>
          Calculate your Body Mass Index instantly. Supports metric (kg/cm) and imperial (lbs/in).
          Results include your BMI category, healthy weight range, and a visual BMI scale.
        </p>

        {/* ── Top ad (above tool — horizontal banner) ── */}
        <ToolAdUnit position="top" />

        {/* ── Tool widget ── */}
        <BMICalculator />

        {/* ── Medical disclaimer — directly below the tool, BEFORE middle ad ── */}
        <MedicalDisclaimer
          formula="BMI = weight(kg) ÷ height(m)²  |  Imperial: (weight(lb) × 703) ÷ height(in)²"
          sources={[
            { label: 'WHO — BMI Classification', href: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight' },
            { label: 'CDC — About Adult BMI', href: 'https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html' },
          ]}
          reviewer="Reviewed against WHO and CDC clinical guidelines"
        />

        {/* ── Middle ad (between tool and explanatory content) ── */}
        <ToolAdUnit position="middle" />

        {/* ── How to use ── */}
        <ToolHowTo steps={STEPS} />

        {/* ── About / description ── */}
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
            What Is BMI and Why Does It Matter?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Body Mass Index (BMI) is a simple screening number calculated from an adult&rsquo;s weight and
            height. First described by Belgian mathematician Adolphe Quetelet in the 19th century (then
            called the Quetelet Index), it was adopted by the World Health Organization as a global
            standard for classifying weight status in 1995. Today it is used in clinical practice in
            over 190 countries as a first-line obesity screening tool.
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The appeal of BMI is its simplicity: you only need two measurements — weight and height —
            and the math is straightforward. For population-level analysis, BMI correlates well with
            more precise body-fat measurements such as dual-energy X-ray absorptiometry (DEXA). At the
            individual level, however, it has important limitations (see FAQ below).
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            Our calculator uses the exact same WHO formula that clinicians use. Results are instant,
            no account required, and no data is stored or transmitted — all calculations happen in
            your browser.
          </p>
        </section>

        {/* ── Formula ── */}
        <ToolFormula
          formula={`Metric:   BMI = weight (kg) ÷ height (m)²\nImperial: BMI = [weight (lb) × 703] ÷ height (in)²`}
          explanation={`"Weight" is your body mass in kilograms or pounds. "Height" in the metric formula must be in metres (not centimetres) — convert by dividing cm by 100. The constant 703 in the imperial formula adjusts for the unit conversion from lb/in² to kg/m².`}
          sourceLabel="WHO Global Database on Body Mass Index"
          sourceHref="https://www.who.int/toolkits/growth-reference-data-for-5to19-years/indicators/bmi-for-age"
        />

        {/* ── Worked example ── */}
        <ToolExample
          scenario="A 35-year-old woman who weighs 68 kg and is 165 cm tall wants to check her BMI."
          inputs={[
            { label: 'Weight', value: '68 kg' },
            { label: 'Height', value: '165 cm = 1.65 m' },
            { label: 'Height squared', value: '1.65² = 2.7225 m²' },
          ]}
          result="BMI = 68 ÷ 2.7225 = 24.98 → Normal weight (18.5–24.9)"
          notes="A BMI of 24.98 sits right at the upper edge of the Normal range. The calculator also shows her healthy weight range: approximately 50.3 kg to 67.4 kg for her height. She is within range, though close to the Overweight boundary — a good result to discuss with her GP at her next routine check-up."
        />

        {/* ── Common mistakes ── */}
        <ToolCommonMistakes items={MISTAKES} />

        {/* ── FAQ ── */}
        <CalculatorFAQ faqs={FAQ_ITEMS} />

        {/* ── Related Calculators ── */}
        <RelatedCalculators calculators={RELATED} />

        {/* ── Pro Tips ── */}
        <ProTipsSection tips={BMI_PRO_TIPS} />

        {/* ── When to Use ── */}
        <WhenToUseCards cards={BMI_WHEN_TO_USE} />

        {/* ── Quick Reference ── */}
        <QuickReferenceTable rows={BMI_QUICK_REF} />

        {/* ── Medical Disclaimer ── */}
        <MedicalCalcDisclaimer
          toolName="BMI Calculator"
          text="BMI Calculator — Results are based on the WHO BMI formula and standard classification categories. BMI is a screening tool, not a diagnostic measure. It does not account for muscle mass, fat distribution, age, sex, or ethnicity. A BMI result outside the normal range should be discussed with a qualified healthcare provider who can assess your full health picture before drawing clinical conclusions or making health decisions."
        />

        {/* ── Extras (PDF, share, etc.) ── */}
        <ToolPageExtras
          toolName="BMI Calculator"
          toolSlug="bmi-calculator"
          toolUrl="https://roughtools.com/tools/calculators/bmi-calculator"
          type="medical"
        />

        {/* ── Bottom ad ── */}
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
