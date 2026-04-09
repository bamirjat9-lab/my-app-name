import TyreIcon from "../components/TyreIcon";

export default function MobileLeaderboard({ standings }) {
  if (!standings || standings.length === 0) {
    return <div className="panel p-6 text-center text-f1-dim text-sm">No data</div>;
  }

  const lapTimes = standings.map((d) => d.lastLap?.lapTime).filter(Boolean);
  const fastestLap = lapTimes.length > 0 ? Math.min(...lapTimes) : null;
  const avgLap = lapTimes.length > 0 ? lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length : null;

  return (
    <div className="panel">
      <div className="panel-header-red rounded-t-xl px-3 py-2.5">
        <h2 className="text-[11px] font-bold tracking-widest text-white">LEADERBOARD</h2>
      </div>
      <div>
        {standings.map((d) => (
          <MobileDriverRow key={d.number} driver={d} fastestLap={fastestLap} avgLap={avgLap} />
        ))}
      </div>
    </div>
  );
}

function MobileDriverRow({ driver: d, fastestLap, avgLap }) {
  const teamColor = d.teamColour ? `#${d.teamColour}` : "#555";
  const lapTime = d.lastLap?.lapTime;
  const stintAge = d.tyre?.tyreAge ?? d.tyre?.stintLaps ?? null;
  const compound = d.tyre?.compound?.toUpperCase();

  const isFastestLap = lapTime && fastestLap && Math.abs(lapTime - fastestLap) < 0.001;
  const isFastPace = lapTime && avgLap && lapTime < avgLap - 0.3;
  const isSlowPace = lapTime && avgLap && lapTime > avgLap + 0.8;
  const interval = parseGap(d.gap?.interval);
  const inDRS = interval !== null && interval > 0 && interval <= 1.0;
  const inPitWindow =
    (compound === "SOFT" && stintAge >= 18) ||
    (compound === "MEDIUM" && stintAge >= 28) ||
    (compound === "HARD" && stintAge >= 35);
  const freshTyres = stintAge !== null && stintAge <= 3 && (d.pitStops?.length ?? 0) > 0;

  let rowBg = "";
  if (isFastestLap) rowBg = "bg-purple-500/[0.06] border-l-2 border-l-purple-500";
  else if (inDRS) rowBg = "bg-cyan-500/[0.03]";

  const posColor = d.position === 1 ? "text-yellow-400" : d.position <= 3 ? "text-white" : d.position <= 10 ? "text-gray-300" : "text-f1-dim";

  return (
    <div className={`flex items-center gap-2 px-3 py-2.5 border-b border-f1-border/30 active:bg-f1-elevated ${rowBg}`}>
      {/* Position */}
      <div className="w-7 flex-shrink-0 flex items-center gap-0.5">
        <span className={`text-[14px] font-extrabold ${posColor}`}>{d.position ?? "—"}</span>
        {isFastPace && !isFastestLap && <span className="w-1 h-1 rounded-full bg-green-400" />}
        {isSlowPace && <span className="w-1 h-1 rounded-full bg-red-400" />}
      </div>

      {/* Team color bar */}
      <div className="w-[3px] h-10 rounded-full flex-shrink-0" style={{ backgroundColor: teamColor, boxShadow: `0 0 6px ${teamColor}40` }} />

      {/* Driver info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-[13px] font-bold text-white truncate">{d.code}</span>
          {isFastestLap && <span className="text-[7px] font-extrabold bg-purple-500/25 text-purple-300 px-1 rounded">FL</span>}
          {freshTyres && <span className="text-[7px] font-extrabold bg-green-500/20 text-green-300 px-1 rounded">NEW</span>}
          {inDRS && <span className="text-[7px] font-extrabold bg-cyan-500/20 text-cyan-300 px-1 rounded">DRS</span>}
        </div>
        <div className="text-[9px] text-f1-dim truncate">{d.team}</div>
      </div>

      {/* Gap */}
      <div className={`text-[11px] font-mono font-bold text-right w-16 flex-shrink-0 ${inDRS ? "text-cyan-400" : "text-f1-muted"}`}>
        {d.position === 1 ? <span className="text-yellow-400/70 text-[9px]">LEADER</span> : formatGap(d.gap?.interval)}
      </div>

      {/* Lap time */}
      <div className={`text-[11px] font-mono font-bold text-right w-[72px] flex-shrink-0 ${
        isFastestLap ? "text-purple-400" : isFastPace ? "text-green-400" : isSlowPace ? "text-red-400/70" : "text-gray-400"
      }`}>
        {formatTime(lapTime)}
      </div>

      {/* Tyre + stint */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <TyreIcon compound={d.tyre?.compound} size={18} />
        <span className={`text-[10px] font-mono font-bold w-5 text-right ${
          inPitWindow ? "text-yellow-400 animate-pulse" : freshTyres ? "text-green-400" : "text-f1-dim"
        }`}>
          {stintAge ?? "—"}
        </span>
      </div>
    </div>
  );
}

function formatTime(s) { if (!s) return "—"; return `${Math.floor(s/60)}:${(s%60).toFixed(3).padStart(6,"0")}`; }
function formatGap(g) { if (g==null) return "—"; if (typeof g==="string") return g; if (g===0) return "LEADER"; return `+${g}`; }
function parseGap(g) { if (g==null) return null; if (typeof g==="number") return g; const n=parseFloat(String(g).replace("+","")); return isNaN(n)?null:n; }
