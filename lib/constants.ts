import type { NavLink } from "@/types";

/**
 * Global, brand-level constants. Anything that identifies the product or is
 * referenced across many surfaces lives here.
 */
export const siteConfig = {
  name: "Survey Surf",
  wordmark: { first: "SURVEY", dot: " · ", second: "SURF" },
  tagline: "The perception company.",
  issue: "SS · ISSUE 01",
  description:
    "We gather the signals your customers already leave behind — in reviews, communities, tickets and calls — and reveal the gap between how you think the market sees you and how it actually feels.",
  domain: "www.surveysurf.in",
  /** Absolute origin, resolved from validated env. */
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "en_US",
  email: "hello@surveysurf.in",
  twitter: "@surveysurf",
  copyright: "© 2026 · WWW.SURVEYSURF.IN",
} as const;

/** In-page contents navigation shown in the masthead. */
export const navigation: NavLink[] = [
  { label: "The gap", href: "#gap" },
  { label: "The blind spot", href: "#blindspot" },
  { label: "How it works", href: "#method" },
];

/** Primary call to action, reused across the masthead, hero and back cover. */
export const primaryCta: NavLink = {
  label: "See your blind spot",
  href: "/contact",
};

/** The colophon's contents index — the closing page's quiet sitemap. */
export const footerNav: NavLink[] = [
  { label: "The Gap", href: "#gap" },
  { label: "Blind Spot", href: "#blindspot" },
  { label: "How It Works", href: "#method" },
  { label: "Case Studies", href: "#dossier" },
  { label: "Pricing", href: "/contact" },
  { label: "Resources", href: "#sources" },
  { label: "Contact", href: "/contact" },
];

/** The colophon's direct lines — email and one social, no icons. */
export const footerContact: NavLink[] = [
  { label: "hello@surveysurf.in", href: "mailto:hello@surveysurf.in" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/surveysurf" },
];

/** Section anchors — single source of truth for in-page navigation. */
export const sectionIds = {
  top: "top",
  gap: "gap",
  blindspot: "blindspot",
  method: "method",
  multiplier: "multiplier",
  sources: "sources",
  dossier: "dossier",
  philosophy: "philosophy",
} as const;
