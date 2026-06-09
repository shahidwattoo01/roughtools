'use client'
import { useState, useMemo, useCallback } from 'react'
import CalcShell from '@/components/CalcShell'
import { Card, InputField, ResultRow, SelectField } from '@/components/ui'
import { exportCalcPDF } from '@/lib/calcPdf'

function arithmetic(start: number, d: number, n: number) { return Array.from({ length: n }, (_, i) => start + i * d) }
function geometric(start: number, r: number, n: number) { return Array.from({ length: n }, (_, i) => start * Math.pow(r, i)) }
function fibonacci(n: number) { const s=[1,1]; for(let i=2;i<n;i++) s.push(s[i-1]+s[i-2]); return s.slice(0,n) }
function primes(count: number) {
  const isPrime=(n:number)=>{if(n<2)return false;for(let i=2;i<=Math.sqrt(n);i++)if(n%i===0)return false;return true}
  const r:number[]=[]; let n=2; while(r.length<count){if(isPrime(n))r.push(n);n++}; return r
}
function squares(n: number) { return Array.from({ length: n }, (_, i) => (i+1)**2) }
function triangular(n: number) { return Array.from({ length: n }, (_, i) => (i+1)*(i+2)/2) }
function factSeq(n: number) {
  const r=[1]; for(let i=1;i<n;i++) r.push(r[i-1]*i); return r
}

const SEQUENCE_TYPES = [
  { value: 'arithmetic',  label: 'Arithmetic Sequence' },
  { value: 'geometric',   label: 'Geometric Sequence' },
  { value: 'fibonacci',   label: 'Fibonacci Sequence' },
  { value: 'primes',      label: 'Prime Numbers' },
  { value: 'squares',     label: 'Perfect Squares' },
  { value: 'triangular',  label: 'Triangular Numbers' },
  { value: 'factorial',   label: 'Factorial Sequence' },
]

