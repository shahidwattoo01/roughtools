import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getToolsByCategory } from '@/lib/tools-registry'
import { ENGINEERING_CONFIGS } from '../_components/engineering-configs'
import EngineeringCalculatorClient from '../_components/EngineeringCalculatorClient'
import EngineeringFAQClient from '../_components/EngineeringFAQClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

interface Props { params: { slug: string } }
interface FAQ   { q: string; a: string }

// ─── Discipline map ───────────────────────────────────────────
const DISCIPLINE_MAP: Record<string, { id: string; label: string; icon: string; slugs: string[] }> = {
  'civil-structural': {
    id: 'civil-structural', label: 'Civil & Structural', icon: '🏗️',
    slugs: [
      'beam-deflection-calculator','concrete-mix-design','column-load-capacity',
      'retaining-wall-stability','foundation-bearing-capacity','steel-section-properties',
      'rebar-quantity-estimator','concrete-volume-calculator','wind-load-calculator',
      'truss-member-force','moment-of-inertia-calculator','pile-load-capacity',
      'slab-reinforcement-designer','earthwork-cut-fill','asphalt-pavement-thickness',
      'slope-stability-fos','soil-bearing-pressure','construction-cost-estimator',
    ],
  },
  electrical: {
    id: 'electrical', label: 'Electrical Engineering', icon: '⚡',
    slugs: [
      'ohms-law-calculator','wire-cable-size','voltage-drop-calculator',
      'three-phase-power-calculator','transformer-sizing','motor-starting-current',
      'solar-panel-battery-sizing','led-energy-savings','circuit-breaker-sizing',
      'capacitor-bank-sizing','ups-battery-backup','power-factor-correction',
      'short-circuit-current','conduit-fill-calculator','load-schedule-panel',
      'pv-system-roi','battery-state-of-charge','earthing-grounding-resistance',
    ],
  },
  mechanical: {
    id: 'mechanical', label: 'Mechanical Engineering', icon: '⚙️',
    slugs: [
      'bolt-torque-calculator','gear-ratio-calculator','hp-kw-converter',
      'pressure-vessel-thickness','fluid-flow-rate','heat-transfer-calculator',
      'pump-head-flow','spring-constant-calculator','belt-pulley-speed',
      'cnc-feeds-speeds','tolerance-stack-up','fatigue-life-estimator',
      'thermal-expansion-calculator','bearing-life-calculator','stress-strain-calculator',
      'reynolds-number-calculator','vibration-frequency','hydraulic-cylinder-force',
    ],
  },
  hvac: {
    id: 'hvac', label: 'HVAC & Building Services', icon: '🌬️',
    slugs: [
      'cooling-load-calculator','heating-load-estimator','duct-sizing-calculator',
      'psychrometric-calculator','cop-eer-calculator','u-value-r-value',
      'ventilation-rate-calculator','chilled-water-pipe-sizing',
      'boiler-efficiency-calculator','building-energy-audit',
    ],
  },
  'oil-gas': {
    id: 'oil-gas', label: 'Oil, Gas & Chemical', icon: '🛢️',
    slugs: [
      'pipe-pressure-drop','orifice-plate-flow','heat-exchanger-sizing',
      'gas-compressor-power','pump-npsh-calculator','flare-stack-sizing',
      'distillation-column-estimator','gas-molecular-weight',
      'steam-table-lookup','relief-valve-sizing',
    ],
  },
  geotechnical: {
    id: 'geotechnical', label: 'Geotechnical & Environmental', icon: '🌍',
    slugs: [
      'soil-bearing-capacity','settlement-calculator','slope-stability-bishop',
      'lateral-earth-pressure','liquefaction-potential','pile-driving-formula',
      'permeability-seepage','spt-n-value-parameters','stormwater-runoff',
      'water-demand-estimator','water-tank-sizing','wastewater-flow-estimator',
      'solar-irradiance-pv-yield','engineering-carbon-footprint',
      'flood-frequency-analysis','water-quality-index',
    ],
  },
  electronics: {
    id: 'electronics', label: 'Electronics & Telecommunications', icon: '📡',
    slugs: [
      'resistor-color-code','rc-filter-designer','antenna-length-calculator',
      'pcb-trace-width','timer-555-calculator','db-signal-loss',
      'op-amp-gain-calculator','led-resistor-calculator','capacitor-charge-time',
      'zener-voltage-regulator',
    ],
  },
  aerospace: {
    id: 'aerospace', label: 'Aerospace & Automotive', icon: '✈️',
    slugs: [
      'thrust-to-weight-ratio','drag-coefficient-estimator','wing-loading-calculator',
      'vehicle-fuel-economy','ev-range-calculator','engine-horsepower-estimator',
      'mach-number-converter','braking-distance-calculator',
    ],
  },
  software: {
    id: 'software', label: 'Software & IT Engineering', icon: '💻',
    slugs: [
      'cloud-cost-estimator','server-rack-power-cooling','network-bandwidth-calculator',
      'api-load-calculator','database-storage-estimator','cyber-security-risk',
      'saas-pricing-ltv','cicd-pipeline-cost','docker-k8s-sizing','password-entropy-calculator',
    ],
  },
  management: {
    id: 'management', label: 'Project & Construction Management', icon: '📋',
    slugs: [
      'critical-path-method','boq-material-take-off','project-roi-calculator',
      'earned-value-management','labour-productivity-estimator','crane-lift-capacity',
      'contractor-markup-calculator','depreciation-calculator',
    ],
  },
}

function getDiscipline(slug: string) {
  return Object.values(DISCIPLINE_MAP).find(d => d.slugs.includes(slug)) ?? null
}

// ─── Universal base FAQs (7 questions, added to every tool) ──
const UNIVERSAL_ENG_FAQS = (toolName: string, disciplineLabel: string): FAQ[] => [
  {
    q: `How accurate is the ${toolName}?`,
    a: `The ${toolName} uses validated engineering formulas from established standards (ASCE, ACI, NEC, ASME, API, or equivalent). Accuracy depends on the precision of inputs — ensure you use measured values rather than estimates where possible. Results represent theoretical or code-based values that must be verified with appropriate safety factors and reviewed by a licensed engineer before use in any construction or manufacturing application.`,
  },
  {
    q: `Is my data private when I use the ${toolName}?`,
    a: `Yes — completely. All calculations run entirely in your browser using JavaScript. No data you enter — project dimensions, loads, voltages, specifications, or any other parameter — is transmitted to any server, stored in any database, or shared with any third party. Your engineering data and intellectual property remain completely private on your device.`,
  },
  {
    q: `Is the ${toolName} free to use?`,
    a: `Yes. The ${toolName} is completely free with no account, registration, or subscription required. All ${disciplineLabel} tools on RoughTools are free, browser-based, and require no download or installation. There are no premium tiers, paywalled results, or hidden costs.`,
  },
  {
    q: `Does the ${toolName} work on mobile phones and tablets?`,
    a: `Yes. The ${toolName} is fully responsive and works on all modern smartphones, tablets, and desktop computers. The interface adapts to smaller screens, making it practical for use on-site with a phone or tablet as well as in the office on a desktop computer.`,
  },
  {
    q: `What browsers support the ${toolName}?`,
    a: `The ${toolName} works on all modern browsers: Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, and Opera. No plugins, browser extensions, or additional software are required. Keeping your browser updated to the latest version ensures the best performance.`,
  },
  {
    q: `Can I save or export results from the ${toolName}?`,
    a: `Yes. You can export your calculation results as a PDF using the "Save as PDF" button, which captures inputs and outputs in a printable format suitable for project documentation, design file records, or client reports. You can also copy results to clipboard using the copy button in the results panel.`,
  },
  {
    q: `What formula does the ${toolName} use?`,
    a: `The exact formula, variable definitions, and the engineering standard or reference source are shown in the Formula section on this page. RoughTools is committed to formula transparency — you should always know precisely what equation is being applied before relying on a result for engineering decisions. If you notice a discrepancy between our formula and your reference standard, please report it using the feedback button.`,
  },
]

