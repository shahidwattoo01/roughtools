export type BoardId =
  | 'lahore'
  | 'faisalabad'
  | 'multan'
  | 'gujranwala'
  | 'rawalpindi'
  | 'federal'
  | 'sindh'
  | 'balochistan'
  | 'kp';
export type ClassLevel = 9 | 10 | 11 | 12;
export type Medium = 'english' | 'urdu' | 'bilingual';
export type SubjectGroup = 'science' | 'arts' | 'commerce' | 'ics' | 'general';
export type QuestionType = 'mcq' | 'short' | 'long' | 'fill' | 'truefalse' | 'matching';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Board {
  id: BoardId;
  name: string;
  nameUrdu: string;
  province: string;
  classes: ClassLevel[];
}

export interface Subject {
  id: string;
  name: string;
  nameUrdu: string;
  classes: ClassLevel[];
  boards: BoardId[] | 'all';
  groups: SubjectGroup[];
  chapters: Chapter[];
}

export interface Chapter {
  number: number;
  name: string;
  nameUrdu: string;
  topics: string[];
}

export interface BoardPattern {
  boardId: BoardId;
  classLevel: ClassLevel;
  subjectId: string;
  totalMarks: number;
  timeMinutes: number;
  sections: PatternSection[];
}

export interface PatternSection {
  title: string;
  questionType: QuestionType;
  totalQuestions: number;
  attemptQuestions: number;
  marksPerQuestion: number;
  instructions: string;
}

export const BOARDS: Board[] = [
  {
    id: 'lahore',
    name: 'Lahore Board',
    nameUrdu: 'لاہور بورڈ',
    province: 'Punjab',
    classes: [9, 10, 11, 12],
  },
  {
    id: 'faisalabad',
    name: 'Faisalabad Board',
    nameUrdu: 'فیصل آباد بورڈ',
    province: 'Punjab',
    classes: [9, 10, 11, 12],
  },
  {
    id: 'multan',
    name: 'Multan Board',
    nameUrdu: 'ملتان بورڈ',
    province: 'Punjab',
    classes: [9, 10, 11, 12],
  },
  {
    id: 'gujranwala',
    name: 'Gujranwala Board',
    nameUrdu: 'گوجرانوالہ بورڈ',
    province: 'Punjab',
    classes: [9, 10, 11, 12],
  },
  {
    id: 'rawalpindi',
    name: 'Rawalpindi Board',
    nameUrdu: 'راولپنڈی بورڈ',
    province: 'Punjab',
    classes: [9, 10, 11, 12],
  },
  {
    id: 'federal',
    name: 'Federal Board',
    nameUrdu: 'فیڈرل بورڈ',
    province: 'Federal',
    classes: [9, 10, 11, 12],
  },
  {
    id: 'sindh',
    name: 'Sindh Board',
    nameUrdu: 'سندھ بورڈ',
    province: 'Sindh',
    classes: [9, 10, 11, 12],
  },
  {
    id: 'balochistan',
    name: 'Balochistan Board',
    nameUrdu: 'بلوچستان بورڈ',
    province: 'Balochistan',
    classes: [9, 10, 11, 12],
  },
  {
    id: 'kp',
    name: 'KP Board',
    nameUrdu: 'خیبر پختونخوا بورڈ',
    province: 'KPK',
    classes: [9, 10, 11, 12],
  },
];

