import type { Metadata } from 'next'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import BodyFatCalculatorClient from './BodyFatCalculatorClient'
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

const _seo = getCalcSEO('body-fat-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Body Fat Calculator — US Navy Method | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate your body fat percentage using the accurate US Navy method. Enter waist, neck, and hip measurements for an instant body fat estimate with category rating. Free, no signup.',
  keywords: ['body fat calculator', 'body fat percentage calculator', 'US Navy body fat', 'body fat measurement', 'body composition calculator', 'free body fat calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/body-fat-calculator' },
  openGraph: {
    title: 'Free Body Fat Calculator — US Navy Method | RoughTools',
    description: 'Calculate body fat percentage using the US Navy method. Instant results, free, no signup.',
    url: 'https://roughtools.com/tools/calculators/body-fat-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Body Fat Calculator | RoughTools',
    description: 'Calculate body fat percentage with the US Navy method. Free, instant.',
  },
}

// ─── FAQ data (12 questions) ──────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this body fat calculator?',
    a: 'The US Navy circumference method has a margin of error of approximately ±3–4 percentage points compared to DEXA (dual-energy X-ray absorptiometry), which is considered the gold standard for body composition measurement. Accuracy improves with consistent, careful measurements. The method tends to be less accurate at very low body fat percentages (below 10% for men, below 18% for women) and for very muscular individuals.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. No data you enter — including your measurements or weight — is transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
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
    q: 'Should I consult a professional before changing my fitness routine?',
    a: 'Yes — particularly if you are aiming for very low body fat levels (below 15% for women or 8% for men), which can have health implications. A certified personal trainer, sports dietitian, or physician can help you set safe, realistic body composition targets and monitor progress safely.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'The US Navy circumference method uses logarithmic formulas. For men: BF% = 86.010 × log₁₀(waist − neck) − 70.041 × log₁₀(height) + 36.76. For women: BF% = 163.205 × log₁₀(waist + hip − neck) − 97.684 × log₁₀(height) − 78.387. All measurements in centimetres. The formulas were developed by Hodgdon and Beckett in 1984 for the US Department of Defense.',
  },
  {
    q: 'Where exactly should I take measurements?',
    a: 'Waist (men): measure at the navel (belly button level), not the narrowest point. Waist (women): measure at the narrowest point, typically 1 inch above the navel. Neck: measure just below the larynx (Adam\'s apple for men), sloping slightly downward toward the front. Hip (women only): measure at the widest point of the hips and buttocks. Exhale normally before measuring — do not suck in your stomach.',
  },
  {
    q: 'What is the minimum essential body fat level?',
    a: 'Essential body fat is the minimum needed for basic physiological function. For men, this is approximately 2–5%. For women, it is 10–13% — women need higher essential fat to support hormonal and reproductive function. Going below these levels is dangerous and associated with serious health consequences including organ damage, infertility, and bone density loss. Most health organisations recommend maintaining at minimum an "athletes" range: 6–13% for men, 14–20% for women.',
  },
  {
    q: 'What is the difference between "athlete" and "fitness" body fat categories?',
    a: 'Athlete body fat (men: 6–13%, women: 14–20%) reflects levels typically seen in competitive athletes who train intensively. Fitness body fat (men: 14–17%, women: 21–24%) is the range seen in active, health-conscious individuals who exercise regularly but are not competitive athletes. Both are considered healthy. The fitness range is often more sustainable long-term without the demanding training and dietary discipline required for athlete-level leanness.',
  },
  {
    q: 'How often should I measure my body fat percentage?',
    a: 'For tracking body recomposition progress, measuring every 4–6 weeks is ideal. Daily or weekly measurements are too frequent to show meaningful trends — short-term fluctuations of 1–2% are normal due to hydration, food volume in the gut, and measurement variability. Always measure at the same time of day (ideally morning, after using the bathroom, before eating or drinking) under consistent conditions to reduce variability.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Take measurements first thing in the morning after using the bathroom, before eating or drinking, and at the same time each measurement session. Hydration status alone can shift circumference measurements by 1–2 cm, which translates to a 1–2 percentage point change in the result. Morning consistency eliminates this variable.',
  'Average three measurements at each site rather than taking a single reading. Wrap the tape around, release it, and re-wrap to take each reading independently. The three readings rarely vary by more than 0.5 cm when done correctly — average them for a more reliable input value.',
  'Body fat percentage is often a more meaningful health indicator than scale weight alone. Someone who loses 3 kg of fat while gaining 2 kg of muscle will see only 1 kg of scale change — but their body fat percentage and health profile can improve dramatically. Use body fat percentage to track true body recomposition.',
  'Fat and muscle have different densities: fat tissue is approximately 0.9 g/cm³ while muscle is approximately 1.06 g/cm³. This means a pound of muscle takes up significantly less space than a pound of fat. As you build muscle and lose fat at the same weight, your clothes fit better and you look leaner — this is why the scale is an incomplete fitness metric.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🔄',
    title: 'Starting body recomposition',
    description: 'Establish a baseline body fat percentage before beginning a training or diet programme so you can measure genuine progress beyond the scale.',
  },
  {
    icon: '📅',
    title: 'Monthly progress tracking',
    description: 'Check body fat every 4–6 weeks during a fitness programme to confirm you are losing fat, not muscle, and adjust your approach accordingly.',
  },
  {
    icon: '🏅',
    title: 'Before and after a fitness programme',
    description: 'Quantify the true results of a 12-week programme by comparing body fat percentage — not just weight — to assess whether the programme worked.',
  },
  {
    icon: '⚖️',
    title: 'Understanding BMI limitations',
    description: 'If your BMI classifies you as overweight but you are muscular, body fat percentage clarifies whether you genuinely carry excess fat or just have high lean mass.',
  },
  {
    icon: '🏃',
    title: 'Pre-athletic physical or assessment',
    description: 'Many sports organisations and military branches use body fat percentage as a fitness standard. Calculate yours in advance to know where you stand.',
  },
]