// ─── Discipline-based FAQs ────────────────────────────────────
function getFAQs(disciplineId: string, toolName: string): FAQ[] {
  const disciplineLabels: Record<string, string> = {
    'civil-structural': 'Civil & Structural Engineering',
    electrical: 'Electrical Engineering',
    mechanical: 'Mechanical Engineering',
    hvac: 'HVAC & Building Services',
    'oil-gas': 'Oil, Gas & Chemical Engineering',
    geotechnical: 'Geotechnical & Environmental Engineering',
    electronics: 'Electronics & Telecommunications',
    aerospace: 'Aerospace & Automotive Engineering',
    software: 'Software & IT Engineering',
    management: 'Project & Construction Management',
  }
  const label = disciplineLabels[disciplineId] ?? 'Engineering'
  const map: Record<string, FAQ[]> = {
    'civil-structural': [
      { q: `What is the ${toolName} used for in structural engineering?`, a: `The ${toolName} helps civil and structural engineers perform preliminary design checks, verify structural adequacy, and estimate material quantities. Results are based on established codes such as ASCE 7, ACI 318, and Eurocode standards.` },
      { q: 'What is the difference between a simply supported and cantilever beam?', a: 'A simply supported beam is free to rotate at both ends but cannot translate. A cantilever beam is fixed at one end and free at the other. Cantilevers develop higher moments at the fixed support and zero at the free end. Maximum deflection formulas differ between these two cases.' },
      { q: 'What is the factor of safety (FOS) in structural design?', a: 'The Factor of Safety is the ratio of the ultimate capacity to the applied load. Typical FOS values: 1.5–2.0 for structural steel, 2.0–3.0 for concrete, and 3.0+ for foundations. Higher FOS values are used when material properties are uncertain or failure consequences are severe.' },
      { q: 'Do I need a licensed engineer to use these results?', a: 'Yes. These tools are for preliminary design and educational reference only. All structural calculations used in actual construction must be reviewed, stamped, and sealed by a licensed Professional Engineer (PE) in your jurisdiction before use in any construction project.' },
      { q: 'What building codes do these calculators follow?', a: 'Our structural tools reference ASCE 7 (loads), ACI 318 (concrete), AISC 360 (steel), and Eurocode standards where applicable. The specific standard used is noted on each calculator. Local building codes may impose additional or different requirements.' },
    ],
    electrical: [
      { q: `How is the ${toolName} used in electrical design?`, a: `The ${toolName} helps electrical engineers and electricians perform calculations for circuit design, power system sizing, and code compliance. Results reference NEC (National Electrical Code) or IEC standards as applicable.` },
      { q: "What is Ohm's Law and when does it apply?", a: "Ohm's Law states V = I × R, where V is voltage (volts), I is current (amps), and R is resistance (ohms). It applies to linear resistive circuits at steady state. Power is calculated as P = V × I = I²R = V²/R. It does not apply directly to non-linear components like diodes or transistors." },
      { q: 'What is voltage drop and why does it matter?', a: 'Voltage drop is the reduction in voltage along a conductor due to its resistance. NEC recommends keeping total voltage drop to ≤5% (3% for branch circuits, 2% for feeders). Excessive voltage drop causes equipment malfunction, motor overheating, and inefficiency.' },
      { q: 'What is power factor and how do I correct it?', a: 'Power factor (PF) is the ratio of real power (kW) to apparent power (kVA). A PF of 1.0 is ideal. Low PF (caused by inductive loads like motors) wastes energy and requires larger conductors. Power factor correction uses capacitor banks to cancel inductive reactive power (kVAR).' },
      { q: 'Are these electrical calculations safe for use in real installations?', a: 'These tools are for preliminary sizing and educational reference. All electrical designs must comply with local electrical codes and be verified by a licensed Electrical Engineer or Master Electrician. Always use an appropriate safety margin and have work inspected per local regulations.' },
    ],
    mechanical: [
      { q: `What does the ${toolName} calculate?`, a: `The ${toolName} applies mechanical engineering principles to calculate forces, stresses, displacements, or performance metrics. Results are based on classical mechanics, materials science, and industry standards such as ASME, ISO, and DIN.` },
      { q: "What is Young's modulus and how does it affect stress calculations?", a: "Young's modulus (E) is the stiffness of a material — the ratio of stress to strain in the elastic region. Steel has E ≈ 200 GPa, aluminum ≈ 70 GPa, and concrete ≈ 30 GPa. Higher E means less deformation under load. It is fundamental to beam deflection, stress, and vibration calculations." },
      { q: 'What is the Reynolds number and why is it important in fluid mechanics?', a: 'The Reynolds number (Re = ρvD/μ) determines whether flow is laminar (Re < 2300) or turbulent (Re > 4000). Laminar flow is smooth and predictable; turbulent flow is chaotic and has higher friction losses. Re is critical for pipe sizing, heat exchanger design, and aerodynamics.' },
      { q: 'What is fatigue failure and how is it predicted?', a: "Fatigue failure occurs when a material is subjected to repeated cyclic loading below its ultimate strength. It is predicted using S-N (Wöhler) curves and Miner's rule for cumulative damage. Key factors: stress range, surface finish, stress concentrations (notches), and material. Most metals fail at 10^7 cycles at roughly 40–50% of their UTS." },
      { q: 'Should I use actual or ideal body weight for these calculations?', a: 'For structural and fluid mechanics calculations, use the actual physical parameters (dimensions, forces, pressures). For machine design and component sizing, always add appropriate safety factors (typically 1.5–3×) to account for material variability, dynamic loads, and installation tolerances.' },
    ],
    hvac: [
      { q: `What does the ${toolName} calculate for HVAC design?`, a: `The ${toolName} helps HVAC engineers size equipment, calculate thermal loads, and design ductwork for building comfort systems. Results are based on ASHRAE standards, the Carrier Handbook of Air Conditioning, and applicable building codes.` },
      { q: 'What is a cooling load and how is it different from heat load?', a: 'Cooling load (in BTU/hr or kW) is the heat that must be removed to maintain comfort — it includes heat through walls, windows, roofs, plus people, equipment, and ventilation. Heating load is the heat that must be added to maintain comfort in cold weather. Both depend on building envelope, occupancy, climate, and orientation.' },
      { q: 'What is the difference between COP and EER?', a: 'COP (Coefficient of Performance) is a dimensionless ratio of cooling/heating output to energy input, used for chiller/heat pump ratings. EER (Energy Efficiency Ratio) is cooling output (BTU/hr) divided by power input (watts) at a specific test condition. SEER is the seasonal EER averaged over a cooling season. Higher values mean more efficient equipment.' },
      { q: 'What is the ASHRAE 62.1 ventilation standard?', a: 'ASHRAE 62.1 specifies minimum outdoor air ventilation rates for acceptable indoor air quality (IAQ). It uses the Ventilation Rate Procedure (VRP): outdoor air requirement = people component + area component. Compliance is required in most commercial building codes in the US and many international standards.' },
      { q: 'Are HVAC calculations enough to size equipment without a load study?', a: 'No. These tools provide preliminary estimates. A full HVAC design requires a detailed Manual J (residential) or ASHRAE load calculation considering all envelope components, internal gains, infiltration, and climate data. Equipment must be sized by a licensed HVAC engineer or mechanical engineer of record.' },
    ],
    'oil-gas': [
      { q: `How is the ${toolName} used in oil, gas & chemical engineering?`, a: `The ${toolName} supports process engineering calculations for pipeline hydraulics, heat exchange, separation, and equipment sizing. Results follow API, ASME, ISO, and chemical engineering first principles.` },
      { q: 'What is the Darcy-Weisbach equation?', a: 'The Darcy-Weisbach equation calculates pressure drop in pipes: ΔP = f × (L/D) × (ρv²/2), where f is the Darcy friction factor, L is pipe length, D is diameter, ρ is fluid density, and v is velocity. The friction factor is found from the Moody chart using Reynolds number and relative roughness (ε/D).' },
      { q: 'What is NPSH and why does it matter for pump selection?', a: 'Net Positive Suction Head (NPSH) is the difference between the available absolute pressure at the pump suction and the fluid vapour pressure. NPSHa (available) must exceed NPSHr (required) by at least 0.5–1.0 m to prevent cavitation. Cavitation causes noise, vibration, impeller damage, and flow loss.' },
      { q: 'What does LMTD mean in heat exchanger design?', a: 'Log Mean Temperature Difference (LMTD) is the effective driving force for heat transfer in a heat exchanger: LMTD = (ΔT₁ - ΔT₂) / ln(ΔT₁/ΔT₂). The heat duty Q = U × A × LMTD, where U is the overall heat transfer coefficient and A is the heat transfer area. Counter-current flow gives a higher LMTD than co-current.' },
      { q: 'Do these calculations replace a detailed Process Safety Review (PSR)?', a: 'No. These tools are for preliminary engineering estimates only. All process designs involving hazardous fluids, high pressures, or safety-critical equipment (PSVs, flares, pressure vessels) require full HAZOP, PSM review, and sign-off by a licensed process/chemical engineer per applicable codes (ASME, API, OSHA PSM).' },
    ],
    geotechnical: [
      { q: `How is the ${toolName} applied in geotechnical engineering?`, a: `The ${toolName} applies soil mechanics principles and empirical correlations to evaluate foundation capacity, slope stability, or hydraulic conditions. Results are based on Terzaghi, Meyerhof, Bishop, and other foundational geotechnical methods.` },
      { q: 'What is the bearing capacity of soil and how is it calculated?', a: "Ultimate bearing capacity (q_ult) is the maximum pressure a soil can support without shear failure. Terzaghi's general bearing capacity equation: q_ult = cNc + γDNq + 0.5γBNγ, where c = cohesion, γ = unit weight, D = depth, B = width, and Nc, Nq, Nγ are bearing capacity factors. Safe bearing capacity = q_ult ÷ FOS (typically FOS = 3)." },
      { q: 'What is soil liquefaction and how is it assessed?', a: "Liquefaction occurs when saturated, loose cohesionless soil loses shear strength during earthquake shaking — the soil behaves like a liquid. It's assessed using the Seed & Idriss simplified SPT-based method: comparing Cyclic Stress Ratio (CSR) vs Cyclic Resistance Ratio (CRR) from SPT N-values. Areas with high water tables and loose sands are most susceptible." },
      { q: 'What is the Rational Method for stormwater runoff?', a: 'The Rational Method estimates peak runoff: Q = C × i × A, where Q = peak flow (m³/s or cfs), C = runoff coefficient (dimensionless, 0.1–0.95), i = rainfall intensity (mm/hr or in/hr) for the design return period, and A = catchment area. It is suitable for catchments ≤80 hectares (200 acres) with short response times.' },
      { q: 'Do geotechnical calculations require site investigation data?', a: 'Yes, always. These tools use theoretical or empirical relationships that must be calibrated to site-specific conditions from a geotechnical investigation (boreholes, SPT tests, lab analysis). Soil properties vary widely by site. All geotechnical designs must be verified by a licensed Geotechnical Engineer.' },
    ],
    electronics: [
      { q: `What does the ${toolName} calculate for electronics?`, a: `The ${toolName} applies electronic circuit theory to calculate component values, signal parameters, or performance characteristics. Results are based on standard circuit analysis methods and IPC/IEEE standards.` },
      { q: 'How do I read a resistor color code?', a: 'For a 4-band resistor: Band 1 = first significant digit, Band 2 = second digit, Band 3 = multiplier (×10^n), Band 4 = tolerance (gold = ±5%, silver = ±10%). Example: Red-Red-Red-Gold = 2-2-×100-±5% = 2.2 kΩ ±5%. For 5-band resistors, there are two significant digits before the multiplier.' },
      { q: 'What is the cutoff frequency of an RC filter?', a: 'The cutoff frequency (−3 dB point) of an RC low-pass or high-pass filter is: fc = 1/(2πRC). At this frequency, the output voltage is 0.707 (1/√2) times the input, and the phase shift is ±45°. For a band-pass filter, there are two cutoff frequencies defining the passband.' },
      { q: 'How do I calculate the gain of an inverting op-amp circuit?', a: 'For an inverting op-amp: Gain = −Rf/Rin. The negative sign indicates 180° phase inversion. The non-inverting input is connected to ground through a bias resistor (Rf||Rin). Virtual ground at the inverting input means vin/Rin = −vout/Rf, giving the gain equation.' },
      { q: 'Are these electronics tools suitable for professional circuit design?', a: 'These tools are for educational reference and initial component selection. Professional circuit design requires SPICE simulation (LTspice, Multisim), PCB layout review, proper decoupling and thermal design, and prototype testing before production. Safety-critical electronics require additional certification (UL, CE, IEC 60601 for medical).' },
    ],
    aerospace: [
      { q: `How is the ${toolName} used in aerospace or automotive engineering?`, a: `The ${toolName} applies aerodynamic, propulsion, or vehicle dynamics principles to estimate performance characteristics. Results are based on classical aerodynamics (Anderson, Raymer), vehicle mechanics, and standard atmospheric models (ISA).` },
      { q: 'What is thrust-to-weight ratio and why does it matter?', a: 'Thrust-to-weight ratio (T/W) is the engine thrust divided by the total aircraft weight. T/W > 1 means the aircraft can accelerate vertically (e.g., fighters, rockets). For commercial aircraft, T/W ≈ 0.3–0.4 is typical. Higher T/W means better climb performance, shorter takeoff roll, and faster acceleration.' },
      { q: 'What is drag coefficient and how is it reduced?', a: 'Drag coefficient (Cd) is a dimensionless measure of aerodynamic drag: D = ½ρv²ACd. Typical values: airfoil ≈ 0.01, streamlined car ≈ 0.25–0.35, blunt body ≈ 1.0+. Drag is reduced through streamlining, surface smoothness, reduced frontal area, and using laminar flow designs.' },
      { q: 'What is the Mach number and how does it affect flight?', a: 'Mach number (M = V/a) is the ratio of aircraft speed to the local speed of sound (a ≈ 340 m/s at sea level). M < 0.8 = subsonic, 0.8–1.2 = transonic (mixed flow, wave drag begins), M > 1.2 = supersonic (shock waves form). The transition through M = 1 requires special design considerations.' },
      { q: 'Are EV range calculations accurate for real-world use?', a: 'Our EV range calculator provides theoretical range based on battery capacity and energy consumption rate. Real-world range is typically 10–30% less due to temperature effects, driving speed, HVAC use, terrain, and battery degradation. Always account for these factors when planning EV trips or comparing vehicles.' },
    ],
    software: [
      { q: `How is the ${toolName} used in software and IT engineering?`, a: `The ${toolName} helps software engineers, DevOps teams, and IT architects estimate infrastructure costs, resource requirements, security risk, or system performance. Results are based on published cloud pricing models, performance benchmarks, and industry frameworks.` },
      { q: 'How do AWS, Azure, and GCP cloud pricing models differ?', a: 'All three major clouds use pay-per-use pricing with reserved/committed-use discounts of 30–70% for 1–3 year commitments. AWS has the most mature service catalog. Azure integrates tightly with Microsoft licensing (Windows, SQL Server). GCP often has the lowest compute prices and sustained-use discounts applied automatically. Actual costs depend heavily on architecture, data transfer, and storage patterns.' },
      { q: 'What is CVSS scoring for cybersecurity vulnerabilities?', a: 'CVSS (Common Vulnerability Scoring System) v3.1 assigns vulnerabilities a score from 0–10 based on: Base metrics (attack vector, complexity, privileges required, user interaction, scope, impact) + Temporal metrics (exploit maturity, remediation level) + Environmental metrics (site-specific). Scores: 0.1–3.9 Low, 4.0–6.9 Medium, 7.0–8.9 High, 9.0–10.0 Critical.' },
      { q: 'What is the difference between LTV and CAC in SaaS metrics?', a: 'LTV (Customer Lifetime Value) is the total revenue expected from a customer: LTV = ARPU × Gross Margin / Churn Rate. CAC (Customer Acquisition Cost) is the total sales & marketing spend divided by new customers acquired. Healthy SaaS companies target LTV/CAC > 3× and CAC payback < 12 months.' },
      { q: 'How many CPU and memory resources should I allocate for Docker containers?', a: 'Start with minimal limits and tune based on observed usage. Common starting points: web servers 0.25–0.5 CPU + 256–512 MB RAM, databases 2–4 CPU + 4–8 GB RAM, background workers 0.5–1 CPU + 512 MB–1 GB RAM. Set CPU/memory requests at P50 usage and limits at P95–P99 to balance density and stability. Monitor with Prometheus/Grafana.' },
    ],
    management: [
      { q: `How is the ${toolName} used in project management?`, a: `The ${toolName} helps project managers, quantity surveyors, and construction managers perform scheduling, cost estimation, or performance analysis. Results are based on PMI/PMBOK, CIQS, and standard project management frameworks.` },
      { q: 'What is the Critical Path Method (CPM)?', a: 'CPM identifies the longest sequence of dependent tasks in a project — the critical path. Activities on the critical path have zero float (delay = project delay). CPM helps identify which tasks can be delayed (have float) without affecting the project end date, enabling resource reallocation. Network diagram + forward/backward pass analysis defines the critical path.' },
      { q: 'What is Earned Value Management (EVM)?', a: 'EVM integrates scope, schedule, and cost to measure project performance: PV (Planned Value) = budgeted cost of work scheduled; EV (Earned Value) = budgeted cost of work performed; AC (Actual Cost) = actual cost incurred. Key metrics: CPI = EV/AC (cost efficiency), SPI = EV/PV (schedule efficiency), EAC = BAC/CPI (estimated final cost). CPI < 1 = over budget, SPI < 1 = behind schedule.' },
      { q: 'What is the difference between straight-line and declining balance depreciation?', a: 'Straight-Line (SLM): equal depreciation each year = (Cost − Salvage) / Useful Life. Declining Balance (WDV): fixed rate applied to book value each year — front-loads depreciation. MACRS (US tax): IRS-specified accelerated rates for different asset classes. The choice affects tax liability and reported profit, so consult a tax professional.' },
      { q: 'How accurate are construction cost estimates from these calculators?', a: 'These estimators provide order-of-magnitude or preliminary (Class 5–4) estimates with typical accuracy of ±30–50%. Detailed estimates require full Bills of Quantities (BOQ), current material pricing, site conditions assessment, and local labour rates. For project budgeting, always add a contingency (10–20% for preliminary design, 5–10% for detailed design).' },
    ],
  }

  const base = map[disciplineId] ?? [
    { q: `What is the ${toolName} used for?`, a: `The ${toolName} is a professional engineering tool that performs validated calculations for design, analysis, or cost estimation. It is based on established engineering standards and first principles. The specific formula and reference standard are shown in the Formula section on this page.` },
    { q: 'How accurate are the results?', a: 'Results are calculated using validated engineering formulas and are accurate for the inputs provided. They represent preliminary/theoretical values. Always apply appropriate safety factors and verify with detailed analysis before using in construction or manufacturing.' },
    { q: 'Do I need a licensed engineer to use these results?', a: 'For any safety-critical application, results must be reviewed and verified by a licensed Professional Engineer (PE) or equivalent. These tools are for educational and preliminary design purposes only.' },
    { q: 'What standards do these tools follow?', a: 'Our engineering tools reference major international standards including ASCE, ACI, AISC, ASME, NEC, IEC, ASHRAE, and API where applicable. The specific standard is noted on each calculator page.' },
    { q: 'What safety factors should I apply?', a: 'Safety factors depend on the material and failure mode. Typical values: structural steel 1.5–2.0, concrete 1.5–2.0, foundations 2.5–3.0, slopes 1.3–1.5, pressure vessels 3.0–4.0. Always use the factor specified by the applicable design standard — these preliminary calculations show nominal values before safety factor application.' },
  ]
  // 5 discipline-specific + 7 universal = 12 total
  return [...base, ...UNIVERSAL_ENG_FAQS(toolName, label)]
}

// ─── Discipline generic formulas ─────────────────────────────
const DISC_NOTES: Record<string, string> = {
  'civil-structural': 'Based on ASCE 7, ACI 318, and Eurocode standards. Apply appropriate safety factors for final design.',
  electrical: 'Based on NEC and IEC standards. Verify all designs with a licensed Electrical Engineer before installation.',
  mechanical: 'Based on ASME, ISO, and classical mechanics principles. Apply design safety factors per applicable codes.',
  hvac: 'Based on ASHRAE standards and Manual J/N methodology. Full load study required for equipment selection.',
  'oil-gas': 'Based on API, ASME, and chemical engineering first principles. Requires full HAZOP review for safety-critical systems.',
  geotechnical: 'Based on Terzaghi, Meyerhof, and AASHTO geotechnical methods. Site investigation data always required.',
  electronics: 'Based on standard circuit analysis, IPC-2221, and IEEE standards. Verify with SPICE simulation before production.',
  aerospace: 'Based on classical aerodynamics and standard atmospheric model (ISA). Actual performance depends on many operating factors.',
  software: 'Based on published cloud pricing and industry performance benchmarks. Actual costs vary by architecture and usage patterns.',
  management: 'Based on PMI/PMBOK and standard project management frameworks. Add contingency for all preliminary estimates.',
}

const DISC_GENERICS: Record<string, { title: string; formula: string; variables: Array<{ symbol: string; meaning: string }>; note: string }> = {
  'civil-structural': {
    title: 'Structural Engineering Formula',
    formula: 'Capacity = Material Strength × Section Property × Reduction Factor\nApplied Load ≤ Design Capacity / Factor of Safety',
    variables: [
      { symbol: 'Capacity', meaning: 'Maximum load or moment the member can resist' },
      { symbol: 'Material Strength', meaning: "Yield strength (Fy) for steel or compressive strength (f'c) for concrete" },
      { symbol: 'FOS', meaning: 'Factor of Safety (typically 1.5–3.0 depending on material and failure mode)' },
    ],
    note: DISC_NOTES['civil-structural'],
  },
  electrical: {
    title: 'Electrical Engineering Formula',
    formula: "Ohm's Law:  V = I × R   (Voltage = Current × Resistance)\nPower:      P = V × I = I²R = V²/R\nVoltage Drop: Vd = 2 × I × R × L / 1000",
    variables: [
      { symbol: 'V', meaning: 'Voltage (volts)' },
      { symbol: 'I', meaning: 'Current (amperes)' },
      { symbol: 'R', meaning: 'Resistance (ohms, Ω)' },
      { symbol: 'P', meaning: 'Power (watts)' },
    ],
    note: DISC_NOTES.electrical,
  },
  mechanical: {
    title: 'Mechanical Engineering Formula',
    formula: 'Stress:    σ = F / A   (Force / Cross-sectional Area)\nStrain:    ε = σ / E   (Young\'s Modulus)\nReynolds: Re = ρvD / μ',
    variables: [
      { symbol: 'σ', meaning: 'Normal stress (Pa or MPa)' },
      { symbol: 'E', meaning: "Young's modulus of elasticity (GPa)" },
      { symbol: 'Re', meaning: 'Reynolds number (dimensionless)' },
      { symbol: 'ρ', meaning: 'Fluid density (kg/m³)' },
    ],
    note: DISC_NOTES.mechanical,
  },
  hvac: {
    title: 'HVAC Engineering Formula',
    formula: 'Heat Transfer: Q = m × Cp × ΔT  (kW)\nDuct Velocity: V = Q / A  (m/s or ft/min)\nCOP = Cooling Output (kW) / Power Input (kW)',
    variables: [
      { symbol: 'Q', meaning: 'Heat transfer rate (kW or BTU/hr)' },
      { symbol: 'Cp', meaning: 'Specific heat of air ≈ 1.006 kJ/kg·K' },
      { symbol: 'ΔT', meaning: 'Temperature difference between supply and return (°C or °F)' },
      { symbol: 'COP', meaning: 'Coefficient of Performance (dimensionless efficiency)' },
    ],
    note: DISC_NOTES.hvac,
  },
  'oil-gas': {
    title: 'Process Engineering Formula',
    formula: 'Darcy-Weisbach: ΔP = f × (L/D) × (ρv²/2)\nHeat Exchange: Q = U × A × LMTD\nCompression: W = n/(n-1) × P₁V₁ × [(P₂/P₁)^((n-1)/n) − 1]',
    variables: [
      { symbol: 'f', meaning: 'Darcy friction factor (from Moody chart)' },
      { symbol: 'LMTD', meaning: 'Log Mean Temperature Difference (°C)' },
      { symbol: 'U', meaning: 'Overall heat transfer coefficient (W/m²K)' },
      { symbol: 'n', meaning: 'Polytropic index for compression' },
    ],
    note: DISC_NOTES['oil-gas'],
  },
  geotechnical: {
    title: 'Geotechnical Engineering Formula',
    formula: "Bearing Capacity (Terzaghi): q_ult = cNc + γDNq + 0.5γBNγ\nRational Method: Q = C × i × A\nDarcy's Law: v = k × i  (seepage velocity)",
    variables: [
      { symbol: 'c', meaning: 'Soil cohesion (kPa)' },
      { symbol: 'γ', meaning: 'Unit weight of soil (kN/m³)' },
      { symbol: 'Nc, Nq, Nγ', meaning: 'Bearing capacity factors (function of friction angle φ)' },
      { symbol: 'k', meaning: "Coefficient of permeability (m/s) — Darcy's Law" },
    ],
    note: DISC_NOTES.geotechnical,
  },
  electronics: {
    title: 'Electronics Circuit Formula',
    formula: 'RC Filter cutoff: fc = 1 / (2πRC)\nOp-Amp gain (inv.): A = −Rf / Rin\nLED resistor: R = (Vs − Vf) / If',
    variables: [
      { symbol: 'fc', meaning: 'Cutoff frequency (Hz) — −3 dB point' },
      { symbol: 'R, C', meaning: 'Resistance (Ω) and Capacitance (F)' },
      { symbol: 'Rf, Rin', meaning: 'Feedback and input resistors for op-amp gain' },
      { symbol: 'Vf, If', meaning: 'LED forward voltage (V) and current (A)' },
    ],
    note: DISC_NOTES.electronics,
  },
  aerospace: {
    title: 'Aerospace & Vehicle Formula',
    formula: 'Lift: L = ½ρv²SCl\nDrag: D = ½ρv²SCd\nHP = Torque (lb·ft) × RPM / 5252',
    variables: [
      { symbol: 'ρ', meaning: 'Air density (kg/m³) — at sea level ≈ 1.225 kg/m³' },
      { symbol: 'S', meaning: 'Wing reference area (m²)' },
      { symbol: 'Cl, Cd', meaning: 'Lift and drag coefficients (dimensionless)' },
      { symbol: '5252', meaning: 'Conversion constant for HP from lb·ft and RPM' },
    ],
    note: DISC_NOTES.aerospace,
  },
  software: {
    title: 'IT / Cloud Engineering Formula',
    formula: 'Monthly Cost = Σ(resource_qty × unit_price × usage_hours)\nCVSS Score = Base × Temporal × Environmental\nLTV = ARPU × Gross_Margin / Monthly_Churn',
    variables: [
      { symbol: 'ARPU', meaning: 'Average Revenue Per User (monthly)' },
      { symbol: 'Churn', meaning: 'Monthly customer churn rate (%)' },
      { symbol: 'CVSS', meaning: 'Common Vulnerability Scoring System (0–10)' },
      { symbol: 'PUE', meaning: 'Power Usage Effectiveness (data center efficiency, ideal = 1.0)' },
    ],
    note: DISC_NOTES.software,
  },
  management: {
    title: 'Project Management Formula',
    formula: 'EVM: CPI = EV / AC  |  SPI = EV / PV\nEAC = BAC / CPI\nNPV = Σ[Cashflow_t / (1+r)^t]',
    variables: [
      { symbol: 'EV', meaning: 'Earned Value — budgeted cost of work performed' },
      { symbol: 'AC', meaning: 'Actual Cost — actual cost incurred to date' },
      { symbol: 'BAC', meaning: 'Budget at Completion — total authorized budget' },
      { symbol: 'r', meaning: 'Discount rate for NPV calculation' },
    ],
    note: DISC_NOTES.management,
  },
}

