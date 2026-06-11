import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/veritas/TopBar";
import { ScoreGauge } from "@/components/veritas/ScoreGauge";
import { SeverityBadge } from "@/components/veritas/SeverityBadge";
import { analyses, analystAnnotations, verificationTimeline, type Analysis, type Annotation, type VerificationStep } from "@/lib/mockData";
import {
  FileText, Link as LinkIcon, Upload, Mic, Play, Loader2, ChevronRight,
  CheckCircle2, Clock, AlertOctagon, CircleDashed, Hash, Network, Layers,
  ShieldCheck, MessageSquare, Flag, Plus, Search,
} from "lucide-react";

export const Route = createFileRoute("/_app/analyze")({
  head: () => ({ meta: [{ title: "New Investigation — VeritasIQ" }] }),
  component: NewAnalysis,
});

type Mode = "text" | "url" | "pdf" | "transcript";

function NewAnalysis() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);
  const [tab, setTab] = useState<"document" | "claims" | "evidence" | "sources" | "narrative">("document");
  const navigate = useNavigate();

  function run() {
    setAnalyzing(true); setResult(null);
    setTimeout(() => {
      const l = text.toLowerCase();
      const pick =
        l.includes("supplement") || l.includes("they don't want") ? analyses[2]
        : l.includes("senator") || l.includes("establishment") ? analyses[0]
        : l.includes("ebitda") || l.includes("quarter") ? analyses[3]
        : analyses[1];
      setResult(pick); setAnalyzing(false);
    }, 1400);
  }

  function loadSample(i: number) {
    setMode("text"); setText(analyses[i].body); setResult(null);
  }

  const modes: { id: Mode; label: string; icon: typeof FileText; hint: string }[] = [
    { id: "text", label: "Paste text", icon: FileText, hint: "Article · post · transcript" },
    { id: "url", label: "Ingest URL", icon: LinkIcon, hint: "Fetch + canonicalize" },
    { id: "pdf", label: "Upload document", icon: Upload, hint: "PDF · DOCX · OCR" },
    { id: "transcript", label: "Import transcript", icon: Mic, hint: "VTT · SRT · raw" },
  ];

  return (
    <>
      <TopBar title="New Investigation" breadcrumb={["Workspace", "Investigation"]} />
      <main className="flex-1 overflow-hidden">
        <div className="grid h-full grid-cols-1 gap-px bg-border lg:grid-cols-[300px_1fr_380px]">
          {/* Left — Intake + verification timeline */}
          <section className="flex h-full flex-col overflow-y-auto bg-card">
            <div className="hairline-b px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Evidence intake</span>
                <span className="text-mono text-[10px] text-muted-foreground">CASE · DRAFT</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 p-2">
              {modes.map((m) => {
                const Icon = m.icon; const active = mode === m.id;
                return (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={`flex flex-col items-start gap-1 rounded-md border px-2.5 py-2 text-left transition-colors ${
                      active ? "border-primary/40 bg-primary/5" : "border-transparent hover:bg-accent"
                    }`}>
                    <Icon className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-[12px] font-medium">{m.label}</span>
                    <span className="text-[10px] text-muted-foreground">{m.hint}</span>
                  </button>
                );
              })}
            </div>

            <div className="px-3">
              {mode === "text" && (
                <textarea value={text} onChange={(e) => setText(e.target.value)}
                  placeholder="Paste an article, post, statement, or transcript…"
                  className="h-56 w-full resize-none rounded-md border bg-surface p-3 text-[13px] leading-relaxed outline-none focus:ring-1 focus:ring-ring" />
              )}
              {mode === "url" && (
                <div className="space-y-2">
                  <input type="url" placeholder="https://source.example/article"
                    className="h-9 w-full rounded-md border bg-surface px-3 text-[13px] outline-none focus:ring-1 focus:ring-ring" />
                  <div className="rounded-md border bg-surface px-3 py-2 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-severity-low" /> Domain reputation pre-check enabled</div>
                  </div>
                </div>
              )}
              {mode === "pdf" && (
                <div className="grid h-44 place-items-center rounded-md border-2 border-dashed bg-surface text-center text-[12px] text-muted-foreground">
                  <div><Upload className="mx-auto h-5 w-5" /><div className="mt-2">Drop document · OCR + entity extraction</div></div>
                </div>
              )}
              {mode === "transcript" && (
                <textarea placeholder="Paste VTT / SRT / raw transcript…"
                  className="h-44 w-full resize-none rounded-md border bg-surface p-3 text-mono text-[12px] outline-none focus:ring-1 focus:ring-ring" />
              )}

              <div className="mt-3 grid grid-cols-3 gap-1.5">
                <Toggle label="Claim extraction" on />
                <Toggle label="Source vetting" on />
                <Toggle label="Narrative match" on />
                <Toggle label="OCR / entity" />
                <Toggle label="Audio transcript" />
                <Toggle label="Translate · auto" />
              </div>

              <button onClick={run} disabled={analyzing || (mode === "text" && !text.trim())}
                className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {analyzing ? "Running forensic pipeline…" : "Run forensic pipeline"}
              </button>
            </div>

            <div className="hairline-t mt-4 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Verification queue</div>
              <ul className="mt-2 space-y-2">
                {verificationTimeline.slice(0, 6).map((v) => <VerificationRow key={v.id} step={v} />)}
              </ul>
            </div>

            <div className="hairline-t mt-auto px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Sample dossiers</div>
              <div className="mt-2 space-y-1.5">
                {analyses.map((a, i) => (
                  <button key={a.id} onClick={() => loadSample(i)}
                    className="flex w-full items-center justify-between rounded border bg-surface px-2.5 py-1.5 text-left text-[12px] hover:bg-accent">
                    <span className="truncate"><span className="text-mono text-muted-foreground">{a.type.slice(0,3).toUpperCase()}</span> · {a.title.slice(0, 28)}…</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Center — Investigation workspace */}
          <section className="flex h-full flex-col bg-card">
            <div className="hairline-b flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Workspace</span>
                {result && <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-mono text-[10px] text-muted-foreground">{result.id}</span>
                  <span className="text-mono text-[10px] text-muted-foreground">·</span>
                  <span className="text-[11px]">{result.wordCount.toLocaleString()} tokens</span>
                </>}
              </div>
              <div className="flex gap-1">
                {([
                  ["document", "Document", FileText],
                  ["claims", "Claims", Hash],
                  ["evidence", "Evidence", ShieldCheck],
                  ["sources", "Sources", Layers],
                  ["narrative", "Narrative", Network],
                ] as const).map(([id, label, Icon]) => (
                  <button key={id} onClick={() => setTab(id)}
                    className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[11px] ${
                      tab === id ? "border-primary/40 bg-primary/5 text-foreground" : "border-transparent text-muted-foreground hover:bg-accent"
                    }`}>
                    <Icon className="h-3 w-3" />{label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {analyzing && <PipelineSkeleton />}
              {!analyzing && !result && !text.trim() && <EmptyState />}
              {!analyzing && (text.trim() || result) && (
                <>
                  {tab === "document" && <DocumentView body={result?.body ?? text} analysis={result} />}
                  {tab === "claims" && result && <ClaimsView a={result} />}
                  {tab === "evidence" && result && <EvidenceView a={result} />}
                  {tab === "sources" && result && <SourcesView a={result} />}
                  {tab === "narrative" && result && <NarrativeView a={result} />}
                </>
              )}
            </div>
          </section>

          {/* Right — Forensic record + annotations */}
          <section className="flex h-full flex-col overflow-y-auto bg-card">
            <div className="hairline-b px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Forensic record</div>
            </div>

            {!result && !analyzing && (
              <div className="grid flex-1 place-items-center p-6 text-center text-[12px] text-muted-foreground">
                <div>
                  <div className="mx-auto grid h-10 w-10 place-items-center rounded-full border"><Play className="h-4 w-4" /></div>
                  <p className="mt-3">Run the pipeline to populate the forensic record, annotations, and verification ladder.</p>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="space-y-3 p-4">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="rounded-md border bg-card p-4">
                    <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                    <div className="mt-3 h-6 w-16 animate-pulse rounded bg-muted" />
                    <div className="mt-3 h-1.5 w-full animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            )}

            {result && (
              <div className="space-y-3 p-3">
                <div className="flex items-center justify-between">
                  <SeverityBadge severity={result.riskLevel} />
                  <span className="text-mono text-[10px] text-muted-foreground">{result.id}</span>
                </div>
                <div className="grid place-items-center rounded-md border bg-surface p-3">
                  <ScoreGauge value={result.credibility} size={130} />
                  <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Composite credibility</div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <Metric label="Evidence" value={result.evidence} />
                  <Metric label="Reliability" value={result.reliability} />
                  <Metric label="Bias" value={result.bias} inverted />
                  <Metric label="Manipulation" value={result.manipulation} inverted />
                </div>

                {/* Investigation status ladder */}
                <div className="rounded-md border bg-surface p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Investigation status</span>
                    <span className="text-mono text-[10px] text-primary">PHASE 3 / 6</span>
                  </div>
                  <div className="mt-2 flex items-end gap-0.5">
                    {["Intake","Claims","Evidence","Sources","Editor","Brief"].map((s,i) => (
                      <div key={s} className="flex flex-1 flex-col items-center gap-1">
                        <div className={`h-1 w-full ${i < 2 ? "bg-primary" : i === 2 ? "bg-severity-medium" : "bg-border"}`} />
                        <span className={`text-[8px] uppercase tracking-[0.1em] ${i <= 2 ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Claim extraction snapshot */}
                <div className="rounded-md border bg-surface p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Claim extraction</span>
                    <span className="text-mono text-[10px] tabular-nums text-muted-foreground">{result.claims.length} found</span>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-1">
                    {[
                      { l: "Sup", c: result.claims.filter(c => c.status === "Supported").length, t: "text-severity-low" },
                      { l: "Part", c: result.claims.filter(c => c.status === "Partially Supported").length, t: "text-severity-medium" },
                      { l: "Weak", c: result.claims.filter(c => c.status === "Weak Evidence").length, t: "text-severity-high" },
                      { l: "Uns", c: result.claims.filter(c => c.status === "Unsupported").length, t: "text-severity-critical" },
                    ].map((b) => (
                      <div key={b.l} className="rounded border bg-card p-1.5 text-center">
                        <div className={`text-mono text-[14px] font-semibold tabular-nums ${b.t}`}>{b.c}</div>
                        <div className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{b.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analyst annotations */}
                <div className="rounded-md border bg-surface">
                  <div className="hairline-b flex items-center justify-between px-2.5 py-1.5">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Analyst annotations</span>
                    <button className="inline-flex items-center gap-1 text-[10px] text-primary"><Plus className="h-3 w-3" />Note</button>
                  </div>
                  <ul className="max-h-64 divide-y overflow-y-auto">
                    {analystAnnotations.map((a) => <AnnotationRow key={a.id} a={a} />)}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button className="inline-flex h-8 items-center justify-center gap-1 rounded-md border bg-card text-[11px] hover:bg-accent">
                    <Plus className="h-3 w-3" />Add to case
                  </button>
                  <button className="inline-flex h-8 items-center justify-center gap-1 rounded-md border bg-card text-[11px] hover:bg-accent">
                    <Flag className="h-3 w-3" />Peer review
                  </button>
                </div>

                <button onClick={() => navigate({ to: "/reports/$id", params: { id: result.id } })}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/90">
                  Open investigative briefing <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function Toggle({ label, on }: { label: string; on?: boolean }) {
  return (
    <label className={`flex items-center gap-1.5 rounded border px-2 py-1.5 text-[10px] ${on ? "border-primary/40 bg-primary/5 text-foreground" : "border-border bg-surface text-muted-foreground"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-primary" : "bg-border"}`} />{label}
    </label>
  );
}

function Metric({ label, value, inverted }: { label: string; value: number; inverted?: boolean }) {
  const score = inverted ? 100 - value : value;
  const tone = score >= 70 ? "bg-severity-low" : score >= 50 ? "bg-severity-medium" : score >= 30 ? "bg-severity-high" : "bg-severity-critical";
  return (
    <div className="rounded-md border bg-surface px-2 py-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <span className="text-mono text-[13px] font-semibold tabular-nums">{value}</span>
      </div>
      <div className="mt-1 h-0.5 overflow-hidden rounded bg-muted">
        <div className={`h-full ${tone}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function VerificationRow({ step }: { step: VerificationStep }) {
  const Icon = step.status === "verified" ? CheckCircle2
    : step.status === "in_progress" ? Clock
    : step.status === "blocked" ? AlertOctagon
    : CircleDashed;
  const tone = step.status === "verified" ? "text-severity-low"
    : step.status === "in_progress" ? "text-primary"
    : step.status === "blocked" ? "text-severity-critical"
    : "text-muted-foreground";
  return (
    <li className="flex items-start gap-2">
      <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tone}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[11px] font-medium">{step.label}</span>
          <span className="text-mono text-[9px] text-muted-foreground">{step.at}</span>
        </div>
        <div className="text-[10px] text-muted-foreground">{step.detail}</div>
      </div>
    </li>
  );
}

function AnnotationRow({ a }: { a: Annotation }) {
  const tagTone: Record<Annotation["tag"], string> = {
    claim: "text-primary border-primary/40",
    evidence: "text-severity-low border-severity-low/40",
    source: "text-severity-medium border-severity-medium/40",
    narrative: "text-chart-5 border-chart-5/40",
    flag: "text-severity-critical border-severity-critical/40",
  };
  return (
    <li className="px-2.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/15 text-mono text-[9px] font-semibold text-primary">{a.initials}</span>
          <span className="text-[11px] font-medium">{a.analyst}</span>
          <span className={`text-mono rounded border px-1 py-px text-[8px] uppercase tracking-[0.12em] ${tagTone[a.tag]}`}>{a.tag}</span>
        </div>
        <span className="text-mono text-[9px] text-muted-foreground">{a.at}</span>
      </div>
      {a.span && <div className="mt-1 truncate border-l-2 border-border pl-2 text-[10px] italic text-muted-foreground">“{a.span}”</div>}
      <p className="mt-1 text-[11px] leading-snug">{a.body}</p>
    </li>
  );
}

function PipelineSkeleton() {
  const stages = ["Tokenizing", "Extracting claims", "Vetting sources", "Cross-referencing evidence", "Mapping narrative", "Composing brief"];
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-surface p-3">
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Forensic pipeline · live</div>
        <ul className="mt-2 space-y-1.5">
          {stages.map((s, i) => (
            <li key={s} className="flex items-center gap-2 text-[11px]">
              {i < 3 ? <CheckCircle2 className="h-3 w-3 text-severity-low" /> :
               i === 3 ? <Loader2 className="h-3 w-3 animate-spin text-primary" /> :
               <CircleDashed className="h-3 w-3 text-muted-foreground" />}
              <span className={i <= 3 ? "" : "text-muted-foreground"}>{s}</span>
              {i === 3 && <span className="text-mono ml-auto text-[10px] text-muted-foreground">ETA 1.2s</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        {[100,92,78,96,84,70,90,88,60].map((w,i) => (
          <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid h-full place-items-center text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-md border bg-surface text-primary"><Search className="h-5 w-5" /></div>
        <h3 className="mt-4 text-[15px] font-semibold">Awaiting evidence intake</h3>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          Ingest an article, URL, document, or transcript to begin. VeritasIQ extracts claims, vets sources, maps the narrative cluster, and produces an audit-grade briefing.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-1.5 text-[10px]">
          {[
            ["Claim extraction", "NLI · QA-grounded"],
            ["Source vetting", "Reliability corpus · 184K domains"],
            ["Narrative matching", "Cross-source amplification graph"],
            ["Manipulation detection", "26 rhetorical patterns"],
          ].map(([t, s]) => (
            <div key={t} className="rounded border bg-surface px-2 py-1.5 text-left">
              <div className="text-[10px] font-medium">{t}</div>
              <div className="text-[9px] text-muted-foreground">{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentView({ body, analysis }: { body: string; analysis: Analysis | null }) {
  if (!analysis) return <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{body}</p>;
  const marks = [
    ...analysis.manipulations.map(m => ({ text: m.excerpt, cls: "bg-severity-high/15 underline decoration-severity-high/60 decoration-2 underline-offset-4", label: m.category })),
    ...analysis.fallacies.map(f => ({ text: f.excerpt, cls: "bg-severity-medium/15 underline decoration-severity-medium/60 decoration-2 underline-offset-4", label: f.type })),
  ];
  let html = body;
  marks.forEach(m => { if (m.text) html = html.replace(m.text, `<mark class="${m.cls} rounded-sm px-0.5" title="${m.label}">${m.text}</mark>`); });
  return (
    <article className="prose prose-sm max-w-none">
      <div className="mb-4 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-severity-high/50" /> Manipulation</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-severity-medium/50" /> Fallacy</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-primary/40" /> Extracted claim</span>
        <span className="ml-auto text-mono">{analysis.wordCount.toLocaleString()} tokens · {analysis.claims.length} claims · {analysis.sources.length} sources</span>
      </div>
      <p className="whitespace-pre-wrap text-[14px] leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}

function ClaimsView({ a }: { a: Analysis }) {
  const tone: Record<string,string> = {
    Supported: "text-severity-low border-severity-low/40 bg-severity-low/10",
    "Partially Supported": "text-severity-medium border-severity-medium/40 bg-severity-medium/10",
    "Weak Evidence": "text-severity-high border-severity-high/40 bg-severity-high/10",
    Unsupported: "text-severity-critical border-severity-critical/40 bg-severity-critical/10",
  };
  return (
    <div className="space-y-3">
      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{a.claims.length} extracted claims</div>
      {a.claims.map((c) => (
        <div key={c.id} className="rounded-md border bg-surface">
          <div className="hairline-b flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-mono text-[10px] text-muted-foreground">{c.id}</span>
              <span className={`text-mono rounded border px-1.5 py-px text-[10px] uppercase tracking-[0.1em] ${tone[c.status]}`}>{c.status}</span>
            </div>
            <span className="text-mono text-[11px] tabular-nums text-muted-foreground">conf {c.confidence}%</span>
          </div>
          <div className="p-3">
            <p className="text-[13px]">{c.text}</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-severity-low">Supporting evidence</div>
                <ul className="mt-1 space-y-0.5 text-[12px]">
                  {c.supporting.length ? c.supporting.map(s => <li key={s}>+ {s}</li>) : <li className="text-muted-foreground">— None located —</li>}
                </ul>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-severity-critical">Contradicting evidence</div>
                <ul className="mt-1 space-y-0.5 text-[12px]">
                  {c.contradicting.length ? c.contradicting.map(s => <li key={s}>− {s}</li>) : <li className="text-muted-foreground">— None located —</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EvidenceView({ a }: { a: Analysis }) {
  return (
    <div className="space-y-3">
      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Manipulation indicators ({a.manipulations.length})</div>
      <div className="grid gap-2 md:grid-cols-2">
        {a.manipulations.map(m => (
          <div key={m.category} className="rounded-md border bg-surface p-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold">{m.category}</span>
              <span className="text-mono text-[11px] tabular-nums text-severity-high">conf {m.confidence}%</span>
            </div>
            <blockquote className="mt-2 rounded bg-severity-high/10 p-2 text-[12px] italic">“{m.excerpt}”</blockquote>
            <p className="mt-2 text-[11px] text-muted-foreground">{m.explanation}</p>
            <div className="mt-2 h-1 overflow-hidden rounded bg-muted">
              <div className="h-full bg-severity-high" style={{ width: `${m.confidence}%` }} />
            </div>
          </div>
        ))}
      </div>
      {a.fallacies.length > 0 && (
        <>
          <div className="hairline-t pt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Logical fallacies ({a.fallacies.length})</div>
          <div className="grid gap-2 md:grid-cols-2">
            {a.fallacies.map(f => (
              <div key={f.type} className="rounded-md border bg-surface p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold">{f.type}</span>
                  <span className="text-mono text-[11px] tabular-nums text-muted-foreground">{f.confidence}%</span>
                </div>
                <blockquote className="mt-2 border-l-2 border-severity-medium/50 pl-2 text-[12px] italic text-muted-foreground">“{f.excerpt}”</blockquote>
                <p className="mt-2 text-[11px]">{f.explanation}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SourcesView({ a }: { a: Analysis }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-[12px]">
        <thead className="hairline-b bg-surface text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Source</th>
            <th className="px-3 py-2 text-left font-medium">Type</th>
            <th className="px-3 py-2 text-left font-medium">Bias</th>
            <th className="px-3 py-2 text-right font-medium">Reliability</th>
            <th className="px-3 py-2 text-left font-medium">Verification</th>
          </tr>
        </thead>
        <tbody>
          {a.sources.map(s => (
            <tr key={s.name} className="border-t">
              <td className="px-3 py-2">
                <div className="font-medium">{s.name}</div>
                <div className="text-mono text-[10px] text-muted-foreground">{s.domain}</div>
              </td>
              <td className="px-3 py-2 text-muted-foreground">{s.type}</td>
              <td className="px-3 py-2 text-muted-foreground">{s.bias}</td>
              <td className="px-3 py-2 text-right">
                <div className="ml-auto flex items-center justify-end gap-2">
                  <div className="h-1 w-20 overflow-hidden rounded bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${s.reliability}%` }} />
                  </div>
                  <span className="text-mono w-7 text-right tabular-nums">{s.reliability}</span>
                </div>
              </td>
              <td className="px-3 py-2">
                {s.reliability >= 70 ? <span className="text-mono inline-flex items-center gap-1 text-[10px] text-severity-low"><CheckCircle2 className="h-3 w-3" />Verified</span>
                  : s.reliability >= 40 ? <span className="text-mono inline-flex items-center gap-1 text-[10px] text-severity-medium"><Clock className="h-3 w-3" />Watch</span>
                  : <span className="text-mono inline-flex items-center gap-1 text-[10px] text-severity-critical"><AlertOctagon className="h-3 w-3" />Flagged</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NarrativeView({ a }: { a: Analysis }) {
  return (
    <div className="space-y-3">
      <div className="rounded-md border bg-surface p-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Matched narrative cluster</span>
          <span className="text-mono text-[10px] text-primary">NC-019 · 71% match</span>
        </div>
        <div className="mt-2 text-[14px] font-semibold">Hollis polling boost</div>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Cluster of 78 sources amplifying favourable polling framing for Sen. Hollis over the last 9 days.
          Document {a.id} contributes 3 amplifying signals and 1 contradicted claim.
        </p>
        <div className="mt-3 grid grid-cols-4 gap-2 text-[11px]">
          <Tile label="Nodes" value="78" />
          <Tile label="Amplifiers" value="14" />
          <Tile label="Reach" value="640K" />
          <Tile label="Risk" value="Medium" tone="text-severity-medium" />
        </div>
      </div>
      <div className="rounded-md border bg-surface p-3">
        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Cross-document echoes</div>
        <ul className="mt-2 divide-y text-[12px]">
          {[
            ["capital-beacon.example", "Hollis polls 'highest in 20 years'", "92% phrase overlap"],
            ["policywatch.example", "Establishment-fatigue framing", "64% theme overlap"],
            ["x.example · @grassroots_now", "Insider quote re-amplified", "Verbatim quote"],
          ].map(([d, t, m]) => (
            <li key={d} className="flex items-center justify-between py-2">
              <div className="min-w-0">
                <div className="text-mono text-[11px] text-muted-foreground">{d}</div>
                <div className="truncate">{t}</div>
              </div>
              <span className="text-mono text-[10px] text-muted-foreground">{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Tile({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded border bg-card p-2">
      <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className={`text-mono mt-0.5 text-[14px] font-semibold tabular-nums ${tone ?? ""}`}>{value}</div>
    </div>
  );
}
