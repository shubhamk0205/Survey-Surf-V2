"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

import { TL } from "@/components/figures/engine/engine-geometry";
import {
  activateStage,
  collectStage,
  engineMeta,
  synthesizeStage,
} from "@/lib/content";
import type { EngineStage } from "@/types";

const SEGMENTS = [
  { name: "Collect", start: 0, end: TL.cluster[0] },
  { name: "Synthesize", start: TL.cluster[0], end: TL.branch[0] },
  { name: "Activate", start: TL.branch[0], end: 1 },
];

/**
 * The engine's masthead: the figure reference, a three-segment phase indicator
 * that fills as the machine runs, and a live status lamp. Reads like the header
 * of a scientific instrument, not a product feature.
 */
export function EngineHeader({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="engine-head">
      <span className="engine-figref">{engineMeta.figLeft}</span>

      <div className="engine-phases" role="presentation">
        {SEGMENTS.map((seg) => (
          <Segment key={seg.name} progress={progress} seg={seg} />
        ))}
      </div>

      <span className="engine-status">
        <i className="engine-lamp" />
        {engineMeta.figRight}
      </span>
    </div>
  );
}

function Segment({
  progress,
  seg,
}: {
  progress: MotionValue<number>;
  seg: { name: string; start: number; end: number };
}) {
  const fill = useTransform(progress, [seg.start, seg.end], ["0%", "100%"]);
  const emphasis = useTransform(
    progress,
    [seg.start - 0.02, seg.start + 0.02, seg.end - 0.02, seg.end + 0.02],
    [0.42, 1, 1, 0.42],
  );
  return (
    <span className="engine-phase">
      <motion.span className="engine-phase-name" style={{ opacity: emphasis }}>
        {seg.name}
      </motion.span>
      <span className="engine-phase-track">
        <motion.span className="engine-phase-fill" style={{ width: fill }} />
      </span>
    </span>
  );
}

/* ---------------- footer apparatus — live readouts ---------------- */

const READOUT_WINDOWS: [number, number, number, number][] = [
  [-1, 0, 0.31, 0.37],
  [0.31, 0.37, 0.77, 0.83],
  [0.77, 0.83, 1, 2],
];
const READOUT_STAGES: EngineStage[] = [
  collectStage,
  synthesizeStage,
  activateStage,
];

/**
 * The readout bar. The method reference sits fixed on the left; on the right,
 * the active stage's three measurements cross-fade in — signals logged,
 * clusters held and confidence, then what the one perception traces to.
 */
export function EngineReadout({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="engine-readout">
      <span className="engine-method">{engineMeta.method}</span>
      <div className="engine-metrics">
        {READOUT_STAGES.map((stage, i) => (
          <MetricGroup
            key={stage.no}
            progress={progress}
            stage={stage}
            window={READOUT_WINDOWS[i]!}
          />
        ))}
      </div>
    </div>
  );
}

function MetricGroup({
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
  return (
    <motion.div className="engine-metric-group" style={{ opacity }}>
      {stage.readouts.map((r) => (
        <span className="engine-metric" key={r.label}>
          <b>{r.value}</b>
          <i>{r.label}</i>
        </span>
      ))}
    </motion.div>
  );
}
