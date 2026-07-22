"use client";

import { useEffect, useRef, useState } from "react";

import { MethodMorph } from "@/components/figures/method-morph";
import type { MethodStage } from "@/types";

/**
 * The sticky two-column scrollytelling body of "How It Works".
 *
 * LEFT  — one pinned visualization (the perception engine) that morphs through
 *         five states as the reader scrolls.
 * RIGHT — five reading blocks. The active block is the one whose centre sits
 *         nearest the viewport centre; that index drives the visualization.
 *
 * The active state is a pure function of scroll position, so scrolling back up
 * reverses the morph exactly. Reads are batched into a single rAF and state is
 * only committed when the index actually changes — no wasted renders, 60fps.
 */
export function MethodScrolly({ stages }: { stages: MethodStage[] }) {
  const [active, setActive] = useState(0);
  const blockRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < stages.length; i++) {
        const el = blockRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      setActive((prev) => (prev === best ? prev : best));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [stages.length]);

  return (
    <div className="ms-scrolly">
      <div className="ms-visual">
        <div className="ms-visual-inner">
          <MethodMorph active={active} />
        </div>
      </div>

      <ol className="ms-steps">
        {stages.map((stage, i) => (
          <li
            key={stage.no}
            ref={(el) => {
              blockRefs.current[i] = el;
            }}
            className="ms-block"
            data-active={active === i}
            aria-current={active === i ? "step" : undefined}
          >
            <div className="ms-block-inner">
              <div className="ms-folio">
                <span className="ms-no">{stage.no}</span>
                <span className="ms-label">{stage.label}</span>
              </div>
              <h3 className="h3 ms-heading">{stage.heading}</h3>
              <p className="body-copy ms-body">{stage.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
