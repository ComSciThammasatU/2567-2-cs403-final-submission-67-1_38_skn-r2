const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  detail: { type: String },
  status: { type: String, default: "ทำต่อ" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);