// ─── Quick Reference ──────────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Weight', description: 'Your body weight in kg or lbs', example: '80 kg' },
  { input: 'Height', description: 'Your standing height in cm or inches', example: '180 cm' },
  { input: 'Waist', description: 'Circumference at navel (men) or narrowest point (women)', example: '85 cm' },
  { input: 'Neck', description: 'Circumference just below the larynx', example: '38 cm' },
  { input: 'Hip', description: 'Widest point of hips/buttocks — women only', example: '96 cm (women)' },
  { input: 'Male BF% formula', description: '86.010 × log₁₀(waist − neck) − 70.041 × log₁₀(height) + 36.76', example: '~18%' },
  { input: 'Female BF% formula', description: '163.205 × log₁₀(waist + hip − neck) − 97.684 × log₁₀(height) − 78.387', example: '~25%' },
  { input: 'Output', description: 'Body fat percentage and classification category', example: '18.2% — Fitness' },
]

// ─── Related Calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '⚖️', name: 'BMI Calculator', slug: 'bmi-calculator', description: 'Check your body mass index' },
  { icon: '🔥', name: 'Calorie Calculator', slug: 'calorie-calculator', description: 'Calculate your daily calorie needs (TDEE)' },
  { icon: '📏', name: 'Ideal Weight Calculator', slug: 'ideal-weight-calculator', description: 'Find your ideal body weight for your height' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Body Fat Calculator',
    description: 'Free body fat percentage calculator using the US Navy circumference method. Supports metric and imperial units.',
    url: 'https://roughtools.com/tools/calculators/body-fat-calculator',
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
      { '@type': 'ListItem', position: 3, name: 'Body Fat Calculator', item: 'https://roughtools.com/tools/calculators/body-fat-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BodyFatCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Body Fat Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          📐
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Body Fat Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate your body fat percentage using the US Navy circumference method — one of the most accurate non-invasive techniques available.
          Enter your height, waist, and neck measurements (plus hip for women) for an instant result with category classification.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '🎖️ US Navy method'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <BodyFatCalculatorClient />

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
            About This Body Fat Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This body fat calculator uses the <strong style={{ color: 'var(--fg)' }}>US Navy circumference method</strong> — a formula developed by
            Hodgdon and Beckett in 1984 for the United States Department of Defense. The method uses simple tape measurements of the neck, waist,
            and (for women) hips, combined with height, to estimate body fat percentage using validated logarithmic equations. It has been shown
            to be accurate within ±3–4 percentage points of DEXA scanning for most individuals, making it one of the best non-invasive methods
            available outside a clinical setting.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Why Body Fat Percentage Matters More Than Weight
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Scale weight and BMI cannot distinguish between fat mass and lean mass (muscle, bone, organs, water). Two people with identical
            heights and weights can have vastly different body compositions and health profiles. A 80 kg person who is 30% body fat carries
            24 kg of fat and 56 kg of lean mass — very different from a 80 kg person who is 15% body fat (12 kg fat, 68 kg lean mass).
            Body fat percentage gives you this distinction and correlates more directly with metabolic health, cardiovascular risk, and
            physical performance than weight or BMI alone.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — US Navy Method
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The US Navy method uses logarithmic relationships between circumference measurements and height to estimate fat mass:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 12, color: 'var(--brand-2)' }}>
            Men:   BF% = 86.010 × log₁₀(waist − neck) − 70.041 × log₁₀(height) + 36.76<br />
            Women: BF% = 163.205 × log₁₀(waist + hip − neck) − 97.684 × log₁₀(height) − 78.387
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            All measurements are in centimetres. The logarithmic structure of the formula means it is more accurate in the mid-range
            body fat percentages (10–35%) and less precise at extreme values.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            How It Compares to DEXA and Other Methods
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            DEXA (dual-energy X-ray absorptiometry) is widely considered the gold standard for body composition measurement, with an accuracy
            of ±1–2%. It is also expensive ($50–$200 per scan) and requires specialist equipment. The US Navy method is free, requires only a
            flexible tape measure, and for most people produces results within 3–4 percentage points of DEXA — a practically useful level of
            accuracy for tracking trends over time. Hydrostatic weighing and BOD POD (air displacement plethysmography) are also highly
            accurate but similarly require specialist facilities. For home tracking, the US Navy method is among the best options available.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Understanding the Body Fat Categories
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            Body fat categories are defined differently for men and women due to physiological differences:
          </p>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Essential fat — Men: 2–5%, Women: 10–13%. The minimum required for survival and basic hormonal function.',
              'Athletes — Men: 6–13%, Women: 14–20%. Typical for competitive athletes with intensive training.',
              'Fitness — Men: 14–17%, Women: 21–24%. Active, healthy individuals who exercise regularly.',
              'Average — Men: 18–24%, Women: 25–31%. Most healthy non-athletic adults fall here.',
              'Obese — Men: 25%+, Women: 32%+. Associated with increased cardiovascular and metabolic risk.',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>{item}
              </li>
            ))}
          </ul>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations run entirely in your browser. No data you enter — including your measurements — is transmitted to any server
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
          toolName="Body Fat Calculator"
          text="Body Fat Calculator — Results are estimates based on the US Navy circumference method and do not constitute medical or fitness advice. Individual body composition varies and this calculator cannot account for all factors affecting body fat distribution. Body fat percentage targets should be set in consultation with a qualified healthcare provider, registered dietitian, or certified fitness professional — particularly when aiming for very low body fat levels."
        />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Body Fat Calculator"
          toolSlug="body-fat-calculator"
          toolUrl="https://roughtools.com/tools/calculators/body-fat-calculator"
          type="medical"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
