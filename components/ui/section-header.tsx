import type { ReactNode } from "react";

import { Folio } from "@/components/ui/folio";
import { Marginalia } from "@/components/ui/marginalia";
import { Row } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Rule } from "@/components/ui/rule";
import { Heading, Kicker, Standfirst } from "@/components/ui/typography";
import type { SectionOpener } from "@/types";

/**
 * The chapter opener: folio, double rule, kicker, heading and (optional)
 * standfirst, with a marginalia note in the reserved margin column.
 * A single component drives the header of every chapter.
 *
 * Pass `standfirst` to override the plain-text standfirst with rich content
 * (e.g. one carrying a footnote mark).
 *
 * Pass `exhibit` to give the opener a companion visual: the editorial text
 * sits at reading width on the left and the visual fills the right half, so
 * an otherwise text-only chapter opens as a balanced ~50/50 spread instead of
 * a left-hugging text block. The folio and rule still span the full grid.
 */
export function SectionHeader({
  opener,
  standfirst,
  exhibit,
}: {
  opener: SectionOpener;
  standfirst?: ReactNode;
  exhibit?: ReactNode;
}) {
  const lead = standfirst ?? opener.standfirst;

  if (exhibit) {
    return (
      <header className="opener opener--split">
        <Folio left={opener.folio.left} right={opener.folio.right} />
        <Rule />
        <div className="opener-split">
          <div className="opener-lede">
            <Reveal>
              <Kicker no={opener.kickerNo}>{opener.kicker}</Kicker>
              <Heading as="h2" parts={opener.heading} />
              {lead ? (
                <Standfirst dropcap={opener.dropcap} colRead>
                  {lead}
                </Standfirst>
              ) : null}
            </Reveal>
            {opener.marginNote ? (
              <Marginalia className="opener-note">
                {opener.marginNote}
              </Marginalia>
            ) : null}
          </div>
          <div className="opener-exhibit">{exhibit}</div>
        </div>
      </header>
    );
  }

  return (
    <header className="opener">
      {/* Folio + rule span the full content grid so the chapter's dividing
          line and figure-label row align to the same right edge as the
          figures below — the heading and its margin note keep the editorial
          asymmetry inside the row. */}
      <Folio left={opener.folio.left} right={opener.folio.right} />
      <Rule />
      <Row
        margin={
          opener.marginNote ? (
            <Marginalia>{opener.marginNote}</Marginalia>
          ) : undefined
        }
      >
        <Reveal>
          <Kicker no={opener.kickerNo}>{opener.kicker}</Kicker>
          <Heading as="h2" parts={opener.heading} />
          {lead ? (
            <Standfirst dropcap={opener.dropcap} colRead>
              {lead}
            </Standfirst>
          ) : null}
        </Reveal>
      </Row>
    </header>
  );
}
