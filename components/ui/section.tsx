import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * A chapter: a full-bleed `<section>` with the standard chapter rhythm and a
 * centered container. The building block for every editorial chapter.
 */
export function Chapter({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("chapter", className)}>
      <Container>{children}</Container>
    </section>
  );
}
