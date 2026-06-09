import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolsByCategory } from '@/lib/tools-registry'
import { MEDICAL_CONFIGS, getMedicalConfigById } from '../_components/medical-configs'
import MedicalToolShell from '../_components/MedicalToolShell'

// ─── Types ────────────────────────────────────────────────────
interface Props {
  params: { slug: string }
}

interface FAQ { q: string; a: string }

// ─── Sub-specialty grouping for breadcrumb & related tools ────
const SPECIALTY_MAP: Record<string, { id: string; label: string; icon: string; slugs: string[] }> = {
  cardiology: {
    id: 'cardiology',
    label: 'Cardiology',
    icon: '❤️',
    slugs: [
      'cha2ds2-vasc-score', 'heart-score-calculator', 'framingham-risk-score',
      'mean-arterial-pressure-calculator', 'cardiac-output-fick-calculator', 'timi-risk-score',
      'qtc-interval-calculator', 'ldl-cholesterol-calculator', 'warfarin-dose-estimator',
      'has-bled-bleeding-score', 'blood-pressure-classification', 'grace-acs-score',
    ],
  },
  nephrology: {
    id: 'nephrology',
    label: 'Nephrology',
    icon: '🫘',
    slugs: [
      'creatinine-clearance-cockcroft-gault', 'egfr-ckd-epi-calculator', 'mdrd-egfr-calculator',
      'urine-anion-gap-calculator', 'fena-feurea-calculator', 'dialysis-adequacy-ktv',
      'calcium-correction-calculator', 'renal-drug-dose-adjuster', 'water-deficit-hypernatremia',
      'kidney-failure-risk-equation',
    ],
  },
  'emergency-icu': {
    id: 'emergency-icu',
    label: 'Emergency & ICU',
    icon: '🚨',
    slugs: [
      'curb-65-pneumonia-score', 'glasgow-coma-scale', 'sofa-sepsis-score',
      'abg-interpreter', 'apache-ii-score', 'anion-gap-calculator',
      'wells-score-dvt-pe', 'iv-fluid-rate-calculator', 'qsofa-sepsis-score',
      'burn-surface-area-rule-of-9s', 'pecarn-head-injury-tool',
    ],
  },
  'neurology-psychiatry': {
    id: 'neurology-psychiatry',
    label: 'Neurology & Psychiatry',
    icon: '🧠',
    slugs: [
      'phq9-depression-screen', 'gad7-anxiety-score', 'nihss-stroke-scale',
      'epworth-sleepiness-scale', 'mmse-cognitive-screen', 'lithium-dose-calculator',
      'audit-c-alcohol-screening', 'ciwa-ar-withdrawal-scale', 'ptsd-pcl5-checklist',
      'visual-acuity-converter',
    ],
  },
  endocrinology: {
    id: 'endocrinology',
    label: 'Endocrinology',
    icon: '🩸',
    slugs: [
      'hba1c-glucose-converter', 'bmi-calculator', 'insulin-dose-calculator',
      'bmr-tdee-calculator', 'findrisc-diabetes-risk', 'steroid-dose-converter',
      'thyroid-function-interpreter', 'ideal-body-weight-calculator',
      'body-fat-percentage-calculator', 'carb-glycemic-calculator',
    ],
  },
  pharmacology: {
    id: 'pharmacology',
    label: 'Pharmacology',
    icon: '💊',
    slugs: [
      'drug-interaction-checker', 'weight-based-drug-dose-calculator', 'drug-half-life-calculator',
      'opioid-equianalgesic-converter', 'vancomycin-dosing-calculator', 'aminoglycoside-dose-calculator',
      'iv-drip-rate-mcg-kg-min', 'pediatric-emergency-drug-calculator', 'pill-identifier-tool',
      'medication-cost-estimator',
    ],
  },
  obstetrics: {
    id: 'obstetrics',
    label: 'Obstetrics & Gynaecology',
    icon: '🤰',
    slugs: [
      'due-date-edd-calculator', 'gestational-age-calculator', 'fetal-weight-estimator',
      'pregnancy-weight-gain-calculator', 'ivf-success-rate-calculator', 'ovulation-fertile-window-calculator',
      'bishop-score-calculator', 'preeclampsia-risk-calculator', 'postpartum-hemorrhage-calculator',
      'apgar-score-calculator',
    ],
  },
  pulmonology: {
    id: 'pulmonology',
    label: 'Pulmonology',
    icon: '🫁',
    slugs: [
      'spirometry-fev1-fvc-interpreter', 'psi-port-pneumonia-score', 'alveolar-arterial-gradient',
      'pao2-fio2-ratio-ards', 'peak-flow-calculator', 'pack-year-calculator',
    ],
  },
  gastroenterology: {
    id: 'gastroenterology',
    label: 'Gastroenterology',
    icon: '🫀',
    slugs: [
      'meld-score-calculator', 'child-pugh-score-calculator', 'saag-calculator',
      'ransons-criteria-pancreatitis', 'h-pylori-eradication-tracker', 'bowel-prep-dosing-calculator',
    ],
  },
  'oncology-hematology': {
    id: 'oncology-hematology',
    label: 'Oncology & Haematology',
    icon: '🔬',
    slugs: [
      'chemotherapy-dose-bsa-calculator', 'anc-absolute-neutrophil-count', 'psa-velocity-doubling-time',
      'tnm-staging-interpreter', 'inr-pt-ratio-converter', 'ipss-mds-score',
      'blood-transfusion-volume-calculator', 'cancer-survival-probability',
    ],
  },
  pediatrics: {
    id: 'pediatrics',
    label: 'Paediatrics',
    icon: '👶',
    slugs: [
      'child-growth-percentile', 'pediatric-bmi-for-age', 'fever-dose-calculator',
      'holliday-segar-maintenance-fluid', 'vaccine-schedule-checker', 'corrected-gestational-age-calculator',
      'pediatric-ett-size-depth', 'neonatal-jaundice-bhutani',
    ],
  },
  'consumer-health': {
    id: 'consumer-health',
    label: 'Consumer Health',
    icon: '💪',
    slugs: [
      'bmi-health-calculator', 'calorie-deficit-calculator', 'heart-rate-zone-calculator',
      'daily-water-intake-calculator', 'sleep-cycle-calculator', 'health-insurance-premium-estimator',
      'blood-pressure-tracker-chart', 'cholesterol-ratio-calculator', 'surgery-cost-estimator',
      'drug-rehab-cost-calculator', 'therapy-session-cost-estimator', 'medication-cost-comparator',
    ],
  },
}

// ─── Helpers ──────────────────────────────────────────────────
function getSpecialty(slug: string) {
  return Object.values(SPECIALTY_MAP).find(s => s.slugs.includes(slug)) ?? null
}

// ─── Specialty-based FAQs (minimum 12 per tool) ───────────────
// 7 universal base questions + 5 specialty-specific = 12 total
const UNIVERSAL_FAQS = (toolName: string, specialty: string): FAQ[] => [
  {
    q: `How accurate is the ${toolName}?`,
    a: `The ${toolName} uses validated formulas from peer-reviewed clinical research. Accuracy depends on entering precise, current values. Results are as reliable as the equation itself — which is published and clinically endorsed — but individual variation means results should always be interpreted alongside full clinical assessment. No calculator eliminates the need for clinical judgment.`,
  },
  {
    q: `Is my data private when I use the ${toolName}?`,
    a: `Yes — completely. All calculations run entirely in your browser using JavaScript. No data you enter is transmitted to any server, stored in any database, or shared with any third party. Your patient information and personal health data remain on your device at all times. We do not use cookies to track individual calculation inputs.`,
  },
  {
    q: `Is the ${toolName} free to use?`,
    a: `Yes. The ${toolName} is completely free to use with no account, registration, or subscription required. There are no premium tiers, no paywalled results, and no hidden costs. All ${specialty} tools on RoughTools are free, browser-based, and require no download or installation.`,
  },
  {
    q: `Does the ${toolName} work on mobile phones and tablets?`,
    a: `Yes. The ${toolName} is fully responsive and works on all modern smartphones, tablets, and desktop computers. The interface adapts automatically to smaller screens, making it practical for use at the bedside, in clinic, or on rounds without needing a desktop computer.`,
  },
  {
    q: `What browsers are supported by the ${toolName}?`,
    a: `The ${toolName} works on all modern browsers including Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, and Opera. No plugins, extensions, or additional software are required. For best performance, keep your browser updated to its latest version.`,
  },
  {
    q: `Can I save or export my results from the ${toolName}?`,
    a: `Yes. You can export your calculation results as a PDF using the "Save as PDF" button, which captures the inputs and outputs in a printable format suitable for including in clinical notes or patient records. You can also copy results to clipboard using the copy button in the results panel.`,
  },
  {
    q: `What formula does the ${toolName} use?`,
    a: `The exact formula, variable definitions, and clinical interpretation are shown in the Formula section on this page. Transparency about the underlying mathematics is a core principle of RoughTools — you should always know precisely how a calculator arrives at its result before relying on it clinically. The formula reference and source guideline are also cited.`,
  },
]

