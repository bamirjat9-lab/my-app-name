import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const YEARS = [2026, 2025, 2024, 2023];

export default function Header({
  session,
  weekendSessions,
  meetings,
  selectedYear,
  onYearChange,
  onSessionChange,
  isLive,
  lastUpdated,
}) {
  const [showGPPicker, setShowGPPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowGPPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const availableTypes = [...new Set((weekendSessions || []).map((s) => s.type))];

  const sessionTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString("en-US", { hour12: false })
    : "--:--:--";

  return (
    <header className="bg-f1-card/80 backdrop-blur-xl border-b border-f1-border sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-f1-dim hover:text-white p-1.5 rounded-lg hover:bg-f1-elevated"
            title="Back to Home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="w-px h-6 bg-f1-border" />
          <div>
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setShowGPPicker(!showGPPicker)}
                className="text-xl font-extrabold tracking-wide text-white hover:text-f1-red flex items-center gap-2"
              >
                {session?.country?.toUpperCase() || "LOADING"} GRAND PRIX
                <svg
                  className={`w-4 h-4 text-f1-dim transition-transform ${showGPPicker ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showGPPicker && (
                <div className="absolute top-full left-0 mt-2 w-[420px] panel shadow-2xl z-50">
                  <div className="flex border-b border-f1-border">
                    {YEARS.map((yr) => (
                      <button
                        key={yr}
                        onClick={() => onYearChange(yr)}
                        className={`flex-1 text-xs font-bold py-2.5 ${
                          selectedYear === yr
                            ? "bg-f1-red text-white"
                            : "text-f1-dim hover:text-white hover:bg-f1-elevated"
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>

                  <div className="border-b border-f1-border">
                    <button
                      onClick={() => {
                        onSessionChange("latest");
                        setShowGPPicker(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center gap-2 ${
                        isLive
                          ? "bg-green-500/10 text-green-400"
                          : "text-gray-400 hover:text-white hover:bg-f1-elevated"
                      }`}
                    >
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Latest / Live Session
                    </button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {meetings.length === 0 ? (
                      <div className="px-4 py-6 text-center text-f1-dim text-sm">
                        No races found for {selectedYear}
                      </div>
                    ) : (
                      meetings.map((m) => (
                        <GPRow
                          key={m.key}
                          meeting={m}
                          isActive={m.country === session?.country && m.year === session?.year}
                          onSelect={(sessionKey) => {
                            onSessionChange(sessionKey);
                            setShowGPPicker(false);
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              {availableTypes.map((type) => {
                const isActive = session?.type === type;
                const match = weekendSessions.find((s) => s.type === type);
                return (
                  <button
                    key={type}
                    onClick={() => match && onSessionChange(match.key)}
                    className={`text-[10px] font-bold px-3 py-1 rounded-md tracking-wider ${
                      isActive
                        ? "bg-f1-red text-white shadow-glow-sm"
                        : "bg-f1-elevated text-f1-dim hover:text-white hover:bg-f1-accent"
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                );
              })}
              <span className="text-xs text-f1-dim ml-2 font-medium">
                {session?.circuit || ""}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          {isLive && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-md">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              LIVE
            </span>
          )}
          <div className="text-[10px] text-f1-dim mt-1 font-mono">
            {sessionTime}
          </div>
        </div>
      </div>
    </header>
  );
}

function GPRow({ meeting, isActive, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const [sessions, setSessions] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const handleClick = () => {
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    if (!sessions) {
      setLoadingSessions(true);
      fetch(`${API}/api/sessions?year=${meeting.year}&country=${encodeURIComponent(meeting.country)}`)
        .then((r) => r.json())
        .then((data) => setSessions(data || []))
        .catch(() => setSessions([]))
        .finally(() => setLoadingSessions(false));
    }
  };

  return (
    <div className={`border-b border-f1-border last:border-0 ${isActive ? "bg-f1-elevated" : ""}`}>
      <button
        onClick={handleClick}
        className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-f1-elevated"
      >
        <div className="flex items-center gap-3">
          {isActive && <div className="w-1 h-6 bg-f1-red rounded-full shadow-glow-sm" />}
          <div>
            <div className="text-sm font-semibold text-white">{meeting.name}</div>
            <div className="text-[10px] text-f1-dim">{meeting.circuit} — {meeting.dateStart?.slice(0, 10)}</div>
          </div>
        </div>
        <svg className={`w-3.5 h-3.5 text-f1-dim ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="bg-f1-bg px-4 pb-2">
          {loadingSessions ? (
            <div className="text-xs text-f1-dim py-2">Loading sessions...</div>
          ) : sessions && sessions.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 py-1.5">
              {sessions.map((s) => (
                <button key={s.key} onClick={() => onSelect(s.key)} className="text-[11px] px-2.5 py-1 rounded-md border border-f1-border text-f1-dim hover:text-white hover:border-f1-borderLight hover:bg-f1-elevated">
                  {s.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-f1-dim py-2">No sessions found</div>
          )}
        </div>
      )}
    </div>
  );
}
