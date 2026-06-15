'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Constants ────────────────────────────────────────────────────────────────

const UNIT_TO_SECONDS: Record<string, number> = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  years: 31557600,
}
const UNITS = Object.keys(UNIT_TO_SECONDS) as Array<keyof typeof UNIT_TO_SECONDS>

const ISOTOPES = [
  { name: 'Carbon-14', symbol: 'C-14',   halfLife: 5730,   unit: 'years',   use: 'Archaeological dating' },
  { name: 'Uranium-235', symbol: 'U-235', halfLife: 703.8e6, unit: 'years',  use: 'Nuclear fuel / dating' },
  { name: 'Iodine-131', symbol: 'I-131',  halfLife: 8.02,   unit: 'days',    use: 'Nuclear medicine (thyroid)' },
  { name: 'Technetium-99m', symbol: 'Tc-99m', halfLife: 6.0, unit: 'hours', use: 'Medical imaging' },
  { name: 'Radium-226', symbol: 'Ra-226', halfLife: 1600,   unit: 'years',   use: 'Historical medicine' },
  { name: 'Polonium-210', symbol: 'Po-210', halfLife: 138.4, unit: 'days',   use: 'Alpha source' },
  { name: 'Strontium-90', symbol: 'Sr-90', halfLife: 28.8,  unit: 'years',   use: 'Nuclear fallout tracer' },
]

type Mode = 'decay' | 'find-time' | 'find-halflife'

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
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = {
  padding: '6px 12px', fontSize: 12, textAlign: 'right',
  color: 'var(--fg-2)', whiteSpace: 'nowrap',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color, wordBreak: 'break-all' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function TabBar({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--bg-2)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          background: active === t ? 'rgba(99,102,241,0.25)' : 'transparent',
          color: active === t ? 'var(--brand-2)' : 'var(--fg-3)',
        }}>{t}</button>
      ))}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtSci(n: number, digits = 4): string {
  if (!isFinite(n) || isNaN(n)) return '—'
  if (Math.abs(n) >= 1e-3 && Math.abs(n) < 1e7) return n.toPrecision(digits)
  return n.toExponential(digits - 1)
}

