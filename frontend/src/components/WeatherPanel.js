export default function WeatherPanel({ weather }) {
  if (!weather) return null;

  const cards = [
    { label: "AIR TEMP", value: `${weather.airTemp ?? "—"}°C`, icon: "🌡" },
    { label: "TRACK TEMP", value: `${weather.trackTemp ?? "—"}°C`, icon: "🌡", hot: weather.trackTemp >= 40 },
    { label: "WIND", value: `${weather.windSpeed ?? "—"} km/h`, icon: "💨" },
    { label: "HUMIDITY", value: `${weather.humidity ?? "—"}%`, icon: "💧", wet: weather.humidity >= 80 },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`panel p-3 ${c.hot ? "ring-1 ring-orange-500/20" : c.wet ? "ring-1 ring-blue-500/20" : ""}`}
        >
          <div className="flex items-center gap-1.5 text-[9px] text-f1-dim font-bold tracking-[0.12em] uppercase mb-1.5">
            <span className="text-xs">{c.icon}</span> {c.label}
          </div>
          <div className={`text-lg font-extrabold ${c.hot ? "text-orange-300" : c.wet ? "text-blue-300" : "text-white"}`}>
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
}
