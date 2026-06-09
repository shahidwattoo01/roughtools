import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'

const SITE = 'https://roughtools.com'
const CANONICAL = `${SITE}/tools/resume`

export const metadata: Metadata = {
  title: '100 Free Premium Resume Templates — Better Than Canva Pro | RoughTools',
  description:
    'Download 100 premium resume templates across 10 categories: Executive, Tech, Creative, Medical, Academic, and more. ATS-optimized, beautifully designed. No signup required.',
  keywords: [
    'free resume templates', 'premium resume templates', 'professional resume templates',
    'ats resume template', 'resume builder free', 'executive resume template',
    'creative resume template', 'tech resume template', 'resume download free',
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: '100 Free Premium Resume Templates | RoughTools',
    description: '100 premium resume templates across 10 categories — executive, tech, creative, medical & more.',
    url: CANONICAL,
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: '100 Free Premium Resume Templates | RoughTools',
    description: 'Download free premium resumes better than Canva Pro. 10 categories, 100 designs.',
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
}

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '100 Premium Resume Templates',
    url: CANONICAL,
    description: '100 premium resume templates across 10 categories, free to use.',
    provider: { '@type': 'Organization', name: 'RoughTools', url: SITE },
    numberOfItems: 100,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Resume Templates', item: CANONICAL },
    ],
  },
]

