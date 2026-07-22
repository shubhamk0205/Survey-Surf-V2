import { sectionIds } from "@/lib/constants";

/** Keyboard/screen-reader skip link — first focusable element on the page. */
export function SkipLink() {
  return (
    <a className="ss-skip" href={`#${sectionIds.top}`}>
      Skip to content
    </a>
  );
}