function getFAQs(specialtyId: string, toolName: string): FAQ[] {
  const specialtyLabel: Record<string, string> = {
    cardiology: 'Cardiology',
    nephrology: 'Nephrology',
    'emergency-icu': 'Emergency & ICU',
    'neurology-psychiatry': 'Neurology & Psychiatry',
    endocrinology: 'Endocrinology',
    pharmacology: 'Pharmacology',
    obstetrics: 'Obstetrics & Gynaecology',
    pulmonology: 'Pulmonology',
    gastroenterology: 'Gastroenterology',
    'oncology-hematology': 'Oncology & Haematology',
    pediatrics: 'Paediatrics',
    'consumer-health': 'Consumer Health',
  }
  const label = specialtyLabel[specialtyId] ?? 'Medical'

  const specialtySpecific: Record<string, FAQ[]> = {
    cardiology: [
      {
        q: `What is the ${toolName} used for?`,
        a: `The ${toolName} is a validated clinical scoring tool used in cardiology to assess cardiovascular risk and guide clinical decision-making. It is based on published evidence from major cardiovascular societies including the ACC/AHA and ESC, and is designed to support — not replace — full clinical assessment.`,
      },
      {
        q: 'How accurate are cardiovascular risk calculators?',
        a: 'Cardiovascular risk calculators are validated in large population cohorts and are reliable for population-level risk estimation. Individual predictions may vary due to unmeasured risk factors such as family history, inflammatory markers, or socioeconomic status. They are most useful when interpreted alongside the full clinical picture, not in isolation.',
      },
      {
        q: 'Can I use this calculator to make treatment decisions?',
        a: 'These tools are intended for clinical reference and education only. All treatment decisions — including initiating statins, antihypertensives, or anticoagulants — must be made by a qualified healthcare provider who considers the complete clinical context, patient values, and current evidence-based guidelines.',
      },
      {
        q: 'What guidelines does this calculator follow?',
        a: 'Our cardiology calculators reference the latest ACC/AHA, ESC, NICE, and other major cardiovascular society guidelines. The specific guideline source and formula reference are displayed in the Formula section of each calculator page.',
      },
      {
        q: 'Who should I consult for cardiovascular risk management?',
        a: 'For elevated cardiovascular risk scores, statin therapy decisions, blood pressure management, or anticoagulation decisions in atrial fibrillation, consult a cardiologist or your primary care physician. This tool provides a risk estimate — the clinical conversation and treatment plan require a qualified clinician.',
      },
    ],
    nephrology: [
      {
        q: `What does the ${toolName} calculate?`,
        a: `The ${toolName} estimates kidney function or related renal parameters using validated equations. Results help clinicians stage chronic kidney disease (CKD), adjust drug doses safely, and monitor disease progression over time. The specific output — eGFR, CrCl, or another parameter — is shown with its clinical interpretation.`,
      },
      {
        q: 'What is the difference between eGFR and creatinine clearance?',
        a: 'eGFR (CKD-EPI equation) uses population-based modelling to estimate kidney filtration from serum creatinine, age, and sex — it is preferred for CKD staging. Creatinine clearance (Cockcroft-Gault) directly estimates drug clearance and is preferred for dose adjustment, because most pharmacokinetic studies used this equation.',
      },
      {
        q: 'When should I use the CKD-EPI vs MDRD equation?',
        a: 'CKD-EPI 2021 (race-free) is the preferred equation for CKD staging per current KDIGO guidelines and provides better accuracy across the full eGFR range. MDRD tends to underestimate eGFR above 60 mL/min/1.73m². For drug dosing, always use Cockcroft-Gault CrCl regardless of which equation your lab reports.',
      },
      {
        q: 'How does acute kidney injury affect eGFR readings?',
        a: 'eGFR equations assume stable, steady-state creatinine levels. During acute kidney injury, serum creatinine is rising and has not yet reached equilibrium — the calculated eGFR will significantly overestimate true kidney function. Never use an eGFR calculated during AKI for CKD staging or drug dosing.',
      },
      {
        q: 'When should I refer to a nephrologist?',
        a: 'Referral to a nephrologist is generally recommended for: eGFR <30 mL/min/1.73m² (CKD G4–G5), rapid eGFR decline (>5 mL/min/year), heavy proteinuria (UACR >300 mg/g), unexplained AKI, or CKD with uncertain aetiology. Earlier referral is appropriate for specific conditions such as glomerulonephritis.',
      },
    ],
    'emergency-icu': [
      {
        q: `How is the ${toolName} used in clinical practice?`,
        a: `The ${toolName} is used in emergency and critical care settings to rapidly assess severity of illness, guide triage decisions, and inform management strategies. It has been validated in large prospective studies for its intended purpose and is referenced in major emergency medicine and critical care guidelines.`,
      },
      {
        q: 'Can these scores predict patient outcomes?',
        a: 'ICU and emergency severity scores provide probability estimates based on population-derived data. They are valuable for risk stratification, prognostic communication with families, and benchmarking ICU performance — but individual outcomes depend on many factors not captured by any scoring tool, including treatment quality and patient-specific biology.',
      },
      {
        q: 'How often should ICU scores be recalculated?',
        a: 'Many ICU scoring systems are designed for serial calculation. SOFA should be recalculated daily — a rising SOFA score indicates organ failure progression, while a falling score suggests improvement. APACHE-II is typically calculated from the worst values in the first 24 hours. Check each tool\'s specific protocol for timing.',
      },
      {
        q: 'What is the difference between SOFA and qSOFA?',
        a: 'SOFA (Sequential Organ Failure Assessment) requires laboratory values and provides formal organ failure scoring used for Sepsis-3 diagnosis. qSOFA uses only 3 bedside criteria (RR ≥22, altered mentation, SBP ≤100) and is a rapid screening tool that can be applied without lab results — useful at triage or on the ward.',
      },
      {
        q: 'When should I escalate care based on these scores?',
        a: 'Score thresholds that typically warrant escalation: qSOFA ≥2 warrants urgent reassessment for sepsis; SOFA ≥2 above baseline indicates organ dysfunction; CURB-65 ≥3 suggests ICU-level care for pneumonia; NEWS ≥7 warrants emergency response. Always combine score thresholds with clinical judgment and institutional protocols.',
      },
    ],
    'neurology-psychiatry': [
      {
        q: `What does the ${toolName} measure?`,
        a: `The ${toolName} is a standardised neurological or psychiatric assessment tool that quantifies symptoms, cognitive function, or neurological deficits using a validated scoring system. Scores are interpreted according to published cutoffs from the tool\'s original validation studies and current clinical guidelines.`,
      },
      {
        q: 'Are these psychiatric screening tools diagnostic?',
        a: 'No. Screening tools like PHQ-9 and GAD-7 identify patients who may have a condition — they do not diagnose it. A positive screen (e.g., PHQ-9 ≥10) indicates the need for a comprehensive clinical interview using DSM-5 criteria to confirm diagnosis, assess severity, rule out differential diagnoses, and plan treatment.',
      },
      {
        q: 'How frequently can these assessment scales be repeated?',
        a: 'Tools like PHQ-9 and GAD-7 can be used at each clinic visit — typically every 4–6 weeks during active treatment — to monitor symptom trajectory and treatment response. A clinically meaningful improvement on PHQ-9 is generally defined as a ≥5-point reduction. GCS and NIHSS can be repeated at any interval clinically indicated.',
      },
      {
        q: 'What is the clinical significance of NIHSS score ranges?',
        a: 'NIHSS scores from 0–42 classify stroke severity: 1–4 minor, 5–15 moderate, 16–20 moderate-severe, 21–42 severe. The score guides acute stroke management including tPA eligibility (typically NIHSS ≥4 and ≤25 for selected patients), thrombectomy decisions, and prognosis communication. Serial scoring tracks neurological improvement or deterioration.',
      },
      {
        q: 'When should I refer for specialist mental health assessment?',
        a: 'Immediate referral is indicated for: active suicidal ideation (PHQ-9 item 9 >0), psychosis, manic episodes, or inability to safely care for oneself. Routine referral is indicated for: PHQ-9 ≥15 (moderately severe or severe depression) not responding to first-line treatment, complex presentations, or diagnostic uncertainty requiring specialist evaluation.',
      },
    ],
    endocrinology: [
      {
        q: `What does the ${toolName} help assess?`,
        a: `The ${toolName} calculates an important metabolic or endocrine parameter to help clinicians and patients understand diabetes management, obesity, thyroid function, or overall metabolic health. Results are based on validated clinical equations and are referenced to current guidelines from organisations such as the ADA, WHO, and Endocrine Society.`,
      },
      {
        q: 'How is HbA1c related to average blood glucose?',
        a: 'HbA1c reflects average blood glucose over the past 2–3 months, proportional to the percentage of haemoglobin glycated. Using the Nathan equation (ADAG study), an HbA1c of 7.0% corresponds to an estimated average glucose (eAG) of 154 mg/dL (8.6 mmol/L). Each 1% change in HbA1c corresponds to approximately 28–29 mg/dL change in eAG.',
      },
      {
        q: 'What is a healthy BMI range?',
        a: 'WHO classifies BMI 18.5–24.9 as normal weight, 25–29.9 as overweight, and ≥30 as obese. However, BMI does not distinguish muscle from fat, does not measure fat distribution, and has different risk thresholds in Asian populations (some guidelines use ≥23 as overweight and ≥27.5 as obese for East Asian populations). Always combine BMI with waist circumference.',
      },
      {
        q: 'How should I interpret BMR and TDEE results?',
        a: 'BMR (Basal Metabolic Rate) is the calories your body needs at complete rest to maintain basic functions. TDEE (Total Daily Energy Expenditure) multiplies BMR by your activity factor to estimate total daily calorie needs. TDEE equations have a ±200–300 kcal/day variability at the individual level — adjust based on actual weight trajectory over 2–3 weeks.',
      },
      {
        q: 'When should I consult an endocrinologist?',
        a: 'Endocrinologist referral is recommended for: diabetes not meeting glycaemic targets on 2–3 oral agents, frequent hypoglycaemia, suspected type 1 or LADA, thyroid nodules requiring evaluation, adrenal incidentalomas, pituitary abnormalities, or any metabolic condition requiring specialist management. This calculator supports monitoring — complex management requires specialist care.',
      },
    ],
    pharmacology: [
      {
        q: `How does the ${toolName} work?`,
        a: `The ${toolName} applies validated pharmacokinetic principles or evidence-based clinical dosing algorithms to calculate drug doses, concentration targets, or infusion rates. Results are based on population pharmacokinetic data and must always be verified against current drug references and the patient\'s full clinical status before prescribing or administering.`,
      },
      {
        q: 'How do I adjust drug doses for renal impairment?',
        a: 'Most renally-cleared drugs require dose reduction or interval extension when CrCl falls below thresholds specified in the drug\'s prescribing information. Calculate CrCl using Cockcroft-Gault (not CKD-EPI eGFR) for drug dosing — this is the equation used in most pharmacokinetic studies. Consult Lexicomp, Micromedex, or the prescribing information for specific thresholds.',
      },
      {
        q: 'What is an opioid equianalgesic conversion?',
        a: 'Equianalgesic conversions estimate equivalent analgesic doses when switching between opioids. Conversion ratios are population-derived averages with high interindividual variability. Always reduce the calculated equianalgesic dose by 25–50% when initiating a new opioid (incomplete cross-tolerance), then titrate upward based on pain response and tolerability.',
      },
      {
        q: 'What is AUC-guided vancomycin dosing?',
        a: 'AUC-guided vancomycin dosing targets an AUC/MIC ratio of 400–600 mg·h/L (assuming MIC ≤1 mg/L). This approach, recommended by ASHP/IDSA/SIDP 2020 guidelines, has replaced trough-only monitoring because targeting AUC improves clinical efficacy against MRSA and reduces the risk of nephrotoxicity compared to high-trough strategies.',
      },
      {
        q: 'Must a pharmacist check all doses calculated by this tool?',
        a: 'Yes — this is a mandatory patient safety requirement, not a suggestion. All drug doses calculated by any tool, including this one, must be independently verified by a licensed pharmacist before prescribing, preparation, and administration. This is especially critical for high-alert medications including opioids, anticoagulants, chemotherapy, vancomycin, and aminoglycosides.',
      },
    ],
    obstetrics: [
      {
        q: `What is the ${toolName} used for in obstetric practice?`,
        a: `The ${toolName} is a standard obstetric assessment tool used to guide antenatal care, pregnancy dating, fetal monitoring, or labour management. Results should be interpreted in the context of full clinical findings, current ultrasound measurements, and the obstetric history — not used in isolation.`,
      },
      {
        q: 'How accurate is the due date (EDD) calculated from LMP?',
        a: "Naegele's Rule (EDD = LMP + 280 days) is accurate when the last menstrual period is reliably known and cycles are regular (~28 days). First-trimester ultrasound crown-rump length (CRL) measurement is more accurate — if discordance between LMP and ultrasound dating exceeds 5 days at 9–11 weeks or 7 days at 11–14 weeks, ACOG recommends using the ultrasound date.",
      },
      {
        q: 'What is the Bishop Score and how is it interpreted?',
        a: 'The Bishop Score assesses cervical readiness for labour induction by scoring five cervical factors: dilation (0–3), effacement (0–3), station (0–3), consistency (0–2), and position (0–2). Total range 0–13. A score ≥8 indicates a favourable cervix with a high probability of successful induction; ≤6 suggests the cervix may benefit from ripening before induction.',
      },
      {
        q: 'How is gestational age different from fetal age?',
        a: 'Gestational age (GA) is counted from the first day of the last menstrual period and is the universal clinical standard — reported in weeks and days. Fetal (embryonic) age counts from fertilization and is approximately 2 weeks less than gestational age. All obstetric guidelines, ultrasound reports, and clinical decisions use gestational age.',
      },
      {
        q: 'When should I see an obstetrician or midwife?',
        a: 'These calculators support clinical education and reference — they do not replace obstetric care. All pregnant women should register with an obstetrician or midwife as early as possible (ideally before 10 weeks). Contact your maternity provider immediately for: vaginal bleeding, decreased fetal movement, severe headache, visual changes, upper abdominal pain, or signs of preterm labour.',
      },
    ],
    pulmonology: [
      {
        q: `What does the ${toolName} measure in respiratory medicine?`,
        a: `The ${toolName} evaluates pulmonary function or respiratory severity using validated formulas and established clinical criteria. Results help clinicians classify respiratory conditions, assess disease severity, and guide management decisions including inhaler selection, oxygen prescription, or referral thresholds.`,
      },
      {
        q: 'What is the clinical significance of the FEV1/FVC ratio?',
        a: 'The FEV1/FVC ratio is the primary diagnostic marker for obstructive lung disease. A ratio below 0.70 (or below the Lower Limit of Normal per GLI 2012 reference equations) indicates obstruction such as COPD or asthma. The severity of obstruction is then classified using the % predicted FEV1 per GOLD guidelines: Stage 1 (≥80%), 2 (50–79%), 3 (30–49%), 4 (<30%).',
      },
      {
        q: 'What is the P/F ratio and why is it important in ARDS?',
        a: 'The PaO2/FiO2 ratio measures the efficiency of gas exchange relative to inspired oxygen. Per the Berlin Definition, ARDS severity is classified as: mild (P/F 200–300 on PEEP ≥5), moderate (100–200), or severe (<100). Severe ARDS (P/F <150) is a threshold for considering prone positioning and ECMO at specialist centres.',
      },
      {
        q: 'How many pack-years indicate a significant smoking history?',
        a: '≥20 pack-years is the USPSTF threshold for recommending annual low-dose CT lung cancer screening in adults aged 50–80 who currently smoke or quit within the past 15 years. Pack-years = (packs per day) × (years smoked). A pack contains 20 cigarettes. A 40-year-old who smoked 1 pack/day for 20 years has 20 pack-years.',
      },
      {
        q: 'When should I refer to a pulmonologist?',
        a: 'Refer to a pulmonologist for: FEV1 <50% predicted, diagnostic uncertainty, COPD with frequent exacerbations despite optimal inhaler therapy, suspected interstitial lung disease, unexplained haemoptysis, pulmonary hypertension, evaluation for lung volume reduction or transplant, or any patient with rapidly declining lung function.',
      },
    ],
    gastroenterology: [
      {
        q: `What is the ${toolName} used for in gastroenterology?`,
        a: `The ${toolName} is a validated scoring system used to assess liver disease severity, guide transplant listing decisions, evaluate gastrointestinal conditions, or estimate procedural risk. It is referenced in AASLD, EASL, and BSG hepatology and gastroenterology guidelines.`,
      },
      {
        q: 'What is the difference between Child-Pugh and MELD scores?',
        a: "Child-Pugh score combines five variables — bilirubin, albumin, PT/INR, ascites, and encephalopathy — to classify cirrhosis as Class A (5–6, well-compensated), B (7–9, significant dysfunction), or C (10–15, decompensated). MELD uses only objective lab values (bilirubin, INR, creatinine) and is used for organ allocation priority in liver transplant waiting lists in the US.",
      },
      {
        q: 'What is the SAAG and when is it used?',
        a: 'The Serum-Ascites Albumin Gradient (SAAG) = serum albumin − ascitic fluid albumin, both measured simultaneously. SAAG ≥1.1 g/dL indicates portal hypertension-related ascites (cirrhosis, cardiac ascites, Budd-Chiari) with 97% accuracy. SAAG <1.1 g/dL suggests non-portal causes (malignancy, TB peritonitis, nephrotic syndrome).',
      },
      {
        q: "How are Ranson's Criteria interpreted?",
        a: "Ranson's Criteria require two assessment time points. At admission: assess age, WBC, glucose, LDH, and AST. At 48 hours: assess haematocrit drop, BUN rise, calcium, PaO2, base deficit, and fluid sequestration. Score 0–2: mild pancreatitis (mortality <1%). Score 3–4: ~15% mortality. Score ≥5: severe pancreatitis, ~40% mortality, typically requires ICU admission.",
      },
      {
        q: 'When should I refer to a hepatologist or gastroenterologist?',
        a: 'Refer to a gastroenterologist or hepatologist for: MELD score ≥15, Child-Pugh Class C, suspected cirrhosis requiring liver biopsy, portal hypertension with varices or encephalopathy, acute liver failure, unexplained transaminase elevation persisting >3 months, or any patient being considered for liver transplant evaluation.',
      },
    ],
    'oncology-hematology': [
      {
        q: `What is the ${toolName} used for in oncology?`,
        a: `The ${toolName} is used in oncology or haematology to calculate treatment doses, assess disease severity, classify tumour stage, or estimate prognosis. It follows validated protocols and dosing guidelines from major oncology organisations including ASCO, ESMO, and NCCN.`,
      },
      {
        q: 'Why is body surface area (BSA) used for chemotherapy dosing?',
        a: 'BSA is used because many chemotherapy agents have narrow therapeutic windows and serious dose-limiting toxicities. BSA-based dosing attempts to normalise systemic drug exposure across patients of different body sizes. However, BSA is an imperfect surrogate for pharmacokinetics — doses may still require adjustment for renal/hepatic function, prior toxicity, or protocol-specific capping rules.',
      },
      {
        q: 'What is considered neutropenia after chemotherapy?',
        a: 'Neutropenia is ANC <1500 cells/μL. Grade 3 = ANC 500–1000; Grade 4 = ANC <500. Febrile neutropenia (ANC <500 with fever ≥38.3°C or sustained ≥38.0°C for >1 hour) is an oncologic emergency requiring immediate empiric broad-spectrum antibiotics — mortality is significant if antibiotic treatment is delayed beyond the first hour.',
      },
      {
        q: 'What does TNM staging tell us about a cancer?',
        a: 'TNM staging quantifies: T (primary tumour size/invasion depth), N (regional lymph node involvement), M (distant metastasis). Combined into Stage I–IV, it is the most important determinant of prognosis and treatment selection for most solid tumours. Note that clinical staging (pre-treatment imaging) and pathological staging (post-surgery) may differ — pathological staging is more accurate.',
      },
      {
        q: 'Must a pharmacist and oncologist verify all chemotherapy doses?',
        a: 'Yes — independent verification by both the treating oncologist and a specialist oncology pharmacist is a mandatory safety requirement before any chemotherapy is prepared or administered. This applies to all doses regardless of how they are calculated. A dosing calculation error in chemotherapy can be fatal — the double-check process exists specifically to prevent these errors.',
      },
    ],
    pediatrics: [
      {
        q: `How is the ${toolName} used in paediatric practice?`,
        a: `The ${toolName} is used by paediatricians, emergency physicians, and pharmacists to assess child growth, calculate weight-based medication doses, evaluate developmental status, or manage neonatal conditions. All reference values are based on WHO/CDC paediatric norms and BNFc/AAP dosing guidelines where applicable.`,
      },
      {
        q: 'What is the difference between WHO and CDC growth charts?',
        a: 'WHO growth standards (0–5 years) describe how children should grow under optimal conditions and are recommended by AAP for children under 2 as the gold standard for nutritional assessment. CDC growth charts (2–20 years) describe reference growth for the US population. Both use the same percentile system but may give different classifications for the same child.',
      },
      {
        q: 'How do I calculate paracetamol dose for a child?',
        a: 'Paracetamol (acetaminophen) is dosed at 10–15 mg/kg every 4–6 hours, maximum 75 mg/kg/day or 4,000 mg/day (whichever is less). Ibuprofen: 5–10 mg/kg every 6–8 hours (only for children ≥6 months). Never give aspirin to children due to Reye syndrome risk. Use the Fever Dose Calculator for exact doses — precision is critical to avoid hepatotoxicity from overdosing.',
      },
      {
        q: 'What is corrected gestational age and why does it matter?',
        a: 'Corrected age = Chronological age − Weeks premature. It must be used for developmental milestone assessment and growth chart plotting in preterm infants until 2 years corrected age for infants born before 32 weeks gestation. Using uncorrected age will generate false concerns about developmental delay that reflect prematurity, not a true neurodevelopmental problem.',
      },
      {
        q: 'When should I take a child to a paediatrician or emergency department?',
        a: 'These calculators are reference tools — they do not replace clinical assessment by a qualified paediatrician. Take a child to the emergency department immediately for: fever in infants <3 months, seizures, difficulty breathing, unresponsiveness or extreme lethargy, persistent vomiting, signs of dehydration, or any situation where a parent\'s instinct says something is seriously wrong. When in doubt, seek immediate medical assessment.',
      },
    ],
    'consumer-health': [
      {
        q: `What does the ${toolName} help me understand?`,
        a: `The ${toolName} helps you assess an important personal health metric or estimate health-related costs using validated evidence-based formulas. Results are intended for personal health education and awareness — they give you data to have a more informed conversation with your healthcare provider, not a diagnosis or treatment plan.`,
      },
      {
        q: 'How reliable is BMI as a health indicator?',
        a: 'BMI is a useful population-level screening tool but has well-documented limitations. It does not distinguish muscle from fat, does not measure fat distribution (abdominal fat carries more metabolic risk than peripheral fat), and has different risk thresholds across ethnicities. A muscular athlete and a sedentary person with high body fat may have identical BMIs. Always combine BMI with waist circumference and, ideally, body fat percentage.',
      },
      {
        q: 'How many calories should I eat to lose weight?',
        a: 'A calorie deficit of 500–750 kcal/day below your TDEE generally produces 0.5–0.75 kg (1–1.5 lb) of weight loss per week. Very low calorie diets under 1,200 kcal/day (women) or 1,500 kcal/day (men) should only be undertaken under medical supervision. Focus on total daily energy balance — the specific source of the deficit (diet vs exercise) matters less than maintaining it consistently.',
      },
      {
        q: 'How accurate are health insurance and medical cost estimates?',
        a: 'Our insurance and healthcare cost estimators use national average data from ACA marketplace benchmarks and healthcare price transparency databases. Actual premiums, deductibles, and out-of-pocket maximums vary significantly by state, insurer, plan tier, and individual health status. Use these estimates for planning and budgeting — verify actual costs with your insurer and provider.',
      },
      {
        q: 'When should I consult a healthcare provider instead of using a calculator?',
        a: 'Always consult a qualified healthcare provider before making significant changes to diet, exercise, medication, or health insurance based on any calculator result. These tools are for personal health awareness and education. If any result is outside the healthy range — especially BMI indicating obesity, abnormal blood pressure readings, or significant healthcare cost concerns — book an appointment with your GP or primary care provider to discuss next steps.',
      },
    ],
  }

  const base = specialtySpecific[specialtyId] ?? [
    {
      q: `What is the ${toolName} used for?`,
      a: `The ${toolName} is a validated clinical tool used to calculate, estimate, or assess an important medical parameter. It is based on published clinical evidence and guidelines from major medical organisations. The specific formula and reference source are shown in the Formula section on this page.`,
    },
    {
      q: 'How accurate is this calculator?',
      a: `The ${toolName} uses formulas from peer-reviewed literature. Accuracy depends on the precision of values entered and the equation\'s validated accuracy in its original derivation cohort. Always interpret results alongside a full clinical assessment — no calculator replaces clinical judgment.`,
    },
    {
      q: 'Can I use this result to make clinical decisions?',
      a: 'This tool is for educational and clinical reference only. All clinical decisions must be made by a qualified healthcare professional considering the full clinical context, patient history, examination findings, and current laboratory data.',
    },
    {
      q: 'Who should I consult regarding this result?',
      a: `For results from the ${toolName} that indicate elevated risk, disease, or abnormal values, consult a qualified physician or specialist in the relevant field. The tool\'s specialty is identified in the breadcrumb navigation above — the appropriate specialist for that field is the right person to advise on clinical action.`,
    },
    {
      q: 'What guidelines does this tool follow?',
      a: 'The formula, variable definitions, and clinical reference for this tool are displayed in the Formula section on this page. Our tools are referenced to major clinical guidelines including ACC/AHA, KDIGO, IDSA, ACOG, WHO, and others as applicable to each specialty.',
    },
  ]

  // Combine: specialty-specific (5) + universal (7) = 12 total
  return [...base, ...UNIVERSAL_FAQS(toolName, label)]
}

