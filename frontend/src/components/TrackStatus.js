const FLAG_STYLES = {
  GREEN: { color: "text-green-400", glow: "shadow-glow-green", label: "GREEN FLAG", bg: "bg-green-500/[0.06]" },
  YELLOW: { color: "text-yellow-400", glow: "shadow-glow-orange", label: "YELLOW FLAG", bg: "bg-yellow-500/[0.06]" },
  RED: { color: "text-red-500", glow: "shadow-glow", label: "RED FLAG", bg: "bg-red-500/[0.08]" },
  CHEQUERED: { color: "text-white", glow: "", label: "CHEQUERED FLAG", bg: "" },
  DOUBLE_YELLOW: { color: "text-yellow-400", glow: "shadow-glow-orange", label: "DOUBLE YELLOW", bg: "bg-yellow-500/[0.06]" },
  CLEAR: { color: "text-green-400", glow: "shadow-glow-green", label: "CLEAR", bg: "bg-green-500/[0.04]" },
};

export default function TrackStatus({ raceControl }) {
  const latestFlag = [...(raceControl || [])].reverse().find((m) => m.flag);
  const flagKey = latestFlag?.flag?.toUpperCase()?.replace(/ /g, "_") || "GREEN";
  const style = FLAG_STYLES[flagKey] || FLAG_STYLES.GREEN;

  return (
    <div className={`panel p-4 ${style.bg}`}>
      <div className="flex items-center gap-1.5 text-[9px] text-f1-dim font-bold tracking-[0.15em] uppercase mb-2">
        <span className="text-xs">⏱</span> TRACK STATUS
      </div>
      <div className={`text-2xl font-extrabold ${style.color} ${style.glow}`}>
        {style.label}
      </div>
    </div>
  );
}
