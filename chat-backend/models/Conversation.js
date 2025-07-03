const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    firstId: String,
    secondId: String,
    firstUserName: String,
    secondUserName: String,
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
