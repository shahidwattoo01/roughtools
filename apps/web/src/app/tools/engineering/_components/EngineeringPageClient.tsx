'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

/* ── Palette ──────────────────────────────────────────────────── */
const PALETTE: Record<string, {
  card: string; cardActive: string; border: string; borderActive: string;
  icon: string; badge: string; text: string;
  toolBg: string; toolBorder: string; toolIconBg: string;
}> = {
  sky:     { card:'bg-sky-50',     cardActive:'bg-sky-600',     border:'border-sky-200',     borderActive:'border-sky-600',     icon:'bg-sky-100 text-sky-600',     badge:'bg-sky-600',     text:'text-sky-700',     toolBg:'bg-sky-50',     toolBorder:'border-sky-200',     toolIconBg:'bg-sky-100' },
  blue:    { card:'bg-blue-50',    cardActive:'bg-blue-600',    border:'border-blue-200',    borderActive:'border-blue-600',    icon:'bg-blue-100 text-blue-600',    badge:'bg-blue-600',    text:'text-blue-700',    toolBg:'bg-blue-50',    toolBorder:'border-blue-200',    toolIconBg:'bg-blue-100' },
  indigo:  { card:'bg-indigo-50',  cardActive:'bg-indigo-600',  border:'border-indigo-200',  borderActive:'border-indigo-600',  icon:'bg-indigo-100 text-indigo-600',  badge:'bg-indigo-600',  text:'text-indigo-700',  toolBg:'bg-indigo-50',  toolBorder:'border-indigo-200',  toolIconBg:'bg-indigo-100' },
  teal:    { card:'bg-teal-50',    cardActive:'bg-teal-600',    border:'border-teal-200',    borderActive:'border-teal-600',    icon:'bg-teal-100 text-teal-600',    badge:'bg-teal-600',    text:'text-teal-700',    toolBg:'bg-teal-50',    toolBorder:'border-teal-200',    toolIconBg:'bg-teal-100' },
  orange:  { card:'bg-orange-50',  cardActive:'bg-orange-500',  border:'border-orange-200',  borderActive:'border-orange-500',  icon:'bg-orange-100 text-orange-600',  badge:'bg-orange-500',  text:'text-orange-700',  toolBg:'bg-orange-50',  toolBorder:'border-orange-200',  toolIconBg:'bg-orange-100' },
  green:   { card:'bg-green-50',   cardActive:'bg-green-600',   border:'border-green-200',   borderActive:'border-green-600',   icon:'bg-green-100 text-green-600',   badge:'bg-green-600',   text:'text-green-700',   toolBg:'bg-green-50',   toolBorder:'border-green-200',   toolIconBg:'bg-green-100' },
  purple:  { card:'bg-purple-50',  cardActive:'bg-purple-600',  border:'border-purple-200',  borderActive:'border-purple-600',  icon:'bg-purple-100 text-purple-600',  badge:'bg-purple-600',  text:'text-purple-700',  toolBg:'bg-purple-50',  toolBorder:'border-purple-200',  toolIconBg:'bg-purple-100' },
  amber:   { card:'bg-amber-50',   cardActive:'bg-amber-500',   border:'border-amber-200',   borderActive:'border-amber-500',   icon:'bg-amber-100 text-amber-600',   badge:'bg-amber-500',   text:'text-amber-700',   toolBg:'bg-amber-50',   toolBorder:'border-amber-200',   toolIconBg:'bg-amber-100' },
  rose:    { card:'bg-rose-50',    cardActive:'bg-rose-500',    border:'border-rose-200',    borderActive:'border-rose-500',    icon:'bg-rose-100 text-rose-600',    badge:'bg-rose-500',    text:'text-rose-700',    toolBg:'bg-rose-50',    toolBorder:'border-rose-200',    toolIconBg:'bg-rose-100' },
  cyan:    { card:'bg-cyan-50',    cardActive:'bg-cyan-600',    border:'border-cyan-200',    borderActive:'border-cyan-600',    icon:'bg-cyan-100 text-cyan-600',    badge:'bg-cyan-600',    text:'text-cyan-700',    toolBg:'bg-cyan-50',    toolBorder:'border-cyan-200',    toolIconBg:'bg-cyan-100' },
}

