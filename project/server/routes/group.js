const express = require("express");
const router = express.Router();
const Group = require("../models/CharacterGroup");

// GET: ดึงกลุ่มทั้งหมดของผู้ใช้
router.get("/groups", async (req, res) => {
  const { username, project } = req.query;

  if (!username || !project)
    return res.status(400).json({ error: "Username and project required" });

  try {
    const groups = await Group.find({ username, project });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch groups", detail: err.message });
  }
});

router.post("/groups", async (req, res) => {
  const {
    username,
    project,
    clanName,
    description,
    textBlocks,
    links,
    images,
    pdfs,
    videos,
  } = req.body;

  if (!username || !clanName || !project) {
    return res.status(400).json({ error: "Missing username, clan name, or project" });
  }

  try {
    const group = new Group({
      username,
      project,
      clanName,
      description,
      textBlocks: textBlocks || [],
      links: links || [],
      images: images || [],
      pdfs: pdfs || [],
      videos: videos || [],
    });

    await group.save();
    res.status(201).json({ message: "✅ Group saved", group });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to save group", detail: err.message });
  }
});



// DELETE: ลบกลุ่มตามชื่อ
router.delete("/groups/:clanName", async (req, res) => {
  const { clanName } = req.params;
  const { username, project } = req.query;

  if (!username || !clanName) {
    return res.status(400).json({ error: "Missing username or clan name" });
  }

  try {
    const deleted = await Group.findOneAndDelete({ username, project, clanName });
    if (!deleted) {
      return res.status(404).json({ error: "ไม่พบ Clan ที่จะลบ" });
    }
    res.json({ message: "✅ ลบ Clan สำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "❌ ลบ Clan ล้มเหลว", detail: err.message });
  }
});


module.exports = router;
