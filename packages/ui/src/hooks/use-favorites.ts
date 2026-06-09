import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "toolverse-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  }, [favorites, loaded]);

  const toggle = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favorites.has(slug),
    [favorites],
  );

  const count = favorites.size;

  return { favorites: Array.from(favorites), isFavorite, toggle, count };
}