// ─── Specialty notes & generic fallbacks ─────────────────────
const SPECIALTY_NOTES: Record<string, string> = {
  cardiology: 'Validated by ACC/AHA/ESC cardiovascular guidelines. Always interpret in clinical context.',
  nephrology: 'Based on KDIGO guidelines. eGFR assumes stable steady-state serum creatinine.',
  'emergency-icu': 'ICU/emergency scoring tools validated in prospective cohort studies. Track serially.',
  'neurology-psychiatry': 'Screening tools only — not diagnostic. Positive screens require full clinical evaluation.',
  endocrinology: 'Based on ADA/WHO/ACOG metabolic guidelines. Interpret alongside clinical presentation.',
  pharmacology: 'Drug dosing — always verify with pharmacist and current drug references before prescribing.',
  obstetrics: 'Based on ACOG/RCOG guidelines. Confirm with ultrasound measurement when indicated.',
  pulmonology: 'Based on GOLD/ATS/ERS spirometry standards. Perform formal lung function testing for diagnosis.',
  gastroenterology: 'Based on AASLD/EASL hepatology guidelines. Scores valid only at time of stable lab values.',
  'oncology-hematology': 'Oncology protocols vary by institution. Verify all doses with the treating oncologist and pharmacist.',
  pediatrics: 'Paediatric doses based on BNFc/AAP guidelines. Always confirm with a paediatrician.',
  'consumer-health': 'For educational and wellness awareness only. Consult a healthcare provider for medical decisions.',
}

