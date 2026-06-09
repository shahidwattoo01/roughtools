import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ResultCardProps {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

const variantStyles = {
  default: "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900",
  success:
    "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10",
  warning:
    "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10",
  error: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10",
};

export function ResultCard({
  title,
  children,
  actions,
  variant = "default",
  className,
}: ResultCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border shadow-sm overflow-hidden",
        variantStyles[variant],
        className,
      )}
      role="region"
      aria-label={title ?? "Results"}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-inherit">
          {title && (
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {title}
            </h3>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

