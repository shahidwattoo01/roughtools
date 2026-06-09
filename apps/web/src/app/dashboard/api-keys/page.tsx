'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  lastUsed: string | null
  expiresAt: string | null
  createdAt: string
}

export default function ApiKeysPage() {
  const router = useRouter()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyExpiry, setNewKeyExpiry] = useState('')
  const [rawKey, setRawKey] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function loadKeys() {
    const res = await fetch('/api/api-keys', { credentials: 'include' })
    if (res.status === 401) { router.push('/auth/signin'); return }
    const data = await res.json()
    setKeys(data.keys ?? [])
  }

  useEffect(() => {
    loadKeys().finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setRawKey(null)
    setCreating(true)
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newKeyName,
          ...(newKeyExpiry ? { expiresInDays: parseInt(newKeyExpiry, 10) } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message ?? 'Failed to create key'); return }
      setRawKey(data.key.rawKey)
      setNewKeyName('')
      setNewKeyExpiry('')
      await loadKeys()
    } finally {
      setCreating(false)
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm('Revoke this API key? Apps using it will stop working immediately.')) return
    await fetch(`/api/api-keys/${id}`, { method: 'DELETE', credentials: 'include' })
    setKeys((prev) => prev.filter((k) => k.id !== id))
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
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Keys</h1>
        <p className="text-gray-500 mb-8">
          Use API keys to authenticate requests to the{' '}
          <a href="/api-docs" className="text-blue-600 hover:underline">public API</a>.
        </p>

        {/* One-time raw key display */}
        {rawKey && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-green-800 mb-1">
              ✓ API key created — copy it now, it won&apos;t be shown again.
            </p>
            <code className="block bg-white border border-green-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-900 break-all mb-2">
              {rawKey}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(rawKey)}
              className="text-xs text-green-700 underline"
            >
              Copy to clipboard
            </button>
          </div>
        )}

        {/* Create Form */}
        <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Create New Key</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. My App"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expires In (days, optional)
              </label>
              <input
                type="number"
                value={newKeyExpiry}
                onChange={(e) => setNewKeyExpiry(e.target.value)}
                placeholder="e.g. 90 (leave blank = never)"
                min={1}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {creating ? 'Creating…' : 'Create API Key'}
          </button>
        </form>

        {/* Keys List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {keys.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No API keys yet. Create one above.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Prefix</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Last Used</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Expires</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {keys.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{k.name}</td>
                    <td className="px-4 py-3 font-mono text-gray-500">{k.keyPrefix}…</td>
                    <td className="px-4 py-3 text-gray-500">
                      {k.lastUsed ? new Date(k.lastUsed).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRevoke(k.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Maximum 10 active keys per account.
        </p>
      </div>
    </div>
  )
}