export const SUBJECTS: Subject[] = [
  {
    id: 'physics',
    name: 'Physics',
    nameUrdu: 'طبیعیات',
    classes: [9, 10, 11, 12],
    boards: 'all',
    groups: ['science'],
    chapters: [
      {
        number: 1,
        name: 'Physical Quantities & Measurement',
        nameUrdu: 'طبیعی مقدار اور پیمائش',
        topics: ['Base quantities', 'Units', 'Scientific notation', 'Errors'],
      },
      {
        number: 2,
        name: 'Kinematics',
        nameUrdu: 'حرکیات',
        topics: [
          'Distance & displacement',
          'Speed & velocity',
          'Acceleration',
          'Equations of motion',
          'Graphs',
        ],
      },
      {
        number: 3,
        name: 'Dynamics',
        nameUrdu: 'حرکیاتی',
        topics: ["Newton's laws", 'Friction', 'Momentum', 'Collision'],
      },
      {
        number: 4,
        name: 'Turning Effect of Forces',
        nameUrdu: 'قوتوں کا گھماؤ اثر',
        topics: ['Torque', 'Couple', 'Equilibrium', 'Centre of gravity'],
      },
      {
        number: 5,
        name: 'Gravitation',
        nameUrdu: 'کشش ثقل',
        topics: ['Law of gravitation', 'Mass & weight', 'Satellites', 'Orbital velocity'],
      },
      {
        number: 6,
        name: 'Work & Energy',
        nameUrdu: 'کام اور توانائی',
        topics: ['Work', 'Kinetic energy', 'Potential energy', 'Power', 'Conservation'],
      },
      {
        number: 7,
        name: 'Properties of Matter',
        nameUrdu: 'مادے کی خصوصیات',
        topics: ['Kinetic theory', 'Elasticity', 'Pressure', 'Archimedes principle'],
      },
      {
        number: 8,
        name: 'Thermal Properties',
        nameUrdu: 'حرارتی خصوصیات',
        topics: ['Temperature', 'Heat capacity', 'Expansion', 'Transfer of heat'],
      },
      {
        number: 9,
        name: 'Transfer of Heat',
        nameUrdu: 'حرارت کی منتقلی',
        topics: ['Conduction', 'Convection', 'Radiation', 'Greenhouse effect'],
      },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    nameUrdu: 'کیمیا',
    classes: [9, 10, 11, 12],
    boards: 'all',
    groups: ['science'],
    chapters: [
      {
        number: 1,
        name: 'Fundamentals of Chemistry',
        nameUrdu: 'کیمیا کی بنیادیں',
        topics: ['Branches', 'Matter', 'Atom', 'Molecule', 'Formula writing'],
      },
      {
        number: 2,
        name: 'Structure of Atoms',
        nameUrdu: 'ایٹم کی ساخت',
        topics: [
          'Sub-atomic particles',
          'Atomic number',
          'Mass number',
          'Isotopes',
          'Electronic config',
        ],
      },
      {
        number: 3,
        name: 'Periodic Table',
        nameUrdu: 'دوری جدول',
        topics: ['Periods', 'Groups', 'Properties trends', 'Metals vs non-metals'],
      },
      {
        number: 4,
        name: 'Structure of Molecules',
        nameUrdu: 'مالیکیول کی ساخت',
        topics: ['Ionic bond', 'Covalent bond', 'Electronegativity', 'Polarity'],
      },
      {
        number: 5,
        name: 'Physical States of Matter',
        nameUrdu: 'مادے کی طبیعی حالتیں',
        topics: ['Gases', 'Liquids', 'Solids', 'Plasma'],
      },
      {
        number: 6,
        name: 'Solutions',
        nameUrdu: 'محلول',
        topics: ['Types', 'Concentration', 'Solubility', 'Colligative properties'],
      },
      {
        number: 7,
        name: 'Electrochemistry',
        nameUrdu: 'برقی کیمیا',
        topics: ['Electrolysis', 'Galvanic cell', 'Corrosion', 'Faraday laws'],
      },
      {
        number: 8,
        name: 'Chemical Reactivity',
        nameUrdu: 'کیمیائی فعالیت',
        topics: ['Oxidation', 'Reduction', 'Acids & bases', 'Salts', 'pH'],
      },
    ],
  },
  {
    id: 'biology',
    name: 'Biology',
    nameUrdu: 'حیاتیات',
    classes: [9, 10, 11, 12],
    boards: 'all',
    groups: ['science'],
    chapters: [
      {
        number: 1,
        name: 'Introduction to Biology',
        nameUrdu: 'حیاتیات کا تعارف',
        topics: ['Branches', 'Organization of life', 'Scientific method'],
      },
      {
        number: 2,
        name: 'Solving a Biological Problem',
        nameUrdu: 'حیاتیاتی مسئلہ کا حل',
        topics: ['Hypothesis', 'Variables', 'Data analysis', 'Conclusion'],
      },
      {
        number: 3,
        name: 'Biodiversity',
        nameUrdu: 'حیاتیاتی تنوع',
        topics: ['Classification', 'Five kingdoms', 'Taxonomy', 'Binomial nomenclature'],
      },
      {
        number: 4,
        name: 'Cells & Tissues',
        nameUrdu: 'خلیے اور نسیج',
        topics: ['Cell theory', 'Prokaryotes', 'Eukaryotes', 'Cell organelles', 'Tissues'],
      },
      {
        number: 5,
        name: 'Cell Cycle',
        nameUrdu: 'خلیاتی چکر',
        topics: ['Interphase', 'Mitosis', 'Meiosis', 'Cancer'],
      },
      {
        number: 6,
        name: 'Enzymes',
        nameUrdu: 'خامرے',
        topics: ['Properties', 'Mode of action', 'Factors', 'Inhibition'],
      },
      {
        number: 7,
        name: 'Bioenergetics',
        nameUrdu: 'حیاتی توانائیات',
        topics: ['Photosynthesis', 'Respiration', 'ATP', 'Fermentation'],
      },
      {
        number: 8,
        name: 'Nutrition',
        nameUrdu: 'تغذیہ',
        topics: ['Nutrients', 'Digestion', 'Absorption', 'Malnutrition'],
      },
    ],
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    nameUrdu: 'ریاضی',
    classes: [9, 10, 11, 12],
    boards: 'all',
    groups: ['science', 'ics', 'arts', 'commerce'],
    chapters: [
      {
        number: 1,
        name: 'Matrices & Determinants',
        nameUrdu: 'میٹرکس اور تعینات',
        topics: ['Types of matrices', 'Operations', 'Determinant', 'Inverse matrix'],
      },
      {
        number: 2,
        name: 'Real & Complex Numbers',
        nameUrdu: 'حقیقی اور مختلط اعداد',
        topics: ['Properties', 'Complex numbers', 'Argand plane', 'Absolute value'],
      },
      {
        number: 3,
        name: 'Logarithms',
        nameUrdu: 'لوگارتھم',
        topics: ['Laws', 'Common log', 'Natural log', 'Applications'],
      },
      {
        number: 4,
        name: 'Algebraic Expressions',
        nameUrdu: 'الجبری اظہار',
        topics: ['Factorization', 'HCF/LCM', 'Algebraic fractions'],
      },
      {
        number: 5,
        name: 'Factorization',
        nameUrdu: 'تخصیص',
        topics: ['Factor theorem', 'Remainder theorem', 'Synthetic division'],
      },
      {
        number: 6,
        name: 'Algebraic Manipulation',
        nameUrdu: 'الجبری ترتیب',
        topics: ['HCF', 'LCM', 'Square root of algebraic expressions'],
      },
      {
        number: 7,
        name: 'Linear Equations',
        nameUrdu: 'خطی معادلے',
        topics: ['One variable', 'Two variables', 'System of equations', 'Word problems'],
      },
      {
        number: 8,
        name: 'Linear Graphs',
        nameUrdu: 'خطی گراف',
        topics: ['Cartesian plane', 'Slope', 'Intercepts', 'Simultaneous equations'],
      },
    ],
  },
  {
    id: 'computer',
    name: 'Computer Science',
    nameUrdu: 'کمپیوٹر سائنس',
    classes: [9, 10, 11, 12],
    boards: 'all',
    groups: ['science', 'ics'],
    chapters: [
      {
        number: 1,
        name: 'Introduction to Computer',
        nameUrdu: 'کمپیوٹر کا تعارف',
        topics: ['History', 'Generations', 'Classification', 'Applications'],
      },
      {
        number: 2,
        name: 'Information & Data',
        nameUrdu: 'معلومات اور ڈیٹا',
        topics: ['Data vs information', 'Number systems', 'Binary', 'Conversion'],
      },
      {
        number: 3,
        name: 'Computer Components',
        nameUrdu: 'کمپیوٹر کے اجزاء',
        topics: ['Input devices', 'Output devices', 'Memory', 'CPU', 'Storage'],
      },
      {
        number: 4,
        name: 'Spreadsheet',
        nameUrdu: 'اسپریڈشیٹ',
        topics: ['Cells', 'Formulas', 'Functions', 'Charts'],
      },
      {
        number: 5,
        name: 'Database',
        nameUrdu: 'ڈیٹا بیس',
        topics: ['DBMS', 'Tables', 'Queries', 'Forms', 'Reports'],
      },
      {
        number: 6,
        name: 'Networking',
        nameUrdu: 'نیٹ ورکنگ',
        topics: ['LAN/WAN', 'Internet', 'Protocols', 'Security'],
      },
      {
        number: 7,
        name: 'Programming',
        nameUrdu: 'پروگرامنگ',
        topics: ['Algorithms', 'Flowcharts', 'Basic programming', 'Debugging'],
      },
    ],
  },
  {
    id: 'english',
    name: 'English',
    nameUrdu: 'انگریزی',
    classes: [9, 10, 11, 12],
    boards: 'all',
    groups: ['science', 'arts', 'commerce', 'ics', 'general'],
    chapters: [
      {
        number: 1,
        name: 'Reading Comprehension',
        nameUrdu: 'متن کا فہم',
        topics: ['Unseen passage', 'Main idea', 'Inference', 'Vocabulary in context'],
      },
      {
        number: 2,
        name: 'Grammar',
        nameUrdu: 'گرامر',
        topics: ['Tenses', 'Voice', 'Narration', 'Modals', 'Conditionals'],
      },
      {
        number: 3,
        name: 'Vocabulary',
        nameUrdu: 'ذخیرہ الفاظ',
        topics: ['Synonyms', 'Antonyms', 'Idioms', 'Phrasal verbs'],
      },
      {
        number: 4,
        name: 'Writing Skills',
        nameUrdu: 'تحریری مہارت',
        topics: ['Essay', 'Paragraph', 'Letter', 'Story writing'],
      },
      {
        number: 5,
        name: 'Literature',
        nameUrdu: 'ادب',
        topics: ['Prose', 'Poetry', 'Characters', 'Theme', 'Summary'],
      },
    ],
  },
  {
    id: 'urdu',
    name: 'Urdu',
    nameUrdu: 'اردو',
    classes: [9, 10, 11, 12],
    boards: 'all',
    groups: ['science', 'arts', 'commerce', 'ics', 'general'],
    chapters: [
      {
        number: 1,
        name: 'نثر',
        nameUrdu: 'نثر',
        topics: ['سبق کا خلاصہ', 'مرکزی خیال', 'مصنف کا تعارف'],
      },
      {
        number: 2,
        name: 'شاعری',
        nameUrdu: 'شاعری',
        topics: ['تشریح', 'مرکزی خیال', 'شاعر کا تعارف', 'صنائع بدائع'],
      },
      {
        number: 3,
        name: 'قواعد',
        nameUrdu: 'قواعد',
        topics: ['اسم', 'فعل', 'صفت', 'ضمیر', 'فاعل و مفعول'],
      },
      {
        number: 4,
        name: 'تحریر',
        nameUrdu: 'تحریر',
        topics: ['مضمون نگاری', 'خط نویسی', 'درخواست', 'کہانی'],
      },
    ],
  },
  {
    id: 'islamiat',
    name: 'Islamiat',
    nameUrdu: 'اسلامیات',
    classes: [9, 10, 11, 12],
    boards: 'all',
    groups: ['science', 'arts', 'commerce', 'ics', 'general'],
    chapters: [
      {
        number: 1,
        name: 'Quran & Hadith',
        nameUrdu: 'قرآن و حدیث',
        topics: ['Tafseer', 'Translation', 'Key teachings'],
      },
      {
        number: 2,
        name: 'Seerat-un-Nabi',
        nameUrdu: 'سیرت النبی ﷺ',
        topics: ['Early life', 'Migration', 'Battles', 'Character'],
      },
      {
        number: 3,
        name: 'Islamic Beliefs',
        nameUrdu: 'اسلامی عقائد',
        topics: ['Tawheed', 'Risalat', 'Akhrat', 'Angels'],
      },
      {
        number: 4,
        name: 'Islamic Law',
        nameUrdu: 'اسلامی قانون',
        topics: ['Worship', 'Ethics', 'Social system', 'Economic system'],
      },
    ],
  },
  {
    id: 'pak-studies',
    name: 'Pakistan Studies',
    nameUrdu: 'مطالعہ پاکستان',
    classes: [9, 10],
    boards: 'all',
    groups: ['science', 'arts', 'commerce', 'ics', 'general'],
    chapters: [
      {
        number: 1,
        name: 'Land & People',
        nameUrdu: 'سرزمین اور لوگ',
        topics: ['Geography', 'Climate', 'Population', 'Regions'],
      },
      {
        number: 2,
        name: 'Historical Background',
        nameUrdu: 'تاریخی پس منظر',
        topics: ['Partition 1947', 'Two-nation theory', 'Independence movement'],
      },
      {
        number: 3,
        name: 'Political System',
        nameUrdu: 'سیاسی نظام',
        topics: ['Constitution', 'Parliament', 'Federal & provincial', 'Judiciary'],
      },
      {
        number: 4,
        name: 'Economy of Pakistan',
        nameUrdu: 'پاکستان کی معیشت',
        topics: ['Agriculture', 'Industry', 'Trade', 'Challenges'],
      },
    ],
  },
];

// Standard Punjab Board paper pattern for Matric (9-10)
export const BOARD_PATTERNS: BoardPattern[] = [
  {
    boardId: 'lahore',
    classLevel: 9,
    subjectId: 'physics',
    totalMarks: 75,
    timeMinutes: 180,
    sections: [
      {
        title: 'Section A — Objective',
        questionType: 'mcq',
        totalQuestions: 15,
        attemptQuestions: 15,
        marksPerQuestion: 1,
        instructions: 'Circle the correct answer.',
      },
      {
        title: 'Section B — Short Answer Questions',
        questionType: 'short',
        totalQuestions: 8,
        attemptQuestions: 6,
        marksPerQuestion: 6,
        instructions: 'Answer any SIX questions. Each question carries 6 marks.',
      },
      {
        title: 'Section C — Long Answer Questions',
        questionType: 'long',
        totalQuestions: 5,
        attemptQuestions: 3,
        marksPerQuestion: 8,
        instructions: 'Answer any THREE questions. Each question carries 8 marks.',
      },
    ],
  },
  {
    boardId: 'lahore',
    classLevel: 10,
    subjectId: 'physics',
    totalMarks: 75,
    timeMinutes: 180,
    sections: [
      {
        title: 'Section A — Objective',
        questionType: 'mcq',
        totalQuestions: 15,
        attemptQuestions: 15,
        marksPerQuestion: 1,
        instructions: 'Circle the correct answer.',
      },
      {
        title: 'Section B — Short Answer Questions',
        questionType: 'short',
        totalQuestions: 8,
        attemptQuestions: 6,
        marksPerQuestion: 6,
        instructions: 'Answer any SIX questions. Each question carries 6 marks.',
      },
      {
        title: 'Section C — Long Answer Questions',
        questionType: 'long',
        totalQuestions: 5,
        attemptQuestions: 3,
        marksPerQuestion: 8,
        instructions: 'Answer any THREE questions. Each question carries 8 marks.',
      },
    ],
  },
];

export function getDefaultPattern(classLevel: ClassLevel, _subjectId: string): PatternSection[] {
  if (classLevel <= 10) {
    return [
      {
        title: 'Section A — Objective (MCQs)',
        questionType: 'mcq',
        totalQuestions: 15,
        attemptQuestions: 15,
        marksPerQuestion: 1,
        instructions: 'Circle the letter (A, B, C, or D) of the correct answer.',
      },
      {
        title: 'Section B — Short Answer Questions',
        questionType: 'short',
        totalQuestions: 8,
        attemptQuestions: 6,
        marksPerQuestion: 6,
        instructions: 'Attempt any SIX questions. Each carries 6 marks.',
      },
      {
        title: 'Section C — Long Answer / Essay Questions',
        questionType: 'long',
        totalQuestions: 5,
        attemptQuestions: 3,
        marksPerQuestion: 8,
        instructions: 'Attempt any THREE questions. Each carries 8 marks.',
      },
    ];
  }
  return [
    {
      title: 'Section A — Objective (MCQs)',
      questionType: 'mcq',
      totalQuestions: 20,
      attemptQuestions: 20,
      marksPerQuestion: 1,
      instructions: 'Circle the letter of the correct answer.',
    },
    {
      title: 'Section B — Short Answer Questions',
      questionType: 'short',
      totalQuestions: 10,
      attemptQuestions: 8,
      marksPerQuestion: 5,
      instructions: 'Attempt any EIGHT questions. Each carries 5 marks.',
    },
    {
      title: 'Section C — Long Answer / Essay Questions',
      questionType: 'long',
      totalQuestions: 6,
      attemptQuestions: 3,
      marksPerQuestion: 10,
      instructions: 'Attempt any THREE questions. Each carries 10 marks.',
    },
  ];
}

export function getSubjectsByClass(classLevel: ClassLevel): Subject[] {
  return SUBJECTS.filter((s) => s.classes.includes(classLevel));
}

export function getSubjectGroups(classLevel: ClassLevel): Record<string, Subject[]> {
  const subjects = getSubjectsByClass(classLevel);
  const groups: Record<string, Subject[]> = {
    'Science Group': subjects.filter((s) => s.groups.includes('science')),
    'Arts Group': subjects.filter((s) => s.groups.includes('arts')),
    'Commerce Group': subjects.filter((s) => s.groups.includes('commerce')),
    ICS: subjects.filter((s) => s.groups.includes('ics')),
    General: subjects.filter(
      (s) =>
        s.groups.includes('general') && !s.groups.includes('science') && !s.groups.includes('arts')
    ),
  };
  return groups;
}
