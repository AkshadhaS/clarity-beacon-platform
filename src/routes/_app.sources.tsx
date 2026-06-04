import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/veritas/TopBar";
import { sourceReliability } from "@/lib/mockData";

export const Route = createFileRoute("/_app/sources")({
  head: () => ({ meta: [{ title: "Sources — VeritasIQ" }] }),
  component: Sources,
});

const sources = [
  { name: "Reuters", domain: "reuters.com", reliability: 92, bias: "Center", type: "Wire", coverage: "Global" },
  { name: "Associated Press", domain: "apnews.com", reliability: 91, bias: "Center", type: "Wire", coverage: "Global" },
  { name: "BBC News", domain: "bbc.com", reliability: 86, bias: "Center-Left", type: "Major News", coverage: "Global" },
  { name: "Nature", domain: "nature.com", reliability: 95, bias: "Academic", type: "Journal", coverage: "Science" },
  { name: "The Capital Beacon", domain: "capital-beacon.example", reliability: 48, bias: "Right", type: "Opinion-led", coverage: "US Politics" },
  { name: "Riverside Daily", domain: "riverside-daily.example", reliability: 71, bias: "Center", type: "Local News", coverage: "US Midwest" },
  { name: "Helix Robotics IR", domain: "helix.example", reliability: 62, bias: "Issuer", type: "Corporate", coverage: "Industry" },
  { name: "X (anonymous accounts)", domain: "x.example", reliability: 14, bias: "Variable", type: "Social", coverage: "Global" },
  { name: "SEC EDGAR", domain: "sec.gov.example", reliability: 96, bias: "Regulatory", type: "Primary", coverage: "US Markets" },
  { name: "WHO Bulletins", domain: "who.int.example", reliability: 89, bias: "Institutional", type: "Primary", coverage: "Global Health" },
];

export default function _() { return null; }

function Sources() {
  return (
    <>
      <TopBar title="Sources" breadcrumb={["Workspace", "Sources"]} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-6 p-6">
          <div className="grid gap-3 md:grid-cols-3">
            <Stat label="Sources tracked" value="184,212" />
            <Stat label="Avg. reliability" value="64.8" />
            <Stat label="New this week" value="412" />
          </div>

          <div className="overflow-hidden rounded-md border bg-card">
            <header className="hairline-b flex items-center justify-between bg-surface px-4 py-2.5">
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Curated source corpus</span>
              <span className="text-mono text-[11px] text-muted-foreground">Showing 10 of 184,212</span>
            </header>
            <table className="w-full text-[13px]">
              <thead className="bg-surface text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Source</th>
                  <th className="px-4 py-2.5 text-left font-medium">Type</th>
                  <th className="px-4 py-2.5 text-left font-medium">Bias</th>
                  <th className="px-4 py-2.5 text-left font-medium">Coverage</th>
                  <th className="px-4 py-2.5 text-right font-medium">Reliability</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.name} className="border-t hover:bg-surface/60">
                    <td className="px-4 py-3">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-mono text-[11px] text-muted-foreground">{s.domain}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.bias}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.coverage}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="ml-auto flex items-center justify-end gap-2">
                        <div className="h-1 w-32 overflow-hidden rounded bg-muted">
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

          <div className="overflow-hidden rounded-md border bg-card">
            <header className="hairline-b bg-surface px-4 py-2.5">
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Reliability by tier</span>
            </header>
            <div className="space-y-3 p-4">
              {sourceReliability.map((t) => (
                <div key={t.tier} className="grid grid-cols-[200px_1fr_auto] items-center gap-3">
                  <span className="text-[13px]">{t.tier}</span>
                  <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${t.value}%` }} />
                  </div>
                  <span className="text-mono w-10 text-right text-[12px] tabular-nums">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card p-4">
      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-mono text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
