import { cn } from "@/lib/utils";

export function Logo({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative grid h-7 w-7 place-items-center rounded-[6px] bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M3 6l9-3 9 3v6c0 5-3.5 8.5-9 9-5.5-.5-9-4-9-9V6z" strokeLinejoin="round" />
          <path d="M8.5 12l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {!mark && (
        <div className="flex items-baseline gap-1">
          <span className="text-[15px] font-semibold tracking-tight">Veritas</span>
          <span className="text-[15px] font-semibold tracking-tight text-primary">IQ</span>
        </div>
      )}
    </div>
  );
}
