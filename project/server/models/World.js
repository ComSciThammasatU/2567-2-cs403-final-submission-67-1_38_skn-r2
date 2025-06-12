const mongoose = require("mongoose");

const worldSchema = new mongoose.Schema({
  username: { type: String, required: true },
  project: { type: String, required: true }, // ✅ เพิ่มบรรทัดนี้
  title: String,
  textBlocks: [String],
  note: String,
  links: [String],
  images: [{ url: String, name: String }], // <-- เพิ่มตรงนี้
  pdfs: [{ url: String, name: String }],   // <-- และตรงนี้
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("World", worldSchema);

