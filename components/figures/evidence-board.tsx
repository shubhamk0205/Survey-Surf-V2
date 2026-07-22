"use client";

import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { evidenceBoard } from "@/lib/content";
import type { ExhibitCard } from "@/types";

/**
 * FIG. A — THE PERCEPTION EVIDENCE BOARD (the cover exhibit).
 *
 * A strategy-firm war-room wall, built entirely from layered markup — never a
 * screenshot. Real signals (reviews, threads, tickets, interviews, charts) are
 * pinned to a warm-concrete wall; aged paper scraps and dark sticky-notes fill
 * every gap, illegible pen-scrawls work the margins, and the editor's red
 * thread gathers the marked signals down into the one perception the market
 * holds but never said out loud (the KEY FINDING card).
 *
 * Progressive enhancement, matching the site contract: every piece of *copy*
 * is present and visible without JavaScript (the entrance is CSS gated behind
 * `.js` + `.is-ready`). Framer Motion is used only for the genuinely dynamic,
 * decorative marks — the threads drawing themselves and the small charts. The
 * red thread geometry is measured live from the DOM (like the classified
 * plate), so it tracks the responsive layout and the webfont swap. Every
 * animation runs once and reinforces the concept; all of it collapses to a
 * still, finished board under `prefers-reduced-motion`.
 */

const { caption, keyFinding, stats, annotations, scrawls, cards } =
  evidenceBoard;
const threadCards = cards.filter((c) => c.thread);

/* --------------------------- decorative marks ---------------------------- */

// Four illegible cursive squiggles — the texture of a wall that's been worked.
// Drawn in a 60×22 box; the component scales/rotates them into place.
const SCRAWL_PATHS = [
  "M2 15 q6 -11 11 -4 q3 5 8 1 q4 -3 7 2 q3 5 9 1 q6 -5 11 2 M40 8 q5 6 11 3",
  "M2 12 q8 -8 12 0 q3 6 7 0 q4 -7 9 -1 q3 5 8 0 q5 -6 10 1 q4 5 9 0",
  "M3 9 q4 8 9 2 q4 -6 8 0 q3 6 8 1 q5 -6 10 0 q4 6 9 1 M6 18 q10 3 20 0",
  "M2 14 q5 -9 10 -2 q4 7 9 1 q4 -6 8 1 q4 6 9 0 q5 -7 11 0",
];

function Scrawl({
  variant,
  className,
}: {
  variant: number;
  className?: string;
}) {
  return (
    <svg
      className={cn("eb-scrawl-svg", className)}
      viewBox="0 0 60 22"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path d={SCRAWL_PATHS[variant % SCRAWL_PATHS.length]} />
    </svg>
  );
}

/* ----------------------------- small charts ------------------------------ */

function LineChart({ ready, reduced }: { ready: boolean; reduced: boolean }) {
  // Sentiment climbing — "too expensive" mentions trending up over time.
  const line = "M2 33 L17 31 L32 27 L47 28 L62 19 L77 13 L96 6";
  const area = `${line} L96 40 L2 40 Z`;
  return (
    <svg
      className="eb-viz"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        className="eb-viz-area"
        d={area}
        initial={{ opacity: reduced ? 0.5 : 0 }}
        animate={ready ? { opacity: 0.5 } : undefined}
        transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 1.3 }}
      />
      <motion.path
        className="eb-viz-line"
        d={line}
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={ready ? { pathLength: 1 } : undefined}
        transition={{
          duration: reduced ? 0 : 1.1,
          delay: reduced ? 0 : 0.9,
          ease: [0.4, 0, 0.3, 1],
        }}
      />
    </svg>
  );
}

function BarChart({ ready, reduced }: { ready: boolean; reduced: boolean }) {
  const bars = [42, 55, 61, 78, 96];
  return (
    <svg
      className="eb-viz"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {bars.map((h, i) => {
        const w = 13;
        const gap = (100 - bars.length * w) / (bars.length + 1);
        const x = gap + i * (w + gap);
        const y = 40 - (h / 100) * 38;
        return (
          <motion.rect
            key={i}
            className={cn("eb-viz-bar", i === bars.length - 1 && "is-lead")}
            x={x}
            width={w}
            y={y}
            height={(h / 100) * 38}
            style={{ transformOrigin: `center ${40}px` }}
            initial={{ scaleY: reduced ? 1 : 0 }}
            animate={ready ? { scaleY: 1 } : undefined}
            transition={{
              duration: reduced ? 0 : 0.6,
              delay: reduced ? 0 : 0.9 + i * 0.09,
              ease: [0.2, 0.7, 0.2, 1],
            }}
          />
        );
      })}
    </svg>
  );
}

