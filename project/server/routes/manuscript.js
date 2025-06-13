const express = require("express");
const router = express.Router();
const Manuscript = require("../models/Manuscript");

// POST: save or update manuscript chapter
router.post("/manuscript", async (req, res) => {
  const { username, project, title, content } = req.body;

  if (!username || !project || !title) {
    return res.status(400).json({ error: "Missing username, project, or title" });
  }

  try {
    const updated = await Manuscript.findOneAndUpdate(
      { username, title, project },
      { content, timestamp: new Date() },
      { upsert: true, new: true }
    );
    res.json({ message: "✅ บันทึกบทสำเร็จแล้ว", manuscript: updated });
  } catch (err) {
    res.status(500).json({ error: "❌ บันทึกล้มเหลว", detail: err.message });
  }
});

// GET: get all manuscripts for a user/project
router.get("/manuscript", async (req, res) => {
  const { username, project } = req.query;

  if (!username || !project) {
    return res.status(400).json({ error: "Missing username or project" });
  }

  try {
    const results = await Manuscript.find({ username, project });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "❌ ไม่สามารถดึงข้อมูลได้", detail: err.message });
  }
});

// DELETE: ลบบทตาม id
router.delete("/manuscript/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Manuscript.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: "ไม่พบบทที่ต้องการลบ" });
    }
    res.json({ message: "✅ ลบบทสำเร็จแล้ว" });
  } catch (err) {
    res.status(500).json({ error: "❌ ลบล้มเหลว", detail: err.message });
  }
});

module.exports = router;
