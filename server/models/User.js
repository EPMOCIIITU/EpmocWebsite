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
  name: { type: String, default: '' },
  rollNo: { type: String, default: '' },
  branch: { type: String, default: '' },
  department: { type: String, default: '' },
  year: { type: String, default: '' },
  role: {
    type: String,
    enum: ['core', 'head', 'member', 'participant'],
    default: 'participant',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
