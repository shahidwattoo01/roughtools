'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import { ToolPageExtras } from '@/components/ToolPageExtras';

// Both lazy-loaded on the client — keeps them out of the RSC module graph
const MedicalCalculatorClient = dynamic(() => import('./MedicalCalculatorClient'), {
  ssr: false,
  loading: () => (
    <div className="mt-4 h-64 bg-gray-100 animate-pulse rounded-2xl" aria-hidden="true" />
  ),
});

const MedicalFAQSection = dynamic(() => import('./MedicalFAQClient'), {
  ssr: false,
  loading: () => (
    <div className="mt-10 space-y-3" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-xl" />
      ))}
    </div>
  ),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MedicalSpecialty {
  id: string;
  label: string;
  icon: string;
}

export interface MedicalFormulaDisplay {
  title: string;
  formula: string;
  variables: Array<{ symbol: string; meaning: string }>;
  note: string;
}

export interface MedicalRelatedTool {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface MedicalToolShellProps {
  toolName: string;
  toolSlug: string;
  description: string;
  heroIcon: string;
  reference: string | null;
  specialty: MedicalSpecialty | null;
  formulaDisplay: MedicalFormulaDisplay;
  faqs: Array<{ q: string; a: string }>;
  relatedTools: MedicalRelatedTool[];
}

// ─── Static content maps (specialty → section data) ───────────────────────────
// These templates apply to every tool in the specialty, covering all 113 tools
// via the single dynamic route without needing per-tool data.

type HowToStep = { name: string; text: string };
type WhenToUseCard = { icon: string; title: string; description: string };
type QuickRefRow = { input: string; description: string; example: string };

const HOW_TO_STEPS: Record<string, HowToStep[]> = {
  cardiology: [
    {
      name: 'Enter patient demographics',
      text: "Input the patient's age, sex, and any relevant baseline characteristics. Many cardiovascular scoring tools weight age and sex heavily, so accuracy matters.",
    },
    {
      name: 'Add clinical measurements',
      text: 'Enter blood pressure readings, lipid panel values (total cholesterol, HDL-C, LDL-C), or ECG measurements as required by the specific scoring tool.',
    },
    {
      name: 'Input risk factor data',
      text: 'Record smoking status, diabetes diagnosis, family history of premature CVD, and current medications (especially antihypertensives and statins) where prompted.',
    },
    {
      name: 'Calculate and interpret the score',
      text: "Click Calculate to get the risk score or classification. Review the output against the tool's validated clinical cutoffs — displayed alongside the result.",
    },
    {
      name: 'Apply to clinical decision-making',
      text: 'Use the result in shared decision-making with the patient. Discuss treatment thresholds, lifestyle modification targets, and appropriate follow-up intervals per current guidelines (ACC/AHA, ESC).',
    },
  ],
  nephrology: [
    {
      name: 'Obtain the serum creatinine value',
      text: 'Use the most recent stable serum creatinine from a reliable laboratory. Avoid using creatinine measured during acute illness, as it will not reflect true baseline kidney function.',
    },
    {
      name: 'Enter patient demographics',
      text: "Input the patient's age, sex, and body weight. Different equations require different variables: CKD-EPI 2021 needs age and sex; Cockcroft-Gault also needs weight.",
    },
    {
      name: 'Select the appropriate formula',
      text: 'Choose CKD-EPI 2021 for CKD staging and epidemiological reporting. Use Cockcroft-Gault for drug dose adjustment, as it was the equation used in most pharmacokinetic studies.',
    },
    {
      name: 'Review the result and CKD stage',
      text: 'The eGFR is automatically classified into KDIGO CKD stages (G1–G5) and combined with albuminuria to determine overall risk category.',
    },
    {
      name: 'Adjust drug doses if indicated',
      text: 'For renally-cleared medications, use the CrCl result to check dose adjustment requirements in the product prescribing information or a drug reference such as Lexicomp or Micromedex.',
    },
  ],
  'emergency-icu': [
    {
      name: 'Gather the required clinical parameters',
      text: 'Collect the physiologic measurements required by the scoring tool — vital signs, Glasgow Coma Scale, laboratory values (creatinine, bilirubin, platelets, lactate), and ventilatory settings as applicable.',
    },
    {
      name: 'Enter values at the appropriate time point',
      text: 'Most ICU severity scores specify when values should be collected (e.g., worst values in the first 24 hours for APACHE-II, or daily values for SOFA). Use the correct time window.',
    },
    {
      name: 'Calculate the score',
      text: 'Enter all required values and click Calculate. The tool automatically sums the component scores and applies the validated outcome table.',
    },
    {
      name: 'Interpret the result',
      text: "Review the predicted mortality or severity category. Compare to published data from the scoring system's validation studies to contextualise the result for the patient's condition.",
    },
    {
      name: 'Track serially and document',
      text: 'For longitudinal scores like SOFA and APACHE-II, recalculate daily to track disease trajectory. A rising score suggests deterioration; a falling score indicates improvement.',
    },
  ],
  'neurology-psychiatry': [
    {
      name: 'Select or administer the assessment',
      text: 'For clinician-administered scales (GCS, NIHSS), perform the structured assessment at the bedside using the standardised protocol. For patient-reported tools (PHQ-9, GAD-7), have the patient complete the questionnaire.',
    },
    {
      name: 'Enter each item response',
      text: 'Input the score or response for each individual item. Refer to the standardised anchor descriptions to ensure accurate scoring — small differences in scoring can change the severity category.',
    },
    {
      name: 'Calculate the total score',
      text: 'The tool sums item scores and displays the total. For multi-domain scales, domain scores are also calculated separately.',
    },
    {
      name: 'Apply validated severity cutoffs',
      text: 'Review the output against published cutoffs (e.g., PHQ-9 ≥10 = moderate depression; GCS ≤8 = coma). The tool displays the appropriate classification alongside the score.',
    },
    {
      name: 'Document and plan follow-up',
      text: 'Record the score and date in the clinical notes. For screening tools, a positive result triggers referral for comprehensive assessment — the score alone is not diagnostic.',
    },
  ],
  endocrinology: [
    {
      name: 'Enter anthropometric measurements',
      text: 'Input height and weight in your preferred units (metric or imperial). For BMI and IBW calculations, ensure measurements are taken without shoes and with minimal clothing for accuracy.',
    },
    {
      name: 'Add laboratory values',
      text: 'For metabolic calculations, enter HbA1c, fasting glucose, lipid panel, or hormone values as required. Use results from a reliable laboratory and check the date — older values may not reflect current status.',
    },
    {
      name: 'Specify activity level or clinical context',
      text: "For TDEE calculations, select the activity level that best represents the patient's typical week. For steroid conversions, confirm the route of administration (oral, IV, inhaled).",
    },
    {
      name: 'Review the calculated result',
      text: 'The tool returns the metabolic index, risk classification, or converted dose with interpretation. Reference ranges and evidence-based thresholds are displayed alongside the result.',
    },
    {
      name: 'Contextualise with clinical presentation',
      text: "No metabolic calculator replaces a full clinical assessment. Review the result alongside the patient's symptoms, examination findings, and medication list before making management decisions.",
    },
  ],
  pharmacology: [
    {
      name: 'Confirm patient weight and renal function',
      text: "Obtain a recent, accurate body weight. For renally-cleared drugs, calculate CrCl using Cockcroft-Gault first. Determine whether to use actual, ideal, or adjusted body weight per the drug's protocol.",
    },
    {
      name: 'Enter the prescribed dose parameter',
      text: 'Input the dose in mg/kg, mg/m², or the target concentration as specified in the drug protocol or current clinical guidelines. Double-check the units before proceeding.',
    },
    {
      name: 'Calculate the dose',
      text: 'The tool computes the single dose, frequency schedule, and total daily dose. For complex pharmacokinetic tools (vancomycin, aminoglycosides), loading and maintenance doses are calculated separately.',
    },
    {
      name: 'Check against maximum dose limits',
      text: "Review the calculated dose against the manufacturer's maximum dose and any weight or renal thresholds specified in the protocol. Flag any dose that exceeds recommended limits before prescribing.",
    },
    {
      name: 'Verify with a pharmacist',
      text: 'All drug doses calculated by this tool must be independently verified by a licensed pharmacist before administration, particularly for high-alert medications (opioids, anticoagulants, chemotherapy, vancomycin).',
    },
  ],
  obstetrics: [
    {
      name: 'Confirm the last menstrual period date',
      text: 'Enter the first day of the last normal menstrual period (LMP). Ensure the date is reliable — a patient with irregular cycles or uncertainty about the LMP date will require ultrasound dating.',
    },
    {
      name: 'Enter clinical measurements as required',
      text: 'For fetal weight estimation, input ultrasound biometric measurements (BPD, HC, AC, FL). For Bishop Score, enter the cervical examination findings at the time of assessment.',
    },
    {
      name: 'Calculate the obstetric parameter',
      text: 'The tool applies the validated formula and returns the gestational age, EDD, fetal weight estimate, or clinical score. The result is displayed with the applicable reference range.',
    },
    {
      name: 'Compare with ultrasound findings',
      text: 'For pregnancy dating, compare the LMP-derived EDD with first-trimester ultrasound dating. If the discordance is >5–7 days in the first trimester, the ultrasound date takes precedence per ACOG guidelines.',
    },
    {
      name: 'Document and plan antenatal care',
      text: "Record the calculated GA and EDD in the patient's obstetric record. Gestational age determines the schedule for antenatal screening tests, growth scans, and delivery planning.",
    },
  ],
  pulmonology: [
    {
      name: 'Obtain spirometry or laboratory values',
      text: 'Enter FEV1, FVC, and other spirometric measurements from a formal lung function test. For ABG interpretation, enter arterial blood gas values with the FiO2 at the time of sampling.',
    },
    {
      name: 'Add patient demographics',
      text: 'Input age, sex, and height for spirometry interpretation. Predicted values are calculated using age/sex/height reference equations (ATS/ERS GLI 2012).',
    },
    {
      name: 'Select severity classification',
      text: 'For GOLD COPD staging or PSI scoring, enter additional clinical variables. The tool automatically calculates the appropriate severity class.',
    },
    {
      name: 'Interpret the result',
      text: 'Review FEV1/FVC ratio, % predicted values, and severity classification. The tool displays the clinical interpretation using ATS/ERS and GOLD guideline criteria.',
    },
    {
      name: 'Plan respiratory management',
      text: 'Use the result to guide inhaler selection, oxygen prescription, referral for pulmonology evaluation, or lung cancer screening eligibility assessment.',
    },
  ],
  gastroenterology: [
    {
      name: 'Obtain current laboratory values',
      text: "Enter the most recent serum bilirubin, albumin, INR/PT, and creatinine from a stable clinical state. Hepatic scores (MELD, Child-Pugh) are most accurate when values reflect the patient's baseline — not during acute decompensation.",
    },
    {
      name: 'Assess clinical parameters',
      text: 'For Child-Pugh scoring, grade ascites severity (absent/mild/moderate) and hepatic encephalopathy grade (none/1–2/3–4) based on clinical examination findings.',
    },
    {
      name: 'Calculate the hepatic score',
      text: 'Enter all required variables and click Calculate. The tool returns the MELD, Child-Pugh class, or GI severity score with the validated prognostic interpretation.',
    },
    {
      name: 'Interpret against clinical thresholds',
      text: 'Review the score against published outcome data. MELD ≥15 indicates transplant listing; Child-Pugh class C signals decompensated cirrhosis with significant 1-year mortality.',
    },
    {
      name: 'Discuss with gastroenterology or hepatology',
      text: 'For MELD scores suggesting transplant candidacy or Child-Pugh class C, refer promptly to a hepatologist. Transplant evaluation and listing requires multidisciplinary team assessment.',
    },
  ],
  'oncology-hematology': [
    {
      name: 'Confirm height and weight',
      text: "Use the patient's measured height and actual body weight from the day of treatment. BSA is highly sensitive to weight changes — always use measurements taken at the treatment visit, not values from previous cycles.",
    },
    {
      name: 'Enter the protocol dose',
      text: 'Input the chemotherapy dose in mg/m² as specified in the treatment protocol. If multiple agents are included, calculate BSA-based doses for each drug separately.',
    },
    {
      name: 'Calculate the total dose',
      text: 'The tool multiplies BSA × protocol dose to give the total dose in mg. For some protocols, doses are capped at a maximum regardless of BSA — check the protocol for any dose-capping rules.',
    },
    {
      name: 'Review haematological parameters',
      text: "For ANC calculation, enter CBC differential counts. Check that ANC, platelet count, and renal/hepatic function meet the protocol's criteria for treatment administration before proceeding.",
    },
    {
      name: 'Confirm with oncologist and pharmacist',
      text: 'All chemotherapy doses must be verified by the treating oncologist and independently checked by an oncology pharmacist before preparation and administration. This is a mandatory safety requirement.',
    },
  ],
  pediatrics: [
    {
      name: "Record the child's current weight",
      text: "Use the child's weight measured at the current visit in kilograms. For neonates and infants, use the most recent measured weight. Never estimate weight for drug dosing calculations in paediatrics.",
    },
    {
      name: 'Enter age and sex',
      text: "For growth chart and developmental tools, enter the child's date of birth and current date. For premature infants, use corrected (adjusted) gestational age for growth plotting until the child reaches 2 years corrected age.",
    },
    {
      name: 'Input clinical measurements',
      text: 'For growth charts, enter height and head circumference. For jaundice tools, enter total serum bilirubin and gestational age at birth. For PECARN, enter clinical findings from examination.',
    },
    {
      name: 'Review the calculated dose or percentile',
      text: 'The tool returns the weight-based dose, growth percentile, or clinical risk classification. Cross-reference against the reference chart or published dose table for confirmation.',
    },
    {
      name: 'Confirm with a paediatrician or pharmacist',
      text: 'All paediatric doses must be confirmed by the treating paediatrician or a pharmacist experienced in paediatric dosing before administration. Parents should not adjust doses without professional guidance.',
    },
  ],
  'consumer-health': [
    {
      name: 'Select the health metric you want to calculate',
      text: 'Choose from BMI, daily calorie needs, target heart rate zones, daily water intake, sleep cycles, or healthcare cost estimates. Each tool focuses on a specific wellness metric.',
    },
    {
      name: 'Enter your personal measurements',
      text: 'Input age, sex, height, weight, and activity level as prompted. Use accurate, recent measurements for the most reliable results. Estimates based on approximations are less meaningful.',
    },
    {
      name: 'Review your result and category',
      text: 'The tool displays your calculated metric alongside the relevant reference range (e.g., WHO BMI categories, ACSM heart rate zones, USDA dietary guidelines).',
    },
    {
      name: 'Understand what the number means',
      text: 'Each result page explains how to interpret your score in plain language, including what the number means for your health, what range is considered healthy, and when to take action.',
    },
    {
      name: 'Consult a healthcare provider for next steps',
      text: 'These tools are for personal health education and awareness. If your result is outside the healthy range, consult a qualified healthcare provider before making changes to diet, exercise, or medications.',
    },
  ],
};

const WHEN_TO_USE_CARDS: Record<string, WhenToUseCard[]> = {
  cardiology: [
    {
      icon: '🩺',
      title: 'Annual cardiovascular risk screening',
      description:
        "Calculate a patient's 10-year CVD risk using Framingham or ASCVD during preventive care visits to guide statin and antihypertensive therapy decisions.",
    },
    {
      icon: '💊',
      title: 'Anticoagulation decision-making in AF',
      description:
        'Use CHA₂DS₂-VASc to determine stroke risk and HAS-BLED to assess bleeding risk before initiating anticoagulation in patients with atrial fibrillation.',
    },
    {
      icon: '🚨',
      title: 'Acute coronary syndrome risk stratification',
      description:
        'Apply TIMI, GRACE, or HEART score in the ED to risk-stratify chest pain patients for early discharge, observation, or urgent catheterisation.',
    },
    {
      icon: '💉',
      title: 'QTc monitoring before drug initiation',
      description:
        'Check QTc interval before prescribing QT-prolonging medications (antipsychotics, antiarrhythmics, fluoroquinolones) to identify patients at risk for Torsades de Pointes.',
    },
    {
      icon: '📊',
      title: 'Hypertension classification and targets',
      description:
        'Classify blood pressure per ACC/AHA 2017 guidelines to determine treatment thresholds (Stage 1 vs 2) and guide target SBP goals based on cardiovascular risk.',
    },
  ],
  nephrology: [
    {
      icon: '🫘',
      title: 'CKD staging and monitoring',
      description:
        'Calculate eGFR to stage chronic kidney disease (KDIGO G1–G5) and monitor disease progression at each outpatient visit.',
    },
    {
      icon: '💊',
      title: 'Renal drug dose adjustment',
      description:
        'Use CrCl (Cockcroft-Gault) before prescribing renally-cleared antibiotics, anticoagulants, or diabetes medications to calculate dose-adjusted prescriptions.',
    },
    {
      icon: '🔬',
      title: 'AKI assessment',
      description:
        'Calculate eGFR change from baseline during hospital admission to diagnose and stage acute kidney injury per KDIGO AKI criteria.',
    },
    {
      icon: '💉',
      title: 'Pre-contrast nephropathy risk assessment',
      description:
        'Assess baseline kidney function before IV contrast administration to identify patients requiring pre-hydration protocols or contrast dose reduction.',
    },
    {
      icon: '🏥',
      title: 'Dialysis adequacy monitoring',
      description:
        'Calculate Kt/V for haemodialysis patients to assess whether the delivered dose meets the minimum adequacy target (spKt/V ≥1.4 per KDOQI guidelines).',
    },
  ],
  'emergency-icu': [
    {
      icon: '🚑',
      title: 'Triage and initial risk stratification',
      description:
        'Apply qSOFA or NEWS score at triage to rapidly identify patients at high risk of clinical deterioration requiring urgent escalation.',
    },
    {
      icon: '🏥',
      title: 'ICU admission decisions',
      description:
        'Use APACHE-II or SOFA scores to quantify severity of illness, guide ICU vs ward admission, and provide prognostic information to families.',
    },
    {
      icon: '📈',
      title: 'Daily ICU progress tracking',
      description:
        'Recalculate SOFA score daily to track organ failure trajectory — a rising score indicates deterioration; a ≥2-point increase from baseline satisfies Sepsis-3 criteria.',
    },
    {
      icon: '🩸',
      title: 'Sepsis screening',
      description:
        'Apply qSOFA (≥2 = high risk) or full Sepsis-3 criteria when infection is suspected. Early identification enables timely antibiotic administration and fluid resuscitation.',
    },
    {
      icon: '💧',
      title: 'Fluid resuscitation calculation',
      description:
        'Use the Parkland formula for burns, Holliday-Segar for paediatric maintenance, or MAP targets to calculate and guide fluid therapy in critically ill patients.',
    },
  ],
  'neurology-psychiatry': [
    {
      icon: '🧠',
      title: 'Acute stroke assessment',
      description:
        'Apply NIHSS immediately on stroke presentation to quantify neurological deficit, guide tPA eligibility determination, and document baseline severity for monitoring.',
    },
    {
      icon: '📋',
      title: 'Depression and anxiety screening',
      description:
        'Administer PHQ-9 and GAD-7 at each clinic visit to screen for depression and anxiety, monitor treatment response, and document progress over time.',
    },
    {
      icon: '🚨',
      title: 'Trauma and altered consciousness assessment',
      description:
        'Use GCS in the ED and ICU to grade consciousness level, guide airway management decisions (GCS ≤8), and communicate severity between providers.',
    },
    {
      icon: '🍷',
      title: 'Alcohol withdrawal risk assessment',
      description:
        'Calculate CIWA-Ar score to determine severity of alcohol withdrawal, guide benzodiazepine dosing, and assess the need for ICU-level monitoring.',
    },
    {
      icon: '😴',
      title: 'Sleepiness and cognitive screening',
      description:
        'Use Epworth Sleepiness Scale to screen for excessive daytime sleepiness and MMSE for cognitive decline — both guide referrals for sleep studies or neuropsychological evaluation.',
    },
  ],
  endocrinology: [
    {
      icon: '🍬',
      title: 'Diabetes management monitoring',
      description:
        'Convert HbA1c to estimated average glucose to make A1c results more meaningful to patients. Use alongside fasting glucose to monitor glycaemic control between visits.',
    },
    {
      icon: '⚖️',
      title: 'Obesity assessment and treatment planning',
      description:
        'Calculate BMI to classify obesity severity and set weight loss goals. Combine with waist circumference and body fat percentage for a comprehensive metabolic risk assessment.',
    },
    {
      icon: '🔥',
      title: 'Calorie prescription for weight management',
      description:
        'Use TDEE calculation to establish a patient-specific calorie target for weight loss (deficit of 500–750 kcal/day below TDEE) or muscle gain (surplus of 250–500 kcal/day).',
    },
    {
      icon: '💊',
      title: 'Steroid equivalency for dose conversion',
      description:
        'Use the steroid conversion calculator when switching between corticosteroid preparations to maintain equivalent anti-inflammatory potency and avoid adrenal crisis.',
    },
    {
      icon: '🩻',
      title: 'Ideal body weight for drug dosing',
      description:
        'Calculate IBW before dosing aminoglycosides, digoxin, vancomycin, or setting ventilator tidal volumes — many protocols specify IBW rather than actual body weight.',
    },
  ],
  pharmacology: [
    {
      icon: '💊',
      title: 'Weight-based paediatric and adult dosing',
      description:
        'Calculate exact doses for weight-based medications (antibiotics, anticoagulants, sedatives) when precision matters for therapeutic effect and toxicity avoidance.',
    },
    {
      icon: '🏥',
      title: 'ICU infusion programming',
      description:
        "Use the IV drip rate calculator to programme mcg/kg/min infusions (dopamine, norepinephrine, propofol) accurately for each patient's weight and desired dose.",
    },
    {
      icon: '🔄',
      title: 'Opioid rotation in chronic pain',
      description:
        'Calculate equianalgesic doses when switching between opioids in chronic pain patients. Always reduce the calculated dose by 25–50% to account for incomplete cross-tolerance.',
    },
    {
      icon: '🧫',
      title: 'Vancomycin AUC-guided dosing',
      description:
        'Use vancomycin dosing calculators to target an AUC/MIC of 400–600 per ASHP/IDSA guidelines, replacing the older trough-only approach to improve efficacy and reduce nephrotoxicity.',
    },
    {
      icon: '⚕️',
      title: 'Renal dose adjustment before prescribing',
      description:
        'Calculate CrCl before prescribing renally-cleared medications (metformin, DOACs, antibiotics) to determine whether full dose, reduced dose, or withholding is appropriate.',
    },
  ],
  obstetrics: [
    {
      icon: '🤰',
      title: 'Pregnancy dating and EDD confirmation',
      description:
        'Calculate EDD from LMP at the first antenatal visit. Compare with first-trimester ultrasound dating — if discordance >5–7 days, use ultrasound date per ACOG guidelines.',
    },
    {
      icon: '📏',
      title: 'Gestational age for clinical decisions',
      description:
        'Calculate exact gestational age in weeks and days when making decisions about antenatal screening timing, viability thresholds, corticosteroid administration, and delivery planning.',
    },
    {
      icon: '🏥',
      title: 'Labour induction readiness assessment',
      description:
        'Calculate Bishop Score before cervical ripening or induction to predict likelihood of successful induction. A score ≥8 indicates a favourable cervix with high success probability.',
    },
    {
      icon: '⚖️',
      title: 'Antenatal weight gain monitoring',
      description:
        'Track gestational weight gain against IOM guidelines (based on pre-pregnancy BMI) at each visit. Excessive gain increases GDM, hypertension, and macrosomia risk; insufficient gain affects fetal growth.',
    },
    {
      icon: '🧪',
      title: 'IVF success rate estimation',
      description:
        'Use the IVF success rate calculator before initiating fertility treatment to set realistic expectations and guide clinical counselling about the number of treatment cycles likely needed.',
    },
  ],
  pulmonology: [
    {
      icon: '🫁',
      title: 'COPD diagnosis and severity grading',
      description:
        'Interpret FEV1/FVC and % predicted FEV1 to diagnose airflow obstruction and classify GOLD severity (1–4) for inhaler selection and pulmonary rehabilitation referral.',
    },
    {
      icon: '📊',
      title: 'Lung cancer screening eligibility',
      description:
        'Calculate pack-years to identify patients eligible for annual low-dose CT screening — USPSTF recommends screening adults 50–80 with ≥20 pack-year history currently smoking or quit within 15 years.',
    },
    {
      icon: '🚨',
      title: 'ARDS severity classification',
      description:
        'Calculate P/F ratio from PaO2 and FiO2 to classify ARDS as mild (200–300), moderate (100–200), or severe (<100) per the Berlin Definition, guiding prone positioning and ECMO decisions.',
    },
    {
      icon: '🏥',
      title: 'Community-acquired pneumonia severity',
      description:
        'Apply PSI/PORT or CURB-65 score to determine appropriate treatment setting: outpatient (Class I–II), general ward (Class III–IV), or ICU admission (Class V / CURB-65 ≥3).',
    },
    {
      icon: '🌬️',
      title: 'Peak flow monitoring in asthma',
      description:
        'Track peak flow as percentage of personal best to classify asthma control (>80% green, 50–80% yellow, <50% red zone) and guide step-up or step-down therapy decisions.',
    },
  ],
  gastroenterology: [
    {
      icon: '🫀',
      title: 'Liver transplant listing and allocation',
      description:
        'Calculate MELD score to assess candidacy for liver transplant listing and determine organ allocation priority. MELD ≥15 is the general threshold for listing in most centres.',
    },
    {
      icon: '📊',
      title: 'Cirrhosis severity assessment',
      description:
        'Use Child-Pugh score to classify cirrhosis severity (A/B/C) at each outpatient visit, guide prophylaxis decisions (varices, SBP), and estimate 1-year survival.',
    },
    {
      icon: '🔬',
      title: 'Ascites aetiology differentiation',
      description:
        'Calculate SAAG from simultaneous serum and ascitic fluid albumin to distinguish portal hypertension-related ascites (SAAG ≥1.1) from non-portal causes (SAAG <1.1).',
    },
    {
      icon: '🚨',
      title: 'Acute pancreatitis severity prediction',
      description:
        "Apply Ranson's Criteria at admission and 48 hours to predict severe acute pancreatitis requiring ICU monitoring, aggressive fluid resuscitation, and early enteral nutrition.",
    },
    {
      icon: '🏥',
      title: 'Pre-procedure liver function assessment',
      description:
        'Calculate Child-Pugh or MELD score before endoscopy, surgery, or procedures in cirrhotic patients to quantify procedural risk and guide anaesthetic planning.',
    },
  ],
  'oncology-hematology': [
    {
      icon: '💉',
      title: 'Chemotherapy dose calculation',
      description:
        'Calculate BSA-based chemotherapy doses at the start of each treatment cycle using current weight. Re-verify if weight has changed ≥10% since the last cycle — dose modification may be required.',
    },
    {
      icon: '🩸',
      title: 'Febrile neutropenia risk assessment',
      description:
        'Calculate ANC from CBC differential to diagnose neutropenia (ANC <1500) and febrile neutropenia (ANC <500 + fever). Febrile neutropenia is an oncologic emergency requiring immediate antibiotic treatment.',
    },
    {
      icon: '📋',
      title: 'Staging and prognosis counselling',
      description:
        'Use TNM staging or disease-specific scoring systems to classify tumour stage, communicate prognosis to patients, and select treatment protocols appropriate for the stage.',
    },
    {
      icon: '🔄',
      title: 'Anticoagulation monitoring in cancer',
      description:
        'Convert INR/PT to confirm therapeutic range in cancer patients on vitamin K antagonists, who have higher lability due to malnutrition, drug interactions, and hepatic involvement.',
    },
    {
      icon: '🏥',
      title: 'Transfusion threshold decisions',
      description:
        'Calculate blood transfusion volume (mL = target rise × weight × 3 for RBCs) to order the correct unit volume and avoid circulatory overload, particularly in elderly or cardiac patients.',
    },
  ],
  pediatrics: [
    {
      icon: '👶',
      title: 'Routine well-child growth monitoring',
      description:
        'Plot height, weight, and head circumference on WHO/CDC growth charts at each well-child visit. Identify children falling across centile lines for early investigation of growth faltering or excess.',
    },
    {
      icon: '💊',
      title: 'Antipyretic dosing at every fever visit',
      description:
        'Calculate exact paracetamol and ibuprofen doses by current weight before each fever visit to avoid both under-dosing (ineffective) and overdosing (hepatotoxicity risk).',
    },
    {
      icon: '🏥',
      title: 'PICU and emergency drug dosing',
      description:
        'Use the paediatric emergency drug calculator to pre-calculate weight-based doses of resuscitation drugs (adrenaline, atropine, glucose) before a code to eliminate calculation errors under pressure.',
    },
    {
      icon: '🍼',
      title: 'Neonatal jaundice management',
      description:
        'Apply the Bhutani nomogram to total serum bilirubin at specific ages (in hours) to identify neonates at high risk of requiring phototherapy before discharge.',
    },
    {
      icon: '📈',
      title: 'Developmental milestone assessment',
      description:
        'Calculate corrected gestational age for preterm infants before assessing developmental milestones. Failure to correct leads to false concerns about delay in premature infants.',
    },
  ],
  'consumer-health': [
    {
      icon: '⚖️',
      title: 'Annual health check self-assessment',
      description:
        'Calculate BMI, body fat percentage, and waist-to-hip ratio as part of an annual health self-assessment to track trends and identify changes that warrant a GP visit.',
    },
    {
      icon: '🏋️',
      title: 'Setting weight loss or fitness goals',
      description:
        'Use TDEE and BMI tools to establish a science-based calorie target and a healthy goal weight range before starting a diet or exercise programme.',
    },
    {
      icon: '❤️',
      title: 'Personalising exercise intensity',
      description:
        'Calculate your maximum heart rate and aerobic training zones (50–85% HRmax) to ensure cardiovascular workouts are effective and safe for your fitness level.',
    },
    {
      icon: '💧',
      title: 'Hydration planning',
      description:
        'Calculate daily water intake needs based on weight and activity level. Increase by 500–750 mL for every hour of vigorous exercise or during hot weather.',
    },
    {
      icon: '💰',
      title: 'Healthcare cost planning',
      description:
        'Use medical cost estimators to budget for health insurance premiums, procedures, and ongoing medication costs to avoid unexpected out-of-pocket expenses.',
    },
  ],
};

const PRO_TIPS: Record<string, string[]> = {
  cardiology: [
    'Cardiovascular risk scores provide population-level probability estimates, not individual certainty. A 10% 10-year risk means 10 out of 100 similar patients will have an event — not that this specific patient will. Use scores to inform, not replace, clinical judgment.',
    'Always use multiple tools in high-risk decision-making. CHA₂DS₂-VASc alone determines anticoagulation candidacy in AF, but HAS-BLED should always be calculated alongside it to balance stroke prevention against bleeding risk before prescribing an anticoagulant.',
    'Trend scores over time rather than focusing on a single measurement. A patient whose Framingham risk has risen from 8% to 14% over 5 years despite stable treatment may warrant more aggressive intervention than a patient with a stable 15% risk.',
    'Be aware of ethnicity-specific calibration issues with cardiovascular scores. Framingham and ASCVD calculators were primarily derived from North American white cohorts and may overestimate risk in some Asian populations and underestimate it in South Asian populations.',
  ],
  nephrology: [
    'Never use eGFR calculated during an acute kidney injury for drug dosing or CKD staging. eGFR formulas assume steady-state creatinine — during AKI, creatinine is still rising and the calculated eGFR will significantly overestimate true kidney function.',
    "For obese patients requiring weight-based drug dosing via Cockcroft-Gault, use adjusted body weight (ABW) rather than actual body weight for most drugs: ABW = IBW + 0.4 × (Actual weight − IBW). Check the specific drug's dosing guidelines, as some drugs use actual weight even in obesity.",
    'Serum creatinine can be falsely low in elderly, malnourished, or cachectic patients despite significantly reduced kidney function. A 75-year-old with Scr 0.9 mg/dL may have an eGFR of only 55 mL/min — what appears "normal" creatinine may still indicate CKD G3a.',
    'CKD staging requires both eGFR AND urine albumin-to-creatinine ratio (UACR). A patient with eGFR 65 (G2) and UACR ≥300 mg/g is at very high risk — the same as G4 CKD without albuminuria. Never stage CKD from eGFR alone.',
  ],
  'emergency-icu': [
    'ICU severity scores (APACHE-II, SOFA) were validated on populations, not individuals. A SOFA score of 10 predicts a mortality probability — it does not determine individual outcome. Use scores for prognostication and communication, not as binary treatment thresholds.',
    'The Sequential Organ Failure Assessment (SOFA) identifies sepsis-associated organ dysfunction. A SOFA score increase of ≥2 points from baseline in the context of suspected infection satisfies Sepsis-3 criteria, even if the patient does not appear critically ill at first glance.',
    'For GCS assessment, always score each component separately (E + V + M) rather than just the total. A GCS of 8 could be E2V2M4 (significant verbal deficit) or E4V1M3 (intubated with good eye opening) — these have different clinical implications.',
    'qSOFA (≥2 of: altered mentation, RR ≥22/min, SBP ≤100 mmHg) is a rapid bedside screening tool, not a diagnostic criterion for sepsis. Its sensitivity is lower than SOFA but it requires no laboratory values and can be applied in seconds at triage.',
  ],
  'neurology-psychiatry': [
    'Psychiatric screening tools are dimensional assessments, not diagnostic instruments. A PHQ-9 score of 15 (moderately severe) does not diagnose major depressive disorder — it indicates the need for a structured clinical interview using DSM-5 criteria to confirm diagnosis and rule out bipolar disorder.',
    'The Glasgow Coma Scale should always be recorded as its three components (E/V/M), not just the total. "GCS 8" is ambiguous — "GCS E2V2M4" communicates exactly what is and is not preserved. For intubated patients, record the verbal component as "T" (e.g., E3VTM5).',
    'The NIHSS is highly assessor-dependent and should be performed by trained, certified observers for research and treatment decisions. For non-certified observers, it is a useful clinical framework but scores may vary by up to 2–3 points between raters.',
    'For PHQ-9 and GAD-7, the clinical significance of score changes matters more than absolute values. A reduction of ≥5 points in PHQ-9 is generally considered a clinically meaningful response to treatment. Track changes at 4–6-week intervals to assess treatment response.',
  ],
  endocrinology: [
    'BMI has well-documented limitations — it does not measure body fat percentage or distribution. A muscular athlete can have an "obese" BMI despite low body fat. Conversely, a "normal" BMI does not exclude metabolic syndrome in someone with central adiposity. Always combine BMI with waist circumference.',
    'The Mifflin-St Jeor equation is more accurate than the Harris-Benedict equation for estimating BMR in modern populations. However, all BMR/TDEE equations have ±200–300 kcal/day variability at the individual level. Adjust calorie targets based on actual weight trajectory over 2–3 weeks, not just the calculated target.',
    'When converting between corticosteroids, remember that mineralocorticoid potency (fluid/sodium retention) is NOT equivalent to anti-inflammatory potency. Prednisolone has significant mineralocorticoid activity; dexamethasone has essentially none. Consider both properties when selecting a steroid for a specific indication.',
    'For the FINDRISC diabetes risk score, a score ≥15 (high risk) suggests a 1 in 6 chance of developing type 2 diabetes within 10 years. These patients benefit most from structured lifestyle intervention — evidence shows lifestyle programmes can reduce T2DM incidence by 50–60% in high-risk individuals.',
  ],
  pharmacology: [
    'For aminoglycosides (gentamicin, tobramycin) and vancomycin, the choice of body weight is critical. Use actual body weight for lean patients, adjusted body weight for obese patients (ABW = IBW + 0.4 × excess weight), and IBW for volume of distribution estimations. Failure to use the correct weight is a leading cause of aminoglycoside toxicity.',
    'Opioid equianalgesic conversions are population-derived averages with high interindividual variability due to differences in metabolism (CYP450 genotype), receptor sensitivity, and cross-tolerance. Always reduce the calculated equianalgesic dose by 25–50% when initiating a new opioid rotation, then titrate upward based on pain response.',
    'AUC-guided vancomycin dosing has replaced trough monitoring in most guidelines. Target AUC/MIC of 400–600 mg·h/L (assuming MIC ≤1 mg/L). Trough-only monitoring led to nephrotoxicity (high troughs) or treatment failure (low troughs). Bayesian software significantly improves dose prediction accuracy.',
    "For renal dose adjustment, always use Cockcroft-Gault CrCl (not CKD-EPI eGFR) when the drug's pharmacokinetic studies were conducted before CKD-EPI became standard. Most antibiotic, anticoagulant, and diabetic medication dosing trials used Cockcroft-Gault — using eGFR for these drugs can lead to inappropriate dose reductions.",
  ],
  obstetrics: [
    "Naegele's Rule (EDD = LMP + 280 days) assumes a regular 28-day cycle with ovulation on day 14. For patients with cycles longer than 28 days, the EDD should be adjusted: add the difference between the patient's cycle length and 28 days. For example, a patient with 35-day cycles should have EDD adjusted forward by 7 days.",
    'First-trimester ultrasound CRL dating is more accurate than LMP dating and should take precedence if the discordance is >5 days at 9–11 weeks, or >7 days at 11–14 weeks. ACOG recommends using ultrasound dates once assigned, even if LMP later becomes available.',
    'For the Bishop Score, effacement is often misscored. It reflects the percentage of cervical shortening relative to the normal non-pregnant length (~3.5 cm). A cervix that has thinned to 1.75 cm is 50% effaced (score 2). Tactile assessment of effacement improves with experience — request senior review for borderline cases.',
    'Gestational weight gain targets (IOM 2009) are BMI-based: underweight (<18.5): 12.5–18 kg; normal (18.5–24.9): 11.5–16 kg; overweight (25–29.9): 7–11.5 kg; obese (≥30): 5–9 kg. Women gaining outside these ranges have higher risks of GDM, macrosomia, preterm birth, and caesarean section.',
  ],
  pulmonology: [
    'The FEV1/FVC ratio below the Lower Limit of Normal (LLN) is more accurate than the fixed 0.70 threshold for diagnosing obstruction, particularly in elderly patients. Using 0.70 overdiagnoses COPD in older patients (normal physiological decline) and may underdiagnose it in young patients with early disease.',
    'P/F ratio interpretation requires knowing the FiO2 accurately. In patients on nasal cannula, FiO2 estimation is imprecise: a general rule is FiO2 ≈ 0.21 + (0.04 × flow in L/min). P/F ratios should ideally be calculated on standardised FiO2 settings rather than variable nasal cannula flows.',
    'Pack-years must account for actual tobacco content, not just cigarettes. One pack-year = 20 cigarettes/day for one year. Heavy pipe, cigar, or high-tar cigarette smokers may have disproportionately higher pulmonary and carcinogenic exposure than their pack-year calculation suggests.',
    "For ABG interpretation, use a systematic approach: assess pH (acidosis vs alkalosis), identify the primary disorder (respiratory vs metabolic from PaCO2 and HCO3-), check for compensation (is it appropriate per Winter's formula or Henderson-Hasselbalch?), then identify any mixed disorder if compensation is abnormal.",
  ],
  gastroenterology: [
    'MELD score should always be calculated from simultaneous lab values obtained on the same day. Using creatinine from one date and bilirubin from another creates artificially high or low MELD scores. Repeat labs on the same day before any transplant-related decision.',
    "Child-Pugh ascites grading is the most subjective component of the score and the most common source of inter-rater variability. Use ultrasound assessment to grade ascites objectively when clinical examination is equivocal. 'Mild' (grade 1, score 2) = detectable only on ultrasound; 'Moderate' (grade 2, score 2) = clinically apparent; 'Severe' (grade 3, score 3) = gross/tense ascites.",
    "Ranson's criteria require two assessment time points (admission and 48 hours) — you cannot calculate the full score at admission alone. The 48-hour criteria (falling haematocrit, rising BUN, hypocalcaemia, base deficit, fluid sequestration) are the most predictive components for severe pancreatitis.",
    'SAAG must be calculated from albumin measured in serum and ascitic fluid obtained on the SAME DAY during paracentesis. Serum albumin measured days before the tap may not reflect the current serum level, especially in patients with rapidly fluctuating liver function.',
  ],
  'oncology-hematology': [
    "BSA-based chemotherapy dosing is imprecise — BSA is a surrogate for drug distribution, not a perfect predictor of pharmacokinetics. Many oncologists now advocate for weight-based dosing caps (e.g., capping at BSA 2.0 m²) to prevent toxicity in patients with very high BSA, but protocols vary. Always follow the specific protocol's capping rules.",
    'ANC nadir typically occurs 7–14 days after chemotherapy administration. Educate patients to monitor for fever in this window and report immediately — febrile neutropenia has a 5–10% mortality rate when treatment is delayed. The absolute neutrophil count (ANC) = WBC × (neutrophils% + bands%).',
    'TNM staging is the most important predictor of prognosis for most solid tumours, but it is a snapshot at one point in time. Stage migration (upstaging due to improved imaging or surgical staging) occurs with CT, PET-CT, and sentinel node biopsy. A Stage II cancer staged by clinical examination alone may be pathological Stage III after resection.',
    'INR/PT values in cirrhotic patients do not reflect their true coagulation status because they do not account for reduced thrombomodulin-mediated protein C activation or decreased levels of both pro- and anti-coagulant factors. Cirrhotic patients are not necessarily anti-coagulated despite elevated INR — they have a rebalanced but fragile haemostatic system.',
  ],
  pediatrics: [
    'Always use corrected (adjusted) gestational age for growth plotting and developmental assessment in premature infants until 2 years of chronological age for infants born before 32 weeks, and until 1 year for infants born 32–36 weeks. Failure to correct leads to false concerns about developmental delay in premature infants.',
    'For paediatric drug dosing, the "maximum adult dose" is a hard ceiling — if a weight-based dose exceeds the adult dose, give the adult dose. A 40 kg child on paracetamol at 15 mg/kg = 600 mg — this is appropriate. A 50 kg teenager at 15 mg/kg = 750 mg — give 500–1000 mg (adult dose), not 750 mg.',
    'Weight in paediatric emergency drug calculations can be estimated using the Broselow tape (length-based, colour-coded) or the formula: Weight (kg) ≈ 2 × (age in years + 4) for children 1–10 years. Pre-calculated Broselow-based dosing reduces errors under resuscitation stress significantly.',
    'Neonatal jaundice risk zones on the Bhutani nomogram are highly time-sensitive — interpret bilirubin ONLY with the exact postnatal age in hours, not just days. A bilirubin of 18 mg/dL at 48 hours is high risk; the same level at 96 hours is low-intermediate risk.',
  ],
  'consumer-health': [
    'BMI should never be used in isolation for health decisions. Two people with the same BMI can have completely different body compositions — an athlete with high muscle mass and a sedentary person with high body fat may have identical BMIs. Always complement BMI with waist circumference and, ideally, body fat percentage.',
    'TDEE calculators use estimated activity multipliers that have significant variability. Most people overestimate their activity level — choosing "moderately active" when they are actually sedentary adds 300–500 kcal/day to their TDEE estimate. If weight loss is not occurring at the calculated deficit, reduce the TDEE estimate by 10–15%.',
    'Target heart rate zones (based on 220 − age) are population averages with wide individual variability (±10–20 bpm). A more accurate method is the Karvonen formula using resting heart rate: Target HR = ((HRmax − HRrest) × %intensity) + HRrest. Use a heart rate monitor rather than relying solely on calculated zones.',
    'Sleep cycle calculators help identify optimal wake times to complete full 90-minute cycles and avoid waking during deep sleep. The first sleep cycle typically has more deep sleep (N3), while later cycles have more REM sleep — plan your optimal sleep duration based on when you need to wake up, working backwards in 90-minute increments.',
  ],
};

const QUICK_REF_ROWS: Record<string, QuickRefRow[]> = {
  cardiology: [
    { input: 'Age', description: 'Patient age in years', example: '65 years' },
    {
      input: 'Sex',
      description: 'Biological sex (affects risk weighting)',
      example: 'Male / Female',
    },
    { input: 'Systolic BP', description: 'Systolic blood pressure (mmHg)', example: '140 mmHg' },
    {
      input: 'Total Cholesterol',
      description: 'Total serum cholesterol (mg/dL)',
      example: '220 mg/dL',
    },
    { input: 'HDL-C', description: 'High-density lipoprotein cholesterol', example: '45 mg/dL' },
    {
      input: 'Smoking status',
      description: 'Current smoker increases CVD risk significantly',
      example: 'Current / Former / Never',
    },
    {
      input: 'Output',
      description: 'Risk score, classification, or probability',
      example: '15% 10-year CVD risk',
    },
  ],
  nephrology: [
    {
      input: 'Serum Creatinine',
      description: 'Most recent stable serum creatinine (mg/dL)',
      example: '1.8 mg/dL',
    },
    { input: 'Age', description: 'Patient age in years', example: '62 years' },
    {
      input: 'Sex',
      description: 'Biological sex (affects κ and α constants in CKD-EPI)',
      example: 'Female',
    },
    {
      input: 'Weight (for CrCl)',
      description: 'Body weight in kg — use IBW if obese for Cockcroft-Gault',
      example: '70 kg',
    },
    {
      input: 'eGFR output',
      description: 'mL/min/1.73m² — for CKD staging',
      example: '42 mL/min/1.73m²',
    },
    { input: 'CKD Stage', description: 'KDIGO G1–G5 classification', example: 'Stage G3b' },
    {
      input: 'CrCl output',
      description: 'mL/min — for drug dose adjustment',
      example: '38 mL/min',
    },
  ],
  'emergency-icu': [
    {
      input: 'Vital signs',
      description: 'HR, BP, RR, Temp, SpO2 at time of scoring',
      example: 'RR 28, SBP 88',
    },
    { input: 'GCS', description: 'Glasgow Coma Scale total (3–15)', example: 'GCS 12' },
    {
      input: 'Lab values',
      description: 'Creatinine, bilirubin, platelets, lactate as required',
      example: 'Cr 2.1, bili 3.2',
    },
    {
      input: 'Ventilator settings',
      description: 'FiO2 and PaO2 for respiratory SOFA component',
      example: 'FiO2 0.6, PaO2 80',
    },
    { input: 'Score output', description: 'Total severity score', example: 'SOFA 8' },
    {
      input: 'Risk category',
      description: 'Predicted mortality or severity class',
      example: '~40% predicted mortality',
    },
  ],
  'neurology-psychiatry': [
    {
      input: 'Item responses',
      description: 'Each scored item on the clinical scale (0–N)',
      example: 'PHQ-9 item 1: score 2',
    },
    { input: 'Total score', description: 'Sum of all item scores', example: 'PHQ-9 total: 14' },
    {
      input: 'Severity category',
      description: 'Classification per validated cutoffs',
      example: 'Moderate depression',
    },
    {
      input: 'Interpretation',
      description: 'Clinical action recommended by score range',
      example: 'Warrants clinical evaluation',
    },
    {
      input: 'Scale range',
      description: 'Minimum to maximum possible score',
      example: 'PHQ-9: 0–27',
    },
  ],
  endocrinology: [
    { input: 'Height', description: 'Patient height (cm or ft/in)', example: '170 cm' },
    { input: 'Weight', description: 'Patient weight (kg or lbs)', example: '85 kg' },
    { input: 'Age', description: 'Patient age in years', example: '45 years' },
    {
      input: 'Sex',
      description: 'Biological sex (affects BMR and IBW calculations)',
      example: 'Female',
    },
    {
      input: 'Activity level',
      description: 'Physical activity multiplier for TDEE',
      example: 'Moderately active (×1.55)',
    },
    {
      input: 'Output',
      description: 'BMI, BMR, TDEE, IBW, or conversion result',
      example: 'BMI 29.4 | TDEE 2,240 kcal',
    },
  ],
  pharmacology: [
    {
      input: 'Body weight (kg)',
      description: 'Use actual, IBW, or ABW per drug protocol',
      example: 'ABW 78 kg',
    },
    {
      input: 'Dose (mg/kg)',
      description: 'Prescribed dose per kilogram from protocol',
      example: '15 mg/kg (gentamicin)',
    },
    {
      input: 'Renal function (CrCl)',
      description: 'Cockcroft-Gault CrCl for renally-cleared drugs',
      example: '45 mL/min',
    },
    {
      input: 'Frequency',
      description: 'Dosing interval per protocol',
      example: 'Every 48h (CrCl 20–50)',
    },
    { input: 'Single dose (mg)', description: 'Calculated: dose × weight', example: '1,170 mg' },
    {
      input: 'Max daily dose',
      description: 'Safety ceiling from drug prescribing information',
      example: '≤4,000 mg/day (paracetamol)',
    },
  ],
  obstetrics: [
    {
      input: 'LMP (first day)',
      description: 'First day of last menstrual period',
      example: '15 March 2025',
    },
    {
      input: 'Cycle length',
      description: 'Average menstrual cycle length in days',
      example: '28 days',
    },
    {
      input: 'Gestational age',
      description: 'Calculated weeks + days from LMP',
      example: '28+3 weeks',
    },
    {
      input: 'EDD output',
      description: "Estimated due date (Naegele's Rule: LMP + 280 days)",
      example: '20 December 2025',
    },
    {
      input: 'Fetal biometrics',
      description: 'BPD, HC, AC, FL for EFW by Hadlock formula',
      example: 'EFW 1,240g (50th centile)',
    },
    {
      input: 'Bishop Score',
      description: 'Cervical score 0–13 for induction readiness',
      example: 'Bishop 6 — borderline favourable',
    },
  ],
  pulmonology: [
    {
      input: 'FEV1',
      description: 'Forced expiratory volume in 1 second (litres)',
      example: '1.8 L (56% predicted)',
    },
    {
      input: 'FVC',
      description: 'Forced vital capacity (litres)',
      example: '3.2 L (82% predicted)',
    },
    {
      input: 'FEV1/FVC ratio',
      description: 'Obstruction diagnosis: ratio <0.70 (or <LLN)',
      example: '0.56 → Obstruction',
    },
    {
      input: 'PaO2',
      description: 'Arterial partial pressure of oxygen (mmHg)',
      example: '60 mmHg',
    },
    {
      input: 'FiO2',
      description: 'Fraction of inspired oxygen at time of ABG',
      example: '0.40 (40% O2)',
    },
    {
      input: 'P/F ratio',
      description: 'PaO2/FiO2 — ARDS severity marker',
      example: '150 → Moderate ARDS',
    },
  ],
  gastroenterology: [
    { input: 'Bilirubin', description: 'Total serum bilirubin (mg/dL)', example: '3.8 mg/dL' },
    { input: 'Albumin', description: 'Serum albumin (g/dL)', example: '2.4 g/dL' },
    { input: 'INR', description: 'International Normalized Ratio', example: '1.8' },
    { input: 'Creatinine', description: 'Serum creatinine (mg/dL) for MELD', example: '1.3 mg/dL' },
    {
      input: 'Ascites grade',
      description: 'None / Mild / Moderate / Severe for Child-Pugh',
      example: 'Moderate (score 2)',
    },
    {
      input: 'MELD output',
      description: 'Score 6–40: higher = worse prognosis',
      example: 'MELD 22 → ~10% 90-day mortality',
    },
    {
      input: 'Child-Pugh class',
      description: 'A (5–6) / B (7–9) / C (10–15)',
      example: 'Class B (score 8)',
    },
  ],
  'oncology-hematology': [
    {
      input: 'Height (cm)',
      description: 'Patient height in centimetres at treatment visit',
      example: '168 cm',
    },
    {
      input: 'Weight (kg)',
      description: 'Current actual body weight in kilograms',
      example: '72 kg',
    },
    { input: 'BSA (m²)', description: 'Mosteller: √(H×W÷3600)', example: '1.79 m²' },
    {
      input: 'Protocol dose (mg/m²)',
      description: 'Chemotherapy dose from treatment protocol',
      example: '175 mg/m² (paclitaxel)',
    },
    {
      input: 'Total dose (mg)',
      description: 'BSA × protocol dose — verify against cap',
      example: '313 mg',
    },
    {
      input: 'ANC',
      description: 'WBC × (neutrophils% + bands%) / 100',
      example: 'ANC 0.8 × 10³/μL → neutropenic',
    },
  ],
  pediatrics: [
    {
      input: 'Weight (kg)',
      description: 'Current measured weight — never estimated for dosing',
      example: '18 kg',
    },
    {
      input: 'Date of birth',
      description: 'For exact age and corrected age calculation',
      example: '15 June 2022',
    },
    {
      input: 'Gestational age at birth',
      description: 'For corrected age in preterm infants',
      example: '32 weeks',
    },
    {
      input: 'Height/length (cm)',
      description: 'For growth chart and IBW calculation',
      example: '105 cm',
    },
    {
      input: 'Dose (mg/kg)',
      description: 'Prescribed weight-based dose from protocol',
      example: '15 mg/kg (paracetamol)',
    },
    {
      input: 'Output dose (mg)',
      description: 'Calculated single dose — check against adult max',
      example: '270 mg',
    },
    {
      input: 'Percentile',
      description: 'Growth chart position vs age/sex reference',
      example: '25th centile (height)',
    },
  ],
  'consumer-health': [
    { input: 'Age', description: 'Your age in years', example: '38 years' },
    {
      input: 'Sex',
      description: 'Biological sex (affects BMR, IBW, and risk ranges)',
      example: 'Female',
    },
    { input: 'Height', description: 'Your height in cm or ft/in', example: '165 cm' },
    { input: 'Weight', description: 'Your weight in kg or lbs', example: '68 kg' },
    {
      input: 'Activity level',
      description: 'Average weekly physical activity',
      example: 'Lightly active (×1.375)',
    },
    {
      input: 'BMI output',
      description: 'WHO classification: <18.5/18.5–24.9/25–29.9/≥30',
      example: '25.0 → Overweight',
    },
    {
      input: 'TDEE output',
      description: 'Total daily energy expenditure (kcal/day)',
      example: '1,950 kcal/day',
    },
  ],
};

const TRUST_CHIPS = [
  '⚡ Instant results',
  '🔒 Runs in your browser',
  '🆓 Always free',
  '🚫 No signup',
  '🩺 Clinically referenced',
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function HowToStepsSection({ steps }: { steps: HowToStep[] }) {
  return (
    <section
      className="mt-8 bg-white rounded-2xl border border-gray-200 p-6"
      aria-labelledby="howto-heading"
    >
      <h2
        id="howto-heading"
        className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"
      >
        <span>📋</span> How to Use This Calculator
      </h2>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center mt-0.5">
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
  );
}

function WhenToUseSection({ cards }: { cards: WhenToUseCard[] }) {
  return (
    <section
      className="mt-8 bg-white rounded-2xl border border-gray-200 p-6"
      aria-labelledby="when-heading"
    >
      <h2
        id="when-heading"
        className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"
      >
        <span>🎯</span> When to Use This Calculator
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
            <div className="text-xl mb-2">{card.icon}</div>
            <p className="text-sm font-semibold text-gray-900 mb-1">{card.title}</p>
            <p className="text-xs text-gray-700 leading-relaxed">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickReferenceSection({ rows }: { rows: QuickRefRow[] }) {
  return (
    <section
      data-print-section="reference"
      className="mt-8 bg-white rounded-2xl border border-gray-200 overflow-hidden"
      aria-labelledby="quickref-heading"
    >
      <div className="p-6 pb-3">
        <h2
          id="quickref-heading"
          className="text-base font-bold text-gray-900 flex items-center gap-2"
        >
          <span>📊</span> Quick Reference
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-emerald-50 border-y border-emerald-100">
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                Input / Parameter
              </th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                Description
              </th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                Example Value
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="px-5 py-2.5 text-sm font-medium text-emerald-800 border-b border-gray-100">
                  {row.input}
                </td>
                <td className="px-5 py-2.5 text-sm text-gray-700 border-b border-gray-100">
                  {row.description}
                </td>
                <td className="px-5 py-2.5 text-xs font-mono text-gray-700 border-b border-gray-100">
                  {row.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProTipsSection({ tips }: { tips: string[] }) {
  return (
    <section
      className="mt-8 bg-white rounded-2xl border border-gray-200 p-6"
      aria-labelledby="tips-heading"
    >
      <h2
        id="tips-heading"
        className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"
      >
        <span>💡</span> Clinical Pro Tips
      </h2>
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="flex gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── About section — rich specialty-specific content ─────────

const ABOUT_PARAGRAPHS: Record<string, (toolName: string) => string[]> = {
  cardiology: (n) => [
    `The ${n} is a validated clinical scoring tool developed from large cardiovascular outcome studies and endorsed by major cardiology societies including the American College of Cardiology (ACC), American Heart Association (AHA), and European Society of Cardiology (ESC). It takes specific patient inputs — typically demographic data, blood pressure measurements, lipid values, and clinical risk factor status — and applies a mathematically derived formula to produce a risk score, probability estimate, or clinical classification.`,
    `Cardiovascular disease is the leading cause of death globally, responsible for approximately 17.9 million deaths per year (WHO). Early identification of patients at elevated risk enables preventive intervention — including lifestyle modification, statin therapy, antihypertensive treatment, and anticoagulation — that has been proven in randomised controlled trials to reduce events. The ${n} provides a structured, evidence-based approach to this risk quantification, converting complex clinical data into an actionable number.`,
    `The formula used by this calculator is shown in full in the Formula section below. Transparency about the underlying mathematics matters: a clinician who understands exactly how a score is calculated is better equipped to interpret edge cases, recognise when inputs are outside the validated range, and explain the result to the patient. Unlike "black box" calculators, RoughTools shows you every variable, coefficient, and reference source.`,
    `Important limitations to understand: most cardiovascular risk scores were derived from predominantly white North American or European cohorts and may require recalibration for other populations. Scores estimate population-level probabilities — a 10% 10-year risk does not mean this patient will have an event; it means 10 out of 100 similar patients will. Unmeasured factors (C-reactive protein, coronary artery calcium score, family history) can shift individual risk above or below the calculated estimate.`,
    `This calculator performs all computations locally in your browser using JavaScript. No data you enter — patient name, age, laboratory values, or any other input — is transmitted to any server, stored in any database, or shared with any third party. The calculation is entirely private and confidential, making it suitable for clinical use at the bedside, in clinic, or on ward rounds without HIPAA or GDPR concerns about data transmission.`,
    `For patients with elevated scores, the ${n} result should be the starting point of a clinical conversation, not the end of it. Individual risk modification, patient values, comorbidities, and shared decision-making all influence the final management plan. Consult a cardiologist for complex risk stratification, suspected structural heart disease, established cardiovascular disease, or any case where this tool's output alone is insufficient to guide management.`,
  ],
  nephrology: (n) => [
    `The ${n} estimates kidney function or a related renal parameter using clinically validated equations. Accurate assessment of kidney function is essential in clinical practice — it determines CKD staging and progression monitoring, guides dose adjustment of renally-cleared medications, informs decisions about contrast media administration, and identifies patients who may benefit from nephroprotective therapy or specialist referral.`,
    `Chronic kidney disease affects approximately 10% of the global population (KDIGO) and is a major risk factor for cardiovascular disease, hospitalisation, and death. Many patients remain undiagnosed because serum creatinine often appears "normal" until kidney function is substantially reduced — particularly in elderly, malnourished, or low muscle-mass patients where creatinine production is diminished. Calculated eGFR provides a more clinically meaningful assessment than creatinine alone.`,
    `The specific formula used by this calculator — whether CKD-EPI 2021, Cockcroft-Gault, MDRD, or another validated equation — is displayed in full in the Formula section below. The choice of equation matters: CKD-EPI 2021 (race-free) is the preferred equation for CKD staging per current KDIGO guidelines; Cockcroft-Gault is preferred for drug dose adjustment because it was the equation used in the pharmacokinetic studies that established drug dosing thresholds.`,
    `Critical limitation: all GFR estimation equations assume stable, steady-state serum creatinine. During acute kidney injury, creatinine is still rising and the calculated eGFR will overestimate true kidney function — sometimes dramatically. Never use a point-in-time creatinine measured during an acute illness for CKD staging or drug dosing. Wait for creatinine to stabilise (typically 2–4 weeks after resolution of the acute event) before interpreting eGFR results.`,
    `All calculations run entirely in your browser. No laboratory values, patient demographics, or clinical data entered into this tool are transmitted to any server or stored in any database. Your patient information remains completely private. The calculator works on any device — desktop, tablet, or smartphone — without installation or account creation.`,
    `The ${n} supports clinical decision-making but does not replace specialist assessment. For eGFR <30 mL/min/1.73m², rapidly declining eGFR (>5 mL/min per year), heavy proteinuria, or CKD of uncertain aetiology, refer to a nephrologist. Complex drug dosing in advanced CKD should always be verified with a pharmacist experienced in renal dosing. For patients approaching kidney failure, early nephrology involvement enables timely preparation for renal replacement therapy.`,
  ],
  'emergency-icu': (n) => [
    `The ${n} is a validated clinical severity scoring tool used in emergency medicine and intensive care to rapidly quantify illness severity, guide triage decisions, and provide prognostic information. It was derived from prospective cohort studies and validated in large independent populations, giving it a level of evidence that supports its use in high-stakes clinical decision-making.`,
    `In the emergency department and ICU, rapid and accurate severity assessment determines where patients are treated, what resources they receive, and how urgently interventions are initiated. Delays in recognising deterioration — particularly in sepsis, respiratory failure, and haemodynamic instability — are a leading cause of preventable ICU mortality. Validated scoring tools like the ${n} provide a systematic, reproducible framework that reduces the variability inherent in purely subjective clinical assessment.`,
    `The exact formula, component scores, and outcome tables for this scoring system are shown in the Formula section below. Understanding the mathematical basis helps clinicians identify which physiologic parameters are most heavily weighted, interpret borderline scores with appropriate nuance, and communicate risk estimates to patients and families in a meaningful way.`,
    `Important limitations: ICU severity scores provide population-level probability estimates, not individual outcome predictions. A patient with a predicted mortality of 40% may survive with excellent care; a patient with a 10% predicted mortality may die from an unanticipated complication. Scores should inform — never replace — clinical judgment. Additionally, most scores were derived in specific patient populations and may perform differently in immunocompromised patients, post-cardiac surgery patients, or populations with different baseline characteristics.`,
    `Serial scoring is more valuable than single-point assessment for most ICU tools. A SOFA score increasing by ≥2 points over 24 hours indicates organ failure progression and warrants urgent reassessment. A daily trend showing improvement provides objective evidence of treatment response. This calculator makes it practical to recalculate scores at any time using current values, without manual arithmetic.`,
    `All calculations run entirely in your browser. No patient data is transmitted to any server. For complex critical care decisions — including code status, family communication, and withdrawal of life-sustaining treatment — always involve senior critical care clinicians and follow institutional protocols. This tool supports but does not replace the judgment of the qualified intensivist.`,
  ],
  'neurology-psychiatry': (n) => [
    `The ${n} is a standardised neurological or psychiatric assessment tool that quantifies clinical signs, cognitive function, or symptom severity using a validated, reproducible scoring system. Standardised assessment tools are essential in neurology and psychiatry because they transform inherently subjective clinical observations into objective, comparable numbers that can be tracked over time, communicated between providers, and used to guide treatment decisions.`,
    `Neurological and psychiatric conditions account for an estimated 30% of the global burden of disease (WHO) and are frequently under-diagnosed in primary care. Validated screening tools like PHQ-9 and GAD-7 have been shown in multiple studies to significantly improve detection rates for depression and anxiety compared to unstructured clinical interviews. Similarly, tools like the NIHSS and GCS provide standardised neurological assessment that enables consistent communication across clinical teams and documents the baseline against which recovery or deterioration is measured.`,
    `The scoring method for this tool — including each item, response anchors, and published cutoff thresholds — is described in the Formula section below. Proper item-by-item scoring is critical: a single misscored item can change the total by enough to shift the severity category, potentially changing clinical action. For clinician-administered scales (GCS, NIHSS), training in standardised administration improves reliability. For patient-reported tools (PHQ-9, GAD-7), read each question exactly as written and allow the patient to answer without leading prompts.`,
    `Critical limitation: screening and assessment tools are not diagnostic instruments. A PHQ-9 score of 15 identifies a patient who is likely experiencing moderate-to-severe depressive symptoms — it does not diagnose major depressive disorder, rule out bipolar disorder, or determine the cause of the depression. A positive screen mandates a structured clinical interview using DSM-5 criteria before any treatment decision. Similarly, a high GCS does not exclude focal neurological injury — always perform a structured neurological examination.`,
    `All calculations run in your browser only — no patient data is stored or transmitted. For mental health tools in particular, this privacy protection is important: patients should feel confident that their responses to screening questions about mood, suicidal ideation, or psychiatric symptoms are not logged or shared.`,
    `For scores indicating high risk — such as PHQ-9 item 9 >0 (suicidal ideation), NIHSS suggesting major stroke, GCS ≤8 indicating coma, or CIWA-Ar >15 suggesting severe withdrawal — immediate clinical action is required. Consult a psychiatrist, neurologist, or the relevant emergency specialist without delay. These tools provide structured assessment data; the clinical response must be proportionate to the result.`,
  ],
  endocrinology: (n) => [
    `The ${n} calculates an important metabolic or endocrine parameter using validated clinical equations referenced to current guidelines from the American Diabetes Association (ADA), the World Health Organisation (WHO), the Endocrine Society, and other major authorities. The calculator takes specific anthropometric, demographic, or laboratory inputs and applies a mathematically defined formula to produce a clinically interpretable output.`,
    `Metabolic and endocrine disorders — including type 2 diabetes, obesity, thyroid dysfunction, and polycystic ovary syndrome — affect more than one billion people worldwide. Early identification through validated risk scoring and metabolic assessment enables lifestyle interventions, preventive pharmacotherapy, and specialist referral that can prevent or delay disease progression. The ${n} provides a structured, evidence-based approach to this assessment, making it suitable for clinical encounters, health screening programmes, and patient education.`,
    `The formula used by this calculator is shown in full in the Formula section below. For metabolic calculators, showing the exact equation is especially important because it allows clinicians and patients to understand which factors contribute most to the result. For example, in the Mifflin-St Jeor TDEE equation, understanding that height contributes positively and age negatively helps patients see why caloric needs typically decline with age even at a constant weight.`,
    `Important limitations: all anthropometric and metabolic equations have built-in population-level variability. BMR equations have a ±200–300 kcal/day error at the individual level. BMI does not distinguish muscle from fat and has different risk thresholds across ethnic populations. Ideal body weight equations do not reflect individual body composition or clinical context. Always interpret calculated values alongside the clinical examination and the patient's symptom history, not as standalone diagnostic or treatment thresholds.`,
    `All calculations run locally in your browser. No health data, weight measurements, laboratory values, or personal information is transmitted to any server or stored in any database. This makes the tool safe for use in clinical consultations, particularly for sensitive data such as body weight and metabolic health metrics, without concerns about data privacy or confidentiality.`,
    `For metabolic conditions of clinical significance — including BMI ≥40 kg/m² suggesting bariatric surgery evaluation, HbA1c ≥7% indicating suboptimal diabetes control, or suspected thyroid dysfunction — consult an endocrinologist or physician. Complex medication management for diabetes, thyroid disease, adrenal conditions, or reproductive endocrinology requires specialist assessment beyond what any calculator can provide. Use this tool to start the clinical conversation, not to end it.`,
  ],
  pharmacology: (n) => [
    `The ${n} applies validated pharmacokinetic principles or evidence-based dosing algorithms to calculate drug doses, infusion rates, target concentrations, or equianalgesic conversions. Precise drug dosing is a patient safety imperative — dosing errors are among the most common and preventable causes of serious adverse drug events in hospitalised patients, and high-alert medications (opioids, anticoagulants, aminoglycosides, chemotherapy, vancomycin) carry particular risk of serious harm from small dosing errors.`,
    `Pharmacokinetic dosing tools are validated through population pharmacokinetic studies in which drug concentrations are measured in patient blood samples and mathematical models are fitted to describe drug distribution, metabolism, and elimination. The equations used by this calculator represent population averages — individual patients may have significantly different pharmacokinetics due to genetic polymorphisms in drug-metabolising enzymes, organ function variability, drug interactions, and body composition differences. This is why pharmacist involvement and therapeutic drug monitoring (TDM) are essential for narrow-therapeutic-index drugs.`,
    `The exact formula used by this calculator — including the specific equation, weight convention (actual, ideal, or adjusted body weight), and dose parameters — is displayed in the Formula section below. For high-alert medications, verify that you are applying the correct weight type before using the calculated dose: using actual body weight instead of ideal body weight for aminoglycoside dosing in an obese patient can produce a dose 50–100% higher than intended.`,
    `Critical safety requirements: all doses calculated by this tool must be independently verified by a licensed pharmacist before prescribing, preparation, and administration. This is a non-negotiable patient safety requirement, not a suggestion. For chemotherapy, opioids, and anticoagulants specifically, many institutions require a second independent check by a second pharmacist or the treating physician. The presence of a calculator does not reduce the need for human verification — it supports it.`,
    `All calculations run entirely in your browser. No patient weight, age, renal function values, drug names, or dose parameters are transmitted to any server or stored in any database. This privacy protection is important for compliance with healthcare data regulations when using the tool at the patient bedside.`,
    `The ${n} provides a starting-point dose that must be contextualised with the patient's full clinical picture: current organ function, concurrent medications and interactions, allergy history, treatment goals, and institutional protocol requirements. For complex dosing situations — including renally or hepatically impaired patients, extremes of body weight, or patients requiring therapeutic drug monitoring — consult a clinical pharmacist with experience in the relevant drug class.`,
  ],
  obstetrics: (n) => [
    `The ${n} is a standard obstetric calculation tool used to derive pregnancy dating parameters, assess fetal growth, evaluate labour readiness, or estimate obstetric outcomes using validated formulas and reference data. Accurate obstetric calculations are fundamental to safe antenatal care — errors in gestational age, estimated fetal weight, or induction readiness assessment directly affect clinical decisions about screening test timing, corticosteroid administration, delivery planning, and neonatal management.`,
    `Gestational age is the most fundamental parameter in obstetric care — it determines the schedule of every antenatal assessment, screening test, and intervention from first trimester viability to delivery planning. The ${n} applies the appropriate validated formula or reference standard — whether Naegele's Rule for due date calculation, Hadlock equations for fetal weight estimation, or Bishop scoring for cervical assessment — to provide a clinically reliable result.`,
    `The exact formula and variable definitions used by this calculator are shown in the Formula section below. For obstetric calculations, formula transparency matters because different equations and charts have different populations of origin, and clinicians should know which reference they are applying. For example, Hadlock equations for estimated fetal weight were derived from predominantly white American fetuses — they may produce different accuracy in other ethnic populations.`,
    `Important limitations: LMP-based dating (Naegele's Rule) assumes a regular 28-day cycle with ovulation on day 14. For patients with irregular cycles, unknown LMP, or cycles substantially longer or shorter than 28 days, first-trimester ultrasound dating by CRL measurement is significantly more accurate and should be used per ACOG guidelines. Fetal weight estimations have an inherent error of approximately ±15–20% regardless of the formula used. The ${n} provides estimates — clinical findings, ultrasound measurements, and professional judgment define the management plan.`,
    `All calculations run in your browser only. No obstetric data, LMP dates, fetal measurements, or clinical information is transmitted to any server or stored anywhere. This ensures full compliance with healthcare data privacy requirements when using the tool during clinical consultations.`,
    `These calculators support evidence-based obstetric care — they do not replace it. All pregnant women should receive regular antenatal care from a qualified obstetrician or midwife. Contact your maternity care provider promptly for: vaginal bleeding at any gestation, decreased fetal movement after 24 weeks, symptoms of pre-eclampsia (severe headache, visual disturbance, epigastric pain, oedema), signs of preterm labour, or any other concerns about pregnancy. If in doubt, always seek prompt obstetric assessment.`,
  ],
  pulmonology: (n) => [
    `The ${n} evaluates pulmonary function or respiratory severity using validated equations and established clinical criteria from the American Thoracic Society (ATS), European Respiratory Society (ERS), and Global Initiative for Chronic Obstructive Lung Disease (GOLD). Pulmonary calculations support clinical decisions across a wide range of respiratory conditions — from diagnosing and staging COPD, to classifying ARDS severity for ventilator management, to calculating pack-year exposure for lung cancer screening eligibility.`,
    `Respiratory disease affects more than 500 million people globally, with COPD and lower respiratory infections among the top ten causes of death worldwide. Spirometry-based assessment remains the cornerstone of obstructive lung disease diagnosis and management — yet spirometry results require correct calculation and interpretation to be clinically meaningful. The ${n} provides the computational framework to convert raw spirometric values into the clinically relevant indices used in guideline-based management decisions.`,
    `The specific formula used by this calculator — including the FEV1/FVC ratio threshold for obstruction, % predicted calculation method, P/F ratio classification boundaries, or pack-year computation — is shown in full in the Formula section below. For spirometry interpretation specifically, the choice between the fixed 0.70 threshold and the Lower Limit of Normal (LLN) from reference equations matters: the fixed threshold overdiagnoses obstruction in the elderly and may underdiagnose it in young adults, while LLN-based interpretation avoids these age-related errors.`,
    `Important limitations: spirometric values must be interpreted alongside clinical context. A reduced FEV1/FVC alone does not diagnose COPD — the patient must also have consistent symptoms and relevant exposures. P/F ratio interpretation requires an accurately measured FiO2, which is imprecise on nasal cannula. Pack-year calculations apply equally to all tobacco products in terms of systemic effects but may not perfectly capture pulmonary deposition differences. Always integrate calculator outputs with the full clinical and imaging assessment.`,
    `All calculations run in your browser only — no spirometry data, ABG values, or patient information is transmitted to any server or stored. The calculator works on any device, making it convenient for use in pulmonary function laboratories, clinic rooms, or at the bedside in the ICU without requiring a desktop computer or institutional software.`,
    `Formal spirometry testing for COPD diagnosis must be performed by a trained technician using calibrated equipment and interpreted by a qualified clinician — this calculator interprets spirometric indices but cannot perform the test. For abnormal results suggesting significant disease, refer to a pulmonologist for comprehensive assessment, advanced lung function testing (DLCO, lung volumes), CT imaging, or pulmonary rehabilitation evaluation. For ARDS severity and mechanical ventilation management, decisions should be made by an experienced intensivist or respiratory specialist.`,
  ],
  gastroenterology: (n) => [
    `The ${n} is a validated hepatic or gastrointestinal scoring system used to assess disease severity, estimate prognosis, guide transplant listing decisions, or evaluate procedural risk in patients with liver disease or gastrointestinal conditions. It is endorsed by the American Association for the Study of Liver Diseases (AASLD), the European Association for the Study of the Liver (EASL), and the British Society of Gastroenterology (BSG).`,
    `Chronic liver disease affects approximately 1.5 billion people globally (EASL), with cirrhosis and its complications — including portal hypertension, variceal haemorrhage, spontaneous bacterial peritonitis, hepatic encephalopathy, and hepatorenal syndrome — representing major causes of morbidity and mortality. Validated scoring systems like MELD, Child-Pugh, and SAAG provide objective, reproducible severity assessment that guides decisions about transplant listing, intensive monitoring, prophylactic interventions, and end-of-life planning.`,
    `The exact formula — including every variable, coefficient, and clinical grading scale — is shown in the Formula section below. For hepatic scoring systems, formula transparency is especially important because small differences in laboratory values can shift a patient between clinically significant thresholds. For example, in MELD scoring, a creatinine that rises from 1.2 to 2.0 mg/dL raises the MELD score by approximately 3 points — which can change the transplant listing priority and 90-day mortality estimate.`,
    `Critical requirements for valid scoring: hepatic scores are only accurate when calculated from simultaneous laboratory values obtained on the same day from a stable clinical state. MELD or Child-Pugh scores calculated from values obtained during acute hepatic decompensation (bleeding, infection, AKI) do not represent the patient's stable baseline. For Child-Pugh scoring, the subjective components — ascites severity and encephalopathy grade — should be assessed by an experienced clinician using standardised grading criteria, as inter-observer variability here is a significant source of scoring inconsistency.`,
    `All calculations run in your browser. No laboratory values, clinical parameters, or patient information is transmitted to any server or stored. This ensures compliance with healthcare data privacy requirements when using the tool in clinical consultations or ward rounds.`,
    `For MELD scores ≥15, Child-Pugh Class C, or any patient with decompensated cirrhosis, prompt referral to a hepatologist or liver transplant centre is indicated. Liver transplant evaluation is a complex, time-sensitive multidisciplinary process — early referral improves outcomes. For all patients with liver disease, gastroenterologist or hepatologist involvement should guide varices surveillance, SBP prophylaxis, hepatocellular carcinoma screening, and management of hepatic decompensation.`,
  ],
  'oncology-hematology': (n) => [
    `The ${n} is used in oncology or haematology to calculate treatment doses, assess disease severity, classify tumour stage, or estimate prognosis. It follows validated protocols and clinical dosing standards from the American Society of Clinical Oncology (ASCO), the European Society for Medical Oncology (ESMO), the National Comprehensive Cancer Network (NCCN), and other major oncology organisations.`,
    `Cancer treatment is among the most complex and high-stakes domains in medicine. Chemotherapy agents have some of the narrowest therapeutic windows of any drug class — effective doses and toxic doses are often separated by a small margin. A BSA-based dose that is 20% too high can cause life-threatening myelosuppression; a dose that is 20% too low may be subtherapeutic for the tumour. Accurate dose calculation, supported by this tool, is one of the first steps in a multi-layered safety system that protects patients from chemotherapy dosing errors.`,
    `The exact formula used by this calculator — including the BSA equation (Mosteller, DuBois, or other), ANC calculation, TNM staging criteria, or dose parameters — is shown in full in the Formula section below. For chemotherapy BSA calculation specifically, the Mosteller formula [BSA = √(H × W / 3600)] is used by most modern oncology protocols because it is simpler, produces similar results to DuBois in most patients, and has been incorporated into widely used oncology software.`,
    `Critical safety requirements: all chemotherapy and high-alert oncology medication doses must be independently verified by the treating oncologist and by a specialist oncology pharmacist before any preparation or administration. This double-check process is a mandatory institutional safety requirement — not a suggestion — and no calculator, however sophisticated, replaces it. Re-verify doses at every treatment cycle using the patient's current weight, as doses may need adjustment for >10% weight change, toxicity-related protocol modifications, or dose-capping rules.`,
    `All calculations run in your browser only. No patient height, weight, laboratory values, or clinical data is transmitted to any server or stored. For patients receiving chemotherapy, maintaining this privacy is important — cancer diagnosis and treatment represent highly sensitive personal health information.`,
    `For complex oncology situations — including patients with significant renal or hepatic impairment requiring dose modification, patients on trials requiring per-protocol dosing verification, or cases where ANC indicates febrile neutropenia requiring emergency management — always involve the treating oncologist and clinical pharmacist. Febrile neutropenia (ANC <500 + fever) is an oncologic emergency: empiric broad-spectrum antibiotics should be started within the first hour of presentation regardless of the calculated ANC value.`,
  ],
  pediatrics: (n) => [
    `The ${n} is used by paediatricians, emergency physicians, and clinical pharmacists to calculate weight-based medication doses, assess child growth against reference standards, evaluate developmental status, or manage neonatal conditions. All reference values, dosing guidelines, and clinical thresholds are based on WHO/CDC paediatric growth standards, British National Formulary for Children (BNFc), and American Academy of Pediatrics (AAP) clinical practice guidelines.`,
    `Paediatric care requires specialised dosing and assessment approaches that cannot simply be derived by scaling adult values. Children's organ systems — particularly renal, hepatic, and neurological — mature throughout childhood, fundamentally changing drug pharmacokinetics, appropriate dose ranges, and physiological reference ranges at each age. Growth, developmental milestone assessment, and vaccination scheduling require age-referenced normative data that changes continuously from birth to adolescence. The ${n} provides the validated, age-referenced calculations that make precise paediatric clinical assessment possible.`,
    `The specific formula, dose parameters, or reference charts used by this calculator are shown in the Formula section below. For paediatric drug dosing specifically, formula transparency is critical: a clinician who understands whether a dose is based on mg/kg, mg/m², or a fixed age-banded dose is better equipped to identify when a result seems unexpectedly high or low and to verify it before prescribing.`,
    `Critical dosing safety rules: all paediatric drug doses have an upper "adult maximum" ceiling — if a weight-based calculated dose exceeds the adult dose for that drug, give the adult dose, not the calculated weight-based dose. This ceiling protects against overdosing in large children and adolescents. Additionally, for children under 3 years and neonates, always verify doses with a paediatric pharmacist — physiological maturation means that standard weight-based doses appropriate for older children can be toxic in young infants.`,
    `For premature infants and neonates, always use corrected (adjusted) gestational age for growth chart plotting and developmental assessment until at least 2 years corrected age (for infants born before 32 weeks). Using chronological age for a premature infant generates false concerns about growth faltering and developmental delay — the correction accounts for the developmental stage appropriate to the infant's maturity, not the calendar age since birth.`,
    `All calculations run in your browser only. No child weight, date of birth, gestational age, or clinical data is transmitted to any server or stored in any database. These tools are designed for use by healthcare professionals in clinical settings. Parents using these tools for guidance should always confirm doses and developmental assessments with their child's paediatrician or pharmacist before acting on any result. When in doubt about a child's health, always seek immediate medical assessment.`,
  ],
  'consumer-health': (n) => [
    `The ${n} helps you assess an important personal health metric using validated, evidence-based formulas referenced to guidelines from the World Health Organisation (WHO), American College of Sports Medicine (ACSM), United States Department of Agriculture (USDA), Centers for Disease Control and Prevention (CDC), and other major public health authorities. The calculator takes personal inputs — typically age, sex, height, weight, and activity level — and applies a validated equation to produce a health metric with the corresponding reference range and interpretation.`,
    `Consumer health tools bridge the gap between complex clinical science and everyday personal health decisions. BMI, body fat percentage, daily calorie needs, target heart rate zones, water intake, and sleep cycle calculations were all originally developed for clinical and research use — this calculator makes these tools accessible for personal health awareness and planning without requiring a clinical appointment. Having accurate personal health data supports more informed conversations with your healthcare provider and helps you set realistic, science-based wellness goals.`,
    `The formula used by this calculator is shown in full in the Formula section below. For consumer health tools, showing the formula demystifies the result: understanding that BMI = weight(kg) / height(m)² makes it clear why both weight and height matter, and why someone who is tall can have the same BMI as a shorter person with significantly different actual weight. Understanding how TDEE is calculated helps you see why activity level — not just body weight — determines your daily calorie needs.`,
    `Important limitations of consumer health tools: all health metrics are population averages with individual variability. TDEE equations have a ±200–300 kcal/day error at the individual level. BMI does not measure body fat directly and can misclassify muscular individuals as overweight. Target heart rate zones are approximations — maximum heart rate varies considerably among individuals of the same age. These tools provide useful guidance for health awareness and planning, but they are not medical assessments.`,
    `All calculations run entirely in your browser. No personal information — including your weight, height, age, or any health data — is transmitted to any server, stored in any database, or used for advertising or personalisation. Your health data remains completely private on your device. There are no accounts, cookies that track health inputs, or data collection of any kind.`,
    `These tools are for personal health education and awareness — they are not medical advice and should not be used to self-diagnose or self-treat. If your ${n} result falls outside the healthy range — particularly if your BMI indicates obesity, your blood pressure reading is elevated, or you have symptoms that concern you — book an appointment with your GP or primary care provider to discuss the result in the context of your full health history. Always consult a qualified healthcare provider before making major changes to diet, exercise, or medication.`,
  ],
};

const TOOL_ABOUT_PARAGRAPHS: Record<string, (toolName: string) => string[]> = {
  'remedial-exercise-calorie-calculator': (n) => [
    `The ${n} uses the internationally validated MET (Metabolic Equivalent of Task) framework to estimate energy expenditure during prescribed therapeutic exercise modalities. MET values are drawn from the Compendium of Physical Activities (Ainsworth et al., Medicine & Science in Sports & Exercise, 2011) — the gold-standard reference used by exercise physiologists, sports medicine physicians, and clinical dietitians worldwide to quantify exercise intensity and caloric expenditure.`,
    `Remedial exercise refers to medically prescribed, structured physical activity designed to address a specific health condition — most commonly obesity, musculoskeletal rehabilitation, cardiovascular deconditioning, or post-surgical recovery. Unlike general fitness programmes, remedial exercise programmes are individually tailored by physiotherapists or clinical exercise specialists, with specific modalities, intensity levels, durations, and progression schedules. This calculator supports the planning, monitoring, and patient education aspects of such programmes.`,
    `The MET formula (Calories = MET × Body Weight (kg) × Duration in Hours) is the simplest validated method for estimating gross energy expenditure during exercise. "Gross" means it includes resting metabolic rate — net energy expenditure (the additional burn above resting) would be calculated as (MET − 1) × weight × hours. For clinical purposes, gross expenditure is the standard used in exercise prescription and calorie balance calculations.`,
    `Treadmill incline walking has emerged as a particularly effective remedial exercise for obese patients because it achieves high metabolic demand at slow walking speeds. At 40% incline, even slow walking (2–3 km/h) generates a MET of approximately 11–12 — equivalent to vigorous running — while maintaining low impact forces on the knee and hip joints. This makes steep incline walking the preferred cardio modality in patients with obesity-related joint pain or osteoarthritis who cannot tolerate jogging.`,
    `For resistance exercises — push-ups, deadlifts, and abdominal crunches — calorie estimates from MET values are conservative, because they do not account for the Excess Post-exercise Oxygen Consumption (EPOC) effect. Resistance training elevates metabolic rate for 12–48 hours after exercise, adding 6–15% additional calorie burn beyond the session itself (Aaberg, NSCA, 2020). This makes resistance exercises particularly valuable additions to obesity management programmes beyond their direct caloric cost.`,
    `All calculations run entirely in your browser. No data you enter — body weight, exercise duration, or any other input — is transmitted to any server or stored anywhere. Results can be exported to PDF for clinical records, shared with patients as part of their exercise prescription documentation, or used to track caloric expenditure across sessions over time. The PDF report includes the MET values and formula reference for clinical transparency.`,
  ],
};

function AboutContent({
  toolName,
  description: _description,
  specialty,
  reference,
  toolSlug,
}: {
  toolName: string;
  description: string;
  specialty: MedicalSpecialty | null;
  reference: string | null;
  toolSlug?: string;
}) {
  const specialtyId = specialty?.id ?? 'consumer-health';
  const paragraphsFn =
    (toolSlug ? TOOL_ABOUT_PARAGRAPHS[toolSlug] : null) ??
    ABOUT_PARAGRAPHS[specialtyId] ??
    ABOUT_PARAGRAPHS['consumer-health'];
  const paragraphs = paragraphsFn(toolName);

  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0">
          {para}
        </p>
      ))}
      {reference && (
        <p className="text-xs text-emerald-700 mt-4 flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <span className="mt-0.5 flex-shrink-0">📌</span>
          <span>
            <strong>Clinical Reference:</strong> {reference}
          </span>
        </p>
      )}
    </>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

// ─── Tool-specific overrides (keyed by slug) ─────────────────────────────────
const TOOL_HOW_TO_STEPS: Record<string, HowToStep[]> = {
  'remedial-exercise-calorie-calculator': [
    {
      name: 'Enter your body weight',
      text: 'Input your current body weight in kilograms. The MET formula multiplies directly by body weight — heavier individuals burn more calories for the same exercise duration. Use your measured weight, not an estimate.',
    },
    {
      name: 'Select your exercise modality',
      text: 'Choose from the dropdown: treadmill walking at various inclines (0%, 10%, 20%, 30%, or 40%), push-ups, deadlifts, or abdominal crunches. Each modality has a validated MET value from the Compendium of Physical Activities.',
    },
    {
      name: 'Set the exercise duration',
      text: 'Enter the prescribed duration in minutes. For clinical exercise sessions, this is typically 20–60 minutes. You can calculate each exercise separately to build a multi-exercise session total.',
    },
    {
      name: 'Click Calculate to see calorie burn',
      text: 'The calculator applies the MET formula (Calories = MET × weight × hours) and displays total kcal burned, the MET value used, and the per-minute calorie rate. Results appear instantly.',
    },
    {
      name: 'Use results to plan your session',
      text: 'Compare different exercise modalities or inclines to understand the caloric impact of each. Use the PDF export to save your exercise prescription with calorie estimates for clinical records or patient education.',
    },
  ],
};

const TOOL_WHEN_TO_USE_CARDS: Record<string, WhenToUseCard[]> = {
  'remedial-exercise-calorie-calculator': [
    {
      icon: '🏥',
      title: 'Clinical weight management',
      description:
        'Use to calculate expected calorie expenditure when prescribing structured exercise for obese patients (BMI ≥30). Helps set realistic weekly energy deficit targets alongside dietary intervention.',
    },
    {
      icon: '🏃',
      title: 'Treadmill incline prescription',
      description:
        'Compare calorie burn across different incline levels to select the optimal therapeutic incline — high caloric expenditure at low walking speed reduces joint impact for obese patients.',
    },
    {
      icon: '💪',
      title: 'Resistance exercise planning',
      description:
        'Calculate calories from push-ups, deadlifts, and crunches to combine aerobic and resistance components into a comprehensive remedial exercise programme.',
    },
    {
      icon: '📋',
      title: 'Patient education',
      description:
        'Show patients the caloric impact of their prescribed exercises in real numbers — translating "30 minutes on the treadmill at 40% incline" into "920 kcal burned" improves exercise adherence and motivation.',
    },
    {
      icon: '📊',
      title: 'Progress monitoring',
      description:
        'Track how calorie burn per session changes as patient weight decreases with successful weight management — adjust exercise duration or intensity to maintain an equivalent energy deficit.',
    },
  ],
};

const TOOL_PRO_TIPS: Record<string, string[]> = {
  'remedial-exercise-calorie-calculator': [
    'MET values are population-derived averages. Obese individuals (BMI ≥35) may expend 10–20% more calories than standard calculations predict during weight-bearing exercises (treadmill, push-ups) because they must move a larger body mass against gravity. The MET formula already accounts for this partially through the weight variable — heavier patients receive proportionally higher calorie estimates.',
    'Treadmill incline at 30–40% is an advanced prescription suitable only for conditioned patients. For newly referred obese patients, begin with 0–10% incline for 15–20 minutes and progress over 4–6 weeks. High incline walking at therapeutic speeds (2–3 km/h) achieves the same energy expenditure as jogging with significantly lower knee joint load — particularly important in patients with obesity-related osteoarthritis.',
    'When combining exercises in a session, calculate each modality separately and sum the totals. A 30-minute treadmill session at 20% incline followed by 3 sets of 15 push-ups and 3 sets of 20 crunches provides a substantially higher caloric deficit than single-modality sessions — and resistance components (deadlifts, push-ups) add post-exercise oxygen consumption (EPOC) that extends calorie burn for 24–48 hours.',
    'For the FITT prescription (Frequency, Intensity, Time, Type), this calculator addresses the Type and Time components. Pair calorie estimates from this tool with heart rate zone targets (use the Heart Rate Zone Calculator) to ensure exercise intensity is in the therapeutic aerobic range (50–70% VO₂max for initial obesity rehabilitation, progressing to 70–80% over time).',
  ],
};

const TOOL_QUICK_REF_ROWS: Record<string, QuickRefRow[]> = {
  'remedial-exercise-calorie-calculator': [
    {
      input: 'Body weight (kg)',
      description: 'Current measured body weight in kilograms',
      example: '90 kg',
    },
    {
      input: 'Treadmill 0% incline',
      description: 'MET 3.5 — gentle warm-up, low intensity',
      example: '3.5 × 90 × 0.5h = 157.5 kcal',
    },
    {
      input: 'Treadmill 10% incline',
      description: 'MET 5.5 — moderate therapeutic intensity',
      example: '5.5 × 90 × 0.5h = 247.5 kcal',
    },
    {
      input: 'Treadmill 20% incline',
      description: 'MET 7.5 — vigorous, high caloric expenditure',
      example: '7.5 × 90 × 0.5h = 337.5 kcal',
    },
    {
      input: 'Treadmill 30% incline',
      description: 'MET 9.5 — advanced incline, high intensity',
      example: '9.5 × 90 × 0.5h = 427.5 kcal',
    },
    {
      input: 'Treadmill 40% incline',
      description: 'MET 11.5 — maximum therapeutic incline',
      example: '11.5 × 90 × 0.5h = 517.5 kcal',
    },
    {
      input: 'Push-ups',
      description: 'MET 3.8 — upper body calisthenic exercise',
      example: '3.8 × 90 × 0.25h = 85.5 kcal',
    },
    {
      input: 'Deadlifts (vigorous)',
      description: 'MET 5.0 — compound resistance exercise',
      example: '5.0 × 90 × 0.25h = 112.5 kcal',
    },
    {
      input: 'Abdominal crunches',
      description: 'MET 2.8 — core strengthening exercise',
      example: '2.8 × 90 × 0.25h = 63 kcal',
    },
  ],
};

export default function MedicalToolShell({
  toolName,
  toolSlug,
  description,
  heroIcon,
  reference,
  specialty,
  formulaDisplay,
  faqs,
  relatedTools,
}: MedicalToolShellProps) {
  const specialtyId = specialty?.id ?? 'consumer-health';

  const howToSteps =
    TOOL_HOW_TO_STEPS[toolSlug] ?? HOW_TO_STEPS[specialtyId] ?? HOW_TO_STEPS['consumer-health']!;
  const whenToCards =
    TOOL_WHEN_TO_USE_CARDS[toolSlug] ??
    WHEN_TO_USE_CARDS[specialtyId] ??
    WHEN_TO_USE_CARDS['consumer-health']!;
  const proTips = TOOL_PRO_TIPS[toolSlug] ?? PRO_TIPS[specialtyId] ?? PRO_TIPS['consumer-health']!;
  const quickRefRows =
    TOOL_QUICK_REF_ROWS[toolSlug] ??
    QUICK_REF_ROWS[specialtyId] ??
    QUICK_REF_ROWS['consumer-health']!;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── 1. Breadcrumb ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-gray-500 flex-wrap"
          >
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <span aria-hidden="true">›</span>
            <Link href="/tools/medical" className="hover:text-emerald-600 transition-colors">
              Medical
            </Link>
            {specialty && (
              <>
                <span aria-hidden="true">›</span>
                <Link
                  href={`/tools/medical#${specialty.id}`}
                  className="hover:text-emerald-600 transition-colors"
                >
                  {specialty.label}
                </Link>
              </>
            )}
            <span aria-hidden="true">›</span>
            <span className="text-gray-800 font-medium truncate max-w-[160px] sm:max-w-none">
              {toolName}
            </span>
          </nav>
        </div>
      </div>

      {/* ── 2. Gradient hero ──────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
              {heroIcon}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{toolName}</h1>
              <p className="text-emerald-100 text-sm mt-1 leading-relaxed max-w-xl">
                {description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            {TRUST_CHIPS.map((chip) => (
              <span
                key={chip}
                className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 text-emerald-100"
              >
                {chip}
              </span>
            ))}
          </div>
          {specialty && (
            <div className="mt-4">
              <Link
                href={`/tools/medical#${specialty.id}`}
                className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/25 rounded-full px-3 py-1 text-white transition-colors"
              >
                <span>{specialty.icon}</span>
                <span>{specialty.label}</span>
                <svg
                  className="h-3 w-3 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* ── 1. Calculator widget ── first above the fold ────────────────── */}
        <div data-print-section="calculator" className="mb-8">
          <MedicalCalculatorClient slug={toolSlug} toolName={toolName} />
        </div>

        {/* ── 2. Formula display ───────────────────────────────────────────── */}
        <section
          data-print-section="formula"
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🧮</span> {formulaDisplay.title}
          </h2>
          <div className="bg-gray-50 rounded-xl border border-gray-200 px-5 py-4 mb-4 font-mono text-sm text-gray-800 whitespace-pre-line leading-relaxed">
            {formulaDisplay.formula}
          </div>
          {formulaDisplay.variables.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Variables
              </p>
              <div className="space-y-1.5">
                {formulaDisplay.variables.map((v, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <code className="flex-shrink-0 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded px-2 py-0.5 text-xs font-mono min-w-[80px] text-center">
                      {v.symbol}
                    </code>
                    <span className="text-gray-700">{v.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-600 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 leading-relaxed">
            🩺 {formulaDisplay.note}
          </p>
          {reference && (
            <p className="text-xs text-emerald-600 mt-3 flex items-start gap-1.5">
              <span>📌</span>
              <span>{reference}</span>
            </p>
          )}
        </section>

        {/* ── 3. Quick Reference table ─────────────────────────────────────── */}
        <QuickReferenceSection rows={quickRefRows} />

        {/* ── 4. About section ─────────────────────────────────────────────── */}
        <section
          className="mt-8 bg-white rounded-2xl border border-gray-200 p-6"
          aria-labelledby="about-heading"
        >
          <h2
            id="about-heading"
            className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"
          >
            <span>ℹ️</span> About This Calculator
          </h2>
          <AboutContent
            toolName={toolName}
            description={description}
            specialty={specialty}
            reference={reference}
            toolSlug={toolSlug}
          />
        </section>

        {/* ── 5. How to Use steps ──────────────────────────────────────────── */}
        <HowToStepsSection steps={howToSteps} />

        {/* ── 6. When to Use cards ─────────────────────────────────────────── */}
        <WhenToUseSection cards={whenToCards} />

        {/* ── 7. Pro Tips ──────────────────────────────────────────────────── */}
        <ProTipsSection tips={proTips} />

        {/* ── 8. Medical Disclaimer ────────────────────────────────────────── */}
        <div className="mt-8">
          <MedicalDisclaimer formula={formulaDisplay.formula} />
        </div>

        {/* ── 9. FAQ section — lazy loaded, below the fold ─────────────────── */}
        <MedicalFAQSection faqs={faqs} />

        {/* ── 10. Related tools grid ───────────────────────────────────────── */}
        {relatedTools.length > 0 && (
          <section className="mt-12" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-lg font-bold text-gray-900 mb-4">
              {specialty ? `More ${specialty.label} Tools` : 'Popular Medical Tools'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedTools.map((r) => (
                <Link
                  key={r.slug}
                  href={`/tools/medical/${r.slug}`}
                  className="group flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm transition-all"
                >
                  <span className="text-xl flex-shrink-0">{r.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {r.name}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{r.description}</p>
                  </div>
                  <svg
                    className="h-4 w-4 ml-auto text-gray-300 group-hover:text-emerald-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 11. Compliance extras ────────────────────────────────────────── */}
        <ToolPageExtras
          toolName={toolName}
          toolSlug={toolSlug}
          toolUrl={`https://roughtools.com/tools/medical/${toolSlug}`}
          type="medical"
          showPDF
        />

        {/* Back link */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
          <Link
            href="/tools/medical"
            className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <svg
              className="h-4 w-4 rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Back to All Medical Tools
          </Link>
          {specialty && (
            <Link
              href={`/tools/medical#${specialty.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <span>{specialty.icon}</span>
              <span>{specialty.label}</span>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
