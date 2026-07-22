import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { ChapterSeam as ChapterSeamType } from "@/types";

/**
 * The seam between two chapters — the connective tissue read in the whitespace
 * where one ends and the next begins. A centered issue marker on a hairline,
 * a line that concludes the chapter just read (leadOut), and a forward teaser
 * that is a real jump-link into the next chapter (its running head, small-caps).
 *
 * It never restates the next headline: the teaser sets it up, so the chapter
 * opener that follows delivers rather than repeats. Placed between sections in
 * app/page.tsx; the following `.chapter` tightens its top rhythm to sit under
 * the seam as one continuous break.
 */
export function ChapterSeam({ seam }: { seam: ChapterSeamType }) {
  return (
    <div className="seam">
      <Container>
        <Reveal className="seam-in">
          {/* thin divider + issue number — one bound document, continued */}
          <p className="seam-issue">{seam.issue}</p>

          <div className="seam-body">
            {/* lead-out — the chapter just read, concluded */}
            <p className="seam-out">
              <span className="seam-mark" aria-hidden="true" />
              {seam.leadOut}
            </p>

            {/* forward teaser — a real jump into the next chapter */}
            <a className="seam-next" href={seam.nextHref}>
              <span className="seam-teaser">{seam.teaser}</span>
              <span className="seam-cue">
                <span className="seam-next-head">{seam.next}</span>
                <span className="seam-arrow" aria-hidden="true">
                  ↓
                </span>
              </span>
            </a>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
