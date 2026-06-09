import { useTheme } from "../../providers/theme";
import { cn } from "../../utils/cn";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({
  className,
  showLabel = false,
}: ThemeToggleProps) {
  const { resolved, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg p-2 text-gray-500 dark:text-gray-400",
        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950",
        className,
      )}
      aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} mode`}
    >
      {resolved === "dark" ? (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {resolved === "dark" ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}

