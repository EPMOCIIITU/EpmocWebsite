const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  inviteCode: {
    type: String,
    required: true,
    unique: true,
  },
  eventId: {
    type: String,
    ref: 'Event',
    required: true,
  }
}, {
  timestamps: true,
});

// Note: Preventing a user from being in multiple teams for the same event
// is handled by the Registration model. When a user creates or joins a team,
// a Registration document is created. The unique compound index on 
// { eventId: 1, userId: 1 } in Registration.js strictly prevents duplicates.

module.exports = mongoose.model('Team', teamSchema);
