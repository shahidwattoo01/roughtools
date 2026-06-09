// ─────────────────────────────────────────────────────────────
// CALCULATOR TOOL CONFIGS
// Centralised registry for every calculator on the platform.
// Existing calculator pages (bmi-calculator, mortgage-calculator,
// etc.) keep their own dedicated pages; new ones are served by
// the dynamic [slug] catch-all route.
// ─────────────────────────────────────────────────────────────

export type FormulaType =
  | 'loan'
  | 'mortgage'
  | 'investment'
  | 'interest'
  | 'tax'
  | 'savings'
  | 'debt'
  | 'property'
  | 'retirement'
  | 'health-index'
  | 'health-calories'
  | 'health-fitness'
  | 'pregnancy'
  | 'math-basic'
  | 'math-geometry'
  | 'math-stats'
  | 'date-time'
  | 'conversion'
  | 'engineering'
  | 'general'

export interface CalcEntry {
  slug: string
  name: string
  description: string
  icon: string
  formulaType: FormulaType
  /** true = page already has a dedicated implementation */
  existing?: boolean
}

export interface CalcSubcategory {
  id: string
  label: string
  description: string
  icon: string
  color: 'indigo' | 'green' | 'blue' | 'orange' | 'purple' | 'teal' | 'red'
  tools: CalcEntry[]
}

