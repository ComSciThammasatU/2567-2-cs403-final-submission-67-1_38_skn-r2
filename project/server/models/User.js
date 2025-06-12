const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, // เพิ่มบรรทัดนี้
  password: { type: String, required: true },
  otp: String,
  otpExpires: Date,
});

module.exports = mongoose.model("User", userSchema);