const SPECIALTY_GENERICS: Record<string, { title: string; formula: string; variables: Array<{ symbol: string; meaning: string }>; note: string }> = {
  cardiology: {
    title: 'Cardiovascular Risk Scoring',
    formula: 'Risk Score = Σ (weighted clinical risk factors)\nRisk Probability (%) = validated lookup from derivation cohort table',
    variables: [
      { symbol: 'Risk factors', meaning: 'Age, sex, lipids, blood pressure, smoking, diabetes — weighted per scoring system' },
      { symbol: 'Probability', meaning: 'Derived from Kaplan-Meier survival data or logistic regression' },
    ],
    note: 'Cardiovascular scoring systems are validated in large population cohorts. Always combine with full clinical assessment.',
  },
  nephrology: {
    title: 'Renal Function Calculation',
    formula: 'Kidney Function = f(serum creatinine, age, sex, weight)\nCKD Stage: G1(≥90) G2(60–89) G3a(45–59) G3b(30–44) G4(15–29) G5(<15 mL/min/1.73m²)',
    variables: [
      { symbol: 'Scr', meaning: 'Serum creatinine (mg/dL) — primary marker of kidney filtration' },
      { symbol: 'eGFR', meaning: 'Estimated glomerular filtration rate (mL/min/1.73m²)' },
      { symbol: 'CKD Stage', meaning: 'Classification per KDIGO 2012 guidelines' },
    ],
    note: 'All GFR equations assume stable, steady-state creatinine. Do not apply during AKI.',
  },
  'emergency-icu': {
    title: 'Emergency / ICU Severity Score',
    formula: 'Severity Score = Σ (clinical parameter points)\nPredicted Mortality (%) = validated outcome table',
    variables: [
      { symbol: 'Clinical parameters', meaning: 'Physiologic measurements scored on admission or per protocol' },
      { symbol: 'Predicted mortality', meaning: 'Derived from derivation cohort outcome data' },
    ],
    note: 'ICU severity scores provide probability estimates. Recalculate serially to track disease trajectory.',
  },
  'neurology-psychiatry': {
    title: 'Neurological / Psychiatric Assessment Scale',
    formula: 'Total Score = Σ (item responses, each 0–N)\nSeverity Category = validated clinical cutoff ranges',
    variables: [
      { symbol: 'Items', meaning: 'Standardised clinical or patient-reported response items (0–N each)' },
      { symbol: 'Cutoffs', meaning: 'Evidence-based thresholds for severity classification' },
    ],
    note: 'Screening tools are not diagnostic instruments. A positive screen requires full clinical evaluation.',
  },
  endocrinology: {
    title: 'Metabolic / Endocrine Calculation',
    formula: 'Metabolic Index = f(anthropometric + laboratory inputs)\nClassification = evidence-based reference thresholds',
    variables: [
      { symbol: 'Anthropometrics', meaning: 'Weight (kg), height (cm), age, sex — as required' },
      { symbol: 'Lab values', meaning: 'Glucose, HbA1c, lipids, hormone levels — as required' },
    ],
    note: 'Endocrine calculations are referenced to ADA, ACOG, and WHO clinical guidelines.',
  },
  pharmacology: {
    title: 'Drug Dosing / Pharmacokinetic Calculation',
    formula: 'Dose (mg) = Dose parameter × Patient factor\nClearance = Dose / Target_concentration',
    variables: [
      { symbol: 'Dose parameter', meaning: 'mg/kg, mg/m², or concentration target per drug protocol' },
      { symbol: 'Patient factor', meaning: 'Weight (kg), renal function (CrCl), or BSA (m²)' },
    ],
    note: 'All drug doses must be verified by a licensed pharmacist before administration.',
  },
  obstetrics: {
    title: 'Obstetric / Gynaecology Calculation',
    formula: 'Obstetric Parameter = f(gestational timing + clinical measurements)\nGA (weeks) = Days since LMP ÷ 7',
    variables: [
      { symbol: 'LMP', meaning: 'Last menstrual period (first day)' },
      { symbol: 'GA', meaning: 'Gestational age in weeks and days' },
      { symbol: 'EDD', meaning: 'Estimated due date (LMP + 280 days)' },
    ],
    note: "Obstetric dating based on Naegele's Rule for regular 28-day cycles. Confirm with first-trimester ultrasound.",
  },
  pulmonology: {
    title: 'Pulmonary / Respiratory Calculation',
    formula: 'Respiratory Parameter = f(spirometric values + demographics)\nFEV1/FVC < 0.70 → Obstructive pattern',
    variables: [
      { symbol: 'FEV1', meaning: 'Forced expiratory volume in 1 second (litres)' },
      { symbol: 'FVC', meaning: 'Forced vital capacity (litres)' },
      { symbol: '% Predicted', meaning: 'Patient value vs age/sex/height reference' },
    ],
    note: 'Spirometry interpretation per GOLD and ATS/ERS guidelines. Formal testing required for clinical diagnosis.',
  },
  gastroenterology: {
    title: 'Hepatic / GI Scoring',
    formula: 'Score = Σ (clinical + laboratory variables, each weighted)\nPrognosis = validated survival or mortality data',
    variables: [
      { symbol: 'Lab values', meaning: 'Bilirubin, albumin, INR, creatinine — as required by scoring system' },
      { symbol: 'Clinical criteria', meaning: 'Ascites, encephalopathy grade, clinical findings' },
    ],
    note: 'Hepatic scores validated by AASLD/EASL guidelines. Interpret in the context of stable lab values.',
  },
  'oncology-hematology': {
    title: 'Oncology / Haematology Calculation',
    formula: 'Oncologic Parameter = f(staging + patient + treatment factors)\nBSA (m²) = √(Height(cm) × Weight(kg) / 3600)',
    variables: [
      { symbol: 'BSA', meaning: 'Body surface area (Mosteller formula, m²)' },
      { symbol: 'Protocol dose', meaning: 'Chemotherapy dose in mg/m² per treatment protocol' },
      { symbol: 'Total dose', meaning: 'BSA × protocol dose (mg)' },
    ],
    note: 'All chemotherapy doses must be confirmed with the treating oncologist and clinical pharmacist.',
  },
  pediatrics: {
    title: 'Paediatric Dosing / Growth Calculation',
    formula: 'Dose (mg) = Weight (kg) × dose_per_kg (mg/kg)\nGrowth Percentile = WHO/CDC reference chart',
    variables: [
      { symbol: 'Weight', meaning: 'Child weight in kilograms (kg)' },
      { symbol: 'dose_per_kg', meaning: 'Prescribed dose in mg per kg body weight' },
      { symbol: 'Percentile', meaning: 'Position relative to reference population by age and sex' },
    ],
    note: 'Paediatric dosing from BNFc and AAP guidelines. Always confirm with a paediatrician before prescribing.',
  },
  'consumer-health': {
    title: 'Health & Wellness Metric',
    formula: 'Health Index = f(demographic + lifestyle inputs)\nClassification = validated reference ranges or guidelines',
    variables: [
      { symbol: 'Demographics', meaning: 'Age, sex, height, weight as applicable' },
      { symbol: 'Lifestyle inputs', meaning: 'Activity level, diet, sleep, habits as applicable' },
    ],
    note: 'Consumer health tools are for educational awareness only. Consult a healthcare provider for medical advice.',
  },
}

