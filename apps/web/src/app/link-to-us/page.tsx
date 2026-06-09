"use client"
import { useState } from "react"
import { useClipboard } from "@workspace/ui";

const SITE_URL = "https://roughtools.com";

interface BadgeConfig {
  label: string;
  icon: "link" | "code" | "star" | "grid";
  size: "small" | "medium" | "large";
  color: "dark" | "blue" | "white";
}

const PRESETS: BadgeConfig[] = [
  { label: "Dark Badge", icon: "link", size: "small", color: "dark" },
  { label: "Blue Badge", icon: "link", size: "small", color: "blue" },
  { label: "White Badge", icon: "link", size: "small", color: "white" },
  { label: "Wide Button", icon: "link", size: "medium", color: "dark" },
  { label: "Pill Button", icon: "star", size: "medium", color: "blue" },
  { label: "Large Badge", icon: "grid", size: "large", color: "dark" },
];

function generateBadgeHtml(config: BadgeConfig, customText?: string): string {
  const text = customText ?? "RoughTools";
  const icons: Record<string, string> = {
    link: "&#9889;",
    code: "&#60;/&#62;",
    star: "&#9733;",
    grid: "&#9638;",
  };
  const icon = icons[config.icon] ?? "";

  if (config.size === "large") {
    const bg =
      config.color === "dark"
        ? "#111827"
        : config.color === "blue"
          ? "#2563eb"
          : "#ffffff";
    const fg = config.color === "white" ? "#111827" : "#ffffff";
    const border = config.color === "white" ? "#d1d5db" : "none";
    return `<a href="${SITE_URL}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:${bg};color:${fg};border-radius:10px;text-decoration:none;font-family:system-ui,sans-serif;font-size:15px;font-weight:600;${border ? `border:1px solid ${border};` : ""}">${icon} ${text}</a>`;
  }

  if (config.size === "medium") {
    const bg =
      config.color === "dark"
        ? "#111827"
        : config.color === "blue"
          ? "#2563eb"
          : "#ffffff";
    const fg = config.color === "white" ? "#111827" : "#ffffff";
    const radius = config.icon === "star" ? "999px" : "8px";
    return `<a href="${SITE_URL}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:${bg};color:${fg};border-radius:${radius};text-decoration:none;font-family:system-ui,sans-serif;font-size:14px;font-weight:500;">${icon} ${text}</a>`;
  }

  const bg =
    config.color === "dark"
      ? "#111827"
      : config.color === "blue"
        ? "#dbeafe"
        : "#f3f4f6";
  const fg =
    config.color === "blue"
      ? "#1d4ed8"
      : config.color === "white"
        ? "#111827"
        : "#ffffff";
  const border = config.color === "white" ? "#d1d5db" : "none";
  return `<a href="${SITE_URL}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;padding:5px 12px;background:${bg};color:${fg};border-radius:6px;text-decoration:none;font-family:system-ui,sans-serif;font-size:12px;font-weight:500;${border ? `border:1px solid ${border};` : ""}">${icon} ${text}</a>`;
}

export default function Page() {
  const [activePreset, setActivePreset] = useState(0);
  const [customText, setCustomText] = useState("");
  const { copied, copy } = useClipboard(3000);

  const code = generateBadgeHtml(
    PRESETS[activePreset],
    customText || undefined,
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Link to Us</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Help spread the word ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â choose a badge style and copy the HTML into your
        site.
      </p>

      {/* Custom text input */}
      <div className="mb-6 max-w-xs">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Custom label text
        </label>
        <input
          type="text"
          className="input"
          placeholder="RoughTools"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
        />
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-3 mb-8">
        {PRESETS.map((preset, i) => (
          <button
            key={i}
            onClick={() => setActivePreset(i)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
              i === activePreset
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Live preview */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Preview
        </p>
        <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            Example on a light background:
          </p>
          <div dangerouslySetInnerHTML={{ __html: code }} />
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-8 mt-4">
          <p className="text-sm text-gray-500 mb-4">
            Example on a dark background:
          </p>
          <div dangerouslySetInnerHTML={{ __html: code }} />
        </div>
      </div>

      {/* Code output */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            HTML Code
          </p>
          <button
            onClick={() => copy(code)}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {copied ? (
              <>
                <svg
                  className="w-3.5 h-3.5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>{" "}
                Copied
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612"
                  />
                </svg>{" "}
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="bg-gray-950 text-gray-300 rounded-xl border border-gray-800 p-5 text-xs font-mono leading-relaxed overflow-x-auto">
          {escHtml(code)}
        </pre>
      </div>
    </div>
  );
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

