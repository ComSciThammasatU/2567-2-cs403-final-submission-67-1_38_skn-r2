const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// POST: create project
router.post("/projects", async (req, res) => {
  const { username, title, detail } = req.body;
  if (!username || !title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const project = new Project({ username, title, detail });
    await project.save();
    res.json({ message: "✅ Project saved", project });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to save project", detail: err.message });
  }
});

// GET: all user projects
router.get("/projects", async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "Username is required" });

  try {
    const projects = await Project.find({ username });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch projects" });
  }
});

// PUT: update project
router.put("/projects/:id", async (req, res) => {
  console.log("✅ PUT /projects/:id เรียกใช้แล้ว ID:", req.params.id);

  const { title, detail, status } = req.body;  // รับ title, detail และ status

  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        ...(title !== undefined && { title }),   // ถ้ามี title ให้อัปเดต
        ...(detail !== undefined && { detail }), // ถ้ามี detail ให้อัปเดต
        ...(status !== undefined && { status }), // ถ้ามี status ให้อัปเดต
        updatedAt: new Date()
      },
      { new: true }
    );
    res.json({ message: "✅ Updated", project: updated });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to update", detail: err.message });
  }
});


// DELETE: remove project
router.delete("/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Deleted" });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to delete" });
  }
});

module.exports = router;
