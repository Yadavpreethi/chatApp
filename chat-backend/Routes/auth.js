const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/Users');




dotenv.config();
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    console.log("Register Route Hit");
    console.log(req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});

// Login Route
// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("🔐 Login Request Received");
  console.log("📨 Email:", email);
  console.log("📨 Password:", password);

  if (!email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    console.log("👤 User Found:", user);

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials (user not found)" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials (wrong password)" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("✅ Token Generated:", token);

    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
});



module.exports = router;
