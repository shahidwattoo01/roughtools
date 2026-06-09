import type { Metadata } from 'next'
import TextClient from './TextClient'

export const metadata: Metadata = {
  title: '10 Free Text Tools — Word Counter, Grammar Checker & More | Roughtools',
  description: 'Free online text tools: word counter, grammar checker, case converter, readability scorer, text summariser, Lorem Ipsum generator, find & replace, text reverser, duplicate line remover, and text-to-speech. No signup. Instant results.',
  keywords: ['text tools', 'word counter', 'grammar checker', 'case converter', 'lorem ipsum generator', 'text summarizer', 'readability score', 'text to speech', 'find and replace', 'free text tools'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/text' },
  openGraph: {
    title: '10 Free Text Tools — Word Counter, Grammar Checker & More | Roughtools',
    description: 'Word counter, grammar checker, case converter, text summariser, Lorem Ipsum generator and more. All free, no signup.',
    url: 'https://roughtools.com/tools/text',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: '10 Free Text Tools | Roughtools',
    description: 'Word counter, grammar checker, case converter, text summariser and more — all free, instant, no signup.',
  },
}

export default function TextPage() {
  return <TextClient />
}