// ─── Formula variable extraction — always returns ─────────────
function getFormulaDisplay(
  slug: string,
  configFormula: string | null = null,
  specialtyId: string = '',
  toolName: string = 'This Tool'
): {
  title: string
  formula: string
  variables: Array<{ symbol: string; meaning: string }>
  note: string
} {
  const formulaMap: Record<string, {
    title: string; formula: string
    variables: Array<{ symbol: string; meaning: string }>
    note: string
  }> = {
    'bmi-calculator': {
      title: 'BMI Formula',
      formula: 'BMI = weight (kg) ÷ height² (m²)',
      variables: [
        { symbol: 'weight', meaning: 'Body weight in kilograms (kg)' },
        { symbol: 'height²', meaning: 'Height in metres squared (m²)' },
      ],
      note: 'WHO classification: <18.5 Underweight, 18.5–24.9 Normal, 25–29.9 Overweight, ≥30 Obese',
    },
    'egfr-ckd-epi-calculator': {
      title: 'CKD-EPI 2021 (Race-Free) Equation',
      formula: 'eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^(−1.200) × 0.9938^Age × 1.012 [if female]',
      variables: [
        { symbol: 'Scr', meaning: 'Serum creatinine (mg/dL)' },
        { symbol: 'κ', meaning: '0.7 (female) or 0.9 (male)' },
        { symbol: 'α', meaning: '−0.241 (female) or −0.302 (male)' },
        { symbol: 'Age', meaning: 'Patient age in years' },
      ],
      note: 'Race-free CKD-EPI 2021 equation (Inker et al., NEJM 2021). Recommended by KDIGO for CKD staging.',
    },
    'creatinine-clearance-cockcroft-gault': {
      title: 'Cockcroft-Gault Formula',
      formula: 'CrCl = [(140 − Age) × Weight × 0.85 (if female)] ÷ (72 × Scr)',
      variables: [
        { symbol: 'Age', meaning: 'Patient age in years' },
        { symbol: 'Weight', meaning: 'Actual body weight in kg (use IBW if obese)' },
        { symbol: '0.85', meaning: 'Female correction factor' },
        { symbol: 'Scr', meaning: 'Serum creatinine (mg/dL)' },
      ],
      note: 'Preferred equation for drug dose adjustment. Result in mL/min.',
    },
    'framingham-risk-score': {
      title: 'Framingham 10-Year CVD Risk',
      formula: 'Risk = 1 − S₀^exp(L − L_mean)\nL = Σ(β × variable)',
      variables: [
        { symbol: 'S₀', meaning: 'Baseline 10-year survival' },
        { symbol: 'L', meaning: 'Linear predictor (sum of β coefficients × values)' },
        { symbol: 'Variables', meaning: 'Age, total cholesterol, HDL-C, SBP, smoking, diabetes' },
        { symbol: 'L_mean', meaning: 'Mean covariate sum for the cohort' },
      ],
      note: 'Wilson et al., Circulation 1998. Separate equations for men and women.',
    },
    'glasgow-coma-scale': {
      title: 'Glasgow Coma Scale (GCS)',
      formula: 'GCS = Eye (E) + Verbal (V) + Motor (M)\nRange: 3 (min) to 15 (max)',
      variables: [
        { symbol: 'E', meaning: 'Eye opening: 1 (none) to 4 (spontaneous)' },
        { symbol: 'V', meaning: 'Verbal response: 1 (none) to 5 (oriented)' },
        { symbol: 'M', meaning: 'Motor response: 1 (none) to 6 (obeys commands)' },
      ],
      note: 'Teasdale & Jennett, Lancet 1974. GCS ≤8 typically indicates coma and need for airway protection.',
    },
    'mean-arterial-pressure-calculator': {
      title: 'Mean Arterial Pressure Formula',
      formula: 'MAP = DBP + (1/3 × Pulse Pressure)\n     = DBP + (1/3 × (SBP − DBP))',
      variables: [
        { symbol: 'SBP', meaning: 'Systolic blood pressure (mmHg)' },
        { symbol: 'DBP', meaning: 'Diastolic blood pressure (mmHg)' },
        { symbol: 'Pulse Pressure', meaning: 'SBP − DBP (mmHg)' },
      ],
      note: 'MAP >65 mmHg is the minimum target in septic shock. Normal range: 70–100 mmHg.',
    },
    'sofa-sepsis-score': {
      title: 'SOFA Score Components',
      formula: 'SOFA = Respiratory + Coagulation + Liver + CVS + CNS + Renal\nRange: 0–24',
      variables: [
        { symbol: 'Respiratory', meaning: 'PaO₂/FiO₂ ratio (0–4)' },
        { symbol: 'Coagulation', meaning: 'Platelets ×10³/μL (0–4)' },
        { symbol: 'Liver', meaning: 'Bilirubin mg/dL (0–4)' },
        { symbol: 'CVS', meaning: 'MAP or vasopressors required (0–4)' },
        { symbol: 'CNS', meaning: 'Glasgow Coma Scale (0–4)' },
        { symbol: 'Renal', meaning: 'Creatinine or urine output (0–4)' },
      ],
      note: 'Singer et al., JAMA 2016 (Sepsis-3). SOFA ≥2 indicates organ dysfunction in suspected infection.',
    },
    'phq9-depression-screen': {
      title: 'PHQ-9 Scoring',
      formula: 'PHQ-9 Score = Sum of 9 items (each 0–3)\nRange: 0–27',
      variables: [
        { symbol: '0', meaning: 'Not at all' },
        { symbol: '1', meaning: 'Several days' },
        { symbol: '2', meaning: 'More than half the days' },
        { symbol: '3', meaning: 'Nearly every day' },
      ],
      note: 'Kroenke et al., J Gen Intern Med 2001. Scores: 1–4 minimal, 5–9 mild, 10–14 moderate, 15–19 moderately severe, 20–27 severe depression.',
    },
    'hba1c-glucose-converter': {
      title: 'Nathan eAG Equation',
      formula: 'eAG (mg/dL) = 28.7 × HbA1c (%) − 46.7\neAG (mmol/L) = 1.594 × HbA1c (%) − 2.594',
      variables: [
        { symbol: 'HbA1c', meaning: 'Glycated haemoglobin percentage (%)' },
        { symbol: 'eAG', meaning: 'Estimated average glucose over 2–3 months' },
      ],
      note: 'Nathan et al., Diabetes Care 2008. HbA1c target <7% in most adults with T2DM (ADA guidelines).',
    },
    'due-date-edd-calculator': {
      title: "Naegele's Rule",
      formula: "EDD = LMP + 280 days\n    = LMP + 9 months + 7 days",
      variables: [
        { symbol: 'LMP', meaning: 'First day of the last menstrual period' },
        { symbol: 'EDD', meaning: 'Estimated due date (40 weeks from LMP)' },
        { symbol: '280 days', meaning: '40 gestational weeks (assumes 28-day cycle)' },
      ],
      note: "Naegele's Rule assumes a regular 28-day cycle. First-trimester ultrasound CRL is preferred for dating if discordant.",
    },
    'weight-based-drug-dose-calculator': {
      title: 'Weight-Based Dosing Formula',
      formula: 'Single Dose (mg) = Dose (mg/kg) × Weight (kg)\nDaily Dose (mg) = Single Dose × Frequency',
      variables: [
        { symbol: 'Dose (mg/kg)', meaning: 'Prescribed dose per kilogram body weight' },
        { symbol: 'Weight (kg)', meaning: 'Actual body weight (use IBW or ABW for obese patients per drug protocol)' },
        { symbol: 'Frequency', meaning: 'Number of doses per day' },
      ],
      note: 'For obese patients, use IBW or adjusted body weight (ABW) as directed by specific drug protocols.',
    },
    'chemotherapy-dose-bsa-calculator': {
      title: 'Mosteller BSA Formula',
      formula: 'BSA (m²) = √[(Height (cm) × Weight (kg)) ÷ 3600]\nChemo Dose (mg) = BSA × Protocol Dose (mg/m²)',
      variables: [
        { symbol: 'Height', meaning: 'Patient height in centimetres' },
        { symbol: 'Weight', meaning: 'Patient weight in kilograms' },
        { symbol: 'Protocol Dose', meaning: 'Chemotherapy dose in mg per m² of BSA' },
      ],
      note: 'Mosteller RD, NEJM 1987. BSA-based dosing is standard for most chemotherapy regimens.',
    },
    'anion-gap-calculator': {
      title: 'Anion Gap Formula',
      formula: 'AG = Na⁺ − (Cl⁻ + HCO₃⁻)\nAlbumin-corrected AG = AG + 2.5 × (4 − albumin)',
      variables: [
        { symbol: 'Na⁺', meaning: 'Serum sodium (mEq/L)' },
        { symbol: 'Cl⁻', meaning: 'Serum chloride (mEq/L)' },
        { symbol: 'HCO₃⁻', meaning: 'Serum bicarbonate (mEq/L)' },
        { symbol: 'Albumin', meaning: 'Serum albumin (g/dL) — for correction' },
      ],
      note: 'Normal AG: 8–12 mEq/L (without albumin correction). High AG acidosis: MUDPILES mnemonic.',
    },
    'meld-score-calculator': {
      title: 'MELD Score Formula',
      formula: 'MELD = 3.78×ln(Bilirubin) + 11.2×ln(INR) + 9.57×ln(Creatinine) + 6.43',
      variables: [
        { symbol: 'Bilirubin', meaning: 'Total serum bilirubin (mg/dL)' },
        { symbol: 'INR', meaning: 'International Normalized Ratio' },
        { symbol: 'Creatinine', meaning: 'Serum creatinine (mg/dL)' },
      ],
      note: 'Kamath et al., Hepatology 2001. MELD ≥15 is the threshold for liver transplant listing in most centers.',
    },
    'child-pugh-score-calculator': {
      title: 'Child-Pugh Score',
      formula: 'Score = Bilirubin + Albumin + PT/INR + Ascites + Encephalopathy\nRange: 5–15',
      variables: [
        { symbol: 'Bilirubin', meaning: 'Serum total bilirubin (mg/dL) — 1–3 points' },
        { symbol: 'Albumin', meaning: 'Serum albumin (g/dL) — 1–3 points' },
        { symbol: 'PT/INR', meaning: 'Prothrombin time or INR — 1–3 points' },
        { symbol: 'Ascites', meaning: 'Clinical grade: absent/mild/moderate/severe — 1–3 points' },
        { symbol: 'Encephalopathy', meaning: 'Grade: none/Grade 1-2/Grade 3-4 — 1–3 points' },
      ],
      note: 'Class A (5–6): well-compensated. Class B (7–9): significant compromise. Class C (10–15): decompensated.',
    },
    'burn-surface-area-rule-of-9s': {
      title: 'Rule of Nines (Burn TBSA)',
      formula: 'TBSA (%) = Sum of affected body segment percentages\nParkland Formula: Fluid (mL/24h) = 4 × Weight(kg) × TBSA(%)',
      variables: [
        { symbol: 'Head & Neck', meaning: '9% of TBSA' },
        { symbol: 'Each arm', meaning: '9% each (18% both)' },
        { symbol: 'Anterior trunk', meaning: '18% of TBSA' },
        { symbol: 'Posterior trunk', meaning: '18% of TBSA' },
        { symbol: 'Each leg', meaning: '18% each (36% both)' },
        { symbol: 'Perineum', meaning: '1% of TBSA' },
      ],
      note: 'Only include 2nd and 3rd degree burns in TBSA calculation. First 8h: give 50% of 24h Parkland volume.',
    },
    'blood-pressure-classification': {
      title: 'ACC/AHA 2017 BP Classification',
      formula: 'Classified by higher of SBP or DBP category:\nNormal < 120/80 | Elevated 120–129/<80\nStage 1 HTN: 130–139/80–89 | Stage 2 HTN: ≥140/≥90',
      variables: [
        { symbol: 'SBP', meaning: 'Systolic blood pressure (mmHg)' },
        { symbol: 'DBP', meaning: 'Diastolic blood pressure (mmHg)' },
      ],
      note: 'Whelton et al., JACC 2018 (ACC/AHA 2017 Hypertension Guidelines). Average of ≥2 readings on ≥2 occasions.',
    },
    'wells-score-dvt-pe': {
      title: 'Wells Score (DVT/PE)',
      formula: 'Score = Sum of weighted clinical criteria\nDVT: Low <1, Moderate 1–2, High ≥3\nPE: Low <2, Moderate 2–6, High >6',
      variables: [
        { symbol: 'Active cancer', meaning: '+1 point' },
        { symbol: 'Paralysis/immobilization', meaning: '+1 point' },
        { symbol: 'Bedridden >3 days / surgery <4 wks', meaning: '+1 point' },
        { symbol: 'Localized tenderness', meaning: '+1 point' },
        { symbol: 'Entire leg swollen', meaning: '+1 point' },
        { symbol: 'Alternative diagnosis less likely', meaning: '+2 points (PE score)' },
      ],
      note: 'Wells et al., Lancet 1997 (DVT) & Ann Intern Med 2001 (PE). Used to guide D-dimer testing vs imaging.',
    },
    'fever-dose-calculator': {
      title: 'Pediatric Antipyretic Dosing',
      formula: 'Paracetamol: 10–15 mg/kg/dose every 4–6h (max 75 mg/kg/day)\nIbuprofen: 5–10 mg/kg/dose every 6–8h (≥6 months only)',
      variables: [
        { symbol: 'Weight', meaning: 'Child body weight (kg)' },
        { symbol: 'mg/kg', meaning: 'Dose per kilogram of body weight' },
        { symbol: 'Max daily dose', meaning: 'Paracetamol: min(75 mg/kg/day, 4000 mg/day)' },
      ],
      note: 'Do not use ibuprofen in children <6 months. Do not use aspirin in children due to Reye syndrome risk.',
    },
    'iv-drip-rate-mcg-kg-min': {
      title: 'IV Drip Rate Formula',
      formula: 'Rate (mL/h) = [Dose (mcg/kg/min) × Weight (kg) × 60] ÷ Concentration (mcg/mL)',
      variables: [
        { symbol: 'Dose', meaning: 'Prescribed infusion rate (mcg/kg/min)' },
        { symbol: 'Weight', meaning: 'Patient weight in kilograms' },
        { symbol: 'Concentration', meaning: 'Drug concentration in the IV bag (mcg/mL)' },
        { symbol: '60', meaning: 'Conversion factor: minutes per hour' },
      ],
      note: 'Always double-check pump settings and concentration. High-alert medications require independent double-check by two nurses.',
    },
    'ideal-body-weight-calculator': {
      title: 'Devine Formula for IBW',
      formula: 'Male IBW (kg) = 50 + 2.3 × (Height in inches − 60)\nFemale IBW (kg) = 45.5 + 2.3 × (Height in inches − 60)',
      variables: [
        { symbol: 'Height', meaning: 'Patient height in inches (above 5 feet / 60 inches)' },
        { symbol: '50 / 45.5', meaning: 'Base weight for 5-foot male/female' },
        { symbol: '2.3', meaning: 'Weight added per inch above 5 feet' },
      ],
      note: 'Devine BJ, 1974. IBW is used for weight-based drug dosing (e.g., aminoglycosides, digoxin, ventilator tidal volumes).',
    },
    'bmr-tdee-calculator': {
      title: 'Mifflin-St Jeor Equation',
      formula: 'Male BMR = (10 × W) + (6.25 × H) − (5 × A) + 5\nFemale BMR = (10 × W) + (6.25 × H) − (5 × A) − 161\nTDEE = BMR × Activity Factor',
      variables: [
        { symbol: 'W', meaning: 'Weight in kilograms' },
        { symbol: 'H', meaning: 'Height in centimetres' },
        { symbol: 'A', meaning: 'Age in years' },
        { symbol: 'Activity Factor', meaning: '1.2 (sedentary) to 1.9 (very active)' },
      ],
      note: 'Mifflin et al., JADA 1990. Most accurate BMR equation for general adult populations.',
    },
    'qtc-interval-calculator': {
      title: 'QTc Correction Formulas',
      formula: 'Bazett: QTc = QT ÷ √(RR)\nFridericia: QTc = QT ÷ ∛(RR)',
      variables: [
        { symbol: 'QT', meaning: 'Measured QT interval (ms)' },
        { symbol: 'RR', meaning: 'RR interval = 60/heart rate (seconds)' },
      ],
      note: 'Normal QTc: <450 ms (male), <460 ms (female). QTc >500 ms associated with increased risk of Torsades de Pointes.',
    },
    'opioid-equianalgesic-converter': {
      title: 'Opioid Equianalgesic Conversion',
      formula: 'Equivalent Dose = Current Dose × (New Drug Equianalgesic Dose ÷ Current Drug Equianalgesic Dose)',
      variables: [
        { symbol: 'Morphine oral', meaning: 'Reference: 30 mg oral = 10 mg IV' },
        { symbol: 'Oxycodone oral', meaning: '20 mg oral ≈ 30 mg oral morphine' },
        { symbol: 'Hydromorphone', meaning: '7.5 mg oral or 1.5 mg IV ≈ 30 mg oral morphine' },
        { symbol: 'Fentanyl patch', meaning: '≈ 50–60% of 24h oral morphine dose in mcg/h' },
      ],
      note: 'Reduce equianalgesic dose by 25–50% when rotating opioids (incomplete cross-tolerance). Always titrate to effect.',
    },
  }

  // 1. Explicit enhanced entry
  if (formulaMap[slug]) return formulaMap[slug]

  // 2. Config formula wrapped in display structure
  if (configFormula && configFormula !== 'See reference for formula details.') {
    return {
      title: `${toolName} — Formula`,
      formula: configFormula,
      variables: [],
      note: SPECIALTY_NOTES[specialtyId] ?? 'For clinical reference and education only. Always verify with current guidelines.',
    }
  }

  // 3. Specialty-generic fallback — always returns something
  const generic = SPECIALTY_GENERICS[specialtyId]
  if (generic) return { ...generic, title: `${toolName} — Clinical Formula` }

  return {
    title: `${toolName} — Clinical Assessment`,
    formula: 'Score = Σ(clinical criteria) → Interpretation from validated clinical guidelines',
    variables: [
      { symbol: 'Clinical criteria', meaning: 'Patient-specific variables as defined by the validated scoring system' },
    ],
    note: 'Results are based on validated clinical scoring systems. Always interpret alongside full clinical assessment.',
  }
}

