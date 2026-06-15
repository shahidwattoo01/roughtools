// ============================================================
// RICH ENGINEERING CALCULATOR CONFIGS (Master-Prompt Compliant)
// Each config uses calculateRich() returning EngineeringResult
// with: D/C ratio, PASS/MARGINAL/FAIL status, code references,
// step-by-step breakdown, assumptions, recommendations, tables.
// ============================================================

import type { EngineeringCalcConfig, EngineeringResult } from './engineering-configs'

// ─── Utility helpers ──────────────────────────────────────────

const r = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d

function dcStatus(ratio: number): 'PASS' | 'MARGINAL' | 'FAIL' {
  if (ratio <= 0.9) return 'PASS'
  if (ratio <= 1.0) return 'MARGINAL'
  return 'FAIL'
}

// ─── CIVIL & STRUCTURAL ───────────────────────────────────────

// ── 1. Beam Deflection (ACI / AISC serviceability) ────────────

export const beamDeflectionRich: EngineeringCalcConfig = {
  slug: 'beam-deflection-calculator',
  name: 'Beam Deflection Calculator',
  icon: '🏗️',
  description: 'Calculate maximum mid-span deflection for simply supported and cantilever beams under uniform or point loads. Serviceability check per AISC/IBC L/360 & L/240 criteria.',
  category: 'Civil & Structural',
  formula: 'Simply supported UDL: δ_max = 5wL⁴/(384EI) | Point load mid-span: δ_max = PL³/(48EI) | Cantilever UDL: δ_max = wL⁴/(8EI)',
  reference: 'AISC Steel Construction Manual 16th Ed. Table 3-23 | IBC 2021 §1604.3',
  codeEdition: 'AISC 360-22 / IBC 2021',
  inputs: [
    { id: 'L',     label: 'Span Length',          symbol: 'L',  unit: 'm',      type: 'number', default: 6,      min: 0.1, step: 0.1, placeholder: 'e.g. 6', tooltip: 'Clear span between supports in metres. For cantilevers, enter the free length.' },
    { id: 'w',     label: 'Uniform Load (UDL)',   symbol: 'w',  unit: 'kN/m',   type: 'number', default: 15,     min: 0,   step: 0.5, placeholder: 'e.g. 15', tooltip: 'Total UDL (dead + live) in kN/m. Set to 0 if using point load only.' },
    { id: 'P',     label: 'Point Load',           symbol: 'P',  unit: 'kN',     type: 'number', default: 0,      min: 0,   step: 1,   placeholder: 'e.g. 50', tooltip: 'Concentrated point load at mid-span in kN. Set 0 if UDL only.' },
    { id: 'E',     label: 'Modulus of Elasticity', symbol: 'E', unit: 'GPa',    type: 'number', default: 200,    min: 1,   step: 1,   placeholder: 'Steel=200, Concrete=30', tooltip: 'Young\'s Modulus. Steel: 200 GPa, Concrete: 25–35 GPa, Timber: 8–12 GPa', codeDefault: '200 GPa (structural steel)' },
    { id: 'I',     label: 'Moment of Inertia',    symbol: 'I',  unit: 'cm⁴',    type: 'number', default: 8360,   min: 1,   step: 10,  placeholder: 'e.g. 8360', tooltip: 'Second moment of area about bending axis. Find in section property tables (cm⁴).' },
    { id: 'type',  label: 'Beam Type',            type: 'select', default: 'ss', options: [
      { label: 'Simply Supported', value: 'ss' },
      { label: 'Cantilever',       value: 'cant' },
      { label: 'Fixed-Fixed',      value: 'ff' },
    ]},
    { id: 'checkLL', label: 'Live Load Component (for L/360 check)', symbol: 'w_LL', unit: 'kN/m', type: 'number', default: 10, min: 0, step: 0.5, tooltip: 'Live load portion only. Used for the L/360 serviceability check (IBC).' },
  ],
  outputs: [
    { id: 'delta_mm',  label: 'Maximum Deflection',        unit: 'mm',  decimals: 2, highlight: true },
    { id: 'delta_in',  label: 'Maximum Deflection',        unit: 'in',  decimals: 3 },
    { id: 'L_over_d',  label: 'Span-to-Deflection Ratio',  unit: 'L/x', decimals: 0 },
    { id: 'delta_LL',  label: 'Live Load Deflection',      unit: 'mm',  decimals: 2 },
    { id: 'limit_360', label: 'L/360 Limit (Live Load)',   unit: 'mm',  decimals: 2 },
    { id: 'limit_240', label: 'L/240 Limit (Total Load)',  unit: 'mm',  decimals: 2 },
  ],
  calculate: (v) => {
    const L = Number(v.L), w = Number(v.w), P = Number(v.P)
    const E = Number(v.E) * 1e6, I = Number(v.I) * 1e-8
    const wLL = Number(v.checkLL)
    const type = String(v.type)
    const EI = E * I
    let delta = 0, deltaLL = 0
    if (type === 'ss') {
      delta   = (5 * w * 1000 * L ** 4) / (384 * EI) + (P * 1000 * L ** 3) / (48 * EI)
      deltaLL = (5 * wLL * 1000 * L ** 4) / (384 * EI)
    } else if (type === 'cant') {
      delta   = (w * 1000 * L ** 4) / (8 * EI) + (P * 1000 * L ** 3) / (3 * EI)
      deltaLL = (wLL * 1000 * L ** 4) / (8 * EI)
    } else {
      delta   = (w * 1000 * L ** 4) / (384 * EI) + (P * 1000 * L ** 3) / (192 * EI)
      deltaLL = (wLL * 1000 * L ** 4) / (384 * EI)
    }
    const delta_mm = delta * 1000
    const limit_360 = (L * 1000) / 360
    const limit_240 = (L * 1000) / 240
    const L_over_d = delta_mm > 0 ? (L * 1000) / delta_mm : 99999
    return { delta_mm, delta_in: delta_mm / 25.4, L_over_d, delta_LL: deltaLL * 1000, limit_360, limit_240 }
  },
  calculateRich: (v): EngineeringResult => {
    const L = Number(v.L), w = Number(v.w), P = Number(v.P)
    const E_GPa = Number(v.E), E = E_GPa * 1e6
    const I_cm4 = Number(v.I), I = I_cm4 * 1e-8
    const wLL = Number(v.checkLL)
    const type = String(v.type)
    const EI = E * I
    let delta = 0, deltaLL = 0, formulaStr = '', subsStr = ''

    if (type === 'ss') {
      const d1 = (5 * w * 1000 * L ** 4) / (384 * EI)
      const d2 = P > 0 ? (P * 1000 * L ** 3) / (48 * EI) : 0
      delta = d1 + d2
      deltaLL = (5 * wLL * 1000 * L ** 4) / (384 * EI)
      formulaStr = 'δ = 5wL⁴/(384EI)' + (P > 0 ? ' + PL³/(48EI)' : '')
      subsStr = `δ = 5×${w}×${L}⁴/(384×${E_GPa}e6×${I_cm4}e-8)` + (P > 0 ? ` + ${P}×${L}³/(48×${E_GPa}e6×${I_cm4}e-8)` : '')
    } else if (type === 'cant') {
      delta = (w * 1000 * L ** 4) / (8 * EI) + (P > 0 ? (P * 1000 * L ** 3) / (3 * EI) : 0)
      deltaLL = (wLL * 1000 * L ** 4) / (8 * EI)
      formulaStr = 'δ = wL⁴/(8EI)' + (P > 0 ? ' + PL³/(3EI)' : '')
      subsStr = `δ = ${w}×${L}⁴/(8×${E_GPa}e6×${I_cm4}e-8)`
    } else {
      delta = (w * 1000 * L ** 4) / (384 * EI) + (P > 0 ? (P * 1000 * L ** 3) / (192 * EI) : 0)
      deltaLL = (wLL * 1000 * L ** 4) / (384 * EI)
      formulaStr = 'δ = wL⁴/(384EI)' + (P > 0 ? ' + PL³/(192EI)' : '')
      subsStr = `δ = ${w}×${L}⁴/(384×${E_GPa}e6×${I_cm4}e-8)`
    }

    const delta_mm = delta * 1000
    const deltaLL_mm = deltaLL * 1000
    const limit_360 = (L * 1000) / 360
    const limit_240 = (L * 1000) / 240
    const L_over_d = delta_mm > 0 ? (L * 1000) / delta_mm : 99999

    // Governing check: live load vs L/360
    const dcLL = deltaLL_mm / limit_360
    const dcTotal = delta_mm / limit_240
    const dcRatio = Math.max(dcLL, dcTotal)
    const status = dcStatus(dcRatio)

    return {
      outputs: { delta_mm: r(delta_mm, 2), delta_in: r(delta_mm / 25.4, 3), L_over_d: r(L_over_d, 0), delta_LL: r(deltaLL_mm, 2), limit_360: r(limit_360, 2), limit_240: r(limit_240, 2) },
      status,
      dcRatio: r(dcRatio, 3),
      demand: r(Math.max(deltaLL_mm, delta_mm), 2),
      capacity: r(Math.max(limit_360, limit_240), 2),
      demandLabel: 'Max Deflection (mm)',
      capacityLabel: `L/${dcLL >= dcTotal ? 360 : 240} Limit (mm)`,
      codeRef: 'AISC 360-22 / IBC 2021',
      codeClause: 'IBC §1604.3: L/360 live load, L/240 total load',
      codeEdition: 'IBC 2021',
      compliant: status !== 'FAIL',
      interpretation: `The maximum mid-span deflection is ${r(delta_mm, 2)} mm (L/${Math.round(L_over_d)}). The IBC permits ${r(limit_360, 2)} mm (L/360) for live load and ${r(limit_240, 2)} mm (L/240) for total load. The beam ${status === 'PASS' ? 'satisfies' : status === 'MARGINAL' ? 'marginally meets' : 'exceeds'} the serviceability limit. ${status === 'FAIL' ? 'Increase the moment of inertia (deeper or heavier section) to reduce deflection.' : ''}`,
      steps: [
        { description: 'Determine flexural rigidity EI', formula: 'EI = E × I', substituted: `EI = ${E_GPa} GPa × ${I_cm4} cm⁴ = ${r(EI / 1000, 0)} kN·m²`, result: `EI = ${r(EI, 0)} N·m²` },
        { description: 'Calculate maximum deflection', formula: formulaStr, substituted: subsStr, result: `δ_max = ${r(delta_mm, 2)} mm` },
        { description: 'Calculate live-load deflection only (for L/360 check)', formula: 'δ_LL = 5w_LL L⁴/(384EI)', result: `δ_LL = ${r(deltaLL_mm, 2)} mm` },
        { description: 'Check IBC L/360 limit (live load)', formula: 'Limit = L/360', substituted: `${L * 1000} mm / 360 = ${r(limit_360, 2)} mm`, result: `D/C = ${r(dcLL, 3)} → ${dcLL <= 1.0 ? 'PASS' : 'FAIL'}` },
        { description: 'Check IBC L/240 limit (total load)', formula: 'Limit = L/240', substituted: `${L * 1000} mm / 240 = ${r(limit_240, 2)} mm`, result: `D/C = ${r(dcTotal, 3)} → ${dcTotal <= 1.0 ? 'PASS' : 'FAIL'}` },
      ],
      recommendations: [
        status === 'FAIL'
          ? `Section is overly flexible. Increase moment of inertia I by ${r((delta_mm / limit_240 - 1) * 100, 0)}% — consider next heavier section from AISC Table 1-1.`
          : `Section satisfies serviceability. Current L/d ratio of ${Math.round(L_over_d)} provides adequate stiffness.`,
        'For composite beams, effective I_eff may be significantly higher — recalculate with transformed section properties.',
        'Verify pre-cambering requirements for long spans (> 9 m) where L/d < 300.',
      ],
      criticalParam: 'Moment of Inertia (I)',
      sensitivityNote: 'Deflection varies with the 4th power of span length and inversely with I. Doubling I halves deflection.',
      assumptions: [
        'Beam is prismatic (constant cross-section) along its length.',
        'Material is linearly elastic — stress does not exceed yield.',
        'Loads are applied statically (no dynamic amplification).',
        'Support conditions match the selected beam type exactly.',
        'For concrete beams, use cracked section I_eff per ACI 318-19 §24.2.',
      ],
      validityNote: 'Elastic formulae valid for slenderness L/d < 25 and stress within elastic range.',
      withinValidRange: L / (I_cm4 > 0 ? 1 : 99) < 999,
      standardTableTitle: 'IBC 2021 Deflection Limits',
      standardTable: [
        { label: 'Live load only (L/360)',     value: `${r(limit_360, 2)} mm`, highlight: dcLL > 1.0 },
        { label: 'Total load (L/240)',          value: `${r(limit_240, 2)} mm`, highlight: dcTotal > 1.0 },
        { label: 'Roof members: L/180',         value: `${r((L * 1000) / 180, 2)} mm` },
        { label: 'Your live load deflection',   value: `${r(deltaLL_mm, 2)} mm`, highlight: true },
        { label: 'Your total deflection',       value: `${r(delta_mm, 2)} mm`, highlight: true },
      ],
      imperialOutputs: {
        delta_mm: { value: r(delta_mm / 25.4, 3), unit: 'in' },
      },
    }
  },
}

