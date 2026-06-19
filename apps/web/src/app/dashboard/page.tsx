'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ReferralStats {
  code: string | null;
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnedCents: number;
}

interface ToolUsage {
  toolSlug: string;
  count: number;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
      <div className="h-7 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [referral, setReferral] = useState<ReferralStats | null>(null);
  const [topTools, setTopTools] = useState<ToolUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    async function load() {
      try {
        const [subRes, refRes, analyticsRes] = await Promise.all([
          fetch('/api/billing/subscription', { credentials: 'include', signal: controller.signal }),
          fetch('/api/referral/stats', { credentials: 'include', signal: controller.signal }),
          fetch('/api/analytics/popular?limit=5', {
            credentials: 'include',
            signal: controller.signal,
          }),
        ]);

        if (subRes.status === 401) {
          router.push('/auth/signin');
          return;
        }

        if (refRes.ok) setReferral(await refRes.json());
        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setTopTools(data.tools ?? []);
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(true);
        }
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    }

    load();
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="h-8 bg-gray-200 rounded w-40 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-64 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-500 mb-4">Could not load your dashboard. Please try again.</p>
          <button
            onClick={() => {
              setError(false);
              setLoading(true);
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const planLabel = 'Free Forever';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome back! Here&apos;s your account overview.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Plan Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Current Plan</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-gray-900">{planLabel}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                active
              </span>
            </div>
            <p className="text-xs text-gray-400">
              All 611+ tools, no signup required, no watermarks.
            </p>
          </div>

          {/* Referral Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Referrals</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {referral?.successfulReferrals ?? 0}
              <span className="text-sm text-gray-400 font-normal ml-1">successful</span>
            </p>
            <p className="text-sm text-gray-500 mb-3">
              {referral?.totalReferrals ?? 0} total · $
              {((referral?.totalEarnedCents ?? 0) / 100).toFixed(2)} earned
            </p>
            <Link
              href="/dashboard/referral"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Get your link →
            </Link>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm font-medium text-gray-500 mb-3">Quick Links</p>
            <nav className="space-y-2">
              {[
                { label: 'Profile', href: '/profile' },
                { label: 'Settings', href: '/settings' },
                { label: 'API Keys', href: '/dashboard/api-keys' },
                { label: 'All Tools', href: '/tools' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Top Tools */}
        {topTools.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Used Tools</h2>
            <ul className="divide-y divide-gray-100">
              {topTools.map((t, i) => (
                <li key={t.toolSlug} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-5">{i + 1}.</span>
                    <span className="text-sm font-medium text-gray-800 capitalize">
                      {t.toolSlug.replace(/-/g, ' ')}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{t.count.toLocaleString()} uses</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
