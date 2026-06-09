'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const passwordStrongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

  function validate() {
    const errs: Record<string, string> = {}
    if (!name) errs.name = 'Name is required'
    if (!email) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email'
    if (!password) errs.password = 'Password is required'
    else if (!passwordStrongRegex.test(password))
      errs.password = 'Password must be at least 8 characters with uppercase, lowercase, number and symbol'
    if (!confirmPassword) errs.confirmPassword = 'Confirm password is required'
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
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
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (res.ok) {
        router.push('/auth/signin')
      } else {
        const data = await res.json()
        setErrors({ general: data.message ?? 'Registration failed' })
      }
    } catch {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <span>{errors.name}</span>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        </div>
        <div>
          <input
            id="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            aria-label="terms"
          />
          <label htmlFor="terms">I accept the terms and conditions</label>
        </div>
        {errors.general && <div>{errors.general}</div>}
        <button type="submit" disabled={loading}>
          Create Account
        </button>
      </form>
    </main>
  )
}

export default SignUpPage
