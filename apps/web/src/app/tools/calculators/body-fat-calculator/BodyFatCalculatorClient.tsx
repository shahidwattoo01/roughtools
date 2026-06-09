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
  background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)',
  color: '#fff', fontSize: 15, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'left', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = { padding: '7px 12px', fontSize: 12, textAlign: 'left', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── ACE Classification ───────────────────────────────────────────────────────

const ACE_MALE = [
  { label: 'Essential Fat', min: 2,  max: 5,  color: '#6366f1' },
  { label: 'Athletic',      min: 6,  max: 13, color: '#10b981' },
  { label: 'Fitness',       min: 14, max: 17, color: '#22c55e' },
  { label: 'Acceptable',    min: 18, max: 24, color: '#f59e0b' },
  { label: 'Obese',         min: 25, max: 100,color: '#ef4444' },
]
const ACE_FEMALE = [
  { label: 'Essential Fat', min: 10, max: 13, color: '#6366f1' },
  { label: 'Athletic',      min: 14, max: 20, color: '#10b981' },
  { label: 'Fitness',       min: 21, max: 24, color: '#22c55e' },
  { label: 'Acceptable',    min: 25, max: 31, color: '#f59e0b' },
  { label: 'Obese',         min: 32, max: 100,color: '#ef4444' },
]

function getCategory(bf: number, gender: 'male' | 'female') {
  const table = gender === 'male' ? ACE_MALE : ACE_FEMALE
  return table.find(c => bf >= c.min && bf <= c.max) ?? table[table.length - 1]
}

// ─── Calculation engines ──────────────────────────────────────────────────────

function calcNavy(
  gender: 'male' | 'female',
  waistIn: number, neckIn: number, heightIn: number, hipIn: number
): number | null {
  if (gender === 'male') {
    const diff = waistIn - neckIn
    if (diff <= 0 || heightIn <= 0) return null
    return 86.010 * Math.log10(diff) - 70.041 * Math.log10(heightIn) + 36.76
  } else {
    const sum = waistIn + hipIn - neckIn
    if (sum <= 0 || heightIn <= 0) return null
    return 163.205 * Math.log10(sum) - 97.684 * Math.log10(heightIn) - 78.387
  }
}

function calcJP3(
  gender: 'male' | 'female',
  s1: number, s2: number, s3: number, age: number
): number | null {
  if (!s1 || !s2 || !s3 || !age) return null
  let bodyDensity: number
  if (gender === 'male') {
    // Chest, abdomen, thigh
    const sum = s1 + s2 + s3
    bodyDensity = 1.10938 - 0.0008267 * sum + 0.0000016 * sum * sum - 0.0002574 * age
  } else {
    // Tricep, suprailiac, thigh
    const sum = s1 + s2 + s3
    bodyDensity = 1.0994921 - 0.0009929 * sum + 0.0000023 * sum * sum - 0.0001392 * age
  }
  if (bodyDensity <= 0) return null
  return (495 / bodyDensity - 450) // Siri formula
}

function calcBMI(bmi: number, age: number, gender: 'male' | 'female'): number {
  // Deurenberg formula
  const sexFactor = gender === 'male' ? 1 : 0
  return 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BodyFatCalculatorClient() {
  const [method, setMethod]   = useState<'navy' | 'jp3' | 'bmi'>('navy')
  const [gender, setGender]   = useState<'male' | 'female'>('male')
  const [unit, setUnit]       = useState<'cm' | 'in'>('cm')

  // Shared
  const [age, setAge]         = useState('30')
  const [weight, setWeight]   = useState('80')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')

  // US Navy
  const [height, setHeight]   = useState('175')
  const [waist, setWaist]     = useState('85')
  const [neck, setNeck]       = useState('37')
  const [hip, setHip]         = useState('95')

  // JP3
  const [s1, setS1]           = useState('15')
  const [s2, setS2]           = useState('20')
  const [s3, setS3]           = useState('18')

  // BMI-based
  const [heightBMI, setHeightBMI] = useState('175')
  const [weightBMI, setWeightBMI] = useState('80')

  // Goal
  const [targetBF, setTargetBF]   = useState('15')
  const [showAdv, setShowAdv]     = useState(false)

  function toIn(val: string) {
    const v = parseFloat(val)
    return unit === 'cm' ? v / 2.54 : v
  }

  const result = useMemo(() => {
    const a = parseInt(age) || 0
    const wKg = weightUnit === 'kg' ? parseFloat(weight) : parseFloat(weight) * 0.453592
    if (!a || !wKg) return null

    let bf: number | null = null

    if (method === 'navy') {
      bf = calcNavy(gender, toIn(waist), toIn(neck), toIn(height), toIn(hip))
    } else if (method === 'jp3') {
      bf = calcJP3(gender, parseFloat(s1), parseFloat(s2), parseFloat(s3), a)
    } else {
      const hM = parseFloat(heightBMI) / 100
      const wKg2 = parseFloat(weightBMI)
      if (hM > 0 && wKg2 > 0) {
        const bmi = wKg2 / (hM * hM)
        bf = calcBMI(bmi, a, gender)
      }
    }

    if (bf === null || isNaN(bf) || bf <= 0) return null

    const bfClamped = Math.max(0.1, Math.min(bf, 70))
    const cat = getCategory(bfClamped, gender)
    const fatMassKg   = wKg * (bfClamped / 100)
    const leanMassKg  = wKg - fatMassKg
    const fatMassLbs  = fatMassKg  * 2.20462
    const leanMassLbs = leanMassKg * 2.20462

    // Goal calc
    const tgt = parseFloat(targetBF)
    let fatToLoseKg = 0
    let fatToLoseLbs = 0
    if (tgt > 0 && tgt < bfClamped && leanMassKg > 0) {
      const targetTotalKg = leanMassKg / (1 - tgt / 100)
      fatToLoseKg  = wKg - targetTotalKg
      fatToLoseLbs = fatToLoseKg * 2.20462
    }

    return { bf: bfClamped, cat, fatMassKg, leanMassKg, fatMassLbs, leanMassLbs, fatToLoseKg, fatToLoseLbs }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, gender, unit, age, weight, weightUnit, height, waist, neck, hip, s1, s2, s3, heightBMI, weightBMI, targetBF])

  // Build scenario targets
  const scenarios = useMemo(() => {
    if (!result) return []
    const wKg = weightUnit === 'kg' ? parseFloat(weight) : parseFloat(weight) * 0.453592
    return [10, 15, 20].map(tgt => {
      if (tgt >= result.bf) return null
      const lean = wKg * (1 - result.bf / 100)
      const targetTotal = lean / (1 - tgt / 100)
      const toLooseKg = wKg - targetTotal
      return { tgt, toLooseKg, toLooseLbs: toLooseKg * 2.20462 }
    }).filter(Boolean) as { tgt: number; toLooseKg: number; toLooseLbs: number }[]
  }, [result, weight, weightUnit])

  const aceTable = gender === 'male' ? ACE_MALE : ACE_FEMALE

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        {/* Method selector */}
        <div style={{ marginBottom: 20 }}>
          <label style={LABEL}>Calculation Method</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {([['navy','US Navy'], ['jp3','Jackson-Pollock 3-Site'], ['bmi','BMI-Based']] as const).map(([v, l]) => (
              <button key={v} onClick={() => setMethod(v)} style={{
                padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                background: method === v ? 'rgba(99,102,241,0.25)' : 'transparent',
                border: method === v ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--line-strong)',
                color: method === v ? '#c4b5fd' : 'var(--fg-3)',
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Gender + Unit + Age */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={LABEL}>Gender</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['male','female'] as const).map(g => (
                <button key={g} onClick={() => setGender(g)} style={{
                  flex: 1, padding: '9px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  background: gender === g ? 'rgba(99,102,241,0.25)' : 'transparent',
                  border: gender === g ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--line-strong)',
                  color: gender === g ? '#c4b5fd' : 'var(--fg-3)',
                }}>{g === 'male' ? 'Male' : 'Female'}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={LABEL}>Age</label>
            <input type="number" style={INPUT_BOX} value={age} min={10} max={100}
              onChange={e => setAge(e.target.value)} placeholder="30" />
          </div>
          <div>
            <label style={LABEL}>Body Weight</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="number" style={{ ...INPUT_BOX, flex: 1 }} value={weight}
                onChange={e => setWeight(e.target.value)} placeholder="80" />
              <button onClick={() => setWeightUnit(u => u === 'kg' ? 'lbs' : 'kg')} style={{ ...BTN_GHOST, padding: '9px 12px', flexShrink: 0 }}>
                {weightUnit}
              </button>
            </div>
          </div>
        </div>

        {/* Navy inputs */}
        {method === 'navy' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            <div>
              <label style={LABEL}>Unit</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['cm','in'] as const).map(u => (
                  <button key={u} onClick={() => setUnit(u)} style={{
                    flex: 1, padding: '9px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                    background: unit === u ? 'rgba(99,102,241,0.25)' : 'transparent',
                    border: unit === u ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--line-strong)',
                    color: unit === u ? '#c4b5fd' : 'var(--fg-3)',
                  }}>{u}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={LABEL}>Height ({unit})</label>
              <input type="number" style={INPUT_BOX} value={height} onChange={e => setHeight(e.target.value)} placeholder="175" />
            </div>
            <div>
              <label style={LABEL}>Waist ({unit}) <span style={{ color: 'var(--fg-3)', fontSize: 10 }}>at navel</span></label>
              <input type="number" style={INPUT_BOX} value={waist} onChange={e => setWaist(e.target.value)} placeholder="85" />
            </div>
            <div>
              <label style={LABEL}>Neck ({unit})</label>
              <input type="number" style={INPUT_BOX} value={neck} onChange={e => setNeck(e.target.value)} placeholder="37" />
            </div>
            {gender === 'female' && (
              <div>
                <label style={LABEL}>Hip ({unit}) <span style={{ color: 'var(--fg-3)', fontSize: 10 }}>widest point</span></label>
                <input type="number" style={INPUT_BOX} value={hip} onChange={e => setHip(e.target.value)} placeholder="95" />
              </div>
            )}
          </div>
        )}

        {/* JP3 inputs */}
        {method === 'jp3' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            {gender === 'male' ? (
              <>
                <div>
                  <label style={LABEL}>Chest Skinfold (mm)</label>
                  <input type="number" style={INPUT_BOX} value={s1} onChange={e => setS1(e.target.value)} placeholder="15" />
                </div>
                <div>
                  <label style={LABEL}>Abdomen Skinfold (mm)</label>
                  <input type="number" style={INPUT_BOX} value={s2} onChange={e => setS2(e.target.value)} placeholder="20" />
                </div>
                <div>
                  <label style={LABEL}>Thigh Skinfold (mm)</label>
                  <input type="number" style={INPUT_BOX} value={s3} onChange={e => setS3(e.target.value)} placeholder="18" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={LABEL}>Tricep Skinfold (mm)</label>
                  <input type="number" style={INPUT_BOX} value={s1} onChange={e => setS1(e.target.value)} placeholder="15" />
                </div>
                <div>
                  <label style={LABEL}>Suprailiac Skinfold (mm)</label>
                  <input type="number" style={INPUT_BOX} value={s2} onChange={e => setS2(e.target.value)} placeholder="20" />
                </div>
                <div>
                  <label style={LABEL}>Thigh Skinfold (mm)</label>
                  <input type="number" style={INPUT_BOX} value={s3} onChange={e => setS3(e.target.value)} placeholder="18" />
                </div>
              </>
            )}
          </div>
        )}

        {/* BMI-based inputs */}
        {method === 'bmi' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            <div>
              <label style={LABEL}>Height (cm)</label>
              <input type="number" style={INPUT_BOX} value={heightBMI} onChange={e => setHeightBMI(e.target.value)} placeholder="175" />
            </div>
            <div>
              <label style={LABEL}>Weight (kg)</label>
              <input type="number" style={INPUT_BOX} value={weightBMI} onChange={e => setWeightBMI(e.target.value)} placeholder="80" />
            </div>
          </div>
        )}

        {/* Goal calculator toggle */}
        <button onClick={() => setShowAdv(v => !v)}
          style={{ ...BTN_GHOST, marginTop: 16 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Goal Body Fat Calculator
        </button>

        {showAdv && (
          <div style={{ marginTop: 14, padding: '14px 0 4px', borderTop: '1px solid var(--line-strong)' }}>
            <div style={{ maxWidth: 220 }}>
              <label style={LABEL}>Target Body Fat %</label>
              <input type="number" style={INPUT_BOX} value={targetBF} min={2} max={50} step={0.5}
                onChange={e => setTargetBF(e.target.value)} placeholder="15" />
            </div>
          </div>
        )}
      </div>

      {/* ── RESULTS ── */}
      {result ? (
        <>
          {/* Category banner */}
          <div style={{ ...CARD, textAlign: 'center', padding: '28px 24px', background: `${result.cat.color}15`, borderColor: `${result.cat.color}40` }}>
            <div style={{ fontSize: 56, fontWeight: 900, color: result.cat.color, lineHeight: 1 }}>
              {result.bf.toFixed(1)}%
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: result.cat.color, marginTop: 8 }}>{result.cat.label}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>Body Fat — ACE Classification</div>
          </div>

          {/* Metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Fat Mass (kg)"  value={result.fatMassKg.toFixed(1) + ' kg'} color="#f59e0b"
              sub={result.fatMassLbs.toFixed(1) + ' lbs'} />
            <MetricCard label="Lean Mass (kg)" value={result.leanMassKg.toFixed(1) + ' kg'} color="#10b981"
              sub={result.leanMassLbs.toFixed(1) + ' lbs'} />
            <MetricCard label="Body Fat %"     value={result.bf.toFixed(1) + '%'}            color={result.cat.color} />
            <MetricCard label="Category"       value={result.cat.label}                       color={result.cat.color} />
          </div>

          {/* Goal result */}
          {showAdv && result.fatToLoseKg > 0.1 && (
            <div style={{ ...CARD, background: 'rgba(16,185,129,0.07)', borderColor: 'rgba(16,185,129,0.25)', padding: '18px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Goal: Reach {parseFloat(targetBF).toFixed(1)}% Body Fat
              </div>
              <div style={{ fontSize: 14, color: 'var(--fg-2)' }}>
                You need to lose approximately{' '}
                <strong style={{ color: '#10b981' }}>{result.fatToLoseKg.toFixed(1)} kg ({result.fatToLoseLbs.toFixed(1)} lbs)</strong>{' '}
                of fat while preserving lean mass.
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 6 }}>
                At a 500 kcal/day deficit (~0.5 kg/week), this would take approximately{' '}
                <strong style={{ color: 'var(--fg-2)' }}>{Math.ceil(result.fatToLoseKg / 0.5)} weeks</strong>.
              </div>
            </div>
          )}

          {/* Scenario targets */}
          {scenarios.length > 0 && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Target Scenarios
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {['Target BF%', 'Fat to Lose (kg)', 'Fat to Lose (lbs)', 'Est. Weeks (−500 kcal/day)'].map(h => (
                        <th key={h} style={TH}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map(s => (
                      <tr key={s.tgt} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ ...TD, color: '#c4b5fd', fontWeight: 700 }}>{s.tgt}%</td>
                        <td style={TD}>{s.toLooseKg.toFixed(1)} kg</td>
                        <td style={TD}>{s.toLooseLbs.toFixed(1)} lbs</td>
                        <td style={TD}>{Math.ceil(s.toLooseKg / 0.5)} wks</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACE Classification table */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              ACE Body Fat Classification — {gender === 'male' ? 'Men' : 'Women'}
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Category', 'BF% Range', 'Status'].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {aceTable.map(row => {
                    const isActive = result.bf >= row.min && result.bf <= row.max
                    return (
                      <tr key={row.label} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: isActive ? `${row.color}18` : 'transparent',
                      }}>
                        <td style={{ ...TD, color: row.color, fontWeight: isActive ? 700 : 400 }}>
                          {isActive ? '★ ' : ''}{row.label}
                        </td>
                        <td style={TD}>{row.min}% – {row.max === 100 ? '∞' : row.max + '%'}</td>
                        <td style={{ ...TD, color: isActive ? row.color : 'var(--fg-3)' }}>
                          {isActive ? 'Your current range' : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={BTN_GHOST} onClick={async () => exportCalcPDF({
              toolName: 'Body Fat Calculator',
              inputs: [
                { label: 'Method', value: method === 'navy' ? 'US Navy' : method === 'jp3' ? 'Jackson-Pollock 3-Site' : 'BMI-Based' },
                { label: 'Gender', value: gender },
                { label: 'Age', value: age },
                { label: 'Weight', value: `${weight} ${weightUnit}` },
              ],
              results: [
                { label: 'Body Fat %', value: result.bf.toFixed(1) + '%', highlight: true },
                { label: 'Category', value: result.cat.label, highlight: true },
                { label: 'Fat Mass', value: result.fatMassKg.toFixed(1) + ' kg' },
                { label: 'Lean Mass', value: result.leanMassKg.toFixed(1) + ' kg' },
              ],
              formula: method === 'navy'
                ? 'US Navy: Male = 86.010×log10(waist−neck) − 70.041×log10(height) + 36.76\nFemale = 163.205×log10(waist+hip−neck) − 97.684×log10(height) − 78.387 (all in inches)'
                : method === 'jp3' ? 'Jackson-Pollock 3-Site + Siri formula: %BF = (495/density) − 450'
                : 'Deurenberg BMI formula: %BF = 1.2×BMI + 0.23×age − 10.8×sex − 5.4',
            })}>
              Export PDF Report
            </button>
          </div>

          {/* Medical disclaimer */}
          <div style={{ ...CARD, background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)', padding: '14px 18px' }}>
            <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Medical Disclaimer
            </div>
            <p style={{ fontSize: 12, color: 'var(--fg-3)', margin: 0, lineHeight: 1.7 }}>
              Body fat estimates from circumference or skinfold methods carry a ±3–5% margin of error. These results are for informational purposes only and do not constitute medical advice. Consult a physician or registered dietitian before making significant changes to your diet or exercise program.
            </p>
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Fill in your measurements above — results update instantly.
        </div>
      )}
    </div>
  )
}
