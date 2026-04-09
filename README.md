# F1 Live — Race Companion

Real-time F1 race intelligence dashboard. Your second screen for race day.

## Structure

```
frontend/   — React + Tailwind dashboard (desktop & mobile)
backend/    — Node.js API server (fetches & merges OpenF1 data)
```

## Quick Start

### Backend
```bash
cd backend
npm install
node server.js
# Runs on http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## Features

- Live leaderboard with momentum indicators, DRS detection, pit window alerts
- Key Insights panel — auto-generated strategy intelligence
- Battle Detection — highlights close fights and DRS opportunities
- Full history — browse every session from 2023 onwards
- Mobile-optimized layout with swipeable cards
- 15-second auto-refresh with in-memory caching

## Powered by

- [OpenF1 API](https://openf1.org) for live and historical F1 data
- React, Tailwind CSS, Express.js
