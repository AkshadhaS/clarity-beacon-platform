import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/veritas/TopBar";
import { SeverityBadge } from "@/components/veritas/SeverityBadge";
import { analyses, trendData, manipulationDistribution } from "@/lib/mockData";
import {
  ArrowUpRight,
  FileSearch,
  ShieldAlert,
  Activity,
  FileText,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Overview — VeritasIQ" }] }),
  component: Overview,
});

const kpis = [
  {
    label: "Analyses (30d)",
    value: "312",
    delta: "+18.4%",
    deltaDir: "up" as const,
    icon: FileSearch,
    spark: [142, 168, 201, 234, 289, 312],
    tone: "primary" as const,
  },
  {
    label: "Critical findings",
    value: "47",
    delta: "+6",
    deltaDir: "up" as const,
    icon: ShieldAlert,
    spark: [18, 22, 27, 33, 41, 47],
    tone: "critical" as const,
  },
  {
    label: "Median credibility",
    value: "53",
    delta: "−4 pts",
    deltaDir: "down" as const,
    icon: Activity,
    spark: [64, 61, 58, 57, 55, 53],
    tone: "medium" as const,
  },
  {
    label: "Reports exported",
    value: "184",
    delta: "+22%",
    deltaDir: "up" as const,
    icon: FileText,
    spark: [82, 91, 110, 132, 158, 184],
    tone: "low" as const,
  },
];

const toneMap = {
  primary: "text-primary",
  critical: "text-severity-critical",
  high: "text-severity-high",
  medium: "text-severity-medium",
  low: "text-severity-low",
} as const;

function Overview() {
  return (
    <>
      <TopBar title="Operations Overview" breadcrumb={["Workspace", "Overview"]} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-5 p-5">
          {/* KPI row */}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k) => {
              const Icon = k.icon;
              const Trend = k.deltaDir === "up" ? TrendingUp : TrendingDown;
              return (
                <div
                  key={k.label}
                  className="hairline-b group relative overflow-hidden rounded-md border bg-card p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {k.label}
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-mono text-[26px] font-semibold leading-none tabular-nums">
                          {k.value}
                        </span>
                        <span
                          className={`inline-flex items-center gap-0.5 text-mono text-[11px] tabular-nums ${
                            k.deltaDir === "up" ? "text-severity-low" : "text-severity-high"
                          }`}
                        >
                          <Trend className="h-3 w-3" />
                          {k.delta}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`grid h-8 w-8 place-items-center rounded border bg-surface ${toneMap[k.tone]}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <Sparkline data={k.spark} className="mt-3 h-9" tone={k.tone} />
                  <div className="mt-2 flex items-center justify-between text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    <span>6mo trend</span>
                    <span className="tabular-nums">vs prev. 30d</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Throughput + Heatmap */}
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <Card
              title="Analysis throughput · 6 months"
              right={
                <div className="flex items-center gap-3 text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  <Legend color="bg-primary" label="Throughput" />
                  <Legend color="bg-severity-medium" label="Median credibility" />
                </div>
              }
            >
              <DualChart />
            </Card>
            <Card title="Risk heatmap · weekday × hour">
              <Heatmap />
            </Card>
          </div>

          {/* Manipulation + Timeline */}
          <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <Card title="Top manipulation patterns">
              <ul className="divide-y">
                {manipulationDistribution.map((m) => {
                  const max = Math.max(...manipulationDistribution.map((x) => x.value));
                  const w = (m.value / max) * 100;
                  return (
                    <li key={m.name} className="flex items-center gap-3 py-2">
                      <span className="w-36 truncate text-[13px]">{m.name}</span>
                      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-chart-2"
                          style={{ width: `${w}%` }}
                        />
                      </div>
                      <span className="text-mono w-10 text-right text-[11px] tabular-nums text-muted-foreground">
                        {m.value}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>
            <Card title="Investigation activity · last 72h">
              <Timeline />
            </Card>
          </div>

          {/* Recent analyses */}
          <Card
            title="Recent analyses"
            right={
              <Link to="/history" className="inline-flex items-center gap-1 text-[12px] text-primary">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
            padding={false}
          >
            <table className="w-full text-[13px]">
              <thead className="hairline-b bg-surface text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">ID</th>
                  <th className="px-4 py-2.5 text-left font-medium">Title</th>
                  <th className="px-4 py-2.5 text-left font-medium">Type</th>
                  <th className="px-4 py-2.5 text-left font-medium">Risk</th>
                  <th className="px-4 py-2.5 text-left font-medium">Signal</th>
                  <th className="px-4 py-2.5 text-right font-medium">Credibility</th>
                  <th className="px-4 py-2.5 text-right font-medium">Analyzed</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {analyses.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-surface/60">
                    <td className="px-4 py-3 text-mono text-[11px] text-muted-foreground">{a.id}</td>
                    <td className="max-w-md truncate px-4 py-3">
                      <Link
                        to="/reports/$id"
                        params={{ id: a.id }}
                        className="font-medium hover:text-primary"
                      >
                        {a.title}
                      </Link>
                      <div className="text-[11px] text-muted-foreground">{a.source}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.type}</td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={a.riskLevel} />
                    </td>
                    <td className="px-4 py-3">
                      <SignalBars value={a.manipulation} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <CredCell value={a.credibility} />
                    </td>
                    <td className="px-4 py-3 text-right text-mono text-[11px] text-muted-foreground">
                      {new Date(a.analyzedAt).toLocaleDateString()}
                    </td>
                    <td className="pr-4">
                      <Link
                        to="/reports/$id"
                        params={{ id: a.id }}
                        className="text-primary"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
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

function Card({
  title,
  right,
  children,
  padding = true,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  padding?: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <header className="hairline-b flex items-center justify-between bg-surface px-4 py-2.5">
        <span className="text-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </span>
        {right}
      </header>
      <div className={padding ? "p-4" : ""}>{children}</div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-sm ${color}`} />
      {label}
    </span>
  );
}

