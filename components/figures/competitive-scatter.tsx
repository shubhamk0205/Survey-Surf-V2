"use client";

import { motion } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

const YOU_CIRCLE =
  "M520 276 C 549 278, 559 292, 556 302 C 553 315, 534 325, 517 323 C 498 321, 484 311, 486 298 C 488 284, 502 275, 523 277";

/**
 * Competitive perception scatter — Wanted (↑) against Trusted (→). Static
 * plot with a hand-drawn red ring circling "You", drawn in on scroll.
 */
export function CompetitiveScatter() {
  const reduced = useReducedMotion();

  return (
    <div className="scatter-wrap">
      <svg className="scatter-svg" viewBox="0 0 640 420" aria-hidden="true">
        {/* grid */}
        <line className="grid-hair" x1="60" y1="90" x2="600" y2="90" />
        <line className="grid-hair" x1="60" y1="180" x2="600" y2="180" />
        <line className="grid-hair" x1="60" y1="270" x2="600" y2="270" />
        <line className="grid-hair" x1="195" y1="30" x2="195" y2="360" />
        <line className="grid-hair" x1="330" y1="30" x2="330" y2="360" />
        <line className="grid-hair" x1="465" y1="30" x2="465" y2="360" />
        {/* axes */}
        <line className="ax" x1="60" y1="30" x2="60" y2="360" />
        <line className="ax" x1="60" y1="360" x2="600" y2="360" />
        <path className="ax" d="M56 38 L60 30 L64 38" fill="none" />
        <path className="ax" d="M592 356 L600 360 L592 364" fill="none" />
        <text x="74" y="44">
          Wanted ↑
        </text>
        <text x="512" y="348">
          Trusted →
        </text>
        {/* points */}
        <circle className="pt" cx="300" cy="95" r="5" />
        <text className="pt-label" x="316" y="99">
          Rival A
        </text>
        <circle className="pt" cx="215" cy="265" r="5" />
        <text className="pt-label" x="231" y="269">
          Rival B
        </text>
        <rect className="pt" x="341" y="199" width="9" height="9" />
        <text className="pt-label" x="360" y="208">
          Category
        </text>
        <circle className="pt" cx="520" cy="300" r="5" />
        <text className="pt-label" x="478" y="336">
          You
        </text>
        <motion.path
          className="you-circle"
          d={YOU_CIRCLE}
          initial={{ pathLength: reduced ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.9, delay: 0.3, ease: "easeInOut" }
          }
        />
      </svg>
    </div>
  );
}
