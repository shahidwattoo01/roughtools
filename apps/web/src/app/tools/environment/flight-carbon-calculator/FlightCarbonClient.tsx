'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

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
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = { padding: '7px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── Pre-built common routes ──────────────────────────────────────────────────
const COMMON_ROUTES: Array<{ label: string; from: string; to: string; km: number }> = [
  { label: 'NYC — LAX', from: 'JFK', to: 'LAX', km: 3940 },
  { label: 'NYC — London', from: 'JFK', to: 'LHR', km: 5570 },
  { label: 'LA — Tokyo', from: 'LAX', to: 'NRT', km: 8800 },
  { label: 'London — Dubai', from: 'LHR', to: 'DXB', km: 5500 },
  { label: 'NYC — Paris', from: 'JFK', to: 'CDG', km: 5840 },
  { label: 'London — NYC', from: 'LHR', to: 'JFK', km: 5570 },
  { label: 'Sydney — LA', from: 'SYD', to: 'LAX', km: 12080 },
  { label: 'London — Sydney', from: 'LHR', to: 'SYD', km: 16993 },
  { label: 'NYC — Miami', from: 'JFK', to: 'MIA', km: 2040 },
  { label: 'LA — Chicago', from: 'LAX', to: 'ORD', km: 2800 },
  { label: 'London — Amsterdam', from: 'LHR', to: 'AMS', km: 370 },
  { label: 'Dubai — Singapore', from: 'DXB', to: 'SIN', km: 5840 },
  { label: 'NYC — Toronto', from: 'JFK', to: 'YYZ', km: 570 },
  { label: 'LA — Mexico City', from: 'LAX', to: 'MEX', km: 2545 },
  { label: 'London — Bangkok', from: 'LHR', to: 'BKK', km: 9550 },
  { label: 'Frankfurt — NY', from: 'FRA', to: 'JFK', km: 6200 },
  { label: 'London — Mumbai', from: 'LHR', to: 'BOM', km: 7200 },
  { label: 'NYC — Sao Paulo', from: 'JFK', to: 'GRU', km: 7640 },
  { label: 'London — Cape Town', from: 'LHR', to: 'CPT', km: 9680 },
  { label: 'Singapore — Tokyo', from: 'SIN', to: 'NRT', km: 5350 },
]

// ─── Emission factors (ICAO/DEFRA, kg CO₂/km/pax, economy) ───────────────────
function emissionFactor(km: number): number {
  if (km < 1500) return 0.255
  if (km < 4000) return 0.195
  return 0.150
}
const CLASS_MULT: Record<string, number> = {
  'Economy': 1.0,
  'Premium Economy': 1.5,
  'Business': 2.9,
  'First': 4.0,
}
const RF_MULTIPLIER = 2.0  // radiative forcing (high-altitude effect, DEFRA)

// ─── Types ────────────────────────────────────────────────────────────────────
interface Segment {
  id: number
  label: string
  km: number
  cabinClass: string
}
interface SegmentResult {
  id: number
  label: string
  km: number
  cabinClass: string
  co2PerPaxNoRF: number
  co2PerPaxWithRF: number
  co2TotalWithRF: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcSegment(seg: Segment, passengers: number, rfOn: boolean): SegmentResult {
  const ef = emissionFactor(seg.km)
  const mult = CLASS_MULT[seg.cabinClass] ?? 1.0
  const rfFactor = rfOn ? RF_MULTIPLIER : 1.0
  const co2PerPaxNoRF = seg.km * ef * mult
  const co2PerPaxWithRF = co2PerPaxNoRF * rfFactor
  return {
    id: seg.id,
    label: seg.label,
    km: seg.km,
    cabinClass: seg.cabinClass,
    co2PerPaxNoRF,
    co2PerPaxWithRF,
    co2TotalWithRF: co2PerPaxWithRF * passengers,
  }
}

const kg0 = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' kg'

function MetricCard({ label, value, sub, color = '#6366f1' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ padding: '18px 14px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

let nextId = 1

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FlightCarbonClient() {
  const [segments,    setSegments]   = useState<Segment[]>([
    { id: nextId++, label: 'NYC — London', km: 5570, cabinClass: 'Economy' },
  ])
  const [passengers,  setPassengers] = useState('1')
  const [roundTrip,   setRoundTrip]  = useState(true)
  const [rfOn,        setRfOn]       = useState(true)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const pax = parseInt(passengers) || 1

  const segResults = useMemo<SegmentResult[]>(() =>
    segments.filter(s => s.km > 0).map(s => calcSegment(
      { ...s, km: roundTrip ? s.km * 2 : s.km },
      pax, rfOn,
    ))
  , [segments, pax, roundTrip, rfOn])

  const totalCO2Kg = segResults.reduce((s, r) => s + r.co2PerPaxWithRF, 0)
  const totalTonnes = totalCO2Kg / 1000
  const totalKm = segments.reduce((s, seg) => s + (roundTrip ? seg.km * 2 : seg.km), 0)
  const carMilesEquiv = Math.round(totalCO2Kg / 0.170 * 0.621)
  const treesNeeded = Math.round(totalCO2Kg / 21)

  function addSegment() {
    if (segments.length < 5) setSegments(prev => [...prev, { id: nextId++, label: '', km: 0, cabinClass: 'Economy' }])
  }
  function removeSegment(id: number) {
    setSegments(prev => prev.filter(s => s.id !== id))
  }
  function updateSegment(id: number, field: keyof Segment, value: string | number) {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }
  function applyRoute(route: typeof COMMON_ROUTES[0]) {
    if (segments.length === 1) {
      setSegments([{ id: segments[0].id, label: route.label, km: route.km, cabinClass: segments[0].cabinClass }])
    }
  }

  // Class comparison for first segment
  const firstSeg = segments[0]
  const classComparison = firstSeg && firstSeg.km > 0
    ? Object.keys(CLASS_MULT).map(cls => {
        const km = roundTrip ? firstSeg.km * 2 : firstSeg.km
        const co2 = km * emissionFactor(km) * CLASS_MULT[cls] * (rfOn ? RF_MULTIPLIER : 1)
        return { cls, co2 }
      })
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        {/* Toggles row */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)' }}>
            <input type="checkbox" checked={roundTrip} onChange={e => setRoundTrip(e.target.checked)} style={{ accentColor: '#6366f1' }} />
            Round trip
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)' }}>
            <input type="checkbox" checked={rfOn} onChange={e => setRfOn(e.target.checked)} style={{ accentColor: '#6366f1' }} />
            Radiative forcing (x{RF_MULTIPLIER})
          </label>
          <div style={{ marginLeft: 'auto', minWidth: 120 }}>
            <label style={LABEL}>Passengers</label>
            <input type="number" value={passengers} onChange={e => setPassengers(e.target.value)}
              min={1} max={20} step={1} style={{ ...INPUT_BOX, width: 80 }} aria-label="Passengers" />
          </div>
        </div>

        {/* Quick route picker */}
        <div style={{ marginBottom: 16 }}>
          <label style={LABEL}>Quick Route (applies to Segment 1)</label>
          <select onChange={e => { const r = COMMON_ROUTES.find(rt => rt.label === e.target.value); if (r) applyRoute(r) }}
            style={INPUT_BOX} defaultValue="" aria-label="Quick route picker">
            <option value="" disabled>— Select a common route —</option>
            {COMMON_ROUTES.map(r => <option key={r.label} value={r.label}>{r.label} ({r.km.toLocaleString()} km)</option>)}
          </select>
        </div>

        {/* Segments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {segments.map((seg, idx) => (
            <div key={seg.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 140px auto', gap: 10, alignItems: 'end' }}>
              <div>
                <label style={LABEL}>Segment {idx + 1} — Label / Route</label>
                <input type="text" value={seg.label} onChange={e => updateSegment(seg.id, 'label', e.target.value)}
                  placeholder="e.g. NYC — Paris" style={INPUT_BOX} />
              </div>
              <div>
                <label style={LABEL}>Distance (km)</label>
                <input type="number" value={seg.km || ''} onChange={e => updateSegment(seg.id, 'km', parseFloat(e.target.value) || 0)}
                  placeholder="0" min={0} step={50} style={INPUT_BOX} />
              </div>
              <div>
                <label style={LABEL}>Class</label>
                <select value={seg.cabinClass} onChange={e => updateSegment(seg.id, 'cabinClass', e.target.value)} style={INPUT_BOX}>
                  {Object.keys(CLASS_MULT).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button
                onClick={() => removeSegment(seg.id)}
                disabled={segments.length === 1}
                style={{ ...BTN_GHOST, padding: '10px 14px', opacity: segments.length === 1 ? 0.4 : 1, alignSelf: 'flex-end' }}
                aria-label="Remove segment"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {segments.length < 5 && (
          <button onClick={addSegment} style={{ ...BTN_GHOST, marginTop: 14 }}>+ Add Segment</button>
        )}
      </div>

      {/* ── RESULTS ── */}
      {totalCO2Kg > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Total CO₂ (per pax)" value={kg0(totalCO2Kg)} sub={totalTonnes.toFixed(3) + ' tonnes'} color="#f59e0b" />
            <MetricCard label={`Total CO₂ (${pax} pax)`} value={kg0(totalCO2Kg * pax)} color="#ef4444" />
            <MetricCard label="Total Distance" value={totalKm.toLocaleString() + ' km'} sub={roundTrip ? 'Round trip' : 'One way'} color="#6366f1" />
            <MetricCard label="Equiv. Car Miles" value={carMilesEquiv.toLocaleString()} sub="at avg 170g CO₂/km" color="#38bdf8" />
            <MetricCard label="Trees to Offset" value={treesNeeded.toLocaleString()} sub="for 1 year" color="#10b981" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => exportCalcPDF({
                toolName: 'Flight Carbon Calculator',
                inputs: [
                  { label: 'Passengers', value: passengers }, { label: 'Round Trip', value: roundTrip ? 'Yes' : 'No' },
                  { label: 'Radiative Forcing', value: rfOn ? `On (x${RF_MULTIPLIER})` : 'Off' },
                  { label: 'Segments', value: segments.length },
                ],
                results: [
                  { label: 'Total CO2 (per passenger)', value: kg0(totalCO2Kg), highlight: true },
                  { label: `Total CO2 (${pax} passengers)`, value: kg0(totalCO2Kg * pax) },
                  { label: 'Total Distance', value: totalKm.toLocaleString() + ' km' },
                  { label: 'Equivalent Car Miles', value: carMilesEquiv.toLocaleString() },
                  { label: 'Trees to Offset (1 year)', value: treesNeeded.toLocaleString() },
                ],
                tableHeaders: ['Segment', 'Distance', 'Class', 'CO2/pax (no RF)', 'CO2/pax (with RF)', `CO2 total (${pax}p)`],
                tableRows: segResults.map(r => ({
                  Segment: r.label || `Segment ${r.id}`, Distance: r.km.toLocaleString() + ' km',
                  Class: r.cabinClass, 'CO2/pax (no RF)': kg0(r.co2PerPaxNoRF),
                  'CO2/pax (with RF)': kg0(r.co2PerPaxWithRF), [`CO2 total (${pax}p)`]: kg0(r.co2TotalWithRF),
                })),
              })}
              style={BTN_GHOST}
            >
              Export PDF
            </button>
          </div>

          {/* RF note */}
          {rfOn && (
            <div style={{ ...CARD, padding: '12px 20px', background: 'rgba(251,191,36,0.05)', borderColor: 'rgba(251,191,36,0.2)' }}>
              <span style={{ fontSize: 12, color: '#fbbf24' }}>
                Radiative forcing (x{RF_MULTIPLIER}) is ON — accounts for high-altitude contrail and NOx warming effects per DEFRA methodology. Toggle off for CO₂-only figures.
              </span>
            </div>
          )}

          {/* Segment breakdown */}
          {segments.length > 1 && (
            <div>
              <button
                onClick={() => setShowBreakdown(v => !v)}
                style={{ width: '100%', textAlign: 'left', padding: '14px 20px', background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                aria-expanded={showBreakdown}
              >
                {showBreakdown ? '▾' : '▸'} Per-Segment Breakdown
              </button>
              {showBreakdown && (
                <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr>
                          {['Segment', 'Distance', 'Class', 'CO₂/pax (no RF)', 'CO₂/pax (with RF)', `CO₂ total (${pax}p)`].map((h, i) => (
                            <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {segResults.map(r => (
                          <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-2)' }}>{r.label || `Segment ${r.id}`}</td>
                            <td style={TD}>{r.km.toLocaleString()} km</td>
                            <td style={{ ...TD, textAlign: 'center' }}>{r.cabinClass}</td>
                            <td style={TD}>{kg0(r.co2PerPaxNoRF)}</td>
                            <td style={{ ...TD, color: '#f59e0b', fontWeight: 600 }}>{kg0(r.co2PerPaxWithRF)}</td>
                            <td style={{ ...TD, color: '#ef4444' }}>{kg0(r.co2TotalWithRF)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Class comparison for segment 1 */}
          {classComparison && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Class Comparison — {firstSeg.label || 'Segment 1'}
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {['Class', 'CO₂ per Passenger', 'vs Economy', 'Multiplier'].map((h, i) => (
                        <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {classComparison.map(({ cls, co2 }) => {
                      const ecoCO2 = classComparison[0].co2
                      const highlight = cls === firstSeg.cabinClass
                      return (
                        <tr key={cls} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: highlight ? 'rgba(139,92,246,0.08)' : 'transparent' }}>
                          <td style={{ ...TD, textAlign: 'left', color: highlight ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: highlight ? 700 : 400 }}>{highlight ? '★ ' : ''}{cls}</td>
                          <td style={{ ...TD, color: '#f59e0b', fontWeight: highlight ? 700 : 400 }}>{kg0(co2)}</td>
                          <td style={TD}>{co2 > ecoCO2 ? `+${((co2 / ecoCO2 - 1) * 100).toFixed(0)}%` : 'Baseline'}</td>
                          <td style={TD}>x{CLASS_MULT[cls].toFixed(1)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Insights */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Key Insights
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 9 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                Your {pax > 1 ? `group of ${pax} passengers` : 'flight'} emits {kg0(totalCO2Kg * pax)} CO₂ total — equivalent to driving {carMilesEquiv.toLocaleString()} miles in an average car.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                It would take {treesNeeded.toLocaleString()} trees an entire year to absorb your share of these emissions through natural carbon sequestration.
              </li>
              {firstSeg.cabinClass !== 'Economy' && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  Flying {firstSeg.cabinClass} uses {CLASS_MULT[firstSeg.cabinClass]}x more carbon per passenger than Economy, due to larger seat footprint and fewer seats per aircraft.
                </li>
              )}
            </ul>
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter a flight distance above (or select a common route) to see your carbon footprint instantly.
        </div>
      )}
    </div>
  )
}
