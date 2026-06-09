'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ToolAdUnit from '@/components/ToolAdUnit'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for individuals exploring the tools.',
    features: [
      '50+ free tools',
      '100 uses/day',
      'Basic PDF processing',
      'Community support',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 12,
    period: 'per month',
    description: 'For power users who need unlimited access.',
    features: [
      'Everything in Free',
      'Unlimited tool uses',
      'Priority processing',
      'API access (1,000 req/mo)',
      'Email support',
      'No ads',
    ],
    cta: 'Start Pro',
    href: '/auth/signup?plan=pro',
    highlight: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: 49,
    period: 'per month',
    description: 'For teams collaborating on projects.',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared API keys',
      'Team analytics',
      'Priority email support',
      'Custom branding',
    ],
    cta: 'Start Team',
    href: '/auth/signup?plan=team',
    highlight: false,
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(planId: string, href?: string) {
    if (href) { router.push(href); return }
    setLoading(planId)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan: planId }),
      })
      if (res.status === 401) { router.push('/auth/signin'); return }
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Simple, transparent pricing</h1>
          <p className="text-lg text-gray-500">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        <ToolAdUnit position="top" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border p-8 flex flex-col ${
                plan.highlight
                  ? 'border-blue-500 shadow-lg shadow-blue-100'
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-400 text-sm mb-1">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id, plan.href)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {loading === plan.id ? 'Redirecting…' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            All plans include a 14-day free trial. No credit card required for Free tier.{' '}
            <a href="/contact" className="text-blue-600 hover:underline">
              Contact us
            </a>{' '}
            for enterprise pricing.
          </p>
        </div>
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