function DonutChart({
  value,
  ready,
  reduced,
}: {
  value: number;
  ready: boolean;
  reduced: boolean;
}) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const frac = value / 100;
  return (
    <svg className="eb-viz eb-viz--donut" viewBox="0 0 40 40" aria-hidden="true">
      <circle className="eb-donut-track" cx="20" cy="20" r={r} />
      <motion.circle
        className="eb-donut-arc"
        cx="20"
        cy="20"
        r={r}
        strokeDasharray={c}
        transform="rotate(-90 20 20)"
        initial={{ strokeDashoffset: reduced ? c * (1 - frac) : c }}
        animate={ready ? { strokeDashoffset: c * (1 - frac) } : undefined}
        transition={{
          duration: reduced ? 0 : 1.1,
          delay: reduced ? 0 : 0.9,
          ease: [0.4, 0, 0.3, 1],
        }}
      />
      <text className="eb-donut-label" x="20" y="20" dy="0.36em">
        {value}%
      </text>
    </svg>
  );
}

/* ----------------------------- card content ------------------------------ */

function Stars({ rating }: { rating: number }) {
  return (
    <span className="eb-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={cn("eb-star", i < rating && "is-on")}>
          ★
        </span>
      ))}
    </span>
  );
}

/** Render a quote, wrapping the highlighted phrase so it can sweep in. */
function Quote({ quote, highlight }: { quote?: string; highlight?: string }) {
  if (!quote) return null;
  if (!highlight || !quote.includes(highlight)) {
    return <p className="eb-quote">{quote}</p>;
  }
  const [before, after] = quote.split(highlight);
  return (
    <p className="eb-quote">
      {before}
      <span className="eb-hl">{highlight}</span>
      {after}
    </p>
  );
}

/** Faint printed-text lines — a document read from across the room. */
function TextLines() {
  return (
    <span className="eb-lines" aria-hidden="true">
      <span style={{ width: "92%" }} />
      <span style={{ width: "78%" }} />
      <span style={{ width: "85%" }} />
      <span style={{ width: "54%" }} />
    </span>
  );
}

function Card({
  card,
  index,
  ready,
  reduced,
  setRef,
}: {
  card: ExhibitCard;
  index: number;
  ready: boolean;
  reduced: boolean;
  setRef: (el: HTMLElement | null) => void;
}) {
  const style = {
    "--x": `${card.x}%`,
    "--y": `${card.y}%`,
    "--w": `${card.w}%`,
    "--r": `${card.rotate}deg`,
    "--z": card.z ?? 2,
    "--d": `${0.05 + index * 0.03}s`,
  } as CSSProperties;

  const isChart = card.kind.startsWith("chart");
  const isScrap = card.kind === "scrap";
  const isSticky = card.kind === "sticky";
  const pin = card.pin ?? (card.thread ? "red" : "dark");

  return (
    <article
      ref={setRef}
      className={cn(
        "eb-card",
        `eb-card--${card.kind}`,
        card.tone && `eb-tone-${card.tone}`,
        card.faded && "is-faded",
        card.thread && "is-signal",
        card.curl && "has-curl",
      )}
      data-pin-at={card.pinAt ?? "left"}
      style={style}
    >
      {/* fixing — a pin or a strip of tape */}
      {card.tape ? (
        <span className="eb-tape" aria-hidden="true" />
      ) : pin !== "none" ? (
        <span className={cn("eb-pin", `eb-pin--${pin}`)} aria-hidden="true" />
      ) : null}

      {card.source ? (
        <header className="eb-card-head">
          <span className="eb-card-src">{card.source}</span>
          {card.meta ? <span className="eb-card-meta">{card.meta}</span> : null}
        </header>
      ) : null}

      {card.kind === "review" && typeof card.rating === "number" ? (
        <Stars rating={card.rating} />
      ) : null}

      {isChart ? (
        <div className="eb-viz-wrap">
          {card.kind === "chart-line" ? (
            <LineChart ready={ready} reduced={reduced} />
          ) : card.kind === "chart-bar" ? (
            <BarChart ready={ready} reduced={reduced} />
          ) : (
            <DonutChart
              value={card.value ?? 50}
              ready={ready}
              reduced={reduced}
            />
          )}
        </div>
      ) : null}

      {isScrap ? <TextLines /> : null}

      {isSticky && card.quote ? (
        <p className="eb-sticky-note">{card.quote}</p>
      ) : (
        <Quote quote={card.quote} highlight={card.highlight} />
      )}

      {typeof card.scrawl === "number" ? (
        <Scrawl variant={card.scrawl} className="eb-scrawl-on" />
      ) : null}

      {card.curl ? <span className="eb-curl" aria-hidden="true" /> : null}
    </article>
  );
}

/* --------------------------------- board --------------------------------- */