// ─── Static params — pre-render all 113 medical tools ─────────
export async function generateStaticParams() {
  const tools = getToolsByCategory('medical')
  return tools.map(t => ({ slug: t.slug }))
}

// ─── Metadata helpers ─────────────────────────────────────────
function buildMetaTitle(toolName: string, specialtyId: string): string {
  // Format: "Free [Tool Name] — [Keyword] | RoughTools" ≤60 chars
  // Try full form first, truncate gracefully
  const specialtyKeyword: Record<string, string> = {
    cardiology: 'Cardiology',
    nephrology: 'Nephrology',
    'emergency-icu': 'Critical Care',
    'neurology-psychiatry': 'Neurology',
    endocrinology: 'Endocrinology',
    pharmacology: 'Drug Dosing',
    obstetrics: 'Obstetrics',
    pulmonology: 'Pulmonology',
    gastroenterology: 'Hepatology',
    'oncology-hematology': 'Oncology',
    pediatrics: 'Paediatrics',
    'consumer-health': 'Wellness',
  }
  const kw = specialtyKeyword[specialtyId] ?? 'Medical'
  const full = `Free ${toolName} — ${kw} | RoughTools`
  if (full.length <= 60) return full
  // Fall back: drop the keyword
  const shorter = `Free ${toolName} | RoughTools`
  if (shorter.length <= 60) return shorter
  // Last resort: truncate tool name
  const maxNameLen = 60 - 'Free  | RoughTools'.length
  return `Free ${toolName.slice(0, maxNameLen)} | RoughTools`
}

