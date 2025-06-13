const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// POST /api/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing username, email or password" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();

    res.json({ message: "✅ User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "❌ Registration failed", detail: err.message });
  }
});

// POST /api/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "❌ Login failed", detail: err.message });
  }
});

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/request-reset", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await transporter.sendMail({
      from: `"Taledge Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "รหัส OTP สำหรับรีเซ็ตรหัสผ่านบัญชี Taledge ของคุณ",
      text: `รหัส OTP ของคุณคือ: ${otp}`,
    });

    res.json({ message: "✅ OTP ส่งไปยังอีเมลแล้ว" });
  } catch (err) {
    res.status(500).json({ error: "❌ ส่ง OTP ล้มเหลว", detail: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: "OTP ไม่ถูกต้องหรือหมดอายุ" });
    }

    res.json({ message: "✅ OTP ถูกต้อง" });
  } catch (err) {
    res.status(500).json({ error: "❌ ตรวจสอบ OTP ล้มเหลว", detail: err.message });
  }
});

router.post("/reset-password-with-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: "OTP ไม่ถูกต้องหรือหมดอายุ" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "✅ รีเซ็ตรหัสผ่านเรียบร้อยแล้ว" });
  } catch (err) {
    res.status(500).json({ error: "❌ รีเซ็ตรหัสผ่านล้มเหลว", detail: err.message });
  }
});

module.exports = router;
