import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { Container, Row } from "@/components/ui/container";
import { Folio } from "@/components/ui/folio";
import { LinkPen } from "@/components/ui/link-pen";
import { Marginalia } from "@/components/ui/marginalia";
import { Rule } from "@/components/ui/rule";
import { Heading, Kicker, Standfirst } from "@/components/ui/typography";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "See your blind spot",
  description:
    "Tell us who you are and who you’re up against. We’ll hand you the one thing the market believes but has never said to your face — and how to change it.",
  path: "/contact",
});

/** The enquiry page — the destination of every "See your blind spot" CTA. */
export default function ContactPage() {
  return (
    <section className="chapter">
      <Container>
        <Row
          margin={
            <Marginalia>we read every one — by a person, not a bot.</Marginalia>
          }
        >
          <Folio left="SS · ISSUE 01 · ENQUIRY" right="RSVP" />
          <Rule />
          <Kicker>See Your Blind Spot</Kicker>
          <Heading
            as="h1"
            parts={{
              lead: "Tell us who you are —",
              em: "and who you’re up against.",
            }}
          />
          <Standfirst colRead>
            We’ll hand you the one thing the market believes but has never said
            to your face — and how to change it.
          </Standfirst>

          <ContactForm />

          <p className="mt-10">
            <LinkPen href="/">← Back to the issue</LinkPen>
          </p>
        </Row>
      </Container>
    </section>
  );
}
