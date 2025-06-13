const mongoose = require("mongoose");

const NodeSchema = new mongoose.Schema({
  id: String,
  position: {
    x: Number,
    y: Number
  },
  data: {
    title: String,
    character: mongoose.Schema.Types.Mixed
  }
}, { _id: false });

const EdgeSchema = new mongoose.Schema({
  id: String,
  source: String,
  target: String,
  animated: Boolean,
  style: mongoose.Schema.Types.Mixed
}, { _id: false });

const systemSchema = new mongoose.Schema({
  username: { type: String, required: true },
  project: { type: String, required: true },
  name: String,
  nodes: [NodeSchema],
  edges: [EdgeSchema],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SystemHierarchy", systemSchema);
