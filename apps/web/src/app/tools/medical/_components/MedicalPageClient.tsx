'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

/* ── Palette ─────────────────────────────────────────────────── */
const PALETTE: Record<string, {
  card: string; cardActive: string; border: string; borderActive: string;
  icon: string; badge: string; text: string;
  toolBg: string; toolBorder: string; toolIconBg: string;
}> = {
  red:     { card:'bg-red-50',     cardActive:'bg-red-600',     border:'border-red-200',     borderActive:'border-red-600',     icon:'bg-red-100 text-red-600',     badge:'bg-red-600',     text:'text-red-700',     toolBg:'bg-red-50',     toolBorder:'border-red-200',     toolIconBg:'bg-red-100' },
  blue:    { card:'bg-blue-50',    cardActive:'bg-blue-600',    border:'border-blue-200',    borderActive:'border-blue-600',    icon:'bg-blue-100 text-blue-600',    badge:'bg-blue-600',    text:'text-blue-700',    toolBg:'bg-blue-50',    toolBorder:'border-blue-200',    toolIconBg:'bg-blue-100' },
  orange:  { card:'bg-orange-50',  cardActive:'bg-orange-500',  border:'border-orange-200',  borderActive:'border-orange-500',  icon:'bg-orange-100 text-orange-600',  badge:'bg-orange-500',  text:'text-orange-700',  toolBg:'bg-orange-50',  toolBorder:'border-orange-200',  toolIconBg:'bg-orange-100' },
  purple:  { card:'bg-purple-50',  cardActive:'bg-purple-600',  border:'border-purple-200',  borderActive:'border-purple-600',  icon:'bg-purple-100 text-purple-600',  badge:'bg-purple-600',  text:'text-purple-700',  toolBg:'bg-purple-50',  toolBorder:'border-purple-200',  toolIconBg:'bg-purple-100' },
  amber:   { card:'bg-amber-50',   cardActive:'bg-amber-500',   border:'border-amber-200',   borderActive:'border-amber-500',   icon:'bg-amber-100 text-amber-600',   badge:'bg-amber-500',   text:'text-amber-700',   toolBg:'bg-amber-50',   toolBorder:'border-amber-200',   toolIconBg:'bg-amber-100' },
  teal:    { card:'bg-teal-50',    cardActive:'bg-teal-600',    border:'border-teal-200',    borderActive:'border-teal-600',    icon:'bg-teal-100 text-teal-600',    badge:'bg-teal-600',    text:'text-teal-700',    toolBg:'bg-teal-50',    toolBorder:'border-teal-200',    toolIconBg:'bg-teal-100' },
  pink:    { card:'bg-pink-50',    cardActive:'bg-pink-500',    border:'border-pink-200',    borderActive:'border-pink-500',    icon:'bg-pink-100 text-pink-600',    badge:'bg-pink-500',    text:'text-pink-700',    toolBg:'bg-pink-50',    toolBorder:'border-pink-200',    toolIconBg:'bg-pink-100' },
  sky:     { card:'bg-sky-50',     cardActive:'bg-sky-500',     border:'border-sky-200',     borderActive:'border-sky-500',     icon:'bg-sky-100 text-sky-600',     badge:'bg-sky-500',     text:'text-sky-700',     toolBg:'bg-sky-50',     toolBorder:'border-sky-200',     toolIconBg:'bg-sky-100' },
  green:   { card:'bg-green-50',   cardActive:'bg-green-600',   border:'border-green-200',   borderActive:'border-green-600',   icon:'bg-green-100 text-green-600',   badge:'bg-green-600',   text:'text-green-700',   toolBg:'bg-green-50',   toolBorder:'border-green-200',   toolIconBg:'bg-green-100' },
  indigo:  { card:'bg-indigo-50',  cardActive:'bg-indigo-600',  border:'border-indigo-200',  borderActive:'border-indigo-600',  icon:'bg-indigo-100 text-indigo-600',  badge:'bg-indigo-600',  text:'text-indigo-700',  toolBg:'bg-indigo-50',  toolBorder:'border-indigo-200',  toolIconBg:'bg-indigo-100' },
  emerald: { card:'bg-emerald-50', cardActive:'bg-emerald-600', border:'border-emerald-200', borderActive:'border-emerald-600', icon:'bg-emerald-100 text-emerald-600', badge:'bg-emerald-600', text:'text-emerald-700', toolBg:'bg-emerald-50', toolBorder:'border-emerald-200', toolIconBg:'bg-emerald-100' },
  rose:    { card:'bg-rose-50',    cardActive:'bg-rose-500',    border:'border-rose-200',    borderActive:'border-rose-500',    icon:'bg-rose-100 text-rose-600',    badge:'bg-rose-500',    text:'text-rose-700',    toolBg:'bg-rose-50',    toolBorder:'border-rose-200',    toolIconBg:'bg-rose-100' },
}

