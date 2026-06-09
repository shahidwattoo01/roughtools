'use client'
import { useState, useCallback } from 'react'
import CalcShell from '@/components/CalcShell'
import { Card, InputField, ResultRow } from '@/components/ui'
import { exportCalcPDF } from '@/lib/calcPdf'

export default function QuadraticCalculatorClient() {
  const [a, setA] = useState('1')
  const [b, setB] = useState('-5')
  const [c, setC] = useState('6')
  const [copied, setCopied] = useState(false)

  const an = parseFloat(a)||0, bn = parseFloat(b)||0, cn = parseFloat(c)||0
  const disc = bn*bn - 4*an*cn
  const vertex = an !== 0 ? { x: -bn/(2*an), y: cn - bn*bn/(4*an) } : null
  const axisX  = an !== 0 ? -bn/(2*an) : null
  const r1 = disc>=0 && an!==0 ? (-bn+Math.sqrt(disc))/(2*an) : null
  const r2 = disc>=0 && an!==0 ? (-bn-Math.sqrt(disc))/(2*an) : null
  const realPart    = disc<0 && an!==0 ? -bn/(2*an) : null
  const complexPart = disc<0 && an!==0 ? Math.sqrt(-disc)/(2*an) : null

  const copy = () => {
    const txt = r1 !== null ? `x₁ = ${r1.toFixed(6)}, x₂ = ${r2?.toFixed(6)}` : `No real roots (discriminant = ${disc.toFixed(4)})`
    navigator.clipboard.writeText(txt)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const reset = () => { setA('1'); setB('-5'); setC('6') }

  const handlePDF = useCallback(async () => {
    await exportCalcPDF({
      toolName: 'Quadratic Formula Calculator',
      inputs: [{ label: 'a', value: a }, { label: 'b', value: b }, { label: 'c', value: c }, { label: 'Equation', value: `${a}x² + ${b}x + ${c} = 0` }],
      results: [
        { label: 'Discriminant (Δ)', value: disc.toFixed(6), highlight: true },
        { label: 'Nature of roots', value: disc > 0 ? 'Two distinct real roots' : disc === 0 ? 'One repeated real root' : 'Two complex conjugate roots' },
        ...(r1 !== null ? [{ label: 'Root x₁', value: r1.toFixed(8), highlight: true }, { label: 'Root x₂', value: r2!.toFixed(8), highlight: true }] : []),
        ...(realPart !== null ? [{ label: 'Root x₁', value: `${realPart.toFixed(4)} + ${complexPart!.toFixed(4)}i`, highlight: true }, { label: 'Root x₂', value: `${realPart.toFixed(4)} − ${complexPart!.toFixed(4)}i`, highlight: true }] : []),
        ...(vertex ? [{ label: 'Vertex', value: `(${vertex.x.toFixed(4)}, ${vertex.y.toFixed(4)})` }, { label: 'Axis of Symmetry', value: `x = ${axisX!.toFixed(4)}` }] : []),
      ],
      formula: 'x = (−b ± √(b²−4ac)) / 2a  |  Discriminant Δ = b²−4ac  |  Δ>0: two real roots | Δ=0: one double root | Δ<0: complex roots',
    })
  }, [a, b, c, disc, r1, r2, vertex, axisX, realPart, complexPart])

  return (
    <CalcShell
      title="Quadratic Formula Calculator — Solve ax²+bx+c=0"
      description="Solve any quadratic equation of the form ax²+bx+c = 0 instantly. Enter coefficients a, b and c to find real or complex roots, the discriminant, vertex, and axis of symmetry. Ideal for algebra students, engineers and physicists solving polynomial equations."
      icon="ax²"
      badge="Mathematically accurate"
      onExportPDF={handlePDF}
      howToUse={[
        'Enter the coefficient "a" (the number multiplying x²). Must not be zero.',
        'Enter coefficient "b" (the number multiplying x). Can be negative.',
        'Enter coefficient "c" (the constant term). Can be zero.',
        'Roots, discriminant, vertex and axis of symmetry appear instantly.',
        'Export a PDF report with your full solution.',
      ]}
      formula={{
        expression: 'x = (−b ± √(b² − 4ac)) / 2a',
        variables: [
          { name: 'a', desc: 'Coefficient of x² — determines parabola direction (a>0 opens up, a<0 opens down)' },
          { name: 'b', desc: 'Coefficient of x' },
          { name: 'c', desc: 'Constant term' },
          { name: 'Δ = b²−4ac', desc: 'Discriminant: Δ>0 → 2 real roots; Δ=0 → 1 repeated root; Δ<0 → complex roots' },
        ],
        example: 'x² − 5x + 6 = 0: Δ = 25−24 = 1 > 0. x = (5 ± 1)/2 → x₁ = 3, x₂ = 2. Check: (x−3)(x−2) = x²−5x+6 ✓',
        reference: 'Elementary algebra — Al-Khwarizmi (9th century); modern form from Vieta\'s Formulas',
      }}
      resultsGuide={[
        { label: 'Discriminant (Δ)', explanation: 'Determines the nature of roots without computing them. Positive → 2 real roots. Zero → 1 double root. Negative → 2 complex conjugate roots.' },
        { label: 'Vertex', explanation: 'The turning point of the parabola y = ax²+bx+c. Located at x = −b/(2a), y = c − b²/(4a). The minimum point if a>0, maximum if a<0.' },
        { label: 'Axis of Symmetry', explanation: 'The vertical line x = −b/(2a) that divides the parabola into mirror halves. Both roots are equidistant from this line.' },
      ]}
      faqs={[
        { q: 'What is the quadratic formula used for?', a: 'The quadratic formula solves any quadratic equation ax²+bx+c=0 for x, finding where the parabola y=ax²+bx+c crosses the x-axis. It is used in physics (projectile motion), engineering (structural analysis), and economics (profit maximization).' },
        { q: 'What does the discriminant tell me?', a: 'The discriminant Δ=b²−4ac tells you how many real solutions exist before you calculate them: Δ>0 means two distinct real roots, Δ=0 means one repeated root, Δ<0 means no real roots (two complex conjugates).' },
        { q: 'What are complex roots?', a: 'When Δ<0, the square root of a negative number appears. The roots are complex numbers of the form p ± qi, where p = −b/(2a) and q = √(−Δ)/(2a). They always appear as conjugate pairs.' },
        { q: 'How do I check my answers?', a: 'Substitute each root back into the original equation. If ax²+bx+c = 0, the answer is correct. Alternatively, by Vieta\'s formulas: x₁+x₂ = −b/a and x₁×x₂ = c/a.' },
        { q: 'Do I need a signup to use this?', a: 'No. The calculator runs entirely in your browser — no data is stored or transmitted.' },
        { q: 'How accurate are the results?', a: 'Results use 64-bit floating-point arithmetic, providing 15–17 significant digits. For educational and engineering purposes this is more than sufficient.' },
        { q: 'Should I consult a professional for engineering calculations?', a: 'For structural, electrical, or control system design where polynomial roots are critical, always verify computations with a licensed engineer.' },
      ]}
      relatedTools={[
        { name: 'Scientific Calculator', icon: '🔬', desc: 'Full math calculator', href: '/tools/calculators/scientific-calculator' },
        { name: 'Slope Calculator', icon: '📏', desc: 'Line equations and slope', href: '/tools/calculators/slope-calculator' },
        { name: 'Log Calculator', icon: 'log', desc: 'Logarithms in any base', href: '/tools/calculators/log-calculator' },
        { name: 'Exponent Calculator', icon: 'xⁿ', desc: 'Powers and roots', href: '/tools/calculators/exponent-calculator' },
        { name: 'Triangle Calculator', icon: '△', desc: 'Solve any triangle', href: '/tools/calculators/triangle-calculator' },
      ]}
    >
      <Card>
        <div style={{ textAlign: 'center', fontFamily: 'serif', fontSize: 18, color: '#c4b5fd', marginBottom: 16 }}>
          {an||'a'}x² {bn>=0?'+':''}{bn||'b'}x {cn>=0?'+':''}{cn||'c'} = 0
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <InputField label="a — coefficient of x²" value={a} onChange={setA} placeholder="1" />
          <InputField label="b — coefficient of x" value={b} onChange={setB} placeholder="-5" />
          <InputField label="c — constant" value={c} onChange={setC} placeholder="6" />
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <button onClick={reset} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: 'var(--fg-3)', fontSize: 13, cursor: 'pointer' }}>↺ Reset</button>
          <button onClick={copy} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--line-strong)', background: 'none', color: copied?'#6ee7b7':'#888', fontSize: 13, cursor: 'pointer' }}>{copied?'✓ Copied':'📋 Copy'}</button>
        </div>
      </Card>

      {an === 0 ? (
        <div style={{ marginTop: 12, color: '#f87171', fontSize: 13 }}>⚠ Coefficient "a" cannot be zero — that would make it a linear equation, not quadratic.</div>
      ) : (
        <Card accent style={{ marginTop: 16 }}>
          <ResultRow label="Discriminant (Δ = b²−4ac)" value={disc.toFixed(6)} highlight />
          {vertex && <ResultRow label="Axis of Symmetry" value={`x = ${axisX!.toFixed(6)}`} />}
          {vertex && <ResultRow label="Vertex" value={`(${vertex.x.toFixed(4)}, ${vertex.y.toFixed(4)})`} />}

          {disc > 0 && r1 !== null && r2 !== null && (
            <>
              <ResultRow label="Root x₁" value={r1.toFixed(8)} highlight />
              <ResultRow label="Root x₂" value={r2.toFixed(8)} highlight />
              <ResultRow label="Sum of roots (−b/a)" value={(-bn/an).toFixed(6)} />
              <ResultRow label="Product of roots (c/a)" value={(cn/an).toFixed(6)} />
              <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8, fontSize: 13, color: '#6ee7b7' }}>
                ✓ Two distinct real roots (Δ &gt; 0)
              </div>
            </>
          )}
          {disc === 0 && r1 !== null && (
            <>
              <ResultRow label="Double Root x" value={r1.toFixed(8)} highlight />
              <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, fontSize: 13, color: '#93c5fd' }}>
                ℹ One repeated real root (Δ = 0)
              </div>
            </>
          )}
          {disc < 0 && realPart !== null && complexPart !== null && (
            <>
              <ResultRow label="Root x₁" value={`${realPart.toFixed(4)} + ${complexPart.toFixed(4)}i`} highlight />
              <ResultRow label="Root x₂" value={`${realPart.toFixed(4)} − ${complexPart.toFixed(4)}i`} highlight />
              <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, fontSize: 13, color: '#fcd34d' }}>
                ⚠ No real roots — two complex conjugates (Δ &lt; 0)
              </div>
            </>
          )}
        </Card>
      )}
    </CalcShell>
  )
}
