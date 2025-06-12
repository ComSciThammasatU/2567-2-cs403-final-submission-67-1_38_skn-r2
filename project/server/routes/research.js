const express = require("express");
const router = express.Router();
const Research = require('../models/Research');

// ดึงข้อมูล research ทั้งหมด (สำหรับ username ที่ล็อกอินหรือถ้าไม่ระบุ username ก็อาจดึงทั้งหมดได้)
router.get("/", async (req, res) => {
  try {
    const { username, project } = req.query;
    if (!username || !project) return res.status(400).json({ message: "Missing username or project" });
    const researchData = await Research.find({ username, project });
    res.json(researchData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// สร้าง research panel ใหม่
router.post("/", async (req, res) => {
  try {
    const { username, project } = req.body;
    if (!username || !project) return res.status(400).json({ message: "Missing username or project" });

    const newResearch = new Research(req.body);
    await newResearch.save();
    res.status(201).json(newResearch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// แก้ไข research panel โดย id
router.put("/:id", async (req, res) => {
  try {
    const updatedResearch = await Research.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedResearch) return res.status(404).json({ message: "Research panel not found" });
    res.json(updatedResearch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ลบ research panel โดย id
router.delete("/:id", async (req, res) => {
  try {
    const deletedResearch = await Research.findByIdAndDelete(req.params.id);
    if (!deletedResearch) return res.status(404).json({ message: "Research panel not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
