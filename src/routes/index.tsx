import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Activity,
  ShieldAlert,
  Microscope,
  Network,
  Eye,
  FileText,
  Building2,
  ChevronRight,
  Check,
  Radio,
  Cpu,
  Database,
  Zap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Globe2,
  Clock,
} from "lucide-react";
import { Logo } from "@/components/veritas/Logo";
import { ScoreGauge } from "@/components/veritas/ScoreGauge";
import { SeverityBadge } from "@/components/veritas/SeverityBadge";
import { analyses } from "@/lib/mockData";
import type { Severity } from "@/lib/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VeritasIQ — Information Forensics & Narrative Intelligence" },
      { name: "description", content: "Operational platform for credibility, manipulation, bias and source-reliability analysis. Built for journalists, OSINT analysts and policy investigators." },
      { property: "og:title", content: "VeritasIQ — Information Forensics" },
      { property: "og:description", content: "Analyze information like an intelligence analyst." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <StatusBar />
      <OpsConsole />
      <Capabilities />
      <Workflow />
      <Pricing />
      <FAQ />
      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Header + status                                                            */
/* -------------------------------------------------------------------------- */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-[1480px] items-center justify-between px-5">
        <div className="flex items-center gap-7">
          <Link to="/"><Logo /></Link>
          <nav className="hidden gap-5 text-[12px] text-muted-foreground md:flex">
            <a href="#console" className="hover:text-foreground">Console</a>
            <a href="#capabilities" className="hover:text-foreground">Platform</a>
            <a href="#workflow" className="hover:text-foreground">Workflow</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="hidden text-[12px] text-muted-foreground hover:text-foreground md:inline">
            Sign in
          </Link>
          <Link
            to="/reports/$id"
            params={{ id: "ana_01h9k2" }}
            className="hidden h-8 items-center gap-1.5 rounded-md border bg-card px-3 text-[12px] hover:bg-accent md:inline-flex"
          >
            Sample report
          </Link>
          <Link
            to="/analyze"
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[12px] font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start Analysis <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function StatusBar() {
  const items = [
    { label: "INVESTIGATIONS", value: "47 OPEN", tone: "low" as const, dot: true },
    { label: "PENDING REVIEW", value: "12" },
    { label: "EMERGING NARRATIVES", value: "23 TRACKED" },
    { label: "CLAIMS INDEXED", value: "12.4M" },
    { label: "SOURCES SCORED", value: "184,021" },
    { label: "ANALYSTS ONLINE", value: "118" },
    { label: "BRIEFINGS PUBLISHED 30D", value: "184" },
    { label: "UTC", value: "14:22:08Z", mono: true },
  ];
  return (
    <div className="border-b bg-sidebar/60 text-sidebar-foreground">
      <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-x-6 gap-y-1 px-5 py-1.5">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]">
            {i.dot && <span className="h-1.5 w-1.5 rounded-full bg-severity-low shadow-[0_0_6px_var(--severity-low)]" />}
            <span className="text-sidebar-foreground/50">{i.label}</span>
            <span className={`text-sidebar-foreground/90 ${i.mono ? "text-mono" : ""}`}>{i.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ops console — replaces hero                                                */
/* -------------------------------------------------------------------------- */

function OpsConsole() {
  return (
    <section id="console" className="relative border-b">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-[1480px] px-5 pt-6 pb-8">
        {/* Compact intro strip — replaces big hero */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-primary">
              <Radio className="h-3 w-3" /> Information Forensics · Operations Console
            </div>
            <h1 className="mt-2 text-[26px] font-semibold leading-[1.15] tracking-tight md:text-[34px]">
              Analyze information like an <span className="text-primary">intelligence analyst.</span>
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              Live forensic record of claims, evidence, manipulation patterns and source reliability —
              traceable, defensible, and built for editorial and OSINT teams.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/analyze" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90">
              Start Analysis <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/dashboard" className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-card px-3.5 text-[12px] hover:bg-accent">
              Open Console
            </Link>
          </div>
        </div>

        {/* KPI strip */}
        <KpiStrip />

        {/* Main 12-col console grid */}
        <div className="mt-3 grid gap-3 lg:grid-cols-12">
          <ActiveInvestigations />
          <LiveAnalysis />
          <AlertFeed />
        </div>

        {/* Second row */}
        <div className="mt-3 grid gap-3 lg:grid-cols-12">
          <SourceIntelligence />
          <CredibilityTrend />
          <ManipulationMix />
        </div>
      </div>
    </section>
  );
}

function KpiStrip() {
  const kpis = [
    { l: "Analyses · 24h", v: "1,284", d: "+18%", up: true, spark: [4, 6, 5, 8, 7, 11, 9, 13, 12, 15] },
    { l: "Critical findings", v: "37", d: "+6", up: true, tone: "critical", spark: [2, 3, 2, 4, 3, 5, 4, 6, 5, 7] },
    { l: "Avg credibility", v: "62.4", d: "−2.1", up: false, spark: [70, 68, 67, 66, 65, 64, 63, 64, 63, 62] },
    { l: "Sources flagged", v: "412", d: "+11", up: true, tone: "medium", spark: [20, 22, 21, 24, 26, 28, 30, 32, 34, 41] },
    { l: "Manipulation index", v: "0.41", d: "+0.04", up: true, tone: "high", spark: [30, 32, 33, 35, 36, 38, 39, 40, 40, 41] },
    { l: "Queue depth", v: "17", d: "−3", up: false, spark: [25, 22, 23, 20, 19, 18, 19, 17, 16, 17] },
  ];
  return (
    <div className="grid gap-px overflow-hidden rounded-md border bg-border md:grid-cols-3 lg:grid-cols-6">
      {kpis.map((k) => (
        <div key={k.l} className="bg-card p-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{k.l}</div>
            <div className={`flex items-center gap-0.5 text-mono text-[10px] tabular-nums ${
              k.tone === "critical" ? "text-severity-critical" : k.tone === "high" ? "text-severity-high" : k.tone === "medium" ? "text-severity-medium" : k.up ? "text-severity-low" : "text-muted-foreground"
            }`}>
              {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {k.d}
            </div>
          </div>
          <div className="mt-1 flex items-end justify-between gap-2">
            <span className="text-mono text-[22px] font-semibold tabular-nums">{k.v}</span>
            <Sparkline data={k.spark} tone={k.tone} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Sparkline({ data, tone }: { data: number[]; tone?: string }) {
  const w = 70;
  const h = 22;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const stroke =
    tone === "critical" ? "stroke-severity-critical"
    : tone === "high" ? "stroke-severity-high"
    : tone === "medium" ? "stroke-severity-medium"
    : "stroke-primary";
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" strokeWidth={1.2} className={stroke} />
    </svg>
  );
}

/* ---------- Active investigations ---------- */

function ActiveInvestigations() {
  const rows = [
    { id: "INV-2418", title: "Senator Hollis · Reform speech coverage", type: "Political", cred: 38, risk: "high" as Severity, owner: "M. Olsen", upd: "3m" },
    { id: "INV-2417", title: "Lumen Tech Q2 earnings narrative", type: "Press Rel.", cred: 71, risk: "medium" as Severity, owner: "K. Tanaka", upd: "11m" },
    { id: "INV-2416", title: "Viral thread · 'They don't want you to know'", type: "Social", cred: 14, risk: "critical" as Severity, owner: "S. Hadid", upd: "22m" },
    { id: "INV-2415", title: "Reuters · EU energy framework update", type: "News", cred: 84, risk: "low" as Severity, owner: "D. Park", upd: "41m" },
    { id: "INV-2414", title: "Op-ed · 'The collapse nobody is reporting'", type: "Opinion", cred: 29, risk: "high" as Severity, owner: "A. Reyes", upd: "1h" },
    { id: "INV-2413", title: "Senate floor transcript · HR-882 debate", type: "Transcript", cred: 67, risk: "medium" as Severity, owner: "M. Olsen", upd: "2h" },
  ];
  return (
    <ConsoleCard className="lg:col-span-5" title="Active investigations" hint="Live queue · auto-refresh 5s" action="/dashboard">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="hairline-b text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <th className="px-3 py-1.5 text-left font-normal">ID</th>
            <th className="px-3 py-1.5 text-left font-normal">Subject</th>
            <th className="px-3 py-1.5 text-right font-normal">Cred.</th>
            <th className="px-3 py-1.5 text-left font-normal">Risk</th>
            <th className="hidden px-3 py-1.5 text-left font-normal md:table-cell">Owner</th>
            <th className="px-3 py-1.5 text-right font-normal">Upd.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
              <td className="px-3 py-2 text-mono text-[11px] text-muted-foreground">{r.id}</td>
              <td className="px-3 py-2">
                <div className="truncate">{r.title}</div>
                <div className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{r.type}</div>
              </td>
              <td className="px-3 py-2 text-right">
                <span className={`text-mono tabular-nums ${
                  r.cred >= 70 ? "text-severity-low" : r.cred >= 50 ? "text-severity-medium" : r.cred >= 30 ? "text-severity-high" : "text-severity-critical"
                }`}>{r.cred}</span>
              </td>
              <td className="px-3 py-2"><SeverityBadge severity={r.risk} /></td>
              <td className="hidden px-3 py-2 text-muted-foreground md:table-cell">{r.owner}</td>
              <td className="px-3 py-2 text-right text-mono text-[11px] text-muted-foreground">{r.upd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ConsoleCard>
  );
}

/* ---------- Live analysis card (sample report) ---------- */

function LiveAnalysis() {
  const a = analyses[0];
  return (
    <ConsoleCard
      className="lg:col-span-4"
      title="Live analysis · ana_01h9k2"
      hint={a.source}
      action={`/reports/${a.id}`}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {a.type} · {a.wordCount} words
            </div>
            <div className="mt-0.5 truncate text-[13px] font-medium">{a.title}</div>
          </div>
          <SeverityBadge severity={a.riskLevel} />
        </div>

        <div className="mt-3 grid grid-cols-[120px_1fr] gap-3">
          <div className="grid place-items-center rounded-md border bg-surface p-2">
            <ScoreGauge value={a.credibility} size={104} label="Cred." />
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border bg-border">
            {[
              { l: "Evidence", v: a.evidence },
              { l: "Sources", v: a.breakdown.sources },
              { l: "Logic", v: a.breakdown.logic },
              { l: "Consist.", v: a.breakdown.consistency },
            ].map((m) => (
              <div key={m.l} className="bg-card p-2">
                <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{m.l}</div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-mono text-[15px] font-semibold tabular-nums">{m.v}</span>
                  <span className="text-[9px] text-muted-foreground">/100</span>
                </div>
                <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${m.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-1">
          {a.manipulations.slice(0, 3).map((m) => (
            <div key={m.category} className="flex items-center gap-2 rounded border bg-surface px-2 py-1.5">
              <SeverityBadge severity="high" />
              <span className="flex-1 truncate text-[11px]">{m.category}</span>
              <span className="text-mono text-[10px] tabular-nums text-muted-foreground">{m.confidence}%</span>
            </div>
          ))}
          {a.fallacies.slice(0, 2).map((f) => (
            <div key={f.type} className="flex items-center gap-2 rounded border bg-surface px-2 py-1.5">
              <SeverityBadge severity="medium" />
              <span className="flex-1 truncate text-[11px]">{f.type}</span>
              <span className="text-mono text-[10px] tabular-nums text-muted-foreground">{f.confidence}%</span>
            </div>
          ))}
        </div>

        <div className="hairline-t mt-3 flex items-center justify-between pt-2 text-mono text-[10px] text-muted-foreground">
          <span>{a.claims.length} claims · {a.sources.length} sources</span>
          <Link to="/reports/$id" params={{ id: a.id }} className="inline-flex items-center gap-1 text-primary">
            Open report <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </ConsoleCard>
  );
}

/* ---------- Alert feed ---------- */

function AlertFeed() {
  const events: { t: string; sev: Severity; tag: string; msg: string }[] = [
    { t: "14:21", sev: "critical", tag: "AMPLIFY", msg: "Coordinated amplification · 312 accounts · NAR-0412" },
    { t: "14:19", sev: "high", tag: "MANIP", msg: "Fear-appeal spike · capital-beacon.example" },
    { t: "14:17", sev: "medium", tag: "CITE", msg: "Unsourced statistic flagged in INV-2417" },
    { t: "14:13", sev: "critical", tag: "SOURCE", msg: "newsly-now.example · reliability fell below 25" },
    { t: "14:09", sev: "medium", tag: "BIAS", msg: "Framing bias rising in 'energy framework' coverage" },
    { t: "14:04", sev: "low", tag: "VERIFY", msg: "INV-2410 corroborated · brief published" },
    { t: "13:58", sev: "high", tag: "FALLACY", msg: "False dilemma detected · op-ed cluster" },
    { t: "13:51", sev: "medium", tag: "INTAKE", msg: "124 social posts received · OSINT feed 3" },
  ];
  return (
    <ConsoleCard className="lg:col-span-3" title="Investigation alerts" hint="Last 72 minutes">
      <ul className="divide-y divide-border/60">
        {events.map((e, i) => (
          <li key={i} className="flex items-start gap-2 px-3 py-2">
            <span className="mt-1 text-mono text-[10px] tabular-nums text-muted-foreground">{e.t}</span>
            <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
              e.sev === "critical" ? "bg-severity-critical" : e.sev === "high" ? "bg-severity-high" : e.sev === "medium" ? "bg-severity-medium" : "bg-severity-low"
            }`} />
            <div className="min-w-0 flex-1">
              <div className="text-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{e.tag}</div>
              <div className="truncate text-[11px]">{e.msg}</div>
            </div>
          </li>
        ))}
      </ul>
    </ConsoleCard>
  );
}

/* ---------- Source intelligence ---------- */

function SourceIntelligence() {
  const sources = [
    { dom: "reuters.com", type: "Primary", rel: 92, bias: "Center", trend: "+0.2" },
    { dom: "apnews.com", type: "Primary", rel: 90, bias: "Center", trend: "0.0" },
    { dom: "capital-beacon.example", type: "Aggregator", rel: 41, bias: "Right-Lean", trend: "−1.4" },
    { dom: "newsly-now.example", type: "Opinion", rel: 22, bias: "Hyper-Partisan", trend: "−3.1" },
    { dom: "ft.com", type: "Primary", rel: 88, bias: "Center-Right", trend: "+0.1" },
    { dom: "policywatch.example", type: "Secondary", rel: 64, bias: "Center-Left", trend: "−0.6" },
  ];
  return (
    <ConsoleCard className="lg:col-span-5" title="Source intelligence" hint="184,021 sources scored" action="/sources">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="hairline-b text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <th className="px-3 py-1.5 text-left font-normal">Domain</th>
            <th className="px-3 py-1.5 text-left font-normal">Type</th>
            <th className="px-3 py-1.5 text-left font-normal">Reliability</th>
            <th className="px-3 py-1.5 text-left font-normal">Bias</th>
            <th className="px-3 py-1.5 text-right font-normal">30d</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((s) => (
            <tr key={s.dom} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
              <td className="px-3 py-2"><span className="text-mono">{s.dom}</span></td>
              <td className="px-3 py-2 text-muted-foreground">{s.type}</td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full ${
                      s.rel >= 75 ? "bg-severity-low" : s.rel >= 50 ? "bg-severity-medium" : s.rel >= 30 ? "bg-severity-high" : "bg-severity-critical"
                    }`} style={{ width: `${s.rel}%` }} />
                  </div>
                  <span className="text-mono text-[11px] tabular-nums">{s.rel}</span>
                </div>
              </td>
              <td className="px-3 py-2 text-[11px] text-muted-foreground">{s.bias}</td>
              <td className={`px-3 py-2 text-right text-mono text-[11px] tabular-nums ${
                s.trend.startsWith("−") ? "text-severity-high" : s.trend.startsWith("+") ? "text-severity-low" : "text-muted-foreground"
              }`}>{s.trend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ConsoleCard>
  );
}

/* ---------- Credibility trend chart ---------- */

function CredibilityTrend() {
  // 30 day median credibility line
  const data = [68, 67, 70, 69, 71, 70, 68, 66, 67, 65, 64, 66, 65, 63, 64, 62, 63, 61, 60, 62, 61, 59, 60, 58, 59, 60, 61, 62, 61, 62];
  const w = 360;
  const h = 130;
  const max = 80, min = 50;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return [x, y] as const;
  });
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <ConsoleCard className="lg:col-span-4" title="Median credibility · 30d" hint="All investigations">
      <div className="p-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-mono text-[24px] font-semibold tabular-nums">62.4</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-severity-high">−2.1 vs prev 30d</div>
          </div>
          <div className="flex gap-1 text-[10px]">
            {["7d", "30d", "90d", "All"].map((t, i) => (
              <span key={t} className={`rounded border px-1.5 py-0.5 ${i === 1 ? "border-primary/40 bg-primary/10 text-foreground" : "border-transparent text-muted-foreground"}`}>{t}</span>
            ))}
          </div>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-32 w-full">
          {[0.25, 0.5, 0.75].map((p) => (
            <line key={p} x1={0} x2={w} y1={h * p} y2={h * p} className="stroke-border" strokeDasharray="2 3" />
          ))}
          <polygon points={area} className="fill-primary/10" />
          <polyline points={line} fill="none" strokeWidth={1.5} className="stroke-primary" />
          {pts.filter((_, i) => i % 5 === 0).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2} className="fill-primary" />
          ))}
        </svg>
        <div className="flex justify-between text-mono text-[9px] text-muted-foreground">
          <span>May 08</span><span>May 22</span><span>Jun 06</span>
        </div>
      </div>
    </ConsoleCard>
  );
}

/* ---------- Manipulation mix ---------- */

function ManipulationMix() {
  const mix = [
    { l: "Fear Appeals", v: 31 },
    { l: "Urgency", v: 22 },
    { l: "Outrage", v: 18 },
    { l: "Framing", v: 14 },
    { l: "Polarization", v: 9 },
    { l: "Conspiracy", v: 6 },
  ];
  const max = Math.max(...mix.map((m) => m.v));
  return (
    <ConsoleCard className="lg:col-span-3" title="Manipulation mix · 24h" hint="% of flagged content">
      <div className="space-y-1.5 p-3">
        {mix.map((m) => (
          <div key={m.l}>
            <div className="flex items-baseline justify-between">
              <span className="text-[11px]">{m.l}</span>
              <span className="text-mono text-[10px] tabular-nums text-muted-foreground">{m.v}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-gradient-to-r from-severity-high to-severity-critical" style={{ width: `${(m.v / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </ConsoleCard>
  );
}

/* ---------- Reusable console card ---------- */

function ConsoleCard({
  title, hint, action, children, className,
}: { title: string; hint?: string; action?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-md border bg-card ${className ?? ""}`}>
      <div className="hairline-b flex items-center justify-between bg-surface px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
          <span className="text-[10px] uppercase tracking-[0.14em] text-foreground">{title}</span>
          {hint && <span className="text-mono text-[10px] text-muted-foreground">· {hint}</span>}
        </div>
        {action && (
          <Link to={action as any} className="text-mono text-[10px] text-muted-foreground hover:text-primary">
            open ›
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Below-the-fold sections — dense                                            */
/* -------------------------------------------------------------------------- */

function Capabilities() {
  const items = [
    { icon: ShieldAlert, title: "Manipulation Detection", body: "Fear appeals, urgency, outrage, polarization and conspiracy patterns — every finding scored and excerpted." },
    { icon: Microscope, title: "Evidence Quality", body: "Claims classified as supported, partial, weak or unsupported with linked corroborating evidence." },
    { icon: Activity, title: "Bias Analysis", body: "Political, commercial, selection and framing bias with severity ratings and excerpts." },
    { icon: Network, title: "Claim Graph", body: "Interactive graph of claims, supporting evidence and contradictions for every analysis." },
    { icon: Eye, title: "Source Evaluation", body: "Reliability scoring across primary, secondary, aggregator and opinion sources with audit history." },
    { icon: FileText, title: "Audit-Ready Reports", body: "Forensic exports with full provenance — usable in editorial review and legal discovery." },
    { icon: Globe2, title: "Multi-language", body: "Analyses in 14 languages including English, Spanish, Arabic, Mandarin, French, and Ukrainian." },
    { icon: Cpu, title: "Programmatic API", body: "REST and webhook access for newsroom CMS, OSINT pipelines, and research workflows." },
  ];
  return (
    <section id="capabilities" className="border-b">
      <div className="mx-auto max-w-[1480px] px-5 py-10">
        <div className="mb-4 flex items-end justify-between">
          <SectionHeader eyebrow="Platform" title="Eight engines. One forensic record." />
          <span className="text-mono text-[10px] text-muted-foreground">FORENSIC/MODULES</span>
        </div>
        <div className="grid gap-px overflow-hidden rounded-md border bg-border md:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.title} className="bg-card p-4 transition-colors hover:bg-surface">
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded border bg-surface text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-[13px] font-semibold tracking-tight">{it.title}</h3>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{it.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    { n: "01", icon: Database, title: "Ingest", body: "Paste text, drop a URL, upload a PDF, or import a transcript. Content is normalized and segmented." },
    { n: "02", icon: Microscope, title: "Decompose", body: "Claims, sources and rhetorical devices extracted into a structured analytical layer." },
    { n: "03", icon: Zap, title: "Score", body: "Credibility, evidence, bias, manipulation and reliability engines converge in parallel." },
    { n: "04", icon: FileText, title: "Defend", body: "Export an audit-ready report or share the claim graph. Every finding has a citation." },
  ];
  return (
    <section id="workflow" className="border-b bg-surface/60">
      <div className="mx-auto max-w-[1480px] px-5 py-10">
        <div className="mb-4 flex items-end justify-between">
          <SectionHeader eyebrow="Workflow" title="Raw content → forensic record · under 60 seconds." />
          <span className="text-mono text-[10px] text-muted-foreground">INVESTIGATION/STAGES</span>
        </div>
        <div className="grid gap-px overflow-hidden rounded-md border bg-border md:grid-cols-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="relative bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-mono text-[10px] text-muted-foreground">STAGE {s.n}</span>
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <h3 className="mt-3 text-[14px] font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Analyst", price: "$49", sub: "per seat / month", features: ["2,000 analyses / mo", "All forensic engines", "PDF report export", "Email support"] },
    { name: "Investigations", price: "$199", sub: "per seat / month", featured: true, features: ["10,000 analyses / mo", "Team workspaces & SSO", "API access", "Claim-graph collaboration", "Priority support"] },
    { name: "Enterprise", price: "Custom", sub: "annual contract", features: ["Unlimited analyses", "On-prem / VPC deployment", "Custom source corpora", "Dedicated forensics partner", "SOC 2 + DPA"] },
  ];
  return (
    <section id="pricing" className="border-b">
      <div className="mx-auto max-w-[1480px] px-5 py-10">
        <SectionHeader eyebrow="Pricing" title="Per seat. No surprises." />
        <div className="mt-6 grid gap-px overflow-hidden rounded-md border bg-border md:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name} className={`flex flex-col bg-card p-5 ${t.featured ? "ring-1 ring-inset ring-primary" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t.name}</div>
                {t.featured && <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-primary">Recommended</span>}
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[26px] font-semibold tracking-tight">{t.price}</span>
                <span className="text-[11px] text-muted-foreground">{t.sub}</span>
              </div>
              <ul className="mt-4 flex-1 space-y-1.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[12px]">
                    <Check className="mt-0.5 h-3 w-3 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/analyze"
                className={`mt-5 inline-flex h-8 items-center justify-center rounded-md text-[12px] font-medium ${
                  t.featured ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border bg-card hover:bg-accent"
                }`}
              >
                {t.name === "Enterprise" ? "Contact sales" : "Start free trial"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "How is VeritasIQ different from a fact-checker?", a: "Fact-checkers verify discrete claims. VeritasIQ produces a structural forensic record — claims, evidence quality, manipulation, fallacies, bias and source reliability — defensible in editorial or legal review." },
    { q: "Where does the source-reliability data come from?", a: "A curated corpus of 184,000+ sources scored on transparency, correction history, expertise and adjudicated reliability. Enterprise customers can extend the corpus with internal sources." },
    { q: "Can analyses be exported?", a: "Every report exports to PDF and structured JSON with full audit metadata, citations and evidence links." },
    { q: "Is content used to train models?", a: "No. Analyzed content is encrypted at rest and never used to train models. Enterprise customers can deploy in their own VPC." },
    { q: "Do you support non-English content?", a: "Yes — analysis in 14 languages including English, Spanish, Arabic, Mandarin, French, German, Portuguese, Russian and Ukrainian." },
  ];
  return (
    <section id="faq" className="border-b bg-surface/60">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <SectionHeader eyebrow="FAQ" title="Frequently asked." />
        <div className="mt-6 divide-y rounded-md border bg-card">
          {faqs.map((f) => (
            <details key={f.q} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-[13px] font-medium">{f.q}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-[1480px] gap-8 px-5 py-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="text-sidebar-foreground"><Logo /></div>
          <p className="mt-3 max-w-sm text-[12px] text-sidebar-foreground/70">
            Information forensics and narrative intelligence for journalists, OSINT analysts, researchers and policy professionals.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/50">
            <span className="inline-flex items-center gap-1.5"><Building2 className="h-3 w-3" /> SOC 2 Type II</span>
            <span className="inline-flex items-center gap-1.5"><AlertTriangle className="h-3 w-3" /> ISO 27001</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" /> GDPR · DPA</span>
          </div>
        </div>
        {[
          { h: "Platform", l: ["Capabilities", "Pricing", "Changelog", "Roadmap"] },
          { h: "Use cases", l: ["Newsrooms", "OSINT teams", "Policy research", "Universities"] },
          { h: "Company", l: ["About", "Security", "Terms", "Privacy"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/50">{c.h}</div>
            <ul className="mt-3 space-y-1.5 text-[12px] text-sidebar-foreground/80">
              {c.l.map((i) => (
                <li key={i}><a href="#" className="hover:text-sidebar-foreground">{i}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-sidebar-border">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-3 text-[10px] text-sidebar-foreground/50">
          <span>© 2026 VeritasIQ, Inc. All rights reserved.</span>
          <span className="text-mono">v4.2.1 · build 2026.06.04</span>
        </div>
      </div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="text-[10px] uppercase tracking-[0.18em] text-primary">{eyebrow}</div>
      <h2 className="mt-1.5 text-[22px] font-semibold tracking-tight md:text-[26px]">{title}</h2>
      {sub && <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{sub}</p>}
    </div>
  );
}