/* ── Disciplines ──────────────────────────────────────────────── */
const BASE = '/tools/engineering'
const DISCIPLINES = [
  {
    id: 'civil-structural', label: 'Civil & Structural', icon: '🏗️', color: 'sky',
    description: 'Beam design, concrete, foundations, earthworks, ASCE & ACI codes',
    tools: [
      { name: 'Beam Deflection Calculator',    href:`${BASE}/beam-deflection-calculator`,   icon:'📐', description:'Simply supported, cantilever & continuous beams' },
      { name: 'Concrete Mix Design',           href:`${BASE}/concrete-mix-design`,           icon:'🪨', description:'M10–M40 grade cement:sand:aggregate ratios' },
      { name: 'Column Load Capacity',          href:`${BASE}/column-load-capacity`,          icon:'🏛️', description:'Axial, buckling & slenderness ratio' },
      { name: 'Retaining Wall Stability',      href:`${BASE}/retaining-wall-stability`,      icon:'🧱', description:'Overturning & sliding check' },
      { name: 'Foundation Bearing Capacity',   href:`${BASE}/foundation-bearing-capacity`,   icon:'⬜', description:'Terzaghi & Meyerhof equations' },
      { name: 'Steel Section Properties',      href:`${BASE}/steel-section-properties`,      icon:'🔩', description:'I, S, Z, r for W, S, C, L sections' },
      { name: 'Rebar Quantity Estimator',      href:`${BASE}/rebar-quantity-estimator`,      icon:'🔗', description:'Spacing, cover & lap length' },
      { name: 'Concrete Volume Calculator',    href:`${BASE}/concrete-volume-calculator`,    icon:'📦', description:'Slab, column, beam & footing volumes' },
      { name: 'Wind Load Calculator',          href:`${BASE}/wind-load-calculator`,          icon:'💨', description:'ASCE 7 / Eurocode EN 1991' },
      { name: 'Truss Member Force Solver',     href:`${BASE}/truss-member-force`,            icon:'🔱', description:'Method of joints & sections' },
      { name: 'Moment of Inertia Calculator',  href:`${BASE}/moment-of-inertia-calculator`,  icon:'🔲', description:'Composite & custom cross-sections' },
      { name: 'Pile Load Capacity',            href:`${BASE}/pile-load-capacity`,            icon:'🗜️', description:'Skin friction & end bearing' },
      { name: 'Slab Reinforcement Designer',   href:`${BASE}/slab-reinforcement-designer`,   icon:'🟦', description:'One-way & two-way slab design' },
      { name: 'Earthwork Cut & Fill',          href:`${BASE}/earthwork-cut-fill`,            icon:'⛰️', description:'Prismoidal & average-end area method' },
      { name: 'Asphalt Pavement Thickness',    href:`${BASE}/asphalt-pavement-thickness`,    icon:'🛣️', description:'CBR & AASHTO design method' },
      { name: 'Slope Stability (FOS)',         href:`${BASE}/slope-stability-fos`,           icon:'⛰️', description:"Bishop's simplified method" },
      { name: 'Soil Bearing Pressure',         href:`${BASE}/soil-bearing-pressure`,         icon:'🌍', description:'Net vs gross ultimate bearing' },
      { name: 'Construction Cost Estimator',   href:`${BASE}/construction-cost-estimator`,   icon:'💰', description:'Material + labor by project type' },
    ],
  },
  {
    id: 'electrical', label: 'Electrical Engineering', icon: '⚡', color: 'amber',
    description: 'Power systems, wiring, solar, protection, NEC & IEC standards',
    tools: [
      { name: "Ohm's Law Calculator",          href:`${BASE}/ohms-law-calculator`,           icon:'⚡', description:'V, I, R, P — all combinations' },
      { name: 'Wire & Cable Size Calculator',  href:`${BASE}/wire-cable-size`,               icon:'🔌', description:'AWG & mm² current capacity' },
      { name: 'Voltage Drop Calculator',       href:`${BASE}/voltage-drop-calculator`,       icon:'📉', description:'NEC & IEC compliant' },
      { name: '3-Phase Power Calculator',      href:`${BASE}/three-phase-power-calculator`,  icon:'🔋', description:'kW, kVA, kVAR & power factor' },
      { name: 'Transformer Sizing Tool',       href:`${BASE}/transformer-sizing`,            icon:'🔄', description:'kVA selection & turns ratio' },
      { name: 'Motor Starting Current',        href:`${BASE}/motor-starting-current`,        icon:'🔃', description:'Inrush & locked-rotor current' },
      { name: 'Solar Panel & Battery Sizing',  href:`${BASE}/solar-panel-battery-sizing`,    icon:'☀️', description:'kWh/day, panel count, bank size' },
      { name: 'LED Energy Savings',            href:`${BASE}/led-energy-savings`,            icon:'💡', description:'kWh vs cost comparison' },
      { name: 'Circuit Breaker Sizing',        href:`${BASE}/circuit-breaker-sizing`,        icon:'🔲', description:'NEC 80% rule & coordination' },
      { name: 'Capacitor Bank Sizing',         href:`${BASE}/capacitor-bank-sizing`,         icon:'🔋', description:'kVAR for power factor correction' },
      { name: 'UPS Battery Backup Calculator', href:`${BASE}/ups-battery-backup`,            icon:'🔋', description:'Runtime & AH estimation' },
      { name: 'Power Factor Correction',       href:`${BASE}/power-factor-correction`,       icon:'📊', description:'Capacitor size from kW & PF' },
      { name: 'Short Circuit Current (SCC)',   href:`${BASE}/short-circuit-current`,         icon:'⚠️', description:'Symmetrical fault calculation' },
      { name: 'Conduit Fill Calculator',       href:`${BASE}/conduit-fill-calculator`,       icon:'🚇', description:'NEC Chapter 9 Table compliance' },
      { name: 'PV System ROI Calculator',      href:`${BASE}/pv-system-roi`,                 icon:'💹', description:'Payback period & IRR' },
      { name: 'Battery State of Charge',       href:`${BASE}/battery-state-of-charge`,       icon:'🔋', description:'DoD, cycles & capacity fade' },
      { name: 'Earthing / Grounding Resistance',href:`${BASE}/earthing-grounding-resistance`,icon:'🌱', description:'Rod, grid & plate electrodes' },
      { name: 'Load Schedule / Panel Board',   href:`${BASE}/load-schedule-panel`,           icon:'📋', description:'Branch circuit load estimator' },
    ],
  },
  {
    id: 'mechanical', label: 'Mechanical Engineering', icon: '⚙️', color: 'blue',
    description: 'Fasteners, thermodynamics, fluid mechanics, machining, ASME',
    tools: [
      { name: 'Bolt Torque Calculator',        href:`${BASE}/bolt-torque-calculator`,        icon:'🔩', description:'Clamping force vs applied torque' },
      { name: 'Gear Ratio Calculator',         href:`${BASE}/gear-ratio-calculator`,         icon:'⚙️', description:'Speed, torque & efficiency' },
      { name: 'HP / kW Converter',             href:`${BASE}/hp-kw-converter`,               icon:'🔄', description:'Shaft power conversions' },
      { name: 'Pressure Vessel Thickness',     href:`${BASE}/pressure-vessel-thickness`,     icon:'🫙', description:'ASME Section VIII Div. 1' },
      { name: 'Fluid Flow Rate Calculator',    href:`${BASE}/fluid-flow-rate`,               icon:'💧', description:'Bernoulli & continuity equation' },
      { name: 'Heat Transfer Calculator',      href:`${BASE}/heat-transfer-calculator`,      icon:'🌡️', description:'Conduction, convection, radiation' },
      { name: 'Pump Head & Flow Sizing',       href:`${BASE}/pump-head-flow`,                icon:'💧', description:'Centrifugal pump selection' },
      { name: 'Spring Constant Calculator',    href:`${BASE}/spring-constant-calculator`,    icon:'🌀', description:"Hooke's law & spring design" },
      { name: 'Belt & Pulley Speed',           href:`${BASE}/belt-pulley-speed`,             icon:'⭕', description:'V-belt drive design' },
      { name: 'CNC Feeds & Speeds',            href:`${BASE}/cnc-feeds-speeds`,              icon:'🔄', description:'SFM, RPM, feed per tooth' },
      { name: 'Tolerance Stack-up',            href:`${BASE}/tolerance-stack-up`,            icon:'📏', description:'Worst-case & RSS method' },
      { name: 'Fatigue Life Estimator',        href:`${BASE}/fatigue-life-estimator`,        icon:'📊', description:"S-N curve & Miner's rule" },
      { name: 'Thermal Expansion Calculator',  href:`${BASE}/thermal-expansion-calculator`,  icon:'🌡️', description:'Linear & volumetric expansion' },
      { name: 'Bearing Life (L10) Calculator', href:`${BASE}/bearing-life-calculator`,       icon:'🔘', description:'Dynamic load rating & rpm' },
      { name: 'Stress & Strain Calculator',    href:`${BASE}/stress-strain-calculator`,      icon:'📐', description:"Young's modulus, yield, UTS" },
      { name: 'Reynolds Number Calculator',    href:`${BASE}/reynolds-number-calculator`,    icon:'🌊', description:'Laminar vs turbulent flow' },
      { name: 'Vibration Frequency Tool',      href:`${BASE}/vibration-frequency`,           icon:'〰️', description:'Natural frequency & resonance' },
      { name: 'Hydraulic Cylinder Force',      href:`${BASE}/hydraulic-cylinder-force`,      icon:'🔧', description:'Force, speed & flow rate' },
    ],
  },
  {
    id: 'hvac', label: 'HVAC & Building Services', icon: '🌬️', color: 'teal',
    description: 'Cooling loads, ductwork, insulation, ventilation, ASHRAE standards',
    tools: [
      { name: 'Cooling Load Calculator',       href:`${BASE}/cooling-load-calculator`,       icon:'❄️', description:'BTU/hr for room or building' },
      { name: 'Heating Load Estimator',        href:`${BASE}/heating-load-estimator`,        icon:'🔥', description:'Heat loss by degree-day method' },
      { name: 'Duct Sizing Calculator',        href:`${BASE}/duct-sizing-calculator`,        icon:'🌬️', description:'Velocity & static pressure method' },
      { name: 'Psychrometric Calculator',      href:`${BASE}/psychrometric-calculator`,      icon:'💧', description:'Dew point, enthalpy, humidity' },
      { name: 'COP / EER Calculator',          href:`${BASE}/cop-eer-calculator`,            icon:'📊', description:'Cooling efficiency metrics' },
      { name: 'U-Value / R-Value Calculator',  href:`${BASE}/u-value-r-value`,               icon:'🧱', description:'Insulation thermal resistance' },
      { name: 'Ventilation Rate Calculator',   href:`${BASE}/ventilation-rate-calculator`,   icon:'🌀', description:'ACH & ASHRAE 62.1 compliance' },
      { name: 'Chilled Water Pipe Sizing',     href:`${BASE}/chilled-water-pipe-sizing`,     icon:'🌊', description:'Flow & velocity for CHW loops' },
      { name: 'Boiler Efficiency Calculator',  href:`${BASE}/boiler-efficiency-calculator`,  icon:'🔥', description:'Combustion & stack loss' },
      { name: 'Building Energy Audit Tool',    href:`${BASE}/building-energy-audit`,         icon:'🏢', description:'kWh savings by intervention' },
    ],
  },
  {
    id: 'oil-gas', label: 'Oil, Gas & Chemical', icon: '🛢️', color: 'orange',
    description: 'Pipe hydraulics, heat exchangers, process design, API standards',
    tools: [
      { name: 'Pipe Pressure Drop Calculator', href:`${BASE}/pipe-pressure-drop`,            icon:'🚰', description:'Darcy-Weisbach & Hazen-Williams' },
      { name: 'Orifice Plate Flow Calculator', href:`${BASE}/orifice-plate-flow`,            icon:'⭕', description:'ISO 5167 standard' },
      { name: 'Heat Exchanger Sizing',         href:`${BASE}/heat-exchanger-sizing`,         icon:'♨️', description:'LMTD & NTU method' },
      { name: 'Gas Compressor Power',          href:`${BASE}/gas-compressor-power`,          icon:'💨', description:'Polytropic & adiabatic compression' },
      { name: 'Pump NPSH Calculator',          href:`${BASE}/pump-npsh-calculator`,          icon:'💧', description:'Available vs required NPSH' },
      { name: 'Flare Stack Sizing Tool',       href:`${BASE}/flare-stack-sizing`,            icon:'🔥', description:'API 521 relief load method' },
      { name: 'Distillation Column Estimator', href:`${BASE}/distillation-column-estimator`, icon:'🧪', description:'Theoretical plates & reflux ratio' },
      { name: 'Gas Molecular Weight Calc',     href:`${BASE}/gas-molecular-weight`,          icon:'🧬', description:'Mixture MW & density' },
      { name: 'Steam Table Lookup Tool',       href:`${BASE}/steam-table-lookup`,            icon:'♨️', description:'Saturated & superheated steam' },
      { name: 'Relief Valve Sizing (PSV)',     href:`${BASE}/relief-valve-sizing`,           icon:'⚠️', description:'API 520/521 methodology' },
    ],
  },
  {
    id: 'geotechnical', label: 'Geotechnical & Environmental', icon: '🌍', color: 'green',
    description: 'Soil mechanics, foundations, slope stability, hydrology',
    tools: [
      { name: 'Soil Bearing Capacity (Terzaghi)',href:`${BASE}/soil-bearing-capacity`,       icon:'🌍', description:'General & local shear failure' },
      { name: 'Settlement Calculator',          href:`${BASE}/settlement-calculator`,        icon:'📉', description:'Immediate & consolidation settlement' },
      { name: 'Slope Stability (Bishop)',        href:`${BASE}/slope-stability-bishop`,       icon:'⛰️', description:'Circular failure surface FOS' },
      { name: 'Lateral Earth Pressure',         href:`${BASE}/lateral-earth-pressure`,       icon:'🧱', description:'Rankine & Coulomb Ka, Kp' },
      { name: 'Liquefaction Potential Checker', href:`${BASE}/liquefaction-potential`,       icon:'🌊', description:'SPT-based simplified method' },
      { name: 'Pile Driving Formula Tool',      href:`${BASE}/pile-driving-formula`,         icon:'🗜️', description:'Hiley & ENR formula' },
      { name: 'Permeability / Seepage Calculator',href:`${BASE}/permeability-seepage`,       icon:'💧', description:"Darcy's law for soil" },
      { name: 'SPT N-Value to Parameters',      href:`${BASE}/spt-n-value-parameters`,       icon:'📊', description:'Phi, relative density conversion' },
      { name: 'Stormwater Runoff Calculator',   href:`${BASE}/stormwater-runoff`,            icon:'🌧️', description:'Rational method Q = CiA' },
      { name: 'Water Demand Estimator',         href:`${BASE}/water-demand-estimator`,       icon:'🚰', description:'Per capita & fire flow demand' },
      { name: 'Water Tank Sizing Tool',         href:`${BASE}/water-tank-sizing`,            icon:'🪣', description:'Overhead & underground tanks' },
      { name: 'Wastewater Flow Estimator',      href:`${BASE}/wastewater-flow-estimator`,    icon:'🌊', description:'BOD, COD & hydraulic loading' },
      { name: 'Solar Irradiance & PV Yield',    href:`${BASE}/solar-irradiance-pv-yield`,    icon:'☀️', description:'kWh/day by location & tilt' },
      { name: 'Carbon Footprint Calculator',    href:`${BASE}/engineering-carbon-footprint`, icon:'🌿', description:'Buildings, transport & process' },
      { name: 'Flood Frequency Analysis',       href:`${BASE}/flood-frequency-analysis`,     icon:'🌊', description:'Return period & peak discharge' },
      { name: 'Water Quality Index Tool',       href:`${BASE}/water-quality-index`,          icon:'🧪', description:'WQI from pH, DO, BOD inputs' },
    ],
  },
  {
    id: 'electronics', label: 'Electronics & Telecommunications', icon: '📡', color: 'indigo',
    description: 'Passive components, RF, PCB design, filters, signal processing',
    tools: [
      { name: 'Resistor Color Code Decoder',   href:`${BASE}/resistor-color-code`,          icon:'🌈', description:'4-band & 5-band resistors' },
      { name: 'RC / RL / LC Filter Designer',  href:`${BASE}/rc-filter-designer`,           icon:'📻', description:'Cutoff frequency & impedance' },
      { name: 'Antenna Length Calculator',     href:`${BASE}/antenna-length-calculator`,    icon:'📡', description:'Half-wave dipole & Yagi' },
      { name: 'PCB Trace Width Calculator',    href:`${BASE}/pcb-trace-width`,              icon:'🖥️', description:'IPC-2221 current & temperature' },
      { name: '555 Timer Calculator',          href:`${BASE}/timer-555-calculator`,         icon:'⏱️', description:'Astable & monostable modes' },
      { name: 'dB / Signal Loss Calculator',   href:`${BASE}/db-signal-loss`,               icon:'📶', description:'RF link budget tool' },
      { name: 'Op-Amp Gain Calculator',        href:`${BASE}/op-amp-gain-calculator`,       icon:'🔊', description:'Inverting & non-inverting config' },
      { name: 'LED Resistor Calculator',       href:`${BASE}/led-resistor-calculator`,      icon:'💡', description:'Series resistor for any LED' },
      { name: 'Capacitor Charge Time',         href:`${BASE}/capacitor-charge-time`,        icon:'⚡', description:'RC time constant & tau' },
      { name: 'Zener Voltage Regulator',       href:`${BASE}/zener-voltage-regulator`,      icon:'🔋', description:'Resistor & power dissipation' },
    ],
  },
  {
    id: 'aerospace', label: 'Aerospace & Automotive', icon: '✈️', color: 'cyan',
    description: 'Aircraft performance, vehicle dynamics, propulsion, aerodynamics',
    tools: [
      { name: 'Thrust-to-Weight Ratio',        href:`${BASE}/thrust-to-weight-ratio`,       icon:'✈️', description:'Aircraft performance estimation' },
      { name: 'Drag Coefficient Estimator',    href:`${BASE}/drag-coefficient-estimator`,   icon:'💨', description:'Cd for basic body shapes' },
      { name: 'Wing Loading Calculator',       href:`${BASE}/wing-loading-calculator`,      icon:'🛩️', description:'Stall speed & lift coefficient' },
      { name: 'Vehicle Fuel Economy Estimator',href:`${BASE}/vehicle-fuel-economy`,         icon:'⛽', description:'MPG / L/100km from driving data' },
      { name: 'EV Range Calculator',           href:`${BASE}/ev-range-calculator`,          icon:'🔋', description:'kWh/km & battery range' },
      { name: 'Engine Horsepower Estimator',   href:`${BASE}/engine-horsepower-estimator`,  icon:'🏎️', description:'Torque & RPM to HP/kW' },
      { name: 'Mach Number / Speed Converter', href:`${BASE}/mach-number-converter`,        icon:'🚀', description:'IAS, TAS, Mach at altitude' },
      { name: 'Braking Distance Calculator',   href:`${BASE}/braking-distance-calculator`,  icon:'🛑', description:'Reaction time & deceleration' },
    ],
  },
  {
    id: 'software', label: 'Software & IT Engineering', icon: '💻', color: 'purple',
    description: 'Cloud costs, security, infrastructure sizing, DevOps — highest CPC',
    tools: [
      { name: 'Cloud Cost Estimator',          href:`${BASE}/cloud-cost-estimator`,         icon:'☁️', description:'AWS vs Azure vs GCP comparison' },
      { name: 'Server Rack Power & Cooling',   href:`${BASE}/server-rack-power-cooling`,    icon:'🖥️', description:'PUE & cooling capacity' },
      { name: 'Network Bandwidth Calculator',  href:`${BASE}/network-bandwidth-calculator`, icon:'🌐', description:'Throughput & latency estimator' },
      { name: 'API Load / RPS Calculator',     href:`${BASE}/api-load-calculator`,          icon:'⚡', description:'Requests/sec & infrastructure' },
      { name: 'Database Storage Estimator',    href:`${BASE}/database-storage-estimator`,   icon:'🗄️', description:'Row count to GB/TB estimator' },
      { name: 'Cyber Security Risk Calculator',href:`${BASE}/cyber-security-risk`,          icon:'🔒', description:'CVSS score & risk rating' },
      { name: 'SaaS Pricing / LTV Calculator', href:`${BASE}/saas-pricing-ltv`,             icon:'📈', description:'CAC, LTV & payback period' },
      { name: 'CI/CD Pipeline Cost Estimator', href:`${BASE}/cicd-pipeline-cost`,           icon:'🔄', description:'Build minutes & monthly cost' },
      { name: 'Docker / K8s Resource Sizing',  href:`${BASE}/docker-k8s-sizing`,            icon:'🐳', description:'CPU & memory limits planner' },
      { name: 'Password Entropy Calculator',   href:`${BASE}/password-entropy-calculator`,  icon:'🔐', description:'Bits of entropy & crack time' },
    ],
  },
  {
    id: 'management', label: 'Project & Construction Management', icon: '📋', color: 'rose',
    description: 'Scheduling, costing, EVM, BOQ, CPM, depreciation',
    tools: [
      { name: 'Critical Path Method (CPM)',    href:`${BASE}/critical-path-method`,         icon:'📅', description:'Float & project duration' },
      { name: 'BOQ / Material Take-off Tool',  href:`${BASE}/boq-material-take-off`,        icon:'📊', description:'Quantity & cost breakdown' },
      { name: 'Project ROI Calculator',        href:`${BASE}/project-roi-calculator`,       icon:'💹', description:'NPV, IRR & payback period' },
      { name: 'Earned Value Management (EVM)', href:`${BASE}/earned-value-management`,      icon:'📈', description:'CPI, SPI & EAC metrics' },
      { name: 'Labour Productivity Estimator', href:`${BASE}/labour-productivity-estimator`,icon:'👷', description:'Output per man-hour' },
      { name: 'Crane Lift Capacity Checker',   href:`${BASE}/crane-lift-capacity`,          icon:'🏗️', description:'Load chart & radius tool' },
      { name: 'Contractor Markup Calculator',  href:`${BASE}/contractor-markup-calculator`, icon:'💰', description:'Overhead, profit & bid price' },
      { name: 'Depreciation Calculator',       href:`${BASE}/depreciation-calculator`,      icon:'📉', description:'SLM, WDV & MACRS methods' },
    ],
  },
]

