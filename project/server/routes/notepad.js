const express = require("express");
const router = express.Router();
const Notepad = require("../models/Notepad");

router.post("/notepad", async (req, res) => {
  const { username, content } = req.body;
  if (!username) return res.status(400).json({ error: "Missing username" });

  try {
    await Notepad.findOneAndUpdate(
      { username },
      { content, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ message: "✅ บันทึกสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "❌ บันทึกล้มเหลว", detail: err.message });
  }
});

router.get("/notepad", async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "Missing username" });

  try {
    const note = await Notepad.findOne({ username });
    res.json(note || {});
  } catch (err) {
    res.status(500).json({ error: "❌ ไม่สามารถดึงข้อมูลได้", detail: err.message });
  }
});

module.exports = router;