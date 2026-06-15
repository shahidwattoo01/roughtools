'use client'
import { useState, useCallback } from 'react'
import CalcShell from '@/components/CalcShell'
import { Card, InputField, ResultRow } from '@/components/ui'
import { exportCalcPDF } from '@/lib/calcPdf'

export default function PercentErrorClient() {
  const [measured, setMeasured] = useState('9.6')
  const [actual, setActual] = useState('10')
  const [copied, setCopied] = useState(false)

  const mn = parseFloat(measured), an = parseFloat(actual)
  const valid = !isNaN(mn) && !isNaN(an) && an !== 0
  const error         = valid ? mn - an : null
  const absError      = error !== null ? Math.abs(error) : null
  const pctError      = valid ? (Math.abs(mn - an) / Math.abs(an)) * 100 : null
  const relativeError = valid ? (mn - an) / an : null
  const pctDiff       = valid && (an + mn) !== 0 ? (Math.abs(mn - an) / Math.abs((an + mn) / 2)) * 100 : null

  const quality = pctError === null ? ''
    : pctError < 1  ? 'Excellent (< 1%)'
    : pctError < 5  ? 'Good (< 5%)'
    : pctError < 10 ? 'Moderate (< 10%)'
    : 'High — review measurement'

  const qualityColor = pctError === null ? '#888'
    : pctError < 1  ? '#6ee7b7'
    : pctError < 5  ? '#fcd34d'
    : pctError < 10 ? '#fb923c'
    : '#f87171'

  const reset = () => { setMeasured('9.6'); setActual('10') }
  const copy  = () => {
    if (!valid) return
    navigator.clipboard.writeText(`Percent Error: ${pctError?.toFixed(4)}%\nAbsolute Error: ${absError?.toFixed(6)}\nRelative Error: ${relativeError?.toFixed(6)}`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const handlePDF = useCallback(async () => {
    if (!valid || pctError === null) return
    await exportCalcPDF({
      toolName: 'Percent Error Calculator',
      inputs: [{ label: 'Measured Value', value: measured }, { label: 'Actual (True) Value', value: actual }],
      results: [
        { label: 'Percent Error', value: `${pctError.toFixed(6)}%`, highlight: true },
        { label: 'Absolute Error', value: absError!.toFixed(8), highlight: true },
        { label: 'Signed Error (measured − actual)', value: error!.toFixed(8) },
        { label: 'Relative Error', value: relativeError!.toFixed(8) },
        { label: 'Percent Difference', value: `${pctDiff?.toFixed(6) ?? 'N/A'}%` },
        { label: 'Quality Rating', value: quality },
      ],
      formula: '% Error = |measured − actual| / |actual| × 100  |  Signed error = measured − actual',
    })
  }, [measured, actual, valid, pctError, absError, error, relativeError, pctDiff, quality])

  return (
    <CalcShell
      title="Percent Error Calculator — Experimental vs Actual Value"
      description="Calculate the percent error between a measured (experimental) value and the true (actual/theoretical) value. Shows absolute error, relative error, percent difference, and a quality rating. Used in chemistry labs, physics experiments and quality control."
      icon="%Δ"
      badge="Scientifically accurate"
      onExportPDF={handlePDF}
      howToUse={[
        'Enter the measured or experimental value you obtained.',
        'Enter the actual (true or theoretical) value.',
        'Percent error, absolute error, and relative error appear instantly.',
        'The quality rating tells you if the error is within acceptable bounds.',
        'Export a PDF for lab reports.',
      ]}
      formula={{
        expression: '% Error = |Measured − Actual| / |Actual| × 100%',
        variables: [
          { name: 'Measured', desc: 'The value you observed or calculated experimentally' },
          { name: 'Actual', desc: 'The true, accepted, or theoretical value (must not be zero)' },
          { name: 'Absolute Error', desc: '|Measured − Actual| — the magnitude of the difference regardless of direction' },
          { name: 'Relative Error', desc: '(Measured − Actual) / Actual — signed ratio of error to true value' },
        ],
        example: 'Measured: 9.6 g, Actual: 10 g. Error = |9.6−10| = 0.4. % Error = 0.4/10 × 100 = 4.0%. Relative error = −0.04.',
        reference: 'NIST/SEMATECH e-Handbook of Statistical Methods §2.5; GUM (Guide to Uncertainty in Measurement)',
      }}
      resultsGuide={[
        { label: 'Percent Error', explanation: 'How far the measured value is from the actual value, expressed as a percentage. A lower percent error means more accurate measurement. In science labs, < 5% is generally acceptable.' },
        { label: 'Absolute Error', explanation: 'The raw magnitude of the difference between measured and actual values, ignoring direction. Same units as the input.' },
        { label: 'Percent Difference', explanation: 'When neither value is the "true" standard, percent difference uses the average as the denominator: |A−B| / ((A+B)/2) × 100%. Useful when comparing two experimental values.' },
      ]}
      faqs={[
        { q: 'What is percent error?', a: 'Percent error measures how inaccurate a measurement is relative to the accepted true value. Formula: |measured − actual| / |actual| × 100%. A lower percent error means better accuracy.' },
        { q: 'What is the difference between percent error and percent difference?', a: 'Percent error compares a measurement to a known true value. Percent difference compares two experimental values where neither is designated as "true" — it uses the average as the denominator.' },
        { q: 'What is acceptable percent error in a lab?', a: 'Typically < 5% is acceptable in most high school and undergraduate chemistry/physics labs. Research-grade experiments may require < 1%. For manufacturing quality control, tolerances depend on industry standards.' },
        { q: 'Why is absolute error not the same as percent error?', a: 'Absolute error has the same units as the measurement and tells you the magnitude of the mistake. Percent error is dimensionless and tells you the relative size of the mistake — a 0.1 g error is small for a 1 kg object but large for a 0.1 g sample.' },
        { q: 'What if the actual value is zero?', a: 'If the actual (true) value is zero, percent error is undefined — you cannot divide by zero. Use absolute error instead, or reformulate the problem so the reference value is non-zero.' },
        { q: 'Do I need a signup?', a: 'No — all calculations run in your browser instantly.' },
        { q: 'Should I consult an expert for measurement uncertainty?', a: 'For metrology, accredited testing, or GUM-compliant uncertainty analysis, consult a metrologist or follow your laboratory\'s standard operating procedures.' },
      ]}
      relatedTools={[
        { name: 'Statistics Calculator', icon: '📈', desc: 'Mean, SD, correlation', href: '/tools/calculators/statistics-calculator' },
        { name: 'Z-Score Calculator', icon: 'Z', desc: 'Standard deviations from mean', href: '/tools/calculators/z-score-calculator' },
        { name: 'Standard Deviation', icon: 'σ', desc: 'Population and sample SD', href: '/tools/calculators/standard-deviation-calculator' },
        { name: 'Ratio Calculator', icon: '∶', desc: 'Ratios and proportions', href: '/tools/calculators/ratio-calculator' },
      ]}
    >
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <InputField label="Measured (experimental) value" value={measured} onChange={setMeasured} step={0.001} placeholder="9.6" />
          <InputField label="Actual (true/theoretical) value" value={actual} onChange={setActual} step={0.001} placeholder="10" />
        </div>
        {an === 0 && <div style={{ marginTop: 8, color: '#f87171', fontSize: 13 }}>⚠ Actual value cannot be zero.</div>}
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <button onClick={reset} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: 'var(--fg-3)', fontSize: 13, cursor: 'pointer' }}>↺ Reset</button>
          {valid && <button onClick={copy} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: copied ? '#6ee7b7' : '#888', fontSize: 13, cursor: 'pointer' }}>{copied ? '✓ Copied' : '📋 Copy'}</button>}
        </div>
      </Card>

      {valid && pctError !== null ? (
        <Card accent style={{ marginTop: 16 }}>
          <ResultRow label="Percent Error" value={`${pctError.toFixed(6)}%`} highlight />
          <ResultRow label="Absolute Error |m − a|" value={absError!.toFixed(8)} highlight />
          <ResultRow label="Signed Error (m − a)" value={error!.toFixed(8)} />
          <ResultRow label="Relative Error" value={relativeError!.toFixed(8)} />
          {pctDiff !== null && <ResultRow label="Percent Difference" value={`${pctDiff.toFixed(6)}%`} />}
          <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-2)', borderRadius: 8, fontSize: 13, color: qualityColor }}>
            Quality: {quality}
          </div>
        </Card>
      ) : !valid && an !== 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter both the measured and actual values above.
        </div>
      ) : null}
    </CalcShell>
  )
}
