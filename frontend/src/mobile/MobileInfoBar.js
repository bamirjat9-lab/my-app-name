import TyreIcon from "../components/TyreIcon";

export default function MobileInfoBar({ weather, raceControl, standings }) {
  const latestFlag = [...(raceControl || [])].reverse().find((m) => m.flag);
  const flagKey = latestFlag?.flag?.toUpperCase()?.replace(/ /g, "_") || "GREEN";

  const flagColors = {
    GREEN: "text-green-400", YELLOW: "text-yellow-400", RED: "text-red-500",
    CHEQUERED: "text-white", DOUBLE_YELLOW: "text-yellow-400", CLEAR: "text-green-400",
  };
  const flagLabels = {
    GREEN: "GREEN", YELLOW: "YELLOW", RED: "RED FLAG",
    CHEQUERED: "FINISHED", DOUBLE_YELLOW: "DBL YELLOW", CLEAR: "CLEAR",
  };

  // Tyre counts
  const tyreCounts = {};
  for (const d of standings || []) {
    const c = d.tyre?.compound?.toUpperCase() || "?";
    tyreCounts[c] = (tyreCounts[c] || 0) + 1;
  }

  return (
    <div className="px-3">
      {/* Horizontal scroll info chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-3 px-3 pb-1">
        {/* Track status */}
        <div className="flex-shrink-0 panel px-3 py-2 flex items-center gap-2">
          <span className="text-[9px] text-f1-dim font-bold">FLAG</span>
          <span className={`text-[12px] font-extrabold ${flagColors[flagKey] || "text-green-400"}`}>
            {flagLabels[flagKey] || "GREEN"}
          </span>
        </div>

        {/* Weather chips */}
        {weather && (
          <>
            <div className="flex-shrink-0 panel px-3 py-2">
              <div className="text-[8px] text-f1-dim font-bold">AIR</div>
              <div className="text-[13px] font-extrabold text-white">{weather.airTemp}°</div>
            </div>
            <div className={`flex-shrink-0 panel px-3 py-2 ${weather.trackTemp >= 40 ? "ring-1 ring-orange-500/20" : ""}`}>
              <div className="text-[8px] text-f1-dim font-bold">TRACK</div>
              <div className={`text-[13px] font-extrabold ${weather.trackTemp >= 40 ? "text-orange-300" : "text-white"}`}>{weather.trackTemp}°</div>
            </div>
            <div className="flex-shrink-0 panel px-3 py-2">
              <div className="text-[8px] text-f1-dim font-bold">WIND</div>
              <div className="text-[13px] font-extrabold text-white">{weather.windSpeed} km/h</div>
            </div>
          </>
        )}

        {/* Tyre summary chips */}
        {Object.entries(tyreCounts).map(([compound, count]) => (
          <div key={compound} className="flex-shrink-0 panel px-3 py-2 flex items-center gap-1.5">
            <TyreIcon compound={compound} size={16} />
            <span className="text-[12px] font-bold text-white">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