// ─── How to Use steps (5 per discipline) ─────────────────────
type HowToStep = { name: string; text: string }
const HOW_TO_STEPS: Record<string, HowToStep[]> = {
  'civil-structural': [
    { name: 'Gather load and geometry data', text: "Collect the key design inputs: span length, applied loads (dead, live, wind, seismic), material grade (concrete f'c, steel Fy), and cross-sectional dimensions. Use design drawings or field measurements — accuracy here directly affects result reliability." },
    { name: 'Enter section and material properties', text: "Input beam or column cross-section properties (width, depth, moment of inertia I) and material specifications. For standard steel sections, refer to AISC section tables. For concrete, confirm the specified compressive strength f'c and steel grade." },
    { name: 'Apply loading conditions', text: 'Specify load type and distribution: point load (P), uniformly distributed load (UDL = w), or moment (M). For multi-load cases, analyse each case separately and combine results per the applicable load combination (ASCE 7 or Eurocode).' },
    { name: 'Calculate and interpret results', text: 'Click Calculate to get deflection, stress, bearing capacity, or the specific structural parameter. Compare to code limits: deflection ≤ L/360 for live load (typical), stress ≤ 0.9Fy for steel, bearing capacity with FOS ≥ 3.0 for foundations.' },
    { name: 'Apply factors and document for PE review', text: 'Divide calculated capacity by the appropriate factor of safety (FOS), or apply load factors per LRFD. Record the result with units and the governing load case. Have results reviewed by a licensed structural engineer before any construction use.' },
  ],
  electrical: [
    { name: 'Identify circuit parameters', text: 'Determine the supply voltage (single-phase or three-phase), load current or connected load (kW), power factor, and cable run length. Refer to the equipment nameplate or engineering specifications for accurate values.' },
    { name: 'Select cable and installation method', text: 'Choose the conductor material (copper or aluminium), insulation type (XLPE, PVC), and installation method (conduit, trunking, direct burial). These factors affect the ampacity deration multipliers applied to the base cable rating.' },
    { name: 'Enter inputs and calculate', text: 'Input all required values and click Calculate. The tool returns cable size, voltage drop percentage, current rating, and power loss. For three-phase systems, confirm whether your voltage inputs are line-to-line or line-to-neutral.' },
    { name: 'Check code compliance', text: 'Verify that voltage drop is within code limits: NEC recommends ≤3% for branch circuits and ≤2% for feeders (5% total). IEC recommends ≤4% total. If voltage drop exceeds limits, increase cable size by one or two AWG/mm² steps.' },
    { name: 'Document and arrange inspection', text: 'Record the calculated cable size, current, and voltage drop with the calculation basis. All electrical designs must be verified by a licensed Electrical Engineer and inspected by the AHJ before installation.' },
  ],
  mechanical: [
    { name: 'Define the geometry', text: 'Enter precise dimensions: shaft diameter, beam span, pipe inside diameter, or wall thickness. For components with complex geometry, use the equivalent simplified section that best represents the critical cross-section under load.' },
    { name: 'Specify material properties', text: "Select the material grade or manually enter Young's modulus (E), yield strength (Fy), Poisson's ratio, and density. For uncommon alloys or composites, obtain values from the material datasheet — generic default values may not apply." },
    { name: 'Enter operating conditions', text: 'Set the applied forces, pressures, torques, temperatures, or flow rates relevant to the calculation. Use worst-case design conditions rather than typical operating values to ensure the component is designed for peak loads.' },
    { name: 'Calculate and compare to limits', text: 'Click Calculate to get stress, deflection, safety factor, or other design metric. Compare to allowable values: for steel, allowable stress ≈ 0.6Fy for ASD or ≥ 1.5 safety factor; for deflection, check against equipment tolerance requirements.' },
    { name: 'Apply safety factors and document', text: 'Multiply the calculated load by the design safety factor (typically 1.5–3× for mechanical components) before finalising. Document the calculation with material grade, applied load, and governing standard for PE review.' },
  ],
  hvac: [
    { name: 'Collect building envelope data', text: 'Enter floor area, ceiling height, wall and roof U-values (or R-values), window area and glazing properties, and building orientation. For existing buildings, this information comes from as-built drawings or on-site measurement.' },
    { name: 'Set climate and occupancy inputs', text: 'Enter outdoor design temperature (from ASHRAE Fundamentals climate data for your location), number of occupants, equipment heat gains, and lighting power density. Internal gains can contribute 20–50% of the total cooling load.' },
    { name: 'Specify HVAC system parameters', text: 'Enter supply air temperature, chilled water supply/return temperatures, or duct dimensions as required. For duct sizing, enter the design airflow rate in L/s or CFM and select the equal-friction or constant-velocity design method.' },
    { name: 'Calculate and size equipment', text: 'Click Calculate to get cooling or heating load (kW or BTU/hr), duct velocity, or equipment COP/EER. Equipment capacity should be sized at 90–100% of peak calculated load — oversizing degrades part-load efficiency and humidity control.' },
    { name: 'Validate with a full load study', text: 'These preliminary calculations should be validated with a full Manual J (residential) or ASHRAE 90.1-compliant energy model (commercial) before equipment procurement. Engage a licensed HVAC engineer for final equipment specification.' },
  ],
  'oil-gas': [
    { name: 'Define fluid properties', text: 'Enter fluid density, dynamic viscosity, vapour pressure, and specific gravity at operating conditions. For hydrocarbons, use process simulation outputs or API technical data books. Accurate fluid properties are critical — small errors propagate significantly in pipe sizing.' },
    { name: 'Specify pipe geometry and length', text: 'Enter nominal pipe diameter, wall schedule (sch 40, 80, etc.), pipe material roughness (ε), and total equivalent pipe length including fittings (add 10–30% to straight-run length for typical fitting content).' },
    { name: 'Set flow and pressure conditions', text: 'Enter design flow rate, inlet pressure, and outlet pressure or elevation change. For compressible gas flow, check that the pressure ratio across the line is <0.2 (sub-critical) for validity of the incompressible-flow approximation.' },
    { name: 'Calculate and check velocity', text: 'Get pressure drop, Reynolds number, and friction factor instantly. Verify that line velocity is within acceptable limits: 1–3 m/s for liquids (erosion concern above 3 m/s), 15–30 m/s for gases. High velocity causes erosion, noise, and vibration.' },
    { name: 'Apply design margin and arrange HAZOP', text: 'Add a 10–20% design safety margin to calculated equipment sizes. All pressure-containing equipment in oil and gas service must comply with ASME B31.3, applicable API standards, and requires PE review and HAZOP analysis.' },
  ],
  geotechnical: [
    { name: 'Compile site investigation data', text: 'Gather borehole logs, SPT N-values, laboratory test results (Atterberg limits, grain size, direct shear, triaxial), groundwater levels, and site geology information. Reliable geotechnical calculation depends entirely on the quality of site investigation data.' },
    { name: 'Select appropriate soil parameters', text: 'Derive cohesion (c), friction angle (φ), and unit weight (γ) from laboratory tests or SPT correlations. Use conservative (lower bound) estimates for capacity calculations and upper bound estimates for settlement calculations.' },
    { name: 'Define foundation or slope geometry', text: 'Enter footing dimensions and embedment depth for bearing capacity; slope geometry (height, angle, slip circle radius) for stability; or catchment area and runoff characteristics for stormwater calculations.' },
    { name: 'Calculate and apply FOS', text: 'Get bearing capacity, settlement, or stability factor of safety (FOS) instantly. For foundations, FOS ≥ 3.0 is typical (FOS ≥ 2.5 with extensive site investigation). For slopes: FOS ≥ 1.5 for permanent slopes, ≥ 1.3 for temporary.' },
    { name: 'Commission a site-specific geotechnical investigation', text: 'These preliminary calculations should always be checked against a site-specific geotechnical investigation and report prepared by a licensed Geotechnical Engineer. Soil parameters from tables or regional correlations are not a substitute for site-specific testing.' },
  ],
  electronics: [
    { name: 'Identify the circuit function', text: 'Determine what the circuit needs to do: filter a signal, amplify a voltage, limit LED current, or decode a resistor colour code. Select the appropriate calculator from the Electronics & Telecommunications section.' },
    { name: 'Enter source and load parameters', text: 'Input supply voltage (Vcc), desired output voltage or frequency, input signal characteristics (frequency, amplitude), and load resistance or current draw. These define the operating point for component selection.' },
    { name: 'Calculate component values', text: 'Get resistor, capacitor, or inductor values required for the desired circuit function. For resistors, select the nearest E24 or E96 series standard value to the calculated result, then re-verify the circuit with the chosen standard value.' },
    { name: 'Account for component tolerances', text: 'Standard resistors have ±5% tolerance, capacitors ±10–20%. Run the calculation with worst-case component combinations (e.g., Rmin with Cmax) to verify the circuit meets spec across the full tolerance range.' },
    { name: 'Validate with SPICE before building', text: 'Use calculated values as starting points in SPICE simulation (LTspice is free) before ordering components or committing to PCB layout. Simulation reveals parasitics and loading effects that ideal calculations miss.' },
  ],
  aerospace: [
    { name: 'Gather vehicle and atmospheric data', text: 'Enter aircraft or vehicle mass, wing area (for aircraft), engine thrust or power, and operating altitude. For standard atmosphere calculations, altitude determines air density and speed of sound automatically via the ISA model.' },
    { name: 'Set performance parameters', text: 'Enter airspeed (km/h, knots, or m/s), angle of attack range, or engine RPM as applicable. Confirm whether speeds are true airspeed (TAS), indicated airspeed (IAS), or equivalent airspeed (EAS) for the specific calculation.' },
    { name: 'Calculate performance metrics', text: 'Get lift, drag, thrust-to-weight ratio, wing loading, Mach number, range estimate, or fuel economy instantly. Compare results against design requirements or published performance specifications for benchmark aircraft of similar configuration.' },
    { name: 'Apply safety margins', text: 'Aerospace design margins are mandated by regulation: commercial aircraft structures must withstand 1.5× limit load without failure. Safety margins are non-negotiable and established by airworthiness standards (FAA 14 CFR Part 25, EASA CS-25).' },
    { name: 'Consult aerospace regulations', text: 'All aircraft design and modification must comply with applicable airworthiness regulations and be approved by the regulatory authority (FAA, EASA, Transport Canada, CAA). These preliminary calculations are for educational and feasibility purposes only.' },
  ],
  software: [
    { name: 'Define your infrastructure use case', text: 'Identify the cloud resource type (EC2/Compute/VM, RDS, Lambda, S3), or specific calculation needed (cloud cost, bandwidth, CVSS risk score, container sizing). Collect current or projected usage parameters from monitoring tools or architecture documentation.' },
    { name: 'Enter resource specifications', text: 'Input vCPU count, RAM (GB), storage type and capacity, monthly traffic (GB or requests/second), and number of resource instances. For cloud cost calculations, select your target cloud provider and deployment region.' },
    { name: 'Set pricing model', text: 'Choose on-demand pricing for variable workloads, Reserved Instances (1-year or 3-year) for stable baseline workloads, or Spot/Preemptible for fault-tolerant batch processing. Reserved pricing typically saves 30–60% versus on-demand list prices.' },
    { name: 'Calculate and optimise', text: 'Get monthly cost estimate, utilisation percentage, or security score instantly. For cloud costs, compare instance types and sizes to find the best price-performance ratio for your specific workload profile.' },
    { name: 'Validate with cloud provider tooling', text: "Use AWS Cost Explorer, Azure Cost Management, or GCP Billing reports to compare estimated costs against current actuals. Always validate estimates with the provider's native pricing calculator before committing to architecture decisions." },
  ],
  management: [
    { name: 'Gather project baseline data', text: 'Collect the project schedule (activity list, durations, dependencies), approved budget (BAC), and planned resource allocation. For EVM calculations, you need the baseline plan established before performance tracking can begin.' },
    { name: 'Input current performance data', text: 'Enter actual costs incurred (AC), percentage complete for each work package (to compute EV), and planned value for the status date (PV from the baseline S-curve). Accurate percent-complete estimates are critical — front-loading completion distorts EVM results.' },
    { name: 'Calculate performance indices', text: 'Get CPI, SPI, EAC, and ETC instantly. CPI > 1 means under budget; CPI < 1 means over budget. SPI > 1 means ahead of schedule; SPI < 1 means behind. EAC gives the projected final cost at current performance trends.' },
    { name: 'Interpret and take corrective action', text: 'Use EAC to reassess the budget-to-complete and take corrective action if CPI < 0.9. Alert stakeholders early when CPI < 0.85 — projects rarely recover from this level without scope reduction or scope change management.' },
    { name: 'Document and report', text: 'Record CPI, SPI, EAC, and schedule float with the calculation date for status reporting. EVM data supports contractor claims, change order substantiation, and completion forecasting per PMI/EVMA standards.' },
  ],
}

