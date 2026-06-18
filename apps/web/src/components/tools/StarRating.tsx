'use client';

import { useState, useEffect } from 'react';

interface StarRatingProps {
  toolSlug: string;
}

export default function StarRating({ toolSlug }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [comment, setComment] = useState('');
  const storageKey = `rating_${toolSlug}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setSelected(Number(saved));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const handleSelect = (star: number) => {
    setSelected(star);
    try {
      localStorage.setItem(storageKey, String(star));
    } catch {
      /* ignore */
    }
  };

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="mt-10 p-5 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-700 text-center">
        <p className="text-green-700 dark:text-green-300 font-semibold">
          Thank you for your feedback! ⭐
        </p>
      </div>
    );
  }

  const existingRating = selected !== null ? selected : null;

  if (existingRating !== null) {
    return (
      <div className="mt-10 p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-700 text-center">
        <p className="text-yellow-700 dark:text-yellow-300 font-medium text-sm">
          You rated this {existingRating}/5 ⭐
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Rate this tool</p>

      <div className="flex justify-center gap-1 mb-3" onMouseLeave={() => setHovered(null)}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = (hovered ?? 0) >= star || (hovered === null && (selected ?? 0) >= star);
          return (
            <button
              key={star}
              onClick={() => handleSelect(star)}
              onMouseEnter={() => setHovered(star)}
              aria-label={`Rate ${star} out of 5`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
            >
              <svg viewBox="0 0 24 24" width="32" height="32" className="transition-colors">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={filled ? '#FBBF24' : 'none'}
                  stroke={filled ? '#FBBF24' : '#D1D5DB'}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-3 space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional: share a quick comment..."
            rows={2}
            className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold text-sm rounded-lg transition-colors"
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}
