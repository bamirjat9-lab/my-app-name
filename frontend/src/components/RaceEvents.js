export default function RaceEvents({ raceControl }) {
  if (!raceControl || raceControl.length === 0) return null;

  const events = [...raceControl].reverse().slice(0, 15);

  const getIcon = (category, flag) => {
    if (flag === "CHEQUERED") return "🏁";
    if (flag === "RED") return "🟥";
    if (flag === "YELLOW" || flag === "DOUBLE YELLOW") return "🟡";
    if (category === "SafetyCar") return "🚗";
    if (category === "Drs") return "📡";
    if (category === "Flag") return "🚩";
    return "📋";
  };

  const getAccent = (flag) => {
    if (flag === "RED") return "border-l-red-500/50 bg-red-500/[0.03]";
    if (flag === "YELLOW" || flag === "DOUBLE YELLOW") return "border-l-yellow-500/50 bg-yellow-500/[0.02]";
    if (flag === "CHEQUERED") return "border-l-white/30";
    return "border-l-transparent";
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    try { return new Date(ts).toLocaleTimeString("en-US", { hour12: false }); } catch { return ""; }
  };

  return (
    <div className="panel">
      <div className="panel-header-red flex items-center gap-2 rounded-t-xl">
        <span className="text-xs">📋</span>
        <h2 className="text-xs font-bold tracking-widest text-white">RACE EVENTS FEED</h2>
        <span className="ml-auto text-[9px] bg-white/15 text-white/80 px-1.5 py-0.5 rounded font-bold">{events.length}</span>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {events.map((e, i) => (
          <div
            key={i}
            className={`px-4 py-3 flex items-start gap-3 hover:bg-f1-elevated/50 border-l-2 ${getAccent(e.flag)} ${i > 0 ? "border-t border-f1-border/30" : ""}`}
          >
            <div className="text-base mt-0.5">{getIcon(e.category, e.flag)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-gray-200">{e.message}</div>
              {e.driver && (
                <div className="text-[9px] text-f1-dim mt-0.5 font-mono">Driver #{e.driver}</div>
              )}
            </div>
            <div className="text-[10px] text-f1-dim flex-shrink-0 font-mono">
              {formatTime(e.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
