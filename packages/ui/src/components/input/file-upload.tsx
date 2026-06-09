import { useCallback, useRef, useState, type DragEvent } from "react";
import { cn } from "../../utils/cn";

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  error?: string;
  onFiles: (files: File[]) => void;
  className?: string;
}

export function FileUpload({
  label,
  accept,
  maxSize = 10 * 1024 * 1024,
  multiple = false,
  error,
  onFiles,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const processFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const arr = Array.from(files);
      const valid = arr.filter((f) => {
        if (f.size > maxSize) return false;
        if (accept) {
          const types = accept.split(",").map((t) => t.trim());
          if (!types.some((t) => f.type === t || f.name.endsWith(t.replace("*.", "."))))
            return false;
        }
        return true;
      });
      setFileNames(valid.map((f) => f.name));
      onFiles(valid);
    },
    [accept, maxSize, onFiles],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const inputId = `file-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label.toLowerCase()}`}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          dragOver
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/10"
            : error
              ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
              : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-600",
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => processFiles(e.target.files)}
          aria-hidden="true"
        />
        <svg
          className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span>{" "}
          or drag and drop
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
          {accept ? `Accepted: ${accept}` : "Any file"} · Max {(maxSize / 1024 / 1024).toFixed(0)}MB
        </p>
        {fileNames.length > 0 && (
          <ul className="mt-3 text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
            {fileNames.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}