import type { CSSProperties, ReactNode } from "react";

/**
 * A horizontal perception bar: label (+ optional italic sub-label), a filled
 * track, and a numeric readout. The fill width is bound to the `--w` token.
 */
export function BarMeter({
  label,
  sub,
  value,
  display,
}: {
  label: ReactNode;
  sub?: string;
  value: number;
  display: string;
}) {
  return (
    <div className="bar-row">
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
      <span className="bar-num">{display}</span>
    </div>
  );
}
