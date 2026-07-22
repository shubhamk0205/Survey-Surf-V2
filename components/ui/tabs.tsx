"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  ariaLabel: string;
  /** Wraps the whole widget (e.g. "dossier-tabs"). */
  className?: string;
  /** Wraps the tablist + appendix on one row (e.g. "plate-tab-bar"). */
  tabBarClassName?: string;
  /** Rendered beside the tablist inside the tab bar (e.g. a panel label). */
  appendix?: ReactNode;
  /** Applied to each panel (e.g. "dossier-panel"). */
  panelClassName?: string;
}

/**
 * Accessible tabs with roving tabindex and arrow-key navigation, matching the
 * reference "page-turn" behaviour. Used by the Multiplier and Dossier figures.
 */
export function Tabs({
  items,
  ariaLabel,
  className,
  tabBarClassName,
  appendix,
  panelClassName,
}: TabsProps) {
  const [active, setActive] = useState(() => items[0]?.id ?? "");
  const reduced = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % items.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + items.length) % items.length;
    }
    if (next > -1) {
      event.preventDefault();
      const target = items[next];
      if (!target) return;
      setActive(target.id);
      tabRefs.current[next]?.focus();
    }
  }

  const tablist = (
    <div className="thumb-tabs" role="tablist" aria-label={ariaLabel}>
      {items.map((item, index) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={`tab-${item.id}`}
            className="thumb-tab"
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={item.id}
            tabIndex={selected ? 0 : -1}
            onClick={() => setActive(item.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={className}>
      {tabBarClassName ? (
        <div className={tabBarClassName}>
          {tablist}
          {appendix}
        </div>
      ) : (
        tablist
      )}

      {items.map((item) => {
        const selected = item.id === active;
        return (
          <div
            key={item.id}
            id={item.id}
            role="tabpanel"
            aria-labelledby={`tab-${item.id}`}
            tabIndex={0}
            hidden={!selected}
            className={cn(panelClassName, selected && !reduced && "turn-in")}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
