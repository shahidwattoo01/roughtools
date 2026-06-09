'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  receivedAt: string;
}

const EXPIRE_MINUTES = 30;

export default function TemporaryEmailPage() {
  const [address, setAddress] = useState('');
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<EmailMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const generateAddress = useCallback(async () => {
    setLoading(true);
    setMessages([]);
    setSelectedMsg(null);
    setError('');
    try {
      const res = await fetch('/api/temp-email/generate', { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to generate address');
      setAddress(data.data.address);
      const exp = new Date(Date.now() + EXPIRE_MINUTES * 60 * 1000);
      setExpiresAt(exp);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create email');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!address) return;
    setPolling(true);
    try {
      const res = await fetch(`/api/temp-email/messages?address=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data.success) setMessages(data.data.messages || []);
    } catch { /* silent */ }
    finally { setPolling(false); }
  }, [address]);

  // Init
  useEffect(() => { generateAddress(); }, [generateAddress]);

  // Poll every 5s
  useEffect(() => {
    if (!address) return;
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [address, fetchMessages]);

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = expiresAt.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
    };
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [expiresAt]);

  const copy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="tool-page">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="animate-spin text-4xl mb-3">â³</div>
          <p className="text-gray-500">Generating your temporary inboxâ€¦</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-page">
      <div className="max-w-2xl mx-auto">
        <ToolAdUnit position="top" />
        <h1 className="text-2xl font-semibold mb-1">Temporary Email</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Disposable inbox for signups, trials, and spam-free browsing. Auto-expires in {EXPIRE_MINUTES} minutes.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Address card */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">Your temporary email address</p>
            <div className="flex items-center gap-2">
              {polling && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Polling for messages" />}
              <span className="text-xs text-gray-400">Expires in {timeLeft}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="flex-1 font-mono text-lg font-medium truncate">{address}</p>
            <button onClick={copy} className="btn-primary shrink-0 text-sm px-4">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={fetchMessages}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              â†º Refresh now
            </button>
            <span className="text-gray-200 dark:text-gray-700">Â·</span>
            <button
              onClick={generateAddress}
              className="text-xs text-gray-500 hover:text-red-500"
            >
              Generate new address
            </button>
          </div>
        </div>

        {/* Inbox */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Message list */}
          <div className="card p-0 overflow-hidden">
            <div className="p-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-medium">Inbox {messages.length > 0 && `(${messages.length})`}</p>
            </div>
            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-3xl mb-2">ðŸ“­</p>
                <p className="text-sm text-gray-500">No messages yet</p>
                <p className="text-xs text-gray-400 mt-1">Checking every 5 secondsâ€¦</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {messages.map(msg => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMsg(msg)}
                    className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedMsg?.id === msg.id ? 'bg-blue-50 dark:bg-blue-950' : ''
                    }`}
                  >
                    <p className="text-sm font-medium truncate">{msg.from}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{msg.subject || '(no subject)'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(msg.receivedAt).toLocaleTimeString()}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message viewer */}
          <div className="card">
            {selectedMsg ? (
              <div>
                <p className="text-sm font-medium mb-1">{selectedMsg.subject || '(no subject)'}</p>
                <p className="text-xs text-gray-500 mb-1">From: {selectedMsg.from}</p>
                <p className="text-xs text-gray-400 mb-3">{new Date(selectedMsg.receivedAt).toLocaleString()}</p>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                  <p className="text-sm whitespace-pre-wrap break-words">{selectedMsg.body}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">ðŸ“¨</p>
                <p className="text-sm text-gray-500">Select a message to read it</p>
              </div>
            )}
          </div>
        </div>
      </div>
    <ToolPageExtras toolName="Temporary Email" toolSlug="temporary-email" toolUrl="https://roughtools.com/security/temporary-email" type="general" />
    <ToolAdUnit position="bottom" />
    </div>
  );
}
