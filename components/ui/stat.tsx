import type { ProofCell } from "@/types";

/**
 * A proof-band cell — either a large display number or an italic phrase,
 * with an uppercase caption beneath.
 */
export function ProofStat({ cell }: { cell: ProofCell }) {
  return (
    <div className="proof-cell">
      {cell.kind === "number" ? (
        <span className="proof-num">{cell.value}</span>
      ) : (
        <span className="proof-phrase">{cell.value}</span>
      )}
      <span className="proof-cap">{cell.caption}</span>
    </div>
  );
}
