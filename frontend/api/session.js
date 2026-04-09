const { getLiveSessionData } = require("./openf1");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  try {
    const sessionKey = req.query.key || "latest";
    const data = await getLiveSessionData(sessionKey);
    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};
