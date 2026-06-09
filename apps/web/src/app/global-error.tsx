"use client";
// apps/web/src/app/global-error.tsx
// Catches unhandled errors in the root layout

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          background: "#f9fafb",
          color: "#111827",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "2rem", maxWidth: "400px" }}>
          An unexpected error occurred. Our team has been notified and is
          working on a fix.
        </p>

        {/* Show error digest in production for support reference */}
        {error.digest && (
          <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "1.5rem" }}>
            Error ID: <code>{error.digest}</code>
          </p>
        )}

        <button
          onClick={reset}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}