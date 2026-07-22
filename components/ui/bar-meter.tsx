import type { CSSProperties, ReactNode } from "react";

import { CountUp } from "@/components/ui/count-up";

/**
 * A horizontal perception bar: label (+ optional italic sub-label), a filled
 * track, and a numeric readout. The fill width is bound to the `--w` token;
 * inside a `.draw-bars` figure the fill grows from the left on scroll-in and
 * the readout counts up. `index` sets `--i` so a stack of bars draws as a
 * gentle top-to-bottom cascade.
 */
export function BarMeter({
  label,
  sub,
  value,
  display,
  index = 0,
}: {
  label: ReactNode;
  sub?: string;
  value: number;
  display: string;
  index?: number;
}) {
  return (
    <div className="bar-row" style={{ "--i": index } as CSSProperties}>
      <span className="bar-label">
        {label}
        {sub ? <span className="bar-sub">{sub}</span> : null}
      </span>
      <span className="bar-track">
        <span
          className="bar-fill"
          style={{ "--w": `${value}%` } as CSSProperties}
        />
      </span>
      <CountUp className="bar-num" value={display} />
    </div>
  );
}
