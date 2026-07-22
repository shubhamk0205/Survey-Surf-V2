import type { CSSProperties } from "react";

import { BarMeter } from "@/components/ui/bar-meter";
import { Marginalia } from "@/components/ui/marginalia";
import { PenMark } from "@/components/ui/pen-mark";
import {
  absoluteBars,
  absoluteRead,
  relativeGroups,
  relativeRead,
} from "@/lib/content";
import { cn } from "@/lib/utils";

/** Multiplier · "Absolute" tab — emotional perception scores in isolation. */
export function AbsoluteBars() {
  return (
    <>
      {absoluteBars.map((bar) => (
        <BarMeter
          key={bar.label}
          label={bar.label}
          value={bar.value}
          display={String(bar.value)}
        />
      ))}
      <div className="row">
        <p className="fig-read">
          <span className="read-label">{absoluteRead.label}</span>
          {absoluteRead.text}
        </p>
        <div className="margin-cell">
          <Marginalia reveal={false}>{absoluteRead.marginNote}</Marginalia>
        </div>
      </div>
    </>
  );
}

/** Multiplier · "Relative" tab — the same scores against rivals and category. */
export function RelativeBars() {
  return (
    <>
      <div className="rel-legend">
        <span>
          <span className="swatch b-you" aria-hidden="true" />
          You
        </span>
        <span>
          <span className="swatch b-rival" aria-hidden="true" />
          Rival A
        </span>
        <span>
          <span className="swatch b-cat" aria-hidden="true" />
          Category
        </span>
      </div>

      {relativeGroups.map((group) => (
        <div className="rel-group" key={group.label}>
          <div className="rel-head">
            <span className="bar-label">{group.label}</span>
            <span
              className={cn("rel-delta", group.trailing && "rel-delta--trail")}
            >
              {group.trailing ? (
                <PenMark variant="underline">{group.delta}</PenMark>
              ) : (
                group.delta
              )}
            </span>
          </div>
          <div className="rel-bars">
            <span
              className="rel-bar b-you"
              style={{ width: `${group.you}%` } as CSSProperties}
            />
            <span
              className="rel-bar b-rival"
              style={{ width: `${group.rival}%` } as CSSProperties}
            />
            <span
              className="rel-bar b-cat"
              style={{ width: `${group.category}%` } as CSSProperties}
            />
          </div>
        </div>
      ))}

      <div className="row">
        <p className="fig-read">
          <span className="read-label">{relativeRead.label}</span>
          {relativeRead.text}
        </p>
        <div className="margin-cell">
          <Marginalia reveal={false}>{relativeRead.marginNote}</Marginalia>
        </div>
      </div>
    </>
  );
}
