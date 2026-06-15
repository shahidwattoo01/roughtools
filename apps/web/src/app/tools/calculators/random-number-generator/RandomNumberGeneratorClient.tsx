'use client'
import { useState, useCallback, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'integer' | 'decimal' | 'dice' | 'listpicker' | 'lottery' | 'shuffle'
type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'
interface GeneratedSet { id: number; mode: Mode; label: string; values: (number | string)[] }
interface DiceRoll { die: DieType; value: number }

// ─── Style tokens ─────────────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
  borderRadius: 16, padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
  color: 'var(--fg)', fontSize: 15, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const BTN_PRIMARY: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(99,102,241,0.85)', border: '1px solid rgba(99,102,241,0.5)',
  borderRadius: 8, padding: '10px 22px', color: '#fff', fontSize: 14,
  fontWeight: 700, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'left', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = {
  padding: '6px 12px', fontSize: 13, textAlign: 'left',
  color: 'var(--fg-2)', whiteSpace: 'nowrap',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
}
const DIE_FACES: DieType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']

// ─── RNG helpers ─────────────────────────────────────────────────────────────

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function randDec(min: number, max: number, dec: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(dec))
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function exportCSV(values: (number | string)[], label: string) {
  const rows = values.map((v, i) => `${i + 1},${v}`)
  const csv = ['Index,Value', ...rows].join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: `random-${label}.csv`,
  })
  a.click()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, color = '#6366f1' }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ padding: '14px 12px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  )
}

