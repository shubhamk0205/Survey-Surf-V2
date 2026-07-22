import { cn } from "@/lib/utils";

/**
 * A ruled divider. `double` is the signature two-line chapter rule;
 * `hair` is a single hairline. Spacing overrides come via `className`
 * (e.g. Tailwind `mb-0`), keeping the token defaults intact.
 */
export function Rule({
  variant = "double",
  className,
}: {
  variant?: "double" | "hair";
  className?: string;
}) {
  return (
    <div
      className={cn(variant === "double" ? "rule-dbl" : "rule-hair", className)}
      aria-hidden="true"
    />
  );
}