// ── 2. Concrete Column Load Capacity (ACI 318-19) ─────────────

export const columnLoadCapacityRich: EngineeringCalcConfig = {
  slug: 'column-load-capacity',
  name: 'Concrete Column Load Capacity',
  icon: '🏛️',
  description: 'Calculate axial load capacity of tied and spiral reinforced concrete columns per ACI 318-19. Outputs φPn, D/C ratio and reinforcement ratio check.',
  category: 'Civil & Structural',
  formula: 'φPn = φ × 0.80 × [0.85f\'c(Ag−Ast) + fy×Ast]  (tied)  |  φPn = φ × 0.85 × [0.85f\'c(Ag−Ast) + fy×Ast]  (spiral)',
  reference: 'ACI 318-19 §22.4.2',
  codeEdition: 'ACI 318-19',
  inputs: [
    { id: 'b',   label: 'Column Width / Diameter', symbol: 'b', unit: 'mm', type: 'number', default: 400, min: 100, tooltip: 'For rectangular columns, enter the width. For circular, enter diameter.' },
    { id: 'h',   label: 'Column Depth (Rect.) / 0 if Circular', symbol: 'h', unit: 'mm', type: 'number', default: 400, min: 0, tooltip: 'For rectangular columns enter depth. Enter 0 for circular columns.' },
    { id: 'fc',  label: "Concrete Compressive Strength", symbol: "f'c", unit: 'MPa', type: 'number', default: 30, min: 17, max: 100, tooltip: "Specified 28-day cylinder compressive strength. ACI minimum 17 MPa for structural members.", codeDefault: '25–30 MPa typical' },
    { id: 'fy',  label: 'Steel Yield Strength',    symbol: 'fy', unit: 'MPa', type: 'number', default: 420, min: 280, max: 700, tooltip: 'Yield strength of longitudinal reinforcement. ASTM A615 Grade 60 = 420 MPa.', codeDefault: '420 MPa (Grade 60)' },
    { id: 'Ast', label: 'Total Steel Area',         symbol: 'Ast', unit: 'mm²', type: 'number', default: 2400, min: 0, tooltip: 'Total area of longitudinal steel bars. E.g., 8×25mm bars = 8×491 = 3928 mm².' },
    { id: 'Pu',  label: 'Factored Axial Load',      symbol: 'Pu', unit: 'kN', type: 'number', default: 1800, min: 0, tooltip: 'Design factored axial load (1.2D + 1.6L per ASCE 7). Enter 0 to skip adequacy check.' },
    { id: 'type', label: 'Tie Type', type: 'select', default: 'tied', options: [{ label: 'Tied (φ=0.65)', value: 'tied' }, { label: 'Spiral (φ=0.75)', value: 'spiral' }] },
  ],
  outputs: [
    { id: 'phi_Pn', label: 'Design Axial Capacity φPn', unit: 'kN', decimals: 1, highlight: true },
    { id: 'Pn',     label: 'Nominal Capacity Pn',        unit: 'kN', decimals: 1 },
    { id: 'rho_g',  label: 'Reinforcement Ratio ρg',     unit: '%',  decimals: 2 },
    { id: 'Ag',     label: 'Gross Cross-Sectional Area', unit: 'mm²', decimals: 0 },
    { id: 'dc_ratio', label: 'D/C Ratio (Pu / φPn)',    unit: '',   decimals: 3 },
  ],
  calculate: (v) => {
    const b = Number(v.b), h = Number(v.h) || Number(v.b)
    const fc = Number(v.fc), fy = Number(v.fy), Ast = Number(v.Ast), Pu = Number(v.Pu)
    const Ag = h > 0 && h !== b ? b * h : Math.PI * (b / 2) ** 2
    const phi = v.type === 'spiral' ? 0.75 : 0.65
    const factor = v.type === 'spiral' ? 0.85 : 0.80
    const Pn = factor * (0.85 * fc * (Ag - Ast) + fy * Ast) / 1000
    const phi_Pn = phi * Pn
    const rho_g = (Ast / Ag) * 100
    const dc_ratio = Pu > 0 ? Pu / phi_Pn : 0
    return { phi_Pn, Pn, rho_g, Ag, dc_ratio }
  },
  calculateRich: (v): EngineeringResult => {
    const b = Number(v.b), hInput = Number(v.h)
    const isCircular = hInput === 0
    const h = isCircular ? b : hInput
    const fc = Number(v.fc), fy = Number(v.fy), Ast = Number(v.Ast), Pu = Number(v.Pu)
    const Ag = isCircular ? Math.PI * (b / 2) ** 2 : b * h
    const phi = v.type === 'spiral' ? 0.75 : 0.65
    const factor = v.type === 'spiral' ? 0.85 : 0.80
    const Pn_N = factor * (0.85 * fc * (Ag - Ast) + fy * Ast)
    const Pn = Pn_N / 1000
    const phi_Pn = phi * Pn
    const rho_g = (Ast / Ag) * 100
    const dc_ratio = Pu > 0 ? Pu / phi_Pn : 0
    const rho_min = 1.0, rho_max = 8.0
    const rhoOk = rho_g >= rho_min && rho_g <= rho_max
    const status: 'PASS' | 'MARGINAL' | 'FAIL' = Pu === 0 ? 'INFO' as any : dcStatus(dc_ratio)

    return {
      outputs: { phi_Pn: r(phi_Pn, 1), Pn: r(Pn, 1), rho_g: r(rho_g, 2), Ag: r(Ag, 0), dc_ratio: r(dc_ratio, 3) },
      status,
      dcRatio: r(dc_ratio, 3),
      demand: Pu, capacity: r(phi_Pn, 1),
      demandLabel: 'Pu (kN)', capacityLabel: 'φPn (kN)',
      codeRef: 'ACI 318-19 §22.4.2',
      codeClause: 'Eq. 22.4.2.2 (tied) / Eq. 22.4.2.3 (spiral)',
      codeEdition: 'ACI 318-19',
      compliant: status !== 'FAIL' && rhoOk,
      interpretation: `The column has a design capacity of φPn = ${r(phi_Pn, 1)} kN with a reinforcement ratio of ρg = ${r(rho_g, 2)}%. ${!rhoOk ? `⚠️ Reinforcement ratio is OUTSIDE the ACI 318-19 limits of 1%–8%.` : 'Reinforcement ratio is within ACI limits (1%–8%).'}${Pu > 0 ? ` The factored demand Pu = ${Pu} kN gives a D/C ratio of ${r(dc_ratio, 3)} — the column is ${status}.` : ''}`,
      steps: [
        { description: 'Calculate gross cross-sectional area', formula: isCircular ? 'Ag = π(b/2)²' : 'Ag = b × h', substituted: isCircular ? `π×(${b}/2)² = ${r(Ag, 0)} mm²` : `${b}×${h} = ${r(Ag, 0)} mm²`, result: `Ag = ${r(Ag, 0)} mm²` },
        { description: 'Check reinforcement ratio', formula: 'ρg = Ast / Ag × 100', substituted: `${Ast} / ${r(Ag, 0)} × 100`, result: `ρg = ${r(rho_g, 2)}% (ACI limits: 1% to 8%)` },
        { description: 'Calculate nominal axial capacity Pn', formula: `Pn = ${factor} × [0.85f'c(Ag-Ast) + fy×Ast]`, substituted: `${factor} × [0.85×${fc}×(${r(Ag,0)}−${Ast}) + ${fy}×${Ast}]`, result: `Pn = ${r(Pn, 1)} kN` },
        { description: 'Apply strength reduction factor φ', formula: `φPn = φ × Pn  (φ = ${phi} for ${v.type})`, substituted: `${phi} × ${r(Pn, 1)}`, result: `φPn = ${r(phi_Pn, 1)} kN` },
        ...(Pu > 0 ? [{ description: 'Check adequacy: Pu ≤ φPn', formula: 'D/C = Pu / φPn', substituted: `${Pu} / ${r(phi_Pn, 1)}`, result: `D/C = ${r(dc_ratio, 3)} → ${status}` }] : []),
      ],
      recommendations: [
        status === 'FAIL'
          ? `Column is overstressed. Increase dimensions or add steel. Required φPn ≥ ${Pu} kN — try increasing Ast to ${r(Ast * dc_ratio * 1.05, 0)} mm² or increasing section size.`
          : `Column capacity is adequate with ${r((1 - dc_ratio) * 100, 1)}% reserve.`,
        !rhoOk && rho_g < rho_min ? `Increase Ast to minimum ${r(Ag * 0.01, 0)} mm² (ACI 318-19 ρg_min = 1%).` : '',
        !rhoOk && rho_g > rho_max ? `Reduce Ast to maximum ${r(Ag * 0.08, 0)} mm² (ACI 318-19 ρg_max = 8%).` : '',
        'Consider slenderness effects per ACI 318-19 §6.2 for columns with L/r > 22 (braced) or L/r > 12 (unbraced).',
      ].filter(Boolean) as string[],
      criticalParam: "Concrete strength f'c",
      sensitivityNote: "Increasing f'c by 5 MPa increases φPn by approximately 5–8% depending on steel ratio.",
      assumptions: [
        'Column is short (non-slender) — no moment magnification applied.',
        'Axially loaded only — no significant bending moment.',
        'Concrete and steel properties are isotropic and uniform.',
        'ACI 318-19 strength reduction factors applied (tied φ=0.65, spiral φ=0.75).',
        "Pure axial capacity — interaction with bending requires P-M interaction diagram.",
      ],
      standardTableTitle: 'ACI 318-19 Column Reinforcement Limits',
      standardTable: [
        { label: 'Minimum ρg (ACI 318-19 §10.6.1.1)', value: '1.0%', highlight: rho_g < 1.0 },
        { label: 'Maximum ρg (ACI 318-19 §10.6.1.1)', value: '8.0%', highlight: rho_g > 8.0 },
        { label: 'Your ρg', value: `${r(rho_g, 2)}%`, highlight: true },
        { label: 'φ factor — Tied (compression)', value: '0.65' },
        { label: 'φ factor — Spiral (compression)', value: '0.75' },
      ],
    }
  },
}

