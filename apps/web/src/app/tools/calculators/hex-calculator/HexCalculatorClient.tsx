'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Shared style tokens ──────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
  color: 'var(--fg)', fontSize: 15, boxSizing: 'border-box', fontFamily: 'monospace',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const _BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const BTN_OP: CSSProperties = {
  padding: '7px 14px', borderRadius: 8, border: '1px solid var(--line-strong)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'left', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = {
  padding: '7px 12px', fontSize: 13, textAlign: 'left',
  color: 'var(--fg-2)', whiteSpace: 'nowrap', fontFamily: 'monospace',
}

type HexMode = 'converter' | 'color' | 'arithmetic' | 'ascii'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function _toHex(n: number): string {
  if (!isFinite(n)) return '—'
  return '0x' + Math.abs(Math.floor(n)).toString(16).toUpperCase()
}
function toBin(n: number): string {
  if (!isFinite(n)) return '—'
  return '0b' + Math.abs(Math.floor(n)).toString(2)
}
function _toOct(n: number): string {
  if (!isFinite(n)) return '—'
  return '0o' + Math.abs(Math.floor(n)).toString(8)
}
function padBin(n: number, bits: number): string {
  return Math.abs(Math.floor(n)).toString(2).padStart(bits, '0')
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) }
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const v = max, d = max - min
  const s = max === 0 ? 0 : d / max
  let h = 0
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
    else if (max === gn) h = ((bn - rn) / d + 2) / 6
    else h = ((rn - gn) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const k = 1 - Math.max(rn, gn, bn)
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
  const c = (1 - rn - k) / (1 - k)
  const m = (1 - gn - k) / (1 - k)
  const y = (1 - bn - k) / (1 - k)
  return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) }
}

function TabBar({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--bg-2)', padding: 4, borderRadius: 10, flexWrap: 'wrap' }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          background: active === t ? 'rgba(99,102,241,0.25)' : 'transparent',
          color: active === t ? 'var(--brand-2)' : 'var(--fg-3)',
        }}>{t}</button>
      ))}
    </div>
  )
}

