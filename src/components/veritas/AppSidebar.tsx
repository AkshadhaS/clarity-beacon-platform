import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  FileSearch,
  History,
  FileText,
  Database,
  BarChart3,
  Settings,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/analyze", label: "New Analysis", icon: FileSearch },
  { to: "/history", label: "Analysis History", icon: History },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/intelligence", label: "Narrative Intelligence", icon: BarChart3 },
  { to: "/sources", label: "Sources", icon: Database },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="hairline-b flex h-14 items-center px-4">
        <Link to="/" className="text-sidebar-foreground">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-sidebar-foreground/50">
          Workspace
        </div>
        {items.map((it) => {
          const active = path === it.to || (it.to !== "/dashboard" && path.startsWith(it.to));
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 opacity-80" />
              <span className="flex-1">{it.label}</span>
              {active && <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="hairline-t p-3">
        <div className="rounded-md border border-sidebar-border bg-sidebar-accent/40 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/60">
              Plan
            </span>
            <span className="text-mono text-[10px] text-sidebar-primary">ANALYST</span>
          </div>
          <div className="mt-2 text-[11px] text-sidebar-foreground/70">
            842 / 2,000 analyses used this month
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-sidebar-border">
            <div className="h-full w-[42%] bg-sidebar-primary" />
          </div>
        </div>
      </div>
    </aside>
  );
}
