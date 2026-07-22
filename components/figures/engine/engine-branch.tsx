"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

import {
  buildOutcomes,
  CORE,
  TL,
  type OutcomeNode,
} from "@/components/figures/engine/engine-geometry";

const OUTCOMES = buildOutcomes();

/**
 * STAGE 03 — the branch. From the single perception, threads draw outward to
 * the business surfaces it moves: positioning, messaging, campaign, pricing,
 * product and the rest. One insight expanding into many decisions — each thread
 * a line of causation back to the same core.
 */
export function OutcomeBranch({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="engine-branch" aria-hidden="true">
      <svg
        className="engine-threads"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        {OUTCOMES.map((node) => (
          <Thread key={node.ref} progress={progress} node={node} />
        ))}
      </svg>
      {OUTCOMES.map((node) => (
        <OutcomeMark key={node.ref} progress={progress} node={node} />
      ))}
    </div>
  );
}

function Thread({
  progress,
  node,
}: {
  progress: MotionValue<number>;
  node: OutcomeNode;
}) {
  const pathLength = useTransform(
    progress,
    [node.start - 0.02, node.start + 0.08],
    [0, 1],
  );
  const opacity = useTransform(
    progress,
    [node.start - 0.02, node.start + 0.02],
    [0, 1],
  );
  return (
    <motion.line
      x1={CORE.x * 1000}
      y1={CORE.y * 1000}
      x2={node.x * 1000}
      y2={node.y * 1000}
      className={"engine-thread" + (node.primary ? " is-primary" : "")}
      vectorEffect="non-scaling-stroke"
      style={{ pathLength, opacity }}
    />
  );
}

function OutcomeMark({
  progress,
  node,
}: {
  progress: MotionValue<number>;
  node: OutcomeNode;
}) {
  const opacity = useTransform(
    progress,
    [node.start + 0.03, node.start + 0.08],
    [0, 1],
  );
  const scale = useTransform(
    progress,
    [node.start + 0.03, node.start + 0.1],
    [0.7, 1],
  );
  return (
    <motion.span
      className={
        "engine-outcome" +
        (node.primary ? " is-primary" : "") +
        (node.side === "l" ? " is-left" : " is-right")
      }
      style={{
        left: `${node.x * 100}%`,
        top: `${node.y * 100}%`,
        opacity,
        scale,
      }}
    >
      <i className="engine-outcome-node" />
      <span className="engine-outcome-body">
        <b className="engine-outcome-label">{node.label}</b>
        <i className="engine-outcome-ref">{node.ref}</i>
      </span>
    </motion.span>
  );
}

/** Progress window over which the whole branch is active — used to hold the
 *  branch layer's presence and let the final readout land. */
export const BRANCH_WINDOW = TL.branch;
