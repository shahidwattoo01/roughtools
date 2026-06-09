'use client'

import { useState, useCallback, useRef } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  faqs: FAQItem[]
  title?: string
}

export default function FAQAccordion({ faqs, title = 'Frequently Asked Questions' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  const toggle = useCallback((i: number) => {
    setOpenIndex(prev => (prev === i ? null : i))
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      btnRefs.current[Math.min(i + 1, faqs.length - 1)]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      btnRefs.current[Math.max(i - 1, 0)]?.focus()
    }
  }, [faqs.length])

  return (
    <section className="mt-12" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          const panelId = `faq-panel-${i}`
          const btnId = `faq-btn-${i}`
          return (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                id={btnId}
                ref={el => { btnRefs.current[i] = el }}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                onKeyDown={e => handleKeyDown(e, i)}
                className="w-full flex items-center justify-between px-4 py-4 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500"
              >
                <span className="pr-4 text-sm leading-snug">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                className={`transition-all duration-200 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
              >
                <div className="px-4 pb-4 pt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700">
                  {faq.answer}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
