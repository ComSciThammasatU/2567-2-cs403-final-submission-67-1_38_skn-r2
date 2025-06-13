const mongoose = require("mongoose");

const manuscriptSchema = new mongoose.Schema({
  username: { type: String, required: true },
  project: String,
  title: String,
  content: String,
  timestamp: Date
});

module.exports = mongoose.model("Manuscript", manuscriptSchema);
