import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TopBar } from "@/components/veritas/TopBar";
import { ScoreGauge } from "@/components/veritas/ScoreGauge";
import { ScoreCard } from "@/components/veritas/ScoreCard";
import { SeverityBadge } from "@/components/veritas/SeverityBadge";
import { ClaimGraph } from "@/components/veritas/ClaimGraph";
import { getAnalysis, type Analysis } from "@/lib/mockData";
import { Download, Share2, Printer, ChevronRight, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/reports/$id")({
  head: ({ params }) => ({ meta: [{ title: `Briefing ${params.id} — VeritasIQ` }] }),
  loader: ({ params }): { analysis: Analysis } => {
    const a = getAnalysis(params.id);
    if (!a) throw notFound();
    return { analysis: a };
  },
  notFoundComponent: () => (
    <div className="grid h-full place-items-center p-12 text-center text-muted-foreground">
      <div>
        <div className="text-mono text-[11px] uppercase tracking-[0.14em]">Briefing not found</div>
        <Link to="/reports" className="mt-3 inline-block text-primary">Back to briefings</Link>
      </div>
    </div>
  ),
  component: Report,
});

const SECTIONS = [
  ["01", "Executive Summary"],
  ["02", "Key Findings"],
  ["03", "Risk Assessment"],
  ["04", "Claim Validation"],
  ["05", "Claim Intelligence Graph"],
  ["06", "Evidence Review"],
  ["07", "Bias Analysis"],
  ["08", "Manipulation Assessment"],
  ["09", "Logical Fallacies"],
  ["10", "Source Reliability"],
  ["11", "Narrative Evolution"],
  ["12", "Recommended Actions"],
  ["13", "Final Assessment"],
  ["14", "Audit Trail"],
] as const;

