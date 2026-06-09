import { useFavorites } from "../../hooks/use-favorites";
import { cn } from "../../utils/cn";

interface FavoriteButtonProps {
  slug: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const iconSizeMap = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function FavoriteButton({
  slug,
  size = "md",
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggle, count } = useFavorites();
  const active = isFavorite(slug);

  return (
    <button
      onClick={() => toggle(slug)}
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-all",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950",
        active
          ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
        sizeMap[size],
        className,
      )}
      aria-label={
        active ? `Remove ${slug} from favorites` : `Add ${slug} to favorites`
      }
      aria-pressed={active}
      title={
        active ? `Favorited (${count} total)` : `Favorite (${count} total)`
      }
    >
      {active ? (
        <svg
          className={iconSizeMap[size]}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      ) : (
        <svg
          className={iconSizeMap[size]}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      )}
    </button>
  );
}

