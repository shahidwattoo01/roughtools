'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Style tokens ──────────────────────────────────────────────────────────────
const CARD: CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
  borderRadius: 16, padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
  color: 'var(--fg)', fontSize: 15, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'left', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = { padding: '8px 12px', fontSize: 13, color: 'var(--fg-2)' }

// ─── Port data ─────────────────────────────────────────────────────────────────
type Category = 'web' | 'database' | 'mail' | 'file' | 'remote' | 'security' | 'other'

interface PortInfo {
  port: number
  protocol: string
  service: string
  description: string
  category: Category
  danger?: string   // security warning if open publicly
}

const CATEGORY_COLORS: Record<Category, string> = {
  web: '#6366f1',
  database: '#22c55e',
  mail: '#f59e0b',
  file: '#a78bfa',
  remote: '#ef4444',
  security: '#38bdf8',
  other: '#64748b',
}

const COMMON_PORTS: PortInfo[] = [
  { port: 21, protocol: 'TCP', service: 'FTP', category: 'file', description: 'File Transfer Protocol (control)', danger: 'Should not be open publicly — use SFTP (22) instead. FTP sends credentials in plaintext.' },
  { port: 22, protocol: 'TCP', service: 'SSH', category: 'remote', description: 'Secure Shell — encrypted remote access', danger: 'Restrict to known IPs. Brute-force attacks target port 22 continuously.' },
  { port: 23, protocol: 'TCP', service: 'Telnet', category: 'remote', description: 'Unencrypted remote access — completely insecure', danger: 'Must never be open publicly. All traffic including passwords is in plaintext.' },
  { port: 25, protocol: 'TCP', service: 'SMTP', category: 'mail', description: 'Simple Mail Transfer Protocol (server-to-server)', danger: 'Open port 25 enables spam relay. Block for end-users; use 587 for submission.' },
  { port: 53, protocol: 'TCP/UDP', service: 'DNS', category: 'other', description: 'Domain Name System resolver', danger: 'Open recursive DNS resolvers can be abused for DDoS amplification.' },
  { port: 80, protocol: 'TCP', service: 'HTTP', category: 'web', description: 'HyperText Transfer Protocol (unencrypted web)' },
  { port: 110, protocol: 'TCP', service: 'POP3', category: 'mail', description: 'Post Office Protocol v3 (email retrieval)' },
  { port: 143, protocol: 'TCP', service: 'IMAP', category: 'mail', description: 'Internet Message Access Protocol' },
  { port: 443, protocol: 'TCP', service: 'HTTPS', category: 'web', description: 'HTTP over TLS/SSL — encrypted web traffic' },
  { port: 465, protocol: 'TCP', service: 'SMTPS', category: 'mail', description: 'SMTP over SSL/TLS (legacy secure email)' },
  { port: 587, protocol: 'TCP', service: 'SMTP Submission', category: 'mail', description: 'Modern authenticated email submission' },
  { port: 993, protocol: 'TCP', service: 'IMAPS', category: 'mail', description: 'IMAP over TLS/SSL' },
  { port: 995, protocol: 'TCP', service: 'POP3S', category: 'mail', description: 'POP3 over TLS/SSL' },
  { port: 3000, protocol: 'TCP', service: 'Dev Server', category: 'web', description: 'Common Node.js / React development server', danger: 'Should never be exposed publicly in production.' },
  { port: 3306, protocol: 'TCP', service: 'MySQL', category: 'database', description: 'MySQL / MariaDB database', danger: 'Database ports should never be publicly accessible. Use private networks or VPN.' },
  { port: 3389, protocol: 'TCP', service: 'RDP', category: 'remote', description: 'Windows Remote Desktop Protocol', danger: 'One of the most attacked ports. Restrict to VPN; never expose publicly.' },
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', category: 'database', description: 'PostgreSQL relational database', danger: 'Keep behind firewall. Use pg_hba.conf to restrict connections.' },
  { port: 5984, protocol: 'TCP', service: 'CouchDB', category: 'database', description: 'Apache CouchDB HTTP API' },
  { port: 6379, protocol: 'TCP', service: 'Redis', category: 'database', description: 'Redis in-memory data store', danger: 'Redis has no auth by default. Public exposure leads to data theft and cryptomining.' },
  { port: 8080, protocol: 'TCP', service: 'HTTP-Alt', category: 'web', description: 'Alternate HTTP / proxy / app servers' },
  { port: 8443, protocol: 'TCP', service: 'HTTPS-Alt', category: 'web', description: 'Alternate HTTPS / admin panels' },
  { port: 9090, protocol: 'TCP', service: 'Prometheus', category: 'other', description: 'Prometheus monitoring metrics server' },
  { port: 9200, protocol: 'TCP', service: 'Elasticsearch', category: 'database', description: 'Elasticsearch REST API', danger: 'Exposed Elasticsearch instances have leaked billions of records. Never expose publicly.' },
  { port: 27017, protocol: 'TCP', service: 'MongoDB', category: 'database', description: 'MongoDB document database', danger: 'Exposed MongoDB instances have been wiped and ransomed en masse. Bind to localhost.' },
  { port: 6443, protocol: 'TCP', service: 'Kubernetes API', category: 'security', description: 'Kubernetes API server — admin control plane' },
  { port: 2375, protocol: 'TCP', service: 'Docker TCP', category: 'security', description: 'Docker daemon TCP socket (unauthenticated)', danger: 'Exposing Docker daemon gives full host access. Use TLS or Unix socket only.' },
  { port: 111, protocol: 'TCP/UDP', service: 'RPC', category: 'other', description: 'Remote Procedure Call portmapper' },
  { port: 139, protocol: 'TCP', service: 'NetBIOS', category: 'remote', description: 'Windows file sharing (legacy)', danger: 'Used in EternalBlue/WannaCry exploits. Block at firewall.' },
  { port: 445, protocol: 'TCP', service: 'SMB', category: 'remote', description: 'Server Message Block / Windows file sharing', danger: 'Target of WannaCry, NotPetya. Should never be accessible from internet.' },
  { port: 1433, protocol: 'TCP', service: 'MSSQL', category: 'database', description: 'Microsoft SQL Server', danger: 'Frequently attacked. Restrict to internal network only.' },
  { port: 11211, protocol: 'TCP/UDP', service: 'Memcached', category: 'database', description: 'Memcached distributed cache', danger: 'Used in largest DDoS amplification attacks (1.7Tbps). Never expose UDP 11211.' },
]

