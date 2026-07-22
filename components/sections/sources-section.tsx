import { LeaderRow } from "@/components/ui/leader-row";
import { InkSequence } from "@/components/ui/reveal";
import { Chapter } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { sectionIds } from "@/lib/constants";
import { sources, sourcesOpener } from "@/lib/content";

/** Chapter 05 — always listening: the ten sources, as a dot-leader index. */
export function SourcesSection() {
  return (
    <Chapter id={sectionIds.sources}>
      <SectionHeader opener={sourcesOpener} />
      <InkSequence className="sources-index">
        {sources.map((item) => (
          <LeaderRow key={item.num} item={item} />
        ))}
      </InkSequence>
    </Chapter>
  );
}
