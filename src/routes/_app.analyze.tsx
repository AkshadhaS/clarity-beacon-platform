import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/veritas/TopBar";
import { ScoreGauge } from "@/components/veritas/ScoreGauge";
import { ScoreCard } from "@/components/veritas/ScoreCard";
import { SeverityBadge } from "@/components/veritas/SeverityBadge";
import { analyses } from "@/lib/mockData";
import { FileText, Link as LinkIcon, Upload, Mic, Play, Loader2, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_app/analyze")({
  head: () => ({ meta: [{ title: "New Analysis — VeritasIQ" }] }),
  component: NewAnalysis,
});

type Mode = "text" | "url" | "pdf" | "transcript";

function NewAnalysis() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<typeof analyses[number] | null>(null);
  const navigate = useNavigate();

  function run() {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      // Choose a mock result by content heuristic
      const lower = text.toLowerCase();
      const pick =
        lower.includes("supplement") || lower.includes("they don't want")
          ? analyses[2]
          : lower.includes("senator") || lower.includes("establishment")
            ? analyses[0]
            : lower.includes("ebitda") || lower.includes("quarter")
              ? analyses[3]
              : analyses[1];
      setResult(pick);
      setAnalyzing(false);
    }, 1400);
  }

  function loadSample(i: number) {
    setMode("text");
    setText(analyses[i].body);
    setResult(null);
  }

  const modes: { id: Mode; label: string; icon: typeof FileText }[] = [
    { id: "text", label: "Paste Text", icon: FileText },
    { id: "url", label: "Analyze URL", icon: LinkIcon },
    { id: "pdf", label: "Upload PDF", icon: Upload },
    { id: "transcript", label: "Import Transcript", icon: Mic },
  ];

  return (
    <>
      <TopBar title="New Analysis" breadcrumb={["Workspace", "New Analysis"]} />
      <main className="flex-1 overflow-hidden">
        <div className="grid h-full grid-cols-1 gap-px bg-border lg:grid-cols-[320px_1fr_360px]">
          {/* Column 1 — Input */}
          <section className="flex h-full flex-col bg-card">
            <div className="hairline-b px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Evidence intake</div>
            </div>
            <div className="flex flex-col gap-1.5 p-3">
              {modes.map((m) => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex items-center gap-2.5 rounded-md border px-3 py-2 text-left text-[13px] transition-colors ${
                      active ? "border-primary/40 bg-primary/5 text-foreground" : "border-transparent text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{m.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
            <div className="flex-1 p-4 pt-2">
              {mode === "text" && (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste an article, post, or transcript here…"
                  className="h-64 w-full resize-none rounded-md border bg-surface p-3 text-[13px] leading-relaxed outline-none focus:ring-1 focus:ring-ring"
                />
              )}
              {mode === "url" && (
                <input
                  type="url"
                  placeholder="https://example.com/article"
                  className="h-10 w-full rounded-md border bg-surface px-3 text-[13px] outline-none focus:ring-1 focus:ring-ring"
                />
              )}
              {mode === "pdf" && (
                <div className="grid h-44 place-items-center rounded-md border-2 border-dashed bg-surface text-center text-[12px] text-muted-foreground">
                  <div>
                    <Upload className="mx-auto h-5 w-5" />
                    <div className="mt-2">Drop a PDF or click to upload</div>
                  </div>
                </div>
              )}
              {mode === "transcript" && (
                <textarea
                  placeholder="Paste a VTT, SRT, or plain transcript…"
                  className="h-44 w-full resize-none rounded-md border bg-surface p-3 text-mono text-[12px] outline-none focus:ring-1 focus:ring-ring"
                />
              )}
              <div className="mt-4 space-y-2">
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Try a sample
                </div>
                {analyses.map((a, i) => (
                  <button
                    key={a.id}
                    onClick={() => loadSample(i)}
                    className="flex w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-left text-[12px] hover:bg-accent"
                  >
                    <span className="truncate">{a.type} · {a.title.slice(0, 32)}…</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
            <div className="hairline-t p-3">
              <button
                onClick={run}
                disabled={analyzing || (mode === "text" && !text.trim())}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {analyzing ? "Analyzing…" : "Run forensic analysis"}
              </button>
            </div>
          </section>

          {/* Column 2 — Content viewer */}
          <section className="flex h-full flex-col bg-card">
            <div className="hairline-b flex items-center justify-between px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Investigation workspace</div>
              <div className="flex gap-1.5">
                {["Highlights", "Claims", "Evidence map", "Sources", "Raw"].map((t, i) => (
                  <button
                    key={t}
                    className={`rounded border px-2 py-0.5 text-[11px] ${
                      i === 0 ? "border-primary/40 bg-primary/5 text-foreground" : "border-transparent text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {analyzing && (
                <div className="space-y-3">
                  {[100, 92, 78, 96, 84, 70, 90, 88, 60].map((w, i) => (
                    <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />
                  ))}
                </div>
              )}
              {!analyzing && !result && !text.trim() && (
                <EmptyState />
              )}
              {!analyzing && (text.trim() || result) && (
                <article className="prose prose-sm max-w-none">
                  <HighlightedText body={result?.body ?? text} analysis={result} />
                </article>
              )}
            </div>
          </section>

          {/* Column 3 — Summary */}
          <section className="flex h-full flex-col bg-card">
            <div className="hairline-b px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Forensic record</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {!result && !analyzing && (
                <div className="grid h-full place-items-center text-center text-[12px] text-muted-foreground">
                  <div>
                    <div className="mx-auto grid h-10 w-10 place-items-center rounded-full border">
                      <Play className="h-4 w-4" />
                    </div>
                    <p className="mt-3">Run an analysis to populate the forensic record.</p>
                  </div>
                </div>
              )}

              {analyzing && (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="rounded-md border bg-card p-4">
                      <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                      <div className="mt-3 h-6 w-16 animate-pulse rounded bg-muted" />
                      <div className="mt-3 h-1.5 w-full animate-pulse rounded bg-muted" />
                    </div>
                  ))}
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <SeverityBadge severity={result.riskLevel} />
                    <span className="text-mono text-[11px] text-muted-foreground">{result.id}</span>
                  </div>
                  <div className="grid place-items-center rounded-md border bg-surface p-4">
                    <ScoreGauge value={result.credibility} size={140} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <ScoreCard label="Evidence" value={result.evidence} />
                    <ScoreCard label="Reliability" value={result.reliability} />
                    <ScoreCard label="Bias" value={result.bias} inverted />
                    <ScoreCard label="Manipulation" value={result.manipulation} inverted />
                  </div>
                  {/* Investigation status workflow */}
                  <div className="rounded-md border bg-surface p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Investigation status</span>
                      <span className="text-mono text-[10px] text-primary">PHASE 3 / 6</span>
                    </div>
                    <div className="mt-2 flex items-center gap-0.5">
                      {["Intake", "Claims", "Evidence", "Sources", "Editor", "Brief"].map((s, i) => (
                        <div key={s} className="flex flex-1 flex-col items-center">
                          <div className={`h-1 w-full ${i <= 2 ? (i === 2 ? "bg-severity-medium" : "bg-primary") : "bg-border"}`} />
                          <span className={`mt-1 text-[9px] uppercase tracking-[0.1em] ${i <= 2 ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Claim extraction snapshot */}
                  <div className="rounded-md border bg-surface p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Claim extraction</span>
                      <span className="text-mono text-[10px] tabular-nums text-muted-foreground">{result.claims.length} extracted</span>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-1 text-[10px]">
                      {[
                        { l: "Supported", c: result.claims.filter(c => c.status === "Supported").length, t: "text-severity-low" },
                        { l: "Partial", c: result.claims.filter(c => c.status === "Partially Supported").length, t: "text-severity-medium" },
                        { l: "Weak", c: result.claims.filter(c => c.status === "Weak Evidence").length, t: "text-severity-high" },
                        { l: "Unsup.", c: result.claims.filter(c => c.status === "Unsupported").length, t: "text-severity-critical" },
                      ].map((b) => (
                        <div key={b.l} className="rounded border bg-card p-1.5 text-center">
                          <div className={`text-mono text-[14px] font-semibold tabular-nums ${b.t}`}>{b.c}</div>
                          <div className="text-muted-foreground">{b.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border bg-card text-[12px] hover:bg-accent">
                      Add to case
                    </button>
                    <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border bg-card text-[12px] hover:bg-accent">
                      Request peer review
                    </button>
                  </div>

                  <button
                    onClick={() => navigate({ to: "/reports/$id", params: { id: result.id } })}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Open investigative briefing <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function EmptyState() {
  return (
    <div className="grid h-full place-items-center text-center">
      <div className="max-w-sm">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-md border bg-surface text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-[15px] font-semibold">Awaiting content</h3>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          Paste an article, drop a URL, or load a sample to see VeritasIQ deconstruct it claim by claim.
        </p>
      </div>
    </div>
  );
}

function HighlightedText({ body, analysis }: { body: string; analysis: typeof analyses[number] | null }) {
  if (!analysis) {
    return <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{body}</p>;
  }
  // Highlight excerpts from manipulations / fallacies
  const marks = [
    ...analysis.manipulations.map((m) => ({ text: m.excerpt, kind: "manip" as const, label: m.category })),
    ...analysis.fallacies.map((f) => ({ text: f.excerpt, kind: "fallacy" as const, label: f.type })),
  ];
  let html = body;
  marks.forEach((m) => {
    if (!m.text) return;
    const cls =
      m.kind === "manip"
        ? "bg-severity-high/15 underline decoration-severity-high/60 decoration-2 underline-offset-4"
        : "bg-severity-medium/15 underline decoration-severity-medium/60 decoration-2 underline-offset-4";
    html = html.replace(
      m.text,
      `<mark class="${cls} px-0.5 rounded-sm" title="${m.label}">${m.text}</mark>`,
    );
  });
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-severity-high/40" /> Manipulation</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-severity-medium/40" /> Fallacy</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-primary/30" /> Claim</span>
      </div>
      <p
        className="whitespace-pre-wrap text-[14px] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="mt-6 border-t pt-4">
        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Identified claims</div>
        <ul className="mt-2 space-y-1.5">
          {analysis.claims.map((c) => (
            <li key={c.id} className="flex items-start gap-2 text-[13px]">
              <span className="text-mono mt-0.5 text-[10px] text-muted-foreground">{c.id}</span>
              <span className="flex-1">{c.text}</span>
              <span className="text-mono text-[11px] text-muted-foreground">{c.confidence}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
