'use client'

import { useState } from 'react'

interface FAQ { q: string; a: string }

export default function MedicalFAQClient({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null)

  if (!faqs.length) return null

  return (
    <section className="mt-8" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-2xl">❓</span> Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl bg-white overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={open === i}
            >
              <span className="text-sm font-semibold text-gray-800 pr-4">{faq.q}</span>
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center transition-transform duration-200 ${
                  open === i ? 'rotate-180' : ''
                }`}
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 pt-0">
                <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