// ─── Template Data ────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'executive',
    name: 'Executive & C-Suite',
    icon: '👑',
    color: 'from-yellow-600 to-yellow-800',
    badgeBg: 'bg-yellow-100 text-yellow-800',
    description: 'Ultra-premium boardroom-ready designs for senior leaders',
    templates: [
      { id: 'EX001', name: 'Obsidian Throne', colors: ['#1a1a2e', '#c9a84c', '#ffffff'], tags: ['dark', 'gold', 'luxury'], best_for: ['CEO', 'CFO', 'Board Director'] },
      { id: 'EX002', name: 'Ivory Statesman', colors: ['#faf8f4', '#8b7355', '#2c2416'], tags: ['cream', 'classic', 'prestige'], best_for: ['Investment Banker', 'Law Partner'] },
      { id: 'EX003', name: 'Gunmetal Titan', colors: ['#1c1c1c', '#f5f5f5', '#9e9e9e'], tags: ['dark', 'bold', 'silver'], best_for: ['CEO Tech', 'Strategy Director'] },
      { id: 'EX004', name: 'Copper Empress', colors: ['#fdfaf7', '#c4956a', '#4a3728'], tags: ['warm', 'copper', 'elegant'], best_for: ['CMO', 'CPO', 'Executive Director'] },
      { id: 'EX005', name: 'Blueprint Command', colors: ['#ffffff', '#0066cc', '#003366'], tags: ['navy', 'grid', 'technical'], best_for: ['CTO', 'VP Engineering'] },
      { id: 'EX006', name: 'Midnight Cinema', colors: ['#0a0a0a', '#d4af37', '#ffffff'], tags: ['dark', 'gold', 'cinematic'], best_for: ['CCO', 'Media Executive'] },
      { id: 'EX007', name: 'Carbon Accelerator', colors: ['#111111', '#ff6600', '#ffffff'], tags: ['dark', 'orange', 'performance'], best_for: ['COO', 'Turnaround Executive'] },
      { id: 'EX008', name: 'Legacy Founder', colors: ['#fefcf9', '#7b6c55', '#2d2d2d'], tags: ['classic', 'warm', 'timeline'], best_for: ['Industry Veteran', 'Senior Partner'] },
      { id: 'EX009', name: 'Quantum Visionary', colors: ['#ffffff', '#7b2fff', '#0d0d2b'], tags: ['futuristic', 'purple', 'bold'], best_for: ['Chief AI Officer', 'Futurist'] },
      { id: 'EX010', name: 'The Diplomat', colors: ['#f8f7f2', '#c5a028', '#1e3a5f'], tags: ['government', 'formal', 'gold'], best_for: ['Ambassador', 'Government Minister'] },
    ],
  },
  {
    id: 'tech',
    name: 'Tech & Engineering',
    icon: '💻',
    color: 'from-cyan-600 to-blue-700',
    badgeBg: 'bg-cyan-100 text-cyan-800',
    description: 'Developer-native designs built in the visual language of code',
    templates: [
      { id: 'TE001', name: 'Terminal Dark', colors: ['#0d1b2a', '#00d4aa', '#e0e0e0'], tags: ['dark', 'terminal', 'teal'], best_for: ['Full-Stack Developer', 'DevOps'] },
      { id: 'TE002', name: 'Apple Precision', colors: ['#ffffff', '#f5f5f7', '#0071e3'], tags: ['minimal', 'apple', 'blue'], best_for: ['Product Manager', 'iOS Developer'] },
      { id: 'TE003', name: 'GitHub Universe', colors: ['#ffffff', '#28a745', '#24292e'], tags: ['github', 'green', 'open-source'], best_for: ['Backend Engineer', 'DevOps'] },
      { id: 'TE004', name: 'Data Pipeline', colors: ['#0f172a', '#f59e0b', '#e2e8f0'], tags: ['dark', 'data', 'amber'], best_for: ['Data Engineer', 'ML Engineer'] },
      { id: 'TE005', name: 'Neural Net', colors: ['#030712', '#4cc9f0', '#e0e7ff'], tags: ['dark', 'cyan', 'ai'], best_for: ['ML Engineer', 'AI Researcher'] },
      { id: 'TE006', name: 'Cloud Fortress', colors: ['#ffffff', '#e8f4f8', '#ff9900'], tags: ['cloud', 'navy', 'aws'], best_for: ['Cloud Architect', 'SRE'] },
      { id: 'TE007', name: 'Cyber Shield', colors: ['#0a0a0a', '#00ff41', '#ff0040'], tags: ['dark', 'green', 'cybersecurity'], best_for: ['Penetration Tester', 'CISO'] },
      { id: 'TE008', name: 'Frontend Canvas', colors: ['#ffffff', '#fef3c7', '#e11d48'], tags: ['colorful', 'frontend', 'red'], best_for: ['Frontend Developer', 'UI Engineer'] },
      { id: 'TE009', name: 'Quantum Code', colors: ['#0c0c1d', '#06b6d4', '#e0f2fe'], tags: ['dark', 'futuristic', 'cyan'], best_for: ['Quantum Engineer', 'Research Scientist'] },
      { id: 'TE010', name: 'Stack Pro', colors: ['#ffffff', '#e1ecf4', '#f48024'], tags: ['orange', 'clean', 'developer'], best_for: ['Full Stack Developer', 'Tech Lead'] },
    ],
  },
  {
    id: 'creative',
    name: 'Creative & Design',
    icon: '🎨',
    color: 'from-pink-600 to-orange-600',
    badgeBg: 'bg-pink-100 text-pink-800',
    description: 'Portfolio-grade templates that are themselves proof of design mastery',
    templates: [
      { id: 'CD001', name: 'Portfolio Fold', colors: ['#fefcf8', '#c1440e', '#1a1a1a'], tags: ['editorial', 'terracotta', 'portfolio'], best_for: ['Graphic Designer', 'Art Director'] },
      { id: 'CD002', name: 'Bauhaus Master', colors: ['#ffffff', '#cc0000', '#0033cc'], tags: ['bauhaus', 'geometric', 'bold'], best_for: ['Graphic Designer', 'Typographer'] },
      { id: 'CD003', name: 'Neon Noir', colors: ['#0a0a0a', '#f5ff00', '#ff00aa'], tags: ['dark', 'neon', 'creative'], best_for: ['Digital Artist', 'Motion Designer'] },
      { id: 'CD004', name: 'Swiss Grid', colors: ['#ffffff', '#ff0000', '#000000'], tags: ['swiss', 'helvetica', 'minimal'], best_for: ['Brand Designer', 'Typographer'] },
      { id: 'CD005', name: 'Motion Reel', colors: ['#0f0f1a', '#ec4899', '#ffffff'], tags: ['dark', 'pink', 'motion'], best_for: ['Motion Designer', 'VFX Artist'] },
      { id: 'CD006', name: 'Brutalist Canvas', colors: ['#ffffff', '#ff4500', '#000000'], tags: ['brutalist', 'raw', 'bold'], best_for: ['Experimental Designer', 'Architect'] },
      { id: 'CD007', name: 'Pastel Studio', colors: ['#fdf8ff', '#7c5cbf', '#2d1b4e'], tags: ['pastel', 'soft', 'creative'], best_for: ['Brand Designer', 'Social Media Designer'] },
      { id: 'CD008', name: 'Wabi-Sabi', colors: ['#f9f5ef', '#8d7b68', '#2c1810'], tags: ['organic', 'japanese', 'artisan'], best_for: ['Fine Artist', 'Craftsperson'] },
      { id: 'CD009', name: 'Risograph Print', colors: ['#fef9e7', '#e84c3d', '#4a90d9'], tags: ['indie', 'print', 'editorial'], best_for: ['Zine Maker', 'Print Designer'] },
      { id: 'CD010', name: 'Ink & Type', colors: ['#f5f0e8', '#8b4513', '#1a1a1a'], tags: ['letterpress', 'craft', 'warm'], best_for: ['Printmaker', 'Book Designer'] },
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate & Business',
    icon: '🏢',
    color: 'from-blue-600 to-indigo-700',
    badgeBg: 'bg-blue-100 text-blue-800',
    description: 'Polished power templates for the modern professional enterprise',
    templates: [
      { id: 'CB001', name: 'Boardroom Classic', colors: ['#ffffff', '#2e6da4', '#1a3a5c'], tags: ['classic', 'navy', 'ats'], best_for: ['Business Analyst', 'Project Manager'] },
      { id: 'CB002', name: 'McKinsey Frame', colors: ['#f8f9fa', '#0066cc', '#003366'], tags: ['consulting', 'navy', 'precise'], best_for: ['Management Consultant', 'Strategy Analyst'] },
      { id: 'CB003', name: 'Revenue Machine', colors: ['#ffffff', '#d1fae5', '#20c997'], tags: ['sales', 'green', 'metrics'], best_for: ['Sales Manager', 'VP Sales'] },
      { id: 'CB004', name: 'Bloomberg Dark', colors: ['#0d1117', '#f4a100', '#e0e0e0'], tags: ['dark', 'finance', 'amber'], best_for: ['Financial Analyst', 'CFA'] },
      { id: 'CB005', name: 'People First', colors: ['#faf5ff', '#a78bfa', '#1e1b4b'], tags: ['purple', 'warm', 'hr'], best_for: ['HR Director', 'CHRO'] },
      { id: 'CB006', name: 'Operations Architect', colors: ['#ffffff', '#e8f4f8', '#ff8c00'], tags: ['operations', 'orange', 'process'], best_for: ['COO', 'Operations Manager'] },
      { id: 'CB007', name: 'Campaign Director', colors: ['#ffffff', '#fff1f2', '#f97316'], tags: ['marketing', 'orange', 'digital'], best_for: ['CMO', 'Growth Marketer'] },
      { id: 'CB008', name: 'Legal Chambers', colors: ['#faf8f4', '#8b7355', '#1a1a2e'], tags: ['legal', 'formal', 'prestige'], best_for: ['Attorney', 'Law Partner'] },
      { id: 'CB009', name: 'Startup Rocket', colors: ['#ffffff', '#fff4ef', '#ff6b35'], tags: ['startup', 'orange', 'bold'], best_for: ['Startup Founder', 'Product Lead'] },
      { id: 'CB010', name: 'Remote Commander', colors: ['#0f172a', '#1e293b', '#10b981'], tags: ['remote', 'dark', 'green'], best_for: ['Remote Manager', 'Distributed Team Lead'] },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medical',
    icon: '⚕️',
    color: 'from-teal-600 to-green-700',
    badgeBg: 'bg-teal-100 text-teal-800',
    description: 'Credential-forward templates built for clinical authority and trust',
    templates: [
      { id: 'HM001', name: 'White Coat Authority', colors: ['#f9fafb', '#00a896', '#0f172a'], tags: ['medical', 'clinical', 'teal'], best_for: ['Physician', 'Surgeon'] },
      { id: 'HM002', name: 'Nursing Excellence', colors: ['#f0fdf4', '#34d399', '#064e3b'], tags: ['nursing', 'green', 'clinical'], best_for: ['RN', 'NP', 'CNO'] },
      { id: 'HM003', name: 'Lab Director', colors: ['#ffffff', '#eff6ff', '#2563eb'], tags: ['research', 'navy', 'publications'], best_for: ['Research Scientist', 'Principal Investigator'] },
      { id: 'HM004', name: 'Allied Health Pro', colors: ['#f0f9ff', '#e0f2fe', '#f59e0b'], tags: ['allied', 'cyan', 'amber'], best_for: ['Physical Therapist', 'Pharmacist'] },
      { id: 'HM005', name: 'Therapeutic Mind', colors: ['#faf5ff', '#ede9fe', '#a78bfa'], tags: ['mental-health', 'purple', 'warm'], best_for: ['Therapist', 'Psychologist'] },
      { id: 'HM006', name: 'Health System CEO', colors: ['#ffffff', '#533483', '#0f3460'], tags: ['executive', 'healthcare', 'dark'], best_for: ['Hospital CEO', 'CMO'] },
      { id: 'HM007', name: 'Surgical Precision', colors: ['#f8fafc', '#0ea5e9', '#e0f2fe'], tags: ['surgical', 'blue', 'precise'], best_for: ['Surgeon', 'Surgical Specialist'] },
      { id: 'HM008', name: 'Public Health Champion', colors: ['#ecfdf5', '#d1fae5', '#10b981'], tags: ['public-health', 'green', 'impact'], best_for: ['Epidemiologist', 'Health Policy Analyst'] },
      { id: 'HM009', name: 'Biotech Pipeline', colors: ['#0d1b2a', '#4cc9f0', '#e0e0e0'], tags: ['biotech', 'dark', 'cyan'], best_for: ['Biotech Scientist', 'Drug Discovery'] },
      { id: 'HM010', name: 'Dental Authority', colors: ['#f0f9ff', '#e0f2fe', '#38bdf8'], tags: ['dental', 'blue', 'clinical'], best_for: ['Dentist', 'Dental Specialist'] },
    ],
  },
  {
    id: 'academic',
    name: 'Academic & Research',
    icon: '🎓',
    color: 'from-red-700 to-rose-800',
    badgeBg: 'bg-red-100 text-red-800',
    description: 'Scholarly CV templates commanding academic authority across disciplines',
    templates: [
      { id: 'AR001', name: 'Oxford Scholar', colors: ['#fdfcfb', '#8b0000', '#1a1a1a'], tags: ['academic', 'scholarly', 'cv'], best_for: ['Professor', 'Department Head'] },
      { id: 'AR002', name: 'PhD Candidate', colors: ['#ffffff', '#f5f3ff', '#7c3aed'], tags: ['phd', 'purple', 'research'], best_for: ['PhD Student', 'Postdoctoral Fellow'] },
      { id: 'AR003', name: 'STEM Powerhouse', colors: ['#f8fafc', '#e0f2fe', '#0ea5e9'], tags: ['stem', 'research', 'blue'], best_for: ['STEM Researcher', 'Lab Scientist'] },
      { id: 'AR004', name: 'Humanities Scholar', colors: ['#faf5f0', '#fef3c7', '#c2410c'], tags: ['humanities', 'warm', 'narrative'], best_for: ['Historian', 'Philosopher'] },
      { id: 'AR005', name: 'Think Tank Fellow', colors: ['#f8f9fa', '#fee2e2', '#dc2626'], tags: ['policy', 'navy', 'prestige'], best_for: ['Policy Researcher', 'Policy Advisor'] },
      { id: 'AR006', name: 'Social Scientist', colors: ['#ffffff', '#eef2ff', '#6366f1'], tags: ['social-science', 'indigo', 'academic'], best_for: ['Political Scientist', 'Sociologist'] },
      { id: 'AR007', name: 'Grant Master', colors: ['#ecfdf5', '#d1fae5', '#10b981'], tags: ['grants', 'green', 'funding'], best_for: ['Grants Manager', 'Research Administrator'] },
      { id: 'AR008', name: 'EdTech Educator', colors: ['#f0f9ff', '#ede9fe', '#7c3aed'], tags: ['edtech', 'blue', 'digital'], best_for: ['Instructional Designer', 'Online Educator'] },
      { id: 'AR009', name: 'International Scholar', colors: ['#ffffff', '#eff6ff', '#f59e0b'], tags: ['international', 'global', 'amber'], best_for: ['International Scholar', 'Area Studies Expert'] },
      { id: 'AR010', name: 'Librarian Scholar', colors: ['#fdf8f0', '#fef3c7', '#92400e'], tags: ['library', 'warm', 'information'], best_for: ['Librarian', 'Archivist'] },
    ],
  },
  {
    id: 'entry-level',
    name: 'Entry Level & Students',
    icon: '🚀',
    color: 'from-green-600 to-emerald-700',
    badgeBg: 'bg-green-100 text-green-800',
    description: 'Confidence-maximizing templates that turn limited experience into compelling stories',
    templates: [
      { id: 'ES001', name: 'First Launch', colors: ['#ffffff', '#eff6ff', '#3b82f6'], tags: ['entry-level', 'blue', 'clean'], best_for: ['Fresh Graduate', 'First Job Seeker'] },
      { id: 'ES002', name: 'Campus Leader', colors: ['#faf5ff', '#ede9fe', '#a78bfa'], tags: ['leadership', 'purple', 'student'], best_for: ['Student Leader', 'Club President'] },
      { id: 'ES003', name: 'STEM Student', colors: ['#f8fafc', '#e0f2fe', '#0ea5e9'], tags: ['stem', 'student', 'technical'], best_for: ['Engineering Student', 'CS Student'] },
      { id: 'ES004', name: 'Internship Ready', colors: ['#ecfdf5', '#d1fae5', '#34d399'], tags: ['internship', 'green', 'clean'], best_for: ['Sophomore Junior', 'Pre-Internship Student'] },
      { id: 'ES005', name: 'Creative Student', colors: ['#fff0f9', '#fce7f3', '#f97316'], tags: ['creative', 'pink', 'portfolio'], best_for: ['Art Student', 'Design Student'] },
      { id: 'ES006', name: 'Business Student', colors: ['#ffffff', '#eff6ff', '#2563eb'], tags: ['business', 'navy', 'finance'], best_for: ['Business Student', 'Pre-MBA'] },
      { id: 'ES007', name: 'Gap Year Explorer', colors: ['#fffbeb', '#fef3c7', '#f59e0b'], tags: ['gap-year', 'amber', 'travel'], best_for: ['Gap Year Returner', 'Career Break'] },
      { id: 'ES008', name: 'High School Senior', colors: ['#f0f9ff', '#e0f2fe', '#38bdf8'], tags: ['high-school', 'blue', 'first-resume'], best_for: ['High School Senior', 'Part-Time Job Seeker'] },
      { id: 'ES009', name: 'Career Launcher', colors: ['#f0fdfa', '#ccfbf1', '#14b8a6'], tags: ['early-career', 'teal', 'growth'], best_for: ['One-Two Year Professional'] },
      { id: 'ES010', name: 'Veteran Student', colors: ['#f0fdf4', '#dcfce7', '#86efac'], tags: ['veteran', 'student', 'military'], best_for: ['Veteran Student', 'GI Bill Student'] },
    ],
  },
  {
    id: 'career-change',
    name: 'Career Change & Returners',
    icon: '🔄',
    color: 'from-purple-600 to-violet-700',
    badgeBg: 'bg-purple-100 text-purple-800',
    description: 'Strategic reframing templates that turn gaps and pivots into superpowers',
    templates: [
      { id: 'CC001', name: 'Pivot Pro', colors: ['#faf5ff', '#ede9fe', '#c026d3'], tags: ['career-change', 'purple', 'pivot'], best_for: ['Career Changer', 'Industry Switcher'] },
      { id: 'CC002', name: 'Return Strong', colors: ['#f0fdfa', '#ccfbf1', '#14b8a6'], tags: ['returner', 'teal', 'confidence'], best_for: ['Parent Returner', 'Caregiver Returner'] },
      { id: 'CC003', name: 'Industry Jumper', colors: ['#ffffff', '#eff6ff', '#f59e0b'], tags: ['industry-jump', 'amber', 'bold'], best_for: ['Tech to Finance', 'Military to Corporate'] },
      { id: 'CC004', name: 'Freelance to Full-Time', colors: ['#f8fafc', '#e0f2fe', '#0ea5e9'], tags: ['freelance', 'corporate', 'transition'], best_for: ['Freelancer to Employee', 'Contractor'] },
      { id: 'CC005', name: 'Second Act', colors: ['#faf8f4', '#fef3c7', '#c9a84c'], tags: ['midlife', 'gold', 'wisdom'], best_for: ['Mid-Life Career Changer', '50+ Switcher'] },
      { id: 'CC006', name: 'Founder to Corporate', colors: ['#ffffff', '#fef2f2', '#1e40af'], tags: ['founder', 'navy', 'reentry'], best_for: ['Exited Founder', 'Startup to Corporate'] },
      { id: 'CC007', name: 'PhD to Industry', colors: ['#f8fafc', '#e0f2fe', '#0ea5e9'], tags: ['academic-to-industry', 'navy', 'phd'], best_for: ['PhD to Industry', 'Professor to Corporate'] },
      { id: 'CC008', name: 'Mission to Market', colors: ['#f0fdf4', '#dcfce7', '#059669'], tags: ['nonprofit-to-corporate', 'green', 'reframe'], best_for: ['Non-Profit to Corporate', 'NGO to Business'] },
      { id: 'CC009', name: 'Boomerang Return', colors: ['#ffffff', '#eff6ff', '#f59e0b'], tags: ['boomerang', 'navy', 'experienced'], best_for: ['Former Employee Returning', 'Company Alumni'] },
      { id: 'CC010', name: 'Global Nomad', colors: ['#ffffff', '#eff6ff', '#dc2626'], tags: ['global', 'international', 'multilingual'], best_for: ['Expat Professional', 'International Job Seeker'] },
    ],
  },
  {
    id: 'freelance',
    name: 'Freelance & Portfolio',
    icon: '🎯',
    color: 'from-orange-600 to-amber-600',
    badgeBg: 'bg-orange-100 text-orange-800',
    description: 'Client-winning, gig-landing templates for independent creative professionals',
    templates: [
      { id: 'FP001', name: 'Freelance Commander', colors: ['#0f0f0f', '#1a1a2e', '#10b981'], tags: ['freelance', 'dark', 'green'], best_for: ['Freelance Designer', 'Consultant'] },
      { id: 'FP002', name: "Writer's Byline", colors: ['#fffef9', '#2c2c2c', '#dc2626'], tags: ['writing', 'editorial', 'journalism'], best_for: ['Journalist', 'Copywriter'] },
      { id: 'FP003', name: 'UX Portfolio', colors: ['#f8fafc', '#e0f2fe', '#38bdf8'], tags: ['ux', 'design', 'case-study'], best_for: ['UX Designer', 'Product Designer'] },
      { id: 'FP004', name: 'Social Media Mogul', colors: ['#0f0f0f', '#1a1a2e', '#ff6b35'], tags: ['social-media', 'dark', 'creator'], best_for: ['Social Media Manager', 'Content Creator'] },
      { id: 'FP005', name: "Photographer's Eye", colors: ['#0a0a0a', '#2c2c2c', '#d4a017'], tags: ['photography', 'dark', 'gold'], best_for: ['Photographer', 'Videographer'] },
      { id: 'FP006', name: 'Brand Strategist', colors: ['#faf5ff', '#f3e8ff', '#c084fc'], tags: ['brand', 'strategy', 'purple'], best_for: ['Brand Strategist', 'Creative Consultant'] },
      { id: 'FP007', name: 'Music Producer', colors: ['#0a0a0a', '#1a1a1a', '#f97316'], tags: ['music', 'dark', 'audio'], best_for: ['Music Producer', 'Sound Designer'] },
      { id: 'FP008', name: 'Architect Portfolio', colors: ['#f5f5f0', '#e8e0d0', '#b45309'], tags: ['architecture', 'minimal', 'portfolio'], best_for: ['Architect', 'Interior Designer'] },
      { id: 'FP009', name: 'Culinary Artist', colors: ['#faf5ee', '#fef3c7', '#d97706'], tags: ['culinary', 'warm', 'chef'], best_for: ['Chef', 'Culinary Director'] },
      { id: 'FP010', name: 'Podcast Creator', colors: ['#0f0f1a', '#1e1b4b', '#ec4899'], tags: ['podcast', 'dark', 'pink'], best_for: ['Podcast Producer', 'Show Host'] },
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal & Typography-First',
    icon: '✦',
    color: 'from-gray-700 to-gray-900',
    badgeBg: 'bg-gray-100 text-gray-800',
    description: 'Designs where white space, type, and restraint create unforgettable impact',
    templates: [
      { id: 'MT001', name: 'Arctic Minimal', colors: ['#ffffff', '#e8f4f8', '#0f172a'], tags: ['minimal', 'clean', 'scandinavian'], best_for: ['UX Designer', 'Minimalist Creative'] },
      { id: 'MT002', name: 'Manifesto Black', colors: ['#ffffff', '#000000', '#000000'], tags: ['minimal', 'typographic', 'editorial'], best_for: ['Senior Writer', 'Editor'] },
      { id: 'MT003', name: 'Golden Ratio', colors: ['#fefdfb', '#d4a017', '#1e293b'], tags: ['geometric', 'gold', 'mathematical'], best_for: ['Architect', 'Mathematician'] },
      { id: 'MT004', name: 'Newspaper Masthead', colors: ['#fffef9', '#cc0000', '#000000'], tags: ['editorial', 'newspaper', 'bold'], best_for: ['Journalist', 'Editor'] },
      { id: 'MT005', name: 'Mono Space', colors: ['#fafaf8', '#2d6a4f', '#1a1a1a'], tags: ['mono', 'code', 'green'], best_for: ['Developer', 'Technical Writer'] },
      { id: 'MT006', name: 'Thin Line', colors: ['#ffffff', '#e2e8f0', '#64748b'], tags: ['ultra-minimal', 'thin', 'luxury'], best_for: ['Fashion Designer', 'Gallery Curator'] },
      { id: 'MT007', name: 'Condensed Power', colors: ['#ffffff', '#1e293b', '#1e293b'], tags: ['condensed', 'bold', 'dense'], best_for: ['Senior Professional', 'Experienced Manager'] },
      { id: 'MT008', name: 'Soft Editorial', colors: ['#fdfaf7', '#f0e8e0', '#c4956a'], tags: ['soft', 'warm', 'narrative'], best_for: ['Writer', 'Editor', 'Publishing'] },
      { id: 'MT009', name: 'Grid System', colors: ['#ffffff', '#f0f0f0', '#2563eb'], tags: ['grid', 'systematic', 'blue'], best_for: ['UX Designer', 'Product Manager'] },
      { id: 'MT010', name: 'Negative Space', colors: ['#0f172a', '#1e293b', '#ffffff'], tags: ['dark', 'minimal', 'sophisticated'], best_for: ['Senior Designer', 'Agency Creative'] },
    ],
  },
]

// ─── Category-specific persona data ──────────────────────────

type Persona = {
  name: string; nameShort: string; title: string; titleShort: string
  co1: string; co1role: string; co1dates: string; co1loc: string
  co1b1: string; co1b2: string; co1b3: string
  co2: string; co2role: string; co2dates: string
  co2b1: string; co2b2: string
  edu: string; eduDates: string; eduDetail: string
  sk: [string, string, string, string, string, string, string, string]
}

const PERSONAS: Record<string, Persona> = {
  EX: {
    name: 'Alexandra Chen', nameShort: 'A. Chen', title: 'Chief Strategy Officer', titleShort: 'CSO',
    co1: 'Goldman Sachs', co1role: 'Chief Strategy Officer', co1dates: '2019–Now', co1loc: 'New York, NY',
    co1b1: '• Led $4.2B acquisition, +28% shareholder return', co1b2: '• Restructured 3 divisions, $180M cost savings', co1b3: '• Board-level strategy across 12 global markets',
    co2: 'Morgan Stanley', co2role: 'VP Strategy & M&A', co2dates: '2015–2019',
    co2b1: '• Originated 14 M&A deals totalling $8.5B', co2b2: '• Led 22-person strategy team across 3 offices',
    edu: 'MBA, Finance & Strategy · Harvard Business School', eduDates: '2011–2013', eduDetail: 'Baker Scholar · Top 5%',
    sk: ['M&A', 'Strategy', 'Cap. Mkts', 'ESG', 'P&L Mgmt', 'Board Rel.', 'Finance', 'Global'],
  },
  TE: {
    name: 'Alex Johnson', nameShort: 'Alex J.', title: 'Senior Software Engineer', titleShort: 'Sr. Engineer',
    co1: 'Google', co1role: 'Software Engineer II', co1dates: '2021–Now', co1loc: 'Mountain View, CA',
    co1b1: '• Built microservices serving 50M+ daily requests', co1b2: '• Led Kubernetes migration, reduced latency 40%', co1b3: '• Mentored 4 junior engineers on backend practices',
    co2: 'Stripe', co2role: 'Full-Stack Developer', co2dates: '2019–2021',
    co2b1: '• Payment API integrations for 500+ merchants', co2b2: '• Improved checkout conversion by 18% via A/B',
    edu: 'B.S. Computer Science · MIT', eduDates: '2015–2019', eduDetail: 'GPA: 3.9/4.0 · Magna Cum Laude',
    sk: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Python', 'Go', 'PostgreSQL'],
  },
  CD: {
    name: 'Marcus Rivera', nameShort: 'M. Rivera', title: 'Senior Art Director', titleShort: 'Art Director',
    co1: 'Pentagram', co1role: 'Senior Art Director', co1dates: '2020–Now', co1loc: 'New York, NY',
    co1b1: '• Led visual identity for 15 Fortune 500 brands', co1b2: '• Directed 8-person team, $3M project budget', co1b3: '• 6 Cannes Lions, 3 D&AD Pencils (2023)',
    co2: 'IDEO', co2role: 'Lead Designer', co2dates: '2017–2020',
    co2b1: '• Human-centered design for healthcare & fintech', co2b2: '• Brand systems deployed across 40+ markets',
    edu: 'BFA, Graphic Design · Rhode Island School of Design', eduDates: '2013–2017', eduDetail: 'Summa Cum Laude · Portfolio Prize',
    sk: ['Figma', 'Branding', 'Adobe CC', 'Motion', 'Typography', 'Illustrator', 'Sketch', 'Blender'],
  },
  CB: {
    name: 'Jessica Park', nameShort: 'J. Park', title: 'Senior Consultant', titleShort: 'Sr. Consultant',
    co1: 'McKinsey & Company', co1role: 'Senior Consultant', co1dates: '2020–Now', co1loc: 'Chicago, IL',
    co1b1: '• $120M savings via operational transformation', co1b2: '• Led 6-person team across 3 engagements', co1b3: '• Go-to-market strategy for $2B product line',
    co2: 'Deloitte', co2role: 'Business Analyst', co2dates: '2017–2020',
    co2b1: '• Built models for $500M+ infrastructure deals', co2b2: '• Top 10 analyst, North America practice (2019)',
    edu: 'B.S. Business Administration · Wharton', eduDates: '2013–2017', eduDetail: "Dean's List · Phi Beta Kappa",
    sk: ['Strategy', 'Fin. Model', 'Analytics', 'Excel', 'PowerPoint', 'SQL', 'Tableau', 'SAP'],
  },
  HM: {
    name: 'Dr. Emily Carter', nameShort: 'Dr. Carter', title: 'Board-Certified Cardiologist', titleShort: 'Cardiologist',
    co1: 'Mayo Clinic', co1role: 'Attending Cardiologist', co1dates: '2019–Now', co1loc: 'Rochester, MN',
    co1b1: '• 300+ cardiac interventions/yr, 97% success rate', co1b2: '• Principal investigator on 2 NIH clinical trials', co1b3: '• Reduced patient readmission rate by 22%',
    co2: 'Johns Hopkins Hospital', co2role: 'Cardiology Fellow', co2dates: '2016–2019',
    co2b1: '• Completed 3-year ACGME-accredited fellowship', co2b2: '• Published 8 peer-reviewed papers in JACC',
    edu: 'MD, Medicine · Harvard Medical School', eduDates: '2010–2014', eduDetail: 'Alpha Omega Alpha · Top 5%',
    sk: ['Cardiology', 'Echo', 'EP Studies', 'Epic EMR', 'Research', 'ACLS/BLS', 'Cath Lab', 'Teaching'],
  },
  AR: {
    name: 'Dr. James Whitfield', nameShort: 'Dr. Whitfield', title: 'Associate Professor of Economics', titleShort: 'Assoc. Professor',
    co1: 'Harvard University', co1role: 'Associate Professor', co1dates: '2018–Now', co1loc: 'Cambridge, MA',
    co1b1: '• Published 22 papers in top-tier journals', co1b2: '• Secured $1.4M in NSF & Sloan Foundation grants', co1b3: '• Harvard Excellence in Teaching Award (2022)',
    co2: 'MIT Sloan School of Management', co2role: 'Assistant Professor', co2dates: '2014–2018',
    co2b1: '• Developed 2 graduate behavioral econ courses', co2b2: '• Cited 840+ times across Econometrica, JFE, RFS',
    edu: 'PhD, Economics · Princeton University', eduDates: '2009–2014', eduDetail: 'NSF Fellowship · Dissertation Prize',
    sk: ['Econometrics', 'Stata', 'R', 'Python', 'Grants', 'Research', 'Behavioral', 'Teaching'],
  },
  ES: {
    name: 'Tyler Brooks', nameShort: 'T. Brooks', title: 'Software Engineering Intern', titleShort: 'CS Student',
    co1: 'Meta', co1role: 'Software Engineering Intern', co1dates: 'Summer 2024', co1loc: 'Menlo Park, CA',
    co1b1: '• Built analytics dashboard for 200+ engineers', co1b2: '• Reduced pipeline latency 35% via query tuning', co1b3: '• Presented final project to VP Engineering team',
    co2: 'UC Berkeley CS Dept.', co2role: 'Teaching Assistant', co2dates: '2023–2024',
    co2b1: '• Led weekly office hours for 40+ students', co2b2: '• Designed 3 new lab projects for DS course',
    edu: 'B.S. Computer Science · UC Berkeley', eduDates: 'Expected 2026', eduDetail: "GPA: 3.8/4.0 · Dean's List",
    sk: ['Python', 'Java', 'React', 'SQL', 'Git', 'ML Basics', 'Jupyter', 'Pandas'],
  },
  CC: {
    name: "Sarah O'Brien", nameShort: "S. O'Brien", title: 'Product Manager', titleShort: 'Product Mgr.',
    co1: 'Spotify', co1role: 'Product Manager', co1dates: '2022–Now', co1loc: 'New York, NY',
    co1b1: '• Launched podcast discovery, +28M monthly users', co1b2: '• Led cross-functional team of 12, 3 timezones', co1b3: '• Product roadmap drove $4M ARR growth',
    co2: 'Twilio', co2role: 'Senior Software Engineer', co2dates: '2018–2022',
    co2b1: '• Built API infra. for 10B+ messages/month', co2b2: '• Moved to PM track via internal mobility program',
    edu: 'B.S. Computer Engineering · Georgia Tech', eduDates: '2014–2018', eduDetail: 'Honors Program · PM Certificate',
    sk: ['Prod. Strat.', 'Agile', 'SQL', 'User Res.', 'JIRA', 'A/B Test', 'Roadmap', 'Analytics'],
  },
  FP: {
    name: 'Kai Nakamura', nameShort: 'K. Nakamura', title: 'Senior UX Designer', titleShort: 'UX Designer',
    co1: 'Airbnb', co1role: 'Senior UX Designer', co1dates: '2021–Now', co1loc: 'San Francisco, CA',
    co1b1: '• Redesigned host onboarding, +34% completion', co1b2: '• Led 0→1 design for Rooms product (4M users)', co1b3: '• Design system for 60-person product org',
    co2: 'Studio Kai (Freelance)', co2role: 'Founder & UX Designer', co2dates: '2018–2021',
    co2b1: '• Served 25+ clients: Nike, Headspace, LinkedIn', co2b2: '• Grew studio to $320K revenue, team of 3',
    edu: 'B.S. Human-Computer Interaction · Carnegie Mellon', eduDates: '2014–2018', eduDetail: 'Best Thesis Award · UX Fellowship',
    sk: ['Figma', 'Prototyping', 'UX Research', 'Design Sys.', 'Framer', 'Adobe XD', 'Sketch', 'InVision'],
  },
  MT: {
    name: 'Jordan Williams', nameShort: 'J. Williams', title: 'Director of Product', titleShort: 'Product Dir.',
    co1: 'Apple', co1role: 'Director of Product', co1dates: '2020–Now', co1loc: 'Cupertino, CA',
    co1b1: '• iOS productivity suite vision, 180M+ users', co1b2: '• Grew product from 0 to $90M ARR in 18 months', co1b3: '• Scaled product team from 4 to 19 members',
    co2: 'Figma', co2role: 'Senior Product Manager', co2dates: '2017–2020',
    co2b1: '• Owned core editor for 4M+ designers worldwide', co2b2: '• Shipped 12 major features incl. Auto Layout 3.0',
    edu: 'B.S. CS & Design · Stanford University', eduDates: '2013–2017', eduDetail: 'HCI Track · Product Design Fellowship',
    sk: ['Prod. Strat.', 'Roadmapping', 'User Res.', 'SQL', 'Figma', 'OKRs', 'Analytics', 'Agile'],
  },
}

// ─── Mini Resume SVG Previews ─────────────────────────────────

function isDarkColor(hex: string): boolean {
  try {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 < 140
  } catch { return false }
}

// Picks a readable text accent: on dark bg use c1; on light bg prefer dark c1 else fall back to c2
function accentTxt(c0: string, c1: string, c2: string): string {
  if (isDarkColor(c0)) return c1
  return isDarkColor(c1) ? c1 : c2
}

// Compute pill width from skill label length
function sw(s: string): number { return Math.max(18, Math.ceil(s.length * 2.25) + 8) }

function getPersona(id: string): Persona {
  return PERSONAS[id.slice(0, 2).toUpperCase()] ?? PERSONAS['TE']
}

type TplEntry = { id: string; colors: string[]; tags: string[] }
type PP = { c0: string; c1: string; c2: string; id: string; p: Persona }

function getPreviewStyle(t: TplEntry): 'dark' | 'classic' | 'minimal' | 'sidebar' | 'modern' {
  if (isDarkColor(t.colors[0])) return 'dark'
  if (t.tags.some(tag => ['classic','prestige','formal','government','letterpress','craft','cream'].includes(tag))) return 'classic'
  if (t.tags.some(tag => ['minimal','clean','apple','ultra-minimal','thin','mono','swiss','bauhaus','organic','japanese'].includes(tag))) return 'minimal'
  if (t.tags.some(tag => ['grid','two-column','sidebar'].includes(tag))) return 'sidebar'
  return 'modern'
}

function TemplatePreview({ t }: { t: TplEntry }) {
  const c0 = t.colors[0] ?? '#ffffff'
  const c1 = t.colors[1] ?? '#4f46e5'
  const c2 = t.colors[2] ?? '#1a1a1a'
  const id = t.id
  const p = getPersona(id)
  const style = getPreviewStyle(t)
  if (style === 'dark')    return <DarkPreview    c0={c0} c1={c1} c2={c2} id={id} p={p} />
  if (style === 'classic') return <ClassicPreview c0={c0} c1={c1} c2={c2} id={id} p={p} />
  if (style === 'minimal') return <MinimalPreview c0={c0} c1={c1} c2={c2} id={id} p={p} />
  if (style === 'sidebar') return <SidebarPreview c0={c0} c1={c1} c2={c2} id={id} p={p} />
  return <ModernPreview c0={c0} c1={c1} c2={c2} id={id} p={p} />
}

function ModernPreview({ c0, c1, c2, id }: PP) {
  const cl = `rv-${id}`
  return (
    <svg viewBox="0 0 200 267" xmlns="http://www.w3.org/2000/svg" style={{display:'block',width:'100%',height:'100%'}}>
      <defs><clipPath id={cl}><rect width="200" height="267"/></clipPath></defs>
      <g clipPath={`url(#${cl})`}>
        <rect width="200" height="267" fill={c0}/>
        <rect width="200" height="54" fill={c1}/>
        <circle cx="178" cy="27" r="19" fill="white" fillOpacity="0.08"/>
        <text x="12" y="22" fontFamily="system-ui,sans-serif" fontSize="10.5" fontWeight="700" fill="white" fillOpacity="0.95">Alex Johnson</text>
        <text x="12" y="31" fontFamily="system-ui,sans-serif" fontSize="5.5" fill="white" fillOpacity="0.75">Senior Software Engineer</text>
        <text x="12" y="39" fontFamily="system-ui,sans-serif" fontSize="4" fill="white" fillOpacity="0.55">alex@email.com · 555-123-4567 · New York, NY</text>
        <text x="12" y="46" fontFamily="system-ui,sans-serif" fontSize="4" fill="white" fillOpacity="0.4">linkedin.com/in/alexj · github.com/alexj</text>

        <text x="12" y="64" fontFamily="system-ui,sans-serif" fontSize="5.5" fontWeight="700" fill={c1} letterSpacing="1">EXPERIENCE</text>
        <rect x="12" y="67" width="176" height="0.7" fill={c1} fillOpacity="0.28"/>
        <text x="12" y="75.5" fontFamily="system-ui,sans-serif" fontSize="5" fontWeight="600" fill={c2} fillOpacity="0.85">Software Engineer II · Google</text>
        <text x="188" y="75.5" fontFamily="system-ui,sans-serif" fontSize="4" textAnchor="end" fill={c2} fillOpacity="0.5">2021–Now</text>
        <text x="12" y="82" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c2} fillOpacity="0.42">Mountain View, CA</text>
        <text x="14" y="88" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c2} fillOpacity="0.5">• Built microservices serving 50M+ daily requests</text>
        <text x="14" y="94" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c2} fillOpacity="0.5">• Led Kubernetes migration, reduced latency by 40%</text>
        <text x="14" y="100" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c2} fillOpacity="0.5">• Mentored 4 junior engineers on backend best practices</text>
        <text x="12" y="109" fontFamily="system-ui,sans-serif" fontSize="5" fontWeight="600" fill={c2} fillOpacity="0.85">Full-Stack Developer · Stripe</text>
        <text x="188" y="109" fontFamily="system-ui,sans-serif" fontSize="4" textAnchor="end" fill={c2} fillOpacity="0.5">2019–2021</text>
        <text x="14" y="116" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c2} fillOpacity="0.5">• Payment API integrations for 500+ merchants</text>
        <text x="14" y="122" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c2} fillOpacity="0.5">• Improved checkout conversion by 18% via A/B tests</text>

        <text x="12" y="132" fontFamily="system-ui,sans-serif" fontSize="5.5" fontWeight="700" fill={c1} letterSpacing="1">EDUCATION</text>
        <rect x="12" y="135" width="176" height="0.7" fill={c1} fillOpacity="0.28"/>
        <text x="12" y="143" fontFamily="system-ui,sans-serif" fontSize="5" fontWeight="600" fill={c2} fillOpacity="0.85">B.S. Computer Science · MIT</text>
        <text x="188" y="143" fontFamily="system-ui,sans-serif" fontSize="4" textAnchor="end" fill={c2} fillOpacity="0.5">2015–2019</text>
        <text x="12" y="149.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c2} fillOpacity="0.45">Cambridge, MA · GPA: 3.9/4.0 · Magna Cum Laude</text>

        <text x="12" y="160" fontFamily="system-ui,sans-serif" fontSize="5.5" fontWeight="700" fill={c1} letterSpacing="1">SKILLS</text>
        <rect x="12" y="163" width="176" height="0.7" fill={c1} fillOpacity="0.28"/>
        <rect x="12" y="168" width="27" height="7.5" rx="3.75" fill={c1} fillOpacity="0.18"/>
        <text x="25.5" y="173.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">React</text>
        <rect x="43" y="168" width="36" height="7.5" rx="3.75" fill={c1} fillOpacity="0.18"/>
        <text x="61" y="173.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">TypeScript</text>
        <rect x="83" y="168" width="28" height="7.5" rx="3.75" fill={c1} fillOpacity="0.18"/>
        <text x="97" y="173.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">Node.js</text>
        <rect x="115" y="168" width="22" height="7.5" rx="3.75" fill={c1} fillOpacity="0.18"/>
        <text x="126" y="173.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">AWS</text>
        <rect x="141" y="168" width="26" height="7.5" rx="3.75" fill={c1} fillOpacity="0.18"/>
        <text x="154" y="173.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">Docker</text>
        <rect x="12" y="180" width="26" height="7.5" rx="3.75" fill={c1} fillOpacity="0.13"/>
        <text x="25" y="185.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">Python</text>
        <rect x="42" y="180" width="18" height="7.5" rx="3.75" fill={c1} fillOpacity="0.13"/>
        <text x="51" y="185.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">Go</text>
        <rect x="64" y="180" width="36" height="7.5" rx="3.75" fill={c1} fillOpacity="0.13"/>
        <text x="82" y="185.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">PostgreSQL</text>
      </g>
    </svg>
  )
}

