const TYRE_COLORS = {
  SOFT: "#EF4444",
  MEDIUM: "#EAB308",
  HARD: "#9CA3AF",
  INTERMEDIATE: "#22C55E",
  WET: "#3B82F6",
};

const TYRE_LABELS = {
  SOFT: "S",
  MEDIUM: "M",
  HARD: "H",
  INTERMEDIATE: "I",
  WET: "W",
};

export default function TyreIcon({ compound, size = 22 }) {
  const key = compound?.toUpperCase() || "UNKNOWN";
  const color = TYRE_COLORS[key] || "#555";
  const label = TYRE_LABELS[key] || "?";

  return (
    <div
      className="rounded-full flex items-center justify-center font-extrabold text-[8px] flex-shrink-0 ring-1"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        color: key === "HARD" ? "#1a1a2e" : "#000",
        boxShadow: `0 0 8px ${color}40`,
        ringColor: `${color}30`,
      }}
      title={compound || "Unknown"}
    >
      {label}
    </div>
  );
}

export { TYRE_COLORS };
