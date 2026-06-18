'use client';
import { useState, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { exportCalcPDF } from '@/lib/calcPdf';

// ─── Style tokens ─────────────────────────────────────────────────────────────
const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px 28px',
};
const INPUT_BOX: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  background: 'var(--bg-2)',
  border: '1px solid var(--line-strong)',
  color: 'var(--fg)',
  fontSize: 15,
  boxSizing: 'border-box',
};
const LABEL: CSSProperties = {
  display: 'block',
  marginBottom: 5,
  fontSize: 12,
  color: 'var(--fg-3)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  background: 'rgba(139,92,246,0.12)',
  border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8,
  padding: '9px 18px',
  color: 'var(--brand-2)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};
const TH: CSSProperties = {
  padding: '9px 12px',
  fontWeight: 700,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: 'var(--fg-3)',
  textAlign: 'right',
  background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
};
const TD: CSSProperties = {
  padding: '7px 12px',
  fontSize: 12,
  textAlign: 'right',
  color: 'var(--fg-2)',
  whiteSpace: 'nowrap',
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const US_STATES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];

const HEATING_SYSTEMS = [
  { label: 'Gas furnace', mult: 1.0, co2Factor: 0.203 },
  { label: 'Gas furnace (high-eff 95%)', mult: 0.82, co2Factor: 0.203 },
  { label: 'Oil boiler', mult: 1.12, co2Factor: 0.268 },
  { label: 'Electric resistance', mult: 1.35, co2Factor: 0.386 },
  { label: 'Air source heat pump', mult: 0.6, co2Factor: 0.386 },
  { label: 'Ground source heat pump', mult: 0.45, co2Factor: 0.386 },
  { label: 'Propane furnace', mult: 1.05, co2Factor: 0.214 },
];

const COOLING_SYSTEMS = [
  { label: 'Central A/C (SEER 10–13)', mult: 1.2 },
  { label: 'Central A/C (SEER 14–17)', mult: 1.0 },
  { label: 'Central A/C (SEER 18+)', mult: 0.82 },
  { label: 'Window units', mult: 1.3 },
  { label: 'Heat pump cooling', mult: 0.75 },
  { label: 'No central cooling', mult: 0.3 },
];

const WINDOW_TYPES = [
  { label: 'Single-pane', u: 1.27 },
  { label: 'Double-pane (clear)', u: 0.5 },
  { label: 'Double-pane (low-e)', u: 0.35 },
  { label: 'Triple-pane', u: 0.22 },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Improvement {
  name: string;
  savingPerYear: number;
  cost: number;
  paybackYears: number;
  co2Saved: number;
}
interface AuditResult {
  score: number; // 1–10
  annualEnergyCost: number;
  monthlyAvg: number;
  co2Tonnes: number;
  breakdown: { label: string; pct: number; color: string }[];
  improvements: Improvement[];
  scenarios: Array<{ label: string; cost: number; co2: number; score: number }>;
}

// ─── Calculation engine ───────────────────────────────────────────────────────
function runAudit(
  sqft: number,
  yearBuilt: number,
  state: string,
  occupants: number,
  heatingSys: string,
  heatingAge: number,
  coolingStr: string,
  waterHeater: string,
  atticR: number,
  wallR: number,
  windowType: string,
  energyCost: number // $/kWh (blended)
): AuditResult {
  // Base MMBTU/yr by size + climate zone approximation
  const climateStates: Record<string, number> = {
    FL: 0.7,
    HI: 0.5,
    AZ: 0.75,
    CA: 0.8,
    TX: 0.85,
    GA: 0.9,
    SC: 0.9,
    AL: 0.85,
    MS: 0.85,
    LA: 0.8,
    AR: 0.9,
    TN: 0.95,
    NC: 0.95,
    VA: 1.0,
    KY: 1.05,
    MO: 1.1,
    IL: 1.15,
    IN: 1.1,
    OH: 1.1,
    PA: 1.1,
    NJ: 1.05,
    NY: 1.1,
    CT: 1.1,
    MA: 1.15,
    ME: 1.25,
    NH: 1.25,
    VT: 1.25,
    WI: 1.2,
    MN: 1.3,
    ND: 1.35,
    SD: 1.3,
    WY: 1.2,
    MT: 1.25,
    ID: 1.1,
    WA: 0.95,
    OR: 0.95,
    CO: 1.1,
    UT: 1.05,
    NV: 0.9,
    NM: 1.0,
    AK: 1.5,
  };
  const climateMult = climateStates[state] ?? 1.0;

  // Base kBtu/sqft/yr (EIA RECS) * sqft
  const baseKBtu = sqft * 50 * climateMult;

  // Heating system
  const hs = HEATING_SYSTEMS.find((h) => h.label === heatingSys) ?? HEATING_SYSTEMS[0];
  const heatingAgeMult =
    heatingAge > 20 ? 1.15 : heatingAge > 15 ? 1.08 : heatingAge > 10 ? 1.03 : 1.0;

  // Cooling
  const cs = COOLING_SYSTEMS.find((c) => c.label === coolingStr) ?? COOLING_SYSTEMS[1];

  // Insulation penalty
  const atticPenalty = atticR < 19 ? 1.18 : atticR < 30 ? 1.09 : atticR < 49 ? 1.0 : 0.94;
  const wallPenalty = wallR < 11 ? 1.12 : wallR < 15 ? 1.05 : 1.0;

  // Window
  const wt = WINDOW_TYPES.find((w) => w.label === windowType) ?? WINDOW_TYPES[1];
  const windowPenalty = wt.u > 0.8 ? 1.1 : wt.u > 0.45 ? 1.0 : 0.96;

  // Water heater
  const whMult = waterHeater.includes('heat pump')
    ? 0.55
    : waterHeater.includes('tankless')
      ? 0.82
      : 1.0;

  // Occupants
  const occMult = 0.7 + (occupants - 1) * 0.12;

  const totalKBtu =
    baseKBtu *
    hs.mult *
    heatingAgeMult *
    cs.mult *
    atticPenalty *
    wallPenalty *
    windowPenalty *
    whMult *
    occMult;
  const _totalMMBtu = totalKBtu / 1000;

  // Annual cost (convert kBtu to kWh equiv for blended rate estimate)
  const kwhEquiv = totalKBtu / 3.412;
  const annualEnergyCost = kwhEquiv * energyCost;
  const monthlyAvg = annualEnergyCost / 12;

  // CO₂
  const co2Tonnes = (totalKBtu / 3412) * hs.co2Factor;

  // Score 1–10 (10 = best, based on kBtu/sqft/yr)
  const kBtuPerSqft = totalKBtu / sqft;
  const scoreRaw = Math.max(1, Math.min(10, 10 - (kBtuPerSqft - 20) / 8));
  const score = Math.round(scoreRaw * 10) / 10;

  // Breakdown
  const heatingPct = hs.label.includes('heat pump') ? 35 : 48;
  const coolingPct = cs.mult < 0.5 ? 5 : 15;
  const waterPct = 18;
  const applPct = 20;
  const lightPct = 100 - heatingPct - coolingPct - waterPct - applPct;
  const breakdown = [
    { label: 'Space Heating', pct: heatingPct, color: '#f59e0b' },
    { label: 'Space Cooling', pct: coolingPct, color: '#38bdf8' },
    { label: 'Water Heating', pct: waterPct, color: '#6366f1' },
    { label: 'Appliances', pct: applPct, color: '#8b5cf6' },
    { label: 'Lighting', pct: Math.max(2, lightPct), color: '#fbbf24' },
  ];

  // Top 5 improvements
  const improvements: Improvement[] = [];

  if (atticR < 30) {
    const sav = annualEnergyCost * 0.15;
    improvements.push({
      name: 'Add attic insulation to R-38+',
      savingPerYear: sav,
      cost: 1800,
      paybackYears: Math.round((1800 / sav) * 10) / 10,
      co2Saved: Math.round(co2Tonnes * 0.15 * 100) / 100,
    });
  }
  if (wallR < 13) {
    const sav = annualEnergyCost * 0.12;
    improvements.push({
      name: 'Add wall insulation (R-13+)',
      savingPerYear: sav,
      cost: 2500,
      paybackYears: Math.round((2500 / sav) * 10) / 10,
      co2Saved: Math.round(co2Tonnes * 0.12 * 100) / 100,
    });
  }
  if (wt.u > 0.45) {
    const sav = annualEnergyCost * 0.1;
    improvements.push({
      name: 'Upgrade to double/triple-pane windows',
      savingPerYear: sav,
      cost: 6000,
      paybackYears: Math.round((6000 / sav) * 10) / 10,
      co2Saved: Math.round(co2Tonnes * 0.1 * 100) / 100,
    });
  }
  if (heatingSys.includes('Gas') && !heatingSys.includes('high-eff')) {
    const sav = annualEnergyCost * 0.22;
    improvements.push({
      name: 'Upgrade to high-efficiency furnace (95% AFUE)',
      savingPerYear: sav,
      cost: 3500,
      paybackYears: Math.round((3500 / sav) * 10) / 10,
      co2Saved: Math.round(co2Tonnes * 0.22 * 100) / 100,
    });
  }
  if (!heatingSys.includes('heat pump')) {
    const sav = annualEnergyCost * 0.28;
    improvements.push({
      name: 'Switch to air source heat pump',
      savingPerYear: sav,
      cost: 8000,
      paybackYears: Math.round((8000 / sav) * 10) / 10,
      co2Saved: Math.round(co2Tonnes * 0.28 * 100) / 100,
    });
  }
  if (!waterHeater.includes('heat pump')) {
    const sav = annualEnergyCost * 0.08;
    improvements.push({
      name: 'Install heat pump water heater',
      savingPerYear: sav,
      cost: 1500,
      paybackYears: Math.round((1500 / sav) * 10) / 10,
      co2Saved: Math.round(co2Tonnes * 0.08 * 100) / 100,
    });
  }
  const sav = annualEnergyCost * 0.06;
  improvements.push({
    name: 'LED lighting & smart power strips',
    savingPerYear: sav,
    cost: 300,
    paybackYears: Math.round((300 / sav) * 10) / 10,
    co2Saved: Math.round(co2Tonnes * 0.06 * 100) / 100,
  });
  improvements.sort((a, b) => b.savingPerYear - a.savingPerYear);

  // Scenarios
  const minUpgradeSaving = annualEnergyCost * 0.18;
  const fullUpgradeSaving = annualEnergyCost * 0.42;
  const scenarios = [
    { label: 'Current State', cost: annualEnergyCost, co2: co2Tonnes, score },
    {
      label: 'Minimum Upgrades',
      cost: annualEnergyCost - minUpgradeSaving,
      co2: co2Tonnes * 0.82,
      score: Math.min(10, score + 1.5),
    },
    {
      label: 'Full Efficiency Upgrade',
      cost: annualEnergyCost - fullUpgradeSaving,
      co2: co2Tonnes * 0.58,
      score: Math.min(10, score + 3.5),
    },
  ];

  return {
    score,
    annualEnergyCost,
    monthlyAvg,
    co2Tonnes,
    breakdown,
    improvements: improvements.slice(0, 5),
    scenarios,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const $ = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

function MetricCard({
  label,
  value,
  sub,
  color = '#6366f1',
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div
      style={{
        padding: '18px 14px',
        background: 'var(--bg-2)',
        borderRadius: 12,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--fg-3)',
          marginTop: 4,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'number',
  min,
  max,
  step,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        style={INPUT_BOX}
        aria-label={label}
      />
      {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomeEnergyClient() {
  const [sqft, setSqft] = useState('1800');
  const [yearBuilt, setYearBuilt] = useState('1985');
  const [state, setState] = useState('TX');
  const [occupants, setOccupants] = useState('3');
  const [heatingSys, setHeatingSys] = useState(HEATING_SYSTEMS[0].label);
  const [heatingAge, setHeatingAge] = useState('12');
  const [coolingSys, setCoolingSys] = useState(COOLING_SYSTEMS[1].label);
  const [waterHeater, setWaterHeater] = useState('Gas tank water heater');
  const [atticR, setAtticR] = useState('19');
  const [wallR, setWallR] = useState('11');
  const [windowType, setWindowType] = useState(WINDOW_TYPES[1].label);
  const [energyCost, setEnergyCost] = useState('0.13');
  const [showImprov, setShowImprov] = useState(false);
  const [showAdv, setShowAdv] = useState(false);

  const result = useMemo<AuditResult | null>(() => {
    const sqftN = parseFloat(sqft) || 0;
    if (sqftN <= 0) return null;
    return runAudit(
      sqftN,
      parseInt(yearBuilt) || 1985,
      state,
      parseInt(occupants) || 3,
      heatingSys,
      parseInt(heatingAge) || 0,
      coolingSys,
      waterHeater,
      parseFloat(atticR) || 19,
      parseFloat(wallR) || 11,
      windowType,
      parseFloat(energyCost) || 0.13
    );
  }, [
    sqft,
    yearBuilt,
    state,
    occupants,
    heatingSys,
    heatingAge,
    coolingSys,
    waterHeater,
    atticR,
    wallR,
    windowType,
    energyCost,
  ]);

  // Score color
  const scoreColor = result
    ? result.score >= 8
      ? '#10b981'
      : result.score >= 6
        ? '#6366f1'
        : result.score >= 4
          ? '#f59e0b'
          : '#ef4444'
    : '#6366f1';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <Field
            label="Home Size (sq ft)"
            value={sqft}
            onChange={setSqft}
            placeholder="1800"
            min={200}
            step={100}
          />
          <Field
            label="Year Built"
            value={yearBuilt}
            onChange={setYearBuilt}
            placeholder="1985"
            min={1900}
            max={2025}
            step={1}
          />
          <div>
            <label style={LABEL}>State</label>
            <select value={state} onChange={(e) => setState(e.target.value)} style={INPUT_BOX}>
              {US_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <Field
            label="Occupants"
            value={occupants}
            onChange={setOccupants}
            placeholder="3"
            min={1}
            max={15}
            step={1}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <label style={LABEL}>Heating System</label>
            <select
              value={heatingSys}
              onChange={(e) => setHeatingSys(e.target.value)}
              style={INPUT_BOX}
            >
              {HEATING_SYSTEMS.map((h) => (
                <option key={h.label}>{h.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={LABEL}>Cooling System</label>
            <select
              value={coolingSys}
              onChange={(e) => setCoolingSys(e.target.value)}
              style={INPUT_BOX}
            >
              {COOLING_SYSTEMS.map((c) => (
                <option key={c.label}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={LABEL}>Water Heater</label>
            <select
              value={waterHeater}
              onChange={(e) => setWaterHeater(e.target.value)}
              style={INPUT_BOX}
            >
              {[
                'Gas tank water heater',
                'Electric tank water heater',
                'Tankless gas',
                'Tankless electric',
                'Heat pump water heater',
                'Solar water heater',
              ].map((wh) => (
                <option key={wh}>{wh}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowAdv((v) => !v)}
          style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }}
          aria-expanded={showAdv}
        >
          {showAdv ? '▾' : '▸'} Insulation & Windows
        </button>

        {showAdv && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 16,
              paddingTop: 16,
              borderTop: '1px solid var(--line-strong)',
            }}
          >
            <Field
              label="Heating System Age (yrs)"
              value={heatingAge}
              onChange={setHeatingAge}
              placeholder="12"
              min={0}
              max={40}
              step={1}
            />
            <Field
              label="Attic Insulation (R-value)"
              value={atticR}
              onChange={setAtticR}
              placeholder="19"
              min={0}
              max={60}
              step={1}
              hint="Code min: R-30 to R-60"
            />
            <Field
              label="Wall Insulation (R-value)"
              value={wallR}
              onChange={setWallR}
              placeholder="11"
              min={0}
              max={30}
              step={1}
              hint="Code min: R-13"
            />
            <div>
              <label style={LABEL}>Window Type</label>
              <select
                value={windowType}
                onChange={(e) => setWindowType(e.target.value)}
                style={INPUT_BOX}
              >
                {WINDOW_TYPES.map((w) => (
                  <option key={w.label}>{w.label}</option>
                ))}
              </select>
            </div>
            <Field
              label="Energy Cost ($/kWh)"
              value={energyCost}
              onChange={setEnergyCost}
              placeholder="0.13"
              min={0.05}
              step={0.01}
              hint="Blended rate"
            />
          </div>
        )}
      </div>

      {/* ── RESULTS ── */}
      {result ? (
        <>
          {/* Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
            }}
          >
            <MetricCard
              label="Energy Score"
              value={`${result.score.toFixed(1)} / 10`}
              sub={result.score >= 7 ? 'Efficient' : result.score >= 5 ? 'Average' : 'Needs Work'}
              color={scoreColor}
            />
            <MetricCard
              label="Annual Energy Cost"
              value={$(result.annualEnergyCost)}
              color="#f59e0b"
            />
            <MetricCard label="Monthly Average" value={$(result.monthlyAvg)} color="#6366f1" />
            <MetricCard
              label="CO₂ Equivalent"
              value={result.co2Tonnes.toFixed(1) + ' t'}
              sub="tonnes CO₂e/yr"
              color="#38bdf8"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() =>
                exportCalcPDF({
                  toolName: 'Home Energy Audit',
                  inputs: [
                    { label: 'Home Size', value: sqft, unit: 'sq ft' },
                    { label: 'Year Built', value: yearBuilt },
                    { label: 'State', value: state },
                    { label: 'Occupants', value: occupants },
                    { label: 'Heating System', value: heatingSys },
                    { label: 'Cooling System', value: coolingSys },
                    { label: 'Water Heater', value: waterHeater },
                    { label: 'Attic R-Value', value: atticR },
                    { label: 'Wall R-Value', value: wallR },
                    { label: 'Window Type', value: windowType },
                  ],
                  results: [
                    {
                      label: 'Energy Score',
                      value: `${result.score.toFixed(1)} / 10`,
                      highlight: true,
                    },
                    { label: 'Annual Energy Cost', value: $(result.annualEnergyCost) },
                    { label: 'Monthly Average', value: $(result.monthlyAvg) },
                    { label: 'CO2 Equivalent', value: result.co2Tonnes.toFixed(1) + ' t/yr' },
                  ],
                  tableHeaders: [
                    'Improvement',
                    'Saves $/yr',
                    'Est. Cost',
                    'Payback (yrs)',
                    'CO2 Saved (t)',
                  ],
                  tableRows: result.improvements.map((imp) => ({
                    Improvement: imp.name,
                    'Saves $/yr': $(imp.savingPerYear),
                    'Est. Cost': $(imp.cost),
                    'Payback (yrs)': imp.paybackYears,
                    'CO2 Saved (t)': imp.co2Saved.toFixed(2),
                  })),
                })
              }
              style={BTN_GHOST}
            >
              Export PDF
            </button>
          </div>

          {/* Breakdown */}
          <div style={{ ...CARD, padding: '20px 24px' }}>
            <div
              style={{
                fontSize: 12,
                color: 'var(--fg-3)',
                marginBottom: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Energy Use Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.breakdown.map((b) => (
                <div key={b.label}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: 'var(--fg-3)' }}>{b.label}</span>
                    <span style={{ color: 'var(--fg-2)', fontWeight: 600 }}>{b.pct}%</span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.08)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background: b.color,
                        borderRadius: 4,
                        width: `${b.pct}%`,
                        transition: 'width 0.4s',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scenario comparison */}
          <div style={CARD}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--fg-2)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                }}
              >
                Scenario Comparison
              </h3>
              <button
                onClick={() =>
                  exportCalcPDF({
                    toolName: 'Home Energy Audit',
                    inputs: [
                      { label: 'Home Size', value: sqft, unit: 'sq ft' },
                      { label: 'Year Built', value: yearBuilt },
                      { label: 'State', value: state },
                      { label: 'Occupants', value: occupants },
                      { label: 'Heating System', value: heatingSys },
                      { label: 'Cooling System', value: coolingSys },
                      { label: 'Water Heater', value: waterHeater },
                      { label: 'Attic R-Value', value: atticR },
                      { label: 'Wall R-Value', value: wallR },
                      { label: 'Window Type', value: windowType },
                    ],
                    results: [
                      {
                        label: 'Energy Score',
                        value: `${result.score.toFixed(1)} / 10`,
                        highlight: true,
                      },
                      { label: 'Annual Energy Cost', value: $(result.annualEnergyCost) },
                      { label: 'Monthly Average', value: $(result.monthlyAvg) },
                      { label: 'CO2 Equivalent', value: result.co2Tonnes.toFixed(1) + ' t/yr' },
                    ],
                    tableHeaders: [
                      'Improvement',
                      'Saves $/yr',
                      'Est. Cost',
                      'Payback (yrs)',
                      'CO2 Saved (t)',
                    ],
                    tableRows: result.improvements.map((imp) => ({
                      Improvement: imp.name,
                      'Saves $/yr': $(imp.savingPerYear),
                      'Est. Cost': $(imp.cost),
                      'Payback (yrs)': imp.paybackYears,
                      'CO2 Saved (t)': imp.co2Saved.toFixed(2),
                    })),
                  })
                }
                style={BTN_GHOST}
              >
                Export PDF
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Scenario', 'Annual Cost', 'CO₂ (tonnes)', 'Energy Score'].map((h, i) => (
                      <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.scenarios.map((sc, i) => (
                    <tr
                      key={sc.label}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: i === 0 ? 'rgba(139,92,246,0.08)' : 'transparent',
                      }}
                    >
                      <td
                        style={{
                          ...TD,
                          textAlign: 'left',
                          color: i === 0 ? 'var(--brand-2)' : 'var(--fg-2)',
                          fontWeight: i === 0 ? 700 : 400,
                        }}
                      >
                        {i === 0 ? '★ ' : ''}
                        {sc.label}
                      </td>
                      <td style={{ ...TD, color: i > 0 ? '#10b981' : 'var(--fg-2)' }}>
                        {$(sc.cost)}
                      </td>
                      <td style={TD}>{sc.co2.toFixed(2)}</td>
                      <td
                        style={{
                          ...TD,
                          color: sc.score >= 7 ? '#10b981' : sc.score >= 5 ? '#f59e0b' : '#ef4444',
                        }}
                      >
                        {sc.score.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top improvements */}
          <div>
            <button
              onClick={() => setShowImprov((v) => !v)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '14px 20px',
                background: 'var(--bg-1)',
                border: '1px solid var(--line-strong)',
                borderRadius: 12,
                color: 'var(--brand-2)',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
              aria-expanded={showImprov}
            >
              {showImprov ? '▾' : '▸'} Top 5 Improvement Actions
            </button>
            {showImprov && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr>
                        {[
                          'Improvement',
                          'Saves $/yr',
                          'Est. Cost',
                          'Payback (yrs)',
                          'CO₂ Saved (t)',
                        ].map((h, i) => (
                          <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.improvements.map((imp, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-2)' }}>
                            {imp.name}
                          </td>
                          <td style={{ ...TD, color: '#10b981', fontWeight: 600 }}>
                            {$(imp.savingPerYear)}
                          </td>
                          <td style={TD}>{$(imp.cost)}</td>
                          <td
                            style={{
                              ...TD,
                              color:
                                imp.paybackYears <= 5
                                  ? '#6366f1'
                                  : imp.paybackYears <= 12
                                    ? '#f59e0b'
                                    : 'var(--fg-3)',
                            }}
                          >
                            {imp.paybackYears}
                          </td>
                          <td style={{ ...TD, color: '#38bdf8' }}>{imp.co2Saved.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Insights */}
          <div
            style={{
              ...CARD,
              background: 'rgba(99,102,241,0.06)',
              borderColor: 'rgba(99,102,241,0.2)',
            }}
          >
            <h3
              style={{
                margin: '0 0 12px',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--brand-2)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}
            >
              Key Insights
            </h3>
            <ul
              style={{
                margin: 0,
                paddingLeft: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 9,
              }}
            >
              {[
                `Your home scores ${result.score.toFixed(1)}/10 on energy efficiency. The US average is about 5.0. ${result.score >= 7 ? 'Your home is above average.' : result.score >= 5 ? 'There is meaningful room for improvement.' : 'Significant savings are available through targeted upgrades.'}`,
                `At ${$(result.monthlyAvg)}/month and ${result.co2Tonnes.toFixed(1)} tonnes CO₂/year, ${result.improvements[0] ? `your biggest opportunity is: ${result.improvements[0].name} — saving ${$(result.improvements[0].savingPerYear)}/year.` : 'focus on insulation and HVAC upgrades first.'}`,
              ].map((tip, i) => (
                <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div
          style={{
            ...CARD,
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--fg-3)',
            fontSize: 14,
          }}
        >
          Enter your home size above — results update instantly.
        </div>
      )}
    </div>
  );
}
