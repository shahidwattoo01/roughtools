'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── WHO/CDC BMI Classifications ──────────────────────────────────────────────
// Source: WHO Obesity and Overweight Fact Sheet; CDC Adult BMI

interface BMIClass {
  label: string
  range: string
  min: number
  max: number
  color: string
  risk: string
}

const BMI_CLASSES: BMIClass[] = [
  { label: 'Severe Underweight',   range: '< 16.0',        min: 0,    max: 16,   color: '#3b82f6', risk: 'Very High (medical risk)' },
  { label: 'Moderate Underweight', range: '16.0 – 16.9',   min: 16,   max: 17,   color: '#60a5fa', risk: 'High' },
  { label: 'Mild Underweight',     range: '17.0 – 18.4',   min: 17,   max: 18.5, color: '#93c5fd', risk: 'Moderate' },
  { label: 'Normal Weight',        range: '18.5 – 24.9',   min: 18.5, max: 25,   color: '#10b981', risk: 'Low (optimal)' },
  { label: 'Overweight',           range: '25.0 – 29.9',   min: 25,   max: 30,   color: '#f59e0b', risk: 'Increased' },
  { label: 'Obese Class I',        range: '30.0 – 34.9',   min: 30,   max: 35,   color: '#f97316', risk: 'High' },
  { label: 'Obese Class II',       range: '35.0 – 39.9',   min: 35,   max: 40,   color: '#ef4444', risk: 'Very High' },
  { label: 'Obese Class III',      range: '≥ 40.0',        min: 40,   max: Infinity, color: '#dc2626', risk: 'Extremely High' },
]

function classifyBMI(bmi: number): BMIClass {
  return BMI_CLASSES.find(c => bmi >= c.min && bmi < c.max) ?? BMI_CLASSES[BMI_CLASSES.length - 1]
}

// ─── Body Weight Ideals ───────────────────────────────────────────────────────

function idealWeightRange(heightM: number): { min: number; max: number } {
  return { min: 18.5 * heightM * heightM, max: 24.9 * heightM * heightM }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px' }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT_BOX: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)', color: '#fff', fontSize: 15, boxSizing: 'border-box' }