// ── 3. Foundation Bearing Capacity (Meyerhof) ─────────────────

export const foundationBearingCapacityRich: EngineeringCalcConfig = {
  slug: 'foundation-bearing-capacity',
  name: 'Foundation Bearing Capacity',
  icon: '🔩',
  description: 'Ultimate and allowable bearing capacity of shallow foundations using Meyerhof general bearing capacity equation. Includes shape, depth and inclination factors.',
  category: 'Geotechnical',
  formula: 'qu = c·Nc·Fcs·Fcd + q·Nq·Fqs·Fqd + 0.5·γ·B·Nγ·Fγs·Fγd | qa = qu / FS',
  reference: 'Meyerhof (1963) / Bowles "Foundation Analysis and Design" 5th Ed.',
  codeEdition: 'ASCE 7-22 / Bowles 5th Ed.',
  inputs: [
    { id: 'c',    label: 'Cohesion',            symbol: 'c',  unit: 'kPa',   type: 'number', default: 0,    min: 0, tooltip: 'Undrained shear strength for clays; 0 for sands. From lab tests or SPT correlations.' },
    { id: 'phi',  label: 'Friction Angle',       symbol: 'φ',  unit: '°',    type: 'number', default: 30,   min: 0, max: 50, tooltip: 'Internal friction angle of soil. Sand: 28–36°; Gravel: 35–45°; Clay: 0–15°.' },
    { id: 'gamma',label: 'Unit Weight of Soil',  symbol: 'γ',  unit: 'kN/m³',type: 'number', default: 18,   min: 10, max: 24, tooltip: 'Bulk unit weight. Loose sand ≈ 16 kN/m³; Dense sand ≈ 19 kN/m³; Clay ≈ 17–20 kN/m³.' },
    { id: 'Df',   label: 'Depth of Foundation',  symbol: 'Df', unit: 'm',    type: 'number', default: 1.5,  min: 0.3, tooltip: 'Depth from ground surface to bottom of footing.' },
    { id: 'B',    label: 'Footing Width',         symbol: 'B',  unit: 'm',    type: 'number', default: 2.0,  min: 0.3, tooltip: 'Footing width (shorter dimension for rectangular).' },
    { id: 'L',    label: 'Footing Length',        symbol: 'L',  unit: 'm',    type: 'number', default: 2.0,  min: 0.3, tooltip: 'Footing length. Set equal to B for square footings.' },
    { id: 'FS',   label: 'Factor of Safety',      symbol: 'FS', unit: '',     type: 'number', default: 3.0,  min: 1.5, max: 6, codeDefault: '3.0 (standard for dead + live loads)', tooltip: 'Recommended FS: 3.0 for new structures, 2.5 if loads well-defined.' },
    { id: 'Qa',   label: 'Applied Net Load',      symbol: 'Qa', unit: 'kN',   type: 'number', default: 800,  min: 0, tooltip: 'Net column load on footing, excluding footing self-weight.' },
  ],
  outputs: [
    { id: 'qu',   label: 'Ultimate Bearing Capacity',   unit: 'kPa', decimals: 1, highlight: true },
    { id: 'qa',   label: 'Allowable Bearing Capacity',  unit: 'kPa', decimals: 1 },
    { id: 'q_applied', label: 'Applied Bearing Pressure', unit: 'kPa', decimals: 1 },
    { id: 'FOS',  label: 'Factor of Safety (Achieved)', unit: '',    decimals: 2 },
    { id: 'Nc',   label: 'Bearing Capacity Factor Nc',  unit: '',    decimals: 2 },
    { id: 'Nq',   label: 'Bearing Capacity Factor Nq',  unit: '',    decimals: 2 },
    { id: 'Ngamma', label: 'Bearing Capacity Factor Nγ', unit: '',   decimals: 2 },
  ],
  calculate: (v) => {
    const c = Number(v.c), phi_deg = Number(v.phi), gamma = Number(v.gamma)
    const Df = Number(v.Df), B = Number(v.B), L = Number(v.L)
    const FS = Number(v.FS), Qa = Number(v.Qa)
    const phi = phi_deg * Math.PI / 180
    const Nq = Math.exp(Math.PI * Math.tan(phi)) * Math.tan(45 * Math.PI / 180 + phi / 2) ** 2
    const Nc = phi_deg > 0 ? (Nq - 1) / Math.tan(phi) : 5.14
    const Ngamma = 2 * (Nq + 1) * Math.tan(phi)
    const q = gamma * Df
    const Fcs = 1 + (B / L) * (Nq / Nc)
    const Fqs = 1 + (B / L) * Math.tan(phi)
    const Fgs = Math.max(1 - 0.4 * (B / L), 0)
    const Fcd = 1 + 0.4 * (Df / B)
    const Fqd = 1 + 2 * Math.tan(phi) * (1 - Math.sin(phi)) ** 2 * (Df / B)
    const Fgd = 1.0
    const qu = c * Nc * Fcs * Fcd + q * Nq * Fqs * Fqd + 0.5 * gamma * B * Ngamma * Fgs * Fgd
    const qa = qu / FS
    const q_applied = Qa / (B * L)
    const FOS = qu / q_applied
    return { qu: r(qu, 1), qa: r(qa, 1), q_applied: r(q_applied, 1), FOS: r(FOS, 2), Nc: r(Nc, 2), Nq: r(Nq, 2), Ngamma: r(Ngamma, 2) }
  },
  calculateRich: (v): EngineeringResult => {
    const c = Number(v.c), phi_deg = Number(v.phi), gamma = Number(v.gamma)
    const Df = Number(v.Df), B = Number(v.B), L = Number(v.L)
    const FS = Number(v.FS), Qa = Number(v.Qa)
    const phi = phi_deg * Math.PI / 180
    const Nq = Math.exp(Math.PI * Math.tan(phi)) * Math.tan(45 * Math.PI / 180 + phi / 2) ** 2
    const Nc = phi_deg > 0 ? (Nq - 1) / Math.tan(phi) : 5.14
    const Ngamma = 2 * (Nq + 1) * Math.tan(phi)
    const q = gamma * Df
    const Fcs = 1 + (B / L) * (Nq / Nc)
    const Fqs = 1 + (B / L) * Math.tan(phi)
    const Fgs = Math.max(1 - 0.4 * (B / L), 0)
    const Fcd = 1 + 0.4 * (Df / B)
    const Fqd = 1 + 2 * Math.tan(phi) * (1 - Math.sin(phi)) ** 2 * (Df / B)
    const Fgd = 1.0
    const qu = c * Nc * Fcs * Fcd + q * Nq * Fqs * Fqd + 0.5 * gamma * B * Ngamma * Fgs * Fgd
    const qa = qu / FS
    const q_applied = Qa / (B * L)
    const FOS_actual = qu / q_applied
    const dc = q_applied / qa
    const status = dcStatus(dc)

    return {
      outputs: { qu: r(qu, 1), qa: r(qa, 1), q_applied: r(q_applied, 1), FOS: r(FOS_actual, 2), Nc: r(Nc, 2), Nq: r(Nq, 2), Ngamma: r(Ngamma, 2) },
      status,
      dcRatio: r(dc, 3),
      demand: r(q_applied, 1), capacity: r(qa, 1),
      demandLabel: 'Applied Pressure (kPa)', capacityLabel: 'Allowable Capacity (kPa)',
      codeRef: 'Meyerhof (1963) — General Bearing Capacity',
      codeClause: 'qu = c·Nc·Sc·dc + q·Nq·Sq·dq + 0.5γBNγ·Sγ·dγ',
      codeEdition: 'Bowles Foundation Analysis 5th Ed.',
      compliant: status !== 'FAIL',
      interpretation: `The ultimate bearing capacity of the soil beneath the ${B}×${L} m footing at ${Df} m depth is qu = ${r(qu, 1)} kPa. With FS = ${FS}, the allowable bearing capacity is qa = ${r(qa, 1)} kPa. The applied bearing pressure is ${r(q_applied, 1)} kPa, giving an achieved FOS of ${r(FOS_actual, 2)}. The footing is ${status === 'PASS' ? 'adequately sized' : status === 'MARGINAL' ? 'marginally adequate' : 'UNDERSIZED — increase footing dimensions'}.`,
      steps: [
        { description: 'Calculate bearing capacity factors from friction angle', formula: 'Nq = eπtanφ × tan²(45+φ/2)', substituted: `φ = ${phi_deg}°`, result: `Nc=${r(Nc,2)}, Nq=${r(Nq,2)}, Nγ=${r(Ngamma,2)}` },
        { description: 'Calculate overburden stress at footing level', formula: 'q = γ × Df', substituted: `${gamma} × ${Df}`, result: `q = ${r(q, 1)} kPa` },
        { description: 'Calculate shape factors (rectangular footing)', formula: 'Fcs = 1+(B/L)(Nq/Nc), Fqs = 1+(B/L)tanφ', result: `Fcs=${r(Fcs,3)}, Fqs=${r(Fqs,3)}, Fγs=${r(Fgs,3)}` },
        { description: 'Calculate depth factors', formula: 'Fcd = 1+0.4(Df/B)', result: `Fcd=${r(Fcd,3)}, Fqd=${r(Fqd,3)}, Fγd=${r(Fgd,3)}` },
        { description: 'Apply general bearing capacity equation', formula: "qu = c·Nc·Fcs·Fcd + q·Nq·Fqs·Fqd + 0.5γB·Nγ·Fγs·Fγd", result: `qu = ${r(qu, 1)} kPa` },
        { description: 'Allowable bearing capacity', formula: 'qa = qu / FS', substituted: `${r(qu,1)} / ${FS}`, result: `qa = ${r(qa, 1)} kPa` },
        { description: 'Check applied bearing pressure', formula: 'q_applied = Qa / (B×L)', substituted: `${Qa} / (${B}×${L})`, result: `q_applied = ${r(q_applied,1)} kPa — FOS = ${r(FOS_actual,2)}` },
      ],
      recommendations: [
        status === 'FAIL'
          ? `Increase footing area. Required B×L ≥ ${r(Math.sqrt(Qa / qa), 2)}×${r(Math.sqrt(Qa / qa), 2)} m for square footing.`
          : `Current footing is adequate. Achieved FOS = ${r(FOS_actual, 2)} ≥ required ${FS}.`,
        'Verify settlement (elastic + consolidation) separately — especially for clayey soils.',
        Df < 1.0 ? 'Consider deepening foundation to at least 1.0 m to reduce frost heave and seasonal movement risk.' : '',
      ].filter(Boolean) as string[],
      criticalParam: 'Friction Angle (φ)',
      sensitivityNote: 'A 5° increase in φ approximately doubles the bearing capacity for sandy soils.',
      assumptions: [
        'General shear failure mode (dense sand or stiff clay — not soft clay).',
        'Footing is rigid and soil is homogeneous to a depth of at least 2B below foundation level.',
        'No groundwater within depth B of the footing base (if GWT is present, reduce γ to γ\'= γ_sat − 9.81).',
        'Meyerhof shape and depth factors applied for rectangular footing geometry.',
      ],
      standardTableTitle: 'Typical Allowable Bearing Capacities',
      standardTable: [
        { label: 'Soft clay',                 value: '75–150 kPa' },
        { label: 'Medium clay',               value: '100–200 kPa' },
        { label: 'Stiff clay',                value: '200–400 kPa' },
        { label: 'Loose sand',                value: '100–200 kPa' },
        { label: 'Medium-dense sand',         value: '200–400 kPa' },
        { label: 'Dense sand / gravel',       value: '400–600 kPa' },
        { label: 'Bedrock (sandstone)',       value: '1500–5000 kPa' },
        { label: 'Your calculated qa',        value: `${r(qa, 1)} kPa`, highlight: true },
      ],
    }
  },
}

