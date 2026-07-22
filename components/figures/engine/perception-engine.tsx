"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ClusterLabels,
  PerceptionCore,
  SourceRail,
} from "@/components/figures/engine/engine-annotations";
import {
  EngineHeader,
  EngineReadout,
} from "@/components/figures/engine/engine-apparatus";
import { OutcomeBranch } from "@/components/figures/engine/engine-branch";
import { EngineField } from "@/components/figures/engine/engine-field";
import { EngineNarration } from "@/components/figures/engine/engine-narration";
import { EngineStatic } from "@/components/figures/engine/engine-static";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { engineMeta } from "@/lib/content";

/** Mark density by viewport — enough to read as "thousands", light enough for
 *  60fps on the smallest phones. Only ever evaluated client-side. */
function markCount(): number {
  if (typeof window === "undefined") return 660;
  const w = window.innerWidth;
  if (w < 700) return 340;
  if (w < 1100) return 480;
  return 680;
}

/**
 * THE PERCEPTION ENGINE.
 *
 * One continuous machine, run by the scroll. A tall track pins a single field
 * to the viewport; as the reader scrolls, `scrollYProgress` (0→1) is the
 * engine's whole timeline — opinions pour in and scatter, organise into themes,
 * collapse onto one defensible perception, then branch into the business
 * decisions it moves. The copy cross-fades alongside, always describing what
 * the field is doing. Reduced-motion and no-JS readers get the complete static
 * still instead (rendered on the server, so the story is never hidden).
 */
export function PerceptionEngine() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const count = useMemo(() => markCount(), []);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // SSR + first client render (and reduced-motion) show the static still, so
  // hydration matches and the content is always present.
  if (!mounted || reduced) return <EngineStatic />;

  return (
    <div className="engine-scroll" ref={scrollRef}>
      <div className="engine-pin">
        <div className="engine-frame">
          <EngineHeader progress={scrollYProgress} />

          <div className="engine-body">
            <div className="engine-narration-col">
              <EngineNarration progress={scrollYProgress} />
              <motion.p className="engine-hint" style={{ opacity: hintOpacity }}>
                <span className="engine-hint-rule" />
                {engineMeta.scrollHint}
              </motion.p>
            </div>

            <EngineField progress={scrollYProgress} count={count}>
              <OutcomeBranch progress={scrollYProgress} />
              <SourceRail progress={scrollYProgress} />
              <ClusterLabels progress={scrollYProgress} />
              <PerceptionCore progress={scrollYProgress} />
            </EngineField>
          </div>

          <EngineReadout progress={scrollYProgress} />
        </div>
      </div>
    </div>
  );
}
