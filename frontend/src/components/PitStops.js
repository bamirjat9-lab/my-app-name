import TyreIcon from "./TyreIcon";

export default function PitStops({ standings }) {
  const allPits = [];
  for (const d of standings || []) {
    for (const pit of d.pitStops || []) {
      allPits.push({
        driver: `${d.firstName} ${d.lastName}`,
        code: d.code,
        teamColour: d.teamColour,
        lap: pit.lap,
        duration: pit.duration,
        compound: d.tyre?.compound,
      });
    }
  }

  allPits.sort((a, b) => (b.lap ?? 0) - (a.lap ?? 0));
  const recentPits = allPits.slice(0, 5);
  if (recentPits.length === 0) return null;

  return (
    <div className="panel">
      <div className="panel-header-red flex items-center gap-2 rounded-t-xl">
        <span className="text-xs">🔧</span>
        <h3 className="text-xs font-bold tracking-widest text-white">RECENT PIT STOPS</h3>
      </div>
      <div className="divide-y divide-f1-border/50">
        {recentPits.map((p, i) => {
          const fast = p.duration && p.duration < 2.5;
          const slow = p.duration && p.duration > 4;
          return (
            <div key={i} className="px-4 py-2.5 flex items-center justify-between hover:bg-f1-elevated/50">
              <div className="flex items-center gap-2">
                <div className="w-[3px] h-6 rounded-full" style={{ backgroundColor: p.teamColour ? `#${p.teamColour}` : "#555" }} />
                <div>
                  <div className="text-[12px] font-bold text-white">{p.driver}</div>
                  <div className="text-[9px] text-f1-dim font-mono">Lap {p.lap ?? "—"}</div>
                </div>
              </div>
              <div className="text-right flex items-center gap-2.5">
                <div>
                  <div className={`text-sm font-extrabold font-mono ${fast ? "text-green-400" : slow ? "text-red-400" : "text-gray-300"}`}>
                    {p.duration ? `${p.duration.toFixed(1)}s` : "—"}
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <TyreIcon compound={p.compound} size={13} />
                    <span className="text-[9px] text-f1-dim">{p.compound || ""}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
