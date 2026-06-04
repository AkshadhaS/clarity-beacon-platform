import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TopBar } from "@/components/veritas/TopBar";
import { ScoreGauge } from "@/components/veritas/ScoreGauge";
import { ScoreCard } from "@/components/veritas/ScoreCard";
import { SeverityBadge } from "@/components/veritas/SeverityBadge";
import { ClaimGraph } from "@/components/veritas/ClaimGraph";
import { getAnalysis, type Analysis } from "@/lib/mockData";
import { Download, Share2, Printer, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_app/reports/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Report ${params.id} — VeritasIQ` }],
  }),
  loader: ({ params }): { analysis: Analysis } => {
    const a = getAnalysis(params.id);
    if (!a) throw notFound();
    return { analysis: a };
  },
  notFoundComponent: () => (
    <div className="grid h-full place-items-center p-12 text-center text-muted-foreground">
      <div>
        <div className="text-mono text-[11px] uppercase tracking-[0.14em]">Report not found</div>
        <Link to="/reports" className="mt-3 inline-block text-primary">Back to reports</Link>
      </div>
    </div>
  ),
  component: Report,
});

function Report() {
  const { analysis: a } = Route.useLoaderData();

  return (
    <>
      <TopBar title={a.title} breadcrumb={["Reports", a.id]} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6 p-6">
          {/* Header */}
          <header className="overflow-hidden rounded-md border bg-card">
            <div className="hairline-b flex flex-wrap items-center justify-between gap-3 bg-surface px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="text-mono text-[11px] text-muted-foreground">{a.id}</span>
                <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {a.type} · {a.source}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="inline-flex h-8 items-center gap-1.5 rounded border bg-card px-2.5 text-[12px] hover:bg-accent">
                  <Share2 className="h-3 w-3" /> Share
                </button>
                <button className="inline-flex h-8 items-center gap-1.5 rounded border bg-card px-2.5 text-[12px] hover:bg-accent">
                  <Printer className="h-3 w-3" /> Print
                </button>
                <button className="inline-flex h-8 items-center gap-1.5 rounded bg-primary px-2.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90">
                  <Download className="h-3 w-3" /> Export PDF
                </button>
              </div>
            </div>
            <div className="grid gap-px bg-border md:grid-cols-[260px_1fr]">
              <div className="hairline-b grid place-items-center bg-card p-6">
                <ScoreGauge value={a.credibility} size={160} label="Credibility" />
                <div className="mt-4"><SeverityBadge severity={a.riskLevel} /></div>
              </div>
              <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
                <div className="bg-card"><ScoreCard label="Evidence" value={a.evidence} /></div>
                <div className="bg-card"><ScoreCard label="Sources" value={a.breakdown.sources} /></div>
                <div className="bg-card"><ScoreCard label="Bias" value={a.bias} inverted /></div>
                <div className="bg-card"><ScoreCard label="Manipulation" value={a.manipulation} inverted /></div>
                <div className="bg-card"><ScoreCard label="Logic" value={a.breakdown.logic} /></div>
                <div className="bg-card"><ScoreCard label="Consistency" value={a.breakdown.consistency} /></div>
                <div className="bg-card"><ScoreCard label="Reliability" value={a.reliability} /></div>
                <div className="bg-card p-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Word count</div>
                  <div className="mt-3 text-mono text-2xl font-semibold tabular-nums">{a.wordCount.toLocaleString()}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{a.claims.length} claims extracted</div>
                </div>
              </div>
            </div>
          </header>

          <Section title="1 — Executive Summary">
            <p className="text-[14px] leading-relaxed">{a.executiveSummary}</p>
          </Section>

          <Section title="2 — Risk Assessment">
            <div className="flex items-center gap-3">
              <SeverityBadge severity={a.riskLevel} />
              <span className="text-[13px] text-muted-foreground">
                Aggregate risk derived from manipulation density, evidence gaps and source reliability.
              </span>
            </div>
          </Section>

          <Section title="3 — Key Claims">
            <ul className="divide-y">
              {a.claims.map((c) => (
                <li key={c.id} className="grid grid-cols-[60px_1fr_auto] items-start gap-4 py-3">
                  <span className="text-mono text-[11px] text-muted-foreground">{c.id}</span>
                  <span className="text-[13px]">{c.text}</span>
                  <ClaimStatus status={c.status} confidence={c.confidence} />
                </li>
              ))}
            </ul>
          </Section>

          <Section title="4 — Claim Graph">
            <ClaimGraph analysis={a} />
          </Section>

          <Section title="5 — Evidence Quality">
            <div className="grid gap-3 md:grid-cols-2">
              {a.claims.map((c) => (
                <div key={c.id} className="rounded-md border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-mono text-[11px] text-muted-foreground">{c.id}</span>
                    <ClaimStatus status={c.status} confidence={c.confidence} />
                  </div>
                  <p className="mt-2 text-[13px]">{c.text}</p>
                  {c.supporting.length > 0 && (
                    <div className="mt-3">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-severity-low">Supporting</div>
                      <ul className="mt-1 space-y-1 text-[12px]">{c.supporting.map((s) => <li key={s}>· {s}</li>)}</ul>
                    </div>
                  )}
                  {c.contradicting.length > 0 && (
                    <div className="mt-3">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-severity-critical">Contradicting</div>
                      <ul className="mt-1 space-y-1 text-[12px]">{c.contradicting.map((s) => <li key={s}>· {s}</li>)}</ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>

          <Section title="6 — Bias Analysis">
            <div className="grid gap-3 md:grid-cols-2">
              {a.biases.map((b) => (
                <div key={b.type} className="rounded-md border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold">{b.type} bias</span>
                    <SeverityBadge severity={b.severity} />
                  </div>
                  <p className="mt-2 text-[13px] text-muted-foreground">{b.explanation}</p>
                  <ul className="mt-3 space-y-1">
                    {b.examples.map((e) => (
                      <li key={e} className="text-[12px] text-mono text-muted-foreground">› {e}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section title="7 — Logical Fallacies">
            {a.fallacies.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">No significant logical fallacies detected.</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {a.fallacies.map((f) => (
                  <div key={f.type} className="rounded-md border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold">{f.type}</span>
                      <span className="text-mono text-[11px] text-muted-foreground">{f.confidence}%</span>
                    </div>
                    <blockquote className="mt-2 border-l-2 border-severity-medium/50 pl-2 text-[12px] italic text-muted-foreground">
                      “{f.excerpt}”
                    </blockquote>
                    <p className="mt-2 text-[12px]">{f.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="8 — Manipulation Techniques">
            <div className="grid gap-3 md:grid-cols-2">
              {a.manipulations.map((m) => (
                <div key={m.category} className="rounded-md border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold">{m.category}</span>
                    <span className="text-mono text-[11px] text-muted-foreground">conf {m.confidence}%</span>
                  </div>
                  <blockquote className="mt-2 rounded bg-severity-high/10 p-2 text-[12px] italic">
                    “{m.excerpt}”
                  </blockquote>
                  <p className="mt-2 text-[12px] text-muted-foreground">{m.explanation}</p>
                  <div className="mt-3 h-1 overflow-hidden rounded bg-muted">
                    <div className="h-full bg-severity-high" style={{ width: `${m.confidence}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="9 — Source Evaluation">
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-[13px]">
                <thead className="hairline-b bg-surface text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Source</th>
                    <th className="px-4 py-2.5 text-left font-medium">Type</th>
                    <th className="px-4 py-2.5 text-left font-medium">Bias</th>
                    <th className="px-4 py-2.5 text-right font-medium">Reliability</th>
                  </tr>
                </thead>
                <tbody>
                  {a.sources.map((s) => (
                    <tr key={s.name} className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-medium">{s.name}</div>
                        <div className="text-mono text-[11px] text-muted-foreground">{s.domain}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{s.type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.bias}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="ml-auto flex items-center justify-end gap-2">
                          <div className="h-1 w-24 overflow-hidden rounded bg-muted">
                            <div className="h-full bg-primary" style={{ width: `${s.reliability}%` }} />
                          </div>
                          <span className="text-mono w-8 text-right text-[12px] tabular-nums">{s.reliability}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="10 — Recommended Verification Actions">
            <ol className="space-y-2">
              {a.verificationActions.map((act, i) => (
                <li key={i} className="flex items-start gap-3 rounded-md border bg-card p-3">
                  <span className="text-mono mt-0.5 grid h-5 w-5 place-items-center rounded bg-primary/10 text-[11px] font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-[13px]">{act}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="11 — Final Credibility Assessment">
            <div className="rounded-md border-l-4 border-primary bg-card p-4">
              <p className="text-[14px] leading-relaxed">{a.finalAssessment}</p>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>Analyst: <span className="text-foreground">Alex Tan</span></span>
                <span>·</span>
                <span>Reviewed: <span className="text-foreground">{new Date(a.analyzedAt).toLocaleString()}</span></span>
                <span>·</span>
                <span>Audit hash: <span className="text-mono text-foreground">0x{a.id.slice(-6)}…f1c2</span></span>
              </div>
            </div>
          </Section>

          <div className="flex justify-end pt-4">
            <button className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90">
              <Download className="h-4 w-4" /> Export full report
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <header className="hairline-b flex items-center justify-between bg-surface px-5 py-2.5">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{title}</span>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function ClaimStatus({ status, confidence }: { status: string; confidence: number }) {
  const map: Record<string, string> = {
    Supported: "bg-severity-low/15 text-severity-low border-severity-low/30",
    "Partially Supported": "bg-severity-medium/15 text-severity-medium border-severity-medium/30",
    "Weak Evidence": "bg-severity-high/15 text-severity-high border-severity-high/30",
    Unsupported: "bg-severity-critical/15 text-severity-critical border-severity-critical/40",
  };
  return (
    <div className="flex items-center gap-2">
      <span className={`rounded-sm border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] ${map[status] ?? ""}`}>
        {status}
      </span>
      <span className="text-mono text-[11px] tabular-nums text-muted-foreground">{confidence}%</span>
    </div>
  );
}
