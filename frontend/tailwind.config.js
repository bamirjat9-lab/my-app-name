/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        f1: {
          bg: "#08090d",
          surface: "#0e1018",
          card: "#131620",
          cardLight: "#191d2b",
          elevated: "#1e2235",
          red: "#e10600",
          redGlow: "rgba(225,6,0,0.08)",
          accent: "#252a3a",
          border: "#1e2235",
          borderLight: "#2a3040",
          muted: "#6b7280",
          dim: "#3b4255",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(225,6,0,0.12)",
        "glow-sm": "0 0 10px rgba(225,6,0,0.08)",
        "glow-green": "0 0 12px rgba(34,197,94,0.15)",
        "glow-purple": "0 0 12px rgba(168,85,247,0.15)",
        "glow-cyan": "0 0 12px rgba(34,211,238,0.15)",
        "glow-orange": "0 0 12px rgba(249,115,22,0.15)",
        panel: "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)",
        "panel-hover": "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "card-sheen": "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%)",
      },
    },
  },
  plugins: [],
};
