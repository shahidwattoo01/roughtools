'use client'
import { useState } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

const HOUSEHOLD_SIZES = ['1 person', '2 people', '3 people', '4 people', '5+ people']
const AREAS = ['Urban (dense city)', 'Suburban', 'Rural / Small town']

interface WasteResult {
  weeklyKg: number
  annualKg: number
  landfillKg: number
  recycledKg: number
  compostedKg: number
  recyclingRate: number
  co2FromWaste: number
  grade: string
  gradeColor: string
  breakdown: { label: string; kg: number; color: string; icon: string }[]
  actions: { category: string; action: string; impact: string; difficulty: 'Easy' | 'Medium' | 'Hard' }[]
}

function calcWaste(
  householdSize: string,
  area: string,
  // current habits (0–10 scale)
  recyclingHabit: number,
  compostHabit: number,
  foodWasteLevel: number, // 0=very low, 10=very high
  plasticHabit: number,   // 0=avoid, 10=lots of single-use
  fastFashion: number,    // 0=never, 10=weekly
): WasteResult {
  // Base kg/week by household size
  const sizeMap: Record<string, number> = {
    '1 person': 7, '2 people': 13, '3 people': 18, '4 people': 22, '5+ people': 27,
  }
  const baseKgWeek = sizeMap[householdSize] ?? 13

  // Adjust for food waste
  const foodWasteFactor = 1 + (foodWasteLevel / 10) * 0.4  // up to 40% more
  const weeklyKg = Math.round(baseKgWeek * foodWasteFactor * 10) / 10

  const annualKg = Math.round(weeklyKg * 52)

  // Recycling and compost rates
  const recyclingRate = Math.round(recyclingHabit * 5.5)  // 0–55%
  const compostRate   = Math.round(compostHabit * 2.5)    // 0–25%
  const diversionRate = Math.min(recyclingRate + compostRate, 80)

  const recycledKg  = Math.round(annualKg * recyclingRate / 100)
  const compostedKg = Math.round(annualKg * compostRate / 100)
  const landfillKg  = annualKg - recycledKg - compostedKg

  // CO₂ from landfill: ~0.58 kg CO₂e/kg waste
  const co2FromWaste = Math.round((landfillKg * 0.58) / 10) / 100

  // Breakdown
  const breakdown = [
    { label: 'Food waste', kg: Math.round(annualKg * 0.40 * foodWasteFactor), color: 'bg-green-400', icon: '🍎' },
    { label: 'Recyclables', kg: Math.round(annualKg * 0.30), color: 'bg-blue-400', icon: '♻️' },
    { label: 'Plastic packaging', kg: Math.round(annualKg * (0.10 + plasticHabit * 0.015)), color: 'bg-orange-400', icon: '🧴' },
    { label: 'Clothing & textiles', kg: Math.round(annualKg * (0.04 + fastFashion * 0.008)), color: 'bg-purple-400', icon: '👕' },
    { label: 'Paper & cardboard', kg: Math.round(annualKg * 0.12), color: 'bg-amber-400', icon: '📦' },
    { label: 'Other', kg: Math.round(annualKg * 0.04), color: 'bg-gray-400', icon: '🗑️' },
  ]

  // Grade
  let grade: string, gradeColor: string
  if (diversionRate >= 70) { grade = 'A'; gradeColor = 'text-green-700 bg-green-50 border-green-200' }
  else if (diversionRate >= 55) { grade = 'B'; gradeColor = 'text-blue-700 bg-blue-50 border-blue-200' }
  else if (diversionRate >= 40) { grade = 'C'; gradeColor = 'text-amber-700 bg-amber-50 border-amber-200' }
  else if (diversionRate >= 25) { grade = 'D'; gradeColor = 'text-orange-700 bg-orange-50 border-orange-200' }
  else { grade = 'E'; gradeColor = 'text-red-700 bg-red-50 border-red-200' }

  // Actions
  const actions: WasteResult['actions'] = []
  if (foodWasteLevel > 4) {
    actions.push({ category: '🍎 Food', action: 'Plan weekly meals to avoid overbuying', impact: 'Reduce food waste by 30–50%', difficulty: 'Easy' })
    actions.push({ category: '🍎 Food', action: 'Use a compost bin or food caddy', impact: 'Divert ~40% of waste from landfill', difficulty: 'Easy' })
  }
  if (plasticHabit > 4) {
    actions.push({ category: '🧴 Plastic', action: 'Switch to reusable bags, bottles & containers', impact: 'Reduce plastic waste by 60%', difficulty: 'Easy' })
    actions.push({ category: '🧴 Plastic', action: 'Choose products with minimal packaging', impact: 'Cut plastic by 20–30%', difficulty: 'Medium' })
  }
  if (recyclingHabit < 6) {
    actions.push({ category: '♻️ Recycling', action: 'Learn which plastics are accepted locally', impact: 'Increase recycling rate by 15%', difficulty: 'Easy' })
    actions.push({ category: '♻️ Recycling', action: 'Rinse containers before recycling', impact: 'Prevent contamination rejections', difficulty: 'Easy' })
  }
  if (fastFashion > 4) {
    actions.push({ category: '👕 Clothing', action: 'Buy second-hand / use swap apps', impact: 'Save ~15 kg CO₂ per garment', difficulty: 'Easy' })
    actions.push({ category: '👕 Clothing', action: 'Repair clothes instead of replacing', impact: 'Extend garment life by 2–3×', difficulty: 'Medium' })
  }
  actions.push({ category: '📦 Packaging', action: 'Cancel junk mail and unnecessary deliveries', impact: 'Reduce paper waste by 25%', difficulty: 'Easy' })
  actions.push({ category: '🔋 E-waste', action: 'Take electronics to a certified recycler', impact: 'Keep toxic materials out of landfill', difficulty: 'Medium' })

  return {
    weeklyKg,
    annualKg,
    landfillKg,
    recycledKg,
    compostedKg,
    recyclingRate,
    co2FromWaste,
    grade,
    gradeColor,
    breakdown: breakdown.sort((a, b) => b.kg - a.kg),
    actions: actions.slice(0, 7),
  }
}

