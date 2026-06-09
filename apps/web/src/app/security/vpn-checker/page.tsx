'use client';

import { useState, useEffect } from 'react';
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

interface IPInfo {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  isp: string;
  org: string;
  asn: string;
  timezone: string;
  isVpn: boolean;
  isProxy: boolean;
  isTor: boolean;
  isHosting: boolean;
  lat: number;
  lon: number;
}

export default function VPNCheckerPage() {
  const [result, setResult] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customIP, setCustomIP] = useState('');
  const [lookingUp, setLookingUp] = useState(false);

  const fetchIP = async (ip?: string) => {
    const isCustom = !!ip;
    if (isCustom) setLookingUp(true);
    else setLoading(true);
    setError('');

    try {
      const url = ip ? `/api/ip-checker?ip=${encodeURIComponent(ip)}` : '/api/ip-checker';
      const res = await fetch(url);
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'Failed to fetch IP info');
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to look up IP');
    } finally {
      setLoading(false);
      setLookingUp(false);
    }
  };

  useEffect(() => { fetchIP(); }, []);

  const flagEmoji = (code: string) => {
    if (!code || code.length !== 2) return 'ðŸŒ';
    const upper = code.toUpperCase();
    const cp1 = 0x1F1E6 + upper.charCodeAt(0) - 65;
    const cp2 = 0x1F1E6 + upper.charCodeAt(1) - 65;
    return String.fromCodePoint(cp1, cp2);
  };

  const riskBadge = (label: string, active: boolean) => (
    <span key={label} className={`px-2 py-1 rounded text-xs font-medium ${
      active
        ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
        : 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
    }`}>
      {active ? `âš  ${label}` : `âœ" No ${label}`}
    </span>
  );

  return (
    <div className="tool-page">
      <div className="max-w-xl mx-auto">
        <ToolAdUnit position="top" />
        <h1 className="text-2xl font-semibold mb-1">IP & VPN Checker</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          See your public IP address, location, ISP, and whether you&apos;re using a VPN or proxy.
        </p>

        {/* Manual lookup */}
        <div className="card mb-6">
          <label className="block text-sm font-medium mb-2">
            Look up any IP address <span className="text-gray-400 font-normal">(or leave blank for yours)</span>
          </label>
          <div className="flex gap-2">
            <input
              value={customIP}
              onChange={e => setCustomIP(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchIP(customIP || undefined)}
              placeholder="8.8.8.8"
              className="flex-1 font-mono"
            />
            <button
              onClick={() => fetchIP(customIP || undefined)}
              disabled={lookingUp}
              className="btn-primary px-4"
            >
              {lookingUp ? 'â€¦' : 'Lookup'}
            </button>
            <button
              onClick={() => { setCustomIP(''); fetchIP(); }}
              className="px-3 text-sm text-gray-500 hover:text-gray-700"
              title="Check my IP"
            >
              My IP
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {loading && (
          <div className="card text-center py-8">
            <div className="animate-spin text-3xl mb-2">â³</div>
            <p className="text-sm text-gray-500">Detecting your IP addressâ€¦</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* IP Header */}
            <div className="card">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{flagEmoji(result.countryCode)}</span>
                <div>
                  <p className="text-2xl font-mono font-semibold">{result.ip}</p>
                  <p className="text-sm text-gray-500">{result.city}, {result.region}, {result.country}</p>
                </div>
              </div>
            </div>

            {/* VPN/Proxy flags */}
            <div className="card">
              <p className="text-sm font-medium mb-3">Privacy signals</p>
              <div className="flex flex-wrap gap-2">
                {riskBadge('VPN', result.isVpn)}
                {riskBadge('Proxy', result.isProxy)}
                {riskBadge('Tor', result.isTor)}
                {riskBadge('Hosting/DC', result.isHosting)}
              </div>
            </div>

            {/* Details */}
            <div className="card">
              <p className="text-sm font-medium mb-3">Network details</p>
              <dl className="space-y-2">
                {[
                  { label: 'ISP', value: result.isp },
                  { label: 'Organization', value: result.org },
                  { label: 'ASN', value: result.asn },
                  { label: 'Timezone', value: result.timezone },
                  { label: 'Coordinates', value: `${result.lat.toFixed(4)}, ${result.lon.toFixed(4)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-medium font-mono text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <button
              onClick={() => fetchIP(customIP || undefined)}
              className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              â†º Refresh
            </button>
          </div>
        )}
      </div>
    <ToolPageExtras toolName="VPN Checker" toolSlug="vpn-checker" toolUrl="https://roughtools.com/security/vpn-checker" type="general" />
    <ToolAdUnit position="bottom" />
    </div>
  );
}
