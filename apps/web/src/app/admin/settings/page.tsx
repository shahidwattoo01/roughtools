'use client'

import { useState } from 'react'

type Tab = 'general' | 'api-keys' | 'notifications' | 'features'

interface FeatureFlag { key: string; label: string; description: string; enabled: boolean }

const INITIAL_FLAGS: FeatureFlag[] = [
  { key: 'iq_test_enabled',      label: 'IQ Test',           description: 'Show IQ Test in category grid and allow sessions', enabled: true },
  { key: 'iq_test_premium_gate', label: 'IQ Premium Gate',   description: 'Gate domain radar and PDF behind Stripe payment',   enabled: false },
  { key: 'maintenance_mode',     label: 'Maintenance Mode',  description: 'Show maintenance banner across all tool pages',     enabled: false },
  { key: 'new_tool_beta',        label: 'Beta Badge',        description: 'Show BETA badge on isNew tools',                    enabled: true },
  { key: 'dark_mode_default',    label: 'Dark Mode Default', description: 'Default new visitors to dark theme',                enabled: false },
]

const API_KEYS = [
  { label: 'GA4 Measurement ID',           key: 'GA4_MEASUREMENT_ID',    hint: 'G-XXXXXXXXXX' },
  { label: 'Google Service Account JSON',  key: 'GOOGLE_SERVICE_ACCOUNT',hint: '{ ... }' },
  { label: 'AdSense Publisher ID',         key: 'ADSENSE_PUBLISHER_ID',  hint: 'pub-XXXXXXXX' },
  { label: 'Sentry DSN',                   key: 'SENTRY_DSN',            hint: 'https://...@sentry.io/...' },
  { label: 'Stripe Publishable Key',       key: 'NEXT_PUBLIC_STRIPE_KEY', hint: 'pk_live_...' },
  { label: 'Stripe Secret Key',            key: 'STRIPE_SECRET_KEY',     hint: 'sk_live_... (masked)' },
  { label: 'Anthropic API Key',            key: 'ANTHROPIC_API_KEY',     hint: 'sk-ant-...' },
  { label: 'DigitalOcean API Token',       key: 'DO_API_TOKEN',          hint: 'dop_v1_...' },
]

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<Tab>('general')
  const [flags, setFlags] = useState<FeatureFlag[]>(INITIAL_FLAGS)
  const [notifEmail, setNotifEmail] = useState('')
  const [saved, setSaved] = useState('')

  const save = (msg: string) => {
    setSaved(msg)
    setTimeout(() => setSaved(''), 3000)
  }

  return (
    <div className="p-6 space-y-6 max-w-[900px]">
      <h1 className="text-xl font-semibold">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] border border-white/8 rounded-xl p-1 w-fit">
        {([['general','General'], ['api-keys','API Keys'], ['notifications','Notifications'], ['features','Feature Flags']] as [Tab,string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-[12px] transition-colors ${tab === id ? 'bg-[#1a6b3c] text-white' : 'text-[#555] hover:text-[#aaa]'}`}>
            {label}
          </button>
        ))}
      </div>

      {saved && <div className="text-[12px] text-[#6fcf97] bg-[#1a6b3c]/10 border border-[#1a6b3c]/20 rounded-lg px-4 py-2">✓ {saved}</div>}

      {/* General */}
      {tab === 'general' && (
        <div className="space-y-4">
          {[
            { label: 'Site Name',    placeholder: 'RoughTools' },
            { label: 'Site URL',     placeholder: 'https://roughtools.com' },
            { label: 'Support Email',placeholder: 'support@roughtools.com' },
            { label: 'Timezone',     placeholder: 'UTC' },
          ].map(({ label, placeholder }) => (
            <div key={label}>
              <label className="block text-[12px] text-[#888] mb-1.5">{label}</label>
              <input defaultValue={placeholder} placeholder={placeholder}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#1a6b3c]" />
            </div>
          ))}
          <button onClick={() => save('General settings saved')}
            className="bg-[#1a6b3c] hover:bg-[#145230] text-white rounded-lg px-5 py-2.5 text-[13px] transition-colors">
            Save Changes
          </button>
        </div>
      )}

      {/* API Keys */}
      {tab === 'api-keys' && (
        <div className="space-y-4">
          <p className="text-[12px] text-[#888]">
            Add these as environment variables in your deployment. Values shown here are read from <code className="font-mono text-[#aaa]">process.env</code> — update your <code className="font-mono text-[#aaa]">.env</code> or platform secrets.
          </p>
          <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
            {API_KEYS.map((k, i) => (
              <div key={k.key} className={`flex items-center justify-between px-4 py-3.5 ${i < API_KEYS.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div>
                  <div className="text-[13px] font-medium">{k.label}</div>
                  <code className="text-[10px] text-[#555]">{k.key}</code>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#555] font-mono">{k.hint}</span>
                  <div className={`w-2 h-2 rounded-full ${process.env[k.key] ? 'bg-[#6fcf97]' : 'bg-[#555]'}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-xl px-4 py-3 text-[12px] text-[#fbbf24]">
            ⚠ Never commit API keys to version control. Use environment variables or a secrets manager.
          </div>
        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] text-[#888] mb-1.5">Admin Alert Email</label>
            <input value={notifEmail} onChange={e => setNotifEmail(e.target.value)}
              placeholder="admin@roughtools.com" type="email"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#1a6b3c]" />
          </div>
          <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
            {[
              { label: 'Server Down Alert',        key: 'notif_server_down' },
              { label: 'High Error Rate (>5%)',    key: 'notif_error_rate' },
              { label: 'AdSense Revenue Drop >20%',key: 'notif_revenue_drop' },
              { label: 'Traffic Anomaly',          key: 'notif_traffic' },
              { label: 'Failed BullMQ Jobs',       key: 'notif_queue_fail' },
              { label: 'DB Connection Issues',     key: 'notif_db' },
            ].map((n, i, arr) => (
              <label key={n.key} className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/2 ${i < arr.length - 1 ? 'border-b border-white/5' : ''}`}>
                <span className="text-[13px]">{n.label}</span>
                <input type="checkbox" defaultChecked className="accent-[#1a6b3c]" />
              </label>
            ))}
          </div>
          <button onClick={() => save('Notification settings saved')}
            className="bg-[#1a6b3c] hover:bg-[#145230] text-white rounded-lg px-5 py-2.5 text-[13px] transition-colors">
            Save Notifications
          </button>
        </div>
      )}

      {/* Feature flags */}
      {tab === 'features' && (
        <div className="space-y-3">
          <p className="text-[12px] text-[#888]">Toggle features live without a code deployment.</p>
          {flags.map(flag => (
            <div key={flag.key} className="bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3.5 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium">{flag.label}</div>
                <div className="text-[11px] text-[#555] mt-0.5">{flag.description}</div>
                <code className="text-[10px] text-[#444]">{flag.key}</code>
              </div>
              <button
                onClick={() => {
                  setFlags(prev => prev.map(f => f.key === flag.key ? { ...f, enabled: !f.enabled } : f))
                  save(`${flag.label} ${!flag.enabled ? 'enabled' : 'disabled'}`)
                }}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${flag.enabled ? 'bg-[#1a6b3c]' : 'bg-[#333]'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${flag.enabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
