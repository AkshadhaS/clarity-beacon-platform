import { useRef, useState, useMemo } from "react";
import type { Analysis } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface Node {
  id: string;
  label: string;
  kind: "main" | "claim" | "evidence" | "contradiction";
  x: number;
  y: number;
}
interface Edge {
  from: string;
  to: string;
  kind: "supports" | "contradicts";
}

export function ClaimGraph({ analysis }: { analysis: Analysis }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const { nodes, edges } = useMemo(() => {
    const n: Node[] = [];
    const e: Edge[] = [];
    n.push({ id: "main", label: analysis.title, kind: "main", x: 500, y: 60 });

    const claims = analysis.claims;
    const spread = 900;
    claims.forEach((c, i) => {
      const x = (spread / Math.max(claims.length, 1)) * (i + 0.5) + (1000 - spread) / 2;
      const y = 220;
      n.push({ id: c.id, label: c.text, kind: "claim", x, y });
      e.push({ from: "main", to: c.id, kind: "supports" });

      c.supporting.forEach((s, j) => {
        const id = `${c.id}-s${j}`;
        n.push({
          id,
          label: s,
          kind: "evidence",
          x: x - 90 + j * 60,
          y: y + 160,
        });
        e.push({ from: c.id, to: id, kind: "supports" });
      });
      c.contradicting.forEach((s, j) => {
        const id = `${c.id}-c${j}`;
        n.push({
          id,
          label: s,
          kind: "contradiction",
          x: x + 40 + j * 60,
          y: y + 280,
        });
        e.push({ from: c.id, to: id, kind: "contradicts" });
      });
    });
    return { nodes: n, edges: e };
  }, [analysis]);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    setZoom((z) => Math.max(0.4, Math.min(2.5, z - e.deltaY * 0.001)));
  }

  function onMouseDown(e: React.MouseEvent) {
    setDrag({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }
  function onMouseMove(e: React.MouseEvent) {
    if (drag) setPan({ x: e.clientX - drag.x, y: e.clientY - drag.y });
  }
  function onMouseUp() {
    setDrag(null);
  }

  const kindCls: Record<Node["kind"], string> = {
    main: "fill-primary stroke-primary text-primary-foreground",
    claim: "fill-card stroke-foreground/40 text-foreground",
    evidence: "fill-severity-low/15 stroke-severity-low/50 text-foreground",
    contradiction: "fill-severity-critical/12 stroke-severity-critical/50 text-foreground",
  };

  return (
    <div className="relative overflow-hidden rounded-md border bg-surface">
      <div className="hairline-b flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Claim Graph
          </span>
          <span className="text-mono text-[11px] text-muted-foreground">
            {nodes.length} nodes · {edges.length} edges
          </span>
        </div>
        <div className="flex items-center gap-1">
          {[
            { l: "−", a: () => setZoom((z) => Math.max(0.4, z - 0.2)) },
            { l: "Reset", a: () => { setZoom(1); setPan({ x: 0, y: 0 }); } },
            { l: "+", a: () => setZoom((z) => Math.min(2.5, z + 0.2)) },
          ].map((b) => (
            <button
              key={b.l}
              onClick={b.a}
              className="h-7 rounded border bg-card px-2 text-mono text-[11px] text-muted-foreground hover:bg-accent"
            >
              {b.l}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={containerRef}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="grid-bg relative h-[520px] cursor-grab select-none active:cursor-grabbing"
      >
        <svg
          viewBox="0 0 1000 600"
          className="absolute inset-0 h-full w-full"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center" }}
        >
          {edges.map((e, i) => {
            const a = nodeMap[e.from];
            const b = nodeMap[e.to];
            if (!a || !b) return null;
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth={1.2}
                strokeDasharray={e.kind === "contradicts" ? "4 4" : undefined}
                className={cn(
                  e.kind === "supports" ? "stroke-foreground/25" : "stroke-severity-critical/50",
                )}
              />
            );
          })}
          {nodes.map((n) => {
            const w = n.kind === "main" ? 280 : n.kind === "claim" ? 200 : 140;
            const h = n.kind === "main" ? 52 : 44;
            return (
              <g
                key={n.id}
                transform={`translate(${n.x - w / 2}, ${n.y - h / 2})`}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
              >
                <rect
                  width={w}
                  height={h}
                  rx={6}
                  className={cn(kindCls[n.kind], hover === n.id && "stroke-primary")}
                  strokeWidth={1.4}
                />
                <foreignObject x={8} y={4} width={w - 16} height={h - 8}>
                  <div
                    className={cn(
                      "flex h-full items-center justify-center text-center text-[10px] leading-tight",
                      n.kind === "main" ? "font-semibold text-primary-foreground" : "text-foreground",
                    )}
                  >
                    {n.label.length > 80 ? n.label.slice(0, 78) + "…" : n.label}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
        <div className="pointer-events-none absolute bottom-3 left-3 flex gap-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-primary" /> Main</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm border border-foreground/40 bg-card" /> Claim</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-severity-low/40" /> Evidence</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-severity-critical/40" /> Contradiction</span>
        </div>
      </div>
    </div>
  );
}
