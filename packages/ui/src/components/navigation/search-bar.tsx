'use client'
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
  category?: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  results?: SearchResult[];
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  results = [],
  onSelect,
  placeholder = "Search tools...",
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Debounced search
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      setActiveIndex(-1);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (value.trim()) {
          onSearch(value.trim());
          setOpen(true);
        } else {
          setOpen(false);
        }
      }, 250);
    },
    [onSearch],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open || results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && results[activeIndex]) {
            onSelect?.(results[activeIndex]);
            setOpen(false);
            inputRef.current?.blur();
          }
          break;
        case "Escape":
          setOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [open, results, activeIndex, onSelect],
  );

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll('[role="option"]');
    items[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Search icon */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"
        aria-hidden="true"
      >
        <svg
          className="w-5 h-5 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>

      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls="search-results"
        aria-activedescendant={
          activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
        }
        aria-autocomplete="list"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          if (query.trim() && results.length > 0) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900",
          "pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-gray-100",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "transition-colors",
        )}
      />

      {/* Keyboard shortcut badge */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
        aria-hidden="true"
      >
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-1.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
          <span className="text-xs">âŒ˜</span>K
        </kbd>
      </div>

      {/* Results dropdown */}
      {open && results.length > 0 && (
        <ul
          id="search-results"
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg max-h-80 overflow-y-auto"
        >
          {results.map((result, i) => (
            <li
              key={result.id}
              id={`search-result-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={cn(
                "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
                i === activeIndex
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800",
              )}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => {
                onSelect?.(result);
                setOpen(false);
                inputRef.current?.blur();
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {result.title}
                </p>
                {result.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {result.description}
                  </p>
                )}
              </div>
              {result.category && (
                <span className="shrink-0 text-[10px] font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5">
                  {result.category}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No results found for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}


