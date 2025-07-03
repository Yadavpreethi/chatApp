const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true }
}, { timestamps: true });

// ✅ Make sure it's exporting with model name 'User'
module.exports = mongoose.model('User', UserSchema);
