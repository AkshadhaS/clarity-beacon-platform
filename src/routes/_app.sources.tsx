import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/veritas/TopBar";
import { sourceReliability, sourceProfiles, type SourceProfile } from "@/lib/mockData";
import { CheckCircle2, AlertOctagon, Eye, Search, Filter } from "lucide-react";

export const Route = createFileRoute("/_app/sources")({
  head: () => ({ meta: [{ title: "Source Intelligence — VeritasIQ" }] }),
  component: Sources,
});

function Sources() {
  const [selected, setSelected] = useState<SourceProfile>(sourceProfiles[0]);
  const [trustFilter, setTrustFilter] = useState<"all" | "verified" | "watch" | "flagged">("all");
  const rows = sourceProfiles.filter(s => trustFilter === "all" || s.trust === trustFilter);

  return (
    <>
      <TopBar title="Source Intelligence" breadcrumb={["Workspace", "Sources"]} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-5 p-6">
          <div className="grid gap-3 md:grid-cols-5">
            <Stat label="Sources tracked" value="184,212" delta="+412 / 7d" />
            <Stat label="Avg. reliability" value="64.8" delta="−1.2 vs 30d" tone="text-severity-high" />
            <Stat label="Verified" value="48,914" delta="reliability ≥ 70" tone="text-severity-low" />
            <Stat label="Watch" value="22,108" delta="reliability 40–70" tone="text-severity-medium" />
            <Stat label="Flagged" value="3,612" delta="reliability < 40" tone="text-severity-critical" />
          </div>

          {/* Corpus + selected source */}
          <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <section className="overflow-hidden rounded-md border bg-card">
              <header className="hairline-b flex flex-wrap items-center justify-between gap-2 bg-surface px-4 py-2">
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Curated source corpus</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 rounded border bg-card px-2 py-1 text-[11px] text-muted-foreground">
                    <Search className="h-3 w-3" /><input placeholder="domain or name" className="w-32 bg-transparent outline-none" />
                  </div>
                  <Filter className="h-3 w-3 text-muted-foreground" />
                  {(["all","verified","watch","flagged"] as const).map(t => (
                    <button key={t} onClick={() => setTrustFilter(t)}
                      className={`rounded border px-2 py-0.5 text-[11px] capitalize ${trustFilter === t ? "border-primary/40 bg-primary/5" : "border-transparent text-muted-foreground hover:bg-accent"}`}>{t}</button>
                  ))}
                </div>
              </header>
              <table className="w-full text-[12px]">
                <thead className="hairline-b bg-surface text-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Source</th>
                    <th className="px-3 py-2 text-left font-medium">Type · Bias</th>
                    <th className="px-3 py-2 text-right font-medium">Cases</th>
                    <th className="px-3 py-2 text-right font-medium">Verify%</th>
                    <th className="px-3 py-2 text-right font-medium">Corr.</th>
                    <th className="px-3 py-2 text-left font-medium">Trend · 9d</th>
                    <th className="px-3 py-2 text-right font-medium">Reliability</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(s => {
                    const verifyPct = Math.round((s.verifications / s.cases) * 100);
                    const active = selected.domain === s.domain;
                    return (
                      <tr key={s.domain} onClick={() => setSelected(s)}
                        className={`cursor-pointer border-t hover:bg-surface/60 ${active ? "bg-primary/5" : ""}`}>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <TrustDot trust={s.trust} />
                            <div className="min-w-0">
                              <div className="truncate font-medium">{s.name}</div>
                              <div className="text-mono text-[10px] text-muted-foreground">{s.domain}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground"><div>{s.type}</div><div className="text-[10px]">{s.bias}</div></td>
                        <td className="px-3 py-2.5 text-right text-mono tabular-nums">{s.cases.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-right text-mono tabular-nums">{verifyPct}%</td>
                        <td className="px-3 py-2.5 text-right text-mono tabular-nums text-severity-high">{s.corrections}</td>
                        <td className="px-3 py-2.5"><MiniTrend data={s.trend} /></td>
                        <td className="px-3 py-2.5 text-right">
                          <div className="ml-auto flex items-center justify-end gap-2">
                            <div className="h-1 w-16 overflow-hidden rounded bg-muted"><div className="h-full bg-primary" style={{ width: `${s.reliability}%` }} /></div>
                            <span className="text-mono w-7 text-right tabular-nums">{s.reliability}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <footer className="hairline-t bg-surface px-4 py-1.5 text-mono text-[10px] text-muted-foreground">
                Showing {rows.length} of 184,212 · click a row for full dossier
              </footer>
            </section>

            <aside className="space-y-3">
              <SourceDossier s={selected} />
              <div className="overflow-hidden rounded-md border bg-card">
                <header className="hairline-b bg-surface px-4 py-2"><span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Reliability by tier</span></header>
                <div className="space-y-3 p-4">
                  {sourceReliability.map((t) => (
                    <div key={t.tier} className="grid grid-cols-[160px_1fr_auto] items-center gap-3">
                      <span className="text-[12px]">{t.tier}</span>
                      <div className="relative h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${t.value}%` }} /></div>
                      <span className="text-mono w-10 text-right text-[12px] tabular-nums">{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function Stat({ label, value, delta, tone }: { label: string; value: string; delta: string; tone?: string }) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className={`text-mono text-xl font-semibold tabular-nums ${tone ?? ""}`}>{value}</span>
      </div>
      <div className="text-mono text-[10px] text-muted-foreground">{delta}</div>
    </div>
  );
}

function TrustDot({ trust }: { trust: SourceProfile["trust"] }) {
  const tone = trust === "verified" ? "bg-severity-low" : trust === "watch" ? "bg-severity-medium" : trust === "flagged" ? "bg-severity-critical" : "bg-muted";
  return <span className={`h-2 w-2 shrink-0 rounded-full ${tone}`} />;
}

function MiniTrend({ data }: { data: number[] }) {
  const max = Math.max(...data); const min = Math.min(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * 60, 16 - ((v - min) / Math.max(max - min, 1)) * 12 - 2]);
  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const delta = data[data.length - 1] - data[0];
  const stroke = delta > 0 ? "var(--color-severity-low)" : delta < 0 ? "var(--color-severity-high)" : "var(--color-muted-foreground)";
  return (
    <div className="flex items-center gap-1.5">
      <svg viewBox="0 0 60 16" className="h-4 w-16"><path d={path} stroke={stroke} strokeWidth="1.4" fill="none" /></svg>
      <span className="text-mono text-[10px] tabular-nums text-muted-foreground">{delta > 0 ? "+" : ""}{delta}</span>
    </div>
  );
}

function SourceDossier({ s }: { s: SourceProfile }) {
  const max = Math.max(...s.trend); const min = Math.min(...s.trend);
  const pts = s.trend.map((v, i) => [(i / (s.trend.length - 1)) * 320, 80 - ((v - min) / Math.max(max - min, 1)) * 60 - 10]);
  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const trustLabel = s.trust.charAt(0).toUpperCase() + s.trust.slice(1);
  const TrustIcon = s.trust === "verified" ? CheckCircle2 : s.trust === "flagged" ? AlertOctagon : Eye;
  const trustTone = s.trust === "verified" ? "text-severity-low" : s.trust === "flagged" ? "text-severity-critical" : "text-severity-medium";
  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <header className="hairline-b flex items-center justify-between bg-surface px-4 py-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Source dossier</span>
        <span className={`inline-flex items-center gap-1 text-mono text-[10px] uppercase tracking-[0.14em] ${trustTone}`}>
          <TrustIcon className="h-3 w-3" />{trustLabel}
        </span>
      </header>
      <div className="p-4">
        <div className="text-[15px] font-semibold">{s.name}</div>
        <div className="text-mono text-[11px] text-muted-foreground">{s.domain}</div>
        <div className="mt-2 text-[12px] text-muted-foreground">{s.type} · {s.bias} · {s.coverage}</div>

        <div className="mt-3 rounded-md border bg-surface p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Reliability · 9d</span>
            <span className="text-mono text-[18px] font-semibold tabular-nums">{s.reliability}</span>
          </div>
          <svg viewBox="0 0 320 80" className="mt-1 h-16 w-full">
            <path d={`${path} L 320 80 L 0 80 Z`} fill="var(--color-primary)" fillOpacity="0.12" />
            <path d={path} stroke="var(--color-primary)" strokeWidth="1.6" fill="none" />
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2" fill="var(--color-primary)" />)}
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Cell label="Cases" value={s.cases.toLocaleString()} />
          <Cell label="Verified" value={`${Math.round((s.verifications / s.cases) * 100)}%`} />
          <Cell label="Corrections" value={String(s.corrections)} tone="text-severity-high" />
        </div>

        <div className="hairline-t mt-3 pt-3">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Verification history</div>
          <ul className="mt-2 space-y-1 text-[11px]">
            <li className="flex justify-between"><span>Last audit</span><span className="text-mono">{s.lastAudit}</span></li>
            <li className="flex justify-between"><span>Median time-to-verify</span><span className="text-mono">2h 14m</span></li>
            <li className="flex justify-between"><span>Outstanding retractions</span><span className="text-mono">{s.trust === "flagged" ? "3" : "0"}</span></li>
            <li className="flex justify-between"><span>Coverage scope</span><span>{s.coverage}</span></li>
          </ul>
        </div>

        <div className="hairline-t mt-3 pt-3">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Trust indicators</div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
            {[
              ["Editorial standards", s.reliability >= 70],
              ["Bylined reporting", s.type !== "Social"],
              ["Corrections policy", s.corrections < 50],
              ["Primary sourcing", s.type === "Primary" || s.type === "Wire" || s.type === "Journal"],
              ["Anonymous sourcing", s.trust === "flagged"],
            ].map(([t, on]) => (
              <span key={t as string} className={`text-mono rounded border px-1.5 py-0.5 uppercase tracking-[0.12em] ${on ? "border-severity-low/40 text-severity-low" : "border-border text-muted-foreground"}`}>
                {on ? "+" : "·"} {t as string}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Cell({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded border bg-surface p-2">
      <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className={`text-mono mt-0.5 text-[13px] font-semibold tabular-nums ${tone ?? ""}`}>{value}</div>
    </div>
  );
}
