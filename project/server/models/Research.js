const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema({
  username: { type: String, required: true },
  project: { type: String, required: true },
  title: { type: String, default: "" },
  type: { type: String, enum: ["text", "image", "pdf", "video", "link", ""], default: "" },
  content: { type: String, default: "" },
  file: {
    name: { type: String },
    type: { type: String },
    data: { type: String },
  },
  saved: { type: Boolean, default: false },
  description: { type: String, default: "" },
});

module.exports = mongoose.model("Research", researchSchema);
