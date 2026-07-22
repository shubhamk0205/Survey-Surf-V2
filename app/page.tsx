import type { Metadata } from "next";

import { BlindSpotSection } from "@/components/sections/blind-spot-section";
import { DossierSection } from "@/components/sections/dossier-section";
import { GapSection } from "@/components/sections/gap-section";
import { Hero } from "@/components/sections/hero";
import { MethodSection } from "@/components/sections/method-section";
import { MultiplierSection } from "@/components/sections/multiplier-section";
import { PhilosophySection } from "@/components/sections/philosophy-section";
import { SourcesSection } from "@/components/sections/sources-section";
import { Ticker } from "@/components/sections/ticker";
import { TranscriptSpread } from "@/components/sections/transcript-spread";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ path: "/" });

/** Issue 01 — the front page, read top to bottom. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <GapSection />
      <BlindSpotSection />
      <MethodSection />
      <TranscriptSpread />
      <MultiplierSection />
      <SourcesSection />
      <Ticker />
      <DossierSection />
      <PhilosophySection />
    </>
  );
}
