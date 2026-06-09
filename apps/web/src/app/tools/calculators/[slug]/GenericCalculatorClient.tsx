'use client'

import { useState, useCallback, useEffect } from 'react'
import type { CalcEntry, FormulaType } from '../_components/calculator-tool-configs'
import { getCalcSEO } from '../_components/calc-seo-configs'
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ─── Field definition ─────────────────────────────────────────
interface Field {
  id: string
  label: string
  placeholder: string
  unit?: string
  type?: 'number' | 'text' | 'select'
  options?: string[]
  defaultValue?: string
}

// ─── Formula info ─────────────────────────────────────────────
interface FormulaInfo {
  title: string
  formula: string
  variables: string[]
  note: string
}

function getFormulaInfo(type: FormulaType): FormulaInfo {
  switch (type) {
    case 'loan':
      return {
        title: 'Loan Payment Formula',
        formula: 'M = P × [r(1+r)ⁿ] ÷ [(1+r)ⁿ – 1]',
        variables: ['M = Monthly payment', 'P = Principal (loan amount)', 'r = Monthly interest rate (annual rate ÷ 12)', 'n = Total number of payments (years × 12)'],
        note: 'Total interest paid = (M × n) – P',
      }
    case 'mortgage':
      return {
        title: 'Mortgage Payment Formula',
        formula: 'M = P × [r(1+r)ⁿ] ÷ [(1+r)ⁿ – 1]',
        variables: ['M = Monthly mortgage payment', 'P = Principal (loan amount)', 'r = Monthly interest rate (annual rate ÷ 12)', 'n = Total payments (years × 12)'],
        note: 'Does not include property taxes, homeowner\'s insurance, or PMI',
      }
    case 'investment':
      return {
        title: 'Compound Growth Formula',
        formula: 'A = P(1 + r/12)^(12t) + PMT × [(1 + r/12)^(12t) – 1] / (r/12)',
        variables: ['A = Future value', 'P = Principal (initial investment)', 'r = Annual return rate (decimal)', 't = Time in years', 'PMT = Monthly contribution'],
        note: 'Assumes monthly compounding. Past returns do not guarantee future results.',
      }
    case 'savings':
      return {
        title: 'Savings Growth Formula',
        formula: 'A = P(1 + r/12)^(12t) + PMT × [(1 + r/12)^(12t) – 1] / (r/12)',
        variables: ['A = Total savings at end', 'P = Initial deposit', 'r = Annual interest rate (decimal)', 't = Time in years', 'PMT = Monthly deposit'],
        note: 'Assumes monthly compounding interest',
      }
    case 'interest':
      return {
        title: 'Simple & Compound Interest',
        formula: 'Simple: I = P × r × t\nCompound: A = P × (1 + r)ᵗ',
        variables: ['I = Interest earned (simple)', 'P = Principal amount', 'r = Annual interest rate (decimal)', 't = Time in years', 'A = Final amount (compound)'],
        note: 'Compound interest earns significantly more than simple interest over long periods',
      }
    case 'tax':
      return {
        title: 'Income Tax Estimate',
        formula: 'Tax = Income × Rate ÷ 100\nTake-home = Income – Tax',
        variables: ['Income = Gross annual income', 'Rate = Effective tax rate (%)', 'Tax = Estimated tax liability', 'Take-home = Net pay after taxes'],
        note: 'This is a simplified estimate. Consult a tax professional for accurate figures.',
      }
    case 'debt':
      return {
        title: 'Debt Payoff Formula',
        formula: 'n = –log(1 – P×r/PMT) ÷ log(1 + r)',
        variables: ['n = Months to pay off debt', 'P = Current balance', 'r = Monthly interest rate (annual rate ÷ 12)', 'PMT = Monthly payment amount'],
        note: 'Total interest = (PMT × n) – P. Your payment must exceed the monthly interest charge.',
      }
    case 'property':
      return {
        title: 'Property Purchase Formula',
        formula: 'Loan = Price – Down Payment\nM = Loan × [r(1+r)ⁿ] ÷ [(1+r)ⁿ – 1]',
        variables: ['Price = Property purchase price', 'Down Payment = Upfront cash payment', 'Loan = Amount financed', 'M = Monthly mortgage payment', 'r = Monthly rate, n = Total payments'],
        note: 'Does not include property tax, homeowner\'s insurance, maintenance, or HOA fees',
      }
    case 'retirement':
      return {
        title: 'Retirement Savings Formula',
        formula: 'FV = PV(1+r)ⁿ + PMT × [(1+r)ⁿ – 1] / r',
        variables: ['FV = Future value at retirement', 'PV = Present value (current balance)', 'r = Monthly growth rate', 'n = Months until retirement', 'PMT = Monthly contribution'],
        note: 'Based on consistent contributions and stable return rate. Inflation not accounted for.',
      }
    case 'health-index':
      return {
        title: 'Body Mass Index (BMI)',
        formula: 'BMI = Weight (kg) ÷ Height² (m)',
        variables: ['Weight = Body weight in kilograms', 'Height = Height in meters (cm ÷ 100)', 'BMI = Body Mass Index value'],
        note: 'Underweight < 18.5 | Normal 18.5–24.9 | Overweight 25–29.9 | Obese ≥ 30',
      }
    case 'health-calories':
      return {
        title: 'Basal Metabolic Rate — Mifflin-St Jeor Equation',
        formula: 'BMR (male) = 10×W + 6.25×H – 5×A + 5\nBMR (female) = 10×W + 6.25×H – 5×A – 161',
        variables: ['W = Weight in kilograms', 'H = Height in centimeters', 'A = Age in years', 'BMR = Calories burned at complete rest'],
        note: 'Multiply BMR by activity factor: Sedentary ×1.2 | Light ×1.375 | Moderate ×1.55 | Very active ×1.725 | Extra active ×1.9',
      }
    case 'health-fitness':
      return {
        title: 'Body Fat Percentage — U.S. Navy Method',
        formula: 'BF% = 86.010 × log₁₀(Waist – Neck) – 70.041 × log₁₀(Height) + 36.76',
        variables: ['Waist = Waist circumference at navel (cm)', 'Neck = Neck circumference below larynx (cm)', 'Height = Total height (cm)'],
        note: 'For males. Female formula additionally requires hip measurement. Margin of error ≈ ±3%.',
      }
    case 'pregnancy':
      return {
        title: 'Pregnancy Due Date — Naegele\'s Rule',
        formula: 'Due Date = LMP + 280 days\nWeeks Remaining = 40 – Current Weeks',
        variables: ['LMP = First day of last menstrual period', '280 days = Standard 40-week gestation', 'Current Weeks = Current gestational age in weeks'],
        note: 'Only 5% of babies are born on their exact due date. Dates are estimates only.',
      }
    case 'math-basic':
      return {
        title: 'Basic Arithmetic Operations',
        formula: 'Sum: A + B | Difference: A – B\nProduct: A × B | Quotient: A ÷ B\nPercentage: (A ÷ 100) × B',
        variables: ['A = First value', 'B = Second value'],
        note: 'Division by zero is mathematically undefined',
      }
    case 'math-geometry':
      return {
        title: 'Geometry Formulas',
        formula: 'Hypotenuse: c = √(a² + b²)\nRectangle Area: A = l × w\nCircle Area: A = π × r²\nCircumference: C = 2πr',
        variables: ['a, b = Legs of right triangle (or side lengths)', 'c = Hypotenuse', 'r = Circle radius', 'l, w = Rectangle length and width'],
        note: 'Pythagorean theorem applies only to right-angle triangles. π ≈ 3.14159',
      }
    case 'math-stats':
      return {
        title: 'Descriptive Statistics',
        formula: 'Mean = Σx ÷ n\nVariance = Σ(x – μ)² ÷ n\nStd Dev = √Variance',
        variables: ['x = Individual data values', 'n = Count of values', 'μ = Mean (arithmetic average)', 'Σ = Sum of all values'],
        note: 'Median is the middle value of sorted data. This calculator uses population (not sample) variance.',
      }
    case 'date-time':
      return {
        title: 'Date Difference Formula',
        formula: 'Difference (ms) = |Date₂ – Date₁|\nDays = ms ÷ 86,400,000',
        variables: ['Date₁, Date₂ = Any two calendar dates', 'ms = Difference in milliseconds', '86,400,000 = Milliseconds per day'],
        note: 'Weeks = days ÷ 7 | Months ≈ days ÷ 30.44 | Years ≈ days ÷ 365.25',
      }
    case 'conversion':
      return {
        title: 'Unit Conversion',
        formula: 'Result = Value × (FromFactor ÷ ToFactor)',
        variables: ['Value = Input quantity', 'FromFactor = Base conversion factor for source unit', 'ToFactor = Base conversion factor for target unit'],
        note: 'All units normalised to a common base before converting to ensure accuracy',
      }
    case 'engineering':
      return {
        title: 'Engineering Calculation',
        formula: 'Result = A × B\nRatio = A ÷ B',
        variables: ['A = First engineering value', 'B = Second engineering value'],
        note: 'Used for basic engineering ratio and product calculations',
      }
    default:
      return {
        title: 'Calculation Formula',
        formula: 'Sum = A + B | Product = A × B',
        variables: ['A = First value', 'B = Second value'],
        note: 'Basic arithmetic operations',
      }
  }
}

