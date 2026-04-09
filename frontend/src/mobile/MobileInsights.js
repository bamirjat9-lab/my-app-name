export default function MobileInsights({ standings, weather, raceControl }) {
  const insights = generateInsights(standings, weather, raceControl);
  if (insights.length === 0) return null;

  return (
    <div className="px-3">
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3">
        {insights.map((ins, i) => (
          <div
            key={i}
            className={`flex-shrink-0 w-[260px] panel p-3 ${ins.pulse ? "ring-1 ring-f1-red/20" : ""}`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-base ${ins.pulse ? "animate-pulse" : ""}`}>{ins.icon}</span>
              <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wider ${ins.tagColor}`}>
                {ins.tag}
              </span>
            </div>
            <div className="text-[11px] font-bold text-gray-200 leading-snug">{ins.title}</div>
            <div className="text-[9px] text-f1-muted mt-1 leading-relaxed">{ins.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function generateInsights(standings, weather, raceControl) {
  if (!standings || standings.length === 0) return [];
  const insights = [];

  const withLaps = standings.filter((d) => d.lastLap?.lapTime);
  if (withLaps.length > 0) {
    const fastest = withLaps.reduce((a, b) => (a.lastLap.lapTime < b.lastLap.lapTime) ? a : b);
    insights.push({
      icon: "⚡", tag: "PACE", tagColor: "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/20",
      title: `${fastest.code} fastest — ${fmtLap(fastest.lastLap.lapTime)}`,
      detail: `${fastest.tyre?.compound || "?"} tyres, stint lap ${fastest.tyre?.stintLaps ?? "?"}`,
    });
  }

  const oldTyre = standings.filter((d) => {
    const age = d.tyre?.tyreAge ?? d.tyre?.stintLaps ?? 0;
    const c = d.tyre?.compound?.toUpperCase();
    return (c === "SOFT" && age >= 18) || (c === "MEDIUM" && age >= 28) || (c === "HARD" && age >= 35);
  });
  if (oldTyre.length > 0) {
    insights.push({
      icon: "🔧", tag: "PIT", tagColor: "bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-500/20",
      title: `Pit window: ${oldTyre.slice(0,3).map(d=>d.code).join(", ")}`,
      detail: `${oldTyre.length} drivers on worn tyres`, pulse: true,
    });
  }

  const fresh = standings.filter((d) => (d.tyre?.tyreAge ?? d.tyre?.stintLaps ?? 99) <= 3 && d.pitStops?.length > 0);
  if (fresh.length > 0) {
    insights.push({
      icon: "🏎", tag: "UNDERCUT", tagColor: "bg-green-500/15 text-green-300 ring-1 ring-green-500/20",
      title: `Fresh tyres: ${fresh.slice(0,3).map(d=>d.code).join(", ")}`,
      detail: "Watch for position gains",
    });
  }

  let drsCount = 0;
  for (let i = 1; i < standings.length; i++) {
    const iv = parseGap(standings[i].gap?.interval);
    if (iv !== null && iv <= 1.5 && iv > 0) drsCount++;
  }
  if (drsCount >= 3) {
    insights.push({
      icon: "🚂", tag: "TRAFFIC", tagColor: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/20",
      title: `DRS train — ${drsCount} cars within 1.5s`,
      detail: "Strategy divergence needed to break free",
    });
  }

  if (weather?.rainfall > 0) {
    insights.push({
      icon: "🌧", tag: "RAIN", tagColor: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20",
      title: "Rain on track", detail: `Track ${weather.trackTemp}°C`, pulse: true,
    });
  }

  return insights.slice(0, 5);
}

function fmtLap(s) { if (!s) return "—"; return `${Math.floor(s/60)}:${(s%60).toFixed(3).padStart(6,"0")}`; }
function parseGap(g) { if (g==null) return null; if (typeof g==="number") return g; const n=parseFloat(String(g).replace("+","")); return isNaN(n)?null:n; }
