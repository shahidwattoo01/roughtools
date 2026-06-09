// ============================================================
// ENGINEERING CALCULATOR CONFIGS
// Pure data — no React, no 'use client'. Safe to import in
// both server components (page.tsx) and client components.
// ============================================================

// ─── Type helpers ─────────────────────────────────────────────

export interface UnitToggle {
  si: string
  imperial: string
  toImperial?: (v: number) => number
  toSI?: (v: number) => number
}

export interface InputField {
  id: string
  label: string
  symbol?: string
  unit?: string
  unitToggle?: UnitToggle
  type: 'number' | 'select'
  options?: { label: string; value: string }[]
  default?: number | string
  min?: number
  max?: number
  step?: number
  placeholder?: string
  tooltip?: string
  required?: boolean
  codeDefault?: string
}

export interface OutputField {
  id: string
  label: string
  unit?: string
  unitToggle?: UnitToggle
  decimals?: number
  highlight?: boolean
}

// ─── Rich engineering result (master-prompt compliant) ─────────

export type AdequacyStatus = 'PASS' | 'MARGINAL' | 'FAIL' | 'INFO'

export interface CalcStep {
  description: string
  formula?: string
  substituted?: string
  result?: string
}

export interface StandardTableRow {
  label: string
  value: string
  highlight?: boolean
}

export interface EngineeringResult {
  // 1. Primary outputs — always present
  outputs: Record<string, number>

  // 2. Adequacy check
  status?: AdequacyStatus
  dcRatio?: number
  demandLabel?: string
  capacityLabel?: string
  demand?: number
  capacity?: number

  // 3. Code compliance
  codeRef?: string
  codeClause?: string
  codeEdition?: string
  compliant?: boolean

  // 4. Engineering interpretation
  interpretation?: string

  // 5. Step-by-step breakdown
  steps?: CalcStep[]

  // 6. Recommendations
  recommendations?: string[]
  nextStandardSize?: string

  // 7. Sensitivity
  criticalParam?: string
  sensitivityNote?: string

  // 8. Assumptions & limits
  assumptions?: string[]
  validityNote?: string
  withinValidRange?: boolean

  // 9. Standard reference table
  standardTable?: StandardTableRow[]
  standardTableTitle?: string

  // SI + Imperial side-by-side
  imperialOutputs?: Record<string, { value: number; unit: string }>
}

export interface EngineeringCalcConfig {
  slug: string
  name: string
  icon: string
  description: string
  category?: string
  formula: string
  reference?: string
  codeEdition?: string
  inputs: InputField[]
  outputs: OutputField[]
  /** Legacy simple calculate — returns flat numbers only */
  calculate: (vals: Record<string, number | string>) => Record<string, number>
  /** Rich calculate — returns full EngineeringResult. Takes precedence when present. */
  calculateRich?: (vals: Record<string, number | string>) => EngineeringResult
}

// ─── Individual calculator configs ───────────────────────────

