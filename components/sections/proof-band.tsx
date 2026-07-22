import { Container } from "@/components/ui/container";
import { Folio } from "@/components/ui/folio";
import { Reveal } from "@/components/ui/reveal";
import { Rule } from "@/components/ui/rule";
import { ProofStat } from "@/components/ui/stat";
import { proofCells, proofFolio } from "@/lib/content";

/** On-the-record proof band — four cells beneath the hero. */
export function ProofBand() {
  return (
    <section className="proof" aria-label="Proof band">
      <Container>
        <Folio left={proofFolio.left} right={proofFolio.right} />
        <Rule className="mb-0" />
        <Reveal className="proof-grid">
          {proofCells.map((cell) => (
            <ProofStat key={cell.caption} cell={cell} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
