import TyreIcon from "./TyreIcon";

export default function Leaderboard({ standings }) {
  if (!standings || standings.length === 0) {
    return (
      <div className="panel p-8 text-center text-f1-dim">No standings data available</div>
    );
  }

  const lapTimes = standings.map((d) => d.lastLap?.lapTime).filter(Boolean);
  const fastestLap = lapTimes.length > 0 ? Math.min(...lapTimes) : null;
  const avgLap = lapTimes.length > 0 ? lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length : null;

  return (
    <div className="panel">
      <div className="panel-header-red flex items-center justify-between rounded-t-xl">
        <h2 className="text-sm font-bold tracking-widest text-white">LEADERBOARD</h2>
        <div className="flex items-center gap-3 text-[8px] text-white/50 font-bold tracking-wider">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-glow-purple" /> FASTEST</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-glow-green" /> GAINING</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-glow-cyan" /> DRS</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-glow-orange" /> PIT DUE</span>
        </div>
      </div>

      <div className="grid grid-cols-[44px_44px_1fr_80px_80px_92px_38px_42px_34px] gap-0 px-4 py-2 text-[9px] font-extrabold text-f1-dim uppercase tracking-[0.15em] border-b border-f1-border/50 bg-f1-surface/30">
        <span>POS</span>
        <span>NO</span>
        <span>DRIVER</span>
        <span>GAP</span>
        <span>INT</span>
        <span>LAST</span>
        <span>TYRE</span>
        <span>STINT</span>
        <span>PIT</span>
      </div>

      <div>
        {standings.map((d, idx) => (
          <DriverRow key={d.number} driver={d} fastestLap={fastestLap} avgLap={avgLap} isFirst={idx === 0} isLast={idx === standings.length - 1} />
        ))}
      </div>
    </div>
  );
}

