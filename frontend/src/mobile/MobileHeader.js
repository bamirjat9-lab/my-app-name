import { useState } from "react";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === "production" ? "" : "http://localhost:4000");
const YEARS = [2026, 2025, 2024, 2023];

export default function MobileHeader({
  session,
  weekendSessions,
  meetings,
  meetingsLoading,
  selectedYear,
  onYearChange,
  onSessionChange,
  isLive,
  lastUpdated,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const availableTypes = [...new Set((weekendSessions || []).map((s) => s.type))];

  return (
    <>
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
                onClick={() => setShowPicker(true)}
                className="text-[15px] font-extrabold text-white tracking-wide truncate flex items-center gap-1.5"
              >
                {session?.country?.toUpperCase() || "LOADING"} GP
                <svg className="w-3 h-3 text-f1-dim flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                onClick={() => { match && onSessionChange(match.key); }}
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
      </header>

      {/* Full-screen GP picker — rendered OUTSIDE header to avoid clipping */}
      {showPicker && (
        <div className="fixed inset-0 z-[200] bg-f1-bg flex flex-col" style={{ touchAction: "pan-y" }}>
          {/* Picker header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-f1-border bg-f1-card">
            <h3 className="text-sm font-bold text-white">Select Race</h3>
            <button
              onClick={() => setShowPicker(false)}
              className="text-f1-dim p-1.5 rounded-lg active:bg-f1-elevated"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Year tabs */}
          <div className="flex border-b border-f1-border bg-f1-card">
            {YEARS.map((yr) => (
              <button
                key={yr}
                onClick={() => onYearChange(yr)}
                className={`flex-1 py-3 text-xs font-bold text-center ${
                  selectedYear === yr
                    ? "text-white bg-f1-red"
                    : "text-f1-dim active:bg-f1-elevated"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Live option */}
          <button
            onClick={() => { onSessionChange("latest"); setShowPicker(false); }}
            className={`w-full text-left px-4 py-3.5 text-sm font-semibold flex items-center gap-2.5 border-b border-f1-border ${
              isLive ? "bg-green-500/10 text-green-400" : "text-gray-400 active:bg-f1-elevated"
            }`}
          >
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
            Latest / Live Session
          </button>

          {/* GP list — scrollable */}
          <div className="flex-1 overflow-y-auto">
            {meetingsLoading ? (
              <div className="px-4 py-12 text-center text-f1-dim text-sm">
                <div className="text-2xl mb-2 animate-spin inline-block">🏎</div>
                <div>Loading {selectedYear} races...</div>
              </div>
            ) : (!meetings || meetings.length === 0) ? (
              <div className="px-4 py-12 text-center text-f1-dim text-sm">
                No races found for {selectedYear}
              </div>
            ) : (
              meetings.map((m) => (
                <MobileGPRow
                  key={m.key}
                  meeting={m}
                  isActive={m.country === session?.country && m.year === session?.year}
                  onSelect={(key) => { onSessionChange(key); setShowPicker(false); }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

function MobileGPRow({ meeting, isActive, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTap = () => {
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    if (!sessions) {
      setLoading(true);
      fetch(`${API}/api/sessions?year=${meeting.year}&country=${encodeURIComponent(meeting.country)}`)
        .then((r) => r.json())
        .then((data) => setSessions(data || []))
        .catch(() => setSessions([]))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className={`border-b border-f1-border/40 ${isActive ? "bg-f1-elevated" : ""}`}>
      <button
        onClick={handleTap}
        className="w-full text-left px-4 py-3.5 flex items-center justify-between active:bg-f1-elevated"
      >
        <div className="flex items-center gap-3">
          {isActive && <div className="w-1 h-7 bg-f1-red rounded-full" />}
          <div>
            <div className="text-[14px] font-semibold text-white">{meeting.name}</div>
            <div className="text-[11px] text-f1-dim">{meeting.circuit} — {meeting.dateStart?.slice(0, 10)}</div>
          </div>
        </div>
        <svg className={`w-4 h-4 text-f1-dim ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="bg-f1-surface px-4 pb-3">
          {loading ? (
            <div className="text-xs text-f1-dim py-3">Loading sessions...</div>
          ) : sessions && sessions.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {sessions.map((s) => (
                <button
                  key={s.key}
                  onClick={() => onSelect(s.key)}
                  className="text-[12px] font-medium px-3 py-2 rounded-lg border border-f1-border text-f1-dim active:text-white active:bg-f1-elevated active:border-f1-borderLight"
                >
                  {s.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-f1-dim py-3">No sessions found</div>
          )}
        </div>
      )}
    </div>
  );
}
