'use client';

import { useState, useEffect, useCallback } from 'react';

// Install: pnpm add qrcode --filter web
// Install: pnpm add @types/qrcode --filter web -D
import QRCode from 'qrcode';
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

type InputType = 'url' | 'text' | 'wifi' | 'vcard';

function buildQRContent(type: InputType, fields: Record<string, string>): string {
  switch (type) {
    case 'url':
      return fields.url || '';
    case 'text':
      return fields.text || '';
    case 'wifi':
      return `WIFI:T:${fields.security || 'WPA'};S:${fields.ssid || ''};P:${fields.wifiPassword || ''};;`;
    case 'vcard':
      return [
        'BEGIN:VCARD', 'VERSION:3.0',
        `FN:${fields.name || ''}`,
        `TEL:${fields.phone || ''}`,
        `EMAIL:${fields.email || ''}`,
        `ORG:${fields.org || ''}`,
        'END:VCARD',
      ].join('\n');
    default:
      return '';
  }
}

export default function QRCodeGeneratorPage() {
  const [inputType, setInputType] = useState<InputType>('url');
  const [fields, setFields] = useState<Record<string, string>>({ url: 'https://' });
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [dataUrl, setDataUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const [error, setError] = useState('');


  const content = buildQRContent(inputType, fields);

  const generateQR = useCallback(async () => {
    if (!content || content.length < 2) {
      setDataUrl('');
      setSvgString('');
      return;
    }
    try {
      setError('');
      // PNG via canvas
      const png = await QRCode.toDataURL(content, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      });
      setDataUrl(png);

      // SVG string
      const svg = await QRCode.toString(content, {
        type: 'svg',
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      });
      setSvgString(svg);
    } catch {
      setError('Content too long for QR code');
    }
  }, [content, fgColor, bgColor, size]);

  useEffect(() => {
    const timer = setTimeout(generateQR, 200);
    return () => clearTimeout(timer);
  }, [generateQR]);

  const downloadPNG = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  const downloadSVG = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const setField = (key: string, val: string) =>
    setFields(prev => ({ ...prev, [key]: val }));

  const typeButtons: { type: InputType; label: string }[] = [
    { type: 'url', label: 'URL' },
    { type: 'text', label: 'Text' },
    { type: 'wifi', label: 'Wi-Fi' },
    { type: 'vcard', label: 'Contact' },
  ];

  return (
    <div className="tool-page">
      <div className="max-w-2xl mx-auto">
        <ToolAdUnit position="top" />
        <h1 className="text-2xl font-semibold mb-1">QR Code Generator</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Generate QR codes for URLs, text, Wi-Fi, and contact cards. Download as PNG or SVG.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: inputs */}
          <div className="space-y-4">
            {/* Type selector */}
            <div className="card">
              <label className="block text-sm font-medium mb-2">Type</label>
              <div className="grid grid-cols-4 gap-1">
                {typeButtons.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => {
                      setInputType(type);
                      setFields({});
                    }}
                    className={`py-1.5 rounded text-xs font-medium transition-colors ${
                      inputType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic fields */}
            <div className="card space-y-3">
              {inputType === 'url' && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">URL</label>
                  <input
                    type="url"
                    value={fields.url || ''}
                    onChange={e => setField('url', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full"
                  />
                </div>
              )}

              {inputType === 'text' && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Text</label>
                  <textarea
                    value={fields.text || ''}
                    onChange={e => setField('text', e.target.value)}
                    placeholder="Enter any text…"
                    rows={4}
                    className="w-full resize-none"
                  />
                </div>
              )}

              {inputType === 'wifi' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Network name (SSID)</label>
                    <input value={fields.ssid || ''} onChange={e => setField('ssid', e.target.value)} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Password</label>
                    <input type="password" value={fields.wifiPassword || ''} onChange={e => setField('wifiPassword', e.target.value)} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Security</label>
                    <select value={fields.security || 'WPA'} onChange={e => setField('security', e.target.value)} className="w-full">
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None</option>
                    </select>
                  </div>
                </>
              )}

              {inputType === 'vcard' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Full name</label>
                    <input value={fields.name || ''} onChange={e => setField('name', e.target.value)} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Phone</label>
                    <input type="tel" value={fields.phone || ''} onChange={e => setField('phone', e.target.value)} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Email</label>
                    <input type="email" value={fields.email || ''} onChange={e => setField('email', e.target.value)} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Organization</label>
                    <input value={fields.org || ''} onChange={e => setField('org', e.target.value)} className="w-full" />
                  </div>
                </>
              )}
            </div>

            {/* Colors + size */}
            <div className="card">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Foreground</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-10 h-8 cursor-pointer rounded" />
                    <span className="text-xs font-mono">{fgColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Background</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-8 cursor-pointer rounded" />
                    <span className="text-xs font-mono">{bgColor}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="text-gray-500">Size</label>
                  <span>{size}×{size}px</span>
                </div>
                <input type="range" min={128} max={512} step={32} value={size} onChange={e => setSize(Number(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>

          {/* Right: preview + download */}
          <div className="space-y-4">
            <div className="card flex flex-col items-center">
              {error ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              ) : dataUrl ? (
                <img src={dataUrl} alt="QR code" className="rounded" style={{ width: 200, height: 200 }} />
              ) : (
                <div className="w-[200px] h-[200px] bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                  <p className="text-xs text-gray-400">QR preview</p>
                </div>
              )}

              {dataUrl && (
                <div className="flex gap-2 mt-4 w-full">
                  <button onClick={downloadPNG} className="btn-primary flex-1 text-sm">↓ PNG</button>
                  <button onClick={downloadSVG} className="btn-primary flex-1 text-sm">↓ SVG</button>
                </div>
              )}
            </div>

            {content && content.length > 1 && (
              <div className="card">
                <p className="text-xs text-gray-500 mb-1">QR content preview</p>
                <p className="text-xs font-mono break-all text-gray-700 dark:text-gray-300 max-h-24 overflow-auto">
                  {content}
                </p>
                <p className="text-xs text-gray-400 mt-2">{content.length} characters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    <ToolPageExtras toolName="QR Code Generator" toolSlug="qr-code-generator" toolUrl="https://roughtools.com/security/qr-code-generator" type="general" showPDF />
    <ToolAdUnit position="bottom" />
    </div>
  );
}