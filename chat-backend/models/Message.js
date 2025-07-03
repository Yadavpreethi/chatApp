const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    cid: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    uid: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user ID
    ofUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // for frontend checks
    content: { type: String, required: true },
    username: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