function DarkPreview({ c0, c1, c2: _c2, id }: PP) {
  const cl = `rv-${id}`
  return (
    <svg viewBox="0 0 200 267" xmlns="http://www.w3.org/2000/svg" style={{display:'block',width:'100%',height:'100%'}}>
      <defs><clipPath id={cl}><rect width="200" height="267"/></clipPath></defs>
      <g clipPath={`url(#${cl})`}>
        <rect width="200" height="267" fill={c0}/>
        <rect width="200" height="3" fill={c1}/>
        <text x="12" y="23" fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="700" fill={c1} fillOpacity="0.95">Alex Johnson</text>
        <text x="12" y="32.5" fontFamily="system-ui,sans-serif" fontSize="5.5" fill={c1} fillOpacity="0.6">Senior Software Engineer</text>
        <text x="12" y="40.5" fontFamily="system-ui,sans-serif" fontSize="4" fill="white" fillOpacity="0.38">alex@email.com · 555-123-4567 · New York, NY</text>
        <rect x="12" y="47" width="176" height="0.75" fill={c1} fillOpacity="0.35"/>

        <text x="12" y="57" fontFamily="system-ui,sans-serif" fontSize="5.5" fontWeight="700" fill={c1} letterSpacing="1">EXPERIENCE</text>
        <text x="12" y="66.5" fontFamily="system-ui,sans-serif" fontSize="5" fontWeight="600" fill="white" fillOpacity="0.82">Software Engineer II · Google</text>
        <text x="188" y="66.5" fontFamily="system-ui,sans-serif" fontSize="4" textAnchor="end" fill="white" fillOpacity="0.38">2021–Now</text>
        <text x="12" y="73" fontFamily="system-ui,sans-serif" fontSize="3.8" fill="white" fillOpacity="0.32">Mountain View, CA</text>
        <text x="14" y="79" fontFamily="system-ui,sans-serif" fontSize="3.8" fill="white" fillOpacity="0.45">• Built microservices serving 50M+ daily requests</text>
        <text x="14" y="85" fontFamily="system-ui,sans-serif" fontSize="3.8" fill="white" fillOpacity="0.45">• Led Kubernetes migration, reduced latency by 40%</text>
        <text x="14" y="91" fontFamily="system-ui,sans-serif" fontSize="3.8" fill="white" fillOpacity="0.45">• Mentored 4 junior engineers on backend best practices</text>
        <text x="12" y="100" fontFamily="system-ui,sans-serif" fontSize="5" fontWeight="600" fill="white" fillOpacity="0.82">Full-Stack Developer · Stripe</text>
        <text x="188" y="100" fontFamily="system-ui,sans-serif" fontSize="4" textAnchor="end" fill="white" fillOpacity="0.38">2019–2021</text>
        <text x="14" y="107" fontFamily="system-ui,sans-serif" fontSize="3.8" fill="white" fillOpacity="0.45">• Payment API integrations for 500+ merchants</text>
        <text x="14" y="113" fontFamily="system-ui,sans-serif" fontSize="3.8" fill="white" fillOpacity="0.45">• Improved checkout conversion by 18%</text>

        <text x="12" y="123" fontFamily="system-ui,sans-serif" fontSize="5.5" fontWeight="700" fill={c1} letterSpacing="1">EDUCATION</text>
        <text x="12" y="132" fontFamily="system-ui,sans-serif" fontSize="5" fontWeight="600" fill="white" fillOpacity="0.82">B.S. Computer Science · MIT</text>
        <text x="188" y="132" fontFamily="system-ui,sans-serif" fontSize="4" textAnchor="end" fill="white" fillOpacity="0.38">2015–2019</text>
        <text x="12" y="138.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill="white" fillOpacity="0.38">GPA: 3.9/4.0 · Magna Cum Laude</text>

        <text x="12" y="149" fontFamily="system-ui,sans-serif" fontSize="5.5" fontWeight="700" fill={c1} letterSpacing="1">SKILLS</text>
        <rect x="12" y="153" width="27" height="8" rx="4" fill={c1} fillOpacity="0.28"/>
        <text x="25.5" y="158.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">React</text>
        <rect x="43" y="153" width="36" height="8" rx="4" fill={c1} fillOpacity="0.24"/>
        <text x="61" y="158.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">TypeScript</text>
        <rect x="83" y="153" width="28" height="8" rx="4" fill={c1} fillOpacity="0.22"/>
        <text x="97" y="158.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">Node.js</text>
        <rect x="115" y="153" width="22" height="8" rx="4" fill={c1} fillOpacity="0.2"/>
        <text x="126" y="158.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">AWS</text>
        <rect x="141" y="153" width="26" height="8" rx="4" fill={c1} fillOpacity="0.2"/>
        <text x="154" y="158.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">Docker</text>
        <rect x="12" y="165" width="26" height="8" rx="4" fill={c1} fillOpacity="0.16"/>
        <text x="25" y="170.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">Python</text>
        <rect x="42" y="165" width="18" height="8" rx="4" fill={c1} fillOpacity="0.16"/>
        <text x="51" y="170.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">Go</text>
        <rect x="64" y="165" width="36" height="8" rx="4" fill={c1} fillOpacity="0.14"/>
        <text x="82" y="170.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c1} textAnchor="middle">PostgreSQL</text>
      </g>
    </svg>
  )
}