function Sparkline({
  data,
  className,
  tone = "primary",
}: {
  data: number[];
  className?: string;
  tone?: keyof typeof toneMap;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 30 - ((v - min) / (max - min || 1)) * 28;
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const area = `${path} L 100 30 L 0 30 Z`;
  const stroke =
    tone === "critical"
      ? "stroke-severity-critical"
      : tone === "high"
      ? "stroke-severity-high"
      : tone === "medium"
      ? "stroke-severity-medium"
      : tone === "low"
      ? "stroke-severity-low"
      : "stroke-primary";
  const fill =
    tone === "critical"
      ? "fill-severity-critical/15"
      : tone === "medium"
      ? "fill-severity-medium/15"
      : tone === "low"
      ? "fill-severity-low/15"
      : "fill-primary/15";
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={`w-full ${className ?? ""}`}>
      <path d={area} className={fill} />
      <path d={path} className={stroke} strokeWidth="1.4" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function DualChart() {
  const max = Math.max(...trendData.map((d) => d.analyses));
  const w = 800;
  const h = 220;
  const pts = trendData.map((d, i) => [60 + i * 130, h - 30 - (d.analyses / max) * 150]);
  const credPts = trendData.map((d, i) => [60 + i * 130, h - 30 - (d.avgCredibility / 100) * 150]);
  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const area = `${path} L ${pts[pts.length - 1][0]} ${h - 30} L ${pts[0][0]} ${h - 30} Z`;
  const credPath = credPts
    .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full">
      <defs>
        <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.30" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
        <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill="var(--color-grid)" />
        </pattern>
      </defs>
      <rect width={w} height={h - 25} fill="url(#dots)" opacity="0.6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="40"
          x2={w - 10}
          y1={30 + i * 40}
          y2={30 + i * 40}
          className="stroke-grid"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
      ))}
      {[0, 25, 50, 75, 100].map((v, i) => (
        <text
          key={v}
          x="30"
          y={h - 25 - (v / 100) * 150 + 3}
          className="fill-muted-foreground text-mono"
          fontSize="9"
          textAnchor="end"
        >
          {Math.round((max * v) / 100)}
        </text>
      ))}
      <path d={area} fill="url(#g2)" />
      <path d={path} className="stroke-primary" strokeWidth="1.8" fill="none" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="6" className="fill-primary/15" />
          <circle cx={p[0]} cy={p[1]} r="3" className="fill-primary" />
        </g>
      ))}
      <path
        d={credPath}
        className="stroke-severity-medium"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        fill="none"
      />
      {credPts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.5" className="fill-severity-medium" />
      ))}
      {trendData.map((d, i) => (
        <text
          key={d.month}
          x={60 + i * 130}
          y={h - 6}
          className="fill-muted-foreground text-mono"
          fontSize="10"
          textAnchor="middle"
        >
          {d.month.toUpperCase()}
        </text>
      ))}
    </svg>
  );
}