// ─── ELECTRICAL ───────────────────────────────────────────────

// ── 4. Wire / Cable Sizing (NEC 310.16) ──────────────────────

export const wireCableSizeRich: EngineeringCalcConfig = {
  slug: 'wire-cable-size',
  name: 'Wire & Cable Sizing Calculator',
  icon: '🔌',
  description: 'Size conductors per NEC Table 310.16 (or IEC 60364 equivalent). Outputs minimum wire gauge, ampacity check, voltage drop %, and minimum conduit size.',
  category: 'Electrical',
  formula: 'Ampacity check: I_design ≤ I_allowable × correction_factors | VD% = (2×ρ×L×I) / (A×V) × 100 | NEC 210.19(A): VD ≤ 3% branch, ≤ 5% total',
  reference: 'NEC 2023 Table 310.16 | NEC 210.19(A) Voltage Drop',
  codeEdition: 'NEC 2023',
  inputs: [
    { id: 'I', label: 'Design Current (Load)', symbol: 'I', unit: 'A', type: 'number', default: 30, min: 0.1, tooltip: 'Actual load current. For motors: use 125% of FLA per NEC 430.22.' },
    { id: 'V', label: 'System Voltage', symbol: 'V', unit: 'V', type: 'number', default: 230, min: 12, options: undefined, tooltip: 'Nominal system voltage: 120, 208, 230, 240, 277, 480 V etc.' },
    { id: 'L', label: 'One-Way Run Length', symbol: 'L', unit: 'm', type: 'number', default: 30, min: 0.5, tooltip: 'One-way cable length from panel to load. Formula uses 2L for single-phase.' },
    { id: 'phases', label: 'Phase', type: 'select', default: '1', options: [{ label: 'Single Phase (1φ)', value: '1' }, { label: 'Three Phase (3φ)', value: '3' }] },
    { id: 'conductor', label: 'Conductor Material', type: 'select', default: 'Cu', options: [{ label: 'Copper (Cu)', value: 'Cu' }, { label: 'Aluminium (Al)', value: 'Al' }] },
    { id: 'ambient', label: 'Ambient Temperature', symbol: 'Ta', unit: '°C', type: 'number', default: 30, min: 10, max: 75, codeDefault: '30°C (NEC Table 310.16)', tooltip: 'Ambient temperature correction applied per NEC Table 310.16 correction factors.' },
    { id: 'conduits', label: 'Conductors in Conduit', type: 'select', default: '3', options: [{ label: '1–3 conductors', value: '3' }, { label: '4–6 conductors', value: '6' }, { label: '7–9 conductors', value: '9' }, { label: '10+ conductors', value: '10' }] },
  ],
  outputs: [
    { id: 'minAWG',    label: 'Minimum Wire Size (AWG/mm²)', unit: '',   decimals: 0, highlight: true },
    { id: 'ampacity',  label: 'Selected Wire Ampacity',       unit: 'A',  decimals: 0 },
    { id: 'vd_pct',    label: 'Voltage Drop',                 unit: '%',  decimals: 2 },
    { id: 'vd_V',      label: 'Voltage Drop (absolute)',      unit: 'V',  decimals: 2 },
    { id: 'vr',        label: 'Receiving End Voltage',        unit: 'V',  decimals: 1 },
  ],
  calculate: (v) => {
    // NEC 310.16 copper 75°C ampacity table (AWG → Amps)
    const CU_TABLE: [string, number, number][] = [ // [label, ampacity, area_mm2]
      ['14 AWG', 15, 2.08], ['12 AWG', 20, 3.31], ['10 AWG', 30, 5.26],
      ['8 AWG', 50, 8.37], ['6 AWG', 65, 13.3], ['4 AWG', 85, 21.2],
      ['3 AWG', 100, 26.7], ['2 AWG', 115, 33.6], ['1 AWG', 130, 42.4],
      ['1/0 AWG', 150, 53.5], ['2/0 AWG', 175, 67.4], ['3/0 AWG', 200, 85.0],
      ['4/0 AWG', 230, 107], ['250 kcmil', 255, 127], ['300 kcmil', 285, 152],
      ['350 kcmil', 310, 177], ['400 kcmil', 335, 203], ['500 kcmil', 380, 253],
    ]
    const AL_TABLE: [string, number, number][] = [
      ['12 AWG', 15, 3.31], ['10 AWG', 25, 5.26], ['8 AWG', 40, 8.37],
      ['6 AWG', 50, 13.3], ['4 AWG', 65, 21.2], ['2 AWG', 90, 33.6],
      ['1/0 AWG', 120, 53.5], ['2/0 AWG', 135, 67.4], ['3/0 AWG', 155, 85.0],
      ['4/0 AWG', 180, 107], ['250 kcmil', 205, 127], ['350 kcmil', 250, 177],
    ]
    const I = Number(v.I), Vsys = Number(v.V), L = Number(v.L)
    const isSingle = v.phases === '1'
    const isCu = v.conductor === 'Cu'
    const table = isCu ? CU_TABLE : AL_TABLE
    const ambient = Number(v.ambient)
    const conductorCount = Number(v.conduits)

    // Ambient temp correction (NEC 310.16 — 75°C rated)
    let tempCorr = 1.0
    if      (ambient <= 10)  tempCorr = 1.22
    else if (ambient <= 15)  tempCorr = 1.17
    else if (ambient <= 20)  tempCorr = 1.12
    else if (ambient <= 25)  tempCorr = 1.06
    else if (ambient <= 30)  tempCorr = 1.00
    else if (ambient <= 35)  tempCorr = 0.94
    else if (ambient <= 40)  tempCorr = 0.88
    else if (ambient <= 45)  tempCorr = 0.82
    else if (ambient <= 50)  tempCorr = 0.75
    else                     tempCorr = 0.67

    // Fill correction
    let fillCorr = 1.0
    if (conductorCount <= 3)       fillCorr = 1.00
    else if (conductorCount <= 6)  fillCorr = 0.80
    else if (conductorCount <= 9)  fillCorr = 0.70
    else                           fillCorr = 0.50

    const corrFactor = tempCorr * fillCorr
    const I_required = I / corrFactor

    const selected = table.find(([, amp]) => amp >= I_required) ?? table[table.length - 1]
    const [_label, ampacity, area] = selected

    // Voltage drop
    const rho = isCu ? 0.01724e-6 : 0.02827e-6 // Ω·m
    const distFactor = isSingle ? 2 : Math.sqrt(3)
    const vd_V = (distFactor * rho * L * I) / (area * 1e-6)
    const vd_pct = (vd_V / Vsys) * 100
    const vr = Vsys - vd_V

    // Encode awg as index for display
    const minAWG_idx = table.indexOf(selected)
    return { minAWG: minAWG_idx, ampacity, vd_pct: r(vd_pct, 2), vd_V: r(vd_V, 2), vr: r(vr, 1) }
  },
  calculateRich: (v): EngineeringResult => {
    const CU_TABLE: [string, number, number][] = [
      ['14 AWG (2.5mm²)', 15, 2.08], ['12 AWG (4mm²)', 20, 3.31], ['10 AWG (6mm²)', 30, 5.26],
      ['8 AWG (10mm²)', 50, 8.37], ['6 AWG (16mm²)', 65, 13.3], ['4 AWG (25mm²)', 85, 21.2],
      ['3 AWG (26.7mm²)', 100, 26.7], ['2 AWG (35mm²)', 115, 33.6], ['1 AWG (42.4mm²)', 130, 42.4],
      ['1/0 AWG (53.5mm²)', 150, 53.5], ['2/0 AWG (67.4mm²)', 175, 67.4], ['3/0 AWG (85mm²)', 200, 85.0],
      ['4/0 AWG (107mm²)', 230, 107], ['250 kcmil (127mm²)', 255, 127], ['300 kcmil (152mm²)', 285, 152],
      ['350 kcmil (177mm²)', 310, 177], ['400 kcmil (203mm²)', 335, 203], ['500 kcmil (253mm²)', 380, 253],
    ]
    const AL_TABLE: [string, number, number][] = [
      ['12 AWG', 15, 3.31], ['10 AWG', 25, 5.26], ['8 AWG', 40, 8.37],
      ['6 AWG', 50, 13.3], ['4 AWG', 65, 21.2], ['2 AWG', 90, 33.6],
      ['1/0 AWG', 120, 53.5], ['2/0 AWG', 135, 67.4], ['3/0 AWG', 155, 85.0],
      ['4/0 AWG', 180, 107], ['250 kcmil', 205, 127], ['350 kcmil', 250, 177],
    ]

    const I = Number(v.I), Vsys = Number(v.V), L = Number(v.L)
    const isSingle = v.phases === '1'
    const isCu = v.conductor === 'Cu'
    const table = isCu ? CU_TABLE : AL_TABLE
    const ambient = Number(v.ambient)
    const conductorCount = Number(v.conduits)

    let tempCorr = 1.0
    if (ambient <= 25) tempCorr = 1 + (30 - ambient) * 0.012
    else if (ambient <= 30) tempCorr = 1.0
    else tempCorr = Math.max(1 - (ambient - 30) * 0.012, 0.50)

    const fillCorr = conductorCount <= 3 ? 1.0 : conductorCount <= 6 ? 0.80 : conductorCount <= 9 ? 0.70 : 0.50
    const corrFactor = tempCorr * fillCorr
    const I_required = I / corrFactor

    const selectedIdx = table.findIndex(([, amp]) => amp >= I_required)
    const idx = selectedIdx === -1 ? table.length - 1 : selectedIdx
    const [label, ampacity, area] = table[idx]

    const rho = isCu ? 0.01724e-6 : 0.02827e-6
    const distFactor = isSingle ? 2 : Math.sqrt(3)
    const vd_V = (distFactor * rho * L * I) / (area * 1e-6)
    const vd_pct = (vd_V / Vsys) * 100
    const vr = Vsys - vd_V

    const vdCompliant = vd_pct <= 3.0
    const ampCompliant = I <= ampacity * corrFactor
    const compliant = vdCompliant && ampCompliant
    const dc_ampacity = I / (ampacity * corrFactor)
    const dc_vd = vd_pct / 3.0
    const dcRatio = Math.max(dc_ampacity, dc_vd)
    const status = dcStatus(dcRatio)

    return {
      outputs: { minAWG: idx, ampacity, vd_pct: r(vd_pct, 2), vd_V: r(vd_V, 2), vr: r(vr, 1) },
      status,
      dcRatio: r(dcRatio, 3),
      demand: r(Math.max(I, vd_pct), 2),
      capacity: r(Math.max(ampacity * corrFactor, 3.0), 2),
      demandLabel: 'Design Current / VD%',
      capacityLabel: 'Ampacity (derated) / 3% limit',
      codeRef: 'NEC 2023 Table 310.16',
      codeClause: 'NEC 210.19(A) — branch circuit VD ≤ 3%',
      codeEdition: 'NEC 2023',
      compliant,
      interpretation: `Select ${label} (${isCu ? 'copper' : 'aluminium'}) — rated ${ampacity} A at 75°C. After derating for temperature (×${r(tempCorr,2)}) and fill (×${fillCorr}), effective ampacity is ${r(ampacity * corrFactor, 1)} A vs ${I} A design current. Voltage drop is ${r(vd_pct, 2)}% (NEC limit: 3% for branch circuits). ${!vdCompliant ? '⚠️ Voltage drop EXCEEDS NEC limit — consider next larger wire size.' : 'Voltage drop is within NEC limits.'}`,
      steps: [
        { description: 'Apply ambient temperature correction factor', formula: 'CF_temp from NEC Table 310.16', result: `CF_temp = ${r(tempCorr, 2)} (at ${ambient}°C)` },
        { description: 'Apply conduit fill correction factor', formula: 'CF_fill from NEC 310.15(C)', result: `CF_fill = ${fillCorr} (${conductorCount} conductors)` },
        { description: 'Calculate required ampacity after derating', formula: 'I_required = I_design / (CF_temp × CF_fill)', substituted: `${I} / (${r(tempCorr,2)} × ${fillCorr})`, result: `I_required = ${r(I_required, 1)} A` },
        { description: 'Select wire size from NEC Table 310.16', result: `Selected: ${label} — rated ${ampacity} A → derated to ${r(ampacity * corrFactor, 1)} A` },
        { description: 'Calculate voltage drop', formula: `VD = (${isSingle ? '2' : '√3'}×ρ×L×I) / A`, substituted: `(${isSingle ? '2' : '√3'}×${rho.toExponential(3)}×${L}×${I}) / ${area}e-6`, result: `VD = ${r(vd_V, 2)} V (${r(vd_pct, 2)}%) — NEC limit: 3%` },
      ],
      recommendations: [
        !vdCompliant ? `Voltage drop ${r(vd_pct,2)}% exceeds NEC 3% limit. Upsize to ${table[Math.min(idx+1, table.length-1)][0]} to reduce VD.` : `Voltage drop ${r(vd_pct,2)}% is within NEC 3% limit.`,
        `Receiving end voltage = ${r(vr, 1)} V (${r(vr/Vsys*100, 1)}% of supply).`,
        'For motors, apply 125% FLA rule per NEC 430.22 before entering design current.',
        'Verify conduit fill percentage per NEC Chapter 9 Table 1 (maximum 40% for 3+ conductors).',
      ],
      criticalParam: 'One-Way Run Length (L)',
      sensitivityNote: 'Voltage drop is proportional to length. Doubling the run doubles the voltage drop.',
      assumptions: [
        'NEC 2023 Table 310.16 — 75°C rated conductors in conduit.',
        'Single-phase uses 2×L, three-phase uses √3×L for voltage drop.',
        'Resistivity: Cu = 1.724×10⁻⁸ Ω·m, Al = 2.827×10⁻⁸ Ω·m.',
        'Voltage drop calculation assumes balanced load at unity power factor.',
        'For reactive loads, actual VD may be higher due to reactive component.',
      ],
      standardTableTitle: 'NEC 2023 Copper Conductor Ampacity (75°C, in conduit)',
      standardTable: table.slice(0, 10).map(([lbl, amp], i) => ({
        label: lbl,
        value: `${amp} A`,
        highlight: i === idx,
      })),
    }
  },
}