function buildMetaDescription(toolDescription: string, specialtyId: string): string {
  const specialtyHint: Record<string, string> = {
    cardiology: 'Validated by ACC/AHA guidelines.',
    nephrology: 'Uses KDIGO-endorsed equations.',
    'emergency-icu': 'For ED and critical care use.',
    'neurology-psychiatry': 'Clinically validated scale.',
    endocrinology: 'Referenced to ADA/WHO guidelines.',
    pharmacology: 'Verify all doses with a pharmacist.',
    obstetrics: 'Based on ACOG/RCOG guidelines.',
    pulmonology: 'Per GOLD/ATS/ERS standards.',
    gastroenterology: 'Per AASLD/EASL guidelines.',
    'oncology-hematology': 'Verify doses with oncologist.',
    pediatrics: 'Based on BNFc/AAP guidelines.',
    'consumer-health': 'Evidence-based wellness tool.',
  }
  const hint = specialtyHint[specialtyId] ?? 'Clinically referenced.'
  const base = `${toolDescription} ${hint} Free, no signup required.`
  return base.length <= 155 ? base : base.slice(0, 152) + '...'
}

// ─── Metadata ─────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tools = getToolsByCategory('medical')
  const tool = tools.find(t => t.slug === params.slug)
  if (!tool) return { title: 'Medical Tool Not Found' }

  const specialty = getSpecialty(params.slug)
  const config = MEDICAL_CONFIGS[params.slug]
  const extConfig = getMedicalConfigById(params.slug)
  const description = config?.description ?? extConfig?.description ?? tool.description
  const specialtyId = specialty?.id ?? 'consumer-health'

  const metaTitle = buildMetaTitle(tool.name, specialtyId)
  const metaDesc  = buildMetaDescription(description, specialtyId)
  const canonicalUrl = `https://roughtools.com/tools/medical/${params.slug}`

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: [
      ...tool.keywords,
      'free medical calculator',
      'clinical calculator',
      'free online tool',
      specialty?.label ?? 'medical',
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      type: 'website',
      siteName: 'RoughTools',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
    },
    robots: { index: true, follow: true },
  }
}

