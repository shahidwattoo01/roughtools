import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectInputProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, options, placeholder, error, id, className, ...props }, ref) => {
    const selectId = id ?? `select-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className={cn("space-y-1.5", className)}>
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {props.required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cn(
            "block w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/10"
              : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500",
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={`${selectId}-error`}
            role="alert"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

SelectInput.displayName = "SelectInput";

