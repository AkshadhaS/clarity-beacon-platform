import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/veritas/TopBar";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — VeritasIQ" }] }),
  component: Settings,
});

function Settings() {
  return (
    <>
      <TopBar title="Settings" breadcrumb={["Workspace", "Settings"]} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6 p-6">
          <Section title="Workspace">
            <Field label="Organization" value="Atlas Desk" />
            <Field label="Plan" value="Investigations · 10 seats" />
            <Field label="Default language" value="English (en-US)" />
          </Section>

          <Section title="Analysis defaults">
            <Toggle label="Auto-extract claims" desc="Run the claim decomposer on every analysis" on />
            <Toggle label="Strict source reliability" desc="Lower scores for opinion and aggregator sources" on />
            <Toggle label="Highlight manipulation in viewer" desc="Inline marks for fear, urgency, polarization" on />
            <Toggle label="Auto-archive after 90 days" desc="Move stale analyses to cold storage" />
          </Section>

          <Section title="API & integrations">
            <Field label="API key" value="vq_live_••••••••8c4a" mono action="Rotate" />
            <Field label="Webhook URL" value="https://atlas.example/webhooks/veritasiq" />
            <Field label="SSO" value="Okta · enabled" />
          </Section>

          <Section title="Danger zone">
            <button className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-[12px] font-medium text-destructive hover:bg-destructive/10">
              Delete workspace
            </button>
          </Section>
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <header className="hairline-b bg-surface px-4 py-2.5">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{title}</span>
      </header>
      <div className="divide-y">{children}</div>
    </section>
  );
}

function Field({ label, value, mono, action }: { label: string; value: string; mono?: boolean; action?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="text-[13px] font-medium">{label}</div>
        <div className={`mt-0.5 text-[12px] text-muted-foreground ${mono ? "text-mono" : ""}`}>{value}</div>
      </div>
      {action && (
        <button className="rounded border bg-card px-2.5 py-1 text-[11px] hover:bg-accent">{action}</button>
      )}
    </div>
  );
}

function Toggle({ label, desc, on }: { label: string; desc: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="text-[13px] font-medium">{label}</div>
        <div className="mt-0.5 text-[12px] text-muted-foreground">{desc}</div>
      </div>
      <button
        className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-card shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}
