import { useState } from "react";
import MobileHeader from "./MobileHeader";
import MobileInsights from "./MobileInsights";
import MobileBattles from "./MobileBattles";
import MobileInfoBar from "./MobileInfoBar";
import MobileLeaderboard from "./MobileLeaderboard";
import MobileEvents from "./MobileEvents";

const TABS = [
  { id: "live", label: "LIVE" },
  { id: "events", label: "EVENTS" },
];

export default function MobileDashboard({
  sessionData,
  weekendSessions,
  meetings,
  selectedYear,
  onYearChange,
  sessionKey,
  onSessionChange,
  isLive,
  lastUpdated,
  onRefresh,
  error,
}) {
  const [activeTab, setActiveTab] = useState("live");
  const d = sessionData;

  return (
    <div className="min-h-screen bg-f1-bg pb-20">
      <MobileHeader
        session={d?.session}
        weekendSessions={weekendSessions}
        meetings={meetings}
        selectedYear={selectedYear}
        onYearChange={onYearChange}
        onSessionChange={onSessionChange}
        isLive={isLive}
        lastUpdated={lastUpdated}
      />

      {/* Tab bar */}
      <div className="sticky top-[88px] z-40 bg-f1-bg/90 backdrop-blur-md border-b border-f1-border/50">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-[10px] font-bold tracking-widest text-center ${
                activeTab === tab.id
                  ? "text-white border-b-2 border-f1-red"
                  : "text-f1-dim"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mx-3 mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 text-[10px] text-yellow-400 font-medium">
          ⚠ Refresh failed — showing cached data
        </div>
      )}

      {activeTab === "live" && (
        <div className="space-y-3 pt-3">
          <MobileInsights standings={d?.standings} weather={d?.weather} raceControl={d?.raceControl} />
          <MobileInfoBar weather={d?.weather} raceControl={d?.raceControl} standings={d?.standings} />
          <MobileBattles standings={d?.standings} />
          <div className="px-3">
            <MobileLeaderboard standings={d?.standings} />
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="space-y-3 pt-3">
          <MobileEvents raceControl={d?.raceControl} />
        </div>
      )}

      <button
        onClick={onRefresh}
        className="fixed bottom-6 right-4 z-50 bg-f1-card border border-f1-border rounded-full w-12 h-12 flex items-center justify-center shadow-panel active:scale-95"
      >
        <svg className="w-5 h-5 text-f1-dim" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
}
