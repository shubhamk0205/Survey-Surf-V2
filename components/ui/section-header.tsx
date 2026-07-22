import type { ReactNode } from "react";

import { Folio } from "@/components/ui/folio";
import { Marginalia } from "@/components/ui/marginalia";
import { Row } from "@/components/ui/container";
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
 */
export function SectionHeader({
  opener,
  standfirst,
}: {
  opener: SectionOpener;
  standfirst?: ReactNode;
}) {
  const lead = standfirst ?? opener.standfirst;

  return (
    <header className="opener">
      <Row
        margin={
          opener.marginNote ? (
            <Marginalia>{opener.marginNote}</Marginalia>
          ) : undefined
        }
      >
        <Folio left={opener.folio.left} right={opener.folio.right} />
        <Rule />
        <Kicker no={opener.kickerNo}>{opener.kicker}</Kicker>
        <Heading as="h2" parts={opener.heading} />
        {lead ? (
          <Standfirst dropcap={opener.dropcap} colRead>
            {lead}
          </Standfirst>
        ) : null}
      </Row>
    </header>
  );
}
