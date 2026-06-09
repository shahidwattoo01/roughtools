import { cn } from "../../utils/cn";

interface SkipLinkProps {
  targetId?: string;
  className?: string;
}

/**
 * Accessible skip link — first focusable element on the page.
 * Allows keyboard users to jump past navigation to main content.
 */
export function SkipLink({
  targetId = "main-content",
  className,
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]",
        "focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white",
        "focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400",
        className,
      )}
    >
      Skip to main content
    </a>
  );
}

