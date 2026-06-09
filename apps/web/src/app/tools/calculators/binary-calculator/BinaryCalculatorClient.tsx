'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Style tokens ─────────────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)',
  color: '#fff', fontSize: 15, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = { padding: '6px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 900, color, fontFamily: 'monospace', wordBreak: 'break-all' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function TabBar({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding: '8px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer',
          background: active === t ? 'rgba(99,102,241,0.25)' : 'transparent',
          border: active === t ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--line-strong)',
          color: active === t ? '#c4b5fd' : 'var(--fg-3)',
        }}>{t}</button>
      ))}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toBin(n: number, bits = 32) {
  const raw = (n >>> 0).toString(2)
  return raw.padStart(bits, '0').slice(-bits)
}

function parseValue(val: string, base: number): number | null {
  if (!val.trim()) return null
  const n = parseInt(val.trim().toUpperCase(), base)
  return isNaN(n) ? null : n
}

// Binary arithmetic with carry steps
function binaryAdd(a: string, b: string): { result: string; carry: string[]; steps: string[] } {
  const len = Math.max(a.length, b.length) + 1
  const A = a.padStart(len, '0')
  const B = b.padStart(len, '0')
  let carry = 0
  let result = ''
  const carries: string[] = []
  const steps: string[] = []

  for (let i = len - 1; i >= 0; i--) {
    const bitA = parseInt(A[i])
    const bitB = parseInt(B[i])
    const sum = bitA + bitB + carry
    result = (sum % 2).toString() + result
    carries.unshift(carry.toString())
    steps.unshift(`${bitA}+${bitB}+${carry}=${sum%2}(c${Math.floor(sum/2)})`)
    carry = Math.floor(sum / 2)
  }
  return { result: result.replace(/^0+/, '') || '0', carry: carries, steps }
}

