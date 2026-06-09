'use client';

import { useState } from 'react';
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

interface ShortLinkResult {
  shortUrl: string;
  slug: string;
  originalUrl: string;
  clicks: number;
}

export default function URLShortenerPage() {
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [result, setResult] = useState<ShortLinkResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const shorten = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/url-shortener/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, slug: customSlug || undefined }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || data.error || 'Failed to shorten URL');
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-page">
      <div className="max-w-xl mx-auto">
        <ToolAdUnit position="top" />
        <h1 className="text-2xl font-semibold mb-1">URL Shortener</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Create short, shareable links with click tracking.
        </p>

        <div className="card mb-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Long URL</label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && shorten()}
              placeholder="https://your-very-long-url.com/path?query=value"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Custom slug <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 whitespace-nowrap">
                {typeof window !== 'undefined' ? window.location.host : 'roughtools.com'}/s/
              </span>
              <input
                value={customSlug}
                onChange={e => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                placeholder="my-link"
                className="flex-1"
                maxLength={32}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={shorten}
          disabled={!url || loading}
          className="btn-primary w-full py-3 text-base mb-6"
        >
          {loading ? 'Shorteningâ€¦' : 'Shorten URL'}
        </button>

        {result && (
          <div className="card">
            <p className="text-xs text-gray-500 mb-3">Your short link</p>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-blue-600 dark:text-blue-400 font-medium text-sm truncate"
              >
                {result.shortUrl}
              </a>
              <button onClick={copy} className="btn-primary shrink-0 text-sm px-4">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="text-xs text-gray-500 break-all">
              <span className="font-medium">Original:</span> {result.originalUrl}
            </div>
          </div>
        )}
      </div>
    <ToolPageExtras toolName="URL Shortener" toolSlug="url-shortener" toolUrl="https://roughtools.com/security/url-shortener" type="general" />
    <ToolAdUnit position="bottom" />
    </div>
  );
}
