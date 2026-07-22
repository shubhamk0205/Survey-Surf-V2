"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Slip } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import {
  navigation,
  primaryCta,
  sectionIds,
  siteConfig,
} from "@/lib/constants";

/**
 * Sticky masthead: wordmark, contents nav, and the primary call to action.
 *
 * When the page carries a dark cover (`[data-dark-hero]`), the bar reads as
 * part of the wall while the cover is in view, then resolves to the ivory bar
 * once it scrolls away. The effect is gated to pages that actually have a dark
 * hero, so every other surface keeps the unchanged, solid masthead.
 */
export function Masthead() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  // Default to the dark treatment on the home cover to avoid a load flash.
  const [onDark, setOnDark] = useState(pathname === "/");

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-dark-hero]");
    const header = headerRef.current;
    if (!hero || !header) {
      setOnDark(false);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
      setOnDark(window.scrollY < heroBottom - header.offsetHeight);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <header ref={headerRef} className={cn("masthead", onDark && "masthead--on-dark")}>
      <Container className="masthead-in">
        <Link className="wordmark" href={`#${sectionIds.top}`}>
          {siteConfig.wordmark.first}
          <span className="wm-dot">{siteConfig.wordmark.dot}</span>
          {siteConfig.wordmark.second}
        </Link>
        <nav className="masthead-links" aria-label="Contents">
          {navigation.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Slip
            href={primaryCta.href}
            size="small"
            tone={onDark ? "ink" : "default"}
          >
            {primaryCta.label}
          </Slip>
        </nav>
      </Container>
    </header>
  );
}
