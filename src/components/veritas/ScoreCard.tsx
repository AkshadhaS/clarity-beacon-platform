import { cn } from "@/lib/utils";

export function ScoreCard({
  label,
  value,
  hint,
  inverted = false,
}: {
  label: string;
  value: number;
  hint?: string;
  inverted?: boolean; // for bias/manipulation where lower = better
}) {
  const v = Math.max(0, Math.min(100, value));
  const effective = inverted ? 100 - v : v;
  const tone =
    effective >= 75
      ? "text-severity-low"
      : effective >= 50
        ? "text-severity-medium"
        : effective >= 25
          ? "text-severity-high"
          : "text-severity-critical";

  return (
    <div className="group rounded-md border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <span className={cn("text-mono text-xs tabular-nums", tone)}>
          {inverted ? `${v}` : v}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={cn("text-mono text-2xl font-semibold tabular-nums", tone)}>{v}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full transition-all", tone.replace("text-", "bg-"))}
          style={{ width: `${v}%` }}
        />
      </div>
      {hint && <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