const TOTAL = DISCIPLINES.reduce((s, d) => s + d.tools.length, 0)

const POPULAR = [
  { name: "Ohm's Law", href: `${BASE}/ohms-law-calculator`, icon: '⚡' },
  { name: 'Beam Deflection', href: `${BASE}/beam-deflection-calculator`, icon: '📐' },
  { name: 'Reynolds Number', href: `${BASE}/reynolds-number-calculator`, icon: '🌊' },
  { name: 'Voltage Drop', href: `${BASE}/voltage-drop-calculator`, icon: '📉' },
  { name: 'Cooling Load', href: `${BASE}/cooling-load-calculator`, icon: '❄️' },
  { name: 'Pipe Pressure Drop', href: `${BASE}/pipe-pressure-drop`, icon: '🚰' },
  { name: 'Cloud Cost', href: `${BASE}/cloud-cost-estimator`, icon: '☁️' },
  { name: 'EV Range', href: `${BASE}/ev-range-calculator`, icon: '🔋' },
]

const TRUST = [
  { icon: '⚡', label: 'Instant Results' },
  { icon: '🔒', label: 'Privacy First' },
  { icon: '🆓', label: 'Always Free' },
  { icon: '📐', label: 'Engineering Accurate' },
  { icon: '📱', label: 'Mobile Friendly' },
]

