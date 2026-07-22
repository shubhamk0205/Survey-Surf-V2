"use client";

import { createElement, type ElementType, type HTMLAttributes } from "react";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  /** Element to render — keeps the reveal on the real node, no extra wrapper. */
  as?: ElementType;
  once?: boolean;
}

/**
 * Fades/slides content in as it scrolls into view. The animation itself is
 * defined in CSS (gated behind the `.js` class) so content is always visible
 * without JavaScript; this component only toggles the `is-in` state.
 */
export function Reveal({
  as = "div",
  once = true,
  className,
  children,
  ...props
}: RevealProps) {
  const { ref, inView } = useReveal<HTMLElement>({ once });
  return createElement(
    as,
    { ref, className: cn("reveal", inView && "is-in", className), ...props },
    children,
  );
}

/**
 * A sequenced-inking container: its child leader-rows stagger in via the
 * `.ink-seq` CSS rules once the group enters view.
 */
export function InkSequence({
  as = "div",
  className,
  children,
  ...props
}: RevealProps) {
  const { ref, inView } = useReveal<HTMLElement>();
  return createElement(
    as,
    { ref, className: cn("ink-seq", inView && "is-in", className), ...props },
    children,
  );
}
