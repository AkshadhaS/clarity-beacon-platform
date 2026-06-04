import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/veritas/TopBar";
import { SeverityBadge } from "@/components/veritas/SeverityBadge";
import { analyses, trendData, manipulationDistribution } from "@/lib/mockData";
import { ArrowUpRight, FileSearch, ShieldAlert, Activity, FileText } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Overview — VeritasIQ" }] }),
  component: Overview,
});

function Overview() {
  const stats = [
    { label: "Analyses (30d)", value: "312", delta: "+18%", icon: FileSearch },
    { label: "Critical findings", value: "47", delta: "+6", icon: ShieldAlert, tone: "text-severity-critical" },
    { label: "Median credibility", value: "53", delta: "−4", icon: Activity, tone: "text-severity-medium" },
    { label: "Reports exported", value: "184", delta: "+22%", icon: FileText },
  ];

  return (
    <>
      <TopBar title="Overview" breadcrumb={["Workspace", "Overview"]} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-6 p-6">
          <div className="grid gap-3 md:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-md border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{s.label}</span>
                    <Icon className={`h-4 w-4 text-muted-foreground ${s.tone ?? ""}`} />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-mono text-2xl font-semibold tabular-nums">{s.value}</span>
                    <span className="text-mono text-[11px] text-muted-foreground">{s.delta}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card title="Analysis throughput · 6 months">
              <SparkChart />
            </Card>
            <Card title="Top manipulation patterns">
              <ul className="divide-y">
                {manipulationDistribution.map((m) => {
                  const max = Math.max(...manipulationDistribution.map((x) => x.value));
                  const w = (m.value / max) * 100;
                  return (
                    <li key={m.name} className="flex items-center gap-3 py-2.5">
                      <span className="w-36 truncate text-[13px]">{m.name}</span>
                      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${w}%` }} />
                      </div>
                      <span className="text-mono w-10 text-right text-[11px] tabular-nums text-muted-foreground">{m.value}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          <Card
            title="Recent analyses"
            action={
              <Link to="/history" className="inline-flex items-center gap-1 text-[12px] text-primary">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
            padding={false}
          >
            <table className="w-full text-[13px]">
              <thead className="hairline-b bg-surface text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Title</th>
                  <th className="px-4 py-2.5 text-left font-medium">Type</th>
                  <th className="px-4 py-2.5 text-left font-medium">Risk</th>
                  <th className="px-4 py-2.5 text-right font-medium">Credibility</th>
                  <th className="px-4 py-2.5 text-right font-medium">Analyzed</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {analyses.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-surface/60">
                    <td className="max-w-md truncate px-4 py-3">
                      <Link to="/reports/$id" params={{ id: a.id }} className="font-medium hover:text-primary">{a.title}</Link>
                      <div className="text-[11px] text-muted-foreground">{a.source}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.type}</td>
                    <td className="px-4 py-3"><SeverityBadge severity={a.riskLevel} /></td>
                    <td className="px-4 py-3 text-right text-mono tabular-nums">{a.credibility}</td>
                    <td className="px-4 py-3 text-right text-mono text-[11px] text-muted-foreground">
                      {new Date(a.analyzedAt).toLocaleDateString()}
                    </td>
                    <td className="pr-4">
                      <Link to="/reports/$id" params={{ id: a.id }} className="text-primary"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </main>
    </>
  );
}

function Card({ title, action, children, padding = true }: { title: string; action?: React.ReactNode; children: React.ReactNode; padding?: boolean }) {
  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <header className="hairline-b flex items-center justify-between bg-surface px-4 py-2.5">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{title}</span>
        {action}
      </header>
      <div className={padding ? "p-4" : ""}>{children}</div>
    </section>
  );
}

function SparkChart() {
  const max = Math.max(...trendData.map((d) => d.analyses));
  return (
    <div>
      <div className="flex items-end gap-3">
        <div className="text-mono text-3xl font-semibold tabular-nums">312</div>
        <div className="pb-1 text-[11px] text-muted-foreground">analyses · last 30 days</div>
      </div>
      <svg viewBox="0 0 600 160" className="mt-4 h-44 w-full">
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="0" x2="600" y1={i * 40} y2={i * 40} className="stroke-grid" strokeWidth="1" />
        ))}
        {(() => {
          const pts = trendData.map((d, i) => [40 + i * 104, 150 - (d.analyses / max) * 130]);
          const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
          const area = `${path} L ${pts[pts.length - 1][0]} 150 L ${pts[0][0]} 150 Z`;
          return (
            <>
              <path d={area} fill="url(#g)" />
              <path d={path} className="stroke-primary" strokeWidth="1.6" fill="none" />
              {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r="3" className="fill-primary" />
              ))}
            </>
          );
        })()}
        {trendData.map((d, i) => (
          <text key={d.month} x={40 + i * 104} y={158} className="fill-muted-foreground text-mono text-[10px]" textAnchor="middle">
            {d.month}
          </text>
        ))}
      </svg>
    </div>
  );
}