/* ── Specialty groups ─────────────────────────────────────────── */
const BASE = '/tools/medical'
const SPECIALTIES = [
  {
    id: 'cardiology', label: 'Cardiology', icon: '❤️', color: 'red',
    description: 'Risk scores, arrhythmia, lipids, anticoagulation',
    tools: [
      { name: 'CHA₂DS₂-VASc Score',         href:`${BASE}/cha2ds2-vasc-score`,              icon:'❤️', description:'Stroke risk in non-valvular AF' },
      { name: 'HEART Score',                 href:`${BASE}/heart-score-calculator`,           icon:'🫀', description:'Chest pain risk stratification' },
      { name: 'Framingham Risk Score',       href:`${BASE}/framingham-risk-score`,            icon:'📊', description:'10-year cardiovascular disease risk' },
      { name: 'Mean Arterial Pressure',      href:`${BASE}/mean-arterial-pressure-calculator`,icon:'💓', description:'MAP from SBP and DBP' },
      { name: 'Cardiac Output (Fick)',       href:`${BASE}/cardiac-output-fick-calculator`,   icon:'🫀', description:'CO from O₂ consumption and AV difference' },
      { name: 'TIMI Risk Score',             href:`${BASE}/timi-risk-score`,                  icon:'🚨', description:'STEMI & NSTEMI risk stratification' },
      { name: 'QTc Interval Calculator',     href:`${BASE}/qtc-interval-calculator`,          icon:'📈', description:'Bazett & Fridericia correction' },
      { name: 'LDL Cholesterol Calculator',  href:`${BASE}/ldl-cholesterol-calculator`,       icon:'🧪', description:'Friedewald equation' },
      { name: 'Warfarin Dose Estimator',     href:`${BASE}/warfarin-dose-estimator`,          icon:'💊', description:'CYP2C9/VKORC1 guided initial dose' },
      { name: 'HAS-BLED Bleeding Score',     href:`${BASE}/has-bled-bleeding-score`,          icon:'🩸', description:'Bleeding risk in anticoagulated AF' },
      { name: 'Blood Pressure Classification',href:`${BASE}/blood-pressure-classification`,   icon:'🩺', description:'ACC/AHA 2017 BP categories' },
      { name: 'GRACE ACS Score',             href:`${BASE}/grace-acs-score`,                  icon:'⚠️', description:'In-hospital & 6-month mortality in ACS' },
    ],
  },
  {
    id: 'nephrology', label: 'Nephrology', icon: '🫘', color: 'blue',
    description: 'eGFR, CKD staging, drug dosing, dialysis',
    tools: [
      { name: 'Creatinine Clearance (Cockcroft-Gault)', href:`${BASE}/creatinine-clearance-cockcroft-gault`, icon:'🫘', description:'CrCl for drug dose adjustment' },
      { name: 'eGFR (CKD-EPI 2021)',        href:`${BASE}/egfr-ckd-epi-calculator`,          icon:'🔬', description:'Race-free eGFR & CKD staging' },
      { name: 'MDRD eGFR Calculator',       href:`${BASE}/mdrd-egfr-calculator`,             icon:'📊', description:'4-variable MDRD formula' },
      { name: 'Urine Anion Gap',            href:`${BASE}/urine-anion-gap-calculator`,       icon:'🧪', description:'Differentiate metabolic acidosis cause' },
      { name: 'FENa / FEUrea Calculator',   href:`${BASE}/fena-feurea-calculator`,           icon:'🫘', description:'AKI pre-renal vs intrinsic' },
      { name: 'Dialysis Adequacy (Kt/V)',   href:`${BASE}/dialysis-adequacy-ktv`,            icon:'💧', description:'Single-pool Kt/V for HD' },
      { name: 'Calcium Correction',         href:`${BASE}/calcium-correction-calculator`,    icon:'🦴', description:'Correct calcium for albumin' },
      { name: 'Renal Drug Dose Adjuster',   href:`${BASE}/renal-drug-dose-adjuster`,         icon:'💊', description:'Dose % reduction by CrCl' },
      { name: 'Water Deficit (Hypernatremia)',href:`${BASE}/water-deficit-hypernatremia`,    icon:'💧', description:'Free water deficit & correction rate' },
      { name: 'Kidney Failure Risk Equation',href:`${BASE}/kidney-failure-risk-equation`,   icon:'⚠️', description:'2-year & 5-year ESKD risk' },
    ],
  },
  {
    id: 'emergency-icu', label: 'Emergency & ICU', icon: '🚨', color: 'orange',
    description: 'Severity scores, fluid management, sepsis',
    tools: [
      { name: 'CURB-65 Pneumonia Score',     href:`${BASE}/curb-65-pneumonia-score`,         icon:'🫁', description:'30-day mortality & admission decision' },
      { name: 'Glasgow Coma Scale',          href:`${BASE}/glasgow-coma-scale`,              icon:'🧠', description:'Consciousness level after brain injury' },
      { name: 'SOFA Sepsis Score',           href:`${BASE}/sofa-sepsis-score`,               icon:'🏥', description:'Sequential organ failure assessment' },
      { name: 'ABG Interpreter',             href:`${BASE}/abg-interpreter`,                 icon:'🫁', description:'Acid-base disorder classification' },
      { name: 'APACHE II Score',             href:`${BASE}/apache-ii-score`,                 icon:'📊', description:'ICU mortality risk estimation' },
      { name: 'Anion Gap Calculator',        href:`${BASE}/anion-gap-calculator`,            icon:'🧪', description:'Metabolic acidosis workup' },
      { name: 'Wells Score (DVT/PE)',        href:`${BASE}/wells-score-dvt-pe`,              icon:'🫀', description:'Pre-test probability of DVT or PE' },
      { name: 'IV Fluid Rate Calculator',   href:`${BASE}/iv-fluid-rate-calculator`,        icon:'💧', description:'Holliday-Segar maintenance fluids' },
      { name: 'qSOFA Sepsis Screen',         href:`${BASE}/qsofa-sepsis-score`,              icon:'⚡', description:'Quick SOFA at-risk detection' },
      { name: 'Burn Surface Area (Rule of 9s)',href:`${BASE}/burn-surface-area-rule-of-9s`,  icon:'🔥', description:'TBSA % for fluid resuscitation' },
      { name: 'PECARN Head Injury Tool',     href:`${BASE}/pecarn-head-injury-tool`,         icon:'👶', description:'Pediatric CT decision rule' },
    ],
  },
  {
    id: 'neurology-psychiatry', label: 'Neurology & Psychiatry', icon: '🧠', color: 'purple',
    description: 'Stroke scales, mental health screening, cognitive tools',
    tools: [
      { name: 'PHQ-9 Depression Screen',    href:`${BASE}/phq9-depression-screen`,          icon:'🧠', description:'Patient Health Questionnaire severity' },
      { name: 'GAD-7 Anxiety Score',        href:`${BASE}/gad7-anxiety-score`,              icon:'😰', description:'Generalized Anxiety Disorder scale' },
      { name: 'NIHSS Stroke Scale',         href:`${BASE}/nihss-stroke-scale`,              icon:'🧠', description:'NIH Stroke Scale severity score' },
      { name: 'Epworth Sleepiness Scale',   href:`${BASE}/epworth-sleepiness-scale`,        icon:'😴', description:'Daytime sleepiness assessment' },
      { name: 'MMSE Cognitive Screen',      href:`${BASE}/mmse-cognitive-screen`,           icon:'🧩', description:'Mini-Mental State Examination score' },
      { name: 'Lithium Dose Calculator',    href:`${BASE}/lithium-dose-calculator`,         icon:'💊', description:'Target level-based dosing' },
      { name: 'AUDIT-C Alcohol Screening',  href:`${BASE}/audit-c-alcohol-screening`,       icon:'🍺', description:'Alcohol use disorder screening' },
      { name: 'CIWA-Ar Withdrawal Scale',   href:`${BASE}/ciwa-ar-withdrawal-scale`,        icon:'⚠️', description:'Alcohol withdrawal severity' },
      { name: 'PTSD PCL-5 Checklist',       href:`${BASE}/ptsd-pcl5-checklist`,             icon:'🎖️', description:'PTSD symptom checklist (DSM-5)' },
      { name: 'Visual Acuity Converter',    href:`${BASE}/visual-acuity-converter`,         icon:'👁️', description:'Snellen to LogMAR & decimal' },
    ],
  },
  {
    id: 'endocrinology', label: 'Endocrinology', icon: '🩸', color: 'amber',
    description: 'Diabetes, obesity, thyroid, steroid conversion',
    tools: [
      { name: 'HbA1c ↔ Glucose Converter',  href:`${BASE}/hba1c-glucose-converter`,         icon:'🩸', description:'eAG from HbA1c (Nathan equation)' },
      { name: 'BMI Calculator',             href:`${BASE}/bmi-calculator`,                  icon:'⚖️', description:'WHO BMI with classification' },
      { name: 'Insulin Dose Calculator',    href:`${BASE}/insulin-dose-calculator`,         icon:'💉', description:'Carb ratio & correction factor' },
      { name: 'BMR & TDEE Calculator',      href:`${BASE}/bmr-tdee-calculator`,             icon:'🔥', description:'Mifflin-St Jeor caloric needs' },
      { name: 'FINDRISC Diabetes Risk',     href:`${BASE}/findrisc-diabetes-risk`,          icon:'📊', description:'10-year T2DM risk score' },
      { name: 'Steroid Dose Converter',     href:`${BASE}/steroid-dose-converter`,          icon:'💊', description:'Equivalent doses between corticosteroids' },
      { name: 'Thyroid Function Interpreter',href:`${BASE}/thyroid-function-interpreter`,   icon:'🦋', description:'TSH/T4/T3 pattern interpretation' },
      { name: 'Ideal Body Weight',          href:`${BASE}/ideal-body-weight-calculator`,    icon:'⚖️', description:'Devine formula for drug dosing' },
      { name: 'Body Fat % Calculator',      href:`${BASE}/body-fat-percentage-calculator`,  icon:'📏', description:'US Navy & BMI methods' },
      { name: 'Carb & Glycemic Calculator', href:`${BASE}/carb-glycemic-calculator`,        icon:'🍞', description:'Glycemic load & glycemic index' },
    ],
  },
  {
    id: 'pharmacology', label: 'Pharmacology', icon: '💊', color: 'teal',
    description: 'Weight-based dosing, TDM, antibiotics, opioids',
    tools: [
      { name: 'Drug Interaction Checker',    href:`${BASE}/drug-interaction-checker`,        icon:'⚠️', description:'Major drug-drug interaction lookup' },
      { name: 'Weight-Based Drug Dose',      href:`${BASE}/weight-based-drug-dose-calculator`,icon:'💊', description:'mg/kg single & daily dose' },
      { name: 'Drug Half-Life Calculator',  href:`${BASE}/drug-half-life-calculator`,       icon:'⏱️', description:'Time to reach steady state' },
      { name: 'Opioid Equianalgesic Converter',href:`${BASE}/opioid-equianalgesic-converter`,icon:'💊', description:'Morphine equivalent dose (OME)' },
      { name: 'Vancomycin Dosing',          href:`${BASE}/vancomycin-dosing-calculator`,    icon:'🔬', description:'AUC-guided dosing & TDM' },
      { name: 'Aminoglycoside Dose',        href:`${BASE}/aminoglycoside-dose-calculator`,  icon:'🧪', description:'Extended-interval & traditional' },
      { name: 'IV Drip Rate (mcg/kg/min)',  href:`${BASE}/iv-drip-rate-mcg-kg-min`,         icon:'💉', description:'Vasopressor & inotrope drip rates' },
      { name: 'Pediatric Emergency Drugs',  href:`${BASE}/pediatric-emergency-drug-calculator`,icon:'👶', description:'PALS resuscitation doses by weight' },
      { name: 'Pill Identifier Tool',       href:`${BASE}/pill-identifier-tool`,            icon:'💊', description:'Identify medications by imprint' },
      { name: 'Medication Cost Estimator',  href:`${BASE}/medication-cost-estimator`,       icon:'💰', description:'Monthly cost by drug & dose' },
    ],
  },
  {
    id: 'obstetrics', label: 'Obstetrics & Gynaecology', icon: '🤰', color: 'pink',
    description: 'Pregnancy dating, fetal growth, fertility, labour',
    tools: [
      { name: 'Due Date (EDD) Calculator',  href:`${BASE}/due-date-edd-calculator`,         icon:'📅', description:"Naegele's Rule from LMP" },
      { name: 'Gestational Age Calculator', href:`${BASE}/gestational-age-calculator`,      icon:'🗓️', description:'GA from LMP or EDD' },
      { name: 'Fetal Weight Estimator',     href:`${BASE}/fetal-weight-estimator`,          icon:'👶', description:'Hadlock formula from biometry' },
      { name: 'Pregnancy Weight Gain',      href:`${BASE}/pregnancy-weight-gain-calculator`,icon:'⚖️', description:'IOM guidelines by BMI category' },
      { name: 'IVF Success Rate',           href:`${BASE}/ivf-success-rate-calculator`,     icon:'🔬', description:'CDC SART model live birth probability' },
      { name: 'Ovulation & Fertile Window', href:`${BASE}/ovulation-fertile-window-calculator`,icon:'🗓️', description:'Peak fertility from cycle length' },
      { name: 'Bishop Score',               href:`${BASE}/bishop-score-calculator`,         icon:'🩺', description:'Cervical ripeness for labour induction' },
      { name: 'Preeclampsia Risk',          href:`${BASE}/preeclampsia-risk-calculator`,    icon:'⚠️', description:'ACOG first-trimester risk model' },
      { name: 'PPH Oxytocin Calculator',    href:`${BASE}/postpartum-hemorrhage-calculator`,icon:'🩸', description:'Oxytocin dose for PPH management' },
      { name: 'APGAR Score',                href:`${BASE}/apgar-score-calculator`,          icon:'👶', description:'Newborn 1 & 5 minute assessment' },
    ],
  },
  {
    id: 'pulmonology', label: 'Pulmonology', icon: '🫁', color: 'sky',
    description: 'Spirometry, pneumonia severity, ABG, ARDS',
    tools: [
      { name: 'Spirometry FEV1/FVC Interpreter',href:`${BASE}/spirometry-fev1-fvc-interpreter`,icon:'🫁', description:'Obstructive vs restrictive pattern' },
      { name: 'PSI/PORT Pneumonia Score',   href:`${BASE}/psi-port-pneumonia-score`,        icon:'📊', description:'Pneumonia Severity Index class' },
      { name: 'A-a Gradient',               href:`${BASE}/alveolar-arterial-gradient`,      icon:'🫁', description:'Alveolar-arterial oxygen difference' },
      { name: 'PaO2/FiO2 Ratio (ARDS)',     href:`${BASE}/pao2-fio2-ratio-ards`,            icon:'⚠️', description:'Berlin definition ARDS severity' },
      { name: 'Peak Flow Calculator',       href:`${BASE}/peak-flow-calculator`,            icon:'💨', description:'Expected PEFR from age & height' },
      { name: 'Pack-Year Calculator',       href:`${BASE}/pack-year-calculator`,            icon:'🚬', description:'Smoking exposure for lung cancer screening' },
    ],
  },
  {
    id: 'gastroenterology', label: 'Gastroenterology', icon: '🫀', color: 'green',
    description: 'Liver disease severity, pancreatitis, ascites',
    tools: [
      { name: 'MELD Score',                 href:`${BASE}/meld-score-calculator`,           icon:'🫀', description:'End-stage liver disease severity' },
      { name: 'Child-Pugh Score',           href:`${BASE}/child-pugh-score-calculator`,     icon:'📊', description:'Chronic liver disease classification' },
      { name: 'SAAG Calculator',            href:`${BASE}/saag-calculator`,                 icon:'💧', description:'Serum-ascites albumin gradient' },
      { name: "Ranson's Criteria",          href:`${BASE}/ransons-criteria-pancreatitis`,   icon:'⚠️', description:'Acute pancreatitis severity' },
      { name: 'H. pylori Eradication Tracker',href:`${BASE}/h-pylori-eradication-tracker`, icon:'🦠', description:'Treatment regimen dosing guide' },
      { name: 'Bowel Prep Dosing',          href:`${BASE}/bowel-prep-dosing-calculator`,    icon:'💊', description:'Colonoscopy prep by weight & product' },
    ],
  },
  {
    id: 'oncology-hematology', label: 'Oncology & Haematology', icon: '🔬', color: 'indigo',
    description: 'Chemo dosing, ANC, staging, transfusion',
    tools: [
      { name: 'Chemotherapy Dose (BSA)',    href:`${BASE}/chemotherapy-dose-bsa-calculator`,icon:'💊', description:'Mosteller BSA for chemo dosing' },
      { name: 'ANC Calculator',            href:`${BASE}/anc-absolute-neutrophil-count`,   icon:'🔬', description:'Neutropenia grading & nadir' },
      { name: 'PSA Velocity / Doubling Time',href:`${BASE}/psa-velocity-doubling-time`,    icon:'📈', description:'Prostate cancer surveillance tool' },
      { name: 'TNM Staging Interpreter',   href:`${BASE}/tnm-staging-interpreter`,         icon:'📋', description:'Overall stage from T, N, M inputs' },
      { name: 'INR / PT Ratio Converter',  href:`${BASE}/inr-pt-ratio-converter`,          icon:'🩸', description:'PT to INR & anticoagulation interpretation' },
      { name: 'IPSS-MDS Score',            href:`${BASE}/ipss-mds-score`,                  icon:'🔬', description:'Myelodysplastic syndrome risk' },
      { name: 'Blood Transfusion Volume',  href:`${BASE}/blood-transfusion-volume-calculator`,icon:'🩸', description:'pRBC volume for target Hb' },
      { name: 'Cancer Survival Probability',href:`${BASE}/cancer-survival-probability`,    icon:'📊', description:'Stage-based 5-year survival estimate' },
    ],
  },
  {
    id: 'pediatrics', label: 'Paediatrics', icon: '👶', color: 'emerald',
    description: 'Growth charts, vaccines, neonatal tools',
    tools: [
      { name: 'Child Growth Percentile',    href:`${BASE}/child-growth-percentile`,         icon:'📈', description:'WHO & CDC growth chart percentile' },
      { name: 'Pediatric BMI-for-Age',      href:`${BASE}/pediatric-bmi-for-age`,           icon:'⚖️', description:'BMI percentile for children 2–20' },
      { name: 'Fever Dose Calculator',      href:`${BASE}/fever-dose-calculator`,           icon:'🌡️', description:'Paracetamol & ibuprofen by weight' },
      { name: 'Holliday-Segar Fluid Calculator',href:`${BASE}/holliday-segar-maintenance-fluid`,icon:'💧', description:'Pediatric IV maintenance fluids' },
      { name: 'Vaccine Schedule Checker',   href:`${BASE}/vaccine-schedule-checker`,        icon:'💉', description:'CDC immunization schedule by age' },
      { name: 'Corrected Gestational Age',  href:`${BASE}/corrected-gestational-age-calculator`,icon:'👶', description:'Adjusted age for premature infants' },
      { name: 'Pediatric ETT Size & Depth', href:`${BASE}/pediatric-ett-size-depth`,        icon:'🏥', description:'Age-based tube size & insertion depth' },
      { name: 'Neonatal Jaundice (Bhutani)',href:`${BASE}/neonatal-jaundice-bhutani`,       icon:'🌟', description:'Phototherapy threshold from bilirubin & hours' },
    ],
  },
  {
    id: 'consumer-health', label: 'Consumer Health', icon: '💪', color: 'rose',
    description: 'Fitness, nutrition, insurance, surgery costs',
    tools: [
      { name: 'BMI Health Calculator',      href:`${BASE}/bmi-health-calculator`,           icon:'⚖️', description:'BMI with health risk summary' },
      { name: 'Calorie Deficit Calculator', href:`${BASE}/calorie-deficit-calculator`,      icon:'🍎', description:'Weight loss target timeline' },
      { name: 'Heart Rate Zone Calculator', href:`${BASE}/heart-rate-zone-calculator`,      icon:'❤️', description:'Training zones by age & max HR' },
      { name: 'Daily Water Intake',         href:`${BASE}/daily-water-intake-calculator`,   icon:'💧', description:'Hydration needs by weight & activity' },
      { name: 'Sleep Cycle Calculator',     href:`${BASE}/sleep-cycle-calculator`,          icon:'😴', description:'Optimal wake time from bedtime' },
      { name: 'Health Insurance Premium Estimator',href:`${BASE}/health-insurance-premium-estimator`,icon:'💰', description:'ACA marketplace cost estimate' },
      { name: 'Blood Pressure Tracker',     href:`${BASE}/blood-pressure-tracker-chart`,    icon:'🩸', description:'Log & classify BP readings' },
      { name: 'Cholesterol Ratio Calculator',href:`${BASE}/cholesterol-ratio-calculator`,   icon:'🧪', description:'TC/HDL & LDL/HDL cardiovascular risk' },
      { name: 'Surgery Cost Estimator',     href:`${BASE}/surgery-cost-estimator`,          icon:'🏥', description:'Procedure + hospital + anesthesia cost' },
      { name: 'Drug Rehab Cost Calculator', href:`${BASE}/drug-rehab-cost-calculator`,      icon:'💊', description:'30/60/90 day program cost estimate' },
      { name: 'Therapy Session Cost Estimator',href:`${BASE}/therapy-session-cost-estimator`,icon:'🧠', description:'Psychotherapy cost by type & location' },
      { name: 'Medication Cost Comparator', href:`${BASE}/medication-cost-comparator`,      icon:'💰', description:'Brand vs generic prescription prices' },
    ],
  },
]

