'use client'

import { useState, useEffect } from 'react'

type Tab = 'general' | 'social' | 'api-keys' | 'notifications' | 'features'

interface FeatureFlag { key: string; label: string; description: string; enabled: boolean }

const INITIAL_FLAGS: FeatureFlag[] = [
  { key: 'iq_test_enabled',      label: 'IQ Test',           description: 'Show IQ Test in category grid and allow sessions', enabled: true },
  { key: 'iq_test_premium_gate', label: 'IQ Premium Gate',   description: 'Gate IQ domain radar and PDF report (disabled — all features are free)', enabled: false },
  { key: 'maintenance_mode',     label: 'Maintenance Mode',  description: 'Show maintenance banner across all tool pages', enabled: false },
  { key: 'new_tool_beta',        label: 'Beta Badge',        description: 'Show BETA badge on isNew tools', enabled: true },
  { key: 'dark_mode_default',    label: 'Dark Mode Default', description: 'Default new visitors to dark theme', enabled: false },
]

const API_KEYS = [
  { label: 'GA4 Measurement ID',          key: 'GA4_MEASUREMENT_ID',    hint: 'G-XXXXXXXXXX' },
  { label: 'Google Service Account JSON', key: 'GOOGLE_SERVICE_ACCOUNT', hint: '{ ... }' },
  { label: 'AdSense Publisher ID',        key: 'ADSENSE_PUBLISHER_ID',  hint: 'pub-XXXXXXXX' },
  { label: 'Sentry DSN',                  key: 'SENTRY_DSN',            hint: 'https://...@sentry.io/...' },
  { label: 'Anthropic API Key',           key: 'ANTHROPIC_API_KEY',     hint: 'sk-ant-...' },
  { label: 'DigitalOcean API Token',      key: 'DO_API_TOKEN',          hint: 'dop_v1_...' },
]