function binarySub(a: string, b: string): { result: string; twos: string } {
  const aNum = parseInt(a, 2)
  const bNum = parseInt(b, 2)
  const diff = aNum - bNum
  const twos = ((~bNum + 1) >>> 0).toString(2).slice(-Math.max(b.length, 8))
  return {
    result: diff < 0 ? '-' + Math.abs(diff).toString(2) : diff.toString(2),
    twos,
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BinaryCalculatorClient() {
  const [mode, setMode] = useState('Converter')

  // Converter state
  const [convInput, setConvInput]   = useState('255')
  const [convBase, setConvBase]     = useState<2|8|10|16>(10)

  // Arithmetic state
  const [arithA, setArithA]         = useState('1010')
  const [arithB, setArithB]         = useState('0110')
  const [arithOp, setArithOp]       = useState<'+'|'-'|'×'|'÷'>('+')

  // Bitwise state
  const [bwA, setBwA]               = useState('10110101')
  const [bwB, setBwB]               = useState('11001010')
  const [bwOp, setBwOp]             = useState('AND')
  const [shiftN, setShiftN]         = useState('2')

  // UI state
  const [showRefTable, setShowRefTable] = useState(false)
  const [showAdv, setShowAdv]       = useState(false)

  // ── Converter calc ──
  const convResult = useMemo(() => {
    const n = parseValue(convInput, convBase)
    if (n === null || n < 0) return null
    return {
      n,
      bin: n.toString(2),
      oct: n.toString(8),
      dec: n.toString(10),
      hex: n.toString(16).toUpperCase(),
      bits: toBin(n, 32),
      twosComp: n === 0 ? '0' : toBin((~n + 1) >>> 0, 32),
    }
  }, [convInput, convBase])

  // ── Arithmetic calc ──
  const arithResult = useMemo(() => {
    if (!/^[01]+$/.test(arithA) || !/^[01]+$/.test(arithB)) return null
    const A = parseInt(arithA, 2)
    const B = parseInt(arithB, 2)
    let val = 0
    let detail = ''
    if (arithOp === '+')  { val = A + B; detail = `${A} + ${B}` }
    if (arithOp === '-')  { val = A - B; detail = `${A} - ${B}` }
    if (arithOp === '×')  { val = A * B; detail = `${A} × ${B}` }
    if (arithOp === '÷')  { val = B !== 0 ? Math.floor(A / B) : NaN; detail = `${A} ÷ ${B}` }
    if (isNaN(val)) return null
    const addInfo = arithOp === '+' ? binaryAdd(arithA, arithB) : null
    const subInfo = arithOp === '-' ? binarySub(arithA, arithB) : null
    const absVal = Math.abs(val)
    return {
      val, detail,
      bin: val < 0 ? '-' + absVal.toString(2) : val.toString(2),
      oct: val < 0 ? '-' + absVal.toString(8) : val.toString(8),
      dec: val.toString(10),
      hex: val < 0 ? '-' + absVal.toString(16).toUpperCase() : val.toString(16).toUpperCase(),
      addSteps: addInfo?.steps ?? [],
      twosNeg: subInfo?.twos ?? '',
    }
  }, [arithA, arithB, arithOp])

  // ── Bitwise calc ──
  const bwResult = useMemo(() => {
    if (!/^[01]+$/.test(bwA)) return null
    const A = parseInt(bwA, 2)
    const B = /^[01]+$/.test(bwB) ? parseInt(bwB, 2) : null
    const sh = parseInt(shiftN) || 1
    let val: number
    let opLabel = bwOp
    switch (bwOp) {
      case 'AND':         if (B === null) return null; val = A & B; break
      case 'OR':          if (B === null) return null; val = A | B; break
      case 'XOR':         if (B === null) return null; val = A ^ B; break
      case 'NOT':         val = (~A) >>> 0; break
      case 'NAND':        if (B === null) return null; val = (~(A & B)) >>> 0; break
      case 'Left Shift':  val = (A << sh) >>> 0; opLabel = `Left Shift ×${sh}`; break
      case 'Right Shift': val = A >>> sh; opLabel = `Right Shift ÷${sh}`; break
      default: return null
    }
    const len = Math.max(bwA.length, bwB.length, 8)
    return {
      val, opLabel,
      binA: bwA.padStart(len, '0'),
      binB: B !== null ? bwB.padStart(len, '0') : null,
      binResult: (val >>> 0).toString(2).padStart(len, '0'),
      dec: (val >>> 0).toString(10),
      hex: (val >>> 0).toString(16).toUpperCase(),
    }
  }, [bwA, bwB, bwOp, shiftN])

  // ── Reference table rows (0–31 default, expandable to 255) ──
  const refRows = useMemo(() => {
    const max = showAdv ? 255 : 31
    return Array.from({ length: max + 1 }, (_, i) => ({
      dec: i,
      bin: i.toString(2).padStart(8, '0'),
      oct: i.toString(8),
      hex: i.toString(16).toUpperCase(),
    }))
  }, [showAdv])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── TAB BAR ── */}
      <TabBar tabs={['Converter', 'Arithmetic', 'Bitwise']} active={mode} onChange={setMode} />

      {/* ══════════════════════════════ CONVERTER ══════════════════════════════ */}
      {mode === 'Converter' && (
        <>
          <div style={CARD}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <div>
                <label style={LABEL}>Enter Value</label>
                <input style={INPUT_BOX} value={convInput}
                  onChange={e => setConvInput(e.target.value.toUpperCase())}
                  placeholder="255" aria-label="Input value" />
              </div>
              <div>
                <label style={LABEL}>Input Base</label>
                <select style={{ ...INPUT_BOX, cursor: 'pointer' }} value={convBase}
                  onChange={e => setConvBase(parseInt(e.target.value) as 2|8|10|16)}>
                  <option value={2}>Base 2 — Binary</option>
                  <option value={8}>Base 8 — Octal</option>
                  <option value={10}>Base 10 — Decimal</option>
                  <option value={16}>Base 16 — Hexadecimal</option>
                </select>
              </div>
            </div>
            {!convResult && convInput && (
              <div style={{ marginTop: 10, color: '#f87171', fontSize: 13 }}>
                Invalid value for base {convBase}.
              </div>
            )}
          </div>

          {convResult && (
            <>
              {/* All 4 bases */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                <MetricCard label="Binary (Base 2)"       value={convResult.bin} color="#6366f1" />
                <MetricCard label="Octal (Base 8)"        value={convResult.oct} color="#10b981" />
                <MetricCard label="Decimal (Base 10)"     value={convResult.dec} color="#f59e0b" />
                <MetricCard label="Hexadecimal (Base 16)" value={convResult.hex} color="#38bdf8" />
              </div>

              {/* 32-bit grid */}
              <div style={{ ...CARD, padding: '20px 24px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                  32-bit Binary Representation
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {convResult.bits.split('').map((b, i) => {
                    const group = Math.floor(i / 8)
                    const groupColors = ['#6366f1','#8b5cf6','#a78bfa','#c4b5fd']
                    return (
                      <span key={i} style={{
                        width: 22, height: 26, display: 'inline-flex', alignItems: 'center',
                        justifyContent: 'center', borderRadius: 4, fontSize: 12, fontWeight: 700,
                        fontFamily: 'monospace',
                        background: b === '1' ? groupColors[group % 4] : 'rgba(0,0,0,0.4)',
                        color: b === '1' ? '#fff' : 'var(--fg-3)',
                        border: `1px solid ${b === '1' ? groupColors[group % 4] : 'rgba(255,255,255,0.06)'}`,
                        marginRight: (i + 1) % 8 === 0 ? 8 : 0,
                      }} title={`Bit ${31 - i} = ${b}`}>{b}</span>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                  {[['Bits 31–24','#6366f1'],['Bits 23–16','#8b5cf6'],['Bits 15–8','#a78bfa'],['Bits 7–0','#c4b5fd']].map(([lbl, col]) => (
                    <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: col, display: 'inline-block' }} />
                      <span style={{ color: 'var(--fg-3)' }}>{lbl}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 8, fontSize: 12, color: 'var(--fg-3)' }}>
                  <strong style={{ color: 'var(--fg-2)' }}>Two's Complement (negative):</strong>{' '}
                  <span style={{ fontFamily: 'monospace', color: '#f87171' }}>{convResult.twosComp}</span>
                  {' '}= {-(convResult.n >>> 0)} (if interpreted as signed 32-bit)
                </div>
              </div>

              {/* Export buttons */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button style={BTN_GHOST} onClick={async () => exportCalcPDF({
                  toolName: 'Binary Calculator — Converter',
                  inputs: [{ label: 'Input', value: convInput }, { label: 'Base', value: String(convBase) }],
                  results: [
                    { label: 'Binary', value: convResult.bin, highlight: true },
                    { label: 'Octal', value: convResult.oct },
                    { label: 'Decimal', value: convResult.dec, highlight: true },
                    { label: 'Hexadecimal', value: convResult.hex },
                    { label: '32-bit pattern', value: convResult.bits },
                  ],
                })}>
                  Export PDF
                </button>
                <button style={BTN_GHOST} onClick={() => {
                  const text = `Binary: ${convResult.bin}\nOctal: ${convResult.oct}\nDecimal: ${convResult.dec}\nHex: ${convResult.hex}`
                  navigator.clipboard.writeText(text)
                }}>
                  Copy Results
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* ══════════════════════════════ ARITHMETIC ══════════════════════════════ */}
      {mode === 'Arithmetic' && (
        <>
          <div style={CARD}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'end' }}>
              <div>
                <label style={LABEL}>Operand A (binary)</label>
                <input style={INPUT_BOX} value={arithA}
                  onChange={e => setArithA(e.target.value.replace(/[^01]/g, ''))}
                  placeholder="1010" aria-label="Operand A" />
              </div>
              <div>
                <label style={LABEL}>Operation</label>
                <select style={{ ...INPUT_BOX, width: 'auto', cursor: 'pointer' }} value={arithOp}
                  onChange={e => setArithOp(e.target.value as '+'|'-'|'×'|'÷')}>
                  {['+', '-', '×', '÷'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={LABEL}>Operand B (binary)</label>
                <input style={INPUT_BOX} value={arithB}
                  onChange={e => setArithB(e.target.value.replace(/[^01]/g, ''))}
                  placeholder="0110" aria-label="Operand B" />
              </div>
            </div>
          </div>

          {arithResult && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                <MetricCard label="Result (Binary)"  value={arithResult.bin} color="#6366f1" />
                <MetricCard label="Result (Octal)"   value={arithResult.oct} color="#10b981" />
                <MetricCard label="Result (Decimal)" value={arithResult.dec} color="#f59e0b" />
                <MetricCard label="Result (Hex)"     value={arithResult.hex} color="#38bdf8" />
              </div>

              {/* Step-by-step for addition */}
              {arithOp === '+' && arithResult.addSteps.length > 0 && (
                <div style={{ ...CARD, padding: '20px 24px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                    Carry Step Visualization
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--fg-2)', lineHeight: 2 }}>
                    <div style={{ color: 'var(--fg-3)' }}>  A = <span style={{ color: '#6366f1' }}>{arithA}</span></div>
                    <div style={{ color: 'var(--fg-3)' }}>+ B = <span style={{ color: '#10b981' }}>{arithB}</span></div>
                    <div style={{ borderTop: '1px solid var(--line-strong)', marginTop: 4, paddingTop: 4 }}>
                      = <span style={{ color: '#f59e0b' }}>{arithResult.bin}</span>
                      <span style={{ color: 'var(--fg-3)', marginLeft: 12, fontSize: 11 }}>
                        (decimal {parseInt(arithA, 2)} + {parseInt(arithB, 2)} = {arithResult.dec})
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Two's complement for subtraction */}
              {arithOp === '-' && arithResult.twosNeg && (
                <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)', padding: '16px 20px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Two's Complement Method
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.9 }}>
                    <div>Invert B bits: <span style={{ color: '#f87171' }}>{parseInt(arithB, 2).toString(2).split('').map(b => b === '0' ? '1' : '0').join('')}</span></div>
                    <div>Add 1 (Two's complement of B): <span style={{ color: '#f87171' }}>{arithResult.twosNeg}</span></div>
                    <div>A + (~B+1) = <span style={{ color: '#f59e0b' }}>{arithResult.bin}</span></div>
                  </div>
                </div>
              )}
            </>
          )}

          {!arithResult && (arithA || arithB) && (
            <div style={{ ...CARD, textAlign: 'center', color: 'var(--fg-3)', fontSize: 13, padding: '24px' }}>
              Enter valid binary numbers (digits 0 and 1 only) in both operand fields.
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════ BITWISE ══════════════════════════════ */}
      {mode === 'Bitwise' && (
        <>
          <div style={CARD}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <div>
                <label style={LABEL}>Input A (binary)</label>
                <input style={INPUT_BOX} value={bwA}
                  onChange={e => setBwA(e.target.value.replace(/[^01]/g, ''))}
                  placeholder="10110101" />
              </div>
              <div>
                <label style={LABEL}>Operation</label>
                <select style={{ ...INPUT_BOX, cursor: 'pointer' }} value={bwOp} onChange={e => setBwOp(e.target.value)}>
                  {['AND','OR','XOR','NOT','NAND','Left Shift','Right Shift'].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              {['Left Shift','Right Shift'].includes(bwOp) ? (
                <div>
                  <label style={LABEL}>Shift Amount (n)</label>
                  <input style={INPUT_BOX} type="number" value={shiftN} min={1} max={16}
                    onChange={e => setShiftN(e.target.value)} />
                </div>
              ) : bwOp !== 'NOT' ? (
                <div>
                  <label style={LABEL}>Input B (binary)</label>
                  <input style={INPUT_BOX} value={bwB}
                    onChange={e => setBwB(e.target.value.replace(/[^01]/g, ''))}
                    placeholder="11001010" />
                </div>
              ) : <div />}
            </div>
          </div>

          {bwResult && (
            <>
              {/* Bit-level visualization */}
              <div style={CARD}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                  Bit-level Visualization — {bwResult.opLabel}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2, overflowX: 'auto' }}>
                  {[
                    { label: '  A', bits: bwResult.binA, color: '#6366f1' },
                    ...(bwResult.binB ? [{ label: '  B', bits: bwResult.binB, color: '#10b981' }] : []),
                    { label: '  =', bits: bwResult.binResult, color: '#f59e0b' },
                  ].map(({ label, bits, color }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ color: 'var(--fg-3)', minWidth: 20 }}>{label}</span>
                      <span style={{ display: 'flex', gap: 2 }}>
                        {bits.split('').map((b, i) => (
                          <span key={i} style={{
                            width: 20, height: 22, display: 'inline-flex', alignItems: 'center',
                            justifyContent: 'center', borderRadius: 3, fontSize: 11, fontWeight: 700,
                            background: b === '1' ? color : 'rgba(0,0,0,0.4)',
                            color: b === '1' ? '#fff' : 'var(--fg-3)',
                            border: `1px solid ${b === '1' ? color : 'rgba(255,255,255,0.05)'}`,
                          }}>{b}</span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                  <MetricCard label="Result (Binary)"  value={bwResult.binResult.replace(/^0+/, '') || '0'} color="#f59e0b" />
                  <MetricCard label="Result (Decimal)" value={bwResult.dec} color="#6366f1" />
                  <MetricCard label="Result (Hex)"     value={bwResult.hex} color="#38bdf8" />
                </div>
              </div>

              <button style={BTN_GHOST} onClick={async () => exportCalcPDF({
                toolName: 'Binary Calculator — Bitwise',
                inputs: [
                  { label: 'A', value: bwA },
                  { label: 'Operation', value: bwResult.opLabel },
                  ...(bwResult.binB ? [{ label: 'B', value: bwB }] : []),
                ],
                results: [
                  { label: 'Binary Result', value: bwResult.binResult, highlight: true },
                  { label: 'Decimal', value: bwResult.dec },
                  { label: 'Hex', value: bwResult.hex },
                ],
              })}>
                Export PDF
              </button>
            </>
          )}
        </>
      )}

      {/* ══════════════════════════════ REFERENCE TABLE ══════════════════════ */}
      <div>
        <button onClick={() => setShowRefTable(v => !v)} style={{
          width: '100%', textAlign: 'left', padding: '14px 20px',
          background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
          borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14, cursor: 'pointer',
        }}>
          {showRefTable ? '▾' : '▸'} Reference Table (0–{showAdv ? 255 : 31} in all bases)
        </button>

        {showRefTable && (
          <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
            <div style={{ overflowX: 'auto', maxHeight: 400 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead style={{ position: 'sticky', top: 0 }}>
                  <tr>
                    {['Dec', 'Binary', 'Octal', 'Hex'].map(h => (
                      <th key={h} style={{ ...TH, textAlign: 'center' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {refRows.map(r => (
                    <tr key={r.dec} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...TD, textAlign: 'center', color: '#f59e0b', fontWeight: 600 }}>{r.dec}</td>
                      <td style={{ ...TD, textAlign: 'center', fontFamily: 'monospace', color: '#6366f1' }}>{r.bin}</td>
                      <td style={{ ...TD, textAlign: 'center', color: '#10b981' }}>{r.oct}</td>
                      <td style={{ ...TD, textAlign: 'center', fontFamily: 'monospace', color: '#38bdf8' }}>{r.hex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--line-strong)', textAlign: 'center' }}>
              <button style={{ ...BTN_GHOST, fontSize: 12 }} onClick={() => setShowAdv(v => !v)}>
                {showAdv ? '▲ Show 0–31 only' : '▼ Expand to 0–255'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Interpretation ── */}
      <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          How Number Systems Work
        </h3>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Binary (Base 2): Only 0 and 1. Each position is a power of 2. 8 bits = 1 byte = values 0–255.',
            'Octal (Base 8): Digits 0–7. Each octal digit = exactly 3 binary bits. Common in Unix file permissions (chmod 755).',
            'Hexadecimal (Base 16): Digits 0–9 and A–F. Each hex digit = 4 binary bits (nibble). Used for memory addresses, RGB colors.',
            "Two's Complement: To negate a binary number, flip all bits then add 1. This is how CPUs represent negative integers.",
            'Bitwise AND masks bits (extracts flags), OR sets bits, XOR toggles bits, NOT inverts. Left shift multiplies by 2ⁿ.',
          ].map((tip, i) => (
            <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
