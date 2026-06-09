import type { Metadata } from 'next'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import CalorieCalculatorClient from './CalorieCalculatorClient'
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

const _seo = getCalcSEO('calorie-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Calorie Calculator — Daily Calorie Needs (TDEE & BMR) | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate your daily calorie needs using the Mifflin-St Jeor equation. Find your BMR and TDEE for weight loss, maintenance, or muscle gain. Free calorie calculator — no signup required.',
  keywords: ['calorie calculator', 'daily calorie needs', 'TDEE calculator', 'BMR calculator', 'calorie intake calculator', 'weight loss calories', 'Mifflin-St Jeor calculator', 'free calorie calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/calorie-calculator' },
  openGraph: {
    title: 'Free Calorie Calculator — Daily Calorie Needs (TDEE & BMR) | RoughTools',
    description: 'Calculate your daily calorie needs (BMR & TDEE) using the Mifflin-St Jeor equation. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/calorie-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Calorie Calculator | RoughTools',
    description: 'Calculate your BMR and TDEE for weight loss or muscle gain. Free, instant.',
  },
}

// ─── FAQ data (12 questions) ──────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this calorie calculator?',
    a: 'The Mifflin-St Jeor equation has been shown in clinical studies to estimate BMR within approximately ±10% of measured values for most adults. It consistently outperforms the older Harris-Benedict equation in accuracy. However, individual metabolic variation, body composition, hormonal factors, and medications can all shift your true calorie needs. Use this as an informed starting estimate and adjust based on real-world results over 2–4 weeks.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. No data you enter — including your age, weight, height, or sex — is transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
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
    q: 'Should I consult a professional before changing my diet?',
    a: 'Yes — especially before making significant changes. A registered dietitian (RD) or your GP can review your full health picture, identify any nutritional deficiencies, and set safe calorie targets that account for your medical history. This is particularly important for people with diabetes, eating disorder history, kidney disease, or those who are pregnant or breastfeeding.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'The Mifflin-St Jeor equation (published 1990): Males — BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5. Females — BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161. The BMR is then multiplied by an activity factor (1.2 to 1.725) to get your Total Daily Energy Expenditure (TDEE).',
  },
  {
    q: 'What is the difference between BMR and TDEE?',
    a: 'BMR (Basal Metabolic Rate) is the calories your body burns at complete rest — purely to keep you alive (breathing, circulation, organ function). TDEE (Total Daily Energy Expenditure) adds the calories burned through all physical activity during the day. TDEE = BMR × activity multiplier. Your TDEE is the number that matters most for weight management.',
  },
  {
    q: 'How many calories do I need to lose one pound per week?',
    a: 'One pound of body fat contains approximately 3,500 calories. A deficit of 500 calories per day (eating 500 fewer than your TDEE) creates a 3,500-calorie weekly deficit, theoretically producing one pound of fat loss per week. In practice, initial weight loss is faster due to water weight, and the rate slows as your body adapts. Most guidelines recommend a maximum deficit of 500–750 calories/day without medical supervision.',
  },
  {
    q: 'Does protein intake affect my calorie needs?',
    a: 'Yes, in two important ways. First, protein has a higher thermic effect of food (TEF) than carbohydrates or fat — your body burns roughly 20–30% of protein calories during digestion, compared to 5–10% for carbs and 0–3% for fat. Second, adequate protein (1.6–2.2 g per kg of body weight) helps preserve muscle mass during a calorie deficit, keeping your metabolic rate higher than if you lost weight on a low-protein diet.',
  },
  {
    q: 'What should I do if the results seem too high or too low?',
    a: 'First, double-check your inputs — especially weight, height, and activity level. Many people underestimate their activity level (choosing sedentary when they should choose light) or overestimate it. If the number still seems off after checking, try tracking your actual food intake for 2 weeks without changing anything. Compare your average daily calories to your weight trend — if you are maintaining weight, your actual TDEE is close to your average intake regardless of the formula\'s output.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Track your food intake for two weeks without changing your diet first. This reveals your true current calorie intake and lets you compare it to your TDEE. Most people are surprised — under-reporters typically eat 20–40% more than they think, while dieters often eat far less than they realize and then plateau because the body adapts.',
  'Aim for 1.6–2.2 grams of protein per kilogram of body weight during a calorie deficit. High protein intake preserves lean muscle mass, which keeps your basal metabolic rate from dropping as much during weight loss. It also keeps you fuller longer, making the deficit easier to sustain.',
  'Account for adaptive thermogenesis. After 8–12 weeks in a sustained calorie deficit, your body reduces its metabolic rate by 10–15% beyond what simple weight loss would predict. This is why fat loss slows or stalls. A 1–2 week diet break at maintenance calories can reset hormones and partially reverse this adaptation.',
  'NEAT (Non-Exercise Activity Thermogenesis) — fidgeting, walking, standing, household chores — can account for 15–50% of total daily energy expenditure and varies enormously between individuals. Two people with identical bodies and formal exercise routines can have TDEE values differing by 500–800 calories based on NEAT alone. If you have an active job or rarely sit still, choose "lightly active" or higher.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '⚖️',
    title: 'Starting a weight loss plan',
    description: 'Find your TDEE and subtract 300–500 calories to create a sustainable calorie deficit without triggering extreme hunger or muscle loss.',
  },
  {
    icon: '💪',
    title: 'Building muscle (calorie surplus)',
    description: 'Calculate your maintenance calories, then add 200–350 calories above TDEE for a lean bulk that minimises fat gain while supporting muscle growth.',
  },
  {
    icon: '🏃',
    title: 'Marathon or endurance training prep',
    description: 'See how increasing your activity level to "very active" changes your calorie needs — essential for fuelling long training runs without bonking or losing muscle.',
  },
  {
    icon: '🏥',
    title: 'Post-surgery or illness recovery',
    description: 'During recovery, calorie needs increase to support healing. Use this calculator as a baseline and work with your dietitian to set an appropriate recovery target.',
  },
  {
    icon: '📊',
    title: 'Comparing activity level impact',
    description: 'Run the calculator twice with different activity levels to see the exact calorie difference — a useful way to understand how much exercise actually contributes to your energy budget.',
  },
]

