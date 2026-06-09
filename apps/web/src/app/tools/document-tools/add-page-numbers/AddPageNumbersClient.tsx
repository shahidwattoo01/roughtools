"use client";

import React, { useState } from "react";
// 1. Import the types (Fixes Error 2307)
import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export default function AddPageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setProcessing(true);

    try {
      // Read the file
      const arrayBuffer = await file.arrayBuffer();

      // Load the PDF
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // 2. Fix the forEach loop (Fixes Error 7006)
      pages.forEach((page: PDFPage, index: number) => {
        const { width, height } = page.getSize();

        // Draw the page number at the bottom center
        page.drawText(`Page ${index + 1}`, {
          x: width / 2 - 20,
          y: height / 2, // Just for demonstration, usually 30-50px from bottom
          size: 12,
          color: rgb(0, 0, 0),
        });
      });

      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save();

      // Create a blob and download link
      const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error("Error processing PDF:", error);
      alert("Failed to process PDF");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <ToolAdUnit position="top" />
      <h1 className="text-2xl font-bold mb-4">Add Page Numbers</h1>

      <div className="mb-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleProcess}
        disabled={!file || processing}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {processing ? "Processing..." : "Add Numbers & Download"}
      </button>

      {downloadUrl && (
        <div className="mt-4">
          <a
            href={downloadUrl}
            download="numbered-document.pdf"
            className="text-blue-600 underline"
          >
            Click here to download your file
          </a>
        </div>
      )}
    <ToolPageExtras
      toolName="Add Page Numbers"
      toolSlug="add-page-numbers"
      toolUrl="https://roughtools.com/tools/document-tools/add-page-numbers"
      type="general"
      showPDF
    />
    <ToolAdUnit position="bottom" />
    </div>
  );
}