// ─── FAQs per formula type ────────────────────────────────────
interface FAQ { q: string; a: string }

function getFAQs(type: FormulaType, toolName: string): FAQ[] {
  switch (type) {
    case 'loan':
      return [
        { q: `How does the ${toolName} work?`, a: 'Enter the loan amount, annual interest rate, and repayment term. The calculator applies the standard amortisation formula to find your fixed monthly payment and total interest cost.' },
        { q: 'What is amortisation?', a: 'Amortisation spreads a loan into equal monthly payments. Early payments are mostly interest; later payments are mostly principal. The calculator shows the full breakdown for any loan.' },
        { q: 'How does a higher interest rate affect my payment?', a: 'Even a 1% increase in rate can raise monthly payments noticeably and significantly increase total interest paid over the life of the loan.' },
        { q: 'Does this calculator include fees?', a: 'No — it calculates principal and interest only. Origination fees, insurance, or other charges are not included and should be added to your total cost.' },
        { q: 'Can I use this for a car loan or personal loan?', a: 'Yes. The formula is identical for any fixed-rate instalment loan: auto loans, personal loans, student loans, and business loans.' },
      ]
    case 'mortgage':
      return [
        { q: `How accurate is the ${toolName}?`, a: 'It accurately calculates principal and interest based on the standard mortgage amortisation formula. However, it does not include property taxes, homeowner\'s insurance, PMI, or HOA fees.' },
        { q: 'What is a good mortgage interest rate?', a: 'Mortgage rates vary by market conditions, credit score, loan type, and term. Check current rates from multiple lenders — a small rate difference can save tens of thousands over 30 years.' },
        { q: 'How do extra payments affect my mortgage?', a: 'Making even one extra payment per year toward principal can shave years off your mortgage and save substantial interest. Use the payoff calculator for a detailed analysis.' },
        { q: 'What is the difference between 15-year and 30-year mortgages?', a: 'A 15-year mortgage has higher monthly payments but a much lower total interest cost. A 30-year mortgage has lower payments but you\'ll pay significantly more interest over the loan\'s life.' },
        { q: 'What down payment percentage should I aim for?', a: 'A 20% down payment avoids Private Mortgage Insurance (PMI) and lowers your monthly payment. However, many loan programs accept as little as 3–5% down.' },
      ]
    case 'investment':
    case 'savings':
      return [
        { q: 'What is compound interest?', a: 'Compound interest is interest earned on both the original principal and the accumulated interest. Unlike simple interest, compounding accelerates growth exponentially over time.' },
        { q: 'How often is interest compounded?', a: 'This calculator compounds monthly. More frequent compounding (daily vs. annually) produces slightly higher returns. The difference becomes more significant over longer time periods.' },
        { q: 'What is the Rule of 72?', a: 'Divide 72 by your annual return rate to estimate how many years it takes to double your money. For example, at 8% annual return: 72 ÷ 8 = 9 years to double.' },
        { q: 'How important are regular contributions?', a: 'Regular contributions dramatically increase final value due to compounding. Even small monthly contributions — like $100/month — can add significantly to the final result over 20+ years.' },
        { q: 'Are investment returns guaranteed?', a: 'No. Past performance does not guarantee future results. The rate you enter is an assumption. Real returns vary based on market conditions, asset class, and investment risk.' },
      ]
    case 'interest':
      return [
        { q: 'What is the difference between simple and compound interest?', a: 'Simple interest is calculated only on the original principal. Compound interest is calculated on principal plus previously earned interest, leading to exponentially higher returns over time.' },
        { q: 'When is simple interest used?', a: 'Simple interest is typically used for short-term loans, car loans, and some bonds. It\'s straightforward — you pay interest only on what you borrowed.' },
        { q: 'Which grows faster — simple or compound?', a: 'Compound interest always grows faster than simple interest over time. The difference becomes dramatic over long periods. For example, $10,000 at 5% for 20 years: simple = $20,000 vs. compound = $26,533.' },
        { q: 'How does compounding frequency affect returns?', a: 'The more frequently interest compounds, the higher the effective annual yield. Daily compounding produces slightly more than annual compounding at the same nominal rate.' },
      ]
    case 'tax':
      return [
        { q: `How does the ${toolName} estimate my taxes?`, a: 'It applies a single effective rate to your gross income. Real tax calculations use brackets (marginal rates), deductions, and credits — so this is a simplified estimate, not a precise figure.' },
        { q: 'What is an effective tax rate?', a: 'Your effective (average) rate is total tax paid divided by total income. It\'s always lower than your marginal (top bracket) rate because lower portions of income are taxed at lower rates.' },
        { q: 'Should I use this calculator for filing taxes?', a: 'No. This calculator is for planning and estimation only. Always use official tax software or consult a qualified tax professional for filing your actual tax return.' },
        { q: 'What deductions can lower my tax bill?', a: 'Common deductions include the standard deduction, mortgage interest, charitable contributions, retirement contributions (401k/IRA), and medical expenses above a threshold.' },
      ]
    case 'debt':
      return [
        { q: 'How is the payoff timeline calculated?', a: 'The calculator uses the standard amortisation formula in reverse — given a balance, interest rate, and monthly payment, it computes the exact number of months until the balance reaches zero.' },
        { q: 'What happens if my payment only covers the interest?', a: 'If your monthly payment equals or is less than the monthly interest charge, you\'ll never pay off the debt. The calculator will warn you in this scenario.' },
        { q: 'What is the debt avalanche method?', a: 'The avalanche method prioritises paying down the highest interest rate debt first (while making minimum payments on others). It minimises total interest paid mathematically.' },
        { q: 'How much does making extra payments help?', a: 'Significantly. Even one extra payment per year can shave months or years off repayment. Extra payments go directly to principal, reducing interest charged in all future months.' },
        { q: 'Should I pay off debt or invest?', a: 'Generally, if your debt interest rate exceeds your expected investment return, pay down debt first. High-rate credit card debt (15–25%) almost always costs more than investment gains.' },
      ]
    case 'property':
      return [
        { q: 'What costs should I budget beyond the mortgage?', a: 'Budget for property taxes (1–3% of value/year), homeowner\'s insurance (~$1,000–2,000/year), maintenance (1–2% of value/year), and HOA fees if applicable.' },
        { q: 'How much house can I afford?', a: 'A common rule is to keep total housing costs below 28% of gross monthly income. Use our House Affordability Calculator for a full analysis based on your income and debts.' },
        { q: 'What is PMI and how can I avoid it?', a: 'Private Mortgage Insurance is required when your down payment is less than 20%. It adds $50–200/month to your payment. Put 20% down or reach 20% equity to remove it.' },
        { q: 'Is renting or buying better financially?', a: 'It depends on local prices, how long you plan to stay, and your financial goals. Buying builds equity but has higher upfront costs and less flexibility than renting.' },
      ]
    case 'retirement':
      return [
        { q: 'How much do I need to retire comfortably?', a: 'A common target is 25× your annual spending (the 4% rule). If you spend $60,000/year, target $1,500,000. This allows a 4% annual withdrawal rate with historically sustainable longevity.' },
        { q: 'What is the 4% rule?', a: 'Research suggests that withdrawing 4% of your portfolio in the first year of retirement, then adjusting for inflation each year, has a high historical probability of lasting 30+ years.' },
        { q: 'How does inflation affect retirement savings?', a: 'Inflation erodes purchasing power over time. A $1,000,000 portfolio in 30 years may only have the purchasing power of ~$400,000 in today\'s dollars at 3% average inflation.' },
        { q: 'When should I start saving for retirement?', a: 'As early as possible. Starting at 25 vs. 35 can result in nearly double the final balance due to compounding, even with the same total contributions.' },
        { q: 'What is the maximum 401(k) contribution?', a: 'In 2024, you can contribute up to $23,000/year ($30,500 if age 50+). Employer matching contributions do not count toward your personal limit.' },
      ]
    case 'health-index':
      return [
        { q: 'What is a healthy BMI range?', a: 'For adults: Underweight = below 18.5, Normal = 18.5–24.9, Overweight = 25.0–29.9, Obese = 30.0 and above. These categories apply to most adults 20 years and older.' },
        { q: 'Is BMI an accurate measure of health?', a: 'BMI is a screening tool, not a diagnostic one. It doesn\'t distinguish between muscle and fat. Athletes may have a high BMI while being very healthy. Consult a doctor for a full assessment.' },
        { q: 'Does BMI apply to children?', a: 'Children use age- and sex-specific BMI percentiles (BMI-for-age), not the adult categories. This calculator uses adult BMI only.' },
        { q: 'What affects BMI?', a: 'BMI is calculated from weight and height only. It doesn\'t account for muscle mass, bone density, fat distribution, age, or ethnicity — all of which influence health risk.' },
        { q: 'Can I have a normal BMI and still be unhealthy?', a: 'Yes. You can be "normal weight obese" — having a BMI in the normal range but high body fat percentage. Waist circumference and body fat tests provide additional insight.' },
      ]
    case 'health-calories':
      return [
        { q: 'What is BMR?', a: 'Basal Metabolic Rate (BMR) is the number of calories your body needs at complete rest to maintain vital functions like breathing, circulation, and cell production.' },
        { q: 'How do I use BMR to lose weight?', a: 'Multiply your BMR by your activity factor to get Total Daily Energy Expenditure (TDEE). To lose weight, eat roughly 500 calories/day below TDEE — that creates a 1 lb/week deficit.' },
        { q: 'Which BMR formula is most accurate?', a: 'The Mifflin-St Jeor equation (used here) is generally considered the most accurate for most adults, with a margin of error of about 10%. It was validated in a 2005 study of 498 adults.' },
        { q: 'Does muscle mass affect calorie needs?', a: 'Yes. Muscle burns more calories at rest than fat. Resistance training increases muscle mass over time, which raises your BMR and makes maintaining weight easier.' },
        { q: 'How many calories should I eat per day?', a: 'This varies significantly by age, sex, activity level, and goals. Most adults need 1,600–3,000 calories per day. Use your TDEE (BMR × activity factor) as a starting baseline.' },
      ]
    case 'health-fitness':
      return [
        { q: 'What is a healthy body fat percentage?', a: 'For men: Essential fat 2–5%, Athletes 6–13%, Fitness 14–17%, Average 18–24%, Obese 25%+. For women: Essential 10–13%, Athletes 14–20%, Fitness 21–24%, Average 25–31%, Obese 32%+.' },
        { q: 'How accurate is the Navy body fat method?', a: 'The U.S. Navy method has a margin of error of approximately ±3–4%. DEXA scan is considered the gold standard but the Navy method is a good free estimation for most people.' },
        { q: 'Where should I measure my waist for this calculation?', a: 'Measure at the level of your navel (belly button) when standing relaxed. Don\'t pull in your stomach. Take the measurement at the end of a normal exhale.' },
        { q: 'How does body fat percentage differ from BMI?', a: 'BMI uses only height and weight. Body fat percentage actually measures the proportion of fat tissue in your body. An athlete can have high BMI but low body fat.' },
      ]
    case 'pregnancy':
      return [
        { q: 'How is the due date calculated?', a: 'Naegele\'s Rule adds 280 days (40 weeks) to the first day of your last menstrual period (LMP). This is the standard method used by most healthcare providers worldwide.' },
        { q: 'What are the three trimesters?', a: 'First trimester: weeks 1–12. Second trimester: weeks 13–26. Third trimester: weeks 27–40. Most major organ development occurs in the first trimester.' },
        { q: 'How accurate is this due date estimate?', a: 'Only about 5% of babies are born on their exact due date. Most births occur within ±2 weeks of the due date. Ultrasound dating early in pregnancy is more accurate.' },
        { q: 'What is gestational age vs. fetal age?', a: 'Gestational age is counted from the first day of the last period (what this calculator uses). Fetal age (conception age) is about 2 weeks less. Medical providers use gestational age.' },
        { q: 'When should I see a doctor?', a: 'As soon as possible after a positive pregnancy test, ideally before 8 weeks. Early prenatal care significantly improves outcomes for both mother and baby.' },
      ]
    case 'math-basic':
      return [
        { q: `What operations does the ${toolName} support?`, a: 'Addition, subtraction, multiplication, division, and percentage calculation (A% of B). All results are shown simultaneously so you can compare operations at a glance.' },
        { q: 'How is the percentage calculated?', a: 'The percentage result shows A% of B — for example, if A=15 and B=200, the result is 30 (15% of 200). This is useful for tip calculations, discounts, and tax estimates.' },
        { q: 'What happens if I divide by zero?', a: 'Division by zero is mathematically undefined. The calculator will display "undefined" for the quotient when B = 0.' },
        { q: 'Can I use negative numbers?', a: 'Yes. The calculator handles positive and negative values correctly for all operations.' },
      ]
    case 'math-geometry':
      return [
        { q: 'What geometry formulas does this calculator include?', a: 'Pythagorean theorem (hypotenuse), rectangle area, circle area, and circle circumference. Enter side A and side B to compute all four results simultaneously.' },
        { q: 'What is the Pythagorean theorem?', a: 'In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides: c² = a² + b². This is one of the most fundamental theorems in geometry.' },
        { q: 'How is circle area calculated?', a: 'Circle area = π × r², where r is the radius (side A in this calculator). Pi (π) ≈ 3.14159. For diameter-based input, divide the diameter by 2 first.' },
        { q: 'What units does this calculator use?', a: 'The calculator is unit-agnostic — enter values in any unit (meters, feet, cm, inches) and the result will be in the same unit (or square units for areas).' },
      ]
    case 'math-stats':
      return [
        { q: 'What statistics does this calculator compute?', a: 'Count, mean (average), median (middle value), standard deviation, minimum, and maximum — all computed from a list of comma-separated numbers you provide.' },
        { q: 'What is standard deviation?', a: 'Standard deviation measures how spread out numbers are from the mean. A low SD means values are clustered near the mean; a high SD means they are spread out widely.' },
        { q: 'What is the difference between mean and median?', a: 'The mean is the arithmetic average (sum ÷ count). The median is the literal middle value when sorted. The median is more robust to outliers — for income data, median is usually more representative.' },
        { q: 'How many numbers can I enter?', a: 'Enter as many as you like, separated by commas (e.g. "10, 20, 30, 45, 50"). The calculator handles small and large datasets equally well.' },
        { q: 'Is this population or sample standard deviation?', a: 'This calculator uses population standard deviation (divides by n), not sample standard deviation (divides by n–1). For sample data, treat results as an approximation.' },
      ]
    case 'date-time':
      return [
        { q: `What does the ${toolName} calculate?`, a: 'It calculates the exact difference between two dates in days, weeks, months, and years. Enter any two dates to find how long apart they are.' },
        { q: 'How are months and years calculated?', a: 'Months are approximated as days ÷ 30.44 and years as days ÷ 365.25 (accounting for leap years). These are averages — the calculator shows both for clarity.' },
        { q: 'Can I calculate a future date?', a: 'Yes. Set Date B to a future date to count down days until a birthday, deadline, event, or retirement date.' },
        { q: 'Does this account for time zones?', a: 'No — date-only calculations are timezone-independent. It counts calendar days, not hours.' },
      ]
    case 'conversion':
      return [
        { q: 'What units does this converter support?', a: 'Currently supports length units: km, mi, m, ft, and in. Enter the value and source/target unit abbreviations in the fields provided.' },
        { q: 'How is unit conversion calculated?', a: 'All units are normalised to a common base (kilometres for length) using known conversion factors, then converted to the target unit.' },
        { q: 'Can I convert between metric and imperial?', a: 'Yes. Enter a metric unit (e.g. "km") as the source and an imperial unit (e.g. "mi") as the target to convert between the two systems.' },
        { q: 'What if I enter an unsupported unit?', a: 'The calculator will use a factor of 1 for unrecognised units, effectively returning the original value. Supported abbreviations: km, mi, m, ft, in.' },
      ]
    case 'engineering':
      return [
        { q: `What does the ${toolName} calculate?`, a: 'It computes the product and ratio of two values. This is useful for calculating gear ratios, torque, electrical power (V×I), pressure, force, or any derived quantity.' },
        { q: 'What is a ratio used for in engineering?', a: 'Ratios describe relationships between quantities — gear ratios, voltage dividers, mechanical advantage, mixing ratios, and more. A ratio of A÷B tells you how many times larger A is than B.' },
        { q: 'Can I calculate power (Watts)?', a: 'Yes. Enter voltage (V) as Value A and current (A) as Value B. The product gives you power in Watts (P = V × I).' },
        { q: 'Can I use decimals?', a: 'Yes. The calculator accepts any real numbers including decimals. Results are shown to 4 decimal places for precision.' },
      ]
    default:
      return [
        { q: `How does the ${toolName} work?`, a: 'Enter your values in the input fields and click Calculate. The result appears instantly with a detailed breakdown.' },
        { q: 'Is this calculator free to use?', a: 'Yes, completely free. No account, no signup, no limits. All calculations run directly in your browser.' },
        { q: 'How accurate are the results?', a: 'Results are mathematically precise based on the formula and values you provide. Accuracy depends on the quality of input data.' },
        { q: 'Can I use this on my phone?', a: 'Yes. The calculator is fully responsive and works on any device — desktop, tablet, or mobile.' },
      ]
  }
}

