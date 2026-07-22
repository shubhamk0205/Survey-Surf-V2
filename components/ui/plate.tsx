import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** The figure plate — a ruled, tinted field that frames every figure. */
export function Plate({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("plate", className)} {...props}>
      {children}
    </div>
  );
}

/** The plate's header line — a title (often with a `<strong>`) and a ref. */
export function FigHead({
  left,
  right,
  className,
}: {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("fig-head", className)}>
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

/** The caption printed beneath a plate. */
export function PlateCaption({
  children,
  className,
  as: Comp = "figcaption",
}: {
  children: ReactNode;
  className?: string;
  as?: "figcaption" | "p";
}) {
  return <Comp className={cn("plate-cap", className)}>{children}</Comp>;
}