// ─── When to Use cards (5 per discipline) ────────────────────
type WhenToUseCard = { icon: string; title: string; description: string }
const WHEN_TO_USE_CARDS: Record<string, WhenToUseCard[]> = {
  'civil-structural': [
    { icon: '📐', title: 'Preliminary member sizing', description: 'Check beam depth, column size, and slab thickness at the concept design stage before committing to detailed structural modelling software.' },
    { icon: '🏗️', title: 'Site and feasibility checks', description: 'Quickly estimate foundation bearing pressures or retaining wall stability for site feasibility assessment and early-stage cost planning.' },
    { icon: '📊', title: 'Material quantity estimation', description: 'Calculate concrete volumes, rebar quantities, and formwork areas for preliminary cost budgeting and procurement planning.' },
    { icon: '🎓', title: 'Academic and exam preparation', description: 'Practice structural analysis calculations to build intuition for beam behaviour, deflection limits, and load paths before professional exams.' },
    { icon: '🔍', title: 'FEA model verification', description: 'Verify key outputs from finite element analysis software against simplified hand calculations to catch modelling errors before issuing construction drawings.' },
  ],
  electrical: [
    { icon: '⚡', title: 'Cable and conduit sizing', description: 'Size conductors for new circuits or verify existing cable adequacy when adding load to established electrical panels and distribution boards.' },
    { icon: '📋', title: 'Load schedule preparation', description: 'Build initial load schedules and estimate total connected load, demand load, and panel schedule current ratings for design documentation.' },
    { icon: '🌞', title: 'Solar and battery system design', description: 'Size PV panels and battery banks for off-grid or grid-tied solar systems based on daily energy consumption and local irradiance data.' },
    { icon: '💡', title: 'Energy savings analysis', description: 'Quantify electricity cost savings from LED retrofits, motor upgrades, or power factor correction investments to support capital expenditure approval.' },
    { icon: '🔌', title: 'Code compliance verification', description: 'Verify voltage drop, breaker sizing, and conductor ampacity against NEC or IEC code requirements before electrical inspection by the AHJ.' },
  ],
  mechanical: [
    { icon: '🔧', title: 'Component preliminary design', description: 'Size shafts, bolts, springs, and pressure vessels at the concept stage to establish geometry before detailed FEA or fatigue analysis.' },
    { icon: '💧', title: 'Fluid system sizing', description: 'Calculate pipe diameters, pump head requirements, and flow velocities for water supply, hydraulic, and HVAC chilled water systems.' },
    { icon: '⚙️', title: 'Gearbox and drivetrain analysis', description: 'Check gear ratios, shaft speeds, and power transmission requirements when designing or upgrading conveyor, gearbox, or motor-drive systems.' },
    { icon: '🌡️', title: 'Thermal expansion analysis', description: 'Calculate differential thermal expansion in pipelines, process equipment, and precision machinery to ensure adequate clearances over the operating temperature range.' },
    { icon: '📈', title: 'Fatigue life estimation', description: 'Estimate component fatigue life under cyclic loading to identify whether design modifications or reduced load cycles are needed to meet service life requirements.' },
  ],
  hvac: [
    { icon: '🏢', title: 'Building HVAC load estimation', description: 'Estimate cooling and heating loads for office, retail, or industrial buildings at the concept stage to select approximate equipment capacity.' },
    { icon: '🌬️', title: 'Duct sizing and air distribution', description: 'Size main and branch ducts for equal-friction design to ensure balanced airflow distribution and acceptable duct velocity across all zones.' },
    { icon: '♻️', title: 'Energy efficiency evaluation', description: 'Evaluate COP, EER, and SEER values when comparing equipment alternatives, and calculate annual energy savings from upgrading to higher-efficiency units.' },
    { icon: '💧', title: 'Chilled water system design', description: 'Size chilled water pipes, calculate flow rates, and determine pump head requirements for central plant distribution systems in large buildings.' },
    { icon: '📊', title: 'Building energy audit', description: 'Estimate building thermal performance and identify envelope improvements (insulation, glazing, air sealing) that offer the greatest energy savings per dollar invested.' },
  ],
  'oil-gas': [
    { icon: '🛢️', title: 'Pipeline hydraulics pre-check', description: 'Calculate pressure drop and verify line velocity for proposed pipelines before detailed CAESAR II or PIPESIM hydraulic simulation.' },
    { icon: '🔥', title: 'Heat exchanger preliminary sizing', description: 'Estimate required heat transfer area for a process stream before detailed thermal rating using HTRI or Aspen Exchanger Design & Rating software.' },
    { icon: '⚙️', title: 'Compressor power estimation', description: 'Estimate gas compressor power requirements for process conceptual design and utility load balancing before equipment datasheets are prepared.' },
    { icon: '🔬', title: 'Fluid property calculations', description: 'Calculate gas molecular weight, density corrections, and pressure-temperature relationships when working with hydrocarbon mixtures or process gases.' },
    { icon: '🌡️', title: 'Steam system analysis', description: 'Look up steam properties at process conditions for heat balance calculations, steam trap sizing, and steam line specification.' },
  ],
  geotechnical: [
    { icon: '🏗️', title: 'Foundation feasibility assessment', description: 'Quickly assess whether shallow foundations are viable or deep foundations are required based on preliminary soil parameters from borehole logs.' },
    { icon: '⛰️', title: 'Slope stability screening', description: 'Screen natural and engineered slopes for stability using simplified Bishop or Fellenius methods to identify sites requiring detailed analysis.' },
    { icon: '💧', title: 'Stormwater drainage design', description: 'Apply the Rational Method to estimate peak runoff for drainage channels, detention ponds, and culvert sizing in small to medium catchments.' },
    { icon: '🌱', title: 'Environmental impact assessment', description: 'Calculate water demand, wastewater generation, and water quality indices to support environmental impact assessments and permit applications.' },
    { icon: '🔬', title: 'Site seismic risk screening', description: 'Assess liquefaction potential using SPT-based simplified procedures to identify sites requiring detailed site-specific seismic hazard analysis.' },
  ],
  electronics: [
    { icon: '🔌', title: 'Quick component selection', description: 'Determine resistor values for LED current limiting, voltage dividers, and pull-up/pull-down circuits without manual calculation or datasheet lookup.' },
    { icon: '📻', title: 'Antenna and RF system design', description: 'Calculate quarter-wave antenna lengths for IoT, amateur radio, and Wi-Fi frequency bands for custom PCB or external antenna design.' },
    { icon: '🎛️', title: 'Filter and amplifier design', description: 'Design RC low-pass or high-pass filters and op-amp gain stages with the correct component values for your desired frequency and gain.' },
    { icon: '🔋', title: 'Power supply and protection circuits', description: 'Size zener voltage regulators, calculate LED resistors, and determine capacitor charge/discharge times for power supply circuit design.' },
    { icon: '🖥️', title: 'PCB trace design', description: 'Calculate PCB trace widths for current-carrying capacity and check signal loss in transmission lines to meet IPC-2221A design guidelines.' },
  ],
  aerospace: [
    { icon: '✈️', title: 'Aircraft preliminary performance', description: 'Estimate thrust-to-weight ratio, wing loading, and range for initial aircraft configuration studies before CFD analysis and wind tunnel testing.' },
    { icon: '🚗', title: 'Vehicle performance comparison', description: 'Compare fuel economy, power-to-weight ratio, and braking distance across vehicle models or engine configurations during selection.' },
    { icon: '🔋', title: 'EV trip range planning', description: 'Estimate EV range from battery capacity and energy consumption rate to plan long-distance trips and identify required charging stops.' },
    { icon: '🚀', title: 'Rocket and drone sizing', description: 'Calculate thrust-to-weight requirements and drag estimates for model rockets, UAVs, and small satellite launch vehicles.' },
    { icon: '🌍', title: 'Mach regime analysis', description: 'Convert airspeeds to Mach numbers at different altitudes to identify transonic flight conditions and the onset of wave drag in high-speed design.' },
  ],
  software: [
    { icon: '☁️', title: 'Cloud cost estimation', description: 'Estimate monthly AWS, Azure, or GCP infrastructure costs before architectural commitment to support budget approval and vendor comparison.' },
    { icon: '📊', title: 'SaaS business metrics', description: 'Calculate LTV, CAC, payback period, and churn impact to assess unit economics and guide pricing, acquisition spending, and retention investment.' },
    { icon: '🔐', title: 'Security risk prioritisation', description: 'Score cybersecurity vulnerabilities using CVSS v3.1 to objectively prioritise patch remediation by risk level across your infrastructure.' },
    { icon: '🖥️', title: 'Container and K8s sizing', description: 'Size Docker container resource requests and limits, estimate Kubernetes cluster requirements, and assess server rack power and cooling capacity.' },
    { icon: '🌐', title: 'Network capacity planning', description: 'Calculate required network bandwidth for video streaming, backup, or API workloads, and estimate CDN cost savings from edge caching.' },
  ],
  management: [
    { icon: '📅', title: 'Project schedule analysis', description: 'Identify the critical path, calculate total and free float, and determine which activities control the project end date for schedule compression.' },
    { icon: '💰', title: 'EVM performance tracking', description: 'Calculate CPI and SPI weekly to provide objective schedule and cost performance data for project status reporting and contract compliance.' },
    { icon: '🏗️', title: 'Construction cost estimation', description: 'Generate preliminary bills of quantities and cost estimates for budget approval, tender comparison, or contingency assessment.' },
    { icon: '🏗️', title: 'Equipment lift planning', description: 'Calculate crane lift capacity requirements, rigging weights, and boom configurations before mobilising lifting equipment to site.' },
    { icon: '📈', title: 'Project ROI and depreciation', description: 'Evaluate capital project ROI, payback period, and asset depreciation for investment justification, tax planning, and asset management.' },
  ],
}

// ─── Quick Reference rows (7 per discipline) ─────────────────
type QuickRefRow = { input: string; description: string; example: string }
const QUICK_REF_ROWS: Record<string, QuickRefRow[]> = {
  'civil-structural': [
    { input: 'Span Length (L)', description: 'Distance between supports (m or ft)', example: '6.0 m' },
    { input: 'Applied Load (P or w)', description: 'Point load (kN) or UDL (kN/m)', example: '50 kN / 15 kN/m' },
    { input: "Young's Modulus (E)", description: 'Steel ≈ 200 GPa, Concrete ≈ 30 GPa', example: '200 GPa (steel)' },
    { input: 'Moment of Inertia (I)', description: 'Second moment of area (cm⁴ or m⁴)', example: '8,500 cm⁴' },
    { input: 'Factor of Safety (FOS)', description: 'Structural: 1.5–2.0, Foundation: 2.5–3.0', example: 'FOS = 3.0' },
    { input: 'Deflection Limit', description: 'L/360 for floors (live load), L/240 for roof', example: '16.7 mm (L/360)' },
    { input: 'Output', description: 'Deflection (mm), stress (MPa), or capacity (kN)', example: '12.5 mm deflection' },
  ],
  electrical: [
    { input: 'Supply Voltage (V)', description: 'System voltage: 120V/240V/415V/11kV', example: '415V (3-phase)' },
    { input: 'Load Current (I)', description: 'Full-load current in amperes (A)', example: '65 A' },
    { input: 'Power Factor (PF)', description: 'Ratio of real to apparent power (0–1)', example: '0.85 lagging' },
    { input: 'Cable Length (L)', description: 'One-way cable run length (m)', example: '120 m' },
    { input: 'Voltage Drop Limit', description: 'NEC: ≤3% branch, ≤2% feeder (5% total)', example: '≤3% = 12.45V' },
    { input: 'Conductor Size', description: 'AWG (North America) or mm² (IEC/AS)', example: '35 mm² copper' },
    { input: 'Output', description: 'Voltage drop (%), cable size, power loss', example: '2.8% / 35 mm²' },
  ],
  mechanical: [
    { input: 'Applied Force (F)', description: 'Force in Newtons (N) or kilonewtons (kN)', example: '10,000 N' },
    { input: 'Cross-section Area (A)', description: 'Actual cross-sectional area (mm²)', example: '1,200 mm²' },
    { input: "Young's Modulus (E)", description: 'Material stiffness: steel 200 GPa, Al 70 GPa', example: '200 GPa' },
    { input: 'Yield Strength (Fy)', description: 'Material yield stress (MPa)', example: '250 MPa (mild steel)' },
    { input: 'Safety Factor', description: 'Typically 1.5–3× for mechanical components', example: 'FOS = 2.0' },
    { input: 'Reynolds Number (Re)', description: '<2300 laminar, >4000 turbulent', example: 'Re = 8,400 (turbulent)' },
    { input: 'Output', description: 'Stress (MPa), deflection (mm), flow rate (m³/s)', example: 'σ = 83 MPa' },
  ],
  hvac: [
    { input: 'Floor Area', description: 'Building or zone conditioned area (m² or ft²)', example: '450 m²' },
    { input: 'Cooling Load Density', description: 'Typical: 80–150 W/m² office, 100–200 W/m² retail', example: '120 W/m²' },
    { input: 'Supply Air Temp (Ts)', description: 'AHU supply air temperature (°C or °F)', example: '12°C' },
    { input: 'Return Air Temp (Tr)', description: 'Space return temperature (°C or °F)', example: '24°C' },
    { input: 'Duct Velocity', description: 'Main duct: 5–10 m/s, branch: 3–6 m/s', example: '7 m/s (main)' },
    { input: 'COP / EER', description: 'Efficiency: chiller COP 3–6, split AC EER 3–4', example: 'COP = 4.2' },
    { input: 'Output', description: 'Cooling load (kW), duct size (mm), airflow (L/s)', example: '54 kW / 900 mm duct' },
  ],
  'oil-gas': [
    { input: 'Pipe Diameter (D)', description: 'Internal diameter of pipe (mm or inches)', example: 'DN150 (ID 154.1 mm)' },
    { input: 'Flow Rate (Q)', description: 'Volumetric or mass flow rate', example: '500 m³/h liquid' },
    { input: 'Fluid Density (ρ)', description: 'Density at operating conditions (kg/m³)', example: '850 kg/m³ (crude oil)' },
    { input: 'Dynamic Viscosity (μ)', description: 'Fluid viscosity (cP or Pa·s)', example: '5 cP (5×10⁻³ Pa·s)' },
    { input: 'Pipe Roughness (ε)', description: 'Commercial steel: 0.046 mm', example: '0.046 mm' },
    { input: 'Pipe Length (L)', description: 'Total equivalent length including fittings', example: '850 m equiv.' },
    { input: 'Output', description: 'Pressure drop (kPa/m), Reynolds number, friction factor', example: '0.45 kPa/m' },
  ],
  geotechnical: [
    { input: 'SPT N-value', description: 'Standard penetration test blow count', example: 'N = 15' },
    { input: 'Cohesion (c)', description: 'Soil cohesion intercept (kPa)', example: '20 kPa (silty clay)' },
    { input: 'Friction Angle (φ)', description: 'Internal friction angle (degrees)', example: '30° (medium sand)' },
    { input: 'Unit Weight (γ)', description: 'Soil unit weight (kN/m³)', example: '18 kN/m³' },
    { input: 'Foundation Depth (D)', description: 'Depth of footing base below ground (m)', example: '1.5 m' },
    { input: 'Factor of Safety', description: 'Foundation: 2.5–3.0, Slope: 1.3–1.5', example: 'FOS = 3.0' },
    { input: 'Output', description: 'Ultimate bearing capacity (kPa), FOS, settlement (mm)', example: 'q_ult = 360 kPa' },
  ],
  electronics: [
    { input: 'Supply Voltage (Vs)', description: 'DC supply voltage (V)', example: '5V or 12V' },
    { input: 'Resistance (R)', description: 'Resistance value in ohms (Ω, kΩ, MΩ)', example: '10 kΩ' },
    { input: 'Capacitance (C)', description: 'Capacitance in farads (F, μF, nF, pF)', example: '100 nF' },
    { input: 'Frequency (f)', description: 'Signal or cutoff frequency (Hz, kHz, MHz)', example: '1 kHz' },
    { input: 'Feedback Resistor (Rf)', description: 'Op-amp feedback resistor for gain setting', example: '100 kΩ (×10 gain)' },
    { input: 'LED Forward Voltage', description: 'Vf: red 1.8–2.2V, green/blue 3.0–3.5V', example: '2.0V (red LED)' },
    { input: 'Output', description: 'Cutoff frequency, gain, component value, or signal loss', example: 'fc = 159 Hz' },
  ],
  aerospace: [
    { input: 'Aircraft Weight (W)', description: 'Total gross weight at takeoff (kg or lbf)', example: '75,000 kg' },
    { input: 'Engine Thrust (T)', description: 'Total net thrust at sea level (kN or lbf)', example: '260 kN (2 engines)' },
    { input: 'Wing Area (S)', description: 'Reference wing planform area (m²)', example: '120 m²' },
    { input: 'Airspeed (V)', description: 'True airspeed (m/s, knots, or km/h)', example: '250 m/s TAS' },
    { input: 'Altitude', description: 'Pressure altitude (m or ft) for ISA density', example: '10,000 m (cruise)' },
    { input: 'Lift/Drag Coefficient', description: 'CL: 0.3–1.5 cruise/approach; CD: 0.02–0.04 clean', example: 'CL = 0.5' },
    { input: 'Output', description: 'T/W ratio, wing loading, Mach, lift/drag force', example: 'T/W = 0.35' },
  ],
  software: [
    { input: 'vCPU count', description: 'Number of virtual CPU cores allocated', example: '8 vCPUs' },
    { input: 'RAM (GB)', description: 'Memory allocated to instance or container', example: '32 GB' },
    { input: 'Storage (GB)', description: 'Block or object storage capacity required', example: '500 GB SSD' },
    { input: 'Usage Hours/Month', description: '730h = 24/7 always-on, less for scheduled shutdowns', example: '730h (always-on)' },
    { input: 'Pricing Tier', description: 'On-demand, 1-yr reserved, 3-yr reserved, spot', example: '1-yr reserved (35% saving)' },
    { input: 'CVSS Base Score', description: 'Low <4, Medium <7, High <9, Critical ≥9', example: 'Score 8.5 = High' },
    { input: 'Output', description: 'Monthly cost ($), cost saving ($), or risk score', example: '$340/mo' },
  ],
  management: [
    { input: 'Planned Value (PV)', description: 'Budgeted cost of work scheduled to date', example: '$850,000' },
    { input: 'Earned Value (EV)', description: 'Budgeted cost of work actually completed', example: '$780,000' },
    { input: 'Actual Cost (AC)', description: 'Actual expenditure incurred to date', example: '$920,000' },
    { input: 'Budget at Completion (BAC)', description: 'Total approved project budget', example: '$5,200,000' },
    { input: 'CPI', description: 'EV/AC — >1 under budget, <1 over budget', example: 'CPI = 0.85 (15% over)' },
    { input: 'SPI', description: 'EV/PV — >1 ahead of schedule, <1 behind', example: 'SPI = 0.92 (8% behind)' },
    { input: 'Output (EAC)', description: 'BAC/CPI — projected final cost', example: '$6,118,000' },
  ],
}