function pct(n: number) { return n.toFixed(4) + '%' }

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HalfLifeCalculatorClient() {
  const [mode, setMode] = useState<Mode>('decay')

  // Decay mode
  const [n0, setN0] = useState('1000')
  const [halfLifeVal, setHalfLifeVal] = useState('5730')
  const [halfLifeUnit, setHalfLifeUnit] = useState('years')
  const [elapsedVal, setElapsedVal] = useState('11460')
  const [elapsedUnit, setElapsedUnit] = useState('years')

  // Find time mode
  const [ftN0, setFtN0] = useState('1000')
  const [ftNt, setFtNt] = useState('250')
  const [ftHalfLife, setFtHalfLife] = useState('5730')
  const [ftHalfLifeUnit, setFtHalfLifeUnit] = useState('years')

  // Find half-life mode
  const [fhN0, setFhN0] = useState('1000')
  const [fhNt, setFhNt] = useState('500')
  const [fhElapsed, setFhElapsed] = useState('1')
  const [fhElapsedUnit, setFhElapsedUnit] = useState('days')

  const [showTable, setShowTable] = useState(false)
  const [showIsotopes, setShowIsotopes] = useState(false)

  // ─── Decay calculation ────────────────────────────────────────────────────

  const decayResult = useMemo(() => {
    const N0 = parseFloat(n0)
    const t12_sec = parseFloat(halfLifeVal) * (UNIT_TO_SECONDS[halfLifeUnit] ?? 1)
    const t_sec = parseFloat(elapsedVal) * (UNIT_TO_SECONDS[elapsedUnit] ?? 1)
    if (!N0 || !t12_sec || isNaN(t_sec) || t12_sec <= 0) return null
    const lambda = Math.LN2 / t12_sec
    const tau = 1 / lambda
    const nHalfLives = t_sec / t12_sec
    const Nt = N0 * Math.pow(0.5, nHalfLives)
    const pctRemaining = (Nt / N0) * 100
    return {
      Nt, pctRemaining, pctDecayed: 100 - pctRemaining,
      nHalfLives, lambda, tau,
      lambdaUnit: `per second`,
      tauUnit: `seconds`,
    }
  }, [n0, halfLifeVal, halfLifeUnit, elapsedVal, elapsedUnit])

  // Decay table: N at each half-life 0→10
  const decayTable = useMemo(() => {
    const N0 = parseFloat(n0)
    if (!N0) return []
    return Array.from({ length: 11 }, (_, i) => {
      const amount = N0 * Math.pow(0.5, i)
      const pctRem = (amount / N0) * 100
      return { halfLifeNum: i, amount, pctRemaining: pctRem, cumDecayed: N0 - amount }
    })
  }, [n0])

  // Find time
  const findTimeResult = useMemo(() => {
    const N0 = parseFloat(ftN0)
    const Nt = parseFloat(ftNt)
    const t12_sec = parseFloat(ftHalfLife) * (UNIT_TO_SECONDS[ftHalfLifeUnit] ?? 1)
    if (!N0 || !Nt || !t12_sec || Nt <= 0 || Nt > N0 || t12_sec <= 0) return null
    const nHalfLives = Math.log(Nt / N0) / Math.log(0.5)
    const t_sec = nHalfLives * t12_sec
    const lambda = Math.LN2 / t12_sec
    return { t_sec, nHalfLives, lambda, t_years: t_sec / UNIT_TO_SECONDS.years, t_days: t_sec / UNIT_TO_SECONDS.days }
  }, [ftN0, ftNt, ftHalfLife, ftHalfLifeUnit])

  // Find half-life
  const findHalfLifeResult = useMemo(() => {
    const N0 = parseFloat(fhN0)
    const Nt = parseFloat(fhNt)
    const t_sec = parseFloat(fhElapsed) * (UNIT_TO_SECONDS[fhElapsedUnit] ?? 1)
    if (!N0 || !Nt || !t_sec || Nt <= 0 || Nt >= N0 || t_sec <= 0) return null
    const lambda = -Math.log(Nt / N0) / t_sec
    const t12_sec = Math.LN2 / lambda
    const tau = 1 / lambda
    return {
      t12_sec, lambda, tau,
      t12_years: t12_sec / UNIT_TO_SECONDS.years,
      t12_days: t12_sec / UNIT_TO_SECONDS.days,
      t12_hours: t12_sec / UNIT_TO_SECONDS.hours,
    }
  }, [fhN0, fhNt, fhElapsed, fhElapsedUnit])

  // Scenario: 3 different half-lives
  const scenarioResult = useMemo(() => {
    const N0 = parseFloat(n0)
    const t_sec = parseFloat(elapsedVal) * (UNIT_TO_SECONDS[elapsedUnit] ?? 1)
    const t12_sec = parseFloat(halfLifeVal) * (UNIT_TO_SECONDS[halfLifeUnit] ?? 1)
    if (!N0 || !t_sec || !t12_sec) return null
    return [0.5, 1.0, 2.0].map(mult => {
      const hl = t12_sec * mult
      const Nt = N0 * Math.pow(0.5, t_sec / hl)
      return { label: `t½ × ${mult}`, halfLife: hl / (UNIT_TO_SECONDS[halfLifeUnit] ?? 1), Nt, pct: (Nt / N0) * 100 }
    })
  }, [n0, halfLifeVal, halfLifeUnit, elapsedVal, elapsedUnit])

  const UnitSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ ...INPUT_BOX, width: 'auto', minWidth: 100 }}>
      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
    </select>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── MODE TABS ── */}
      <TabBar tabs={['Decay', 'Find Time', 'Find Half-Life']} active={
        mode === 'decay' ? 'Decay' : mode === 'find-time' ? 'Find Time' : 'Find Half-Life'
      } onChange={t => setMode(t === 'Decay' ? 'decay' : t === 'Find Time' ? 'find-time' : 'find-halflife')} />

      {/* ── DECAY MODE ── */}
      {mode === 'decay' && (
        <div style={CARD}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div>
              <label style={LABEL}>Initial Quantity N₀</label>
              <input type="number" value={n0} onChange={e => setN0(e.target.value)} min={0} style={INPUT_BOX} />
            </div>
            <div>
              <label style={LABEL}>Half-Life Value</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" value={halfLifeVal} onChange={e => setHalfLifeVal(e.target.value)} min={0} style={{ ...INPUT_BOX, flex: 1 }} />
                <UnitSelect value={halfLifeUnit} onChange={setHalfLifeUnit} />
              </div>
            </div>
            <div>
              <label style={LABEL}>Elapsed Time</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" value={elapsedVal} onChange={e => setElapsedVal(e.target.value)} min={0} style={{ ...INPUT_BOX, flex: 1 }} />
                <UnitSelect value={elapsedUnit} onChange={setElapsedUnit} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FIND TIME MODE ── */}
      {mode === 'find-time' && (
        <div style={CARD}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div>
              <label style={LABEL}>Initial Quantity N₀</label>
              <input type="number" value={ftN0} onChange={e => setFtN0(e.target.value)} min={0} style={INPUT_BOX} />
            </div>
            <div>
              <label style={LABEL}>Remaining Quantity N(t)</label>
              <input type="number" value={ftNt} onChange={e => setFtNt(e.target.value)} min={0} style={INPUT_BOX} />
            </div>
            <div>
              <label style={LABEL}>Half-Life</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" value={ftHalfLife} onChange={e => setFtHalfLife(e.target.value)} min={0} style={{ ...INPUT_BOX, flex: 1 }} />
                <UnitSelect value={ftHalfLifeUnit} onChange={setFtHalfLifeUnit} />
              </div>
            </div>
          </div>
          {findTimeResult && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 16 }}>
              <MetricCard label="Time Elapsed (s)" value={fmtSci(findTimeResult.t_sec)} color="#6366f1" />
              <MetricCard label="Time (years)" value={fmtSci(findTimeResult.t_years)} color="#38bdf8" />
              <MetricCard label="Half-Lives Elapsed" value={findTimeResult.nHalfLives.toFixed(4)} color="#10b981" />
              <MetricCard label="λ (decay constant)" value={fmtSci(findTimeResult.lambda)} color="#e879f9" sub="per second" />
            </div>
          )}
        </div>
      )}

      {/* ── FIND HALF-LIFE MODE ── */}
      {mode === 'find-halflife' && (
        <div style={CARD}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div>
              <label style={LABEL}>Initial Quantity N₀</label>
              <input type="number" value={fhN0} onChange={e => setFhN0(e.target.value)} min={0} style={INPUT_BOX} />
            </div>
            <div>
              <label style={LABEL}>Remaining Quantity N(t)</label>
              <input type="number" value={fhNt} onChange={e => setFhNt(e.target.value)} min={0} style={INPUT_BOX} />
            </div>
            <div>
              <label style={LABEL}>Elapsed Time</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" value={fhElapsed} onChange={e => setFhElapsed(e.target.value)} min={0} style={{ ...INPUT_BOX, flex: 1 }} />
                <UnitSelect value={fhElapsedUnit} onChange={setFhElapsedUnit} />
              </div>
            </div>
          </div>
          {findHalfLifeResult && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 16 }}>
              <MetricCard label="Half-Life (s)" value={fmtSci(findHalfLifeResult.t12_sec)} color="#6366f1" />
              <MetricCard label="Half-Life (days)" value={fmtSci(findHalfLifeResult.t12_days)} color="#38bdf8" />
              <MetricCard label="Half-Life (years)" value={fmtSci(findHalfLifeResult.t12_years)} color="#10b981" />
              <MetricCard label="Mean Lifetime τ" value={fmtSci(findHalfLifeResult.tau)} color="#e879f9" sub="seconds" />
            </div>
          )}
        </div>
      )}

      {/* ── DECAY RESULTS (main mode) ── */}
      {mode === 'decay' && decayResult && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Remaining N(t)" value={fmtSci(decayResult.Nt)} color="#6366f1" />
            <MetricCard label="% Remaining" value={pct(decayResult.pctRemaining)} color="#10b981" />
            <MetricCard label="% Decayed" value={pct(decayResult.pctDecayed)} color="#f59e0b" />
            <MetricCard label="Half-Lives Elapsed" value={decayResult.nHalfLives.toFixed(4)} color="#38bdf8" />
            <MetricCard label="λ Decay Constant" value={fmtSci(decayResult.lambda)} color="#e879f9" sub="per second" />
            <MetricCard label="Mean Lifetime τ" value={fmtSci(decayResult.tau)} color="#a78bfa" sub="seconds" />
          </div>

          {/* Progress bar */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Decay Progress
            </div>
            <div style={{ height: 20, borderRadius: 10, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ width: `${Math.min(decayResult.pctRemaining, 100)}%`, background: '#10b981', transition: 'width 0.3s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: 'var(--fg-3)' }}>
              <span style={{ color: '#10b981' }}>Remaining: {pct(decayResult.pctRemaining)}</span>
              <span style={{ color: '#f59e0b' }}>Decayed: {pct(decayResult.pctDecayed)}</span>
            </div>
          </div>

          {/* Formula display */}
          <div style={{ ...CARD, padding: '14px 20px', background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Formula</div>
            <div style={{ fontSize: 14, color: 'var(--fg-2)', fontFamily: 'monospace', lineHeight: 2 }}>
              N(t) = N₀ × (½)^(t/t½)<br />
              N(t) = {n0} × (½)^({fmtSci(decayResult.nHalfLives, 4)}) = <strong style={{ color: '#6366f1' }}>{fmtSci(decayResult.Nt)}</strong><br />
              λ = ln(2) / t½ = {fmtSci(decayResult.lambda)} s⁻¹ &nbsp;|&nbsp; τ = 1/λ = {fmtSci(decayResult.tau)} s
            </div>
          </div>

          {/* Scenario: 3 different half-lives */}
          {scenarioResult && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Scenario: Same Quantity, Different Half-Lives
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                {scenarioResult.map(s => (
                  <MetricCard key={s.label} label={s.label} value={fmtSci(s.Nt)}
                    sub={`${s.pct.toFixed(2)}% remaining`} color="#6366f1" />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── DECAY TABLE ── */}
      {mode === 'decay' && (
        <div>
          <button onClick={() => setShowTable(v => !v)} style={{ ...BTN_GHOST, marginBottom: 4 }} aria-expanded={showTable}>
            {showTable ? '▾' : '▸'} Decay Table (0 → 10 Half-Lives)
          </button>
          {showTable && (
            <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Half-Life #', 'Amount', '% Remaining', 'Cumulative Decayed'].map((h, i) => (
                        <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {decayTable.map(row => (
                      <tr key={row.halfLifeNum} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-3)' }}>{row.halfLifeNum}</td>
                        <td style={{ ...TD, color: '#6366f1' }}>{fmtSci(row.amount)}</td>
                        <td style={{ ...TD, color: '#10b981' }}>{row.pctRemaining.toFixed(4)}%</td>
                        <td style={{ ...TD, color: '#f59e0b' }}>{fmtSci(row.cumDecayed)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ISOTOPES REFERENCE ── */}
      <div>
        <button onClick={() => setShowIsotopes(v => !v)} style={{ ...BTN_GHOST, marginBottom: 4 }} aria-expanded={showIsotopes}>
          {showIsotopes ? '▾' : '▸'} Common Isotopes Reference
        </button>
        {showIsotopes && (
          <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Isotope', 'Symbol', 'Half-Life', 'Application'].map((h, i) => (
                      <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ISOTOPES.map(iso => (
                    <tr key={iso.symbol} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...TD, textAlign: 'left', color: 'var(--fg)' }}>{iso.name}</td>
                      <td style={{ ...TD, color: '#6366f1', fontWeight: 700 }}>{iso.symbol}</td>
                      <td style={{ ...TD }}>{iso.halfLife.toLocaleString()} {iso.unit}</td>
                      <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-3)' }}>{iso.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── APPLICATIONS NOTE ── */}
      <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)', padding: '16px 20px' }}>
        <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Real-World Applications
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, fontSize: 13, color: 'var(--fg-2)' }}>
          <div><strong style={{ color: '#f59e0b' }}>Carbon Dating</strong> — C-14 half-life 5,730 yr used to date organic material up to ~50,000 yr</div>
          <div><strong style={{ color: '#10b981' }}>Nuclear Medicine</strong> — Tc-99m (6h) used in 80%+ of diagnostic imaging procedures</div>
          <div><strong style={{ color: '#6366f1' }}>Pharmacokinetics</strong> — Drug half-life determines dosing intervals (e.g. aspirin t½ ≈ 6h)</div>
        </div>
      </div>

      {/* ── EXPORT ── */}
      {mode === 'decay' && decayResult && (
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => exportCalcPDF({
              toolName: 'Half-Life Calculator',
              inputs: [
                { label: 'Initial Quantity N₀', value: n0 },
                { label: 'Half-Life', value: `${halfLifeVal} ${halfLifeUnit}` },
                { label: 'Elapsed Time', value: `${elapsedVal} ${elapsedUnit}` },
              ],
              results: [
                { label: 'Remaining N(t)', value: fmtSci(decayResult.Nt), highlight: true },
                { label: '% Remaining', value: pct(decayResult.pctRemaining) },
                { label: '% Decayed', value: pct(decayResult.pctDecayed) },
                { label: 'Half-Lives Elapsed', value: decayResult.nHalfLives.toFixed(4) },
                { label: 'Decay Constant λ', value: fmtSci(decayResult.lambda) },
                { label: 'Mean Lifetime τ', value: fmtSci(decayResult.tau) },
              ],
            })}
            style={BTN_GHOST}
          >
            📄 Export PDF
          </button>
        </div>
      )}

      {!decayResult && mode === 'decay' && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter initial quantity, half-life, and elapsed time — results update instantly.
        </div>
      )}
    </div>
  )
}
