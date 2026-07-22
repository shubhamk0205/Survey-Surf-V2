"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { PenMark } from "@/components/ui/pen-mark";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { heroExhibit } from "@/lib/content";

/**
 * FIG. A — the evidence board. The hero's central metaphor made literal:
 * scattered verbatim opinions pulled from ten sources, the editor's pen
 * marking the signals, and a single red thread gathering them into the one
 * perception the market holds but never said out loud (the verdict card).
 *
 * The thread is measured from the rendered layout — like the classified
 * plate — so it tracks the responsive column flow and the font swap. It is
 * decorative (aria-hidden); the chips carry the meaning as real text.
 */
export function HeroExhibit() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<number, HTMLElement | null>>(new Map());
  const verdictRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState("");
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const reduced = useReducedMotion();

  // Number the chips so the meta line reads like an evidence catalogue.
  let signalOrder = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function draw() {
      const node = canvasRef.current;
      const verdict = verdictRef.current;
      if (!node || !verdict) return;
      const box = node.getBoundingClientRect();
      setDims({ w: node.offsetWidth, h: node.offsetHeight });

      // Signal chips, in the order they fall down the board.
      const points = Array.from(nodeRefs.current.entries())
        .filter(([, el]) => el && el.offsetParent !== null)
        .map(([, el]) => {
          const r = el!.getBoundingClientRect();
          return {
            x: r.left - box.left + r.width / 2,
            y: r.top - box.top + r.height / 2,
          };
        })
        .sort((a, b) => a.y - b.y);

      if (points.length < 1) {
        setPath("");
        setNodes([]);
        return;
      }

      // The thread ends where the opinions converge: the verdict's top edge.
      const vr = verdict.getBoundingClientRect();
      const end = {
        x: vr.left - box.left + vr.width / 2,
        y: vr.top - box.top,
      };
      const all = [...points, end];

      let d = `M${all[0]!.x.toFixed(1)} ${all[0]!.y.toFixed(1)}`;
      for (let i = 1; i < all.length; i++) {
        const prev = all[i - 1]!;
        const cur = all[i]!;
        const my = (prev.y + cur.y) / 2;
        d += ` Q ${prev.x.toFixed(1)} ${my.toFixed(1)}, ${cur.x.toFixed(1)} ${cur.y.toFixed(1)}`;
      }
      setPath(d);
      setNodes(points);
    }

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    if (document.fonts?.ready) void document.fonts.ready.then(draw);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <span className="exhibit-overline">{heroExhibit.overline}</span>
      <div className="plate">
        <div className="fig-head">
          <span>
            <strong>{heroExhibit.headLeft.split(" · ")[0]}</strong>
            {heroExhibit.headLeft.includes(" · ")
              ? ` · ${heroExhibit.headLeft.split(" · ")[1]}`
              : ""}
          </span>
          <span>{heroExhibit.headRight}</span>
        </div>

        <div className="ev-canvas" ref={canvasRef}>
          <div className="ev-board">
            {heroExhibit.chips.map((chip, i) => {
              const order = chip.signal ? signalOrder++ : -1;
              return (
                <div
                  key={i}
                  className={cn("ev-chip", chip.signal && "ev-chip--signal")}
                  ref={
                    chip.signal
                      ? (el) => {
                          nodeRefs.current.set(order, el);
                        }
                      : undefined
                  }
                >
                  <div className="ev-chip-meta">
                    <span className="ev-chip-src">{chip.source}</span>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="ev-chip-quote">
                    {chip.signal ? (
                      <PenMark variant={chip.mark ?? "underline"}>
                        {chip.quote}
                      </PenMark>
                    ) : (
                      chip.quote
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          <svg
            className="ev-thread"
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
                    : { duration: 1.7, delay: 0.6, ease: [0.4, 0, 0.3, 1] }
                }
              />
            ) : null}
            {nodes.map((n, i) => (
              <motion.circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={3}
                initial={{ opacity: reduced ? 1 : 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: reduced ? 0 : 0.7 + i * 0.3 }}
              />
            ))}
          </svg>

          <div className="ev-verdict" ref={verdictRef}>
            <div className="ev-verdict-label">
              <span>{heroExhibit.verdict.label}</span>
              <span className="evl-conf">{heroExhibit.verdict.confidence}</span>
            </div>
            <p className="ev-verdict-quote">
              {heroExhibit.verdict.lead}
              {heroExhibit.verdict.em ? (
                <>
                  {" "}
                  <em>{heroExhibit.verdict.em}</em>
                </>
              ) : null}
            </p>
            <p className="ev-verdict-sub">{heroExhibit.verdict.sub}</p>
          </div>
        </div>
      </div>

      <figcaption>
        <p className="plate-cap">
          <strong>{heroExhibit.captionStrong}</strong> — {heroExhibit.caption}
        </p>
        <span className="plate-cap">{heroExhibit.captionRight}</span>
      </figcaption>
    </>
  );
}