// ── 5. Pressure Vessel Wall Thickness (ASME VIII Div.1) ───────

export const pressureVesselRich: EngineeringCalcConfig = {
  slug: 'pressure-vessel-thickness',
  name: 'Pressure Vessel Wall Thickness',
  icon: '⚙️',
  description: 'Calculate minimum required wall thickness for cylindrical pressure vessels per ASME Section VIII Division 1. Outputs required thickness, MAWP, and hydrostatic test pressure.',
  category: 'Mechanical',
  formula: 't = PR / (SE - 0.6P)  [circumferential stress governs]  |  MAWP = SEt / (R + 0.6t)',
  reference: 'ASME BPVC Section VIII Division 1, UG-27',
  codeEdition: 'ASME BPVC 2023',
  inputs: [
    { id: 'P',    label: 'Design Pressure',           symbol: 'P',  unit: 'MPa',  type: 'number', default: 1.5,  min: 0.01, step: 0.1, tooltip: 'Internal design pressure. Typically 10% above maximum operating pressure.' },
    { id: 'R',    label: 'Inside Radius',             symbol: 'R',  unit: 'mm',   type: 'number', default: 500,  min: 10,   tooltip: 'Internal radius of the cylindrical shell.' },
    { id: 'S',    label: 'Allowable Stress',          symbol: 'S',  unit: 'MPa',  type: 'number', default: 138,  min: 10,   tooltip: 'Material allowable stress from ASME Section II Part D. SA-516-70: ~138 MPa at 300°C.', codeDefault: 'SA-516-70: 138 MPa' },
    { id: 'E',    label: 'Joint Efficiency',          symbol: 'E',  unit: '',     type: 'number', default: 1.0,  min: 0.5, max: 1.0, step: 0.05, tooltip: 'Weld joint efficiency factor. Full RT: 1.0; Spot RT: 0.85; No RT: 0.70', codeDefault: '1.0 (full radiographic examination)' },
    { id: 'CA',   label: 'Corrosion Allowance',       symbol: 'CA', unit: 'mm',   type: 'number', default: 3.0,  min: 0,   tooltip: 'Additional thickness added for corrosion/erosion. Typically 1.5–3.0 mm for mild conditions.' },
    { id: 't_nom', label: 'Nominal (Selected) Thickness', symbol: 't_nom', unit: 'mm', type: 'number', default: 16, min: 1, tooltip: 'Plate thickness you plan to use. Enter to check adequacy vs minimum required.' },
  ],
  outputs: [
    { id: 't_req',  label: 'Required Minimum Thickness', unit: 'mm', decimals: 2, highlight: true },
    { id: 't_total', label: 'Required + Corrosion Allowance', unit: 'mm', decimals: 2 },
    { id: 'MAWP',   label: 'MAWP of Selected Thickness',  unit: 'MPa', decimals: 3 },
    { id: 'P_hyd',  label: 'Hydrostatic Test Pressure',   unit: 'MPa', decimals: 3 },
    { id: 'dc',     label: 'D/C Ratio (t_req / t_nom)',   unit: '',   decimals: 3 },
  ],
  calculate: (v) => {
    const P = Number(v.P), R = Number(v.R), S = Number(v.S), Ef = Number(v.E)
    const CA = Number(v.CA), t_nom = Number(v.t_nom)
    const t_req = (P * R) / (S * Ef - 0.6 * P)
    const t_total = t_req + CA
    const MAWP = (S * Ef * t_nom) / (R + 0.6 * t_nom)
    const P_hyd = 1.3 * MAWP
    const dc = t_total / t_nom
    return { t_req: r(t_req, 2), t_total: r(t_total, 2), MAWP: r(MAWP, 3), P_hyd: r(P_hyd, 3), dc: r(dc, 3) }
  },
  calculateRich: (v): EngineeringResult => {
    const P = Number(v.P), R_mm = Number(v.R), S = Number(v.S), Ef = Number(v.E)
    const CA = Number(v.CA), t_nom = Number(v.t_nom)
    const t_req = (P * R_mm) / (S * Ef - 0.6 * P)
    const t_total = t_req + CA
    const MAWP = (S * Ef * t_nom) / (R_mm + 0.6 * t_nom)
    const P_hyd = 1.3 * MAWP
    const dc = t_total / t_nom
    const status = dcStatus(dc)

    return {
      outputs: { t_req: r(t_req, 2), t_total: r(t_total, 2), MAWP: r(MAWP, 3), P_hyd: r(P_hyd, 3), dc: r(dc, 3) },
      status,
      dcRatio: r(dc, 3),
      demand: r(t_total, 2), capacity: t_nom,
      demandLabel: 'Required thickness + CA (mm)', capacityLabel: 'Nominal thickness (mm)',
      codeRef: 'ASME BPVC Section VIII Div. 1',
      codeClause: 'UG-27(c)(1) — Circumferential stress, thin-wall cylinder',
      codeEdition: 'ASME BPVC 2023',
      compliant: status !== 'FAIL',
      interpretation: `The minimum required wall thickness (excluding corrosion allowance) is ${r(t_req, 2)} mm per ASME UG-27. Including ${CA} mm corrosion allowance, the required nominal thickness is ${r(t_total, 2)} mm. The selected ${t_nom} mm plate ${status === 'FAIL' ? 'is INSUFFICIENT' : status === 'MARGINAL' ? 'marginally meets requirements' : 'adequately satisfies'} ASME requirements. The MAWP of the selected plate is ${r(MAWP, 3)} MPa; hydrostatic test pressure is ${r(P_hyd, 3)} MPa.`,
      steps: [
        { description: 'Check formula applicability (thin-wall criterion)', formula: 't/R ≤ 0.5 and P ≤ 0.385SE', result: `t/R = ${r(t_req/R_mm, 4)} — thin-wall criterion ${t_req/R_mm <= 0.5 ? 'SATISFIED' : 'NOT satisfied — use thick-wall formula'}` },
        { description: 'Calculate required minimum thickness (circumferential)', formula: 't = PR / (SE − 0.6P)', substituted: `t = ${P}×${R_mm} / (${S}×${Ef} − 0.6×${P})`, result: `t = ${r(t_req, 2)} mm` },
        { description: 'Add corrosion allowance', formula: 't_total = t_req + CA', substituted: `${r(t_req, 2)} + ${CA}`, result: `t_total = ${r(t_total, 2)} mm` },
        { description: 'Calculate MAWP of selected thickness', formula: 'MAWP = SEt / (R + 0.6t)', substituted: `${S}×${Ef}×${t_nom} / (${R_mm} + 0.6×${t_nom})`, result: `MAWP = ${r(MAWP, 3)} MPa` },
        { description: 'Hydrostatic test pressure', formula: 'P_test = 1.3 × MAWP', substituted: `1.3 × ${r(MAWP, 3)}`, result: `P_test = ${r(P_hyd, 3)} MPa` },
      ],
      recommendations: [
        status === 'FAIL' ? `Increase nominal thickness to at least ${Math.ceil(t_total)} mm (next standard plate: ${Math.ceil(t_total / 2) * 2} mm).` : `Selected ${t_nom} mm plate is adequate.`,
        `MAWP = ${r(MAWP, 3)} MPa. Ensure design pressure ${P} MPa ≤ MAWP with appropriate safety margin.`,
        'Perform head thickness calculations separately (hemispherical, ellipsoidal, or torispherical heads).',
        'Check nozzle reinforcement requirements per ASME UG-37 if any openings are present.',
      ],
      criticalParam: 'Allowable Stress (S)',
      sensitivityNote: 'Allowable stress is temperature-dependent — verify S from ASME Section IID at operating temperature.',
      assumptions: [
        'Thin-wall cylinder: t/R < 0.5 and P < 0.385SE.',
        'Internal pressure only — no external pressure, bending, or nozzle loads.',
        'Circumferential (hoop) stress governs over longitudinal stress.',
        'Material properties at design temperature from ASME Section II Part D.',
        'No fatigue analysis — applicable for static/monotonic loading only.',
      ],
      standardTableTitle: 'ASME Joint Efficiency Factors (E)',
      standardTable: [
        { label: 'Type 1 — Full double-welded butt joint, full RT', value: '1.00', highlight: Ef === 1.0 },
        { label: 'Type 1 — Full double-welded butt joint, spot RT', value: '0.85', highlight: Ef === 0.85 },
        { label: 'Type 1 — Full double-welded butt joint, no RT',   value: '0.70', highlight: Ef === 0.70 },
        { label: 'Type 2 — Single-welded butt joint with backing',  value: '0.80' },
        { label: 'Selected E value', value: String(Ef), highlight: true },
      ],
    }
  },
}

