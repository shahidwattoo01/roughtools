'use client'

import React, { useEffect, useState } from 'react'

interface ReferralInfo {
  code: string
  link: string
}

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  totalEarnedCents: number
  rewardPerReferralCents: number
}

export default function ReferralPage() {
  const [info, setInfo] = useState<ReferralInfo | null>(null)
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const [linkRes, statsRes] = await Promise.all([
        fetch('/api/referral/link', { credentials: 'include' }),
        fetch('/api/referral/stats', { credentials: 'include' }),
      ])
      if (linkRes.ok) setInfo(await linkRes.json())
      if (statsRes.ok) setStats(await statsRes.json())
    }
    load()
  }, [])

  async function copy() {
    if (!info?.link) return
    await navigator.clipboard.writeText(info.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refer & Earn</h1>
        <p className="text-gray-500 mb-8">
          Earn <strong>${((stats?.rewardPerReferralCents ?? 500) / 100).toFixed(0)}</strong> credit for every friend who
          upgrades to a paid plan.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Referrals', value: stats?.totalReferrals ?? 0 },
            { label: 'Converted', value: stats?.successfulReferrals ?? 0 },
            { label: 'Earned', value: `$${((stats?.totalEarnedCents ?? 0) / 100).toFixed(2)}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Referral Link */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Your Referral Link</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={info?.link ?? 'Loading...'}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none"
            />
            <button
              onClick={copy}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          {info?.code && (
            <p className="text-xs text-gray-400 mt-2">Code: <code className="font-mono">{info.code}</code></p>
          )}
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
          <strong>How it works:</strong> Share your link. When a friend signs up and upgrades, you both get credit automatically.
        </div>
      </div>
    </div>
  )
}
