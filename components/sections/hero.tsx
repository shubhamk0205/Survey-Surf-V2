import { HeroAtmosphere } from "@/components/figures/hero-atmosphere";
import { HeroDesk } from "@/components/figures/hero-desk";
import { HeroScene } from "@/components/figures/hero-scene";
import { Slip } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PenMark } from "@/components/ui/pen-mark";
import { Reveal } from "@/components/ui/reveal";
import { hero } from "@/lib/content";

/**
 * The cover. A true split: an editorial lede stated on the dark wall of an
 * executive research room, beside FIG. A — the perception apparatus that proves
 * it. The headline makes the claim; millions of scattered signals are drawn
 * through a precision lens and resolve into the one perception that settles it.
 *
 * A full-bleed dark section: the night-lit room and its lamp-lit desk run edge
 * to edge behind the lede, the same inverted treatment the issue already uses
 * for the transcript spread and the back cover — now on the cover.
 */
export function Hero() {
  return (
    <section
      className="hero-cover"
      data-dark-hero
      aria-label="Survey Surf — the perception company"
    >
      {/* The dark research room: floor-to-ceiling windows onto a night skyline,
          a warm charcoal palette, and a left vignette — all live CSS. */}
      <div className="hero-room" aria-hidden="true" />
      {/* Volumetric light shafts thrown by the two architect lamps. */}
      <div className="hero-lights" aria-hidden="true" />
      {/* The lamp-lit executive desk, full-bleed along the bottom (SVG). */}
      <HeroDesk />
      {/* The air of the room — dust motes + haze catching the lamp light. */}
      <HeroAtmosphere />

      <Container className="hero-cover-in">
        <div className="hero-lede">
          <Reveal as="p" className="hero-eyebrow">
            {hero.caseFile}
          </Reveal>

          <Reveal
            as="h1"
            className="h1 hero-title"
            style={{ transitionDelay: "0.06s" }}
          >
            {/* Explicit line breaks, matching the reference exactly. */}
            <span className="htl">The market already</span>
            <span className="htl">has an opinion of you.</span>
            <span className="htl">You just haven’t</span>
            <PenMark variant="underline">{hero.heading.em}</PenMark>
          </Reveal>

          <Reveal
            as="p"
            className="hero-standfirst"
            style={{ transitionDelay: "0.14s" }}
          >
            {hero.standfirst}
          </Reveal>

          <Reveal className="hero-actions" style={{ transitionDelay: "0.22s" }}>
            <Slip href={hero.primaryCta.href} className="slip--paper">
              {hero.primaryCta.label}
              {"  →"}
            </Slip>
            <Slip href={hero.secondaryCta.href} tone="ink">
              {hero.secondaryCta.label}
            </Slip>
          </Reveal>

          <Reveal
            as="dl"
            className="hero-metrics"
            style={{ transitionDelay: "0.3s" }}
          >
            {hero.metrics.map((metric) => (
              <div className="hero-metric" key={metric.caption}>
                <dt className="hero-metric-val">{metric.value}</dt>
                <dd className="hero-metric-cap">{metric.caption}</dd>
              </div>
            ))}
          </Reveal>
        </div>

        {/* FIG. A — the perception apparatus, recreated entirely from live
            components (canvas particle flow + SVG lens + beam + cards). */}
        <div className="hero-exhibit-col">
          <HeroScene />
        </div>
      </Container>
    </section>
  );
}