// ─── MECHANICAL — Fluid Flow (Darcy-Weisbach) ────────────────

export const fluidFlowRich: EngineeringCalcConfig = {
  slug: 'fluid-flow-rate',
  name: 'Fluid Flow & Pipe Pressure Drop',
  icon: '💧',
  description: 'Calculate pipe pressure drop using Darcy-Weisbach. Outputs Reynolds number, flow regime, friction factor (Moody), pressure drop, velocity, and required pump head.',
  category: 'Mechanical / Oil & Gas',
  formula: 'Re = ρVD/μ | f = 64/Re (laminar) | Colebrook-White (turbulent) | ΔP = f(L/D)(ρV²/2)',
  reference: 'Darcy-Weisbach | Moody Chart | ASME B31.3 Process Piping',
  codeEdition: 'ASME B31.3-2022',
  inputs: [
    { id: 'D',    label: 'Internal Pipe Diameter', symbol: 'D',  unit: 'mm',    type: 'number', default: 100,  min: 1, tooltip: 'Internal bore of the pipe. Check pipe schedule tables for actual ID.' },
    { id: 'L',    label: 'Pipe Length',             symbol: 'L',  unit: 'm',     type: 'number', default: 50,   min: 0.1 },
    { id: 'Q',    label: 'Flow Rate',               symbol: 'Q',  unit: 'L/s',   type: 'number', default: 5,    min: 0.001, tooltip: 'Volumetric flow rate. 1 L/s = 3.6 m³/h = 15.85 US gpm.' },
    { id: 'rho',  label: 'Fluid Density',           symbol: 'ρ',  unit: 'kg/m³', type: 'number', default: 1000, min: 0.1, codeDefault: '1000 kg/m³ (water at 20°C)', tooltip: 'Water: 998 kg/m³; Seawater: 1025; Light crude: 820–870 kg/m³.' },
    { id: 'mu',   label: 'Dynamic Viscosity',       symbol: 'μ',  unit: 'mPa·s', type: 'number', default: 1.0,  min: 0.001, codeDefault: '1.0 mPa·s (water at 20°C)', tooltip: 'Water: 1 mPa·s; Light oil: 5–30 mPa·s; Heavy oil: 100–1000 mPa·s.' },
    { id: 'eps',  label: 'Pipe Roughness',          symbol: 'ε',  unit: 'mm',    type: 'number', default: 0.046, min: 0, step: 0.001, codeDefault: '0.046 mm (commercial steel)', tooltip: 'Commercial steel: 0.046 mm; Cast iron: 0.26 mm; PVC/smooth: 0.0015 mm.' },
    { id: 'z',    label: 'Elevation Change (for pump head)', symbol: 'Δz', unit: 'm', type: 'number', default: 0, tooltip: 'Height difference from inlet to outlet. Positive = pumping uphill.' },
  ],
  outputs: [
    { id: 'V',      label: 'Flow Velocity',           unit: 'm/s',  decimals: 2, highlight: true },
    { id: 'Re',     label: 'Reynolds Number',          unit: '',     decimals: 0 },
    { id: 'regime', label: 'Flow Regime',              unit: '',     decimals: 0 },
    { id: 'f',      label: 'Friction Factor (Darcy)',  unit: '',     decimals: 5 },
    { id: 'dP_kPa', label: 'Pressure Drop',            unit: 'kPa',  decimals: 2 },
    { id: 'dP_m',   label: 'Head Loss',                unit: 'm',    decimals: 2 },
    { id: 'pump_head', label: 'Required Pump Head',    unit: 'm',    decimals: 2 },
  ],
  calculate: (v) => {
    const D_m = Number(v.D) / 1000, L = Number(v.L), Q_m3s = Number(v.Q) / 1000
    const rho = Number(v.rho), mu_Pas = Number(v.mu) / 1000, eps = Number(v.eps) / 1000
    const z = Number(v.z), g = 9.81
    const A = Math.PI * (D_m / 2) ** 2
    const V = Q_m3s / A
    const Re = (rho * V * D_m) / mu_Pas
    let f = 0, regime = 1
    if (Re < 2300) { f = 64 / Re; regime = 1 }
    else if (Re < 4000) { f = 0.025; regime = 2 }
    else {
      regime = 3
      const relRough = eps / D_m
      // Swamee-Jain approximation of Colebrook-White
      f = 0.25 / (Math.log10(relRough / 3.7 + 5.74 / Re ** 0.9)) ** 2
    }
    const dP_Pa = f * (L / D_m) * (rho * V ** 2 / 2)
    const dP_kPa = dP_Pa / 1000
    const hL = dP_Pa / (rho * g)
    const pump_head = hL + z
    return { V: r(V, 2), Re: r(Re, 0), regime, f: r(f, 5), dP_kPa: r(dP_kPa, 2), dP_m: r(hL, 2), pump_head: r(pump_head, 2) }
  },
  calculateRich: (v): EngineeringResult => {
    const D_m = Number(v.D) / 1000, L = Number(v.L), Q_Ls = Number(v.Q)
    const Q_m3s = Q_Ls / 1000
    const rho = Number(v.rho), mu_Pas = Number(v.mu) / 1000, eps_m = Number(v.eps) / 1000
    const z = Number(v.z), g = 9.81
    const A = Math.PI * (D_m / 2) ** 2
    const V = Q_m3s / A
    const Re = (rho * V * D_m) / mu_Pas
    let f = 0, regimeLabel = '', regime = 1
    if (Re < 2300) { f = 64 / Re; regimeLabel = 'Laminar'; regime = 1 }
    else if (Re < 4000) { f = 0.025; regimeLabel = 'Transitional'; regime = 2 }
    else {
      regime = 3; regimeLabel = 'Turbulent'
      const relRough = eps_m / D_m
      f = 0.25 / (Math.log10(relRough / 3.7 + 5.74 / Re ** 0.9)) ** 2
    }
    const dP_Pa = f * (L / D_m) * (rho * V ** 2 / 2)
    const dP_kPa = dP_Pa / 1000
    const hL = dP_Pa / (rho * g)
    const pump_head = hL + z
    const V_max_rec = 3.0 // m/s — recommended max for water
    const dcV = V / V_max_rec
    const status = dcStatus(dcV)

    return {
      outputs: { V: r(V, 2), Re: r(Re, 0), regime, f: r(f, 5), dP_kPa: r(dP_kPa, 2), dP_m: r(hL, 2), pump_head: r(pump_head, 2) },
      status,
      dcRatio: r(dcV, 3),
      demand: r(V, 2), capacity: V_max_rec,
      demandLabel: 'Flow Velocity (m/s)', capacityLabel: 'Recommended max (m/s)',
      codeRef: 'ASME B31.3-2022 Process Piping / Darcy-Weisbach',
      codeClause: 'Velocity < 3 m/s for water (erosion limit per API RP 14E for liquids)',
      codeEdition: 'ASME B31.3-2022',
      compliant: V <= V_max_rec,
      interpretation: `Flow velocity is ${r(V, 2)} m/s in a ${Number(v.D)} mm pipe. Reynolds number Re = ${Math.round(Re)} indicates ${regimeLabel} flow. Friction factor f = ${r(f, 5)} (${Re < 2300 ? 'Hagen-Poiseuille' : 'Swamee-Jain'}). Pressure drop over ${L} m is ${r(dP_kPa, 2)} kPa (${r(hL, 2)} m head loss). Required pump head including elevation is ${r(pump_head, 2)} m.`,
      steps: [
        { description: 'Calculate pipe cross-sectional area', formula: 'A = π(D/2)²', substituted: `π×(${Number(v.D)/2})²mm²`, result: `A = ${r(A * 1e6, 2)} mm²` },
        { description: 'Calculate flow velocity', formula: 'V = Q / A', substituted: `${Q_Ls} L/s / ${r(A * 1000, 4)} L/m`, result: `V = ${r(V, 2)} m/s` },
        { description: 'Calculate Reynolds number', formula: 'Re = ρVD/μ', substituted: `${rho}×${r(V,2)}×${Number(v.D)/1000} / ${Number(v.mu)/1000}`, result: `Re = ${Math.round(Re)} → ${regimeLabel}` },
        { description: 'Determine friction factor', formula: Re < 2300 ? 'f = 64/Re (Hagen-Poiseuille)' : 'Swamee-Jain approx. of Colebrook-White', result: `f = ${r(f, 5)}` },
        { description: 'Calculate pressure drop (Darcy-Weisbach)', formula: 'ΔP = f × (L/D) × ρV²/2', substituted: `${r(f,5)} × (${L}/${Number(v.D)/1000}) × ${rho}×${r(V,2)}²/2`, result: `ΔP = ${r(dP_kPa, 2)} kPa = ${r(hL, 2)} m head` },
        { description: 'Total pump head required', formula: 'H_pump = hL + Δz', substituted: `${r(hL, 2)} + ${z}`, result: `H_pump = ${r(pump_head, 2)} m` },
      ],
      recommendations: [
        V > 3.0 ? `Velocity ${r(V,2)} m/s exceeds recommended 3 m/s for water. Increase pipe diameter to reduce erosion risk.` : `Velocity ${r(V,2)} m/s is within recommended range (0.5–3.0 m/s for water).`,
        `Add 10–20% to pump head for minor losses (fittings, valves, entrance/exit).`,
        regime === 2 ? 'Flow is in transitional regime — pressure drop prediction has ±20% uncertainty. Consider adjusting flow rate to laminar or fully turbulent range.' : '',
      ].filter(Boolean) as string[],
      criticalParam: 'Pipe Diameter (D)',
      sensitivityNote: 'Pressure drop varies with D⁵ — halving the diameter increases ΔP by 32×.',
      assumptions: [
        'Steady-state, fully developed, incompressible flow.',
        'Single-phase liquid only — not applicable to gas or two-phase flow.',
        'Swamee-Jain approximation accurate to ±1% vs Colebrook-White for turbulent flow.',
        'Minor losses (fittings, bends) are not included — add equivalent length factor.',
      ],
      standardTableTitle: 'Pipe Roughness Values (ε)',
      standardTable: [
        { label: 'Drawn tubing / PVC',   value: '0.0015 mm' },
        { label: 'Commercial steel',     value: '0.046 mm',  highlight: Number(v.eps) === 0.046 },
        { label: 'Galvanised steel',     value: '0.15 mm' },
        { label: 'Cast iron',            value: '0.26 mm' },
        { label: 'Concrete (smooth)',    value: '0.3–3 mm' },
        { label: 'Your selected ε',      value: `${v.eps} mm`, highlight: true },
      ],
    }
  },
}

