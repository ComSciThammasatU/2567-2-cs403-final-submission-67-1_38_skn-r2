const express = require("express");
const router = express.Router();
const TimelineEvent = require("../models/TimelineEvent");

// GET: ดึง timeline ของ user
router.get("/timeline", async (req, res) => {
  const { username, project } = req.query;
    if (!username || !project)
  return res.status(400).json({ error: "Username and project are required" });

  try {
    const data = await TimelineEvent.find({ username, project });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch timeline", detail: err.message });
  }
});

// POST: เพิ่มหรือแก้ไข event ทั้งหน้า timeline
router.post("/timeline", async (req, res) => {
  const { username, project, page, events } = req.body;
    if (!username || !project || !page || !Array.isArray(events)) {
      return res.status(400).json({ error: "Missing username, project, page, or invalid events" });
    }

  try {
    await TimelineEvent.deleteMany({ username, project, page });
    await TimelineEvent.insertMany(events.map((e) => ({ ...e, username, project, page })));
    res.json({ message: "✅ Timeline saved" });
  } catch (err) {
    res.status(500).json({ error: "❌ Save failed", detail: err.message });
  }
});

// DELETE: ลบ timeline หน้าเดียว
router.delete("/timeline", async (req, res) => {
  const { username, project, page } = req.body;

  if (!username || !project || !page) {
    return res.status(400).json({ error: "Missing username, project, or page" });
  }

  try {
    await TimelineEvent.deleteMany({ username, project, page });
    res.json({ message: "🗑️ Timeline page deleted" });
  } catch (err) {
    res.status(500).json({ error: "❌ Delete failed", detail: err.message });
  }
});

module.exports = router;
