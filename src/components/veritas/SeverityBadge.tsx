import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/mockData";

const map: Record<Severity, { label: string; cls: string }> = {
  low: { label: "Low", cls: "bg-severity-low/12 text-severity-low border-severity-low/30" },
  medium: { label: "Medium", cls: "bg-severity-medium/12 text-severity-medium border-severity-medium/30" },
  high: { label: "High", cls: "bg-severity-high/12 text-severity-high border-severity-high/30" },
  critical: { label: "Critical", cls: "bg-severity-critical/12 text-severity-critical border-severity-critical/40" },
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const cfg = map[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]",
        cfg.cls,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}
