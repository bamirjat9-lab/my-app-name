export default function KeyInsights({ standings, weather, raceControl }) {
  const insights = generateInsights(standings, weather, raceControl);

  if (insights.length === 0) return null;

  return (
    <div className="panel relative">
      {/* Subtle red glow behind the panel */}
      <div className="absolute -inset-1 bg-gradient-to-b from-f1-red/5 to-transparent rounded-xl blur-xl pointer-events-none" />
      <div className="relative">
        <div className="panel-header-red flex items-center gap-2 rounded-t-xl">
          <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h3 className="text-xs font-bold tracking-widest text-white">KEY INSIGHTS</h3>
          <span className="ml-auto text-[9px] bg-white/15 text-white/80 px-1.5 py-0.5 rounded font-bold">{insights.length}</span>
        </div>
        <div className="divide-y divide-f1-border/50">
          {insights.map((insight, i) => (
            <div key={i} className="px-4 py-3 flex items-start gap-3 hover:bg-f1-elevated/50">
              <div className={`text-base mt-0.5 flex-shrink-0 ${insight.pulse ? "animate-pulse" : ""}`}>
                {insight.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-gray-200">{insight.title}</div>
                <div className="text-[10px] text-f1-muted mt-0.5 leading-relaxed">{insight.detail}</div>
              </div>
              {insight.tag && (
                <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-md flex-shrink-0 tracking-wider ${insight.tagColor || "bg-f1-accent text-f1-dim"}`}>
                  {insight.tag}
                </span>
              )}
            </div>
          ))}
        </div>
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
      icon: "⚡",
      title: `${fastest.code} has fastest last lap`,
      detail: `${formatLap(fastest.lastLap.lapTime)} — ${fastest.tyre?.compound || "unknown"} tyres, stint lap ${fastest.tyre?.stintLaps ?? "?"}`,
      tag: "PACE",
      tagColor: "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/20",
    });
  }

  const oldTyreDrivers = standings.filter((d) => {
    const age = d.tyre?.tyreAge ?? d.tyre?.stintLaps ?? 0;
    const compound = d.tyre?.compound?.toUpperCase();
    if (compound === "SOFT" && age >= 18) return true;
    if (compound === "MEDIUM" && age >= 28) return true;
    if (compound === "HARD" && age >= 35) return true;
    return false;
  });
  if (oldTyreDrivers.length > 0) {
    const names = oldTyreDrivers.slice(0, 3).map((d) => d.code).join(", ");
    insights.push({
      icon: "🔧",
      title: `Pit window open: ${names}`,
      detail: `${oldTyreDrivers.length} driver${oldTyreDrivers.length > 1 ? "s" : ""} on degraded tyres — expect stops soon`,
      tag: "PIT",
      tagColor: "bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-500/20",
      pulse: true,
    });
  }

  const freshTyreDrivers = standings.filter((d) => {
    const age = d.tyre?.tyreAge ?? d.tyre?.stintLaps ?? 99;
    return age <= 3 && d.pitStops?.length > 0;
  });
  if (freshTyreDrivers.length > 0) {
    const names = freshTyreDrivers.slice(0, 3).map((d) => d.code).join(", ");
    insights.push({
      icon: "🏎",
      title: `Fresh tyres: ${names}`,
      detail: "Recently pitted — watch for undercuts and position gains in the next few laps",
      tag: "UNDERCUT",
      tagColor: "bg-green-500/15 text-green-300 ring-1 ring-green-500/20",
    });
  }

  const drsTrainDrivers = [];
  for (let i = 1; i < standings.length; i++) {
    const interval = parseGap(standings[i].gap?.interval);
    if (interval !== null && interval <= 1.5 && interval > 0) {
      drsTrainDrivers.push(standings[i]);
    }
  }
  if (drsTrainDrivers.length >= 3) {
    insights.push({
      icon: "🚂",
      title: `DRS train: ${drsTrainDrivers.length} cars within 1.5s`,
      detail: "Bunched-up pack makes overtaking difficult — strategy divergence will be key",
      tag: "TRAFFIC",
      tagColor: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/20",
    });
  }

  if (weather) {
    if (weather.rainfall && weather.rainfall > 0) {
      insights.push({
        icon: "🌧",
        title: "Rain detected on track",
        detail: `Track temp ${weather.trackTemp}°C — intermediate or wet tyres may be needed`,
        tag: "WEATHER",
        tagColor: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20",
        pulse: true,
      });
    } else if (weather.trackTemp >= 45) {
      insights.push({
        icon: "🌡",
        title: "High track temperature",
        detail: `${weather.trackTemp}°C track surface — increased tyre degradation expected`,
        tag: "DEGRAD",
        tagColor: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/20",
      });
    }
  }

  if (raceControl && raceControl.length > 0) {
    const latest = raceControl[raceControl.length - 1];
    if (latest.flag === "YELLOW" || latest.flag === "DOUBLE YELLOW") {
      insights.push({ icon: "🟡", title: "Yellow flag active", detail: latest.message || "Caution — no overtaking", tag: "CAUTION", tagColor: "bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-500/20", pulse: true });
    }
    if (latest.flag === "RED") {
      insights.push({ icon: "🔴", title: "Red flag — session stopped", detail: latest.message || "All cars must return to pit lane", tag: "STOPPED", tagColor: "bg-red-500/20 text-red-300 ring-1 ring-red-500/30", pulse: true });
    }
  }

  return insights.slice(0, 5);
}

function formatLap(s) { if (!s) return "—"; return `${Math.floor(s/60)}:${(s%60).toFixed(3).padStart(6,"0")}`; }
function parseGap(g) { if (g==null) return null; if (typeof g==="number") return g; const n=parseFloat(String(g).replace("+","")); return isNaN(n)?null:n; }
