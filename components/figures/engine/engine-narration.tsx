"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

import { activateStage, collectStage, synthesizeStage } from "@/lib/content";
import type { EngineStage } from "@/types";

/** Fade windows on the scroll timeline — one per stage, with soft handoffs. */
const WINDOWS: [number, number, number, number][] = [
  [-1, 0, 0.31, 0.37], // Collect
  [0.31, 0.37, 0.77, 0.83], // Synthesize
  [0.77, 0.83, 1, 2], // Activate
];

const STAGES: EngineStage[] = [collectStage, synthesizeStage, activateStage];

/**
 * The supporting copy. Each stage's heading and body cross-fade in the same
 * fixed zone as the engine passes through its window — so the words describe
 * exactly what the field is doing, without ever competing with it for space.
 * All three remain in the DOM, in order, for assistive tech and no-JS readers.
 */
export function EngineNarration({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="engine-narration">
      {STAGES.map((stage, i) => (
        <Say key={stage.no} progress={progress} stage={stage} window={WINDOWS[i]!} />
      ))}
    </div>
  );
}

function Say({
  progress,
  stage,
  window,
}: {
  progress: MotionValue<number>;
  stage: EngineStage;
  window: [number, number, number, number];
}) {
  const [a, b, c, d] = window;
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b, c, d], [10, 0, 0, -10]);
  return (
    <motion.div className="engine-say" style={{ opacity, y }}>
      <p className="engine-say-folio">
        <span className="engine-say-no">{stage.no}</span>
        <span className="engine-say-name">{stage.name}</span>
        <span className="engine-say-verb">{stage.verb}</span>
      </p>
      <h3 className="h3 engine-say-h">{stage.heading}</h3>
      <p className="engine-say-body">{stage.body}</p>
    </motion.div>
  );
}
