// ============================================================
// ROUGHTOOLS — SEO CONFIG
// Central configuration for all SEO settings
// ============================================================

export const SEO_CONFIG = {
  siteName: 'RoughTools',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com',
  defaultTitle: 'RoughTools — 604+ Free Online Tools: PDF, Calculators & More',
  defaultDescription:
    'Free online tools for everyone. 604+ tools — PDF converter, 203 calculators, developer tools, unit converters, IQ test, and more. No signup required.',
  defaultKeywords: [
    'free online tools',
    'pdf tools',
    'calculators',
    'developer tools',
    'unit converters',
    'text tools',
    'network tools',
    'online utilities',
  ],
  twitterHandle: '@roughtools',
  locale: 'en_US',
  themeColor: '#6366f1',
  backgroundColor: '#ffffff',
}

// Category metadata for SEO
export const CATEGORY_SEO: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  pdf: {
    title: 'Free PDF Tools — Convert, Compress, Merge & More | RoughTools',
    description:
      'Free online PDF tools: compress, merge, split, convert PDF to Word/Excel/JPG, add watermarks, OCR and 15+ more. No signup, no watermark on free tier.',
    keywords: [
      'pdf tools',
      'pdf converter',
      'compress pdf',
      'merge pdf',
      'split pdf',
      'pdf to word',
      'pdf to excel',
      'online pdf editor',
    ],
  },
  calculators: {
    title: 'Free Online Calculators — Financial, Health, Math | RoughTools',
    description:
      'Free online calculators: BMI, loan, mortgage, compound interest, age calculator, percentage, tip calculator and more. Accurate results instantly.',
    keywords: [
      'online calculators',
      'bmi calculator',
      'loan calculator',
      'mortgage calculator',
      'compound interest',
      'percentage calculator',
      'age calculator',
    ],
  },
  developer: {
    title: 'Free Developer Tools — JSON, Base64, Regex & More | RoughTools',
    description:
      'Free developer tools online: JSON formatter, Base64 encoder/decoder, regex tester, CSS minifier, JS beautifier, UUID generator, hash generator and more.',
    keywords: [
      'developer tools',
      'json formatter',
      'base64 encoder',
      'regex tester',
      'css minifier',
      'js beautifier',
      'uuid generator',
      'hash generator',
    ],
  },
  text: {
    title: 'Free Text Tools — Word Counter, Grammar Checker & More | RoughTools',
    description:
      'Free text tools: word counter, character counter, case converter, text summarizer, grammar checker, readability score, Lorem ipsum generator and more.',
    keywords: [
      'text tools',
      'word counter',
      'character counter',
      'case converter',
      'grammar checker',
      'text summarizer',
      'readability checker',
    ],
  },
  converters: {
    title: 'Free Unit Converters — Length, Weight, Temperature & More | RoughTools',
    description:
      'Free unit converters: length, weight, temperature, area, volume, speed, digital storage, time and more. Quick and accurate unit conversion online.',
    keywords: [
      'unit converter',
      'length converter',
      'weight converter',
      'temperature converter',
      'unit conversion',
      'metric converter',
    ],
  },
  network: {
    title: 'Free Network Tools — DNS Lookup, WHOIS, IP Checker | RoughTools',
    description:
      'Free network tools: DNS lookup, WHOIS lookup, IP checker, port checker, ping tool, HTTP headers checker, website speed test and more.',
    keywords: [
      'network tools',
      'dns lookup',
      'whois lookup',
      'ip checker',
      'port checker',
      'website speed test',
      'http headers checker',
    ],
  },
  'legal-tools': {
    title: 'Free Legal Tools — NDA, Privacy Policy, Will Creator & More | RoughTools',
    description:
      'Free online legal tools: NDA generator, privacy policy builder, will creator, contract templates, terms of service generator and more. No signup required.',
    keywords: [
      'legal tools',
      'nda generator',
      'privacy policy generator',
      'will creator',
      'contract generator',
      'terms of service generator',
      'free legal documents',
    ],
  },
  'real-estate': {
    title: 'Free Real Estate Tools — Mortgage, Rent vs Buy & More | RoughTools',
    description:
      'Free online real estate tools: mortgage calculator, rent vs buy calculator, home affordability calculator, property ROI and more. No signup required.',
    keywords: [
      'real estate tools',
      'mortgage calculator',
      'rent vs buy calculator',
      'home affordability calculator',
      'property roi calculator',
      'real estate calculators',
    ],
  },
  'image-tools': {
    title: 'Free Online Image Tools — Compress, Resize, Convert & More | RoughTools',
    description:
      'Free online image tools: background remover, image compressor, resizer, converter, passport photo maker, meme generator, and 30+ more. No signup needed.',
    keywords: [
      'image tools',
      'background remover',
      'image compressor',
      'image resizer',
      'image converter',
      'passport photo maker',
      'image editor online',
      'free image tools',
    ],
  },
  business: {
    title: 'Free Business & Marketing Tools — AI Copy, Ads, SEO | Roughtools',
    description:
      'Free AI-powered business tools: sales copy generator, ad creative maker, email marketing AI, social media scheduler, landing page builder, and SEO optimizer. No signup.',
    keywords: [
      'business tools',
      'marketing tools',
      'sales copy ai',
      'ad creative generator',
      'email marketing ai',
      'social media scheduler',
      'seo optimizer',
      'landing page builder',
    ],
  },
  medical: {
    title: 'Free Medical & Clinical Calculators — 113 Health Tools | RoughTools',
    description:
      'Free online medical calculators: BMI, cardiac risk scores, eGFR, Glasgow Coma Scale, PHQ-9, drug dosing, obstetrics, and 100+ more clinical tools. For education only.',
    keywords: [
      'medical calculators',
      'clinical calculators',
      'bmi calculator',
      'egfr calculator',
      'cardiac risk score',
      'drug dose calculator',
      'health tools online',
      'free medical tools',
    ],
  },
  engineering: {
    title: '126 Free Engineering Calculators & Tools | RoughTools',
    description:
      'Professional engineering calculators for civil, electrical, mechanical, HVAC, software and more. Free, instant, browser-based — no signup required.',
    keywords: [
      'engineering calculators',
      'civil engineering tools',
      'electrical engineering calculator',
      'mechanical engineering calculator',
      'HVAC calculator',
      'online engineering tools',
    ],
  },
  environment: {
    title: 'Free Environment & Eco Tools — Carbon, Solar, EV | Roughtools',
    description:
      'Free eco tools: solar savings calculator, home energy audit, EV carbon offset, flight carbon calculator, carbon footprint calculator, and waste reduction planner. No signup.',
    keywords: [
      'environment tools',
      'carbon footprint calculator',
      'solar savings calculator',
      'ev carbon offset',
      'flight carbon calculator',
      'home energy audit',
      'waste reduction planner',
      'eco tools',
    ],
  },
}