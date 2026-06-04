import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/veritas/TopBar";
import { SeverityBadge } from "@/components/veritas/SeverityBadge";
import { analyses } from "@/lib/mockData";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — VeritasIQ" }] }),
  component: Reports,
});

function Reports() {
  return (
    <>
      <TopBar title="Reports" breadcrumb={["Workspace", "Reports"]} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-4 p-6">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-2">
            {analyses.map((a) => (
              <article key={a.id} className="overflow-hidden rounded-md border bg-card">
                <header className="hairline-b flex items-center justify-between bg-surface px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-mono text-[11px] text-muted-foreground">{a.id}</span>
                  </div>
                  <SeverityBadge severity={a.riskLevel} />
                </header>
                <div className="p-4">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{a.type} · {a.source}</div>
                  <h3 className="mt-1 text-[15px] font-semibold leading-tight">{a.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[13px] text-muted-foreground">{a.executiveSummary}</p>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {[
                      { l: "Cred", v: a.credibility },
                      { l: "Evid", v: a.evidence },
                      { l: "Bias", v: a.bias },
                      { l: "Manip", v: a.manipulation },
                    ].map((m) => (
                      <div key={m.l} className="rounded border bg-surface p-2 text-center">
                        <div className="text-mono text-sm font-semibold tabular-nums">{m.v}</div>
                        <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hairline-t flex items-center justify-between bg-surface px-4 py-2.5">
                  <Link to="/reports/$id" params={{ id: a.id }} className="text-[12px] font-medium text-primary">
                    Open report →
                  </Link>
                  <button className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground">
                    <Download className="h-3 w-3" /> Export
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