function ClassicPreview({ c0, c1, c2, id }: PP) {
  const cl = `rv-${id}`
  return (
    <svg viewBox="0 0 200 267" xmlns="http://www.w3.org/2000/svg" style={{display:'block',width:'100%',height:'100%'}}>
      <defs><clipPath id={cl}><rect width="200" height="267"/></clipPath></defs>
      <g clipPath={`url(#${cl})`}>
        <rect width="200" height="267" fill={c0}/>
        <text x="100" y="20" fontFamily="Georgia,'Times New Roman',serif" fontSize="12" fontWeight="700" textAnchor="middle" fill={c2} fillOpacity="0.88" letterSpacing="1.5">ALEX JOHNSON</text>
        <text x="100" y="29" fontFamily="Georgia,'Times New Roman',serif" fontSize="5.5" textAnchor="middle" fill={c2} fillOpacity="0.5" fontStyle="italic">Senior Software Engineer</text>
        <text x="100" y="37.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="4" textAnchor="middle" fill={c2} fillOpacity="0.38">alex@email.com · 555-123-4567 · New York, NY</text>
        <rect x="12" y="43" width="176" height="1.5" fill={c1}/>
        <rect x="12" y="46.5" width="176" height="0.5" fill={c1} fillOpacity="0.4"/>

        <text x="12" y="57" fontFamily="Georgia,'Times New Roman',serif" fontSize="6" fontWeight="700" fill={c2} fillOpacity="0.7" letterSpacing="1.5">EXPERIENCE</text>
        <rect x="12" y="60" width="176" height="0.6" fill={c2} fillOpacity="0.18"/>
        <text x="12" y="68.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="5" fontWeight="700" fill={c2} fillOpacity="0.82">Software Engineer II · Google</text>
        <text x="188" y="68.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="4" textAnchor="end" fill={c2} fillOpacity="0.42">2021–Present</text>
        <text x="12" y="75" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fontStyle="italic" fill={c2} fillOpacity="0.42">Mountain View, CA</text>
        <text x="14" y="81.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c2} fillOpacity="0.5">• Built microservices serving 50M+ daily requests</text>
        <text x="14" y="87.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c2} fillOpacity="0.5">• Led Kubernetes migration, reduced latency by 40%</text>
        <text x="14" y="93.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c2} fillOpacity="0.5">• Mentored 4 junior engineers on best practices</text>
        <text x="12" y="103" fontFamily="Georgia,'Times New Roman',serif" fontSize="5" fontWeight="700" fill={c2} fillOpacity="0.82">Full-Stack Developer · Stripe</text>
        <text x="188" y="103" fontFamily="Georgia,'Times New Roman',serif" fontSize="4" textAnchor="end" fill={c2} fillOpacity="0.42">2019–2021</text>
        <text x="14" y="110" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c2} fillOpacity="0.5">• Payment API integrations for 500+ merchants</text>
        <text x="14" y="116" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c2} fillOpacity="0.5">• Improved checkout conversion by 18%</text>

        <text x="12" y="127" fontFamily="Georgia,'Times New Roman',serif" fontSize="6" fontWeight="700" fill={c2} fillOpacity="0.7" letterSpacing="1.5">EDUCATION</text>
        <rect x="12" y="130" width="176" height="0.6" fill={c2} fillOpacity="0.18"/>
        <text x="12" y="138.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="5" fontWeight="700" fill={c2} fillOpacity="0.82">B.S. Computer Science · MIT</text>
        <text x="188" y="138.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="4" textAnchor="end" fill={c2} fillOpacity="0.42">2015–2019</text>
        <text x="12" y="145" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c2} fillOpacity="0.45">Cambridge, MA · GPA: 3.9/4.0 · Magna Cum Laude</text>

        <text x="12" y="156" fontFamily="Georgia,'Times New Roman',serif" fontSize="6" fontWeight="700" fill={c2} fillOpacity="0.7" letterSpacing="1.5">SKILLS</text>
        <rect x="12" y="159" width="176" height="0.6" fill={c2} fillOpacity="0.18"/>
        <rect x="12" y="164" width="27" height="8" rx="4" fill={c1} fillOpacity="0.25"/>
        <text x="25.5" y="169.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c1} textAnchor="middle">React</text>
        <rect x="43" y="164" width="36" height="8" rx="4" fill={c1} fillOpacity="0.2"/>
        <text x="61" y="169.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c1} textAnchor="middle">TypeScript</text>
        <rect x="83" y="164" width="28" height="8" rx="4" fill={c1} fillOpacity="0.2"/>
        <text x="97" y="169.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c1} textAnchor="middle">Node.js</text>
        <rect x="115" y="164" width="22" height="8" rx="4" fill={c1} fillOpacity="0.18"/>
        <text x="126" y="169.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c1} textAnchor="middle">AWS</text>
        <rect x="141" y="164" width="26" height="8" rx="4" fill={c1} fillOpacity="0.18"/>
        <text x="154" y="169.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c1} textAnchor="middle">Docker</text>
        <rect x="12" y="176" width="26" height="8" rx="4" fill={c1} fillOpacity="0.14"/>
        <text x="25" y="181.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c1} textAnchor="middle">Python</text>
        <rect x="42" y="176" width="36" height="8" rx="4" fill={c1} fillOpacity="0.14"/>
        <text x="60" y="181.5" fontFamily="Georgia,'Times New Roman',serif" fontSize="3.8" fill={c1} textAnchor="middle">PostgreSQL</text>
      </g>
    </svg>
  )
}