// ─── Quick Reference ──────────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Weight', description: 'Your body weight in kg or lbs', example: '75 kg / 165 lb' },
  { input: 'Height', description: 'Your standing height in cm or ft/in', example: '175 cm / 5 ft 9 in' },
  { input: 'Age', description: 'Your current age in years', example: '30 years' },
  { input: 'Sex', description: 'Biological sex (affects the +5/−161 constant)', example: 'Male / Female' },
  { input: 'Activity Level', description: 'How active you are in daily life and exercise', example: 'Moderate (×1.55)' },
  { input: 'BMR', description: 'Calories burned at complete rest', example: '1,750 kcal/day' },
  { input: 'TDEE', description: 'Total calories burned including all activity', example: '2,713 kcal/day' },
  { input: 'Activity multipliers', description: 'Sedentary ×1.2, Light ×1.375, Moderate ×1.55, Very Active ×1.725', example: '×1.55' },
]

// ─── Related Calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '⚖️', name: 'BMI Calculator', slug: 'bmi-calculator', description: 'Check your body mass index' },
  { icon: '📐', name: 'Body Fat Calculator', slug: 'body-fat-calculator', description: 'Estimate body fat percentage (US Navy method)' },
  { icon: '📏', name: 'Ideal Weight Calculator', slug: 'ideal-weight-calculator', description: 'Find your ideal body weight for your height' },
  { icon: '🎂', name: 'Age Calculator', slug: 'age-calculator', description: 'Calculate your exact age in years, months, and days' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Calorie Calculator',
    description: 'Free calorie calculator using the Mifflin-St Jeor equation. Calculates BMR and TDEE based on age, sex, weight, height, and activity level.',
    url: 'https://roughtools.com/tools/calculators/calorie-calculator',
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
      { '@type': 'ListItem', position: 3, name: 'Calorie Calculator', item: 'https://roughtools.com/tools/calculators/calorie-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalorieCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Calorie Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          🔥
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Calorie Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate your daily calorie needs using the Mifflin-St Jeor equation — the most accurate BMR formula available.
          Enter your age, sex, weight, height, and activity level to get your BMR and TDEE for weight loss, maintenance, or muscle gain.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '🧪 Mifflin-St Jeor formula'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <CalorieCalculatorClient />

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
            About This Calorie Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This free calorie calculator uses the <strong style={{ color: 'var(--fg)' }}>Mifflin-St Jeor equation</strong> — published in 1990 and
            validated in multiple peer-reviewed studies as the most accurate method for estimating Basal Metabolic Rate (BMR) in healthy adults.
            A 2005 review in the Journal of the American Dietetic Association found the Mifflin-St Jeor equation to be the most reliable formula
            for most non-obese individuals, consistently outperforming the older Harris-Benedict equation (1919) in accuracy.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — BMR and TDEE
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The calculator first computes your <strong style={{ color: 'var(--fg)' }}>Basal Metabolic Rate (BMR)</strong> — the calories your body
            requires at complete rest to maintain essential functions like breathing, circulation, temperature regulation, and cell repair.
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Males:   BMR = (10 × weight kg) + (6.25 × height cm) − (5 × age) + 5<br />
            Females: BMR = (10 × weight kg) + (6.25 × height cm) − (5 × age) − 161
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The BMR is then multiplied by an activity factor to give your <strong style={{ color: 'var(--fg)' }}>Total Daily Energy Expenditure (TDEE)</strong> —
            the actual calories you burn on a typical day including all physical activity:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Sedentary (desk job, no exercise):   TDEE = BMR × 1.200<br />
            Lightly active (1–3 days/week):       TDEE = BMR × 1.375<br />
            Moderately active (3–5 days/week):    TDEE = BMR × 1.550<br />
            Very active (6–7 days/week):          TDEE = BMR × 1.725
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            BMR vs TDEE — Which Number Matters?
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            BMR tells you the minimum calories your body needs to survive at rest — it is a useful reference point but not a diet target.
            TDEE is the number you should use for meal planning. Eating at TDEE = weight maintenance. Eating 300–500 calories below TDEE = gradual
            fat loss (roughly 0.3–0.5 kg per week). Eating 200–350 calories above TDEE = lean muscle-building (assuming adequate protein and resistance training).
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            It is important to note that your TDEE is not fixed — it changes as your weight, age, and activity level change. A person who loses
            10 kg will have a lower TDEE than when they started, even if everything else remains the same. Recalculating every 4–8 weeks as you
            progress is recommended practice.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Why Mifflin-St Jeor and Not Harris-Benedict?
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Harris-Benedict equation was developed in 1919 using a small sample of mostly young, lean men. While widely used for decades,
            it tends to overestimate BMR by 5–15% compared to modern indirect calorimetry measurements. The Mifflin-St Jeor equation, derived
            from a larger and more diverse dataset in 1990, has been validated in multiple independent studies and is now recommended by the
            Academy of Nutrition and Dietetics as the preferred method for estimating calorie needs in healthy adults.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Limitations and What the Calculator Cannot Account For
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            The Mifflin-St Jeor equation is an estimate based on population averages. It cannot account for:
          </p>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Individual metabolic variation — two people with identical stats can have BMRs differing by 15%',
              'Hormonal conditions such as hypothyroidism, PCOS, or Cushing\'s syndrome that significantly alter metabolism',
              'Medications that affect metabolic rate (corticosteroids, beta-blockers, antidepressants)',
              'Pregnancy and breastfeeding, which substantially increase calorie needs',
              'Very high muscle mass (may underestimate needs) or very high body fat (may overestimate needs)',
              'Adaptive thermogenesis — the metabolic slowdown that occurs after weeks in a sustained calorie deficit',
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
            All calculations run entirely in your browser. No data you enter — including your weight, height, age, or sex — is transmitted
            to any server or stored anywhere. Your information stays completely private on your device.
          </p>
        </section>

        {/* Pro Tips */}
        <ProTipsSection tips={PRO_TIPS} />

        {/* FAQ */}
        <CalculatorFAQ faqs={FAQS} />

        {/* Medical Disclaimer */}
        <MedicalCalcDisclaimer
          toolName="Calorie Calculator"
          text="Calorie Calculator — Results are estimates based on the Mifflin-St Jeor equation and do not constitute medical or nutritional advice. Individual calorie needs vary based on factors this calculator cannot measure, including hormonal status, medications, and medical conditions. Before making significant dietary changes — especially if you have diabetes, kidney disease, an eating disorder history, or are pregnant — consult a registered dietitian or your healthcare provider."
        />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Calorie Calculator"
          toolSlug="calorie-calculator"
          toolUrl="https://roughtools.com/tools/calculators/calorie-calculator"
          type="medical"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
