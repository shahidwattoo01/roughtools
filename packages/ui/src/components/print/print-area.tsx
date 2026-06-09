import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface PrintAreaProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function PrintArea({ children, title, className }: PrintAreaProps) {
  return (
    <div className={cn("print-area", className)} data-print-title={title}>
      {children}
    </div>
  );
}

/**
 * Trigger the browser print dialog.
 * Call this from a button's onClick handler.
 */
export function triggerPrint() {
  window.print();
}