// ─── Pro Tips per formula type ────────────────────────────────
function getProTips(type: FormulaType, _toolName: string): string[] {
  switch (type) {
    case 'loan':
    case 'mortgage':
      return [
        'Even a 0.5% lower interest rate saves thousands over the life of a loan. Shop at least 3 lenders and get pre-approval before committing — lenders compete on rate when they know you have options.',
        'Making one extra payment per year directly toward principal can shorten a 30-year mortgage by 4–6 years and save over $30,000 in interest on a typical home loan.',
        'Your Annual Percentage Rate (APR) includes fees the interest rate does not — always compare APR, not just rate, when evaluating lender offers.',
        'Bi-weekly payments (half the monthly amount every 2 weeks) result in 26 half-payments per year — equivalent to 13 full monthly payments instead of 12, accelerating payoff.',
      ]
    case 'investment':
    case 'savings':
      return [
        'Time in the market beats timing the market. Missing just the 10 best trading days over 20 years can cut your returns in half. Stay invested through downturns.',
        'Tax-advantaged accounts (401k, Roth IRA) let your investments grow tax-free or tax-deferred — always max these before investing in taxable accounts.',
        'The Rule of 72: divide 72 by your annual return to estimate years to double. At 7%, money doubles every ~10.3 years. At 10%, every 7.2 years.',
        'Increase your contribution by just 1% of salary each year you get a raise. You won\'t notice the difference in take-home pay, but it compounds dramatically over decades.',
      ]
    case 'interest':
      return [
        'Compound interest is asymmetric: it helps you dramatically as an investor, but hurts you dramatically as a borrower on high-rate debt. Eliminate high-rate debt first.',
        'The effective annual rate (EAR) is always higher than the nominal rate when compounding is more frequent than annually. Monthly compounding at 6% nominal = 6.17% EAR.',
        'Comparing investments with different compounding frequencies? Convert all to Effective Annual Rate first for a true apples-to-apples comparison.',
        'High-yield savings accounts and CDs often advertise APY (annual percentage yield), which is the EAR — it accounts for compounding. Lower APR means less interest paid on loans.',
      ]
    case 'tax':
      return [
        'Maximizing your 401k or IRA contributions reduces your taxable income dollar-for-dollar. In the 22% bracket, a $6,500 IRA contribution saves $1,430 in taxes immediately.',
        'Your marginal tax rate is NOT what you pay on all your income. It only applies to income above the threshold. Someone in the 22% bracket pays far less on average.',
        'Self-employed? Track every business expense year-round — home office, internet, phone, mileage. Most people miss deductions and overpay by hundreds or thousands annually.',
        'Bunching charitable deductions into alternate years can let you itemize every other year rather than taking the standard deduction every year, maximizing total tax savings.',
      ]
    case 'debt':
      return [
        'Pay off the highest interest rate debt first (avalanche method) to minimise total interest paid mathematically. But the snowball method (lowest balance first) works better psychologically for many people.',
        'If your payment doesn\'t exceed the monthly interest charge, your balance grows forever. Run this calculator first to ensure your payment is sufficient before committing.',
        'Balance transfer cards with 0% introductory APR can save hundreds if you can pay off the balance within the promotional period — but read the fine print on fees and reversion rates.',
        'An extra $100/month toward a $10,000 credit card at 19.9% APR reduces payoff time from 10+ years to under 5 years and saves over $6,000 in interest.',
      ]
    case 'retirement':
      return [
        'The difference between starting at 25 vs 35 with the same monthly contribution is not 10 years — it\'s often double the final balance. The first decade of compounding is the most powerful.',
        'If your employer matches 401k contributions, that\'s a guaranteed 50–100% return on that money before it even invests. Never leave employer match unclaimed.',
        'Use a 3% withdrawal rate instead of 4% if you plan to retire before 60 — a 40-50 year retirement needs more conservative withdrawals to avoid running out of money.',
        'Run this calculator with pessimistic inputs (5% return, 30-year retirement) and optimistic inputs (8%, 20 years). The range tells you how much buffer you need.',
      ]
    case 'health-index':
      return [
        'BMI does not distinguish between muscle and fat — athletes routinely register as "overweight." Use BMI alongside waist circumference and body fat percentage for a complete picture.',
        'Waist-to-height ratio (waist ÷ height) below 0.5 is a strong predictor of metabolic health — often more useful than BMI for assessing cardiovascular risk.',
        'Asian populations have higher metabolic risk at lower BMI values. Some clinicians use BMI ≥23 as overweight for Asian adults, not the WHO standard of 25.',
        'Track your BMI trend over months, not as a single snapshot. A consistent downward trend matters far more than hitting a specific number on any given day.',
      ]
    case 'health-calories':
      return [
        'The Mifflin-St Jeor equation used here is the most validated for most adults. But BMR estimates can be off by 10-15% — actual calorie needs require tracking and adjustment.',
        'A calorie deficit of 500/day theoretically produces 1 lb/week of fat loss, but metabolic adaptation slows this over time. Break plateaus with diet breaks and strength training.',
        'Protein has the highest thermic effect of food (20-35% of calories burned digesting it) and preserves muscle during weight loss. Prioritise it to protect your BMR.',
        'Exercise activity is often overestimated. Most fitness apps overcalculate calorie burn. Focus on non-exercise activity thermogenesis (NEAT) — walking, fidgeting, daily movement.',
      ]
    case 'health-fitness':
      return [
        'Body fat percentage, not BMI, determines whether you\'re overfat. Someone with 30% body fat at "normal" BMI (skinny fat) has the same metabolic risk as an overweight person.',
        'The Navy method used here has a ±3-4% margin of error. DEXA scans are most accurate but expensive — good for periodic validation, not daily tracking.',
        'Reducing body fat while maintaining muscle mass (recomposition) is the goal — not just weight loss. Track body fat %, not weight, to confirm you\'re losing fat not muscle.',
        'Men below 6% and women below 14% body fat reach essential fat levels needed for organ function — do not target these for general health and fitness goals.',
      ]
    case 'pregnancy':
      return [
        'Only about 5% of babies are born on their due date — the Naegele\'s Rule date is the midpoint of a 5-week window. Don\'t over-plan for the exact date.',
        'Early ultrasound (6-10 weeks) is more accurate for dating than last menstrual period if your cycles are irregular. Your OB may adjust your due date based on ultrasound.',
        'Gestational age in weeks is counted from LMP, not conception. "6 weeks pregnant" means 6 weeks since your last period, which is only 4 weeks since likely conception.',
        'Track your symptoms week by week using the trimester milestones. Many pregnancy apps let you export a report — useful to share with your healthcare provider.',
      ]
    case 'math-basic':
    case 'math-geometry':
    case 'math-stats':
      return [
        'For percentage calculations, convert the percentage to a decimal first (divide by 100) — this prevents calculation errors: 15% = 0.15, so 15% of 80 = 0.15 × 80 = 12.',
        'When working with large numbers, use scientific notation to check your work. A calculator result that\'s off by a factor of 10 usually means a decimal point was misplaced.',
        'Standard deviation close to zero means data is clustered tightly around the mean. High SD means high variability. Always report both mean and SD together for complete information.',
        'Cross-check critical calculations with a different method or tool. For geometry, verify with the Pythagorean theorem. For statistics, verify mean with (max+min)/2 as a sanity check.',
      ]
    case 'date-time':
      return [
        'Business days vs calendar days matter for deadlines. A 30-day contract deadline is 30 calendar days, but a "30 business day" deadline is closer to 6 weeks.',
        'Leap years (every 4 years, except century years not divisible by 400) add 1 day. Long-term date calculations that span February should account for this.',
        'For countdown timers to important dates, include time zones — "Friday midnight" in New York is 3 hours different from California.',
        'Age in years alone hides important milestones. "30 years, 6 months" is much more precise than "30 years old" for medical or legal calculations that need exact age.',
      ]
    case 'conversion':
      return [
        'Always double-check your unit conversion direction — dividing when you should multiply (or vice versa) produces a result off by the conversion factor squared.',
        'For temperature conversions, remember the formulas differ: Celsius to Fahrenheit = (C × 9/5) + 32. Fahrenheit to Celsius = (F − 32) × 5/9. Kelvin = Celsius + 273.15.',
        'Imperial units have multiple definitions (fluid ounce vs weight ounce, US vs UK gallon). Always confirm which system applies — especially for cooking or scientific work.',
        'Significant figures matter in scientific conversions. If your input has 2 significant figures, don\'t report 6 decimal places of precision — it implies false accuracy.',
      ]
    default:
      return [
        `Always verify critical calculations with a second method or source — for important decisions, this tool provides a starting point, not a final answer.`,
        'Input accuracy determines output accuracy. Use precise values rather than rough estimates for the most useful results.',
        'Run the calculation multiple times with slightly different inputs to understand the sensitivity of the result to your assumptions.',
        'For professional, financial, medical, or legal decisions, always confirm results with a qualified professional before acting.',
      ]
  }
}