function MinimalPreview({ c0, c1, c2, id }: PP) {
  const cl = `rv-${id}`
  return (
    <svg viewBox="0 0 200 267" xmlns="http://www.w3.org/2000/svg" style={{display:'block',width:'100%',height:'100%'}}>
      <defs><clipPath id={cl}><rect width="200" height="267"/></clipPath></defs>
      <g clipPath={`url(#${cl})`}>
        <rect width="200" height="267" fill={c0}/>
        <rect width="3" height="267" fill={c1}/>
        <text x="18" y="25" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="300" fill={c2} fillOpacity="0.75" letterSpacing="-0.5">Alex Johnson</text>
        <text x="18" y="34" fontFamily="system-ui,sans-serif" fontSize="5.5" fill={c2} fillOpacity="0.38">Senior Software Engineer</text>
        <text x="18" y="41.5" fontFamily="system-ui,sans-serif" fontSize="4" fill={c2} fillOpacity="0.28">alex@email.com · 555-123-4567 · New York, NY</text>
        <rect x="18" y="47.5" width="172" height="0.6" fill={c2} fillOpacity="0.1"/>

        <text x="18" y="57" fontFamily="system-ui,sans-serif" fontSize="4.5" fontWeight="600" fill={c1} fillOpacity="0.85" letterSpacing="1">EXPERIENCE</text>
        <text x="18" y="66" fontFamily="system-ui,sans-serif" fontSize="5" fontWeight="600" fill={c2} fillOpacity="0.72">Software Engineer II · Google</text>
        <text x="188" y="66" fontFamily="system-ui,sans-serif" fontSize="3.8" textAnchor="end" fill={c2} fillOpacity="0.32">2021–Now</text>
        <text x="18" y="72.5" fontFamily="system-ui,sans-serif" fontSize="3.8" fill={c2} fillOpacity="0.28">Mountain View, CA</text>
        <text x="20" y="78.5" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.4">• Built microservices serving 50M+ daily requests</text>
        <text x="20" y="84" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.4">• Led Kubernetes migration, reduced latency by 40%</text>
        <text x="20" y="89.5" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.4">• Mentored 4 junior engineers on best practices</text>
        <text x="18" y="98" fontFamily="system-ui,sans-serif" fontSize="5" fontWeight="600" fill={c2} fillOpacity="0.72">Full-Stack Developer · Stripe</text>
        <text x="188" y="98" fontFamily="system-ui,sans-serif" fontSize="3.8" textAnchor="end" fill={c2} fillOpacity="0.32">2019–2021</text>
        <text x="20" y="104.5" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.4">• Payment API integrations for 500+ merchants</text>
        <text x="20" y="110" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.4">• Improved checkout conversion by 18%</text>
        <rect x="18" y="116" width="172" height="0.5" fill={c2} fillOpacity="0.08"/>

        <text x="18" y="124.5" fontFamily="system-ui,sans-serif" fontSize="4.5" fontWeight="600" fill={c1} fillOpacity="0.85" letterSpacing="1">EDUCATION</text>
        <text x="18" y="133" fontFamily="system-ui,sans-serif" fontSize="5" fontWeight="600" fill={c2} fillOpacity="0.72">B.S. Computer Science · MIT</text>
        <text x="188" y="133" fontFamily="system-ui,sans-serif" fontSize="3.8" textAnchor="end" fill={c2} fillOpacity="0.32">2015–2019</text>
        <text x="18" y="139.5" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.35">GPA: 3.9/4.0 · Magna Cum Laude</text>
        <rect x="18" y="145.5" width="172" height="0.5" fill={c2} fillOpacity="0.08"/>

        <text x="18" y="154" fontFamily="system-ui,sans-serif" fontSize="4.5" fontWeight="600" fill={c1} fillOpacity="0.85" letterSpacing="1">SKILLS</text>
        <rect x="18" y="158.5" width="27" height="7.5" rx="3.75" fill={c1} fillOpacity="0.15"/>
        <text x="31.5" y="163.5" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.65" textAnchor="middle">React</text>
        <rect x="49" y="158.5" width="36" height="7.5" rx="3.75" fill={c1} fillOpacity="0.12"/>
        <text x="67" y="163.5" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.65" textAnchor="middle">TypeScript</text>
        <rect x="89" y="158.5" width="28" height="7.5" rx="3.75" fill={c1} fillOpacity="0.12"/>
        <text x="103" y="163.5" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.65" textAnchor="middle">Node.js</text>
        <rect x="121" y="158.5" width="22" height="7.5" rx="3.75" fill={c1} fillOpacity="0.12"/>
        <text x="132" y="163.5" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.65" textAnchor="middle">AWS</text>
        <rect x="147" y="158.5" width="26" height="7.5" rx="3.75" fill={c1} fillOpacity="0.1"/>
        <text x="160" y="163.5" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.65" textAnchor="middle">Docker</text>
        <rect x="18" y="170" width="26" height="7.5" rx="3.75" fill={c1} fillOpacity="0.1"/>
        <text x="31" y="175" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.65" textAnchor="middle">Python</text>
        <rect x="48" y="170" width="18" height="7.5" rx="3.75" fill={c1} fillOpacity="0.1"/>
        <text x="57" y="175" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.65" textAnchor="middle">Go</text>
        <rect x="70" y="170" width="36" height="7.5" rx="3.75" fill={c1} fillOpacity="0.1"/>
        <text x="88" y="175" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.65" textAnchor="middle">PostgreSQL</text>
      </g>
    </svg>
  )
}

