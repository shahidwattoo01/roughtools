'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

type Tool = 'select' | 'text' | 'highlight' | 'draw' | 'rect' | 'erase';

interface BaseAnn {
  id: string;
  page: number;
}
interface TextAnn extends BaseAnn {
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
}
interface HighlightAnn extends BaseAnn {
  type: 'highlight';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}
interface DrawAnn extends BaseAnn {
  type: 'draw';
  points: number[];
  color: string;
  strokeWidth: number;
}
interface RectAnn extends BaseAnn {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  filled: boolean;
}

type Annotation = TextAnn | HighlightAnn | DrawAnn | RectAnn;

let annIdSeq = 0;
const uid = () => `ann-${++annIdSeq}`;

export default function PDFEditorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.4);
  const [tool, setTool] = useState<Tool>('select');
  const [color, setColor] = useState('#f59e0b');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [fontSize, setFontSize] = useState(16);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [history, setHistory] = useState<Annotation[][]>([[]]);
  const [histIdx, setHistIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [pageDims, setPageDims] = useState<{ width: number; height: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pdfDocRef = useRef<unknown>(null);
  const drawStart = useRef<{ x: number; y: number } | null>(null);
  const drawPoints = useRef<number[]>([]);
  const activeDrawId = useRef<string | null>(null);
  const renderTask = useRef<{ cancel: () => void } | null>(null);

  // Push to undo history
  const pushHistory = useCallback(
    (anns: Annotation[]) => {
      setHistory((h) => {
        const next = h.slice(0, histIdx + 1);
        next.push(anns);
        setHistIdx(next.length - 1);
        return next;
      });
    },
    [histIdx]
  );

  const undo = useCallback(() => {
    if (histIdx > 0) {
      const prev = history[histIdx - 1];
      setAnnotations(prev);
      setHistIdx((i) => i - 1);
    }
  }, [history, histIdx]);

  const redo = useCallback(() => {
    if (histIdx < history.length - 1) {
      const next = history[histIdx + 1];
      setAnnotations(next);
      setHistIdx((i) => i + 1);
    }
  }, [history, histIdx]);

  // Load PDF
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    (async () => {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      const buf = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
      if (cancelled) return;
      pdfDocRef.current = doc;
      setNumPages(doc.numPages);
      setCurrentPage(1);
      setAnnotations([]);
      setHistory([[]]);
      setHistIdx(0);
      // collect page dimensions
      const dims: { width: number; height: number }[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const pg = await doc.getPage(i);
        const vp = pg.getViewport({ scale: 1 });
        dims.push({ width: vp.width, height: vp.height });
      }
      setPageDims(dims);
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  // Render current page
  useEffect(() => {
    if (!pdfDocRef.current || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      renderTask.current?.cancel();
      const doc = pdfDocRef.current as { getPage: (n: number) => Promise<unknown> };
      const page = (await doc.getPage(currentPage)) as {
        getViewport: (o: { scale: number }) => { width: number; height: number };
        render: (o: unknown) => { promise: Promise<void>; cancel: () => void };
      };
      if (cancelled) return;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setPageSize({ width: viewport.width, height: viewport.height });
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const task = page.render({ canvasContext: ctx, viewport });
      renderTask.current = task as unknown as { cancel: () => void };
      try {
        await task.promise;
      } catch {
        /* cancelled */
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, scale]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (editingText) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selected) {
          const next = annotations.filter((a) => a.id !== selected);
          setAnnotations(next);
          pushHistory(next);
          setSelected(null);
        }
      }
      if (e.key === 't') setTool('text');
      if (e.key === 'h') setTool('highlight');
      if (e.key === 'd') setTool('draw');
      if (e.key === 'r') setTool('rect');
      if (e.key === 's') setTool('select');
      if (e.key === 'Escape') {
        setSelected(null);
        setTool('select');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editingText, selected, annotations, undo, redo, pushHistory]);

  const getPos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!file) return;
    const pos = getPos(e);

    if (tool === 'text') {
      const id = uid();
      const ann: TextAnn = {
        id,
        type: 'text',
        page: currentPage,
        x: pos.x,
        y: pos.y,
        text: '',
        fontSize,
        color,
        bold,
        italic,
      };
      const next = [...annotations, ann];
      setAnnotations(next);
      pushHistory(next);
      setSelected(id);
      setEditingText(id);
      return;
    }

    if (tool === 'erase') {
      setSelected(null);
      return;
    }

    setDragging(true);
    drawStart.current = pos;

    if (tool === 'draw') {
      const id = uid();
      activeDrawId.current = id;
      drawPoints.current = [pos.x, pos.y];
      const ann: DrawAnn = {
        id,
        type: 'draw',
        page: currentPage,
        points: [pos.x, pos.y],
        color,
        strokeWidth,
      };
      setAnnotations((prev) => [...prev, ann]);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !drawStart.current) return;
    const pos = getPos(e);

    if (tool === 'draw' && activeDrawId.current) {
      drawPoints.current.push(pos.x, pos.y);
      const pts = [...drawPoints.current];
      setAnnotations((prev) =>
        prev.map((a) => (a.id === activeDrawId.current ? ({ ...a, points: pts } as DrawAnn) : a))
      );
      return;
    }

    const start = drawStart.current;
    const x = Math.min(start.x, pos.x);
    const y = Math.min(start.y, pos.y);
    const w = Math.abs(pos.x - start.x);
    const h = Math.abs(pos.y - start.y);

    if ((tool === 'highlight' || tool === 'rect') && w > 2 && h > 2) {
      const existing = annotations.find((a) => a.id === 'preview');
      if (!existing) {
        if (tool === 'highlight') {
          setAnnotations((prev) => [
            ...prev,
            {
              id: 'preview',
              type: 'highlight',
              page: currentPage,
              x,
              y,
              width: w,
              height: h,
              color,
            } as HighlightAnn,
          ]);
        } else {
          setAnnotations((prev) => [
            ...prev,
            {
              id: 'preview',
              type: 'rect',
              page: currentPage,
              x,
              y,
              width: w,
              height: h,
              color,
              filled: false,
            } as RectAnn,
          ]);
        }
      } else {
        setAnnotations((prev) =>
          prev.map((a) => (a.id === 'preview' ? { ...a, x, y, width: w, height: h } : a))
        );
      }
    }
  };

  const onMouseUp = (_e: React.MouseEvent) => {
    if (!dragging) return;
    setDragging(false);

    if (tool === 'draw' && activeDrawId.current) {
      activeDrawId.current = null;
      const next = annotations.map((a) => a);
      pushHistory(next);
      return;
    }

    if (tool === 'highlight' || tool === 'rect') {
      const next = annotations.map((a) => (a.id === 'preview' ? { ...a, id: uid() } : a));
      setAnnotations(next);
      pushHistory(next);
    }

    drawStart.current = null;
  };

  const onClickAnnotation = (_e: React.MouseEvent, id: string) => {
    if (tool === 'erase') {
      const next = annotations.filter((a) => a.id !== id);
      setAnnotations(next);
      pushHistory(next);
      return;
    }
    if (tool === 'select') setSelected(id);
  };

  const onOverlayClick = (_e: React.MouseEvent) => {
    if (tool === 'select') setSelected(null);
  };

  const finishText = (id: string, text: string) => {
    setEditingText(null);
    if (!text.trim()) {
      const next = annotations.filter((a) => a.id !== id);
      setAnnotations(next);
      pushHistory(next);
    } else {
      const next = annotations.map((a) => (a.id === id ? ({ ...a, text } as TextAnn) : a));
      setAnnotations(next);
      pushHistory(next);
    }
  };

  const pageAnns = annotations.filter((a) => a.page === currentPage);

  const exportPDF = async () => {
    if (!file) return;
    setExporting(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('annotations', JSON.stringify(annotations));
      fd.append('scale', String(scale));
      fd.append('pageDims', JSON.stringify(pageDims));
      const res = await fetch('/api/pdf/edit', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, '') + '-edited.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const TOOLS: { id: Tool; label: string; icon: string; key: string }[] = [
    { id: 'select', label: 'Select', icon: '↖', key: 'S' },
    { id: 'text', label: 'Text', icon: 'T', key: 'T' },
    { id: 'highlight', label: 'Highlight', icon: '▬', key: 'H' },
    { id: 'draw', label: 'Draw', icon: '✏', key: 'D' },
    { id: 'rect', label: 'Rectangle', icon: '▭', key: 'R' },
    { id: 'erase', label: 'Erase', icon: '⌫', key: 'E' },
  ];

  const COLORS = [
    '#f59e0b',
    '#ef4444',
    '#22c55e',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#000000',
    '#ffffff',
  ];

  if (!file) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <div className="max-w-2xl mx-auto w-full px-4 py-16 flex flex-col items-center">
          <nav className="text-sm text-gray-500 mb-10 flex items-center gap-2 self-start">
            <Link href="/tools/pdf" className="hover:text-red-600 transition-colors">
              PDF Tools
            </Link>
            <span>›</span>
            <span className="text-gray-800 dark:text-gray-200 font-medium">PDF Editor</span>
          </nav>

          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-3xl mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            PDF Editor
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-10 max-w-md">
            Add text, highlights, drawings and shapes to any PDF. Works with scanned documents,
            forms, presentations — any PDF type.
          </p>

          <div
            onClick={() => fileRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) setFile(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-16 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,application/pdf"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }}
            />
            <svg
              className="w-14 h-14 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Drop your PDF here
            </p>
            <p className="text-sm text-gray-400 mb-5">or</p>
            <span className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Select PDF File
            </span>
            <p className="text-xs text-gray-400 mt-5">
              Any PDF · Max 50MB · Processed in your browser
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-center">
            {[
              { icon: 'T', label: 'Add Text', desc: 'Click anywhere to type' },
              { icon: '▬', label: 'Highlight', desc: 'Drag to highlight' },
              { icon: '✏', label: 'Draw', desc: 'Freehand pen tool' },
              { icon: '▭', label: 'Shapes', desc: 'Add rectangles' },
            ].map((f) => (
              <div
                key={f.label}
                className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <div className="w-10 h-10 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-2">
                  {f.icon}
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{f.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950 overflow-hidden">
      {/* ── Top toolbar ── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm flex-shrink-0 flex-wrap">
        {/* File info */}
        <div className="flex items-center gap-2 mr-2">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[140px] truncate">
            {file.name}
          </span>
          <button
            onClick={() => setFile(null)}
            className="text-gray-400 hover:text-gray-600 text-xs ml-1"
          >
            ✕
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Tools */}
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            title={`${t.label} (${t.key})`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tool === t.id
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-base leading-none">{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Color */}
        <div className="flex items-center gap-1">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${color === c ? 'border-gray-800 dark:border-white scale-125' : 'border-gray-200 dark:border-gray-700'}`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded cursor-pointer border border-gray-200 dark:border-gray-700 p-0.5 bg-transparent"
          />
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Text options */}
        {tool === 'text' && (
          <>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-200"
            >
              {[10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48].map((s) => (
                <option key={s} value={s}>
                  {s}px
                </option>
              ))}
            </select>
            <button
              onClick={() => setBold((b) => !b)}
              className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-colors ${bold ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
            >
              B
            </button>
            <button
              onClick={() => setItalic((i) => !i)}
              className={`px-2.5 py-1 rounded-lg text-sm italic transition-colors ${italic ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
            >
              I
            </button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
          </>
        )}

        {/* Draw stroke width */}
        {tool === 'draw' && (
          <>
            <select
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-200"
            >
              {[1, 2, 3, 5, 8, 12].map((w) => (
                <option key={w} value={w}>
                  {w}px
                </option>
              ))}
            </select>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
          </>
        )}

        {/* Undo/Redo */}
        <button
          onClick={undo}
          disabled={histIdx === 0}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>
        </button>
        <button
          onClick={redo}
          disabled={histIdx === history.length - 1}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
            />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale((s) => Math.max(0.5, +(s - 0.2).toFixed(1)))}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold"
          >
            −
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(3, +(s + 0.2).toFixed(1)))}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold"
          >
            +
          </button>
        </div>

        <div className="flex-1" />

        {/* Export */}
        <button
          onClick={exportPDF}
          disabled={exporting}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold px-5 py-2 rounded-xl transition-colors text-sm shadow-sm"
        >
          {exporting ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          )}
          {exporting ? 'Saving…' : 'Download PDF'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left sidebar: pages ── */}
        <div className="w-24 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto flex flex-col gap-2 p-2">
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setCurrentPage(pg)}
              className={`w-full aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-center text-sm font-medium transition-all ${
                pg === currentPage
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-red-300 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <svg className="w-6 h-6 mb-1 opacity-40" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs">{pg}</span>
            </button>
          ))}
        </div>

        {/* ── Main canvas area ── */}
        <div className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-950 flex items-start justify-center p-6">
          <div
            className="relative shadow-2xl rounded-sm"
            style={{ width: pageSize.width, height: pageSize.height }}
          >
            {/* PDF canvas */}
            <canvas ref={canvasRef} className="block" />

            {/* SVG annotation overlay */}
            <svg
              ref={overlayRef}
              className="absolute inset-0"
              style={{
                width: pageSize.width,
                height: pageSize.height,
                cursor:
                  tool === 'text'
                    ? 'text'
                    : tool === 'erase'
                      ? 'crosshair'
                      : tool === 'draw'
                        ? 'crosshair'
                        : tool === 'highlight' || tool === 'rect'
                          ? 'crosshair'
                          : 'default',
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onClick={onOverlayClick}
            >
              {pageAnns.map((ann) => {
                const isSelected = ann.id === selected;

                if (ann.type === 'highlight') {
                  return (
                    <rect
                      key={ann.id}
                      x={ann.x}
                      y={ann.y}
                      width={ann.width}
                      height={ann.height}
                      fill={ann.color}
                      fillOpacity={0.35}
                      stroke={isSelected ? '#3b82f6' : 'none'}
                      strokeWidth={isSelected ? 1.5 : 0}
                      strokeDasharray={isSelected ? '4 2' : undefined}
                      style={{ cursor: tool === 'erase' ? 'crosshair' : 'pointer' }}
                      onClick={(e) => onClickAnnotation(e, ann.id)}
                    />
                  );
                }

                if (ann.type === 'rect') {
                  return (
                    <rect
                      key={ann.id}
                      x={ann.x}
                      y={ann.y}
                      width={ann.width}
                      height={ann.height}
                      fill={ann.filled ? ann.color : 'none'}
                      stroke={ann.color}
                      strokeWidth={2}
                      opacity={0.85}
                      strokeDasharray={isSelected ? '4 2' : undefined}
                      style={{ cursor: tool === 'erase' ? 'crosshair' : 'pointer' }}
                      onClick={(e) => onClickAnnotation(e, ann.id)}
                    />
                  );
                }

                if (ann.type === 'draw') {
                  const pts = ann.points;
                  if (pts.length < 2) return null;
                  const d = pts.reduce(
                    (acc, v, i) =>
                      i === 0
                        ? `M${v}`
                        : i === 1
                          ? `${acc} ${v}`
                          : i % 2 === 0
                            ? `${acc} L${v}`
                            : `${acc} ${v}`,
                    ''
                  );
                  return (
                    <path
                      key={ann.id}
                      d={d}
                      stroke={ann.color}
                      strokeWidth={ann.strokeWidth}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.9}
                      style={{ cursor: tool === 'erase' ? 'crosshair' : 'pointer' }}
                      onClick={(e) => onClickAnnotation(e, ann.id)}
                    />
                  );
                }

                return null;
              })}
            </svg>

            {/* Text annotation overlays (positioned absolutely) */}
            {pageAnns
              .filter((a) => a.type === 'text')
              .map((ann) => {
                const a = ann as TextAnn;
                const isEditing = editingText === a.id;
                return (
                  <div
                    key={a.id}
                    style={{
                      position: 'absolute',
                      left: a.x,
                      top: a.y,
                      color: a.color,
                      fontSize: a.fontSize,
                      fontWeight: a.bold ? 'bold' : 'normal',
                      fontStyle: a.italic ? 'italic' : 'normal',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      minWidth: 20,
                      outline: selected === a.id && !isEditing ? '2px dashed #3b82f6' : 'none',
                      outlineOffset: 2,
                      cursor: tool === 'erase' ? 'crosshair' : 'pointer',
                      userSelect: isEditing ? 'text' : 'none',
                      whiteSpace: 'pre',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (tool === 'erase') {
                        const next = annotations.filter((x) => x.id !== a.id);
                        setAnnotations(next);
                        pushHistory(next);
                        return;
                      }
                      if (tool === 'select') {
                        setSelected(a.id);
                        setEditingText(a.id);
                      }
                    }}
                  >
                    {isEditing ? (
                      <input
                        autoFocus
                        defaultValue={a.text}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: a.color,
                          fontSize: a.fontSize,
                          fontWeight: a.bold ? 'bold' : 'normal',
                          fontStyle: a.italic ? 'italic' : 'normal',
                          fontFamily: 'Helvetica, Arial, sans-serif',
                          minWidth: 80,
                          width: Math.max(80, (a.text.length + 1) * a.fontSize * 0.6),
                          padding: 0,
                          margin: 0,
                        }}
                        onBlur={(e) => finishText(a.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter')
                            finishText(a.id, (e.target as HTMLInputElement).value);
                          if (e.key === 'Escape') finishText(a.id, a.text);
                          e.stopPropagation();
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingText(a.id);
                        }}
                      >
                        {a.text || (
                          <span className="opacity-30 italic text-sm">Click to type…</span>
                        )}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* ── Right: hints panel ── */}
        <div className="w-48 flex-shrink-0 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-3 flex flex-col gap-4 overflow-y-auto">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Active Tool
            </p>
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-xl px-3 py-2">
              <span className="text-lg">{TOOLS.find((t) => t.id === tool)?.icon}</span>
              <span className="text-sm font-semibold">
                {TOOLS.find((t) => t.id === tool)?.label}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Shortcuts
            </p>
            <div className="space-y-1.5">
              {TOOLS.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
                >
                  <span>{t.label}</span>
                  <kbd className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-mono">
                    {t.key}
                  </kbd>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Undo</span>
                <kbd className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-mono">
                  Ctrl Z
                </kbd>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Delete</span>
                <kbd className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-mono">
                  Del
                </kbd>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Page
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 text-gray-600 dark:text-gray-400 text-sm"
              >
                ‹
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 text-center">
                {currentPage}/{numPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                disabled={currentPage === numPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 text-gray-600 dark:text-gray-400 text-sm"
              >
                ›
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Annotations
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
              {annotations.filter((a) => a.id !== 'preview').length}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              on{' '}
              {
                [...new Set(annotations.filter((a) => a.id !== 'preview').map((a) => a.page))]
                  .length
              }{' '}
              page(s)
            </p>
          </div>

          {selected && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Selected
              </p>
              <button
                onClick={() => {
                  const next = annotations.filter((a) => a.id !== selected);
                  setAnnotations(next);
                  pushHistory(next);
                  setSelected(null);
                }}
                className="w-full text-xs text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                Delete annotation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
