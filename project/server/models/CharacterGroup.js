const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  username: String,
  project: String,
  clanName: String,
  description: String,
  images: [{ url: String, name: String }],
  note: String,
  links: [String],
});

module.exports = mongoose.model("CharacterGroup", groupSchema);