// ─── FINANCIAL CALCULATORS ────────────────────────────────────
const FINANCIAL: CalcEntry[] = [
  { slug: 'mortgage-calculator',          name: 'Mortgage Calculator',                icon: '🏠', description: 'Calculate monthly mortgage payments, total interest, and full amortization schedule.',    formulaType: 'mortgage',    existing: true },
  { slug: 'loan-calculator',              name: 'Loan Calculator',                    icon: '💳', description: 'Calculate monthly loan payments and total interest for any loan type.',                   formulaType: 'loan',        existing: true },
  { slug: 'compound-interest-calculator', name: 'Compound Interest Calculator',       icon: '📈', description: 'Calculate investment growth with daily, monthly, or yearly compounding.',                 formulaType: 'investment',  existing: true },
  { slug: 'roi-calculator',               name: 'ROI Calculator',                     icon: '💹', description: 'Calculate return on investment, profit, and annualized ROI for any investment.',          formulaType: 'investment',  existing: true },
  { slug: 'currency-converter',           name: 'Currency Calculator',                icon: '💱', description: 'Convert between 170+ currencies with live exchange rates.',                               formulaType: 'conversion',  existing: true },
  { slug: 'discount-calculator',          name: 'Discount Calculator',                icon: '🏷️', description: 'Calculate sale price, discount amount, and percentage savings instantly.',                formulaType: 'math-basic',  existing: true },
  { slug: 'salary-calculator',            name: 'Salary Calculator',                  icon: '💼', description: 'Convert hourly, daily, weekly, and annual salary. Includes tax deductions.',             formulaType: 'tax',         existing: true },
  { slug: 'inflation-calculator',         name: 'Inflation Calculator',               icon: '📊', description: 'Calculate the real value of money adjusted for inflation over any period.',              formulaType: 'investment',  existing: true },
  { slug: 'retirement-calculator',        name: 'Retirement Calculator',              icon: '🏖️', description: 'Estimate retirement savings and how long your money will last.',                         formulaType: 'retirement',  existing: true },
  { slug: 'tax-calculator',               name: 'Income Tax Calculator',              icon: '🧾', description: 'Estimate income tax, take-home pay, and effective tax rate by bracket.',                 formulaType: 'tax',         existing: true },

  { slug: 'auto-loan-calculator',         name: 'Auto Loan Calculator',               icon: '🚗', description: 'Calculate monthly car payments, total interest, and total cost for any auto loan.',      formulaType: 'loan' },
  { slug: 'interest-calculator',          name: 'Interest Calculator',                icon: '💰', description: 'Calculate simple or compound interest earned on any principal amount.',                  formulaType: 'interest' },
  { slug: 'payment-calculator',           name: 'Payment Calculator',                 icon: '💸', description: 'Find your monthly payment for any loan given principal, rate, and term.',                formulaType: 'loan' },
  { slug: 'amortization-calculator',      name: 'Amortization Calculator',            icon: '📋', description: 'Generate a full loan amortization schedule showing each payment breakdown.',             formulaType: 'mortgage' },
  { slug: 'investment-calculator',        name: 'Investment Calculator',              icon: '📈', description: 'Project investment returns over time with regular contributions and compounding.',        formulaType: 'investment' },
  { slug: 'finance-calculator',           name: 'Finance Calculator',                 icon: '🏦', description: 'Comprehensive finance calculator for loans, investments, and savings goals.',            formulaType: 'loan' },
  { slug: 'mortgage-payoff-calculator',   name: 'Mortgage Payoff Calculator',         icon: '🏡', description: 'Calculate how extra payments shorten your mortgage and reduce total interest.',          formulaType: 'mortgage' },
  { slug: '401k-calculator',             name: '401K Calculator',                    icon: '🏛️', description: 'Estimate your 401(k) balance at retirement with employer match and contributions.',      formulaType: 'retirement' },
  { slug: 'interest-rate-calculator',     name: 'Interest Rate Calculator',           icon: '📉', description: 'Find the interest rate needed to reach a savings or repayment goal.',                   formulaType: 'interest' },
  { slug: 'sales-tax-calculator',         name: 'Sales Tax Calculator',               icon: '🧾', description: 'Calculate sales tax amount and total price for any item and tax rate.',                  formulaType: 'tax' },
  { slug: 'house-affordability-calculator', name: 'House Affordability Calculator',   icon: '🏠', description: 'Find out how much house you can afford based on income, debts, and down payment.',      formulaType: 'property' },
  { slug: 'savings-calculator',           name: 'Savings Calculator',                 icon: '💰', description: 'Calculate how much you\'ll save over time with regular deposits and interest.',          formulaType: 'savings' },
  { slug: 'rent-calculator',             name: 'Rent Calculator',                    icon: '🏢', description: 'Calculate how much rent you can afford based on your income and expenses.',               formulaType: 'property' },
  { slug: 'marriage-tax-calculator',      name: 'Marriage Tax Calculator',            icon: '💍', description: 'Compare your tax liability before and after marriage — the marriage tax penalty.',       formulaType: 'tax' },
  { slug: 'estate-tax-calculator',        name: 'Estate Tax Calculator',              icon: '📜', description: 'Estimate federal and state estate tax liability on an inherited estate.',                formulaType: 'tax' },
  { slug: 'pension-calculator',           name: 'Pension Calculator',                 icon: '🏛️', description: 'Estimate your defined-benefit pension payment at retirement.',                           formulaType: 'retirement' },
  { slug: 'social-security-calculator',   name: 'Social Security Calculator',         icon: '🛡️', description: 'Estimate your monthly Social Security benefit based on your earnings history.',         formulaType: 'retirement' },
  { slug: 'annuity-calculator',           name: 'Annuity Calculator',                 icon: '📅', description: 'Calculate annuity payments for a given present value, rate, and period.',               formulaType: 'investment' },
  { slug: 'annuity-payout-calculator',    name: 'Annuity Payout Calculator',          icon: '💵', description: 'Find how long an annuity lasts or how much you receive per period.',                    formulaType: 'investment' },
  { slug: 'credit-card-calculator',       name: 'Credit Card Calculator',             icon: '💳', description: 'Calculate interest charges and time to pay off your credit card balance.',               formulaType: 'debt' },
  { slug: 'credit-card-payoff-calculator', name: 'Credit Cards Payoff Calculator',   icon: '💳', description: 'Find how long it takes to pay off credit cards at different monthly payments.',          formulaType: 'debt' },
  { slug: 'debt-payoff-calculator',       name: 'Debt Payoff Calculator',             icon: '💸', description: 'Calculate how long it takes to pay off debt with avalanche or snowball strategies.',    formulaType: 'debt' },
  { slug: 'debt-consolidation-calculator', name: 'Debt Consolidation Calculator',    icon: '🔄', description: 'Compare monthly payments and total interest before and after debt consolidation.',       formulaType: 'debt' },
  { slug: 'repayment-calculator',         name: 'Repayment Calculator',               icon: '📆', description: 'Calculate the monthly repayment amount and total cost for any loan.',                   formulaType: 'loan' },
  { slug: 'student-loan-calculator',      name: 'Student Loan Calculator',            icon: '🎓', description: 'Calculate student loan payments and total interest over the repayment period.',          formulaType: 'loan' },
  { slug: 'college-cost-calculator',      name: 'College Cost Calculator',            icon: '🏫', description: 'Estimate total college costs including tuition, room, board, and fees over 4 years.',   formulaType: 'savings' },
  { slug: 'simple-interest-calculator',   name: 'Simple Interest Calculator',         icon: '📐', description: 'Calculate simple interest earned on a principal over a set period.',                    formulaType: 'interest' },
  { slug: 'cd-calculator',               name: 'CD Calculator',                      icon: '🏦', description: 'Calculate the maturity value of a certificate of deposit with compounding.',            formulaType: 'savings' },
  { slug: 'bond-calculator',             name: 'Bond Calculator',                    icon: '📜', description: 'Calculate bond price, yield to maturity, and accrued interest.',                        formulaType: 'investment' },
  { slug: 'mutual-fund-calculator',       name: 'Mutual Fund Calculator',             icon: '📊', description: 'Project mutual fund returns over time with expense ratios and compounding.',            formulaType: 'investment' },
  { slug: 'roth-ira-calculator',          name: 'Roth IRA Calculator',                icon: '🏛️', description: 'Project Roth IRA balance at retirement with annual contributions and growth.',          formulaType: 'retirement' },
  { slug: 'ira-calculator',              name: 'IRA Calculator',                     icon: '💰', description: 'Estimate traditional IRA balance and tax savings at retirement.',                       formulaType: 'retirement' },
  { slug: 'rmd-calculator',              name: 'RMD Calculator',                     icon: '📋', description: 'Calculate Required Minimum Distributions from retirement accounts at age 73.',          formulaType: 'retirement' },
  { slug: 'vat-calculator',              name: 'VAT Calculator',                     icon: '🧾', description: 'Add or remove VAT from any price. Supports all VAT rates worldwide.',                   formulaType: 'tax' },
  { slug: 'cash-back-calculator',         name: 'Cash Back or Low Interest Calculator', icon: '💳', description: 'Compare cash-back rebate offers vs. low-interest financing to find the best deal.',  formulaType: 'loan' },
  { slug: 'auto-lease-calculator',        name: 'Auto Lease Calculator',              icon: '🚘', description: 'Calculate monthly car lease payments based on MSRP, residual, and money factor.',      formulaType: 'loan' },
  { slug: 'depreciation-calculator',      name: 'Depreciation Calculator',            icon: '📉', description: 'Calculate asset depreciation using straight-line, declining balance, or MACRS.',       formulaType: 'investment' },
  { slug: 'average-return-calculator',    name: 'Average Return Calculator',          icon: '📈', description: 'Calculate the average annual return on an investment over a specified period.',         formulaType: 'investment' },
  { slug: 'margin-calculator',           name: 'Margin Calculator',                  icon: '💹', description: 'Calculate gross profit margin, markup, and net margin for any product or service.',     formulaType: 'math-basic' },
  { slug: 'business-loan-calculator',     name: 'Business Loan Calculator',           icon: '🏢', description: 'Calculate monthly payments and total cost for small business loans.',                   formulaType: 'loan' },
  { slug: 'debt-to-income-calculator',    name: 'Debt-to-Income Ratio Calculator',    icon: '⚖️', description: 'Calculate your DTI ratio — a key factor lenders use in mortgage approval.',            formulaType: 'debt' },
  { slug: 'real-estate-calculator',       name: 'Real Estate Calculator',             icon: '🏘️', description: 'Calculate home purchase costs, net proceeds from sale, and ROI on property.',         formulaType: 'property' },
  { slug: 'take-home-pay-calculator',     name: 'Take-Home-Paycheck Calculator',      icon: '💵', description: 'Estimate your net pay after federal, state, and local taxes and deductions.',          formulaType: 'tax' },
  { slug: 'personal-loan-calculator',     name: 'Personal Loan Calculator',           icon: '🧾', description: 'Calculate monthly payments and total interest for personal loans.',                     formulaType: 'loan' },
  { slug: 'boat-loan-calculator',         name: 'Boat Loan Calculator',               icon: '⛵', description: 'Calculate monthly payments and total cost for boat or marine financing.',               formulaType: 'loan' },
  { slug: 'lease-calculator',            name: 'Lease Calculator',                   icon: '🔑', description: 'Calculate monthly lease payments for equipment, vehicles, or property.',               formulaType: 'loan' },
  { slug: 'refinance-calculator',         name: 'Refinance Calculator',               icon: '🔄', description: 'Calculate refinance savings, break-even point, and new monthly payment.',              formulaType: 'mortgage' },
  { slug: 'budget-calculator',           name: 'Budget Calculator',                  icon: '📊', description: 'Build a monthly budget and track income vs. expenses by category.',                    formulaType: 'savings' },
  { slug: 'rental-property-calculator',   name: 'Rental Property Calculator',         icon: '🏠', description: 'Calculate ROI, cash flow, cap rate, and NOI for rental properties.',                   formulaType: 'property' },
  { slug: 'irr-calculator',              name: 'IRR Calculator',                     icon: '📈', description: 'Calculate the internal rate of return for a series of cash flows.',                     formulaType: 'investment' },
  { slug: 'apr-calculator',              name: 'APR Calculator',                     icon: '💯', description: 'Calculate the annual percentage rate for any loan including fees.',                     formulaType: 'interest' },
  { slug: 'fha-loan-calculator',          name: 'FHA Loan Calculator',                icon: '🏦', description: 'Calculate FHA loan payments including MIP, down payment, and eligibility.',            formulaType: 'mortgage' },
  { slug: 'va-mortgage-calculator',       name: 'VA Mortgage Calculator',             icon: '🎖️', description: 'Calculate VA loan payments with the VA funding fee for eligible veterans.',            formulaType: 'mortgage' },
  { slug: 'home-equity-loan-calculator',  name: 'Home Equity Loan Calculator',        icon: '🏡', description: 'Calculate payments and interest for a home equity loan or second mortgage.',           formulaType: 'mortgage' },
  { slug: 'heloc-calculator',            name: 'HELOC Calculator',                   icon: '🏠', description: 'Calculate monthly payments during draw and repayment periods for a HELOC.',            formulaType: 'mortgage' },
  { slug: 'down-payment-calculator',      name: 'Down Payment Calculator',            icon: '💵', description: 'Calculate the down payment needed for a home and how long to save for it.',            formulaType: 'savings' },
  { slug: 'rent-vs-buy-calculator',       name: 'Rent vs. Buy Calculator',            icon: '🏘️', description: 'Compare total costs of renting vs. buying a home over any time horizon.',             formulaType: 'property' },
  { slug: 'payback-period-calculator',    name: 'Payback Period Calculator',          icon: '⏱️', description: 'Calculate how long it takes for an investment to recoup its initial cost.',            formulaType: 'investment' },
  { slug: 'present-value-calculator',     name: 'Present Value Calculator',           icon: '💲', description: 'Calculate the present value of future cash flows given a discount rate.',             formulaType: 'investment' },
  { slug: 'future-value-calculator',      name: 'Future Value Calculator',            icon: '🔮', description: 'Calculate the future value of a present sum or series of payments.',                   formulaType: 'investment' },
  { slug: 'commission-calculator',        name: 'Commission Calculator',              icon: '💰', description: 'Calculate sales commission earnings based on rate, sales amount, or tiers.',           formulaType: 'math-basic' },
  { slug: 'mortgage-calculator-uk',       name: 'Mortgage Calculator UK',             icon: '🇬🇧', description: 'UK mortgage repayment calculator with stamp duty and LTV support.',                   formulaType: 'mortgage' },
  { slug: 'canadian-mortgage-calculator', name: 'Canadian Mortgage Calculator',       icon: '🇨🇦', description: 'Canadian mortgage calculator with CMHC insurance and semi-annual compounding.',        formulaType: 'mortgage' },
  { slug: 'mortgage-amortization-calculator', name: 'Mortgage Amortization Calculator', icon: '📋', description: 'Generate a full mortgage amortization table with principal and interest breakdown.',  formulaType: 'mortgage' },
  { slug: 'percent-off-calculator',       name: 'Percent Off Calculator',             icon: '🏷️', description: 'Calculate the sale price after a percentage discount and how much you save.',          formulaType: 'math-basic' },
]

