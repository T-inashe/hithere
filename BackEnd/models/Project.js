const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  creator_email: { type: String, required: true },
  title: String,
  description: String,
  research_goals: String,
  research_area: String,
  start_date: String,
  end_date: String,
  funding_available: Boolean,
  funding_amount: Number,
  collaborators_needed: Number,
  collaborator_roles: String,
  institution: String,
  contact_email: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Project', projectSchema);
