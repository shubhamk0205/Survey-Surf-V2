import { MethodScrolly } from "@/components/sections/method-scrolly";
import { Chapter } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { sectionIds } from "@/lib/constants";
import { methodOpener, methodStages } from "@/lib/content";

/**
 * Chapter 03 — How It Works.
 *
 * A sticky two-column scrollytelling chapter: a single visualization (the
 * perception engine) is pinned on the left and morphs through five states —
 * scattered opinion → an ordered field → themes → a few forces → one point —
 * as the five reading blocks on the right pass the viewport centre. Many
 * customer opinions → organized research → patterns → one hidden perception.
 */
export function MethodSection() {
  return (
    <Chapter id={sectionIds.method}>
      <SectionHeader opener={methodOpener} />
      <MethodScrolly stages={methodStages} />
    </Chapter>
  );
}
