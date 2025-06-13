const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  username: String,
  project: String,
  title: String,
  note: String,
  links: [String],
  images: [{ url: String, name: String }],
  pdfs: [{ url: String, name: String }],
  videos: [String],
  textBlocks: [String]
}, { timestamps: true });

module.exports = mongoose.model("Item", ItemSchema);
