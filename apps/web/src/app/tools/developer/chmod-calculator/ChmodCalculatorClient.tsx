'use client'
import { useState } from 'react'

type Perms = { r: boolean; w: boolean; x: boolean }
type Role = 'owner' | 'group' | 'others'

const PRESETS = [
  { label: '755', desc: 'Directories / executables', v: { owner: { r: true, w: true, x: true }, group: { r: true, w: false, x: true }, others: { r: true, w: false, x: true } } },
  { label: '644', desc: 'HTML / CSS / PHP files', v: { owner: { r: true, w: true, x: false }, group: { r: true, w: false, x: false }, others: { r: true, w: false, x: false } } },
  { label: '600', desc: 'Config / secret files', v: { owner: { r: true, w: true, x: false }, group: { r: false, w: false, x: false }, others: { r: false, w: false, x: false } } },
  { label: '777', desc: 'Full access (avoid!)', v: { owner: { r: true, w: true, x: true }, group: { r: true, w: true, x: true }, others: { r: true, w: true, x: true } } },
]

function permsToOctal(p: Perms): number {
  return (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0)
}

function permsToSymbolic(p: Perms): string {
  return (p.r ? 'r' : '-') + (p.w ? 'w' : '-') + (p.x ? 'x' : '-')
}

export default function ChmodCalculatorClient() {
  const [perms, setPerms] = useState<Record<Role, Perms>>({
    owner: { r: true, w: true, x: true },
    group: { r: true, w: false, x: true },
    others: { r: true, w: false, x: true },
  })
  const [copied, setCopied] = useState<string | null>(null)

  function toggle(role: Role, bit: keyof Perms) {
    setPerms(prev => ({ ...prev, [role]: { ...prev[role], [bit]: !prev[role][bit] } }))
  }

  function applyPreset(v: Record<Role, Perms>) {
    setPerms(v)
  }

  const numeric = `${permsToOctal(perms.owner)}${permsToOctal(perms.group)}${permsToOctal(perms.others)}`
  const symbolic = permsToSymbolic(perms.owner) + permsToSymbolic(perms.group) + permsToSymbolic(perms.others)
  const command = `chmod ${numeric} filename`

  function copy(label: string, val: string) {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  const roles: Role[] = ['owner', 'group', 'others']
  const bits: (keyof Perms)[] = ['r', 'w', 'x']

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Presets */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600, marginBottom: 8 }}>Common Presets</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p.v as Record<Role, Perms>)}
              style={{ padding: '6px 14px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', border: '1px solid rgba(167,139,250,0.25)', background: numeric === p.label ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', color: numeric === p.label ? '#a78bfa' : '#ccc' }}>
              {p.label} <span style={{ fontSize: 11, fontWeight: 400, color: '#666', marginLeft: 4 }}>{p.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Permission grid */}
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#666', fontWeight: 600 }}></th>
              {['Read (4)', 'Write (2)', 'Execute (1)', 'Octal'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, color: '#a78bfa', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role, ri) => (
              <tr key={role} style={{ background: ri % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                <td style={{ padding: '12px', fontWeight: 700, color: '#e0e0ff', fontSize: 14, textTransform: 'capitalize' }}>{role}</td>
                {bits.map(bit => (
                  <td key={bit} style={{ padding: '12px', textAlign: 'center' }}>
                    <label style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                      <input
                        type="checkbox"
                        checked={perms[role][bit]}
                        onChange={() => toggle(role, bit)}
                        style={{ width: 18, height: 18, accentColor: '#a78bfa', cursor: 'pointer' }}
                      />
                    </label>
                  </td>
                ))}
                <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'monospace', fontSize: 20, fontWeight: 800, color: '#a78bfa' }}>
                  {permsToOctal(perms[role])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {[
          { label: 'Numeric', value: numeric },
          { label: 'Symbolic', value: symbolic },
          { label: 'Command', value: command },
        ].map(({ label, value }) => (
          <div key={label} style={{ padding: '14px 16px', background: '#252540', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#a78bfa', fontWeight: 700 }}>{label}</span>
              <button
                onClick={() => copy(label, value)}
                style={{ padding: '3px 10px', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', background: copied === label ? 'rgba(74,222,128,0.15)' : 'rgba(167,139,250,0.15)', color: copied === label ? '#4ade80' : '#a78bfa' }}
              >
                {copied === label ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: label === 'Numeric' ? 28 : 16, fontWeight: label === 'Numeric' ? 900 : 600, color: '#e0e0ff', letterSpacing: label === 'Symbolic' ? 2 : 0 }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