const BTN_GHOST: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const TH: CSSProperties = { padding: '9px 12px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)', whiteSpace: 'nowrap' }
const TD: CSSProperties = { padding: '7px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BMICalculator() {

  const [unit,     setUnit]     = useState<'metric' | 'imperial'>('metric')
  const [weight,   setWeight]   = useState('70')     // kg or lbs
  const [heightCm, setHeightCm] = useState('175')    // cm (metric)
  const [heightFt, setHeightFt] = useState('5')      // feet (imperial)
  const [heightIn, setHeightIn] = useState('9')      // inches (imperial)
  const [waist,    setWaist]    = useState('')        // cm or inches (optional)
  const [sex,      setSex]      = useState<'male' | 'female'>('male')
  const [showAdv,  setShowAdv]  = useState(false)

  const result = useMemo(() => {
    const w = parseFloat(weight) || 0
    const h = unit === 'metric'
      ? (parseFloat(heightCm) || 0) / 100
      : ((parseInt(heightFt) || 0) * 12 + (parseInt(heightIn) || 0)) * 0.0254
    if (w <= 0 || h <= 0) return null

    const weightKg = unit === 'metric' ? w : w * 0.453592
    const bmi      = weightKg / (h * h)
    const cls      = classifyBMI(bmi)
    const ideal    = idealWeightRange(h)

    // BMI Prime = BMI / 25 (ratio to upper healthy limit)
    const bmiPrime = bmi / 25

    // Ideal weight range in user's unit
    const idealMin = unit === 'metric' ? ideal.min : ideal.min / 0.453592
    const idealMax = unit === 'metric' ? ideal.max : ideal.max / 0.453592

    // Weight to lose/gain to reach normal
    const currentKg = weightKg
    const targetKg  = bmi < 18.5 ? ideal.min : bmi > 25 ? ideal.max : currentKg
    const adjustKg  = targetKg - currentKg
    const adjust    = unit === 'metric' ? adjustKg : adjustKg / 0.453592

    // Waist risk (AHA / WHO: male >102cm / female >88cm is high)
    const waistNum = parseFloat(waist) || 0
    const waistCm  = unit === 'metric' ? waistNum : waistNum * 2.54
    const waistRisk = waistNum > 0
      ? (sex === 'male' ? waistCm > 102 : waistCm > 88) ? 'High cardiovascular risk'
        : (sex === 'male' ? waistCm > 94 : waistCm > 80) ? 'Increased cardiovascular risk'
        : 'Low cardiovascular risk'
      : null

    return {
      bmi: Math.round(bmi * 10) / 10,
      bmiPrime: Math.round(bmiPrime * 100) / 100,
      cls, ideal, idealMin, idealMax,
      adjust: Math.round(adjust * 10) / 10,
      adjustKg: Math.round(adjustKg * 10) / 10,
      heightM: h, weightKg,
      waistRisk,
    }
  }, [unit, weight, heightCm, heightFt, heightIn, waist, sex])

  const wUnit = unit === 'metric' ? 'kg' : 'lbs'
  const hUnit = unit === 'metric' ? 'cm' : 'ft/in'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Unit toggle */}
      <div style={{ display: 'flex', gap: 8 }}>
        {(['metric', 'imperial'] as const).map(u => (
          <button key={u} onClick={() => setUnit(u)} style={{
            padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
            background: unit === u ? 'rgba(139,92,246,0.3)' : 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(139,92,246,0.3)', color: unit === u ? '#e9d5ff' : '#c4b5fd',
          }}>
            {u === 'metric' ? 'Metric (kg / cm)' : 'Imperial (lbs / ft·in)'}
          </button>
        ))}
      </div>

      {/* INPUTS */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          <div>
            <label style={LABEL}>Weight ({wUnit})</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
              placeholder={unit === 'metric' ? '70' : '154'} min={0} step={0.1}
              style={INPUT_BOX} aria-label={`Weight in ${wUnit}`} />
          </div>
          {unit === 'metric' ? (
            <div>
              <label style={LABEL}>Height (cm)</label>
              <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)}
                placeholder="175" min={0} max={300} style={INPUT_BOX} aria-label="Height in cm" />
            </div>
          ) : (
            <>
              <div>
                <label style={LABEL}>Height (ft)</label>
                <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)}
                  placeholder="5" min={0} max={8} style={INPUT_BOX} aria-label="Height feet" />
              </div>
              <div>
                <label style={LABEL}>Height (in)</label>
                <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)}
                  placeholder="9" min={0} max={11} style={INPUT_BOX} aria-label="Height inches" />
              </div>
            </>
          )}
        </div>

        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginTop: 16, marginBottom: showAdv ? 16 : 0 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Advanced Options (waist circumference, sex)
        </button>

        {showAdv && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, padding: '16px 0 4px', borderTop: '1px solid var(--line-strong)' }}>
            <div>
              <label style={LABEL}>Waist Circumference ({unit === 'metric' ? 'cm' : 'in'})</label>
              <input type="number" value={waist} onChange={e => setWaist(e.target.value)}
                placeholder={unit === 'metric' ? '85' : '34'} min={0} step={0.5}
                style={INPUT_BOX} aria-label="Waist circumference" />
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>
                Used for cardiovascular risk assessment (AHA/WHO)
              </div>
            </div>
            <div>
              <label style={LABEL}>Sex (for waist risk thresholds)</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {(['male', 'female'] as const).map(s => (
                  <button key={s} onClick={() => setSex(s)} style={{
                    flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                    background: sex === s ? 'rgba(139,92,246,0.3)' : 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(139,92,246,0.3)', color: sex === s ? '#e9d5ff' : '#c4b5fd',
                  }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TIER 1: SUMMARY */}
      {result && (
        <>
          {/* BMI hero */}
          <div style={{ ...CARD, textAlign: 'center', background: `${result.cls.color}15`, borderColor: `${result.cls.color}55` }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              Your BMI (WHO Classification)
            </div>
            <div style={{ fontSize: 64, fontWeight: 900, color: result.cls.color, lineHeight: 1 }}>
              {result.bmi}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: result.cls.color, marginTop: 8 }}>
              {result.cls.label}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 6 }}>
              BMI range: {result.cls.range} · Health risk: <strong style={{ color: result.cls.color }}>{result.cls.risk}</strong>
            </div>
          </div>

          {/* BMI gauge bar */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              BMI Scale (WHO)
            </div>
            <div style={{ position: 'relative', height: 24, borderRadius: 12, overflow: 'hidden', display: 'flex' }}>
              {BMI_CLASSES.slice(0, 7).map((c, i) => (
                <div key={i} style={{ flex: 1, background: c.color }} />
              ))}
            </div>
            <div style={{ position: 'relative', height: 12, marginTop: -6 }}>
              {/* Marker */}
              {(() => {
                const markerBmi = Math.min(Math.max(result.bmi, 10), 40)
                const pct = Math.min(98, Math.max(2, ((markerBmi - 10) / 30) * 100))
                return (
                  <div style={{
                    position: 'absolute', left: `${pct}%`, top: 0,
                    width: 12, height: 18, marginLeft: -6,
                    background: '#fff', borderRadius: 3,
                    border: '2px solid #1e1b4b', boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  }} title={`Your BMI: ${result.bmi}`} />
                )
              })()}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--fg-3)' }}>
              {['10','16','17','18.5','25','30','35','40+'].map(v => <span key={v}>{v}</span>)}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 10 }}>
              {BMI_CLASSES.map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                  <span style={{ width: 8, height: 8, background: c.color, borderRadius: 1, display: 'inline-block' }} />
                  <span style={{ color: c.min <= result.bmi && result.bmi < c.max ? '#fff' : 'var(--fg-3)', fontWeight: c.min <= result.bmi && result.bmi < c.max ? 700 : 400 }}>
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {[
              { l: 'BMI Prime',       v: result.bmiPrime.toFixed(2),    c: result.cls.color, hint: 'Ratio to upper healthy limit (1.0 = 25 BMI)' },
              { l: `Healthy Weight Range`, v: `${result.idealMin.toFixed(0)}–${result.idealMax.toFixed(0)} ${wUnit}`, c: '#10b981', hint: '18.5–24.9 BMI range' },
              { l: result.adjust > 0 ? `To Lose for Healthy BMI` : result.adjust < 0 ? `To Gain for Healthy BMI` : 'At Healthy Weight', v: result.adjust !== 0 ? `${Math.abs(result.adjust)} ${wUnit}` : '✓', c: result.adjust !== 0 ? '#f59e0b' : '#10b981' },
              ...(result.waistRisk ? [{ l: 'Waist Risk (AHA/WHO)', v: result.waistRisk, c: result.waistRisk.includes('High') ? '#f87171' : '#10b981' }] : []),
            ].map(({ l, v, c, hint }) => (
              <div key={l} style={{ padding: '16px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: c }}>{v}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
                {hint && <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>{hint}</div>}
              </div>
            ))}
          </div>

          {/* TIER 2: FULL BMI CLASSIFICATION TABLE */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              📋 WHO BMI Classification — Where You Stand
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }} aria-label="WHO BMI classification table">
                <thead>
                  <tr>{['Category','BMI Range','Health Risk','Weight Range (you)'].map(h => (
                    <th key={h} style={{ ...TH, textAlign: h === 'Category' ? 'left' : 'right', padding: '10px 12px' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {BMI_CLASSES.map(cls => {
                    const isYou = result.cls.label === cls.label
                    const wMin = cls.min * result.heightM * result.heightM
                    const wMax = cls.max === Infinity ? null : cls.max * result.heightM * result.heightM
                    const wMinDisp = unit === 'metric' ? wMin.toFixed(0) : (wMin / 0.453592).toFixed(0)
                    const wMaxDisp = wMax ? (unit === 'metric' ? wMax.toFixed(0) : (wMax / 0.453592).toFixed(0)) : '+'
                    return (
                      <tr key={cls.label} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: isYou ? `${cls.color}18` : 'transparent',
                      }}>
                        <td style={{ ...TD, textAlign: 'left', color: cls.color, fontWeight: isYou ? 700 : 400 }}>
                          {isYou ? '▶ ' : ''}{cls.label}
                        </td>
                        <td style={{ ...TD, color: cls.color }}>{cls.range}</td>
                        <td style={TD}>{cls.risk}</td>
                        <td style={{ ...TD, color: isYou ? cls.color : 'var(--fg-3)', fontWeight: isYou ? 700 : 400 }}>
                          {wMinDisp}–{wMaxDisp} {wUnit}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Export */}
            <div style={{ marginTop: 16 }}>
              <button onClick={async () => exportCalcPDF({
                toolName: 'BMI Calculator',
                inputs: [
                  { label: 'Weight', value: `${weight} ${wUnit}` },
                  { label: 'Height', value: unit === 'metric' ? `${heightCm} cm` : `${heightFt}ft ${heightIn}in` },
                  { label: 'System', value: unit },
                ],
                results: [
                  { label: 'BMI',           value: String(result.bmi),     highlight: true },
                  { label: 'Category',      value: result.cls.label,       highlight: true },
                  { label: 'BMI Prime',     value: String(result.bmiPrime) },
                  { label: 'Health Risk',   value: result.cls.risk },
                  { label: 'Healthy Range', value: `${result.idealMin.toFixed(0)}–${result.idealMax.toFixed(0)} ${wUnit}` },
                  { label: 'Weight Adjustment', value: result.adjust !== 0 ? `${result.adjust > 0 ? 'Lose' : 'Gain'} ${Math.abs(result.adjust)} ${wUnit}` : 'Healthy weight' },
                ],
              })} style={BTN_GHOST}>📄 Export PDF</button>
            </div>
          </div>

          {/* TIER 4: GUIDANCE */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              💡 Understanding Your Result
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <strong style={{ color: result.cls.color }}>Your BMI of {result.bmi}</strong> falls in the <strong>{result.cls.label}</strong> category ({result.cls.range}). For your height, a healthy weight range is <strong style={{ color: '#10b981' }}>{result.idealMin.toFixed(0)}–{result.idealMax.toFixed(0)} {wUnit}</strong>.
                {result.adjust !== 0 && ` To reach a healthy BMI, you would need to ${result.adjust > 0 ? 'lose' : 'gain'} approximately ${Math.abs(result.adjust)} ${wUnit}.`}
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <strong>BMI has limitations:</strong> it does not directly measure body fat and does not account for muscle mass, bone density, age, sex, or ethnicity. Athletes and highly muscular individuals may be classified as overweight despite low body fat. Asian populations may have higher health risks at lower BMI thresholds (23–25).
              </li>
              {result.waistRisk && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  <strong style={{ color: result.waistRisk.includes('High') ? '#f87171' : '#10b981' }}>Waist circumference risk: {result.waistRisk}.</strong> According to the AHA/WHO, waist circumference is a stronger predictor of cardiovascular risk than BMI alone. Risk thresholds: men &gt;94 cm (increased) / &gt;102 cm (high); women &gt;80 cm (increased) / &gt;88 cm (high).
                </li>
              )}
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <strong style={{ color: '#fbbf24' }}>Consult a healthcare provider</strong> for a complete health assessment. BMI is a screening tool only. A physician can evaluate body composition, metabolic health markers (blood glucose, cholesterol, blood pressure), and create an appropriate health plan.
              </li>
            </ul>
          </div>
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter your weight and height above — BMI and health classification appear instantly.
        </div>
      )}
    </div>
  )
}
