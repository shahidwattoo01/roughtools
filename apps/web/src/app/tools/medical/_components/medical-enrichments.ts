// ============================================================
// MEDICAL CALCULATOR ENRICHMENTS
// Clinical recommendations, next steps, differentials,
// guideline sources for all 113 calculators.
// Keyed by calculator ID — merged with calculation result in UI.
// ============================================================

export interface ClinicalEnrichment {
  guidelineSource: string
  recommendations: string[]
  nextSteps: string[]
  differentials: string[]
  riskPercentage?: string
}

export const MEDICAL_ENRICHMENTS: Record<string, ClinicalEnrichment> = {

  // ─── CARDIOLOGY (12) ─────────────────────────────────────────────────────

  'cha2ds2-vasc-score': {
    guidelineSource: 'ESC 2023 AF Guidelines / AHA/ACC 2023',
    recommendations: [
      'Score 0 (male) or 1 (female): No antithrombotic therapy recommended.',
      'Score 1 (male) or 2 (female): Consider oral anticoagulation; individualize based on bleeding risk (HAS-BLED).',
      'Score ≥2 (male) or ≥3 (female): Oral anticoagulation strongly recommended (Class I, Level A).',
      'Prefer NOACs (apixaban, rivaroxaban, dabigatran, edoxaban) over warfarin for non-valvular AF.',
      'Always calculate HAS-BLED concurrently to identify modifiable bleeding risk factors.',
    ],
    nextSteps: [
      'Calculate HAS-BLED score to quantify bleeding risk.',
      'If score warrants anticoagulation, confirm renal function (eGFR) and liver function before NOAC selection.',
      'Refer to cardiologist or electrophysiologist for rhythm management discussion.',
      'Educate patient on stroke symptoms and when to seek emergency care.',
      'Schedule 3-month follow-up to assess anticoagulation adherence and tolerability.',
    ],
    differentials: [
      'Score may underestimate risk in Asian populations — use clinical judgment.',
      'Female sex is a risk modifier, not an independent risk factor; score a female-only point only if ≥1 other risk factor present.',
      'Valvular AF (rheumatic mitral stenosis, mechanical prosthesis) requires warfarin — NOACs contraindicated.',
      'Score applies to non-valvular AF only; validate diagnosis before applying.',
    ],
  },

  'heart-score-calculator': {
    guidelineSource: 'Six AJ et al. Neth Heart J 2008 / ACC/AHA Chest Pain Guidelines 2021',
    recommendations: [
      'Score 0–3 (Low): Early discharge safe. No further workup if troponin negative at 0/3h.',
      'Score 4–6 (Moderate): Observation, repeat troponin at 3–6 hours, stress testing or CCTA.',
      'Score 7–10 (High): Early invasive strategy — cardiology consult, consider urgent catheterization.',
      'HEART score ≥4 with elevated troponin: treat as NSTEMI per ACS pathway.',
    ],
    nextSteps: [
      'Obtain serial high-sensitivity troponin at 0 and 1–3 hours.',
      '12-lead ECG within 10 minutes of presentation.',
      'Low-risk (0–3): Shared decision-making for early discharge with outpatient stress testing.',
      'Moderate/High: Cardiology consultation within 2 hours.',
      'Document HEART score in chart to guide ED disposition.',
    ],
    differentials: [
      'HEART score was not validated in patients with known CAD on presentation.',
      'Troponin component relies on institutional assay — calibrate "3× normal" to your lab\'s 99th percentile.',
      'History component is most subjective — assessor training improves reproducibility.',
      'PERC rule should be applied first if PE is the primary concern.',
    ],
  },

  'ldl-cholesterol-calculator': {
    guidelineSource: 'ACC/AHA 2019 Cholesterol Guidelines / AHA 2022',
    recommendations: [
      'LDL <70 mg/dL: Target for very high CVD risk (ASCVD, DM + risk factors).',
      'LDL <100 mg/dL: Target for high CVD risk (10-year risk ≥7.5%).',
      'LDL ≥190 mg/dL: Familial hypercholesterolemia — high-intensity statin + consider ezetimibe/PCSK9i.',
      'If TG >400 mg/dL: Friedewald equation is unreliable — use direct LDL measurement or Martin-Hopkins formula.',
      'Borderline risk (5–7.5%): Discuss statin therapy using risk-enhancing factors.',
    ],
    nextSteps: [
      'If TG >400 mg/dL, order direct LDL-C measurement.',
      'Calculate ASCVD 10-year risk to contextualize LDL result.',
      'Fasting lipid panel preferred; non-fasting acceptable for screening.',
      'Check repeat fasting lipid panel 4–12 weeks after statin initiation.',
      'Consider coronary artery calcium (CAC) score if statin decision is uncertain.',
    ],
    differentials: [
      'Friedewald equation invalid when TG >400 mg/dL — LDL falsely low.',
      'Secondary causes of hyperlipidemia: hypothyroidism, nephrotic syndrome, DM, cholestasis, medications.',
      'Martin-Hopkins equation more accurate at low LDL and high TG.',
      'Non-HDL cholesterol (TC − HDL) is a better predictor at high TG levels.',
    ],
  },

  'timi-risk-score': {
    guidelineSource: 'Antman EM et al. JAMA 2000 / ACC/AHA UA/NSTEMI Guidelines',
    recommendations: [
      'Score 0–2 (Low, ~5% events): Conservative strategy — monitor, serial troponins, stress test.',
      'Score 3–4 (Moderate, ~13–19%): Early invasive strategy within 24–72 hours.',
      'Score 5–7 (High, ~26–41%): Urgent invasive strategy — catheterization within 2–24 hours.',
      'All ACS patients: Dual antiplatelet therapy (aspirin + P2Y12 inhibitor), anticoagulation.',
      'High TIMI: IV UFH or enoxaparin + GP IIb/IIIa inhibitor consideration.',
    ],
    nextSteps: [
      'Serial high-sensitivity troponin every 3–6 hours.',
      'Continuous cardiac monitoring for arrhythmia.',
      'Cardiology consult for score ≥3.',
      'Echocardiogram to assess LV function if troponin elevated.',
      'Ensure NPO status in moderate/high risk for potential catheterization.',
    ],
    differentials: [
      'TIMI UA/NSTEMI score — do not confuse with TIMI STEMI score (different tool).',
      'Aspirin use within 7 days paradoxically scores a point (marker of high-risk plaque).',
      'GRACE score may be more discriminatory for mortality prediction.',
      'Score was derived before high-sensitivity troponin — consider HEART or GRACE in modern practice.',
    ],
  },

  'has-bled-bleeding-score': {
    guidelineSource: 'Pisters R et al. Chest 2010 / ESC 2023 AF Guidelines',
    recommendations: [
      'Score 0–1 (Low): Anticoagulation favored — bleeding risk does not outweigh stroke prevention.',
      'Score 2 (Moderate): Caution — anticoagulate but address modifiable bleeding risk factors.',
      'Score ≥3 (High): High bleeding risk — address ALL modifiable factors before starting anticoagulation. Do not withhold anticoagulation solely based on score.',
      'Modifiable factors: uncontrolled HTN, INR lability, antiplatelet/NSAID use, alcohol excess.',
    ],
    nextSteps: [
      'Address modifiable HAS-BLED risk factors: optimize BP, eliminate NSAIDs, correct INR lability.',
      'High-risk patients still benefit from anticoagulation if CHA₂DS₂-VASc ≥2 — net clinical benefit favors treatment.',
      'If warfarin: aim for TTR >70%; consider switching to NOAC.',
      'Recheck HAS-BLED score after modifiable factors addressed.',
      'PPI therapy for GI bleeding risk reduction in anticoagulated patients.',
    ],
    differentials: [
      'HAS-BLED identifies modifiable risk factors to address — it is NOT a contraindication to anticoagulation.',
      'High HAS-BLED patients still have net clinical benefit from anticoagulation if CHADs score is high.',
      'INR lability only applies to patients on warfarin.',
      'Consider PPI prophylaxis if concurrent antiplatelet therapy.',
    ],
  },

  'grace-acs-score': {
    guidelineSource: 'Eagle KA et al. JAMA 2004 / ACC/AHA ACS Guidelines 2023',
    recommendations: [
      'Score <109 (Low, <1% in-hospital mortality): Conservative management acceptable.',
      'Score 109–140 (Moderate, 1–3%): Early invasive strategy within 24 hours.',
      'Score >140 (High, >3%): Urgent invasive strategy within 2–24 hours.',
      'All patients: Aspirin 325mg loading dose, anticoagulation (UFH or LMWH).',
      'High GRACE: Consider dual antiplatelet (aspirin + ticagrelor or prasugrel).',
    ],
    nextSteps: [
      'Cardiology consultation for all GRACE-calculated ACS patients.',
      'Continuous ECG monitoring and hemodynamic assessment.',
      'Serial troponin and ECG changes determine definitive risk tier.',
      'Left heart catheterization timing based on GRACE score + troponin trend.',
      'Risk-stratify for bleeding before P2Y12 agent selection.',
    ],
    differentials: [
      'GRACE requires creatinine and Killip class — incomplete data reduces accuracy.',
      'Cardiac arrest at presentation heavily weights the score (43 points).',
      'GRACE was validated in unselected ACS populations — better than TIMI for mortality.',
      'Score may underperform in patients with prior revascularization.',
    ],
  },

  'cardiac-output-fick-calculator': {
    guidelineSource: 'Fick A. 1870 / ACC/AHA Heart Failure Guidelines 2022',
    recommendations: [
      'CO <2.5 L/min: Cardiogenic shock threshold — urgent hemodynamic support.',
      'CI <2.2 L/min/m²: Low cardiac index — consider inotropic support or MCS.',
      'CO >8 L/min: High output state — evaluate for sepsis, AV fistula, hyperthyroidism, anemia.',
      'Normal CO 4–8 L/min; CI 2.5–4.0 L/min/m².',
    ],
    nextSteps: [
      'Right heart catheterization for definitive hemodynamic assessment if clinical uncertainty.',
      'Echocardiography to assess LV/RV function, valvular disease.',
      'If low CO: optimize preload, afterload reduction, consider inotropes.',
      'SvO2 monitoring as surrogate for CO in ICU patients on PA catheter.',
      'Vasopressor/inotrope titration based on CO and SVR.',
    ],
    differentials: [
      'Fick principle assumes steady-state VO2 consumption — unreliable in dynamic states.',
      'Assumed VO2 (3 mL/kg/min) introduces error — measured VO2 preferred.',
      'Hemoglobin and saturation values must be simultaneous for accuracy.',
      'Thermodilution method preferred for bedside CO measurement when PA catheter in place.',
    ],
  },

  'warfarin-dose-estimator': {
    guidelineSource: 'Gage BF et al. Clin Pharmacol Ther 2008 / CHEST Antithrombotic Guidelines 2021',
    recommendations: [
      'This is an initial estimate only — titrate warfarin to target INR (2.0–3.0 for most indications; 2.5–3.5 for mechanical mitral valve).',
      'Check INR at 3–5 days after each dose change.',
      'Target therapeutic range for ≥70% of time (TTR) for best outcomes.',
      'Amiodarone significantly inhibits warfarin metabolism — reduce dose by 30–50%.',
      'Diet rich in vitamin K (leafy greens) stabilizes INR — consistency preferred over avoidance.',
    ],
    nextSteps: [
      'Baseline INR, CBC, CMP, LFTs before starting.',
      'Recheck INR at day 3–5 of therapy.',
      'Pharmacy review for drug interactions (fluconazole, antibiotics, amiodarone).',
      'Patient education on signs of bleeding and importance of INR monitoring.',
      'Consider pharmacogenomic testing (VKORC1, CYP2C9) for high-risk patients.',
    ],
    differentials: [
      'Simplified clinical equation — pharmacogenomic models (warfarindosing.org) are more accurate.',
      'Dietary vitamin K intake varies dramatically and affects dosing.',
      'Many drugs interact with warfarin — always check for interactions.',
      'Hepatic dysfunction reduces clotting factor production — use lower doses.',
    ],
  },

  'mean-arterial-pressure-med': {
    guidelineSource: 'Surviving Sepsis Campaign 2021 / ACC/AHA HTN Guidelines 2017',
    recommendations: [
      'MAP <60 mmHg: Organ perfusion threatened — vasopressors if fluid-unresponsive.',
      'MAP <65 mmHg: Sepsis resuscitation target (minimum).',
      'MAP 65–100 mmHg: Normal perfusion range.',
      'MAP >100 mmHg: Investigate secondary causes of hypertension.',
      'Post-cardiac arrest: Target MAP >65 mmHg to preserve cerebral perfusion.',
    ],
    nextSteps: [
      'If MAP <65 mmHg: 30 mL/kg crystalloid bolus; reassess after 1L.',
      'Initiate vasopressors (norepinephrine first-line) if MAP remains <65 after 2L.',
      'Arterial line placement for continuous MAP monitoring in shock.',
      'Lactate measurement to assess tissue perfusion adequacy.',
      'Identify and treat underlying cause of hypotension (sepsis, hemorrhage, cardiac).',
    ],
    differentials: [
      'DBP is weighted twice in MAP — diastolic dysfunction has proportionally larger effect.',
      'Cuff BP may overestimate or underestimate in atrial fibrillation.',
      'Auscultatory vs oscillometric methods may differ by 5–10 mmHg.',
      'Aortic regurgitation causes wide pulse pressure — MAP formula less reliable.',
    ],
  },

  'qtc-interval-med': {
    guidelineSource: 'Bazett HC. Heart 1920 / AHA/ACC QTc Guidelines 2021',
    recommendations: [
      'QTc <440 ms (men) / <460 ms (women): Normal.',
      'QTc 440–500 ms: Borderline/prolonged — review QT-prolonging medications.',
      'QTc >500 ms: High risk for Torsades de Pointes — urgent medication review, consider telemetry.',
      'Discontinue/reduce dose of QT-prolonging drugs when QTc >500 ms or increased >60 ms from baseline.',
      'Correct electrolyte abnormalities (K⁺, Mg²⁺) — hypokalemia worsens QTc.',
    ],
    nextSteps: [
      'Review complete medication list for QT-prolonging agents (crediblemeds.org).',
      'Check serum K⁺, Mg²⁺, Ca²⁺ and correct deficiencies.',
      '12-lead ECG review — measure QT in lead II or V5.',
      'Cardiology consult if QTc >500 ms or symptomatic palpitations.',
      'If drug-induced: consider drug holiday or class substitution.',
    ],
    differentials: [
      'Bazett formula overcorrects at high heart rates — use Fridericia (∛RR) at HR >100.',
      'QTc varies with heart rate — always report corrected value with formula used.',
      'Congenital long QT syndrome (LQTS) types 1–3 require genetic testing.',
      'Bundle branch block prolongs QT — adjusted QTc formulas may be needed.',
    ],
  },

  'blood-pressure-class-med': {
    guidelineSource: 'ACC/AHA 2017 Hypertension Guidelines (Whelton PK et al.)',
    recommendations: [
      'Normal (<120/<80): No intervention — reinforce healthy lifestyle.',
      'Elevated (120–129/<80): Lifestyle modification — DASH diet, sodium restriction, aerobic exercise.',
      'Stage 1 (130–139/80–89): 10-year ASCVD risk ≥10%: initiate antihypertensive + lifestyle. <10%: lifestyle only.',
      'Stage 2 (≥140/≥90): Antihypertensive therapy + lifestyle. Two-drug combination for SBP >150.',
      'Hypertensive Crisis (≥180/≥120): Evaluate for end-organ damage — emergent vs urgent.',
    ],
    nextSteps: [
      'Confirm elevated reading with 2 measurements on 2 separate occasions.',
      'ABPM or home BP monitoring to exclude white-coat hypertension.',
      'Baseline labs: BMP, CBC, UA, fasting lipids, ECG, eGFR.',
      'Screen for secondary causes if resistant or young patient (renal artery stenosis, hyperaldosteronism).',
      'Reassess BP 1 month after medication initiation.',
    ],
    differentials: [
      'White-coat hypertension: office BP elevated, ambulatory BP normal — use ABPM to distinguish.',
      'Pseudohypertension in elderly (calcified arteries) — Osler maneuver.',
      'Auscultatory gap may cause falsely low SBP reading.',
      'Both arms should be measured initially — >15 mmHg difference suggests peripheral arterial disease.',
    ],
  },

  'framingham-risk-med': {
    guidelineSource: 'Wilson PW et al. Circulation 1998 / ACC/AHA 2019 Cholesterol Guidelines',
    recommendations: [
      '<5% (Low): Lifestyle counseling; no statin indicated unless LDL ≥190 or DM.',
      '5–7.5% (Borderline): Discuss risk-enhancing factors; consider statin if risk enhancers present.',
      '7.5–20% (Intermediate): Initiate moderate-to-high intensity statin therapy.',
      '>20% (High): High-intensity statin therapy (atorvastatin 40–80mg or rosuvastatin 20–40mg).',
      'For all: Lifestyle modification — Mediterranean diet, 150 min/week moderate exercise, smoking cessation.',
    ],
    nextSteps: [
      'Fasting lipid panel and fasting glucose to complete risk assessment.',
      'Consider coronary artery calcium (CAC) scoring if treatment decision is uncertain (borderline risk).',
      'ABI measurement if peripheral artery disease suspected.',
      'Reassess CVD risk every 4–6 years or after major risk factor change.',
      'Consider AHA ASCVD Pooled Cohort risk calculator as an alternative/complement.',
    ],
    differentials: [
      'Framingham was derived primarily in white populations — may overestimate risk in some Asian groups.',
      'AHA ASCVD Pooled Cohort calculator is now preferred over Framingham in US guidelines.',
      'Does not account for family history of premature CAD, CRP, CAC, or ABI.',
      'Applies to patients 30–74 years without known CVD — validate age range before use.',
    ],
  },

  // ─── NEPHROLOGY (10) ─────────────────────────────────────────────────────

  'fena-feurea-calculator': {
    guidelineSource: 'Miller TR et al. Ann Intern Med 1978 / KDIGO AKI Guidelines 2012',
    recommendations: [
      'FENa <1%: Suggests pre-renal AKI — aggressive fluid resuscitation with isotonic saline.',
      'FENa >2%: Intrinsic renal failure (ATN) — avoid nephrotoxins, supportive care.',
      'FEUrea <35%: More reliable pre-renal marker when diuretics have been given.',
      'FEUrea >50%: Intrinsic renal injury likely.',
      'Diuretic use: Use FEUrea instead of FENa for pre-renal assessment.',
    ],
    nextSteps: [
      'Urine microscopy — granular/muddy brown casts suggest ATN.',
      'Renal ultrasound to exclude obstructive uropathy.',
      'Fluid challenge (500 mL–1L isotonic saline) — creatinine improvement confirms pre-renal.',
      'Hold nephrotoxic medications (NSAIDs, ACE-I, ARBs, contrast).',
      'Nephrology consult if AKI stage 2–3 or no improvement with fluids.',
    ],
    differentials: [
      'FENa unreliable with diuretics, contrast nephropathy, early obstruction, myoglobinuria.',
      'FEUrea preferred in diuretic-treated patients.',
      'Hepatorenal syndrome: FENa <1% but intrinsic — clinical context essential.',
      'Septic AKI: may have FENa <1% early despite intrinsic injury.',
    ],
  },

  'calcium-correction-calculator': {
    guidelineSource: 'Payne RB et al. Lancet 1973 / Endocrine Society Guidelines',
    recommendations: [
      'Corrected Ca <8.5 mg/dL (Hypocalcemia): IV calcium gluconate if symptomatic (tetany, seizure).',
      'Corrected Ca 8.5–10.5 mg/dL: Normal — no intervention needed.',
      'Corrected Ca 10.5–12 mg/dL (Mild hypercalcemia): IV hydration, identify cause.',
      'Corrected Ca >12 mg/dL (Moderate-Severe): IV fluids + bisphosphonates + calcitonin.',
      'Corrected Ca >14 mg/dL: Emergency — hemodialysis may be required.',
    ],
    nextSteps: [
      'PTH level to differentiate primary hyperparathyroidism from malignancy.',
      'Vitamin D (25-OH) level for hypocalcemia workup.',
      'Renal function and phosphate levels.',
      'EKG: hypocalcemia → prolonged QTc; hypercalcemia → shortened QTc.',
      'If hypercalcemia of malignancy: oncology consult, consider denosumab or bisphosphonates.',
    ],
    differentials: [
      'Corrected calcium is less accurate than ionized calcium — measure ionized Ca in critically ill.',
      'Albumin correction formula assumes normal acid-base status.',
      'Alkalosis increases calcium binding to albumin — ionized Ca falls despite normal total Ca.',
      'Check Mg²⁺ — hypomagnesemia causes refractory hypocalcemia.',
    ],
  },

  'dialysis-adequacy-ktv': {
    guidelineSource: 'Daugirdas JT. JASN 1993 / KDOQI Hemodialysis Adequacy Guidelines 2015',
    recommendations: [
      'spKt/V ≥1.4 per session: Adequate — per KDOQI minimum recommendation.',
      'spKt/V 1.2–1.39: Borderline adequate — optimize session length or blood flow.',
      'spKt/V <1.2: Inadequate — increase dialysis time, blood flow rate, or membrane size.',
      'Alternate target: URR ≥70% (urea reduction ratio).',
      'Peritoneal dialysis target: weekly Kt/V ≥1.7.',
    ],
    nextSteps: [
      'Review access adequacy (fistula, graft, catheter blood flow rates).',
      'Increase session time (if 3×/week, consider 4× or longer sessions).',
      'Increase blood flow rate and/or dialysate flow rate.',
      'Consider higher-flux membrane or hemodiafiltration.',
      'Re-measure Kt/V monthly until target achieved.',
    ],
    differentials: [
      'Single-pool Kt/V overestimates adequacy compared to equilibrated (eKt/V).',
      'Residual renal function should be added to dialysis Kt/V for total weekly clearance.',
      'Measurement requires accurate pre/post BUN from same session — collect correctly.',
      'Access recirculation will falsely improve post-dialysis BUN and overestimate Kt/V.',
    ],
  },

  'water-deficit-hypernatremia': {
    guidelineSource: 'Adrogue HJ, Madias NE. NEJM 2000 / UpToDate Hypernatremia Protocol',
    recommendations: [
      'Correct hypernatremia SLOWLY — maximum 10–12 mEq/L per 24 hours.',
      'Acute hypernatremia (<48h): Can correct at 1 mEq/L/hr.',
      'Chronic hypernatremia (>48h or unknown): Correct at 0.5 mEq/L/hr.',
      'Use D5W (free water) or 0.45% saline for correction.',
      'Monitor serum Na every 2–4 hours during correction.',
    ],
    nextSteps: [
      'Calculate and replace 50% of water deficit in first 12–24 hours.',
      'Replace ongoing losses (insensible, urinary, GI) in addition to deficit.',
      'Identify and treat underlying cause: DI, osmotic diuresis, GI losses.',
      'Urine osmolality to distinguish central vs nephrogenic DI.',
      'Endocrinology consult if central DI suspected (desmopressin therapy).',
    ],
    differentials: [
      'Over-rapid correction risks cerebral edema (rebound) — avoid lowering >12 mEq/L/24h.',
      'Hypernatremia from pure water loss vs sodium excess has different management.',
      'Urine osmolality: >600 mOsm/kg = extra-renal loss; <200 mOsm/kg = diabetes insipidus.',
      'TBW fraction varies: elderly/obese patients have lower TBW fraction.',
    ],
  },

  'mdrd-egfr-calculator': {
    guidelineSource: 'Levey AS et al. Ann Intern Med 1999 / KDIGO CKD Guidelines 2022',
    recommendations: [
      'eGFR ≥60: No CKD unless structural or urine markers present.',
      'eGFR 30–59 (G3): Moderate reduction — manage complications, CKD clinic referral.',
      'eGFR 15–29 (G4): Severe reduction — prepare for renal replacement therapy.',
      'eGFR <15 (G5): Kidney failure — dialysis or transplant evaluation.',
      'Note: CKD-EPI 2021 is now preferred over MDRD for CKD staging.',
    ],
    nextSteps: [
      'Urine albumin-to-creatinine ratio (UACR) for complete CKD risk classification.',
      'Blood pressure target <130/80 in CKD.',
      'ACE-I or ARB for proteinuric CKD (UACR >300 mg/g).',
      'Finerenone for CKD + DM with UACR >300 mg/g.',
      'Nephrology referral: eGFR <30 or rapidly declining eGFR.',
    ],
    differentials: [
      'MDRD underestimates eGFR in the normal-high range (>60) — CKD-EPI 2021 preferred.',
      'Race adjustment in original MDRD: the 2021 CKD-EPI equation removed race adjustment.',
      'eGFR is unreliable during AKI — represents steady-state only.',
      'Creatinine low in sarcopenic/malnourished patients → eGFR overestimated.',
    ],
  },

  'urine-anion-gap-calculator': {
    guidelineSource: 'Batlle DC et al. NEJM 1988 / Emmett M, Narins RG. Medicine 1977',
    recommendations: [
      'UAG negative (GI loss): Treat underlying diarrhea; oral bicarbonate replacement.',
      'UAG positive (renal cause): Evaluate for distal RTA, ureterosigmoidostomy.',
      'Combine with serum AG to classify metabolic acidosis completely.',
      'Consider fludrocortisone for Type 1 RTA with positive UAG.',
    ],
    nextSteps: [
      'Urine pH: <5.5 in diarrhea (normal); >5.5 in distal RTA.',
      'Serum K⁺: hypokalemia in diarrhea and Type 1/2 RTA; hyperkalemia in Type 4.',
      'If positive UAG: check urine pH, serum K⁺, plasma renin/aldosterone.',
      'Nephrology consult for confirmed RTA.',
    ],
    differentials: [
      'UAG unreliable if urine Na <20 mEq/L (sodium depletion limits NH4⁺ excretion).',
      'Hippurate excretion (toluene ingestion) causes large negative UAG — confounding.',
      'Always interpret in context of serum AG and clinical picture.',
    ],
  },

  'renal-drug-dose-adjuster': {
    guidelineSource: 'Aronoff GR et al. Drug Prescribing in Renal Failure 2007 / Lexicomp',
    recommendations: [
      'CrCl >60 mL/min: Full dose for most renally-cleared drugs.',
      'CrCl 30–60: Moderate dose reduction (typically 50–75% of normal dose or extended interval).',
      'CrCl 10–30: Significant dose reduction — consult specific drug monograph.',
      'CrCl <10 / ESRD: Avoid or use with extreme caution; dialysis dose supplement may be needed.',
      'Always verify with Lexicomp/Micromedex — general estimates only.',
    ],
    nextSteps: [
      'Obtain accurate CrCl using Cockcroft-Gault (not CKD-EPI) for drug dosing.',
      'Verify dose adjustment with clinical pharmacist for high-alert medications.',
      'Monitor drug levels (vancomycin, aminoglycosides, digoxin) if available.',
      'Reassess CrCl if patient condition changes (AKI, dehydration, diuresis).',
    ],
    differentials: [
      'Use Cockcroft-Gault CrCl (not eGFR) — most pharmacokinetic studies used CG.',
      'Adjust body weight: use IBW for obese patients in CG equation.',
      'Dialysis removes some drugs — supplement dose post-dialysis (e.g., vancomycin, meropenem).',
      'Hepatic metabolism drugs (e.g., most statins) require liver rather than renal adjustment.',
    ],
  },

  'kidney-failure-risk-equation': {
    guidelineSource: 'Tangri N et al. JAMA 2011 / KDIGO CKD Guidelines 2022',
    recommendations: [
      '2-year risk <5%: Low risk — conservative CKD management, annual monitoring.',
      '2-year risk 5–20%: Moderate risk — intensify CKD care, nephrology referral.',
      '2-year risk >20%: High risk — expedited nephrology referral, RRT planning.',
      'Initiate ACE-I/ARB for all CKD patients with UACR >30 mg/g.',
      'SGLT2 inhibitor: cardioprotective and renoprotective in CKD ± DM.',
    ],
    nextSteps: [
      'Nephrology referral for 2-year risk >20% or eGFR <30.',
      'Discuss renal replacement therapy options early (HD, PD, transplant).',
      'Optimize cardiovascular risk (BP <130/80, statin, antiplatelet).',
      'Hepatitis B vaccination if not already immune (eGFR <30).',
      'Erythropoiesis-stimulating agent evaluation if Hgb <10 g/dL.',
    ],
    differentials: [
      'Equation validated in CKD stages 3–5 — less reliable at eGFR >60.',
      'UACR >1000 mg/g (nephrotic range) may exceed equation calibration.',
      'Acute illness falsely lowers eGFR — use stable outpatient values.',
    ],
  },

  'creatinine-clearance-med': {
    guidelineSource: 'Cockcroft DW, Gault MH. Nephron 1976 / ASHP Drug Dosing Guidelines',
    recommendations: [
      'Use Cockcroft-Gault CrCl (not eGFR) for drug dose adjustment.',
      'CrCl ≥60: Full dose for most renally-cleared medications.',
      'CrCl 30–59: Moderate dose reduction — verify each drug individually.',
      'CrCl <30: Significant dose reduction or avoidance.',
      'Obesity: Use adjusted body weight (IBW + 0.4 × excess weight) in CG formula.',
    ],
    nextSteps: [
      'Pharmacy consultation for all renally-adjusted high-alert medications.',
      'Monitor creatinine every 48–72h in hospitalized patients with AKI risk.',
      'Avoid NSAIDs, nephrotoxic contrast, aminoglycosides when CrCl declining.',
      'Correct dehydration before prescribing renally-cleared drugs.',
    ],
    differentials: [
      'CG overestimates CrCl in elderly cachectic patients — creatinine production reduced.',
      'Not validated for children — use Schwartz formula for pediatric CrCl.',
      'Acute CrCl change (AKI) makes CG unreliable — trending direction more meaningful.',
    ],
  },

  'egfr-ckd-epi-med': {
    guidelineSource: 'Inker LA et al. NEJM 2021 / KDIGO CKD Guidelines 2022',
    recommendations: [
      'eGFR ≥90 (G1): Normal/high — CKD only if urine markers or structural damage present.',
      'eGFR 60–89 (G2): Mildly decreased — monitor annually.',
      'eGFR 45–59 (G3a): Mildly-moderately decreased — 6-monthly monitoring.',
      'eGFR 30–44 (G3b): Moderately-severely decreased — nephrology referral, 3-monthly.',
      'eGFR 15–29 (G4): Severely decreased — RRT planning, 3-monthly.',
      'eGFR <15 (G5): Kidney failure — initiate RRT or conservative care.',
    ],
    nextSteps: [
      'Add UACR to complete KDIGO CKD risk heat-map classification.',
      'ACE-I or ARB for proteinuria >30 mg/g — titrate to maximum tolerated dose.',
      'SGLT2 inhibitor regardless of DM status if eGFR 20–45 + proteinuria.',
      'Avoid nephrotoxins: NSAIDs, aminoglycosides, iodinated contrast.',
    ],
    differentials: [
      'CKD-EPI 2021 is race-free — do not apply race adjustment.',
      'eGFR underestimates true GFR in advanced CKD (G4–G5) — cystatin C-based eGFR more accurate.',
      'Muscle mass affects creatinine — bodybuilders may have lower eGFR despite normal GFR.',
    ],
  },

  // ─── CRITICAL CARE (11) ─────────────────────────────────────────────────

  'abg-interpreter': {
    guidelineSource: 'Narins RG, Emmett M. Medicine 1980 / ARDS Network Protocol',
    recommendations: [
      'Respiratory acidosis (↓pH, ↑PaCO2): Improve ventilation — NPPV or intubation if severe.',
      'Metabolic acidosis (↓pH, ↓HCO3): Identify cause (MUDPILES), treat underlying etiology.',
      'Respiratory alkalosis (↑pH, ↓PaCO2): Treat pain/anxiety; reduce ventilator rate if over-ventilated.',
      'Metabolic alkalosis (↑pH, ↑HCO3): Replace Cl⁻ and K⁺; hold diuretics.',
      'SpO2 target 94–98% (ARDS: 88–92% to avoid hyperoxia toxicity).',
    ],
    nextSteps: [
      'Repeat ABG in 1–2 hours after any ventilator or treatment change.',
      'Check lactate for metabolic acidosis with elevated anion gap.',
      'If PaO2/FiO2 <200: Berlin criteria for ARDS — consider lung-protective ventilation.',
      'Mechanical ventilation: Tidal volume 6 mL/kg IBW, plateau pressure <30 cmH2O.',
      'Point-of-care co-oximetry for carboxyhemoglobin if CO poisoning suspected.',
    ],
    differentials: [
      'Mixed disorders common in ICU — pH may be "normal" despite underlying acid-base chaos.',
      'Peripheral SpO2 unreliable in poor perfusion, methemoglobinemia, CO poisoning.',
      'Venous blood gas (VBG) pH correlates with arterial pH ±0.03 — adequate for screening.',
      'Compensatory changes never fully correct pH — overcorrection suggests mixed disorder.',
    ],
  },

  'iv-fluid-rate-calculator': {
    guidelineSource: 'NICE IV Fluid Guidelines 2013 / Surviving Sepsis Campaign 2021',
    recommendations: [
      'Resuscitation fluids: Balanced crystalloids (lactated Ringer\'s or Plasmalyte) preferred over NS.',
      '0.9% NS: Acceptable for specific indications (hyperkalemia, metabolic alkalosis).',
      'Large volume NS (>3L) causes hyperchloremic metabolic acidosis — use balanced crystalloids.',
      'Sepsis resuscitation: 30 mL/kg crystalloid in first 3 hours, then dynamic assessment.',
      'Maintenance: Holliday-Segar for pediatrics; 1–2 mL/kg/hr for adults.',
    ],
    nextSteps: [
      'Assess fluid responsiveness before each 500 mL bolus (passive leg raise test).',
      'Monitor for fluid overload: crackles, edema, increased O2 requirement.',
      'ARDS patients: conservative fluid strategy after resuscitation (FACTT trial).',
      'Electrolyte supplementation based on daily labs.',
    ],
    differentials: [
      'IV rate and drop factor must match actual administration set — verify before programming.',
      'Gravity drip rates affected by patient position, cannula size, IV bag height.',
      'Use infusion pump for vasoactive drugs and precise medication delivery.',
    ],
  },

  'qsofa-sepsis-score': {
    guidelineSource: 'Seymour CW et al. JAMA 2016 / Surviving Sepsis Campaign 2021',
    recommendations: [
      'qSOFA ≥2: High risk for sepsis — initiate 1-hour sepsis bundle immediately.',
      '1-hour bundle: Blood cultures ×2, lactate, broad-spectrum antibiotics, IV fluids 30 mL/kg.',
      'qSOFA <2: Does not rule out sepsis — use clinical judgment.',
      'SOFA score: Full assessment for confirmed sepsis patients in ICU.',
    ],
    nextSteps: [
      'Blood cultures (×2 sites) BEFORE antibiotics — within 45 minutes.',
      'Empiric broad-spectrum antibiotics within 1 hour of sepsis recognition.',
      'Lactate measurement — if >4 mmol/L, aggressive resuscitation warranted.',
      'ICU/step-down bed allocation for qSOFA ≥2.',
      'Reassess response to fluids and vasopressors at 1–2 hours.',
    ],
    differentials: [
      'qSOFA sensitivity for sepsis is ~70% — a negative score does not exclude sepsis.',
      'Full SOFA score more specific for sepsis but requires laboratory values.',
      'NEWS2 score performs comparably to qSOFA for early sepsis detection.',
      'Immunocompromised patients may have sepsis without fever or leukocytosis.',
    ],
  },

  'apache-ii-score': {
    guidelineSource: 'Knaus WA et al. Crit Care Med 1985 / SCCM ICU Guidelines',
    recommendations: [
      'APACHE II 0–9: Low severity — ~4% predicted hospital mortality.',
      'APACHE II 10–19: Moderate — ~15% mortality. ICU-level care recommended.',
      'APACHE II 20–29: High — ~40% mortality. Full ICU support, goals of care discussion.',
      'APACHE II ≥30: Very high — >73% mortality. Palliative care consult appropriate.',
    ],
    nextSteps: [
      'Recalculate APACHE II on ICU day 1 using worst 24-hour values.',
      'Serial APACHE II trending guides clinical trajectory assessment.',
      'Goals of care discussion for APACHE II >25 with family/surrogate.',
      'Daily multidisciplinary rounds for high-APACHE patients.',
    ],
    differentials: [
      'APACHE II was derived in 1980s ICU population — modern treatments reduce actual mortality.',
      'Assumes worst 24-hour values — timing of measurement critical.',
      'GCS score confounded by sedation — score GCS before sedatives when possible.',
      'Does not account for code status, lead-time bias, or chronic disease quality.',
    ],
  },

  'pecarn-head-injury-tool': {
    guidelineSource: 'Kuppermann N et al. Lancet 2009 / PECARN Study Group',
    recommendations: [
      'Low-risk features absent, <2 years: CT not indicated — observation 4–6 hours.',
      'Intermediate-risk features: Shared decision-making; CT vs observation based on clinical judgment.',
      'High-risk features (GCS <15, palpable skull fracture): CT head immediately.',
      'PECARN has >99% sensitivity for clinically important TBI — high negative predictive value.',
    ],
    nextSteps: [
      'Document exact mechanism, symptoms, and neurological exam findings.',
      'Observation period (4–6 hours) if CT not immediately indicated.',
      'If observation chosen: discharge instructions for red flag return symptoms.',
      'Neurosurgery consultation for CT-identified lesions.',
      'Return precautions: worsening headache, vomiting >3×, seizure, altered behavior.',
    ],
    differentials: [
      'PECARN applies to minor head injury (GCS 14–15) — not for severe TBI.',
      'Age split at 2 years — different criteria apply for <2 vs ≥2 years.',
      'Skull base fracture may not be palpable — clinical signs (Battle\'s sign, racoon eyes).',
      'Scalp hematoma in <2 years is the strongest predictor in that age group.',
    ],
  },

  'glasgow-coma-med': {
    guidelineSource: 'Teasdale G, Jennett B. Lancet 1974 / TBI Management Guidelines',
    recommendations: [
      'GCS 13–15 (Mild TBI): CT head if PECARN or Canadian CT rules positive.',
      'GCS 9–12 (Moderate TBI): CT head, hospital admission, neurosurgery consultation.',
      'GCS ≤8 (Severe TBI): Intubation for airway protection, urgent CT, ICP monitoring.',
      'GCS <8 is the traditional threshold for intubation ("protect the airway").',
      'Neurosurgical intervention threshold: GCS deterioration, intracranial hemorrhage.',
    ],
    nextSteps: [
      'Secure airway if GCS ≤8 (RSI intubation).',
      'CT head without contrast urgently.',
      'Avoid hypotension (SBP >90) and hypoxia (SpO2 >94%) in TBI.',
      'Target MAP ≥80 mmHg with ICP monitoring; CPP ≥60 mmHg.',
      'Neurosurgery consult for moderate-severe TBI.',
    ],
    differentials: [
      'Always document as E_V_M_ not just total — GCS 8 = E2V2M4 is different from E4V1M3.',
      'Intubated patients: verbal score recorded as "T" — modify total accordingly.',
      'Drugs, alcohol, metabolic encephalopathy cause GCS depression without structural injury.',
      'Bilateral periorbital swelling prevents eye score assessment — document "unable to assess."',
    ],
  },

  'sofa-sepsis-med': {
    guidelineSource: 'Vincent JL et al. Intensive Care Med 1996 / Sepsis-3 Taskforce 2016',
    recommendations: [
      'SOFA ≥2 increase from baseline + suspected infection = Sepsis (Sepsis-3 definition).',
      'SOFA ≥2 + vasopressor requirement + lactate >2 mmol/L = Septic Shock.',
      'SOFA 0–6: <10% mortality — standard ICU care.',
      'SOFA 7–9: 15–20% mortality — optimize organ support.',
      'SOFA ≥11: >40% mortality — escalate therapy, goals of care discussion.',
    ],
    nextSteps: [
      'Implement Surviving Sepsis Campaign 1-hour bundle.',
      'Vasopressor: norepinephrine first-line for septic shock (MAP <65 despite fluids).',
      'Hydrocortisone 200 mg/day if vasopressor-dependent after adequate resuscitation.',
      'Lung-protective ventilation for ARDS component (SOFA respiratory ≥2).',
      'Reassess SOFA daily — rising score indicates deterioration.',
    ],
    differentials: [
      'SOFA requires laboratory values — qSOFA for rapid bedside screening.',
      'Baseline SOFA score matters — a score of 2 is significant only with organ dysfunction change.',
      'Sedation confounds neurological component — score before sedation initiation.',
      'Pre-existing organ dysfunction (CKD, cirrhosis) complicates SOFA interpretation.',
    ],
  },

  'anion-gap-med': {
    guidelineSource: 'Emmett M, Narins RG. Medicine 1977 / Winters formula',
    recommendations: [
      'Normal AG (8–12): Non-anion gap metabolic acidosis — evaluate HCO3 loss (diarrhea, RTA).',
      'Elevated AG (>12): MUDPILES causes — Methanol, Uremia, DKA, Propylene glycol, INH/Iron, Lactic acidosis, Ethylene glycol, Salicylates.',
      'Always check albumin-corrected AG — hypoalbuminemia masks elevated AG.',
      'Delta-delta ratio [(AG-12)/(24-HCO3)]: 1–2 = pure AGMA; <1 = mixed AGMA + NAGMA; >2 = AGMA + metabolic alkalosis.',
    ],
    nextSteps: [
      'Lactate level for lactic acidosis workup.',
      'Serum osmolal gap for toxic alcohol (methanol, ethylene glycol) ingestion.',
      'Urine ketones and glucose for DKA.',
      'Salicylate level if aspirin overdose suspected.',
      'Nephrology consult for unexplained elevated AG acidosis.',
    ],
    differentials: [
      'Hypoalbuminemia causes low AG — correct: AG + 2.5 × (4.0 - albumin).',
      'Hyperchloremia from NS infusion causes non-AG metabolic acidosis.',
      'Mixed disorders common — delta-delta ratio identifies concurrent metabolic disturbances.',
    ],
  },

  'wells-score-med': {
    guidelineSource: 'Wells PS et al. Ann Intern Med 1998 / ASH VTE Guidelines 2020',
    recommendations: [
      'Low probability (≤0): D-dimer testing; if negative — DVT excluded. If positive — ultrasound.',
      'Moderate probability (1–2): Ultrasound or D-dimer if high-sensitivity assay available.',
      'High probability (≥3): Proximal ultrasound immediately; treat if positive.',
      'Anticoagulation: DOAC preferred (rivaroxaban, apixaban) over LMWH+warfarin.',
    ],
    nextSteps: [
      'D-dimer (age-adjusted threshold: age × 10 μg/L if >50 years) for low/moderate probability.',
      'Proximal compression ultrasound for moderate-high probability.',
      'If ultrasound negative + high clinical suspicion: repeat ultrasound in 5–7 days.',
      'CTPA for suspected PE — calculate Wells PE score for pulmonary embolism.',
      'Anticoagulation if DVT confirmed: DOAC ×3 months minimum.',
    ],
    differentials: [
      'D-dimer elevated by many conditions (infection, malignancy, pregnancy, surgery) — low specificity.',
      'Wells DVT score — separate from Wells PE score; do not confuse.',
      'Bilateral DVT may not cause asymmetric swelling — clinical suspicion essential.',
      'Calf DVT lower risk for PE than proximal — treatment decision varies by guidelines.',
    ],
  },

  'curb65-med': {
    guidelineSource: 'Lim WS et al. Thorax 2003 / IDSA/ATS CAP Guidelines 2019',
    recommendations: [
      'CURB-65 0–1: Low severity — outpatient oral antibiotics (amoxicillin or doxycycline).',
      'CURB-65 2: Moderate — short-stay hospitalization or close outpatient follow-up.',
      'CURB-65 3–5: Severe — hospital admission; CURB ≥4 or 5: consider ICU.',
      'Add PSI/PORT class for additional risk stratification decision support.',
    ],
    nextSteps: [
      'Blood cultures ×2 before antibiotics if hospitalized.',
      'Sputum culture and Gram stain (expectorated or induced).',
      'Urine pneumococcal and Legionella antigens for severe CAP.',
      'Oxygen to maintain SpO2 ≥94%.',
      'Reassess at 48–72 hours — clinical stability criteria for step-down.',
    ],
    differentials: [
      'BUN >19 mg/dL (urea >7 mmol/L) — US laboratories report BUN, not urea.',
      'CURB-65 performs similar to PSI/PORT but simpler — PSI may be more sensitive for low risk.',
      'Immunocompromised patients may have severe CAP with low CURB-65 score.',
      'Aspiration pneumonia and healthcare-associated pneumonia require different antibiotic coverage.',
    ],
  },

  'burn-surface-area-med': {
    guidelineSource: 'Baxter CR. Surg Clin North Am 1978 / ABA Guidelines',
    recommendations: [
      'TBSA <10%: Minor burns — outpatient wound care if full-thickness <2% TBSA.',
      'TBSA 10–20%: Moderate — hospital admission, early excision and grafting consideration.',
      'TBSA ≥20% or full-thickness >10%: Major burn — burn center transfer.',
      'Parkland formula: 4 mL × kg × %TBSA LR in 24h (50% in first 8h from time of burn, not admission).',
    ],
    nextSteps: [
      'Immediate: airway assessment (singed nasal hair, hoarseness, stridor = inhalation injury).',
      'IV access × 2 large-bore peripheral lines; foley catheter for UO monitoring (target 0.5–1 mL/kg/hr).',
      'Wound cooling: tepid (not cold) water ≤30 min within 3 hours.',
      'Transfer to ABA-verified burn center for major burns.',
      'Pain management: IV opioids, ketamine for dressing changes.',
    ],
    differentials: [
      'Lund and Browder chart more accurate than Rule of 9s — especially for children.',
      'Superficial (first-degree) burns excluded from TBSA calculation.',
      'Parkland formula is a starting point — adjust rate every 1–2 hours based on UO.',
      'Inhalation injury worsens prognosis significantly regardless of TBSA.',
    ],
  },

  // ─── PSYCHIATRY (9) ─────────────────────────────────────────────────────

  'phq9-med': {
    guidelineSource: 'Kroenke K, Spitzer RL. JGIM 2002 / APA Practice Guidelines 2022',
    recommendations: [
      'Score 0–4 (Minimal): No treatment; watchful waiting.',
      'Score 5–9 (Mild): Watchful waiting, follow-up in 2–4 weeks, psychoeducation.',
      'Score 10–14 (Moderate): Treatment plan — psychotherapy (CBT) and/or antidepressant.',
      'Score 15–19 (Moderately severe): Initiate SSRI and refer for psychotherapy.',
      'Score 20–27 (Severe): Immediate psychiatric evaluation; risk assess for safety.',
      'Item 9 (SI): Any score >0 — direct clinical assessment for suicidal ideation.',
    ],
    nextSteps: [
      'If score ≥10: Initiate treatment; reassess in 4–6 weeks.',
      'Rule out bipolar disorder before starting antidepressant (MDQ screening).',
      'Thyroid function tests (TSH) to exclude hypothyroidism mimicking depression.',
      'Safety assessment for suicidal ideation if item 9 >0.',
      'PHQ-9 at each visit to track treatment response (≥5-point drop = meaningful response).',
    ],
    differentials: [
      'PHQ-9 screens for depression — not diagnostic for MDD; requires clinical interview (DSM-5).',
      'Somatic symptoms (fatigue, sleep) may reflect medical illness rather than depression.',
      'Bereavement, grief reactions may produce high scores — distinguish from MDD.',
      'Bipolar depression: SSRI monotherapy worsens course — screen for hypomania before treating.',
    ],
  },

  'gad7-anxiety-score': {
    guidelineSource: 'Spitzer RL et al. Arch Intern Med 2006 / APA Anxiety Guidelines 2023',
    recommendations: [
      'Score 0–4: Minimal anxiety — reassurance, lifestyle counseling.',
      'Score 5–9: Mild — watchful waiting, relaxation techniques, repeat in 2–4 weeks.',
      'Score 10–14: Moderate — CBT psychotherapy and/or SSRI/SNRI.',
      'Score 15–21: Severe — psychiatric referral, initiate SSRI (e.g., sertraline 50mg), consider short-term benzodiazepine.',
    ],
    nextSteps: [
      'Assess for specific anxiety disorders (panic, social anxiety, OCD, PTSD) — GAD-7 screens broadly.',
      'Rule out medical causes: hyperthyroidism, cardiac arrhythmia, stimulant use.',
      'PHQ-9 co-administration — depression and anxiety commonly co-occur.',
      'Reassess GAD-7 at 4–8 weeks of treatment.',
      'Refer to CBT-trained therapist — first-line psychological treatment for GAD.',
    ],
    differentials: [
      'GAD-7 screens for generalized anxiety — poor discrimination from other anxiety disorders.',
      'Caffeine, stimulants, withdrawal syndromes mimic anxiety symptoms.',
      'Medical conditions (hyperthyroidism, COPD, cardiac disease) cause anxiety-like symptoms.',
      'PTSD often scores high on GAD-7 — use PCL-5 for trauma screening.',
    ],
  },

  'nihss-stroke-scale': {
    guidelineSource: 'Brott T et al. Stroke 1989 / AHA/ASA Stroke Guidelines 2019',
    recommendations: [
      'NIHSS 0: No stroke deficit — investigate TIA.',
      'NIHSS 1–4 (Minor): tPA if within 4.5h and imaging negative for hemorrhage; thrombectomy criteria individually assessed.',
      'NIHSS 5–15 (Moderate): IV alteplase if ≤4.5h from onset + no contraindications; thrombectomy for proximal LVO.',
      'NIHSS 16–20 (Moderate-Severe): Mechanical thrombectomy if LVO confirmed; tPA as bridge.',
      'NIHSS >20 (Severe): Thrombectomy — imaging selection (ASPECTS, perfusion) guides candidacy.',
    ],
    nextSteps: [
      'STAT non-contrast CT head and CT angiography of head and neck.',
      'tPA eligibility checklist: onset <4.5h, no hemorrhage, BP <185/110.',
      'Activate stroke team — door-to-needle time target <45 minutes.',
      'MRI DWI for wake-up strokes or uncertain onset time.',
      'Neurosurgery consultation for hemorrhagic transformation or cerebellar stroke.',
    ],
    differentials: [
      'NIHSS is assessor-dependent — NIHSS certification improves reliability.',
      'Isolated cortical deficits (aphasia without hemiparesis) may score low but be clinically severe.',
      'Posterior circulation strokes often score low despite significant deficits.',
      'Seizure (Todd\'s paralysis), hypoglycemia, complex migraine mimic stroke — check glucose.',
    ],
  },

  'mmse-cognitive-screen': {
    guidelineSource: 'Folstein MF et al. J Psychiatr Res 1975 / Alzheimer\'s Association Guidelines',
    recommendations: [
      'Score 27–30: Normal — no further workup unless clinical concern.',
      'Score 24–26: Mild impairment — full neuropsychological evaluation, repeat in 6 months.',
      'Score 18–23: Moderate impairment — dementia workup, neuropsychology referral.',
      'Score <18: Severe impairment — comprehensive dementia evaluation, safety assessment.',
      'Copyrighted tool: Brief Cognitive Assessment Tool (BCAT) or MoCA used in clinical practice.',
    ],
    nextSteps: [
      'MoCA (Montreal Cognitive Assessment) for more sensitive mild cognitive impairment detection.',
      'Laboratory workup: TSH, B12, folate, CBC, BMP, VDRL (treatable causes).',
      'Neuroimaging (MRI brain) to identify structural causes.',
      'Neuropsychological testing for comprehensive cognitive domain assessment.',
      'Assess safety: driving, finances, medication management.',
    ],
    differentials: [
      'MMSE is education-biased — poorly educated patients may score low without dementia.',
      'Delirium, depression, and metabolic encephalopathy cause acute cognitive decline — not dementia.',
      'MoCA is more sensitive for MCI than MMSE.',
      'Does not reliably detect frontal lobe or executive dysfunction.',
    ],
  },

  'epworth-sleepiness-scale': {
    guidelineSource: 'Johns MW. Sleep 1991 / AASM Sleep Disorder Guidelines 2014',
    recommendations: [
      'Score 0–10: Normal daytime sleepiness.',
      'Score 11–15: Mild-moderate excessive daytime sleepiness — sleep hygiene counseling.',
      'Score 16–20: Moderate-severe — polysomnography (PSG) or home sleep apnea test (HSAT).',
      'Score 21–24: Severe — urgent sleep medicine referral; driving restriction counseling.',
      'If OSA suspected: AHI-directed CPAP therapy is first-line.',
    ],
    nextSteps: [
      'STOP-BANG questionnaire for obstructive sleep apnea screening.',
      'Home sleep apnea test (HSAT) if OSA high probability and no complex comorbidities.',
      'PSG for central sleep apnea, narcolepsy, periodic limb movement disorder.',
      'Driver safety assessment — excessive sleepiness is a road safety risk.',
      'Reassess ESS after 6–8 weeks of CPAP therapy.',
    ],
    differentials: [
      'ESS measures habitual tendency to fall asleep — not fatigue or insomnia.',
      'Multiple causes: OSA, narcolepsy, restless legs, circadian disorder, medication effect.',
      'OSA: pauses in breathing, witnessed apneas, morning headache, nocturia.',
      'Narcolepsy: cataplexy, sleep paralysis, hypnagogic hallucinations + high ESS.',
    ],
  },

  'audit-c-alcohol-screening': {
    guidelineSource: 'Bush K et al. Arch Intern Med 1998 / USPTF Alcohol Screening 2018',
    recommendations: [
      'Score ≤2 (Low risk): Reinforce safe limits (men ≤14 drinks/week; women ≤7/week).',
      'Score 3–4 (Hazardous): Brief intervention (5-min counseling) — FRAMES model.',
      'Score ≥5 (High risk): Full AUDIT-10; consider alcohol use disorder diagnosis.',
      'Confirmed AUD: Motivational interviewing, pharmacotherapy (naltrexone, acamprosate, disulfiram).',
    ],
    nextSteps: [
      'Complete AUDIT-10 questionnaire for comprehensive assessment.',
      'LFTs, GGT, MCV — indirect markers of heavy alcohol use.',
      'CIWA-Ar if physical dependence suspected before recommending cessation.',
      'Addiction medicine or behavioral health referral for AUD diagnosis.',
      'Annual re-screening for all adults per USPSTF.',
    ],
    differentials: [
      'AUDIT-C sensitivity for alcohol dependence lower than AUDIT-10 — a positive AUDIT-C warrants AUDIT-10.',
      'Standard drink definition varies by country — ensure patient understands local standard.',
      'Social desirability bias causes underreporting — biomarkers (CDT, EtG) may supplement.',
    ],
  },

  'ciwa-ar-withdrawal-scale': {
    guidelineSource: 'Sullivan JT et al. Br J Addict 1989 / ASAM Alcohol Withdrawal Guidelines 2020',
    recommendations: [
      'Score <8 (Minimal): Supportive care, oral thiamine, electrolytes.',
      'Score 8–14 (Mild-moderate): Symptom-triggered benzodiazepine (lorazepam 1–2mg PO q1h PRN).',
      'Score 15–19 (Moderate-severe): Standing + PRN benzodiazepine; IV access.',
      'Score ≥20 (Severe): ICU admission; IV diazepam or lorazepam; propofol for refractory cases.',
      'All alcohol withdrawal: Thiamine 100mg IV BEFORE glucose (prevent Wernicke\'s encephalopathy).',
    ],
    nextSteps: [
      'Thiamine 100mg IV TID for 3 days minimum.',
      'Correct electrolytes: K⁺, Mg²⁺, PO4²⁻.',
      'Seizure prophylaxis: benzodiazepine therapy reduces seizure risk 50–80%.',
      'EEG if seizure activity suspected.',
      'Delirium tremens (CIWA >25 + autonomic instability): ICU-level monitoring.',
    ],
    differentials: [
      'Requires clinical assessment — not a questionnaire; trained staff administer.',
      'Delirium tremens occurs 48–72h after last drink — most dangerous stage.',
      'Seizures typically occur 12–48h after cessation — CIWA may be low at time of seizure.',
      'Wernicke\'s encephalopathy: confusion + ophthalmoplegia + ataxia — thiamine emergency.',
    ],
  },

  // ─── ENDOCRINOLOGY (10) ─────────────────────────────────────────────────

  'bmi-calculator': {
    guidelineSource: 'WHO BMI Classification 2000 / AHA/ACC/TOS Obesity Guidelines 2013',
    recommendations: [
      'BMI <18.5 (Underweight): Nutritional assessment, evaluate for malabsorption or eating disorder.',
      'BMI 18.5–24.9 (Normal): Maintain healthy weight; annual monitoring.',
      'BMI 25–29.9 (Overweight): 5–10% weight loss reduces cardiometabolic risk significantly.',
      'BMI 30–34.9 (Obese I): Structured lifestyle program + pharmacotherapy if comorbidities.',
      'BMI 35–39.9 with comorbidities or BMI ≥40: Bariatric surgery evaluation.',
    ],
    nextSteps: [
      'Waist circumference: Men >102 cm (40 in), Women >88 cm (35 in) = central obesity risk.',
      'Metabolic panel: fasting glucose, HbA1c, lipid panel, blood pressure.',
      'Referral to structured weight management program (>5% weight loss in 6 months).',
      'Pharmacotherapy options: semaglutide (Wegovy), tirzepatide, phentermine-topiramate.',
      'Bariatric surgery evaluation if BMI ≥40 or ≥35 with obesity-related comorbidities.',
    ],
    differentials: [
      'BMI does not measure body fat percentage or distribution — high muscle mass causes high BMI.',
      'Asian-specific cut-offs: overweight ≥23, obese ≥27.5 (WHO Asian consultation 2004).',
      'Elderly patients: BMI 25–27 associated with lower mortality — J-curve relationship.',
      'Waist circumference and waist-hip ratio add predictive value beyond BMI alone.',
    ],
  },

  'hba1c-glucose-converter': {
    guidelineSource: 'Nathan DM et al. Diabetes Care 2008 / ADA Standards of Care 2024',
    recommendations: [
      'HbA1c <5.7%: Normal — screen every 3 years.',
      'HbA1c 5.7–6.4% (Prediabetes): Intensive lifestyle modification; consider metformin if high risk.',
      'HbA1c ≥6.5%: Diagnostic of diabetes — confirm with repeat testing.',
      'Treatment targets: HbA1c <7.0% for most adults; <8.0% for elderly/complex.',
      'eAG allows patients to understand their average glucose in familiar units.',
    ],
    nextSteps: [
      'Fasting plasma glucose or OGTT to confirm diabetes if HbA1c borderline.',
      'FINDRISC or ADA risk calculator for prediabetes risk stratification.',
      'Lifestyle modification: 7% weight loss + 150 min/week exercise reduces T2DM by 58%.',
      'Metformin 500mg BID if prediabetes + high risk (BMI ≥35, GDM history, prediabetes <60 yo).',
      'Continuous glucose monitoring discussion for established diabetes.',
    ],
    differentials: [
      'HbA1c unreliable in hemolytic anemia, sickle cell, iron deficiency, thalassemia.',
      'HbA1c falsely elevated in iron deficiency anemia, vitamin B12 deficiency.',
      'Fructosamine preferred when HbA1c unreliable (3-week average glucose).',
      'Different racial/ethnic groups have varying HbA1c at equivalent glucose levels.',
    ],
  },

  'bmr-tdee-calculator': {
    guidelineSource: 'Mifflin MD et al. AJCN 1990 / DRI Energy Recommendations (IOM)',
    recommendations: [
      'Weight loss: 500–750 kcal/day deficit below TDEE (0.5–1 lb/week loss target).',
      'Weight maintenance: Calories = TDEE.',
      'Muscle gain: 250–500 kcal/day surplus above TDEE.',
      'Minimum calorie floor: 1200 kcal/day (women), 1500 kcal/day (men) — below this risks nutrient deficiency.',
    ],
    nextSteps: [
      'Track actual weight trend over 2–3 weeks — adjust if not losing/gaining as expected.',
      'Protein target: 1.2–1.6 g/kg/day for muscle preservation during weight loss.',
      'Combine calorie restriction with 150–300 min/week aerobic exercise.',
      'Dietitian referral for medical nutrition therapy if complex medical history.',
    ],
    differentials: [
      'Mifflin-St Jeor ±200–300 kcal individual variation — actual TDEE may differ.',
      'Activity multiplier is the largest source of error — most people overestimate activity.',
      'Metabolic rate declines with weight loss — adjust TDEE every 5–10 kg lost.',
      'Thyroid dysfunction, PCOS, insulin resistance affect resting metabolic rate.',
    ],
  },

  'ideal-body-weight-calculator': {
    guidelineSource: 'Devine BJ. 1974 / Drug Dosing Pharmacokinetic Standards',
    recommendations: [
      'Use IBW for aminoglycoside (gentamicin, tobramycin), vancomycin, and digoxin dosing.',
      'Ventilator tidal volumes: 6–8 mL/kg IBW (lung-protective ventilation).',
      'Use adjusted body weight (ABW) for obese patients: ABW = IBW + 0.4 × (ABW − IBW).',
      'IBW provides reference for interpreting actual vs ideal weight discrepancy (% IBW).',
    ],
    nextSteps: [
      'Calculate adjusted body weight if patient is >120% of IBW (obese).',
      'For drugs using IBW: check if patient is within 20% — if so, actual weight may be used.',
      'Ventilator settings: calculate predicted body weight using height for TV targeting.',
      'Document IBW in medication orders for high-alert drugs.',
    ],
    differentials: [
      'Devine formula was derived from insurance tables — not validated in specific clinical populations.',
      'IBW does not account for muscle mass, edema, or pregnancy.',
      'Robinson, Miller, and Hamwi formulas exist — results differ slightly from Devine.',
      'Asian populations may have different body composition at equivalent heights.',
    ],
  },

  'egfr-ckd-epi-calculator': {
    guidelineSource: 'Inker LA et al. NEJM 2021 / KDIGO CKD Guidelines 2022',
    recommendations: [
      'eGFR ≥90: Normal — CKD only if structural markers or proteinuria present.',
      'eGFR 60–89: Mildly reduced — monitor annually with UACR.',
      'eGFR 30–59: Moderate CKD — KDIGO G3 — 6-monthly labs, nephrology input.',
      'eGFR 15–29: Severe CKD — G4 — prepare for RRT; access creation.',
      'eGFR <15: Kidney failure — initiate dialysis or transplant evaluation.',
    ],
    nextSteps: [
      'UACR for complete KDIGO CKD risk classification (G1–G5 × A1–A3 grid).',
      'ACE-I or ARB for CKD + proteinuria (UACR ≥30 mg/g).',
      'SGLT2 inhibitor for cardio-renal protection if eGFR ≥20.',
      'Avoid NSAIDs, aminoglycosides, iodinated contrast in moderate-severe CKD.',
    ],
    differentials: [
      'CKD-EPI 2021 is race-free — do not add race coefficient.',
      'Muscle mass affects creatinine — cystatin C eGFR more accurate in extremes of muscle mass.',
      'Acute illness: creatinine rising — eGFR underestimates true GFR during AKI.',
    ],
  },

  // (Pharmacology configs)
  'weight-based-drug-dose-calculator': {
    guidelineSource: 'Pediatric and Adult Pharmacology Standard / WHO Essential Medicines 2023',
    recommendations: [
      'Always confirm dose against maximum recommended dose (mg absolute) regardless of weight.',
      'Pediatric patients: never exceed adult maximum dose.',
      'Obesity: use adjusted body weight (ABW) for most drugs, actual weight for select drugs.',
      'Round to nearest convenient formulation — avoid undue precision (e.g., round 73.2 mg to 75 mg tablet).',
    ],
    nextSteps: [
      'Pharmacist verification for all weight-based doses, especially high-alert medications.',
      'Document weight used (actual vs IBW vs ABW) in medical record.',
      'Monitor drug levels where available (antibiotics, anticoagulants).',
      'Reassess dose if significant weight change (>10%) occurs.',
    ],
    differentials: [
      'Which body weight to use varies by drug — always check product prescribing information.',
      'Morbid obesity (BMI >40) significantly alters volume of distribution for many drugs.',
      'Pediatric dose calculation errors are a leading cause of medication harm — verify independently.',
    ],
  },

  'iv-drip-rate-mcg-kg-min': {
    guidelineSource: 'Clinical Pharmacology Standard / SCCM ICU Sedation Guidelines 2018',
    recommendations: [
      'Verify concentration on the bag label before programming the infusion pump.',
      'Use an infusion pump — never gravity drip for vasoactive or sedation medications.',
      'Titrate to clinical endpoint (MAP target, sedation scale RASS, pain score).',
      'Common vasoactive infusions: dopamine (3–20 mcg/kg/min), norepinephrine (0.01–3 mcg/kg/min).',
    ],
    nextSteps: [
      'Independent double-check by two nurses for high-alert infusions.',
      'Smart pump programming with drug library to prevent 10-fold errors.',
      'Label infusion line at pump, patient end, and bag.',
      'Document rate changes in real-time in electronic medication administration record.',
    ],
    differentials: [
      'Concentration must be in mcg/mL — convert from mg/mL if needed.',
      'Drip rate calculation assumes accurate patient weight — weigh patient, do not estimate.',
      'Rate changes should be incremental — sudden large rate changes cause hemodynamic instability.',
    ],
  },

  'opioid-equianalgesic-converter': {
    guidelineSource: 'DCMS Opioid Prescribing Guidelines 2016 / CDC Opioid Prescribing Guideline 2022',
    recommendations: [
      'Always reduce calculated equianalgesic dose by 25–50% for incomplete cross-tolerance.',
      'Reassess pain and side effects 30–60 minutes after first dose of new opioid.',
      'Fentanyl patch: steady-state takes 12–24h; do not use for acute pain.',
      'Oral morphine equivalent (OME) >50 mg/day: reassess pain management plan.',
      'OME >90 mg/day: offer naloxone and review risks with patient.',
    ],
    nextSteps: [
      'Assess pain score before and after conversion.',
      'Naloxone co-prescription for all chronic opioid patients (>50 OME/day).',
      'Urine drug screening for patients on chronic opioid therapy.',
      'PDMP (Prescription Drug Monitoring Program) check before opioid prescribing.',
      'Scheduled reassessment of continued opioid need at 1–4 weeks.',
    ],
    differentials: [
      'Equianalgesic tables are derived from single-dose studies — may not reflect chronic dosing.',
      'High interindividual variability (CYP450 genotype, receptor sensitivity).',
      'Fentanyl patch conversion is complex — manufacturer\'s table preferred.',
      'Hepatic failure: avoid morphine (active metabolite accumulates); use fentanyl or hydromorphone.',
    ],
  },

  // ─── OB/GYN (10) ─────────────────────────────────────────────────────

  'due-date-edd-calculator': {
    guidelineSource: 'ACOG Committee Opinion 700 (2017) / ACOG Practice Bulletin 175',
    recommendations: [
      'First-trimester US dating (CRL at 8–14 weeks) is the gold standard.',
      'If LMP and US EDD differ >7 days at 9–11 weeks: use ultrasound date.',
      'If LMP and US EDD differ >10 days at 11–14 weeks: use ultrasound date.',
      'EDD assigned in first trimester should not be changed in later pregnancy.',
    ],
    nextSteps: [
      'First-trimester ultrasound at 11–14 weeks for NT screening and dating confirmation.',
      'NIPT (cell-free DNA screening) offered at 10+ weeks.',
      'First antenatal visit: blood type, CBC, rubella immunity, STI screening, UA.',
      'Anatomy ultrasound at 18–22 weeks.',
      'Document EDD in antenatal record and confirm with patient.',
    ],
    differentials: [
      'Naegele\'s Rule assumes 28-day cycle — adjust for longer cycles (+extra days).',
      'IVF embryo transfer: EDD calculated from transfer date + 266 days (for day-3 transfer +263d).',
      'Irregular cycles and PCOS: LMP-based EDD unreliable — rely on early US.',
      'LMP recall error is common — first US dating is more accurate.',
    ],
  },

  // ─── PULMONOLOGY (6) ─────────────────────────────────────────────────

  'curb-65-pneumonia-score': {
    guidelineSource: 'Lim WS et al. Thorax 2003 / IDSA/ATS CAP Guidelines 2019',
    recommendations: [
      'CURB-65 0–1 (Low, <3% mortality): Outpatient therapy — amoxicillin ± doxycycline.',
      'CURB-65 2 (Moderate, ~9%): Hospital admission or supervised outpatient care.',
      'CURB-65 3–4 (Severe, 15–40%): Inpatient treatment; CURB ≥4 = ICU consideration.',
      'CURB-65 5 (Very severe, 57%): ICU admission. Combination antibiotics (beta-lactam + azithromycin or FQ).',
    ],
    nextSteps: [
      'Blood cultures before antibiotics if hospitalizing.',
      'Urinary Legionella and pneumococcal antigen for severe CAP.',
      'SpO2 monitoring; supplemental O2 to maintain >94%.',
      'Clinical stability criteria: HR <100, RR <24, temp <38°C, SBP >90, SpO2 >90%.',
      'Step-down to oral antibiotics when clinically stable (48–72h).',
    ],
    differentials: [
      'BUN in US vs urea outside US — >19 mg/dL (BUN) ≈ >7 mmol/L (urea).',
      'PSI/PORT score more sensitive for low-risk classification.',
      'CURB-65 may underestimate risk in elderly (non-specific presentation).',
      'Consider influenza, Legionella, atypicals based on epidemiology.',
    ],
  },

  'anion-gap-calculator': {
    guidelineSource: 'Emmett M, Narins RG. Medicine 1977 / Clinical Chemistry Standard',
    recommendations: [
      'Normal corrected AG (8–12): Non-anion gap metabolic acidosis. Evaluate HCO3 loss.',
      'Corrected AG 13–20: Mild-moderate elevation — identify cause from MUDPILES list.',
      'Corrected AG >20: Significant — immediate evaluation for toxic ingestion, DKA, sepsis.',
      'Always calculate albumin-corrected AG to avoid missing elevated AG in hypoalbuminemia.',
    ],
    nextSteps: [
      'Delta-delta ratio: (Corrected AG − 12) / (24 − HCO3⁻) — detect mixed disorders.',
      'Serum lactate, beta-hydroxybutyrate, osmolal gap depending on clinical context.',
      'Toxicology screen for methanol, ethylene glycol if osmolal gap elevated.',
      'ABG for complete acid-base assessment.',
    ],
    differentials: [
      'Hypoalbuminemia masks elevated AG — always albumin-correct.',
      'Bromide or iodide toxicity causes falsely low AG (measured as chloride).',
      'Lithium, IgG paraprotein can affect anion gap measurement.',
    ],
  },

  'mean-arterial-pressure-calculator': {
    guidelineSource: 'Surviving Sepsis Campaign 2021 / ACC/AHA Guidelines',
    recommendations: [
      'MAP <60 mmHg: Organ perfusion threatened — vasopressors if fluid unresponsive.',
      'MAP target ≥65 mmHg in septic shock (per Surviving Sepsis Campaign).',
      'MAP target ≥70–80 mmHg for patients with chronic hypertension or traumatic brain injury.',
      'MAP <50 mmHg: Emergency intervention required.',
    ],
    nextSteps: [
      'IV fluid challenge (500 mL crystalloid) for MAP <65 mmHg.',
      'Norepinephrine first-line vasopressor if fluid-unresponsive.',
      'Arterial line for continuous MAP monitoring.',
      'Identify and treat underlying cause.',
    ],
    differentials: [
      'Aortic regurgitation: wide pulse pressure makes MAP formula less reliable.',
      'Atrial fibrillation: irregular rhythm causes variation — average multiple readings.',
      'Automated NIBP accuracy decreases in arrhythmia and extreme vasoconstriction.',
    ],
  },

  // ─── GASTROENTEROLOGY (6) ─────────────────────────────────────────────

  'meld-score-calculator': {
    guidelineSource: 'Kamath PS et al. Hepatology 2001 / OPTN/UNOS MELD Policy 2022',
    recommendations: [
      'MELD <10: Low risk (~2% 90-day mortality) — manage outpatient.',
      'MELD 10–19: Moderate (6–20% mortality) — hepatology management, consider listing.',
      'MELD ≥15: Transplant waitlist listing threshold at most centers.',
      'MELD ≥25: High priority — active management of complications.',
      'MELD ≥40: >70% 90-day mortality — urgent transplant evaluation.',
    ],
    nextSteps: [
      'Hepatology referral for MELD ≥10 or progressive CLD.',
      'Transplant evaluation center referral for MELD ≥15.',
      'TIPS contraindicated at MELD >18 (increased encephalopathy risk).',
      'Ascites management: diuretics, sodium restriction, large-volume paracentesis.',
      'SBP prophylaxis: norfloxacin if prior SBP or ascites protein <1.5 g/dL + renal/hepatic dysfunction.',
    ],
    differentials: [
      'Creatinine capped at 4.0 mg/dL in MELD calculation.',
      'MELD-Na adds serum sodium — better predictor than MELD alone (used for allocation).',
      'Creatinine elevated by muscle mass (low in sarcopenic cirrhotic) — may underestimate MELD.',
      'Labs must be from the same day — do not mix dates.',
    ],
  },

  'child-pugh-score-calculator': {
    guidelineSource: 'Child CG, Turcotte JG. 1964 / Pugh RN et al. Br J Surg 1973',
    recommendations: [
      'Class A (5–6): Well-compensated — 1-year survival ~100%; surgery tolerated with minimal modification.',
      'Class B (7–9): Significant dysfunction — 1-year survival ~80%; surgery higher risk.',
      'Class C (10–15): Decompensated — 1-year survival ~45%; avoid elective surgery.',
      'Variceal screening: EGD at diagnosis; repeat per endoscopy findings.',
    ],
    nextSteps: [
      'MELD score calculation for transplant priority assessment.',
      'EGD for varices screening — beta-blocker prophylaxis for medium/large varices.',
      'HCC surveillance: ultrasound ± AFP every 6 months in cirrhosis.',
      'SBP prophylaxis if prior episode or high-risk ascites.',
      'Nutritional support: cirrhotic patients commonly malnourished.',
    ],
    differentials: [
      'Ascites grading is subjective — use ultrasound for objective grading.',
      'Encephalopathy grading requires clinical assessment — West Haven Criteria.',
      'PT can be expressed as seconds prolonged or INR — use PT seconds prolonged for Child-Pugh.',
      'Hepatitis C cure (SVR) may improve Child-Pugh class over 6–12 months.',
    ],
  },

  // ─── ONCOLOGY / HEMATOLOGY (8 tools) ─────────────────────────────────

  'chemotherapy-dose-bsa-med': {
    guidelineSource: 'Mosteller RD. NEJM 1987 / ASCO Chemotherapy Administration Guidelines 2012 / Gurney H. Lancet Oncol 2002',
    recommendations: [
      'Always verify BSA-based dose against the protocol maximum dose cap before preparation — ASCO Class I recommendation.',
      'Recalculate BSA at EACH treatment cycle using current (that-day) weight, not admission weight.',
      'BSA >2.0 m²: many protocols cap at 2.0 m² to limit toxicity — follow institutional or study protocol.',
      'Oncologist and oncology pharmacist dual verification is mandatory for all chemotherapy orders.',
      'Grade 3–4 hematological toxicity in prior cycle: reduce dose by 25% per cycle unless G-CSF primary prophylaxis planned.',
      'Grade 3–4 non-hematological organ toxicity: hold until recovery, then dose-reduce per protocol-specific criteria.',
    ],
    nextSteps: [
      'Day-of-treatment CBC with differential + comprehensive metabolic panel (CMP) before each cycle.',
      'Renal function (CrCl or eGFR) and hepatic function — dose-adjust drugs cleared renally/hepatically.',
      'G-CSF primary prophylaxis (pegfilgrastim/filgrastim) if febrile neutropenia risk >20% per NCCN risk assessment.',
      'Pre-medications: antiemetics (5-HT3 antagonist ± NK1 antagonist ± dexamethasone) per MASCC emetogenicity classification.',
      'Patient/caregiver education: fever ≥38.3°C → call oncology team / present to ER immediately.',
      'Document: exact BSA, formula used, protocol dose, any capping, and dose modification rationale in chart.',
    ],
    differentials: [
      'Formula choice: Mosteller vs Du Bois — use whichever the protocol specifies; values differ slightly, especially in obesity.',
      'Severe obesity (BMI >30): standard BSA calculated from actual weight may overestimate; consider IBW-based or capped BSA per ASCO obesity guidelines.',
      'Pediatric patients <1–2 years: weight-based dosing (mg/kg) preferred over BSA; transition to BSA dosing varies by regimen.',
      'Sarcopenia (low muscle mass): BSA may underestimate lean body mass — discuss with pharmacist/oncologist.',
      'Edema or ascites: actual body weight inflated — use dry weight or estimated lean mass.',
    ],
  },

  'anc-absolute-neutrophil-count': {
    guidelineSource: 'NCCN Clinical Practice Guidelines — Febrile Neutropenia v2.2023 / ASCO Febrile Neutropenia Guidelines 2018 / Survival Sepsis Campaign 2021',
    recommendations: [
      'ANC <500/µL with fever ≥38.3°C (or ≥38.0°C × 1h) = Febrile Neutropenia — initiate protocol within 60 minutes.',
      'Febrile neutropenia protocol: blood cultures ×2 → broad-spectrum anti-pseudomonal antibiotics (cefepime 2g IV Q8h or piperacillin-tazobactam 4.5g IV Q6h).',
      'Add vancomycin 25–30 mg/kg IV for: hemodynamic instability, suspected MRSA, catheter-site infection, mucositis with gram-positive bacteremia risk.',
      'ANC <500 without fever: prophylactic fluoroquinolone (levofloxacin 500mg daily) if cumulative risk >20% (NCCN recommendation).',
      'ANC <1500: delay chemotherapy and discuss dose reduction or G-CSF support for next cycle.',
      'Growth factor support: filgrastim 5 mcg/kg/day SC until ANC recovery, or single-dose pegfilgrastim 6mg SC 24–72h post-chemo.',
    ],
    nextSteps: [
      'Febrile neutropenia: daily CBC, blood cultures if new fever spike; escalate antibiotics if clinical deterioration.',
      'Antifungal therapy (voriconazole or caspofungin) if fever persists >4–7 days despite antibiotics.',
      'ANC <100/µL (nadir): protective isolation precautions, minimize invasive procedures.',
      'CBC with differential every 3–7 days post-chemotherapy to detect nadir and recovery.',
      'Baseline ANC before next chemotherapy cycle: confirm ≥1000–1500/µL per protocol requirements.',
    ],
    differentials: [
      'ANC may be falsely low with clumped platelets or large platelets — manual differential review.',
      'Viral infections, medications (e.g., clozapine, propylthiouracil), and autoimmune conditions cause neutropenia independent of chemotherapy.',
      'Ethnic neutropenia: some populations (African, Afro-Caribbean ancestry) have lower baseline ANC (Duffy-null trait) — clinical significance is benign.',
      'Metamyelocytes and promyelocytes: not counted in ANC — include only segmented neutrophils and bands.',
    ],
  },

  'blood-transfusion-volume-calculator': {
    guidelineSource: 'AABB Clinical Practice Guideline for RBC Transfusion (2016) / Carson JL et al. NEJM 2011 (FOCUS) / NICE Guideline NG24 (2015)',
    recommendations: [
      'Restrictive strategy (Hgb threshold 7–8 g/dL) is recommended for most stable hospitalized patients — AABB strong recommendation (high quality evidence).',
      'Liberal strategy (Hgb threshold 9–10 g/dL) for: active ACS/cardiac ischemia, symptomatic anemia despite transfusion, acute hemorrhage.',
      'Transfuse 1 unit at a time in stable patients — recheck Hgb before additional units.',
      'Oncology/BMT patients: irradiated + leukoreduced products mandatory to prevent transfusion-associated graft-versus-host disease (TA-GvHD).',
      'CMV-seronegative patients: use CMV-negative or leukoreduced (equivalent) products.',
      'Pediatric dose: 10–15 mL/kg pRBC; neonates: 15–20 mL/kg for correction of anemia of prematurity.',
    ],
    nextSteps: [
      'Type and screen (T&S) or crossmatch required before any transfusion — confirm blood bank order.',
      'Baseline vital signs before transfusion; recheck at 15 minutes, then every 30–60 minutes.',
      'Post-transfusion Hgb: recheck 15–60 minutes after transfusion completion.',
      'TACO (fluid overload) risk: slow infusion rate (≤1 mL/kg/hr) in cardiac patients; consider diuretic prophylaxis.',
      'Iron overload: ferritin >1000 µg/L after >20 units cumulative — consider chelation (deferasirox).',
      'Autologous blood salvage / erythropoiesis-stimulating agents (ESAs) to minimize allogeneic transfusion in elective surgery.',
    ],
    differentials: [
      'Formula assumes standard pRBC unit volume of ≈300 mL with Hgb ≈20 g/dL — actual unit volume varies (250–350 mL).',
      'Ongoing hemorrhage: target Hgb higher (≥10 g/dL) and re-assess every 30–60 minutes.',
      'Chronic anemia with compensatory physiology: lower Hgb tolerated better than acute anemia — tailor threshold to symptoms.',
      'Platelet transfusion threshold: prophylactic <10 ×10³/µL (stable); pre-procedure <50 ×10³/µL; neurosurgery <100 ×10³/µL.',
    ],
  },

  'inr-pt-ratio-converter': {
    guidelineSource: 'WHO Technical Report Series No. 987 (2014) / AHA/ACC Warfarin Management Guidelines 2011 / Hirsh J et al. Chest 2008 / ISTH DIC Criteria',
    recommendations: [
      'Warfarin AF/VTE (target INR 2–3): if INR <1.5, assess compliance and increase dose by 10–15%; if INR >4, hold 1 dose and recheck in 2–3 days.',
      'Mechanical heart valve (target INR 2.5–3.5): INR <2.0 requires urgent dose adjustment — stroke risk is very high.',
      'INR >5.0 without bleeding: hold warfarin, oral vitamin K 1–2.5 mg; recheck INR in 24–48h.',
      'INR >8.0 or any significant bleeding: hold warfarin; vitamin K 5–10 mg IV; 4-factor PCC (25–50 units/kg) for urgent reversal.',
      'ESC 2023 AF Guidelines: NOACs (apixaban, rivaroxaban, edoxaban, dabigatran) preferred over warfarin for most AF patients.',
      'Pre-procedure: hold warfarin 5 days before elective procedure; bridge with LMWH if high thrombotic risk.',
    ],
    nextSteps: [
      'Initiation: INR daily × 4–5 days until stable, then twice weekly × 1–2 weeks, then monthly when stable.',
      'ISTH 4T score for suspected HIT if new thrombosis while on heparin/LMWH.',
      'INR management: structured warfarin clinics, pharmacogenomics-guided dosing (CYP2C9/VKORC1) where available.',
      'Drug-drug interactions review: antibiotics, azoles, amiodarone, NSAIDs — all increase bleeding risk significantly.',
      'Vitamin K dietary counseling: consistency preferred over strict avoidance — green leafy vegetables provide predictable vitamin K.',
    ],
    differentials: [
      'ISI value must be from your specific laboratory thromboplastin reagent package insert — ISI error significantly changes INR.',
      'Liver disease INR does not correlate with bleeding risk as in warfarin-related elevation — MELD score better reflects synthetic function.',
      'Factor VIII consumption in DIC → elevated PT, aPTT, low fibrinogen, elevated D-dimer — INR alone insufficient for DIC diagnosis.',
      'Lupus anticoagulant: prolongs PT/aPTT in vitro but is associated with thrombosis, not bleeding, in vivo.',
    ],
  },

  'psa-velocity-doubling-time': {
    guidelineSource: "AUA Early Detection of Prostate Cancer Guidelines 2023 / D'Amico AV JAMA 2004 / EAU Prostate Cancer Guidelines 2023 / Carter HB JAMA 1992",
    recommendations: [
      'PSADT <3 months: highly aggressive kinetics — immediate urology referral; mpMRI + bone scan + consider PSMA PET/CT.',
      'PSADT 3–12 months: concerning — urology referral, mpMRI, and shared decision-making regarding biopsy.',
      'PSAV >0.75 ng/mL/yr (PSA <10): increased prostate cancer risk per D\'Amico criteria — biopsy consideration.',
      'PSAD >0.15 ng/mL/mL: elevated density suggests malignancy over BPH — biopsy recommended regardless of absolute PSA.',
      'Active surveillance (GG1): PSADT >3 years is reassuring — continue annual PSA + MRI surveillance per protocol.',
      'Post-radical prostatectomy biochemical recurrence: PSA >0.2 ng/mL on 2 consecutive measurements — salvage RT evaluation.',
    ],
    nextSteps: [
      'mpMRI (PI-RADS scoring) before systematic biopsy improves detection of clinically significant cancer (GG ≥2) — AUA/EAU 2023.',
      'Shared decision-making for PSA 4–10 ng/mL: discuss free/total PSA ratio, PSAD, prior biopsy history, age, and life expectancy.',
      'Free/total PSA ratio <10%: higher likelihood of prostate cancer vs BPH — biopsy threshold lowered.',
      'PSMA PET/CT for biochemical recurrence detection (PSA 0.2–2.0 ng/mL): superior to conventional bone scan + CT.',
      'Testosterone level: hypogonadism suppresses PSA — low testosterone with elevated PSA is more alarming.',
    ],
    differentials: [
      'PSA elevations from non-cancer causes: BPH, prostatitis, urinary tract instrumentation (catheter, cystoscopy) — allow 4–6 weeks after infection/procedure before PSA testing.',
      '5-alpha reductase inhibitors (finasteride, dutasteride): reduce PSA by 50% — double reported PSA for comparison to standard thresholds.',
      'Ejaculation within 24–48h: modestly elevates PSA — standardize collection timing.',
      'PSADT calculation requires minimum 2 PSA measurements ≥3 months apart for reliability; 3 measurements improve accuracy.',
      'PSA velocity less reliable with PSA <0.5 ng/mL or fluctuating PSA without clear trend.',
    ],
  },

  'tnm-staging-interpreter': {
    guidelineSource: 'AJCC Cancer Staging Manual 8th Edition (2017) / NCCN Clinical Practice Guidelines 2023 / NCI SEER Cancer Statistics Review 2022',
    recommendations: [
      'Stage 0 / Tis: carcinoma in situ — local excision/ablation curative in most cancers; no systemic therapy required.',
      'Stage I: surgery ± adjuvant therapy — excellent prognosis; individualize based on molecular subtype and histological grade.',
      'Stage II: curative-intent multimodality therapy — surgery + adjuvant chemotherapy ± radiation for most solid tumors.',
      'Stage III: MDT (tumor board) review mandatory — consider neoadjuvant chemotherapy to assess response and improve R0 resection rates.',
      'Stage IV: goals-of-care discussion; systemic therapy (chemotherapy, targeted therapy, immunotherapy); clinical trial enrollment.',
      'All Stage III–IV: palliative care referral at diagnosis improves quality of life and may extend survival (Temel et al. NEJM 2010).',
    ],
    nextSteps: [
      'Tumor board (MDT) review for all new cancer diagnoses — multidisciplinary management is standard of care.',
      'Molecular/biomarker testing: ER/PR/HER2 (breast), KRAS/BRAF/MSI (colorectal), EGFR/ALK/PD-L1 (lung), MSI-H/TMB for immunotherapy eligibility.',
      'Staging workup: CT chest/abdomen/pelvis + PET/CT for most solid tumors; bone scan for prostate/breast.',
      'Performance status assessment (ECOG 0–4 / KPS) before systemic therapy decisions.',
      'Genetic counseling: BRCA1/2, Lynch syndrome, PALB2 — screen if family history or young age at diagnosis.',
      'Clinical trial eligibility: check ClinicalTrials.gov for open trials at diagnosis — neoadjuvant and adjuvant settings.',
    ],
    differentials: [
      'AJCC 8th edition stage groupings shown are GENERIC — actual stage grouping differs significantly by primary site (breast uses ER/PR/HER2; prostate uses PSA+Gleason group; thyroid uses age).',
      'Clinical staging (cTNM) often upstaged by pathological staging (pTNM) — understaging is common with imaging alone.',
      'Post-neoadjuvant ypTNM: pathological complete response (ypT0N0) is a strong prognostic marker independent of clinical stage.',
      'Synchronous primary tumors: stage the dominant primary independently; synchronous metastases change staging.',
      'Survival data from SEER represents US population diagnosed 2013–2019 — may not reflect current immunotherapy/targeted therapy outcomes.',
    ],
  },

  'ipss-mds-score': {
    guidelineSource: 'Greenberg PL et al. Blood 2012 / NCCN MDS Clinical Practice Guidelines v3.2023 / ELN MDS Recommendations 2023 / ASH MDS Guidelines 2020',
    recommendations: [
      'Very Low / Low risk (IPSS-R ≤3): ESA (epoetin alfa 40,000–60,000 units SC weekly) if EPO <500 mU/mL + transfusion burden <2 units/month — 60–70% response rate.',
      'del(5q) regardless of risk: lenalidomide 10mg daily × 21 days Q28d — 67% cytogenetic remission rate (LISTA trial).',
      'Intermediate risk (3.5–4.5): clinical trial preferred; ESA if EPO responsive; hypomethylating agent (HMA) if EPO unresponsive or multiple cytopenias.',
      'High / Very High risk (IPSS-R >4.5): azacitidine 75 mg/m² × 7 days Q28d — first-line standard (AZA-001: improved OS vs conventional care).',
      'Allogeneic HSCT: evaluate High/Very High risk patients <70–75 years — only potentially curative option.',
      'Supportive care: transfusion as needed; G-CSF for severe neutropenia with recurrent infections; TPO-RA for severe thrombocytopenia.',
    ],
    nextSteps: [
      'Repeat CBC every 4–8 weeks to monitor cytopenias and response to treatment.',
      'Repeat bone marrow biopsy every 6–12 months, or if clinical deterioration or new cytopenias (blast progression check).',
      'Iron studies: serum ferritin every 3–6 months in transfusion-dependent patients — chelation if ferritin >1000 µg/L after >20 units.',
      'HSCT evaluation: HLA typing for patient and siblings; assess ECOG performance status and comorbidity index.',
      'Monitor for AML transformation: blasts ≥20% in peripheral blood or marrow = AML — intensive chemotherapy evaluation.',
    ],
    differentials: [
      'IPSS-R was validated in untreated MDS patients — may not reflect prognosis after treatment or in post-therapy MDS.',
      'Therapy-related MDS (t-MDS): worse prognosis than de novo MDS with same IPSS-R score — consider higher risk category treatment.',
      'MDS/MPN overlap (e.g., CMML): not scored by IPSS-R — use CPSS-Mol or CMML-specific prognostic score.',
      'IPSS-R vs IPSS-M (Molecular): the newer IPSS-M incorporates somatic mutations (TP53, RUNX1, SF3B1, etc.) — improves prognostic precision.',
      'Isolated cytopenia may represent aplastic anemia (AA), large granular lymphocyte (LGL) leukemia, or nutritional deficiency — ensure BM biopsy for definitive diagnosis before MDS treatment.',
    ],
  },

  'cancer-survival-probability': {
    guidelineSource: 'NCI SEER Cancer Statistics Review 2022 / SEER*Stat Database 2023 / NCCN Outcomes and Evidence / WHO GLOBOCAN 2020',
    recommendations: [
      'Stage I–II (localized/regional): discuss curative-intent treatment options, expected 5-year survival, and short-term vs long-term toxicity trade-offs.',
      'Stage III: emphasize importance of complete staging workup, MDT review, and neoadjuvant therapy evaluation before surgery.',
      'Stage IV: goals-of-care discussion at diagnosis — palliative care referral, clinical trial eligibility, advance directive planning.',
      'Survival estimates should be presented as population averages with clear caveat that individual outcomes depend on molecular biology, treatment response, and comorbidities.',
      'Newer therapies: SEER data (2013–2019) predates many immunotherapy approvals — contemporary outcomes for lung, melanoma, and bladder cancer may be significantly better.',
      'ECOG performance status and comorbidities heavily influence individual survival — these are NOT captured in SEER statistics.',
    ],
    nextSteps: [
      'Molecular tumor profiling (Foundation Medicine, MSK-IMPACT, or equivalent) for Stage III–IV — identifies actionable mutations for targeted therapy.',
      'PD-L1 immunohistochemistry + MSI/MMR status for immunotherapy eligibility across multiple tumor types.',
      'Germline genetic testing (BRCA1/2, Lynch syndrome, PALB2, APC) — hereditary cancer syndromes affect family screening.',
      'Prognostic tools: Adjuvant! Online, PREDICT (breast), Adjuvant BioTherapy (colon), Oncotype DX, MammaPrint — provide individualized recurrence risk.',
      'Clinical trial enrollment: check ClinicalTrials.gov — participation in trials offers access to novel therapies and contributes to evidence.',
      'Palliative/supportive care team: integrate early alongside oncology team in Stage III–IV for quality of life and caregiver support.',
    ],
    differentials: [
      'SEER relative survival is compared to an age/sex-matched general population — absolute survival rates are lower.',
      'Race and socioeconomic disparities exist in cancer outcomes — SEER national averages obscure these differences.',
      '5-year survival is a statistical landmark — many patients with Stage IV disease with modern therapies (e.g., metastatic melanoma, NSCLC with driver mutation) live >5 years.',
      'Secondary malignancies (from treatment) are not captured in primary site survival statistics.',
      'Conditional survival: a patient who has already survived 2 years has a higher remaining probability of reaching 5 years than the initial estimate.',
    ],
  },

  // ─── PEDIATRICS (8 tools) ────────────────────────────────────────────

  'pediatric-bmi-for-age': {
    guidelineSource: 'CDC Growth Charts 2000 / WHO Child Growth Standards 2006 / AAP Obesity Clinical Practice Guideline 2023',
    recommendations: [
      '<3rd %ile (Underweight): Evaluate for nutritional deficiency, eating disorder, malabsorption, chronic illness, endocrine disorder.',
      '5th–85th %ile (Healthy weight): Continue routine well-child care; reinforce healthy habits.',
      '85th–95th %ile (Overweight): 12-week lifestyle counseling program — diet, activity, screen time; reassess in 1 month.',
      '≥95th %ile (Obesity): Formal evaluation for metabolic comorbidities (HTN, dyslipidemia, pre-diabetes, sleep apnea, NAFLD); intensive behavioral intervention.',
      '≥97th %ile (Severe obesity): Refer to pediatric weight management program; consider metformin or pharmacotherapy in adolescents ≥12 years per AAP 2023.',
    ],
    nextSteps: [
      'Plot on growth chart at every well-child visit — serial trend is more meaningful than single value.',
      'Ages 0–2: use WHO 2006 weight-for-length rather than BMI-for-age.',
      'Screen for comorbidities at BMI ≥95th %ile: fasting lipids, HbA1c/fasting glucose, ALT, BP at every visit.',
      'Obstructive sleep apnea screening: snoring, witnessed apneas, restless sleep, poor school performance.',
      'Refer to dietitian for individualized nutrition plan in overweight/obese children.',
    ],
    differentials: [
      'BMI does not directly measure body fat — muscular children may have high BMI without excess fat.',
      'Edema, Cushing syndrome, hypothyroidism can elevate weight and BMI — evaluate clinically.',
      'Short stature + high BMI may suggest growth hormone deficiency or hypothyroidism.',
      'BMI percentile in children is NOT equivalent to adult BMI categories — do not apply adult thresholds.',
    ],
  },

  'fever-dose-med': {
    guidelineSource: 'AAP Clinical Practice Guidelines — Fever 2011 / BNF for Children 2023 / WHO Child Health Guidelines',
    recommendations: [
      'Acetaminophen: 15 mg/kg Q4–6h (max 1000 mg/dose; max 75 mg/kg/day or 4000 mg/day, whichever is less).',
      'Ibuprofen (≥6 months): 10 mg/kg Q6–8h (max 400 mg/dose; max 40 mg/kg/day or 2400 mg/day).',
      'Fever <3 months: EMERGENCY evaluation — do not discharge without thorough assessment (sepsis risk).',
      'NEVER give aspirin to children with viral illness — Reye\'s syndrome risk.',
      'Do not routinely alternate acetaminophen and ibuprofen — AAP does not recommend this practice.',
    ],
    nextSteps: [
      'Assess clinical appearance: a well-appearing febrile child with known viral illness has low serious bacterial infection risk.',
      'Fever >5 days: investigate for bacterial source (urine culture, blood culture if ill-appearing).',
      'Non-blanching rash with fever: immediate emergency evaluation (meningococcemia).',
      'Ensure adequate oral fluid intake alongside antipyretics.',
      'Caregiver education: fever is protective — treat for comfort, not to normalize temperature.',
    ],
    differentials: [
      'Max dose: acetaminophen is capped at adult ceiling (1g/dose, 4g/day) regardless of weight.',
      'Check ALL products (cold/flu, pain, teething gel) for hidden acetaminophen to prevent unintentional overdose.',
      'Ibuprofen: avoid in dehydration (AKI risk), varicella, asthma exacerbation, NSAID allergy, renal impairment.',
      '<6 months: ibuprofen not licensed — use acetaminophen only; <3 months: fever = pediatric emergency regardless of dose given.',
    ],
  },

  'holliday-segar-maintenance-fluid': {
    guidelineSource: 'Holliday MA, Segar WE. Pediatrics 1957 / NICE Guideline NG29 (2015) / PALS 2020',
    recommendations: [
      '4-2-1 rule: 4 mL/kg/hr (first 10 kg) + 2 mL/kg/hr (next 10 kg) + 1 mL/kg/hr (each additional kg).',
      'Fluid type: isotonic fluids (0.9% NaCl or Lactated Ringer\'s) for most hospitalized children — NICE 2015 recommendation to prevent iatrogenic hyponatremia.',
      'Post-operative/CNS disease: reduce to 2/3 of maintenance — SIADH and hyponatremia risk.',
      'Add KCl (20 mEq/L) only after confirming adequate urine output.',
      'Holliday-Segar provides MAINTENANCE ONLY — deficit and ongoing losses must be calculated separately.',
    ],
    nextSteps: [
      'Serum electrolytes (Na, K, Cl, HCO3) every 4–8 hours in acutely ill children on IV fluids.',
      'Urine output goal: 1–2 mL/kg/hr (infants), 0.5–1 mL/kg/hr (older children).',
      'Daily weight and fluid balance documentation in hospitalized children.',
      'Reassess fluid rate at each physician review — overhydration is as dangerous as underhydration.',
      'Diarrhea/vomiting: use oral rehydration solution (ORS) preferentially over IV where possible.',
    ],
    differentials: [
      'Holliday-Segar is a maintenance estimate — not for shock resuscitation (use 10–20 mL/kg isotonic bolus for hypovolemia).',
      'Burns: separate Parkland-based resuscitation (3–4 mL/kg/% TBSA) in addition to maintenance.',
      'Diabetic ketoacidosis: use separate DKA protocol — rapid fluid changes risk cerebral edema in children.',
      'Syndrome of Inappropriate ADH (SIADH): fluid restriction is treatment, not maintenance fluids.',
    ],
  },

  'corrected-gestational-age-calculator': {
    guidelineSource: 'AAP Committee on Fetus and Newborn. Pediatrics 2004 / WHO Growth Standard Application Guide',
    recommendations: [
      'Use corrected (adjusted) age for developmental milestone assessment until corrected age 2 years.',
      'Use chronological age for vaccine timing — exception: HepB in very low birth weight (<2 kg) infants.',
      'Plot on WHO/CDC growth charts using corrected age — weight below 10th %ile on corrected age warrants nutritional evaluation.',
      'Extremely premature (<28 wks): continue developmental correction until corrected age 3 years.',
    ],
    nextSteps: [
      'Neurodevelopmental follow-up: formal developmental assessment at corrected ages 4, 8, 18, and 24 months.',
      'Early Intervention referral (Part C — IDEA): for developmental delay suspected in any domain.',
      'ROP screening: <30 weeks GA or <1500g — ophthalmology at 4–6 weeks chronological age.',
      'Hearing screen: universal neonatal hearing screening — retest if high-risk for delayed-onset hearing loss.',
      'Head circumference measurement at every visit — microcephaly (<3rd %ile) requires neuroimaging.',
    ],
    differentials: [
      'Corrected age applies to gestational age <37 weeks — term infants do not require age correction.',
      'Neurodevelopmental delay persisting beyond corrected age 3 years = likely intrinsic, not prematurity-related.',
      'Social-emotional development milestones are less forgiving of prematurity — some delays may persist.',
      'Parental height is a key factor in growth trajectory — calculate mid-parental height for context.',
    ],
  },

  'pediatric-ett-size-depth': {
    guidelineSource: 'AHA PALS 2020 / Khine et al. Anesthesiology 1997 / Broselow Tape System',
    recommendations: [
      'Uncuffed ETT formula: (Age/4) + 4 mm ID. Cuffed ETT: (Age/4) + 3.5 mm ID.',
      'Cuffed ETTs acceptable at all ages per AHA PALS 2020 — use cuff pressure ≤20 cmH₂O.',
      'Always have one size smaller (−0.5 mm) and one size larger (+0.5 mm) available at bedside.',
      'Confirm tube position with: bilateral auscultation + CO2 waveform capnography + CXR (tip at T3–T4).',
      'Neonates: ETT depth ≈ weight (kg) + 6 cm at lip; alternatively (GA/10) + 1 cm.',
    ],
    nextSteps: [
      'CXR immediately post-intubation — ETT tip should be 1–2 cm above carina (T3–T4 level).',
      'Secure ETT position: mark at lip, note centimeter depth in documentation.',
      'Continuous CO2 monitoring (capnography) once intubated — standard of care per AHA.',
      'RSI pre-medication: atropine 0.01–0.02 mg/kg IV (min 0.1 mg) in children <1 year before succinylcholine.',
      'Post-intubation: calculate post-RSI sedation/analgesia dosing — fentanyl + midazolam or ketamine.',
    ],
    differentials: [
      'Formula-based ETT sizing may be inaccurate in extremes of size — Broselow tape provides weight-based size.',
      'Right mainstem intubation: most common complication — unilateral breath sounds, unilateral chest rise.',
      'Esophageal intubation: CO2 waveform is definitive — absent waveform confirms esophageal placement.',
      'ETT too small: high leak → inadequate ventilation and difficulty maintaining PEEP; go up 0.5 mm.',
      'ETT too large: subglottic injury, post-extubation croup — go down 0.5 mm or use cuffed tube.',
    ],
  },

  'neonatal-jaundice-bhutani': {
    guidelineSource: 'Bhutani VK et al. Pediatrics 1999 / AAP Clinical Practice Guideline — Hyperbilirubinemia 2022',
    recommendations: [
      'Plot TSB on Bhutani nomogram — High Risk zone (≥95th %ile): phototherapy/exchange decision urgent.',
      'AAP 2022 phototherapy threshold: based on gestational age (GA) and neurotoxicity risk factors.',
      'High-Intermediate risk zone + risk factors: initiate phototherapy or recheck in 4–6 hours.',
      'Exchange transfusion: TSB ≥ phototherapy threshold + 5 mg/dL — immediate NICU/neonatal consultation.',
      'Intensive phototherapy: multiple lights (bilirublanket + overhead), maximize skin exposure, eye protection, temperature monitoring.',
    ],
    nextSteps: [
      'Recheck TSB 4–6 hours after starting phototherapy to confirm response (expect 1–2 mg/dL decrease).',
      'If TSB not decreasing or rising despite phototherapy: evaluate for hemolysis (Coombs, CBC, reticulocyte count).',
      'Risk factors for severe jaundice: isoimmune hemolytic disease (ABO/Rh), G6PD deficiency, prematurity, East Asian ethnicity, sepsis.',
      'Universal pre-discharge bilirubin screening recommended — either TSB or transcutaneous bilirubin (TcB) measurement.',
      'Follow-up after discharge: 24–48 hours for all neonates ≥35 weeks discharged before 72h of life.',
    ],
    differentials: [
      'Direct (conjugated) bilirubin >1 mg/dL or >20% of total: investigate cholestasis — phototherapy less effective.',
      'Breast milk jaundice peaks day 7–14; breast-feeding jaundice (poor feeding) peaks day 3–5 — different mechanisms.',
      'Rh hemolytic disease: severe — requires early prediction and possible fetal intervention.',
      'G6PD deficiency: common in Mediterranean, African, Asian descent — can cause rapid severe hyperbilirubinemia.',
      'Thresholds shown are approximations — use official AAP 2022 nomogram for precise phototherapy thresholds.',
    ],
  },

  'vaccine-schedule-checker': {
    guidelineSource: 'CDC ACIP Childhood/Adolescent Immunization Schedule 2024 / AAP Red Book 2024',
    recommendations: [
      'Follow ACIP 2024 schedule — combination vaccines preferred where available to minimize injections.',
      'Fever is NOT a contraindication to vaccination — mild acute illness may proceed.',
      'Live vaccines (MMR, Varicella, LAIV): contraindicated in severely immunocompromised patients — use inactivated alternatives.',
      'Catch-up vaccination: most series do not require restarting — continue from where left off at minimum intervals.',
      'Maternal vaccination: Tdap at 27–36 weeks gestation protects neonate before their own vaccine series begins.',
    ],
    nextSteps: [
      'Observe 15 minutes post-vaccination for anaphylaxis — 30 minutes if prior reaction history.',
      'Vaccine Information Statement (VIS): legally required to be given before each vaccine administration.',
      'Document: vaccine name, lot number, manufacturer, expiration date, anatomic site, and administrator.',
      'VAERS reporting: report adverse events following vaccination to CDC Vaccine Adverse Event Reporting System.',
      'Missing documentation: if records unavailable, consider patient unvaccinated — start series (safe, not harmful).',
    ],
    differentials: [
      'Egg allergy: RIV4 (recombinant influenza vaccine) or cell-based vaccines for severe egg allergy.',
      'Latex allergy: check vaccine vial stopper composition.',
      'Immunocompromised: timing of vaccination around chemotherapy — vaccinate ≥2 weeks before or ≥3 months after.',
      'International travel: additional vaccines may be needed (typhoid, yellow fever, hepatitis A, meningococcal) — consult travel medicine.',
      'COVID-19 vaccines: updated annually — follow current CDC recommendations for each age group.',
    ],
  },

  'child-growth-percentile': {
    guidelineSource: 'WHO Child Growth Standards 2006 / CDC Growth Charts 2000 / de Onis M et al. Bull WHO 2007',
    recommendations: [
      'Ages 0–24 months: use WHO 2006 Growth Standards (breast-fed infant reference population).',
      'Ages 2–20 years: use CDC 2000 Growth Charts (US population reference).',
      '<3rd percentile (height, weight, or HC): clinical evaluation for underlying cause.',
      '>97th percentile: clinical evaluation — distinguish constitutional from pathological.',
      'Crossing 2+ major percentile lines downward: "faltering growth" — investigate malnutrition, chronic disease, psychosocial.',
    ],
    nextSteps: [
      'Head circumference measurement: every well-child visit from birth to 36 months.',
      'Serial plotting on age/sex-appropriate WHO or CDC growth chart at every visit.',
      'Short stature workup: bone age (wrist X-ray), CBC, CMP, TFTs, IGF-1, celiac screen if indicated.',
      'Growth failure in infancy: caloric supplementation trial (100–110 kcal/kg/day); if inadequate response, investigate.',
      'Mid-parental height calculation: target height range gives context for short/tall stature.',
    ],
    differentials: [
      'Z-scores calculated from simplified LMS approximation — use official CDC/WHO software for precise values.',
      'Familial short or tall stature: normal variant — plot mid-parental height range for context.',
      'Constitutional growth delay: delayed bone age but eventual normal height — reassure family.',
      'Growth hormone deficiency: slow growth velocity + height <3rd %ile — refer to pediatric endocrinology.',
      'Celiac disease: most common metabolic cause of growth failure in developed countries — screen if unexplained.',
    ],
  },

  // ─── WELLNESS / CONSUMER HEALTH (11 tools) ──────────────────────────

  'calorie-deficit-calculator': {
    guidelineSource: 'Hall KD et al. Lancet 2011 / USDA Dietary Guidelines for Americans 2020–2025 / WHO Obesity Prevention',
    recommendations: [
      'Safe deficit: 250–750 kcal/day (0.25–1 lb/week) — evidence-based sustainable rate for most adults.',
      'Maximum safe deficit: 1000 kcal/day (2 lbs/week) — only under medical supervision.',
      'Minimum calories: never below 1,200 kcal/day (women) or 1,500 kcal/day (men) without physician oversight.',
      'Protein during deficit: 0.7–1.0 g/lb of goal body weight to preserve lean muscle mass.',
      'Combine calorie deficit with 150–300 min/week moderate aerobic exercise — USDA Dietary Guidelines.',
    ],
    nextSteps: [
      'Track food intake for 2 weeks to establish actual (not estimated) calorie baseline.',
      'Reassess TDEE every 4–6 weeks — metabolic adaptation reduces TDEE by 100–300 kcal over time.',
      'Diet break every 8–12 weeks of continuous deficit: eat at maintenance for 1–2 weeks to reset leptin.',
      'Weekly body weight average (not daily readings) — reflects true trend without day-to-day fluctuation.',
      'Registered dietitian referral for personalized plan if BMI >35 or medical conditions (DM, HTN, CKD).',
    ],
    differentials: [
      '3500 kcal/lb rule is a simplification — actual rate of fat loss is non-linear and varies with energy availability.',
      'TDEE equations (Mifflin-St Jeor) have ±200–300 kcal/day variability — treat as starting point.',
      'Metabolic adaptation (adaptive thermogenesis): TDEE decreases 100–300 kcal after significant weight loss — account for this.',
      'Overly aggressive deficit (>1000 kcal/day): muscle loss, hormonal disruption, micronutrient deficiencies, gallstones.',
    ],
  },

  'heart-rate-zone-calculator': {
    guidelineSource: 'Karvonen MJ et al. Ann Med Exp Biol Fenn 1957 / ACSM Exercise Guidelines 2022 / AHA Physical Activity Guidelines',
    recommendations: [
      'Zone 1 (<50% HRR): Active recovery, warm-up, cool-down. Purpose: blood flow, mobility, daily movement.',
      'Zone 2 (50–60% HRR): Aerobic base building, fat oxidation. Example: brisk walk, easy cycle. "Conversational pace."',
      'Zone 3 (60–70% HRR): Aerobic endurance. Example: moderate jog, recreational sports. "Comfortably hard."',
      'Zone 4 (70–80% HRR): Lactate threshold. Example: tempo run, hard cycle intervals. Improves race pace.',
      'Zone 5 (80–100% HRR): VO2 max / anaerobic. Example: sprint intervals, all-out effort. Sustainable only 1–3 minutes.',
    ],
    nextSteps: [
      'AHA: 150 min/week moderate (Zone 2–3) OR 75 min/week vigorous (Zone 4) for cardiovascular health.',
      'Medical clearance for Zone 4–5 training if age >40, CVD risk factors, or sedentary >1 year.',
      'Heart rate monitor (chest strap) is more accurate than wrist-based optical HR — use for zone training.',
      'Resting HR trend: if resting HR decreases over weeks, indicates improving cardiovascular fitness.',
      'Beta-blockers blunt heart rate response — do not use calculated zones; consult cardiologist.',
    ],
    differentials: [
      '220 − Age formula has ±10–12 bpm error (1 SD) — actual max HR can vary significantly from formula.',
      'Graded exercise test (stress test) provides accurate max HR and detects exercise-induced arrhythmias.',
      'HRR (Karvonen) method is more individualized than simple % of max HR — preferred for trained athletes.',
      'Dehydration, heat, caffeine, stress raise HR at same workload — affects zone accuracy.',
    ],
  },

  'daily-water-intake-calculator': {
    guidelineSource: 'EFSA Panel on Dietetic Products 2010 / IOM Dietary Reference Intakes for Water 2004 / WHO Hydration Guidelines',
    recommendations: [
      'General baseline: 35 mL/kg/day (includes ~20% from food sources).',
      'EFSA adequate intakes: women 2.0 L/day total; men 2.5 L/day total (includes all food and beverages).',
      'Urine color guide: pale yellow (straw color) = adequate hydration; dark yellow/amber = dehydrated.',
      'Kidney stone history: target ≥2.5 L urine output/day — clinically proven to reduce recurrence.',
      'Heart failure / CKD: fluid restriction may be prescribed — do not increase fluids without physician guidance.',
    ],
    nextSteps: [
      'Pregnant: +300 mL/day above baseline. Breastfeeding: +700 mL/day (IOM recommendation).',
      'Electrolytes during prolonged exercise (>60 min): sports drink or sodium supplementation to prevent hyponatremia.',
      'Diuretic therapy: increased fluid intake needed; electrolyte monitoring (Na, K).',
      'Adjust if on medications: NSAIDs, ACE-I/ARBs — discuss fluid intake targets with prescriber.',
    ],
    differentials: [
      'Individual requirements vary widely — no universal formula; urine color is the best practical guide.',
      'Coffee, tea, juice all count toward fluid intake; mild diuretic effect of caffeine is offset by fluid volume.',
      'Hyponatremia risk: endurance athletes who over-drink plain water without electrolytes — use electrolyte drinks for events >1h.',
      'Thirst is a late indicator of dehydration — especially in elderly who have reduced thirst sensation.',
    ],
  },

  'sleep-cycle-calculator': {
    guidelineSource: 'Carskadon MA, Dement WC. Principles and Practice of Sleep Medicine 2011 / AASM Adult Sleep Guidelines 2017',
    recommendations: [
      'Adults: 7–9 hours/night (AASM 2017). Teenagers (13–18): 8–10 hours. Children 6–12: 9–12 hours.',
      'Consistent wake time (including weekends) is the single most powerful sleep hygiene habit.',
      'Waking between 90-min cycles (during light sleep) minimizes sleep inertia and morning grogginess.',
      'CBT-I (Cognitive Behavioral Therapy for Insomnia): first-line treatment for chronic insomnia — more effective than sleeping pills long-term.',
      'Avoid sleep medications beyond 4 weeks — dependency, rebound insomnia, and cognitive effects.',
    ],
    nextSteps: [
      'Persistent poor sleep >3 nights/week for >3 months: formal evaluation for insomnia disorder.',
      'Screen for obstructive sleep apnea (OSA): Epworth Sleepiness Scale ≥10, snoring, witnessed apneas.',
      'Sleep diary for 2 weeks: identifies sleep pattern, helps guide CBT-I.',
      'Refer to sleep specialist for: OSA diagnosis (polysomnography), narcolepsy, RLS, parasomnias.',
    ],
    differentials: [
      '90-minute cycle is an average — individual cycles range 70–120 minutes; first cycle has more N3 deep sleep.',
      '15-minute sleep onset latency is an average — insomniacs may take 30+ minutes.',
      'Sleep efficiency = time asleep / time in bed: <85% suggests insomnia disorder.',
      'REM sleep is concentrated in latter half of the night — early morning awakenings disrupt REM disproportionately.',
    ],
  },

  'cholesterol-ratio-calculator': {
    guidelineSource: 'Ingelsson E et al. JAMA 2007 / ACC/AHA 2018 Cholesterol Guidelines / ESC/EAS Lipid Guidelines 2019',
    recommendations: [
      'TC/HDL <3.5: Ideal — reinforce healthy lifestyle.',
      'TC/HDL 3.5–4.5: Good — lifestyle optimization (diet, exercise, weight, smoking cessation).',
      'TC/HDL 4.5–5: Acceptable but borderline — calculate 10-year ASCVD risk to guide therapy.',
      'TC/HDL >5: Elevated CV risk — statin therapy consideration per ACC/AHA PCE if ASCVD ≥7.5%.',
      'LDL/HDL >3.5: Adverse ratio — associated with increased atherosclerotic plaque progression.',
    ],
    nextSteps: [
      'Calculate 10-year ASCVD risk using ACC/AHA Pooled Cohort Equations (PCE) — guides statin decision.',
      'Non-HDL cholesterol = TC − HDL: target <130 mg/dL for average risk, <100 for high risk adults.',
      'Lifestyle: Mediterranean diet, 150 min/week aerobic exercise, weight loss 5–10%, smoking cessation.',
      'Recheck fasting lipid panel 4–12 weeks after starting lifestyle changes or statin therapy.',
    ],
    differentials: [
      'Triglycerides >400 mg/dL: Friedewald LDL equation is invalid — measure LDL directly (direct LDL assay).',
      'Secondary dyslipidemia: hypothyroidism, nephrotic syndrome, DM, alcohol, medications — address underlying cause.',
      'HDL-raising medications (niacin, fibrates, CETP inhibitors) do not reliably reduce MACE — focus is on LDL reduction.',
      'Non-fasting sample: TG elevated (not useful), HDL and TC minimally affected — fasting preferred for TG.',
    ],
  },

  'health-insurance-premium-estimator': {
    guidelineSource: 'ACA Marketplace Rating Rules 2024 / Kaiser Family Foundation Premium Analysis 2024',
    recommendations: [
      'Silver plans with income 100–250% FPL: eligible for Cost Sharing Reductions (CSR) — lower deductibles/copays at same premium.',
      'Tobacco surcharge (up to 50%): consider smoking cessation programs — many plans cover these for free.',
      'Medicaid: income 100–138% FPL in expansion states — free comprehensive coverage.',
      'CHIP: free/low-cost coverage for children whose families earn too much for Medicaid.',
      'Open Enrollment period: November 1 – January 15 (most states) — act promptly to avoid gaps.',
    ],
    nextSteps: [
      'Visit HealthCare.gov (or state marketplace) for exact quotes based on your specific ZIP code and household.',
      'Use a licensed navigator (free service) to compare plans — especially for subsidy optimization.',
      'Check if employer-sponsored coverage is available — employer plans are often cheaper than marketplace.',
      'Special Enrollment Period triggers: job loss, birth/adoption, marriage, relocation, gaining citizenship.',
      'COBRA: continuation of employer coverage after job loss — often expensive (you pay full premium + 2%).',
    ],
    differentials: [
      'Premium estimates are illustrative — actual premiums vary by state, county, insurer, and age.',
      'Age rating: ACA allows insurers to charge older adults up to 3× the premium of younger adults.',
      'Short-term health plans: cheaper but not ACA-compliant — may exclude pre-existing conditions.',
      'Association health plans: may offer cheaper premiums but less comprehensive coverage.',
    ],
  },

  'surgery-cost-estimator': {
    guidelineSource: 'Healthcare Bluebook 2024 / FAIR Health Consumer Cost Lookup 2024 / No Surprises Act (2022)',
    recommendations: [
      'Request a Good Faith Estimate: the No Surprises Act (2022) requires providers to give written cost estimate before scheduled services.',
      'In-network providers: significantly lower OOP costs — always verify in-network status before scheduling.',
      'Ambulatory Surgery Centers (ASC): often 40–60% cheaper than hospital outpatient departments for the same procedure.',
      'Negotiate: hospitals (especially non-profit) can negotiate charges; ask about self-pay or prompt-pay discounts.',
      'OOP maximum: once reached, insurance covers 100% — track cumulative spending for family.',
    ],
    nextSteps: [
      'Contact your insurance: pre-authorization required for most elective surgeries — submit before scheduling.',
      'Compare facility costs: reference Healthcare Bluebook, Medicare Procedure Price Lookup, or your insurer\'s cost estimator.',
      'Ask about financial assistance: non-profit hospitals must offer charity care for qualifying incomes.',
      'Payment plans: most hospitals offer 0% interest installment plans — request before paying.',
      'Medical billing advocate: useful for complex bills or billing errors (present in 80% of hospital bills).',
    ],
    differentials: [
      'Cost estimate does not include anesthesiologist fees, pathology, radiology, or post-acute care — common surprise bills.',
      'Out-of-network anesthesiologist: NSA (2022) limits balance billing — dispute unexpected bills via IDR process.',
      'Complication costs: unexpected complications can add 50–200% to the original procedure cost.',
      'Geographic variation: the same procedure can cost 5–10× more in different cities — a known driver of US healthcare costs.',
    ],
  },

  'blood-pressure-tracker-chart': {
    guidelineSource: 'Whelton PK et al. J Am Coll Cardiol 2018 (ACC/AHA 2017 HTN Guideline) / AHA Home BP Monitoring Guidelines',
    recommendations: [
      'Normal (<120/<80): Maintain healthy habits; recheck annually. Risk of developing HTN by age 80: 90%.',
      'Elevated (120–129/<80): Lifestyle modification NOW — DASH diet, sodium <2.3g/day, 150 min exercise/week, weight loss.',
      'Stage 1 HTN (130–139/80–89): 10-year ASCVD ≥10%: start medication + lifestyle. <10%: lifestyle alone × 3 months.',
      'Stage 2 HTN (≥140/≥90): Two-drug combination preferred — thiazide diuretic + ACE-I/ARB or + calcium channel blocker.',
      'Hypertensive Crisis (≥180/≥120): Rest 5 minutes and recheck; if symptoms or still ≥180/120: call 911.',
    ],
    nextSteps: [
      'Single high reading is NOT diagnostic — average 2+ readings on 2+ separate occasions.',
      'Home BP monitoring: 2 readings morning + 2 readings evening × 7 days; record all values; average = true BP.',
      'Ambulatory BP monitoring (ABPM): gold standard for diagnosing white-coat or masked hypertension.',
      'Baseline labs if new HTN diagnosis: CMP, CBC, UA, fasting lipids, ECG.',
      'Reassess BP 1 month after medication initiation; adjust if target (<130/80) not reached.',
    ],
    differentials: [
      'White-coat HTN: elevated in office, normal at home — 15–30% of patients; ABPM confirms; not truly benign.',
      'Masked HTN: normal in office, elevated at home — higher CV risk; detected only by home/ambulatory monitoring.',
      'Measurement error: incorrect cuff size, patient talking, unsupported arm, full bladder all elevate readings.',
      'Secondary HTN: <10% of cases — consider if resistant, early onset, or hypokalemia (hyperaldosteronism, RAS).',
    ],
  },

  'drug-rehab-cost-calculator': {
    guidelineSource: 'SAMHSA Treatment Cost Study 2022 / NIDA Cost-Benefit of Addiction Treatment / ACA MHPAEA Parity Law',
    recommendations: [
      'Medication-Assisted Treatment (MAT): buprenorphine or methadone reduces opioid relapse by 50% and overdose mortality — first-line per SAMHSA.',
      'Residential treatment: recommended for severe SUD, co-occurring disorders, or failed outpatient treatment.',
      'Insurance parity: ACA Mental Health Parity and Addiction Equity Act (MHPAEA) requires equal coverage for SUD.',
      'Medicaid covers addiction treatment in all 50 states — apply if income eligible (expanded Medicaid covers up to 138% FPL).',
      'SAMHSA Helpline: 1-800-662-4357 — free, confidential, 24/7 treatment referrals.',
    ],
    nextSteps: [
      'State-funded treatment: free or sliding-scale — locator at findtreatment.gov or 1-800-662-4357.',
      'Coverage verification: call your insurance before treatment — get pre-authorization number in writing.',
      'Appeals process: insurance denials for SUD treatment can be appealed — often successfully.',
      'MAT prescribers: buprenorphine prescribed in primary care office — find at buprenorphine.samhsa.gov.',
      'Recovery support services: housing, employment, peer support — covered by Medicaid in many states.',
    ],
    differentials: [
      'Luxury rehab facilities (>$1000/day): limited evidence of superior outcomes vs standard-of-care treatment.',
      'Length of stay: longer treatment duration (90+ days) shows better outcomes than 28-day programs for most SUD.',
      'SUD + mental health: 40–60% of SUD patients have co-occurring mental health disorders — integrated dual-diagnosis treatment preferred.',
      'Online/telehealth SUD treatment: expanded since COVID — effective for mild-moderate SUD and MAT continuation.',
    ],
  },

  'therapy-session-cost-estimator': {
    guidelineSource: 'FAIR Health Consumer Cost Lookup 2024 / APA Practitioner Survey 2023 / MHPAEA Parity Law',
    recommendations: [
      'CBT (Cognitive Behavioral Therapy): strongest evidence base for depression, anxiety, PTSD, OCD — 8–20 sessions.',
      'ACA Parity Law (MHPAEA): insurance must cover mental health at same level as physical health — insist on this right.',
      'Sliding scale fees: most private therapists offer income-based reduced rates — always ask.',
      'EAP (Employee Assistance Program): free 6–12 sessions through many employers — check with HR.',
      'Online platforms (BetterHelp, Talkspace): 30–50% cheaper than in-person for mild-moderate presentations.',
    ],
    nextSteps: [
      'Open Path Collective: vetted licensed therapists at $30–$80/session for financial hardship cases.',
      'University training clinics: supervised graduate student therapists — $0–$50/session; evidence-based training.',
      'Community mental health centers: income-based sliding scale, often <$20/session.',
      'Check in-network therapists: psychology today (psychologytoday.com), Zocdoc, or your insurer\'s directory.',
      'Medication management: if both therapy and psychiatry are needed, combination is more effective than either alone for moderate-severe conditions.',
    ],
    differentials: [
      'Session duration varies: 45–50 min standard for individual therapy; 80 min for EMDR or deeper processing work — affects cost/hour.',
      'Psychiatrists primarily manage medication; psychologists and licensed therapists provide therapy — clarify role before scheduling.',
      'LCSW, LPC, MFT, licensed psychologists: comparable therapy outcomes across license types — verify licensure and specialization.',
      'Group therapy: comparable efficacy to individual therapy for depression, social anxiety — at 25–40% of the cost.',
    ],
  },

  'medication-cost-comparator': {
    guidelineSource: 'FDA Generic Drug Savings Report 2023 / IQVIA Medicine Use and Spending in the US 2024',
    recommendations: [
      'FDA AB-rated generics: therapeutically equivalent to brand name — same active ingredient, strength, dosage form, route, and bioavailability.',
      'Generic drugs: ~90% of US prescriptions — safe, effective, FDA-regulated, typically 80–85% cheaper.',
      'Narrow therapeutic index (NTI) drugs (warfarin, levothyroxine, lithium, anti-epileptics): may require physician approval before switching — monitor levels after.',
      'Biosimilars: generic equivalent for biologic drugs (injectables, insulins) — 30–40% cheaper; interchangeable products can be substituted by pharmacist.',
      'GoodRx / CostPlus Drugs (Mark Cuban): often lower than insurance copays for common generics — compare before filling.',
    ],
    nextSteps: [
      'Ask your doctor or pharmacist: "Is there an FDA-approved generic available and appropriate for me?"',
      'GoodRx app: compare prices across pharmacies in your area — prices vary up to 10× between pharmacies.',
      'Patient Assistance Programs (PAPs): brand drug manufacturers offer free or low-cost drugs for qualifying patients — NeedyMeds.org, RxAssist.org.',
      '90-day supply: typically cheaper per-dose than 30-day fills — ask for 90-day prescription for maintenance medications.',
      'Formulary review: your insurer\'s formulary lists preferred drugs with lower copays — ask your doctor to prescribe formulary-preferred agents.',
    ],
    differentials: [
      'Authorized generics: identical to brand (same manufacturing plant) but sold at generic price — may be preferred for NTI drugs.',
      'Generic is not always cheapest: compare GoodRx prices for both brand and generic — sometimes brand with manufacturer coupon is cheaper.',
      'Compounded medications: custom-made by compounding pharmacy — not FDA-approved but sometimes necessary for unique doses/allergen-free formulations.',
      'Drug interactions: switching between manufacturers of the same generic (inactive ingredients vary) can rarely affect absorption — relevant for NTI drugs.',
    ],
  },

  // ─── ADDITIONAL CARDIOLOGY ───────────────────────────────────────────

  'blood-pressure-classification': {
    guidelineSource: 'Whelton PK et al. JACC 2018 (ACC/AHA 2017 Hypertension Guidelines)',
    recommendations: [
      'Normal (<120/<80): No treatment — reinforce healthy lifestyle.',
      'Elevated (120–129/<80): Lifestyle modification (DASH diet, exercise, Na restriction, weight loss).',
      'Stage 1 HTN (130–139/80–89): 10-year ASCVD ≥10%: medication + lifestyle. <10%: lifestyle alone.',
      'Stage 2 HTN (≥140/≥90): Two-drug combination preferred; amlodipine + ACE-I/ARB is first-line.',
      'Hypertensive Crisis (≥180/≥120): Assess for end-organ damage — urgency vs emergency.',
    ],
    nextSteps: [
      'Confirm with 2 readings on 2 separate days before diagnosing.',
      'Home BP monitoring or ABPM to exclude white-coat hypertension.',
      'Baseline labs: BMP, CBC, UA, fasting lipids, ECG.',
      'Screen for secondary HTN in resistant cases (hyperaldosteronism, renal artery stenosis).',
      'Reassess at 1 month after medication initiation.',
    ],
    differentials: [
      'White-coat HTN: 15–30% of cases — ABPM confirms diagnosis.',
      'Pseudohypertension in elderly: Osler maneuver — stiff calcified arteries.',
      'Both arms at first visit — >15 mmHg difference suggests subclavian stenosis or aortic coarctation.',
    ],
  },

  'qtc-interval-calculator': {
    guidelineSource: 'Bazett HC. Heart 1920 / Fridericia LS. Acta Med Scand 1920',
    recommendations: [
      'QTc <440 ms (men) / <460 ms (women): Normal.',
      'QTc 440–500 ms: Prolonged — review all QT-prolonging medications (crediblemeds.org).',
      'QTc >500 ms: High TdP risk — cardiology consult, discontinue offending drugs, correct electrolytes.',
      'QTc increase >60 ms from baseline: Clinically significant regardless of absolute value.',
    ],
    nextSteps: [
      'Review full medication list on crediblemeds.org.',
      'Serum K⁺, Mg²⁺, Ca²⁺ — correct deficiencies.',
      '12-lead ECG with manual QT measurement in lead II and V5.',
      'Cardiology consult for QTc >500 ms or symptomatic arrhythmia.',
      'Genetic testing if congenital LQTS suspected (family history, unexplained syncope).',
    ],
    differentials: [
      'Bazett formula overcorrects at high heart rates (>100 bpm) — Fridericia preferred in tachycardia.',
      'LBBB/RBBB prolongs QRS and QT — adjusted formulas needed.',
      'Autonomic neuropathy (DM) causes QTc prolongation independent of drugs.',
    ],
  },

  'framingham-risk-score': {
    guidelineSource: 'Wilson PW et al. Circulation 1998 / ACC/AHA 2019 Primary Prevention Guidelines',
    recommendations: [
      '<5% (Low): Lifestyle counseling only.',
      '5–7.5% (Borderline): Identify risk-enhancing factors (CRP, CAC, ABI) to guide statin use.',
      '7.5–20% (Intermediate): Moderate-intensity statin; high-intensity if additional risk enhancers.',
      '>20% (High): High-intensity statin therapy.',
      'All risk levels: Mediterranean or DASH diet, 150 min/week aerobic exercise, smoking cessation.',
    ],
    nextSteps: [
      'Fasting lipid panel, fasting glucose.',
      'CAC score (0 = low risk, can defer statin; ≥100 = high risk, initiate statin).',
      'hs-CRP if treatment decision uncertain.',
      'Reassess every 4–6 years or after major risk factor change.',
    ],
    differentials: [
      'Framingham primarily derived in white populations — ASCVD Pooled Cohort now preferred in US.',
      'Does not include family history, CRP, CAC, or ABI as variables.',
      'Age range: 30–74 — not validated outside this range.',
    ],
  },

  'wells-score-dvt-pe': {
    guidelineSource: 'Wells PS et al. Lancet 1997 / ASH VTE Guidelines 2020',
    recommendations: [
      'Low risk (≤0): D-dimer; if negative, DVT excluded.',
      'Moderate risk (1–2): High-sensitivity D-dimer or compression ultrasound.',
      'High risk (≥3): Compression ultrasound immediately; anticoagulate if positive.',
    ],
    nextSteps: [
      'Age-adjusted D-dimer (age × 10 μg/L if >50 years) increases specificity.',
      'Proximal compression ultrasound for high-probability DVT.',
      'Anticoagulate ≥3 months for provoked DVT; longer if unprovoked.',
    ],
    differentials: [
      'D-dimer elevated by many conditions — low specificity.',
      'Calf DVT: lower PE risk — some guidelines suggest observation over anticoagulation.',
    ],
  },

  'sofa-sepsis-score': {
    guidelineSource: 'Vincent JL et al. Intensive Care Med 1996 / Sepsis-3 2016',
    recommendations: [
      'SOFA ≥2 increase + suspected infection = Sepsis.',
      'Sepsis + vasopressors + lactate >2 = Septic Shock.',
      'Initiate 1-hour sepsis bundle immediately.',
    ],
    nextSteps: [
      'Blood cultures, lactate, broad-spectrum antibiotics within 1 hour.',
      'Norepinephrine for vasopressor-requiring hypotension.',
      'Daily SOFA reassessment.',
    ],
    differentials: [
      'Pre-existing organ dysfunction (CKD, cirrhosis) confounds baseline SOFA.',
      'Sedation confounds neurological SOFA component.',
    ],
  },
}

export function getEnrichment(id: string): ClinicalEnrichment | null {
  return MEDICAL_ENRICHMENTS[id] ?? null
}
