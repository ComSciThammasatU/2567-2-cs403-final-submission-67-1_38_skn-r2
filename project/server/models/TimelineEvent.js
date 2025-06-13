const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  username: { type: String, required: true },
  project: { type: String, required: true },
  page: { type: String, required: true },
  title: String,
  date: String,
  description: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TimelineEvent", eventSchema);
