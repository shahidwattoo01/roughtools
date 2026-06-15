'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Style tokens ─────────────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
  color: 'var(--fg)', fontSize: 15, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'left', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = { padding: '7px 12px', fontSize: 12, textAlign: 'left', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVITY_LEVELS = [
  { label: 'Sedentary',           desc: 'Little or no exercise',                multiplier: 1.200 },
  { label: 'Lightly Active',      desc: 'Light exercise 1–3 days/week',          multiplier: 1.375 },
  { label: 'Moderately Active',   desc: 'Moderate exercise 3–5 days/week',       multiplier: 1.550 },
  { label: 'Very Active',         desc: 'Hard exercise 6–7 days/week',           multiplier: 1.725 },
  { label: 'Extra Active',        desc: 'Very hard exercise or physical job',    multiplier: 1.900 },
]

const GOALS = [
  { label: 'Extreme Loss',    delta: -1000, color: '#ef4444', weeklyLbs: -2.0 },
  { label: 'Weight Loss',     delta:  -500, color: '#f87171', weeklyLbs: -1.0 },
  { label: 'Mild Loss',       delta:  -250, color: '#fca5a5', weeklyLbs: -0.5 },
  { label: 'Maintain',        delta:     0, color: '#6366f1', weeklyLbs:  0.0 },
  { label: 'Mild Gain',       delta:  +250, color: '#86efac', weeklyLbs: +0.5 },
  { label: 'Muscle Gain',     delta:  +500, color: '#10b981', weeklyLbs: +1.0 },
]

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Macro calculation ────────────────────────────────────────────────────────

function getMacros(calories: number, goal: typeof GOALS[0]) {
  // Standard macro ratios per goal type
  let proteinPct = 0.30, carbPct = 0.40, fatPct = 0.30
  if (goal.delta <= -500) { proteinPct = 0.35; carbPct = 0.35; fatPct = 0.30 }
  if (goal.delta >= 500)  { proteinPct = 0.35; carbPct = 0.45; fatPct = 0.20 }
  return {
    proteinG: Math.round((calories * proteinPct) / 4),
    carbsG:   Math.round((calories * carbPct)    / 4),
    fatG:     Math.round((calories * fatPct)     / 9),
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CalorieCalculatorClient() {
  const [age,         setAge]         = useState('25')
  const [gender,      setGender]      = useState<'male' | 'female'>('male')
  const [weight,      setWeight]      = useState('70')
  const [height,      setHeight]      = useState('175')
  const [activityIdx, setActivityIdx] = useState(1)
  const [weightUnit,  setWeightUnit]  = useState<'kg' | 'lbs'>('kg')
  const [heightUnit,  setHeightUnit]  = useState<'cm' | 'in'>('cm')
  const [showMacros,  setShowMacros]  = useState(false)
  const [showScenario,setShowScenario]= useState(false)

  // ── Calculation ──
  const result = useMemo(() => {
    const a = parseInt(age) || 0
    let w = parseFloat(weight) || 0
    let h = parseFloat(height) || 0
    if (!a || !w || !h) return null

    // Convert to metric
    if (weightUnit === 'lbs') w = w * 0.453592
    if (heightUnit === 'in')  h = h * 2.54

    // Mifflin-St Jeor
    const bmrMSJ = gender === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161

    // Harris-Benedict (original)
    const bmrHB = gender === 'male'
      ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
      : 447.593 + 9.247 * w + 3.098 * h - 4.330 * a

    const multiplier = ACTIVITY_LEVELS[activityIdx].multiplier
    const tdee = Math.round(bmrMSJ * multiplier)

    const goals = GOALS.map(g => ({
      ...g,
      calories: Math.max(1000, Math.round(tdee + g.delta)),
      macros: getMacros(Math.max(1000, Math.round(tdee + g.delta)), g),
    }))

    return {
      bmrMSJ: Math.round(bmrMSJ),
      bmrHB:  Math.round(bmrHB),
      tdee,
      goals,
      multiplier,
      wKg: w, hCm: h,
    }
  }, [age, gender, weight, height, activityIdx, weightUnit, heightUnit])

  // ── Scenario comparison (3 activity levels) ──
  const scenarios = useMemo(() => {
    if (!result) return []
    const _a = parseInt(age) || 0
    return [0, 2, 4].map(i => {
      const mult = ACTIVITY_LEVELS[i].multiplier
      const tdee = Math.round(result.bmrMSJ * mult)
      return {
        label:      ACTIVITY_LEVELS[i].label,
        multiplier: mult,
        tdee,
        loseWt:     Math.max(1000, tdee - 500),
        maintain:   tdee,
        gainMuscle: tdee + 500,
      }
    })
  }, [result, age])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>
          {/* Age */}
          <div>
            <label style={LABEL}>Age</label>
            <input type="number" style={INPUT_BOX} value={age} min={10} max={100}
              onChange={e => setAge(e.target.value)} placeholder="25" />
          </div>

          {/* Gender */}
          <div>
            <label style={LABEL}>Gender</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['male','female'] as const).map(g => (
                <button key={g} onClick={() => setGender(g)} style={{
                  flex: 1, padding: '9px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  background: gender === g ? 'rgba(99,102,241,0.25)' : 'transparent',
                  border: gender === g ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--line-strong)',
                  color: gender === g ? 'var(--brand-2)' : 'var(--fg-3)',
                }}>{g === 'male' ? 'Male' : 'Female'}</button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div>
            <label style={LABEL}>Weight</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="number" style={{ ...INPUT_BOX, flex: 1 }} value={weight}
                onChange={e => setWeight(e.target.value)} placeholder={weightUnit === 'kg' ? '70' : '154'} />
              <button onClick={() => setWeightUnit(u => u === 'kg' ? 'lbs' : 'kg')} style={{ ...BTN_GHOST, padding: '9px 12px', flexShrink: 0 }}>
                {weightUnit}
              </button>
            </div>
          </div>

          {/* Height */}
          <div>
            <label style={LABEL}>Height</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="number" style={{ ...INPUT_BOX, flex: 1 }} value={height}
                onChange={e => setHeight(e.target.value)} placeholder={heightUnit === 'cm' ? '175' : '69'} />
              <button onClick={() => setHeightUnit(u => u === 'cm' ? 'in' : 'cm')} style={{ ...BTN_GHOST, padding: '9px 12px', flexShrink: 0 }}>
                {heightUnit}
              </button>
            </div>
          </div>
        </div>

        {/* Activity level */}
        <div>
          <label style={LABEL}>Activity Level</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ACTIVITY_LEVELS.map((a, i) => (
              <button key={i} onClick={() => setActivityIdx(i)} style={{
                textAlign: 'left', padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                background: activityIdx === i ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: activityIdx === i ? '1px solid rgba(99,102,241,0.5)' : '1px solid var(--line-strong)',
                color: activityIdx === i ? 'var(--brand-2)' : 'var(--fg-3)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{a.label}</span>
                <span style={{ fontSize: 11, color: activityIdx === i ? '#a78bfa' : 'var(--fg-3)' }}>
                  {a.desc} &nbsp;×{a.multiplier}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESULTS ── */}
      {result ? (
        <>
          {/* BMR + TDEE cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            <MetricCard label="BMR (Mifflin)" value={result.bmrMSJ.toLocaleString() + ' kcal'} color="#6366f1"
              sub="Calories at rest" />
            <MetricCard label="BMR (Harris-B)" value={result.bmrHB.toLocaleString() + ' kcal'} color="#8b5cf6"
              sub="For comparison" />
            <MetricCard label="TDEE" value={result.tdee.toLocaleString() + ' kcal'} color="#10b981"
              sub={`×${result.multiplier} activity`} />
          </div>

          {/* 6-goal calorie targets table */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Calorie Targets by Goal
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Goal', 'Calories/day', 'Weekly Change', 'vs TDEE'].map((h, i) => (
                      <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.goals.map(g => (
                    <tr key={g.label} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: g.delta === 0 ? 'rgba(99,102,241,0.08)' : 'transparent',
                    }}>
                      <td style={{ ...TD, color: g.color, fontWeight: g.delta === 0 ? 700 : 400 }}>{g.label}</td>
                      <td style={{ ...TD, textAlign: 'right', fontWeight: 700, color: g.color }}>{g.calories.toLocaleString()}</td>
                      <td style={{ ...TD, textAlign: 'right', color: g.weeklyLbs < 0 ? '#f87171' : g.weeklyLbs > 0 ? '#86efac' : 'var(--fg-3)' }}>
                        {g.weeklyLbs === 0 ? '±0 lbs/wk' : (g.weeklyLbs > 0 ? '+' : '') + g.weeklyLbs.toFixed(1) + ' lbs/wk'}
                      </td>
                      <td style={{ ...TD, textAlign: 'right', color: 'var(--fg-3)' }}>
                        {g.delta === 0 ? 'Maintenance' : (g.delta > 0 ? '+' : '') + g.delta + ' kcal'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Macro breakdown toggle */}
          <button onClick={() => setShowMacros(v => !v)} style={{
            width: '100%', textAlign: 'left', padding: '14px 20px',
            background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
            borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }} aria-expanded={showMacros}>
            {showMacros ? '▾' : '▸'} Macro Breakdown per Goal
          </button>

          {showMacros && (
            <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      {['Goal', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Protein %', 'Carbs %', 'Fat %'].map((h, i) => (
                        <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.goals.map(g => (
                      <tr key={g.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ ...TD, color: g.color, fontWeight: 600 }}>{g.label}</td>
                        <td style={{ ...TD, textAlign: 'right' }}>{g.calories.toLocaleString()}</td>
                        <td style={{ ...TD, textAlign: 'right', color: '#6366f1' }}>{g.macros.proteinG}g</td>
                        <td style={{ ...TD, textAlign: 'right', color: '#f59e0b' }}>{g.macros.carbsG}g</td>
                        <td style={{ ...TD, textAlign: 'right', color: '#10b981' }}>{g.macros.fatG}g</td>
                        <td style={{ ...TD, textAlign: 'right', color: 'var(--fg-3)' }}>{Math.round(g.macros.proteinG * 4 / g.calories * 100)}%</td>
                        <td style={{ ...TD, textAlign: 'right', color: 'var(--fg-3)' }}>{Math.round(g.macros.carbsG  * 4 / g.calories * 100)}%</td>
                        <td style={{ ...TD, textAlign: 'right', color: 'var(--fg-3)' }}>{Math.round(g.macros.fatG    * 9 / g.calories * 100)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activity scenario comparison toggle */}
          <button onClick={() => setShowScenario(v => !v)} style={{
            width: '100%', textAlign: 'left', padding: '14px 20px',
            background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
            borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }} aria-expanded={showScenario}>
            {showScenario ? '▾' : '▸'} Activity Level Comparison
          </button>

          {showScenario && (
            <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {['Activity Level', 'Multiplier', 'TDEE', 'Lose (−500)', 'Maintain', 'Gain (+500)'].map((h, i) => (
                        <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map(s => (
                      <tr key={s.label} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: s.multiplier === result.multiplier ? 'rgba(99,102,241,0.08)' : 'transparent',
                      }}>
                        <td style={{ ...TD, color: s.multiplier === result.multiplier ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: s.multiplier === result.multiplier ? 700 : 400 }}>
                          {s.multiplier === result.multiplier ? '★ ' : ''}{s.label}
                        </td>
                        <td style={{ ...TD, textAlign: 'right' }}>×{s.multiplier}</td>
                        <td style={{ ...TD, textAlign: 'right', color: '#10b981', fontWeight: 600 }}>{s.tdee.toLocaleString()}</td>
                        <td style={{ ...TD, textAlign: 'right', color: '#f87171' }}>{s.loseWt.toLocaleString()}</td>
                        <td style={{ ...TD, textAlign: 'right', color: '#6366f1' }}>{s.maintain.toLocaleString()}</td>
                        <td style={{ ...TD, textAlign: 'right', color: '#86efac' }}>{s.gainMuscle.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Export */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={BTN_GHOST} onClick={async () => exportCalcPDF({
              toolName: 'Calorie Calculator',
              inputs: [
                { label: 'Age',            value: age },
                { label: 'Gender',         value: gender },
                { label: 'Weight',         value: `${weight} ${weightUnit}` },
                { label: 'Height',         value: `${height} ${heightUnit}` },
                { label: 'Activity Level', value: ACTIVITY_LEVELS[activityIdx].label },
              ],
              results: [
                { label: 'BMR (Mifflin-St Jeor)', value: result.bmrMSJ + ' kcal/day', highlight: true },
                { label: 'BMR (Harris-Benedict)',  value: result.bmrHB  + ' kcal/day' },
                { label: 'TDEE (Maintenance)',     value: result.tdee   + ' kcal/day', highlight: true },
                ...result.goals.map(g => ({ label: g.label, value: g.calories + ' kcal/day' })),
              ],
              formula: 'Mifflin-St Jeor BMR: Men = 10W + 6.25H − 5A + 5 | Women = 10W + 6.25H − 5A − 161\nTDEE = BMR × Activity Multiplier (1.2 to 1.9)',
            })}>
              Export PDF Report
            </button>
          </div>

          {/* Interpretation */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              What These Numbers Mean
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--brand-2)' }}>BMR ({result.bmrMSJ.toLocaleString()} kcal)</strong> is the energy your body burns at complete rest — breathing, circulation, and organ function. You would burn this many calories even if you stayed in bed all day.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <strong style={{ color: '#10b981' }}>TDEE ({result.tdee.toLocaleString()} kcal)</strong> is your Total Daily Energy Expenditure — BMR scaled by your activity level (×{result.multiplier}). Eat at TDEE to maintain your current weight.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                A 500 kcal/day deficit produces ~1 lb of fat loss per week. A 1,000 kcal/day deficit yields ~2 lbs/week (generally the safe maximum). Extreme deficits risk muscle loss and nutrient deficiencies.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                The Mifflin-St Jeor equation (1990) is considered the most accurate predictor of resting metabolic rate for most people, outperforming the older Harris-Benedict (1919) formula in clinical validation studies.
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter your age, gender, weight, height, and activity level — results update instantly.
        </div>
      )}
    </div>
  )
}
