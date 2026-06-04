import { cn } from "@/lib/utils";

export function ScoreGauge({
  value,
  size = 160,
  label = "Credibility",
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  const tone =
    clamped >= 75
      ? "text-severity-low"
      : clamped >= 50
        ? "text-severity-medium"
        : clamped >= 25
          ? "text-severity-high"
          : "text-severity-critical";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth="8"
            className="stroke-muted"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-700", tone)}
            stroke="currentColor"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-mono text-3xl font-semibold tabular-nums", tone)}>
            {Math.round(clamped)}
          </span>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            / 100
          </span>
        </div>
      </div>
      <span className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