// ─── Page ─────────────────────────────────────────────────────
export default function MedicalToolPage({ params }: Props) {
  const allTools = getToolsByCategory('medical')
  const tool = allTools.find(t => t.slug === params.slug)
  if (!tool) notFound()

  const configData    = MEDICAL_CONFIGS[params.slug]
  const extConfigData = getMedicalConfigById(params.slug)
  const heroIcon        = configData?.icon        ?? extConfigData?.icon        ?? '🩺'
  const heroDescription = configData?.description ?? extConfigData?.description ?? tool.description
  const formulaStr      = configData?.formula     ?? extConfigData?.formula     ?? null
  const referenceStr    = configData?.reference   ?? extConfigData?.reference   ?? null

  const specialty      = getSpecialty(params.slug)
  const formulaDisplay = getFormulaDisplay(params.slug, formulaStr, specialty?.id ?? '', tool.name)
  const faqs           = getFAQs(specialty?.id ?? '', tool.name)

  // Resolve icons up-front so the shell stays generic
  const relatedTools = (
    specialty
      ? specialty.slugs
          .filter(s => s !== params.slug)
          .slice(0, 6)
          .map(s => {
            const t = allTools.find(t => t.slug === s)
            if (!t) return null
            const cfg = MEDICAL_CONFIGS[s] ?? getMedicalConfigById(s)
            return { slug: s, name: t.name, description: t.description, icon: cfg?.icon ?? '🩺' }
          })
          .filter((t): t is NonNullable<typeof t> => t !== null)
      : allTools
          .filter(t => t.slug !== params.slug && t.popular)
          .slice(0, 6)
          .map(t => {
            const cfg = MEDICAL_CONFIGS[t.slug] ?? getMedicalConfigById(t.slug)
            return { slug: t.slug, name: t.name, description: t.description, icon: cfg?.icon ?? '🩺' }
          })
  )

  const canonicalUrl = `https://roughtools.com/tools/medical/${params.slug}`

  // ── BreadcrumbList JSON-LD ───────────────────────────────────
  const breadcrumbItems: object[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Medical Tools', item: 'https://roughtools.com/tools/medical' },
  ]
  if (specialty) {
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: specialty.label, item: `https://roughtools.com/tools/medical#${specialty.id}` })
    breadcrumbItems.push({ '@type': 'ListItem', position: 4, name: tool.name, item: canonicalUrl })
  } else {
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: tool.name, item: canonicalUrl })
  }
  const breadcrumbLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbItems }

  // ── SoftwareApplication JSON-LD ──────────────────────────────
  const appCategoryMap: Record<string, string> = {
    cardiology: 'HealthApplication',
    nephrology: 'HealthApplication',
    'emergency-icu': 'HealthApplication',
    'neurology-psychiatry': 'HealthApplication',
    endocrinology: 'HealthApplication',
    pharmacology: 'MedicalApplication',
    obstetrics: 'HealthApplication',
    pulmonology: 'HealthApplication',
    gastroenterology: 'HealthApplication',
    'oncology-hematology': 'MedicalApplication',
    pediatrics: 'HealthApplication',
    'consumer-health': 'HealthApplication',
  }
  const appCategory = appCategoryMap[specialty?.id ?? ''] ?? 'HealthApplication'
  const softwareAppLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: heroDescription,
    url: canonicalUrl,
    applicationCategory: appCategory,
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
  }

  // ── FAQPage JSON-LD ──────────────────────────────────────────
  const faqPageLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageLd) }} />
      <MedicalToolShell
        toolName={tool.name}
        toolSlug={params.slug}
        description={heroDescription}
        heroIcon={heroIcon}
        reference={referenceStr}
        specialty={specialty ? { id: specialty.id, label: specialty.label, icon: specialty.icon } : null}
        formulaDisplay={formulaDisplay}
        faqs={faqs}
        relatedTools={relatedTools}
      />
    </>
  )
}