function Heatmap() {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  // seed values for repeatable heatmap
  const seed = (d: number, h: number) => {
    const v = Math.abs(Math.sin((d + 1) * 9.7 + (h + 1) * 3.3)) * 100;
    return Math.round(v);
  };
  const hours = Array.from({ length: 12 }, (_, i) => i * 2); // 0, 2, 4 ... 22
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[36px_repeat(12,1fr)] gap-1 text-mono text-[9px] text-muted-foreground">
        <span />
        {hours.map((h) => (
          <span key={h} className="text-center tabular-nums">{String(h).padStart(2, "0")}</span>
        ))}
      </div>
      {days.map((d, di) => (
        <div key={d} className="grid grid-cols-[36px_repeat(12,1fr)] items-center gap-1">
          <span className="text-mono text-[10px] tracking-[0.12em] text-muted-foreground">{d}</span>
          {hours.map((h) => {
            const v = seed(di, h);
            const intensity = v / 100;
            const color =
              v > 75
                ? "var(--color-severity-critical)"
                : v > 55
                ? "var(--color-severity-high)"
                : v > 35
                ? "var(--color-severity-medium)"
                : "var(--color-primary)";
            return (
              <div
                key={h}
                title={`${d} ${h}:00 · risk index ${v}`}
                className="h-5 rounded-sm border border-border/60"
                style={{
                  background: `color-mix(in oklab, ${color} ${Math.max(8, intensity * 80)}%, transparent)`,
                }}
              />
            );
          })}
        </div>
      ))}
      <div className="flex items-center justify-between pt-2 text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>Low risk</span>
        <div className="flex gap-1">
          {[10, 25, 45, 65, 85].map((v) => (
            <span
              key={v}
              className="h-2 w-6 rounded-sm"
              style={{
                background: `color-mix(in oklab, var(--color-severity-critical) ${v}%, var(--color-card))`,
              }}
            />
          ))}
        </div>
        <span>Critical</span>
      </div>
    </div>
  );
}

function Timeline() {
  const events = [
    { t: "14:22", id: "ana_01h9k2", title: "Political article flagged: Hollis Reform", sev: "high" as const },
    { t: "13:48", id: "ana_03q8m1", title: "Critical health misinfo cluster detected", sev: "critical" as const },
    { t: "12:05", id: "src_4218", title: "Source reliability recalculated · 412 sources", sev: "low" as const },
    { t: "11:11", id: "ana_04t6w9", title: "Helix Q2 press release flagged for framing bias", sev: "medium" as const },
    { t: "09:30", id: "INV-2241", title: "Election narrative investigation opened", sev: "high" as const },
    { t: "08:14", id: "ana_02p4r7", title: "Riverside water report verified — low risk", sev: "low" as const },
  ];
  const dot = {
    low: "bg-severity-low",
    medium: "bg-severity-medium",
    high: "bg-severity-high",
    critical: "bg-severity-critical",
  };
  return (
    <ol className="relative ml-2 space-y-3 border-l border-border pl-4">
      {events.map((e) => (
        <li key={e.id + e.t} className="relative">
          <span
            className={`absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ring-4 ring-card ${dot[e.sev]}`}
          />
          <div className="flex items-baseline gap-3">
            <span className="text-mono text-[10px] tabular-nums text-muted-foreground">{e.t}</span>
            <span className="text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {e.id}
            </span>
          </div>
          <div className="text-[13px]">{e.title}</div>
        </li>
      ))}
    </ol>
  );
}

function SignalBars({ value }: { value: number }) {
  const bars = 16;
  const filled = Math.round((value / 100) * bars);
  return (
    <div className="flex items-end gap-[2px]">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 6 + (i / bars) * 10;
        const active = i < filled;
        const color =
          i >= bars * 0.75
            ? "bg-severity-critical"
            : i >= bars * 0.5
            ? "bg-severity-high"
            : i >= bars * 0.25
            ? "bg-severity-medium"
            : "bg-primary";
        return (
          <span
            key={i}
            className={`w-[3px] rounded-sm ${active ? color : "bg-border"}`}
            style={{ height: `${h}px` }}
          />
        );
      })}
    </div>
  );
}

function CredCell({ value }: { value: number }) {
  const tone =
    value >= 75
      ? "text-severity-low"
      : value >= 50
      ? "text-severity-medium"
      : value >= 30
      ? "text-severity-high"
      : "text-severity-critical";
  return (
    <div className="inline-flex items-center gap-2">
      <span className={`text-mono text-[13px] font-semibold tabular-nums ${tone}`}>{value}</span>
      <div className="h-1 w-14 overflow-hidden rounded bg-muted">
        <div
          className={`h-full ${
            value >= 75
              ? "bg-severity-low"
              : value >= 50
              ? "bg-severity-medium"
              : value >= 30
              ? "bg-severity-high"
              : "bg-severity-critical"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
