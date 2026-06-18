'use client';
import { useState, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { exportCalcPDF } from '@/lib/calcPdf';

// ─── Style Tokens ─────────────────────────────────────────────────────────────

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
  padding: '6px 12px',
  fontSize: 12,
  textAlign: 'right',
  color: 'var(--fg-2)',
  whiteSpace: 'nowrap',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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
  min,
  max,
  step,
  hint,
  type = 'number',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  type?: string;
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

function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...INPUT_BOX, cursor: 'pointer' }}
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

// ─── Constants (EPA 2024 / IPCC AR6) ─────────────────────────────────────────

const DIET_EMISSIONS_KG: Record<string, number> = {
  vegan: 1500,
  vegetarian: 1700,
  pescatarian: 2000,
  omnivore: 2500,
  heavy_meat: 3300,
};

const GRID_INTENSITY: Record<string, number> = {
  us_avg: 0.386,
  northeast: 0.28,
  california: 0.21,
  northwest: 0.18,
  southeast: 0.45,
  midwest: 0.52,
  texas: 0.44,
  southwest: 0.35,
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface CarbonInputs {
  carMiles: number;
  mpg: number;
  fuelType: string;
  shortFlights: number;
  medFlights: number;
  longFlights: number;
  busHrs: number;
  trainHrs: number;
  motorbikeMiles: number;
  electricityKwh: number;
  gridRegion: string;
  naturalGasTherms: number;
  heatingOilGal: number;
  propaneGal: number;
  dietType: string;
  clothingItems: number;
  electronicsCount: number;
  onlineOrdersPerWeek: number;
  recyclingPct: number;
  composting: boolean;
  renewableEnergy: boolean;
}

interface CarbonResult {
  transport: number;
  homeEnergy: number;
  diet: number;
  shopping: number;
  total: number;
  totalTonnes: number;
  perDay: number;
  vsUSAvg: number;
  vsWorldAvg: number;
  reductions: { action: string; savings: number }[];
}

// ─── Calculation Engine ───────────────────────────────────────────────────────

function calcCarbon(inp: CarbonInputs): CarbonResult {
  // --- Transportation ---
  const mpgEff = inp.mpg > 0 ? inp.mpg : 28;
  const gasCo2PerGal = inp.fuelType === 'diesel' ? 10.21 : 8.887; // kg CO2/gal (EPA)
  const carEmissions =
    inp.fuelType === 'electric'
      ? inp.carMiles * 0.12 // EV: avg 0.12 kg CO2e/mile on US grid
      : (inp.carMiles / mpgEff) * gasCo2PerGal;

  // Flights: radiative forcing x2 included per IPCC AR6
  const shortFlight = inp.shortFlights * 500 * 2 * 0.255 * 2; // avg 500km one-way
  const medFlight = inp.medFlights * 2500 * 2 * 0.195 * 2;
  const longFlight = inp.longFlights * 9000 * 2 * 0.15 * 2;
  const busEmissions = inp.busHrs * 52 * 20 * 0.089; // 20km/hr avg speed, 0.089 kg/km
  const trainEmissions = inp.trainHrs * 52 * 60 * 0.037; // 60km/hr avg, 0.037 kg/km
  const motoEmissions = inp.motorbikeMiles * 0.113;
  const transport =
    carEmissions +
    shortFlight +
    medFlight +
    longFlight +
    busEmissions +
    trainEmissions +
    motoEmissions;

  // --- Home Energy ---
  const gridFactor = GRID_INTENSITY[inp.gridRegion] ?? 0.386;
  const renewMult = inp.renewableEnergy ? 0.05 : 1.0;
  const electricityEmissions = inp.electricityKwh * 12 * gridFactor * renewMult;
  const gasEmissions = inp.naturalGasTherms * 12 * 5.3; // 5.3 kg CO2e/therm
  const oilEmissions = inp.heatingOilGal * 10.15; // kg CO2e/gallon
  const propaneEmissions = inp.propaneGal * 5.74;
  const homeEnergy = electricityEmissions + gasEmissions + oilEmissions + propaneEmissions;

  // --- Diet ---
  const diet = DIET_EMISSIONS_KG[inp.dietType] ?? 2500;

  // --- Shopping ---
  const clothingEmissions = inp.clothingItems * 22; // 22 kg CO2e per garment
  const electronicsEmissions = inp.electronicsCount * 160; // 160 kg CO2e per device
  const onlineOrderEmissions = inp.onlineOrdersPerWeek * 52 * 0.5;
  const shopping = clothingEmissions + electronicsEmissions + onlineOrderEmissions;

  let total = transport + homeEnergy + diet + shopping;
  const recyclingReduction = total * (inp.recyclingPct / 100) * 0.04;
  const compostingReduction = inp.composting ? 280 : 0;
  total = total - recyclingReduction - compostingReduction;

  const totalTonnes = total / 1000;
  const perDay = total / 365;

  // --- Ranked reduction actions ---
  const reductions: { action: string; savings: number }[] = [];
  if (inp.carMiles > 5000 && inp.fuelType !== 'electric')
    reductions.push({
      action: 'Switch to electric vehicle',
      savings: Math.round(carEmissions * 0.72),
    });
  if (inp.longFlights > 0)
    reductions.push({
      action: 'Reduce long-haul flights by 1/year',
      savings: Math.round(9000 * 2 * 0.15 * 2),
    });
  if (inp.dietType === 'heavy_meat' || inp.dietType === 'omnivore')
    reductions.push({
      action: 'Adopt vegetarian diet',
      savings: Math.round(diet - DIET_EMISSIONS_KG.vegetarian),
    });
  if (!inp.renewableEnergy)
    reductions.push({
      action: 'Switch to 100% renewable electricity',
      savings: Math.round(electricityEmissions * 0.9),
    });
  if (!inp.composting) reductions.push({ action: 'Start composting food waste', savings: 280 });
  if (inp.recyclingPct < 80)
    reductions.push({ action: 'Increase recycling to 80%+', savings: Math.round(total * 0.025) });
  if (inp.clothingItems > 10)
    reductions.push({
      action: 'Buy 50% fewer new garments',
      savings: Math.round(clothingEmissions * 0.5),
    });
  if (inp.shortFlights > 2)
    reductions.push({
      action: 'Replace 2 short flights with train',
      savings: Math.round(500 * 2 * 0.255 * 2 * 2),
    });
  reductions.sort((a, b) => b.savings - a.savings);

  return {
    transport,
    homeEnergy,
    diet,
    shopping,
    total,
    totalTonnes,
    perDay,
    vsUSAvg: (totalTonnes / 16) * 100,
    vsWorldAvg: (totalTonnes / 4) * 100,
    reductions,
  };
}

const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CarbonFootprintClient() {
  // Transportation
  const [carMiles, setCarMiles] = useState('10000');
  const [mpg, setMpg] = useState('28');
  const [fuelType, setFuelType] = useState('gasoline');
  const [shortFlights, setShortFlights] = useState('2');
  const [medFlights, setMedFlights] = useState('1');
  const [longFlights, setLongFlights] = useState('0');
  const [busHrs, setBusHrs] = useState('0');
  const [trainHrs, setTrainHrs] = useState('0');
  const [motorbikeMiles, setMotorbikeMiles] = useState('0');
  // Home Energy
  const [electricityKwh, setElectricityKwh] = useState('900');
  const [gridRegion, setGridRegion] = useState('us_avg');
  const [naturalGasTherms, setNaturalGasTherms] = useState('50');
  const [heatingOilGal, setHeatingOilGal] = useState('0');
  const [propaneGal, setPropaneGal] = useState('0');
  // Diet & Shopping
  const [dietType, setDietType] = useState('omnivore');
  const [clothingItems, setClothingItems] = useState('15');
  const [electronicsCount, setElectronicsCount] = useState('1');
  const [onlineOrdersPerWeek, setOnlineOrdersPerWeek] = useState('2');
  // Advanced
  const [recyclingPct, setRecyclingPct] = useState('50');
  const [composting, setComposting] = useState(false);
  const [renewableEnergy, setRenewableEnergy] = useState(false);
  const [showAdv, setShowAdv] = useState(false);

  const inputs = useMemo<CarbonInputs>(
    () => ({
      carMiles: parseFloat(carMiles) || 0,
      mpg: parseFloat(mpg) || 28,
      fuelType,
      shortFlights: parseFloat(shortFlights) || 0,
      medFlights: parseFloat(medFlights) || 0,
      longFlights: parseFloat(longFlights) || 0,
      busHrs: parseFloat(busHrs) || 0,
      trainHrs: parseFloat(trainHrs) || 0,
      motorbikeMiles: parseFloat(motorbikeMiles) || 0,
      electricityKwh: parseFloat(electricityKwh) || 0,
      gridRegion,
      naturalGasTherms: parseFloat(naturalGasTherms) || 0,
      heatingOilGal: parseFloat(heatingOilGal) || 0,
      propaneGal: parseFloat(propaneGal) || 0,
      dietType,
      clothingItems: parseFloat(clothingItems) || 0,
      electronicsCount: parseFloat(electronicsCount) || 0,
      onlineOrdersPerWeek: parseFloat(onlineOrdersPerWeek) || 0,
      recyclingPct: parseFloat(recyclingPct) || 0,
      composting,
      renewableEnergy,
    }),
    [
      carMiles,
      mpg,
      fuelType,
      shortFlights,
      medFlights,
      longFlights,
      busHrs,
      trainHrs,
      motorbikeMiles,
      electricityKwh,
      gridRegion,
      naturalGasTherms,
      heatingOilGal,
      propaneGal,
      dietType,
      clothingItems,
      electronicsCount,
      onlineOrdersPerWeek,
      recyclingPct,
      composting,
      renewableEnergy,
    ]
  );

  const result = useMemo(() => calcCarbon(inputs), [inputs]);

  const scenarios = useMemo(
    () => ({
      base: result,
      lessFlight: calcCarbon({ ...inputs, longFlights: Math.max(0, inputs.longFlights - 1) }),
      ev: calcCarbon({ ...inputs, fuelType: 'electric' }),
      vegetarian: calcCarbon({ ...inputs, dietType: 'vegetarian' }),
    }),
    [inputs, result]
  );

  const categories = [
    { label: 'Transportation', value: result.transport, color: '#6366f1' },
    { label: 'Home Energy', value: result.homeEnergy, color: '#f59e0b' },
    { label: 'Diet', value: result.diet, color: '#10b981' },
    { label: 'Shopping', value: result.shopping, color: '#38bdf8' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── INPUTS ── */}
      <div style={CARD}>
        <h3
          style={{
            margin: '0 0 16px',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--fg-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}
        >
          Transportation
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 14,
            marginBottom: 20,
          }}
        >
          <Field
            label="Car Miles/Year"
            value={carMiles}
            onChange={setCarMiles}
            placeholder="10000"
            min={0}
            step={1000}
          />
          <Field
            label="Vehicle MPG"
            value={mpg}
            onChange={setMpg}
            placeholder="28"
            min={1}
            max={150}
            step={1}
            hint="EPA combined MPG"
          />
          <SelectField
            label="Fuel Type"
            value={fuelType}
            onChange={setFuelType}
            options={[
              { value: 'gasoline', label: 'Gasoline' },
              { value: 'diesel', label: 'Diesel' },
              { value: 'electric', label: 'Electric' },
            ]}
          />
          <Field
            label="Short Flights/Yr (<3hr)"
            value={shortFlights}
            onChange={setShortFlights}
            placeholder="0"
            min={0}
            hint="One-way; RF x2 included"
          />
          <Field
            label="Medium Flights/Yr (3-9hr)"
            value={medFlights}
            onChange={setMedFlights}
            placeholder="0"
            min={0}
          />
          <Field
            label="Long Flights/Yr (>9hr)"
            value={longFlights}
            onChange={setLongFlights}
            placeholder="0"
            min={0}
            hint="IPCC AR6 radiative forcing"
          />
          <Field
            label="Bus Hours/Week"
            value={busHrs}
            onChange={setBusHrs}
            placeholder="0"
            min={0}
            step={0.5}
          />
          <Field
            label="Train Hours/Week"
            value={trainHrs}
            onChange={setTrainHrs}
            placeholder="0"
            min={0}
            step={0.5}
          />
          <Field
            label="Motorcycle Miles/Yr"
            value={motorbikeMiles}
            onChange={setMotorbikeMiles}
            placeholder="0"
            min={0}
            step={500}
          />
        </div>

        <h3
          style={{
            margin: '0 0 16px',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--fg-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            borderTop: '1px solid var(--line-strong)',
            paddingTop: 16,
          }}
        >
          Home Energy
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 14,
            marginBottom: 20,
          }}
        >
          <Field
            label="Electricity (kWh/month)"
            value={electricityKwh}
            onChange={setElectricityKwh}
            placeholder="900"
            min={0}
            step={50}
          />
          <SelectField
            label="Grid Region"
            value={gridRegion}
            onChange={setGridRegion}
            hint="kg CO2e/kWh"
            options={[
              { value: 'us_avg', label: 'US Average (0.386)' },
              { value: 'northeast', label: 'Northeast (0.280)' },
              { value: 'california', label: 'California (0.210)' },
              { value: 'northwest', label: 'Northwest (0.180)' },
              { value: 'southeast', label: 'Southeast (0.450)' },
              { value: 'midwest', label: 'Midwest (0.520)' },
              { value: 'texas', label: 'Texas (0.440)' },
              { value: 'southwest', label: 'Southwest (0.350)' },
            ]}
          />
          <Field
            label="Natural Gas (therms/month)"
            value={naturalGasTherms}
            onChange={setNaturalGasTherms}
            placeholder="50"
            min={0}
            step={5}
            hint="5.3 kg CO2e/therm"
          />
          <Field
            label="Heating Oil (gal/year)"
            value={heatingOilGal}
            onChange={setHeatingOilGal}
            placeholder="0"
            min={0}
            step={10}
          />
          <Field
            label="Propane (gal/year)"
            value={propaneGal}
            onChange={setPropaneGal}
            placeholder="0"
            min={0}
            step={10}
          />
        </div>

        <h3
          style={{
            margin: '0 0 16px',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--fg-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            borderTop: '1px solid var(--line-strong)',
            paddingTop: 16,
          }}
        >
          Diet & Shopping
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 14,
            marginBottom: 16,
          }}
        >
          <SelectField
            label="Diet Type"
            value={dietType}
            onChange={setDietType}
            hint="IPCC AR6 / Oxford Study"
            options={[
              { value: 'vegan', label: 'Vegan (1.5 t/yr)' },
              { value: 'vegetarian', label: 'Vegetarian (1.7 t/yr)' },
              { value: 'pescatarian', label: 'Pescatarian (2.0 t/yr)' },
              { value: 'omnivore', label: 'Omnivore (2.5 t/yr)' },
              { value: 'heavy_meat', label: 'Heavy Meat (3.3 t/yr)' },
            ]}
          />
          <Field
            label="New Clothing Items/Yr"
            value={clothingItems}
            onChange={setClothingItems}
            placeholder="15"
            min={0}
            step={1}
            hint="~22 kg CO2e per garment"
          />
          <Field
            label="Electronics Purchased/Yr"
            value={electronicsCount}
            onChange={setElectronicsCount}
            placeholder="1"
            min={0}
            hint="~160 kg CO2e per device"
          />
          <Field
            label="Online Orders/Week"
            value={onlineOrdersPerWeek}
            onChange={setOnlineOrdersPerWeek}
            placeholder="2"
            min={0}
            step={1}
          />
        </div>

        <button
          onClick={() => setShowAdv((v) => !v)}
          style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }}
          aria-expanded={showAdv}
        >
          {showAdv ? '▾' : '▸'} Advanced Options
        </button>
        {showAdv && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
              padding: '16px 0 4px',
              borderTop: '1px solid var(--line-strong)',
            }}
          >
            <Field
              label="Recycling Rate (%)"
              value={recyclingPct}
              onChange={setRecyclingPct}
              placeholder="50"
              min={0}
              max={100}
              step={10}
              hint="% of recyclables recycled"
            />
            <div>
              <label style={LABEL}>Composting</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={composting}
                  onChange={(e) => setComposting(e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                <span style={{ color: 'var(--fg-2)', fontSize: 14 }}>
                  Yes — saves ~280 kg CO2e/yr
                </span>
              </label>
            </div>
            <div>
              <label style={LABEL}>Renewable Energy</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={renewableEnergy}
                  onChange={(e) => setRenewableEnergy(e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                <span style={{ color: 'var(--fg-2)', fontSize: 14 }}>100% green electricity</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ── TIER 1: KEY METRICS ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
        }}
      >
        <MetricCard
          label="Annual CO2e"
          value={result.totalTonnes.toFixed(2) + ' t'}
          color="#6366f1"
          sub="tonnes CO2e/year"
        />
        <MetricCard
          label="Per Day"
          value={result.perDay.toFixed(1) + ' kg'}
          color="#f59e0b"
          sub="kg CO2e/day"
        />
        <MetricCard
          label="vs US Avg (16t)"
          value={result.vsUSAvg.toFixed(0) + '%'}
          color={result.vsUSAvg < 100 ? '#10b981' : '#ef4444'}
          sub={result.vsUSAvg < 100 ? 'Below US average' : 'Above US average'}
        />
        <MetricCard
          label="vs World Avg (4t)"
          value={result.vsWorldAvg.toFixed(0) + '%'}
          color={result.vsWorldAvg < 100 ? '#10b981' : '#f59e0b'}
          sub={result.vsWorldAvg < 100 ? 'Below world average' : 'Above world average'}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() =>
            exportCalcPDF({
              toolName: 'Carbon Footprint Calculator',
              inputs: [
                { label: 'Car Miles/Year', value: carMiles },
                { label: 'MPG', value: mpg },
                { label: 'Diet Type', value: dietType },
                { label: 'Grid Region', value: gridRegion },
              ],
              results: [
                {
                  label: 'Annual CO2e',
                  value: result.totalTonnes.toFixed(2) + ' t',
                  highlight: true,
                },
                { label: 'Per Day', value: result.perDay.toFixed(1) + ' kg' },
                { label: 'vs US Avg', value: result.vsUSAvg.toFixed(0) + '%' },
              ],
              tableHeaders: ['Category', 'kg CO2e/yr', 'Tonnes', '% of Total'],
              tableRows: categories.map((c) => ({
                Category: c.label,
                'kg CO2e/yr': fmt(c.value),
                Tonnes: (c.value / 1000).toFixed(3),
                '% of Total':
                  result.total > 0 ? ((c.value / result.total) * 100).toFixed(1) + '%' : '0%',
              })),
            })
          }
          style={BTN_GHOST}
        >
          Export PDF
        </button>
      </div>

      {/* Category proportional bars */}
      <div style={{ ...CARD, padding: '18px 20px' }}>
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
          Footprint Breakdown by Category
        </div>
        {categories.map((cat) => {
          const pct = result.total > 0 ? (cat.value / result.total) * 100 : 0;
          return (
            <div key={cat.label} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                  fontSize: 12,
                }}
              >
                <span style={{ color: 'var(--fg-2)', fontWeight: 600 }}>{cat.label}</span>
                <span style={{ color: cat.color, fontWeight: 700 }}>
                  {fmt(cat.value)} kg
                  <span style={{ color: 'var(--fg-3)', fontWeight: 400, marginLeft: 6 }}>
                    ({pct.toFixed(0)}%)
                  </span>
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: pct + '%',
                    height: '100%',
                    background: cat.color,
                    borderRadius: 4,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── TIER 2: CATEGORY BREAKDOWN TABLE ── */}
      <div style={CARD}>
        <h3
          style={{
            margin: '0 0 14px',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--fg-2)',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}
        >
          Detailed Category Breakdown
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Category', 'kg CO2e/yr', 'Tonnes CO2e', '% of Total'].map((h, i) => (
                  <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ ...TD, textAlign: 'left', color: cat.color, fontWeight: 600 }}>
                    {cat.label}
                  </td>
                  <td style={TD}>{fmt(cat.value)}</td>
                  <td style={TD}>{(cat.value / 1000).toFixed(3)}</td>
                  <td style={{ ...TD, color: cat.color }}>
                    {result.total > 0 ? ((cat.value / result.total) * 100).toFixed(1) + '%' : '0%'}
                  </td>
                </tr>
              ))}
              <tr
                style={{
                  borderTop: '2px solid rgba(99,102,241,0.3)',
                  background: 'rgba(99,102,241,0.05)',
                }}
              >
                <td style={{ ...TD, textAlign: 'left', fontWeight: 700, color: 'var(--fg)' }}>
                  TOTAL
                </td>
                <td style={{ ...TD, fontWeight: 700, color: 'var(--fg)' }}>{fmt(result.total)}</td>
                <td style={{ ...TD, fontWeight: 700, color: '#6366f1' }}>
                  {result.totalTonnes.toFixed(3)}
                </td>
                <td style={TD}>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TIER 3: SCENARIO COMPARISON ── */}
      <div style={CARD}>
        <h3
          style={{
            margin: '0 0 14px',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--fg-2)',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}
        >
          Scenario Comparison
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Scenario', 'Annual CO2e (kg)', 'Tonnes', 'Change vs Current', 'vs US Avg'].map(
                  (h, i) => (
                    <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {[
                { label: '★ Current Habits', r: scenarios.base, highlight: true },
                { label: '-1 Long Flight/Year', r: scenarios.lessFlight, highlight: false },
                { label: 'Switch to Electric Car', r: scenarios.ev, highlight: false },
                { label: 'Adopt Vegetarian Diet', r: scenarios.vegetarian, highlight: false },
              ].map(({ label, r, highlight }) => {
                const diffKg = r.total - scenarios.base.total;
                return (
                  <tr
                    key={label}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: highlight ? 'rgba(139,92,246,0.08)' : 'transparent',
                    }}
                  >
                    <td
                      style={{
                        ...TD,
                        textAlign: 'left',
                        color: highlight ? 'var(--brand-2)' : 'var(--fg-2)',
                        fontWeight: highlight ? 700 : 400,
                      }}
                    >
                      {label}
                    </td>
                    <td style={TD}>{fmt(r.total)}</td>
                    <td
                      style={{
                        ...TD,
                        color: highlight ? '#6366f1' : 'var(--fg-2)',
                        fontWeight: highlight ? 700 : 400,
                      }}
                    >
                      {r.totalTonnes.toFixed(2)}
                    </td>
                    <td
                      style={{
                        ...TD,
                        color: diffKg < -50 ? '#10b981' : diffKg > 50 ? '#ef4444' : 'var(--fg-3)',
                      }}
                    >
                      {Math.abs(diffKg) < 1 ? '—' : (diffKg > 0 ? '+' : '') + fmt(diffKg) + ' kg'}
                    </td>
                    <td style={{ ...TD, color: r.vsUSAvg < 100 ? '#10b981' : '#f59e0b' }}>
                      {r.vsUSAvg.toFixed(0)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TIER 4: RANKED REDUCTION ACTIONS ── */}
      <div
        style={{
          ...CARD,
          background: 'rgba(16,185,129,0.04)',
          borderColor: 'rgba(16,185,129,0.2)',
        }}
      >
        <h3
          style={{
            margin: '0 0 14px',
            fontSize: 14,
            fontWeight: 700,
            color: '#6ee7b7',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}
        >
          Prioritized Reduction Actions
        </h3>
        {result.reductions.length === 0 ? (
          <p style={{ color: 'var(--fg-3)', fontSize: 13, lineHeight: 1.7 }}>
            Your footprint is already very low. Consider carbon offsets for residual emissions.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {result.reductions.slice(0, 6).map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: 'var(--bg-2)',
                  borderRadius: 8,
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ fontSize: 13, color: 'var(--fg-2)', fontWeight: 500 }}>
                  <span style={{ color: '#6ee7b7', fontWeight: 700, marginRight: 8 }}>
                    #{i + 1}
                  </span>
                  {item.action}
                </div>
                <div
                  style={{ fontSize: 13, color: '#10b981', fontWeight: 700, whiteSpace: 'nowrap' }}
                >
                  -{fmt(item.savings)} kg/yr
                  <span style={{ color: 'var(--fg-3)', fontWeight: 400, marginLeft: 6 }}>
                    ({(item.savings / 1000).toFixed(2)} t)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            marginTop: 16,
            padding: '12px 14px',
            background: 'var(--bg-2)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--fg-3)',
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: 'var(--fg-2)' }}>Methodology:</strong> Transportation uses EPA
          2024 emission factors (8.887 kg CO2/gal gasoline). Flights use ICAO/IATA factors with IPCC
          AR6 radiative forcing multiplier (x2). Electricity uses EPA eGRID regional averages. Diet
          from Poore & Nemecek (2018) / IPCC AR6. US average is 16 t CO2e/year; IPCC 1.5°C pathway
          requires ~2.5 t/year by 2050.
        </div>
      </div>
    </div>
  );
}
