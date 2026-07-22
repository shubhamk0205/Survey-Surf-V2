"use client";

import { useEffect, useRef, useState } from "react";

interface UseRevealOptions {
  /** Reveal only once (default) or toggle as the element enters/leaves. */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/**
 * IntersectionObserver-based reveal. Returns a ref to attach and whether the
 * element is in view. Degrades to "visible" when IntersectionObserver is
 * unavailable, so content is never trapped behind a missing API.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  once = true,
  rootMargin = "0px 0px -6% 0px",
  threshold = 0.05,
}: UseRevealOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
