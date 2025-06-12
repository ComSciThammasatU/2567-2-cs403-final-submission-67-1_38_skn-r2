const express = require("express");
const router = express.Router();
const World = require("../models/World");

router.post("/world", async (req, res) => {
  const { username, project, title, textBlocks, note, links, images, pdfs } = req.body;


  if (!username || !project || !title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await World.findOneAndUpdate(
  { username, project, title },
  { textBlocks, note, links, images, pdfs, updatedAt: new Date() },
  { upsert: true, new: true }
);

    res.json({ message: "✅ ข้อมูลโลกถูกบันทึกแล้ว" });
  } catch (err) {
    res.status(500).json({ error: "❌ ไม่สามารถบันทึกข้อมูลโลกได้", detail: err.message });
  }
});

// GET
router.get("/world", async (req, res) => {
  const { username, project } = req.query;

  if (!username || !project) {
    return res.status(400).json({ error: "Missing username or project" });
  }

  try {
    const data = await World.find({ username, project });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "❌ ไม่สามารถดึงข้อมูลโลกได้", detail: err.message });
  }
});

router.delete("/world/:id", async (req, res) => {
  try {
    await World.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ ลบเรียบร้อยแล้ว" });
  } catch (err) {
    res.status(500).json({ error: "❌ ลบไม่สำเร็จ", detail: err.message });
  }
});


module.exports = router;