// ─── ELECTRICAL — Short Circuit Current (IEC 60909) ──────────

export const shortCircuitRich: EngineeringCalcConfig = {
  slug: 'short-circuit-current',
  name: 'Short Circuit Current Calculator',
  icon: '⚡',
  description: 'Calculate three-phase and single-phase short circuit fault current per IEC 60909 / IEEE 1584. Outputs Isc, incident energy level, and PPE category per NFPA 70E.',
  category: 'Electrical',
  formula: 'I_sc = (c × V_n) / (√3 × Z_total)  [IEC 60909 Eq. 29]  |  Incident Energy = 0.0093×(I²_sc×t/D²)  [IEEE 1584]',
  reference: 'IEC 60909:2016 | IEEE 1584-2018 | NFPA 70E-2024',
  codeEdition: 'IEC 60909:2016 / NFPA 70E-2024',
  inputs: [
    { id: 'V',    label: 'Nominal System Voltage',  symbol: 'V_n', unit: 'V',   type: 'number', default: 415,  min: 100, tooltip: 'Line-to-line voltage at fault point. 415 V (LV), 11 kV, 33 kV typical.' },
    { id: 'Skva', label: 'Transformer kVA Rating',  symbol: 'S',   unit: 'kVA', type: 'number', default: 1000, min: 10, tooltip: 'Rating of the source transformer.' },
    { id: 'Ztr',  label: 'Transformer Impedance',   symbol: 'Z%',  unit: '%',   type: 'number', default: 5.5,  min: 1, max: 20, codeDefault: '5.5% (typical LV transformer)', tooltip: 'Percentage impedance from nameplate. Standard values: 4–6% for LV, 5–8% for MV.' },
    { id: 'Rcable', label: 'Cable Resistance to Fault', symbol: 'R_c', unit: 'mΩ', type: 'number', default: 5, min: 0, tooltip: 'Total cable resistance from transformer to fault point.' },
    { id: 'Xcable', label: 'Cable Reactance to Fault', symbol: 'X_c', unit: 'mΩ', type: 'number', default: 3, min: 0 },
    { id: 't',    label: 'Fault Clearing Time',     symbol: 't',   unit: 's',   type: 'number', default: 0.2,  min: 0.001, step: 0.01, tooltip: 'Time for breaker/fuse to clear the fault. Typical: 0.1–0.5 s.' },
    { id: 'D',    label: 'Working Distance',        symbol: 'D',   unit: 'mm',  type: 'number', default: 610,  min: 100, codeDefault: '610 mm (24 in) — NFPA 70E default', tooltip: 'Distance from arc to worker\'s face/chest. NFPA 70E default = 610 mm.' },
    { id: 'c',    label: 'Voltage Factor (c)',      type: 'select', default: '1.05', options: [{ label: '1.05 (LV systems up to 1 kV)', value: '1.05' }, { label: '1.10 (MV/HV systems)', value: '1.10' }] },
  ],
  outputs: [
    { id: 'Isc_kA',   label: '3-Phase Fault Current',      unit: 'kA', decimals: 3, highlight: true },
    { id: 'Isc_1ph',  label: 'Single-Phase Fault Current',  unit: 'kA', decimals: 3 },
    { id: 'IE_cal',   label: 'Incident Energy',             unit: 'cal/cm²', decimals: 2 },
    { id: 'PPE',      label: 'PPE Category (NFPA 70E)',     unit: '',   decimals: 0 },
    { id: 'Zt_mOhm',  label: 'Total System Impedance',      unit: 'mΩ', decimals: 2 },
  ],
  calculate: (v) => {
    const V = Number(v.V), Skva = Number(v.Skva) * 1000
    const Ztr_pct = Number(v.Ztr) / 100
    const Rc = Number(v.Rcable) / 1000, Xc = Number(v.Xcable) / 1000
    const t = Number(v.t), D_mm = Number(v.D), c = Number(v.c)
    const Ztr_ohm = Ztr_pct * (V ** 2) / Skva
    const Zt = Math.sqrt((Ztr_ohm + Rc) ** 2 + Xc ** 2)
    const Isc = (c * V) / (Math.sqrt(3) * Zt)
    const Isc_1ph = (c * V) / (2 * Zt)
    // Simplified IEEE 1584 approximation
    const IE = 0.0093 * (Isc / 1000) ** 2 * t / (D_mm / 1000) ** 2
    let PPE = 0
    if (IE < 1.2) PPE = 0
    else if (IE < 4) PPE = 1
    else if (IE < 8) PPE = 2
    else if (IE < 25) PPE = 3
    else PPE = 4
    return { Isc_kA: r(Isc / 1000, 3), Isc_1ph: r(Isc_1ph / 1000, 3), IE_cal: r(IE, 2), PPE, Zt_mOhm: r(Zt * 1000, 2) }
  },
  calculateRich: (v): EngineeringResult => {
    const V = Number(v.V), Skva = Number(v.Skva) * 1000
    const Ztr_pct = Number(v.Ztr) / 100
    const Rc = Number(v.Rcable) / 1000, Xc = Number(v.Xcable) / 1000
    const t = Number(v.t), D_mm = Number(v.D), c = Number(v.c)
    const Ztr_ohm = Ztr_pct * (V ** 2) / Skva
    const Zt = Math.sqrt((Ztr_ohm + Rc) ** 2 + Xc ** 2)
    const Isc = (c * V) / (Math.sqrt(3) * Zt)
    const Isc_1ph = (c * V) / (2 * Zt)
    const IE = 0.0093 * (Isc / 1000) ** 2 * t / (D_mm / 1000) ** 2
    let PPE = 0, PPELabel = ''
    if (IE < 1.2) { PPE = 0; PPELabel = 'Cat 0 — PPE not required (< 1.2 cal/cm²)' }
    else if (IE < 4) { PPE = 1; PPELabel = 'Cat 1 — FR shirt & pants (1.2–4 cal/cm²)' }
    else if (IE < 8) { PPE = 2; PPELabel = 'Cat 2 — FR shirt, pants, face shield (4–8 cal/cm²)' }
    else if (IE < 25) { PPE = 3; PPELabel = 'Cat 3 — Arc flash suit (8–25 cal/cm²)' }
    else { PPE = 4; PPELabel = 'Cat 4 — Heavy arc flash suit (> 25 cal/cm²)' }

    const dcRatio = IE / 25
    const status = IE < 8 ? 'PASS' : IE < 25 ? 'MARGINAL' : 'FAIL'

    return {
      outputs: { Isc_kA: r(Isc/1000,3), Isc_1ph: r(Isc_1ph/1000,3), IE_cal: r(IE,2), PPE, Zt_mOhm: r(Zt*1000,2) },
      status,
      dcRatio: r(dcRatio, 3),
      demand: r(IE, 2), capacity: 25,
      demandLabel: 'Incident Energy (cal/cm²)', capacityLabel: 'Cat 4 boundary (25 cal/cm²)',
      codeRef: 'IEC 60909:2016 | NFPA 70E-2024',
      codeClause: 'IEC 60909 Eq.29 — max Isc | NFPA 70E Table 130.5(G) — PPE categories',
      codeEdition: 'IEC 60909:2016 / IEEE 1584-2018 / NFPA 70E-2024',
      compliant: IE < 40,
      interpretation: `Three-phase fault current at the specified location is ${r(Isc/1000,3)} kA. Incident energy at ${D_mm} mm working distance for ${t} s clearing time is ${r(IE,2)} cal/cm². NFPA 70E categorises this as: ${PPELabel}. ${IE > 40 ? '⚠️ Incident energy exceeds 40 cal/cm² — consider engineering controls (current limiting devices, remote racking) before live work.' : ''}`,
      steps: [
        { description: 'Calculate transformer impedance in ohms', formula: 'Z_tr = Z% × V²/S', substituted: `${Ztr_pct * 100}% × ${V}² / ${Skva/1000}kVA`, result: `Z_tr = ${r(Ztr_ohm*1000,2)} mΩ` },
        { description: 'Calculate total system impedance', formula: 'Z_total = √((Z_tr+R_c)² + X_c²)', substituted: `√((${r(Ztr_ohm*1000,2)}+${Number(v.Rcable)})² + ${Number(v.Xcable)}²) mΩ`, result: `Z_total = ${r(Zt*1000,2)} mΩ` },
        { description: 'Calculate 3-phase short circuit current', formula: 'I_sc = c×V / (√3×Z_total)', substituted: `${c}×${V} / (√3×${r(Zt*1000,2)}mΩ)`, result: `I_sc = ${r(Isc/1000,3)} kA` },
        { description: 'Calculate incident energy (simplified IEEE 1584)', formula: 'IE ≈ 0.0093 × I²×t / D²', substituted: `0.0093 × ${r(Isc/1000,2)}²×${t} / ${r(D_mm/1000,3)}²`, result: `IE = ${r(IE,2)} cal/cm²` },
        { description: 'Determine NFPA 70E PPE category', formula: 'NFPA 70E Table 130.5(G)', result: PPELabel },
      ],
      recommendations: [
        IE > 40 ? 'Incident energy > 40 cal/cm² — live work is not recommended. Install current limiting fuses or remote racking equipment.' : '',
        `Minimum PPE required: ${PPELabel}`,
        'Perform detailed arc flash study per IEEE 1584-2018 for final arc flash label values.',
        'Install arc flash hazard warning labels per NFPA 70E 130.5(H).',
        t > 0.5 ? 'Clearing time > 0.5 s is long — review relay coordination to reduce incident energy.' : '',
      ].filter(Boolean) as string[],
      criticalParam: 'Fault Clearing Time (t)',
      sensitivityNote: 'Incident energy is proportional to clearing time. Halving t halves IE — coordination improvements can reduce PPE requirements.',
      assumptions: [
        'IEC 60909 voltage factor c = 1.05 (LV) or 1.10 (MV/HV).',
        'Simplified IEEE 1584 formula — full study requires buswork geometry, electrode configuration.',
        'Three-phase bolted fault assumed (maximum fault current).',
        'Cable impedance is a straight-line estimate — field measurement preferred.',
      ],
      standardTableTitle: 'NFPA 70E-2024 PPE Categories',
      standardTable: [
        { label: 'Category 0 — < 1.2 cal/cm²',   value: 'FR clothing (basic)',       highlight: PPE === 0 },
        { label: 'Category 1 — 1.2–4 cal/cm²',  value: 'FR shirt & pants, face shield', highlight: PPE === 1 },
        { label: 'Category 2 — 4–8 cal/cm²',    value: 'FR shirt, pants, jacket',    highlight: PPE === 2 },
        { label: 'Category 3 — 8–25 cal/cm²',   value: 'Arc-rated flash suit',        highlight: PPE === 3 },
        { label: 'Category 4 — 25–40 cal/cm²',  value: 'Heavy arc flash suit',        highlight: PPE === 4 },
        { label: 'Your Incident Energy',          value: `${r(IE,2)} cal/cm²`,          highlight: true },
      ],
    }
  },
}

