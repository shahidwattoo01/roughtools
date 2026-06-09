'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') ?? 'free'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address'
    if (!password) errs.password = 'Password is required'
    else if (!strongPassword.test(password))
      errs.password = 'Must be 8+ characters with uppercase, lowercase and number'
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        // Auto sign-in after registration
        const result = await signIn('credentials', { email, password, redirect: false })
        if (result?.ok) {
          router.push(plan !== 'free' ? `/pricing?plan=${plan}` : '/')
        } else {
          router.push('/auth/signin?registered=1')
        }
      } else {
        const data = await res.json()
        setErrors({ general: data.message ?? 'Registration failed. Please try again.' })
      }
    } catch {
      setErrors({ general: 'Network error. Please check your connection.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-indigo-600 hover:text-indigo-700">
            RoughTools
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                id="name" type="text" autoComplete="name" required
                value={name} onChange={e => setName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Jane Smith"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email" type="email" autoComplete="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password" type="password" autoComplete="new-password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Min 8 chars, uppercase + number"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input
                id="confirmPassword" type="password" autoComplete="new-password" required
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition text-sm"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing up you agree to our{' '}
          <Link href="/terms-of-service" className="hover:underline">Terms</Link> and{' '}
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  )
}
