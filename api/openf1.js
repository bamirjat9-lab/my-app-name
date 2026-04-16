const BASE = "https://api.openf1.org/v1";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJSON(path, retries = 3) {
  const url = `${BASE}${path}`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url);
    if (res.status === 429) {
      const wait = attempt * 1500;
      console.log(`Rate limited on ${path}, retrying in ${wait}ms...`);
      await delay(wait);
      continue;
    }
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`OpenF1 ${res.status}: ${url}`);
    return res.json();
  }
  throw new Error(`OpenF1 rate limit exceeded after ${retries} retries: ${url}`);
}

// Return empty fallback on any error (for optional endpoints)
async function fetchSafe(path) {
  try {
    return await fetchJSON(path);
  } catch {
    return [];
  }
}

function getSession(sessionKey = "latest") {
  return fetchJSON(`/sessions?session_key=${sessionKey}`).then(
    (d) => d[d.length - 1] ?? null
  );
}

function getDrivers(sessionKey) {
  return fetchJSON(`/drivers?session_key=${sessionKey}`).then((list) => {
    const map = {};
    for (const d of list) {
      map[d.driver_number] = {
        number: d.driver_number,
        firstName: d.first_name,
        lastName: d.last_name,
        code: d.name_acronym,
        team: d.team_name,
        teamColour: d.team_colour,
        headshotUrl: d.headshot_url,
      };
    }
    return map;
  });
}

function getPositions(sessionKey) {
  return fetchSafe(`/position?session_key=${sessionKey}`).then((list) => {
    const latest = {};
    for (const p of list) latest[p.driver_number] = p.position;
    return latest;
  });
}

function getIntervals(sessionKey) {
  return fetchSafe(`/intervals?session_key=${sessionKey}`).then((list) => {
    const latest = {};
    for (const i of list) {
      latest[i.driver_number] = {
        gapToLeader: i.gap_to_leader,
        interval: i.interval,
      };
    }
    return latest;
  });
}

function getLaps(sessionKey) {
  return fetchSafe(`/laps?session_key=${sessionKey}`).then((list) => {
    const latest = {};
    for (const l of list) {
      latest[l.driver_number] = {
        lapNumber: l.lap_number,
        lapTime: l.lap_duration,
        sector1: l.duration_sector_1,
        sector2: l.duration_sector_2,
        sector3: l.duration_sector_3,
        speedTrap: l.st_speed,
      };
    }
    return latest;
  });
}

function getStints(sessionKey) {
  return fetchSafe(`/stints?session_key=${sessionKey}`).then((list) => {
    const latest = {};
    for (const s of list) {
      latest[s.driver_number] = {
        compound: s.compound,
        tyreAge: s.tyre_age_at_start + (s.lap_end - s.lap_start),
        stintLaps: s.lap_end - s.lap_start,
      };
    }
    return latest;
  });
}

function getPits(sessionKey) {
  return fetchSafe(`/pit?session_key=${sessionKey}`).then((list) => {
    const byDriver = {};
    for (const p of list) {
      if (!byDriver[p.driver_number]) byDriver[p.driver_number] = [];
      byDriver[p.driver_number].push({
        lap: p.lap_number,
        duration: p.pit_duration,
      });
    }
    return byDriver;
  });
}

function getWeather(meetingKey) {
  return fetchSafe(`/weather?meeting_key=${meetingKey}`).then((list) => {
    const w = list[list.length - 1];
    if (!w) return null;
    return {
      airTemp: w.air_temperature,
      trackTemp: w.track_temperature,
      humidity: w.humidity,
      windSpeed: w.wind_speed,
      windDirection: w.wind_direction,
      rainfall: w.rainfall,
    };
  });
}

function getRaceControl(sessionKey) {
  return fetchSafe(`/race_control?session_key=${sessionKey}`).then((list) =>
    list.slice(-20).map((m) => ({
      timestamp: m.date,
      category: m.category,
      flag: m.flag,
      message: m.message,
      driver: m.driver_number,
    }))
  );
}

// Per-session cache — 30s for "latest", 10min for historic (data doesn't change)
const cache = new Map();
const CACHE_TTL_LIVE = 30_000;
const CACHE_TTL_HISTORIC = 10 * 60 * 1000;

async function getLiveSessionData(sessionKey = "latest") {
  const now = Date.now();
  const cached = cache.get(sessionKey);
  if (cached && now < cached.expiresAt) return cached.data;

  const session = await getSession(sessionKey);
  if (!session) throw new Error("No session found");

  const sk = session.session_key;
  const mk = session.meeting_key;

  // Fire all requests in parallel — fetchSafe won't throw on 404
  const [drivers, positions, intervals, laps, stints, pits, weather, raceControl] =
    await Promise.all([
      getDrivers(sk),
      getPositions(sk),
      getIntervals(sk),
      getLaps(sk),
      getStints(sk),
      getPits(sk),
      getWeather(mk),
      getRaceControl(sk),
    ]);

  const standings = Object.values(drivers)
    .map((d) => ({
      ...d,
      position: positions[d.number] ?? null,
      gap: intervals[d.number] ?? null,
      lastLap: laps[d.number] ?? null,
      tyre: stints[d.number] ?? null,
      pitStops: pits[d.number] ?? [],
    }))
    .sort((a, b) => (a.position ?? 99) - (b.position ?? 99));

  const result = {
    session: {
      key: session.session_key,
      name: session.session_name,
      type: session.session_type,
      circuit: session.circuit_short_name,
      country: session.country_name,
      dateStart: session.date_start,
      dateEnd: session.date_end,
      year: session.year,
    },
    weather,
    raceControl,
    standings,
  };

  const ttl = sessionKey === "latest" ? CACHE_TTL_LIVE : CACHE_TTL_HISTORIC;
  cache.set(sessionKey, { data: result, expiresAt: Date.now() + ttl });
  cache.set(String(sk), { data: result, expiresAt: Date.now() + ttl });

  return result;
}

function listSessions(year, country) {
  let path = "/sessions?";
  if (year) path += `year=${year}&`;
  if (country) path += `country_name=${encodeURIComponent(country)}&`;
  return fetchJSON(path).then((list) =>
    list.map((s) => ({
      key: s.session_key,
      name: s.session_name,
      type: s.session_type,
      circuit: s.circuit_short_name,
      country: s.country_name,
      date: s.date_start,
      year: s.year,
    }))
  );
}

function listMeetings(year) {
  let path = "/meetings?";
  if (year) path += `year=${year}&`;
  return fetchJSON(path).then((list) =>
    list.map((m) => ({
      key: m.meeting_key,
      name: m.meeting_name,
      country: m.country_name,
      circuit: m.circuit_short_name,
      dateStart: m.date_start,
      year: m.year,
    }))
  );
}

module.exports = { getLiveSessionData, getSession, listSessions, listMeetings };
