import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in",
        className,
      )}
    >
      {icon && (
        <div
          className="mb-4 text-[var(--text-muted)] w-12 h-12 flex items-center justify-center"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
