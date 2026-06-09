'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const user = session?.user ?? null

  async function login(provider: string, callbackUrl = '/') {
    await signIn(provider, { callbackUrl })
  }

  async function logout() {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  function hasRole(role: string): boolean {
    return (session?.user as Record<string, unknown> | null | undefined)?.role === role
  }

  return { isLoading, isAuthenticated, user, login, logout, hasRole }
}
