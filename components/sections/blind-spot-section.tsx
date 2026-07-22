import { BlindSpotPrimer } from "@/components/figures/blind-spot-primer";
import { BlindSpotMatrix } from "@/components/figures/johari-matrix";
import { Footnotes, FootnoteMark } from "@/components/ui/footnotes";
import { Chapter } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { sectionIds } from "@/lib/constants";
import { blindSpotFootnote, blindSpotOpener } from "@/lib/content";

/** Chapter 02 — the room you can't see into: the Johari perception matrix. */
export function BlindSpotSection() {
  return (
    <Chapter id={sectionIds.blindspot}>
      <SectionHeader
        opener={blindSpotOpener}
        standfirst={
          <>
            {blindSpotOpener.standfirst}
            <FootnoteMark
              id={blindSpotFootnote.id}
              marker="2"
              note={blindSpotFootnote.text}
            />
          </>
        }
      />

      <BlindSpotPrimer />

      <BlindSpotMatrix />

      <Footnotes
        items={[
          {
            id: blindSpotFootnote.id,
            marker: "2",
            text: blindSpotFootnote.text,
          },
        ]}
      />
    </Chapter>
  );
}