// ─── FITNESS & HEALTH CALCULATORS ────────────────────────────
const FITNESS: CalcEntry[] = [
  { slug: 'bmi-calculator',              name: 'BMI Calculator',                     icon: '⚖️', description: 'Calculate Body Mass Index with metric and imperial support. Includes healthy range.',   formulaType: 'health-index', existing: true },
  { slug: 'calorie-calculator',          name: 'Calorie Calculator',                  icon: '🥗', description: 'Calculate daily calorie needs based on age, weight, height, and activity level.',        formulaType: 'health-calories', existing: true },
  { slug: 'body-fat-calculator',         name: 'Body Fat Calculator',                 icon: '🏃', description: 'Estimate body fat percentage using the US Navy method.',                               formulaType: 'health-fitness', existing: true },
  { slug: 'due-date-calculator',         name: 'Due Date Calculator',                 icon: '👶', description: 'Calculate pregnancy due date from last menstrual period or conception date.',           formulaType: 'pregnancy',   existing: true },
  { slug: 'ovulation-calculator',        name: 'Ovulation Calculator',                icon: '📆', description: 'Calculate ovulation window and fertile days from your cycle length.',                  formulaType: 'pregnancy',   existing: true },

  { slug: 'bmr-calculator',             name: 'BMR Calculator',                     icon: '🔥', description: 'Calculate Basal Metabolic Rate — calories your body burns at rest per day.',            formulaType: 'health-calories' },
  { slug: 'macro-calculator',           name: 'Macro Calculator',                   icon: '🥩', description: 'Calculate daily protein, carbohydrate, and fat targets based on your goals.',           formulaType: 'health-calories' },
  { slug: 'ideal-weight-calculator',     name: 'Ideal Weight Calculator',            icon: '⚖️', description: 'Find your ideal body weight range based on height using multiple formulas.',            formulaType: 'health-index' },
  { slug: 'pregnancy-calculator',        name: 'Pregnancy Calculator',               icon: '🤰', description: 'Calculate pregnancy week, trimester, and key milestone dates.',                        formulaType: 'pregnancy' },
  { slug: 'pregnancy-weight-gain-calculator', name: 'Pregnancy Weight Gain Calculator', icon: '🤰', description: 'Calculate recommended weight gain during pregnancy based on pre-pregnancy BMI.',    formulaType: 'pregnancy' },
  { slug: 'pregnancy-conception-calculator', name: 'Pregnancy Conception Calculator', icon: '📅', description: 'Estimate your conception date from due date or last menstrual period.',               formulaType: 'pregnancy' },
  { slug: 'pace-calculator',            name: 'Pace Calculator',                    icon: '🏃', description: 'Calculate running pace, finish time, or distance for any race or training run.',       formulaType: 'health-fitness' },
  { slug: 'army-body-fat-calculator',    name: 'Army Body Fat Calculator',           icon: '🪖', description: 'Calculate body fat % using the U.S. Army tape-measurement method.',                   formulaType: 'health-fitness' },
  { slug: 'carbohydrate-calculator',     name: 'Carbohydrate Calculator',            icon: '🍞', description: 'Calculate daily carbohydrate intake based on calorie goals and activity level.',       formulaType: 'health-calories' },
  { slug: 'lean-body-mass-calculator',   name: 'Lean Body Mass Calculator',          icon: '💪', description: 'Estimate lean body mass (muscle + bone + organs) using height and weight.',            formulaType: 'health-index' },
  { slug: 'healthy-weight-calculator',   name: 'Healthy Weight Calculator',          icon: '🍎', description: 'Calculate the healthy weight range for your height and body frame.',                   formulaType: 'health-index' },
  { slug: 'calories-burned-calculator',  name: 'Calories Burned Calculator',         icon: '🔥', description: 'Estimate calories burned during any physical activity or exercise.',                  formulaType: 'health-calories' },
  { slug: 'one-rep-max-calculator',      name: 'One Rep Max Calculator',             icon: '🏋️', description: 'Estimate your 1RM for any lift from submaximal reps and weight lifted.',              formulaType: 'health-fitness' },
  { slug: 'target-heart-rate-calculator', name: 'Target Heart Rate Calculator',     icon: '❤️', description: 'Calculate target heart rate zones for cardio exercise based on age and fitness.',      formulaType: 'health-fitness' },
  { slug: 'protein-calculator',          name: 'Protein Calculator',                 icon: '🥩', description: 'Calculate daily protein needs based on weight, activity level, and fitness goals.',    formulaType: 'health-calories' },
  { slug: 'fat-intake-calculator',       name: 'Fat Intake Calculator',              icon: '🥑', description: 'Calculate daily fat intake targets for your calorie goals and dietary preferences.',   formulaType: 'health-calories' },
  { slug: 'tdee-calculator',            name: 'TDEE Calculator',                    icon: '⚡', description: 'Calculate Total Daily Energy Expenditure — your total calorie burn per day.',          formulaType: 'health-calories' },
  { slug: 'conception-calculator',       name: 'Conception Calculator',              icon: '📅', description: 'Estimate your most likely conception date based on your due date or LMP.',             formulaType: 'pregnancy' },
  { slug: 'period-calculator',           name: 'Period Calculator',                  icon: '📆', description: 'Predict your next period dates and cycle phases over the coming months.',              formulaType: 'pregnancy' },
  { slug: 'gfr-calculator',             name: 'GFR Calculator',                     icon: '🩺', description: 'Estimate glomerular filtration rate (eGFR) to assess kidney function.',                formulaType: 'health-index' },
  { slug: 'body-type-calculator',        name: 'Body Type Calculator',               icon: '📏', description: 'Determine your body type (ectomorph, mesomorph, endomorph) based on measurements.',   formulaType: 'health-index' },
  { slug: 'body-surface-area-calculator', name: 'Body Surface Area Calculator',     icon: '📐', description: 'Calculate body surface area in m² used for medical dosing and burn area estimation.',  formulaType: 'health-index' },
  { slug: 'bac-calculator',             name: 'BAC Calculator',                     icon: '🍺', description: 'Estimate blood alcohol content based on drinks consumed, weight, and time.',           formulaType: 'health-index' },
  { slug: 'anorexic-bmi-calculator',     name: 'Anorexic BMI Calculator',            icon: '⚖️', description: 'Understand underweight BMI categories and healthy weight restoration goals.',         formulaType: 'health-index' },
  { slug: 'weight-watcher-points-calculator', name: 'Weight Watcher Points Calculator', icon: '🍽️', description: 'Calculate Weight Watchers SmartPoints for any food based on nutrition info.',     formulaType: 'health-calories' },
  { slug: 'overweight-calculator',       name: 'Overweight Calculator',              icon: '⚖️', description: 'Check if you are overweight using BMI, waist circumference, and body fat %.',         formulaType: 'health-index' },
]