// ─── When to Use per formula type ────────────────────────────
interface WhenToUseItem { icon: string; title: string; description: string }

function getWhenToUse(type: FormulaType, toolName: string): WhenToUseItem[] {
  switch (type) {
    case 'loan':
      return [
        { icon: '🚗', title: 'Auto loan comparison', description: 'Compare dealer financing vs. bank pre-approval to find the lowest monthly payment and total cost before you sign.' },
        { icon: '🎓', title: 'Student loan planning', description: 'Estimate monthly payments before taking out student loans to ensure they fit within your future income budget.' },
        { icon: '💼', title: 'Business loan analysis', description: 'Calculate the cost of a business loan before applying — know your break-even point before borrowing.' },
        { icon: '🏦', title: 'Comparing loan offers', description: 'Enter identical principal and term with different rates to instantly compare the true cost of competing offers.' },
        { icon: '📊', title: 'Debt consolidation planning', description: 'See if consolidating multiple debts into a single lower-rate loan reduces your total monthly payment and interest.' },
      ]
    case 'mortgage':
      return [
        { icon: '🏠', title: 'First-time home buyer', description: 'Estimate your monthly payment before house hunting to set a realistic budget and avoid over-extending.' },
        { icon: '🔄', title: 'Refinancing decision', description: 'Compare your current payment to a refinanced rate to calculate the break-even point and total interest savings.' },
        { icon: '📅', title: 'Comparing loan terms', description: '15-year vs 30-year mortgage: see the payment difference and total interest cost side-by-side to make an informed choice.' },
        { icon: '📋', title: 'Affordability check', description: 'Work backwards from your maximum monthly payment to find the home price and loan amount you can comfortably afford.' },
        { icon: '🏘️', title: 'Rental property analysis', description: 'Calculate the mortgage cost for an investment property to determine if rental income will cover the payment.' },
      ]
    case 'investment':
    case 'savings':
      return [
        { icon: '🌱', title: 'Starting to invest', description: 'See how even small monthly contributions grow dramatically over time with compound returns — motivation to start immediately.' },
        { icon: '🎓', title: 'Education fund planning', description: 'Calculate how much to save monthly to reach a college fund target in 10–18 years at a realistic return rate.' },
        { icon: '🏖️', title: 'Retirement planning', description: 'Project your portfolio balance at retirement based on current savings rate and expected returns.' },
        { icon: '💰', title: 'Lump sum vs regular investment', description: 'Compare the outcome of investing a windfall now versus spreading it as monthly contributions over time.' },
        { icon: '📊', title: 'Return rate comparison', description: 'Compare outcomes at different return rates (5%, 7%, 9%) to understand the impact of investment choice on final balance.' },
      ]
    case 'interest':
      return [
        { icon: '💰', title: 'Savings account comparison', description: 'Compare interest earned between accounts with different rates to pick the best place for your emergency fund.' },
        { icon: '📈', title: 'CD and bond analysis', description: 'Calculate exact interest earned on a certificate of deposit or bond before locking in your money.' },
        { icon: '🏦', title: 'Loan interest cost', description: 'See the total interest you will pay over the life of any loan — a figure lenders often don\'t highlight upfront.' },
        { icon: '🔄', title: 'Simple vs compound comparison', description: 'Visualise the difference between simple and compound interest over time to understand why compound matters.' },
        { icon: '📊', title: 'Investment return projection', description: 'Estimate final value of an investment given an assumed interest rate and time horizon.' },
      ]
    case 'tax':
      return [
        { icon: '💼', title: 'Job offer evaluation', description: 'Compare the after-tax take-home pay of job offers with different salaries and benefits packages.' },
        { icon: '💰', title: 'Freelance income planning', description: 'Estimate quarterly tax payments for self-employment income to avoid underpayment penalties.' },
        { icon: '🏖️', title: 'Retirement income planning', description: 'Estimate taxes on withdrawals from retirement accounts to plan a tax-efficient drawdown strategy.' },
        { icon: '🏠', title: 'Rental income tax estimate', description: 'Get a rough tax estimate on rental property income when evaluating a real estate investment.' },
        { icon: '📊', title: 'Year-end tax planning', description: 'Estimate your tax bill before the year ends so you can make strategic deductions or contributions.' },
      ]
    case 'debt':
      return [
        { icon: '💳', title: 'Credit card payoff planning', description: 'See exactly how long it takes to pay off credit card debt at your current payment — motivation to pay more.' },
        { icon: '📊', title: 'Debt avalanche planning', description: 'Calculate payoff timelines for multiple debts to prioritise by interest rate and minimise total interest.' },
        { icon: '💸', title: 'Extra payment impact', description: 'See how much time and money an extra $50–200/month saves to motivate accelerated payoff.' },
        { icon: '🔄', title: 'Balance transfer evaluation', description: 'Compare payoff at current rate vs 0% promotional rate to decide if a balance transfer makes financial sense.' },
        { icon: '🏦', title: 'Minimum payment reality check', description: 'Calculate how long minimum payments take — and how much interest you\'ll pay — on any debt balance.' },
      ]
    case 'retirement':
      return [
        { icon: '🌱', title: 'Starting your career', description: 'See how $200–500/month in your 20s can grow to over $1M by retirement with compound growth.' },
        { icon: '📊', title: 'Mid-career check-in', description: 'Assess whether your current savings rate will hit your retirement target and calculate the gap.' },
        { icon: '🏖️', title: 'Early retirement planning', description: 'Model retirement at 55 or 50 to find out what savings rate achieves financial independence early.' },
        { icon: '📅', title: 'Comparing contribution levels', description: 'Compare 6% vs 10% 401k contributions to quantify the long-term impact of a higher savings rate.' },
        { icon: '💰', title: 'Estimating income at retirement', description: 'Find out how much monthly income your projected balance will produce using the 4% rule.' },
      ]
    case 'health-index':
      return [
        { icon: '📋', title: 'Annual health check', description: 'Calculate your BMI as part of your annual health self-assessment alongside blood pressure and cholesterol.' },
        { icon: '🎯', title: 'Setting weight loss goals', description: 'Find the BMI-normal weight range for your height to set a realistic, medically-recognised target weight.' },
        { icon: '👶', title: 'Pre-pregnancy planning', description: 'Check whether BMI is in the healthy range before conceiving — optimal range reduces pregnancy complications.' },
        { icon: '🏋️', title: 'Fitness progress tracking', description: 'Monitor BMI monthly during a training program — though note athletes may show high BMI despite low body fat.' },
        { icon: '⚕️', title: 'Before a doctor\'s appointment', description: 'Calculate your BMI in advance so you can have an informed conversation about your weight with your healthcare provider.' },
      ]
    case 'health-calories':
      return [
        { icon: '🥗', title: 'Starting a weight loss plan', description: 'Calculate your TDEE (BMR × activity) to know your calorie maintenance level before creating a deficit.' },
        { icon: '💪', title: 'Muscle building diet', description: 'Find your calorie maintenance level to add a 200–300 calorie surplus for lean muscle gain.' },
        { icon: '🏃', title: 'Training for endurance events', description: 'Adjust calorie needs upward for marathon training or other high-intensity programs where TDEE increases dramatically.' },
        { icon: '📊', title: 'Calorie tracking baseline', description: 'Get a starting calorie target to enter into a food tracking app. Adjust up or down after 2–3 weeks based on results.' },
        { icon: '⚕️', title: 'Post-surgery recovery', description: 'Calculate calorie needs during recovery periods when activity level changes, ensuring adequate nutrition for healing.' },
      ]
    case 'health-fitness':
      return [
        { icon: '🏋️', title: 'Starting a body recomposition', description: 'Measure body fat percentage at baseline before a diet and training program to track fat loss vs muscle gain.' },
        { icon: '📊', title: 'Monthly fitness tracking', description: 'Check body fat percentage monthly to confirm fat loss progress, especially if weight on the scale isn\'t changing.' },
        { icon: '🎯', title: 'Setting a realistic goal', description: 'Find your current body fat percentage and set a realistic target (e.g., reach athlete category for your sex).' },
        { icon: '⚕️', title: 'Pre-physical check', description: 'Estimate body fat before a military, fire department, or athletic physical where body composition standards apply.' },
        { icon: '🧬', title: 'Understanding BMI limitations', description: 'Calculate body fat alongside BMI to get a complete picture when BMI alone gives a misleading result.' },
      ]
    case 'pregnancy':
      return [
        { icon: '📅', title: 'Planning maternity leave', description: 'Calculate your due date to plan maternity leave timing, financial preparation, and childcare arrangements.' },
        { icon: '🏥', title: 'Before first prenatal appointment', description: 'Calculate your estimated due date in advance so you can ask the right questions at your first OB appointment.' },
        { icon: '📦', title: 'Baby shower timing', description: 'Know your due date to schedule the baby shower at the right time — typically 4–6 weeks before delivery.' },
        { icon: '👪', title: 'Birth announcement planning', description: 'Share your due date with family and friends as a planning tool, while reminding them only 5% of babies arrive on that date.' },
        { icon: '🎓', title: 'Academic year planning', description: 'Parents of multiple children often plan birth timing around school enrollment cutoffs — use the due date to estimate.' },
      ]
    case 'math-basic':
    case 'math-geometry':
      return [
        { icon: '🏗️', title: 'Construction and DIY', description: 'Calculate area for flooring, paint coverage, or fencing before purchasing materials.' },
        { icon: '🎓', title: 'Homework and exam prep', description: 'Verify calculations and practice working through problems step by step.' },
        { icon: '🏡', title: 'Home improvement planning', description: 'Calculate room dimensions, wall area, or volume of materials needed for renovation projects.' },
        { icon: '📐', title: 'Engineering estimates', description: 'Quick calculations for engineering problems where precision is needed before formal computation.' },
        { icon: '🛒', title: 'Shopping math', description: 'Calculate discounts, percentage savings, or unit price comparisons while shopping.' },
      ]
    case 'math-stats':
      return [
        { icon: '📊', title: 'Data analysis', description: 'Quickly summarise a dataset with mean, median, and standard deviation for a data analysis project.' },
        { icon: '🎓', title: 'Statistics homework', description: 'Verify manual calculations and understand the steps in descriptive statistics problems.' },
        { icon: '📋', title: 'Survey result analysis', description: 'Analyse survey scores or ratings to find central tendency and spread of responses.' },
        { icon: '🔬', title: 'Scientific research', description: 'Get quick descriptive statistics on experimental data before running formal inferential tests.' },
        { icon: '💼', title: 'Business metrics', description: 'Calculate mean and variance of sales, performance scores, or customer metrics for reporting.' },
      ]
    case 'date-time':
      return [
        { icon: '📅', title: 'Project deadline planning', description: 'Calculate exact days between today and a project deadline to plan work backwards.' },
        { icon: '🎂', title: 'Age and birthday calculation', description: 'Find exact age in days, weeks, or months for birthday milestones or official age verification.' },
        { icon: '✈️', title: 'Travel planning', description: 'Calculate days until a trip or visa expiry, or find the length of a journey between dates.' },
        { icon: '📋', title: 'Contract and lease terms', description: 'Verify contract end dates, notice periods, or lease expiry dates down to the exact day.' },
        { icon: '🏋️', title: 'Fitness challenge tracking', description: 'Count down days in a 30-day, 60-day, or 90-day fitness or habit challenge.' },
      ]
    case 'conversion':
      return [
        { icon: '✈️', title: 'International travel', description: 'Convert between metric and imperial units for temperature, distances, weights, and speeds when travelling abroad.' },
        { icon: '🍳', title: 'Cooking and recipes', description: 'Convert between US and metric measurements for international recipes or ingredient scaling.' },
        { icon: '🔬', title: 'Scientific work', description: 'Convert units for scientific calculations where SI units are required.' },
        { icon: '🏗️', title: 'Construction projects', description: 'Convert between measurement systems when working with international suppliers or standards.' },
        { icon: '🛒', title: 'Shopping comparisons', description: 'Convert units to compare product sizes and prices across different packaging formats.' },
      ]
    default:
      return [
        { icon: '📊', title: 'Quick calculations', description: `Use the ${toolName} for fast, accurate calculations without installing any software.` },
        { icon: '🎓', title: 'Learning and education', description: 'Understand the formula and see how changing inputs affects the result for educational purposes.' },
        { icon: '💼', title: 'Professional estimates', description: 'Get a quick estimate before performing more detailed analysis or consulting a professional.' },
        { icon: '📱', title: 'On the go', description: 'Accessible from any device — no app to install, no account required, works offline after loading.' },
        { icon: '🔄', title: 'Scenario comparison', description: 'Run multiple scenarios quickly by changing one input at a time to understand sensitivities.' },
      ]
  }
}

