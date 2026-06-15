'use client'

import { useState, useCallback } from 'react'
import type { OutputField, CalculationResult, MedicalConfig } from './medical-configs'
import { MEDICAL_CONFIGS, getFallbackConfig, getMedicalConfigById } from './medical-configs'
import type { MedicalCalcConfig } from './medical-configs'
import { exportCalcPDF } from '@/lib/calcPdf'
import { getEnrichment } from './medical-enrichments'

export type { MedicalCalcConfig } from './medical-configs'

// ─── Helpers ───────────────────────────────────────────────────

function fmt(n: number, decimals = 2) {
  if (!isFinite(n)) return '—'
  return n.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: 0 })
}

// ─── System 1 coded-output lookup maps ─────────────────────────

const BMI_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'Underweight',   color: '#d97706' },
  2: { label: 'Normal Weight', color: '#16a34a' },
  3: { label: 'Overweight',    color: '#ea580c' },
  4: { label: 'Obese',         color: '#dc2626' },
}
const PHQ9_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'Minimal Depression',   color: '#16a34a' },
  2: { label: 'Mild Depression',      color: '#d97706' },
  3: { label: 'Moderate Depression',  color: '#ea580c' },
  4: { label: 'Moderately Severe',    color: '#dc2626' },
  5: { label: 'Severe Depression',    color: '#9b1c1c' },
}
const GCS_SEVERITY_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'Mild TBI (GCS 13–15)',     color: '#16a34a' },
  2: { label: 'Moderate TBI (GCS 9–12)', color: '#d97706' },
  3: { label: 'Severe TBI (GCS ≤8)',     color: '#dc2626' },
}
const CKD_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'Stage 1 — Normal/High (≥90)',              color: '#16a34a' },
  2: { label: 'Stage 2 — Mildly Decreased (60–89)',       color: '#d97706' },
  3: { label: 'Stage 3 — Moderately Decreased (30–59)',   color: '#ea580c' },
  4: { label: 'Stage 4 — Severely Decreased (15–29)',     color: '#dc2626' },
  5: { label: 'Stage 5 — Kidney Failure (<15)',            color: '#9b1c1c' },
}
const BP_STAGE_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'Normal (<120/<80)',                      color: '#16a34a' },
  2: { label: 'Elevated (120–129/<80)',                 color: '#d97706' },
  3: { label: 'Stage 1 Hypertension (130–139/80–89)',  color: '#ea580c' },
  4: { label: 'Stage 2 Hypertension (≥140/≥90)',       color: '#dc2626' },
  5: { label: '⚠️ Hypertensive Crisis (≥180/≥120)',    color: '#7c3aed' },
}
const CHILD_PUGH_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'Class A — Well-compensated (5–6 pts)',         color: '#16a34a' },
  2: { label: 'Class B — Significant dysfunction (7–9 pts)', color: '#ea580c' },
  3: { label: 'Class C — Decompensated (10–15 pts)',         color: '#dc2626' },
}
const WELLS_PROB_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'Low probability (score ≤0)',      color: '#16a34a' },
  2: { label: 'Moderate probability (score 1–2)', color: '#d97706' },
  3: { label: 'High probability (score ≥3)',      color: '#dc2626' },
}

// ─── System 2 risk colors ──────────────────────────────────────

