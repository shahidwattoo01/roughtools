'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'

export default function SignOutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/' })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 text-sm">Signing out…</p>
    </div>
  )
}