export function EvidenceBoard() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const findingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLElement | null>>(new Map());
  const [threads, setThreads] = useState<{ id: string; d: string }[]>([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  // Trigger the CSS entrance after the hidden state has painted (double rAF),
  // so the staggered reveal transitions actually play. Reduced motion snaps in.
  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    let r1 = 0;
    let r2 = 0;
    r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [reduced]);

  // Measure the red thread from each marked card down into the finding card.
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const finding = findingRef.current;
    if (!stage || !finding) return;
    const box = stage.getBoundingClientRect();
    setDims({ w: stage.offsetWidth, h: stage.offsetHeight });

    const fr = finding.getBoundingClientRect();
    const end = {
      x: fr.left - box.left + fr.width / 2,
      y: fr.top - box.top + fr.height * 0.2,
    };

    const next: { id: string; d: string }[] = [];
    for (const card of threadCards) {
      const el = cardRefs.current.get(card.id);
      if (!el || el.offsetParent === null) continue;
      const r = el.getBoundingClientRect();
      const start = {
        x: r.left - box.left + r.width / 2,
        y: r.top - box.top + r.height / 2,
      };
      // A gentle catenary bow, sagging away from the straight line so the
      // threads read as loose string rather than a taut starburst.
      const mx = (start.x + end.x) / 2;
      const my =
        (start.y + end.y) / 2 + Math.abs(end.x - start.x) * 0.05 + 14;
      next.push({
        id: card.id,
        d: `M${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)}, ${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
      });
    }
    setThreads(next);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    if (document.fonts?.ready) void document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <figure className="eb">
      <figcaption className="eb-caption">{caption}</figcaption>

      <div ref={stageRef} className={cn("eb-stage", ready && "is-ready")}>
        {/* The red thread — scattered signals resolving into one pattern. */}
        <svg
          className="eb-threads"
          viewBox={`0 0 ${dims.w || 100} ${dims.h || 100}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {threads.map((t, i) => (
            <motion.path
              key={t.id}
              d={t.d}
              vectorEffect="non-scaling-stroke"
              initial={{
                pathLength: reduced ? 1 : 0,
                opacity: reduced ? 0.8 : 0,
              }}
              animate={ready ? { pathLength: 1, opacity: 0.8 } : undefined}
              transition={{
                pathLength: {
                  duration: reduced ? 0 : 1.2,
                  delay: reduced ? 0 : 1 + i * 0.16,
                  ease: [0.4, 0, 0.3, 1],
                },
                opacity: {
                  duration: reduced ? 0 : 0.3,
                  delay: reduced ? 0 : 1 + i * 0.16,
                },
              }}
            />
          ))}
        </svg>

        {/* The scattered exhibits. */}
        {cards.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            index={i}
            ready={ready}
            reduced={reduced}
            setRef={(el) => {
              cardRefs.current.set(card.id, el);
            }}
          />
        ))}

        {/* Illegible pen-scrawls worked into the margins. */}
        {(scrawls ?? []).map((s, i) => (
          <span
            key={`scrawl-${i}`}
            className="eb-scrawl"
            aria-hidden="true"
            style={
              {
                "--x": `${s.x}%`,
                "--y": `${s.y}%`,
                "--r": `${s.rotate}deg`,
                "--s": s.scale ?? 1,
              } as CSSProperties
            }
          >
            <Scrawl variant={s.variant} />
          </span>
        ))}

        {/* Legible handwritten margin annotations. */}
        {annotations.map((a, i) => (
          <span
            key={`annot-${i}`}
            className="eb-annot"
            aria-hidden="true"
            style={
              {
                "--x": `${a.x}%`,
                "--y": `${a.y}%`,
                "--r": `${a.rotate}deg`,
              } as CSSProperties
            }
          >
            {a.text}
          </span>
        ))}

        {/* THE KEY FINDING — the perception the signals converge into. */}
        <div ref={findingRef} className="eb-finding">
          <span className="eb-finding-label">{keyFinding.label}</span>
          <p className="eb-finding-lead">
            {keyFinding.lead}{" "}
            <span className="eb-finding-em">{keyFinding.em}</span>
          </p>
          <div className="eb-finding-foot">
            <div className="eb-conf">
              <div className="eb-conf-row">
                <span className="eb-conf-label">Confidence</span>
                <span className="eb-conf-val">{keyFinding.confidence}%</span>
              </div>
              <span className="eb-conf-meter">
                <span
                  className="eb-conf-fill"
                  style={
                    { "--pct": `${keyFinding.confidence}%` } as CSSProperties
                  }
                />
              </span>
            </div>
            <span className="eb-finding-updated">{keyFinding.updated}</span>
          </div>
        </div>

        {/* The running ledger — the study, quantified. */}
        <aside className="eb-stats" aria-label="Study at a glance">
          {stats.map((s) => (
            <div className="eb-stat" key={s.label}>
              <span className="eb-stat-label">{s.label}</span>
              <span className="eb-stat-val">{s.value}</span>
            </div>
          ))}
        </aside>
      </div>
    </figure>
  );
}
