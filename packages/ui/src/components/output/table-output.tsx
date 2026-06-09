import { cn } from "../../utils/cn";

interface Column<T> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

interface TableOutputProps<T> {
  columns: Column<T>[];
  data: T[];
  caption?: string;
  emptyMessage?: string;
  className?: string;
}

export function TableOutput<T extends Record<string, unknown>>({
  columns,
  data,
  caption,
  emptyMessage = "No data to display",
  className,
}: TableOutputProps<T>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden",
        className,
      )}
      role="region"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-gray-700 dark:text-gray-300",
                        col.className,
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

