import { useClipboard } from "../../hooks/use-clipboard";
import { cn } from "../../utils/cn";

interface CodeOutputProps {
  code: string;
  language?: string;
  label?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeOutput({
  code,
  language = "text",
  label,
  showLineNumbers = false,
  className,
}: CodeOutputProps) {
  const { copied, copy } = useClipboard();

  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-950 overflow-hidden",
        className,
      )}
      role="region"
      aria-label={label ?? "Code output"}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">{language}</span>
          {label && <span className="text-xs text-gray-500">— {label}</span>}
        </div>
        <button
          onClick={() => copy(code)}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
        >
          {copied ? (
            <>
              <svg
                className="w-3.5 h-3.5 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
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
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto p-4">
        <pre className="text-sm leading-relaxed">
          <code className="text-gray-300 font-mono">
            {showLineNumbers
              ? lines.map((line, i) => (
                  <div key={i} className="flex">
                    <span
                      className="inline-block w-10 shrink-0 text-right pr-4 text-gray-600 select-none"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span>{line || " "}</span>
                  </div>
                ))
              : code}
          </code>
        </pre>
      </div>
    </div>
  );
}