// ─── Formula runner ───────────────────────────────────────────
function runFormula(type: FormulaType, vals: Record<string, string>): string {
  const n = (k: string) => parseFloat(vals[k] || '0')
  try {
    switch (type) {
      case 'loan':
      case 'mortgage': {
        const P = n('principal')
        const r = n('rate') / 100 / 12
        const t = n('term') * 12
        if (P <= 0 || t <= 0) return 'Enter valid values'
        if (r === 0) return `Monthly payment: $${(P / t).toFixed(2)}`
        const M = P * (r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1)
        const total = M * t
        return `Monthly payment: $${M.toFixed(2)}\nTotal paid: $${total.toFixed(2)}\nTotal interest: $${(total - P).toFixed(2)}`
      }
      case 'investment':
      case 'savings': {
        const P = n('principal')
        const r = n('rate') / 100
        const t = n('years')
        const pmt = n('contribution') || 0
        const A = P * Math.pow(1 + r / 12, 12 * t) +
          pmt * (Math.pow(1 + r / 12, 12 * t) - 1) / (r / 12)
        return `Future value: $${isFinite(A) ? A.toFixed(2) : '—'}\nGain: $${isFinite(A) ? (A - P - pmt * 12 * t).toFixed(2) : '—'}`
      }
      case 'interest': {
        const P = n('principal')
        const r = n('rate') / 100
        const t = n('years')
        const simple = P * r * t
        const compound = P * Math.pow(1 + r, t) - P
        return `Simple interest: $${simple.toFixed(2)}\nCompound interest: $${compound.toFixed(2)}\nFinal balance (compound): $${(P + compound).toFixed(2)}`
      }
      case 'tax': {
        const income = n('income')
        const rate = n('rate')
        const taxAmt = income * rate / 100
        return `Estimated tax: $${taxAmt.toFixed(2)}\nTake-home pay: $${(income - taxAmt).toFixed(2)}\nEffective rate: ${rate.toFixed(1)}%`
      }
      case 'debt': {
        const balance = n('balance')
        const rate = n('rate') / 100 / 12
        const payment = n('payment')
        if (payment <= balance * rate) return 'Payment too low to cover interest'
        const months = Math.log(payment / (payment - balance * rate)) / Math.log(1 + rate)
        const total = payment * months
        return `Payoff time: ${Math.ceil(months)} months (${(months / 12).toFixed(1)} years)\nTotal paid: $${total.toFixed(2)}\nTotal interest: $${(total - balance).toFixed(2)}`
      }
      case 'property': {
        const price = n('price')
        const down = n('down')
        const rate = n('rate') / 100 / 12
        const term = n('term') * 12
        const loan = price - down
        const M = loan * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
        return `Loan amount: $${loan.toFixed(2)}\nMonthly payment: $${M.toFixed(2)}\nTotal paid: $${(M * term + down).toFixed(2)}`
      }
      case 'retirement': {
        const current = n('currentAge')
        const retire = n('retireAge')
        const balance = n('balance')
        const monthly = n('contribution')
        const rate = n('rate') / 100 / 12
        const months = (retire - current) * 12
        const future = balance * Math.pow(1 + rate, months) +
          monthly * (Math.pow(1 + rate, months) - 1) / rate
        return `Estimated balance at retirement: $${future.toFixed(2)}\nYears to retirement: ${retire - current}\nTotal contributions: $${(monthly * months + balance).toFixed(2)}`
      }
      case 'health-index': {
        const weight = n('weight')
        const height = n('height') / 100
        const bmi = weight / (height * height)
        let category = ''
        if (bmi < 18.5) category = 'Underweight'
        else if (bmi < 25) category = 'Normal weight'
        else if (bmi < 30) category = 'Overweight'
        else category = 'Obese'
        return `Result: ${isFinite(bmi) ? bmi.toFixed(1) : '—'}\nCategory: ${category}`
      }
      case 'health-calories': {
        const weight = n('weight')
        const height = n('height')
        const age = n('age')
        const bmr = 10 * weight + 6.25 * height - 5 * age + 5
        return `BMR: ${bmr.toFixed(0)} kcal/day\nSedentary: ${(bmr * 1.2).toFixed(0)} kcal\nModerately active: ${(bmr * 1.55).toFixed(0)} kcal\nVery active: ${(bmr * 1.9).toFixed(0)} kcal`
      }
      case 'health-fitness': {
        const weight = n('weight')
        const waist = n('waist')
        const neck = n('neck')
        const height = n('height')
        const fat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
        return `Estimated body fat: ${isFinite(fat) ? fat.toFixed(1) : '—'}%\nLean mass: ${isFinite(fat) ? (weight * (1 - fat / 100)).toFixed(1) : '—'} kg`
      }
      case 'pregnancy': {
        const weeks = n('weeks')
        const daysLeft = (40 - weeks) * 7
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + daysLeft)
        return `Weeks remaining: ${Math.max(0, 40 - weeks).toFixed(0)}\nApprox. due date: ${dueDate.toDateString()}\nTrimester: ${weeks < 13 ? '1st' : weeks < 27 ? '2nd' : '3rd'}`
      }
      case 'math-basic': {
        const a = n('valueA')
        const b = n('valueB')
        if (isNaN(a) || isNaN(b)) return 'Enter valid numbers'
        return `Sum: ${(a + b).toFixed(4)}\nDifference: ${(a - b).toFixed(4)}\nProduct: ${(a * b).toFixed(4)}\nQuotient: ${b !== 0 ? (a / b).toFixed(4) : 'undefined'}\nPercentage (A% of B): ${((a / 100) * b).toFixed(4)}`
      }
      case 'math-geometry': {
        const a = n('sideA')
        const b = n('sideB')
        return `Hypotenuse: ${Math.sqrt(a * a + b * b).toFixed(4)}\nArea (rectangle): ${(a * b).toFixed(4)}\nCircle area (r=a): ${(Math.PI * a * a).toFixed(4)}\nCircle circumference: ${(2 * Math.PI * a).toFixed(4)}`
      }
      case 'math-stats': {
        const raw = vals['numbers'] || ''
        const nums = raw.split(',').map(s => parseFloat(s.trim())).filter(x => !isNaN(x))
        if (nums.length === 0) return 'Enter comma-separated numbers'
        const sorted = [...nums].sort((a, b) => a - b)
        const mean = nums.reduce((s, x) => s + x, 0) / nums.length
        const median = nums.length % 2 === 0
          ? (sorted[nums.length / 2 - 1] + sorted[nums.length / 2]) / 2
          : sorted[Math.floor(nums.length / 2)]
        const variance = nums.reduce((s, x) => s + (x - mean) ** 2, 0) / nums.length
        const sd = Math.sqrt(variance)
        return `Count: ${nums.length}\nMean: ${mean.toFixed(4)}\nMedian: ${median.toFixed(4)}\nStd. deviation: ${sd.toFixed(4)}\nMin: ${sorted[0]}  Max: ${sorted[sorted.length - 1]}`
      }
      case 'date-time': {
        const d1 = new Date(vals['dateA'] || new Date())
        const d2 = new Date(vals['dateB'] || new Date())
        const diff = Math.abs(d2.getTime() - d1.getTime())
        const days  = Math.floor(diff / 86400000)
        const weeks = Math.floor(days / 7)
        const months = Math.floor(days / 30.44)
        return `Days: ${days}\nWeeks: ${weeks}\nMonths: ${months}\nYears: ${(days / 365.25).toFixed(2)}`
      }
      case 'conversion': {
        const val = n('value')
        const from = vals['from'] || 'km'
        const to   = vals['to']   || 'mi'
        const rates: Record<string, number> = { km: 1, mi: 1.60934, m: 0.001, ft: 0.0003048, in: 0.0000254 }
        const result = rates[from] ? val * rates[from] / (rates[to] || 1) : val
        return `${val} ${from} = ${result.toFixed(6)} ${to}`
      }
      case 'engineering': {
        const a = n('valueA')
        const b = n('valueB')
        return `Result: ${(a * b).toFixed(4)}\nRatio: ${b !== 0 ? (a / b).toFixed(4) : 'N/A'}`
      }
      case 'general':
      default: {
        const a = n('valueA')
        const b = n('valueB')
        return `Value A: ${a}\nValue B: ${b}\nSum: ${a + b}\nProduct: ${a * b}`
      }
    }
  } catch {
    return 'Calculation error — check your inputs.'
  }
}

