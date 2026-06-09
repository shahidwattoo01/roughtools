import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ToolLayoutProps {
  /** Tool name shown in the header */
  name: string;
  /** Category badge text */
  category: string;
  /** Optional description below the header */
  description?: string;
  /** Breadcrumb items rendered above the tool */
  breadcrumbs?: { label: string; href?: string }[];
  /** The main tool input area */
  input: ReactNode;
  /** The tool output / results area */
  output: ReactNode;
  /** Sidebar: related tools, favorites, etc. */
  sidebar?: ReactNode;
  /** Extra actions in the header (share, print, etc.) */
  actions?: ReactNode;
  /** Loading state — shows skeleton */
  loading?: boolean;
  /** Error state */
  error?: string | null;
  className?: string;
}

export function ToolLayout({
  name,
  category,
  description,
  breadcrumbs,
  input,
  output,
  sidebar,
  actions,
  loading = false,
  error = null,
  className,
}: ToolLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100",
        className,
      )}
    >
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-3">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                {breadcrumbs.map((crumb, i) => (
                  <li key={i} className="flex items-center gap-1">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="text-gray-300 dark:text-gray-600"
                      >
                        /
                      </span>
                    )}
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span
                        aria-current="page"
                        className="font-medium text-gray-700 dark:text-gray-200"
                      >
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2.5 py-0.5">
                  {category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {name}
              </h1>
              {description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl text-sm sm:text-base">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2 shrink-0">{actions}</div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        id="main-content"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
        tabIndex={-1}
      >
        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center"
          >
            <p className="text-red-700 dark:text-red-300 font-semibold">
              Something went wrong
            </p>
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {error}
            </p>
          </div>
        ) : loading ? (
          <div className="space-y-6">
            <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-96 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input + Output (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              <section aria-labelledby="tool-input-heading">
                <h2 id="tool-input-heading" className="sr-only">
                  Input
                </h2>
                {input}
              </section>
              <section aria-labelledby="tool-output-heading">
                <h2 id="tool-output-heading" className="sr-only">
                  Results
                </h2>
                {output}
              </section>
            </div>

            {/* Sidebar (1/3 width) */}
            {sidebar && (
              <aside className="lg:col-span-1" aria-label="Tool sidebar">
                <div className="sticky top-8 space-y-6">{sidebar}</div>
              </aside>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

