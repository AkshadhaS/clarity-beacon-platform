import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/veritas/TopBar";
import {
  trendData,
  manipulationDistribution,
  fallacyDistribution,
  credibilityBuckets,
  sourceReliability,
} from "@/lib/mockData";

export const Route = createFileRoute("/_app/intelligence")({
  head: () => ({ meta: [{ title: "Narrative Intelligence — VeritasIQ" }] }),
  component: Intelligence,
});

function Intelligence() {
  return (
    <>
      <TopBar title="Narrative Intelligence" breadcrumb={["Workspace", "Intelligence"]} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-6 p-6">
          <div className="grid gap-3 md:grid-cols-4">
            <Stat label="Analyses (6mo)" value="1,346" delta="+24%" />
            <Stat label="Median credibility" value="57" delta="−6" />
            <Stat label="Critical-risk rate" value="14.8%" delta="+2.1pp" />
            <Stat label="Most-flagged pattern" value="Emot. Framing" delta="184 cases" />
          </div>

          <Card title="Analysis throughput & median credibility · 6 months">
            <DualChart />
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Manipulation types · distribution">
              <Bars data={manipulationDistribution} />
            </Card>
            <Card title="Logical fallacies · distribution">
              <Bars data={fallacyDistribution} />
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <Card title="Credibility score distribution">
              <Histogram data={credibilityBuckets} />
            </Card>
            <Card title="Source reliability by tier">
              <div className="space-y-3">
                {sourceReliability.map((t) => (
                  <div key={t.tier} className="grid grid-cols-[160px_1fr_auto] items-center gap-3">
                    <span className="text-[13px]">{t.tier}</span>
                    <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${t.value}%` }} />
                    </div>
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

function Stat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-md border bg-card p-4">
      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-mono text-2xl font-semibold tabular-nums">{value}</span>
        <span className="text-mono text-[11px] text-muted-foreground">{delta}</span>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <header className="hairline-b bg-surface px-4 py-2.5">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{title}</span>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Bars({ data }: { data: { name: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <ul className="space-y-2">
      {data.map((d) => (
        <li key={d.name} className="flex items-center gap-3">
          <span className="w-40 truncate text-[13px]">{d.name}</span>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
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
            <div
              className="w-full rounded-t bg-primary/80 transition-all hover:bg-primary"
              style={{ height: `${(d.count / max) * 100}%` }}
              title={`${d.count} analyses`}
            />
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
      {[0, 1, 2, 3, 4].map((i) => (
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
            {pts.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r="3" className="fill-primary" />
            ))}
            <path d={credPath} className="stroke-severity-medium" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
            {credPts.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r="2.5" className="fill-severity-medium" />
            ))}
          </>
        );
      })()}
      {trendData.map((d, i) => (
        <text key={d.month} x={60 + i * 130} y={216} className="fill-muted-foreground text-mono text-[10px]" textAnchor="middle">
          {d.month}
        </text>
      ))}
    </svg>
  );
}