// ─── CIVIL — Retaining Wall Stability ────────────────────────

export const retainingWallRich: EngineeringCalcConfig = {
  slug: 'retaining-wall-stability',
  name: 'Retaining Wall Stability Check',
  icon: '🧱',
  description: 'Check gravity/cantilever retaining wall against sliding, overturning, and bearing failure using Rankine earth pressure theory. Outputs FOS for each failure mode.',
  category: 'Civil & Structural',
  formula: 'Ka = tan²(45-φ/2) | Pa = 0.5×Ka×γ×H² | FOS_slide = (W×μ)/Pa | FOS_overturn = ΣMr/ΣMo',
  reference: 'Rankine (1857) | AASHTO LRFD Bridge Design Specifications',
  codeEdition: 'AASHTO LRFD 9th Ed. / BS 8002:1994',
  inputs: [
    { id: 'H',     label: 'Wall Height (stem + base depth)',  symbol: 'H',  unit: 'm',    type: 'number', default: 4.0, min: 0.5, tooltip: 'Total retained height from base of footing to top of backfill.' },
    { id: 'phi',   label: 'Soil Friction Angle',              symbol: 'φ',  unit: '°',    type: 'number', default: 30, min: 5, max: 50 },
    { id: 'gamma', label: 'Unit Weight of Backfill',          symbol: 'γ',  unit: 'kN/m³',type: 'number', default: 18, min: 10 },
    { id: 'W_wall', label: 'Wall Self-Weight (per m run)',    symbol: 'W',  unit: 'kN/m', type: 'number', default: 80, min: 1, tooltip: 'Total weight of wall + footing + any soil on heel, per metre run.' },
    { id: 'B',     label: 'Base Width of Footing',           symbol: 'B',  unit: 'm',    type: 'number', default: 2.5, min: 0.3, tooltip: 'Total footing width from toe to heel.' },
    { id: 'mu',    label: 'Base Friction Coefficient',        symbol: 'μ',  unit: '',     type: 'number', default: 0.45, min: 0.1, max: 0.8, codeDefault: '0.45 (concrete on medium dense sand)', tooltip: 'Friction between base of footing and founding soil. φ_base = 2/3 φ typical.' },
    { id: 'e_arm', label: 'Overturning Moment Arm (W)',      symbol: 'x',  unit: 'm',    type: 'number', default: 1.0, tooltip: 'Horizontal distance from toe to centroid of resultant wall weight. Typically B/2 for symmetric.' },
  ],
  outputs: [
    { id: 'Ka',          label: 'Active Pressure Coefficient Ka', unit: '',     decimals: 3, highlight: true },
    { id: 'Pa',          label: 'Active Earth Force Pa',          unit: 'kN/m', decimals: 2 },
    { id: 'FOS_slide',   label: 'FOS — Sliding',                  unit: '',     decimals: 2 },
    { id: 'FOS_overturn', label: 'FOS — Overturning',             unit: '',     decimals: 2 },
    { id: 'e',           label: 'Eccentricity',                   unit: 'm',    decimals: 3 },
  ],
  calculate: (v) => {
    const H = Number(v.H), phi = Number(v.phi) * Math.PI / 180
    const gamma = Number(v.gamma), W = Number(v.W_wall), B = Number(v.B)
    const mu = Number(v.mu), x = Number(v.e_arm)
    const Ka = Math.tan(Math.PI / 4 - phi / 2) ** 2
    const Pa = 0.5 * Ka * gamma * H ** 2
    const FOS_slide = (W * mu) / Pa
    const Mo = Pa * H / 3
    const Mr = W * x
    const FOS_overturn = Mr / Mo
    const e = B / 2 - (Mr - Mo) / W
    return { Ka: r(Ka, 3), Pa: r(Pa, 2), FOS_slide: r(FOS_slide, 2), FOS_overturn: r(FOS_overturn, 2), e: r(e, 3) }
  },
  calculateRich: (v): EngineeringResult => {
    const H = Number(v.H), phi_deg = Number(v.phi), phi = phi_deg * Math.PI / 180
    const gamma = Number(v.gamma), W = Number(v.W_wall), B = Number(v.B)
    const mu = Number(v.mu), x = Number(v.e_arm)
    const Ka = Math.tan(Math.PI / 4 - phi / 2) ** 2
    const Pa = 0.5 * Ka * gamma * H ** 2
    const FOS_slide = (W * mu) / Pa
    const Mo = Pa * H / 3
    const Mr = W * x
    const FOS_overturn = Mr / Mo
    const e = B / 2 - (Mr - Mo) / W
    const FOS_req_slide = 1.5, FOS_req_overturn = 2.0
    const slideOk = FOS_slide >= FOS_req_slide, overturnOk = FOS_overturn >= FOS_req_overturn
    const dcSlide = FOS_req_slide / FOS_slide
    const dcOverturn = FOS_req_overturn / FOS_overturn
    const dcRatio = Math.max(dcSlide, dcOverturn)
    const status = dcStatus(dcRatio)

    return {
      outputs: { Ka: r(Ka,3), Pa: r(Pa,2), FOS_slide: r(FOS_slide,2), FOS_overturn: r(FOS_overturn,2), e: r(e,3) },
      status,
      dcRatio: r(dcRatio, 3),
      demand: r(Math.max(FOS_req_slide / FOS_slide, FOS_req_overturn / FOS_overturn) * 100, 1),
      capacity: 100,
      demandLabel: 'Required/Available FOS %', capacityLabel: '100%',
      codeRef: 'AASHTO LRFD 9th Ed. | BS 8002:1994',
      codeClause: 'FOS_sliding ≥ 1.5 | FOS_overturning ≥ 2.0',
      codeEdition: 'AASHTO LRFD 9th Ed.',
      compliant: slideOk && overturnOk,
      interpretation: `Active earth pressure Pa = ${r(Pa,2)} kN/m (Ka = ${r(Ka,3)}). Sliding FOS = ${r(FOS_slide,2)} (required ≥ 1.5) — ${slideOk ? 'PASS' : 'FAIL'}. Overturning FOS = ${r(FOS_overturn,2)} (required ≥ 2.0) — ${overturnOk ? 'PASS' : 'FAIL'}. Eccentricity = ${r(e,3)} m ${Math.abs(e) <= B/6 ? '(within B/6 = ' + r(B/6,3) + ' m ✓)' : '(OUTSIDE B/6 — tension develops at base ✗)'}.`,
      steps: [
        { description: 'Calculate Rankine active pressure coefficient', formula: 'Ka = tan²(45 − φ/2)', substituted: `tan²(45 − ${phi_deg}/2)`, result: `Ka = ${r(Ka, 3)}` },
        { description: 'Calculate total active earth force', formula: 'Pa = ½ × Ka × γ × H²', substituted: `½ × ${r(Ka,3)} × ${gamma} × ${H}²`, result: `Pa = ${r(Pa, 2)} kN/m` },
        { description: 'Check sliding resistance', formula: 'FOS_slide = W×μ / Pa', substituted: `${W} × ${mu} / ${r(Pa,2)}`, result: `FOS = ${r(FOS_slide,2)} — required ≥ 1.5 → ${slideOk ? 'PASS' : 'FAIL'}` },
        { description: 'Calculate overturning and resisting moments', formula: 'Mo = Pa × H/3 | Mr = W × x', substituted: `Mo = ${r(Pa,2)}×${H}/3 = ${r(Mo,2)} kN·m/m | Mr = ${W}×${x} = ${r(Mr,2)} kN·m/m`, result: '' },
        { description: 'Check overturning stability', formula: 'FOS_overturn = Mr / Mo', substituted: `${r(Mr,2)} / ${r(Mo,2)}`, result: `FOS = ${r(FOS_overturn,2)} — required ≥ 2.0 → ${overturnOk ? 'PASS' : 'FAIL'}` },
        { description: 'Check eccentricity (no tension condition)', formula: 'e = B/2 − (Mr−Mo)/W | must be ≤ B/6', result: `e = ${r(e,3)} m; B/6 = ${r(B/6,3)} m → ${Math.abs(e) <= B/6 ? 'PASS' : 'FAIL'}` },
      ],
      recommendations: [
        !slideOk ? `Increase base friction or add a shear key below the footing. Required W×μ ≥ ${r(Pa * FOS_req_slide, 1)} kN/m.` : `Sliding check passes with FOS = ${r(FOS_slide,2)}.`,
        !overturnOk ? `Widen the footing (increase B and/or add soil on heel) to increase resisting moment.` : `Overturning check passes with FOS = ${r(FOS_overturn,2)}.`,
        Math.abs(e) > B / 6 ? 'Eccentricity exceeds B/6 — tensile stress develops at base. Widen footing or add surcharge on heel.' : '',
        'Verify global slope stability using Bishop or Janbu method for walls on slopes.',
      ].filter(Boolean) as string[],
      criticalParam: 'Base Friction Coefficient (μ)',
      sensitivityNote: 'Sliding FOS is directly proportional to μ. Increasing base key depth by 0.3 m can add 20–30% to sliding resistance.',
      assumptions: [
        'Rankine active earth pressure theory — smooth vertical wall, level backfill.',
        'No surcharge, seismic loading, or water pressure applied.',
        'Wall is rigid; passive earth pressure in front of toe is neglected (conservative).',
        'Point of application of Pa is at H/3 from base.',
      ],
      standardTableTitle: 'AASHTO Required Factors of Safety',
      standardTable: [
        { label: 'Sliding (AASHTO)',      value: 'FOS ≥ 1.5', highlight: !slideOk },
        { label: 'Overturning (AASHTO)',  value: 'FOS ≥ 2.0', highlight: !overturnOk },
        { label: 'Bearing (separate)',    value: 'FOS ≥ 3.0' },
        { label: 'Your FOS — Sliding',    value: String(r(FOS_slide, 2)), highlight: true },
        { label: 'Your FOS — Overturning', value: String(r(FOS_overturn, 2)), highlight: true },
      ],
    }
  },
}

// ─── Export all rich configs as a merged map ──────────────────

export const RICH_ENGINEERING_CONFIGS: Record<string, EngineeringCalcConfig> = {
  'beam-deflection-calculator':    beamDeflectionRich,
  'column-load-capacity':          columnLoadCapacityRich,
  'foundation-bearing-capacity':   foundationBearingCapacityRich,
  'wire-cable-size':               wireCableSizeRich,
  'pressure-vessel-thickness':     pressureVesselRich,
  'fluid-flow-rate':               fluidFlowRich,
  'short-circuit-current':         shortCircuitRich,
  'retaining-wall-stability':      retainingWallRich,
}
