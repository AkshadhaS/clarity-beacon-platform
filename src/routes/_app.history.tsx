import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/veritas/TopBar";
import { SeverityBadge } from "@/components/veritas/SeverityBadge";
import { analyses } from "@/lib/mockData";
import { ArrowUpRight, Filter, Search, Calendar } from "lucide-react";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "Investigation Log — VeritasIQ" }] }),
  component: History,
});

const ANALYSTS = ["A. Tan", "M. Okafor", "L. Park", "R. Velasquez"];
const NARRATIVES = ["NC-019", "NC-014", "NC-022", "NC-009", "NC-031"];

function History() {
  const [filter, setFilter] = useState<"all" | "Political" | "News" | "Social Media" | "Press Release">("all");
  const rows = analyses.filter((a) => filter === "all" || a.type === filter);
  const all = [...rows, ...rows, ...rows].map((r, i) => ({
    ...r, _k: i,
    _date: new Date(Date.now() - i * 86400000 * 2 - i * 3600000),
    _analyst: ANALYSTS[i % ANALYSTS.length],
    _narrative: NARRATIVES[i % NARRATIVES.length],
  }));

  return (
    <>
      <TopBar title="Investigation Log" breadcrumb={["Workspace", "History"]} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-4 p-6">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-card px-3 py-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              {(["all", "Political", "News", "Social Media", "Press Release"] as const).map((t) => (
                <button key={t} onClick={() => setFilter(t)}
                  className={`rounded border px-2.5 py-1 text-[12px] ${filter === t ? "border-primary/40 bg-primary/5 text-foreground" : "border-transparent text-muted-foreground hover:bg-accent"}`}>
                  {t === "all" ? "All dossiers" : t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded border bg-surface px-2 py-1 text-[11px] text-muted-foreground">
                <Search className="h-3 w-3" /><input placeholder="title · analyst · narrative" className="w-48 bg-transparent outline-none" />
              </div>
              <div className="flex items-center gap-1 rounded border bg-surface px-2 py-1 text-mono text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" />30d
              </div>
              <span className="text-mono text-[11px] text-muted-foreground">{all.length} records</span>
            </div>
          </div>

          {/* Summary strip */}
          <div className="grid gap-3 md:grid-cols-4">
            {[
              ["Briefings produced", String(all.length), "↑ 18% vs 30d", "text-primary"],
              ["Critical risk", String(all.filter(a => a.riskLevel === "critical").length * 2), "narratives debunked", "text-severity-critical"],
              ["Median credibility", String(Math.round(all.reduce((s,a) => s + a.credibility, 0) / all.length)), "of indexed dossiers", "text-severity-medium"],
              ["Open peer-reviews", "8", "SLA 2h", "text-severity-high"],
            ].map(([l, v, d, t]) => (
              <div key={l} className="rounded-md border bg-card p-3">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{l}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={`text-mono text-xl font-semibold tabular-nums ${t}`}>{v}</span>
                  <span className="text-mono text-[10px] text-muted-foreground">{d}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-md border bg-card">
            <table className="w-full text-[12px]">
              <thead className="hairline-b bg-surface text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">ID</th>
                  <th className="px-3 py-2 text-left font-medium">Dossier</th>
                  <th className="px-3 py-2 text-left font-medium">Type</th>
                  <th className="px-3 py-2 text-left font-medium">Narrative</th>
                  <th className="px-3 py-2 text-left font-medium">Analyst</th>
                  <th className="px-3 py-2 text-left font-medium">Risk</th>
                  <th className="px-3 py-2 text-right font-medium">Cred</th>
                  <th className="px-3 py-2 text-right font-medium">Bias</th>
                  <th className="px-3 py-2 text-right font-medium">Manip</th>
                  <th className="px-3 py-2 text-right font-medium">Closed</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {all.map((a) => (
                  <tr key={a._k} className="border-t hover:bg-surface/60">
                    <td className="px-3 py-2.5 text-mono text-[11px] text-muted-foreground">{a.id}</td>
                    <td className="max-w-md truncate px-3 py-2.5 font-medium">
                      <Link to="/reports/$id" params={{ id: a.id }} className="hover:text-primary">{a.title}</Link>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{a.type}</td>
                    <td className="px-3 py-2.5 text-mono text-[11px] text-primary">{a._narrative}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-primary/15 text-mono text-[8px] font-semibold text-primary">
                          {a._analyst.split(". ")[1]?.[0] ?? a._analyst[0]}
                        </span>
                        <span className="text-[11px]">{a._analyst}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5"><SeverityBadge severity={a.riskLevel} /></td>
                    <td className="px-3 py-2.5 text-right text-mono tabular-nums">{a.credibility}</td>
                    <td className="px-3 py-2.5 text-right text-mono tabular-nums text-muted-foreground">{a.bias}</td>
                    <td className="px-3 py-2.5 text-right text-mono tabular-nums text-muted-foreground">{a.manipulation}</td>
                    <td className="px-3 py-2.5 text-right text-mono text-[11px] text-muted-foreground">{a._date.toLocaleDateString()}</td>
                    <td className="pr-3">
                      <Link to="/reports/$id" params={{ id: a.id }} className="text-primary"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
