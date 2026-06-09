import { useRecentTools } from "../../hooks/use-recent-tools";
import { EmptyState } from "../feedback/empty-state";
import { cn } from "../../utils/cn";

interface RecentToolsProps {
  className?: string;
}

export function RecentTools({ className }: RecentToolsProps) {
  const { recent, clearRecent } = useRecentTools();

  if (recent.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5",
          className,
        )}
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Recently Used
        </h3>
        <EmptyState
          title="No recent tools"
          description="Tools you use will appear here"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Recently Used
        </h3>
        <button
          onClick={clearRecent}
          className="text-xs text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:underline"
        >
          Clear
        </button>
      </div>
      <ul className="space-y-2" role="list">
        {recent.map((tool) => (
          <li key={tool.slug}>
            <a
              href={`/tools/${tool.slug}`}
              className="flex items-center gap-3 rounded-lg p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {tool.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {tool.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tool.category}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

