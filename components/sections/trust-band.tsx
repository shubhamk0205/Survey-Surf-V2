import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { trust } from "@/lib/content";

/**
 * Subscribers of record — the trust band directly beneath the hero.
 * The teams who read us (a logo wall of placeholders) over a ruled row of
 * standing figures. Set as editorial wordmarks, not borrowed brand logos.
 */
export function TrustBand() {
  return (
    <section className="trust" aria-label="Trusted by">
      <Container>
        <Reveal className="trust-logos">
          <span className="trust-lead">{trust.lead}</span>
          <ul className="logo-row">
            {trust.logos.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="trust-stats">
          {trust.stats.map((stat) => (
            <div className="trust-cell" key={stat.caption}>
              <span className="trust-num">
                {stat.value}
                {stat.em ? <em>{stat.em}</em> : null}
              </span>
              <span className="trust-cap">{stat.caption}</span>
            </div>
          ))}
        </Reveal>

        <div className="trust-foot">
          <span>{trust.footLabel}</span>
          <em>{trust.footNote}</em>
        </div>
      </Container>
    </section>
  );
}
