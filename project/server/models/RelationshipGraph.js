const mongoose = require("mongoose");

const relationshipSchema = new mongoose.Schema({
  username: { type: String, required: true },
  project: { type: String, required: true },
  name: String,
  nodes: Array,
  edges: Array,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RelationshipGraph", relationshipSchema);
