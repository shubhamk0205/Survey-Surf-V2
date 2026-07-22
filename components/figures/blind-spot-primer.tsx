import { PenMark } from "@/components/ui/pen-mark";
import { Reveal } from "@/components/ui/reveal";
import { blindSpotPrimer } from "@/lib/content";

/**
 * The exhibit primer — the visual bridge between the chapter opener and FIG. 01.
 *
 * It replaces the old "what we look for / what you get" indices with a single
 * 3-vs-1 diagram: three faint rooms you already live in, a red hand-off arrow,
 * and the one dark room the market has already filed. Almost no prose — the
 * asymmetry does the explaining, and a caption hands the reader down to the
 * instrument itself.
 */
export function BlindSpotPrimer() {
  const { eyebrow, meta, known, blind, handoff } = blindSpotPrimer;

  return (
    <Reveal className="bsp">
      <div className="bsp-head">
        <span className="bsp-eyebrow app">{eyebrow}</span>
        <span className="bsp-meta app">{meta}</span>
      </div>

      <div className="bsp-diagram">
        {/* the three rooms you already walk through — a faint, grouped field */}
        <div className="bsp-known">
          <div className="bsp-glyphs" aria-hidden="true">
            {known.glyphs.map((n) => (
              <span key={n} className="bsp-glyph">
                {n}
              </span>
            ))}
          </div>
          <p className="bsp-known-label app">
            <span>{known.label}</span>
            <span className="bsp-known-sub">{known.sub}</span>
          </p>
          <p className="bsp-known-note">{known.note}</p>
        </div>

        {/* the hand-off — the whole point is the crossing */}
        <span className="bsp-arrow" aria-hidden="true">
          <span className="bsp-arrow-line" />
          <span className="bsp-arrow-head">→</span>
        </span>

        {/* the fourth room — the dominant, marked case file */}
        <div className="bsp-blind">
          <span className="bsp-corner" aria-hidden="true" />
          <span className="bsp-blind-mark app">{blind.mark}</span>
          <p className="bsp-blind-name">
            <PenMark variant="circle" className="bsp-blind-pen">
              {blind.name}
            </PenMark>
          </p>
          <p className="bsp-blind-note">
            {blind.note} <em>{blind.noteEm}</em>
          </p>
        </div>
      </div>

      <p className="bsp-handoff app">
        <span className="bsp-handoff-arrow" aria-hidden="true">
          ↓
        </span>
        {handoff}
      </p>
    </Reveal>
  );
}
