const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: String,
    ref: 'Event',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // The person who actually submitted the form
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    // Optional, only used if the event requires teams
  },
  customData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    // Stores all dynamic form responses
  },
  mediaUrls: [{
    type: String,
    // Array of URLs linking to Google Drive/S3 uploads for this specific registration
  }]
}, {
  timestamps: true,
  collection: 'event_registrations'
});

// Prevent a user from registering for the same event twice
registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
