'use client'

import type { EngineeringResult, AdequacyStatus, CalcStep, StandardTableRow, OutputField } from './engineering-configs'

// ─── Helpers ──────────────────────────────────────────────────

function fmt(n: number, decimals = 2) {
  if (!isFinite(n)) return '—'
  return n.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: 0 })
}

// ─── Status badge ──────────────────────────────────────────────

const STATUS_STYLES: Record<AdequacyStatus, { bg: string; border: string; text: string; dot: string; label: string }> = {
  PASS:     { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800', dot: 'bg-emerald-500', label: 'ADEQUATE — PASS' },
  MARGINAL: { bg: 'bg-amber-50',   border: 'border-amber-300',   text: 'text-amber-800',   dot: 'bg-amber-500',   label: 'MARGINAL — REVIEW' },
  FAIL:     { bg: 'bg-red-50',     border: 'border-red-300',     text: 'text-red-800',     dot: 'bg-red-500',     label: 'INADEQUATE — FAIL' },
  INFO:     { bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-800',     dot: 'bg-sky-500',     label: 'RESULT' },
}

function StatusBadge({ status }: { status: AdequacyStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wide ${s.bg} ${s.border} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

// ─── D/C ratio bar ─────────────────────────────────────────────

function DCRatioBar({ ratio, demand, capacity, demandLabel, capacityLabel }: {
  ratio: number; demand?: number; capacity?: number; demandLabel?: string; capacityLabel?: string
}) {
  const pct = Math.min(ratio * 100, 100)
  const color = ratio > 1.0 ? 'bg-red-500' : ratio > 0.9 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{demandLabel ?? 'Demand'}{demand !== undefined ? `: ${fmt(demand, 2)}` : ''}</span>
        <span className="font-bold text-gray-900">D/C = {fmt(ratio, 3)}</span>
        <span>{capacityLabel ?? 'Capacity'}{capacity !== undefined ? `: ${fmt(capacity, 2)}` : ''}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className={`h-3 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-gray-400 text-center">
        {ratio <= 1.0
          ? `${fmt((1 - ratio) * 100, 1)}% reserve capacity`
          : `Exceeds capacity by ${fmt((ratio - 1) * 100, 1)}%`}
      </div>
    </div>
  )
}

// ─── Collapsible section ───────────────────────────────────────

import { useState } from 'react'

function Section({ title, icon, defaultOpen = false, children }: {
  title: string; icon: string; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span>{icon}</span>{title}
        </span>
        <span className={`text-gray-400 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && <div className="p-4 bg-white">{children}</div>}
    </div>
  )
}

// ─── Step-by-step breakdown ────────────────────────────────────

function StepBreakdown({ steps }: { steps: CalcStep[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <div className="space-y-1 flex-1">
            <p className="text-sm text-gray-700 font-medium">{step.description}</p>
            {step.formula && (
              <code className="block text-xs bg-gray-50 border border-gray-100 rounded px-2 py-1 text-gray-600 font-mono">
                {step.formula}
              </code>
            )}
            {step.substituted && (
              <code className="block text-xs bg-sky-50 border border-sky-100 rounded px-2 py-1 text-sky-700 font-mono">
                {step.substituted}
              </code>
            )}
            {step.result && (
              <p className="text-sm font-bold text-gray-900 font-mono">{step.result}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}

// ─── Standard reference table ──────────────────────────────────

function StandardTable({ title, rows }: { title?: string; rows: StandardTableRow[] }) {
  return (
    <div>
      {title && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</p>}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={row.highlight
                  ? 'bg-sky-50 border-l-4 border-sky-500 font-bold'
                  : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-3 py-2 text-gray-600">{row.label}</td>
                <td className="px-3 py-2 text-gray-900 font-mono text-right">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main display component ────────────────────────────────────

interface Props {
  result: EngineeringResult
  outputs: OutputField[]
  toolName: string
  showImperial?: boolean
}

export default function EngineeringResultDisplay({ result, outputs, toolName, showImperial }: Props) {
  return (
    <div className="space-y-4">

      {/* 1. Primary outputs */}
      <div className="grid grid-cols-1 gap-2">
        {outputs.map((field, idx) => {
          const val = result.outputs[field.id] ?? 0
          const imperial = showImperial && result.imperialOutputs?.[field.id]
          return (
            <div
              key={field.id}
              className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
                idx === 0 || field.highlight
                  ? 'bg-sky-50 border-sky-200'
                  : 'bg-gray-50 border-gray-100'
              }`}
            >
              <span className="text-sm text-gray-600 font-medium">{field.label}</span>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">
                  {fmt(val, field.decimals ?? 2)}{' '}
                  <span className="text-sm font-normal text-gray-500">{field.unit}</span>
                </span>
                {imperial && (
                  <div className="text-xs text-gray-400">
                    = {fmt(imperial.value, field.decimals ?? 2)} {imperial.unit}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 2. Adequacy status + D/C ratio */}
      {result.status && result.status !== 'INFO' && (
        <div className={`rounded-xl border p-4 space-y-3 ${STATUS_STYLES[result.status].bg} ${STATUS_STYLES[result.status].border}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <StatusBadge status={result.status} />
            {result.dcRatio !== undefined && (
              <span className={`text-sm font-bold ${STATUS_STYLES[result.status].text}`}>
                D/C Ratio = {fmt(result.dcRatio, 3)}
              </span>
            )}
          </div>
          {result.dcRatio !== undefined && (
            <DCRatioBar
              ratio={result.dcRatio}
              demand={result.demand}
              capacity={result.capacity}
              demandLabel={result.demandLabel}
              capacityLabel={result.capacityLabel}
            />
          )}
        </div>
      )}

      {/* 3. Code compliance */}
      {result.codeRef && (
        <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
          <span className="text-lg mt-0.5">📋</span>
          <div className="text-sm space-y-0.5">
            <p className="font-semibold text-indigo-900">
              {result.compliant === true ? '✓ Code Compliant' : result.compliant === false ? '✗ Non-Compliant' : 'Code Reference'}
            </p>
            <p className="text-indigo-700">
              {result.codeRef}{result.codeClause ? ` — ${result.codeClause}` : ''}
              {result.codeEdition ? ` (${result.codeEdition})` : ''}
            </p>
          </div>
        </div>
      )}

      {/* 4. Engineering interpretation */}
      {result.interpretation && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed">
          <p className="font-semibold text-gray-900 mb-1">Engineering Interpretation</p>
          {result.interpretation}
        </div>
      )}

      {/* 5. Step-by-step breakdown */}
      {result.steps && result.steps.length > 0 && (
        <Section title="Detailed Calculation Breakdown" icon="🔢" defaultOpen={false}>
          <StepBreakdown steps={result.steps} />
        </Section>
      )}

      {/* 6. Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <Section title="Design Recommendations" icon="💡" defaultOpen={true}>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-sky-500 mt-0.5 flex-shrink-0">→</span>
                {rec}
              </li>
            ))}
          </ul>
          {result.nextStandardSize && (
            <div className="mt-3 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-sm font-semibold text-sky-800">
              Next Standard Size: {result.nextStandardSize}
            </div>
          )}
        </Section>
      )}

      {/* 7. Sensitivity */}
      {result.criticalParam && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm">
          <span className="text-lg mt-0.5">📊</span>
          <div>
            <p className="font-semibold text-orange-900">Sensitivity Note</p>
            <p className="text-orange-700">
              Most critical parameter: <strong>{result.criticalParam}</strong>.{result.sensitivityNote ? ' ' + result.sensitivityNote : ''}
            </p>
          </div>
        </div>
      )}

      {/* 8. Assumptions & validity */}
      {(result.assumptions || result.validityNote) && (
        <Section title="Assumptions & Limitations" icon="⚠️" defaultOpen={false}>
          {result.withinValidRange === false && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 font-medium">
              ⚠️ Input values are outside the valid range of this formula. Results may be unreliable.
            </div>
          )}
          {result.validityNote && (
            <p className="text-sm text-gray-600 mb-3 italic">{result.validityNote}</p>
          )}
          {result.assumptions && (
            <ul className="space-y-1.5">
              {result.assumptions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                  {a}
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {/* 9. Standard reference table */}
      {result.standardTable && result.standardTable.length > 0 && (
        <Section title="Standard Reference Table" icon="📊" defaultOpen={false}>
          <StandardTable title={result.standardTableTitle} rows={result.standardTable} />
        </Section>
      )}

      {/* 10. Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 leading-relaxed">
        <strong>Disclaimer:</strong> This tool is intended for preliminary and reference calculations. All final designs must be reviewed, stamped, and approved by a licensed professional engineer in accordance with applicable local codes and regulations.
      </div>
    </div>
  )
}
