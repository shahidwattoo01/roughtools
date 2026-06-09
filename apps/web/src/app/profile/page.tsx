'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  name: string | null
  email: string
  username: string
  avatarUrl: string | null
  role: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 401) { router.push('/auth/signin'); return }
        const data = await res.json()
        setProfile(data.user)
        setName(data.user.name ?? '')
        setUsername(data.user.username ?? '')
      })
      .finally(() => setLoading(false))
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, username }),
      })
      if (res.ok) {
        const data = await res.json()
        setProfile(data.user)
        setMessage({ type: 'success', text: 'Profile updated successfully.' })
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.message ?? 'Update failed.' })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-500 mb-8">Manage your public profile information.</p>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {(profile?.name ?? profile?.username ?? 'U')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{profile?.name ?? profile?.username}</p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
              {profile?.role?.toLowerCase()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile?.email ?? ''}
              readOnly
              className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
          </div>

          {message && (
            <div
              className={`text-sm px-4 py-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
        </p>
      </div>
    </div>
  )
}
