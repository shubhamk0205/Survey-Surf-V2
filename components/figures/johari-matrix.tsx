"use client";

import { useState } from "react";
import type { FocusEvent } from "react";

import { PenMark } from "@/components/ui/pen-mark";
import { Plate, FigHead } from "@/components/ui/plate";
import { Reveal } from "@/components/ui/reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  johariAxes,
  johariBlind,
  johariCaption,
  johariFigHead,
  johariFramework,
  johariQuads,
} from "@/lib/content";
import { cn } from "@/lib/utils";

type Pos = "tl" | "tr" | "bl" | "br";

/**
 * The Survey Surf Blind Spot Matrix™ (FIG. 01) — the issue's centre spread.
 *
 * Not a 2×2 table: a perception *instrument*. A slim "brief" column states the
 * framework and carries the instrument key; beside it a poster-sized plot sits
 * on engineering-drawing axes (dimension lines, calibration ticks, crop marks,
 * a crosshair origin). Four rooms hold real research artifacts — chips, meters,
 * verbatims, handwritten notes. The blind spot (SS-04) is a dark, dominant case
 * file that stays lit by default; focusing any room brings it forward and dims
 * the rest. Copy is data-driven (lib/content); the dossier is authored here
 * because its shape is unique.
 */
export function BlindSpotMatrix() {
  const reduced = useReducedMotion();
  const [focus, setFocus] = useState<Pos>("tr");
  const [engaged, setEngaged] = useState(false);

  const enter = (pos: Pos) => {
    setFocus(pos);
    setEngaged(true);
  };
  const rest = () => {
    setEngaged(false);
    setFocus("tr");
  };
  const onGridBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) rest();
  };

  const meta = johariFramework.meta;

  return (
    <Reveal as="figure" className="matrix-plate">
      <Plate className="bsm-plate">
        <FigHead
          left={
            <>
              <strong>{johariFigHead.ref}</strong> · {johariFigHead.title}
            </>
          }
          right={johariFigHead.right}
        />

        <div className="bsm">
          {/* ───────────── The brief (≈36%) ───────────── */}
          <div className="bsm-brief">
            <p className="bsm-kicker app">{johariFramework.kicker}</p>
            <h3 className="bsm-title">
              {johariFramework.title.lead}{" "}
              <em>{johariFramework.title.em}</em>
            </h3>
            <p className="bsm-thesis">{johariFramework.thesis}</p>
            <p className="bsm-turn">
              <span className="bsm-turn-lead">{johariFramework.turn}</span>{" "}
              {johariFramework.turnBody}
            </p>

            {/* instrument key — the legend as a control panel */}
            <div className="bsm-key">
              <p className="bsm-block-label app">{johariFramework.keyLabel}</p>
              <ul>
                {johariFramework.legend.map((l) => (
                  <li key={l.mark} className={`bsm-key-row bsm-key-row--${l.swatch}`}>
                    <span className="bsm-key-swatch" aria-hidden="true" />
                    <span className="bsm-key-mark">{l.mark}</span>
                    <span className="bsm-key-text">{l.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* sources coded — the evidence base */}
            <div className="bsm-sources">
              <p className="bsm-block-label app">
                {johariFramework.sourcesLabel}
                <span className="bsm-sources-count">
                  {johariFramework.sourcesCount}
                </span>
              </p>
              <ul className="bsm-source-chips">
                {johariFramework.sources.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="bsm-sources-sub">{johariFramework.sourcesSub}</p>
            </div>

            {/* method metadata + reviewer stamp */}
            <p className="bsm-meta app">
              <span>{meta.method}</span>
              <span>{meta.rev}</span>
              <span>{meta.sources}</span>
              <span>{meta.sample}</span>
              <span>{meta.conf}</span>
              <span className="bsm-stamp">✓ {meta.reviewer}</span>
            </p>
          </div>

          {/* ───────────── The instrument (≈64%) ─────────────
             The plot is a single locked composition: authored at a fixed
             intrinsic size (.bsm-stage) and scaled as one rigid object by
             .bsm-figure. Nothing inside reflows — it only ever scales
             uniformly, like a printed figure. */}
          <div className="bsm-instrument">
           <div className="bsm-figure">
            <div className="bsm-stage">
            {/* top axis — What you can see */}
            <div className="bsm-axis bsm-axis--x">
              <span className="bsm-axis-cap">
                {johariAxes.xCaption} <span className="bsm-axis-arrow">→</span>
              </span>
              <span className="bsm-dim bsm-dim--x" aria-hidden="true" />
              <span className="bsm-axis-ends">
                <span>{johariAxes.xLeft}</span>
                <span>{johariAxes.xRight}</span>
              </span>
            </div>

            <div className="bsm-lower">
              {/* left axis — What the market sees */}
              <div className="bsm-axis bsm-axis--y">
                <span className="bsm-axis-end">{johariAxes.yTop}</span>
                <span className="bsm-axis-cap">
                  {johariAxes.yCaption} <span className="bsm-axis-arrow">↑</span>
                </span>
                <span className="bsm-axis-end">{johariAxes.yBottom}</span>
                <span className="bsm-dim bsm-dim--y" aria-hidden="true" />
              </div>

              {/* the plot */}
              <div
                className="bsm-grid"
                data-focus={focus}
                data-engaged={engaged}
                data-reduced={reduced}
                onMouseLeave={rest}
                onBlur={onGridBlur}
              >
                <span className="bsm-crop bsm-crop--tl" aria-hidden="true" />
                <span className="bsm-crop bsm-crop--tr" aria-hidden="true" />
                <span className="bsm-crop bsm-crop--bl" aria-hidden="true" />
                <span className="bsm-crop bsm-crop--br" aria-hidden="true" />

                {/* three apparatus rooms */}
                {johariQuads.map((q) => (
                  <div
                    key={q.id}
                    className={cn(
                      "bsm-room",
                      `bsm-room--${q.pos}`,
                      `bsm-room--${q.swatch}`,
                      focus === q.pos && "is-focus",
                    )}
                    data-pos={q.pos}
                    tabIndex={0}
                    aria-label={`${q.name} — ${q.coord}. ${q.body}`}
                    onMouseEnter={() => enter(q.pos)}
                    onFocus={() => enter(q.pos)}
                  >
                    <span className="bsm-room-index" aria-hidden="true" />
                    <div className="bsm-room-head">
                      <span className="bsm-room-ref">{q.ref}</span>
                      <span className={`bsm-chip bsm-chip--${q.swatch}`}>
                        {q.priority}
                      </span>
                    </div>
                    <h4 className="bsm-room-name">
                      {q.name}
                      <span className="bsm-room-tag">{q.tag}</span>
                    </h4>
                    <p className="bsm-room-desc">{q.body}</p>

                    <blockquote className="bsm-room-quote">
                      <span className="bsm-room-quote-txt">“{q.quote.text}”</span>
                      <cite>{q.quote.source}</cite>
                    </blockquote>

                    <div className="bsm-room-foot">
                      <span className="bsm-evrow">
                        {q.evidence.map((e) => (
                          <span key={e} className="bsm-ev">
                            {e}
                          </span>
                        ))}
                      </span>
                      <span className="bsm-room-metrics">
                        {q.sentiment.map((s) => (
                          <span key={s.label} className={`bsm-sent is-${s.dir}`}>
                            {s.label}&nbsp;{s.value}
                          </span>
                        ))}
                        <span className="bsm-conf" title={`Confidence ${q.confidenceLabel}`}>
                          <span className="bsm-conf-bar" aria-hidden="true">
                            <i style={{ width: `${q.confidence}%` }} />
                          </span>
                          <span className="bsm-conf-num">{q.signalCount}</span>
                        </span>
                      </span>
                    </div>

                    <span className="bsm-room-note" aria-hidden="true">
                      {q.note}
                    </span>
                    <span className="bsm-room-coord" aria-hidden="true">
                      {q.coord}
                    </span>
                  </div>
                ))}

                {/* the blind spot — the dominant dark case file */}
                <div
                  className={cn(
                    "bsm-room bsm-room--blind bsm-room--tr",
                    focus === "tr" && "is-focus",
                  )}
                  data-pos="tr"
                  tabIndex={0}
                  aria-label={`The Blind Spot — ${johariBlind.coord}. ${johariBlind.source}`}
                  onMouseEnter={() => enter("tr")}
                  onFocus={() => enter("tr")}
                >
                  <span className="bsm-blind-tape" aria-hidden="true">
                    {johariBlind.tape}
                  </span>
                  <div className="bsm-room-head bsm-room-head--blind">
                    <span className="ff-red">{johariBlind.ref}</span>
                    <span className="ff-red bsm-pri01">{johariBlind.priority}</span>
                  </div>
                  <h4 className="bsm-room-name bsm-room-name--blind">
                    {johariBlind.name}
                    <PenMark
                      variant="circle"
                      className="bsm-room-tag bsm-room-tag--blind"
                    >
                      {johariBlind.tag}
                    </PenMark>
                  </h4>

                  <p className="bsm-redact">
                    {johariBlind.redactLead}{" "}
                    <span className="redbar" aria-hidden="true" />{" "}
                    {johariBlind.redactMid}{" "}
                    <span className="redbar redbar--sm" aria-hidden="true" />
                  </p>

                  <dl className="bsm-dialogue">
                    {johariBlind.dialogue.map((d) => (
                      <div key={d.dt}>
                        <dt>{d.dt}</dt>
                        <dd>{d.dd}</dd>
                      </div>
                    ))}
                  </dl>

                  <blockquote className="bsm-verbatim">
                    <mark>“{johariBlind.quote.text}”</mark>
                    <cite>{johariBlind.quote.source}</cite>
                  </blockquote>

                  <div className="bsm-signal">
                    <span className="bsm-signal-label">
                      {johariBlind.confidenceLabel}
                    </span>
                    <span className="bsm-meter" aria-hidden="true">
                      <span
                        className="bsm-meter-fill"
                        style={{ width: `${johariBlind.confidence}%` }}
                      />
                    </span>
                    <span className="bsm-meter-num">
                      {johariBlind.confidence}%
                    </span>
                  </div>

                  <ul className="bsm-pattern" aria-hidden="true">
                    {johariBlind.pattern.map((p) => (
                      <li key={p.label} className={`bsm-pat is-${p.dir}`}>
                        <span className="bsm-pat-label">{p.label}</span>
                        <span className="bsm-pat-val">{p.value}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="bsm-verdict">
                    {johariBlind.verdict.lead}{" "}
                    <em>{johariBlind.verdict.em1}</em> {johariBlind.verdict.mid}{" "}
                    <em>{johariBlind.verdict.em2}</em>
                  </p>

                  <div className="bsm-evstack" aria-hidden="true">
                    {johariBlind.evidenceStack.map((e) => (
                      <span key={e} className="bsm-evcard">
                        {e}
                      </span>
                    ))}
                  </div>

                  <p className="bsm-source ff-dim">{johariBlind.source}</p>

                  <span
                    className="bsm-room-note bsm-room-note--blind"
                    aria-hidden="true"
                  >
                    {johariBlind.note}
                  </span>
                  <span
                    className="bsm-room-coord bsm-room-coord--blind"
                    aria-hidden="true"
                  >
                    {johariBlind.coord}
                  </span>
                </div>
              </div>
            </div>
            </div>
           </div>
          </div>
        </div>

        <figcaption className="bsm-cap">
          <strong>{johariCaption.strong}</strong>
          {johariCaption.rest}
        </figcaption>
      </Plate>
    </Reveal>
  );
}
