import { Bell, Command, Search, Activity, Globe2 } from "lucide-react";

export function TopBar({ title, breadcrumb }: { title: string; breadcrumb?: string[] }) {
  return (
    <header className="hairline-b sticky top-0 z-10 flex h-14 items-center gap-4 bg-background/85 px-5 backdrop-blur">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="min-w-0">
          {breadcrumb && (
            <div className="text-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {breadcrumb.join(" / ")}
            </div>
          )}
          <h1 className="truncate text-[15px] font-semibold tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="hidden items-center gap-1.5 rounded-md border bg-card/60 px-2.5 py-1 xl:flex">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-severity-low opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-severity-low" />
        </span>
        <span className="text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Pipeline · Operational
        </span>
        <span className="mx-1 h-3 w-px bg-border" />
        <Activity className="h-3 w-3 text-muted-foreground" />
        <span className="text-mono text-[10px] tabular-nums text-muted-foreground">42ms</span>
        <span className="mx-1 h-3 w-px bg-border" />
        <Globe2 className="h-3 w-3 text-muted-foreground" />
        <span className="text-mono text-[10px] tabular-nums text-muted-foreground">UTC 14:22</span>
      </div>

      <div className="relative hidden w-72 items-center md:flex">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search analyses, sources, claims…"
          className="h-9 w-full rounded-md border bg-card pl-8 pr-12 text-[13px] outline-none placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-ring"
        />
        <kbd className="text-mono absolute right-2 inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] text-muted-foreground">
          <Command className="h-2.5 w-2.5" /> K
        </kbd>
      </div>

      <button className="relative grid h-9 w-9 place-items-center rounded-md border bg-card hover:bg-accent">
        <Bell className="h-4 w-4 text-muted-foreground" />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-severity-high" />
      </button>

      <button className="flex items-center gap-2 rounded-md border bg-card pl-1.5 pr-2.5 hover:bg-accent">
        <div className="grid h-7 w-7 place-items-center rounded-[5px] bg-primary text-mono text-[11px] font-semibold text-primary-foreground">
          AT
        </div>
        <div className="hidden text-left lg:block">
          <div className="text-[12px] font-medium leading-tight">Alex Tan</div>
          <div className="text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Senior Analyst · L4
          </div>
        </div>
      </button>
    </header>
  );
}
