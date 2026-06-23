const mongoose = require('mongoose');

const volunteerApplicationSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  orgName: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  availability: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  opportunityTitle: { type: String, default: "Volunteer Opportunity" },
  date: { type: String },
  location: { type: String },
  loggedHours: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
