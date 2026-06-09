"use client";
import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export default function AddWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [processing, setProcessing] = useState(false);

  const addWatermark = async () => {
    if (!file || !text) return;
    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, 50);
        page.drawText(text, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: 50,
          font,
          color: rgb(0.75, 0.75, 0.75),
          opacity: 0.3,
          rotate: { type: "degrees" as any, angle: -45 },
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "watermarked.pdf";
      a.click();
    } catch {
      alert("Error adding watermark.");
    }
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <ToolAdUnit position="top" />
        <h1 className="text-3xl font-bold mb-8 text-center">Add Watermark</h1>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Watermark Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. CONFIDENTIAL, DRAFT"
            />
          </div>
          <button
            onClick={addWatermark}
            disabled={!file || !text || processing}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg"
          >
            {processing ? "Processing..." : "Add Watermark & Download"}
          </button>
        </div>
      </div>
    <ToolPageExtras
      toolName="Add Watermark"
      toolSlug="add-watermark"
      toolUrl="https://roughtools.com/tools/document-tools/add-watermark"
      type="general"
      showPDF
    />
    <ToolAdUnit position="bottom" />
    </div>
  );
}
