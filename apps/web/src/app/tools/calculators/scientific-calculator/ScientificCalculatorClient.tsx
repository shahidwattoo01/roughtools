'use client'
import { useState, useCallback } from 'react'
import CalcShell from '@/components/CalcShell'
import { exportCalcPDF } from '@/lib/calcPdf'

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN
  if (n <= 1) return 1
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r
}

const BASE: React.CSSProperties = {
  padding: '12px 4px', borderRadius: 8, border: '1px solid var(--line-strong)',
  background: 'rgba(255,255,255,0.05)', color: 'var(--fg)', fontSize: 13,
  fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s',
}
const OP: React.CSSProperties  = { ...BASE, background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd' }
const EQ: React.CSSProperties  = { ...BASE, background: 'rgba(139,92,246,0.7)', border: '1px solid rgba(139,92,246,0.8)', color: '#fff' }
const CLR: React.CSSProperties = { ...BASE, color: '#f87171' }

export default function ScientificCalculatorClient() {
  const [display, setDisplay] = useState('0')
  const [expr,    setExpr]    = useState('')
  const [mode,    setMode]    = useState<'deg'|'rad'>('deg')
  const [mem,     setMem]     = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const [justCalc, setJC]     = useState(false)
  const [error,   setError]   = useState(false)

  const toRad = (x: number) => mode === 'deg' ? x * Math.PI / 180 : x

  const pushHistory = (entry: string) => setHistory(prev => [entry, ...prev.slice(0, 19)])

  const num = (d: string) => {
    setError(false)
    if (justCalc) { setDisplay(d); setExpr(''); setJC(false); return }
    setDisplay(prev => prev === '0' ? d : prev + d)
  }
  const dot = () => {
    if (justCalc) { setDisplay('0.'); setExpr(''); setJC(false); return }
    if (!display.includes('.')) setDisplay(p => p + '.')
  }
  const op = (o: string) => { setExpr(display + ' ' + o + ' '); setDisplay('0'); setJC(false); setError(false) }

  const eq = () => {
    if (!expr) return
    const parts = expr.trim().split(' ')
    const a = parseFloat(parts[0]), o = parts[1], b = parseFloat(display)
    let res: number
    switch (o) {
      case '+': res = a + b; break; case '−': res = a - b; break
      case '×': res = a * b; break; case '÷': res = b !== 0 ? a / b : NaN; break
      case 'xʸ': res = Math.pow(a, b); break; case 'ʸ√x': res = Math.pow(a, 1/b); break
      case 'mod': res = a % b; break; default: res = b
    }
    const out = isNaN(res) ? 'Error' : String(parseFloat(res.toFixed(10)))
    pushHistory(`${expr}${display} = ${out}`)
    setDisplay(out); setExpr(''); setJC(true)
    setError(isNaN(res))
  }

  const unary = (fn: string) => {
    const x = parseFloat(display)
    let res: number
    switch (fn) {
      case 'sin': res = Math.sin(toRad(x)); break; case 'cos': res = Math.cos(toRad(x)); break
      case 'tan': res = Math.tan(toRad(x)); break; case 'asin': res = mode === 'deg' ? Math.asin(x)*180/Math.PI : Math.asin(x); break
      case 'acos': res = mode === 'deg' ? Math.acos(x)*180/Math.PI : Math.acos(x); break
      case 'atan': res = mode === 'deg' ? Math.atan(x)*180/Math.PI : Math.atan(x); break
      case 'log': res = Math.log10(x); break; case 'ln': res = Math.log(x); break
      case 'eˣ': res = Math.exp(x); break; case '10ˣ': res = Math.pow(10,x); break
      case '√': res = Math.sqrt(x); break; case 'x²': res = x*x; break
      case 'x³': res = x*x*x; break; case '1/x': res = 1/x; break
      case 'n!': res = factorial(x); break; case '±': res = -x; break
      case '%': res = x/100; break; case 'abs': res = Math.abs(x); break
      default: res = x
    }
    const out = isNaN(res) || !isFinite(res) ? 'Error' : String(parseFloat(res.toFixed(10)))
    pushHistory(`${fn}(${x}) = ${out}`)
    setDisplay(out); setJC(true); setError(out === 'Error')
  }

  const clear = () => { setDisplay('0'); setExpr(''); setJC(false); setError(false) }
  const del   = () => {
    if (justCalc) { setDisplay('0'); setJC(false); return }
    setDisplay(p => p.length > 1 ? p.slice(0,-1) : '0')
  }
  const const_ = (val: number) => { setDisplay(String(val)); setJC(false) }

  const handlePDF = useCallback(async () => {
    await exportCalcPDF({
      toolName: 'Scientific Calculator',
      inputs:  [{ label: 'Last Expression', value: history[0]?.split('=')[0]?.trim() || display }],
      results: history.slice(0, 10).map((h, i) => ({ label: `Calculation ${i+1}`, value: h })),
    })
  }, [history, display])

  type BtnDef = { label: string; action: () => void; style?: React.CSSProperties }
  const rows: BtnDef[][] = [
    [
      { label: 'sin',  action: () => unary('sin'),  style: OP },
      { label: 'cos',  action: () => unary('cos'),  style: OP },
      { label: 'tan',  action: () => unary('tan'),  style: OP },
      { label: mode === 'deg' ? 'DEG' : 'RAD', action: () => setMode(m => m==='deg'?'rad':'deg'), style: { ...BASE, color: '#facc15' } },
    ],
    [
      { label: 'asin', action: () => unary('asin'), style: OP },
      { label: 'acos', action: () => unary('acos'), style: OP },
      { label: 'atan', action: () => unary('atan'), style: OP },
      { label: 'π',    action: () => const_(Math.PI), style: OP },
    ],
    [
      { label: 'log',  action: () => unary('log'),  style: OP },
      { label: 'ln',   action: () => unary('ln'),   style: OP },
      { label: 'eˣ',   action: () => unary('eˣ'),   style: OP },
      { label: 'e',    action: () => const_(Math.E), style: OP },
    ],
    [
      { label: 'x²',  action: () => unary('x²'),   style: OP },
      { label: 'x³',  action: () => unary('x³'),   style: OP },
      { label: '√',   action: () => unary('√'),    style: OP },
      { label: 'xʸ',  action: () => op('xʸ'),      style: OP },
    ],
    [
      { label: '1/x', action: () => unary('1/x'),  style: OP },
      { label: 'n!',  action: () => unary('n!'),   style: OP },
      { label: 'abs', action: () => unary('abs'),  style: OP },
      { label: '%',   action: () => unary('%'),    style: OP },
    ],
    [
      { label: 'MC',  action: () => setMem(0),               style: BASE },
      { label: 'MR',  action: () => setDisplay(String(mem)),  style: BASE },
      { label: 'M+',  action: () => setMem(m => m + parseFloat(display)), style: BASE },
      { label: 'M−',  action: () => setMem(m => m - parseFloat(display)), style: BASE },
    ],
    [
      { label: 'AC',  action: clear,               style: CLR },
      { label: '⌫',   action: del,                 style: BASE },
      { label: '±',   action: () => unary('±'),    style: BASE },
      { label: '÷',   action: () => op('÷'),       style: OP },
    ],
    [
      { label: '7', action: () => num('7') }, { label: '8', action: () => num('8') },
      { label: '9', action: () => num('9') }, { label: '×', action: () => op('×'), style: OP },
    ],
    [
      { label: '4', action: () => num('4') }, { label: '5', action: () => num('5') },
      { label: '6', action: () => num('6') }, { label: '−', action: () => op('−'), style: OP },
    ],
    [
      { label: '1', action: () => num('1') }, { label: '2', action: () => num('2') },
      { label: '3', action: () => num('3') }, { label: '+', action: () => op('+'), style: OP },
    ],
    [
      { label: '0',   action: () => num('0') },
      { label: '.',   action: dot },
      { label: 'mod', action: () => op('mod'), style: BASE },
      { label: '=',   action: eq,              style: EQ },
    ],
  ]

  return (
    <CalcShell
      title="Scientific Calculator — Full Trig, Log & Memory"
      description="A full-featured scientific calculator supporting trigonometry (sin, cos, tan, inverses), logarithms (log, ln), exponents, factorials, and memory functions. Switch between Degree and Radian mode. All calculations run in your browser with no data sent to any server."
      icon="🔬"
      badge="Mathematically accurate"
      onExportPDF={handlePDF}
      howToUse={[
        'Enter a number using the digit buttons or your keyboard.',
        'For binary operations (add, subtract, etc.), press an operator key, enter the second number, then press "=".',
        'For functions like sin, cos, log — enter the number first, then press the function button.',
        'Toggle DEG/RAD to switch between degree and radian mode for trig functions.',
        'Use M+, M−, MR, MC to store and recall values from memory.',
        'Press AC to clear everything, or ⌫ to delete the last digit.',
      ]}
      formula={{
        expression: 'sin(x), cos(x), tan(x) | log(x) = log₁₀(x) | ln(x) = logₑ(x) | n! = n×(n-1)×…×1',
        variables: [
          { name: 'DEG', desc: 'Angles measured in degrees (0–360°). Default mode.' },
          { name: 'RAD', desc: 'Angles measured in radians (0–2π). Switch with DEG/RAD button.' },
          { name: 'M',   desc: 'Memory register — stores one number independently of the display.' },
          { name: 'mod', desc: 'Modulo — the remainder after division of a by b.' },
        ],
        example: 'sin(30°) = 0.5 | cos(60°) = 0.5 | log(100) = 2 | ln(e) = 1 | 5! = 120',
        reference: 'IEEE 754 floating-point arithmetic — standard precision for scientific computing',
      }}
      faqs={[
        { q: 'What is a scientific calculator used for?', a: 'A scientific calculator performs advanced mathematical operations beyond basic arithmetic — including trigonometry, logarithms, exponentiation, factorials, and roots. It is used in physics, chemistry, engineering, and mathematics.' },
        { q: 'What is the difference between DEG and RAD mode?', a: 'DEG (degree) mode interprets angle inputs as degrees (360° = full circle). RAD (radian) mode uses radians (2π = full circle). For example, sin(90°) = 1 in DEG mode; sin(π/2) = 1 in RAD mode. Use the DEG/RAD button to toggle.' },
        { q: 'How do I calculate sin, cos, or tan?', a: 'Enter the angle value first using the digit buttons, then press sin, cos, or tan. Make sure your angle mode (DEG or RAD) matches your input. For inverse functions (asin, acos, atan), the input must be between −1 and 1 for sin and cos.' },
        { q: 'What does the memory function (M+, M−, MR, MC) do?', a: 'M+ adds the current display to memory. M− subtracts it. MR recalls the stored value back to the display. MC clears the memory register back to zero.' },
        { q: 'Do I need to create an account to use this calculator?', a: 'No. This calculator runs entirely in your browser. No account is required, and no data is transmitted to any server.' },
        { q: 'How accurate are the results?', a: 'Results use JavaScript\'s native 64-bit floating-point arithmetic (IEEE 754 double precision), which provides approximately 15–17 significant decimal digits — sufficient for all practical scientific and engineering calculations.' },
        { q: 'Should I consult a professional for critical calculations?', a: 'For engineering, medical dosing, or structural calculations, always verify results with a licensed professional. Floating-point arithmetic has inherent precision limits for extremely large or small numbers.' },
      ]}
      relatedTools={[
        { name: 'Standard Deviation', icon: 'σ', desc: 'Statistics for any dataset', href: '/tools/calculators/standard-deviation-calculator' },
        { name: 'Quadratic Formula', icon: 'ax²', desc: 'Solve ax²+bx+c=0', href: '/tools/calculators/quadratic-formula-calculator' },
        { name: 'Log Calculator', icon: 'log', desc: 'Logarithms in any base', href: '/tools/calculators/log-calculator' },
        { name: 'Triangle Calculator', icon: '△', desc: 'Solve any triangle', href: '/tools/calculators/triangle-calculator' },
        { name: 'Exponent Calculator', icon: 'xⁿ', desc: 'Powers and roots', href: '/tools/calculators/exponent-calculator' },
      ]}
    >
      {/* Display */}
      <div style={{
        background: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: '14px 18px',
        marginBottom: 12, border: '1px solid var(--line-strong)',
      }}>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', minHeight: 16, fontFamily: 'monospace' }}>{expr || ' '}</div>
        <div style={{
          fontSize: 36, fontWeight: 700, fontFamily: 'monospace', textAlign: 'right',
          color: error ? '#f87171' : '#e0e0ff', wordBreak: 'break-all', lineHeight: 1.2,
        }}>
          {display}
        </div>
        {mem !== 0 && <div style={{ fontSize: 10, color: '#8b5cf6', textAlign: 'right' }}>M: {mem}</div>}
      </div>

      {/* Button Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5 }}>
        {rows.flat().map((btn, i) => (
          <button key={i} onClick={btn.action} style={btn.style ?? BASE}>{btn.label}</button>
        ))}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Calculation History</span>
            <button onClick={() => setHistory([])} style={{ fontSize: 11, color: 'var(--fg-3)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
          </div>
          {history.map((h, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: 12, color: i===0?'#c4b5fd':'#444', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{h}</div>
          ))}
        </div>
      )}
    </CalcShell>
  )
}