function SidebarPreview({ c0, c1, c2, id }: PP) {
  const cl = `rv-${id}`
  return (
    <svg viewBox="0 0 200 267" xmlns="http://www.w3.org/2000/svg" style={{display:'block',width:'100%',height:'100%'}}>
      <defs><clipPath id={cl}><rect width="200" height="267"/></clipPath></defs>
      <g clipPath={`url(#${cl})`}>
        <rect width="64" height="267" fill={c1}/>
        <rect x="64" width="136" height="267" fill={c0}/>
        <circle cx="32" cy="28" r="17" fill="white" fillOpacity="0.18"/>
        <text x="32" y="55" fontFamily="system-ui,sans-serif" fontSize="5" fontWeight="700" textAnchor="middle" fill="white" fillOpacity="0.9">Alex J.</text>
        <text x="32" y="62" fontFamily="system-ui,sans-serif" fontSize="3.5" textAnchor="middle" fill="white" fillOpacity="0.55">Sr. Engineer</text>
        <rect x="8" y="67.5" width="48" height="0.6" fill="white" fillOpacity="0.2"/>
        <text x="8" y="76" fontFamily="system-ui,sans-serif" fontSize="4.5" fontWeight="600" fill="white" fillOpacity="0.65">CONTACT</text>
        <text x="8" y="83.5" fontFamily="system-ui,sans-serif" fontSize="3.5" fill="white" fillOpacity="0.55">alex@email.com</text>
        <text x="8" y="89.5" fontFamily="system-ui,sans-serif" fontSize="3.5" fill="white" fillOpacity="0.5">555-123-4567</text>
        <text x="8" y="95.5" fontFamily="system-ui,sans-serif" fontSize="3.5" fill="white" fillOpacity="0.5">New York, NY</text>
        <text x="8" y="101.5" fontFamily="system-ui,sans-serif" fontSize="3.5" fill="white" fillOpacity="0.45">linkedin.com/alexj</text>
        <rect x="8" y="107" width="48" height="0.6" fill="white" fillOpacity="0.2"/>
        <text x="8" y="115" fontFamily="system-ui,sans-serif" fontSize="4.5" fontWeight="600" fill="white" fillOpacity="0.65">SKILLS</text>
        <rect x="8" y="119.5" width="48" height="7.5" rx="3.75" fill="white" fillOpacity="0.12"/>
        <text x="32" y="125" fontFamily="system-ui,sans-serif" fontSize="3.5" textAnchor="middle" fill="white" fillOpacity="0.72">React</text>
        <rect x="8" y="130" width="48" height="7.5" rx="3.75" fill="white" fillOpacity="0.1"/>
        <text x="32" y="135.5" fontFamily="system-ui,sans-serif" fontSize="3.5" textAnchor="middle" fill="white" fillOpacity="0.72">TypeScript</text>
        <rect x="8" y="140.5" width="48" height="7.5" rx="3.75" fill="white" fillOpacity="0.1"/>
        <text x="32" y="146" fontFamily="system-ui,sans-serif" fontSize="3.5" textAnchor="middle" fill="white" fillOpacity="0.72">Node.js</text>
        <rect x="8" y="151" width="48" height="7.5" rx="3.75" fill="white" fillOpacity="0.08"/>
        <text x="32" y="156.5" fontFamily="system-ui,sans-serif" fontSize="3.5" textAnchor="middle" fill="white" fillOpacity="0.72">Python</text>
        <rect x="8" y="161.5" width="48" height="7.5" rx="3.75" fill="white" fillOpacity="0.08"/>
        <text x="32" y="167" fontFamily="system-ui,sans-serif" fontSize="3.5" textAnchor="middle" fill="white" fillOpacity="0.72">AWS</text>

        <text x="76" y="18" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700" fill={c2} fillOpacity="0.82">Alex Johnson</text>
        <text x="76" y="27" fontFamily="system-ui,sans-serif" fontSize="5" fill={c2} fillOpacity="0.45">Senior Software Engineer</text>
        <rect x="76" y="33" width="112" height="0.75" fill={c2} fillOpacity="0.15"/>
        <text x="76" y="43" fontFamily="system-ui,sans-serif" fontSize="5.5" fontWeight="700" fill={c2} fillOpacity="0.6" letterSpacing="0.8">EXPERIENCE</text>
        <text x="76" y="52" fontFamily="system-ui,sans-serif" fontSize="4.5" fontWeight="600" fill={c2} fillOpacity="0.78">Software Eng II · Google</text>
        <text x="188" y="52" fontFamily="system-ui,sans-serif" fontSize="3.8" textAnchor="end" fill={c2} fillOpacity="0.38">2021–Now</text>
        <text x="76" y="58.5" fontFamily="system-ui,sans-serif" fontSize="3.6" fill={c2} fillOpacity="0.32">Mountain View, CA</text>
        <text x="78" y="64.5" fontFamily="system-ui,sans-serif" fontSize="3.5" fill={c2} fillOpacity="0.45">• Microservices for 50M+ users</text>
        <text x="78" y="70" fontFamily="system-ui,sans-serif" fontSize="3.5" fill={c2} fillOpacity="0.45">• Kubernetes migration, –40% latency</text>
        <text x="78" y="75.5" fontFamily="system-ui,sans-serif" fontSize="3.5" fill={c2} fillOpacity="0.45">• Mentored 4 junior engineers</text>
        <text x="76" y="85" fontFamily="system-ui,sans-serif" fontSize="4.5" fontWeight="600" fill={c2} fillOpacity="0.78">Full-Stack Dev · Stripe</text>
        <text x="188" y="85" fontFamily="system-ui,sans-serif" fontSize="3.8" textAnchor="end" fill={c2} fillOpacity="0.38">2019–2021</text>
        <text x="78" y="91.5" fontFamily="system-ui,sans-serif" fontSize="3.5" fill={c2} fillOpacity="0.45">• Payment APIs for 500+ merchants</text>
        <text x="78" y="97" fontFamily="system-ui,sans-serif" fontSize="3.5" fill={c2} fillOpacity="0.45">• Improved conversion by 18%</text>
        <rect x="76" y="103" width="112" height="0.6" fill={c2} fillOpacity="0.1"/>
        <text x="76" y="112" fontFamily="system-ui,sans-serif" fontSize="5.5" fontWeight="700" fill={c2} fillOpacity="0.6" letterSpacing="0.8">EDUCATION</text>
        <text x="76" y="121" fontFamily="system-ui,sans-serif" fontSize="4.5" fontWeight="600" fill={c2} fillOpacity="0.78">B.S. CS · MIT</text>
        <text x="188" y="121" fontFamily="system-ui,sans-serif" fontSize="3.8" textAnchor="end" fill={c2} fillOpacity="0.38">2015–2019</text>
        <text x="76" y="127.5" fontFamily="system-ui,sans-serif" fontSize="3.5" fill={c2} fillOpacity="0.38">GPA: 3.9 · Magna Cum Laude</text>
      </g>
    </svg>
  )
}