const PRESET_PORTS = [
  { label: 'HTTP', port: 80 },
  { label: 'HTTPS', port: 443 },
  { label: 'SSH', port: 22 },
  { label: 'FTP', port: 21 },
  { label: 'SMTP', port: 25 },
  { label: 'MySQL', port: 3306 },
  { label: 'PostgreSQL', port: 5432 },
  { label: 'Redis', port: 6379 },
  { label: 'MongoDB', port: 27017 },
  { label: 'RDP', port: 3389 },
]

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PortCheckerClient() {
  const [hostname, setHostname] = useState('')
  const [portInput, setPortInput] = useState('')
  const [filter, setFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')

  const selectedPort = useMemo(() => {
    const n = parseInt(portInput)
    return isNaN(n) ? null : COMMON_PORTS.find(p => p.port === n) ?? null
  }, [portInput])

  const filteredPorts = useMemo(() => COMMON_PORTS.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
    if (!filter) return true
    const q = filter.toLowerCase()
    return p.port.toString().includes(q) || p.service.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  }), [categoryFilter, filter])

  // Build terminal commands for the current host+port
  const h = hostname || 'hostname'
  const port = portInput || '80'
  const terminalCmds = [
    { label: 'Linux / macOS (netcat)', cmd: `nc -zv ${h} ${port}` },
    { label: 'Linux / macOS (nmap)', cmd: `nmap -p ${port} ${h}` },
    { label: 'PowerShell (Windows)', cmd: `Test-NetConnection -ComputerName ${h} -Port ${port}` },
    { label: 'curl HEAD request', cmd: `curl -I --connect-timeout 5 https://${h}:${port}` },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* INPUT */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={LABEL}>Hostname or IP Address</label>
            <input style={INPUT_BOX} type="text" placeholder="192.168.1.1 or example.com" value={hostname} onChange={e => setHostname(e.target.value)} aria-label="Hostname" />
          </div>
          <div>
            <label style={LABEL}>Port Number</label>
            <input style={INPUT_BOX} type="number" min={1} max={65535} placeholder="Port" value={portInput} onChange={e => setPortInput(e.target.value)} aria-label="Port" />
          </div>
        </div>

        {/* Preset buttons */}
        <div style={{ marginBottom: 14 }}>
          <label style={LABEL}>Common Port Presets</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PRESET_PORTS.map(({ label, port: p }) => (
              <button
                key={p}
                onClick={() => setPortInput(String(p))}
                style={{
                  ...BTN_GHOST,
                  padding: '5px 12px', fontSize: 12,
                  background: portInput === String(p) ? 'rgba(99,102,241,0.3)' : 'rgba(139,92,246,0.08)',
                  borderColor: portInput === String(p) ? 'rgba(99,102,241,0.6)' : 'rgba(139,92,246,0.2)',
                }}
              >
                {label} ({p})
              </button>
            ))}
          </div>
        </div>

        {/* Browser limitation notice */}
        <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: selectedPort ? 14 : 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', marginBottom: 6 }}>Browser Limitation — Use Terminal Commands</div>
          <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: '0 0 12px', lineHeight: 1.6 }}>
            Raw TCP port scanning requires system-level access that browser sandboxing prevents. Run these from your terminal:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {terminalCmds.map(({ label, cmd }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <code style={{ display: 'block', padding: '7px 12px', borderRadius: 6, background: 'rgba(0,0,0,0.5)', color: '#34d399', fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {cmd}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Selected port info */}
        {selectedPort && (
          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: `${CATEGORY_COLORS[selectedPort.category]}15`,
            border: `1px solid ${CATEGORY_COLORS[selectedPort.category]}40`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: selectedPort.danger ? 8 : 0 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: CATEGORY_COLORS[selectedPort.category] }}>{selectedPort.port}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)' }}>{selectedPort.service}</span>
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>({selectedPort.protocol})</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: selectedPort.danger ? 6 : 0 }}>{selectedPort.description}</div>
            {selectedPort.danger && (
              <div style={{ fontSize: 12, color: '#fbbf24', padding: '6px 10px', borderRadius: 6, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', marginTop: 4 }}>
                Security: {selectedPort.danger}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PORT REFERENCE TABLE */}
      <div style={CARD}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Common Ports Reference ({filteredPorts.length})
          </h3>
          <input
            style={{ ...INPUT_BOX, width: 180 }}
            type="text"
            placeholder="Filter ports…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            aria-label="Filter ports"
          />
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {(['all', 'web', 'database', 'mail', 'file', 'remote', 'security', 'other'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
                background: categoryFilter === cat ? (cat === 'all' ? '#6366f1' : CATEGORY_COLORS[cat]) : 'rgba(255,255,255,0.06)',
                color: categoryFilter === cat ? '#fff' : 'var(--fg-3)',
                textTransform: 'capitalize',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Common ports reference">
            <thead>
              <tr>
                <th style={{ ...TH, width: 70 }}>Port</th>
                <th style={TH}>Proto</th>
                <th style={TH}>Service</th>
                <th style={TH}>Description</th>
                <th style={{ ...TH, width: 60 }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {filteredPorts.map(p => (
                <tr
                  key={p.port}
                  onClick={() => setPortInput(String(p.port))}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: portInput === String(p.port) ? 'rgba(99,102,241,0.08)' : 'transparent' }}
                >
                  <td style={{ ...TD, color: CATEGORY_COLORS[p.category], fontWeight: 700, fontFamily: 'monospace' }}>{p.port}</td>
                  <td style={{ ...TD, color: 'var(--fg-3)', fontSize: 11 }}>{p.protocol}</td>
                  <td style={{ ...TD, fontWeight: 600, color: 'var(--fg)' }}>{p.service}</td>
                  <td style={{ ...TD, color: 'var(--fg-3)' }}>{p.description}</td>
                  <td style={{ ...TD, textAlign: 'center' }}>
                    {p.danger ? (
                      <span title={p.danger} style={{ cursor: 'help', fontSize: 14 }}>⚠️</span>
                    ) : (
                      <span style={{ fontSize: 12, color: '#10b981' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 10 }}>
          Click a row to pre-fill the port above. ⚠️ = Security risk if exposed publicly.
        </p>
      </div>

      {/* SECURITY NOTES */}
      <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Port Security Best Practices
        </h3>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            <strong>Principle of least exposure:</strong> Only open ports that are absolutely required. Each open port is an attack surface.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            <strong>Never expose database ports:</strong> MySQL (3306), PostgreSQL (5432), Redis (6379), MongoDB (27017) should only be accessible from your application servers, not the public internet.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            <strong>SSH hardening:</strong> Disable password authentication, use SSH keys, restrict to specific IP ranges, and consider moving SSH to a non-standard port.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            <strong>Use a firewall:</strong> On Linux, <code style={{ color: 'var(--brand-2)' }}>ufw</code> or <code style={{ color: 'var(--brand-2)' }}>iptables</code>; on cloud providers, use security groups to whitelist only necessary ports.
          </li>
        </ul>
      </div>
    </div>
  )
}
