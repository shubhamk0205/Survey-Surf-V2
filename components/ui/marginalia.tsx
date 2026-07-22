"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

/**
 * Red italic margin note. Reveals on scroll by default — set `reveal={false}`
 * for notes that live inside already-visible containers.
 */
export function Marginalia({
  children,
  className,
  reveal = true,
}: {
  children: ReactNode;
  className?: string;
  reveal?: boolean;
}) {
  if (reveal) {
    return (
      <Reveal as="p" className={cn("marginalia", className)}>
        {children}
      </Reveal>
    );
  }
  return <p className={cn("marginalia", className)}>{children}</p>;
}
