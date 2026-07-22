"use client";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * A ruled divider. `double` is the signature two-line chapter rule;
 * `hair` is a single hairline. Spacing overrides come via `className`
 * (e.g. Tailwind `mb-0`), keeping the token defaults intact.
 *
 * `draw` (default true) makes the rule sweep itself in left→right the first
 * time it scrolls into view. The motion is CSS (`.rule-draw` gated behind the
 * `.js` class, cleared to full width by `.is-in`), so without JS or under
 * reduced-motion the divider is simply present at full width.
 */
export function Rule({
  variant = "double",
  draw = true,
  className,
}: {
  variant?: "double" | "hair";
  draw?: boolean;
  className?: string;
}) {
  const { ref, inView } = useReveal<HTMLDivElement>({
    rootMargin: "0px 0px -4% 0px",
  });
  return (
    <div
      ref={ref}
      className={cn(
        variant === "double" ? "rule-dbl" : "rule-hair",
        draw && "rule-draw",
        draw && inView && "is-in",
        className,
      )}
      aria-hidden="true"
    />
  );
}
