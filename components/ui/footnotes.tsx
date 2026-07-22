import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/reveal";

/**
 * An inline footnote reference. The note text is exposed via `data-note` and
 * shown on hover/focus (styled in globals.css); the anchor jumps to the entry.
 */
export function FootnoteMark({
  id,
  marker,
  note,
}: {
  id: string;
  marker: string;
  note: string;
}) {
  return (
    <a className="fn-mark" href={`#${id}`} data-note={note}>
      <sup>{marker}</sup>
    </a>
  );
}

export interface FootnoteEntry {
  id: string;
  marker: string;
  text: ReactNode;
}

/** The footnotes block printed at the foot of a chapter. */
export function Footnotes({ items }: { items: FootnoteEntry[] }) {
  return (
    <Reveal as="ol" className="footnotes">
      {items.map((item) => (
        <li key={item.id} id={item.id}>
          <span className="fno">{item.marker}</span>
          {item.text}
        </li>
      ))}
    </Reveal>
  );
}