const TOTAL = SPECIALTIES.reduce((s, sp) => s + sp.tools.length, 0)

const POPULAR = [
  { name: 'BMI Calculator',         href:`${BASE}/bmi-calculator` },
  { name: 'eGFR Calculator',        href:`${BASE}/egfr-ckd-epi-calculator` },
  { name: 'Glasgow Coma Scale',     href:`${BASE}/glasgow-coma-scale` },
  { name: 'PHQ-9 Depression',       href:`${BASE}/phq9-depression-screen` },
  { name: 'MELD Score',             href:`${BASE}/meld-score-calculator` },
  { name: 'Framingham Risk',        href:`${BASE}/framingham-risk-score` },
  { name: 'CURB-65',                href:`${BASE}/curb-65-pneumonia-score` },
  { name: 'Drug Dose Calculator',   href:`${BASE}/weight-based-drug-dose-calculator` },
]

const TRUST = [
  { icon:'⚡', text:'Instant Results' },
  { icon:'🔒', text:'Privacy First — runs locally' },
  { icon:'🆓', text:'Always Free' },
  { icon:'🩺', text:'Clinically Referenced' },
  { icon:'📱', text:'Mobile Friendly' },
]

export default function MedicalPageClient() {
  const [active, setActive] = useState<string | null>(null)
  const toolsRef = useRef<HTMLElement>(null)

  const selectCategory = useCallback((id: string | null) => {
    setActive(id)
    setTimeout(() => {
      toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 30)
  }, [])

  const visibleSpecialties = active
    ? SPECIALTIES.filter(s => s.id === active)
    : SPECIALTIES

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-emerald-600 via-teal-700 to-cyan-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <span>🩺</span>
            <span>{TOTAL} Free Medical & Clinical Calculators — All Specialties</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Medical Calculators.<br className="hidden sm:block" /> Clinical Grade. Free.
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto mb-8">
            Cardiology risk scores, eGFR tools, ICU severity scores, pharmacology dose calculators,
            obstetrics tools and consumer health — all browser-based, zero signup, for educational &amp; clinical reference.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map(p => (
              <Link
                key={p.href}
                href={p.href}
                className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Cards ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-7">
          <p className="text-sm font-semibold text-gray-500 dark:text-[#777] uppercase tracking-widest mb-1">Browse by Specialty</p>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Choose your medical specialty</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {/* All Tools card */}
          <button
            onClick={() => selectCategory(null)}
            className={`
              relative group flex flex-col items-center text-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-lg cursor-pointer
              ${active === null
                ? 'bg-gray-900 border-gray-900 text-white shadow-lg -translate-y-0.5'
                : 'bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#ddd] hover:border-gray-400 dark:hover:border-white/25'
              }
            `}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl ${active === null ? 'bg-white/15' : 'bg-gray-100 dark:bg-white/8'}`}>
              🩺
            </div>
            <div>
              <div className="font-bold text-[13px] leading-tight">All Medical Tools</div>
              <div className={`text-[11px] mt-0.5 font-semibold ${active === null ? 'text-white/70' : 'text-gray-400 dark:text-[#777]'}`}>
                {TOTAL} tools
              </div>
            </div>
          </button>

          {SPECIALTIES.map(sp => {
            const pal = PALETTE[sp.color] ?? PALETTE.emerald
            const isActive = active === sp.id
            return (
              <button
                key={sp.id}
                onClick={() => selectCategory(isActive ? null : sp.id)}
                className={`
                  relative group flex flex-col items-center text-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-lg cursor-pointer
                  ${isActive
                    ? `${pal.cardActive} ${pal.borderActive} text-white shadow-lg -translate-y-0.5`
                    : `bg-white ${pal.border} text-gray-700 hover:${pal.card}`
                  }
                `}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${isActive ? 'bg-white/20' : pal.icon}`}>
                  {sp.icon}
                </div>
                <div>
                  <div className="font-bold text-[12px] leading-tight">{sp.label}</div>
                  <div className={`text-[11px] mt-0.5 font-semibold ${isActive ? 'text-white/70' : 'text-gray-400 dark:text-[#777]'}`}>
                    {sp.tools.length} tools
                  </div>
                </div>
                {isActive && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-white/25 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 12 12" fill="none" width="9" height="9">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {active && (
          <div className="flex items-center justify-between mt-5 px-1">
            <p className="text-sm text-gray-600 dark:text-[#aaa]">
              Showing <span className="font-semibold text-gray-900 dark:text-white">
                {SPECIALTIES.find(s => s.id === active)?.label}
              </span> tools
            </p>
            <button
              onClick={() => selectCategory(null)}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
                <path d="M12 4 4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Clear filter
            </button>
          </div>
        )}
      </section>

      {/* ── Trust bar ─────────────────────────────────────────── */}
      <div className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-[#888]">
          {TRUST.map(b => (
            <span key={b.text} className="flex items-center gap-1.5 font-medium">
              <span>{b.icon}</span>{b.text}
            </span>
          ))}
        </div>
      </div>

      {/* ── Tool Sections ─────────────────────────────────────── */}
      <main ref={toolsRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14 scroll-mt-20">

        {visibleSpecialties.map(sp => {
          const pal = PALETTE[sp.color] ?? PALETTE.emerald
          return (
            <section key={sp.id} id={sp.id} aria-labelledby={`heading-${sp.id}`} className="scroll-mt-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl flex-shrink-0 ${pal.icon}`}>
                  {sp.icon}
                </div>
                <div>
                  <h2 id={`heading-${sp.id}`} className="text-xl font-bold text-gray-900 dark:text-white">{sp.label}</h2>
                  <p className="text-sm text-gray-500">{sp.description}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full text-white ${pal.badge}`}>
                  {sp.tools.length} tools
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sp.tools.map(tool => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200
                      ${pal.toolBg} ${pal.toolBorder} dark:bg-[#1e1e1e] dark:border-white/10 dark:bg-[#1e1e1e] dark:border-white/10
                      hover:shadow-md hover:-translate-y-0.5
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-lg flex-shrink-0 ${pal.toolIconBg}`}>
                      {tool.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-semibold text-gray-900 dark:text-white group-hover:${pal.text} transition-colors leading-snug text-sm`}>
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-[#999] mt-0.5 leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    <svg className="w-4 h-4 flex-shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors mt-1"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* ── SEO / About ──────────────────────────────────────── */}
        <section className="bg-gray-50 rounded-3xl border border-gray-100 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Why Clinicians &amp; Patients Trust Our Free Medical Calculators
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <p className="mb-3">
                Our medical calculator suite is referenced to validated clinical guidelines including
                ACC/AHA, ACOG, IDSA, ADA, WHO, ASH, and AASLD. Each calculator shows the formula and
                primary reference so you can verify results. All tools run entirely in your browser — no data is transmitted.
              </p>
              <p>
                From bedside ICU scoring to consumer wellness tracking, all {TOTAL} tools are free with no
                signup required. Results include clinical interpretation labels so you can act on the
                information immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Specialties covered:</h3>
              <ul className="space-y-1.5">
                {[
                  'Cardiology: Framingham risk, CHA₂DS₂-VASc, TIMI, QTc, HAS-BLED',
                  'Nephrology: eGFR (CKD-EPI 2021), Cockcroft-Gault, MDRD, FENa, Kt/V',
                  'Emergency/ICU: GCS, SOFA, CURB-65, anion gap, Wells DVT/PE',
                  'Pharmacology: weight-based dosing, opioid equianalgesic, vancomycin',
                  'Obstetrics: due date, gestational age, Bishop score, IVF, APGAR',
                  'Consumer Health: BMI, calorie deficit, sleep cycles, surgery costs',
                ].map(pt => (
                  <li key={pt} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-xs">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Explore other free tools:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { href:'/tools/calculators', label:'🧮 General Calculators' },
                { href:'/tools/pdf',         label:'📄 PDF Tools' },
                { href:'/tools/engineering', label:'⚙️ Engineering Tools' },
                { href:'/tools/document-tools',label:'📝 Document Tools' },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="text-sm bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-700 hover:border-emerald-300 hover:text-emerald-700 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
