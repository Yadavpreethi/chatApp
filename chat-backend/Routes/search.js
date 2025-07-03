const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const verifyToken = require("../middleware/authMiddleware");

// GET /api/search?s=keyword
router.get("/search", verifyToken, async (req, res) => {
  const { s } = req.query;
  const searchTerm = s?.trim() || "";

  try {
    const users = await User.find({
      name: { $regex: searchTerm, $options: "i" }, // case-insensitive search
      _id: { $ne: req.userId }, // exclude current user
    }).select("-password"); // exclude password

    res.status(200).json({ result: users });
  } catch (err) {
    console.error("❌ Error in /search:", err);
    res.status(500).json({ msg: "Search failed" });
  }
});

module.exports = router;
