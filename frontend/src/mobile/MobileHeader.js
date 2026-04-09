import { useState } from "react";
import { Link } from "react-router-dom";

export default function MobileHeader({
  session,
  weekendSessions,
  onSessionChange,
  isLive,
  lastUpdated,
}) {
  const [showSessions, setShowSessions] = useState(false);
  const availableTypes = [...new Set((weekendSessions || []).map((s) => s.type))];

  return (
    <header className="bg-f1-card/90 backdrop-blur-xl border-b border-f1-border sticky top-0 z-50 safe-top">
      {/* Top row */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link to="/" className="text-f1-dim p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="min-w-0">
            <button
              onClick={() => setShowSessions(!showSessions)}
              className="text-[15px] font-extrabold text-white tracking-wide truncate flex items-center gap-1.5"
            >
              {session?.country?.toUpperCase() || "LOADING"} GP
              <svg className={`w-3 h-3 text-f1-dim flex-shrink-0 ${showSessions ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="text-[10px] text-f1-dim font-medium">{session?.circuit || ""}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isLive && (
            <span className="flex items-center gap-1 text-[9px] font-extrabold text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              LIVE
            </span>
          )}
          <span className="text-[9px] text-f1-dim font-mono">
            {lastUpdated ? new Date(lastUpdated).toLocaleTimeString("en-US", { hour12: false }) : "--:--"}
          </span>
        </div>
      </div>

      {/* Session type pills */}
      <div className="flex gap-1.5 px-3 pb-2 overflow-x-auto no-scrollbar">
        {availableTypes.map((type) => {
          const isActive = session?.type === type;
          const match = weekendSessions.find((s) => s.type === type);
          return (
            <button
              key={type}
              onClick={() => match && onSessionChange(match.key)}
              className={`text-[10px] font-bold px-3 py-1 rounded-md whitespace-nowrap ${
                isActive
                  ? "bg-f1-red text-white shadow-glow-sm"
                  : "bg-f1-elevated text-f1-dim active:bg-f1-accent"
              }`}
            >
              {type.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Expandable session list */}
      {showSessions && (
        <div className="border-t border-f1-border bg-f1-surface max-h-[50vh] overflow-y-auto">
          <button
            onClick={() => { onSessionChange("latest"); setShowSessions(false); }}
            className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-2 text-green-400 border-b border-f1-border/50"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Latest / Live Session
          </button>
          {(weekendSessions || []).map((s) => (
            <button
              key={s.key}
              onClick={() => { onSessionChange(s.key); setShowSessions(false); }}
              className={`w-full text-left px-4 py-3 text-sm border-b border-f1-border/30 ${
                s.key === session?.key ? "bg-f1-elevated text-white" : "text-f1-dim active:bg-f1-elevated"
              }`}
            >
              {s.name} <span className="text-f1-dim text-xs ml-1">{s.date?.slice(0, 10)}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
