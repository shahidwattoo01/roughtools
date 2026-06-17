'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.message ?? 'Login failed')
        return
      }
      // Cookie is set HttpOnly by the server — just redirect
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(next as any)
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-[#111] mb-1">RoughTools</div>
          <div className="text-[13px] text-gray-400">Admin Panel</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-[12px] font-medium text-gray-600 mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoFocus
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#111] placeholder-gray-400
                         focus:outline-none focus:border-[#1a6b3c] transition-colors"
              placeholder="admin@roughtools.com"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-gray-600 mb-1.5">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#111]
                         focus:outline-none focus:border-[#1a6b3c] transition-colors"
            />
          </div>

          {error && (
            <div className="text-[12px] text-[#f87171] bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#1a6b3c] hover:bg-[#145230] disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-[11px] text-[#555] mt-4">
          Sessions expire after 4 hours of inactivity
        </p>
      </div>
    </div>
  )
}