function ModeTabs({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const tabs: { id: Mode; label: string }[] = [
    { id: 'integer', label: 'Integer' }, { id: 'decimal', label: 'Decimal' },
    { id: 'dice', label: 'Dice' }, { id: 'listpicker', label: 'List Picker' },
    { id: 'lottery', label: 'Lottery' }, { id: 'shuffle', label: 'Shuffle' },
  ]
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setMode(t.id)} style={{
          padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          background: mode === t.id ? 'rgba(99,102,241,0.85)' : 'rgba(0,0,0,0.25)',
          border: mode === t.id ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--line-strong)',
          color: mode === t.id ? '#fff' : 'var(--fg-3)',
        }}>{t.label}</button>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RandomNumberGeneratorClient() {
  const [mode, setMode] = useState<Mode>('integer')
  const [history, setHistory] = useState<GeneratedSet[]>([])
  const [counter, setCounter] = useState(0)
  const [output, setOutput] = useState<(number | string)[]>([])
  const [outputLabel, setOutputLabel] = useState('')
  const [copied, setCopied] = useState(false)

  // Integer state
  const [intMin, setIntMin] = useState('1')
  const [intMax, setIntMax] = useState('100')
  const [intCount, setIntCount] = useState('1')
  const [intRepeats, setIntRepeats] = useState(true)

  // Decimal state
  const [decMin, setDecMin] = useState('0')
  const [decMax, setDecMax] = useState('1')
  const [decPlaces, setDecPlaces] = useState('4')
  const [decCount, setDecCount] = useState('5')

  // Dice state
  const [diceCount, setDiceCount] = useState('2')
  const [dieType, setDieType] = useState<DieType>('d6')
  const [diceRolls, setDiceRolls] = useState<DiceRoll[]>([])

  // List Picker state
  const [listInput, setListInput] = useState('Apple, Banana, Cherry, Date, Elderberry')
  const [pickCount, setPickCount] = useState('3')
  const [pickReplace, setPickReplace] = useState(false)

  // Lottery state
  const [lottoPreset, setLottoPreset] = useState<'powerball' | 'megamillions' | 'custom'>('powerball')
  const [lottoN, setLottoN] = useState('5')
  const [lottoFrom, setLottoFrom] = useState('69')
  const [lottoBonusFrom, setLottoBonusFrom] = useState('26')

  // Shuffle state
  const [shuffleInput, setShuffleInput] = useState('Alpha, Beta, Gamma, Delta, Epsilon')

  const pushHistory = useCallback((label: string, values: (number | string)[], m: Mode) => {
    const id = counter + 1
    setCounter(id)
    setHistory(h => [{ id, mode: m, label, values }, ...h].slice(0, 5))
  }, [counter])

  function handleGenerate() {
    let vals: (number | string)[] = []
    let label = ''

    if (mode === 'integer') {
      const mn = parseInt(intMin) || 0, mx = parseInt(intMax) || 100
      const cnt = Math.min(100, Math.max(1, parseInt(intCount) || 1))
      if (intRepeats) {
        vals = Array.from({ length: cnt }, () => randInt(mn, mx))
      } else {
        const pool = Array.from({ length: mx - mn + 1 }, (_, i) => mn + i)
        vals = shuffle(pool).slice(0, Math.min(cnt, pool.length))
      }
      label = `int[${mn}–${mx}]×${cnt}`
    } else if (mode === 'decimal') {
      const mn = parseFloat(decMin) || 0, mx = parseFloat(decMax) || 1
      const dec = Math.min(10, Math.max(0, parseInt(decPlaces) || 4))
      const cnt = Math.min(100, Math.max(1, parseInt(decCount) || 5))
      vals = Array.from({ length: cnt }, () => randDec(mn, mx, dec))
      label = `dec[${mn}–${mx}]×${cnt}`
    } else if (mode === 'dice') {
      const n = Math.min(20, Math.max(1, parseInt(diceCount) || 1))
      const faces = parseInt(dieType.slice(1))
      const rolls: DiceRoll[] = Array.from({ length: n }, () => ({ die: dieType, value: randInt(1, faces) }))
      setDiceRolls(rolls)
      vals = rolls.map(r => r.value)
      label = `${n}${dieType}`
    } else if (mode === 'listpicker') {
      const items = listInput.split(',').map(s => s.trim()).filter(Boolean)
      const cnt = Math.min(items.length, Math.max(1, parseInt(pickCount) || 1))
      vals = pickReplace
        ? Array.from({ length: cnt }, () => items[randInt(0, items.length - 1)])
        : shuffle(items).slice(0, cnt)
      label = `pick${cnt}`
    } else if (mode === 'lottery') {
      let n = parseInt(lottoN), from = parseInt(lottoFrom), bonusFrom = parseInt(lottoBonusFrom)
      if (lottoPreset === 'powerball') { n = 5; from = 69; bonusFrom = 26 }
      if (lottoPreset === 'megamillions') { n = 5; from = 70; bonusFrom = 25 }
      const main = shuffle(Array.from({ length: from }, (_, i) => i + 1)).slice(0, n).sort((a, b) => a - b)
      vals = [...main, `+${randInt(1, bonusFrom)}`]
      label = lottoPreset === 'custom' ? 'custom-lotto' : lottoPreset
    } else if (mode === 'shuffle') {
      const items = shuffleInput.split(',').map(s => s.trim()).filter(Boolean)
      vals = shuffle(items)
      label = `shuffle${vals.length}`
    }

    setOutput(vals)
    setOutputLabel(label)
    pushHistory(label, vals, mode)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output.join(', ')).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }

  const diceTotal = diceRolls.reduce((s, r) => s + r.value, 0)

  const intStats = useMemo(() => {
    const vals = mode === 'integer' && output.length > 0
      ? (output as number[]).filter(v => typeof v === 'number') : []
    return vals.length > 0 ? {
      min: Math.min(...vals), max: Math.max(...vals),
      mean: vals.reduce((a, b) => a + b, 0) / vals.length,
      sorted: [...vals].sort((a, b) => a - b),
    } : null
  }, [mode, output])

  const handlePDF = useCallback(async () => {
    if (output.length === 0) return
    await exportCalcPDF({
      toolName: 'Random Number Generator',
      inputs: [{ label: 'Mode', value: mode }, { label: 'Label', value: outputLabel }],
      results: [
        { label: 'Generated Values', value: output.slice(0, 20).join(', '), highlight: true },
        { label: 'Count', value: String(output.length) },
        ...(intStats ? [
          { label: 'Min', value: String(intStats.min) },
          { label: 'Max', value: String(intStats.max) },
          { label: 'Mean', value: intStats.mean.toFixed(4) },
        ] : []),
      ],
    })
  }, [output, mode, outputLabel, intStats])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <ModeTabs mode={mode} setMode={setMode} />

        {mode === 'integer' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            <div><label style={LABEL}>Minimum</label><input type="number" value={intMin} onChange={e => setIntMin(e.target.value)} style={INPUT_BOX} /></div>
            <div><label style={LABEL}>Maximum</label><input type="number" value={intMax} onChange={e => setIntMax(e.target.value)} style={INPUT_BOX} /></div>
            <div><label style={LABEL}>Count (1–100)</label><input type="number" value={intCount} min={1} max={100} onChange={e => setIntCount(e.target.value)} style={INPUT_BOX} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <label style={{ ...LABEL, marginBottom: 8 }}>Allow Repeats</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)' }}>
                <input type="checkbox" checked={intRepeats} onChange={e => setIntRepeats(e.target.checked)} />
                {intRepeats ? 'Yes (with replacement)' : 'No (unique values)'}
              </label>
            </div>
          </div>
        )}

        {mode === 'decimal' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            <div><label style={LABEL}>Minimum</label><input type="number" value={decMin} onChange={e => setDecMin(e.target.value)} style={INPUT_BOX} /></div>
            <div><label style={LABEL}>Maximum</label><input type="number" value={decMax} onChange={e => setDecMax(e.target.value)} style={INPUT_BOX} /></div>
            <div><label style={LABEL}>Decimal Places</label><input type="number" value={decPlaces} min={0} max={10} onChange={e => setDecPlaces(e.target.value)} style={INPUT_BOX} /></div>
            <div><label style={LABEL}>Count</label><input type="number" value={decCount} min={1} max={100} onChange={e => setDecCount(e.target.value)} style={INPUT_BOX} /></div>
          </div>
        )}

        {mode === 'dice' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            <div>
              <label style={LABEL}>Number of Dice (1–20)</label>
              <input type="number" value={diceCount} min={1} max={20} onChange={e => setDiceCount(e.target.value)} style={INPUT_BOX} />
            </div>
            <div>
              <label style={LABEL}>Die Type</label>
              <select value={dieType} onChange={e => setDieType(e.target.value as DieType)} style={INPUT_BOX}>
                {DIE_FACES.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
        )}

        {mode === 'listpicker' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={LABEL}>Items (comma-separated)</label>
              <textarea value={listInput} onChange={e => setListInput(e.target.value)}
                style={{ ...INPUT_BOX, height: 72, resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><label style={LABEL}>Pick N Items</label><input type="number" value={pickCount} min={1} onChange={e => setPickCount(e.target.value)} style={INPUT_BOX} /></div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <label style={{ ...LABEL, marginBottom: 8 }}>With Replacement</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)' }}>
                  <input type="checkbox" checked={pickReplace} onChange={e => setPickReplace(e.target.checked)} />
                  {pickReplace ? 'Yes (can repeat)' : 'No (unique picks)'}
                </label>
              </div>
            </div>
          </div>
        )}

        {mode === 'lottery' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['powerball', 'megamillions', 'custom'] as const).map(p => (
                <button key={p} onClick={() => setLottoPreset(p)} style={{
                  ...BTN_GHOST,
                  background: lottoPreset === p ? 'rgba(99,102,241,0.3)' : 'rgba(139,92,246,0.12)',
                  color: lottoPreset === p ? '#fff' : 'var(--brand-2)',
                }}>
                  {p === 'powerball' ? 'Powerball' : p === 'megamillions' ? 'Mega Millions' : 'Custom'}
                </button>
              ))}
            </div>
            {lottoPreset === 'powerball' && <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>5 numbers from 1–69 + 1 Powerball from 1–26</p>}
            {lottoPreset === 'megamillions' && <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>5 numbers from 1–70 + 1 Mega Ball from 1–25</p>}
            {lottoPreset === 'custom' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <div><label style={LABEL}>Pick N</label><input type="number" value={lottoN} min={1} max={20} onChange={e => setLottoN(e.target.value)} style={INPUT_BOX} /></div>
                <div><label style={LABEL}>From (1–N)</label><input type="number" value={lottoFrom} min={2} max={100} onChange={e => setLottoFrom(e.target.value)} style={INPUT_BOX} /></div>
                <div><label style={LABEL}>Bonus Pool Size</label><input type="number" value={lottoBonusFrom} min={1} max={100} onChange={e => setLottoBonusFrom(e.target.value)} style={INPUT_BOX} /></div>
              </div>
            )}
          </div>
        )}

        {mode === 'shuffle' && (
          <div>
            <label style={LABEL}>Items to Shuffle (comma-separated)</label>
            <textarea value={shuffleInput} onChange={e => setShuffleInput(e.target.value)}
              style={{ ...INPUT_BOX, height: 72, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
        )}

        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          <button onClick={handleGenerate} style={BTN_PRIMARY}>Generate</button>
          {output.length > 0 && (
            <button onClick={handlePDF} style={BTN_GHOST}>Export PDF</button>
          )}
        </div>
      </div>

      {/* ── OUTPUT ── */}
      {output.length > 0 && (
        <>
          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Result&nbsp;<span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>({outputLabel})</span>
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleCopy} style={BTN_GHOST}>{copied ? 'Copied!' : 'Copy All'}</button>
                <button onClick={() => exportCSV(output, outputLabel)} style={BTN_GHOST}>Export CSV</button>
              </div>
            </div>

            {mode === 'dice' && diceRolls.length > 0 ? (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                  {diceRolls.map((r, i) => (
                    <div key={i} style={{
                      width: 52, height: 52, borderRadius: 10,
                      background: 'rgba(99,102,241,0.2)', border: '2px solid rgba(99,102,241,0.4)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--brand-2)', fontFamily: 'monospace' }}>{r.value}</div>
                      <div style={{ fontSize: 9, color: 'var(--fg-3)', textTransform: 'uppercase' }}>{r.die}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#6366f1' }}>
                  Total:&nbsp;<span style={{ fontFamily: 'monospace', fontSize: 20 }}>{diceTotal}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg-3)', marginLeft: 8 }}>({diceRolls.length}×{dieType})</span>
                </div>
              </div>
            ) : mode === 'lottery' ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {output.map((v, i) => (
                  <span key={i} style={{
                    display: 'inline-block', padding: '6px 14px', borderRadius: 24,
                    background: String(v).startsWith('+') ? 'rgba(251,191,36,0.2)' : 'rgba(99,102,241,0.2)',
                    border: `1px solid ${String(v).startsWith('+') ? 'rgba(251,191,36,0.4)' : 'rgba(99,102,241,0.4)'}`,
                    color: String(v).startsWith('+') ? '#fbbf24' : 'var(--brand-2)',
                    fontWeight: 700, fontSize: 16, fontFamily: 'monospace',
                  }}>{v}</span>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '14px 16px', background: 'var(--bg-2)', borderRadius: 10,
                fontFamily: 'monospace', fontSize: 14, color: 'var(--fg)', lineHeight: 1.8, wordBreak: 'break-word',
              }}>
                {output.join(', ')}
              </div>
            )}
          </div>

          {/* Integer Stats */}
          {intStats && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                <MetricCard label="Min"   value={String(intStats.min)}       color="#10b981" />
                <MetricCard label="Max"   value={String(intStats.max)}       color="#ef4444" />
                <MetricCard label="Mean"  value={intStats.mean.toFixed(2)}   color="#6366f1" />
                <MetricCard label="Count" value={String(intStats.sorted.length)}     color="#38bdf8" />
              </div>
              {intStats.sorted.length > 1 && (
                <div style={{ ...CARD, padding: '16px 20px' }}>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Sorted Output
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--fg-2)', wordBreak: 'break-word', lineHeight: 1.8 }}>
                    {intStats.sorted.join(' · ')}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── GENERATION HISTORY ── */}
      {history.length > 0 && (
        <div style={CARD}>
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Last 5 Generations
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['#', 'Mode', 'Label', 'Values'].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id}>
                    <td style={{ ...TD, color: 'var(--fg-3)' }}>{h.id}</td>
                    <td style={TD}>{h.mode}</td>
                    <td style={{ ...TD, fontFamily: 'monospace', fontSize: 12 }}>{h.label}</td>
                    <td style={{ ...TD, fontFamily: 'monospace', fontSize: 12, maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {h.values.slice(0, 20).join(', ')}{h.values.length > 20 ? ' …' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {output.length === 0 && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Configure your options above and click Generate — results appear instantly.
        </div>
      )}
    </div>
  )
}
