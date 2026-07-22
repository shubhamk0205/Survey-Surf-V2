import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** A reading link with the animated red pen underline. */
export function LinkPen({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("link-pen", className)}>
      {children}
    </Link>
  );
}
