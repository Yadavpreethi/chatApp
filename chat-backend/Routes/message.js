const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const Conversation = require("../models/Conversation"); // ✅ Needed for delete route
const verifyToken = require("../middleware/authMiddleware");

// 📥 GET /api/get-messages?cid=conversationId
router.get("/get-messages", verifyToken, async (req, res) => {
  const { cid } = req.query;

  if (!cid) {
    return res.status(400).json({ msg: "Conversation ID missing" });
  }

  try {
    const messageList = await Message.find({ cid }).sort({ createdAt: 1 });
    res.status(200).json({ messageList });
  } catch (error) {
    console.error("❌ Error fetching messages:", error.message);
    res.status(500).json({ msg: "Server error while fetching messages" });
  }
});

// 📤 POST /api/send-message
router.post("/send-message", verifyToken, async (req, res) => {
  const { cid, uid, content, username } = req.body;

  if (!cid || !uid || !content || !username) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newMessage = new Message({
      cid,
      uid,
      content,
      username,
    });

    await newMessage.save();
    res.status(201).json({ newMessage });
  } catch (error) {
    console.error("❌ Error sending message:", error.message);
    res.status(500).json({ msg: "Failed to send message" });
  }
});

// 🗑️ DELETE /api/delete-message
router.delete("/delete-message", verifyToken, async (req, res) => {
  const { messageId, conversationId } = req.body;

  if (!messageId || !conversationId) {
    return res.status(400).json({ msg: "Missing messageId or conversationId" });
  }

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }

    const message = await Message.findById(messageId);

    // ✅ Check if the user trying to delete is the sender
    if (!message || message.uid.toString() !== req.userId) {
      return res.status(403).json({ msg: "Unauthorized or message not found" });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ msg: "Message deleted", messageId });
  } catch (err) {
    console.error("❌ Error deleting message:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
