import { Newsreader, Source_Serif_4, Libre_Franklin } from "next/font/google";

/**
 * The three editorial voices, self-hosted and optimized by next/font.
 * Each exposes a CSS variable consumed by the design tokens in globals.css:
 *   --font-newsreader      → --font-display (headlines, pull quotes)
 *   --font-source-serif    → --font-text    (reading copy)
 *   --font-libre-franklin  → --font-app     (all apparatus / labels)
 *
 * Variable fonts carry their full weight range; italics are loaded because
 * the design leans on them heavily (marginalia, pull quotes, emphasis).
 */
export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});

export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-source-serif",
});

export const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-libre-franklin",
});

/** Combined font variables, applied to <html> in the root layout. */
export const fontVariables = [
  newsreader.variable,
  sourceSerif.variable,
  libreFranklin.variable,
].join(" ");