const SOCIAL_FIELDS = [
  {
    key: 'twitter',
    label: 'X / Twitter',
    placeholder: 'https://x.com/yourhandle',
    hint: 'x.com',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'github',
    label: 'GitHub',
    placeholder: 'https://github.com/yourusername',
    hint: 'github.com',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/yourprofile',
    hint: 'linkedin.com',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<Tab>('general')
  const [flags, setFlags] = useState<FeatureFlag[]>(INITIAL_FLAGS)
  const [notifEmail, setNotifEmail] = useState('')
  const [saved, setSaved] = useState('')
  const [socialLinks, setSocialLinks] = useState({ twitter: '', github: '', linkedin: '' })
  const [socialLoading, setSocialLoading] = useState(false)

  useEffect(() => {
    if (tab !== 'social') return
    fetch('/api/admin/site-config')
      .then(r => r.json())
      .then(d => { if (d.social) setSocialLinks(d.social) })
      .catch(() => {})
  }, [tab])

  const flash = (msg: string) => { setSaved(msg); setTimeout(() => setSaved(''), 3000) }

  async function saveSocialLinks() {
    setSocialLoading(true)
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ social: socialLinks }),
      })
      flash(res.ok ? 'Social links saved — footer updates within 60 s' : 'Save failed.')
    } catch {
      flash('Network error.')
    } finally {
      setSocialLoading(false)
    }
  }

  const TABS: [Tab, string][] = [
    ['general',       'General'],
    ['social',        'Social Links'],
    ['api-keys',      'API Keys'],
    ['notifications', 'Notifications'],
    ['features',      'Feature Flags'],
  ]

  return (
    <div className="p-6 space-y-6 max-w-[900px]">
      <h1 className="text-xl font-semibold">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] border border-white/8 rounded-xl p-1 w-fit flex-wrap">
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-[12px] transition-colors ${tab === id ? 'bg-[#1a6b3c] text-white' : 'text-[#555] hover:text-[#aaa]'}`}>
            {label}
          </button>
        ))}
      </div>

      {saved && (
        <div className="text-[12px] text-[#6fcf97] bg-[#1a6b3c]/10 border border-[#1a6b3c]/20 rounded-lg px-4 py-2">
          ✓ {saved}
        </div>
      )}

      {/* ── General ── */}
      {tab === 'general' && (
        <div className="space-y-4">
          {[
            { label: 'Site Name',     placeholder: 'RoughTools' },
            { label: 'Site URL',      placeholder: 'https://roughtools.com' },
            { label: 'Support Email', placeholder: 'support@roughtools.com' },
            { label: 'Timezone',      placeholder: 'UTC' },
          ].map(({ label, placeholder }) => (
            <div key={label}>
              <label className="block text-[12px] text-[#888] mb-1.5">{label}</label>
              <input defaultValue={placeholder} placeholder={placeholder}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#1a6b3c]" />
            </div>
          ))}
          <button onClick={() => flash('General settings saved')}
            className="bg-[#1a6b3c] hover:bg-[#145230] text-white rounded-lg px-5 py-2.5 text-[13px] transition-colors">
            Save Changes
          </button>
        </div>
      )}

      {/* ── Social Links ── */}
      {tab === 'social' && (
        <div className="space-y-5">
          <p className="text-[12px] text-[#888]">
            Paste your profile URLs. Icons appear in the site footer — grayed out when blank.
          </p>

          {SOCIAL_FIELDS.map(({ key, label, placeholder, hint, icon }) => (
            <div key={key}>
              <label className="flex items-center gap-2 text-[12px] text-[#888] mb-1.5">
                <span className="text-[#aaa]">{icon}</span>
                {label}
                <span className="text-[#444] ml-auto font-mono">{hint}</span>
              </label>
              <input
                type="url"
                value={socialLinks[key as keyof typeof socialLinks]}
                onChange={e => setSocialLinks(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-white placeholder-[#444] focus:outline-none focus:border-[#1a6b3c] transition-colors"
              />
            </div>
          ))}

          {/* Live preview */}
          <div className="bg-[#111] border border-white/8 rounded-xl px-4 py-3">
            <p className="text-[11px] text-[#555] mb-2 uppercase tracking-wider">Footer preview</p>
            <div className="flex gap-2">
              {SOCIAL_FIELDS.map(({ key, label, icon }) => {
                const href = socialLinks[key as keyof typeof socialLinks]
                return (
                  <span key={key} title={href || `${label} — not set`}
                    className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center transition-colors"
                    style={{
                      background: href ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                      border: '0.5px solid rgba(255,255,255,0.1)',
                      color: href ? '#aaa' : '#2a2a2a',
                    }}>
                    {icon}
                  </span>
                )
              })}
            </div>
          </div>

          <button onClick={saveSocialLinks} disabled={socialLoading}
            className="bg-[#1a6b3c] hover:bg-[#145230] disabled:opacity-60 text-white rounded-lg px-5 py-2.5 text-[13px] transition-colors flex items-center gap-2">
            {socialLoading && (
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {socialLoading ? 'Saving…' : 'Save Social Links'}
          </button>
        </div>
      )}

      {/* ── API Keys ── */}
      {tab === 'api-keys' && (
        <div className="space-y-4">
          <p className="text-[12px] text-[#888]">
            Add these as environment variables in your deployment. Values shown here are read from{' '}
            <code className="font-mono text-[#aaa]">process.env</code>.
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

      {/* ── Notifications ── */}
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
              { label: 'Server Down Alert',         key: 'notif_server_down' },
              { label: 'High Error Rate (>5%)',     key: 'notif_error_rate' },
              { label: 'AdSense Revenue Drop >20%', key: 'notif_revenue_drop' },
              { label: 'Traffic Anomaly',           key: 'notif_traffic' },
              { label: 'Failed BullMQ Jobs',        key: 'notif_queue_fail' },
              { label: 'DB Connection Issues',      key: 'notif_db' },
            ].map((n, i, arr) => (
              <label key={n.key} className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/2 ${i < arr.length - 1 ? 'border-b border-white/5' : ''}`}>
                <span className="text-[13px]">{n.label}</span>
                <input type="checkbox" defaultChecked className="accent-[#1a6b3c]" />
              </label>
            ))}
          </div>
          <button onClick={() => flash('Notification settings saved')}
            className="bg-[#1a6b3c] hover:bg-[#145230] text-white rounded-lg px-5 py-2.5 text-[13px] transition-colors">
            Save Notifications
          </button>
        </div>
      )}

      {/* ── Feature Flags ── */}
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
                  flash(`${flag.label} ${!flag.enabled ? 'enabled' : 'disabled'}`)
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
