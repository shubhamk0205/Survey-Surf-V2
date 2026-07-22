import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** The editorial container — centered, max-width, gutter-padded (`.wrap`). */
export function Container({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("wrap", className)} {...props}>
      {children}
    </div>
  );
}

interface RowProps extends ComponentPropsWithoutRef<"div"> {
  /** Content for the reserved outer margin column. */
  margin?: ReactNode;
}

/**
 * The two-column editorial grid: reading matter on the left, a reserved
 * marginalia column on the right (which collapses under the content on
 * narrow viewports).
 */
export function Row({ margin, className, children, ...props }: RowProps) {
  return (
    <div className={cn("row", className)} {...props}>
      <div>{children}</div>
      <div className="margin-cell">{margin}</div>
    </div>
  );
}
