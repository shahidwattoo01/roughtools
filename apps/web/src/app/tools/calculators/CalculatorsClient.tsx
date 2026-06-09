'use client'
import CategoryHubLayout, { CategoryHubConfig } from '@/components/CategoryHubLayout'

const config: CategoryHubConfig = {
  eyebrow: '21 Free Calculators — No Signup Required',
  heroIcon: '🧮',
  title: 'Every Calculator You Need. Free.',
  description: 'Financial, health, math, and specialty calculators — all instant, browser-side, no signup, no data sent to any server.',
  gradient: 'from-violet-600 to-indigo-700',
  subtextClass: 'text-violet-100',
  chips: ['⚡ Instant Results', '🔒 Privacy First', '🆓 Always Free', '📱 Mobile Ready'],
  accentBorder: 'hover:border-violet-300',
  accentBg: 'bg-violet-50',
  accentText: 'text-violet-600',
  accentGroupCount: 'text-violet-700 bg-violet-50 border border-violet-200',
  trust: [
    { icon: '⚡', label: 'Instant Results' },
    { icon: '🔒', label: 'Privacy First' },
    { icon: '🆓', label: 'Always Free' },
    { icon: '📱', label: 'Mobile Friendly' },
    { icon: '🚫', label: 'No Signup' },
  ],
  groups: [
    {
      id: 'financial',
      title: 'Financial Calculators',
      subtitle: 'Mortgages, loans, investments, and salary — plan your finances accurately',
      icon: '💰',
      tools: [
        { name: 'Mortgage Calculator', href: '/tools/calculators/mortgage-calculator', icon: '🏠', description: 'Calculate monthly payments, total cost, and full amortization schedule.', tags: ['Home', 'Finance'], badge: 'Popular', badgeColor: 'orange' },
        { name: 'Loan Calculator', href: '/tools/calculators/loan-calculator', icon: '💳', description: 'Monthly loan payment, total interest, and amortization for any loan type.', tags: ['Loan', 'Finance'] },
        { name: 'Compound Interest', href: '/tools/calculators/compound-interest-calculator', icon: '📈', description: 'Grow savings with daily, monthly, or yearly compounding. Includes growth chart.', tags: ['Investment', 'Savings'] },
        { name: 'Currency Converter', href: '/tools/calculators/currency-converter', icon: '💱', description: 'Live exchange rates for 170+ global currencies.', tags: ['Currency', 'Forex'], badge: 'Popular', badgeColor: 'orange' },
        { name: 'ROI Calculator', href: '/tools/calculators/roi-calculator', icon: '📊', description: 'Calculate return on investment and annualized returns for any investment.', tags: ['Investment'] },
        { name: 'Inflation Calculator', href: '/tools/calculators/inflation-calculator', icon: '📉', description: 'Measure the effect of inflation on purchasing power over time.', tags: ['Inflation', 'CPI'] },
        { name: 'Retirement Calculator', href: '/tools/calculators/retirement-calculator', icon: '🏖️', description: 'Plan retirement savings and estimate future wealth at any age.', tags: ['Retirement', 'Savings'] },
        { name: 'Salary Calculator', href: '/tools/calculators/salary-calculator', icon: '💼', description: 'Convert salary between hourly, daily, weekly, monthly and annual rates.', tags: ['Salary', 'Pay'] },
        { name: 'Discount Calculator', href: '/tools/calculators/discount-calculator', icon: '🏷️', description: 'Instantly calculate sale price and savings after any discount percentage.', tags: ['Shopping'] },
      ],
    },
    {
      id: 'health',
      title: 'Health & Fitness',
      subtitle: 'BMI, calories, body fat, ovulation, and pregnancy — all science-based',
      icon: '❤️',
      tools: [
        { name: 'BMI Calculator', href: '/tools/calculators/bmi-calculator', icon: '⚖️', description: 'Calculate Body Mass Index with category, healthy range, and health tips.', tags: ['BMI', 'Weight'], badge: 'Popular', badgeColor: 'orange' },
        { name: 'Calorie Calculator', href: '/tools/calculators/calorie-calculator', icon: '🥗', description: 'Daily calorie needs (TDEE) based on activity level and weight goals.', tags: ['Diet', 'Fitness'] },
        { name: 'Body Fat Calculator', href: '/tools/calculators/body-fat-calculator', icon: '💪', description: 'Body fat percentage using the US Navy measurement method.', tags: ['Body', 'Fitness'] },
        { name: 'Ovulation Calculator', href: '/tools/calculators/ovulation-calculator', icon: '🌸', description: 'Calculate fertile window and ovulation date from your cycle length.', tags: ['Fertility', 'Health'] },
        { name: 'Due Date Calculator', href: '/tools/calculators/due-date-calculator', icon: '👶', description: 'Estimated pregnancy delivery date from last menstrual period (LMP).', tags: ['Pregnancy'] },
      ],
    },
    {
      id: 'math',
      title: 'Math, Dates & Tax',
      subtitle: 'Percentages, scientific functions, age, dates, taxes, and tips',
      icon: '📐',
      tools: [
        { name: 'Percentage Calculator', href: '/tools/calculators/percentage-calculator', icon: '%', description: '4 modes: % of number, % change, % difference, X is what % of Y.', tags: ['Math', 'Percent'], badge: 'Popular', badgeColor: 'orange' },
        { name: 'Scientific Calculator', href: '/tools/calculators/scientific-calculator', icon: '🔢', description: 'Full-featured with trigonometry, logarithms, powers and memory functions.', tags: ['Math', 'Science'] },
        { name: 'Age Calculator', href: '/tools/calculators/age-calculator', icon: '🎂', description: 'Exact age in years, months, days, hours. Birthday countdown included.', tags: ['Date', 'Age'] },
        { name: 'Date Difference', href: '/tools/calculators/date-difference-calculator', icon: '📅', description: 'Days, weeks, months between two dates. Business days option.', tags: ['Date'] },
        { name: 'Tip Calculator', href: '/tools/calculators/tip-calculator', icon: '🍽️', description: 'Calculate tip amount and split the bill among any number of people.', tags: ['Social', 'Dining'] },
        { name: 'Tax Calculator', href: '/tools/calculators/tax-calculator', icon: '🏛️', description: 'Estimate income tax, take-home pay and effective tax rate.', tags: ['Tax', 'Income'] },
        { name: 'GPA Calculator', href: '/tools/calculators/gpa-calculator', icon: '🎓', description: 'GPA, CGPA, and letter grade across multiple grading scales.', tags: ['Academic'] },
      ],
    },
  ],
  seoTitle: 'Free Online Calculators — No Signup, Instant Results',
  seoBody: 'Roughtools offers 21 professional-grade calculators completely free. Whether you\'re planning a mortgage, tracking fitness goals, or calculating compound interest, every result is instant and runs entirely in your browser. No data is ever sent to any server.',
  seoBullets: [
    'All 21 calculators run in-browser — no data leaves your device',
    'No account or signup required — results in under a second',
    'Science-based formulas for health and financial calculations',
    'Mobile-optimised layouts that work on any screen size',
    'Updated for 2026 with current rates and financial tables',
  ],
  crossLinks: [
    { href: '/tools/pdf', label: '📄 PDF Tools' },
    { href: '/tools/developer', label: '💻 Developer Tools' },
    { href: '/tools/converters', label: '🔄 Converters' },
    { href: '/tools/real-estate', label: '🏠 Real Estate' },
    { href: '/tools/environment', label: '🌿 Environment' },
    { href: '/tools/business', label: '💼 Business Tools' },
  ],
}

export default function CalculatorsClient() {
  return <CategoryHubLayout config={config} />
}
