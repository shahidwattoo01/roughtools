"use client"
import { useState } from "react";
import { useClipboard, TextInput, SelectInput } from "@workspace/ui";

const SITE_URL = "https://roughtools.com";

const TOOL_SLUGS = [
  { label: "JSON Formatter", slug: "json-formatter" },
  { label: "Color Picker", slug: "color-picker" },
  { label: "Regex Tester", slug: "regex-tester" },
  { label: "Text Summarizer", slug: "text-summarizer" },
  { label: "Image Compressor", slug: "image-compressor" },
];

interface EmbedOptions {
  slug: string;
  width: string;
  height: string;
  frameborder: string;
  scrolling: "auto" | "no" | "yes";
  theme: "light" | "dark" | "auto";
  borderRadius: string;
}

function generateEmbedCode(opts: EmbedOptions): string {
  const src = `${SITE_URL}/embed/tools/${opts.slug}`;
  return `<iframe
  src="${src}"
  width="${opts.width}"
  height="${opts.height}"
  frameborder="${opts.frameborder}"
  scrolling="${opts.scrolling}"
  style="border-radius:${opts.borderRadius};border:1px solid #e5e7eb;max-width:100%;"
  loading="lazy"
  title="${opts.slug} â€” RoughTools Embed"
></iframe>`;
}

export default function Page() {
  const [options, setOptions] = useState<EmbedOptions>({
    slug: "json-formatter",
    width: "100%",
    height: "500",
    frameborder: "0",
    scrolling: "auto",
    theme: "light",
    borderRadius: "12px",
  });
  const { copied, copy } = useClipboard(3000);

  const code = generateEmbedCode(options);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Embed Generator</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate an iframe embed code for any tool. Copy and paste into your
        website.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-5">
          <SelectInput
            label="Tool"
            options={TOOL_SLUGS.map((t) => ({ value: t.slug, label: t.label }))}
            value={options.slug}
            onChange={(e) => setOptions({ ...options, slug: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Width"
              value={options.width}
              onChange={(e) =>
                setOptions({ ...options, width: e.target.value })
              }
              placeholder="100%"
            />
            <TextInput
              label="Height"
              value={options.height}
              onChange={(e) =>
                setOptions({ ...options, height: e.target.value })
              }
              placeholder="500"
            />
          </div>
          <SelectInput
            label="Scrolling"
            options={[
              { value: "auto", label: "Auto" },
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
            value={options.scrolling}
            onChange={(e) =>
              setOptions({
                ...options,
                scrolling: e.target.value as "auto" | "no" | "yes",
              })
            }
          />
          <TextInput
            label="Border Radius"
            value={options.borderRadius}
            onChange={(e) =>
              setOptions({ ...options, borderRadius: e.target.value })
            }
            placeholder="12px"
            hint="CSS value â€” 0px for square corners"
          />

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Guidelines
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                Set{" "}
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  width=&quot;100%&quot;
                </code>{" "}
                for responsive embeds
              </li>
              <li>
                Use{" "}
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  loading=&quot;lazy&quot;
                </code>{" "}
                to defer loading
              </li>
              <li>
                Always include a{" "}
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  title
                </code>{" "}
                attribute for accessibility
              </li>
              <li>
                The embed page has{" "}
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  noindex, nofollow
                </code>{" "}
                â€” no SEO impact on your site
              </li>
            </ul>
          </div>
        </div>

        {/* Preview + Code */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Live Preview
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <iframe
                src={`${SITE_URL}/embed/tools/${options.slug}`}
                width="100%"
                height="400"
                style={{
                  border: "none",
                  display: "block",
                  borderRadius: options.borderRadius,
                }}
                title={`Embed preview: ${options.slug}`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Embed Code
              </p>
              <button
                onClick={() => copy(code)}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <pre className="bg-gray-950 text-gray-300 rounded-xl border border-gray-800 p-5 text-xs font-mono leading-relaxed overflow-x-auto">
              {escHtml(code)}
            </pre>
          </div>
        </div>
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


