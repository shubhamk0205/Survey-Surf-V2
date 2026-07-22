import { Hero } from "@/components/sections/hero";
import { TrustBand } from "@/components/sections/trust-band";

// TEMP verification route — hero + trust in isolation. Safe to delete.
export default function HeroPreview() {
  return (
    <>
      <Hero />
      <TrustBand />
      <div style={{ height: 120 }} />
    </>
  );
}
