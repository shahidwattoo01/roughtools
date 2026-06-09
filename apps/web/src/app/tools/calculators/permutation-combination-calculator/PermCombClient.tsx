'use client'
import { useState, useCallback } from 'react'
import CalcShell from '@/components/CalcShell'
import { Card, InputField, ResultRow } from '@/components/ui'
import { exportCalcPDF } from '@/lib/calcPdf'

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n) || n > 170) return NaN
  if (n === 0) return 1
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r
}
function perm(n: number, r: number) { return n < r ? 0 : factorial(n) / factorial(n - r) }
function comb(n: number, r: number) { return n < r ? 0 : factorial(n) / (factorial(r) * factorial(n - r)) }

export default function PermCombClient() {
  const [n, setN] = useState('10')
  const [r, setR] = useState('3')
  const [copied, setCopied] = useState(false)

  const nn = parseInt(n), rn = parseInt(r)
  const valid = !isNaN(nn) && !isNaN(rn) && nn >= 0 && rn >= 0 && nn >= rn && nn <= 20
  const P = valid ? perm(nn, rn) : null
  const C = valid ? comb(nn, rn) : null

  const reset = () => { setN('10'); setR('3') }
  const copy  = () => {
    if (!valid || P === null || C === null) return
    navigator.clipboard.writeText(`P(${nn},${rn}) = ${P.toLocaleString()}\nC(${nn},${rn}) = ${C.toLocaleString()}`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const handlePDF = useCallback(async () => {
    if (!valid || P === null || C === null) return
    await exportCalcPDF({
      toolName: 'Permutation & Combination Calculator',
      inputs: [{ label: 'n (total items)', value: n }, { label: 'r (items chosen)', value: r }],
      results: [
        { label: `P(${nn},${rn}) — Permutations`, value: P.toLocaleString(), highlight: true },
        { label: `C(${nn},${rn}) — Combinations`, value: C.toLocaleString(), highlight: true },
        { label: 'n!', value: factorial(nn).toLocaleString() },
        { label: 'r!', value: factorial(rn).toLocaleString() },
        { label: '(n−r)!', value: factorial(nn - rn).toLocaleString() },
        { label: 'P / C ratio (= r!)', value: (P / C).toFixed(0) },
      ],
      formula: 'P(n,r) = n!/(n−r)!  |  C(n,r) = n!/[r!(n−r)!]  |  C = P/r!',
    })
  }, [n, r, nn, rn, P, C, valid])

  return (
    <CalcShell
      title="Permutation Combination Calculator — P(n,r) & C(n,r)"
      description="Calculate permutations P(n,r) and combinations C(n,r) for any n and r up to 20. Shows the factorial breakdown, the ratio between them, and a reference table from 0! to 15!. Used in probability, statistics, combinatorics and competitive mathematics."
      icon="nPr"
      badge="Mathematically accurate"
      onExportPDF={handlePDF}
      howToUse={[
        'Enter n — the total number of items in the set (up to 20).',
        'Enter r — the number of items to choose or arrange.',
        'Permutations P(n,r) and combinations C(n,r) appear instantly.',
        'r must be ≤ n. Both must be non-negative integers.',
        'Export a PDF with the complete factorial breakdown.',
      ]}
      formula={{
        expression: 'P(n,r) = n! / (n−r)!  |  C(n,r) = n! / [r! × (n−r)!]  |  C(n,r) = P(n,r) / r!',
        variables: [
          { name: 'n', desc: 'Total number of items in the full set' },
          { name: 'r', desc: 'Number of items selected from the set' },
          { name: 'P(n,r)', desc: 'Permutation — ordered arrangements of r items from n (order matters)' },
          { name: 'C(n,r)', desc: 'Combination — unordered selections of r items from n (order doesn\'t matter)' },
          { name: 'n!', desc: 'Factorial — n! = 1×2×3×…×n (n=0: 0!=1 by convention)' },
        ],
        example: 'Choose 3 from 10: P(10,3) = 10×9×8 = 720 ordered arrangements. C(10,3) = 720/6 = 120 unordered groups.',
        reference: 'Blaise Pascal (1654) — Pascal\'s triangle; Leibniz (1666) — combinatorics; NIST Handbook §26',
      }}
      resultsGuide={[
        { label: 'Permutations P(n,r)', explanation: 'The number of ways to arrange r items chosen from n items WHERE ORDER MATTERS. Picking gold-silver-bronze from 10 athletes: 10×9×8 = 720. Different order = different result.' },
        { label: 'Combinations C(n,r)', explanation: 'The number of ways to select r items from n items WHERE ORDER DOES NOT MATTER. Choosing a 3-person committee from 10: C(10,3) = 120. Same people in any order = same result.' },
        { label: 'P / C Ratio', explanation: 'P(n,r) / C(n,r) = r! This makes sense: for each combination, there are r! ways to arrange the same items (which is what permutations count).' },
      ]}
      faqs={[
        { q: 'What is the difference between permutation and combination?', a: 'Permutation counts ordered arrangements (order matters): choosing president, VP, and treasurer from 10 people. Combination counts unordered groups (order doesn\'t matter): choosing a 3-person committee. P(n,r) = r! × C(n,r).' },
        { q: 'What does "n choose r" mean?', a: '"n choose r" refers to combinations: C(n,r) = n!/[r!(n−r)!]. It appears as the binomial coefficient (n r) in Pascal\'s triangle and the binomial theorem: (a+b)ⁿ = Σ C(n,k) aᵏ bⁿ⁻ᵏ.' },
        { q: 'Why is 0! equal to 1?', a: '0! = 1 by mathematical convention. It is required for the formulas to work: C(n,n) = n!/[n!×0!] = 1 (there is exactly one way to choose all n items). It also follows from the gamma function definition.' },
        { q: 'What is the lottery example?', a: 'A 6/49 lottery: choose 6 from 49 in any order. C(49,6) = 13,983,816 — about 1 in 14 million. If order mattered (permutation): P(49,6) = 10,068,347,520 — one in ten billion.' },
        { q: 'Why is n limited to 20?', a: '20! ≈ 2.43×10¹⁸, which approaches the limit of JavaScript\'s 64-bit floating-point precision. Values beyond 20 introduce rounding errors. For large n, use logarithms of factorials: log n! = Σ log k.' },
        { q: 'Do I need a signup?', a: 'No — all calculations run in your browser with no account required.' },
        { q: 'What are real-world uses of combinations?', a: 'Combinations are used in: probability (card hands), genetics (gene combinations), chemistry (molecular formulas), cryptography (key spaces), statistics (sampling), and software testing (test case selection).' },
      ]}
      relatedTools={[
        { name: 'Probability Calculator', icon: '🎯', desc: 'Binomial and event probability', href: '/tools/calculators/probability-calculator' },
        { name: 'Number Sequence', icon: '∑', desc: 'Arithmetic and geometric series', href: '/tools/calculators/number-sequence-calculator' },
        { name: 'Sample Size', icon: 'n', desc: 'Statistical sample sizing', href: '/tools/calculators/sample-size-calculator' },
        { name: 'Exponent Calculator', icon: 'xⁿ', desc: 'Powers and factorials', href: '/tools/calculators/exponent-calculator' },
      ]}
    >
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <InputField label="n — total items" value={n} onChange={setN} min={0} max={20} step={1} placeholder="10" />
          <InputField label="r — items chosen" value={r} onChange={setR} min={0} max={20} step={1} placeholder="3" />
        </div>
        {nn > 20 && <div style={{ marginTop: 8, color: '#f87171', fontSize: 13 }}>⚠ Maximum n is 20 to prevent floating-point overflow.</div>}
        {!isNaN(nn) && !isNaN(rn) && rn > nn && nn <= 20 && <div style={{ marginTop: 8, color: '#f87171', fontSize: 13 }}>⚠ r cannot be greater than n.</div>}
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <button onClick={reset} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: 'var(--fg-3)', fontSize: 13, cursor: 'pointer' }}>↺ Reset</button>
          {valid && <button onClick={copy} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: copied ? '#6ee7b7' : '#888', fontSize: 13, cursor: 'pointer' }}>{copied ? '✓ Copied' : '📋 Copy'}</button>}
        </div>
      </Card>

      {valid && P !== null && C !== null ? (
        <Card accent style={{ marginTop: 16 }}>
          <div style={{ textAlign: 'center', padding: '16px 0 12px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#c4b5fd', letterSpacing: -0.5 }}>P({nn},{rn}) = {P.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 4 }}>Permutations — ordered arrangements (order matters)</div>
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />
          <div style={{ textAlign: 'center', padding: '12px 0 16px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#a78bfa', letterSpacing: -0.5 }}>C({nn},{rn}) = {C.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 4 }}>Combinations — unordered selections (order doesn't matter)</div>
          </div>
          <ResultRow label="n!" value={factorial(nn).toLocaleString()} />
          <ResultRow label="r!" value={factorial(rn).toLocaleString()} />
          <ResultRow label="(n−r)!" value={factorial(nn - rn).toLocaleString()} />
          <ResultRow label="P / C ratio (= r!)" value={(P / C).toFixed(0)} />
        </Card>
      ) : (
        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter valid n and r above (r ≤ n ≤ 20).
        </div>
      )}

      <Card style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Factorial Reference (0! to 15!)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: 6 }}>
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: 12, color: '#c4b5fd', background: 'rgba(139,92,246,0.08)', borderRadius: 6, padding: '4px 8px' }}>
              {i}! = {factorial(i).toLocaleString()}
            </div>
          ))}
        </div>
      </Card>
    </CalcShell>
  )
}