const RISK_COLORS: Record<string, { bg: string; border: string; text: string; badge: string; badgeText: string }> = {
  low:      { bg: '#f0fdf4', border: '#86efac', text: '#166534', badge: '#16a34a', badgeText: '#fff' },
  moderate: { bg: '#fefce8', border: '#fde047', text: '#854d0e', badge: '#ca8a04', badgeText: '#fff' },
  high:     { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', badge: '#dc2626', badgeText: '#fff' },
  critical: { bg: '#faf5ff', border: '#c084fc', text: '#6b21a8', badge: '#9333ea', badgeText: '#fff' },
}

const RISK_LABELS: Record<string, string> = {
  low: 'Low Risk',
  moderate: 'Moderate Risk',
  high: 'High Risk',
  critical: 'Critical',
}

// ─── System 1: resolve a coded numeric output to human-readable ─

function resolveOutputString(field: OutputField, value: number, slug: string): string {
  if (field.id === 'category' && slug === 'bmi-calculator')             return BMI_LABEL[value]?.label ?? String(value)
  if (field.id === 'severity' && slug === 'phq9-depression-screen')     return PHQ9_LABEL[value]?.label ?? String(value)
  if (field.id === 'severity' && slug === 'glasgow-coma-scale')         return GCS_SEVERITY_LABEL[value]?.label ?? String(value)
  if (field.id === 'ckd_stage')                                         return CKD_LABEL[value]?.label ?? `Stage ${value}`
  if (field.id === 'stage' && slug === 'blood-pressure-classification') return BP_STAGE_LABEL[value]?.label ?? String(value)
  if (field.id === 'class' && slug === 'child-pugh-score-calculator')   return CHILD_PUGH_LABEL[value]?.label ?? `Class ${value}`
  if (field.id === 'probability' && slug === 'wells-score-dvt-pe')      return WELLS_PROB_LABEL[value]?.label ?? String(value)
  if (field.id === 'edd_ts') {
    if (!value) return 'Enter LMP date'
    return new Date(value).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }
  return `${fmt(value, field.decimals ?? 2)}${field.unit ? ' ' + field.unit : ''}`
}

function renderPrimaryOutput(field: OutputField, value: number, slug: string) {
  if (field.id === 'edd_ts') {
    if (!value) return <span style={{ color: '#9ca3af', fontSize: 13 }}>Enter LMP date above</span>
    const dateStr = new Date(value).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    return <span style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>{dateStr}</span>
  }
  const lookup =
    (field.id === 'category'    && slug === 'bmi-calculator')             ? BMI_LABEL[value] :
    (field.id === 'severity'    && slug === 'phq9-depression-screen')     ? PHQ9_LABEL[value] :
    (field.id === 'severity'    && slug === 'glasgow-coma-scale')         ? GCS_SEVERITY_LABEL[value] :
    (field.id === 'ckd_stage')                                            ? CKD_LABEL[value] :
    (field.id === 'stage'       && slug === 'blood-pressure-classification') ? BP_STAGE_LABEL[value] :
    (field.id === 'class'       && slug === 'child-pugh-score-calculator') ? CHILD_PUGH_LABEL[value] :
    (field.id === 'probability' && slug === 'wells-score-dvt-pe')         ? WELLS_PROB_LABEL[value] :
    null
  if (lookup) {
    return (
      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: lookup.color, borderRadius: 6, padding: '3px 10px', display: 'inline-block' }}>
        {lookup.label}
      </span>
    )
  }
  return (
    <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
      {fmt(value, field.decimals ?? 2)}{' '}
      <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280' }}>{field.unit}</span>
    </span>
  )
}

// ─── Shared: render a single input field ───────────────────────

interface InputRowProps {
  id: string
  label: string
  unit?: string
  type: 'number' | 'select' | 'date'
  min?: number
  max?: number
  step?: number
  placeholder?: string
  value: string
  options?: { value: string; label: string }[]
  onChange: (id: string, val: string) => void
}

function InputRow({ id, label, unit, type, min, max, step, placeholder, value, options, onChange }: InputRowProps) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label}
        {unit && <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: 6 }}>({unit})</span>}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={e => onChange(id, e.target.value)}
          style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 12px', fontSize: 13, background: '#f9fafb', color: '#111827', outline: 'none', cursor: 'pointer' }}
        >
          {(options ?? []).map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'date' ? (
        <input
          type="date"
          value={value}
          max={new Date().toISOString().split('T')[0]}
          onChange={e => onChange(id, e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 12px', fontSize: 13, background: '#f9fafb', color: '#111827', outline: 'none' }}
        />
      ) : (
        <input
          type="number"
          value={value}
          onChange={e => onChange(id, e.target.value)}
          placeholder={placeholder ?? ''}
          min={min}
          max={max}
          step={step}
          style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 12px', fontSize: 13, background: '#f9fafb', color: '#111827', outline: 'none' }}
        />
      )}
    </div>
  )
}

// ─── Clinical Section Components ──────────────────────────────

function SectionCard({ icon, title, children, borderColor = '#e2e8f0', bgColor = '#f8fafc' }: {
  icon: string; title: string; children: React.ReactNode; borderColor?: string; bgColor?: string
}) {
  return (
    <div style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ fontWeight: 700, color: '#111827', marginBottom: 10, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{icon}</span>{title}
      </div>
      {children}
    </div>
  )
}

function BulletList({ items, color = '#374151' }: { items: string[]; color?: string }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color, lineHeight: 1.55 }}>
          <span style={{ flexShrink: 0, marginTop: 2, color: '#059669', fontWeight: 700 }}>→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

// ─── Main client component ─────────────────────────────────────

