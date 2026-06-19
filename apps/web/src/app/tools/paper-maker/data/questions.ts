import type { QuestionType, Difficulty } from './boards';

export interface Question {
  id: string;
  classLevel: 9 | 10 | 11 | 12;
  subjectId: string;
  chapter: number;
  topic: string;
  type: QuestionType;
  difficulty: Difficulty;
  marks: number;
  medium: 'english' | 'urdu';
  question: string;
  options?: string[]; // MCQ options A-D
  answer: string;
  colA?: string[]; // column matching — left column
  colB?: string[]; // column matching — right column
}

let _id = 0;
const q = (
  classLevel: 9 | 10 | 11 | 12,
  subjectId: string,
  chapter: number,
  topic: string,
  type: QuestionType,
  difficulty: Difficulty,
  marks: number,
  question: string,
  answer: string,
  options?: string[]
): Question => ({
  id: `q${++_id}`,
  classLevel,
  subjectId,
  chapter,
  topic,
  type,
  difficulty,
  marks,
  medium: 'english',
  question,
  answer,
  options,
});

// ───────────────────────────────────────────────────────────────
// PHYSICS  (Class 9)
// ───────────────────────────────────────────────────────────────
export const QUESTIONS: Question[] = [
  // Physics Ch1 — Measurement
  q(9, 'physics', 1, 'Units', 'mcq', 'easy', 1, 'The SI unit of length is:', 'B', [
    'metre',
    'kilogram',
    'second',
    'kelvin',
  ]),
  q(9, 'physics', 1, 'Scientific notation', 'mcq', 'easy', 1, '6.0 × 10³ equals:', 'C', [
    '60',
    '600',
    '6000',
    '60000',
  ]),
  q(
    9,
    'physics',
    1,
    'Base quantities',
    'mcq',
    'medium',
    1,
    'Which of the following is NOT a base quantity?',
    'D',
    ['Length', 'Time', 'Temperature', 'Force']
  ),
  q(
    9,
    'physics',
    1,
    'Units',
    'mcq',
    'medium',
    1,
    'The unit of electric current in SI system is:',
    'A',
    ['Ampere', 'Volt', 'Ohm', 'Watt']
  ),
  q(9, 'physics', 1, 'Errors', 'mcq', 'hard', 1, 'Least count of a screw gauge is:', 'B', [
    '0.1 mm',
    '0.01 mm',
    '1 mm',
    '0.001 mm',
  ]),
  q(
    9,
    'physics',
    1,
    'Base quantities',
    'short',
    'easy',
    3,
    'What are physical quantities? Differentiate between base and derived quantities with two examples each.',
    'Physical quantities are those which can be measured. Base: length (m), mass (kg). Derived: speed (m/s), force (N).'
  ),
  q(
    9,
    'physics',
    1,
    'Scientific notation',
    'short',
    'medium',
    3,
    'Express 0.000025 kg in scientific notation and state how many significant figures it contains.',
    '2.5 × 10⁻⁵ kg; two significant figures.'
  ),
  q(
    9,
    'physics',
    1,
    'Units',
    'long',
    'medium',
    8,
    'Write a comprehensive note on the international system of units (SI). List all seven base quantities with their SI units and symbols. Also explain the importance of using a standard system of units.',
    'SI has 7 base units: length-metre(m), mass-kilogram(kg), time-second(s), current-ampere(A), temperature-kelvin(K), amount-mole(mol), luminosity-candela(cd). Standard units ensure consistency worldwide.'
  ),

  // Physics Ch2 — Kinematics
  q(9, 'physics', 2, 'Speed & velocity', 'mcq', 'easy', 1, 'Speed is a _____ quantity.', 'B', [
    'vector',
    'scalar',
    'derived base',
    'none',
  ]),
  q(
    9,
    'physics',
    2,
    'Acceleration',
    'mcq',
    'easy',
    1,
    'A body moving with uniform velocity has acceleration equal to:',
    'A',
    ['zero', 'positive', 'negative', 'variable']
  ),
  q(
    9,
    'physics',
    2,
    'Equations of motion',
    'mcq',
    'medium',
    1,
    'Which equation gives final velocity when distance is known?',
    'C',
    ['v=u+at', 's=ut+½at²', 'v²=u²+2as', 's=(u+v)t/2']
  ),
  q(
    9,
    'physics',
    2,
    'Graphs',
    'mcq',
    'medium',
    1,
    'The slope of a distance–time graph gives:',
    'B',
    ['acceleration', 'speed', 'force', 'displacement']
  ),
  q(
    9,
    'physics',
    2,
    'Distance & displacement',
    'short',
    'easy',
    3,
    'Differentiate between distance and displacement with the help of an example.',
    'Distance is the total path length (scalar); displacement is the shortest distance between initial and final positions (vector). E.g., walking 4m east then 3m north: distance = 7m, displacement = 5m.'
  ),
  q(
    9,
    'physics',
    2,
    'Equations of motion',
    'short',
    'medium',
    3,
    'A car starts from rest and accelerates at 4 m/s². Find its velocity and distance covered after 5 seconds.',
    'v = u + at = 0 + 4×5 = 20 m/s; s = ut + ½at² = 0 + ½(4)(25) = 50 m.'
  ),
  q(
    9,
    'physics',
    2,
    'Equations of motion',
    'long',
    'hard',
    8,
    'Derive the three equations of motion for a uniformly accelerating body using a velocity-time graph. Also solve: A ball is thrown vertically upward with velocity 20 m/s. Find maximum height and time of flight. (g = 10 m/s²)',
    'Derivation of v=u+at, s=(u+v)t/2, v²=u²+2as from v-t graph. Ball: H=v²/2g=20 m; T=2u/g=4 s.'
  ),

  // Physics Ch3 — Dynamics
  q(
    9,
    'physics',
    3,
    "Newton's laws",
    'mcq',
    'easy',
    1,
    "Newton's first law is also called the law of:",
    'B',
    ['acceleration', 'inertia', 'action-reaction', 'gravitation']
  ),
  q(9, 'physics', 3, 'Momentum', 'mcq', 'medium', 1, 'The SI unit of momentum is:', 'C', [
    'N',
    'J',
    'kg·m/s',
    'kg·m/s²',
  ]),
  q(
    9,
    'physics',
    3,
    'Friction',
    'mcq',
    'medium',
    1,
    'Rolling friction is _____ sliding friction.',
    'A',
    ['less than', 'greater than', 'equal to', 'unrelated to']
  ),
  q(
    9,
    'physics',
    3,
    "Newton's laws",
    'short',
    'easy',
    3,
    "State Newton's three laws of motion and give one practical example for each law.",
    '1st: body at rest stays at rest (seat belt). 2nd: F=ma (rocket thrust). 3rd: gun recoil when fired.'
  ),
  q(
    9,
    'physics',
    3,
    'Momentum',
    'short',
    'medium',
    3,
    'A 1500 kg car moving at 20 m/s collides with a stationary 1000 kg car. They stick together. Find their common velocity after collision.',
    'By conservation of momentum: 1500×20 = 2500×v; v = 12 m/s.'
  ),
  q(
    9,
    'physics',
    3,
    'Friction',
    'long',
    'medium',
    8,
    'Explain the concept of friction. Describe its types, advantages, and disadvantages in everyday life. Also explain methods to reduce friction.',
    'Static, kinetic, rolling friction. Advantages: walking, brakes. Disadvantages: energy waste, wear. Reduce: lubricants, ball bearings, streamlining.'
  ),

  // Physics Ch5 — Gravitation
  q(
    9,
    'physics',
    5,
    'Law of gravitation',
    'mcq',
    'easy',
    1,
    "According to Newton's law of gravitation, force between two masses is _____ to the square of distance.",
    'B',
    ['directly proportional', 'inversely proportional', 'equal', 'unrelated']
  ),
  q(
    9,
    'physics',
    5,
    'Mass & weight',
    'mcq',
    'easy',
    1,
    'The weight of a body on the Moon is approximately _____ of its Earth weight.',
    'A',
    ['1/6', '1/4', '1/3', '1/2']
  ),
  q(
    9,
    'physics',
    5,
    'Satellites',
    'short',
    'medium',
    3,
    'Differentiate between artificial and natural satellites. Give two examples of each.',
    'Natural: Moon, planets. Artificial: GPS, weather satellites. Artificial are man-made and orbit Earth for communication, research, navigation.'
  ),

  // ───────────────────────────────────────────────────────────────
  // CHEMISTRY (Class 9)
  // ───────────────────────────────────────────────────────────────
  q(
    9,
    'chemistry',
    1,
    'Atom',
    'mcq',
    'easy',
    1,
    'The smallest particle of an element that takes part in a chemical reaction is called:',
    ' A',
    ['Atom', 'Molecule', 'Ion', 'Electron']
  ),
  q(
    9,
    'chemistry',
    1,
    'Matter',
    'mcq',
    'easy',
    1,
    'Which of the following is an example of a mixture?',
    'D',
    ['Pure water', 'Table salt', 'Copper', 'Sea water']
  ),
  q(
    9,
    'chemistry',
    2,
    'Sub-atomic particles',
    'mcq',
    'easy',
    1,
    'The charge on an electron is:',
    'B',
    ['positive', 'negative', 'neutral', 'both positive and negative']
  ),
  q(
    9,
    'chemistry',
    2,
    'Isotopes',
    'mcq',
    'medium',
    1,
    'Isotopes are atoms of the same element that have the same:',
    'A',
    ['atomic number', 'mass number', 'number of neutrons', 'atomic mass']
  ),
  q(
    9,
    'chemistry',
    2,
    'Electronic config',
    'mcq',
    'medium',
    1,
    'The maximum number of electrons in the third shell is:',
    'C',
    ['8', '18', '18', '32']
  ),
  q(
    9,
    'chemistry',
    3,
    'Periodic Table',
    'mcq',
    'easy',
    1,
    'Elements in the same group of the periodic table have the same number of:',
    'D',
    ['protons', 'neutrons', 'mass number', 'valence electrons']
  ),
  q(
    9,
    'chemistry',
    3,
    'Properties trends',
    'mcq',
    'medium',
    1,
    'Atomic radius generally _____ across a period from left to right.',
    'B',
    ['increases', 'decreases', 'remains same', 'first increases then decreases']
  ),
  q(9, 'chemistry', 4, 'Ionic bond', 'mcq', 'easy', 1, 'An ionic bond is formed by:', 'B', [
    'sharing of electrons',
    'transfer of electrons',
    'sharing of protons',
    'transfer of protons',
  ]),
  q(
    9,
    'chemistry',
    4,
    'Covalent bond',
    'mcq',
    'medium',
    1,
    'How many covalent bonds are present in an oxygen molecule (O₂)?',
    'B',
    ['1', '2', '3', '4']
  ),
  q(
    9,
    'chemistry',
    1,
    'Atom',
    'short',
    'easy',
    3,
    'Define atom and molecule. How do they differ from each other? Give one example of each.',
    'Atom: smallest unit of element (e.g., H). Molecule: group of atoms bonded together (e.g., H₂O). Atoms may or may not exist freely; molecules always exist as groups.'
  ),
  q(
    9,
    'chemistry',
    2,
    'Structure',
    'short',
    'medium',
    3,
    'Describe the structure of an atom with the help of a diagram. Name the sub-atomic particles and give their charges.',
    'Nucleus has protons(+) and neutrons(neutral). Electrons(-) orbit the nucleus in shells. Proton mass ≈ neutron mass >> electron mass.'
  ),
  q(
    9,
    'chemistry',
    3,
    'Periodic Table',
    'long',
    'medium',
    8,
    'Write a detailed note on the Periodic Table. Explain periods and groups, and describe how the properties of elements change across a period and down a group.',
    'Modern periodic table has 7 periods and 18 groups. Across period: atomic radius decreases, electronegativity increases. Down group: atomic radius increases, metallic character increases.'
  ),
  q(
    9,
    'chemistry',
    4,
    'Chemical bonding',
    'long',
    'hard',
    8,
    'Define ionic and covalent bonds. Explain how they are formed with examples. Compare their physical properties (melting point, conductivity, solubility).',
    'Ionic: electron transfer, NaCl. Covalent: electron sharing, H₂O. Ionic: high MP, conducts in solution; Covalent: low MP, poor conductor.'
  ),

  // ───────────────────────────────────────────────────────────────
  // BIOLOGY (Class 9)
  // ───────────────────────────────────────────────────────────────
  q(9, 'biology', 1, 'Branches', 'mcq', 'easy', 1, 'The study of plants is called:', 'B', [
    'Zoology',
    'Botany',
    'Anatomy',
    'Ecology',
  ]),
  q(
    9,
    'biology',
    1,
    'Organization of life',
    'mcq',
    'easy',
    1,
    'The correct order of biological organisation from simple to complex is:',
    'A',
    [
      'Cell → Tissue → Organ → System → Organism',
      'Organism → System → Organ → Tissue → Cell',
      'Tissue → Cell → Organ → System → Organism',
      'Organ → Tissue → Cell → System → Organism',
    ]
  ),
  q(
    9,
    'biology',
    3,
    'Classification',
    'mcq',
    'easy',
    1,
    'Which of the following kingdoms includes bacteria?',
    'C',
    ['Plantae', 'Animalia', 'Monera', 'Fungi']
  ),
  q(
    9,
    'biology',
    3,
    'Taxonomy',
    'mcq',
    'medium',
    1,
    'The science of naming and classifying organisms is called:',
    'B',
    ['Morphology', 'Taxonomy', 'Physiology', 'Ecology']
  ),
  q(9, 'biology', 4, 'Cell organelles', 'mcq', 'easy', 1, 'The powerhouse of the cell is:', 'D', [
    'Nucleus',
    'Ribosome',
    'Chloroplast',
    'Mitochondria',
  ]),
  q(9, 'biology', 4, 'Cell theory', 'mcq', 'medium', 1, 'Cell theory was proposed by:', 'A', [
    'Schleiden & Schwann',
    'Darwin & Wallace',
    'Mendel',
    'Watson & Crick',
  ]),
  q(
    9,
    'biology',
    5,
    'Mitosis',
    'mcq',
    'medium',
    1,
    'Mitosis produces _____ daughter cells with _____ chromosomes each.',
    'B',
    ['4 / haploid', '2 / diploid', '4 / diploid', '2 / haploid']
  ),
  q(
    9,
    'biology',
    7,
    'Photosynthesis',
    'mcq',
    'easy',
    1,
    'The raw materials for photosynthesis are:',
    'C',
    ['O₂ and glucose', 'H₂O and O₂', 'CO₂ and H₂O', 'Glucose and O₂']
  ),
  q(
    9,
    'biology',
    1,
    'Branches',
    'short',
    'easy',
    3,
    'Define biology and list any four branches of biology with their areas of study.',
    'Biology is the study of living organisms. Branches: Zoology (animals), Botany (plants), Microbiology (microorganisms), Genetics (heredity).'
  ),
  q(
    9,
    'biology',
    4,
    'Cell organelles',
    'short',
    'medium',
    3,
    'Describe the structure and function of the following cell organelles: (a) Mitochondria (b) Chloroplast',
    'Mitochondria: double membrane, site of cellular respiration, produces ATP. Chloroplast: contains chlorophyll, site of photosynthesis, converts light to chemical energy.'
  ),
  q(
    9,
    'biology',
    7,
    'Photosynthesis',
    'long',
    'medium',
    8,
    'What is photosynthesis? Write its word equation and balanced chemical equation. Describe the factors that affect the rate of photosynthesis and explain the significance of photosynthesis in nature.',
    '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Factors: light intensity, CO₂ concentration, temperature, water. Significance: primary food source, O₂ production, carbon cycle.'
  ),
  q(
    9,
    'biology',
    3,
    'Biodiversity',
    'long',
    'medium',
    8,
    'Describe the five kingdom system of classification. Name each kingdom, give its characteristics, and provide two examples for each.',
    'Monera (bacteria, cyanobacteria), Protista (Amoeba, Euglena), Fungi (mushroom, yeast), Plantae (fern, rose), Animalia (lion, frog).'
  ),

  // ───────────────────────────────────────────────────────────────
  // MATHEMATICS (Class 9)
  // ───────────────────────────────────────────────────────────────
  q(
    9,
    'mathematics',
    1,
    'Types of matrices',
    'mcq',
    'easy',
    1,
    'A matrix with equal number of rows and columns is called a _____ matrix.',
    'C',
    ['Null', 'Unit', 'Square', 'Rectangular']
  ),
  q(
    9,
    'mathematics',
    1,
    'Operations',
    'mcq',
    'easy',
    1,
    'The order of matrix A (3×2) + B must be:',
    'A',
    ['3×2', '2×3', '3×3', '2×2']
  ),
  q(9, 'mathematics', 2, 'Complex numbers', 'mcq', 'medium', 1, 'The value of i² is:', 'B', [
    '1',
    '−1',
    'i',
    '0',
  ]),
  q(9, 'mathematics', 3, 'Logarithms', 'mcq', 'easy', 1, 'log₁₀ 1000 = ?', 'C', [
    '1',
    '2',
    '3',
    '4',
  ]),
  q(9, 'mathematics', 3, 'Laws', 'mcq', 'medium', 1, 'log(AB) equals:', 'A', [
    'log A + log B',
    'log A − log B',
    'log A × log B',
    'log A / log B',
  ]),
  q(
    9,
    'mathematics',
    7,
    'Linear Equations',
    'mcq',
    'easy',
    1,
    'The solution of 2x − 4 = 0 is:',
    'B',
    ['1', '2', '3', '4']
  ),
  q(
    9,
    'mathematics',
    7,
    'Word problems',
    'mcq',
    'medium',
    1,
    'The sum of two numbers is 25. If one is x, the other is:',
    'C',
    ['x + 25', 'x − 25', '25 − x', '25 + x']
  ),
  q(
    9,
    'mathematics',
    1,
    'Determinant',
    'short',
    'medium',
    3,
    'Find the determinant of the matrix A = [[3, 2], [1, 4]] and hence find A⁻¹.',
    'det(A) = 3×4 − 2×1 = 10. A⁻¹ = (1/10)[[4,−2],[−1,3]].'
  ),
  q(
    9,
    'mathematics',
    3,
    'Logarithms',
    'short',
    'medium',
    3,
    'Without using calculator evaluate: log₂ 64 + log₅ 125 − log₃ 27',
    'log₂ 64 = 6, log₅ 125 = 3, log₃ 27 = 3. Answer = 6 + 3 − 3 = 6.'
  ),
  q(
    9,
    'mathematics',
    7,
    'System of equations',
    'long',
    'medium',
    8,
    'Solve the following system of equations by elimination method: 3x + 2y = 16, 5x − 3y = 9. Also verify your solution.',
    'Multiply first by 3 and second by 2: 9x+6y=48, 10x−6y=18. Add: 19x=66, x=66/19... [detailed steps]. Verify by substitution.'
  ),

  // ───────────────────────────────────────────────────────────────
  // COMPUTER SCIENCE (Class 9)
  // ───────────────────────────────────────────────────────────────
  q(
    9,
    'computer',
    1,
    'Generations',
    'mcq',
    'easy',
    1,
    'The first generation computers used:',
    'A',
    ['Vacuum tubes', 'Transistors', 'Integrated circuits', 'Microprocessors']
  ),
  q(
    9,
    'computer',
    2,
    'Number systems',
    'mcq',
    'easy',
    1,
    'What is the decimal equivalent of binary 1010?',
    'C',
    ['8', '9', '10', '12']
  ),
  q(9, 'computer', 2, 'Binary', 'mcq', 'medium', 1, 'How many bits make one byte?', 'B', [
    '4',
    '8',
    '16',
    '32',
  ]),
  q(9, 'computer', 3, 'CPU', 'mcq', 'medium', 1, 'The brain of a computer is:', 'A', [
    'CPU',
    'RAM',
    'ROM',
    'Hard disk',
  ]),
  q(9, 'computer', 3, 'Memory', 'mcq', 'easy', 1, 'RAM stands for:', 'B', [
    'Read Access Memory',
    'Random Access Memory',
    'Read All Memory',
    'Random All Memory',
  ]),
  q(9, 'computer', 6, 'Networking', 'mcq', 'medium', 1, 'LAN stands for:', 'C', [
    'Large Area Network',
    'Local Access Network',
    'Local Area Network',
    'Long Area Network',
  ]),
  q(
    9,
    'computer',
    2,
    'Number systems',
    'short',
    'easy',
    3,
    'Convert (47)₁₀ to binary, octal, and hexadecimal.',
    'Binary: 101111; Octal: 57; Hexadecimal: 2F.'
  ),
  q(
    9,
    'computer',
    3,
    'Components',
    'short',
    'medium',
    3,
    'Differentiate between primary and secondary storage with examples. Which is faster?',
    'Primary (RAM, ROM): directly accessed by CPU, fast, volatile/non-volatile. Secondary (HDD, SSD, USB): slower, non-volatile, permanent storage.'
  ),
  q(
    9,
    'computer',
    1,
    'History',
    'long',
    'medium',
    8,
    'Describe the five generations of computers. For each generation state the technology used, size, speed, and give one example.',
    '1G: vacuum tubes, ENIAC. 2G: transistors, IBM 1401. 3G: ICs, IBM 360. 4G: microprocessors, PC. 5G: AI, quantum computing.'
  ),

  // ───────────────────────────────────────────────────────────────
  // ENGLISH (Class 9)
  // ───────────────────────────────────────────────────────────────
  q(9, 'english', 2, 'Tenses', 'mcq', 'easy', 1, 'He _____ to school every day.', 'A', [
    'goes',
    'go',
    'going',
    'gone',
  ]),
  q(
    9,
    'english',
    2,
    'Voice',
    'mcq',
    'medium',
    1,
    'Passive voice of "She writes a letter" is:',
    'C',
    [
      'A letter is written by her',
      'A letter will be written by her',
      'A letter is being written by her',
      'A letter was written by her',
    ]
  ),
  q(
    9,
    'english',
    2,
    'Narration',
    'mcq',
    'medium',
    1,
    'Indirect speech of "He said, \'I am happy\'" is:',
    'B',
    ['He said he is happy', 'He said he was happy', 'He says he was happy', 'He said I am happy']
  ),
  q(9, 'english', 3, 'Synonyms', 'mcq', 'easy', 1, 'Synonym of "benevolent" is:', 'A', [
    'kind',
    'cruel',
    'angry',
    'sad',
  ]),
  q(9, 'english', 3, 'Antonyms', 'mcq', 'easy', 1, 'Antonym of "abundant" is:', 'D', [
    'plentiful',
    'rich',
    'ample',
    'scarce',
  ]),
  q(
    9,
    'english',
    2,
    'Grammar',
    'short',
    'medium',
    3,
    'Change the following sentences into passive voice: (a) The teacher teaches the students. (b) She is eating an apple. (c) They had completed the project.',
    '(a) The students are taught by the teacher. (b) An apple is being eaten by her. (c) The project had been completed by them.'
  ),
  q(
    9,
    'english',
    4,
    'Essay',
    'long',
    'medium',
    8,
    'Write a well-structured essay on "The Importance of Education" in approximately 250 words. Use appropriate vocabulary and linking phrases.',
    '[Essay covering: Education as foundation of life, develops critical thinking, economic benefits, social awareness, national development. Include intro, body paragraphs, conclusion.]'
  ),
  q(
    9,
    'english',
    2,
    'Grammar',
    'long',
    'hard',
    8,
    'Explain the twelve tenses with their formulas and one example each. Then identify the tense in the following sentences: (a) I have been studying. (b) She will have left by then. (c) They are playing cricket.',
    '[Detailed explanation of all 12 tenses. (a) Present Perfect Continuous; (b) Future Perfect; (c) Present Continuous.]'
  ),

  // ───────────────────────────────────────────────────────────────
  // CLASS 10 — PHYSICS
  // ───────────────────────────────────────────────────────────────
  q(
    10,
    'physics',
    10,
    'Magnetism',
    'mcq',
    'easy',
    1,
    'A magnetic field is produced around a conductor when:',
    'B',
    ['it is at rest', 'current flows through it', 'it is cooled', 'it is heated']
  ),
  q(
    10,
    'physics',
    10,
    'Electromagnetism',
    'mcq',
    'medium',
    1,
    'The unit of magnetic flux density (B) is:',
    'A',
    ['Tesla', 'Weber', 'Henry', 'Farad']
  ),
  q(
    10,
    'physics',
    11,
    'Electricity',
    'mcq',
    'easy',
    1,
    "Ohm's law states that V is proportional to I when _____ is constant.",
    'C',
    ['voltage', 'current', 'resistance', 'power']
  ),
  q(
    10,
    'physics',
    11,
    'Electricity',
    'mcq',
    'medium',
    1,
    'Three resistors 2Ω, 3Ω, and 6Ω are connected in parallel. Their equivalent resistance is:',
    'B',
    ['11 Ω', '1 Ω', '0.5 Ω', '5 Ω']
  ),
  q(10, 'physics', 12, 'Electronics', 'mcq', 'medium', 1, 'A transistor can be used as:', 'D', [
    'transformer',
    'capacitor',
    'inductor',
    'amplifier and switch',
  ]),
  q(
    10,
    'physics',
    11,
    'Electricity',
    'short',
    'medium',
    3,
    "State and explain Ohm's law. A heater of resistance 20Ω is connected to a 240V supply. Find the current flowing through it.",
    'V=IR, so I=V/R=240/20=12 A.'
  ),
  q(
    10,
    'physics',
    11,
    'Electricity',
    'long',
    'medium',
    8,
    'Explain the difference between series and parallel circuits. Derive formulas for equivalent resistance in both cases. Solve: Three resistors 4Ω, 6Ω, 12Ω connected in parallel across 12V. Find total current and current through each resistor.',
    'Series: R=R₁+R₂+R₃. Parallel: 1/R=1/R₁+1/R₂+1/R₃. Req=2Ω, I=6A, I₁=3A, I₂=2A, I₃=1A.'
  ),

  // ───────────────────────────────────────────────────────────────
  // CLASS 10 — CHEMISTRY
  // ───────────────────────────────────────────────────────────────
  q(10, 'chemistry', 9, 'Acids', 'mcq', 'easy', 1, 'An acid has pH:', 'A', [
    'less than 7',
    'greater than 7',
    'equal to 7',
    'equal to 14',
  ]),
  q(10, 'chemistry', 9, 'pH', 'mcq', 'medium', 1, 'The pH of a neutral solution at 25°C is:', 'B', [
    '0',
    '7',
    '14',
    '1',
  ]),
  q(
    10,
    'chemistry',
    10,
    'Organic chemistry',
    'mcq',
    'easy',
    1,
    'The main element in organic compounds is:',
    'C',
    ['Nitrogen', 'Hydrogen', 'Carbon', 'Oxygen']
  ),
  q(
    10,
    'chemistry',
    9,
    'Acids',
    'short',
    'medium',
    3,
    'Differentiate between strong and weak acids with two examples each. Explain the concept of neutralisation.',
    'Strong (HCl, H₂SO₄): fully ionise. Weak (CH₃COOH, H₂CO₃): partially ionise. Neutralisation: acid + base → salt + water.'
  ),
  q(
    10,
    'chemistry',
    10,
    'Organic',
    'long',
    'medium',
    8,
    'Write a comprehensive note on carbohydrates. Define them, classify them into monosaccharides, disaccharides, and polysaccharides with examples and biological importance.',
    'Carbohydrates: CₙH₂ₙOₙ. Monosaccharide: glucose, fructose. Disaccharide: sucrose, lactose. Polysaccharide: starch, cellulose. Importance: energy source.'
  ),

  // ───────────────────────────────────────────────────────────────
  // CLASS 10 — BIOLOGY
  // ───────────────────────────────────────────────────────────────
  q(10, 'biology', 11, 'Genetics', 'mcq', 'easy', 1, 'DNA stands for:', 'A', [
    'Deoxyribonucleic acid',
    'Deoxyribose nucleic acid',
    'Double-helix nucleic acid',
    'Diribonucleic acid',
  ]),
  q(
    10,
    'biology',
    12,
    'Evolution',
    'mcq',
    'medium',
    1,
    'The theory of evolution by natural selection was proposed by:',
    'B',
    ['Lamarck', 'Darwin', 'Mendel', 'Watson']
  ),
  q(
    10,
    'biology',
    11,
    'Genetics',
    'short',
    'medium',
    3,
    'What is DNA? Describe its double helix structure with the names of its components.',
    'DNA: deoxyribonucleic acid, carrier of genetic info. Double helix: two polynucleotide chains. Components: deoxyribose sugar, phosphate, four bases (A, T, G, C). A pairs with T; G pairs with C.'
  ),
  q(
    10,
    'biology',
    13,
    'Biotechnology',
    'long',
    'medium',
    8,
    'Define biotechnology. Explain the applications of biotechnology in medicine, agriculture, and industry with specific examples.',
    'Biotechnology uses organisms for practical purposes. Medicine: insulin production, vaccines, gene therapy. Agriculture: GM crops (Bt cotton, Golden Rice). Industry: fermentation, bioremediation.'
  ),

  // ───────────────────────────────────────────────────────────────
  // PAKISTAN STUDIES (Class 9-10)
  // ───────────────────────────────────────────────────────────────
  q(9, 'pak-studies', 1, 'Geography', 'mcq', 'easy', 1, 'Pakistan is located in:', 'B', [
    'Southeast Asia',
    'South Asia',
    'Central Asia',
    'East Asia',
  ]),
  q(
    9,
    'pak-studies',
    1,
    'Geography',
    'mcq',
    'easy',
    1,
    'The largest province of Pakistan by area is:',
    'A',
    ['Balochistan', 'Punjab', 'Sindh', 'KPK']
  ),
  q(
    9,
    'pak-studies',
    2,
    'Historical Background',
    'mcq',
    'medium',
    1,
    'Pakistan gained independence on:',
    'C',
    ['14 July 1947', '14 August 1947', '14 September 1947', '14 October 1947']
  ),
  q(
    9,
    'pak-studies',
    2,
    'Two-nation theory',
    'mcq',
    'medium',
    1,
    'The two-nation theory was mainly based on:',
    'B',
    [
      'linguistic differences',
      'religious differences',
      'economic differences',
      'geographic differences',
    ]
  ),
  q(
    9,
    'pak-studies',
    1,
    'Geography',
    'short',
    'easy',
    3,
    'Describe the geographical location of Pakistan. Name the four countries that share a border with Pakistan.',
    'Pakistan lies between 24°N-37°N lat, 61°E-76°E long. Bordered by India (east), Afghanistan (northwest), Iran (west), China (northeast). Arabian Sea in south.'
  ),
  q(
    9,
    'pak-studies',
    2,
    'Independence',
    'long',
    'medium',
    8,
    'Describe the role of Quaid-e-Azam Muhammad Ali Jinnah in the creation of Pakistan. How did the two-nation theory become the basis for the demand of a separate homeland?',
    'Jinnah joined Muslim League 1913, led 1940 Lahore Resolution demanding Pakistan. Two-nation theory: Hindus and Muslims are two distinct nations with different religion, culture, history. Led to partition and creation of Pakistan on 14 Aug 1947.'
  ),

  // ───────────────────────────────────────────────────────────────
  // ISLAMIAT (Class 9-10)
  // ───────────────────────────────────────────────────────────────
  q(
    9,
    'islamiat',
    1,
    'Quran',
    'mcq',
    'easy',
    1,
    'The total number of Surahs in the Holy Quran is:',
    'C',
    ['99', '100', '114', '120']
  ),
  q(9, 'islamiat', 2, 'Seerat', 'mcq', 'easy', 1, 'The Holy Prophet (ﷺ) was born in:', 'A', [
    'Makkah',
    'Madinah',
    'Taif',
    'Jerusalem',
  ]),
  q(
    9,
    'islamiat',
    3,
    'Beliefs',
    'mcq',
    'medium',
    1,
    'Belief in the oneness of Allah is called:',
    'B',
    ['Risalat', 'Tawheed', 'Akhrat', 'Jihad']
  ),
  q(
    9,
    'islamiat',
    2,
    'Seerat',
    'short',
    'easy',
    3,
    'Describe the early life of the Holy Prophet (ﷺ) before his first revelation. Mention any three key events.',
    'Born 571 CE Makkah. Father Abdullah died before birth; mother Amina died when he was 6. Raised by grandfather Abdul Muttalib, then uncle Abu Talib. Known as Al-Ameen. Married Hazrat Khadija (RA) at 25.'
  ),
  q(
    9,
    'islamiat',
    3,
    'Islamic beliefs',
    'long',
    'medium',
    8,
    "Explain the six articles of faith (Arkan-e-Iman) in Islam. Describe the importance of each article and how it impacts a Muslim's life.",
    '1. Tawheed (oneness of Allah), 2. Malaika (angels), 3. Kutub (holy books), 4. Rusul (prophets), 5. Akhrat (Day of Judgment), 6. Taqdeer (divine decree). Each shapes worldview, ethics, and worship.'
  ),
];

// ───────────────────────────────────────────────────────────────
// HELPERS
// ───────────────────────────────────────────────────────────────

export function getQuestions(
  classLevel: number,
  subjectId: string,
  chapters: number[],
  types: QuestionType[],
  difficulty?: Difficulty
): Question[] {
  return QUESTIONS.filter(
    (q) =>
      q.classLevel === classLevel &&
      q.subjectId === subjectId &&
      (chapters.length === 0 || chapters.includes(q.chapter)) &&
      types.includes(q.type) &&
      (difficulty == null || q.difficulty === difficulty)
  );
}

export function sampleQuestions(questions: Question[], count: number, shuffle = true): Question[] {
  const pool = [...questions];
  if (shuffle) {
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }
  return pool.slice(0, count);
}
