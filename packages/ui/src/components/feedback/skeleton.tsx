import { cn } from "../../utils/cn";

interface SkeletonProps {
  className?: string;
  lines?: number;
  circle?: boolean;
}

export function Skeleton({ className, lines = 1, circle }: SkeletonProps) {
  if (circle) {
    return (
      <div
        className={cn("skeleton skeleton-avatar", className)}
        aria-hidden="true"
      />
    );
  }

  if (lines === 1) {
    return (
      <div
        className={cn("skeleton skeleton-text", className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "skeleton skeleton-text",
            i === lines - 1 && "w-3/4",
            className,
          )}
        />
      ))}
    </div>
  );
}

export function ToolCardSkeleton() {
  return (
    <div
      className="card card-body space-y-4"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <Skeleton circle className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton lines={3} />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function ToolGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid-tools"
      aria-label="Loading tools"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ToolLayoutSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading tool" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
