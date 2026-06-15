'use client'
import { useState, useCallback } from 'react'
import CalcShell from '@/components/CalcShell'
import { Card, InputField, ResultRow, SelectField } from '@/components/ui'
import { exportCalcPDF } from '@/lib/calcPdf'

const Z_TABLE: Record<string, number> = {
  '80': 1.282, '85': 1.440, '90': 1.645, '95': 1.960, '99': 2.576,
}

export default function SampleSizeClient() {
  const [mode, setMode] = useState<'proportion' | 'mean'>('proportion')
  const [cl, setCl] = useState('95')
  const [moe, setMoe] = useState('5')
  const [p, setP] = useState('0.5')
  const [sd, setSd] = useState('15')
  const [population, setPopulation] = useState('')
  const [copied, setCopied] = useState(false)

  const z    = Z_TABLE[cl] ?? 1.960
  const moeN = parseFloat(moe) / 100
  const moeA = parseFloat(moe)
  const pn   = parseFloat(p)
  const sdn  = parseFloat(sd)

  const nInfinite = mode === 'proportion'
    ? Math.ceil((z * z * pn * (1 - pn)) / (moeN * moeN))
    : Math.ceil((z * z * sdn * sdn) / (moeA * moeA))

  const pop     = parseInt(population)
  const nFinite = !isNaN(pop) && pop > 0
    ? Math.ceil(nInfinite / (1 + (nInfinite - 1) / pop))
    : null

  const reset = () => { setMode('proportion'); setCl('95'); setMoe('5'); setP('0.5'); setSd('15'); setPopulation('') }
  const copy  = () => {
    navigator.clipboard.writeText(`Minimum Sample Size: ${nInfinite}${nFinite !== null ? `\nAdjusted (pop=${pop}): ${nFinite}` : ''}\nConfidence: ${cl}%\nMargin of Error: ${moe}${mode === 'proportion' ? '%' : ''}`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const handlePDF = useCallback(async () => {
    await exportCalcPDF({
      toolName: 'Sample Size Calculator',
      inputs: [
        { label: 'Study Type', value: mode === 'proportion' ? 'Proportion / Percentage' : 'Mean (Continuous Data)' },
        { label: 'Confidence Level', value: `${cl}%` },
        { label: 'Margin of Error', value: `${moe}${mode === 'proportion' ? '%' : ''}` },
        mode === 'proportion' ? { label: 'Expected Proportion (p)', value: p } : { label: 'Population SD (σ)', value: sd },
        { label: 'Population Size', value: population || 'Infinite' },
      ],
      results: [
        { label: 'Minimum Sample Size (infinite pop.)', value: String(nInfinite), highlight: true },
        ...(nFinite !== null ? [{ label: `Adjusted Sample Size (N=${pop})`, value: String(nFinite), highlight: true }] : []),
        { label: 'Confidence Level', value: `${cl}%` },
        { label: 'Critical Z-Value', value: String(z) },
        { label: 'Margin of Error', value: `${moe}${mode === 'proportion' ? '%' : ''}` },
      ],
      formula: mode === 'proportion'
        ? 'n = Z² × p(1−p) / e²  |  Finite correction: n_adj = n / (1 + (n−1)/N)'
        : 'n = Z² × σ² / e²  |  Finite correction: n_adj = n / (1 + (n−1)/N)',
    })
  }, [mode, cl, moe, p, sd, population, nInfinite, nFinite, z, pop])

  return (
    <CalcShell
      title="Sample Size Calculator — Survey, Study & Poll Design"
      description="Determine the minimum sample size needed for statistically valid surveys, polls, and clinical studies. Supports proportion-based and mean-based designs. Includes finite population correction and a reference table comparing margins of error at three confidence levels."
      icon="n"
      badge="Statistically accurate"
      onExportPDF={handlePDF}
      howToUse={[
        'Choose a study type: Proportion (yes/no questions) or Mean (continuous measurements).',
        'Set the confidence level — 95% is the research standard.',
        'Enter the margin of error — 5% for surveys, smaller for research.',
        'For proportion studies: enter the expected proportion (0.5 = most conservative).',
        'Enter the population size if known — leave blank for very large populations.',
      ]}
      formula={{
        expression: 'Proportion: n = Z²×p(1−p) / e²  |  Mean: n = Z²×σ² / e²  |  Finite: n_adj = n / (1+(n−1)/N)',
        variables: [
          { name: 'Z', desc: 'Critical z-value for chosen confidence level (e.g., 1.960 for 95%)' },
          { name: 'p', desc: 'Expected proportion (use 0.5 if unknown — maximizes sample size)' },
          { name: 'e', desc: 'Margin of error — maximum acceptable deviation from true value' },
          { name: 'σ', desc: 'Population standard deviation (needed for mean-based studies)' },
          { name: 'N', desc: 'Total population size for finite population correction' },
        ],
        example: '95% CI, ±5% margin, p=0.5: n = 1.96²×0.5×0.5/0.05² = 3.8416×0.25/0.0025 = 384.16 → n = 385.',
        reference: 'Cochran (1977) — Sampling Techniques; AAPOR Standard Definitions; FDA Guidance for Clinical Trials',
      }}
      resultsGuide={[
        { label: 'Minimum Sample Size', explanation: 'The smallest number of participants needed to achieve your chosen confidence level and margin of error. Always round up — rounding down reduces precision.' },
        { label: 'Adjusted Sample Size', explanation: 'When your population is finite (known and limited), fewer samples are needed. The finite population correction (FPC) reduces n when the sample is large relative to N.' },
        { label: 'Critical Z-Value', explanation: 'The z-score corresponding to your confidence level. At 95%: Z=1.960. At 99%: Z=2.576. A higher confidence level requires a larger sample.' },
      ]}
      faqs={[
        { q: 'What is a sample size?', a: 'Sample size is the number of individuals selected from a population to participate in a study. A larger sample reduces statistical error — but there is a point of diminishing returns where more samples add little value.' },
        { q: 'Why use p = 0.5 when unknown?', a: 'p(1−p) is maximized at p=0.5, giving the most conservative (largest) required sample. If you expect the true proportion to be 0.3 or 0.7, you can enter that value to get a smaller required sample.' },
        { q: 'What is the margin of error?', a: 'The margin of error (e) is the maximum distance your sample result may be from the true population value. A poll "48% ± 3%" means the true value is 45–51% with 95% confidence.' },
        { q: 'What is a confidence level?', a: 'The confidence level (e.g., 95%) means: if you repeated the study 100 times, 95 of the resulting confidence intervals would contain the true population value. It is NOT the probability that your specific result is correct.' },
        { q: 'What does finite population correction do?', a: 'When the population is small, a lower sample fraction is needed because you\'re capturing a larger share of the population. FPC: n_adj = n / (1 + (n−1)/N). As N → ∞, n_adj → n.' },
        { q: 'Do I need a signup?', a: 'No — all calculations run in your browser with no data stored.' },
        { q: 'Should I consult a statistician?', a: 'For clinical trials, regulatory submissions, or policy research, always have your sampling design reviewed by a biostatistician or research methodologist.' },
      ]}
      relatedTools={[
        { name: 'Confidence Interval', icon: 'CI', desc: '95% and 99% CI calculator', href: '/tools/calculators/confidence-interval-calculator' },
        { name: 'Z-Score Calculator', icon: 'Z', desc: 'Normal distribution percentiles', href: '/tools/calculators/z-score-calculator' },
        { name: 'Standard Deviation', icon: 'σ', desc: 'Calculate SD for a dataset', href: '/tools/calculators/standard-deviation-calculator' },
        { name: 'Probability Calculator', icon: '🎯', desc: 'Binomial and event probability', href: '/tools/calculators/probability-calculator' },
      ]}
    >
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 16 }}>
          <SelectField label="Study Type" value={mode} onChange={v => setMode(v as typeof mode)} options={[
            { value: 'proportion', label: 'Proportion / Percentage' },
            { value: 'mean', label: 'Mean (Continuous Data)' },
          ]} />
          <SelectField label="Confidence Level" value={cl} onChange={setCl} options={
            Object.keys(Z_TABLE).map(v => ({ value: v, label: `${v}% (Z = ${Z_TABLE[v]})` }))
          } />
          <InputField
            label={mode === 'proportion' ? 'Margin of Error (%)' : 'Margin of Error (units)'}
            value={moe} onChange={setMoe} min={0.1} step={0.1} placeholder="5"
          />
          {mode === 'proportion'
            ? <InputField label="Expected Proportion (p)" value={p} onChange={setP} min={0.01} max={0.99} step={0.01} placeholder="0.5" />
            : <InputField label="Population Std Dev (σ)" value={sd} onChange={setSd} min={0.1} step={0.1} placeholder="15" />
          }
          <InputField label="Population Size (optional)" value={population} onChange={setPopulation} placeholder="Leave blank if very large" min={1} step={1} />
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <button onClick={reset} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: 'var(--fg-3)', fontSize: 13, cursor: 'pointer' }}>↺ Reset</button>
          <button onClick={copy} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: copied ? '#6ee7b7' : '#888', fontSize: 13, cursor: 'pointer' }}>{copied ? '✓ Copied' : '📋 Copy'}</button>
        </div>
      </Card>

      <Card accent style={{ marginTop: 16 }}>
        <ResultRow label="Minimum Sample Size (infinite pop.)" value={nInfinite.toLocaleString()} highlight />
        {nFinite !== null && <ResultRow label={`Adjusted Sample Size (pop. = ${pop.toLocaleString()})`} value={nFinite.toLocaleString()} highlight />}
        <ResultRow label="Confidence Level" value={`${cl}%`} />
        <ResultRow label="Critical Z-Value" value={String(z)} />
        <ResultRow label="Margin of Error" value={`${moe}${mode === 'proportion' ? '%' : ''}`} />
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Sample Size Reference (by Margin of Error)</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              {['Margin of Error', '90% CI', '95% CI', '99% CI'].map(h => (
                <th key={h} style={{ padding: '6px 8px', textAlign: 'right', color: 'var(--fg-3)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 5, 10].map(m => {
              const calcN = (zv: number) => mode === 'proportion'
                ? Math.ceil((zv*zv * pn*(1-pn)) / (m/100)**2)
                : Math.ceil((zv*zv * sdn*sdn) / m**2)
              return (
                <tr key={m} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '5px 8px', textAlign: 'right', color: 'var(--fg-3)' }}>{mode === 'proportion' ? `${m}%` : m}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'right', color: 'var(--fg)' }}>{calcN(1.645).toLocaleString()}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'right', color: 'var(--brand-2)', fontWeight: 700 }}>{calcN(1.960).toLocaleString()}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'right', color: 'var(--fg)' }}>{calcN(2.576).toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </CalcShell>
  )
}