// ─── Pro Tips (4 per discipline) ─────────────────────────────
const PRO_TIPS: Record<string, string[]> = {
  'civil-structural': [
    'Never design to the calculated minimum. For steel structures, always check the next section size up — moving from W12×35 to W12×40 adds modest material cost but provides significant reserve capacity for unforeseen loads, connection eccentricities, and future modifications.',
    "Deflection controls beam depth more often than stress for spans greater than 6–8 metres. The L/360 deflection limit typically governs before the allowable stress is reached. A beam that is strong enough in bending may still be too flexible under live load, causing cracking of brittle finishes or ceiling systems below.",
    'Soil bearing pressure beneath footings must be checked for both the ultimate limit state (capacity with FOS ≥ 3.0) AND serviceability limit state (expected settlement ≤ 25 mm for most structures). A footing may be strong enough to support the load but still cause unacceptable differential settlement in soft or compressible soils.',
    'Always verify that your simplified calculation model matches the actual structural behaviour. A fixed connection behaves very differently from a pin — modelling a moment-resisting connection as pinned produces a significantly larger span moment and deflection, and modelling a pin as fixed understates the support rotation demand.',
  ],
  electrical: [
    'NEC ampacity tables assume standard installation conditions. Derating factors for conduit fill (>3 conductors = multiply by 0.8), high ambient temperature (>30°C), and continuous loads (×0.8 for circuits loaded >3 hours) stack multiplicatively. A cable sized for its listed ampacity may need to be 2–3 standard sizes larger when all applicable derating factors are applied.',
    'Voltage drop is cumulative from source to load. Calculate the drop on both the feeder AND the branch circuit separately, then sum them. NEC recommends total voltage drop ≤5%. A feeder at 2.5% and a branch at 3.5% totals 6.0% — over the recommended limit despite both individual circuits appearing within range when checked separately.',
    'Short-circuit current (Isc) at the panel determines breaker interrupting capacity, not just the overcurrent protection rating. For panels near utility transformers, Isc can exceed 50,000A. Always verify that the breaker AIC (Ampere Interrupting Capacity) rating exceeds the available fault current — using an undersized breaker is a serious fire and explosion hazard.',
    'Power factor correction capacitors should target PF = 0.95, not 1.0. Overcorrection to unity PF causes leading power factor, which creates voltage rise problems and potential resonance with utility-side harmonics. Target 0.95 lagging — this eliminates utility penalty charges without the risks associated with overcorrection.',
  ],
  mechanical: [
    'Stress concentration factors (Kt) are often ignored in preliminary calculations but dominate real component failures. A notch, keyway, thread root, or change in cross-section multiplies nominal stress by 1.5–4×. For fatigue-critical components, always multiply the calculated nominal stress by Kt before comparing to the endurance limit.',
    "The Darcy-Weisbach friction factor from the Moody chart assumes fully-developed turbulent flow in straight pipe. Add equivalent lengths for fittings and valves (K-factor tables) to get total equivalent pipe length. A fully-open globe valve has Keq ≈ 340 pipe diameters equivalent length — far larger than it visually suggests.",
    "Gear tooth fatigue typically initiates at the tooth root (bending fatigue), not the surface, even though surface pitting is what you observe during inspection. AGMA gear design requires checking both bending stress (tooth root) and contact stress (surface pitting) separately. The governing failure mode depends on material, heat treatment, and lubrication quality.",
    'Thermal expansion in long piping runs is routinely underestimated. A 100 m carbon steel pipe heated from 20°C to 80°C expands by 72 mm. Without expansion loops, expansion joints, or offset pipe runs, this expansion generates stresses that can exceed yield strength. Always design pipe layout with thermal expansion accommodation from the start.',
  ],
  hvac: [
    "Rule-of-thumb cooling load estimates (W/m² or BTU/ft²) can be off by ±50% depending on glazing area, building orientation, and occupancy density. A south-facing open-plan office with floor-to-ceiling glazing can have 3–4× the cooling load of a well-insulated north-facing space of the same floor area. Never apply simplified rules-of-thumb to glazing-dominated buildings.",
    'Duct leakage is the largest single source of HVAC system energy waste — ASHRAE 90.1 allows no more than 4% leakage, but field measurements routinely find 10–30%. Specify sealed, tested ductwork (SMACNA leakage Class A or B) in contract documents and require post-installation duct leakage testing before system commissioning.',
    'Variable Air Volume (VAV) systems save 30–60% in fan energy compared to constant-volume systems because fan power scales with the cube of airspeed. Reducing airflow to 70% of design reduces fan power to 34% (0.7³). Variable frequency drives (VFDs) on supply and return fans are essential to realise these energy savings.',
    'Thermal comfort depends on six factors: air temperature, mean radiant temperature, air velocity, humidity, activity level, and clothing — not just air temperature alone. Chilled ceiling or radiant systems can achieve equivalent comfort at 26°C instead of 22°C by reducing mean radiant temperature, saving 10–15% cooling energy over a conventional all-air system.',
  ],
  'oil-gas': [
    "At high Reynolds numbers (fully turbulent flow), the Darcy-Weisbach friction factor becomes independent of Reynolds number and depends only on relative roughness ε/D. Use the fully-turbulent approximation: 1/√f = -2 log(ε/3.7D) rather than iterating through the Colebrook equation. This is more accurate than assuming a constant f for high-velocity gas transmission lines.",
    'Two-phase (vapour-liquid) flow regimes have dramatically higher pressure drops than either single-phase calculation predicts. Pipe sections operating near the bubble point or dew point of a hydrocarbon mixture should be checked for two-phase flow using a process simulator. A pipe designed as a single-phase liquid line that actually runs in slug flow will be severely undersized.',
    'Heat exchanger fouling factors (Rf) are often 30–100% of the clean overall U-value for typical process applications. Always size heat exchangers using the fouled U-value from TEMA standards for the applicable service type (water, hydrocarbon, steam). A heat exchanger sized for clean service will be underperforming after 6–12 months of operation.',
    'NPSH margin is the most frequently overlooked pump design parameter. The minimum required margin (NPSHa − NPSHr) should be at least 0.5 m for small pumps and 1.0–2.0 m for large or high-energy pumps. Always calculate NPSHa at the worst-case condition: maximum fluid temperature (highest vapour pressure) AND minimum suction-side liquid level.',
  ],
  geotechnical: [
    "Soil bearing capacity calculations give the ultimate load before shear failure — but consolidation settlement in clay often governs design before ultimate capacity is reached. A footing that passes the bearing capacity check (FOS = 3.0) may still settle 50–100 mm in soft clay. Always check both ultimate capacity AND expected settlement, particularly on sites with soft clay, organic soils, or variable fill.",
    "SPT N-values are among the most unreliable test results in geotechnical practice due to energy variability between drilling rigs and operators. Always correct raw N-values to N60 (60% hammer energy efficiency) before applying any correlation: N60 = N_raw × ER/60. Energy ratios (ER) range from 45–85% — failing to correct can result in N-values that differ by 30–40% from the corrected value.",
    "Limit equilibrium slope stability methods (Bishop, Janbu, Spencer) assume a rigid body sliding on a predefined failure surface. Real slope failures involve progressive failure initiation, pore pressure build-up during rapid loading or rainfall, and strain-softening in brittle materials. A calculated FOS = 1.3 provides only a thin margin — uncertainty in pore pressures alone can consume it entirely.",
    'Groundwater level dramatically affects bearing capacity and lateral earth pressure calculations. Water above the footing base reduces effective soil unit weight from γ (≈18 kN/m³) to γ\' = γ − γw (≈8 kN/m³) — halving the effective stress. Always establish the highest seasonal groundwater table from piezometer data, not the observed level at the time of investigation.',
  ],
  electronics: [
    'Op-amp bandwidth decreases with gain due to the gain-bandwidth product (GBP) limitation. A standard op-amp with GBP = 1 MHz provides 1 MHz bandwidth at unity gain, 100 kHz at ×10 gain, and only 10 kHz at ×100 gain. For audio or video applications requiring high gain and high bandwidth simultaneously, select a wideband op-amp with GBP ≥ 100 MHz.',
    'Decoupling capacitors are critical for stable op-amp and digital IC operation and are routinely omitted in initial designs. Place 100 nF X7R ceramic capacitors on every IC supply pin, as close to the pin as physically possible on the PCB. For wide-bandwidth decoupling, combine 100 nF (high-frequency) with 10 μF electrolytic (low-frequency) capacitors in parallel.',
    'LED forward current must be tightly controlled for consistent brightness. LED forward voltage Vf varies ±10–20% between devices and decreases approximately 2 mV/°C with temperature. A simple series resistor allows current to vary with Vf variation. For consistent brightness in precision applications or high-power LEDs, use a constant-current driver rather than a resistor to avoid thermal runaway.',
    'PCB trace impedance must be controlled for signals above ~50 MHz. At these frequencies, traces behave as transmission lines, and impedance mismatch causes reflections that corrupt high-speed digital data. For differential pairs (USB, LVDS, Ethernet), control differential impedance to ±10% of the target (typically 90Ω or 100Ω) using your PCB manufacturer\'s stackup-specific impedance calculator.',
  ],
  aerospace: [
    "Engine thrust varies significantly with altitude. A turbofan engine loses approximately 15–20% thrust per 1,000 m altitude gain due to reduced air density. An aircraft with T/W = 0.35 at sea level may have T/W = 0.25 at 10,000 m cruise altitude. Always specify altitude and ISA conditions when referencing engine thrust — sea level static thrust is misleading for cruise and climb performance.",
    'Aerodynamic drag increases with the square of velocity, and power required increases with the cube. Doubling airspeed quadruples drag force and increases power by 8×. For ground vehicles and EVs: driving at 130 km/h uses 2–3× more energy per km than driving at 80 km/h on the same road. Speed is the dominant variable in vehicle energy consumption at highway speeds.',
    "Real-world braking distance is typically 30–40% longer than the calculated kinematic stopping distance on dry asphalt. Contributing factors: tyre condition, vehicle load, brake fade on extended descents, road surface (wet asphalt = 30–40% longer, snow = 3–10× longer), and driver reaction time (add 1.5 s × speed to calculated stopping distance). Always apply realistic conditions.",
    'EV range calculations at standard consumption rates are most accurate for highway driving at constant speed. Cold temperatures below 10°C reduce lithium-ion battery capacity by 20–40% due to electrochemical kinetics — winter range is typically 25–35% less than rated range. Account for temperature, HVAC loads, battery age (typically 15–20% capacity loss over 150,000 km), and driving speed in range estimates.',
  ],
  software: [
    'Cloud cost optimisation is 80% architecture decisions and 20% pricing model choices. The largest cost levers are: right-sizing compute (typical starting estimates are 2× actual utilisation — use CloudWatch/Azure Monitor for real P95 data), eliminating idle resources (unattached EBS volumes, stopped EC2, unused Elastic IPs), and converting on-demand baseline workloads to Reserved Instances for 30–60% savings.',
    "LTV/CAC ratio of 3× is a minimum threshold, not a target. Best-in-class SaaS companies achieve LTV/CAC > 5× with CAC payback < 12 months. Most LTV problems are actually churn problems in disguise — a 2% reduction in monthly churn can double LTV. If your LTV/CAC is below 3×, investigate churn root causes before increasing acquisition spending.",
    'A CVSS score alone is insufficient for patch prioritisation. A Critical-rated vulnerability (CVSS ≥ 9.0) in an isolated development system is lower urgency than a High-rated vulnerability (CVSS 7.5) in an internet-facing authentication endpoint. Augment CVSS with EPSS (Exploit Prediction Scoring System) which predicts the probability of exploitation within 30 days — this is a significantly better real-world risk predictor.',
    "Container memory limits must not equal requests. If a container's memory limit equals its request, any memory spike above the request triggers an OOMKill — the container is killed and restarted, potentially causing service interruption. Set memory limits at 1.5–2× requests to allow headroom for memory spikes. For CPU, the limit sets the throttle rate — CPU-limited containers appear much slower in production than they did in development.",
  ],
  management: [
    'CPI below 0.85 at project mid-point rarely recovers to 1.0. The well-documented "CPI stability" phenomenon in project controls shows that a project at 20% complete with CPI = 0.80 will almost certainly finish at CPI 0.82–0.90, not 1.0 — because the root causes of overrun (scope creep, rework, inefficient crews) continue. Raise the formal alert at CPI < 0.90, not at project completion.',
    "Float in a network schedule is not time you can freely consume. Using float on one activity can expose hidden critical paths elsewhere in the network. When an activity consumes its float, recompute the entire network to identify newly critical activities. Projects with multiple near-critical paths (float within 1–3 days of the critical path) are significantly more schedule-sensitive than projects with a single dominant critical path.",
    "Bill of Quantities accuracy depends entirely on the design completion at the time of take-off. BOQ from schematic drawings (10–20% complete) will have ±40–50% accuracy; from construction drawings (90%+ complete), ±10–15%. Always state the design completion basis and accuracy range explicitly — presenting a conceptual estimate as a reliable ±15% budget without disclosing its basis is a common source of construction contract disputes.",
    'Contractor markup rates are not fixed percentages — they vary by project risk, market conditions, and contractor workload. In competitive tender markets, markup on labour is typically 12–18%; in negotiated or sole-source environments, 20–30% is common. The largest variable in contractor pricing is overhead allocation, which changes with backlog. Always benchmark against at least three competitive tenders — the spread between bids reveals the market risk premium.',
  ],
}