const WEB_COLORS = [
  ['#FF0000','Red'],['#00FF00','Lime'],['#0000FF','Blue'],['#FFFF00','Yellow'],
  ['#FF00FF','Fuchsia'],['#00FFFF','Cyan'],['#FFFFFF','White'],['#000000','Black'],
  ['#808080','Gray'],['#800000','Maroon'],['#808000','Olive'],['#008000','Green'],
  ['#800080','Purple'],['#008080','Teal'],['#000080','Navy'],['#FF8C00','DarkOrange'],
  ['#FF69B4','HotPink'],['#4169E1','RoyalBlue'],['#32CD32','LimeGreen'],['#DC143C','Crimson'],
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HexCalculatorClient() {
  const [mode, setMode] = useState<HexMode>('converter')

  // Converter state
  const [convInput, setConvInput] = useState('FF')
  const [convBase, setConvBase] = useState<'hex' | 'dec' | 'oct' | 'bin'>('hex')

  // Color state
  const [colorHex, setColorHex] = useState('#6366F1')

  // Arithmetic state
  const [arithA, setArithA] = useState('1F')
  const [arithB, setArithB] = useState('0A')
  const [arithOp, setArithOp] = useState('+')

  // Bitwise state
  const [bwA, setBwA] = useState('FF')
  const [bwB, setBwB] = useState('0F')
  const [bwOp, setBwOp] = useState('AND')

  // ASCII state
  const [asciiText, setAsciiText] = useState('Hello')
  const [asciiHex, setAsciiHex] = useState('')
  const [asciiDir, setAsciiDir] = useState<'text-to-hex' | 'hex-to-text'>('text-to-hex')

  // ─── Converter ────────────────────────────────────────────────────────────

  const convResult = useMemo(() => {
    let n: number
    try {
      if (convBase === 'hex') n = parseInt(convInput, 16)
      else if (convBase === 'dec') n = parseInt(convInput, 10)
      else if (convBase === 'oct') n = parseInt(convInput, 8)
      else n = parseInt(convInput, 2)
    } catch { return null }
    if (isNaN(n)) return null
    return {
      hex: n.toString(16).toUpperCase(),
      dec: n,
      oct: n.toString(8),
      bin: n.toString(2),
      b8:  padBin(n, 8),
      b16: padBin(n, 16),
      b32: padBin(n, 32),
    }
  }, [convInput, convBase])

  // ─── Color ────────────────────────────────────────────────────────────────

  const colorResult = useMemo(() => {
    const rgb = hexToRgb(colorHex)
    if (!rgb) return null
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)
    return { rgb, hsl, hsv, cmyk }
  }, [colorHex])

  // ─── Arithmetic ───────────────────────────────────────────────────────────

  const arithResult = useMemo(() => {
    const a = parseInt(arithA, 16)
    const b = parseInt(arithB, 16)
    if (isNaN(a) || isNaN(b)) return null
    let result: number
    if (arithOp === '+') result = a + b
    else if (arithOp === '-') result = a - b
    else if (arithOp === '×') result = a * b
    else if (arithOp === '÷') { if (b === 0) return null; result = Math.floor(a / b) }
    else return null
    return { a, b, result, hexA: a.toString(16).toUpperCase(), hexB: b.toString(16).toUpperCase(), hexResult: result.toString(16).toUpperCase() }
  }, [arithA, arithB, arithOp])

  // ─── Bitwise ─────────────────────────────────────────────────────────────

  const bwResult = useMemo(() => {
    const a = parseInt(bwA, 16)
    const b = parseInt(bwB, 16)
    if (isNaN(a) || isNaN(b)) return null
    let r: number
    if (bwOp === 'AND') r = a & b
    else if (bwOp === 'OR') r = a | b
    else if (bwOp === 'XOR') r = a ^ b
    else r = (~a) >>> 0
    return { r, hexR: (r >>> 0).toString(16).toUpperCase().slice(-8), binR: (r >>> 0).toString(2).padStart(32, '0') }
  }, [bwA, bwB, bwOp])

  // ─── ASCII ────────────────────────────────────────────────────────────────

  const asciiResult = useMemo(() => {
    if (asciiDir === 'text-to-hex') {
      const chars = Array.from(asciiText).map(c => {
        const code = c.codePointAt(0) ?? 0
        const hex = code.toString(16).toUpperCase().padStart(2, '0')
        const bin = code.toString(2).padStart(8, '0')
        return { char: c, dec: code, hex, bin }
      })
      return { chars, hexStr: chars.map(c => c.hex).join(' ') }
    } else {
      const parts = asciiHex.trim().split(/\s+/)
      const chars = parts.map(h => {
        const code = parseInt(h, 16)
        if (isNaN(code)) return null
        return { char: String.fromCodePoint(code), dec: code, hex: h.toUpperCase().padStart(2, '0'), bin: code.toString(2).padStart(8, '0') }
      }).filter(Boolean) as Array<{ char: string; dec: number; hex: string; bin: string }>
      return { chars, hexStr: parts.join(' ') }
    }
  }, [asciiText, asciiHex, asciiDir])

  const COMMON_HEX = [
    ['FF', 255], ['7F', 127], ['80', 128], ['00', 0], ['0F', 15], ['F0', 240],
    ['AA', 170], ['55', 85], ['FF00', 65280], ['00FF', 255],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── MODE TABS ── */}
      <TabBar
        tabs={['Converter', 'Color', 'Arithmetic', 'ASCII']}
        active={mode === 'converter' ? 'Converter' : mode === 'color' ? 'Color' : mode === 'arithmetic' ? 'Arithmetic' : 'ASCII'}
        onChange={t => setMode(t.toLowerCase() as HexMode)}
      />

      {/* ── CONVERTER ── */}
      {mode === 'converter' && (
        <>
          <div style={CARD}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {(['hex', 'dec', 'oct', 'bin'] as const).map(b => (
                <button key={b} onClick={() => setConvBase(b)} style={{
                  ...BTN_OP,
                  background: convBase === b ? 'rgba(99,102,241,0.2)' : 'var(--bg-3)',
                  color: convBase === b ? 'var(--brand-2)' : 'var(--fg-3)',
                  border: convBase === b ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--line-strong)',
                }}>
                  {b.toUpperCase()}
                </button>
              ))}
            </div>
            <div>
              <label style={LABEL}>Enter {convBase.toUpperCase()} value</label>
              <input
                type="text" value={convInput} onChange={e => setConvInput(e.target.value)}
                placeholder={convBase === 'hex' ? 'FF' : convBase === 'dec' ? '255' : convBase === 'oct' ? '377' : '11111111'}
                style={{ ...INPUT_BOX, fontSize: 18 }}
              />
            </div>
          </div>

          {convResult && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                {[
                  { label: 'Hexadecimal', val: '0x' + convResult.hex, color: '#6366f1' },
                  { label: 'Decimal', val: String(convResult.dec), color: '#10b981' },
                  { label: 'Octal', val: '0o' + convResult.oct, color: '#f59e0b' },
                  { label: 'Binary', val: '0b' + convResult.bin, color: '#38bdf8' },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ padding: '14px', background: 'var(--bg-2)', borderRadius: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color, wordBreak: 'break-all', fontFamily: 'monospace' }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ ...CARD, padding: '16px 20px' }}>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Bit Representations
                </div>
                {[
                  { label: '8-bit', val: convResult.b8 },
                  { label: '16-bit', val: convResult.b16 },
                  { label: '32-bit', val: convResult.b32 },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--fg-3)', width: 50, flexShrink: 0 }}>{label}</span>
                    <span style={{ fontSize: 12, color: '#6366f1', fontFamily: 'monospace', wordBreak: 'break-all' }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Common hex reference */}
              <div style={{ ...CARD, padding: '16px 20px' }}>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Common Hex Values
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {COMMON_HEX.map(([h, d]) => (
                    <button key={String(h)} onClick={() => { setConvInput(String(h)); setConvBase('hex') }}
                      style={{ ...BTN_OP, fontSize: 12 }}>
                      {h} = {d}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ── COLOR ── */}
      {mode === 'color' && (
        <>
          <div style={CARD}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'end' }}>
              <div>
                <label style={LABEL}>Hex Color</label>
                <input type="text" value={colorHex} onChange={e => setColorHex(e.target.value)}
                  placeholder="#6366F1" style={INPUT_BOX} />
              </div>
              <div>
                <div style={{ width: 60, height: 44, borderRadius: 8, background: colorHex, border: '2px solid var(--line-strong)' }} />
              </div>
            </div>
          </div>

          {colorResult && (
            <>
              {/* Large swatch */}
              <div style={{ height: 80, borderRadius: 12, background: colorHex, border: '1px solid var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: colorResult?.hsl?.l > 5050 ? '#000' : '#fff', fontFamily: 'monospace' }}>
                  {colorHex.toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
                {[
                  { label: 'RGB', val: `rgb(${colorResult.rgb.r}, ${colorResult.rgb.g}, ${colorResult.rgb.b})`, color: '#6366f1' },
                  { label: 'HSL', val: `hsl(${colorResult.hsl.h}, ${colorResult.hsl.s}%, ${colorResult.hsl.l}%)`, color: '#10b981' },
                  { label: 'HSV', val: `hsv(${colorResult.hsv.h}, ${colorResult.hsv.s}%, ${colorResult.hsv.v}%)`, color: '#f59e0b' },
                  { label: 'CMYK', val: `cmyk(${colorResult.cmyk.c}%, ${colorResult.cmyk.m}%, ${colorResult.cmyk.y}%, ${colorResult.cmyk.k}%)`, color: '#38bdf8' },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ padding: '14px', background: 'var(--bg-2)', borderRadius: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'monospace', wordBreak: 'break-word' }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ ...CARD, padding: '14px 20px', background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>CSS Output</div>
                <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)', lineHeight: 2 }}>
                  <div>color: {colorHex.toUpperCase()};</div>
                  <div>color: rgb({colorResult.rgb.r}, {colorResult.rgb.g}, {colorResult.rgb.b});</div>
                  <div>color: hsl({colorResult.hsl.h}, {colorResult.hsl.s}%, {colorResult.hsl.l}%);</div>
                </div>
              </div>
            </>
          )}

          {/* Web color presets */}
          <div style={CARD}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Web Color Presets
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {WEB_COLORS.map(([hex, name]) => (
                <button key={hex} onClick={() => setColorHex(hex)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 6, border: '1px solid var(--line-strong)', background: 'var(--bg-2)', cursor: 'pointer' }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: hex, display: 'inline-block' }} />
                  <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── ARITHMETIC ── */}
      {mode === 'arithmetic' && (
        <>
          <div style={CARD}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'end' }}>
              <div>
                <label style={LABEL}>Hex A</label>
                <input type="text" value={arithA} onChange={e => setArithA(e.target.value.toUpperCase())} placeholder="1F" style={INPUT_BOX} />
              </div>
              <div style={{ display: 'flex', gap: 6, paddingBottom: 2, flexWrap: 'wrap' }}>
                {['+', '-', '×', '÷'].map(op => (
                  <button key={op} onClick={() => setArithOp(op)} style={{
                    ...BTN_OP, fontSize: 16,
                    background: arithOp === op ? 'rgba(99,102,241,0.2)' : 'var(--bg-3)',
                    color: arithOp === op ? 'var(--brand-2)' : 'var(--fg-2)',
                    border: arithOp === op ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--line-strong)',
                  }}>{op}</button>
                ))}
              </div>
              <div>
                <label style={LABEL}>Hex B</label>
                <input type="text" value={arithB} onChange={e => setArithB(e.target.value.toUpperCase())} placeholder="0A" style={INPUT_BOX} />
              </div>
            </div>
          </div>

          {arithResult && (
            <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 16, color: 'var(--fg-2)', lineHeight: 2.2 }}>
                <div style={{ color: '#6366f1' }}>0x{arithResult.hexA} ({arithResult.a}) {arithOp} 0x{arithResult.hexB} ({arithResult.b})</div>
                <div style={{ borderTop: '1px solid var(--line-strong)', paddingTop: 8 }}>
                  = <strong style={{ color: '#10b981', fontSize: 22 }}>0x{arithResult.hexResult}</strong>
                  <span style={{ fontSize: 14, color: 'var(--fg-3)', marginLeft: 12 }}>({arithResult.result} decimal)</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>
                  Binary: {toBin(arithResult.result)}
                </div>
              </div>
            </div>
          )}

          {/* Bitwise section */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Bitwise Operations
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={LABEL}>Hex A</label>
                <input type="text" value={bwA} onChange={e => setBwA(e.target.value.toUpperCase())} style={INPUT_BOX} />
              </div>
              <div>
                <label style={LABEL}>Hex B</label>
                <input type="text" value={bwB} onChange={e => setBwB(e.target.value.toUpperCase())} style={INPUT_BOX} />
              </div>
              <div>
                <label style={LABEL}>Operation</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['AND', 'OR', 'XOR', 'NOT'].map(op => (
                    <button key={op} onClick={() => setBwOp(op)} style={{
                      ...BTN_OP, fontSize: 12,
                      background: bwOp === op ? 'rgba(99,102,241,0.2)' : 'var(--bg-3)',
                      color: bwOp === op ? 'var(--brand-2)' : 'var(--fg-2)',
                    }}>{op}</button>
                  ))}
                </div>
              </div>
            </div>
            {bwResult && (
              <div style={{ padding: '12px 16px', background: 'var(--bg-2)', borderRadius: 10, fontFamily: 'monospace', fontSize: 13, lineHeight: 2 }}>
                <div style={{ color: 'var(--fg-3)' }}>Result: <strong style={{ color: '#10b981', fontSize: 16 }}>0x{bwResult.hexR}</strong> ({parseInt(bwResult.hexR, 16)} decimal)</div>
                <div style={{ color: 'var(--fg-3)', fontSize: 11 }}>Binary: {bwResult.binR}</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── ASCII ── */}
      {mode === 'ascii' && (
        <>
          <div style={CARD}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {(['text-to-hex', 'hex-to-text'] as const).map(d => (
                <button key={d} onClick={() => setAsciiDir(d)} style={{
                  ...BTN_OP,
                  background: asciiDir === d ? 'rgba(99,102,241,0.2)' : 'var(--bg-3)',
                  color: asciiDir === d ? 'var(--brand-2)' : 'var(--fg-3)',
                  border: asciiDir === d ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--line-strong)',
                }}>
                  {d === 'text-to-hex' ? 'Text → Hex' : 'Hex → Text'}
                </button>
              ))}
            </div>
            {asciiDir === 'text-to-hex' ? (
              <div>
                <label style={LABEL}>Text Input</label>
                <input type="text" value={asciiText} onChange={e => setAsciiText(e.target.value)} placeholder="Hello" style={INPUT_BOX} />
              </div>
            ) : (
              <div>
                <label style={LABEL}>Hex Input (space-separated)</label>
                <input type="text" value={asciiHex} onChange={e => setAsciiHex(e.target.value)} placeholder="48 65 6C 6C 6F" style={INPUT_BOX} />
              </div>
            )}
          </div>

          {asciiResult && asciiResult.chars.length > 0 && (
            <>
              <div style={{ ...CARD, padding: '14px 20px', background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hex String</div>
                <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--brand-2)', wordBreak: 'break-all' }}>{asciiResult.hexStr}</div>
                {asciiDir === 'hex-to-text' && (
                  <div style={{ fontFamily: 'monospace', fontSize: 16, color: '#10b981', marginTop: 8 }}>
                    {asciiResult.chars.map(c => c.char).join('')}
                  </div>
                )}
              </div>

              <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Char', 'Decimal', 'Hex', 'Binary'].map(h => (
                          <th key={h} style={TH}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {asciiResult.chars.map((c, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ ...TD, color: '#6366f1', fontWeight: 700 }}>{c.char}</td>
                          <td style={TD}>{c.dec}</td>
                          <td style={{ ...TD, color: '#10b981' }}>{c.hex}</td>
                          <td style={{ ...TD, color: '#f59e0b' }}>{c.bin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
