const { listSessions } = require("./openf1");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  try {
    const data = await listSessions(req.query.year, req.query.country);
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};
