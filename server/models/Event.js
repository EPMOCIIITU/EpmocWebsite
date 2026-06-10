const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  coverImage: {
    type: String,
    // Will store cloud URL (Google Drive / S3)
  },
  // --- Team Constraints ---
  requiresTeam: {
    type: Boolean,
    default: false,
  },
  minTeamSize: {
    type: Number,
    default: 1,
  },
  maxTeamSize: {
    type: Number,
    default: 1,
  },
  // --- Details ---
  description: {
    type: String,
    default: '',
  },
  venue: {
    type: String,
    default: '',
  },
  driveGalleryLink: {
    type: String,
    default: '',
  },
  // --- Integrations ---
  googleSheetId: {
    type: String,
  },
  driveFolderId: {
    type: String,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);
