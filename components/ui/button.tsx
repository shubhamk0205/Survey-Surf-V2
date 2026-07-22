import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * "Slip" — the subscription-slip button/link. `tone="ink"` inverts it for use
 * on dark fields; `size="small"` is the compact masthead variant.
 * Exported cva so client forms can style a native submit button identically.
 */
export const slipVariants = cva("slip", {
  variants: {
    tone: { default: "", ink: "slip--ink" },
    size: { default: "", small: "slip--small" },
  },
  defaultVariants: { tone: "default", size: "default" },
});

interface SlipProps extends VariantProps<typeof slipVariants> {
  /** When present, renders a Next.js Link; otherwise a <button>. */
  href?: string;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
}

export function Slip({
  href,
  tone,
  size,
  className,
  children,
  type = "button",
  disabled,
  ...rest
}: SlipProps) {
  const classes = cn(slipVariants({ tone, size }), className);

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  );
}
