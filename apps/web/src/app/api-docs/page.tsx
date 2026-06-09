"use client"
import { useState } from "react";
import { useClipboard } from "@workspace/ui";

const SITE_URL = "https://roughtools.com";
const API_BASE = `${SITE_URL}/api/v1`;

const ENDPOINTS = [
  {
    method: "GET" as const,
    path: "/tools",
    description: "List tools with pagination, search, and category filtering.",
    params: [
      { name: "page", type: "integer", required: false, default: "1" },
      { name: "per_page", type: "integer", required: false, default: "10" },
      { name: "search", type: "string", required: false },
      { name: "category", type: "uuid", required: false },
      {
        name: "status",
        type: "string",
        required: false,
        enum: "published | all",
      },
      {
        name: "sort_by",
        type: "string",
        required: false,
        enum: "createdAt | name | viewCount | likeCount",
      },
      {
        name: "sort_order",
        type: "string",
        required: false,
        enum: "asc | desc",
      },
    ],
    responseExample: `{
  "success": true,
  "data": [{ "id": "clx_abc", "name": "JSON Formatter", "slug": "json-formatter", ... }],
  "pagination": { "page": 1, "perPage": 10, "total": 200, "totalPages": 20, "hasNext": true, "hasPrev": false }
}`,
  },
  {
    method: "GET" as const,
    path: "/tools/{id}",
    description:
      "Get a single tool by ID or slug. Includes comments and tag details.",
    params: [{ name: "id", type: "string", required: true, in: "path" }],
    responseExample: `{
  "success": true,
  "data": { "id": "clx_abc", "name": "JSON Formatter", "description": "...", "category": { ... }, "author": { ... } }
}`,
  },
  {
    method: "GET" as const,
    path: "/categories",
    description: "List all categories with tool counts.",
    params: [],
    responseExample: `[{ "id": "cat_1", "name": "Development", "slug": "development", "_count": { "tools": 45 } }]`,
  },
  {
    method: "GET" as const,
    path: "/tags",
    description: "List all tags with their tool counts.",
    params: [
      { name: "page", type: "integer", required: false, default: "1" },
      { name: "per_page", type: "integer", required: false, default: "50" },
    ],
    responseExample: `{
  "success": true,
  "data": [{ "id": "tag_1", "name": "open-source", "slug": "open-source", "toolCount": 12 }],
  "pagination": { ... }
}`,
  },
  {
    method: "GET" as const,
    path: "/stats",
    description: "Platform-wide statistics.",
    params: [],
    responseExample: `{
  "success": true,
  "data": { "tools": 200, "posts": 25, "users": 50, "categories": 12, "tags": 30 }
}`,
  },
];

const methodColors = {
  GET: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
  POST: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
  PUT: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
  DELETE: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400",
};

export default function Page() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { copied, copy } = useClipboard(3000);

  const curlExample = `curl -s "${API_BASE}/tools?per_page=5&sort_by=viewCount" | python3 -m json.tool`;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">API Documentation</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Free, read-only public API. No authentication required. Rate limited
            to 60 req/min per IP.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => copy(curlExample)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {copied ? (
              "Copied!"
            ) : (
              <>
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
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612"
                  />
                </svg>{" "}
                Quick curl
              </>
            )}
          </button>
          <a
            href={`${SITE_URL}/api/docs/openapi.json`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            OpenAPI Spec
          </a>
        </div>
      </div>

      {/* Quick try */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-8">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
          Quick Try
        </p>
        <pre className="text-xs font-mono text-blue-900 dark:text-blue-200 leading-relaxed overflow-x-auto">
          {curlExample}
        </pre>
      </div>

      {/* Rate limit info */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <div className="text-sm text-amber-800 dark:text-amber-300">
            <p className="font-semibold">
              Rate Limit: 60 requests per minute per IP address.
            </p>
            <p className="mt-0.5 opacity-80">
              Exceeding returns{" "}
              <code className="text-xs bg-amber-100 dark:bg-amber-900/30 px-1 rounded">
                429 Too Many Requests
              </code>{" "}
              with a{" "}
              <code className="text-xs bg-amber-100 dark:bg-amber-900/30 px-1 rounded">
                retryAfter
              </code>{" "}
              header.
            </p>
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-4">
        {ENDPOINTS.map((ep, i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === `${i}` ? null : `${i}`)}
              className="w-full flex items-center gap-3 p-5 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer text-left"
            >
              <span
                className={`inline-flex items-center justify-center w-14 rounded-md py-1 text-[11px] font-bold ${methodColors[ep.method]}`}
              >
                {ep.method}
              </span>
              <code className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-100 flex-1">
                {ep.path}
              </code>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${expanded === `${i}` ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {expanded === `${i}` && (
              <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-800 pt-4 space-y-4 fade-in">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {ep.description}
                </p>

                {ep.params.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Parameters
                    </p>
                    <div className="space-y-1">
                      {ep.params.map((p, j) => (
                        <div
                          key={j}
                          className="flex items-center gap-3 text-sm"
                        >
                          <code className="text-blue-600 dark:text-blue-400 font-mono text-xs w-24 shrink-0">
                            {p.name}
                          </code>
                          <span className="text-gray-400 dark:text-gray-500 text-xs">
                            {p.type}
                            {p.required ? " *" : ""}
                          </span>
                          {p.default && (
                            <span className="text-gray-400 dark:text-gray-500 text-xs">
                              default: {p.default}
                            </span>
                          )}
                          {p.enum && (
                            <span className="text-gray-400 dark:text-gray-500 text-xs">
                              {p.enum}
                            </span>
                          )}
                          {p.in === "path" && (
                            <span className="text-gray-400 dark:text-gray-500 text-xs">
                              (path param)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Response Example
                    </p>
                    <button
                      onClick={() => copy(ep.responseExample)}
                      className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                    >
                      {copied && expanded === `${i}` ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre className="bg-gray-950 text-gray-300 rounded-lg p-4 text-[11px] font-mono leading-relaxed overflow-x-auto">
                    {ep.responseExample}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

