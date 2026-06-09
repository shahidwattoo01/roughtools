'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [pwSaving, setPwSaving] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPwMessage(null)
    if (newPassword !== confirmPassword) {
      setPwMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }
    if (newPassword.length < 8) {
      setPwMessage({ type: 'error', text: 'Password must be at least 8 characters.' })
      return
    }
    setPwSaving(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setPwMessage({ type: 'success', text: 'Password changed successfully.' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPwMessage({ type: 'error', text: data.message ?? 'Failed to change password.' })
      }
    } finally {
      setPwSaving(false)
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE MY ACCOUNT') {
      setDeleteError('Please type "DELETE MY ACCOUNT" exactly to confirm.')
      return
    }
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await fetch('/api/gdpr/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ confirm: 'DELETE MY ACCOUNT' }),
      })
      if (res.ok) {
        router.push('/?deleted=1')
      } else {
        const data = await res.json()
        setDeleteError(data.message ?? 'Failed to delete account.')
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500 mb-8">Manage your account security and preferences.</p>

        {/* Change Password */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {pwMessage && (
              <div
                className={`text-sm px-4 py-3 rounded-lg ${
                  pwMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {pwMessage.text}
              </div>
            )}
            <button
              type="submit"
              disabled={pwSaving}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {pwSaving ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </section>

        {/* Data Export */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Export Your Data</h2>
          <p className="text-sm text-gray-500 mb-4">
            Download a copy of all data we hold about your account (GDPR Article 20).
          </p>
          <a
            href="/api/gdpr/export"
            className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Download Data Export
          </a>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <input
            type="text"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder='Type "DELETE MY ACCOUNT" to confirm'
            className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-3"
          />
          {deleteError && (
            <p className="text-sm text-red-600 mb-3">{deleteError}</p>
          )}
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Deleting…' : 'Delete Account Permanently'}
          </button>
        </section>
      </div>
    </div>
  )
}
