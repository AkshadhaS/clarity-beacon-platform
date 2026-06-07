import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  FileSearch,
  History,
  FileText,
  Database,
  BarChart3,
  Settings,
  ShieldAlert,
  Radio,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const workspace = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid, shortcut: "G O" },
  { to: "/analyze", label: "New Analysis", icon: FileSearch, shortcut: "N" },
  { to: "/history", label: "Analysis History", icon: History, shortcut: "G H" },
  { to: "/reports", label: "Reports", icon: FileText, shortcut: "G R" },
] as const;

const intel = [
  { to: "/intelligence", label: "Narrative Intelligence", icon: BarChart3 },
  { to: "/sources", label: "Sources Corpus", icon: Database },
] as const;

const settingsItems = [{ to: "/settings", label: "Workspace Settings", icon: Settings }] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="hairline-b flex h-14 items-center justify-between px-4">
        <Link to="/" className="text-sidebar-foreground">
          <Logo />
        </Link>
        <span className="text-mono rounded border border-sidebar-border bg-sidebar-accent/60 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em] text-sidebar-foreground/70">
          v3.4
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <NavSection label="Workspace" items={workspace} active={path} />
        <NavSection label="Intelligence" items={intel} active={path} className="mt-4" />
        <NavSection label="Admin" items={settingsItems} active={path} className="mt-4" />

        <div className="mt-6 px-2">
          <div className="text-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/50">
            Active Investigations
          </div>
          <ul className="mt-2 space-y-1">
            {[
              { id: "INV-2241", title: "Election narrative tracking", sev: "bg-severity-high" },
              { id: "INV-2237", title: "Pharma supplement campaign", sev: "bg-severity-critical" },
              { id: "INV-2229", title: "Corp earnings disclosures", sev: "bg-severity-medium" },
            ].map((i) => (
              <li
                key={i.id}
                className="group flex items-start gap-2 rounded px-2 py-1.5 hover:bg-sidebar-accent/40"
              >
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${i.sev}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-mono text-[10px] text-sidebar-foreground/60">{i.id}</div>
                  <div className="truncate text-[12px] text-sidebar-foreground/90">{i.title}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="hairline-t space-y-2 p-3">
        <div className="rounded-md border border-sidebar-border bg-sidebar-accent/40 p-3">
          <div className="flex items-center justify-between">
            <span className="text-mono text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/60">
              Status
            </span>
            <span className="inline-flex items-center gap-1 text-mono text-[10px] text-severity-low">
              <Radio className="h-2.5 w-2.5" /> LIVE
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-sidebar-foreground/70">
            <div>
              <div className="text-mono tabular-nums text-sidebar-foreground">99.98%</div>
              <div>Uptime</div>
            </div>
            <div>
              <div className="text-mono tabular-nums text-sidebar-foreground">142ms</div>
              <div>p95 latency</div>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-sidebar-border bg-sidebar-accent/40 p-3">
          <div className="flex items-center justify-between">
            <span className="text-mono text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/60">
              Plan
            </span>
            <span className="text-mono text-[10px] text-sidebar-primary">ANALYST</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between text-[11px] text-sidebar-foreground/70">
            <span>842 / 2,000</span>
            <span className="text-mono">42%</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-sidebar-border">
            <div className="h-full w-[42%] bg-sidebar-primary" />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md border border-severity-high/30 bg-severity-high/10 px-2.5 py-2 text-[11px] text-sidebar-foreground">
          <ShieldAlert className="h-3.5 w-3.5 text-severity-high" />
          <span className="flex-1">3 critical reports await review</span>
        </div>
      </div>
    </aside>
  );
}

function NavSection({
  label,
  items,
  active,
  className,
}: {
  label: string;
  items: readonly { to: string; label: string; icon: React.ComponentType<{ className?: string }>; shortcut?: string }[];
  active: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="px-2 py-1.5 text-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/50">
        {label}
      </div>
      {items.map((it) => {
        const isActive = active === it.to || (it.to !== "/dashboard" && active.startsWith(it.to));
        const Icon = it.icon;
        return (
          <Link
            key={it.to}
            to={it.to}
            className={cn(
              "group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            {isActive && (
              <span className="absolute left-0 top-1.5 h-5 w-0.5 rounded-r bg-sidebar-primary" />
            )}
            <Icon className="h-4 w-4 opacity-80" />
            <span className="flex-1">{it.label}</span>
            {it.shortcut && (
              <span className="text-mono rounded border border-sidebar-border/60 px-1 text-[9px] text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70">
                {it.shortcut}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
