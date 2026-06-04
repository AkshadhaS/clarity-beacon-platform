import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Activity,
  ShieldAlert,
  Microscope,
  Network,
  Eye,
  FileText,
  Quote,
  Building2,
  ChevronRight,
  Check,
} from "lucide-react";
import { Logo } from "@/components/veritas/Logo";
import { ScoreGauge } from "@/components/veritas/ScoreGauge";
import { ScoreCard } from "@/components/veritas/ScoreCard";
import { SeverityBadge } from "@/components/veritas/SeverityBadge";
import { analyses } from "@/lib/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VeritasIQ — AI-Powered Information Forensics" },
      { name: "description", content: "Analyze articles, posts, transcripts and reports for credibility, bias, manipulation and evidence quality. Built for journalists, analysts and investigators." },
      { property: "og:title", content: "VeritasIQ — AI-Powered Information Forensics" },
      { property: "og:description", content: "Analyze information like an intelligence analyst." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const sample = analyses[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <Trust />
      <Capabilities />
      <Workflow />
      <SampleReport sample={sample} />
      <Testimonials />
      <Pricing />
      <FAQ />
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/"><Logo /></Link>
          <nav className="hidden gap-6 text-[13px] text-muted-foreground md:flex">
            <a href="#capabilities" className="hover:text-foreground">Platform</a>
            <a href="#workflow" className="hover:text-foreground">Workflow</a>
            <a href="#report" className="hover:text-foreground">Sample report</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="hidden text-[13px] text-muted-foreground hover:text-foreground md:inline">
            Sign in
          </Link>
          <Link
            to="/analyze"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start Analysis <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-severity-low" />
            Forensics Platform · v4.2
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Analyze information like an<br />
            <span className="text-primary">intelligence analyst.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Identify manipulation, bias, weak evidence, and misinformation before
            making decisions. VeritasIQ deconstructs articles, posts, transcripts
            and reports into a forensic record your team can defend.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <Link
              to="/analyze"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start Analysis <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/reports/$id"
              params={{ id: "ana_01h9k2" }}
              className="inline-flex h-10 items-center gap-2 rounded-md border bg-card px-4 text-[13px] font-medium hover:bg-accent"
            >
              View Demo Report
            </Link>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t pt-6">
            {[
              { k: "12.4M", v: "Claims indexed" },
              { k: "184K", v: "Sources scored" },
              { k: "99.2%", v: "Audit traceability" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-mono text-xl font-semibold tabular-nums">{s.k}</div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <TerminalPreview />
        </div>
      </div>
    </section>
  );
}

function TerminalPreview() {
  return (
    <div className="relative rounded-lg border bg-card shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)]">
      <div className="hairline-b flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-severity-critical/70" />
          <span className="h-2 w-2 rounded-full bg-severity-medium/70" />
          <span className="h-2 w-2 rounded-full bg-severity-low/70" />
          <span className="ml-3 text-mono text-[11px] text-muted-foreground">
            ana_01h9k2 · capital-beacon.example
          </span>
        </div>
        <span className="text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Live
        </span>
      </div>
      <div className="grid grid-cols-[200px_1fr] border-b">
        <div className="hairline-b flex flex-col items-center justify-center gap-2 border-r bg-surface px-4 py-6">
          <ScoreGauge value={38} size={140} label="Credibility" />
          <SeverityBadge severity="high" />
        </div>
        <div className="grid grid-cols-2 gap-px bg-border">
          {[
            { l: "Evidence", v: 32 },
            { l: "Sources", v: 44 },
            { l: "Logic", v: 36 },
            { l: "Consistency", v: 41 },
          ].map((m) => (
            <div key={m.l} className="bg-card p-4">
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{m.l}</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-mono text-xl font-semibold tabular-nums">{m.v}</span>
                <span className="text-[10px] text-muted-foreground">/100</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${m.v}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2 p-4">
        <Finding label="Fear Appeals" conf={88} severity="high" />
        <Finding label="False Dilemma" conf={82} severity="high" />
        <Finding label="Unsourced statistic" conf={76} severity="medium" />
        <Finding label="Unnamed insider quote" conf={61} severity="medium" />
      </div>
      <div className="hairline-t flex items-center justify-between bg-surface px-4 py-2.5">
        <span className="text-mono text-[11px] text-muted-foreground">
          4 manipulation · 3 fallacies · 3 biases
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-primary">
          Open report <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

function Finding({ label, conf, severity }: { label: string; conf: number; severity: "low" | "medium" | "high" | "critical" }) {
  return (
    <div className="flex items-center gap-3 rounded-md border bg-surface px-3 py-2">
      <SeverityBadge severity={severity} />
      <span className="flex-1 text-[12px]">{label}</span>
      <span className="text-mono text-[11px] tabular-nums text-muted-foreground">
        {conf}% conf
      </span>
    </div>
  );
}

function Trust() {
  return (
    <section className="border-b bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Trusted by investigative teams at
        </div>
        <div className="mt-6 grid grid-cols-2 items-center gap-6 opacity-70 sm:grid-cols-3 md:grid-cols-6">
          {["NORDSEC", "ATLAS DESK", "MERIDIAN", "BLACKWELL", "ARGUS LAB", "CIPHER GROUP"].map((n) => (
            <div key={n} className="text-center text-mono text-[12px] tracking-[0.18em] text-muted-foreground">
              {n}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  const items = [
    { icon: ShieldAlert, title: "Manipulation Detection", body: "Surface fear appeals, urgency cues, polarization framing, and conspiracy patterns with confidence scoring." },
    { icon: Microscope, title: "Evidence Quality", body: "Every claim is classified — supported, partial, weak, or unsupported — and linked to corroborating or contradicting evidence." },
    { icon: Activity, title: "Bias Analysis", body: "Detect political, commercial, selection and framing bias with severity ratings and excerpted examples." },
    { icon: Network, title: "Claim Graph", body: "An interactive graph of claims, evidence, and contradictions — the analytical centerpiece of every report." },
    { icon: Eye, title: "Source Evaluation", body: "Reliability scoring across primary, secondary, aggregator and opinion sources, with a history of past assessments." },
    { icon: FileText, title: "Audit-Ready Reports", body: "Export forensic reports with full provenance — usable as exhibits in editorial review and legal discovery." },
  ];
  return (
    <section id="capabilities" className="border-b">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="Platform" title="Six engines, one analytical record." sub="Every analysis runs through the full forensic pipeline. Nothing is heuristic — every finding is explained, scored and traceable to source." />
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.title} className="group bg-card p-6 transition-colors hover:bg-surface">
                <div className="grid h-9 w-9 place-items-center rounded-md border bg-surface text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-5 text-[15px] font-semibold tracking-tight">{it.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{it.body}</p>
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
    { n: "01", title: "Ingest", body: "Paste text, upload a PDF, drop in a URL, or import a transcript. Content is normalized, deduplicated and segmented." },
    { n: "02", title: "Decompose", body: "Claims, sources and rhetorical devices are extracted into a structured analytical layer." },
    { n: "03", title: "Score", body: "The credibility, evidence, bias, manipulation and reliability engines run in parallel and converge on a single record." },
    { n: "04", title: "Defend", body: "Export an audit-ready report or hand off the claim graph to a colleague. Every finding has a citation." },
  ];
  return (
    <section id="workflow" className="border-b bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="Workflow" title="From raw content to forensic record in under a minute." />
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="bg-card p-6">
              <div className="text-mono text-[11px] text-muted-foreground">{s.n}</div>
              <h3 className="mt-3 text-[15px] font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SampleReport({ sample }: { sample: typeof analyses[number] }) {
  return (
    <section id="report" className="border-b">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="Sample report" title="What an analyst actually sees." sub="Below is a redacted excerpt of a real political-coverage analysis run on the VeritasIQ platform." />
        <div className="mt-10 overflow-hidden rounded-lg border bg-card">
          <div className="hairline-b flex flex-wrap items-center justify-between gap-3 bg-surface px-5 py-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {sample.type} · {sample.source}
              </div>
              <div className="text-[14px] font-semibold">{sample.title}</div>
            </div>
            <SeverityBadge severity={sample.riskLevel} />
          </div>
          <div className="grid gap-px bg-border md:grid-cols-[280px_1fr]">
            <div className="hairline-b bg-card p-6">
              <ScoreGauge value={sample.credibility} size={160} label="Credibility" />
            </div>
            <div className="grid grid-cols-2 gap-px bg-border">
              <div className="bg-card"><ScoreCard label="Evidence" value={sample.evidence} /></div>
              <div className="bg-card"><ScoreCard label="Sources" value={sample.breakdown.sources} /></div>
              <div className="bg-card"><ScoreCard label="Bias" value={sample.bias} inverted /></div>
              <div className="bg-card"><ScoreCard label="Manipulation" value={sample.manipulation} inverted /></div>
            </div>
          </div>
          <div className="grid gap-px border-t bg-border md:grid-cols-2">
            <div className="bg-card p-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Executive Summary</div>
              <p className="mt-2 text-[13px] leading-relaxed">{sample.executiveSummary}</p>
            </div>
            <div className="bg-card p-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Top findings</div>
              <ul className="mt-2 space-y-2">
                {sample.manipulations.slice(0, 3).map((m) => (
                  <li key={m.category} className="flex items-start gap-2 text-[13px]">
                    <SeverityBadge severity="high" />
                    <span><strong className="font-medium">{m.category}.</strong> {m.explanation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="hairline-t flex items-center justify-between bg-surface px-5 py-3">
            <span className="text-[12px] text-muted-foreground">Audit trail · {sample.claims.length} claims · {sample.sources.length} sources</span>
            <Link to="/reports/$id" params={{ id: sample.id }} className="inline-flex items-center gap-1 text-[12px] text-primary">
              Open full report <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { quote: "VeritasIQ replaced four spreadsheets and a chaotic Slack channel. Our editors won't publish without a report ID anymore.", who: "Maren Olsen", role: "Investigations Editor, Atlas Desk" },
    { quote: "The claim graph is the first analytical tool I've seen that actually makes a sourcing argument legible to a lawyer.", who: "Devon Park", role: "General Counsel, Meridian News" },
    { quote: "We use VeritasIQ to triage hundreds of social posts daily. Critical-risk detections are virtually never false positives.", who: "Sana Hadid", role: "OSINT Lead, Argus Lab" },
  ];
  return (
    <section className="border-b bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="Testimonials" title="Built for teams that need to defend their conclusions." />
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-3">
          {t.map((q) => (
            <div key={q.who} className="flex flex-col bg-card p-6">
              <Quote className="h-5 w-5 text-primary/60" />
              <p className="mt-4 flex-1 text-[14px] leading-relaxed">{q.quote}</p>
              <div className="mt-6 border-t pt-4">
                <div className="text-[13px] font-medium">{q.who}</div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{q.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Analyst",
      price: "$49",
      sub: "per seat / month",
      features: ["2,000 analyses / mo", "All forensic engines", "PDF report export", "Email support"],
    },
    {
      name: "Investigations",
      price: "$199",
      sub: "per seat / month",
      featured: true,
      features: ["10,000 analyses / mo", "Team workspaces & SSO", "API access", "Claim-graph collaboration", "Priority support"],
    },
    {
      name: "Enterprise",
      price: "Custom",
      sub: "annual contract",
      features: ["Unlimited analyses", "On-prem / VPC deployment", "Custom source corpora", "Dedicated forensics partner", "SOC 2 + DPA"],
    },
  ];
  return (
    <section id="pricing" className="border-b">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="Pricing" title="Straightforward. Per seat. No surprises." />
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name} className={`flex flex-col bg-card p-6 ${t.featured ? "ring-1 ring-inset ring-primary" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {t.name}
                </div>
                {t.featured && (
                  <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
                    Recommended
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight">{t.price}</span>
                <span className="text-[12px] text-muted-foreground">{t.sub}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px]">
                    <Check className="mt-0.5 h-3.5 w-3.5 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/analyze"
                className={`mt-6 inline-flex h-9 items-center justify-center rounded-md text-[13px] font-medium ${
                  t.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border bg-card hover:bg-accent"
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
    { q: "How is VeritasIQ different from a fact-checker?", a: "Fact-checkers verify discrete claims. VeritasIQ produces a structural forensic record of an entire piece of content — claims, evidence quality, manipulation patterns, fallacies, bias and source reliability — in a form your team can defend in editorial or legal review." },
    { q: "Where does the source-reliability data come from?", a: "We maintain a curated corpus of 184,000+ sources scored on transparency, correction history, expertise and adjudicated reliability. Enterprise customers can extend the corpus with internal sources." },
    { q: "Can analyses be exported?", a: "Yes — every report exports to PDF and structured JSON with full audit metadata, citations and evidence links." },
    { q: "Is content stored or used to train models?", a: "No. Analyzed content is encrypted at rest and never used to train models. Enterprise customers can deploy in their own VPC." },
    { q: "Do you support non-English content?", a: "We currently support analysis in 14 languages including English, Spanish, Arabic, Mandarin, French, German, Portuguese, Russian and Ukrainian." },
  ];
  return (
    <section id="faq" className="border-b bg-surface">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <SectionHeader eyebrow="FAQ" title="Frequently asked." />
        <div className="mt-10 divide-y rounded-lg border bg-card">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-[14px] font-medium">{f.q}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{f.a}</p>
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
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="text-sidebar-foreground"><Logo /></div>
          <p className="mt-3 max-w-sm text-[13px] text-sidebar-foreground/70">
            Information forensics and narrative intelligence for journalists, researchers, cybersecurity teams and policy professionals.
          </p>
          <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-sidebar-foreground/50">
            <Building2 className="h-3.5 w-3.5" /> SOC 2 Type II · ISO 27001
          </div>
        </div>
        {[
          { h: "Platform", l: ["Capabilities", "Pricing", "Changelog", "Roadmap"] },
          { h: "Use cases", l: ["Newsrooms", "OSINT teams", "Policy research", "Universities"] },
          { h: "Company", l: ["About", "Security", "Terms", "Privacy"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="text-[11px] uppercase tracking-[0.14em] text-sidebar-foreground/50">{c.h}</div>
            <ul className="mt-3 space-y-2 text-[13px] text-sidebar-foreground/80">
              {c.l.map((i) => (
                <li key={i}><a href="#" className="hover:text-sidebar-foreground">{i}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-sidebar-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-[11px] text-sidebar-foreground/50">
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
      <div className="text-[11px] uppercase tracking-[0.18em] text-primary">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{sub}</p>}
    </div>
  );
}
