"use client";
// apps/web/src/app/error.tsx
// Page-level error boundary
// Catches errors thrown inside any page component

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development; swap for your error-tracking service in production
    console.error("[Page Error]", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Oops — something went wrong
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", maxWidth: "400px" }}>
        This page encountered an error. We have been notified.
      </p>

      {error.digest && (
        <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "1.5rem" }}>
          Ref: <code>{error.digest}</code>
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            padding: "0.625rem 1.25rem",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            padding: "0.625rem 1.25rem",
            background: "#f3f4f6",
            color: "#374151",
            borderRadius: "0.375rem",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}