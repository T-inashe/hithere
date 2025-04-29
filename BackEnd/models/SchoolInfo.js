const mongoose = require('mongoose');

const schoolInfoSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  institution: String,
  department: String,
  role: String, // e.g. 'Bachelor', 'Masters'
  experience: String, // e.g. 'PhD', 'Honours'
  researchArea: String
}, { timestamps: true });

module.exports = mongoose.model('SchoolInfo', schoolInfoSchema);
