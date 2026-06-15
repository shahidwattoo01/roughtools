'use client'

/**
 * Providers — client-side context wrapper.
 * Wrap any client provider here so the server RootLayout stays a Server Component.
 */

import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'

interface ProvidersProps {
  children: React.ReactNode
  session?: Session | null
}

export default function Providers({ children, session }: ProvidersProps) {
  // ⚡ PERF: refetchOnWindowFocus=true was causing a /api/auth/session
  // network request every time the tab regained focus — perceptible
  // latency on every page switch. Raised interval to 30 min + disabled.
  return (
    <SessionProvider session={session} refetchInterval={30 * 60} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  )
}
