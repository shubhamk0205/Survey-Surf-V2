"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

import { useElementSize } from "@/hooks/use-element-size";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export type PenVariant = "underline" | "circle" | "strike";

interface PenGeometry {
  viewBox: string;
  style: CSSProperties;
  d: string;
}

function underline(w: number): PenGeometry {
  return {
    viewBox: `0 0 ${w} 8`,
    style: { left: 0, bottom: -5, width: w, height: 8 },
    d: `M1 4.5 C ${w * 0.28} 1.8, ${w * 0.55} 6.6, ${w - 1} 3.2`,
  };
}

function strike(w: number): PenGeometry {
  return {
    viewBox: `0 0 ${w} 12`,
    style: { left: 0, top: "50%", marginTop: -6, width: w, height: 12 },
    d: `M1 7 C ${w * 0.3} 3.5, ${w * 0.62} 9.5, ${w - 1} 5`,
  };
}

function circle(w: number, h: number): PenGeometry {
  const px = 12;
  const py = 8;
  const vw = w + px * 2;
  const vh = h + py * 2;
  const cx = vw / 2;
  const cy = vh / 2;
  const rx = w / 2 + px * 0.72;
  const ry = h / 2 + py * 0.62;
  const steps = 42;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = -0.35 + (i / steps) * (Math.PI * 2 * 1.12);
    const wobble = 1 + 0.045 * Math.sin(t * 5 + 1.3);
    const x = cx + Math.cos(t) * rx * wobble;
    const y = cy + Math.sin(t) * ry * wobble;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return {
    viewBox: `0 0 ${vw} ${vh}`,
    style: { left: -px, top: -py, width: vw, height: vh },
    d,
  };
}

interface PenMarkProps {
  children: ReactNode;
  variant?: PenVariant;
  className?: string;
  /** Draw delay in seconds. */
  delay?: number;
}

/**
 * The editor's red pen. Measures the text it wraps, then draws an SVG stroke
 * (underline / circle / strike) over it — animated on scroll via pathLength.
 */
export function PenMark({
  children,
  variant = "underline",
  className,
  delay = 0.15,
}: PenMarkProps) {
  const { ref, width, height } = useElementSize<HTMLSpanElement>();
  const reduced = useReducedMotion();

  const variantClass =
    variant === "circle"
      ? "pen-circle"
      : variant === "strike"
        ? "pen-strike"
        : "pen-underline";

  const geometry =
    width < 4
      ? null
      : variant === "circle"
        ? circle(width, height)
        : variant === "strike"
          ? strike(width)
          : underline(width);

  return (
    <span ref={ref} className={cn(variantClass, className)}>
      {children}
      {geometry ? (
        <svg
          className="pen-svg"
          aria-hidden="true"
          viewBox={geometry.viewBox}
          preserveAspectRatio="none"
          style={geometry.style}
        >
          <motion.path
            d={geometry.d}
            initial={{ pathLength: reduced ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "0px 0px -6% 0px" }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.7, delay, ease: [0.4, 0, 0.3, 1] }
            }
          />
        </svg>
      ) : null}
    </span>
  );
}
