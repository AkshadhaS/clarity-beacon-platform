import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/veritas/TopBar";
import { SeverityBadge } from "@/components/veritas/SeverityBadge";
import { analyses } from "@/lib/mockData";
import { ArrowUpRight, Filter } from "lucide-react";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "Analysis History — VeritasIQ" }] }),
  component: History,
});

function History() {
  const [filter, setFilter] = useState<"all" | "Political" | "News" | "Social Media" | "Press Release">("all");
  const rows = analyses.filter((a) => filter === "all" || a.type === filter);

  // simulate repeated history
  const all = [...rows, ...rows, ...rows].map((r, i) => ({ ...r, _k: i, _date: new Date(Date.now() - i * 86400000 * 2) }));

  return (
    <>
      <TopBar title="Analysis History" breadcrumb={["Workspace", "History"]} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              {(["all", "Political", "News", "Social Media", "Press Release"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`rounded border px-2.5 py-1 text-[12px] ${
                    filter === t ? "border-primary/40 bg-primary/5 text-foreground" : "border-transparent text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {t === "all" ? "All types" : t}
                </button>
              ))}
            </div>
            <div className="text-mono text-[11px] text-muted-foreground">{all.length} records</div>
          </div>

          <div className="overflow-hidden rounded-md border bg-card">
            <table className="w-full text-[13px]">
              <thead className="hairline-b bg-surface text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">ID</th>
                  <th className="px-4 py-2.5 text-left font-medium">Title</th>
                  <th className="px-4 py-2.5 text-left font-medium">Type</th>
                  <th className="px-4 py-2.5 text-left font-medium">Risk</th>
                  <th className="px-4 py-2.5 text-right font-medium">Cred</th>
                  <th className="px-4 py-2.5 text-right font-medium">Bias</th>
                  <th className="px-4 py-2.5 text-right font-medium">Manip</th>
                  <th className="px-4 py-2.5 text-right font-medium">Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {all.map((a) => (
                  <tr key={a._k} className="border-t hover:bg-surface/60">
                    <td className="px-4 py-3 text-mono text-[11px] text-muted-foreground">{a.id}</td>
                    <td className="max-w-md truncate px-4 py-3 font-medium">
                      <Link to="/reports/$id" params={{ id: a.id }} className="hover:text-primary">{a.title}</Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.type}</td>
                    <td className="px-4 py-3"><SeverityBadge severity={a.riskLevel} /></td>
                    <td className="px-4 py-3 text-right text-mono tabular-nums">{a.credibility}</td>
                    <td className="px-4 py-3 text-right text-mono tabular-nums text-muted-foreground">{a.bias}</td>
                    <td className="px-4 py-3 text-right text-mono tabular-nums text-muted-foreground">{a.manipulation}</td>
                    <td className="px-4 py-3 text-right text-mono text-[11px] text-muted-foreground">
                      {a._date.toLocaleDateString()}
                    </td>
                    <td className="pr-4">
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
