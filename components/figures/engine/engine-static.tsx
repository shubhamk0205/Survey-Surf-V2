import { buildOutcomes } from "@/components/figures/engine/engine-geometry";
import { FigHead, Plate, PlateCaption } from "@/components/ui/plate";
import {
  activateStage,
  collectStage,
  engineMeta,
  intakeSources,
  synthesizeStage,
  synthReadout,
} from "@/lib/content";
import type { EngineStage } from "@/types";

const STAGES: EngineStage[] = [collectStage, synthesizeStage, activateStage];
const OUTCOMES = buildOutcomes();

/** Deterministic scatter so server and client render identical marks. */
function scatter(i: number): { x: number; y: number } {
  const rx = Math.sin(i * 12.9898) * 43758.5453;
  const ry = Math.sin(i * 78.233) * 12345.6789;
  return {
    x: 24 + (rx - Math.floor(rx)) * 300,
    y: 18 + (ry - Math.floor(ry)) * 288,
  };
}

const CORE = { x: 500, y: 162 };
const RIGHT_X = 690;

/**
 * The engine at rest — the reduced-motion and no-JS presentation. A single
 * still that carries the whole methodology: scattered opinion on the left,
 * converging onto one perception at the centre, branching into the decisions
 * it moves on the right — with the three stages set out in full beneath it.
 * Nothing here moves, and it is complete on its own.
 */
export function EngineStatic() {
  return (
    <figure className="engine-static">
      <Plate className="engine-static-plate">
        <FigHead left={engineMeta.figLeft} right={engineMeta.figRight} />

        <div className="engine-static-diagram">
          <svg viewBox="0 0 1000 324" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {/* converging threads — a few representative lines onto the core */}
            {Array.from({ length: 7 }, (_, i) => {
              const s = scatter(i * 5 + 3);
              return (
                <line
                  key={`c${i}`}
                  className="es-thread"
                  x1={s.x}
                  y1={s.y}
                  x2={CORE.x}
                  y2={CORE.y}
                />
              );
            })}
            {/* scattered opinions */}
            {Array.from({ length: 96 }, (_, i) => {
              const s = scatter(i);
              return <rect key={i} className="es-mark" x={s.x} y={s.y} width={2.4} height={2.4} />;
            })}
            {/* branch threads → the outcomes */}
            {OUTCOMES.map((o, i) => {
              const y = 30 + (i / (OUTCOMES.length - 1)) * 264;
              return (
                <line
                  key={o.ref}
                  className={"es-branch" + (o.primary ? " is-primary" : "")}
                  x1={CORE.x}
                  y1={CORE.y}
                  x2={RIGHT_X}
                  y2={y}
                />
              );
            })}
            {/* the one perception */}
            <circle className="es-core-halo" cx={CORE.x} cy={CORE.y} r={34} />
            <circle className="es-core-ring" cx={CORE.x} cy={CORE.y} r={15} />
            <circle className="es-core" cx={CORE.x} cy={CORE.y} r={8} />
          </svg>

          {/* outcome labels, keyed to the branch endpoints */}
          <ul className="engine-static-outcomes">
            {OUTCOMES.map((o) => (
              <li key={o.ref} className={o.primary ? "is-primary" : undefined}>
                <b>{o.label}</b>
                <i>{o.ref}</i>
              </li>
            ))}
          </ul>

          <span className="engine-static-corelabel">
            <b>1 perception</b>
            <i>{synthReadout.blindSpot}</i>
          </span>
        </div>

        <ol className="engine-static-stages">
          {STAGES.map((stage) => (
            <li key={stage.no} className="engine-static-stage">
              <p className="engine-say-folio">
                <span className="engine-say-no">{stage.no}</span>
                <span className="engine-say-name">{stage.name}</span>
                <span className="engine-say-verb">{stage.verb}</span>
              </p>
              <h3 className="h3 engine-say-h">{stage.heading}</h3>
              <p className="engine-say-body">{stage.body}</p>
              <dl className="engine-static-readouts">
                {stage.readouts.map((r) => (
                  <div key={r.label}>
                    <dt>{r.label}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
              {stage.no === "01" ? (
                <p className="engine-static-sources">
                  {intakeSources.map((s) => s.name).join(" · ")}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </Plate>
      <PlateCaption>
        <strong>{engineMeta.staticCaption.strong}</strong>
        {engineMeta.staticCaption.rest}
      </PlateCaption>
    </figure>
  );
}
