const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['core', 'head', 'member', 'participant'],
    default: 'participant',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
