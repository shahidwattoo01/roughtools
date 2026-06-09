import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "sans-serif"],
        body:    ["var(--font-sans)",    "ui-sans-serif", "sans-serif"],
        mono:    ["var(--font-mono)",    "ui-monospace",  "monospace"],
      },
      colors: {
        brand: {
          50:  "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7dc8fc",
          400: "#38aaf8",
          500: "#0e8ee9",
          600: "#026fc7",
          700: "#0358a1",
          800: "#074b85",
          900: "#0c3f6e",
          950: "#082849",
        },
        accent: {
          400: "#fb923c",
          500: "#f97316",
          600: "#ea6c0a",
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        brand: "0 4px 14px 0 rgb(2 111 199 / 0.25)",
        "brand-lg": "0 6px 20px 0 rgb(2 111 199 / 0.35)",
      },
      animation: {
        "fade-in":        "fade-in 0.4s ease forwards",
        "slide-up":       "slide-up 0.4s ease forwards",
        "scale-in":       "scale-in 0.2s ease forwards",
        "skeleton":       "skeleton-shimmer 1.5s infinite",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "skeleton-shimmer": {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
} satisfies Config;