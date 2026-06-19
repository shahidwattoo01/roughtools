import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IQ Test — Free Online IQ Test with Instant Results | RoughTools',
  description:
    'Take a free 20-question IQ test online. Measures logic, pattern recognition, and spatial reasoning. Get your IQ score instantly. No signup required. Accurate & science-backed.',
  keywords: [
    'iq test online free',
    'free iq test',
    'online iq test',
    'iq score test',
    'intelligence test online',
    'iq test no signup',
    'pattern recognition test',
    'logic test online',
    'spatial reasoning test',
    'cognitive ability test',
    'iq test instant results',
    'free intelligence test',
    'iq test pakistan',
    'mental ability test',
  ],
  alternates: { canonical: 'https://roughtools.com/tools/iq-test/session' },
  openGraph: {
    title: 'IQ Test — Free Online IQ Test with Instant Results | RoughTools',
    description:
      '20-question IQ test measuring logic, patterns, and spatial reasoning. Free, instant results, no signup.',
    url: 'https://roughtools.com/tools/iq-test/session',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free IQ Test Online — Instant Results | RoughTools',
    description: 'Take a 20-question IQ test free. Logic, patterns, spatial reasoning. No signup.',
  },
  robots: { index: true, follow: true },
};

export default function IQTestSessionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