function Report() {
  const { analysis: a } = Route.useLoaderData() as { analysis: Analysis };
  const findings = [
    { tone: "severity-critical", t: `Composite credibility at ${a.credibility}/100 — ${a.riskLevel.toUpperCase()} risk`, d: `Aggregate risk derived from manipulation density, evidence gaps, and source reliability.` },
    { tone: "severity-high", t: `${a.manipulations.length} manipulation indicators detected`, d: a.manipulations[0]?.explanation ?? "" },
    { tone: "severity-medium", t: `${a.claims.filter(c => c.status === "Unsupported" || c.status === "Weak Evidence").length} claims lacking corroboration`, d: `Of ${a.claims.length} extracted claims, several rely on unverifiable assertions.` },
    { tone: "primary", t: `${a.sources.length} sources mapped · ${a.sources.filter(s => s.reliability >= 70).length} verified`, d: `Source corpus indicates ${a.sources.some(s => s.reliability < 30) ? "presence of low-reliability or anonymous sourcing." : "predominantly vetted attribution."}` },
  ];

  return (
    <>
      <TopBar title={a.title} breadcrumb={["Briefings", a.id]} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-7xl grid-cols-[200px_1fr] gap-6 p-6">
          {/* Section index rail */}
          <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] lg:block">
            <div className="rounded-md border bg-card p-3">
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Sections</div>
              <ol className="mt-2 space-y-0.5 text-[11px]">
                {SECTIONS.map(([n, t]) => (
                  <li key={n}><a href={`#s-${n}`} className="flex gap-2 rounded px-1.5 py-1 hover:bg-accent">
                    <span className="text-mono text-muted-foreground">{n}</span>
                    <span>{t}</span>
                  </a></li>
                ))}
              </ol>
            </div>
            <div className="mt-3 rounded-md border bg-card p-3">
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Classification</div>
              <div className="mt-1.5 text-mono text-[11px]">INTERNAL · ANALYST</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Distribution</div>
              <div className="mt-1.5 text-[11px]">Investigations · Editorial</div>
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            {/* Briefing header */}
            <header className="overflow-hidden rounded-md border bg-card">
              <div className="hairline-b flex flex-wrap items-center justify-between gap-3 bg-surface px-5 py-2.5">
                <div className="flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="text-mono uppercase tracking-[0.14em] text-primary">Investigative Briefing</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-mono text-muted-foreground">{a.id}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="uppercase tracking-[0.12em] text-muted-foreground">{a.type} · {a.source}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="inline-flex h-8 items-center gap-1.5 rounded border bg-card px-2.5 text-[12px] hover:bg-accent"><Share2 className="h-3 w-3" /> Share</button>
                  <button className="inline-flex h-8 items-center gap-1.5 rounded border bg-card px-2.5 text-[12px] hover:bg-accent"><Printer className="h-3 w-3" /> Print</button>
                  <button className="inline-flex h-8 items-center gap-1.5 rounded bg-primary px-2.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90"><Download className="h-3 w-3" /> Export brief</button>
                </div>
              </div>
              <div className="grid gap-px bg-border md:grid-cols-[280px_1fr]">
                <div className="hairline-b grid place-items-center bg-card p-6">
                  <ScoreGauge value={a.credibility} size={170} label="Credibility" />
                  <div className="mt-4 flex flex-col items-center gap-1.5">
                    <SeverityBadge severity={a.riskLevel} />
                    <span className="text-mono text-[10px] text-muted-foreground">composite risk</span>
                  </div>
                </div>
                <div className="bg-card p-6">
                  <h1 className="text-[20px] font-semibold leading-tight">{a.title}</h1>
                  <p className="mt-2 text-[13px] text-muted-foreground">{a.excerpt}</p>
                  <div className="mt-4 grid grid-cols-2 gap-px bg-border md:grid-cols-4">
                    <div className="bg-card"><ScoreCard label="Evidence" value={a.evidence} /></div>
                    <div className="bg-card"><ScoreCard label="Sources" value={a.breakdown.sources} /></div>
                    <div className="bg-card"><ScoreCard label="Bias" value={a.bias} inverted /></div>
                    <div className="bg-card"><ScoreCard label="Manipulation" value={a.manipulation} inverted /></div>
                    <div className="bg-card"><ScoreCard label="Logic" value={a.breakdown.logic} /></div>
                    <div className="bg-card"><ScoreCard label="Consistency" value={a.breakdown.consistency} /></div>
                    <div className="bg-card"><ScoreCard label="Reliability" value={a.reliability} /></div>
                    <div className="bg-card p-3">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Tokens</div>
                      <div className="text-mono mt-1 text-[18px] font-semibold tabular-nums">{a.wordCount.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">{a.claims.length} claims</div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <Section id="s-01" n="01" title="Executive Summary">
              <p className="text-[14px] leading-relaxed">{a.executiveSummary}</p>
            </Section>

            <Section id="s-02" n="02" title="Key Findings">
              <ul className="space-y-2">
                {findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-md border bg-surface p-3">
                    <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full bg-${f.tone}`} />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium">{f.t}</div>
                      <div className="text-[12px] text-muted-foreground">{f.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="s-03" n="03" title="Risk Assessment">
              <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
                <div className="rounded-md border bg-surface p-3">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Composite risk</div>
                  <div className="mt-2"><SeverityBadge severity={a.riskLevel} /></div>
                  <div className="text-mono mt-3 text-[10px] text-muted-foreground">
                    Risk = (1 − cred/100) × manip × (1 − rel/100)
                  </div>
                </div>
                <div className="rounded-md border bg-surface p-3">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Driver decomposition</div>
                  <div className="mt-3 space-y-2">
                    {[
                      ["Evidence gap", 100 - a.evidence],
                      ["Source unreliability", 100 - a.reliability],
                      ["Manipulation density", a.manipulation],
                      ["Bias intensity", a.bias],
                    ].map(([l, v]) => (
                      <div key={l as string} className="grid grid-cols-[140px_1fr_auto] items-center gap-3">
                        <span className="text-[12px]">{l}</span>
                        <div className="h-1.5 overflow-hidden rounded bg-muted">
                          <div className="h-full bg-severity-high" style={{ width: `${v as number}%` }} />
                        </div>
                        <span className="text-mono w-8 text-right text-[11px] tabular-nums">{v as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            <Section id="s-04" n="04" title="Claim Validation">
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

            <Section id="s-05" n="05" title="Claim Intelligence Graph">
              <ClaimGraph analysis={a} />
            </Section>

            <Section id="s-06" n="06" title="Evidence Review">
              <div className="grid gap-3 md:grid-cols-2">
                {a.claims.map((c) => (
                  <div key={c.id} className="rounded-md border bg-surface p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-mono text-[11px] text-muted-foreground">{c.id}</span>
                      <ClaimStatus status={c.status} confidence={c.confidence} />
                    </div>
                    <p className="mt-2 text-[13px]">{c.text}</p>
                    {c.supporting.length > 0 && (
                      <div className="mt-3"><div className="text-[10px] uppercase tracking-[0.14em] text-severity-low">Supporting</div>
                        <ul className="mt-1 space-y-1 text-[12px]">{c.supporting.map(s => <li key={s}>+ {s}</li>)}</ul>
                      </div>
                    )}
                    {c.contradicting.length > 0 && (
                      <div className="mt-3"><div className="text-[10px] uppercase tracking-[0.14em] text-severity-critical">Contradicting</div>
                        <ul className="mt-1 space-y-1 text-[12px]">{c.contradicting.map(s => <li key={s}>− {s}</li>)}</ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section id="s-07" n="07" title="Bias Analysis">
              <div className="grid gap-3 md:grid-cols-2">
                {a.biases.map((b) => (
                  <div key={b.type} className="rounded-md border bg-surface p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold">{b.type} bias</span>
                      <SeverityBadge severity={b.severity} />
                    </div>
                    <p className="mt-2 text-[13px] text-muted-foreground">{b.explanation}</p>
                    <ul className="mt-3 space-y-1">
                      {b.examples.map(e => <li key={e} className="text-mono text-[12px] text-muted-foreground">› {e}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="s-08" n="08" title="Manipulation Assessment">
              <div className="grid gap-3 md:grid-cols-2">
                {a.manipulations.map((m) => (
                  <div key={m.category} className="rounded-md border bg-surface p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold">{m.category}</span>
                      <span className="text-mono text-[11px] text-muted-foreground">conf {m.confidence}%</span>
                    </div>
                    <blockquote className="mt-2 rounded bg-severity-high/10 p-2 text-[12px] italic">“{m.excerpt}”</blockquote>
                    <p className="mt-2 text-[12px] text-muted-foreground">{m.explanation}</p>
                    <div className="mt-3 h-1 overflow-hidden rounded bg-muted">
                      <div className="h-full bg-severity-high" style={{ width: `${m.confidence}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="s-09" n="09" title="Logical Fallacies">
              {a.fallacies.length === 0 ? (
                <p className="text-[13px] text-muted-foreground">No significant logical fallacies detected.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {a.fallacies.map((f) => (
                    <div key={f.type} className="rounded-md border bg-surface p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold">{f.type}</span>
                        <span className="text-mono text-[11px] text-muted-foreground">{f.confidence}%</span>
                      </div>
                      <blockquote className="mt-2 border-l-2 border-severity-medium/50 pl-2 text-[12px] italic text-muted-foreground">“{f.excerpt}”</blockquote>
                      <p className="mt-2 text-[12px]">{f.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section id="s-10" n="10" title="Source Reliability">
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-[13px]">
                  <thead className="hairline-b bg-surface text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    <tr><th className="px-4 py-2 text-left font-medium">Source</th><th className="px-4 py-2 text-left font-medium">Type</th><th className="px-4 py-2 text-left font-medium">Bias</th><th className="px-4 py-2 text-right font-medium">Reliability</th></tr>
                  </thead>
                  <tbody>
                    {a.sources.map((s) => (
                      <tr key={s.name} className="border-t">
                        <td className="px-4 py-3"><div className="font-medium">{s.name}</div><div className="text-mono text-[11px] text-muted-foreground">{s.domain}</div></td>
                        <td className="px-4 py-3 text-muted-foreground">{s.type}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.bias}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="ml-auto flex items-center justify-end gap-2">
                            <div className="h-1 w-24 overflow-hidden rounded bg-muted"><div className="h-full bg-primary" style={{ width: `${s.reliability}%` }} /></div>
                            <span className="text-mono w-8 text-right text-[12px] tabular-nums">{s.reliability}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="s-11" n="11" title="Narrative Evolution">
              <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
                <div className="rounded-md border bg-surface p-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Matched cluster</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[15px] font-semibold">{a.type === "Political" ? "NC-019 · Hollis polling boost" : a.type === "Social Media" ? "NC-022 · Pharma suppression" : a.type === "Press Release" ? "NC-031 · Corporate framing — Helix" : "NC-026 · Municipal water quality"}</span>
                  </div>
                  <p className="mt-2 text-[12px] text-muted-foreground">9-day velocity trace shown right. Amplification observed across {a.sources.length + 3} domains with overlapping phrasing.</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                    <Tile label="Velocity" value={String(50 + Math.round(a.manipulation / 3))} />
                    <Tile label="Amplifiers" value={String(8 + a.sources.length * 3)} />
                    <Tile label="First seen" value="9d ago" />
                  </div>
                </div>
                <div className="rounded-md border bg-surface p-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Velocity trace · 9d</div>
                  <Sparkline data={[12, 18, 24, 28, 41, 62, 78, 92, 87]} />
                </div>
              </div>
            </Section>

            <Section id="s-12" n="12" title="Recommended Actions">
              <ol className="space-y-2">
                {a.verificationActions.map((act, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-md border bg-surface p-3">
                    <span className="text-mono mt-0.5 grid h-5 w-5 place-items-center rounded bg-primary/15 text-[11px] font-semibold text-primary">{i + 1}</span>
                    <span className="text-[13px]">{act}</span>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="s-13" n="13" title="Final Assessment">
              <div className={`rounded-md border-l-4 bg-surface p-4 ${a.riskLevel === "critical" ? "border-severity-critical" : a.riskLevel === "high" ? "border-severity-high" : a.riskLevel === "medium" ? "border-severity-medium" : "border-severity-low"}`}>
                <div className="flex items-center gap-2">
                  {a.credibility >= 70 ? <CheckCircle2 className="h-4 w-4 text-severity-low" /> : <AlertTriangle className="h-4 w-4 text-severity-high" />}
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em]">{a.credibility >= 70 ? "Suitable for citation" : "Treat with caution"}</span>
                </div>
                <p className="mt-2 text-[14px] leading-relaxed">{a.finalAssessment}</p>
              </div>
            </Section>

            <Section id="s-14" n="14" title="Audit Trail">
              <ul className="text-mono space-y-1 text-[11px] text-muted-foreground">
                <li>· Ingested {new Date(a.analyzedAt).toISOString()} · pipeline v4.2.1</li>
                <li>· Lead analyst: <span className="text-foreground">Alex Tan</span> · Reviewer: <span className="text-foreground">M. Okafor</span></li>
                <li>· Document hash: <span className="text-foreground">0x9c2a…{a.id.slice(-4)}f1c2</span></li>
                <li>· 4 cross-references resolved · 1 anonymous source flagged · 6 verification steps completed</li>
                <li>· Brief signed: <span className="text-foreground">{new Date(a.analyzedAt).toLocaleString()}</span></li>
              </ul>
            </Section>

            <div className="flex justify-end pt-2">
              <button className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90">
                <Download className="h-4 w-4" /> Export full briefing
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="overflow-hidden rounded-md border bg-card scroll-mt-6">
      <header className="hairline-b flex items-center justify-between bg-surface px-5 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-mono text-[11px] text-primary">{n}</span>
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em]">{title}</span>
        </div>
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
      <span className={`rounded-sm border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] ${map[status] ?? ""}`}>{status}</span>
      <span className="text-mono text-[11px] tabular-nums text-muted-foreground">{confidence}%</span>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border bg-card p-2">
      <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="text-mono mt-0.5 text-[14px] font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data); const min = Math.min(...data);
  const w = 320, h = 80;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / Math.max(max - min, 1)) * (h - 8) - 4]);
  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-20 w-full">
      <defs>
        <linearGradient id="sp" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-severity-high)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-severity-high)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sp)" />
      <path d={path} stroke="var(--color-severity-high)" strokeWidth="1.6" fill="none" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2" fill="var(--color-severity-high)" />)}
    </svg>
  );
}