function DriverRow({ driver: d, fastestLap, avgLap, isFirst }) {
  const teamColor = d.teamColour ? `#${d.teamColour}` : "#555";
  const lapTime = d.lastLap?.lapTime;
  const stintAge = d.tyre?.tyreAge ?? d.tyre?.stintLaps ?? null;
  const compound = d.tyre?.compound?.toUpperCase();

  const isFastestLap = lapTime && fastestLap && Math.abs(lapTime - fastestLap) < 0.001;
  const isFastPace = lapTime && avgLap && lapTime < avgLap - 0.3;
  const isSlowPace = lapTime && avgLap && lapTime > avgLap + 0.8;

  const inPitWindow =
    (compound === "SOFT" && stintAge >= 18) ||
    (compound === "MEDIUM" && stintAge >= 28) ||
    (compound === "HARD" && stintAge >= 35);

  const freshTyres = stintAge !== null && stintAge <= 3 && (d.pitStops?.length ?? 0) > 0;

  const interval = parseGap(d.gap?.interval);
  const inDRS = interval !== null && interval > 0 && interval <= 1.0;

  // Row background layering
  let rowClasses = "border-b border-f1-border/30 hover:bg-f1-elevated/60";
  if (isFastestLap) rowClasses += " bg-purple-500/[0.06] border-l-2 border-l-purple-500";
  else if (inDRS) rowClasses += " bg-cyan-500/[0.04]";
  else if (freshTyres) rowClasses += " bg-green-500/[0.03]";
  else if (inPitWindow) rowClasses += " bg-yellow-500/[0.02]";

  // Position styling
  const posColor = d.position === 1 ? "text-yellow-400" : d.position <= 3 ? "text-white" : d.position <= 10 ? "text-gray-300" : "text-f1-dim";

  return (
    <div className={`grid grid-cols-[44px_44px_1fr_80px_80px_92px_38px_42px_34px] gap-0 px-4 py-2 items-center ${rowClasses}`}>
      {/* Position + momentum arrow */}
      <div className="flex items-center gap-0.5">
        <span className={`text-sm font-extrabold ${posColor}`}>{d.position ?? "—"}</span>
        {isFastPace && !isFastestLap && (
          <svg className="w-2.5 h-2.5 text-green-400 drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.56l-3.22 3.22a.75.75 0 01-1.06-1.06l4.5-4.5a.75.75 0 011.06 0l4.5 4.5a.75.75 0 11-1.06 1.06l-3.22-3.22v10.69A.75.75 0 0110 17z" clipRule="evenodd"/></svg>
        )}
        {isSlowPace && (
          <svg className="w-2.5 h-2.5 text-red-400 drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 011.06-1.06l3.22 3.22V3.75A.75.75 0 0110 3z" clipRule="evenodd"/></svg>
        )}
      </div>

      {/* Number */}
      <div className="text-sm font-extrabold" style={{ color: teamColor, textShadow: `0 0 8px ${teamColor}30` }}>
        {d.number}
      </div>

      {/* Driver */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-[3px] h-8 rounded-full flex-shrink-0" style={{ backgroundColor: teamColor, boxShadow: `0 0 6px ${teamColor}50` }} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-white truncate">{d.firstName} {d.lastName}</span>
              {isFastestLap && (
                <span className="text-[7px] font-extrabold bg-purple-500/25 text-purple-300 px-1.5 py-0.5 rounded ring-1 ring-purple-500/30 shadow-glow-purple flex-shrink-0">FL</span>
              )}
              {freshTyres && (
                <span className="text-[7px] font-extrabold bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded ring-1 ring-green-500/25 shadow-glow-green flex-shrink-0">NEW</span>
              )}
              {inDRS && (
                <span className="text-[7px] font-extrabold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded ring-1 ring-cyan-500/25 shadow-glow-cyan flex-shrink-0">DRS</span>
              )}
            </div>
            <div className="text-[10px] text-f1-dim truncate">{d.team}</div>
          </div>
        </div>
      </div>

      {/* Gap */}
      <div className="text-xs text-f1-muted font-mono">
        {d.position === 1 ? <span className="text-yellow-400/70 font-bold text-[10px]">LEADER</span> : formatGap(d.gap?.gapToLeader)}
      </div>

      {/* Interval */}
      <div className={`text-xs font-mono font-bold ${inDRS ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]" : "text-f1-muted"}`}>
        {d.position === 1 ? <span className="text-f1-dim">——</span> : formatGap(d.gap?.interval)}
      </div>

      {/* Last lap */}
      <div className={`text-xs font-mono font-bold ${
        isFastestLap ? "text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]"
        : isFastPace ? "text-green-400 drop-shadow-[0_0_4px_rgba(34,197,94,0.3)]"
        : isSlowPace ? "text-red-400/70"
        : "text-gray-400"
      }`}>
        {formatTime(lapTime)}
      </div>

      {/* Tyre */}
      <div className="flex justify-center"><TyreIcon compound={d.tyre?.compound} /></div>

      {/* Stint */}
      <div className={`text-xs font-mono text-center font-bold ${
        inPitWindow ? "text-yellow-400 animate-pulse drop-shadow-[0_0_6px_rgba(234,179,8,0.4)]"
        : stintAge > 20 ? "text-orange-400/80"
        : freshTyres ? "text-green-400"
        : "text-f1-dim"
      }`}>
        {stintAge ?? "—"}
      </div>

      {/* Pits */}
      <div className="text-xs text-center text-f1-dim font-mono">{d.pitStops?.length ?? 0}</div>
    </div>
  );
}

function formatTime(s) { if (!s) return "—"; return `${Math.floor(s/60)}:${(s%60).toFixed(3).padStart(6,"0")}`; }
function formatGap(g) { if (g==null) return "—"; if (typeof g==="string") return g; if (g===0) return "LEADER"; return `+${g}`; }
function parseGap(g) { if (g==null) return null; if (typeof g==="number") return g; const n=parseFloat(String(g).replace("+","")); return isNaN(n)?null:n; }
