'use client'
import { useState, useCallback } from 'react'
import CalcShell from '@/components/CalcShell'
import { Card, InputField, ResultRow, SelectField } from '@/components/ui'
import { exportCalcPDF } from '@/lib/calcPdf'

function factorial(n: number): number { return n<=1?1:n*factorial(n-1) }
function comb(n: number, k: number) { return n<k?0:factorial(n)/(factorial(k)*factorial(n-k)) }
function binomialProb(n: number, k: number, p: number) { return comb(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k) }

export default function ProbabilityCalculatorClient() {
  const [mode, setMode] = useState<'basic'|'binomial'|'permcomb'>('basic')
  const [pA, setPA] = useState('0.30')
  const [pB, setPB] = useState('0.50')
  const [n,  setN]  = useState('10')
  const [k,  setK]  = useState('3')
  const [p,  setP]  = useState('0.50')
  const [copied, setCopied] = useState(false)

  const pAn=parseFloat(pA), pBn=parseFloat(pB)
  const nn=parseInt(n), kn=parseInt(k), pn=parseFloat(p)

  const pAorB  = pAn+pBn-pAn*pBn
  const pAandB = pAn*pBn
  const pNotA  = 1-pAn
  const oddsA  = pAn>0&&pAn<1 ? `${pAn.toFixed(3)} : ${(1-pAn).toFixed(3)}` : 'N/A'

  const binomExact = !isNaN(nn)&&!isNaN(kn)&&!isNaN(pn)&&kn<=nn ? binomialProb(nn,kn,pn) : null
  const binomCumul = binomExact!==null
    ? Array.from({length:kn+1},(_,i)=>binomialProb(nn,i,pn)).reduce((a,b)=>a+b,0)
    : null
  const permResult = !isNaN(nn)&&!isNaN(kn)&&nn>=kn ? factorial(nn)/factorial(nn-kn) : null
  const combResult = !isNaN(nn)&&!isNaN(kn)&&nn>=kn ? comb(nn,kn) : null

  const reset = () => { setPA('0.30'); setPB('0.50'); setN('10'); setK('3'); setP('0.50') }
  const copy  = () => {
    const t = mode==='basic' ? `P(A)=${pAn} P(B)=${pBn} P(A∪B)=${pAorB.toFixed(4)} P(A∩B)=${pAandB.toFixed(4)}`
      : mode==='binomial' ? `P(X=${k})=${binomExact?.toFixed(8)} P(X≤${k})=${binomCumul?.toFixed(8)}`
      : `P(${n},${k})=${permResult} C(${n},${k})=${combResult}`
    navigator.clipboard.writeText(t)
    setCopied(true); setTimeout(()=>setCopied(false),2000)
  }

  const handlePDF = useCallback(async () => {
    await exportCalcPDF({
      toolName: 'Probability Calculator',
      inputs: mode==='basic'
        ? [{ label: 'P(A)', value: pA }, { label: 'P(B)', value: pB }]
        : mode==='binomial'
        ? [{ label: 'Trials (n)', value: n }, { label: 'Successes (k)', value: k }, { label: 'Probability (p)', value: p }]
        : [{ label: 'n (total)', value: n }, { label: 'r (chosen)', value: k }],
      results: mode==='basic'
        ? [
          { label: 'P(A or B) — independent', value: pAorB.toFixed(6), highlight: true },
          { label: 'P(A and B) — independent', value: pAandB.toFixed(6), highlight: true },
          { label: 'P(not A)', value: pNotA.toFixed(6) },
          { label: 'Odds of A', value: oddsA },
        ] : mode==='binomial'
        ? [
          { label: `P(X = ${k})`, value: binomExact?.toFixed(8)??'N/A', highlight: true },
          { label: `P(X ≤ ${k})`, value: binomCumul?.toFixed(8)??'N/A', highlight: true },
          { label: 'Mean (np)', value: (nn*pn).toFixed(4) },
          { label: 'Variance', value: (nn*pn*(1-pn)).toFixed(4) },
          { label: 'Std Dev', value: Math.sqrt(nn*pn*(1-pn)).toFixed(4) },
        ] : [
          { label: 'Permutations P(n,r)', value: permResult?.toFixed(0)??'N/A', highlight: true },
          { label: 'Combinations C(n,r)', value: combResult?.toFixed(0)??'N/A', highlight: true },
        ],
    })
  }, [mode, pA, pB, n, k, p, pAorB, pAandB, pNotA, oddsA, binomExact, binomCumul, nn, pn, permResult, combResult])

  return (
    <CalcShell
      title="Probability Calculator — Events, Binomial & Combinations"
      description="Calculate event probabilities, binomial distribution outcomes, and permutation/combination counts. Supports independent events (P(A∪B), P(A∩B)), exact binomial probability P(X=k), cumulative P(X≤k), and combinatorial counting. Used in statistics, data science, gaming and finance."
      icon="🎯"
      badge="Statistically accurate"
      onExportPDF={handlePDF}
      howToUse={[
        'Choose a mode: Basic Probability, Binomial Distribution, or Permutations & Combinations.',
        'For Basic mode: enter two probabilities between 0 and 1.',
        'For Binomial: enter n (trials), k (successes wanted), and p (probability of success per trial).',
        'For Perm/Comb: enter n (total items) and r (items chosen).',
        'Results appear instantly. Use "Export PDF" to save.',
      ]}
      formula={{
        expression: 'P(A∪B) = P(A)+P(B)−P(A)P(B)  |  Binomial: P(X=k) = C(n,k)×pᵏ×(1−p)ⁿ⁻ᵏ',
        variables: [
          { name: 'P(A)', desc: 'Probability of event A occurring (0 to 1)' },
          { name: 'n', desc: 'Number of independent trials in binomial distribution' },
          { name: 'k', desc: 'Number of successes we are calculating the probability for' },
          { name: 'p', desc: 'Probability of success on a single trial' },
          { name: 'C(n,k)', desc: 'Combination — number of ways to choose k items from n' },
        ],
        example: 'Flip a fair coin 10 times. P(exactly 3 heads): C(10,3)×0.5³×0.5⁷ = 120×0.125×0.0078 = 0.1172 (11.72%)',
        reference: 'Probability theory — Kolmogorov axioms; Blaise Pascal & Pierre de Fermat (1654)',
      }}
      resultsGuide={[
        { label: 'P(A or B)', explanation: 'The probability that at least one of two independent events occurs. For independent events: P(A∪B) = P(A) + P(B) − P(A)×P(B).' },
        { label: 'P(X = k) — Exact Binomial', explanation: 'The probability of getting exactly k successes in n independent trials. This is the "point" probability — often small for large n.' },
        { label: 'P(X ≤ k) — Cumulative Binomial', explanation: 'The probability of getting k or fewer successes. This is the cumulative distribution function (CDF) of the binomial distribution.' },
      ]}
      faqs={[
        { q: 'What is a probability calculator used for?', a: 'A probability calculator computes the likelihood of events occurring. It is used in statistics, gambling (casino odds), quality control (defect rates), medicine (clinical trials), and finance (risk analysis).' },
        { q: 'What is the difference between P(A or B) and P(A and B)?', a: 'P(A or B) is the probability that at least one event happens — always ≥ both individual probabilities. P(A and B) for independent events is their product — always ≤ both individual probabilities.' },
        { q: 'What is the binomial distribution?', a: 'The binomial distribution models the number of successes in n independent trials, each with the same probability p. For example: how many heads in 10 coin flips, or defective items in a batch.' },
        { q: 'What is the difference between permutations and combinations?', a: 'Permutations count ordered arrangements (order matters). Combinations count unordered selections (order doesn\'t matter). For r items from n: P(n,r) = n!/(n−r)! and C(n,r) = n!/[r!(n−r)!].' },
        { q: 'Do I need a signup?', a: 'No — all calculations run client-side in your browser with no account required.' },
        { q: 'How accurate are the results?', a: 'Results use standard double-precision floating-point arithmetic. For large factorials (n > 20), precision degrades due to overflow. For research-grade probability calculations, use R or Python.' },
        { q: 'Should I consult a statistician?', a: 'For clinical trials, actuarial calculations, or financial risk models, always consult a qualified statistician or actuary.' },
      ]}
      relatedTools={[
        { name: 'Z-Score Calculator', icon: 'Z', desc: 'Normal distribution percentiles', href: '/tools/calculators/z-score-calculator' },
        { name: 'Statistics Calculator', icon: '📈', desc: 'Correlation and regression', href: '/tools/calculators/statistics-calculator' },
        { name: 'Permutation/Combination', icon: 'nPr', desc: 'Count arrangements', href: '/tools/calculators/permutation-combination-calculator' },
        { name: 'Sample Size', icon: 'n', desc: 'Study sample sizing', href: '/tools/calculators/sample-size-calculator' },
      ]}
    >
      <Card>
        <SelectField label="Mode" value={mode} onChange={v => setMode(v as typeof mode)} options={[
          { value: 'basic',    label: 'Basic Probability (Independent Events)' },
          { value: 'binomial', label: 'Binomial Distribution' },
          { value: 'permcomb', label: 'Permutations & Combinations' },
        ]} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16, marginTop: 16 }}>
          {mode==='basic' && <>
            <InputField label="P(A) — probability of A" value={pA} onChange={setPA} min={0} max={1} step={0.01} placeholder="0.30" />
            <InputField label="P(B) — probability of B" value={pB} onChange={setPB} min={0} max={1} step={0.01} placeholder="0.50" />
          </>}
          {mode==='binomial' && <>
            <InputField label="n — number of trials" value={n} onChange={setN} min={1} max={50} step={1} placeholder="10" />
            <InputField label="k — successes wanted" value={k} onChange={setK} min={0} step={1} placeholder="3" />
            <InputField label="p — success probability" value={p} onChange={setP} min={0} max={1} step={0.01} placeholder="0.50" />
          </>}
          {mode==='permcomb' && <>
            <InputField label="n — total items" value={n} onChange={setN} min={0} max={20} step={1} placeholder="10" />
            <InputField label="r — items chosen" value={k} onChange={setK} min={0} max={20} step={1} placeholder="3" />
          </>}
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <button onClick={reset} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: 'var(--fg-3)', fontSize: 13, cursor: 'pointer' }}>↺ Reset</button>
          <button onClick={copy} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: copied?'#6ee7b7':'#888', fontSize: 13, cursor: 'pointer' }}>{copied?'✓ Copied':'📋 Copy'}</button>
        </div>
      </Card>

      <Card accent style={{ marginTop: 16 }}>
        {mode==='basic' && <>
          <ResultRow label="P(A or B) — independent" value={pAorB.toFixed(6)} highlight />
          <ResultRow label="P(A and B) — independent" value={pAandB.toFixed(6)} highlight />
          <ResultRow label="P(not A)" value={pNotA.toFixed(6)} />
          <ResultRow label="Odds of A" value={oddsA} />
        </>}
        {mode==='binomial' && binomExact!==null && <>
          <ResultRow label={`P(X = ${k})`} value={binomExact.toFixed(8)} highlight />
          <ResultRow label={`P(X ≤ ${k})`} value={binomCumul!.toFixed(8)} highlight />
          <ResultRow label="Mean (np)" value={(nn*pn).toFixed(4)} />
          <ResultRow label="Variance (np(1−p))" value={(nn*pn*(1-pn)).toFixed(4)} />
          <ResultRow label="Std Dev" value={Math.sqrt(nn*pn*(1-pn)).toFixed(4)} />
        </>}
        {mode==='permcomb' && permResult!==null && <>
          <ResultRow label={`P(${n},${k}) Permutations`} value={permResult.toFixed(0)} highlight />
          <ResultRow label={`C(${n},${k}) Combinations`} value={combResult!.toFixed(0)} highlight />
        </>}
        {mode==='binomial' && binomExact===null && (
          <div style={{ color: '#f87171', fontSize: 13 }}>⚠ Check inputs: k must be ≤ n, and p must be between 0 and 1.</div>
        )}
      </Card>
    </CalcShell>
  )
}
