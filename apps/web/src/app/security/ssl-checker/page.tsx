'use client';

import { useState } from 'react';
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

interface CertInfo {
  domain: string;
  subject: { CN: string; O?: string };
  issuer: { CN: string; O?: string };
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  isValid: boolean;
  sans: string[];
  protocol: string;
}

export default function SSLCheckerPage() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<CertInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const check = async () => {
    const cleaned = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*/, '');
    if (!cleaned) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/ssl-checker?domain=${encodeURIComponent(cleaned)}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || data.error || 'Failed to check SSL');
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check SSL certificate');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (days: number) => {
    if (days <= 0) return { bg: 'bg-red-100 dark:bg-red-950', text: 'text-red-700 dark:text-red-400', label: 'Expired' };
    if (days <= 30) return { bg: 'bg-orange-100 dark:bg-orange-950', text: 'text-orange-700 dark:text-orange-400', label: 'Expiring soon' };
    return { bg: 'bg-green-100 dark:bg-green-950', text: 'text-green-700 dark:text-green-400', label: 'Valid' };
  };

  return (
    <div className="tool-page">
      <div className="max-w-xl mx-auto">
        <ToolAdUnit position="top" />
        <h1 className="text-2xl font-semibold mb-1">SSL Certificate Checker</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Check SSL/TLS certificate validity, expiry date, and issuer details for any domain.
        </p>

        <div className="card mb-4">
          <label className="block text-sm font-medium mb-2">Domain</label>
          <div className="flex gap-2">
            <input
              value={domain}
              onChange={e => setDomain(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && check()}
              placeholder="example.com"
              className="flex-1"
            />
            <button onClick={check} disabled={!domain || loading} className="btn-primary px-6">
              {loading ? 'Checkingâ€¦' : 'Check'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {result && (() => {
          const status = statusColor(result.daysRemaining);
          return (
            <div className="space-y-4">
              {/* Status banner */}
              <div className={`card ${status.bg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-lg font-semibold ${status.text}`}>{status.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{result.domain}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${status.text}`}>{result.daysRemaining}</p>
                    <p className="text-xs text-gray-500">days remaining</p>
                  </div>
                </div>
              </div>

              {/* Certificate details */}
              <div className="card">
                <p className="text-sm font-medium mb-3">Certificate Details</p>
                <dl className="space-y-2">
                  {[
                    { label: 'Issued to', value: result.subject.CN },
                    { label: 'Organization', value: result.subject.O || 'â€”' },
                    { label: 'Issued by', value: result.issuer.CN },
                    { label: 'CA Organization', value: result.issuer.O || 'â€”' },
                    { label: 'Valid from', value: new Date(result.validFrom).toLocaleDateString() },
                    { label: 'Expires', value: new Date(result.validTo).toLocaleDateString() },
                    { label: 'Protocol', value: result.protocol },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <dt className="text-gray-500">{label}</dt>
                      <dd className="font-medium text-right max-w-[60%] truncate">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* SANs */}
              {result.sans.length > 0 && (
                <div className="card">
                  <p className="text-sm font-medium mb-2">Covered domains ({result.sans.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {result.sans.map(san => (
                      <span key={san} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                        {san}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    <ToolPageExtras toolName="SSL Checker" toolSlug="ssl-checker" toolUrl="https://roughtools.com/security/ssl-checker" type="general" />
    <ToolAdUnit position="bottom" />
    </div>
  );
}
