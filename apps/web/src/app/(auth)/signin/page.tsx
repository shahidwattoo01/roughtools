'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const errs: typeof errors = {}
    if (!email) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email'
    if (!password) errs.password = 'Password is required'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.ok) {
      router.push('/')
    } else {
      setErrors({ general: result?.error ?? 'Invalid credentials' })
    }
  }

  async function handleOAuth(provider: string) {
    await signIn(provider, { callbackUrl: '/' })
  }

  return (
    <main>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span>{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span>{errors.password}</span>}
        </div>
        {errors.general && <div>{errors.general}</div>}
        <button type="submit" disabled={loading}>
          Sign In
        </button>
      </form>
      <button type="button" onClick={() => handleOAuth('google')}>
        Sign In with Google
      </button>
    </main>
  )
}

export default SignInPage
