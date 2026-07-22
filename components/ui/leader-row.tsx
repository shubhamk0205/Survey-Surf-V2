import { cn } from "@/lib/utils";
import type { LeaderItem } from "@/types";

/**
 * A dot-leader row: index, name, dotted leader, optional tag and arrow.
 * The building block of every editorial index (sources, campaigns, the two
 * Johari lists).
 */
export function LeaderRow({
  item,
  className,
}: {
  item: LeaderItem;
  className?: string;
}) {
  return (
    <div className={cn("leader-row", className)}>
      <span className="leader-num">{item.num}</span>
      <span className="leader-name">{item.name}</span>
      <span className="leader-dots" aria-hidden="true" />
      {item.tag ? <span className="leader-tag">{item.tag}</span> : null}
      {item.arrow ? (
        <span className="leader-arrow" aria-hidden="true">
          →
        </span>
      ) : null}
    </div>
  );
}