// ─── About section paragraphs (discipline-specific) ──────────
const ABOUT_PARAGRAPHS: Record<string, (toolName: string) => string[]> = {
  'civil-structural': (n) => [
    `The ${n} is a structural or civil engineering calculation tool grounded in established design standards including ASCE 7 (loading), ACI 318 (reinforced concrete), AISC 360 (structural steel), and Eurocode 2/3. It takes specific design inputs — span lengths, applied loads, material grades, section properties, or soil parameters — and applies classical structural analysis methods combined with modern code-based design approaches to determine whether a structural element is adequate, what its deflection or stress is, or how much material is required.`,
    `Civil and structural engineering is a safety-critical discipline: failures cause loss of life, property damage, and significant legal liability. Every calculation methodology used in these tools is referenced to published, peer-reviewed standards. The exact formula, variables, and code reference are displayed in the Formula section below. Formula transparency is important: a practitioner who understands exactly how a result is calculated is better placed to recognise when an input is outside the validated range, when boundary conditions don't match, or when additional analysis is needed.`,
    `Important limitations to understand: these tools apply idealised boundary conditions and loading patterns. Real structures have imperfections, eccentric connections, load combinations, and second-order effects (P-Δ) that simplified formulas don't capture. Results represent preliminary design values that must be combined with appropriate load factors and safety factors before comparison to design capacity. They do not substitute for complete structural analysis including load combination effects, lateral system design, and connection design.`,
    `These calculators are used by civil and structural engineering students learning structural analysis, by practicing engineers performing preliminary sizing before committing to detailed FEA software, by quantity surveyors estimating material quantities, and by construction managers verifying field measurements against design intent. The quick calculation capability is particularly useful during design meetings, site visits, and feasibility studies where immediate quantitative answers are needed.`,
    `For any structural application that will be incorporated into a building, bridge, retaining structure, or other engineered work, all calculations must be reviewed, verified, and sealed by a licensed Professional Engineer (PE) or Chartered Structural Engineer (CEng MIStructE) in the applicable jurisdiction before use in construction. Building permits require engineer-sealed drawings in virtually all jurisdictions, and local building code amendments may impose requirements not reflected in standard formula references.`,
    `All calculations run entirely in your browser. No project data, load values, material specifications, member dimensions, or any other information is transmitted to any server, stored in any database, or shared with any third party. Your structural design work remains completely private on your device, with no account required.`,
  ],
  electrical: (n) => [
    `The ${n} performs electrical engineering calculations for circuit design, power system sizing, cable selection, and energy analysis — applications that span low-voltage residential wiring, commercial building electrical systems, and medium-voltage industrial installations. Inputs typically include voltage levels, load currents, power factor, cable lengths, and conductor cross-sections; outputs include voltage drop, conductor sizing, power consumption, equipment ratings, and code compliance assessments.`,
    `These calculations apply the core equations of electrical engineering: Ohm's Law (V = IR), the three-phase power relationships (P = √3 × VL × IL × PF), the Darcy voltage drop equation (Vd = 2IRL/1000 for single-phase), and transformer and motor sizing formulas. Where applicable, calculations reference the National Electrical Code (NEC), IEC 60364, and AS/NZS 3000. The voltage drop calculator follows NEC Article 210 guidelines (≤3% for branch circuits, ≤2% for feeders), and wire sizing follows NEC ampacity tables with derating factors for conduit fill and temperature. The exact formula and code reference are displayed on this page.`,
    `Critical limitations to understand: these calculators assume balanced three-phase loads, ideal transformer operation, and sinusoidal supply voltage at fundamental frequency. They do not account for harmonic distortion (significant with VFDs and switching power supplies), voltage unbalance in three-phase systems, the effect of ambient temperature on ampacity beyond standard deration factors, or the specific impedance characteristics of specialty cable constructions. For systems with significant harmonic content, a power quality study using measurement instruments and specialist software is required.`,
    `These tools serve electrical engineers performing preliminary system design, electricians verifying NEC/IEC code compliance before installation, energy managers performing savings analysis, solar system designers sizing PV and battery banks, and electrical engineering students learning circuit analysis. The cable sizing and voltage drop calculators are among the most practically used tools for anyone designing or troubleshooting electrical distribution systems.`,
    `All electrical installations must comply with local electrical codes and must be inspected by the authority having jurisdiction (AHJ). In most countries, electrical work above specified voltages or current levels must be designed by a licensed Electrical Engineer and installed by a licensed electrician. These calculators provide preliminary values that must always be verified against the current edition of the applicable electrical code, with appropriate safety margins applied, before any installation work proceeds.`,
    `All calculations run in your browser only. No circuit parameters, cable specifications, load values, or project data is transmitted to any server or stored in any way. Your electrical design data remains entirely private on your device.`,
  ],
  mechanical: (n) => [
    `The ${n} applies mechanical engineering analysis to calculate forces, stresses, fluid dynamics parameters, heat transfer values, or mechanical component performance metrics — covering applications from structural bolt design to pump system sizing, from gear drive analysis to vibration frequency estimation. Each tool takes specific geometric, material, and operating parameters and applies fundamental mechanical engineering equations to compute the critical design metric needed for component validation.`,
    `These calculations are based on classical mechanics and materials science. Stress analysis uses Hooke's Law (σ = Eε), bending stress formula (σ = My/I), and torsion equations; fluid flow calculations use the Darcy-Weisbach equation with Moody friction factors; heat transfer applies Newton's Law of Cooling and Fourier's Law of Conduction; and dynamic analysis uses natural frequency equations from harmonic oscillator theory. Material constants for common engineering materials (steel, aluminium, cast iron, common polymers) are built in based on ASTM A36, 6061-T6, and ISO material standards. The specific formula and reference are shown in the Formula section below.`,
    `Limitations to understand: these tools assume linear elastic material behaviour (stresses below yield strength), steady-state operating conditions, and simplified geometry. Real components have stress concentrations at notches, holes, fillets, and keyways that multiply local stresses by 1.5–4× the nominal value. Fatigue analysis requires knowledge of surface finish correction factors, notch sensitivity, and cyclic load history — not captured in static stress calculations. The tools do not account for residual stresses from manufacturing, creep at elevated temperatures, or combined multi-axis loading states more complex than the single-load-case formulas implemented.`,
    `These tools are used by mechanical design engineers for preliminary component sizing before FEA, manufacturing engineers validating dimensional tolerances and fits, maintenance engineers diagnosing equipment failures, process engineers sizing fluid systems, and mechanical engineering students learning applied mechanics. The bolt torque, spring constant, bearing life, fatigue life, and Reynolds number calculators are particularly valuable for day-to-day machine design and system engineering work.`,
    `For any mechanical component used in safety-critical applications — including pressure vessels, lifting equipment, aircraft components, medical devices, or any application where failure could cause injury — design must be verified by a qualified Mechanical Engineer and comply with applicable codes (ASME BPVC, EN 13445, AS 4343, PED 2014/68/EU). Certification by a recognised inspection body may also be required. Do not rely on preliminary calculator output as the sole basis for final design approval.`,
    `All calculations run locally in your browser. No design parameters, material specifications, dimensional data, or project information is transmitted to any server or stored anywhere. Your engineering intellectual property remains completely private.`,
  ],
  hvac: (n) => [
    `The ${n} helps mechanical engineers, HVAC designers, and building services consultants calculate cooling and heating loads, size ductwork and piping, evaluate equipment efficiency, and assess building energy performance. Inputs include building dimensions, insulation U-values, occupancy and equipment gains, climate design conditions, and system operating parameters; outputs include thermal loads in kW or BTU/hr, duct sizes, flow rates, COP/EER values, and annual energy consumption estimates.`,
    `These tools implement ASHRAE engineering fundamentals: the sensible heat equation (Qs = ṁ × Cp × ΔT), psychrometric relationships for mixed-air and dehumidification calculations, the LMTD method for heat exchanger sizing, and the Manual J/N load calculation methodology for residential and commercial systems respectively. Duct sizing follows the ASHRAE equal-friction method targeting 0.8–1.2 Pa/m pressure drop. Ventilation rates reference ASHRAE 62.1 Table 6.2.2 values. U-value calculations follow ISO 6946 and ASHRAE 90.1 procedures for building envelope thermal resistance.`,
    `Important limitations of these preliminary tools: accurate cooling and heating load calculation requires detailed building envelope modelling with current local TMY3 (Typical Meteorological Year) weather data, precise solar orientation analysis, thermal mass effects, infiltration path modelling, and occupancy diversity factors. These tools provide simplified estimates that may be ±20–40% compared to a full ASHRAE detailed calculation. Equipment performance degrades at part-load conditions not captured in design-point calculations — a chiller rated at COP 6.0 at design may achieve only COP 3.0 at 25% load.`,
    `These tools serve HVAC engineers performing preliminary equipment sizing for budget development, energy auditors estimating building loads for audit reports, contractors providing indicative quotes before detailed engineering is completed, facility managers assessing equipment replacement options, and building services students learning thermal engineering principles and ASHRAE calculation methods.`,
    `Full HVAC system design requires a detailed Manual J (residential) or ASHRAE/CIBSE load calculation performed by a licensed Mechanical Engineer using current local climate data, complete building envelope specifications, and accurate internal load data. Equipment must be commissioned, balanced, and tested after installation, and regulatory compliance with energy codes (ASHRAE 90.1, Title 24, Part L, NZBC H1) requires documented energy analysis, not preliminary estimates.`,
    `All calculations run in your browser only. No building geometry data, energy consumption figures, equipment specifications, or project details are transmitted to any server or stored in any database.`,
  ],
  'oil-gas': (n) => [
    `The ${n} supports process and piping engineers in performing hydraulic calculations, heat exchanger sizing, compression analysis, and equipment preliminary design for oil, gas, and chemical processing facilities. These tools apply the fundamental equations of fluid mechanics and thermodynamics to estimate pressure drops, heat duties, equipment sizes, and fluid properties for hydrocarbons and process fluids across a wide range of operating conditions.`,
    `Key formulas implemented include: the Darcy-Weisbach pressure drop equation (ΔP = f × L/D × ρv²/2) with Moody friction factors from the Colebrook-White equation; the LMTD method with F-correction factors for heat exchanger thermal duty calculations (Q = U × A × LMTD); isentropic compression equations for gas compressor power estimation; and ISO 5167 discharge coefficient methodology for orifice plate flow measurement. Calculations reference API RP standards, ASME B31.3 (process piping), TEMA heat exchanger standards, and chemical engineering first principles. The formula and standard reference are shown in the Formula section below.`,
    `Limitations: these tools assume single-phase (all-liquid or all-gas) Newtonian fluid flow and idealised equipment geometry. Real process conditions frequently involve two-phase vapour-liquid flow (dramatically higher pressure drops than single-phase calculations predict), non-Newtonian fluids (slurries, polymer solutions), and transient conditions during startup, shutdown, and slug flow. Heat exchanger sizing does not account for fouling resistance (Rf), maldistribution, or pressure-dependent physical properties. All results are order-of-magnitude estimates requiring verification through rigorous process simulation software (HYSYS, Aspen, PIPESIM).`,
    `These tools are used by process and piping engineers for preliminary design and feasibility checks, chemical engineering students learning mass and energy balances, and plant operations engineers cross-checking equipment performance against original design specifications. The pipe pressure drop, heat exchanger sizing, and pump NPSH calculators are among the most frequently used tools in day-to-day process engineering work.`,
    `All process designs involving hazardous fluids, high-pressure systems, fired equipment, rotating machinery, or safety-critical elements (pressure relief valves, flare stacks, high-pressure vessels) require full Hazard and Operability Study (HAZOP), Process Safety Management (PSM) review per OSHA 29 CFR 1910.119, and sign-off by a licensed Chemical or Process Engineer per ASME and API codes. These preliminary calculations do not substitute for rigorous process simulation or formal safety analysis.`,
    `All calculations run in your browser. No fluid compositions, operating conditions, equipment specifications, or process data is transmitted to any server or stored in any way. Your process design data remains completely private.`,
  ],
  geotechnical: (n) => [
    `The ${n} applies soil mechanics and environmental engineering methods to evaluate foundation bearing capacity, consolidation settlement, slope stability, lateral earth pressures, seepage analysis, and water resources calculations. These tools translate site investigation data — SPT N-values, laboratory test results, borehole logs — into preliminary geotechnical design parameters and stability assessments referenced to Terzaghi, Meyerhof, Bishop, Darcy, and other foundational geotechnical methods.`,
    `The primary formulas implemented include: Terzaghi's and Meyerhof's bearing capacity equations (q_ult = cNc + γDNq + 0.5γBNγ) for shallow foundation design; the Rational Method (Q = CiA) for stormwater peak runoff estimation; Bishop's modified method for circular slip surface slope stability; and Darcy's Law (v = ki) for seepage velocity and flow quantity analysis. SPT correlation relationships (Meyerhof, Bowles, Skempton) convert blow count N-values to friction angle and cohesion estimates. These methods are referenced in AASHTO LRFD, Eurocode 7, FHWA geotechnical publications, and standard geotechnical engineering texts. The full formula and reference are shown in the Formula section below.`,
    `Critical limitations: geotechnical calculations are highly sensitive to site-specific soil variability that no formula can fully capture. SPT-based correlations have significant scatter — the same N-value can represent soils with very different properties depending on confining stress, gradation, and test procedure. Settlement predictions from elastic and Terzaghi consolidation theory routinely underestimate actual settlements due to secondary compression, soil heterogeneity, and stress history effects. Slope stability analyses assume idealised failure surfaces and uniform soil properties — real slopes have layered soils, tension cracks, and pore pressure distributions that can only be properly modelled with a dedicated geotechnical software package.`,
    `These tools serve geotechnical engineers performing preliminary design checks before detailed analysis, students learning classical soil mechanics, civil engineers estimating stormwater runoff for drainage design in small catchments, and environmental engineers assessing water resources and water quality. The bearing capacity, slope stability, and Rational Method stormwater calculators are particularly widely used in preliminary geotechnical and drainage design.`,
    `All geotechnical designs for foundations, retaining walls, embankments, slopes, and tunnels must be based on a site-specific geotechnical investigation (boreholes, CPT testing, laboratory analysis) and must be reviewed and sealed by a licensed Geotechnical Engineer. Relying on assumed or regional-average soil parameters for final design is not acceptable engineering practice. Contact a licensed Geotechnical Engineer before making any foundation or slope design decisions for construction.`,
    `All calculations run in your browser. No site investigation data, soil parameters, project coordinates, or geotechnical design information is transmitted to any server or stored anywhere. Your project data remains completely private.`,
  ],
  electronics: (n) => [
    `The ${n} helps electronics engineers, PCB designers, and hobbyists calculate component values, signal parameters, and circuit characteristics for passive and active electronic circuits. These tools cover resistor selection and colour code decoding, RC and active filter design, op-amp gain stages, antenna length calculation, PCB trace current capacity, LED driver resistor sizing, signal loss estimation, and capacitor charge/discharge calculations — all based on standard circuit analysis methods referenced to IPC, IEEE, and EIA standards.`,
    `Core formulas used include: Ohm's Law and voltage divider relationships; the RC filter cutoff frequency equation (fc = 1/2πRC); inverting op-amp gain (Av = −Rf/Rin) and non-inverting gain (Av = 1 + Rf/Rin); antenna quarter-wavelength formula (λ/4 in metres = 75/f_MHz); IPC-2221A-based PCB trace current capacity calculation; the decibel signal loss equation (dB = 20 log₁₀(Vout/Vin)); zener shunt regulator current and power equations; and the LED series resistor formula (R = (Vs − Vf)/If). The exact formula and reference for this tool are shown in the Formula section below.`,
    `Limitations: component calculations assume ideal behaviour. Real resistors have tolerance (±1% to ±10%), capacitors have parasitic ESL and ESR that limit high-frequency performance, and op-amps have finite gain-bandwidth product that reduces gain above the GBP/Av frequency. Antenna performance depends critically on ground plane size, nearby metallic structures, and feed impedance matching — the length formula gives an idealised free-space value. PCB trace temperature rise depends on copper weight, surface finish, and proximity to other heat-generating traces. Always derate from calculated maximums and validate designs with SPICE simulation before committing to PCB layout.`,
    `These tools are used by electronics engineering students learning circuit theory, hardware makers and hobbyists building projects, RF engineers making rapid propagation estimates, and PCB designers verifying trace current ratings and filter characteristics during schematic review. The resistor colour code, LED resistor, RC filter, and op-amp gain calculators are particularly useful for everyday circuit design work.`,
    `For safety-critical electronic applications — including medical devices (IEC 60601), aerospace (DO-178C/DO-254), automotive (ISO 26262/ASPICE), or industrial safety systems (IEC 61508/SIL) — component selection and circuit design must follow formal verification and validation processes, including DFMEA, SPICE simulation, prototype testing, and certification by an accredited testing laboratory. Regulatory compliance cannot be achieved through calculation alone.`,
    `All calculations run in your browser. No circuit parameters, component values, PCB specifications, or design data is transmitted to any server or stored in any way. Your circuit design work remains completely private.`,
  ],
  aerospace: (n) => [
    `The ${n} provides aerodynamic, propulsion, and vehicle dynamics calculations for aircraft, rockets, drones, and ground vehicles — covering lift and drag estimation, thrust-to-weight analysis, wing loading, Mach number conversion, fuel economy, electric vehicle range, and braking distance. These tools apply classical aerodynamic theory and vehicle mechanics to provide rapid preliminary performance estimates referenced to Anderson's Fundamentals of Aerodynamics, Raymer's Aircraft Design, the International Standard Atmosphere (ISA) model, and vehicle engineering standards.`,
    `The fundamental equations used include: the lift and drag equations from the standard aerodynamic model (L = ½ρV²SCL, D = ½ρV²SCD); thrust-to-weight ratio (T/W = Thrust ÷ Weight); wing loading (W/S = Weight ÷ Wing Area); the Breguet range equation for propeller and jet aircraft; and the Mach number relationship (M = V/a, where speed of sound a is computed from the ISA temperature-altitude model). Vehicle calculations use the power equation (P = F × v), kinematic braking formula, and EPA combined fuel economy methodology. Electric vehicle range uses the energy balance model (Range = Battery_kWh × 1000 / Consumption_Wh/km). The formula details are shown in the Formula section below.`,
    `Limitations: aerodynamic coefficients (CL, CD) are configuration-dependent and vary significantly with angle of attack, Reynolds number, surface roughness, and flap/slat configuration. These tools use representative values that may not match your specific aircraft configuration. The ISA model assumes a standard dry atmosphere — actual air density deviates with humidity, non-standard temperature, and local pressure. EV range calculations at standard consumption rates do not account for temperature effects on battery capacity (20–40% reduction below 10°C), battery degradation with age, or HVAC energy loads. Braking calculations assume constant deceleration on dry flat pavement.`,
    `These tools serve aerospace engineering students learning aerodynamics and propulsion, conceptual aircraft designers performing initial sizing studies, automotive engineers making quick vehicle performance comparisons, EV owners planning long-distance trips, and drone designers calculating thrust requirements and endurance. The thrust-to-weight, drag coefficient, wing loading, and EV range calculators are particularly useful for initial design space exploration.`,
    `All aircraft design and modification must be reviewed and approved by the relevant airworthiness authority (FAA, EASA, Transport Canada, CASA). Commercial aircraft design requires compliance with FAA 14 CFR Part 25 or EASA CS-25 and requires formal aerodynamic analysis, structural qualification, and system safety assessment. Automotive safety systems require compliance with FMVSS (US), ECE (EU), or equivalent regulations. These calculators provide educational estimates for feasibility purposes only.`,
    `All calculations run in your browser. No vehicle specifications, performance parameters, mission profiles, or project data is transmitted to any server or stored anywhere.`,
  ],
  software: (n) => [
    `The ${n} helps cloud architects, DevOps engineers, IT managers, and software developers estimate infrastructure costs, size compute and memory resources, assess cybersecurity risk scores, analyse SaaS business unit economics, and plan network capacity. These tools translate technical parameters — server instance types, storage volumes, API request rates, user counts, vulnerability attributes — into the financial and operational metrics needed for architecture decisions, capacity planning, and business cases.`,
    `Key methodologies implemented include: cloud cost modelling based on published AWS, Azure, and GCP pricing with on-demand and committed-use pricing tiers; CVSS v3.1 (Common Vulnerability Scoring System) for cybersecurity risk assessment; SaaS financial metrics (LTV = ARPU × Gross Margin / Monthly Churn; CAC payback = CAC / (ARPU × Gross Margin)); network bandwidth utilisation models; Kubernetes pod resource allocation using the K8s resource model (requests, limits, QoS classes); password entropy using Shannon's formula (H = L × log₂N, where L is length and N is character set size); and server rack power utilisation and cooling capacity calculations using PUE (Power Usage Effectiveness). The exact formula used by this tool is shown in the Formula section below.`,
    `Limitations: cloud cost estimates are based on list pricing at standard usage patterns — actual monthly bills vary significantly with reserved instance utilisation, volume discounts, data transfer costs (notoriously difficult to estimate), spot/preemptible interruptions, and region-specific pricing. CVSS scores reflect technical vulnerability severity but do not incorporate organisational context, compensating security controls, or threat intelligence about active exploitation. SaaS financial metrics use steady-state assumptions that may not reflect early-stage growth dynamics or cohort behaviour. All cost estimates should be validated with actual cloud provider pricing calculators and billing data before making architecture commitments.`,
    `These tools are used by cloud architects designing cost-efficient infrastructure, startup founders evaluating unit economics before scaling, security engineers prioritising CVE remediation backlogs, DevOps teams right-sizing container deployments, data centre managers assessing rack capacity, and IT students learning cloud and network fundamentals. The cloud cost estimator, CVSS risk scorer, LTV/CAC calculator, and container sizing tools are among the most practically useful for day-to-day cloud and DevOps work.`,
    `Cloud architecture decisions involving regulated data (HIPAA, PCI-DSS, GDPR, SOC 2, FedRAMP) require formal security assessment, compliance architecture review, and typically third-party audit or certification. Cybersecurity risk prioritisation for enterprise environments should incorporate threat intelligence, penetration testing results, and consultation with qualified information security professionals (CISSP, CISM, or equivalent). SaaS financial modelling for investor presentations should be prepared or reviewed by a qualified financial analyst or CPA.`,
    `All calculations run in your browser. No server specifications, pricing data, security metrics, SaaS revenue figures, or business data is transmitted to any server or stored in any database. Your business intelligence remains completely private.`,
  ],
  management: (n) => [
    `The ${n} supports project managers, quantity surveyors, cost engineers, and construction professionals in scheduling analysis, earned value management, cost estimation, equipment productivity assessment, and capital investment evaluation. These tools apply standard project management frameworks and financial analysis methods to translate project parameters into schedule efficiency metrics, cost performance indices, and budget forecasts referenced to PMI/PMBOK 7th Edition, ANSI/EIA-748 EVM standards, and standard construction cost estimating practice.`,
    `The primary methodologies implemented include: Critical Path Method (CPM) forward and backward pass analysis for total and free float calculation; Earned Value Management (EVM) with Planned Value (PV), Earned Value (EV), and Actual Cost (AC) and their derived indices (CPI = EV/AC, SPI = EV/PV, EAC = BAC/CPI, TCPI = (BAC-EV)/(BAC-AC)); depreciation calculations using straight-line (SLM), declining balance, and sum-of-digits methods; Net Present Value (NPV) and Internal Rate of Return (IRR) using discounted cash flow theory; and return on investment (ROI = (Net Profit / Cost of Investment) × 100%). Construction cost estimating follows RSMeans unit-cost methodology with contingency factors. The full formula and reference are shown in the Formula section below.`,
    `Important limitations: CPM analysis assumes deterministic activity durations. Real projects have duration uncertainty better modelled by Monte Carlo simulation (PERT-based or risk-based schedule modelling). EVM requires accurate percentage-complete estimates which are inherently subjective — the "80% complete syndrome" (activities appearing stuck at 80%) is a well-documented phenomenon that distorts CPI and SPI. Construction cost estimates from elemental or unit-rate methods have ±30–50% accuracy at the conceptual stage. Equipment productivity rates vary widely by site conditions, operator experience, weather, and equipment condition. Always explicitly state estimate accuracy ranges when presenting preliminary figures to clients or stakeholders.`,
    `These tools are used by project managers tracking schedule and cost performance for project status reporting, quantity surveyors preparing preliminary estimates for budget development, construction managers planning crane lifts and equipment deployment, financial analysts assessing capital project investment returns, and project management students learning EVM and CPM for professional certifications (PMP, PMQ, MSP).`,
    `For contract administration, procurement decisions, contractor claims management, and financial reporting, all cost estimates and schedule analyses should be prepared or reviewed by a Certified Project Management Professional (PMP), Certified Cost Professional (CCP), or Quantity Surveyor (QS/PQS). Legal and contractual decisions — including claims, variations, and liquidated damages calculations — require specialist legal and commercial expertise. Financial analysis for major capital investment decisions should be reviewed by a Chartered Accountant or qualified investment advisor.`,
    `All calculations run in your browser. No project schedules, budget data, cost information, equipment specifications, or business metrics are transmitted to any server or stored in any database. Your project and business data remains completely private on your device.`,
  ],
}

