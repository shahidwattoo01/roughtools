'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  sessionId: string
  sessionToken: string | null
  initialReady: boolean
  initialUrl: string | null
}

export function ReportDownloadButton({ sessionId, sessionToken, initialReady, initialUrl }: Props) {
  const [ready, setReady] = useState(initialReady)
  const [url, setUrl] = useState(initialUrl)
  const [polling, setPolling] = useState(!initialReady)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (ready || !sessionToken) return

    const poll = async () => {
      const res = await fetch(`/api/iq/session/${sessionId}/report`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      })
      if (!res.ok) return

      const data = await res.json() as { status: string; url?: string }
      if (data.status === 'ready' && data.url) {
        setReady(true)
        setUrl(data.url)
        setPolling(false)
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }

    poll()
    intervalRef.current = setInterval(poll, 3000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [sessionId, sessionToken, ready])

  if (!sessionToken) {
    return (
      <span className="text-[12px] text-[#555] dark:text-[#aaa]">Premium only</span>
    )
  }

  if (ready && url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="bg-[#a21caf] hover:bg-[#86198f] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex-shrink-0">
        Download PDF
      </a>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {polling && <div className="w-4 h-4 border-2 border-[#a21caf] border-t-transparent rounded-full animate-spin" />}
      <span className="text-[12px] text-[#555] dark:text-[#aaa]">
        {polling ? 'Generating report…' : 'Not ready'}
      </span>
    </div>
  )
}
