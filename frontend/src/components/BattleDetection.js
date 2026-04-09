import TyreIcon from "./TyreIcon";

export default function BattleDetection({ standings }) {
  const battles = detectBattles(standings);
  if (battles.length === 0) return null;

  return (
    <div className="panel relative">
      <div className="absolute -inset-1 bg-gradient-to-b from-orange-500/4 to-transparent rounded-xl blur-xl pointer-events-none" />
      <div className="relative">
        <div className="px-4 py-3 rounded-t-xl flex items-center gap-2" style={{ background: "linear-gradient(135deg, #c2410c 0%, #9a3412 100%)" }}>
          <span className="text-sm">⚔️</span>
          <h3 className="text-xs font-bold tracking-widest text-white">BATTLES ON TRACK</h3>
          <span className="ml-auto text-[9px] bg-white/15 text-white/80 px-1.5 py-0.5 rounded font-bold">
            {battles.length}
          </span>
        </div>
        <div className="divide-y divide-f1-border/50">
          {battles.map((b, i) => (
            <BattleRow key={i} battle={b} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BattleRow({ battle }) {
  const { ahead, behind, gap, hasDRS } = battle;
  const aheadColor = ahead.teamColour ? `#${ahead.teamColour}` : "#666";
  const behindColor = behind.teamColour ? `#${behind.teamColour}` : "#666";

  return (
    <div className={`px-4 py-3 hover:bg-f1-elevated/50 ${hasDRS ? "bg-cyan-500/[0.03]" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
            gap < 0.5
              ? "bg-red-500/20 text-red-300 ring-1 ring-red-500/30 animate-pulse"
              : gap < 1
              ? "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/20"
              : "bg-yellow-500/10 text-yellow-300/80 ring-1 ring-yellow-500/15"
          }`}>
            {gap.toFixed(1)}s
          </span>
          {hasDRS && (
            <span className="text-[9px] font-extrabold bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded-md ring-1 ring-cyan-500/20 shadow-glow-cyan">
              DRS
            </span>
          )}
        </div>
        <span className="text-[9px] text-f1-dim font-mono">P{ahead.position} vs P{behind.position}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: aheadColor, boxShadow: `0 0 8px ${aheadColor}40` }} />
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-white truncate">{ahead.code}</div>
            <div className="text-[9px] text-f1-dim truncate">{ahead.team}</div>
          </div>
          <TyreIcon compound={ahead.tyre?.compound} size={16} />
        </div>
        <div className="text-[9px] text-f1-dim font-bold px-1.5 py-0.5 bg-f1-elevated rounded">vs</div>
        <div className="flex-1 flex items-center gap-2 min-w-0 justify-end">
          <TyreIcon compound={behind.tyre?.compound} size={16} />
          <div className="min-w-0 text-right">
            <div className="text-[11px] font-bold text-white truncate">{behind.code}</div>
            <div className="text-[9px] text-f1-dim truncate">{behind.team}</div>
          </div>
          <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: behindColor, boxShadow: `0 0 8px ${behindColor}40` }} />
        </div>
      </div>
    </div>
  );
}

function detectBattles(standings) {
  if (!standings || standings.length < 2) return [];
  const battles = [];
  for (let i = 0; i < standings.length - 1; i++) {
    const ahead = standings[i], behind = standings[i + 1];
    const interval = parseGap(behind.gap?.interval);
    if (interval !== null && interval > 0 && interval <= 2.0) {
      battles.push({ ahead, behind, gap: interval, hasDRS: interval <= 1.0 });
    }
  }
  battles.sort((a, b) => a.gap - b.gap);
  return battles.slice(0, 5);
}

function parseGap(g) { if (g==null) return null; if (typeof g==="number") return g; const n=parseFloat(String(g).replace("+","")); return isNaN(n)?null:n; }
