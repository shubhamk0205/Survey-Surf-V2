"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

import { TL } from "@/components/figures/engine/engine-geometry";
import { intakeSources, synthClusters, synthReadout } from "@/lib/content";

/**
 * The listening sources, printed as a labelled axis along the top of the field.
 * Marks pour in beneath each. As the engine collects, the columns light up in
 * turn — "reading now" — then the rail recedes once synthesis begins.
 */
export function SourceRail({ progress }: { progress: MotionValue<number> }) {
  // Fade the whole rail in as collection starts, out as clustering begins.
  const railOpacity = useTransform(
    progress,
    [0, 0.03, TL.cluster[0], TL.cluster[0] + 0.06],
    [0, 1, 1, 0.16],
  );
  const total = intakeSources.length;

  return (
    <motion.div
      className="engine-sources"
      style={{ opacity: railOpacity }}
      aria-hidden="true"
    >
      {intakeSources.map((source, i) => (
        <SourceTick key={source.code} progress={progress} index={i} total={total}>
          {source.name}
        </SourceTick>
      ))}
    </motion.div>
  );
}

function SourceTick({
  progress,
  index,
  total,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  children: string;
}) {
  // Each column lights once collection sweeps past it, and stays read.
  const at = TL.collectIn[0] + (index / total) * (TL.collectIn[1] - TL.collectIn[0]);
  const lit = useTransform(
    progress,
    [at - 0.01, at + 0.02, at + 0.05],
    [0.34, 1, 0.6],
  );
  const dot = useTransform(progress, [at - 0.01, at + 0.015], [0, 1]);
  return (
    <span
      className="engine-source"
      style={{ left: `${((index + 0.5) / total) * 100}%` }}
    >
      <motion.i className="engine-source-dot" style={{ opacity: dot }} />
      <motion.span className="engine-source-name" style={{ opacity: lit }}>
        {children}
      </motion.span>
    </span>
  );
}

/**
 * The four themes the noise resolves into, labelled at their cluster centres.
 * They ink in as the clusters form and fade as everything falls to the core.
 */
export function ClusterLabels({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="engine-clusters" aria-hidden="true">
      {synthClusters.map((cluster) => (
        <ClusterLabel key={cluster.label} progress={progress} cluster={cluster} />
      ))}
    </div>
  );
}

function ClusterLabel({
  progress,
  cluster,
}: {
  progress: MotionValue<number>;
  cluster: (typeof synthClusters)[number];
}) {
  const opacity = useTransform(
    progress,
    [
      TL.cluster[0] + 0.05,
      TL.clusterHold[0],
      TL.converge[0] + 0.02,
      TL.converge[0] + 0.09,
    ],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [TL.cluster[0] + 0.05, TL.clusterHold[0]],
    [6, 0],
  );
  return (
    <motion.span
      className={"engine-cluster" + (cluster.signal ? " is-signal" : "")}
      style={{
        left: `${cluster.x * 100}%`,
        top: `${cluster.y * 100}%`,
        opacity,
        y,
      }}
    >
      <b>{cluster.label}</b>
      <i>{cluster.count}</i>
    </motion.span>
  );
}

/**
 * The one perception — the label that lands on the single red core. It arrives
 * as the clusters finish converging and holds through the branch, because every
 * decision that follows traces back to it.
 */
export function PerceptionCore({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(
    progress,
    [TL.converge[1] - 0.06, TL.converge[1], 0.99, 1],
    [0, 1, 1, 1],
  );
  const scale = useTransform(
    progress,
    [TL.converge[1] - 0.06, TL.coreHold[0]],
    [0.9, 1],
  );
  return (
    <motion.div className="engine-core-label" style={{ opacity, scale }} aria-hidden="true">
      <span className="engine-core-kicker">1 perception</span>
      <span className="engine-core-read">{synthReadout.blindSpot}</span>
    </motion.div>
  );
}