// ─── MATH CALCULATORS ─────────────────────────────────────────
const MATH: CalcEntry[] = [
  { slug: 'scientific-calculator',       name: 'Scientific Calculator',              icon: '🔢', description: 'Full-featured scientific calculator with trigonometry, logarithms, and exponents.',     formulaType: 'math-basic',  existing: true },
  { slug: 'percentage-calculator',       name: 'Percentage Calculator',              icon: '%',  description: '4 modes: % of a number, % change, % difference, and reverse percentage.',              formulaType: 'math-basic',  existing: true },

  { slug: 'fraction-calculator',         name: 'Fraction Calculator',                icon: '½',  description: 'Add, subtract, multiply, and divide fractions. Simplify to lowest terms.',             formulaType: 'math-basic',  existing: true },
  { slug: 'triangle-calculator',         name: 'Triangle Calculator',                icon: '📐', description: 'Solve any triangle given sides and angles using the law of sines and cosines.',         formulaType: 'math-geometry', existing: true },
  { slug: 'volume-calculator',           name: 'Volume Calculator',                  icon: '📦', description: 'Calculate volume of sphere, cube, cylinder, cone, and other 3D shapes.',               formulaType: 'math-geometry', existing: true },
  { slug: 'standard-deviation-calculator', name: 'Standard Deviation Calculator',   icon: '📊', description: 'Calculate population and sample standard deviation and variance from a data set.',     formulaType: 'math-stats',  existing: true },
  { slug: 'random-number-generator',     name: 'Random Number Generator',            icon: '🎲', description: 'Generate random integers or decimals within any range you specify.',                   formulaType: 'math-basic',  existing: true },
  { slug: 'number-sequence-calculator',  name: 'Number Sequence Calculator',         icon: '🔢', description: 'Identify and continue arithmetic and geometric sequences.',                            formulaType: 'math-basic',  existing: true },
  { slug: 'percent-error-calculator',    name: 'Percent Error Calculator',           icon: '📉', description: 'Calculate the percent error between an experimental and theoretical value.',           formulaType: 'math-basic',  existing: true },
  { slug: 'exponent-calculator',         name: 'Exponent Calculator',                icon: '⬆️', description: 'Calculate base raised to any power including fractional and negative exponents.',      formulaType: 'math-basic',  existing: true },
  { slug: 'binary-calculator',           name: 'Binary Calculator',                  icon: '01', description: 'Perform binary arithmetic and convert between binary, decimal, hex, and octal.',      formulaType: 'math-basic',  existing: true },
  { slug: 'hex-calculator',             name: 'Hex Calculator',                     icon: '🔣', description: 'Add, subtract, multiply hexadecimal numbers and convert to decimal and binary.',       formulaType: 'math-basic',  existing: true },
  { slug: 'half-life-calculator',        name: 'Half-Life Calculator',               icon: '☢️', description: 'Calculate radioactive decay and the remaining quantity after any number of half-lives.', formulaType: 'math-basic', existing: true },
  { slug: 'quadratic-formula-calculator', name: 'Quadratic Formula Calculator',     icon: '📐', description: 'Solve quadratic equations ax² + bx + c = 0 and find real or complex roots.',          formulaType: 'math-basic',  existing: true },
  { slug: 'slope-calculator',           name: 'Slope Calculator',                   icon: '📏', description: 'Calculate slope, y-intercept, and equation of a line from two points.',               formulaType: 'math-geometry', existing: true },
  { slug: 'log-calculator',             name: 'Log Calculator',                     icon: 'ln', description: 'Calculate logarithms in any base — log₂, log₁₀, ln, and custom bases.',              formulaType: 'math-basic',  existing: true },
  { slug: 'area-calculator',            name: 'Area Calculator',                    icon: '📐', description: 'Calculate area of rectangle, circle, triangle, and other 2D shapes.',                 formulaType: 'math-geometry', existing: true },
  { slug: 'sample-size-calculator',      name: 'Sample Size Calculator',             icon: '📊', description: 'Determine the minimum sample size for a statistically valid survey or experiment.',    formulaType: 'math-stats',  existing: true },
  { slug: 'probability-calculator',      name: 'Probability Calculator',             icon: '🎯', description: 'Calculate event probability, conditional probability, and Bayes\' theorem.',           formulaType: 'math-stats',  existing: true },
  { slug: 'statistics-calculator',       name: 'Statistics Calculator',              icon: '📈', description: 'Calculate mean, median, mode, range, variance, and standard deviation.',              formulaType: 'math-stats',  existing: true },
  { slug: 'mean-median-mode-calculator', name: 'Mean, Median, Mode Calculator',     icon: '📊', description: 'Find mean, median, mode, and range from any list of numbers.',                        formulaType: 'math-stats',  existing: true },
  { slug: 'permutation-combination-calculator', name: 'Permutation and Combination Calculator', icon: '🔢', description: 'Calculate nPr and nCr — the number of permutations and combinations.',   formulaType: 'math-stats',  existing: true },
  { slug: 'z-score-calculator',          name: 'Z-score Calculator',                 icon: '📉', description: 'Calculate z-score, percentile, and area under the normal distribution curve.',        formulaType: 'math-stats',  existing: true },
  { slug: 'confidence-interval-calculator', name: 'Confidence Interval Calculator', icon: '📊', description: 'Calculate 95% or 99% confidence interval for a population proportion or mean.',      formulaType: 'math-stats',  existing: true },
  { slug: 'ratio-calculator',           name: 'Ratio Calculator',                   icon: '⚖️', description: 'Simplify ratios, find equivalent ratios, and solve ratio word problems.',             formulaType: 'math-basic',  existing: true },
  { slug: 'distance-calculator',         name: 'Distance Calculator',                icon: '📍', description: 'Calculate distance between two points using coordinates or the distance formula.',    formulaType: 'math-geometry' },
  { slug: 'circle-calculator',           name: 'Circle Calculator',                  icon: '⭕', description: 'Calculate area, circumference, diameter, and radius of a circle.',                   formulaType: 'math-geometry' },
  { slug: 'surface-area-calculator',     name: 'Surface Area Calculator',            icon: '📦', description: 'Calculate surface area of cube, sphere, cylinder, cone, and other 3D shapes.',       formulaType: 'math-geometry' },
  { slug: 'pythagorean-theorem-calculator', name: 'Pythagorean Theorem Calculator', icon: '📐', description: 'Find the missing side of a right triangle using the Pythagorean theorem.',            formulaType: 'math-geometry' },
  { slug: 'right-triangle-calculator',   name: 'Right Triangle Calculator',          icon: '📐', description: 'Solve right triangles — find all sides and angles from any two known values.',       formulaType: 'math-geometry' },
  { slug: 'root-calculator',            name: 'Root Calculator',                    icon: '√',  description: 'Calculate square root, cube root, and nth root of any number.',                      formulaType: 'math-basic' },
  { slug: 'lcm-calculator',             name: 'Least Common Multiple Calculator',   icon: '🔢', description: 'Find the LCM (Least Common Multiple) of two or more integers.',                      formulaType: 'math-basic' },
  { slug: 'gcf-calculator',             name: 'Greatest Common Factor Calculator',  icon: '🔢', description: 'Find the GCF (Greatest Common Factor) of two or more integers.',                     formulaType: 'math-basic' },
  { slug: 'factor-calculator',           name: 'Factor Calculator',                  icon: '🔢', description: 'Find all factors and prime factors of any integer.',                                 formulaType: 'math-basic' },
  { slug: 'rounding-calculator',         name: 'Rounding Calculator',                icon: '↕️', description: 'Round numbers to any decimal place — nearest whole, tenth, hundredth, etc.',        formulaType: 'math-basic' },
  { slug: 'matrix-calculator',           name: 'Matrix Calculator',                  icon: '🔲', description: 'Add, subtract, multiply matrices, and find determinants and inverses.',              formulaType: 'math-basic' },
  { slug: 'scientific-notation-calculator', name: 'Scientific Notation Calculator', icon: '🔬', description: 'Convert numbers to and from scientific notation and perform operations.',            formulaType: 'math-basic' },
  { slug: 'big-number-calculator',       name: 'Big Number Calculator',              icon: '♾️', description: 'Perform arithmetic on very large numbers beyond standard calculator precision.',      formulaType: 'math-basic' },
  { slug: 'prime-factorization-calculator', name: 'Prime Factorization Calculator', icon: '🔢', description: 'Find the prime factorization of any integer using factor trees.',                    formulaType: 'math-basic' },
  { slug: 'common-factor-calculator',    name: 'Common Factor Calculator',           icon: '🔢', description: 'List all common factors shared between two or more numbers.',                        formulaType: 'math-basic' },
  { slug: 'basic-calculator',           name: 'Basic Calculator',                   icon: '🧮', description: 'Simple four-function calculator for quick arithmetic — add, subtract, multiply, divide.', formulaType: 'math-basic' },
  { slug: 'long-division-calculator',    name: 'Long Division Calculator',           icon: '➗', description: 'Perform long division step-by-step with quotient, remainder, and working shown.',    formulaType: 'math-basic' },
  { slug: 'average-calculator',          name: 'Average Calculator',                 icon: '📊', description: 'Calculate the arithmetic mean from a list of numbers.',                             formulaType: 'math-stats' },
  { slug: 'p-value-calculator',          name: 'P-value Calculator',                 icon: '📉', description: 'Calculate the p-value from t-test, chi-square, z-score, or F-statistic.',           formulaType: 'math-stats' },
]

