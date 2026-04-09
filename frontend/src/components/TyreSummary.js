import { TYRE_COLORS } from "./TyreIcon";

export default function TyreSummary({ standings }) {
  if (!standings || standings.length === 0) return null;

  const counts = {};
  for (const d of standings) {
    const compound = d.tyre?.compound?.toUpperCase() || "UNKNOWN";
    counts[compound] = (counts[compound] || 0) + 1;
  }

  const total = standings.length;
  const order = ["SOFT", "MEDIUM", "HARD", "INTERMEDIATE", "WET"];
  const sorted = Object.entries(counts).sort((a, b) => {
    const ai = order.indexOf(a[0]);
    const bi = order.indexOf(b[0]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div className="panel">
      <div className="panel-header-red flex items-center gap-2 rounded-t-xl">
        <span className="text-xs">🏁</span>
        <h3 className="text-xs font-bold tracking-widest text-white">TYRE SUMMARY</h3>
      </div>
      <div className="p-4 space-y-3">
        {sorted.map(([compound, count]) => {
          const color = TYRE_COLORS[compound] || "#666";
          const pct = (count / total) * 100;
          return (
            <div key={compound}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }} />
                  <span className="text-[11px] font-bold text-gray-300">{compound}</span>
                </div>
                <span className="text-[10px] text-f1-dim font-mono">{count} drivers</span>
              </div>
              <div className="h-1.5 bg-f1-elevated rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}30` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
