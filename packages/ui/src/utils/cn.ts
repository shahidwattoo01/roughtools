/**
 * Minimal class name merger.
 * Replace with `clsx` + `tailwind-merge` if you prefer.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
