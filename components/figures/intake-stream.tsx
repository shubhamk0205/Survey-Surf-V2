"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useReveal } from "@/hooks/use-reveal";
import { intakeSamples, intakeSources } from "@/lib/content";

const EVIDENCE_FROM = 12_180;
const EVIDENCE_TO = 12_904;

/** Locale-independent thousands separator (keeps SSR/CSR output identical). */
function group(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * FIG. 3.1 — Signal intake. The listening channels light up in rotation while
 * verbatim opinions stream continuously through the intake ledger and the
 * evidence counter ticks up. The point: opinions arrive on their own — we
 * don't ask for them, we log them. Decorative (aria-hidden); motion pauses for
 * reduced-motion and while the figure is offscreen.
 */
export function IntakeStream() {
  const reduced = useReducedMotion();
  const { ref, inView } = useReveal<HTMLElement>({ once: false });
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(EVIDENCE_TO);

  // The channel that is "reading now" advances on a slow rotation.
  useEffect(() => {
    if (reduced || !inView) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % intakeSources.length);
    }, 1300);
    return () => window.clearInterval(id);
  }, [reduced, inView]);

  // The evidence tally settles upward each time the figure re-enters view.
  useEffect(() => {
    if (reduced || !inView) {
      setCount(EVIDENCE_TO);
      return;
    }
    let raf = 0;
    let start = 0;
    const duration = 2400;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(
        Math.round(EVIDENCE_FROM + (EVIDENCE_TO - EVIDENCE_FROM) * eased),
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, inView]);

  // Doubled so the vertical marquee loops seamlessly.
  const rows = [...intakeSamples, ...intakeSamples];

  return (
    <figure className="intake" ref={ref} aria-hidden="true">
      <div className="intake-head">
        <span className="intake-live">
          <i className="live-dot" />
          Signal intake · Live
        </span>
        <span className="intake-head-r">12 sources · reading now</span>
      </div>

      <div className="intake-sources">
        {intakeSources.map((source, i) => (
          <span
            key={source.code}
            className={
              "src-chip" + (i === active && !reduced ? " is-active" : "")
            }
          >
            <b>{source.code}</b>
            <span>{source.name}</span>
          </span>
        ))}
      </div>

      <div className={"intake-ledger" + (reduced ? " is-static" : "")}>
        <div className="intake-track">
          {rows.map((row, i) => (
            <div className="intake-row" key={i}>
              <span className="ir-code">{row.code}</span>
              <span className="ir-quote">“{row.quote}”</span>
              <span className="ir-id">{row.id}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="intake-foot">
        <span className="intake-count">
          <b>{group(count)}</b> logged
        </span>
        <span className="intake-density">
          Signal density
          <i className="dens-bar">
            <i />
          </i>
          <em>high</em>
        </span>
      </div>
    </figure>
  );
}
