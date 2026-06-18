// ============================================================
// ROUGHTOOLS — MEDICAL CALCULATOR CONFIGS
// Pure data file — NO 'use client' directive.
// Safe to import from both Server and Client components.
// ============================================================

export interface InputField {
  id: string;
  label: string;
  unit?: string;
  type?: 'number' | 'select' | 'date';
  default?: number | string;
  min?: number;
  step?: number;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface OutputField {
  id: string;
  label: string;
  unit?: string;
  decimals?: number;
}

export interface MedicalCalcConfig {
  slug: string;
  name: string;
  icon: string;
  description: string;
  formula: string;
  reference?: string;
  inputs: InputField[];
  outputs: OutputField[];
  calculate: (vals: Record<string, number | string>) => Record<string, number>;
}

// ─── Configs ─────────────────────────────────────────────────

export const MEDICAL_CONFIGS: Record<string, MedicalCalcConfig> = {
  // ── BMI Calculator ────────────────────────────────────────
  'bmi-calculator': {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    icon: '⚖️',
    description: 'Calculate Body Mass Index from weight and height. Includes WHO classification.',
    formula: 'BMI = weight(kg) / height(m)²',
    reference: 'WHO BMI Classification 2000',
    inputs: [
      { id: 'weight', label: 'Weight', unit: 'kg', default: 70, min: 1, step: 0.1 },
      { id: 'height', label: 'Height', unit: 'cm', default: 170, min: 50, step: 0.1 },
    ],
    outputs: [
      { id: 'bmi', label: 'BMI', unit: 'kg/m²', decimals: 1 },
      { id: 'category', label: 'BMI Category', decimals: 0 },
    ],
    calculate(v) {
      const h = Number(v.height) / 100;
      const bmi = Number(v.weight) / (h * h);
      const category = bmi < 18.5 ? 1 : bmi < 25 ? 2 : bmi < 30 ? 3 : 4;
      return { bmi, category };
    },
  },

  // ── eGFR CKD-EPI ─────────────────────────────────────────
  'egfr-ckd-epi-calculator': {
    slug: 'egfr-ckd-epi-calculator',
    name: 'eGFR Calculator (CKD-EPI)',
    icon: '🫘',
    description: 'Estimate glomerular filtration rate using the 2021 CKD-EPI creatinine equation.',
    formula: 'eGFR = 142 × min(Scr/κ,1)^α × max(Scr/κ,1)^−1.200 × 0.9938^Age',
    reference: 'Inker et al. NEJM 2021 (race-free CKD-EPI)',
    inputs: [
      {
        id: 'creatinine',
        label: 'Serum Creatinine',
        unit: 'mg/dL',
        default: 1.0,
        min: 0.1,
        step: 0.01,
      },
      { id: 'age', label: 'Age', unit: 'years', default: 50, min: 18, step: 1 },
      {
        id: 'sex',
        label: 'Biological Sex',
        type: 'select',
        default: '1',
        options: [
          { value: '1', label: 'Male' },
          { value: '0', label: 'Female' },
        ],
      },
    ],
    outputs: [
      { id: 'egfr', label: 'eGFR', unit: 'mL/min/1.73m²', decimals: 1 },
      { id: 'ckd_stage', label: 'CKD Stage', decimals: 0 },
    ],
    calculate(v) {
      const scr = Number(v.creatinine);
      const age = Number(v.age);
      const isMale = String(v.sex) === '1';
      const kappa = isMale ? 0.9 : 0.7;
      const alpha = isMale ? -0.302 : -0.241;
      const ratio = scr / kappa;
      const egfr =
        142 *
        Math.pow(Math.min(ratio, 1), alpha) *
        Math.pow(Math.max(ratio, 1), -1.2) *
        Math.pow(0.9938, age) *
        (isMale ? 1 : 1.012);
      const ckd_stage = egfr >= 90 ? 1 : egfr >= 60 ? 2 : egfr >= 30 ? 3 : egfr >= 15 ? 4 : 5;
      return { egfr, ckd_stage };
    },
  },

  // ── Creatinine Clearance (Cockcroft-Gault) ────────────────
  'creatinine-clearance-cockcroft-gault': {
    slug: 'creatinine-clearance-cockcroft-gault',
    name: 'Creatinine Clearance (Cockcroft-Gault)',
    icon: '🫘',
    description: 'Calculate estimated creatinine clearance for drug dosing adjustment.',
    formula: 'CrCl = [(140 − Age) × Weight] / (72 × SCr) × 0.85 if female',
    reference: 'Cockcroft & Gault, Nephron 1976',
    inputs: [
      { id: 'age', label: 'Age', unit: 'years', default: 55, min: 18, step: 1 },
      { id: 'weight', label: 'Weight', unit: 'kg', default: 70, min: 20, step: 0.5 },
      {
        id: 'creatinine',
        label: 'Serum Creatinine',
        unit: 'mg/dL',
        default: 1.2,
        min: 0.1,
        step: 0.01,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        default: '1',
        options: [
          { value: '1', label: 'Male' },
          { value: '0', label: 'Female' },
        ],
      },
    ],
    outputs: [{ id: 'crcl', label: 'CrCl', unit: 'mL/min', decimals: 1 }],
    calculate(v) {
      const isMale = String(v.sex) === '1';
      const crcl =
        (((140 - Number(v.age)) * Number(v.weight)) / (72 * Number(v.creatinine))) *
        (isMale ? 1 : 0.85);
      return { crcl };
    },
  },

  // ── Glasgow Coma Scale ────────────────────────────────────
  'glasgow-coma-scale': {
    slug: 'glasgow-coma-scale',
    name: 'Glasgow Coma Scale (GCS)',
    icon: '🧠',
    description:
      'Assess level of consciousness after brain injury using eye, verbal, and motor responses.',
    formula: 'GCS = Eye (1–4) + Verbal (1–5) + Motor (1–6)',
    reference: 'Teasdale & Jennett, Lancet 1974',
    inputs: [
      {
        id: 'eye',
        label: 'Eye Opening',
        type: 'select',
        default: '4',
        options: [
          { value: '4', label: '4 — Spontaneous' },
          { value: '3', label: '3 — To voice' },
          { value: '2', label: '2 — To pain' },
          { value: '1', label: '1 — None' },
        ],
      },
      {
        id: 'verbal',
        label: 'Verbal Response',
        type: 'select',
        default: '5',
        options: [
          { value: '5', label: '5 — Oriented' },
          { value: '4', label: '4 — Confused' },
          { value: '3', label: '3 — Words only' },
          { value: '2', label: '2 — Sounds' },
          { value: '1', label: '1 — None' },
        ],
      },
      {
        id: 'motor',
        label: 'Motor Response',
        type: 'select',
        default: '6',
        options: [
          { value: '6', label: '6 — Obeys commands' },
          { value: '5', label: '5 — Localizes pain' },
          { value: '4', label: '4 — Withdraws' },
          { value: '3', label: '3 — Flexion' },
          { value: '2', label: '2 — Extension' },
          { value: '1', label: '1 — None' },
        ],
      },
    ],
    outputs: [
      { id: 'gcs', label: 'GCS Total Score', unit: '/ 15', decimals: 0 },
      { id: 'severity', label: 'Injury Severity', decimals: 0 },
    ],
    calculate(v) {
      const gcs = Number(v.eye) + Number(v.verbal) + Number(v.motor);
      const severity = gcs >= 13 ? 1 : gcs >= 9 ? 2 : 3;
      return { gcs, severity };
    },
  },

  // ── PHQ-9 Depression Screen ───────────────────────────────
  'phq9-depression-screen': {
    slug: 'phq9-depression-screen',
    name: 'PHQ-9 Depression Screening',
    icon: '🧠',
    description: 'Screen for depression severity using the Patient Health Questionnaire-9.',
    formula: 'PHQ-9 total = sum of 9 items (0–3 each), max 27',
    reference: 'Kroenke & Spitzer, Gen Hosp Psychiatry 2002',
    inputs: [
      {
        id: 'q1',
        label: 'Little interest or pleasure in doing things',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '0 — Not at all' },
          { value: '1', label: '1 — Several days' },
          { value: '2', label: '2 — More than half' },
          { value: '3', label: '3 — Nearly every day' },
        ],
      },
      {
        id: 'q2',
        label: 'Feeling down, depressed, or hopeless',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '0 — Not at all' },
          { value: '1', label: '1 — Several days' },
          { value: '2', label: '2 — More than half' },
          { value: '3', label: '3 — Nearly every day' },
        ],
      },
      {
        id: 'q3',
        label: 'Trouble falling/staying asleep, or sleeping too much',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '0 — Not at all' },
          { value: '1', label: '1 — Several days' },
          { value: '2', label: '2 — More than half' },
          { value: '3', label: '3 — Nearly every day' },
        ],
      },
      {
        id: 'q4',
        label: 'Feeling tired or having little energy',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '0 — Not at all' },
          { value: '1', label: '1 — Several days' },
          { value: '2', label: '2 — More than half' },
          { value: '3', label: '3 — Nearly every day' },
        ],
      },
      {
        id: 'q5',
        label: 'Poor appetite or overeating',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '0 — Not at all' },
          { value: '1', label: '1 — Several days' },
          { value: '2', label: '2 — More than half' },
          { value: '3', label: '3 — Nearly every day' },
        ],
      },
      {
        id: 'q6',
        label: 'Feeling bad about yourself',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '0 — Not at all' },
          { value: '1', label: '1 — Several days' },
          { value: '2', label: '2 — More than half' },
          { value: '3', label: '3 — Nearly every day' },
        ],
      },
      {
        id: 'q7',
        label: 'Trouble concentrating on things',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '0 — Not at all' },
          { value: '1', label: '1 — Several days' },
          { value: '2', label: '2 — More than half' },
          { value: '3', label: '3 — Nearly every day' },
        ],
      },
      {
        id: 'q8',
        label: 'Moving/speaking so slowly or being fidgety/restless',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '0 — Not at all' },
          { value: '1', label: '1 — Several days' },
          { value: '2', label: '2 — More than half' },
          { value: '3', label: '3 — Nearly every day' },
        ],
      },
      {
        id: 'q9',
        label: 'Thoughts of being better off dead or hurting yourself',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '0 — Not at all' },
          { value: '1', label: '1 — Several days' },
          { value: '2', label: '2 — More than half' },
          { value: '3', label: '3 — Nearly every day' },
        ],
      },
    ],
    outputs: [
      { id: 'score', label: 'PHQ-9 Score', unit: '/ 27', decimals: 0 },
      { id: 'severity', label: 'Depression Severity', decimals: 0 },
    ],
    calculate(v) {
      const score = Number(
        [v.q1, v.q2, v.q3, v.q4, v.q5, v.q6, v.q7, v.q8, v.q9].reduce(
          (s: number, x) => s + Number(x),
          0
        )
      );
      const severity = score <= 4 ? 1 : score <= 9 ? 2 : score <= 14 ? 3 : score <= 19 ? 4 : 5;
      return { score, severity };
    },
  },

  // ── Framingham Risk Score ─────────────────────────────────
  'framingham-risk-score': {
    slug: 'framingham-risk-score',
    name: 'Framingham 10-Year CVD Risk',
    icon: '❤️',
    description: 'Estimate 10-year cardiovascular disease risk based on Framingham Heart Study.',
    formula: 'Points-based from age, TC, HDL, SBP, smoking, diabetes',
    reference: 'Wilson et al. Circulation 1998',
    inputs: [
      { id: 'age', label: 'Age', unit: 'years', default: 50, min: 30, step: 1 },
      { id: 'tc', label: 'Total Cholesterol', unit: 'mg/dL', default: 200, min: 100, step: 1 },
      { id: 'hdl', label: 'HDL Cholesterol', unit: 'mg/dL', default: 50, min: 20, step: 1 },
      { id: 'sbp', label: 'Systolic BP', unit: 'mmHg', default: 120, min: 90, step: 1 },
      {
        id: 'smoking',
        label: 'Current Smoker',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No' },
          { value: '1', label: 'Yes' },
        ],
      },
      {
        id: 'diabetes',
        label: 'Diabetes',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No' },
          { value: '1', label: 'Yes' },
        ],
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        default: '1',
        options: [
          { value: '1', label: 'Male' },
          { value: '0', label: 'Female' },
        ],
      },
    ],
    outputs: [{ id: 'risk', label: '10-Year CVD Risk', unit: '%', decimals: 1 }],
    calculate(v) {
      const age = Number(v.age);
      const tc = Number(v.tc);
      const hdl = Number(v.hdl);
      const sbp = Number(v.sbp);
      const smk = Number(v.smoking);
      const diab = Number(v.diabetes);
      const male = String(v.sex) === '1';
      // Simplified risk estimate
      let points = 0;
      if (male) {
        points +=
          age < 35
            ? -1
            : age < 40
              ? 0
              : age < 45
                ? 1
                : age < 50
                  ? 2
                  : age < 55
                    ? 3
                    : age < 60
                      ? 4
                      : age < 65
                        ? 5
                        : age < 70
                          ? 6
                          : 7;
        points += tc < 160 ? -3 : tc < 200 ? 0 : tc < 240 ? 1 : tc < 280 ? 2 : 3;
        points += hdl >= 60 ? -2 : hdl >= 50 ? -1 : hdl >= 45 ? 0 : hdl >= 35 ? 1 : 2;
        points += sbp < 120 ? 0 : sbp < 130 ? 0 : sbp < 140 ? 1 : sbp < 160 ? 2 : 3;
      } else {
        points +=
          age < 35
            ? -9
            : age < 40
              ? -4
              : age < 45
                ? 0
                : age < 50
                  ? 3
                  : age < 55
                    ? 6
                    : age < 60
                      ? 7
                      : age < 65
                        ? 8
                        : age < 70
                          ? 8
                          : 8;
        points += tc < 160 ? -2 : tc < 200 ? 0 : tc < 240 ? 1 : tc < 280 ? 1 : 3;
        points += hdl >= 60 ? -2 : hdl >= 50 ? -1 : hdl >= 45 ? 0 : hdl >= 35 ? 1 : 2;
        points += sbp < 120 ? -3 : sbp < 130 ? 0 : sbp < 140 ? 1 : sbp < 160 ? 2 : 3;
      }
      points += smk * 2;
      points += diab * (male ? 3 : 4);
      // Rough % risk mapping
      const RISK_M: Record<number, number> = {
        '-3': 1,
        '-2': 2,
        '-1': 2,
        '0': 3,
        '1': 4,
        '2': 4,
        '3': 6,
        '4': 7,
        '5': 9,
        '6': 11,
        '7': 14,
        '8': 18,
        '9': 22,
        '10': 27,
        '11': 33,
        '12': 40,
      };
      const RISK_F: Record<number, number> = {
        '-2': 1,
        '-1': 2,
        '0': 2,
        '1': 2,
        '2': 3,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 11,
        '11': 13,
        '12': 15,
      };
      const table = male ? RISK_M : RISK_F;
      const clamp = Math.max(-3, Math.min(12, points));
      const risk = table[clamp] ?? (clamp > 12 ? 40 : 1);
      return { risk };
    },
  },

  // ── Mean Arterial Pressure ────────────────────────────────
  'mean-arterial-pressure-calculator': {
    slug: 'mean-arterial-pressure-calculator',
    name: 'Mean Arterial Pressure (MAP)',
    icon: '🫀',
    description: 'Calculate mean arterial pressure from systolic and diastolic blood pressure.',
    formula: 'MAP = DBP + (SBP − DBP) / 3',
    reference: 'Clinical standard formula',
    inputs: [
      { id: 'sbp', label: 'Systolic BP', unit: 'mmHg', default: 120, min: 60, step: 1 },
      { id: 'dbp', label: 'Diastolic BP', unit: 'mmHg', default: 80, min: 30, step: 1 },
    ],
    outputs: [{ id: 'map', label: 'MAP', unit: 'mmHg', decimals: 1 }],
    calculate(v) {
      const map = Number(v.dbp) + (Number(v.sbp) - Number(v.dbp)) / 3;
      return { map };
    },
  },

  // ── HbA1c ↔ Glucose Converter ────────────────────────────
  'hba1c-glucose-converter': {
    slug: 'hba1c-glucose-converter',
    name: 'HbA1c ↔ Average Glucose Converter',
    icon: '🩸',
    description: 'Convert between HbA1c (%) and estimated average plasma glucose (eAG).',
    formula: 'eAG (mg/dL) = 28.7 × A1C − 46.7',
    reference: 'Nathan et al. Diabetes Care 2008',
    inputs: [{ id: 'hba1c', label: 'HbA1c', unit: '%', default: 7.0, min: 4, step: 0.1 }],
    outputs: [
      { id: 'eag_mg', label: 'eAG', unit: 'mg/dL', decimals: 0 },
      { id: 'eag_mmol', label: 'eAG', unit: 'mmol/L', decimals: 1 },
    ],
    calculate(v) {
      const eag_mg = 28.7 * Number(v.hba1c) - 46.7;
      const eag_mmol = eag_mg / 18.02;
      return { eag_mg, eag_mmol };
    },
  },

  // ── CURB-65 Pneumonia Score ───────────────────────────────
  'curb-65-pneumonia-score': {
    slug: 'curb-65-pneumonia-score',
    name: 'CURB-65 Pneumonia Severity Score',
    icon: '🫁',
    description:
      'Predict 30-day mortality in community-acquired pneumonia to guide admission decisions.',
    formula: 'CURB-65 = sum of 5 binary criteria (0–5)',
    reference: 'Lim et al. Thorax 2003',
    inputs: [
      {
        id: 'confusion',
        label: 'Confusion (new disorientation)',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
      {
        id: 'urea',
        label: 'Urea > 7 mmol/L (BUN > 19 mg/dL)',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
      {
        id: 'rr',
        label: 'RR ≥ 30 breaths/min',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
      {
        id: 'bp',
        label: 'BP < 90/60 mmHg',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
      {
        id: 'age65',
        label: 'Age ≥ 65 years',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
    ],
    outputs: [
      { id: 'score', label: 'CURB-65 Score', unit: '/ 5', decimals: 0 },
      { id: 'mortality', label: '30-day Mortality', unit: '%', decimals: 1 },
    ],
    calculate(v) {
      const score = Number(
        [v.confusion, v.urea, v.rr, v.bp, v.age65].reduce((s: number, x) => s + Number(x), 0)
      );
      const MORT = [0.7, 3.2, 13, 17, 41.5, 57];
      return { score, mortality: MORT[score] ?? 57 };
    },
  },

  // ── Anion Gap ─────────────────────────────────────────────
  'anion-gap-calculator': {
    slug: 'anion-gap-calculator',
    name: 'Anion Gap Calculator',
    icon: '🧪',
    description: 'Calculate anion gap to differentiate causes of metabolic acidosis.',
    formula: 'AG = Na − (Cl + HCO₃)',
    reference: 'Clinical chemistry standard',
    inputs: [
      { id: 'na', label: 'Sodium (Na⁻º)', unit: 'mEq/L', default: 140, min: 100, step: 1 },
      { id: 'cl', label: 'Chloride (Cl⁻)', unit: 'mEq/L', default: 104, min: 70, step: 1 },
      { id: 'hco3', label: 'Bicarbonate (HCO₃⁻)', unit: 'mEq/L', default: 24, min: 5, step: 1 },
      {
        id: 'albumin',
        label: 'Albumin (for correction)',
        unit: 'g/dL',
        default: 4.0,
        min: 0.5,
        step: 0.1,
      },
    ],
    outputs: [
      { id: 'ag', label: 'Anion Gap', unit: 'mEq/L', decimals: 1 },
      { id: 'corrected_ag', label: 'Albumin-corrected AG', unit: 'mEq/L', decimals: 1 },
    ],
    calculate(v) {
      const ag = Number(v.na) - (Number(v.cl) + Number(v.hco3));
      const corrected_ag = ag + 2.5 * (4.0 - Number(v.albumin));
      return { ag, corrected_ag };
    },
  },

  // ── Due Date / EDD Calculator ─────────────────────────────
  'due-date-edd-calculator': {
    slug: 'due-date-edd-calculator',
    name: 'Due Date (EDD) Calculator',
    icon: '🤰',
    description: 'Calculate estimated due date and gestational age from last menstrual period.',
    formula: "EDD = LMP + 280 days (Naegele's Rule)",
    reference: "Naegele's rule — ACOG",
    inputs: [{ id: 'lmp_date', label: 'Last Menstrual Period (LMP)', type: 'date', default: '' }],
    outputs: [
      { id: 'weeks_ga', label: 'Gestational Age', unit: 'weeks', decimals: 1 },
      { id: 'days_remaining', label: 'Days Until Due Date', unit: 'days', decimals: 0 },
      { id: 'edd_ts', label: 'Estimated Due Date', decimals: 0 },
    ],
    calculate(v) {
      const lmpStr = String(v.lmp_date);
      if (!lmpStr) return { weeks_ga: 0, days_remaining: 280, edd_ts: 0 };
      const lmpDate = new Date(lmpStr);
      const today = new Date();
      const daysSinceLMP = Math.floor(
        (today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const weeks_ga = Math.max(0, daysSinceLMP) / 7;
      const days_remaining = 280 - Math.max(0, daysSinceLMP);
      const edd = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
      return { weeks_ga, days_remaining, edd_ts: edd.getTime() };
    },
  },

  // ── Weight-Based Drug Dose Calculator ─────────────────────
  'weight-based-drug-dose-calculator': {
    slug: 'weight-based-drug-dose-calculator',
    name: 'Weight-Based Drug Dose Calculator',
    icon: '💊',
    description: 'Calculate drug dose based on patient weight and dose per kg.',
    formula: 'Dose = Weight × Dose/kg',
    reference: 'Pediatric and adult pharmacology standard',
    inputs: [
      { id: 'weight', label: 'Patient Weight', unit: 'kg', default: 70, min: 0.5, step: 0.1 },
      {
        id: 'dose_per_kg',
        label: 'Dose per kg',
        unit: 'mg/kg',
        default: 10,
        min: 0.001,
        step: 0.01,
      },
      { id: 'frequency', label: 'Doses per day', unit: '/day', default: 3, min: 1, step: 1 },
    ],
    outputs: [
      { id: 'single_dose', label: 'Single Dose', unit: 'mg', decimals: 1 },
      { id: 'daily_dose', label: 'Total Daily Dose', unit: 'mg', decimals: 1 },
    ],
    calculate(v) {
      const single_dose = Number(v.weight) * Number(v.dose_per_kg);
      const daily_dose = single_dose * Number(v.frequency);
      return { single_dose, daily_dose };
    },
  },

  // ── MELD Score ────────────────────────────────────────────
  'meld-score-calculator': {
    slug: 'meld-score-calculator',
    name: 'MELD Score Calculator',
    icon: '🫀',
    description: 'Calculate Model for End-Stage Liver Disease score for liver transplant listing.',
    formula: 'MELD = 3.78×ln(Bili) + 11.2×ln(INR) + 9.57×ln(Cr) + 6.43',
    reference: 'Kamath et al. Hepatology 2001',
    inputs: [
      { id: 'bilirubin', label: 'Bilirubin', unit: 'mg/dL', default: 1.0, min: 0.1, step: 0.1 },
      { id: 'inr', label: 'INR', unit: '', default: 1.0, min: 0.5, step: 0.01 },
      { id: 'creatinine', label: 'Creatinine', unit: 'mg/dL', default: 1.0, min: 0.1, step: 0.01 },
    ],
    outputs: [
      { id: 'meld', label: 'MELD Score', decimals: 0 },
      { id: 'mortality_3mo', label: '3-Month Mortality', unit: '%', decimals: 0 },
    ],
    calculate(v) {
      const bili = Math.max(1.0, Number(v.bilirubin));
      const inr = Math.max(1.0, Number(v.inr));
      const cr = Math.max(1.0, Math.min(4.0, Number(v.creatinine)));
      const meld = Math.round(
        3.78 * Math.log(bili) + 11.2 * Math.log(inr) + 9.57 * Math.log(cr) + 6.43
      );
      const mortality_3mo = meld < 9 ? 2 : meld < 19 ? 6 : meld < 29 ? 20 : meld < 39 ? 52 : 70;
      return { meld, mortality_3mo };
    },
  },

  // ── SOFA Sepsis Score ─────────────────────────────────────
  'sofa-sepsis-score': {
    slug: 'sofa-sepsis-score',
    name: 'SOFA Sepsis Score',
    icon: '🏥',
    description: 'Sequential Organ Failure Assessment score for ICU mortality prediction.',
    formula: 'SOFA = Respiratory + Coagulation + Liver + CV + CNS + Renal (each 0–4)',
    reference: 'Vincent et al. Intensive Care Med 1996',
    inputs: [
      {
        id: 'resp',
        label: 'PaO2/FiO2',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '≥400 — 0 pts' },
          { value: '1', label: '300–399 — 1 pt' },
          { value: '2', label: '200–299 — 2 pts' },
          { value: '3', label: '100–199 + vent — 3 pts' },
          { value: '4', label: '<100 + vent — 4 pts' },
        ],
      },
      {
        id: 'plt',
        label: 'Platelets',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '≥150 — 0 pts' },
          { value: '1', label: '100–149 — 1 pt' },
          { value: '2', label: '50–99 — 2 pts' },
          { value: '3', label: '20–49 — 3 pts' },
          { value: '4', label: '<20 — 4 pts' },
        ],
      },
      {
        id: 'bili',
        label: 'Bilirubin (mg/dL)',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '<1.2 — 0 pts' },
          { value: '1', label: '1.2–1.9 — 1 pt' },
          { value: '2', label: '2.0–5.9 — 2 pts' },
          { value: '3', label: '6.0–11.9 — 3 pts' },
          { value: '4', label: '≥12.0 — 4 pts' },
        ],
      },
      {
        id: 'cv',
        label: 'Cardiovascular',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'MAP ≥70 — 0 pts' },
          { value: '1', label: 'MAP <70 — 1 pt' },
          { value: '2', label: 'Dopa ≤5 — 2 pts' },
          { value: '3', label: 'Dopa >5 — 3 pts' },
          { value: '4', label: 'Epi >0.1 — 4 pts' },
        ],
      },
      {
        id: 'gcs_pts',
        label: 'GCS Score',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '15 — 0 pts' },
          { value: '1', label: '13–14 — 1 pt' },
          { value: '2', label: '10–12 — 2 pts' },
          { value: '3', label: '6–9 — 3 pts' },
          { value: '4', label: '<6 — 4 pts' },
        ],
      },
      {
        id: 'cr',
        label: 'Creatinine/Urine Output',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: '<1.2 mg/dL — 0 pts' },
          { value: '1', label: '1.2–1.9 — 1 pt' },
          { value: '2', label: '2.0–3.4 — 2 pts' },
          { value: '3', label: '3.5–4.9 — 3 pts' },
          { value: '4', label: '>5.0 — 4 pts' },
        ],
      },
    ],
    outputs: [
      { id: 'sofa', label: 'SOFA Score', unit: '/ 24', decimals: 0 },
      { id: 'mortality', label: 'Predicted Mortality', unit: '%', decimals: 0 },
    ],
    calculate(v) {
      const sofa = Number(
        [v.resp, v.plt, v.bili, v.cv, v.gcs_pts, v.cr].reduce((s: number, x) => s + Number(x), 0)
      );
      const mortality = sofa < 7 ? 10 : sofa < 10 ? 15 : sofa < 13 ? 40 : sofa < 16 ? 60 : 85;
      return { sofa, mortality };
    },
  },

  // ── Child-Pugh Score ──────────────────────────────────────
  'child-pugh-score-calculator': {
    slug: 'child-pugh-score-calculator',
    name: 'Child-Pugh Score',
    icon: '🫀',
    description: 'Assess severity of chronic liver disease for surgical risk and prognosis.',
    formula: 'Score = Bilirubin + Albumin + PT/INR + Ascites + Encephalopathy (each 1–3)',
    reference: 'Child & Turcotte 1964; Pugh et al. 1973',
    inputs: [
      {
        id: 'bili',
        label: 'Bilirubin (mg/dL)',
        type: 'select',
        default: '1',
        options: [
          { value: '1', label: '<2 mg/dL — 1 pt' },
          { value: '2', label: '2–3 mg/dL — 2 pts' },
          { value: '3', label: '>3 mg/dL — 3 pts' },
        ],
      },
      {
        id: 'albumin',
        label: 'Albumin (g/dL)',
        type: 'select',
        default: '1',
        options: [
          { value: '1', label: '>3.5 — 1 pt' },
          { value: '2', label: '2.8–3.5 — 2 pts' },
          { value: '3', label: '<2.8 — 3 pts' },
        ],
      },
      {
        id: 'pt',
        label: 'Prothrombin Time',
        type: 'select',
        default: '1',
        options: [
          { value: '1', label: '<4 sec prolonged — 1 pt' },
          { value: '2', label: '4–6 sec — 2 pts' },
          { value: '3', label: '>6 sec — 3 pts' },
        ],
      },
      {
        id: 'ascites',
        label: 'Ascites',
        type: 'select',
        default: '1',
        options: [
          { value: '1', label: 'None — 1 pt' },
          { value: '2', label: 'Mild — 2 pts' },
          { value: '3', label: 'Severe — 3 pts' },
        ],
      },
      {
        id: 'enceph',
        label: 'Encephalopathy',
        type: 'select',
        default: '1',
        options: [
          { value: '1', label: 'None — 1 pt' },
          { value: '2', label: 'Grade I–II — 2 pts' },
          { value: '3', label: 'Grade III–IV — 3 pts' },
        ],
      },
    ],
    outputs: [
      { id: 'score', label: 'Child-Pugh Score', decimals: 0 },
      { id: 'class', label: 'Child-Pugh Class', decimals: 0 },
      { id: 'survival_1yr', label: '1-Year Survival', unit: '%', decimals: 0 },
    ],
    calculate(v) {
      const score = Number(
        [v.bili, v.albumin, v.pt, v.ascites, v.enceph].reduce((s: number, x) => s + Number(x), 0)
      );
      const cls = score <= 6 ? 1 : score <= 9 ? 2 : 3;
      const survival_1yr = cls === 1 ? 100 : cls === 2 ? 80 : 45;
      return { score, class: cls, survival_1yr };
    },
  },

  // ── Wells Score DVT/PE ────────────────────────────────────
  'wells-score-dvt-pe': {
    slug: 'wells-score-dvt-pe',
    name: 'Wells Score (DVT/PE)',
    icon: '🫁',
    description: 'Estimate pre-test probability of deep vein thrombosis or pulmonary embolism.',
    formula: 'Wells Score = sum of clinical criteria points',
    reference: 'Wells et al. Lancet 1997 (DVT), Wells et al. Thromb Haemost 2000 (PE)',
    inputs: [
      {
        id: 'cancer',
        label: 'Active cancer',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
      {
        id: 'paralysis',
        label: 'Paralysis or recent immobilization of leg',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
      {
        id: 'bedridden',
        label: 'Bedridden >3 days OR major surgery <12 wks',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
      {
        id: 'tenderness',
        label: 'Localized tenderness along deep venous system',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
      {
        id: 'swelling',
        label: 'Entire leg swollen',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
      {
        id: 'calf',
        label: 'Calf swelling >3cm vs other leg',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
      {
        id: 'pitting',
        label: 'Pitting oedema (symptomatic leg only)',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
      {
        id: 'collateral',
        label: 'Collateral superficial veins',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '1', label: 'Yes — 1 pt' },
        ],
      },
      {
        id: 'alt_dx',
        label: 'Alternative diagnosis as likely or more likely',
        type: 'select',
        default: '0',
        options: [
          { value: '0', label: 'No — 0 pts' },
          { value: '-2', label: 'Yes — −2 pts' },
        ],
      },
    ],
    outputs: [
      { id: 'score', label: 'Wells Score', decimals: 0 },
      { id: 'probability', label: 'Pre-test Probability', decimals: 0 },
    ],
    calculate(v) {
      const score = Number(
        [
          v.cancer,
          v.paralysis,
          v.bedridden,
          v.tenderness,
          v.swelling,
          v.calf,
          v.pitting,
          v.collateral,
          v.alt_dx,
        ].reduce((s: number, x) => s + Number(x), 0)
      );
      const probability = score <= 0 ? 1 : score <= 2 ? 2 : 3;
      return { score, probability };
    },
  },

  // ── BMR / TDEE Calculator ─────────────────────────────────
  'bmr-tdee-calculator': {
    slug: 'bmr-tdee-calculator',
    name: 'BMR & TDEE Calculator',
    icon: '🔥',
    description: 'Calculate Basal Metabolic Rate and Total Daily Energy Expenditure.',
    formula: 'BMR (Mifflin-St Jeor) = 10×W + 6.25×H − 5×A ± 5 (sex)',
    reference: 'Mifflin et al. AJCN 1990',
    inputs: [
      { id: 'weight', label: 'Weight', unit: 'kg', default: 70, min: 20, step: 0.1 },
      { id: 'height', label: 'Height', unit: 'cm', default: 170, min: 100, step: 0.5 },
      { id: 'age', label: 'Age', unit: 'years', default: 30, min: 15, step: 1 },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        default: '1',
        options: [
          { value: '1', label: 'Male (+5)' },
          { value: '0', label: 'Female (−161)' },
        ],
      },
      {
        id: 'activity',
        label: 'Activity Level',
        type: 'select',
        default: '1.55',
        options: [
          { value: '1.2', label: 'Sedentary (×1.2)' },
          { value: '1.375', label: 'Light (×1.375)' },
          { value: '1.55', label: 'Moderate (×1.55)' },
          { value: '1.725', label: 'Active (×1.725)' },
          { value: '1.9', label: 'Very Active (×1.9)' },
        ],
      },
    ],
    outputs: [
      { id: 'bmr', label: 'BMR', unit: 'kcal/day', decimals: 0 },
      { id: 'tdee', label: 'TDEE', unit: 'kcal/day', decimals: 0 },
    ],
    calculate(v) {
      const male = String(v.sex) === '1';
      const bmr =
        10 * Number(v.weight) + 6.25 * Number(v.height) - 5 * Number(v.age) + (male ? 5 : -161);
      const tdee = bmr * Number(v.activity);
      return { bmr, tdee };
    },
  },

  // ── IV Drip Rate Calculator ───────────────────────────────
  'iv-drip-rate-mcg-kg-min': {
    slug: 'iv-drip-rate-mcg-kg-min',
    name: 'IV Drip Rate Calculator (mcg/kg/min)',
    icon: '💉',
    description: 'Calculate IV infusion rate in mL/hr from dose per kg per minute.',
    formula: 'Rate (mL/hr) = Dose × Weight × 60 / Concentration',
    reference: 'Clinical pharmacology standard',
    inputs: [
      { id: 'dose', label: 'Desired dose', unit: 'mcg/kg/min', default: 5, min: 0.01, step: 0.01 },
      { id: 'weight', label: 'Patient weight', unit: 'kg', default: 70, min: 1, step: 0.1 },
      {
        id: 'concentration',
        label: 'Bag concentration',
        unit: 'mcg/mL',
        default: 1600,
        min: 1,
        step: 1,
      },
    ],
    outputs: [{ id: 'rate', label: 'Infusion Rate', unit: 'mL/hr', decimals: 1 }],
    calculate(v) {
      const rate = (Number(v.dose) * Number(v.weight) * 60) / Number(v.concentration);
      return { rate };
    },
  },

  // ── Ideal Body Weight ─────────────────────────────────────
  'ideal-body-weight-calculator': {
    slug: 'ideal-body-weight-calculator',
    name: 'Ideal Body Weight (IBW) Calculator',
    icon: '⚖️',
    description: 'Calculate ideal body weight using Devine formula for drug dosing.',
    formula: 'IBW male = 50 + 2.3×(inches > 60) | female = 45.5 + 2.3×(inches > 60)',
    reference: 'Devine BJ 1974',
    inputs: [
      { id: 'height', label: 'Height', unit: 'cm', default: 170, min: 130, step: 0.5 },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        default: '1',
        options: [
          { value: '1', label: 'Male' },
          { value: '0', label: 'Female' },
        ],
      },
    ],
    outputs: [
      { id: 'ibw', label: 'Ideal Body Weight', unit: 'kg', decimals: 1 },
      { id: 'ibw_lbs', label: 'IBW', unit: 'lbs', decimals: 1 },
    ],
    calculate(v) {
      const heightCm = Number(v.height);
      const heightIn = heightCm / 2.54;
      const excessInches = Math.max(0, heightIn - 60);
      const male = String(v.sex) === '1';
      const ibw = (male ? 50 : 45.5) + 2.3 * excessInches;
      return { ibw, ibw_lbs: ibw * 2.2046 };
    },
  },

  // ── QTc Interval Calculator ───────────────────────────────
  'qtc-interval-calculator': {
    slug: 'qtc-interval-calculator',
    name: 'QTc Interval Calculator',
    icon: '🫀',
    description: 'Correct QT interval for heart rate using Bazett or Fridericia formula.',
    formula: 'Bazett: QTc = QT / √(RR) | Fridericia: QTc = QT / ∛(RR)',
    reference: 'Bazett 1920; Fridericia 1920',
    inputs: [
      { id: 'qt', label: 'QT Interval', unit: 'ms', default: 400, min: 200, step: 1 },
      { id: 'hr', label: 'Heart Rate', unit: 'bpm', default: 70, min: 30, step: 1 },
      {
        id: 'formula',
        label: 'Formula',
        type: 'select',
        default: '1',
        options: [
          { value: '1', label: 'Bazett' },
          { value: '2', label: 'Fridericia' },
        ],
      },
    ],
    outputs: [
      { id: 'qtc', label: 'QTc', unit: 'ms', decimals: 0 },
      { id: 'rr', label: 'RR Interval', unit: 'sec', decimals: 3 },
    ],
    calculate(v) {
      const rr = 60 / Number(v.hr);
      const qt_sec = Number(v.qt) / 1000;
      const qtc_sec = String(v.formula) === '1' ? qt_sec / Math.sqrt(rr) : qt_sec / Math.cbrt(rr);
      return { qtc: Math.round(qtc_sec * 1000), rr };
    },
  },

  // ── Chemotherapy Dose (BSA) ───────────────────────────────
  'chemotherapy-dose-bsa-calculator': {
    slug: 'chemotherapy-dose-bsa-calculator',
    name: 'Chemotherapy Dose (BSA) Calculator',
    icon: '💊',
    description: 'Calculate chemotherapy dose based on body surface area using Mosteller formula.',
    formula: 'BSA (m²) = √(Height(cm) × Weight(kg) / 3600) — Mosteller',
    reference: 'Mosteller RD. NEJM 1987',
    inputs: [
      { id: 'weight', label: 'Weight', unit: 'kg', default: 70, min: 10, step: 0.1 },
      { id: 'height', label: 'Height', unit: 'cm', default: 170, min: 100, step: 0.5 },
      { id: 'dose_per_m2', label: 'Drug Dose', unit: 'mg/m²', default: 85, min: 1, step: 0.1 },
    ],
    outputs: [
      { id: 'bsa', label: 'BSA', unit: 'm²', decimals: 2 },
      { id: 'total_dose', label: 'Total Dose', unit: 'mg', decimals: 1 },
    ],
    calculate(v) {
      const bsa = Math.sqrt((Number(v.height) * Number(v.weight)) / 3600);
      const total_dose = bsa * Number(v.dose_per_m2);
      return { bsa, total_dose };
    },
  },

  // ── Pediatric Fever Dose ──────────────────────────────────
  'fever-dose-calculator': {
    slug: 'fever-dose-calculator',
    name: 'Pediatric Fever Dose Calculator',
    icon: '🌡',
    description: 'Calculate pediatric doses of paracetamol/ibuprofen based on child weight.',
    formula: 'Paracetamol: 15 mg/kg | Ibuprofen: 10 mg/kg',
    reference: 'BNF for Children; AAP Guidelines',
    inputs: [
      { id: 'weight', label: 'Child Weight', unit: 'kg', default: 15, min: 1, step: 0.1 },
      {
        id: 'drug',
        label: 'Drug',
        type: 'select',
        default: '15',
        options: [
          { value: '15', label: 'Paracetamol (15 mg/kg)' },
          { value: '10', label: 'Ibuprofen (10 mg/kg)' },
        ],
      },
    ],
    outputs: [
      { id: 'dose_mg', label: 'Single Dose', unit: 'mg', decimals: 0 },
      { id: 'max_daily', label: 'Max Daily (4 doses)', unit: 'mg', decimals: 0 },
    ],
    calculate(v) {
      const dose_mg = Number(v.weight) * Number(v.drug);
      return { dose_mg, max_daily: dose_mg * 4 };
    },
  },

  // ── Opioid Equianalgesic Converter ────────────────────────
  'opioid-equianalgesic-converter': {
    slug: 'opioid-equianalgesic-converter',
    name: 'Opioid Equianalgesic Converter',
    icon: '💊',
    description: 'Convert between opioid doses to oral morphine equivalents (OME).',
    formula: 'OME = Dose (mg) × Potency factor relative to oral morphine',
    reference: 'DCMS Opioid Prescribing Guidelines 2016',
    inputs: [
      { id: 'dose', label: 'Current Dose', unit: 'mg', default: 10, min: 0.01, step: 0.01 },
      {
        id: 'drug',
        label: 'Current Opioid',
        type: 'select',
        default: '1',
        options: [
          { value: '1', label: 'Morphine — oral (reference)' },
          { value: '3', label: 'Morphine — IV/SC (3× potent)' },
          { value: '7.5', label: 'Hydromorphone — oral (7.5× potent)' },
          { value: '100', label: 'Fentanyl — patch mcg/hr (100× potent)' },
          { value: '0.15', label: 'Codeine — oral (0.15× potent)' },
          { value: '1.5', label: 'Oxycodone — oral (1.5× potent)' },
          { value: '0.1', label: 'Tramadol — oral (0.1× potent)' },
        ],
      },
    ],
    outputs: [{ id: 'ome', label: 'Oral Morphine Equivalent', unit: 'mg', decimals: 1 }],
    calculate(v) {
      const ome = Number(v.dose) * Number(v.drug);
      return { ome };
    },
  },

  // ── Burn Surface Area (Rule of 9s) ────────────────────────
  'burn-surface-area-rule-of-9s': {
    slug: 'burn-surface-area-rule-of-9s',
    name: 'Burn Surface Area (Rule of 9s)',
    icon: '🔥',
    description: 'Estimate total body surface area (TBSA) burned using the Rule of 9s.',
    formula: 'Head 9%, Each Arm 9%, Trunk 36%, Each Leg 18%, Perineum 1%',
    reference: 'Wallace AB 1951; ABA guidelines',
    inputs: [
      { id: 'head', label: 'Head & Neck', unit: '%', default: 0, min: 0, step: 1 },
      { id: 'arm_l', label: 'Left Arm', unit: '%', default: 0, min: 0, step: 1 },
      { id: 'arm_r', label: 'Right Arm', unit: '%', default: 0, min: 0, step: 1 },
      { id: 'trunk_ant', label: 'Trunk (Anterior)', unit: '%', default: 0, min: 0, step: 1 },
      { id: 'trunk_post', label: 'Trunk (Posterior)', unit: '%', default: 0, min: 0, step: 1 },
      { id: 'leg_l', label: 'Left Leg', unit: '%', default: 0, min: 0, step: 1 },
      { id: 'leg_r', label: 'Right Leg', unit: '%', default: 0, min: 0, step: 1 },
    ],
    outputs: [{ id: 'tbsa', label: 'TBSA Burned', unit: '%', decimals: 0 }],
    calculate(v) {
      const segments = [
        Math.min(9, Number(v.head)),
        Math.min(9, Number(v.arm_l)),
        Math.min(9, Number(v.arm_r)),
        Math.min(18, Number(v.trunk_ant)),
        Math.min(18, Number(v.trunk_post)),
        Math.min(18, Number(v.leg_l)),
        Math.min(18, Number(v.leg_r)),
      ];
      const tbsa = Math.min(
        100,
        segments.reduce((s: number, x) => s + x, 0)
      );
      return { tbsa };
    },
  },

  // ── Blood Pressure Classification ────────────────────────
  'blood-pressure-classification': {
    slug: 'blood-pressure-classification',
    name: 'Blood Pressure Classification',
    icon: '🩸',
    description: 'Classify blood pressure reading using ACC/AHA 2017 guidelines.',
    formula:
      'ACC/AHA 2017: Normal <120/<80, Elevated 120–129/<80, Stage 1: 130–139/80–89, Stage 2: ≥140/≥90',
    reference: 'Whelton et al. JACC 2018 (ACC/AHA Hypertension Guidelines)',
    inputs: [
      { id: 'sbp', label: 'Systolic BP', unit: 'mmHg', default: 125, min: 60, step: 1 },
      { id: 'dbp', label: 'Diastolic BP', unit: 'mmHg', default: 82, min: 30, step: 1 },
    ],
    outputs: [
      { id: 'map', label: 'MAP', unit: 'mmHg', decimals: 1 },
      { id: 'stage', label: 'BP Classification', decimals: 0 },
    ],
    calculate(v) {
      const sbp = Number(v.sbp);
      const dbp = Number(v.dbp);
      const map = dbp + (sbp - dbp) / 3;
      let stage = 1;
      if (sbp >= 180 || dbp >= 120) stage = 5;
      else if (sbp >= 140 || dbp >= 90) stage = 4;
      else if (sbp >= 130 || dbp >= 80) stage = 3;
      else if (sbp >= 120 && dbp < 80) stage = 2;
      return { map, stage };
    },
  },

  // ── Remedial Exercise Calorie Calculator ─────────────────────
  'remedial-exercise-calorie-calculator': {
    slug: 'remedial-exercise-calorie-calculator',
    name: 'Remedial Exercise Calorie Calculator',
    icon: '🏃',
    description:
      'Calculate calories burned during prescribed remedial exercises using MET values. Supports treadmill incline, push-ups, deadlifts, and abdominal crunches for clinical weight management.',
    formula: 'Calories = MET × Weight(kg) × Duration(hours)',
    reference: 'Ainsworth et al. Compendium of Physical Activities, Med Sci Sports Exerc 2011',
    inputs: [
      { id: 'weight', label: 'Body Weight', unit: 'kg', default: 90, min: 30, step: 0.5 },
      {
        id: 'exercise',
        label: 'Exercise Modality',
        type: 'select',
        default: 'treadmill-40',
        options: [
          { value: 'treadmill-0', label: 'Treadmill Walk — Flat (0% incline)' },
          { value: 'treadmill-10', label: 'Treadmill Walk — 10% incline' },
          { value: 'treadmill-20', label: 'Treadmill Walk — 20% incline' },
          { value: 'treadmill-30', label: 'Treadmill Walk — 30% incline' },
          { value: 'treadmill-40', label: 'Treadmill Walk — 40% incline' },
          { value: 'pushups', label: 'Push-ups' },
          { value: 'deadlifts', label: 'Deadlifts (weight training, vigorous)' },
          { value: 'crunches', label: 'Abdominal Crunches' },
        ],
      },
      { id: 'duration', label: 'Duration', unit: 'minutes', default: 30, min: 1, step: 1 },
    ],
    outputs: [
      { id: 'calories', label: 'Calories Burned', unit: 'kcal', decimals: 1 },
      { id: 'met', label: 'MET Value', unit: '', decimals: 1 },
      { id: 'cal_per_min', label: 'Rate', unit: 'kcal/min', decimals: 2 },
    ],
    calculate(v) {
      const MET_MAP: Record<string, number> = {
        'treadmill-0': 3.5,
        'treadmill-10': 5.5,
        'treadmill-20': 7.5,
        'treadmill-30': 9.5,
        'treadmill-40': 11.5,
        pushups: 3.8,
        deadlifts: 5.0,
        crunches: 2.8,
      };
      const met = MET_MAP[String(v.exercise)] ?? 3.5;
      const weight = Number(v.weight);
      const durationHours = Number(v.duration) / 60;
      const calories = met * weight * durationHours;
      const cal_per_min = (met * weight) / 60;
      return { calories, met, cal_per_min };
    },
  },
};

// ─── Fallback config for tools without explicit config ────────
export function getFallbackConfig(slug: string, name: string): MedicalCalcConfig {
  return {
    slug,
    name,
    icon: '🩺',
    description: `${name} — clinical calculator for professional reference.`,
    formula: 'See reference for formula details.',
    inputs: [
      { id: 'value1', label: 'Input Value 1', unit: '', default: 1, min: 0, step: 0.01 },
      { id: 'value2', label: 'Input Value 2', unit: '', default: 1, min: 0, step: 0.01 },
    ],
    outputs: [{ id: 'result', label: 'Result', unit: '', decimals: 2 }],
    calculate(v) {
      return { result: Number(v.value1) + Number(v.value2) };
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// EXTENDED MEDICAL CONFIGS — 113 tools across 12 specialties
// ═══════════════════════════════════════════════════════════════

export type MedInputField = {
  id: string;
  label: string;
  type: 'number' | 'select';
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string;
  options?: { label: string; value: string | number }[];
  placeholder?: string;
};

export type CalculationResult = {
  label: string;
  value: string | number;
  unit?: string;
  interpretation?: string;
  risk?: 'low' | 'moderate' | 'high' | 'critical';
  details?: string[];
  // Enhanced clinical output fields (master prompt compliance)
  recommendations?: string[];
  nextSteps?: string[];
  differentials?: string[];
  scoreBreakdown?: Array<{ component: string; score: number | string; max?: number }>;
  guidelineSource?: string;
  riskPercentage?: string;
  formulaWithValues?: string;
};

export type MedicalConfig = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  formula: string;
  reference: string;
  inputs: MedInputField[];
  calculate: (inputs: Record<string, number | string>) => CalculationResult;
};

export function printMedicalResult(
  result: CalculationResult,
  config: MedicalConfig,
  inputs: Record<string, number | string>
) {
  const w = window.open('', '_blank')!;
  w.document.write(`<!DOCTYPE html><html><head><title>${config.name}</title>
<style>body{font-family:Arial,sans-serif;padding:24px;max-width:600px;margin:auto}
h2{color:#1e3a5f}table{width:100%;border-collapse:collapse;margin:12px 0}
td,th{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f0f4f8}
.risk-low{color:#16a34a}.risk-moderate{color:#d97706}.risk-high{color:#dc2626}.risk-critical{color:#7c3aed}
</style></head><body>
<h2>${config.name}</h2><p>${config.description}</p>
<h3>Result: <span class="risk-${result.risk || 'low'}">${result.value}${result.unit ? ' ' + result.unit : ''}</span></h3>
${result.interpretation ? `<p>${result.interpretation}</p>` : ''}
${result.details ? `<ul>${result.details.map((d) => `<li>${d}</li>`).join('')}</ul>` : ''}
<h3>Inputs</h3><table><tr><th>Parameter</th><th>Value</th></tr>
${config.inputs.map((f) => `<tr><td>${f.label}${f.unit ? ' (' + f.unit + ')' : ''}</td><td>${inputs[f.id] ?? ''}</td></tr>`).join('')}
</table><p style="font-size:11px;color:#666">Formula: ${config.formula}<br>Ref: ${config.reference}</p>
</body></html>`);
  w.document.close();
  w.print();
}

// ─── CARDIOLOGY (12) ─────────────────────────────────────────
export const cardiologyConfigs: MedicalConfig[] = [
  // 1. CHA₂DS₂-VASc Score
  {
    id: 'cha2ds2-vasc-score',
    name: 'CHA₂DS₂-VASc Score',
    category: 'Cardiology',
    icon: '❤️',
    description:
      'Stroke risk in non-valvular atrial fibrillation — guides anticoagulation decisions',
    formula: 'CHF(1)+HTN(1)+Age≥75(2)+DM(1)+Stroke/TIA(2)+Vascular(1)+Age65–74(1)+Female(1)',
    reference: 'Lip GY et al. Chest 2010 / ESC 2023 AF Guidelines',
    inputs: [
      {
        id: 'chf',
        label: 'Congestive Heart Failure / LV Dysfunction',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'htn',
        label: 'Hypertension',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'age75',
        label: 'Age ≥ 75 years',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 2 pts', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'dm',
        label: 'Diabetes Mellitus',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'stroke',
        label: 'Stroke / TIA / Thromboembolism History',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 2 pts', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'vasc',
        label: 'Vascular Disease (prior MI, PAD, aortic plaque)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'age65',
        label: 'Age 65–74 years',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'female',
        label: 'Female Sex',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const chf = Number(v.chf),
        htn = Number(v.htn),
        age75 = Number(v.age75),
        dm = Number(v.dm);
      const stroke = Number(v.stroke),
        vasc = Number(v.vasc),
        age65 = Number(v.age65),
        female = Number(v.female);
      const score = chf + htn + age75 + dm + stroke + vasc + age65 + female;
      const ANNUAL: Record<number, string> = {
        0: '~0%',
        1: '~1.3%',
        2: '~2.2%',
        3: '~3.2%',
        4: '~4.0%',
        5: '~6.7%',
        6: '~9.8%',
        7: '~9.6%',
        8: '~12.5%',
        9: '~15.2%',
      };
      const annual = ANNUAL[Math.min(score, 9)] ?? '~15.2%';
      const risk: CalculationResult['risk'] =
        score === 0 ? 'low' : score === 1 ? 'moderate' : 'high';
      const anticoag =
        score >= 2
          ? 'Oral anticoagulation recommended (Class I, Level A)'
          : score === 1 && !female
            ? 'Consider OAC — individualize per HAS-BLED'
            : 'OAC not routinely indicated';
      return {
        label: 'CHA₂DS₂-VASc Score',
        value: score,
        unit: '/9',
        interpretation: `Annual stroke risk: ${annual}. ${anticoag}.`,
        risk,
        riskPercentage: `Annual stroke risk: ${annual}`,
        guidelineSource: 'ESC 2023 AF Guidelines / AHA/ACC 2023',
        scoreBreakdown: [
          { component: 'CHF / LV Dysfunction', score: chf, max: 1 },
          { component: 'Hypertension', score: htn, max: 1 },
          { component: 'Age ≥ 75', score: age75, max: 2 },
          { component: 'Diabetes Mellitus', score: dm, max: 1 },
          { component: 'Stroke / TIA History', score: stroke, max: 2 },
          { component: 'Vascular Disease', score: vasc, max: 1 },
          { component: 'Age 65–74', score: age65, max: 1 },
          { component: 'Female Sex', score: female, max: 1 },
          { component: 'TOTAL', score, max: 9 },
        ],
        details: [
          `Score: ${score}/9 — Annual stroke risk: ${annual}`,
          score >= 2
            ? '→ Preferred NOACs: apixaban, rivaroxaban, dabigatran, edoxaban'
            : '→ Score 0 in males: anticoagulation not recommended',
          '→ Always co-calculate HAS-BLED to assess bleeding risk',
          '⚠️ Valvular AF (mechanical valve, rheumatic mitral stenosis): warfarin — not NOAC',
        ],
      };
    },
  },
  // 2. HEART Score
  {
    id: 'heart-score-calculator',
    name: 'HEART Score',
    category: 'Cardiology',
    icon: '💔',
    description: 'Risk stratification for chest pain in the Emergency Department',
    formula: 'History(0–2)+ECG(0–2)+Age(0–2)+Risk Factors(0–2)+Troponin(0–2) = 0–10',
    reference: 'Six AJ et al. Neth Heart J 2008 / ACC/AHA Chest Pain Guidelines 2021',
    inputs: [
      {
        id: 'history',
        label: 'History (suspicion for ACS)',
        type: 'select',
        options: [
          { label: 'Slightly suspicious — 0 pts', value: 0 },
          { label: 'Moderately suspicious — 1 pt', value: 1 },
          { label: 'Highly suspicious — 2 pts', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'ecg',
        label: 'ECG',
        type: 'select',
        options: [
          { label: 'Normal — 0 pts', value: 0 },
          { label: 'Non-specific repolarization — 1 pt', value: 1 },
          { label: 'Significant ST deviation — 2 pts', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'select',
        options: [
          { label: '< 45 years — 0 pts', value: 0 },
          { label: '45–65 years — 1 pt', value: 1 },
          { label: '> 65 years — 2 pts', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'rf',
        label: 'Risk Factors',
        type: 'select',
        options: [
          { label: 'No known risk factors — 0 pts', value: 0 },
          { label: '1–2 risk factors — 1 pt', value: 1 },
          { label: '≥3 risk factors / DM / HTN / known CAD — 2 pts', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'troponin',
        label: 'Initial Troponin',
        type: 'select',
        options: [
          { label: '≤ Normal limit — 0 pts', value: 0 },
          { label: '1–3× normal — 1 pt', value: 1 },
          { label: '> 3× normal — 2 pts', value: 2 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const hist = Number(v.history),
        ecg = Number(v.ecg),
        age = Number(v.age),
        rf = Number(v.rf),
        trop = Number(v.troponin);
      const score = hist + ecg + age + rf + trop;
      const risk: CalculationResult['risk'] = score <= 3 ? 'low' : score <= 6 ? 'moderate' : 'high';
      const MACE = score <= 3 ? '1.7%' : score <= 6 ? '12%' : '65%';
      const action =
        score <= 3
          ? 'Low risk — consider early discharge with outpatient follow-up'
          : score <= 6
            ? 'Moderate risk — serial troponins, observation, stress test or CCTA'
            : 'High risk — early invasive strategy; cardiology consult within 2h';
      return {
        label: 'HEART Score',
        value: score,
        unit: '/10',
        interpretation: `${action}. 30-day MACE rate: ${MACE}.`,
        risk,
        riskPercentage: `30-day MACE: ${MACE}`,
        guidelineSource: 'ACC/AHA Chest Pain Guidelines 2021',
        scoreBreakdown: [
          { component: 'History', score: hist, max: 2 },
          { component: 'ECG', score: ecg, max: 2 },
          { component: 'Age', score: age, max: 2 },
          { component: 'Risk Factors', score: rf, max: 2 },
          { component: 'Troponin', score: trop, max: 2 },
          { component: 'TOTAL', score, max: 10 },
        ],
        details: [
          `HEART Score: ${score}/10 — 30-day MACE: ${MACE}`,
          score <= 3
            ? '→ Serial high-sensitivity troponin at 0h and 1–3h. Discharge if negative.'
            : '',
          score >= 7 ? '→ Cardiology consult within 2h — consider urgent catheterization' : '',
          '→ Score ≥4 + elevated troponin: treat as NSTEMI per ACS pathway',
        ].filter(Boolean),
      };
    },
  },
  // 3. LDL Cholesterol (Friedewald)
  {
    id: 'ldl-cholesterol-calculator',
    name: 'LDL Cholesterol (Friedewald)',
    category: 'Cardiology',
    icon: '🧪',
    description: 'Estimate LDL-C from total cholesterol, HDL-C, and triglycerides',
    formula: 'LDL = Total Cholesterol − HDL − (Triglycerides ÷ 5)  [mg/dL]',
    reference: 'Friedewald WT et al. Clin Chem 1972 / ACC/AHA 2019 Cholesterol Guidelines',
    inputs: [
      {
        id: 'tc',
        label: 'Total Cholesterol',
        type: 'number',
        unit: 'mg/dL',
        min: 100,
        max: 500,
        defaultValue: 200,
      },
      {
        id: 'hdl',
        label: 'HDL Cholesterol',
        type: 'number',
        unit: 'mg/dL',
        min: 20,
        max: 120,
        defaultValue: 50,
      },
      {
        id: 'tg',
        label: 'Triglycerides',
        type: 'number',
        unit: 'mg/dL',
        min: 50,
        max: 1000,
        defaultValue: 150,
      },
    ],
    calculate(v) {
      const tc = Number(v.tc),
        hdl = Number(v.hdl),
        tg = Number(v.tg);
      const ldl = tc - hdl - tg / 5,
        nonHDL = tc - hdl;
      const risk: CalculationResult['risk'] =
        ldl < 100 ? 'low' : ldl < 130 ? 'moderate' : ldl < 160 ? 'high' : 'critical';
      const category =
        ldl < 100
          ? 'Optimal (<100)'
          : ldl < 130
            ? 'Near Optimal (100–129)'
            : ldl < 160
              ? 'Borderline High (130–159)'
              : ldl < 190
                ? 'High (160–189)'
                : 'Very High (≥190)';
      const tgWarn =
        tg > 400 ? '⚠️ TG >400 — Friedewald unreliable. Use direct LDL-C measurement.' : '';
      return {
        label: 'LDL Cholesterol',
        value: ldl.toFixed(1),
        unit: 'mg/dL',
        interpretation: `${category}. ${tgWarn} Non-HDL-C: ${nonHDL.toFixed(0)} mg/dL.`,
        risk,
        guidelineSource: 'ACC/AHA 2019 Cholesterol Guidelines',
        details: [
          `LDL-C: ${ldl.toFixed(1)} mg/dL — ${category}`,
          `Non-HDL-C: ${nonHDL.toFixed(0)} mg/dL (target <130 for most patients)`,
          `TC/HDL ratio: ${(tc / hdl).toFixed(2)}`,
          tg > 400
            ? '⚠️ Friedewald invalid at TG >400 — order direct LDL-C'
            : '✓ Friedewald valid (TG ≤400 mg/dL)',
          ldl >= 190
            ? '→ Familial hypercholesterolemia — high-intensity statin + ezetimibe ± PCSK9i'
            : '',
        ].filter(Boolean),
      };
    },
  },
  // 4. TIMI Risk Score
  {
    id: 'timi-risk-score',
    name: 'TIMI Risk Score (UA/NSTEMI)',
    category: 'Cardiology',
    icon: '📊',
    description: '14-day risk of death, MI, or urgent revascularization in UA/NSTEMI',
    formula: 'Sum of 7 binary criteria (0–7)',
    reference: 'Antman EM et al. JAMA 2000 / ACC/AHA ACS Guidelines 2023',
    inputs: [
      {
        id: 'age65',
        label: 'Age ≥ 65 years',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'cad_rf',
        label: '≥3 CAD Risk Factors (HTN, DM, dyslipidemia, smoking, family hx)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'known_cad',
        label: 'Known CAD (coronary stenosis ≥50%)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'st_dev',
        label: 'ST Deviation ≥0.5mm on presenting ECG',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'angina',
        label: '≥2 Anginal Events in Prior 24 Hours',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'aspirin',
        label: 'Aspirin Use in Past 7 Days',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'troponin',
        label: 'Elevated Serum Cardiac Markers',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const a = Number(v.age65),
        b = Number(v.cad_rf),
        c = Number(v.known_cad),
        d = Number(v.st_dev);
      const e = Number(v.angina),
        f = Number(v.aspirin),
        g = Number(v.troponin);
      const score = a + b + c + d + e + f + g;
      const risk: CalculationResult['risk'] = score <= 2 ? 'low' : score <= 4 ? 'moderate' : 'high';
      const EVENTS: Record<number, string> = {
        0: '4.7%',
        1: '4.7%',
        2: '8.3%',
        3: '13.2%',
        4: '19.9%',
        5: '26.2%',
        6: '40.9%',
        7: '40.9%',
      };
      const eventRate = EVENTS[score] ?? '40.9%';
      const strategy =
        score <= 2
          ? 'Conservative — serial troponins, early stress testing'
          : score <= 4
            ? 'Early invasive within 24–72 hours'
            : 'Urgent invasive within 2–24 hours';
      return {
        label: 'TIMI Score (UA/NSTEMI)',
        value: score,
        unit: '/7',
        interpretation: `14-day ischemic event rate: ${eventRate}. Strategy: ${strategy}.`,
        risk,
        riskPercentage: `14-day event rate: ${eventRate}`,
        guidelineSource: 'ACC/AHA ACS Guidelines 2023',
        scoreBreakdown: [
          { component: 'Age ≥65', score: a, max: 1 },
          { component: '≥3 CAD Risk Factors', score: b, max: 1 },
          { component: 'Known CAD (≥50% stenosis)', score: c, max: 1 },
          { component: 'ST Deviation on ECG', score: d, max: 1 },
          { component: '≥2 Anginal Events/24h', score: e, max: 1 },
          { component: 'Prior Aspirin Use', score: f, max: 1 },
          { component: 'Elevated Cardiac Markers', score: g, max: 1 },
          { component: 'TOTAL', score, max: 7 },
        ],
        details: [
          `TIMI: ${score}/7 — 14-day event rate: ${eventRate}`,
          `Strategy: ${strategy}`,
          '→ All ACS: aspirin + P2Y12 inhibitor + anticoagulation',
          score >= 5 ? '→ Consider GP IIb/IIIa inhibitor for high-risk patients' : '',
        ].filter(Boolean),
      };
    },
  },
  // 5. HAS-BLED Score
  {
    id: 'has-bled-bleeding-score',
    name: 'HAS-BLED Bleeding Risk Score',
    category: 'Cardiology',
    icon: '🩸',
    description: 'Major bleeding risk in AF patients on anticoagulation',
    formula: 'H+A+S+B+L+E+D (each criterion = 1 point, max 9)',
    reference: 'Pisters R et al. Chest 2010 / ESC 2023 AF Guidelines',
    inputs: [
      {
        id: 'htn',
        label: 'H — Uncontrolled Hypertension (SBP >160 mmHg)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'renal',
        label: 'A — Renal Disease (dialysis, transplant, Cr >2.3)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'liver',
        label: 'A — Liver Disease (cirrhosis or bilirubin >2×, AST/ALT >3×)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'stroke',
        label: 'S — Stroke History',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'bleeding',
        label: 'B — Prior Bleeding / Bleeding Predisposition',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'labile_inr',
        label: 'L — Labile INR (TTR <60%) — warfarin patients',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'elderly',
        label: 'E — Elderly (age >65)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'drugs',
        label: 'D — Antiplatelet Drugs or NSAIDs',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'alcohol',
        label: 'D — Alcohol Use (≥8 drinks/week)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const h = Number(v.htn),
        a1 = Number(v.renal),
        a2 = Number(v.liver),
        s = Number(v.stroke);
      const b = Number(v.bleeding),
        l = Number(v.labile_inr),
        e = Number(v.elderly),
        d1 = Number(v.drugs),
        d2 = Number(v.alcohol);
      const score = h + a1 + a2 + s + b + l + e + d1 + d2;
      const risk: CalculationResult['risk'] = score <= 1 ? 'low' : score <= 2 ? 'moderate' : 'high';
      const BLEED: Record<number, string> = {
        0: '1.9%',
        1: '2.5%',
        2: '5.3%',
        3: '8.4%',
        4: '10.4%',
        5: '12.3%',
      };
      const bleedRate = BLEED[Math.min(score, 5)] ?? '>12%';
      const interp =
        score <= 1
          ? 'Low bleeding risk — anticoagulation favoured'
          : score <= 2
            ? 'Moderate risk — address modifiable factors, anticoagulate with caution'
            : 'High risk — address ALL modifiable factors. High HAS-BLED does NOT mean withhold OAC if CHA₂DS₂-VASc ≥2.';
      return {
        label: 'HAS-BLED Score',
        value: score,
        unit: '/9',
        interpretation: `${interp} Annual major bleeding: ~${bleedRate}.`,
        risk,
        riskPercentage: `Annual major bleeding: ~${bleedRate}`,
        guidelineSource: 'ESC 2023 AF Guidelines',
        scoreBreakdown: [
          { component: 'H — Uncontrolled HTN', score: h, max: 1 },
          { component: 'A — Renal disease', score: a1, max: 1 },
          { component: 'A — Liver disease', score: a2, max: 1 },
          { component: 'S — Stroke history', score: s, max: 1 },
          { component: 'B — Prior bleeding', score: b, max: 1 },
          { component: 'L — Labile INR', score: l, max: 1 },
          { component: 'E — Elderly >65', score: e, max: 1 },
          { component: 'D — Antiplatelet/NSAIDs', score: d1, max: 1 },
          { component: 'D — Alcohol use', score: d2, max: 1 },
          { component: 'TOTAL', score, max: 9 },
        ],
        details: [
          `HAS-BLED: ${score}/9 — Annual major bleeding: ~${bleedRate}`,
          '→ Modifiable factors to address: uncontrolled BP, labile INR, NSAIDs, alcohol',
          '→ Score ≥3: address modifiable factors — do NOT withhold OAC if CHA₂DS₂-VASc ≥2',
          '→ Co-prescribe PPI to reduce GI bleeding risk in anticoagulated patients',
        ],
      };
    },
  },
  // 6. GRACE ACS Score
  {
    id: 'grace-acs-score',
    name: 'GRACE ACS Risk Score',
    category: 'Cardiology',
    icon: '🏥',
    description: 'In-hospital and 6-month mortality risk in ACS',
    formula:
      'Multivariate: Age+HR+SBP+Creatinine+Killip+Cardiac arrest+ST deviation+Elevated enzymes',
    reference: 'Eagle KA et al. JAMA 2004 / ACC/AHA ACS Guidelines 2023',
    inputs: [
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 120,
        defaultValue: 65,
      },
      {
        id: 'hr',
        label: 'Heart Rate',
        type: 'number',
        unit: 'bpm',
        min: 20,
        max: 300,
        defaultValue: 80,
      },
      {
        id: 'sbp',
        label: 'Systolic BP',
        type: 'number',
        unit: 'mmHg',
        min: 50,
        max: 300,
        defaultValue: 130,
      },
      {
        id: 'creatinine',
        label: 'Serum Creatinine',
        type: 'number',
        unit: 'mg/dL',
        min: 0.4,
        max: 15,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: 'killip',
        label: 'Killip Class',
        type: 'select',
        options: [
          { label: 'I — No CHF (0 pts)', value: 0 },
          { label: 'II — Rales/JVD (20 pts)', value: 20 },
          { label: 'III — Pulm edema (39 pts)', value: 39 },
          { label: 'IV — Cardiogenic shock (59 pts)', value: 59 },
        ],
        defaultValue: 0,
      },
      {
        id: 'cardiac_arrest',
        label: 'Cardiac Arrest at Admission',
        type: 'select',
        options: [
          { label: 'No (0 pts)', value: 0 },
          { label: 'Yes (43 pts)', value: 43 },
        ],
        defaultValue: 0,
      },
      {
        id: 'st_dev',
        label: 'ST-segment Deviation on ECG',
        type: 'select',
        options: [
          { label: 'No (0 pts)', value: 0 },
          { label: 'Yes (30 pts)', value: 30 },
        ],
        defaultValue: 0,
      },
      {
        id: 'enzymes',
        label: 'Elevated Cardiac Enzymes / Biomarkers',
        type: 'select',
        options: [
          { label: 'No (0 pts)', value: 0 },
          { label: 'Yes (15 pts)', value: 15 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const age = Number(v.age),
        hr = Number(v.hr),
        sbp = Number(v.sbp),
        cr = Number(v.creatinine);
      const ageScore =
        age < 30
          ? 0
          : age < 40
            ? 8
            : age < 50
              ? 25
              : age < 60
                ? 41
                : age < 70
                  ? 58
                  : age < 80
                    ? 75
                    : age < 90
                      ? 91
                      : 100;
      const hrScore =
        hr < 50
          ? 0
          : hr < 70
            ? 3
            : hr < 90
              ? 9
              : hr < 110
                ? 15
                : hr < 150
                  ? 24
                  : hr < 200
                    ? 38
                    : 46;
      const sbpScore =
        sbp < 80
          ? 63
          : sbp < 100
            ? 58
            : sbp < 120
              ? 47
              : sbp < 140
                ? 37
                : sbp < 160
                  ? 26
                  : sbp < 200
                    ? 11
                    : 0;
      const crScore =
        cr < 0.4
          ? 1
          : cr < 0.8
            ? 4
            : cr < 1.2
              ? 7
              : cr < 1.6
                ? 10
                : cr < 2.0
                  ? 13
                  : cr < 4.0
                    ? 21
                    : 28;
      const killip = Number(v.killip),
        arrest = Number(v.cardiac_arrest),
        st = Number(v.st_dev),
        enz = Number(v.enzymes);
      const total = ageScore + hrScore + sbpScore + crScore + killip + arrest + st + enz;
      const risk: CalculationResult['risk'] =
        total < 109 ? 'low' : total < 140 ? 'moderate' : 'high';
      const inHospMort = total < 109 ? '<1%' : total < 140 ? '1–3%' : total < 180 ? '>3%' : '>8%';
      const strategy =
        total < 109
          ? 'Conservative management acceptable'
          : total < 140
            ? 'Early invasive strategy within 24 hours'
            : 'Urgent invasive strategy within 2–24 hours';
      return {
        label: 'GRACE Score',
        value: total,
        interpretation: `In-hospital mortality: ${inHospMort}. ${strategy}.`,
        risk,
        riskPercentage: `In-hospital mortality: ${inHospMort}`,
        guidelineSource: 'ACC/AHA ACS Guidelines 2023',
        scoreBreakdown: [
          { component: 'Age', score: ageScore },
          { component: 'Heart Rate', score: hrScore },
          { component: 'Systolic BP', score: sbpScore },
          { component: 'Creatinine', score: crScore },
          { component: 'Killip Class', score: killip },
          { component: 'Cardiac Arrest', score: arrest },
          { component: 'ST Deviation', score: st },
          { component: 'Elevated Enzymes', score: enz },
          { component: 'TOTAL', score: total },
        ],
        details: [
          `GRACE Score: ${total} — In-hospital mortality: ${inHospMort}`,
          `Strategy: ${strategy}`,
          '→ All ACS: aspirin + P2Y12 (ticagrelor or prasugrel preferred) + anticoagulation',
          total >= 140
            ? '→ Dual antiplatelet: ticagrelor preferred over clopidogrel for NSTEMI/UA'
            : '',
        ].filter(Boolean),
      };
    },
  },
  // 7. Cardiac Output (Fick)
  {
    id: 'cardiac-output-fick-calculator',
    name: 'Cardiac Output (Fick Principle)',
    category: 'Cardiology',
    icon: '🫀',
    description: 'Calculate cardiac output and cardiac index using the Fick principle',
    formula: 'CO (L/min) = VO₂ consumption ÷ [(SaO₂ − SvO₂) × Hgb × 13.4]',
    reference: 'Fick A. Sitz ber Phys Med Ges 1870 / ACC/AHA Heart Failure Guidelines 2022',
    inputs: [
      {
        id: 'weight',
        label: 'Patient Weight',
        type: 'number',
        unit: 'kg',
        min: 20,
        max: 300,
        defaultValue: 70,
      },
      {
        id: 'height',
        label: 'Patient Height',
        type: 'number',
        unit: 'cm',
        min: 100,
        max: 230,
        defaultValue: 170,
      },
      {
        id: 'sao2',
        label: 'Arterial O₂ Saturation (SaO₂)',
        type: 'number',
        unit: '%',
        min: 70,
        max: 100,
        defaultValue: 98,
      },
      {
        id: 'svo2',
        label: 'Mixed Venous O₂ Saturation (SvO₂)',
        type: 'number',
        unit: '%',
        min: 20,
        max: 90,
        defaultValue: 65,
      },
      {
        id: 'hgb',
        label: 'Hemoglobin',
        type: 'number',
        unit: 'g/dL',
        min: 4,
        max: 22,
        step: 0.1,
        defaultValue: 14,
      },
    ],
    calculate(v) {
      const wt = Number(v.weight),
        ht = Number(v.height),
        sao2 = Number(v.sao2),
        svo2 = Number(v.svo2),
        hgb = Number(v.hgb);
      const vo2 = wt * 3;
      const avdo2 = ((sao2 - svo2) / 100) * hgb * 13.4;
      const co = avdo2 > 0 ? vo2 / avdo2 : 0;
      const bsa = Math.sqrt((ht * wt) / 3600);
      const ci = bsa > 0 ? co / bsa : 0;
      const risk: CalculationResult['risk'] = co >= 4 ? 'low' : co >= 2.5 ? 'moderate' : 'high';
      const coInterp =
        co < 2.5
          ? 'Low cardiac output — cardiogenic shock risk'
          : co > 8
            ? 'Elevated CO — high-output state (sepsis, AV fistula, anemia, thyrotoxicosis)'
            : 'Normal range (4–8 L/min)';
      return {
        label: 'Cardiac Output',
        value: co.toFixed(2),
        unit: 'L/min',
        interpretation: `${coInterp}. CI: ${ci.toFixed(2)} L/min/m² (normal 2.5–4.0). BSA: ${bsa.toFixed(2)} m².`,
        risk,
        riskPercentage: co < 2.5 ? 'CI < 2.2 L/min/m² — shock threshold' : undefined,
        guidelineSource: 'ACC/AHA Heart Failure Guidelines 2022',
        details: [
          `CO: ${co.toFixed(2)} L/min | CI: ${ci.toFixed(2)} L/min/m²`,
          `Estimated VO₂: ${vo2} mL/min | A-VO₂ difference: ${avdo2.toFixed(2)} mL/100mL`,
          `BSA (Mosteller): ${bsa.toFixed(2)} m²`,
          co < 2.5 ? '🚨 CO <2.5 L/min — urgent hemodynamic support (inotropes or MCS)' : '',
          '→ Right heart catheterization for definitive hemodynamic assessment',
        ].filter(Boolean),
      };
    },
  },
  // 8. Warfarin Dose Estimator
  {
    id: 'warfarin-dose-estimator',
    name: 'Warfarin Dose Estimator',
    category: 'Cardiology',
    icon: '💊',
    description: 'Estimate weekly warfarin starting dose from clinical factors',
    formula:
      'Gage pharmacogenomic clinical model: dose = f(age, height, weight, amiodarone, smoker, race)',
    reference: 'Gage BF et al. Clin Pharmacol Ther 2008 / CHEST Antithrombotic Guidelines 2021',
    inputs: [
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 100,
        defaultValue: 60,
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        unit: 'cm',
        min: 130,
        max: 220,
        defaultValue: 170,
      },
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        unit: 'kg',
        min: 30,
        max: 200,
        defaultValue: 70,
      },
      {
        id: 'amiodarone',
        label: 'Amiodarone Use (strong CYP2C9 inhibitor)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes — reduces dose ~30–50%', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'smoker',
        label: 'Current Smoker (CYP1A2 inducer)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes — slightly increases requirement', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'race',
        label: 'Race',
        type: 'select',
        options: [
          { label: 'Non-African American', value: 0 },
          { label: 'African American', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      let dose =
        5.6044 - 0.2614 * Number(v.age) + 0.0087 * Number(v.height) + 0.0128 * Number(v.weight);
      if (Number(v.amiodarone)) dose -= 0.5503;
      if (Number(v.smoker)) dose += 0.2027;
      if (Number(v.race)) dose += 0.4045;
      const weekly = Math.max(7, Math.min(70, Math.round(dose * 7 * 2) / 2));
      const daily = (weekly / 7).toFixed(1);
      return {
        label: 'Estimated Weekly Warfarin Dose',
        value: weekly,
        unit: 'mg/week',
        interpretation: `Starting estimate: ~${daily} mg/day. Initial dose only — titrate to INR target. Recheck INR at day 3–5.`,
        risk: 'moderate',
        guidelineSource: 'CHEST Antithrombotic Guidelines 2021',
        details: [
          `Weekly estimate: ${weekly} mg (~${daily} mg/day)`,
          '→ INR target 2.0–3.0 (AF, DVT/PE) or 2.5–3.5 (mechanical mitral valve)',
          '→ Check INR at day 3–5, then weekly until stable (≥3 consecutive readings in range)',
          '⚠️ Amiodarone: reduce warfarin 30–50% when co-prescribing',
          '→ Pharmacogenomic testing (VKORC1, CYP2C9) for hard-to-control patients',
        ],
      };
    },
  },
  // 9. Mean Arterial Pressure
  {
    id: 'mean-arterial-pressure-med',
    name: 'Mean Arterial Pressure (MAP)',
    category: 'Cardiology',
    icon: '🩺',
    description: 'Calculate MAP from systolic and diastolic blood pressure',
    formula: 'MAP = DBP + ⅓ × (SBP − DBP)   [equivalent: (SBP + 2×DBP) ÷ 3]',
    reference: "O'Brien E et al. J Hypertens 2003 / Surviving Sepsis Campaign 2021",
    inputs: [
      {
        id: 'sbp',
        label: 'Systolic Blood Pressure',
        type: 'number',
        unit: 'mmHg',
        min: 50,
        max: 300,
        defaultValue: 120,
      },
      {
        id: 'dbp',
        label: 'Diastolic Blood Pressure',
        type: 'number',
        unit: 'mmHg',
        min: 20,
        max: 200,
        defaultValue: 80,
      },
    ],
    calculate(v) {
      const sbp = Number(v.sbp),
        dbp = Number(v.dbp);
      const map = dbp + (sbp - dbp) / 3,
        pp = sbp - dbp;
      const risk: CalculationResult['risk'] =
        map < 60 ? 'critical' : map < 70 ? 'high' : map <= 100 ? 'low' : 'moderate';
      const interp =
        map < 60
          ? 'Critically low MAP — organ perfusion severely compromised. Vasopressors required if fluid-unresponsive.'
          : map < 70
            ? 'Low MAP — below sepsis resuscitation target of ≥65 mmHg.'
            : map <= 100
              ? 'Normal MAP (70–100 mmHg) — adequate organ perfusion.'
              : 'Elevated MAP — assess for hypertension or end-organ damage.';
      return {
        label: 'MAP',
        value: map.toFixed(1),
        unit: 'mmHg',
        interpretation: interp,
        risk,
        riskPercentage: map < 65 ? 'Below sepsis target (≥65 mmHg)' : undefined,
        guidelineSource: 'Surviving Sepsis Campaign 2021',
        details: [
          `MAP: ${map.toFixed(1)} mmHg | SBP: ${sbp} | DBP: ${dbp} | Pulse Pressure: ${pp} mmHg`,
          map < 65 ? '⚠️ Below Surviving Sepsis Campaign target of MAP ≥65 mmHg' : '',
          map < 65 ? '→ 30 mL/kg crystalloid bolus; norepinephrine if fluid-unresponsive' : '',
          pp > 60
            ? '⚠️ Wide pulse pressure (>60) — suspect aortic regurgitation or high-output state'
            : '',
        ].filter(Boolean),
      };
    },
  },
  // 10. QTc Interval
  {
    id: 'qtc-interval-med',
    name: 'QTc Interval Calculator (Bazett)',
    category: 'Cardiology',
    icon: '📈',
    description: 'Correct QT interval for heart rate to assess Torsades de Pointes risk',
    formula: 'Bazett: QTc = QT(ms) ÷ √(RR interval in seconds)',
    reference: 'Bazett HC. Heart 1920 / Fridericia LS. Acta Med Scand 1920',
    inputs: [
      {
        id: 'qt',
        label: 'Measured QT Interval',
        type: 'number',
        unit: 'ms',
        min: 150,
        max: 800,
        defaultValue: 400,
        placeholder: 'e.g. 400',
      },
      {
        id: 'hr',
        label: 'Heart Rate',
        type: 'number',
        unit: 'bpm',
        min: 20,
        max: 300,
        defaultValue: 70,
        placeholder: 'e.g. 70',
      },
    ],
    calculate(v) {
      const qt = Number(v.qt),
        hr = Number(v.hr);
      const rr = 60 / hr;
      const qtcB = qt / Math.sqrt(rr),
        qtcF = qt / Math.cbrt(rr);
      const risk: CalculationResult['risk'] =
        qtcB < 440 ? 'low' : qtcB < 460 ? 'moderate' : qtcB < 500 ? 'high' : 'critical';
      const category =
        qtcB < 440
          ? 'Normal QTc'
          : qtcB < 460
            ? 'Borderline prolonged'
            : qtcB < 500
              ? 'Prolonged — review QT-prolonging drugs'
              : 'Critically prolonged — Torsades de Pointes risk';
      const tdpRisk =
        qtcB >= 500
          ? 'HIGH TdP risk — discontinue offending drug(s) immediately'
          : qtcB >= 460
            ? 'Elevated TdP risk — review medication list'
            : 'Low TdP risk';
      return {
        label: 'QTc (Bazett)',
        value: qtcB.toFixed(0),
        unit: 'ms',
        interpretation: `${category}. ${tdpRisk}. RR: ${rr.toFixed(3)}s. Fridericia QTc: ${qtcF.toFixed(0)} ms (preferred at HR >100).`,
        risk,
        riskPercentage:
          qtcB >= 500 ? 'TdP risk CRITICAL' : qtcB >= 460 ? 'TdP risk elevated' : undefined,
        guidelineSource: 'AHA/ACC QTc Consensus 2021 — crediblemeds.org',
        details: [
          `QTc (Bazett): ${qtcB.toFixed(0)} ms | QTc (Fridericia): ${qtcF.toFixed(0)} ms`,
          `RR Interval: ${rr.toFixed(3)} sec | HR: ${hr} bpm`,
          'Normal: <440ms (men), <460ms (women) | Danger threshold: ≥500ms',
          qtcB >= 500
            ? '🚨 QTc ≥500ms — STOP QT-prolonging drugs. Check K⁺, Mg²⁺, Ca²⁺. Cardiology consult.'
            : '',
          qtcB >= 460 ? '⚠️ Review crediblemeds.org for QT-prolonging medications' : '',
          hr > 100 ? '→ Bazett overcorrects at HR >100 — use Fridericia QTc value' : '',
        ].filter(Boolean),
      };
    },
  },
  // 11. Blood Pressure Classification
  {
    id: 'blood-pressure-class-med',
    name: 'Blood Pressure Classification (ACC/AHA 2017)',
    category: 'Cardiology',
    icon: '🩸',
    description: 'Classify blood pressure per ACC/AHA 2017 Hypertension Guidelines',
    formula: 'Classification based on SBP and DBP thresholds (ACC/AHA 2017)',
    reference: 'Whelton PK et al. J Am Coll Cardiol 2018',
    inputs: [
      {
        id: 'sbp',
        label: 'Systolic Blood Pressure',
        type: 'number',
        unit: 'mmHg',
        min: 50,
        max: 300,
        defaultValue: 125,
        placeholder: 'e.g. 130',
      },
      {
        id: 'dbp',
        label: 'Diastolic Blood Pressure',
        type: 'number',
        unit: 'mmHg',
        min: 20,
        max: 200,
        defaultValue: 82,
        placeholder: 'e.g. 85',
      },
    ],
    calculate(v) {
      const sbp = Number(v.sbp),
        dbp = Number(v.dbp);
      const map = dbp + (sbp - dbp) / 3;
      let cat: string, risk: CalculationResult['risk'], riskPct: string, action: string;
      if (sbp < 120 && dbp < 80) {
        cat = 'Normal';
        risk = 'low';
        riskPct = 'Normal cardiovascular risk';
        action = 'Reinforce healthy lifestyle. Annual BP check.';
      } else if (sbp < 130 && dbp < 80) {
        cat = 'Elevated';
        risk = 'low';
        riskPct = 'Elevated — lifestyle modification';
        action =
          'DASH diet, sodium restriction (<2.3g/day), 150 min/week aerobic exercise, weight loss.';
      } else if (sbp < 140 || dbp < 90) {
        cat = 'Stage 1 Hypertension';
        risk = 'moderate';
        riskPct = '10-yr ASCVD ≥10%: initiate medication';
        action =
          '10-year ASCVD ≥10%: antihypertensive + lifestyle. <10%: lifestyle alone for 3 months.';
      } else if (sbp < 180 || dbp < 120) {
        cat = 'Stage 2 Hypertension';
        risk = 'high';
        riskPct = 'Two-drug combination recommended';
        action = 'Two-drug combination preferred. Target SBP <130 mmHg.';
      } else {
        cat = 'Hypertensive Crisis';
        risk = 'critical';
        riskPct = 'Emergency — assess end-organ damage';
        action =
          'Assess for end-organ damage (troponin, creatinine, UA, fundoscopy). Emergency if damage; urgency if none.';
      }
      return {
        label: 'BP Category',
        value: cat,
        interpretation: `${sbp}/${dbp} mmHg — MAP: ${map.toFixed(1)} mmHg. ${action}`,
        risk,
        riskPercentage: riskPct,
        guidelineSource: 'ACC/AHA 2017 Hypertension Guidelines (Whelton PK et al.)',
        details: [
          `BP: ${sbp}/${dbp} mmHg → ${cat} | MAP: ${map.toFixed(1)} mmHg`,
          `Recommended action: ${action}`,
          sbp >= 180 || dbp >= 120
            ? '🚨 Hypertensive Crisis: Check troponin, creatinine, UA, visual acuity, neuro exam'
            : '',
          '→ Confirm with 2 readings on 2 separate occasions before diagnosing',
          '→ Home BP or ABPM recommended to exclude white-coat hypertension',
        ].filter(Boolean),
      };
    },
  },
  // 12. Framingham CVD Risk Score
  {
    id: 'framingham-risk-med',
    name: 'Framingham 10-Year CVD Risk Score',
    category: 'Cardiology',
    icon: '📉',
    description:
      'Estimate 10-year cardiovascular disease risk using the Framingham Heart Study model',
    formula:
      'Points-based: age, total cholesterol, HDL-C, SBP (treated/untreated), smoking, diabetes (sex-specific)',
    reference: 'Wilson PW et al. Circulation 1998 / ACC/AHA 2019 Primary Prevention Guidelines',
    inputs: [
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 20,
        max: 79,
        defaultValue: 45,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        defaultValue: 'male',
      },
      {
        id: 'tc',
        label: 'Total Cholesterol',
        type: 'number',
        unit: 'mg/dL',
        min: 100,
        max: 400,
        defaultValue: 200,
      },
      {
        id: 'hdl',
        label: 'HDL Cholesterol',
        type: 'number',
        unit: 'mg/dL',
        min: 20,
        max: 100,
        defaultValue: 50,
      },
      {
        id: 'sbp',
        label: 'Systolic BP',
        type: 'number',
        unit: 'mmHg',
        min: 90,
        max: 200,
        defaultValue: 120,
      },
      {
        id: 'bp_treatment',
        label: 'On Antihypertensive Treatment',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'smoker',
        label: 'Current Smoker',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'diabetic',
        label: 'Diabetes Mellitus',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const age = Number(v.age),
        tc = Number(v.tc),
        hdl = Number(v.hdl),
        sbp = Number(v.sbp);
      const smoke = Number(v.smoker),
        dm = Number(v.diabetic),
        bpTx = Number(v.bp_treatment);
      let pts = 0;
      if (v.sex === 'male') {
        pts +=
          age < 35
            ? -9
            : age < 40
              ? -4
              : age < 45
                ? 0
                : age < 50
                  ? 3
                  : age < 55
                    ? 6
                    : age < 60
                      ? 8
                      : age < 65
                        ? 10
                        : age < 70
                          ? 11
                          : age < 75
                            ? 12
                            : 13;
        pts += tc < 160 ? 0 : tc < 200 ? 4 : tc < 240 ? 7 : tc < 280 ? 9 : 11;
        pts += hdl >= 60 ? -1 : hdl >= 50 ? 0 : hdl >= 45 ? 1 : hdl >= 35 ? 2 : 3;
        pts +=
          sbp < 120
            ? 0
            : sbp < 130
              ? bpTx
                ? 1
                : 0
              : sbp < 140
                ? bpTx
                  ? 2
                  : 1
                : sbp < 160
                  ? bpTx
                    ? 2
                    : 1
                  : bpTx
                    ? 3
                    : 2;
        if (smoke) pts += 4;
        if (dm) pts += 3;
      } else {
        pts +=
          age < 35
            ? -7
            : age < 40
              ? -3
              : age < 45
                ? 0
                : age < 50
                  ? 3
                  : age < 55
                    ? 6
                    : age < 60
                      ? 8
                      : age < 65
                        ? 10
                        : age < 70
                          ? 12
                          : age < 75
                            ? 14
                            : 16;
        pts += tc < 160 ? 0 : tc < 200 ? 4 : tc < 240 ? 8 : tc < 280 ? 11 : 13;
        pts += hdl >= 60 ? -2 : hdl >= 50 ? -1 : hdl >= 45 ? 0 : hdl >= 35 ? 1 : 2;
        pts +=
          sbp < 120
            ? -3
            : sbp < 130
              ? bpTx
                ? 3
                : -1
              : sbp < 140
                ? bpTx
                  ? 5
                  : 0
                : sbp < 160
                  ? bpTx
                    ? 6
                    : 2
                  : bpTx
                    ? 8
                    : 4;
        if (smoke) pts += 3;
        if (dm) pts += 4;
      }
      const maleRates = [1, 1, 1, 1, 1, 2, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 31, 37, 45];
      const femaleRates = [0.5, 0.5, 1, 1, 1, 2, 2, 3, 4, 5, 6, 8, 10, 11, 14, 17, 22, 27, 33];
      const risk10 =
        v.sex === 'male'
          ? maleRates[Math.max(0, Math.min(pts + 1, 19))] || 45
          : femaleRates[Math.max(0, Math.min(pts + 2, 18))] || 33;
      const riskStr = `${risk10}%`;
      const risk: CalculationResult['risk'] =
        risk10 < 10 ? 'low' : risk10 < 20 ? 'moderate' : 'high';
      const statin =
        risk10 < 5
          ? 'No statin indicated (unless LDL ≥190 or DM)'
          : risk10 < 7.5
            ? 'Borderline risk — discuss risk-enhancing factors; consider statin'
            : risk10 < 20
              ? 'Initiate moderate-to-high intensity statin'
              : 'High-intensity statin therapy indicated';
      return {
        label: '10-Year CVD Risk',
        value: riskStr,
        interpretation: `${risk10 < 10 ? 'Low' : risk10 < 20 ? 'Intermediate' : 'High'} 10-year CVD risk. ${statin}.`,
        risk,
        riskPercentage: `10-year CVD risk: ${riskStr}`,
        guidelineSource: 'ACC/AHA 2019 Primary Prevention Guidelines',
        details: [
          `Framingham points: ${pts} | 10-year CVD risk: ${riskStr}`,
          `Statin recommendation: ${statin}`,
          '→ Consider coronary artery calcium (CAC) score if treatment decision uncertain',
          '→ Fasting lipid panel + fasting glucose for complete risk assessment',
          '⚠️ Note: AHA ASCVD Pooled Cohort calculator now preferred in US clinical guidelines',
        ],
      };
    },
  },
];

export const nephrologyConfigs: MedicalConfig[] = [
  // 1. FENa / FEUrea Calculator
  {
    id: 'fena-feurea-calculator',
    name: 'FENa / FEUrea Calculator',
    category: 'Nephrology',
    icon: '🧫',
    description:
      'Differentiate pre-renal from intrinsic renal failure using fractional excretion of sodium and urea',
    formula:
      'FENa = (UNa × PCr) / (PNa × UCr) × 100% | FEUrea = (UUrea × PCr) / (PUrea × UCr) × 100%',
    reference: 'Miller TR et al. Ann Intern Med 1978 / KDIGO AKI Guidelines 2012',
    inputs: [
      {
        id: 'una',
        label: 'Urine Sodium (UNa)',
        type: 'number',
        unit: 'mEq/L',
        min: 1,
        max: 300,
        defaultValue: 20,
      },
      {
        id: 'pna',
        label: 'Plasma Sodium (PNa)',
        type: 'number',
        unit: 'mEq/L',
        min: 120,
        max: 165,
        defaultValue: 140,
      },
      {
        id: 'ucr',
        label: 'Urine Creatinine (UCr)',
        type: 'number',
        unit: 'mg/dL',
        min: 10,
        max: 800,
        defaultValue: 100,
      },
      {
        id: 'pcr',
        label: 'Plasma Creatinine (PCr)',
        type: 'number',
        unit: 'mg/dL',
        min: 0.4,
        max: 20,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: 'uurea',
        label: 'Urine Urea Nitrogen',
        type: 'number',
        unit: 'mg/dL',
        min: 10,
        max: 3000,
        defaultValue: 300,
      },
      {
        id: 'purea',
        label: 'Plasma Urea Nitrogen (BUN)',
        type: 'number',
        unit: 'mg/dL',
        min: 5,
        max: 200,
        defaultValue: 20,
      },
    ],
    calculate(v) {
      const una = Number(v.una),
        pna = Number(v.pna),
        ucr = Number(v.ucr),
        pcr = Number(v.pcr);
      const uurea = Number(v.uurea),
        purea = Number(v.purea);
      const fena = ((una * pcr) / (pna * ucr)) * 100;
      const feurea = ((uurea * pcr) / (purea * ucr)) * 100;
      const preRenalFENa = fena < 1;
      const _preRenalFEUrea = feurea < 35;
      const risk: CalculationResult['risk'] = preRenalFENa ? 'moderate' : 'high';
      const feNaInterp =
        fena < 1
          ? 'Pre-renal AKI (or contrast nephropathy, early obstruction)'
          : fena > 2
            ? 'Intrinsic renal failure (ATN most likely)'
            : 'Indeterminate — use FEUrea if on diuretics';
      const feUreaInterp =
        feurea < 35
          ? 'Pre-renal (FEUrea <35% — useful when on diuretics)'
          : feurea > 50
            ? 'Intrinsic renal failure'
            : 'Indeterminate range';
      return {
        label: 'FENa',
        value: fena.toFixed(2),
        unit: '%',
        interpretation: `${feNaInterp}. FEUrea: ${feurea.toFixed(1)}% — ${feUreaInterp}.`,
        risk,
        riskPercentage: preRenalFENa ? 'Pre-renal AKI likely' : 'Intrinsic renal injury likely',
        guidelineSource: 'KDIGO AKI Guidelines 2012 / Miller TR et al.',
        scoreBreakdown: [
          { component: 'FENa', score: fena.toFixed(2) + '%' },
          { component: 'FEUrea', score: feurea.toFixed(1) + '%' },
          {
            component: 'FENa Interpretation',
            score: fena < 1 ? 'Pre-renal' : fena > 2 ? 'Intrinsic' : 'Indeterminate',
          },
          {
            component: 'FEUrea Interpretation',
            score: feurea < 35 ? 'Pre-renal' : feurea > 50 ? 'Intrinsic' : 'Indeterminate',
          },
        ],
        details: [
          `FENa: ${fena.toFixed(2)}% | FEUrea: ${feurea.toFixed(1)}%`,
          `FENa <1% → Pre-renal | FENa >2% → Intrinsic (ATN)`,
          `FEUrea <35% → Pre-renal (preferred when on diuretics) | >50% → Intrinsic`,
          '⚠️ FENa unreliable with diuretics, contrast nephropathy, myoglobinuria, early obstruction',
          '→ Urine microscopy: granular/muddy brown casts confirm ATN',
          '→ 500mL–1L isotonic saline challenge: creatinine improvement confirms pre-renal',
        ],
      };
    },
  },
  // 2. Corrected Calcium
  {
    id: 'calcium-correction-calculator',
    name: 'Corrected Calcium (Albumin Adjustment)',
    category: 'Nephrology',
    icon: '🦴',
    description: 'Correct serum calcium for hypoalbuminemia to avoid misclassification',
    formula: 'Corrected Ca (mg/dL) = Measured Ca + 0.8 × (4.0 − Albumin)',
    reference: 'Payne RB et al. Lancet 1973 / Endocrine Society Clinical Practice Guidelines',
    inputs: [
      {
        id: 'ca',
        label: 'Measured Total Calcium',
        type: 'number',
        unit: 'mg/dL',
        min: 4,
        max: 18,
        step: 0.1,
        defaultValue: 8.5,
      },
      {
        id: 'alb',
        label: 'Serum Albumin',
        type: 'number',
        unit: 'g/dL',
        min: 0.5,
        max: 6,
        step: 0.1,
        defaultValue: 4.0,
      },
    ],
    calculate(v) {
      const ca = Number(v.ca),
        alb = Number(v.alb);
      const corrCa = ca + 0.8 * (4.0 - alb);
      const delta = 0.8 * (4.0 - alb);
      const risk: CalculationResult['risk'] =
        corrCa < 7
          ? 'critical'
          : corrCa < 8.5
            ? 'moderate'
            : corrCa <= 10.5
              ? 'low'
              : corrCa < 12
                ? 'high'
                : 'critical';
      const category =
        corrCa < 7
          ? 'Severe hypocalcemia'
          : corrCa < 8.5
            ? 'Hypocalcemia (8.5–<7 is mild–mod)'
            : corrCa <= 10.5
              ? 'Normal (8.5–10.5 mg/dL)'
              : corrCa < 12
                ? 'Mild hypercalcemia (10.5–11.9)'
                : corrCa < 14
                  ? 'Moderate hypercalcemia (12–13.9)'
                  : 'Severe hypercalcemia (≥14)';
      const action =
        corrCa < 8.5
          ? 'IV calcium gluconate if symptomatic (tetany, seizures, QTc prolongation)'
          : corrCa > 10.5 && corrCa < 12
            ? 'IV hydration, identify cause (PTH, PTHrP, vitamin D, malignancy)'
            : corrCa >= 12
              ? 'IV fluids + bisphosphonate + calcitonin; >14 mg/dL may require hemodialysis'
              : 'No intervention required';
      return {
        label: 'Corrected Calcium',
        value: corrCa.toFixed(2),
        unit: 'mg/dL',
        interpretation: `${category}. ${action}.`,
        risk,
        riskPercentage:
          corrCa < 8.5
            ? 'Hypocalcemia — symptomatic risk'
            : corrCa > 10.5
              ? 'Hypercalcemia — evaluate cause'
              : undefined,
        guidelineSource: 'Endocrine Society Clinical Practice Guidelines / Payne RB et al.',
        scoreBreakdown: [
          { component: 'Measured Calcium', score: ca.toFixed(1) + ' mg/dL' },
          { component: 'Serum Albumin', score: alb.toFixed(1) + ' g/dL' },
          { component: 'Correction Factor (0.8 × [4−Alb])', score: delta.toFixed(2) + ' mg/dL' },
          { component: 'Corrected Calcium', score: corrCa.toFixed(2) + ' mg/dL' },
        ],
        details: [
          `Corrected Ca: ${corrCa.toFixed(2)} mg/dL (measured: ${ca.toFixed(1)}, albumin: ${alb.toFixed(1)} g/dL)`,
          `Correction applied: +${delta.toFixed(2)} mg/dL`,
          `Category: ${category}`,
          '⚠️ Ionized calcium is more accurate than corrected Ca in critically ill patients',
          '⚠️ Alkalosis increases calcium-albumin binding — ionized Ca falls despite normal total Ca',
          '→ Always check Mg²⁺ — hypomagnesemia causes refractory hypocalcemia',
          corrCa < 8.5 ? '→ ECG: look for prolonged QTc (hypocalcemia marker)' : '',
          corrCa > 10.5 ? '→ Check PTH, PTHrP, 25-OH Vit D, protein electrophoresis' : '',
        ].filter(Boolean),
      };
    },
  },
  // 3. Dialysis Adequacy (Kt/V)
  {
    id: 'dialysis-adequacy-ktv',
    name: 'Hemodialysis Adequacy (Kt/V)',
    category: 'Nephrology',
    icon: '🔬',
    description: 'Assess hemodialysis adequacy using the Daugirdas second-generation Kt/V formula',
    formula: 'Kt/V = −ln(R − 0.008×t) + (4 − 3.5×R) × UF/W',
    reference: 'Daugirdas JT. JASN 1993 / KDOQI Hemodialysis Adequacy Guidelines 2015',
    inputs: [
      {
        id: 'pre_bun',
        label: 'Pre-Dialysis BUN',
        type: 'number',
        unit: 'mg/dL',
        min: 20,
        max: 250,
        defaultValue: 80,
      },
      {
        id: 'post_bun',
        label: 'Post-Dialysis BUN',
        type: 'number',
        unit: 'mg/dL',
        min: 5,
        max: 120,
        defaultValue: 20,
      },
      {
        id: 'duration',
        label: 'Session Duration',
        type: 'number',
        unit: 'hours',
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 4,
      },
      {
        id: 'uf_vol',
        label: 'Ultrafiltration Volume',
        type: 'number',
        unit: 'L',
        min: 0,
        max: 8,
        step: 0.1,
        defaultValue: 2,
      },
      {
        id: 'weight',
        label: 'Post-Dialysis Weight',
        type: 'number',
        unit: 'kg',
        min: 30,
        max: 200,
        defaultValue: 70,
      },
    ],
    calculate(v) {
      const preBUN = Number(v.pre_bun),
        postBUN = Number(v.post_bun),
        t = Number(v.duration);
      const uf = Number(v.uf_vol),
        wt = Number(v.weight);
      const R = postBUN / preBUN;
      const ktv = -Math.log(R - 0.008 * t) + ((4 - 3.5 * R) * uf) / wt;
      const urr = (1 - R) * 100;
      const risk: CalculationResult['risk'] = ktv >= 1.4 ? 'low' : ktv >= 1.2 ? 'moderate' : 'high';
      const adequacy =
        ktv >= 1.4
          ? 'Adequate (meets KDOQI target ≥1.4)'
          : ktv >= 1.2
            ? 'Minimum adequate (KDOQI minimum ≥1.2) — optimize session'
            : ktv >= 1.0
              ? 'Suboptimal — increase blood/dialysate flow or session length'
              : 'Inadequate — immediate intervention required';
      return {
        label: 'spKt/V',
        value: ktv.toFixed(2),
        unit: '',
        interpretation: `${adequacy}. URR: ${urr.toFixed(0)}% (target ≥70%). Pre-BUN: ${preBUN} | Post-BUN: ${postBUN} mg/dL.`,
        risk,
        riskPercentage:
          ktv >= 1.4
            ? 'Adequate dialysis dose'
            : `Kt/V ${ktv.toFixed(2)} — below KDOQI target of ≥1.4`,
        guidelineSource: 'KDOQI Hemodialysis Adequacy Guidelines 2015 / Daugirdas JT 1993',
        scoreBreakdown: [
          { component: 'Pre-dialysis BUN', score: preBUN + ' mg/dL' },
          { component: 'Post-dialysis BUN', score: postBUN + ' mg/dL' },
          { component: 'R ratio (Post/Pre BUN)', score: R.toFixed(3) },
          { component: 'Urea Reduction Ratio (URR)', score: urr.toFixed(0) + '%' },
          { component: 'UF Volume', score: uf.toFixed(1) + ' L' },
          { component: 'Session Duration', score: t + ' hours' },
          { component: 'spKt/V (Daugirdas)', score: ktv.toFixed(2) },
        ],
        details: [
          `spKt/V: ${ktv.toFixed(2)} | URR: ${urr.toFixed(0)}%`,
          `KDOQI targets: spKt/V ≥1.4 per session (3×/week); minimum ≥1.2`,
          `URR target: ≥70%`,
          ktv < 1.2
            ? '🚨 Inadequate dialysis — review access, blood flow, membrane, session time'
            : '',
          '→ Residual renal function should be added to dialysis Kt/V for total weekly clearance',
          '→ Access recirculation will falsely improve post-BUN and overestimate Kt/V',
          '→ Re-measure monthly until target is sustained',
        ].filter(Boolean),
      };
    },
  },
  // 4. Free Water Deficit (Hypernatremia)
  {
    id: 'water-deficit-hypernatremia',
    name: 'Free Water Deficit (Hypernatremia)',
    category: 'Nephrology',
    icon: '💧',
    description:
      'Calculate free water deficit in hypernatremia to guide correction volume and rate',
    formula:
      'Water Deficit (L) = TBW × [(Serum Na / 140) − 1]   |   TBW = Weight × 0.6 (male) or 0.5 (female)',
    reference: 'Adrogue HJ, Madias NE. NEJM 2000 / Hypernatremia Management Guidelines',
    inputs: [
      {
        id: 'na',
        label: 'Current Serum Sodium',
        type: 'number',
        unit: 'mEq/L',
        min: 141,
        max: 200,
        defaultValue: 155,
      },
      {
        id: 'weight',
        label: 'Body Weight',
        type: 'number',
        unit: 'kg',
        min: 20,
        max: 300,
        defaultValue: 70,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male (TBW = 60% body weight)', value: 'male' },
          { label: 'Female (TBW = 50% body weight)', value: 'female' },
        ],
        defaultValue: 'male',
      },
      {
        id: 'age_group',
        label: 'Age Group',
        type: 'select',
        options: [
          { label: 'Adult', value: 1 },
          { label: 'Elderly (TBW −10%)', value: 0.9 },
        ],
        defaultValue: 1,
      },
    ],
    calculate(v) {
      const na = Number(v.na),
        wt = Number(v.weight),
        ageFactor = Number(v.age_group);
      const tbwFraction = (v.sex === 'male' ? 0.6 : 0.5) * ageFactor;
      const tbw = wt * tbwFraction;
      const deficit = tbw * (na / 140 - 1);
      const _maxRatePerDay = 10; // max 10-12 mEq/L/day for chronic
      const _hoursToCorrect = Math.ceil((na - 140) / 0.5); // at 0.5 mEq/L/hr chronic
      const risk: CalculationResult['risk'] =
        na < 150 ? 'moderate' : na < 160 ? 'high' : 'critical';
      return {
        label: 'Free Water Deficit',
        value: deficit.toFixed(1),
        unit: 'L',
        interpretation: `Replace ${deficit.toFixed(1)}L free water over 48–72 hours. Max correction rate: 10–12 mEq/L/day (0.5 mEq/L/hr) for chronic hypernatremia. Do NOT lower sodium faster than 12 mEq/L/24h.`,
        risk,
        riskPercentage:
          na >= 160 ? 'Severe hypernatremia — mortality risk elevated' : `Serum Na: ${na} mEq/L`,
        guidelineSource: 'Adrogue HJ & Madias NE. NEJM 2000',
        scoreBreakdown: [
          { component: 'Serum Sodium', score: na + ' mEq/L' },
          { component: 'Target Sodium', score: '140 mEq/L' },
          { component: 'Sodium Excess', score: na - 140 + ' mEq/L above target' },
          { component: 'TBW Fraction', score: (tbwFraction * 100).toFixed(0) + '%' },
          { component: 'Total Body Water (TBW)', score: tbw.toFixed(1) + ' L' },
          { component: 'Free Water Deficit', score: deficit.toFixed(1) + ' L' },
        ],
        details: [
          `Free water deficit: ${deficit.toFixed(1)} L (TBW: ${tbw.toFixed(1)} L)`,
          '→ Correction fluid: D5W (free water) or 0.45% NaCl',
          '→ Chronic hypernatremia (>48h): correct at max 10–12 mEq/L/day (0.5 mEq/L/hr)',
          '→ Acute hypernatremia (<24–48h): can correct at 1 mEq/L/hr',
          '⚠️ Over-rapid correction causes cerebral edema (brain swelling)',
          '→ Monitor serum Na every 2–4 hours during correction',
          '→ Include ongoing losses (insensible, urinary, GI) in total replacement volume',
          '→ Urine osmolality: <200 mOsm/kg suggests diabetes insipidus',
        ],
      };
    },
  },
  // 5. MDRD eGFR
  {
    id: 'mdrd-egfr-calculator',
    name: 'eGFR (MDRD Equation)',
    category: 'Nephrology',
    icon: '🧮',
    description: 'Estimate GFR using the 4-variable MDRD equation (race-adjusted)',
    formula: 'eGFR = 175 × Cr⁻¹·¹⁵⁴ × Age⁻⁰·²⁰³ × [0.742 if female] × [1.212 if Black]',
    reference: 'Levey AS et al. Ann Intern Med 1999 / KDIGO CKD Guidelines 2022',
    inputs: [
      {
        id: 'creatinine',
        label: 'Serum Creatinine',
        type: 'number',
        unit: 'mg/dL',
        min: 0.4,
        max: 20,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 100,
        defaultValue: 50,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female (×0.742)', value: 'female' },
        ],
        defaultValue: 'male',
      },
      {
        id: 'black',
        label: 'Race — Black/African American (×1.212)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const cr = Number(v.creatinine),
        age = Number(v.age);
      let egfr = 175 * Math.pow(cr, -1.154) * Math.pow(age, -0.203);
      if (v.sex === 'female') egfr *= 0.742;
      if (Number(v.black)) egfr *= 1.212;
      const stage =
        egfr >= 90
          ? 'G1'
          : egfr >= 60
            ? 'G2'
            : egfr >= 45
              ? 'G3a'
              : egfr >= 30
                ? 'G3b'
                : egfr >= 15
                  ? 'G4'
                  : 'G5';
      const stageDesc =
        egfr >= 90
          ? 'Normal or High'
          : egfr >= 60
            ? 'Mildly Decreased'
            : egfr >= 45
              ? 'Mildly–Moderately Decreased'
              : egfr >= 30
                ? 'Moderately–Severely Decreased'
                : egfr >= 15
                  ? 'Severely Decreased'
                  : 'Kidney Failure';
      const risk: CalculationResult['risk'] =
        egfr >= 60 ? 'low' : egfr >= 30 ? 'moderate' : egfr >= 15 ? 'high' : 'critical';
      return {
        label: 'MDRD eGFR',
        value: Math.round(egfr),
        unit: 'mL/min/1.73m²',
        interpretation: `CKD Stage ${stage} — ${stageDesc}. ${egfr < 60 ? 'Nephrology referral based on KDIGO risk grid.' : egfr < 90 ? 'Monitor with UACR annually.' : 'CKD only if structural markers or proteinuria present.'}`,
        risk,
        riskPercentage: `CKD Stage ${stage} — eGFR ${Math.round(egfr)} mL/min/1.73m²`,
        guidelineSource: 'KDIGO CKD Guidelines 2022 / Levey AS et al. 1999',
        scoreBreakdown: [
          { component: 'Serum Creatinine', score: cr + ' mg/dL' },
          { component: 'Age Factor', score: age + ' years' },
          {
            component: 'Sex Factor',
            score: v.sex === 'female' ? '×0.742 (female)' : '×1.000 (male)',
          },
          { component: 'Race Factor', score: Number(v.black) ? '×1.212 (Black/AA)' : '×1.000' },
          { component: 'MDRD eGFR', score: Math.round(egfr) + ' mL/min/1.73m²' },
          { component: 'CKD Stage', score: `${stage} — ${stageDesc}` },
        ],
        details: [
          `MDRD eGFR: ${Math.round(egfr)} mL/min/1.73m² — CKD Stage ${stage} (${stageDesc})`,
          '⚠️ CKD-EPI 2021 (race-free) is now preferred over MDRD for CKD staging',
          '→ UACR required for complete KDIGO CKD risk heat-map classification',
          egfr < 30 ? '→ Nephrology referral: eGFR <30, prepare for renal replacement therapy' : '',
          egfr < 60 ? '→ ACE-I or ARB for proteinuric CKD (UACR ≥30 mg/g)' : '',
          '⚠️ eGFR unreliable during AKI — use only for stable steady-state creatinine',
        ].filter(Boolean),
      };
    },
  },
  // 6. Urine Anion Gap
  {
    id: 'urine-anion-gap-calculator',
    name: 'Urine Anion Gap (UAG)',
    category: 'Nephrology',
    icon: '⚗️',
    description: 'Differentiate causes of non-anion gap metabolic acidosis (NAGMA)',
    formula: 'UAG = Urine Na⁺ + Urine K⁺ − Urine Cl⁻',
    reference: 'Batlle DC et al. NEJM 1988 / Emmett M, Narins RG. Medicine 1977',
    inputs: [
      {
        id: 'una',
        label: 'Urine Sodium (UNa⁺)',
        type: 'number',
        unit: 'mEq/L',
        min: 1,
        max: 250,
        defaultValue: 40,
      },
      {
        id: 'uk',
        label: 'Urine Potassium (UK⁺)',
        type: 'number',
        unit: 'mEq/L',
        min: 1,
        max: 200,
        defaultValue: 30,
      },
      {
        id: 'ucl',
        label: 'Urine Chloride (UCl⁻)',
        type: 'number',
        unit: 'mEq/L',
        min: 1,
        max: 400,
        defaultValue: 60,
      },
    ],
    calculate(v) {
      const una = Number(v.una),
        uk = Number(v.uk),
        ucl = Number(v.ucl);
      const uag = una + uk - ucl;
      const risk: CalculationResult['risk'] = uag < 0 ? 'low' : 'high';
      const interpretation =
        uag < 0
          ? 'Negative UAG — GI bicarbonate loss (diarrhea most common). NH₄⁺ excretion intact (appropriate renal response to acidosis).'
          : 'Positive UAG — Impaired NH₄⁺ excretion. Suggests distal RTA (Type 1), hyperkalemic RTA (Type 4), or early Type 2 RTA.';
      return {
        label: 'Urine Anion Gap',
        value: uag,
        unit: 'mEq/L',
        interpretation: `UAG = ${una} + ${uk} − ${ucl} = ${uag} mEq/L. ${interpretation}`,
        risk,
        riskPercentage:
          uag < 0
            ? 'GI bicarbonate loss — appropriate renal response'
            : 'Impaired NH₄⁺ excretion — renal cause',
        guidelineSource: 'Batlle DC et al. NEJM 1988',
        scoreBreakdown: [
          { component: 'Urine Na⁺', score: una + ' mEq/L' },
          { component: 'Urine K⁺', score: uk + ' mEq/L' },
          { component: 'Urine Cl⁻', score: ucl + ' mEq/L' },
          { component: 'UAG (Na+K−Cl)', score: uag + ' mEq/L' },
          { component: 'Cause of NAGMA', score: uag < 0 ? 'GI / Extra-renal' : 'Renal (RTA)' },
        ],
        details: [
          `UAG = ${una} + ${uk} − ${ucl} = ${uag} mEq/L`,
          uag < 0
            ? '→ Negative UAG: diarrhea, external fistula, ileostomy — NH₄⁺ excretion intact'
            : '→ Positive UAG: distal RTA (Type 1), Type 4 RTA (hyperkalemic), early proximal RTA',
          '→ Urine pH <5.5 = diarrhea (appropriate acidification); >5.5 = distal RTA',
          '→ Serum K⁺: hypokalemia in Type 1/2 RTA; hyperkalemia in Type 4 RTA',
          '⚠️ UAG unreliable if urine Na <20 mEq/L (low Na limits NH₄⁺ delivery)',
          '⚠️ Toluene (glue-sniffing) causes large negative UAG via hippurate excretion',
        ],
      };
    },
  },
  // 7. Renal Drug Dose Adjuster
  {
    id: 'renal-drug-dose-adjuster',
    name: 'Renal Drug Dose Adjuster',
    category: 'Nephrology',
    icon: '💊',
    description: 'Estimate dose fraction for renally-cleared drugs based on CrCl / eGFR',
    formula: 'Dose Fraction = CrCl / Normal CrCl | Adjusted Dose = Normal Dose × Dose Fraction',
    reference: 'Aronoff GR et al. Drug Prescribing in Renal Failure 2007 / Lexicomp / Micromedex',
    inputs: [
      {
        id: 'crcl',
        label: 'CrCl or eGFR',
        type: 'number',
        unit: 'mL/min',
        min: 1,
        max: 150,
        defaultValue: 60,
      },
      {
        id: 'normal_dose',
        label: 'Normal (Full) Dose',
        type: 'number',
        unit: 'mg',
        min: 1,
        max: 10000,
        defaultValue: 500,
      },
      {
        id: 'dosing_interval',
        label: 'Normal Dosing Interval',
        type: 'number',
        unit: 'hours',
        min: 4,
        max: 72,
        defaultValue: 8,
      },
    ],
    calculate(v) {
      const crcl = Number(v.crcl),
        normalDose = Number(v.normal_dose),
        interval = Number(v.dosing_interval);
      let fraction: number, tier: string;
      if (crcl >= 60) {
        fraction = 1.0;
        tier = 'Full dose — no adjustment needed (CrCl ≥60 mL/min)';
      } else if (crcl >= 30) {
        fraction = 0.75;
        tier = 'Mild reduction — 75% dose or extend interval (CrCl 30–59)';
      } else if (crcl >= 15) {
        fraction = 0.5;
        tier = 'Moderate reduction — 50% dose or extend interval (CrCl 15–29)';
      } else {
        fraction = 0.25;
        tier = 'Severe reduction — 25% dose or avoid (CrCl <15 / ESRD)';
      }
      const adjDose = Math.round(normalDose * fraction);
      const adjInterval = Math.round(interval / fraction);
      const risk: CalculationResult['risk'] =
        crcl >= 60 ? 'low' : crcl >= 30 ? 'moderate' : crcl >= 15 ? 'high' : 'critical';
      return {
        label: 'Adjusted Dose',
        value: adjDose,
        unit: 'mg',
        interpretation: `${tier}. Alternative: extend dosing interval to ~${adjInterval}h at full dose. Always verify in drug-specific prescribing information.`,
        risk,
        riskPercentage: `CrCl ${crcl} mL/min — dose fraction: ${(fraction * 100).toFixed(0)}%`,
        guidelineSource: 'Aronoff GR et al. Drug Prescribing in Renal Failure 2007',
        scoreBreakdown: [
          { component: 'CrCl / eGFR', score: crcl + ' mL/min' },
          { component: 'Dose Fraction', score: (fraction * 100).toFixed(0) + '%' },
          { component: 'Adjusted Dose', score: adjDose + ' mg' },
          { component: 'Alternative Interval', score: adjInterval + ' hours at full dose' },
          { component: 'Renal Impairment Tier', score: tier.split('—')[0].trim() },
        ],
        details: [
          `CrCl: ${crcl} mL/min → Dose fraction: ${(fraction * 100).toFixed(0)}%`,
          `Adjusted dose: ${adjDose} mg every ${interval}h OR ${normalDose} mg every ${adjInterval}h`,
          '⚠️ This is a general estimate — ALWAYS verify dose in Lexicomp, Micromedex, or product PI',
          '→ Use Cockcroft-Gault CrCl (not eGFR) — most PK studies used CG equation',
          '→ Dialysis patients: some drugs require supplemental dose post-dialysis (meropenem, vancomycin)',
          crcl < 15
            ? '→ CrCl <15 — consider withholding renally-cleared drugs; nephrology consult'
            : '',
        ].filter(Boolean),
      };
    },
  },
  // 8. Kidney Failure Risk Equation
  {
    id: 'kidney-failure-risk-equation',
    name: 'Kidney Failure Risk Equation (KFRE)',
    category: 'Nephrology',
    icon: '📊',
    description: '2-year and 5-year risk of kidney failure requiring dialysis or transplant',
    formula: '1 − 0.9240^exp(−0.2201×(eGFR/10−3.015) + 0.2467×(log(UACR/150)−0.7311) + sex + age)',
    reference: 'Tangri N et al. JAMA 2011 / KDIGO CKD Guidelines 2022',
    inputs: [
      {
        id: 'egfr',
        label: 'eGFR',
        type: 'number',
        unit: 'mL/min/1.73m²',
        min: 5,
        max: 59,
        defaultValue: 35,
      },
      {
        id: 'uacr',
        label: 'Urine Albumin-to-Creatinine Ratio (UACR)',
        type: 'number',
        unit: 'mg/g',
        min: 3,
        max: 10000,
        defaultValue: 150,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 100,
        defaultValue: 60,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male (0 pts)', value: 0 },
          { label: 'Female (−0.2170)', value: -0.217 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const egfr = Number(v.egfr),
        uacr = Number(v.uacr),
        age = Number(v.age);
      const logit =
        -0.2201 * (egfr / 10 - 3.015) +
        0.2467 * (Math.log(uacr / 150) - 0.7311) +
        Number(v.sex) +
        0.1142 * (age / 10 - 6.0);
      const risk2yr = (1 - Math.pow(0.924, Math.exp(logit))) * 100;
      const risk5yr = (1 - Math.pow(0.73, Math.exp(logit))) * 100;
      const riskLevel: CalculationResult['risk'] =
        risk2yr < 5 ? 'low' : risk2yr < 20 ? 'moderate' : 'high';
      const category =
        risk2yr < 5 ? 'Low' : risk2yr < 20 ? 'Moderate' : risk2yr < 40 ? 'High' : 'Very High';
      return {
        label: '2-Year Kidney Failure Risk',
        value: risk2yr.toFixed(1),
        unit: '%',
        interpretation: `${category} risk of progressing to kidney failure within 2 years (${risk2yr.toFixed(1)}%). 5-year risk: ${risk5yr.toFixed(1)}%. eGFR: ${egfr} | UACR: ${uacr} mg/g.`,
        risk: riskLevel,
        riskPercentage: `2-year risk: ${risk2yr.toFixed(1)}% | 5-year risk: ${risk5yr.toFixed(1)}%`,
        guidelineSource: 'Tangri N et al. JAMA 2011 / KDIGO CKD Guidelines 2022',
        scoreBreakdown: [
          { component: 'eGFR', score: egfr + ' mL/min/1.73m²' },
          { component: 'UACR', score: uacr + ' mg/g' },
          { component: 'Age', score: age + ' years' },
          { component: 'Sex Factor', score: Number(v.sex) === 0 ? 'Male (0)' : 'Female (−0.2170)' },
          { component: '2-Year Risk', score: risk2yr.toFixed(1) + '%' },
          { component: '5-Year Risk', score: risk5yr.toFixed(1) + '%' },
        ],
        details: [
          `KFRE 2-year kidney failure risk: ${risk2yr.toFixed(1)}%`,
          `KFRE 5-year kidney failure risk: ${risk5yr.toFixed(1)}%`,
          risk2yr >= 20
            ? '→ Expedited nephrology referral — begin renal replacement therapy planning'
            : '',
          '→ ACE-I/ARB for CKD + UACR ≥30 mg/g (titrate to maximum tolerated dose)',
          '→ SGLT2 inhibitor: cardio-renal protection if eGFR ≥20 (dapagliflozin, empagliflozin)',
          '→ Discuss RRT options (HD, PD, transplant) when 2-year risk >10%',
          '⚠️ Validated in CKD G3–G5; less reliable at eGFR >60',
        ].filter(Boolean),
      };
    },
  },
  // 9. Creatinine Clearance (Cockcroft-Gault)
  {
    id: 'creatinine-clearance-med',
    name: 'Creatinine Clearance (Cockcroft-Gault)',
    category: 'Nephrology',
    icon: '🧪',
    description:
      'Estimate creatinine clearance for drug dose adjustment using the Cockcroft-Gault equation',
    formula: 'CrCl = [(140 − Age) × Weight / (72 × Cr)] × 0.85 if female',
    reference: 'Cockcroft DW, Gault MH. Nephron 1976 / ASHP Drug Dosing Guidelines',
    inputs: [
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 110,
        defaultValue: 50,
      },
      {
        id: 'weight',
        label: 'Body Weight (use IBW if obese)',
        type: 'number',
        unit: 'kg',
        min: 20,
        max: 300,
        defaultValue: 70,
      },
      {
        id: 'creatinine',
        label: 'Serum Creatinine',
        type: 'number',
        unit: 'mg/dL',
        min: 0.4,
        max: 20,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female (×0.85)', value: 'female' },
        ],
        defaultValue: 'male',
      },
    ],
    calculate(v) {
      const age = Number(v.age),
        wt = Number(v.weight),
        cr = Number(v.creatinine);
      let crcl = ((140 - age) * wt) / (72 * cr);
      if (v.sex === 'female') crcl *= 0.85;
      const risk: CalculationResult['risk'] =
        crcl >= 60 ? 'low' : crcl >= 30 ? 'moderate' : crcl >= 15 ? 'high' : 'critical';
      const tier =
        crcl >= 90
          ? 'Normal CrCl (≥90 mL/min) — full dose for most drugs'
          : crcl >= 60
            ? 'Mildly reduced (60–89) — full dose for most drugs'
            : crcl >= 30
              ? 'Moderately reduced (30–59) — dose adjustment required for many drugs'
              : crcl >= 15
                ? 'Severely reduced (15–29) — significant dose reduction required'
                : 'Kidney failure (<15) — most renally-cleared drugs contraindicated or very low dose';
      return {
        label: 'CrCl (Cockcroft-Gault)',
        value: crcl.toFixed(1),
        unit: 'mL/min',
        interpretation: `${tier}. Use this value (not eGFR) for drug dose adjustment.`,
        risk,
        riskPercentage: `CrCl ${crcl.toFixed(0)} mL/min — ${crcl >= 60 ? 'No dose adjustment for most drugs' : crcl >= 30 ? 'Dose reduction required' : 'Significant dose reduction / avoidance'}`,
        guidelineSource: 'Cockcroft DW & Gault MH. Nephron 1976 / ASHP Guidelines',
        scoreBreakdown: [
          { component: 'Age', score: age + ' years' },
          { component: 'Weight Used', score: wt + ' kg' },
          { component: 'Serum Creatinine', score: cr + ' mg/dL' },
          {
            component: 'Sex Factor',
            score: v.sex === 'female' ? '×0.85 (female)' : '×1.00 (male)',
          },
          { component: 'CrCl (Cockcroft-Gault)', score: crcl.toFixed(1) + ' mL/min' },
        ],
        details: [
          `CrCl: ${crcl.toFixed(1)} mL/min — ${tier}`,
          '→ Use CrCl (Cockcroft-Gault) — not CKD-EPI eGFR — for all drug dosing decisions',
          '→ Obese patients: use IBW or ABW (IBW + 0.4 × [Actual − IBW]) per drug protocol',
          '⚠️ Overestimates CrCl in elderly/cachectic (low creatinine production)',
          '⚠️ Unreliable during AKI — creatinine still rising; use clinical judgment',
          '→ Pharmacy verification required for all renally-adjusted high-alert medications',
        ],
      };
    },
  },
  // 10. eGFR (CKD-EPI 2021)
  {
    id: 'egfr-ckd-epi-med',
    name: 'eGFR (CKD-EPI 2021 — Race-Free)',
    category: 'Nephrology',
    icon: '🔬',
    description: 'Estimate GFR using the 2021 CKD-EPI creatinine equation (race-free)',
    formula: 'eGFR = 142 × min(Cr/κ, 1)^α × max(Cr/κ, 1)^−1.200 × 0.9938^Age × [1.012 if female]',
    reference: 'Inker LA et al. NEJM 2021 / KDIGO CKD Guidelines 2022',
    inputs: [
      {
        id: 'creatinine',
        label: 'Serum Creatinine',
        type: 'number',
        unit: 'mg/dL',
        min: 0.4,
        max: 20,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 100,
        defaultValue: 50,
      },
      {
        id: 'sex',
        label: 'Sex (affects κ and α constants)',
        type: 'select',
        options: [
          { label: 'Male (κ=0.9, α=−0.302)', value: 'male' },
          { label: 'Female (κ=0.7, α=−0.241, ×1.012)', value: 'female' },
        ],
        defaultValue: 'male',
      },
    ],
    calculate(v) {
      const cr = Number(v.creatinine),
        age = Number(v.age);
      const isFemale = v.sex === 'female';
      const kappa = isFemale ? 0.7 : 0.9;
      const alpha = isFemale ? -0.241 : -0.302;
      const sexFactor = isFemale ? 1.012 : 1;
      const egfr =
        142 *
        Math.pow(Math.min(cr / kappa, 1), alpha) *
        Math.pow(Math.max(cr / kappa, 1), -1.2) *
        Math.pow(0.9938, age) *
        sexFactor;
      const stage =
        egfr >= 90
          ? 'G1'
          : egfr >= 60
            ? 'G2'
            : egfr >= 45
              ? 'G3a'
              : egfr >= 30
                ? 'G3b'
                : egfr >= 15
                  ? 'G4'
                  : 'G5';
      const stageDesc =
        egfr >= 90
          ? 'Normal or High'
          : egfr >= 60
            ? 'Mildly Decreased'
            : egfr >= 45
              ? 'Mildly–Moderately Decreased'
              : egfr >= 30
                ? 'Moderately–Severely Decreased'
                : egfr >= 15
                  ? 'Severely Decreased'
                  : 'Kidney Failure';
      const risk: CalculationResult['risk'] =
        egfr >= 60 ? 'low' : egfr >= 30 ? 'moderate' : egfr >= 15 ? 'high' : 'critical';
      const followUp =
        egfr >= 90
          ? 'Annual monitoring with UACR'
          : egfr >= 60
            ? '6–12 monthly labs'
            : egfr >= 30
              ? '3–6 monthly labs, nephrology input'
              : egfr >= 15
                ? 'Monthly labs, RRT planning, nephrology referral'
                : 'Dialysis or transplant evaluation';
      return {
        label: 'CKD-EPI eGFR (2021)',
        value: Math.round(egfr),
        unit: 'mL/min/1.73m²',
        interpretation: `CKD Stage ${stage} (${stageDesc}). ${followUp}.`,
        risk,
        riskPercentage: `eGFR ${Math.round(egfr)} mL/min/1.73m² — Stage ${stage}`,
        guidelineSource: 'Inker LA et al. NEJM 2021 / KDIGO CKD Guidelines 2022',
        scoreBreakdown: [
          { component: 'Serum Creatinine', score: cr + ' mg/dL' },
          { component: 'Age', score: age + ' years' },
          { component: 'κ (kappa)', score: isFemale ? '0.7 (female)' : '0.9 (male)' },
          { component: 'α (alpha)', score: isFemale ? '−0.241 (female)' : '−0.302 (male)' },
          { component: 'Sex Factor', score: isFemale ? '×1.012 (female)' : '×1.000 (male)' },
          { component: 'CKD-EPI 2021 eGFR', score: Math.round(egfr) + ' mL/min/1.73m²' },
          { component: 'CKD Stage', score: `${stage} — ${stageDesc}` },
        ],
        details: [
          `CKD-EPI 2021 eGFR: ${Math.round(egfr)} mL/min/1.73m² — Stage ${stage} (${stageDesc})`,
          `Follow-up: ${followUp}`,
          '→ CKD-EPI 2021 is RACE-FREE — do not add race adjustment',
          '→ UACR required for complete KDIGO CKD risk heat-map (G1–G5 × A1–A3)',
          '→ ACE-I/ARB for CKD + UACR ≥30 mg/g (reduce proteinuria and slow progression)',
          '→ SGLT2 inhibitor (dapagliflozin/empagliflozin) if eGFR ≥20 regardless of DM status',
          egfr < 30
            ? '→ RRT planning: access creation (AV fistula), PD catheter, or transplant evaluation'
            : '',
          '⚠️ Use Cockcroft-Gault CrCl (not CKD-EPI) for drug dose adjustment',
        ].filter(Boolean),
      };
    },
  },
];

export const criticalCareConfigs: MedicalConfig[] = [
  // 1. ABG Interpreter
  {
    id: 'abg-interpreter',
    name: 'Arterial Blood Gas (ABG) Interpreter',
    category: 'Critical Care',
    icon: '🫁',
    description:
      'Full acid-base disorder analysis with primary disorder, compensation check, and oxygenation assessment',
    formula:
      'Henderson-Hasselbalch: pH = 6.1 + log([HCO3] / 0.0307 x PaCO2) | Compensation: Winters formula, expected pH',
    reference:
      'Narins RG, Emmett M. Medicine 1980 / ARDS Network / ATS ABG Interpretation Guidelines',
    inputs: [
      {
        id: 'ph',
        label: 'Arterial pH',
        type: 'number',
        unit: '',
        min: 6.8,
        max: 7.8,
        step: 0.01,
        defaultValue: 7.4,
        placeholder: 'e.g. 7.35',
      },
      {
        id: 'paco2',
        label: 'PaCO₂',
        type: 'number',
        unit: 'mmHg',
        min: 10,
        max: 120,
        defaultValue: 40,
        placeholder: 'e.g. 40',
      },
      {
        id: 'hco3',
        label: 'HCO₃⁻ (Bicarbonate)',
        type: 'number',
        unit: 'mEq/L',
        min: 5,
        max: 50,
        defaultValue: 24,
        placeholder: 'e.g. 24',
      },
      {
        id: 'pao2',
        label: 'PaO₂',
        type: 'number',
        unit: 'mmHg',
        min: 20,
        max: 700,
        defaultValue: 95,
        placeholder: 'e.g. 95',
      },
      {
        id: 'fio2',
        label: 'FiO₂ (fraction inspired O₂)',
        type: 'number',
        unit: '',
        min: 0.21,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.21,
        placeholder: 'e.g. 0.21',
      },
      {
        id: 'age',
        label: 'Patient Age (for A-a gradient)',
        type: 'number',
        unit: 'years',
        min: 1,
        max: 120,
        defaultValue: 40,
        placeholder: 'e.g. 40',
      },
    ],
    calculate(v) {
      const ph = Number(v.ph),
        paco2 = Number(v.paco2),
        hco3 = Number(v.hco3),
        pao2 = Number(v.pao2);
      const fio2 = Number(v.fio2),
        age = Number(v.age);

      // Primary disorder
      const acidBase = ph < 7.35 ? 'Acidemia' : ph > 7.45 ? 'Alkalemia' : 'Normal pH';
      let primaryDisorder: string, compensationExpected: string;
      if (ph < 7.35) {
        if (paco2 > 45) {
          primaryDisorder = 'Respiratory Acidosis';
          compensationExpected = `Expected HCO₃⁻ = ${(24 + 0.1 * (paco2 - 40)).toFixed(1)} mEq/L (acute) or ${(24 + 0.35 * (paco2 - 40)).toFixed(1)} mEq/L (chronic)`;
        } else if (hco3 < 22) {
          primaryDisorder = 'Metabolic Acidosis';
          compensationExpected = `Expected PaCO₂ = ${(1.5 * hco3 + 8).toFixed(0)}±2 mmHg (Winters formula)`;
        } else {
          primaryDisorder = 'Mixed Disorder';
          compensationExpected = 'Cannot determine — mixed picture';
        }
      } else if (ph > 7.45) {
        if (paco2 < 35) {
          primaryDisorder = 'Respiratory Alkalosis';
          compensationExpected = `Expected HCO₃⁻ = ${(24 - 0.2 * (40 - paco2)).toFixed(1)} mEq/L (acute) or ${(24 - 0.5 * (40 - paco2)).toFixed(1)} mEq/L (chronic)`;
        } else if (hco3 > 26) {
          primaryDisorder = 'Metabolic Alkalosis';
          compensationExpected = `Expected PaCO₂ = ${(0.7 * hco3 + 21).toFixed(0)}±5 mmHg`;
        } else {
          primaryDisorder = 'Mixed Disorder';
          compensationExpected = 'Cannot determine — mixed picture';
        }
      } else {
        primaryDisorder = 'Normal or mixed disorder with compensated pH';
        compensationExpected = 'pH in normal range — check individual values';
      }

      // Oxygenation
      const pao2Expected = fio2 * 713 - paco2 / 0.8;
      const aaGradient = pao2Expected - pao2;
      const aaGradientNormal = age / 4 + 4;
      const hypoxemia =
        pao2 < 60
          ? 'Severe hypoxemia (PaO₂ <60 mmHg)'
          : pao2 < 80
            ? 'Moderate hypoxemia'
            : pao2 < 95
              ? 'Mild hypoxemia'
              : 'Normal oxygenation';
      const pfRatio = pao2 / fio2;
      const ardsClass =
        pfRatio < 100
          ? 'Severe ARDS (Berlin)'
          : pfRatio < 200
            ? 'Moderate ARDS'
            : pfRatio < 300
              ? 'Mild ARDS'
              : 'No ARDS';

      const risk: CalculationResult['risk'] =
        ph < 7.2 || ph > 7.6 ? 'critical' : ph < 7.35 || ph > 7.45 ? 'high' : 'low';

      return {
        label: 'ABG Interpretation',
        value: primaryDisorder,
        interpretation: `${acidBase}. Primary disorder: ${primaryDisorder}. ${hypoxemia}. P/F ratio: ${pfRatio.toFixed(0)} mmHg (${ardsClass}).`,
        risk,
        riskPercentage:
          ph < 7.2 || ph > 7.6 ? 'Critical pH — life-threatening acid-base disturbance' : undefined,
        guidelineSource: 'Narins RG & Emmett M. Medicine 1980 / Berlin ARDS Definition 2012',
        scoreBreakdown: [
          {
            component: 'pH',
            score: ph + (ph < 7.35 ? ' (Acidemia)' : ph > 7.45 ? ' (Alkalemia)' : ' (Normal)'),
          },
          {
            component: 'PaCO₂',
            score: paco2 + ' mmHg' + (paco2 > 45 ? ' (↑)' : paco2 < 35 ? ' (↓)' : ' (normal)'),
          },
          {
            component: 'HCO₃⁻',
            score: hco3 + ' mEq/L' + (hco3 > 26 ? ' (↑)' : hco3 < 22 ? ' (↓)' : ' (normal)'),
          },
          { component: 'Primary Disorder', score: primaryDisorder },
          { component: 'Compensation Check', score: compensationExpected },
          { component: 'PaO₂', score: pao2 + ' mmHg — ' + hypoxemia },
          {
            component: 'A-a Gradient',
            score:
              aaGradient.toFixed(0) +
              ' mmHg (normal for age: <' +
              aaGradientNormal.toFixed(0) +
              ')',
          },
          { component: 'P/F Ratio', score: pfRatio.toFixed(0) + ' mmHg — ' + ardsClass },
        ],
        details: [
          `pH: ${ph} | PaCO₂: ${paco2} mmHg | HCO₃⁻: ${hco3} mEq/L | PaO₂: ${pao2} mmHg`,
          `Primary disorder: ${primaryDisorder}`,
          `Compensation: ${compensationExpected}`,
          `A-a gradient: ${aaGradient.toFixed(0)} mmHg (age-adjusted normal: <${aaGradientNormal.toFixed(0)} mmHg)`,
          `P/F ratio: ${pfRatio.toFixed(0)} mmHg — ${ardsClass}`,
          pao2 < 60
            ? '🚨 Severe hypoxemia — urgent O₂ supplementation / intubation assessment'
            : '',
          ph < 7.2 ? '🚨 Critical acidemia — urgent intervention required' : '',
          ph > 7.6 ? '🚨 Critical alkalemia — urgent intervention required' : '',
          primaryDisorder.includes('Metabolic Acidosis')
            ? '→ Calculate anion gap and delta-delta ratio to rule out mixed disorder'
            : '',
        ].filter(Boolean),
      };
    },
  },
  // 2. IV Fluid Rate Calculator
  {
    id: 'iv-fluid-rate-calculator',
    name: 'IV Fluid Rate Calculator',
    category: 'Critical Care',
    icon: '💧',
    description:
      'Calculate IV infusion rate (mL/hr) and drip rate (drops/min) for manual drip sets',
    formula: 'Rate (mL/hr) = Volume (mL) ÷ Time (hr) | Drops/min = Rate × Drop factor ÷ 60',
    reference: 'NICE IV Fluid Guidelines 2013 / Surviving Sepsis Campaign 2021',
    inputs: [
      {
        id: 'volume',
        label: 'Total Volume to Infuse',
        type: 'number',
        unit: 'mL',
        min: 50,
        max: 10000,
        defaultValue: 1000,
      },
      {
        id: 'time',
        label: 'Infusion Time',
        type: 'number',
        unit: 'hours',
        min: 0.5,
        max: 48,
        step: 0.5,
        defaultValue: 8,
      },
      {
        id: 'drop_factor',
        label: 'Administration Set Drop Factor',
        type: 'select',
        options: [
          { label: '10 drops/mL (macro — blood/colloid)', value: 10 },
          { label: '15 drops/mL (standard macro)', value: 15 },
          { label: '20 drops/mL (standard macro)', value: 20 },
          { label: '60 drops/mL (micro — paediatric/precise)', value: 60 },
        ],
        defaultValue: 20,
      },
    ],
    calculate(v) {
      const vol = Number(v.volume),
        time = Number(v.time),
        df = Number(v.drop_factor);
      const rate = vol / time;
      const drops = (rate * df) / 60;
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: 'IV Rate',
        value: rate.toFixed(1),
        unit: 'mL/hr',
        interpretation: `Infuse ${vol} mL over ${time} hours at ${rate.toFixed(1)} mL/hr. Manual drip rate: ${drops.toFixed(0)} drops/min using ${df} drops/mL set.`,
        risk,
        guidelineSource: 'NICE IV Fluid Therapy Guidelines 2013',
        scoreBreakdown: [
          { component: 'Total Volume', score: vol + ' mL' },
          { component: 'Infusion Time', score: time + ' hours' },
          { component: 'Rate', score: rate.toFixed(1) + ' mL/hr' },
          { component: 'Drop Factor', score: df + ' drops/mL' },
          { component: 'Drip Rate', score: drops.toFixed(0) + ' drops/min' },
        ],
        details: [
          `Rate: ${rate.toFixed(1)} mL/hr | Drip rate: ${drops.toFixed(0)} drops/min`,
          '→ Use infusion pump for vasoactive drugs, insulin, opioids, heparin — never gravity drip',
          '→ Crystalloid selection: balanced solutions (LR, Plasmalyte) preferred over 0.9% NS for large volumes',
          '→ Large-volume NS (>3L): risk of hyperchloremic metabolic acidosis',
          '→ Assess fluid responsiveness (passive leg raise) before each bolus — avoid fluid overload',
          rate > 500
            ? '⚠️ Rate >500 mL/hr — ensure rapid infuser or blood warmer if indicated'
            : '',
        ].filter(Boolean),
      };
    },
  },
  // 3. qSOFA Score
  {
    id: 'qsofa-sepsis-score',
    name: 'qSOFA Sepsis Screening Score',
    category: 'Critical Care',
    icon: '🚨',
    description:
      'Rapid bedside sepsis screening — identifies patients at high risk of organ dysfunction',
    formula: 'RR ≥22/min (1) + Altered mental status (1) + SBP ≤100 mmHg (1) = 0–3',
    reference: 'Seymour CW et al. JAMA 2016 (Sepsis-3) / Surviving Sepsis Campaign 2021',
    inputs: [
      {
        id: 'rr',
        label: 'Respiratory Rate ≥22 breaths/min',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'mental',
        label: 'Altered Mental Status (GCS <15)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'sbp',
        label: 'Systolic BP ≤100 mmHg',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const rr = Number(v.rr),
        mental = Number(v.mental),
        sbp = Number(v.sbp);
      const score = rr + mental + sbp;
      const risk: CalculationResult['risk'] = score < 2 ? 'moderate' : 'high';
      const sepsisBanner =
        score >= 2
          ? '🚨 SEPSIS ALERT — qSOFA ≥2: Initiate 1-hour Surviving Sepsis Campaign bundle immediately.'
          : '';
      const interp =
        score >= 2
          ? 'HIGH RISK — qSOFA ≥2 indicates high risk of sepsis-associated organ dysfunction. Initiate full sepsis evaluation and 1-hour bundle.'
          : 'Low qSOFA — but clinical suspicion of infection still warrants monitoring. qSOFA <2 does not exclude sepsis.';
      return {
        label: 'qSOFA Score',
        value: score,
        unit: '/3',
        interpretation: `${sepsisBanner} ${interp}`,
        risk,
        riskPercentage:
          score >= 2
            ? 'High risk sepsis-associated organ dysfunction'
            : 'Low qSOFA — monitor closely',
        guidelineSource: 'Seymour CW et al. JAMA 2016 (Sepsis-3) / Surviving Sepsis Campaign 2021',
        scoreBreakdown: [
          { component: 'Respiratory Rate ≥22/min', score: rr, max: 1 },
          { component: 'Altered Mental Status', score: mental, max: 1 },
          { component: 'Systolic BP ≤100 mmHg', score: sbp, max: 1 },
          { component: 'TOTAL', score, max: 3 },
        ],
        details: [
          `qSOFA: ${score}/3`,
          score >= 2
            ? '🚨 1-HOUR SEPSIS BUNDLE: Blood cultures ×2 → Lactate → IV antibiotics → 30 mL/kg crystalloid'
            : '',
          '→ Blood cultures BEFORE antibiotics (within 45 minutes)',
          '→ Broad-spectrum antibiotics within 1 hour of sepsis recognition',
          '→ Lactate ≥4 mmol/L = septic shock — aggressive resuscitation',
          '→ Full SOFA score for ICU patients to quantify organ dysfunction',
          '⚠️ qSOFA sensitivity ~70% — negative score does not exclude sepsis',
        ].filter(Boolean),
      };
    },
  },
  // 4. APACHE II Score
  {
    id: 'apache-ii-score',
    name: 'APACHE II Score (ICU Severity)',
    category: 'Critical Care',
    icon: '📊',
    description:
      'Acute Physiology and Chronic Health Evaluation — predicts ICU mortality and severity of illness',
    formula: 'APS (12 physiologic variables) + Age points + Chronic health points = 0–71',
    reference: 'Knaus WA et al. Crit Care Med 1985 / SCCM ICU Guidelines',
    inputs: [
      {
        id: 'temp',
        label: 'Temperature (°C)',
        type: 'number',
        unit: '°C',
        min: 29,
        max: 45,
        step: 0.1,
        defaultValue: 37.0,
      },
      {
        id: 'map',
        label: 'Mean Arterial Pressure',
        type: 'number',
        unit: 'mmHg',
        min: 40,
        max: 200,
        defaultValue: 85,
      },
      {
        id: 'hr',
        label: 'Heart Rate',
        type: 'number',
        unit: 'bpm',
        min: 20,
        max: 250,
        defaultValue: 75,
      },
      {
        id: 'rr',
        label: 'Respiratory Rate',
        type: 'number',
        unit: '/min',
        min: 5,
        max: 80,
        defaultValue: 16,
      },
      {
        id: 'fio2',
        label: 'FiO₂',
        type: 'number',
        unit: '',
        min: 0.21,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.21,
      },
      {
        id: 'pao2',
        label: 'PaO₂',
        type: 'number',
        unit: 'mmHg',
        min: 40,
        max: 700,
        defaultValue: 95,
      },
      {
        id: 'ph',
        label: 'Arterial pH',
        type: 'number',
        unit: '',
        min: 6.8,
        max: 7.8,
        step: 0.01,
        defaultValue: 7.4,
      },
      {
        id: 'na',
        label: 'Sodium',
        type: 'number',
        unit: 'mEq/L',
        min: 110,
        max: 190,
        defaultValue: 140,
      },
      {
        id: 'creatinine',
        label: 'Creatinine',
        type: 'number',
        unit: 'mg/dL',
        min: 0.4,
        max: 15,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: 'hematocrit',
        label: 'Hematocrit',
        type: 'number',
        unit: '%',
        min: 10,
        max: 70,
        defaultValue: 40,
      },
      {
        id: 'wbc',
        label: 'WBC Count',
        type: 'number',
        unit: '×10³/μL',
        min: 0.1,
        max: 50,
        step: 0.1,
        defaultValue: 8,
      },
      {
        id: 'gcs',
        label: 'GCS Score',
        type: 'number',
        unit: '',
        min: 3,
        max: 15,
        defaultValue: 15,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 110,
        defaultValue: 50,
      },
      {
        id: 'chronic',
        label: 'Chronic Health (severe organ insufficiency/immunocompromise)',
        type: 'select',
        options: [
          { label: 'None (0 pts)', value: 0 },
          { label: 'Non-operative or emergency post-op (5 pts)', value: 5 },
          { label: 'Elective post-operative (2 pts)', value: 2 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const tempS = (t: number) =>
        t >= 41 || t <= 29 ? 4 : t >= 39 || t <= 31 ? 3 : t >= 38.5 || t <= 33 ? 1 : 0;
      const mapS = (m: number) =>
        m >= 160 || m <= 49 ? 4 : m >= 130 || m <= 50 ? 3 : m >= 110 || m <= 70 ? 2 : 0;
      const hrS = (h: number) =>
        h >= 180 || h <= 39 ? 4 : h >= 140 || h <= 40 ? 3 : h >= 110 || h <= 55 ? 2 : 0;
      const rrS = (r: number) =>
        r >= 50 || r <= 5 ? 4 : r >= 35 || r <= 6 ? 3 : r >= 25 || r <= 10 ? 1 : 0;
      const fio2 = Number(v.fio2),
        pao2 = Number(v.pao2);
      const oxyS =
        fio2 >= 0.5
          ? pao2 < 200
            ? 4
            : pao2 < 350
              ? 3
              : pao2 < 499
                ? 2
                : 0
          : pao2 < 55
            ? 4
            : pao2 < 61
              ? 3
              : pao2 < 71
                ? 1
                : 0;
      const phS = (p: number) =>
        p >= 7.7 || p < 7.15 ? 4 : p >= 7.6 || p < 7.25 ? 3 : p >= 7.5 || p < 7.33 ? 1 : 0;
      const naS = (n: number) =>
        n >= 180 || n <= 110 ? 4 : n >= 160 || n <= 120 ? 3 : n >= 155 || n <= 130 ? 2 : 0;
      const crS = (cr: number) =>
        cr >= 3.5 ? 4 : cr >= 2.0 ? 3 : cr >= 1.5 ? 2 : cr < 0.6 ? 2 : 0;
      const hctS = (h: number) => (h >= 60 || h < 20 ? 4 : h >= 50 || h < 30 ? 2 : 0);
      const wbcS = (w: number) => (w >= 40 || w < 1 ? 4 : w >= 20 || w < 3 ? 2 : 0);
      const gcsS = 15 - Number(v.gcs);
      const ageS =
        Number(v.age) < 45
          ? 0
          : Number(v.age) < 55
            ? 2
            : Number(v.age) < 65
              ? 3
              : Number(v.age) < 75
                ? 5
                : 6;
      const aps =
        tempS(Number(v.temp)) +
        mapS(Number(v.map)) +
        hrS(Number(v.hr)) +
        rrS(Number(v.rr)) +
        oxyS +
        phS(Number(v.ph)) +
        naS(Number(v.na)) +
        crS(Number(v.creatinine)) +
        hctS(Number(v.hematocrit)) +
        wbcS(Number(v.wbc)) +
        gcsS;
      const total = aps + ageS + Number(v.chronic);
      const mortality =
        total <= 4
          ? 4
          : total <= 9
            ? 8
            : total <= 14
              ? 15
              : total <= 19
                ? 25
                : total <= 24
                  ? 40
                  : total <= 29
                    ? 55
                    : total <= 34
                      ? 73
                      : 91;
      const risk: CalculationResult['risk'] =
        total <= 9 ? 'low' : total <= 19 ? 'moderate' : total <= 29 ? 'high' : 'critical';
      return {
        label: 'APACHE II Score',
        value: total,
        unit: '/71',
        interpretation: `Predicted ICU hospital mortality: ~${mortality}%. APS: ${aps}/60 + Age points: ${ageS} + Chronic health: ${Number(v.chronic)}.`,
        risk,
        riskPercentage: `Predicted ICU mortality: ~${mortality}%`,
        guidelineSource: 'Knaus WA et al. Crit Care Med 1985',
        scoreBreakdown: [
          { component: 'Acute Physiology Score (APS)', score: aps, max: 60 },
          { component: 'Age Points', score: ageS, max: 6 },
          { component: 'Chronic Health Points', score: Number(v.chronic), max: 5 },
          { component: 'APACHE II Total', score: total, max: 71 },
          { component: 'Predicted Mortality', score: mortality + '%' },
        ],
        details: [
          `APACHE II: ${total}/71 — Predicted mortality: ~${mortality}%`,
          `APS: ${aps}/60 | Age: ${ageS} pts | Chronic health: ${Number(v.chronic)} pts`,
          total >= 25 ? '→ Goals of care discussion with family/surrogate warranted' : '',
          total >= 30 ? '→ Palliative care team consultation recommended' : '',
          '→ Score uses worst 24-hour values — collect during first ICU day',
          '⚠️ Modern ICU treatments reduce actual mortality vs APACHE II estimates',
          '⚠️ GCS score before sedation — record pre-sedation GCS',
        ].filter(Boolean),
      };
    },
  },
  // 5. PECARN Head CT Decision Rule
  {
    id: 'pecarn-head-injury-tool',
    name: 'PECARN Pediatric Head CT Decision Rule',
    category: 'Critical Care',
    icon: '🧠',
    description:
      'Predict need for CT head in pediatric minor head trauma — validated in 42,000+ children',
    formula:
      'Age-stratified clinical decision rule (<2 years vs ≥2 years) — high sensitivity for clinically important TBI',
    reference: 'Kuppermann N et al. Lancet 2009 / PECARN Study Group',
    inputs: [
      {
        id: 'age_group',
        label: 'Age Group',
        type: 'select',
        options: [
          { label: '< 2 years (uses different criteria)', value: 'lt2' },
          { label: '≥ 2 years', value: 'gte2' },
        ],
        defaultValue: 'gte2',
      },
      {
        id: 'gcs14',
        label: 'GCS < 15 or altered mental status / behavior',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes — HIGH RISK', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'skull_fx',
        label: 'Palpable skull fracture (any age) OR signs of basilar skull fracture',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes — HIGH RISK', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'loss_consciousness',
        label: 'Loss of consciousness > 5 seconds',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes — intermediate risk', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'vomiting',
        label: 'Vomiting ≥2 episodes',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes — intermediate risk', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'severe_ha',
        label: 'Severe / worsening headache',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes — intermediate risk', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'mechanism',
        label: 'Severe mechanism (MVA, fall >1.5m, struck by high-impact object)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes — intermediate risk', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const highRisk = Number(v.gcs14) === 2 || Number(v.skull_fx) === 2;
      const modRisk =
        Number(v.loss_consciousness) > 0 ||
        Number(v.vomiting) > 0 ||
        Number(v.severe_ha) > 0 ||
        Number(v.mechanism) > 0;
      const risk: CalculationResult['risk'] = highRisk ? 'critical' : modRisk ? 'high' : 'low';
      const recommendation = highRisk
        ? 'CT Head Recommended — High-risk features present (>4% ciTBI risk)'
        : modRisk
          ? 'CT vs Observation — Shared decision-making (0.9% ciTBI risk)'
          : 'CT Not Indicated — Low risk (<0.05% ciTBI). Observation acceptable if reliable follow-up available.';
      return {
        label: 'PECARN Recommendation',
        value: highRisk ? 'CT Recommended' : modRisk ? 'CT vs Observation' : 'CT Not Indicated',
        interpretation: `${recommendation} PECARN has >99% sensitivity for clinically important TBI.`,
        risk,
        riskPercentage: highRisk
          ? '>4% risk of clinically important TBI'
          : modRisk
            ? '~0.9% risk of clinically important TBI'
            : '<0.05% risk of clinically important TBI',
        guidelineSource: 'Kuppermann N et al. Lancet 2009 / PECARN Study Group',
        scoreBreakdown: [
          {
            component: 'GCS <15 / Altered Mental Status',
            score: Number(v.gcs14) === 2 ? 'HIGH RISK' : 'No',
          },
          {
            component: 'Palpable / Basilar Skull Fracture',
            score: Number(v.skull_fx) === 2 ? 'HIGH RISK' : 'No',
          },
          {
            component: 'LOC >5 seconds',
            score: Number(v.loss_consciousness) > 0 ? 'Yes (intermediate)' : 'No',
          },
          {
            component: 'Vomiting ≥2 episodes',
            score: Number(v.vomiting) > 0 ? 'Yes (intermediate)' : 'No',
          },
          {
            component: 'Severe Headache',
            score: Number(v.severe_ha) > 0 ? 'Yes (intermediate)' : 'No',
          },
          {
            component: 'Severe Mechanism',
            score: Number(v.mechanism) > 0 ? 'Yes (intermediate)' : 'No',
          },
          {
            component: 'PECARN Decision',
            score: highRisk ? 'CT Recommended' : modRisk ? 'Shared decision' : 'CT Not Indicated',
          },
        ],
        details: [
          `PECARN: ${highRisk ? 'CT Head indicated (high-risk features)' : modRisk ? 'Shared decision — CT vs 4–6h observation' : 'CT not indicated — observation acceptable'}`,
          highRisk ? '🚨 High-risk features — CT head without contrast immediately' : '',
          modRisk
            ? '→ Shared decision: consider patient/family preference, physician experience, observation feasibility'
            : '',
          '→ Observation period: 4–6 hours with serial neurological checks',
          '→ Discharge instructions: return if worsening headache, vomiting >3×, seizure, altered behavior',
          '⚠️ PECARN applies to MINOR head injury (GCS 14–15) — not severe TBI',
          String(v.age_group) === 'lt2'
            ? '→ <2 years: scalp hematoma (non-frontal) is the strongest predictor'
            : '',
        ].filter(Boolean),
      };
    },
  },
  // 6. Glasgow Coma Scale
  {
    id: 'glasgow-coma-med',
    name: 'Glasgow Coma Scale (GCS)',
    category: 'Critical Care',
    icon: '🧠',
    description: 'Assess level of consciousness — document as E/V/M components, not just total',
    formula: 'GCS Total = Eye Opening (1–4) + Verbal Response (1–5) + Motor Response (1–6) = 3–15',
    reference: 'Teasdale G, Jennett B. Lancet 1974 / TBI Management Guidelines / ACS ATLS',
    inputs: [
      {
        id: 'eye',
        label: 'Eye Opening (E)',
        type: 'select',
        options: [
          { label: 'None — 1 pt (E1)', value: 1 },
          { label: 'To pain — 2 pts (E2)', value: 2 },
          { label: 'To voice — 3 pts (E3)', value: 3 },
          { label: 'Spontaneous — 4 pts (E4)', value: 4 },
        ],
        defaultValue: 4,
      },
      {
        id: 'verbal',
        label: 'Verbal Response (V)',
        type: 'select',
        options: [
          { label: 'None — 1 pt (V1)', value: 1 },
          { label: 'Sounds only — 2 pts (V2)', value: 2 },
          { label: 'Words only — 3 pts (V3)', value: 3 },
          { label: 'Confused — 4 pts (V4)', value: 4 },
          { label: 'Oriented — 5 pts (V5)', value: 5 },
        ],
        defaultValue: 5,
      },
      {
        id: 'motor',
        label: 'Motor Response (M)',
        type: 'select',
        options: [
          { label: 'None — 1 pt (M1)', value: 1 },
          { label: 'Extension (decerebrate) — 2 pts (M2)', value: 2 },
          { label: 'Flexion (decorticate) — 3 pts (M3)', value: 3 },
          { label: 'Withdrawal — 4 pts (M4)', value: 4 },
          { label: 'Localizes pain — 5 pts (M5)', value: 5 },
          { label: 'Obeys commands — 6 pts (M6)', value: 6 },
        ],
        defaultValue: 6,
      },
    ],
    calculate(v) {
      const eye = Number(v.eye),
        verbal = Number(v.verbal),
        motor = Number(v.motor);
      const gcs = eye + verbal + motor;
      const risk: CalculationResult['risk'] =
        gcs >= 13 ? 'low' : gcs >= 9 ? 'moderate' : gcs >= 6 ? 'high' : 'critical';
      const severity = gcs >= 13 ? 'Mild TBI' : gcs >= 9 ? 'Moderate TBI' : 'Severe TBI';
      const airway =
        gcs <= 8 ? '⚠️ GCS ≤8 — standard threshold for intubation (airway at risk)' : '';
      return {
        label: 'GCS Total',
        value: gcs,
        unit: '/15',
        interpretation: `E${eye}V${verbal}M${motor} = ${gcs}/15. ${severity}. ${airway}`,
        risk,
        riskPercentage:
          gcs <= 8
            ? 'Severe TBI — intubation threshold'
            : gcs <= 12
              ? 'Moderate TBI — close monitoring'
              : undefined,
        guidelineSource: 'Teasdale G & Jennett B. Lancet 1974 / ACS ATLS 10th Edition',
        scoreBreakdown: [
          { component: 'Eye Opening (E)', score: eye, max: 4 },
          { component: 'Verbal Response (V)', score: verbal, max: 5 },
          { component: 'Motor Response (M)', score: motor, max: 6 },
          { component: 'GCS Total', score: gcs, max: 15 },
          { component: 'Severity', score: severity },
        ],
        details: [
          `GCS: E${eye}V${verbal}M${motor} = ${gcs}/15 — ${severity}`,
          gcs <= 8 ? '🚨 GCS ≤8 — consider RSI intubation for airway protection' : '',
          gcs <= 8 ? '→ Neurosurgery consult + CT head + ICP monitoring' : '',
          gcs <= 12 ? '→ Continuous neurological monitoring; CT head immediately' : '',
          '⚠️ Always document as E_V_M_ (not just total) — GCS 8 = E2V2M4 ≠ E4V1M3',
          '⚠️ Intubated patients: record verbal as "T" (e.g., E3VTM5)',
          '⚠️ Sedation, alcohol, metabolic encephalopathy lower GCS without structural injury — note context',
          '→ Avoid hypotension (SBP <90) and hypoxia (SpO₂ <94%) — worsen TBI outcome',
        ].filter(Boolean),
      };
    },
  },
  // 7. SOFA Score
  {
    id: 'sofa-sepsis-med',
    name: 'SOFA Score (Sequential Organ Failure Assessment)',
    category: 'Critical Care',
    icon: '🏥',
    description:
      'Quantify organ dysfunction in ICU patients — defines sepsis when SOFA rises ≥2 from baseline with suspected infection',
    formula:
      'PaO₂/FiO₂ + Platelets + Bilirubin + Cardiovascular + CNS (GCS) + Renal (Cr/UO) — each 0–4, total 0–24',
    reference: 'Vincent JL et al. Intensive Care Med 1996 / Sepsis-3 Singer M et al. JAMA 2016',
    inputs: [
      {
        id: 'pf_ratio',
        label: 'PaO₂/FiO₂ Ratio',
        type: 'number',
        unit: 'mmHg',
        min: 20,
        max: 600,
        defaultValue: 400,
      },
      {
        id: 'platelets',
        label: 'Platelet Count',
        type: 'number',
        unit: '×10³/μL',
        min: 5,
        max: 600,
        defaultValue: 200,
      },
      {
        id: 'bilirubin',
        label: 'Bilirubin',
        type: 'number',
        unit: 'mg/dL',
        min: 0.1,
        max: 30,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: 'map',
        label: 'Cardiovascular (MAP / vasopressor support)',
        type: 'select',
        options: [
          { label: 'MAP ≥70 mmHg — 0 pts', value: 0 },
          { label: 'MAP <70 mmHg — 1 pt', value: 1 },
          { label: 'Dopamine ≤5 or dobutamine — 2 pts', value: 2 },
          { label: 'Dopamine >5 or Epi/NE ≤0.1 — 3 pts', value: 3 },
          { label: 'Dopamine >15 or Epi/NE >0.1 — 4 pts', value: 4 },
        ],
        defaultValue: 0,
      },
      {
        id: 'gcs',
        label: 'GCS Score (CNS)',
        type: 'number',
        unit: '',
        min: 3,
        max: 15,
        defaultValue: 15,
      },
      {
        id: 'creatinine',
        label: 'Creatinine (or urine output)',
        type: 'number',
        unit: 'mg/dL',
        min: 0.4,
        max: 20,
        step: 0.1,
        defaultValue: 1.0,
      },
    ],
    calculate(v) {
      const pf = Number(v.pf_ratio),
        plt = Number(v.platelets),
        bili = Number(v.bilirubin);
      const gcs = Number(v.gcs),
        cr = Number(v.creatinine),
        cv = Number(v.map);
      const pfS = pf >= 400 ? 0 : pf >= 300 ? 1 : pf >= 200 ? 2 : pf >= 100 ? 3 : 4;
      const pltS = plt >= 150 ? 0 : plt >= 100 ? 1 : plt >= 50 ? 2 : plt >= 20 ? 3 : 4;
      const biliS = bili < 1.2 ? 0 : bili < 2 ? 1 : bili < 6 ? 2 : bili < 12 ? 3 : 4;
      const gcsS = gcs >= 15 ? 0 : gcs >= 13 ? 1 : gcs >= 10 ? 2 : gcs >= 6 ? 3 : 4;
      const crS = cr < 1.2 ? 0 : cr < 2 ? 1 : cr < 3.5 ? 2 : cr < 5 ? 3 : 4;
      const total = pfS + pltS + biliS + cv + gcsS + crS;
      const risk: CalculationResult['risk'] =
        total <= 6 ? 'low' : total <= 9 ? 'moderate' : total <= 11 ? 'high' : 'critical';
      const mortality =
        total <= 6 ? '<10%' : total <= 9 ? '15–20%' : total <= 11 ? '40–50%' : '>50–60%';
      const sepsisCriteria =
        total >= 2 ? 'SOFA ≥2 with suspected infection = SEPSIS (Sepsis-3 criteria met)' : '';
      return {
        label: 'SOFA Score',
        value: total,
        unit: '/24',
        interpretation: `Predicted mortality: ~${mortality}. ${sepsisCriteria}`,
        risk,
        riskPercentage: `Predicted ICU mortality: ~${mortality}`,
        guidelineSource: 'Sepsis-3 Singer M et al. JAMA 2016 / Surviving Sepsis Campaign 2021',
        scoreBreakdown: [
          { component: 'Respiratory (PaO₂/FiO₂)', score: pfS, max: 4 },
          { component: 'Coagulation (Platelets)', score: pltS, max: 4 },
          { component: 'Liver (Bilirubin)', score: biliS, max: 4 },
          { component: 'Cardiovascular (MAP/vasopressors)', score: cv, max: 4 },
          { component: 'CNS (GCS)', score: gcsS, max: 4 },
          { component: 'Renal (Creatinine/UO)', score: crS, max: 4 },
          { component: 'TOTAL SOFA', score: total, max: 24 },
        ],
        details: [
          `SOFA: ${total}/24 — Predicted mortality: ~${mortality}`,
          `Component breakdown: Resp:${pfS} Coag:${pltS} Liver:${biliS} CV:${cv} CNS:${gcsS} Renal:${crS}`,
          total >= 2
            ? '🚨 SOFA ≥2 with suspected infection = Sepsis-3 definition met — initiate sepsis bundle'
            : '',
          '→ Surviving Sepsis Campaign 1-hour bundle: cultures → lactate → antibiotics → fluids',
          '→ Norepinephrine first-line vasopressor for MAP <65 mmHg despite fluid resuscitation',
          '→ Hydrocortisone 200mg/day if vasopressor-dependent after adequate resuscitation',
          '→ Reassess SOFA daily — rising score indicates deterioration; falling indicates improvement',
          '⚠️ Sedation confounds CNS SOFA component — score GCS before sedation initiation',
        ].filter(Boolean),
      };
    },
  },
  // 8. Anion Gap
  {
    id: 'anion-gap-med',
    name: 'Anion Gap with Albumin Correction',
    category: 'Critical Care',
    icon: '⚗️',
    description:
      'Calculate serum anion gap with albumin correction and delta-delta ratio for mixed disorders',
    formula:
      'AG = Na⁺ − (Cl⁻ + HCO₃⁻) | Corrected AG = AG + 2.5×(4.0 − Albumin) | Delta-Delta = (AG−12)/(24−HCO₃)',
    reference: 'Emmett M, Narins RG. Medicine 1977 / Winters formula / MUDPILES mnemonic',
    inputs: [
      {
        id: 'na',
        label: 'Sodium (Na⁺)',
        type: 'number',
        unit: 'mEq/L',
        min: 110,
        max: 175,
        defaultValue: 140,
      },
      {
        id: 'cl',
        label: 'Chloride (Cl⁻)',
        type: 'number',
        unit: 'mEq/L',
        min: 70,
        max: 130,
        defaultValue: 102,
      },
      {
        id: 'hco3',
        label: 'Bicarbonate (HCO₃⁻)',
        type: 'number',
        unit: 'mEq/L',
        min: 5,
        max: 45,
        defaultValue: 24,
      },
      {
        id: 'albumin',
        label: 'Serum Albumin',
        type: 'number',
        unit: 'g/dL',
        min: 0.5,
        max: 6,
        step: 0.1,
        defaultValue: 4.0,
      },
    ],
    calculate(v) {
      const na = Number(v.na),
        cl = Number(v.cl),
        hco3 = Number(v.hco3),
        alb = Number(v.albumin);
      const ag = na - (cl + hco3);
      const corrAG = ag + 2.5 * (4.0 - alb);
      const deltaAG = corrAG - 12;
      const deltaHCO3 = 24 - hco3;
      const deltaDelta = deltaHCO3 > 0 ? deltaAG / deltaHCO3 : 0;
      const risk: CalculationResult['risk'] =
        corrAG <= 12 ? 'low' : corrAG <= 20 ? 'moderate' : 'high';
      const agInterp =
        corrAG <= 12
          ? 'Normal AG — evaluate for non-anion gap metabolic acidosis (NAGMA)'
          : corrAG <= 20
            ? 'Mildly elevated AG — identify cause'
            : corrAG <= 30
              ? 'Moderately elevated AG — urgent evaluation (MUDPILES)'
              : 'Severely elevated AG — critical (toxic ingestion, severe lactic acidosis, DKA?)';
      let deltaDeltaInterp = '';
      if (corrAG > 12) {
        if (deltaDelta < 1)
          deltaDeltaInterp = 'Delta-delta <1 — Mixed AGMA + NAGMA (additional HCO₃⁻ loss)';
        else if (deltaDelta <= 2) deltaDeltaInterp = 'Delta-delta 1–2 — Pure AGMA';
        else
          deltaDeltaInterp =
            'Delta-delta >2 — Mixed AGMA + Metabolic Alkalosis (pre-existing HCO₃⁻ elevation)';
      }
      return {
        label: 'Anion Gap',
        value: ag,
        unit: 'mEq/L',
        interpretation: `Albumin-corrected AG: ${corrAG.toFixed(1)} mEq/L. ${agInterp}. ${deltaDeltaInterp}`,
        risk,
        riskPercentage:
          corrAG > 12
            ? `AGMA — corrected AG ${corrAG.toFixed(1)} mEq/L`
            : 'NAGMA — normal anion gap',
        guidelineSource: 'Emmett M, Narins RG. Medicine 1977',
        scoreBreakdown: [
          { component: 'Sodium (Na⁺)', score: na + ' mEq/L' },
          { component: 'Chloride (Cl⁻)', score: cl + ' mEq/L' },
          { component: 'Bicarbonate (HCO₃⁻)', score: hco3 + ' mEq/L' },
          { component: 'Raw Anion Gap', score: ag + ' mEq/L' },
          {
            component: 'Albumin Correction (+2.5×[4−alb])',
            score: '+' + (2.5 * (4 - alb)).toFixed(1) + ' mEq/L',
          },
          { component: 'Albumin-Corrected AG', score: corrAG.toFixed(1) + ' mEq/L (normal 8–12)' },
          {
            component: 'Delta-Delta Ratio',
            score:
              deltaDelta.toFixed(2) +
              (corrAG > 12 ? ' — ' + deltaDeltaInterp.split('—')[0].trim() : ''),
          },
        ],
        details: [
          `AG: ${ag} mEq/L | Corrected AG: ${corrAG.toFixed(1)} mEq/L`,
          corrAG > 12
            ? `AGMA causes (MUDPILES): Methanol, Uremia, DKA, Propylene glycol, INH/Iron, Lactic acidosis, Ethylene glycol, Salicylates`
            : '',
          corrAG > 12
            ? `Delta-delta: ${deltaDelta.toFixed(2)} — ${deltaDeltaInterp}`
            : 'Normal AG — check for NAGMA: diarrhea, RTA, ureteral diversion',
          '⚠️ Hypoalbuminemia masks elevated AG — always albumin-correct',
          '→ Serum lactate for AGMA evaluation; osmolal gap for toxic alcohol ingestion',
          corrAG > 20 ? '→ Urgent: toxicology screen, serum ketones, lactate, osmolal gap' : '',
        ].filter(Boolean),
      };
    },
  },
  // 9. Wells Score DVT/PE
  {
    id: 'wells-score-med',
    name: 'Wells Score (DVT / Pre-Test Probability)',
    category: 'Critical Care',
    icon: '🩸',
    description:
      'Estimate pre-test probability of deep vein thrombosis (DVT) to guide D-dimer vs imaging decisions',
    formula: 'Sum of clinical criteria points (−2 to +9) — three probability groups',
    reference: 'Wells PS et al. Ann Intern Med 1998 / ASH VTE Guidelines 2020',
    inputs: [
      {
        id: 'cancer',
        label: 'Active malignancy (treatment within 6 months or palliation)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'immobile',
        label: 'Paralysis, paresis, or recent plaster immobilization of leg',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'bedridden',
        label: 'Bedridden >3 days OR major surgery in past 12 weeks',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'tenderness',
        label: 'Localized tenderness along deep venous system',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'leg_swelling',
        label: 'Entire leg swollen',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'calf',
        label: 'Calf swelling >3 cm compared to other leg',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'pitting',
        label: 'Pitting oedema (symptomatic leg only)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'collateral',
        label: 'Collateral superficial veins (non-varicose)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'alt_dx',
        label: 'Alternative diagnosis as likely or more likely than DVT',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — SUBTRACT 2 pts', value: -2 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const keys = [
        'cancer',
        'immobile',
        'bedridden',
        'tenderness',
        'leg_swelling',
        'calf',
        'pitting',
        'collateral',
        'alt_dx',
      ];
      const score = keys.reduce((s, k) => s + Number(v[k]), 0);
      const risk: CalculationResult['risk'] = score <= 0 ? 'low' : score <= 2 ? 'moderate' : 'high';
      const DVT_PREV = score <= 0 ? '~5%' : score <= 2 ? '~17%' : '~53%';
      const category =
        score <= 0
          ? 'Low probability (Wells ≤0)'
          : score <= 2
            ? 'Moderate probability (Wells 1–2)'
            : 'High probability (Wells ≥3)';
      const action =
        score <= 0
          ? 'D-dimer testing; if negative — DVT excluded (NPV >98%)'
          : score <= 2
            ? 'High-sensitivity D-dimer or compression ultrasound'
            : 'Compression ultrasound immediately — start anticoagulation if positive';
      return {
        label: 'Wells DVT Score',
        value: score,
        interpretation: `${category}. DVT prevalence: ${DVT_PREV}. Action: ${action}.`,
        risk,
        riskPercentage: `DVT pre-test probability: ${DVT_PREV}`,
        guidelineSource: 'Wells PS et al. Ann Intern Med 1998 / ASH VTE Guidelines 2020',
        scoreBreakdown: [
          { component: 'Active Cancer', score: Number(v.cancer), max: 1 },
          { component: 'Immobility/Paralysis', score: Number(v.immobile), max: 1 },
          { component: 'Bedridden/Recent Surgery', score: Number(v.bedridden), max: 1 },
          { component: 'DVT Tenderness', score: Number(v.tenderness), max: 1 },
          { component: 'Entire Leg Swollen', score: Number(v.leg_swelling), max: 1 },
          { component: 'Calf Swelling >3cm', score: Number(v.calf), max: 1 },
          { component: 'Pitting Oedema', score: Number(v.pitting), max: 1 },
          { component: 'Collateral Veins', score: Number(v.collateral), max: 1 },
          { component: 'Alternative Diagnosis', score: Number(v.alt_dx), max: 0 },
          { component: 'TOTAL', score, max: 9 },
        ],
        details: [
          `Wells DVT Score: ${score} — ${category} (prevalence: ${DVT_PREV})`,
          `Action: ${action}`,
          '→ Age-adjusted D-dimer threshold (age >50): age × 10 μg/L — improves specificity',
          '→ Proximal DVT: higher risk of PE than distal/calf DVT',
          '→ Anticoagulation: DOAC (rivaroxaban, apixaban) preferred over LMWH+warfarin',
          '→ Duration: 3 months for provoked DVT; longer for unprovoked or recurrent',
          '⚠️ D-dimer elevated by many conditions — low specificity; use to rule OUT, not IN',
        ],
      };
    },
  },
  // 10. CURB-65
  {
    id: 'curb65-med',
    name: 'CURB-65 Pneumonia Severity Score',
    category: 'Critical Care',
    icon: '🫁',
    description:
      'Predict 30-day mortality in community-acquired pneumonia and guide site-of-care decisions',
    formula:
      'Confusion(1) + Urea >19mg/dL(1) + RR ≥30/min(1) + BP <90/60mmHg(1) + Age ≥65(1) = 0–5',
    reference: 'Lim WS et al. Thorax 2003 / IDSA/ATS CAP Guidelines 2019',
    inputs: [
      {
        id: 'confusion',
        label: 'Confusion (new disorientation to person, place, or time)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'urea',
        label: 'Urea >7 mmol/L (BUN >19 mg/dL)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'rr',
        label: 'Respiratory Rate ≥30 breaths/min',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'bp',
        label: 'SBP <90 mmHg OR DBP ≤60 mmHg',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'age65',
        label: 'Age ≥ 65 years',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const conf = Number(v.confusion),
        urea = Number(v.urea),
        rr = Number(v.rr),
        bp = Number(v.bp),
        age = Number(v.age65);
      const score = conf + urea + rr + bp + age;
      const risk: CalculationResult['risk'] = score <= 1 ? 'low' : score <= 2 ? 'moderate' : 'high';
      const MORT: { [k: number]: number } = { 0: 0.7, 1: 3.2, 2: 13, 3: 17, 4: 41.5, 5: 57 };
      const mortality = MORT[score] ?? 57;
      const siteOfCare =
        score <= 1
          ? 'Outpatient treatment (low risk — mortality <3%)'
          : score === 2
            ? 'Short-stay hospitalization or close outpatient follow-up (mortality ~13%)'
            : score <= 4
              ? 'Inpatient hospitalization (mortality 17–41%)'
              : 'ICU admission strongly recommended (mortality 57%)';
      const antibiotics =
        score <= 1
          ? 'Oral amoxicillin ± doxycycline or macrolide'
          : score <= 2
            ? 'Oral/IV amoxicillin-clavulanate or respiratory fluoroquinolone'
            : 'IV beta-lactam + macrolide or respiratory fluoroquinolone (monotherapy)';
      return {
        label: 'CURB-65 Score',
        value: score,
        unit: '/5',
        interpretation: `30-day mortality: ~${mortality}%. Site of care: ${siteOfCare}.`,
        risk,
        riskPercentage: `30-day mortality: ~${mortality}%`,
        guidelineSource: 'Lim WS et al. Thorax 2003 / IDSA/ATS CAP Guidelines 2019',
        scoreBreakdown: [
          { component: 'Confusion', score: conf, max: 1 },
          { component: 'Urea >19 mg/dL (BUN)', score: urea, max: 1 },
          { component: 'Respiratory Rate ≥30', score: rr, max: 1 },
          { component: 'Low BP (<90/60)', score: bp, max: 1 },
          { component: 'Age ≥ 65', score: age, max: 1 },
          { component: 'TOTAL', score, max: 5 },
          { component: '30-Day Mortality', score: mortality + '%' },
        ],
        details: [
          `CURB-65: ${score}/5 — 30-day mortality: ~${mortality}%`,
          `Site of care: ${siteOfCare}`,
          `Antibiotic guidance: ${antibiotics}`,
          '→ Blood cultures ×2 before antibiotics if hospitalizing',
          '→ Urinary Legionella and pneumococcal antigen for CURB ≥3',
          '→ SpO₂ monitoring; O₂ to maintain ≥94% (88–92% for COPD)',
          '⚠️ BUN (US labs) >19 mg/dL ≈ urea (UK labs) >7 mmol/L',
          '⚠️ PSI/PORT score more accurate for low-risk stratification; use CURB-65 for simplicity',
        ],
      };
    },
  },
  // 11. Burn Surface Area (Rule of 9s + Parkland)
  {
    id: 'burn-surface-area-med',
    name: 'Burn Surface Area (Rule of 9s) + Parkland Formula',
    category: 'Critical Care',
    icon: '🔥',
    description:
      'Estimate total body surface area (TBSA) burned and calculate Parkland fluid resuscitation volume',
    formula:
      'Rule of 9s: Head 9%, each arm 9%, trunk 36%, each leg 18%, perineum 1% | Parkland: 4 mL × kg × %TBSA in 24h',
    reference:
      'Wallace AB. Br J Plast Surg 1951 / Baxter CR. Surg Clin North Am 1978 / ABA Guidelines',
    inputs: [
      {
        id: 'head',
        label: 'Head & Neck',
        type: 'number',
        unit: '%',
        min: 0,
        max: 9,
        defaultValue: 0,
      },
      {
        id: 'chest',
        label: 'Chest (anterior)',
        type: 'number',
        unit: '%',
        min: 0,
        max: 9,
        defaultValue: 0,
      },
      {
        id: 'abdomen',
        label: 'Abdomen (anterior)',
        type: 'number',
        unit: '%',
        min: 0,
        max: 9,
        defaultValue: 0,
      },
      {
        id: 'upper_back',
        label: 'Upper Back (posterior trunk)',
        type: 'number',
        unit: '%',
        min: 0,
        max: 9,
        defaultValue: 0,
      },
      {
        id: 'lower_back',
        label: 'Lower Back (posterior trunk)',
        type: 'number',
        unit: '%',
        min: 0,
        max: 9,
        defaultValue: 0,
      },
      {
        id: 'r_arm',
        label: 'Right Arm (entire)',
        type: 'number',
        unit: '%',
        min: 0,
        max: 9,
        defaultValue: 0,
      },
      {
        id: 'l_arm',
        label: 'Left Arm (entire)',
        type: 'number',
        unit: '%',
        min: 0,
        max: 9,
        defaultValue: 0,
      },
      {
        id: 'r_leg',
        label: 'Right Leg (entire)',
        type: 'number',
        unit: '%',
        min: 0,
        max: 18,
        defaultValue: 0,
      },
      {
        id: 'l_leg',
        label: 'Left Leg (entire)',
        type: 'number',
        unit: '%',
        min: 0,
        max: 18,
        defaultValue: 0,
      },
      {
        id: 'perineum',
        label: 'Perineum / Genitalia',
        type: 'number',
        unit: '%',
        min: 0,
        max: 1,
        defaultValue: 0,
      },
      {
        id: 'weight',
        label: 'Patient Body Weight',
        type: 'number',
        unit: 'kg',
        min: 5,
        max: 300,
        defaultValue: 70,
      },
    ],
    calculate(v) {
      const areas = [
        'head',
        'chest',
        'abdomen',
        'upper_back',
        'lower_back',
        'r_arm',
        'l_arm',
        'r_leg',
        'l_leg',
        'perineum',
      ];
      const tbsa = Math.min(
        100,
        areas.reduce((s, k) => s + Number(v[k]), 0)
      );
      const wt = Number(v.weight);
      const parkland = 4 * wt * tbsa;
      const first8h = parkland / 2;
      const next16h = parkland / 2;
      const risk: CalculationResult['risk'] =
        tbsa < 10 ? 'low' : tbsa < 20 ? 'moderate' : tbsa < 40 ? 'high' : 'critical';
      const severity =
        tbsa < 10
          ? 'Minor burns'
          : tbsa < 20
            ? 'Moderate burns — hospital admission'
            : tbsa < 40
              ? 'Major burns — consider burn centre transfer'
              : 'Life-threatening burns — urgent burn centre transfer';
      return {
        label: 'TBSA Burned',
        value: tbsa.toFixed(0),
        unit: '%',
        interpretation: `${severity}. Parkland resuscitation: ${parkland.toFixed(0)} mL LR in 24h (${first8h.toFixed(0)} mL in first 8h from TIME OF BURN, ${next16h.toFixed(0)} mL over next 16h). Target UO: 0.5–1 mL/kg/hr.`,
        risk,
        riskPercentage: `TBSA: ${tbsa.toFixed(0)}% — ${severity}`,
        guidelineSource: 'Baxter CR. Surg Clin North Am 1978 / ABA Guidelines',
        scoreBreakdown: [
          { component: 'Head & Neck', score: Number(v.head) + '%' },
          { component: 'Anterior Trunk', score: Number(v.chest) + Number(v.abdomen) + '%' },
          {
            component: 'Posterior Trunk',
            score: Number(v.upper_back) + Number(v.lower_back) + '%',
          },
          { component: 'Arms (R+L)', score: Number(v.r_arm) + Number(v.l_arm) + '%' },
          { component: 'Legs (R+L)', score: Number(v.r_leg) + Number(v.l_leg) + '%' },
          { component: 'Perineum', score: Number(v.perineum) + '%' },
          { component: 'TOTAL TBSA', score: tbsa.toFixed(0) + '%' },
          { component: 'Parkland Total Volume', score: parkland.toFixed(0) + ' mL LR in 24h' },
          { component: 'First 8 hours', score: first8h.toFixed(0) + ' mL LR' },
          { component: 'Next 16 hours', score: next16h.toFixed(0) + ' mL LR' },
        ],
        details: [
          `TBSA: ${tbsa.toFixed(0)}% burned | Parkland volume: ${parkland.toFixed(0)} mL LR in 24h`,
          `First 8h (from time of burn): ${first8h.toFixed(0)} mL | Next 16h: ${next16h.toFixed(0)} mL`,
          '→ AIRWAY FIRST: singed nasal hair / hoarseness / stridor = inhalation injury — intubate early',
          '→ Insert foley catheter — target UO 0.5–1 mL/kg/hr',
          '→ IV access ×2 large-bore peripheral or IO; weigh patient for accurate Parkland calculation',
          tbsa >= 20
            ? '→ Transfer to ABA-verified burn centre: TBSA ≥20%, full-thickness, face/hands/feet/genitalia/major joints'
            : '',
          '⚠️ 8h countdown from TIME OF BURN — not time of admission',
          '⚠️ Parkland is a starting estimate — titrate to urine output every 1–2 hours',
          '⚠️ Lund-Browder chart more accurate for children — Rule of 9s underestimates pediatric head',
          '→ Superficial (first-degree) burns excluded from TBSA calculation',
        ].filter(Boolean),
      };
    },
  },
];

export const psychiatryConfigs: MedicalConfig[] = [
  // 1. PHQ-9 Depression Screen
  {
    id: 'phq9-med',
    name: 'PHQ-9 Depression Screening',
    category: 'Psychiatry',
    icon: '🧠',
    description:
      'Patient Health Questionnaire-9 — validated depression severity screening and treatment monitoring tool',
    formula:
      'Sum of 9 items (0=Not at all, 1=Several days, 2=More than half, 3=Nearly every day) = 0–27',
    reference: 'Kroenke K, Spitzer RL. Gen Hosp Psychiatry 2002 / APA Practice Guidelines 2022',
    inputs: Array.from({ length: 9 }, (_, i) => ({
      id: `q${i + 1}`,
      label: [
        'Little interest or pleasure in doing things',
        'Feeling down, depressed, or hopeless',
        'Trouble falling/staying asleep or sleeping too much',
        'Feeling tired or having little energy',
        'Poor appetite or overeating',
        'Feeling bad about yourself — or that you are a failure',
        'Trouble concentrating on things (reading, TV)',
        'Moving/speaking so slowly OR being fidgety/restless',
        'Thoughts that you would be better off dead or of hurting yourself',
      ][i],
      type: 'select' as const,
      options: [
        { label: 'Not at all — 0 pts', value: 0 },
        { label: 'Several days — 1 pt', value: 1 },
        { label: 'More than half the days — 2 pts', value: 2 },
        { label: 'Nearly every day — 3 pts', value: 3 },
      ],
      defaultValue: 0,
    })),
    calculate(v) {
      const items = Array.from({ length: 9 }, (_, i) => Number(v[`q${i + 1}`]));
      const score = items.reduce((a, b) => a + b, 0);
      const q9 = Number(v.q9);
      const risk: CalculationResult['risk'] =
        score < 5 ? 'low' : score < 10 ? 'moderate' : score < 15 ? 'high' : 'critical';
      const severity =
        score < 5
          ? 'Minimal depression'
          : score < 10
            ? 'Mild depression'
            : score < 15
              ? 'Moderate depression'
              : score < 20
                ? 'Moderately severe depression'
                : 'Severe depression';
      const action =
        score < 5
          ? 'Watchful waiting; repeat PHQ-9 in 3–6 months'
          : score < 10
            ? 'Watchful waiting + support; rescreen in 2–4 weeks'
            : score < 15
              ? 'Treatment recommended: CBT and/or SSRI; reassess in 4–6 weeks'
              : score < 20
                ? 'Initiate SSRI + refer for psychotherapy; reassess in 4 weeks'
                : 'Urgent psychiatric evaluation; consider immediate safety assessment';
      const siAlert =
        q9 > 0
          ? `
🚨 SAFETY ALERT: Item 9 scored ${q9}/3 — Direct clinical assessment of suicidal ideation required immediately.`
          : '';
      return {
        label: 'PHQ-9 Score',
        value: score,
        unit: '/27',
        interpretation: `${severity} (score ${score}/27). ${action}.${siAlert}`,
        risk,
        riskPercentage: `${severity} — ${action.split(';')[0]}`,
        guidelineSource: 'APA Practice Guidelines 2022 / Kroenke K & Spitzer RL 2002',
        scoreBreakdown: [
          { component: 'Q1 — Anhedonia', score: Number(v.q1), max: 3 },
          { component: 'Q2 — Depressed mood', score: Number(v.q2), max: 3 },
          { component: 'Q3 — Sleep disturbance', score: Number(v.q3), max: 3 },
          { component: 'Q4 — Fatigue', score: Number(v.q4), max: 3 },
          { component: 'Q5 — Appetite change', score: Number(v.q5), max: 3 },
          { component: 'Q6 — Self-worth', score: Number(v.q6), max: 3 },
          { component: 'Q7 — Concentration', score: Number(v.q7), max: 3 },
          { component: 'Q8 — Psychomotor change', score: Number(v.q8), max: 3 },
          { component: 'Q9 — Suicidal ideation', score: q9, max: 3 },
          { component: 'TOTAL', score, max: 27 },
        ],
        details: [
          `PHQ-9: ${score}/27 — ${severity}`,
          `Recommended action: ${action}`,
          q9 > 0 ? `🚨 Item 9 (SI) = ${q9}/3 — Direct suicide risk assessment required NOW` : '',
          '→ PHQ-9 is a screening tool — not diagnostic; requires clinical interview for MDD diagnosis (DSM-5)',
          '→ Screen for bipolar disorder (MDQ) before initiating antidepressant monotherapy',
          '→ A reduction of ≥5 points = clinically meaningful treatment response',
          '→ TSH to exclude hypothyroidism mimicking depression',
          '→ Repeat PHQ-9 at 4–6-week intervals to monitor treatment response',
        ].filter(Boolean),
      };
    },
  },
  // 2. GAD-7 Anxiety Score
  {
    id: 'gad7-anxiety-score',
    name: 'GAD-7 Generalized Anxiety Disorder Screen',
    category: 'Psychiatry',
    icon: '😰',
    description:
      'Generalized Anxiety Disorder 7-item scale — validated screening and severity monitoring tool',
    formula:
      'Sum of 7 items (0=Not at all, 1=Several days, 2=More than half, 3=Nearly every day) = 0–21',
    reference: 'Spitzer RL et al. Arch Intern Med 2006 / APA Anxiety Guidelines 2023',
    inputs: Array.from({ length: 7 }, (_, i) => ({
      id: `q${i + 1}`,
      label: [
        'Feeling nervous, anxious, or on edge',
        'Not being able to stop or control worrying',
        'Worrying too much about different things',
        'Trouble relaxing',
        'Being so restless that it is hard to sit still',
        'Becoming easily annoyed or irritable',
        'Feeling afraid, as if something awful might happen',
      ][i],
      type: 'select' as const,
      options: [
        { label: 'Not at all — 0 pts', value: 0 },
        { label: 'Several days — 1 pt', value: 1 },
        { label: 'More than half the days — 2 pts', value: 2 },
        { label: 'Nearly every day — 3 pts', value: 3 },
      ],
      defaultValue: 0,
    })),
    calculate(v) {
      const score = Array.from({ length: 7 }, (_, i) => Number(v[`q${i + 1}`])).reduce(
        (a, b) => a + b,
        0
      );
      const risk: CalculationResult['risk'] =
        score < 5 ? 'low' : score < 10 ? 'moderate' : score < 15 ? 'high' : 'critical';
      const severity =
        score < 5
          ? 'Minimal anxiety'
          : score < 10
            ? 'Mild anxiety'
            : score < 15
              ? 'Moderate anxiety'
              : 'Severe anxiety';
      const action =
        score < 5
          ? 'Reassurance; lifestyle advice (exercise, sleep, caffeine reduction)'
          : score < 10
            ? 'Watchful waiting; relaxation techniques; rescreen in 2–4 weeks'
            : score < 15
              ? 'CBT psychotherapy recommended; consider SSRI/SNRI'
              : 'Psychiatric referral; initiate SSRI (e.g., sertraline 50mg); consider short-term benzodiazepine for acute distress';
      return {
        label: 'GAD-7 Score',
        value: score,
        unit: '/21',
        interpretation: `${severity} (score ${score}/21). ${action}.`,
        risk,
        riskPercentage: `${severity} — score ${score}/21`,
        guidelineSource: 'Spitzer RL et al. Arch Intern Med 2006 / APA Anxiety Guidelines 2023',
        scoreBreakdown: [
          { component: 'Q1 — Feeling nervous/anxious', score: Number(v.q1), max: 3 },
          { component: 'Q2 — Uncontrollable worry', score: Number(v.q2), max: 3 },
          { component: 'Q3 — Excessive worry', score: Number(v.q3), max: 3 },
          { component: 'Q4 — Trouble relaxing', score: Number(v.q4), max: 3 },
          { component: 'Q5 — Restlessness', score: Number(v.q5), max: 3 },
          { component: 'Q6 — Irritability', score: Number(v.q6), max: 3 },
          { component: 'Q7 — Fearfulness', score: Number(v.q7), max: 3 },
          { component: 'TOTAL', score, max: 21 },
        ],
        details: [
          `GAD-7: ${score}/21 — ${severity}`,
          `Action: ${action}`,
          '→ GAD-7 screens broadly for anxiety — also use PHQ-9 (co-morbid depression common)',
          '→ Rule out medical causes: hyperthyroidism, cardiac arrhythmia, stimulant use, caffeine excess',
          '→ Specific anxiety subtypes: use PCL-5 for PTSD, panic disorder criteria for panic attacks',
          '→ CBT-I or CBT for anxiety is first-line non-pharmacological treatment',
          '→ Reassess GAD-7 at 4–8 weeks after starting treatment to monitor response',
          '→ Score ≥10 = clinically meaningful; ≥5-point reduction = treatment response',
        ],
      };
    },
  },
  // 3. NIHSS Stroke Scale
  {
    id: 'nihss-stroke-scale',
    name: 'NIH Stroke Scale (NIHSS)',
    category: 'Psychiatry',
    icon: '🧬',
    description:
      'Quantify neurologic impairment in acute stroke — guides tPA/thrombectomy eligibility and documents severity',
    formula:
      'Sum of 11 neurologic domains (0–42) — requires NIHSS certification for accurate administration',
    reference: 'Brott T et al. Stroke 1989 / AHA/ASA Acute Ischemic Stroke Guidelines 2019',
    inputs: [
      {
        id: 'loc',
        label: '1a. Level of Consciousness',
        type: 'select',
        options: [
          { label: 'Alert (0)', value: 0 },
          { label: 'Drowsy — arousable by minor stimulation (1)', value: 1 },
          { label: 'Stuporous — requires repeated stimulation (2)', value: 2 },
          { label: 'Coma — unresponsive (3)', value: 3 },
        ],
        defaultValue: 0,
      },
      {
        id: 'loc_q',
        label: '1b. LOC Questions (month/age — best of 2)',
        type: 'select',
        options: [
          { label: 'Both correct (0)', value: 0 },
          { label: 'One correct (1)', value: 1 },
          { label: 'Neither correct (2)', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'loc_cmd',
        label: '1c. LOC Commands (eyes open/fist — best of 2)',
        type: 'select',
        options: [
          { label: 'Both obey (0)', value: 0 },
          { label: 'One obeys (1)', value: 1 },
          { label: 'Neither obeys (2)', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'gaze',
        label: '2. Best Gaze',
        type: 'select',
        options: [
          { label: 'Normal (0)', value: 0 },
          { label: 'Partial gaze palsy (1)', value: 1 },
          { label: 'Forced deviation (2)', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'visual',
        label: '3. Visual Fields',
        type: 'select',
        options: [
          { label: 'No visual loss (0)', value: 0 },
          { label: 'Partial hemianopia (1)', value: 1 },
          { label: 'Complete hemianopia (2)', value: 2 },
          { label: 'Bilateral blindness (3)', value: 3 },
        ],
        defaultValue: 0,
      },
      {
        id: 'facial',
        label: '4. Facial Palsy',
        type: 'select',
        options: [
          { label: 'Normal (0)', value: 0 },
          { label: 'Minor paralysis (1)', value: 1 },
          { label: 'Partial paralysis (2)', value: 2 },
          { label: 'Complete paralysis (3)', value: 3 },
        ],
        defaultValue: 0,
      },
      {
        id: 'arm_l',
        label: '5a. Left Arm Motor',
        type: 'select',
        options: [
          { label: 'No drift — 10 sec (0)', value: 0 },
          { label: 'Drift before 10 sec (1)', value: 1 },
          { label: 'Some effort vs gravity (2)', value: 2 },
          { label: 'No effort vs gravity (3)', value: 3 },
          { label: 'No movement (4)', value: 4 },
        ],
        defaultValue: 0,
      },
      {
        id: 'arm_r',
        label: '5b. Right Arm Motor',
        type: 'select',
        options: [
          { label: 'No drift — 10 sec (0)', value: 0 },
          { label: 'Drift before 10 sec (1)', value: 1 },
          { label: 'Some effort vs gravity (2)', value: 2 },
          { label: 'No effort vs gravity (3)', value: 3 },
          { label: 'No movement (4)', value: 4 },
        ],
        defaultValue: 0,
      },
      {
        id: 'leg_l',
        label: '6a. Left Leg Motor',
        type: 'select',
        options: [
          { label: 'No drift — 5 sec (0)', value: 0 },
          { label: 'Drift before 5 sec (1)', value: 1 },
          { label: 'Some effort vs gravity (2)', value: 2 },
          { label: 'No effort vs gravity (3)', value: 3 },
          { label: 'No movement (4)', value: 4 },
        ],
        defaultValue: 0,
      },
      {
        id: 'leg_r',
        label: '6b. Right Leg Motor',
        type: 'select',
        options: [
          { label: 'No drift — 5 sec (0)', value: 0 },
          { label: 'Drift before 5 sec (1)', value: 1 },
          { label: 'Some effort vs gravity (2)', value: 2 },
          { label: 'No effort vs gravity (3)', value: 3 },
          { label: 'No movement (4)', value: 4 },
        ],
        defaultValue: 0,
      },
      {
        id: 'ataxia',
        label: '7. Limb Ataxia',
        type: 'select',
        options: [
          { label: 'Absent (0)', value: 0 },
          { label: 'One limb (1)', value: 1 },
          { label: 'Two limbs (2)', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'sensory',
        label: '8. Sensory',
        type: 'select',
        options: [
          { label: 'Normal (0)', value: 0 },
          { label: 'Mild-moderate loss (1)', value: 1 },
          { label: 'Severe or total loss (2)', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'language',
        label: '9. Best Language',
        type: 'select',
        options: [
          { label: 'No aphasia (0)', value: 0 },
          { label: 'Mild-moderate aphasia (1)', value: 1 },
          { label: 'Severe aphasia (2)', value: 2 },
          { label: 'Mute/global aphasia (3)', value: 3 },
        ],
        defaultValue: 0,
      },
      {
        id: 'dysarthria',
        label: '10. Dysarthria',
        type: 'select',
        options: [
          { label: 'Normal (0)', value: 0 },
          { label: 'Mild-moderate slurring (1)', value: 1 },
          { label: 'Unintelligible (2)', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'extinction',
        label: '11. Extinction/Inattention',
        type: 'select',
        options: [
          { label: 'No abnormality (0)', value: 0 },
          { label: 'Visual/tactile/auditory/spatial inattention (1)', value: 1 },
          { label: 'Profound hemi-inattention (2)', value: 2 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const fields = [
        'loc',
        'loc_q',
        'loc_cmd',
        'gaze',
        'visual',
        'facial',
        'arm_l',
        'arm_r',
        'leg_l',
        'leg_r',
        'ataxia',
        'sensory',
        'language',
        'dysarthria',
        'extinction',
      ];
      const score = fields.reduce((s, k) => s + Number(v[k]), 0);
      const risk: CalculationResult['risk'] =
        score <= 4 ? 'low' : score <= 15 ? 'moderate' : score <= 20 ? 'high' : 'critical';
      const severity =
        score === 0
          ? 'No stroke symptoms'
          : score <= 4
            ? 'Minor stroke'
            : score <= 15
              ? 'Moderate stroke'
              : score <= 20
                ? 'Moderate-severe stroke'
                : 'Severe stroke';
      const tpaElig =
        score >= 4 && score <= 25
          ? 'Potentially eligible for IV alteplase if within 4.5h of onset and no contraindications'
          : 'Review individual eligibility';
      const thrombectomy =
        score >= 6
          ? 'May be eligible for mechanical thrombectomy if LVO confirmed on CTA'
          : 'Lower probability of LVO — CTA to confirm';
      return {
        label: 'NIHSS Score',
        value: score,
        unit: '/42',
        interpretation: `${severity} (NIHSS ${score}/42). ${tpaElig}. ${thrombectomy}.`,
        risk,
        riskPercentage: `NIHSS ${score} — ${severity}`,
        guidelineSource: 'AHA/ASA Acute Ischemic Stroke Guidelines 2019',
        scoreBreakdown: [
          { component: '1a. Level of Consciousness', score: Number(v.loc), max: 3 },
          { component: '1b. LOC Questions', score: Number(v.loc_q), max: 2 },
          { component: '1c. LOC Commands', score: Number(v.loc_cmd), max: 2 },
          { component: '2. Best Gaze', score: Number(v.gaze), max: 2 },
          { component: '3. Visual Fields', score: Number(v.visual), max: 3 },
          { component: '4. Facial Palsy', score: Number(v.facial), max: 3 },
          { component: '5a. Left Arm Motor', score: Number(v.arm_l), max: 4 },
          { component: '5b. Right Arm Motor', score: Number(v.arm_r), max: 4 },
          { component: '6a. Left Leg Motor', score: Number(v.leg_l), max: 4 },
          { component: '6b. Right Leg Motor', score: Number(v.leg_r), max: 4 },
          { component: '7. Limb Ataxia', score: Number(v.ataxia), max: 2 },
          { component: '8. Sensory', score: Number(v.sensory), max: 2 },
          { component: '9. Language', score: Number(v.language), max: 3 },
          { component: '10. Dysarthria', score: Number(v.dysarthria), max: 2 },
          { component: '11. Extinction/Inattention', score: Number(v.extinction), max: 2 },
          { component: 'TOTAL', score, max: 42 },
        ],
        details: [
          `NIHSS: ${score}/42 — ${severity}`,
          `IV alteplase: ${tpaElig}`,
          `Mechanical thrombectomy: ${thrombectomy}`,
          '→ STAT non-contrast CT head + CT angiography head and neck',
          '→ Door-to-needle time target: <45 minutes',
          '→ tPA eligibility: NIHSS ≥4, within 4.5h, BP <185/110, no hemorrhage on CT, no contraindications',
          '→ Thrombectomy: LVO on CTA, NIHSS ≥6, within 24h (extended window with perfusion imaging)',
          '⚠️ NIHSS is assessor-dependent — NIHSS certification improves inter-rater reliability',
          '⚠️ Posterior circulation strokes often score low despite significant deficits',
        ],
      };
    },
  },
  // 4. MMSE Cognitive Screen
  {
    id: 'mmse-cognitive-screen',
    name: 'Mini-Mental State Examination (MMSE)',
    category: 'Psychiatry',
    icon: '🧠',
    description:
      'Cognitive screening for dementia and cognitive impairment — assess orientation, memory, language, and visuospatial function',
    formula:
      'Sum of 6 cognitive domain scores (Orientation Time+Place, Registration, Attention, Recall, Language, Visuospatial) = 0–30',
    reference:
      'Folstein MF et al. J Psychiatr Res 1975 / Alzheimers Association Clinical Guidelines',
    inputs: [
      {
        id: 'orientation_time',
        label: 'Orientation — Time (year/season/date/day/month — 1 pt each)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 5,
        defaultValue: 5,
        placeholder: '0–5',
      },
      {
        id: 'orientation_place',
        label: 'Orientation — Place (state/county/town/hospital/floor — 1 pt each)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 5,
        defaultValue: 5,
        placeholder: '0–5',
      },
      {
        id: 'registration',
        label: 'Registration (repeat 3 objects — 1 pt each)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 3,
        defaultValue: 3,
        placeholder: '0–3',
      },
      {
        id: 'attention',
        label: 'Attention/Calculation (serial 7s or spell WORLD backward — 1 pt each)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 5,
        defaultValue: 5,
        placeholder: '0–5',
      },
      {
        id: 'recall',
        label: 'Recall (remember 3 objects from registration — 1 pt each)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 3,
        defaultValue: 3,
        placeholder: '0–3',
      },
      {
        id: 'language',
        label:
          'Language (naming ×2, repeat phrase, 3-step command, read/obey, write sentence) = 0–8',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 8,
        defaultValue: 8,
        placeholder: '0–8',
      },
      {
        id: 'visuospatial',
        label: 'Visuospatial (copy intersecting pentagons — 1 pt)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 1,
        defaultValue: 1,
        placeholder: '0 or 1',
      },
    ],
    calculate(v) {
      const score = [
        'orientation_time',
        'orientation_place',
        'registration',
        'attention',
        'recall',
        'language',
        'visuospatial',
      ].reduce((s, k) => s + Number(v[k]), 0);
      const risk: CalculationResult['risk'] =
        score >= 24 ? 'low' : score >= 18 ? 'moderate' : 'high';
      const category =
        score >= 27
          ? 'Normal cognition'
          : score >= 24
            ? 'Borderline / Mild impairment'
            : score >= 18
              ? 'Mild–Moderate dementia'
              : score >= 10
                ? 'Moderate dementia'
                : 'Severe dementia';
      const action =
        score >= 27
          ? 'No intervention — repeat in 1–2 years if risk factors present'
          : score >= 24
            ? 'Further evaluation with MoCA; repeat MMSE in 6–12 months; investigate reversible causes'
            : score >= 18
              ? 'Full dementia workup; neuropsychological evaluation; safety assessment'
              : 'Comprehensive dementia evaluation; driving/financial safety; specialist referral';
      return {
        label: 'MMSE Score',
        value: score,
        unit: '/30',
        interpretation: `${category} (score ${score}/30). ${action}.`,
        risk,
        riskPercentage: `MMSE ${score}/30 — ${category}`,
        guidelineSource: 'Alzheimers Association Clinical Guidelines / Folstein MF et al. 1975',
        scoreBreakdown: [
          { component: 'Orientation — Time', score: Number(v.orientation_time), max: 5 },
          { component: 'Orientation — Place', score: Number(v.orientation_place), max: 5 },
          { component: 'Registration (3 objects)', score: Number(v.registration), max: 3 },
          { component: 'Attention/Calculation', score: Number(v.attention), max: 5 },
          { component: 'Recall (3 objects)', score: Number(v.recall), max: 3 },
          { component: 'Language (6 sub-items)', score: Number(v.language), max: 8 },
          { component: 'Visuospatial (pentagons)', score: Number(v.visuospatial), max: 1 },
          { component: 'TOTAL', score, max: 30 },
        ],
        details: [
          `MMSE: ${score}/30 — ${category}`,
          `Action: ${action}`,
          '→ MoCA is more sensitive than MMSE for mild cognitive impairment (MCI) — use if MMSE borderline',
          '→ Reversible causes workup: TSH, B12, folate, CBC, BMP, VDRL, RPR',
          '→ MRI brain: exclude structural causes (subdural, hydrocephalus, tumour)',
          '⚠️ MMSE is education-biased — poorly educated patients may score low without dementia',
          '⚠️ Delirium, depression, and metabolic encephalopathy cause acute cognitive decline — not dementia',
          '→ Safety assessment: driving, managing finances, medication adherence',
        ],
      };
    },
  },
  // 5. Epworth Sleepiness Scale
  {
    id: 'epworth-sleepiness-scale',
    name: 'Epworth Sleepiness Scale (ESS)',
    category: 'Psychiatry',
    icon: '😴',
    description:
      'Measure daytime sleepiness across 8 real-life situations — screens for obstructive sleep apnea and hypersomnia',
    formula:
      'Sum of chance-of-dozing ratings (0=Never, 1=Slight, 2=Moderate, 3=High) across 8 situations = 0–24',
    reference: 'Johns MW. Sleep 1991 / AASM Sleep Disorder Guidelines 2014',
    inputs: Array.from({ length: 8 }, (_, i) => ({
      id: `s${i + 1}`,
      label: [
        'Sitting and reading',
        'Watching television',
        'Sitting inactive in a public place (theatre, meeting)',
        'As a passenger in a car for an hour without a break',
        'Lying down to rest in the afternoon',
        'Sitting and talking to someone',
        'Sitting quietly after lunch without alcohol',
        'In a car, stopped for a few minutes in traffic',
      ][i],
      type: 'select' as const,
      options: [
        { label: 'Would never doze — 0 pts', value: 0 },
        { label: 'Slight chance of dozing — 1 pt', value: 1 },
        { label: 'Moderate chance of dozing — 2 pts', value: 2 },
        { label: 'High chance of dozing — 3 pts', value: 3 },
      ],
      defaultValue: 0,
    })),
    calculate(v) {
      const score = Array.from({ length: 8 }, (_, i) => Number(v[`s${i + 1}`])).reduce(
        (a, b) => a + b,
        0
      );
      const risk: CalculationResult['risk'] =
        score <= 10 ? 'low' : score <= 15 ? 'moderate' : 'high';
      const category =
        score <= 10
          ? 'Normal daytime sleepiness'
          : score <= 15
            ? 'Excessive daytime sleepiness (EDS)'
            : score <= 20
              ? 'Moderate-severe EDS — sleep study indicated'
              : 'Severe EDS — urgent sleep medicine referral';
      const action =
        score <= 10
          ? 'Reassure; reinforce sleep hygiene'
          : score <= 15
            ? 'Screen for OSA (STOP-BANG); consider home sleep apnea test (HSAT)'
            : score <= 20
              ? 'Sleep medicine referral; PSG or HSAT; driving safety counseling'
              : 'Urgent sleep medicine referral; restrict driving pending evaluation';
      return {
        label: 'Epworth Sleepiness Score',
        value: score,
        unit: '/24',
        interpretation: `${category} (score ${score}/24). ${action}.`,
        risk,
        riskPercentage: `ESS ${score}/24 — ${category}`,
        guidelineSource: 'AASM Sleep Disorder Clinical Practice Guidelines 2014',
        scoreBreakdown: [
          { component: 'S1 — Sitting and reading', score: Number(v.s1), max: 3 },
          { component: 'S2 — Watching TV', score: Number(v.s2), max: 3 },
          { component: 'S3 — Inactive in public', score: Number(v.s3), max: 3 },
          { component: 'S4 — Car passenger 1h', score: Number(v.s4), max: 3 },
          { component: 'S5 — Resting afternoon', score: Number(v.s5), max: 3 },
          { component: 'S6 — Talking to someone', score: Number(v.s6), max: 3 },
          { component: 'S7 — After quiet lunch', score: Number(v.s7), max: 3 },
          { component: 'S8 — Car stopped in traffic', score: Number(v.s8), max: 3 },
          { component: 'TOTAL', score, max: 24 },
        ],
        details: [
          `ESS: ${score}/24 — ${category}`,
          `Action: ${action}`,
          '→ STOP-BANG questionnaire for OSA: Snoring, Tired, Observed apnea, BP, BMI>35, Age>50, Neck>40cm, Male',
          '→ OSA: HSAT acceptable if high pre-test probability and no complex comorbidities',
          '→ CPAP therapy is first-line for OSA — reassess ESS after 6–8 weeks',
          score >= 11
            ? '→ Driving restriction counseling — excessive sleepiness is a road safety risk'
            : '',
          '⚠️ ESS measures habitual dozing tendency — not fatigue or insomnia severity',
          '→ Narcolepsy: look for cataplexy, sleep paralysis, hypnagogic hallucinations + high ESS',
        ].filter(Boolean),
      };
    },
  },
  // 6. AUDIT-C Alcohol Screening
  {
    id: 'audit-c-alcohol-screening',
    name: 'AUDIT-C Alcohol Use Screening',
    category: 'Psychiatry',
    icon: '🍷',
    description:
      'Abbreviated Alcohol Use Disorders Identification Test — screens for hazardous drinking and alcohol use disorder',
    formula:
      'Sum of 3 consumption items (frequency + drinks per occasion + binge frequency) = 0–12',
    reference: 'Bush K et al. Arch Intern Med 1998 / USPSTF Alcohol Screening Recommendation 2018',
    inputs: [
      {
        id: 'frequency',
        label: 'How often do you have a drink containing alcohol?',
        type: 'select',
        options: [
          { label: 'Never — 0 pts', value: 0 },
          { label: 'Monthly or less — 1 pt', value: 1 },
          { label: '2–4 times per month — 2 pts', value: 2 },
          { label: '2–3 times per week — 3 pts', value: 3 },
          { label: '4 or more times per week — 4 pts', value: 4 },
        ],
        defaultValue: 0,
      },
      {
        id: 'drinks',
        label: 'How many standard drinks do you have on a typical drinking day?',
        type: 'select',
        options: [
          { label: '1–2 drinks — 0 pts', value: 0 },
          { label: '3–4 drinks — 1 pt', value: 1 },
          { label: '5–6 drinks — 2 pts', value: 2 },
          { label: '7–9 drinks — 3 pts', value: 3 },
          { label: '10 or more drinks — 4 pts', value: 4 },
        ],
        defaultValue: 0,
      },
      {
        id: 'heavy',
        label: 'How often do you have 6 or more drinks on one occasion?',
        type: 'select',
        options: [
          { label: 'Never — 0 pts', value: 0 },
          { label: 'Less than monthly — 1 pt', value: 1 },
          { label: 'Monthly — 2 pts', value: 2 },
          { label: 'Weekly — 3 pts', value: 3 },
          { label: 'Daily or almost daily — 4 pts', value: 4 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const score = Number(v.frequency) + Number(v.drinks) + Number(v.heavy);
      const risk: CalculationResult['risk'] = score <= 2 ? 'low' : score <= 4 ? 'moderate' : 'high';
      const category =
        score <= 2
          ? 'Low-risk drinking'
          : score <= 4
            ? 'Hazardous drinking likely'
            : score <= 7
              ? 'High-risk — probable AUD'
              : 'Very high-risk — probable severe AUD';
      const _maleThreshold = score >= 3,
        _femaleThreshold = score >= 2; // lower threshold for females
      const action =
        score <= 2
          ? 'Reinforce safe drinking limits; annual rescreening'
          : score <= 4
            ? 'Brief intervention (FRAMES model, 5-min counseling); full AUDIT-10 assessment'
            : 'Full AUDIT-10; motivational interviewing; consider pharmacotherapy (naltrexone, acamprosate); addiction medicine referral';
      return {
        label: 'AUDIT-C Score',
        value: score,
        unit: '/12',
        interpretation: `${category} (score ${score}/12). ${action}.`,
        risk,
        riskPercentage: `AUDIT-C ${score}/12 — ${category}`,
        guidelineSource: 'USPSTF Alcohol Screening Recommendation 2018 / Bush K et al. 1998',
        scoreBreakdown: [
          { component: 'Q1 — Drinking frequency', score: Number(v.frequency), max: 4 },
          { component: 'Q2 — Drinks per occasion', score: Number(v.drinks), max: 4 },
          { component: 'Q3 — Binge drinking frequency', score: Number(v.heavy), max: 4 },
          { component: 'TOTAL', score, max: 12 },
        ],
        details: [
          `AUDIT-C: ${score}/12 — ${category}`,
          `Positive threshold: ≥3 (males), ≥2 (females) — current patient score: ${score}`,
          `Action: ${action}`,
          '→ Safe drinking limits: men ≤14 drinks/week (≤4/day); women ≤7/week (≤3/day)',
          '→ Full AUDIT-10 for comprehensive assessment of harmful/dependent drinking',
          '→ Pharmacotherapy for AUD: naltrexone (reduces craving), acamprosate (abstinence support), disulfiram',
          '→ CIWA-Ar before advising cessation if physical dependence suspected',
          '⚠️ Social desirability bias causes underreporting — biomarkers (CDT, GGT, MCV) may supplement',
        ],
      };
    },
  },
  // 7. CIWA-Ar Alcohol Withdrawal
  {
    id: 'ciwa-ar-withdrawal-scale',
    name: 'CIWA-Ar Alcohol Withdrawal Scale',
    category: 'Psychiatry',
    icon: '🚨',
    description: 'Assess alcohol withdrawal severity to guide benzodiazepine dosing protocol',
    formula:
      'Sum of 10 clinical items (nausea, tremor, sweats, anxiety, agitation, tactile/auditory/visual disturbances, headache, disorientation) = 0–67',
    reference: 'Sullivan JT et al. Br J Addict 1989 / ASAM Alcohol Withdrawal Guidelines 2020',
    inputs: [
      {
        id: 'nausea',
        label: 'Nausea / Vomiting (0=none, 7=constant nausea/dry heaves)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 7,
        defaultValue: 0,
      },
      {
        id: 'tremor',
        label: 'Tremor (0=none, 7=severe even with arms extended)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 7,
        defaultValue: 0,
      },
      {
        id: 'sweats',
        label: 'Paroxysmal Sweats (0=none, 7=drenching sweats)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 7,
        defaultValue: 0,
      },
      {
        id: 'anxiety',
        label: 'Anxiety (0=none/calm, 7=panic state equivalent)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 7,
        defaultValue: 0,
      },
      {
        id: 'agitation',
        label: 'Agitation (0=none, 7=paces constantly / cannot cooperate)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 7,
        defaultValue: 0,
      },
      {
        id: 'tactile',
        label: 'Tactile Disturbances (0=none, 7=continuous hallucinations)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 7,
        defaultValue: 0,
      },
      {
        id: 'auditory',
        label: 'Auditory Disturbances (0=none, 7=continuous hallucinations)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 7,
        defaultValue: 0,
      },
      {
        id: 'visual',
        label: 'Visual Disturbances (0=none, 7=continuous hallucinations)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 7,
        defaultValue: 0,
      },
      {
        id: 'headache',
        label: 'Headache / Fullness in Head (0=none, 7=extremely severe)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 7,
        defaultValue: 0,
      },
      {
        id: 'orientation',
        label:
          'Disorientation / Clouding of Sensorium (0=oriented, 4=cannot perform serial additions)',
        type: 'number',
        unit: 'pts',
        min: 0,
        max: 4,
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const fields = [
        'nausea',
        'tremor',
        'sweats',
        'anxiety',
        'agitation',
        'tactile',
        'auditory',
        'visual',
        'headache',
        'orientation',
      ];
      const score = fields.reduce((s, k) => s + Number(v[k]), 0);
      const risk: CalculationResult['risk'] =
        score < 8 ? 'low' : score < 15 ? 'moderate' : score < 20 ? 'high' : 'critical';
      const severity =
        score < 8
          ? 'Minimal withdrawal'
          : score < 15
            ? 'Mild–Moderate withdrawal'
            : score < 20
              ? 'Moderate–Severe withdrawal'
              : 'Severe withdrawal — Delirium Tremens risk';
      const benzoDose =
        score < 8
          ? 'No benzodiazepine required — supportive care only'
          : score < 15
            ? 'Symptom-triggered lorazepam 1–2mg PO q1h PRN'
            : score < 20
              ? 'Standing benzodiazepine + PRN; IV access; close monitoring'
              : 'IV diazepam or lorazepam; ICU admission; phenobarbital if refractory';
      const dtRisk =
        score >= 20
          ? '🚨 HIGH DT RISK — ICU monitoring, continuous benzodiazepine infusion'
          : 'Delirium tremens typically occurs 48–72h after last drink — reassess';
      return {
        label: 'CIWA-Ar Score',
        value: score,
        unit: '/67',
        interpretation: `${severity} (score ${score}/67). Treatment: ${benzoDose}. ${dtRisk}`,
        risk,
        riskPercentage:
          score >= 20 ? 'Delirium Tremens risk — CRITICAL' : `Withdrawal severity: ${severity}`,
        guidelineSource: 'ASAM Alcohol Withdrawal Guidelines 2020 / Sullivan JT et al. 1989',
        scoreBreakdown: [
          { component: 'Nausea/Vomiting', score: Number(v.nausea), max: 7 },
          { component: 'Tremor', score: Number(v.tremor), max: 7 },
          { component: 'Paroxysmal Sweats', score: Number(v.sweats), max: 7 },
          { component: 'Anxiety', score: Number(v.anxiety), max: 7 },
          { component: 'Agitation', score: Number(v.agitation), max: 7 },
          { component: 'Tactile Disturbances', score: Number(v.tactile), max: 7 },
          { component: 'Auditory Disturbances', score: Number(v.auditory), max: 7 },
          { component: 'Visual Disturbances', score: Number(v.visual), max: 7 },
          { component: 'Headache', score: Number(v.headache), max: 7 },
          { component: 'Disorientation', score: Number(v.orientation), max: 4 },
          { component: 'TOTAL', score, max: 67 },
        ],
        details: [
          `CIWA-Ar: ${score}/67 — ${severity}`,
          `Benzodiazepine protocol: ${benzoDose}`,
          '→ THIAMINE FIRST: 100mg IV BEFORE glucose/dextrose to prevent Wernickes encephalopathy',
          '→ Correct electrolytes: K⁺, Mg²⁺, PO₄²⁻ — hypomagnesemia lowers seizure threshold',
          '→ Alcohol withdrawal seizures: typically 12–48h after last drink — prophylax with benzos',
          '→ Delirium tremens: 48–72h after last drink — autonomic instability + hallucinations',
          score >= 20 ? '🚨 ICU admission for CIWA ≥20 — continuous infusion, monitor closely' : '',
          '⚠️ CIWA-Ar requires trained clinical assessor — not a patient-reported questionnaire',
          '→ Phenobarbital for refractory withdrawal unresponsive to benzodiazepines',
        ].filter(Boolean),
      };
    },
  },
  // 8. Lithium Dose Calculator
  {
    id: 'lithium-dose-calculator',
    name: 'Lithium Dose Estimator (Renal-Based)',
    category: 'Psychiatry',
    icon: '💊',
    description:
      'Estimate initial lithium dose based on renal function — requires therapeutic drug monitoring for final dose adjustment',
    formula:
      'Lithium clearance ~ 20–30% of CrCl | Typical initial dose 600–900 mg/day in divided doses',
    reference: 'Gage BF / Perry PJ lithium dosing / Lithium prescribing NICE guidelines 2014',
    inputs: [
      {
        id: 'crcl',
        label: 'Creatinine Clearance (Cockcroft-Gault)',
        type: 'number',
        unit: 'mL/min',
        min: 10,
        max: 150,
        defaultValue: 80,
      },
      {
        id: 'target',
        label: 'Target Serum Lithium Level',
        type: 'select',
        options: [
          { label: '0.6–0.8 mEq/L (maintenance)', value: 0.7 },
          { label: '0.8–1.0 mEq/L (acute treatment)', value: 0.9 },
          { label: '1.0–1.2 mEq/L (acute mania)', value: 1.1 },
        ],
        defaultValue: 0.7,
      },
    ],
    calculate(v) {
      const crcl = Number(v.crcl),
        target = Number(v.target);
      // Simplified renal-based estimate: dose (mEq/day) ~ target x clearance factor
      const lithCl = crcl * 0.25; // lithium clearance ~ 25% of CrCl (mL/min)
      const dosePerDay = Math.round((target * lithCl * 1440) / 1000 / 0.3) * 0.3; // round to 150mg increments
      const adjustedDose = Math.max(300, Math.min(1800, Math.round(dosePerDay / 150) * 150));
      const trough12h =
        crcl >= 90
          ? '12h trough target:' + target + ' mEq/L'
          : crcl >= 60
            ? 'Reduce dose interval; monitor closely'
            : 'Extended interval dosing required — nephrology input';
      const risk: CalculationResult['risk'] = crcl >= 60 ? 'low' : crcl >= 30 ? 'moderate' : 'high';
      return {
        label: 'Estimated Lithium Dose',
        value: adjustedDose,
        unit: 'mg/day',
        interpretation: `Initial estimate: ${adjustedDose} mg/day in divided doses (typically 2–3 times daily). Target serum level: ${target} mEq/L at 12h post-dose. Check serum lithium 5–7 days after initiation and after each dose change.`,
        risk,
        riskPercentage:
          crcl < 60
            ? 'Renal impairment — lithium toxicity risk elevated'
            : 'Adjust based on serum levels',
        guidelineSource: 'NICE Bipolar Disorder Guidelines 2014 / British National Formulary',
        scoreBreakdown: [
          { component: 'CrCl (Cockcroft-Gault)', score: crcl + ' mL/min' },
          { component: 'Target Lithium Level', score: target + ' mEq/L' },
          { component: 'Estimated Lithium Clearance', score: lithCl.toFixed(0) + ' mL/min' },
          { component: 'Estimated Starting Dose', score: adjustedDose + ' mg/day' },
        ],
        details: [
          `Estimated starting dose: ${adjustedDose} mg/day | Target: ${target} mEq/L at 12h`,
          `CrCl: ${crcl} mL/min — ${trough12h}`,
          '→ Check serum lithium 5–7 days after initiation; also check TSH, BMP, pregnancy test',
          '→ Therapeutic monitoring: 12h post-last dose (trough); measure at steady state (5 days)',
          '→ Toxicity signs: tremor, nausea, ataxia, confusion — check level immediately',
          '⚠️ Narrow therapeutic index — toxicity risk at levels >1.5 mEq/L; potentially fatal >2.0',
          '⚠️ NSAIDs, ACE-I, thiazides increase lithium levels — avoid or adjust dose',
          '→ Hydration: ensure adequate fluid intake (2–3L/day); avoid dehydration (raises levels)',
          '⚠️ This estimate requires validation by therapeutic drug monitoring — do NOT use alone',
        ],
      };
    },
  },
  // 9. PTSD PCL-5 Checklist
  {
    id: 'ptsd-pcl5-checklist',
    name: 'PCL-5 PTSD Checklist (Abbreviated)',
    category: 'Psychiatry',
    icon: '🧩',
    description:
      'Abbreviated PTSD Checklist for DSM-5 — screen for PTSD symptom severity across 4 DSM-5 clusters',
    formula:
      'Sum of 4 DSM-5 PTSD symptom cluster scores (Intrusion + Avoidance + Cognition/Mood + Arousal) = 0–80 (full PCL-5); abbreviated 0–12 here',
    reference: 'Weathers FW et al. 2013 / VA NCPTSD / DSM-5 PTSD Criteria',
    inputs: [
      {
        id: 'intrusion',
        label:
          'Cluster B — Intrusion (unwanted memories, flashbacks, nightmares, emotional/physical reactions to reminders)',
        type: 'select',
        options: [
          { label: 'Not at all (0)', value: 0 },
          { label: 'A little bit (1)', value: 1 },
          { label: 'Moderately (2)', value: 2 },
          { label: 'Quite a bit (3)', value: 3 },
          { label: 'Extremely (4)', value: 4 },
        ],
        defaultValue: 0,
      },
      {
        id: 'avoidance',
        label:
          'Cluster C — Avoidance (avoiding trauma-related thoughts, feelings, reminders, people, places)',
        type: 'select',
        options: [
          { label: 'Not at all (0)', value: 0 },
          { label: 'A little bit (1)', value: 1 },
          { label: 'Moderately (2)', value: 2 },
          { label: 'Quite a bit (3)', value: 3 },
          { label: 'Extremely (4)', value: 4 },
        ],
        defaultValue: 0,
      },
      {
        id: 'cognition',
        label:
          'Cluster D — Negative Cognitions/Mood (negative beliefs, blame, negative emotions, loss of interest, feeling detached)',
        type: 'select',
        options: [
          { label: 'Not at all (0)', value: 0 },
          { label: 'A little bit (1)', value: 1 },
          { label: 'Moderately (2)', value: 2 },
          { label: 'Quite a bit (3)', value: 3 },
          { label: 'Extremely (4)', value: 4 },
        ],
        defaultValue: 0,
      },
      {
        id: 'arousal',
        label:
          'Cluster E — Alterations in Arousal (irritability, risky behavior, hypervigilance, exaggerated startle, sleep disturbance)',
        type: 'select',
        options: [
          { label: 'Not at all (0)', value: 0 },
          { label: 'A little bit (1)', value: 1 },
          { label: 'Moderately (2)', value: 2 },
          { label: 'Quite a bit (3)', value: 3 },
          { label: 'Extremely (4)', value: 4 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const intrusion = Number(v.intrusion),
        avoidance = Number(v.avoidance),
        cognition = Number(v.cognition),
        arousal = Number(v.arousal);
      const score = intrusion + avoidance + cognition + arousal;
      const risk: CalculationResult['risk'] = score < 3 ? 'low' : score < 7 ? 'moderate' : 'high';
      // Each cluster must be >0 for provisional PTSD diagnosis concern
      const allClusters = intrusion > 0 && avoidance > 0 && cognition > 0 && arousal > 0;
      const severity =
        score < 3
          ? 'Minimal PTSD symptoms'
          : score < 7
            ? 'Moderate PTSD symptoms — further evaluation indicated'
            : 'High PTSD symptom burden — clinical assessment required';
      const action =
        score < 3
          ? 'Monitor; repeat if trauma exposure occurs or symptoms worsen'
          : score < 7
            ? 'Structured clinical interview (CAPS-5); trauma-focused therapy referral'
            : 'Urgent trauma-focused assessment; Trauma-Focused CBT or EMDR; pharmacotherapy (sertraline, paroxetine)';
      return {
        label: 'PCL-5 (Abbreviated)',
        value: score,
        unit: '/16',
        interpretation: `${severity} (score ${score}/16). All 4 DSM-5 clusters endorsed: ${allClusters ? 'Yes — screen positive' : 'No — not all clusters met'}. ${action}.`,
        risk,
        riskPercentage:
          score >= 7 ? 'High PTSD symptom burden — clinical assessment required' : undefined,
        guidelineSource: 'VA NCPTSD / Weathers FW et al. 2013 / DSM-5 PTSD Criteria',
        scoreBreakdown: [
          { component: 'B — Intrusion symptoms', score: intrusion, max: 4 },
          { component: 'C — Avoidance symptoms', score: avoidance, max: 4 },
          { component: 'D — Negative cognitions/mood', score: cognition, max: 4 },
          { component: 'E — Arousal alterations', score: arousal, max: 4 },
          { component: 'TOTAL (abbreviated)', score, max: 16 },
          {
            component: 'All DSM-5 clusters endorsed',
            score: allClusters ? 'Yes (screen positive)' : 'No',
          },
        ],
        details: [
          `PCL-5 abbreviated: ${score}/16 — ${severity}`,
          allClusters
            ? '→ All 4 PTSD symptom clusters present — formal CAPS-5 diagnostic interview recommended'
            : '→ Not all clusters endorsed — PTSD diagnosis less likely; monitor',
          `Action: ${action}`,
          '→ Full PCL-5 (20 items) more sensitive — this abbreviated 4-item version for rapid screening only',
          '→ First-line PTSD treatments: Trauma-Focused CBT (TF-CBT) or EMDR',
          '→ First-line pharmacotherapy: sertraline or paroxetine (FDA-approved for PTSD)',
          '→ Safety assessment: suicidal ideation common in PTSD — screen with PHQ-9 item 9',
          '⚠️ This abbreviated screening does not replace a structured diagnostic interview (CAPS-5)',
        ].filter(Boolean),
      };
    },
  },
];

export const endocrinologyConfigs: MedicalConfig[] = [
  // 1. HbA1c <-> Glucose Converter
  {
    id: 'hba1c-glucose-med',
    name: 'HbA1c / eAG Converter',
    category: 'Endocrinology',
    icon: '🩸',
    description:
      'Convert between HbA1c (%) and estimated average plasma glucose (eAG) using the ADAG formula — with ADA glycemic target comparison',
    formula: 'eAG (mg/dL) = 28.7 × A1C − 46.7 | eAG (mmol/L) = eAG(mg/dL) ÷ 18.02',
    reference: 'Nathan DM et al. Diabetes Care 2008 (ADAG study) / ADA Standards of Care 2024',
    inputs: [
      {
        id: 'mode',
        label: 'Conversion Direction',
        type: 'select',
        options: [
          { label: 'HbA1c (%) → eAG', value: 'a1c_to_eag' },
          { label: 'eAG (mg/dL) → HbA1c', value: 'eag_to_a1c' },
        ],
        defaultValue: 'a1c_to_eag',
      },
      {
        id: 'value',
        label: 'HbA1c (%) OR eAG (mg/dL)',
        type: 'number',
        unit: '% or mg/dL',
        min: 3,
        max: 300,
        step: 0.1,
        defaultValue: 7.0,
        placeholder: 'e.g. 7.0 for HbA1c or 154 for eAG',
      },
    ],
    calculate(v) {
      const val = Number(v.value),
        mode = String(v.mode);
      let a1c: number, eag_mg: number;
      if (mode === 'a1c_to_eag') {
        a1c = val;
        eag_mg = 28.7 * a1c - 46.7;
      } else {
        eag_mg = val;
        a1c = (eag_mg + 46.7) / 28.7;
      }
      const eag_mmol = eag_mg / 18.02;
      const adaTarget =
        a1c < 7
          ? 'At/below ADA target (<7% for most adults)'
          : a1c < 8
            ? 'Above ADA target — tighten glycemic control'
            : a1c < 9
              ? 'Significantly above target — medication adjustment needed'
              : 'Poorly controlled — urgent intervention required';
      const risk: CalculationResult['risk'] =
        a1c < 7 ? 'low' : a1c < 8 ? 'moderate' : a1c < 9 ? 'high' : 'critical';
      const dx =
        a1c >= 6.5
          ? 'Diagnostic of diabetes (HbA1c ≥6.5%)'
          : a1c >= 5.7
            ? 'Prediabetes range (5.7–6.4%)'
            : 'Below prediabetes threshold';
      return {
        label: mode === 'a1c_to_eag' ? 'Estimated Average Glucose' : 'HbA1c',
        value: mode === 'a1c_to_eag' ? eag_mg.toFixed(0) : a1c.toFixed(1),
        unit: mode === 'a1c_to_eag' ? 'mg/dL' : '%',
        interpretation: `HbA1c: ${a1c.toFixed(1)}% → eAG: ${eag_mg.toFixed(0)} mg/dL (${eag_mmol.toFixed(1)} mmol/L). ${adaTarget}. ${dx}.`,
        risk,
        riskPercentage: `HbA1c ${a1c.toFixed(1)}% — ${adaTarget}`,
        guidelineSource: 'ADA Standards of Medical Care in Diabetes 2024',
        scoreBreakdown: [
          { component: 'HbA1c', score: a1c.toFixed(1) + '%' },
          { component: 'eAG (mg/dL)', score: eag_mg.toFixed(0) + ' mg/dL' },
          { component: 'eAG (mmol/L)', score: eag_mmol.toFixed(1) + ' mmol/L' },
          { component: 'ADA Glycemic Status', score: adaTarget },
          { component: 'Diagnostic Category', score: dx },
        ],
        details: [
          `HbA1c: ${a1c.toFixed(1)}% | eAG: ${eag_mg.toFixed(0)} mg/dL (${eag_mmol.toFixed(1)} mmol/L)`,
          `ADA target: ${adaTarget}`,
          `Diagnostic interpretation: ${dx}`,
          '→ HbA1c targets: <7% most adults; <7.5% older adults; <8% frail/limited life expectancy',
          '→ eAG allows patients to relate HbA1c to familiar glucometer readings',
          '→ Prediabetes (5.7–6.4%): lifestyle intervention reduces T2DM by 58%; metformin if high-risk',
          '⚠️ HbA1c unreliable in hemolytic anemia, sickle cell, thalassemia, iron deficiency',
          '→ Use fructosamine (2–3 week average) when HbA1c is unreliable',
        ],
      };
    },
  },
  // 2. BMI Calculator (Medical)
  {
    id: 'bmi-med',
    name: 'BMI Calculator with Obesity Classification',
    category: 'Endocrinology',
    icon: '⚖️',
    description:
      'Calculate BMI with WHO obesity classification, ideal weight range, and bariatric surgery threshold assessment',
    formula: 'BMI = Weight (kg) ÷ Height² (m) | IBW range = 18.5–24.9 × Height²',
    reference: 'WHO BMI Classification 2000 / NHLBI Obesity Guidelines 2013 / AHA/ACC/TOS 2013',
    inputs: [
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        unit: 'kg',
        min: 1,
        max: 500,
        step: 0.1,
        defaultValue: 70,
        placeholder: 'e.g. 70',
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        unit: 'cm',
        min: 50,
        max: 250,
        step: 0.5,
        defaultValue: 170,
        placeholder: 'e.g. 170',
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 2,
        max: 120,
        defaultValue: 35,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        defaultValue: 'male',
      },
    ],
    calculate(v) {
      const wt = Number(v.weight),
        ht = Number(v.height);
      const htM = ht / 100;
      const bmi = wt / (htM * htM);
      const ibwLow = 18.5 * htM * htM,
        ibwHigh = 24.9 * htM * htM;
      const excessWt = Math.max(0, wt - ibwHigh);
      const _pctAboveIBW = ibwHigh > 0 ? ((wt - ibwHigh) / ibwHigh) * 100 : 0;
      const category =
        bmi < 16
          ? 'Severe Thinness (Grade III)'
          : bmi < 17
            ? 'Moderate Thinness (Grade II)'
            : bmi < 18.5
              ? 'Mild Thinness (Grade I)'
              : bmi < 25
                ? 'Normal Weight'
                : bmi < 30
                  ? 'Overweight (Pre-obese)'
                  : bmi < 35
                    ? 'Obese Class I'
                    : bmi < 40
                      ? 'Obese Class II'
                      : 'Obese Class III (Severe/Morbid)';
      const risk: CalculationResult['risk'] =
        bmi < 18.5
          ? 'moderate'
          : bmi < 25
            ? 'low'
            : bmi < 30
              ? 'moderate'
              : bmi < 35
                ? 'high'
                : 'critical';
      const bariatric =
        bmi >= 40
          ? 'Bariatric surgery candidacy threshold met (BMI ≥40)'
          : bmi >= 35
            ? 'Bariatric surgery may be indicated with comorbidities (BMI 35–39.9 + T2DM/HTN/OSA/etc.)'
            : 'Below bariatric surgery threshold';
      // Asian-specific cutoffs
      const asianNote =
        bmi >= 23 && bmi < 25 ? 'Note: WHO Asian cutoffs: overweight ≥23, obese ≥27.5' : '';
      return {
        label: 'BMI',
        value: bmi.toFixed(1),
        unit: 'kg/m²',
        interpretation: `${category}. Ideal weight range: ${ibwLow.toFixed(0)}–${ibwHigh.toFixed(0)} kg for this height. ${bariatric}.`,
        risk,
        riskPercentage: `BMI ${bmi.toFixed(1)} — ${category}`,
        guidelineSource: 'WHO BMI Classification 2000 / NHLBI Obesity Guidelines 2013',
        scoreBreakdown: [
          { component: 'Weight', score: wt + ' kg' },
          { component: 'Height', score: ht + ' cm' },
          { component: 'BMI', score: bmi.toFixed(1) + ' kg/m²' },
          { component: 'WHO Category', score: category },
          {
            component: 'Ideal Weight Range',
            score: ibwLow.toFixed(0) + '–' + ibwHigh.toFixed(0) + ' kg',
          },
          {
            component: 'Excess Weight',
            score:
              excessWt > 0
                ? excessWt.toFixed(0) + ' kg above ideal weight'
                : 'At or below ideal weight',
          },
          { component: 'Bariatric Threshold', score: bariatric.split('(')[0].trim() },
        ],
        details: [
          `BMI: ${bmi.toFixed(1)} kg/m² — ${category}`,
          `Ideal weight range: ${ibwLow.toFixed(0)}–${ibwHigh.toFixed(0)} kg`,
          excessWt > 0
            ? 'Excess weight: ' + excessWt.toFixed(0) + ' kg above ideal range'
            : 'Weight within or below ideal range',
          `${bariatric}`,
          asianNote,
          '→ Waist circumference: Men >102cm (40in), Women >88cm (35in) = central adiposity',
          '→ Combine BMI with waist circumference — BMI alone misses visceral adiposity',
          bmi >= 30
            ? '→ Lifestyle: 5–10% weight loss significantly reduces cardiometabolic risk'
            : '',
          bmi >= 30
            ? '→ Pharmacotherapy options: semaglutide (Wegovy), tirzepatide, phentermine-topiramate'
            : '',
          bmi < 18.5
            ? '→ Nutritional assessment; screen for eating disorder (anorexia, malabsorption)'
            : '',
        ].filter(Boolean),
      };
    },
  },
  // 3. Insulin Dose Calculator
  {
    id: 'insulin-dose-calculator',
    name: 'Insulin Dose Calculator (Basal-Bolus)',
    category: 'Endocrinology',
    icon: '💉',
    description:
      'Calculate basal, correction, and carbohydrate-coverage insulin doses for type 1/2 diabetes management',
    formula:
      'TDD = 0.5 units/kg | Basal = 50% TDD | Correction = (BG-target) ÷ ISF | Carb coverage = carbs ÷ ICR',
    reference: 'ADA Standards of Care 2024 / Diabetes Education principles (Walsh J et al.)',
    inputs: [
      {
        id: 'weight',
        label: 'Patient Weight',
        type: 'number',
        unit: 'kg',
        min: 10,
        max: 300,
        step: 0.1,
        defaultValue: 70,
      },
      {
        id: 'bg',
        label: 'Current Blood Glucose',
        type: 'number',
        unit: 'mg/dL',
        min: 40,
        max: 600,
        defaultValue: 180,
        placeholder: 'e.g. 180',
      },
      {
        id: 'target',
        label: 'Target Blood Glucose',
        type: 'number',
        unit: 'mg/dL',
        min: 70,
        max: 180,
        defaultValue: 110,
        placeholder: 'e.g. 110',
      },
      {
        id: 'isf',
        label: 'Insulin Sensitivity Factor (ISF) — if known',
        type: 'number',
        unit: 'mg/dL per unit',
        min: 10,
        max: 200,
        defaultValue: 50,
        placeholder: 'e.g. 50 (leave default if unknown)',
      },
      {
        id: 'carbs',
        label: 'Carbohydrates to Cover',
        type: 'number',
        unit: 'grams',
        min: 0,
        max: 300,
        defaultValue: 45,
        placeholder: 'e.g. 45',
      },
      {
        id: 'icr',
        label: 'Insulin-to-Carb Ratio (ICR) — if known',
        type: 'number',
        unit: 'g/unit',
        min: 2,
        max: 50,
        defaultValue: 15,
        placeholder: 'e.g. 15 (1 unit per 15g carbs)',
      },
    ],
    calculate(v) {
      const wt = Number(v.weight),
        bg = Number(v.bg),
        target = Number(v.target);
      const isf = Number(v.isf),
        carbs = Number(v.carbs),
        icr = Number(v.icr);
      const tdd = Math.round(wt * 0.5);
      const basalDose = Math.round(tdd * 0.5);
      const correctionDose = Math.max(0, Math.round(((bg - target) / isf) * 10) / 10);
      const carbDose = Math.round((carbs / icr) * 10) / 10;
      const totalBolusDose = Math.round((correctionDose + carbDose) * 10) / 10;
      const hypoRisk = correctionDose > 10 || carbDose > 15;
      const risk: CalculationResult['risk'] =
        bg > 300 ? 'critical' : bg > 200 ? 'high' : bg > 140 ? 'moderate' : 'low';
      return {
        label: 'Total Bolus Dose',
        value: totalBolusDose,
        unit: 'units',
        interpretation: `Correction dose: ${correctionDose} units + Carb coverage: ${carbDose} units = Total bolus: ${totalBolusDose} units. Estimated TDD: ${tdd} units/day. Basal: ~${basalDose} units/day.`,
        risk,
        riskPercentage:
          bg > 300
            ? 'Severe hyperglycemia — check ketones'
            : bg > 200
              ? 'Significant hyperglycemia'
              : undefined,
        guidelineSource: 'ADA Standards of Medical Care in Diabetes 2024',
        scoreBreakdown: [
          { component: 'Weight-based TDD (0.5 units/kg)', score: tdd + ' units/day' },
          { component: 'Basal dose (50% TDD)', score: basalDose + ' units/day' },
          { component: 'Correction dose ([BG−Target]÷ISF)', score: correctionDose + ' units' },
          { component: 'Carb coverage dose (Carbs÷ICR)', score: carbDose + ' units' },
          { component: 'TOTAL BOLUS DOSE', score: totalBolusDose + ' units' },
        ],
        details: [
          `Current BG: ${bg} mg/dL | Target: ${target} mg/dL | ISF: 1 unit lowers BG by ${isf} mg/dL`,
          `Correction: ${correctionDose} units | Carb coverage: ${carbDose} units (for ${carbs}g at ICR 1:${icr})`,
          `Total bolus: ${totalBolusDose} units | Estimated basal: ${basalDose} units/day`,
          hypoRisk
            ? '⚠️ Large bolus dose — verify calculation independently. Monitor for hypoglycemia.'
            : '',
          bg > 300
            ? '→ Check urine/blood ketones if T1DM — DKA risk if hyperglycemia + illness'
            : '',
          '→ Hypoglycemia: if BG <70 mg/dL, treat with 15g fast-acting carbs; recheck in 15 min (15/15 rule)',
          '⚠️ This is an ESTIMATE — insulin dosing requires individualization by endocrinologist/diabetes educator',
          '→ CGM-guided dosing significantly reduces hypoglycemia risk — consider CGM referral',
        ].filter(Boolean),
      };
    },
  },
  // 4. BMR / TDEE Calculator
  {
    id: 'bmr-tdee-med',
    name: 'BMR & TDEE Calculator (Mifflin-St Jeor)',
    category: 'Endocrinology',
    icon: '🔥',
    description:
      'Calculate Basal Metabolic Rate and Total Daily Energy Expenditure for clinical nutrition planning',
    formula: 'BMR (Mifflin-St Jeor): 10×W + 6.25×H − 5×A + S | TDEE = BMR × Activity Multiplier',
    reference:
      'Mifflin MD et al. AJCN 1990 / DRI Energy Recommendations (IOM) / ADA Nutrition Guidelines',
    inputs: [
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        unit: 'kg',
        min: 20,
        max: 400,
        step: 0.1,
        defaultValue: 70,
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        unit: 'cm',
        min: 100,
        max: 250,
        step: 0.5,
        defaultValue: 170,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 15,
        max: 100,
        defaultValue: 35,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male (+5 kcal/day)', value: 'male' },
          { label: 'Female (−161 kcal/day)', value: 'female' },
        ],
        defaultValue: 'male',
      },
      {
        id: 'activity',
        label: 'Physical Activity Level',
        type: 'select',
        options: [
          { label: 'Sedentary — desk job, little exercise (×1.2)', value: 1.2 },
          { label: 'Lightly active — light exercise 1–3 days/week (×1.375)', value: 1.375 },
          { label: 'Moderately active — moderate exercise 3–5 days/week (×1.55)', value: 1.55 },
          { label: 'Very active — hard exercise 6–7 days/week (×1.725)', value: 1.725 },
          { label: 'Extra active — very hard exercise + physical job (×1.9)', value: 1.9 },
        ],
        defaultValue: 1.55,
      },
    ],
    calculate(v) {
      const wt = Number(v.weight),
        ht = Number(v.height),
        age = Number(v.age),
        act = Number(v.activity);
      const sexAdj = v.sex === 'male' ? 5 : -161;
      const bmr = 10 * wt + 6.25 * ht - 5 * age + sexAdj;
      const tdee = Math.round(bmr * act);
      const deficitLoss = Math.round(tdee - 500),
        deficitAggressive = Math.round(tdee - 750);
      const surplusGain = Math.round(tdee + 300);
      const risk: CalculationResult['risk'] = 'low';
      const actLabel =
        act <= 1.2
          ? 'Sedentary'
          : act <= 1.375
            ? 'Lightly active'
            : act <= 1.55
              ? 'Moderately active'
              : act <= 1.725
                ? 'Very active'
                : 'Extra active';
      return {
        label: 'TDEE',
        value: tdee,
        unit: 'kcal/day',
        interpretation: `BMR: ${Math.round(bmr)} kcal/day. TDEE (${actLabel}): ${tdee} kcal/day. Weight loss: ${deficitLoss} kcal/day (−500 deficit ≈ 0.5 kg/week). Muscle gain: ${surplusGain} kcal/day (+300 surplus).`,
        risk,
        riskPercentage: undefined,
        guidelineSource: 'Mifflin MD et al. AJCN 1990 / ADA Medical Nutrition Therapy Guidelines',
        scoreBreakdown: [
          { component: 'Weight', score: wt + ' kg' },
          { component: 'Height', score: ht + ' cm' },
          { component: 'Age', score: age + ' years' },
          { component: 'Sex adjustment', score: v.sex === 'male' ? '+5 kcal' : '-161 kcal' },
          { component: 'BMR (Mifflin-St Jeor)', score: Math.round(bmr) + ' kcal/day' },
          { component: 'Activity multiplier', score: '×' + act + ' (' + actLabel + ')' },
          { component: 'TDEE', score: tdee + ' kcal/day' },
          { component: 'Weight loss target', score: deficitLoss + ' kcal/day (−500 deficit)' },
          { component: 'Muscle gain target', score: surplusGain + ' kcal/day (+300 surplus)' },
        ],
        details: [
          `BMR: ${Math.round(bmr)} kcal/day | TDEE: ${tdee} kcal/day (${actLabel})`,
          `Weight loss: ${deficitLoss} kcal/day (−500 deficit ≈ ~0.5 kg/week)`,
          `Aggressive weight loss: ${deficitAggressive} kcal/day (−750 deficit)`,
          `Minimum floors: 1200 kcal/day (women), 1500 kcal/day (men) — avoid going below`,
          '→ Protein target: 1.2–1.6 g/kg/day to preserve muscle during weight loss',
          '→ Adjust TDEE every 5–10 kg of weight loss — metabolic adaptation occurs',
          '⚠️ Activity multiplier is the largest source of error — most people overestimate activity',
          '→ Track actual weight trend over 2–3 weeks; adjust intake if not meeting goal',
        ],
      };
    },
  },
  // 5. FINDRISC Diabetes Risk Score
  {
    id: 'findrisc-diabetes-risk',
    name: 'FINDRISC Type 2 Diabetes Risk Score',
    category: 'Endocrinology',
    icon: '🩺',
    description:
      'Finnish Diabetes Risk Score — predicts 10-year risk of developing type 2 diabetes without laboratory tests',
    formula:
      'Sum of 8 clinical variables (age, BMI, waist circumference, physical activity, diet, BP medications, hyperglycemia history, family history) = 0–26',
    reference: 'Lindstrom J, Tuomilehto J. Diabetes Care 2003 / WHO Diabetes Prevention Guidelines',
    inputs: [
      {
        id: 'age',
        label: 'Age',
        type: 'select',
        options: [
          { label: '<45 years (0 pts)', value: 0 },
          { label: '45–54 years (2 pts)', value: 2 },
          { label: '55–64 years (3 pts)', value: 3 },
          { label: '>64 years (4 pts)', value: 4 },
        ],
        defaultValue: 0,
      },
      {
        id: 'bmi',
        label: 'BMI',
        type: 'select',
        options: [
          { label: '<25 kg/m² (0 pts)', value: 0 },
          { label: '25–30 kg/m² (1 pt)', value: 1 },
          { label: '>30 kg/m² (3 pts)', value: 3 },
        ],
        defaultValue: 0,
      },
      {
        id: 'waist_m',
        label: 'Waist Circumference (Men)',
        type: 'select',
        options: [
          { label: '<94 cm / <89 cm (women) — 0 pts', value: 0 },
          { label: '94–102 cm / 80–88 cm (women) — 3 pts', value: 3 },
          { label: '>102 cm / >88 cm (women) — 4 pts', value: 4 },
        ],
        defaultValue: 0,
      },
      {
        id: 'activity',
        label: 'Physical Activity ≥30 min/day',
        type: 'select',
        options: [
          { label: 'Yes, daily or almost daily — 0 pts', value: 0 },
          { label: 'No — 2 pts', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'vegetables',
        label: 'Eat vegetables/fruit daily',
        type: 'select',
        options: [
          { label: 'Yes — 0 pts', value: 0 },
          { label: 'No — 1 pt', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'bp_meds',
        label: 'BP-lowering medication use',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 2 pts', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'high_glucose',
        label: 'History of high blood glucose (pregnancy, illness, etc.)',
        type: 'select',
        options: [
          { label: 'No — 0 pts', value: 0 },
          { label: 'Yes — 5 pts', value: 5 },
        ],
        defaultValue: 0,
      },
      {
        id: 'family',
        label: 'Family history of T2DM',
        type: 'select',
        options: [
          { label: 'None — 0 pts', value: 0 },
          { label: 'Grandparent, uncle, aunt, cousin — 3 pts', value: 3 },
          { label: 'Parent, sibling, own child — 5 pts', value: 5 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const score = [
        'age',
        'bmi',
        'waist_m',
        'activity',
        'vegetables',
        'bp_meds',
        'high_glucose',
        'family',
      ].reduce((s, k) => s + Number(v[k]), 0);
      const risk: CalculationResult['risk'] =
        score < 7 ? 'low' : score < 12 ? 'moderate' : score < 15 ? 'high' : 'critical';
      const category =
        score < 7
          ? 'Low risk (~1%)'
          : score < 12
            ? 'Slightly elevated risk (~4%)'
            : score < 15
              ? 'Moderate risk (~17%)'
              : score < 20
                ? 'High risk (~33%)'
                : 'Very high risk (~50%)';
      const prob10yr =
        score < 7 ? '~1%' : score < 12 ? '~4%' : score < 15 ? '~17%' : score < 20 ? '~33%' : '~50%';
      return {
        label: 'FINDRISC Score',
        value: score,
        unit: '/26',
        interpretation: `${category}. 10-year T2DM probability: ${prob10yr}. ${score >= 12 ? 'Lifestyle intervention strongly recommended — reduces T2DM incidence by 58%. Consider fasting glucose/HbA1c.' : 'Reinforce lifestyle prevention. Reassess in 3–5 years.'}`,
        risk,
        riskPercentage: `10-year T2DM risk: ${prob10yr}`,
        guidelineSource:
          'Lindstrom J & Tuomilehto J. Diabetes Care 2003 / WHO Prevention Guidelines',
        scoreBreakdown: [
          { component: 'Age', score: Number(v.age), max: 4 },
          { component: 'BMI', score: Number(v.bmi), max: 3 },
          { component: 'Waist Circumference', score: Number(v.waist_m), max: 4 },
          { component: 'Physical Inactivity', score: Number(v.activity), max: 2 },
          { component: 'Poor Diet (no daily veg/fruit)', score: Number(v.vegetables), max: 1 },
          { component: 'BP Medications', score: Number(v.bp_meds), max: 2 },
          { component: 'History High Glucose', score: Number(v.high_glucose), max: 5 },
          { component: 'Family History T2DM', score: Number(v.family), max: 5 },
          { component: 'TOTAL', score, max: 26 },
        ],
        details: [
          `FINDRISC: ${score}/26 — ${category} (10-year T2DM risk: ${prob10yr})`,
          score >= 12
            ? '→ Offer fasting plasma glucose and HbA1c to confirm or exclude prediabetes/T2DM'
            : '',
          score >= 12
            ? '→ Finnish Diabetes Prevention Study: 7% weight loss + 150 min/week exercise reduces T2DM by 58%'
            : '',
          score >= 15
            ? '→ Consider metformin for high-risk individuals with prediabetes + age <60 + BMI ≥35'
            : '',
          '→ Modifiable risk factors: BMI, physical activity, diet, BP control',
          '→ FINDRISC does not require laboratory tests — ideal for population-level screening',
          '→ Reassess FINDRISC annually or after significant lifestyle changes',
        ].filter(Boolean),
      };
    },
  },
  // 6. Steroid Dose Converter
  {
    id: 'steroid-dose-converter',
    name: 'Corticosteroid Dose Converter',
    category: 'Endocrinology',
    icon: '💊',
    description:
      'Convert between corticosteroid preparations showing anti-inflammatory equivalence AND mineralocorticoid potency',
    formula: 'Equivalent anti-inflammatory dose relative to hydrocortisone 20mg',
    reference: 'Czock D et al. Clin Pharmacokinet 2005 / Buttgereit F et al. Ann Rheum Dis 2002',
    inputs: [
      {
        id: 'drug',
        label: 'Current Corticosteroid',
        type: 'select',
        options: [
          { label: 'Hydrocortisone (Cortisol) — reference', value: 'hydrocortisone' },
          { label: 'Cortisone', value: 'cortisone' },
          { label: 'Prednisone', value: 'prednisone' },
          { label: 'Prednisolone', value: 'prednisolone' },
          { label: 'Methylprednisolone', value: 'methylprednisolone' },
          { label: 'Triamcinolone', value: 'triamcinolone' },
          { label: 'Dexamethasone', value: 'dexamethasone' },
          { label: 'Betamethasone', value: 'betamethasone' },
          { label: 'Fludrocortisone (mineralocorticoid only)', value: 'fludrocortisone' },
        ],
        defaultValue: 'prednisone',
      },
      {
        id: 'dose',
        label: 'Current Dose',
        type: 'number',
        unit: 'mg',
        min: 0.1,
        max: 1000,
        step: 0.1,
        defaultValue: 10,
      },
    ],
    calculate(v) {
      const dose = Number(v.dose),
        drug = String(v.drug);
      // Anti-inflammatory equivalence (relative to hydrocortisone 20mg)
      const EQUIV_ANTI: {
        [k: string]: {
          dose: number;
          half_life: string;
          mineralocorticoid: string;
          potency: number;
        };
      } = {
        hydrocortisone: {
          dose: 20,
          half_life: '8–12h',
          mineralocorticoid: '2+ (significant)',
          potency: 1,
        },
        cortisone: {
          dose: 25,
          half_life: '8–12h',
          mineralocorticoid: '2+ (significant)',
          potency: 0.8,
        },
        prednisone: { dose: 5, half_life: '12–36h', mineralocorticoid: '1+ (mild)', potency: 4 },
        prednisolone: { dose: 5, half_life: '12–36h', mineralocorticoid: '1+ (mild)', potency: 4 },
        methylprednisolone: {
          dose: 4,
          half_life: '12–36h',
          mineralocorticoid: '0 (none)',
          potency: 5,
        },
        triamcinolone: { dose: 4, half_life: '12–36h', mineralocorticoid: '0 (none)', potency: 5 },
        dexamethasone: {
          dose: 0.75,
          half_life: '36–54h',
          mineralocorticoid: '0 (none)',
          potency: 26.7,
        },
        betamethasone: {
          dose: 0.6,
          half_life: '36–54h',
          mineralocorticoid: '0 (none)',
          potency: 33.3,
        },
        fludrocortisone: {
          dose: null as number | null,
          half_life: '12–36h',
          mineralocorticoid: '125+ (very high)',
          potency: 10,
        },
      };
      const ref = EQUIV_ANTI[drug];
      const equivUnits = ref.dose !== null ? dose / ref.dose : 0; // equiv units of 20mg hydrocortisone
      // Equivalent doses of common steroids
      const hydrocortEq = ref.dose !== null ? (equivUnits * 20).toFixed(1) : 'N/A';
      const predniEq = ref.dose !== null ? (equivUnits * 5).toFixed(1) : 'N/A';
      const dexaEq = ref.dose !== null ? (equivUnits * 0.75).toFixed(2) : 'N/A';
      const methEq = ref.dose !== null ? (equivUnits * 4).toFixed(1) : 'N/A';
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: 'Hydrocortisone Equivalent',
        value: hydrocortEq,
        unit: 'mg',
        interpretation: `${dose}mg ${drug} = ${hydrocortEq}mg hydrocortisone equivalent. Half-life: ${ref.half_life}. Mineralocorticoid activity: ${ref.mineralocorticoid}.`,
        risk,
        guidelineSource: 'Czock D et al. Clin Pharmacokinet 2005 / Buttgereit F et al.',
        scoreBreakdown: [
          { component: 'Drug', score: drug },
          { component: 'Dose', score: dose + ' mg' },
          {
            component: 'Relative Anti-inflammatory Potency',
            score: '×' + ref.potency + ' vs hydrocortisone',
          },
          { component: 'Half-life', score: ref.half_life },
          { component: 'Mineralocorticoid Activity', score: ref.mineralocorticoid },
          { component: '≡ Hydrocortisone', score: hydrocortEq + ' mg' },
          { component: '≡ Prednisone/Prednisolone', score: predniEq + ' mg' },
          { component: '≡ Dexamethasone', score: dexaEq + ' mg' },
          { component: '≡ Methylprednisolone', score: methEq + ' mg' },
        ],
        details: [
          `${dose}mg ${drug} = ${hydrocortEq}mg hydrocortisone = ${predniEq}mg prednisone = ${dexaEq}mg dexamethasone`,
          `Anti-inflammatory potency: ${ref.potency}× hydrocortisone | Half-life: ${ref.half_life}`,
          `Mineralocorticoid activity: ${ref.mineralocorticoid}`,
          '⚠️ Anti-inflammatory equivalence ≠ mineralocorticoid equivalence — consider both properties',
          '→ Dexamethasone has virtually no mineralocorticoid activity — preferred in edema-prone patients',
          '→ Fludrocortisone is used solely for mineralocorticoid replacement (Addisons, orthostatic hypotension)',
          '→ Tapering: after >3 weeks of systemic steroids, taper slowly to prevent adrenal crisis',
          '→ Adrenal crisis prevention: double dose during physiological stress (illness, surgery)',
        ],
      };
    },
  },
  // 7. Thyroid Function Interpreter
  {
    id: 'thyroid-function-interpreter',
    name: 'Thyroid Function Test Interpreter',
    category: 'Endocrinology',
    icon: '🦋',
    description:
      'Interpret TSH, Free T4, and Free T3 results to classify thyroid status and guide management',
    formula:
      'Pattern recognition: TSH-FT4-FT3 relationship determines primary vs secondary thyroid disorder',
    reference:
      'ATA/AACE Hypothyroidism Guidelines 2012 (updated 2014) / ATA Hyperthyroidism Guidelines 2016',
    inputs: [
      {
        id: 'tsh',
        label: 'TSH (Thyroid Stimulating Hormone)',
        type: 'number',
        unit: 'mIU/L',
        min: 0,
        max: 150,
        step: 0.01,
        defaultValue: 2.0,
        placeholder: 'e.g. 2.0 (normal 0.4–4.0)',
      },
      {
        id: 'ft4',
        label: 'Free T4 (Thyroxine)',
        type: 'number',
        unit: 'ng/dL',
        min: 0,
        max: 10,
        step: 0.01,
        defaultValue: 1.1,
        placeholder: 'e.g. 1.1 (normal 0.8–1.8)',
      },
      {
        id: 'ft3',
        label: 'Free T3 (Triiodothyronine — optional)',
        type: 'number',
        unit: 'pg/mL',
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 3.0,
        placeholder: 'e.g. 3.0 (normal 2.3–4.2)',
      },
    ],
    calculate(v) {
      const tsh = Number(v.tsh),
        ft4 = Number(v.ft4),
        ft3 = Number(v.ft3);
      // Classify thyroid status
      let status: string, risk: CalculationResult['risk'], interpretation: string, action: string;
      if (tsh > 4.0 && ft4 < 0.8) {
        status = 'Overt Hypothyroidism';
        risk = 'high';
        interpretation =
          'TSH elevated + FT4 low = primary hypothyroidism — levothyroxine indicated';
        action = 'Initiate levothyroxine 1.6 mcg/kg/day; recheck TSH in 6–8 weeks';
      } else if (tsh > 4.0 && ft4 >= 0.8) {
        status = 'Subclinical Hypothyroidism';
        risk = 'moderate';
        interpretation = 'TSH elevated with normal FT4 = subclinical hypothyroidism';
        action =
          'Treat if TSH >10, pregnant, symptoms, or age <70 with TSH >7. Recheck in 3–6 months if TSH 4–10';
      } else if (tsh < 0.4 && ft4 > 1.8) {
        status = 'Overt Hyperthyroidism';
        risk = 'high';
        interpretation = 'TSH suppressed + FT4 elevated = overt hyperthyroidism';
        action =
          'Endocrinology referral; TFTs, TSI, thyroid uptake scan; consider methimazole or radioiodine';
      } else if (tsh < 0.4 && ft4 <= 1.8) {
        status = 'Subclinical Hyperthyroidism';
        risk = 'moderate';
        interpretation = 'TSH suppressed with normal FT4 = subclinical hyperthyroidism';
        action =
          'Monitor; treat if TSH <0.1, AF, or age >65 (osteoporosis/AF risk); thyroid scan to identify cause';
      } else if (tsh < 0.4 && ft4 < 0.8) {
        status = 'Secondary Hypothyroidism (Central)';
        risk = 'high';
        interpretation =
          'TSH low/normal + FT4 low = central hypothyroidism (pituitary/hypothalamic)';
        action =
          'MRI pituitary; check cortisol before starting levothyroxine (risk of adrenal crisis if central AI)';
      } else {
        status = 'Euthyroid (Normal)';
        risk = 'low';
        interpretation = 'TSH and FT4 within normal reference range';
        action =
          'No thyroid treatment required. Reassess annually if risk factors (autoimmune disease, prior thyroid disease, family history)';
      }
      const ft3Status =
        ft3 > 0
          ? ft3 < 2.3
            ? 'FT3 low (possible sick euthyroid or T3 deficiency)'
            : ft3 > 4.2
              ? 'FT3 elevated (T3 toxicosis if TSH suppressed)'
              : 'FT3 normal'
          : '';
      return {
        label: 'Thyroid Status',
        value: status,
        interpretation: `${interpretation}. ${ft3Status} Action: ${action}.`,
        risk,
        riskPercentage:
          status !== 'Euthyroid (Normal)' ? `${status} — intervention may be required` : undefined,
        guidelineSource:
          'ATA/AACE Hypothyroidism Guidelines 2014 / ATA Hyperthyroidism Guidelines 2016',
        scoreBreakdown: [
          { component: 'TSH', score: tsh + ' mIU/L (normal 0.4–4.0)' },
          { component: 'Free T4', score: ft4 + ' ng/dL (normal 0.8–1.8)' },
          {
            component: 'Free T3',
            score: ft3 > 0 ? ft3 + ' pg/mL (normal 2.3–4.2)' : 'Not entered',
          },
          { component: 'Thyroid Status', score: status },
          { component: 'Interpretation', score: interpretation.split(' = ')[1] || interpretation },
        ],
        details: [
          `TSH: ${tsh} mIU/L | FT4: ${ft4} ng/dL | FT3: ${ft3 > 0 ? ft3 + ' pg/mL' : 'not measured'}`,
          `Status: ${status}`,
          `Action: ${action}`,
          ft3Status,
          status.includes('Hypoth')
            ? '→ Levothyroxine: 1.6 mcg/kg/day; halve dose in elderly or cardiac disease'
            : '',
          status.includes('Hyperth')
            ? '→ Beta-blocker (propranolol) for symptomatic relief while awaiting definitive treatment'
            : '',
          status.includes('Overt')
            ? '⚠️ Thyroid storm risk during illness, surgery, or contrast: propylthiouracil/methimazole + beta-blocker'
            : '',
          '→ Recheck TSH 6–8 weeks after dose initiation or change — TSH has long half-life',
        ].filter(Boolean),
      };
    },
  },
  // 8. Ideal Body Weight Calculator
  {
    id: 'ideal-body-weight-med',
    name: 'Ideal Body Weight (IBW) & Adjusted Body Weight',
    category: 'Endocrinology',
    icon: '⚖️',
    description:
      'Calculate IBW (Devine formula) and Adjusted Body Weight (ABW) for drug dosing in obesity',
    formula:
      'IBW male = 50 + 2.3×(height in inches − 60) | IBW female = 45.5 + 2.3×(height in inches − 60) | ABW = IBW + 0.4×(ABW−IBW)',
    reference: 'Devine BJ. Drug Intell Clin Pharm 1974 / Clinical pharmacology dosing standards',
    inputs: [
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        unit: 'cm',
        min: 100,
        max: 230,
        step: 0.5,
        defaultValue: 170,
        placeholder: 'e.g. 170',
      },
      {
        id: 'weight',
        label: 'Actual Body Weight',
        type: 'number',
        unit: 'kg',
        min: 10,
        max: 500,
        step: 0.1,
        defaultValue: 90,
        placeholder: 'e.g. 90',
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        defaultValue: 'male',
      },
    ],
    calculate(v) {
      const ht = Number(v.height),
        wt = Number(v.weight);
      const htIn = ht / 2.54;
      const excessIn = Math.max(0, htIn - 60);
      const ibw = (v.sex === 'male' ? 50 : 45.5) + 2.3 * excessIn;
      const abw = ibw + 0.4 * (wt - ibw);
      const pctIBW = (wt / ibw) * 100;
      const bmi = wt / (ht / 100) ** 2;
      const obese = wt > ibw * 1.3; // >130% IBW = obese for dosing purposes
      const risk: CalculationResult['risk'] =
        bmi < 18.5 ? 'moderate' : bmi < 25 ? 'low' : bmi < 30 ? 'low' : 'moderate';
      return {
        label: 'IBW',
        value: ibw.toFixed(1),
        unit: 'kg',
        interpretation: `IBW: ${ibw.toFixed(1)} kg | Actual weight: ${wt} kg (${pctIBW.toFixed(0)}% IBW). ${obese ? 'Obese (>130% IBW) — use Adjusted Body Weight (ABW = ' + abw.toFixed(1) + ' kg) for most drug dosing' : ' Weight within dosing range — use actual weight for most drugs'}.`,
        risk,
        guidelineSource: 'Devine BJ. Drug Intell Clin Pharm 1974 / ASHP Pharmacokinetic Guidelines',
        scoreBreakdown: [
          { component: 'Height', score: ht + ' cm (' + htIn.toFixed(1) + ' inches)' },
          { component: 'Actual Body Weight (ABW)', score: wt + ' kg' },
          { component: 'IBW (Devine formula)', score: ibw.toFixed(1) + ' kg' },
          { component: '% IBW', score: pctIBW.toFixed(0) + '%' },
          { component: 'Adjusted Body Weight (ABW)', score: abw.toFixed(1) + ' kg' },
          { component: 'BMI', score: bmi.toFixed(1) + ' kg/m²' },
          {
            component: 'For drug dosing',
            score: obese ? 'Use ABW ' + abw.toFixed(1) + ' kg' : 'Use actual weight ' + wt + ' kg',
          },
        ],
        details: [
          `IBW: ${ibw.toFixed(1)} kg | Actual: ${wt} kg | ${pctIBW.toFixed(0)}% of IBW`,
          `ABW: ${abw.toFixed(1)} kg (IBW + 0.4 × [Actual − IBW])`,
          '→ Use IBW for: aminoglycoside dosing, vancomycin, digoxin, mechanical ventilation TV (6 mL/kg IBW)',
          '→ Use ABW for: most drugs in obese patients if >130% IBW',
          '→ Use actual body weight: chemotherapy (BSA-based), heparin, LMWH',
          '⚠️ Always check drug-specific prescribing information for which weight to use',
          '→ ABW formula: IBW + 0.4 × (Actual weight − IBW) — applicable when Actual >130% IBW',
        ],
      };
    },
  },
  // 9. Waist-Hip Ratio / Metabolic Syndrome Checker
  {
    id: 'metabolic-syndrome-checker',
    name: 'Metabolic Syndrome Assessment',
    category: 'Endocrinology',
    icon: '📏',
    description:
      'Assess metabolic syndrome using IDF/AHA/NHLBI criteria — waist circumference, BP, glucose, lipids',
    formula:
      'Metabolic syndrome = waist + any 2 of: TG≥150, HDL low, BP≥130/85, FG≥100 mg/dL (IDF/AHA 2009 harmonized criteria)',
    reference: 'Alberti KG et al. Circulation 2009 (Harmonized IDF/AHA/NHLBI criteria)',
    inputs: [
      {
        id: 'waist',
        label: 'Waist Circumference',
        type: 'number',
        unit: 'cm',
        min: 50,
        max: 200,
        defaultValue: 90,
        placeholder: 'At navel level',
      },
      {
        id: 'sex',
        label: 'Sex (for waist threshold)',
        type: 'select',
        options: [
          { label: 'Male (threshold ≥102cm US / ≥94cm Europe)', value: 'male' },
          { label: 'Female (threshold ≥88cm US / ≥80cm Europe)', value: 'female' },
        ],
        defaultValue: 'male',
      },
      {
        id: 'tg',
        label: 'Triglycerides',
        type: 'number',
        unit: 'mg/dL',
        min: 30,
        max: 1000,
        defaultValue: 120,
        placeholder: 'e.g. 120',
      },
      {
        id: 'hdl',
        label: 'HDL Cholesterol',
        type: 'number',
        unit: 'mg/dL',
        min: 10,
        max: 100,
        defaultValue: 48,
        placeholder: 'e.g. 48',
      },
      {
        id: 'sbp',
        label: 'Systolic Blood Pressure',
        type: 'number',
        unit: 'mmHg',
        min: 80,
        max: 250,
        defaultValue: 125,
        placeholder: 'e.g. 125',
      },
      {
        id: 'dbp',
        label: 'Diastolic Blood Pressure',
        type: 'number',
        unit: 'mmHg',
        min: 40,
        max: 150,
        defaultValue: 82,
        placeholder: 'e.g. 82',
      },
      {
        id: 'fasting_glucose',
        label: 'Fasting Plasma Glucose',
        type: 'number',
        unit: 'mg/dL',
        min: 50,
        max: 400,
        defaultValue: 95,
        placeholder: 'e.g. 95',
      },
    ],
    calculate(v) {
      const waist = Number(v.waist),
        tg = Number(v.tg),
        hdl = Number(v.hdl);
      const sbp = Number(v.sbp),
        dbp = Number(v.dbp),
        fg = Number(v.fasting_glucose);
      const isMale = v.sex === 'male';
      // Harmonized criteria (IDF/AHA 2009)
      const waistCrit = isMale ? waist >= 94 : waist >= 80; // European thresholds (lower)
      const tgCrit = tg >= 150;
      const hdlCrit = isMale ? hdl < 40 : hdl < 50;
      const bpCrit = sbp >= 130 || dbp >= 85;
      const fgCrit = fg >= 100;
      const criteriaCount = [waistCrit, tgCrit, hdlCrit, bpCrit, fgCrit].filter(Boolean).length;
      const metSyndrome = waistCrit && criteriaCount >= 3; // waist required + ≥2 others (=3 total)
      const risk: CalculationResult['risk'] = metSyndrome
        ? 'high'
        : criteriaCount >= 2
          ? 'moderate'
          : 'low';
      return {
        label: 'Metabolic Syndrome',
        value: metSyndrome ? 'PRESENT' : 'ABSENT',
        interpretation: `${criteriaCount}/5 criteria met. ${metSyndrome ? 'Metabolic syndrome criteria SATISFIED — significantly increased CVD and T2DM risk.' : 'Metabolic syndrome criteria NOT fully met — ' + (criteriaCount >= 2 ? 'close monitoring recommended' : 'no metabolic syndrome') + '.'}`,
        risk,
        riskPercentage: metSyndrome ? 'CVD risk 2× | T2DM risk 5× in next 10 years' : undefined,
        guidelineSource: 'Alberti KG et al. Circulation 2009 (Harmonized IDF/AHA/NHLBI criteria)',
        scoreBreakdown: [
          {
            component: 'Waist Circumference',
            score:
              waist +
              'cm ' +
              (waistCrit ? '✓ ELEVATED (≥' + (isMale ? 94 : 80) + 'cm)' : '✓ Normal'),
          },
          {
            component: 'Triglycerides',
            score: tg + ' mg/dL ' + (tgCrit ? '✓ ELEVATED (≥150)' : 'Normal'),
          },
          {
            component: 'HDL Cholesterol',
            score: hdl + ' mg/dL ' + (hdlCrit ? '✓ LOW (<' + (isMale ? 40 : 50) + ')' : 'Normal'),
          },
          {
            component: 'Blood Pressure',
            score: sbp + '/' + dbp + ' mmHg ' + (bpCrit ? '✓ ELEVATED (≥130/85)' : 'Normal'),
          },
          {
            component: 'Fasting Glucose',
            score: fg + ' mg/dL ' + (fgCrit ? '✓ ELEVATED (≥100)' : 'Normal'),
          },
          { component: 'Criteria Met', score: criteriaCount + '/5' },
          {
            component: 'Metabolic Syndrome',
            score: metSyndrome ? 'PRESENT (≥3 criteria)' : 'ABSENT (<3 criteria)',
          },
        ],
        details: [
          `Metabolic syndrome: ${metSyndrome ? 'PRESENT' : 'ABSENT'} (${criteriaCount}/5 criteria met)`,
          metSyndrome ? '→ CVD risk ~2× higher; T2DM risk ~5× higher over 10 years' : '',
          '→ Lifestyle interventions: Mediterranean diet, 150+ min/week aerobic exercise, 5–10% weight loss',
          waistCrit
            ? '→ Waist reduction is the single most impactful intervention for metabolic syndrome'
            : '',
          tgCrit
            ? '→ Elevated TG: omega-3 fatty acids, fibrates (fenofibrate), reduce refined carbs/alcohol'
            : '',
          hdlCrit ? '→ Low HDL: aerobic exercise, niacin (limited evidence), reduce TG' : '',
          bpCrit ? '→ BP ≥130/85: ACE-I/ARB preferred in metabolic syndrome' : '',
          fgCrit ? '→ Impaired fasting glucose: lifestyle intervention, consider metformin' : '',
        ].filter(Boolean),
      };
    },
  },
  // 10. Visual Acuity Converter
  {
    id: 'visual-acuity-converter',
    name: 'Visual Acuity Converter (Snellen / LogMAR / Decimal)',
    category: 'Endocrinology',
    icon: '👁️',
    description:
      'Convert between visual acuity formats for diabetic retinopathy and ophthalmology documentation',
    formula:
      'LogMAR = log10(denominator/numerator) | Decimal = numerator/denominator | Snellen US = 20/x, Metric = 6/x',
    reference: 'Bailey IL, Lovie JE. Am J Optom 1976 / WHO Visual Impairment Classification',
    inputs: [
      {
        id: 'numerator',
        label: 'Snellen Numerator (test distance)',
        type: 'number',
        unit: '',
        min: 1,
        max: 20,
        defaultValue: 20,
        placeholder: '20 (US) or 6 (metric)',
      },
      {
        id: 'denominator',
        label: 'Snellen Denominator (chart equivalent distance)',
        type: 'number',
        unit: '',
        min: 10,
        max: 1000,
        defaultValue: 20,
        placeholder: 'e.g. 20, 40, 200',
      },
    ],
    calculate(v) {
      const num = Number(v.numerator),
        den = Number(v.denominator);
      const decimal = num / den;
      const logmar = Math.log10(den / num);
      const snellen_us = `20/${Math.round(den * (20 / num))}`;
      const snellen_m = `6/${Math.round(den * (6 / num))}`;
      const category =
        decimal >= 1
          ? 'Normal vision (≥20/20)'
          : decimal >= 0.5
            ? 'Mild impairment (20/40)'
            : decimal >= 0.1
              ? 'Moderate impairment (20/200)'
              : decimal >= 0.05
                ? 'Severe impairment (20/400)'
                : 'Profound/Blind (<20/400)';
      const risk: CalculationResult['risk'] =
        decimal >= 0.5 ? 'low' : decimal >= 0.1 ? 'moderate' : 'high';
      const drivingNote =
        decimal < 0.5
          ? 'Below US driving standard (20/40 required in most states)'
          : 'Meets US driving vision standard (≥20/40)';
      return {
        label: 'Decimal VA',
        value: decimal.toFixed(2),
        unit: '',
        interpretation: `Snellen: ${snellen_us} (US) / ${snellen_m} (metric). Decimal: ${decimal.toFixed(2)}. LogMAR: ${logmar.toFixed(2)}. WHO: ${category}. ${drivingNote}.`,
        risk,
        guidelineSource: 'WHO Visual Impairment Classification / Bailey IL & Lovie JE 1976',
        scoreBreakdown: [
          { component: 'Snellen (US)', score: snellen_us },
          { component: 'Snellen (Metric)', score: snellen_m },
          { component: 'Decimal', score: decimal.toFixed(2) },
          { component: 'LogMAR', score: logmar.toFixed(2) },
          { component: 'WHO Category', score: category },
          { component: 'Driving Eligibility (US)', score: drivingNote },
        ],
        details: [
          `VA: ${snellen_us} | Decimal: ${decimal.toFixed(2)} | LogMAR: ${logmar.toFixed(2)} | ${category}`,
          `WHO impairment: ${category}`,
          drivingNote,
          '→ Diabetic retinopathy screening: annual dilated fundus exam for T1DM ≥5yr, T2DM at diagnosis',
          '→ VA <20/40: refer to ophthalmology for further evaluation',
          '→ VA <20/200 in better eye: legal blindness in US (qualifies for disability benefits)',
          '→ LogMAR 0.0 = 20/20 (normal) | LogMAR 1.0 = 20/200 (legal blindness threshold)',
        ],
      };
    },
  },
];

export const pharmacologyConfigs: MedicalConfig[] = [
  // 1. Vancomycin AUC-Guided Dosing
  {
    id: 'vancomycin-dosing-calculator',
    name: 'Vancomycin AUC/MIC-Guided Dosing',
    category: 'Pharmacology',
    icon: '🧬',
    description:
      'Calculate vancomycin loading and maintenance doses targeting AUC/MIC 400-600 per ASHP/IDSA 2020 guidelines',
    formula:
      'CrCl (CG) guides maintenance dose | Loading dose: 25-30 mg/kg | Maintenance: 15-20 mg/kg q8-24h based on CrCl',
    reference: 'ASHP/IDSA/SIDP Vancomycin Consensus Guidelines 2020',
    inputs: [
      {
        id: 'weight',
        label: 'Actual Body Weight',
        type: 'number',
        unit: 'kg',
        min: 20,
        max: 300,
        step: 0.1,
        defaultValue: 70,
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        unit: 'cm',
        min: 100,
        max: 230,
        defaultValue: 170,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 110,
        defaultValue: 50,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        defaultValue: 'male',
      },
      {
        id: 'creatinine',
        label: 'Serum Creatinine',
        type: 'number',
        unit: 'mg/dL',
        min: 0.4,
        max: 15,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: 'indication',
        label: 'Indication / Infection Severity',
        type: 'select',
        options: [
          { label: 'Serious MRSA (bacteremia, endocarditis, pneumonia)', value: 'serious' },
          { label: 'Skin/Soft tissue, UTI (less severe)', value: 'mild' },
        ],
        defaultValue: 'serious',
      },
    ],
    calculate(v) {
      const wt = Number(v.weight),
        ht = Number(v.height),
        age = Number(v.age),
        cr = Number(v.creatinine);
      const isMale = v.sex === 'male',
        serious = v.indication === 'serious';
      // IBW for CG
      const htIn = ht / 2.54,
        excessIn = Math.max(0, htIn - 60);
      const ibw = (isMale ? 50 : 45.5) + 2.3 * excessIn;
      const abw = wt > ibw * 1.3 ? ibw + 0.4 * (wt - ibw) : wt;
      // Cockcroft-Gault with appropriate weight
      let crcl = ((140 - age) * abw) / (72 * cr);
      if (!isMale) crcl *= 0.85;
      // Loading dose (use actual weight)
      const loadDose = Math.round((wt * 25) / 250) * 250; // round to nearest 250mg
      const loadDoseMgKg = 25;
      // Maintenance interval based on CrCl
      let interval: number, mainDose: number;
      if (crcl >= 70) {
        interval = 8;
        mainDose = Math.round((wt * (serious ? 15 : 10)) / 250) * 250;
      } else if (crcl >= 40) {
        interval = 12;
        mainDose = Math.round((wt * 15) / 250) * 250;
      } else if (crcl >= 20) {
        interval = 24;
        mainDose = Math.round((wt * 15) / 250) * 250;
      } else {
        interval = 48;
        mainDose = Math.round((wt * 15) / 500) * 500;
      }
      // Minimum/maximum dose caps
      mainDose = Math.max(500, Math.min(3000, mainDose));
      const risk: CalculationResult['risk'] = crcl >= 40 ? 'low' : crcl >= 20 ? 'moderate' : 'high';
      return {
        label: 'Maintenance Dose',
        value: mainDose,
        unit: 'mg q' + interval + 'h',
        interpretation: `Loading dose: ${loadDose}mg (25mg/kg actual weight) once. Maintenance: ${mainDose}mg every ${interval}h (CrCl: ${crcl.toFixed(0)} mL/min, weight used: ${abw.toFixed(1)}kg). Target AUC/MIC: 400-600 mg*h/L.`,
        risk,
        riskPercentage: `CrCl ${crcl.toFixed(0)} mL/min — dose interval: q${interval}h`,
        guidelineSource: 'ASHP/IDSA/SIDP Vancomycin Consensus Guidelines 2020',
        scoreBreakdown: [
          { component: 'CrCl (Cockcroft-Gault)', score: crcl.toFixed(0) + ' mL/min' },
          { component: 'Weight used (ABW)', score: abw.toFixed(1) + ' kg' },
          { component: 'Loading dose', score: loadDose + ' mg (' + loadDoseMgKg + ' mg/kg)' },
          { component: 'Maintenance dose', score: mainDose + ' mg' },
          { component: 'Dosing interval', score: 'q' + interval + 'h' },
          { component: 'AUC/MIC target', score: '400-600 mg*h/L (assuming MIC 1 mg/L)' },
        ],
        details: [
          `Loading: ${loadDose}mg once | Maintenance: ${mainDose}mg q${interval}h`,
          `CrCl: ${crcl.toFixed(0)} mL/min | Weight used: ${abw.toFixed(1)}kg (ABW)`,
          'AUC/MIC target: 400-600 mg*h/L (replaces old trough-only monitoring)',
          '-> Use Bayesian dosing software (e.g. DoseMe, InsightRx) for AUC estimation',
          '-> Trough only acceptable if AUC software unavailable: target 10-20 mg/L (serious), 5-15 (mild)',
          '-> Infuse over 60-90 min; slow infusion rate if Red Man Syndrome occurs',
          '-> Monitor SCr every 48-72h during therapy; check trough before 3rd or 4th dose',
          crcl < 20
            ? 'WARNING: CrCl <20 - extended interval or single-dose monitoring required'
            : '',
          '-> Concurrent nephrotoxins (NSAIDs, aminoglycosides, iodinated contrast): heightened AKI risk',
          'HIGH-ALERT MEDICATION: Independent pharmacist verification required before administration',
        ].filter(Boolean),
      };
    },
  },
  // 2. Drug Half-Life Calculator
  {
    id: 'drug-half-life-calculator',
    name: 'Drug Half-Life & Steady-State Calculator',
    category: 'Pharmacology',
    icon: '⏱️',
    description:
      'Calculate drug half-life, time to steady state, and washout time based on elimination rate constant',
    formula: 't1/2 = 0.693 / Ke | Steady state: 5 x t1/2 | Washout: 5 x t1/2 (97% eliminated)',
    reference: 'Rowland M, Tozer TN. Clinical Pharmacokinetics 1995 / Basic Pharmacokinetics',
    inputs: [
      {
        id: 'halflife',
        label: 'Drug Half-Life',
        type: 'number',
        unit: 'hours',
        min: 0.1,
        max: 10000,
        step: 0.1,
        defaultValue: 24,
        placeholder: 'e.g. 24h for once-daily drugs',
      },
      {
        id: 'dose_interval',
        label: 'Dosing Interval',
        type: 'number',
        unit: 'hours',
        min: 1,
        max: 168,
        step: 1,
        defaultValue: 24,
        placeholder: 'e.g. 24 for once daily',
      },
      {
        id: 'num_doses',
        label: 'Doses Administered So Far',
        type: 'number',
        unit: 'doses',
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 1,
      },
    ],
    calculate(v) {
      const t12 = Number(v.halflife),
        interval = Number(v.dose_interval),
        numDoses = Number(v.num_doses);
      const timeToSS = 5 * t12;
      const washout = 5 * t12;
      const ke = 0.693 / t12;
      const accumFactor = 1 / (1 - Math.exp(-ke * interval)); // accumulation factor at steady state
      // % of steady state reached after n doses
      const pctSS = (1 - Math.exp(-ke * interval * numDoses)) * 100;
      const daysToSS = timeToSS / 24;
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: 'Time to Steady State',
        value: timeToSS.toFixed(0),
        unit: 'hours',
        interpretation: `Half-life: ${t12}h. Steady state reached in ~${timeToSS.toFixed(0)}h (${daysToSS.toFixed(1)} days). After ${numDoses} doses: ${pctSS.toFixed(0)}% of steady state. Accumulation factor: ${accumFactor.toFixed(2)}x. Washout: ${washout.toFixed(0)}h (${(washout / 24).toFixed(1)} days).`,
        risk,
        guidelineSource: 'Rowland M & Tozer TN. Clinical Pharmacokinetics 4th Ed.',
        scoreBreakdown: [
          { component: 'Drug Half-life', score: t12 + 'h' },
          { component: 'Elimination Rate (Ke)', score: ke.toFixed(4) + ' h-1' },
          { component: 'Dosing Interval', score: 'q' + interval + 'h' },
          {
            component: '% Steady State after ' + numDoses + ' doses',
            score: pctSS.toFixed(0) + '%',
          },
          {
            component: 'Time to Steady State (5xT1/2)',
            score: timeToSS.toFixed(0) + 'h (' + daysToSS.toFixed(1) + ' days)',
          },
          { component: 'Accumulation Factor', score: accumFactor.toFixed(2) + 'x' },
          {
            component: 'Complete Washout (5xT1/2)',
            score: washout.toFixed(0) + 'h (' + (washout / 24).toFixed(1) + ' days)',
          },
        ],
        details: [
          `Half-life: ${t12}h | Ke: ${ke.toFixed(4)} h-1 | Steady state: ~${daysToSS.toFixed(1)} days`,
          `After ${numDoses} doses at q${interval}h: ${pctSS.toFixed(0)}% of steady-state concentration`,
          `Drug washout (${washout.toFixed(0)}h): relevant for drug switching, DDI avoidance, pregnancy`,
          '-> Drug level monitoring: draw levels only after steady state (5 half-lives) unless urgent',
          t12 > 72
            ? '-> Long half-life: loading dose may be needed to achieve rapid therapeutic levels'
            : '',
          interval > t12 * 2
            ? 'WARNING: Dosing interval much longer than half-life - significant peak/trough variation'
            : '',
        ].filter(Boolean),
      };
    },
  },
  // 3. Weight-Based Drug Dose (Adult)
  {
    id: 'weight-based-drug-dose-med',
    name: 'Weight-Based Drug Dose Calculator',
    category: 'Pharmacology',
    icon: '💊',
    description:
      'Calculate single and daily doses for weight-based medications with IBW/ABW/actual weight options',
    formula: 'Single dose = Weight (kg) x Dose per kg | Daily dose = Single dose x Doses per day',
    reference: 'ASHP Drug Information / Clinical Pharmacology Standards / Lexicomp',
    inputs: [
      {
        id: 'weight',
        label: 'Patient Weight',
        type: 'number',
        unit: 'kg',
        min: 1,
        max: 400,
        step: 0.1,
        defaultValue: 70,
        placeholder: 'e.g. 70',
      },
      {
        id: 'dose_per_kg',
        label: 'Prescribed Dose',
        type: 'number',
        unit: 'mg/kg',
        min: 0.001,
        max: 500,
        step: 0.001,
        defaultValue: 10,
        placeholder: 'e.g. 10',
      },
      {
        id: 'frequency',
        label: 'Doses Per Day',
        type: 'number',
        unit: 'per day',
        min: 0.14,
        max: 24,
        step: 0.5,
        defaultValue: 3,
        placeholder: 'e.g. 3 (q8h) or 1 (once daily)',
      },
      {
        id: 'max_dose',
        label: 'Maximum Single Dose Cap (0 = no cap)',
        type: 'number',
        unit: 'mg',
        min: 0,
        max: 10000,
        step: 10,
        defaultValue: 0,
        placeholder: 'e.g. 1000 or 0 if no cap',
      },
      {
        id: 'weight_type',
        label: 'Weight Type Used',
        type: 'select',
        options: [
          { label: 'Actual Body Weight (ABW)', value: 'actual' },
          { label: 'Ideal Body Weight (IBW)', value: 'ibw' },
          { label: 'Adjusted Body Weight (ABW = IBW + 0.4 x excess)', value: 'adjusted' },
        ],
        defaultValue: 'actual',
      },
    ],
    calculate(v) {
      const wt = Number(v.weight),
        dosePerKg = Number(v.dose_per_kg),
        freq = Number(v.frequency);
      const maxDose = Number(v.max_dose),
        wtType = String(v.weight_type);
      let singleDose = wt * dosePerKg;
      if (maxDose > 0 && singleDose > maxDose) {
        singleDose = maxDose;
      }
      const dailyDose = singleDose * freq;
      const cappedNote =
        maxDose > 0 && wt * dosePerKg > maxDose ? ' (capped at max ' + maxDose + 'mg)' : '';
      const risk: CalculationResult['risk'] = 'low';
      const wtLabel = wtType === 'actual' ? 'Actual BW' : wtType === 'ibw' ? 'IBW' : 'Adjusted BW';
      return {
        label: 'Single Dose',
        value: singleDose.toFixed(1),
        unit: 'mg' + cappedNote,
        interpretation: `Single dose: ${singleDose.toFixed(1)}mg${cappedNote} (${dosePerKg}mg/kg x ${wt}kg ${wtLabel}). Daily dose: ${dailyDose.toFixed(0)}mg/day (${freq} doses x ${singleDose.toFixed(1)}mg).`,
        risk,
        guidelineSource: 'ASHP Drug Information / Lexicomp / Clinical Pharmacology',
        scoreBreakdown: [
          { component: 'Weight (' + wtLabel + ')', score: wt + ' kg' },
          { component: 'Dose per kg', score: dosePerKg + ' mg/kg' },
          { component: 'Frequency', score: freq + 'x per day' },
          { component: 'Calculated single dose', score: (wt * dosePerKg).toFixed(1) + ' mg' },
          { component: 'Max dose cap', score: maxDose > 0 ? maxDose + ' mg' : 'None' },
          { component: 'Final single dose', score: singleDose.toFixed(1) + ' mg' },
          { component: 'Total daily dose', score: dailyDose.toFixed(0) + ' mg/day' },
        ],
        details: [
          `Single dose: ${singleDose.toFixed(1)}mg | Daily: ${dailyDose.toFixed(0)}mg/day`,
          cappedNote
            ? 'NOTE: Calculated ' +
              (wt * dosePerKg).toFixed(0) +
              'mg exceeds max cap of ' +
              maxDose +
              'mg - using ' +
              maxDose +
              'mg'
            : '',
          '-> Pharmacist verification required for all high-alert medications',
          '-> Obesity: verify correct weight type in drug prescribing information',
          '-> Pediatric patients: ALWAYS check against adult maximum dose regardless of weight',
          '-> Round to nearest commercially available formulation to avoid measurement errors',
          'HIGH-ALERT: Document weight type used (ABW/IBW/actual) in medication order',
        ].filter(Boolean),
      };
    },
  },
  // 4. Opioid Equianalgesic Converter
  {
    id: 'opioid-equianalgesic-med',
    name: 'Opioid Equianalgesic Converter (OME)',
    category: 'Pharmacology',
    icon: '💊',
    description:
      'Convert between opioids using oral morphine equivalents (OME) with 25-50% dose reduction for incomplete cross-tolerance',
    formula:
      'OME = Dose x Potency factor | Converted dose = (OME / target factor) x 0.5-0.75 (cross-tolerance reduction)',
    reference: 'CDC Opioid Prescribing Guideline 2022 / DCMS Opioid Guidelines 2016',
    inputs: [
      {
        id: 'current_dose',
        label: 'Current Opioid Dose',
        type: 'number',
        unit: 'mg',
        min: 0.01,
        max: 5000,
        step: 0.01,
        defaultValue: 10,
        placeholder: 'e.g. 10',
      },
      {
        id: 'current_drug',
        label: 'Current Opioid',
        type: 'select',
        options: [
          { label: 'Oral Morphine (reference, OME x1)', value: 1 },
          { label: 'IV/SC Morphine (OME x3)', value: 3 },
          { label: 'Oral Oxycodone (OME x1.5)', value: 1.5 },
          { label: 'IV Hydromorphone (OME x20)', value: 20 },
          { label: 'Oral Hydromorphone (OME x5)', value: 5 },
          { label: 'Transdermal Fentanyl patch (mcg/hr → x2.4 for 24h OME)', value: 2.4 },
          { label: 'IV Fentanyl mcg (OME x0.1)', value: 0.1 },
          { label: 'Oral Codeine (OME x0.15)', value: 0.15 },
          { label: 'Oral Tramadol (OME x0.1)', value: 0.1 },
          { label: 'Buprenorphine patch mcg/hr (OME x1.5)', value: 1.5 },
        ],
        defaultValue: 1,
      },
      {
        id: 'target_drug',
        label: 'Target Opioid',
        type: 'select',
        options: [
          { label: 'Oral Morphine (factor x1)', value: 1 },
          { label: 'IV Morphine (factor x3)', value: 3 },
          { label: 'Oral Oxycodone (factor x1.5)', value: 1.5 },
          { label: 'IV Hydromorphone (factor x20)', value: 20 },
          { label: 'Oral Hydromorphone (factor x5)', value: 5 },
          { label: 'Transdermal Fentanyl patch mcg/hr (divide OME by 2.4)', value: 2.4 },
          { label: 'Oral Codeine (factor x0.15)', value: 0.15 },
          { label: 'Oral Tramadol (factor x0.1)', value: 0.1 },
        ],
        defaultValue: 1,
      },
      {
        id: 'reduction',
        label: 'Cross-Tolerance Dose Reduction',
        type: 'select',
        options: [
          { label: '25% reduction (moderate cross-tolerance)', value: 0.75 },
          { label: '33% reduction (standard rotation)', value: 0.67 },
          { label: '50% reduction (high risk/elderly/opioid-naive from rotation)', value: 0.5 },
          { label: 'No reduction (same drug, route change only)', value: 1.0 },
        ],
        defaultValue: 0.75,
      },
    ],
    calculate(v) {
      const dose = Number(v.current_dose),
        currFactor = Number(v.current_drug);
      const targetFactor = Number(v.target_drug),
        reduction = Number(v.reduction);
      const ome = dose * currFactor; // oral morphine equivalents
      const rawConverted = ome / targetFactor;
      const adjustedDose = rawConverted * reduction;
      const risk: CalculationResult['risk'] = ome > 90 ? 'high' : ome > 50 ? 'moderate' : 'low';
      const highOME =
        ome > 90
          ? 'WARNING: OME >90 mg/day - CDC 2022 guideline recommends reassessment, naloxone co-prescribing'
          : ome > 50
            ? 'NOTE: OME >50 mg/day - offer naloxone prescription'
            : '';
      return {
        label: 'Adjusted Converted Dose',
        value: adjustedDose.toFixed(1),
        unit: 'mg',
        interpretation: `${dose}mg ${v.current_drug} (OME: ${ome.toFixed(0)}mg) -> Raw equivalent: ${rawConverted.toFixed(1)}mg -> After ${Math.round((1 - reduction) * 100)}% cross-tolerance reduction: ${adjustedDose.toFixed(1)}mg. ${highOME}`,
        risk,
        riskPercentage: `OME: ${ome.toFixed(0)} mg/day`,
        guidelineSource: 'CDC Opioid Prescribing Guideline 2022 / DCMS Guidelines 2016',
        scoreBreakdown: [
          { component: 'Current dose', score: dose + ' mg' },
          { component: 'Current drug OME factor', score: 'x' + currFactor },
          { component: 'Oral Morphine Equivalent (OME)', score: ome.toFixed(0) + ' mg' },
          { component: 'Target drug factor', score: 'x' + targetFactor },
          { component: 'Raw converted dose', score: rawConverted.toFixed(1) + ' mg' },
          {
            component: 'Cross-tolerance reduction',
            score: Math.round((1 - reduction) * 100) + '% reduction',
          },
          { component: 'FINAL adjusted dose', score: adjustedDose.toFixed(1) + ' mg' },
        ],
        details: [
          `OME: ${ome.toFixed(0)} mg | Raw conversion: ${rawConverted.toFixed(1)}mg | After cross-tolerance (reduced by ${Math.round((1 - reduction) * 100)}%): ${adjustedDose.toFixed(1)}mg`,
          highOME,
          '-> Reassess pain and side effects 30-60 min after first dose of new opioid',
          '-> Always reduce calculated dose 25-50% for incomplete cross-tolerance (except same drug/route)',
          '-> Fentanyl patch conversion is complex: 25mcg/hr patch approximates 60mg/day oral morphine',
          '-> Hepatic failure: avoid morphine (accumulation of M6G metabolite); use fentanyl or hydromorphone',
          '-> Check PDMP (Prescription Drug Monitoring Program) before prescribing',
          ome > 50
            ? '-> Naloxone co-prescription: 4mg intranasal or 0.4mg/mL injectable for household'
            : '',
        ].filter(Boolean),
      };
    },
  },
  // 5. Aminoglycoside (Gentamicin) Dosing
  {
    id: 'aminoglycoside-dose-calculator',
    name: 'Aminoglycoside Extended-Interval Dosing',
    category: 'Pharmacology',
    icon: '🧪',
    description:
      'Calculate extended-interval gentamicin/tobramycin dose using IBW and CrCl - Hartford nomogram approach',
    formula:
      'Dose: 5-7 mg/kg IBW q24h | CrCl guides interval | Level at 6-14h post-dose for safety monitoring',
    reference:
      'Nicolau DP et al. Antimicrob Agents Chemother 1995 (Hartford nomogram) / ASHP Guidelines',
    inputs: [
      {
        id: 'weight',
        label: 'Actual Body Weight',
        type: 'number',
        unit: 'kg',
        min: 20,
        max: 300,
        step: 0.1,
        defaultValue: 70,
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        unit: 'cm',
        min: 100,
        max: 230,
        defaultValue: 170,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 110,
        defaultValue: 50,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        defaultValue: 'male',
      },
      {
        id: 'creatinine',
        label: 'Serum Creatinine',
        type: 'number',
        unit: 'mg/dL',
        min: 0.4,
        max: 10,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: 'dose_mg_kg',
        label: 'Dose per kg IBW',
        type: 'number',
        unit: 'mg/kg',
        min: 3,
        max: 10,
        step: 0.5,
        defaultValue: 5,
        placeholder: '5-7 mg/kg',
      },
    ],
    calculate(v) {
      const wt = Number(v.weight),
        ht = Number(v.height),
        age = Number(v.age),
        cr = Number(v.creatinine);
      const isMale = v.sex === 'male';
      const htIn = ht / 2.54,
        excessIn = Math.max(0, htIn - 60);
      const ibw = (isMale ? 50 : 45.5) + 2.3 * excessIn;
      const dosingWt = wt > ibw * 1.2 ? ibw + 0.4 * (wt - ibw) : wt; // ABW if >120% IBW
      let crcl = ((140 - age) * dosingWt) / (72 * cr);
      if (!isMale) crcl *= 0.85;
      const dose = Math.round((Number(v.dose_mg_kg) * ibw) / 10) * 10;
      // Hartford nomogram interval
      let interval: string;
      if (crcl >= 60) interval = 'q24h';
      else if (crcl >= 40) interval = 'q36h';
      else if (crcl >= 20) interval = 'q48h';
      else interval = 'Monitor levels - CrCl too low for standard extended-interval dosing';
      const risk: CalculationResult['risk'] = crcl >= 40 ? 'low' : crcl >= 20 ? 'moderate' : 'high';
      return {
        label: 'Gentamicin/Tobramycin Dose',
        value: dose,
        unit: 'mg ' + interval,
        interpretation: `Dose: ${dose}mg (${v.dose_mg_kg}mg/kg x IBW ${ibw.toFixed(1)}kg) ${interval}. Dosing weight used: ${dosingWt.toFixed(1)}kg. CrCl: ${crcl.toFixed(0)} mL/min. Draw random level at 6-14h post-dose; use Hartford nomogram plot to confirm safety.`,
        risk,
        riskPercentage: `CrCl ${crcl.toFixed(0)} mL/min — interval: ${interval}`,
        guidelineSource:
          'Hartford Nomogram - Nicolau DP et al. 1995 / ASHP Aminoglycoside Guidelines',
        scoreBreakdown: [
          { component: 'IBW (Devine)', score: ibw.toFixed(1) + ' kg' },
          {
            component: 'Dosing weight',
            score: dosingWt.toFixed(1) + ' kg (' + (wt > ibw * 1.2 ? 'ABW' : 'actual') + ')',
          },
          { component: 'CrCl (Cockcroft-Gault)', score: crcl.toFixed(0) + ' mL/min' },
          { component: 'Dose (' + v.dose_mg_kg + ' mg/kg x IBW)', score: dose + ' mg' },
          { component: 'Dosing Interval', score: interval },
          { component: 'Level monitoring', score: 'Random level at 6-14h post-dose' },
        ],
        details: [
          `Dose: ${dose}mg ${interval} | IBW: ${ibw.toFixed(1)}kg | CrCl: ${crcl.toFixed(0)} mL/min`,
          '-> Extended-interval dosing exploits concentration-dependent killing (Cmax/MIC) and post-antibiotic effect',
          '-> Monitoring: random level at 6-14h after dose 1; plot on Hartford nomogram',
          '-> If level falls in "q48h zone": extend to q48h | "q36h zone": extend to q36h',
          '-> Ototoxicity/nephrotoxicity: check baseline SCr; monitor q48-72h during therapy',
          '-> Avoid in: pregnancy, severe renal impairment (CrCl <20), significant ascites',
          'HIGH-ALERT MEDICATION: Independent pharmacist verification required',
          crcl < 20 ? 'WARNING: CrCl <20 - traditional dosing with PK monitoring required' : '',
        ].filter(Boolean),
      };
    },
  },
  // 6. IV Drip Rate (mcg/kg/min)
  {
    id: 'iv-drip-rate-med',
    name: 'IV Drip Rate Calculator (mcg/kg/min)',
    category: 'Pharmacology',
    icon: '💉',
    description:
      'Calculate IV infusion pump rate in mL/hr for weight-based vasoactive and sedation infusions',
    formula: 'Rate (mL/hr) = Dose (mcg/kg/min) x Weight (kg) x 60 / Concentration (mcg/mL)',
    reference: 'Clinical pharmacology standard / SCCM ICU Sedation Guidelines 2018',
    inputs: [
      {
        id: 'dose',
        label: 'Desired Dose',
        type: 'number',
        unit: 'mcg/kg/min',
        min: 0.001,
        max: 500,
        step: 0.001,
        defaultValue: 5,
        placeholder: 'e.g. 5',
      },
      {
        id: 'weight',
        label: 'Patient Weight',
        type: 'number',
        unit: 'kg',
        min: 1,
        max: 400,
        step: 0.1,
        defaultValue: 70,
      },
      {
        id: 'concentration',
        label: 'Bag Concentration',
        type: 'number',
        unit: 'mcg/mL',
        min: 0.1,
        max: 100000,
        step: 0.1,
        defaultValue: 1600,
        placeholder: 'e.g. 1600 for dopamine 400mg/250mL',
      },
      {
        id: 'drug_name',
        label: 'Drug (for context)',
        type: 'select',
        options: [
          { label: 'Dopamine (typical: 3-20 mcg/kg/min)', value: 'dopamine' },
          { label: 'Norepinephrine (typical: 0.01-3 mcg/kg/min)', value: 'norepinephrine' },
          { label: 'Dobutamine (typical: 2.5-20 mcg/kg/min)', value: 'dobutamine' },
          { label: 'Epinephrine (typical: 0.01-1 mcg/kg/min)', value: 'epinephrine' },
          { label: 'Propofol (typical: 5-80 mcg/kg/min)', value: 'propofol' },
          { label: 'Milrinone (typical: 0.25-0.75 mcg/kg/min)', value: 'milrinone' },
          { label: 'Nicardipine (typical: 5-15 mg/hr - NOT weight-based)', value: 'nicardipine' },
          { label: 'Other', value: 'other' },
        ],
        defaultValue: 'dopamine',
      },
    ],
    calculate(v) {
      const dose = Number(v.dose),
        wt = Number(v.weight),
        conc = Number(v.concentration);
      const rate = (dose * wt * 60) / conc;
      const drug = String(v.drug_name);
      const risk: CalculationResult['risk'] = rate > 100 ? 'high' : 'low';
      const drugRanges: { [k: string]: string } = {
        dopamine:
          '3-5 renal: diuresis, 5-10 inotropy, 10-20 vasopressor; >20 mcg/kg/min consider alternative',
        norepinephrine: '0.01-3 mcg/kg/min; typical septic shock 0.1-0.5 mcg/kg/min',
        dobutamine: '2.5-20 mcg/kg/min for cardiac output augmentation',
        epinephrine: '0.01-1 mcg/kg/min; cardiac arrest 1mg IV bolus',
        propofol: '5-50 mcg/kg/min sedation; >80 mcg/kg/min propofol infusion syndrome risk',
        milrinone: 'Loading 50 mcg/kg over 10 min (optional); maintenance 0.25-0.75 mcg/kg/min',
        other: 'Verify dose range in drug prescribing information',
      };
      const range = drugRanges[drug] || drugRanges['other'];
      const propofolWarning =
        drug === 'propofol' && dose > 80
          ? 'PROPOFOL INFUSION SYNDROME RISK at doses >80 mcg/kg/min - limit duration'
          : '';
      return {
        label: 'Infusion Rate',
        value: rate.toFixed(1),
        unit: 'mL/hr',
        interpretation: `${dose} mcg/kg/min x ${wt}kg / ${conc} mcg/mL x 60 = ${rate.toFixed(1)} mL/hr. Drug: ${drug}. Typical range: ${range}`,
        risk,
        guidelineSource: 'SCCM ICU Sedation Guidelines 2018 / Surviving Sepsis Campaign 2021',
        scoreBreakdown: [
          { component: 'Drug', score: drug },
          { component: 'Dose', score: dose + ' mcg/kg/min' },
          { component: 'Weight', score: wt + ' kg' },
          { component: 'Bag concentration', score: conc + ' mcg/mL' },
          { component: 'Calculation', score: dose + ' x ' + wt + ' x 60 / ' + conc },
          { component: 'Pump rate', score: rate.toFixed(1) + ' mL/hr' },
          { component: 'Typical dose range', score: range.split(';')[0] },
        ],
        details: [
          `Rate: ${rate.toFixed(1)} mL/hr (${dose} mcg/kg/min at ${conc} mcg/mL, weight ${wt}kg)`,
          `Drug range context: ${range}`,
          propofolWarning,
          '-> INFUSION PUMP required - never gravity drip for vasoactive medications',
          '-> Independent double-check by two nurses for all vasoactive drug programming',
          '-> Use smart pump with drug library to prevent 10-fold errors',
          '-> Label all infusion lines at pump, patient connection, and bag',
          '-> Titrate in small increments - sudden large rate changes cause hemodynamic instability',
        ].filter(Boolean),
      };
    },
  },
  // 7. Pediatric Emergency Drug Calculator
  {
    id: 'pediatric-emergency-drug-calculator',
    name: 'Pediatric Emergency Drug Calculator',
    category: 'Pharmacology',
    icon: '👶',
    description:
      'Pre-calculate critical pediatric emergency drug doses by weight - ALARA principle (never estimate weight)',
    formula:
      'All doses = mg/kg x weight | ET tube = (age/4 + 4) uncuffed; age/4 + 3.5 cuffed | Defib: 2 J/kg',
    reference:
      'PALS Guidelines AHA 2020 / Pediatric Advanced Life Support / Broselow tape reference',
    inputs: [
      {
        id: 'weight',
        label: 'Child Weight',
        type: 'number',
        unit: 'kg',
        min: 1,
        max: 80,
        step: 0.1,
        defaultValue: 20,
        placeholder: 'Measured weight - never estimate for emergency dosing',
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 0,
        max: 12,
        step: 0.5,
        defaultValue: 5,
        placeholder: 'e.g. 5',
      },
    ],
    calculate(v) {
      const wt = Number(v.weight),
        age = Number(v.age);
      // Emergency drug doses (PALS 2020)
      const epi_arrest = Math.min(1, wt * 0.01); // 0.1 mg/kg (1:10,000 = 0.1mg/mL) max 1mg
      const epi_anaphylaxis = Math.min(0.5, wt * 0.01); // 0.01 mg/kg IM, max 0.5mg
      const atropine = Math.max(0.1, Math.min(0.5, wt * 0.02)); // 0.02 mg/kg min 0.1, max 0.5mg
      const adenosine1 = Math.min(6, wt * 0.1); // first dose 0.1 mg/kg max 6mg
      const adenosine2 = Math.min(12, wt * 0.2); // second dose 0.2 mg/kg max 12mg
      const amiodarone = Math.min(300, wt * 5); // 5 mg/kg max 300mg
      const glucose_d25 = wt * 2 * 4; // 0.5g/kg as 25% dextrose (2mL/kg D25W)
      const defib1 = wt * 2,
        defib2 = wt * 4; // defibrillation J/kg
      const etTubeUncuffed = Math.round((age / 4 + 4) * 2) / 2;
      const etTubeCuffed = Math.round((age / 4 + 3.5) * 2) / 2;
      const etDepth = Math.round((age / 2 + 12) * 10) / 10; // depth of insertion (lip) = age/2 + 12 cm
      const risk: CalculationResult['risk'] = 'low';
      const weightEstimate =
        age >= 1 && age <= 10
          ? (2 * (age + 4)).toFixed(0) + ' kg (Broselow/EPLS estimate - USE MEASURED WEIGHT)'
          : 'N/A';
      return {
        label: 'Child Weight',
        value: wt,
        unit: 'kg',
        interpretation: `Emergency drug doses pre-calculated for ${wt}kg child (age: ${age} years). ET tube: ${etTubeUncuffed}mm uncuffed / ${etTubeCuffed}mm cuffed at ${etDepth}cm lip.`,
        risk,
        guidelineSource: 'AHA PALS Guidelines 2020 / Broselow-Luten Pediatric Resuscitation Tape',
        scoreBreakdown: [
          {
            component: 'Epinephrine (cardiac arrest IV)',
            score: epi_arrest.toFixed(2) + ' mg (0.01mg/kg), max 1mg',
          },
          {
            component: 'Epinephrine (anaphylaxis IM)',
            score: epi_anaphylaxis.toFixed(2) + ' mg (0.01mg/kg), max 0.5mg',
          },
          {
            component: 'Atropine (bradycardia)',
            score: atropine.toFixed(2) + ' mg (0.02mg/kg, min 0.1mg)',
          },
          {
            component: 'Adenosine 1st dose',
            score: adenosine1.toFixed(1) + ' mg (0.1mg/kg), max 6mg',
          },
          {
            component: 'Adenosine 2nd dose',
            score: adenosine2.toFixed(1) + ' mg (0.2mg/kg), max 12mg',
          },
          {
            component: 'Amiodarone (VF/pVT)',
            score: amiodarone.toFixed(0) + ' mg (5mg/kg), max 300mg',
          },
          {
            component: 'Glucose D25W (hypoglycemia)',
            score: glucose_d25.toFixed(0) + ' mL D25W (0.5g/kg)',
          },
          { component: 'Defibrillation - 1st shock', score: defib1.toFixed(0) + ' J (2 J/kg)' },
          { component: 'Defibrillation - subsequent', score: defib2.toFixed(0) + ' J (4 J/kg)' },
          {
            component: 'ET Tube (uncuffed)',
            score: etTubeUncuffed + ' mm at ' + etDepth + ' cm lip',
          },
          { component: 'ET Tube (cuffed)', score: etTubeCuffed + ' mm at ' + etDepth + ' cm lip' },
        ],
        details: [
          `Weight: ${wt}kg | Age: ${age}y | Weight estimate (Broselow): ~${weightEstimate}`,
          `Epinephrine cardiac arrest: ${epi_arrest.toFixed(2)}mg IV/IO (1:10,000) | Anaphylaxis IM: ${epi_anaphylaxis.toFixed(2)}mg`,
          `ET tube: uncuffed ${etTubeUncuffed}mm, cuffed ${etTubeCuffed}mm at ${etDepth}cm lip depth`,
          `Defibrillation: ${defib1.toFixed(0)}J first, ${defib2.toFixed(0)}J subsequent shocks`,
          'NEVER estimate weight for pediatric drug dosing - always measure or use Broselow tape',
          '-> Epinephrine route: IV/IO preferred during cardiac arrest; IM for anaphylaxis (anterolateral thigh)',
          '-> Adenosine: rapid IV push closest to heart; flush immediately with 5-10mL NS',
          '-> Glucose: D10W safer than D25W for neonates and infants (osmolality risk)',
        ],
      };
    },
  },
  // 8. Carbohydrate / Glycemic Load Calculator
  {
    id: 'carb-glycemic-calculator',
    name: 'Glycemic Index / Load Calculator',
    category: 'Pharmacology',
    icon: '🍎',
    description:
      'Calculate glycemic load of a meal to guide diabetes nutrition management and insulin dosing',
    formula:
      'Glycemic Load = (Glycemic Index x Net Carbohydrates) / 100 | Net carbs = Total carbs - fiber',
    reference: 'Jenkins DJ et al. AJCN 1981 / ADA Medical Nutrition Therapy Guidelines 2019',
    inputs: [
      {
        id: 'carbs',
        label: 'Total Carbohydrates',
        type: 'number',
        unit: 'grams',
        min: 0,
        max: 500,
        step: 1,
        defaultValue: 45,
        placeholder: 'e.g. 45',
      },
      {
        id: 'fiber',
        label: 'Dietary Fiber',
        type: 'number',
        unit: 'grams',
        min: 0,
        max: 100,
        step: 0.5,
        defaultValue: 3,
        placeholder: 'e.g. 3',
      },
      {
        id: 'gi',
        label: 'Estimated Glycemic Index of Food',
        type: 'select',
        options: [
          { label: 'Low GI (<55): legumes, most vegetables, whole grains (GI 40)', value: 40 },
          { label: 'Medium GI (55-69): brown rice, oatmeal, whole wheat (GI 60)', value: 60 },
          { label: 'High GI (70-100): white bread, white rice, potatoes (GI 80)', value: 80 },
          { label: 'Very high GI: sugary drinks, sweets (GI 95)', value: 95 },
        ],
        defaultValue: 60,
      },
      {
        id: 'portion',
        label: 'Number of Servings',
        type: 'number',
        unit: 'servings',
        min: 0.5,
        max: 10,
        step: 0.5,
        defaultValue: 1,
      },
    ],
    calculate(v) {
      const carbs = Number(v.carbs),
        fiber = Number(v.fiber),
        gi = Number(v.gi),
        portions = Number(v.portion);
      const netCarbs = Math.max(0, carbs - fiber) * portions;
      const gl = Math.round((gi * netCarbs) / 100);
      const totalCarbs = carbs * portions;
      const glCategory =
        gl < 10 ? 'Low glycemic load' : gl < 20 ? 'Medium glycemic load' : 'High glycemic load';
      const insulinSuggestion =
        netCarbs > 0
          ? 'Estimated carb coverage: use ICR from insulin dose calculator (typically 1 unit per 10-15g carbs for T1DM)'
          : '';
      const risk: CalculationResult['risk'] = gl < 10 ? 'low' : gl < 20 ? 'moderate' : 'high';
      return {
        label: 'Glycemic Load',
        value: gl,
        unit: 'GL units',
        interpretation: `Net carbs: ${netCarbs.toFixed(0)}g (total: ${totalCarbs.toFixed(0)}g minus ${fiber * portions}g fiber). GI: ${gi}. Glycemic Load: ${gl} - ${glCategory}. ${insulinSuggestion}`,
        risk,
        guidelineSource: 'Jenkins DJ et al. AJCN 1981 / ADA MNT Guidelines 2019',
        scoreBreakdown: [
          {
            component: 'Total carbohydrates',
            score: totalCarbs.toFixed(0) + ' g (' + portions + ' servings)',
          },
          { component: 'Dietary fiber', score: (fiber * portions).toFixed(0) + ' g' },
          { component: 'Net carbohydrates', score: netCarbs.toFixed(0) + ' g' },
          {
            component: 'Glycemic Index',
            score: gi + ' (' + (gi < 55 ? 'Low' : gi < 70 ? 'Medium' : 'High') + ')',
          },
          {
            component: 'Glycemic Load (GI x net carbs / 100)',
            score: gl + ' (' + glCategory + ')',
          },
          { component: 'Typical GL targets', score: 'Daily GL <100 (ADA); per meal <20 (high GL)' },
        ],
        details: [
          `Glycemic Load: ${gl} units (${glCategory}) | Net carbs: ${netCarbs.toFixed(0)}g`,
          `For insulin dosing: see Insulin Dose Calculator with carb count of ${netCarbs.toFixed(0)}g`,
          '-> Low GI foods reduce post-meal glucose spikes vs high GI (same carbohydrate content)',
          '-> Target daily glycemic load: <100 for general health; even lower for T2DM',
          '-> Fiber, fat, protein all slow glucose absorption and lower effective glycemic response',
          '-> ADA: focus on total carbohydrate quantity more than GI for glucose management',
        ],
      };
    },
  },
  // 9. Medication Cost Estimator
  {
    id: 'medication-cost-estimator',
    name: 'Generic vs Brand Medication Cost Estimator',
    category: 'Pharmacology',
    icon: '💰',
    description: 'Compare generic vs brand-name medication costs and calculate annual savings',
    formula: 'Annual savings = (Brand price - Generic price) x 12 months',
    reference: 'FDA Generic Drug Savings Report 2023 / CMS Drug Price Transparency',
    inputs: [
      {
        id: 'brand_price',
        label: 'Brand-Name Monthly Cost',
        type: 'number',
        unit: 'USD/month',
        min: 1,
        max: 50000,
        defaultValue: 200,
      },
      {
        id: 'generic_price',
        label: 'Generic Monthly Cost',
        type: 'number',
        unit: 'USD/month',
        min: 1,
        max: 5000,
        defaultValue: 20,
      },
      {
        id: 'months',
        label: 'Treatment Duration',
        type: 'number',
        unit: 'months',
        min: 1,
        max: 360,
        defaultValue: 12,
      },
      {
        id: 'copay_brand',
        label: 'Brand Copay (with insurance)',
        type: 'number',
        unit: 'USD/month',
        min: 0,
        max: 1000,
        defaultValue: 50,
      },
      {
        id: 'copay_generic',
        label: 'Generic Copay (with insurance)',
        type: 'number',
        unit: 'USD/month',
        min: 0,
        max: 200,
        defaultValue: 10,
      },
    ],
    calculate(v) {
      const brand = Number(v.brand_price),
        generic = Number(v.generic_price),
        months = Number(v.months);
      const copayBrand = Number(v.copay_brand),
        copayGeneric = Number(v.copay_generic);
      const totalBrand = brand * months,
        totalGeneric = generic * months;
      const savingsNoInsurance = totalBrand - totalGeneric;
      const savingsInsured = (copayBrand - copayGeneric) * months;
      const pctSaving = ((savingsNoInsurance / totalBrand) * 100).toFixed(0);
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: 'Savings (No Insurance)',
        value: savingsNoInsurance.toFixed(0),
        unit: 'USD over ' + months + ' months',
        interpretation: `Generic saves $${savingsNoInsurance.toFixed(0)} (${pctSaving}%) over ${months} months vs brand ($${totalBrand.toFixed(0)} vs $${totalGeneric.toFixed(0)}). With insurance copay: saves $${savingsInsured.toFixed(0)} over ${months} months.`,
        risk,
        guidelineSource: 'FDA Generic Drug Savings Report 2023 / GoodRx / NeedyMeds',
        scoreBreakdown: [
          { component: 'Brand total (' + months + ' months)', score: '$' + totalBrand.toFixed(0) },
          {
            component: 'Generic total (' + months + ' months)',
            score: '$' + totalGeneric.toFixed(0),
          },
          {
            component: 'Savings without insurance',
            score: '$' + savingsNoInsurance.toFixed(0) + ' (' + pctSaving + '%)',
          },
          {
            component: 'Savings with insurance copay',
            score: '$' + savingsInsured.toFixed(0) + ' over ' + months + ' months',
          },
          {
            component: 'Monthly savings (no ins.)',
            score: '$' + (savingsNoInsurance / months).toFixed(0) + '/month',
          },
        ],
        details: [
          `Brand: $${brand}/month vs Generic: $${generic}/month = Save $${(brand - generic).toFixed(0)}/month (${pctSaving}%)`,
          '-> Generics contain the same active ingredient, dose, form, and strength as brand',
          '-> FDA bioequivalence standards ensure generics are therapeutically equivalent',
          '-> GoodRx, NeedyMeds, RxSaver: free coupon apps often cheaper than insurance copay',
          '-> Patient Assistance Programs: most manufacturers offer programs for uninsured patients',
          '-> Pill-splitting (if scored tablets): can halve costs for double-dose tablets',
        ],
      };
    },
  },
  // 10. Drug Interaction Severity Checker
  {
    id: 'drug-interaction-checker',
    name: 'Drug Interaction Severity Reference',
    category: 'Pharmacology',
    icon: '⚠️',
    description:
      'Reference guide for clinically significant drug interactions by severity class with management recommendations',
    formula:
      'Clinical DDI classification: Contraindicated / Major / Moderate / Minor - based on mechanism and clinical evidence',
    reference:
      'Lexicomp Drug Interactions / Micromedex / crediblemeds.org / clinical pharmacology databases',
    inputs: [
      {
        id: 'pair',
        label: 'Drug Interaction Pair (select common high-risk pair)',
        type: 'select',
        options: [
          { label: 'Warfarin + NSAIDs/Aspirin', value: 'warfarin_nsaids' },
          { label: 'SSRI + Tramadol/Linezolid (Serotonin Syndrome)', value: 'ssri_tramadol' },
          { label: 'QTc-prolonging drugs + Fluoroquinolones', value: 'qtc_drugs' },
          { label: 'ACE-I/ARB + Potassium-sparing diuretics', value: 'acei_ksparing' },
          { label: 'Metformin + Iodinated Contrast', value: 'metformin_contrast' },
          {
            label: 'Statins + Strong CYP3A4 inhibitors (azoles, macrolides)',
            value: 'statin_cyp3a4',
          },
          { label: 'Anticoagulants + Antiplatelet agents', value: 'oac_antiplatelet' },
          { label: 'Lithium + NSAIDs/Thiazides', value: 'lithium_nsaids' },
          { label: 'MAOIs + Tyramine-rich foods / Sympathomimetics', value: 'maoi_tyramine' },
          { label: 'Digoxin + Amiodarone', value: 'digoxin_amiodarone' },
        ],
        defaultValue: 'warfarin_nsaids',
      },
    ],
    calculate(v) {
      type DDIData = {
        severity: CalculationResult['risk'];
        class: string;
        mechanism: string;
        effect: string;
        management: string;
      };
      const DDI: { [k: string]: DDIData } = {
        warfarin_nsaids: {
          severity: 'high',
          class: 'Major',
          mechanism:
            'NSAIDs inhibit platelet function + displace warfarin from protein binding; gastric mucosal damage',
          effect: 'Significantly increased bleeding risk - GI hemorrhage most common',
          management:
            'Avoid combination if possible. If needed: PPI co-prescribing, close INR monitoring, reduce NSAID dose/duration. Prefer COX-2 inhibitor if NSAID must be used.',
        },
        ssri_tramadol: {
          severity: 'critical',
          class: 'Contraindicated',
          mechanism: 'Serotonergic synergism (5-HT reuptake inhibition + agonism)',
          effect:
            'Serotonin syndrome: hyperthermia, clonus, agitation, autonomic instability - potentially fatal',
          management:
            'AVOID COMBINATION. Use alternative opioid (oxycodone, morphine). If inadvertent exposure: cyproheptadine 8-16mg; supportive care; ICU if severe.',
        },
        qtc_drugs: {
          severity: 'high',
          class: 'Major',
          mechanism: 'Additive QT prolongation - both block hERG potassium channel',
          effect: 'Torsades de Pointes, ventricular arrhythmia, sudden cardiac death',
          management:
            'Check crediblemeds.org. Avoid combination when possible. If necessary: baseline and serial ECGs, correct K+/Mg2+, use lowest effective dose.',
        },
        acei_ksparing: {
          severity: 'high',
          class: 'Major',
          mechanism:
            'ACE-I reduces aldosterone → K+ retention; K+-sparing diuretics also retain K+',
          effect: 'Life-threatening hyperkalemia (especially in CKD, DM, elderly)',
          management:
            'Avoid in eGFR <30. If used: baseline K+ and BMP within 1-2 weeks; regular monitoring. Target K+ <5.5 mEq/L.',
        },
        metformin_contrast: {
          severity: 'moderate',
          class: 'Moderate',
          mechanism: 'Iodinated contrast may cause AKI → metformin accumulation → lactic acidosis',
          effect:
            'Contrast-induced AKI + metformin-associated lactic acidosis (rare but potentially fatal)',
          management:
            'Hold metformin 48h before/after IV contrast if eGFR <60. Resume only after renal function confirmed stable. Hydration before procedure.',
        },
        statin_cyp3a4: {
          severity: 'high',
          class: 'Major',
          mechanism:
            'CYP3A4 inhibitors (itraconazole, clarithromycin, erythromycin, HIV PIs) markedly increase statin levels',
          effect:
            'Rhabdomyolysis, myopathy, hepatotoxicity (simvastatin > lovastatin >> atorvastatin)',
          management:
            'Avoid simvastatin/lovastatin with strong inhibitors. Use fluvastatin, rosuvastatin, or pravastatin (not CYP3A4 metabolized). Reduce simvastatin max to 10mg if combination unavoidable.',
        },
        oac_antiplatelet: {
          severity: 'high',
          class: 'Major',
          mechanism: 'Additive anticoagulation + platelet inhibition',
          effect: 'Major bleeding 2-3x risk increase; intracranial, GI hemorrhage',
          management:
            'Avoid triple therapy (OAC + aspirin + P2Y12) unless strong indication. Use PPI. Minimize duration of overlap. Consider DOAC over warfarin (lower bleeding).',
        },
        lithium_nsaids: {
          severity: 'high',
          class: 'Major',
          mechanism: 'NSAIDs/thiazides reduce renal lithium clearance by 20-60%',
          effect: 'Lithium toxicity: tremor, ataxia, confusion, seizure, renal failure',
          management:
            'Avoid NSAIDs in lithium patients. If unavoidable: reduce lithium dose 25-50%, check levels after 5 days. Monitor SCr. Paracetamol is safe alternative analgesic.',
        },
        maoi_tyramine: {
          severity: 'critical',
          class: 'Contraindicated',
          mechanism:
            'MAOIs block intestinal/hepatic MAO → tyramine not metabolized → massive norepinephrine release',
          effect:
            'Hypertensive crisis: severe HTN, hypertensive encephalopathy, intracranial hemorrhage',
          management:
            'Strict dietary tyramine avoidance (aged cheese, cured meats, fermented foods, wine). Stop MAOI 14 days before starting sympathomimetics or other serotonergic drugs.',
        },
        digoxin_amiodarone: {
          severity: 'high',
          class: 'Major',
          mechanism:
            'Amiodarone inhibits P-glycoprotein and CYP3A4/2C9 → reduces renal/non-renal digoxin clearance by 50%',
          effect:
            'Digoxin toxicity: bradycardia, heart block, nausea, visual disturbances, arrhythmia',
          management:
            'Reduce digoxin dose by 50% when amiodarone started. Monitor digoxin levels and ECG. Target trough 0.5-0.9 ng/mL. Effect persists for weeks/months after amiodarone discontinued.',
        },
      };
      const info = DDI[v.pair as string] || DDI['warfarin_nsaids'];
      const risk = info.severity;
      return {
        label: 'DDI Severity',
        value: info.class,
        interpretation: `${info.class} interaction. Effect: ${info.effect}. Management: ${info.management}`,
        risk,
        riskPercentage:
          info.class === 'Contraindicated'
            ? 'AVOID - Contraindicated combination'
            : info.class === 'Major'
              ? 'Major DDI - High risk of serious adverse event'
              : undefined,
        guidelineSource: 'Lexicomp / Micromedex / crediblemeds.org / Clinical Pharmacology',
        scoreBreakdown: [
          { component: 'Drug Pair', score: String(v.pair).replace(/_/g, ' ') },
          { component: 'Severity Class', score: info.class },
          { component: 'Mechanism', score: info.mechanism },
          { component: 'Clinical Effect', score: info.effect },
          { component: 'Management', score: info.management.split('.')[0] },
        ],
        details: [
          `Severity: ${info.class} | Risk: ${risk}`,
          `Mechanism: ${info.mechanism}`,
          `Effect: ${info.effect}`,
          `Management: ${info.management}`,
          '-> Always check comprehensive DDI database (Lexicomp, Micromedex) for patient-specific interactions',
          '-> Clinical context matters: benefit may outweigh risk with monitoring',
          info.class === 'Contraindicated' ? 'CONTRAINDICATED: Do not use this combination' : '',
        ].filter(Boolean),
      };
    },
  },
];

export const obgynConfigs: MedicalConfig[] = [
  // 1. Due Date (EDD) Calculator
  {
    id: 'due-date-edd-med',
    name: 'Estimated Due Date (EDD) Calculator',
    category: 'OB/GYN',
    icon: '🤰',
    description:
      'Calculate EDD and gestational age from LMP using Naegele Rule - compare with ultrasound dating',
    formula:
      'EDD = LMP + 280 days (Naegele Rule) | Adjust +/- days for cycle length deviation from 28 days',
    reference: 'ACOG Committee Opinion 700 (2017) / ACOG Practice Bulletin 175 (2016)',
    inputs: [
      {
        id: 'lmp_year',
        label: 'LMP Year',
        type: 'number',
        unit: '',
        min: 2020,
        max: 2030,
        step: 1,
        defaultValue: new Date().getFullYear(),
      },
      {
        id: 'lmp_month',
        label: 'LMP Month (1-12)',
        type: 'number',
        unit: '',
        min: 1,
        max: 12,
        step: 1,
        defaultValue: new Date().getMonth() + 1,
      },
      {
        id: 'lmp_day',
        label: 'LMP Day (1-31)',
        type: 'number',
        unit: '',
        min: 1,
        max: 31,
        step: 1,
        defaultValue: new Date().getDate(),
      },
      {
        id: 'cycle_len',
        label: 'Average Menstrual Cycle Length',
        type: 'number',
        unit: 'days',
        min: 21,
        max: 42,
        step: 1,
        defaultValue: 28,
        placeholder: 'e.g. 28',
      },
    ],
    calculate(v) {
      const yr = Number(v.lmp_year),
        mo = Number(v.lmp_month) - 1,
        day = Number(v.lmp_day);
      const cycleAdj = Number(v.cycle_len) - 28;
      const lmp = new Date(yr, mo, day);
      const edd = new Date(lmp.getTime() + (280 + cycleAdj) * 24 * 60 * 60 * 1000);
      const today = new Date();
      const daysSinceLMP = Math.floor((today.getTime() - lmp.getTime()) / (24 * 60 * 60 * 1000));
      const gaWeeks = Math.max(0, Math.floor(daysSinceLMP / 7));
      const gaDays = Math.max(0, daysSinceLMP % 7);
      const daysUntilEDD = Math.ceil((edd.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      const eddStr = edd.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const trimester =
        gaWeeks < 14
          ? 'First trimester (1-13 weeks)'
          : gaWeeks < 28
            ? 'Second trimester (14-27 weeks)'
            : 'Third trimester (28-40 weeks)';
      const risk: CalculationResult['risk'] = 'low';
      const cycleNote =
        Number(v.cycle_len) !== 28
          ? 'Cycle length ' +
            v.cycle_len +
            ' days - EDD adjusted by ' +
            (cycleAdj > 0 ? '+' : '') +
            cycleAdj +
            ' days from standard Naegele'
          : '';
      return {
        label: 'Estimated Due Date',
        value: eddStr,
        interpretation:
          'EDD: ' +
          eddStr +
          '. Gestational age: ' +
          gaWeeks +
          'w ' +
          gaDays +
          'd. ' +
          trimester +
          '. ' +
          (daysUntilEDD > 0
            ? daysUntilEDD + ' days until EDD.'
            : 'EDD has passed - ' + Math.abs(daysUntilEDD) + ' days overdue.') +
          ' ' +
          cycleNote,
        risk,
        riskPercentage: 'GA: ' + gaWeeks + 'w ' + gaDays + 'd',
        guidelineSource: 'ACOG Committee Opinion 700 (2017)',
        scoreBreakdown: [
          { component: 'LMP Date', score: lmp.toLocaleDateString('en-US') },
          {
            component: 'Cycle Length Adjustment',
            score: (cycleAdj >= 0 ? '+' : '') + cycleAdj + ' days',
          },
          { component: 'Estimated Due Date', score: eddStr },
          { component: 'Gestational Age Today', score: gaWeeks + 'w ' + gaDays + 'd' },
          { component: 'Trimester', score: trimester },
          {
            component: 'Days Until EDD',
            score:
              daysUntilEDD > 0
                ? daysUntilEDD + ' days'
                : 'OVERDUE by ' + Math.abs(daysUntilEDD) + ' days',
          },
        ],
        details: [
          'EDD: ' + eddStr + ' | GA: ' + gaWeeks + 'w ' + gaDays + 'd (' + trimester + ')',
          cycleNote,
          '-> First-trimester US (CRL 8-14 weeks): if discordance >5-7 days from LMP EDD, use US date',
          '-> ACOG: once US EDD assigned, do not change even if LMP becomes available later',
          '-> IVF: EDD from embryo transfer date (3-day transfer: +266 days; 5-day blastocyst: +261 days)',
          '-> Irregular cycles/PCOS/recent OCP use: LMP-based EDD less reliable - rely on early US',
          '-> Term: 37w0d to 41w6d | Early term: 37-38w | Full term: 39-40w | Late term: 41w | Post-term: >=42w',
        ].filter(Boolean),
      };
    },
  },
  // 2. Gestational Age Calculator
  {
    id: 'gestational-age-calculator',
    name: 'Gestational Age Calculator',
    category: 'OB/GYN',
    icon: '📅',
    description:
      'Calculate exact gestational age in weeks and days from LMP or number of days since LMP',
    formula: 'GA = Days since LMP / 7 | Trimester boundaries: T1 <14w, T2 14-27w, T3 >=28w',
    reference: 'ACOG Practice Bulletin 175 (2016) / FIGO Guidelines',
    inputs: [
      {
        id: 'lmp_days_ago',
        label: 'Days Since LMP (or enter manually)',
        type: 'number',
        unit: 'days',
        min: 0,
        max: 310,
        step: 1,
        defaultValue: 70,
        placeholder: 'e.g. 70',
      },
    ],
    calculate(v) {
      const daysGA = Number(v.lmp_days_ago);
      const gaWeeks = Math.floor(daysGA / 7);
      const gaDays = daysGA % 7;
      const daysUntilTerm = Math.max(0, 280 - daysGA);
      const trimester =
        gaWeeks < 14 ? 'First trimester' : gaWeeks < 28 ? 'Second trimester' : 'Third trimester';
      const termStatus =
        daysGA >= 294
          ? 'Post-term (>=42 weeks)'
          : daysGA >= 287
            ? 'Late-term (41-41+6)'
            : daysGA >= 280
              ? 'Full-term (40-40+6)'
              : daysGA >= 273
                ? 'Full-term (39-39+6)'
                : daysGA >= 259
                  ? 'Early-term (37-38+6)'
                  : daysGA >= 245
                    ? 'Late preterm (34-36+6)'
                    : daysGA >= 224
                      ? 'Moderate preterm (32-33+6)'
                      : daysGA >= 196
                        ? 'Very preterm (28-31+6)'
                        : 'Extremely preterm (<28w)';
      const viability = daysGA >= 154 ? 'Viable (>=22 weeks)' : 'Pre-viable (<22 weeks)';
      const risk: CalculationResult['risk'] =
        gaWeeks >= 37 ? 'low' : gaWeeks >= 34 ? 'moderate' : gaWeeks >= 28 ? 'high' : 'critical';
      return {
        label: 'Gestational Age',
        value: gaWeeks + 'w ' + gaDays + 'd',
        interpretation:
          gaWeeks +
          'w ' +
          gaDays +
          'd (' +
          trimester +
          '). ' +
          termStatus +
          '. ' +
          viability +
          '. Days until 40w: ' +
          daysUntilTerm +
          '.',
        risk,
        riskPercentage: termStatus,
        guidelineSource: 'ACOG Practice Bulletin 175 (2016)',
        scoreBreakdown: [
          { component: 'Days since LMP', score: daysGA + ' days' },
          { component: 'Gestational Age', score: gaWeeks + 'w ' + gaDays + 'd' },
          { component: 'Trimester', score: trimester },
          { component: 'Term Status', score: termStatus },
          { component: 'Viability', score: viability },
          {
            component: 'Days to 40+0',
            score: daysUntilTerm > 0 ? daysUntilTerm + ' days' : 'Already term or past',
          },
        ],
        details: [
          'GA: ' + gaWeeks + 'w ' + gaDays + 'd | ' + termStatus,
          gaWeeks < 34
            ? '-> Preterm birth risk: consider antenatal corticosteroids if 24-34w and delivery likely in 7 days'
            : '',
          gaWeeks < 37 && gaWeeks >= 34
            ? '-> Late preterm: monitor for feeding difficulties, hypoglycemia, jaundice - NICU consultation'
            : '',
          gaWeeks >= 41
            ? '-> >=41 weeks: ACOG recommends offering induction 41+0 to 42+0; fetal surveillance'
            : '',
          gaWeeks >= 42
            ? 'OVERDUE: induction strongly recommended - post-term complications (placental insufficiency, meconium aspiration)'
            : '',
          '-> Viability threshold: 22-23 weeks (survival possible with intensive NICU care)',
        ].filter(Boolean),
      };
    },
  },
  // 3. Bishop Score
  {
    id: 'bishop-score-calculator',
    name: 'Bishop Score (Cervical Ripeness)',
    category: 'OB/GYN',
    icon: '🏥',
    description:
      'Assess cervical readiness for labor induction - predicts success of induction and likelihood of vaginal delivery',
    formula: 'Bishop Score = Dilation + Effacement + Station + Consistency + Position (0-13)',
    reference: 'Bishop EH. Obstet Gynecol 1964 / ACOG Practice Bulletin 107 (Induction of Labor)',
    inputs: [
      {
        id: 'dilation',
        label: 'Cervical Dilation',
        type: 'select',
        options: [
          { label: 'Closed (0 pts)', value: 0 },
          { label: '1-2 cm (1 pt)', value: 1 },
          { label: '3-4 cm (2 pts)', value: 2 },
          { label: '>=5 cm (3 pts)', value: 3 },
        ],
        defaultValue: 0,
      },
      {
        id: 'effacement',
        label: 'Cervical Effacement',
        type: 'select',
        options: [
          { label: '0-30% (0 pts)', value: 0 },
          { label: '40-50% (1 pt)', value: 1 },
          { label: '60-70% (2 pts)', value: 2 },
          { label: '>80% (3 pts)', value: 3 },
        ],
        defaultValue: 0,
      },
      {
        id: 'station',
        label: 'Fetal Station',
        type: 'select',
        options: [
          { label: '-3 or higher (0 pts)', value: 0 },
          { label: '-2 (1 pt)', value: 1 },
          { label: '-1 to 0 (2 pts)', value: 2 },
          { label: '+1 to +2 (3 pts)', value: 3 },
        ],
        defaultValue: 0,
      },
      {
        id: 'consistency',
        label: 'Cervical Consistency',
        type: 'select',
        options: [
          { label: 'Firm (0 pts)', value: 0 },
          { label: 'Medium (1 pt)', value: 1 },
          { label: 'Soft (2 pts)', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'position',
        label: 'Cervical Position',
        type: 'select',
        options: [
          { label: 'Posterior (0 pts)', value: 0 },
          { label: 'Mid/Anterior (1 pt)', value: 1 },
          { label: 'Anterior (2 pts)', value: 2 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const dil = Number(v.dilation),
        eff = Number(v.effacement),
        stat = Number(v.station);
      const con = Number(v.consistency),
        pos = Number(v.position);
      const score = dil + eff + stat + con + pos;
      const risk: CalculationResult['risk'] = score >= 8 ? 'low' : score >= 5 ? 'moderate' : 'high';
      const category =
        score >= 8
          ? 'Favourable cervix - high induction success likelihood'
          : score >= 5
            ? 'Moderately favourable - cervical ripening may improve outcomes'
            : score >= 3
              ? 'Unfavourable - cervical ripening recommended before induction'
              : 'Very unfavourable - ripening required (PGE2 or mechanical methods)';
      const method =
        score >= 8
          ? 'Oxytocin induction appropriate. AROM can be considered.'
          : score >= 5
            ? 'Oxytocin with or without AROM acceptable. Consider low-dose oxytocin protocol.'
            : 'Cervical ripening FIRST: misoprostol 25mcg PV q6h, dinoprostone, or Foley balloon catheter before oxytocin.';
      const successRate =
        score >= 9 ? '>90%' : score >= 8 ? '80-90%' : score >= 5 ? '50-75%' : '<50%';
      return {
        label: 'Bishop Score',
        value: score,
        unit: '/13',
        interpretation:
          category +
          '. Estimated induction success: ' +
          successRate +
          '. Recommended approach: ' +
          method,
        risk,
        riskPercentage: 'Induction success likelihood: ' + successRate,
        guidelineSource: 'Bishop EH. Obstet Gynecol 1964 / ACOG Practice Bulletin 107',
        scoreBreakdown: [
          { component: 'Cervical Dilation', score: dil, max: 3 },
          { component: 'Cervical Effacement', score: eff, max: 3 },
          { component: 'Fetal Station', score: stat, max: 3 },
          { component: 'Cervical Consistency', score: con, max: 2 },
          { component: 'Cervical Position', score: pos, max: 2 },
          { component: 'TOTAL Bishop Score', score, max: 13 },
          { component: 'Induction Success', score: successRate },
        ],
        details: [
          'Bishop Score: ' + score + '/13 - ' + category,
          'Recommended approach: ' + method,
          '-> Bishop >=8: favourable - proceed with oxytocin; AROM if presenting part well applied',
          '-> Bishop <6: unfavourable - cervical ripening before induction reduces C-section rate',
          '-> Mechanical ripening: Foley balloon (equally effective as pharmacological, lower tachysystole risk)',
          '-> Pharmacological ripening: misoprostol 25mcg PV/SL q4-6h OR dinoprostone PV q6h',
          '-> Modified Bishop: some centres omit station for a simplified 0-10 score',
          '-> Multiparity increases induction success regardless of Bishop score',
        ],
      };
    },
  },
  // 4. APGAR Score Calculator
  {
    id: 'apgar-score-calculator',
    name: 'APGAR Score Calculator',
    category: 'OB/GYN',
    icon: '👶',
    description:
      'Assess newborn condition at 1 and 5 minutes - guides immediate neonatal resuscitation decisions',
    formula: 'Appearance + Pulse + Grimace + Activity + Respiration = 0-10',
    reference:
      'Apgar V. Curr Res Anesth Analg 1953 / AAP/ACOG Neonatal Resuscitation Guidelines 2020',
    inputs: [
      {
        id: 'appearance',
        label: 'A - Appearance (skin color)',
        type: 'select',
        options: [
          { label: 'Blue/pale all over (0 pts)', value: 0 },
          { label: 'Body pink, extremities blue - acrocyanosis (1 pt)', value: 1 },
          { label: 'Completely pink (2 pts)', value: 2 },
        ],
        defaultValue: 1,
      },
      {
        id: 'pulse',
        label: 'P - Pulse (heart rate)',
        type: 'select',
        options: [
          { label: 'Absent (0 pts)', value: 0 },
          { label: '<100 bpm (1 pt)', value: 1 },
          { label: '>100 bpm (2 pts)', value: 2 },
        ],
        defaultValue: 2,
      },
      {
        id: 'grimace',
        label: 'G - Grimace (reflex irritability - catheter in nostril)',
        type: 'select',
        options: [
          { label: 'No response (0 pts)', value: 0 },
          { label: 'Grimace only (1 pt)', value: 1 },
          { label: 'Cry, cough, or sneeze (2 pts)', value: 2 },
        ],
        defaultValue: 1,
      },
      {
        id: 'activity',
        label: 'A - Activity (muscle tone)',
        type: 'select',
        options: [
          { label: 'Limp (0 pts)', value: 0 },
          { label: 'Some flexion of extremities (1 pt)', value: 1 },
          { label: 'Active motion (2 pts)', value: 2 },
        ],
        defaultValue: 1,
      },
      {
        id: 'respiration',
        label: 'R - Respiration (breathing effort)',
        type: 'select',
        options: [
          { label: 'Absent (0 pts)', value: 0 },
          { label: 'Weak cry, irregular, hypoventilation (1 pt)', value: 1 },
          { label: 'Good cry, regular, strong (2 pts)', value: 2 },
        ],
        defaultValue: 1,
      },
    ],
    calculate(v) {
      const app = Number(v.appearance),
        pul = Number(v.pulse),
        gri = Number(v.grimace);
      const act = Number(v.activity),
        res = Number(v.respiration);
      const score = app + pul + gri + act + res;
      const risk: CalculationResult['risk'] =
        score >= 7 ? 'low' : score >= 4 ? 'moderate' : 'critical';
      const category =
        score >= 7
          ? 'Reassuring - routine newborn care'
          : score >= 4
            ? 'Moderately depressed - stimulation and supplemental O2'
            : 'Severely depressed - immediate resuscitation required';
      const action =
        score >= 7
          ? 'Dry, warm, stimulate, skin-to-skin. Reassess at 5 minutes.'
          : score >= 4
            ? 'Stimulate, supplemental O2 by mask. Reassess at 5 min. Prepare for PPV if no improvement.'
            : 'IMMEDIATE: Warm, dry, stimulate. If HR <100 or absent - PPV with 21% O2. If HR <60 after 30s PPV - chest compressions + epinephrine.';
      return {
        label: 'APGAR Score',
        value: score,
        unit: '/10',
        interpretation: category + '. Action: ' + action,
        risk,
        riskPercentage:
          score < 7 ? 'Neonatal depression - resuscitation protocol' : 'Normal neonatal transition',
        guidelineSource: 'AAP/ACOG Neonatal Resuscitation Program (NRP) 2020',
        scoreBreakdown: [
          { component: 'A - Appearance (color)', score: app, max: 2 },
          { component: 'P - Pulse (HR)', score: pul, max: 2 },
          { component: 'G - Grimace (reflex)', score: gri, max: 2 },
          { component: 'A - Activity (tone)', score: act, max: 2 },
          { component: 'R - Respiration', score: res, max: 2 },
          { component: 'TOTAL APGAR', score, max: 10 },
        ],
        details: [
          'APGAR: ' + score + '/10 at this assessment - ' + category,
          action,
          score < 7 ? '-> If 5-min APGAR still <7: reassess every 5 min until 20 min of age' : '',
          '-> NRP trigger: HR <100 bpm - initiate PPV regardless of APGAR total',
          '-> PPV rate: 40-60 breaths/min at 21% O2 (room air); increase FiO2 if SpO2 target not met',
          '-> Chest compressions: HR <60 after 30s effective PPV - 3:1 ratio, FiO2 100%',
          '-> Epinephrine (cardiac arrest): 0.01-0.03 mg/kg IV (1:10,000) or 0.05-0.1mg/kg ET',
          '-> APGAR is a communication tool - it does NOT determine resuscitation decisions (use HR)',
        ].filter(Boolean),
      };
    },
  },
  // 5. Pre-eclampsia Risk Calculator
  {
    id: 'preeclampsia-risk-calculator',
    name: 'Pre-eclampsia Risk Assessment',
    category: 'OB/GYN',
    icon: '⚠️',
    description:
      'Assess first-trimester pre-eclampsia risk using ACOG risk factors to guide low-dose aspirin prophylaxis',
    formula:
      'ACOG criteria: 1 high-risk factor OR >=2 moderate-risk factors = offer aspirin 81mg/day from 12-28 weeks',
    reference: 'ACOG Practice Bulletin 222 (2020) / USPSTF 2021 / ASPRE Trial 2017',
    inputs: [
      {
        id: 'prev_pe',
        label: 'Previous pre-eclampsia (HIGH RISK)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'multifetal',
        label: 'Multifetal gestation (HIGH RISK)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'chronic_htn',
        label: 'Chronic hypertension (HIGH RISK)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'diabetes',
        label: 'Pregestational DM (type 1 or 2) (HIGH RISK)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'autoimmune',
        label: 'Autoimmune disease (SLE, antiphospholipid syndrome) (HIGH RISK)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 2 },
        ],
        defaultValue: 0,
      },
      {
        id: 'nullip',
        label: 'Nulliparity (MODERATE RISK)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'obesity',
        label: 'Pre-pregnancy BMI >30 (MODERATE RISK)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'family_hx',
        label: 'Family history of pre-eclampsia (MODERATE RISK)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'age_35',
        label: 'Age >= 35 (MODERATE RISK)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'low_income',
        label: 'Low socioeconomic status / BIPOC (MODERATE RISK)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const highRisk =
        Number(v.prev_pe) ||
        Number(v.multifetal) ||
        Number(v.chronic_htn) ||
        Number(v.diabetes) ||
        Number(v.autoimmune);
      const moderateScore =
        Number(v.nullip) +
        Number(v.obesity) +
        Number(v.family_hx) +
        Number(v.age_35) +
        Number(v.low_income);
      const aspirinIndicated = highRisk >= 2 || moderateScore >= 2;
      const riskLevel =
        highRisk >= 2
          ? 'critical'
          : highRisk >= 1
            ? 'high'
            : moderateScore >= 2
              ? 'moderate'
              : 'low';
      const risk: CalculationResult['risk'] = riskLevel as CalculationResult['risk'];
      const aspirinRec = aspirinIndicated
        ? 'LOW-DOSE ASPIRIN RECOMMENDED: 81-162 mg/day starting at 12-28 weeks (ideally by 16 weeks) and continuing until delivery. Reduces PE risk by 10-20%.'
        : 'Low-dose aspirin not routinely indicated based on current risk factors.';
      const highRiskFactors = [
        Number(v.prev_pe) ? 'Previous pre-eclampsia' : '',
        Number(v.multifetal) ? 'Multifetal gestation' : '',
        Number(v.chronic_htn) ? 'Chronic hypertension' : '',
        Number(v.diabetes) ? 'Pregestational diabetes' : '',
        Number(v.autoimmune) ? 'Autoimmune disease (SLE/APS)' : '',
      ].filter(Boolean);
      const modRiskFactors = [
        Number(v.nullip) ? 'Nulliparity' : '',
        Number(v.obesity) ? 'BMI >30' : '',
        Number(v.family_hx) ? 'Family history PE' : '',
        Number(v.age_35) ? 'Age >=35' : '',
        Number(v.low_income) ? 'Low socioeconomic status / BIPOC' : '',
      ].filter(Boolean);
      return {
        label: aspirinIndicated ? 'ASPIRIN INDICATED' : 'Low Risk',
        value:
          highRiskFactors.length > 0
            ? 'High Risk (' +
              highRiskFactors.length +
              ' high-risk factor' +
              (highRiskFactors.length > 1 ? 's' : '') +
              ')'
            : moderateScore >= 2
              ? 'Moderate Risk (' + moderateScore + ' moderate factors)'
              : 'Low Risk',
        interpretation:
          aspirinRec +
          ' High-risk factors: ' +
          (highRiskFactors.join(', ') || 'None') +
          '. Moderate-risk factors: ' +
          (modRiskFactors.join(', ') || 'None') +
          '.',
        risk,
        riskPercentage: aspirinIndicated ? 'Aspirin prophylaxis reduces PE risk 10-20%' : undefined,
        guidelineSource: 'ACOG Practice Bulletin 222 (2020) / USPSTF 2021',
        scoreBreakdown: [
          {
            component: 'High-risk factors present',
            score: highRiskFactors.length > 0 ? highRiskFactors.join(', ') : 'None',
          },
          {
            component: 'Moderate-risk factors present',
            score: modRiskFactors.length > 0 ? modRiskFactors.join(', ') : 'None',
          },
          {
            component: 'Aspirin Indication',
            score: aspirinIndicated ? 'YES - indicated' : 'No - not indicated',
          },
          {
            component: 'Aspirin dose',
            score: aspirinIndicated ? '81-162 mg/day from 12-28w' : 'N/A',
          },
        ],
        details: [
          'Pre-eclampsia risk: ' +
            (highRiskFactors.length > 0
              ? 'HIGH RISK (' + highRiskFactors.join(', ') + ')'
              : moderateScore >= 2
                ? 'MODERATE RISK (' + modRiskFactors.join(', ') + ')'
                : 'Low risk'),
          aspirinRec,
          '-> Combined screening (MAP + UtA-PI + PLGF at 11-14w): better PE prediction than risk factors alone',
          '-> Additional measures: blood pressure monitoring q visit; urine protein from 20w',
          '-> Calcium supplementation (1g/day) reduces PE risk if dietary Ca intake is low',
          '-> Warning signs to report: severe headache, visual changes, RUQ pain, sudden face/hand swelling',
          '-> SEVERE PE features: SBP >=160 or DBP >=110 on 2 occasions, severe symptoms, organ dysfunction',
        ],
      };
    },
  },
  // 6. Ovulation & Fertile Window Calculator
  {
    id: 'ovulation-fertile-window-calculator',
    name: 'Ovulation & Fertile Window Calculator',
    category: 'OB/GYN',
    icon: '🌸',
    description: 'Estimate ovulation date and fertile window for natural conception planning',
    formula:
      'Ovulation = LMP + (Cycle length - 14 days) | Fertile window = Ovulation - 5 days to Ovulation + 1 day',
    reference: 'ACOG / American Society for Reproductive Medicine (ASRM) Fertility Guidelines',
    inputs: [
      {
        id: 'cycle_length',
        label: 'Average Menstrual Cycle Length',
        type: 'number',
        unit: 'days',
        min: 21,
        max: 45,
        step: 1,
        defaultValue: 28,
      },
      {
        id: 'days_since_lmp',
        label: 'Days Since Last Menstrual Period',
        type: 'number',
        unit: 'days',
        min: 0,
        max: 45,
        step: 1,
        defaultValue: 1,
      },
    ],
    calculate(v) {
      const cycleLen = Number(v.cycle_length),
        daysSinceLMP = Number(v.days_since_lmp);
      const ovulationDay = cycleLen - 14; // day of cycle
      const daysToOvulation = ovulationDay - daysSinceLMP;
      const fertileStart = ovulationDay - 5;
      const fertileEnd = ovulationDay + 1;
      const inFertileWindow = daysSinceLMP >= fertileStart && daysSinceLMP <= fertileEnd;
      const peakFertility = daysSinceLMP === ovulationDay - 1 || daysSinceLMP === ovulationDay;
      const risk: CalculationResult['risk'] = 'low';
      const status = peakFertility
        ? 'PEAK FERTILITY - highest conception probability today/tomorrow'
        : inFertileWindow
          ? 'Within fertile window - moderate-high conception probability'
          : daysToOvulation > 0
            ? 'Pre-ovulation - fertile window begins in ' + (fertileStart - daysSinceLMP) + ' days'
            : 'Post-ovulation - next fertile window ~' +
              (cycleLen - daysSinceLMP + fertileStart) +
              ' days away';
      return {
        label: 'Days to Ovulation',
        value: daysToOvulation > 0 ? daysToOvulation.toString() : '0 (ovulation today or past)',
        interpretation:
          'Estimated ovulation: Cycle day ' +
          ovulationDay +
          ' (day ' +
          daysToOvulation +
          ' from now). Fertile window: Cycle days ' +
          fertileStart +
          '-' +
          fertileEnd +
          '. ' +
          status,
        risk,
        riskPercentage: inFertileWindow ? 'Currently in fertile window' : 'Outside fertile window',
        guidelineSource: 'ASRM Fertility Guidelines / ACOG',
        scoreBreakdown: [
          { component: 'Cycle Length', score: cycleLen + ' days' },
          {
            component: 'Days since LMP',
            score: daysSinceLMP + ' days (Cycle day ' + daysSinceLMP + ')',
          },
          { component: 'Estimated Ovulation', score: 'Cycle day ' + ovulationDay },
          {
            component: 'Days to Ovulation',
            score: daysToOvulation > 0 ? daysToOvulation + ' days' : 'Ovulation today or past',
          },
          {
            component: 'Fertile Window',
            score: 'Cycle days ' + fertileStart + ' to ' + fertileEnd,
          },
          { component: 'Fertility Status', score: status.split(' - ')[0] },
        ],
        details: [
          'Ovulation estimated: cycle day ' +
            ovulationDay +
            ' | Fertile window: days ' +
            fertileStart +
            '-' +
            fertileEnd,
          status,
          '-> Peak fertility: 2 days before and day of ovulation (lifespan of egg ~12-24h)',
          '-> Sperm survive 5 days in cervical mucus - intercourse 5 days before ovulation can lead to conception',
          '-> LH surge tracking (OPK): surge occurs 24-36h before ovulation - test from cycle day ' +
            Math.max(1, fertileStart - 2),
          '-> BBT charting: temperature rise 0.2-0.5C AFTER ovulation - confirms but does not predict',
          '-> Irregular cycles: ovulation tracking (OPK/US) more accurate than calendar method',
          '-> ASRM: if no conception after 12 months (age <35) or 6 months (age >=35): fertility evaluation',
        ],
      };
    },
  },
  // 7. Fetal Weight Estimator (Hadlock)
  {
    id: 'fetal-weight-estimator',
    name: 'Estimated Fetal Weight (Hadlock Formula)',
    category: 'OB/GYN',
    icon: '🩻',
    description:
      'Estimate fetal weight from ultrasound biometrics using Hadlock 4-parameter formula',
    formula:
      'log10(EFW) = 1.3596 - 0.00386 x AC x FL + 0.0064 x HC + 0.00061 x BPD x AC + 0.0424 x AC + 0.174 x FL',
    reference: 'Hadlock FP et al. Radiology 1985 / ISUOG Practice Guidelines',
    inputs: [
      {
        id: 'bpd',
        label: 'Biparietal Diameter (BPD)',
        type: 'number',
        unit: 'mm',
        min: 10,
        max: 110,
        step: 0.1,
        defaultValue: 85,
        placeholder: 'e.g. 85',
      },
      {
        id: 'hc',
        label: 'Head Circumference (HC)',
        type: 'number',
        unit: 'mm',
        min: 50,
        max: 380,
        step: 0.1,
        defaultValue: 310,
        placeholder: 'e.g. 310',
      },
      {
        id: 'ac',
        label: 'Abdominal Circumference (AC)',
        type: 'number',
        unit: 'mm',
        min: 50,
        max: 400,
        step: 0.1,
        defaultValue: 300,
        placeholder: 'e.g. 300',
      },
      {
        id: 'fl',
        label: 'Femur Length (FL)',
        type: 'number',
        unit: 'mm',
        min: 10,
        max: 90,
        step: 0.1,
        defaultValue: 62,
        placeholder: 'e.g. 62',
      },
    ],
    calculate(v) {
      const bpd = Number(v.bpd),
        hc = Number(v.hc),
        ac = Number(v.ac),
        fl = Number(v.fl);
      // Hadlock 4-parameter formula (BPD, HC, AC, FL in cm)
      const bpdCm = bpd / 10,
        hcCm = hc / 10,
        acCm = ac / 10,
        flCm = fl / 10;
      const logEFW =
        1.3596 -
        0.00386 * acCm * flCm +
        0.0064 * hcCm +
        0.00061 * bpdCm * acCm +
        0.0424 * acCm +
        0.174 * flCm;
      const efwGrams = Math.round(Math.pow(10, logEFW));
      const efwLbs = (efwGrams / 453.6).toFixed(1);
      const errorRange15pct = Math.round(efwGrams * 0.15);
      // Approximate percentile based on weight (rough - not GA-adjusted here)
      const smallNote =
        efwGrams < 2500
          ? 'Low birth weight range (<2500g)'
          : efwGrams > 4000
            ? 'Large for gestational age range (>4000g - macrosomia)'
            : '';
      const risk: CalculationResult['risk'] =
        efwGrams < 2500 ? 'high' : efwGrams > 4000 ? 'moderate' : 'low';
      return {
        label: 'Estimated Fetal Weight',
        value: efwGrams.toLocaleString(),
        unit: 'grams',
        interpretation:
          'EFW: ' +
          efwGrams.toLocaleString() +
          'g (' +
          efwLbs +
          ' lbs). Margin of error: +/-15% (' +
          (efwGrams - errorRange15pct).toLocaleString() +
          ' - ' +
          (efwGrams + errorRange15pct).toLocaleString() +
          'g). ' +
          (smallNote || 'Within normal weight range.'),
        risk,
        riskPercentage:
          efwGrams < 2500
            ? 'Low birth weight range'
            : efwGrams > 4000
              ? 'Macrosomia range (>4000g)'
              : undefined,
        guidelineSource: 'Hadlock FP et al. Radiology 1985 / ISUOG Practice Guidelines',
        scoreBreakdown: [
          { component: 'BPD', score: bpd + ' mm (' + bpdCm.toFixed(1) + ' cm)' },
          { component: 'HC', score: hc + ' mm (' + hcCm.toFixed(1) + ' cm)' },
          { component: 'AC', score: ac + ' mm (' + acCm.toFixed(1) + ' cm)' },
          { component: 'FL', score: fl + ' mm (' + flCm.toFixed(1) + ' cm)' },
          {
            component: 'EFW (Hadlock 4-param)',
            score: efwGrams.toLocaleString() + ' g (' + efwLbs + ' lbs)',
          },
          {
            component: 'Margin of error (+/-15%)',
            score: '+' + errorRange15pct + 'g / -' + errorRange15pct + 'g',
          },
          { component: 'Weight assessment', score: smallNote || 'Normal weight range' },
        ],
        details: [
          'EFW: ' +
            efwGrams.toLocaleString() +
            'g (+/-15%: ' +
            (efwGrams - errorRange15pct).toLocaleString() +
            '-' +
            (efwGrams + errorRange15pct).toLocaleString() +
            'g)',
          '-> IMPORTANT: Hadlock EFW has systematic margin of error of +/-15% (typical at term: +/-400g)',
          efwGrams < 2500
            ? '-> EFW <2500g: FGR/SGA workup - Doppler (UA, MCA, CPR), amniotic fluid index, growth surveillance'
            : '',
          efwGrams > 4000
            ? '-> EFW >4000g (macrosomia): counsel on shoulder dystocia risk, caesarean discussion, glucose monitoring'
            : '',
          '-> AC is the single most predictive biometric for fetal weight',
          '-> Serial US growth scans: at least q3-4 weeks for reliable growth velocity assessment',
          '-> Customised growth charts (e.g. Fetal Growth Foundation) preferred over population charts',
        ].filter(Boolean),
      };
    },
  },
  // 8. Gestational Weight Gain Monitor
  {
    id: 'pregnancy-weight-gain-calculator',
    name: 'Gestational Weight Gain Assessment (IOM)',
    category: 'OB/GYN',
    icon: '⚖️',
    description:
      'Assess gestational weight gain against IOM 2009 guidelines based on pre-pregnancy BMI',
    formula:
      'IOM 2009 targets: Underweight 12.5-18kg | Normal 11.5-16kg | Overweight 7-11.5kg | Obese 5-9kg',
    reference:
      'IOM (Institute of Medicine) Weight Gain During Pregnancy 2009 / ACOG Practice Bulletin 156',
    inputs: [
      {
        id: 'pre_bmi',
        label: 'Pre-Pregnancy BMI',
        type: 'number',
        unit: 'kg/m2',
        min: 14,
        max: 60,
        step: 0.1,
        defaultValue: 23.0,
      },
      {
        id: 'current_gain',
        label: 'Weight Gained So Far',
        type: 'number',
        unit: 'kg',
        min: 0,
        max: 50,
        step: 0.1,
        defaultValue: 8.0,
      },
      {
        id: 'ga_weeks',
        label: 'Current Gestational Age',
        type: 'number',
        unit: 'weeks',
        min: 4,
        max: 42,
        step: 1,
        defaultValue: 28,
      },
    ],
    calculate(v) {
      const bmi = Number(v.pre_bmi),
        gained = Number(v.current_gain),
        gaWks = Number(v.ga_weeks);
      // IOM 2009 targets
      let minTarget: number, maxTarget: number, category: string, weeklyRate: string;
      if (bmi < 18.5) {
        minTarget = 12.5;
        maxTarget = 18;
        category = 'Underweight';
        weeklyRate = '0.44-0.58 kg/week (2nd-3rd trimester)';
      } else if (bmi < 25) {
        minTarget = 11.5;
        maxTarget = 16;
        category = 'Normal weight';
        weeklyRate = '0.35-0.50 kg/week (2nd-3rd trimester)';
      } else if (bmi < 30) {
        minTarget = 7;
        maxTarget = 11.5;
        category = 'Overweight';
        weeklyRate = '0.23-0.33 kg/week (2nd-3rd trimester)';
      } else {
        minTarget = 5;
        maxTarget = 9;
        category = 'Obese (BMI >=30)';
        weeklyRate = '0.17-0.27 kg/week (2nd-3rd trimester)';
      }
      // Expected gain at this GA (rough: 1-2kg T1 then weekly rate)
      const t1Gain = 1.5; // typical T1 gain
      const trimester2Start = 13,
        weeksInT2T3 = Math.max(0, gaWks - trimester2Start);
      const minExpected = gaWks > trimester2Start ? t1Gain + 0.35 * weeksInT2T3 : t1Gain;
      const maxExpected = gaWks > trimester2Start ? t1Gain + 0.5 * weeksInT2T3 : 2;
      const status =
        gained < minExpected
          ? 'Below expected gain for gestational age - nutritional assessment recommended'
          : gained > maxExpected
            ? 'Above expected gain for gestational age - dietary counseling recommended'
            : 'On track - within expected range for gestational age';
      const risk: CalculationResult['risk'] =
        gained < minExpected ? 'moderate' : gained > maxExpected ? 'moderate' : 'low';
      return {
        label: 'Weight Gain Status',
        value: gained + ' kg gained',
        interpretation:
          'Pre-pregnancy BMI: ' +
          bmi +
          ' (' +
          category +
          '). IOM target: ' +
          minTarget +
          '-' +
          maxTarget +
          'kg total. Weekly rate target: ' +
          weeklyRate +
          '. Status: ' +
          status,
        risk,
        riskPercentage:
          'IOM total target: ' +
          minTarget +
          '-' +
          maxTarget +
          'kg | Currently: ' +
          gained +
          'kg at ' +
          gaWks +
          'w',
        guidelineSource: 'IOM Weight Gain During Pregnancy 2009 / ACOG Practice Bulletin 156',
        scoreBreakdown: [
          { component: 'Pre-pregnancy BMI', score: bmi + ' (' + category + ')' },
          { component: 'IOM Total Weight Gain Target', score: minTarget + '-' + maxTarget + ' kg' },
          { component: 'IOM Weekly Rate (T2/T3)', score: weeklyRate },
          { component: 'Weight Gained', score: gained + ' kg at ' + gaWks + ' weeks' },
          {
            component: 'Expected range at ' + gaWks + 'w (normal BMI)',
            score: minExpected.toFixed(1) + '-' + maxExpected.toFixed(1) + ' kg',
          },
          { component: 'Status', score: status.split(' - ')[0] },
        ],
        details: [
          'Gained: ' +
            gained +
            'kg | IOM target total: ' +
            minTarget +
            '-' +
            maxTarget +
            'kg (' +
            category +
            ')',
          'Weekly target (T2/T3): ' + weeklyRate,
          status,
          gained > maxTarget
            ? '-> Excessive gain: increased risk GDM, macrosomia, C-section, hypertension, postpartum weight retention'
            : '',
          gained < minTarget
            ? '-> Insufficient gain: increased risk FGR, preterm birth, low birth weight'
            : '',
          '-> Twin pregnancy targets: 17-25kg (normal BMI), 14-23kg (overweight), 11-19kg (obese)',
          '-> Gestational weight gain monitoring: weigh at every antenatal visit; plot on IOM chart',
        ].filter(Boolean),
      };
    },
  },
  // 9. IVF Success Rate Estimator
  {
    id: 'ivf-success-rate-calculator',
    name: 'IVF Success Rate Estimator',
    category: 'OB/GYN',
    icon: '🔬',
    description:
      'Estimate IVF live birth rate per cycle based on age, diagnosis, and prior IVF history (SART-based data)',
    formula: 'Age-stratified live birth rates from SART 2022 National Summary Report',
    reference: 'SART 2022 National Summary Report / ASRM Practice Committee Guidelines',
    inputs: [
      {
        id: 'age',
        label: 'Patient Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 50,
        defaultValue: 34,
      },
      {
        id: 'diagnosis',
        label: 'Primary Infertility Diagnosis',
        type: 'select',
        options: [
          { label: 'Unexplained / Male factor', value: 'unexplained' },
          { label: 'Diminished Ovarian Reserve (DOR)', value: 'dor' },
          { label: 'Tubal factor', value: 'tubal' },
          { label: 'Endometriosis', value: 'endo' },
          { label: 'PCOS / Ovulatory dysfunction', value: 'pcos' },
          { label: 'Uterine factor', value: 'uterine' },
        ],
        defaultValue: 'unexplained',
      },
      {
        id: 'prior_live_birth',
        label: 'Prior Live Birth (any method)',
        type: 'select',
        options: [
          { label: 'No prior live birth', value: 0 },
          { label: 'Prior live birth', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const age = Number(v.age),
        diagnosis = String(v.diagnosis),
        priorBirth = Number(v.prior_live_birth);
      // SART 2022 approximate live birth rates per transfer (own eggs)
      let baseRate: number;
      if (age < 35) baseRate = 52;
      else if (age < 38) baseRate = 38;
      else if (age < 40) baseRate = 28;
      else if (age < 43) baseRate = 15;
      else baseRate = 5;
      // Diagnosis adjustment
      const diagAdj: { [k: string]: number } = {
        unexplained: 0,
        tubal: 0,
        pcos: 3,
        uterine: -5,
        endo: -3,
        dor: -15,
      };
      const priorAdj = priorBirth ? 5 : 0;
      const finalRate = Math.max(1, Math.min(65, baseRate + (diagAdj[diagnosis] || 0) + priorAdj));
      const risk: CalculationResult['risk'] =
        finalRate >= 35 ? 'low' : finalRate >= 15 ? 'moderate' : 'high';
      const ageCategory =
        age < 35
          ? '<35 (best prognosis)'
          : age < 38
            ? '35-37'
            : age < 40
              ? '38-39'
              : age < 43
                ? '40-42'
                : '>=43 (poor prognosis)';
      const cyclesNeeded50pct = Math.ceil(Math.log(1 - 0.5) / Math.log(1 - finalRate / 100));
      return {
        label: 'Est. Live Birth Rate/Transfer',
        value: finalRate,
        unit: '%',
        interpretation:
          'Estimated live birth rate: ~' +
          finalRate +
          '% per transfer cycle. Age group: ' +
          ageCategory +
          '. Approx. ' +
          cyclesNeeded50pct +
          ' cycle(s) needed for 50% cumulative success probability. Note: this is a population-based estimate - individual results vary significantly.',
        risk,
        riskPercentage: '~' + finalRate + '% live birth rate per transfer',
        guidelineSource: 'SART 2022 National Summary Report / ASRM 2023',
        scoreBreakdown: [
          { component: 'Age', score: age + ' years (' + ageCategory + ')' },
          { component: 'Base rate by age', score: baseRate + '%' },
          {
            component: 'Diagnosis adjustment',
            score:
              (diagAdj[diagnosis] >= 0 ? '+' : '') + diagAdj[diagnosis] + '% (' + diagnosis + ')',
          },
          {
            component: 'Prior live birth bonus',
            score: (priorAdj >= 0 ? '+' : '') + priorAdj + '%',
          },
          { component: 'Estimated live birth rate', score: '~' + finalRate + '% per transfer' },
          { component: 'Cycles for 50% cumulative', score: '~' + cyclesNeeded50pct + ' cycle(s)' },
        ],
        details: [
          'Estimated live birth rate: ~' + finalRate + '% per transfer | Age: ' + ageCategory,
          'Report live birth rate (not clinical pregnancy rate) for counseling - rates are often 10-15% lower',
          '-> Age is the single most important predictor of IVF success',
          '-> Frozen embryo transfer (FET): similar or higher success rates than fresh transfer in current practice',
          '-> PGT-A (preimplantation genetic testing): reduces miscarriage but reduces embryo pool',
          '-> DOR: consider AMH, AFC; prognosis poor if both markedly reduced',
          '-> Multiple cycle cumulative success: ' +
            (finalRate > 30
              ? '>70% after 3 cycles'
              : finalRate > 15
                ? '50-70% after 3 cycles'
                : '<50% after 3 cycles'),
          '-> ASRM: female age <35, unexplained infertility: consider empirical IUI x3 before IVF',
        ],
      };
    },
  },
  // 10. Postpartum Hemorrhage Risk Calculator
  {
    id: 'postpartum-hemorrhage-calculator',
    name: 'Postpartum Hemorrhage (PPH) Risk Assessment',
    category: 'OB/GYN',
    icon: '🚨',
    description:
      'Assess antepartum PPH risk to guide preventive measures and preparedness (AWHONN Quantitative Blood Loss)',
    formula:
      'Weighted risk factor scoring - identifies patients for active management and enhanced monitoring',
    reference: 'AWHONN PPH Guidelines 2015 / ACOG Practice Bulletin 183 (2017) / WHO 2012',
    inputs: [
      {
        id: 'prev_pph',
        label: 'Previous postpartum hemorrhage',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'placenta_previa',
        label: 'Placenta previa / accreta spectrum',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (3 pts)', value: 3 },
        ],
        defaultValue: 0,
      },
      {
        id: 'multiple',
        label: 'Multiple gestation (twins or more)',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'grand_multi',
        label: 'Grand multiparity (>=5 prior births)',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'macrosomia',
        label: 'Macrosomia (EFW >4kg) or polyhydramnios',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'uterine_fibroids',
        label: 'Uterine fibroids (significant)',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'prolonged_labor',
        label: 'Prolonged labor (>12h active phase)',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'chorioamnionitis',
        label: 'Chorioamnionitis / fever in labor',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const score = [
        'prev_pph',
        'placenta_previa',
        'multiple',
        'grand_multi',
        'macrosomia',
        'uterine_fibroids',
        'prolonged_labor',
        'chorioamnionitis',
      ].reduce((s, k) => s + Number(v[k]), 0);
      const risk: CalculationResult['risk'] =
        score === 0 ? 'low' : score <= 1 ? 'moderate' : score <= 2 ? 'high' : 'critical';
      const category =
        score === 0
          ? 'Low risk - standard PPH prevention'
          : score <= 1
            ? 'Moderate risk - enhanced monitoring'
            : score <= 2
              ? 'High risk - active management protocol + IV access'
              : 'Very high risk - emergency preparedness, type and crossmatch, senior obstetric team';
      const management =
        score === 0
          ? 'Active management of 3rd stage (oxytocin 10IU IM/IV + controlled cord traction)'
          : score <= 1
            ? 'Active management + quantitative blood loss measurement + 18G IV x2'
            : score <= 2
              ? 'Active management + 2x large-bore IV + type&screen + cell salvage consideration + MTP protocol awareness'
              : 'Senior obstetrician + anesthesia + blood bank notification + crossmatch 2-4 units + MTP protocol activation plan';
      return {
        label: 'PPH Risk Level',
        value: category.split(' - ')[0],
        interpretation:
          category +
          '. Management: ' +
          management +
          '. PPH definition: blood loss >=500mL (vaginal) or >=1000mL (C-section) OR any hemodynamically significant loss.',
        risk,
        riskPercentage:
          score >= 2 ? 'High/Very high PPH risk - activate enhanced protocol' : undefined,
        guidelineSource: 'ACOG Practice Bulletin 183 (2017) / AWHONN PPH Guidelines 2015',
        scoreBreakdown: [
          { component: 'Previous PPH', score: Number(v.prev_pph), max: 1 },
          { component: 'Placenta previa / accreta', score: Number(v.placenta_previa), max: 3 },
          { component: 'Multiple gestation', score: Number(v.multiple), max: 1 },
          { component: 'Grand multiparity', score: Number(v.grand_multi), max: 1 },
          { component: 'Macrosomia / polyhydramnios', score: Number(v.macrosomia), max: 1 },
          { component: 'Uterine fibroids', score: Number(v.uterine_fibroids), max: 1 },
          { component: 'Prolonged labor', score: Number(v.prolonged_labor), max: 1 },
          { component: 'Chorioamnionitis', score: Number(v.chorioamnionitis), max: 1 },
          { component: 'TOTAL RISK SCORE', score, max: 10 },
        ],
        details: [
          'PPH risk: ' + category,
          'Management protocol: ' + management,
          '-> PPH is leading cause of maternal mortality worldwide - early recognition is critical',
          '-> ACTIVE 3rd stage management: oxytocin 10IU (IV or IM) reduces PPH by 50%',
          '-> Quantitative blood loss (QBL) measurement recommended for all deliveries - replaces visual estimation',
          '-> Uterotonic ladder: oxytocin -> ergometrine -> carboprost -> misoprostol -> tranexamic acid',
          '-> Tranexamic acid 1g IV within 3h of PPH onset (WOMAN trial) - reduces PPH mortality 30%',
          score >= 2
            ? '-> Blood bank notification + crossmatch required pre-delivery for high-risk patients'
            : '',
        ].filter(Boolean),
      };
    },
  },
];

export const pulmonologyConfigs: MedicalConfig[] = [
  // 1. Spirometry / FEV1/FVC Interpreter (GOLD COPD)
  {
    id: 'spirometry-fev1-fvc-interpreter',
    name: 'Spirometry Interpreter (GOLD COPD / ATS)',
    category: 'Pulmonology',
    icon: '🫁',
    description:
      'Interpret FEV1, FVC, and FEV1/FVC ratio for COPD staging (GOLD 2023) and obstruction/restriction classification',
    formula:
      'FEV1/FVC <0.70 = obstruction | GOLD 1-4 by FEV1% predicted | TLC/RV for restriction pattern',
    reference: 'GOLD 2023 COPD Strategy Report / ATS/ERS Spirometry Interpretation Guidelines 2022',
    inputs: [
      {
        id: 'fev1',
        label: 'FEV1 (Forced Expiratory Volume in 1 second)',
        type: 'number',
        unit: 'L',
        min: 0.3,
        max: 8,
        step: 0.01,
        defaultValue: 2.0,
        placeholder: 'e.g. 2.0',
      },
      {
        id: 'fvc',
        label: 'FVC (Forced Vital Capacity)',
        type: 'number',
        unit: 'L',
        min: 0.5,
        max: 10,
        step: 0.01,
        defaultValue: 3.5,
        placeholder: 'e.g. 3.5',
      },
      {
        id: 'fev1_pred',
        label: 'FEV1 % Predicted',
        type: 'number',
        unit: '%',
        min: 5,
        max: 150,
        step: 1,
        defaultValue: 65,
        placeholder: 'e.g. 65 (from spirometry report)',
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 100,
        defaultValue: 60,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        defaultValue: 'male',
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        unit: 'cm',
        min: 100,
        max: 220,
        defaultValue: 170,
      },
    ],
    calculate(v) {
      const fev1 = Number(v.fev1),
        fvc = Number(v.fvc),
        fev1pct = Number(v.fev1_pred);
      const ratio = fev1 / fvc;
      const obstruction = ratio < 0.7;
      const risk: CalculationResult['risk'] = !obstruction
        ? 'low'
        : fev1pct >= 80
          ? 'low'
          : fev1pct >= 50
            ? 'moderate'
            : fev1pct >= 30
              ? 'high'
              : 'critical';
      let goldStage: string, goldDesc: string, spirPattern: string;
      if (obstruction) {
        if (fev1pct >= 80) {
          goldStage = 'GOLD 1 (Mild)';
          goldDesc = 'FEV1 >=80% predicted';
        } else if (fev1pct >= 50) {
          goldStage = 'GOLD 2 (Moderate)';
          goldDesc = 'FEV1 50-79% predicted';
        } else if (fev1pct >= 30) {
          goldStage = 'GOLD 3 (Severe)';
          goldDesc = 'FEV1 30-49% predicted';
        } else {
          goldStage = 'GOLD 4 (Very Severe)';
          goldDesc = 'FEV1 <30% predicted';
        }
        spirPattern = 'Obstructive pattern (FEV1/FVC ' + ratio.toFixed(2) + ')';
      } else {
        spirPattern = 'No obstruction (FEV1/FVC ' + ratio.toFixed(2) + ')';
        goldStage = 'N/A (no obstruction)';
        goldDesc = fev1pct < 70 ? 'Consider restrictive pattern - check TLC' : 'Normal spirometry';
      }
      const management =
        !obstruction && fev1pct >= 70
          ? 'Normal spirometry - no bronchodilator indicated based on spirometry alone'
          : goldStage.includes('1')
            ? 'LABA or LAMA (long-acting bronchodilator) monotherapy; pulmonary rehab referral if symptomatic'
            : goldStage.includes('2')
              ? 'Dual bronchodilator (LABA+LAMA); pulmonary rehab'
              : goldStage.includes('3')
                ? 'LABA+LAMA; consider adding ICS if >=2 exacerbations/year or eosinophils >=300; pulmonary rehab'
                : 'LABA+LAMA+ICS (triple therapy); pulmonary rehab; assess for LTOT; lung transplant evaluation';
      return {
        label: obstruction ? 'GOLD Stage' : 'Spirometry Result',
        value: obstruction ? goldStage : spirPattern,
        interpretation:
          spirPattern +
          '. ' +
          goldDesc +
          '. ' +
          management +
          '. FEV1: ' +
          fev1 +
          'L (' +
          fev1pct +
          '% predicted) | FVC: ' +
          fvc +
          'L | FEV1/FVC: ' +
          ratio.toFixed(2),
        risk,
        riskPercentage: obstruction
          ? 'GOLD ' + goldStage + ' | FEV1 ' + fev1pct + '% predicted'
          : undefined,
        guidelineSource: 'GOLD 2023 COPD Strategy / ATS/ERS Spirometry Interpretation 2022',
        scoreBreakdown: [
          { component: 'FEV1', score: fev1 + 'L' },
          { component: 'FVC', score: fvc + 'L' },
          {
            component: 'FEV1/FVC ratio',
            score: ratio.toFixed(3) + ' (' + (ratio < 0.7 ? 'OBSTRUCTION' : 'No obstruction') + ')',
          },
          { component: 'FEV1 % Predicted', score: fev1pct + '%' },
          { component: 'Pattern', score: spirPattern },
          { component: 'GOLD Stage', score: goldStage },
          { component: 'GOLD Description', score: goldDesc },
          { component: 'Recommended Management', score: management.split(';')[0] },
        ],
        details: [
          'FEV1/FVC: ' +
            ratio.toFixed(3) +
            ' | FEV1: ' +
            fev1pct +
            '% predicted | Pattern: ' +
            spirPattern,
          'GOLD Stage: ' + goldStage + ' - ' + goldDesc,
          'Management: ' + management,
          obstruction
            ? '-> Bronchodilator reversibility test: 200-400mcg salbutamol; repeat spirometry 15 min later'
            : '',
          '-> LLN (Lower Limit of Normal) preferred over fixed 0.70 threshold in elderly: reduces overdiagnosis',
          '-> COPD diagnosis requires: symptoms + spirometry; spirometry alone insufficient',
          '-> USPSTF LDCT screening: age 50-80, >=20 pack-years, current smoker or quit within 15 years',
          '-> Pulmonary rehab: reduces hospitalizations by 26%, improves QoL regardless of GOLD stage',
          '-> mMRC dyspnea scale + CAT score guide symptom-based GOLD ABCD group classification',
        ].filter(Boolean),
      };
    },
  },
  // 2. Alveolar-Arterial (A-a) Oxygen Gradient
  {
    id: 'alveolar-arterial-gradient',
    name: 'Alveolar-Arterial (A-a) O2 Gradient',
    category: 'Pulmonology',
    icon: '🔬',
    description:
      'Calculate A-a gradient to differentiate causes of hypoxemia - elevated gradient suggests V/Q mismatch, diffusion defect, or shunt',
    formula:
      'PAO2 = (FiO2 x [Patm - PH2O]) - PaCO2/RQ | A-a gradient = PAO2 - PaO2 | Normal = Age/4 + 4',
    reference: 'West JB. Pulmonary Physiology 2012 / ATS Clinical Practice Guidelines',
    inputs: [
      {
        id: 'pao2',
        label: 'PaO2 (arterial O2 tension from ABG)',
        type: 'number',
        unit: 'mmHg',
        min: 20,
        max: 700,
        defaultValue: 80,
        placeholder: 'e.g. 80',
      },
      {
        id: 'paco2',
        label: 'PaCO2 (arterial CO2 from ABG)',
        type: 'number',
        unit: 'mmHg',
        min: 10,
        max: 100,
        defaultValue: 40,
        placeholder: 'e.g. 40',
      },
      {
        id: 'fio2',
        label: 'FiO2 at time of ABG',
        type: 'number',
        unit: '',
        min: 0.21,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.21,
        placeholder: 'e.g. 0.21 (room air)',
      },
      {
        id: 'age',
        label: 'Patient Age (for expected A-a range)',
        type: 'number',
        unit: 'years',
        min: 1,
        max: 120,
        defaultValue: 45,
      },
      {
        id: 'patm',
        label: 'Atmospheric Pressure (sea level = 760)',
        type: 'number',
        unit: 'mmHg',
        min: 500,
        max: 800,
        defaultValue: 760,
        placeholder: '760 at sea level',
      },
    ],
    calculate(v) {
      const pao2 = Number(v.pao2),
        paco2 = Number(v.paco2),
        fio2 = Number(v.fio2);
      const age = Number(v.age),
        patm = Number(v.patm);
      const ph2o = 47; // water vapor pressure at 37°C
      const rq = 0.8; // respiratory quotient
      const pao2Alveolar = fio2 * (patm - ph2o) - paco2 / rq;
      const aaGradient = pao2Alveolar - pao2;
      const normalAA = age / 4 + 4; // age-adjusted normal upper limit
      const elevated = aaGradient > normalAA;
      const risk: CalculationResult['risk'] =
        pao2 < 60 ? 'critical' : pao2 < 80 ? 'high' : aaGradient > normalAA ? 'moderate' : 'low';
      const cause = !elevated
        ? 'Normal A-a gradient - hypoventilation is the likely cause of hypoxemia (e.g. opioids, neuromuscular, obesity hypoventilation)'
        : 'Elevated A-a gradient - V/Q mismatch (PE, pneumonia, COPD), diffusion defect (ILD, emphysema), or intracardiac/pulmonary shunt';
      const pfRatio = pao2 / fio2;
      const ardsClass =
        pfRatio < 100
          ? 'Severe ARDS'
          : pfRatio < 200
            ? 'Moderate ARDS'
            : pfRatio < 300
              ? 'Mild ARDS'
              : 'No ARDS (P/F >=300)';
      return {
        label: 'A-a Gradient',
        value: aaGradient.toFixed(1),
        unit: 'mmHg',
        interpretation:
          'A-a gradient: ' +
          aaGradient.toFixed(1) +
          ' mmHg (normal for age ' +
          age +
          ': <' +
          normalAA.toFixed(0) +
          ' mmHg). ' +
          (elevated ? 'ELEVATED' : 'Normal') +
          '. ' +
          cause +
          '. P/F ratio: ' +
          pfRatio.toFixed(0) +
          ' mmHg (' +
          ardsClass +
          ').',
        risk,
        riskPercentage: elevated
          ? 'Elevated A-a gradient - parenchymal/vascular cause'
          : 'Normal A-a gradient - hypoventilation likely',
        guidelineSource: 'West JB. Pulmonary Physiology and Pathophysiology 2012',
        scoreBreakdown: [
          { component: 'FiO2', score: fio2 + ' (' + Math.round(fio2 * 100) + '% O2)' },
          { component: 'Atmospheric pressure', score: patm + ' mmHg' },
          { component: 'Alveolar PO2 (PAO2)', score: pao2Alveolar.toFixed(1) + ' mmHg' },
          { component: 'Arterial PaO2', score: pao2 + ' mmHg' },
          { component: 'A-a gradient', score: aaGradient.toFixed(1) + ' mmHg' },
          {
            component: 'Age-adjusted normal upper limit',
            score: '<' + normalAA.toFixed(0) + ' mmHg (age ' + age + ')',
          },
          { component: 'Gradient status', score: elevated ? 'ELEVATED (above normal)' : 'Normal' },
          { component: 'P/F ratio', score: pfRatio.toFixed(0) + ' mmHg - ' + ardsClass },
        ],
        details: [
          'A-a gradient: ' +
            aaGradient.toFixed(1) +
            ' mmHg | Normal upper limit: ' +
            normalAA.toFixed(0) +
            ' mmHg | ' +
            (elevated ? 'ELEVATED' : 'Normal'),
          cause,
          'P/F ratio: ' + pfRatio.toFixed(0) + ' mmHg - ' + ardsClass,
          elevated ? '-> Consider: CXR, CT-PA for PE, echocardiogram for shunt, HRCT for ILD' : '',
          '-> Normal A-a gradient with hypoxemia: treat underlying hypoventilation (naloxone, NIV)',
          '-> A-a gradient >30 on room air is highly elevated and warrants urgent workup',
          '-> On supplemental O2: A-a gradient interpretation less reliable; P/F ratio preferred for ARDS',
          '-> High altitude: atmospheric pressure lower - adjust Patm accordingly (e.g. 630 mmHg at 1500m)',
        ].filter(Boolean),
      };
    },
  },
  // 3. PaO2/FiO2 Ratio (ARDS Berlin Definition)
  {
    id: 'pao2-fio2-ratio-ards',
    name: 'PaO2/FiO2 Ratio (Berlin ARDS Definition)',
    category: 'Pulmonology',
    icon: '🏥',
    description:
      'Calculate P/F ratio to classify ARDS severity per Berlin Definition - guides lung-protective ventilation and ECMO decisions',
    formula:
      'P/F ratio = PaO2 (mmHg) / FiO2 | Berlin ARDS: Mild 200-300 | Moderate 100-200 | Severe <100 (all with PEEP >=5)',
    reference:
      'ARDS Definition Task Force (Berlin). JAMA 2012 / ARDS Network Protocol / Surviving Sepsis 2021',
    inputs: [
      {
        id: 'pao2',
        label: 'PaO2 (from ABG)',
        type: 'number',
        unit: 'mmHg',
        min: 20,
        max: 700,
        defaultValue: 80,
        placeholder: 'e.g. 80',
      },
      {
        id: 'fio2',
        label: 'FiO2 (fraction of inspired O2)',
        type: 'number',
        unit: '',
        min: 0.21,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.4,
        placeholder: 'e.g. 0.40 (40% O2)',
      },
      {
        id: 'peep',
        label: 'PEEP (if ventilated)',
        type: 'number',
        unit: 'cmH2O',
        min: 0,
        max: 30,
        step: 1,
        defaultValue: 5,
        placeholder: 'e.g. 5',
      },
      {
        id: 'spo2',
        label: 'SpO2 (if no ABG - for SpO2/FiO2 estimate)',
        type: 'number',
        unit: '%',
        min: 70,
        max: 100,
        defaultValue: 95,
        placeholder: 'e.g. 95',
      },
    ],
    calculate(v) {
      const pao2 = Number(v.pao2),
        fio2 = Number(v.fio2),
        peep = Number(v.peep),
        spo2 = Number(v.spo2);
      const pfRatio = pao2 / fio2;
      // SpO2/FiO2 (SF ratio) as surrogate when no ABG
      const sfRatio = spo2 / fio2;
      const risk: CalculationResult['risk'] =
        pfRatio >= 300 ? 'low' : pfRatio >= 200 ? 'moderate' : pfRatio >= 100 ? 'high' : 'critical';
      let ardsClass: string, mortality: string, management: string;
      if (pfRatio >= 300) {
        ardsClass = 'No ARDS (P/F >=300)';
        mortality = 'N/A';
        management = 'Address underlying hypoxemia cause. Monitor for deterioration.';
      } else if (pfRatio >= 200) {
        ardsClass = 'Mild ARDS (P/F 200-300)';
        mortality = '27% mortality';
        management =
          'Lung-protective ventilation (TV 6 mL/kg IBW, plateau <30 cmH2O), PEEP titration to FiO2. Treat underlying cause.';
      } else if (pfRatio >= 100) {
        ardsClass = 'Moderate ARDS (P/F 100-200)';
        mortality = '32% mortality';
        management =
          'Lung-protective ventilation + PEEP optimisation + prone positioning (>=16h/day) + neuromuscular blockade. ECMO consideration if refractory.';
      } else {
        ardsClass = 'Severe ARDS (P/F <100)';
        mortality = '45% mortality';
        management =
          'MANDATORY prone positioning >=16h/day + high PEEP + NMB. ECMO referral if P/F <80 despite optimal ventilation. Inhaled pulmonary vasodilator (iNO/prostacyclin).';
      }
      const peepNote =
        peep < 5
          ? 'WARNING: Berlin definition requires PEEP >=5 cmH2O for ARDS diagnosis. Check if PEEP criteria met.'
          : '';
      // Prone positioning indication
      const proneIndicated = pfRatio < 150;
      return {
        label: 'P/F Ratio',
        value: pfRatio.toFixed(0),
        unit: 'mmHg',
        interpretation: ardsClass + '. ' + mortality + '. ' + management + ' ' + peepNote,
        risk,
        riskPercentage:
          ardsClass !== 'No ARDS (P/F >=300)' ? ardsClass + ' — ' + mortality : undefined,
        guidelineSource: 'Berlin ARDS Definition. JAMA 2012 / ARDS Network (ARDSnet) Protocol',
        scoreBreakdown: [
          { component: 'PaO2', score: pao2 + ' mmHg' },
          { component: 'FiO2', score: fio2 + ' (' + Math.round(fio2 * 100) + '%)' },
          {
            component: 'PEEP',
            score: peep + ' cmH2O' + (peep < 5 ? ' [<5 cmH2O: Berlin criteria NOT met]' : ''),
          },
          { component: 'P/F Ratio', score: pfRatio.toFixed(0) + ' mmHg' },
          {
            component: 'SpO2/FiO2 (SF ratio)',
            score: sfRatio.toFixed(0) + ' (surrogate if no ABG)',
          },
          { component: 'ARDS Classification', score: ardsClass },
          { component: 'Estimated Mortality', score: mortality },
          {
            component: 'Prone positioning',
            score: proneIndicated
              ? 'INDICATED (P/F <150 — 12-16h/day)'
              : 'Not required by guidelines',
          },
        ],
        details: [
          'P/F ratio: ' + pfRatio.toFixed(0) + ' mmHg | ' + ardsClass + ' | ' + mortality,
          management,
          peepNote,
          proneIndicated
            ? '-> PRONE POSITIONING: >=16h/day reduces mortality in moderate-severe ARDS (PROSEVA trial, mortality -16%)'
            : '',
          '-> ARDSnet lung-protective ventilation: TV 6 mL/kg IBW; plateau pressure <30 cmH2O; permissive hypercapnia',
          '-> PEEP/FiO2 table: titrate PEEP to maintain SpO2 88-95% while minimising FiO2',
          '-> Neuromuscular blockade (cisatracurium): moderate-severe ARDS; improves oxygenation, reduces VILI',
          pfRatio < 80
            ? '-> ECMO referral: refractory ARDS (P/F <80 on optimal settings) - specialist centre consultation'
            : '',
          '-> Avoid: excessive tidal volumes, high driving pressures (plateau-PEEP >15 cmH2O), fluid overload',
        ].filter(Boolean),
      };
    },
  },
  // 4. Peak Flow % Predicted (Asthma Zone System)
  {
    id: 'peak-flow-calculator',
    name: 'Peak Expiratory Flow (PEF) % Predicted',
    category: 'Pulmonology',
    icon: '💨',
    description:
      'Calculate PEF % predicted and classify asthma control zone (Green/Yellow/Red) - guides step-up therapy',
    formula: 'PEF % predicted = (Measured PEF / Predicted PEF) x 100 | Or: PEF % personal best',
    reference: 'GINA 2023 Global Initiative for Asthma / NAEPP Expert Panel Report 3 (EPR-3)',
    inputs: [
      {
        id: 'measured_pef',
        label: 'Measured PEF',
        type: 'number',
        unit: 'L/min',
        min: 50,
        max: 900,
        step: 5,
        defaultValue: 320,
        placeholder: 'e.g. 320',
      },
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 5, max: 90, defaultValue: 35 },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        unit: 'cm',
        min: 100,
        max: 220,
        defaultValue: 170,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        defaultValue: 'male',
      },
      {
        id: 'personal_best',
        label: 'Personal Best PEF (0 = use predicted)',
        type: 'number',
        unit: 'L/min',
        min: 0,
        max: 900,
        step: 5,
        defaultValue: 0,
        placeholder: 'e.g. 450 or 0 to use predicted',
      },
    ],
    calculate(v) {
      const meas = Number(v.measured_pef),
        age = Number(v.age),
        ht = Number(v.height);
      const pb = Number(v.personal_best);
      // Predicted PEF (Nunn & Gregg 1989 approximation)
      let predPEF: number;
      if (v.sex === 'male') {
        predPEF = Math.round(((ht - 100) * 5.5 + age * 0.5) * 0.85 + 490);
      } else {
        predPEF = Math.round(((ht - 100) * 4.5 + age * 0.3) * 0.8 + 390);
      }
      const refPEF = pb > 0 ? pb : predPEF;
      const pctRef = Math.round((meas / refPEF) * 100);
      const risk: CalculationResult['risk'] =
        pctRef >= 80 ? 'low' : pctRef >= 50 ? 'moderate' : 'critical';
      const zone =
        pctRef >= 80
          ? 'GREEN zone (>=80%) - Well controlled'
          : pctRef >= 50
            ? 'YELLOW zone (50-79%) - Caution / Uncontrolled'
            : 'RED zone (<50%) - MEDICAL ALERT';
      const action =
        pctRef >= 80
          ? 'Continue maintenance therapy. Peak flow diary optional.'
          : pctRef >= 50
            ? 'Use SABA (salbutamol 2-4 puffs q20min x3 doses). Consider systemic corticosteroids if no improvement. Contact GP/clinic today.'
            : 'EMERGENCY: use SABA immediately; call emergency services if no rapid improvement; systemic steroids; consider hospital admission';
      return {
        label: 'PEF % ' + (pb > 0 ? 'Personal Best' : 'Predicted'),
        value: pctRef,
        unit: '%',
        interpretation:
          zone +
          '. Measured: ' +
          meas +
          ' L/min vs ' +
          (pb > 0 ? 'personal best: ' + pb : 'predicted: ' + predPEF) +
          ' L/min. Action: ' +
          action,
        risk,
        riskPercentage: zone.split(' - ')[0],
        guidelineSource: 'GINA 2023 / NAEPP Expert Panel Report 3 (EPR-3)',
        scoreBreakdown: [
          { component: 'Measured PEF', score: meas + ' L/min' },
          {
            component: 'Reference PEF',
            score: refPEF + ' L/min (' + (pb > 0 ? 'personal best' : 'predicted') + ')',
          },
          { component: 'PEF % Reference', score: pctRef + '%' },
          { component: 'Asthma Zone', score: zone.split('(')[0].trim() },
          { component: 'Action Required', score: action.split('.')[0] },
          {
            component: 'SABA indicated',
            score: pctRef < 80 ? 'YES - use SABA now' : 'No (in green zone)',
          },
        ],
        details: [
          'PEF: ' +
            meas +
            ' L/min | ' +
            pctRef +
            '% of ' +
            (pb > 0 ? 'personal best (' + pb + ')' : 'predicted (' + predPEF + ')'),
          'Zone: ' + zone,
          'Action: ' + action,
          '-> Personal best PEF (when well-controlled) is more meaningful than predicted PEF',
          '-> Diurnal variation >20% is diagnostic of asthma (morning PEF < evening PEF)',
          '-> PEF twice daily x2 weeks: helps diagnose occupational asthma (improvement on holidays)',
          '-> GINA preferred outcomes: symptom control, no exacerbations, minimal SABA use, normal PEF',
          '-> Step-up therapy if PEF consistently <80% despite good technique and adherence',
        ],
      };
    },
  },
  // 5. Pack-Year Calculator + Lung Cancer Screening
  {
    id: 'pack-year-calculator',
    name: 'Pack-Year Calculator + Lung Cancer Screening',
    category: 'Pulmonology',
    icon: '🚬',
    description:
      'Calculate cumulative smoking exposure in pack-years and assess USPSTF lung cancer LDCT screening eligibility',
    formula:
      'Pack-years = (Packs per day) x (Years smoked) | USPSTF 2021: age 50-80 + >=20 pack-years + current/former smoker (quit within 15 years)',
    reference:
      'USPSTF 2021 Lung Cancer Screening Recommendation / ACS Lung Cancer Screening Guidelines 2023',
    inputs: [
      {
        id: 'cigs_per_day',
        label: 'Cigarettes Smoked Per Day (on average)',
        type: 'number',
        unit: 'cigarettes/day',
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 20,
        placeholder: 'e.g. 20 (1 pack/day)',
      },
      {
        id: 'years_smoked',
        label: 'Total Years of Smoking',
        type: 'number',
        unit: 'years',
        min: 1,
        max: 70,
        step: 1,
        defaultValue: 25,
        placeholder: 'e.g. 25',
      },
      {
        id: 'age',
        label: 'Current Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 90,
        defaultValue: 60,
      },
      {
        id: 'smoking_status',
        label: 'Current Smoking Status',
        type: 'select',
        options: [
          { label: 'Current smoker', value: 'current' },
          { label: 'Former smoker - quit within 15 years', value: 'former_15' },
          { label: 'Former smoker - quit >15 years ago', value: 'former_old' },
        ],
        defaultValue: 'current',
      },
    ],
    calculate(v) {
      const cigsPerDay = Number(v.cigs_per_day),
        years = Number(v.years_smoked),
        age = Number(v.age);
      const status = String(v.smoking_status);
      const packsPerDay = cigsPerDay / 20;
      const packYears = packsPerDay * years;
      // USPSTF 2021 screening criteria
      const uspstfAge = age >= 50 && age <= 80;
      const uspstfPY = packYears >= 20;
      const uspstfStatus = status === 'current' || status === 'former_15';
      const screeningEligible = uspstfAge && uspstfPY && uspstfStatus;
      const risk: CalculationResult['risk'] =
        packYears >= 40
          ? 'critical'
          : packYears >= 20
            ? 'high'
            : packYears >= 10
              ? 'moderate'
              : 'low';
      const lcRisk =
        packYears < 10
          ? 'Low lung cancer risk'
          : packYears < 20
            ? 'Moderate risk (relative risk ~3x vs never-smoker)'
            : packYears < 40
              ? 'High risk (relative risk ~10x vs never-smoker)'
              : 'Very high risk (relative risk ~15-25x vs never-smoker)';
      const copdRisk =
        packYears >= 10 ? 'Significant COPD risk - spirometry recommended if symptomatic' : '';
      const screening = screeningEligible
        ? 'ELIGIBLE for annual low-dose CT (LDCT) screening per USPSTF 2021. Continue annual screening until age 80 or if quit >15 years ago.'
        : 'Not currently eligible for USPSTF screening (requires: age 50-80 + >=20 pack-years + current/former smoker quit <15 years). Individual assessment recommended.';
      return {
        label: 'Pack-Years',
        value: packYears.toFixed(1),
        unit: 'pack-years',
        interpretation:
          packYears.toFixed(1) +
          ' pack-years (' +
          cigsPerDay +
          ' cigs/day x ' +
          years +
          ' years). ' +
          lcRisk +
          '. ' +
          screening,
        risk,
        riskPercentage: lcRisk,
        guidelineSource: 'USPSTF 2021 Lung Cancer Screening Recommendation',
        scoreBreakdown: [
          {
            component: 'Cigarettes per day',
            score: cigsPerDay + ' cigs/day (' + packsPerDay.toFixed(1) + ' packs/day)',
          },
          { component: 'Years smoked', score: years + ' years' },
          { component: 'Pack-Years', score: packYears.toFixed(1) },
          {
            component: 'Age',
            score: age + ' years (' + (uspstfAge ? 'within' : 'outside') + ' 50-80 range)',
          },
          {
            component: 'Pack-years threshold',
            score: packYears >= 20 ? '>=20 pack-years MET' : '<20 pack-years - NOT met',
          },
          { component: 'Smoking status', score: status.replace('_', ' ') },
          {
            component: 'USPSTF LDCT Eligibility',
            score: screeningEligible
              ? 'ELIGIBLE - annual LDCT recommended'
              : 'NOT currently eligible',
          },
        ],
        details: [
          'Pack-years: ' + packYears.toFixed(1) + ' | Lung cancer risk: ' + lcRisk,
          screening,
          screeningEligible
            ? '-> Annual LDCT (low-dose CT chest): reduces lung cancer mortality by 20% (NLST) to 26% (NELSON trial)'
            : '',
          copdRisk,
          '-> Cessation counseling: NRT (nicotine patch + gum combination most effective), varenicline, bupropion',
          '-> Even after quitting: pack-year history remains relevant for lung cancer risk (declines but not zero)',
          '-> Pack-years also predict COPD severity, cardiovascular disease, and laryngeal/oral/esophageal cancer risk',
          status === 'current'
            ? '-> SMOKING CESSATION: varenicline 1mg BID (most effective) OR combination NRT; cessation reduces lung cancer mortality substantially'
            : '',
        ].filter(Boolean),
      };
    },
  },
  // 6. PSI/PORT Pneumonia Severity Score
  {
    id: 'psi-port-pneumonia-score',
    name: 'PSI/PORT Pneumonia Severity Index',
    category: 'Pulmonology',
    icon: '🫁',
    description:
      'Predict 30-day mortality in community-acquired pneumonia and determine site of care (PSI/PORT risk classes I-V)',
    formula:
      'Points from age, nursing home, comorbidities, physical exam findings, labs, and X-ray - risk stratified into classes I-V',
    reference: 'Fine MJ et al. NEJM 1997 (PSI/PORT) / IDSA/ATS CAP Guidelines 2019',
    inputs: [
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 120,
        defaultValue: 65,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female (-10 pts)', value: 'female' },
        ],
        defaultValue: 'male',
      },
      {
        id: 'nursing_home',
        label: 'Nursing Home Resident (+10 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 10 },
        ],
        defaultValue: 0,
      },
      {
        id: 'neoplasm',
        label: 'Active Neoplasm (+30 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 30 },
        ],
        defaultValue: 0,
      },
      {
        id: 'liver',
        label: 'Liver Disease (+20 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 20 },
        ],
        defaultValue: 0,
      },
      {
        id: 'chf',
        label: 'Congestive Heart Failure (+10 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 10 },
        ],
        defaultValue: 0,
      },
      {
        id: 'cvd',
        label: 'Cerebrovascular Disease (+10 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 10 },
        ],
        defaultValue: 0,
      },
      {
        id: 'renal',
        label: 'Renal Disease (+10 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 10 },
        ],
        defaultValue: 0,
      },
      {
        id: 'altered',
        label: 'Altered Mental Status (+20 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 20 },
        ],
        defaultValue: 0,
      },
      {
        id: 'rr30',
        label: 'Respiratory Rate >=30/min (+20 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 20 },
        ],
        defaultValue: 0,
      },
      {
        id: 'sbp90',
        label: 'Systolic BP <90 mmHg (+20 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 20 },
        ],
        defaultValue: 0,
      },
      {
        id: 'temp',
        label: 'Temperature <35°C or >=40°C (+15 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 15 },
        ],
        defaultValue: 0,
      },
      {
        id: 'hr125',
        label: 'Heart Rate >=125 bpm (+10 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 10 },
        ],
        defaultValue: 0,
      },
      {
        id: 'ph735',
        label: 'Arterial pH <7.35 (+30 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 30 },
        ],
        defaultValue: 0,
      },
      {
        id: 'bun30',
        label: 'BUN >=30 mg/dL (+20 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 20 },
        ],
        defaultValue: 0,
      },
      {
        id: 'na130',
        label: 'Sodium <130 mEq/L (+20 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 20 },
        ],
        defaultValue: 0,
      },
      {
        id: 'glucose250',
        label: 'Glucose >=250 mg/dL (+10 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 10 },
        ],
        defaultValue: 0,
      },
      {
        id: 'hct30',
        label: 'Hematocrit <30% (+10 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 10 },
        ],
        defaultValue: 0,
      },
      {
        id: 'pao260',
        label: 'PaO2 <60 mmHg or SpO2 <90% (+10 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 10 },
        ],
        defaultValue: 0,
      },
      {
        id: 'effusion',
        label: 'Pleural effusion on CXR (+10 pts)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 10 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const age = Number(v.age);
      const sexAdj = v.sex === 'female' ? -10 : 0;
      const comorbidities =
        Number(v.nursing_home) +
        Number(v.neoplasm) +
        Number(v.liver) +
        Number(v.chf) +
        Number(v.cvd) +
        Number(v.renal);
      const examFindings =
        Number(v.altered) + Number(v.rr30) + Number(v.sbp90) + Number(v.temp) + Number(v.hr125);
      const labsXray =
        Number(v.ph735) +
        Number(v.bun30) +
        Number(v.na130) +
        Number(v.glucose250) +
        Number(v.hct30) +
        Number(v.pao260) +
        Number(v.effusion);
      const totalScore = age + sexAdj + comorbidities + examFindings + labsXray;
      let riskClass: string, mortality: string, siteOfCare: string;
      if (totalScore <= 50) {
        riskClass = 'Class I-II (<=50)';
        mortality = '0.1-0.6%';
        siteOfCare = 'Outpatient treatment';
      } else if (totalScore <= 70) {
        riskClass = 'Class II-III (51-70)';
        mortality = '0.9-2.8%';
        siteOfCare = 'Outpatient or brief inpatient (<24h)';
      } else if (totalScore <= 90) {
        riskClass = 'Class III-IV (71-90)';
        mortality = '8.2-9.3%';
        siteOfCare = 'Inpatient, general ward';
      } else if (totalScore <= 130) {
        riskClass = 'Class IV (91-130)';
        mortality = '9.3-27%';
        siteOfCare = 'Inpatient, general ward - consider step-down';
      } else {
        riskClass = 'Class V (>130)';
        mortality = '27-31%';
        siteOfCare = 'ICU admission strongly recommended';
      }
      const risk: CalculationResult['risk'] =
        totalScore <= 70
          ? 'low'
          : totalScore <= 90
            ? 'moderate'
            : totalScore <= 130
              ? 'high'
              : 'critical';
      return {
        label: 'PSI Score',
        value: totalScore,
        unit: 'pts',
        interpretation:
          riskClass +
          '. 30-day mortality: ~' +
          mortality +
          '. Recommended care: ' +
          siteOfCare +
          '.',
        risk,
        riskPercentage: '30-day mortality: ~' + mortality,
        guidelineSource: 'Fine MJ et al. NEJM 1997 / IDSA/ATS CAP Guidelines 2019',
        scoreBreakdown: [
          {
            component: 'Age',
            score: age + (v.sex === 'female' ? sexAdj : 0) + ' pts (age + sex adj)',
          },
          { component: 'Nursing home', score: Number(v.nursing_home) + ' pts' },
          { component: 'Comorbidities', score: comorbidities + ' pts' },
          { component: 'Physical exam findings', score: examFindings + ' pts' },
          { component: 'Lab / X-ray findings', score: labsXray + ' pts' },
          { component: 'TOTAL PSI score', score: totalScore + ' pts' },
          { component: 'Risk Class', score: riskClass },
          { component: '30-Day Mortality', score: mortality },
          { component: 'Site of Care', score: siteOfCare },
        ],
        details: [
          'PSI Score: ' + totalScore + ' pts | ' + riskClass + ' | Mortality: ' + mortality,
          'Recommended site of care: ' + siteOfCare,
          '-> IDSA/ATS 2019: use CURB-65 (simpler) or PSI (more discriminatory for low risk)',
          '-> PSI Class I-II: outpatient oral antibiotics - amoxicillin or doxycycline',
          '-> PSI Class III-IV: inpatient IV antibiotics - beta-lactam + macrolide or respiratory FQ',
          '-> PSI Class V / Severe CAP: ICU criteria (sepsis, hypoxia, multilobar infiltrates)',
          '-> Chest physiotherapy, supplemental O2 to SpO2 >=94%; hydration',
          '-> Reassess clinically at 48-72h - step down if clinical stability criteria met',
          '-> Pneumococcal and influenza vaccination before discharge in eligible patients',
        ],
      };
    },
  },
];

export const gastroenterologyConfigs: MedicalConfig[] = [
  // 1. MELD / MELD-Na Score
  {
    id: 'meld-score-med',
    name: 'MELD / MELD-Na Score (Liver Transplant Priority)',
    category: 'Gastroenterology',
    icon: '🫀',
    description:
      'Calculate MELD and MELD-Na scores to assess 90-day transplant waitlist mortality and organ allocation priority',
    formula:
      'MELD = 3.78*ln(Bili) + 11.2*ln(INR) + 9.57*ln(Cr) + 6.43 | MELD-Na = MELD + 1.32*(137-Na) - [0.033*MELD*(137-Na)]',
    reference: 'Kamath PS et al. Hepatology 2001 / OPTN/UNOS MELD-Na Policy 2022 / Kim WR et al.',
    inputs: [
      {
        id: 'bilirubin',
        label: 'Total Bilirubin',
        type: 'number',
        unit: 'mg/dL',
        min: 0.1,
        max: 60,
        step: 0.1,
        defaultValue: 2.0,
        placeholder: 'e.g. 2.0 (min 1.0 for calculation)',
      },
      {
        id: 'inr',
        label: 'INR',
        type: 'number',
        unit: '',
        min: 0.5,
        max: 15,
        step: 0.01,
        defaultValue: 1.5,
        placeholder: 'e.g. 1.5 (min 1.0)',
      },
      {
        id: 'creatinine',
        label: 'Serum Creatinine',
        type: 'number',
        unit: 'mg/dL',
        min: 0.1,
        max: 15,
        step: 0.1,
        defaultValue: 1.2,
        placeholder: 'e.g. 1.2 (max 4.0 for MELD; min 1.0)',
      },
      {
        id: 'sodium',
        label: 'Serum Sodium (for MELD-Na)',
        type: 'number',
        unit: 'mEq/L',
        min: 100,
        max: 150,
        defaultValue: 135,
        placeholder: 'e.g. 135',
      },
      {
        id: 'dialysis',
        label: 'On dialysis or CVVH in past week',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes (Cr set to 4.0)', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const rawBili = Number(v.bilirubin),
        rawINR = Number(v.inr),
        rawCr = Number(v.creatinine),
        na = Number(v.sodium);
      const onDialysis = Number(v.dialysis) === 1;
      // UNOS rounding rules: min 1.0 for each; Cr capped at 4.0; dialysis sets Cr to 4.0
      const bili = Math.max(1.0, rawBili);
      const inr = Math.max(1.0, rawINR);
      const cr = onDialysis ? 4.0 : Math.max(1.0, Math.min(4.0, rawCr));
      const meld = Math.round(
        3.78 * Math.log(bili) + 11.2 * Math.log(inr) + 9.57 * Math.log(cr) + 6.43
      );
      // MELD-Na (used for UNOS allocation since 2016)
      const naCapped = Math.max(125, Math.min(137, na));
      const meldNa = Math.round(meld + 1.32 * (137 - naCapped) - 0.033 * meld * (137 - naCapped));
      const meldNaFinal = Math.max(meld, Math.min(40, meldNa));
      // 90-day mortality estimates
      const mortality90d =
        meld < 9
          ? '~2%'
          : meld < 19
            ? '~6-10%'
            : meld < 24
              ? '~19-20%'
              : meld < 29
                ? '~52%'
                : meld < 39
                  ? '~70%'
                  : '~90%';
      const risk: CalculationResult['risk'] =
        meld < 15 ? 'moderate' : meld < 25 ? 'high' : 'critical';
      const listing =
        meld >= 15
          ? 'Transplant listing threshold met at most centers (MELD >=15)'
          : 'MELD <15: benefit from transplant may not outweigh waitlist mortality — manage medically';
      const tips =
        meld > 18
          ? 'TIPS relatively contraindicated (MELD >18 associated with high post-TIPS mortality)'
          : '';
      return {
        label: 'MELD-Na',
        value: meldNaFinal,
        unit: '(MELD: ' + meld + ')',
        interpretation:
          'MELD: ' +
          meld +
          ' | MELD-Na: ' +
          meldNaFinal +
          '. 90-day waitlist mortality: ' +
          mortality90d +
          '. ' +
          listing +
          '. ' +
          (tips || 'TIPS not contraindicated by MELD.'),
        risk,
        riskPercentage: '90-day mortality: ' + mortality90d,
        guidelineSource: 'OPTN/UNOS MELD-Na Allocation Policy 2022 / Kamath PS 2001',
        scoreBreakdown: [
          { component: 'Bilirubin (min 1.0)', score: bili.toFixed(1) + ' mg/dL' },
          { component: 'INR (min 1.0)', score: inr.toFixed(2) },
          {
            component: 'Creatinine (min 1.0, max 4.0)',
            score: cr.toFixed(1) + ' mg/dL' + (onDialysis ? ' [dialysis: set to 4.0]' : ''),
          },
          { component: 'Sodium', score: na + ' mEq/L (capped 125-137 for MELD-Na)' },
          { component: 'MELD Score', score: meld },
          { component: 'MELD-Na Score', score: meldNaFinal },
          { component: '90-Day Mortality Estimate', score: mortality90d },
          { component: 'Transplant Priority', score: listing.split('(')[0].trim() },
        ],
        details: [
          'MELD: ' + meld + ' | MELD-Na: ' + meldNaFinal + ' | 90-day mortality: ' + mortality90d,
          listing,
          tips,
          '-> MELD-Na is used for UNOS/OPTN organ allocation since 2016 (incorporates hyponatremia)',
          '-> All lab values must be from the SAME DAY - do not mix dates',
          '-> Hyponatremia (Na <130) significantly worsens prognosis beyond MELD alone',
          '-> Ascites management: diuretics (furosemide + spironolactone); Na restriction <2g/day',
          '-> SBP prophylaxis: norfloxacin if MELD >=15, prior SBP, or low protein ascites (<1.5g/dL)',
          '-> HCC surveillance: abdominal ultrasound + AFP every 6 months in all cirrhosis patients',
        ].filter(Boolean),
      };
    },
  },
  // 2. Child-Pugh Score
  {
    id: 'child-pugh-med',
    name: 'Child-Pugh Score (Cirrhosis Severity)',
    category: 'Gastroenterology',
    icon: '🫀',
    description:
      'Assess cirrhosis severity and predict 1-2 year survival - guides procedural risk and transplant candidacy',
    formula:
      'Score = Bilirubin + Albumin + PT/INR + Ascites + Encephalopathy (each 1-3 pts) = 5-15',
    reference: 'Child CG, Turcotte JG 1964 / Pugh RN et al. Br J Surg 1973',
    inputs: [
      {
        id: 'bili',
        label: 'Total Bilirubin',
        type: 'select',
        options: [
          { label: '<2 mg/dL (1 pt)', value: 1 },
          { label: '2-3 mg/dL (2 pts)', value: 2 },
          { label: '>3 mg/dL (3 pts)', value: 3 },
        ],
        defaultValue: 1,
      },
      {
        id: 'albumin',
        label: 'Serum Albumin',
        type: 'select',
        options: [
          { label: '>3.5 g/dL (1 pt)', value: 1 },
          { label: '2.8-3.5 g/dL (2 pts)', value: 2 },
          { label: '<2.8 g/dL (3 pts)', value: 3 },
        ],
        defaultValue: 1,
      },
      {
        id: 'pt',
        label: 'Prothrombin Time (seconds prolonged)',
        type: 'select',
        options: [
          { label: '<4 seconds prolonged (1 pt)', value: 1 },
          { label: '4-6 seconds prolonged (2 pts)', value: 2 },
          { label: '>6 seconds prolonged / INR >2.3 (3 pts)', value: 3 },
        ],
        defaultValue: 1,
      },
      {
        id: 'ascites',
        label: 'Ascites',
        type: 'select',
        options: [
          { label: 'None (1 pt)', value: 1 },
          { label: 'Mild/controlled with diuretics (2 pts)', value: 2 },
          { label: 'Moderate/tense/refractory (3 pts)', value: 3 },
        ],
        defaultValue: 1,
      },
      {
        id: 'enceph',
        label: 'Hepatic Encephalopathy',
        type: 'select',
        options: [
          { label: 'None (Grade 0) - 1 pt', value: 1 },
          { label: 'Grade I-II (mild confusion, asterixis) - 2 pts', value: 2 },
          { label: 'Grade III-IV (stupor, coma) - 3 pts', value: 3 },
        ],
        defaultValue: 1,
      },
    ],
    calculate(v) {
      const bili = Number(v.bili),
        alb = Number(v.albumin),
        pt = Number(v.pt);
      const asc = Number(v.ascites),
        enc = Number(v.enceph);
      const score = bili + alb + pt + asc + enc;
      const cls = score <= 6 ? 'A' : score <= 9 ? 'B' : 'C';
      const survival1yr = cls === 'A' ? '100%' : cls === 'B' ? '81%' : '45%';
      const survival2yr = cls === 'A' ? '85%' : cls === 'B' ? '57%' : '35%';
      const surgRisk =
        cls === 'A'
          ? 'Low surgical risk (~10% mortality)'
          : cls === 'B'
            ? 'Moderate surgical risk (~30% mortality)'
            : 'High surgical risk (>80% mortality) - avoid elective surgery';
      const risk: CalculationResult['risk'] =
        cls === 'A' ? 'low' : cls === 'B' ? 'moderate' : 'high';
      return {
        label: 'Child-Pugh Class',
        value: 'Class ' + cls,
        interpretation:
          'Child-Pugh Score: ' +
          score +
          '/15 - Class ' +
          cls +
          '. 1-year survival: ' +
          survival1yr +
          ' | 2-year: ' +
          survival2yr +
          '. Surgical risk: ' +
          surgRisk +
          '.',
        risk,
        riskPercentage: '1-year survival: ' + survival1yr + ' | 2-year: ' + survival2yr,
        guidelineSource: 'Pugh RN et al. Br J Surg 1973 / AASLD Cirrhosis Guidelines',
        scoreBreakdown: [
          { component: 'Bilirubin', score: bili, max: 3 },
          { component: 'Albumin', score: alb, max: 3 },
          { component: 'PT (prolongation)', score: pt, max: 3 },
          { component: 'Ascites', score: asc, max: 3 },
          { component: 'Encephalopathy', score: enc, max: 3 },
          { component: 'TOTAL', score, max: 15 },
          { component: 'Class', score: 'Class ' + cls + ' (A: 5-6, B: 7-9, C: 10-15)' },
          { component: '1-Year Survival', score: survival1yr },
          { component: '2-Year Survival', score: survival2yr },
        ],
        details: [
          'Child-Pugh Class ' +
            cls +
            ' (score ' +
            score +
            '/15) | 1-yr: ' +
            survival1yr +
            ' | 2-yr: ' +
            survival2yr,
          'Surgical risk: ' + surgRisk,
          '-> Class A: well-compensated - manage as outpatient; annual EGD for varices',
          '-> Class B: significant dysfunction - close monitoring; consider TIPS evaluation; transplant workup',
          '-> Class C: decompensated - MELD score for transplant priority; highest complications risk',
          '-> Variceal screening: EGD at cirrhosis diagnosis; interval by class and findings',
          '-> Carvedilol or nadolol for primary prophylaxis of variceal bleeding (medium/large varices)',
          '-> HCC surveillance: US +/- AFP every 6 months in all Child-Pugh patients',
          '-> Ascites grading (objective): abdominal US at each decompensation - guides LVP threshold',
        ],
      };
    },
  },
  // 3. SAAG Calculator
  {
    id: 'saag-calculator',
    name: 'SAAG (Serum-Ascites Albumin Gradient)',
    category: 'Gastroenterology',
    icon: '🔬',
    description:
      'Differentiate portal hypertension-related ascites from non-portal causes using simultaneous serum and ascitic albumin',
    formula: 'SAAG = Serum Albumin - Ascites Albumin | SAAG >=1.1 g/dL = portal hypertension',
    reference: 'Runyon BA et al. Ann Intern Med 1992 / AASLD Ascites Practice Guidelines 2012',
    inputs: [
      {
        id: 'serum_alb',
        label: 'Serum Albumin (day of paracentesis)',
        type: 'number',
        unit: 'g/dL',
        min: 0.5,
        max: 6,
        step: 0.1,
        defaultValue: 3.2,
      },
      {
        id: 'ascites_alb',
        label: 'Ascitic Fluid Albumin (from paracentesis)',
        type: 'number',
        unit: 'g/dL',
        min: 0,
        max: 4,
        step: 0.1,
        defaultValue: 0.8,
      },
      {
        id: 'ascites_protein',
        label: 'Ascitic Total Protein',
        type: 'number',
        unit: 'g/dL',
        min: 0,
        max: 6,
        step: 0.1,
        defaultValue: 1.5,
      },
    ],
    calculate(v) {
      const serAlb = Number(v.serum_alb),
        ascAlb = Number(v.ascites_alb),
        ascProt = Number(v.ascites_protein);
      const saag = serAlb - ascAlb;
      const portalHTN = saag >= 1.1;
      const risk: CalculationResult['risk'] = portalHTN ? 'moderate' : 'high';
      const cause = portalHTN
        ? 'SAAG >=1.1: Portal hypertension (cirrhosis, heart failure, Budd-Chiari, portal vein thrombosis)'
        : 'SAAG <1.1: Non-portal cause (peritoneal carcinomatosis, TB peritonitis, nephrotic syndrome, pancreatitis)';
      const tbRisk =
        !portalHTN && ascProt > 2.5
          ? 'Ascitic protein >2.5g/dL: tuberculosis peritonitis should be considered (send ADA, culture, AFB smear)'
          : '';
      const sbpRisk =
        portalHTN && ascProt < 1.5
          ? 'Ascitic protein <1.5g/dL: HIGH risk for spontaneous bacterial peritonitis (SBP) - consider prophylactic antibiotics'
          : 'Consider SBP prophylaxis if additional risk factors (prior SBP, advanced cirrhosis, GI bleed)';
      return {
        label: 'SAAG',
        value: saag.toFixed(2),
        unit: 'g/dL',
        interpretation: cause + '. ' + sbpRisk + '. ' + tbRisk,
        risk,
        riskPercentage: portalHTN
          ? 'Portal hypertension ascites (SAAG >=1.1)'
          : 'Non-portal ascites (SAAG <1.1)',
        guidelineSource: 'Runyon BA et al. Ann Intern Med 1992 / AASLD Ascites Guidelines 2012',
        scoreBreakdown: [
          { component: 'Serum Albumin', score: serAlb.toFixed(1) + ' g/dL' },
          { component: 'Ascitic Albumin', score: ascAlb.toFixed(1) + ' g/dL' },
          { component: 'SAAG (Serum - Ascites)', score: saag.toFixed(2) + ' g/dL' },
          {
            component: 'SAAG Interpretation',
            score: saag >= 1.1 ? '>=1.1 = Portal hypertension' : '<1.1 = Non-portal',
          },
          { component: 'Ascitic Total Protein', score: ascProt.toFixed(1) + ' g/dL' },
          {
            component: 'SBP Risk Assessment',
            score: ascProt < 1.5 ? 'HIGH (protein <1.5g/dL)' : 'Lower risk',
          },
          {
            component: 'Likely Etiology',
            score: portalHTN
              ? 'Cirrhosis / cardiac / hepatic vein'
              : cause.split('(')[1]?.replace(')', ''),
          },
        ],
        details: [
          'SAAG: ' + saag.toFixed(2) + ' g/dL | ' + cause,
          sbpRisk,
          tbRisk,
          '-> SAAG must use SIMULTANEOUS serum and ascitic albumin from the same day',
          '-> Portal HTN causes (SAAG >=1.1): cirrhosis (80%), heart failure, Budd-Chiari, portal vein thrombosis',
          '-> Non-portal causes (SAAG <1.1): malignancy, TB, pancreatitis, nephrotic syndrome',
          '-> SBP diagnosis: ascitic PMN >=250/mm3 (or >=500 cells with >50% PMN)',
          '-> SBP treatment: cefotaxime 2g q8h or ceftriaxone 2g/day x5 days + albumin 1.5g/kg day 1, 1g/kg day 3',
          '-> Secondary prophylaxis post-SBP: norfloxacin 400mg/day indefinitely',
        ].filter(Boolean),
      };
    },
  },
  // 4. Ranson Criteria (Acute Pancreatitis)
  {
    id: 'ransons-criteria-pancreatitis',
    name: 'Ranson Criteria (Acute Pancreatitis Severity)',
    category: 'Gastroenterology',
    icon: '⚕️',
    description:
      'Predict severe acute pancreatitis and mortality using Ranson criteria (5 at admission + 6 at 48 hours)',
    formula:
      'Score = Admission criteria (5) + 48-hour criteria (6) | Score >=3 = severe pancreatitis',
    reference:
      'Ranson JHC et al. Surg Gynecol Obstet 1974 / ACG Acute Pancreatitis Guidelines 2013',
    inputs: [
      // Admission criteria
      {
        id: 'age55',
        label: '[Admission] Age >55 years',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'wbc16',
        label: '[Admission] WBC >16,000/mm3',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'gluc200',
        label: '[Admission] Glucose >200 mg/dL',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'ldh350',
        label: '[Admission] LDH >350 IU/L',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'ast250',
        label: '[Admission] AST >250 IU/L',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      // 48-hour criteria
      {
        id: 'hct10',
        label: '[48h] Hematocrit drop >10%',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'bun5',
        label: '[48h] BUN increase >5 mg/dL',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'ca8',
        label: '[48h] Calcium <8 mg/dL',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'pao260',
        label: '[48h] PaO2 <60 mmHg',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'bd4',
        label: '[48h] Base deficit >4 mEq/L',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'fluid6',
        label: '[48h] Fluid sequestration >6L',
        type: 'select',
        options: [
          { label: 'No (0)', value: 0 },
          { label: 'Yes (1 pt)', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const admissionKeys = ['age55', 'wbc16', 'gluc200', 'ldh350', 'ast250'];
      const fortyEightHKeys = ['hct10', 'bun5', 'ca8', 'pao260', 'bd4', 'fluid6'];
      const admScore = admissionKeys.reduce((s, k) => s + Number(v[k]), 0);
      const h48Score = fortyEightHKeys.reduce((s, k) => s + Number(v[k]), 0);
      const total = admScore + h48Score;
      const h48Complete = fortyEightHKeys.some((k) => Number(v[k]) > 0);
      const risk: CalculationResult['risk'] = total < 3 ? 'low' : total < 5 ? 'high' : 'critical';
      const severity =
        total < 3
          ? 'Mild acute pancreatitis (likely)'
          : total < 5
            ? 'Severe acute pancreatitis - ICU care indicated'
            : 'Very severe - mortality >40%';
      const MORTALITY: { [k: number]: string } = {
        0: '<1%',
        1: '<1%',
        2: '<1%',
        3: '15%',
        4: '15%',
        5: '40%',
        6: '40%',
        7: '>40%',
        8: '>40%',
        9: '>40%',
        10: '>40%',
        11: '>40%',
      };
      const mortality = MORTALITY[Math.min(total, 11)] || '>40%';
      const management =
        total < 3
          ? 'IV fluids, NPO or early oral feeding if tolerated, analgesia, monitor closely'
          : total < 5
            ? 'ICU admission, aggressive IV fluid resuscitation (LR preferred), analgesia, nutrition support (enteral preferred over TPN)'
            : 'ICU admission, high-volume IV fluids, early enteral nutrition via NJ tube, analgesia, antibiotics only if infected necrosis confirmed';
      return {
        label: 'Ranson Score',
        value: total,
        unit: '/11',
        interpretation:
          severity +
          '. Predicted mortality: ~' +
          mortality +
          '. Management: ' +
          management +
          '. ' +
          (!h48Complete
            ? 'NOTE: 48-hour criteria not yet completed - full score available at 48 hours only.'
            : ''),
        risk,
        riskPercentage: 'Predicted mortality: ~' + mortality,
        guidelineSource: 'Ranson JHC et al. 1974 / ACG Acute Pancreatitis Guidelines 2013',
        scoreBreakdown: [
          { component: '--- ADMISSION CRITERIA ---', score: '' },
          { component: 'Age >55', score: Number(v.age55), max: 1 },
          { component: 'WBC >16,000', score: Number(v.wbc16), max: 1 },
          { component: 'Glucose >200 mg/dL', score: Number(v.gluc200), max: 1 },
          { component: 'LDH >350 IU/L', score: Number(v.ldh350), max: 1 },
          { component: 'AST >250 IU/L', score: Number(v.ast250), max: 1 },
          { component: 'Admission subtotal', score: admScore + '/5' },
          { component: '--- 48-HOUR CRITERIA ---', score: '' },
          { component: 'Hematocrit drop >10%', score: Number(v.hct10), max: 1 },
          { component: 'BUN increase >5 mg/dL', score: Number(v.bun5), max: 1 },
          { component: 'Calcium <8 mg/dL', score: Number(v.ca8), max: 1 },
          { component: 'PaO2 <60 mmHg', score: Number(v.pao260), max: 1 },
          { component: 'Base deficit >4 mEq/L', score: Number(v.bd4), max: 1 },
          { component: 'Fluid sequestration >6L', score: Number(v.fluid6), max: 1 },
          { component: '48h subtotal', score: h48Score + '/6' },
          { component: 'TOTAL RANSON SCORE', score: total + '/11' },
          { component: 'Predicted Mortality', score: mortality },
        ],
        details: [
          'Ranson score: ' + total + '/11 | ' + severity + ' | Mortality: ~' + mortality,
          'Management: ' + management,
          !h48Complete
            ? 'NOTE: 48-hour criteria incomplete - reassess at 48 hours for complete score'
            : '48-hour criteria fully assessed',
          '-> BISAP score (5-item): simpler alternative validated in modern cohorts',
          '-> Fluid resuscitation: Lactated Ringer preferred over normal saline (reduces SIRS progression)',
          '-> Early enteral nutrition (within 24-48h): reduces infectious complications vs TPN',
          '-> Antibiotics: NOT indicated for sterile necrosis; only if infected necrosis confirmed (aspiration/culture)',
          '-> CT severity index (Balthazar): for confirmed necrosis assessment at 48-72h',
          total >= 3 ? '-> Early surgical/GI consultation for severe pancreatitis' : '',
        ].filter(Boolean),
      };
    },
  },
  // 5. H. pylori Eradication Tracker
  {
    id: 'h-pylori-eradication-tracker',
    name: 'H. pylori Treatment Regimen Selector',
    category: 'Gastroenterology',
    icon: '🦠',
    description:
      'Select appropriate H. pylori eradication regimen based on prior treatment history and local clarithromycin resistance patterns',
    formula:
      'ACG 2017 regimen selection: Bismuth quadruple (first-line) OR Clarithromycin triple (if low resistance) OR Concomitant/Hybrid',
    reference:
      'ACG Clinical Guideline - H. pylori Infection 2017 / Malfertheiner P (Maastricht V 2016)',
    inputs: [
      {
        id: 'prior_treatment',
        label: 'Prior H. pylori Treatment Attempts',
        type: 'select',
        options: [
          { label: 'Treatment naive (first attempt)', value: 'naive' },
          { label: 'Failed clarithromycin-based regimen', value: 'failed_clari' },
          { label: 'Failed bismuth quadruple therapy', value: 'failed_bismuth' },
          { label: 'Failed 2+ regimens (salvage)', value: 'failed_multiple' },
        ],
        defaultValue: 'naive',
      },
      {
        id: 'penicillin_allergy',
        label: 'Penicillin / Amoxicillin Allergy',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'clarithro_resistance',
        label: 'Local clarithromycin resistance rate',
        type: 'select',
        options: [
          { label: 'Low (<15%) - clarithromycin-based acceptable', value: 'low' },
          { label: 'High (>=15%) - avoid clarithromycin-based', value: 'high' },
          { label: 'Unknown', value: 'unknown' },
        ],
        defaultValue: 'unknown',
      },
    ],
    calculate(v) {
      const prior = String(v.prior_treatment),
        penAllergy = Number(v.penicillin_allergy) === 1;
      const clariRes = String(v.clarithro_resistance);
      let regimen: string, duration: string, successRate: string, notes: string;
      if (prior === 'naive' && !penAllergy && clariRes === 'low') {
        regimen =
          'Clarithromycin Triple Therapy: PPI BID + amoxicillin 1g BID + clarithromycin 500mg BID';
        duration = '14 days';
        successRate = '70-85%';
        notes =
          'Acceptable only where clarithromycin resistance <15%. Confirm 14-day course (better than 7-10 days).';
      } else if (prior === 'naive' || prior === 'failed_clari') {
        regimen =
          'Bismuth Quadruple Therapy (preferred): PPI BID + bismuth subcitrate 120mg QID + tetracycline 500mg QID + metronidazole 500mg TID';
        duration = '10-14 days';
        successRate = '85-95%';
        notes = 'First-line preferred in most regions. Avoid if tetracycline allergy.';
      } else if (prior === 'failed_bismuth') {
        regimen = 'Levofloxacin Triple: PPI BID + amoxicillin 1g BID + levofloxacin 500mg OD';
        duration = '14 days';
        successRate = '75-85%';
        notes = 'Culture and sensitivity testing recommended before levofloxacin-based therapy.';
      } else {
        regimen = 'Rifabutin Triple: PPI BID + amoxicillin 1g TID + rifabutin 150mg BID (salvage)';
        duration = '10 days';
        successRate = '60-75%';
        notes =
          'Reserve for multiple treatment failures. Susceptibility testing strongly recommended. Specialist referral advised.';
      }
      if (penAllergy) {
        regimen =
          'Penicillin ALLERGY: Bismuth Quadruple (PPI + bismuth + tetracycline + metronidazole) OR Levofloxacin + clarithromycin + PPI (without amoxicillin)';
        notes =
          'Amoxicillin-containing regimens CONTRAINDICATED. Confirm amoxicillin allergy before substituting.';
      }
      const risk: CalculationResult['risk'] =
        prior === 'naive'
          ? 'low'
          : prior === 'failed_clari' || prior === 'failed_bismuth'
            ? 'moderate'
            : 'high';
      return {
        label: 'Recommended Regimen',
        value:
          prior === 'naive'
            ? 'First-line'
            : prior === 'failed_clari'
              ? 'Second-line'
              : prior === 'failed_bismuth'
                ? 'Third-line'
                : 'Salvage',
        interpretation:
          regimen +
          '. Duration: ' +
          duration +
          '. Expected eradication rate: ' +
          successRate +
          '. ' +
          notes,
        risk,
        riskPercentage: 'Expected eradication rate: ' + successRate,
        guidelineSource: 'ACG Clinical Guideline H. pylori 2017 / Maastricht V 2016',
        scoreBreakdown: [
          { component: 'Treatment history', score: prior.replace('_', ' ') },
          { component: 'Penicillin allergy', score: penAllergy ? 'YES - avoid amoxicillin' : 'No' },
          { component: 'Local clarithromycin resistance', score: clariRes },
          {
            component: 'Recommended regimen type',
            score: prior === 'naive' ? 'First-line' : 'Second-line or beyond',
          },
          { component: 'Regimen', score: regimen.split(':')[0] },
          { component: 'Duration', score: duration },
          { component: 'Expected success rate', score: successRate },
        ],
        details: [
          'Regimen: ' + regimen,
          'Duration: ' + duration + ' | Expected success: ' + successRate,
          notes,
          '-> Confirm eradication: urea breath test or stool antigen test >=4 weeks after completing antibiotics',
          '-> Withhold PPI 2 weeks before eradication testing (false negative)',
          '-> Bismuth quadruple preferred in regions with high clarithromycin resistance (>15%)',
          '-> Take PPI 30-60 min before meals for optimal acid suppression',
          '-> Probiotics (Lactobacillus) during treatment: reduce GI side effects',
          '-> Non-compliance is the main cause of treatment failure - counsel on completing full course',
        ],
      };
    },
  },
  // 6. Bowel Prep Dosing Calculator
  {
    id: 'bowel-prep-dosing-calculator',
    name: 'Colonoscopy Bowel Prep Dosing Guide',
    category: 'Gastroenterology',
    icon: '🔍',
    description:
      'Select appropriate bowel preparation regimen based on patient factors for optimal colonoscopy quality',
    formula: 'Preparation adequacy determines adenoma detection rate and procedure safety',
    reference: 'ACG/ASGE Colonoscopy Quality Indicators 2015 / ASGE Bowel Prep Guidelines 2020',
    inputs: [
      {
        id: 'age',
        label: 'Patient Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 100,
        defaultValue: 55,
      },
      {
        id: 'prep_timing',
        label: 'Colonoscopy Scheduling',
        type: 'select',
        options: [
          { label: 'Morning procedure (8am-12pm)', value: 'morning' },
          { label: 'Afternoon procedure (12pm-4pm)', value: 'afternoon' },
        ],
        defaultValue: 'morning',
      },
      {
        id: 'comorbidities',
        label: 'Comorbidities Affecting Prep Selection',
        type: 'select',
        options: [
          { label: 'None - healthy patient', value: 'none' },
          { label: 'CKD / electrolyte abnormalities', value: 'ckd' },
          { label: 'Severe heart failure or cirrhosis', value: 'chf' },
          { label: 'Prior incomplete prep / difficult patient', value: 'difficult' },
        ],
        defaultValue: 'none',
      },
      {
        id: 'prior_incomplete',
        label: 'History of Prior Incomplete Prep',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const timing = String(v.prep_timing),
        comorbid = String(v.comorbidities);
      const difficult = Number(v.prior_incomplete) === 1;
      let regimen: string, schedule: string, adequacyTips: string;
      if (comorbid === 'ckd') {
        regimen =
          'PEG-ELS (polyethylene glycol) 4L split-dose (2L evening before + 2L day of procedure). Avoid sodium phosphate (nephrotoxic in CKD).';
        schedule =
          timing === 'morning'
            ? 'Split: 2L at 6pm day before + 2L at 4am day of'
            : 'Split: 2L at 8pm day before + 2L at 8am day of (6h before)';
      } else if (comorbid === 'chf') {
        regimen =
          'PEG-ELS 2L (low-volume) + bisacodyl 10mg. Avoid high-volume fluid regimens and sodium phosphate.';
        schedule = 'Bisacodyl 10mg at 6pm + PEG 2L from 8pm the evening before';
      } else if (difficult || comorbid === 'difficult') {
        regimen =
          '4L PEG split-dose + bisacodyl 20mg (enhanced regimen for prior failure). Consider same-day prep for afternoon procedures.';
        schedule =
          timing === 'afternoon'
            ? 'Same-day prep: 4L PEG from 5-9am day of'
            : 'Split: 2L at 6pm + bisacodyl 20mg + 2L at 5am';
        adequacyTips =
          'Dietary: clear liquid diet for full 24 hours before (not just day before). Verify patient compliance.';
      } else {
        regimen =
          timing === 'afternoon'
            ? 'Same-day split: SUPREP or MoviPrep 1L at 5am + 1L at 8am day of (preferred for afternoon)'
            : 'PEG split-dose 4L: 2L at 6pm evening before + 2L at 5am day of (minimum 4h before procedure)';
        schedule =
          timing === 'afternoon'
            ? 'SUPREP/MoviPrep 1L at 5am + 1L at 8am day of procedure'
            : '2L at 6pm + 2L at 4-5am (4-6h before procedure start)';
      }
      const dietInstructions =
        'Low-residue diet 3 days before; clear liquids day before. Stop solid foods at midnight.';
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: 'Recommended Prep',
        value:
          comorbid === 'ckd'
            ? 'PEG-ELS (renal-safe)'
            : timing === 'afternoon'
              ? 'Same-day split'
              : 'Split-dose PEG',
        interpretation:
          'Regimen: ' + regimen + '. Schedule: ' + schedule + '. Diet: ' + dietInstructions,
        risk,
        guidelineSource: 'ASGE Bowel Preparation Guidelines 2020 / ACG Quality Indicators 2015',
        scoreBreakdown: [
          {
            component: 'Procedure time',
            score: timing === 'morning' ? 'Morning (8am-12pm)' : 'Afternoon (12pm-4pm)',
          },
          { component: 'Comorbidities', score: comorbid },
          {
            component: 'Prior incomplete prep',
            score: difficult ? 'Yes - enhanced regimen' : 'No',
          },
          { component: 'Recommended regimen', score: regimen.split('(')[0].trim() },
          { component: 'Schedule', score: schedule },
          {
            component: 'Diet instructions',
            score: 'Low-residue x3 days, clear liquids day before',
          },
        ],
        details: [
          'Regimen: ' + regimen,
          'Schedule: ' + schedule,
          adequacyTips || '',
          'Diet: low-residue 3 days before; clear liquids (broth, water, juice) day before; NPO after midnight',
          '-> SPLIT-DOSE is superior to evening-only prep: better mucosal visualization, higher ADR',
          '-> Same-day prep for afternoon colonoscopies: comparable efficacy, better compliance',
          '-> Avoid PO4-based preps (Fleet Phospho-Soda) in elderly, CKD, dehydration - AKI risk',
          '-> Boston Bowel Prep Scale (BBPS) >=6 (2 per segment) = adequate prep for reliable adenoma detection',
          '-> Inadequate prep: repeat colonoscopy in 1 year (not 10 years) - check compliance barriers',
        ].filter(Boolean),
      };
    },
  },
];

export const oncologyConfigs: MedicalConfig[] = [
  // ── 1. Chemotherapy Dose (BSA) ─────────────────────────────────────────
  {
    id: 'chemotherapy-dose-bsa-med',
    name: 'Chemotherapy Dose (BSA)',
    category: 'Oncology',
    icon: '🔬',
    description:
      'Calculate BSA-based chemotherapy dose using Mosteller formula with dose capping, BSA formula selection, and cycle-by-cycle weight tracking per ASCO guidelines.',
    formula:
      'BSA (Mosteller) = sqrt(Height_cm × Weight_kg / 3600) | Dose = BSA × Protocol_Dose_per_m²; capped at Max_Dose',
    reference:
      'Mosteller RD. NEJM 1987 / ASCO Practice Guidelines 2012 / Gurney H. Lancet Oncol 2002',
    inputs: [
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        unit: 'cm',
        min: 100,
        max: 230,
        defaultValue: 170,
        placeholder: 'e.g. 170',
      },
      {
        id: 'weight',
        label: 'Actual Body Weight',
        type: 'number',
        unit: 'kg',
        min: 20,
        max: 300,
        defaultValue: 70,
        placeholder: 'e.g. 70',
      },
      {
        id: 'dose_per_m2',
        label: 'Protocol Dose',
        type: 'number',
        unit: 'mg/m²',
        min: 1,
        max: 5000,
        defaultValue: 100,
        placeholder: 'e.g. 100 (per protocol)',
      },
      {
        id: 'max_dose',
        label: 'Max Dose Cap (protocol-defined)',
        type: 'number',
        unit: 'mg',
        min: 1,
        max: 20000,
        defaultValue: 9999,
        placeholder: 'e.g. 2000 (enter 9999 if no cap)',
      },
      {
        id: 'bsa_formula',
        label: 'BSA Formula',
        type: 'select',
        options: [
          { label: 'Mosteller (recommended)', value: 'mosteller' },
          { label: 'Du Bois & Du Bois', value: 'dubois' },
          { label: 'Haycock (pediatric)', value: 'haycock' },
        ],
        defaultValue: 'mosteller',
      },
      {
        id: 'cap_at_2',
        label: 'Cap BSA at 2.0 m² (common oncology practice)',
        type: 'select',
        options: [
          { label: 'No — use calculated BSA', value: 0 },
          { label: 'Yes — cap BSA at 2.0 m²', value: 1 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const h = Number(v.height),
        w = Number(v.weight);
      const dosePerM2 = Number(v.dose_per_m2),
        maxDose = Number(v.max_dose);
      const capAt2 = Number(v.cap_at_2) === 1;
      let bsa: number;
      if (v.bsa_formula === 'dubois') {
        bsa = 0.007184 * Math.pow(h, 0.725) * Math.pow(w, 0.425);
      } else if (v.bsa_formula === 'haycock') {
        bsa = 0.024265 * Math.pow(h, 0.3964) * Math.pow(w, 0.5378);
      } else {
        bsa = Math.sqrt((h * w) / 3600);
      }
      const bsaForCalc = capAt2 ? Math.min(2.0, bsa) : bsa;
      const rawDose = bsaForCalc * dosePerM2;
      const finalDose = Math.min(rawDose, maxDose);
      const isCapped = finalDose < rawDose;
      const capReason = isCapped
        ? finalDose === maxDose
          ? 'protocol max dose cap'
          : 'BSA cap at 2.0 m²'
        : '';
      const risk: CalculationResult['risk'] = 'high';
      return {
        label: 'Chemotherapy Dose',
        value: finalDose.toFixed(1),
        unit: 'mg',
        interpretation: `BSA (${v.bsa_formula}): ${bsa.toFixed(3)} m²${capAt2 && bsa > 2 ? ' → capped at 2.0 m²' : ''}. Calculated dose: ${rawDose.toFixed(1)} mg. Final dose: ${finalDose.toFixed(1)} mg${isCapped ? ' ⚠️ DOSE CAPPED (' + capReason + ')' : ''}.`,
        risk,
        riskPercentage: `BSA: ${bsaForCalc.toFixed(2)} m² | Dose: ${finalDose.toFixed(1)} mg (${(finalDose / bsaForCalc).toFixed(1)} mg/m²)`,
        guidelineSource: 'Mosteller RD. NEJM 1987 / ASCO 2012',
        scoreBreakdown: [
          { component: 'Height', score: h + ' cm' },
          { component: 'Weight (actual)', score: w + ' kg' },
          { component: 'BSA Formula', score: String(v.bsa_formula) },
          { component: 'Calculated BSA', score: bsa.toFixed(3) + ' m²' },
          {
            component: 'BSA Used for Dosing',
            score: bsaForCalc.toFixed(3) + ' m²' + (capAt2 && bsa > 2 ? ' [capped at 2.0]' : ''),
          },
          { component: 'Protocol Dose', score: dosePerM2 + ' mg/m²' },
          { component: 'Calculated Dose (pre-cap)', score: rawDose.toFixed(1) + ' mg' },
          {
            component: 'Max Dose Cap',
            score: maxDose >= 9999 ? 'None specified' : maxDose + ' mg',
          },
          {
            component: 'Final Dose',
            score: finalDose.toFixed(1) + ' mg' + (isCapped ? ' ⚠️ CAPPED' : ''),
          },
          {
            component: 'Dose in mg/m²',
            score: (finalDose / bsaForCalc).toFixed(1) + ' mg/m² (after capping)',
          },
        ],
        details: [
          `✅ Final Dose: ${finalDose.toFixed(1)} mg | BSA: ${bsaForCalc.toFixed(2)} m²`,
          isCapped
            ? `⚠️ Dose capped — raw dose was ${rawDose.toFixed(1)} mg, limited by ${capReason}`
            : 'Dose not capped.',
          '→ ALWAYS co-verify with oncologist and oncology pharmacist before preparation',
          '→ Recalculate BSA and dose at EACH treatment cycle using current weight',
          '→ G-CSF support (filgrastim/pegfilgrastim) if febrile neutropenia risk >20%',
          '→ Pre-medications: antiemetics, hydration per protocol emetogenicity level',
          '→ Dose modifications: Grade 3–4 hematological toxicity → reduce 25%; Grade 3–4 organ toxicity → hold or reduce per protocol',
          '→ Document: BSA, formula used, any dose modifications, and rationale in chart',
        ],
      };
    },
  },

  // ── 2. ANC ─────────────────────────────────────────────────────────────
  {
    id: 'anc-absolute-neutrophil-count',
    name: 'ANC Calculator',
    category: 'Oncology',
    icon: '🩸',
    description:
      'Calculate Absolute Neutrophil Count from CBC differential. Risk-stratifies febrile neutropenia, triggers NCCN protocol checklist, and guides G-CSF and antibiotic decisions.',
    formula: 'ANC (/µL) = WBC (×10³/µL) × (% Neutrophils + % Bands) × 10',
    reference:
      'NCCN Clinical Practice Guidelines — Hematopoietic Growth Factors v2.2023 / ASCO Febrile Neutropenia Guidelines 2018',
    inputs: [
      {
        id: 'wbc',
        label: 'WBC Count',
        type: 'number',
        unit: '×10³/µL',
        min: 0.1,
        max: 150,
        step: 0.1,
        defaultValue: 4.5,
        placeholder: 'e.g. 4.5',
      },
      {
        id: 'neutrophils',
        label: 'Segmented Neutrophils (%)',
        type: 'number',
        unit: '%',
        min: 0,
        max: 100,
        defaultValue: 55,
        placeholder: 'e.g. 55',
      },
      {
        id: 'bands',
        label: 'Band Neutrophils (%)',
        type: 'number',
        unit: '%',
        min: 0,
        max: 50,
        defaultValue: 3,
        placeholder: 'e.g. 3 (enter 0 if not reported)',
      },
      {
        id: 'context',
        label: 'Clinical Context',
        type: 'select',
        options: [
          { label: 'Post-chemotherapy monitoring', value: 'chemo' },
          { label: 'Febrile illness evaluation', value: 'fever' },
          { label: 'Routine CBC monitoring', value: 'routine' },
          { label: 'Pre-treatment assessment', value: 'pre' },
        ],
        defaultValue: 'chemo',
      },
      {
        id: 'temperature',
        label: 'Current Temperature (if febrile)',
        type: 'number',
        unit: '°C',
        min: 35,
        max: 42,
        step: 0.1,
        defaultValue: 37.0,
        placeholder: 'e.g. 38.5 (37.0 if afebrile)',
      },
    ],
    calculate(v) {
      const wbc = Number(v.wbc),
        neut = Number(v.neutrophils),
        bands = Number(v.bands);
      const temp = Number(v.temperature);
      const anc = wbc * (neut + bands) * 10;
      const ancRounded = Math.round(anc);
      const isFeverile = temp >= 38.3 || temp >= 38.0;
      const febrileNeutropenia = anc < 500 && isFeverile;
      const risk: CalculationResult['risk'] =
        anc >= 1500 ? 'low' : anc >= 1000 ? 'moderate' : anc >= 500 ? 'high' : 'critical';
      const category =
        anc >= 2000
          ? 'Normal'
          : anc >= 1500
            ? 'Normal — lower limit'
            : anc >= 1000
              ? 'Mild neutropenia'
              : anc >= 500
                ? 'Moderate neutropenia'
                : anc > 100
                  ? 'Severe neutropenia'
                  : 'Profound neutropenia';
      const nadir = anc < 100;
      return {
        label: 'ANC',
        value: ancRounded,
        unit: '/µL',
        interpretation: `${category}${febrileNeutropenia ? ' — ⚠️ FEBRILE NEUTROPENIA: INITIATE PROTOCOL IMMEDIATELY' : ''}${nadir ? ' — ⚠️ ANC NADIR REACHED' : ''}.`,
        risk,
        riskPercentage: febrileNeutropenia
          ? 'FEBRILE NEUTROPENIA — EMERGENCY MANAGEMENT'
          : `ANC: ${ancRounded}/µL`,
        guidelineSource: 'NCCN Febrile Neutropenia Guidelines v2.2023 / ASCO 2018',
        scoreBreakdown: [
          { component: 'WBC', score: wbc + ' ×10³/µL' },
          { component: 'Segmented Neutrophils', score: neut + '%' },
          { component: 'Bands', score: bands + '%' },
          { component: 'Total Neutrophil %', score: neut + bands + '%' },
          {
            component: 'ANC Calculation',
            score: `${wbc} × ${neut + bands}% × 10 = ${ancRounded}/µL`,
          },
          { component: 'ANC Category', score: category },
          { component: 'Temperature', score: temp + '°C' + (isFeverile ? ' [Febrile]' : '') },
          {
            component: 'Febrile Neutropenia?',
            score: febrileNeutropenia ? 'YES — Protocol required' : 'No',
          },
          { component: 'Nadir?', score: nadir ? 'YES — ANC <100/µL' : 'No' },
          {
            component: 'NCCN Risk',
            score: anc < 500 ? 'High risk for serious infection' : 'Standard risk',
          },
        ],
        details: febrileNeutropenia
          ? [
              '🚨 FEBRILE NEUTROPENIA PROTOCOL — Initiate within 60 minutes:',
              '1. Blood cultures ×2 (one peripheral, one central if port present)',
              '2. Broad-spectrum antibiotics: Piperacillin-tazobactam 4.5g IV Q6h OR Cefepime 2g IV Q8h',
              '3. Anti-pseudomonal coverage mandatory',
              '4. Add vancomycin if: hemodynamically unstable, skin/catheter infection, MRSA colonization',
              '5. G-CSF: filgrastim 5 mcg/kg/day SC or pegfilgrastim if not already given this cycle',
              '6. CBC daily until ANC recovery >500/µL on 2 consecutive days',
              '7. Antifungal if fever persists >4–7 days without identified source',
            ]
          : [
              `ANC ${ancRounded}/µL — ${category}`,
              anc < 500
                ? '→ High-risk neutropenia: prophylactic antibiotics (fluoroquinolone) per institutional protocol'
                : '',
              anc < 500 ? '→ Avoid live vaccines, raw/undercooked foods, crowded places' : '',
              anc < 1000
                ? '→ Monitor for fever ≥38.3°C — instruct patient to report and present immediately'
                : '',
              anc >= 1500
                ? '→ Chemotherapy may proceed per schedule'
                : '→ Discuss chemotherapy delay/dose reduction with oncologist (ANC <1500)',
              '→ G-CSF consideration if ANC <500 and next cycle planned within 2 weeks',
            ].filter(Boolean),
      };
    },
  },

  // ── 3. Blood Transfusion Volume ────────────────────────────────────────
  {
    id: 'blood-transfusion-volume-calculator',
    name: 'Blood Transfusion Volume',
    category: 'Oncology',
    icon: '🩸',
    description:
      'Calculate pRBC volume to achieve target hemoglobin using AABB restrictive/liberal threshold guidance. Includes estimated unit count, pediatric dosing, and product selection guidance.',
    formula:
      'Volume (mL) = Weight (kg) × (Target Hgb − Current Hgb) × 3 | Estimated units = Volume ÷ 300 mL/unit',
    reference:
      'Carson JL et al. NEJM 2011 (FOCUS Trial) / AABB Clinical Practice Guidelines 2016 / British Committee for Standards in Haematology 2017',
    inputs: [
      {
        id: 'weight',
        label: 'Patient Weight',
        type: 'number',
        unit: 'kg',
        min: 3,
        max: 300,
        defaultValue: 70,
        placeholder: 'e.g. 70',
      },
      {
        id: 'current_hgb',
        label: 'Current Hemoglobin',
        type: 'number',
        unit: 'g/dL',
        min: 1.0,
        max: 20.0,
        step: 0.1,
        defaultValue: 7.0,
        placeholder: 'e.g. 7.0',
      },
      {
        id: 'target_hgb',
        label: 'Target Hemoglobin',
        type: 'number',
        unit: 'g/dL',
        min: 5.0,
        max: 16.0,
        step: 0.1,
        defaultValue: 9.0,
        placeholder: 'e.g. 9.0 (typical target 7–10 g/dL)',
      },
      {
        id: 'indication',
        label: 'Transfusion Indication / Setting',
        type: 'select',
        options: [
          { label: 'Symptomatic anemia — general', value: 'general' },
          { label: 'Acute hemorrhage / hemodynamic instability', value: 'hemorrhage' },
          { label: 'Post-chemotherapy / hematology-oncology', value: 'onco' },
          { label: 'Cardiac surgery / ICU', value: 'icu' },
          { label: 'Pediatric patient', value: 'pediatric' },
          { label: 'Bone marrow transplant', value: 'bmt' },
        ],
        defaultValue: 'onco',
      },
      {
        id: 'age',
        label: 'Patient Age',
        type: 'number',
        unit: 'years',
        min: 0,
        max: 110,
        defaultValue: 55,
        placeholder: 'e.g. 55',
      },
    ],
    calculate(v) {
      const w = Number(v.weight),
        cur = Number(v.current_hgb),
        tgt = Number(v.target_hgb);
      const age = Number(v.age);
      if (tgt <= cur) {
        return {
          label: 'Transfusion Volume',
          value: 0,
          unit: 'mL',
          interpretation:
            'Target hemoglobin is already met or exceeded — transfusion not indicated.',
          risk: 'low',
        };
      }
      const vol = w * (tgt - cur) * 3;
      const units = Math.ceil(vol / 300);
      const isPediatric = age < 18 || v.indication === 'pediatric';
      const restrictiveThreshold = v.indication === 'icu' ? 7 : v.indication === 'onco' ? 8 : 7;
      const liberalThreshold = v.indication === 'hemorrhage' ? 10 : 9;
      const transfusionJustified = cur < restrictiveThreshold;
      const risk: CalculationResult['risk'] =
        cur < 6 ? 'critical' : cur < 8 ? 'high' : cur < 10 ? 'moderate' : 'low';
      return {
        label: 'pRBC Volume Required',
        value: Math.round(vol),
        unit: 'mL',
        interpretation: `Estimated ${units} unit(s) of pRBC to raise Hgb from ${cur} → ${tgt} g/dL. ${transfusionJustified ? 'Transfusion threshold met.' : 'Current Hgb above restrictive threshold — reassess symptoms before transfusing.'}`,
        risk,
        riskPercentage: `Current Hgb: ${cur} g/dL | Target: ${tgt} g/dL | ~${units} unit(s)`,
        guidelineSource: 'AABB Clinical Practice Guidelines 2016 / FOCUS Trial NEJM 2011',
        scoreBreakdown: [
          { component: 'Patient Weight', score: w + ' kg' },
          { component: 'Current Hemoglobin', score: cur + ' g/dL' },
          { component: 'Target Hemoglobin', score: tgt + ' g/dL' },
          { component: 'Hgb Increment Needed', score: (tgt - cur).toFixed(1) + ' g/dL' },
          {
            component: 'Formula: W × ΔHgb × 3',
            score: `${w} × ${(tgt - cur).toFixed(1)} × 3 = ${vol.toFixed(0)} mL`,
          },
          {
            component: 'Estimated pRBC Units',
            score: `~${units} unit(s) (each ≈300 mL, raises Hgb ≈1 g/dL)`,
          },
          { component: 'AABB Restrictive Threshold', score: `Hgb <${restrictiveThreshold} g/dL` },
          {
            component: 'Transfusion Threshold Met?',
            score: transfusionJustified ? 'YES' : 'No (Hgb above threshold — assess symptoms)',
          },
          {
            component: 'Pediatric Dosing',
            score: isPediatric
              ? `10–15 mL/kg = ${(w * 10).toFixed(0)}–${(w * 15).toFixed(0)} mL`
              : 'N/A (adult dosing used)',
          },
        ],
        details: [
          '→ Transfuse 1 unit at a time — recheck Hgb after each unit before continuing',
          `→ AABB restrictive strategy: transfuse at Hgb <${restrictiveThreshold} g/dL (hemodynamically stable patients)`,
          `→ Liberal strategy (Hgb <${liberalThreshold}): active cardiac ischemia, symptomatic anemia, hemorrhage`,
          isPediatric
            ? `→ Pediatric dose: 10–15 mL/kg — volume ${(w * 10).toFixed(0)}–${(w * 15).toFixed(0)} mL`
            : '',
          '→ Irradiated + leukoreduced products for immunocompromised patients (oncology/BMT)',
          '→ CMV-negative products for seronegative immunocompromised patients',
          '→ Type and screen / crossmatch required before transfusion',
          '→ Monitor for TACO (fluid overload), TRALI, and acute hemolytic reaction during transfusion',
        ].filter(Boolean),
      };
    },
  },

  // ── 4. INR / PT Ratio Converter ────────────────────────────────────────
  {
    id: 'inr-pt-ratio-converter',
    name: 'INR / PT Converter',
    category: 'Oncology',
    icon: '🧪',
    description:
      'Convert between PT seconds and INR using the ISI of the local thromboplastin reagent. Interprets coagulation status for warfarin therapy, liver disease, perioperative, and DIC settings.',
    formula: 'INR = (Patient PT / Mean Normal PT)^ISI | PT Ratio = Patient PT / Normal PT',
    reference:
      'WHO Technical Report Series No. 987 (2014) / AHA/ACC Warfarin Guidelines / ISTH DIC Scoring Criteria',
    inputs: [
      {
        id: 'pt_patient',
        label: 'Patient PT',
        type: 'number',
        unit: 'seconds',
        min: 8,
        max: 300,
        step: 0.1,
        defaultValue: 15.0,
        placeholder: 'e.g. 15.0',
      },
      {
        id: 'pt_normal',
        label: 'Lab Normal PT (MNPT)',
        type: 'number',
        unit: 'seconds',
        min: 9,
        max: 14,
        step: 0.1,
        defaultValue: 11.5,
        placeholder: 'e.g. 11.5 (check your lab reference range)',
      },
      {
        id: 'isi',
        label: 'ISI of Thromboplastin Reagent',
        type: 'number',
        unit: '',
        min: 0.8,
        max: 2.5,
        step: 0.01,
        defaultValue: 1.0,
        placeholder: 'e.g. 1.0 (check reagent package insert)',
      },
      {
        id: 'indication',
        label: 'Clinical Indication',
        type: 'select',
        options: [
          { label: 'Warfarin monitoring — AF/VTE (target INR 2–3)', value: 'af' },
          { label: 'Warfarin — Mechanical heart valve (target INR 2.5–3.5)', value: 'valve' },
          { label: 'Liver disease / cirrhosis assessment', value: 'liver' },
          { label: 'Pre-operative coagulation assessment', value: 'preop' },
          { label: 'DIC / coagulopathy monitoring', value: 'dic' },
        ],
        defaultValue: 'af',
      },
    ],
    calculate(v) {
      const ptP = Number(v.pt_patient),
        ptN = Number(v.pt_normal),
        isi = Number(v.isi);
      const ptRatio = ptP / ptN;
      const inr = Math.pow(ptRatio, isi);
      const prolongedSec = ptP - ptN;
      let targetRange: string, inRange: boolean, action: string;
      if (v.indication === 'af') {
        targetRange = '2.0–3.0';
        inRange = inr >= 2.0 && inr <= 3.0;
        action =
          inr < 1.5
            ? 'Subtherapeutic — increased thromboembolism risk; check compliance/dose'
            : inr > 4.0
              ? 'Supratherapeutic — bleeding risk; hold dose, recheck in 24–48h'
              : 'Within therapeutic range';
      } else if (v.indication === 'valve') {
        targetRange = '2.5–3.5';
        inRange = inr >= 2.5 && inr <= 3.5;
        action =
          inr < 2.0
            ? 'Subtherapeutic for mechanical valve — high stroke risk; urgent dose adjustment'
            : inr > 4.5
              ? 'Supratherapeutic — hold dose, consider vitamin K if >5.0'
              : 'Within therapeutic range';
      } else if (v.indication === 'liver') {
        targetRange = 'N/A (reflects hepatic synthetic function)';
        inRange = inr < 1.5;
        action =
          inr < 1.5
            ? 'Mild coagulopathy — monitor'
            : inr < 2.0
              ? 'Moderate — vitamin K 10mg IV × 3 days'
              : inr < 3.0
                ? 'Significant — FFP consideration for procedures'
                : 'Severe coagulopathy — FFP, consider 4-factor PCC';
      } else if (v.indication === 'preop') {
        targetRange = '<1.5 for most procedures';
        inRange = inr < 1.5;
        action =
          inr < 1.5
            ? 'Acceptable for most procedures'
            : inr < 2.0
              ? 'Minor procedures possible with FFP coverage'
              : 'High bleeding risk — correct before elective procedure';
      } else {
        targetRange = '<1.3 (normal)';
        inRange = inr < 1.3;
        action =
          inr > 1.5
            ? 'Coagulopathy present — evaluate for DIC; check fibrinogen, D-dimer, platelets'
            : 'Normal coagulation range';
      }
      const risk: CalculationResult['risk'] =
        inr < 1.5 ? 'low' : inr < 3 ? 'moderate' : inr < 5 ? 'high' : 'critical';
      return {
        label: 'INR',
        value: inr.toFixed(2),
        unit: '',
        interpretation: `INR: ${inr.toFixed(2)} | PT: ${ptP}s (${prolongedSec > 0 ? '+' + prolongedSec.toFixed(1) : '0'}s prolonged) | PT Ratio: ${ptRatio.toFixed(2)}. ${action}.`,
        risk,
        riskPercentage: `INR: ${inr.toFixed(2)} | Target: ${targetRange} | ${inRange ? '✅ IN RANGE' : '⚠️ OUT OF RANGE'}`,
        guidelineSource: 'WHO Technical Report 2014 / AHA/ACC Warfarin Guidelines',
        scoreBreakdown: [
          { component: 'Patient PT', score: ptP + ' seconds' },
          { component: 'Mean Normal PT (MNPT)', score: ptN + ' seconds' },
          { component: 'PT Seconds Prolonged', score: prolongedSec.toFixed(1) + ' seconds' },
          { component: 'PT Ratio (Patient÷Normal)', score: ptRatio.toFixed(3) },
          { component: 'ISI (reagent)', score: isi.toFixed(2) },
          {
            component: 'INR = PT Ratio^ISI',
            score: `${ptRatio.toFixed(3)}^${isi.toFixed(2)} = ${inr.toFixed(2)}`,
          },
          { component: 'Indication', score: String(v.indication) },
          { component: 'Target INR Range', score: targetRange },
          { component: 'In Therapeutic Range?', score: inRange ? 'Yes' : 'No' },
          { component: 'Recommended Action', score: action },
        ],
        details: [
          `→ INR ${inr.toFixed(2)}: ${action}`,
          v.indication === 'af'
            ? '→ ESC 2023 AF Guidelines: NOACs preferred over warfarin where eligible'
            : '',
          inr > 5
            ? '→ INR >5: Hold warfarin; vitamin K 1–2.5mg oral or 2–4mg IV (if bleeding or urgent reversal)'
            : '',
          inr > 8
            ? '→ INR >8 with bleeding: 4-factor PCC (Kcentra) 25–50 units/kg IV — fastest reversal'
            : '',
          '→ ISI accuracy critical — use ISI from your local lab reagent package insert',
          '→ Drugs that increase INR: NSAIDs, antibiotics, azole antifungals, amiodarone',
          '→ Vitamin K foods: consistent intake preferred over avoidance for INR stability',
        ].filter(Boolean),
      };
    },
  },

  // ── 5. PSA Velocity & Doubling Time ───────────────────────────────────
  {
    id: 'psa-velocity-doubling-time',
    name: 'PSA Velocity & Doubling Time',
    category: 'Oncology',
    icon: '📈',
    description:
      'Calculate PSA velocity and PSA doubling time for prostate cancer risk stratification. Includes PSAD calculation if prostate volume is provided. Flags biopsy and imaging thresholds per AUA/EAU guidelines.',
    formula:
      'PSAV = (PSA2 − PSA1) / ΔYears | PSADT = ln(2) / [ln(PSA2/PSA1) / ΔMonths] | PSAD = PSA / Prostate Volume (mL)',
    reference:
      "Carter HB et al. JAMA 1992 / D'Amico AV JAMA 2004 / AUA PSA Best Practice 2023 / EAU Prostate Cancer Guidelines 2023",
    inputs: [
      {
        id: 'psa1',
        label: 'First PSA Value',
        type: 'number',
        unit: 'ng/mL',
        min: 0.01,
        max: 5000,
        step: 0.01,
        defaultValue: 4.0,
        placeholder: 'e.g. 4.0',
      },
      {
        id: 'psa2',
        label: 'Second (Most Recent) PSA',
        type: 'number',
        unit: 'ng/mL',
        min: 0.01,
        max: 5000,
        step: 0.01,
        defaultValue: 6.5,
        placeholder: 'e.g. 6.5',
      },
      {
        id: 'months',
        label: 'Time Between PSA Tests',
        type: 'number',
        unit: 'months',
        min: 1,
        max: 240,
        defaultValue: 12,
        placeholder: 'e.g. 12',
      },
      {
        id: 'age',
        label: 'Patient Age',
        type: 'number',
        unit: 'years',
        min: 40,
        max: 90,
        defaultValue: 65,
        placeholder: 'e.g. 65',
      },
      {
        id: 'pv',
        label: 'Prostate Volume — optional (for PSAD)',
        type: 'number',
        unit: 'mL',
        min: 0,
        max: 300,
        step: 1,
        defaultValue: 35,
        placeholder: 'e.g. 35 mL (from TRUS or MRI; enter 0 to skip PSAD)',
      },
      {
        id: 'prior_biopsy',
        label: 'Prior Prostate Biopsy Result',
        type: 'select',
        options: [
          { label: 'None / Not performed', value: 'none' },
          { label: 'Negative biopsy', value: 'negative' },
          { label: 'Active surveillance (Gleason ≤6 / GG1)', value: 'surveillance' },
          { label: 'Post-treatment monitoring', value: 'post_treatment' },
        ],
        defaultValue: 'none',
      },
    ],
    calculate(v) {
      const psa1 = Number(v.psa1),
        psa2 = Number(v.psa2),
        months = Number(v.months);
      const age = Number(v.age),
        pv = Number(v.pv);
      const years = months / 12;
      if (psa2 <= 0 || psa1 <= 0) {
        return {
          label: 'PSA Velocity',
          value: 0,
          unit: 'ng/mL/yr',
          interpretation: 'Invalid PSA values — both must be >0.',
          risk: 'low',
        };
      }
      const psaV = (psa2 - psa1) / years;
      const psadt = psa2 > psa1 ? (Math.log(2) / Math.log(psa2 / psa1)) * months : Infinity;
      const psad = pv > 0 ? psa2 / pv : null;
      const rapidDoubling = psadt < 3;
      const concerningDoubling = isFinite(psadt) && psadt < 12;
      const highVelocity = psaV > 0.75 && psa2 < 10;
      const ageAdjustedNormal = age < 50 ? 2.5 : age < 60 ? 3.5 : age < 70 ? 4.5 : 6.5;
      const risk: CalculationResult['risk'] = rapidDoubling
        ? 'critical'
        : concerningDoubling
          ? 'high'
          : highVelocity
            ? 'high'
            : 'moderate';
      const psadInterp =
        psad !== null
          ? psad > 0.15
            ? `⚠️ PSAD ${psad.toFixed(2)} ng/mL/mL — ELEVATED (>0.15 threshold for biopsy consideration)`
            : `PSAD ${psad.toFixed(2)} ng/mL/mL — below biopsy threshold`
          : '';
      return {
        label: 'PSA Velocity',
        value: psaV.toFixed(2),
        unit: 'ng/mL/yr',
        interpretation: `PSAV: ${psaV.toFixed(2)} ng/mL/yr | PSADT: ${isFinite(psadt) ? psadt.toFixed(1) + ' months' : 'Decreasing/stable'}. ${rapidDoubling ? '⚠️ RAPID PSA DOUBLING — urgent urology referral' : concerningDoubling ? '⚠️ PSADT <12 months — concerning kinetics' : 'Doubling time within acceptable range'}. ${psadInterp}`,
        risk,
        riskPercentage: `PSADT: ${isFinite(psadt) ? psadt.toFixed(1) + ' months' : 'N/A'} | PSAD: ${psad !== null ? psad.toFixed(2) + ' ng/mL/mL' : 'Not calculated'}`,
        guidelineSource: "AUA PSA Guidelines 2023 / D'Amico JAMA 2004 / EAU PCa Guidelines 2023",
        scoreBreakdown: [
          { component: 'First PSA', score: psa1 + ' ng/mL' },
          { component: 'Second PSA (recent)', score: psa2 + ' ng/mL' },
          { component: 'Interval', score: months + ' months (' + years.toFixed(2) + ' years)' },
          { component: 'PSA Velocity', score: psaV.toFixed(2) + ' ng/mL/year' },
          {
            component: 'PSA Doubling Time',
            score: isFinite(psadt)
              ? psadt.toFixed(1) + ' months'
              : 'Not applicable (PSA not rising)',
          },
          { component: 'Rapid Doubling (<3 mo)?', score: rapidDoubling ? 'YES — Urgent' : 'No' },
          {
            component: 'Concerning Doubling (<12 mo)?',
            score: concerningDoubling ? 'YES — Evaluate' : 'No',
          },
          {
            component: 'High Velocity (>0.75 ng/mL/yr at PSA<10)?',
            score: highVelocity ? 'YES — Biopsy consideration' : 'No',
          },
          { component: 'Prostate Volume', score: pv > 0 ? pv + ' mL' : 'Not entered' },
          {
            component: 'PSAD',
            score:
              psad !== null
                ? psad.toFixed(3) + ' ng/mL/mL' + (psad > 0.15 ? ' ⚠️ ELEVATED' : '')
                : ' Not calculated',
          },
          {
            component: 'Age-Adjusted Normal PSA',
            score: '<' + ageAdjustedNormal + ' ng/mL for age ' + age,
          },
          {
            component: 'PSA vs Age-Adjusted Normal',
            score: psa2 > ageAdjustedNormal ? 'ELEVATED for age' : 'Within age-adjusted range',
          },
        ],
        details: [
          `PSA ${psa2} ng/mL | PSAV ${psaV.toFixed(2)} ng/mL/yr | PSADT ${isFinite(psadt) ? psadt.toFixed(1) + ' months' : 'N/A'}`,
          psad !== null
            ? `PSAD: ${psad.toFixed(3)} ng/mL/mL — ${psad > 0.15 ? 'Above 0.15 threshold — biopsy consideration' : 'Below 0.15 threshold'}`
            : '',
          rapidDoubling
            ? '🚨 PSADT <3 months: Highly aggressive kinetics — immediate urology referral; mpMRI + consider PSMA PET'
            : '',
          '→ AUA 2023: Shared decision-making for PSA 4–10 ng/mL before biopsy',
          '→ mpMRI before biopsy improves detection of significant cancers (PI-RADS ≥3)',
          '→ Active surveillance: PSADT >3 years and GG1 disease — continue surveillance per protocol',
          '→ Post-treatment: PSA nadir <0.1 ng/mL = adequate response; biochemical recurrence if PSA >0.2 ng/mL ×2',
          '→ Free/total PSA ratio <10% increases likelihood of prostate cancer vs BPH',
        ].filter(Boolean),
      };
    },
  },

  // ── 6. TNM Staging Interpreter ────────────────────────────────────────
  {
    id: 'tnm-staging-interpreter',
    name: 'TNM Stage Interpreter',
    category: 'Oncology',
    icon: '📊',
    description:
      'Determine AJCC 8th edition cancer stage from TNM classification. Outputs stage group, staging type, site-specific 5-year survival (SEER 2022), and MDT referral guidance.',
    formula:
      'AJCC 8th Edition TNM Stage Grouping (2017) — generic solid tumor framework with site-specific SEER survival data',
    reference:
      'AJCC Cancer Staging Manual 8th Edition (2017) / NCCN Staging Guidelines 2023 / NCI SEER 2022',
    inputs: [
      {
        id: 'cancer_site',
        label: 'Primary Cancer Site',
        type: 'select',
        options: [
          { label: 'Breast', value: 'breast' },
          { label: 'Colorectal / Colon', value: 'colon' },
          { label: 'Non-Small Cell Lung (NSCLC)', value: 'lung' },
          { label: 'Prostate', value: 'prostate' },
          { label: 'Melanoma (cutaneous)', value: 'melanoma' },
          { label: 'Gastric / Stomach', value: 'gastric' },
          { label: 'Bladder', value: 'bladder' },
          { label: 'Pancreatic', value: 'pancreas' },
          { label: 'Cervical', value: 'cervical' },
          { label: 'Endometrial / Uterine', value: 'endometrial' },
        ],
        defaultValue: 'breast',
      },
      {
        id: 't',
        label: 'T — Primary Tumor',
        type: 'select',
        options: [
          { label: 'Tis — In situ (non-invasive)', value: 0 },
          { label: 'T1 — Small/localized', value: 1 },
          { label: 'T2 — Intermediate size or invasion', value: 2 },
          { label: 'T3 — Larger or deeper invasion', value: 3 },
          { label: 'T4 — Direct extension to adjacent structures', value: 4 },
        ],
        defaultValue: 2,
      },
      {
        id: 'n',
        label: 'N — Regional Lymph Nodes',
        type: 'select',
        options: [
          { label: 'N0 — No regional node involvement', value: 0 },
          { label: 'N1 — 1–3 regional nodes or minimal involvement', value: 1 },
          { label: 'N2 — 4+ nodes or significant involvement', value: 2 },
          { label: 'N3 — Extensive node involvement', value: 3 },
        ],
        defaultValue: 0,
      },
      {
        id: 'm',
        label: 'M — Distant Metastasis',
        type: 'select',
        options: [
          { label: 'M0 — No distant metastasis', value: 0 },
          { label: 'M1 — Distant metastasis present', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'staging_type',
        label: 'Staging Type',
        type: 'select',
        options: [
          { label: 'Clinical (cTNM) — pre-treatment imaging', value: 'clinical' },
          { label: 'Pathological (pTNM) — post-surgical specimen', value: 'pathological' },
          { label: 'Post-neoadjuvant (ypTNM)', value: 'post_neo' },
        ],
        defaultValue: 'clinical',
      },
      {
        id: 'grade',
        label: 'Histological Grade',
        type: 'select',
        options: [
          { label: 'G1 — Well differentiated', value: 1 },
          { label: 'G2 — Moderately differentiated', value: 2 },
          { label: 'G3 — Poorly differentiated', value: 3 },
          { label: 'GX — Cannot be assessed', value: 0 },
        ],
        defaultValue: 2,
      },
    ],
    calculate(v) {
      const t = Number(v.t),
        n = Number(v.n),
        m = Number(v.m);
      const site = v.cancer_site as string;
      let stage: string, stageNum: number;
      if (m === 1) {
        stage = 'IV';
        stageNum = 4;
      } else if (t === 0 && n === 0) {
        stage = '0 (In Situ)';
        stageNum = 0;
      } else if (t === 1 && n === 0) {
        stage = 'I';
        stageNum = 1;
      } else if (t === 2 && n === 0) {
        stage = 'IIA';
        stageNum = 2;
      } else if (t === 3 && n === 0) {
        stage = 'IIB';
        stageNum = 2;
      } else if (t === 1 && n === 1) {
        stage = 'IIA';
        stageNum = 2;
      } else if (t <= 2 && n === 1) {
        stage = 'IIIA';
        stageNum = 3;
      } else if (t === 3 && n === 1) {
        stage = 'IIIB';
        stageNum = 3;
      } else if (n >= 2 || t === 4) {
        stage = 'IIIC';
        stageNum = 3;
      } else {
        stage = 'II';
        stageNum = 2;
      }
      const survivalBySite: Record<string, number[]> = {
        breast: [99, 86, 86, 28],
        colon: [90, 72, 57, 13],
        lung: [65, 35, 22, 8],
        prostate: [100, 100, 99, 31],
        melanoma: [98, 66, 68, 30],
        gastric: [70, 32, 18, 5],
        bladder: [96, 70, 38, 6],
        pancreas: [44, 12, 3, 3],
        cervical: [92, 76, 57, 17],
        endometrial: [96, 69, 57, 17],
      };
      const surv5y = stageNum > 0 ? (survivalBySite[site] || [80, 60, 30, 10])[stageNum - 1] : 99;
      const surv5yDisplay = stageNum === 0 ? '>99%' : surv5y + '%';
      const risk: CalculationResult['risk'] =
        stageNum <= 1 ? 'low' : stageNum === 2 ? 'moderate' : stageNum === 3 ? 'high' : 'critical';
      const gradeLabel =
        Number(v.grade) === 1
          ? 'Well differentiated (G1)'
          : Number(v.grade) === 2
            ? 'Moderately differentiated (G2)'
            : Number(v.grade) === 3
              ? 'Poorly differentiated (G3)'
              : 'Grade not assessed (GX)';
      return {
        label: 'TNM Stage',
        value: stage,
        unit: '',
        interpretation: `${v.staging_type} T${v.t}N${v.n}M${v.m} ${gradeLabel} — AJCC 8th Edition Stage ${stage}. SEER 5-year relative survival for Stage ${stageNum === 0 ? '0' : stageNum} ${site}: ${surv5yDisplay}.`,
        risk,
        riskPercentage: `Stage ${stage} | 5-yr survival (SEER): ${surv5yDisplay}`,
        guidelineSource: 'AJCC Cancer Staging Manual 8th Ed 2017 / NCI SEER 2022',
        scoreBreakdown: [
          { component: 'Cancer Site', score: site.charAt(0).toUpperCase() + site.slice(1) },
          { component: 'Staging Type', score: String(v.staging_type) },
          {
            component: 'T (Tumor)',
            score: `T${v.t} — ${['In situ', 'Small/localized', 'Intermediate', 'Larger/deeper', 'Adjacent extension'][t]}`,
          },
          {
            component: 'N (Nodes)',
            score: `N${v.n} — ${['No nodes', '1–3 nodes', '4+ nodes', 'Extensive nodes'][n]}`,
          },
          {
            component: 'M (Metastasis)',
            score: `M${v.m} — ${m === 0 ? 'No distant metastasis' : 'Distant metastasis PRESENT'}`,
          },
          { component: 'Histological Grade', score: gradeLabel },
          { component: 'AJCC Stage Group', score: stage },
          {
            component: '5-Year Survival Estimate',
            score: surv5yDisplay + ' (SEER population-based)',
          },
          {
            component: 'Distant Metastasis?',
            score: m === 1 ? 'YES — Stage IV (curative intent usually not possible)' : 'No',
          },
        ],
        details: [
          `AJCC 8th Ed Stage ${stage}: T${v.t}N${v.n}M${v.m} — ${site}`,
          `5-year relative survival (SEER 2022): ${surv5yDisplay}`,
          m === 1
            ? '🚨 Stage IV: Goals of care discussion, palliative/systemic therapy, clinical trial eligibility'
            : '',
          stageNum === 3
            ? '→ Consider neoadjuvant therapy, MDT tumor board discussion, and surgical candidacy assessment'
            : '',
          stageNum <= 2
            ? '→ Curative-intent treatment: surgery ± adjuvant therapy depending on site and grade'
            : '',
          '→ Stage grouping shown is GENERIC AJCC — site-specific staging differs (breast: ER/PR/HER2; prostate: PSA+Gleason; etc.)',
          '→ MDT (tumor board) review required for all Stage III–IV malignancies',
          '→ Survival estimates are population-based SEER data — individual prognosis depends on molecular subtype and treatment response',
          '→ Post-neoadjuvant ypTNM stage guides adjuvant therapy decisions',
        ].filter(Boolean),
      };
    },
  },

  // ── 7. IPSS-R (MDS Score) ─────────────────────────────────────────────
  {
    id: 'ipss-mds-score',
    name: 'IPSS-R (MDS Score)',
    category: 'Oncology',
    icon: '🩸',
    description:
      'Revised International Prognostic Scoring System for Myelodysplastic Syndromes. Predicts overall survival, AML transformation risk, and guides transplant/treatment intensity decisions per NCCN MDS guidelines.',
    formula:
      'IPSS-R = Cytogenetics score + BM Blast score + Hemoglobin score + Platelet score + ANC score (Greenberg 2012)',
    reference:
      'Greenberg PL et al. Blood 2012 / NCCN MDS Guidelines v3.2023 / ELN MDS Recommendations 2023',
    inputs: [
      {
        id: 'cyto',
        label: 'Cytogenetic Category (FISH/karyotype)',
        type: 'select',
        options: [
          { label: 'Very good: -Y, del(11q)  [0 pts]', value: 0 },
          {
            label: 'Good: normal, del(5q), del(12p), del(20q), double with del(5q)  [1 pt]',
            value: 1,
          },
          {
            label: 'Intermediate: del(7q), +8, +19, i(17q), other single/double  [2 pts]',
            value: 2,
          },
          {
            label:
              'Poor: -7, inv(3)/t(3q)/del(3q), double with -7/del(7q), complex (3 abn.)  [3 pts]',
            value: 3,
          },
          { label: 'Very poor: complex (>3 abnormalities)  [4 pts]', value: 4 },
        ],
        defaultValue: 1,
      },
      {
        id: 'blasts',
        label: 'Bone Marrow Blast %',
        type: 'select',
        options: [
          { label: '≤2%  [0 pts]', value: 0 },
          { label: '>2–5%  [1 pt]', value: 1 },
          { label: '5–10%  [2 pts]', value: 2 },
          { label: '>10%  [3 pts]', value: 3 },
        ],
        defaultValue: 0,
      },
      {
        id: 'hgb',
        label: 'Hemoglobin Level',
        type: 'select',
        options: [
          { label: '≥10 g/dL  [0 pts]', value: 0 },
          { label: '8–9.9 g/dL  [1 pt]', value: 1 },
          { label: '<8 g/dL  [1.5 pts]', value: 1.5 },
        ],
        defaultValue: 0,
      },
      {
        id: 'plt',
        label: 'Platelet Count',
        type: 'select',
        options: [
          { label: '≥100 ×10³/µL  [0 pts]', value: 0 },
          { label: '50–99 ×10³/µL  [0.5 pts]', value: 0.5 },
          { label: '<50 ×10³/µL  [1 pt]', value: 1 },
        ],
        defaultValue: 0,
      },
      {
        id: 'anc_val',
        label: 'ANC (Absolute Neutrophil Count)',
        type: 'select',
        options: [
          { label: '≥0.8 ×10³/µL  [0 pts]', value: 0 },
          { label: '<0.8 ×10³/µL  [0.5 pts]', value: 0.5 },
        ],
        defaultValue: 0,
      },
      {
        id: 'age',
        label: 'Patient Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 100,
        defaultValue: 68,
        placeholder: 'e.g. 68',
      },
    ],
    calculate(v) {
      const cyto = Number(v.cyto),
        blasts = Number(v.blasts),
        hgb = Number(v.hgb);
      const plt = Number(v.plt),
        anc = Number(v.anc_val),
        age = Number(v.age);
      const score = cyto + blasts + hgb + plt + anc;
      let riskCat: string, medSurv: string, amlRisk: string;
      if (score <= 1.5) {
        riskCat = 'Very Low';
        medSurv = '8.8 years';
        amlRisk = '~3%';
      } else if (score <= 3) {
        riskCat = 'Low';
        medSurv = '5.3 years';
        amlRisk = '~14%';
      } else if (score <= 4.5) {
        riskCat = 'Intermediate';
        medSurv = '3.0 years';
        amlRisk = '~33%';
      } else if (score <= 6) {
        riskCat = 'High';
        medSurv = '1.6 years';
        amlRisk = '~54%';
      } else {
        riskCat = 'Very High';
        medSurv = '0.8 years';
        amlRisk = '~84%';
      }
      const risk: CalculationResult['risk'] =
        score <= 3 ? 'low' : score <= 4.5 ? 'moderate' : 'high';
      return {
        label: 'IPSS-R Score',
        value: score.toFixed(1),
        unit: '',
        interpretation: `IPSS-R: ${score.toFixed(1)} — Risk: ${riskCat}. Median OS: ${medSurv}. 25% AML transformation risk: ${amlRisk}.`,
        risk,
        riskPercentage: `${riskCat} risk | Median OS: ${medSurv} | AML risk: ${amlRisk}`,
        guidelineSource: 'Greenberg PL et al. Blood 2012 / NCCN MDS v3.2023',
        scoreBreakdown: [
          {
            component: 'Cytogenetics',
            score:
              cyto + ' pts — ' + ['Very good', 'Good', 'Intermediate', 'Poor', 'Very poor'][cyto],
          },
          { component: 'BM Blasts', score: blasts + ' pts' },
          { component: 'Hemoglobin', score: hgb + ' pts' },
          { component: 'Platelets', score: plt + ' pts' },
          { component: 'ANC', score: anc + ' pts' },
          { component: 'Total IPSS-R Score', score: score.toFixed(1) },
          { component: 'Risk Category', score: riskCat },
          { component: 'Median Overall Survival', score: medSurv },
          { component: '25% AML Transformation Risk', score: '~' + amlRisk },
          { component: 'Patient Age', score: age + ' years' },
        ],
        details: [
          `IPSS-R ${score.toFixed(1)} → ${riskCat} risk | OS ${medSurv} | AML risk ${amlRisk}`,
          score <= 3
            ? '→ Lower-risk MDS: ESA (epoetin alfa/darbepoetin) if EPO level <500 mU/mL and transfusion burden <2 units/month'
            : '',
          score <= 3 ? '→ Lenalidomide for del(5q): high response rate (LISTA trial)' : '',
          score > 4.5
            ? '→ Higher-risk MDS: Azacitidine 75 mg/m² × 7 days Q28d (AZA-001 trial — first-line standard)'
            : '',
          score > 4.5 && age < 75
            ? '→ Allogeneic HSCT: evaluate eligible patients — only potentially curative option'
            : '',
          '→ Supportive care: RBC transfusion for symptomatic Hgb <8 g/dL; platelets <10–20 ×10³/µL or bleeding',
          '→ Iron chelation (deferasirox) if transfusion burden >20 units and ferritin >1000 µg/L',
          '→ Repeat BM biopsy if blast % progression, clinical deterioration, or change in cytopenia',
        ].filter(Boolean),
      };
    },
  },

  // ── 8. Cancer Survival Estimator ──────────────────────────────────────
  {
    id: 'cancer-survival-probability',
    name: 'Cancer Survival Estimator',
    category: 'Oncology',
    icon: '📊',
    description:
      'SEER-based 1-year, 3-year, and 5-year relative survival estimates by cancer type and stage. Includes age adjustment and treatment impact notes per NCI SEER 2022.',
    formula: 'SEER 17-registry relative survival analysis (NCI Cancer Statistics Review 2022)',
    reference:
      'NCI SEER Cancer Statistics Review 2022 / SEER*Stat Database 2023 / NCCN Outcomes Data',
    inputs: [
      {
        id: 'cancer_type',
        label: 'Cancer Type',
        type: 'select',
        options: [
          { label: 'Breast (female)', value: 'breast' },
          { label: 'Prostate', value: 'prostate' },
          { label: 'Colorectal / Colon', value: 'colon' },
          { label: 'Lung (NSCLC)', value: 'lung' },
          { label: 'Cutaneous Melanoma', value: 'melanoma' },
          { label: 'Ovarian', value: 'ovarian' },
          { label: 'Bladder', value: 'bladder' },
          { label: 'Pancreatic', value: 'pancreas' },
          { label: 'Stomach / Gastric', value: 'gastric' },
          { label: 'Cervical', value: 'cervical' },
          { label: 'Non-Hodgkin Lymphoma', value: 'nhl' },
          { label: 'Leukemia (ALL — adult)', value: 'leukemia' },
        ],
        defaultValue: 'breast',
      },
      {
        id: 'stage',
        label: 'Disease Stage',
        type: 'select',
        options: [
          { label: 'Stage I — Localized', value: 1 },
          { label: 'Stage II — Regional (limited)', value: 2 },
          { label: 'Stage III — Regional (extensive)', value: 3 },
          { label: 'Stage IV — Distant / Metastatic', value: 4 },
        ],
        defaultValue: 1,
      },
      {
        id: 'age',
        label: 'Patient Age at Diagnosis',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 95,
        defaultValue: 60,
        placeholder: 'e.g. 60',
      },
      {
        id: 'sex',
        label: 'Patient Sex',
        type: 'select',
        options: [
          { label: 'Female', value: 'female' },
          { label: 'Male', value: 'male' },
        ],
        defaultValue: 'female',
      },
    ],
    calculate(v) {
      const stageIdx = Number(v.stage) - 1;
      const age = Number(v.age);
      const seer5yr: Record<string, number[]> = {
        breast: [99, 86, 86, 28],
        prostate: [100, 100, 99, 31],
        colon: [90, 72, 57, 13],
        lung: [65, 35, 22, 8],
        melanoma: [98, 66, 68, 30],
        ovarian: [92, 76, 30, 31],
        bladder: [96, 70, 38, 6],
        pancreas: [44, 12, 3, 3],
        gastric: [70, 32, 18, 5],
        cervical: [92, 76, 57, 17],
        nhl: [87, 73, 63, 57],
        leukemia: [71, 55, 30, 20],
      };
      const seer1yr: Record<string, number[]> = {
        breast: [100, 98, 95, 70],
        prostate: [100, 100, 100, 84],
        colon: [97, 93, 82, 42],
        lung: [85, 60, 42, 23],
        melanoma: [99, 90, 85, 62],
        ovarian: [98, 92, 78, 60],
        bladder: [99, 92, 75, 32],
        pancreas: [80, 40, 15, 8],
        gastric: [92, 68, 45, 18],
        cervical: [97, 88, 76, 40],
        nhl: [94, 88, 82, 77],
        leukemia: [87, 78, 60, 40],
      };
      const seer3yr: Record<string, number[]> = {
        breast: [100, 95, 92, 48],
        prostate: [100, 100, 100, 72],
        colon: [94, 83, 68, 22],
        lung: [74, 44, 30, 12],
        melanoma: [99, 78, 73, 43],
        ovarian: [95, 85, 51, 42],
        bladder: [98, 82, 55, 12],
        pancreas: [62, 22, 8, 5],
        gastric: [82, 50, 28, 9],
        cervical: [95, 82, 68, 28],
        nhl: [91, 82, 74, 68],
        leukemia: [78, 63, 40, 28],
      };
      const s5 = (seer5yr[String(v.cancer_type)] || [75, 50, 25, 10])[stageIdx];
      const s1 = (seer1yr[String(v.cancer_type)] || [90, 75, 55, 30])[stageIdx];
      const s3 = (seer3yr[String(v.cancer_type)] || [82, 62, 38, 18])[stageIdx];
      const ageAdj = age > 80 ? -12 : age > 70 ? -5 : 0;
      const s5adj = Math.max(1, Math.min(100, s5 + ageAdj));
      const risk: CalculationResult['risk'] =
        s5 >= 75 ? 'low' : s5 >= 40 ? 'moderate' : s5 >= 15 ? 'high' : 'critical';
      const stageName = [
        'Stage I (Localized)',
        'Stage II (Regional-limited)',
        'Stage III (Regional-extensive)',
        'Stage IV (Metastatic)',
      ][stageIdx];
      const typeName =
        String(v.cancer_type).charAt(0).toUpperCase() + String(v.cancer_type).slice(1);
      return {
        label: '5-Year Survival',
        value: s5,
        unit: '%',
        interpretation: `${typeName} — ${stageName}: 1-yr ${s1}% | 3-yr ${s3}% | 5-yr ${s5}%. Age-adjusted estimate (age ${age}): ~${s5adj}%. Source: NCI SEER 2022.`,
        risk,
        riskPercentage: `1-yr: ${s1}% | 3-yr: ${s3}% | 5-yr: ${s5}%`,
        guidelineSource: 'NCI SEER Cancer Statistics Review 2022 / SEER*Stat 2023',
        scoreBreakdown: [
          { component: 'Cancer Type', score: typeName },
          { component: 'Stage', score: stageName },
          { component: 'Patient Age', score: age + ' years' },
          { component: '1-Year Relative Survival', score: s1 + '%' },
          { component: '3-Year Relative Survival', score: s3 + '%' },
          { component: '5-Year Relative Survival', score: s5 + '%' },
          {
            component: 'Age-Adjusted 5-yr Estimate',
            score: s5adj + '% (approx., age ' + age + ')',
          },
          { component: 'Data Source', score: 'NCI SEER 17-registry, 2022' },
          { component: 'Data Period', score: 'Cases diagnosed 2013–2019' },
        ],
        details: [
          `${typeName} Stage ${Number(v.stage)}: 1yr ${s1}% | 3yr ${s3}% | 5yr ${s5}% (SEER 2022)`,
          '⚠️ These are POPULATION-BASED estimates — individual prognosis depends on:',
          '   • Molecular/genomic subtype (ER/PR/HER2 for breast; KRAS/BRAF for colon; ALK/EGFR for lung)',
          '   • Performance status (ECOG/KPS) and comorbidities',
          '   • Response to treatment and access to novel therapies (immunotherapy, targeted therapy)',
          '   • SEER data reflects diagnoses 2013–2019 — newer therapies may improve contemporary outcomes',
          '→ Discuss individual prognosis, treatment goals, and clinical trial eligibility with oncologist',
          '→ Palliative care referral appropriate at Stage IV diagnosis alongside active treatment',
          '→ Resources: American Cancer Society, CancerCare, local cancer center social work',
        ],
      };
    },
  },
];

export const pediatricsConfigs: MedicalConfig[] = [
  // ── 1. Pediatric BMI-for-Age ──────────────────────────────────────────
  {
    id: 'pediatric-bmi-for-age',
    name: 'Pediatric BMI-for-Age',
    category: 'Pediatrics',
    icon: '👶',
    description:
      'BMI-for-age percentile classification for children 2–20 years using CDC 2000 and WHO 2006 growth charts. Flags underweight, overweight, and obesity thresholds with referral guidance.',
    formula:
      'BMI = Weight (kg) / Height (m)² — plotted on CDC 2000 percentile chart; dual WHO/CDC comparison for ages 0–2',
    reference:
      'CDC Growth Charts 2000 / WHO Child Growth Standards 2006 / AAP Policy Statement on Obesity 2023',
    inputs: [
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        unit: 'kg',
        min: 5,
        max: 150,
        defaultValue: 25,
        placeholder: 'e.g. 25',
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        unit: 'cm',
        min: 50,
        max: 200,
        defaultValue: 120,
        placeholder: 'e.g. 120',
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 2,
        max: 20,
        step: 0.5,
        defaultValue: 8,
        placeholder: 'e.g. 8.0',
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        defaultValue: 'male',
      },
      {
        id: 'unit_sys',
        label: 'Weight Unit',
        type: 'select',
        options: [
          { label: 'kg (metric)', value: 'kg' },
          { label: 'lbs (convert to kg)', value: 'lbs' },
        ],
        defaultValue: 'kg',
      },
    ],
    calculate(v) {
      const rawW = Number(v.weight);
      const w = v.unit_sys === 'lbs' ? rawW * 0.4536 : rawW;
      const h = Number(v.height),
        age = Number(v.age);
      const bmi = w / Math.pow(h / 100, 2);
      // Age/sex-adjusted CDC BMI-for-age percentile approximation
      // Approximate 5th, 85th, 95th percentile BMI by age (CDC lookup simplified)
      const ageIdx = Math.min(Math.floor(age) - 2, 16);
      const maleP5 =
        [
          13.6, 13.3, 13.1, 13.0, 13.0, 13.1, 13.3, 13.6, 14.0, 14.6, 15.2, 15.8, 16.4, 17.0, 17.5,
          17.9, 18.2,
        ][ageIdx] || 14;
      const maleP85 =
        [
          17.4, 17.2, 17.2, 17.3, 17.6, 18.0, 18.6, 19.4, 20.3, 21.2, 22.1, 23.0, 23.8, 24.4, 24.8,
          25.1, 25.2,
        ][ageIdx] || 21;
      const maleP95 =
        [
          19.2, 18.9, 18.8, 18.9, 19.4, 20.0, 20.9, 22.0, 23.2, 24.4, 25.5, 26.6, 27.5, 28.2, 28.7,
          29.1, 29.3,
        ][ageIdx] || 25;
      const femP5 =
        [
          13.5, 13.2, 13.0, 12.9, 13.0, 13.2, 13.5, 13.9, 14.4, 15.0, 15.7, 16.3, 16.9, 17.4, 17.8,
          18.1, 18.4,
        ][ageIdx] || 14;
      const femP85 =
        [
          17.3, 17.0, 17.0, 17.2, 17.6, 18.2, 19.0, 19.9, 20.8, 21.8, 22.7, 23.5, 24.2, 24.7, 25.1,
          25.3, 25.4,
        ][ageIdx] || 21;
      const femP95 =
        [
          18.9, 18.6, 18.5, 18.7, 19.3, 20.1, 21.2, 22.3, 23.5, 24.7, 25.9, 26.9, 27.7, 28.4, 28.8,
          29.1, 29.2,
        ][ageIdx] || 25;
      const p5 = v.sex === 'male' ? maleP5 : femP5;
      const p85 = v.sex === 'male' ? maleP85 : femP85;
      const p95 = v.sex === 'male' ? maleP95 : femP95;
      const p3 = p5 - 0.5;
      const p97 = p95 + 1.5;
      let category: string, percentileApprox: string;
      if (bmi < p3) {
        category = 'Underweight (<3rd %ile)';
        percentileApprox = '<3rd';
      } else if (bmi < p5) {
        category = 'Underweight (3rd–5th %ile)';
        percentileApprox = '3rd–5th';
      } else if (bmi < p85) {
        category = 'Healthy Weight (5th–85th %ile)';
        percentileApprox = '5th–85th';
      } else if (bmi < p95) {
        category = 'Overweight (85th–95th %ile)';
        percentileApprox = '85th–95th';
      } else if (bmi < p97) {
        category = 'Obese (≥95th %ile)';
        percentileApprox = '≥95th';
      } else {
        category = 'Severely Obese (≥97th %ile)';
        percentileApprox = '≥97th';
      }
      const risk: CalculationResult['risk'] =
        bmi < p3
          ? 'high'
          : bmi < p5
            ? 'moderate'
            : bmi < p85
              ? 'low'
              : bmi < p95
                ? 'moderate'
                : 'high';
      return {
        label: 'BMI',
        value: bmi.toFixed(1),
        unit: 'kg/m²',
        interpretation: `BMI ${bmi.toFixed(1)} kg/m² for a ${age}-year-old ${v.sex} — approximately ${percentileApprox} percentile (CDC 2000). Category: ${category}.`,
        risk,
        riskPercentage: `~${percentileApprox} %ile | ${category}`,
        guidelineSource: 'CDC Growth Charts 2000 / AAP Obesity Guidelines 2023',
        scoreBreakdown: [
          {
            component: 'Weight',
            score: v.unit_sys === 'lbs' ? rawW + ' lbs = ' + w.toFixed(1) + ' kg' : w + ' kg',
          },
          { component: 'Height', score: h + ' cm' },
          { component: 'Age', score: age + ' years' },
          { component: 'Sex', score: String(v.sex) },
          { component: 'BMI', score: bmi.toFixed(1) + ' kg/m²' },
          { component: 'CDC 5th %ile reference', score: p5.toFixed(1) + ' kg/m²' },
          { component: 'CDC 85th %ile reference', score: p85.toFixed(1) + ' kg/m²' },
          { component: 'CDC 95th %ile reference', score: p95.toFixed(1) + ' kg/m²' },
          { component: 'Approximate %ile Category', score: percentileApprox },
          { component: 'CDC Classification', score: category },
        ],
        details: [
          `BMI ${bmi.toFixed(1)} kg/m² — ${category}`,
          bmi < p5
            ? '→ Underweight: evaluate for nutritional deficiency, eating disorder, chronic illness, malabsorption'
            : '',
          bmi >= p85 && bmi < p95
            ? '→ Overweight: lifestyle counseling, dietary review, screen for metabolic complications'
            : '',
          bmi >= p95
            ? '→ Obesity (≥95th %ile): formal evaluation for comorbidities (hypertension, dyslipidemia, pre-diabetes, sleep apnea, NAFLD)'
            : '',
          bmi >= p97
            ? '→ Severe Obesity (≥97th %ile): consider intensive health behavior intervention; refer to pediatric weight management program'
            : '',
          '→ AAP 2023: Early intensive behavioral intervention recommended for obesity — includes dietitian, exercise, behavioral therapy',
          '→ Ages 0–2: use WHO 2006 Growth Standards (weight-for-length) rather than BMI-for-age',
          '→ Plot on CDC growth chart at every well-child visit; serial measurements more informative than single value',
          '→ BMI percentile is NOT the same as adult BMI categories — do not apply adult thresholds to children',
        ].filter(Boolean),
      };
    },
  },

  // ── 2. Pediatric Fever Dosing ─────────────────────────────────────────
  {
    id: 'fever-dose-med',
    name: 'Pediatric Fever Dosing',
    category: 'Pediatrics',
    icon: '🌡️',
    description:
      'Weight-based acetaminophen and ibuprofen dosing for pediatric fever. Calculates safe dose, maximum dose cap, frequency, and product concentration with age-specific restrictions.',
    formula:
      'Acetaminophen: 10–15 mg/kg Q4–6h (max 75 mg/kg/day or 4000 mg/day) | Ibuprofen (≥6 mo): 5–10 mg/kg Q6–8h (max 40 mg/kg/day)',
    reference:
      'AAP Clinical Practice Guidelines — Fever 2011 / BNF for Children 2023 / Pediatrics in Review 2022',
    inputs: [
      {
        id: 'weight',
        label: 'Child Weight',
        type: 'number',
        unit: 'kg',
        min: 3,
        max: 70,
        step: 0.1,
        defaultValue: 20,
        placeholder: 'e.g. 20',
      },
      {
        id: 'age_months',
        label: 'Age',
        type: 'number',
        unit: 'months',
        min: 2,
        max: 216,
        defaultValue: 48,
        placeholder: 'e.g. 48 (4 years)',
      },
      {
        id: 'temp_c',
        label: 'Current Temperature',
        type: 'number',
        unit: '°C',
        min: 36,
        max: 42,
        step: 0.1,
        defaultValue: 38.5,
        placeholder: 'e.g. 38.5',
      },
      {
        id: 'weight_unit',
        label: 'Weight Unit',
        type: 'select',
        options: [
          { label: 'kg', value: 'kg' },
          { label: 'lbs (convert)', value: 'lbs' },
        ],
        defaultValue: 'kg',
      },
    ],
    calculate(v) {
      const rawW = Number(v.weight);
      const w = v.weight_unit === 'lbs' ? rawW * 0.4536 : rawW;
      const ageM = Number(v.age_months),
        temp = Number(v.temp_c);
      // Acetaminophen: 15 mg/kg Q4–6h, max 1000 mg/dose, max 75 mg/kg/day
      const apapDose = Math.min(1000, w * 15);
      const apapMaxDay = Math.min(4000, w * 75);
      // Ibuprofen (≥6 months): 10 mg/kg Q6–8h, max 400 mg/dose, max 40 mg/kg/day
      const ibuOk = ageM >= 6;
      const ibuDose = ibuOk ? Math.min(400, w * 10) : null;
      const ibuMaxDay = ibuOk ? Math.min(2400, w * 40) : null;
      // Liquid concentrations
      const apapConc160 = ((apapDose / 160) * 5).toFixed(1); // 160mg/5mL
      const ibuConc100 = ibuDose !== null ? ((ibuDose / 100) * 5).toFixed(1) : null; // 100mg/5mL
      const risk: CalculationResult['risk'] =
        temp >= 39.5 ? 'high' : temp >= 38.5 ? 'moderate' : 'low';
      const neonateAlert = ageM < 3;
      return {
        label: 'Acetaminophen Dose',
        value: apapDose.toFixed(0),
        unit: 'mg Q4–6h',
        interpretation: `Acetaminophen: ${apapDose.toFixed(0)} mg Q4–6h (max ${apapMaxDay.toFixed(0)} mg/day). ${ibuDose !== null ? `Ibuprofen: ${ibuDose.toFixed(0)} mg Q6–8h (max ${ibuMaxDay !== null ? ibuMaxDay.toFixed(0) : '—'} mg/day).` : ageM < 6 ? 'Ibuprofen: NOT recommended under 6 months.' : ''}${neonateAlert ? ' ⚠️ Age <3 months — fever requires URGENT medical evaluation regardless of dose.' : ''}`,
        risk,
        riskPercentage: `Temp: ${temp}°C | Wt: ${w.toFixed(1)} kg | Age: ${ageM} months`,
        guidelineSource: 'AAP Fever Guidelines 2011 / BNF for Children 2023',
        scoreBreakdown: [
          {
            component: 'Weight',
            score: (v.weight_unit === 'lbs' ? rawW + ' lbs = ' : '') + w.toFixed(1) + ' kg',
          },
          {
            component: 'Age',
            score: ageM + ' months (' + Math.floor(ageM / 12) + 'y ' + (ageM % 12) + 'm)',
          },
          {
            component: 'Temperature',
            score: temp + '°C (' + ((temp * 9) / 5 + 32).toFixed(1) + '°F)',
          },
          { component: 'Acetaminophen Dose', score: apapDose.toFixed(0) + ' mg Q4–6h' },
          {
            component: 'Acetaminophen Max/Day',
            score: apapMaxDay.toFixed(0) + ' mg/day (5 doses max)',
          },
          { component: "Liquid 160mg/5mL (Children's)", score: apapConc160 + ' mL per dose' },
          {
            component: 'Ibuprofen (≥6 months)',
            score: ibuOk ? ibuDose!.toFixed(0) + ' mg Q6–8h' : 'Not recommended <6 months',
          },
          {
            component: 'Ibuprofen Max/Day',
            score: ibuOk ? ibuMaxDay!.toFixed(0) + ' mg/day' : 'N/A',
          },
          {
            component: 'Ibuprofen Liquid 100mg/5mL',
            score: ibuConc100 !== null ? ibuConc100 + ' mL per dose' : 'N/A',
          },
          {
            component: 'Age Alert',
            score: neonateAlert
              ? '⚠️ <3 months — emergency evaluation'
              : 'Routine fever management appropriate',
          },
        ],
        details: [
          neonateAlert
            ? '🚨 Fever in child <3 months: URGENT medical evaluation — do not treat and monitor at home'
            : '',
          `→ Acetaminophen: ${apapDose.toFixed(0)} mg Q4–6h | Max ${apapMaxDay.toFixed(0)} mg/day | Never exceed 5 doses/24h`,
          `→ Children's liquid 160mg/5mL: ${apapConc160} mL per dose`,
          ibuOk
            ? `→ Ibuprofen: ${ibuDose!.toFixed(0)} mg Q6–8h | Max ${ibuMaxDay!.toFixed(0)} mg/day | Avoid in dehydration, renal impairment, varicella`
            : '→ Ibuprofen: Not licensed <6 months — acetaminophen only',
          "→ NEVER give aspirin to children with viral illness — Reye's syndrome risk",
          '→ Do not alternate acetaminophen and ibuprofen routinely — AAP does not recommend this practice',
          '→ Ensure adequate hydration alongside antipyretic use',
          '→ Check all multi-symptom products for hidden acetaminophen to prevent inadvertent overdose',
          '→ Fever ≥39.5°C persistent >48h or any fever with non-blanching rash, stiff neck, or ill appearance: emergency evaluation',
        ].filter(Boolean),
      };
    },
  },

  // ── 3. Holliday-Segar Maintenance Fluids ─────────────────────────────
  {
    id: 'holliday-segar-maintenance-fluid',
    name: 'Holliday-Segar Maintenance Fluids',
    category: 'Pediatrics',
    icon: '💧',
    description:
      'Pediatric maintenance IV fluid rate using the 4-2-1 rule (Holliday-Segar method). Outputs hourly AND daily volumes with fluid type guidance and restriction condition flags.',
    formula:
      '4 mL/kg/hr for first 10 kg + 2 mL/kg/hr for next 10 kg + 1 mL/kg/hr for every kg thereafter',
    reference:
      'Holliday MA, Segar WE. Pediatrics 1957 / NICE Guideline NG29 (2015) / PALS Guidelines 2020',
    inputs: [
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        unit: 'kg',
        min: 1,
        max: 80,
        step: 0.1,
        defaultValue: 20,
        placeholder: 'e.g. 20',
      },
      {
        id: 'condition',
        label: 'Clinical Condition',
        type: 'select',
        options: [
          { label: 'Standard maintenance', value: 'standard' },
          { label: 'Post-operative (restrict to 2/3)', value: 'postop' },
          { label: 'Meningitis / CNS disease (restrict to 2/3)', value: 'cns' },
          { label: 'Burns / GI losses (increase 1.5×)', value: 'burns' },
          { label: 'Premature neonate (<37 wks)', value: 'preterm' },
        ],
        defaultValue: 'standard',
      },
      {
        id: 'fluid_type',
        label: 'Preferred Fluid',
        type: 'select',
        options: [
          { label: 'D5 0.45% NaCl + 20 mEq/L KCl (standard)', value: 'd5_half' },
          { label: '0.9% NaCl (isotonic)', value: 'ns' },
          { label: "Lactated Ringer's", value: 'lr' },
          { label: 'D10W (neonates)', value: 'd10' },
        ],
        defaultValue: 'd5_half',
      },
    ],
    calculate(v) {
      const w = Number(v.weight);
      let baseRate: number;
      if (w <= 10) baseRate = 4 * w;
      else if (w <= 20) baseRate = 40 + 2 * (w - 10);
      else baseRate = 60 + (w - 20);
      // Apply condition modifier
      const modifier =
        v.condition === 'postop' || v.condition === 'cns'
          ? 2 / 3
          : v.condition === 'burns'
            ? 1.5
            : v.condition === 'preterm'
              ? 1.2
              : 1;
      const adjustedRate = baseRate * modifier;
      const dailyVol = adjustedRate * 24;
      const risk: CalculationResult['risk'] = 'low';
      const fluidTypeLabel: Record<string, string> = {
        d5_half: 'D5 0.45% NaCl + 20 mEq/L KCl',
        ns: '0.9% NaCl (isotonic saline)',
        lr: "Lactated Ringer's (balanced crystalloid)",
        d10: 'D10W (neonatal glucose support)',
      };
      const conditionNote: Record<string, string> = {
        standard: 'Standard 4-2-1 rule applied.',
        postop: '⚠️ Post-operative: reduced to 2/3 maintenance — SIADH risk.',
        cns: '⚠️ CNS disease: reduced to 2/3 maintenance — cerebral edema risk.',
        burns:
          '⚠️ Burns/GI losses: increased to 1.5× — add replacement for ongoing losses separately.',
        preterm:
          '⚠️ Preterm neonate: 120% of standard — insensible losses higher; adjust based on serum Na.',
      };
      return {
        label: 'Maintenance Rate',
        value: adjustedRate.toFixed(1),
        unit: 'mL/hr',
        interpretation: `${adjustedRate.toFixed(1)} mL/hr (${dailyVol.toFixed(0)} mL/day). ${conditionNote[String(v.condition)]} Fluid: ${fluidTypeLabel[String(v.fluid_type)]}`,
        risk,
        riskPercentage: `${adjustedRate.toFixed(1)} mL/hr | ${dailyVol.toFixed(0)} mL/day`,
        guidelineSource: 'Holliday MA, Segar WE. Pediatrics 1957 / NICE NG29 2015',
        scoreBreakdown: [
          { component: 'Weight', score: w + ' kg' },
          { component: 'Base Rate (4-2-1)', score: baseRate.toFixed(1) + ' mL/hr' },
          {
            component: 'Condition Modifier',
            score:
              modifier === 1
                ? 'None (1×)'
                : (modifier * 100).toFixed(0) + '% (×' + modifier.toFixed(2) + ')',
          },
          { component: 'Adjusted Rate', score: adjustedRate.toFixed(1) + ' mL/hr' },
          { component: 'Daily Volume', score: dailyVol.toFixed(0) + ' mL/day' },
          { component: 'Hourly Volume', score: adjustedRate.toFixed(1) + ' mL/hr' },
          { component: 'Fluid Type', score: fluidTypeLabel[String(v.fluid_type)] },
          { component: 'Clinical Condition', score: conditionNote[String(v.condition)] },
        ],
        details: [
          `→ Maintenance: ${adjustedRate.toFixed(1)} mL/hr | ${dailyVol.toFixed(0)} mL/day`,
          '→ Ensure urine output confirmed before adding KCl to maintenance fluids',
          v.condition === 'postop' || v.condition === 'cns'
            ? '→ Reduced maintenance: hypotonic fluids risk hyponatremia post-operatively — use isotonic where possible'
            : '',
          '→ Holliday-Segar provides maintenance estimate only — does NOT account for deficit or ongoing losses',
          '→ Deficit replacement: calculated separately for dehydration (mild 5%, moderate 10%, severe 15% of body weight)',
          '→ Burns: add Parkland formula resuscitation separately (3–4 mL/kg/% TBSA for pediatrics)',
          '→ Monitor: serum electrolytes, fluid balance, weight daily in hospitalized children',
          "→ NICE 2015: isotonic fluids (0.9% NaCl or Hartmann's) recommended for most pediatric maintenance to prevent iatrogenic hyponatremia",
        ].filter(Boolean),
      };
    },
  },

  // ── 4. Corrected Gestational Age ──────────────────────────────────────
  {
    id: 'corrected-gestational-age-calculator',
    name: 'Corrected Gestational Age',
    category: 'Pediatrics',
    icon: '🗓️',
    description:
      'Calculate corrected (adjusted) gestational age for premature infants. Used for appropriate developmental milestone assessment, growth plotting, and vaccine timing.',
    formula:
      'Corrected Age (weeks) = Chronological Age (weeks) − Weeks Premature | Weeks Premature = 40 − GA at birth',
    reference:
      'AAP Committee on Fetus and Newborn. Pediatrics 2004 / WHO Growth Standards Application Guide',
    inputs: [
      {
        id: 'dob_weeks',
        label: 'Chronological Age',
        type: 'number',
        unit: 'weeks',
        min: 0,
        max: 260,
        defaultValue: 20,
        placeholder: 'e.g. 20 weeks since birth',
      },
      {
        id: 'ga_at_birth',
        label: 'Gestational Age at Birth',
        type: 'number',
        unit: 'weeks',
        min: 23,
        max: 40,
        step: 0.5,
        defaultValue: 32,
        placeholder: 'e.g. 32 (28–36 = premature)',
      },
    ],
    calculate(v) {
      const chronoWeeks = Number(v.dob_weeks);
      const gaAtBirth = Number(v.ga_at_birth);
      const weeksPreterm = 40 - gaAtBirth;
      const correctedWeeks = Math.max(0, chronoWeeks - weeksPreterm);
      const correctedMonths = correctedWeeks / 4.345;
      const chronoMonths = chronoWeeks / 4.345;
      const useCorrection = correctedWeeks < 104; // use until age 2 corrected
      const risk: CalculationResult['risk'] =
        gaAtBirth < 28 ? 'high' : gaAtBirth < 32 ? 'moderate' : gaAtBirth < 37 ? 'low' : 'low';
      const prematurityClass =
        gaAtBirth < 28
          ? 'Extremely premature'
          : gaAtBirth < 32
            ? 'Very premature'
            : gaAtBirth < 34
              ? 'Moderately premature'
              : gaAtBirth < 37
                ? 'Late premature (near-term)'
                : 'Term';
      return {
        label: 'Corrected Age',
        value: correctedWeeks.toFixed(0),
        unit: 'weeks',
        interpretation: `Corrected age: ${correctedWeeks.toFixed(0)} weeks (~${correctedMonths.toFixed(1)} months). Chronological age: ${chronoWeeks} weeks (~${chronoMonths.toFixed(1)} months). Born ${weeksPreterm} weeks early (${prematurityClass}). ${useCorrection ? 'Use corrected age for developmental milestones until age 2.' : 'Correction no longer required (corrected age ≥2 years).'}`,
        risk,
        riskPercentage: `Corrected: ${correctedMonths.toFixed(1)} months | Chronological: ${chronoMonths.toFixed(1)} months`,
        guidelineSource: 'AAP Committee on Fetus and Newborn. Pediatrics 2004',
        scoreBreakdown: [
          { component: 'Gestational Age at Birth', score: gaAtBirth + ' weeks' },
          { component: 'Prematurity Classification', score: prematurityClass },
          { component: 'Weeks Premature (40–GA)', score: weeksPreterm.toFixed(1) + ' weeks' },
          {
            component: 'Chronological Age',
            score: chronoWeeks + ' weeks (' + chronoMonths.toFixed(1) + ' months)',
          },
          {
            component: 'Corrected Age',
            score: correctedWeeks.toFixed(0) + ' weeks (' + correctedMonths.toFixed(1) + ' months)',
          },
          {
            component: 'Correction Required?',
            score: useCorrection
              ? 'Yes — until corrected age 2 years'
              : 'No — corrected age ≥2 years',
          },
          {
            component: 'Developmental Milestones',
            score: 'Assess by CORRECTED age, not chronological age',
          },
          { component: 'Growth Plotting', score: 'Use corrected age on WHO/CDC growth charts' },
        ],
        details: [
          `Born at ${gaAtBirth} weeks — ${weeksPreterm} weeks premature (${prematurityClass})`,
          `Corrected age: ${correctedWeeks.toFixed(0)} weeks (${correctedMonths.toFixed(1)} months) vs chronological ${chronoWeeks} weeks`,
          useCorrection
            ? '→ Use CORRECTED age for: developmental milestone screening, growth chart plotting, physical exam norms'
            : '→ Correction no longer required after corrected age 2 years',
          '→ Vaccines: use CHRONOLOGICAL age for vaccine timing (not corrected age) — exception: Hepatitis B series for very low birth weight infants',
          gaAtBirth < 32
            ? '→ Very premature (<32 wks): high risk for cognitive, motor, vision, hearing, and social-emotional developmental delays — formal developmental follow-up'
            : '',
          '→ Plot on CDC/WHO charts using corrected age — weight below 10th %ile on corrected age warrants nutritional evaluation',
          '→ Continue correcting until 2–3 years corrected age for milestones in extremely premature infants',
          '→ Retinopathy of prematurity (ROP) screening: <30 wks GA or <1500g — ophthalmology referral at 4–6 weeks chronological age',
        ].filter(Boolean),
      };
    },
  },

  // ── 5. Pediatric ETT Size & Depth ─────────────────────────────────────
  {
    id: 'pediatric-ett-size-depth',
    name: 'Pediatric ETT Size & Depth',
    category: 'Pediatrics',
    icon: '🫁',
    description:
      'Calculate pediatric endotracheal tube (ETT) uncuffed and cuffed size, insertion depth at lip, suction catheter size, and laryngoscope blade selection. Based on AHA PALS 2020 guidelines.',
    formula:
      'Uncuffed ID (mm) = (Age/4) + 4 | Cuffed ID (mm) = (Age/4) + 3.5 | Depth (cm) = Tube ID × 3 OR Age/2 + 12',
    reference: 'AHA PALS 2020 / Broselow Tape / Khine et al. Anesthesiology 1997',
    inputs: [
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 0,
        max: 12,
        step: 0.5,
        defaultValue: 4,
        placeholder: 'e.g. 4 (use 0 for neonate)',
      },
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        unit: 'kg',
        min: 1,
        max: 50,
        step: 0.5,
        defaultValue: 16,
        placeholder: 'e.g. 16',
      },
      {
        id: 'use_cuffed',
        label: 'ETT Type',
        type: 'select',
        options: [
          { label: 'Uncuffed (traditional <8y)', value: 'uncuffed' },
          { label: 'Cuffed (acceptable all ages per PALS 2020)', value: 'cuffed' },
        ],
        defaultValue: 'cuffed',
      },
    ],
    calculate(v) {
      const age = Number(v.age),
        w = Number(v.weight);
      const uncuffedID = age / 4 + 4;
      const cuffedID = age / 4 + 3.5;
      const selectedID = v.use_cuffed === 'cuffed' ? cuffedID : uncuffedID;
      // Depth at lip: Tube ID × 3 (commonly used) OR age/2 + 12
      const depthByID = Math.round(selectedID * 3);
      const depthByAge = Math.round(age / 2 + 12);
      const depth = Math.round((depthByID + depthByAge) / 2); // average of two methods
      // Suction catheter French size ≈ (ETT ID × 2) + 2
      const suctionCath = Math.round(selectedID * 2) + 2;
      // Laryngoscope blade
      const blade =
        age < 1
          ? 'Miller 0–1'
          : age < 2
            ? 'Miller 1'
            : age < 6
              ? 'Miller 1–2 or Mac 1'
              : age < 8
                ? 'Mac 2'
                : 'Mac 2–3';
      // LMA size by weight
      const lma = w < 5 ? '1' : w < 10 ? '1.5' : w < 20 ? '2' : w < 30 ? '2.5' : '3';
      // Neonatal ETT (age 0)
      const isNeonate = age <= 0;
      const neoSize =
        w < 1.0
          ? '2.5 uncuffed'
          : w < 2.0
            ? '3.0 uncuffed'
            : w < 3.5
              ? '3.0–3.5 uncuffed'
              : '3.5 uncuffed';
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: v.use_cuffed === 'cuffed' ? 'Cuffed ETT ID' : 'Uncuffed ETT ID',
        value: isNeonate ? neoSize : selectedID.toFixed(1),
        unit: isNeonate ? '' : 'mm',
        interpretation: isNeonate
          ? `Neonate (wt ${w}kg): ETT ${neoSize}. Depth at lip: ~${(w + 6).toFixed(0)} cm (weight + 6 rule). Suction: 6–8 Fr.`
          : `${v.use_cuffed === 'cuffed' ? 'Cuffed' : 'Uncuffed'} ETT: ${selectedID.toFixed(1)} mm ID (range ${(selectedID - 0.5).toFixed(1)}–${(selectedID + 0.5).toFixed(1)}). Depth at lip: ~${depth} cm. Suction catheter: ${suctionCath} Fr.`,
        risk,
        riskPercentage: `ETT: ${isNeonate ? neoSize : selectedID.toFixed(1) + ' mm'} | Depth: ${isNeonate ? (w + 6).toFixed(0) : depth} cm`,
        guidelineSource: 'AHA PALS 2020 / Khine et al. Anesthesiology 1997',
        scoreBreakdown: [
          { component: 'Age', score: age + ' years' },
          { component: 'Weight', score: w + ' kg' },
          {
            component: 'Uncuffed ETT Size',
            score: isNeonate ? neoSize : uncuffedID.toFixed(1) + ' mm ID',
          },
          {
            component: 'Cuffed ETT Size',
            score: isNeonate ? 'N/A (use uncuffed in neonates)' : cuffedID.toFixed(1) + ' mm ID',
          },
          {
            component: 'Selected ETT',
            score: isNeonate ? neoSize : selectedID.toFixed(1) + ' mm (' + v.use_cuffed + ')',
          },
          {
            component: 'Consider Also',
            score: isNeonate
              ? 'N/A'
              : `${(selectedID - 0.5).toFixed(1)} mm and ${(selectedID + 0.5).toFixed(1)} mm sizes`,
          },
          { component: 'Depth at Lip (ID×3)', score: depthByID + ' cm' },
          { component: 'Depth at Lip (Age/2+12)', score: depthByAge + ' cm' },
          {
            component: 'Recommended Depth',
            score: '~' + depth + ' cm (average — confirm with CXR)',
          },
          { component: 'Suction Catheter', score: suctionCath + ' Fr' },
          { component: 'Laryngoscope Blade', score: blade },
          { component: 'LMA Size (by weight)', score: lma },
        ],
        details: [
          `ETT ${selectedID.toFixed(1)} mm | Depth ~${depth} cm | Suction ${suctionCath} Fr | Blade: ${blade}`,
          '→ ALWAYS have one size smaller (−0.5 mm) and one size larger (+0.5 mm) available',
          '→ Cuffed ETTs are acceptable for all pediatric ages per AHA PALS 2020 — cuff pressure ≤20 cmH₂O',
          '→ Confirm ETT position: auscultate bilaterally, CO2 waveform capnography, CXR (tip at T3–T4, ~2cm above carina)',
          '→ Neonates: depth at lip ≈ weight (kg) + 6 cm — e.g., 3 kg infant → 9 cm at lip',
          '→ Broselow tape provides weight-based sizing — use for all pediatric resuscitations',
          '→ Rapid Sequence Intubation (RSI): atropine 0.01–0.02 mg/kg IV (min 0.1 mg) before succinylcholine in children <1 year to prevent bradycardia',
          '→ Video laryngoscopy increasingly used in pediatric intubation — improves first-pass success',
        ],
      };
    },
  },

  // ── 6. Neonatal Jaundice Risk (Bhutani) ──────────────────────────────
  {
    id: 'neonatal-jaundice-bhutani',
    name: 'Neonatal Jaundice Risk (Bhutani)',
    category: 'Pediatrics',
    icon: '🌟',
    description:
      'Plot total serum bilirubin (TSB) on the Bhutani nomogram to determine risk zone and phototherapy/exchange transfusion thresholds by gestational age and postnatal age.',
    formula:
      'Bhutani VK et al. 1999 Nomogram: TSB vs postnatal age in hours — Low / Low-Intermediate / High-Intermediate / High Risk Zones',
    reference:
      'Bhutani VK et al. Pediatrics 1999 / AAP Clinical Practice Guideline — Hyperbilirubinemia 2022',
    inputs: [
      {
        id: 'tsb',
        label: 'Total Serum Bilirubin (TSB)',
        type: 'number',
        unit: 'mg/dL',
        min: 0.5,
        max: 35,
        step: 0.1,
        defaultValue: 8.0,
        placeholder: 'e.g. 8.0',
      },
      {
        id: 'age_hours',
        label: 'Postnatal Age',
        type: 'number',
        unit: 'hours',
        min: 12,
        max: 168,
        defaultValue: 48,
        placeholder: 'e.g. 48 (2 days)',
      },
      {
        id: 'ga',
        label: 'Gestational Age at Birth',
        type: 'number',
        unit: 'weeks',
        min: 35,
        max: 42,
        step: 0.5,
        defaultValue: 39,
        placeholder: 'e.g. 39',
      },
      {
        id: 'risk_factors',
        label: 'Neurotoxicity Risk Factors',
        type: 'select',
        options: [
          { label: 'None / Low risk (≥38 wks, no risk factors)', value: 'low' },
          {
            label: 'Medium risk (≥38 wks + risk factors OR 35–37⁶⁄₇ wks without risk factors)',
            value: 'medium',
          },
          { label: 'High risk (35–37⁶⁄₇ wks + risk factors)', value: 'high' },
        ],
        defaultValue: 'low',
      },
    ],
    calculate(v) {
      const tsb = Number(v.tsb),
        hours = Number(v.age_hours);
      const ga = Number(v.ga);
      // Bhutani nomogram approximate zone thresholds at given hours
      // High-risk zone boundary ≈ 95th percentile
      const high95th = hours <= 24 ? 11 : hours <= 48 ? 14 : hours <= 72 ? 15.5 : 17;
      // High-intermediate zone boundary ≈ 75th percentile
      const hi75th = hours <= 24 ? 8.5 : hours <= 48 ? 11 : hours <= 72 ? 12.5 : 14;
      // Low-intermediate zone boundary ≈ 40th percentile
      const li40th = hours <= 24 ? 6 : hours <= 48 ? 8 : hours <= 72 ? 9.5 : 11;
      // Bhutani risk zone
      let zone: string;
      if (tsb >= high95th) zone = 'High Risk (≥95th %ile)';
      else if (tsb >= hi75th) zone = 'High-Intermediate Risk (75th–95th %ile)';
      else if (tsb >= li40th) zone = 'Low-Intermediate Risk (40th–75th %ile)';
      else zone = 'Low Risk (<40th %ile)';
      // AAP 2022 phototherapy thresholds (approximate, by GA and risk):
      const photoThresh =
        ga >= 38 && v.risk_factors === 'low'
          ? hours <= 24
            ? 12
            : hours <= 48
              ? 15
              : hours <= 72
                ? 18
                : 20
          : ga >= 38 && v.risk_factors === 'medium'
            ? hours <= 24
              ? 10
              : hours <= 48
                ? 13
                : hours <= 72
                  ? 15
                  : 17
            : hours <= 24
              ? 8
              : hours <= 48
                ? 11
                : hours <= 72
                  ? 13
                  : 15;
      const exchangeThresh = photoThresh + 5;
      const needsPhoto = tsb >= photoThresh;
      const needsExchange = tsb >= exchangeThresh;
      const risk: CalculationResult['risk'] =
        tsb >= exchangeThresh
          ? 'critical'
          : tsb >= photoThresh
            ? 'high'
            : tsb >= hi75th
              ? 'moderate'
              : 'low';
      return {
        label: 'Bhutani Zone',
        value: zone,
        unit: '',
        interpretation: `TSB ${tsb} mg/dL at ${hours}h of life (GA ${ga} wks) — ${zone}. Phototherapy threshold: ${photoThresh} mg/dL${needsPhoto ? ' — ⚠️ PHOTOTHERAPY INDICATED' : ''}. Exchange transfusion threshold: ${exchangeThresh} mg/dL${needsExchange ? ' — 🚨 EXCHANGE TRANSFUSION INDICATED' : ''}`,
        risk,
        riskPercentage: `TSB: ${tsb} mg/dL | Photo threshold: ${photoThresh} mg/dL | Exchange: ${exchangeThresh} mg/dL`,
        guidelineSource: 'Bhutani VK et al. Pediatrics 1999 / AAP Hyperbilirubinemia 2022',
        scoreBreakdown: [
          { component: 'Total Serum Bilirubin', score: tsb + ' mg/dL' },
          { component: 'Postnatal Age', score: hours + ' hours' },
          { component: 'Gestational Age', score: ga + ' weeks' },
          { component: 'Risk Factor Category', score: String(v.risk_factors) },
          { component: 'Bhutani Nomogram Zone', score: zone },
          { component: 'Phototherapy Threshold', score: photoThresh + ' mg/dL' },
          {
            component: 'TSB vs Photo Threshold',
            score:
              tsb >= photoThresh
                ? '⚠️ ABOVE — initiate phototherapy'
                : tsb >= photoThresh - 2
                  ? 'Approaching threshold — recheck in 4–6h'
                  : 'Below threshold',
          },
          { component: 'Exchange Transfusion Threshold', score: exchangeThresh + ' mg/dL' },
          {
            component: 'TSB vs Exchange Threshold',
            score:
              tsb >= exchangeThresh ? '🚨 ABOVE — urgent exchange transfusion' : 'Below threshold',
          },
          {
            component: 'Recheck Interval',
            score:
              tsb >= hi75th
                ? 'Check TSB every 4–6 hours'
                : tsb >= li40th
                  ? 'Check TSB in 8–12 hours'
                  : 'Routine follow-up 24–48 hours',
          },
        ],
        details: [
          needsExchange
            ? '🚨 EXCHANGE TRANSFUSION THRESHOLD MET — urgent neonatal/NICU consultation'
            : '',
          needsPhoto && !needsExchange
            ? '⚠️ Phototherapy indicated — initiate immediately per AAP 2022 guidelines'
            : '',
          `→ Phototherapy threshold (GA ${ga} wks, ${v.risk_factors} risk): ${photoThresh} mg/dL`,
          `→ Exchange transfusion threshold: ${exchangeThresh} mg/dL`,
          '→ Risk factors for neurotoxicity: isoimmune hemolytic disease, G6PD deficiency, asphyxia, sepsis, acidosis, albumin <3.0 g/dL',
          '→ Intensive phototherapy: multiple lights, ensure maximum skin exposure, cover eyes, monitor temperature',
          '→ Recheck TSB 4–6h after phototherapy initiation to confirm response',
          '→ Direct bilirubin >1 mg/dL or >20% of total: investigate cholestasis — phototherapy less effective',
          '→ Discharge planning: all neonates should be assessed before discharge; home phototherapy may be option for low-risk cases',
        ].filter(Boolean),
      };
    },
  },

  // ── 7. Vaccine Schedule Checker ───────────────────────────────────────
  {
    id: 'vaccine-schedule-checker',
    name: 'Vaccine Schedule Checker',
    category: 'Pediatrics',
    icon: '💉',
    description:
      'Age-appropriate vaccine recommendations per CDC ACIP 2024 schedule. Outputs due vaccines, catch-up flags, and high-risk additional vaccines for this age group.',
    formula: 'CDC ACIP Immunization Schedule for Persons Age 0–18 Years (2024)',
    reference: 'CDC ACIP Childhood/Adolescent Immunization Schedule 2024 / AAP Red Book 2024',
    inputs: [
      {
        id: 'age_months',
        label: "Child's Age",
        type: 'number',
        unit: 'months',
        min: 0,
        max: 216,
        defaultValue: 12,
        placeholder: 'e.g. 12 (1 year old)',
      },
      {
        id: 'prev_vaccines',
        label: 'Vaccination Status',
        type: 'select',
        options: [
          { label: 'Up-to-date (per schedule)', value: 'utd' },
          { label: 'Unknown / unvaccinated / behind', value: 'behind' },
          { label: 'Partial — some doses given', value: 'partial' },
        ],
        defaultValue: 'utd',
      },
      {
        id: 'high_risk',
        label: 'High-Risk Conditions',
        type: 'select',
        options: [
          { label: 'None / healthy child', value: 'none' },
          { label: 'Immunocompromised (HIV, cancer, transplant)', value: 'immunocomp' },
          { label: 'Asplenia / sickle cell disease', value: 'asplenia' },
          { label: 'Chronic lung / heart / liver / kidney disease', value: 'chronic' },
          { label: 'Diabetes', value: 'diabetes' },
        ],
        defaultValue: 'none',
      },
    ],
    calculate(v) {
      const m = Number(v.age_months);
      const isHighRisk = v.high_risk !== 'none';
      const isBehind = v.prev_vaccines !== 'utd';
      // Routine vaccines by age
      let vaccines: string[];
      let catchUp: string[] = [];
      if (m === 0) vaccines = ['HepB #1 (at birth)'];
      else if (m <= 2) vaccines = ['HepB #2', 'DTaP #1', 'Hib #1', 'PCV15 #1', 'IPV #1', 'RV #1'];
      else if (m <= 4) vaccines = ['DTaP #2', 'Hib #2', 'PCV15 #2', 'IPV #2', 'RV #2'];
      else if (m <= 6)
        vaccines = [
          'DTaP #3',
          'Hib #3 (if Hib-OMP)',
          'PCV15 #3',
          'IPV #3',
          'HepB #3',
          'RV #3',
          'Influenza (annual, 6+ months)',
        ];
      else if (m <= 12)
        vaccines = [
          'Influenza (annual)',
          'Hib booster (#3 or #4)',
          'PCV15 booster',
          'MMR #1',
          'Varicella #1',
          'HepA #1',
        ];
      else if (m <= 15)
        vaccines = [
          'DTaP #4',
          'Hib booster (if not done)',
          'PCV15 (if not done)',
          'HepA #2 (≥6 months after #1)',
        ];
      else if (m <= 18) vaccines = ['Influenza (annual)', 'HepA #2 (if not done)'];
      else if (m <= 23) vaccines = ['Influenza (annual)'];
      else if (m <= 48) vaccines = ['Influenza (annual)', 'HepA series (if not done)'];
      else if (m <= 72)
        vaccines = ['DTaP #5', 'IPV #4 (4–6y)', 'MMR #2', 'Varicella #2', 'Influenza (annual)'];
      else if (m <= 131)
        vaccines = [
          'Influenza (annual)',
          'Tdap (11–12y)',
          'HPV #1 (11–12y preferred)',
          'MenACWY #1 (11–12y)',
        ];
      else if (m <= 168)
        vaccines = [
          'HPV series (complete)',
          'MenACWY #2 (16y)',
          'Influenza (annual)',
          'COVID-19 (annual updated booster)',
        ];
      else
        vaccines = [
          'Influenza (annual)',
          'COVID-19 (annual)',
          'MenB (16–23y, shared decision)',
          'Tdap (if not done in 10y)',
        ];
      // Catch-up flags
      if (isBehind) {
        catchUp = [
          'Review complete vaccination history — initiate catch-up schedule per CDC',
          'Most vaccines do not require restarting the series — continue from where left off',
          `Use CDC catch-up schedule at: cdc.gov/vaccines/schedules/hcp/imz/catchup.html`,
          m >= 12
            ? 'Minimum intervals apply — do not give doses more frequently than minimum intervals'
            : '',
        ].filter(Boolean);
      }
      // High-risk additions
      const highRiskVaccines: string[] = [];
      if (v.high_risk === 'immunocomp')
        highRiskVaccines.push(
          'PCV15/PCV20 additional dose',
          'PPSV23 (≥2y)',
          'Influenza (inactivated only — no live vaccines)',
          'Avoid MMR and Varicella if severely immunocompromised'
        );
      if (v.high_risk === 'asplenia')
        highRiskVaccines.push(
          'PCV20 + PPSV23 series',
          'MenACWY (2 doses 8-12 wks apart, then Q5y booster)',
          'MenB series (10–25y)',
          'Hib (if not previously vaccinated)'
        );
      if (v.high_risk === 'chronic')
        highRiskVaccines.push(
          'Influenza (annual)',
          'PCV15/PCV20 + PPSV23',
          'HepA series',
          'HepB series (if not done)'
        );
      if (v.high_risk === 'diabetes')
        highRiskVaccines.push('Influenza (annual)', 'PCV15/PCV20', 'HepB series (if not done)');
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: 'Vaccines Due',
        value: vaccines.length,
        unit: 'vaccines',
        interpretation: `Age ${m} months: ${vaccines.length} routine vaccine(s) due. ${isBehind ? '⚠️ Child may be behind — catch-up schedule required.' : ''}${isHighRisk ? ' Additional high-risk vaccines indicated.' : ''}`,
        risk,
        riskPercentage: `${m} months | ${vaccines.length} vaccines due`,
        guidelineSource: 'CDC ACIP Childhood Immunization Schedule 2024 / AAP Red Book 2024',
        scoreBreakdown: [
          {
            component: 'Age',
            score: m + ' months (' + Math.floor(m / 12) + 'y ' + (m % 12) + 'm)',
          },
          { component: 'Vaccination Status', score: String(v.prev_vaccines) },
          { component: 'High-Risk Condition', score: String(v.high_risk) },
          { component: 'Routine Vaccines Due', score: vaccines.join(' | ') },
          {
            component: 'Catch-Up Required?',
            score: isBehind ? 'YES — review full history' : 'No (up to date)',
          },
          {
            component: 'High-Risk Additional',
            score: highRiskVaccines.length > 0 ? highRiskVaccines.join('; ') : 'None',
          },
        ],
        details: [
          `Age ${m} months — routine vaccines: ${vaccines.join(', ')}`,
          ...catchUp,
          ...highRiskVaccines.map((v) => '→ High-risk: ' + v),
          '→ Live vaccines (MMR, Varicella, LAIV): contraindicated in immunocompromised patients',
          '→ Fever is NOT a contraindication to vaccination — mild illness may proceed',
          '→ Observe 15 minutes post-vaccination for anaphylaxis (30 minutes if prior anaphylaxis)',
          '→ VIS (Vaccine Information Statement) required to be given before each vaccine',
          '→ Document lot numbers, manufacturer, site, and administrator for all vaccines',
        ],
      };
    },
  },

  // ── 8. Child Growth Percentile ────────────────────────────────────────
  {
    id: 'child-growth-percentile',
    name: 'Child Growth Percentile',
    category: 'Pediatrics',
    icon: '📏',
    description:
      'Estimate height, weight, and head circumference percentiles for age and sex using WHO 2006 (0–2 years) and CDC 2000 (2–20 years) growth standards. Flags extreme percentiles for clinical review.',
    formula:
      'LMS method: Z = [(value/M)^L − 1] / (L × S) → Percentile | WHO 2006 for 0–24 months; CDC 2000 for 2–20 years',
    reference:
      'WHO Child Growth Standards 2006 / CDC Growth Charts 2000 / de Onis M et al. Bull WHO 2007',
    inputs: [
      {
        id: 'measurement',
        label: 'Measurement Type',
        type: 'select',
        options: [
          { label: 'Height / Length (cm)', value: 'height' },
          { label: 'Weight (kg)', value: 'weight' },
          { label: 'Head Circumference (cm)', value: 'hc' },
          { label: 'Weight-for-Length (0–24 months)', value: 'wfl' },
        ],
        defaultValue: 'height',
      },
      {
        id: 'value',
        label: 'Measurement Value',
        type: 'number',
        unit: 'cm or kg',
        min: 1,
        max: 250,
        step: 0.1,
        defaultValue: 90,
        placeholder: 'e.g. 90 cm or 12 kg',
      },
      {
        id: 'age_months',
        label: 'Age',
        type: 'number',
        unit: 'months',
        min: 0,
        max: 240,
        defaultValue: 24,
        placeholder: 'e.g. 24',
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        defaultValue: 'male',
      },
    ],
    calculate(v) {
      const val = Number(v.value),
        m = Number(v.age_months);
      const isMale = v.sex === 'male';
      const useWHO = m <= 24;
      // Simplified median reference values (from WHO/CDC tables — M values)
      let median: number, sd: number;
      if (v.measurement === 'height') {
        median = isMale
          ? m <= 24
            ? 49.9 + 0.923 * m
            : 86 + 0.56 * (m - 24)
          : m <= 24
            ? 49.1 + 0.902 * m
            : 85 + 0.55 * (m - 24);
        sd = isMale ? 2.5 : 2.4;
      } else if (v.measurement === 'weight') {
        median = isMale
          ? m <= 24
            ? 3.35 + 0.275 * m
            : 12.5 + 0.175 * (m - 24)
          : m <= 24
            ? 3.23 + 0.257 * m
            : 12.0 + 0.165 * (m - 24);
        sd = median * 0.12;
      } else if (v.measurement === 'hc') {
        median = isMale
          ? m <= 24
            ? 34.5 + 0.47 * m
            : 49 + 0.05 * (m - 24)
          : m <= 24
            ? 33.9 + 0.46 * m
            : 48 + 0.05 * (m - 24);
        sd = 1.4;
      } else {
        // Weight-for-length (0–24 months): use weight as value, height as reference via simplified
        median = isMale ? 8.5 : 8.0;
        sd = 0.9;
      }
      const zScore = (val - median) / sd;
      // Convert Z to approximate percentile
      const phi = (z: number) => {
        const t = 1 / (1 + 0.2316419 * Math.abs(z));
        const d = 0.3989423 * Math.exp((-z * z) / 2);
        const p =
          d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return z >= 0 ? 1 - p : p;
      };
      const pctile = Math.round(phi(zScore) * 100);
      const pctileDisplay = Math.min(99, Math.max(1, pctile));
      // Risk flags
      const below3rd = zScore < -1.88; // ~3rd percentile
      const below5th = zScore < -1.645; // ~5th percentile
      const above95th = zScore > 1.645; // ~95th percentile
      const above97th = zScore > 1.88; // ~97th percentile
      const risk: CalculationResult['risk'] =
        below3rd || above97th ? 'high' : below5th || above95th ? 'moderate' : 'low';
      const chartSource = useWHO ? 'WHO 2006 Standards' : 'CDC 2000 Charts';
      return {
        label: 'Percentile',
        value: `~${pctileDisplay}th`,
        unit: '',
        interpretation: `${String(v.measurement).charAt(0).toUpperCase() + String(v.measurement).slice(1)} ${val} (${v.sex}, ${m} months): ~${pctileDisplay}th percentile. Z-score: ${zScore.toFixed(2)}. ${chartSource}. ${below3rd ? '⚠️ BELOW 3rd PERCENTILE — clinical evaluation recommended' : above97th ? '⚠️ ABOVE 97th PERCENTILE — clinical evaluation recommended' : below5th ? 'Below 5th %ile — monitor closely' : ''}`,
        risk,
        riskPercentage: `~${pctileDisplay}th %ile | Z-score: ${zScore.toFixed(2)}`,
        guidelineSource: 'WHO Child Growth Standards 2006 / CDC Growth Charts 2000',
        scoreBreakdown: [
          {
            component: 'Measurement',
            score:
              String(v.measurement) + ': ' + val + (v.measurement === 'weight' ? ' kg' : ' cm'),
          },
          {
            component: 'Age',
            score: m + ' months (' + Math.floor(m / 12) + 'y ' + (m % 12) + 'm)',
          },
          { component: 'Sex', score: String(v.sex) },
          { component: 'Chart Used', score: chartSource },
          {
            component: 'Reference Median (M)',
            score: median.toFixed(2) + (v.measurement === 'weight' ? ' kg' : ' cm'),
          },
          { component: 'Z-Score', score: zScore.toFixed(2) },
          { component: 'Approximate Percentile', score: '~' + pctileDisplay + 'th %ile' },
          {
            component: 'Clinical Flag',
            score: below3rd
              ? '⚠️ <3rd %ile — evaluation'
              : above97th
                ? '⚠️ >97th %ile — evaluation'
                : below5th
                  ? '<5th %ile — monitor'
                  : 'Normal range',
          },
        ],
        details: [
          `${String(v.measurement)} ~${pctileDisplay}th %ile (Z = ${zScore.toFixed(2)}) — ${chartSource}`,
          below3rd
            ? '⚠️ Below 3rd percentile: evaluate for growth failure, nutritional deficiency, chronic illness, endocrine disorder'
            : '',
          above97th
            ? '⚠️ Above 97th percentile: evaluate for obesity, endocrine excess, or familial tall stature'
            : '',
          '→ Ages 0–24 months: use WHO 2006 Growth Standards (breast-fed reference population)',
          '→ Ages 2–20 years: use CDC 2000 Growth Charts (US general population)',
          '→ Serial measurements are more informative than a single point — trend and crossing percentile lines is key',
          '→ Head circumference: measure at every well-child visit 0–24 months; microcephaly <3rd %ile, macrocephaly >97th %ile require evaluation',
          '→ Parental heights (mid-parental target height): boys = (Father + Mother + 13cm)/2 ± 8.5cm; girls = (Father + Mother − 13cm)/2 ± 8.5cm',
          '→ Note: Z-scores and percentiles derived from simplified LMS approximation — use official CDC/WHO software for precise values',
        ].filter(Boolean),
      };
    },
  },
];

export const wellnessConfigs: MedicalConfig[] = [
  // ── 1. Calorie Deficit Calculator ─────────────────────────────────────
  {
    id: 'calorie-deficit-calculator',
    name: 'Calorie Deficit Calculator',
    category: 'Wellness',
    icon: '🍎',
    description:
      'Calculate safe daily calorie deficit for weight loss goals. Outputs target daily intake, weekly deficit, projected timeline, and minimum safe calorie floor with lifestyle recommendations.',
    formula:
      '1 lb ≈ 3,500 kcal | Daily deficit = Weekly goal (lbs) × 3,500 / 7 | Target intake = TDEE − Daily deficit',
    reference:
      'Hall KD et al. Lancet 2011 / Dietary Guidelines for Americans 2020–2025 / WHO Obesity Prevention Report',
    inputs: [
      {
        id: 'tdee',
        label: 'TDEE (Total Daily Energy Expenditure)',
        type: 'number',
        unit: 'kcal/day',
        min: 1000,
        max: 6000,
        defaultValue: 2200,
        placeholder: 'e.g. 2200 (use TDEE calculator first)',
      },
      {
        id: 'goal_lbs_week',
        label: 'Weekly Weight Loss Goal',
        type: 'select',
        options: [
          { label: '0.25 lb/week (slow, sustainable)', value: 0.25 },
          { label: '0.5 lb/week (recommended for most)', value: 0.5 },
          { label: '1 lb/week (moderate)', value: 1 },
          { label: '1.5 lb/week (aggressive)', value: 1.5 },
          { label: '2 lb/week (maximum safe rate)', value: 2 },
        ],
        defaultValue: 0.5,
      },
      {
        id: 'current_weight',
        label: 'Current Weight',
        type: 'number',
        unit: 'lbs',
        min: 80,
        max: 600,
        defaultValue: 175,
        placeholder: 'e.g. 175',
      },
      {
        id: 'goal_weight',
        label: 'Goal Weight',
        type: 'number',
        unit: 'lbs',
        min: 80,
        max: 400,
        defaultValue: 155,
        placeholder: 'e.g. 155',
      },
    ],
    calculate(v) {
      const tdee = Number(v.tdee);
      const lbsPerWeek = Number(v.goal_lbs_week);
      const currentWt = Number(v.current_weight);
      const goalWt = Number(v.goal_weight);
      const dailyDeficit = (lbsPerWeek * 3500) / 7;
      const targetCalories = tdee - dailyDeficit;
      const totalLbs = currentWt - goalWt;
      const weeksToGoal = totalLbs > 0 ? Math.round(totalLbs / lbsPerWeek) : 0;
      const tooLow = targetCalories < 1200;
      const minCalories = 1200; // minimum for women; 1500 for men (simplified)
      const safeTarget = Math.max(minCalories, targetCalories);
      const safeLoss = tooLow ? (((tdee - minCalories) * 7) / 3500).toFixed(2) : null;
      const risk: CalculationResult['risk'] =
        targetCalories < 1000 ? 'high' : targetCalories < 1200 ? 'moderate' : 'low';
      return {
        label: 'Target Daily Calories',
        value: Math.round(safeTarget),
        unit: 'kcal/day',
        interpretation: `Daily target: ${Math.round(safeTarget)} kcal/day (deficit: ${Math.round(dailyDeficit)} kcal/day). ${tooLow ? `⚠️ Original target (${Math.round(targetCalories)} kcal) is below safe minimum — adjusted to ${minCalories} kcal (max safe loss ≈${safeLoss} lbs/week).` : ''} ${totalLbs > 0 ? `Estimated ${weeksToGoal} weeks to reach goal weight of ${goalWt} lbs.` : 'Goal weight already met or exceeded.'}`,
        risk,
        riskPercentage: `${Math.round(dailyDeficit)} kcal/day deficit | ~${lbsPerWeek} lbs/week`,
        guidelineSource: 'Hall KD et al. Lancet 2011 / USDA Dietary Guidelines 2020–2025',
        scoreBreakdown: [
          { component: 'TDEE (maintenance)', score: tdee + ' kcal/day' },
          { component: 'Goal loss rate', score: lbsPerWeek + ' lbs/week' },
          { component: 'Required daily deficit', score: Math.round(dailyDeficit) + ' kcal/day' },
          { component: 'Calculated target', score: Math.round(targetCalories) + ' kcal/day' },
          { component: 'Safe minimum floor', score: minCalories + ' kcal/day' },
          { component: 'Recommended target', score: Math.round(safeTarget) + ' kcal/day' },
          {
            component: 'Total weight to lose',
            score: totalLbs > 0 ? totalLbs + ' lbs' : 'Goal already met',
          },
          {
            component: 'Estimated timeline',
            score:
              totalLbs > 0
                ? weeksToGoal + ' weeks (~' + Math.round(weeksToGoal / 4.3) + ' months)'
                : 'N/A',
          },
          {
            component: 'Safety check',
            score: tooLow ? '⚠️ Adjusted — original target too low' : '✅ Safe range',
          },
        ],
        details: [
          `→ Target: ${Math.round(safeTarget)} kcal/day | Deficit: ${Math.round(dailyDeficit)} kcal/day | Rate: ~${lbsPerWeek} lbs/week`,
          tooLow
            ? `→ ⚠️ Never go below 1,200 kcal/day (women) or 1,500 kcal/day (men) without medical supervision`
            : '',
          `→ Realistic timeline to goal (${goalWt} lbs): approximately ${weeksToGoal} weeks`,
          '→ 80/20 rule: nutrition drives most weight loss; exercise is essential for maintaining lean mass and metabolic health',
          '→ Protein target: 0.7–1.0 g/lb goal body weight to preserve muscle during deficit',
          '→ Do NOT maintain a deficit continuously >12 weeks without a diet break — metabolic adaptation reduces TDEE over time',
          '→ Weight fluctuates ±2–4 lbs daily from water, food, hormones — track weekly averages not daily readings',
          '→ Consult a registered dietitian for personalized meal planning, especially if BMI >35 or medical conditions present',
        ].filter(Boolean),
      };
    },
  },

  // ── 2. Heart Rate Zone Calculator ────────────────────────────────────
  {
    id: 'heart-rate-zone-calculator',
    name: 'Heart Rate Zone Calculator',
    category: 'Wellness',
    icon: '💪',
    description:
      'Calculate all 5 training heart rate zones using the Karvonen heart rate reserve method. Outputs zone ranges, purpose, benefits, and example activities for each zone.',
    formula:
      'Max HR = 220 − Age | HRR = Max HR − Resting HR | Zone BPM = (HRR × Intensity%) + Resting HR (Karvonen 1957)',
    reference:
      'Karvonen MJ et al. Ann Med Exp Biol Fenn 1957 / American College of Sports Medicine Guidelines 2022',
    inputs: [
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 10,
        max: 90,
        defaultValue: 35,
        placeholder: 'e.g. 35',
      },
      {
        id: 'resting_hr',
        label: 'Resting Heart Rate',
        type: 'number',
        unit: 'bpm',
        min: 30,
        max: 100,
        defaultValue: 65,
        placeholder: 'e.g. 65 (measure first thing in morning)',
      },
      {
        id: 'hrmax_known',
        label: 'Do you know your actual Max HR from a test?',
        type: 'select',
        options: [
          { label: 'No — use 220−Age formula', value: 'formula' },
          { label: 'Yes — enter actual max HR', value: 'actual' },
        ],
        defaultValue: 'formula',
      },
      {
        id: 'hrmax_actual',
        label: 'Actual Max HR (if known from test)',
        type: 'number',
        unit: 'bpm',
        min: 100,
        max: 220,
        defaultValue: 185,
        placeholder: 'e.g. 185 (from max exercise test)',
      },
    ],
    calculate(v) {
      const age = Number(v.age),
        rhr = Number(v.resting_hr);
      const hrMax = v.hrmax_known === 'actual' ? Number(v.hrmax_actual) : 220 - age;
      const hrr = hrMax - rhr;
      const zone = (pct: number) => Math.round(hrr * pct + rhr);
      // Zone boundaries (Karvonen % HRR)
      const z1lo = rhr,
        z1hi = zone(0.5);
      const z2lo = zone(0.5),
        z2hi = zone(0.6);
      const z3lo = zone(0.6),
        z3hi = zone(0.7);
      const z4lo = zone(0.7),
        z4hi = zone(0.8);
      const z5lo = zone(0.8),
        z5hi = hrMax;
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: 'Max Heart Rate',
        value: hrMax,
        unit: 'bpm',
        interpretation: `Max HR: ${hrMax} bpm | HRR: ${hrr} bpm | Zone 1: <${z1hi} | Zone 2: ${z2lo}–${z2hi} | Zone 3: ${z3lo}–${z3hi} | Zone 4: ${z4lo}–${z4hi} | Zone 5: ${z5lo}–${z5hi}`,
        risk,
        riskPercentage: `Max HR: ${hrMax} bpm | Resting HR: ${rhr} bpm | HRR: ${hrr} bpm`,
        guidelineSource: 'Karvonen MJ et al. 1957 / ACSM Exercise Guidelines 2022',
        scoreBreakdown: [
          { component: 'Age', score: age + ' years' },
          { component: 'Resting Heart Rate', score: rhr + ' bpm' },
          {
            component: 'Max HR Formula',
            score:
              v.hrmax_known === 'actual'
                ? 'Actual measured'
                : '220 − ' + age + ' = ' + hrMax + ' bpm',
          },
          { component: 'Maximum HR', score: hrMax + ' bpm' },
          { component: 'Heart Rate Reserve (HRR)', score: hrr + ' bpm' },
          {
            component: 'Zone 1 — Recovery',
            score: `${z1lo}–${z1hi} bpm (<50% HRR) | Warm-up, cool-down, active recovery`,
          },
          {
            component: 'Zone 2 — Aerobic Base',
            score: `${z2lo}–${z2hi} bpm (50–60% HRR) | Fat burning, endurance base building`,
          },
          {
            component: 'Zone 3 — Aerobic / Cardio',
            score: `${z3lo}–${z3hi} bpm (60–70% HRR) | Improved aerobic capacity, sustainable effort`,
          },
          {
            component: 'Zone 4 — Lactate Threshold',
            score: `${z4lo}–${z4hi} bpm (70–80% HRR) | Speed, VO2max, race pace training`,
          },
          {
            component: 'Zone 5 — VO2 Max / Max Effort',
            score: `${z5lo}–${z5hi} bpm (80–100% HRR) | Short intervals, maximal output`,
          },
        ],
        details: [
          `Zone 1 (Recovery): <${z1hi} bpm — Warm-up, cool-down, light walk. Purpose: recovery, blood flow, active rest.`,
          `Zone 2 (Aerobic Base): ${z2lo}–${z2hi} bpm — Easy jog, cycling, swim. Purpose: fat oxidation, aerobic base, conversational pace.`,
          `Zone 3 (Aerobic/Cardio): ${z3lo}–${z3hi} bpm — Brisk run, moderate cycling. Purpose: improved cardiovascular efficiency. "Comfortably hard."`,
          `Zone 4 (Lactate Threshold): ${z4lo}–${z4hi} bpm — Tempo run, hard intervals. Purpose: raise lactate threshold, speed improvement.`,
          `Zone 5 (VO2 Max): ${z5lo}–${z5hi} bpm — Sprint intervals, max hills. Purpose: maximal aerobic capacity. Only 1–3 min sustainable.`,
          '→ Medical clearance recommended before starting Zone 4–5 training if: age >40, known CVD risk factors, sedentary >1 year',
          '→ 220 − Age formula has ±10–12 bpm error — actual max HR test (graded exercise test) is more precise',
          '→ Most health benefits accrue from 150 min/week moderate (Zone 2–3) or 75 min/week vigorous (Zone 4) exercise — ACSM 2022',
        ],
      };
    },
  },

  // ── 3. Daily Water Intake Calculator ─────────────────────────────────
  {
    id: 'daily-water-intake-calculator',
    name: 'Daily Water Intake',
    category: 'Wellness',
    icon: '💧',
    description:
      'Estimate total daily fluid needs based on weight, activity level, climate, and health conditions. Outputs total volume in liters and cups with personalized hydration guidance.',
    formula:
      'Base: 35 mL/kg/day | Activity adjustment +300–1500 mL | Climate +300–700 mL | Illness/fever +500 mL',
    reference:
      'EFSA Panel on Dietetic Products 2010 / IOM Dietary Reference Intakes 2004 / WHO Hydration Guidelines',
    inputs: [
      {
        id: 'weight',
        label: 'Body Weight',
        type: 'number',
        unit: 'kg',
        min: 30,
        max: 200,
        defaultValue: 70,
        placeholder: 'e.g. 70',
      },
      {
        id: 'activity',
        label: 'Activity Level',
        type: 'select',
        options: [
          { label: 'Sedentary (desk job, minimal exercise)', value: 0 },
          { label: 'Lightly active (light exercise 1–3 days/wk)', value: 350 },
          { label: 'Moderately active (moderate exercise 3–5 days/wk)', value: 700 },
          { label: 'Very active (hard exercise 6–7 days/wk)', value: 1050 },
          { label: 'Athlete (2× daily training or physical job)', value: 1500 },
        ],
        defaultValue: 0,
      },
      {
        id: 'climate',
        label: 'Climate / Environment',
        type: 'select',
        options: [
          { label: 'Temperate / indoors', value: 0 },
          { label: 'Hot and/or humid climate', value: 350 },
          { label: 'Very hot / extreme heat', value: 700 },
        ],
        defaultValue: 0,
      },
      {
        id: 'condition',
        label: 'Health Condition',
        type: 'select',
        options: [
          { label: 'Healthy', value: 0 },
          { label: 'Fever (add ~500 mL)', value: 500 },
          { label: 'Diarrhea / vomiting (add ~700 mL)', value: 700 },
          { label: 'Kidney stones history (add ~1000 mL)', value: 1000 },
          { label: 'Heart failure / fluid restriction (reduce — see note)', value: -500 },
        ],
        defaultValue: 0,
      },
    ],
    calculate(v) {
      const w = Number(v.weight);
      const base = w * 35;
      const adjustment = Number(v.activity) + Number(v.climate) + Number(v.condition);
      const total = Math.max(1000, base + adjustment);
      const litres = total / 1000;
      const cups8oz = Math.round(total / 237);
      const cups250ml = Math.round(total / 250);
      const isRestricted = Number(v.condition) < 0;
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: 'Daily Fluid Need',
        value: litres.toFixed(1),
        unit: 'L/day',
        interpretation: `${litres.toFixed(1)} L/day (${cups8oz} × 8 oz cups | ${cups250ml} × 250 mL glasses). ${isRestricted ? '⚠️ Heart failure / fluid restriction: consult physician for individualized fluid limit — do NOT use this estimate.' : 'About 80% from beverages, 20% from food.'}`,
        risk,
        riskPercentage: `${litres.toFixed(1)} L/day | ${cups8oz} cups (8 oz) | ${cups250ml} glasses (250 mL)`,
        guidelineSource: 'EFSA Panel 2010 / IOM DRI 2004',
        scoreBreakdown: [
          { component: 'Weight', score: w + ' kg' },
          { component: 'Base requirement (35 mL/kg)', score: base.toFixed(0) + ' mL' },
          {
            component: 'Activity adjustment',
            score: (Number(v.activity) > 0 ? '+' : '') + v.activity + ' mL',
          },
          {
            component: 'Climate adjustment',
            score: (Number(v.climate) > 0 ? '+' : '') + v.climate + ' mL',
          },
          {
            component: 'Health condition adjustment',
            score: (Number(v.condition) >= 0 ? '+' : '') + v.condition + ' mL',
          },
          { component: 'Total fluid need', score: total.toFixed(0) + ' mL/day' },
          { component: 'In litres', score: litres.toFixed(2) + ' L/day' },
          { component: 'In 8 oz cups', score: cups8oz + ' cups' },
          { component: 'In 250 mL glasses', score: cups250ml + ' glasses' },
        ],
        details: [
          `→ Target: ${litres.toFixed(1)} L/day (${cups8oz} × 8 oz cups)`,
          isRestricted
            ? '⚠️ Heart failure / chronic kidney disease: individualized fluid restriction required — follow physician guidance'
            : '',
          '→ Spread fluid intake throughout the day — large volumes at once are less effective',
          '→ Pale yellow urine (straw color) = adequate hydration; dark yellow/amber = dehydrated',
          '→ 20% of daily fluid comes from food (fruits, vegetables, soups)',
          '→ Coffee and tea count toward fluid intake despite mild diuretic effect',
          '→ Alcohol is dehydrating — add 1 glass of water per alcoholic drink',
          '→ Thirst is a late indicator of dehydration — drink proactively, not reactively',
          '→ Athletes: sweat loss can be 0.5–2.5 L/hr — drink 400–600 mL in the 2 hours before exercise',
          '→ Consult physician if taking diuretics, ACE inhibitors, or have kidney/heart disease before increasing fluids',
        ].filter(Boolean),
      };
    },
  },

  // ── 4. Sleep Cycle Calculator ─────────────────────────────────────────
  {
    id: 'sleep-cycle-calculator',
    name: 'Sleep Cycle Calculator',
    category: 'Wellness',
    icon: '😴',
    description:
      'Calculate optimal wake times based on 90-minute sleep cycles and sleep onset latency. Outputs multiple wake-time options and ideal bedtime recommendations for a given wake-up time.',
    formula:
      'Total sleep = N cycles × 90 min + 15 min sleep onset | Wake time = Bedtime + 15 min + (N × 90 min)',
    reference:
      'Carskadon MA, Dement WC. Principles and Practice of Sleep Medicine 2011 / AASM Sleep Guidelines 2017',
    inputs: [
      {
        id: 'mode',
        label: 'Calculate',
        type: 'select',
        options: [
          { label: 'Wake times from a given bedtime', value: 'from_bed' },
          { label: 'Bedtimes for a given wake-up time', value: 'from_wake' },
        ],
        defaultValue: 'from_bed',
      },
      {
        id: 'bedtime_hour',
        label: 'Bedtime Hour (24h)',
        type: 'number',
        unit: 'hour',
        min: 18,
        max: 24,
        defaultValue: 23,
        placeholder: 'e.g. 23 (11 PM)',
      },
      {
        id: 'bedtime_min',
        label: 'Bedtime Minute',
        type: 'number',
        unit: 'min',
        min: 0,
        max: 59,
        defaultValue: 0,
        placeholder: 'e.g. 0',
      },
      {
        id: 'wake_hour',
        label: 'Wake-Up Hour (24h — for reverse mode)',
        type: 'number',
        unit: 'hour',
        min: 4,
        max: 12,
        defaultValue: 7,
        placeholder: 'e.g. 7 (7 AM)',
      },
      {
        id: 'wake_min',
        label: 'Wake-Up Minute',
        type: 'number',
        unit: 'min',
        min: 0,
        max: 59,
        defaultValue: 0,
        placeholder: 'e.g. 0',
      },
    ],
    calculate(v) {
      const mode = v.mode as string;
      const bedH = Number(v.bedtime_hour),
        bedM = Number(v.bedtime_min);
      const wakeH = Number(v.wake_hour),
        wakeM = Number(v.wake_min);
      const toMin = (h: number, m: number) => h * 60 + m;
      const toTime = (totalMin: number) => {
        const h = Math.floor(totalMin / 60) % 24,
          mn = totalMin % 60;
        const h12 = h % 12 === 0 ? 12 : h % 12;
        const ampm = h >= 12 ? 'PM' : 'AM';
        return `${h.toString().padStart(2, '0')}:${mn.toString().padStart(2, '0')} (${h12}:${mn.toString().padStart(2, '0')} ${ampm})`;
      };
      const ONSET = 15;
      let output: string, detail1: string, detail2: string, detail3: string;
      if (mode === 'from_bed') {
        const bedTotalMin = toMin(bedH, bedM);
        const times = [4, 5, 6].map((n) => ({
          cycles: n,
          time: toTime(bedTotalMin + ONSET + n * 90),
          hours: (ONSET + n * 90) / 60,
        }));
        output = times
          .map((t) => `${t.cycles} cycles (${t.hours.toFixed(1)}h): wake at ${t.time}`)
          .join(' | ');
        detail1 = `4 cycles (6h): wake at ${times[0].time}`;
        detail2 = `5 cycles (7.5h): wake at ${times[1].time} ← Recommended`;
        detail3 = `6 cycles (9h): wake at ${times[2].time}`;
      } else {
        const wakeTotalMin = toMin(wakeH, wakeM);
        const beds = [4, 5, 6].map((n) => ({
          cycles: n,
          time: toTime(wakeTotalMin - ONSET - n * 90),
          hours: (ONSET + n * 90) / 60,
        }));
        output = beds
          .map((t) => `${t.cycles} cycles (${t.hours.toFixed(1)}h): go to bed at ${t.time}`)
          .join(' | ');
        detail1 = `4 cycles (6h): bedtime at ${beds[0].time}`;
        detail2 = `5 cycles (7.5h): bedtime at ${beds[1].time} ← Recommended`;
        detail3 = `6 cycles (9h): bedtime at ${beds[2].time}`;
      }
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: mode === 'from_bed' ? 'Optimal Wake Times' : 'Optimal Bedtimes',
        value:
          mode === 'from_bed'
            ? toTime(toMin(bedH, bedM) + ONSET + 5 * 90).split(' ')[0]
            : toTime(toMin(wakeH, wakeM) - ONSET - 5 * 90).split(' ')[0],
        unit: '',
        interpretation: output,
        risk,
        riskPercentage: '5 cycles = 7.5 hours (recommended)',
        guidelineSource:
          'Carskadon MA, Dement WC. Principles and Practice of Sleep Medicine 2011 / AASM 2017',
        scoreBreakdown: [
          {
            component: 'Mode',
            score: mode === 'from_bed' ? 'Wake times from bedtime' : 'Bedtimes from wake-up',
          },
          {
            component: mode === 'from_bed' ? 'Bedtime' : 'Wake-up time',
            score:
              mode === 'from_bed'
                ? `${bedH}:${bedM.toString().padStart(2, '0')}`
                : `${wakeH}:${wakeM.toString().padStart(2, '0')}`,
          },
          {
            component: 'Sleep onset latency',
            score: ONSET + ' minutes (average time to fall asleep)',
          },
          { component: 'Sleep cycle duration', score: '90 minutes per cycle' },
          { component: 'Option 1 (4 cycles)', score: detail1 },
          { component: 'Option 2 (5 cycles) ← Best', score: detail2 },
          { component: 'Option 3 (6 cycles)', score: detail3 },
          {
            component: 'Recommended sleep duration',
            score: '7–9 hours (adults) | 8–10 hours (teens) | AASM 2017',
          },
        ],
        details: [
          `→ ${detail1}`,
          `→ ${detail2}`,
          `→ ${detail3}`,
          '→ Waking between cycles (at light sleep stage) reduces sleep inertia ("morning grogginess")',
          '→ AASM recommends 7–9 hours nightly for adults; 8–10 hours for teenagers',
          '→ Consistent sleep and wake times (even weekends) is the most powerful sleep hygiene habit',
          '→ Avoid screens (blue light) 60 minutes before bed — suppresses melatonin secretion',
          '→ Sleep environment: dark, cool (60–67°F / 15–19°C), quiet',
          '→ Caffeine half-life ≈6 hours — last coffee by 2 PM to minimise sleep disruption',
          '→ Persistent poor sleep (>3 nights/week for >3 months): evaluate for insomnia disorder; consider CBT-I (first-line therapy)',
        ],
      };
    },
  },

  // ── 5. Cholesterol Ratio Calculator ──────────────────────────────────
  {
    id: 'cholesterol-ratio-calculator',
    name: 'Cholesterol Ratio Calculator',
    category: 'Wellness',
    icon: '🧪',
    description:
      'Calculate TC/HDL and LDL/HDL cardiovascular risk ratios. Provides risk classification, ACC/AHA lipid targets, and lifestyle modification recommendations in plain language.',
    formula:
      'TC/HDL Ratio = Total Cholesterol / HDL | LDL/HDL Ratio = LDL / HDL | Non-HDL = TC − HDL',
    reference:
      'Ingelsson E et al. JAMA 2007 / ACC/AHA Cholesterol Guidelines 2018 / ESC/EAS Lipid Guidelines 2019',
    inputs: [
      {
        id: 'tc',
        label: 'Total Cholesterol',
        type: 'number',
        unit: 'mg/dL',
        min: 100,
        max: 500,
        defaultValue: 200,
        placeholder: 'e.g. 200',
      },
      {
        id: 'hdl',
        label: 'HDL Cholesterol',
        type: 'number',
        unit: 'mg/dL',
        min: 15,
        max: 120,
        defaultValue: 55,
        placeholder: 'e.g. 55',
      },
      {
        id: 'ldl',
        label: 'LDL Cholesterol',
        type: 'number',
        unit: 'mg/dL',
        min: 30,
        max: 400,
        defaultValue: 120,
        placeholder: 'e.g. 120',
      },
      {
        id: 'trig',
        label: 'Triglycerides (optional)',
        type: 'number',
        unit: 'mg/dL',
        min: 30,
        max: 2000,
        defaultValue: 120,
        placeholder: 'e.g. 120',
      },
    ],
    calculate(v) {
      const tc = Number(v.tc),
        hdl = Number(v.hdl),
        ldl = Number(v.ldl),
        trig = Number(v.trig);
      const tcHdl = tc / hdl;
      const ldlHdl = ldl / hdl;
      const nonHdl = tc - hdl;
      // Friedewald VLDL check
      const vldl = trig / 5;
      const friedewald_valid = trig <= 400;
      // Risk classification
      const tcHdlRisk =
        tcHdl < 3.5
          ? 'Ideal'
          : tcHdl < 4.5
            ? 'Good'
            : tcHdl < 5
              ? 'Acceptable'
              : tcHdl < 6
                ? 'Elevated'
                : 'High';
      const ldlHdlRisk = ldlHdl < 2.5 ? 'Ideal' : ldlHdl < 3.5 ? 'Good' : 'Elevated';
      const risk: CalculationResult['risk'] = tcHdl < 4.5 ? 'low' : tcHdl < 5 ? 'moderate' : 'high';
      return {
        label: 'TC/HDL Ratio',
        value: tcHdl.toFixed(2),
        unit: '',
        interpretation: `TC/HDL: ${tcHdl.toFixed(2)} (${tcHdlRisk}) | LDL/HDL: ${ldlHdl.toFixed(2)} (${ldlHdlRisk}) | Non-HDL: ${nonHdl} mg/dL. ${tcHdl >= 5 ? 'Elevated cardiovascular risk — lifestyle modification and lipid evaluation recommended.' : 'Cardiovascular risk ratios within acceptable range.'}`,
        risk,
        riskPercentage: `TC/HDL: ${tcHdl.toFixed(2)} | LDL/HDL: ${ldlHdl.toFixed(2)}`,
        guidelineSource: 'Ingelsson E et al. JAMA 2007 / ACC/AHA Cholesterol Guidelines 2018',
        scoreBreakdown: [
          {
            component: 'Total Cholesterol',
            score:
              tc +
              ' mg/dL' +
              (tc < 200 ? ' (Desirable)' : tc < 240 ? ' (Borderline High)' : ' (High)'),
          },
          {
            component: 'HDL Cholesterol',
            score:
              hdl +
              ' mg/dL' +
              (hdl >= 60
                ? ' (Protective — favorable)'
                : hdl < 40
                  ? ' (Low — risk factor)'
                  : ' (Acceptable)'),
          },
          {
            component: 'LDL Cholesterol',
            score:
              ldl +
              ' mg/dL' +
              (ldl < 100
                ? ' (Optimal)'
                : ldl < 130
                  ? ' (Near optimal)'
                  : ldl < 160
                    ? ' (Borderline High)'
                    : ' (High)'),
          },
          {
            component: 'Triglycerides',
            score:
              trig +
              ' mg/dL' +
              (trig < 150 ? ' (Normal)' : trig < 200 ? ' (Borderline High)' : ' (High)'),
          },
          {
            component: 'Non-HDL Cholesterol',
            score: nonHdl + ' mg/dL (target <130 mg/dL for most adults)',
          },
          {
            component: 'TC/HDL Ratio',
            score: tcHdl.toFixed(2) + ' (' + tcHdlRisk + ') — ideal <3.5',
          },
          {
            component: 'LDL/HDL Ratio',
            score: ldlHdl.toFixed(2) + ' (' + ldlHdlRisk + ') — ideal <2.5',
          },
          {
            component: 'VLDL (Trig/5)',
            score: friedewald_valid
              ? vldl.toFixed(0) + ' mg/dL'
              : 'Trig >400 — Friedewald not valid',
          },
        ],
        details: [
          `TC/HDL: ${tcHdl.toFixed(2)} (${tcHdlRisk}) | LDL/HDL: ${ldlHdl.toFixed(2)} | Non-HDL: ${nonHdl} mg/dL`,
          '→ Lifestyle changes to improve ratios: daily aerobic exercise, reduce saturated fat (<7% calories), eliminate trans fats, increase soluble fiber and omega-3s',
          hdl < 50
            ? '→ Low HDL: increase exercise (aerobic), reduce refined carbohydrates, quit smoking'
            : '',
          trig >= 150
            ? '→ Elevated triglycerides: reduce refined carbs/sugar/alcohol, increase omega-3 fatty acids, physical activity'
            : '',
          ldl >= 130
            ? '→ Elevated LDL: ACC/AHA 2018 — consider statin therapy if 10-year ASCVD risk ≥7.5%; consult physician'
            : '',
          '→ Statin therapy lowers LDL by 30–50% (moderate intensity) or 50%+ (high intensity)',
          '→ Recheck fasting lipid panel after 4–12 weeks of lifestyle changes before initiating medication',
          '→ This calculator does not replace the ACC/AHA Pooled Cohort Equations (PCE) for ASCVD risk estimation — use Framingham calculator',
        ].filter(Boolean),
      };
    },
  },

  // ── 6. Health Insurance Premium Estimator ────────────────────────────
  {
    id: 'health-insurance-premium-estimator',
    name: 'Insurance Premium Estimator',
    category: 'Wellness',
    icon: '💰',
    description:
      'Estimate monthly and annual health insurance premium costs by age, plan metal tier, and tobacco status. Includes ACA subsidy calculator and coverage overview in plain language.',
    formula:
      'Premium = Base rate × Age factor × Tobacco factor × (1 − Subsidy%) | ACA allows 3× age ratio (older:younger)',
    reference: 'ACA Marketplace Rating Rules 2024 / Kaiser Family Foundation Premium Analysis 2024',
    inputs: [
      {
        id: 'age',
        label: 'Your Age',
        type: 'number',
        unit: 'years',
        min: 18,
        max: 64,
        defaultValue: 35,
        placeholder: 'e.g. 35',
      },
      {
        id: 'plan_type',
        label: 'Plan Metal Level',
        type: 'select',
        options: [
          { label: 'Bronze (~$350/mo base) — 60% actuarial value, lowest premium', value: 350 },
          { label: 'Silver (~$450/mo base) — 70% actuarial value, CSR available', value: 450 },
          { label: 'Gold (~$560/mo base) — 80% actuarial value, lower copays', value: 560 },
          { label: 'Platinum (~$700/mo base) — 90% actuarial value, highest premium', value: 700 },
        ],
        defaultValue: 450,
      },
      {
        id: 'tobacco',
        label: 'Tobacco User (past 6 months)',
        type: 'select',
        options: [
          { label: 'No', value: 1.0 },
          { label: 'Yes (+up to 50% surcharge)', value: 1.5 },
        ],
        defaultValue: 1.0,
      },
      {
        id: 'household_income',
        label: 'Annual Household Income',
        type: 'number',
        unit: 'USD',
        min: 0,
        max: 500000,
        defaultValue: 45000,
        placeholder: 'e.g. 45000 (for subsidy calculation)',
      },
      {
        id: 'fpl_pct',
        label: 'Estimated % of Federal Poverty Level',
        type: 'select',
        options: [
          { label: '100–138% FPL (Medicaid threshold — may qualify)', value: 120 },
          { label: '139–200% FPL (substantial subsidy)', value: 170 },
          { label: '201–250% FPL (significant subsidy + CSR)', value: 225 },
          { label: '251–300% FPL (moderate subsidy)', value: 275 },
          { label: '301–400% FPL (some subsidy)', value: 350 },
          { label: '>400% FPL (ARP — subsidy still possible)', value: 450 },
        ],
        defaultValue: 225,
      },
    ],
    calculate(v) {
      const age = Number(v.age),
        base = Number(v.plan_type),
        tobacco = Number(v.tobacco);
      const fplPct = Number(v.fpl_pct);
      const ageFactor =
        age < 26
          ? 0.83
          : age < 30
            ? 0.95
            : age < 35
              ? 1.0
              : age < 40
                ? 1.12
                : age < 45
                  ? 1.28
                  : age < 50
                    ? 1.52
                    : age < 55
                      ? 1.78
                      : age < 60
                        ? 2.14
                        : 2.5;
      const rawPremium = base * ageFactor * tobacco;
      // ACA premium cap by % FPL (approximate 2024 benchmark premium table)
      const subsidy_pct =
        fplPct <= 138
          ? 1.0
          : fplPct <= 200
            ? 0.55
            : fplPct <= 250
              ? 0.4
              : fplPct <= 300
                ? 0.25
                : fplPct <= 400
                  ? 0.12
                  : 0.08;
      const subsidy = rawPremium * subsidy_pct;
      const afterSubsidy = rawPremium - subsidy;
      const annualAfter = afterSubsidy * 12;
      const risk: CalculationResult['risk'] = 'low';
      const planLabel: Record<number, string> = {
        350: 'Bronze',
        450: 'Silver',
        560: 'Gold',
        700: 'Platinum',
      };
      return {
        label: 'Est. Monthly Premium',
        value: Math.round(afterSubsidy),
        unit: 'USD/month',
        interpretation: `Estimated ${planLabel[Number(v.plan_type)] || ''} plan premium: ~$${Math.round(rawPremium)}/month before subsidy. After estimated ACA subsidy (~${(subsidy_pct * 100).toFixed(0)}%): ~$${Math.round(afterSubsidy)}/month (~$${Math.round(annualAfter)}/year). Actual premiums vary by state, insurer, and ZIP code.`,
        risk,
        riskPercentage: `~$${Math.round(rawPremium)}/mo (full) | ~$${Math.round(afterSubsidy)}/mo (after subsidy)`,
        guidelineSource: 'ACA Marketplace Rating Rules 2024 / KFF Premium Analysis 2024',
        scoreBreakdown: [
          { component: 'Age', score: age + ' years (factor: ×' + ageFactor.toFixed(2) + ')' },
          {
            component: 'Plan Level',
            score: planLabel[Number(v.plan_type)] + ' (~$' + base + '/mo base rate)',
          },
          {
            component: 'Tobacco Surcharge',
            score: tobacco > 1 ? '+50% surcharge applied' : 'None',
          },
          { component: 'Estimated Full Premium', score: '~$' + Math.round(rawPremium) + '/month' },
          { component: 'Income / FPL %', score: fplPct + '% FPL' },
          {
            component: 'Estimated ACA Subsidy',
            score: '~' + (subsidy_pct * 100).toFixed(0) + '% (~$' + Math.round(subsidy) + '/mo)',
          },
          { component: 'After-Subsidy Premium', score: '~$' + Math.round(afterSubsidy) + '/month' },
          { component: 'Annual Cost (after subsidy)', score: '~$' + Math.round(annualAfter) },
          {
            component: 'Important Note',
            score: 'Estimates only — visit HealthCare.gov for actual quotes',
          },
        ],
        details: [
          `→ Estimated after-subsidy premium: ~$${Math.round(afterSubsidy)}/month (~$${Math.round(annualAfter)}/year)`,
          '→ Silver plans qualify for Cost Sharing Reductions (CSR) if income 100–250% FPL — lower deductibles/copays with same premium',
          tobacco > 1
            ? '→ Tobacco surcharge: up to 50% — quitting saves ~$' +
              Math.round(rawPremium * 0.5 * 12) +
              '/year in premiums alone'
            : '',
          '→ ACA Special Enrollment Period: qualifying life events (job loss, marriage, birth, moving) allow enrollment outside Open Enrollment',
          '→ Open Enrollment: Nov 1 – Jan 15 (or later in some states)',
          '→ CHIP: free/low-cost coverage for children in families earning too much for Medicaid but too little for marketplace plans',
          '→ Visit HealthCare.gov or your state marketplace for accurate quotes based on your specific ZIP code and insurer options',
          '→ Consult a licensed navigator or insurance broker for personalized guidance (free service)',
        ].filter(Boolean),
      };
    },
  },

  // ── 7. Surgery Cost Estimator ─────────────────────────────────────────
  {
    id: 'surgery-cost-estimator',
    name: 'Surgery Cost Estimator',
    category: 'Wellness',
    icon: '🏥',
    description:
      'Estimate out-of-pocket cost for common surgical procedures. Shows low/average/high cost range, insurance calculation, and factors that drive cost variation.',
    formula: 'OOP = min(OOP Max, Deductible Remaining + Coinsurance on amount above deductible)',
    reference:
      'Healthcare Bluebook 2024 / FAIR Health Consumer Cost Lookup 2024 / CMS Medicare Cost Reports',
    inputs: [
      {
        id: 'procedure',
        label: 'Procedure',
        type: 'select',
        options: [
          { label: 'Appendectomy (~$11,000–$29,000)', value: 20000 },
          { label: 'Hip Replacement (~$20,000–$47,000)', value: 33000 },
          { label: 'Knee Replacement (~$18,000–$45,000)', value: 30000 },
          { label: 'C-Section (~$10,000–$25,000)', value: 17000 },
          { label: 'LASIK (per eye, ~$1,500–$3,500)', value: 2500 },
          { label: 'Colonoscopy (~$1,000–$4,500)', value: 2500 },
          { label: 'Cardiac Catheterization (~$7,000–$30,000)', value: 18000 },
          { label: 'Gallbladder Removal (~$6,000–$20,000)', value: 13000 },
          { label: 'Tonsillectomy (~$4,000–$12,000)', value: 8000 },
          { label: 'CABG / Open Heart (~$70,000–$200,000)', value: 135000 },
        ],
        defaultValue: 20000,
      },
      {
        id: 'insurance_pct',
        label: 'Insurance Pays (Coinsurance after deductible)',
        type: 'number',
        unit: '%',
        min: 0,
        max: 100,
        defaultValue: 80,
        placeholder: 'e.g. 80 (you pay 20% coinsurance)',
      },
      {
        id: 'deductible_rem',
        label: 'Remaining Deductible',
        type: 'number',
        unit: 'USD',
        min: 0,
        max: 10000,
        defaultValue: 1500,
        placeholder: 'e.g. 1500 (amount not yet met this year)',
      },
      {
        id: 'oop_max',
        label: 'Annual Out-of-Pocket Maximum',
        type: 'number',
        unit: 'USD',
        min: 0,
        max: 30000,
        defaultValue: 7500,
        placeholder: 'e.g. 7500',
      },
    ],
    calculate(v) {
      const total = Number(v.procedure);
      const dedRem = Number(v.deductible_rem);
      const insPct = Number(v.insurance_pct) / 100;
      const oopMax = Number(v.oop_max);
      // Amount above deductible
      const aboveDeductible = Math.max(0, total - dedRem);
      // Coinsurance on portion above deductible
      const coinsurance = aboveDeductible * (1 - insPct);
      // Total OOP = deductible + coinsurance, capped at OOP max
      const rawOOP = dedRem + coinsurance;
      const finalOOP = Math.min(oopMax, rawOOP);
      const insurancePays = total - finalOOP;
      const risk: CalculationResult['risk'] =
        finalOOP > 5000 ? 'high' : finalOOP > 2000 ? 'moderate' : 'low';
      // Cost range (low = 60% of avg, high = 140%)
      const lowEst = Math.round(total * 0.6);
      const highEst = Math.round(total * 1.4);
      return {
        label: 'Est. Out-of-Pocket',
        value: Math.round(finalOOP),
        unit: 'USD',
        interpretation: `Estimated out-of-pocket: ~$${Math.round(finalOOP).toLocaleString()} (OOP max: $${oopMax.toLocaleString()}). Total procedure cost range: $${lowEst.toLocaleString()}–$${highEst.toLocaleString()} depending on hospital, surgeon, and location. Insurance estimated to cover: ~$${Math.round(insurancePays).toLocaleString()}.`,
        risk,
        riskPercentage: `OOP: ~$${Math.round(finalOOP).toLocaleString()} | Insurance covers: ~$${Math.round(insurancePays).toLocaleString()}`,
        guidelineSource: 'Healthcare Bluebook 2024 / FAIR Health 2024',
        scoreBreakdown: [
          { component: 'Procedure', score: 'Average cost ~$' + total.toLocaleString() },
          {
            component: 'Cost Range',
            score:
              '$' +
              lowEst.toLocaleString() +
              ' – $' +
              highEst.toLocaleString() +
              ' (typical range)',
          },
          { component: 'Remaining Deductible', score: '$' + dedRem.toLocaleString() },
          {
            component: 'Insurance Coinsurance',
            score: v.insurance_pct + '% covered (you pay ' + (100 - Number(v.insurance_pct)) + '%)',
          },
          { component: 'Above-deductible amount', score: '$' + aboveDeductible.toLocaleString() },
          {
            component: 'Your coinsurance portion',
            score: '$' + Math.round(coinsurance).toLocaleString(),
          },
          {
            component: 'Calculated OOP (uncapped)',
            score: '$' + Math.round(rawOOP).toLocaleString(),
          },
          { component: 'Out-of-Pocket Maximum', score: '$' + oopMax.toLocaleString() },
          {
            component: 'Final Est. OOP',
            score: '$' + Math.round(finalOOP).toLocaleString() + ' (capped at OOP max)',
          },
          { component: 'Insurance pays', score: '~$' + Math.round(insurancePays).toLocaleString() },
        ],
        details: [
          `→ Estimated OOP: ~$${Math.round(finalOOP).toLocaleString()} | Insurance: ~$${Math.round(insurancePays).toLocaleString()} | Total: ~$${total.toLocaleString()}`,
          '→ Cost factors: hospital facility type (academic vs community vs ASC), surgeon fees, anesthesia, geographic location, implant type',
          '→ Get itemized estimate: request a "Good Faith Estimate" — required by law under the No Surprises Act (2022)',
          '→ In-network vs out-of-network: out-of-network providers can bill the full amount above insurance payment (balance billing)',
          "→ Compare quality and cost: Hospital Compare (Medicare.gov), Healthcare Bluebook, or call your insurer's concierge service",
          '→ Payment plans: most hospitals offer 0% interest payment plans — ask the billing department',
          '→ Financial assistance (charity care): available at most non-profit hospitals for incomes up to 200–400% FPL — apply before procedure',
          '→ This is an estimate only — actual charges depend on complications, length of stay, and provider fees',
        ],
      };
    },
  },

  // ── 8. BP Reading Tracker ─────────────────────────────────────────────
  {
    id: 'blood-pressure-tracker-chart',
    name: 'BP Reading Tracker',
    category: 'Wellness',
    icon: '📊',
    description:
      'Log and classify a blood pressure reading per ACC/AHA 2017 guidelines. Provides category, recommended action in plain language, and lifestyle guidance for non-clinical users.',
    formula:
      'ACC/AHA 2017 BP Categories: Normal <120/<80 | Elevated 120–129/<80 | Stage 1 130–139/80–89 | Stage 2 ≥140/≥90 | Crisis ≥180/≥120',
    reference: 'Whelton PK et al. J Am Coll Cardiol 2018 (ACC/AHA 2017 HTN Guideline)',
    inputs: [
      {
        id: 'sbp',
        label: 'Systolic BP (top number)',
        type: 'number',
        unit: 'mmHg',
        min: 70,
        max: 260,
        defaultValue: 122,
        placeholder: 'e.g. 122',
      },
      {
        id: 'dbp',
        label: 'Diastolic BP (bottom number)',
        type: 'number',
        unit: 'mmHg',
        min: 40,
        max: 150,
        defaultValue: 78,
        placeholder: 'e.g. 78',
      },
      {
        id: 'pulse',
        label: 'Pulse Rate',
        type: 'number',
        unit: 'bpm',
        min: 30,
        max: 200,
        defaultValue: 72,
        placeholder: 'e.g. 72',
      },
      {
        id: 'arm',
        label: 'Measurement Arm',
        type: 'select',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
        ],
        defaultValue: 'right',
      },
      {
        id: 'position',
        label: 'Position',
        type: 'select',
        options: [
          { label: 'Seated (after 5 min rest)', value: 'seated' },
          { label: 'Standing', value: 'standing' },
          { label: 'Lying down', value: 'lying' },
        ],
        defaultValue: 'seated',
      },
    ],
    calculate(v) {
      const sbp = Number(v.sbp),
        dbp = Number(v.dbp),
        pulse = Number(v.pulse);
      let cat: string, action: string;
      if (sbp >= 180 || dbp >= 120) {
        cat = 'Hypertensive Crisis';
        action =
          'Seek IMMEDIATE medical care — rest 5 minutes and recheck. If still ≥180/120 or you have chest pain/shortness of breath/vision changes/headache: call 911.';
      } else if (sbp >= 140 || dbp >= 90) {
        cat = 'Stage 2 Hypertension';
        action =
          'See your doctor soon. Lifestyle changes AND likely medication. Do not wait more than a few days.';
      } else if (sbp >= 130 || dbp >= 80) {
        cat = 'Stage 1 Hypertension';
        action =
          'Talk to your doctor. Strong lifestyle changes (DASH diet, exercise, salt reduction, weight loss, limit alcohol). Medication may be needed.';
      } else if (sbp >= 120 && dbp < 80) {
        cat = 'Elevated Blood Pressure';
        action =
          'Not yet hypertension, but higher than ideal. Lifestyle changes now can prevent progression: reduce sodium, increase exercise, eat more fruits/vegetables.';
      } else {
        cat = 'Normal Blood Pressure';
        action = 'Great! Maintain healthy habits. Recheck annually or as recommended.';
      }
      const risk: CalculationResult['risk'] =
        sbp >= 180 || dbp >= 120
          ? 'critical'
          : sbp >= 140 || dbp >= 90
            ? 'high'
            : sbp >= 130 || dbp >= 80
              ? 'moderate'
              : 'low';
      const pp = sbp - dbp; // pulse pressure
      const map = Math.round(dbp + pp / 3); // mean arterial pressure
      return {
        label: 'BP Category',
        value: cat,
        unit: '',
        interpretation: `${sbp}/${dbp} mmHg — ${cat}. Pulse: ${pulse} bpm | MAP: ${map} mmHg | Pulse Pressure: ${pp} mmHg. ${action}`,
        risk,
        riskPercentage: `${sbp}/${dbp} mmHg — ${cat}`,
        guidelineSource:
          'ACC/AHA 2017 Hypertension Guideline / Whelton PK et al. J Am Coll Cardiol 2018',
        scoreBreakdown: [
          { component: 'Systolic BP', score: sbp + ' mmHg' },
          { component: 'Diastolic BP', score: dbp + ' mmHg' },
          { component: 'BP Reading', score: sbp + '/' + dbp + ' mmHg' },
          { component: 'Pulse Rate', score: pulse + ' bpm' },
          { component: 'Mean Arterial Pressure (MAP)', score: map + ' mmHg (normal 70–100)' },
          { component: 'Pulse Pressure', score: pp + ' mmHg (normal 30–50)' },
          { component: 'ACC/AHA Category', score: cat },
          { component: 'Measurement Arm', score: String(v.arm) },
          { component: 'Position', score: String(v.position) },
          { component: 'Recommended Action', score: action },
        ],
        details: [
          `${sbp}/${dbp} mmHg — ${cat}`,
          action,
          '→ For accurate readings: sit quietly 5 minutes beforehand, no caffeine/tobacco 30 minutes before, back supported, feet flat, arm at heart level',
          '→ Single reading is not diagnostic — average of 2+ readings on 2+ separate occasions is needed',
          sbp >= 130 || dbp >= 80
            ? '→ DASH Diet: reduce sodium to <2,300 mg/day, increase potassium-rich foods, reduce saturated fat'
            : '',
          sbp >= 130 || dbp >= 80
            ? '→ Exercise: 90–150 min/week moderate aerobic activity can lower systolic BP by 5–8 mmHg'
            : '',
          '→ Home monitoring: ideal for 7 consecutive days, 2 readings in morning and evening — average the results',
          '→ "White coat hypertension": elevated in clinic but normal at home — home monitoring or ambulatory BP monitoring (ABPM) clarifies',
          sbp >= 180 || dbp >= 120
            ? '🚨 Hypertensive Crisis: DO NOT WAIT — seek emergency care if any neurological, chest, or respiratory symptoms'
            : '',
        ].filter(Boolean),
      };
    },
  },

  // ── 9. Drug Rehab Cost Estimator ──────────────────────────────────────
  {
    id: 'drug-rehab-cost-calculator',
    name: 'Drug Rehab Cost Estimator',
    category: 'Wellness',
    icon: '💊',
    description:
      'Estimate the cost of addiction treatment programs with low/average/high range. Includes insurance coverage notes, SAMHSA resources, and guidance on financial assistance.',
    formula:
      'Total cost = Daily rate × Duration days | Out-of-pocket = Total × (1 − Insurance coverage %)',
    reference:
      'SAMHSA Treatment Cost Study 2022 / NIDA Cost-Benefit Analysis of Addiction Treatment / ACA Parity Law (MHPAEA)',
    inputs: [
      {
        id: 'program_type',
        label: 'Program Type',
        type: 'select',
        options: [
          { label: 'Outpatient IOP — 9–20 hrs/week (~$100–$500/day)', value: 200 },
          { label: 'Residential 30-day standard (~$400–$800/day)', value: 600 },
          { label: 'Residential 60–90 day (~$350–$700/day)', value: 500 },
          { label: 'Luxury / Executive residential (~$1,000–$3,000/day)', value: 2000 },
          { label: 'Medication-Assisted Treatment (MAT/buprenorphine ~$15–$75/day)', value: 45 },
          { label: 'Methadone clinic (~$10–$25/day)', value: 18 },
          { label: 'Partial Hospitalization (PHP — ~$300–$600/day)', value: 450 },
        ],
        defaultValue: 600,
      },
      {
        id: 'duration_days',
        label: 'Treatment Duration',
        type: 'number',
        unit: 'days',
        min: 7,
        max: 365,
        defaultValue: 30,
        placeholder: 'e.g. 30',
      },
      {
        id: 'insurance_pct',
        label: 'Insurance / Medicaid Coverage',
        type: 'number',
        unit: '%',
        min: 0,
        max: 100,
        defaultValue: 70,
        placeholder: 'e.g. 70 (ACA requires mental health parity)',
      },
    ],
    calculate(v) {
      const rate = Number(v.program_type),
        days = Number(v.duration_days),
        insPct = Number(v.insurance_pct) / 100;
      const totalLow = rate * 0.65 * days;
      const totalAvg = rate * days;
      const totalHigh = rate * 1.55 * days;
      const oopAvg = totalAvg * (1 - insPct);
      const oopLow = totalLow * (1 - insPct);
      const oopHigh = totalHigh * (1 - insPct);
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: 'Estimated Total Cost',
        value: Math.round(totalAvg),
        unit: 'USD',
        interpretation: `Average cost estimate: $${Math.round(totalAvg).toLocaleString()} | Range: $${Math.round(totalLow).toLocaleString()}–$${Math.round(totalHigh).toLocaleString()}. Out-of-pocket with ${v.insurance_pct}% coverage: ~$${Math.round(oopAvg).toLocaleString()} (range $${Math.round(oopLow).toLocaleString()}–$${Math.round(oopHigh).toLocaleString()}).`,
        risk,
        riskPercentage: `OOP: ~$${Math.round(oopAvg).toLocaleString()} | Total range: $${Math.round(totalLow).toLocaleString()}–$${Math.round(totalHigh).toLocaleString()}`,
        guidelineSource: 'SAMHSA Treatment Cost Study 2022 / NIDA',
        scoreBreakdown: [
          { component: 'Program Type', score: '~$' + rate + '/day (average rate)' },
          { component: 'Duration', score: days + ' days' },
          { component: 'Insurance Coverage', score: v.insurance_pct + '%' },
          {
            component: 'Total Cost (low estimate)',
            score: '$' + Math.round(totalLow).toLocaleString(),
          },
          { component: 'Total Cost (average)', score: '$' + Math.round(totalAvg).toLocaleString() },
          {
            component: 'Total Cost (high estimate)',
            score: '$' + Math.round(totalHigh).toLocaleString(),
          },
          {
            component: 'Out-of-Pocket (average)',
            score: '$' + Math.round(oopAvg).toLocaleString(),
          },
          {
            component: 'Out-of-Pocket (range)',
            score:
              '$' +
              Math.round(oopLow).toLocaleString() +
              ' – $' +
              Math.round(oopHigh).toLocaleString(),
          },
          { component: 'SAMHSA Helpline', score: '1-800-662-4357 (free, 24/7, confidential)' },
        ],
        details: [
          `→ Average out-of-pocket: ~$${Math.round(oopAvg).toLocaleString()} with ${v.insurance_pct}% coverage`,
          '→ ACA (ACA/MHPAEA Parity Law): insurance must cover addiction treatment at the same level as medical/surgical care',
          '→ Medicaid covers addiction treatment in all 50 states — eligibility at Medicaid.gov',
          '→ Free or low-cost options: state-funded treatment centers, SAMHSA facility locator (findtreatment.gov)',
          '→ MAT (buprenorphine/methadone): most cost-effective, evidence-based — reduces relapse and mortality by 50%+',
          '→ SAMHSA National Helpline: 1-800-662-4357 — free, confidential treatment referrals 24/7',
          '→ Financial assistance: sliding-scale fees based on income at most non-profit treatment centers',
          '→ Cost of addiction vs treatment: average cost of untreated addiction far exceeds treatment costs (lost productivity, health costs, legal costs)',
        ],
      };
    },
  },

  // ── 10. Therapy Session Cost Estimator ───────────────────────────────
  {
    id: 'therapy-session-cost-estimator',
    name: 'Therapy Session Cost Estimator',
    category: 'Wellness',
    icon: '🧠',
    description:
      'Estimate monthly and annual mental health therapy costs with and without insurance. Includes session type comparison, sliding scale options, and telehealth savings in plain language.',
    formula: 'Monthly cost = Session rate × Frequency | With insurance = Copay × Frequency',
    reference:
      'FAIR Health Consumer Cost Lookup 2024 / APA Practitioner Survey 2023 / ACA Mental Health Parity (MHPAEA)',
    inputs: [
      {
        id: 'session_type',
        label: 'Therapy Type',
        type: 'select',
        options: [
          { label: 'Individual therapy 50-min (~$100–$250/session)', value: 175 },
          { label: 'Individual therapy 80-min (~$150–$350/session)', value: 250 },
          { label: 'Couples / relationship therapy (~$150–$300/session)', value: 225 },
          { label: 'Group therapy (~$25–$100/session)', value: 60 },
          { label: 'Psychiatry intake 60-min (~$200–$500)', value: 350 },
          { label: 'Psychiatry follow-up 15–30 min (~$100–$250)', value: 175 },
          { label: 'Online therapy subscription (~$60–$120/week)', value: 90 },
        ],
        defaultValue: 175,
      },
      {
        id: 'frequency',
        label: 'Sessions per Month',
        type: 'number',
        unit: 'sessions',
        min: 1,
        max: 20,
        defaultValue: 4,
        placeholder: 'e.g. 4 (weekly)',
      },
      {
        id: 'copay',
        label: 'Insurance Copay (per session)',
        type: 'number',
        unit: 'USD',
        min: 0,
        max: 200,
        defaultValue: 35,
        placeholder: 'e.g. 35 (enter 0 if no insurance)',
      },
      {
        id: 'has_insurance',
        label: 'Have Insurance',
        type: 'select',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No — self-pay', value: 'no' },
        ],
        defaultValue: 'yes',
      },
    ],
    calculate(v) {
      const rate = Number(v.session_type),
        freq = Number(v.frequency),
        copay = Number(v.copay);
      const fullMonthly = rate * freq;
      const withInsMonthly = copay * freq;
      const annualFull = fullMonthly * 12;
      const annualIns = withInsMonthly * 12;
      const displayMonthly = v.has_insurance === 'yes' ? withInsMonthly : fullMonthly;
      const displayAnnual = v.has_insurance === 'yes' ? annualIns : annualFull;
      const savings = v.has_insurance === 'yes' ? fullMonthly - withInsMonthly : 0;
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: 'Monthly Therapy Cost',
        value: Math.round(displayMonthly),
        unit: 'USD/month',
        interpretation: `${v.has_insurance === 'yes' ? `With insurance (copay $${copay}/session): ~$${Math.round(withInsMonthly)}/month ($${Math.round(annualIns)}/year). Insurance saves ~$${Math.round(savings)}/month.` : `Without insurance (self-pay): ~$${Math.round(fullMonthly)}/month ($${Math.round(annualFull)}/year).`} Full rate without insurance: ~$${Math.round(fullMonthly)}/month.`,
        risk,
        riskPercentage: `$${Math.round(displayMonthly)}/month | $${Math.round(displayAnnual)}/year`,
        guidelineSource: 'FAIR Health 2024 / APA Practitioner Survey 2023',
        scoreBreakdown: [
          { component: 'Session Type', score: '~$' + rate + '/session (average rate)' },
          { component: 'Sessions per Month', score: freq },
          { component: 'Full Monthly Cost', score: '$' + Math.round(fullMonthly) },
          { component: 'Full Annual Cost', score: '$' + Math.round(annualFull) },
          {
            component: 'Insurance Copay',
            score: v.has_insurance === 'yes' ? '$' + copay + '/session' : 'N/A (self-pay)',
          },
          {
            component: 'With-Insurance Monthly',
            score: v.has_insurance === 'yes' ? '$' + Math.round(withInsMonthly) : 'N/A',
          },
          {
            component: 'With-Insurance Annual',
            score: v.has_insurance === 'yes' ? '$' + Math.round(annualIns) : 'N/A',
          },
          {
            component: 'Insurance Savings',
            score: v.has_insurance === 'yes' ? '~$' + Math.round(savings) + '/month' : 'N/A',
          },
          {
            component: 'Online Therapy Option',
            score: 'BetterHelp/Talkspace ~$60–120/week, no copays',
          },
        ],
        details: [
          `→ ${v.has_insurance === 'yes' ? 'With insurance: ~$' + Math.round(withInsMonthly) + '/month' : 'Self-pay: ~$' + Math.round(fullMonthly) + '/month'} for ${freq} sessions/month`,
          '→ Sliding scale fees: many therapists offer reduced rates based on income — always ask',
          '→ Open Path Collective: licensed therapists for $30–$80/session for those with financial need',
          '→ Online therapy (BetterHelp, Talkspace): $60–120/week, often cheaper than in-person; good for mild-moderate issues',
          '→ Community mental health centers: income-based sliding scale, often under $20/session',
          '→ Insurance: ACA/MHPAEA parity law requires equal coverage for mental health as physical health',
          '→ University training clinics: supervised therapists in training offer very low-cost sessions ($0–$50)',
          '→ Employee Assistance Programs (EAP): many employers offer 6–12 FREE therapy sessions — check with HR',
          "→ Search for in-network therapists: Psychology Today, Zocdoc, your insurer's online directory",
        ],
      };
    },
  },

  // ── 11. Generic vs Brand Medication Cost Estimator ───────────────────
  {
    id: 'medication-cost-comparator',
    name: 'Generic vs Brand Cost Comparator',
    category: 'Wellness',
    icon: '💰',
    description:
      'Compare generic versus brand-name medication costs and calculate potential annual savings. Includes FDA bioequivalence note and guidance on generic safety in plain language.',
    formula:
      'Annual savings = (Brand cost − Generic cost) × 12 months | Savings % = (Brand − Generic) / Brand × 100',
    reference:
      'FDA Generic Drug Savings Report 2023 / IQVIA Medicine Use and Spending in the US 2024',
    inputs: [
      {
        id: 'brand_price',
        label: 'Brand-Name Monthly Cost',
        type: 'number',
        unit: 'USD',
        min: 1,
        max: 20000,
        defaultValue: 200,
        placeholder: 'e.g. 200',
      },
      {
        id: 'generic_price',
        label: 'Generic Monthly Cost',
        type: 'number',
        unit: 'USD',
        min: 1,
        max: 5000,
        defaultValue: 25,
        placeholder: 'e.g. 25',
      },
      {
        id: 'months',
        label: 'Duration',
        type: 'number',
        unit: 'months',
        min: 1,
        max: 120,
        defaultValue: 12,
        placeholder: 'e.g. 12',
      },
      {
        id: 'copay_brand',
        label: 'Your Copay for Brand (with insurance)',
        type: 'number',
        unit: 'USD/month',
        min: 0,
        max: 1000,
        defaultValue: 60,
        placeholder: 'e.g. 60 (Tier 3 copay)',
      },
      {
        id: 'copay_generic',
        label: 'Your Copay for Generic (with insurance)',
        type: 'number',
        unit: 'USD/month',
        min: 0,
        max: 200,
        defaultValue: 10,
        placeholder: 'e.g. 10 (Tier 1 copay)',
      },
    ],
    calculate(v) {
      const brand = Number(v.brand_price),
        gen = Number(v.generic_price);
      const months = Number(v.months);
      const copayBrand = Number(v.copay_brand),
        copayGen = Number(v.copay_generic);
      const monthlySavings = brand - gen;
      const totalSavings = monthlySavings * months;
      const savingsPct = ((monthlySavings / brand) * 100).toFixed(0);
      const copayMonthlySavings = copayBrand - copayGen;
      const copayTotalSavings = copayMonthlySavings * months;
      const risk: CalculationResult['risk'] = 'low';
      return {
        label: 'Potential Savings',
        value: Math.round(totalSavings),
        unit: `USD over ${months} months`,
        interpretation: `Switching to generic saves ~$${Math.round(monthlySavings)}/month (~${savingsPct}% cost reduction). Total savings over ${months} months: ~$${Math.round(totalSavings).toLocaleString()} without insurance, or ~$${Math.round(copayTotalSavings).toLocaleString()} with insurance (copay savings).`,
        risk,
        riskPercentage: `~$${Math.round(monthlySavings)}/month | ${savingsPct}% cheaper`,
        guidelineSource: 'FDA Generic Drug Savings Report 2023 / IQVIA 2024',
        scoreBreakdown: [
          { component: 'Brand Monthly Cost', score: '$' + brand },
          { component: 'Generic Monthly Cost', score: '$' + gen },
          {
            component: 'Monthly Savings',
            score: '$' + Math.round(monthlySavings) + ' (' + savingsPct + '% reduction)',
          },
          {
            component: 'Total Savings over ' + months + 'mo (no insurance)',
            score: '$' + Math.round(totalSavings).toLocaleString(),
          },
          { component: 'Brand Copay (with insurance)', score: '$' + copayBrand + '/month' },
          { component: 'Generic Copay (with insurance)', score: '$' + copayGen + '/month' },
          { component: 'Monthly Copay Savings', score: '$' + copayMonthlySavings },
          {
            component: 'Total Copay Savings over ' + months + 'mo',
            score: '$' + Math.round(copayTotalSavings).toLocaleString(),
          },
          {
            component: 'FDA Bioequivalence',
            score: 'AB-rated generics are therapeutically equivalent by FDA standard',
          },
        ],
        details: [
          `→ Switching to generic: save ~$${Math.round(monthlySavings)}/month (${savingsPct}% cheaper) | $${Math.round(totalSavings).toLocaleString()} over ${months} months`,
          '→ FDA approval: generic drugs must have the same active ingredient, strength, dosage form, and route as the brand — they are bioequivalent',
          '→ AB-rated generics (FDA rating): interchangeable with brand name — same safety and effectiveness',
          '→ Common exceptions where brand may be preferred: narrow therapeutic index drugs (warfarin, levothyroxine, lithium, anti-epileptics) — check with your doctor/pharmacist',
          "→ Authorized generics: sometimes the brand manufacturer's own generic — identical to brand but priced as generic",
          "→ GoodRx / Mark Cuban's CostPlus Drugs: often cheaper than even insurance copays for generics",
          '→ Ask your pharmacist or doctor: "Is there a generic available for this medication?"',
          '→ Biosimilars: for biologic drugs (injections), biosimilars are the equivalent of generics — typically 30–40% cheaper',
          '→ 90% of US prescriptions are filled with generics — safe, effective, and FDA-regulated',
        ],
      };
    },
  },
];

// ─── AGGREGATE EXPORT ─────────────────────────────────────────────────────
export const allMedicalConfigs: MedicalConfig[] = [
  ...cardiologyConfigs,
  ...nephrologyConfigs,
  ...criticalCareConfigs,
  ...psychiatryConfigs,
  ...endocrinologyConfigs,
  ...pharmacologyConfigs,
  ...obgynConfigs,
  ...pulmonologyConfigs,
  ...gastroenterologyConfigs,
  ...oncologyConfigs,
  ...pediatricsConfigs,
  ...wellnessConfigs,
];

export const medicalConfigsByCategory: Record<string, MedicalConfig[]> = {
  Cardiology: cardiologyConfigs,
  Nephrology: nephrologyConfigs,
  'Critical Care': criticalCareConfigs,
  Psychiatry: psychiatryConfigs,
  Endocrinology: endocrinologyConfigs,
  Pharmacology: pharmacologyConfigs,
  'OB/GYN': obgynConfigs,
  Pulmonology: pulmonologyConfigs,
  Gastroenterology: gastroenterologyConfigs,
  Oncology: oncologyConfigs,
  Pediatrics: pediatricsConfigs,
  Wellness: wellnessConfigs,
};

export function getMedicalConfigById(id: string): MedicalConfig | undefined {
  return allMedicalConfigs.find((c) => c.id === id);
}
