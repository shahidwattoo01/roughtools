







"use client";
import { useState } from "react";
import ToolAdUnit from '@/components/ToolAdUnit'

const TITLE = "Word to PDF";
const ENDPOINT = "/api/tools/word-to-pdf";
const ACCEPT_TYPES = ".doc,.docx";
const OUTPUT_EXT = "document.pdf";

export default function WordToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const processFile = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(ENDPOINT, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Conversion failed on the server.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = OUTPUT_EXT;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <ToolAdUnit position="top" />
        <h1 className="text-3xl font-bold mb-8 text-center">{TITLE}</h1>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
          <div className="border-2 border-dashed border-gray-600 p-8 text-center rounded-lg hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept={ACCEPT_TYPES}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <p className="text-gray-300 text-lg">
                {file ? file.name : "Click to upload Word Document"}
              </p>
              {file && (
                <p className="text-sm text-gray-500 mt-2">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </label>
          </div>
          <button
            onClick={processFile}
            disabled={!file || processing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-4 rounded-lg text-lg transition-colors"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Converting...
              </span>
            ) : (
              `Convert to PDF`
            )}
          </button>
          {error && (
            <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg text-center text-sm text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    <ToolAdUnit position="bottom" />
    </div>
  );
}