// ─── Fields per formula type ──────────────────────────────────
function getFields(type: FormulaType): Field[] {
  switch (type) {
    case 'loan':
      return [
        { id: 'principal',    label: 'Loan Amount',            placeholder: '25000',  unit: '$' },
        { id: 'rate',         label: 'Annual Interest Rate',   placeholder: '6.5',    unit: '%' },
        { id: 'term',         label: 'Loan Term',              placeholder: '5',      unit: 'years' },
      ]
    case 'mortgage':
      return [
        { id: 'principal',    label: 'Home Price',             placeholder: '350000', unit: '$' },
        { id: 'rate',         label: 'Annual Interest Rate',   placeholder: '7.0',    unit: '%' },
        { id: 'term',         label: 'Loan Term',              placeholder: '30',     unit: 'years' },
      ]
    case 'investment':
    case 'savings':
      return [
        { id: 'principal',    label: 'Initial Amount',         placeholder: '10000',  unit: '$' },
        { id: 'rate',         label: 'Annual Return Rate',     placeholder: '8',      unit: '%' },
        { id: 'years',        label: 'Time Period',            placeholder: '10',     unit: 'years' },
        { id: 'contribution', label: 'Monthly Contribution',   placeholder: '200',    unit: '$' },
      ]
    case 'interest':
      return [
        { id: 'principal',    label: 'Principal',              placeholder: '5000',   unit: '$' },
        { id: 'rate',         label: 'Annual Rate',            placeholder: '5',      unit: '%' },
        { id: 'years',        label: 'Time Period',            placeholder: '3',      unit: 'years' },
      ]
    case 'tax':
      return [
        { id: 'income',       label: 'Annual Income',          placeholder: '75000',  unit: '$' },
        { id: 'rate',         label: 'Tax Rate',               placeholder: '22',     unit: '%' },
      ]
    case 'debt':
      return [
        { id: 'balance',      label: 'Debt Balance',           placeholder: '8000',   unit: '$' },
        { id: 'rate',         label: 'Annual Interest Rate',   placeholder: '19.9',   unit: '%' },
        { id: 'payment',      label: 'Monthly Payment',        placeholder: '250',    unit: '$' },
      ]
    case 'property':
      return [
        { id: 'price',        label: 'Property Price',         placeholder: '400000', unit: '$' },
        { id: 'down',         label: 'Down Payment',           placeholder: '80000',  unit: '$' },
        { id: 'rate',         label: 'Interest Rate',          placeholder: '7.0',    unit: '%' },
        { id: 'term',         label: 'Loan Term',              placeholder: '30',     unit: 'years' },
      ]
    case 'retirement':
      return [
        { id: 'currentAge',   label: 'Current Age',            placeholder: '35',     unit: 'years' },
        { id: 'retireAge',    label: 'Retirement Age',         placeholder: '65',     unit: 'years' },
        { id: 'balance',      label: 'Current Balance',        placeholder: '50000',  unit: '$' },
        { id: 'contribution', label: 'Monthly Contribution',   placeholder: '500',    unit: '$' },
        { id: 'rate',         label: 'Annual Return Rate',     placeholder: '7',      unit: '%' },
      ]
    case 'health-index':
      return [
        { id: 'weight',       label: 'Weight',                 placeholder: '70',     unit: 'kg' },
        { id: 'height',       label: 'Height',                 placeholder: '175',    unit: 'cm' },
      ]
    case 'health-calories':
      return [
        { id: 'weight',       label: 'Weight',                 placeholder: '70',     unit: 'kg' },
        { id: 'height',       label: 'Height',                 placeholder: '175',    unit: 'cm' },
        { id: 'age',          label: 'Age',                    placeholder: '30',     unit: 'years' },
      ]
    case 'health-fitness':
      return [
        { id: 'weight',       label: 'Body Weight',            placeholder: '75',     unit: 'kg' },
        { id: 'height',       label: 'Height',                 placeholder: '180',    unit: 'cm' },
        { id: 'waist',        label: 'Waist',                  placeholder: '85',     unit: 'cm' },
        { id: 'neck',         label: 'Neck',                   placeholder: '38',     unit: 'cm' },
      ]
    case 'pregnancy':
      return [
        { id: 'weeks',        label: 'Current Weeks Pregnant', placeholder: '12',     unit: 'weeks' },
      ]
    case 'math-basic':
      return [
        { id: 'valueA',       label: 'Value A',                placeholder: '100' },
        { id: 'valueB',       label: 'Value B',                placeholder: '25' },
      ]
    case 'math-geometry':
      return [
        { id: 'sideA',        label: 'Side A / Radius',        placeholder: '5',      unit: 'units' },
        { id: 'sideB',        label: 'Side B',                 placeholder: '12',     unit: 'units' },
      ]
    case 'math-stats':
      return [
        { id: 'numbers',      label: 'Numbers (comma-separated)', placeholder: '10, 20, 30, 40, 50', type: 'text' },
      ]
    case 'date-time':
      return [
        { id: 'dateA',        label: 'Start Date / Date A',    placeholder: '', type: 'text' },
        { id: 'dateB',        label: 'End Date / Date B',      placeholder: '', type: 'text' },
      ]
    case 'conversion':
      return [
        { id: 'value',        label: 'Value',                  placeholder: '10' },
        { id: 'from',         label: 'From unit (km/mi/m/ft)', placeholder: 'km', type: 'text' },
        { id: 'to',           label: 'To unit (km/mi/m/ft)',   placeholder: 'mi', type: 'text' },
      ]
    case 'engineering':
      return [
        { id: 'valueA',       label: 'Value A',                placeholder: '100' },
        { id: 'valueB',       label: 'Value B',                placeholder: '25' },
      ]
    default:
      return [
        { id: 'valueA',       label: 'Value A',                placeholder: '0' },
        { id: 'valueB',       label: 'Value B',                placeholder: '0' },
      ]
  }
}

