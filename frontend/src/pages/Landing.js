import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-f1-bg text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-f1-bg/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-f1-red rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-wide">F1 LIVE</div>
              <div className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Race Companion</div>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="bg-f1-red hover:bg-red-700 text-white text-sm font-bold px-6 py-2.5 rounded transition"
          >
            OPEN LIVE RACE
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle track curves */}
          <svg className="absolute top-1/4 -right-20 w-[700px] h-[700px] opacity-[0.04]" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="180" stroke="white" strokeWidth="1" fill="none" />
            <circle cx="200" cy="200" r="140" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="0.5" fill="none" />
          </svg>
          {/* Diagonal speed lines */}
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="absolute top-[15%] right-[10%] w-[300px] h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[-35deg]" />
            <div className="absolute top-[25%] right-[5%] w-[400px] h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[-35deg]" />
            <div className="absolute top-[35%] right-[15%] w-[250px] h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[-35deg]" />
          </div>
          {/* Red glow */}
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-f1-red/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-block border border-f1-red/40 text-f1-red text-xs font-bold tracking-widest px-4 py-1.5 rounded mb-8">
                YOUR SECOND SCREEN FOR RACE DAY
              </div>

              <h1 className="font-black tracking-tight leading-[0.9]">
                <span className="block text-[clamp(3rem,7vw,5.5rem)] text-white">WATCH THE</span>
                <span className="block text-[clamp(3rem,7vw,5.5rem)] text-white">RACE</span>
                <span className="block text-[clamp(3rem,7vw,6rem)] text-f1-red italic mt-2">SMARTER</span>
              </h1>

              <p className="text-gray-400 text-lg mt-8 max-w-md leading-relaxed">
                Understand every pit stop, battle, and strategy decision live.
                See who's on an undercut, which gaps are closing, and when
                the next pit window opens — all in real time.
              </p>

              <div className="flex items-center gap-4 mt-10">
                <Link
                  to="/dashboard"
                  className="bg-f1-red hover:bg-red-700 text-white font-bold text-sm tracking-wider px-8 py-4 rounded flex items-center gap-3 transition group"
                >
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  OPEN LIVE RACE
                </Link>
                <Link
                  to="/dashboard"
                  className="border border-white/20 hover:border-white/40 text-white font-bold text-sm tracking-wider px-8 py-4 rounded transition"
                >
                  BROWSE PAST RACES
                </Link>
              </div>
            </div>

            {/* Right: Monaco Circuit with racing cars */}
            <div className="hidden lg:flex items-center justify-center">
              <MonacoCircuit />
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 pt-10 border-t border-white/5">
            <div className="flex gap-20">
              <Stat value="20+" label="DRIVERS TRACKED" />
              <Stat value="15s" label="REFRESH RATE" />
              <Stat value="2023–26" label="FULL SEASONS" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32 bg-gradient-to-b from-f1-bg via-f1-card/50 to-f1-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              SEE WHAT THE <span className="text-f1-red italic">BROADCAST MISSES</span>
            </h2>
            <p className="text-gray-500 mt-4 text-lg">
              The intelligence layer that turns data into race-winning insight
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              color="#e10600"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              }
              title="Battle Detection"
              desc="See who's within DRS range, which fights are heating up, and undercut risks in real time"
            />
            <FeatureCard
              color="#EAB308"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              }
              title="Strategy Insights"
              desc="Know when the pit window opens, who's on degraded tyres, and which stops will decide the race"
            />
            <FeatureCard
              color="#3B82F6"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 9 7 12 7s5-3 7.5-3a2.5 2.5 0 0 1 0 5H18" />
                  <path d="M12 7v10" />
                  <path d="M8 17h8a2 2 0 1 1 0 4H8a2 2 0 1 1 0-4z" />
                </svg>
              }
              title="Live Leaderboard"
              desc="Gaps, intervals, tyre age, pit counts — everything updating live with momentum indicators"
            />
            <FeatureCard
              color="#22C55E"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              }
              title="Full History"
              desc="Browse every session from 2023 onwards — practice, qualifying, and race data for every GP"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            NEVER MISS A <span className="text-f1-red italic">STRATEGIC<br />MOVE AGAIN</span>
          </h2>
          <p className="text-gray-500 mt-6 text-lg max-w-xl mx-auto">
            Open the live dashboard on your phone, tablet, or second monitor
            and see the full picture behind every race
          </p>
          <div className="mt-10">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-3 bg-f1-red hover:bg-red-700 text-white font-bold text-sm tracking-wider px-10 py-4 rounded transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              OPEN LIVE RACE
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} F1 Live Analytics. Powered by OpenF1.
          </div>
          <div className="flex gap-6 text-xs text-gray-600">
            <span className="hover:text-white cursor-pointer transition">Privacy</span>
            <span className="hover:text-white cursor-pointer transition">Terms</span>
            <span className="hover:text-white cursor-pointer transition">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-3xl font-black text-f1-red italic">{value}</div>
      <div className="text-[11px] text-gray-500 tracking-widest mt-1">{label}</div>
    </div>
  );
}

