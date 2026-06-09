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
  return (
    <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  )
}
