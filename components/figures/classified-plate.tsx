"use client";

import { motion } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";

import { PenMark } from "@/components/ui/pen-mark";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** The verbatim pool — the raw material of the "uncorrected proof". */
const POOL = [
  "not for someone like me",
  "it does what it says",
  "had no idea it did that",
  "overwhelming",
  "for experts",
  "safe",
  "wait — you do that?",
  "probably not for me — and I couldn’t tell you why",
  "premium. trusted. clearly worth it.",
  "I didn’t realize people saw us this way",
  "nobody on the team expected this",
  "built for teams bigger than mine",
  "I wonder if it could also…",
  "yeah — everyone does",
  "we say it on every call",
  "it’s right there on the site…",
  "the boring option I understood",
  "safe choice",
  "couldn’t tell what it’s for",
  "for people like me",
];

/** Deliberate pen targets: [column, rowIndex, text, kind]. */
const MARKS: [number, number, string, "u" | "c"][] = [
  [0, 3, "overwhelming", "u"],
  [1, 7, "for experts", "u"],
  [2, 5, "safe", "u"],
  [3, 9, "wait — you do that?", "u"],
  [4, 6, "not for someone like me", "c"],
  [5, 11, "had no idea it did that", "u"],
];

const COLS = 6;
const ROWS = 16;

interface Fragmentette {
  text: string;
  target?: { kind: "u" | "c"; order: number };
}

/** Deterministic (SSR-safe) build of the fragment grid. */
function buildColumns(): Fragmentette[][] {
  const columns: Fragmentette[][] = [];
  for (let c = 0; c < COLS; c++) {
    const column: Fragmentette[] = [];
    for (let i = 0; i < ROWS; i++) {
      let text = POOL[(c * 5 + i * 3 + (i >> 1) + c) % POOL.length]!;
      let kind: "u" | "c" | null = null;
      for (const mark of MARKS) {
        if (mark[0] === c && mark[1] === i) {
          text = mark[2];
          kind = mark[3];
        }
      }
      column.push(
        kind
          ? { text, target: { kind, order: kind === "c" ? 99 : c } }
          : { text },
      );
    }
    columns.push(column);
  }
  return columns;
}

const COLUMNS = buildColumns();

/**
 * FIG. A — the classified page of verbatims. The pen marks (drawn by PenMark)
 * and the red connector thread linking them are measured from the rendered
 * layout, so they track the responsive grid. The thread is decorative
 * (aria-hidden); the fragments are hidden from the accessibility tree too, as
 * they are illustrative noise, not content.
 */
export function ClassifiedPlate() {
  const gridRef = useRef<HTMLDivElement>(null);
  const targetRefs = useRef<Map<number, HTMLSpanElement | null>>(new Map());
  const [path, setPath] = useState("");
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    function draw() {
      const node = gridRef.current;
      if (!node) return;
      const gridRect = node.getBoundingClientRect();
      const entries = Array.from(targetRefs.current.entries())
        .filter(
          ([, el]) => el && el.offsetWidth > 0 && el.offsetParent !== null,
        )
        .sort((a, b) => a[0] - b[0]);

      setDims({ w: node.offsetWidth, h: node.offsetHeight });

      if (entries.length < 2) {
        setPath("");
        return;
      }

      const points = entries.map(([, el]) => {
        const rect = el!.getBoundingClientRect();
        return [
          rect.left - gridRect.left + rect.width / 2,
          rect.top - gridRect.top + rect.height / 2 + 7,
        ] as const;
      });

      let d = `M${points[0]![0].toFixed(1)} ${points[0]![1].toFixed(1)}`;
      for (let i = 1; i < points.length; i++) {
        const mx = (points[i - 1]![0] + points[i]![0]) / 2;
        d += ` Q ${mx.toFixed(1)} ${(points[i - 1]![1] + 14).toFixed(1)}, ${points[i]![0].toFixed(1)} ${points[i]![1].toFixed(1)}`;
      }
      setPath(d);
    }

    draw();

    // The ResizeObserver on the fluid grid already covers every
    // layout-changing case; document.fonts.ready covers the font swap.
    const observer = new ResizeObserver(draw);
    observer.observe(grid);
    if (document.fonts?.ready) {
      void document.fonts.ready.then(draw);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="frag-grid" ref={gridRef} aria-hidden="true">
      {COLUMNS.map((column, c) => (
        <div className="frag-col" key={c}>
          <p>
            {column.map((fragment, i) => (
              <Fragment key={i}>
                {fragment.target ? (
                  <span
                    className="frag-target"
                    ref={(el) => {
                      targetRefs.current.set(fragment.target!.order, el);
                    }}
                  >
                    <PenMark
                      variant={
                        fragment.target.kind === "c" ? "circle" : "underline"
                      }
                    >
                      {fragment.text}
                    </PenMark>
                  </span>
                ) : (
                  fragment.text
                )}
                {i < ROWS - 1 ? (
                  <span className="frag-sep">{"  ·  "}</span>
                ) : null}
              </Fragment>
            ))}
          </p>
        </div>
      ))}

      <svg
        className="connector-svg"
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {path ? (
          <motion.path
            d={path}
            initial={{ pathLength: reduced ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1.6, delay: 0.5, ease: [0.4, 0, 0.3, 1] }
            }
          />
        ) : null}
      </svg>
    </div>
  );
}
