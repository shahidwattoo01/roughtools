'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function BillingSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!sessionId) { setStatus('error'); return }
    // Give webhook a moment to process
    const t = setTimeout(() => setStatus('success'), 2000)
    return () => clearTimeout(t)
  }, [sessionId])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-500">Confirming your subscription…</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6">We couldn&apos;t confirm your payment. Please contact support.</p>
        <Link href="/contact" className="text-blue-600 hover:underline text-sm">
          Contact Support
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re all set!</h1>
        <p className="text-gray-500 mb-6">
          Your subscription has been activated. Welcome to the next level.
        </p>
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/tools"
            className="block w-full bg-gray-100 text-gray-800 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Explore Tools
          </Link>
        </div>
      </div>
    </div>
  )
}
