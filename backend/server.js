const express = require("express");
const cors = require("cors");
const { getLiveSessionData, listSessions, listMeetings } = require("./openf1");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// GET /api/session          → latest session (all data merged)
// GET /api/session?key=9574 → specific session by key
app.get("/api/session", async (req, res) => {
  try {
    const sessionKey = req.query.key || "latest";
    const data = await getLiveSessionData(sessionKey);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/meetings?year=2024         → list Grand Prix weekends
app.get("/api/meetings", async (req, res) => {
  try {
    const data = await listMeetings(req.query.year);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/sessions?year=2024&country=Italy → list sessions (filterable)
app.get("/api/sessions", async (req, res) => {
  try {
    const data = await listSessions(req.query.year, req.query.country);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`OpenF1 backend running → http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/session`);
});