interface Props {
  slug: string
  toolName: string
}

export default function MedicalCalculatorClient({ slug, toolName }: Props) {
  const primaryConfig: MedicalCalcConfig | null = MEDICAL_CONFIGS[slug] ?? null
  const extConfig: MedicalConfig | null = getMedicalConfigById(slug) ?? null
  const fallbackConfig = primaryConfig ?? getFallbackConfig(slug, toolName)
  const isExt = !primaryConfig && !!extConfig

  const displayName    = isExt ? extConfig!.name        : fallbackConfig.name
  const displayIcon    = isExt ? extConfig!.icon        : fallbackConfig.icon
  const displayDesc    = isExt ? extConfig!.description : fallbackConfig.description
  const displayFormula = isExt ? extConfig!.formula     : fallbackConfig.formula
  const displayRef     = isExt ? extConfig!.reference   : fallbackConfig.reference

  const buildInitVals = (): Record<string, string> => {
    if (isExt && extConfig) {
      return Object.fromEntries(extConfig.inputs.map(inp => [inp.id, String(inp.defaultValue ?? '')]))
    }
    return Object.fromEntries(fallbackConfig.inputs.map(inp => [inp.id, String(inp.default ?? '')]))
  }

  const [vals, setVals]         = useState<Record<string, string>>(buildInitVals)
  const [primaryResult, setPrimaryResult] = useState<Record<string, number> | null>(null)
  const [extResult, setExtResult]         = useState<CalculationResult | null>(null)
  const [copied, setCopied]     = useState(false)
  const [activeTab, setActiveTab] = useState<'result' | 'clinical' | 'details'>('result')

  const hasResult = isExt ? extResult !== null : primaryResult !== null

  const handleChange = useCallback((id: string, v: string) => {
    setVals(prev => ({ ...prev, [id]: v }))
  }, [])

  const calculate = useCallback(() => {
    try {
      const numVals: Record<string, number | string> = {}
      for (const k in vals) numVals[k] = isNaN(Number(vals[k])) ? vals[k] : Number(vals[k])
      if (isExt && extConfig) {
        setExtResult(extConfig.calculate(numVals))
        setPrimaryResult(null)
      } else {
        setPrimaryResult(fallbackConfig.calculate(numVals))
        setExtResult(null)
      }
      setActiveTab('result')
    } catch {
      setPrimaryResult(null)
      setExtResult(null)
    }
  }, [vals, isExt, extConfig, fallbackConfig])

  const reset = useCallback(() => {
    setVals(buildInitVals())
    setPrimaryResult(null)
    setExtResult(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExt, extConfig, fallbackConfig])

  const copy = useCallback(() => {
    const lines: string[] = [displayName, '']
    lines.push('Inputs:')
    if (isExt && extConfig) {
      extConfig.inputs.forEach(inp => {
        const normOpts = (inp.options ?? []).map(o => ({ value: String(o.value), label: o.label }))
        const displayVal = inp.type === 'select'
          ? (normOpts.find(o => o.value === vals[inp.id])?.label ?? vals[inp.id])
          : vals[inp.id]
        lines.push(`  ${inp.label}: ${displayVal}${inp.unit ? ' ' + inp.unit : ''}`)
      })
      if (extResult) {
        lines.push(''); lines.push('Result:')
        lines.push(`  ${extResult.label}: ${extResult.value}${extResult.unit ? ' ' + extResult.unit : ''}`)
        if (extResult.interpretation) lines.push(`  Interpretation: ${extResult.interpretation}`)
      }
    } else {
      fallbackConfig.inputs.forEach(inp => {
        const displayVal = inp.type === 'select'
          ? (inp.options?.find(o => o.value === vals[inp.id])?.label ?? vals[inp.id])
          : vals[inp.id]
        lines.push(`  ${inp.label}: ${displayVal}${inp.unit ? ' ' + inp.unit : ''}`)
      })
      if (primaryResult) {
        lines.push(''); lines.push('Result:')
        fallbackConfig.outputs.forEach(field => {
          lines.push(`  ${field.label}: ${resolveOutputString(field, primaryResult[field.id] ?? 0, slug)}`)
        })
      }
    }
    lines.push(''); lines.push('⚠️ For educational & clinical reference only. Always verify with clinical judgment.')
    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [isExt, extConfig, extResult, fallbackConfig, primaryResult, vals, slug, displayName])

  const handlePDF = useCallback(async () => {
    if (isExt && extConfig && extResult) {
      const normInputs = extConfig.inputs.map(inp => {
        const normOpts = (inp.options ?? []).map(o => ({ value: String(o.value), label: o.label }))
        return {
          label: inp.unit ? `${inp.label} (${inp.unit})` : inp.label,
          value: inp.type === 'select' ? (normOpts.find(o => o.value === vals[inp.id])?.label ?? vals[inp.id]) : vals[inp.id],
        }
      })
      const resultRows = [
        { label: extResult.label, value: `${extResult.value}${extResult.unit ? ' ' + extResult.unit : ''}`, highlight: true },
        ...(extResult.risk ? [{ label: 'Risk Level', value: extResult.risk.charAt(0).toUpperCase() + extResult.risk.slice(1) }] : []),
        ...(extResult.interpretation ? [{ label: 'Interpretation', value: extResult.interpretation }] : []),
        ...(extResult.details ?? []).map(d => ({ label: '•', value: d })),
      ]
      await exportCalcPDF({ toolName: extConfig.name, inputs: normInputs, results: resultRows, formula: `${extConfig.formula}${extConfig.reference ? `\nRef: ${extConfig.reference}` : ''}` })
    } else if (!isExt && primaryResult) {
      await exportCalcPDF({
        toolName: fallbackConfig.name,
        inputs: fallbackConfig.inputs.map(inp => ({
          label: inp.unit ? `${inp.label} (${inp.unit})` : inp.label,
          value: inp.type === 'select' ? (inp.options?.find(o => o.value === vals[inp.id])?.label ?? vals[inp.id]) : vals[inp.id],
        })),
        results: fallbackConfig.outputs.map((field, i) => ({
          label: field.label,
          value: resolveOutputString(field, primaryResult[field.id] ?? 0, slug),
          highlight: i === 0,
        })),
        formula: `${fallbackConfig.formula}${fallbackConfig.reference ? `\nRef: ${fallbackConfig.reference}` : ''}`,
      })
    }
  }, [isExt, extConfig, extResult, fallbackConfig, primaryResult, vals, slug])

  const inputRows: InputRowProps[] = isExt && extConfig
    ? extConfig.inputs.map(inp => ({
        id: inp.id, label: inp.label, unit: inp.unit, type: inp.type as 'number' | 'select',
        min: inp.min, max: inp.max, step: inp.step,
        placeholder: inp.placeholder ?? String(inp.defaultValue ?? ''),
        value: vals[inp.id] ?? '',
        options: (inp.options ?? []).map(o => ({ value: String(o.value), label: o.label })),
        onChange: handleChange,
      }))
    : fallbackConfig.inputs.map(inp => ({
        id: inp.id, label: inp.label, unit: inp.unit, type: (inp.type ?? 'number') as 'number' | 'select' | 'date',
        min: inp.min, step: inp.step,
        placeholder: inp.placeholder ?? String(inp.default ?? ''),
        value: vals[inp.id] ?? '',
        options: inp.options,
        onChange: handleChange,
      }))

  const riskKey = extResult?.risk ?? 'low'
  const riskColors = RISK_COLORS[riskKey] ?? RISK_COLORS.low

  // Get clinical enrichment data
  const enrichment = getEnrichment(slug) ?? getEnrichment(isExt ? (extConfig?.id ?? slug) : slug)

  // Score breakdown from extResult
  const scoreBreakdown = extResult?.scoreBreakdown
  const recommendations = extResult?.recommendations ?? enrichment?.recommendations
  const nextSteps = extResult?.nextSteps ?? enrichment?.nextSteps
  const differentials = extResult?.differentials ?? enrichment?.differentials
  const guidelineSource = extResult?.guidelineSource ?? enrichment?.guidelineSource

  const hasClinicalContent = !!(recommendations?.length || nextSteps?.length || differentials?.length || scoreBreakdown?.length)

  const tabStyle = (active: boolean) => ({
    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: active ? 700 : 500,
    background: active ? '#059669' : 'transparent',
    color: active ? '#fff' : '#6b7280',
    border: active ? 'none' : '1px solid #e5e7eb',
    cursor: 'pointer',
  })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>

      {/* ══ INPUTS PANEL ══════════════════════════════════════════ */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 26 }}>{displayIcon}</span>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{displayName}</h2>
          </div>
          <p style={{ fontSize: 12, color: '#a7f3d0', margin: 0 }}>{displayDesc}</p>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Formula box */}
          <div style={{ background: '#f9fafb', borderRadius: 10, padding: '10px 14px', fontFamily: 'monospace', fontSize: 12, color: '#374151', border: '1px solid #f3f4f6', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>Formula</div>
            {displayFormula}
            {displayRef && <div style={{ marginTop: 4, color: '#9ca3af' }}>Ref: {displayRef}</div>}
          </div>

          {/* Guideline source badge */}
          {guidelineSource && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '8px 12px' }}>
              <span style={{ fontSize: 14 }}>📋</span>
              <span style={{ fontSize: 11, color: '#1e40af', fontWeight: 600 }}>{guidelineSource}</span>
            </div>
          )}

          {/* Input fields */}
          {inputRows.map(row => <InputRow key={row.id} {...row} />)}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={calculate}
              style={{ flex: 1, minWidth: 120, background: 'linear-gradient(135deg, #059669, #0d9488)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 2px 6px rgba(5,150,105,0.3)' }}
            >
              🩺 Calculate
            </button>
            <button
              onClick={reset}
              style={{ padding: '11px 16px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: 13, cursor: 'pointer' }}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      </div>

      {/* ══ RESULTS PANEL ═════════════════════════════════════════ */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Results header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Clinical Results</h2>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>Evidence-based, guideline-referenced output</p>
          </div>
          {hasResult && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button onClick={copy} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: copied ? '#059669' : '#6b7280', fontSize: 12, cursor: 'pointer', fontWeight: copied ? 600 : 400 }}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              <button onClick={handlePDF} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: 12, cursor: 'pointer' }}>
                ⬇ PDF
              </button>
            </div>
          )}
        </div>

        {/* Tabs (when result available and there is clinical content) */}
        {hasResult && hasClinicalContent && (
          <div style={{ padding: '10px 24px 0', display: 'flex', gap: 6, borderBottom: '1px solid #f3f4f6' }}>
            <button style={tabStyle(activeTab === 'result')} onClick={() => setActiveTab('result')}>Result</button>
            <button style={tabStyle(activeTab === 'clinical')} onClick={() => setActiveTab('clinical')}>
              Clinical Guide {recommendations?.length ? `(${recommendations.length})` : ''}
            </button>
            {(differentials?.length || scoreBreakdown?.length) && (
              <button style={tabStyle(activeTab === 'details')} onClick={() => setActiveTab('details')}>Details</button>
            )}
          </div>
        )}

        {/* ── System 2 (extended) result — RESULT TAB ── */}
        {isExt && extResult && (activeTab === 'result' || !hasClinicalContent) ? (
          <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>

            {/* Primary result value */}
            <div style={{ background: riskColors.bg, border: `2px solid ${riskColors.border}`, borderRadius: 16, padding: '22px 22px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: riskColors.text, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{extResult.label}</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: riskColors.text, letterSpacing: -1, lineHeight: 1.1 }}>
                {extResult.value}
                {extResult.unit && <span style={{ fontSize: 18, fontWeight: 500, marginLeft: 6 }}>{extResult.unit}</span>}
              </div>
              {extResult.risk && (
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: riskColors.badge, color: riskColors.badgeText, fontSize: 12, fontWeight: 700, borderRadius: 20, padding: '5px 16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {RISK_LABELS[extResult.risk] ?? extResult.risk}
                  </span>
                  {extResult.riskPercentage && (
                    <span style={{ background: '#1e293b', color: '#f1f5f9', fontSize: 12, fontWeight: 600, borderRadius: 20, padding: '5px 16px' }}>
                      {extResult.riskPercentage}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Interpretation */}
            {extResult.interpretation && (
              <SectionCard icon="🔍" title="Clinical Interpretation">
                <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.65 }}>{extResult.interpretation}</p>
              </SectionCard>
            )}

            {/* Details */}
            {extResult.details && extResult.details.length > 0 && (
              <SectionCard icon="📊" title="Calculated Values">
                <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {extResult.details.map((d, i) => (
                    <li key={i} style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>{d}</li>
                  ))}
                </ul>
              </SectionCard>
            )}

            {/* Score breakdown (mini preview) */}
            {scoreBreakdown && scoreBreakdown.length > 0 && (
              <SectionCard icon="📋" title="Score Breakdown">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {scoreBreakdown.map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#f9fafb', borderRadius: 8 }}>
                      <span style={{ fontSize: 12, color: '#374151' }}>{row.component}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                        {row.score}{row.max !== undefined ? `/${row.max}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Disclaimer */}
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#b91c1c', lineHeight: 1.55 }}>
              ⚠️ This tool supports clinical decision-making and does not replace physician judgment, full clinical assessment, or institutional protocols.
            </div>
          </div>

        /* ── System 1 (primary) result ── */
        ) : !isExt && primaryResult && (activeTab === 'result' || !hasClinicalContent) ? (
          <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {fallbackConfig.outputs.map((field, i) => (
                <div key={field.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: i === 0 ? '#ecfdf5' : '#f9fafb',
                  border: `1px solid ${i === 0 ? '#a7f3d0' : '#f3f4f6'}`,
                  borderRadius: 12, padding: '12px 16px', gap: 12,
                }}>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 500, flex: 1 }}>{field.label}</span>
                  <div style={{ textAlign: 'right' }}>{renderPrimaryOutput(field, primaryResult[field.id] ?? 0, slug)}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#b91c1c', lineHeight: 1.55 }}>
              ⚠️ This tool supports clinical decision-making and does not replace physician judgment, full clinical assessment, or institutional protocols.
            </div>
          </div>

        /* ── Clinical Guide Tab ── */
        ) : hasResult && activeTab === 'clinical' ? (
          <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>

            {/* Guideline badge */}
            {guidelineSource && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Guideline Source</div>
                <div style={{ fontSize: 13, color: '#1d4ed8', fontWeight: 600 }}>{guidelineSource}</div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations && recommendations.length > 0 && (
              <SectionCard icon="✅" title="Evidence-Based Recommendations" bgColor="#f0fdf4" borderColor="#86efac">
                <BulletList items={recommendations} color="#166534" />
              </SectionCard>
            )}

            {/* Next Steps */}
            {nextSteps && nextSteps.length > 0 && (
              <SectionCard icon="🔜" title="Next Clinical Steps" bgColor="#f0f9ff" borderColor="#bae6fd">
                <BulletList items={nextSteps} color="#0c4a6e" />
              </SectionCard>
            )}

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#b91c1c', lineHeight: 1.55 }}>
              ⚠️ This tool supports clinical decision-making and does not replace physician judgment, full clinical assessment, or institutional protocols.
            </div>
          </div>

        /* ── Details Tab ── */
        ) : hasResult && activeTab === 'details' ? (
          <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>

            {/* Score Breakdown */}
            {scoreBreakdown && scoreBreakdown.length > 0 && (
              <SectionCard icon="📋" title="Score Breakdown">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, padding: '6px 10px', background: '#f1f5f9', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    <span>Component</span><span>Score</span><span>Max</span>
                  </div>
                  {scoreBreakdown.map((row, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, padding: '8px 10px', background: '#f9fafb', borderRadius: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#374151' }}>{row.component}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#111827', textAlign: 'right' }}>{row.score}</span>
                      <span style={{ fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>{row.max !== undefined ? `/${row.max}` : '—'}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Differentials / Limitations */}
            {differentials && differentials.length > 0 && (
              <SectionCard icon="⚠️" title="Limitations & Confounders" bgColor="#fffbeb" borderColor="#fde68a">
                <BulletList items={differentials} color="#78350f" />
              </SectionCard>
            )}

            {/* Formula transparency */}
            <SectionCard icon="🧮" title="Formula Used">
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
                {displayFormula}
                {displayRef && <div style={{ marginTop: 6, color: '#6b7280', fontSize: 11 }}>Reference: {displayRef}</div>}
              </div>
            </SectionCard>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#b91c1c', lineHeight: 1.55 }}>
              ⚠️ This tool supports clinical decision-making and does not replace physician judgment, full clinical assessment, or institutional protocols.
            </div>
          </div>

        /* ── Empty state ── */
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#9ca3af', padding: '48px 24px' }}>
            <span style={{ fontSize: 44, marginBottom: 12 }}>{displayIcon}</span>
            <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 4px' }}>Results will appear here</p>
            <p style={{ fontSize: 13, margin: 0 }}>Fill in the inputs and press Calculate</p>
            {hasClinicalContent && (
              <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: 11, background: '#f0fdf4', border: '1px solid #a7f3d0', color: '#166534', borderRadius: 20, padding: '3px 10px' }}>✅ Recommendations included</span>
                <span style={{ fontSize: 11, background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0c4a6e', borderRadius: 20, padding: '3px 10px' }}>🔜 Next steps included</span>
                <span style={{ fontSize: 11, background: '#fffbeb', border: '1px solid #fde68a', color: '#78350f', borderRadius: 20, padding: '3px 10px' }}>⚠️ Limitations included</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
