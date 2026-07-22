"use client";

import type { CSSProperties } from "react";

import { useReveal } from "@/hooks/use-reveal";
import { gap } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * FIG. 01 — PERCEPTION DEVIATION. A levelling run, not a chart.
 *
 * Five attributes. On the left, the word the company uses for itself; on the
 * right, the word the market actually lands on. A hairline runs in from each
 * side but they never meet — the empty span between them, ruled in the
 * editor's red, IS the gap. A faint calibration axis drops through the centre
 * of every gap; a single red verdict reads the mean deviation. Belief and
 * reality are set in ink; red is spent only on the measured distance and the
 * verdict — the section's one finding.
 *
 * The entrance is choreographed in CSS (gated behind the `.js` class, exactly
 * like the rest of the paper's reveal system): the axis calibrates, the
 * belief words ink in and their lines extend toward centre, the instrument
 * settles, the market answers from the right, the red measurements are struck,
 * the verdict lands, then the bridge. Deliberate and measured. Content is fully
 * visible without JavaScript, and the paper's reduced-motion contract stills it.
 */
export function GapInstrument() {
  const { ref, inView } = useReveal<HTMLElement>({
    rootMargin: "0px 0px -12% 0px",
  });
  const g = gap.instrument;

  // Visual gap width as a share of the measurement track, from the 0–100
  // deviation. Symmetric about the centre axis, so a smaller reading closes
  // the two hairlines toward a near-touch and a larger one pulls them apart.
  const rows = g.rows.map((r) => {
    const gapPct = Math.round(r.dev * 0.72 * 10) / 10;
    const sidePct = (100 - gapPct) / 2;
    return { ...r, gapPct, sidePct };
  });

  return (
    <figure
      ref={ref}
      className={cn("gi", inView && "is-in")}
      aria-label="Perception deviation — a levelling run"
    >
      <div className="gi-head">
        <span className="gi-head-l app">{g.figLabel}</span>
        <span className="gi-head-r app">{g.methodLabel}</span>
      </div>

      <div className="gi-labels">
        <span className="gi-label gi-label--l app">{g.leftLabel}</span>
        <span className="gi-label gi-label--axis app">{g.axisLabel}</span>
        <span className="gi-label gi-label--r app">{g.rightLabel}</span>
      </div>

      <div className="gi-rows">
        <span className="gi-axis" aria-hidden="true" />

        {rows.map((r, i) => (
          <div
            className="gi-row"
            key={r.belief}
            style={{ "--i": i } as CSSProperties}
          >
            <span className="gi-belief">{r.belief}</span>

            <div className="gi-track">
              <span
                className="gi-line gi-line--belief"
                aria-hidden="true"
                style={{ width: `${r.sidePct}%` }}
              />
              <span
                className="gi-line gi-line--reality"
                aria-hidden="true"
                style={{ width: `${r.sidePct}%` }}
              />
              <span
                className="gi-measure"
                aria-hidden="true"
                style={{ left: `${r.sidePct}%`, width: `${r.gapPct}%` }}
              />
              <span
                className="gi-dev app"
                style={{ left: `${r.sidePct}%`, width: `${r.gapPct}%` }}
              >
                {r.dev}
              </span>
            </div>

            <span className="gi-reality">{r.reality}</span>
          </div>
        ))}
      </div>

      <div className="gi-verdict">
        <span className="gi-verdict-mark" aria-hidden="true" />
        <span className="gi-verdict-lead app">{g.indicatorLead}</span>
        <span className="gi-verdict-val">
          {g.indicatorValue}
          <span className="gi-verdict-unit app">{g.indicatorUnit}</span>
        </span>
        <span className="gi-verdict-sub app">{g.indicatorSub}</span>
      </div>

      <figcaption className="gi-bridge app">{gap.bridge}</figcaption>
    </figure>
  );
}
