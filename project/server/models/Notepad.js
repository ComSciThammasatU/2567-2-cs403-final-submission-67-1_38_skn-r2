const mongoose = require("mongoose");
const notepadSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notepad", notepadSchema);
