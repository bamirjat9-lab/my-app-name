import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import KeyInsights from "../components/KeyInsights";
import Leaderboard from "../components/Leaderboard";
import BattleDetection from "../components/BattleDetection";
import WeatherPanel from "../components/WeatherPanel";
import TrackStatus from "../components/TrackStatus";
import PitStops from "../components/PitStops";
import TyreSummary from "../components/TyreSummary";
import RaceEvents from "../components/RaceEvents";
import MobileDashboard from "../mobile/MobileDashboard";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
const REFRESH_INTERVAL = 15_000;
const MOBILE_BREAKPOINT = 1024;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function Dashboard() {
  const isMobile = useIsMobile();

  const [sessionKey, setSessionKey] = useState("latest");
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [meetings, setMeetings] = useState([]);
  const [weekendSessions, setWeekendSessions] = useState([]);

  const intervalRef = useRef(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/session?key=${sessionKey}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setSessionData(json);
      setError(null);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sessionKey]);

  useEffect(() => {
    setLoading(true);
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchSession, REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchSession]);

  useEffect(() => {
    fetch(`${API}/api/meetings?year=${selectedYear}`)
      .then((r) => r.json())
      .then((data) => {
        setMeetings(
          (data || []).filter((m) => !m.name?.toLowerCase().includes("testing"))
        );
      })
      .catch(() => setMeetings([]));
  }, [selectedYear]);

  useEffect(() => {
    if (!sessionData?.session?.country || !sessionData?.session?.year) return;
    fetch(
      `${API}/api/sessions?year=${sessionData.session.year}&country=${encodeURIComponent(sessionData.session.country)}`
    )
      .then((r) => r.json())
      .then((data) => setWeekendSessions(data || []))
      .catch(() => setWeekendSessions([]));
  }, [sessionData?.session?.country, sessionData?.session?.year]);

  // Loading
  if (loading && !sessionData) {
    return (
      <div className="min-h-screen bg-f1-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">🏎</div>
          <div className="text-gray-400 text-sm">Loading session data...</div>
        </div>
      </div>
    );
  }

  // Error (no data at all)
  if (error && !sessionData) {
    return (
      <div className="min-h-screen bg-f1-bg flex items-center justify-center px-4">
        <div className="text-center bg-f1-card border border-f1-border rounded-xl p-8 max-w-sm w-full">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-red-400 font-semibold mb-2">Failed to load</div>
          <div className="text-f1-dim text-sm mb-4">{error}</div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchSession}
              className="bg-f1-red text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Retry
            </button>
            <Link
              to="/"
              className="border border-f1-border text-f1-dim px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const d = sessionData;

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <MobileDashboard
        sessionData={d}
        weekendSessions={weekendSessions}
        sessionKey={sessionKey}
        onSessionChange={(key) => setSessionKey(String(key))}
        isLive={sessionKey === "latest"}
        lastUpdated={lastUpdated}
        onRefresh={fetchSession}
        error={error}
      />
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <div className="min-h-screen bg-f1-bg relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-f1-red/[0.02] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.015] rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10">
        <Header
          session={d?.session}
          weekendSessions={weekendSessions}
          meetings={meetings}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          onSessionChange={(key) => setSessionKey(String(key))}
          isLive={sessionKey === "latest"}
          lastUpdated={lastUpdated}
        />

        <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center justify-between">
          <div className="text-xs text-f1-dim">
            {error && <span className="text-yellow-500/80">⚠ Refresh failed — showing cached data</span>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-f1-dim">Auto-refresh {REFRESH_INTERVAL / 1000}s</span>
            <button
              onClick={fetchSession}
              className="text-[10px] text-f1-dim hover:text-white border border-f1-border rounded-md px-2.5 py-0.5 hover:bg-f1-elevated hover:border-f1-borderLight"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 pb-6">
          <div className="grid grid-cols-[1fr_380px] gap-4">
            <div className="space-y-4">
              <Leaderboard standings={d?.standings} />
            </div>
            <div className="space-y-4">
              <KeyInsights standings={d?.standings} weather={d?.weather} raceControl={d?.raceControl} />
              <TrackStatus raceControl={d?.raceControl} />
              <BattleDetection standings={d?.standings} />
              <PitStops standings={d?.standings} />
              <TyreSummary standings={d?.standings} />
              <WeatherPanel weather={d?.weather} />
            </div>
          </div>
          <div className="mt-4">
            <RaceEvents raceControl={d?.raceControl} />
          </div>
        </div>
      </div>
    </div>
  );
}
