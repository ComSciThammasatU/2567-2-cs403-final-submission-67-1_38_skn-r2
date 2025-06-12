
require("dotenv").config();
console.log("🔥 server.js loaded: ", __dirname);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const characterRoutes = require("./routes/character");
const manuscriptRoutes = require("./routes/manuscript");
const timelineRoutes = require("./routes/timeline");
const groupRoutes = require("./routes/group");
const relationshipRoutes = require("./routes/relationship");
const notepadRoutes = require("./routes/notepad");
const worldRoutes = require("./routes/world");
const systemRoutes = require("./routes/system");
const researchRoutes = require('./routes/research');
const itemRoutes = require("./routes/item");
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api", authRoutes);
app.use("/api", projectRoutes);
app.use("/api", characterRoutes);
app.use("/api", manuscriptRoutes);
app.use("/api", timelineRoutes);
app.use("/api", groupRoutes);
app.use("/api", relationshipRoutes);
app.use("/api", notepadRoutes);
app.use("/api", worldRoutes);
app.use("/api", systemRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/item", itemRoutes);



mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));
