import { Fragment } from "react";

import { Container } from "@/components/ui/container";
import { tickerItems, tickerLead } from "@/lib/content";

function TickerRun({ hidden }: { hidden?: boolean }) {
  return (
    <span aria-hidden={hidden ? "true" : undefined}>
      <span className="t-lead">{tickerLead}</span>{" "}
      {tickerItems.map((item, index) => (
        <Fragment key={index}>
          <span className="t-dot">·</span> {item}{" "}
        </Fragment>
      ))}
    </span>
  );
}

/**
 * The flow band — a continuous marquee of signal sources drifting toward
 * Survey Surf. Pure CSS animation; the track is duplicated for a seamless loop
 * and collapses to a static wrap under reduced motion.
 */
export function Ticker() {
  return (
    <div className="ticker" aria-label="Sources flowing to Survey Surf">
      <Container>
        <div className="ticker-clip">
          <div className="ticker-track">
            <TickerRun />
            <TickerRun hidden />
          </div>
        </div>
      </Container>
    </div>
  );
}
