import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/veritas/TopBar";
import {
  trendData,
  manipulationDistribution,
  fallacyDistribution,
  credibilityBuckets,
  sourceReliability,
  emergingNarratives,
  sourceReliabilityShifts,
  investigationPhases,
  narrativeClusters,
  type NarrativeCluster,
} from "@/lib/mockData";
import { ArrowDownRight, ArrowUpRight, Minus, Activity } from "lucide-react";

export const Route = createFileRoute("/_app/intelligence")({
  head: () => ({ meta: [{ title: "Narrative Intelligence — VeritasIQ" }] }),
  component: Intelligence,
});

function Intelligence() {
  return (
    <>
      <TopBar title="Narrative Intelligence" breadcrumb={["Workspace", "Intelligence"]} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-5 p-6">
          {/* Command bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-card px-4 py-2.5">
            <div className="flex items-center gap-2 text-[11px]">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span className="text-mono uppercase tracking-[0.14em] text-muted-foreground">Narrative Command</span>
              <span className="text-muted-foreground">·</span>
              <span>23 narratives tracked · 5 clusters under active escalation</span>
            </div>
            <div className="flex items-center gap-1.5">
              {["24h","7d","30d","Quarter"].map((t,i) => (
                <button key={t} className={`rounded border px-2 py-0.5 text-[11px] ${i===1 ? "border-primary/40 bg-primary/5" : "border-transparent text-muted-foreground hover:bg-accent"}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <Stat label="Narratives tracked" value="23" delta="+4 this week" tone="text-primary" />
            <Stat label="Critical clusters" value="2" delta="↑ escalating" tone="text-severity-critical" />
            <Stat label="Median credibility" value="57" delta="−6 vs 30d" tone="text-severity-high" />
            <Stat label="Risk-weighted reach" value="9.1M" delta="impressions · 7d" tone="text-severity-medium" />
          </div>

          {/* Narrative clusters command center */}
          <Card title="Narrative clusters · 9-day amplification" right={<span className="text-mono text-[10px] text-muted-foreground">{narrativeClusters.length} active</span>}>
            <ClusterGrid />
          </Card>

          {/* Tracker + Pipeline */}
          <Card title="Emerging narratives · tracker" right={<span className="text-mono text-[10px] text-muted-foreground">5 highlighted · 23 total</span>}>
            <NarrativeTable />
          </Card>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
            <Card title="Investigation pipeline · by phase"><Phases /></Card>
            <Card title="Source reliability · 30d shifts" right={<Link to="/sources" className="text-mono text-[10px] text-primary">open corpus ›</Link>}>
              <SourceShifts />
            </Card>
          </div>

          <Card title="Analysis throughput & median credibility · 6 months"><DualChart /></Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card title="Manipulation patterns · distribution"><Bars data={manipulationDistribution} /></Card>
            <Card title="Logical fallacies · distribution"><Bars data={fallacyDistribution} /></Card>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
            <Card title="Credibility score distribution"><Histogram data={credibilityBuckets} /></Card>
            <Card title="Source reliability by tier">
              <div className="space-y-3">
                {sourceReliability.map((t) => (
                  <div key={t.tier} className="grid grid-cols-[160px_1fr_auto] items-center gap-3">
                    <span className="text-[13px]">{t.tier}</span>
                    <div className="relative h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${t.value}%` }} /></div>
                    <span className="text-mono w-10 text-right text-[12px] tabular-nums">{t.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

function Stat({ label, value, delta, tone }: { label: string; value: string; delta: string; tone?: string }) {
  return (
    <div className="rounded-md border bg-card p-4">
      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-mono text-2xl font-semibold tabular-nums ${tone ?? ""}`}>{value}</span>
        <span className="text-mono text-[11px] text-muted-foreground">{delta}</span>
      </div>
    </div>
  );
}

function Card({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <header className="hairline-b flex items-center justify-between bg-surface px-4 py-2.5">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{title}</span>
        {right}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function ClusterGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {narrativeClusters.map((c) => <ClusterCard key={c.id} c={c} />)}
    </div>
  );
}

function ClusterCard({ c }: { c: NarrativeCluster }) {
  const tone = c.risk === "critical" ? "text-severity-critical border-severity-critical/40" : c.risk === "high" ? "text-severity-high border-severity-high/40" : c.risk === "medium" ? "text-severity-medium border-severity-medium/40" : "text-severity-low border-severity-low/40";
  const trendColor = c.risk === "critical" ? "var(--color-severity-critical)" : c.risk === "high" ? "var(--color-severity-high)" : c.risk === "medium" ? "var(--color-severity-medium)" : "var(--color-severity-low)";
  const max = Math.max(...c.trend); const min = Math.min(...c.trend);
  const pts = c.trend.map((v, i) => [(i / (c.trend.length - 1)) * 200, 60 - ((v - min) / Math.max(max - min, 1)) * 52 - 4]);
  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const delta = c.trend[c.trend.length - 1] - c.trend[0];
  return (
    <div className="rounded-md border bg-surface p-3">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-mono text-[10px] text-muted-foreground">{c.id}</span>
            <span className={`text-mono rounded border px-1 py-px text-[9px] uppercase tracking-[0.14em] ${tone}`}>{c.risk}</span>
          </div>
          <div className="mt-1 truncate text-[13px] font-medium">{c.label}</div>
          <div className="text-[10px] text-muted-foreground">{c.region}</div>
        </div>
        <div className="text-right">
          <div className="text-mono text-[16px] font-semibold tabular-nums">{c.trend[c.trend.length - 1]}</div>
          <div className={`text-mono text-[10px] tabular-nums ${delta >= 0 ? "text-severity-high" : "text-severity-low"}`}>{delta >= 0 ? "+" : ""}{delta} vel</div>
        </div>
      </div>
      <svg viewBox="0 0 200 60" className="mt-2 h-12 w-full">
        <path d={`${path} L 200 60 L 0 60 Z`} fill={trendColor} fillOpacity="0.12" />
        <path d={path} stroke={trendColor} strokeWidth="1.4" fill="none" />
      </svg>
      <div className="hairline-t mt-2 grid grid-cols-3 gap-2 pt-2 text-[10px]">
        <div><div className="text-muted-foreground">Nodes</div><div className="text-mono tabular-nums">{c.nodes}</div></div>
        <div><div className="text-muted-foreground">Amplifiers</div><div className="text-mono tabular-nums">{c.amplifiers}</div></div>
        <div><div className="text-muted-foreground">Risk</div><div className={`text-mono ${tone.split(" ")[0]}`}>{c.risk}</div></div>
      </div>
    </div>
  );
}

function statusTone(s: string) {
  switch (s) {
    case "debunked": return "text-severity-critical border-severity-critical/40 bg-severity-critical/10";
    case "verifying": return "text-severity-medium border-severity-medium/40 bg-severity-medium/10";
    case "corroborated": return "text-severity-low border-severity-low/40 bg-severity-low/10";
    default: return "text-primary border-primary/40 bg-primary/10";
  }
}

function NarrativeTable() {
  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-[12px]">
        <thead className="hairline-b bg-surface text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left font-medium">ID</th>
            <th className="px-3 py-2 text-left font-medium">Narrative</th>
            <th className="px-3 py-2 text-left font-medium">Region</th>
            <th className="px-3 py-2 text-left font-medium">Velocity</th>
            <th className="px-3 py-2 text-right font-medium">Cred.</th>
            <th className="px-3 py-2 text-left font-medium">Status</th>
            <th className="px-3 py-2 text-right font-medium">Sources</th>
            <th className="px-3 py-2 text-right font-medium">First seen</th>
          </tr>
        </thead>
        <tbody>
          {emergingNarratives.map((n) => (
            <tr key={n.id} className="border-t hover:bg-surface/60">
              <td className="px-3 py-2.5 text-mono text-[11px] text-muted-foreground">{n.id}</td>
              <td className="px-3 py-2.5">
                <div className="max-w-md truncate font-medium">{n.title}</div>
                <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{n.sentiment}</div>
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">{n.region}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-20 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full ${n.velocity > 75 ? "bg-severity-critical" : n.velocity > 50 ? "bg-severity-high" : "bg-primary"}`} style={{ width: `${n.velocity}%` }} />
                  </div>
                  <span className="text-mono text-[10px] tabular-nums text-muted-foreground">{n.reach}</span>
                </div>
              </td>
              <td className="px-3 py-2.5 text-right">
                <span className={`text-mono tabular-nums ${
                  n.credibility >= 70 ? "text-severity-low" : n.credibility >= 50 ? "text-severity-medium" : n.credibility >= 30 ? "text-severity-high" : "text-severity-critical"
                }`}>{n.credibility}</span>
              </td>
              <td className="px-3 py-2.5">
                <span className={`text-mono inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${statusTone(n.status)}`}>{n.status}</span>
              </td>
              <td className="px-3 py-2.5 text-right text-mono text-[11px] tabular-nums text-muted-foreground">{n.sources}</td>
              <td className="px-3 py-2.5 text-right text-mono text-[11px] text-muted-foreground">{n.firstSeen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Phases() {
  const max = Math.max(...investigationPhases.map((p) => p.count));
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[160px_1fr_auto] items-center gap-3 text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>Phase</span><span>Cases in phase</span><span className="text-right">Count</span>
      </div>
      {investigationPhases.map((p) => {
        const tone = p.color === "low" ? "bg-severity-low" : p.color === "high" ? "bg-severity-high" : p.color === "medium" ? "bg-severity-medium" : "bg-primary";
        return (
          <div key={p.phase} className="grid grid-cols-[160px_1fr_auto] items-center gap-3">
            <span className="text-[13px]">{p.phase}</span>
            <div className="relative h-2 overflow-hidden rounded-full bg-muted">
              <div className={`h-full ${tone}`} style={{ width: `${(p.count / max) * 100}%` }} />
            </div>
            <span className="text-mono w-10 text-right text-[12px] tabular-nums">{p.count}</span>
          </div>
        );
      })}
      <div className="hairline-t pt-3 text-[11px] text-muted-foreground">
        111 active cases · median time-to-brief 4h 12m · 22 awaiting evidence corroboration.
      </div>
    </div>
  );
}

function SourceShifts() {
  return (
    <ul className="divide-y">
      {sourceReliabilityShifts.map((s) => {
        const diff = s.curr - s.prev;
        const Trend = diff > 0 ? ArrowUpRight : diff < 0 ? ArrowDownRight : Minus;
        const tone = diff > 0 ? "text-severity-low" : diff < 0 ? "text-severity-high" : "text-muted-foreground";
        return (
          <li key={s.domain} className="flex items-start justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <div className="text-mono text-[12px]">{s.domain}</div>
              <div className="text-[11px] text-muted-foreground">{s.reason}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-mono text-[11px] tabular-nums text-muted-foreground line-through">{s.prev}</span>
                <span className="text-mono text-[14px] font-semibold tabular-nums">{s.curr}</span>
                <Trend className={`h-3 w-3 ${tone}`} />
              </div>
              <div className={`text-mono text-[10px] tabular-nums ${tone}`}>{diff > 0 ? "+" : ""}{diff}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Bars({ data }: { data: { name: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <ul className="space-y-2">
      {data.map((d) => (
        <li key={d.name} className="flex items-center gap-3">
          <span className="w-40 truncate text-[13px]">{d.name}</span>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${(d.value / max) * 100}%` }} /></div>
          <span className="text-mono w-10 text-right text-[11px] tabular-nums text-muted-foreground">{d.value}</span>
        </li>
      ))}
    </ul>
  );
}

function Histogram({ data }: { data: { range: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="flex h-56 items-end gap-3">
      {data.map((d) => (
        <div key={d.range} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div className="w-full rounded-t bg-primary/80 transition-all hover:bg-primary" style={{ height: `${(d.count / max) * 100}%` }} title={`${d.count} analyses`} />
          </div>
          <span className="text-mono text-[10px] text-muted-foreground">{d.range}</span>
          <span className="text-mono text-[11px] font-semibold tabular-nums">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

function DualChart() {
  const max = Math.max(...trendData.map((d) => d.analyses));
  return (
    <svg viewBox="0 0 800 220" className="h-56 w-full">
      <defs>
        <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0,1,2,3,4].map((i) => (
        <line key={i} x1="0" x2="800" y1={i * 50} y2={i * 50} className="stroke-grid" strokeWidth="1" />
      ))}
      {(() => {
        const pts = trendData.map((d, i) => [60 + i * 130, 200 - (d.analyses / max) * 170]);
        const credPts = trendData.map((d, i) => [60 + i * 130, 200 - (d.avgCredibility / 100) * 170]);
        const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
        const area = `${path} L ${pts[pts.length - 1][0]} 200 L ${pts[0][0]} 200 Z`;
        const credPath = credPts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
        return (
          <>
            <path d={area} fill="url(#g2)" />
            <path d={path} className="stroke-primary" strokeWidth="1.8" fill="none" />
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" className="fill-primary" />)}
            <path d={credPath} className="stroke-severity-medium" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
            {credPts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.5" className="fill-severity-medium" />)}
          </>
        );
      })()}
      {trendData.map((d, i) => (
        <text key={d.month} x={60 + i * 130} y={216} className="fill-muted-foreground text-mono text-[10px]" textAnchor="middle">{d.month}</text>
      ))}
    </svg>
  );
}
