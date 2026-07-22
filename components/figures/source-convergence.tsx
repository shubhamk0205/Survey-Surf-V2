import type { CSSProperties } from "react";

import { Reveal } from "@/components/ui/reveal";
import { sources } from "@/lib/content";

/**
 * FIG. — THE LISTENING MAP.
 *
 * The product thesis for "Always listening", drawn: every channel where the
 * market already speaks (left) is pulled along a converging line into one
 * defensible reading (the single red node, right). It is the leader-list's
 * argument made spatial — many inputs, one perception — so the chapter opens
 * as a balanced spread rather than a text block with an empty right.
 *
 * Purely illustrative geometry; the SVG is decorative to a screen reader (the
 * ten sources are enumerated in the adjacent index), so it is aria-hidden and
 * the figure leans on its caption.
 */
export function SourceConvergence() {
  // Layout grid (unitless viewBox px). Sources stack on the left; every line
  // eases to the single perception node on the right.
  const VB_W = 420;
  const VB_H = 320;
  const NODE_X = 330;
  const NODE_Y = 160;
  const DOT_X = 122;
  const TOP = 20;
  const BOTTOM = 300;
  const n = sources.length;
  const rows = sources.map((s, i) => ({
    name: s.name,
    y: TOP + (i * (BOTTOM - TOP)) / (n - 1),
  }));

  return (
    <Reveal className="listen-map" as="figure">
      <div className="listen-head">
        <span className="app">SS · Always listening</span>
        <span className="app listen-head-r">
          {n} channels → 1 reading
        </span>
      </div>

      <svg
        className="listen-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="presentation"
        aria-hidden="true"
      >
        {/* converging lines — thin ink hairlines, the signal drawn inward */}
        <g className="listen-lines">
          {rows.map((r, i) => (
            <path
              key={`line-${i}`}
              d={`M ${DOT_X} ${r.y} C 236 ${r.y} 262 ${NODE_Y} ${NODE_X} ${NODE_Y}`}
              style={{ "--i": i } as CSSProperties}
            />
          ))}
        </g>

        {/* source labels + nodes on the left */}
        <g className="listen-sources">
          {rows.map((r, i) => (
            <g key={`src-${i}`}>
              <text
                className="listen-label"
                x={DOT_X - 12}
                y={r.y + 3}
                textAnchor="end"
              >
                {r.name}
              </text>
              <circle className="listen-dot" cx={DOT_X} cy={r.y} r={2.4} />
            </g>
          ))}
        </g>

        {/* the one reading — the single red perception node */}
        <g className="listen-node">
          <circle
            className="listen-node-ring"
            cx={NODE_X}
            cy={NODE_Y}
            r={13}
          />
          <circle className="listen-node-core" cx={NODE_X} cy={NODE_Y} r={5.5} />
          <text
            className="listen-node-label"
            x={NODE_X + 20}
            y={NODE_Y - 2}
          >
            ONE READING
          </text>
          <text
            className="listen-node-sub"
            x={NODE_X + 20}
            y={NODE_Y + 11}
          >
            n = 1,240
          </text>
        </g>
      </svg>

      <figcaption className="listen-cap plate-cap">
        <strong>THE LISTENING MAP</strong> — every channel, pulled to one
        defensible reading.
      </figcaption>
    </Reveal>
  );
}
