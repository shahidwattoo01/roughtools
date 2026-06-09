import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "toolverse-recent-tools";
const MAX_ITEMS = 10;

export interface RecentTool {
  slug: string;
  name: string;
  category: string;
  visitedAt: string; // ISO
}

export function useRecentTools() {
  const [recent, setRecent] = useState<RecentTool[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  // Persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  }, [recent]);

  const addRecent = useCallback((tool: Omit<RecentTool, "visitedAt">) => {
    setRecent((prev) => {
      // Remove existing entry for this tool
      const filtered = prev.filter((t) => t.slug !== tool.slug);
      // Add to front
      return [
        { ...tool, visitedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, MAX_ITEMS);
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
  }, []);

  return { recent, addRecent, clearRecent };
}
