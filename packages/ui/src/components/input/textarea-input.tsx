import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface TextareaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
}

export const TextareaInput = forwardRef<
  HTMLTextAreaElement,
  TextareaInputProps
>(
  (
    {
      label,
      error,
      hint,
      showCount,
      id,
      className,
      maxLength,
      value,
      ...props
    },
    ref,
  ) => {
    const textareaId =
      id ?? `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className={cn("space-y-1.5", className)}>
        <div className="flex items-center justify-between">
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {showCount && maxLength && (
            <span
              className={cn(
                "text-xs",
                charCount > maxLength * 0.9
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-400 dark:text-gray-500",
              )}
              aria-live="polite"
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            [
              error ? `${textareaId}-error` : null,
              hint ? `${textareaId}-hint` : null,
            ]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(
            "block w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors resize-y min-h-[100px]",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/10"
              : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500",
          )}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
            role="alert"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={`${textareaId}-hint`}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

TextareaInput.displayName = "TextareaInput";

