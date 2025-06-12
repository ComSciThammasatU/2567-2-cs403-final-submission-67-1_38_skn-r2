const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// POST - บันทึกหรืออัปเดตไอเทม
router.post("/", async (req, res) => {
  const { username, project, title, note, links, images, pdfs, videos, textBlocks } = req.body;

  if (!username || !project || !title) {
    return res.status(400).json({ error: "Missing username, project, or title" });
  }

  try {
    const existing = await Item.findOne({ username, project, title });

    if (existing) {
      // อัปเดตข้อมูลเดิม
      existing.note = note;
      existing.links = links;
      existing.images = images;
      existing.pdfs = pdfs;
      existing.videos = videos;
      existing.textBlocks = textBlocks;
      await existing.save();
      return res.json({ message: "✅ อัปเดตไอเทมแล้ว", item: existing });
    }

    const item = new Item({ username, project, title, note, links, images, pdfs, videos, textBlocks });
    await item.save();
    res.status(201).json({ message: "✅ สร้างไอเทมใหม่แล้ว", item });
  } catch (err) {
    res.status(500).json({ error: "❌ บันทึกไม่สำเร็จ", detail: err.message });
  }
});

// GET - ดึงรายการไอเทมของผู้ใช้ในโปรเจกต์นั้น
router.get("/", async (req, res) => {
  const { username, project } = req.query;

  if (!username || !project) {
    return res.status(400).json({ error: "Missing username or project" });
  }

  try {
    const items = await Item.find({ username, project });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "❌ ดึงข้อมูลไม่สำเร็จ", detail: err.message });
  }
});

// DELETE - ลบไอเทมตามชื่อ
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "ไม่พบไอเทมนี้" });
    res.json({ message: "✅ ลบไอเทมแล้ว", item: deleted });
  } catch (err) {
    res.status(500).json({ error: "❌ ลบไม่สำเร็จ", detail: err.message });
  }
});

module.exports = router;
