/**
 * THE PERCEPTION ENGINE — shared geometry & timeline.
 *
 * One scroll progress value (0 → 1) is the engine's entire timeline. Both the
 * canvas particle field and the DOM/SVG overlays read their state from this
 * module, so the marks, the labels, the threads and the readouts are always
 * describing the same instant of the same machine. Nothing here is visual —
 * only the maths of *when* each thing happens and *where* each thing sits.
 */
import { synthClusters, engineOutcomes, intakeSources } from "@/lib/content";

/* ---------- easing / interpolation primitives ---------- */
export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
/** Normalised progress of `t` across the window [a, b], clamped 0–1. */
export function seg(t: number, a: number, b: number): number {
  return clamp01((t - a) / (b - a));
}
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
/** Smooth in/out cubic — the "gravity" easing the whole engine moves with. */
export function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ---------- THE TIMELINE ----------
   Every phase is a window on the single 0–1 scroll progress. Read top to
   bottom, this is the whole story: opinions arrive → organise → collapse to
   one → branch into decisions. Holds between moves let each state be read. */
export const TL = {
  collectIn: [0.0, 0.26], // scattered opinions rain in, source by source
  noiseHold: [0.26, 0.34], // the full, noisy field — nothing connected yet
  cluster: [0.34, 0.5], // noise migrates into four themes; duplicates dissolve
  clusterHold: [0.5, 0.57], // four labelled clusters, holding
  converge: [0.57, 0.72], // clusters fall inward onto one perception
  coreHold: [0.72, 0.8], // the single perception, alone — let it land
  branch: [0.8, 1.0], // the perception expands into business decisions
} as const;

/** The three chapters of the engine, for the phase indicator & narration. */
export type Phase = 0 | 1 | 2;
export function phaseAt(p: number): Phase {
  if (p < TL.cluster[0]) return 0; // Collect
  if (p < TL.branch[0]) return 1; // Synthesize
  return 2; // Activate
}

/* ---------- the particle field ---------- */
export const MARK_ALPHA = 0.62;
/** Field inset (fraction) so marks and cluster centres stay off the edge. */
export const PAD = 0.045;

export interface Particle {
  ox0: number; // entry origin x — the column under this mark's source
  oy0: number; // entry origin y — off the top edge
  nx: number; // scattered "noise" position
  ny: number;
  ci: number; // owning cluster index
  cx: number; // cluster-disc target
  cy: number;
  coreX: number; // convergence target — a tight jitter around the core
  coreY: number;
  enter: number; // 0–1 stagger: when this mark rains in during collect
  noise: boolean; // a duplicate/noise mark that dissolves during clustering
  signal: boolean; // belongs to the emergent (red) signal cluster
  sourceIdx: number; // which listening source it entered from
}

/** The core — the one perception — sits dead centre of the field. */
export const CORE = { x: 0.5, y: 0.5 };

export function signalClusterIndex(): number {
  return synthClusters.findIndex((c) => c.signal);
}

/** Horizontal centre (0–1, padded) of a source's column along the top rail. */
export function sourceColumnX(idx: number, total: number): number {
  const frac = (idx + 0.5) / total;
  return PAD + frac * (1 - PAD * 2);
}

/**
 * Build the point field once. Positions are 0–1 in field space. A seeded,
 * index-based pseudo-random keeps SSR and client deterministic (no Math.random
 * in render paths that must match) — but this only ever runs on the client
 * inside the canvas effect, so plain Math.random is acceptable and varied.
 */
export function buildField(count: number): Particle[] {
  const sig = signalClusterIndex();
  const weights = synthClusters.map((c) => Number(c.count.replace(/,/g, "")));
  const total = weights.reduce((a, b) => a + b, 0);

  const srcCount = intakeSources.length;
  const parts: Particle[] = [];
  let made = 0;
  for (let c = 0; c < synthClusters.length; c++) {
    const isLast = c === synthClusters.length - 1;
    const share = isLast
      ? count - made
      : Math.round((weights[c]! / total) * count);
    const cluster = synthClusters[c]!;
    for (let k = 0; k < share && made < count; k++, made++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.pow(Math.random(), 0.7) * 0.1;
      // Each mark pours in from under the column of one listening source.
      const sourceIdx = made % srcCount;
      const colJitter = (Math.random() - 0.5) * (0.7 / srcCount);
      parts.push({
        sourceIdx,
        ox0: clamp01(sourceColumnX(sourceIdx, srcCount) + colJitter),
        oy0: -0.12 - Math.random() * 0.28,
        nx: PAD + Math.random() * (1 - PAD * 2),
        ny: PAD + Math.random() * (1 - PAD * 2),
        ci: c,
        cx: clamp01(cluster.x + Math.cos(ang) * rad),
        cy: clamp01(cluster.y + Math.sin(ang) * rad * 1.05),
        coreX: CORE.x + (Math.random() - 0.5) * 0.035,
        coreY: CORE.y + (Math.random() - 0.5) * 0.035,
        enter: Math.random(),
        // ~34% of marks are duplicates that collapse as themes form
        noise: Math.random() < 0.34,
        signal: c === sig,
      });
    }
  }
  return parts;
}

