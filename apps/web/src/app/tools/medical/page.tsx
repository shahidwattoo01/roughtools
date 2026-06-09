import type { Metadata } from 'next'
import MedicalPageClient from './_components/MedicalPageClient'

export const metadata: Metadata = {
  title: '113 Free Medical & Clinical Calculators | Roughtools',
  description:
    'Free online medical calculators for cardiology, nephrology, emergency/ICU, neurology, endocrinology, pharmacology, obstetrics, and more. 113 tools for clinical reference.',
  keywords: [
    'medical calculators', 'clinical calculators', 'cardiology risk score', 'eGFR calculator',
    'drug dose calculator', 'obstetrics calculator', 'ICU score', 'free medical tools',
    'clinical decision support', 'health calculators',
  ],
  alternates: { canonical: 'https://roughtools.com/tools/medical' },
  openGraph: {
    title: '113 Free Medical & Clinical Calculators | Roughtools',
    description: 'Cardiology, Nephrology, Emergency/ICU, Neurology, Endocrinology, Pharmacology & more — all free, browser-based.',
    url: 'https://roughtools.com/tools/medical',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: '113 Free Medical Calculators | Roughtools',
    description: 'Clinical-grade calculators for every specialty — free, no signup.',
  },
  robots: { index: true, follow: true },
}

export default function MedicalHubPage() {
  return <MedicalPageClient />
}
