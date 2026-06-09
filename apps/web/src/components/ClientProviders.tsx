'use client'

import { ReactNode, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { ThemeProvider } from '@/components/ThemeProvider'
import { CommandPaletteProvider } from '@/components/CommandPalette'
import Providers from '@/components/Providers'

// Lazy-load non-critical features to prevent blocking initial render
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false })
const ChatbotLoader = dynamic(() => import('@/components/ChatbotLoader'), { ssr: false })
const Toaster = dynamic(() => import('@/components/Toaster'), { ssr: false })
const ScrollReveal = dynamic(() => import('@/components/ScrollReveal'), { ssr: false })

// Optional: analytics can load later too
const Analytics = dynamic(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics })), { ssr: false })
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(m => ({ default: m.SpeedInsights })), { ssr: false })

interface ClientProvidersProps {
  children: ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <Providers>
      <ThemeProvider>
        <CommandPaletteProvider>
          {children}
          
          {/* Non-critical features - load after main content */}
          <Suspense fallback={null}>
            <ChatbotLoader />
            <ScrollReveal />
            <CookieConsent />
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </Suspense>
        </CommandPaletteProvider>
      </ThemeProvider>
    </Providers>
  )
}
