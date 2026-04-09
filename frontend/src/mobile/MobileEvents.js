export default function MobileEvents({ raceControl }) {
  if (!raceControl || raceControl.length === 0) return null;

  const events = [...raceControl].reverse().slice(0, 8);

  const getIcon = (category, flag) => {
    if (flag === "CHEQUERED") return "🏁";
    if (flag === "RED") return "🟥";
    if (flag === "YELLOW" || flag === "DOUBLE YELLOW") return "🟡";
    if (category === "SafetyCar") return "🚗";
    return "📋";
  };

  return (
    <div className="px-3">
      <h3 className="text-[11px] font-bold tracking-widest text-f1-dim mb-2 flex items-center gap-2">
        <span>📋</span> EVENTS
      </h3>
      <div className="panel divide-y divide-f1-border/30">
        {events.map((e, i) => (
          <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 active:bg-f1-elevated">
            <span className="text-sm mt-0.5">{getIcon(e.category, e.flag)}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-gray-200 leading-snug">{e.message}</div>
              {e.driver && <div className="text-[9px] text-f1-dim font-mono">#{e.driver}</div>}
            </div>
            <div className="text-[9px] text-f1-dim font-mono flex-shrink-0">
              {e.timestamp ? new Date(e.timestamp).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }) : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
