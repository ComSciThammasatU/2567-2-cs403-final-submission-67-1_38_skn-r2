const express = require("express");
const router = express.Router();
const Relationship = require("../models/RelationshipGraph");

// GET: ดึงความสัมพันธ์ของ user ตามโปรเจกต์
router.get("/relationships", async (req, res) => {
  const { username, project } = req.query;

  if (!username || !project) return res.status(400).json({ error: "Username and project are required" });

  try {
    const data = await Relationship.find({ username, project });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch relationships", detail: err.message });
  }
});

// POST: บันทึกหรืออัปเดตความสัมพันธ์
router.post("/relationships", async (req, res) => {
  const { username, project, name, nodes, edges } = req.body;

  if (!username || !project || !name || !Array.isArray(nodes) || !Array.isArray(edges)) {
    return res.status(400).json({ error: "Missing or invalid data" });
  }

  try {
    await Relationship.findOneAndUpdate(
      { username, project, name },
      { nodes, edges, timestamp: new Date() },
      { upsert: true }
    );

    res.json({ message: "✅ Saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "❌ Save failed", detail: err.message });
  }
});
// DELETE: ลบกราฟความสัมพันธ์ตามชื่อกราฟ + username + project
router.delete("/relationships/:name", async (req, res) => {
  const { username, project } = req.query;
  const name = req.params.name;

  if (!username || !project || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await Relationship.findOneAndDelete({ username, project, name });
    if (!result) {
      return res.status(404).json({ error: "ไม่พบกราฟที่ต้องการลบ" });
    }
    res.json({ message: "✅ ลบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "❌ ลบไม่สำเร็จ", detail: err.message });
  }
});

module.exports = router;
