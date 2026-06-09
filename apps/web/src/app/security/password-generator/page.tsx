'use client';

import { useState, useCallback } from 'react';
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function getStrength(password: string): { label: string; score: number; color: string } {
  let score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 20) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: 'Weak', score, color: 'bg-red-500' };
  if (score <= 3) return { label: 'Fair', score, color: 'bg-orange-400' };
  if (score <= 4) return { label: 'Strong', score, color: 'bg-yellow-400' };
  return { label: 'Very Strong', score, color: 'bg-green-500' };
}

function generatePassword(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useNumbers: boolean,
  useSymbols: boolean
): string {
  let charset = '';
  const required: string[] = [];

  if (useUpper) { charset += CHARS.upper; required.push(CHARS.upper[Math.floor(Math.random() * CHARS.upper.length)]); }
  if (useLower) { charset += CHARS.lower; required.push(CHARS.lower[Math.floor(Math.random() * CHARS.lower.length)]); }
  if (useNumbers) { charset += CHARS.numbers; required.push(CHARS.numbers[Math.floor(Math.random() * CHARS.numbers.length)]); }
  if (useSymbols) { charset += CHARS.symbols; required.push(CHARS.symbols[Math.floor(Math.random() * CHARS.symbols.length)]); }

  if (!charset) return '';

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  const rest = Array.from({ length: length - required.length }, (_, i) =>
    charset[array[i] % charset.length]
  );

  const all = [...required, ...rest];
  // Shuffle using Fisher-Yates with crypto values
  const shuffle = new Uint32Array(all.length);
  crypto.getRandomValues(shuffle);
  for (let i = all.length - 1; i > 0; i--) {
    const j = shuffle[i] % (i + 1);
    [all[i], all[j]] = [all[j], all[i]];
  }

  return all.join('');
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [password, setPassword] = useState(() =>
    generatePassword(16, true, true, true, false)
  );
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const pw = generatePassword(length, useUpper, useLower, useNumbers, useSymbols);
    setPassword(pw);
    setCopied(false);
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = password ? getStrength(password) : null;
  const noneSelected = !useUpper && !useLower && !useNumbers && !useSymbols;

  return (
    <div className="tool-page">
      <div className="max-w-xl mx-auto">
        <ToolAdUnit position="top" />
        <h1 className="text-2xl font-semibold mb-1">Password Generator</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Cryptographically secure passwords generated entirely in your browser. Nothing is sent to any server.
        </p>

        {/* Password Display */}
        <div className="card mb-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              {noneSelected ? (
                <p className="text-sm text-red-500">Select at least one character type</p>
              ) : (
                <p className="font-mono text-lg break-all tracking-wider select-all">
                  {password || 'â€”'}
                </p>
              )}
            </div>
            <button
              onClick={copy}
              disabled={!password || noneSelected}
              className="btn-primary shrink-0 min-w-[80px]"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Strength bar */}
          {strength && !noneSelected && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Strength</span>
                <span className={`font-medium ${
                  strength.label === 'Weak' ? 'text-red-500' :
                  strength.label === 'Fair' ? 'text-orange-400' :
                  strength.label === 'Strong' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>{strength.label}</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${(strength.score / 6) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="card mb-4">
          {/* Length slider */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Length</label>
              <span className="text-sm font-mono font-semibold tabular-nums">{length}</span>
            </div>
            <input
              type="range"
              min={8}
              max={128}
              step={1}
              value={length}
              onChange={e => { setLength(Number(e.target.value)); generate(); }}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>8</span>
              <span>128</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            {[
              { label: 'Uppercase letters', sub: 'Aâ€“Z', value: useUpper, set: setUseUpper },
              { label: 'Lowercase letters', sub: 'aâ€“z', value: useLower, set: setUseLower },
              { label: 'Numbers', sub: '0â€“9', value: useNumbers, set: setUseNumbers },
              { label: 'Symbols', sub: '!@#$%^&*', value: useSymbols, set: setUseSymbols },
            ].map(({ label, sub, value, set }) => (
              <label key={label} className="flex items-center justify-between cursor-pointer group">
                <span>
                  <span className="text-sm font-medium">{label}</span>
                  <span className="ml-2 text-xs text-gray-400 font-mono">{sub}</span>
                </span>
                <button
                  role="switch"
                  aria-checked={value}
                  onClick={() => { set(!value); generate(); }}
                  className={`toggle-btn ${value ? 'active' : ''}`}
                >
                  <span className="toggle-thumb" />
                </button>
              </label>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={noneSelected}
          className="btn-primary w-full py-3 text-base"
        >
          Generate New Password
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          Uses <code>crypto.getRandomValues()</code> â€” cryptographically secure, runs entirely in your browser
        </p>
      </div>
    <ToolPageExtras toolName="Password Generator" toolSlug="password-generator" toolUrl="https://roughtools.com/security/password-generator" type="general" />
    <ToolAdUnit position="bottom" />
    </div>
  );
}