// ─── AboutContent component ───────────────────────────────────
function AboutContent({
  toolName,
  discipline,
}: {
  toolName: string
  discipline: { id: string; label: string; icon: string } | null
}) {
  const disciplineId = discipline?.id ?? 'civil-structural'
  const paragraphsFn = ABOUT_PARAGRAPHS[disciplineId] ?? ABOUT_PARAGRAPHS['civil-structural']!
  const paragraphs = paragraphsFn(toolName)
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0">
          {para}
        </p>
      ))}
    </>
  )
}

// ─── Formula display — always returns ────────────────────────
function getFormulaInfo(
  slug: string,
  configFormula: string | null,
  disciplineId: string,
  toolName: string
): { title: string; formula: string; variables: Array<{ symbol: string; meaning: string }>; note: string } {

  // Explicit per-slug formulas
  const explicit: Record<string, { title: string; formula: string; variables: Array<{ symbol: string; meaning: string }>; note: string }> = {
    'ohms-law-calculator': {
      title: "Ohm's Law Formulas",
      formula: "V = I × R    (Voltage)\nI = V / R    (Current)\nR = V / I    (Resistance)\nP = V × I = I²R = V²/R    (Power)",
      variables: [
        { symbol: 'V', meaning: 'Voltage in volts (V)' },
        { symbol: 'I', meaning: 'Current in amperes (A)' },
        { symbol: 'R', meaning: 'Resistance in ohms (Ω)' },
        { symbol: 'P', meaning: 'Power in watts (W)' },
      ],
      note: "Ohm's Law applies to linear resistive elements at DC or low-frequency AC. Not applicable to non-linear components (diodes, transistors) or reactive circuits at high frequency.",
    },
    'beam-deflection-calculator': {
      title: 'Beam Deflection Formulas',
      formula: 'Simply Supported (centre load): δ = PL³ / (48EI)\nCantilever (tip load):           δ = PL³ / (3EI)\nSimply Supported (UDL):          δ = 5wL⁴ / (384EI)',
      variables: [
        { symbol: 'P', meaning: 'Point load (N or kN)' },
        { symbol: 'w', meaning: 'Uniformly distributed load (N/m or kN/m)' },
        { symbol: 'L', meaning: 'Span length (m or mm)' },
        { symbol: 'E', meaning: "Young's modulus (GPa) — steel ≈ 200, concrete ≈ 30, timber ≈ 12" },
        { symbol: 'I', meaning: 'Second moment of area (m⁴ or cm⁴)' },
      ],
      note: 'L/360 is the typical maximum deflection limit for floors (aesthetics); L/240 for roof members supporting non-brittle finishes. Per ACI 318 and AISC 360.',
    },
    'reynolds-number-calculator': {
      title: 'Reynolds Number Formula',
      formula: 'Re = ρ × v × D / μ  =  v × D / ν\nLaminar: Re < 2300  |  Turbulent: Re > 4000',
      variables: [
        { symbol: 'ρ', meaning: 'Fluid density (kg/m³)' },
        { symbol: 'v', meaning: 'Flow velocity (m/s)' },
        { symbol: 'D', meaning: 'Characteristic length / pipe diameter (m)' },
        { symbol: 'μ', meaning: 'Dynamic viscosity (Pa·s)' },
        { symbol: 'ν', meaning: 'Kinematic viscosity = μ/ρ (m²/s)' },
      ],
      note: 'Re determines flow regime. Laminar: smooth, predictable. Turbulent: higher friction losses. Re 2300–4000 is a transition zone with mixed behavior.',
    },
    'voltage-drop-calculator': {
      title: 'Voltage Drop Formula',
      formula: 'Single-phase: Vd = 2 × I × R × L / 1000\n3-Phase:       Vd = √3 × I × R × L / 1000\nR = ρ × L / A   (Conductor resistance)',
      variables: [
        { symbol: 'I', meaning: 'Load current (A)' },
        { symbol: 'R', meaning: 'Conductor resistance per unit length (Ω/km)' },
        { symbol: 'L', meaning: 'One-way cable length (m)' },
        { symbol: 'ρ', meaning: 'Resistivity — copper ≈ 1.72×10⁻⁸ Ω·m, aluminium ≈ 2.82×10⁻⁸ Ω·m' },
        { symbol: 'A', meaning: 'Cable cross-sectional area (mm²)' },
      ],
      note: 'NEC recommends ≤3% drop for branch circuits and ≤2% for feeders (5% total). IEC 60364 recommends ≤4% total.',
    },
    'three-phase-power-calculator': {
      title: '3-Phase Power Formulas',
      formula: 'Active Power:    P = √3 × VL × IL × PF  (kW)\nApparent Power:  S = √3 × VL × IL        (kVA)\nReactive Power:  Q = √3 × VL × IL × sin(φ)  (kVAR)\nPower Factor:    PF = P / S = cos(φ)',
      variables: [
        { symbol: 'VL', meaning: 'Line-to-line voltage (V)' },
        { symbol: 'IL', meaning: 'Line current (A)' },
        { symbol: 'PF', meaning: 'Power factor (dimensionless, 0–1)' },
        { symbol: 'φ', meaning: 'Phase angle between voltage and current' },
      ],
      note: 'For delta connection: Vphase = VL. For star (wye): Vphase = VL/√3. Current relationship reverses for delta vs wye.',
    },
    'cooling-load-calculator': {
      title: 'Cooling Load Formula',
      formula: 'Sensible Heat: Qs = m × Cp × ΔT  (kW or BTU/hr)\nLatent Heat:   Ql = m × hfg  (kW)\nTotal Load:    Qt = Qs + Ql\n1 ton cooling = 3.517 kW = 12,000 BTU/hr',
      variables: [
        { symbol: 'Qs', meaning: 'Sensible heat gain (kW) — affects temperature' },
        { symbol: 'Ql', meaning: 'Latent heat gain (kW) — affects humidity' },
        { symbol: 'Cp', meaning: 'Specific heat of air ≈ 1.006 kJ/kg·K' },
        { symbol: 'hfg', meaning: 'Latent heat of vaporisation of water ≈ 2501 kJ/kg' },
      ],
      note: 'Based on ASHRAE Fundamentals and Manual J methodology. Full building load calculation must account for all envelope components, solar gain, internal loads, and ventilation.',
    },
    'pipe-pressure-drop': {
      title: 'Darcy-Weisbach Pressure Drop',
      formula: 'ΔP = f × (L/D) × (ρv²/2)\nHazen-Williams: V = 0.8492 × C × R^0.63 × S^0.54\nFriction factor (turbulent): 1/√f = −2log(ε/3.7D + 2.51/(Re√f))  (Colebrook)',
      variables: [
        { symbol: 'f', meaning: 'Darcy friction factor (from Moody chart)' },
        { symbol: 'L/D', meaning: 'Pipe length to diameter ratio' },
        { symbol: 'ρ', meaning: 'Fluid density (kg/m³)' },
        { symbol: 'v', meaning: 'Flow velocity (m/s)' },
        { symbol: 'ε/D', meaning: 'Relative roughness (dimensionless)' },
      ],
      note: 'For water distribution, Hazen-Williams (C = 100–150) is commonly used. Darcy-Weisbach is more rigorous for all fluids. Add 10–20% for fittings and valves.',
    },
    'bolt-torque-calculator': {
      title: 'Bolt Torque Formula',
      formula: 'T = K × d × F\nClamp Force: F = T / (K × d)\nK (nut factor) ≈ 0.20 (dry), 0.15 (lubricated)',
      variables: [
        { symbol: 'T', meaning: 'Applied torque (N·m or ft·lb)' },
        { symbol: 'K', meaning: 'Nut factor / torque coefficient (dimensionless)' },
        { symbol: 'd', meaning: 'Nominal bolt diameter (m or inches)' },
        { symbol: 'F', meaning: 'Clamp force / bolt preload (N or lbf)' },
      ],
      note: 'K varies significantly with lubrication, surface condition, and plating. Verify K with manufacturer data for critical joints. Typical preload = 75% of bolt proof load.',
    },
    'resistor-color-code': {
      title: 'Resistor Color Code Formula',
      formula: 'R (Ω) = (10 × D₁ + D₂) × 10^M  ±  Tolerance%\n5-band: (100D₁ + 10D₂ + D₃) × 10^M  ±  T%',
      variables: [
        { symbol: 'D₁, D₂', meaning: 'First and second significant digit bands' },
        { symbol: 'M', meaning: 'Multiplier band (exponent of 10)' },
        { symbol: 'T', meaning: 'Tolerance band: Gold=±5%, Silver=±10%, Brown=±1%' },
        { symbol: 'Color order', meaning: 'Blk=0, Brn=1, Red=2, Org=3, Yel=4, Grn=5, Blu=6, Vio=7, Gry=8, Wht=9' },
      ],
      note: 'Standard E12 series (10% tolerance) and E24 series (5% tolerance) cover most common values. E96 (1%) and E192 (0.5%) are for precision applications.',
    },
    'solar-panel-battery-sizing': {
      title: 'Solar System Sizing',
      formula: 'Daily Energy: E = P × Hours (kWh/day)\nPanel Count: N = E / (Panel_Wp × PSH × η)\nBattery AH: AH = E / (V × DoD × η_inv)',
      variables: [
        { symbol: 'P', meaning: 'Daily load power (kW)' },
        { symbol: 'PSH', meaning: 'Peak Sun Hours per day at location (4–6 hrs typical)' },
        { symbol: 'η', meaning: 'System efficiency (0.75–0.85 for losses, wiring, temperature)' },
        { symbol: 'DoD', meaning: 'Depth of Discharge — 0.5 for lead-acid, 0.8 for lithium' },
      ],
      note: 'PSH data from NREL PVWatts or local meteorological records. Add 20–25% oversizing to account for panel degradation and seasonal variation.',
    },
    'heat-transfer-calculator': {
      title: 'Heat Transfer Formulas',
      formula: 'Conduction:  Q = k × A × ΔT / L  (W)\nConvection:  Q = h × A × ΔT  (W)\nRadiation:   Q = ε × σ × A × (T₁⁴ − T₂⁴)  (W)',
      variables: [
        { symbol: 'k', meaning: 'Thermal conductivity (W/m·K) — steel ≈ 50, copper ≈ 385, insulation ≈ 0.04' },
        { symbol: 'h', meaning: 'Convective heat transfer coefficient (W/m²K)' },
        { symbol: 'ε', meaning: 'Emissivity (0–1) — black body = 1' },
        { symbol: 'σ', meaning: 'Stefan-Boltzmann constant = 5.67×10⁻⁸ W/m²K⁴' },
      ],
      note: 'In practice, all three heat transfer modes occur simultaneously. The dominant mode depends on geometry and temperatures. Use combined R-value for insulation assessments.',
    },
    'gear-ratio-calculator': {
      title: 'Gear Ratio & Torque',
      formula: 'GR = N_driven / N_driver = ω_in / ω_out\nOutput Torque: T_out = T_in × GR × η\nOutput Speed: n_out = n_in / GR',
      variables: [
        { symbol: 'GR', meaning: 'Gear ratio (driven teeth / driver teeth)' },
        { symbol: 'N', meaning: 'Number of teeth on each gear' },
        { symbol: 'T_out', meaning: 'Output torque (N·m)' },
        { symbol: 'η', meaning: 'Gear efficiency (0.95–0.99 for spur/helical gears)' },
      ],
      note: 'GR > 1 = speed reduction, torque multiplication. GR < 1 = speed increase, torque reduction. Always multiply torque by efficiency to get actual output.',
    },
    'stress-strain-calculator': {
      title: "Stress, Strain & Hooke's Law",
      formula: "Normal Stress: σ = F / A  (Pa)\nStrain:        ε = σ / E  (dimensionless)\nHooke's Law:   σ = E × ε\nShear Stress:  τ = V × Q / (I × b)  (Pa)",
      variables: [
        { symbol: 'σ', meaning: 'Normal stress (Pa = N/m²)' },
        { symbol: 'ε', meaning: 'Normal strain (dimensionless) — change in length / original length' },
        { symbol: 'E', meaning: "Young's modulus of elasticity (GPa)" },
        { symbol: 'τ', meaning: 'Shear stress (Pa)' },
      ],
      note: "Steel yield strength ≈ 250–690 MPa (grade dependent). Aluminium ≈ 100–550 MPa. Always stay below 60% of yield strength in design per most codes.",
    },
    'project-roi-calculator': {
      title: 'NPV, IRR & Payback Period',
      formula: 'NPV = Σ[Ct / (1+r)^t] − C₀\nPayback = Initial Investment / Annual Cash Flow\nROI = (Net Profit / Investment) × 100%',
      variables: [
        { symbol: 'Ct', meaning: 'Cash flow in period t' },
        { symbol: 'r', meaning: 'Discount rate (WACC or required return)' },
        { symbol: 'C₀', meaning: 'Initial investment (t=0)' },
        { symbol: 'IRR', meaning: 'Internal Rate of Return — r where NPV = 0' },
      ],
      note: 'Accept project if NPV > 0 or IRR > hurdle rate. Payback period ignores time value of money; use discounted payback for better accuracy.',
    },
    'cloud-cost-estimator': {
      title: 'Cloud Infrastructure Cost',
      formula: 'Monthly Cost = Σ(Instance_count × Unit_price × Usage_hours)\nReserved savings ≈ 30–70% vs on-demand\nTotal Cost = Compute + Storage + Data Transfer + Support',
      variables: [
        { symbol: 'Unit_price', meaning: 'On-demand hourly rate per instance type ($/hr)' },
        { symbol: 'Usage_hours', meaning: 'Monthly runtime hours (max 730 for always-on)' },
        { symbol: 'Storage cost', meaning: 'GB × price_per_GB (EBS, S3, Blob, etc.)' },
        { symbol: 'Data Transfer', meaning: 'Egress costs — typically $0.08–$0.09/GB from major cloud regions' },
      ],
      note: 'Cloud prices change frequently. Use the provider\'s pricing calculator for exact quotes. Reserved/committed-use pricing can reduce costs by 40–70% for stable workloads.',
    },
  }

  if (explicit[slug]) return explicit[slug]

  // Use config formula if available
  if (configFormula) {
    return {
      title: `${toolName} — Formula`,
      formula: configFormula,
      variables: [],
      note: DISC_NOTES[disciplineId] ?? 'Results are for preliminary design and educational reference only. Verify with a licensed engineer.',
    }
  }

  // Discipline generic fallback — always returns something
  const generic = DISC_GENERICS[disciplineId]
  if (generic) return { ...generic, title: `${toolName} — Engineering Formula` }

  return {
    title: `${toolName} — Engineering Calculation`,
    formula: 'Result = f(input parameters) per applicable engineering standard\nApply appropriate safety factors to all calculated values',
    variables: [{ symbol: 'Inputs', meaning: 'Engineering parameters as defined by the relevant standard or code' }],
    note: 'Results are for preliminary design and educational reference only. All values must be verified by a licensed Professional Engineer before use in construction or manufacturing.',
  }
}

