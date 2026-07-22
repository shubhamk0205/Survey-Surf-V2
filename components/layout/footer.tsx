import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { footerContact } from "@/lib/constants";
import { colophon } from "@/lib/content";

/**
 * The colophon — the compact closing strip of the dossier.
 *
 * Not a SaaS footer: the final leaf of a printed intelligence report, reduced
 * to its imprint. Who we are on the left, the two ways to reach us on the
 * right; one hairline; then the bottom strip. Printed on near-black (#181612)
 * in warm ivory, with the editor's muted red reserved for marks. Fades upward
 * as it enters view.
 */
export function Footer() {
  const c = colophon;

  return (
    <footer className="colophon" aria-label="Colophon">
      <Container>
        {/* The imprint, in two columns */}
        <Reveal className="colophon-info">
          <div className="colophon-brand">
            <p className="colophon-wordmark">{c.brand.wordmark}</p>
            <p className="colophon-brand-tag">{c.brand.tagline}</p>
            <p className="colophon-brand-line">{c.brand.line}</p>
          </div>

          <div className="colophon-col">
            <p className="colophon-col-label">{c.contactLabel}</p>
            <ul>
              {footerContact.map((link) => {
                const external = link.href.startsWith("http");
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="colophon-link"
                      {...(external
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        {/* One hairline below the columns, then the bottom strip */}
        <div className="colophon-strip">
          <span className="colophon-strip-left">{c.strip.left}</span>
          <span className="colophon-strip-center">{c.strip.center}</span>
          <span className="colophon-strip-right">{c.strip.right}</span>
        </div>
      </Container>
    </footer>
  );
}