function FeatureCard({ color, icon, title, desc }) {
  return (
    <div className="relative bg-f1-card border border-f1-border rounded-lg overflow-hidden group hover:border-gray-600 transition-colors">
      <div className="h-[3px] w-full" style={{ backgroundColor: color }} />
      <div className="p-6">
        <div style={{ color }}>{icon}</div>
        <h3 className="text-lg font-extrabold mt-4 italic">{title}</h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* Real Monaco GP circuit path — extracted from official SVG layout */
const MONACO_PATH =
  "M 104.50658,653.97079 C 104.50658,653.97079 84.965034,629.56873 79.834481,596.08515 C 79.834481,596.08515 74.973956,554.23062 75.243997,532.3584 C 75.243997,532.3584 77.404225,475.92227 85.50508,450.80965 C 85.50508,450.80965 93.335916,414.35577 109.26763,387.89296 L 130.86994,353.05921 C 130.86994,353.05921 134.82662,338.97228 148.55254,344.16813 C 148.55254,344.16813 164.35349,348.1987 189.46616,348.1987 L 339.60219,344.95836 C 339.60219,344.95836 350.40331,344.41832 369.57538,337.39752 C 369.57538,337.39752 382.80679,333.6172 398.73845,333.6172 L 464.89557,330.64679 C 464.89557,330.64679 470.02615,332.80707 485.68779,322.27592 L 501.88952,308.50449 C 501.88952,308.50449 510.80047,296.08313 508.91022,291.22263 C 508.91022,291.22263 509.45033,284.20187 507.29006,278.53133 L 486.7679,237.48687 C 486.7679,237.48687 482.17744,228.90319 483.44088,219.42358 C 483.44088,219.42358 483.46952,211.9309 486.48858,209.16245 L 578.03766,122.45467 C 578.03766,122.45467 589.37879,111.92347 595.31947,111.92347 C 595.31947,111.92347 605.04054,109.49323 604.23043,121.10449 C 604.23043,121.10449 603.96043,158.09841 606.9307,172.13996 L 610.98113,190.77187 C 610.98113,190.77187 612.06126,202.38316 621.24229,200.76303 C 621.24229,200.76303 629.07308,200.49299 629.34315,190.77187 L 628.533,162.68893 C 628.533,162.68893 625.56265,148.37737 642.57452,147.83732 L 670.11743,146.75721 C 670.11743,146.75721 681.72868,145.13703 679.2984,160.52866 L 671.4676,194.01228 C 671.4676,194.01228 651.48542,262.59958 609.3609,309.5846 C 609.3609,309.5846 552.9249,355.21942 502.4296,366.29061 C 502.4296,366.29061 485.68779,372.23126 445.4535,373.58144 L 349.85202,375.86671 C 349.85202,375.86671 345.85264,380.74992 346.08288,385.46271 L 345.12781,394.57255 C 345.12781,394.57255 336.70589,395.4736 333.41139,395.55892 L 310.68925,395.55892 L 300.98805,390.32318 C 300.98805,390.32318 291.8071,382.2223 281.81601,384.38256 L 221.59959,384.65261 L 180.2852,386.27274 C 180.2852,386.27274 161.65323,385.46271 154.63245,402.47446 C 154.63245,402.47446 143.70623,423.70454 134.42303,477.53919 L 140.46862,483.78999 C 140.46862,483.78999 143.75175,485.72297 144.35154,493.48856 L 145.51777,552.0814 C 145.51777,552.0814 145.45152,560.71138 133.03009,576.91313 C 133.03009,576.91313 124.37277,587.95117 130.04328,610.09356 C 130.04328,610.09356 138.7007,636.31942 162.46329,654.41137 C 162.46329,654.41137 180.01513,670.61309 191.6264,674.93354 C 191.6264,674.93354 205.93792,680.33415 204.04778,693.83555 C 204.04778,693.83555 204.04778,703.82663 190.27624,703.28655 L 116.34799,695.18571 C 116.34799,695.18571 102.80682,695.4359 106.85727,682.20447 C 106.85727,682.20447 115.06333,666.1136 104.50658,653.97079 Z";

const CARS = [
  { color: "#EF4444", glow: "rgba(239,68,68,0.9)", size: 8, dur: "8s",   begin: "0s",   label: "VER" },
  { color: "#EAB308", glow: "rgba(234,179,8,0.9)", size: 7, dur: "8.8s", begin: "-2s",   label: "NOR" },
  { color: "#3B82F6", glow: "rgba(59,130,246,0.9)", size: 7, dur: "9.2s", begin: "-4s",   label: "LEC" },
  { color: "#22C55E", glow: "rgba(34,197,94,0.8)", size: 6, dur: "9.8s", begin: "-5.5s", label: "HAM" },
  { color: "#F97316", glow: "rgba(249,115,22,0.8)", size: 6, dur: "10.2s", begin: "-7s",  label: "PIA" },
];

const CORNERS = [
  { x: 120, y: 330, name: "Sainte Devote" },
  { x: 488, y: 195, name: "Casino" },
  { x: 510, y: 290, name: "Massenet" },
  { x: 575, y: 100, name: "Mirabeau" },
  { x: 640, y: 130, name: "Grand Hotel" },
  { x: 660, y: 310, name: "Tunnel" },
  { x: 350, y: 410, name: "Nouvelle Chicane" },
  { x: 200, y: 410, name: "Tabac" },
  { x: 155, y: 555, name: "Swimming Pool" },
  { x: 200, y: 690, name: "Rascasse" },
  { x: 90,  y: 710, name: "Antony Noghes" },
];

function MonacoCircuit() {
  return (
    <div className="relative w-[480px] h-[520px]">
      {/* Red ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-f1-red/[0.04] rounded-full blur-[100px]" />

      <svg viewBox="40 80 680 660" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {CARS.map((car, i) => (
            <filter key={i} id={`carGlow${i}`} x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
            </filter>
          ))}
          <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e10600" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e10600" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Track outer glow */}
        <path d={MONACO_PATH} fill="none" stroke="rgba(225,6,0,0.03)" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" />

        {/* Track surface (dark asphalt) */}
        <path d={MONACO_PATH} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />

        {/* Track inner (cut out to show bg) */}
        <path d={MONACO_PATH} fill="none" stroke="#0d1117" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />

        {/* Track road surface */}
        <path d={MONACO_PATH} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />

        {/* Center racing line (dashed) */}
        <path d={MONACO_PATH} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="8 10" strokeLinecap="round" strokeLinejoin="round" />

        {/* Animated red sweep along the track */}
        <path d={MONACO_PATH} fill="none" stroke="url(#sweepGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200 3000" opacity="0.35">
          <animate attributeName="stroke-dashoffset" values="0;-3200" dur="10s" repeatCount="indefinite" />
        </path>

        {/* Start/finish line near Antony Noghes */}
        <line x1="98" y1="645" x2="112" y2="660" stroke="#e10600" strokeWidth="4" />
        <line x1="100" y1="648" x2="114" y2="663" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Corner markers + labels */}
        {CORNERS.map((c, i) => (
          <g key={i} opacity="0.6">
            <circle cx={c.x} cy={c.y} r="2.5" fill="rgba(255,255,255,0.25)" />
            <text
              x={c.x + 10}
              y={c.y + 4}
              fill="rgba(255,255,255,0.22)"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
            >
              {c.name}
            </text>
          </g>
        ))}

        {/* Racing cars animating along the real circuit */}
        {CARS.map((car, i) => (
          <g key={i}>
            {/* Outer glow */}
            <circle r={car.size + 6} fill={car.color} opacity="0.12" filter={`url(#carGlow${i})`}>
              <animateMotion dur={car.dur} begin={car.begin} repeatCount="indefinite" rotate="auto" path={MONACO_PATH} />
            </circle>
            {/* Inner glow */}
            <circle r={car.size + 2} fill={car.color} opacity="0.25" filter={`url(#carGlow${i})`}>
              <animateMotion dur={car.dur} begin={car.begin} repeatCount="indefinite" rotate="auto" path={MONACO_PATH} />
            </circle>
            {/* Car dot */}
            <circle r={car.size / 2 + 1} fill={car.color} style={{ filter: `drop-shadow(0 0 8px ${car.glow})` }}>
              <animateMotion dur={car.dur} begin={car.begin} repeatCount="indefinite" rotate="auto" path={MONACO_PATH} />
            </circle>
            {/* White center dot */}
            <circle r="1.5" fill="white" opacity="0.9">
              <animateMotion dur={car.dur} begin={car.begin} repeatCount="indefinite" rotate="auto" path={MONACO_PATH} />
            </circle>
          </g>
        ))}

        {/* Circuit name watermark */}
        <text x="250" y="500" fill="rgba(255,255,255,0.04)" fontSize="28" fontFamily="Inter, sans-serif" fontWeight="900" letterSpacing="0.15em">
          MONACO
        </text>
      </svg>

      {/* Speed badge */}
      <div className="absolute top-4 right-0 bg-f1-card border border-f1-border px-4 py-2 rounded shadow-lg">
        <span className="text-sm font-bold text-yellow-400 font-mono">350 KM/H</span>
      </div>

      {/* Driver legend */}
      <div className="absolute top-4 left-0 bg-f1-card/90 border border-f1-border rounded px-3 py-2 flex flex-col gap-1">
        {CARS.map((car, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: car.color, boxShadow: `0 0 6px ${car.glow}` }} />
            <span className="text-[9px] font-bold text-gray-400 font-mono">{car.label}</span>
          </div>
        ))}
      </div>

      {/* Circuit name badge */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-f1-card/90 border border-f1-border px-4 py-1.5 rounded flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-f1-red rounded-full animate-pulse" />
        <span className="text-[10px] text-gray-400 font-mono tracking-wider">CIRCUIT DE MONACO</span>
      </div>
    </div>
  );
}
