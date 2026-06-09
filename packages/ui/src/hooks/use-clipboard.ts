'use client'
import { useCallback, useState } from "react";

interface UseClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
}

export function useClipboard(resetDelay: number = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch {
        // Fallback for older browsers / insecure contexts
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          setCopied(true);
          setTimeout(() => setCopied(false), resetDelay);
          return true;
        } catch {
          return false;
        }
      }
    },
    [resetDelay],
  );

  return { copied, copy };
}