// ─── OTHER CALCULATORS ────────────────────────────────────────
const OTHER: CalcEntry[] = [
  { slug: 'age-calculator',             name: 'Age Calculator',                     icon: '🎂', description: 'Calculate exact age in years, months, days, and hours. Birthday countdown included.',  formulaType: 'date-time', existing: true },
  { slug: 'date-difference-calculator', name: 'Days Between Dates',                 icon: '📅', description: 'Calculate days, weeks, months, and years between two dates. Business days option.',    formulaType: 'date-time', existing: true },
  { slug: 'tip-calculator',             name: 'Tip Calculator',                     icon: '🍽️', description: 'Calculate tip amount and split the bill evenly among multiple people.',                formulaType: 'math-basic', existing: true },
  { slug: 'gpa-calculator',             name: 'GPA Calculator',                     icon: '🎓', description: 'Calculate GPA for semester or cumulative across all courses.',                        formulaType: 'math-basic', existing: true },

  { slug: 'date-calculator',            name: 'Date Calculator',                    icon: '📅', description: 'Add or subtract days, weeks, months, or years from any date.',                       formulaType: 'date-time' },
  { slug: 'time-calculator',            name: 'Time Calculator',                    icon: '⏰', description: 'Add and subtract hours, minutes, and seconds. Convert between time formats.',         formulaType: 'date-time' },
  { slug: 'hours-calculator',           name: 'Hours Calculator',                   icon: '⏱️', description: 'Calculate total hours and minutes between start and end times for any shift.',       formulaType: 'date-time' },
  { slug: 'grade-calculator',           name: 'Grade Calculator',                   icon: '🎓', description: 'Calculate your weighted course grade or the score needed on a final exam.',          formulaType: 'math-basic' },
  { slug: 'height-calculator',          name: 'Height Calculator',                  icon: '📏', description: 'Predict a child\'s adult height based on parent heights using multiple methods.',     formulaType: 'health-index' },
  { slug: 'concrete-calculator',        name: 'Concrete Calculator',                icon: '🧱', description: 'Calculate cubic yards of concrete needed for slabs, footings, and columns.',         formulaType: 'engineering' },
  { slug: 'ip-subnet-calculator',       name: 'IP Subnet Calculator',               icon: '🌐', description: 'Calculate subnet mask, network address, broadcast address, and host range.',         formulaType: 'engineering' },
  { slug: 'bra-size-calculator',        name: 'Bra Size Calculator',                icon: '👙', description: 'Find your correct bra size in US, UK, EU, and other international sizing systems.',  formulaType: 'conversion' },
  { slug: 'password-generator',         name: 'Password Generator',                 icon: '🔐', description: 'Generate strong, random passwords with custom length and character sets.',           formulaType: 'general' },
  { slug: 'dice-roller',               name: 'Dice Roller',                        icon: '🎲', description: 'Roll any number of dice with any number of sides — d4, d6, d8, d10, d12, d20.',      formulaType: 'general' },
  { slug: 'conversion-calculator',      name: 'Conversion Calculator',              icon: '🔄', description: 'Convert between common units of length, weight, volume, temperature, and more.',     formulaType: 'conversion' },
  { slug: 'fuel-cost-calculator',       name: 'Fuel Cost Calculator',               icon: '⛽', description: 'Calculate trip fuel cost based on distance, fuel economy, and local gas prices.',    formulaType: 'engineering' },
  { slug: 'voltage-drop-calculator',    name: 'Voltage Drop Calculator',            icon: '⚡', description: 'Calculate voltage drop in electrical wire runs for any circuit length and load.',     formulaType: 'engineering' },
  { slug: 'btu-calculator',            name: 'BTU Calculator',                     icon: '🌡️', description: 'Calculate BTUs needed to heat or cool a room based on size and climate.',            formulaType: 'engineering' },
  { slug: 'square-footage-calculator',  name: 'Square Footage Calculator',          icon: '📐', description: 'Calculate total square footage for rooms, floors, and irregularly shaped areas.',    formulaType: 'math-geometry' },
  { slug: 'time-card-calculator',       name: 'Time Card Calculator',               icon: '🕐', description: 'Calculate total work hours and pay from daily clock-in and clock-out times.',       formulaType: 'date-time' },
  { slug: 'time-zone-calculator',       name: 'Time Zone Calculator',               icon: '🌍', description: 'Convert times between any two time zones instantly with DST support.',               formulaType: 'date-time' },
  { slug: 'love-calculator',           name: 'Love Calculator',                    icon: '❤️', description: 'Calculate love compatibility percentage between two names — just for fun!',           formulaType: 'general' },
  { slug: 'gdp-calculator',            name: 'GDP Calculator',                     icon: '🏦', description: 'Calculate GDP using the expenditure, income, or production approach.',               formulaType: 'math-basic' },
  { slug: 'gas-mileage-calculator',     name: 'Gas Mileage Calculator',             icon: '🚗', description: 'Calculate your car\'s MPG, litres per 100 km, and total fuel cost per trip.',        formulaType: 'engineering' },
  { slug: 'horsepower-calculator',      name: 'Horsepower Calculator',              icon: '🏎️', description: 'Convert between horsepower units: HP, kW, PS, and metric horsepower.',              formulaType: 'conversion' },
  { slug: 'engine-horsepower-calculator', name: 'Engine Horsepower Calculator',    icon: '🔧', description: 'Estimate engine horsepower from torque and RPM using the HP formula.',              formulaType: 'engineering' },
  { slug: 'stair-calculator',           name: 'Stair Calculator',                   icon: '🪜', description: 'Calculate riser height, tread depth, and number of steps for any staircase.',       formulaType: 'engineering' },
  { slug: 'resistor-calculator',        name: 'Resistor Calculator',                icon: '⚡', description: 'Calculate resistor value from color bands or find series/parallel combinations.',    formulaType: 'engineering' },
  { slug: 'ohms-law-calculator',        name: 'Ohms Law Calculator',                icon: '🔌', description: 'Calculate voltage, current, resistance, or power using Ohm\'s Law.',                formulaType: 'engineering' },
  { slug: 'electricity-calculator',     name: 'Electricity Calculator',             icon: '💡', description: 'Calculate electricity costs, kilowatt-hours, and energy consumption for devices.',   formulaType: 'engineering' },
  { slug: 'shoe-size-calculator',       name: 'Shoe Size Conversion',               icon: '👟', description: 'Convert shoe sizes between US, UK, EU, CM, and other international standards.',      formulaType: 'conversion' },
  { slug: 'mileage-calculator',         name: 'Mileage Calculator',                 icon: '🗺️', description: 'Calculate mileage reimbursement, trip distance, or miles driven on a route.',       formulaType: 'conversion' },
  { slug: 'density-calculator',         name: 'Density Calculator',                 icon: '📦', description: 'Calculate density, mass, or volume when you know any two of the three.',            formulaType: 'math-basic' },
  { slug: 'mass-calculator',            name: 'Mass Calculator',                    icon: '⚖️', description: 'Convert mass between kilograms, pounds, ounces, grams, and other units.',           formulaType: 'conversion' },
  { slug: 'weight-calculator',          name: 'Weight Calculator',                  icon: '⚖️', description: 'Convert weight units between lb, kg, stone, oz, and metric tons.',                  formulaType: 'conversion' },
  { slug: 'speed-calculator',           name: 'Speed Calculator',                   icon: '🏃', description: 'Calculate speed, distance, or time — and convert between MPH, KPH, and m/s.',      formulaType: 'conversion' },
  { slug: 'molarity-calculator',        name: 'Molarity Calculator',                icon: '🧪', description: 'Calculate molarity, moles, volume, or molecular weight for chemistry solutions.',   formulaType: 'engineering' },
  { slug: 'molecular-weight-calculator', name: 'Molecular Weight Calculator',       icon: '⚗️', description: 'Calculate molecular weight (molar mass) of any chemical formula.',                  formulaType: 'engineering' },
  { slug: 'roman-numeral-calculator',   name: 'Roman Numeral Converter',            icon: '🏛️', description: 'Convert any integer to Roman numerals or decode Roman numerals to decimal.',        formulaType: 'conversion' },
  { slug: 'golf-handicap-calculator',   name: 'Golf Handicap Calculator',           icon: '⛳', description: 'Calculate your USGA golf handicap index from recent score history.',                  formulaType: 'general' },
  { slug: 'sleep-calculator',           name: 'Sleep Calculator',                   icon: '😴', description: 'Find the best bedtimes and wake times to complete full sleep cycles.',               formulaType: 'date-time' },
  { slug: 'tire-size-calculator',       name: 'Tire Size Calculator',               icon: '🛞', description: 'Compare tire sizes and calculate speedometer difference and plus-sizing impact.',    formulaType: 'engineering' },
  { slug: 'roofing-calculator',         name: 'Roofing Calculator',                 icon: '🏠', description: 'Estimate roofing materials — shingles, underlayment, and ridge cap — for any roof.',  formulaType: 'engineering' },
  { slug: 'tile-calculator',            name: 'Tile Calculator',                    icon: '🏗️', description: 'Calculate how many tiles you need for any floor or wall area including waste factor.', formulaType: 'engineering' },
  { slug: 'mulch-calculator',           name: 'Mulch Calculator',                   icon: '🌿', description: 'Calculate cubic yards or bags of mulch needed for garden beds at any depth.',         formulaType: 'engineering' },
  { slug: 'gravel-calculator',          name: 'Gravel Calculator',                  icon: '🪨', description: 'Calculate tons or cubic yards of gravel needed for driveways, paths, and beds.',     formulaType: 'engineering' },
  { slug: 'wind-chill-calculator',      name: 'Wind Chill Calculator',              icon: '🌬️', description: 'Calculate the real-feel temperature based on air temperature and wind speed.',      formulaType: 'engineering' },
  { slug: 'heat-index-calculator',      name: 'Heat Index Calculator',              icon: '☀️', description: 'Calculate apparent temperature from air temperature and relative humidity.',         formulaType: 'engineering' },
  { slug: 'dew-point-calculator',       name: 'Dew Point Calculator',               icon: '💧', description: 'Calculate dew point, relative humidity, and absolute humidity from temperature.',   formulaType: 'engineering' },
  { slug: 'bandwidth-calculator',       name: 'Bandwidth Calculator',               icon: '📡', description: 'Calculate file transfer time, bandwidth needs, or network throughput.',              formulaType: 'engineering' },
  { slug: 'time-duration-calculator',   name: 'Time Duration Calculator',           icon: '⏱️', description: 'Calculate the exact duration between two times in hours, minutes, and seconds.',    formulaType: 'date-time' },
  { slug: 'day-counter',               name: 'Day Counter',                        icon: '📅', description: 'Count the number of days until or since any date — countdown or up.',               formulaType: 'date-time' },
  { slug: 'day-of-week-calculator',     name: 'Day of the Week Calculator',         icon: '🗓️', description: 'Find what day of the week any date falls on — past, present, or future.',          formulaType: 'date-time' },
]

