'use client'
import { useState, useMemo, useCallback } from 'react'
import CalcShell from '@/components/CalcShell'
import { Card, ResultRow } from '@/components/ui'
import { exportCalcPDF } from '@/lib/calcPdf'

export default function MeanMedianModeClient() {
  const [input, setInput] = useState('5, 3, 7, 3, 9, 1, 5, 3, 7')
  const [copied, setCopied] = useState(false)

  const nums = useMemo(() =>
    input.split(/[\s,;]+/).map(Number).filter(n => !isNaN(n)),
    [input]
  )

  const stats = useMemo(() => {
    if (nums.length === 0) return null
    const sorted = [...nums].sort((a, b) => a - b)
    const n = nums.length
    const sum = nums.reduce((a, b) => a + b, 0)
    const mean = sum / n
    const median = n % 2 === 0 ? (sorted[n/2-1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)]

    const freq: Record<string, number> = {}
    nums.forEach(x => { freq[x] = (freq[x] || 0) + 1 })
    const maxF = Math.max(...Object.values(freq))
    const modeVals = Object.entries(freq).filter(([, f]) => f === maxF).map(([v]) => +v)
    const noMode = modeVals.length === n
    const isMultimodal = !noMode && modeVals.length > 1

    const variance = nums.reduce((acc, x) => acc + (x - mean)**2, 0) / n
    const sd = Math.sqrt(variance)
    const range = sorted[n-1] - sorted[0]
    const q1 = sorted[Math.floor((n-1)*0.25)]
    const q3 = sorted[Math.floor((n-1)*0.75)]
    const midrange = (sorted[0] + sorted[n-1]) / 2
    const gmean = nums.every(x => x > 0) ? Math.pow(nums.reduce((a, b) => a * b, 1), 1/n) : null
    const hmean = nums.every(x => x !== 0) ? n / nums.reduce((a, b) => a + 1/b, 0) : null

    return { n, sum, mean, median, modeVals, maxF, noMode, isMultimodal, sd, variance, range, sorted, q1, q3, midrange, gmean, hmean, freq }
  }, [nums])

  const reset = () => setInput('5, 3, 7, 3, 9, 1, 5, 3, 7')
  const copy  = () => {
    if (!stats) return
    navigator.clipboard.writeText(`Count: ${stats.n}\nMean: ${stats.mean.toFixed(6)}\nMedian: ${stats.median.toFixed(6)}\nMode: ${stats.noMode ? 'None' : stats.modeVals.join(', ')}\nStd Dev: ${stats.sd.toFixed(6)}\nRange: ${stats.range.toFixed(4)}`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const handlePDF = useCallback(async () => {
    if (!stats) return
    await exportCalcPDF({
      toolName: 'Mean Median Mode Calculator',
      inputs: [{ label: 'Dataset', value: input }, { label: 'Count', value: stats.n }],
      results: [
        { label: 'Mean (Arithmetic)', value: stats.mean.toFixed(8), highlight: true },
        { label: 'Median', value: stats.median.toFixed(8), highlight: true },
        { label: 'Mode', value: stats.noMode ? 'No mode' : stats.modeVals.join(', '), highlight: true },
        { label: 'Sum', value: stats.sum.toFixed(4) },
        { label: 'Std Dev (Population σ)', value: stats.sd.toFixed(8) },
        { label: 'Variance (σ²)', value: stats.variance.toFixed(8) },
        { label: 'Range', value: stats.range.toFixed(4) },
        { label: 'Min', value: String(stats.sorted[0]) },
        { label: 'Max', value: String(stats.sorted[stats.n-1]) },
        { label: 'Q1', value: String(stats.q1) },
        { label: 'Q3', value: String(stats.q3) },
        { label: 'IQR', value: (stats.q3 - stats.q1).toFixed(4) },
        { label: 'Midrange', value: stats.midrange.toFixed(6) },
        ...(stats.gmean !== null ? [{ label: 'Geometric Mean', value: stats.gmean.toFixed(8) }] : []),
        ...(stats.hmean !== null ? [{ label: 'Harmonic Mean', value: stats.hmean.toFixed(8) }] : []),
      ],
      formula: 'Mean = Σx/n  |  Median = middle value  |  Mode = most frequent  |  σ = √[Σ(x−μ)²/n]',
    })
  }, [input, stats])

  return (
    <CalcShell
      title="Mean Median Mode Calculator — All Central Tendency Measures"
      description="Calculate the mean, median, mode, geometric mean, harmonic mean, midrange, standard deviation, variance, quartiles, and IQR for any dataset. Enter numbers separated by commas, spaces, or semicolons. Used in statistics, education and data analysis."
      icon="x̄"
      badge="Statistically accurate"
      onExportPDF={handlePDF}
      howToUse={[
        'Type or paste numbers separated by commas, spaces, or semicolons.',
        'Mean, median, and mode appear instantly.',
        'Scroll down for standard deviation, quartiles, and IQR.',
        'The frequency distribution shows how often each value appears.',
        'Export a PDF with the complete statistical summary.',
      ]}
      formula={{
        expression: 'Mean = Σxᵢ/n  |  Median = middle value  |  Mode = most frequent  |  σ = √[Σ(xᵢ−μ)²/n]',
        variables: [
          { name: 'Mean (x̄)', desc: 'Arithmetic average — sum of all values divided by count' },
          { name: 'Median', desc: 'Middle value when sorted. For even n: average of two middle values' },
          { name: 'Mode', desc: 'The value(s) that appear most frequently. A dataset can have multiple modes or none' },
          { name: 'σ', desc: 'Population standard deviation — uses divisor n (not n−1 as in sample SD)' },
        ],
        example: 'Dataset [5,3,7,3,9,1,5,3,7]: Mean=4.78, Median=5, Mode=3 (appears 3 times), SD=2.14.',
        reference: 'Descriptive statistics — R.A. Fisher (1925); NIST/SEMATECH Statistical Methods §1.3',
      }}
      resultsGuide={[
        { label: 'Mean', explanation: 'The arithmetic average — sensitive to outliers. If your data has extreme values, the median may be a better central measure.' },
        { label: 'Median', explanation: 'The value that splits the sorted data 50/50. Robust to outliers — preferred for skewed distributions like income, house prices, and reaction times.' },
        { label: 'Mode', explanation: 'The most frequently occurring value. Useful for categorical data (most popular choice) and discrete distributions. A dataset can be unimodal, bimodal, or multimodal.' },
      ]}
      faqs={[
        { q: 'What is the difference between mean, median, and mode?', a: 'Mean is the mathematical average (sensitive to outliers). Median is the middle value when sorted (robust to outliers). Mode is the most common value (used for categorical data). All are measures of "central tendency."' },
        { q: 'When should I use the median instead of the mean?', a: 'Use the median when your data is skewed or contains outliers. Household income is a classic example: Bill Gates\' salary pulls the mean up dramatically, while the median better represents the typical household.' },
        { q: 'What does "no mode" mean?', a: 'If every value appears exactly once, there is no mode — all values are equally common. This is common in continuous data. When two values tie for most frequent, the data is bimodal.' },
        { q: 'What is the geometric mean?', a: 'The geometric mean = (x₁×x₂×…×xₙ)^(1/n). Used for growth rates, investment returns, and ratios. If your dataset has all positive values, the geometric mean is less sensitive to large values than the arithmetic mean.' },
        { q: 'What is the interquartile range (IQR)?', a: 'IQR = Q3 − Q1 is the range of the middle 50% of data. It is a robust measure of spread that ignores extreme values. A point is an outlier if it is more than 1.5×IQR above Q3 or below Q1.' },
        { q: 'Do I need a signup?', a: 'No — all calculations run instantly in your browser.' },
        { q: 'Should I use this for research papers?', a: 'For descriptive statistics in academic papers, this calculator provides the standard measures. For inferential statistics (hypothesis testing, confidence intervals), use the Statistics Calculator or dedicated software.' },
      ]}
      relatedTools={[
        { name: 'Statistics Calculator', icon: '∑', desc: 'Correlation and regression', href: '/tools/calculators/statistics-calculator' },
        { name: 'Standard Deviation', icon: 'σ', desc: 'Sample and population SD', href: '/tools/calculators/standard-deviation-calculator' },
        { name: 'Z-Score Calculator', icon: 'Z', desc: 'Percentile and normal dist.', href: '/tools/calculators/z-score-calculator' },
        { name: 'Sample Size', icon: 'n', desc: 'Minimum sample for a study', href: '/tools/calculators/sample-size-calculator' },
      ]}
    >
      <Card>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 6 }}>
          Enter numbers (comma, space, or semicolon separated)
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
          placeholder="e.g. 5, 3, 7, 3, 9, 1, 5, 3, 7"
          style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 8, padding: '10px 12px', color: 'var(--fg)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'monospace' }}
        />
        {nums.length > 0 && <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 6 }}>{nums.length} values parsed</div>}
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button onClick={reset} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: 'var(--fg-3)', fontSize: 13, cursor: 'pointer' }}>↺ Reset</button>
          {stats && <button onClick={copy} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: copied ? '#6ee7b7' : '#888', fontSize: 13, cursor: 'pointer' }}>{copied ? '✓ Copied' : '📋 Copy'}</button>}
        </div>
      </Card>

      {stats ? (
        <>
          <Card accent style={{ marginTop: 16 }}>
            <ResultRow label="Count (n)" value={String(stats.n)} />
            <ResultRow label="Sum" value={stats.sum.toFixed(4)} />
            <ResultRow label="Mean (Arithmetic)" value={stats.mean.toFixed(8)} highlight />
            <ResultRow label="Median" value={stats.median.toFixed(8)} highlight />
            <ResultRow label="Mode" value={
              stats.noMode ? 'No mode (all values unique)'
              : stats.modeVals.map(m => m.toFixed(4)).join(', ') + (stats.isMultimodal ? ' (multimodal)' : ` (appears ${stats.maxF}×)`)
            } highlight />
            {stats.gmean !== null && <ResultRow label="Geometric Mean" value={stats.gmean.toFixed(8)} />}
            {stats.hmean !== null && <ResultRow label="Harmonic Mean" value={stats.hmean.toFixed(8)} />}
            <ResultRow label="Midrange" value={stats.midrange.toFixed(8)} />
          </Card>

          <Card style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Spread & Distribution</div>
            <ResultRow label="Std Dev (Population σ)" value={stats.sd.toFixed(8)} />
            <ResultRow label="Variance (σ²)" value={stats.variance.toFixed(8)} />
            <ResultRow label="Range" value={stats.range.toFixed(4)} />
            <ResultRow label="Min" value={String(stats.sorted[0])} />
            <ResultRow label="Max" value={String(stats.sorted[stats.n-1])} />
            <ResultRow label="Q1 (25th percentile)" value={String(stats.q1)} />
            <ResultRow label="Q3 (75th percentile)" value={String(stats.q3)} />
            <ResultRow label="IQR (Q3 − Q1)" value={(stats.q3 - stats.q1).toFixed(4)} />
          </Card>

          <Card style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Frequency Distribution</div>
            {Object.entries(stats.freq).sort(([a],[b]) => +a - +b).map(([val, count]) => (
              <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontFamily: 'monospace', color: '#c4b5fd', width: 64, textAlign: 'right' }}>{val}</span>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#8b5cf6', borderRadius: 4, width: `${(count / stats.n) * 100}%` }} />
                </div>
                <span style={{ color: 'var(--fg-3)', fontSize: 12, width: 40 }}>×{count}</span>
                <span style={{ color: 'var(--fg-3)', fontSize: 11, width: 48 }}>{((count/stats.n)*100).toFixed(1)}%</span>
              </div>
            ))}
          </Card>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter numbers above to calculate mean, median, mode and more.
        </div>
      )}
    </CalcShell>
  )
}
