const express = require("express");
const router = express.Router();
const System = require("../models/SystemHierarchy");

console.log("📡 system.js route file loaded ✅");

// ✅ POST - บันทึกหรืออัปเดตระบบ
router.post("/system", async (req, res) => {
  const { username, project, name, nodes, edges } = req.body;
  if (!username || !project || !name) {
    return res.status(400).json({ error: "Missing username, project or name" });
  }

  try {
    await System.findOneAndUpdate(
      { username, project, name },
      { nodes, edges, timestamp: new Date() },
      { upsert: true }
    );
    res.json({ message: "✅ บันทึกสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "❌ บันทึกล้มเหลว", detail: err.message });
  }
});

// ✅ GET - โหลดระบบทั้งหมดของผู้ใช้และโปรเจค
router.get("/system", async (req, res) => {
  const { username, project } = req.query;
  try {
    const result = await System.find({ username, project });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "❌ โหลดล้มเหลว", detail: err.message });
  }
});

// ✅ DELETE - ลบระบบตาม username + project + name
router.delete("/system/:username/:project/:name", async (req, res) => {
  const { username, project, name } = req.params;
  try {
    const result = await System.findOneAndDelete({ username, project, name });
    if (!result) return res.status(404).json({ error: "❌ ไม่พบระบบนี้" });
    res.json({ message: "✅ ลบระบบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "❌ ลบล้มเหลว", detail: err.message });
  }
});

module.exports = router;
  