const difficultyColor = { Easy: 'bg-green-100 text-green-700', Medium: 'bg-amber-100 text-amber-700', Hard: 'bg-red-100 text-red-700' }

function Slider({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-semibold text-gray-700">{label}</label>
        <span className="text-xs text-gray-400">{hint}</span>
      </div>
      <input type="range" min={0} max={10} value={value} onChange={e => onChange(parseInt(e.target.value))}
        className="w-full accent-emerald-600 h-1.5 rounded-full" />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>Low</span><span>Medium</span><span>High</span>
      </div>
    </div>
  )
}

export default function WasteReductionClient() {
  const [size,       setSize]       = useState(HOUSEHOLD_SIZES[1])
  const [area,       setArea]       = useState(AREAS[1])
  const [recycling,  setRecycling]  = useState(5)
  const [compost,    setCompost]    = useState(3)
  const [foodWaste,  setFoodWaste]  = useState(5)
  const [plastic,    setPlastic]    = useState(5)
  const [fashion,    setFashion]    = useState(4)
  const [result,     setResult]     = useState<WasteResult | null>(null)

  const calculate = () => setResult(calcWaste(size, area, recycling, compost, foodWaste, plastic, fashion))

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
          <h2 className="text-base font-bold text-white">Your Household Habits</h2>
          <p className="text-emerald-100 text-xs mt-0.5">Rate your current habits to get a personalised plan</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Household Size</label>
              <select value={size} onChange={e => setSize(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:border-emerald-400 outline-none transition-all">
                {HOUSEHOLD_SIZES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location Type</label>
              <select value={area} onChange={e => setArea(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:border-emerald-400 outline-none transition-all">
                {AREAS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <Slider label="How much food do you waste?" value={foodWaste} onChange={setFoodWaste} hint={`${foodWaste}/10`} />
          <Slider label="How much single-use plastic do you use?" value={plastic} onChange={setPlastic} hint={`${plastic}/10`} />
          <Slider label="How active is your recycling?" value={recycling} onChange={setRecycling} hint={`${recycling}/10`} />
          <Slider label="Do you compost food scraps?" value={compost} onChange={setCompost} hint={`${compost}/10`} />
          <Slider label="Fast fashion purchases" value={fashion} onChange={setFashion} hint={`${fashion}/10`} />

          <button onClick={calculate}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm">
            ♻️ Build My Waste Plan
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-gray-900">Waste Reduction Plan</h2>
          {result && (
            <button
              onClick={() => exportCalcPDF({
                toolName: 'Waste Reduction Planner',
                inputs: [
                  { label: 'Household Size', value: size }, { label: 'Location Type', value: area },
                  { label: 'Food Waste Level', value: `${foodWaste}/10` }, { label: 'Single-Use Plastic', value: `${plastic}/10` },
                  { label: 'Recycling Activity', value: `${recycling}/10` }, { label: 'Composting', value: `${compost}/10` },
                  { label: 'Fast Fashion Purchases', value: `${fashion}/10` },
                ],
                results: [
                  { label: 'Waste Grade', value: result.grade, highlight: true },
                  { label: 'Annual Waste', value: result.annualKg.toLocaleString() + ' kg/year' },
                  { label: 'Weekly Waste', value: result.weeklyKg + ' kg/week' },
                  { label: 'CO2e to Landfill', value: result.co2FromWaste + ' tonnes' },
                  { label: 'To Landfill', value: result.landfillKg.toLocaleString() + ' kg' },
                  { label: 'Recycled', value: result.recycledKg.toLocaleString() + ' kg' },
                  { label: 'Composted', value: result.compostedKg.toLocaleString() + ' kg' },
                ],
                tableHeaders: ['Category', 'Action', 'Impact', 'Difficulty'],
                tableRows: result.actions.map(a => ({
                  Category: a.category, Action: a.action, Impact: a.impact, Difficulty: a.difficulty,
                })),
              })}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex-shrink-0"
            >
              Export PDF
            </button>
          )}
        </div>

        {result ? (
          <div className="flex-1 p-6 space-y-5 overflow-y-auto">
            {/* Grade */}
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-extrabold ${result.gradeColor}`}>
                {result.grade}
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">{result.annualKg.toLocaleString()} <span className="text-sm font-medium text-gray-500">kg/year</span></div>
                <div className="text-xs text-gray-500">~{result.weeklyKg} kg/week · {result.co2FromWaste} tonnes CO₂e to landfill</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'To Landfill', kg: result.landfillKg, color: 'bg-red-50 border-red-200', icon: '🗑️' },
                { label: 'Recycled', kg: result.recycledKg, color: 'bg-blue-50 border-blue-200', icon: '♻️' },
                { label: 'Composted', kg: result.compostedKg, color: 'bg-green-50 border-green-200', icon: '🌱' },
              ].map(s => (
                <div key={s.label} className={`rounded-xl border p-2 text-center ${s.color}`}>
                  <div className="text-lg">{s.icon}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  <div className="text-sm font-bold text-gray-800">{s.kg.toLocaleString()} kg</div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">Waste by type (annual)</div>
              <div className="space-y-1.5">
                {result.breakdown.filter(b => b.kg > 0).map(b => (
                  <div key={b.label} className="flex items-center gap-2">
                    <div className="w-5 text-center text-xs">{b.icon}</div>
                    <div className="w-28 text-xs text-gray-500 truncate">{b.label}</div>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${b.color} rounded-full`} style={{ width: `${Math.min(100, (b.kg / result.annualKg) * 100)}%` }} />
                    </div>
                    <div className="w-14 text-xs font-semibold text-gray-700 text-right">{b.kg.toLocaleString()} kg</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">Your Reduction Actions</div>
              <div className="space-y-2">
                {result.actions.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${difficultyColor[a.difficulty]}`}>{a.difficulty}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-800">{a.category} {a.action}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{a.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 py-12 px-6">
            <span className="text-4xl mb-3">♻️</span>
            <p className="text-sm font-medium">Your waste reduction plan will appear here</p>
            <p className="text-xs mt-1">Covers food waste, plastic, recycling, composting & fashion</p>
          </div>
        )}
      </div>
    </div>
  )
}
