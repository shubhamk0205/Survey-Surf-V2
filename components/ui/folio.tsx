import { cn } from "@/lib/utils";
import type { Folio as FolioType } from "@/types";

/** The chapter line: issue reference (left), page number (right). */
export function Folio({
  left,
  right,
  className,
}: FolioType & { className?: string }) {
  return (
    <div className={cn("folio", className)}>
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}