// ─── FLAT LOOKUP MAP ─────────────────────────────────────────
export const CALC_TOOL_CONFIGS: Record<string, CalcEntry> = {}
;[...FINANCIAL, ...FITNESS, ...MATH, ...OTHER].forEach(t => {
  CALC_TOOL_CONFIGS[t.slug] = t
})

// ─── SUBCATEGORIES ────────────────────────────────────────────
export const CALC_SUBCATEGORIES: CalcSubcategory[] = [
  {
    id: 'financial',
    label: 'Financial Calculators',
    description: 'Mortgage, loans, investments, tax, retirement, and personal finance.',
    icon: '💰',
    color: 'indigo',
    tools: FINANCIAL,
  },
  {
    id: 'fitness',
    label: 'Fitness & Health Calculators',
    description: 'BMI, calories, body fat, pregnancy, nutrition, and fitness metrics.',
    icon: '🏃',
    color: 'green',
    tools: FITNESS,
  },
  {
    id: 'math',
    label: 'Math Calculators',
    description: 'Algebra, geometry, statistics, fractions, and advanced mathematics.',
    icon: '📐',
    color: 'blue',
    tools: MATH,
  },
  {
    id: 'other',
    label: 'Other Calculators',
    description: 'Date & time, engineering, unit conversion, and specialty calculators.',
    icon: '🔧',
    color: 'orange',
    tools: OTHER,
  },
]

// Count helper
export const TOTAL_CALC_COUNT = [...FINANCIAL, ...FITNESS, ...MATH, ...OTHER].length