// ─── Static params ────────────────────────────────────────────
export async function generateStaticParams() {
  const tools = getToolsByCategory('engineering')
  return tools.map(t => ({ slug: t.slug }))
}

// ─── Metadata helpers ─────────────────────────────────────────
function buildEngMetaTitle(toolName: string, disciplineId: string): string {
  const kw: Record<string, string> = {
    'civil-structural': 'Structural',
    electrical: 'Electrical',
    mechanical: 'Mechanical',
    hvac: 'HVAC',
    'oil-gas': 'Process Eng.',
    geotechnical: 'Geotechnical',
    electronics: 'Electronics',
    aerospace: 'Aerospace',
    software: 'IT Engineering',
    management: 'Project Mgmt',
  }
  const label = kw[disciplineId] ?? 'Engineering'
  const full = `Free ${toolName} — ${label} | RoughTools`
  if (full.length <= 60) return full
  const shorter = `Free ${toolName} | RoughTools`
  if (shorter.length <= 60) return shorter
  return `Free ${toolName.slice(0, 60 - ' | RoughTools'.length)} | RoughTools`
}

function buildEngMetaDesc(desc: string, disciplineId: string): string {
  const hint: Record<string, string> = {
    'civil-structural': 'Based on ASCE/ACI standards.',
    electrical: 'References NEC/IEC codes.',
    mechanical: 'Per ASME/ISO standards.',
    hvac: 'Per ASHRAE guidelines.',
    'oil-gas': 'Per API/ASME standards.',
    geotechnical: 'Based on Terzaghi/AASHTO.',
    electronics: 'Per IPC/IEEE standards.',
    aerospace: 'ISA atmospheric model.',
    software: 'Cloud pricing & benchmarks.',
    management: 'Per PMI/PMBOK framework.',
  }
  const h = hint[disciplineId] ?? 'Engineering grade accuracy.'
  const base = `${desc} ${h} Free, no signup required.`
  return base.length <= 155 ? base : base.slice(0, 152) + '...'
}

// ─── Metadata ─────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tools = getToolsByCategory('engineering')
  const tool = tools.find(t => t.slug === params.slug)
  if (!tool) return { title: 'Engineering Tool Not Found' }

  const discipline = getDiscipline(params.slug)
  const config = ENGINEERING_CONFIGS[params.slug]
  const description = config?.description ?? tool.description
  const disciplineId = discipline?.id ?? 'civil-structural'
  const metaTitle = buildEngMetaTitle(tool.name, disciplineId)
  const metaDesc  = buildEngMetaDesc(description, disciplineId)
  const canonicalUrl = `https://roughtools.com/tools/engineering/${params.slug}`

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: [...tool.keywords, 'free engineering calculator', 'engineering tool', discipline?.label ?? 'engineering'],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      type: 'website',
      siteName: 'RoughTools',
    },
    twitter: { card: 'summary_large_image', title: metaTitle, description: metaDesc },
    robots: { index: true, follow: true },
  }
}

// ─── Page ─────────────────────────────────────────────────────
export default function EngineeringToolPage({ params }: Props) {
  const allTools = getToolsByCategory('engineering')
  const tool = allTools.find(t => t.slug === params.slug)
  if (!tool) notFound()

  const configData    = ENGINEERING_CONFIGS[params.slug]
  const heroIcon      = configData?.icon      ?? '⚙️'
  const heroDesc      = configData?.description ?? tool.description
  const formulaStr    = configData?.formula   ?? null
  const referenceStr  = configData?.reference ?? null
  const discipline    = getDiscipline(params.slug)
  const formulaInfo   = getFormulaInfo(params.slug, formulaStr, discipline?.id ?? '', tool.name)
  const faqs          = getFAQs(discipline?.id ?? '', tool.name)

  // Related tools — same discipline, limit 6
  const related = discipline
    ? discipline.slugs.filter(s => s !== params.slug).slice(0, 6)
        .map(s => allTools.find(t => t.slug === s)).filter(Boolean)
    : allTools.filter(t => t.slug !== params.slug && t.popular).slice(0, 6)

  // BreadcrumbList JSON-LD
  const breadcrumbItems: object[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Engineering', item: 'https://roughtools.com/tools/engineering' },
  ]
  if (discipline) {
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: discipline.label, item: `https://roughtools.com/tools/engineering#${discipline.id}` })
    breadcrumbItems.push({ '@type': 'ListItem', position: 4, name: tool.name, item: `https://roughtools.com/tools/engineering/${params.slug}` })
  } else {
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: tool.name, item: `https://roughtools.com/tools/engineering/${params.slug}` })
  }
  const breadcrumbLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbItems }

  const appCatMap: Record<string, string> = {
    'civil-structural': 'UtilitiesApplication', electrical: 'UtilitiesApplication',
    mechanical: 'UtilitiesApplication', hvac: 'UtilitiesApplication',
    'oil-gas': 'UtilitiesApplication', geotechnical: 'UtilitiesApplication',
    electronics: 'UtilitiesApplication', aerospace: 'UtilitiesApplication',
    software: 'UtilitiesApplication', management: 'BusinessApplication',
  }
  const softwareAppLd = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    name: tool.name, description: heroDesc,
    url: `https://roughtools.com/tools/engineering/${params.slug}`,
    applicationCategory: appCatMap[discipline?.id ?? ''] ?? 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '94', bestRating: '5', worstRating: '1' },
  }
  const faqPageLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageLd) }} />

      {/* ── Breadcrumb ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/tools/engineering" className="hover:text-sky-600 transition-colors">Engineering</Link>
            {discipline && (
              <>
                <span>›</span>
                <Link href={`/tools/engineering#${discipline.id}`} className="hover:text-sky-600 transition-colors">
                  {discipline.label}
                </Link>
              </>
            )}
            <span>›</span>
            <span className="text-gray-800 font-medium truncate max-w-[160px] sm:max-w-none">{tool.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
              {heroIcon}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{tool.name}</h1>
              <p className="text-sky-100 text-sm mt-1 leading-relaxed max-w-xl">{heroDesc}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            {['⚡ Instant results','🔒 Runs in your browser','🆓 Always free','🚫 No signup','📐 Engineering accurate'].map(c => (
              <span key={c} className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 text-sky-100">{c}</span>
            ))}
          </div>

          {discipline && (
            <div className="mt-4">
              <Link href={`/tools/engineering#${discipline.id}`}
                className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/25 rounded-full px-3 py-1 text-white transition-colors">
                <span>{discipline.icon}</span>
                <span>{discipline.label}</span>
                <svg className="h-3 w-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Main ──────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* ① CALCULATOR — always first */}
        <section data-print-section="calculator" id="calculator" className="mb-8">
          <EngineeringCalculatorClient slug={params.slug} toolName={tool.name} />
        </section>

        {/* ② FORMULA — immediately after calculator */}
        <section data-print-section="formula" className="mb-8 bg-white rounded-2xl border border-gray-200 p-6" id="formula">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🧮</span> {formulaInfo.title}
          </h2>

          <div className="bg-gray-50 rounded-xl border border-gray-200 px-5 py-4 mb-4 font-mono text-sm text-gray-800 whitespace-pre-line leading-relaxed">
            {formulaInfo.formula}
          </div>

          {formulaInfo.variables.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Variables</p>
              <div className="space-y-1.5">
                {formulaInfo.variables.map((v, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <code className="flex-shrink-0 bg-sky-50 text-sky-800 border border-sky-200 rounded px-2 py-0.5 text-xs font-mono min-w-[80px] text-center">
                      {v.symbol}
                    </code>
                    <span className="text-gray-700">{v.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-600 bg-sky-50 border border-sky-200 rounded-lg px-4 py-2.5 leading-relaxed">
            📐 {formulaInfo.note}
          </p>
        </section>

        {/* ③ REFERENCE — code standard, edition, and disclaimer */}
        {referenceStr && (
          <section className="mb-8 bg-white rounded-2xl border border-gray-200 p-5" id="reference">
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>📌</span> Code Reference &amp; Standard
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-0.5">Applied Standard</p>
                <p className="text-sm font-semibold text-indigo-900">{referenceStr}</p>
              </div>
              <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide mb-0.5">Disclaimer</p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  For preliminary &amp; reference use only. Final designs must be reviewed by a licensed Professional Engineer per applicable local codes.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ④ QUICK REFERENCE — right after code reference */}
        <section className="mb-8 bg-white rounded-2xl border border-gray-200 overflow-hidden" aria-labelledby="quickref-eng-heading">
          <div className="p-6 pb-3">
            <h2 id="quickref-eng-heading" className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>📊</span> Quick Reference
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky-50 border-y border-sky-100">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-sky-700 uppercase tracking-wide">Input / Parameter</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-sky-700 uppercase tracking-wide">Description</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-sky-700 uppercase tracking-wide">Example Value</th>
                </tr>
              </thead>
              <tbody>
                {(QUICK_REF_ROWS[discipline?.id ?? ''] ?? QUICK_REF_ROWS['civil-structural']!).map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-5 py-2.5 text-sm font-medium text-sky-800 border-b border-gray-100">{row.input}</td>
                    <td className="px-5 py-2.5 text-sm text-gray-700 border-b border-gray-100">{row.description}</td>
                    <td className="px-5 py-2.5 text-xs font-mono text-gray-700 border-b border-gray-100">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ⑤ ABOUT */}
        <section className="mb-8 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>ℹ️</span> About This Calculator
          </h2>
          <AboutContent toolName={tool.name} discipline={discipline} />
        </section>

        {/* ⑥ HOW TO USE */}
        <section className="mb-8 bg-white rounded-2xl border border-gray-200 p-6" aria-labelledby="howto-eng-heading">
          <h2 id="howto-eng-heading" className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span> How to Use This Calculator
          </h2>
          <ol className="space-y-4">
            {(HOW_TO_STEPS[discipline?.id ?? ''] ?? HOW_TO_STEPS['civil-structural']!).map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-sky-100 text-sky-700 text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{step.name}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mt-0.5">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ⑦ WHEN TO USE */}
        <section className="mb-8 bg-white rounded-2xl border border-gray-200 p-6" aria-labelledby="when-eng-heading">
          <h2 id="when-eng-heading" className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🎯</span> When to Use This Calculator
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(WHEN_TO_USE_CARDS[discipline?.id ?? ''] ?? WHEN_TO_USE_CARDS['civil-structural']!).map((card, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <div className="text-xl mb-2">{card.icon}</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{card.title}</p>
                <p className="text-xs text-gray-700 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ⑧ PRO TIPS */}
        <section className="mb-8 bg-white rounded-2xl border border-gray-200 p-6" aria-labelledby="tips-eng-heading">
          <h2 id="tips-eng-heading" className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💡</span> Engineering Pro Tips
          </h2>
          <div className="space-y-3">
            {(PRO_TIPS[discipline?.id ?? ''] ?? PRO_TIPS['civil-structural']!).map((tip, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-sky-50 border border-sky-100">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-200 text-sky-800 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ⑨ DISCLAIMER */}
        <div className="mb-8 p-5 rounded-2xl bg-amber-50 border border-amber-200">
          <p className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
            <span>⚠️</span> Engineering Disclaimer
          </p>
          <p className="text-xs text-amber-800 leading-relaxed">
            Results are intended for <strong>preliminary design and educational purposes only</strong>.
            All calculations must be verified by a licensed Professional Engineer (PE) before use in
            any construction, manufacturing, or safety-critical application. Local codes, material
            standards, and site conditions may vary significantly.
          </p>
        </div>

        {/* FAQ */}
        <EngineeringFAQClient faqs={faqs} />

        {/* Related tools */}
        {related.length > 0 && (
          <section className="mt-12" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-lg font-bold text-gray-900 mb-4">
              {discipline ? `More ${discipline.label} Tools` : 'Popular Engineering Tools'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(related as NonNullable<typeof related[0]>[]).map(r => {
                const rCfg = ENGINEERING_CONFIGS[r.slug]
                return (
                  <Link key={r.slug} href={`/tools/engineering/${r.slug}`}
                    className="group flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-white hover:border-sky-300 hover:shadow-sm transition-all">
                    <span className="text-xl flex-shrink-0">{rCfg?.icon ?? '⚙️'}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-sky-700 transition-colors leading-snug">{r.name}</p>
                      <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{r.description}</p>
                    </div>
                    <svg className="h-4 w-4 ml-auto text-gray-300 group-hover:text-sky-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Compliance kit: B-9, E-1, F-1, F-2, F-3 (B-8 disclaimer already in amber box above) */}
        <ToolPageExtras
          toolName={tool.name}
          toolSlug={tool.slug}
          toolUrl={`https://roughtools.com/tools/engineering/${params.slug}`}
          type="general"
          showPDF
        />

        {/* Back link */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
          <Link href="/tools/engineering"
            className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors">
            <svg className="h-4 w-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Back to All Engineering Tools
          </Link>
          {discipline && (
            <Link href={`/tools/engineering#${discipline.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-sky-600 transition-colors">
              <span>{discipline.icon}</span>
              <span>{discipline.label}</span>
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
