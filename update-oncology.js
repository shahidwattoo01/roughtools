const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'apps/web/src/app/tools/medical/_components/medical-configs.ts');
let c = fs.readFileSync(configPath, 'utf8');

const START = c.indexOf('export const oncologyConfigs');
const END   = c.indexOf('\nexport const pediatricsConfigs');

console.log('Replacing oncology section:', START, '-', END, '(length:', END - START, ')');

const newSection = `export const oncologyConfigs: MedicalConfig[] = [
  // 1. Chemotherapy BSA Dose Calculator
  {
    id: 'chemotherapy-dose-bsa-med', name: 'Chemotherapy Dose Calculator (BSA-Based)', category: 'Oncology',
    icon: '💊', description: 'Calculate chemotherapy dose from body surface area using Mosteller formula - with dose cap checking and cycle documentation',
    formula: 'BSA (m2) = sqrt(Height(cm) x Weight(kg) / 3600) - Mosteller | Total dose = BSA x Protocol dose (mg/m2)',
    reference: 'Mosteller RD. NEJM 1987 / ASCO Chemotherapy Administration Guidelines 2013',
    inputs: [
      { id:'weight',      label:'Current Actual Body Weight', type:'number', unit:'kg', min:10, max:300, step:0.1, defaultValue:70, placeholder:'Measure day of treatment' },
      { id:'height',      label:'Height', type:'number', unit:'cm', min:100, max:230, defaultValue:170 },
      { id:'dose_per_m2', label:'Protocol Dose', type:'number', unit:'mg/m2', min:0.1, max:3000, step:0.1, defaultValue:175, placeholder:'e.g. 175 for paclitaxel' },
      { id:'drug_name',   label:'Chemotherapy Agent', type:'select', options:[
        {label:'Paclitaxel (usual: 135-175 mg/m2)',value:'paclitaxel'},
        {label:'Docetaxel (usual: 60-100 mg/m2)',value:'docetaxel'},
        {label:'Carboplatin (AUC-based - use Calvert formula instead)',value:'carboplatin'},
        {label:'Oxaliplatin (usual: 85-130 mg/m2)',value:'oxaliplatin'},
        {label:'Cisplatin (usual: 50-100 mg/m2)',value:'cisplatin'},
        {label:'Doxorubicin (usual: 40-75 mg/m2; lifetime cap 450-550 mg/m2)',value:'doxorubicin'},
        {label:'Etoposide (usual: 50-100 mg/m2)',value:'etoposide'},
        {label:'Gemcitabine (usual: 800-1250 mg/m2)',value:'gemcitabine'},
        {label:'Other (enter dose/m2 above)',value:'other'},
      ], defaultValue:'paclitaxel' },
      { id:'bsa_cap',     label:'BSA Cap (0 = no cap; many protocols cap at 2.0 m2)', type:'number', unit:'m2', min:0, max:3, step:0.1, defaultValue:2.0, placeholder:'e.g. 2.0 or 0 for no cap' },
    ],
    calculate(v) {
      const wt=Number(v.weight), ht=Number(v.height), dosePerM2=Number(v.dose_per_m2), bsaCap=Number(v.bsa_cap)
      const drug=String(v.drug_name)
      const bsaRaw=Math.sqrt(ht*wt/3600)
      const bsaUsed=bsaCap>0?Math.min(bsaRaw, bsaCap):bsaRaw
      const wasCapped=bsaCap>0&&bsaRaw>bsaCap
      const totalDose=bsaUsed*dosePerM2
      const risk:CalculationResult['risk']='low'
      const capNote=wasCapped?'BSA CAPPED at '+bsaCap+' m2 (calculated: '+bsaRaw.toFixed(2)+' m2) - dose calculated using capped BSA per protocol.':''
      const doxWarning=drug==='doxorubicin'?'DOXORUBICIN: Track cumulative lifetime dose - cardiotoxicity threshold at 450-550 mg/m2 total. Baseline and serial echocardiography required.':''
      const carboNote=drug==='carboplatin'?'CARBOPLATIN: Use Calvert formula (AUC x [GFR + 25]) - BSA-based dosing NOT standard for carboplatin.':''
      return {
        label: 'Total Dose', value: totalDose.toFixed(0), unit: 'mg',
        interpretation: 'BSA: '+bsaRaw.toFixed(2)+' m2'+(wasCapped?' (capped to '+bsaCap+')':'')+'. Total dose: '+totalDose.toFixed(0)+'mg ('+dosePerM2+' mg/m2 x '+bsaUsed.toFixed(2)+' m2). '+capNote+' '+doxWarning+' '+carboNote,
        risk,
        riskPercentage: wasCapped?'Dose capped - calculated BSA exceeded cap':undefined,
        guidelineSource: 'Mosteller RD. NEJM 1987 / ASCO Chemotherapy Safety Guidelines 2013',
        scoreBreakdown: [
          {component:'Weight', score:wt+' kg'},
          {component:'Height', score:ht+' cm'},
          {component:'BSA (Mosteller, uncapped)', score:bsaRaw.toFixed(3)+' m2'},
          {component:'BSA cap', score:bsaCap>0?bsaCap+' m2'+(wasCapped?' [APPLIED]':' [not needed]'):'No cap'},
          {component:'BSA used for calculation', score:bsaUsed.toFixed(3)+' m2'},
          {component:'Protocol dose', score:dosePerM2+' mg/m2'},
          {component:'TOTAL DOSE', score:totalDose.toFixed(0)+' mg'},
          {component:'Dose in mg/m2', score:dosePerM2+' mg/m2 ('+drug+')'},
        ],
        details: [
          'BSA: '+bsaRaw.toFixed(2)+' m2 | Dose: '+totalDose.toFixed(0)+'mg ('+dosePerM2+' mg/m2)',
          capNote,
          doxWarning,
          carboNote,
          '-> Re-weigh and recalculate BSA at EVERY cycle - use current weight',
          '-> Dose modification for prior cycle toxicity: Grade 3-4 hematological - typically 25% dose reduction',
          '-> Pre-medications: antiemetics, corticosteroids, antihistamines per emetogenicity level',
          '-> G-CSF prophylaxis: if febrile neutropenia risk >20% per regimen (e.g. TC, CHOP, cisplatin-based)',
          'HIGH-ALERT: Oncologist + oncology pharmacist dual verification MANDATORY before preparation',
          '-> All chemotherapy doses must be verified against treatment plan before administration',
        ].filter(Boolean),
      }
    }
  },
  // 2. ANC (Absolute Neutrophil Count)
  {
    id: 'anc-absolute-neutrophil-count', name: 'Absolute Neutrophil Count (ANC) Calculator', category: 'Oncology',
    icon: '🩸', description: 'Calculate ANC from CBC differential to assess neutropenia severity and febrile neutropenia risk - a oncologic emergency if ANC <500 + fever',
    formula: 'ANC = WBC (x10^3/uL) x (% Neutrophils + % Bands) / 100',
    reference: 'ASCO/IDSA Febrile Neutropenia Guidelines 2018 / NCCN Myeloid Growth Factors Guidelines',
    inputs: [
      { id:'wbc',       label:'WBC Count', type:'number', unit:'x10^3/uL', min:0.1, max:100, step:0.1, defaultValue:4.5, placeholder:'e.g. 4.5' },
      { id:'neut_pct',  label:'Neutrophils (%)', type:'number', unit:'%', min:0, max:100, step:0.1, defaultValue:60, placeholder:'e.g. 60' },
      { id:'bands_pct', label:'Bands / Stabs (%)', type:'number', unit:'%', min:0, max:40, step:0.1, defaultValue:2, placeholder:'e.g. 2 (usually 0-5%)' },
      { id:'temp',      label:'Current Temperature', type:'number', unit:'°C', min:35, max:42, step:0.1, defaultValue:37.0, placeholder:'e.g. 37.0' },
      { id:'chemotherapy_patient', label:'Currently receiving myelosuppressive chemotherapy', type:'select', options:[{label:'No',value:0},{label:'Yes',value:1}], defaultValue:1 },
    ],
    calculate(v) {
      const wbc=Number(v.wbc), neutPct=Number(v.neut_pct), bandPct=Number(v.bands_pct)
      const temp=Number(v.temp), chemoPatient=Number(v.chemotherapy_patient)===1
      const anc=(wbc*(neutPct+bandPct)/100).toFixed(2)
      const ancNum=parseFloat(anc)
      const fever=temp>=38.3||(temp>=38.0)  // fever = single oral temp >=38.3 or sustained >=38.0 x1h
      const febrileNeutropenia=ancNum<500&&fever&&chemoPatient
      const risk:CalculationResult['risk']=ancNum>=1500?'low':ancNum>=1000?'low':ancNum>=500?'moderate':ancNum>100?'high':'critical'
      const neutropeniaGrade=ancNum>=2000?'Normal (>=2000)':ancNum>=1500?'Grade 0 (1500-1999)':ancNum>=1000?'Grade 1 (1000-1499)':ancNum>=500?'Grade 2 (500-999)':ancNum>100?'Grade 3 (100-499)':'Grade 4 (<100) - profound neutropenia'
      const fnRisk=febrileNeutropenia?'FEBRILE NEUTROPENIA - ONCOLOGIC EMERGENCY: Initiate empiric broad-spectrum antibiotics within 1 hour of presentation. Blood cultures x2 before antibiotics. Do NOT delay for cultures.':
                   ancNum<500&&chemoPatient?'Neutropenic (ANC <500) without fever - monitor temperature every 4h; reverse isolation precautions':
                   ancNum<1000&&chemoPatient?'Mild-moderate neutropenia (ANC 500-1000) - monitor for fever; neutropenic precautions':'ANC adequate - standard monitoring'
      return {
        label: 'ANC', value: anc, unit: 'x10^3/uL',
        interpretation: neutropeniaGrade+'. '+fnRisk+'. Temp: '+temp+'°C'+(fever?' (FEVER PRESENT)':'')+'.',
        risk,
        riskPercentage: febrileNeutropenia?'FEBRILE NEUTROPENIA - emergency':ancNum<500?'Severe neutropenia (Grade 3-4)':undefined,
        guidelineSource: 'ASCO/IDSA Febrile Neutropenia Guidelines 2018 / NCCN Myeloid Growth Factors',
        scoreBreakdown: [
          {component:'WBC', score:wbc+' x10^3/uL'},
          {component:'Neutrophils %', score:neutPct+'%'},
          {component:'Bands %', score:bandPct+'%'},
          {component:'ANC = WBC x (Neut+Bands)/100', score:anc+' x10^3/uL'},
          {component:'Neutropenia Grade', score:neutropeniaGrade},
          {component:'Temperature', score:temp+'°C'+(fever?' - FEVER':'')},
          {component:'Febrile Neutropenia', score:febrileNeutropenia?'YES - EMERGENCY':'No'},
        ],
        details: [
          'ANC: '+anc+' x10^3/uL | '+neutropeniaGrade,
          fnRisk,
          febrileNeutropenia?'-> IMMEDIATE: Blood cultures x2 sites -> empiric piperacillin-tazobactam OR cefepime -> consider vancomycin if MRSA risk':'',
          febrileNeutropenia?'-> Risk stratification (MASCC score): low risk = oral fluoroquinolone outpatient; high risk = IV antibiotics, admit':'',
          febrileNeutropenia?'-> Add antifungal (caspofungin/voriconazole) if fever persists >72-96h on antibiotics':'',
          ancNum<500&&chemoPatient?'-> G-CSF (filgrastim 5mcg/kg/day or pegfilgrastim): PRIMARY prophylaxis if FN risk >20% per cycle':'',
          '-> ANC nadir: typically 7-14 days after chemotherapy - peak risk for febrile neutropenia',
          '-> ANC = WBC x (neutrophils% + bands%) / 100 - verify both neutrophil and band values entered',
        ].filter(Boolean),
      }
    }
  },
  // 3. Blood Transfusion Volume Calculator
  {
    id: 'blood-transfusion-volume-calculator', name: 'Blood Transfusion Volume Calculator', category: 'Oncology',
    icon: '🩸', description: 'Calculate blood transfusion volume needed to achieve target hemoglobin rise',
    formula: 'Volume (mL) = Target Hgb rise (g/dL) x Weight (kg) x 3 | OR Units of pRBC = Target rise / 1 g/dL per unit',
    reference: 'AABB Technical Manual / ASH Transfusion Guidelines / TACO prevention protocols',
    inputs: [
      { id:'weight',     label:'Patient Weight', type:'number', unit:'kg', min:1, max:300, step:0.1, defaultValue:70 },
      { id:'current_hgb',label:'Current Hemoglobin', type:'number', unit:'g/dL', min:1, max:20, step:0.1, defaultValue:7.0, placeholder:'e.g. 7.0' },
      { id:'target_hgb', label:'Target Hemoglobin', type:'number', unit:'g/dL', min:5, max:15, step:0.5, defaultValue:10.0, placeholder:'e.g. 10.0' },
      { id:'hct',        label:'Hematocrit (optional - for pRBC volume calc)', type:'number', unit:'%', min:10, max:60, step:1, defaultValue:35 },
      { id:'patient_type',label:'Patient Setting', type:'select', options:[
        {label:'Adult - stable, non-surgical',value:'adult'},
        {label:'Pediatric (use 10-20 mL/kg)',value:'pediatric'},
        {label:'Cardiac - conservative threshold',value:'cardiac'},
        {label:'Critically ill - restrictive strategy',value:'icu'},
      ], defaultValue:'adult' },
    ],
    calculate(v) {
      const wt=Number(v.weight), currHgb=Number(v.current_hgb), targHgb=Number(v.target_hgb)
      const hct=Number(v.hct), pType=String(v.patient_type)
      const hgbRise=Math.max(0, targHgb-currHgb)
      const volumeMl=Math.round(hgbRise*wt*3)
      const unitsEstimate=Math.ceil(hgbRise/1)  // ~1 g/dL rise per unit pRBC in average adult
      // Transfusion thresholds by setting
      const thresholds:{[k:string]:{trigger:string,target:string}} = {
        adult:    {trigger:'Hgb <7-8 g/dL (symptomatic) or <7 (asymptomatic)', target:'Target Hgb 7-8 g/dL (restrictive preferred by AABB)'},
        pediatric:{trigger:'Hgb <7 g/dL in stable child', target:'Transfuse 10-15 mL/kg pRBC; reassess'},
        cardiac:  {trigger:'Hgb <8 g/dL in ACS/cardiac surgery', target:'Target Hgb 8-10 g/dL per AABB/ACC'},
        icu:      {trigger:'Hgb <7 g/dL (restrictive strategy - TRICC trial)', target:'Target Hgb 7-9 g/dL; restrictive = better outcomes'},
      }
      const thresh=thresholds[pType]||thresholds['adult']
      const risk:CalculationResult['risk']=currHgb<6?'critical':currHgb<7?'high':currHgb<8?'moderate':'low'
      const transfuseNow=currHgb<7||(pType==='cardiac'&&currHgb<8)
      const tacoRisk=pType==='cardiac'||wt<50?'TACO risk: infuse at 1-2 mL/kg/hr (not >4 mL/kg/hr); consider furosemide 20mg after each unit':'Standard rate: one unit over 2-4 hours'
      return {
        label: 'Estimated Volume', value: volumeMl, unit: 'mL',
        interpretation: 'Target Hgb rise: +'+hgbRise.toFixed(1)+' g/dL. Estimated volume: '+volumeMl+'mL (~'+unitsEstimate+' unit'+(unitsEstimate>1?'s':'')+' pRBC). '+thresh.trigger+'. Target: '+thresh.target+'. '+tacoRisk,
        risk,
        riskPercentage: currHgb<7?'Transfusion threshold met (Hgb <7)':currHgb<8?'Near transfusion threshold':undefined,
        guidelineSource: 'AABB Transfusion Thresholds 2021 / Carson JL et al. NEJM 2011 (TRICC/FOCUS)',
        scoreBreakdown: [
          {component:'Current Hemoglobin', score:currHgb+' g/dL'},
          {component:'Target Hemoglobin', score:targHgb+' g/dL'},
          {component:'Hemoglobin Rise Needed', score:'+'+hgbRise.toFixed(1)+' g/dL'},
          {component:'Volume (Hgb rise x Wt x 3)', score:volumeMl+' mL'},
          {component:'Estimated units pRBC', score:'~'+unitsEstimate+' unit(s)'},
          {component:'Transfuse now?', score:transfuseNow?'YES - threshold met':'May not meet threshold - reassess symptoms'},
          {component:'Transfusion threshold', score:thresh.trigger},
          {component:'Target', score:thresh.target},
        ],
        details: [
          'Volume: ~'+volumeMl+'mL (~'+unitsEstimate+' unit(s) pRBC) to raise Hgb by +'+hgbRise.toFixed(1)+' g/dL',
          thresh.trigger+' | Target: '+thresh.target,
          tacoRisk,
          '-> Restrictive strategy (Hgb <7) is non-inferior to liberal (Hgb <10) in most stable patients (TRICC)',
          '-> Type and screen before ordering; type and crossmatch for >2 units',
          '-> Pre-transfusion: verify patient ID, blood type, unit label at bedside - 2-nurse check',
          '-> Reaction monitoring: check at 5min and 15min after starting each unit',
          '-> Iron supplementation + EPO for cancer-related anemia: consider before transfusion if not urgent',
          currHgb<6?'CRITICAL ANEMIA: Consider massive transfusion protocol; address underlying cause':'',
        ].filter(Boolean),
      }
    }
  },
  // 4. INR / PT Converter
  {
    id: 'inr-pt-ratio-converter', name: 'INR / PT / PT% Converter', category: 'Oncology',
    icon: '🧪', description: 'Convert between INR, PT in seconds, and PT activity% - with therapeutic range interpretation for anticoagulation monitoring',
    formula: 'INR = (Patient PT / Mean Normal PT)^ISI | PT% (Quick) = derived from INR using ISI-adjusted formula',
    reference: 'WHO Expert Committee on Biological Standardization / CHEST Antithrombotic Guidelines 2021',
    inputs: [
      { id:'inr',          label:'INR', type:'number', unit:'', min:0.5, max:20, step:0.01, defaultValue:2.5, placeholder:'e.g. 2.5' },
      { id:'mean_norm_pt', label:'Mean Normal PT (laboratory reference)', type:'number', unit:'seconds', min:8, max:15, step:0.1, defaultValue:12.0, placeholder:'e.g. 12.0' },
      { id:'isi',          label:'ISI (International Sensitivity Index of reagent)', type:'number', unit:'', min:0.9, max:2.5, step:0.01, defaultValue:1.0, placeholder:'e.g. 1.0 (check lab reagent; typically 0.9-2.0)' },
      { id:'indication',   label:'Anticoagulation Indication', type:'select', options:[
        {label:'AF / DVT / PE (target INR 2.0-3.0)',value:'standard'},
        {label:'Mechanical mitral valve (target INR 2.5-3.5)',value:'mechanical_mv'},
        {label:'Mechanical aortic valve, low risk (target INR 2.0-3.0)',value:'mechanical_av'},
        {label:'APS / recurrent PE (target INR 2.0-3.0 or 3.0-4.0)',value:'aps'},
        {label:'Bridging / therapeutic monitoring only',value:'monitoring'},
      ], defaultValue:'standard' },
    ],
    calculate(v) {
      const inr=Number(v.inr), mnPT=Number(v.mean_norm_pt), isi=Number(v.isi)
      const indication=String(v.indication)
      // PT in seconds: Patient PT = INR^(1/ISI) x MeanNormalPT
      const patientPT=(Math.pow(inr, 1/isi)*mnPT).toFixed(1)
      // PT% (Owren / Quick) approximation
      const ptPct=Math.round(100/inr)
      // Target ranges by indication
      const TARGETS:{[k:string]:{min:number,max:number,label:string}} = {
        standard:     {min:2.0, max:3.0, label:'AF / DVT / PE target: 2.0-3.0'},
        mechanical_mv:{min:2.5, max:3.5, label:'Mechanical mitral valve target: 2.5-3.5'},
        mechanical_av:{min:2.0, max:3.0, label:'Mechanical aortic valve target: 2.0-3.0'},
        aps:          {min:2.0, max:3.0, label:'APS target: 2.0-3.0 (triple positive: 3.0-4.0)'},
        monitoring:   {min:1.5, max:4.0, label:'Therapeutic monitoring - clinical context required'},
      }
      const target=TARGETS[indication]||TARGETS['standard']
      const inTarget=inr>=target.min&&inr<=target.max
      const supratherapeutic=inr>target.max
      const subtherapeutic=inr<target.min
      const risk:CalculationResult['risk']=inr>5?'critical':inr>3.5&&indication==='standard'?'high':inTarget?'low':'moderate'
      const status=inTarget?'Therapeutic - within target range':supratherapeutic?'Supratherapeutic - consider dose reduction or hold':'Subtherapeutic - consider dose increase'
      const bleedingRisk=inr>4?'HIGH BLEEDING RISK (INR >4): assess for active bleeding; consider holding warfarin; INR >9 without bleeding: vitamin K 2.5-5mg oral':''
      return {
        label: 'INR', value: inr.toFixed(2), unit: '',
        interpretation: 'INR: '+inr+' | PT: ~'+patientPT+'s | PT%: ~'+ptPct+'%. Target ('+indication+'): '+target.label+'. Status: '+status+'. '+bleedingRisk,
        risk,
        riskPercentage: inTarget?'Therapeutic range ('+target.min+'-'+target.max+')':status,
        guidelineSource: 'CHEST Antithrombotic Guidelines 2021 / WHO ISI Standardization',
        scoreBreakdown: [
          {component:'INR', score:inr.toFixed(2)},
          {component:'Estimated PT (seconds)', score:'~'+patientPT+'s (MN PT: '+mnPT+'s, ISI: '+isi+')'},
          {component:'PT% (Quick/Owren)', score:'~'+ptPct+'%'},
          {component:'Indication', score:indication.replace('_',' ')},
          {component:'Target INR range', score:target.min+'-'+target.max},
          {component:'Status', score:status},
        ],
        details: [
          'INR: '+inr+' | Target: '+target.min+'-'+target.max+' ('+indication.replace('_',' ')+') | Status: '+status,
          bleedingRisk,
          inr<target.min?'-> Subtherapeutic: assess compliance, dietary vitamin K, drug interactions; increase dose 5-15%':'',
          inr>target.max&&inr<=4.5?'-> Supratherapeutic: hold 1 dose; reduce maintenance dose 5-15%; recheck in 1-2 weeks':'',
          inr>4.5&&inr<=9?'-> INR 4.5-9 (no bleeding): hold warfarin 1-2 doses; vitamin K 1-2.5mg oral optional':'',
          inr>9?'-> INR >9 (no bleeding): hold warfarin; vitamin K 2.5-5mg oral; recheck in 24h':'',
          '-> INR with active major bleeding: 4-factor PCC (KCentra) + vitamin K 5-10mg IV',
          '-> Interacting medications causing elevated INR: azole antifungals, antibiotics, amiodarone, NSAIDs',
          '-> TTR >70% (time in therapeutic range): target for optimal anticoagulation quality',
        ].filter(Boolean),
      }
    }
  },
  // 5. PSA Velocity / Doubling Time
  {
    id: 'psa-velocity-doubling-time', name: 'PSA Velocity & Doubling Time Calculator', category: 'Oncology',
    icon: '📈', description: 'Calculate PSA velocity and PSA doubling time to assess prostate cancer risk and progression',
    formula: 'PSA velocity (ng/mL/year) = (PSA2 - PSA1) / time_years | Doubling time = (0.693 x time_years) / ln(PSA2/PSA1)',
    reference: 'D Amico AV et al. NEJM 2004 / AUA/ASTRO/SUO Prostate Cancer Guidelines 2022',
    inputs: [
      { id:'psa1',       label:'First PSA Value', type:'number', unit:'ng/mL', min:0.01, max:1000, step:0.01, defaultValue:3.5, placeholder:'e.g. 3.5' },
      { id:'psa2',       label:'Second PSA Value (most recent)', type:'number', unit:'ng/mL', min:0.01, max:1000, step:0.01, defaultValue:5.2, placeholder:'e.g. 5.2' },
      { id:'months',     label:'Time Between Measurements', type:'number', unit:'months', min:1, max:120, step:1, defaultValue:12, placeholder:'e.g. 12' },
      { id:'prostate_vol',label:'Prostate Volume (for PSA density, optional; 0 = skip)', type:'number', unit:'mL (cc)', min:0, max:300, step:1, defaultValue:0, placeholder:'From TRUS or MRI; e.g. 35' },
      { id:'age',        label:'Patient Age', type:'number', unit:'years', min:40, max:100, defaultValue:65 },
    ],
    calculate(v) {
      const psa1=Number(v.psa1), psa2=Number(v.psa2), months=Number(v.months)
      const prostVol=Number(v.prostate_vol), age=Number(v.age)
      const years=months/12
      const velocity=(psa2-psa1)/years
      const doublingTime=psa2>psa1?(0.693*years)/Math.log(psa2/psa1):Infinity
      const psaDensity=prostVol>0?psa2/prostVol:null
      const risk:CalculationResult['risk']=velocity>0.75||psa2>10?'high':velocity>0.35||psa2>4?'moderate':'low'
      const velInterp=velocity>0.75?'PSA velocity >0.75 ng/mL/year: associated with increased prostate cancer risk and mortality (D\'Amico criteria)':
                      velocity>0.35?'PSA velocity >0.35 ng/mL/year in men with PSA <4: consider biopsy':
                      velocity>0?'Rising PSA but below high-risk threshold - repeat in 6-12 months':'PSA stable or declining'
      const dtInterp=doublingTime<Infinity?'PSA doubling time: '+doublingTime.toFixed(1)+' years ('+(doublingTime<3?'RAPID - aggressive biology possible':doublingTime<10?'Intermediate':' Slow - favorable')+')':''
      const densityInterp=psaDensity!==null?'PSA density: '+psaDensity.toFixed(3)+' ng/mL/cc ('+(psaDensity>0.15?'ELEVATED >0.15 - biopsy recommended':'<0.15 - lower cancer risk')+')':''
      const ageAdjPSA=age<50?2.0:age<60?3.0:age<70?4.0:5.5
      const biopsyIndication=psa2>10||(velocity>0.75&&psa2>3)|(psaDensity!==null&&psaDensity>0.15)?'Prostate biopsy strongly indicated based on PSA kinetics and/or density':'Biopsy decision based on full clinical picture + multiparametric MRI'
      return {
        label: 'PSA Velocity', value: velocity.toFixed(2), unit: 'ng/mL/year',
        interpretation: velInterp+'. '+dtInterp+'. '+densityInterp+'. Age-adjusted PSA upper limit: '+ageAdjPSA+' ng/mL. '+biopsyIndication,
        risk,
        riskPercentage: velocity>0.75?'PSA velocity >0.75 ng/mL/yr - high risk':dtInterp.split('(')[1]?.replace(')',''),
        guidelineSource: 'D\'Amico AV et al. NEJM 2004 / AUA Prostate Cancer Guidelines 2022',
        scoreBreakdown: [
          {component:'PSA 1 (baseline)', score:psa1+' ng/mL'},
          {component:'PSA 2 (current)', score:psa2+' ng/mL'},
          {component:'Time interval', score:months+' months ('+years.toFixed(1)+' years)'},
          {component:'PSA Velocity', score:velocity.toFixed(2)+' ng/mL/year'},
          {component:'PSA Doubling Time', score:doublingTime<Infinity?doublingTime.toFixed(1)+' years':'N/A (PSA not rising)'},
          {component:'PSA Density', score:psaDensity!==null?(psaDensity.toFixed(3)+' ng/mL/cc (vol: '+prostVol+'mL)'):'Not calculated (no volume)'},
          {component:'Age-adjusted PSA threshold', score:'<'+ageAdjPSA+' ng/mL for age '+age},
          {component:'Biopsy indication', score:biopsyIndication},
        ],
        details: [
          'PSA velocity: '+velocity.toFixed(2)+' ng/mL/yr | '+velInterp,
          dtInterp,
          densityInterp,
          '-> Age-adjusted PSA thresholds: <50yr: 2.5, 50-60yr: 3.5, 60-70yr: 4.5, >70yr: 6.5 ng/mL',
          '-> Multiparametric MRI (mpMRI) before biopsy: PI-RADS >=3 increases diagnostic yield',
          '-> PSA velocity >0.75 ng/mL/yr: D\'Amico association with PCa death even after radical prostatectomy',
          '-> PSA doubling time <3 months post-treatment: high risk of systemic progression',
          '-> Free PSA %: <10% = 56% risk of cancer; >25% = 8% risk - useful for intermediate PSA 4-10',
          '-> AUA: PSA screening discussion starting age 40-54 (high risk) or 55-69 (average risk)',
        ],
      }
    }
  },
  // 6. TNM Staging Interpreter
  {
    id: 'tnm-staging-interpreter', name: 'TNM Staging Interpreter (AJCC 8th Edition)', category: 'Oncology',
    icon: '📋', description: 'Interpret TNM staging and group into AJCC 8th edition stage for common solid tumors with survival estimates',
    formula: 'T (tumor size/invasion) + N (nodal involvement) + M (distant metastasis) = Stage I-IV per AJCC 8th Ed.',
    reference: 'AJCC Cancer Staging Manual 8th Edition (2017) / NCCN Guidelines',
    inputs: [
      { id:'cancer_type', label:'Cancer Type', type:'select', options:[
        {label:'Breast Cancer',value:'breast'},
        {label:'Lung Cancer (NSCLC)',value:'lung'},
        {label:'Colorectal Cancer',value:'colorectal'},
        {label:'Prostate Cancer',value:'prostate'},
        {label:'Melanoma',value:'melanoma'},
      ], defaultValue:'colorectal' },
      { id:'t_stage', label:'T Stage', type:'select', options:[
        {label:'T1 - Small/superficial tumor',value:'T1'},
        {label:'T2 - Larger/deeper invasion',value:'T2'},
        {label:'T3 - Extension to adjacent structures',value:'T3'},
        {label:'T4 - Invasion of vital structures',value:'T4'},
        {label:'T0 - No primary tumor',value:'T0'},
        {label:'Tis - In situ',value:'Tis'},
      ], defaultValue:'T2' },
      { id:'n_stage', label:'N Stage', type:'select', options:[
        {label:'N0 - No regional node involvement',value:'N0'},
        {label:'N1 - 1-3 regional nodes involved',value:'N1'},
        {label:'N2 - 4+ or fixed nodes',value:'N2'},
        {label:'N3 - Distant node groups involved',value:'N3'},
      ], defaultValue:'N0' },
      { id:'m_stage', label:'M Stage', type:'select', options:[
        {label:'M0 - No distant metastases',value:'M0'},
        {label:'M1 - Distant metastases present',value:'M1'},
      ], defaultValue:'M0' },
    ],
    calculate(v) {
      const cancer=String(v.cancer_type), T=String(v.t_stage), N=String(v.n_stage), M=String(v.m_stage)
      // Simplified stage grouping
      let stage:string, survival5yr:string, management:string
      if(M==='M1'){ stage='Stage IV'; survival5yr='<20% (varies by site and treatment)'; management='Palliative systemic therapy (targeted, immunotherapy, or chemotherapy) + best supportive care' }
      else if(N==='N2'||N==='N3'){ stage='Stage III'; survival5yr='30-60% depending on cancer type'; management='Multimodality treatment: surgery + chemotherapy and/or radiation; neoadjuvant approach for some tumors' }
      else if(N==='N1'){ stage='Stage IIB-IIIA'; survival5yr='40-75%'; management='Surgery + adjuvant chemotherapy +/- radiation; lymph node dissection' }
      else if(T==='T3'||T==='T4'){ stage='Stage IIB'; survival5yr='50-75%'; management='Surgery with wide margins + adjuvant therapy; neoadjuvant if locally advanced' }
      else if(T==='T2'&&N==='N0'){ stage='Stage I-II'; survival5yr='75-90%'; management='Surgery with curative intent; adjuvant therapy if high-risk features present' }
      else if(T==='T1'||T==='Tis'){ stage='Stage 0-I'; survival5yr='>90%'; management='Surgery/local excision with curative intent; excellent prognosis' }
      else { stage='Stage I-II'; survival5yr='75-90%'; management='Surgery with curative intent' }
      // Cancer-specific notes
      const cancerNotes:{[k:string]:string} = {
        breast:'Breast: also requires hormone receptor (ER/PR), HER2, and Ki67 for complete staging (clinical + biomarker stage)',
        lung:'Lung NSCLC: Stage I-II = surgery (VATS); Stage III = chemoradiotherapy; Stage IV = targeted/immunotherapy',
        colorectal:'Colorectal: Stage I-III = surgery +/- adjuvant FOLFOX; Stage IV = systemic therapy; MSI-H = pembrolizumab',
        prostate:'Prostate: stage alone insufficient - also needs PSA, Gleason/Grade Group for risk stratification',
        melanoma:'Melanoma: BRAF/MEK mutation testing for all Stage III-IV; immunotherapy (pembrolizumab) first-line Stage III-IV',
      }
      const risk:CalculationResult['risk']=M==='M1'?'critical':N!=='N0'?'high':T==='T3'||T==='T4'?'moderate':'low'
      return {
        label: 'AJCC Stage', value: stage,
        interpretation: cancer.charAt(0).toUpperCase()+cancer.slice(1)+' | T:'+T+' N:'+N+' M:'+M+' = '+stage+'. 5-year survival: '+survival5yr+'. Management: '+management+'. '+cancerNotes[cancer],
        risk,
        riskPercentage: '5-year survival: '+survival5yr,
        guidelineSource: 'AJCC Cancer Staging Manual 8th Edition 2017 / NCCN Guidelines',
        scoreBreakdown: [
          {component:'Cancer Type', score:cancer},
          {component:'T Stage', score:T},
          {component:'N Stage', score:N},
          {component:'M Stage', score:M},
          {component:'AJCC Stage', score:stage},
          {component:'5-Year Survival', score:survival5yr},
          {component:'Primary Management', score:management.split(';')[0]},
        ],
        details: [
          cancer+' | '+T+' '+N+' '+M+' = '+stage+' | 5-yr survival: '+survival5yr,
          'Management: '+management,
          cancerNotes[cancer],
          '-> TNM requires pathological staging (pTNM) after surgery for definitive staging',
          '-> Clinical staging (cTNM) from imaging guides treatment planning pre-operatively',
          '-> Stage migration: PET-CT and sentinel node biopsy upstage 15-20% of patients vs CT alone',
          '-> Molecular markers: EGFR/ALK/ROS1 (lung), KRAS/MSI (colorectal), BRCA (breast/ovary) guide targeted therapy',
          '-> Multidisciplinary tumor board review recommended for all cancer patients before treatment',
        ],
      }
    }
  },
  // 7. IPSS Myelodysplastic Syndrome Score
  {
    id: 'ipss-mds-score', name: 'IPSS-R Myelodysplastic Syndrome Score', category: 'Oncology',
    icon: '🔬', description: 'Assess MDS prognosis using the Revised International Prognostic Scoring System (IPSS-R) to guide treatment decisions',
    formula: 'IPSS-R = Cytogenetics + BM blasts% + Hemoglobin + Platelets + ANC (weighted sum)',
    reference: 'Greenberg PL et al. Blood 2012 (IPSS-R) / NCCN MDS Guidelines 2023',
    inputs: [
      { id:'cytogenetics', label:'Cytogenetics', type:'select', options:[
        {label:'Very good: -Y or del(11q) (0 pts)',value:0},
        {label:'Good: normal, del(5q), del(12p), del(20q) (1 pt)',value:1},
        {label:'Intermediate: del(7q), +8, +19, i(17q), any other single (2 pts)',value:2},
        {label:'Poor: -7, inv(3), t(3q), del(3q), two chr7 abnormalities (3 pts)',value:3},
        {label:'Very poor: complex >=3 abnormalities (4 pts)',value:4},
      ], defaultValue:1 },
      { id:'bm_blasts', label:'Bone Marrow Blasts %', type:'select', options:[
        {label:'<=2% (0 pts)',value:0},
        {label:'>2 to 5% (1 pt)',value:1},
        {label:'>5 to 10% (2 pts)',value:2},
        {label:'>10% (3 pts)',value:3},
      ], defaultValue:0 },
      { id:'hemoglobin', label:'Hemoglobin', type:'select', options:[
        {label:'>=10 g/dL (0 pts)',value:0},
        {label:'8 to <10 g/dL (1 pt)',value:1},
        {label:'<8 g/dL (1.5 pts)',value:1.5},
      ], defaultValue:0 },
      { id:'platelets', label:'Platelet Count', type:'select', options:[
        {label:'>=100 x10^9/L (0 pts)',value:0},
        {label:'50 to <100 x10^9/L (0.5 pts)',value:0.5},
        {label:'<50 x10^9/L (1 pt)',value:1},
      ], defaultValue:0 },
      { id:'anc_mds', label:'ANC (Absolute Neutrophil Count)', type:'select', options:[
        {label:'>=0.8 x10^9/L (0 pts)',value:0},
        {label:'<0.8 x10^9/L (0.5 pts)',value:0.5},
      ], defaultValue:0 },
    ],
    calculate(v) {
      const score=Number(v.cytogenetics)+Number(v.bm_blasts)+Number(v.hemoglobin)+Number(v.platelets)+Number(v.anc_mds)
      let riskGroup:string, medianSurvival:string, alsSurvival:string, management:string
      if(score<=1.5){ riskGroup='Very Low (<=1.5)'; medianSurvival='8.8 years'; alsSurvival='NR'; management='Observation or ESA/G-CSF for symptomatic cytopenias' }
      else if(score<=3){ riskGroup='Low (1.5-3)'; medianSurvival='5.3 years'; alsSurvival='NR'; management='Lenalidomide for del(5q); ESA; observation vs treat based on symptoms' }
      else if(score<=4.5){ riskGroup='Intermediate (3-4.5)'; medianSurvival='3.0 years'; alsSurvival='3.2 years'; management='Hypomethylating agents (azacitidine/decitabine); alloSCT evaluation if eligible' }
      else if(score<=6){ riskGroup='High (4.5-6)'; medianSurvival='1.6 years'; alsSurvival='1.4 years'; management='Hypomethylating agents; alloSCT if eligible (preferred if <70 and fit)' }
      else{ riskGroup='Very High (>6)'; medianSurvival='0.8 years'; alsSurvival='0.7 years'; management='AlloSCT if eligible; hypomethylating agent as bridge; clinical trial' }
      const risk:CalculationResult['risk']=score<=3?'low':score<=4.5?'moderate':score<=6?'high':'critical'
      return {
        label: 'IPSS-R Risk Group', value: riskGroup,
        interpretation: 'IPSS-R score: '+score+' - '+riskGroup+'. Median survival: '+medianSurvival+'. ALS (time to AML): '+alsSurvival+'. Management: '+management,
        risk,
        riskPercentage: 'Median survival: '+medianSurvival,
        guidelineSource: 'Greenberg PL et al. Blood 2012 (IPSS-R) / NCCN MDS Guidelines 2023',
        scoreBreakdown: [
          {component:'Cytogenetics', score:Number(v.cytogenetics), max:4},
          {component:'BM Blasts %', score:Number(v.bm_blasts), max:3},
          {component:'Hemoglobin', score:Number(v.hemoglobin), max:1.5},
          {component:'Platelet Count', score:Number(v.platelets), max:1},
          {component:'ANC', score:Number(v.anc_mds), max:0.5},
          {component:'TOTAL IPSS-R Score', score},
          {component:'Risk Group', score:riskGroup},
          {component:'Median Survival', score:medianSurvival},
          {component:'Time to AML (ALS)', score:alsSurvival},
        ],
        details: [
          'IPSS-R: '+score+' - '+riskGroup+' | Median survival: '+medianSurvival,
          'Management: '+management,
          '-> MDS-specific scoring: always perform cytogenetics at diagnosis (critical for IPSS-R)',
          '-> Azacitidine (75mg/m2 SC x7 days q28 days): prolongs survival in intermediate-high risk',
          '-> AlloSCT: only curative option; evaluate all patients <70 with intermediate-high risk',
          '-> Lenalidomide: highly effective for del(5q) MDS regardless of IPSS-R',
          '-> Luspatercept (ESA refractory): for RS-positive (SF3B1 mutation) lower-risk MDS',
          '-> Venetoclax combinations: emerging role in high-risk/AML transformation',
        ],
      }
    }
  },
  // 8. Cancer Survival Probability (MASCC Febrile Neutropenia)
  {
    id: 'cancer-survival-probability', name: 'MASCC Febrile Neutropenia Risk Score', category: 'Oncology',
    icon: '🏥', description: 'Stratify febrile neutropenia patients into low and high risk using MASCC score to guide inpatient vs outpatient management',
    formula: 'MASCC score = burden of illness + no hypotension + no COPD + solid tumor or no prior fungal + no dehydration + outpatient + age <60',
    reference: 'Klastersky J et al. JCO 2000 (MASCC) / ASCO/IDSA Febrile Neutropenia Guidelines 2018',
    inputs: [
      { id:'burden',      label:'Burden of Febrile Neutropenia Illness', type:'select', options:[
        {label:'No or mild symptoms (5 pts)',value:5},
        {label:'Moderate symptoms (3 pts)',value:3},
        {label:'Severe symptoms (0 pts)',value:0},
      ], defaultValue:5 },
      { id:'no_hypotension', label:'No Hypotension (SBP >=90 mmHg) (+5 pts)', type:'select', options:[{label:'No hypotension - Yes add pts',value:5},{label:'Hypotension present - 0 pts',value:0}], defaultValue:5 },
      { id:'no_copd',     label:'No COPD (+4 pts)', type:'select', options:[{label:'No COPD',value:4},{label:'Has COPD',value:0}], defaultValue:4 },
      { id:'solid_tumor', label:'Solid tumor OR no prior fungal infection (+4 pts)', type:'select', options:[{label:'Solid tumor or no prior fungal',value:4},{label:'Hematologic malignancy + prior fungal infection',value:0}], defaultValue:4 },
      { id:'no_dehydration',label:'No Dehydration (+3 pts)', type:'select', options:[{label:'No dehydration',value:3},{label:'Dehydrated',value:0}], defaultValue:3 },
      { id:'outpatient',  label:'Outpatient at Onset (+3 pts)', type:'select', options:[{label:'Outpatient (home) at onset',value:3},{label:'Inpatient at onset',value:0}], defaultValue:3 },
      { id:'age_lt60',    label:'Age <60 Years (+2 pts)', type:'select', options:[{label:'Age <60',value:2},{label:'Age >=60',value:0}], defaultValue:2 },
    ],
    calculate(v) {
      const score=['burden','no_hypotension','no_copd','solid_tumor','no_dehydration','outpatient','age_lt60'].reduce((s,k)=>s+Number(v[k]),0)
      const lowRisk=score>=21
      const risk:CalculationResult['risk']=lowRisk?'low':'high'
      const category=lowRisk?'LOW RISK (MASCC >=21) - outpatient oral antibiotic therapy appropriate':'HIGH RISK (MASCC <21) - hospital admission required, IV antibiotics'
      const management=lowRisk?
        'Outpatient oral antibiotic therapy: ciprofloxacin 750mg BID + amoxicillin-clavulanate 875/125mg BID x7-14 days. Reliable follow-up required; return immediately if worsening.':
        'Hospital admission: IV piperacillin-tazobactam 4.5g q6h OR cefepime 2g q8h. Blood cultures x2 before antibiotics. Add vancomycin if MRSA risk, mucositis, catheter-related. Antifungal if fever >72-96h.'
      const successRate=lowRisk?'Low-risk outpatient: success rate ~97%':'High-risk inpatient: mortality 5-10% if appropriately treated'
      return {
        label: 'MASCC Score', value: score, unit: '/26',
        interpretation: category+'. '+management+'. '+successRate,
        risk,
        riskPercentage: lowRisk?'Low risk - 97% complication-free survival':'High risk - IV antibiotics and admission required',
        guidelineSource: 'Klastersky J et al. JCO 2000 / ASCO/IDSA Febrile Neutropenia Guidelines 2018',
        scoreBreakdown: [
          {component:'Burden of illness', score:Number(v.burden), max:5},
          {component:'No hypotension', score:Number(v.no_hypotension), max:5},
          {component:'No COPD', score:Number(v.no_copd), max:4},
          {component:'Solid tumor / no prior fungal', score:Number(v.solid_tumor), max:4},
          {component:'No dehydration', score:Number(v.no_dehydration), max:3},
          {component:'Outpatient at onset', score:Number(v.outpatient), max:3},
          {component:'Age <60', score:Number(v.age_lt60), max:2},
          {component:'TOTAL MASCC', score, max:26},
          {component:'Risk Category', score:lowRisk?'LOW RISK (>=21)':'HIGH RISK (<21)'},
        ],
        details: [
          'MASCC: '+score+'/26 - '+category,
          'Management: '+management,
          successRate,
          '-> MASCC is validated only after clinical assessment - not a triage tool alone',
          '-> Even low-risk: patient must have reliable access to emergency care and telephone follow-up',
          '-> G-CSF (filgrastim): shortens duration of neutropenia; consider if high-risk features or delayed recovery',
          '-> Fluoroquinolone prophylaxis during expected nadir: reduces FN hospitalizations (AML, SCT patients)',
          '-> Vancomycin indications: MRSA risk, severe mucositis, suspected catheter infection, pneumonia, hemodynamic instability',
        ],
      }
    }
  },
]
`;

const newContent = c.slice(0, START) + newSection + c.slice(END);
fs.writeFileSync(configPath, newContent, 'utf8');
console.log('SUCCESS. New file length:', newContent.length);