/* ── Component ────────────────────────────────────────────────── */
export default function EngineeringPageClient() {
  const [active, setActive] = useState<string | null>(null)
  const toolsRef = useRef<HTMLElement>(null)

  const selectCategory = useCallback((id: string | null) => {
    setActive(id)
    setTimeout(() => {
      toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 30)
  }, [])

  const visibleDisciplines = active
    ? DISCIPLINES.filter(d => d.id === active)
    : DISCIPLINES

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-sky-100 mb-6">
              <span>⚙️</span>
              <span>{TOTAL}+ Free Engineering Tools — All Disciplines</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              Engineering Tools.<br className="hidden sm:block" /> Professional Grade. Free.
            </h1>
            <p className="text-lg text-sky-100 mb-8 leading-relaxed max-w-2xl">
              Civil & structural calculators, electrical design tools, mechanical engineering formulas,
              HVAC sizing, software cost estimators and more — all browser-based, zero signup.
            </p>

            {/* Popular quick links */}
            <div className="flex flex-wrap gap-2">
              {POPULAR.map(p => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1.5 text-sm text-white transition-colors"
                >
                  <span className="text-base">{p.icon}</span>
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust badges ──────────────────────────────────────── */}
      <div className="border-b border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-[#161616]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {TRUST.map(t => (
              <span key={t.label} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-[#888]">
                <span>{t.icon}</span>{t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Discipline Filter Cards ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Browse by Discipline</h2>
        <p className="text-sm text-gray-500 dark:text-[#999] mb-6">Click a discipline to filter tools — or scroll to browse all {TOTAL}+</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
          {/* All card */}
          <button
            onClick={() => selectCategory(null)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${
              active === null
                ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-200'
                : 'bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10 hover:border-sky-300 hover:shadow-sm text-gray-700 dark:text-[#ddd]'
            }`}
          >
            <span className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center ${
              active === null ? 'bg-white/20' : 'bg-sky-50'
            }`}>⚙️</span>
            <div>
              <p className={`text-sm font-bold leading-tight ${active === null ? 'text-white' : 'text-gray-900'}`}>
                All Disciplines
              </p>
              <p className={`text-xs mt-0.5 ${active === null ? 'text-sky-100' : 'text-gray-500 dark:text-[#999]'}`}>
                {TOTAL} tools
              </p>
            </div>
            {active === null && (
              <span className="text-xs bg-white/20 rounded-full px-2 py-0.5 text-white">✓ Active</span>
            )}
          </button>

          {/* Discipline cards */}
          {DISCIPLINES.map(disc => {
            const pal = PALETTE[disc.color] ?? PALETTE.sky
            const isActive = active === disc.id
            return (
              <button
                key={disc.id}
                onClick={() => selectCategory(disc.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                  isActive
                    ? `${pal.cardActive} ${pal.borderActive} text-white shadow-lg`
                    : `bg-white dark:bg-[#1e1e1e] ${pal.border} dark:border-white/10 hover:shadow-sm text-gray-700 dark:text-[#ddd]`
                }`}
              >
                <span className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-white/20' : pal.icon
                }`}>{disc.icon}</span>
                <div>
                  <p className={`text-sm font-bold leading-tight ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {disc.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-[#999]'}`}>
                    {disc.tools.length} tools
                  </p>
                </div>
                {isActive && (
                  <span className="text-xs bg-white/20 rounded-full px-2 py-0.5 text-white">✓ Active</span>
                )}
              </button>
            )
          })}
        </div>

        {active && (
          <button
            onClick={() => selectCategory(null)}
            className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1.5 mt-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filter — show all {TOTAL} tools
          </button>
        )}
      </div>

      {/* ── Tools Grid ────────────────────────────────────────── */}
      <section ref={toolsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {visibleDisciplines.map(disc => {
          const pal = PALETTE[disc.color] ?? PALETTE.sky
          return (
            <div key={disc.id} id={disc.id} className="mb-14">
              {/* Section header */}
              <div className="flex items-start gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-white/8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${pal.icon}`}>
                  {disc.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{disc.label}</h2>
                    <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${pal.text} bg-gray-100`}>
                      {disc.tools.length} tools
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-[#999] mt-0.5">{disc.description}</p>
                </div>
                <button
                  onClick={() => selectCategory(disc.id)}
                  className={`ml-auto flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                    active === disc.id
                      ? `${pal.badge} text-white border-transparent`
                      : `${pal.text} ${pal.border} hover:${pal.card}`
                  }`}
                >
                  {active === disc.id ? '✓ Filtered' : 'Filter'}
                </button>
              </div>

              {/* Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {disc.tools.map(tool => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`group flex items-start gap-3 p-4 rounded-xl border bg-white dark:bg-[#1e1e1e] hover:shadow-md transition-all ${pal.border} dark:border-white/10 hover:${pal.borderActive} dark:hover:border-sky-500`}
                  >
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${pal.toolIconBg}`}>
                      {tool.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold text-gray-900 dark:text-white group-hover:${pal.text} transition-colors leading-snug`}>
                        {tool.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-[#777] mt-0.5 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* ── SEO About section ─────────────────────────────────── */}
      <section className="bg-[#f5f5f3] dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-white/8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Why Engineers Trust Our Free Online Calculators
          </h2>
          <p className="text-sm text-gray-600 dark:text-[#aaa] leading-relaxed mb-6">
            Our engineering tool suite covers all major disciplines with formulas validated against
            industry standards including ASCE 7, ACI 318, ASME, NEC, API 520/521, IEC and ASHRAE.
            Each calculator shows the formula used so you can verify results.
          </p>
          <ul className="space-y-2">
            {[
              'Civil & Structural: beam deflection, concrete mix, column capacity, retaining walls, pile design',
              "Electrical: Ohm's law, voltage drop, 3-phase power, solar sizing, protection coordination",
              'Mechanical: gear ratios, pressure vessels, heat transfer, CNC feeds, fatigue life',
              'HVAC: cooling loads, duct sizing, psychrometrics, U-values, boiler efficiency',
              'Software & IT: cloud costs, API load, database sizing, CVSS risk, SaaS metrics',
              'Geotechnical, Oil & Gas, Electronics, Aerospace and Project Management included',
            ].map(b => (
              <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-sky-500 mt-0.5 flex-shrink-0">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}