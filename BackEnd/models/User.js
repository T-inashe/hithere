const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  surname: String,
  password: String,
  oauth_provider: String,
  avatar: String,
  role: { type: String, enum: ['Researcher', 'Reviewer'], required: true } // 👈 ADD THIS
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
