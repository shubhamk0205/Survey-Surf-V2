import { GapInstrument } from "@/components/figures/gap-instrument";
import { Footnotes, FootnoteMark } from "@/components/ui/footnotes";
import { Chapter } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { sectionIds } from "@/lib/constants";
import { gap } from "@/lib/content";

/** Chapter 01 — the costly gap between self-image and market-image. */
export function GapSection() {
  return (
    <Chapter id={sectionIds.gap}>
      <SectionHeader
        opener={gap.opener}
        standfirst={
          <>
            {gap.opener.standfirst}
            <FootnoteMark
              id={gap.footnote.id}
              marker="1"
              note={gap.footnote.text}
            />
          </>
        }
      />
      <GapInstrument />
      <Footnotes
        items={[{ id: gap.footnote.id, marker: "1", text: gap.footnote.text }]}
      />
    </Chapter>
  );
}