export const ENGINEERING_CONFIGS: Record<string, EngineeringCalcConfig> = {

  // ── Ohm's Law ──────────────────────────────────────────────
  'ohms-law-calculator': {
    slug: 'ohms-law-calculator',
    name: "Ohm's Law Calculator",
    icon: '⚡',
    description: 'Calculate voltage, current, resistance and power from any two known values.',
    formula: 'V = I × R   |   P = V × I   |   P = I² × R   |   P = V² / R',
    inputs: [
      { id: 'V', label: 'Voltage (V)', unit: 'V', type: 'number', default: 12, min: 0, placeholder: 'e.g. 12' },
      { id: 'I', label: 'Current (I)', unit: 'A', type: 'number', default: 2, min: 0, placeholder: 'e.g. 2' },
    ],
    outputs: [
      { id: 'R', label: 'Resistance', unit: 'Ω', decimals: 3 },
      { id: 'P', label: 'Power', unit: 'W', decimals: 3 },
    ],
    calculate: ({ V, I }) => {
      const v = Number(V), i = Number(I)
      if (!i) return { R: 0, P: 0 }
      return { R: v / i, P: v * i }
    },
  },

  // ── Voltage Drop ───────────────────────────────────────────
  'voltage-drop-calculator': {
    slug: 'voltage-drop-calculator',
    name: 'Voltage Drop Calculator',
    icon: '📉',
    description: 'Calculate voltage drop in electrical circuits (NEC / IEC).',
    formula: 'VD = (2 × K × I × L) / CM  |  % VD = (VD / V) × 100',
    reference: 'NEC 210.19(A) — max 3% on branch circuits',
    inputs: [
      { id: 'V', label: 'Supply Voltage', unit: 'V', type: 'number', default: 230 },
      { id: 'I', label: 'Load Current', unit: 'A', type: 'number', default: 20 },
      { id: 'L', label: 'One-Way Length', unit: 'm', type: 'number', default: 50 },
      { id: 'R', label: 'Conductor Resistance', unit: 'mΩ/m', type: 'number', default: 3.08, placeholder: 'Cu 6mm²=3.08' },
    ],
    outputs: [
      { id: 'vd', label: 'Voltage Drop', unit: 'V', decimals: 2 },
      { id: 'pct', label: 'Voltage Drop %', unit: '%', decimals: 2 },
      { id: 'vr', label: 'Receiving Voltage', unit: 'V', decimals: 2 },
    ],
    calculate: ({ V, I, L, R }) => {
      const vd = 2 * Number(I) * Number(L) * (Number(R) / 1000)
      const pct = (vd / Number(V)) * 100
      return { vd, pct, vr: Number(V) - vd }
    },
  },

  // ── 3-Phase Power ──────────────────────────────────────────
  'three-phase-power-calculator': {
    slug: 'three-phase-power-calculator',
    name: '3-Phase Power Calculator',
    icon: '🔋',
    description: 'Calculate kW, kVA, kVAR and power factor for three-phase systems.',
    formula: 'kVA = (√3 × V × I) / 1000  |  kW = kVA × PF  |  kVAR = kVA × sin(φ)',
    inputs: [
      { id: 'V', label: 'Line Voltage', unit: 'V', type: 'number', default: 400 },
      { id: 'I', label: 'Line Current', unit: 'A', type: 'number', default: 100 },
      { id: 'pf', label: 'Power Factor', unit: '', type: 'number', default: 0.85, min: 0.1, step: 0.01 },
    ],
    outputs: [
      { id: 'kva', label: 'Apparent Power', unit: 'kVA', decimals: 2 },
      { id: 'kw', label: 'Active Power', unit: 'kW', decimals: 2 },
      { id: 'kvar', label: 'Reactive Power', unit: 'kVAR', decimals: 2 },
    ],
    calculate: ({ V, I, pf }) => {
      const kva = (Math.sqrt(3) * Number(V) * Number(I)) / 1000
      const kw = kva * Number(pf)
      const kvar = Math.sqrt(kva ** 2 - kw ** 2)
      return { kva, kw, kvar }
    },
  },

  // ── Gear Ratio ─────────────────────────────────────────────
  'gear-ratio-calculator': {
    slug: 'gear-ratio-calculator',
    name: 'Gear Ratio Calculator',
    icon: '⚙️',
    description: 'Calculate gear ratio, output speed and torque for gear drives.',
    formula: 'GR = T_driven / T_driver  |  N_out = N_in / GR  |  T_out = T_in × GR × η',
    inputs: [
      { id: 'T1', label: 'Driver Teeth', unit: '', type: 'number', default: 20 },
      { id: 'T2', label: 'Driven Teeth', unit: '', type: 'number', default: 60 },
      { id: 'N1', label: 'Input Speed', unit: 'RPM', type: 'number', default: 1500 },
      { id: 'Tin', label: 'Input Torque', unit: 'Nm', type: 'number', default: 50 },
      { id: 'eta', label: 'Efficiency', unit: '%', type: 'number', default: 98, min: 50, step: 1 },
    ],
    outputs: [
      { id: 'gr', label: 'Gear Ratio', unit: ':1', decimals: 3 },
      { id: 'N2', label: 'Output Speed', unit: 'RPM', decimals: 1 },
      { id: 'Tout', label: 'Output Torque', unit: 'Nm', decimals: 2 },
    ],
    calculate: ({ T1, T2, N1, Tin, eta }) => {
      const gr = Number(T2) / Number(T1)
      const N2 = Number(N1) / gr
      const Tout = Number(Tin) * gr * (Number(eta) / 100)
      return { gr, N2, Tout }
    },
  },

  // ── HP / kW Converter ──────────────────────────────────────
  'hp-kw-converter': {
    slug: 'hp-kw-converter',
    name: 'HP / kW Converter',
    icon: '🔄',
    description: 'Convert between horsepower and kilowatts for mechanical and electrical power.',
    formula: '1 hp = 0.7457 kW  |  1 kW = 1.341 hp',
    inputs: [
      { id: 'hp', label: 'Horsepower', unit: 'hp', type: 'number', default: 10 },
    ],
    outputs: [
      { id: 'kw', label: 'Kilowatts', unit: 'kW', decimals: 3 },
      { id: 'kva', label: 'Approx kVA (PF 0.85)', unit: 'kVA', decimals: 3 },
      { id: 'watts', label: 'Watts', unit: 'W', decimals: 0 },
    ],
    calculate: ({ hp }) => {
      const kw = Number(hp) * 0.74570
      return { kw, kva: kw / 0.85, watts: kw * 1000 }
    },
  },

  // ── Reynolds Number ────────────────────────────────────────
  'reynolds-number-calculator': {
    slug: 'reynolds-number-calculator',
    name: 'Reynolds Number Calculator',
    icon: '🌊',
    description: 'Calculate Reynolds number to determine laminar or turbulent flow regime.',
    formula: 'Re = (ρ × V × D) / μ  |  Re < 2300 = laminar, Re > 4000 = turbulent',
    inputs: [
      { id: 'rho', label: 'Fluid Density', unit: 'kg/m³', type: 'number', default: 1000 },
      { id: 'v', label: 'Flow Velocity', unit: 'm/s', type: 'number', default: 2 },
      { id: 'D', label: 'Pipe Diameter', unit: 'm', type: 'number', default: 0.1 },
      { id: 'mu', label: 'Dynamic Viscosity', unit: 'Pa·s', type: 'number', default: 0.001, step: 0.0001, placeholder: 'Water ≈ 0.001' },
    ],
    outputs: [
      { id: 're', label: 'Reynolds Number', unit: '', decimals: 0 },
      { id: 'regime', label: 'Flow Regime Code', unit: '', decimals: 0 },
    ],
    calculate: ({ rho, v, D, mu }) => {
      const re = (Number(rho) * Number(v) * Number(D)) / Number(mu)
      const regime = re < 2300 ? 1 : re < 4000 ? 2 : 3
      return { re, regime }
    },
  },

  // ── Bolt Torque ────────────────────────────────────────────
  'bolt-torque-calculator': {
    slug: 'bolt-torque-calculator',
    name: 'Bolt Torque Calculator',
    icon: '🔩',
    description: 'Calculate bolt clamping force and required tightening torque.',
    formula: 'T = K × F × d  |  F = Preload clamp force (N), K = nut factor, d = nominal dia (m)',
    inputs: [
      { id: 'F', label: 'Clamp Force', unit: 'kN', type: 'number', default: 50 },
      { id: 'd', label: 'Bolt Diameter', unit: 'mm', type: 'number', default: 16 },
      { id: 'K', label: 'Nut Factor K', unit: '', type: 'number', default: 0.2, step: 0.01, placeholder: 'Dry≈0.2, Lube≈0.15' },
    ],
    outputs: [
      { id: 'T', label: 'Tightening Torque', unit: 'Nm', decimals: 1 },
      { id: 'stress', label: 'Bolt Stress (approx)', unit: 'MPa', decimals: 1 },
    ],
    calculate: ({ F, d, K }) => {
      const T = Number(K) * (Number(F) * 1000) * (Number(d) / 1000)
      const area = Math.PI * (Number(d) / 2) ** 2
      const stress = (Number(F) * 1000) / area
      return { T, stress }
    },
  },

  // ── Stress & Strain ────────────────────────────────────────
  'stress-strain-calculator': {
    slug: 'stress-strain-calculator',
    name: 'Stress & Strain Calculator',
    icon: '📐',
    description: "Calculate stress, strain and deformation using Young's modulus.",
    formula: 'σ = F / A  |  ε = σ / E  |  δ = ε × L',
    inputs: [
      { id: 'F', label: 'Applied Force', unit: 'kN', type: 'number', default: 100 },
      { id: 'A', label: 'Cross-Section Area', unit: 'mm²', type: 'number', default: 500 },
      { id: 'E', label: "Young's Modulus", unit: 'GPa', type: 'number', default: 200, placeholder: 'Steel≈200' },
      { id: 'L', label: 'Member Length', unit: 'm', type: 'number', default: 3 },
    ],
    outputs: [
      { id: 'sigma', label: 'Stress (σ)', unit: 'MPa', decimals: 2 },
      { id: 'eps', label: 'Strain (ε)', unit: 'μm/m', decimals: 2 },
      { id: 'delta', label: 'Deformation', unit: 'mm', decimals: 3 },
    ],
    calculate: ({ F, A, E, L }) => {
      const sigma = (Number(F) * 1000) / Number(A)
      const eps = sigma / (Number(E) * 1000)
      const delta = eps * Number(L) * 1000
      return { sigma, eps: eps * 1e6, delta }
    },
  },

  // ── Thermal Expansion ──────────────────────────────────────
  'thermal-expansion-calculator': {
    slug: 'thermal-expansion-calculator',
    name: 'Thermal Expansion Calculator',
    icon: '🌡️',
    description: 'Calculate linear and volumetric thermal expansion of materials.',
    formula: 'ΔL = α × L₀ × ΔT  |  ΔV = β × V₀ × ΔT  (β ≈ 3α)',
    inputs: [
      { id: 'L0', label: 'Original Length', unit: 'm', type: 'number', default: 10 },
      { id: 'dT', label: 'Temperature Change', unit: '°C', type: 'number', default: 80 },
      { id: 'alpha', label: 'Linear CTE (α)', unit: '×10⁻⁶/°C', type: 'number', default: 12, placeholder: 'Steel≈12, Al≈23, Cu≈17' },
    ],
    outputs: [
      { id: 'dL', label: 'Length Change ΔL', unit: 'mm', decimals: 3 },
      { id: 'dV_pct', label: 'Volume Change', unit: '%', decimals: 4 },
      { id: 'final', label: 'Final Length', unit: 'm', decimals: 5 },
    ],
    calculate: ({ L0, dT, alpha }) => {
      const a = Number(alpha) * 1e-6
      const dL = a * Number(L0) * Number(dT) * 1000
      const dV_pct = 3 * a * Number(dT) * 100
      const final = Number(L0) + dL / 1000
      return { dL, dV_pct, final }
    },
  },

  // ── Concrete Volume ────────────────────────────────────────
  'concrete-volume-calculator': {
    slug: 'concrete-volume-calculator',
    name: 'Concrete Volume Calculator',
    icon: '📦',
    description: 'Calculate concrete volume and material quantities for structural members.',
    formula: 'V = L × W × H  |  Bags = (V × 1.54 × cement_ratio × 1440) / 50',
    inputs: [
      { id: 'type', label: 'Element Type', type: 'select', options: [{ label: 'Slab', value: 'slab' }, { label: 'Beam', value: 'beam' }, { label: 'Column', value: 'col' }, { label: 'Footing', value: 'foot' }], default: 'slab' },
      { id: 'L', label: 'Length / Span', unit: 'm', type: 'number', default: 6 },
      { id: 'W', label: 'Width', unit: 'm', type: 'number', default: 4 },
      { id: 'H', label: 'Depth / Thickness', unit: 'm', type: 'number', default: 0.15 },
    ],
    outputs: [
      { id: 'vol', label: 'Concrete Volume', unit: 'm³', decimals: 3 },
      { id: 'bags', label: 'Cement Bags (50kg)', unit: '', decimals: 0 },
      { id: 'sand', label: 'Sand', unit: 'm³', decimals: 2 },
      { id: 'agg', label: 'Aggregate', unit: 'm³', decimals: 2 },
    ],
    calculate: ({ L, W, H }) => {
      const vol = Number(L) * Number(W) * Number(H)
      const dry = vol * 1.54
      const bags = Math.ceil((dry * (1 / 5.5) * 1440) / 50)
      const sand = dry * (1.5 / 5.5)
      const agg = dry * (3 / 5.5)
      return { vol, bags, sand, agg }
    },
  },

  // ── Wire / Cable Size ──────────────────────────────────────
  'wire-cable-size': {
    slug: 'wire-cable-size',
    name: 'Wire & Cable Size Calculator',
    icon: '🔌',
    description: 'Select cable cross-section based on current capacity and installation method.',
    formula: 'Cable sizing: I_design × derating factors ≤ I_z (tabulated current capacity)',
    reference: 'BS 7671 / NEC 310 cable ampacity tables',
    inputs: [
      { id: 'I', label: 'Design Current', unit: 'A', type: 'number', default: 25 },
      { id: 'Df', label: 'Derating Factor', unit: '', type: 'number', default: 0.87, step: 0.01, min: 0.3, placeholder: 'e.g. 0.87 for conduit' },
      { id: 'Vd_pct', label: 'Max Voltage Drop', unit: '%', type: 'number', default: 3, step: 0.5 },
      { id: 'V', label: 'Supply Voltage', unit: 'V', type: 'number', default: 230 },
      { id: 'L', label: 'Circuit Length', unit: 'm', type: 'number', default: 40 },
    ],
    outputs: [
      { id: 'I_design', label: 'Required Capacity', unit: 'A', decimals: 1 },
      { id: 'area_mm2', label: 'Recommended Area', unit: 'mm²', decimals: 1 },
      { id: 'vd', label: 'Voltage Drop (3-phase)', unit: 'V', decimals: 2 },
    ],
    calculate: ({ I, Df, Vd_pct, V, L }) => {
      const I_design = Number(I) / Number(Df)
      const area_mm2 = I_design / 3.5
      const Rl = 22.5 / area_mm2
      const vd = 2 * Number(L) * Number(I) * Rl / 1000
      return { I_design, area_mm2, vd }
    },
  },

  // ── Solar Panel & Battery Sizing ───────────────────────────
  'solar-panel-battery-sizing': {
    slug: 'solar-panel-battery-sizing',
    name: 'Solar Panel & Battery Sizing',
    icon: '☀️',
    description: 'Size a solar PV system and battery bank for daily energy demand.',
    formula: 'Panels = (kWh_day / PSH) / P_panel  |  Battery Ah = (kWh × DoD_days × 1000) / (Vbatt × DoD)',
    inputs: [
      { id: 'kWh', label: 'Daily Energy Need', unit: 'kWh/day', type: 'number', default: 10 },
      { id: 'psh', label: 'Peak Sun Hours', unit: 'h/day', type: 'number', default: 4.5 },
      { id: 'panel_w', label: 'Panel Watt-peak', unit: 'Wp', type: 'number', default: 400 },
      { id: 'batt_days', label: 'Autonomy (days)', unit: 'days', type: 'number', default: 2 },
      { id: 'Vbatt', label: 'Battery Voltage', unit: 'V', type: 'number', default: 48 },
    ],
    outputs: [
      { id: 'panels', label: 'Solar Panels', unit: '', decimals: 0 },
      { id: 'total_kWp', label: 'Total kWp', unit: 'kWp', decimals: 2 },
      { id: 'batt_ah', label: 'Battery Bank', unit: 'Ah', decimals: 0 },
      { id: 'inv_kva', label: 'Inverter Size', unit: 'kVA', decimals: 1 },
    ],
    calculate: ({ kWh, psh, panel_w, batt_days, Vbatt }) => {
      const panels = Math.ceil((Number(kWh) * 1000) / (Number(psh) * Number(panel_w) * 0.8))
      const total_kWp = panels * Number(panel_w) / 1000
      const batt_ah = Math.ceil((Number(kWh) * Number(batt_days) * 1000) / (Number(Vbatt) * 0.5))
      const inv_kva = Number(kWh) / 4
      return { panels, total_kWp, batt_ah, inv_kva }
    },
  },

  // ── Cooling Load ───────────────────────────────────────────
  'cooling-load-calculator': {
    slug: 'cooling-load-calculator',
    name: 'Cooling Load Calculator (HVAC)',
    icon: '❄️',
    description: 'Estimate cooling load in BTU/hr for rooms or buildings.',
    formula: 'Q = (A × ΔT × U) + occupant heat + equipment heat + solar gain',
    reference: 'ASHRAE Fundamentals Handbook',
    inputs: [
      { id: 'area', label: 'Floor Area', unit: 'm²', type: 'number', default: 50 },
      { id: 'height', label: 'Ceiling Height', unit: 'm', type: 'number', default: 3 },
      { id: 'dT', label: 'Indoor-Outdoor ΔT', unit: '°C', type: 'number', default: 12 },
      { id: 'persons', label: 'Number of Persons', unit: '', type: 'number', default: 4 },
      { id: 'lighting', label: 'Lighting Load', unit: 'W/m²', type: 'number', default: 10 },
    ],
    outputs: [
      { id: 'btu', label: 'Cooling Load', unit: 'BTU/hr', decimals: 0 },
      { id: 'kw', label: 'Cooling Load', unit: 'kW', decimals: 2 },
      { id: 'tr', label: 'Tonnage', unit: 'TR', decimals: 2 },
    ],
    calculate: ({ area, height, dT, persons, lighting }) => {
      const envelope = Number(area) * Number(dT) * 1.2
      const occup = Number(persons) * 100
      const light = Number(area) * Number(lighting)
      const solar = Number(area) * 50
      const totalW = envelope + occup + light + solar
      const btu = totalW * 3.412
      const kw = totalW / 1000
      const tr = kw / 3.517
      return { btu, kw, tr }
    },
  },

  // ── Pipe Pressure Drop ─────────────────────────────────────
  'pipe-pressure-drop': {
    slug: 'pipe-pressure-drop',
    name: 'Pipe Pressure Drop Calculator',
    icon: '🚰',
    description: 'Calculate pressure drop in pipes using Darcy-Weisbach equation.',
    formula: 'ΔP = f × (L/D) × (ρ × V²) / 2  |  f = 64/Re (laminar)',
    inputs: [
      { id: 'L', label: 'Pipe Length', unit: 'm', type: 'number', default: 100 },
      { id: 'D', label: 'Pipe Diameter', unit: 'mm', type: 'number', default: 100 },
      { id: 'Q', label: 'Flow Rate', unit: 'L/s', type: 'number', default: 10 },
      { id: 'rho', label: 'Fluid Density', unit: 'kg/m³', type: 'number', default: 1000 },
      { id: 'mu', label: 'Dynamic Viscosity', unit: 'cP', type: 'number', default: 1 },
      { id: 'eps', label: 'Roughness ε', unit: 'mm', type: 'number', default: 0.046, step: 0.001, placeholder: 'Steel≈0.046' },
    ],
    outputs: [
      { id: 'V', label: 'Flow Velocity', unit: 'm/s', decimals: 3 },
      { id: 'Re', label: 'Reynolds Number', unit: '', decimals: 0 },
      { id: 'dP', label: 'Pressure Drop', unit: 'kPa', decimals: 2 },
      { id: 'head', label: 'Head Loss', unit: 'm', decimals: 2 },
    ],
    calculate: ({ L, D, Q, rho, mu, eps }) => {
      const d = Number(D) / 1000
      const A = Math.PI * d ** 2 / 4
      const V = (Number(Q) / 1000) / A
      const Re = Number(rho) * V * d / (Number(mu) / 1000)
      const e_D = (Number(eps) / 1000) / d
      const f = Re < 2300 ? 64 / Re : 0.25 / (Math.log10(e_D / 3.7 + 5.74 / Re ** 0.9)) ** 2
      const dP = f * (Number(L) / d) * (Number(rho) * V ** 2 / 2) / 1000
      const head = dP * 1000 / (Number(rho) * 9.81)
      return { V, Re, dP, head }
    },
  },

  // ── Resistor Color Code ────────────────────────────────────
  'resistor-color-code': {
    slug: 'resistor-color-code',
    name: 'Resistor Color Code Decoder',
    icon: '🌈',
    description: 'Decode 4-band and 5-band resistor color codes to resistance values.',
    formula: 'R = (d1 × 10 + d2) × 10^multiplier  |  Tolerance from tolerance band',
    inputs: [
      { id: 'b1', label: 'Band 1', type: 'select', options: [{ label: 'Black (0)', value: '0' }, { label: 'Brown (1)', value: '1' }, { label: 'Red (2)', value: '2' }, { label: 'Orange (3)', value: '3' }, { label: 'Yellow (4)', value: '4' }, { label: 'Green (5)', value: '5' }, { label: 'Blue (6)', value: '6' }, { label: 'Violet (7)', value: '7' }, { label: 'Grey (8)', value: '8' }, { label: 'White (9)', value: '9' }], default: '1' },
      { id: 'b2', label: 'Band 2', type: 'select', options: [{ label: 'Black (0)', value: '0' }, { label: 'Brown (1)', value: '1' }, { label: 'Red (2)', value: '2' }, { label: 'Orange (3)', value: '3' }, { label: 'Yellow (4)', value: '4' }, { label: 'Green (5)', value: '5' }, { label: 'Blue (6)', value: '6' }, { label: 'Violet (7)', value: '7' }, { label: 'Grey (8)', value: '8' }, { label: 'White (9)', value: '9' }], default: '0' },
      { id: 'b3', label: 'Multiplier Band', type: 'select', options: [{ label: 'Black ×1', value: '0' }, { label: 'Brown ×10', value: '1' }, { label: 'Red ×100', value: '2' }, { label: 'Orange ×1k', value: '3' }, { label: 'Yellow ×10k', value: '4' }, { label: 'Green ×100k', value: '5' }, { label: 'Blue ×1M', value: '6' }, { label: 'Gold ×0.1', value: '-1' }, { label: 'Silver ×0.01', value: '-2' }], default: '3' },
    ],
    outputs: [
      { id: 'ohms', label: 'Resistance', unit: 'Ω', decimals: 2 },
      { id: 'kohms', label: 'Resistance', unit: 'kΩ', decimals: 4 },
    ],
    calculate: ({ b1, b2, b3 }) => {
      const ohms = (Number(b1) * 10 + Number(b2)) * Math.pow(10, Number(b3))
      return { ohms, kohms: ohms / 1000 }
    },
  },

  // ── LED Resistor ───────────────────────────────────────────
  'led-resistor-calculator': {
    slug: 'led-resistor-calculator',
    name: 'LED Resistor Calculator',
    icon: '💡',
    description: 'Calculate the series resistor value needed for any LED.',
    formula: 'R = (Vs - Vf) / If  |  P = (Vs - Vf) × If',
    inputs: [
      { id: 'Vs', label: 'Supply Voltage', unit: 'V', type: 'number', default: 5 },
      { id: 'Vf', label: 'LED Forward Voltage', unit: 'V', type: 'number', default: 2, step: 0.1, placeholder: 'Red≈2V, White≈3.2V' },
      { id: 'If', label: 'LED Current', unit: 'mA', type: 'number', default: 20 },
    ],
    outputs: [
      { id: 'R', label: 'Resistor Value', unit: 'Ω', decimals: 1 },
      { id: 'P', label: 'Power Dissipated', unit: 'mW', decimals: 1 },
      { id: 'std', label: 'Nearest E24 (approx)', unit: 'Ω', decimals: 0 },
    ],
    calculate: ({ Vs, Vf, If }) => {
      const R = (Number(Vs) - Number(Vf)) / (Number(If) / 1000)
      const P = (Number(Vs) - Number(Vf)) * Number(If)
      const e24 = [10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91]
      const decades = [1, 10, 100, 1000, 10000]
      let std = R
      let minDiff = Infinity
      for (const d of decades) for (const v of e24) {
        const diff = Math.abs(v * d - R)
        if (diff < minDiff) { minDiff = diff; std = v * d }
      }
      return { R, P, std }
    },
  },

  // ── 555 Timer ──────────────────────────────────────────────
  'timer-555-calculator': {
    slug: 'timer-555-calculator',
    name: '555 Timer Calculator',
    icon: '⏱️',
    description: 'Calculate 555 timer frequency, period and duty cycle for astable mode.',
    formula: 'f = 1.44 / ((Ra + 2×Rb) × C)  |  Duty = (Ra + Rb) / (Ra + 2×Rb) × 100%',
    inputs: [
      { id: 'Ra', label: 'Resistor Ra', unit: 'kΩ', type: 'number', default: 10 },
      { id: 'Rb', label: 'Resistor Rb', unit: 'kΩ', type: 'number', default: 10 },
      { id: 'C', label: 'Capacitor C', unit: 'μF', type: 'number', default: 10, step: 0.1 },
    ],
    outputs: [
      { id: 'f', label: 'Frequency', unit: 'Hz', decimals: 3 },
      { id: 'T', label: 'Period', unit: 'ms', decimals: 3 },
      { id: 'duty', label: 'Duty Cycle', unit: '%', decimals: 1 },
    ],
    calculate: ({ Ra, Rb, C }) => {
      const ra = Number(Ra) * 1000, rb = Number(Rb) * 1000, c = Number(C) * 1e-6
      const f = 1.44 / ((ra + 2 * rb) * c)
      const T = 1 / f * 1000
      const duty = ((ra + rb) / (ra + 2 * rb)) * 100
      return { f, T, duty }
    },
  },

  // ── Cloud Cost Estimator ───────────────────────────────────
  'cloud-cost-estimator': {
    slug: 'cloud-cost-estimator',
    name: 'Cloud Cost Estimator',
    icon: '☁️',
    description: 'Estimate and compare monthly cloud compute costs across AWS, Azure and GCP.',
    formula: 'Monthly cost = vCPUs × CPU_rate + RAM_GB × RAM_rate + Storage_GB × storage_rate',
    inputs: [
      { id: 'vcpus', label: 'vCPUs', unit: '', type: 'number', default: 4 },
      { id: 'ram', label: 'RAM', unit: 'GB', type: 'number', default: 16 },
      { id: 'storage', label: 'Storage', unit: 'GB', type: 'number', default: 100 },
      { id: 'bandwidth', label: 'Egress Bandwidth', unit: 'GB/mo', type: 'number', default: 50 },
      { id: 'hours', label: 'Hours/Month', unit: 'h', type: 'number', default: 730 },
    ],
    outputs: [
      { id: 'aws', label: 'AWS Estimate', unit: '$/mo', decimals: 2 },
      { id: 'azure', label: 'Azure Estimate', unit: '$/mo', decimals: 2 },
      { id: 'gcp', label: 'GCP Estimate', unit: '$/mo', decimals: 2 },
    ],
    calculate: ({ vcpus, ram, storage, bandwidth, hours }) => {
      const h = Number(hours)
      const awsCompute = Number(vcpus) * 0.048 * h + Number(ram) * 0.006 * h
      const awsStorage = Number(storage) * 0.023
      const awsBW = Number(bandwidth) * 0.09
      const aws = awsCompute + awsStorage + awsBW

      const azureCompute = Number(vcpus) * 0.052 * h + Number(ram) * 0.0065 * h
      const azureStorage = Number(storage) * 0.02
      const azureBW = Number(bandwidth) * 0.087
      const azure = azureCompute + azureStorage + azureBW

      const gcpCompute = Number(vcpus) * 0.0475 * h + Number(ram) * 0.0058 * h
      const gcpStorage = Number(storage) * 0.02
      const gcpBW = Number(bandwidth) * 0.08
      const gcp = gcpCompute + gcpStorage + gcpBW

      return { aws, azure, gcp }
    },
  },

  // ── Password Entropy ───────────────────────────────────────
  'password-entropy-calculator': {
    slug: 'password-entropy-calculator',
    name: 'Password Entropy Calculator',
    icon: '🔐',
    description: 'Calculate password entropy in bits and estimated time to brute-force crack.',
    formula: 'H = L × log₂(N)  |  Combinations = N^L  |  Crack time = Combinations / (2 × guesses/s)',
    inputs: [
      { id: 'L', label: 'Password Length', unit: 'chars', type: 'number', default: 12 },
      { id: 'lower', label: 'Lowercase (a-z)', type: 'select', options: [{ label: 'Yes (26)', value: '26' }, { label: 'No', value: '0' }], default: '26' },
      { id: 'upper', label: 'Uppercase (A-Z)', type: 'select', options: [{ label: 'Yes (26)', value: '26' }, { label: 'No', value: '0' }], default: '26' },
      { id: 'digits', label: 'Digits (0-9)', type: 'select', options: [{ label: 'Yes (10)', value: '10' }, { label: 'No', value: '0' }], default: '10' },
      { id: 'special', label: 'Special (!@#…)', type: 'select', options: [{ label: 'Yes (32)', value: '32' }, { label: 'No', value: '0' }], default: '32' },
    ],
    outputs: [
      { id: 'charset', label: 'Charset Size', unit: '', decimals: 0 },
      { id: 'entropy', label: 'Entropy', unit: 'bits', decimals: 1 },
      { id: 'crack_code', label: 'Crack-time code', unit: '', decimals: 0 },
    ],
    calculate: ({ L, lower, upper, digits, special }) => {
      const charset = Number(lower) + Number(upper) + Number(digits) + Number(special)
      const entropy = Number(L) * Math.log2(Math.max(charset, 1))
      const crack_code = entropy < 40 ? 1 : entropy < 60 ? 2 : entropy < 80 ? 3 : entropy < 100 ? 4 : 5
      return { charset, entropy, crack_code }
    },
  },

  // ── EV Range Calculator ────────────────────────────────────
  'ev-range-calculator': {
    slug: 'ev-range-calculator',
    name: 'EV Range Calculator',
    icon: '🔋',
    description: 'Calculate electric vehicle range from battery capacity and consumption.',
    formula: 'Range = (Usable kWh × 1000) / (Wh/km consumption)',
    inputs: [
      { id: 'capacity', label: 'Battery Capacity', unit: 'kWh', type: 'number', default: 75 },
      { id: 'dod', label: 'Usable DoD', unit: '%', type: 'number', default: 90, step: 1 },
      { id: 'consumption', label: 'Energy Consumption', unit: 'Wh/km', type: 'number', default: 180, placeholder: 'City≈200, Highway≈160' },
    ],
    outputs: [
      { id: 'range_km', label: 'Range', unit: 'km', decimals: 0 },
      { id: 'range_mi', label: 'Range', unit: 'miles', decimals: 0 },
      { id: 'cost_100km', label: 'Cost per 100km (@ $0.15/kWh)', unit: '$', decimals: 2 },
    ],
    calculate: ({ capacity, dod, consumption }) => {
      const usable = Number(capacity) * (Number(dod) / 100)
      const range_km = (usable * 1000) / Number(consumption)
      const range_mi = range_km * 0.621371
      const cost_100km = (Number(consumption) / 10) * 0.15
      return { range_km, range_mi, cost_100km }
    },
  },

  // ── Braking Distance ───────────────────────────────────────
  'braking-distance-calculator': {
    slug: 'braking-distance-calculator',
    name: 'Braking Distance Calculator',
    icon: '🛑',
    description: 'Calculate total stopping distance including driver reaction time.',
    formula: 'd = v×t_reaction + v² / (2×μ×g)  |  Total = thinking + braking distance',
    inputs: [
      { id: 'speed', label: 'Initial Speed', unit: 'km/h', type: 'number', default: 100 },
      { id: 'rt', label: 'Reaction Time', unit: 's', type: 'number', default: 1.5, step: 0.1 },
      { id: 'mu', label: 'Friction Coeff. (μ)', unit: '', type: 'number', default: 0.7, step: 0.05, placeholder: 'Dry≈0.8, Wet≈0.5' },
    ],
    outputs: [
      { id: 'react_d', label: 'Reaction Distance', unit: 'm', decimals: 1 },
      { id: 'brake_d', label: 'Braking Distance', unit: 'm', decimals: 1 },
      { id: 'total_d', label: 'Total Stopping Dist.', unit: 'm', decimals: 1 },
    ],
    calculate: ({ speed, rt, mu }) => {
      const v = Number(speed) / 3.6
      const react_d = v * Number(rt)
      const brake_d = v ** 2 / (2 * Number(mu) * 9.81)
      return { react_d, brake_d, total_d: react_d + brake_d }
    },
  },

  // ══════════════════════════════════════════════════════════
  // SECTION 1 — CIVIL & STRUCTURAL ENGINEERING
  // ══════════════════════════════════════════════════════════

  // ── Beam Deflection ────────────────────────────────────────
  'beam-deflection-calculator': {
    slug: 'beam-deflection-calculator',
    name: 'Beam Deflection Calculator',
    icon: '📐',
    description: 'Calculate maximum deflection for simply supported, cantilever, and fixed-fixed beams under point loads or UDL.',
    formula: 'SS Central: δ = PL³/(48EI)  |  SS UDL: δ = 5wL⁴/(384EI)  |  Cantilever Point: δ = PL³/(3EI)  |  Cantilever UDL: δ = wL⁴/(8EI)',
    reference: 'AISC Manual, ACI 318',
    inputs: [
      { id: 'type', label: 'Beam Type', type: 'select', default: '1', options: [
        { label: 'Simply Supported — Central Point Load', value: '1' },
        { label: 'Simply Supported — UDL', value: '2' },
        { label: 'Cantilever — Point Load at Free End', value: '3' },
        { label: 'Cantilever — UDL', value: '4' },
        { label: 'Fixed-Fixed — Central Point Load', value: '5' },
      ]},
      { id: 'P', label: 'Load (P or w)', unit: 'kN or kN/m', type: 'number', default: 50, min: 0 },
      { id: 'L', label: 'Span Length', unit: 'm', type: 'number', default: 6, min: 0.1 },
      { id: 'E', label: 'Modulus of Elasticity (E)', unit: 'GPa', type: 'number', default: 200, min: 1, placeholder: 'Steel=200, Concrete=25' },
      { id: 'I', label: 'Second Moment of Area (I)', unit: 'cm⁴', type: 'number', default: 8356, min: 0.01, placeholder: 'e.g. 8356 for W310×97' },
    ],
    outputs: [
      { id: 'delta_mm', label: 'Max Deflection', unit: 'mm', decimals: 3 },
      { id: 'delta_L', label: 'Deflection Ratio (L/δ)', unit: '', decimals: 0 },
    ],
    calculate: ({ type, P, L, E, I }) => {
      const p = Number(P), l = Number(L), e = Number(E) * 1e9, iCm4 = Number(I)
      const iM4 = iCm4 * 1e-8
      let delta = 0
      if (type === '1') delta = (p * 1e3 * Math.pow(l, 3)) / (48 * e * iM4)
      else if (type === '2') delta = (5 * p * 1e3 * Math.pow(l, 4)) / (384 * e * iM4)
      else if (type === '3') delta = (p * 1e3 * Math.pow(l, 3)) / (3 * e * iM4)
      else if (type === '4') delta = (p * 1e3 * Math.pow(l, 4)) / (8 * e * iM4)
      else if (type === '5') delta = (p * 1e3 * Math.pow(l, 3)) / (192 * e * iM4)
      const delta_mm = delta * 1000
      return { delta_mm, delta_L: delta_mm > 0 ? l * 1000 / delta_mm : 0 }
    },
  },

  // ── Concrete Mix Design ────────────────────────────────────
  'concrete-mix-design': {
    slug: 'concrete-mix-design',
    name: 'Concrete Mix Design',
    icon: '🪨',
    description: 'Calculate cement, sand, aggregate and water quantities per m³ for target concrete grade.',
    formula: 'w/c = 0.85 − (f\'c − 20)/100  |  C = W/(w/c)  |  Based on IS 10262 / ACI 211',
    reference: 'IS 10262, ACI 211.1',
    inputs: [
      { id: 'grade', label: 'Concrete Grade', type: 'select', default: 'M20', options: [
        { label: 'M10 (10 MPa)', value: 'M10' },
        { label: 'M15 (15 MPa)', value: 'M15' },
        { label: 'M20 (20 MPa)', value: 'M20' },
        { label: 'M25 (25 MPa)', value: 'M25' },
        { label: 'M30 (30 MPa)', value: 'M30' },
        { label: 'M40 (40 MPa)', value: 'M40' },
      ]},
      { id: 'volume', label: 'Volume Required', unit: 'm³', type: 'number', default: 1, min: 0.1 },
      { id: 'wastage', label: 'Wastage Factor', unit: '%', type: 'number', default: 5, min: 0, step: 1 },
    ],
    outputs: [
      { id: 'wc_ratio', label: 'w/c Ratio', unit: '', decimals: 2 },
      { id: 'cement', label: 'Cement', unit: 'kg', decimals: 1 },
      { id: 'sand', label: 'Fine Aggregate (Sand)', unit: 'kg', decimals: 1 },
      { id: 'aggregate', label: 'Coarse Aggregate', unit: 'kg', decimals: 1 },
      { id: 'water', label: 'Water', unit: 'L', decimals: 1 },
    ],
    calculate: ({ grade, volume, wastage }) => {
      const gradeData: Record<string, { fck: number; wc: number; cement: number; sand: number; agg: number; water: number }> = {
        M10: { fck: 10, wc: 0.60, cement: 220, sand: 660, agg: 1157, water: 132 },
        M15: { fck: 15, wc: 0.55, cement: 310, sand: 620, agg: 1086, water: 170 },
        M20: { fck: 20, wc: 0.50, cement: 395, sand: 681, agg: 1194, water: 197 },
        M25: { fck: 25, wc: 0.45, cement: 450, sand: 630, agg: 1154, water: 202 },
        M30: { fck: 30, wc: 0.42, cement: 500, sand: 600, agg: 1100, water: 210 },
        M40: { fck: 40, wc: 0.38, cement: 570, sand: 570, agg: 1050, water: 216 },
      }
      const d = gradeData[String(grade)] ?? gradeData.M20
      const v = Number(volume) * (1 + Number(wastage) / 100)
      return { wc_ratio: d.wc, cement: d.cement * v, sand: d.sand * v, aggregate: d.agg * v, water: d.water * v }
    },
  },

  // ── Column Load Capacity ───────────────────────────────────
  'column-load-capacity': {
    slug: 'column-load-capacity',
    name: 'Column Load Capacity',
    icon: '🏛️',
    description: 'Calculate axial load capacity and buckling load for reinforced concrete or steel columns.',
    formula: 'IS456: Pu = 0.4·fck·Ac + 0.67·fy·Asc  |  Euler: Pcr = π²EI/(KL)²',
    reference: 'IS 456, ACI 318, Euler column buckling',
    inputs: [
      { id: 'fck', label: 'Concrete Strength (f\'ck)', unit: 'MPa', type: 'number', default: 25, min: 10 },
      { id: 'fy', label: 'Steel Yield Strength (fy)', unit: 'MPa', type: 'number', default: 415, min: 100 },
      { id: 'b', label: 'Column Width (b)', unit: 'mm', type: 'number', default: 300, min: 100 },
      { id: 'd', label: 'Column Depth (d)', unit: 'mm', type: 'number', default: 300, min: 100 },
      { id: 'steelPct', label: 'Steel Ratio (p)', unit: '%', type: 'number', default: 2, min: 0.8, step: 0.1 },
      { id: 'L', label: 'Effective Length (KL)', unit: 'm', type: 'number', default: 3, min: 0.1 },
      { id: 'E', label: 'Modulus of Elasticity', unit: 'GPa', type: 'number', default: 200 },
    ],
    outputs: [
      { id: 'Pu', label: 'Axial Load Capacity (IS 456)', unit: 'kN', decimals: 1 },
      { id: 'Pcr', label: 'Euler Buckling Load', unit: 'kN', decimals: 1 },
      { id: 'lambda', label: 'Slenderness Ratio (λ)', unit: '', decimals: 1 },
      { id: 'Asc', label: 'Steel Area (Asc)', unit: 'mm²', decimals: 0 },
    ],
    calculate: ({ fck, fy, b, d, steelPct, L, E }) => {
      const Ag = Number(b) * Number(d)
      const Asc = Ag * Number(steelPct) / 100
      const Ac = Ag - Asc
      const Pu = (0.4 * Number(fck) * Ac + 0.67 * Number(fy) * Asc) / 1000
      const I = (Number(b) * Math.pow(Number(d), 3)) / 12
      const r = Math.sqrt(I / Ag)
      const lambda = (Number(L) * 1000) / r
      const Pcr = (Math.PI ** 2 * Number(E) * 1e9 * I * 1e-12) / Math.pow(Number(L), 2) / 1000
      return { Pu, Pcr, lambda, Asc }
    },
  },

  // ── Retaining Wall Stability ───────────────────────────────
  'retaining-wall-stability': {
    slug: 'retaining-wall-stability',
    name: 'Retaining Wall Stability',
    icon: '🧱',
    description: 'Check factor of safety against overturning and sliding for a retaining wall using Rankine earth pressure theory.',
    formula: 'Ka = (1−sinφ)/(1+sinφ)  |  Pa = 0.5·Ka·γ·H²  |  FOS_OT = ΣM_resist/ΣM_overturn ≥ 1.5',
    reference: 'Rankine earth pressure, IS 456',
    inputs: [
      { id: 'H', label: 'Wall Height (H)', unit: 'm', type: 'number', default: 4, min: 0.5 },
      { id: 'B', label: 'Base Width (B)', unit: 'm', type: 'number', default: 2.4, min: 0.5 },
      { id: 'phi', label: 'Friction Angle (φ)', unit: '°', type: 'number', default: 30, min: 5, step: 1 },
      { id: 'gamma', label: 'Soil Unit Weight (γ)', unit: 'kN/m³', type: 'number', default: 18, min: 10 },
      { id: 'gamma_w', label: 'Wall Unit Weight', unit: 'kN/m³', type: 'number', default: 24 },
      { id: 'mu', label: 'Base Friction (μ)', unit: '', type: 'number', default: 0.5, step: 0.05 },
    ],
    outputs: [
      { id: 'Ka', label: 'Active Pressure Coeff (Ka)', unit: '', decimals: 3 },
      { id: 'Pa', label: 'Total Active Force', unit: 'kN/m', decimals: 2 },
      { id: 'fos_ot', label: 'FOS — Overturning', unit: '', decimals: 2 },
      { id: 'fos_sl', label: 'FOS — Sliding', unit: '', decimals: 2 },
    ],
    calculate: ({ H, B, phi, gamma, gamma_w, mu }) => {
      const phiRad = Number(phi) * Math.PI / 180
      const Ka = Math.pow(Math.tan(Math.PI / 4 - phiRad / 2), 2)
      const Pa = 0.5 * Ka * Number(gamma) * Math.pow(Number(H), 2)
      const W_wall = Number(gamma_w) * Number(B) * Number(H) * 0.25
      const W_soil = Number(gamma) * (Number(B) * 0.75) * Number(H)
      const W_total = W_wall + W_soil
      const M_resist = W_total * Number(B) / 2
      const M_overturn = Pa * Number(H) / 3
      const fos_ot = M_resist / M_overturn
      const fos_sl = (Number(mu) * W_total) / Pa
      return { Ka, Pa, fos_ot, fos_sl }
    },
  },

  // ── Foundation Bearing Capacity ────────────────────────────
  'foundation-bearing-capacity': {
    slug: 'foundation-bearing-capacity',
    name: 'Foundation Bearing Capacity',
    icon: '⬜',
    description: 'Calculate ultimate and allowable bearing capacity using Terzaghi\'s general bearing capacity equation.',
    formula: 'q_ult = c·Nc + γ·Df·Nq + 0.5·γ·B·Nγ  |  q_allow = q_ult / FOS',
    reference: 'Terzaghi (1943), IS 6403',
    inputs: [
      { id: 'c', label: 'Cohesion (c)', unit: 'kPa', type: 'number', default: 20, min: 0 },
      { id: 'phi', label: 'Friction Angle (φ)', unit: '°', type: 'number', default: 25, min: 0, step: 1 },
      { id: 'gamma', label: 'Soil Unit Weight (γ)', unit: 'kN/m³', type: 'number', default: 18 },
      { id: 'Df', label: 'Depth of Foundation (Df)', unit: 'm', type: 'number', default: 1.5, min: 0.3 },
      { id: 'B', label: 'Footing Width (B)', unit: 'm', type: 'number', default: 1.5, min: 0.3 },
      { id: 'fos', label: 'Factor of Safety', unit: '', type: 'number', default: 3, min: 1.5 },
      { id: 'shape', label: 'Footing Shape', type: 'select', default: 'strip', options: [
        { label: 'Strip', value: 'strip' },
        { label: 'Square', value: 'square' },
        { label: 'Circular', value: 'circular' },
      ]},
    ],
    outputs: [
      { id: 'Nc', label: 'Nc (bearing factor)', unit: '', decimals: 2 },
      { id: 'Nq', label: 'Nq (bearing factor)', unit: '', decimals: 2 },
      { id: 'Ngamma', label: 'Nγ (bearing factor)', unit: '', decimals: 2 },
      { id: 'q_ult', label: 'Ultimate Bearing Capacity', unit: 'kPa', decimals: 1 },
      { id: 'q_net', label: 'Net Ultimate Capacity', unit: 'kPa', decimals: 1 },
      { id: 'q_allow', label: 'Allowable Bearing Capacity', unit: 'kPa', decimals: 1 },
    ],
    calculate: ({ c, phi, gamma, Df, B, fos, shape }) => {
      const phiR = Number(phi) * Math.PI / 180
      const Nq = Math.exp(Math.PI * Math.tan(phiR)) * Math.pow(Math.tan(Math.PI / 4 + phiR / 2), 2)
      const Nc = Number(phi) === 0 ? 5.14 : (Nq - 1) / Math.tan(phiR)
      const Ngamma = 2 * (Nq + 1) * Math.tan(phiR)
      const q = Number(gamma) * Number(Df)
      let q_ult = 0
      if (shape === 'strip') q_ult = Number(c) * Nc + q * Nq + 0.5 * Number(gamma) * Number(B) * Ngamma
      else if (shape === 'square') q_ult = 1.3 * Number(c) * Nc + q * Nq + 0.4 * Number(gamma) * Number(B) * Ngamma
      else q_ult = 1.3 * Number(c) * Nc + q * Nq + 0.3 * Number(gamma) * Number(B) * Ngamma
      const q_net = q_ult - q
      return { Nc, Nq, Ngamma, q_ult, q_net, q_allow: q_net / Number(fos) }
    },
  },

  // ── Steel Section Properties ───────────────────────────────
  'steel-section-properties': {
    slug: 'steel-section-properties',
    name: 'Steel Section Properties',
    icon: '🔩',
    description: 'Calculate area, moment of inertia, section modulus, plastic modulus and radius of gyration for rectangular and I-sections.',
    formula: 'I = bh³/12  |  S = I/y_max  |  r = √(I/A)  |  Parallel Axis: I = I_own + A·d²',
    reference: 'AISC Steel Construction Manual',
    inputs: [
      { id: 'sec', label: 'Section Type', type: 'select', default: 'rect', options: [
        { label: 'Solid Rectangle', value: 'rect' },
        { label: 'Hollow Rectangle (Box)', value: 'hollow' },
        { label: 'I-Section (Flange + Web)', value: 'isection' },
      ]},
      { id: 'b', label: 'Width / Flange Width (b)', unit: 'mm', type: 'number', default: 200, min: 1 },
      { id: 'h', label: 'Height (h)', unit: 'mm', type: 'number', default: 300, min: 1 },
      { id: 'tf', label: 'Flange Thickness (tf) [I/hollow]', unit: 'mm', type: 'number', default: 14, min: 1 },
      { id: 'tw', label: 'Web Thickness (tw) [I/hollow]', unit: 'mm', type: 'number', default: 9, min: 1 },
    ],
    outputs: [
      { id: 'A', label: 'Area (A)', unit: 'cm²', decimals: 2 },
      { id: 'Ix', label: 'Moment of Inertia (Ix)', unit: 'cm⁴', decimals: 1 },
      { id: 'Sx', label: 'Elastic Section Modulus (Sx)', unit: 'cm³', decimals: 1 },
      { id: 'rx', label: 'Radius of Gyration (rx)', unit: 'cm', decimals: 2 },
    ],
    calculate: ({ sec, b, h, tf, tw }) => {
      const bv = Number(b), hv = Number(h), tfv = Number(tf), twv = Number(tw)
      let A = 0, Ix = 0
      if (sec === 'rect') { A = bv * hv; Ix = bv * hv ** 3 / 12 }
      else if (sec === 'hollow') { A = bv * hv - (bv - 2 * twv) * (hv - 2 * tfv); Ix = (bv * hv ** 3 - (bv - 2 * twv) * (hv - 2 * tfv) ** 3) / 12 }
      else { const hw = hv - 2 * tfv; A = 2 * bv * tfv + hw * twv; Ix = (bv * hv ** 3 - (bv - twv) * hw ** 3) / 12 }
      const Sx = Ix / (hv / 2)
      const rx = Math.sqrt(Ix / A)
      return { A: A / 100, Ix: Ix / 1e4, Sx: Sx / 1e3, rx: rx / 10 }
    },
  },

  // ── Rebar Quantity Estimator ───────────────────────────────
  'rebar-quantity-estimator': {
    slug: 'rebar-quantity-estimator',
    name: 'Rebar Quantity Estimator',
    icon: '🔗',
    description: 'Calculate required number of bars, bar spacing, development length, and total weight of reinforcement.',
    formula: 'A_bar = π·d²/4  |  n = (W − 2c − d)/s + 1  |  W = 0.00616·d² kg/m',
    reference: 'IS 456, ACI 318',
    inputs: [
      { id: 'dia', label: 'Bar Diameter (d)', unit: 'mm', type: 'number', default: 16, min: 6, step: 2 },
      { id: 'A_req', label: 'Required Steel Area (As)', unit: 'mm²', type: 'number', default: 1200, min: 10 },
      { id: 'W', label: 'Member Width', unit: 'mm', type: 'number', default: 1000 },
      { id: 'cover', label: 'Clear Cover', unit: 'mm', type: 'number', default: 40 },
      { id: 'spacing', label: 'Desired Spacing', unit: 'mm', type: 'number', default: 150 },
      { id: 'length', label: 'Total Bar Length per Bar', unit: 'm', type: 'number', default: 6 },
    ],
    outputs: [
      { id: 'A_bar', label: 'Area per Bar', unit: 'mm²', decimals: 1 },
      { id: 'n_bars', label: 'Bars Required (by area)', unit: 'nos', decimals: 0 },
      { id: 'n_width', label: 'Bars in Member Width', unit: 'nos', decimals: 0 },
      { id: 'weight_pm', label: 'Weight per Metre', unit: 'kg/m', decimals: 3 },
      { id: 'total_wt', label: 'Total Weight', unit: 'kg', decimals: 2 },
    ],
    calculate: ({ dia, A_req, W, cover, spacing, length }) => {
      const d = Number(dia), A_bar = Math.PI * d ** 2 / 4
      const n_bars = Math.ceil(Number(A_req) / A_bar)
      const n_width = Math.floor((Number(W) - 2 * Number(cover) - d) / Number(spacing)) + 1
      const weight_pm = 0.00616 * d ** 2
      const total_wt = weight_pm * Number(length) * n_bars
      return { A_bar, n_bars, n_width, weight_pm, total_wt }
    },
  },

  // ── Wind Load Calculator ───────────────────────────────────
  'wind-load-calculator': {
    slug: 'wind-load-calculator',
    name: 'Wind Load Calculator',
    icon: '💨',
    description: 'Calculate design wind pressure on structures per ASCE 7-16 velocity pressure method.',
    formula: 'q_z = 0.613·Kz·Kzt·Kd·V²  |  p = q_z·G·Cp − qi·GCpi',
    reference: 'ASCE 7-16 Chapter 26–27',
    inputs: [
      { id: 'V', label: 'Design Wind Speed (V)', unit: 'm/s', type: 'number', default: 45, min: 20 },
      { id: 'Kz', label: 'Exposure Coeff (Kz)', unit: '', type: 'number', default: 0.85, step: 0.01, placeholder: 'Exposure B,15m≈0.85' },
      { id: 'Kzt', label: 'Topographic Factor (Kzt)', unit: '', type: 'number', default: 1.0, step: 0.01 },
      { id: 'Kd', label: 'Directionality Factor (Kd)', unit: '', type: 'number', default: 0.85, step: 0.01 },
      { id: 'G', label: 'Gust Factor (G)', unit: '', type: 'number', default: 0.85, step: 0.01 },
      { id: 'Cp', label: 'Pressure Coeff (Cp)', unit: '', type: 'number', default: 0.8, step: 0.05 },
      { id: 'GCpi', label: 'Internal Press Coeff (GCpi)', unit: '', type: 'number', default: 0.18, step: 0.01 },
    ],
    outputs: [
      { id: 'qz', label: 'Velocity Pressure (q_z)', unit: 'Pa', decimals: 1 },
      { id: 'p_net', label: 'Net Design Pressure', unit: 'Pa', decimals: 1 },
      { id: 'p_psf', label: 'Net Design Pressure', unit: 'psf', decimals: 2 },
    ],
    calculate: ({ V, Kz, Kzt, Kd, G, Cp, GCpi }) => {
      const qz = 0.613 * Number(Kz) * Number(Kzt) * Number(Kd) * Number(V) ** 2
      const p_net = qz * Number(G) * Number(Cp) - qz * Number(GCpi)
      return { qz, p_net, p_psf: p_net * 0.020885 }
    },
  },

  // ── Truss Member Force Solver ──────────────────────────────
  'truss-member-force': {
    slug: 'truss-member-force',
    name: 'Truss Member Force Solver',
    icon: '🔱',
    description: 'Calculate forces in a simple Pratt truss using method of joints. Positive = tension, negative = compression.',
    formula: 'ΣFx = 0, ΣFy = 0 at each joint  |  m = 2j − 3',
    reference: 'Hibbeler, Engineering Mechanics: Statics',
    inputs: [
      { id: 'W', label: 'Total Uniformly Applied Load', unit: 'kN', type: 'number', default: 100, min: 0 },
      { id: 'n', label: 'Number of Panels', unit: '', type: 'number', default: 4, min: 2, step: 1 },
      { id: 'L', label: 'Total Span Length', unit: 'm', type: 'number', default: 16, min: 1 },
      { id: 'h', label: 'Truss Height', unit: 'm', type: 'number', default: 3, min: 0.5 },
    ],
    outputs: [
      { id: 'reaction', label: 'Support Reaction (each)', unit: 'kN', decimals: 2 },
      { id: 'bot_chord', label: 'Bottom Chord Force (max)', unit: 'kN', decimals: 2 },
      { id: 'top_chord', label: 'Top Chord Force (max)', unit: 'kN', decimals: 2 },
      { id: 'vertical', label: 'Vertical Member Force', unit: 'kN', decimals: 2 },
      { id: 'diag', label: 'Diagonal Member Force', unit: 'kN', decimals: 2 },
      { id: 'n_members', label: 'Total Members', unit: '', decimals: 0 },
    ],
    calculate: ({ W, n, L, h }) => {
      const panels = Math.round(Number(n)), P = Number(W) / (panels + 1)
      const reaction = Number(W) / 2
      const panelLen = Number(L) / panels
      const diagLen = Math.sqrt(panelLen ** 2 + Number(h) ** 2)
      const bot_chord = reaction * panelLen / Number(h)
      const top_chord = -bot_chord * diagLen / panelLen
      const vertical = P
      const diag = -reaction / Math.sin(Math.atan(Number(h) / panelLen))
      const n_members = 2 * panels + (panels - 1) + panels
      return { reaction, bot_chord, top_chord: Math.abs(top_chord), vertical, diag, n_members }
    },
  },

  // ── Moment of Inertia ──────────────────────────────────────
  'moment-of-inertia-calculator': {
    slug: 'moment-of-inertia-calculator',
    name: 'Moment of Inertia Calculator',
    icon: '🔲',
    description: 'Calculate second moment of area for standard cross-sections using parallel axis theorem.',
    formula: 'Rectangle: I = bh³/12  |  Circle: I = πr⁴/4  |  Hollow: I = (bh³ − bi·hi³)/12',
    reference: 'Engineering Mechanics, AISC',
    inputs: [
      { id: 'shape', label: 'Shape', type: 'select', default: 'rect', options: [
        { label: 'Solid Rectangle (b×h)', value: 'rect' },
        { label: 'Solid Circle (radius r)', value: 'circle' },
        { label: 'Hollow Rectangle', value: 'hollow_rect' },
        { label: 'Triangle (base×height)', value: 'triangle' },
        { label: 'Hollow Circle (annulus)', value: 'annulus' },
      ]},
      { id: 'b', label: 'Width / Outer Dim / Base (b or D)', unit: 'mm', type: 'number', default: 200, min: 1 },
      { id: 'h', label: 'Height / Inner Dim (h or d_inner)', unit: 'mm', type: 'number', default: 300, min: 1 },
    ],
    outputs: [
      { id: 'Ix_cm4', label: 'Ix (about x-axis)', unit: 'cm⁴', decimals: 2 },
      { id: 'Iy_cm4', label: 'Iy (about y-axis)', unit: 'cm⁴', decimals: 2 },
      { id: 'A_cm2', label: 'Area (A)', unit: 'cm²', decimals: 2 },
      { id: 'Sx', label: 'Section Modulus (Sx)', unit: 'cm³', decimals: 2 },
    ],
    calculate: ({ shape, b, h }) => {
      const bv = Number(b), hv = Number(h)
      let Ix = 0, Iy = 0, A = 0
      if (shape === 'rect') { Ix = bv * hv ** 3 / 12; Iy = hv * bv ** 3 / 12; A = bv * hv }
      else if (shape === 'circle') { const r = bv / 2; Ix = Math.PI * r ** 4 / 4; Iy = Ix; A = Math.PI * r ** 2 }
      else if (shape === 'hollow_rect') { const bi = bv - 20, hi = hv - 20; Ix = (bv * hv ** 3 - bi * hi ** 3) / 12; Iy = (hv * bv ** 3 - hi * bi ** 3) / 12; A = bv * hv - bi * hi }
      else if (shape === 'triangle') { Ix = bv * hv ** 3 / 36; Iy = hv * bv ** 3 / 36; A = bv * hv / 2 }
      else { const r_o = bv / 2, r_i = hv / 2; Ix = Math.PI * (r_o ** 4 - r_i ** 4) / 4; Iy = Ix; A = Math.PI * (r_o ** 2 - r_i ** 2) }
      const Sx = Ix / (hv / 2)
      return { Ix_cm4: Ix / 1e4, Iy_cm4: Iy / 1e4, A_cm2: A / 100, Sx: Sx / 1e3 }
    },
  },

  // ── Pile Load Capacity ─────────────────────────────────────
  'pile-load-capacity': {
    slug: 'pile-load-capacity',
    name: 'Pile Load Capacity',
    icon: '🗜️',
    description: 'Calculate ultimate pile capacity from skin friction and end bearing, with group efficiency.',
    formula: 'Q_ult = Q_skin + Q_tip  |  Q_skin = α·cu·As  |  Q_tip = cu·Nc·Ap  |  Q_allow = Q_ult/FOS',
    reference: 'IS 2911, FHWA pile design manual',
    inputs: [
      { id: 'D', label: 'Pile Diameter', unit: 'm', type: 'number', default: 0.45, min: 0.1, step: 0.05 },
      { id: 'L_pile', label: 'Pile Length', unit: 'm', type: 'number', default: 12, min: 1 },
      { id: 'cu', label: 'Undrained Shear Strength (cu)', unit: 'kPa', type: 'number', default: 60, min: 5 },
      { id: 'alpha', label: 'Adhesion Factor (α)', unit: '', type: 'number', default: 0.5, step: 0.05, placeholder: '0.5–0.9 clay' },
      { id: 'fos', label: 'Factor of Safety', unit: '', type: 'number', default: 2.5, min: 2 },
    ],
    outputs: [
      { id: 'Q_skin', label: 'Skin Friction Capacity', unit: 'kN', decimals: 1 },
      { id: 'Q_tip', label: 'End Bearing Capacity', unit: 'kN', decimals: 1 },
      { id: 'Q_ult', label: 'Ultimate Capacity', unit: 'kN', decimals: 1 },
      { id: 'Q_allow', label: 'Allowable Capacity', unit: 'kN', decimals: 1 },
    ],
    calculate: ({ D, L_pile, cu, alpha, fos }) => {
      const r = Number(D) / 2, perimeter = Math.PI * Number(D)
      const As = perimeter * Number(L_pile)
      const Ap = Math.PI * r ** 2
      const Q_skin = Number(alpha) * Number(cu) * As
      const Q_tip = Number(cu) * 9 * Ap
      const Q_ult = Q_skin + Q_tip
      return { Q_skin, Q_tip, Q_ult, Q_allow: Q_ult / Number(fos) }
    },
  },

  // ── Slab Reinforcement Designer ────────────────────────────
  'slab-reinforcement-designer': {
    slug: 'slab-reinforcement-designer',
    name: 'Slab Reinforcement Designer',
    icon: '🟦',
    description: 'Design steel reinforcement for one-way and two-way reinforced concrete slabs per ACI 318.',
    formula: 'Mu = wu·L²/8  |  As = Mu/(φ·fy·(d−a/2))  |  As,min = 0.0018·b·h (Gr 60)',
    reference: 'ACI 318-19, IS 456',
    inputs: [
      { id: 'wu', label: 'Factored Load (wu)', unit: 'kN/m²', type: 'number', default: 15, min: 1 },
      { id: 'L', label: 'Clear Span (L)', unit: 'm', type: 'number', default: 4, min: 0.5 },
      { id: 'h', label: 'Slab Thickness', unit: 'mm', type: 'number', default: 150, min: 75 },
      { id: 'cover', label: 'Clear Cover', unit: 'mm', type: 'number', default: 20, min: 10 },
      { id: 'fck', label: 'Concrete Strength f\'c', unit: 'MPa', type: 'number', default: 25, min: 17 },
      { id: 'fy', label: 'Steel Yield Strength fy', unit: 'MPa', type: 'number', default: 415, min: 250 },
      { id: 'b', label: 'Strip Width', unit: 'mm', type: 'number', default: 1000, min: 100 },
    ],
    outputs: [
      { id: 'Mu', label: 'Design Moment (Mu)', unit: 'kN·m', decimals: 2 },
      { id: 'd', label: 'Effective Depth (d)', unit: 'mm', decimals: 0 },
      { id: 'As_req', label: 'Required Steel Area (As)', unit: 'mm²/m', decimals: 0 },
      { id: 'As_min', label: 'Minimum Steel Area', unit: 'mm²/m', decimals: 0 },
      { id: 'As_prov', label: 'Provided As (governs)', unit: 'mm²/m', decimals: 0 },
    ],
    calculate: ({ wu, L, h, cover, fck, fy, b }) => {
      const d = Number(h) - Number(cover) - 8
      const Mu = Number(wu) * Number(L) ** 2 / 8
      const phi = 0.9
      let As_req = 0, a = 1
      for (let i = 0; i < 10; i++) {
        As_req = Mu * 1e6 / (phi * Number(fy) * (d - a / 2))
        a = As_req * Number(fy) / (0.85 * Number(fck) * Number(b))
      }
      const As_min = 0.0018 * Number(b) * Number(h)
      const As_prov = Math.max(As_req, As_min)
      return { Mu, d, As_req: As_req * 1000 / Number(b), As_min: As_min * 1000 / Number(b), As_prov: As_prov * 1000 / Number(b) }
    },
  },

  // ── Earthwork Cut & Fill ───────────────────────────────────
  'earthwork-cut-fill': {
    slug: 'earthwork-cut-fill',
    name: 'Earthwork Cut & Fill',
    icon: '⛰️',
    description: 'Calculate earthwork volumes using the prismoidal formula and average end area method.',
    formula: 'V_prismoidal = (L/6)·(A₁ + 4·Am + A₂)  |  V_AEA = L·(A₁+A₂)/2',
    reference: 'AASHTO, British Standard BS 6031',
    inputs: [
      { id: 'A1', label: 'Cross-Section Area 1 (A₁)', unit: 'm²', type: 'number', default: 25, min: 0 },
      { id: 'A2', label: 'Cross-Section Area 2 (A₂)', unit: 'm²', type: 'number', default: 18, min: 0 },
      { id: 'Am', label: 'Mid Cross-Section Area (Am)', unit: 'm²', type: 'number', default: 21.5, min: 0 },
      { id: 'L', label: 'Section Length', unit: 'm', type: 'number', default: 20, min: 1 },
      { id: 'swell', label: 'Swell Factor (loose/bank)', unit: '', type: 'number', default: 1.25, step: 0.01 },
    ],
    outputs: [
      { id: 'V_prism', label: 'Volume (Prismoidal)', unit: 'm³', decimals: 2 },
      { id: 'V_aea', label: 'Volume (Avg End Area)', unit: 'm³', decimals: 2 },
      { id: 'V_loose', label: 'Loose Volume (truck load)', unit: 'm³', decimals: 2 },
      { id: 'correction', label: 'Prismoidal Correction', unit: 'm³', decimals: 2 },
    ],
    calculate: ({ A1, A2, Am, L, swell }) => {
      const V_prism = (Number(L) / 6) * (Number(A1) + 4 * Number(Am) + Number(A2))
      const V_aea = Number(L) * (Number(A1) + Number(A2)) / 2
      return { V_prism, V_aea, V_loose: V_prism * Number(swell), correction: V_aea - V_prism }
    },
  },

  // ── Asphalt Pavement Thickness ─────────────────────────────
  'asphalt-pavement-thickness': {
    slug: 'asphalt-pavement-thickness',
    name: 'Asphalt Pavement Thickness',
    icon: '🛣️',
    description: 'Determine required asphalt and base layer thickness using CBR-based simplified method.',
    formula: 'SN = a₁D₁ + a₂D₂m₂ + a₃D₃m₃  |  CBR method: t = 75/√CBR × log(ESAL/10⁵)',
    reference: 'AASHTO 1993 Guide for Pavement Design',
    inputs: [
      { id: 'CBR', label: 'Subgrade CBR', unit: '%', type: 'number', default: 8, min: 1, step: 1 },
      { id: 'ESAL', label: 'Design ESALs', unit: '×10⁶', type: 'number', default: 5, min: 0.1 },
      { id: 'a1', label: 'HMA Layer Coefficient (a₁)', unit: '', type: 'number', default: 0.44, step: 0.01 },
      { id: 'a2', label: 'Base Layer Coeff (a₂)', unit: '', type: 'number', default: 0.14, step: 0.01 },
      { id: 'D2', label: 'Base Thickness (D₂)', unit: 'mm', type: 'number', default: 200, min: 50 },
    ],
    outputs: [
      { id: 'SN_needed', label: 'Required Structural Number (SN)', unit: '', decimals: 2 },
      { id: 'D1_mm', label: 'Min HMA Surface Thickness', unit: 'mm', decimals: 0 },
      { id: 'CBR_t', label: 'CBR Method Thickness (total)', unit: 'mm', decimals: 0 },
    ],
    calculate: ({ CBR, ESAL, a1, a2, D2 }) => {
      const Mr = 2555 * Math.pow(Number(CBR), 0.64)
      const W18 = Number(ESAL) * 1e6
      const SN_needed = Math.max(1, (Math.log10(W18) - 9.36 * Math.log10(1 + 1) + 0.20 + 2.32 * Math.log10(Mr) - 8.07) / -0.40 - 1)
      const SN_base = Number(a2) * Number(D2) / 25.4
      const SN1 = Math.max(0, SN_needed - SN_base)
      const D1_mm = (SN1 / Number(a1)) * 25.4
      const CBR_t = 75 / Math.sqrt(Number(CBR)) * Math.log10(Number(ESAL) * 1e6 / 1e5)
      return { SN_needed: Math.abs(SN_needed) + 2, D1_mm: Math.ceil(D1_mm / 12.5) * 12.5, CBR_t: Math.ceil(CBR_t) }
    },
  },

  // ── Slope Stability FOS ────────────────────────────────────
  'slope-stability-fos': {
    slug: 'slope-stability-fos',
    name: 'Slope Stability (FOS)',
    icon: '⛰️',
    description: 'Estimate factor of safety against slope failure using the infinite slope and Fellenius simplified methods.',
    formula: 'Infinite slope: FOS = (c\' + (γz cosα − u)tanφ\')/(γz sinα)  |  FOS > 1.5 = stable',
    reference: 'Fellenius (1936), Taylor (1948)',
    inputs: [
      { id: 'c', label: 'Effective Cohesion (c\')', unit: 'kPa', type: 'number', default: 15, min: 0 },
      { id: 'phi', label: 'Effective Friction Angle (φ\')', unit: '°', type: 'number', default: 28, min: 0 },
      { id: 'gamma', label: 'Unit Weight of Soil (γ)', unit: 'kN/m³', type: 'number', default: 18 },
      { id: 'z', label: 'Slip Depth (z)', unit: 'm', type: 'number', default: 4, min: 0.1 },
      { id: 'alpha', label: 'Slope Angle (α)', unit: '°', type: 'number', default: 25, min: 5 },
      { id: 'u', label: 'Pore Water Pressure (u)', unit: 'kPa', type: 'number', default: 10, min: 0 },
    ],
    outputs: [
      { id: 'FOS', label: 'Factor of Safety (FOS)', unit: '', decimals: 2 },
      { id: 'status', label: 'Status Code', unit: '', decimals: 0 },
      { id: 'normal', label: 'Normal Stress on Slip Plane', unit: 'kPa', decimals: 1 },
      { id: 'shear', label: 'Shear Stress on Slip Plane', unit: 'kPa', decimals: 1 },
    ],
    calculate: ({ c, phi, gamma, z, alpha, u }) => {
      const alphaR = Number(alpha) * Math.PI / 180
      const phiR = Number(phi) * Math.PI / 180
      const normal = Number(gamma) * Number(z) * Math.cos(alphaR) ** 2
      const shear = Number(gamma) * Number(z) * Math.sin(alphaR) * Math.cos(alphaR)
      const FOS = (Number(c) + (normal - Number(u)) * Math.tan(phiR)) / shear
      const status = FOS < 1 ? 1 : FOS < 1.3 ? 2 : 3
      return { FOS, status, normal, shear }
    },
  },

  // ── Soil Bearing Pressure ──────────────────────────────────
  'soil-bearing-pressure': {
    slug: 'soil-bearing-pressure',
    name: 'Soil Bearing Pressure',
    icon: '🌍',
    description: 'Calculate gross and net bearing pressure under a footing, including eccentric load check (middle-third rule).',
    formula: 'q = Q/A ± M·y/I  |  q_max = Q/A·(1+6e/B)  |  e ≤ B/6 (no tension)',
    reference: 'IS 1904, ASCE 7',
    inputs: [
      { id: 'Q', label: 'Column Load (Q)', unit: 'kN', type: 'number', default: 800, min: 0 },
      { id: 'M', label: 'Moment (M)', unit: 'kN·m', type: 'number', default: 50, min: 0 },
      { id: 'B', label: 'Footing Width (B)', unit: 'm', type: 'number', default: 2.0, min: 0.5 },
      { id: 'Lf', label: 'Footing Length (L)', unit: 'm', type: 'number', default: 2.0, min: 0.5 },
      { id: 'Df', label: 'Depth of Foundation (Df)', unit: 'm', type: 'number', default: 1.5, min: 0.3 },
      { id: 'gamma', label: 'Soil Unit Weight (γ)', unit: 'kN/m³', type: 'number', default: 18 },
    ],
    outputs: [
      { id: 'A', label: 'Footing Area', unit: 'm²', decimals: 2 },
      { id: 'q_avg', label: 'Average Bearing Pressure', unit: 'kPa', decimals: 1 },
      { id: 'q_max', label: 'Max Bearing Pressure', unit: 'kPa', decimals: 1 },
      { id: 'q_min', label: 'Min Bearing Pressure', unit: 'kPa', decimals: 1 },
      { id: 'eccentricity', label: 'Eccentricity (e)', unit: 'm', decimals: 3 },
    ],
    calculate: ({ Q, M, B, Lf, Df, gamma }) => {
      const A = Number(B) * Number(Lf)
      const e = Number(M) / Number(Q)
      const q_avg = Number(Q) / A + Number(gamma) * Number(Df)
      const q_max = (Number(Q) / A) * (1 + 6 * e / Number(B)) + Number(gamma) * Number(Df)
      const q_min = (Number(Q) / A) * (1 - 6 * e / Number(B)) + Number(gamma) * Number(Df)
      return { A, q_avg, q_max, q_min, eccentricity: e }
    },
  },

  // ── Construction Cost Estimator ────────────────────────────
  'construction-cost-estimator': {
    slug: 'construction-cost-estimator',
    name: 'Construction Cost Estimator',
    icon: '💰',
    description: 'Estimate total project cost including materials, labour, equipment, overhead and profit.',
    formula: 'C_total = C_mat + C_lab + C_equip + C_OH + C_profit + C_contingency',
    reference: 'FIDIC, CSI MasterFormat',
    inputs: [
      { id: 'C_mat', label: 'Material Cost', unit: '$', type: 'number', default: 500000 },
      { id: 'C_lab', label: 'Labour Cost', unit: '$', type: 'number', default: 300000 },
      { id: 'C_equip', label: 'Equipment Cost', unit: '$', type: 'number', default: 100000 },
      { id: 'oh_pct', label: 'Overhead', unit: '%', type: 'number', default: 15, min: 0, step: 1 },
      { id: 'profit_pct', label: 'Profit', unit: '%', type: 'number', default: 10, min: 0, step: 1 },
      { id: 'contingency_pct', label: 'Contingency', unit: '%', type: 'number', default: 5, min: 0, step: 1 },
    ],
    outputs: [
      { id: 'C_direct', label: 'Direct Cost', unit: '$', decimals: 0 },
      { id: 'C_oh', label: 'Overhead', unit: '$', decimals: 0 },
      { id: 'C_profit', label: 'Profit', unit: '$', decimals: 0 },
      { id: 'C_contingency', label: 'Contingency', unit: '$', decimals: 0 },
      { id: 'C_total', label: 'Total Project Cost', unit: '$', decimals: 0 },
    ],
    calculate: ({ C_mat, C_lab, C_equip, oh_pct, profit_pct, contingency_pct }) => {
      const C_direct = Number(C_mat) + Number(C_lab) + Number(C_equip)
      const C_oh = C_direct * Number(oh_pct) / 100
      const C_profit = (C_direct + C_oh) * Number(profit_pct) / 100
      const sub = C_direct + C_oh + C_profit
      const C_contingency = sub * Number(contingency_pct) / 100
      return { C_direct, C_oh, C_profit, C_contingency, C_total: sub + C_contingency }
    },
  },

  // ══════════════════════════════════════════════════════════
  // SECTION 2 — ELECTRICAL ENGINEERING (additional tools)
  // ══════════════════════════════════════════════════════════

  // ── Transformer Sizing ─────────────────────────────────────
  'transformer-sizing': {
    slug: 'transformer-sizing',
    name: 'Transformer Sizing Tool',
    icon: '🔄',
    description: 'Calculate required kVA rating, turns ratio, secondary current, and voltage regulation for transformers.',
    formula: 'S = P/PF  |  a = N₁/N₂ = V₁/V₂  |  I₂_FL = S×1000/V₂  |  VR ≈ εR·cosφ + εX·sinφ',
    reference: 'IEC 60076, IEEE C57',
    inputs: [
      { id: 'P_kw', label: 'Load Power', unit: 'kW', type: 'number', default: 100, min: 1 },
      { id: 'pf', label: 'Power Factor', unit: '', type: 'number', default: 0.85, step: 0.01 },
      { id: 'V1', label: 'Primary Voltage (V₁)', unit: 'V', type: 'number', default: 11000 },
      { id: 'V2', label: 'Secondary Voltage (V₂)', unit: 'V', type: 'number', default: 415 },
      { id: 'Zk', label: 'Short-Circuit Impedance (Z%)', unit: '%', type: 'number', default: 5, step: 0.5 },
      { id: 'margin', label: 'Sizing Margin', unit: '%', type: 'number', default: 25, step: 5 },
    ],
    outputs: [
      { id: 'kva_load', label: 'Load kVA', unit: 'kVA', decimals: 1 },
      { id: 'kva_rated', label: 'Recommended Rating', unit: 'kVA', decimals: 0 },
      { id: 'turns_ratio', label: 'Turns Ratio (a)', unit: ':1', decimals: 3 },
      { id: 'I2_FL', label: 'Secondary Full-Load Current', unit: 'A', decimals: 1 },
      { id: 'I_sc', label: 'Short-Circuit Current (sec)', unit: 'A', decimals: 0 },
    ],
    calculate: ({ P_kw, pf, V1, V2, Zk, margin }) => {
      const kva_load = Number(P_kw) / Number(pf)
      const kva_rated = kva_load * (1 + Number(margin) / 100)
      const turns_ratio = Number(V1) / Number(V2)
      const I2_FL = kva_rated * 1000 / Number(V2)
      const I_sc = I2_FL * 100 / Number(Zk)
      return { kva_load, kva_rated, turns_ratio, I2_FL, I_sc }
    },
  },

  // ── Motor Starting Current ─────────────────────────────────
  'motor-starting-current': {
    slug: 'motor-starting-current',
    name: 'Motor Starting Current',
    icon: '🔃',
    description: 'Calculate full-load current, starting current and motor slip for three-phase induction motors.',
    formula: 'I_FL = P/(√3·V·η·PF)  |  I_DOL = 6–7×I_FL  |  I_Y-Δ = I_DOL/3  |  ns = 120f/P',
    reference: 'IEC 60034, NEC 430',
    inputs: [
      { id: 'P_kw', label: 'Motor Power', unit: 'kW', type: 'number', default: 37, min: 0.1 },
      { id: 'V', label: 'Line Voltage', unit: 'V', type: 'number', default: 415 },
      { id: 'eta', label: 'Motor Efficiency (η)', unit: '%', type: 'number', default: 92, min: 50, step: 1 },
      { id: 'pf', label: 'Full-Load Power Factor', unit: '', type: 'number', default: 0.87, step: 0.01 },
      { id: 'poles', label: 'Number of Poles', unit: '', type: 'number', default: 4, min: 2, step: 2 },
      { id: 'freq', label: 'Supply Frequency', unit: 'Hz', type: 'number', default: 50 },
      { id: 'slip', label: 'Full-Load Slip', unit: '%', type: 'number', default: 3.5, step: 0.5 },
    ],
    outputs: [
      { id: 'I_FL', label: 'Full-Load Current', unit: 'A', decimals: 1 },
      { id: 'I_DOL', label: 'DOL Starting Current (×6.5)', unit: 'A', decimals: 0 },
      { id: 'I_yd', label: 'Star-Delta Starting Current', unit: 'A', decimals: 0 },
      { id: 'n_sync', label: 'Synchronous Speed', unit: 'RPM', decimals: 0 },
      { id: 'n_rated', label: 'Rated Speed', unit: 'RPM', decimals: 0 },
    ],
    calculate: ({ P_kw, V, eta, pf, poles, freq, slip }) => {
      const I_FL = (Number(P_kw) * 1000) / (Math.sqrt(3) * Number(V) * (Number(eta) / 100) * Number(pf))
      const I_DOL = I_FL * 6.5
      const I_yd = I_DOL / 3
      const n_sync = 120 * Number(freq) / Number(poles)
      const n_rated = n_sync * (1 - Number(slip) / 100)
      return { I_FL, I_DOL, I_yd, n_sync, n_rated }
    },
  },

  // ── LED Energy Savings ─────────────────────────────────────
  'led-energy-savings': {
    slug: 'led-energy-savings',
    name: 'LED Energy Savings Calculator',
    icon: '💡',
    description: 'Calculate energy and cost savings from replacing conventional lighting with LEDs.',
    formula: 'E_saved = ΔP × hours/yr / 1000  |  C_saved = E_saved × tariff  |  PBP = Capital/C_saved',
    reference: 'ASHRAE 90.1, IEC 60598',
    inputs: [
      { id: 'n_fixtures', label: 'Number of Fixtures', unit: '', type: 'number', default: 100, min: 1 },
      { id: 'P_old', label: 'Old Fixture Wattage', unit: 'W', type: 'number', default: 250, min: 1, placeholder: 'e.g. MH 250W' },
      { id: 'P_new', label: 'New LED Wattage', unit: 'W', type: 'number', default: 100, min: 1 },
      { id: 'hours', label: 'Operating Hours/Year', unit: 'hr/yr', type: 'number', default: 4000 },
      { id: 'tariff', label: 'Electricity Tariff', unit: '$/kWh', type: 'number', default: 0.12, step: 0.01 },
      { id: 'capital', label: 'LED Capital Cost', unit: '$', type: 'number', default: 15000 },
    ],
    outputs: [
      { id: 'P_saved_kw', label: 'Power Saved per Fixture', unit: 'W', decimals: 0 },
      { id: 'E_saved', label: 'Annual Energy Saved', unit: 'kWh/yr', decimals: 0 },
      { id: 'C_saved', label: 'Annual Cost Savings', unit: '$/yr', decimals: 0 },
      { id: 'PBP', label: 'Simple Payback Period', unit: 'years', decimals: 1 },
      { id: 'CO2_saved', label: 'CO₂ Avoided (0.45 kg/kWh)', unit: 'kg/yr', decimals: 0 },
    ],
    calculate: ({ n_fixtures, P_old, P_new, hours, tariff, capital }) => {
      const P_saved_kw = Number(P_old) - Number(P_new)
      const E_saved = P_saved_kw * Number(n_fixtures) * Number(hours) / 1000
      const C_saved = E_saved * Number(tariff)
      const PBP = Number(capital) / C_saved
      return { P_saved_kw, E_saved, C_saved, PBP, CO2_saved: E_saved * 0.45 }
    },
  },

  // ── Circuit Breaker Sizing ─────────────────────────────────
  'circuit-breaker-sizing': {
    slug: 'circuit-breaker-sizing',
    name: 'Circuit Breaker Sizing',
    icon: '🔲',
    description: 'Size circuit breakers for continuous and motor loads per NEC 80% continuous rule and NEC 430.52.',
    formula: 'I_CB = I_load/0.80 (continuous)  |  Motor: I_CB ≥ 250%×I_FL (NEC 430.52)',
    reference: 'NEC 2023 Articles 210, 430',
    inputs: [
      { id: 'load_type', label: 'Load Type', type: 'select', default: 'continuous', options: [
        { label: 'Continuous Load (NEC 210)', value: 'continuous' },
        { label: 'Motor — Inverse Time Breaker', value: 'motor_itb' },
        { label: 'Motor — Instantaneous Trip', value: 'motor_inst' },
        { label: 'Non-continuous Load', value: 'non_cont' },
      ]},
      { id: 'I_load', label: 'Load / Full-Load Current', unit: 'A', type: 'number', default: 32, min: 0.5 },
    ],
    outputs: [
      { id: 'I_min', label: 'Minimum CB Rating', unit: 'A', decimals: 1 },
      { id: 'I_std', label: 'Recommended Standard Size', unit: 'A', decimals: 0 },
    ],
    calculate: ({ load_type, I_load }) => {
      const I = Number(I_load)
      let I_min = 0
      if (load_type === 'continuous') I_min = I / 0.80
      else if (load_type === 'motor_itb') I_min = I * 2.50
      else if (load_type === 'motor_inst') I_min = I * 8.00
      else I_min = I * 1.0
      const std = [15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100, 125, 150, 175, 200, 225, 250, 300, 350, 400, 500, 600, 800, 1000, 1200]
      const I_std = std.find(s => s >= I_min) ?? 1200
      return { I_min, I_std }
    },
  },

  // ── Capacitor Bank Sizing ──────────────────────────────────
  'capacitor-bank-sizing': {
    slug: 'capacitor-bank-sizing',
    name: 'Capacitor Bank Sizing',
    icon: '🔋',
    description: 'Calculate required capacitor kVAR for power factor correction and capacitance value.',
    formula: 'Q_c = P·(tanφ₁ − tanφ₂)  |  C = Q_c/(3·ω·V²) [3-phase delta]',
    reference: 'IEC 60831, NEMA',
    inputs: [
      { id: 'P', label: 'Active Load Power', unit: 'kW', type: 'number', default: 500, min: 1 },
      { id: 'pf1', label: 'Existing Power Factor', unit: '', type: 'number', default: 0.72, step: 0.01 },
      { id: 'pf2', label: 'Target Power Factor', unit: '', type: 'number', default: 0.95, step: 0.01 },
      { id: 'V', label: 'System Voltage (line)', unit: 'V', type: 'number', default: 415 },
      { id: 'freq', label: 'Frequency', unit: 'Hz', type: 'number', default: 50 },
    ],
    outputs: [
      { id: 'Qc', label: 'Required Reactive Power (Q_c)', unit: 'kVAR', decimals: 1 },
      { id: 'S1', label: 'Original Apparent Power', unit: 'kVA', decimals: 1 },
      { id: 'S2', label: 'New Apparent Power', unit: 'kVA', decimals: 1 },
      { id: 'C_uF', label: 'Capacitance (3-ph delta)', unit: 'μF', decimals: 1 },
    ],
    calculate: ({ P, pf1, pf2, V, freq }) => {
      const phi1 = Math.acos(Number(pf1)), phi2 = Math.acos(Number(pf2))
      const Qc = Number(P) * (Math.tan(phi1) - Math.tan(phi2))
      const S1 = Number(P) / Number(pf1)
      const S2 = Number(P) / Number(pf2)
      const omega = 2 * Math.PI * Number(freq)
      const C_uF = (Qc * 1000) / (3 * omega * Number(V) ** 2) * 1e6
      return { Qc, S1, S2, C_uF }
    },
  },

  // ── UPS Battery Backup ─────────────────────────────────────
  'ups-battery-backup': {
    slug: 'ups-battery-backup',
    name: 'UPS Battery Backup Calculator',
    icon: '🔋',
    description: 'Calculate battery capacity (Ah) and backup runtime for a UPS system.',
    formula: 'C_bat = (P_load × t) / (V_bat × η × DoD)  |  t = (C × V × η × DoD) / P_load',
    reference: 'IEEE 485, IEC 62040',
    inputs: [
      { id: 'P_load', label: 'IT Load', unit: 'W', type: 'number', default: 5000, min: 100 },
      { id: 'V_bat', label: 'Battery Bank Voltage', unit: 'V', type: 'number', default: 48 },
      { id: 'eta', label: 'Inverter Efficiency (η)', unit: '%', type: 'number', default: 92, min: 50 },
      { id: 'DoD', label: 'Max Depth of Discharge', unit: '%', type: 'number', default: 80, step: 5 },
      { id: 't_min', label: 'Required Backup Time', unit: 'min', type: 'number', default: 30, min: 5 },
      { id: 'C_per_bat', label: 'Capacity per Battery', unit: 'Ah', type: 'number', default: 100 },
      { id: 'V_per_bat', label: 'Voltage per Battery', unit: 'V', type: 'number', default: 12 },
    ],
    outputs: [
      { id: 'C_total', label: 'Required Battery Capacity', unit: 'Ah', decimals: 1 },
      { id: 'N_series', label: 'Batteries in Series', unit: 'nos', decimals: 0 },
      { id: 'N_parallel', label: 'Strings in Parallel', unit: 'nos', decimals: 0 },
      { id: 'runtime', label: 'Runtime with Selected Bank', unit: 'min', decimals: 0 },
    ],
    calculate: ({ P_load, V_bat, eta, DoD, t_min, C_per_bat, V_per_bat }) => {
      const t_hr = Number(t_min) / 60
      const C_total = (Number(P_load) * t_hr) / (Number(V_bat) * (Number(eta) / 100) * (Number(DoD) / 100))
      const N_series = Math.ceil(Number(V_bat) / Number(V_per_bat))
      const N_parallel = Math.ceil(C_total / Number(C_per_bat))
      const C_bank = N_parallel * Number(C_per_bat)
      const runtime = (C_bank * Number(V_bat) * (Number(eta) / 100) * (Number(DoD) / 100)) / Number(P_load) * 60
      return { C_total, N_series, N_parallel, runtime }
    },
  },

  // ── Power Factor Correction ────────────────────────────────
  'power-factor-correction': {
    slug: 'power-factor-correction',
    name: 'Power Factor Correction',
    icon: '📊',
    description: 'Calculate capacitor kVAR required to improve power factor and resulting current reduction.',
    formula: 'Q_c = P·(tanφ₁ − tanφ₂)  |  ΔI = I·(sinφ₁ − sinφ₂)',
    reference: 'IEC 60831, IEEE 1459',
    inputs: [
      { id: 'P', label: 'Active Power', unit: 'kW', type: 'number', default: 200, min: 1 },
      { id: 'pf_exist', label: 'Existing Power Factor', unit: '', type: 'number', default: 0.70, step: 0.01 },
      { id: 'pf_target', label: 'Target Power Factor', unit: '', type: 'number', default: 0.95, step: 0.01 },
      { id: 'V', label: 'System Voltage (L-L)', unit: 'V', type: 'number', default: 400 },
    ],
    outputs: [
      { id: 'Qc', label: 'Capacitor Bank (Q_c)', unit: 'kVAR', decimals: 1 },
      { id: 'I_before', label: 'Current Before', unit: 'A', decimals: 1 },
      { id: 'I_after', label: 'Current After', unit: 'A', decimals: 1 },
      { id: 'I_reduction', label: 'Current Reduction', unit: '%', decimals: 1 },
      { id: 'kva_saving', label: 'kVA Reduction', unit: 'kVA', decimals: 1 },
    ],
    calculate: ({ P, pf_exist, pf_target, V }) => {
      const phi1 = Math.acos(Number(pf_exist)), phi2 = Math.acos(Number(pf_target))
      const Qc = Number(P) * (Math.tan(phi1) - Math.tan(phi2))
      const S1 = Number(P) / Number(pf_exist), S2 = Number(P) / Number(pf_target)
      const I_before = S1 * 1000 / (Math.sqrt(3) * Number(V))
      const I_after = S2 * 1000 / (Math.sqrt(3) * Number(V))
      return { Qc, I_before, I_after, I_reduction: (I_before - I_after) / I_before * 100, kva_saving: S1 - S2 }
    },
  },

  // ── Short Circuit Current ──────────────────────────────────
  'short-circuit-current': {
    slug: 'short-circuit-current',
    name: 'Short Circuit Current (SCC)',
    icon: '⚠️',
    description: 'Calculate symmetrical three-phase and single-phase fault current using impedance method (IEC 60909).',
    formula: 'Isc3 = V_LL/(√3·Z_total)  |  Z_total = Z_source + Z_tx + Z_cable',
    reference: 'IEC 60909, IEEE 551',
    inputs: [
      { id: 'V_kv', label: 'System Voltage (L-L)', unit: 'kV', type: 'number', default: 0.415, step: 0.001 },
      { id: 'S_grid', label: 'Grid Fault Level', unit: 'MVA', type: 'number', default: 250, min: 1 },
      { id: 'S_tx', label: 'Transformer Rating', unit: 'kVA', type: 'number', default: 1000, min: 10 },
      { id: 'Zk', label: 'Transformer Impedance (Z%)', unit: '%', type: 'number', default: 5, step: 0.5 },
      { id: 'R_cable', label: 'Cable Resistance', unit: 'mΩ', type: 'number', default: 50, min: 0 },
      { id: 'X_cable', label: 'Cable Reactance', unit: 'mΩ', type: 'number', default: 15, min: 0 },
    ],
    outputs: [
      { id: 'Z_source', label: 'Source Impedance', unit: 'mΩ', decimals: 3 },
      { id: 'Z_tx', label: 'Transformer Impedance', unit: 'mΩ', decimals: 3 },
      { id: 'Z_total', label: 'Total Impedance', unit: 'mΩ', decimals: 3 },
      { id: 'Isc3_kA', label: '3-Phase Fault Current', unit: 'kA', decimals: 2 },
      { id: 'fault_mva', label: 'Fault MVA', unit: 'MVA', decimals: 2 },
    ],
    calculate: ({ V_kv, S_grid, S_tx, Zk, R_cable, X_cable }) => {
      const V = Number(V_kv) * 1000
      const Z_source = (V ** 2) / (Number(S_grid) * 1e6) * 1000
      const Z_tx = (Number(Zk) / 100) * (V ** 2) / (Number(S_tx) * 1000) * 1000
      const R_total = Z_source * 0.1 + Z_tx * 0.1 + Number(R_cable)
      const X_total = Z_source * 0.995 + Z_tx * 0.995 + Number(X_cable)
      const Z_total = Math.sqrt(R_total ** 2 + X_total ** 2)
      const Isc3_kA = V / (Math.sqrt(3) * Z_total) / 1000
      const fault_mva = Math.sqrt(3) * Number(V_kv) * Isc3_kA
      return { Z_source, Z_tx, Z_total, Isc3_kA, fault_mva }
    },
  },

  // ── Conduit Fill Calculator ────────────────────────────────
  'conduit-fill-calculator': {
    slug: 'conduit-fill-calculator',
    name: 'Conduit Fill Calculator',
    icon: '🚇',
    description: 'Calculate total wire area and minimum conduit size per NEC Chapter 9 fill percentages.',
    formula: 'Total_area = Σ(π/4 × OD²)  |  Fill%: 1 wire=53%, 2=31%, 3+=40%',
    reference: 'NEC 2023 Chapter 9, Table 1 & Table 4',
    inputs: [
      { id: 'n1', label: 'No. of #12 AWG THWN conductors', unit: '', type: 'number', default: 3, min: 0, step: 1 },
      { id: 'n2', label: 'No. of #10 AWG THWN conductors', unit: '', type: 'number', default: 0, min: 0, step: 1 },
      { id: 'n3', label: 'No. of #8 AWG THWN conductors', unit: '', type: 'number', default: 0, min: 0, step: 1 },
      { id: 'n4', label: 'No. of #6 AWG THWN conductors', unit: '', type: 'number', default: 0, min: 0, step: 1 },
      { id: 'n5', label: 'No. of #4 AWG THWN conductors', unit: '', type: 'number', default: 0, min: 0, step: 1 },
    ],
    outputs: [
      { id: 'total_area_mm2', label: 'Total Wire Area', unit: 'mm²', decimals: 1 },
      { id: 'fill_pct', label: 'Fill Percentage Used', unit: '%', decimals: 0 },
      { id: 'conduit_id_mm', label: 'Min Conduit Inner Diameter', unit: 'mm', decimals: 1 },
      { id: 'emt_trade', label: 'EMT Trade Size', unit: '"', decimals: 2 },
    ],
    calculate: ({ n1, n2, n3, n4, n5 }) => {
      const awgOD_mm: Record<string, number> = { '12': 4.17, '10': 5.26, '8': 6.68, '6': 8.43, '4': 10.57 }
      const counts = [Number(n1), Number(n2), Number(n3), Number(n4), Number(n5)]
      const awgs = ['12', '10', '8', '6', '4']
      let total_area_mm2 = 0
      counts.forEach((n, i) => { total_area_mm2 += n * Math.PI / 4 * awgOD_mm[awgs[i]] ** 2 })
      const total_n = counts.reduce((a, b) => a + b, 0)
      const fill_frac = total_n <= 1 ? 0.53 : total_n === 2 ? 0.31 : 0.40
      const fill_pct = fill_frac * 100
      const conduit_area = total_area_mm2 / fill_frac
      const conduit_id_mm = Math.sqrt(4 * conduit_area / Math.PI)
      const emt: [number, number][] = [[16, 0.5], [21, 0.75], [27, 1], [35, 1.25], [41, 1.5], [53, 2], [63, 2.5], [78, 3], [91, 3.5], [103, 4]]
      const emt_trade = (emt.find(([id]) => id >= conduit_id_mm) ?? [103, 4])[1]
      return { total_area_mm2, fill_pct, conduit_id_mm, emt_trade }
    },
  },

  // ── PV System ROI ──────────────────────────────────────────
  'pv-system-roi': {
    slug: 'pv-system-roi',
    name: 'PV System ROI Calculator',
    icon: '💹',
    description: 'Calculate annual solar generation, payback period, NPV and LCOE for a PV system investment.',
    formula: 'E_annual = P_sys × PR × H  |  NPV = Σ(CF_t/(1+r)^t) − C₀  |  LCOE = LCC/Lifetime_energy',
    reference: 'IEA PVPS, NREL SAM methodology',
    inputs: [
      { id: 'P_kw', label: 'System Size', unit: 'kWp', type: 'number', default: 50, min: 1 },
      { id: 'H_annual', label: 'Annual Peak Sun Hours', unit: 'hr/yr', type: 'number', default: 1800, min: 500 },
      { id: 'PR', label: 'Performance Ratio (PR)', unit: '', type: 'number', default: 0.78, step: 0.01 },
      { id: 'tariff', label: 'Electricity Tariff', unit: '$/kWh', type: 'number', default: 0.15, step: 0.01 },
      { id: 'C0', label: 'System Capital Cost', unit: '$', type: 'number', default: 50000 },
      { id: 'om_annual', label: 'Annual O&M Cost', unit: '$/yr', type: 'number', default: 500 },
      { id: 'r', label: 'Discount Rate', unit: '%', type: 'number', default: 8, step: 0.5 },
      { id: 'life', label: 'System Lifetime', unit: 'years', type: 'number', default: 25 },
    ],
    outputs: [
      { id: 'E_annual', label: 'Annual Generation', unit: 'kWh/yr', decimals: 0 },
      { id: 'S_annual', label: 'Annual Savings', unit: '$/yr', decimals: 0 },
      { id: 'PBP', label: 'Simple Payback', unit: 'years', decimals: 1 },
      { id: 'NPV', label: 'Net Present Value (25yr)', unit: '$', decimals: 0 },
      { id: 'LCOE', label: 'LCOE', unit: '$/kWh', decimals: 4 },
    ],
    calculate: ({ P_kw, H_annual, PR, tariff, C0, om_annual, r, life }) => {
      const E_annual = Number(P_kw) * Number(H_annual) * Number(PR)
      const S_annual = E_annual * Number(tariff) - Number(om_annual)
      const PBP = Number(C0) / S_annual
      const disc = Number(r) / 100
      let NPV = -Number(C0), LCC = Number(C0), E_total = 0
      for (let t = 1; t <= Number(life); t++) {
        NPV += S_annual / Math.pow(1 + disc, t)
        LCC += Number(om_annual) / Math.pow(1 + disc, t)
        E_total += E_annual / Math.pow(1 + disc, t)
      }
      return { E_annual, S_annual, PBP, NPV, LCOE: LCC / E_total }
    },
  },

  // ── Battery State of Charge ────────────────────────────────
  'battery-state-of-charge': {
    slug: 'battery-state-of-charge',
    name: 'Battery State of Charge',
    icon: '🔋',
    description: 'Calculate state of charge, depth of discharge, remaining runtime and capacity fade over cycles.',
    formula: 'SOC = Q_remaining/Q_rated × 100%  |  C_n = C₀ × (1 − k_deg)^n',
    reference: 'IEC 62133, IEEE 1725',
    inputs: [
      { id: 'C_rated', label: 'Rated Capacity', unit: 'Ah', type: 'number', default: 200, min: 1 },
      { id: 'Q_remaining', label: 'Remaining Charge', unit: 'Ah', type: 'number', default: 140 },
      { id: 'V_nom', label: 'Nominal Voltage', unit: 'V', type: 'number', default: 48 },
      { id: 'I_discharge', label: 'Discharge Current', unit: 'A', type: 'number', default: 20, min: 0 },
      { id: 'cycles', label: 'Charge Cycles Completed', unit: '', type: 'number', default: 500, min: 0 },
      { id: 'chem', label: 'Battery Chemistry', type: 'select', default: 'liion', options: [
        { label: 'Li-ion (k = 0.0002/cycle)', value: 'liion' },
        { label: 'Lead-Acid (k = 0.001/cycle)', value: 'lead' },
      ]},
    ],
    outputs: [
      { id: 'SOC', label: 'State of Charge', unit: '%', decimals: 1 },
      { id: 'DoD', label: 'Depth of Discharge', unit: '%', decimals: 1 },
      { id: 'runtime', label: 'Remaining Runtime', unit: 'hr', decimals: 2 },
      { id: 'C_current', label: 'Current Capacity (after fade)', unit: 'Ah', decimals: 1 },
      { id: 'energy_kwh', label: 'Remaining Energy', unit: 'kWh', decimals: 2 },
    ],
    calculate: ({ C_rated, Q_remaining, V_nom, I_discharge, cycles, chem }) => {
      const k_deg = chem === 'liion' ? 0.0002 : 0.001
      const C_current = Number(C_rated) * Math.pow(1 - k_deg, Number(cycles))
      const SOC = (Number(Q_remaining) / C_current) * 100
      const DoD = 100 - SOC
      const runtime = Number(I_discharge) > 0 ? Number(Q_remaining) / Number(I_discharge) : 0
      const energy_kwh = Number(Q_remaining) * Number(V_nom) / 1000
      return { SOC, DoD, runtime, C_current, energy_kwh }
    },
  },

  // ── Earthing / Grounding Resistance ───────────────────────
  'earthing-grounding-resistance': {
    slug: 'earthing-grounding-resistance',
    name: 'Earthing / Grounding Resistance',
    icon: '🌱',
    description: 'Calculate earth resistance of single rods, plate and grid electrodes using IEEE 80 and standard formulas.',
    formula: 'Single rod: R = (ρ/2πL)·[ln(4L/d)−1]  |  Grid: R ≈ ρ·(1/(4r) + 1/Lt)',
    reference: 'IEEE 80-2000, IS 3043',
    inputs: [
      { id: 'type', label: 'Electrode Type', type: 'select', default: 'rod', options: [
        { label: 'Single Rod', value: 'rod' },
        { label: 'Circular Plate', value: 'plate' },
        { label: 'Grid (IEEE 80 approx.)', value: 'grid' },
      ]},
      { id: 'rho', label: 'Soil Resistivity (ρ)', unit: 'Ω·m', type: 'number', default: 100, min: 1, placeholder: 'Clay≈20, Sand≈1000' },
      { id: 'L', label: 'Rod Length / Grid Conductor Length', unit: 'm', type: 'number', default: 3, min: 0.1 },
      { id: 'dia', label: 'Rod Diameter / Plate Radius', unit: 'm', type: 'number', default: 0.016, step: 0.001 },
      { id: 'A_grid', label: 'Grid Area (for grid type)', unit: 'm²', type: 'number', default: 100 },
    ],
    outputs: [
      { id: 'R_earth', label: 'Earth Resistance', unit: 'Ω', decimals: 3 },
      { id: 'status', label: 'Status (1=ok ≤1Ω, 2=≤5Ω, 3=>5Ω)', unit: '', decimals: 0 },
    ],
    calculate: ({ type, rho, L, dia, A_grid }) => {
      let R_earth = 0
      const rhoN = Number(rho), LN = Number(L), dN = Number(dia)
      if (type === 'rod') R_earth = (rhoN / (2 * Math.PI * LN)) * (Math.log(4 * LN / dN) - 1)
      else if (type === 'plate') R_earth = rhoN / (8 * dN)
      else { const r_eq = Math.sqrt(Number(A_grid) / Math.PI); R_earth = rhoN * (1 / (4 * r_eq) + 1 / LN) }
      const status = R_earth <= 1 ? 1 : R_earth <= 5 ? 2 : 3
      return { R_earth, status }
    },
  },

  // ── Load Schedule / Panel Board ────────────────────────────
  'load-schedule-panel': {
    slug: 'load-schedule-panel',
    name: 'Load Schedule / Panel Board',
    icon: '📋',
    description: 'Calculate total connected load, maximum demand, feeder current and diversity for a panel board.',
    formula: 'MD = P_total × DF  |  I_feeder = MD/(√3·V·PF)  |  Load Factor = Average/Peak',
    reference: 'NEC 220, IEC 60364',
    inputs: [
      { id: 'P_lighting', label: 'Lighting Load', unit: 'W', type: 'number', default: 5000, min: 0 },
      { id: 'P_HVAC', label: 'HVAC Load', unit: 'W', type: 'number', default: 15000, min: 0 },
      { id: 'P_power', label: 'Power Outlets Load', unit: 'W', type: 'number', default: 8000, min: 0 },
      { id: 'P_misc', label: 'Miscellaneous Load', unit: 'W', type: 'number', default: 3000, min: 0 },
      { id: 'DF', label: 'Demand Factor', unit: '', type: 'number', default: 0.75, step: 0.05 },
      { id: 'PF', label: 'Power Factor', unit: '', type: 'number', default: 0.85, step: 0.01 },
      { id: 'V_LL', label: 'Line-to-Line Voltage', unit: 'V', type: 'number', default: 415 },
    ],
    outputs: [
      { id: 'P_total', label: 'Total Connected Load', unit: 'kW', decimals: 2 },
      { id: 'MD', label: 'Maximum Demand', unit: 'kW', decimals: 2 },
      { id: 'kva', label: 'Apparent Demand', unit: 'kVA', decimals: 2 },
      { id: 'I_feeder', label: 'Feeder Current (3-ph)', unit: 'A', decimals: 1 },
    ],
    calculate: ({ P_lighting, P_HVAC, P_power, P_misc, DF, PF, V_LL }) => {
      const P_total = (Number(P_lighting) + Number(P_HVAC) + Number(P_power) + Number(P_misc)) / 1000
      const MD = P_total * Number(DF)
      const kva = MD / Number(PF)
      const I_feeder = kva * 1000 / (Math.sqrt(3) * Number(V_LL))
      return { P_total, MD, kva, I_feeder }
    },
  },

  // ══════════════════════════════════════════════════════════
  // SECTION 3 — MECHANICAL ENGINEERING (additional tools)
  // ══════════════════════════════════════════════════════════

  // ── Pressure Vessel Thickness ──────────────────────────────
  'pressure-vessel-thickness': {
    slug: 'pressure-vessel-thickness',
    name: 'Pressure Vessel Thickness',
    icon: '🫙',
    description: 'Calculate minimum required wall thickness for cylindrical and spherical pressure vessels per ASME Section VIII Div. 1.',
    formula: 'Cylinder: t = P·R/(S·E − 0.6P) + CA  |  Sphere: t = P·R/(2·S·E − 0.2P) + CA',
    reference: 'ASME BPVC Section VIII Div. 1',
    inputs: [
      { id: 'vessel', label: 'Vessel Type', type: 'select', default: 'cyl', options: [
        { label: 'Cylindrical Shell (hoop)', value: 'cyl' },
        { label: 'Cylindrical Shell (longitudinal)', value: 'cyl_long' },
        { label: 'Spherical Shell', value: 'sphere' },
      ]},
      { id: 'P', label: 'Design Pressure', unit: 'MPa', type: 'number', default: 1.5, min: 0.01, step: 0.01 },
      { id: 'R', label: 'Inside Radius (R)', unit: 'mm', type: 'number', default: 500, min: 10 },
      { id: 'S', label: 'Allowable Stress (S)', unit: 'MPa', type: 'number', default: 138, min: 10, placeholder: 'e.g. SA-516-70 = 138 MPa' },
      { id: 'E', label: 'Joint Efficiency (E)', unit: '', type: 'number', default: 1.0, step: 0.05, placeholder: '1.0 full, 0.85 spot RT' },
      { id: 'CA', label: 'Corrosion Allowance (CA)', unit: 'mm', type: 'number', default: 3, min: 0 },
    ],
    outputs: [
      { id: 't_calc', label: 'Calculated Thickness', unit: 'mm', decimals: 2 },
      { id: 't_nom', label: 'Nominal Thickness (round up)', unit: 'mm', decimals: 0 },
      { id: 'MAWP', label: 'MAWP (at nom. thickness)', unit: 'MPa', decimals: 3 },
    ],
    calculate: ({ vessel, P, R, S, E, CA }) => {
      const p = Number(P), r = Number(R), s = Number(S), e = Number(E), ca = Number(CA)
      let t_calc = 0
      if (vessel === 'cyl') t_calc = p * r / (s * e - 0.6 * p)
      else if (vessel === 'cyl_long') t_calc = p * r / (2 * s * e + 0.4 * p)
      else t_calc = p * r / (2 * s * e - 0.2 * p)
      const t_with_ca = t_calc + ca
      const t_nom = Math.ceil(t_with_ca)
      const t_eff = t_nom - ca
      let MAWP = 0
      if (vessel === 'cyl') MAWP = s * e * t_eff / (r + 0.6 * t_eff)
      else if (vessel === 'cyl_long') MAWP = 2 * s * e * t_eff / (r - 0.4 * t_eff)
      else MAWP = 2 * s * e * t_eff / (r + 0.2 * t_eff)
      return { t_calc: t_with_ca, t_nom, MAWP }
    },
  },

  // ── Fluid Flow Rate (Bernoulli) ────────────────────────────
  'fluid-flow-rate': {
    slug: 'fluid-flow-rate',
    name: 'Fluid Flow Rate Calculator',
    icon: '💧',
    description: 'Calculate flow velocity, volumetric flow rate and apply Bernoulli\'s equation between two points.',
    formula: 'P₁/ρg + v₁²/2g + z₁ = P₂/ρg + v₂²/2g + z₂ + hL  |  Q = A·v',
    reference: 'Fluid Mechanics — Munson, Young & Okiishi',
    inputs: [
      { id: 'D1', label: 'Diameter at Point 1 (D₁)', unit: 'mm', type: 'number', default: 100, min: 1 },
      { id: 'D2', label: 'Diameter at Point 2 (D₂)', unit: 'mm', type: 'number', default: 50, min: 1 },
      { id: 'P1', label: 'Pressure at Point 1 (P₁)', unit: 'kPa', type: 'number', default: 200, min: 0 },
      { id: 'z1', label: 'Elevation Point 1 (z₁)', unit: 'm', type: 'number', default: 5, min: 0 },
      { id: 'z2', label: 'Elevation Point 2 (z₂)', unit: 'm', type: 'number', default: 0, min: 0 },
      { id: 'rho', label: 'Fluid Density (ρ)', unit: 'kg/m³', type: 'number', default: 1000, min: 1, placeholder: 'Water=1000, Oil≈850' },
      { id: 'hL', label: 'Head Loss (h_L)', unit: 'm', type: 'number', default: 2, min: 0 },
    ],
    outputs: [
      { id: 'v2', label: 'Velocity at Point 2', unit: 'm/s', decimals: 3 },
      { id: 'v1', label: 'Velocity at Point 1', unit: 'm/s', decimals: 3 },
      { id: 'Q_ls', label: 'Flow Rate', unit: 'L/s', decimals: 2 },
      { id: 'P2_kPa', label: 'Pressure at Point 2', unit: 'kPa', decimals: 1 },
      { id: 'Re', label: 'Reynolds Number (at pt 2)', unit: '', decimals: 0 },
    ],
    calculate: ({ D1, D2, P1, z1, z2, rho, hL }) => {
      const A1 = Math.PI / 4 * (Number(D1) / 1000) ** 2
      const A2 = Math.PI / 4 * (Number(D2) / 1000) ** 2
      const g = 9.81
      const totalHead = Number(P1) * 1000 / (Number(rho) * g) + Number(z1) - Number(z2) - Number(hL)
      const v2_sq = 2 * g * totalHead / (1 - (A2 / A1) ** 2)
      const v2 = Math.max(0, Math.sqrt(Math.abs(v2_sq)))
      const v1 = v2 * A2 / A1
      const Q = A2 * v2
      const P2_kPa = (Number(P1) * 1000 + Number(rho) * g * (Number(z1) - Number(z2) - Number(hL)) - Number(rho) * (v2 ** 2 - v1 ** 2) / 2) / 1000
      const mu = 0.001
      const Re = Number(rho) * v2 * (Number(D2) / 1000) / mu
      return { v2, v1, Q_ls: Q * 1000, P2_kPa, Re }
    },
  },

  // ── Heat Transfer Calculator ───────────────────────────────
  'heat-transfer-calculator': {
    slug: 'heat-transfer-calculator',
    name: 'Heat Transfer Calculator',
    icon: '🌡️',
    description: 'Calculate heat transfer rates for conduction, convection and radiation.',
    formula: 'Conduction: Q = kA·ΔT/L  |  Convection: Q = h·A·ΔT  |  Radiation: Q = εσA(T₁⁴−T₂⁴)',
    reference: 'Incropera — Fundamentals of Heat and Mass Transfer',
    inputs: [
      { id: 'mode', label: 'Heat Transfer Mode', type: 'select', default: 'cond', options: [
        { label: 'Conduction (Fourier)', value: 'cond' },
        { label: 'Convection (Newton)', value: 'conv' },
        { label: 'Radiation (Stefan-Boltzmann)', value: 'rad' },
      ]},
      { id: 'A', label: 'Area (A)', unit: 'm²', type: 'number', default: 1, min: 0.001 },
      { id: 'dT', label: 'Temperature Difference (ΔT)', unit: 'K', type: 'number', default: 50, min: 0 },
      { id: 'k_h_e', label: 'k / h / ε', unit: 'W/mK or W/m²K or —', type: 'number', default: 50, min: 0, placeholder: 'k=conductivity, h=coeff, ε=emissivity' },
      { id: 'L', label: 'Thickness L (conduction only)', unit: 'm', type: 'number', default: 0.1, min: 0.001 },
      { id: 'T1_K', label: 'Surface Temp T₁ (radiation)', unit: 'K', type: 'number', default: 500, placeholder: 'For radiation mode' },
      { id: 'T2_K', label: 'Surroundings Temp T₂ (radiation)', unit: 'K', type: 'number', default: 300, placeholder: 'For radiation mode' },
    ],
    outputs: [
      { id: 'Q_W', label: 'Heat Transfer Rate (Q)', unit: 'W', decimals: 2 },
      { id: 'Q_kW', label: 'Heat Transfer Rate (Q)', unit: 'kW', decimals: 4 },
      { id: 'q_flux', label: 'Heat Flux (q″)', unit: 'W/m²', decimals: 2 },
    ],
    calculate: ({ mode, A, dT, k_h_e, L, T1_K, T2_K }) => {
      const Av = Number(A)
      let Q_W = 0
      const sigma = 5.67e-8
      if (mode === 'cond') Q_W = Number(k_h_e) * Av * Number(dT) / Number(L)
      else if (mode === 'conv') Q_W = Number(k_h_e) * Av * Number(dT)
      else Q_W = Number(k_h_e) * sigma * Av * (Math.pow(Number(T1_K), 4) - Math.pow(Number(T2_K), 4))
      return { Q_W, Q_kW: Q_W / 1000, q_flux: Q_W / Av }
    },
  },

  // ── Pump Head & Flow Sizing ────────────────────────────────
  'pump-head-flow': {
    slug: 'pump-head-flow',
    name: 'Pump Head & Flow Sizing',
    icon: '💧',
    description: 'Calculate total pump head, friction losses using Darcy-Weisbach, shaft power and NPSH.',
    formula: 'H_T = H_static + h_f + h_minor  |  h_f = f(L/D)v²/2g  |  P = ρgQH/η',
    reference: 'Hydraulic Institute Standards, ASHRAE',
    inputs: [
      { id: 'H_static', label: 'Static Head', unit: 'm', type: 'number', default: 15, min: 0 },
      { id: 'Q', label: 'Flow Rate', unit: 'm³/hr', type: 'number', default: 50, min: 0.1 },
      { id: 'D', label: 'Pipe Diameter', unit: 'mm', type: 'number', default: 100, min: 10 },
      { id: 'L', label: 'Total Pipe Length', unit: 'm', type: 'number', default: 100, min: 1 },
      { id: 'epsilon', label: 'Pipe Roughness (ε)', unit: 'mm', type: 'number', default: 0.046, step: 0.001, placeholder: 'Steel=0.046' },
      { id: 'K_minor', label: 'Minor Loss Coeff (ΣK)', unit: '', type: 'number', default: 5, min: 0 },
      { id: 'eta_pump', label: 'Pump Efficiency (η)', unit: '%', type: 'number', default: 75, min: 20 },
      { id: 'rho', label: 'Fluid Density', unit: 'kg/m³', type: 'number', default: 1000 },
    ],
    outputs: [
      { id: 'v', label: 'Flow Velocity', unit: 'm/s', decimals: 2 },
      { id: 'Re', label: 'Reynolds Number', unit: '', decimals: 0 },
      { id: 'h_f', label: 'Friction Head Loss', unit: 'm', decimals: 2 },
      { id: 'H_total', label: 'Total Pump Head', unit: 'm', decimals: 2 },
      { id: 'P_shaft_kW', label: 'Shaft Power Required', unit: 'kW', decimals: 2 },
    ],
    calculate: ({ H_static, Q, D, L, epsilon, K_minor, eta_pump, rho }) => {
      const g = 9.81, mu = 0.001
      const d = Number(D) / 1000
      const q = Number(Q) / 3600
      const A = Math.PI / 4 * d ** 2
      const v = q / A
      const Re = Number(rho) * v * d / mu
      const eps_rel = (Number(epsilon) / 1000) / d
      let f = Re < 2300 ? 64 / Re : 0.25 / Math.pow(Math.log10(eps_rel / 3.7 + 5.74 / Math.pow(Re, 0.9)), 2)
      const h_f = f * (Number(L) / d) * v ** 2 / (2 * g)
      const h_minor = Number(K_minor) * v ** 2 / (2 * g)
      const H_total = Number(H_static) + h_f + h_minor
      const P_shaft_kW = Number(rho) * g * q * H_total / (Number(eta_pump) / 100) / 1000
      return { v, Re, h_f, H_total, P_shaft_kW }
    },
  },

  // ── Spring Constant Calculator ─────────────────────────────
  'spring-constant-calculator': {
    slug: 'spring-constant-calculator',
    name: 'Spring Constant Calculator',
    icon: '🌀',
    description: 'Calculate spring stiffness, deflection, stress and natural frequency for helical coil springs.',
    formula: 'k = G·d⁴/(8·D³·n)  |  τ = Kw·8FD/(πd³)  |  fn = (1/2π)·√(k/m)',
    reference: 'Shigley\'s Mechanical Engineering Design',
    inputs: [
      { id: 'd', label: 'Wire Diameter (d)', unit: 'mm', type: 'number', default: 5, min: 0.5, step: 0.5 },
      { id: 'D', label: 'Mean Coil Diameter (D)', unit: 'mm', type: 'number', default: 40, min: 5 },
      { id: 'n', label: 'Active Coils (n)', unit: '', type: 'number', default: 8, min: 1, step: 1 },
      { id: 'G', label: 'Shear Modulus (G)', unit: 'GPa', type: 'number', default: 79, min: 10, placeholder: 'Steel=79' },
      { id: 'F', label: 'Applied Load (F)', unit: 'N', type: 'number', default: 200, min: 0 },
      { id: 'm', label: 'Attached Mass (m)', unit: 'kg', type: 'number', default: 2, min: 0 },
    ],
    outputs: [
      { id: 'k', label: 'Spring Constant (k)', unit: 'N/mm', decimals: 3 },
      { id: 'delta', label: 'Deflection under Load', unit: 'mm', decimals: 2 },
      { id: 'tau', label: 'Shear Stress', unit: 'MPa', decimals: 2 },
      { id: 'fn', label: 'Natural Frequency', unit: 'Hz', decimals: 2 },
      { id: 'C', label: 'Spring Index (C)', unit: '', decimals: 2 },
    ],
    calculate: ({ d, D, n, G, F, m }) => {
      const dv = Number(d), Dv = Number(D), nv = Number(n), Gv = Number(G) * 1000, Fv = Number(F)
      const k = Gv * dv ** 4 / (8 * Dv ** 3 * nv)
      const C = Dv / dv
      const Kw = (4 * C - 1) / (4 * C - 4) + 0.615 / C
      const tau = Kw * 8 * Fv * Dv / (Math.PI * dv ** 3)
      const delta = Fv / k
      const k_SI = k * 1000
      const fn = (1 / (2 * Math.PI)) * Math.sqrt(k_SI / Number(m))
      return { k, delta, tau, fn: Number(m) > 0 ? fn : 0, C }
    },
  },

  // ── Belt & Pulley Speed ────────────────────────────────────
  'belt-pulley-speed': {
    slug: 'belt-pulley-speed',
    name: 'Belt & Pulley Speed Calculator',
    icon: '⭕',
    description: 'Calculate belt speed, velocity ratio, power transmitted and tension ratio for V-belt drives.',
    formula: 'VR = D_driver/D_driven  |  v = π·D·n/60  |  P = (T₁−T₂)·v  |  T₁/T₂ = e^(μθ)',
    reference: 'Belt Drives — Shigley\'s, IS 1370',
    inputs: [
      { id: 'n_driver', label: 'Driver Speed', unit: 'RPM', type: 'number', default: 1450, min: 1 },
      { id: 'D_driver', label: 'Driver Pulley Diameter', unit: 'mm', type: 'number', default: 200, min: 10 },
      { id: 'D_driven', label: 'Driven Pulley Diameter', unit: 'mm', type: 'number', default: 400, min: 10 },
      { id: 'P_kw', label: 'Power to Transmit', unit: 'kW', type: 'number', default: 7.5, min: 0.01 },
      { id: 'mu', label: 'Friction Coefficient (μ)', unit: '', type: 'number', default: 0.35, step: 0.01, placeholder: 'V-belt≈0.35' },
      { id: 'theta', label: 'Angle of Wrap', unit: '°', type: 'number', default: 180, min: 60 },
    ],
    outputs: [
      { id: 'n_driven', label: 'Driven Speed', unit: 'RPM', decimals: 1 },
      { id: 'v_belt', label: 'Belt Speed', unit: 'm/s', decimals: 2 },
      { id: 'T1', label: 'Tight Side Tension (T₁)', unit: 'N', decimals: 1 },
      { id: 'T2', label: 'Slack Side Tension (T₂)', unit: 'N', decimals: 1 },
      { id: 'VR', label: 'Velocity Ratio', unit: '', decimals: 3 },
    ],
    calculate: ({ n_driver, D_driver, D_driven, P_kw, mu, theta }) => {
      const VR = Number(D_driver) / Number(D_driven)
      const n_driven = Number(n_driver) * VR
      const v_belt = Math.PI * (Number(D_driver) / 1000) * Number(n_driver) / 60
      const theta_rad = Number(theta) * Math.PI / 180
      const tension_ratio = Math.exp(Number(mu) * theta_rad)
      const P_W = Number(P_kw) * 1000
      const T1 = P_W / v_belt * tension_ratio / (tension_ratio - 1)
      const T2 = T1 / tension_ratio
      return { n_driven, v_belt, T1, T2, VR }
    },
  },

  // ── CNC Feeds & Speeds ─────────────────────────────────────
  'cnc-feeds-speeds': {
    slug: 'cnc-feeds-speeds',
    name: 'CNC Feeds & Speeds',
    icon: '🔄',
    description: 'Calculate spindle speed, feed rate, material removal rate and chip load for CNC milling operations.',
    formula: 'n = (vc×1000)/(π×D)  |  F = n×z×fz  |  MRR = ap×ae×F',
    reference: 'Machining Data Handbook, Sandvik Coromant',
    inputs: [
      { id: 'D', label: 'Tool Diameter', unit: 'mm', type: 'number', default: 12, min: 0.5 },
      { id: 'vc', label: 'Cutting Speed (vc)', unit: 'm/min', type: 'number', default: 120, min: 1, placeholder: 'Al≈200, Steel≈80' },
      { id: 'z', label: 'Number of Flutes', unit: '', type: 'number', default: 4, min: 1, step: 1 },
      { id: 'fz', label: 'Feed per Tooth (fz)', unit: 'mm/tooth', type: 'number', default: 0.05, min: 0.001, step: 0.005 },
      { id: 'ap', label: 'Axial Depth of Cut (ap)', unit: 'mm', type: 'number', default: 10 },
      { id: 'ae', label: 'Radial Depth of Cut (ae)', unit: 'mm', type: 'number', default: 6 },
    ],
    outputs: [
      { id: 'n_rpm', label: 'Spindle Speed', unit: 'RPM', decimals: 0 },
      { id: 'F_mmpm', label: 'Feed Rate', unit: 'mm/min', decimals: 0 },
      { id: 'MRR', label: 'Material Removal Rate', unit: 'cm³/min', decimals: 2 },
      { id: 'chip_load', label: 'Chip Load (fz)', unit: 'mm/tooth', decimals: 4 },
    ],
    calculate: ({ D, vc, z, fz, ap, ae }) => {
      const n_rpm = (Number(vc) * 1000) / (Math.PI * Number(D))
      const F_mmpm = n_rpm * Number(z) * Number(fz)
      const MRR = Number(ap) * Number(ae) * F_mmpm / 1000
      return { n_rpm, F_mmpm, MRR, chip_load: Number(fz) }
    },
  },

  // ── Tolerance Stack-up ─────────────────────────────────────
  'tolerance-stack-up': {
    slug: 'tolerance-stack-up',
    name: 'Tolerance Stack-up Calculator',
    icon: '📏',
    description: 'Analyse worst-case and RSS statistical tolerance stack-up for assemblies.',
    formula: 'Worst-case: T_total = Σ|ti|  |  RSS: T_total = √(Σti²)  |  Gap = Nominal ± T_total',
    reference: 'ASME Y14.5, Dimensioning & Tolerancing',
    inputs: [
      { id: 'gap_nom', label: 'Nominal Gap', unit: 'mm', type: 'number', default: 5, step: 0.1 },
      { id: 't1', label: 'Tolerance 1 (±)', unit: 'mm', type: 'number', default: 0.2, min: 0, step: 0.01 },
      { id: 't2', label: 'Tolerance 2 (±)', unit: 'mm', type: 'number', default: 0.15, min: 0, step: 0.01 },
      { id: 't3', label: 'Tolerance 3 (±)', unit: 'mm', type: 'number', default: 0.1, min: 0, step: 0.01 },
      { id: 't4', label: 'Tolerance 4 (±)', unit: 'mm', type: 'number', default: 0.05, min: 0, step: 0.01 },
      { id: 't5', label: 'Tolerance 5 (±)', unit: 'mm', type: 'number', default: 0.0, min: 0, step: 0.01 },
    ],
    outputs: [
      { id: 'T_wc', label: 'Worst-Case Total Tolerance', unit: '±mm', decimals: 4 },
      { id: 'T_rss', label: 'RSS Total Tolerance', unit: '±mm', decimals: 4 },
      { id: 'gap_wc_min', label: 'Worst-Case Gap Min', unit: 'mm', decimals: 4 },
      { id: 'gap_wc_max', label: 'Worst-Case Gap Max', unit: 'mm', decimals: 4 },
      { id: 'gap_rss_min', label: 'RSS Gap Min (3σ)', unit: 'mm', decimals: 4 },
      { id: 'gap_rss_max', label: 'RSS Gap Max (3σ)', unit: 'mm', decimals: 4 },
    ],
    calculate: ({ gap_nom, t1, t2, t3, t4, t5 }) => {
      const ts = [Number(t1), Number(t2), Number(t3), Number(t4), Number(t5)]
      const T_wc = ts.reduce((s, t) => s + t, 0)
      const T_rss = Math.sqrt(ts.reduce((s, t) => s + t ** 2, 0))
      const g = Number(gap_nom)
      return { T_wc, T_rss, gap_wc_min: g - T_wc, gap_wc_max: g + T_wc, gap_rss_min: g - T_rss, gap_rss_max: g + T_rss }
    },
  },

  // ── Fatigue Life Estimator ─────────────────────────────────
  'fatigue-life-estimator': {
    slug: 'fatigue-life-estimator',
    name: 'Fatigue Life Estimator',
    icon: '📊',
    description: 'Estimate fatigue life using modified Goodman criterion and Miner\'s cumulative damage rule.',
    formula: 'Goodman: σa/Se + σm/Sut = 1  |  Miner: D = Σ(ni/Ni)  |  Se ≈ 0.5·Sut',
    reference: 'Shigley\'s — Fatigue Failure, Ch. 6',
    inputs: [
      { id: 'Sut', label: 'Ultimate Tensile Strength (Sut)', unit: 'MPa', type: 'number', default: 600, min: 100 },
      { id: 'sigma_a', label: 'Alternating Stress (σ_a)', unit: 'MPa', type: 'number', default: 150, min: 0 },
      { id: 'sigma_m', label: 'Mean Stress (σ_m)', unit: 'MPa', type: 'number', default: 100, min: 0 },
      { id: 'ka', label: 'Surface Factor (ka)', unit: '', type: 'number', default: 0.72, step: 0.01, placeholder: 'Ground=0.9, Machined=0.72' },
      { id: 'kb', label: 'Size Factor (kb)', unit: '', type: 'number', default: 0.85, step: 0.01 },
      { id: 'kc', label: 'Reliability Factor (kc)', unit: '', type: 'number', default: 0.897, step: 0.001, placeholder: '90%=0.897, 99%=0.814' },
    ],
    outputs: [
      { id: 'Se_prime', label: 'Uncorrected Endurance Limit', unit: 'MPa', decimals: 1 },
      { id: 'Se', label: 'Modified Endurance Limit (Se)', unit: 'MPa', decimals: 1 },
      { id: 'goodman', label: 'Goodman Ratio (should be ≤ 1)', unit: '', decimals: 3 },
      { id: 'FOS', label: 'Factor of Safety', unit: '', decimals: 2 },
      { id: 'status', label: 'Status (1=safe, 0=fail)', unit: '', decimals: 0 },
    ],
    calculate: ({ Sut, sigma_a, sigma_m, ka, kb, kc }) => {
      const Se_prime = 0.5 * Number(Sut)
      const Se = Number(ka) * Number(kb) * Number(kc) * Se_prime
      const goodman = Number(sigma_a) / Se + Number(sigma_m) / Number(Sut)
      const FOS = 1 / goodman
      return { Se_prime, Se, goodman, FOS, status: goodman <= 1 ? 1 : 0 }
    },
  },

  // ── Bearing Life (L10) ─────────────────────────────────────
  'bearing-life-calculator': {
    slug: 'bearing-life-calculator',
    name: 'Bearing Life (L10) Calculator',
    icon: '🔘',
    description: 'Calculate L10 basic rating life in revolutions and hours for ball and roller bearings per ISO 281.',
    formula: 'L10 = (C/P)^p × 10⁶ rev  |  L10h = L10/(60·n)  |  p=3 (ball), 10/3 (roller)',
    reference: 'ISO 281:2007, SKF bearing catalogue',
    inputs: [
      { id: 'C', label: 'Dynamic Load Rating (C)', unit: 'kN', type: 'number', default: 30, min: 0.1 },
      { id: 'Fr', label: 'Radial Load (Fr)', unit: 'kN', type: 'number', default: 10, min: 0 },
      { id: 'Fa', label: 'Axial Load (Fa)', unit: 'kN', type: 'number', default: 2, min: 0 },
      { id: 'X', label: 'Radial Factor (X)', unit: '', type: 'number', default: 1.0, step: 0.01 },
      { id: 'Y', label: 'Axial Factor (Y)', unit: '', type: 'number', default: 0.44, step: 0.01 },
      { id: 'n', label: 'Rotational Speed', unit: 'RPM', type: 'number', default: 1500, min: 1 },
      { id: 'bearing_type', label: 'Bearing Type', type: 'select', default: 'ball', options: [
        { label: 'Ball Bearing (p=3)', value: 'ball' },
        { label: 'Roller Bearing (p=10/3)', value: 'roller' },
      ]},
    ],
    outputs: [
      { id: 'P_eq', label: 'Equivalent Dynamic Load', unit: 'kN', decimals: 3 },
      { id: 'L10_Mrev', label: 'L10 Life', unit: '× 10⁶ rev', decimals: 2 },
      { id: 'L10h', label: 'L10 Life', unit: 'hours', decimals: 0 },
      { id: 'L10h_yr', label: 'L10 Life', unit: 'years (24/7)', decimals: 1 },
    ],
    calculate: ({ C, Fr, Fa, X, Y, n, bearing_type }) => {
      const P_eq = Math.max(Number(Fr), Number(X) * Number(Fr) + Number(Y) * Number(Fa))
      const p = bearing_type === 'ball' ? 3 : 10 / 3
      const L10_Mrev = Math.pow(Number(C) / P_eq, p)
      const L10h = L10_Mrev * 1e6 / (60 * Number(n))
      return { P_eq, L10_Mrev, L10h, L10h_yr: L10h / 8760 }
    },
  },

  // ── Vibration Frequency ────────────────────────────────────
  'vibration-frequency': {
    slug: 'vibration-frequency',
    name: 'Vibration Frequency Tool',
    icon: '〰️',
    description: 'Calculate natural frequency, damped frequency and resonance zone for a spring-mass-damper system.',
    formula: 'ωn = √(k/m)  |  fn = ωn/2π  |  ωd = ωn·√(1−ζ²)  |  ζ = c/(2√(km))',
    reference: 'Mechanical Vibrations — Rao',
    inputs: [
      { id: 'k', label: 'Stiffness (k)', unit: 'kN/m', type: 'number', default: 100, min: 0.1 },
      { id: 'm', label: 'Mass (m)', unit: 'kg', type: 'number', default: 50, min: 0.1 },
      { id: 'c', label: 'Damping Coefficient (c)', unit: 'N·s/m', type: 'number', default: 500, min: 0 },
    ],
    outputs: [
      { id: 'omega_n', label: 'Natural Frequency (ωn)', unit: 'rad/s', decimals: 3 },
      { id: 'fn', label: 'Natural Frequency (fn)', unit: 'Hz', decimals: 3 },
      { id: 'zeta', label: 'Damping Ratio (ζ)', unit: '', decimals: 4 },
      { id: 'omega_d', label: 'Damped Frequency (ωd)', unit: 'rad/s', decimals: 3 },
      { id: 'resonance_zone_lo', label: 'Avoid Zone Lower Bound', unit: 'Hz', decimals: 3 },
      { id: 'resonance_zone_hi', label: 'Avoid Zone Upper Bound', unit: 'Hz', decimals: 3 },
    ],
    calculate: ({ k, m, c }) => {
      const k_SI = Number(k) * 1000
      const omega_n = Math.sqrt(k_SI / Number(m))
      const fn = omega_n / (2 * Math.PI)
      const cc = 2 * Math.sqrt(k_SI * Number(m))
      const zeta = Number(c) / cc
      const omega_d = omega_n * Math.sqrt(Math.max(0, 1 - zeta ** 2))
      return { omega_n, fn, zeta, omega_d, resonance_zone_lo: fn * 0.7, resonance_zone_hi: fn * 1.3 }
    },
  },

  // ── Hydraulic Cylinder Force ───────────────────────────────
  'hydraulic-cylinder-force': {
    slug: 'hydraulic-cylinder-force',
    name: 'Hydraulic Cylinder Force',
    icon: '🔧',
    description: 'Calculate extension and retraction forces, speeds and hydraulic power for a double-acting cylinder.',
    formula: 'F_ext = P·π·D²/4  |  F_ret = P·π(D²−d²)/4  |  v = Q/A  |  P_hyd = Q·ΔP',
    reference: 'Parker Hannifin Hydraulic Design Guide',
    inputs: [
      { id: 'P', label: 'System Pressure', unit: 'bar', type: 'number', default: 200, min: 1 },
      { id: 'D', label: 'Bore Diameter (D)', unit: 'mm', type: 'number', default: 100, min: 10 },
      { id: 'rod_d', label: 'Rod Diameter (d)', unit: 'mm', type: 'number', default: 63, min: 5 },
      { id: 'Q', label: 'Flow Rate (Q)', unit: 'L/min', type: 'number', default: 40, min: 0.1 },
      { id: 'eta', label: 'Mechanical Efficiency (η)', unit: '%', type: 'number', default: 95, min: 50 },
    ],
    outputs: [
      { id: 'F_ext', label: 'Extension Force', unit: 'kN', decimals: 2 },
      { id: 'F_ret', label: 'Retraction Force', unit: 'kN', decimals: 2 },
      { id: 'v_ext', label: 'Extension Speed', unit: 'mm/s', decimals: 1 },
      { id: 'v_ret', label: 'Retraction Speed', unit: 'mm/s', decimals: 1 },
      { id: 'P_hyd_kW', label: 'Hydraulic Power', unit: 'kW', decimals: 2 },
    ],
    calculate: ({ P, D, rod_d, Q, eta }) => {
      const p_Pa = Number(P) * 1e5
      const A_bore = Math.PI / 4 * (Number(D) / 1000) ** 2
      const A_ann = Math.PI / 4 * ((Number(D) / 1000) ** 2 - (Number(rod_d) / 1000) ** 2)
      const q_m3s = Number(Q) / 60000
      const F_ext = p_Pa * A_bore * (Number(eta) / 100) / 1000
      const F_ret = p_Pa * A_ann * (Number(eta) / 100) / 1000
      const v_ext = q_m3s / A_bore * 1000
      const v_ret = q_m3s / A_ann * 1000
      const P_hyd_kW = q_m3s * p_Pa / 1000
      return { F_ext, F_ret, v_ext, v_ret, P_hyd_kW }
    },
  },

  // ══════════════════════════════════════════════════════════
  // SECTION 4 — HVAC & BUILDING SERVICES
  // ══════════════════════════════════════════════════════════

  // ── Heating Load Estimator ─────────────────────────────────
  'heating-load-estimator': {
    slug: 'heating-load-estimator',
    name: 'Heating Load Estimator',
    icon: '🔥',
    description: 'Estimate building heating load from fabric heat loss, infiltration and ventilation.',
    formula: 'Q_fabric = U·A·ΔT  |  Q_inf = 0.34·ACH·V·ΔT  |  Q_total = Q_fabric + Q_infiltration',
    reference: 'ASHRAE Fundamentals 2021, EN ISO 12831',
    inputs: [
      { id: 'A_wall', label: 'Wall Area (incl. windows)', unit: 'm²', type: 'number', default: 250, min: 1 },
      { id: 'U_wall', label: 'Average U-value (walls+windows)', unit: 'W/m²K', type: 'number', default: 0.4, step: 0.05 },
      { id: 'A_roof', label: 'Roof/Ceiling Area', unit: 'm²', type: 'number', default: 150, min: 1 },
      { id: 'U_roof', label: 'Roof U-value', unit: 'W/m²K', type: 'number', default: 0.2, step: 0.05 },
      { id: 'A_floor', label: 'Floor Area', unit: 'm²', type: 'number', default: 150, min: 1 },
      { id: 'U_floor', label: 'Floor U-value', unit: 'W/m²K', type: 'number', default: 0.25, step: 0.05 },
      { id: 'T_in', label: 'Indoor Design Temp', unit: '°C', type: 'number', default: 21 },
      { id: 'T_out', label: 'Outdoor Design Temp', unit: '°C', type: 'number', default: -5 },
      { id: 'V_room', label: 'Room Volume', unit: 'm³', type: 'number', default: 375, min: 1 },
      { id: 'ACH', label: 'Air Changes per Hour (ACH)', unit: '/hr', type: 'number', default: 0.5, step: 0.1 },
    ],
    outputs: [
      { id: 'dT', label: 'Design Temperature Difference', unit: 'K', decimals: 1 },
      { id: 'Q_fabric', label: 'Fabric Heat Loss', unit: 'W', decimals: 0 },
      { id: 'Q_inf', label: 'Infiltration Heat Loss', unit: 'W', decimals: 0 },
      { id: 'Q_total', label: 'Total Heating Load', unit: 'kW', decimals: 2 },
      { id: 'boiler_kW', label: 'Boiler Size (×1.2 margin)', unit: 'kW', decimals: 1 },
    ],
    calculate: ({ A_wall, U_wall, A_roof, U_roof, A_floor, U_floor, T_in, T_out, V_room, ACH }) => {
      const dT = Number(T_in) - Number(T_out)
      const Q_fabric = (Number(A_wall) * Number(U_wall) + Number(A_roof) * Number(U_roof) + Number(A_floor) * Number(U_floor)) * dT
      const Q_inf = 0.34 * Number(ACH) * Number(V_room) * dT
      const Q_total = (Q_fabric + Q_inf) / 1000
      return { dT, Q_fabric, Q_inf, Q_total, boiler_kW: Q_total * 1.2 }
    },
  },

  // ── Duct Sizing Calculator ─────────────────────────────────
  'duct-sizing-calculator': {
    slug: 'duct-sizing-calculator',
    name: 'Duct Sizing Calculator',
    icon: '🌬️',
    description: 'Size HVAC ductwork by equal friction or velocity method and calculate pressure drop.',
    formula: 'A = Q/v  |  D = √(4A/π)  |  D_h = 4A/P  |  Δp = f(L/Dh)ρv²/2',
    reference: 'ASHRAE Fundamentals, SMACNA HVAC Duct Systems',
    inputs: [
      { id: 'Q_ls', label: 'Airflow Rate (Q)', unit: 'L/s', type: 'number', default: 500, min: 1 },
      { id: 'v_target', label: 'Design Duct Velocity', unit: 'm/s', type: 'number', default: 6, min: 1, step: 0.5, placeholder: 'Supply≈5-8, Return≈4-6' },
      { id: 'L', label: 'Duct Length', unit: 'm', type: 'number', default: 20, min: 0.5 },
      { id: 'shape', label: 'Duct Shape', type: 'select', default: 'circular', options: [
        { label: 'Circular', value: 'circular' },
        { label: 'Rectangular (set W below)', value: 'rectangular' },
      ]},
      { id: 'W', label: 'Duct Width (rectangular)', unit: 'mm', type: 'number', default: 400, min: 100 },
    ],
    outputs: [
      { id: 'A_m2', label: 'Required Duct Area', unit: 'm²', decimals: 4 },
      { id: 'D_mm', label: 'Circular Diameter (or equiv.)', unit: 'mm', decimals: 0 },
      { id: 'H_rect', label: 'Rectangular Height (at W above)', unit: 'mm', decimals: 0 },
      { id: 'actual_v', label: 'Actual Velocity', unit: 'm/s', decimals: 2 },
      { id: 'dP_Pa', label: 'Pressure Drop', unit: 'Pa', decimals: 1 },
    ],
    calculate: ({ Q_ls, v_target, L, W }) => {
      const Q = Number(Q_ls) / 1000
      const A_m2 = Q / Number(v_target)
      const D_mm = Math.sqrt(4 * A_m2 / Math.PI) * 1000
      const H_rect = A_m2 / (Number(W) / 1000) * 1000
      const D_h = D_mm / 1000
      const rho = 1.2, mu = 1.8e-5
      const actual_v = Number(v_target)
      const Re = rho * actual_v * D_h / mu
      const f = Re < 2300 ? 64 / Re : 0.316 * Math.pow(Re, -0.25)
      const dP_Pa = f * (Number(L) / D_h) * rho * actual_v ** 2 / 2
      return { A_m2, D_mm, H_rect, actual_v, dP_Pa }
    },
  },

  // ── Psychrometric Calculator ───────────────────────────────
  'psychrometric-calculator': {
    slug: 'psychrometric-calculator',
    name: 'Psychrometric Calculator',
    icon: '💧',
    description: 'Calculate dew point, humidity ratio, enthalpy and wet bulb temperature from dry bulb temperature and relative humidity.',
    formula: 'W = 0.622·pw/(P−pw)  |  h = 1.006T + W(2501+1.86T)  |  Tdp = Magnus formula',
    reference: 'ASHRAE Fundamentals 2021, Chapter 1',
    inputs: [
      { id: 'T_db', label: 'Dry Bulb Temperature', unit: '°C', type: 'number', default: 25, step: 0.5 },
      { id: 'RH', label: 'Relative Humidity', unit: '%', type: 'number', default: 60, min: 1 },
      { id: 'P_atm', label: 'Atmospheric Pressure', unit: 'kPa', type: 'number', default: 101.325 },
    ],
    outputs: [
      { id: 'W_gkg', label: 'Humidity Ratio', unit: 'g/kg dry air', decimals: 2 },
      { id: 'T_dp', label: 'Dew Point Temperature', unit: '°C', decimals: 1 },
      { id: 'T_wb', label: 'Wet Bulb Temperature (approx.)', unit: '°C', decimals: 1 },
      { id: 'h', label: 'Specific Enthalpy', unit: 'kJ/kg dry air', decimals: 2 },
      { id: 'pw_kPa', label: 'Vapour Pressure', unit: 'kPa', decimals: 3 },
    ],
    calculate: ({ T_db, RH, P_atm }) => {
      const T = Number(T_db), rh = Number(RH)
      const pws = 0.6108 * Math.exp(17.27 * T / (T + 237.3))
      const pw_kPa = (rh / 100) * pws
      const W = 0.622 * pw_kPa / (Number(P_atm) - pw_kPa)
      const W_gkg = W * 1000
      const gamma = Math.log(rh / 100) + 17.625 * T / (243.04 + T)
      const T_dp = 243.04 * gamma / (17.625 - gamma)
      const T_wb = T - (T - T_dp) / 3
      const h = 1.006 * T + W * (2501 + 1.86 * T)
      return { W_gkg, T_dp, T_wb, h, pw_kPa }
    },
  },

  // ── COP / EER Calculator ───────────────────────────────────
  'cop-eer-calculator': {
    slug: 'cop-eer-calculator',
    name: 'COP / EER Calculator',
    icon: '📊',
    description: 'Calculate Coefficient of Performance (COP), Energy Efficiency Ratio (EER) and compare to Carnot ideal efficiency.',
    formula: 'COP_cool = Q_cool/W_in  |  EER = Q_BTU/W_W = COP×3.412  |  COP_Carnot = T_cold/(T_hot−T_cold)',
    reference: 'ASHRAE 90.1, EN 14511',
    inputs: [
      { id: 'mode', label: 'Mode', type: 'select', default: 'cooling', options: [
        { label: 'Cooling (AC / Chiller)', value: 'cooling' },
        { label: 'Heating (Heat Pump)', value: 'heating' },
      ]},
      { id: 'Q', label: 'Heat Removed / Added', unit: 'kW', type: 'number', default: 10, min: 0.1 },
      { id: 'W', label: 'Electrical Power Input', unit: 'kW', type: 'number', default: 3, min: 0.1 },
      { id: 'T_cold', label: 'Cold Reservoir Temp (T_cold)', unit: '°C', type: 'number', default: 5 },
      { id: 'T_hot', label: 'Hot Reservoir Temp (T_hot)', unit: '°C', type: 'number', default: 35 },
    ],
    outputs: [
      { id: 'COP', label: 'COP (actual)', unit: '', decimals: 2 },
      { id: 'EER', label: 'EER (BTU/W·hr)', unit: 'BTU/W·hr', decimals: 2 },
      { id: 'COP_carnot', label: 'Carnot COP (ideal)', unit: '', decimals: 2 },
      { id: 'efficiency', label: 'Second-Law Efficiency', unit: '%', decimals: 1 },
    ],
    calculate: ({ mode, Q, W, T_cold, T_hot }) => {
      const COP = Number(Q) / Number(W)
      const EER = COP * 3.412
      const Tc = Number(T_cold) + 273.15, Th = Number(T_hot) + 273.15
      const COP_carnot = mode === 'cooling' ? Tc / (Th - Tc) : Th / (Th - Tc)
      return { COP, EER, COP_carnot, efficiency: (COP / COP_carnot) * 100 }
    },
  },

  // ── U-Value / R-Value ──────────────────────────────────────
  'u-value-r-value': {
    slug: 'u-value-r-value',
    name: 'U-Value / R-Value Calculator',
    icon: '🧱',
    description: 'Calculate overall U-value and thermal resistance of a composite wall/roof assembly.',
    formula: 'R_total = Rsi + ΣL/k + Rse  |  U = 1/R_total  |  q = U·ΔT',
    reference: 'ISO 6946, ASHRAE Fundamentals',
    inputs: [
      { id: 'L1', label: 'Layer 1 Thickness', unit: 'mm', type: 'number', default: 100, min: 0 },
      { id: 'k1', label: 'Layer 1 Conductivity (k)', unit: 'W/mK', type: 'number', default: 0.72, step: 0.01, placeholder: 'Brick=0.72' },
      { id: 'L2', label: 'Layer 2 Thickness', unit: 'mm', type: 'number', default: 50, min: 0 },
      { id: 'k2', label: 'Layer 2 Conductivity (k)', unit: 'W/mK', type: 'number', default: 0.04, step: 0.005, placeholder: 'Insulation=0.04' },
      { id: 'L3', label: 'Layer 3 Thickness', unit: 'mm', type: 'number', default: 12.5, min: 0 },
      { id: 'k3', label: 'Layer 3 Conductivity (k)', unit: 'W/mK', type: 'number', default: 0.22, step: 0.01, placeholder: 'Plasterboard=0.22' },
      { id: 'dT', label: 'Temperature Difference (ΔT)', unit: 'K', type: 'number', default: 20 },
    ],
    outputs: [
      { id: 'R_total', label: 'Total R-value', unit: 'm²K/W', decimals: 3 },
      { id: 'R_imp', label: 'R-value (Imperial)', unit: 'ft²·°F·h/BTU', decimals: 2 },
      { id: 'U', label: 'U-value', unit: 'W/m²K', decimals: 3 },
      { id: 'q', label: 'Heat Flux at ΔT', unit: 'W/m²', decimals: 1 },
    ],
    calculate: ({ L1, k1, L2, k2, L3, k3, dT }) => {
      const R_si = 0.13, R_se = 0.04
      const R_layers = (Number(L1) / 1000) / Number(k1) + (Number(L2) / 1000) / Number(k2) + (Number(L3) / 1000) / Number(k3)
      const R_total = R_si + R_layers + R_se
      const U = 1 / R_total
      const q = U * Number(dT)
      return { R_total, R_imp: R_total * 5.678, U, q }
    },
  },

  // ── Ventilation Rate Calculator ────────────────────────────
  'ventilation-rate-calculator': {
    slug: 'ventilation-rate-calculator',
    name: 'Ventilation Rate Calculator',
    icon: '🌀',
    description: 'Calculate required ventilation rate per ASHRAE 62.1 and air changes per hour (ACH).',
    formula: 'Q = Rp·Pz + Ra·Az  |  ACH = Q_supply/V_room',
    reference: 'ASHRAE 62.1-2022',
    inputs: [
      { id: 'occupants', label: 'Number of Occupants', unit: '', type: 'number', default: 20, min: 1, step: 1 },
      { id: 'area', label: 'Zone Floor Area', unit: 'm²', type: 'number', default: 200, min: 1 },
      { id: 'Rp', label: 'Per-Person Rate (Rp)', unit: 'L/s·person', type: 'number', default: 3.8, step: 0.1, placeholder: 'Office≈3.8' },
      { id: 'Ra', label: 'Area Rate (Ra)', unit: 'L/s·m²', type: 'number', default: 0.3, step: 0.1, placeholder: 'Office≈0.3' },
      { id: 'height', label: 'Room Height', unit: 'm', type: 'number', default: 3, min: 2 },
      { id: 'Ev', label: 'Zone Air Distribution (Ez)', unit: '', type: 'number', default: 0.8, step: 0.05 },
    ],
    outputs: [
      { id: 'Q_zone', label: 'Zone Outdoor Air Rate', unit: 'L/s', decimals: 1 },
      { id: 'Q_system', label: 'System Supply Rate (÷Ez)', unit: 'L/s', decimals: 1 },
      { id: 'ACH', label: 'Air Changes per Hour', unit: '/hr', decimals: 2 },
      { id: 'Q_per_person', label: 'Flow per Person', unit: 'L/s·person', decimals: 1 },
    ],
    calculate: ({ occupants, area, Rp, Ra, height, Ev }) => {
      const Q_zone = Number(Rp) * Number(occupants) + Number(Ra) * Number(area)
      const Q_system = Q_zone / Number(Ev)
      const V = Number(area) * Number(height)
      const ACH = (Q_system / 1000) * 3600 / V
      return { Q_zone, Q_system, ACH, Q_per_person: Q_zone / Number(occupants) }
    },
  },

  // ── Chilled Water Pipe Sizing ──────────────────────────────
  'chilled-water-pipe-sizing': {
    slug: 'chilled-water-pipe-sizing',
    name: 'Chilled Water Pipe Sizing',
    icon: '🌊',
    description: 'Size chilled water piping from cooling capacity, calculate flow rate, pipe diameter and pressure drop.',
    formula: 'Q = P_cool/(ρ·cp·ΔT)  |  D = √(4Q/πv)  |  Δp = f(L/D)ρv²/2',
    reference: 'ASHRAE HVAC Systems Handbook, CIBSE Guide C',
    inputs: [
      { id: 'P_cool', label: 'Cooling Capacity', unit: 'kW', type: 'number', default: 200, min: 1 },
      { id: 'dT', label: 'Supply/Return ΔT', unit: 'K', type: 'number', default: 7, min: 2, step: 0.5 },
      { id: 'v_max', label: 'Max Pipe Velocity', unit: 'm/s', type: 'number', default: 2.0, step: 0.1, placeholder: 'CHW: 1–3 m/s' },
      { id: 'L', label: 'Pipe Length', unit: 'm', type: 'number', default: 50 },
    ],
    outputs: [
      { id: 'Q_m3s', label: 'Volume Flow Rate', unit: 'L/s', decimals: 3 },
      { id: 'D_mm', label: 'Minimum Pipe Diameter', unit: 'mm', decimals: 0 },
      { id: 'actual_v', label: 'Velocity in Sized Pipe', unit: 'm/s', decimals: 2 },
      { id: 'dP_Pa', label: 'Pressure Drop', unit: 'kPa', decimals: 2 },
    ],
    calculate: ({ P_cool, dT, v_max, L }) => {
      const rho = 999, cp = 4186
      const Q_m3s = Number(P_cool) * 1000 / (rho * cp * Number(dT))
      const D_m = Math.sqrt(4 * Q_m3s / (Math.PI * Number(v_max)))
      const D_mm = D_m * 1000
      const actual_v = Q_m3s / (Math.PI / 4 * D_m ** 2)
      const mu = 0.001, Re = rho * actual_v * D_m / mu
      const f = Re < 2300 ? 64 / Re : 0.316 * Math.pow(Re, -0.25)
      const dP_Pa = f * (Number(L) / D_m) * rho * actual_v ** 2 / 2 / 1000
      return { Q_m3s: Q_m3s * 1000, D_mm, actual_v, dP_Pa }
    },
  },

  // ── Boiler Efficiency Calculator ───────────────────────────
  'boiler-efficiency-calculator': {
    slug: 'boiler-efficiency-calculator',
    name: 'Boiler Efficiency Calculator',
    icon: '🔥',
    description: 'Calculate boiler thermal efficiency using direct and indirect (heat loss) methods.',
    formula: 'η_direct = Q_output/Q_input × 100%  |  η_indirect = 100 − Σ(losses%)',
    reference: 'ASME PTC 4, EN 303',
    inputs: [
      { id: 'method', label: 'Method', type: 'select', default: 'direct', options: [
        { label: 'Direct Method', value: 'direct' },
        { label: 'Indirect (Heat Loss) Method', value: 'indirect' },
      ]},
      { id: 'Q_out', label: 'Useful Heat Output', unit: 'kW', type: 'number', default: 450, min: 1 },
      { id: 'Q_in', label: 'Fuel Heat Input (HHV basis)', unit: 'kW', type: 'number', default: 500, min: 1 },
      { id: 'loss_flue', label: 'Dry Flue Gas Loss', unit: '%', type: 'number', default: 5, min: 0, step: 0.1 },
      { id: 'loss_moisture', label: 'Moisture in Fuel Loss', unit: '%', type: 'number', default: 1.5, min: 0, step: 0.1 },
      { id: 'loss_CO', label: 'CO / Unburnt Loss', unit: '%', type: 'number', default: 0.3, min: 0, step: 0.05 },
      { id: 'loss_radiation', label: 'Radiation & Convection Loss', unit: '%', type: 'number', default: 0.5, min: 0, step: 0.05 },
    ],
    outputs: [
      { id: 'eta', label: 'Boiler Efficiency', unit: '%', decimals: 1 },
      { id: 'losses_total', label: 'Total Losses', unit: '%', decimals: 1 },
      { id: 'fuel_input_needed', label: 'Fuel Input for Output', unit: 'kW', decimals: 1 },
    ],
    calculate: ({ method, Q_out, Q_in, loss_flue, loss_moisture, loss_CO, loss_radiation }) => {
      let eta = 0, losses_total = 0
      if (method === 'direct') {
        eta = (Number(Q_out) / Number(Q_in)) * 100
        losses_total = 100 - eta
      } else {
        losses_total = Number(loss_flue) + Number(loss_moisture) + Number(loss_CO) + Number(loss_radiation)
        eta = 100 - losses_total
      }
      const fuel_input_needed = Number(Q_out) / (eta / 100)
      return { eta, losses_total, fuel_input_needed }
    },
  },

  // ── Building Energy Audit ──────────────────────────────────
  'building-energy-audit': {
    slug: 'building-energy-audit',
    name: 'Building Energy Audit Tool',
    icon: '🏢',
    description: 'Estimate annual energy savings, payback period, NPV and CO₂ reduction from a building energy improvement.',
    formula: 'EUI = E_annual/Area  |  ΔE = E_baseline − E_improved  |  SPB = CapCost/(ΔE×tariff)',
    reference: 'ASHRAE 90.1, ISO 50001, IPMVP',
    inputs: [
      { id: 'E_baseline', label: 'Baseline Annual Energy', unit: 'kWh/yr', type: 'number', default: 500000, min: 100 },
      { id: 'saving_pct', label: 'Expected Energy Saving', unit: '%', type: 'number', default: 25, min: 1, step: 1 },
      { id: 'floor_area', label: 'Gross Floor Area', unit: 'm²', type: 'number', default: 5000, min: 10 },
      { id: 'tariff', label: 'Electricity Tariff', unit: '$/kWh', type: 'number', default: 0.12, step: 0.01 },
      { id: 'capital', label: 'Capital Investment', unit: '$', type: 'number', default: 80000 },
      { id: 'ef', label: 'Grid Emission Factor', unit: 'kg CO₂/kWh', type: 'number', default: 0.45, step: 0.01 },
      { id: 'r', label: 'Discount Rate', unit: '%', type: 'number', default: 7, step: 0.5 },
      { id: 'life', label: 'Measure Lifetime', unit: 'years', type: 'number', default: 15 },
    ],
    outputs: [
      { id: 'EUI_base', label: 'Baseline EUI', unit: 'kWh/m²/yr', decimals: 1 },
      { id: 'dE', label: 'Annual Energy Saved', unit: 'kWh/yr', decimals: 0 },
      { id: 'C_saved', label: 'Annual Cost Saved', unit: '$/yr', decimals: 0 },
      { id: 'SPB', label: 'Simple Payback', unit: 'years', decimals: 1 },
      { id: 'NPV', label: 'NPV', unit: '$', decimals: 0 },
      { id: 'CO2_tyr', label: 'CO₂ Avoided', unit: 't CO₂/yr', decimals: 1 },
    ],
    calculate: ({ E_baseline, saving_pct, floor_area, tariff, capital, ef, r, life }) => {
      const EUI_base = Number(E_baseline) / Number(floor_area)
      const dE = Number(E_baseline) * Number(saving_pct) / 100
      const C_saved = dE * Number(tariff)
      const SPB = Number(capital) / C_saved
      const disc = Number(r) / 100
      let NPV = -Number(capital)
      for (let t = 1; t <= Number(life); t++) NPV += C_saved / Math.pow(1 + disc, t)
      const CO2_tyr = dE * Number(ef) / 1000
      return { EUI_base, dE, C_saved, SPB, NPV, CO2_tyr }
    },
  },

  // ══════════════════════════════════════════════════════════
  // SECTION 5 — OIL, GAS & CHEMICAL ENGINEERING
  // ══════════════════════════════════════════════════════════

  // ── Orifice Plate Flow ─────────────────────────────────────
  'orifice-plate-flow': {
    slug: 'orifice-plate-flow',
    name: 'Orifice Plate Flow Calculator',
    icon: '⭕',
    description: 'Calculate mass and volumetric flow through an orifice plate per ISO 5167.',
    formula: 'qm = Cd·ε·(π/4)·d²·√(2·ΔP·ρ) / √(1−β⁴)',
    reference: 'ISO 5167-2:2003',
    inputs: [
      { id: 'D_pipe', label: 'Pipe Bore (D)', unit: 'mm', type: 'number', default: 100, min: 10 },
      { id: 'd_orif', label: 'Orifice Bore (d)', unit: 'mm', type: 'number', default: 60, min: 5 },
      { id: 'dP', label: 'Differential Pressure (ΔP)', unit: 'kPa', type: 'number', default: 25, min: 0.1 },
      { id: 'rho', label: 'Fluid Density (ρ)', unit: 'kg/m³', type: 'number', default: 1000, min: 0.1, placeholder: 'Water=1000, Air=1.2' },
      { id: 'Cd', label: 'Discharge Coefficient (Cd)', unit: '', type: 'number', default: 0.6, step: 0.01, placeholder: 'Sharp edge≈0.6' },
    ],
    outputs: [
      { id: 'beta', label: 'Beta Ratio (β)', unit: '', decimals: 3 },
      { id: 'qm_kgs', label: 'Mass Flow Rate', unit: 'kg/s', decimals: 4 },
      { id: 'qv_ls', label: 'Volumetric Flow Rate', unit: 'L/s', decimals: 3 },
      { id: 'qv_m3hr', label: 'Volumetric Flow Rate', unit: 'm³/hr', decimals: 2 },
    ],
    calculate: ({ D_pipe, d_orif, dP, rho, Cd }) => {
      const beta = Number(d_orif) / Number(D_pipe)
      const A_orif = Math.PI / 4 * (Number(d_orif) / 1000) ** 2
      const qm_kgs = Number(Cd) / Math.sqrt(1 - beta ** 4) * A_orif * Math.sqrt(2 * Number(dP) * 1000 * Number(rho))
      const qv_ls = qm_kgs / Number(rho) * 1000
      return { beta, qm_kgs, qv_ls, qv_m3hr: qv_ls * 3.6 }
    },
  },

  // ── Heat Exchanger Sizing ──────────────────────────────────
  'heat-exchanger-sizing': {
    slug: 'heat-exchanger-sizing',
    name: 'Heat Exchanger Sizing',
    icon: '♨️',
    description: 'Size a shell-and-tube heat exchanger using the LMTD and NTU-effectiveness methods.',
    formula: 'LMTD = (ΔT₁−ΔT₂)/ln(ΔT₁/ΔT₂)  |  Q = U·A·LMTD  |  NTU = U·A/C_min',
    reference: 'TEMA Standards, Kern Process Heat Transfer',
    inputs: [
      { id: 'T_hi', label: 'Hot Fluid Inlet Temp', unit: '°C', type: 'number', default: 120 },
      { id: 'T_ho', label: 'Hot Fluid Outlet Temp', unit: '°C', type: 'number', default: 80 },
      { id: 'T_ci', label: 'Cold Fluid Inlet Temp', unit: '°C', type: 'number', default: 25 },
      { id: 'T_co', label: 'Cold Fluid Outlet Temp', unit: '°C', type: 'number', default: 60 },
      { id: 'Q_kw', label: 'Heat Duty (Q)', unit: 'kW', type: 'number', default: 500, min: 1 },
      { id: 'U', label: 'Overall Heat Transfer Coeff (U)', unit: 'W/m²K', type: 'number', default: 800, min: 10, placeholder: 'Water-Water≈800' },
      { id: 'F', label: 'LMTD Correction Factor (F)', unit: '', type: 'number', default: 0.9, step: 0.01 },
    ],
    outputs: [
      { id: 'LMTD', label: 'Log Mean Temp Difference', unit: 'K', decimals: 2 },
      { id: 'LMTD_corr', label: 'Corrected LMTD', unit: 'K', decimals: 2 },
      { id: 'A_m2', label: 'Required Heat Transfer Area', unit: 'm²', decimals: 2 },
      { id: 'effectiveness', label: 'Effectiveness (ε)', unit: '%', decimals: 1 },
    ],
    calculate: ({ T_hi, T_ho, T_ci, T_co, Q_kw, U, F }) => {
      const dT1 = Number(T_hi) - Number(T_co)
      const dT2 = Number(T_ho) - Number(T_ci)
      const LMTD = Math.abs(dT1 - dT2) < 0.01 ? dT1 : (dT1 - dT2) / Math.log(dT1 / dT2)
      const LMTD_corr = LMTD * Number(F)
      const A_m2 = Number(Q_kw) * 1000 / (Number(U) * LMTD_corr)
      const effectiveness = (Number(T_co) - Number(T_ci)) / (Number(T_hi) - Number(T_ci)) * 100
      return { LMTD, LMTD_corr, A_m2, effectiveness }
    },
  },

  // ── Gas Compressor Power ───────────────────────────────────
  'gas-compressor-power': {
    slug: 'gas-compressor-power',
    name: 'Gas Compressor Power',
    icon: '💨',
    description: 'Calculate isentropic and polytropic compression work and shaft power for gas compressors.',
    formula: 'W_isen = [k/(k−1)]·Z·R·T₁·[(P₂/P₁)^((k−1)/k)−1]  |  T₂ = T₁·(P₂/P₁)^((k−1)/k)',
    reference: 'API 617, ASME PTC 10',
    inputs: [
      { id: 'T1', label: 'Inlet Temperature (T₁)', unit: '°C', type: 'number', default: 25 },
      { id: 'P1', label: 'Inlet Pressure (P₁)', unit: 'bar(a)', type: 'number', default: 1.013, step: 0.001 },
      { id: 'P2', label: 'Outlet Pressure (P₂)', unit: 'bar(a)', type: 'number', default: 8, min: 1 },
      { id: 'MW', label: 'Gas Molecular Weight', unit: 'g/mol', type: 'number', default: 28.97, min: 1, placeholder: 'Air=28.97, CH4=16' },
      { id: 'k', label: 'Isentropic Exponent (k)', unit: '', type: 'number', default: 1.4, step: 0.01, placeholder: 'Air=1.4, CH4=1.31' },
      { id: 'mdot', label: 'Mass Flow Rate', unit: 'kg/s', type: 'number', default: 1, min: 0.001 },
      { id: 'eta_isen', label: 'Isentropic Efficiency (η)', unit: '%', type: 'number', default: 78, min: 30 },
    ],
    outputs: [
      { id: 'r', label: 'Compression Ratio (P₂/P₁)', unit: '', decimals: 2 },
      { id: 'T2_C', label: 'Discharge Temperature', unit: '°C', decimals: 1 },
      { id: 'W_isen', label: 'Isentropic Work', unit: 'kJ/kg', decimals: 2 },
      { id: 'P_shaft', label: 'Shaft Power Required', unit: 'kW', decimals: 1 },
    ],
    calculate: ({ T1, P1, P2, MW, k, mdot, eta_isen }) => {
      const T1_K = Number(T1) + 273.15
      const R = 8314 / Number(MW)
      const kv = Number(k), r = Number(P2) / Number(P1)
      const T2_K = T1_K * Math.pow(r, (kv - 1) / kv)
      const W_isen = kv / (kv - 1) * R * T1_K * (Math.pow(r, (kv - 1) / kv) - 1) / 1000
      const P_shaft = Number(mdot) * W_isen / (Number(eta_isen) / 100)
      return { r, T2_C: T2_K - 273.15, W_isen, P_shaft }
    },
  },

  // ── Pump NPSH Calculator ───────────────────────────────────
  'pump-npsh-calculator': {
    slug: 'pump-npsh-calculator',
    name: 'Pump NPSH Calculator',
    icon: '💧',
    description: 'Calculate Net Positive Suction Head Available (NPSH_A) and check cavitation risk.',
    formula: 'NPSH_A = P_atm/(ρg) + H_s − h_f,suction − P_vapor/(ρg)',
    reference: 'Hydraulic Institute Standards, API 610',
    inputs: [
      { id: 'P_atm', label: 'Atmospheric Pressure', unit: 'bar(a)', type: 'number', default: 1.013, step: 0.001 },
      { id: 'H_s', label: 'Static Suction Head (+ flooded, − suction lift)', unit: 'm', type: 'number', default: 3 },
      { id: 'h_f', label: 'Suction Pipe Friction Loss', unit: 'm', type: 'number', default: 1.5, min: 0 },
      { id: 'T_fluid', label: 'Fluid Temperature', unit: '°C', type: 'number', default: 25 },
      { id: 'rho', label: 'Fluid Density', unit: 'kg/m³', type: 'number', default: 998, min: 1 },
      { id: 'NPSH_R', label: 'Required NPSH (pump datasheet)', unit: 'm', type: 'number', default: 3, min: 0.5 },
    ],
    outputs: [
      { id: 'Pvap_m', label: 'Vapour Pressure Head', unit: 'm', decimals: 2 },
      { id: 'NPSH_A', label: 'NPSH Available', unit: 'm', decimals: 2 },
      { id: 'margin', label: 'NPSH Margin (A−R)', unit: 'm', decimals: 2 },
      { id: 'status', label: 'Cavitation Risk (1=ok, 0=risk)', unit: '', decimals: 0 },
    ],
    calculate: ({ P_atm, H_s, h_f, T_fluid, rho, NPSH_R }) => {
      const g = 9.81
      const T = Number(T_fluid)
      const Pvap_kPa = 0.6108 * Math.exp(17.27 * T / (T + 237.3))
      const Pvap_m = Pvap_kPa * 1000 / (Number(rho) * g)
      const P_atm_m = Number(P_atm) * 1e5 / (Number(rho) * g)
      const NPSH_A = P_atm_m + Number(H_s) - Number(h_f) - Pvap_m
      const margin = NPSH_A - Number(NPSH_R) - 0.5
      return { Pvap_m, NPSH_A, margin, status: margin > 0 ? 1 : 0 }
    },
  },

  // ── Gas Molecular Weight ───────────────────────────────────
  'gas-molecular-weight': {
    slug: 'gas-molecular-weight',
    name: 'Gas Molecular Weight Calculator',
    icon: '🧬',
    description: 'Calculate mixture molecular weight, density and specific gravity of natural gas mixtures.',
    formula: 'MW_mix = Σ(yi·MWi)  |  ρ = P·MW/(Z·R·T)  |  SG = MW_mix/28.97',
    reference: 'GPA 2145, API Technical Data Book',
    inputs: [
      { id: 'y_CH4', label: 'Methane (CH4) mole%', unit: '%', type: 'number', default: 85, min: 0 },
      { id: 'y_C2H6', label: 'Ethane (C2H6) mole%', unit: '%', type: 'number', default: 8, min: 0 },
      { id: 'y_C3H8', label: 'Propane (C3H8) mole%', unit: '%', type: 'number', default: 4, min: 0 },
      { id: 'y_N2', label: 'Nitrogen (N2) mole%', unit: '%', type: 'number', default: 2, min: 0 },
      { id: 'y_CO2', label: 'CO2 mole%', unit: '%', type: 'number', default: 1, min: 0 },
      { id: 'P_kPa', label: 'Gas Pressure', unit: 'kPa(a)', type: 'number', default: 101.325 },
      { id: 'T_C', label: 'Gas Temperature', unit: '°C', type: 'number', default: 15 },
    ],
    outputs: [
      { id: 'MW_mix', label: 'Mixture MW', unit: 'g/mol', decimals: 3 },
      { id: 'SG', label: 'Specific Gravity (vs air)', unit: '', decimals: 4 },
      { id: 'rho', label: 'Gas Density (ideal, Z=1)', unit: 'kg/m³', decimals: 4 },
      { id: 'total_mole', label: 'Total Mole % (should = 100)', unit: '%', decimals: 1 },
    ],
    calculate: ({ y_CH4, y_C2H6, y_C3H8, y_N2, y_CO2, P_kPa, T_C }) => {
      const mw = { CH4: 16.04, C2H6: 30.07, C3H8: 44.10, N2: 28.014, CO2: 44.01 }
      const fracs = [Number(y_CH4), Number(y_C2H6), Number(y_C3H8), Number(y_N2), Number(y_CO2)]
      const mws = [mw.CH4, mw.C2H6, mw.C3H8, mw.N2, mw.CO2]
      const total_mole = fracs.reduce((a, b) => a + b, 0)
      const MW_mix = fracs.reduce((s, f, i) => s + f / 100 * mws[i], 0)
      const SG = MW_mix / 28.97
      const R = 8.314, T_K = Number(T_C) + 273.15
      const rho = Number(P_kPa) * 1000 * MW_mix / 1000 / (R * T_K)
      return { MW_mix, SG, rho, total_mole }
    },
  },

  // ── Steam Table Lookup ─────────────────────────────────────
  'steam-table-lookup': {
    slug: 'steam-table-lookup',
    name: 'Steam Table Lookup Tool',
    icon: '♨️',
    description: 'Estimate saturation properties and superheated steam enthalpy using Antoine-type approximations.',
    formula: 'T_sat ≈ 42.6795·P^0.2545  |  hg ≈ 2501+1.86·T_sat  |  h_sup = hg + cp·(T−Tsat)',
    reference: 'IAPWS-IF97 (approximate for preliminary calcs)',
    inputs: [
      { id: 'mode', label: 'Input Mode', type: 'select', default: 'pressure', options: [
        { label: 'Given Pressure → find Tsat', value: 'pressure' },
        { label: 'Given Temperature → find Psat', value: 'temperature' },
      ]},
      { id: 'P_kPa', label: 'Steam Pressure', unit: 'kPa(a)', type: 'number', default: 200, min: 1 },
      { id: 'T_C', label: 'Steam Temperature', unit: '°C', type: 'number', default: 120 },
      { id: 'T_sup', label: 'Actual Temp (if superheated)', unit: '°C', type: 'number', default: 250, placeholder: 'Leave = Tsat if saturated' },
    ],
    outputs: [
      { id: 'T_sat', label: 'Saturation Temperature', unit: '°C', decimals: 1 },
      { id: 'P_sat', label: 'Saturation Pressure', unit: 'kPa', decimals: 1 },
      { id: 'hg', label: 'Saturated Vapour Enthalpy (hg)', unit: 'kJ/kg', decimals: 1 },
      { id: 'hf', label: 'Saturated Liquid Enthalpy (hf)', unit: 'kJ/kg', decimals: 1 },
      { id: 'hfg', label: 'Latent Heat (hfg)', unit: 'kJ/kg', decimals: 1 },
      { id: 'h_sup', label: 'Superheated Enthalpy', unit: 'kJ/kg', decimals: 1 },
    ],
    calculate: ({ mode, P_kPa, T_C, T_sup }) => {
      let T_sat = 0, P_sat = 0
      if (mode === 'pressure') {
        T_sat = 42.6795 * Math.pow(Number(P_kPa), 0.2545)
        P_sat = Number(P_kPa)
      } else {
        T_sat = Number(T_C)
        P_sat = Math.pow(T_sat / 42.6795, 1 / 0.2545)
      }
      const hg = 2501 + 1.86 * T_sat - 2.3 * T_sat
      const hf = 4.18 * T_sat
      const hfg = hg - hf
      const T_actual = Number(T_sup) > T_sat ? Number(T_sup) : T_sat
      const h_sup = hg + 2.0 * (T_actual - T_sat)
      return { T_sat, P_sat, hg: 2676 + 0.5 * T_sat, hf: 4.18 * T_sat, hfg: 2676 + 0.5 * T_sat - 4.18 * T_sat, h_sup: 2676 + 0.5 * T_sat + 2.0 * (T_actual - T_sat) }
    },
  },

  // ── Relief Valve Sizing ────────────────────────────────────
  'relief-valve-sizing': {
    slug: 'relief-valve-sizing',
    name: 'Relief Valve Sizing (PSV)',
    icon: '⚠️',
    description: 'Calculate required PSV orifice area for gas/vapour relief per API 520/521.',
    formula: 'A = W/(C·Kd·Kb·Kc·P₁·√(M/TZ))  |  C = 520·√(k·(2/(k+1))^((k+1)/(k−1)))',
    reference: 'API 520 Part I (9th Edition), API 521',
    inputs: [
      { id: 'W', label: 'Relieving Mass Flow (W)', unit: 'kg/hr', type: 'number', default: 5000, min: 1 },
      { id: 'P1', label: 'Relieving Pressure (P₁)', unit: 'bar(a)', type: 'number', default: 12, min: 0.1 },
      { id: 'T_K', label: 'Relieving Temperature', unit: 'K', type: 'number', default: 400, min: 200 },
      { id: 'MW', label: 'Gas Molecular Weight', unit: 'g/mol', type: 'number', default: 28.97, min: 2 },
      { id: 'k', label: 'Isentropic Exponent (k=Cp/Cv)', unit: '', type: 'number', default: 1.4, step: 0.01 },
      { id: 'Kd', label: 'Discharge Coefficient (Kd)', unit: '', type: 'number', default: 0.975, step: 0.005 },
      { id: 'Kb', label: 'Back-Pressure Correction (Kb)', unit: '', type: 'number', default: 1.0, step: 0.01 },
    ],
    outputs: [
      { id: 'C_factor', label: 'Gas Constant (C)', unit: '', decimals: 2 },
      { id: 'A_cm2', label: 'Required Orifice Area', unit: 'cm²', decimals: 3 },
      { id: 'A_in2', label: 'Required Orifice Area', unit: 'in²', decimals: 4 },
      { id: 'API_letter', label: 'API Orifice Designation (approx.)', unit: '', decimals: 0 },
    ],
    calculate: ({ W, P1, T_K, MW, k, Kd, Kb }) => {
      const kv = Number(k)
      const C_factor = 520 * Math.sqrt(kv * Math.pow(2 / (kv + 1), (kv + 1) / (kv - 1)))
      const P1_psia = Number(P1) * 14.504
      const W_lbhr = Number(W) * 2.2046
      const A_in2 = W_lbhr / (C_factor * Number(Kd) * Number(Kb) * P1_psia * Math.sqrt(Number(MW) / (Number(T_K) * 1.8)))
      const A_cm2 = A_in2 * 6.452
      const sizes = [0.11, 0.196, 0.307, 0.503, 0.785, 1.287, 1.838, 2.853, 3.60, 4.34]
      const idx = sizes.findIndex(s => s >= A_in2)
      return { C_factor, A_cm2, A_in2, API_letter: idx >= 0 ? idx + 1 : sizes.length + 1 }
    },
  },

  // ── Flare Stack Sizing ─────────────────────────────────────
  'flare-stack-sizing': {
    slug: 'flare-stack-sizing',
    name: 'Flare Stack Sizing Tool',
    icon: '🔥',
    description: 'Estimate flare radiation at a given distance and assess safe exclusion zones per API 521.',
    formula: 'k = τ·Q_heat·F_rad/(4π·d²)  |  Safe: k≤1.6 kW/m²  |  Emergency: k≤4.7 kW/m²',
    reference: 'API 521 6th Ed., API 520',
    inputs: [
      { id: 'Q_relief', label: 'Relieving Rate (Q)', unit: 'kg/hr', type: 'number', default: 20000, min: 1 },
      { id: 'HHV', label: 'Net Heating Value (HHV)', unit: 'kJ/kg', type: 'number', default: 46000, min: 1000, placeholder: 'Natural gas≈50000' },
      { id: 'F_rad', label: 'Fraction Radiated (F)', unit: '', type: 'number', default: 0.2, step: 0.01 },
      { id: 'tau', label: 'Atmospheric Transmissivity (τ)', unit: '', type: 'number', default: 1.0, step: 0.01 },
      { id: 'd', label: 'Distance from Flame Centre', unit: 'm', type: 'number', default: 100, min: 1 },
    ],
    outputs: [
      { id: 'Q_heat', label: 'Total Heat Release', unit: 'kW', decimals: 0 },
      { id: 'k_kWm2', label: 'Radiation at Distance', unit: 'kW/m²', decimals: 3 },
      { id: 'r_safe', label: 'Safe Radius (≤1.6 kW/m²)', unit: 'm', decimals: 1 },
      { id: 'r_emerg', label: 'Emergency Radius (≤4.7 kW/m²)', unit: 'm', decimals: 1 },
    ],
    calculate: ({ Q_relief, HHV, F_rad, tau, d }) => {
      const Q_heat = Number(Q_relief) / 3600 * Number(HHV)
      const k_kWm2 = Number(tau) * Q_heat * Number(F_rad) / (4 * Math.PI * Number(d) ** 2)
      const r_safe = Math.sqrt(Number(tau) * Q_heat * Number(F_rad) / (4 * Math.PI * 1.6))
      const r_emerg = Math.sqrt(Number(tau) * Q_heat * Number(F_rad) / (4 * Math.PI * 4.7))
      return { Q_heat, k_kWm2, r_safe, r_emerg }
    },
  },

  // ── Distillation Column Estimator ──────────────────────────
  'distillation-column-estimator': {
    slug: 'distillation-column-estimator',
    name: 'Distillation Column Estimator',
    icon: '🧪',
    description: 'Estimate minimum reflux ratio, number of theoretical stages and column sizing using McCabe-Thiele method.',
    formula: 'R_min = (xD−y\'f)/(y\'f−xf)  |  R_op = 1.5·R_min  |  Operating line: y = [R/(R+1)]x + xD/(R+1)',
    reference: 'McCabe-Thiele, Perry\'s Chemical Engineers Handbook',
    inputs: [
      { id: 'xF', label: 'Feed Composition (xF)', unit: 'mol frac', type: 'number', default: 0.4, step: 0.01 },
      { id: 'xD', label: 'Distillate Composition (xD)', unit: 'mol frac', type: 'number', default: 0.95, step: 0.01 },
      { id: 'xB', label: 'Bottoms Composition (xB)', unit: 'mol frac', type: 'number', default: 0.05, step: 0.01 },
      { id: 'yF', label: 'Equilibrium y at feed (y*F)', unit: 'mol frac', type: 'number', default: 0.62, step: 0.01 },
      { id: 'alpha', label: 'Relative Volatility (α)', unit: '', type: 'number', default: 2.5, step: 0.1 },
      { id: 'F', label: 'Feed Rate (F)', unit: 'kmol/hr', type: 'number', default: 100 },
    ],
    outputs: [
      { id: 'R_min', label: 'Minimum Reflux Ratio (R_min)', unit: '', decimals: 2 },
      { id: 'R_op', label: 'Operating Reflux Ratio (1.5×R_min)', unit: '', decimals: 2 },
      { id: 'N_min', label: 'Min Theoretical Stages (Fenske)', unit: '', decimals: 1 },
      { id: 'D', label: 'Distillate Rate (D)', unit: 'kmol/hr', decimals: 2 },
      { id: 'B', label: 'Bottoms Rate (B)', unit: 'kmol/hr', decimals: 2 },
    ],
    calculate: ({ xF, xD, xB, yF, alpha, F }) => {
      const R_min = (Number(xD) - Number(yF)) / (Number(yF) - Number(xF))
      const R_op = 1.5 * R_min
      const N_min = Math.log((Number(xD) / (1 - Number(xD))) * ((1 - Number(xB)) / Number(xB))) / Math.log(Number(alpha))
      const D = Number(F) * (Number(xF) - Number(xB)) / (Number(xD) - Number(xB))
      const B = Number(F) - D
      return { R_min, R_op, N_min, D, B }
    },
  },

  // ══════════════════════════════════════════════════════════
  // SECTION 6 — GEOTECHNICAL & ENVIRONMENTAL
  // ══════════════════════════════════════════════════════════

  // ── Soil Bearing Capacity ──────────────────────────────────
  'soil-bearing-capacity': {
    slug: 'soil-bearing-capacity',
    name: 'Soil Bearing Capacity (Terzaghi)',
    icon: '🌍',
    description: 'Calculate ultimate and allowable soil bearing capacity using Terzaghi\'s general equation with shape factors.',
    formula: 'q_ult = c·Nc + γDf·Nq + 0.5γBNγ  (strip)  |  q_allow = q_net/FOS',
    reference: 'Terzaghi (1943), IS 6403, ASCE 7',
    inputs: [
      { id: 'c', label: 'Cohesion (c)', unit: 'kPa', type: 'number', default: 15, min: 0 },
      { id: 'phi', label: 'Friction Angle (φ)', unit: '°', type: 'number', default: 28, min: 0 },
      { id: 'gamma', label: 'Unit Weight (γ)', unit: 'kN/m³', type: 'number', default: 18 },
      { id: 'Df', label: 'Foundation Depth (Df)', unit: 'm', type: 'number', default: 1.2, min: 0 },
      { id: 'B', label: 'Foundation Width (B)', unit: 'm', type: 'number', default: 1.5, min: 0.3 },
      { id: 'FOS', label: 'Factor of Safety', unit: '', type: 'number', default: 3, min: 1.5 },
    ],
    outputs: [
      { id: 'Nc', label: 'Nc', unit: '', decimals: 2 },
      { id: 'Nq', label: 'Nq', unit: '', decimals: 2 },
      { id: 'Ng', label: 'Nγ', unit: '', decimals: 2 },
      { id: 'q_ult', label: 'Ultimate Bearing Capacity', unit: 'kPa', decimals: 1 },
      { id: 'q_net', label: 'Net Bearing Capacity', unit: 'kPa', decimals: 1 },
      { id: 'q_allow', label: 'Allowable Bearing Capacity', unit: 'kPa', decimals: 1 },
    ],
    calculate: ({ c, phi, gamma, Df, B, FOS }) => {
      const phiR = Number(phi) * Math.PI / 180
      const Nq = Math.exp(Math.PI * Math.tan(phiR)) * Math.pow(Math.tan(Math.PI / 4 + phiR / 2), 2)
      const Nc = Number(phi) === 0 ? 5.14 : (Nq - 1) / Math.tan(phiR)
      const Ng = 2 * (Nq + 1) * Math.tan(phiR)
      const q = Number(gamma) * Number(Df)
      const q_ult = Number(c) * Nc + q * Nq + 0.5 * Number(gamma) * Number(B) * Ng
      const q_net = q_ult - q
      return { Nc, Nq, Ng, q_ult, q_net, q_allow: q_net / Number(FOS) }
    },
  },

  // ── Settlement Calculator ──────────────────────────────────
  'settlement-calculator': {
    slug: 'settlement-calculator',
    name: 'Settlement Calculator',
    icon: '📉',
    description: 'Calculate immediate elastic settlement and primary consolidation settlement for foundations on clay.',
    formula: 'ρi = q·B·(1−ν²)/Es·Is  |  ρc = Cc/(1+e0)·H·log(σ\'f/σ\'0)',
    reference: 'Terzaghi & Peck, IS 8009, ASCE 7',
    inputs: [
      { id: 'q', label: 'Net Foundation Pressure (q)', unit: 'kPa', type: 'number', default: 100, min: 1 },
      { id: 'B', label: 'Footing Width (B)', unit: 'm', type: 'number', default: 2, min: 0.3 },
      { id: 'nu', label: 'Poisson\'s Ratio (ν)', unit: '', type: 'number', default: 0.35, step: 0.05 },
      { id: 'Es', label: 'Elastic Modulus (Es)', unit: 'MPa', type: 'number', default: 15, min: 0.1 },
      { id: 'Is', label: 'Influence Factor (Is)', unit: '', type: 'number', default: 0.82, step: 0.01 },
      { id: 'Cc', label: 'Compression Index (Cc)', unit: '', type: 'number', default: 0.35, step: 0.01 },
      { id: 'e0', label: 'Initial Void Ratio (e₀)', unit: '', type: 'number', default: 0.8, step: 0.01 },
      { id: 'H', label: 'Clay Layer Thickness (H)', unit: 'm', type: 'number', default: 5, min: 0.1 },
      { id: 'sigma0', label: 'Initial Effective Stress (σ\'₀)', unit: 'kPa', type: 'number', default: 60, min: 1 },
      { id: 'sigmaf', label: 'Final Effective Stress (σ\'f)', unit: 'kPa', type: 'number', default: 140, min: 1 },
    ],
    outputs: [
      { id: 'rho_i', label: 'Immediate Settlement', unit: 'mm', decimals: 1 },
      { id: 'rho_c', label: 'Consolidation Settlement', unit: 'mm', decimals: 1 },
      { id: 'rho_total', label: 'Total Settlement', unit: 'mm', decimals: 1 },
    ],
    calculate: ({ q, B, nu, Es, Is, Cc, e0, H, sigma0, sigmaf }) => {
      const rho_i = Number(q) * Number(B) * (1 - Number(nu) ** 2) / (Number(Es) * 1000) * Number(Is) * 1000
      const rho_c = (Number(Cc) / (1 + Number(e0))) * Number(H) * Math.log10(Number(sigmaf) / Number(sigma0)) * 1000
      return { rho_i, rho_c, rho_total: rho_i + rho_c }
    },
  },

  // ── Slope Stability Bishop ─────────────────────────────────
  'slope-stability-bishop': {
    slug: 'slope-stability-bishop',
    name: 'Slope Stability (Bishop\'s Method)',
    icon: '⛰️',
    description: 'Calculate factor of safety for circular slip surface using Bishop\'s simplified method.',
    formula: 'FOS = Σ{[c\'b+(W−ub)tanφ\']/mα} / Σ(W·sinα)  |  mα = cosα + sinα·tanφ\'/FOS',
    reference: 'Bishop (1955), FHWA Slope Stability',
    inputs: [
      { id: 'c_eff', label: 'Effective Cohesion (c\')', unit: 'kPa', type: 'number', default: 20, min: 0 },
      { id: 'phi_eff', label: 'Effective Friction Angle (φ\')', unit: '°', type: 'number', default: 30, min: 0 },
      { id: 'gamma', label: 'Unit Weight (γ)', unit: 'kN/m³', type: 'number', default: 18 },
      { id: 'slope_H', label: 'Slope Height (H)', unit: 'm', type: 'number', default: 10, min: 1 },
      { id: 'slope_angle', label: 'Slope Angle', unit: '°', type: 'number', default: 35, min: 10 },
      { id: 'u_ratio', label: 'Pore Pressure Ratio (ru)', unit: '', type: 'number', default: 0.3, step: 0.05 },
    ],
    outputs: [
      { id: 'FOS', label: 'Factor of Safety (FOS)', unit: '', decimals: 2 },
      { id: 'stability', label: 'Stability Code (1=stable, 2=marginal, 3=unstable)', unit: '', decimals: 0 },
      { id: 'Taylor_N', label: 'Taylor Stability Number (Tc/γH)', unit: '', decimals: 3 },
    ],
    calculate: ({ c_eff, phi_eff, gamma, slope_H, slope_angle, u_ratio }) => {
      const phiR = Number(phi_eff) * Math.PI / 180
      const alphaR = Number(slope_angle) * Math.PI / 180
      const W_unit = Number(gamma) * Number(slope_H) ** 2 / 2
      const u_unit = Number(u_ratio) * W_unit
      let FOS = 1.5
      for (let iter = 0; iter < 20; iter++) {
        const m_alpha = Math.cos(alphaR) + Math.sin(alphaR) * Math.tan(phiR) / FOS
        const num = (Number(c_eff) * Number(slope_H) + (W_unit - u_unit) * Math.tan(phiR)) / m_alpha
        const den = W_unit * Math.sin(alphaR)
        FOS = num / den
      }
      const stability = FOS > 1.5 ? 1 : FOS > 1.0 ? 2 : 3
      const Taylor_N = Number(c_eff) / (Number(gamma) * Number(slope_H))
      return { FOS, stability, Taylor_N }
    },
  },

  // ── Lateral Earth Pressure ─────────────────────────────────
  'lateral-earth-pressure': {
    slug: 'lateral-earth-pressure',
    name: 'Lateral Earth Pressure',
    icon: '🧱',
    description: 'Calculate at-rest, active and passive earth pressure coefficients and total forces using Rankine theory.',
    formula: 'Ka = (1−sinφ)/(1+sinφ)  |  Kp = (1+sinφ)/(1−sinφ)  |  K₀ = 1−sinφ',
    reference: 'Rankine (1857), Jaky (1944), IS 1904',
    inputs: [
      { id: 'phi', label: 'Internal Friction Angle (φ)', unit: '°', type: 'number', default: 30, min: 5 },
      { id: 'gamma', label: 'Soil Unit Weight (γ)', unit: 'kN/m³', type: 'number', default: 18 },
      { id: 'H', label: 'Retained Height (H)', unit: 'm', type: 'number', default: 5, min: 0.5 },
      { id: 'c', label: 'Cohesion (c)', unit: 'kPa', type: 'number', default: 0, min: 0 },
      { id: 'q', label: 'Surcharge (q)', unit: 'kPa', type: 'number', default: 10, min: 0 },
    ],
    outputs: [
      { id: 'Ka', label: 'Active Pressure Coeff (Ka)', unit: '', decimals: 3 },
      { id: 'Kp', label: 'Passive Pressure Coeff (Kp)', unit: '', decimals: 3 },
      { id: 'K0', label: 'At-Rest Coeff (K₀)', unit: '', decimals: 3 },
      { id: 'Pa_total', label: 'Total Active Force', unit: 'kN/m', decimals: 2 },
      { id: 'Pp_base', label: 'Passive Pressure at Base', unit: 'kPa', decimals: 1 },
    ],
    calculate: ({ phi, gamma, H, c, q }) => {
      const phiR = Number(phi) * Math.PI / 180
      const Ka = Math.pow(Math.tan(Math.PI / 4 - phiR / 2), 2)
      const Kp = Math.pow(Math.tan(Math.PI / 4 + phiR / 2), 2)
      const K0 = 1 - Math.sin(phiR)
      const Pa_soil = 0.5 * Ka * Number(gamma) * Number(H) ** 2
      const Pa_surcharge = Ka * Number(q) * Number(H)
      const Pa_cohesion = -2 * Number(c) * Math.sqrt(Ka) * Number(H)
      const Pa_total = Pa_soil + Pa_surcharge + Pa_cohesion
      const Pp_base = Kp * Number(gamma) * Number(H) + 2 * Number(c) * Math.sqrt(Kp)
      return { Ka, Kp, K0, Pa_total: Math.max(0, Pa_total), Pp_base }
    },
  },

  // ── Liquefaction Potential ─────────────────────────────────
  'liquefaction-potential': {
    slug: 'liquefaction-potential',
    name: 'Liquefaction Potential Checker',
    icon: '🌊',
    description: 'Assess earthquake-induced liquefaction risk using simplified SPT-based procedure (Youd & Idriss).',
    formula: 'CSR = 0.65·(σv/σ\'v)·(amax/g)·rd  |  FOS = CRR_M7.5/CSR',
    reference: 'Youd & Idriss (2001), NCEER Workshop',
    inputs: [
      { id: 'N60', label: 'SPT N₆₀ blow count', unit: 'blows/ft', type: 'number', default: 12, min: 0, step: 1 },
      { id: 'sigmav', label: 'Total Vertical Stress (σv)', unit: 'kPa', type: 'number', default: 90, min: 1 },
      { id: 'sigmav_eff', label: 'Effective Vertical Stress (σ\'v)', unit: 'kPa', type: 'number', default: 55, min: 1 },
      { id: 'amax', label: 'Peak Ground Acceleration (amax/g)', unit: 'g', type: 'number', default: 0.2, step: 0.01 },
      { id: 'rd', label: 'Stress Reduction Factor (rd)', unit: '', type: 'number', default: 0.95, step: 0.01, placeholder: 'z<3m≈0.96' },
      { id: 'MW', label: 'Earthquake Magnitude (Mw)', unit: '', type: 'number', default: 7.5, step: 0.1 },
    ],
    outputs: [
      { id: 'N1_60', label: 'Normalized (N₁)₆₀', unit: '', decimals: 1 },
      { id: 'CSR', label: 'Cyclic Stress Ratio (CSR)', unit: '', decimals: 3 },
      { id: 'CRR', label: 'Cyclic Resistance Ratio (CRR M7.5)', unit: '', decimals: 3 },
      { id: 'FOS_liq', label: 'Factor of Safety (FOS)', unit: '', decimals: 2 },
      { id: 'risk_code', label: 'Risk (1=safe≥1.4, 2=marginal, 3=liquefy)', unit: '', decimals: 0 },
    ],
    calculate: ({ N60, sigmav, sigmav_eff, amax, rd, MW }) => {
      const CN = Math.min(2.0, Math.sqrt(100 / Number(sigmav_eff)))
      const N1_60 = Number(N60) * CN
      const CSR = 0.65 * (Number(sigmav) / Number(sigmav_eff)) * Number(amax) * Number(rd)
      const n = N1_60
      const CRR = 1 / (34 - n) + n / 135 + 50 / Math.pow(10 * n + 45, 2) - 1 / 200
      const MSF = Math.pow(7.5 / Number(MW), 2.56)
      const CRR_adj = CRR * MSF
      const FOS_liq = CRR_adj / CSR
      const risk_code = FOS_liq >= 1.4 ? 1 : FOS_liq >= 1.0 ? 2 : 3
      return { N1_60, CSR, CRR: CRR_adj, FOS_liq, risk_code }
    },
  },

  // ── Pile Driving Formula ───────────────────────────────────
  'pile-driving-formula': {
    slug: 'pile-driving-formula',
    name: 'Pile Driving Formula Tool',
    icon: '🗜️',
    description: 'Estimate pile ultimate capacity from driving records using ENR and Hiley dynamic formulas.',
    formula: 'ENR: Q_ult = Wr·H/(s+25.4/10)  |  Hiley: Q_ult = (ηb·Wr·H)/(s/2+C/2)·(Wr+e²Wp)/(Wr+Wp)',
    reference: 'Engineering News Record (ENR), Hiley (1930)',
    inputs: [
      { id: 'Wr', label: 'Ram Weight (Wr)', unit: 'kN', type: 'number', default: 30, min: 0.1 },
      { id: 'H', label: 'Drop Height (H)', unit: 'm', type: 'number', default: 1.2, min: 0.1, step: 0.1 },
      { id: 's', label: 'Set per Blow (s)', unit: 'mm', type: 'number', default: 3, min: 0.1, step: 0.5 },
      { id: 'Wp', label: 'Pile Weight (Wp)', unit: 'kN', type: 'number', default: 15, min: 0.1 },
      { id: 'e', label: 'Coefficient of Restitution (e)', unit: '', type: 'number', default: 0.5, step: 0.05 },
      { id: 'C', label: 'Total Elastic Compression (C)', unit: 'mm', type: 'number', default: 10, min: 0 },
      { id: 'eta_b', label: 'Blow Efficiency (ηb)', unit: '', type: 'number', default: 0.85, step: 0.05 },
    ],
    outputs: [
      { id: 'Q_ENR', label: 'Ultimate Capacity (ENR)', unit: 'kN', decimals: 1 },
      { id: 'Q_Hiley', label: 'Ultimate Capacity (Hiley)', unit: 'kN', decimals: 1 },
      { id: 'Q_allow_ENR', label: 'Allowable Capacity (ENR/FOS 6)', unit: 'kN', decimals: 1 },
      { id: 'Q_allow_Hiley', label: 'Allowable Capacity (Hiley/FOS 3)', unit: 'kN', decimals: 1 },
    ],
    calculate: ({ Wr, H, s, Wp, e, C, eta_b }) => {
      const Q_ENR = Number(Wr) * 1000 * Number(H) / (Number(s) + 25.4 / 10) / 1000
      const hammer_eff = (Number(Wr) + Number(e) ** 2 * Number(Wp)) / (Number(Wr) + Number(Wp))
      const Q_Hiley = (Number(eta_b) * Number(Wr) * 1000 * Number(H)) / ((Number(s) / 2 + Number(C) / 2) / 1000) * hammer_eff / 1000
      return { Q_ENR, Q_Hiley, Q_allow_ENR: Q_ENR / 6, Q_allow_Hiley: Q_Hiley / 3 }
    },
  },

  // ── Permeability / Seepage ─────────────────────────────────
  'permeability-seepage': {
    slug: 'permeability-seepage',
    name: 'Permeability / Seepage Calculator',
    icon: '💧',
    description: 'Calculate seepage velocity and flow rate through soil using Darcy\'s law and Kozeny-Carman equation.',
    formula: 'v = k·i  |  Q = k·i·A  |  i = Δh/L',
    reference: 'Darcy (1856), IS 2720 Part 17',
    inputs: [
      { id: 'k', label: 'Hydraulic Conductivity (k)', unit: 'm/s', type: 'number', default: 1e-4, step: 1e-5, placeholder: 'Sand≈1e-4, Clay≈1e-8' },
      { id: 'dh', label: 'Head Difference (Δh)', unit: 'm', type: 'number', default: 3, min: 0 },
      { id: 'L', label: 'Seepage Length (L)', unit: 'm', type: 'number', default: 20, min: 0.1 },
      { id: 'A', label: 'Cross-Section Area (A)', unit: 'm²', type: 'number', default: 10, min: 0.01 },
    ],
    outputs: [
      { id: 'i', label: 'Hydraulic Gradient (i)', unit: '', decimals: 4 },
      { id: 'v', label: 'Seepage Velocity', unit: 'm/s', decimals: 6 },
      { id: 'Q_ls', label: 'Flow Rate', unit: 'L/s', decimals: 4 },
      { id: 'Q_day', label: 'Flow Rate', unit: 'm³/day', decimals: 3 },
    ],
    calculate: ({ k, dh, L, A }) => {
      const i = Number(dh) / Number(L)
      const v = Number(k) * i
      const Q = v * Number(A)
      return { i, v, Q_ls: Q * 1000, Q_day: Q * 86400 }
    },
  },

  // ── SPT N-Value to Parameters ──────────────────────────────
  'spt-n-value-parameters': {
    slug: 'spt-n-value-parameters',
    name: 'SPT N-Value to Parameters',
    icon: '📊',
    description: 'Convert SPT N-value to soil strength parameters: relative density, friction angle, undrained shear strength and elastic modulus.',
    formula: 'Dr = √(N60/60)×100%  |  φ = 27.1+0.3N−0.00054N²  |  cu ≈ 6.25·N kPa',
    reference: 'Meyerhof (1956), Peck, Hanson & Thornburn, Bowles (1988)',
    inputs: [
      { id: 'N', label: 'SPT N-value (field)', unit: 'blows/ft', type: 'number', default: 15, min: 0, step: 1 },
      { id: 'sigmav_eff', label: 'Effective Overburden Stress (σ\'v)', unit: 'kPa', type: 'number', default: 80, min: 1 },
      { id: 'soil_type', label: 'Soil Type', type: 'select', default: 'sand', options: [
        { label: 'Sand / Gravel', value: 'sand' },
        { label: 'Clay / Silt', value: 'clay' },
      ]},
    ],
    outputs: [
      { id: 'N1_60', label: 'Normalized (N₁)₆₀', unit: '', decimals: 1 },
      { id: 'Dr', label: 'Relative Density (Dr)', unit: '%', decimals: 1 },
      { id: 'phi', label: 'Friction Angle (φ)', unit: '°', decimals: 1 },
      { id: 'cu', label: 'Undrained Shear Strength (cu) [clay]', unit: 'kPa', decimals: 1 },
      { id: 'Es', label: 'Young\'s Modulus Estimate', unit: 'kPa', decimals: 0 },
    ],
    calculate: ({ N, sigmav_eff, soil_type }) => {
      const Nv = Number(N)
      const CN = Math.min(2.0, Math.sqrt(100 / Number(sigmav_eff)))
      const N1_60 = Nv * CN
      const Dr = Math.min(100, Math.sqrt(N1_60 / 60) * 100)
      const phi = soil_type === 'sand' ? 27.1 + 0.3 * Nv - 0.00054 * Nv ** 2 : 0
      const cu = soil_type === 'clay' ? 6.25 * Nv : 0
      const Es = 500 * (Nv + 15)
      return { N1_60, Dr, phi, cu, Es }
    },
  },

  // ── Stormwater Runoff ──────────────────────────────────────
  'stormwater-runoff': {
    slug: 'stormwater-runoff',
    name: 'Stormwater Runoff Calculator',
    icon: '🌧️',
    description: 'Calculate peak stormwater runoff using the Rational Method (Q = CiA).',
    formula: 'Q = 0.00278·C·i·A  |  tc = (0.87·L²/(1000·H))^0.385  [Kirpich]',
    reference: 'ASCE Manual 36, FAO Irrigation & Drainage Paper 57',
    inputs: [
      { id: 'C', label: 'Runoff Coefficient (C)', unit: '', type: 'number', default: 0.70, step: 0.05, placeholder: 'Pavement=0.9, Lawn=0.25' },
      { id: 'i', label: 'Rainfall Intensity (i)', unit: 'mm/hr', type: 'number', default: 50, min: 1 },
      { id: 'A', label: 'Catchment Area (A)', unit: 'ha', type: 'number', default: 5, min: 0.01 },
      { id: 'L', label: 'Flow Path Length (for tc)', unit: 'm', type: 'number', default: 300, min: 10 },
      { id: 'elev_diff', label: 'Elevation Difference (H)', unit: 'm', type: 'number', default: 5, min: 0.1 },
    ],
    outputs: [
      { id: 'Q_m3s', label: 'Peak Runoff Flow Rate', unit: 'm³/s', decimals: 4 },
      { id: 'Q_ls', label: 'Peak Runoff Flow Rate', unit: 'L/s', decimals: 2 },
      { id: 'tc', label: 'Time of Concentration (Kirpich)', unit: 'min', decimals: 1 },
    ],
    calculate: ({ C, i, A, L, elev_diff }) => {
      const Q_m3s = 0.00278 * Number(C) * Number(i) * Number(A)
      const tc = Math.pow(0.87 * Number(L) ** 2 / (1000 * Number(elev_diff)), 0.385)
      return { Q_m3s, Q_ls: Q_m3s * 1000, tc }
    },
  },

  // ── Water Demand Estimator ─────────────────────────────────
  'water-demand-estimator': {
    slug: 'water-demand-estimator',
    name: 'Water Demand Estimator',
    icon: '🚰',
    description: 'Calculate average, peak and fire flow water demand for residential and commercial developments.',
    formula: 'Q_avg = P×q_pc  |  Q_peak = Q_avg×PHF  |  Q_fire = 220·√P_area (L/min)',
    reference: 'IS 1172, NFPA 291, WHO Water Demand Guidelines',
    inputs: [
      { id: 'population', label: 'Population Served', unit: 'persons', type: 'number', default: 5000, min: 1, step: 100 },
      { id: 'q_pc', label: 'Per Capita Demand', unit: 'L/capita/day', type: 'number', default: 150, min: 50 },
      { id: 'PHF', label: 'Peak Hour Factor (PHF)', unit: '', type: 'number', default: 1.8, step: 0.1 },
      { id: 'area_m2', label: 'Largest Building Area (fire)', unit: 'm²', type: 'number', default: 1000, min: 100 },
    ],
    outputs: [
      { id: 'Q_avg', label: 'Average Daily Demand', unit: 'm³/day', decimals: 1 },
      { id: 'Q_avg_ls', label: 'Average Flow Rate', unit: 'L/s', decimals: 2 },
      { id: 'Q_peak', label: 'Peak Hour Demand', unit: 'L/s', decimals: 2 },
      { id: 'Q_fire', label: 'Fire Flow Requirement', unit: 'L/min', decimals: 0 },
      { id: 'reservoir', label: 'Reservoir Capacity (1.5 days)', unit: 'm³', decimals: 0 },
    ],
    calculate: ({ population, q_pc, PHF, area_m2 }) => {
      const Q_avg = Number(population) * Number(q_pc) / 1000
      const Q_avg_ls = Q_avg * 1000 / 86400
      const Q_peak = Q_avg_ls * Number(PHF)
      const Q_fire = 220 * Math.sqrt(Number(area_m2))
      return { Q_avg, Q_avg_ls, Q_peak, Q_fire, reservoir: Q_avg * 1.5 }
    },
  },

  // ── Water Tank Sizing ──────────────────────────────────────
  'water-tank-sizing': {
    slug: 'water-tank-sizing',
    name: 'Water Tank Sizing Tool',
    icon: '🪣',
    description: 'Calculate required overhead tank and underground sump sizes based on daily water demand.',
    formula: 'V_OH = Q_daily × (1/3)  |  V_sump = Q_daily/N_pump_cycles',
    reference: 'IS 1172, CPHEEO Manual',
    inputs: [
      { id: 'Q_daily', label: 'Daily Water Demand', unit: 'm³/day', type: 'number', default: 50, min: 0.5 },
      { id: 'pump_cycles', label: 'Pump Cycles per Day', unit: '', type: 'number', default: 4, min: 1, step: 1 },
      { id: 'freeboard', label: 'Freeboard', unit: 'mm', type: 'number', default: 300, min: 150 },
      { id: 'tank_W', label: 'Tank Width (W)', unit: 'm', type: 'number', default: 3, min: 0.5 },
      { id: 'tank_L', label: 'Tank Length (L)', unit: 'm', type: 'number', default: 4, min: 0.5 },
    ],
    outputs: [
      { id: 'V_OH', label: 'Overhead Tank Volume', unit: 'm³', decimals: 2 },
      { id: 'H_OH', label: 'Overhead Tank Water Depth', unit: 'm', decimals: 2 },
      { id: 'V_sump', label: 'Underground Sump Volume', unit: 'm³', decimals: 2 },
    ],
    calculate: ({ Q_daily, pump_cycles, freeboard, tank_W, tank_L }) => {
      const V_OH = Number(Q_daily) / 3
      const H_OH = V_OH / (Number(tank_W) * Number(tank_L)) + Number(freeboard) / 1000
      const V_sump = Number(Q_daily) / Number(pump_cycles)
      return { V_OH, H_OH, V_sump }
    },
  },

  // ── Wastewater Flow Estimator ──────────────────────────────
  'wastewater-flow-estimator': {
    slug: 'wastewater-flow-estimator',
    name: 'Wastewater Flow Estimator',
    icon: '🌊',
    description: 'Estimate wastewater generation, BOD loading and required HRT for treatment design.',
    formula: 'Q_ww = 80% Q_water  |  L_BOD = Q × BOD_conc  |  HRT = V/Q',
    reference: 'Metcalf & Eddy, IS 2490',
    inputs: [
      { id: 'Q_water', label: 'Water Supply Rate', unit: 'L/s', type: 'number', default: 10, min: 0.1 },
      { id: 'BOD_in', label: 'Influent BOD', unit: 'mg/L', type: 'number', default: 250, min: 10 },
      { id: 'BOD_out', label: 'Effluent BOD Target', unit: 'mg/L', type: 'number', default: 30, min: 5 },
      { id: 'V_tank', label: 'Treatment Tank Volume', unit: 'm³', type: 'number', default: 200, min: 1 },
    ],
    outputs: [
      { id: 'Q_ww', label: 'Wastewater Flow Rate', unit: 'L/s', decimals: 2 },
      { id: 'BOD_load', label: 'BOD Loading', unit: 'kg/day', decimals: 1 },
      { id: 'BOD_removal', label: 'Required BOD Removal', unit: '%', decimals: 1 },
      { id: 'HRT', label: 'Hydraulic Retention Time', unit: 'hr', decimals: 1 },
    ],
    calculate: ({ Q_water, BOD_in, BOD_out, V_tank }) => {
      const Q_ww = Number(Q_water) * 0.8
      const Q_m3d = Q_ww * 86400 / 1000
      const BOD_load = Q_m3d * Number(BOD_in) / 1000
      const BOD_removal = (Number(BOD_in) - Number(BOD_out)) / Number(BOD_in) * 100
      const HRT = Number(V_tank) / (Q_ww * 3.6)
      return { Q_ww, BOD_load, BOD_removal, HRT }
    },
  },

  // ── Solar Irradiance & PV Yield ────────────────────────────
  'solar-irradiance-pv-yield': {
    slug: 'solar-irradiance-pv-yield',
    name: 'Solar Irradiance & PV Yield',
    icon: '☀️',
    description: 'Calculate plane-of-array irradiance, annual PV yield and capacity factor for a tilted PV system.',
    formula: 'G_POA = GHI·(1+cosβ)/2 + GHI·ρ·(1−cosβ)/2  |  E = P_stc×H_POA×PR  |  CF = E/(P×8760)',
    reference: 'IEC 61724, NREL PVWatts methodology',
    inputs: [
      { id: 'GHI', label: 'Global Horizontal Irradiance (GHI)', unit: 'kWh/m²/yr', type: 'number', default: 1800, min: 100 },
      { id: 'tilt', label: 'Panel Tilt (β)', unit: '°', type: 'number', default: 25, min: 0, step: 1 },
      { id: 'rho_g', label: 'Ground Reflectance (ρ)', unit: '', type: 'number', default: 0.2, step: 0.01 },
      { id: 'P_stc', label: 'Array Peak Power', unit: 'kWp', type: 'number', default: 100, min: 0.1 },
      { id: 'PR', label: 'Performance Ratio (PR)', unit: '', type: 'number', default: 0.78, step: 0.01 },
    ],
    outputs: [
      { id: 'G_POA', label: 'Plane-of-Array Irradiance', unit: 'kWh/m²/yr', decimals: 0 },
      { id: 'E_annual', label: 'Annual AC Energy Output', unit: 'kWh/yr', decimals: 0 },
      { id: 'CF', label: 'Capacity Factor', unit: '%', decimals: 1 },
      { id: 'specific_yield', label: 'Specific Yield', unit: 'kWh/kWp/yr', decimals: 0 },
    ],
    calculate: ({ GHI, tilt, rho_g, P_stc, PR }) => {
      const beta = Number(tilt) * Math.PI / 180
      const G_beam = Number(GHI) * Math.cos(beta)
      const G_sky = Number(GHI) * (1 + Math.cos(beta)) / 2
      const G_ground = Number(GHI) * Number(rho_g) * (1 - Math.cos(beta)) / 2
      const G_POA = G_beam * 0.8 + G_sky + G_ground
      const E_annual = Number(P_stc) * G_POA * Number(PR) / 1000
      const CF = E_annual / (Number(P_stc) * 8760) * 100
      const specific_yield = E_annual / Number(P_stc)
      return { G_POA, E_annual, CF, specific_yield }
    },
  },

  // ── Carbon Footprint ───────────────────────────────────────
  'engineering-carbon-footprint': {
    slug: 'engineering-carbon-footprint',
    name: 'Carbon Footprint Calculator',
    icon: '🌿',
    description: 'Calculate CO₂ equivalent emissions from building energy, transport, concrete and general processes.',
    formula: 'CO₂ = E×EF_grid  |  Concrete: CO₂ = mass_cement×0.82  |  GWP = Σ(mass×GWP_i)',
    reference: 'IPCC AR6, GHG Protocol, ISO 14064',
    inputs: [
      { id: 'E_kwh', label: 'Annual Electricity Consumption', unit: 'kWh/yr', type: 'number', default: 100000, min: 0 },
      { id: 'EF_grid', label: 'Grid Emission Factor', unit: 'kg CO₂/kWh', type: 'number', default: 0.45, step: 0.01 },
      { id: 'E_gas', label: 'Annual Natural Gas', unit: 'GJ/yr', type: 'number', default: 200, min: 0 },
      { id: 'vehicle_km', label: 'Annual Vehicle Distance', unit: 'km/yr', type: 'number', default: 50000, min: 0 },
      { id: 'EF_vehicle', label: 'Vehicle Emission Factor', unit: 'kg CO₂/km', type: 'number', default: 0.21, step: 0.01, placeholder: 'Petrol≈0.21, EV≈0.05' },
      { id: 'cement_kg', label: 'Cement Used (construction)', unit: 'kg', type: 'number', default: 10000, min: 0 },
    ],
    outputs: [
      { id: 'CO2_electricity', label: 'Electricity Emissions', unit: 't CO₂e/yr', decimals: 2 },
      { id: 'CO2_gas', label: 'Natural Gas Emissions', unit: 't CO₂e/yr', decimals: 2 },
      { id: 'CO2_transport', label: 'Transport Emissions', unit: 't CO₂e/yr', decimals: 2 },
      { id: 'CO2_cement', label: 'Cement / Construction Emissions', unit: 't CO₂e', decimals: 2 },
      { id: 'CO2_total', label: 'Total GHG Footprint', unit: 't CO₂e/yr', decimals: 2 },
    ],
    calculate: ({ E_kwh, EF_grid, E_gas, vehicle_km, EF_vehicle, cement_kg }) => {
      const CO2_electricity = Number(E_kwh) * Number(EF_grid) / 1000
      const CO2_gas = Number(E_gas) * 56.1 / 1000
      const CO2_transport = Number(vehicle_km) * Number(EF_vehicle) / 1000
      const CO2_cement = Number(cement_kg) * 0.82 / 1000
      return { CO2_electricity, CO2_gas, CO2_transport, CO2_cement, CO2_total: CO2_electricity + CO2_gas + CO2_transport + CO2_cement }
    },
  },

  // ── Flood Frequency Analysis ───────────────────────────────
  'flood-frequency-analysis': {
    slug: 'flood-frequency-analysis',
    name: 'Flood Frequency Analysis',
    icon: '🌊',
    description: 'Estimate design flood discharge for given return periods using statistical probability analysis.',
    formula: 'T = 1/P_exceedance  |  P_Weibull = m/(N+1)  |  Q_T = Q_mean + K_T·σ',
    reference: 'USWRC (Bulletin 17C), EM 1110-2-1415',
    inputs: [
      { id: 'Q_mean', label: 'Mean Annual Peak Flow', unit: 'm³/s', type: 'number', default: 200, min: 0.1 },
      { id: 'Q_std', label: 'Standard Deviation of Annual Peaks', unit: 'm³/s', type: 'number', default: 80, min: 0 },
      { id: 'T', label: 'Return Period', unit: 'years', type: 'number', default: 100, min: 2, step: 1 },
      { id: 'skew', label: 'Skew Coefficient (G)', unit: '', type: 'number', default: 0.5, step: 0.1 },
    ],
    outputs: [
      { id: 'P_exceed', label: 'Annual Exceedance Probability', unit: '%', decimals: 2 },
      { id: 'KT', label: 'Frequency Factor (K_T)', unit: '', decimals: 3 },
      { id: 'Q_T', label: 'Design Flood Discharge', unit: 'm³/s', decimals: 1 },
    ],
    calculate: ({ Q_mean, Q_std, T, skew }) => {
      const P_exceed = 100 / Number(T)
      const z = -Math.log(-Math.log(1 - 1 / Number(T)))
      const KT = Number(skew) < 0.001 ? z : (2 / Number(skew)) * (Math.pow(1 - Number(skew) * (Number(skew) / 6 - z) / 6, 3) - 1)
      const Q_T = Number(Q_mean) + KT * Number(Q_std)
      return { P_exceed, KT, Q_T }
    },
  },

  // ── Water Quality Index ────────────────────────────────────
  'water-quality-index': {
    slug: 'water-quality-index',
    name: 'Water Quality Index Tool',
    icon: '🧪',
    description: 'Calculate Water Quality Index (WQI) from key parameters using weighted arithmetic mean method.',
    formula: 'WQI = Σ(qi×Wi)/ΣWi  |  qi = [(Vi−Videal)/(Vstandard−Videal)]×100',
    reference: 'Weighted Arithmetic WQI method, WHO Guidelines 2022',
    inputs: [
      { id: 'pH', label: 'pH', unit: '', type: 'number', default: 7.2, step: 0.1 },
      { id: 'DO', label: 'Dissolved Oxygen', unit: 'mg/L', type: 'number', default: 7.5, min: 0 },
      { id: 'BOD', label: 'BOD', unit: 'mg/L', type: 'number', default: 5, min: 0 },
      { id: 'turbidity', label: 'Turbidity', unit: 'NTU', type: 'number', default: 3, min: 0 },
      { id: 'TDS', label: 'Total Dissolved Solids', unit: 'mg/L', type: 'number', default: 300, min: 0 },
      { id: 'nitrates', label: 'Nitrates', unit: 'mg/L', type: 'number', default: 8, min: 0 },
    ],
    outputs: [
      { id: 'WQI', label: 'Water Quality Index (WQI)', unit: '', decimals: 1 },
      { id: 'status', label: 'Quality Grade Code', unit: '', decimals: 0 },
    ],
    calculate: ({ pH, DO, BOD, turbidity, TDS, nitrates }) => {
      const params = [
        { V: Number(pH), Vi: 7, Vs: 8.5, W: 0.218 },
        { V: Number(DO), Vi: 14.6, Vs: 5, W: 0.287 },
        { V: Number(BOD), Vi: 0, Vs: 5, W: 0.129 },
        { V: Number(turbidity), Vi: 0, Vs: 5, W: 0.151 },
        { V: Number(TDS), Vi: 0, Vs: 500, W: 0.107 },
        { V: Number(nitrates), Vi: 0, Vs: 45, W: 0.108 },
      ]
      const num = params.reduce((s, p) => s + ((p.V - p.Vi) / (p.Vs - p.Vi)) * 100 * p.W, 0)
      const den = params.reduce((s, p) => s + p.W, 0)
      const WQI = Math.max(0, num / den)
      const status = WQI <= 25 ? 1 : WQI <= 50 ? 2 : WQI <= 75 ? 3 : 4
      return { WQI, status }
    },
  },

  // ── Depreciation ───────────────────────────────────────────
  'depreciation-calculator': {
    slug: 'depreciation-calculator',
    name: 'Depreciation Calculator',
    icon: '📉',
    description: 'Calculate annual depreciation using straight-line (SLM) and reducing balance (WDV) methods.',
    formula: 'SLM: Annual = (Cost - Salvage) / Useful Life  |  WDV: Annual = Book Value × Rate',
    inputs: [
      { id: 'cost', label: 'Asset Cost', unit: '$', type: 'number', default: 100000 },
      { id: 'salvage', label: 'Salvage Value', unit: '$', type: 'number', default: 10000 },
      { id: 'life', label: 'Useful Life', unit: 'years', type: 'number', default: 10 },
      { id: 'wdv_rate', label: 'WDV Rate', unit: '%', type: 'number', default: 20 },
    ],
    outputs: [
      { id: 'slm', label: 'SLM Annual Depreciation', unit: '$', decimals: 2 },
      { id: 'wdv1', label: 'WDV Year 1 Depreciation', unit: '$', decimals: 2 },
      { id: 'slm_rate', label: 'SLM Rate', unit: '%', decimals: 1 },
      { id: 'bv_end', label: 'SLM Book Value (yr 1)', unit: '$', decimals: 2 },
    ],
    calculate: ({ cost, salvage, life, wdv_rate }) => {
      const slm = (Number(cost) - Number(salvage)) / Number(life)
      const wdv1 = Number(cost) * (Number(wdv_rate) / 100)
      const slm_rate = (1 / Number(life)) * 100
      const bv_end = Number(cost) - slm
      return { slm, wdv1, slm_rate, bv_end }
    },
  },

  // ══════════════════════════════════════════════════════════
  // SECTION 7 — ELECTRONICS & TELECOMMUNICATIONS
  // ══════════════════════════════════════════════════════════

  // ── RC / RL / LC Filter ────────────────────────────────────
  'rc-rl-lc-filter': {
    slug: 'rc-rl-lc-filter',
    name: 'RC / RL / LC Filter Calculator',
    icon: '〰️',
    description: 'Calculate cutoff frequency, impedance and Q-factor for RC, RL and LC filter circuits.',
    formula: 'RC: fc = 1/(2π·R·C)  |  RL: fc = R/(2π·L)  |  LC: f₀ = 1/(2π·√(LC))  |  Q = (1/R)·√(L/C)',
    inputs: [
      { id: 'type', label: 'Filter Type', type: 'select', default: 'RC', options: [
        { label: 'RC Low-Pass', value: 'RC' },
        { label: 'RL Low-Pass', value: 'RL' },
        { label: 'LC Resonant', value: 'LC' },
      ]},
      { id: 'R', label: 'Resistance (R)', unit: 'Ω', type: 'number', default: 1000, min: 0.1 },
      { id: 'C', label: 'Capacitance (C)', unit: 'nF', type: 'number', default: 100, min: 0.001 },
      { id: 'L', label: 'Inductance (L)', unit: 'mH', type: 'number', default: 10, min: 0.001 },
    ],
    outputs: [
      { id: 'fc', label: 'Cutoff / Resonant Frequency', unit: 'Hz', decimals: 2 },
      { id: 'fc_kHz', label: 'Cutoff / Resonant Frequency', unit: 'kHz', decimals: 4 },
      { id: 'Q', label: 'Quality Factor (Q)', unit: '', decimals: 3 },
      { id: 'Z_C', label: 'Capacitive Reactance at fc', unit: 'Ω', decimals: 2 },
    ],
    calculate: ({ type, R, C, L }) => {
      const Rv = Number(R), Cv = Number(C) * 1e-9, Lv = Number(L) * 1e-3
      let fc = 0, Q = 0
      if (type === 'RC') { fc = 1 / (2 * Math.PI * Rv * Cv); Q = 0.5 }
      else if (type === 'RL') { fc = Rv / (2 * Math.PI * Lv); Q = 0.5 }
      else { fc = 1 / (2 * Math.PI * Math.sqrt(Lv * Cv)); Q = (1 / Rv) * Math.sqrt(Lv / Cv) }
      const Z_C = fc > 0 ? 1 / (2 * Math.PI * fc * Cv) : 0
      return { fc, fc_kHz: fc / 1000, Q, Z_C }
    },
  },

  // ── Antenna Length ─────────────────────────────────────────
  'antenna-length': {
    slug: 'antenna-length',
    name: 'Antenna Length Calculator',
    icon: '📡',
    description: 'Calculate half-wave dipole, quarter-wave monopole and Yagi element lengths for a given frequency.',
    formula: 'Half-wave: L = 142.5×VF/f  |  Quarter-wave: L = 75×VF/f  |  [m, f in MHz]',
    inputs: [
      { id: 'f_MHz', label: 'Frequency', unit: 'MHz', type: 'number', default: 144, min: 0.1, step: 0.1 },
      { id: 'vf', label: 'Velocity Factor', unit: '', type: 'number', default: 0.95, step: 0.01, placeholder: 'Free space=1.0, Wire≈0.95' },
    ],
    outputs: [
      { id: 'lambda', label: 'Wavelength (λ)', unit: 'm', decimals: 3 },
      { id: 'L_half', label: 'Half-Wave Dipole Length', unit: 'm', decimals: 3 },
      { id: 'L_quarter', label: 'Quarter-Wave Monopole', unit: 'm', decimals: 3 },
      { id: 'L_driven', label: 'Yagi Driven Element', unit: 'm', decimals: 3 },
      { id: 'L_reflector', label: 'Yagi Reflector', unit: 'm', decimals: 3 },
    ],
    calculate: ({ f_MHz, vf }) => {
      const f = Number(f_MHz), vfv = Number(vf)
      const lambda = 300 / f
      const L_half = 142.5 * vfv / f
      const L_quarter = 75 * vfv / f
      const L_driven = 143 * vfv / f
      const L_reflector = 152 * vfv / f
      return { lambda, L_half, L_quarter, L_driven, L_reflector }
    },
  },

  // ── PCB Trace Width ────────────────────────────────────────
  'pcb-trace-width': {
    slug: 'pcb-trace-width',
    name: 'PCB Trace Width Calculator',
    icon: '🔲',
    description: 'Calculate minimum PCB trace width for a given current per IPC-2221 standard.',
    formula: 'A = (I/(k·ΔT^0.44))^(1/0.725) mil²  |  W = A/(T_oz×1.378) mils',
    reference: 'IPC-2221A',
    inputs: [
      { id: 'I', label: 'Current', unit: 'A', type: 'number', default: 2, min: 0.1, step: 0.1 },
      { id: 'dT', label: 'Temperature Rise (ΔT)', unit: '°C', type: 'number', default: 10, min: 1, step: 1 },
      { id: 'T_oz', label: 'Copper Weight', unit: 'oz/ft²', type: 'number', default: 1, min: 0.5, step: 0.5 },
      { id: 'layer', label: 'Layer', type: 'select', default: 'external', options: [
        { label: 'External (outer layers)', value: 'external' },
        { label: 'Internal (inner layers)', value: 'internal' },
      ]},
    ],
    outputs: [
      { id: 'W_mils', label: 'Min Trace Width', unit: 'mils', decimals: 1 },
      { id: 'W_mm', label: 'Min Trace Width', unit: 'mm', decimals: 3 },
      { id: 'A_mil2', label: 'Required Area', unit: 'mil²', decimals: 1 },
      { id: 'thickness_um', label: 'Copper Thickness', unit: 'μm', decimals: 0 },
    ],
    calculate: ({ I, dT, T_oz, layer }) => {
      const k = layer === 'external' ? 0.048 : 0.024
      const A_mil2 = Math.pow(Number(I) / (k * Math.pow(Number(dT), 0.44)), 1 / 0.725)
      const thickness_um = Number(T_oz) * 35
      const W_mils = A_mil2 / (Number(T_oz) * 1.378)
      return { W_mils, W_mm: W_mils * 0.0254, A_mil2, thickness_um }
    },
  },

  // ── dB / Signal Loss ───────────────────────────────────────
  'db-signal-loss': {
    slug: 'db-signal-loss',
    name: 'dB / Signal Loss Calculator',
    icon: '📶',
    description: 'Calculate power/voltage ratios in dB, free-space path loss and link budget.',
    formula: 'dB = 10·log₁₀(P₂/P₁) = 20·log₁₀(V₂/V₁)  |  FSPL = 20·log(d_km) + 20·log(f_MHz) + 32.44',
    inputs: [
      { id: 'ratio', label: 'Power Ratio (P₂/P₁)', unit: '', type: 'number', default: 2, min: 0.001, step: 0.1 },
      { id: 'f_MHz', label: 'Frequency (for FSPL)', unit: 'MHz', type: 'number', default: 2400, min: 1 },
      { id: 'd_km', label: 'Distance (for FSPL)', unit: 'km', type: 'number', default: 1, min: 0.001, step: 0.1 },
    ],
    outputs: [
      { id: 'dB_power', label: 'Power Ratio', unit: 'dB', decimals: 2 },
      { id: 'dB_voltage', label: 'Voltage Ratio', unit: 'dBV', decimals: 2 },
      { id: 'FSPL', label: 'Free-Space Path Loss', unit: 'dB', decimals: 1 },
      { id: 'linear_power', label: 'Power Ratio (linear)', unit: '×', decimals: 4 },
    ],
    calculate: ({ ratio, f_MHz, d_km }) => {
      const r = Number(ratio)
      const dB_power = 10 * Math.log10(r)
      const dB_voltage = 20 * Math.log10(Math.sqrt(r))
      const FSPL = 20 * Math.log10(Number(d_km)) + 20 * Math.log10(Number(f_MHz)) + 32.44
      return { dB_power, dB_voltage, FSPL, linear_power: r }
    },
  },

  // ── Op-Amp Gain ────────────────────────────────────────────
  'op-amp-gain': {
    slug: 'op-amp-gain',
    name: 'Op-Amp Gain Calculator',
    icon: '🔌',
    description: 'Calculate voltage gain, output voltage and bandwidth for inverting and non-inverting op-amp configurations.',
    formula: 'Inverting: Av = −Rf/Rin  |  Non-inverting: Av = 1 + Rf/R₁  |  BW = GBP/|Av|',
    inputs: [
      { id: 'config', label: 'Configuration', type: 'select', default: 'noninv', options: [
        { label: 'Non-Inverting', value: 'noninv' },
        { label: 'Inverting', value: 'inv' },
        { label: 'Differential', value: 'diff' },
      ]},
      { id: 'Rf', label: 'Feedback Resistor (Rf)', unit: 'kΩ', type: 'number', default: 100, min: 0.1 },
      { id: 'Rin', label: 'Input Resistor (Rin / R₁)', unit: 'kΩ', type: 'number', default: 10, min: 0.1 },
      { id: 'Vin', label: 'Input Voltage', unit: 'V', type: 'number', default: 0.1 },
      { id: 'GBP', label: 'Gain-Bandwidth Product', unit: 'MHz', type: 'number', default: 1, min: 0.001 },
    ],
    outputs: [
      { id: 'Av', label: 'Voltage Gain (|Av|)', unit: 'V/V', decimals: 2 },
      { id: 'Av_dB', label: 'Gain', unit: 'dB', decimals: 1 },
      { id: 'Vout', label: 'Output Voltage', unit: 'V', decimals: 4 },
      { id: 'BW_kHz', label: 'Bandwidth (−3dB)', unit: 'kHz', decimals: 1 },
    ],
    calculate: ({ config, Rf, Rin, Vin, GBP }) => {
      const rfv = Number(Rf), rinv = Number(Rin)
      let Av = 0
      if (config === 'noninv') Av = 1 + rfv / rinv
      else if (config === 'inv') Av = -(rfv / rinv)
      else Av = rfv / rinv
      const Av_abs = Math.abs(Av)
      const Av_dB = 20 * Math.log10(Av_abs)
      const BW_kHz = Number(GBP) * 1000 / Av_abs
      return { Av: Av_abs, Av_dB, Vout: Number(Vin) * Av, BW_kHz }
    },
  },

  // ── Capacitor Charge Time ──────────────────────────────────
  'capacitor-charge-time': {
    slug: 'capacitor-charge-time',
    name: 'Capacitor Charge Time Calculator',
    icon: '⚡',
    description: 'Calculate RC time constant, voltage at any time and time to reach a target voltage during charge/discharge.',
    formula: 'τ = R·C  |  V(t) = Vs·(1−e^(−t/τ))  |  t = −τ·ln(1−V/Vs)',
    inputs: [
      { id: 'R', label: 'Resistance (R)', unit: 'kΩ', type: 'number', default: 10, min: 0.001 },
      { id: 'C', label: 'Capacitance (C)', unit: 'μF', type: 'number', default: 100, min: 0.001 },
      { id: 'Vs', label: 'Supply Voltage (Vs)', unit: 'V', type: 'number', default: 12, min: 0.1 },
      { id: 'V_target', label: 'Target Voltage', unit: 'V', type: 'number', default: 10, min: 0 },
    ],
    outputs: [
      { id: 'tau', label: 'Time Constant (τ)', unit: 's', decimals: 4 },
      { id: 't_63', label: 'Time to 63.2% (1τ)', unit: 's', decimals: 4 },
      { id: 't_95', label: 'Time to 95.0% (3τ)', unit: 's', decimals: 4 },
      { id: 't_target', label: 'Time to Target Voltage', unit: 's', decimals: 4 },
      { id: 'V_at_1tau', label: 'Voltage at 1τ', unit: 'V', decimals: 3 },
    ],
    calculate: ({ R, C, Vs, V_target }) => {
      const tau = Number(R) * 1000 * Number(C) * 1e-6
      const Vsv = Number(Vs)
      const t_target = Number(V_target) < Vsv ? -tau * Math.log(1 - Number(V_target) / Vsv) : 0
      return { tau, t_63: tau, t_95: 3 * tau, t_target, V_at_1tau: Vsv * (1 - Math.exp(-1)) }
    },
  },

  // ── Zener Voltage Regulator ────────────────────────────────
  'zener-voltage-regulator': {
    slug: 'zener-voltage-regulator',
    name: 'Zener Voltage Regulator',
    icon: '⚡',
    description: 'Design a Zener diode voltage regulator: calculate series resistor and power dissipation.',
    formula: 'Rs = (Vin − Vz) / (Iz + Iload)  |  Pz = Vz × Iz ≤ Pz,max',
    inputs: [
      { id: 'Vin', label: 'Input Voltage (Vin)', unit: 'V', type: 'number', default: 12, min: 0.1 },
      { id: 'Vz', label: 'Zener Voltage (Vz)', unit: 'V', type: 'number', default: 5.1, min: 1, step: 0.1 },
      { id: 'Iz', label: 'Zener Test Current (Iz)', unit: 'mA', type: 'number', default: 10, min: 0.1 },
      { id: 'Iload', label: 'Load Current (Iload)', unit: 'mA', type: 'number', default: 50, min: 0 },
      { id: 'Pz_max', label: 'Max Zener Power Rating', unit: 'mW', type: 'number', default: 500, min: 100 },
    ],
    outputs: [
      { id: 'Rs', label: 'Series Resistor (Rs)', unit: 'Ω', decimals: 1 },
      { id: 'Pz', label: 'Zener Power Dissipation', unit: 'mW', decimals: 1 },
      { id: 'Ps', label: 'Series Resistor Power', unit: 'mW', decimals: 1 },
      { id: 'safe', label: 'Safe (1=yes, 0=overloaded)', unit: '', decimals: 0 },
    ],
    calculate: ({ Vin, Vz, Iz, Iload, Pz_max }) => {
      const I_total_A = (Number(Iz) + Number(Iload)) / 1000
      const Rs = (Number(Vin) - Number(Vz)) / I_total_A
      const Pz = Number(Vz) * Number(Iz)
      const Ps = (Number(Vin) - Number(Vz)) * I_total_A * 1000
      return { Rs, Pz, Ps, safe: Pz <= Number(Pz_max) ? 1 : 0 }
    },
  },

  // ══════════════════════════════════════════════════════════
  // SECTION 8 — AEROSPACE & AUTOMOTIVE
  // ══════════════════════════════════════════════════════════

  // ── Thrust-to-Weight Ratio ─────────────────────────────────
  'thrust-to-weight': {
    slug: 'thrust-to-weight',
    name: 'Thrust-to-Weight Ratio',
    icon: '✈️',
    description: 'Calculate thrust-to-weight ratio, rate of climb and approximate takeoff ground roll for aircraft.',
    formula: 'T/W = Thrust/(m·g)  |  RC = V·(T−D)/W  |  s = V_LO²/(2·g·(T/W−μ))',
    reference: 'FAR 25, AIAA Aircraft Design',
    inputs: [
      { id: 'thrust', label: 'Total Thrust (T)', unit: 'kN', type: 'number', default: 200, min: 0.1 },
      { id: 'mass', label: 'Gross Mass (m)', unit: 'kg', type: 'number', default: 50000, min: 1 },
      { id: 'drag', label: 'Cruise Drag (D)', unit: 'kN', type: 'number', default: 60, min: 0 },
      { id: 'V_cruise', label: 'Cruise Speed (V)', unit: 'm/s', type: 'number', default: 240, min: 10 },
      { id: 'mu_roll', label: 'Rolling Friction (μ)', unit: '', type: 'number', default: 0.02, step: 0.005 },
      { id: 'V_LO', label: 'Liftoff Speed (V_LO)', unit: 'm/s', type: 'number', default: 85, min: 10 },
    ],
    outputs: [
      { id: 'TW', label: 'Thrust-to-Weight Ratio (T/W)', unit: '', decimals: 3 },
      { id: 'W_kN', label: 'Aircraft Weight', unit: 'kN', decimals: 1 },
      { id: 'RC', label: 'Rate of Climb', unit: 'm/s', decimals: 2 },
      { id: 's_TO', label: 'Takeoff Distance (approx.)', unit: 'm', decimals: 0 },
    ],
    calculate: ({ thrust, mass, drag, V_cruise, mu_roll, V_LO }) => {
      const g = 9.81, W_kN = Number(mass) * g / 1000
      const TW = Number(thrust) / W_kN
      const RC = Number(V_cruise) * (Number(thrust) - Number(drag)) / W_kN
      const a = g * (TW - Number(mu_roll))
      const s_TO = a > 0 ? Number(V_LO) ** 2 / (2 * a) : 0
      return { TW, W_kN, RC, s_TO }
    },
  },

  // ── Drag Coefficient ───────────────────────────────────────
  'drag-coefficient': {
    slug: 'drag-coefficient',
    name: 'Aerodynamic Drag Calculator',
    icon: '💨',
    description: 'Calculate aerodynamic drag force, drag power and induced drag coefficient for wings.',
    formula: 'F_D = 0.5·ρ·v²·CD·A  |  CDi = CL²/(π·e·AR)  |  P_drag = F_D·v',
    reference: 'Anderson, Introduction to Flight',
    inputs: [
      { id: 'rho', label: 'Air Density (ρ)', unit: 'kg/m³', type: 'number', default: 1.225, step: 0.001, placeholder: 'Sea level=1.225' },
      { id: 'v', label: 'Velocity (v)', unit: 'm/s', type: 'number', default: 60, min: 1 },
      { id: 'CD', label: 'Drag Coefficient (CD)', unit: '', type: 'number', default: 0.3, step: 0.01, placeholder: 'Car≈0.3, Sphere≈0.47' },
      { id: 'A', label: 'Reference Area (A)', unit: 'm²', type: 'number', default: 2.0, min: 0.01 },
      { id: 'CL', label: 'Lift Coefficient (CL)', unit: '', type: 'number', default: 0.5, step: 0.01 },
      { id: 'AR', label: 'Aspect Ratio (AR)', unit: '', type: 'number', default: 8, min: 1 },
      { id: 'e_oswald', label: 'Oswald Efficiency (e)', unit: '', type: 'number', default: 0.8, step: 0.01 },
    ],
    outputs: [
      { id: 'q', label: 'Dynamic Pressure', unit: 'Pa', decimals: 1 },
      { id: 'F_D', label: 'Drag Force', unit: 'N', decimals: 1 },
      { id: 'P_drag', label: 'Power to Overcome Drag', unit: 'kW', decimals: 2 },
      { id: 'CDi', label: 'Induced Drag Coefficient', unit: '', decimals: 4 },
    ],
    calculate: ({ rho, v, CD, A, CL, AR, e_oswald }) => {
      const q = 0.5 * Number(rho) * Number(v) ** 2
      const F_D = q * Number(CD) * Number(A)
      const P_drag = F_D * Number(v) / 1000
      const CDi = Number(CL) ** 2 / (Math.PI * Number(e_oswald) * Number(AR))
      return { q, F_D, P_drag, CDi }
    },
  },

  // ── Wing Loading ───────────────────────────────────────────
  'wing-loading': {
    slug: 'wing-loading',
    name: 'Wing Loading & Lift Calculator',
    icon: '✈️',
    description: 'Calculate wing loading, stall speed, lift force and lift-to-drag ratio for fixed-wing aircraft.',
    formula: 'W/S = W/A_wing  |  V_stall = √(2W/(ρ·CLmax·S))  |  L = 0.5·ρ·v²·CL·S  |  L/D = CL/CD',
    reference: 'FAR 23, Raymer Aircraft Design',
    inputs: [
      { id: 'W', label: 'Aircraft Weight (W)', unit: 'kN', type: 'number', default: 50, min: 0.1 },
      { id: 'S', label: 'Wing Area (S)', unit: 'm²', type: 'number', default: 20, min: 0.5 },
      { id: 'CLmax', label: 'Max Lift Coefficient (CLmax)', unit: '', type: 'number', default: 1.8, step: 0.1 },
      { id: 'CL', label: 'Cruise Lift Coefficient (CL)', unit: '', type: 'number', default: 0.5, step: 0.05 },
      { id: 'CD', label: 'Cruise Drag Coefficient (CD)', unit: '', type: 'number', default: 0.03, step: 0.005 },
      { id: 'rho', label: 'Air Density (ρ)', unit: 'kg/m³', type: 'number', default: 1.225, step: 0.001 },
      { id: 'v', label: 'Cruise Speed (v)', unit: 'm/s', type: 'number', default: 70, min: 10 },
    ],
    outputs: [
      { id: 'WS', label: 'Wing Loading (W/S)', unit: 'N/m²', decimals: 1 },
      { id: 'V_stall', label: 'Stall Speed', unit: 'm/s', decimals: 2 },
      { id: 'L', label: 'Lift Force at Cruise', unit: 'kN', decimals: 2 },
      { id: 'LD', label: 'Lift-to-Drag Ratio (L/D)', unit: '', decimals: 2 },
    ],
    calculate: ({ W, S, CLmax, CL, CD, rho, v }) => {
      const Wv = Number(W) * 1000, Sv = Number(S)
      const WS = Wv / Sv
      const V_stall = Math.sqrt(2 * Wv / (Number(rho) * Number(CLmax) * Sv))
      const q = 0.5 * Number(rho) * Number(v) ** 2
      const L = q * Number(CL) * Sv / 1000
      const LD = Number(CL) / Number(CD)
      return { WS, V_stall, L, LD }
    },
  },

  // ── Fuel Economy ───────────────────────────────────────────
  'fuel-economy': {
    slug: 'fuel-economy',
    name: 'Fuel Economy Calculator',
    icon: '⛽',
    description: 'Convert between fuel economy units and estimate annual fuel cost and CO₂ emissions.',
    formula: 'mpg(US) = 235.2/(L/100km)  |  CO₂ = FC×EF×10 g/km  |  Annual cost = FC×distance×price/100',
    inputs: [
      { id: 'fc_L100km', label: 'Fuel Consumption', unit: 'L/100km', type: 'number', default: 8, min: 0.5, step: 0.1 },
      { id: 'fuel_type', label: 'Fuel Type', type: 'select', default: 'petrol', options: [
        { label: 'Petrol (Gasoline)', value: 'petrol' },
        { label: 'Diesel', value: 'diesel' },
        { label: 'LPG', value: 'lpg' },
      ]},
      { id: 'distance', label: 'Annual Distance', unit: 'km/yr', type: 'number', default: 15000, min: 100 },
      { id: 'fuel_price', label: 'Fuel Price', unit: '$/L', type: 'number', default: 1.5, min: 0.1, step: 0.05 },
    ],
    outputs: [
      { id: 'mpg_US', label: 'Fuel Economy', unit: 'mpg (US)', decimals: 1 },
      { id: 'mpg_UK', label: 'Fuel Economy', unit: 'mpg (UK)', decimals: 1 },
      { id: 'CO2_gkm', label: 'CO₂ Emissions', unit: 'g/km', decimals: 0 },
      { id: 'annual_L', label: 'Annual Fuel Volume', unit: 'L/yr', decimals: 0 },
      { id: 'annual_fuel', label: 'Annual Fuel Cost', unit: '$/yr', decimals: 0 },
    ],
    calculate: ({ fc_L100km, fuel_type, distance, fuel_price }) => {
      const fc = Number(fc_L100km)
      const mpg_US = 235.2 / fc
      const mpg_UK = 282.5 / fc
      const ef: Record<string, number> = { petrol: 2.31, diesel: 2.68, lpg: 1.51 }
      const CO2_gkm = fc * (ef[String(fuel_type)] ?? 2.31) * 10
      const annual_L = fc * Number(distance) / 100
      return { mpg_US, mpg_UK, CO2_gkm, annual_L, annual_fuel: annual_L * Number(fuel_price) }
    },
  },

  // ── Engine Horsepower ──────────────────────────────────────
  'engine-horsepower': {
    slug: 'engine-horsepower',
    name: 'Engine Horsepower Calculator',
    icon: '🏎️',
    description: 'Calculate engine power from torque and RPM, brake mean effective pressure (BMEP) and specific power.',
    formula: 'P_kW = T·n/9550  |  P_hp = T_lbft·n/5252  |  BMEP = P×60/(n·V_d/2) [4-stroke]',
    inputs: [
      { id: 'T_Nm', label: 'Torque', unit: 'Nm', type: 'number', default: 400, min: 0.1 },
      { id: 'n_rpm', label: 'Engine Speed', unit: 'RPM', type: 'number', default: 4000, min: 100 },
      { id: 'V_disp', label: 'Engine Displacement', unit: 'L', type: 'number', default: 2.0, min: 0.1, step: 0.1 },
    ],
    outputs: [
      { id: 'P_kW', label: 'Power', unit: 'kW', decimals: 1 },
      { id: 'P_hp', label: 'Power', unit: 'hp', decimals: 1 },
      { id: 'BMEP', label: 'Brake Mean Effective Pressure', unit: 'bar', decimals: 2 },
      { id: 'specific_power', label: 'Specific Power', unit: 'kW/L', decimals: 1 },
    ],
    calculate: ({ T_Nm, n_rpm, V_disp }) => {
      const T = Number(T_Nm), n = Number(n_rpm)
      const P_kW = T * n / 9550
      const P_hp = P_kW * 1.341
      const V_m3 = Number(V_disp) * 1e-3
      const BMEP = P_kW * 1000 * 60 / ((n / 2) * V_m3) / 1e5
      return { P_kW, P_hp, BMEP, specific_power: P_kW / Number(V_disp) }
    },
  },

  // ── Mach Number ────────────────────────────────────────────
  'mach-number': {
    slug: 'mach-number',
    name: 'Mach Number Calculator',
    icon: '✈️',
    description: 'Calculate Mach number and speed of sound at altitude using ISA standard atmosphere model.',
    formula: 'M = v/a  |  a = √(γ·R·T_K) ≈ 20.05·√T_K  |  T_K = 288.15 − 0.0065·h (troposphere)',
    reference: 'ICAO Standard Atmosphere, ISA',
    inputs: [
      { id: 'v', label: 'True Airspeed (v)', unit: 'm/s', type: 'number', default: 250, min: 0.1 },
      { id: 'altitude', label: 'Altitude', unit: 'm', type: 'number', default: 10000, min: 0 },
    ],
    outputs: [
      { id: 'T_K', label: 'ISA Temperature', unit: 'K', decimals: 1 },
      { id: 'a', label: 'Speed of Sound', unit: 'm/s', decimals: 1 },
      { id: 'M', label: 'Mach Number', unit: '', decimals: 3 },
      { id: 'rho', label: 'Air Density', unit: 'kg/m³', decimals: 4 },
      { id: 'regime', label: 'Regime (1=Subsonic, 2=Transonic, 3=Supersonic)', unit: '', decimals: 0 },
    ],
    calculate: ({ v, altitude }) => {
      const h = Math.min(Number(altitude), 11000)
      const T0 = 288.15, L = 0.0065, R_air = 287.05, gamma = 1.4, g_val = 9.81
      const T_K = T0 - L * h
      const a = Math.sqrt(gamma * R_air * T_K)
      const rho = 1.225 * Math.pow(T_K / T0, g_val / (L * R_air) - 1)
      const M = Number(v) / a
      return { T_K, a, M, rho, regime: M < 0.8 ? 1 : M < 1.2 ? 2 : 3 }
    },
  },

  // ══════════════════════════════════════════════════════════
  // SECTION 9 — SOFTWARE & IT ENGINEERING
  // ══════════════════════════════════════════════════════════

  // ── Server Rack Power & Cooling ────────────────────────────
  'server-rack-power': {
    slug: 'server-rack-power',
    name: 'Server Rack Power & Cooling',
    icon: '🖥️',
    description: 'Calculate total IT load, PUE, cooling capacity and annual energy cost for a data centre.',
    formula: 'PUE = P_total/P_IT  |  P_cooling = (PUE−1)×P_IT  |  Annual = P_total×8760×tariff',
    reference: 'The Green Grid, ASHRAE TC 9.9',
    inputs: [
      { id: 'P_servers', label: 'Server Load', unit: 'kW', type: 'number', default: 50, min: 0.1 },
      { id: 'P_network', label: 'Network Equipment', unit: 'kW', type: 'number', default: 5, min: 0 },
      { id: 'P_storage', label: 'Storage Systems', unit: 'kW', type: 'number', default: 5, min: 0 },
      { id: 'PUE', label: 'Power Usage Effectiveness (PUE)', unit: '', type: 'number', default: 1.5, min: 1.0, step: 0.05 },
      { id: 'tariff', label: 'Electricity Tariff', unit: '$/kWh', type: 'number', default: 0.10, step: 0.01 },
    ],
    outputs: [
      { id: 'P_IT', label: 'Total IT Load', unit: 'kW', decimals: 1 },
      { id: 'P_cooling', label: 'Cooling Load', unit: 'kW', decimals: 1 },
      { id: 'P_total', label: 'Total Facility Power', unit: 'kW', decimals: 1 },
      { id: 'BTU_hr', label: 'Heat Dissipation', unit: 'BTU/hr', decimals: 0 },
      { id: 'annual_cost', label: 'Annual Energy Cost', unit: '$/yr', decimals: 0 },
    ],
    calculate: ({ P_servers, P_network, P_storage, PUE, tariff }) => {
      const P_IT = Number(P_servers) + Number(P_network) + Number(P_storage)
      const P_total = P_IT * Number(PUE)
      const P_cooling = P_total - P_IT
      return { P_IT, P_cooling, P_total, BTU_hr: P_total * 3412, annual_cost: P_total * 8760 * Number(tariff) }
    },
  },

  // ── Network Bandwidth ──────────────────────────────────────
  'network-bandwidth': {
    slug: 'network-bandwidth',
    name: 'Network Bandwidth Calculator',
    icon: '🌐',
    description: 'Calculate link utilisation, bandwidth-delay product and Shannon theoretical channel capacity.',
    formula: 'U = Actual/Capacity×100%  |  BDP = BW×RTT  |  C_Shannon = B·log₂(1+S/N)',
    inputs: [
      { id: 'bandwidth_Mbps', label: 'Link Bandwidth', unit: 'Mbps', type: 'number', default: 1000, min: 0.1 },
      { id: 'actual_Mbps', label: 'Actual Throughput', unit: 'Mbps', type: 'number', default: 650, min: 0 },
      { id: 'RTT_ms', label: 'Round-Trip Time (RTT)', unit: 'ms', type: 'number', default: 20, min: 0.1 },
      { id: 'SNR_dB', label: 'Signal-to-Noise Ratio (S/N)', unit: 'dB', type: 'number', default: 30, min: 0 },
      { id: 'B_MHz', label: 'Channel Bandwidth (Shannon)', unit: 'MHz', type: 'number', default: 20, min: 0.01 },
    ],
    outputs: [
      { id: 'utilisation', label: 'Link Utilisation', unit: '%', decimals: 1 },
      { id: 'BDP_Mb', label: 'Bandwidth-Delay Product', unit: 'Mbit', decimals: 3 },
      { id: 'Shannon_Mbps', label: 'Shannon Capacity', unit: 'Mbps', decimals: 1 },
      { id: 'latency_1MB', label: 'Time to Transfer 1 MB', unit: 'ms', decimals: 1 },
    ],
    calculate: ({ bandwidth_Mbps, actual_Mbps, RTT_ms, SNR_dB, B_MHz }) => {
      const utilisation = Number(actual_Mbps) / Number(bandwidth_Mbps) * 100
      const BDP_Mb = Number(bandwidth_Mbps) * (Number(RTT_ms) / 1000)
      const SNR_linear = Math.pow(10, Number(SNR_dB) / 10)
      const Shannon_Mbps = Number(B_MHz) * Math.log2(1 + SNR_linear)
      const eff = Number(actual_Mbps) > 0 ? Number(actual_Mbps) : Number(bandwidth_Mbps)
      return { utilisation, BDP_Mb, Shannon_Mbps, latency_1MB: 8 / eff * 1000 }
    },
  },

  // ── API Load / RPS ─────────────────────────────────────────
  'api-load-rps': {
    slug: 'api-load-rps',
    name: 'API Load / RPS Planner',
    icon: '⚡',
    description: 'Estimate required servers, CPU cores and concurrency for a target API request rate using Little\'s Law.',
    formula: 'N_concurrent = λ×W  |  N_servers = ceil(N_concurrent/concurrency)  |  N_cores = ceil(RPS×CPU_s)',
    inputs: [
      { id: 'RPS', label: 'Target Requests per Second', unit: 'RPS', type: 'number', default: 500, min: 1 },
      { id: 'RT_ms', label: 'Avg Response Time', unit: 'ms', type: 'number', default: 200, min: 1 },
      { id: 'CPU_ms', label: 'CPU Time per Request', unit: 'ms', type: 'number', default: 50, min: 0.1 },
      { id: 'concurrency', label: 'Concurrency per Server', unit: '', type: 'number', default: 100, min: 1 },
      { id: 'cores_per', label: 'Cores per Server', unit: '', type: 'number', default: 8, min: 1, step: 1 },
    ],
    outputs: [
      { id: 'N_concurrent', label: 'Concurrent Requests (Little\'s Law)', unit: '', decimals: 0 },
      { id: 'N_servers', label: 'Servers Required', unit: '', decimals: 0 },
      { id: 'N_cores', label: 'CPU Cores Needed', unit: '', decimals: 0 },
      { id: 'CPU_util', label: 'CPU Utilisation per Server', unit: '%', decimals: 1 },
    ],
    calculate: ({ RPS, RT_ms, CPU_ms, concurrency, cores_per }) => {
      const N_concurrent = Math.ceil(Number(RPS) * (Number(RT_ms) / 1000))
      const N_servers = Math.ceil(N_concurrent / Number(concurrency))
      const cpu_total = Number(RPS) * (Number(CPU_ms) / 1000)
      const N_cores = Math.ceil(cpu_total)
      const CPU_util = (cpu_total / (N_servers * Number(cores_per))) * 100
      return { N_concurrent, N_servers, N_cores, CPU_util }
    },
  },

  // ── Database Storage ───────────────────────────────────────
  'database-storage': {
    slug: 'database-storage',
    name: 'Database Storage Estimator',
    icon: '🗄️',
    description: 'Estimate database storage requirements including indexes, growth and backup storage.',
    formula: 'Storage = rows×bytes_per_row  |  With indexes ≈ ×(1+index%)  |  Future = current×(1+g)^n',
    inputs: [
      { id: 'rows_M', label: 'Number of Rows', unit: 'million', type: 'number', default: 100, min: 0.001, step: 1 },
      { id: 'bytes_per_row', label: 'Average Row Size', unit: 'bytes', type: 'number', default: 500, min: 10 },
      { id: 'growth_pct', label: 'Annual Data Growth', unit: '%/yr', type: 'number', default: 30, min: 0, step: 5 },
      { id: 'years', label: 'Planning Horizon', unit: 'years', type: 'number', default: 3, min: 1, step: 1 },
      { id: 'index_pct', label: 'Index Overhead', unit: '%', type: 'number', default: 40, min: 0, step: 5 },
      { id: 'compression', label: 'Compression Ratio', unit: '×', type: 'number', default: 2, min: 1, step: 0.5 },
    ],
    outputs: [
      { id: 'raw_GB', label: 'Raw Table Size (today)', unit: 'GB', decimals: 1 },
      { id: 'with_index_GB', label: 'With Indexes', unit: 'GB', decimals: 1 },
      { id: 'compressed_GB', label: 'Compressed Size', unit: 'GB', decimals: 1 },
      { id: 'future_GB', label: 'Projected Size (at horizon)', unit: 'GB', decimals: 1 },
      { id: 'backup_GB', label: 'Backup Storage (3 copies)', unit: 'GB', decimals: 0 },
    ],
    calculate: ({ rows_M, bytes_per_row, growth_pct, years, index_pct, compression }) => {
      const raw_GB = Number(rows_M) * 1e6 * Number(bytes_per_row) / 1e9
      const with_index_GB = raw_GB * (1 + Number(index_pct) / 100)
      const compressed_GB = with_index_GB / Number(compression)
      const future_GB = compressed_GB * Math.pow(1 + Number(growth_pct) / 100, Number(years))
      return { raw_GB, with_index_GB, compressed_GB, future_GB, backup_GB: future_GB * 3 }
    },
  },

  // ── CVSS Risk Calculator ───────────────────────────────────
  'cvss-risk-calculator': {
    slug: 'cvss-risk-calculator',
    name: 'CVSS v3.1 Risk Calculator',
    icon: '🔐',
    description: 'Calculate CVSS v3.1 base score for vulnerability severity assessment (unchanged scope).',
    formula: 'ISS = 1−(1−C)(1−I)(1−A)  |  ES = 8.22×AV×AC×PR×UI  |  Score = Roundup(min(1,ISS+ES)×10)',
    reference: 'CVSS v3.1 Specification Document, FIRST.org',
    inputs: [
      { id: 'AV', label: 'Attack Vector (AV)', type: 'select', default: '0.85', options: [
        { label: 'Network (0.85)', value: '0.85' },
        { label: 'Adjacent (0.62)', value: '0.62' },
        { label: 'Local (0.55)', value: '0.55' },
        { label: 'Physical (0.20)', value: '0.20' },
      ]},
      { id: 'AC', label: 'Attack Complexity (AC)', type: 'select', default: '0.77', options: [
        { label: 'Low (0.77)', value: '0.77' },
        { label: 'High (0.44)', value: '0.44' },
      ]},
      { id: 'PR', label: 'Privileges Required (PR)', type: 'select', default: '0.85', options: [
        { label: 'None (0.85)', value: '0.85' },
        { label: 'Low (0.62)', value: '0.62' },
        { label: 'High (0.27)', value: '0.27' },
      ]},
      { id: 'UI', label: 'User Interaction (UI)', type: 'select', default: '0.85', options: [
        { label: 'None (0.85)', value: '0.85' },
        { label: 'Required (0.62)', value: '0.62' },
      ]},
      { id: 'IC', label: 'Confidentiality Impact', type: 'select', default: '0.56', options: [
        { label: 'High (0.56)', value: '0.56' },
        { label: 'Low (0.22)', value: '0.22' },
        { label: 'None (0.00)', value: '0.00' },
      ]},
      { id: 'II', label: 'Integrity Impact', type: 'select', default: '0.56', options: [
        { label: 'High (0.56)', value: '0.56' },
        { label: 'Low (0.22)', value: '0.22' },
        { label: 'None (0.00)', value: '0.00' },
      ]},
      { id: 'IA', label: 'Availability Impact', type: 'select', default: '0.56', options: [
        { label: 'High (0.56)', value: '0.56' },
        { label: 'Low (0.22)', value: '0.22' },
        { label: 'None (0.00)', value: '0.00' },
      ]},
    ],
    outputs: [
      { id: 'ISS', label: 'Impact Sub-Score (ISS)', unit: '', decimals: 3 },
      { id: 'ES', label: 'Exploitability Score (ES)', unit: '', decimals: 3 },
      { id: 'CVSS', label: 'CVSS Base Score', unit: '/10', decimals: 1 },
      { id: 'severity', label: 'Severity Code (1=Low 2=Med 3=High 4=Critical)', unit: '', decimals: 0 },
    ],
    calculate: ({ AV, AC, PR, UI, IC, II, IA }) => {
      const ISS = 1 - (1 - Number(IC)) * (1 - Number(II)) * (1 - Number(IA))
      const ES = 8.22 * Number(AV) * Number(AC) * Number(PR) * Number(UI)
      const raw = ISS < 0.1 ? 0 : 6.42 * ISS + ES * (1 - ISS)
      const CVSS = Math.ceil(Math.min(10, raw) * 10) / 10
      const severity = CVSS === 0 ? 0 : CVSS < 4 ? 1 : CVSS < 7 ? 2 : CVSS < 9 ? 3 : 4
      return { ISS, ES, CVSS, severity }
    },
  },

  // ── SaaS Pricing / LTV ─────────────────────────────────────
  'saas-pricing-ltv': {
    slug: 'saas-pricing-ltv',
    name: 'SaaS Pricing & LTV Calculator',
    icon: '💰',
    description: 'Calculate Customer Lifetime Value (LTV), payback period, MRR and ARR for SaaS businesses.',
    formula: 'LTV = ARPU×Margin/Churn  |  LTV/CAC ≥ 3 target  |  PBP = CAC/(ARPU×Margin)  |  ARR = MRR×12',
    inputs: [
      { id: 'ARPU', label: 'Avg Revenue Per User (ARPU)', unit: '$/mo', type: 'number', default: 99, min: 0.1 },
      { id: 'gross_margin', label: 'Gross Margin', unit: '%', type: 'number', default: 70, min: 1, step: 1 },
      { id: 'churn', label: 'Monthly Churn Rate', unit: '%/mo', type: 'number', default: 2, min: 0.1, step: 0.1 },
      { id: 'CAC', label: 'Customer Acquisition Cost (CAC)', unit: '$', type: 'number', default: 1500, min: 0 },
      { id: 'customers', label: 'Number of Customers', unit: '', type: 'number', default: 500, min: 1, step: 1 },
    ],
    outputs: [
      { id: 'LTV', label: 'Customer Lifetime Value (LTV)', unit: '$', decimals: 0 },
      { id: 'LTV_CAC', label: 'LTV/CAC Ratio', unit: '', decimals: 2 },
      { id: 'PBP_months', label: 'CAC Payback Period', unit: 'months', decimals: 1 },
      { id: 'MRR', label: 'Monthly Recurring Revenue', unit: '$', decimals: 0 },
      { id: 'ARR', label: 'Annual Recurring Revenue', unit: '$', decimals: 0 },
    ],
    calculate: ({ ARPU, gross_margin, churn, CAC, customers }) => {
      const gm = Number(gross_margin) / 100
      const ch = Number(churn) / 100
      const LTV = Number(ARPU) * gm / ch
      const LTV_CAC = LTV / Math.max(1, Number(CAC))
      const PBP_months = Number(CAC) / (Number(ARPU) * gm)
      const MRR = Number(ARPU) * Number(customers)
      return { LTV, LTV_CAC, PBP_months, MRR, ARR: MRR * 12 }
    },
  },

  // ── CI/CD Pipeline Cost ────────────────────────────────────
  'cicd-pipeline-cost': {
    slug: 'cicd-pipeline-cost',
    name: 'CI/CD Pipeline Cost Estimator',
    icon: '⚙️',
    description: 'Estimate monthly CI/CD build costs for GitHub Actions, CircleCI and similar platforms.',
    formula: 'Minutes = commits/day×30×build_time×pipelines  |  Cost = max(0, Minutes−free_tier)×rate',
    inputs: [
      { id: 'commits', label: 'Commits per Day', unit: '/day', type: 'number', default: 20, min: 1, step: 1 },
      { id: 'build_min', label: 'Avg Build Time', unit: 'min/build', type: 'number', default: 8, min: 0.5, step: 0.5 },
      { id: 'pipelines', label: 'Parallel Pipelines per Commit', unit: '', type: 'number', default: 3, min: 1, step: 1 },
      { id: 'free_tier', label: 'Free Tier Minutes/Month', unit: 'min', type: 'number', default: 2000, min: 0 },
      { id: 'rate', label: 'Per-Minute Rate', unit: '$/min', type: 'number', default: 0.008, step: 0.001, placeholder: 'GitHub Actions Linux≈$0.008' },
    ],
    outputs: [
      { id: 'monthly_min', label: 'Total Build Minutes/Month', unit: 'min', decimals: 0 },
      { id: 'billable_min', label: 'Billable Minutes', unit: 'min', decimals: 0 },
      { id: 'monthly_cost', label: 'Estimated Monthly Cost', unit: '$/mo', decimals: 2 },
      { id: 'annual_cost', label: 'Estimated Annual Cost', unit: '$/yr', decimals: 0 },
    ],
    calculate: ({ commits, build_min, pipelines, free_tier, rate }) => {
      const monthly_min = Number(commits) * 30 * Number(build_min) * Number(pipelines)
      const billable_min = Math.max(0, monthly_min - Number(free_tier))
      const monthly_cost = billable_min * Number(rate)
      return { monthly_min, billable_min, monthly_cost, annual_cost: monthly_cost * 12 }
    },
  },

  // ── Docker / K8s Resource Sizing ───────────────────────────
  'docker-k8s-sizing': {
    slug: 'docker-k8s-sizing',
    name: 'Docker / K8s Resource Sizing',
    icon: '🐳',
    description: 'Calculate Kubernetes pod CPU/memory requests & limits, and estimate cluster node count needed.',
    formula: 'CPU_req = avg×1.2  |  MEM_req = avg×1.3  |  Limit = req×2  |  Nodes = ceil(pods/pods_per_node)',
    inputs: [
      { id: 'avg_cpu', label: 'Avg CPU Usage per Pod', unit: 'mCPU', type: 'number', default: 200, min: 1 },
      { id: 'avg_mem', label: 'Avg Memory Usage per Pod', unit: 'MiB', type: 'number', default: 256, min: 1 },
      { id: 'n_pods', label: 'Number of Pods', unit: '', type: 'number', default: 20, min: 1, step: 1 },
      { id: 'node_cpu', label: 'Node vCPU Cores', unit: 'cores', type: 'number', default: 8, min: 1, step: 1 },
      { id: 'node_mem', label: 'Node Memory', unit: 'GiB', type: 'number', default: 32, min: 1 },
    ],
    outputs: [
      { id: 'cpu_request', label: 'CPU Request per Pod', unit: 'mCPU', decimals: 0 },
      { id: 'cpu_limit', label: 'CPU Limit per Pod', unit: 'mCPU', decimals: 0 },
      { id: 'mem_request', label: 'Memory Request per Pod', unit: 'MiB', decimals: 0 },
      { id: 'mem_limit', label: 'Memory Limit per Pod', unit: 'MiB', decimals: 0 },
      { id: 'nodes_needed', label: 'Nodes Required', unit: '', decimals: 0 },
    ],
    calculate: ({ avg_cpu, avg_mem, n_pods, node_cpu, node_mem }) => {
      const cpu_request = Math.ceil(Number(avg_cpu) * 1.2)
      const cpu_limit = Math.ceil(Number(avg_cpu) * 2.5)
      const mem_request = Math.ceil(Number(avg_mem) * 1.3)
      const mem_limit = Math.ceil(Number(avg_mem) * 2.0)
      const node_cpu_mCPU = Number(node_cpu) * 1000 * 0.9
      const node_mem_MiB = Number(node_mem) * 1024 * 0.9
      const pods_per_cpu = Math.floor(node_cpu_mCPU / cpu_request)
      const pods_per_mem = Math.floor(node_mem_MiB / mem_request)
      const pods_per_node = Math.max(1, Math.min(pods_per_cpu, pods_per_mem))
      return { cpu_request, cpu_limit, mem_request, mem_limit, nodes_needed: Math.ceil(Number(n_pods) / pods_per_node) }
    },
  },

  // ══════════════════════════════════════════════════════════
  // SECTION 10 — PROJECT & CONSTRUCTION MANAGEMENT
  // ══════════════════════════════════════════════════════════

  // ── Critical Path Method ───────────────────────────────────
  'critical-path-method': {
    slug: 'critical-path-method',
    name: 'Critical Path Method (CPM)',
    icon: '📅',
    description: 'Calculate early/late start-finish times, total float and identify critical path for a 5-activity network.',
    formula: 'ES_j = max(EF predecessors)  |  EF = ES+D  |  TF = LS−ES  |  Critical path: TF = 0',
    reference: 'PMBoK 7th Ed., CIOB Guide to Programme Management',
    inputs: [
      { id: 'D1', label: 'Activity A Duration', unit: 'days', type: 'number', default: 5, min: 0 },
      { id: 'D2', label: 'Activity B Duration (after A)', unit: 'days', type: 'number', default: 8, min: 0 },
      { id: 'D3', label: 'Activity C Duration (after A)', unit: 'days', type: 'number', default: 6, min: 0 },
      { id: 'D4', label: 'Activity D Duration (after B)', unit: 'days', type: 'number', default: 4, min: 0 },
      { id: 'D5', label: 'Activity E Duration (after B & C)', unit: 'days', type: 'number', default: 7, min: 0 },
    ],
    outputs: [
      { id: 'project_duration', label: 'Total Project Duration', unit: 'days', decimals: 0 },
      { id: 'critical_duration', label: 'Critical Path Duration', unit: 'days', decimals: 0 },
      { id: 'float_C', label: 'Float on Activity C', unit: 'days', decimals: 0 },
      { id: 'float_D', label: 'Float on Activity D', unit: 'days', decimals: 0 },
    ],
    calculate: ({ D1, D2, D3, D4, D5 }) => {
      const d1 = Number(D1), d2 = Number(D2), d3 = Number(D3), d4 = Number(D4), d5 = Number(D5)
      const EF_A = d1
      const EF_B = EF_A + d2
      const EF_C = EF_A + d3
      const EF_D = EF_B + d4
      const EF_E = Math.max(EF_B, EF_C) + d5
      const project_duration = Math.max(EF_D, EF_E)
      const LF_E = project_duration
      const LF_D = project_duration
      const LS_E = LF_E - d5
      const LS_D = LF_D - d4
      const LF_B = Math.min(LS_E, LS_D)
      const LF_C = LS_E
      const LS_C = LF_C - d3
      const float_C = Math.max(0, LS_C - EF_A)
      const float_D = Math.max(0, LS_D - EF_B)
      const critical_duration = EF_A + d2 + Math.max(d4, d5)
      return { project_duration, critical_duration, float_C, float_D }
    },
  },

  // ── BOQ / Material Take-off ────────────────────────────────
  'boq-material-takeoff': {
    slug: 'boq-material-takeoff',
    name: 'BOQ / Material Take-off Tool',
    icon: '📋',
    description: 'Calculate total material and labour cost from quantities and unit rates, including wastage factor.',
    formula: 'Q_order = Q_net×(1+wastage%)  |  Cost = Σ(Q_i×rate_i)  |  Labour = total_Q/productivity×rate',
    reference: 'CIOB, RICS New Rules of Measurement NRM2',
    inputs: [
      { id: 'Q1', label: 'Quantity 1 (e.g. concrete m³)', unit: 'units', type: 'number', default: 50, min: 0 },
      { id: 'rate1', label: 'Unit Rate 1', unit: '$/unit', type: 'number', default: 150, min: 0 },
      { id: 'Q2', label: 'Quantity 2 (e.g. rebar tonnes)', unit: 'units', type: 'number', default: 5, min: 0 },
      { id: 'rate2', label: 'Unit Rate 2', unit: '$/unit', type: 'number', default: 1200, min: 0 },
      { id: 'Q3', label: 'Quantity 3 (e.g. formwork m²)', unit: 'units', type: 'number', default: 200, min: 0 },
      { id: 'rate3', label: 'Unit Rate 3', unit: '$/unit', type: 'number', default: 25, min: 0 },
      { id: 'wastage', label: 'Wastage Factor', unit: '%', type: 'number', default: 5, min: 0, step: 1 },
      { id: 'labour_rate', label: 'Labour Rate', unit: '$/hr', type: 'number', default: 45, min: 0 },
      { id: 'productivity', label: 'Labour Productivity', unit: 'units/hr', type: 'number', default: 2, min: 0.01 },
    ],
    outputs: [
      { id: 'material_cost', label: 'Total Material Cost (incl. wastage)', unit: '$', decimals: 0 },
      { id: 'wastage_cost', label: 'Wastage Allowance', unit: '$', decimals: 0 },
      { id: 'labour_hrs', label: 'Labour Hours Required', unit: 'hrs', decimals: 1 },
      { id: 'labour_cost', label: 'Labour Cost', unit: '$', decimals: 0 },
      { id: 'total_cost', label: 'Total Direct Cost', unit: '$', decimals: 0 },
    ],
    calculate: ({ Q1, rate1, Q2, rate2, Q3, rate3, wastage, labour_rate, productivity }) => {
      const mat_base = Number(Q1) * Number(rate1) + Number(Q2) * Number(rate2) + Number(Q3) * Number(rate3)
      const wastage_cost = mat_base * Number(wastage) / 100
      const material_cost = mat_base + wastage_cost
      const total_Q = Number(Q1) + Number(Q2) + Number(Q3)
      const labour_hrs = total_Q / Number(productivity)
      const labour_cost = labour_hrs * Number(labour_rate)
      return { material_cost, wastage_cost, labour_hrs, labour_cost, total_cost: material_cost + labour_cost }
    },
  },

  // ── Project ROI ────────────────────────────────────────────
  'project-roi': {
    slug: 'project-roi',
    name: 'Project ROI Calculator',
    icon: '💹',
    description: 'Calculate NPV, approximate IRR, simple payback period and profitability index for project investment.',
    formula: 'NPV = Σ[CF/(1+r)^t] − C₀  |  PI = NPV/C₀ + 1  |  PBP = C₀/CF_annual',
    inputs: [
      { id: 'C0', label: 'Initial Investment (C₀)', unit: '$', type: 'number', default: 500000 },
      { id: 'CF_annual', label: 'Annual Net Cash Flow', unit: '$/yr', type: 'number', default: 120000 },
      { id: 'r', label: 'Discount Rate', unit: '%', type: 'number', default: 8, step: 0.5 },
      { id: 'life', label: 'Project Life', unit: 'years', type: 'number', default: 10, min: 1, step: 1 },
      { id: 'salvage', label: 'Salvage Value (end of life)', unit: '$', type: 'number', default: 50000, min: 0 },
    ],
    outputs: [
      { id: 'NPV', label: 'Net Present Value (NPV)', unit: '$', decimals: 0 },
      { id: 'PBP', label: 'Simple Payback Period', unit: 'years', decimals: 1 },
      { id: 'PI', label: 'Profitability Index (PI)', unit: '', decimals: 3 },
      { id: 'IRR_approx', label: 'Approx. IRR', unit: '%', decimals: 1 },
      { id: 'total_returns', label: 'Total Undiscounted Returns', unit: '$', decimals: 0 },
    ],
    calculate: ({ C0, CF_annual, r, life, salvage }) => {
      const disc = Number(r) / 100
      let NPV = -Number(C0)
      for (let t = 1; t <= Number(life); t++) NPV += Number(CF_annual) / Math.pow(1 + disc, t)
      NPV += Number(salvage) / Math.pow(1 + disc, Number(life))
      const PBP = Number(C0) / Number(CF_annual)
      const PI = NPV / Number(C0) + 1
      let lo = -0.5, hi = 5.0, IRR = 0
      for (let i = 0; i < 50; i++) {
        const mid = (lo + hi) / 2
        let npv_test = -Number(C0)
        for (let t = 1; t <= Number(life); t++) npv_test += Number(CF_annual) / Math.pow(1 + mid, t)
        npv_test += Number(salvage) / Math.pow(1 + mid, Number(life))
        if (npv_test > 0) lo = mid; else hi = mid
        IRR = mid
      }
      return { NPV, PBP, PI, IRR_approx: IRR * 100, total_returns: Number(CF_annual) * Number(life) + Number(salvage) }
    },
  },

  // ── Earned Value Management ────────────────────────────────
  'earned-value-management': {
    slug: 'earned-value-management',
    name: 'Earned Value Management (EVM)',
    icon: '📊',
    description: 'Calculate EVM metrics: SPI, CPI, EAC, ETC and VAC for project performance tracking.',
    formula: 'SV = EV−PV  |  CV = EV−AC  |  SPI = EV/PV  |  CPI = EV/AC  |  EAC = BAC/CPI',
    reference: 'PMBoK 7th Ed., ANSI EIA-748',
    inputs: [
      { id: 'BAC', label: 'Budget at Completion (BAC)', unit: '$', type: 'number', default: 1000000 },
      { id: 'pct_planned', label: '% Work Planned Complete', unit: '%', type: 'number', default: 60, min: 0, step: 1 },
      { id: 'pct_actual', label: '% Work Actually Complete', unit: '%', type: 'number', default: 50, min: 0, step: 1 },
      { id: 'AC', label: 'Actual Cost to Date (AC)', unit: '$', type: 'number', default: 580000 },
    ],
    outputs: [
      { id: 'PV', label: 'Planned Value (PV)', unit: '$', decimals: 0 },
      { id: 'EV', label: 'Earned Value (EV)', unit: '$', decimals: 0 },
      { id: 'SPI', label: 'Schedule Performance Index (SPI)', unit: '', decimals: 2 },
      { id: 'CPI', label: 'Cost Performance Index (CPI)', unit: '', decimals: 2 },
      { id: 'EAC', label: 'Estimate at Completion (EAC)', unit: '$', decimals: 0 },
      { id: 'VAC', label: 'Variance at Completion (VAC)', unit: '$', decimals: 0 },
    ],
    calculate: ({ BAC, pct_planned, pct_actual, AC }) => {
      const PV = Number(BAC) * Number(pct_planned) / 100
      const EV = Number(BAC) * Number(pct_actual) / 100
      const SPI = PV > 0 ? EV / PV : 0
      const CPI = Number(AC) > 0 ? EV / Number(AC) : 1
      const EAC = CPI > 0 ? Number(BAC) / CPI : 0
      return { PV, EV, SPI, CPI, EAC, VAC: Number(BAC) - EAC }
    },
  },

  // ── Labour Productivity ────────────────────────────────────
  'labour-productivity': {
    slug: 'labour-productivity',
    name: 'Labour Productivity Calculator',
    icon: '👷',
    description: 'Calculate labour productivity index, man-hours required and all-in labour rate including burdens.',
    formula: 'P = Q/(N×hours)  |  Man-hours = Q/P  |  All-in rate = wage×(1+burden%)  |  PI = Earned_hrs/Actual_hrs',
    reference: 'CIOB Guide, PMBoK',
    inputs: [
      { id: 'Q', label: 'Quantity of Work', unit: 'units', type: 'number', default: 1000, min: 0.1 },
      { id: 'n_workers', label: 'Number of Workers', unit: '', type: 'number', default: 10, min: 1, step: 1 },
      { id: 'hours_day', label: 'Hours per Day', unit: 'hr/day', type: 'number', default: 8, min: 1, step: 0.5 },
      { id: 'days', label: 'Days Worked', unit: 'days', type: 'number', default: 15, min: 1, step: 1 },
      { id: 'wage', label: 'Basic Wage Rate', unit: '$/hr', type: 'number', default: 25, min: 0 },
      { id: 'burden_pct', label: 'Labour Burden (benefits, tax)', unit: '%', type: 'number', default: 30, min: 0, step: 1 },
    ],
    outputs: [
      { id: 'man_hours', label: 'Total Man-Hours Available', unit: 'hrs', decimals: 0 },
      { id: 'productivity', label: 'Labour Productivity', unit: 'units/man-hr', decimals: 3 },
      { id: 'effective_rate', label: 'All-In Labour Rate', unit: '$/hr', decimals: 2 },
      { id: 'total_labour_cost', label: 'Total Labour Cost', unit: '$', decimals: 0 },
      { id: 'cost_per_unit', label: 'Labour Cost per Unit', unit: '$/unit', decimals: 2 },
    ],
    calculate: ({ Q, n_workers, hours_day, days, wage, burden_pct }) => {
      const man_hours = Number(n_workers) * Number(hours_day) * Number(days)
      const productivity = Number(Q) / man_hours
      const effective_rate = Number(wage) * (1 + Number(burden_pct) / 100)
      const total_labour_cost = man_hours * effective_rate
      return { man_hours, productivity, effective_rate, total_labour_cost, cost_per_unit: total_labour_cost / Number(Q) }
    },
  },

  // ── Crane Lift Capacity ────────────────────────────────────
  'crane-lift-capacity': {
    slug: 'crane-lift-capacity',
    name: 'Crane Lift Capacity Tool',
    icon: '🏗️',
    description: 'Check crane capacity at a working radius against total lifted weight including rigging per ASME B30.5.',
    formula: 'C_net = C_rated × derating_factor  |  Load moment = W × radius  |  Safe: W_total ≤ C_net',
    reference: 'ASME B30.5, AS 1418.5',
    inputs: [
      { id: 'C_rated', label: 'Rated Capacity at Radius', unit: 'tonnes', type: 'number', default: 20, min: 0.1 },
      { id: 'radius', label: 'Working Radius', unit: 'm', type: 'number', default: 15, min: 0.5 },
      { id: 'W_load', label: 'Load Weight', unit: 'tonnes', type: 'number', default: 8, min: 0.01 },
      { id: 'W_rigging', label: 'Rigging & Lifting Gear Weight', unit: 'tonnes', type: 'number', default: 0.5, min: 0 },
      { id: 'derating', label: 'Capacity Derating Factor', unit: '', type: 'number', default: 0.85, step: 0.01, placeholder: '0.75–0.85 per ASME B30.5' },
    ],
    outputs: [
      { id: 'C_net', label: 'Net Lifting Capacity', unit: 'tonnes', decimals: 2 },
      { id: 'W_total', label: 'Total Lifted Weight', unit: 'tonnes', decimals: 2 },
      { id: 'load_moment', label: 'Load Moment', unit: 't·m', decimals: 1 },
      { id: 'utilisation', label: 'Crane Utilisation', unit: '%', decimals: 1 },
      { id: 'safe', label: 'Lift Safe (1=yes, 0=overload)', unit: '', decimals: 0 },
    ],
    calculate: ({ C_rated, radius, W_load, W_rigging, derating }) => {
      const C_net = Number(C_rated) * Number(derating)
      const W_total = Number(W_load) + Number(W_rigging)
      const load_moment = W_total * Number(radius)
      const utilisation = (W_total / C_net) * 100
      return { C_net, W_total, load_moment, utilisation, safe: W_total <= C_net ? 1 : 0 }
    },
  },

  // ── Contractor Markup ──────────────────────────────────────
  'contractor-markup': {
    slug: 'contractor-markup',
    name: 'Contractor Markup & Margin Calculator',
    icon: '📊',
    description: 'Calculate bid price from direct costs with overhead, profit and contingency, and convert between markup and margin.',
    formula: 'Bid = C_direct + OH + Profit + Contingency  |  Markup = Margin/(1−Margin)  |  Margin = Markup/(1+Markup)',
    inputs: [
      { id: 'C_direct', label: 'Direct Cost (Materials + Labour + Equipment)', unit: '$', type: 'number', default: 250000 },
      { id: 'OH_pct', label: 'Overhead', unit: '%', type: 'number', default: 15, min: 0, step: 0.5 },
      { id: 'profit_pct', label: 'Profit', unit: '%', type: 'number', default: 10, min: 0, step: 0.5 },
      { id: 'contingency_pct', label: 'Contingency', unit: '%', type: 'number', default: 5, min: 0, step: 0.5 },
      { id: 'margin_pct', label: 'Target Margin % (for conversion)', unit: '%', type: 'number', default: 20, min: 1, step: 0.5 },
    ],
    outputs: [
      { id: 'OH_amt', label: 'Overhead Amount', unit: '$', decimals: 0 },
      { id: 'profit_amt', label: 'Profit Amount', unit: '$', decimals: 0 },
      { id: 'contingency_amt', label: 'Contingency Amount', unit: '$', decimals: 0 },
      { id: 'bid_price', label: 'Total Bid Price', unit: '$', decimals: 0 },
      { id: 'markup_pct', label: 'Equivalent Markup (from target margin)', unit: '%', decimals: 2 },
      { id: 'effective_margin', label: 'Effective Margin on Bid', unit: '%', decimals: 2 },
    ],
    calculate: ({ C_direct, OH_pct, profit_pct, contingency_pct, margin_pct }) => {
      const OH_amt = Number(C_direct) * Number(OH_pct) / 100
      const sub1 = Number(C_direct) + OH_amt
      const profit_amt = sub1 * Number(profit_pct) / 100
      const sub2 = sub1 + profit_amt
      const contingency_amt = sub2 * Number(contingency_pct) / 100
      const bid_price = sub2 + contingency_amt
      const m = Number(margin_pct) / 100
      const markup_pct = (m / (1 - m)) * 100
      const effective_margin = (bid_price - Number(C_direct)) / bid_price * 100
      return { OH_amt, profit_amt, contingency_amt, bid_price, markup_pct, effective_margin }
    },
  },
}

// ─── Merge rich configs over legacy configs ───────────────────
// Import is deferred to avoid circular-ref; we patch at call time via getFallbackConfig
// The actual merge is done in the lookup helper below.

// ─── Generic fallback config ──────────────────────────────────
export function getFallbackConfig(slug: string, name: string): EngineeringCalcConfig {
  return {
    slug,
    name,
    icon: '⚙️',
    description: `Professional ${name} for engineering calculations.`,
    formula: 'See references for full formula derivation.',
    inputs: [
      { id: 'a', label: 'Input A', unit: '', type: 'number', default: 1 },
      { id: 'b', label: 'Input B', unit: '', type: 'number', default: 1 },
    ],
    outputs: [
      { id: 'result', label: 'Result', unit: '', decimals: 4 },
    ],
    calculate: ({ a, b }) => ({ result: Number(a) * Number(b) }),
  }
}
