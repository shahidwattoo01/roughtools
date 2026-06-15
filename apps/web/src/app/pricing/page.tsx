import type { Metadata } from 'next'
import Link from 'next/link'
import { TOTAL_REAL_TOOLS } from '@/lib/tool-counts'

export const metadata: Metadata = {
  title: 'Free Forever — No Plans, No Payments | RoughTools',
  description:
    `All ${TOTAL_REAL_TOOLS}+ tools on RoughTools are free forever. No signup, no payment, no watermark. Rate limits apply to protect service availability.`,
  alternates: { canonical: 'https://roughtools.com/pricing' },
}

const FEATURES = [
  { label: `${TOTAL_REAL_TOOLS}+ tools — every single one` },
  { label: 'No account or signup required' },
  { label: 'No watermarks on any output' },
  { label: 'No daily caps or paywalls' },
  { label: 'Works on all devices' },
  { label: 'Your data never leaves your browser' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <main className="max-w-2xl mx-auto px-6 py-20 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Free Forever
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          No plans.<br />No payments.<br />Just free tools.
        </h1>
        <p className="text-lg text-gray-500 dark:text-white/50 mb-12 max-w-lg mx-auto">
          Every tool on RoughTools is 100% free. We are ad-supported so you never need to pay or sign up for anything.
        </p>

        {/* Free card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-8 mb-8 text-left shadow-sm">
          <div className="flex items-end gap-1 mb-2">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">$0</span>
            <span className="text-gray-400 dark:text-white/40 text-base mb-2">/ forever</span>
          </div>
          <p className="text-gray-500 dark:text-white/50 text-sm mb-6">
            No credit card. No trial period. No hidden tiers.
          </p>

          <ul className="space-y-3 mb-8">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-center gap-3 text-sm text-gray-700 dark:text-white/80">
                <svg className="h-4 w-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {f.label}
              </li>
            ))}
          </ul>

          <Link
            href="/tools"
            className="block w-full text-center bg-[#1a6b3c] hover:bg-[#145230] text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Browse all {TOTAL_REAL_TOOLS}+ tools →
          </Link>
        </div>

        {/* Rate limit note */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl p-5 text-left mb-12">
          <h2 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">
            Fair-use rate limits
          </h2>
          <p className="text-sm text-amber-700 dark:text-amber-500/80 leading-relaxed">
            To protect the service from abuse and keep it fast for everyone, automated or high-volume
            requests may be rate-limited. Normal human use is never restricted.
            If you hit a limit, wait a moment and try again.
          </p>
        </div>

        {/* FAQ */}
        <div className="text-left space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Common questions</h2>

          {[
            {
              q: 'How is RoughTools free?',
              a: 'We display unobtrusive ads via Google AdSense. That revenue covers hosting and development costs — so you get free tools and we stay online.',
            },
            {
              q: 'Do I need to create an account?',
              a: 'No. Every tool works instantly in your browser with zero sign-up.',
            },
            {
              q: 'Is my data private?',
              a: 'Yes. All calculations run locally in your browser. No input data is ever sent to our servers.',
            },
            {
              q: 'Will it always be free?',
              a: 'Yes. The ad-supported model lets us keep all tools free forever.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-gray-100 dark:border-white/8 pb-6 last:border-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{q}</h3>
              <p className="text-sm text-gray-500 dark:text-white/50 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}