export interface Sampled {
  x: number;
  y: number;
  a: number;
}

/**
 * Where a single mark sits, and how visible it is, at scroll progress `p`.
 * This is the heart of the engine: collect (rain in) → hold → cluster
 * (+ duplicate dissolve) → hold → converge onto the core (+ fade into it).
 */
export function sample(p: number, P: Particle): Sampled {
  // COLLECT — rain in from the top edge to a scattered position, staggered.
  if (p < TL.collectIn[1]) {
    const local = seg(p, TL.collectIn[0], TL.collectIn[1]);
    const app = seg(local, P.enter * 0.82, P.enter * 0.82 + 0.16);
    const e = ease(app);
    return {
      x: lerp(P.ox0, P.nx, e),
      y: lerp(P.oy0, P.ny, e),
      a: MARK_ALPHA * app,
    };
  }
  // NOISE HOLD — the full scattered field.
  if (p < TL.cluster[0]) return { x: P.nx, y: P.ny, a: MARK_ALPHA };

  // CLUSTER — migrate to theme discs; duplicates fade out.
  if (p < TL.cluster[1]) {
    const t = ease(seg(p, TL.cluster[0], TL.cluster[1]));
    const drop = P.noise
      ? 1 - seg(p, lerp(TL.cluster[0], TL.cluster[1], 0.4), TL.cluster[1])
      : 1;
    return {
      x: lerp(P.nx, P.cx, t),
      y: lerp(P.ny, P.cy, t),
      a: MARK_ALPHA * drop,
    };
  }
  // CLUSTER HOLD — four themes, holding.
  if (p < TL.converge[0])
    return { x: P.cx, y: P.cy, a: P.noise ? 0 : MARK_ALPHA };

  // CONVERGE — themes fall onto the core; marks dim as they merge into it.
  if (p < TL.converge[1]) {
    if (P.noise) return { x: P.cx, y: P.cy, a: 0 };
    const t = ease(seg(p, TL.converge[0], TL.converge[1]));
    return {
      x: lerp(P.cx, P.coreX, t),
      y: lerp(P.cy, P.coreY, t),
      a: lerp(MARK_ALPHA, 0.05, t),
    };
  }
  // CORE HOLD + BRANCH — the marks are the perception now; a faint core cloud.
  return { x: P.coreX, y: P.coreY, a: P.noise ? 0 : 0.05 };
}

/** Opacity of the cluster→core "gravity" threads (drawn on the canvas). */
export function convergeThreadOpacity(p: number): number {
  return (
    seg(p, TL.converge[0], TL.converge[0] + 0.05) *
    (1 - seg(p, TL.converge[1] - 0.03, TL.converge[1]))
  );
}

/** How grown / present the single red core node is (0–1). */
export function coreStrength(p: number): number {
  if (p < TL.converge[0] + 0.03) return 0;
  return ease(seg(p, TL.converge[0] + 0.03, TL.converge[1]));
}

/* ---------- STAGE 03 · the outcome branch ---------- */
export interface OutcomeNode {
  label: string;
  ref: string;
  primary?: boolean;
  x: number; // 0–1 field position
  y: number;
  /** Which side the label reads toward — for text anchoring. */
  side: "l" | "r";
  /** Per-node window start on the branch phase (0–1 progress). */
  start: number;
}

/**
 * Place the outcome nodes on an ellipse around the core so the single
 * perception visibly expands into many decisions. Angles are biased away from
 * the vertical poles to keep the labels legible, and each node is given a
 * staggered reveal window across the branch phase.
 */
export function buildOutcomes(): OutcomeNode[] {
  const K = engineOutcomes.length;
  const rx = 0.4;
  const ry = 0.42;
  return engineOutcomes.map((o, k) => {
    // Distribute over the circle starting just past top, skipping exact poles.
    const frac = (k + 0.5) / K;
    const ang = -Math.PI / 2 + frac * Math.PI * 2;
    const x = CORE.x + Math.cos(ang) * rx;
    const y = CORE.y + Math.sin(ang) * ry;
    return {
      label: o.label,
      ref: o.ref,
      primary: o.primary,
      x,
      y,
      side: x < 0.5 ? "l" : "r",
      start: lerp(TL.branch[0] + 0.02, TL.branch[1] - 0.06, k / (K - 1)),
    };
  });
}
