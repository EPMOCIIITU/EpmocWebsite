const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  coverImage: {
    type: String,
    // Store URL from Cloudinary/AWS S3
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'past'],
    default: 'upcoming',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);
