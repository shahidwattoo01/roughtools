import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className={cn("space-y-1.5", className)}>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {props.required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            [error ? `${inputId}-error` : null, hint ? `${inputId}-hint` : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(
            "block w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-300 dark:border-red-700 text-red-900 dark:text-red-100 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/10"
              : "border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:ring-blue-500 focus:border-blue-500",
          )}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