// ─── Chart helpers ────────────────────────────────────────────
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

function parseChartData(result: string): { name: string; value: number }[] {
  return result
    .split('\n')
    .filter(line => line.includes(':'))
    .map(line => {
      const [label, ...rest] = line.split(':')
      const raw = rest.join(':').replace(/[$,%\s]/g, '')
      const value = parseFloat(raw)
      return { name: label.trim(), value: isNaN(value) ? 0 : Math.abs(value) }
    })
    .filter(d => d.value > 0)
}

// ─── Main client component ────────────────────────────────────
export default function GenericCalculatorClient({ tool }: { tool: CalcEntry }) {
  const fields = getFields(tool.formulaType)
  const formulaInfo = getFormulaInfo(tool.formulaType)
  const seoConfig = getCalcSEO(tool.slug)
  const chartType = seoConfig?.chartType
  // Prefer SEO-specific FAQs, fall back to formula-type generic FAQs
  const faqs = (seoConfig?.faqs && seoConfig.faqs.length >= 4) ? seoConfig.faqs : getFAQs(tool.formulaType, tool.name)
  const proTips = getProTips(tool.formulaType, tool.name)
  const whenToUse = getWhenToUse(tool.formulaType, tool.name)

  const [vals, setVals]     = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    if (tool.formulaType === 'date-time') {
      const today = new Date().toISOString().split('T')[0]
      const pastDate = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0]
      init['dateA'] = pastDate
      init['dateB'] = today
    }
    fields.forEach(f => { if (f.defaultValue) init[f.id] = f.defaultValue })
    return init
  })
  const [result, setResult] = useState<string | null>(null)
  const [error,  setError]  = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [copied,  setCopied]  = useState(false)

  const calculate = useCallback(() => {
    setError(null)
    try {
      const out = runFormula(tool.formulaType, vals)
      setResult(out)
    } catch {
      setError('Something went wrong. Please check your inputs.')
    }
  }, [tool.formulaType, vals])

  const reset = useCallback(() => {
    setVals({})
    setResult(null)
    setError(null)
    setCopied(false)
  }, [])

  // Real-time calculation — fires on every input change
  useEffect(() => {
    const hasInput = Object.values(vals).some(v => v !== '' && v !== undefined)
    if (!hasInput) return
    setError(null)
    try {
      const out = runFormula(tool.formulaType, vals)
      setResult(out)
    } catch {
      setError('Something went wrong. Please check your inputs.')
    }
  }, [vals, tool.formulaType])

  // Copy result to clipboard
  const handleCopy = useCallback(() => {
    if (!result) return
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [result])

  // PDF export — uses the shared exportCalcPDF helper (autotable-based, with error feedback)
  const [pdfError, setPdfError] = useState<string | null>(null)

  const handlePDF = useCallback(async () => {
    if (!result) return
    setPdfError(null)
    try {
      const { exportCalcPDF } = await import('@/lib/calcPdf')

      // Build inputs from current field values
      const inputRows = fields
        .map(f => ({ label: f.label, value: vals[f.id] ?? '', unit: f.unit }))
        .filter(r => String(r.value).trim() !== '')

      // Build results from the newline-separated result string
      const resultRows = result
        .split('\n')
        .filter(line => line.trim() && line.includes(':'))
        .map((line, i) => {
          const [label, ...rest] = line.split(':')
          return { label: label.trim(), value: rest.join(':').trim(), highlight: i === 0 }
        })

      await exportCalcPDF({
        toolName: tool.name,
        inputs:  inputRows.length > 0 ? inputRows : [{ label: 'Tool', value: tool.name }],
        results: resultRows.length > 0 ? resultRows : [{ label: 'Result', value: result }],
        formula: formulaInfo.formula,
      })
    } catch (err) {
      console.error('PDF export failed:', err)
      setPdfError('PDF export failed — please try again.')
      setTimeout(() => setPdfError(null), 4000)
    }
  }, [result, tool, vals, fields, formulaInfo])

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Input card ─────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-lg font-bold text-white">{tool.name}</h2>
          <p className="text-indigo-200 text-sm mt-0.5">{tool.description}</p>
          {/* ── Trust badges ── */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {['⚡ Instant', '🔒 Private', '🆓 Free', '🚫 No signup'].map(b => (
              <span key={b} className="text-xs bg-white/20 text-white/90 px-2.5 py-0.5 rounded-full leading-relaxed">
                {b}
              </span>
            ))}
            {seoConfig?.badge && (
              <span className="text-xs bg-white/30 text-white font-semibold px-2.5 py-0.5 rounded-full leading-relaxed">
                {seoConfig.badge}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {fields.map(field => (
            <div key={field.id}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor={field.id}>
                {field.label}
                {field.unit && <span className="ml-1 text-gray-400 font-normal">({field.unit})</span>}
              </label>
              <div className="relative">
                <input
                  id={field.id}
                  type={field.type === 'text' ? 'text' : 'number'}
                  min="0"
                  step="any"
                  placeholder={field.placeholder}
                  value={vals[field.id] ?? ''}
                  onChange={e => setVals(prev => ({ ...prev, [field.id]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                />
                {field.unit && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                    {field.unit}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              onClick={calculate}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm shadow-sm hover:shadow-md"
            >
              Calculate
            </button>
            <button
              onClick={reset}
              className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition-colors"
              aria-label="Reset"
            >
              ↺ Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* ── Result card ────────────────────────────────────────── */}
      {result && !error && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">Result</p>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="text-xs px-3 py-1 rounded-lg border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              <button
                onClick={handlePDF}
                className="text-xs px-3 py-1 rounded-lg border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                📄 PDF
              </button>
            </div>
          </div>
          {pdfError && (
            <p className="text-xs text-red-600 mt-2">{pdfError}</p>
          )}
          {result.split('\n').map((line, i) => {
            if (!line.trim()) return null
            const [label, ...rest] = line.split(':')
            const value = rest.join(':').trim()
            return (
              <div key={i} className={`flex items-baseline justify-between gap-4 ${i > 0 ? 'mt-2 pt-2 border-t border-indigo-100' : ''}`}>
                <span className="text-sm text-indigo-700">{label}</span>
                <span className="text-base font-bold text-indigo-900 tabular-nums">{value}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Chart ─────────────────────────────────────────────── */}
      {result && !error && chartType && chartType !== 'none' && (() => {
        const data = parseChartData(result)
        if (data.length < 2) return null
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📊</span>
              <h3 className="text-base font-bold text-gray-900">Visual Breakdown</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => v.toLocaleString()} />
                </PieChart>
              ) : chartType === 'bar' ? (
                <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: number) => v.toLocaleString()} />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: number) => v.toLocaleString()} />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )
      })()}

      {/* ── Formula ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📐</span>
          <h3 className="text-base font-bold text-gray-900">{formulaInfo.title}</h3>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 px-5 py-4 mb-4 font-mono text-sm text-gray-800 whitespace-pre-line leading-relaxed">
          {formulaInfo.formula}
        </div>

        <div className="space-y-1.5 mb-4">
          {formulaInfo.variables.map((v, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-indigo-400 font-bold mt-0.5 flex-shrink-0">•</span>
              <span>{v}</span>
            </div>
          ))}
        </div>

        {formulaInfo.note && (
          <p className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 leading-relaxed">
            ℹ️ {formulaInfo.note}
          </p>
        )}
      </div>

      {/* ── Disclaimer ─────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="text-sm font-bold text-amber-900 mb-1">Disclaimer</p>
            <p className="text-sm text-amber-800 leading-relaxed">
              Results provided by this calculator are for <strong>informational and educational purposes only</strong>.
              They are based on the values you enter and standard formulas, and should not be considered financial,
              medical, legal, or professional advice. Always consult a qualified professional before making important
              decisions based on these results. Roughtools makes no warranties regarding the accuracy or completeness
              of these calculations for your specific situation.
            </p>
          </div>
        </div>
      </div>

      {/* ── FAQs ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">💬</span>
          <h3 className="text-base font-bold text-gray-900">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                <svg
                  className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Pro Tips ───────────────────────────────────────────── */}
      {proTips.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">💡</span>
            <h3 className="text-base font-bold text-gray-900">Pro Tips</h3>
          </div>
          <div className="space-y-3">
            {proTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 bg-indigo-50 rounded-xl border border-indigo-100">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-indigo-900 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── When to Use ─────────────────────────────────────────── */}
      {whenToUse.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">📌</span>
            <h3 className="text-base font-bold text-gray-900">When to Use This Calculator</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {whenToUse.map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