export default function NumberSequenceClient() {
  const [type, setType] = useState('arithmetic')
  const [start, setStart] = useState('1')
  const [step, setStep] = useState('3')
  const [count, setCount] = useState('15')
  const [copied, setCopied] = useState(false)

  const n  = Math.min(Math.max(1, parseInt(count)||15), 50)
  const sn = parseFloat(start)||1
  const dn = parseFloat(step)||3

  const seq = useMemo(() => {
    switch (type) {
      case 'arithmetic':  return arithmetic(sn, dn, n)
      case 'geometric':   return geometric(sn, dn, n)
      case 'fibonacci':   return fibonacci(n)
      case 'primes':      return primes(n)
      case 'squares':     return squares(n)
      case 'triangular':  return triangular(n)
      case 'factorial':   return factSeq(n)
      default:            return []
    }
  }, [type, sn, dn, n])

  const needsParams = ['arithmetic', 'geometric'].includes(type)
  const stepLabel   = type === 'geometric' ? 'Common Ratio (r)' : 'Common Difference (d)'
  const sum  = seq.reduce((a, b) => a + b, 0)
  const nth  = type === 'arithmetic' ? `a(n) = ${sn} + (n−1)×${dn}`
             : type === 'geometric'  ? `a(n) = ${sn} × ${dn}^(n−1)`
             : type === 'fibonacci'  ? 'F(n) = F(n−1) + F(n−2), F(1)=F(2)=1'
             : ''

  const reset = () => { setType('arithmetic'); setStart('1'); setStep('3'); setCount('15') }
  const copy  = () => {
    navigator.clipboard.writeText(seq.join(', '))
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const handlePDF = useCallback(async () => {
    await exportCalcPDF({
      toolName: 'Number Sequence Calculator',
      inputs: [
        { label: 'Sequence Type', value: SEQUENCE_TYPES.find(t => t.value === type)?.label ?? type },
        ...(needsParams ? [{ label: 'First Term (a₁)', value: start }, { label: stepLabel, value: step }] : []),
        { label: 'Count', value: count },
      ],
      results: [
        { label: 'Sequence', value: seq.join(', '), highlight: true },
        { label: 'Sum', value: sum.toFixed(4), highlight: true },
        { label: 'Terms', value: String(seq.length) },
        ...(nth ? [{ label: 'nth Term Formula', value: nth }] : []),
      ],
      formula: nth || 'Depends on sequence type.',
    })
  }, [type, start, step, count, seq, sum, nth, needsParams, stepLabel])

  return (
    <CalcShell
      title="Number Sequence Calculator — Arithmetic, Fibonacci & More"
      description="Generate number sequences including arithmetic progressions, geometric series, Fibonacci, prime numbers, perfect squares, triangular numbers, and factorial sequences. Shows the nth term formula and sum. Used in mathematics education, coding interviews and data analysis."
      icon="∑"
      badge="Mathematically accurate"
      onExportPDF={handlePDF}
      howToUse={[
        'Select the sequence type from the dropdown.',
        'For arithmetic/geometric sequences, set the first term and common difference/ratio.',
        'Set how many terms to generate (up to 50).',
        'The full sequence, sum, and nth-term formula appear instantly.',
        'Copy the sequence or export a PDF report.',
      ]}
      formula={{
        expression: 'Arithmetic: a(n) = a₁ + (n−1)d  |  Geometric: a(n) = a₁ × rⁿ⁻¹  |  Fibonacci: F(n) = F(n−1) + F(n−2)',
        variables: [
          { name: 'a₁', desc: 'First term of the sequence' },
          { name: 'd', desc: 'Common difference (arithmetic) — added between each term' },
          { name: 'r', desc: 'Common ratio (geometric) — multiplied between each term' },
          { name: 'n', desc: 'Term number (1-based index)' },
        ],
        example: 'Arithmetic: a₁=1, d=3, n=5 → 1, 4, 7, 10, 13. Sum = n/2×(2a₁+(n−1)d) = 5/2×(2+12) = 35.',
        reference: 'Carl Friedrich Gauss — arithmetic series; Leonardo of Pisa "Fibonacci" (1202)',
      }}
      resultsGuide={[
        { label: 'Sum', explanation: 'The total of all terms in the sequence. For an arithmetic series: S = n/2 × (first + last). For a geometric series: S = a₁(rⁿ−1)/(r−1).' },
        { label: 'nth Term Formula', explanation: 'A formula expressing any term in the sequence by its index n. Allows calculating the 100th term without listing the first 99.' },
      ]}
      faqs={[
        { q: 'What is an arithmetic sequence?', a: 'An arithmetic sequence has a constant difference between consecutive terms. Example: 1, 4, 7, 10, 13 (difference = 3). The nth term is a₁ + (n−1)×d.' },
        { q: 'What is a geometric sequence?', a: 'A geometric sequence has a constant ratio between consecutive terms. Example: 2, 6, 18, 54 (ratio = 3). The nth term is a₁ × rⁿ⁻¹.' },
        { q: 'What is the Fibonacci sequence?', a: 'Each term is the sum of the two before it: 1, 1, 2, 3, 5, 8, 13, 21, 34… It appears in nature (spiral patterns, golden ratio), art, and computer algorithms.' },
        { q: 'Why are prime numbers important?', a: 'Primes are the building blocks of all integers (fundamental theorem of arithmetic). They are critical in cryptography (RSA encryption), hash functions, and number theory.' },
        { q: 'What are triangular numbers?', a: 'Triangular numbers count objects that can form equilateral triangles: 1, 3, 6, 10, 15, 21… The nth triangular number = n(n+1)/2. They appear in combinatorics (handshake problem).' },
        { q: 'Do I need a signup?', a: 'No — all sequences are generated instantly in your browser with no account required.' },
        { q: 'What is the maximum sequence length?', a: 'Up to 50 terms per generation. Factorial values can overflow standard 64-bit floats above 170!. For very large sequences, use a computer algebra system.' },
      ]}
      relatedTools={[
        { name: 'Statistics Calculator', icon: '📈', desc: 'Mean, SD, correlation', href: '/tools/calculators/statistics-calculator' },
        { name: 'Probability Calculator', icon: '🎯', desc: 'Binomial and event probability', href: '/tools/calculators/probability-calculator' },
        { name: 'Permutation/Combination', icon: 'nPr', desc: 'Counting arrangements', href: '/tools/calculators/permutation-combination-calculator' },
        { name: 'Exponent Calculator', icon: 'xⁿ', desc: 'Powers and roots', href: '/tools/calculators/exponent-calculator' },
      ]}
    >
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 16 }}>
          <SelectField label="Sequence Type" value={type} onChange={setType} options={SEQUENCE_TYPES} />
          {needsParams && <>
            <InputField label="First Term (a₁)" value={start} onChange={setStart} step={0.001} placeholder="1" />
            <InputField label={stepLabel} value={step} onChange={setStep} step={0.001} placeholder="3" />
          </>}
          <InputField label="Count (max 50)" value={count} onChange={setCount} min={1} max={50} step={1} placeholder="15" />
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <button onClick={reset} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: 'var(--fg-3)', fontSize: 13, cursor: 'pointer' }}>↺ Reset</button>
          {seq.length > 0 && <button onClick={copy} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: copied ? '#6ee7b7' : '#888', fontSize: 13, cursor: 'pointer' }}>{copied ? '✓ Copied' : '📋 Copy'}</button>}
        </div>
      </Card>

      <Card accent style={{ marginTop: 16 }}>
        <ResultRow label="Terms Generated" value={String(seq.length)} />
        <ResultRow label="Sum" value={sum.toFixed(4)} highlight />
        {nth && <ResultRow label="nth Term Formula" value={nth} highlight />}
        {type === 'arithmetic' && n > 1 && (
          <ResultRow label={`Sum Formula S(n)`} value={`n/2 × (2a₁ + (n−1)d) = ${(n/2*(2*sn+(n-1)*dn)).toFixed(4)}`} />
        )}
        <ResultRow label="First Term" value={String(seq[0] ?? '—')} />
        <ResultRow label="Last Term" value={String(seq[seq.length-1] ?? '—')} />
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Sequence</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px,1fr))', gap: 6 }}>
          {seq.map((val, i) => (
            <div key={i} style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
              <div style={{ color: 'var(--fg-3)', fontSize: 10 }}>n={i+1}</div>
              <div style={{ color: '#c4b5fd', fontFamily: 'monospace', fontWeight: 600, fontSize: 12 }}>
                {isNaN(val) ? '∞' : val.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </CalcShell>
  )
}
