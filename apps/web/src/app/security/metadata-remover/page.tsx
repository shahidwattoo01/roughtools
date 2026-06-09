'use client';

import { useState, useRef } from 'react';
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

interface MetadataField {
  key: string;
  value: string;
}

interface MetaResult {
  original: MetadataField[];
  cleanedUrl: string;
  fileName: string;
  originalSize: number;
  cleanedSize: number;
}

export default function MetadataRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [result, setResult] = useState<MetaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      setError('Only JPEG, PNG, and WebP images are supported');
      return;
    }
    setFile(f);
    setResult(null);
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/metadata-remover', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Processing failed');
      }

      const metaHeader = res.headers.get('X-Original-Metadata');
      const original: MetadataField[] = metaHeader ? JSON.parse(metaHeader) : [];
      const originalSize = Number(res.headers.get('X-Original-Size') || 0);

      const blob = await res.blob();
      const cleanedUrl = URL.createObjectURL(blob);
      const cleanedSize = blob.size;

      setResult({ original, cleanedUrl, fileName: file.name, originalSize, cleanedSize });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (b: number) =>
    b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`;

  const downloadCleaned = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.cleanedUrl;
    a.download = 'clean_' + result.fileName;
    a.click();
  };

  return (
    <div className="tool-page">
      <div className="max-w-2xl mx-auto">
        <ToolAdUnit position="top" />
        <h1 className="text-2xl font-semibold mb-1">Metadata Remover</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Strip EXIF data (location, camera model, timestamps) from images before sharing.
        </p>

        {/* Upload zone */}
        {!file && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => inputRef.current?.click()}
            className={`card cursor-pointer border-2 border-dashed transition-colors py-16 text-center ${
              dragging
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <p className="text-4xl mb-3">[ img ]</p>
            <p className="font-medium">Drop an image here or click to browse</p>
            <p className="text-sm text-gray-400 mt-1">JPEG, PNG, WebP supported</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {file && !result && (
          <div className="space-y-4">
            <div className="card">
              <div className="flex gap-4 items-start">
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatSize(file.size)} &middot; {file.type}
                  </p>
                  <button
                    onClick={() => { setFile(null); setPreview(''); }}
                    className="text-xs text-gray-400 hover:text-red-500 mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={process}
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? 'Removing metadata...' : 'Remove Metadata & Download'}
            </button>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="card text-center">
                <p className="text-xs text-gray-500 mb-1">Fields removed</p>
                <p className="text-2xl font-semibold text-green-600">
                  {result.original.length}
                </p>
              </div>
              <div className="card text-center">
                <p className="text-xs text-gray-500 mb-1">Original size</p>
                <p className="text-lg font-semibold">{formatSize(result.originalSize)}</p>
              </div>
              <div className="card text-center">
                <p className="text-xs text-gray-500 mb-1">Clean size</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatSize(result.cleanedSize)}
                </p>
              </div>
            </div>

            <button
              onClick={downloadCleaned}
              className="btn-primary w-full py-3 text-base"
            >
              Download Clean Image
            </button>

            {result.original.length > 0 ? (
              <div className="card">
                <p className="text-sm font-medium mb-3">
                  Metadata removed ({result.original.length} fields)
                </p>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {result.original.map(({ key, value }) => (
                    <div
                      key={key}
                      className="flex gap-3 text-xs py-1 border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <span className="text-gray-500 w-40 shrink-0 font-mono">{key}</span>
                      <span className="text-red-600 dark:text-red-400 line-through truncate">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card text-center py-4">
                <p className="text-sm text-gray-500">No metadata found in this image</p>
              </div>
            )}

            <button
              onClick={() => { setFile(null); setPreview(''); setResult(null); }}
              className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Process another image
            </button>
          </div>
        )}
      </div>
    <ToolPageExtras toolName="Metadata Remover" toolSlug="metadata-remover" toolUrl="https://roughtools.com/security/metadata-remover" type="general" />
    <ToolAdUnit position="bottom" />
    </div>
  );
}
