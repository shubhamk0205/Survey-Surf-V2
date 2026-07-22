"use client";

import { useEffect, useRef, useState } from "react";

interface Size {
  width: number;
  height: number;
}

/**
 * Observes an element's rendered size with ResizeObserver. Used by figures
 * whose geometry is measured from layout (the pen marks, the connector thread).
 */
export function useElementSize<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
    };

    measure();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, ...size };
}
