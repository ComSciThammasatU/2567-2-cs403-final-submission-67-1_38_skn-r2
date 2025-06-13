const express = require("express");
const router = express.Router();
const Character = require("../models/Character");

// POST: create character
router.post("/characters", async (req, res) => {
  const { username,project, name, gender, age, backstory, relations, traits, personality, links, image, clan } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: "Missing required fields: username or name" });
  }

  try {
    const character = new Character({ username,project, name, gender, age, backstory, relations, traits, personality, links, image, clan });
    await character.save();
    res.status(201).json({ message: "✅ Character saved", character });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to save character", detail: err.message });
  }
});

// GET: characters by username
router.get("/characters", async (req, res) => {
  const { username, project } = req.query;
  if (!username || !project)
    return res.status(400).json({ error: "Missing username or project" });

  try {
    const characters = await Character.find({ username, project });
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch characters" });
  }
});


// DELETE: character by ID
router.delete("/characters/:id", async (req, res) => {
  try {
    await Character.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ ลบเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ error: "❌ ลบไม่สำเร็จ", detail: err.message });
  }
});
// PUT: update character by ID
router.put("/characters/:id", async (req, res) => {
  try {
    const updatedChar = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedChar) {
      return res.status(404).json({ error: "ไม่พบตัวละคร" });
    }
    res.json({ message: "✅ อัปเดตตัวละครสำเร็จ", character: updatedChar });
  } catch (err) {
    res.status(500).json({ error: "❌ แก้ไขไม่สำเร็จ", detail: err.message });
  }
});

module.exports = router;
