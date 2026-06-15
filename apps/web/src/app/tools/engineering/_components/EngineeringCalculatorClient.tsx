'use client'

import { useState, useCallback } from 'react'
import type { EngineeringResult, EngineeringCalcConfig } from './engineering-configs'
import { getEngineeringConfig } from './engineering-registry'
import EngineeringResultDisplay from './EngineeringResultDisplay'

export type { EngineeringCalcConfig } from './engineering-configs'

// ─── Helpers ──────────────────────────────────────────────────

function fmt(n: number, decimals = 2) {
  if (!isFinite(n)) return '—'
  return n.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: 0 })
}

// ─── Tooltip ──────────────────────────────────────────────────

function Tooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <span className="relative inline-block ml-1.5 align-middle">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center hover:bg-sky-100 hover:text-sky-700 transition-colors"
        aria-label="Parameter info"
      >?</button>
      {visible && (
        <div className="absolute z-50 left-5 top-0 w-56 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl leading-relaxed pointer-events-none">
          {text}
          <div className="absolute -left-1.5 top-2 w-3 h-3 bg-gray-900 rotate-45" />
        </div>
      )}
    </span>
  )
}

// ─── Client component ─────────────────────────────────────────

interface Props {
  slug: string
  toolName: string
}

export default function EngineeringCalculatorClient({ slug, toolName }: Props) {
  const config: EngineeringCalcConfig = getEngineeringConfig(slug, toolName)

  const initVals = Object.fromEntries(config.inputs.map(inp => [inp.id, String(inp.default ?? '')]))
  const [vals, setVals]           = useState<Record<string, string>>(initVals)
  const [unitSI, setUnitSI]       = useState<Record<string, boolean>>({})  // true = SI (default), false = Imperial
  const [richResult, setRichResult] = useState<EngineeringResult | null>(null)
  const [legacyResult, setLegacyResult] = useState<Record<string, number> | null>(null)
  const [copied,    setCopied]    = useState(false)
  const [pdfBusy,   setPdfBusy]   = useState(false)
  const [pdfError,  setPdfError]  = useState<string | null>(null)
  const [showImperial, setShowImperial] = useState(false)
  // Project info for calc sheet
  const [projectName, setProjectName] = useState('')
  const [engineerName, setEngineerName] = useState('')
  const [showProjectFields, setShowProjectFields] = useState(false)

  const handleChange = useCallback((id: string, v: string) => {
    setVals(prev => ({ ...prev, [id]: v }))
  }, [])

  const calculate = useCallback(() => {
    try {
      const numVals: Record<string, number | string> = {}
      for (const k in vals) numVals[k] = isNaN(Number(vals[k])) ? vals[k] : Number(vals[k])

      if (config.calculateRich) {
        const res = config.calculateRich(numVals)
        setRichResult(res)
        setLegacyResult(res.outputs)
      } else {
        const res = config.calculate(numVals)
        setLegacyResult(res)
        setRichResult(null)
      }
    } catch {
      setRichResult(null)
      setLegacyResult(null)
    }
  }, [vals, config])

  // ── Copy results ──────────────────────────────────────────────
  const handleCopy = useCallback(() => {
    const res = legacyResult
    if (!res) return
    const text = config.outputs
      .map(f => `${f.label}: ${fmt(res[f.id] ?? 0, f.decimals ?? 2)} ${f.unit ?? ''}`.trim())
      .join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [legacyResult, config])

  // ── PDF export ─────────────────────────────────────────────
  const handlePDF = useCallback(async () => {
    const res = legacyResult
    if (!res) return
    setPdfBusy(true)
    setPdfError(null)
    try {
      const { exportCalcPDF } = await import('@/lib/calcPdf')

      const inputs = config.inputs.map(inp => ({
        label: inp.label,
        value: vals[inp.id] ?? '',
        unit:  inp.unit,
      })).filter(r => String(r.value).trim() !== '')

      const results = config.outputs.map((f, i) => ({
        label: f.label,
        value: fmt(res[f.id] ?? 0, f.decimals ?? 2),
        unit:  f.unit,
        highlight: i === 0,
      }))

      const rich = richResult ?? null

      await exportCalcPDF({
        toolName:   config.name,
        projectName: projectName || undefined,
        engineerName: engineerName || undefined,
        inputs,
        results,
        formula: config.formula ?? undefined,
        disclaimer: `This tool is intended for preliminary and reference calculations. All final designs must be reviewed, stamped, and approved by a licensed professional engineer in accordance with applicable local codes and regulations. ${config.reference ? 'Reference: ' + config.reference : ''}`.trim(),
        // Rich sections from calculateRich
        adequacyStatus: rich?.status,
        dcRatio: rich?.dcRatio,
        codeRef: rich?.codeRef ?? config.reference,
        codeClause: rich?.codeClause,
        codeEdition: rich?.codeEdition ?? config.codeEdition,
        interpretation: rich?.interpretation,
        steps: rich?.steps,
        recommendations: rich?.recommendations,
        assumptions: rich?.assumptions,
        validityNote: rich?.validityNote,
        standardTableTitle: rich?.standardTableTitle,
        standardTable: rich?.standardTable,
        criticalParam: rich?.criticalParam,
        sensitivityNote: rich?.sensitivityNote,
      })
    } catch (err) {
      console.error('PDF export failed:', err)
      setPdfError('PDF export failed — please try again.')
      setTimeout(() => setPdfError(null), 4000)
    } finally {
      setPdfBusy(false)
    }
  }, [legacyResult, richResult, config, vals, projectName, engineerName])

  const hasResult = richResult !== null || legacyResult !== null
  const isRich = richResult !== null

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* ── Inputs panel ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{config.icon}</span>
            <h2 className="text-base font-bold text-white">{config.name}</h2>
          </div>
          <p className="text-sky-100 text-xs">{config.description}</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Formula box */}
          <div className="bg-gray-50 rounded-xl p-3 font-mono text-xs text-gray-600 border border-gray-100 leading-relaxed">
            <span className="font-bold text-gray-800 block mb-1">Formula</span>
            {config.formula}
            {config.reference && <div className="mt-1 text-gray-400">Ref: {config.reference}</div>}
            {config.codeEdition && <div className="mt-0.5 text-gray-400">Code: {config.codeEdition}</div>}
          </div>

          {/* Input fields */}
          {config.inputs.map(inp => {
            const isSI = unitSI[inp.id] !== false
            const hasToggle = !!inp.unitToggle
            const displayUnit = hasToggle
              ? (isSI ? inp.unitToggle!.si : inp.unitToggle!.imperial)
              : inp.unit

            return (
              <div key={inp.id}>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-1.5">
                  {inp.label}
                  {inp.symbol && <span className="ml-1 text-gray-400 font-normal">({inp.symbol})</span>}
                  {displayUnit && <span className="font-normal text-gray-400 ml-1">[{displayUnit}]</span>}
                  {inp.required === false && <span className="ml-1.5 text-xs font-normal text-gray-300 italic">optional</span>}
                  {inp.tooltip && <Tooltip text={inp.tooltip} />}
                </label>

                <div className="flex gap-2">
                  {inp.type === 'select' ? (
                    <select
                      value={vals[inp.id]}
                      onChange={e => handleChange(inp.id, e.target.value)}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:border-sky-400 outline-none transition-all"
                    >
                      {inp.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={vals[inp.id]}
                      onChange={e => handleChange(inp.id, e.target.value)}
                      placeholder={inp.placeholder || String(inp.default ?? '')}
                      min={inp.min}
                      max={inp.max}
                      step={inp.step}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:border-sky-400 outline-none transition-all"
                    />
                  )}
                  {/* Unit toggle button */}
                  {hasToggle && (
                    <button
                      type="button"
                      onClick={() => setUnitSI(prev => ({ ...prev, [inp.id]: !(prev[inp.id] !== false) }))}
                      className="flex-shrink-0 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 transition-colors"
                      title="Toggle unit"
                    >
                      {isSI ? inp.unitToggle!.si : inp.unitToggle!.imperial}
                    </button>
                  )}
                </div>

                {inp.codeDefault && (
                  <p className="text-xs text-gray-400 mt-1">Code default: {inp.codeDefault}</p>
                )}
              </div>
            )
          })}

          {/* Project info toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowProjectFields(v => !v)}
              className="text-xs text-gray-400 hover:text-sky-600 underline transition-colors"
            >
              {showProjectFields ? '▲ Hide' : '▼ Add'} project info for calculation sheet
            </button>
            {showProjectFields && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    placeholder="e.g., Bridge Widening Phase 2"
                    className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs bg-gray-50 focus:bg-white focus:border-sky-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Engineer Name</label>
                  <input
                    type="text"
                    value={engineerName}
                    onChange={e => setEngineerName(e.target.value)}
                    placeholder="e.g., J. Smith, PE"
                    className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs bg-gray-50 focus:bg-white focus:border-sky-400 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={calculate}
            className="w-full bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-bold py-3 rounded-xl transition-all shadow-sm mt-2"
          >
            ⚙️ Calculate
          </button>
        </div>
      </div>

      {/* ── Results panel ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-bold text-gray-900">Results</h2>
            <p className="text-xs text-gray-400 mt-0.5">Enter values and click Calculate</p>
          </div>
          {hasResult && (
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              {/* Imperial toggle */}
              {richResult?.imperialOutputs && (
                <button
                  onClick={() => setShowImperial(v => !v)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${showImperial ? 'bg-sky-100 border-sky-300 text-sky-700' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
                >
                  {showImperial ? 'SI + Imperial' : 'SI only'}
                </button>
              )}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              <button
                onClick={handlePDF}
                disabled={pdfBusy}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors disabled:opacity-60 disabled:cursor-wait"
              >
                {pdfBusy ? '⏳ Generating…' : '📄 Export PDF'}
              </button>
            </div>
          )}
        </div>

        {hasResult ? (
          <div className="flex-1 p-6 overflow-y-auto">
            {isRich ? (
              <EngineeringResultDisplay
                result={richResult!}
                outputs={config.outputs}
                toolName={config.name}
                showImperial={showImperial}
              />
            ) : (
              /* Legacy simple result display */
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {config.outputs.map(field => (
                    <div key={field.id} className="flex items-center justify-between bg-sky-50 border border-sky-100 rounded-xl px-4 py-3">
                      <span className="text-sm text-gray-600 font-medium">{field.label}</span>
                      <span className="text-lg font-bold text-gray-900">
                        {fmt(legacyResult![field.id] ?? 0, field.decimals ?? 2)}{' '}
                        <span className="text-sm font-normal text-gray-500">{field.unit}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                  ⚠️ This tool is intended for preliminary and reference calculations. All final designs must be reviewed, stamped, and approved by a licensed professional engineer.
                </div>
              </div>
            )}
            {pdfError && (
              <p className="mt-3 text-xs text-red-600 font-medium">{pdfError}</p>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 py-12 px-6">
            <span className="text-4xl mb-3">{config.icon}</span>
            <p className="text-sm font-medium">Results will appear here</p>
            <p className="text-xs mt-1 text-gray-300">Fill in the inputs and press Calculate</p>
          </div>
        )}
      </div>
    </div>
  )
}
