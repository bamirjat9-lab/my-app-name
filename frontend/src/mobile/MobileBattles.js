import TyreIcon from "../components/TyreIcon";

export default function MobileBattles({ standings }) {
  const battles = detectBattles(standings);
  if (battles.length === 0) return null;

  return (
    <div className="px-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">⚔️</span>
        <h3 className="text-[11px] font-bold tracking-widest text-f1-dim">BATTLES</h3>
        <span className="text-[9px] bg-orange-500/15 text-orange-300 px-1.5 py-0.5 rounded font-bold">{battles.length}</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-3 px-3 pb-1">
        {battles.map((b, i) => (
          <BattleCard key={i} battle={b} />
        ))}
      </div>
    </div>
  );
}

function BattleCard({ battle }) {
  const { ahead, behind, gap, hasDRS } = battle;

  return (
    <div className={`flex-shrink-0 w-[200px] panel p-3 ${hasDRS ? "ring-1 ring-cyan-500/20" : ""}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
          gap < 0.5 ? "bg-red-500/20 text-red-300 animate-pulse"
          : gap < 1 ? "bg-orange-500/15 text-orange-300"
          : "bg-yellow-500/10 text-yellow-300/80"
        }`}>
          {gap.toFixed(1)}s
        </span>
        {hasDRS && (
          <span className="text-[8px] font-extrabold bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded">DRS</span>
        )}
        <span className="text-[8px] text-f1-dim ml-auto">P{ahead.position}–P{behind.position}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-[2px] h-5 rounded-full" style={{ backgroundColor: ahead.teamColour ? `#${ahead.teamColour}` : "#555" }} />
          <span className="text-[12px] font-bold text-white">{ahead.code}</span>
          <TyreIcon compound={ahead.tyre?.compound} size={14} />
        </div>
        <span className="text-[8px] text-f1-dim font-bold">vs</span>
        <div className="flex items-center gap-1.5">
          <TyreIcon compound={behind.tyre?.compound} size={14} />
          <span className="text-[12px] font-bold text-white">{behind.code}</span>
          <div className="w-[2px] h-5 rounded-full" style={{ backgroundColor: behind.teamColour ? `#${behind.teamColour}` : "#555" }} />
        </div>
      </div>
    </div>
  );
}

function detectBattles(standings) {
  if (!standings || standings.length < 2) return [];
  const battles = [];
  for (let i = 0; i < standings.length - 1; i++) {
    const iv = parseGap(standings[i + 1].gap?.interval);
    if (iv !== null && iv > 0 && iv <= 2.0) {
      battles.push({ ahead: standings[i], behind: standings[i + 1], gap: iv, hasDRS: iv <= 1.0 });
    }
  }
  battles.sort((a, b) => a.gap - b.gap);
  return battles.slice(0, 5);
}

function parseGap(g) { if (g==null) return null; if (typeof g==="number") return g; const n=parseFloat(String(g).replace("+","")); return isNaN(n)?null:n; }