export default function ResumeTemplatesPage() {
  const totalTemplates = CATEGORIES.reduce((sum, cat) => sum + cat.templates.length, 0)

  return (
    <>
      <JsonLd data={schemas} />

      <div className="min-h-screen bg-gray-50">

        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
              <span>📋</span>
              <span>{totalTemplates} Premium Resume Templates — Better Than Canva Pro</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Land Your Dream Job.<br className="hidden sm:block" />
              <span className="text-yellow-300">Start With the Right Resume.</span>
            </h1>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
              {totalTemplates} premium resume templates across 10 professional categories. Designed above Canva Pro standards.
              ATS-optimized. Free to download. No account needed.
            </p>

            {/* Category quick-links */}
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(cat => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3.5 py-2 rounded-full transition-colors"
                >
                  {cat.icon} {cat.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust bar ────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            {[
              { icon: '🏆', text: 'Premium quality, 100% free' },
              { icon: '🤖', text: 'ATS-optimized layouts' },
              { icon: '🎨', text: '10 distinct style categories' },
              { icon: '📥', text: 'Instant download' },
              { icon: '🚫', text: 'No watermarks, ever' },
            ].map(b => (
              <span key={b.text} className="flex items-center gap-1.5 font-medium">
                <span>{b.icon}</span>{b.text}
              </span>
            ))}
          </div>
        </div>

        {/* ── Category Sections ─────────────────────────────── */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-16" id="main-content">

          {CATEGORIES.map(cat => (
            <section
              key={cat.id}
              id={cat.id}
              aria-labelledby={`heading-${cat.id}`}
              className="scroll-mt-8"
            >
              {/* Section header */}
              <div className={`bg-gradient-to-r ${cat.color} rounded-2xl p-6 mb-6 flex items-center justify-between`}>
                <div>
                  <div className="text-3xl mb-1">{cat.icon}</div>
                  <h2 id={`heading-${cat.id}`} className="text-2xl font-extrabold text-white">
                    {cat.name}
                  </h2>
                  <p className="text-white/80 text-sm mt-1">{cat.description}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-4xl font-black text-white/30">{cat.templates.length}</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider">templates</div>
                </div>
              </div>

              {/* Template grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cat.templates.map(template => (
                  <div
                    key={template.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    {/* Mini resume preview */}
                    <div className="w-full aspect-[3/4] overflow-hidden border-b border-gray-100">
                      <TemplatePreview t={template} />
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-indigo-700 transition-colors">
                        {template.name}
                      </h3>

                      {/* Best for */}
                      <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-1">
                        {template.best_for.slice(0, 2).join(' · ')}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.badgeBg}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <Link
                        href="/tools/document-tools/resume-builder"
                        className="mt-3 flex items-center justify-center gap-1.5 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Use This Template
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* ── SEO / About section ───────────────────────── */}
          <section className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why RoughTools Resume Templates?</h2>
            <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
              <div>
                <p className="mb-3">
                  Our {totalTemplates} resume templates are designed to a standard above Canva Pro — each one with a unique
                  visual identity, ATS-friendly structure, and tailored for specific industries and career stages.
                </p>
                <p>
                  From the ultra-premium Obsidian Throne for C-suite executives to the clean First Launch template
                  for fresh graduates, every design serves a purpose and stands out to hiring managers.
                </p>
              </div>
              <ul className="space-y-2">
                {[
                  `${totalTemplates} templates across 10 career categories`,
                  'ATS-optimized layouts — pass applicant tracking systems',
                  'Each template has a unique visual identity, not a variation',
                  'Tailored best-for roles so you pick the right one',
                  'Free to use — no Canva Pro subscription needed',
                  'No watermarks on downloaded files',
                ].map(point => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-3">Other free tools you might need:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { href: '/tools/pdf', label: '📄 PDF Tools' },
                  { href: '/tools/document-tools/cover-letter-builder', label: '✉️ Cover Letter Builder' },
                  { href: '/tools/document-tools/invoice-generator', label: '🧾 Invoice Generator' },
                  { href: '/tools/image-tools', label: '🖼️ Image Tools' },
                  { href: '/tools/legal-tools', label: '⚖️ Legal Tools' },
                ].map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
