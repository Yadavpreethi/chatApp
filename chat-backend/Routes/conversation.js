// routes/conversation.js
const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation"); // FIXED: capital C
const User = require("../models/Users");
const verifyToken = require("../middleware/authMiddleware");

// Create or get conversation
router.get("/conversation", verifyToken, async (req, res) => {
  const { id1, id2 } = req.query;
  if (!id1 || !id2) return res.status(400).json({ msg: "Missing user IDs" });

  try {
    let conversation = await Conversation.findOne({
      members: { $all: [id1, id2] },
    });

    if (!conversation) {
      const user1 = await User.findById(id1);
      const user2 = await User.findById(id2);
      if (!user1 || !user2) return res.status(404).json({ msg: "Users not found" });

      conversation = new Conversation({
        members: [id1, id2],
        firstId: id1,
        secondId: id2,
        firstUserName: user1.name,
        secondUserName: user2.name,
      });

      await conversation.save();
    }

    res.status(200).json({ conversation });
  } catch (err) {
    console.error("❌ Error in /conversation:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all conversations
router.get("/conversation-list", verifyToken, async (req, res) => {
  try {
    const userId = req.query.id;
    const list = await Conversation.find({ members: userId });
    res.status(200).json({ list });
  } catch (err) {
    console.error("❌ Error in /conversation-list:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
