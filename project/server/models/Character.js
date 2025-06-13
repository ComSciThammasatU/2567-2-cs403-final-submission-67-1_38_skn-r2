const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
  username: { type: String, required: true },
    project: { type: String, required: true },
  name: String,
  gender: String,
  age: String,
  backstory: String,
  relations: [String],
  traits: [{ name: String, description: String }],
  personality: [{ name: String, description: String }],
  links: [String],
  image: String, // base64 string
  clan: String
}, { timestamps: true });

module.exports = mongoose.model("Character", characterSchema);
